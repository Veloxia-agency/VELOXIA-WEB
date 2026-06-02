import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

// TODO: Connect n8n webhook here when N8N_WEBHOOK_QUALIF is set
// NEVER send financial data externally without explicit human confirmation

const MOCK_ANALYSIS = {
  viability: 'Alta',
  riskProfile: 'Medio-bajo',
  recommendedBanks: ['Sabadell', 'Unicaja', 'Kutxabank'],
  ltv: 80,
  dti: 28,
  nextStep: 'Solicitar documentación completa y preparar expediente',
  notes: 'Perfil aceptable. Ingresos estables. Aportación suficiente para LTV 80%.',
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { clientName?: string; mortgageAmount?: number }
    const webhookUrl = process.env.N8N_WEBHOOK_QUALIF

    if (!webhookUrl) {
      return NextResponse.json({
        success: true,
        source: 'mock',
        clientName: body.clientName ?? 'Desconocido',
        analysis: MOCK_ANALYSIS,
        warning: 'Resultado mock — conecta N8N_WEBHOOK_QUALIF para análisis real',
      })
    }

    // Integration point: n8n webhook + human confirmation required
    return NextResponse.json({
      success: false,
      error: 'Integración n8n pendiente. Requiere validación humana antes de enviar datos reales.',
    }, { status: 501 })

  } catch {
    return NextResponse.json({ success: false, error: 'Solicitud inválida' }, { status: 400 })
  }
}

export async function GET() {
  return NextResponse.json({ status: 'FinanHogar QUALIF API — POST only' })
}
