// Hướng dẫn cấu hình Cloudinary cho ứng dụng

/**
 * THIẾT LẬP CLOUDINARY
 *
 * 1. Đăng ký tài khoản tại https://cloudinary.com
 * 2. Lấy các thông tin cần thiết trong dashboard:
 *    - Cloudinary Name (cloudName)
 *    - API Key
 *    - API Secret
 *
 * 3. Tạo Upload Preset:
 *    - Truy cập vào Settings > Upload trong Dashboard
 *    - Trong mục "Upload presets", tạo một preset mới
 *    - Đặt "Upload preset name" và cấu hình các tùy chọn khác
 *    - LƯU Ý QUAN TRỌNG: Đặt "Signing Mode" là "Unsigned" và đảm bảo preset được whitelist cho unsigned uploads
 */

export interface CloudinaryConfig {
  cloudName: string;
  uploadPreset: string;
  folder?: string; // Tùy chọn: thư mục lưu trữ
}

/**
 * Ví dụ cấu hình Cloudinary
 */
export const CLOUDINARY_CONFIG: CloudinaryConfig = {
  cloudName: "dxv7grpa8",
  uploadPreset: "g18_ecommerce_unsigned",
  folder: "g18_ecommerce",
};

export const getCloudinaryImageUrl = (
  cloudName: string,
  publicId: string,
  transformations: string = ""
): string => {
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformations}${publicId}`;
};

// Hàm upload file lên Cloudinary
export const uploadToCloudinary = async (
  file: File,
  config: CloudinaryConfig
): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", config.uploadPreset);
  if (config.folder) {
    formData.append("folder", config.folder);
  }

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${config.cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.public_id;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw error;
  }
};

// Hàm upload nhiều file lên Cloudinary
export const uploadMultipleToCloudinary = async (
  files: File[],
  config: CloudinaryConfig
): Promise<string[]> => {
  const uploadPromises = files.map((file) => uploadToCloudinary(file, config));
  return Promise.all(uploadPromises);
};

/**
 * TÍCH HỢP VÀO DỰ ÁN
 *
 * 1. Thêm script Cloudinary vào file HTML (thường là index.html):
 *    <script src="https://upload-widget.cloudinary.com/global/all.js" type="text/javascript"></script>
 *
 * 2. Sử dụng component CloudinaryUploadWidget:
 *    import CloudinaryUploadWidget from './utils/upload.images.tsx';
 *    import { CLOUDINARY_CONFIG } from './utils/cloudinary.config';
 *
 *    const YourComponent = () => {
 *      const [publicId, setPublicId] = useState('');
 *
 *      return (
 *        <CloudinaryUploadWidget
 *          uwConfig={CLOUDINARY_CONFIG}
 *          setPublicId={setPublicId}
 *        />
 *      );
 *    };
 */
