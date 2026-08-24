import { useState } from 'react'

// Time slots from 16:00 to 01:30 every 30 minutes
const TIME_SLOTS = (() => {
  const slots = []
  for (let h = 16; h <= 25; h++) {
    for (const m of [0, 30]) {
      if (h === 25 && m === 30) break
      const hour = h % 24
      const label = `${String(hour).padStart(2, '0')}:${m === 0 ? '00' : '30'}`
      slots.push(label)
    }
  }
  return slots
})()

const PROMOTIONS = [
  'Ưu đãi sinh nhật (giảm 10% tổng hoá đơn)',
  'Có mã ưu đãi riêng',
  'Đẩy tiền, không cần ưu đãi',
]

function isMobile() {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
}

function buildZaloMessage(form, branch) {
  const lines = [
    '[ĐẶT BÀN DÍ TỚI]',
    `Tên: ${form.name}`,
    `SĐT: ${form.phone}`,
    `Chi nhánh: ${branch || 'Dí Tới Q.10'}`,
    `Số khách: ${form.guests}`,
    `Ngày: ${form.date || '—'}`,
    `Giờ: ${form.time || '—'}`,
    `Ưu đãi: ${form.promotion || 'Không'}`,
  ]
  return lines.join('\n')
}

export default function BookingModal({ onClose, hotline, branchName }) {
  const today = new Date().toISOString().split('T')[0]
  const [form, setForm] = useState({
    name: '', phone: '', guests: 1, date: today, time: '', promotion: '',
  })
  const [promoOpen, setPromoOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  function set(key) {
    return e => setForm(prev => ({ ...prev, [key]: e.target.value }))
  }

  function adjustGuests(delta) {
    setForm(prev => ({ ...prev, guests: Math.max(1, prev.guests + delta) }))
  }

  async function handleSubmit() {
    if (!form.name.trim() || !form.phone.trim()) {
      setError('Vui lòng nhập tên và số điện thoại.')
      return
    }
    setError('')
    setSubmitting(true)

    try {
      await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: form.name.trim(),
          phone: form.phone.trim(),
          branch: branchName,
          guests: form.guests,
          booking_date: form.date || null,
          booking_time: form.time || null,
          promotion: form.promotion || null,
        }),
      })
    } catch {
      // non-blocking: still open Zalo even if DB save fails
    }

    setSubmitted(true)
    setSubmitting(false)

    if (isMobile()) {
      const msg = buildZaloMessage(form, branchName)
      const phone = (hotline || '0979838250').replace(/\D/g, '')
      const encoded = encodeURIComponent(msg)
      // open Zalo with pre-filled message; falls back to plain chat if text param unsupported
      setTimeout(() => {
        window.location.href = `https://zalo.me/${phone}?text=${encoded}`
      }, 800)
    }
  }

  return (
    <div className="booking-overlay" onClick={onClose}>
      <div className="booking-modal" onClick={e => e.stopPropagation()}>

        {submitted ? (
          <div className="booking-success">
            <div className="booking-title">ĐẶT BÀN THÀNH CÔNG! 🎉</div>
            <p>Cảm ơn bạn đã đặt bàn tại Dí Tới.</p>
            {isMobile()
              ? <p>Zalo sẽ mở để xác nhận đặt bàn với quán nhé!</p>
              : <p>Quán sẽ liên hệ lại qua số <strong>{form.phone}</strong> sớm nhất.</p>
            }
            <button className="booking-submit" onClick={onClose}>ĐÓNG</button>
          </div>
        ) : (
          <>
            <div className="booking-title">Đặt bàn</div>

            <div className="booking-section-label">Thông tin của bạn</div>
            <input
              className="booking-input"
              type="text"
              placeholder="Tên của bạn"
              value={form.name}
              onChange={set('name')}
            />
            <input
              className="booking-input"
              type="tel"
              placeholder="Số điện thoại"
              value={form.phone}
              onChange={set('phone')}
            />

            <div className="booking-section-label">Thông tin đặt bàn</div>
            <div className="booking-input booking-branch">{branchName || 'Dí Tới Q.10'}</div>

            <div className="booking-row">
              <div className="booking-guests">
                <span className="booking-row-label">Số lượng khách</span>
                <div className="guest-counter">
                  <button className="guest-btn" onClick={() => adjustGuests(-1)}>−</button>
                  <span className="guest-count">{form.guests}</span>
                  <button className="guest-btn" onClick={() => adjustGuests(1)}>+</button>
                </div>
              </div>
              <div className="booking-date-wrap">
                <span className="booking-row-label">Ngày đặt</span>
                <input
                  className="booking-input booking-date"
                  type="date"
                  value={form.date}
                  min={today}
                  onChange={set('date')}
                />
              </div>
              <div className="booking-time-wrap">
                <span className="booking-row-label">Giờ đến</span>
                <select className="booking-input booking-select" value={form.time} onChange={set('time')}>
                  <option value="">Chọn giờ</option>
                  {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            {/* Promotion accordion */}
            <div className="promo-accordion">
              <button className="promo-header" onClick={() => setPromoOpen(o => !o)}>
                <span>🎁 {form.promotion || 'Chọn ưu đãi'}</span>
                <span className="promo-chevron">{promoOpen ? '▲' : '▼'}</span>
              </button>
              {promoOpen && (
                <div className="promo-list">
                  {PROMOTIONS.map(p => (
                    <button
                      key={p}
                      className={`promo-option${form.promotion === p ? ' selected' : ''}`}
                      onClick={() => { setForm(prev => ({ ...prev, promotion: p })); setPromoOpen(false) }}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {error && <div className="booking-error">{error}</div>}

            <div className="booking-footer">
              <button className="booking-close-btn" onClick={onClose}>Đóng</button>
              <button
                className="booking-submit"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? 'ĐANG GỬI...' : 'ĐẶT BÀN NGAY'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
