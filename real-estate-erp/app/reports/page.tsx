'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { 
  FileText, 
  Download, 
  Users, 
  Building2, 
  DollarSign, 
  Package,
  TrendingUp,
  Calendar,
  FileBarChart,
  Receipt
} from "lucide-react"
import { motion } from "framer-motion"

interface ReportType {
  id: string
  name: string
  description: string
  category: string
  icon: React.ComponentType<{ className?: string }>
  fields: {
    name: string
    label: string
    type: 'date' | 'select' | 'multiselect'
    options?: { value: string; label: string }[]
  }[]
}

const reportTypes: ReportType[] = [
  {
    id: 'clients-list',
    name: 'كشف العملاء',
    description: 'قائمة بجميع العملاء وبياناتهم',
    category: 'عملاء',
    icon: Users,
    fields: [
      {
        name: 'status',
        label: 'الحالة',
        type: 'select',
        options: [
          { value: 'all', label: 'الكل' },
          { value: 'active', label: 'نشط' },
          { value: 'inactive', label: 'غير نشط' }
        ]
      }
    ]
  },
  {
    id: 'projects-status',
    name: 'تقرير حالة المشاريع',
    description: 'عرض حالة جميع المشاريع',
    category: 'مشاريع',
    icon: Building2,
    fields: [
      {
        name: 'status',
        label: 'حالة المشروع',
        type: 'multiselect',
        options: [
          { value: 'active', label: 'نشط' },
          { value: 'completed', label: 'مكتمل' },
          { value: 'suspended', label: 'معلق' }
        ]
      },
      {
        name: 'dateFrom',
        label: 'من تاريخ',
        type: 'date'
      },
      {
        name: 'dateTo',
        label: 'إلى تاريخ',
        type: 'date'
      }
    ]
  },
  {
    id: 'installments-due',
    name: 'الأقساط المستحقة',
    description: 'تقرير بالأقساط المستحقة والمتأخرة',
    category: 'مالية',
    icon: Calendar,
    fields: [
      {
        name: 'status',
        label: 'حالة القسط',
        type: 'multiselect',
        options: [
          { value: 'pending', label: 'مستحق' },
          { value: 'overdue', label: 'متأخر' },
          { value: 'paid', label: 'مدفوع' },
          { value: 'partial', label: 'مدفوع جزئياً' }
        ]
      },
      {
        name: 'dateFrom',
        label: 'من تاريخ',
        type: 'date'
      },
      {
        name: 'dateTo',
        label: 'إلى تاريخ',
        type: 'date'
      }
    ]
  },
  {
    id: 'revenue-expenses',
    name: 'الإيرادات والمصروفات',
    description: 'تقرير شامل بالإيرادات والمصروفات',
    category: 'مالية',
    icon: TrendingUp,
    fields: [
      {
        name: 'period',
        label: 'الفترة',
        type: 'select',
        options: [
          { value: 'monthly', label: 'شهري' },
          { value: 'quarterly', label: 'ربع سنوي' },
          { value: 'yearly', label: 'سنوي' },
          { value: 'custom', label: 'مخصص' }
        ]
      },
      {
        name: 'dateFrom',
        label: 'من تاريخ',
        type: 'date'
      },
      {
        name: 'dateTo',
        label: 'إلى تاريخ',
        type: 'date'
      }
    ]
  },
  {
    id: 'inventory-status',
    name: 'حالة المخزون',
    description: 'تقرير بحالة المواد في المخازن',
    category: 'مخزون',
    icon: Package,
    fields: [
      {
        name: 'warehouse',
        label: 'المخزن',
        type: 'select',
        options: [
          { value: 'all', label: 'جميع المخازن' }
        ]
      },
      {
        name: 'stockLevel',
        label: 'مستوى المخزون',
        type: 'select',
        options: [
          { value: 'all', label: 'الكل' },
          { value: 'low', label: 'أقل من الحد الأدنى' },
          { value: 'zero', label: 'نفذ المخزون' }
        ]
      }
    ]
  },
  {
    id: 'contracts-summary',
    name: 'ملخص العقود',
    description: 'تقرير شامل بجميع العقود',
    category: 'عقود',
    icon: FileText,
    fields: [
      {
        name: 'status',
        label: 'حالة العقد',
        type: 'multiselect',
        options: [
          { value: 'active', label: 'نشط' },
          { value: 'completed', label: 'مكتمل' },
          { value: 'cancelled', label: 'ملغي' }
        ]
      },
      {
        name: 'dateFrom',
        label: 'من تاريخ',
        type: 'date'
      },
      {
        name: 'dateTo',
        label: 'إلى تاريخ',
        type: 'date'
      }
    ]
  },
  {
    id: 'cashflow',
    name: 'التدفق النقدي',
    description: 'تقرير التدفق النقدي للصناديق',
    category: 'مالية',
    icon: DollarSign,
    fields: [
      {
        name: 'cashbox',
        label: 'الصندوق',
        type: 'select',
        options: [
          { value: 'all', label: 'جميع الصناديق' }
        ]
      },
      {
        name: 'dateFrom',
        label: 'من تاريخ',
        type: 'date'
      },
      {
        name: 'dateTo',
        label: 'إلى تاريخ',
        type: 'date'
      }
    ]
  },
  {
    id: 'accounting-ledger',
    name: 'دفتر الأستاذ',
    description: 'كشف حساب تفصيلي',
    category: 'محاسبة',
    icon: FileBarChart,
    fields: [
      {
        name: 'account',
        label: 'الحساب',
        type: 'select',
        options: [
          { value: 'all', label: 'جميع الحسابات' }
        ]
      },
      {
        name: 'dateFrom',
        label: 'من تاريخ',
        type: 'date'
      },
      {
        name: 'dateTo',
        label: 'إلى تاريخ',
        type: 'date'
      }
    ]
  },
  {
    id: 'payroll-summary',
    name: 'كشف المرتبات',
    description: 'تقرير شامل بالمرتبات',
    category: 'موارد بشرية',
    icon: Receipt,
    fields: [
      {
        name: 'month',
        label: 'الشهر',
        type: 'select',
        options: [
          { value: '1', label: 'يناير' },
          { value: '2', label: 'فبراير' },
          { value: '3', label: 'مارس' },
          { value: '4', label: 'أبريل' },
          { value: '5', label: 'مايو' },
          { value: '6', label: 'يونيو' },
          { value: '7', label: 'يوليو' },
          { value: '8', label: 'أغسطس' },
          { value: '9', label: 'سبتمبر' },
          { value: '10', label: 'أكتوبر' },
          { value: '11', label: 'نوفمبر' },
          { value: '12', label: 'ديسمبر' }
        ]
      },
      {
        name: 'year',
        label: 'السنة',
        type: 'select',
        options: [
          { value: '2024', label: '2024' },
          { value: '2023', label: '2023' }
        ]
      }
    ]
  }
]

const categories = Array.from(new Set(reportTypes.map(r => r.category)))

export default function ReportsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedReport, setSelectedReport] = useState<ReportType | null>(null)
  const [reportParams, setReportParams] = useState<Record<string, any>>({})
  const [generating, setGenerating] = useState(false)

  const filteredReports = selectedCategory === 'all' 
    ? reportTypes 
    : reportTypes.filter(r => r.category === selectedCategory)

  const handleGenerateReport = async (format: 'pdf' | 'excel') => {
    if (!selectedReport) return
    
    setGenerating(true)
    
    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // In a real implementation, this would call an API endpoint
      console.log('Generating report:', {
        reportId: selectedReport.id,
        format,
        params: reportParams
      })
      
      // Show success message
      alert(`تم توليد التقرير بنجاح بصيغة ${format.toUpperCase()}`)
    } catch (error) {
      console.error('Error generating report:', error)
      alert('حدث خطأ في توليد التقرير')
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">التقارير</h1>
        <p className="text-muted-foreground">توليد وتصدير تقارير النظام</p>
      </div>

      {/* Category Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Label>تصنيف التقارير:</Label>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('all')}
              >
                الكل
              </Button>
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Reports List */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>التقارير المتاحة</CardTitle>
              <CardDescription>اختر تقريراً لتوليده</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {filteredReports.map((report) => {
                  const Icon = report.icon
                  return (
                    <motion.button
                      key={report.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setSelectedReport(report)
                        setReportParams({})
                      }}
                      className={`w-full rounded-lg border p-3 text-right transition-colors ${
                        selectedReport?.id === report.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:bg-muted/50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Icon className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div className="flex-1">
                          <p className="font-medium">{report.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {report.description}
                          </p>
                        </div>
                      </div>
                    </motion.button>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Report Configuration */}
        <div className="lg:col-span-2">
          {selectedReport ? (
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {(() => {
                    const Icon = selectedReport.icon
                    return <Icon className="h-5 w-5" />
                  })()}
                  {selectedReport.name}
                </CardTitle>
                <CardDescription>{selectedReport.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Report Parameters */}
                <div className="space-y-4">
                  <h3 className="font-medium">معاملات التقرير</h3>
                  {selectedReport.fields.map((field) => (
                    <div key={field.name} className="space-y-2">
                      <Label htmlFor={field.name}>{field.label}</Label>
                      {field.type === 'date' ? (
                        <Input
                          id={field.name}
                          type="date"
                          value={reportParams[field.name] || ''}
                          onChange={(e) => setReportParams({
                            ...reportParams,
                            [field.name]: e.target.value
                          })}
                        />
                      ) : field.type === 'select' ? (
                        <Select
                          value={reportParams[field.name] || ''}
                          onValueChange={(value) => setReportParams({
                            ...reportParams,
                            [field.name]: value
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={`اختر ${field.label}`} />
                          </SelectTrigger>
                          <SelectContent>
                            {field.options?.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : field.type === 'multiselect' ? (
                        <div className="space-y-2">
                          {field.options?.map((option) => (
                            <label
                              key={option.value}
                              className="flex items-center gap-2"
                            >
                              <input
                                type="checkbox"
                                checked={reportParams[field.name]?.includes(option.value) || false}
                                onChange={(e) => {
                                  const current = reportParams[field.name] || []
                                  if (e.target.checked) {
                                    setReportParams({
                                      ...reportParams,
                                      [field.name]: [...current, option.value]
                                    })
                                  } else {
                                    setReportParams({
                                      ...reportParams,
                                      [field.name]: current.filter((v: string) => v !== option.value)
                                    })
                                  }
                                }}
                                className="h-4 w-4 rounded border-gray-300"
                              />
                              <span className="text-sm">{option.label}</span>
                            </label>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>

                {/* Generate Buttons */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    onClick={() => handleGenerateReport('pdf')}
                    disabled={generating}
                    className="flex-1"
                  >
                    <Download className="ml-2 h-4 w-4" />
                    {generating ? 'جاري التوليد...' : 'تصدير PDF'}
                  </Button>
                  <Button
                    onClick={() => handleGenerateReport('excel')}
                    disabled={generating}
                    variant="outline"
                    className="flex-1"
                  >
                    <Download className="ml-2 h-4 w-4" />
                    {generating ? 'جاري التوليد...' : 'تصدير Excel'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <CardContent className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <p className="mt-4 text-muted-foreground">
                  اختر تقريراً من القائمة لعرض خيارات التوليد
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}