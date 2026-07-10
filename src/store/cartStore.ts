import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Product {
  _id: string;
  name: string;
  price: number;
  image?: string;
  images?: string[];
  imageUrl?: string;
  stock: number;
  description?: string;
  category?: string | { _id: string; name: string };
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addToCart: (product, quantity = 1) => {
        const items = get().items;
        const existingItem = items.find(
          (item) => item.product._id === product._id
        );

        if (existingItem) {
          const newQuantity = existingItem.quantity + quantity;
          if (newQuantity > product.stock) {
            alert(`Xin lỗi, chỉ còn ${product.stock} sản phẩm trong kho. Bạn đã có ${existingItem.quantity} sản phẩm trong giỏ hàng.`);
            return;
          }
          set({
            items: items.map((item) =>
              item.product._id === product._id
                ? { ...item, quantity: newQuantity }
                : item
            ),
          });
        } else {
          if (quantity > product.stock) {
            alert(`Xin lỗi, chỉ còn ${product.stock} sản phẩm trong kho.`);
            return;
          }
          set({ items: [...items, { product, quantity }] });
        }
      },
      removeFromCart: (productId) => {
        set({
          items: get().items.filter((item) => item.product._id !== productId),
        });
      },
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }

        const items = get().items;
        const item = items.find((item) => item.product._id === productId);

        if (item) {
          if (quantity > item.product.stock) {
            alert(`Xin lỗi, số lượng tồn kho tối đa là ${item.product.stock}.`);
            return;
          }
          set({
            items: items.map((i) =>
              i.product._id === productId ? { ...i, quantity } : i
            ),
          });
        }
      },
      clearCart: () => set({ items: [] }),
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.product.price * item.quantity, 0);
      },
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: 'learts-cart-storage',
    }
  )
);
