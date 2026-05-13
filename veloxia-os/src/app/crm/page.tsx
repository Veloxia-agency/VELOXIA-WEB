'use client'

import { useState } from 'react'
import OSLayout from '@/components/layout/OSLayout'
import { LEADS } from '@/lib/mockData'
import type { LeadStatus } from '@/types/crm'
import { clsx } from 'clsx'

const STATUS_LABEL: Record<LeadStatus, string> = {
  new:       'NUEVO',
  contacted: 'CONTACTADO',
  qualified: 'CUALIFICADO',
  proposal:  'PROPUESTA',
  closed:    'CERRADO',
  lost:      'PERDIDO',
}
const STATUS_COLOR: Record<LeadStatus, string> = {
  new:       'text-blue-400 border-blue-400/30 bg-blue-400/10',
  contacted: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10',
  qualified: 'text-orange border-orange/30 bg-orange/10',
  proposal:  'text-gold border-gold/30 bg-gold/10',
  closed:    'text-green-400 border-green-400/30 bg-green-400/10',
  lost:      'text-muted/50 border-muted/20 bg-muted/5',
}

const ALL_STATUSES: LeadStatus[] = ['new','contacted','qualified','proposal','closed','lost']

export default function CRMPage() {
  const [filter, setFilter] = useState<LeadStatus | 'all'>('all')
  const visible = filter === 'all' ? LEADS : LEADS.filter(l => l.status === filter)
  const pipeline = LEADS.filter(l => !['closed','lost'].includes(l.status))
                        .reduce((s, l) => s + l.revenue_potential, 0)

  return (
    <OSLayout>
      <div className="p-6">
        <p className="font-mono-os text-[10px] tracking-[4px] text-gold/60 mb-1">// GESTIÓN DE CLIENTES</p>
        <h1 className="font-display text-5xl text-white tracking-wider mb-6">CLIENTS & LEADS</h1>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Total leads',     value: LEADS.length },
            { label: 'En pipeline',     value: LEADS.filter(l => !['closed','lost'].includes(l.status)).length },
            { label: 'Cerrados',        value: LEADS.filter(l => l.status === 'closed').length },
            { label: 'Pipeline €',      value: `€${pipeline.toLocaleString()}` },
          ].map(s => (
            <div key={s.label} className="border border-gold/[0.18] bg-surface p-4">
              <p className="font-mono-os text-[10px] text-muted/50 mb-1">{s.label}</p>
              <p className="font-display text-3xl text-white">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-4 flex-wrap">
          <button onClick={() => setFilter('all')}
            className={clsx('font-mono-os text-[10px] tracking-widest px-3 py-1.5 border transition-colors',
              filter === 'all' ? 'border-gold/50 text-gold bg-gold/10' : 'border-gold/15 text-muted/50 hover:border-gold/30')}>
            TODOS
          </button>
          {ALL_STATUSES.map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={clsx('font-mono-os text-[10px] tracking-widest px-3 py-1.5 border transition-colors',
                filter === s ? 'border-gold/50 text-gold bg-gold/10' : 'border-gold/15 text-muted/50 hover:border-gold/30')}>
              {STATUS_LABEL[s]}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="border border-gold/[0.18] bg-surface overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gold/10">
                {['Nombre','Tipo','Ciudad','Potencial €','Estado','Último contacto'].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-mono-os text-[10px] tracking-[3px] text-muted/50">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((lead, i) => (
                <tr key={lead.id}
                  className={clsx('border-b border-gold/5 hover:bg-gold/5 transition-colors cursor-pointer',
                    i % 2 === 0 ? 'bg-surface' : 'bg-surface2/30')}>
                  <td className="px-4 py-3">
                    <p className="font-mono-os text-xs text-white">{lead.name}</p>
                    <p className="font-mono-os text-[10px] text-muted/40">{lead.email}</p>
                  </td>
                  <td className="px-4 py-3 font-mono-os text-[11px] text-muted/60">{lead.business_type}</td>
                  <td className="px-4 py-3 font-mono-os text-[11px] text-muted/60">{lead.city}</td>
                  <td className="px-4 py-3 font-mono-os text-[11px] text-gold">€{lead.revenue_potential.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={clsx('font-mono-os text-[9px] tracking-wider px-2 py-0.5 border', STATUS_COLOR[lead.status])}>
                      {STATUS_LABEL[lead.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono-os text-[11px] text-muted/40">
                    {lead.last_contact ?? lead.created_at}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </OSLayout>
  )
}
