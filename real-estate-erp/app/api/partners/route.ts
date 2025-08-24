import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Schema للتحقق من البيانات
const createPartnerSchema = z.object({
  name: z.string().min(1, 'اسم الشريك مطلوب'),
  phone: z.string().optional(),
  note: z.string().optional()
})

export async function GET() {
  try {
    const partners = await prisma.partner.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { projects: true }
        }
      }
    })
    
    return NextResponse.json(partners)
  } catch (error) {
    console.error('Error fetching partners:', error)
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
    const validatedData = createPartnerSchema.parse(body)
    
    const partner = await prisma.partner.create({
      data: validatedData,
      include: {
        _count: {
          select: { projects: true }
        }
      }
    })
    
    // إضافة سجل تدقيق
    await prisma.auditLog.create({
      data: {
        action: 'CREATE',
        entity: 'Partner',
        entityId: partner.id,
        meta: { name: partner.name }
      }
    })
    
    return NextResponse.json(partner, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'بيانات غير صحيحة', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Error creating partner:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في إنشاء الشريك' },
      { status: 500 }
    )
  }
}