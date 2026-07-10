import { useState, useEffect } from 'react';
import axios from 'axios';
import type { Product } from '../store/cartStore';

// Cấu hình Axios Instance với Interceptors
export const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    // Có thể cấu hình thêm Token Authorization ở đây nếu cần thiết
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Axios Request Error Interceptor:', error);
    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('Axios Response Error Interceptor:', error.response || error.message);
    return Promise.reject(error);
  }
);

export interface UseProductsFilters {
  categoryId?: string;
  sort?: string;
  page?: number;
  limit?: number;
  search?: string;
}

export const useProducts = (filters: UseProductsFilters) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalProducts, setTotalProducts] = useState<number>(0);

  const { categoryId, sort, page = 1, limit = 8, search } = filters;

  useEffect(() => {
    let isMounted = true;
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const params: Record<string, any> = {
          // Fetch danh sách lớn từ server để thực hiện tìm kiếm/sắp xếp/phân trang
          // client-side đồng bộ, do backend chỉ hỗ trợ lọc categoryId và phân trang cơ bản.
          page: 1,
          limit: 100,
        };
        if (categoryId) params.categoryId = categoryId;

        const response = await api.get('/products', { params });
        
        if (isMounted) {
          const resBody = response.data;
          let list: Product[] = [];
          
          if (resBody && typeof resBody === 'object') {
            const dataField = resBody.data;
            if (dataField && typeof dataField === 'object' && !Array.isArray(dataField)) {
              list = dataField.products || [];
            } else if (Array.isArray(resBody)) {
              list = resBody;
            } else {
              list = resBody.products || [];
            }
          }

          // 1. Tìm kiếm phía Client (Search)
          if (search) {
            const searchLower = search.toLowerCase();
            list = list.filter(
              (p) =>
                p.name.toLowerCase().includes(searchLower) ||
                (p.description && p.description.toLowerCase().includes(searchLower))
            );
          }

          // 2. Sắp xếp phía Client (Sort)
          if (sort === 'price-asc') {
            list = [...list].sort((a, b) => a.price - b.price);
          } else if (sort === 'price-desc') {
            list = [...list].sort((a, b) => b.price - a.price);
          } else if (sort === 'newest') {
            list = [...list].sort((a, b) => {
              const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
              const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
              return dateB - dateA;
            });
          }

          // 3. Phân trang phía Client (Pagination)
          const total = list.length;
          const pages = Math.ceil(total / limit);
          const startIndex = (page - 1) * limit;
          const paginatedList = list.slice(startIndex, startIndex + limit);

          setProducts(paginatedList);
          setTotalPages(pages || 1);
          setTotalProducts(total);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(
            err.response?.data?.message || 
            err.message || 
            'Không thể kết nối đến server backend hoặc tải danh sách sản phẩm.'
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, [categoryId, sort, page, limit, search]);

  return { products, loading, error, totalPages, totalProducts };
};

export const useProductDetail = (id: string | undefined) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let isMounted = true;

    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/products/${id}`);
        if (isMounted) {
          const resBody = response.data;
          if (resBody && typeof resBody === 'object') {
            setProduct(resBody.data || resBody);
          } else {
            setProduct(null);
          }
        }
      } catch (err: any) {
        if (isMounted) {
          setError(
            err.response?.data?.message || 
            err.message || 
            'Không thể tải thông tin chi tiết sản phẩm.'
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProduct();

    return () => {
      isMounted = false;
    };
  }, [id]);

  return { product, loading, error };
};

export interface CategoryType {
  _id: string;
  name: string;
  description?: string;
}

export const useCategories = () => {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    const fetchCategories = async () => {
      try {
        const response = await api.get('/products/categories');
        if (isMounted) {
          const resBody = response.data;
          setCategories(resBody.data || []);
        }
      } catch (err) {
        console.error('Fetch categories error (using fallback):', err);
        // Fallback categories phong cách Learts vintage gốm sứ decor
        if (isMounted) {
          setCategories([
            { _id: '6a50591ec2dc57a50e7359b9', name: 'Decor' },
            { _id: '6a50591fc2dc57a50e7359bb', name: 'Furniture' },
            { _id: '6a50591fc2dc57a50e7359be', name: 'Lighting' }
          ]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  return { categories, loading };
};
