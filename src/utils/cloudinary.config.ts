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
 *    - Lưu ý đặt "Signing Mode" là "Unsigned" nếu bạn muốn upload trực tiếp từ client
 */

export interface CloudinaryConfig {
  cloudName: string;
  uploadPreset: string;
  folder?: string; // Tùy chọn: thư mục lưu trữ
  cropping?: boolean; // Tùy chọn: cho phép cắt ảnh
  multiple?: boolean; // Tùy chọn: cho phép tải nhiều ảnh
  // Thêm các tùy chọn khác nếu cần
}

/**
 * Ví dụ cấu hình Cloudinary
 */
export const CLOUDINARY_CONFIG: CloudinaryConfig = {
  cloudName: "dxv7grpa8",
  uploadPreset: "ml_default",
  folder: "g18_ecommerce",
  cropping: true,
  multiple: true,
};

export const getCloudinaryImageUrl = (
  cloudName: string,
  publicId: string,
  transformations: string = ""
): string => {
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformations}${publicId}`;
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
