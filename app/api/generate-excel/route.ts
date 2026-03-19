import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { generateExcelWithImages } from '@/lib/excel-generator'
import { createClient } from '@supabase/supabase-js'
import { getPlanLimits } from '@/lib/plans'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function getThemeInstruction(theme: string, prompt: string): string {
  if (theme === 'auto') {
    return `Also decide the best color scheme for this content.
    Add "headerColor" (dark 6-char hex) and "altRowColor" (very light 6-char hex)
    to your JSON response that best matches this pharmacy/medical topic: "${prompt}"`
  }
  const colorMap: Record<string, { headerColor: string; altRowColor: string }> = {
    medical: { headerColor: '0F172A', altRowColor: 'F0FDF4' },
    blue:    { headerColor: '1E3A8A', altRowColor: 'EFF6FF' },
    purple:  { headerColor: '4C1D95', altRowColor: 'FAF5FF' },
    teal:    { headerColor: '134E4A', altRowColor: 'F0FDFA' },
    gold:    { headerColor: '0F172A', altRowColor: 'FFFBEB' },
    red:     { headerColor: '7F1D1D', altRowColor: 'FFF5F5' },
    slate:   { headerColor: '1E293B', altRowColor: 'F8FAFC' },
    indigo:  { headerColor: '1E1B4B', altRowColor: 'EEF2FF' },
    emerald: { headerColor: '064E3B', altRowColor: 'ECFDF5' },
    black:   { headerColor: '000000', altRowColor: 'F9FAFB' },
  }
  const c = colorMap[theme] || colorMap.medical
  return `Use headerColor: "${c.headerColor}" and altRowColor: "${c.altRowColor}" in your JSON.`
}

export async function POST(req: Request) {
  // Auth check
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Credits check
  const { data: credits } = await supabase
    .from('credits').select('*').eq('user_id', user.id).single()
  if (!credits || (credits.total_credits - credits.used_credits) <= 0) {
    return NextResponse.json({ error: 'No credits remaining' }, { status: 402 })
  }

  const planName = credits.plan_name || 'free'
  const limits = getPlanLimits(planName)

  // Parse FormData
  const formData = await req.formData()
  const userPrompt = (formData.get('prompt') as string) || ''
  const numRows = Math.min(100, parseInt(formData.get('numRows') as string) || 20)
  const colorTheme = (formData.get('colorTheme') as string) || 'medical'
  const filesList = formData.getAll('files') as File[]

  if (!userPrompt.trim()) {
    return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
  }

  // Enforce file upload
  if (!limits.fileUpload && filesList.length > 0) {
    return NextResponse.json(
      { error: 'File upload requires Starter or Pro plan' },
      { status: 403 }
    )
  }

  // Enforce max files and max images
  const allowedDocFiles = filesList.filter(f => !f.type.startsWith('image/')).slice(0, limits.maxFiles)
  const allowedImageFiles = filesList.filter(f => f.type.startsWith('image/')).slice(0, limits.maxImages)
  
  // Deduct credit
  await supabase.from('credits')
    .update({ used_credits: (credits.used_credits || 0) + 1, updated_at: new Date().toISOString() })
    .eq('user_id', user.id)

  // Convert files to base64 for Gemini
  const fileParts: any[] = []
  for (const file of [...allowedDocFiles, ...allowedImageFiles]) {
    const bytes = await file.arrayBuffer()
    const base64 = Buffer.from(bytes).toString('base64')
    fileParts.push({
      inlineData: { data: base64, mimeType: file.type }
    })
  }

  const themeInstruction = getThemeInstruction(colorTheme, userPrompt)

  const geminiPrompt = `You are a professional spreadsheet designer for pharmacy students.

${fileParts.length > 0 ? `The user has uploaded ${fileParts.length} file(s). Read all content from them and include relevant data in the spreadsheet.` : ''}

Create an Excel spreadsheet for: "${userPrompt}"
Rows: ${numRows}
${themeInstruction}

STRICT RULES:
1. Return ONLY valid JSON. Zero markdown. Zero explanation. Zero code blocks.
2. Keep ALL cell values SHORT — max 45 characters per cell.
3. Split long content into multiple columns — never one long sentence in one cell.
4. Use standard abbreviations (MOA, PK, PD, IV, PO, bid, tid, etc.)
5. Maximum 6 columns per sheet.
6. Maximum 2 sheets total.
7. Fill exactly ${numRows} data rows with realistic pharmacy data.
8. Column headers must be short (max 20 chars).

Return ONLY this JSON structure, nothing else:
{
  "filename": "descriptive_name_no_spaces",
  "headerColor": "0F172A",
  "altRowColor": "F0FDF4",
  "sheets": [
    {
      "name": "Sheet Name",
      "headers": ["Col 1", "Col 2", "Col 3"],
      "colWidths": [22, 28, 35],
      "rows": [
        ["val", "val", "val"]
      ]
    }
  ]
}`

  let geminiJson: any
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    const result = await model.generateContent(
      fileParts.length > 0
        ? [...fileParts, { text: geminiPrompt }]
        : [{ text: geminiPrompt }]
    )
    let raw = result.response.text().trim()
    raw = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    geminiJson = JSON.parse(raw)
  } catch (err) {
    return NextResponse.json({ error: 'AI generation failed. Try a simpler prompt.' }, { status: 500 })
  }

  // Process uploaded IMAGES for embedding into Excel
  const imageBuffers: { buffer: Buffer; extension: 'png' | 'jpeg'; name: string }[] = []
  for (const imgFile of allowedImageFiles) {
    const bytes = await imgFile.arrayBuffer()
    const ext = imgFile.type.includes('png') ? 'png' : 'jpeg'
    imageBuffers.push({
      buffer: Buffer.from(bytes),
      extension: ext,
      name: imgFile.name.replace(/\.[^/.]+$/, ''),
    })
  }

  // Generate Excel file
  let excelBuffer: Buffer
  try {
    excelBuffer = await generateExcelWithImages(geminiJson, colorTheme, imageBuffers)
  } catch (err) {
    return NextResponse.json({ error: 'Excel generation failed.' }, { status: 500 })
  }

  // Upload to Supabase Storage
  const fileName = `${geminiJson.filename || 'pharma-sheet'}-${Date.now()}.xlsx`
  const filePath = `${user.id}/${fileName}`

  const { error: uploadError } = await supabaseAdmin.storage
    .from('excel-files')
    .upload(filePath, excelBuffer, {
      contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      upsert: true,
    })

  if (uploadError) {
    return NextResponse.json({ error: 'File upload failed.' }, { status: 500 })
  }

  const { data: urlData } = supabaseAdmin.storage
    .from('excel-files')
    .getPublicUrl(filePath)

  // Save to generations table
  await supabase.from('generations').insert({
    user_id: user.id,
    type: 'excel',
    topic: userPrompt.substring(0, 200),
    download_url: urlData.publicUrl,
    file_name: fileName,
    status: 'completed',
  })

  return NextResponse.json({
    download_url: urlData.publicUrl,
    filename: fileName,
    sheets: geminiJson.sheets.length,
    rows: numRows,
    has_images: imageBuffers.length > 0,
    image_count: imageBuffers.length,
  })
}
