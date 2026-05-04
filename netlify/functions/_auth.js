// Shared auth helper — not deployed as a function endpoint (underscore prefix)
const { createClient } = require('@supabase/supabase-js')

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY,
)

async function requireAuth(event) {
  const authHeader = event.headers['authorization'] || event.headers['Authorization'] || ''
  const token = authHeader.replace('Bearer ', '').trim()
  if (!token) return { user: null, supabaseAdmin, error: 'No token provided' }

  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
  return { user: error ? null : user, supabaseAdmin, error: error?.message || null }
}

module.exports = { requireAuth, supabaseAdmin }
