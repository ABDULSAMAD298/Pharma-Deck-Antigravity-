import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: credits } = await supabase
        .from('credits')
        .select('*')
        .eq('user_id', user.id)
        .single()

    const available = (credits?.total_credits ?? 0) - (credits?.used_credits ?? 0)
    if (available <= 0) {
        return NextResponse.json({ error: 'No credits remaining' }, { status: 402 })
    }

    // Deduct credit FIRST using admin client to bypass RLS
    await supabaseAdmin.from('credits').update({
        used_credits: (credits?.used_credits ?? 0) + 1,
        updated_at: new Date().toISOString()
    }).eq('user_id', user.id)

    // Helper to refund credit
    const refundCredit = async () => {
        await supabaseAdmin.from('credits').update({
            used_credits: Math.max((credits?.used_credits ?? 1) - 1, 0),
            updated_at: new Date().toISOString()
        }).eq('user_id', user.id)
    }

    const body = await req.json()
    const { prompt, num_rows = 20, color_theme = 'green' } = body

    if (!prompt?.trim()) {
        return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    const geminiPrompt = `You are a data expert. Generate a professional Excel spreadsheet for a pharmacy student.

User request: ${prompt}
Rows requested: ${num_rows}

Return ONLY valid JSON, no markdown, no explanation, exactly this structure:
{
  "filename": "descriptive_filename_no_spaces",
  "sheets": [
    {
      "name": "Sheet Name",
      "headers": ["Column1", "Column2", "Column3"],
      "rows": [
        ["value1", "value2", "value3"],
        ["value1", "value2", "value3"]
      ]
    }
  ]
}

Rules:
- Maximum 2 sheets
- Headers should be clear and professional
- Fill all ${num_rows} rows with realistic, accurate pharmacy data
- Keep values concise (max 50 chars per cell)
- Return ONLY the JSON object, nothing else`

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
        const result = await model.generateContent(geminiPrompt)
        const responseText = result.response.text()

        // Parse JSON (strip any markdown fences)
        let jsonStr = responseText.trim()
        if (jsonStr.startsWith('```')) {
            jsonStr = jsonStr.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '')
        }

        const geminiJson = JSON.parse(jsonStr)

        // Generate Excel buffer
        const { generateExcel } = await import('@/lib/excel-generator')
        const buffer = generateExcel(geminiJson, color_theme)

        // Upload to Supabase Storage using Admin client to bypass Bucket RLS policies
        const fileName = `${user.id}_${Date.now()}_${geminiJson.filename || 'sheet'}.xlsx`
        const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
            .from('excel-files')
            .upload(fileName, buffer, {
                contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                cacheControl: '3600',
            })

        if (uploadError) {
            console.error('Storage upload error:', uploadError)
            await refundCredit()
            return NextResponse.json({ error: 'Failed to save file. Ensure "excel-files" bucket exists in Supabase.' }, { status: 500 })
        }

        const { data: { publicUrl } } = supabaseAdmin.storage
            .from('excel-files')
            .getPublicUrl(fileName)

        // Save to DB using admin client
        await supabaseAdmin.from('generations').insert({
            user_id: user.id,
            type: 'excel',
            topic: prompt,
            download_url: publicUrl,
            file_name: fileName,
            status: 'completed',
        })

        // Build preview data
        const firstSheet = geminiJson.sheets?.[0]

        return NextResponse.json({
            download_url: publicUrl,
            filename: fileName,
            preview_headers: firstSheet?.headers?.slice(0, 5) ?? [],
            preview_rows: firstSheet?.rows?.slice(0, 3) ?? [],
        })
    } catch (err) {
        console.error('Excel generation error:', err)
        await refundCredit()
        return NextResponse.json({ error: 'Failed to generate Excel sheet' }, { status: 500 })
    }
}
