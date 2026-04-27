import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  id: string;
  name: string;
  price: number;
  discountPrice?: number;
  imageUrl: string;
  quantity: number;
}

interface CartState {
  cart: CartItem[];
  isOpen: boolean;
  addToCart: (product: any) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  toggleCart: () => void;
  clearCart: () => void;
  totalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      isOpen: false,
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      addToCart: (product) => {
        const cart = get().cart;
        const existingItem = cart.find((item) => item.id === product.id);

        if (existingItem) {
          set({
            cart: cart.map((item) =>
              item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            ),
          });
        } else {
          set({ cart: [...cart, { ...product, quantity: 1 }] });
        }
        set({ isOpen: true }); // ပစ္စည်းထည့်လိုက်ရင် Sidebar ပွင့်လာအောင်
      },
      removeFromCart: (id) => set({ cart: get().cart.filter((item) => item.id !== id) }),
      updateQuantity: (id, qty) => {
        if (qty < 1) return;
        set({
          cart: get().cart.map((item) => (item.id === id ? { ...item, quantity: qty } : item)),
        });
      },
      clearCart: () => set({ cart: [] }),
      totalPrice: () => {
        return get().cart.reduce((total, item) => {
          const price = item.discountPrice || item.price;
          return total + Number(price) * item.quantity;
        }, 0);
      },
    }),
    { name: 'nexo-cart-storage' } // LocalStorage ထဲမှာ ပစ္စည်းတွေကို မှတ်ထားပေးမယ်
  )
);