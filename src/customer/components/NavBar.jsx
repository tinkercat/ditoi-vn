import { useState } from 'react'

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

export default function NavBar({ logoUrl, onBookingOpen }) {
  const [open, setOpen] = useState(false)

  const links = [
    { label: 'Trang chủ', path: '/', id: 'trang-chu' },
    { label: 'Thực đơn', path: '/thuc-don', id: 'thuc-don' },
    { label: 'Không gian Dí Tới', path: '/khong-gian', id: 'khong-gian' },
    { label: 'Đặt bàn', path: '/dat-ban', id: 'dat-ban' },
    { label: 'Sinh nhật & Tiệc nhóm', path: '/sinh-nhat', id: 'sinh-nhat' },
    { label: 'Ưu đãi', path: '/uu-dai', id: 'uu-dai' },
    { label: 'Liên hệ / Địa chỉ', path: '/lien-he', id: 'lien-he' },
  ]

  function nav(path, id) {
    if (`${window.location.pathname}${window.location.hash}` !== path) {
      window.history.pushState({}, '', path)
    }
    scrollTo(id)
    setOpen(false)
  }

  return (
    <header className="navbar">
      <div className="nav-inner">
        <a href="/" className="nav-brand" onClick={e => { e.preventDefault(); nav('/', 'trang-chu') }}>
          {logoUrl
            ? <img src={logoUrl} alt="Dí Tới logo" />
            : <span className="nav-brand-text">DÍ <span>TỚI</span></span>
          }
        </a>
        <ul className="nav-links">
          {links.map(link => (
            <li key={link.path}>
              <a href={link.path} onClick={e => { e.preventDefault(); nav(link.path, link.id) }}>{link.label}</a>
            </li>
          ))}
        </ul>
        <div className="nav-right">
          <button className="btn btn-primary" onClick={onBookingOpen}>Đặt Bàn</button>
          <button className="nav-hamb" onClick={() => setOpen(o => !o)} aria-label="Menu">☰</button>
        </div>
      </div>
      <nav className={`mobile-menu${open ? ' open' : ''}`}>
        {links.map(link => (
          <a key={link.path} href={link.path} onClick={e => { e.preventDefault(); nav(link.path, link.id) }}>
            {link.label}
          </a>
        ))}
        <button className="btn btn-primary" onClick={() => { onBookingOpen(); setOpen(false) }}>Đặt Bàn Ngay</button>
      </nav>
    </header>
  )
}
