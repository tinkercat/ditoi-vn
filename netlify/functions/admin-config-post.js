const { requireAuth, supabaseAdmin } = require('./_auth')

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  const { user, error } = await requireAuth(event)
  if (!user) {
    return { statusCode: 401, body: JSON.stringify({ error: error || 'Unauthorized' }) }
  }

  let updates
  try {
    updates = JSON.parse(event.body)
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON body' }) }
  }

  if (!Array.isArray(updates)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Body must be an array of { key, value } objects' }),
    }
  }

  const rows = updates.map(({ key, value }) => ({
    key,
    value: String(value ?? ''),
    updated_at: new Date().toISOString(),
  }))

  const { error: dbError } = await supabaseAdmin
    .from('site_config')
    .upsert(rows, { onConflict: 'key' })

  if (dbError) {
    return { statusCode: 500, body: JSON.stringify({ error: dbError.message }) }
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ok: true }),
  }
}
