const FALLBACK_BG = '/images/background.jpg'
const FALLBACK_LOGO = '/images/logo.png'

export default function HeroSection({ backgroundImageUrl, logoUrl, slogan, onBookingOpen }) {
  const bgImage = backgroundImageUrl || FALLBACK_BG
  const logo = logoUrl || FALLBACK_LOGO
  const heroBgStyle = {
    backgroundImage: `linear-gradient(to bottom, rgba(24,16,0,0) 0%, rgba(24,16,0,0.4) 50%, rgba(24,16,0,1) 100%), url('${bgImage}')`,
    backgroundPosition: 'center',
    backgroundSize: 'cover',
  }

  return (
    <header className="hero">
      <div className="hero-bg" style={heroBgStyle} />
      <img className="logo-img" src={logo} alt="Dí Tới logo" />
      <div className="slogan-badge">{slogan || "ĐÃ 'DÍ' LÀ PHẢI 'TỚI'"}</div>
      <div className="hero-sub">NHẬU CHẤT – MỒI NGON</div>
      <button className="hero-book-btn" onClick={onBookingOpen}>🍺 ĐẶT BÀN NGAY</button>
    </header>
  )
}
