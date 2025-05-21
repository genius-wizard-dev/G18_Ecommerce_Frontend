import { AttributeRecord, ProductCategory } from "@/schema/product";
import { toast } from "sonner";

/**
 * Xác thực dữ liệu sản phẩm trước khi gửi lên server
 */
export const validateProductData = (
  name: string,
  price: number,
  quantity: number,
  category: string,
  thumbnailFile: File | null,
  isEditing: boolean
): boolean => {
  if (isNaN(price) || price < 0) {
    toast.error("Giá phải là một số không âm.");
    return false;
  }

  if (isNaN(quantity) || quantity < 0) {
    toast.error("Số lượng phải là một số không âm.");
    return false;
  }

  if (!name.trim()) {
    toast.error("Tên sản phẩm không được để trống.");
    return false;
  }

  if (!category) {
    toast.error("Vui lòng chọn loại sản phẩm.");
    return false;
  }

  // Khi thêm mới sản phẩm phải có hình đại diện
  if (!isEditing && !thumbnailFile) {
    toast.error("Vui lòng chọn hình ảnh đại diện.");
    return false;
  }

  return true;
};

/**
 * Tạo dữ liệu sản phẩm để gửi lên server
 */
export const prepareProductData = (
  name: string,
  price: number,
  category: string,
  description: string,
  attributes: AttributeRecord,
  tags: string[],
  shopId: string,
  thumbnailFile: File | null,
  imageFiles: File[]
): any => {
  const categoryEnum = category as keyof typeof ProductCategory;

  const productData: any = {
    name,
    price,
    category: ProductCategory[categoryEnum],
    description: description || "",
    attribute: attributes,
    shopId,
    isActive: true,
    tags,
  };

  // Thêm các hình ảnh nếu có
  if (thumbnailFile) {
    productData.thumbnailFile = thumbnailFile;
  }

  if (imageFiles.length > 0) {
    productData.imageFiles = imageFiles;
  }

  return productData;
};
