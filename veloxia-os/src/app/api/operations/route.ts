import { NextResponse } from 'next/server'
import { fetchOperations } from '@/lib/airtable/adapters'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const records = await fetchOperations()
    return NextResponse.json({ records }, {
      headers: { 'Cache-Control': 's-maxage=30, stale-while-revalidate=60' },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error desconocido'
    return NextResponse.json({ error: message, records: [] }, { status: 500 })
  }
}
