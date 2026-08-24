export default function HeroSection({ backgroundImageUrl, hotline, address, openingHours, slides, onBookingOpen, onLightbox }) {
  const validSlides = (slides || []).filter(Boolean)
  const displaySlides = validSlides.length > 0 ? [...validSlides, ...validSlides] : []

  return (
    <section className="hero" id="trang-chu">
      {backgroundImageUrl && (
        <div className="hero-bg-img" style={{ backgroundImage: `url('${backgroundImageUrl}')` }} />
      )}
      <div className="hero-inner">
        <div className="hero-tag">★ Quán nhậu vỉa hè · Sài Gòn</div>
        <h1>QUÁN NHẬU DÍ TỚI</h1>
        <p className="lead">Mồi nóng dọn liền tay, bia mát không bao giờ vơi ly. Anh em ghé Dí Tới, đã dí là phải tới bến — không dí nửa vời.</p>
        <div className="hero-ctas">
          <button className="btn btn-primary" onClick={onBookingOpen}>Đặt Bàn Ngay</button>
          <a className="btn btn-outline" href="#thuc-don"
            onClick={e => { e.preventDefault(); document.getElementById('thuc-don')?.scrollIntoView({ behavior: 'smooth' }) }}>
            Xem Thực Đơn
          </a>
        </div>
        <div className="hero-meta">
          <div><strong>{openingHours || '4H CHIỀU – 2H SÁNG'}</strong>Mở cửa mỗi ngày, Thứ 2 – Chủ Nhật</div>
          <div><strong>{address || '195 HOÀNG SA'}</strong>P. Tân Định, Quận 1, TP.HCM</div>
          <div><strong>{hotline || '0979 838 250'}</strong>Gọi đặt bàn hoặc hỏi mồi hôm nay</div>
        </div>
      </div>
      {displaySlides.length > 0 && (
        <div className="hero-slider-wrap">
          <div className="hero-slider">
            {displaySlides.map((src, i) => (
              <img key={i} src={src}
                alt={i < validSlides.length ? 'Không khí tại Dí Tới' : ''}
                aria-hidden={i >= validSlides.length || undefined}
                onClick={() => i < validSlides.length && onLightbox(src)}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
