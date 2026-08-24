export default function OffersSection({ parkingImageUrl, onLightbox }) {
  return (
    <section className="offers-section section-shell" id="uu-dai">
      <div className="wrap">
        <div className="section-head">
          <div className="eyebrow" style={{ color: 'var(--gold)' }}>Ưu đãi &amp; sự kiện</div>
          <h2 style={{ color: 'var(--cream)' }}>Tới là vui – Dí là đã</h2>
          <p>Ghé Dí Tới đúng khung giờ, đúng ngày là có quà — không cần hỏi, cứ tới là biết.</p>
        </div>
        <div className="offer-grid">
          <div className="offer">
            <div className="num">01 · Mỗi ngày</div>
            <h3>Giờ mở cửa</h3>
            <p>Quán mở cửa từ 4h chiều đến 2h sáng, từ Thứ 2 đến Chủ Nhật.</p>
          </div>
          <div className="offer">
            <div className="num">02 · Đặt trước</div>
            <h3>Sinh nhật đặt trước</h3>
            <ul>
              <li>Miễn phí decor</li>
              <li>Giảm 10% Mồi Bén</li>
              <li>Có hoạt náo, quà tặng bí mật</li>
              <li>Tặng bánh kem</li>
            </ul>
          </div>
          <div className="offer">
            <div className="num">03 · Thứ 2 – Thứ 4</div>
            <h3>Dí sớm dễ sớm</h3>
            <p>Áp dụng cho khách đặt bàn và đến trong khung giờ 4h – 6h30 chiều. Giảm ngay 5% Mồi Bén.</p>
          </div>
          <div className="offer">
            <div className="num">04 · Thứ 6 hàng tuần</div>
            <h3>Bạn Dí Tôi Uống</h3>
            <p>Thử thách cùng nhân viên Dí Tới — uống nhanh hơn nhân viên, quán tặng ngay 1 đĩa Mồi Bén.</p>
          </div>
          <div className="offer">
            <div className="num">05 · Cuối tuần</div>
            <h3>Cuối tuần quẩy tới</h3>
            <p>Có show Dragqueen — chị đẹp quẩy Tới cùng anh em vào mỗi cuối tuần.</p>
          </div>
          <div className="offer">
            <div className="num">06 · Không giới hạn</div>
            <h3>Tháp bia tươi Budweiser</h3>
            <p>Chia sẻ cùng cả bàn với tháp bia tươi 3L, chỉ 299K — càng đông càng dí sâu.</p>
          </div>
          <div className="offer offer-img">
            {parkingImageUrl
              ? <img src={parkingImageUrl} alt="Dí Tới gửi xe miễn phí" onClick={() => onLightbox(parkingImageUrl)} />
              : null
            }
            <div className="offer-img-body">
              <div className="num">07 · An tâm nhậu</div>
              <h3>Gửi xe miễn phí</h3>
              <p>Bãi giữ xe máy &amp; ô tô ngay cạnh quán. Không lo chỗ đậu, cứ tới là có chỗ.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
