import ExcelJS from 'exceljs'

interface ExcelThemeColors {
  headerBg: string
  headerText: string
  altRow: string
  borderColor: string
}

function getThemeColors(theme: string): ExcelThemeColors {
  const themes: Record<string, ExcelThemeColors> = {
    auto:    { headerBg: '6366F1', headerText: 'FFFFFF', altRow: 'EEF2FF', borderColor: 'C7D2FE' },
    medical: { headerBg: '0F172A', headerText: 'FFFFFF', altRow: 'F0FDF4', borderColor: '86EFAC' },
    blue:    { headerBg: '1E3A8A', headerText: 'FFFFFF', altRow: 'EFF6FF', borderColor: '93C5FD' },
    purple:  { headerBg: '4C1D95', headerText: 'FFFFFF', altRow: 'FAF5FF', borderColor: 'C4B5FD' },
    teal:    { headerBg: '134E4A', headerText: 'FFFFFF', altRow: 'F0FDFA', borderColor: '99F6E4' },
    gold:    { headerBg: '0F172A', headerText: 'F59E0B', altRow: 'FFFBEB', borderColor: 'FCD34D' },
    red:     { headerBg: '7F1D1D', headerText: 'FFFFFF', altRow: 'FFF5F5', borderColor: 'FCA5A5' },
    slate:   { headerBg: '1E293B', headerText: 'FFFFFF', altRow: 'F8FAFC', borderColor: 'CBD5E1' },
    indigo:  { headerBg: '1E1B4B', headerText: 'FFFFFF', altRow: 'EEF2FF', borderColor: 'A5B4FC' },
    emerald: { headerBg: '064E3B', headerText: 'FFFFFF', altRow: 'ECFDF5', borderColor: '6EE7B7' },
    black:   { headerBg: '000000', headerText: 'FFFFFF', altRow: 'F9FAFB', borderColor: 'D1D5DB' },
  }
  return themes[theme] || themes.medical
}

export async function generateExcelWithImages(
  geminiJson: any,
  colorTheme: string,
  imageBuffers: { buffer: Buffer; extension: 'png' | 'jpeg'; name: string }[]
): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook()
  workbook.creator = 'PharmaDeck'
  workbook.created = new Date()

  const colors = getThemeColors(colorTheme)

  // ── BUILD DATA SHEETS ──────────────────────────────────────────
  for (const sheet of geminiJson.sheets) {
    const ws = workbook.addWorksheet(sheet.name.substring(0, 31), {
      views: [{ state: 'frozen', ySplit: 1 }],
      pageSetup: { fitToPage: true, fitToHeight: 1, fitToWidth: 1 },
    })

    // Column widths
    const colWidths: number[] = sheet.colWidths || sheet.headers.map(() => 25)
    ws.columns = sheet.headers.map((h: string, i: number) => ({
      header: '',
      key: `col${i}`,
      width: colWidths[i] || 25,
    }))

    // HEADER ROW
    const headerRow = ws.addRow(sheet.headers)
    headerRow.height = 32
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FF' + colors.headerText }, size: 11, name: 'Calibri' }
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF' + colors.headerBg } }
      cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: false }
      cell.border = {
        bottom: { style: 'medium', color: { argb: 'FF' + colors.borderColor } },
        right: { style: 'thin', color: { argb: 'FFFFFFFF' } },
      }
    })

    // DATA ROWS
    sheet.rows.forEach((row: any[], rowIdx: number) => {
      const dataRow = ws.addRow(row.map((cell) => String(cell ?? '')))
      dataRow.height = 28
      const isAlt = rowIdx % 2 === 0
      dataRow.eachCell((cell) => {
        cell.font = { size: 10, name: 'Calibri', color: { argb: 'FF1E293B' } }
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF' + (isAlt ? colors.altRow : 'FFFFFF') },
        }
        cell.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true }
        cell.border = {
          bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          right: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        }
      })
    })
  }

  // ── IMAGES SHEET (only if images uploaded) ────────────────────
  if (imageBuffers.length > 0) {
    const imgSheet = workbook.addWorksheet('📷 Images', {
      views: [{ showGridLines: true }],
    })

    // Header
    imgSheet.columns = [
      { header: '', key: 'label', width: 30 },
      { header: '', key: 'image', width: 40 },
    ]

    const titleRow = imgSheet.addRow(['Uploaded Images / Chemical Structures'])
    titleRow.height = 30
    titleRow.getCell(1).font = {
      bold: true, size: 14, name: 'Calibri',
      color: { argb: 'FF' + colors.headerBg }
    }
    titleRow.getCell(1).fill = {
      type: 'pattern', pattern: 'solid',
      fgColor: { argb: 'FF' + colors.altRow }
    }
    imgSheet.mergeCells(`A1:B1`)

    let currentRow = 2

    for (let i = 0; i < imageBuffers.length; i++) {
      const img = imageBuffers[i]

      // Label row
      const labelRow = imgSheet.addRow([`${i + 1}. ${img.name}`])
      labelRow.height = 20
      labelRow.getCell(1).font = { bold: true, size: 10, name: 'Calibri' }
      labelRow.getCell(1).fill = {
        type: 'pattern', pattern: 'solid',
        fgColor: { argb: 'FF' + colors.headerBg }
      }
      labelRow.getCell(1).font = {
        bold: true, size: 10,
        color: { argb: 'FFFFFFFF' }
      }
      currentRow++

      // Add 15 rows tall space for image
      const imgStartRow = currentRow
      const imgEndRow = currentRow + 14
      for (let r = imgStartRow; r <= imgEndRow; r++) {
        const row = imgSheet.addRow([''])
        row.height = 15
      }

      // Embed image using ExcelJS
      const imageId = workbook.addImage({
        buffer: img.buffer as any,
        extension: img.extension,
      })
      imgSheet.addImage(imageId, {
        tl: { col: 0, row: imgStartRow - 1 } as any,
        br: { col: 2, row: imgEndRow } as any,
        editAs: 'oneCell',
      })

      currentRow = imgEndRow + 1

      // Spacer row between images
      imgSheet.addRow([''])
      currentRow++
    }
  }

  // Return as buffer
  const buf = await workbook.xlsx.writeBuffer()
  return Buffer.from(buf as any)
}
