import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProducts, useCategories } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

export default function HomePage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const { products, loading } = useProducts({ limit: 10 }); // Tải các sản phẩm bán chạy
  const { categories } = useCategories();

  // Dữ liệu cho 3 slides chuẩn Learts
  const slides = [
    {
      title: 'Handicraft Shop',
      subtitle: 'Just for you',
      desc: 'Khám phá bộ sưu tập gốm sứ mộc mạc và đồ trang trí thủ công độc bản được chế tác riêng cho bạn.',
      bgImage: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?q=80&w=1200&auto=format&fit=crop',
      iconImg: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=120&auto=format&fit=crop',
      link: '/shop',
    },
    {
      title: 'Newly arrived',
      subtitle: 'Sale up to 10% off',
      desc: 'Bộ sưu tập bát đĩa và đèn trang trí men mờ mới nhất vừa cập bến. Giảm giá 10% tuần lễ ra mắt.',
      bgImage: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=1200&auto=format&fit=crop',
      iconImg: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=120&auto=format&fit=crop',
      link: '/shop',
    },
    {
      title: 'Affectious gifts',
      subtitle: 'For friends & family',
      desc: 'Quà tặng ý nghĩa cho những người thân yêu từ chất liệu đất nung tự nhiên đượm nồng hương vị quê hương.',
      bgImage: 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?q=80&w=1200&auto=format&fit=crop',
      iconImg: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=120&auto=format&fit=crop',
      link: '/shop',
    },
  ];

  // Tự động chuyển slide sau mỗi 5s
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handlePrevSlide = () => {
    setActiveSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % slides.length);
  };

  // Lấy ảnh đại diện cho các category banner
  const getCategoryBg = (name: string) => {
    if (name === 'Decor') return 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?q=80&w=400&auto=format&fit=crop';
    if (name === 'Furniture') return 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=400&auto=format&fit=crop';
    if (name === 'Lighting') return 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=400&auto=format&fit=crop';
    return 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=400&auto=format&fit=crop';
  };

  return (
    <div className="homepage-wrapper">
      {/* 1. SLIDER SECTION (Cấu trúc chuẩn Learts Slider) */}
      <div className="home-slider-container">
        {slides.map((slide, idx) => (
          <div
            key={idx}
            className={`home-slide-item ${activeSlide === idx ? 'active' : ''}`}
            style={{ backgroundImage: `url(${slide.bgImage})` }}
          >
            <div className="slide-overlay-blur"></div>
            <div className="slide-border-frame"></div>
            <div className="slide-content-box animate-fade-in-up">
              {slide.iconImg && (
                <div className="slide-icon-circle">
                  <img src={slide.iconImg} alt="Slide Icon" />
                </div>
              )}
              <span className="slide-subtitle">{slide.subtitle}</span>
              <h2 className="slide-title">{slide.title}</h2>
              <p className="slide-desc">{slide.desc}</p>
              <div className="slide-link-wrapper">
                <Link to={slide.link} className="slide-shop-link">
                  shop now
                </Link>
              </div>
            </div>
          </div>
        ))}
        {/* Điều khiển Slider */}
        <button className="slider-control-btn prev" onClick={handlePrevSlide} aria-label="Previous Slide">
          <ChevronLeft size={20} />
        </button>
        <button className="slider-control-btn next" onClick={handleNextSlide} aria-label="Next Slide">
          <ChevronRight size={20} />
        </button>
        {/* Slide Dots */}
        <div className="slider-dots">
          {slides.map((_, idx) => (
            <button
              key={idx}
              className={`slider-dot ${activeSlide === idx ? 'active' : ''}`}
              onClick={() => setActiveSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
            ></button>
          ))}
        </div>
      </div>

      {/* 2. SALE BANNER SECTION (Khuyến mãi) */}
      <section className="sale-banners-section container">
        <div className="section-title-premium text-center">
          <span className="subtitle-gold">Just for you</span>
          <h2 className="title-serif">Making & crafting</h2>
          <div className="title-divider-both"></div>
        </div>

        <div className="sale-banners-grid">
          {/* Banner 1: Spring Sale */}
          <div
            className="promo-banner-card banner-spring"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=600&auto=format&fit=crop')` }}
          >
            <div className="banner-inner-content">
              <span className="promo-tag">Spring sale</span>
              <h3 className="promo-discount-title">
                <span className="discount-num">40</span>% <br /> off
              </h3>
              <Link to="/shop" className="promo-action-link">
                shop now
              </Link>
            </div>
          </div>

          {/* Banner 2: Next Purchase */}
          <div className="promo-banner-card banner-next-purchase">
            <div className="purchase-content-row">
              <div className="purchase-text-left">
                <h3 className="purchase-percent-title">10% off</h3>
                <span className="purchase-subtext">YOUR NEXT PURCHASE</span>
              </div>
              <div className="purchase-btn-right">
                <Link to="/shop" className="btn-primary">
                  SHOP NOW
                </Link>
              </div>
            </div>
            <div className="purchase-card-image-box">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=500&auto=format&fit=crop"
                alt="Next purchase item"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. CATEGORY BANNERS SECTION (Danh mục) */}
      <section className="category-banners-section container">
        <div className="category-banners-grid">
          {categories.map((cat) => (
            <div key={cat._id} className="cat-banner-card">
              <Link to={`/shop?categoryId=${cat._id}`} className="cat-img-link">
                <img src={getCategoryBg(cat.name)} alt={cat.name} className="cat-banner-img" />
              </Link>
              <div className="cat-banner-caption">
                <h3 className="cat-banner-title">
                  <Link to={`/shop?categoryId=${cat._id}`}>{cat.name}</Link>
                  <span className="cat-badge-count">16</span>
                </h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. BEST-SELLERS PRODUCTS GRID (Sản phẩm) */}
      <section className="best-sellers-section container">
        <div className="section-title-premium text-center">
          <span className="subtitle-gold">Shop now</span>
          <h2 className="title-serif">Shop our best-sellers</h2>
          <div className="title-divider-both"></div>
        </div>

        {loading ? (
          <div className="products-grid">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className="skeleton-card animate-pulse">
                <div className="skeleton-image"></div>
                <div className="skeleton-text-short"></div>
                <div className="skeleton-text-long"></div>
                <div className="skeleton-row">
                  <div className="skeleton-text-price"></div>
                  <div className="skeleton-button"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="products-grid">
              {products.slice(0, 10).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
            <div className="view-all-wrapper text-center mt-12">
              <Link to="/shop" className="btn-secondary view-all-btn">
                Xem tất cả sản phẩm <ArrowRight size={14} className="inline ml-1" />
              </Link>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
