import api from "@/lib/axios/api.service";
import { ENDPOINTS } from "@/lib/axios/endpoint";
import { Inventory, InventoryListResponse } from "@/schema/inventory";
import { ProductInput, ProductResponse } from "@/schema/product";
import {
  CLOUDINARY_CONFIG,
  uploadMultipleToCloudinary,
  uploadToCloudinary,
} from "@/utils/cloudinary.config";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "sonner";

// Fetch products của shop
export const fetchProducts = createAsyncThunk(
  "shopManager/fetchProducts",
  async (shopId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(ENDPOINTS.PRODUCT.GET_BY_SHOP(shopId));
      const { success, data } = response as {
        success: boolean;
        data: { products: ProductInput[] };
      };

      if (success) {
        return data.products;
      }
      return rejectWithValue("Không có sản phẩm nào được tìm thấy");
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sản phẩm:", error);
      return rejectWithValue("Không thể lấy danh sách sản phẩm");
    }
  }
);

// Fetch inventory của sản phẩm
export const fetchInventory = createAsyncThunk(
  "shopManager/fetchInventory",
  async (productId: string, { rejectWithValue }) => {
    try {
      const inventoryRes = await api.get<Inventory>(
        ENDPOINTS.INVENTORY.GET_BY_PRODUCT_ID(productId)
      );

      return inventoryRes;
    } catch (error) {
      console.error("Lỗi khi lấy thông tin kho hàng:", error);
      return rejectWithValue(null);
    }
  }
);

// Interface cho payload tạo sản phẩm
interface CreateProductPayload {
  productData: Omit<ProductInput, "thumbnailImage" | "images"> & {
    thumbnailFile: File | null;
    imageFiles: File[];
  };
  quantity: number;
  shopId: string;
}

// Tạo sản phẩm mới
export const createProduct = createAsyncThunk(
  "shopManager/createProduct",
  async (
    { productData, quantity, shopId }: CreateProductPayload,
    { rejectWithValue }
  ) => {
    try {
      const { thumbnailFile, imageFiles, ...productInfo } = productData;

      // Upload thumbnail image to Cloudinary
      let thumbnailPublicId = "";
      if (thumbnailFile) {
        thumbnailPublicId = await uploadToCloudinary(
          thumbnailFile,
          CLOUDINARY_CONFIG
        );
      }

      // Upload multiple images to Cloudinary
      let imagePublicIds: string[] = [];
      if (imageFiles.length > 0) {
        imagePublicIds = await uploadMultipleToCloudinary(
          imageFiles,
          CLOUDINARY_CONFIG
        );
      }

      // Tạo object sản phẩm để gửi lên API
      const newProduct: ProductInput = {
        ...productInfo,
        thumbnailImage: thumbnailPublicId,
        images: imagePublicIds,
        shopId,
      };

      // Gửi request API để tạo sản phẩm
      const response = await api.post<ProductResponse>(
        ENDPOINTS.PRODUCT.CREATE,
        newProduct
      );

      if (response.success === true && response.data._id) {
        // Tạo inventory cho sản phẩm
        const inventoryData: Inventory = {
          product_id: response.data._id,
          product_name: newProduct.name || "",
          shop_id: shopId,
          total_quantity: quantity || 0,
        };

        await api.post(ENDPOINTS.INVENTORY.CREATE, inventoryData);
        toast.success("Sản phẩm đã được tạo thành công");
        return response.data;
      }

      toast.error("Không thể tạo sản phẩm. Vui lòng thử lại sau.");
      return rejectWithValue("Không thể tạo sản phẩm");
    } catch (error) {
      console.error("Lỗi khi tạo sản phẩm:", error);
      toast.error("Không thể tạo sản phẩm. Vui lòng thử lại sau.");
      return rejectWithValue("Không thể tạo sản phẩm");
    }
  }
);

// Interface cho payload cập nhật sản phẩm
interface UpdateProductPayload {
  productId: string;
  productData: Partial<ProductInput> & {
    thumbnailFile?: File | null;
    imageFiles?: File[];
  };
  quantity?: number;
}

// Cập nhật sản phẩm
export const updateProduct = createAsyncThunk(
  "shopManager/updateProduct",
  async (
    { productId, productData, quantity }: UpdateProductPayload,
    { rejectWithValue }
  ) => {
    try {
      const { thumbnailFile, imageFiles, ...productInfo } = productData;

      let updatedProduct: Partial<ProductInput> = { ...productInfo };

      // Upload thumbnail image nếu có
      if (thumbnailFile) {
        const thumbnailPublicId = await uploadToCloudinary(
          thumbnailFile,
          CLOUDINARY_CONFIG
        );
        updatedProduct.thumbnailImage = thumbnailPublicId;
      }

      // Upload multiple images nếu có
      if (imageFiles && imageFiles.length > 0) {
        const imagePublicIds = await uploadMultipleToCloudinary(
          imageFiles,
          CLOUDINARY_CONFIG
        );
        updatedProduct.images = imagePublicIds;
      }

      // Gửi request API để cập nhật sản phẩm
      const response = await api.put<ProductResponse>(
        ENDPOINTS.PRODUCT.UPDATE(productId),
        updatedProduct
      );

      if (response.success === true) {
        // Cập nhật inventory nếu có
        if (quantity !== undefined) {
          try {
            // Kiểm tra xem inventory đã tồn tại chưa
            const inventoryRes = await api.get<InventoryListResponse>(
              ENDPOINTS.INVENTORY.GET_BY_PRODUCT_ID(productId)
            );

            if (inventoryRes) {
              const inventoryData: Partial<Inventory> = {
                product_name: productInfo.name,
                total_quantity: quantity,
              };

              await api.put(
                ENDPOINTS.INVENTORY.UPDATE_BY_PRODUCT_ID(productId),
                inventoryData
              );
            } else {
              // Tạo mới inventory nếu chưa tồn tại
              const inventoryData: Inventory = {
                product_id: productId,
                product_name: productInfo.name || "",
                shop_id: productInfo.shopId || "",
                total_quantity: quantity,
              };

              await api.post(ENDPOINTS.INVENTORY.CREATE, inventoryData);
            }
          } catch (inventoryError) {
            console.error("Lỗi khi cập nhật inventory:", inventoryError);
          }
        }

        toast.success("Sản phẩm đã được cập nhật thành công");
        // Trả về đầy đủ thông tin sản phẩm đã cập nhật
        return {
          _id: productId,
          ...updatedProduct,
          // Đảm bảo các thông tin khác được giữ nguyên
          ...productInfo,
        };
      }

      toast.error("Không thể cập nhật sản phẩm. Vui lòng thử lại sau.");
      return rejectWithValue("Không thể cập nhật sản phẩm");
    } catch (error) {
      console.error("Lỗi khi cập nhật sản phẩm:", error);
      toast.error("Không thể cập nhật sản phẩm. Vui lòng thử lại sau.");
      return rejectWithValue("Không thể cập nhật sản phẩm");
    }
  }
);

// Interface cho payload cập nhật trạng thái active sản phẩm
interface ToggleProductActivePayload {
  productId: string;
  isActive: boolean;
}

// Cập nhật trạng thái active của sản phẩm
export const toggleProductActive = createAsyncThunk(
  "shopManager/toggleProductActive",
  async (
    { productId, isActive }: ToggleProductActivePayload,
    { rejectWithValue }
  ) => {
    try {
      const updatedProduct: Partial<ProductInput> = {
        isActive: isActive,
      };

      // Gửi request API để cập nhật sản phẩm
      const response = await api.put<ProductResponse>(
        ENDPOINTS.PRODUCT.UPDATE(productId),
        updatedProduct
      );

      if (response.success === true) {
        toast.success(
          isActive
            ? "Sản phẩm đã được kích hoạt bán lại"
            : "Sản phẩm đã được ngừng bán"
        );

        // Trả về dữ liệu sản phẩm đã cập nhật
        return {
          _id: productId,
          ...updatedProduct,
        };
      }

      toast.error("Không thể cập nhật trạng thái sản phẩm");
      return rejectWithValue("Không thể cập nhật trạng thái sản phẩm");
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái sản phẩm:", error);
      toast.error("Không thể cập nhật trạng thái sản phẩm");
      return rejectWithValue("Không thể cập nhật trạng thái sản phẩm");
    }
  }
);

// Xóa sản phẩm (đặt isActive = false)
export const deleteProduct = createAsyncThunk(
  "shopManager/deleteProduct",
  async (productId: string, { rejectWithValue }) => {
    try {
      // Thực hiện cập nhật trạng thái isActive = false
      const updatedProduct: Partial<ProductInput> = {
        isActive: false,
      };

      // Gửi request API để cập nhật sản phẩm
      const response = await api.put<ProductResponse>(
        ENDPOINTS.PRODUCT.UPDATE(productId),
        updatedProduct
      );

      if (response.success) {
        toast.success("Sản phẩm đã được xóa thành công");
        return {
          _id: productId,
          isActive: false,
        };
      }

      toast.error("Không thể xóa sản phẩm. Vui lòng thử lại sau.");
      return rejectWithValue("Không thể xóa sản phẩm");
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
      toast.error("Không thể xóa sản phẩm. Vui lòng thử lại sau.");
      return rejectWithValue("Không thể xóa sản phẩm");
    }
  }
);
