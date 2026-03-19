import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { getPlanLimits } from '@/lib/plans'

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Check credits and plan
    const { data: credits } = await supabase
        .from('credits')
        .select('*')
        .eq('user_id', user.id)
        .single()

    const available = (credits?.total_credits ?? 0) - (credits?.used_credits ?? 0)
    if (available <= 0) {
        return NextResponse.json({ error: 'No credits remaining' }, { status: 402 })
    }

    const planName = credits?.plan_name || 'free'
    const limits = getPlanLimits(planName)

    // Parse FormData
    const formData = await req.formData()
    const topic = formData.get('topic') as string
    const num_slides = formData.get('num_slides') as string
    const template_id = formData.get('template_id') as string
    const language = (formData.get('language') as string) || 'en'
    const files = formData.getAll('files') as File[]

    if (!topic?.trim()) {
        return NextResponse.json({ error: 'Topic is required' }, { status: 400 })
    }

    // Enforce file upload limit
    if (!limits.fileUpload && files.length > 0) {
        return NextResponse.json(
            { error: 'File upload requires Starter or Pro plan' },
            { status: 403 }
        )
    }

    // Enforce max slides
    const requestedSlides = parseInt(num_slides) || 10
    const allowedSlides = Math.min(requestedSlides, limits.maxSlides)

    // Deduct credit
    await supabaseAdmin.from('credits').update({
        used_credits: (credits?.used_credits ?? 0) + 1,
        updated_at: new Date().toISOString()
    }).eq('user_id', user.id)

    // Admin helper for error cases
    const refundCredit = async () => {
        await supabaseAdmin.from('credits').update({
            used_credits: Math.max((credits?.used_credits ?? 1) - 1, 0),
            updated_at: new Date().toISOString()
        }).eq('user_id', user.id)
    }

    // If files are present, extract text using Gemini (optional, but good for context)
    let finalPrompt = topic
    if (files.length > 0) {
        // Limited to first few files for context
        finalPrompt += "\n\nCONTEXT FROM UPLOADED FILES:\n(Please incorporate these notes into the presentation summary and slides)"
        // Note: For now we just mention that files were uploaded. 
        // In a real implementation we'd use Gemini to extract text from PDFs/Images here.
    }

    const payload: Record<string, unknown> = {
        prompt: finalPrompt,
        numberOfSlides: allowedSlides,
    }
    if (template_id) payload.templateId = template_id
    if (language && language !== 'en') payload.language = language

    try {
        const sgRes = await fetch('https://api.slidesgpt.com/v1/presentations/generate', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.SLIDESGPT_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })

        if (!sgRes.ok) {
            const errText = await sgRes.text()
            console.error('SlidesGPT error:', errText)
            await refundCredit()
            return NextResponse.json({ error: 'SlidesGPT API failed. Credit refunded.' }, { status: 500 })
        }

        const data = await sgRes.json()
        const presentationId = data.id
        const downloadUrl = data.download

        // Save to generations table using admin
        await supabaseAdmin.from('generations').insert({
            user_id: user.id,
            type: 'presentation',
            topic,
            download_url: downloadUrl,
            slides_count: allowedSlides,
            status: 'completed',
        })

        return NextResponse.json({
            download_url: downloadUrl,
            presentation_id: presentationId,
            ready: true,
        })
    } catch (err) {
        console.error('Presentation generation error:', err)
        await refundCredit()
        return NextResponse.json({ error: 'Internal server error. Credit refunded.' }, { status: 500 })
    }
}
