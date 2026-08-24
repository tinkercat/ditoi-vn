import { useState } from 'react'
import { adminFetch } from '../api'

export default function MediaUploader({ label, accept, currentUrl, onUploaded }) {
  const [status, setStatus] = useState('')
  const [uploading, setUploading] = useState(false)

  async function handleChange(e) {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    setStatus('Đang tải lên...')

    try {
      // 1. Request a signed upload URL from the server
      const res = await adminFetch('/api/admin-upload-url', {
        method: 'POST',
        body: JSON.stringify({ filename: file.name, contentType: file.type }),
      })
      if (!res.ok) throw new Error('Không thể lấy URL tải lên')
      const { signedUrl, publicUrl } = await res.json()

      // 2. PUT file directly to Supabase Storage via signed URL
      const uploadRes = await fetch(signedUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      })
      if (!uploadRes.ok) throw new Error('Tải lên thất bại')

      setStatus(`✓ ${file.name}`)
      onUploaded(publicUrl)
    } catch (err) {
      setStatus(`✗ Lỗi: ${err.message}`)
    } finally {
      setUploading(false)
    }
  }

  const inputId = `upload-${label.replace(/\s+/g, '-').toLowerCase()}`

  return (
    <div className="admin-group">
      <label>{label}</label>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <label htmlFor={inputId} className="file-input-wrapper" style={{ flex: 1, margin: 0 }}>
          {uploading
            ? 'Đang tải lên...'
            : currentUrl
            ? '✓ Đã có file — Click để thay đổi'
            : 'Click để chọn file'}
        </label>
        {currentUrl && (
          <button
            type="button"
            onClick={() => { onUploaded(''); setStatus('') }}
            title="Xoá file này"
            style={{ padding: '6px 10px', background: 'none', border: '1px solid #c0392b', color: '#c0392b', borderRadius: 4, cursor: 'pointer', flexShrink: 0, fontSize: '0.85rem' }}
          >
            ✕
          </button>
        )}
      </div>
      <input
        type="file"
        id={inputId}
        accept={accept}
        style={{ display: 'none' }}
        onChange={handleChange}
        disabled={uploading}
      />
      {status && <div className="file-status">{status}</div>}
    </div>
  )
}
