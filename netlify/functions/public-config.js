const { supabaseAdmin } = require('./_auth')

exports.handler = async () => {
  const { data, error } = await supabaseAdmin
    .from('site_config')
    .select('key, value')

  if (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    }
  }

  const config = Object.fromEntries(data.map(({ key, value }) => [key, value]))

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=30, stale-while-revalidate=60',
    },
    body: JSON.stringify(config),
  }
}
