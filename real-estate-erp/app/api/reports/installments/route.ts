import { NextResponse } from 'next/server'
import { buildInstallmentsPdf } from '@/lib/reporting'

// Dynamic import for pdfmake to avoid SSR issues
async function generatePdf(docDefinition: any) {
  const pdfMake = (await import('pdfmake/build/pdfmake')).default
  const pdfFonts = (await import('pdfmake/build/vfs_fonts')).default
  
  pdfMake.vfs = pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfFonts.vfs
  
  return new Promise<Buffer>((resolve, reject) => {
    const pdfDoc = pdfMake.createPdf(docDefinition)
    pdfDoc.getBuffer((buffer: Buffer) => {
      resolve(buffer)
    })
  })
}

export async function GET() {
  try {
    // بناء تعريف PDF
    const docDefinition = await buildInstallmentsPdf()
    
    // توليد PDF
    const pdfBuffer = await generatePdf(docDefinition)
    
    // إرجاع PDF كـ response
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="installments-report-${new Date().toISOString().split('T')[0]}.pdf"`
      }
    })
  } catch (error) {
    console.error('Error generating installments PDF:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في توليد التقرير' },
      { status: 500 }
    )
  }
}