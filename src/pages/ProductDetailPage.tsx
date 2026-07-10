import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProductDetail } from '../hooks/useProducts';
import { useCartStore } from '../store/cartStore';
import { Minus, Plus, ShoppingBag, ArrowLeft, Loader2, Heart, Award, ShieldCheck, Truck } from 'lucide-react';
import PageHeader from '../components/PageHeader';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { product, loading, error } = useProductDetail(id);
  const { addToCart, items } = useCartStore();

  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState<string>('');

  // Lấy số lượng sản phẩm này đã có trong giỏ hàng
  const cartItem = items.find((item) => item.product._id === id);
  const qtyInCart = cartItem ? cartItem.quantity : 0;
  const remainingStock = product ? product.stock - qtyInCart : 0;

  useEffect(() => {
    if (product) {
      setActiveImage(product.image || product.imageUrl || 'https://via.placeholder.com/600x700?text=Learts+Ceramics');
      setQuantity(product.stock > 0 ? 1 : 0);
    }
  }, [product]);

  const handleIncrement = () => {
    if (!product) return;
    if (quantity + qtyInCart >= product.stock) {
      alert(`Bạn không thể thêm nhiều hơn! Số lượng tồn kho là ${product.stock}, và bạn đang có ${qtyInCart} trong giỏ hàng.`);
      return;
    }
    setQuantity((prev) => prev + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!product) return;
    const value = parseInt(e.target.value, 10);
    if (isNaN(value) || value < 1) {
      setQuantity(1);
    } else if (value + qtyInCart > product.stock) {
      alert(`Số lượng yêu cầu vượt quá tồn kho. Tồn kho tối đa: ${product.stock}. Bạn đã có ${qtyInCart} sản phẩm trong giỏ.`);
      setQuantity(product.stock - qtyInCart > 0 ? product.stock - qtyInCart : 0);
    } else {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    if (!product || quantity <= 0) return;
    addToCart(product, quantity);
    alert(`Đã thêm ${quantity} sản phẩm "${product.name}" vào giỏ hàng thành công!`);
    setQuantity(product.stock - qtyInCart - quantity > 0 ? 1 : 0);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  if (loading) {
    return (
      <div className="detail-loading-container">
        <Loader2 size={48} className="animate-spin text-muted" />
        <p>Đang tải chi tiết sản phẩm...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="detail-error-container">
        <h2 className="error-title">Không tìm thấy sản phẩm</h2>
        <p className="error-msg">{error || 'Sản phẩm có thể đã ngừng kinh doanh hoặc đường dẫn không hợp lệ.'}</p>
        <Link to="/shop" className="btn-primary">
          Quay lại cửa hàng
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;
  const imagesList = product.images && product.images.length > 0 
    ? product.images 
    : [product.image || product.imageUrl || 'https://via.placeholder.com/600x700?text=Learts+Ceramics'];

  return (
    <div className="detail-page-wrapper w-full">
      <PageHeader 
        title={product.name} 
        currentPage={product.name} 
        parentPath="/shop" 
        parentName="Shop" 
      />
      <div className="detail-page-container">
        <div className="detail-nav-back" style={{ display: 'none' }}>
          <Link to="/shop" className="back-link">
            <ArrowLeft size={16} /> Quay lại danh sách sản phẩm
          </Link>
        </div>

      <div className="detail-grid">
        {/* BÊN TRÁI: HÌNH ẢNH */}
        <div className="detail-images-section">
          <div className="main-image-wrapper">
            <img src={activeImage} alt={product.name} className="main-detail-image" />
          </div>
          {/* Danh sách ảnh thu nhỏ nếu có nhiều ảnh */}
          {imagesList.length > 1 && (
            <div className="thumbnail-images-list">
              {imagesList.map((imgUrl, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(imgUrl)}
                  className={`thumb-btn ${activeImage === imgUrl ? 'active-thumb' : ''}`}
                >
                  <img src={imgUrl} alt={`${product.name} thumbnail ${index + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* BÊN PHẢI: CHI TIẾT SẢN PHẨM */}
        <div className="detail-info-section">
          <span className="detail-category">{typeof product.category === 'object' ? product.category.name : (product.category || 'Gốm sứ trang trí')}</span>
          <h1 className="detail-product-title">{product.name}</h1>
          
          <div className="detail-price-box">
            <span className="detail-price-text">{formatPrice(product.price)}</span>
          </div>

          <div className="detail-stock-indicator">
            {isOutOfStock ? (
              <span className="stock-badge out-of-stock">Đã hết hàng</span>
            ) : (
              <span className="stock-badge in-stock">
                Còn lại trong kho: <strong>{product.stock}</strong> sản phẩm
                {qtyInCart > 0 && ` (Bạn đã thêm ${qtyInCart} sản phẩm vào giỏ)`}
              </span>
            )}
          </div>

          <div className="detail-divider"></div>

          <p className="detail-description">
            {product.description || 
              `Sản phẩm ${product.name} được chế tác thủ công hoàn toàn bởi các nghệ nhân lành nghề tại Learts Studio. 
              Sử dụng chất liệu đất sét nung ở nhiệt độ cao, tráng lớp men mờ tự nhiên mang phong cách vintage trang nhã. 
              Một lựa chọn hoàn hảo để trang trí nội thất phòng khách, phòng làm việc hoặc làm quà tặng ý nghĩa.`}
          </p>

          {/* Ô CHỌN SỐ LƯỢNG & NÚT THÊM GIỎ HÀNG */}
          <div className="detail-actions-box">
            {!isOutOfStock && remainingStock <= 0 ? (
              <div className="warning-all-in-cart">
                Bạn đã thêm toàn bộ số lượng sản phẩm đang có trong kho vào giỏ hàng.
              </div>
            ) : (
              <>
                <div className="quantity-selector-wrapper">
                  <span className="quantity-label">Số lượng:</span>
                  <div className="quantity-input-box">
                    <button
                      type="button"
                      onClick={handleDecrement}
                      disabled={isOutOfStock || quantity <= 1}
                      className="quantity-change-btn"
                    >
                      <Minus size={14} />
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={handleQuantityChange}
                      disabled={isOutOfStock}
                      min={1}
                      max={product.stock - qtyInCart}
                      className="quantity-input"
                    />
                    <button
                      type="button"
                      onClick={handleIncrement}
                      disabled={isOutOfStock || quantity + qtyInCart >= product.stock}
                      className="quantity-change-btn"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                <div className="action-buttons-wrapper">
                  <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock || quantity <= 0}
                    className="btn-primary btn-add-to-cart"
                  >
                    <ShoppingBag size={18} className="mr-2 inline" /> THÊM VÀO GIỎ HÀNG
                  </button>
                  <button className="btn-wishlist-circle" title="Thêm vào yêu thích">
                    <Heart size={18} />
                  </button>
                </div>
              </>
            )}
          </div>

          <div className="detail-divider"></div>

          {/* CHÍNH SÁCH BÁN HÀNG */}
          <div className="detail-policies">
            <div className="policy-item">
              <Truck size={18} className="policy-icon" />
              <div>
                <h5>Miễn phí vận chuyển</h5>
                <p>Miễn phí giao hàng cho tất cả các đơn hàng nội địa Việt Nam.</p>
              </div>
            </div>
            <div className="policy-item">
              <ShieldCheck size={18} className="policy-icon" />
              <div>
                <h5>Chế tác thủ công chất lượng cao</h5>
                <p>Lớp men đạt chuẩn xuất khẩu châu Âu, an toàn tuyệt đối cho người dùng.</p>
              </div>
            </div>
            <div className="policy-item">
              <Award size={18} className="policy-icon" />
              <div>
                <h5>Đổi trả dễ dàng</h5>
                <p>Hỗ trợ đổi mới trong vòng 7 ngày nếu nứt vỡ trong quá trình vận chuyển.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}
