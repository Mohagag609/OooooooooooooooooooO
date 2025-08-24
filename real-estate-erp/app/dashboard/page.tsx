'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Building2, 
  Users, 
  FileText, 
  DollarSign, 
  TrendingUp, 
  AlertCircle,
  Calendar,
  Home
} from "lucide-react"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface DashboardStats {
  totalClients: number
  totalProjects: number
  totalUnits: number
  availableUnits: number
  totalContracts: number
  activeContracts: number
  overdueInstallments: number
  pendingInstallments: number
  totalRevenue: number
  totalExpenses: number
  monthlyRevenue: number
  monthlyExpenses: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalClients: 0,
    totalProjects: 0,
    totalUnits: 0,
    availableUnits: 0,
    totalContracts: 0,
    activeContracts: 0,
    overdueInstallments: 0,
    pendingInstallments: 0,
    totalRevenue: 0,
    totalExpenses: 0,
    monthlyRevenue: 0,
    monthlyExpenses: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      // Fetch all stats in parallel
      const [
        clientsRes,
        projectsRes,
        unitsRes,
        contractsRes,
        installmentsRes,
      ] = await Promise.all([
        fetch('/api/clients'),
        fetch('/api/projects'),
        fetch('/api/units'),
        fetch('/api/contracts'),
        fetch('/api/installments'),
      ])

      if (clientsRes.ok && projectsRes.ok && unitsRes.ok && contractsRes.ok && installmentsRes.ok) {
        const clients = await clientsRes.json()
        const projects = await projectsRes.json()
        const units = await unitsRes.json()
        const contracts = await contractsRes.json()
        const installments = await installmentsRes.json()

        const now = new Date()
        const overdueInstallments = installments.filter((i: any) => 
          i.status === 'pending' && new Date(i.dueDate) < now
        )
        const pendingInstallments = installments.filter((i: any) => 
          i.status === 'pending'
        )

        setStats({
          totalClients: clients.length,
          totalProjects: projects.length,
          totalUnits: units.length,
          availableUnits: units.filter((u: any) => u.status === 'available').length,
          totalContracts: contracts.length,
          activeContracts: contracts.filter((c: any) => c.status === 'active').length,
          overdueInstallments: overdueInstallments.length,
          pendingInstallments: pendingInstallments.length,
          totalRevenue: 0, // Will be calculated from actual data
          totalExpenses: 0, // Will be calculated from actual data
          monthlyRevenue: 0, // Will be calculated from actual data
          monthlyExpenses: 0, // Will be calculated from actual data
        })
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: "العملاء",
      value: stats.totalClients,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      description: "إجمالي العملاء المسجلين"
    },
    {
      title: "المشاريع",
      value: stats.totalProjects,
      icon: Building2,
      color: "text-green-600",
      bgColor: "bg-green-50",
      description: "المشاريع النشطة والمكتملة"
    },
    {
      title: "الوحدات",
      value: `${stats.availableUnits}/${stats.totalUnits}`,
      icon: Home,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      description: "الوحدات المتاحة من الإجمالي"
    },
    {
      title: "العقود النشطة",
      value: `${stats.activeContracts}/${stats.totalContracts}`,
      icon: FileText,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      description: "العقود النشطة من الإجمالي"
    },
    {
      title: "أقساط متأخرة",
      value: stats.overdueInstallments,
      icon: AlertCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      description: "أقساط تجاوزت تاريخ الاستحقاق"
    },
    {
      title: "أقساط مستحقة",
      value: stats.pendingInstallments,
      icon: Calendar,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      description: "أقساط في انتظار السداد"
    },
  ]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  }

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-2 text-sm text-muted-foreground">جاري تحميل البيانات...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">لوحة التحكم</h1>
        <p className="text-muted-foreground">نظرة عامة على أداء النظام</p>
      </div>

      {/* Stats Grid */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
      >
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div key={index} variants={item}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <div className={`rounded-lg p-2 ${stat.bgColor}`}>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Revenue Chart */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>الإيرادات والمصروفات</CardTitle>
            <CardDescription>ملخص الحركة المالية للشهر الحالي</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">الإيرادات</span>
                  <span className="text-lg font-bold text-green-600">
                    {new Intl.NumberFormat('ar-EG', {
                      style: 'currency',
                      currency: 'EGP'
                    }).format(stats.monthlyRevenue)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">المصروفات</span>
                  <span className="text-lg font-bold text-red-600">
                    {new Intl.NumberFormat('ar-EG', {
                      style: 'currency',
                      currency: 'EGP'
                    }).format(stats.monthlyExpenses)}
                  </span>
                </div>
                <div className="flex items-center justify-between border-t pt-2">
                  <span className="text-sm font-medium">صافي الربح</span>
                  <span className="text-lg font-bold">
                    {new Intl.NumberFormat('ar-EG', {
                      style: 'currency',
                      currency: 'EGP'
                    }).format(stats.monthlyRevenue - stats.monthlyExpenses)}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <TrendingUp className="h-24 w-24 text-muted-foreground/20" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>إجراءات سريعة</CardTitle>
            <CardDescription>اختصارات للعمليات الشائعة</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 md:grid-cols-4">
              <a href="/contracts/new" className="rounded-lg border p-4 text-center hover:bg-accent">
                <FileText className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="mt-2 text-sm font-medium">عقد جديد</p>
              </a>
              <a href="/clients/new" className="rounded-lg border p-4 text-center hover:bg-accent">
                <Users className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="mt-2 text-sm font-medium">عميل جديد</p>
              </a>
              <a href="/units/new" className="rounded-lg border p-4 text-center hover:bg-accent">
                <Home className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="mt-2 text-sm font-medium">وحدة جديدة</p>
              </a>
              <a href="/accounting/vouchers/new" className="rounded-lg border p-4 text-center hover:bg-accent">
                <DollarSign className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="mt-2 text-sm font-medium">سند قبض</p>
              </a>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}