import { useState } from 'react'

export default function AiSection() {
  const [modalOpen, setModalOpen] = useState(false)
  const [modalHeader, setModalHeader] = useState('')
  const [modalText, setModalText] = useState('')

  async function askGemini(mode) {
    setModalOpen(true)
    setModalHeader('ĐANG HỎI AI...')
    setModalText('Chờ quán lên mồi tí...')

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode }),
      })
      const data = await res.json()
      setModalHeader(mode === 'recommend' ? 'MỒI BÉN ĐỀ XUẤT' : 'KHẨU HIỆU DÔ!')
      setModalText(data.text || 'Lỗi rồi, dứt ly khác đi!')
    } catch {
      setModalText('Mạng lag rồi, anh em cứ dập trước đi!')
    }
  }

  return (
    <>
      <div className="section-divider"><span>TRẢI NGHIỆM AI</span></div>
      <div className="links-container">
        <button onClick={() => askGemini('recommend')} className="action-btn ai-btn">
          🍖 TƯ VẤN MỒI NGON
        </button>
        <button onClick={() => askGemini('slogan')} className="action-btn ai-btn">
          📣 HÔ KHẨU HIỆU NHẬU
        </button>
      </div>

      {modalOpen && (
        <div id="ai-modal">
          <div className="modal-content">
            <div className="modal-header">{modalHeader}</div>
            <div className="modal-body">{modalText}</div>
            <button onClick={() => setModalOpen(false)} className="modal-close">
              XONG RỒI – DÔ! 🍺
            </button>
          </div>
        </div>
      )}
    </>
  )
}
