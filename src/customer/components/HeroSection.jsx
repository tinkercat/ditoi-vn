const FALLBACK_BG =
  "https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1000&auto=format&fit=crop"

export default function HeroSection({ backgroundImageUrl, logoUrl, slogan }) {
  const bgImage = backgroundImageUrl || FALLBACK_BG
  const heroBgStyle = {
    backgroundImage: `linear-gradient(to bottom, rgba(24,16,0,0) 0%, rgba(24,16,0,0.4) 50%, rgba(24,16,0,1) 100%), url('${bgImage}')`,
    backgroundPosition: 'center',
    backgroundSize: 'cover',
  }

  return (
    <header className="hero">
      <div className="hero-bg" style={heroBgStyle} />
      {logoUrl && <img className="logo-img" src={logoUrl} alt="Dí Tới logo" />}
      <div className="slogan-badge">{slogan || "ĐÃ 'DÍ' LÀ PHẢI 'TỚI'"}</div>
      <div className="hero-sub">NHẬU CHẤT – MỒI NGON</div>
    </header>
  )
}
