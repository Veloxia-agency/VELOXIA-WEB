'use client'

import { useOSStore } from '@/store/osStore'
import { AGENTS } from '@/lib/mockData'
import { clsx } from 'clsx'

const STATUS_COLOR = {
  ACTIVE:  'text-green-400 border-green-400/30 bg-green-400/10',
  STANDBY: 'text-muted/50 border-muted/20 bg-muted/5',
  RUNNING: 'text-gold border-gold/30 bg-gold/10',
  ERROR:   'text-red-400 border-red-400/30 bg-red-400/10',
}

const STATUS_DOT = {
  ACTIVE:  'bg-green-400',
  STANDBY: 'bg-muted/30',
  RUNNING: 'bg-gold animate-pulse',
  ERROR:   'bg-red-400',
}

export default function AgentStatusPanel() {
  const agentStatuses = useOSStore((s) => s.agentStatuses)
  const activeAgent = useOSStore((s) => s.activeAgent)

  const getStatus = (id: string) =>
    agentStatuses.find((a) => a.id === id)?.status ?? 'STANDBY'

  return (
    <div className="border border-gold/[0.18] bg-surface h-full flex flex-col">
      <div className="px-4 py-2.5 border-b border-gold/10">
        <span className="font-mono-os text-[10px] tracking-[3px] text-muted/60 uppercase">
          Agentes
        </span>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {AGENTS.map((agent) => {
          const status = getStatus(agent.id)
          const isActive = activeAgent === agent.id
          return (
            <div
              key={agent.id}
              className={clsx(
                'flex items-center gap-3 px-3 py-2 border transition-all duration-200',
                isActive
                  ? 'border-gold/40 bg-gold/5'
                  : 'border-transparent hover:border-gold/15'
              )}
            >
              <span className="text-base">{agent.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="font-mono-os text-[11px] text-white truncate">{agent.name}</p>
                {agent.lastUsed && (
                  <p className="font-mono-os text-[9px] text-muted/40">
                    último: {agent.lastUsed}
                  </p>
                )}
              </div>
              <div className={clsx(
                'flex items-center gap-1.5 px-2 py-0.5 border text-[9px] font-mono-os tracking-wider',
                STATUS_COLOR[status]
              )}>
                <span className={clsx('w-1 h-1 rounded-full', STATUS_DOT[status])} />
                {status}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
