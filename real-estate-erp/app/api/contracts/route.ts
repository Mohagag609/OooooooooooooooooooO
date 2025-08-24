import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { Decimal } from '@prisma/client/runtime/library'

export const dynamic = 'force-dynamic'

// Schema للتحقق من البيانات
const createContractSchema = z.object({
  contractNo: z.string().min(1, 'رقم العقد مطلوب'),
  date: z.string().transform(str => new Date(str)),
  clientId: z.string().min(1, 'العميل مطلوب'),
  unitId: z.string().min(1, 'الوحدة مطلوبة'),
  projectId: z.string().optional(),
  totalAmount: z.number().positive('المبلغ الإجمالي يجب أن يكون موجب'),
  downPayment: z.number().min(0, 'الدفعة المقدمة لا يمكن أن تكون سالبة'),
  months: z.number().int().positive('عدد الأشهر يجب أن يكون موجب'),
  planType: z.enum(['MONTHLY', 'QUARTERLY', 'YEARLY']).default('MONTHLY'),
  discount: z.number().min(0).optional(),
  commission: z.number().min(0).optional(),
  status: z.enum(['active', 'cancelled', 'completed']).default('active'),
  notes: z.string().optional()
})

// دالة لتوليد الأقساط
async function generateInstallments(
  contractId: string,
  clientId: string,
  unitId: string,
  totalAmount: number,
  downPayment: number,
  months: number,
  planType: string,
  startDate: Date
) {
  const remainingAmount = totalAmount - downPayment
  const installmentAmount = remainingAmount / months
  const installments = []
  
  // تحديد الفترة بين الأقساط
  const monthsPerInstallment = planType === 'QUARTERLY' ? 3 : planType === 'YEARLY' ? 12 : 1
  
  for (let i = 0; i < months; i++) {
    const dueDate = new Date(startDate)
    dueDate.setMonth(dueDate.getMonth() + (i + 1) * monthsPerInstallment)
    
    installments.push({
      contractId,
      clientId,
      unitId,
      installmentNo: i + 1,
      dueDate,
      amount: new Decimal(installmentAmount),
      status: 'pending'
    })
  }
  
  // إنشاء جميع الأقساط
  await prisma.installment.createMany({
    data: installments
  })
}

// جلب جميع العقود
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const clientId = searchParams.get('clientId')
    
    const where: any = {}
    if (status) where.status = status
    if (clientId) where.clientId = clientId
    
    const contracts = await prisma.contract.findMany({
      where,
      include: {
        client: true,
        unit: {
          include: {
            project: true
          }
        },
        _count: {
          select: {
            installments: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json(contracts)
  } catch (error) {
    console.error('Error fetching contracts:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في جلب البيانات' },
      { status: 500 }
    )
  }
}

// إنشاء عقد جديد
export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('Received contract data:', body)
    
    // التحقق من البيانات
    const validatedData = createContractSchema.parse(body)
    
    // التحقق من عدم تكرار رقم العقد
    const existingContract = await prisma.contract.findUnique({
      where: { contractNo: validatedData.contractNo }
    })
    
    if (existingContract) {
      return NextResponse.json(
        { error: 'رقم العقد موجود بالفعل' },
        { status: 400 }
      )
    }
    
    // التحقق من أن الدفعة المقدمة لا تتجاوز المبلغ الإجمالي
    if (validatedData.downPayment > validatedData.totalAmount) {
      return NextResponse.json(
        { error: 'الدفعة المقدمة لا يمكن أن تتجاوز المبلغ الإجمالي' },
        { status: 400 }
      )
    }
    
    // التحقق من حالة الوحدة
    const unit = await prisma.unit.findUnique({
      where: { id: validatedData.unitId }
    })
    
    if (!unit) {
      return NextResponse.json(
        { error: 'الوحدة غير موجودة' },
        { status: 404 }
      )
    }
    
    if (unit.status !== 'available') {
      return NextResponse.json(
        { error: 'الوحدة غير متاحة للبيع' },
        { status: 400 }
      )
    }
    
    // بدء المعاملة
    const result = await prisma.$transaction(async (tx) => {
      // إنشاء العقد
      const contract = await tx.contract.create({
        data: {
          ...validatedData,
          totalAmount: new Decimal(validatedData.totalAmount),
          downPayment: new Decimal(validatedData.downPayment),
          discount: validatedData.discount ? new Decimal(validatedData.discount) : null,
          commission: validatedData.commission ? new Decimal(validatedData.commission) : null,
        },
        include: {
          client: true,
          unit: {
            include: {
              project: true
            }
          }
        }
      })
      
      // تحديث حالة الوحدة
      await tx.unit.update({
        where: { id: validatedData.unitId },
        data: { status: 'sold' }
      })
      
      // توليد الأقساط
      await generateInstallments(
        contract.id,
        contract.clientId,
        contract.unitId,
        validatedData.totalAmount,
        validatedData.downPayment,
        validatedData.months,
        validatedData.planType,
        validatedData.date
      )
      
      // إضافة سجل تدقيق
      await tx.auditLog.create({
        data: {
          action: 'CREATE',
          entity: 'Contract',
          entityId: contract.id,
          meta: { 
            contractNo: contract.contractNo,
            clientId: contract.clientId,
            unitId: contract.unitId,
            totalAmount: validatedData.totalAmount
          }
        }
      })
      
      return contract
    })
    
    return NextResponse.json(result, { status: 201 })
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
    
    console.error('Error creating contract:', error)
    return NextResponse.json(
      { 
        error: 'حدث خطأ في إنشاء العقد',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}