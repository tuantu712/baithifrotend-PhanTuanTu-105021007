import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { Trash2, Minus, Plus, ShoppingCart, ArrowLeft, ShieldCheck, HelpCircle } from 'lucide-react';
import PageHeader from '../components/PageHeader';

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, getTotalPrice } = useCartStore();
  const navigate = useNavigate();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleQuantityInputChange = (productId: string, stock: number, valStr: string) => {
    const value = parseInt(valStr, 10);
    if (isNaN(value) || value <= 0) {
      // Nhập giá trị âm hoặc 0 sẽ xóa sản phẩm
      if (confirm('Bạn muốn xóa sản phẩm này khỏi giỏ hàng?')) {
        removeFromCart(productId);
      }
    } else if (value > stock) {
      alert(`Xin lỗi, sản phẩm này chỉ còn tối đa ${stock} mặt hàng trong kho.`);
      updateQuantity(productId, stock);
    } else {
      updateQuantity(productId, value);
    }
  };

  const handleIncrement = (productId: string, currentQty: number, stock: number) => {
    if (currentQty >= stock) {
      alert(`Xin lỗi, đã đạt giới hạn tồn kho tối đa (${stock} sản phẩm).`);
      return;
    }
    updateQuantity(productId, currentQty + 1);
  };

  const handleDecrement = (productId: string, currentQty: number) => {
    if (currentQty <= 1) {
      if (confirm('Bạn muốn xóa sản phẩm này khỏi giỏ hàng?')) {
        removeFromCart(productId);
      }
      return;
    }
    updateQuantity(productId, currentQty - 1);
  };

  if (items.length === 0) {
    return (
      <div className="cart-empty-container">
        <div className="cart-empty-card">
          <ShoppingCart size={64} className="empty-cart-icon text-muted" />
          <h2 className="empty-title">Giỏ hàng của bạn đang trống</h2>
          <p className="empty-message">Hãy thêm một vài sản phẩm gốm sứ tinh xảo của Learts vào giỏ hàng nhé!</p>
          <Link to="/shop" className="btn-primary">
            Quay lại Cửa hàng
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page-wrapper w-full">
      <PageHeader title="Giỏ hàng" currentPage="Cart" />
      <div className="cart-page-container">

      <div className="cart-layout-grid">
        {/* DANH SÁCH GIỎ HÀNG */}
        <div className="cart-table-wrapper">
          <table className="cart-table">
            <thead>
              <tr>
                <th className="th-product">Sản phẩm</th>
                <th className="th-price">Đơn giá</th>
                <th className="th-quantity">Số lượng</th>
                <th className="th-subtotal">Thành tiền</th>
                <th className="th-action"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.product._id} className="cart-item-row">
                  {/* Sản phẩm (Ảnh + Tên) */}
                  <td className="td-product">
                    <div className="cart-product-info">
                      <img
                        src={item.product.image || item.product.imageUrl || 'https://via.placeholder.com/80'}
                        alt={item.product.name}
                        className="cart-product-img"
                      />
                      <div>
                        <Link to={`/product/${item.product._id}`} className="cart-product-name">
                          {item.product.name}
                        </Link>
                        <span className="cart-product-cat">{typeof item.product.category === 'object' ? item.product.category.name : (item.product.category || 'Gốm sứ')}</span>
                        {item.product.stock <= 5 && (
                          <span className="stock-warning">Chỉ còn {item.product.stock} sản phẩm trong kho</span>
                        )}
                      </div>
                    </div>
                  </td>
                  
                  {/* Đơn giá */}
                  <td className="td-price">
                    <span className="item-price">{formatPrice(item.product.price)}</span>
                  </td>

                  {/* Số lượng */}
                  <td className="td-quantity">
                    <div className="quantity-input-box table-qty">
                      <button
                        type="button"
                        onClick={() => handleDecrement(item.product._id, item.quantity)}
                        className="quantity-change-btn"
                      >
                        <Minus size={12} />
                      </button>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          handleQuantityInputChange(item.product._id, item.product.stock, e.target.value)
                        }
                        className="quantity-input"
                        min={1}
                        max={item.product.stock}
                      />
                      <button
                        type="button"
                        onClick={() => handleIncrement(item.product._id, item.quantity, item.product.stock)}
                        className="quantity-change-btn"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </td>

                  {/* Thành tiền */}
                  <td className="td-subtotal">
                    <span className="item-subtotal">{formatPrice(item.product.price * item.quantity)}</span>
                  </td>

                  {/* Xóa */}
                  <td className="td-action">
                    <button
                      onClick={() => {
                        if (confirm(`Bạn muốn xóa sản phẩm "${item.product.name}" khỏi giỏ hàng?`)) {
                          removeFromCart(item.product._id);
                        }
                      }}
                      className="btn-remove-item"
                      title="Xóa sản phẩm"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Nút điều hướng phụ */}
          <div className="cart-actions-bottom">
            <Link to="/shop" className="btn-continue-shopping">
              <ArrowLeft size={16} /> Tiếp tục mua sắm
            </Link>
          </div>
        </div>

        {/* TÓM TẮT ĐƠN HÀNG & THANH TOÁN */}
        <div className="cart-totals-section">
          <div className="cart-totals-card">
            <h3 className="card-title">Tóm tắt đơn hàng</h3>
            
            <div className="totals-row">
              <span>Tạm tính</span>
              <span className="subtotal-price">{formatPrice(getTotalPrice())}</span>
            </div>
            
            <div className="totals-row">
              <span>Vận chuyển</span>
              <span className="shipping-text">Miễn phí giao hàng</span>
            </div>

            <div className="totals-divider"></div>

            <div className="totals-row grand-total-row">
              <span>Tổng cộng</span>
              <span className="grand-total-price">{formatPrice(getTotalPrice())}</span>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="btn-primary btn-proceed-checkout w-full mt-6"
            >
              TIẾN HÀNH THANH TOÁN
            </button>

            <div className="checkout-trust-badges">
              <div className="trust-badge-item">
                <ShieldCheck size={16} className="text-success" />
                <span>Thanh toán an toàn 100%</span>
              </div>
              <div className="trust-badge-item">
                <HelpCircle size={16} className="text-muted" />
                <span>Cần trợ giúp? Liên hệ hotline: 1900-1234</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}
