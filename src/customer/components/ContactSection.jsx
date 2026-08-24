const DEFAULT_MAPS_EMBED_URL = 'https://www.google.com/maps?q=195%20Ho%C3%A0ng%20Sa%2C%20Ph%C6%B0%E1%BB%9Dng%20T%C3%A2n%20%C4%90%E1%BB%8Bnh%2C%20Qu%E1%BA%ADn%201%2C%20TP.HCM&output=embed'

export default function ContactSection({ hotline, address, openingHours, mapsLink, mapsEmbedUrl, zaloLink, fbLink, messengerLink, onBookingOpen }) {
  return (
    <section className="contact-section section-shell" id="lien-he">
      <div className="wrap">
        <div className="eyebrow">Liên hệ</div>
        <h2 style={{ fontSize: 'clamp(30px,4vw,42px)', marginTop: 14, color: 'var(--cream)', marginBottom: 40 }}>
          Ghé Dí Tới hôm nay
        </h2>
        <div className="contact-grid">
          <div>
            <div className="info-block">
              <div className="info-item"><span className="ic">📍</span><div><strong>Địa chỉ</strong><span>{address || '195 Hoàng Sa, P. Tân Định, Quận 1, TP.HCM'}</span></div></div>
              <div className="info-item"><span className="ic">⏰</span><div><strong>Giờ mở cửa</strong><span>{openingHours || '4h chiều – 2h sáng · Thứ 2 – Chủ Nhật'}</span></div></div>
              <div className="info-item"><span className="ic">📞</span><div><strong>Hotline</strong><span>{hotline || '0979 838 250'}</span></div></div>
              <div className="info-item"><span className="ic">💬</span><div><strong>Zalo &amp; Messenger</strong><span>Nhắn trực tiếp để hỏi mồi hoặc đặt bàn nhanh</span></div></div>
            </div>
            <div className="social-row" style={{ marginTop: 24 }}>
              <a href={`tel:${(hotline||'').replace(/\D/g,'')}`} aria-label="Gọi điện" title="Gọi điện">📞</a>
              {zaloLink && <a href={zaloLink} target="_blank" rel="noopener noreferrer" aria-label="Zalo" title="Zalo">Z</a>}
              {fbLink && <a href={fbLink} target="_blank" rel="noopener noreferrer" aria-label="Facebook" title="Facebook">f</a>}
              {messengerLink && <a href={messengerLink} target="_blank" rel="noopener noreferrer" aria-label="Messenger" title="Messenger">M</a>}
            </div>
            <div className="map-frame">
              <iframe
                src={mapsEmbedUrl || DEFAULT_MAPS_EMBED_URL}
                title="Bản đồ Dí Tới"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
          <div className="reserve-card">
            <h3>Giữ bàn trước, khỏi lo chạy bàn</h3>
            <p>Đặt bàn online ngay — điền thông tin, chọn ưu đãi. Quán xác nhận qua Zalo trong vòng 15 phút.</p>
            <button className="btn btn-primary" onClick={onBookingOpen}>Đặt Bàn Ngay</button>
          </div>
        </div>
      </div>
    </section>
  )
}
