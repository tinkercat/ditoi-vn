import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { adminFetch } from './api'
import MediaUploader from './components/MediaUploader'

const EMPTY_CONFIG = {
  maps_link: '',
  maps_embed_url: '',
  menu_link: '',
  hotline: '',
  address: '',
  opening_hours: '',
  slogan: '',
  zalo_link: '',
  fb_link: '',
  messenger_link: '',
  branch_name: '',
  promo_fb: '',
  promo_tt: '',
  promo_checkin: '',
  promo_review: '',
  background_image_url: '',
  logo_url: '',
  brand_font_url: '',
  parking_image_url: '',
  menu_tab_1: '', menu_tab_2: '', menu_tab_3: '', menu_tab_4: '', menu_tab_5: '',
  menu_tab_6: '', menu_tab_7: '', menu_tab_8: '', menu_tab_9: '', menu_tab_10: '',
  hero_slide_1: '', hero_slide_2: '', hero_slide_3: '',
  hero_slide_4: '', hero_slide_5: '', hero_slide_6: '',
  review_photo_1: '', review_photo_2: '', review_photo_3: '',
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
              <label>Google Maps Embed URL (lấy từ Google Maps → Chia sẻ → Nhúng bản đồ)</label>
              <input type="url" value={config.maps_embed_url} onChange={set('maps_embed_url')} placeholder="https://www.google.com/maps/embed?pb=..." />
            </div>
            <div className="admin-group">
              <label>Hotline</label>
              <input type="text" value={config.hotline} onChange={set('hotline')} placeholder="0979838250" />
            </div>
            <div className="admin-group">
              <label>Địa chỉ</label>
              <input type="text" value={config.address} onChange={set('address')} placeholder="195 Hoàng Sa, P. Tân Định, Quận 1, TP.HCM" />
            </div>
            <div className="admin-group">
              <label>Giờ mở cửa</label>
              <input type="text" value={config.opening_hours} onChange={set('opening_hours')} placeholder="4h chiều – 2h sáng · Thứ 2 – Chủ Nhật" />
            </div>
            <div className="admin-group">
              <label>Link Menu</label>
              <input type="url" value={config.menu_link} onChange={set('menu_link')} placeholder="https://..." />
            </div>
            <div className="admin-group">
              <label>Zalo Link</label>
              <input type="url" value={config.zalo_link} onChange={set('zalo_link')} placeholder="https://zalo.me/..." />
            </div>
            <div className="admin-group">
              <label>Facebook Page Link</label>
              <input type="url" value={config.fb_link} onChange={set('fb_link')} placeholder="https://facebook.com/..." />
            </div>
            <div className="admin-group">
              <label>Messenger Link</label>
              <input type="url" value={config.messenger_link} onChange={set('messenger_link')} placeholder="https://m.me/..." />
            </div>

            <div className="section-label">2. Đặt bàn</div>

            <div className="admin-group">
              <label>Tên chi nhánh (hiển thị trong form đặt bàn)</label>
              <input type="text" value={config.branch_name} onChange={set('branch_name')} placeholder="Dí Tới – 195 Hoàng Sa, Q.1" />
            </div>

            <div className="section-label">3. Media &amp; Thương hiệu</div>

            <MediaUploader label="Ảnh nền quán (hero background)" accept="image/*" currentUrl={config.background_image_url} onUploaded={url => setConfig(prev => ({ ...prev, background_image_url: url }))} />
            <MediaUploader label="Logo (PNG nền trong suốt)" accept="image/png,image/webp" currentUrl={config.logo_url} onUploaded={url => setConfig(prev => ({ ...prev, logo_url: url }))} />
            <MediaUploader label="Font thương hiệu (.otf, .ttf)" accept=".otf,.ttf" currentUrl={config.brand_font_url} onUploaded={url => setConfig(prev => ({ ...prev, brand_font_url: url }))} />

            <div className="section-label">4. Hero Slider (ảnh cuộn tự động)</div>
            {[1,2,3,4,5,6].map(n => (
              <MediaUploader key={n} label={`Ảnh slider ${n}`} accept="image/*" currentUrl={config[`hero_slide_${n}`]} onUploaded={url => setConfig(prev => ({ ...prev, [`hero_slide_${n}`]: url }))} />
            ))}

            <div className="section-label">5. Thực đơn – ảnh từng tab</div>
            {[
              [1,'Tuyển Tập'],[2,'Đồ Uống'],[3,'Khai Vị & Salad'],
              [4,'Chiên & Rang'],[5,'Xào & Hấp'],[6,'Xanh & Nướng'],
              [7,'Lẩu & Soup'],[8,'Dí Luôn Không Về'],[9,'Dí Mồi'],[10,'Dí Tới Bến'],
            ].map(([n, label]) => (
              <MediaUploader key={n} label={`Tab ${n}: ${label}`} accept="image/*" currentUrl={config[`menu_tab_${n}`]} onUploaded={url => setConfig(prev => ({ ...prev, [`menu_tab_${n}`]: url }))} />
            ))}

            <div className="section-label">6. Ảnh đánh giá &amp; ưu đãi</div>
            <MediaUploader label="Ảnh khách hàng 1 (mục Đánh Giá)" accept="image/*" currentUrl={config.review_photo_1} onUploaded={url => setConfig(prev => ({ ...prev, review_photo_1: url }))} />
            <MediaUploader label="Ảnh khách hàng 2" accept="image/*" currentUrl={config.review_photo_2} onUploaded={url => setConfig(prev => ({ ...prev, review_photo_2: url }))} />
            <MediaUploader label="Ảnh khách hàng 3" accept="image/*" currentUrl={config.review_photo_3} onUploaded={url => setConfig(prev => ({ ...prev, review_photo_3: url }))} />
            <MediaUploader label="Ảnh bãi xe miễn phí (mục Ưu Đãi)" accept="image/*" currentUrl={config.parking_image_url} onUploaded={url => setConfig(prev => ({ ...prev, parking_image_url: url }))} />

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
