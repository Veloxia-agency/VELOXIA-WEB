'use client'

import { useState } from 'react'
import OSLayout from '@/components/layout/OSLayout'
import { AUTOMATIONS } from '@/lib/mockData'
import type { Automation } from '@/types/os'
import { Zap, Pause, Play, AlertCircle } from 'lucide-react'
import { clsx } from 'clsx'

const STATUS_STYLE = {
  active: { color: 'text-green-400 border-green-400/30 bg-green-400/10', dot: 'bg-green-400 animate-pulse', label: 'ACTIVA' },
  paused: { color: 'text-muted/50 border-muted/20 bg-muted/5',           dot: 'bg-muted/30',                label: 'PAUSADA' },
  error:  { color: 'text-red-400 border-red-400/30 bg-red-400/10',       dot: 'bg-red-400',                 label: 'ERROR' },
}

export default function AutomationsPage() {
  const [autos, setAutos] = useState<Automation[]>(AUTOMATIONS)

  const toggle = (id: string) =>
    setAutos(as => as.map(a => a.id === id
      ? { ...a, status: a.status === 'active' ? 'paused' : 'active' }
      : a
    ))

  const totalRuns = autos.reduce((s, a) => s + a.runs_today, 0)
  const active    = autos.filter(a => a.status === 'active').length

  return (
    <OSLayout>
      <div className="p-6">
        <p className="font-mono-os text-[10px] tracking-[4px] text-gold/60 mb-1">// N8N INTEGRATIONS</p>
        <h1 className="font-display text-5xl text-white tracking-wider mb-6">AUTOMATIZACIONES</h1>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Activas',         value: active },
            { label: 'Ejecuciones hoy', value: totalRuns },
            { label: 'Total flujos',    value: autos.length },
          ].map(s => (
            <div key={s.label} className="border border-gold/[0.18] bg-surface p-4">
              <p className="font-mono-os text-[10px] text-muted/50 mb-1">{s.label}</p>
              <p className="font-display text-3xl text-white">{s.value}</p>
            </div>
          ))}
        </div>

        {/* List */}
        <div className="space-y-3">
          {autos.map(auto => {
            const s = STATUS_STYLE[auto.status]
            return (
              <div key={auto.id}
                className="border border-gold/[0.18] bg-surface p-5 flex items-center gap-5
                           hover:border-gold/30 transition-colors">
                <div className={clsx('w-10 h-10 border flex items-center justify-center shrink-0', s.color)}>
                  {auto.status === 'error' ? <AlertCircle size={18} /> : <Zap size={18} />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <p className="font-mono-os text-sm text-white">{auto.name}</p>
                    <div className={clsx('flex items-center gap-1.5 px-2 py-0.5 border text-[9px] font-mono-os', s.color)}>
                      <span className={clsx('w-1 h-1 rounded-full', s.dot)} />
                      {s.label}
                    </div>
                  </div>
                  <p className="font-mono-os text-[11px] text-muted/50 mb-1">{auto.description}</p>
                  <p className="font-mono-os text-[10px] text-muted/30">{auto.trigger}</p>
                </div>

                <div className="text-right shrink-0">
                  <p className="font-display text-2xl text-gold">{auto.runs_today}</p>
                  <p className="font-mono-os text-[9px] text-muted/40">runs hoy</p>
                  {auto.last_run && (
                    <p className="font-mono-os text-[9px] text-muted/30">último: {auto.last_run}</p>
                  )}
                </div>

                <button onClick={() => toggle(auto.id)}
                  className="shrink-0 w-9 h-9 border border-gold/20 flex items-center justify-center
                             text-muted hover:text-gold hover:border-gold/50 transition-colors">
                  {auto.status === 'active' ? <Pause size={15} /> : <Play size={15} />}
                </button>
              </div>
            )
          })}
        </div>

        <p className="font-mono-os text-[10px] text-muted/30 mt-6 text-center tracking-widest">
          {/* TODO: Connect n8n API here */}
          MOCK DATA — conectar n8n webhooks en producción
        </p>
      </div>
    </OSLayout>
  )
}
