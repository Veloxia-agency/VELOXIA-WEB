'use client'

import OSLayout from '@/components/layout/OSLayout'
import CommandOrb from '@/components/dashboard/CommandOrb'
import MetricCard from '@/components/dashboard/MetricCard'
import SystemLog from '@/components/dashboard/SystemLog'
import AgentStatusPanel from '@/components/dashboard/AgentStatusPanel'
import CommandHistory from '@/components/dashboard/CommandHistory'
import QuickActions from '@/components/dashboard/QuickActions'
import VoiceButton from '@/components/voice/VoiceButton'
import { useOSStore } from '@/store/osStore'
import { METRICS } from '@/lib/mockData'

export default function DashboardPage() {
  const voiceState = useOSStore((s) => s.voiceState)
  const setVoiceState = useOSStore((s) => s.setVoiceState)
  const setTranscript = useOSStore((s) => s.setTranscript)
  const addLog = useOSStore((s) => s.addLog)

  const toggleVoice = () => {
    if (voiceState === 'listening') {
      setVoiceState('idle')
      setTranscript('')
      addLog('Escucha detenida', 'info')
    } else if (voiceState === 'idle') {
      setVoiceState('listening')
      addLog('Escucha iniciada — esperando comando...', 'info')
      // TODO: Connect Web Speech API here (useVoice hook)
    }
  }

  return (
    <OSLayout>
      <div className="h-[calc(100vh-44px)] flex flex-col p-4 gap-3 overflow-hidden">

        {/* Row 1 — Metrics */}
        <div className="grid grid-cols-6 gap-3 shrink-0">
          {METRICS.map((m) => (
            <MetricCard key={m.id} metric={m} />
          ))}
        </div>

        {/* Row 2 — Main area */}
        <div className="flex gap-3 flex-1 min-h-0">

          {/* Left — Orb + voice */}
          <div className="w-64 shrink-0 border border-gold/[0.18] bg-surface flex flex-col">
            <div className="px-4 py-2.5 border-b border-gold/10">
              <span className="font-mono-os text-[10px] tracking-[3px] text-muted/60 uppercase">
                Comando central
              </span>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center gap-4">
              <CommandOrb />
              <VoiceButton onToggle={toggleVoice} size="lg" />
              <p className="font-mono-os text-[10px] text-muted/40 tracking-widest">
                {voiceState === 'idle' ? 'PULSA PARA HABLAR' : ''}
              </p>
            </div>
          </div>

          {/* Center — System Log */}
          <div className="flex-1 min-w-0">
            <SystemLog />
          </div>

          {/* Right — Agents */}
          <div className="w-56 shrink-0">
            <AgentStatusPanel />
          </div>

        </div>

        {/* Row 3 — Bottom */}
        <div className="flex gap-3 shrink-0 h-48">
          <div className="flex-1">
            <QuickActions />
          </div>
          <div className="w-80">
            <CommandHistory />
          </div>
        </div>

      </div>
    </OSLayout>
  )
}
