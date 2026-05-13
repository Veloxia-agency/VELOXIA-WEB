import OSLayout from '@/components/layout/OSLayout'

const PROMPTS = [
  { id: 'p1', agent: 'Sales',    title: 'Propuesta para clínica estética',  tags: ['propuesta','clínica'], body: 'Actúa como consultor de ventas premium. Genera una propuesta para una clínica estética en Madrid que busca mejorar su captación digital...' },
  { id: 'p2', agent: 'Content',  title: 'Hook para reel de autoridad',       tags: ['reel','hook'],         body: 'Genera 5 hooks para un reel de Instagram de un negocio de servicios premium. El hook debe generar curiosidad en los primeros 2 segundos...' },
  { id: 'p3', agent: 'Sales',    title: 'Email de seguimiento +24h',         tags: ['email','follow-up'],   body: 'Escribe un email de seguimiento para un lead que no ha respondido en 24h. Tono profesional, directo, sin presión...' },
  { id: 'p4', agent: 'Builder',  title: 'Arquitectura Next.js App Router',   tags: ['código','next.js'],    body: 'Diseña la arquitectura de una web en Next.js 14 App Router con TypeScript para un negocio de servicios premium...' },
  { id: 'p5', agent: 'Ops',      title: 'Cualificación de lead en 3 preguntas', tags: ['crm','cualificación'], body: '¿Cuál es tu situación actual? · ¿Qué llevas intentando hasta ahora? · ¿Para cuándo necesitas tenerlo resuelto?' },
  { id: 'p6', agent: 'Mortgage', title: 'Comparativa hipotecas 2026',        tags: ['hipoteca','banca'],    body: 'Compara las condiciones de los 4 principales bancos para un cliente con perfil: autónomo, 45k/año, primera vivienda...' },
]

const AGENT_COLOR: Record<string, string> = {
  Sales: '#FF6A00', Content: '#E879F9', Builder: '#4AFF8A',
  Ops: '#60A5FA', Mortgage: '#34D399', Personal: '#FBBF24',
}

export default function PromptsPage() {
  return (
    <OSLayout>
      <div className="p-6">
        <p className="font-mono-os text-[10px] tracking-[4px] text-gold/60 mb-1">// KNOWLEDGE BASE</p>
        <h1 className="font-display text-5xl text-white tracking-wider mb-8">PROMPT LIBRARY</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {PROMPTS.map(p => (
            <div key={p.id} className="border border-gold/[0.18] bg-surface p-5 hover:border-gold/35 transition-colors cursor-pointer group">
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono-os text-[10px] tracking-widest" style={{ color: AGENT_COLOR[p.agent] ?? '#C4922A' }}>
                  {p.agent.toUpperCase()}
                </span>
                <div className="flex gap-1">
                  {p.tags.map(t => (
                    <span key={t} className="font-mono-os text-[9px] px-1.5 py-0.5 border border-gold/10 text-muted/40">{t}</span>
                  ))}
                </div>
              </div>
              <p className="font-mono-os text-sm text-white mb-3">{p.title}</p>
              <p className="font-mono-os text-[11px] text-muted/50 leading-relaxed line-clamp-2">{p.body}</p>
              <button className="mt-4 font-mono-os text-[10px] tracking-widest text-muted/40 group-hover:text-gold transition-colors">
                USAR PROMPT →
              </button>
            </div>
          ))}
        </div>
      </div>
    </OSLayout>
  )
}
