'use client'

import { useState, useRef, useEffect } from 'react'
import OSLayout from '@/components/layout/OSLayout'
import { AGENTS } from '@/lib/mockData'
import { Send, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { clsx } from 'clsx'
import type { AgentId } from '@/types/agents'

interface Message {
  id: string
  role: 'user' | 'assistant'
  text: string
  agent?: AgentId
  timestamp: string
}

const MOCK_REPLIES: Record<string, string> = {
  sales:    'Perfecto. He analizado el caso y te propongo un deck de ventas enfocado en resultados. ¿Para qué tipo de cliente es la propuesta?',
  content:  'Entendido. Genero 5 ideas de contenido para esta semana adaptadas a tu audiencia objetivo. Dame un momento...',
  ops:      'Tarea registrada en CRM. También he añadido un recordatorio de seguimiento para mañana a las 10:00.',
  builder:  'Aquí tienes el prompt optimizado para Claude Code. Incluye contexto del proyecto, stack tecnológico y criterios de aceptación.',
  mortgage: 'He comparado las condiciones de los 4 bancos principales. El diferencial más bajo lo ofrece actualmente el Banco X al 0.85%.',
  personal: 'Tu día está organizado. 3 prioridades críticas, 2 reuniones y un bloque de trabajo profundo de 14:00 a 16:00.',
  orchestrator: 'Comando recibido. Analizando intención y enrutando al agente más adecuado para tu consulta...',
}

const INITIAL: Message[] = [
  {
    id: '0',
    role: 'assistant',
    text: 'Sistema VELOXIA OS activo. ¿En qué puedo ayudarte hoy? Puedes preguntarme sobre ventas, contenido, operaciones, hipotecas o planificación.',
    agent: 'orchestrator',
    timestamp: new Date().toLocaleTimeString('es-ES', { hour12: false }),
  },
]

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(INITIAL)
  const [input, setInput]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [selectedAgent, setSelectedAgent] = useState<AgentId>('orchestrator')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = () => {
    if (!input.trim() || loading) return
    const ts = new Date().toLocaleTimeString('es-ES', { hour12: false })

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: input, timestamp: ts }
    setMessages(m => [...m, userMsg])
    setInput('')
    setLoading(true)

    // TODO: Connect Claude API here
    setTimeout(() => {
      const reply = MOCK_REPLIES[selectedAgent] ?? MOCK_REPLIES.orchestrator
      setMessages(m => [...m, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: reply,
        agent: selectedAgent,
        timestamp: new Date().toLocaleTimeString('es-ES', { hour12: false }),
      }])
      setLoading(false)
    }, 1200)
  }

  const agent = AGENTS.find(a => a.id === selectedAgent)!

  return (
    <OSLayout>
      <div className="flex flex-col h-[calc(100vh-44px)]">

        {/* Header */}
        <div className="shrink-0 border-b border-gold/10 px-6 py-3 flex items-center gap-4">
          <p className="font-display text-2xl text-white tracking-wider">AI CHAT</p>
          <div className="ml-auto flex items-center gap-2">
            <span className="font-mono-os text-[10px] text-muted/50">AGENTE:</span>
            <div className="relative group">
              <button className="flex items-center gap-2 border border-gold/20 px-3 py-1.5
                                 text-white hover:border-gold/40 transition-colors">
                <span className="text-sm">{agent.icon}</span>
                <span className="font-mono-os text-[11px]">{agent.name}</span>
                <ChevronDown size={12} className="text-muted/50" />
              </button>
              <div className="absolute right-0 top-full mt-1 bg-surface2 border border-gold/20
                              hidden group-focus-within:block z-50 w-56">
                {AGENTS.map(a => (
                  <button key={a.id} onClick={() => setSelectedAgent(a.id)}
                    className={clsx(
                      'w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-gold/5 transition-colors',
                      selectedAgent === a.id && 'bg-gold/10'
                    )}>
                    <span>{a.icon}</span>
                    <span className="font-mono-os text-[11px] text-white">{a.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          <AnimatePresence initial={false}>
            {messages.map(msg => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={clsx('flex gap-3', msg.role === 'user' && 'flex-row-reverse')}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 shrink-0 border border-gold/30 flex items-center justify-center text-sm">
                    {AGENTS.find(a => a.id === msg.agent)?.icon ?? '⚡'}
                  </div>
                )}
                <div className={clsx(
                  'max-w-lg px-4 py-3 font-mono-os text-sm leading-relaxed',
                  msg.role === 'user'
                    ? 'bg-gold/10 border border-gold/25 text-white'
                    : 'bg-surface border border-gold/15 text-white/90'
                )}>
                  {msg.text}
                  <p className="text-[9px] text-muted/30 mt-1.5">{msg.timestamp}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex gap-3 items-center">
              <div className="w-8 h-8 border border-gold/30 flex items-center justify-center text-sm">
                {agent.icon}
              </div>
              <div className="flex gap-1 px-4 py-3 border border-gold/15 bg-surface">
                {[0,1,2].map(i => (
                  <motion.span key={i} className="w-1.5 h-1.5 rounded-full bg-gold"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }} />
                ))}
              </div>
            </motion.div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="shrink-0 border-t border-gold/10 p-4 flex gap-3">
          <input
            className="flex-1 bg-surface border border-gold/20 text-white font-mono-os text-sm
                       px-4 py-3 outline-none focus:border-gold/50 placeholder:text-muted/40"
            placeholder={`Habla con ${agent.name}...`}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
          />
          <button onClick={send} disabled={loading || !input.trim()}
            className="px-5 bg-gold text-black font-mono-os text-xs tracking-widest
                       hover:bg-gold-light transition-colors disabled:opacity-40">
            <Send size={16} />
          </button>
        </div>
      </div>
    </OSLayout>
  )
}
