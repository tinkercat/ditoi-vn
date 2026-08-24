import { useState } from 'react'

const TABS = [
  { id: 0, label: 'Tất Cả',             grid: true },
  { id: 1, label: 'Tuyển Tập',          key: 'menu_tab_1' },
  { id: 2, label: 'Đồ Uống',            key: 'menu_tab_2' },
  { id: 3, label: 'Khai Vị & Salad',    key: 'menu_tab_3' },
  { id: 4, label: 'Chiên & Rang',       key: 'menu_tab_4' },
  { id: 5, label: 'Xào & Hấp',         key: 'menu_tab_5' },
  { id: 6, label: 'Xanh & Nướng',      key: 'menu_tab_6' },
  { id: 7, label: 'Lẩu & Soup',        key: 'menu_tab_7' },
  { id: 8, label: 'Dí Luôn Không Về',  key: 'menu_tab_8' },
  { id: 9, label: 'Dí Mồi',            key: 'menu_tab_9' },
  { id: 10, label: 'Dí Tới Bến',       key: 'menu_tab_10' },
]

const DISHES = [
  { price: '119K', name: 'Bò Bóp Thấu',         desc: 'Vietnamese Rare Beef Salad – gỏi bò tái trộn chua cay, đậu phộng rang.',       tag: 'Mồi Gỏi & Salad' },
  { price: '169K', name: 'Tôm Tê Tái',           desc: 'Thai-Style Shrimp – tôm sống trộn kiểu Thái, cay tê đầu lưỡi.',                tag: 'Mồi Gỏi & Salad' },
  { price: '219K', name: 'Cá Hồng Chiên Mắm Xoài', desc: 'Crispy Red Snapper – cá chiên giòn, rưới mắm xoài xanh chua ngọt.',          tag: 'Mồi Chiên & Rang' },
  { price: '169K', name: 'Bò Lúc Lắc',           desc: 'Shaking Beef – bò Úc áp chảo lăn bơ tỏi, ăn kèm bánh mì.',                   tag: 'Mồi Xào & Hấp' },
  { price: '189K', name: 'Sườn Nướng BBQ',        desc: 'BBQ Grilled Pork Ribs – sườn ướp sốt nhà làm, nướng than hoa.',               tag: 'Mồi Nướng' },
  { price: '359K', name: 'Lẩu TomYum',            desc: 'TomYum Hotpot – hải sản tươi, nước lẩu chua cay chuẩn Thái.',               tag: 'Lẩu · Soup' },
  { price: '99K',  name: 'Chân Gà Tê Cay',        desc: 'Numbing-Spicy Chicken Feet – món nhâm nhi tê cay gây nghiện.',                tag: 'Mồi Xào & Hấp' },
  { price: '39K/con', name: 'Hàu Nướng Phô Mai',  desc: 'Grilled Oysters with Cheese – hàu tươi nướng phô mai béo ngậy.',             tag: 'Mồi Nướng' },
]

export default function MenuSection({ menuImages, onLightbox }) {
  const [active, setActive] = useState(0)

  const gridItems = TABS.filter(t => t.key).map(t => ({ ...t, src: menuImages[t.key] }))

  return (
    <section className="menu-section section-shell" id="thuc-don">
      <div className="wrap">
        <div className="section-head">
          <div className="eyebrow">Thực đơn</div>
          <h2>Mồi là phải bén</h2>
          <p>Trọn bộ menu Dí Tới — từ bìa tuyển tập, đồ uống, đến từng nhóm mồi. Bấm tab để xem, bấm ảnh để phóng to.</p>
        </div>

        <div className="tabbar">
          {TABS.map(t => (
            <button key={t.id} className={`tab-btn${active === t.id ? ' active' : ''}`} onClick={() => setActive(t.id)}>
              {t.label}
            </button>
          ))}
        </div>

        <div className="menu-stage">
          {/* Tab 0 – grid of all */}
          <div className={`menu-grid-wrap${active === 0 ? ' active' : ''}`}>
            {gridItems.map(t => (
              <figure key={t.id} onClick={() => t.src && onLightbox(t.src)}>
                {t.src
                  ? <img src={t.src} alt={`Thực đơn ${t.label} Dí Tới`} />
                  : <div className="menu-panel-empty">{t.label}</div>
                }
                <figcaption>{t.label}</figcaption>
              </figure>
            ))}
          </div>

          {/* Tabs 1-10 – single image */}
          {TABS.filter(t => t.key).map(t => {
            const src = menuImages[t.key]
            return (
              <div key={t.id} className={`menu-panel${active === t.id ? ' active' : ''}`} onClick={() => src && onLightbox(src)}>
                {src
                  ? <><img src={src} alt={`Thực đơn ${t.label} Dí Tới`} /><span className="zoom-hint">Bấm để phóng to</span></>
                  : <div className="menu-panel-empty">Chưa có ảnh · {t.label}</div>
                }
              </div>
            )
          })}
        </div>
        <p className="menu-note">Giá bán chưa bao gồm thuế VAT (10%) · Thực đơn có thể thay đổi theo mùa</p>

        <div className="signature-wrap">
          <div className="section-head" style={{ marginBottom: 34 }}>
            <div className="eyebrow">Best seller</div>
            <h2 style={{ fontSize: 'clamp(28px,4vw,38px)' }}>Mồi signature của Dí Tới</h2>
          </div>
          <div className="signature-grid">
            {DISHES.map((d, i) => (
              <div className="dish" key={i}>
                <span className="price">{d.price}</span>
                <h4>{d.name}</h4>
                <p>{d.desc}</p>
                <span className="tag">{d.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
