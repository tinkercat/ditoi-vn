import { useEffect, useState } from 'react'
import './customer.css'
import NavBar from './components/NavBar'
import BeerGauge from './components/BeerGauge'
import HeroSection from './components/HeroSection'
import AboutSection from './components/AboutSection'
import MenuSection from './components/MenuSection'
import OffersSection from './components/OffersSection'
import ReviewsSection from './components/ReviewsSection'
import ContactSection from './components/ContactSection'
import FloatingButtons from './components/FloatingButtons'
import BookingModal from './components/BookingModal'

const DEFAULT_CONFIG = {
  maps_link: 'https://maps.app.goo.gl/UjS1d73B7dVM6FyH9',
  maps_embed_url: '',
  menu_link: '',
  hotline: '0979838250',
  address: '195 Hoàng Sa, P. Tân Định, Quận 1, TP.HCM',
  opening_hours: '4h chiều – 2h sáng · Thứ 2 – Chủ Nhật',
  zalo_link: '',
  fb_link: 'https://www.facebook.com/ditoi.nhauchatmoingon/',
  messenger_link: 'https://m.me/ditoi.nhauchatmoingon',
  background_image_url: '',
  logo_url: '',
  brand_font_url: '',
  branch_name: 'Dí Tới – 195 Hoàng Sa, Q.1',
  // menu tab images
  menu_tab_1: '', menu_tab_2: '', menu_tab_3: '', menu_tab_4: '', menu_tab_5: '',
  menu_tab_6: '', menu_tab_7: '', menu_tab_8: '', menu_tab_9: '', menu_tab_10: '',
  // hero slider images
  hero_slide_1: '', hero_slide_2: '', hero_slide_3: '',
  hero_slide_4: '', hero_slide_5: '', hero_slide_6: '',
  // review photos
  review_photo_1: '', review_photo_2: '', review_photo_3: '',
  // parking image for offers section
  parking_image_url: '',
}

export default function CustomerPage() {
  const [config, setConfig] = useState(DEFAULT_CONFIG)
  const [bookingOpen, setBookingOpen] = useState(false)
  const [lightboxSrc, setLightboxSrc] = useState(null)

  useEffect(() => {
    fetch('/api/public-config')
      .then(r => (r.ok ? r.json() : null))
      .then(data => { if (data) setConfig(prev => ({ ...prev, ...data })) })
      .catch(() => {})
  }, [])

  // inject brand font override
  useEffect(() => {
    if (!config.brand_font_url) return
    const style = document.createElement('style')
    style.id = 'brand-font'
    style.textContent = `@font-face{font-family:'BrandFont';src:url('${config.brand_font_url}');}:root{--font-heading:'BrandFont','Oswald',sans-serif;}`
    const existing = document.getElementById('brand-font')
    if (existing) existing.replaceWith(style)
    else document.head.appendChild(style)
  }, [config.brand_font_url])

  // lock body scroll when modal open
  useEffect(() => {
    document.body.style.overflow = (bookingOpen || lightboxSrc) ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [bookingOpen, lightboxSrc])

  const menuImages = {
    menu_tab_1: config.menu_tab_1, menu_tab_2: config.menu_tab_2,
    menu_tab_3: config.menu_tab_3, menu_tab_4: config.menu_tab_4,
    menu_tab_5: config.menu_tab_5, menu_tab_6: config.menu_tab_6,
    menu_tab_7: config.menu_tab_7, menu_tab_8: config.menu_tab_8,
    menu_tab_9: config.menu_tab_9, menu_tab_10: config.menu_tab_10,
  }

  const slides = [
    config.hero_slide_1, config.hero_slide_2, config.hero_slide_3,
    config.hero_slide_4, config.hero_slide_5, config.hero_slide_6,
  ]

  const reviewPhotos = [config.review_photo_1, config.review_photo_2, config.review_photo_3]

  return (
    <>
      <NavBar logoUrl={config.logo_url} onBookingOpen={() => setBookingOpen(true)} />
      <BeerGauge />

      <HeroSection
        backgroundImageUrl={config.background_image_url}
        hotline={config.hotline}
        address={config.address}
        openingHours={config.opening_hours}
        slides={slides}
        onBookingOpen={() => setBookingOpen(true)}
        onLightbox={setLightboxSrc}
      />

      <AboutSection
        hotline={config.hotline}
        address={config.address}
        openingHours={config.opening_hours}
      />

      <MenuSection menuImages={menuImages} onLightbox={setLightboxSrc} />

      <OffersSection parkingImageUrl={config.parking_image_url} onLightbox={setLightboxSrc} />

      <ReviewsSection
        reviewPhotos={reviewPhotos}
        mapsLink={config.maps_link}
        onLightbox={setLightboxSrc}
      />

      <ContactSection
        hotline={config.hotline}
        address={config.address}
        openingHours={config.opening_hours}
        mapsLink={config.maps_link}
        mapsEmbedUrl={config.maps_embed_url}
        zaloLink={config.zalo_link}
        fbLink={config.fb_link}
        messengerLink={config.messenger_link}
        onBookingOpen={() => setBookingOpen(true)}
      />

      <footer className="site-footer">
        <div className="wrap">
          <div className="foot-grid">
            <div className="foot-brand">
              {config.logo_url && <img src={config.logo_url} alt="Dí Tới logo" />}
              <span className="foot-brand-text">DÍ <span>TỚI</span></span>
            </div>
            <p className="foot-note">Nhậu chất · Mồi ngon · Đúng gu Sài Gòn</p>
          </div>
          <div className="foot-bottom">
            <span>© 2025 Dí Tới. All rights reserved.</span>
            <span>195 Hoàng Sa, P. Tân Định, Q.1, TP.HCM</span>
          </div>
        </div>
      </footer>

      <FloatingButtons
        hotline={config.hotline}
        zaloLink={config.zalo_link}
        messengerLink={config.messenger_link}
      />

      {bookingOpen && (
        <BookingModal
          onClose={() => setBookingOpen(false)}
          hotline={config.hotline}
          branchName={config.branch_name}
          zaloLink={config.zalo_link}
          messengerLink={config.messenger_link}
        />
      )}

      {lightboxSrc && (
        <div className="lightbox-overlay" onClick={() => setLightboxSrc(null)}>
          <img src={lightboxSrc} alt="Phóng to" />
          <button className="lbx-close" onClick={() => setLightboxSrc(null)}>✕</button>
        </div>
      )}
    </>
  )
}
