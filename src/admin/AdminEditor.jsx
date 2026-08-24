import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { adminFetch } from './api'
import MediaUploader from './components/MediaUploader'

const EMPTY_CONFIG = {
  maps_link: '',
  menu_link: '',
  hotline: '',
  slogan: '',
  promo_fb: '',
  promo_tt: '',
  promo_checkin: '',
  promo_review: '',
  background_image_url: '',
  logo_url: '',
  brand_font_url: '',
  branch_name: '',
  menu_cover_url: '',
  menu_drinks_url: '',
}

export default function AdminEditor() {
  const [config, setConfig] = useState(EMPTY_CONFIG)
  const [loading, setLoading] = useState(true)
  const [saveState, setSaveState] = useState('idle') // idle | saving | saved | error
  const [error, setError] = useState('')

  useEffect(() => {
    adminFetch('/api/admin-config-get')
      .then(r => (r.ok ? r.json() : Promise.reject(`HTTP ${r.status}`)))
      .then(data => {
        setConfig(prev => ({ ...prev, ...data }))
        setLoading(false)
      })
      .catch(err => {
        setError(`Không thể tải cấu hình: ${err}`)
        setLoading(false)
      })
  }, [])

  function set(key) {
    return e => setConfig(prev => ({ ...prev, [key]: e.target.value }))
  }

  async function handleSave() {
    setSaveState('saving')
    setError('')
    const updates = Object.entries(config).map(([key, value]) => ({ key, value }))
    try {
      const res = await adminFetch('/api/admin-config-post', {
        method: 'POST',
        body: JSON.stringify(updates),
      })
      if (!res.ok) throw new Error(await res.text())
      setSaveState('saved')
      setTimeout(() => setSaveState('idle'), 3000)
    } catch (err) {
      setError(`Lỗi khi lưu: ${err.message}`)
      setSaveState('error')
    }
  }

  const saveBtnClass =
    `save-btn${saveState === 'saving' ? ' saving' : saveState === 'saved' ? ' saved' : saveState === 'error' ? ' error' : ''}`
  const saveBtnText =
    saveState === 'saving' ? 'ĐANG LƯU...' : saveState === 'saved' ? '✓ ĐÃ LƯU' : 'LƯU & ĐĂNG'

  return (
    <div className="admin-wrapper">
      <div className="admin-panel">
        <div className="admin-top-row">
          <div className="admin-title">Quản Trị Dí Tới</div>
          <button className="signout-btn" onClick={() => supabase.auth.signOut()}>
            Đăng xuất
          </button>
        </div>

        {loading && <div className="status-msg">Đang tải dữ liệu...</div>}
        {error && <div className="error-msg">{error}</div>}

        {!loading && (
          <>
            <div className="section-label">1. Links &amp; Liên hệ</div>

            <div className="admin-group">
              <label>Google Maps Link</label>
              <input type="url" value={config.maps_link} onChange={set('maps_link')} placeholder="https://maps.app.goo.gl/..." />
            </div>
            <div className="admin-group">
              <label>Hotline</label>
              <input type="text" value={config.hotline} onChange={set('hotline')} placeholder="0979838250" />
            </div>
            <div className="admin-group">
              <label>Link Menu</label>
              <input type="url" value={config.menu_link} onChange={set('menu_link')} placeholder="https://..." />
            </div>

            <div className="section-label">2. Nội dung</div>

            <div className="admin-group">
              <label>Slogan (khung đỏ)</label>
              <input type="text" value={config.slogan} onChange={set('slogan')} placeholder="ĐÃ 'DÍ' LÀ PHẢI 'TỚI'" />
            </div>

            <div className="section-label">3. Badge ưu đãi</div>

            <div className="admin-group">
              <label>Facebook</label>
              <input type="text" value={config.promo_fb} onChange={set('promo_fb')} placeholder="GIẢM 10%" />
            </div>
            <div className="admin-group">
              <label>TikTok</label>
              <input type="text" value={config.promo_tt} onChange={set('promo_tt')} placeholder="TẶNG 1 MÓN" />
            </div>
            <div className="admin-group">
              <label>Check-in</label>
              <input type="text" value={config.promo_checkin} onChange={set('promo_checkin')} placeholder="GIẢM 5%" />
            </div>
            <div className="admin-group">
              <label>Đánh giá Google</label>
              <input type="text" value={config.promo_review} onChange={set('promo_review')} placeholder="TẶNG NƯỚC" />
            </div>

            <div className="section-label">4. Media &amp; Thương hiệu</div>

            <MediaUploader
              label="Ảnh nền quán"
              accept="image/*"
              currentUrl={config.background_image_url}
              onUploaded={url => setConfig(prev => ({ ...prev, background_image_url: url }))}
            />
            <MediaUploader
              label="Logo (PNG nền trong suốt)"
              accept="image/png,image/webp"
              currentUrl={config.logo_url}
              onUploaded={url => setConfig(prev => ({ ...prev, logo_url: url }))}
            />
            <MediaUploader
              label="Font thương hiệu (.otf, .ttf)"
              accept=".otf,.ttf"
              currentUrl={config.brand_font_url}
              onUploaded={url => setConfig(prev => ({ ...prev, brand_font_url: url }))}
            />

            <div className="section-label">5. Đặt bàn &amp; Menu ảnh</div>

            <div className="admin-group">
              <label>Tên chi nhánh (hiển thị trong form đặt bàn)</label>
              <input
                type="text"
                value={config.branch_name}
                onChange={set('branch_name')}
                placeholder="1A Tam Đảo, P. Hoà Hưng, Q.10, HCM"
              />
            </div>
            <MediaUploader
              label="Ảnh menu – Tuyển Tập (bìa đỏ)"
              accept="image/*"
              currentUrl={config.menu_cover_url}
              onUploaded={url => setConfig(prev => ({ ...prev, menu_cover_url: url }))}
            />
            <MediaUploader
              label="Ảnh menu – Đồ Uống (bìa vàng)"
              accept="image/*"
              currentUrl={config.menu_drinks_url}
              onUploaded={url => setConfig(prev => ({ ...prev, menu_drinks_url: url }))}
            />

            <button
              className={saveBtnClass}
              onClick={handleSave}
              disabled={saveState === 'saving'}
            >
              {saveBtnText}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
