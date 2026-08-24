import { useState } from 'react'

const PROMOS = [
  { value: 'Nhậu là vui là được, không cần ưu đãi', label: 'Nhậu là vui là được, không cần ưu đãi' },
  { value: 'Giảm 10% Mồi Bén - dịp sinh nhật',       label: 'Giảm 10% Mồi Bén – dịp sinh nhật' },
  { value: 'Giảm 5% Mồi Bén - đến sớm 16h-18h30',    label: 'Giảm 5% Mồi Bén – đến sớm 16h–18h30 (Thứ 2–Thứ 5)' },
]

const TIME_OPTS = ['16:00','16:30','17:00','17:30','18:00','18:30','19:00','19:30','20:00','20:30','21:00','21:30','22:00','22:30','23:00','23:30','00:00','00:30','01:00','01:30','02:00','02:30','03:00','03:30','04:00','04:30']

function buildMessage({ name, phone, branch, guests, date, time, promo, note }) {
  return [
    'ĐẶT BÀN - DÍ TỚI',
    `Tên: ${name}`,
    `SĐT: ${phone}`,
    `Cơ sở: ${branch}`,
    `Số khách: ${guests}`,
    `Ngày giờ: ${date || '(chưa chọn)'} lúc ${time}`,
    `Ưu đãi: ${promo}`,
    `Ghi chú: ${note || '(không có)'}`,
  ].join('\n')
}

export default function BookingModal({ onClose, hotline, branchName, zaloLink, messengerLink }) {
  const today = new Date().toISOString().split('T')[0]
  const defaultBranch = branchName || 'Dí Tới – 195 Hoàng Sa, Q.1'
  const [form, setForm] = useState({ name: '', phone: '', branch: defaultBranch, guests: 1, date: today, time: '19:00', promo: PROMOS[0].value, note: '' })
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  function set(key) { return e => setForm(prev => ({ ...prev, [key]: e.target.value })) }
  function adjustGuests(d) { setForm(prev => ({ ...prev, guests: Math.max(1, prev.guests + d) })) }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim() || !form.phone.trim()) { setError('Vui lòng nhập tên và số điện thoại.'); return }
    setError('')
    setSubmitting(true)

    fetch('/api/booking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customer_name: form.name.trim(), phone: form.phone.trim(), branch: form.branch, guests: form.guests, booking_date: form.date || null, booking_time: form.time || null, promotion: form.promo }),
    }).catch(() => {})

    const msg = buildMessage(form)
    const phone = (hotline || '0979838250').replace(/\D/g, '')
    const emailHref = `mailto:tutiensinhtts@gmail.com?subject=${encodeURIComponent(`Đặt bàn Dí Tới - ${form.name}`)}&body=${encodeURIComponent(msg)}`
    const zaloHref = zaloLink || `https://zalo.me/${phone}?text=${encodeURIComponent(msg)}`

    let copied = false
    try {
      if (navigator.clipboard && window.isSecureContext) { await navigator.clipboard.writeText(msg); copied = true }
      else {
        const ta = document.createElement('textarea')
        ta.value = msg; ta.style.position = 'fixed'; ta.style.left = '-9999px'
        document.body.appendChild(ta); ta.focus(); ta.select()
        copied = document.execCommand('copy')
        document.body.removeChild(ta)
      }
    } catch { copied = false }

    setResult({ copied, emailHref, zaloHref, msgHref: messengerLink || '#', phone: hotline || '0979838250' })
    setSubmitting(false)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <button className="modal-x" onClick={onClose} aria-label="Đóng">✕</button>
        <h3>Đặt bàn</h3>
        <p className="sub">Điền thông tin · Quán xác nhận qua Zalo trong 15 phút</p>

        {!result ? (
          <form onSubmit={handleSubmit}>
            <div className="modal-sec"><span className="bar" /><span>Thông tin của bạn</span></div>
            <div className="form-grid">
              <div className="field"><label>Tên của bạn</label><input type="text" placeholder="Tên của bạn" value={form.name} onChange={set('name')} required /></div>
              <div className="field"><label>Số điện thoại</label><input type="tel" placeholder="Số điện thoại" value={form.phone} onChange={set('phone')} required /></div>
            </div>

            <div className="modal-sec"><span className="bar" /><span>Thông tin đặt bàn</span></div>
            <div className="form-grid">
              <div className="field full"><label>Chi nhánh</label><select value={form.branch} onChange={set('branch')}><option value={defaultBranch}>{defaultBranch}</option></select></div>
              <div className="field">
                <label>Số lượng khách</label>
                <div className="guest-stepper">
                  <button type="button" onClick={() => adjustGuests(-1)}>−</button>
                  <span>{form.guests}</span>
                  <button type="button" onClick={() => adjustGuests(1)}>+</button>
                </div>
              </div>
              <div className="field"><label>Ngày đặt</label><input type="date" value={form.date} min={today} onChange={set('date')} /></div>
              <div className="field full"><label>Giờ đến</label>
                <div className="field-icon-wrap"><span className="field-emoji">🕐</span>
                  <select className="icon-padded" value={form.time} onChange={set('time')}>
                    {TIME_OPTS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div className="field full"><label>Ưu đãi</label>
                <div className="field-icon-wrap"><span className="field-emoji">🎟️</span>
                  <select className="icon-padded" value={form.promo} onChange={set('promo')}>
                    {PROMOS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                  </select>
                </div>
              </div>
              <div className="field full"><label>Ghi chú</label><textarea placeholder="Ghi chú thêm (không bắt buộc)" value={form.note} onChange={set('note')} /></div>
            </div>

            {error && <p style={{ color: '#cc2a1b', fontSize: '0.85rem', margin: '8px 0 0' }}>{error}</p>}
            <div className="modal-actions">
              <button type="button" className="link-close" onClick={onClose}>Đóng</button>
              <button type="submit" className="btn-submit" disabled={submitting}>{submitting ? 'Đang gửi...' : 'Đặt Bàn Ngay'}</button>
            </div>
          </form>
        ) : (
          <div className="result-panel show">
            <p>{result.copied
              ? 'Đã sao chép nội dung đặt bàn. Bấm "Gửi Email" để gửi thẳng cho quán, hoặc "Gọi ngay" / dán vào Zalo, Messenger để xác nhận.'
              : 'Bấm "Gửi Email" để gửi yêu cầu đặt bàn, hoặc "Gọi ngay" / mở Zalo để nhắn trực tiếp.'
            }</p>
            <div className="result-actions">
              <a href={`tel:${result.phone.replace(/\D/g,'')}`} className="r-call">📞 Gọi ngay</a>
              <a href={result.emailHref} className="r-email">📧 Gửi Email</a>
              <a href={result.zaloHref} target="_blank" rel="noopener noreferrer" className="r-zalo">💬 Gửi qua Zalo</a>
              {result.msgHref !== '#' && <a href={result.msgHref} target="_blank" rel="noopener noreferrer" className="r-msg">✉ Messenger</a>}
            </div>
            <div className="modal-actions" style={{ marginTop: 20 }}>
              <span />
              <button className="btn-submit" onClick={onClose}>Xong</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
