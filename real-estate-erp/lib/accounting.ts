import { prisma } from './prisma'
import { Decimal } from '@prisma/client/runtime/library'

interface JournalLine {
  accountId: string
  debit?: number | Decimal
  credit?: number | Decimal
}

interface PostJournalParams {
  date: Date
  description?: string
  ref?: string
  lines: JournalLine[]
}

// خدمة إنشاء قيد محاسبي
export async function postJournal(params: PostJournalParams) {
  const { date, description, ref, lines } = params
  
  // التحقق من توازن القيد
  let totalDebit = new Decimal(0)
  let totalCredit = new Decimal(0)
  
  for (const line of lines) {
    if (line.debit && line.credit && new Decimal(line.debit).gt(0) && new Decimal(line.credit).gt(0)) {
      throw new Error('لا يمكن أن يحتوي السطر على مدين ودائن في نفس الوقت')
    }
    
    totalDebit = totalDebit.add(new Decimal(line.debit || 0))
    totalCredit = totalCredit.add(new Decimal(line.credit || 0))
  }
  
  if (!totalDebit.equals(totalCredit)) {
    throw new Error(`القيد غير متوازن. المدين: ${totalDebit}, الدائن: ${totalCredit}`)
  }
  
  // إنشاء القيد مع الأسطر
  const entry = await prisma.journalEntry.create({
    data: {
      date,
      description,
      ref,
      lines: {
        create: lines.map(line => ({
          accountId: line.accountId,
          debit: new Decimal(line.debit || 0),
          credit: new Decimal(line.credit || 0)
        }))
      }
    },
    include: {
      lines: {
        include: {
          account: true
        }
      }
    }
  })
  
  return entry
}

// خدمة إنشاء سند قبض
export async function createVoucherReceipt(params: {
  date: Date
  cashboxId: string
  arAccountId: string  // حساب المدينين/العملاء
  amount: number | Decimal
  note?: string
}) {
  const { date, cashboxId, arAccountId, amount, note } = params
  
  // الحصول على حساب الخزنة
  const cashbox = await prisma.cashbox.findUnique({
    where: { id: cashboxId },
    include: { account: true }
  })
  
  if (!cashbox) {
    throw new Error('الخزنة غير موجودة')
  }
  
  // إنشاء القيد المحاسبي
  // مدين: الخزنة
  // دائن: العملاء
  const journalEntry = await postJournal({
    date,
    description: `سند قبض - ${note || ''}`,
    lines: [
      {
        accountId: cashbox.accountId,
        debit: amount
      },
      {
        accountId: arAccountId,
        credit: amount
      }
    ]
  })
  
  // إنشاء سند القبض
  const voucher = await prisma.voucher.create({
    data: {
      kind: 'receipt',
      date,
      cashboxId,
      amount: new Decimal(amount),
      note,
      journalEntryId: journalEntry.id
    }
  })
  
  return voucher
}

// خدمة إنشاء سند صرف
export async function createVoucherPayment(params: {
  date: Date
  cashboxId: string
  expenseAccountId: string  // حساب المصروف
  amount: number | Decimal
  note?: string
}) {
  const { date, cashboxId, expenseAccountId, amount, note } = params
  
  // الحصول على حساب الخزنة
  const cashbox = await prisma.cashbox.findUnique({
    where: { id: cashboxId },
    include: { account: true }
  })
  
  if (!cashbox) {
    throw new Error('الخزنة غير موجودة')
  }
  
  // إنشاء القيد المحاسبي
  // مدين: المصروف
  // دائن: الخزنة
  const journalEntry = await postJournal({
    date,
    description: `سند صرف - ${note || ''}`,
    lines: [
      {
        accountId: expenseAccountId,
        debit: amount
      },
      {
        accountId: cashbox.accountId,
        credit: amount
      }
    ]
  })
  
  // إنشاء سند الصرف
  const voucher = await prisma.voucher.create({
    data: {
      kind: 'payment',
      date,
      cashboxId,
      amount: new Decimal(amount),
      note,
      journalEntryId: journalEntry.id
    }
  })
  
  return voucher
}

// خدمة تحويل بين الخزن
export async function createCashTransfer(params: {
  date: Date
  fromCashboxId: string
  toCashboxId: string
  amount: number | Decimal
  note?: string
}) {
  const { date, fromCashboxId, toCashboxId, amount, note } = params
  
  // التحقق من عدم التحويل لنفس الخزنة
  if (fromCashboxId === toCashboxId) {
    throw new Error('لا يمكن التحويل من وإلى نفس الخزنة')
  }
  
  // الحصول على الخزنتين
  const [fromCashbox, toCashbox] = await Promise.all([
    prisma.cashbox.findUnique({
      where: { id: fromCashboxId },
      include: { account: true }
    }),
    prisma.cashbox.findUnique({
      where: { id: toCashboxId },
      include: { account: true }
    })
  ])
  
  if (!fromCashbox || !toCashbox) {
    throw new Error('إحدى الخزن غير موجودة')
  }
  
  // إنشاء القيد المحاسبي
  // مدين: الخزنة المستلمة
  // دائن: الخزنة المرسلة
  const journalEntry = await postJournal({
    date,
    description: `تحويل من ${fromCashbox.name} إلى ${toCashbox.name} - ${note || ''}`,
    lines: [
      {
        accountId: toCashbox.accountId,
        debit: amount
      },
      {
        accountId: fromCashbox.accountId,
        credit: amount
      }
    ]
  })
  
  // إنشاء سجل التحويل
  const transfer = await prisma.transfer.create({
    data: {
      fromCashboxId,
      toCashboxId,
      date,
      amount: new Decimal(amount),
      note,
      journalEntryId: journalEntry.id
    }
  })
  
  return transfer
}