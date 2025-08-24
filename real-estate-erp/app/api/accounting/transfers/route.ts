import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createCashTransfer } from '@/lib/accounting'
import { prisma } from '@/lib/prisma'

const transferSchema = z.object({
  date: z.string().transform(str => new Date(str)),
  fromCashboxId: z.string(),
  toCashboxId: z.string(),
  amount: z.number().positive('المبلغ يجب أن يكون موجب'),
  note: z.string().optional()
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = transferSchema.parse(body)
    
    // التحقق من عدم التحويل لنفس الخزنة
    if (validatedData.fromCashboxId === validatedData.toCashboxId) {
      return NextResponse.json(
        { error: 'لا يمكن التحويل من وإلى نفس الخزنة' },
        { status: 400 }
      )
    }
    
    const transfer = await createCashTransfer({
      date: validatedData.date,
      fromCashboxId: validatedData.fromCashboxId,
      toCashboxId: validatedData.toCashboxId,
      amount: validatedData.amount,
      note: validatedData.note
    })
    
    // إضافة سجل تدقيق
    await prisma.auditLog.create({
      data: {
        action: 'CREATE',
        entity: 'Transfer',
        entityId: transfer.id,
        meta: {
          amount: validatedData.amount,
          fromCashboxId: validatedData.fromCashboxId,
          toCashboxId: validatedData.toCashboxId,
          note: validatedData.note
        }
      }
    })
    
    return NextResponse.json(transfer, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'بيانات غير صحيحة', details: error.errors },
        { status: 400 }
      )
    }
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }
    
    console.error('Error creating transfer:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في إنشاء التحويل' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const transfers = await prisma.transfer.findMany({
      orderBy: { date: 'desc' },
      include: {
        fromCashbox: true,
        toCashbox: true,
        journalEntry: {
          include: {
            lines: {
              include: {
                account: true
              }
            }
          }
        }
      }
    })
    
    return NextResponse.json(transfers)
  } catch (error) {
    console.error('Error fetching transfers:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في جلب التحويلات' },
      { status: 500 }
    )
  }
}