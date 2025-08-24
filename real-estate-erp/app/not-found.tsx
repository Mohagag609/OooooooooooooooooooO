'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { MotionSection } from '@/components/ui/motion-section'
import { Home, Search } from 'lucide-react'
import { motion } from 'framer-motion'

export default function NotFound() {
  return (
    <MotionSection className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 260,
            damping: 20 
          }}
          className="mb-8"
        >
          <div className="relative inline-flex">
            <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-30 rounded-full" />
            <h1 className="relative text-9xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              404
            </h1>
          </div>
        </motion.div>
        
        <EmptyState
          icon={Search}
          title="الصفحة غير موجودة"
          description="عذراً، لا يمكننا العثور على الصفحة التي تبحث عنها. ربما تم نقلها أو حذفها."
          actionLabel="العودة للرئيسية"
          onAction={() => window.location.href = '/'}
        />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            variant="outline"
            onClick={() => window.history.back()}
          >
            الرجوع للخلف
          </Button>
          <Link href="/dashboard">
            <Button className="btn-primary">
              لوحة التحكم
            </Button>
          </Link>
        </motion.div>
      </div>
    </MotionSection>
  )
}