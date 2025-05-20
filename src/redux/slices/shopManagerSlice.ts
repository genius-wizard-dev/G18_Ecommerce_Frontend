import { Inventory } from "@/schema/inventory";
import { ProductInput } from "@/schema/product";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  createProduct,
  deleteProduct,
  fetchInventory,
  fetchProducts,
  toggleProductActive,
  updateProduct,
} from "../thunks/shopManagerThunk";

interface ShopManagerState {
  products: ProductInput[];
  selectedProduct: ProductInput | null;
  inventory: Record<string, Inventory>; // Lưu inventory theo product_id
  isLoading: boolean;
  isUploading: boolean;
  isDeleting: string | null;
  error: string | null;
  dataFetched: boolean; // Thêm flag để kiểm tra đã fetch data chưa
}

const initialState: ShopManagerState = {
  products: [],
  selectedProduct: null,
  inventory: {},
  isLoading: false,
  isUploading: false,
  isDeleting: null,
  error: null,
  dataFetched: false, // Ban đầu chưa fetch data
};

const shopManagerSlice = createSlice({
  name: "shopManager",
  initialState,
  reducers: {
    setSelectedProduct: (state, action: PayloadAction<ProductInput | null>) => {
      state.selectedProduct = action.payload;
    },
    setIsUploading: (state, action: PayloadAction<boolean>) => {
      state.isUploading = action.payload;
    },
    resetProductForm: (state) => {
      state.selectedProduct = null;
    },
    resetDataFetchedFlag: (state) => {
      state.dataFetched = false;
    },
  },
  extraReducers: (builder) => {
    // Xử lý fetch products
    builder.addCase(fetchProducts.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchProducts.fulfilled, (state, action) => {
      state.isLoading = false;
      state.products = action.payload;
      state.dataFetched = true; // Đánh dấu đã fetch data
    });
    builder.addCase(fetchProducts.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || "Không thể lấy danh sách sản phẩm";
    });

    // Xử lý fetch inventory
    builder.addCase(fetchInventory.fulfilled, (state, action) => {
      if (action.payload) {
        state.inventory = {
          ...state.inventory,
          [action.payload.product_id]: action.payload,
        };
      }
    });

    // Xử lý create product
    builder.addCase(createProduct.pending, (state) => {
      state.isUploading = true;
      state.error = null;
    });
    builder.addCase(createProduct.fulfilled, (state, action) => {
      state.isUploading = false;
      if (action.payload) {
        state.products = [...state.products, action.payload];
        state.selectedProduct = null;
      }
    });
    builder.addCase(createProduct.rejected, (state, action) => {
      state.isUploading = false;
      state.error = action.error.message || "Không thể tạo sản phẩm";
    });

    // Xử lý update product
    builder.addCase(updateProduct.pending, (state) => {
      state.isUploading = true; // Chỉ set isUploading, không set isLoading
      state.error = null;
    });
    builder.addCase(updateProduct.fulfilled, (state, action) => {
      state.isUploading = false;
      if (action.payload) {
        state.products = state.products.map((product) =>
          product._id === action.payload?._id
            ? { ...product, ...action.payload }
            : product
        );
        // Reset form khi cập nhật sản phẩm thành công
        state.selectedProduct = null;
      }
    });
    builder.addCase(updateProduct.rejected, (state, action) => {
      state.isUploading = false;
      state.error = action.error.message || "Không thể cập nhật sản phẩm";
    });

    // Xử lý toggle active product
    builder.addCase(toggleProductActive.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(toggleProductActive.fulfilled, (state, action) => {
      state.isLoading = false;
      if (action.payload) {
        state.products = state.products.map((product) =>
          product._id === action.payload?._id
            ? { ...product, ...action.payload }
            : product
        );
      }
    });
    builder.addCase(toggleProductActive.rejected, (state, action) => {
      state.isLoading = false;
      state.error =
        action.error.message || "Không thể cập nhật trạng thái sản phẩm";
    });

    // Xử lý delete product
    builder.addCase(deleteProduct.pending, (state, action) => {
      state.isDeleting = action.meta.arg;
      state.error = null;
    });
    builder.addCase(deleteProduct.fulfilled, (state, action) => {
      state.isDeleting = null;
      if (action.payload) {
        // Cập nhật trạng thái sản phẩm trong danh sách
        state.products = state.products.map((product) =>
          product._id === action.payload._id
            ? { ...product, isActive: false }
            : product
        );
      }
    });
    builder.addCase(deleteProduct.rejected, (state, action) => {
      state.isDeleting = null;
      state.error = action.error.message || "Không thể xóa sản phẩm";
    });
  },
});

export const {
  setSelectedProduct,
  setIsUploading,
  resetProductForm,
  resetDataFetchedFlag,
} = shopManagerSlice.actions;
export default shopManagerSlice.reducer;
