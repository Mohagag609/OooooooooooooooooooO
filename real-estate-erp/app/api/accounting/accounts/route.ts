import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

// Schema للتحقق من البيانات
const createAccountSchema = z.object({
  code: z.string().min(1, 'رقم الحساب مطلوب'),
  name: z.string().min(1, 'اسم الحساب مطلوب'),
  type: z.enum(['asset', 'liability', 'equity', 'revenue', 'expense']),
  parentId: z.string().optional(),
  isActive: z.boolean().default(true),
  description: z.string().optional()
})

export async function GET() {
  try {
    const accounts = await prisma.account.findMany({
      include: {
        parent: true,
        children: true,
        _count: {
          select: {
            journalLines: true
          }
        }
      },
      orderBy: {
        code: 'asc'
      }
    })
    
    return NextResponse.json(accounts)
  } catch (error) {
    console.error('Error fetching accounts:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في جلب الحسابات' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Received account data:', body)
    
    // التحقق من البيانات
    const validatedData = createAccountSchema.parse(body)
    
    // التحقق من عدم تكرار رقم الحساب
    const existingAccount = await prisma.account.findUnique({
      where: { code: validatedData.code }
    })
    
    if (existingAccount) {
      return NextResponse.json(
        { error: 'رقم الحساب موجود بالفعل' },
        { status: 400 }
      )
    }
    
    // التحقق من الحساب الرئيسي إذا كان موجود
    if (validatedData.parentId) {
      const parentAccount = await prisma.account.findUnique({
        where: { id: validatedData.parentId }
      })
      
      if (!parentAccount) {
        return NextResponse.json(
          { error: 'الحساب الرئيسي غير موجود' },
          { status: 400 }
        )
      }
      
      // التحقق من أن نوع الحساب متطابق مع الحساب الرئيسي
      if (parentAccount.type !== validatedData.type) {
        return NextResponse.json(
          { error: 'نوع الحساب يجب أن يكون متطابق مع نوع الحساب الرئيسي' },
          { status: 400 }
        )
      }
    }
    
    // إنشاء الحساب
    const account = await prisma.account.create({
      data: validatedData,
      include: {
        parent: true,
        children: true,
        _count: {
          select: {
            journalLines: true
          }
        }
      }
    })
    
    // إضافة سجل تدقيق
    await prisma.auditLog.create({
      data: {
        action: 'CREATE',
        entity: 'Account',
        entityId: account.id,
        meta: { 
          code: account.code,
          name: account.name,
          type: account.type
        }
      }
    })
    
    return NextResponse.json(account, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation error:', error.errors)
      return NextResponse.json(
        { 
          error: 'بيانات غير صحيحة', 
          details: error.errors,
          message: error.errors.map(e => `${e.path}: ${e.message}`).join(', ')
        },
        { status: 400 }
      )
    }
    
    console.error('Error creating account:', error)
    return NextResponse.json(
      { 
        error: 'حدث خطأ في إنشاء الحساب',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}