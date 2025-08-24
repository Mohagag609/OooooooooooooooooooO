import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`
    
    return NextResponse.json({
      ok: true,
      db: 'up',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Health check failed:', error)
    return NextResponse.json(
      {
        ok: false,
        db: 'down',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}