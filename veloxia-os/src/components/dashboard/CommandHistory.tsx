'use client'

import { useOSStore } from '@/store/osStore'
import { COMMAND_HISTORY } from '@/lib/mockData'
import { AGENTS } from '@/lib/mockData'
import { clsx } from 'clsx'

export default function CommandHistory() {
  const storeHistory = useOSStore((s) => s.commandHistory)
  const history = storeHistory.length > 0 ? storeHistory : COMMAND_HISTORY

  return (
    <div className="border border-gold/[0.18] bg-surface h-full flex flex-col">
      <div className="px-4 py-2.5 border-b border-gold/10">
        <span className="font-mono-os text-[10px] tracking-[3px] text-muted/60 uppercase">
          Últimos comandos
        </span>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {history.map((cmd) => {
          const agent = AGENTS.find((a) => a.id === cmd.agent)
          return (
            <div
              key={cmd.id}
              className="border border-gold/10 bg-surface2 p-3 hover:border-gold/25 transition-colors"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className="font-mono-os text-[9px] px-1.5 py-0.5 border"
                  style={{ color: agent?.color, borderColor: `${agent?.color}40` }}
                >
                  {agent?.name ?? cmd.agent}
                </span>
                <span className="font-mono-os text-[9px] text-muted/40">{cmd.timestamp}</span>
              </div>
              <p className="font-mono-os text-[11px] text-white mb-1 leading-relaxed">
                "{cmd.text}"
              </p>
              <p className="font-mono-os text-[10px] text-muted/60 truncate">
                {cmd.response}
              </p>
              <p className="font-mono-os text-[9px] text-muted/30 mt-1">
                {cmd.duration_ms}ms
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
