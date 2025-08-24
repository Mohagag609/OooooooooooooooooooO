# نظام ERP العقاري المتكامل

نظام إدارة العقارات والمحاسبة بدون نظام صلاحيات - مصمم للعمل مباشرة بعد التثبيت.

## متطلبات النظام

- Node.js 18+ 
- PostgreSQL
- npm أو yarn

## البدء السريع

1. **استنساخ المشروع وتثبيت الاعتماديات:**
```bash
git clone [repository-url]
cd real-estate-erp
npm install
```

2. **إعداد قاعدة البيانات:**
   - انسخ ملف `.env.example` إلى `.env`
   - عدّل `DATABASE_URL` في ملف `.env` ليشير إلى قاعدة بياناتك PostgreSQL

3. **تشغيل الهجرات (Migrations):**
```bash
npx prisma migrate dev --name init
```

4. **تشغيل البيانات التجريبية (Seed):**
```bash
npm run db:seed
```

5. **تشغيل المشروع:**
```bash
npm run dev
```

المشروع سيعمل على: http://localhost:3000

## أوامر مفيدة

```bash
# تطوير
npm run dev          # تشغيل خادم التطوير

# قاعدة البيانات
npm run db:migrate   # تشغيل الهجرات
npm run db:seed      # تشغيل البيانات التجريبية
npm run db:studio    # فتح Prisma Studio لإدارة البيانات

# بناء المشروع
npm run build        # بناء المشروع للإنتاج
npm start            # تشغيل المشروع المبني
```

## البيانات التجريبية

يحتوي ملف seed على:
- عميل: أحمد محمد علي
- مشروع: كمبوند النخيل (PRJ-001)
- وحدة: U-101 (شقة سكنية 120م²، سعر 1,500,000 جنيه)
- عقد: 24 شهر بنظام أقساط شهرية
- أقساط: 24 قسط (3 مدفوعة، بعضها متأخر، والباقي مستحق)

## روابط الفحص السريع

- **Health Check:** http://localhost:3000/api/health
- **لوحة التحكم:** http://localhost:3000/dashboard
- **جدول الأقساط:** http://localhost:3000/real-estate/installments

## حل المشاكل الشائعة (Troubleshooting)

### شاشة بيضاء أو خطأ في التطبيق؟
1. تحقق من `/api/health` - إذا ظهر خطأ، تأكد من:
   - صحة `DATABASE_URL` في ملف `.env`
   - تشغيل خادم PostgreSQL
   - تشغيل الهجرات: `npx prisma migrate dev`

### أخطاء Prisma؟
```bash
npx prisma migrate reset  # إعادة تعيين قاعدة البيانات
npm run db:seed          # إعادة تشغيل البيانات التجريبية
```

### لا تظهر البيانات في الجداول؟
- تأكد من تشغيل `npm run db:seed`
- افتح Prisma Studio للتحقق: `npm run db:studio`

## ملاحظات هامة

- **لا يوجد نظام صلاحيات:** النظام مصمم للعمل بدون تسجيل دخول أو صلاحيات
- **ENABLE_AUTH=false:** ثابت في `.env` - لا تغيره
- جميع الصفحات متاحة للجميع

## هيكل المشروع

```
real-estate-erp/
├── app/                    # صفحات Next.js App Router
│   ├── api/               # API Routes
│   ├── dashboard/         # لوحة التحكم
│   └── real-estate/       # صفحات العقارات
├── lib/                   # ملفات المساعدة
│   └── prisma.ts         # عميل Prisma
├── prisma/               
│   ├── schema.prisma     # نماذج قاعدة البيانات
│   └── seed.ts          # البيانات التجريبية
└── public/              # الملفات الثابتة
```

## المرحلة الحالية: المرحلة 1 ✅

تم إنجاز:
- ✅ إعداد المشروع الأساسي
- ✅ نماذج قاعدة البيانات (Client, Unit, Contract, Installment)
- ✅ Health Check API
- ✅ لوحة تحكم بإحصائيات حقيقية
- ✅ صفحة عرض الأقساط
- ✅ بيانات تجريبية شاملة