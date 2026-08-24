const { supabaseAdmin } = require('./_auth')

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  let body
  try {
    body = JSON.parse(event.body)
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) }
  }

  const { customer_name, phone, branch, guests, booking_date, booking_time, promotion } = body

  if (!customer_name || !phone) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Tên và số điện thoại là bắt buộc' }) }
  }

  const { error } = await supabaseAdmin.from('bookings').insert({
    customer_name,
    phone,
    branch: branch || null,
    guests: guests || 1,
    booking_date: booking_date || null,
    booking_time: booking_time || null,
    promotion: promotion || null,
  })

  if (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) }
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ok: true }),
  }
}
