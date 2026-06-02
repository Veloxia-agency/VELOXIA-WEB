import { NextRequest, NextResponse } from 'next/server'
import { fetchOperation } from '@/lib/airtable/adapters'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const record = await fetchOperation(params.id)
    if (!record) {
      return NextResponse.json({ error: 'Operación no encontrada' }, { status: 404 })
    }
    return NextResponse.json({ record })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error desconocido'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
