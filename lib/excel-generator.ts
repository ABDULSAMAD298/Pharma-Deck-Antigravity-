import XLSX from 'xlsx-js-style'

const themeColors: Record<string, { header: string; headerText: string; altRow: string; isDefault?: boolean }> = {
    default: { header: 'FFFFFF', headerText: '000000', altRow: 'FFFFFF', isDefault: true },
    green: { header: '0F172A', headerText: 'FFFFFF', altRow: 'F0FDF4' },
    blue: { header: '1E3A8A', headerText: 'FFFFFF', altRow: 'EFF6FF' },
    purple: { header: '4C1D95', headerText: 'FFFFFF', altRow: 'F5F3FF' },
    black: { header: '000000', headerText: 'FFFFFF', altRow: 'F9FAFB' },
    rose: { header: 'BE123C', headerText: 'FFFFFF', altRow: 'FFF1F2' },
    teal: { header: '0F766E', headerText: 'FFFFFF', altRow: 'F0FDFA' },
}

interface SheetData {
    name: string
    headers: string[]
    rows: (string | number)[][]
}

interface GeminiJson {
    filename?: string
    sheets: SheetData[]
}

export function generateExcel(geminiJson: GeminiJson, colorTheme: string): Buffer {
    const colors = themeColors[colorTheme] || themeColors.green
    const wb = XLSX.utils.book_new()

    geminiJson.sheets.forEach((sheet) => {
        const wsData: unknown[][] = []

        // Header row with styling
        const headerRow = sheet.headers.map((h: string) => ({
            v: h,
            t: 's',
            s: colors.isDefault ? {
                font: { bold: true, color: { rgb: '000000' }, sz: 12 },
                fill: { fgColor: { rgb: 'FFFFFF' } },
                alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
                border: {
                    bottom: { style: 'medium', color: { rgb: '000000' } },
                },
            } : {
                font: { bold: true, color: { rgb: colors.headerText }, sz: 12 },
                fill: { fgColor: { rgb: colors.header } },
                alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
                border: {
                    bottom: { style: 'medium', color: { rgb: '10B981' } },
                },
            },
        }))
        wsData.push(headerRow)

        // Data rows with alternating colors
        sheet.rows.forEach((row: (string | number)[], rowIdx: number) => {
            const isAlt = rowIdx % 2 === 0
            const dataRow = row.map((cell: string | number) => ({
                v: String(cell ?? ''),
                t: 's',
                s: colors.isDefault ? {
                    fill: { fgColor: { rgb: 'FFFFFF' } },
                    alignment: { horizontal: 'left', vertical: 'center', wrapText: true },
                    font: { sz: 11, color: { rgb: '000000' } },
                    border: {
                        bottom: { style: 'thin', color: { rgb: 'CCCCCC' } },
                    },
                } : {
                    fill: { fgColor: { rgb: isAlt ? colors.altRow : 'FFFFFF' } },
                    alignment: { horizontal: 'left', vertical: 'center', wrapText: true },
                    font: { sz: 11 },
                    border: {
                        bottom: { style: 'thin', color: { rgb: 'E2E8F0' } },
                    },
                },
            }))
            wsData.push(dataRow)
        })

        const ws = XLSX.utils.aoa_to_sheet(wsData)

        // Auto column widths
        ws['!cols'] = sheet.headers.map(() => ({ wch: 25 }))
        // Row heights
        ws['!rows'] = [{ hpt: 35 }, ...sheet.rows.map(() => ({ hpt: 25 }))]

        // Sheet names must be <= 31 chars and cannot contain certain characters
        const safeSheetName = (sheet.name || 'Sheet')
            .replace(/[\[\]\*\\\/\?]/g, '')
            .substring(0, 31)

        XLSX.utils.book_append_sheet(wb, ws, safeSheetName)
    })

    return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }) as Buffer
}
