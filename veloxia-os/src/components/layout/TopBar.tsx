'use client'

import { useEffect, useState } from 'react'
import { useOSStore } from '@/store/osStore'
import { clsx } from 'clsx'

const VOICE_LABELS: Record<string, string> = {
  idle:       'STANDBY',
  listening:  'ESCUCHANDO',
  processing: 'PROCESANDO',
  speaking:   'HABLANDO',
  error:      'ERROR',
}

const VOICE_COLORS: Record<string, string> = {
  idle:       'text-muted/50',
  listening:  'text-green-400',
  processing: 'text-gold',
  speaking:   'text-orange',
  error:      'text-red-400',
}

export default function TopBar() {
  const voiceState = useOSStore((s) => s.voiceState)
  const [time, setTime] = useState('')

  useEffect(() => {
    const update = () =>
      setTime(new Date().toLocaleTimeString('es-ES', { hour12: false }))
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <header className="fixed top-0 left-16 right-0 h-11 flex items-center justify-between
                       px-6 bg-surface/80 backdrop-blur border-b border-gold/10 z-40">
      {/* Left */}
      <div className="flex items-center gap-4">
        <span className="font-display text-gold tracking-[6px] text-sm">VELOXIA OS</span>
        <span className="text-muted/30 text-xs">·</span>
        <span className="font-mono-os text-[10px] text-muted/50 tracking-widest">SISTEMA ACTIVO</span>
      </div>

      {/* Center — voice status */}
      <div className="flex items-center gap-2">
        <span className={clsx(
          'w-1.5 h-1.5 rounded-full',
          voiceState === 'idle'       ? 'bg-muted/30' :
          voiceState === 'listening'  ? 'bg-green-400 animate-pulse' :
          voiceState === 'processing' ? 'bg-gold animate-pulse' :
          voiceState === 'speaking'   ? 'bg-orange animate-pulse' :
          'bg-red-400'
        )} />
        <span className={clsx('font-mono-os text-[10px] tracking-widest', VOICE_COLORS[voiceState])}>
          {VOICE_LABELS[voiceState]}
        </span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <span className="font-mono-os text-[11px] text-muted/60 tabular-nums">{time}</span>
        <div className="w-7 h-7 rounded-full bg-gold/10 border border-gold/30
                        flex items-center justify-center font-display text-gold text-sm">
          H
        </div>
      </div>
    </header>
  )
}
