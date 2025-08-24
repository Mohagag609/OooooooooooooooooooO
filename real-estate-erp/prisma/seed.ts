import { PrismaClient } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'

const prisma = new PrismaClient()

async function main() {
  console.log('بدء عملية Seed...')
  
  // حذف البيانات القديمة
  await prisma.installment.deleteMany()
  await prisma.contract.deleteMany()
  await prisma.unit.deleteMany()
  await prisma.project.deleteMany()
  await prisma.client.deleteMany()
  await prisma.auditLog.deleteMany()
  
  // إنشاء عميل تجريبي
  const client = await prisma.client.create({
    data: {
      name: 'أحمد محمد علي',
      phone: '01234567890',
      email: 'ahmed@example.com',
      address: 'القاهرة - مدينة نصر',
      note: 'عميل VIP'
    }
  })
  
  console.log('تم إنشاء العميل:', client.name)
  
  // إنشاء مشروع
  const project = await prisma.project.create({
    data: {
      code: 'PRJ-001',
      name: 'كمبوند النخيل',
      status: 'active',
      startDate: new Date('2024-01-01')
    }
  })
  
  console.log('تم إنشاء المشروع:', project.name)
  
  // إنشاء وحدة سكنية
  const unit = await prisma.unit.create({
    data: {
      code: 'U-101',
      projectId: project.id,
      type: 'سكني',
      area: new Decimal(120),
      price: new Decimal(1500000),
      downPayment: new Decimal(300000),
      status: 'sold',
      description: 'شقة 3 غرف - الدور الأول'
    }
  })
  
  console.log('تم إنشاء الوحدة:', unit.code)
  
  // إنشاء عقد
  const contract = await prisma.contract.create({
    data: {
      clientId: client.id,
      unitId: unit.id,
      startDate: new Date('2024-01-15'),
      totalAmount: new Decimal(1500000),
      downPayment: new Decimal(300000),
      months: 24,
      planType: 'MONTHLY',
      notes: 'عقد بيع بالتقسيط على 24 شهر'
    }
  })
  
  console.log('تم إنشاء العقد')
  
  // حساب قيمة القسط الشهري
  const remainingAmount = 1500000 - 300000 // المبلغ المتبقي بعد المقدم
  const monthlyInstallment = remainingAmount / 24
  const roundedInstallment = Math.round(monthlyInstallment * 100) / 100 // التقريب لخانتين
  
  // توليد الأقساط
  const installments = []
  for (let i = 0; i < 24; i++) {
    const dueDate = new Date('2024-02-15')
    dueDate.setMonth(dueDate.getMonth() + i)
    
    // تحديد حالة القسط
    let status = 'PENDING'
    let paidAt = null
    
    // الأقساط الثلاثة الأولى مدفوعة
    if (i < 3) {
      status = 'PAID'
      paidAt = new Date(dueDate)
      paidAt.setDate(paidAt.getDate() - 5) // دفع قبل الاستحقاق بـ 5 أيام
    } else if (i < 5 && new Date() > dueDate) {
      // الأقساط المتأخرة
      status = 'OVERDUE'
    }
    
    const installment = await prisma.installment.create({
      data: {
        contractId: contract.id,
        amount: new Decimal(roundedInstallment),
        dueDate: dueDate,
        status: status,
        paidAt: paidAt
      }
    })
    
    installments.push(installment)
  }
  
  console.log(`تم إنشاء ${installments.length} قسط`)
  
  // إضافة سجل تدقيق
  await prisma.auditLog.create({
    data: {
      action: 'SEED',
      entity: 'Database',
      meta: {
        clientsCreated: 1,
        projectsCreated: 1,
        unitsCreated: 1,
        contractsCreated: 1,
        installmentsCreated: installments.length
      }
    }
  })
  
  console.log('تمت عملية Seed بنجاح!')
}

main()
  .catch((e) => {
    console.error('خطأ في عملية Seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })