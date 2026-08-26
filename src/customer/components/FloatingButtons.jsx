import { useState } from 'react'
import { BrandIcon } from './BrandIcon'

function isMobile() {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
}

export default function FloatingButtons({ hotline, zaloLink, messengerLink }) {
  const [comingSoon, setComingSoon] = useState(false)

  function handleZalo() {
    if (isMobile()) window.open(zaloLink || `https://zalo.me/${(hotline||'').replace(/\D/g,'')}`, '_blank', 'noopener,noreferrer')
    else setComingSoon(true)
  }

  function handleMessenger() {
    if (isMobile()) window.open(messengerLink || '#', '_blank', 'noopener,noreferrer')
    else setComingSoon(true)
  }

  return (
    <>
      <div className="floaters">
        <a className="floater phone" href={`tel:${(hotline||'').replace(/\D/g,'')}`} aria-label="Gọi điện" title="Gọi điện">
          <span className="tip">Gọi ngay</span>📞
        </a>
        <button className="floater zalo" onClick={handleZalo} aria-label="Zalo" title="Zalo">
          <span className="tip">Nhắn Zalo</span><BrandIcon name="zalo" />
        </button>
        <button className="floater messenger" onClick={handleMessenger} aria-label="Messenger" title="Messenger">
          <span className="tip">Nhắn Messenger</span><BrandIcon name="messenger" />
        </button>
      </div>

      {comingSoon && (
        <div className="coming-soon-overlay" onClick={() => setComingSoon(false)}>
          <div className="coming-soon-box" onClick={e => e.stopPropagation()}>
            <h3>SẮP RA MẮT</h3>
            <p>Tính năng chat trực tiếp đang được phát triển.<br />Vui lòng gọi hotline hoặc quét mã QR để nhắn Zalo nhé! 🍺</p>
            <button onClick={() => setComingSoon(false)}>ĐÓNG</button>
          </div>
        </div>
      )}
    </>
  )
}
