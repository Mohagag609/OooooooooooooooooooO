'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Search, Edit, Trash2, X, Package } from "lucide-react"
import { motion } from "framer-motion"
import { parseApiResponse, getErrorMessage } from "@/lib/api-utils"

interface Supplier {
  id: string
  code: string
  name: string
  phone?: string
  email?: string
  address?: string
  note?: string
  createdAt: string
  _count?: {
    expenses: number
    invoices: number
  }
}

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    phone: '',
    email: '',
    address: '',
    note: ''
  })

  useEffect(() => {
    fetchSuppliers()
  }, [])

  const fetchSuppliers = async () => {
    try {
      const response = await fetch('/api/suppliers')
      if (response.ok) {
        const data = await response.json()
        setSuppliers(data)
      }
    } catch (error) {
      console.error('Error fetching suppliers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    try {
      const response = await fetch('/api/suppliers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      
      const result = await parseApiResponse(response)
      
      if (response.ok) {
        await fetchSuppliers()
        setFormData({ code: '', name: '', phone: '', email: '', address: '', note: '' })
        setShowForm(false)
      } else {
        setError(getErrorMessage(result))
      }
    } catch (error) {
      console.error('Error creating supplier:', error)
      setError('حدث خطأ في الاتصال بالخادم')
    }
  }

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.phone?.includes(searchTerm)
  )

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">الموردين</h1>
          <p className="text-muted-foreground">إدارة بيانات الموردين</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="ml-2 h-4 w-4" />
          مورد جديد
        </Button>
      </div>

      {/* Search Bar */}
      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="البحث عن مورد..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>
        </CardHeader>
      </Card>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md"
          >
            <Card>
              <CardHeader>
                <CardTitle>إضافة مورد جديد</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-4"
                  onClick={() => {
                    setShowForm(false)
                    setError('')
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                      {error}
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="code">كود المورد *</Label>
                      <Input
                        id="code"
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="name">اسم المورد *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">رقم الهاتف</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">البريد الإلكتروني</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">العنوان</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="note">ملاحظات</Label>
                    <textarea
                      id="note"
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={formData.note}
                      onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                    />
                  </div>
                  
                  <div className="flex gap-3">
                    <Button type="submit" className="flex-1">
                      حفظ
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowForm(false)
                        setError('')
                      }}
                    >
                      إلغاء
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}

      {/* Suppliers Grid */}
      {filteredSuppliers.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">لا يوجد موردين مسجلين</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredSuppliers.map((supplier) => (
            <motion.div
              key={supplier.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{supplier.name}</CardTitle>
                      <CardDescription>كود: {supplier.code}</CardDescription>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {supplier.phone && (
                    <div className="text-sm">
                      <span className="font-medium">الهاتف:</span> {supplier.phone}
                    </div>
                  )}
                  {supplier.email && (
                    <div className="text-sm">
                      <span className="font-medium">البريد:</span> {supplier.email}
                    </div>
                  )}
                  {supplier.address && (
                    <div className="text-sm">
                      <span className="font-medium">العنوان:</span> {supplier.address}
                    </div>
                  )}
                  <div className="flex gap-4 pt-2 text-xs text-muted-foreground">
                    <span>مصروفات: {supplier._count?.expenses || 0}</span>
                    <span>فواتير: {supplier._count?.invoices || 0}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}