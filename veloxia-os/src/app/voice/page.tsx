'use client'

import { useState } from 'react'
import OSLayout from '@/components/layout/OSLayout'
import VoiceButton from '@/components/voice/VoiceButton'
import { useOSStore } from '@/store/osStore'
import { AGENTS } from '@/lib/mockData'
import { motion, AnimatePresence } from 'framer-motion'
import { Send } from 'lucide-react'

const MOCK_RESPONSES = [
  { agent: 'sales',   intent: 'generate_proposal',   action: 'Propuesta generada para cliente objetivo',           confidence: 0.94 },
  { agent: 'content', intent: 'create_content',       action: '5 ideas de contenido añadidas a tu librería',        confidence: 0.91 },
  { agent: 'ops',     intent: 'create_task',          action: 'Tarea creada y asignada en el CRM',                  confidence: 0.88 },
  { agent: 'personal',intent: 'plan_day',             action: 'Plan del día generado con 4 prioridades',            confidence: 0.96 },
  { agent: 'builder', intent: 'generate_code',        action: 'Prompt para Claude Code preparado',                  confidence: 0.89 },
]

type ResultType = typeof MOCK_RESPONSES[0] & { command: string }

export default function VoicePage() {
  const { voiceState, setVoiceState, setTranscript, transcript, addLog } = useOSStore()
  const [input, setInput]   = useState('')
  const [result, setResult] = useState<ResultType | null>(null)

  const process = (command: string) => {
    if (!command.trim()) return
    setTranscript(command)
    setVoiceState('processing')
    addLog(`Comando recibido: "${command}"`, 'info')
    addLog('Orquestador analizando intención...', 'info')

    setTimeout(() => {
      const mock = MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)]
      const agent = AGENTS.find(a => a.id === mock.agent)!
      addLog(`Agente seleccionado: ${agent.name}`, 'agent')
      addLog(mock.action, 'success')
      setResult({ ...mock, command })
      setVoiceState('idle')
      setTranscript('')
      setInput('')
    }, 1800)
  }

  const toggleVoice = () => {
    if (voiceState === 'listening') {
      setVoiceState('processing')
      process('Comando de voz simulado — Web Speech API pendiente de conectar')
    } else if (voiceState === 'idle') {
      setVoiceState('listening')
      addLog('Escucha iniciada...', 'info')
      // TODO: Connect Web Speech API here
    }
  }

  return (
    <OSLayout>
      <div className="p-6 max-w-2xl mx-auto">
        <p className="font-mono-os text-[10px] tracking-[4px] text-gold/60 mb-1">// COMANDO CENTRAL</p>
        <h1 className="font-display text-5xl text-white tracking-wider mb-8">VOICE COMMAND</h1>

        {/* Orb + button */}
        <div className="border border-gold/20 bg-surface p-10 flex flex-col items-center gap-6 mb-6">
          <div className="relative">
            <motion.div
              className="w-32 h-32 rounded-full border border-gold/30 flex items-center justify-center"
              style={{ background: 'radial-gradient(circle at 35% 35%, rgba(196,146,42,0.15), transparent 70%)' }}
              animate={voiceState === 'listening'
                ? { scale: [1, 1.06, 1], borderColor: ['rgba(74,255,138,0.3)', 'rgba(74,255,138,0.7)', 'rgba(74,255,138,0.3)'] }
                : voiceState === 'processing'
                ? { scale: [1, 1.04, 1] }
                : { scale: [1, 1.02, 1] }
              }
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              {voiceState === 'listening' && (
                <motion.div className="absolute inset-0 rounded-full border border-green-400/20"
                  animate={{ scale: [1, 1.4], opacity: [0.5, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity }} />
              )}
              <span className="font-display text-gold text-4xl">V</span>
            </motion.div>
          </div>

          <VoiceButton onToggle={toggleVoice} size="lg" />

          <p className="font-mono-os text-[11px] text-muted/50 tracking-widest">
            {voiceState === 'idle'       && 'PULSA PARA HABLAR'}
            {voiceState === 'listening'  && 'ESCUCHANDO...'}
            {voiceState === 'processing' && 'PROCESANDO...'}
          </p>
        </div>

        {/* Manual input */}
        <div className="flex gap-2 mb-6">
          <input
            className="flex-1 bg-surface border border-gold/20 text-white font-mono-os text-sm
                       px-4 py-3 outline-none focus:border-gold/50 placeholder:text-muted/40"
            placeholder="O escribe un comando..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && process(input)}
            disabled={voiceState === 'processing'}
          />
          <button
            onClick={() => process(input)}
            disabled={voiceState === 'processing' || !input.trim()}
            className="px-4 border border-gold/30 text-gold hover:bg-gold/10 transition-colors disabled:opacity-40"
          >
            <Send size={16} />
          </button>
        </div>

        {/* Result */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="border border-gold/30 bg-surface p-5 space-y-3"
            >
              {(() => {
                const agent = AGENTS.find(a => a.id === result.agent)!
                return (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="font-mono-os text-[10px] tracking-[3px] text-muted/50">RESULTADO</span>
                      <span className="font-mono-os text-[10px] text-gold/60">
                        confianza: {Math.round(result.confidence * 100)}%
                      </span>
                    </div>
                    <p className="font-mono-os text-xs text-muted/60">"{result.command}"</p>
                    <div className="flex items-center gap-3 py-2 border-y border-gold/10">
                      <span className="text-xl">{agent.icon}</span>
                      <div>
                        <p className="font-mono-os text-xs text-white">{agent.name}</p>
                        <p className="font-mono-os text-[10px]" style={{ color: agent.color }}>
                          {result.intent}
                        </p>
                      </div>
                    </div>
                    <p className="font-mono-os text-sm text-green-400">✓ {result.action}</p>
                    <button
                      onClick={() => setResult(null)}
                      className="font-mono-os text-[10px] text-muted/40 hover:text-muted tracking-widest"
                    >
                      LIMPIAR
                    </button>
                  </>
                )
              })()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </OSLayout>
  )
}
