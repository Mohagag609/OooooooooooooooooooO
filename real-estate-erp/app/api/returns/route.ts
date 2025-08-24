import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createReturnSchema = z.object({
  unitId: z.string().min(1, 'الوحدة مطلوبة'),
  reason: z.string().optional(),
  resaleStatus: z.enum(['pending', 'resold']).default('pending')
})

export async function GET() {
  try {
    const returns = await prisma.return.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        unit: true
      }
    })
    
    return NextResponse.json(returns)
  } catch (error) {
    console.error('Error fetching returns:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في جلب البيانات' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // التحقق من البيانات
    const validatedData = createReturnSchema.parse(body)
    
    // التحقق من أن الوحدة مباعة
    const unit = await prisma.unit.findUnique({
      where: { id: validatedData.unitId }
    })
    
    if (!unit) {
      return NextResponse.json(
        { error: 'الوحدة غير موجودة' },
        { status: 404 }
      )
    }
    
    if (unit.status !== 'sold') {
      return NextResponse.json(
        { error: 'يمكن فقط إرجاع الوحدات المباعة' },
        { status: 400 }
      )
    }
    
    // إنشاء سجل الإرجاع
    const returnRecord = await prisma.return.create({
      data: validatedData,
      include: {
        unit: true
      }
    })
    
    // تحديث حالة الوحدة إلى "returned"
    await prisma.unit.update({
      where: { id: validatedData.unitId },
      data: { status: 'returned' }
    })
    
    // إضافة سجل تدقيق
    await prisma.auditLog.create({
      data: {
        action: 'CREATE',
        entity: 'Return',
        entityId: returnRecord.id,
        meta: { 
          unitCode: unit.code,
          reason: validatedData.reason 
        }
      }
    })
    
    return NextResponse.json(returnRecord, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'بيانات غير صحيحة', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Error creating return:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في تسجيل الإرجاع' },
      { status: 500 }
    )
  }
}