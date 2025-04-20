import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

// Định nghĩa interface cho item trong giỏ hàng
export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

const initialState: CartState = {
  items: [],
  isOpen: false,
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);

      if (existingItem) {
        // Nếu sản phẩm đã tồn tại, tăng số lượng
        existingItem.quantity += action.payload.quantity;
      } else {
        // Nếu chưa có, thêm mới
        state.items.push(action.payload);
      }
    },

    // Xóa sản phẩm khỏi giỏ hàng
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },

    // Cập nhật số lượng sản phẩm
    updateQuantity: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.id === id);

      if (item) {
        item.quantity = quantity;
      }
    },

    // Xóa toàn bộ giỏ hàng
    clearCart: (state) => {
      state.items = [];
    },

    // Mở/đóng giỏ hàng (cho UI mobile)
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },

    // Đóng giỏ hàng
    closeCart: (state) => {
      state.isOpen = false;
    },

    // Mở giỏ hàng
    openCart: (state) => {
      state.isOpen = true;
    }
  },
});

// Export các actions
export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  toggleCart,
  closeCart,
  openCart
} = cartSlice.actions;

// Selector để lấy tổng số lượng sản phẩm trong giỏ hàng
export const selectCartItemsCount = (state: RootState) =>
  state.cart.items.reduce((total, item) => total + item.quantity, 0);

// Selector để lấy tổng giá trị giỏ hàng
export const selectCartTotal = (state: RootState) =>
  state.cart.items.reduce((total, item) => total + item.price * item.quantity, 0);

// Selector để lấy trạng thái mở/đóng của giỏ hàng
export const selectIsCartOpen = (state: RootState) => state.cart.isOpen;

// Selector để lấy danh sách sản phẩm trong giỏ hàng
export const selectCartItems = (state: RootState) => state.cart.items;

export default cartSlice.reducer;
