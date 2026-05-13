'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { clsx } from 'clsx'
import {
  LayoutDashboard, Mic, MessageSquare, Bot,
  Users, CheckSquare, Zap, BookOpen, Settings,
} from 'lucide-react'

const NAV = [
  { href: '/',             icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/voice',        icon: Mic,             label: 'Voz' },
  { href: '/chat',         icon: MessageSquare,   label: 'Chat' },
  { href: '/agents',       icon: Bot,             label: 'Agentes' },
  { href: '/crm',          icon: Users,           label: 'CRM' },
  { href: '/tasks',        icon: CheckSquare,     label: 'Tareas' },
  { href: '/automations',  icon: Zap,             label: 'Automatizaciones' },
  { href: '/prompts',      icon: BookOpen,        label: 'Prompts' },
  { href: '/settings',     icon: Settings,        label: 'Ajustes' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-screen w-16 flex flex-col items-center py-6 gap-1
                      bg-surface border-r border-gold z-50">
      {/* Logo */}
      <div className="mb-6 font-display text-gold text-xl tracking-widest">V</div>

      {/* Nav */}
      <nav className="flex flex-col items-center gap-1 flex-1">
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              title={label}
              className={clsx(
                'w-10 h-10 flex items-center justify-center rounded-sm transition-all duration-200 group relative',
                active
                  ? 'bg-gold/10 text-gold border border-gold/40'
                  : 'text-muted hover:text-gold hover:bg-gold/5'
              )}
            >
              <Icon size={18} strokeWidth={1.5} />
              {/* Tooltip */}
              <span className="absolute left-14 bg-surface2 border border-gold/20 text-white text-xs
                               px-2 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100
                               transition-opacity pointer-events-none font-mono-os tracking-wider">
                {label}
              </span>
            </Link>
          )
        })}
      </nav>

      {/* Version */}
      <div className="font-mono-os text-[9px] text-muted/40 tracking-widest rotate-90 mb-2">
        v0.1
      </div>
    </aside>
  )
}
