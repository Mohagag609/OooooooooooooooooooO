import type { Metadata } from 'next'

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
      <head>
        <style jsx global>{`
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Arial', sans-serif;
            background-color: #f5f5f5;
            color: #333;
            line-height: 1.6;
          }
          
          .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
          }
          
          .navbar {
            background-color: #1976d2;
            color: white;
            padding: 15px 0;
            margin-bottom: 30px;
          }
          
          .navbar a {
            color: white;
            text-decoration: none;
            margin: 0 15px;
          }
          
          .navbar a:hover {
            text-decoration: underline;
          }
          
          .card {
            background: white;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          
          .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
          }
          
          .table {
            width: 100%;
            border-collapse: collapse;
          }
          
          .table th,
          .table td {
            padding: 12px;
            text-align: right;
            border-bottom: 1px solid #ddd;
          }
          
          .table th {
            background-color: #f8f9fa;
            font-weight: bold;
          }
          
          .btn {
            background-color: #1976d2;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
          }
          
          .btn:hover {
            background-color: #1565c0;
          }
          
          .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 500;
          }
          
          .status-badge.pending {
            background-color: #fff3cd;
            color: #856404;
          }
          
          .status-badge.paid {
            background-color: #d4edda;
            color: #155724;
          }
          
          .status-badge.overdue {
            background-color: #f8d7da;
            color: #721c24;
          }
        `}</style>
      </head>
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