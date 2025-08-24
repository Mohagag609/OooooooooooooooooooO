import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createVoucherReceipt, createVoucherPayment } from '@/lib/accounting'
import { prisma } from '@/lib/prisma'

const voucherSchema = z.object({
  kind: z.enum(['receipt', 'payment']),
  date: z.string().transform(str => new Date(str)),
  cashboxId: z.string(),
  accountId: z.string(),
  amount: z.number().positive('المبلغ يجب أن يكون موجب'),
  note: z.string().optional()
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = voucherSchema.parse(body)
    
    let voucher
    
    if (validatedData.kind === 'receipt') {
      voucher = await createVoucherReceipt({
        date: validatedData.date,
        cashboxId: validatedData.cashboxId,
        arAccountId: validatedData.accountId,
        amount: validatedData.amount,
        note: validatedData.note
      })
    } else {
      voucher = await createVoucherPayment({
        date: validatedData.date,
        cashboxId: validatedData.cashboxId,
        expenseAccountId: validatedData.accountId,
        amount: validatedData.amount,
        note: validatedData.note
      })
    }
    
    // إضافة سجل تدقيق
    await prisma.auditLog.create({
      data: {
        action: 'CREATE',
        entity: 'Voucher',
        entityId: voucher.id,
        meta: {
          kind: validatedData.kind,
          amount: validatedData.amount,
          note: validatedData.note
        }
      }
    })
    
    return NextResponse.json(voucher, { status: 201 })
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
    
    console.error('Error creating voucher:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في إنشاء السند' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const kind = searchParams.get('kind')
    
    const where = kind ? { kind } : {}
    
    const vouchers = await prisma.voucher.findMany({
      where,
      orderBy: { date: 'desc' },
      include: {
        cashbox: true,
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
    
    return NextResponse.json(vouchers)
  } catch (error) {
    console.error('Error fetching vouchers:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في جلب السندات' },
      { status: 500 }
    )
  }
}