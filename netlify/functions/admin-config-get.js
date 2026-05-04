const { requireAuth, supabaseAdmin } = require('./_auth')

exports.handler = async (event) => {
  const { user, error } = await requireAuth(event)
  if (!user) {
    return { statusCode: 401, body: JSON.stringify({ error: error || 'Unauthorized' }) }
  }

  const { data, error: dbError } = await supabaseAdmin
    .from('site_config')
    .select('key, value')

  if (dbError) {
    return { statusCode: 500, body: JSON.stringify({ error: dbError.message }) }
  }

  const config = Object.fromEntries(data.map(({ key, value }) => [key, value]))

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config),
  }
}
