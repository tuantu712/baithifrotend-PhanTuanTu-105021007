import { ArrowRight } from 'lucide-react';

export default function HeroBanner() {
  return (
    <div className="hero-banner-wrapper">
      <div className="hero-banner-bg"></div>
      <div className="hero-banner-content">
        <span className="hero-subtitle">BỘ SƯU TẬP GỐM SỨ THỦ CÔNG</span>
        <h1 className="hero-title animate-fade-in-up">
          Nghệ thuật Thổi Hồn <br />
          vào Đất Sét
        </h1>
        <p className="hero-description animate-fade-in-up-delay">
          Khám phá những món đồ trang trí làm bằng tay tinh xảo, mang nét mộc mạc hoài cổ, 
          tạo điểm nhấn bình dị và sang trọng cho không gian sống của bạn.
        </p>
        <div className="hero-actions-wrapper animate-fade-in-up-delay-2">
          <a href="#shop-grid" className="btn-primary hero-btn">
            Mua sắm ngay <ArrowRight size={16} className="inline-block ml-2" />
          </a>
          <a href="#about" className="btn-secondary hero-btn-secondary">
            Tìm hiểu thêm
          </a>
        </div>
      </div>
    </div>
  );
}
