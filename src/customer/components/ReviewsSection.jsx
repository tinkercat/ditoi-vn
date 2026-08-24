import { useRef } from 'react'

const REVIEWS = [
  { name: 'Ngan Duong',    sub: 'Local Guide · 9 đánh giá', text: '"Quán thiết kế xinh, phù hợp mọi đối tượng, bill giá ổn áp. Không gian chill ngắm bờ kè mát mẻ, cô chủ quán nhỏ nhắn dễ thương. Đặc biệt món nêm nếm rất ngon!"' },
  { name: 'Le Thanhtam',   sub: '4 đánh giá',                text: '"Quán đẹp và sạch sẽ, nhân viên dễ thương. Đi sinh nhật ở đây quán rất chu đáo, đồ ăn món nào cũng ngon hợp gu, 10 điểm — sẽ quay lại nhiều lần nữa."' },
  { name: 'Minds Curious', sub: 'Khách quốc tế',             text: '"Amazing local restaurant! Great Vietnamese food, good prices, and a fun atmosphere. The staff speak English really well."' },
  { name: 'Henry',         sub: 'Local Guide · 35 đánh giá', text: '"Không gian chill, đồ ăn ngon mà đặc biệt nhân viên cực kỳ thân thiện nhiệt tình. Ai chưa đi thử thì nên đi nhé!"' },
  { name: 'Irish',         sub: 'Khách quốc tế',             text: '"Very hospitable for foreigners. Very good food and vibes."' },
  { name: 'Cam Duong',     sub: '2 đánh giá',                text: '"Quán mới mở, đồ ăn ngon, trang trí món ăn đẹp, nhân viên nhiệt tình. Sẽ ghé lại tiếp."' },
  { name: 'Vũ Đình Đăng',  sub: '3 đánh giá',                text: '"Nhân viên rất nhiệt tình, đồ ăn ngon giá hợp lý, có máy chiếu xem bóng đá."' },
  { name: 'Xê Thư',        sub: '1 đánh giá',                text: '"Nhân viên rất nhiệt tình và dễ thương, phục vụ chuyên nghiệp. Hôm mình tới còn có nhạc gõ bo cho khách hát!"' },
]

export default function ReviewsSection({ reviewPhotos, mapsLink, onLightbox }) {
  const scrollerRef = useRef(null)

  function scroll(dir) {
    scrollerRef.current?.scrollBy({ left: dir * 340 * 2, behavior: 'smooth' })
  }

  return (
    <section className="reviews-section section-shell" id="danh-gia">
      <div className="wrap">
        <div className="reviews-head">
          <div>
            <div className="eyebrow">Khách nói gì về Dí Tới</div>
            <h2 style={{ fontSize: 'clamp(30px,4vw,44px)', marginTop: 14, color: 'var(--cream)' }}>
              Đánh giá thật từ Google Maps
            </h2>
            <div className="reviews-stat">
              <div className="g-badge">G</div>
              <div className="stars">★★★★★</div>
              <div className="stat-text">
                <strong>21 đánh giá 5 sao gần đây</strong>
                Cập nhật liên tục từ khách ghé quán
              </div>
            </div>
          </div>
          <a className="btn btn-outline" href={mapsLink || '#'} target="_blank" rel="noopener noreferrer">
            Xem Tất Cả Trên Google
          </a>
        </div>

        {reviewPhotos.some(Boolean) && (
          <>
            <div className="review-photos-label">Ảnh chụp thật từ khách hàng</div>
            <div className="review-photos">
              {reviewPhotos.map((src, i) =>
                src
                  ? <img key={i} src={src} alt={`Ảnh khách hàng Dí Tới ${i+1}`} onClick={() => onLightbox(src)} />
                  : <div key={i} className="photo-placeholder">Ảnh khách hàng</div>
              )}
            </div>
          </>
        )}

        <div className="review-scroller" ref={scrollerRef}>
          {REVIEWS.map((r, i) => (
            <div className="review-card" key={i}>
              <div className="stars">★★★★★</div>
              <p>{r.text}</p>
              <div className="review-foot">
                <div className="review-avatar">{r.name[0]}</div>
                <div><strong>{r.name}</strong><span>{r.sub}</span></div>
              </div>
            </div>
          ))}
        </div>
        <div className="review-nav">
          <button onClick={() => scroll(-1)} aria-label="Xem trước">‹</button>
          <button onClick={() => scroll(1)} aria-label="Xem tiếp">›</button>
        </div>
      </div>
    </section>
  )
}
