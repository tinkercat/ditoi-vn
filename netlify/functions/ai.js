const { supabaseAdmin } = require('./_auth')

const GEMINI_MODEL = 'gemini-2.5-flash'
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`

async function fetchWithRetry(url, options, retries = 3, delayMs = 1000) {
  try {
    const res = await fetch(url, options)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res
  } catch (err) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, delayMs))
      return fetchWithRetry(url, options, retries - 1, delayMs * 2)
    }
    throw err
  }
}

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

  const { mode } = body
  if (!['recommend', 'slogan'].includes(mode)) {
    return { statusCode: 400, body: JSON.stringify({ error: 'mode must be "recommend" or "slogan"' }) }
  }

  // Fetch menu link from DB for the recommend prompt
  const { data: menuRow } = await supabaseAdmin
    .from('site_config')
    .select('value')
    .eq('key', 'menu_link')
    .single()

  const menuLink = menuRow?.value || ''

  const systemPrompt =
    mode === 'recommend'
      ? `Bạn là một phục vụ chuyên nghiệp tại quán nhậu "Dí Tới" ở Sài Gòn. Hãy tư vấn 3 món mồi bén nhất hiện có (hoặc đề xuất món nhậu phổ biến), sau đó nhắc khách click vào nút "XEM MENU DÍ TỚI TẠI ĐÂY" để chọn món. Trình bày như đoạn trò chuyện bình thường, xuống dòng rõ ràng. Tuyệt đối KHÔNG dùng ký hiệu markdown như *, #, hay dấu gạch ngang đầu dòng. Menu link: ${menuLink}`
      : `Bạn là một "trùm nhậu" có tiếng. Hãy sáng tạo đúng MỘT câu hô nhậu kiểu "1-2-3 Dô" hoặc một câu slogan hài hước, cực gắt cho dân nhậu tại quán "Dí Tới". Chỉ một câu duy nhất, ngắn gọn. Tuyệt đối KHÔNG dùng ký hiệu markdown như *, #, hay in đậm.`

  const apiKey = process.env.GEMINI_API_KEY
  const requestUrl = `${GEMINI_URL}?key=${apiKey}`

  try {
    const res = await fetchWithRetry(requestUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: 'Hãy trả lời khách hàng ngay!' }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
      }),
    })

    const data = await res.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: text || 'Lỗi rồi, dứt ly khác đi!' }),
    }
  } catch {
    return {
      statusCode: 500,
      body: JSON.stringify({ text: 'Mạng lag rồi, anh em cứ dập trước đi!' }),
    }
  }
}
