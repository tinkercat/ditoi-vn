import { useEffect, useLayoutEffect, useState } from 'react'
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
  maps_link: 'https://maps.app.goo.gl/GLcwnZUBRc1MGqig7',
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

const PATH_SECTION_IDS = {
  '/thuc-don': 'thuc-don',
  '/khong-gian': 'khong-gian',
  '/dat-ban': 'dat-ban',
  '/sinh-nhat': 'sinh-nhat',
  '/uu-dai': 'uu-dai',
  '/lien-he': 'lien-he',
}
const SECTION_IDS = new Set(['trang-chu', ...Object.values(PATH_SECTION_IDS)])

const SEO_TITLES = {
  'trang-chu': 'Dí Tới – Nhậu Chất, Mồi Ngon | Q.1 Sài Gòn',
  'thuc-don': 'Thực đơn | Dí Tới – Quán nhậu Q.1 Sài Gòn',
  'khong-gian': 'Không gian Dí Tới – Quán nhậu view sông Sài Gòn',
  'dat-ban': 'Đặt bàn | Dí Tới – Quán nhậu Q.1 Sài Gòn',
  'sinh-nhat': 'Sinh nhật & Tiệc nhóm | Dí Tới – Quán nhậu Q.1',
  'uu-dai': 'Ưu đãi | Dí Tới – Quán nhậu Q.1 Sài Gòn',
  'lien-he': 'Liên hệ & Địa chỉ | Dí Tới – 195 Hoàng Sa, Q.1',
}

function updateSeo(sectionId) {
  const id = SEO_TITLES[sectionId] ? sectionId : 'trang-chu'
  document.title = SEO_TITLES[id]
  const canonical = document.querySelector('link[rel="canonical"]')
  const url = id === 'trang-chu' ? 'https://ditoi.vn/' : `https://ditoi.vn/${id}`
  if (canonical) canonical.setAttribute('href', url)
  document.querySelector('meta[property="og:url"]')?.setAttribute('content', url)
}
export default function CustomerPage() {
  const [config, setConfig] = useState(DEFAULT_CONFIG)
  const [configLoaded, setConfigLoaded] = useState(false)
  const [pageReady, setPageReady] = useState(false)
  const [loadProgress, setLoadProgress] = useState(0)
  const [bookingOpen, setBookingOpen] = useState(false)
  const [lightboxSrc, setLightboxSrc] = useState(null)

  useLayoutEffect(() => {
    function scrollToCurrentPath() {
      const path = window.location.pathname.replace(/\/$/, '') || '/'
      const pathSectionId = PATH_SECTION_IDS[path]
      const hashSectionId = window.location.hash.slice(1)
      const sectionId = pathSectionId || (SECTION_IDS.has(hashSectionId) ? hashSectionId : path === '/' ? 'trang-chu' : null)

      updateSeo(sectionId)
      if (pathSectionId) window.history.replaceState({}, '', `/#${pathSectionId}`)
      if (sectionId) document.getElementById(sectionId)?.scrollIntoView({ behavior: 'instant', block: 'start' })
    }

    scrollToCurrentPath()
    window.addEventListener('popstate', scrollToCurrentPath)
    window.addEventListener('hashchange', scrollToCurrentPath)
    return () => {
      window.removeEventListener('popstate', scrollToCurrentPath)
      window.removeEventListener('hashchange', scrollToCurrentPath)
    }
  }, [pageReady])

  useEffect(() => {
    let active = true
    const controller = new AbortController()
    const timeoutId = window.setTimeout(() => controller.abort(), 8000)

    fetch('/api/public-config', { signal: controller.signal })
      .then(r => (r.ok ? r.json() : null))
      .then(data => { if (active && data) setConfig(prev => ({ ...prev, ...data })) })
      .catch(() => {})
      .finally(() => {
        window.clearTimeout(timeoutId)
        if (active) setConfigLoaded(true)
      })

    return () => {
      active = false
      window.clearTimeout(timeoutId)
      controller.abort()
    }
  }, [])

  useEffect(() => {
    if (!configLoaded) return

    let active = true
    let timeoutId
    let revealTimeoutId
    const browserLoaded = document.readyState === 'complete'
      ? Promise.resolve()
      : new Promise(resolve => window.addEventListener('load', resolve, { once: true }))
    const fontsLoaded = document.fonts?.ready ?? Promise.resolve()

    async function waitForImages() {
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))

      const images = Array.from(document.querySelectorAll('.page-content img'))
      const heroBackground = document.querySelector('.hero-bg-img')
      const backgroundImage = heroBackground ? getComputedStyle(heroBackground).backgroundImage : ''
      if (backgroundImage.startsWith('url(')) {
        const backgroundUrl = backgroundImage.slice(4, -1).replace(/^['"]|['"]$/g, '')
        const image = new Image()
        image.src = backgroundUrl
        images.push(image)
      }

      await Promise.all(images.map(image => {
        image.loading = 'eager'
        if (typeof image.decode === 'function') return image.decode().catch(() => {})
        if (image.complete) return Promise.resolve()
        return new Promise(resolve => {
          image.addEventListener('load', resolve, { once: true })
          image.addEventListener('error', resolve, { once: true })
        })
      }))
    }

    const maxWait = new Promise(resolve => { timeoutId = window.setTimeout(resolve, 12000) })
    Promise.race([Promise.all([browserLoaded, fontsLoaded, waitForImages()]), maxWait]).then(() => {
      window.clearTimeout(timeoutId)
      if (active) {
        setLoadProgress(100)
        revealTimeoutId = window.setTimeout(() => {
          if (active) setPageReady(true)
        }, 350)
      }
    })

    return () => {
      active = false
      window.clearTimeout(timeoutId)
      window.clearTimeout(revealTimeoutId)
    }
  }, [configLoaded])

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
  const zaloLink = config.zalo_link || `https://zalo.me/${(config.hotline || DEFAULT_CONFIG.hotline).replace(/\D/g, '')}`
  const messengerLink = config.messenger_link || DEFAULT_CONFIG.messenger_link

  return (
    <>
      {!pageReady && (
        <div className="page-loader" role="status" aria-live="polite">
          <span className="page-loader-spinner" aria-hidden="true" />
          <span className="page-loader-progress">{loadProgress}%</span>
        </div>
      )}
      <div className={`page-content${pageReady ? ' is-ready' : ''}`} aria-hidden={!pageReady}>
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
        zaloLink={zaloLink}
        fbLink={config.fb_link}
        messengerLink={messengerLink}
        onBookingOpen={() => setBookingOpen(true)}
      />

        <footer className="site-footer">
        <div className="wrap">
          <div className="foot-grid">
            <div className="foot-brand">
              {config.logo_url && <img src={config.logo_url} alt="Dí Tới logo" />}
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
        zaloLink={zaloLink}
        messengerLink={messengerLink}
      />

        {bookingOpen && (
        <BookingModal
          onClose={() => setBookingOpen(false)}
          hotline={config.hotline}
          branchName={config.branch_name}
          zaloLink={zaloLink}
          messengerLink={messengerLink}
        />
      )}

        {lightboxSrc && (
        <div className="lightbox-overlay" onClick={() => setLightboxSrc(null)}>
          <img src={lightboxSrc} alt="Phóng to" />
          <button className="lbx-close" onClick={() => setLightboxSrc(null)}>✕</button>
        </div>
        )}
      </div>
    </>
  )
}
