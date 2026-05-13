'use client'

import { Mic, MicOff, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { useOSStore } from '@/store/osStore'
import { clsx } from 'clsx'

interface Props {
  onToggle: () => void
  size?: 'sm' | 'lg'
}

export default function VoiceButton({ onToggle, size = 'sm' }: Props) {
  const voiceState = useOSStore((s) => s.voiceState)

  const isListening  = voiceState === 'listening'
  const isProcessing = voiceState === 'processing'
  const isError      = voiceState === 'error'

  const dim = size === 'lg' ? 'w-20 h-20' : 'w-12 h-12'
  const iconSize = size === 'lg' ? 28 : 18

  return (
    <motion.button
      onClick={onToggle}
      whileTap={{ scale: 0.94 }}
      className={clsx(
        dim,
        'relative flex items-center justify-center border transition-all duration-200',
        isListening  ? 'bg-green-400/10 border-green-400/50 text-green-400' :
        isProcessing ? 'bg-gold/10 border-gold/50 text-gold cursor-not-allowed' :
        isError      ? 'bg-red-400/10 border-red-400/50 text-red-400' :
        'bg-surface border-gold/30 text-gold hover:border-gold/70 hover:bg-gold/5'
      )}
      disabled={isProcessing}
      title={isListening ? 'Detener escucha' : 'Hablar con VELOXIA OS'}
    >
      {/* Pulse ring when listening */}
      {isListening && (
        <motion.div
          className="absolute inset-0 border border-green-400/30"
          animate={{ scale: [1, 1.3], opacity: [0.5, 0] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        />
      )}

      {isProcessing
        ? <Loader2 size={iconSize} className="animate-spin" />
        : isError
        ? <MicOff size={iconSize} />
        : <Mic size={iconSize} strokeWidth={1.5} />
      }
    </motion.button>
  )
}
