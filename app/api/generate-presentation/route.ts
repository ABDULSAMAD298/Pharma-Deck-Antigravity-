import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Check credits
    const { data: credits } = await supabase
        .from('credits')
        .select('*')
        .eq('user_id', user.id)
        .single()

    const available = (credits?.total_credits ?? 0) - (credits?.used_credits ?? 0)
    if (available <= 0) {
        return NextResponse.json({ error: 'No credits remaining' }, { status: 402 })
    }

    // Deduct credit immediately FIRST
    await supabaseAdmin.from('credits').update({
        used_credits: (credits?.used_credits ?? 0) + 1,
        updated_at: new Date().toISOString()
    }).eq('user_id', user.id)

    // Helper to refund credit on error
    const refundCredit = async () => {
        await supabaseAdmin.from('credits').update({
            used_credits: Math.max((credits?.used_credits ?? 1) - 1, 0),
            updated_at: new Date().toISOString()
        }).eq('user_id', user.id)
    }

    const body = await req.json()
    const { topic, num_slides, language, template_id } = body

    if (!topic?.trim()) {
        return NextResponse.json({ error: 'Topic is required' }, { status: 400 })
    }

    const payload: Record<string, unknown> = {
        prompt: topic,
        numberOfSlides: Math.min(Math.max(parseInt(num_slides) || 10, 5), 20),
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
            return NextResponse.json({ error: 'SlidesGPT API failed' }, { status: 500 })
        }

        const data = await sgRes.json()
        const presentationId = data.id
        const downloadUrl = data.download

        // Poll for file readiness (max 60 seconds)
        let fileReady = false
        for (let i = 0; i < 6; i++) {
            await new Promise(r => setTimeout(r, 10000))
            try {
                const check = await fetch(downloadUrl, { method: 'HEAD' })
                if (check.ok) { fileReady = true; break }
            } catch { }
        }

        // Save to generations table using admin
        await supabaseAdmin.from('generations').insert({
            user_id: user.id,
            type: 'presentation',
            topic,
            download_url: downloadUrl,
            slides_count: payload.numberOfSlides as number,
            language: language || 'en',
            status: fileReady ? 'completed' : 'processing',
        })

        return NextResponse.json({
            download_url: downloadUrl,
            presentation_id: presentationId,
            ready: fileReady,
        })
    } catch (err) {
        console.error('Presentation generation error:', err)
        await refundCredit()
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
