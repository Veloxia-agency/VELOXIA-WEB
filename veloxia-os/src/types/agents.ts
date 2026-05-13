export type AgentId =
  | 'orchestrator'
  | 'sales'
  | 'builder'
  | 'ops'
  | 'content'
  | 'mortgage'
  | 'personal'

export type AgentStatus = 'ACTIVE' | 'STANDBY' | 'RUNNING' | 'ERROR'

export interface Agent {
  id: AgentId
  name: string
  description: string
  status: AgentStatus
  color: string
  icon: string
  capabilities: string[]
  lastUsed?: string
}

export interface OrchestratorResponse {
  selected_agent: AgentId
  confidence: number
  intent: string
  suggested_action: string
  needs_confirmation: boolean
  automation_payload?: Record<string, unknown>
  response: string
}

export interface Command {
  id: string
  text: string
  timestamp: string
  agent: AgentId
  response: string
  duration_ms: number
}
