import { prisma } from '@/lib/prisma'

async function getDashboardStats() {
  try {
    const [clients, units, contracts, installments] = await Promise.all([
      prisma.client.count(),
      prisma.unit.count(),
      prisma.contract.count(),
      prisma.installment.count()
    ])
    
    return { clients, units, contracts, installments }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return { clients: 0, units: 0, contracts: 0, installments: 0 }
  }
}

export default async function DashboardPage() {
  const stats = await getDashboardStats()
  
  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '30px' }}>لوحة التحكم</h1>
      
      <div className="grid">
        <div className="card" style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '10px', color: '#666' }}>العملاء</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1976d2' }}>{stats.clients}</p>
        </div>
        
        <div className="card" style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '10px', color: '#666' }}>الوحدات</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1976d2' }}>{stats.units}</p>
        </div>
        
        <div className="card" style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '10px', color: '#666' }}>العقود</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1976d2' }}>{stats.contracts}</p>
        </div>
        
        <div className="card" style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '10px', color: '#666' }}>الأقساط</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1976d2' }}>{stats.installments}</p>
        </div>
      </div>
    </div>
  )
}