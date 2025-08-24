import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const transferSchema = z.object({
  fromCashboxId: z.string(),
  toCashboxId: z.string(),
  amount: z.number().positive(),
  date: z.string().transform(str => new Date(str)),
  description: z.string().optional(),
  reference: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = transferSchema.parse(body)
    
    // التحقق من عدم التحويل لنفس الخزنة
    if (validatedData.fromCashboxId === validatedData.toCashboxId) {
      return NextResponse.json(
        { error: 'Cannot transfer to the same cashbox' },
        { status: 400 }
      )
    }
    
    // Create the transfer
    const transfer = await prisma.transfer.create({
      data: {
        fromCashboxId: validatedData.fromCashboxId,
        toCashboxId: validatedData.toCashboxId,
        amount: validatedData.amount,
        date: validatedData.date,
        description: validatedData.description,
        reference: validatedData.reference,
      },
      include: {
        fromCashbox: true,
        toCashbox: true
      }
    })
    
    // Update cashbox balances
    await prisma.$transaction([
      prisma.cashbox.update({
        where: { id: validatedData.fromCashboxId },
        data: {
          balance: {
            decrement: validatedData.amount
          }
        }
      }),
      prisma.cashbox.update({
        where: { id: validatedData.toCashboxId },
        data: {
          balance: {
            increment: validatedData.amount
          }
        }
      })
    ])
    
    return NextResponse.json(transfer)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Error creating transfer:', error)
    return NextResponse.json(
      { error: 'Failed to create transfer' },
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
        toCashbox: true
      }
    })
    
    return NextResponse.json(transfers)
  } catch (error) {
    console.error('Error fetching transfers:', error)
    return NextResponse.json({ error: 'Failed to fetch transfers' }, { status: 500 })
  }
}