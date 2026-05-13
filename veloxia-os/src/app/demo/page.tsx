'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { X } from 'lucide-react'

const DEMO_SEQUENCE = [
  { delay: 0,    text: 'VELOXIA OS — INICIALIZANDO...', type: 'system' },
  { delay: 800,  text: 'Cargando 7 agentes IA...', type: 'info' },
  { delay: 1600, text: 'Conectando n8n automations...', type: 'info' },
  { delay: 2400, text: 'SISTEMA OPERATIVO — ONLINE', type: 'success' },
  { delay: 3400, text: 'COMANDO: "Genera propuesta para clínica estética Madrid"', type: 'command' },
  { delay: 4200, text: 'Orquestador analizando intención...', type: 'info' },
  { delay: 4800, text: 'Agente seleccionado: VELOXIA SALES (confianza 94%)', type: 'agent' },
  { delay: 5600, text: 'Generando propuesta personalizada...', type: 'info' },
  { delay: 6800, text: '✓ Propuesta creada: Pack Studio + Setter · €4,800/año', type: 'success' },
  { delay: 7600, text: '✓ Lead registrado en CRM automáticamente', type: 'success' },
  { delay: 8200, text: '✓ Tarea de seguimiento programada para mañana 10:00', type: 'success' },
  { delay: 9200, text: 'COMANDO: "Crea 5 ideas de contenido para esta semana"', type: 'command' },
  { delay: 10000, text: 'Agente seleccionado: VELOXIA CONTENT (confianza 91%)', type: 'agent' },
  { delay: 11200, text: '✓ 5 ideas generadas y añadidas a librería de prompts', type: 'success' },
  { delay: 12000, text: 'LISTO. Sistema activo 24/7.', type: 'system' },
]

const TYPE_COLOR: Record<string, string> = {
  system:  'text-gold',
  info:    'text-muted',
  success: 'text-green-400',
  agent:   'text-orange',
  command: 'text-white',
}

export default function DemoPage() {
  const [visible, setVisible] = useState<typeof DEMO_SEQUENCE>([])
  const [orbPhase, setOrbPhase] = useState<'idle' | 'active' | 'processing'>('idle')

  useEffect(() => {
    DEMO_SEQUENCE.forEach((entry) => {
      setTimeout(() => {
        setVisible(v => [...v, entry])
        if (entry.type === 'command') setOrbPhase('active')
        if (entry.type === 'agent')   setOrbPhase('processing')
        if (entry.type === 'system' && entry.delay > 0) setOrbPhase('idle')
      }, entry.delay)
    })
  }, [])

  const orbColor =
    orbPhase === 'active'     ? 'rgba(255,106,0,0.4)' :
    orbPhase === 'processing' ? 'rgba(196,146,42,0.5)' :
    'rgba(196,146,42,0.2)'

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center overflow-hidden">
      {/* Exit */}
      <Link href="/"
        className="absolute top-6 right-6 z-50 w-9 h-9 border border-gold/30 flex items-center
                   justify-center text-muted hover:text-gold hover:border-gold/60 transition-colors">
        <X size={16} />
      </Link>

      {/* Background grid */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'linear-gradient(rgba(196,146,42,1) 1px, transparent 1px), linear-gradient(90deg, rgba(196,146,42,1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      {/* Radial glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(196,146,42,0.06), transparent)' }} />

      {/* Central orb */}
      <div className="relative mb-12">
        {[1.6, 1.3, 1.0].map((scale, i) => (
          <motion.div key={i}
            className="absolute inset-0 rounded-full border border-gold/10"
            animate={{ scale: [scale, scale + 0.15, scale], opacity: [0.4, 0.1, 0.4] }}
            transition={{ duration: 3, repeat: Infinity, delay: i * 0.4, ease: 'easeInOut' }} />
        ))}
        <motion.div
          className="w-40 h-40 rounded-full border border-gold/40 flex items-center justify-center relative"
          style={{ background: `radial-gradient(circle at 35% 35%, ${orbColor}, transparent 70%)` }}
          animate={{ scale: orbPhase === 'idle' ? [1, 1.02, 1] : [1, 1.06, 1] }}
          transition={{ duration: orbPhase === 'idle' ? 4 : 1.2, repeat: Infinity }}
        >
          <motion.div className="w-24 h-24 rounded-full border border-gold/30 flex items-center justify-center"
            animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 2, repeat: Infinity }}>
            <span className="font-display text-gold text-5xl">V</span>
          </motion.div>
        </motion.div>
      </div>

      {/* Title */}
      <motion.p
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="font-display text-5xl text-white tracking-[8px] mb-2">
        VELOXIA OS
      </motion.p>
      <motion.p
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        className="font-mono-os text-[11px] text-muted/50 tracking-[6px] mb-10">
        AI OPERATING SYSTEM
      </motion.p>

      {/* Log terminal */}
      <div className="w-full max-w-xl border border-gold/20 bg-black/60 backdrop-blur p-5 font-mono-os text-xs space-y-1.5 min-h-[220px]">
        <div className="flex items-center gap-2 border-b border-gold/10 pb-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-[10px] text-muted/50 tracking-widest">TERMINAL // VELOXIA OS v0.1</span>
        </div>
        <AnimatePresence>
          {visible.map((entry, i) => (
            <motion.p key={i}
              initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
              className={TYPE_COLOR[entry.type]}>
              <span className="text-muted/30 mr-2">›</span>
              {entry.text}
            </motion.p>
          ))}
        </AnimatePresence>
        {visible.length < DEMO_SEQUENCE.length && (
          <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.8, repeat: Infinity }}
            className="text-gold">▋</motion.span>
        )}
      </div>

      {/* Bottom CTA */}
      {visible.length === DEMO_SEQUENCE.length && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="mt-8 flex gap-4">
          <Link href="/"
            className="font-mono-os text-[11px] tracking-[4px] px-8 py-3 bg-gold text-black
                       hover:bg-gold-light transition-colors">
            ABRIR SISTEMA →
          </Link>
          <button onClick={() => setVisible([])} className="font-mono-os text-[11px] tracking-[4px] px-8 py-3
                       border border-gold/30 text-gold hover:bg-gold/10 transition-colors">
            VER DE NUEVO
          </button>
        </motion.div>
      )}
    </div>
  )
}
