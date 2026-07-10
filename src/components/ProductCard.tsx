import { Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import type { Product } from '../store/cartStore';
import { ShoppingCart, Eye } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCartStore();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product, 1);
  };

  return (
    <div className="product-card">
      <div className="product-card-image-wrapper">
        <Link to={`/product/${product._id}`}>
          <img
            src={product.image || product.imageUrl || 'https://via.placeholder.com/300x400?text=Learts+Ceramics'}
            alt={product.name}
            className="product-card-image"
            loading="lazy"
          />
        </Link>

        {/* Status Badges */}
        <div className="product-badge-container">
          {isOutOfStock ? (
            <span className="badge-out-of-stock">Hết hàng</span>
          ) : isLowStock ? (
            <span className="badge-low-stock">Chỉ còn {product.stock}</span>
          ) : null}
        </div>

        {/* Hover Action Overlay */}
        <div className="product-card-overlay">
          <Link
            to={`/product/${product._id}`}
            className="overlay-btn view-detail-btn"
            title="Xem chi tiết"
          >
            <Eye size={18} />
          </Link>
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`overlay-btn add-to-cart-btn ${isOutOfStock ? 'disabled' : ''}`}
            title="Thêm vào giỏ"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>

      <div className="product-card-info">
        <span className="product-card-category">{typeof product.category === 'object' ? product.category.name : (product.category || 'Gốm sứ')}</span>
        <h3 className="product-card-name">
          <Link to={`/product/${product._id}`}>{product.name}</Link>
        </h3>
        <div className="product-card-meta">
          <span className="product-card-price">{formatPrice(product.price)}</span>
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`product-quick-add ${isOutOfStock ? 'out-of-stock' : ''}`}
          >
            {isOutOfStock ? 'Hết hàng' : 'Thêm +'}
          </button>
        </div>
      </div>
    </div>
  );
}
