'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to console for debugging
    console.error('Global Error:', error)
  }, [error])

  return (
    <html>
      <body>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          backgroundColor: '#f3f4f6',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          <div style={{
            maxWidth: '28rem',
            width: '100%',
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            padding: '2rem',
            textAlign: 'center'
          }}>
            <div style={{
              width: '3rem',
              height: '3rem',
              margin: '0 auto 1rem',
              color: '#ef4444'
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            
            <h1 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              marginBottom: '1rem',
              color: '#1f2937'
            }}>
              عذراً، حدث خطأ في التطبيق
            </h1>
            
            <p style={{
              color: '#6b7280',
              marginBottom: '1.5rem',
              lineHeight: '1.5'
            }}>
              نعتذر عن هذا الخطأ. يرجى إعادة تحميل الصفحة أو المحاولة مرة أخرى لاحقاً.
            </p>
            
            <div style={{
              display: 'flex',
              gap: '0.75rem',
              justifyContent: 'center'
            }}>
              <button
                onClick={reset}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  borderRadius: '0.375rem',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}
              >
                إعادة المحاولة
              </button>
              
              <button
                onClick={() => window.location.href = '/'}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#e5e7eb',
                  color: '#374151',
                  borderRadius: '0.375rem',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}
              >
                الصفحة الرئيسية
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}