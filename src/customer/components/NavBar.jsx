import { useState } from 'react'

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

export default function NavBar({ logoUrl, onBookingOpen }) {
  const [open, setOpen] = useState(false)

  function nav(id) {
    scrollTo(id)
    setOpen(false)
  }

  return (
    <header className="navbar">
      <div className="nav-inner">
        <a href="#trang-chu" className="nav-brand" onClick={e => { e.preventDefault(); nav('trang-chu') }}>
          {logoUrl
            ? <img src={logoUrl} alt="Dí Tới logo" />
            : <span className="nav-brand-text">DÍ <span>TỚI</span></span>
          }
        </a>
        <ul className="nav-links">
          <li><a href="#thuc-don"   onClick={e => { e.preventDefault(); nav('thuc-don') }}>Thực Đơn</a></li>
          <li><a href="#gioi-thieu" onClick={e => { e.preventDefault(); nav('gioi-thieu') }}>Quán Dí Tới</a></li>
          <li><a href="#uu-dai"     onClick={e => { e.preventDefault(); nav('uu-dai') }}>Ưu Đãi</a></li>
          <li><a href="#danh-gia"   onClick={e => { e.preventDefault(); nav('danh-gia') }}>Đánh Giá</a></li>
          <li><a href="#lien-he"    onClick={e => { e.preventDefault(); nav('lien-he') }}>Liên Hệ</a></li>
        </ul>
        <div className="nav-right">
          <button className="btn btn-primary" onClick={onBookingOpen}>Đặt Bàn</button>
          <button className="nav-hamb" onClick={() => setOpen(o => !o)} aria-label="Menu">☰</button>
        </div>
      </div>
      <nav className={`mobile-menu${open ? ' open' : ''}`}>
        <a href="#thuc-don"   onClick={e => { e.preventDefault(); nav('thuc-don') }}>Thực Đơn</a>
        <a href="#gioi-thieu" onClick={e => { e.preventDefault(); nav('gioi-thieu') }}>Quán Dí Tới</a>
        <a href="#uu-dai"     onClick={e => { e.preventDefault(); nav('uu-dai') }}>Ưu Đãi</a>
        <a href="#danh-gia"   onClick={e => { e.preventDefault(); nav('danh-gia') }}>Đánh Giá</a>
        <a href="#lien-he"    onClick={e => { e.preventDefault(); nav('lien-he') }}>Liên Hệ</a>
        <button className="btn btn-primary" onClick={() => { onBookingOpen(); setOpen(false) }}>Đặt Bàn Ngay</button>
      </nav>
    </header>
  )
}
