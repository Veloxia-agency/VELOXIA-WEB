const RATE_LIMIT    = 5;   // máx peticiones por IP
const RATE_WINDOW   = 60;  // segundos

const ipTimestamps = new Map();

function isRateLimited(ip) {
  const now  = Date.now();
  const cutoff = now - RATE_WINDOW * 1000;
  const hits = (ipTimestamps.get(ip) || []).filter(function(t) { return t > cutoff; });
  if (hits.length >= RATE_LIMIT) return true;
  hits.push(now);
  ipTimestamps.set(ip, hits);
  // Purga IPs sin actividad reciente para no crecer indefinidamente
  if (ipTimestamps.size > 500) {
    ipTimestamps.forEach(function(ts, key) {
      if (ts.every(function(t) { return t <= cutoff; })) ipTimestamps.delete(key);
    });
  }
  return false;
}

export async function onRequest(context) {
  const { env, request } = context;

  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', {
      status: 405,
      headers: { Allow: 'POST', 'Content-Type': 'text/plain' },
    });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json(200, { ok: false });
  }

  const { nicho, oferta, ticket, tono, canales, website } = body;

  // Honeypot
  if (website) return json(200, { ok: false });

  // Rate limit por IP
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  if (isRateLimited(ip)) return json(200, { ok: false });

  // Campos mínimos
  if (!nicho || !oferta) return json(200, { ok: false });

  const canal = Array.isArray(canales) && canales.length > 0
    ? canales.join(', ')
    : 'Instagram DM';

  const systemPrompt =
`Eres ARIA, el setter IA de un negocio. Tu trabajo es responder a un lead entrante,
cualificarlo y llevarlo a agendar una llamada — NO cerrar la venta ni dar precio a la primera.

NEGOCIO:
- Nicho: ${nicho}
- Oferta principal: ${oferta}
- Precio aproximado: ${ticket || 'no especificado'}
- Tono de marca: ${tono || 'profesional y cercano'}
- Canal: ${canal}

COMPORTAMIENTO:
- Cálida pero profesional. Una sola pregunta calibrada por mensaje.
- Si preguntan precio de entrada, NO lo sueltas: rediriges a entender su situación primero.
- Detectas el dolor real y lo nombras.
- Cierras llevando a una llamada de valoración gratuita, sin compromiso.
- Hablas en el tono de marca indicado. Español natural, frases de chat (no parrafadas).

GENERA una conversación realista de 3 intercambios (lead → ARIA), escalando así:
1. Lead pregunta precio/info → ARIA cualifica con una pregunta.
2. Lead da contexto/dolor → ARIA profundiza y conecta con la oferta.
3. Lead muestra una objeción típica del nicho → ARIA la maneja y propone la llamada.

Los mensajes del LEAD deben sonar a una persona real de ese nicho (dudas, objeciones
creíbles), NO a un cliente perfecto.

DEVUELVE SOLO un array JSON válido, sin markdown ni texto extra:
[{"lead":"...","aria":"..."},{"lead":"...","aria":"..."},{"lead":"...","aria":"..."}]`;

  try {
    const apiRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key':          env.ANTHROPIC_API_KEY,
        'anthropic-version':  '2023-06-01',
        'content-type':       'application/json',
      },
      body: JSON.stringify({
        model:      'claude-haiku-4-5-20251001',
        max_tokens: 700,
        system:     systemPrompt,
        messages:   [{ role: 'user', content: 'Genera la conversación ahora.' }],
      }),
    });

    if (!apiRes.ok) {
      console.log('Anthropic API error:', apiRes.status);
      return json(200, { ok: false });
    }

    const data    = await apiRes.json();
    const rawText = (data.content && data.content[0] && data.content[0].text)
      ? data.content[0].text.trim()
      : '';

    if (!rawText) return json(200, { ok: false });

    // Parsear JSON — tolerante a pequeños prefijos de texto
    let conversation;
    try {
      conversation = JSON.parse(rawText);
    } catch {
      const match = rawText.match(/\[[\s\S]*\]/);
      if (!match) return json(200, { ok: false });
      try { conversation = JSON.parse(match[0]); } catch { return json(200, { ok: false }); }
    }

    // Validar estructura: exactamente 3 objetos con lead+aria no vacíos
    if (
      !Array.isArray(conversation) ||
      conversation.length !== 3 ||
      !conversation.every(function(c) {
        return c &&
          typeof c.lead === 'string' && c.lead.trim() !== '' &&
          typeof c.aria === 'string' && c.aria.trim() !== '';
      })
    ) {
      return json(200, { ok: false });
    }

    return json(200, { ok: true, conversation });

  } catch (err) {
    console.log('forge-preview exception:', err.message);
    return json(200, { ok: false });
  }
}

function json(status, payload) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
