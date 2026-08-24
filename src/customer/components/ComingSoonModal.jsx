export default function ComingSoonModal({ onClose }) {
  return (
    <div className="coming-soon-overlay" onClick={onClose}>
      <div className="coming-soon-box" onClick={e => e.stopPropagation()}>
        <h3>SẮP RA MẮT</h3>
        <p>Tính năng này đang được phát triển.<br />Vui lòng thử lại sau nhé! 🍺</p>
        <button onClick={onClose}>ĐÓNG</button>
      </div>
    </div>
  )
}
