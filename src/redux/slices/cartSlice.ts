import { CartResponse } from "@/schema/cart";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { addProductToCart, deleteCartItem, getCart } from "../thunks/cart";

// Định nghĩa interface cho item trong giỏ hàng
export interface CartItem {
  productId: string;
  shopId: string;
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export interface CartItemBody {
  userId: string;
  productId: string;
  quantity: number;
  price: number;
  shopId: string;
}

interface CartState {
  cartId: string;
  items: CartItem[];
  isOpen: boolean;
  totalPrice: number;
  
}

const initialState: CartState = {
  cartId: "",
  items: [],
  isOpen: false,
  totalPrice: 0,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    getCart: (state, action: PayloadAction<CartResponse>) => {
      state.items = action.payload.data.cartItems;
      state.totalPrice = action.payload.data.totalPrice;
    },
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );

      if (existingItem) {
        // Nếu sản phẩm đã tồn tại, tăng số lượng
        existingItem.quantity += action.payload.quantity;
      } else {
        // Nếu chưa có, thêm mới
        state.items.push(action.payload);
      }
    },

    // Xóa sản phẩm khỏi giỏ hàng
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },

    // Cập nhật số lượng sản phẩm
    updateQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item.id === id);

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
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        getCart.fulfilled,
        (
          state,
          action: PayloadAction<{
            cartId: string;
            totalPrice: number;
            cartItems: CartItem[];
          }>
        ) => {
          const { cartId, totalPrice, cartItems } = action.payload;

          state.items = cartItems;
          state.totalPrice = totalPrice;
          state.cartId = cartId;
        }
      )
      .addCase(addProductToCart.fulfilled, (state, action) => {
        console.log("Add product to cart successful");
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        console.log("Delete cart item successful");
      });
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
  openCart,
} = cartSlice.actions;

// Selector để lấy tổng số lượng sản phẩm trong giỏ hàng
export const selectCartItemsCount = (state: RootState) =>
  state.cart.items.reduce((total, item) => total + item.quantity, 0);

// Selector để lấy tổng giá trị giỏ hàng
export const selectCartTotal = (state: RootState) =>
  state.cart.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

// Selector để lấy trạng thái mở/đóng của giỏ hàng
export const selectIsCartOpen = (state: RootState) => state.cart.isOpen;

// Selector để lấy danh sách sản phẩm trong giỏ hàng
export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCart = (state: RootState) => state.cart;

export default cartSlice.reducer;
