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
    return json(400, { ok: false, error: 'Invalid JSON' });
  }

  const {
    nombre, instagram, nicho, oferta, ticket,
    canales, leadsAlMes, tono, nichoDetectado,
    website,
  } = body;

  // Honeypot — bots rellenan este campo, humanos no
  if (website) return json(200, { ok: true });

  // Validación de requeridos
  if (!nombre || !nicho || !oferta) {
    return json(400, { ok: false, error: 'Faltan campos obligatorios: nombre, nicho, oferta' });
  }

  const table = encodeURIComponent(env.AIRTABLE_TABLE_LEADS);
  const url   = `https://api.airtable.com/v0/${env.AIRTABLE_BASE_ID}/${table}`;

  try {
    const airtableRes = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.AIRTABLE_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        typecast: true,
        fields: {
          Nombre:         nombre,
          Instagram:      instagram       || '',
          Nicho:          nicho,
          Oferta:         oferta,
          Ticket:         ticket          || '',
          Canales:        (canales || []).join(' · '),
          LeadsAlMes:     leadsAlMes      || '',
          Tono:           tono            || '',
          NichoDetectado: nichoDetectado  || '',
          Origen:         'Forge',
          Estado:         'Nuevo',
        },
      }),
    });

    const responseText = await airtableRes.text();

    if (!airtableRes.ok) {
      console.log('Airtable error:', airtableRes.status, responseText);
      return json(502, { ok: false, error: 'Airtable rejected the record', status: airtableRes.status });
    }

    const data = JSON.parse(responseText);

    // Aviso Telegram — waitUntil garantiza que el fetch termine aunque ya hayamos respondido
    context.waitUntil(notifyTelegram(env, { nombre, instagram, nicho, oferta, ticket, canales, leadsAlMes, tono }));

    return json(200, { ok: true, id: data.id });

  } catch (err) {
    console.log('Airtable exception:', err.message);
    return json(502, { ok: false, error: err.message });
  }
}

function notifyTelegram(env, lead) {
  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) return Promise.resolve();

  const lines = [
    '🔥 <b>NUEVO LEAD · FORGE</b>',
    '',
    `👤 <b>Nombre:</b> ${lead.nombre}`,
    lead.instagram ? `📸 <b>Instagram:</b> ${lead.instagram}` : null,
    `🎯 <b>Nicho:</b> ${lead.nicho}`,
    `💼 <b>Oferta:</b> ${lead.oferta}`,
    lead.ticket     ? `💶 <b>Ticket:</b> ${lead.ticket}` : null,
    lead.canales && lead.canales.length ? `📲 <b>Canales:</b> ${lead.canales.join(' · ')}` : null,
    lead.leadsAlMes ? `📊 <b>Leads/mes:</b> ${lead.leadsAlMes}` : null,
    lead.tono       ? `🗣 <b>Tono:</b> ${lead.tono}` : null,
  ].filter(Boolean).join('\n');

  return fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT_ID, text: lines, parse_mode: 'HTML' }),
  }).catch(function(err) { console.warn('Telegram notify failed:', err.message); });
}

function json(status, payload) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
