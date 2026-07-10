import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { api } from '../hooks/useProducts';
import { ArrowLeft, CheckCircle, CreditCard, Loader2, Phone, Mail, MapPin, User, FileText } from 'lucide-react';
import PageHeader from '../components/PageHeader';

// Zod validation schema
const checkoutSchema = z.object({
  fullName: z.string().min(2, 'Họ và tên phải chứa ít nhất 2 ký tự'),
  phone: z
    .string()
    .regex(/^[0-9]+$/, 'Số điện thoại chỉ được chứa các chữ số từ 0-9')
    .length(10, 'Số điện thoại phải có đúng 10 chữ số'),
  email: z.string().email('Địa chỉ email không hợp lệ'),
  address: z.string().min(5, 'Địa chỉ nhận hàng phải chứa ít nhất 5 ký tự'),
  note: z.string().optional(),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const { items, clearCart, getTotalPrice } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: '',
      phone: '',
      email: '',
      address: '',
      note: '',
    },
  });

  const onSubmit = async (data: CheckoutFormValues) => {
    if (items.length === 0) return;
    setIsSubmitting(true);
    setApiError(null);

    const orderData = {
      customerName: data.fullName,
      customerPhone: data.phone,
      customerAddress: data.address,
      items: items.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
      })),
    };

    try {
      // Gửi POST request lên API backend
      const response = await api.post('/orders', orderData);
      
      // Xử lý khi đặt hàng thành công
      setCreatedOrderId(response.data?.data?._id || response.data?._id || 'ORDER-' + Math.floor(Math.random() * 1000000));
      setOrderSuccess(true);
      clearCart();
    } catch (err: any) {
      console.error('Lỗi khi đặt hàng:', err);
      setApiError(
        err.response?.data?.message ||
        err.message ||
        'Đã xảy ra lỗi trong quá trình đặt hàng. Vui lòng thử lại.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Định dạng tiền tệ VND
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  if (orderSuccess) {
    return (
      <div className="checkout-success-container">
        <div className="checkout-success-card">
          <div className="success-icon-wrapper">
            <CheckCircle size={64} className="success-icon animate-scale" />
          </div>
          <h2 className="success-title">Đặt hàng thành công!</h2>
          <p className="success-message">
            Cảm ơn bạn đã mua sắm tại <strong>Learts</strong>. Đơn hàng của bạn đang được xử lý.
          </p>
          <div className="order-details-summary">
            <p><strong>Mã đơn hàng:</strong> <span className="order-id">{createdOrderId}</span></p>
            <p>Trạng thái: <span className="order-status-badge">Đang chờ xử lý</span></p>
          </div>
          <p className="success-note">
            Chúng tôi đã gửi email xác nhận chi tiết đơn hàng đến địa chỉ email của bạn.
          </p>
          <button onClick={() => navigate('/shop')} className="btn-primary success-btn">
            Tiếp tục mua sắm
          </button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="checkout-empty-container">
        <div className="checkout-empty-card">
          <CreditCard size={48} className="empty-cart-icon text-muted" />
          <h2 className="empty-title">Trang thanh toán</h2>
          <p className="empty-message">Giỏ hàng của bạn hiện đang trống. Hãy chọn sản phẩm để thanh toán.</p>
          <Link to="/shop" className="btn-primary">
            Quay lại Cửa hàng
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page-wrapper w-full">
      <PageHeader title="Thanh toán" currentPage="Checkout" />
      <div className="checkout-page-container">
        <div className="checkout-header-section" style={{ display: 'none' }}>
          <Link to="/cart" className="back-link">
            <ArrowLeft size={16} /> Quay lại giỏ hàng
          </Link>
          <h1 className="checkout-title">Thanh toán đơn hàng</h1>
        </div>

      <div className="checkout-grid">
        {/* CỘT TRÁI: FORM THÔNG TIN GIAO HÀNG */}
        <div className="checkout-form-section">
          <h2 className="section-title">Thông tin giao hàng</h2>
          
          {apiError && <div className="error-alert-banner">{apiError}</div>}

          <form onSubmit={handleSubmit(onSubmit)} className="checkout-form">
            {/* Họ và tên */}
            <div className="form-group">
              <label htmlFor="fullName">
                <User size={16} /> Họ và tên <span className="required">*</span>
              </label>
              <div className="input-wrapper">
                <input
                  id="fullName"
                  type="text"
                  placeholder="Nhập đầy đủ họ và tên"
                  {...register('fullName')}
                  className={errors.fullName ? 'input-error' : ''}
                />
              </div>
              {errors.fullName && <p className="error-text">{errors.fullName.message}</p>}
            </div>

            {/* Số điện thoại */}
            <div className="form-group">
              <label htmlFor="phone">
                <Phone size={16} /> Số điện thoại <span className="required">*</span>
              </label>
              <div className="input-wrapper">
                <input
                  id="phone"
                  type="text"
                  placeholder="Nhập số điện thoại (10 chữ số)"
                  {...register('phone')}
                  className={errors.phone ? 'input-error' : ''}
                />
              </div>
              {errors.phone && <p className="error-text">{errors.phone.message}</p>}
            </div>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="email">
                <Mail size={16} /> Địa chỉ Email <span className="required">*</span>
              </label>
              <div className="input-wrapper">
                <input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  {...register('email')}
                  className={errors.email ? 'input-error' : ''}
                />
              </div>
              {errors.email && <p className="error-text">{errors.email.message}</p>}
            </div>

            {/* Địa chỉ */}
            <div className="form-group">
              <label htmlFor="address">
                <MapPin size={16} /> Địa chỉ nhận hàng <span className="required">*</span>
              </label>
              <div className="input-wrapper">
                <input
                  id="address"
                  type="text"
                  placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
                  {...register('address')}
                  className={errors.address ? 'input-error' : ''}
                />
              </div>
              {errors.address && <p className="error-text">{errors.address.message}</p>}
            </div>

            {/* Ghi chú */}
            <div className="form-group">
              <label htmlFor="note">
                <FileText size={16} /> Ghi chú đơn hàng (Tùy chọn)
              </label>
              <div className="input-wrapper">
                <textarea
                  id="note"
                  placeholder="Ví dụ: Giao giờ hành chính, gọi điện trước khi giao..."
                  rows={4}
                  {...register('note')}
                ></textarea>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary btn-submit-order font-semibold"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin mr-2" /> Đang xử lý...
                </>
              ) : (
                `Xác nhận đặt hàng (${formatPrice(getTotalPrice())})`
              )}
            </button>
          </form>
        </div>

        {/* CỘT PHẢI: TÓM TẮT ĐƠN HÀNG */}
        <div className="checkout-summary-section">
          <h2 className="section-title">Đơn hàng của bạn</h2>
          
          <div className="order-summary-card">
            <div className="summary-items-list">
              {items.map((item) => (
                <div key={item.product._id} className="summary-item-row">
                  <div className="summary-item-img-wrapper">
                    <img
                      src={item.product.image || item.product.imageUrl || 'https://via.placeholder.com/80'}
                      alt={item.product.name}
                    />
                    <span className="summary-item-badge">{item.quantity}</span>
                  </div>
                  <div className="summary-item-info">
                    <h4 className="summary-item-name">{item.product.name}</h4>
                    <span className="summary-item-price-unit">{formatPrice(item.product.price)}</span>
                  </div>
                  <div className="summary-item-subtotal">
                    {formatPrice(item.product.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            <div className="summary-pricing-details">
              <div className="pricing-row">
                <span>Tạm tính</span>
                <span>{formatPrice(getTotalPrice())}</span>
              </div>
              <div className="pricing-row">
                <span>Phí vận chuyển</span>
                <span className="shipping-free">Miễn phí</span>
              </div>
              <div className="pricing-total-divider"></div>
              <div className="pricing-row total-row">
                <span>Tổng cộng</span>
                <span className="grand-total-price">{formatPrice(getTotalPrice())}</span>
              </div>
            </div>

            <div className="payment-methods-box">
              <h3 className="payment-title">Phương thức thanh toán</h3>
              <div className="payment-option checked">
                <input type="radio" id="cod" name="payment" defaultChecked />
                <label htmlFor="cod">Thanh toán khi nhận hàng (COD)</label>
              </div>
              <p className="payment-desc">
                Thanh toán bằng tiền mặt trực tiếp cho nhân viên giao hàng khi nhận được sản phẩm.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}
