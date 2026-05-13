'use client'

import OSLayout from '@/components/layout/OSLayout'
import { AGENTS } from '@/lib/mockData'
import { useOSStore } from '@/store/osStore'
import { clsx } from 'clsx'
import { motion } from 'framer-motion'

const STATUS_STYLE = {
  ACTIVE:  { badge: 'text-green-400 border-green-400/30 bg-green-400/10', dot: 'bg-green-400' },
  STANDBY: { badge: 'text-muted/50 border-muted/20 bg-muted/5',          dot: 'bg-muted/30' },
  RUNNING: { badge: 'text-gold border-gold/30 bg-gold/10',                dot: 'bg-gold animate-pulse' },
  ERROR:   { badge: 'text-red-400 border-red-400/30 bg-red-400/10',       dot: 'bg-red-400' },
}

export default function AgentsPage() {
  const agentStatuses = useOSStore(s => s.agentStatuses)
  const setAgentStatus = useOSStore(s => s.setAgentStatus)
  const addLog = useOSStore(s => s.addLog)

  const getStatus = (id: string) =>
    agentStatuses.find(a => a.id === id)?.status ?? 'STANDBY'

  const activate = (id: string, name: string) => {
    setAgentStatus(id as any, 'RUNNING')
    addLog(`Agente activado manualmente: ${name}`, 'agent')
    setTimeout(() => { setAgentStatus(id as any, 'ACTIVE') }, 2000)
  }

  return (
    <OSLayout>
      <div className="p-6">
        <p className="font-mono-os text-[10px] tracking-[4px] text-gold/60 mb-1">// PANEL DE CONTROL</p>
        <h1 className="font-display text-5xl text-white tracking-wider mb-8">AGENTES IA</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {AGENTS.map((agent, i) => {
            const status = getStatus(agent.id)
            const s = STATUS_STYLE[status]
            return (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="border border-gold/[0.18] bg-surface p-5 hover:border-gold/35 transition-colors"
              >
                {/* Top row */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 border flex items-center justify-center text-xl"
                         style={{ borderColor: `${agent.color}40`, background: `${agent.color}10` }}>
                      {agent.icon}
                    </div>
                    <div>
                      <p className="font-mono-os text-xs text-white">{agent.name}</p>
                      {agent.lastUsed && (
                        <p className="font-mono-os text-[9px] text-muted/40">último: {agent.lastUsed}</p>
                      )}
                    </div>
                  </div>
                  <div className={clsx('flex items-center gap-1.5 px-2 py-0.5 border text-[9px] font-mono-os tracking-wider', s.badge)}>
                    <span className={clsx('w-1 h-1 rounded-full', s.dot)} />
                    {status}
                  </div>
                </div>

                <p className="font-mono-os text-[11px] text-muted/60 mb-4 leading-relaxed">
                  {agent.description}
                </p>

                {/* Capabilities */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {agent.capabilities.map(c => (
                    <span key={c} className="font-mono-os text-[9px] px-2 py-0.5 border border-gold/10 text-muted/40">
                      {c}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => activate(agent.id, agent.name)}
                  disabled={status === 'RUNNING'}
                  className="w-full border border-gold/25 text-gold font-mono-os text-[10px]
                             tracking-widest py-2 hover:bg-gold/10 transition-colors disabled:opacity-40"
                >
                  {status === 'RUNNING' ? 'EJECUTANDO...' : 'ACTIVAR AGENTE'}
                </button>
              </motion.div>
            )
          })}
        </div>
      </div>
    </OSLayout>
  )
}
