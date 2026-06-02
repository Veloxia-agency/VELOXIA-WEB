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

  let airtableRes;
  try {
    airtableRes = await fetch(url, {
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
  } catch (err) {
    console.log('Airtable fetch error:', err.message);
    return json(502, { ok: false, error: 'Error connecting to Airtable' });
  }

  if (!airtableRes.ok) {
    const errBody = await airtableRes.text();
    console.log('Airtable error response:', airtableRes.status, errBody);
    return json(502, { ok: false, error: 'Airtable rejected the record' });
  }

  const data = await airtableRes.json();
  return json(200, { ok: true, id: data.id });
}

function json(status, payload) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
