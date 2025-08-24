'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, Home, RotateCcw } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to console for debugging
    console.error('Page Error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 text-destructive">
              <AlertTriangle className="h-full w-full" />
            </div>
            <CardTitle className="text-2xl font-bold">عذراً، حدث خطأ غير متوقع</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-muted-foreground">
              نعتذر عن هذا الخطأ. يمكنك المحاولة مرة أخرى أو العودة إلى لوحة التحكم.
            </p>
            
            {process.env.NODE_ENV === 'development' && (
              <div className="rounded-lg bg-muted p-3 text-xs font-mono">
                <p className="font-semibold mb-1">تفاصيل الخطأ (للمطورين):</p>
                <p className="text-destructive break-all">{error.message}</p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                onClick={reset}
                variant="default"
                className="flex-1"
              >
                <RotateCcw className="ml-2 h-4 w-4" />
                إعادة المحاولة
              </Button>
              
              <Button
                onClick={() => window.location.href = '/dashboard'}
                variant="outline"
                className="flex-1"
              >
                <Home className="ml-2 h-4 w-4" />
                لوحة التحكم
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}