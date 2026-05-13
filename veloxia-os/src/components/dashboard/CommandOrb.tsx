'use client'

import { motion } from 'framer-motion'
import { useOSStore } from '@/store/osStore'
import { clsx } from 'clsx'

const ORB_CONFIG = {
  idle:       { color: 'rgba(196,146,42,0.15)', glow: 'rgba(196,146,42,0.08)', label: 'STANDBY' },
  listening:  { color: 'rgba(74,255,138,0.2)',  glow: 'rgba(74,255,138,0.12)', label: 'ESCUCHANDO' },
  processing: { color: 'rgba(196,146,42,0.3)',  glow: 'rgba(196,146,42,0.2)',  label: 'PROCESANDO' },
  speaking:   { color: 'rgba(255,106,0,0.25)',  glow: 'rgba(255,106,0,0.15)',  label: 'HABLANDO' },
  error:      { color: 'rgba(255,102,102,0.2)', glow: 'rgba(255,102,102,0.1)', label: 'ERROR' },
}

export default function CommandOrb() {
  const voiceState = useOSStore((s) => s.voiceState)
  const activeAgent = useOSStore((s) => s.activeAgent)
  const transcript = useOSStore((s) => s.transcript)

  const cfg = ORB_CONFIG[voiceState]

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-8">
      {/* Orb */}
      <div className="relative flex items-center justify-center">
        {/* Outer pulse rings */}
        {voiceState !== 'idle' && (
          <>
            <motion.div
              className="absolute rounded-full border border-gold/10"
              initial={{ width: 120, height: 120, opacity: 0.6 }}
              animate={{ width: 200, height: 200, opacity: 0 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
            />
            <motion.div
              className="absolute rounded-full border border-gold/10"
              initial={{ width: 120, height: 120, opacity: 0.4 }}
              animate={{ width: 180, height: 180, opacity: 0 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeOut', delay: 0.5 }}
            />
          </>
        )}

        {/* Main orb */}
        <motion.div
          className="relative w-28 h-28 rounded-full flex items-center justify-center cursor-pointer"
          style={{ background: `radial-gradient(circle at 35% 35%, ${cfg.color}, transparent 70%)` }}
          animate={voiceState === 'idle'
            ? { scale: [1, 1.02, 1] }
            : { scale: [1, 1.05, 1] }
          }
          transition={{ duration: voiceState === 'idle' ? 4 : 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* Inner ring */}
          <div
            className="absolute inset-0 rounded-full border"
            style={{ borderColor: cfg.color }}
          />
          {/* Core */}
          <motion.div
            className="w-16 h-16 rounded-full border border-gold/40 flex items-center justify-center"
            style={{ background: `radial-gradient(circle, ${cfg.glow}, transparent)` }}
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="font-display text-gold text-2xl tracking-widest">V</span>
          </motion.div>
        </motion.div>
      </div>

      {/* Status */}
      <div className="text-center">
        <p className={clsx(
          'font-mono-os text-xs tracking-[4px] mb-1',
          voiceState === 'idle'       ? 'text-muted/50' :
          voiceState === 'listening'  ? 'text-green-400' :
          voiceState === 'processing' ? 'text-gold' :
          voiceState === 'speaking'   ? 'text-orange' :
          'text-red-400'
        )}>
          {cfg.label}
        </p>
        {activeAgent && (
          <p className="font-mono-os text-[10px] text-muted/40 tracking-widest uppercase">
            {activeAgent} activado
          </p>
        )}
      </div>

      {/* Live transcript */}
      {transcript && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xs text-center font-mono-os text-sm text-gold/80 border border-gold/20
                     bg-gold/5 px-4 py-2 rounded-none"
        >
          "{transcript}"
        </motion.div>
      )}
    </div>
  )
}
