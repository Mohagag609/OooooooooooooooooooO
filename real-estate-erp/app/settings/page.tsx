'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Settings as SettingsIcon, 
  Database, 
  Download, 
  Upload, 
  Shield,
  Bell,
  Moon,
  Sun,
  Globe,
  Save,
  RefreshCw,
  Trash2,
  AlertCircle,
  CheckCircle,
  Cloud,
  HardDrive
} from "lucide-react"
import { motion } from "framer-motion"

interface BackupItem {
  id: string
  filename: string
  size: string
  date: string
  type: 'manual' | 'scheduled'
  location: 'local' | 'cloud'
  status: 'success' | 'failed'
}

// Mock data for backups
const mockBackups: BackupItem[] = [
  {
    id: '1',
    filename: 'backup_2024_01_15_10_30.sql',
    size: '25.4 MB',
    date: '2024-01-15 10:30:00',
    type: 'scheduled',
    location: 'cloud',
    status: 'success'
  },
  {
    id: '2',
    filename: 'backup_2024_01_14_22_00.sql',
    size: '24.8 MB',
    date: '2024-01-14 22:00:00',
    type: 'scheduled',
    location: 'cloud',
    status: 'success'
  },
  {
    id: '3',
    filename: 'backup_2024_01_14_15_45.sql',
    size: '24.5 MB',
    date: '2024-01-14 15:45:00',
    type: 'manual',
    location: 'local',
    status: 'success'
  }
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'backup' | 'notifications'>('general')
  const [backups] = useState<BackupItem[]>(mockBackups)
  const [isBackingUp, setIsBackingUp] = useState(false)
  const [isRestoring, setIsRestoring] = useState(false)
  const [generalSettings, setGeneralSettings] = useState({
    companyName: 'شركة البناء والتعمير',
    language: 'ar',
    currency: 'EGP',
    dateFormat: 'DD/MM/YYYY',
    theme: 'light'
  })
  const [backupSettings, setBackupSettings] = useState({
    autoBackup: true,
    backupFrequency: 'daily',
    backupTime: '22:00',
    backupLocation: 'cloud',
    retentionDays: '30'
  })
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    overdueInstallments: true,
    contractExpiry: true,
    backupStatus: true,
    lowInventory: true
  })

  const handleBackup = async () => {
    setIsBackingUp(true)
    try {
      // Simulate backup process
      await new Promise(resolve => setTimeout(resolve, 3000))
      alert('تم إنشاء النسخة الاحتياطية بنجاح')
    } catch (error) {
      alert('حدث خطأ في إنشاء النسخة الاحتياطية')
    } finally {
      setIsBackingUp(false)
    }
  }

  const handleRestore = async (backupId: string) => {
    if (!confirm('هل أنت متأكد من استعادة هذه النسخة الاحتياطية؟ سيتم استبدال جميع البيانات الحالية.')) {
      return
    }
    
    setIsRestoring(true)
    try {
      // Simulate restore process
      await new Promise(resolve => setTimeout(resolve, 3000))
      alert('تم استعادة النسخة الاحتياطية بنجاح')
    } catch (error) {
      alert('حدث خطأ في استعادة النسخة الاحتياطية')
    } finally {
      setIsRestoring(false)
    }
  }

  const handleResetData = async () => {
    if (!confirm('هل أنت متأكد من إعادة تعيين بيانات المشروع؟ سيتم حذف جميع البيانات نهائياً.')) {
      return
    }
    
    if (!confirm('تأكيد نهائي: سيتم حذف جميع البيانات بشكل نهائي. هل تريد المتابعة؟')) {
      return
    }
    
    try {
      // Simulate reset process
      await new Promise(resolve => setTimeout(resolve, 2000))
      alert('تم إعادة تعيين بيانات المشروع بنجاح')
    } catch (error) {
      alert('حدث خطأ في إعادة تعيين البيانات')
    }
  }

  const saveSettings = async () => {
    try {
      // Simulate saving settings
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert('تم حفظ الإعدادات بنجاح')
    } catch (error) {
      alert('حدث خطأ في حفظ الإعدادات')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">الإعدادات</h1>
        <p className="text-muted-foreground">إدارة إعدادات النظام والنسخ الاحتياطي</p>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('general')}
            className={`pb-2 px-1 border-b-2 transition-colors ${
              activeTab === 'general'
                ? 'border-primary text-primary font-medium'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <div className="flex items-center gap-2">
              <SettingsIcon className="h-4 w-4" />
              إعدادات عامة
            </div>
          </button>
          <button
            onClick={() => setActiveTab('backup')}
            className={`pb-2 px-1 border-b-2 transition-colors ${
              activeTab === 'backup'
                ? 'border-primary text-primary font-medium'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              النسخ الاحتياطي
            </div>
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`pb-2 px-1 border-b-2 transition-colors ${
              activeTab === 'notifications'
                ? 'border-primary text-primary font-medium'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              الإشعارات
            </div>
          </button>
        </div>
      </div>

      {/* General Settings */}
      {activeTab === 'general' && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>معلومات الشركة</CardTitle>
              <CardDescription>البيانات الأساسية للشركة</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">اسم الشركة</Label>
                <Input
                  id="companyName"
                  value={generalSettings.companyName}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, companyName: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="currency">العملة</Label>
                <Select 
                  value={generalSettings.currency} 
                  onValueChange={(value) => setGeneralSettings({ ...generalSettings, currency: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EGP">جنيه مصري (EGP)</SelectItem>
                    <SelectItem value="USD">دولار أمريكي (USD)</SelectItem>
                    <SelectItem value="SAR">ريال سعودي (SAR)</SelectItem>
                    <SelectItem value="AED">درهم إماراتي (AED)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateFormat">تنسيق التاريخ</Label>
                <Select 
                  value={generalSettings.dateFormat} 
                  onValueChange={(value) => setGeneralSettings({ ...generalSettings, dateFormat: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                    <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                    <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={saveSettings} className="w-full">
                <Save className="ml-2 h-4 w-4" />
                حفظ الإعدادات
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>المظهر واللغة</CardTitle>
              <CardDescription>تخصيص واجهة النظام</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="language">اللغة</Label>
                <Select 
                  value={generalSettings.language} 
                  onValueChange={(value) => setGeneralSettings({ ...generalSettings, language: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ar">العربية</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>المظهر</Label>
                <div className="flex gap-2">
                  <Button
                    variant={generalSettings.theme === 'light' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setGeneralSettings({ ...generalSettings, theme: 'light' })}
                  >
                    <Sun className="ml-2 h-4 w-4" />
                    فاتح
                  </Button>
                  <Button
                    variant={generalSettings.theme === 'dark' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setGeneralSettings({ ...generalSettings, theme: 'dark' })}
                  >
                    <Moon className="ml-2 h-4 w-4" />
                    داكن
                  </Button>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button variant="destructive" className="w-full" onClick={handleResetData}>
                  <Trash2 className="ml-2 h-4 w-4" />
                  إعادة تعيين بيانات المشروع
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  تحذير: سيتم حذف جميع البيانات بشكل نهائي
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Backup Settings */}
      {activeTab === 'backup' && (
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>إعدادات النسخ الاحتياطي</CardTitle>
                <CardDescription>تكوين النسخ الاحتياطي التلقائي</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="autoBackup">النسخ الاحتياطي التلقائي</Label>
                  <input
                    type="checkbox"
                    id="autoBackup"
                    checked={backupSettings.autoBackup}
                    onChange={(e) => setBackupSettings({ ...backupSettings, autoBackup: e.target.checked })}
                    className="h-4 w-4"
                  />
                </div>

                {backupSettings.autoBackup && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="frequency">التكرار</Label>
                      <Select 
                        value={backupSettings.backupFrequency} 
                        onValueChange={(value) => setBackupSettings({ ...backupSettings, backupFrequency: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">يومي</SelectItem>
                          <SelectItem value="weekly">أسبوعي</SelectItem>
                          <SelectItem value="monthly">شهري</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="time">وقت النسخ</Label>
                      <Input
                        id="time"
                        type="time"
                        value={backupSettings.backupTime}
                        onChange={(e) => setBackupSettings({ ...backupSettings, backupTime: e.target.value })}
                      />
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <Label htmlFor="location">موقع الحفظ</Label>
                  <Select 
                    value={backupSettings.backupLocation} 
                    onValueChange={(value) => setBackupSettings({ ...backupSettings, backupLocation: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="local">محلي</SelectItem>
                      <SelectItem value="cloud">سحابي</SelectItem>
                      <SelectItem value="both">محلي وسحابي</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="retention">مدة الاحتفاظ (أيام)</Label>
                  <Input
                    id="retention"
                    type="number"
                    value={backupSettings.retentionDays}
                    onChange={(e) => setBackupSettings({ ...backupSettings, retentionDays: e.target.value })}
                  />
                </div>

                <Button onClick={saveSettings} className="w-full">
                  <Save className="ml-2 h-4 w-4" />
                  حفظ الإعدادات
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>نسخ احتياطي يدوي</CardTitle>
                <CardDescription>إنشاء نسخة احتياطية فورية</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={handleBackup} 
                  disabled={isBackingUp}
                  className="w-full"
                  size="lg"
                >
                  {isBackingUp ? (
                    <>
                      <RefreshCw className="ml-2 h-5 w-5 animate-spin" />
                      جاري إنشاء النسخة...
                    </>
                  ) : (
                    <>
                      <Database className="ml-2 h-5 w-5" />
                      إنشاء نسخة احتياطية الآن
                    </>
                  )}
                </Button>

                <div className="pt-4 border-t">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-green-600" />
                      <span>النسخ الاحتياطية مشفرة وآمنة</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Cloud className="h-4 w-4 text-blue-600" />
                      <span>تخزين سحابي آمن</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4 text-orange-600" />
                      <span>استعادة سريعة وسهلة</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Backups List */}
          <Card>
            <CardHeader>
              <CardTitle>النسخ الاحتياطية السابقة</CardTitle>
              <CardDescription>قائمة بجميع النسخ الاحتياطية المتاحة</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-right p-2 font-medium text-muted-foreground">اسم الملف</th>
                      <th className="text-right p-2 font-medium text-muted-foreground">الحجم</th>
                      <th className="text-right p-2 font-medium text-muted-foreground">التاريخ</th>
                      <th className="text-right p-2 font-medium text-muted-foreground">النوع</th>
                      <th className="text-right p-2 font-medium text-muted-foreground">الموقع</th>
                      <th className="text-right p-2 font-medium text-muted-foreground">الحالة</th>
                      <th className="text-right p-2 font-medium text-muted-foreground">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {backups.map((backup) => (
                      <tr key={backup.id} className="border-b hover:bg-muted/50">
                        <td className="p-2 font-mono text-sm">{backup.filename}</td>
                        <td className="p-2">{backup.size}</td>
                        <td className="p-2">{backup.date}</td>
                        <td className="p-2">
                          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs ${
                            backup.type === 'manual' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {backup.type === 'manual' ? 'يدوي' : 'تلقائي'}
                          </span>
                        </td>
                        <td className="p-2">
                          <div className="flex items-center gap-1">
                            {backup.location === 'cloud' ? (
                              <Cloud className="h-3 w-3" />
                            ) : (
                              <HardDrive className="h-3 w-3" />
                            )}
                            <span className="text-sm">
                              {backup.location === 'cloud' ? 'سحابي' : 'محلي'}
                            </span>
                          </div>
                        </td>
                        <td className="p-2">
                          {backup.status === 'success' ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-red-600" />
                          )}
                        </td>
                        <td className="p-2">
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRestore(backup.id)}
                              disabled={isRestoring}
                            >
                              <Upload className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                            >
                              <Download className="h-3 w-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Notification Settings */}
      {activeTab === 'notifications' && (
        <div className="grid gap-6 max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>إعدادات الإشعارات</CardTitle>
              <CardDescription>تحكم في الإشعارات والتنبيهات</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">إشعارات البريد الإلكتروني</p>
                    <p className="text-sm text-muted-foreground">تلقي إشعارات عبر البريد الإلكتروني</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationSettings.emailNotifications}
                    onChange={(e) => setNotificationSettings({ 
                      ...notificationSettings, 
                      emailNotifications: e.target.checked 
                    })}
                    className="h-4 w-4"
                  />
                </div>

                {notificationSettings.emailNotifications && (
                  <div className="mr-6 space-y-4 border-r pr-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">الأقساط المتأخرة</p>
                        <p className="text-sm text-muted-foreground">تنبيه عند تأخر سداد الأقساط</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notificationSettings.overdueInstallments}
                        onChange={(e) => setNotificationSettings({ 
                          ...notificationSettings, 
                          overdueInstallments: e.target.checked 
                        })}
                        className="h-4 w-4"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">انتهاء العقود</p>
                        <p className="text-sm text-muted-foreground">تنبيه قبل انتهاء العقود</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notificationSettings.contractExpiry}
                        onChange={(e) => setNotificationSettings({ 
                          ...notificationSettings, 
                          contractExpiry: e.target.checked 
                        })}
                        className="h-4 w-4"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">حالة النسخ الاحتياطي</p>
                        <p className="text-sm text-muted-foreground">تنبيه بنجاح أو فشل النسخ الاحتياطي</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notificationSettings.backupStatus}
                        onChange={(e) => setNotificationSettings({ 
                          ...notificationSettings, 
                          backupStatus: e.target.checked 
                        })}
                        className="h-4 w-4"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">نقص المخزون</p>
                        <p className="text-sm text-muted-foreground">تنبيه عند انخفاض المخزون عن الحد الأدنى</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notificationSettings.lowInventory}
                        onChange={(e) => setNotificationSettings({ 
                          ...notificationSettings, 
                          lowInventory: e.target.checked 
                        })}
                        className="h-4 w-4"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t">
                <Button onClick={saveSettings} className="w-full">
                  <Save className="ml-2 h-4 w-4" />
                  حفظ إعدادات الإشعارات
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}