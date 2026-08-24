export default function ComingSoonModal({ onClose }) {
  return (
    <div id="ai-modal" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">SẮP RA MẮT</div>
        <div className="modal-body" style={{ textAlign: 'center', padding: '10px 0' }}>
          Tính năng này đang được phát triển.<br />Vui lòng thử lại sau nhé! 🍺
        </div>
        <button onClick={onClose} className="modal-close">ĐÓNG</button>
      </div>
    </div>
  )
}
