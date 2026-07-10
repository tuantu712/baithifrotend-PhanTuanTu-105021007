import { useSearchParams, useLocation } from 'react-router-dom';
import { useProducts, useCategories } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';
import HeroBanner from '../components/HeroBanner';
import PageHeader from '../components/PageHeader';
import { Filter, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const search = searchParams.get('search') || '';
  const categoryId = searchParams.get('categoryId') || '';
  const sort = searchParams.get('sort') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);
  
  const limit = 8; // Số lượng sản phẩm hiển thị trên mỗi trang
  const isHome = location.pathname === '/';

  // Gọi custom hook để fetch sản phẩm
  const { products, loading, error, totalPages, totalProducts } = useProducts({
    categoryId,
    sort,
    page,
    limit,
    search,
  });

  // Gọi custom hook để fetch danh mục sản phẩm
  const { categories, loading: categoriesLoading } = useCategories();

  // Hàm cập nhật query parameters trong URL
  const updateParams = (newParams: Record<string, string | number | null>) => {
    const updated = new URLSearchParams(searchParams);
    
    // Khi đổi bộ lọc thì reset về trang 1
    if (newParams.categoryId !== undefined || newParams.sort !== undefined || newParams.search !== undefined) {
      updated.set('page', '1');
    }

    Object.entries(newParams).forEach(([key, val]) => {
      if (val === null || val === '') {
        updated.delete(key);
      } else {
        updated.set(key, String(val));
      }
    });

    setSearchParams(updated);
  };

  const handleCategorySelect = (catId: string | null) => {
    updateParams({ categoryId: catId });
  };

  const handleSortSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateParams({ sort: e.target.value });
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      updateParams({ page: newPage });
      // Cuộn lên phần danh sách sản phẩm
      document.getElementById('shop-content')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleResetFilters = () => {
    setSearchParams({});
  };

  // Render các Card Skeleton lúc loading
  const renderSkeletons = () => {
    return Array.from({ length: limit }).map((_, idx) => (
      <div key={idx} className="skeleton-card animate-pulse">
        <div className="skeleton-image"></div>
        <div className="skeleton-text-short"></div>
        <div className="skeleton-text-long"></div>
        <div className="skeleton-row">
          <div className="skeleton-text-price"></div>
          <div className="skeleton-button"></div>
        </div>
      </div>
    ));
  };

  return (
    <div className="shop-page-wrapper">
      {/* Hero Banner or Page Header depending on Route */}
      {isHome ? <HeroBanner /> : <PageHeader title="Cửa hàng" currentPage="Shop" />}

      <div id="shop-content" className="shop-main-layout container">
        <div className="shop-grid-layout">
          {/* SIDEBAR: BỘ LỌC DANH MỤC */}
          <aside className="shop-sidebar">
            <div className="sidebar-widget">
              <h3 className="widget-title">
                <Filter size={16} /> Danh mục sản phẩm
              </h3>
              <ul className="category-list">
                <li>
                  <button
                    onClick={() => handleCategorySelect(null)}
                    className={`category-item-btn ${categoryId === '' ? 'active' : ''}`}
                  >
                    Tất cả sản phẩm
                  </button>
                </li>
                {categoriesLoading ? (
                  <div className="category-skeleton-list">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="skeleton-text-tiny animate-pulse"></div>
                    ))}
                  </div>
                ) : (
                  categories.map((cat) => (
                    <li key={cat._id}>
                      <button
                        onClick={() => handleCategorySelect(cat._id)}
                        className={`category-item-btn ${categoryId === cat._id ? 'active' : ''}`}
                      >
                        {cat.name}
                      </button>
                    </li>
                  ))
                )}
              </ul>
            </div>

            {/* Banner nhỏ quảng cáo thương hiệu */}
            <div className="sidebar-promo-banner">
              <div className="promo-overlay"></div>
              <div className="promo-text">
                <h4>Learts Clay Studio</h4>
                <p>Nâng niu từng nét vẽ tay cổ điển</p>
              </div>
            </div>
          </aside>

          {/* CHÍNH: DANH SÁCH SẢN PHẨM */}
          <main className="shop-products-section">
            {/* Thanh điều khiển (Sort, Hiển thị thông tin tìm kiếm) */}
            <div className="shop-toolbar">
              <div className="toolbar-info">
                {search && (
                  <p className="search-result-text">
                    Kết quả tìm kiếm cho: <strong>"{search}"</strong> 
                    <button onClick={() => updateParams({ search: null })} className="clear-search-btn">✕</button>
                  </p>
                )}
                <span className="products-count-text">
                  Hiển thị {products.length} trong tổng số {totalProducts} sản phẩm
                </span>
              </div>

              <div className="toolbar-actions">
                {/* Dropdown sắp xếp */}
                <div className="sort-wrapper">
                  <label htmlFor="sort-select">Sắp xếp:</label>
                  <select
                    id="sort-select"
                    value={sort}
                    onChange={handleSortSelect}
                    className="sort-select-dropdown"
                  >
                    <option value="">Mặc định</option>
                    <option value="price-asc">Giá: Thấp đến Cao</option>
                    <option value="price-desc">Giá: Cao đến Thấp</option>
                    <option value="newest">Mới nhất</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Trạng thái lỗi */}
            {error && (
              <div className="shop-error-container">
                <p className="shop-error-message">{error}</p>
                <button onClick={handleResetFilters} className="btn-secondary">
                  Thử tải lại dữ liệu
                </button>
              </div>
            )}

            {/* Danh sách dạng Grid */}
            {!error && (
              <>
                {loading ? (
                  <div className="products-grid">{renderSkeletons()}</div>
                ) : products.length === 0 ? (
                  <div className="shop-empty-products">
                    <p className="empty-message-text">Không tìm thấy sản phẩm nào khớp với bộ lọc.</p>
                    <button onClick={handleResetFilters} className="btn-primary reset-filter-btn">
                      <RotateCcw size={16} /> Đặt lại bộ lọc
                    </button>
                  </div>
                ) : (
                  <div className="products-grid animate-fade-in">
                    {products.map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))}
                  </div>
                )}
              </>
            )}

            {/* PHÂN TRANG (Pagination) */}
            {!error && !loading && totalPages > 1 && (
              <div className="pagination-wrapper">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="pagination-btn arrow-btn"
                  aria-label="Previous Page"
                >
                  <ChevronLeft size={16} /> Prev
                </button>

                {Array.from({ length: totalPages }, (_, index) => {
                  const pNum = index + 1;
                  return (
                    <button
                      key={pNum}
                      onClick={() => handlePageChange(pNum)}
                      className={`pagination-btn num-btn ${page === pNum ? 'active' : ''}`}
                    >
                      {pNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  className="pagination-btn arrow-btn"
                  aria-label="Next Page"
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
