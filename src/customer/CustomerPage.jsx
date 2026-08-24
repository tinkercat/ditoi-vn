import { useEffect, useState } from 'react'
import './customer.css'
import HeroSection from './components/HeroSection'
import InfoGrid from './components/InfoGrid'
import LinksSection from './components/LinksSection'
import AiSection from './components/AiSection'
import VoucherSection from './components/VoucherSection'
import BookingModal from './components/BookingModal'

const DEFAULT_CONFIG = {
  maps_link: 'https://maps.app.goo.gl/UjS1d73B7dVM6FyH9',
  menu_link: 'https://example.com/menu',
  hotline: '0979838250',
  slogan: "ĐÃ 'DÍ' LÀ PHẢI 'TỚI'",
  promo_fb: 'GIẢM 10%',
  promo_tt: 'TẶNG 1 MÓN',
  promo_checkin: 'GIẢM 5%',
  promo_review: 'TẶNG NƯỚC',
  background_image_url: '',
  logo_url: '',
  brand_font_url: '',
  branch_name: '1A Tam Đảo, P. Hoà Hưng, Q.10, HCM',
  menu_cover_url: '',
  menu_drinks_url: '',
}

export default function CustomerPage() {
  const [config, setConfig] = useState(DEFAULT_CONFIG)
  const [bookingOpen, setBookingOpen] = useState(false)

  useEffect(() => {
    fetch('/api/public-config')
      .then(r => (r.ok ? r.json() : null))
      .then(data => { if (data) setConfig(prev => ({ ...prev, ...data })) })
      .catch(() => {}) // fall back to defaults silently
  }, [])

  // Inject brand font if one is set
  useEffect(() => {
    if (!config.brand_font_url) return
    const style = document.createElement('style')
    style.id = 'brand-font'
    style.textContent = `@font-face { font-family: 'BrandFont'; src: url('${config.brand_font_url}'); } :root { --font-heading: 'BrandFont', 'Bebas Neue', sans-serif; }`
    const existing = document.getElementById('brand-font')
    if (existing) existing.replaceWith(style)
    else document.head.appendChild(style)
  }, [config.brand_font_url])

  const promoBadges = {
    fb: config.promo_fb,
    tt: config.promo_tt,
    checkin: config.promo_checkin,
    review: config.promo_review,
  }

  return (
    <div className="customer-container">
      {bookingOpen && (
        <BookingModal
          onClose={() => setBookingOpen(false)}
          hotline={config.hotline}
          branchName={config.branch_name}
        />
      )}
      <HeroSection
        backgroundImageUrl={config.background_image_url}
        logoUrl={config.logo_url}
        slogan={config.slogan}
        onBookingOpen={() => setBookingOpen(true)}
      />
      <InfoGrid mapsLink={config.maps_link} hotline={config.hotline} />
      <LinksSection menuLink={config.menu_link} promoBadges={promoBadges} />
      <AiSection />
      <VoucherSection />
      <footer style={{ padding: '20px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <p style={{ fontFamily: 'var(--font-heading)', fontSize: '0.8rem', color: 'var(--accent-gold)', opacity: 0.5 }}>
          Dí Tới · Q.10 · Sài Gòn
        </p>
      </footer>
    </div>
  )
}
