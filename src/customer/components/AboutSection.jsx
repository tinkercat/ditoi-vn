export default function AboutSection({ hotline, address, openingHours }) {
  return (
    <section className="about-section section-shell" id="gioi-thieu">
      <div className="wrap about-grid">
        <div className="about-copy">
          <div className="eyebrow">Quán Dí Tới</div>
          <h2 style={{ fontSize: 'clamp(30px,4vw,44px)', marginTop: 14 }}>
            Nhậu chất, mồi ngon,<br />đúng gu Sài Gòn
          </h2>
          <p>Dí Tới là quán nhậu vỉa hè giữa lòng Sài Gòn — nơi anh em vỗ vai nhau "dí tới đi" trước khi cạn ly. Mồi ở đây làm nóng hổi từng phần, từ gỏi bò bóp thấu, tôm tê tái kiểu Thái đến lẩu tomyum bốc khói giữa bàn nhậu.</p>
          <p>Không gian mang chất hoài cổ Sài Gòn 198X, bàn ghế vỉa hè, đèn dây giăng ngang, ly bia lạnh tay cầm — kiểu ngồi mà quên giờ về.</p>
          <div className="stamp-row">
            <div className="stamp">Mồi tươi mỗi ngày</div>
            <div className="stamp">Bia luôn lạnh sâu</div>
            <div className="stamp">Sinh nhật có náo</div>
          </div>
        </div>
        <div className="about-card">
          <ul className="about-list">
            <li><span className="ic">⏰</span><div><strong>Giờ mở cửa</strong><span>{openingHours || '4h chiều – 2h sáng · Thứ 2 – Chủ Nhật'}</span></div></li>
            <li><span className="ic">📍</span><div><strong>Địa chỉ</strong><span>{address || '195 Hoàng Sa, P. Tân Định, Quận 1, TP.HCM'}</span></div></li>
            <li><span className="ic">📞</span><div><strong>Hotline</strong><span>{hotline || '0979 838 250'}</span></div></li>
            <li><span className="ic">🍺</span><div><strong>Tháp bia tươi</strong><span>Budweiser 3L – giá chỉ 299K</span></div></li>
          </ul>
        </div>
      </div>
    </section>
  )
}
