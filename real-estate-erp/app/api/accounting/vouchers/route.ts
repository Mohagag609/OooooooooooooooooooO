import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const voucherSchema = z.object({
  type: z.enum(['receipt', 'payment']),
  voucherNo: z.string(),
  date: z.string().transform(str => new Date(str)),
  amount: z.number().positive(),
  cashboxId: z.string(),
  clientId: z.string().optional(),
  description: z.string().optional(),
  reference: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = voucherSchema.parse(body)
    
    // Create the voucher
    const voucher = await prisma.voucher.create({
      data: {
        type: validatedData.type,
        voucherNo: validatedData.voucherNo,
        date: validatedData.date,
        amount: validatedData.amount,
        cashboxId: validatedData.cashboxId,
        clientId: validatedData.clientId,
        description: validatedData.description,
        reference: validatedData.reference,
      },
      include: {
        cashbox: true,
        client: true,
      }
    })
    
    // Update cashbox balance
    if (validatedData.type === 'receipt') {
      await prisma.cashbox.update({
        where: { id: validatedData.cashboxId },
        data: {
          balance: {
            increment: validatedData.amount
          }
        }
      })
    } else {
      await prisma.cashbox.update({
        where: { id: validatedData.cashboxId },
        data: {
          balance: {
            decrement: validatedData.amount
          }
        }
      })
    }
    
    return NextResponse.json(voucher)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Error creating voucher:', error)
    return NextResponse.json(
      { error: 'Failed to create voucher' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    
    const where = type ? { type } : {}
    
    const vouchers = await prisma.voucher.findMany({
      where,
      orderBy: { date: 'desc' },
      include: {
        cashbox: true,
        client: true
      }
    })
    
    return NextResponse.json(vouchers)
  } catch (error) {
    console.error('Error fetching vouchers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch vouchers' },
      { status: 500 }
    )
  }
}