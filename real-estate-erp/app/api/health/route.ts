import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: 'unknown',
    environment: process.env.NODE_ENV,
    databaseUrl: process.env.DATABASE_URL ? 'configured' : 'not configured'
  }

  try {
    // محاولة الاتصال بقاعدة البيانات
    await prisma.$queryRaw`SELECT 1`
    health.database = 'connected'
  } catch (error) {
    health.status = 'error'
    health.database = 'disconnected'
    console.error('Database connection error:', error)
  }

  return NextResponse.json(health, {
    status: health.status === 'ok' ? 200 : 503
  })
}