import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { AppSidebar } from '@/components/ui/app-sidebar'
import { GlassHeader } from '@/components/ui/glass-header'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { NotificationsDrawer } from '@/components/ui/notifications-drawer'
import { CommandPalette } from '@/components/ui/command-palette'
import { Footer } from '@/components/ui/footer'
import LoggerProvider from '@/components/system/LoggerProvider'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
})

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
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LoggerProvider>
            <CommandPalette />
            <div className="flex h-screen overflow-hidden bg-background">
              {/* Sidebar */}
              <AppSidebar />
              
              {/* Main Content */}
              <div className="flex flex-1 flex-col overflow-hidden">
                {/* Glass Header */}
                <GlassHeader>
                  {/* Search Bar */}
                  <div className="relative w-full max-w-md">
                    <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="بحث في النظام... (Ctrl+K)"
                      className="pr-10 backdrop-blur-sm bg-white/50 dark:bg-slate-900/50 border-white/20"
                    />
                  </div>
                  
                  {/* Header Actions */}
                  <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <NotificationsDrawer />
                  </div>
                </GlassHeader>
            
                            {/* Page Content */}
                <main className="flex-1 overflow-y-auto bg-gradient-to-br from-background via-background to-muted/20">
                  <div className="container mx-auto max-w-[1400px] px-4 md:px-6 lg:px-10 py-6 pb-14">
                    {children}
                  </div>
                  <Footer />
                </main>
              </div>
            </div>
          </LoggerProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}