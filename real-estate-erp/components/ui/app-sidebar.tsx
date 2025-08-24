"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import {
  Building2,
  Users,
  FileText,
  DollarSign,
  Home,
  Package,
  TrendingUp,
  Settings,
  Briefcase,
  UserCheck,
  Calculator,
  Database,
  Receipt,
  Warehouse,
  FileBarChart,
  Shield,
  ChevronRight,
  ChevronLeft,
  Menu
} from "lucide-react"
import { cn } from "@/lib/utils"

interface MenuItem {
  id: string
  title: string
  href?: string
  icon: React.ElementType
  badge?: string
  children?: MenuItem[]
}

const menuItems: MenuItem[] = [
  {
    id: "home",
    title: "الرئيسية",
    href: "/",
    icon: Home,
  },
  {
    id: "dashboard",
    title: "لوحة التحكم",
    href: "/dashboard",
    icon: TrendingUp,
    badge: "جديد"
  },
  {
    id: "clients-suppliers",
    title: "العملاء والموردين",
    icon: Users,
    children: [
      { id: "clients", title: "العملاء", href: "/clients", icon: Users },
      { id: "suppliers", title: "الموردين", href: "/suppliers", icon: Briefcase },
      { id: "partners", title: "الشركاء", href: "/partners", icon: UserCheck },
      { id: "partners-settlements", title: "مخالصات الشركاء", href: "/partners/settlements", icon: Receipt },
    ]
  },
  {
    id: "real-estate",
    title: "العقارات",
    icon: Building2,
    children: [
      { id: "projects", title: "المشاريع", href: "/projects", icon: Building2 },
      { id: "units", title: "الوحدات", href: "/units", icon: Home },
      { id: "contracts", title: "العقود", href: "/contracts", icon: FileText },
      { id: "installments", title: "الأقساط", href: "/installments", icon: Calculator },
      { id: "invoices", title: "الفواتير", href: "/invoices", icon: FileText },
      { id: "payments", title: "المدفوعات", href: "/payments", icon: DollarSign },
    ]
  },
  {
    id: "accounting",
    title: "المحاسبة",
    icon: Calculator,
    children: [
      { id: "accounts", title: "دليل الحسابات", href: "/accounting/accounts", icon: Calculator },
      { id: "journal-entries", title: "القيود المحاسبية", href: "/accounting/journal-entries", icon: FileText },
      { id: "cashboxes", title: "الصناديق", href: "/accounting/cashboxes", icon: Database },
      { id: "vouchers", title: "سندات القبض والصرف", href: "/accounting/vouchers", icon: Receipt },
      { id: "transfers", title: "التحويلات", href: "/accounting/transfers", icon: DollarSign },
      { id: "revenues", title: "الإيرادات", href: "/revenues", icon: TrendingUp },
      { id: "expenses", title: "المصروفات", href: "/expenses", icon: Receipt },
    ]
  },
  {
    id: "hr",
    title: "الموارد البشرية",
    icon: UserCheck,
    children: [
      { id: "employees", title: "الموظفين", href: "/employees", icon: Users },
      { id: "payrolls", title: "المرتبات", href: "/payrolls", icon: DollarSign },
    ]
  },
  {
    id: "warehouses",
    title: "المخازن",
    icon: Warehouse,
    children: [
      { id: "warehouses-list", title: "المخازن", href: "/warehouses", icon: Warehouse },
      { id: "materials", title: "المواد", href: "/materials", icon: Package },
      { id: "material-moves", title: "حركات المواد", href: "/material-moves", icon: TrendingUp },
    ]
  },
  {
    id: "reports",
    title: "التقارير",
    href: "/reports",
    icon: FileBarChart,
  },
  {
    id: "settings",
    title: "الإعدادات",
    href: "/settings",
    icon: Settings,
  }
]

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const pathname = usePathname()

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev =>
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  const isActive = (href?: string) => {
    if (!href) return false
    return pathname === href || pathname.startsWith(href + "/")
  }

  const renderMenuItem = (item: MenuItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedItems.includes(item.id)
    const active = isActive(item.href)

    const itemContent = (
      <div
        className={cn(
          "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
          "hover:bg-accent hover:text-accent-foreground",
          active && "bg-gradient-to-r from-indigo-500/10 to-emerald-500/10 text-indigo-700 dark:text-indigo-300",
          level > 0 && "ml-6"
        )}
      >
        <item.icon className={cn(
          "h-5 w-5 shrink-0",
          active && "text-indigo-600 dark:text-indigo-400"
        )} />
        
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap"
            >
              {item.title}
            </motion.span>
          )}
        </AnimatePresence>

        {!collapsed && item.badge && (
          <Badge variant="secondary" className="ml-auto">
            {item.badge}
          </Badge>
        )}

        {!collapsed && hasChildren && (
          <ChevronRight className={cn(
            "ml-auto h-4 w-4 transition-transform",
            isExpanded && "rotate-90"
          )} />
        )}
      </div>
    )

    if (collapsed && !hasChildren) {
      return (
        <TooltipProvider key={item.id}>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              {item.href ? (
                <Link href={item.href}>{itemContent}</Link>
              ) : (
                <div>{itemContent}</div>
              )}
            </TooltipTrigger>
            <TooltipContent side="left" className="flex items-center gap-2">
              {item.title}
              {item.badge && (
                <Badge variant="secondary" className="ml-1">
                  {item.badge}
                </Badge>
              )}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    }

    return (
      <div key={item.id}>
        {item.href ? (
          <Link href={item.href}>{itemContent}</Link>
        ) : (
          <button
            onClick={() => hasChildren && toggleExpanded(item.id)}
            className="w-full"
          >
            {itemContent}
          </button>
        )}

        {hasChildren && !collapsed && (
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="mt-1 space-y-1">
                  {item.children?.map(child => renderMenuItem(child, level + 1))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    )
  }

  return (
    <motion.aside
      animate={{ width: collapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: "easeInOut" as const }}
              className={cn(
          "relative flex h-screen flex-col border-l bg-background/95 backdrop-blur-sm",
          "shadow-[inset_-1px_0_0_rgba(0,0,0,0.05)]"
        )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b px-4">
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-emerald-500">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <span className="font-semibold">ERP System</span>
            </motion.div>
          )}
        </AnimatePresence>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8"
        >
          {collapsed ? <ChevronLeft className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {menuItems.map(item => renderMenuItem(item))}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t p-4">
        <div className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2",
          "bg-gradient-to-r from-indigo-500/5 to-emerald-500/5"
        )}>
          <Shield className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          {!collapsed && (
            <div className="flex-1">
              <p className="text-xs font-medium">الإصدار</p>
              <p className="text-xs text-muted-foreground">1.0.0</p>
            </div>
          )}
        </div>
      </div>
    </motion.aside>
  )
}