import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'
import { route, isSensitive } from '@/lib/agents/centralOrchestrator'
import type { AgentContext } from '@/lib/agents/types'
import type { Option, AgentId, PersonalityMode } from '@/lib/agents/types'

export interface ApiMessage {
  role: 'user' | 'assistant'
  content: string
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      message?:             string
      command?:             string
      messages?:            ApiMessage[]
      history?:             ApiMessage[]
      personality?:         PersonalityMode
      mode?:                'operative' | 'viral'
      lastAgentId?:         AgentId
      lastOptions?:         Option[]
      lastWorkflowId?:      string
      lastWorkflowContext?: string
    }

    // Resolve the user's message from any legacy or new format
    const input: string =
      body.message ??
      body.command ??
      body.messages?.filter(m => m.role === 'user').at(-1)?.content ??
      ''

    if (!input.trim()) {
      return NextResponse.json({ error: 'No input provided' }, { status: 400 })
    }

    // Resolve history (strip the last user message — it's already in `input`)
    const rawHistory: ApiMessage[] =
      body.history ??
      body.messages ??
      []

    const history = rawHistory.filter(m =>
      !(m.role === 'user' && m.content === input)
    )

    const context: AgentContext = {
      history,
      lastAgentId:         body.lastAgentId,
      lastOptions:         body.lastOptions,
      lastWorkflowId:      body.lastWorkflowId,
      lastWorkflowContext: body.lastWorkflowContext,
      personality:         body.personality  ?? 'professional',
      mode:                body.mode         ?? 'operative',
    }

    const structured = await route(input, context)

    return NextResponse.json({
      ...structured,
      // Backward-compat fields for /voice and /chat that read `response` or `text`
      text:                 structured.rawText || structured.diagnosis,
      response:             structured.rawText || structured.diagnosis,
      agent:                structured.agentId,
      intent:               'classified',
      requiresConfirmation: isSensitive(input, structured.agentId),
    })

  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    console.error('[/api/chat]', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
