'use client'

import { useState } from 'react'
import OSLayout from '@/components/layout/OSLayout'
import { TASKS } from '@/lib/mockData'
import { AGENTS } from '@/lib/mockData'
import type { Task } from '@/types/os'
import { clsx } from 'clsx'

const COLUMNS = [
  { id: 'in_progress', label: 'TODAY',      color: 'text-gold' },
  { id: 'pending',     label: 'THIS WEEK',  color: 'text-blue-400' },
  { id: 'waiting',     label: 'WAITING',    color: 'text-yellow-400' },
  { id: 'done',        label: 'COMPLETED',  color: 'text-green-400' },
] as const

const PRIORITY_COLOR = { high: 'bg-red-400', medium: 'bg-yellow-400', low: 'bg-muted/30' }

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(TASKS)

  const move = (id: string, status: Task['status']) =>
    setTasks(ts => ts.map(t => t.id === id ? { ...t, status } : t))

  const getCol = (colId: string) =>
    colId === 'waiting'
      ? tasks.filter(t => t.status === 'pending' && t.priority === 'low')
      : tasks.filter(t => t.status === colId)

  return (
    <OSLayout>
      <div className="p-6 h-[calc(100vh-44px)] flex flex-col">
        <p className="font-mono-os text-[10px] tracking-[4px] text-gold/60 mb-1">// GESTIÓN DE TRABAJO</p>
        <h1 className="font-display text-5xl text-white tracking-wider mb-6">TASKS</h1>

        <div className="grid grid-cols-4 gap-3 flex-1 min-h-0">
          {COLUMNS.map(col => {
            const items = getCol(col.id)
            return (
              <div key={col.id} className="border border-gold/[0.18] bg-surface flex flex-col min-h-0">
                <div className="px-4 py-3 border-b border-gold/10 flex items-center justify-between shrink-0">
                  <span className={clsx('font-mono-os text-[10px] tracking-[3px]', col.color)}>
                    {col.label}
                  </span>
                  <span className="font-mono-os text-[10px] text-muted/40">{items.length}</span>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                  {items.map(task => {
                    const agent = AGENTS.find(a => a.id === task.agent)
                    return (
                      <div key={task.id}
                        className="border border-gold/10 bg-surface2 p-3 hover:border-gold/25 transition-colors">
                        <div className="flex items-start gap-2 mb-2">
                          <span className={clsx('w-1.5 h-1.5 rounded-full mt-1.5 shrink-0', PRIORITY_COLOR[task.priority])} />
                          <p className="font-mono-os text-[11px] text-white leading-relaxed">{task.title}</p>
                        </div>
                        {task.description && (
                          <p className="font-mono-os text-[10px] text-muted/50 mb-2 leading-relaxed pl-3.5">
                            {task.description}
                          </p>
                        )}
                        <div className="flex items-center justify-between pl-3.5">
                          {agent && (
                            <span className="font-mono-os text-[9px]" style={{ color: agent.color }}>
                              {agent.icon} {agent.name}
                            </span>
                          )}
                          {task.due_date && (
                            <span className="font-mono-os text-[9px] text-muted/40">{task.due_date}</span>
                          )}
                        </div>
                        {/* Quick move */}
                        {task.status !== 'done' && (
                          <button
                            onClick={() => move(task.id, task.status === 'in_progress' ? 'done' : 'in_progress')}
                            className="mt-2 w-full font-mono-os text-[9px] tracking-widest text-muted/40
                                       hover:text-gold border border-transparent hover:border-gold/20
                                       py-1 transition-colors">
                            {task.status === 'in_progress' ? '→ COMPLETAR' : '→ MOVER A HOY'}
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </OSLayout>
  )
}
