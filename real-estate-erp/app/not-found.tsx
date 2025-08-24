import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Home, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-24 w-24 text-muted-foreground">
            <Search className="h-full w-full" />
          </div>
          <CardTitle className="text-3xl font-bold">404</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <h2 className="text-xl font-semibold text-center">الصفحة غير موجودة</h2>
          
          <p className="text-center text-muted-foreground">
            عذراً، لم نتمكن من العثور على الصفحة التي تبحث عنها. قد تكون الصفحة قد حُذفت أو تم نقلها.
          </p>
          
          <div className="flex gap-3 pt-4">
            <Button asChild className="flex-1">
              <Link href="/dashboard">
                <Home className="ml-2 h-4 w-4" />
                لوحة التحكم
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="flex-1">
              <Link href="/">
                الصفحة الرئيسية
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}