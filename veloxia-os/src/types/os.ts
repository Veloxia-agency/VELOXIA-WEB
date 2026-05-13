export interface SystemLogEntry {
  id: string
  timestamp: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error' | 'agent'
}

export interface Metric {
  id: string
  label: string
  value: string | number
  delta?: string
  trend: 'up' | 'down' | 'neutral'
  unit?: string
}

export interface Automation {
  id: string
  name: string
  description: string
  trigger: string
  webhook: string
  status: 'active' | 'paused' | 'error'
  runs_today: number
  last_run?: string
}

export interface Task {
  id: string
  title: string
  description?: string
  status: 'pending' | 'in_progress' | 'done'
  priority: 'low' | 'medium' | 'high'
  agent?: string
  due_date?: string
  created_at: string
}

export type VoiceState = 'idle' | 'listening' | 'processing' | 'speaking' | 'error'
