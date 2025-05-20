import { CLOUDINARY_CONFIG, getCloudinaryImageUrl } from "./cloudinary.config";

export const getImageUrl = (publicId: string) => {
  // Kiểm tra nếu publicId đã có http hoặc https thì trả về nguyên bản
  if (
    !publicId ||
    publicId.startsWith("http://") ||
    publicId.startsWith("https://")
  ) {
    return publicId;
  }
  // Nếu không có http/https thì mới thêm vào
  return getCloudinaryImageUrl(CLOUDINARY_CONFIG.cloudName, publicId);
};
