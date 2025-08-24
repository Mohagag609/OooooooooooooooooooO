import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'نظام ERP العقاري المتكامل',
  description: 'نظام إدارة العقارات والمالية',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <nav className="navbar">
          <div className="container">
            <a href="/">الرئيسية</a>
            <a href="/dashboard">لوحة التحكم</a>
            <a href="/real-estate/installments">الأقساط</a>
            <a href="/real-estate/partners">الشركاء</a>
            <a href="/real-estate/returns">الإرجاعات</a>
          </div>
        </nav>
        <main className="container">
          {children}
        </main>
      </body>
    </html>
  )
}