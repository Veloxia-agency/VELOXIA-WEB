// Server-side only — never imported from client components
// Credentials read from process.env, never logged or exposed

// Windows: Node 24's native fetch (undici) doesn't trust the Windows CA store by default.
// Setting this here makes all subsequent TLS connections from this process accept the system certs.
// This only runs server-side; in production (Cloudflare/Linux) this is a no-op.
if (process.env.NODE_ENV !== 'production') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
}

const BASE_URL = 'https://api.airtable.com/v0'

function getCredentials() {
  const apiKey = process.env.AIRTABLE_API_KEY
  const baseId = process.env.AIRTABLE_BASE_ID
  if (!apiKey || !baseId) {
    throw new Error('AIRTABLE_API_KEY o AIRTABLE_BASE_ID no configurados en .env.local')
  }
  return { apiKey, baseId }
}

function makeHeaders(apiKey: string): HeadersInit {
  return {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  }
}

function delay(ms: number) {
  return new Promise<void>(resolve => setTimeout(resolve, ms))
}

export interface FetchAllOptions {
  table: string
  maxRecords?: number
  filterFormula?: string
  sort?: Array<{ field: string; direction?: 'asc' | 'desc' }>
  view?: string
}

interface AirtableRawResponse<T> {
  records: Array<{ id: string; createdTime: string; fields: T }>
  offset?: string
}

export async function fetchAllRecords<T>(
  options: FetchAllOptions
): Promise<Array<{ id: string; fields: T }>> {
  const { apiKey, baseId } = getCredentials()
  const results: Array<{ id: string; fields: T }> = []
  let offset: string | undefined

  do {
    const params = new URLSearchParams()
    if (options.maxRecords) params.set('maxRecords', String(options.maxRecords))
    if (options.filterFormula) params.set('filterByFormula', options.filterFormula)
    if (options.view) params.set('view', options.view)
    if (offset) params.set('offset', offset)
    if (options.sort) {
      options.sort.forEach((s, i) => {
        params.set(`sort[${i}][field]`, s.field)
        if (s.direction) params.set(`sort[${i}][direction]`, s.direction)
      })
    }

    const url = `${BASE_URL}/${baseId}/${encodeURIComponent(options.table)}?${params}`

    // Airtable rate limit: 5 req/sec — add 200ms between requests
    await delay(200)

    const res = await fetch(url, { headers: makeHeaders(apiKey) })

    if (res.status === 429) {
      await delay(1000)
      continue
    }

    if (!res.ok) {
      const body = await res.text()
      if (res.status === 401 || res.status === 403) {
        throw new Error(`Airtable sin autorización (${res.status}). Verifica AIRTABLE_API_KEY y permisos del token.`)
      }
      if (res.status === 404) {
        throw new Error(`Tabla "${options.table}" no encontrada en Airtable (404). Verifica AIRTABLE_TABLE_*.`)
      }
      throw new Error(`Airtable error ${res.status}: ${body}`)
    }

    const data = (await res.json()) as AirtableRawResponse<T>
    results.push(...data.records.map(r => ({ id: r.id, fields: r.fields })))
    offset = data.offset
  } while (offset)

  return results
}

export async function fetchRecord<T>(
  table: string,
  recordId: string
): Promise<{ id: string; fields: T }> {
  const { apiKey, baseId } = getCredentials()
  const url = `${BASE_URL}/${baseId}/${encodeURIComponent(table)}/${recordId}`

  const res = await fetch(url, { headers: makeHeaders(apiKey) })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Airtable error ${res.status}: ${body}`)
  }

  const data = (await res.json()) as { id: string; createdTime: string; fields: T }
  return { id: data.id, fields: data.fields }
}
