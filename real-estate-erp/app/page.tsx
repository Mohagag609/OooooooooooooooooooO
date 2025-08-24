export default function HomePage() {
  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '20px' }}>نظام ERP العقاري المتكامل</h1>
      <div className="card">
        <h2 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>مرحباً بك في النظام</h2>
        <p>نظام متكامل لإدارة العقارات والمحاسبة بدون نظام صلاحيات</p>
        <br />
        <p>يمكنك استخدام القوائم في الأعلى للتنقل بين:</p>
        <ul style={{ marginRight: '20px', marginTop: '10px' }}>
          <li>لوحة التحكم - عرض الإحصائيات العامة</li>
          <li>الأقساط - عرض جدول الأقساط المستحقة</li>
        </ul>
      </div>
    </div>
  )
}