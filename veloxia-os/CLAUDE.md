# VELOXIA OS — Contexto del proyecto

## Qué es
AI Operating System privado para Hayuk Miñano y Veloxia Agency.
El usuario habla o escribe un comando → el sistema lo clasifica → lo enruta al agente correcto → responde y puede disparar automatizaciones.

## Stack
- Next.js 14 App Router + TypeScript
- Tailwind CSS + shadcn/ui + Framer Motion
- Web Speech API (voz entrada) + Browser TTS o ElevenLabs (voz salida)
- Claude API (cerebro IA)
- n8n webhooks (automatizaciones)
- Zustand (estado global)

## Marca
- Fondo: `#040404`
- Gold (acento principal): `#C4922A`
- Orange (acento secundario): `#FF6A00`
- Texto: `#FFFFFF`
- Texto muted: `#A1A1AA`
- Estilo: dark luxury, cinematic, SaaS-quality. Referencia visual: JARVIS pero más limpio.

## Los 7 agentes
1. **Central Orchestrator** — clasifica comandos y enruta al agente correcto
2. **Veloxia Sales** — propuestas, scripts, outreach, objeciones
3. **Veloxia Builder** — web, código, prompts para Claude Code, arquitectura
4. **Veloxia Ops** — CRM, tareas, seguimientos, gestión de proyectos
5. **Veloxia Content** — reels, posts, hooks, captions, calendarios
6. **Mortgage Assistant** — comparativas hipotecas, emails a bancos, explicaciones a clientes
7. **Personal Assistant** — planificación diaria, prioridades, notas, recordatorios

## Páginas
`/` Dashboard · `/voice` Voz · `/chat` Chat · `/agents` Agentes · `/crm` CRM · `/tasks` Tareas · `/automations` Automatizaciones · `/prompts` Librería · `/settings` Ajustes

## Acciones sensibles (requieren confirmación antes de ejecutar)
Enviar emails · Enviar WhatsApp · Publicar contenido · Eliminar datos

## Acciones seguras (se ejecutan automáticamente)
Crear tareas · Guardar leads · Generar propuestas · Crear borradores · Actualizar CRM · Disparar webhooks n8n

## Variables de entorno necesarias
```
ANTHROPIC_API_KEY=
NEXT_PUBLIC_N8N_WEBHOOK_URL=
N8N_WEBHOOK_SECRET=
ELEVENLABS_API_KEY=          # opcional
```

## Relación con el repo padre
- Este proyecto vive en `/veloxia-os/` dentro del repo `VELOXIA-WEB`
- El sitio estático (`veloxia.agency`) usa Cloudflare Pages desde la raíz
- VELOXIA OS se despliega en Vercel apuntando a `/veloxia-os/` como root → `os.veloxia.agency`
- Datos compartidos via los mismos webhooks n8n
- Favicon: `../assets/favicon.svg`

## Reglas de desarrollo
- Usar mock data completo antes de conectar cualquier API real
- Marcar cada punto de integración con `// TODO: Connect [service] API here`
- Componentes pequeños y separados — nada monolítico
- MVP: visual primero, lógica después, APIs al final
