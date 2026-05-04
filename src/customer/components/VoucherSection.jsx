export default function VoucherSection() {
  return (
    <section className="voucher-box">
      <div className="voucher-title">🎁 VOUCHER KHAI TRƯƠNG</div>
      <code className="voucher-code">DITOI27</code>
      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.75rem',
          fontStyle: 'italic',
          opacity: 0.7,
          marginTop: '10px',
        }}
      >
        Vui lòng xuất trình trước khi thanh toán
      </p>
    </section>
  )
}
