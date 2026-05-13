import type { Metadata } from 'next'
import { DM_Sans, DM_Mono, Bebas_Neue } from 'next/font/google'
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  weight: ['300', '400', '500', '600'],
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  variable: '--font-dm-mono',
  weight: ['300', '400', '500'],
})

const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  variable: '--font-bebas',
  weight: ['400'],
})

export const metadata: Metadata = {
  title: 'VELOXIA OS',
  description: 'AI Operating System — Veloxia Agency',
  icons: { icon: '/favicon.svg' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${dmSans.variable} ${dmMono.variable} ${bebasNeue.variable}`}>
      <body>{children}</body>
    </html>
  )
}
