import { useState } from 'react'

const PLACEHOLDER_COVER = '/images/menu-cover.jpg'
const PLACEHOLDER_DRINKS = '/images/menu-drinks.jpg'

export default function MenuGallery({ coverUrl, drinksUrl }) {
  const [activeTab, setActiveTab] = useState('cover')
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const cover = coverUrl || PLACEHOLDER_COVER
  const drinks = drinksUrl || PLACEHOLDER_DRINKS
  const activeImage = activeTab === 'cover' ? cover : drinks
  const activeAlt = activeTab === 'cover'
    ? 'Tuyển tập mồi bén Dí Tới – bìa thực đơn'
    : 'Thực đơn đồ uống Dí Tới'

  return (
    <>
      <div className="section-divider"><span>THỰC ĐƠN DÍ TỚI</span></div>
      <div className="menu-gallery" style={{ position: 'relative', zIndex: 1 }}>
        <div className="menu-tabs">
          <button
            className={`menu-tab${activeTab === 'cover' ? ' active' : ''}`}
            onClick={() => setActiveTab('cover')}
          >
            Tuyển Tập
          </button>
          <button
            className={`menu-tab${activeTab === 'drinks' ? ' active' : ''}`}
            onClick={() => setActiveTab('drinks')}
          >
            Đồ Uống
          </button>
        </div>

        <div className="menu-image-wrap" onClick={() => setLightboxOpen(true)}>
          <img
            className="menu-image"
            src={activeImage}
            alt={activeAlt}
          />
          <span className="menu-zoom-hint">Bấm để phóng to</span>
        </div>
      </div>

      {lightboxOpen && (
        <div className="lightbox-overlay" onClick={() => setLightboxOpen(false)}>
          <img className="lightbox-img" src={activeImage} alt={activeAlt} />
          <button className="lightbox-close" onClick={() => setLightboxOpen(false)}>✕</button>
        </div>
      )}
    </>
  )
}
