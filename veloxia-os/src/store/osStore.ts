import { create } from 'zustand'
import type { AgentId, AgentStatus, Command } from '@/types/agents'
import type { SystemLogEntry, VoiceState, Metric } from '@/types/os'
import { INITIAL_LOGS, METRICS, AGENTS } from '@/lib/mockData'

interface AgentState {
  id: AgentId
  status: AgentStatus
}

interface OSStore {
  // Logs
  logs: SystemLogEntry[]
  addLog: (message: string, type?: SystemLogEntry['type']) => void
  clearLogs: () => void

  // Voice
  voiceState: VoiceState
  transcript: string
  setVoiceState: (state: VoiceState) => void
  setTranscript: (text: string) => void

  // Active agent
  activeAgent: AgentId | null
  agentStatuses: AgentState[]
  setActiveAgent: (id: AgentId | null) => void
  setAgentStatus: (id: AgentId, status: AgentStatus) => void

  // Commands
  commandHistory: Command[]
  addCommand: (cmd: Command) => void

  // Metrics
  metrics: Metric[]
  updateMetric: (id: string, value: string | number) => void

  // Confirmation modal
  pendingAction: { title: string; description: string; onConfirm: () => void } | null
  setPendingAction: (action: OSStore['pendingAction']) => void
}

export const useOSStore = create<OSStore>((set) => ({
  // Logs
  logs: INITIAL_LOGS,
  addLog: (message, type = 'info') =>
    set((state) => ({
      logs: [
        {
          id: Date.now().toString(),
          timestamp: new Date().toLocaleTimeString('es-ES', { hour12: false }),
          message,
          type,
        },
        ...state.logs,
      ].slice(0, 100),
    })),
  clearLogs: () => set({ logs: [] }),

  // Voice
  voiceState: 'idle',
  transcript: '',
  setVoiceState: (voiceState) => set({ voiceState }),
  setTranscript: (transcript) => set({ transcript }),

  // Agents
  activeAgent: null,
  agentStatuses: AGENTS.map((a) => ({ id: a.id, status: a.status })),
  setActiveAgent: (activeAgent) => set({ activeAgent }),
  setAgentStatus: (id, status) =>
    set((state) => ({
      agentStatuses: state.agentStatuses.map((a) =>
        a.id === id ? { ...a, status } : a
      ),
    })),

  // Commands
  commandHistory: [],
  addCommand: (cmd) =>
    set((state) => ({
      commandHistory: [cmd, ...state.commandHistory].slice(0, 20),
    })),

  // Metrics
  metrics: METRICS,
  updateMetric: (id, value) =>
    set((state) => ({
      metrics: state.metrics.map((m) => (m.id === id ? { ...m, value } : m)),
    })),

  // Confirmation
  pendingAction: null,
  setPendingAction: (pendingAction) => set({ pendingAction }),
}))
