'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Package, Warehouse, ArrowRightLeft, BarChart3 } from "lucide-react"
import { motion } from "framer-motion"
import { formatCurrency } from "@/lib/utils"

interface Warehouse {
  id: string
  code: string
  name: string
  location?: string
  isActive: boolean
  createdAt: string
  _count?: {
    materialMoves: number
  }
}

interface Material {
  id: string
  code: string
  name: string
  unit: string
  minQuantity: number
  currentQty: number
  lastPrice: number
  category?: string
  description?: string
  createdAt: string
  _count?: {
    materialMoves: number
  }
}

export default function WarehousesPage() {
  const [activeTab, setActiveTab] = useState<'warehouses' | 'materials'>('warehouses')
  const [warehouses, setWarehouses] = useState<Warehouse[]>([])
  const [materials, setMaterials] = useState<Material[]>([])
  const [loading, setLoading] = useState(true)
  const [showWarehouseForm, setShowWarehouseForm] = useState(false)
  const [showMaterialForm, setShowMaterialForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [error, setError] = useState('')
  
  const [warehouseData, setWarehouseData] = useState({
    code: '',
    name: '',
    location: '',
    isActive: true
  })
  
  const [materialData, setMaterialData] = useState({
    code: '',
    name: '',
    unit: 'قطعة',
    minQuantity: '',
    category: '',
    description: ''
  })

  useEffect(() => {
    fetchWarehouses()
    fetchMaterials()
  }, [])

  const fetchWarehouses = async () => {
    try {
      const response = await fetch('/api/warehouses')
      if (response.ok) {
        const data = await response.json()
        setWarehouses(data)
      }
    } catch (error) {
      console.error('Error fetching warehouses:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMaterials = async () => {
    try {
      const response = await fetch('/api/materials')
      if (response.ok) {
        const data = await response.json()
        setMaterials(data)
      }
    } catch (error) {
      console.error('Error fetching materials:', error)
    }
  }

  const handleWarehouseSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    try {
      const response = await fetch('/api/warehouses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(warehouseData),
      })
      
      const result = await response.json()
      
      if (response.ok) {
        await fetchWarehouses()
        setWarehouseData({
          code: '',
          name: '',
          location: '',
          isActive: true
        })
        setShowWarehouseForm(false)
      } else {
        setError(result.message || result.error || 'حدث خطأ في حفظ البيانات')
      }
    } catch (error) {
      console.error('Error creating warehouse:', error)
      setError('حدث خطأ في الاتصال بالخادم')
    }
  }

  const handleMaterialSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    try {
      const response = await fetch('/api/materials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...materialData,
          minQuantity: parseFloat(materialData.minQuantity) || 0
        }),
      })
      
      const result = await response.json()
      
      if (response.ok) {
        await fetchMaterials()
        setMaterialData({
          code: '',
          name: '',
          unit: 'قطعة',
          minQuantity: '',
          category: '',
          description: ''
        })
        setShowMaterialForm(false)
      } else {
        setError(result.message || result.error || 'حدث خطأ في حفظ البيانات')
      }
    } catch (error) {
      console.error('Error creating material:', error)
      setError('حدث خطأ في الاتصال بالخادم')
    }
  }

  const filteredWarehouses = warehouses.filter(warehouse =>
    warehouse.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    warehouse.code.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredMaterials = materials.filter(material =>
    material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.code.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 className="text-3xl font-bold">المخازن والمواد</h1>
          <p className="text-muted-foreground">إدارة المخازن والمواد وحركة المخزون</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('warehouses')}
            className={`pb-2 px-1 border-b-2 transition-colors ${
              activeTab === 'warehouses'
                ? 'border-primary text-primary font-medium'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            المخازن
          </button>
          <button
            onClick={() => setActiveTab('materials')}
            className={`pb-2 px-1 border-b-2 transition-colors ${
              activeTab === 'materials'
                ? 'border-primary text-primary font-medium'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            المواد
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-4">
        <Card className="flex-1">
          <CardHeader className="pb-3">
            <div className="relative">
              <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={activeTab === 'warehouses' ? 'البحث في المخازن...' : 'البحث في المواد...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
          </CardHeader>
        </Card>
        
        {activeTab === 'warehouses' ? (
          <Button onClick={() => setShowWarehouseForm(true)}>
            <Plus className="ml-2 h-4 w-4" />
            مخزن جديد
          </Button>
        ) : (
          <Button onClick={() => setShowMaterialForm(true)}>
            <Plus className="ml-2 h-4 w-4" />
            مادة جديدة
          </Button>
        )}
      </div>

      {/* Warehouse Form Modal */}
      {showWarehouseForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md"
          >
            <Card>
              <CardHeader>
                <CardTitle>إضافة مخزن جديد</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleWarehouseSubmit} className="space-y-4">
                  {error && (
                    <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                      {error}
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="code">كود المخزن *</Label>
                      <Input
                        id="code"
                        value={warehouseData.code}
                        onChange={(e) => setWarehouseData({ ...warehouseData, code: e.target.value })}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="name">اسم المخزن *</Label>
                      <Input
                        id="name"
                        value={warehouseData.name}
                        onChange={(e) => setWarehouseData({ ...warehouseData, name: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location">الموقع</Label>
                    <Input
                      id="location"
                      value={warehouseData.location}
                      onChange={(e) => setWarehouseData({ ...warehouseData, location: e.target.value })}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={warehouseData.isActive}
                      onChange={(e) => setWarehouseData({ ...warehouseData, isActive: e.target.checked })}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="isActive" className="mr-2">مخزن نشط</Label>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button type="submit" className="flex-1">
                      حفظ
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowWarehouseForm(false)
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

      {/* Material Form Modal */}
      {showMaterialForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md"
          >
            <Card>
              <CardHeader>
                <CardTitle>إضافة مادة جديدة</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleMaterialSubmit} className="space-y-4">
                  {error && (
                    <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                      {error}
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="code">كود المادة *</Label>
                      <Input
                        id="code"
                        value={materialData.code}
                        onChange={(e) => setMaterialData({ ...materialData, code: e.target.value })}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="name">اسم المادة *</Label>
                      <Input
                        id="name"
                        value={materialData.name}
                        onChange={(e) => setMaterialData({ ...materialData, name: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="unit">وحدة القياس *</Label>
                      <Select value={materialData.unit} onValueChange={(value) => setMaterialData({ ...materialData, unit: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="قطعة">قطعة</SelectItem>
                          <SelectItem value="متر">متر</SelectItem>
                          <SelectItem value="متر مربع">متر مربع</SelectItem>
                          <SelectItem value="متر مكعب">متر مكعب</SelectItem>
                          <SelectItem value="كيلو">كيلو</SelectItem>
                          <SelectItem value="طن">طن</SelectItem>
                          <SelectItem value="لتر">لتر</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="minQuantity">الحد الأدنى</Label>
                      <Input
                        id="minQuantity"
                        type="number"
                        value={materialData.minQuantity}
                        onChange={(e) => setMaterialData({ ...materialData, minQuantity: e.target.value })}
                        placeholder="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category">الفئة</Label>
                    <Input
                      id="category"
                      value={materialData.category}
                      onChange={(e) => setMaterialData({ ...materialData, category: e.target.value })}
                      placeholder="مثال: مواد بناء، حديد، أسمنت"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">الوصف</Label>
                    <textarea
                      id="description"
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={materialData.description}
                      onChange={(e) => setMaterialData({ ...materialData, description: e.target.value })}
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
                        setShowMaterialForm(false)
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

      {/* Content based on active tab */}
      {activeTab === 'warehouses' ? (
        // Warehouses Grid
        filteredWarehouses.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Warehouse className="h-12 w-12 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">لا توجد مخازن مسجلة</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredWarehouses.map((warehouse) => (
              <motion.div
                key={warehouse.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{warehouse.name}</CardTitle>
                        <CardDescription>كود: {warehouse.code}</CardDescription>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        warehouse.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {warehouse.isActive ? 'نشط' : 'غير نشط'}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {warehouse.location && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">الموقع:</span> {warehouse.location}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between pt-3 border-t">
                      <div className="text-sm text-muted-foreground">
                        حركات: {warehouse._count?.materialMoves || 0}
                      </div>
                      <Button variant="outline" size="sm">
                        <ArrowRightLeft className="ml-2 h-4 w-4" />
                        حركة مواد
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )
      ) : (
        // Materials Grid
        filteredMaterials.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">لا توجد مواد مسجلة</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredMaterials.map((material) => (
              <motion.div
                key={material.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{material.name}</CardTitle>
                        <CardDescription>
                          كود: {material.code} {material.category && `- ${material.category}`}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">الوحدة:</span> {material.unit}
                      </div>
                      <div>
                        <span className="text-muted-foreground">الحد الأدنى:</span> {material.minQuantity}
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">الكمية الحالية:</span>
                        <span className={`font-medium ${
                          material.currentQty < material.minQuantity ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {material.currentQty} {material.unit}
                        </span>
                      </div>
                      {material.lastPrice > 0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">آخر سعر:</span>
                          <span className="font-medium">{formatCurrency(material.lastPrice)}</span>
                        </div>
                      )}
                    </div>
                    
                    {material.currentQty < material.minQuantity && (
                      <div className="bg-red-50 text-red-700 text-xs p-2 rounded">
                        تحذير: الكمية أقل من الحد الأدنى
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between pt-3 border-t">
                      <div className="text-sm text-muted-foreground">
                        حركات: {material._count?.materialMoves || 0}
                      </div>
                      <Button variant="outline" size="sm">
                        <BarChart3 className="ml-2 h-4 w-4" />
                        كشف حركة
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )
      )}
    </div>
  )
}