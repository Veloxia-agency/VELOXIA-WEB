'use client'

import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useOSStore } from '@/store/osStore'
import { clsx } from 'clsx'

const TYPE_COLOR = {
  info:    'text-muted/70',
  success: 'text-green-400',
  warning: 'text-yellow-400',
  error:   'text-red-400',
  agent:   'text-gold',
}

const TYPE_PREFIX = {
  info:    '›',
  success: '✓',
  warning: '⚠',
  error:   '✗',
  agent:   '⚡',
}

export default function SystemLog() {
  const logs = useOSStore((s) => s.logs)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) ref.current.scrollTop = 0
  }, [logs.length])

  return (
    <div className="border border-gold/[0.18] bg-surface h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5
                      border-b border-gold/10">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="font-mono-os text-[10px] tracking-[3px] text-muted/60 uppercase">
            System Log
          </span>
        </div>
        <span className="font-mono-os text-[9px] text-muted/30">{logs.length} eventos</span>
      </div>

      {/* Entries */}
      <div ref={ref} className="flex-1 overflow-y-auto p-3 space-y-1">
        <AnimatePresence initial={false}>
          {logs.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-start gap-2 py-0.5"
            >
              <span className="font-mono-os text-[10px] text-muted/30 tabular-nums shrink-0 mt-0.5">
                {log.timestamp}
              </span>
              <span className={clsx('shrink-0 text-[11px] mt-0.5', TYPE_COLOR[log.type])}>
                {TYPE_PREFIX[log.type]}
              </span>
              <span className={clsx('font-mono-os text-[11px] leading-relaxed', TYPE_COLOR[log.type])}>
                {log.message}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
