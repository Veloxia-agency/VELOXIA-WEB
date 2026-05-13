'use client'

import { FileText, UserPlus, CheckSquare, Film, Zap } from 'lucide-react'
import { useOSStore } from '@/store/osStore'

const ACTIONS = [
  { icon: FileText,  label: 'Nueva propuesta',  command: 'Genera una propuesta comercial para un nuevo cliente' },
  { icon: UserPlus,  label: 'Añadir lead',       command: 'Añade un nuevo lead al CRM' },
  { icon: CheckSquare, label: 'Crear tarea',     command: 'Crea una nueva tarea' },
  { icon: Film,      label: 'Generar contenido', command: 'Crea ideas de contenido para Instagram esta semana' },
  { icon: Zap,       label: 'Run automatización', command: 'Activa la automatización de seguimiento' },
]

export default function QuickActions() {
  const addLog = useOSStore((s) => s.addLog)
  const setTranscript = useOSStore((s) => s.setTranscript)
  const setVoiceState = useOSStore((s) => s.setVoiceState)

  const handleAction = (command: string) => {
    setTranscript(command)
    setVoiceState('processing')
    addLog(`Acción rápida: "${command}"`, 'agent')

    // TODO: Connect orchestrator API here
    setTimeout(() => {
      addLog('Comando procesado vía acción rápida', 'success')
      setVoiceState('idle')
      setTranscript('')
    }, 1800)
  }

  return (
    <div className="border border-gold/[0.18] bg-surface p-4">
      <p className="font-mono-os text-[10px] tracking-[3px] text-muted/60 uppercase mb-3">
        Acciones rápidas
      </p>
      <div className="grid grid-cols-5 gap-2">
        {ACTIONS.map(({ icon: Icon, label, command }) => (
          <button
            key={label}
            onClick={() => handleAction(command)}
            className="flex flex-col items-center gap-1.5 p-3 border border-gold/15
                       hover:border-gold/50 hover:bg-gold/5 transition-all duration-200
                       text-muted hover:text-gold group"
          >
            <Icon size={18} strokeWidth={1.5} />
            <span className="font-mono-os text-[9px] tracking-wide text-center leading-tight">
              {label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
