import type { Metadata } from 'next'
import './globals.css'
import { Sidebar } from '@/components/layout/sidebar'
import LoggerProvider from '@/components/system/LoggerProvider'

export const metadata: Metadata = {
  title: 'نظام ERP العقاري المتكامل',
  description: 'نظام محاسبي وإداري متكامل لشركات المقاولات والعقارات',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <LoggerProvider>
          <div className="flex h-screen overflow-hidden">
            {/* Sidebar */}
            <Sidebar />
            
            {/* Main Content */}
            <div className="flex flex-1 flex-col overflow-hidden">
              {/* Header */}
              <header className="flex h-16 items-center justify-between border-b bg-background px-6">
                <h1 className="text-lg font-medium">نظام ERP العقاري</h1>
                <div className="flex items-center gap-4">
                  {/* User menu can be added here later */}
                </div>
              </header>
            
            {/* Page Content */}
            <main className="flex-1 overflow-y-auto bg-muted/30">
              <div className="container mx-auto p-6">
                {children}
              </div>
            </main>
          </div>
        </div>
        </LoggerProvider>
      </body>
    </html>
  )
}