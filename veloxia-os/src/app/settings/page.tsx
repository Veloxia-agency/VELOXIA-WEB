import OSLayout from '@/components/layout/OSLayout'

const SECTIONS = [
  {
    title: 'API Keys',
    items: [
      { label: 'Anthropic API Key',      key: 'ANTHROPIC_API_KEY',            value: '••••••••••••••••', status: 'pending' },
      { label: 'n8n Webhook URL',        key: 'NEXT_PUBLIC_N8N_WEBHOOK_URL',  value: 'https://veloxiasetter.app.n8n.cloud/webhook', status: 'ok' },
      { label: 'ElevenLabs API Key',     key: 'ELEVENLABS_API_KEY',           value: 'No configurado', status: 'pending' },
    ],
  },
  {
    title: 'Voz',
    items: [
      { label: 'Motor de voz',       key: 'tts_engine',    value: 'Browser TTS (fallback)',  status: 'ok' },
      { label: 'Idioma por defecto', key: 'voice_lang',    value: 'es-ES',                   status: 'ok' },
      { label: 'Velocidad de voz',   key: 'voice_rate',    value: '1.0x',                    status: 'ok' },
    ],
  },
  {
    title: 'Agentes',
    items: [
      { label: 'Modelo IA',              key: 'ai_model',      value: 'claude-sonnet-4-6',   status: 'pending' },
      { label: 'Temperatura',            key: 'ai_temp',       value: '0.7',                 status: 'ok' },
      { label: 'Max tokens respuesta',   key: 'ai_max_tokens', value: '2048',                status: 'ok' },
    ],
  },
  {
    title: 'Sistema',
    items: [
      { label: 'Usuario',       key: 'user',     value: 'Hayuk Miñano',   status: 'ok' },
      { label: 'Organización',  key: 'org',      value: 'Veloxia Agency', status: 'ok' },
      { label: 'Versión OS',    key: 'version',  value: 'v0.1.0 — MVP',   status: 'ok' },
      { label: 'Entorno',       key: 'env',      value: 'development',    status: 'ok' },
    ],
  },
]

export default function SettingsPage() {
  return (
    <OSLayout>
      <div className="p-6 max-w-2xl">
        <p className="font-mono-os text-[10px] tracking-[4px] text-gold/60 mb-1">// CONFIGURACIÓN</p>
        <h1 className="font-display text-5xl text-white tracking-wider mb-8">SETTINGS</h1>

        <div className="space-y-6">
          {SECTIONS.map(section => (
            <div key={section.title} className="border border-gold/[0.18] bg-surface overflow-hidden">
              <div className="px-5 py-3 border-b border-gold/10">
                <span className="font-mono-os text-[10px] tracking-[3px] text-gold/60 uppercase">
                  {section.title}
                </span>
              </div>
              <div className="divide-y divide-gold/5">
                {section.items.map(item => (
                  <div key={item.key} className="flex items-center justify-between px-5 py-3">
                    <div>
                      <p className="font-mono-os text-[11px] text-white">{item.label}</p>
                      <p className="font-mono-os text-[9px] text-muted/30">{item.key}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono-os text-[11px] text-muted/60">{item.value}</span>
                      <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'ok' ? 'bg-green-400' : 'bg-yellow-400'}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="font-mono-os text-[10px] text-muted/30 mt-6 tracking-widest">
          {/* TODO: Connect settings persistence here */}
          Configura las variables en .env.local · Los cambios requieren reiniciar el servidor
        </p>
      </div>
    </OSLayout>
  )
}
