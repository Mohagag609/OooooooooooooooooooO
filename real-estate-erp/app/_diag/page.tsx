'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react'
import { isBrowser, safeLocalStorage } from '@/lib/safeBrowser'

/**
 * صفحة تشخيص مؤقتة - للتطوير فقط
 * يمكن حذفها بعد حل المشاكل
 */
export default function DiagnosticsPage() {
  const [diagnostics, setDiagnostics] = useState({
    browser: false,
    localStorage: false,
    theme: 'unknown',
    pathname: '/',
    userAgent: 'unknown',
  })

  useEffect(() => {
    setDiagnostics({
      browser: isBrowser(),
      localStorage: (() => {
        try {
          if (!isBrowser()) return false
          const testKey = '__test__'
          localStorage.setItem(testKey, 'test')
          localStorage.removeItem(testKey)
          return true
        } catch {
          return false
        }
      })(),
      theme: safeLocalStorage.getItem('theme', 'system'),
      pathname: isBrowser() ? window.location.pathname : '/',
      userAgent: isBrowser() ? navigator.userAgent : 'SSR',
    })
  }, [])

  const throwTestError = () => {
    throw new Error('هذا خطأ تجريبي لاختبار Error Boundary')
  }

  const DiagnosticItem = ({ label, value, success }: { label: string; value: string | boolean; success?: boolean }) => (
    <div className="flex items-center justify-between py-2 border-b last:border-0">
      <span className="text-sm font-medium">{label}</span>
      <div className="flex items-center gap-2">
        {typeof value === 'boolean' ? (
          <>
            {value ? (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            ) : (
              <XCircle className="h-4 w-4 text-red-500" />
            )}
            <span className={`text-sm ${value ? 'text-green-600' : 'text-red-600'}`}>
              {value ? 'متاح' : 'غير متاح'}
            </span>
          </>
        ) : (
          <span className="text-sm text-muted-foreground font-mono">{value}</span>
        )}
      </div>
    </div>
  )

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          هذه صفحة تشخيص مؤقتة للتطوير فقط. يجب حذفها قبل النشر.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>تشخيص بيئة العميل</CardTitle>
          <CardDescription>معلومات حول بيئة التشغيل الحالية</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border p-4">
            <h3 className="font-semibold mb-3">معلومات البيئة</h3>
            <DiagnosticItem label="typeof window" value={diagnostics.browser} />
            <DiagnosticItem label="localStorage" value={diagnostics.localStorage} />
            <DiagnosticItem label="الثيم الحالي" value={diagnostics.theme} />
            <DiagnosticItem label="المسار الحالي" value={diagnostics.pathname} />
          </div>

          <div className="rounded-lg border p-4">
            <h3 className="font-semibold mb-3">معلومات المتصفح</h3>
            <div className="text-xs text-muted-foreground font-mono break-all">
              {diagnostics.userAgent}
            </div>
          </div>

          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <h3 className="font-semibold mb-3 text-red-900">اختبار Error Boundary</h3>
            <p className="text-sm text-red-700 mb-3">
              اضغط على الزر أدناه لإطلاق خطأ تجريبي واختبار صفحة الخطأ
            </p>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={throwTestError}
            >
              إطلاق خطأ تجريبي
            </Button>
          </div>

          <div className="flex gap-3">
            <Button onClick={() => window.location.reload()} variant="outline">
              إعادة تحميل الصفحة
            </Button>
            <Button onClick={() => window.location.href = '/dashboard'}>
              العودة للوحة التحكم
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}