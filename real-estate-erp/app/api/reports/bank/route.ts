import { NextResponse } from 'next/server'
import { buildBankExcel } from '@/lib/reporting'

export async function GET() {
  try {
    // بناء ملف Excel
    const workbook = await buildBankExcel()
    
    // تحويل workbook إلى buffer
    const buffer = await workbook.xlsx.writeBuffer()
    
    // إرجاع Excel كـ response
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="bank-report-${new Date().toISOString().split('T')[0]}.xlsx"`
      }
    })
  } catch (error) {
    console.error('Error generating bank Excel:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في توليد التقرير' },
      { status: 500 }
    )
  }
}