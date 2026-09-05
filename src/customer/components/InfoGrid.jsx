export default function InfoGrid({ mapsLink, hotline }) {
  function handleCall(e) {
    e.preventDefault()
    if (hotline) window.location.href = `tel:${hotline.replace(/\s/g, '')}`
  }

  return (
    <section className="info-grid">
      <a
        href={mapsLink || '#'}
        target="_blank"
        rel="noopener noreferrer"
        className="info-card"
      >
        <span className="info-icon">📍</span>
        <div className="info-content">
          <span className="info-label">Địa chỉ</span>
          <span className="info-value">195 Hoàng Sa, P. Tân Định, Quận 1, HCM</span>
        </div>
      </a>

      <div className="info-card">
        <span className="info-icon">🕒</span>
        <div className="info-content">
          <span className="info-label">Giờ mở cửa</span>
          <span className="info-value">16:00 – 02:00 Mỗi ngày</span>
        </div>
      </div>

      <a href="#" onClick={handleCall} className="info-card">
        <span className="info-icon">📞</span>
        <div className="info-content">
          <span className="info-label">Hotline đặt bàn</span>
          <span className="info-value">{hotline || '0979838250'}</span>
        </div>
      </a>
    </section>
  )
}
