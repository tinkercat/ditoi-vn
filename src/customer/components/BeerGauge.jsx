import { useEffect, useRef, useState } from 'react'

export default function BeerGauge() {
  const fillRef = useRef(null)
  const pctRef = useRef(null)
  const [show, setShow] = useState(false)

  useEffect(() => {
    function onScroll() {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const pct = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100))
      if (fillRef.current) fillRef.current.style.height = pct + '%'
      if (pctRef.current) pctRef.current.textContent = Math.round(pct) + '%'
      setShow(scrollTop > 200)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className={`gauge${show ? ' show' : ''}`} aria-hidden="true">
      <div className="gauge-label">DÍ</div>
      <div className="gauge-glass">
        <div className="gauge-fill" ref={fillRef} />
      </div>
      <div className="gauge-label">TỚI</div>
      <div className="gauge-pct" ref={pctRef}>0%</div>
    </div>
  )
}
