import { BrandIcon } from './BrandIcon'

export default function FloatingButtons({ hotline, zaloLink, messengerLink }) {
  return (
    <div className="floaters">
      <a className="floater phone" href={`tel:${(hotline||'').replace(/\D/g,'')}`} aria-label="Gọi điện" title="Gọi điện">
        <span className="tip">Gọi ngay</span>📞
      </a>
      <a className="floater zalo" href={zaloLink} target="_blank" rel="noopener noreferrer" aria-label="Zalo" title="Zalo">
        <span className="tip">Nhắn Zalo</span><BrandIcon name="zalo" />
      </a>
      <a className="floater messenger" href={messengerLink} target="_blank" rel="noopener noreferrer" aria-label="Messenger" title="Messenger">
        <span className="tip">Nhắn Messenger</span><BrandIcon name="messenger" />
      </a>
    </div>
  )
}
