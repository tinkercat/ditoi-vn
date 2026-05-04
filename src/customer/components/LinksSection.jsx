const FB_URL = 'https://facebook.com/profile.php?id=61567342402429'
const TT_URL = 'https://tiktok.com/@hy.dit.ngn.t'
const ZALO_URL = 'https://zalo.me/0979838250'
const HOTLINE = '0979838250'

function openTab(url) {
  window.open(url, '_blank', 'noopener,noreferrer')
}

export default function LinksSection({ menuLink, promoBadges }) {
  const { fb, tt, checkin, review } = promoBadges

  return (
    <>
      {/* ── MENU ── */}
      <div className="section-divider"><span>THỰC ĐƠN DÍ TỚI</span></div>
      <nav className="links-container">
        <a
          href={menuLink || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="action-btn btn-center"
          style={{ backgroundColor: 'var(--accent-red)', borderColor: 'var(--accent-red)', color: '#fff' }}
        >
          📖 XEM MENU DÍ TỚI TẠI ĐÂY
        </a>
      </nav>

      {/* ── ĐẶT BÀN ── */}
      <div className="section-divider"><span>ĐẶT BÀN &amp; LIÊN HỆ</span></div>
      <nav className="links-container">
        <button onClick={() => openTab(FB_URL)} className="action-btn btn-center">
          🍺 Đặt bàn qua Facebook
        </button>
        <button onClick={() => openTab(ZALO_URL)} className="action-btn btn-center">
          💬 Đặt bàn qua Zalo
        </button>
        <button
          onClick={() => { window.location.href = `tel:${HOTLINE}` }}
          className="action-btn btn-center"
        >
          📞 Gọi Hotline ngay
        </button>
      </nav>

      {/* ── FOLLOW & PROMO ── */}
      <div className="section-divider"><span>FOLLOW &amp; CHECK-IN NHẬN ƯU ĐÃI</span></div>
      <nav className="links-container">
        <button onClick={() => openTab(FB_URL)} className="action-btn btn-between">
          <div className="btn-main-text">👍 Follow Facebook</div>
          <span className="badge-offer">{fb || 'GIẢM 10%'}</span>
        </button>
        <button onClick={() => openTab(TT_URL)} className="action-btn btn-between">
          <div className="btn-main-text">🎬 Follow TikTok</div>
          <span className="badge-offer">{tt || 'TẶNG 1 MÓN'}</span>
        </button>
        <button className="action-btn btn-between">
          <div className="btn-main-text">📍 Check-in tại quán</div>
          <span className="badge-offer">{checkin || 'GIẢM 5%'}</span>
        </button>
        <button className="action-btn btn-between">
          <div className="btn-main-text">⭐ Đánh giá Google</div>
          <span className="badge-offer">{review || 'TẶNG NƯỚC'}</span>
        </button>
      </nav>
    </>
  )
}
