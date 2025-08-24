"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface GlassHeaderProps {
  children: React.ReactNode
  className?: string
  sticky?: boolean
}

export function GlassHeader({
  children,
  className,
  sticky = true
}: GlassHeaderProps) {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" as const }}
      className={cn(
        "relative z-40 w-full",
        sticky && "sticky top-0",
        className
      )}
    >
      <div className="backdrop-blur-md bg-white/60 dark:bg-slate-900/50 border-b border-border/40 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="container mx-auto px-4 md:px-6 lg:px-10">
          <div className="flex h-16 items-center justify-between">
            {children}
          </div>
        </div>
      </div>
      
      {/* Gradient Line */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
    </motion.header>
  )
}