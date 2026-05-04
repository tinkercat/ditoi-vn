const { requireAuth, supabaseAdmin } = require('./_auth')

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  const { user, error } = await requireAuth(event)
  if (!user) {
    return { statusCode: 401, body: JSON.stringify({ error: error || 'Unauthorized' }) }
  }

  let body
  try {
    body = JSON.parse(event.body)
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON body' }) }
  }

  const { filename, contentType } = body
  if (!filename || !contentType) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'filename and contentType are required' }),
    }
  }

  // Sanitise: keep only safe characters
  const safeFilename = filename.replace(/[^a-zA-Z0-9._-]/g, '_')
  const path = `uploads/${Date.now()}_${safeFilename}`

  const { data, error: storageError } = await supabaseAdmin.storage
    .from('media')
    .createSignedUploadUrl(path)

  if (storageError) {
    return { statusCode: 500, body: JSON.stringify({ error: storageError.message }) }
  }

  const publicUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/media/${path}`

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ signedUrl: data.signedUrl, path, publicUrl }),
  }
}
