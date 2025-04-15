# Hướng dẫn tạo UI với Copilot

## Công nghệ & Thư viện BẮT BUỘC

- **React + TypeScript** cho toàn bộ UI.
- **shadcn/ui**: Luôn ưu tiên dùng cho mọi thành phần UI (Button, Input, Modal, Table, Card, Avatar, Toast, Tabs, Select, Pagination, Spinner, Breadcrumb, List, Dropdown...).
- **tailwindcss**: Dùng cho layout, spacing, màu sắc, font, responsive, hiệu ứng CSS, dark/light theme.
- **react-icons**: Thêm icon cho button, input, navigation, breadcrumb, v.v.
- **gsap**: Animation mượt mà (hover, chuyển cảnh, modal, toast, tab, slider...).
- **zod** (kết hợp react-hook-form nếu cần): Validate form, input, select, hiển thị lỗi rõ ràng.

## Quy tắc code UI CHUẨN

- **Chia nhỏ component**: Mỗi component 1 nhiệm vụ, code ngắn gọn, dễ đọc, dễ tái sử dụng.
- **Đặt tên rõ ràng**: Tên biến, props, component nhất quán, mô tả đúng chức năng.
- **Responsive**: Luôn dùng class tailwind (`sm:`, `md:`, `lg:`, `xl:`) để UI đẹp trên mọi thiết bị.
- **Accessibility**: Thêm `aria-label`, `role`, focus ring, tab index cho thành phần tương tác.
- **Theme**: Hỗ trợ dark/light mode với tailwind và shadcn/ui.
- **Layout**: Dùng flex, grid của tailwind để căn chỉnh, sắp xếp component.

## Hướng dẫn từng thành phần UI

- **Form**: Dùng Input, Select, Checkbox, Radio của shadcn/ui. Validate với zod, hiển thị lỗi rõ ràng, dùng react-hook-form nếu cần.
- **Button**: Dùng Button của shadcn/ui, thêm icon với react-icons nếu phù hợp.
- **Modal, Dropdown, Toast**: Dùng component của shadcn/ui, thêm animation với gsap.
- **Navigation/Sidebar**: Responsive, có hamburger menu cho mobile, dùng shadcn/ui.
- **Table**: Dùng Table của shadcn/ui, responsive, scroll ngang trên mobile.
- **Card**: Dùng Card của shadcn/ui, thêm shadow, border, hover effect với tailwind.
- **List**: Dùng List của shadcn/ui hoặc custom với tailwind.
- **Avatar**: Dùng Avatar của shadcn/ui, có fallback nếu không có ảnh.
- **Breadcrumb**: Dùng Breadcrumb của shadcn/ui, thêm icon nếu phù hợp.
- **Pagination**: Dùng Pagination của shadcn/ui, responsive.
- **Tabs**: Dùng Tabs của shadcn/ui, thêm animation chuyển tab với gsap nếu cần.
- **Select**: Dùng Select của shadcn/ui, validate với zod nếu là form.
- **Slider/Carousel**: Dùng component phù hợp, thêm animation với gsap.
- **Search bar**: Dùng Input của shadcn/ui, thêm icon search với react-icons.
- **Loading**: Dùng Spinner của shadcn/ui hoặc custom với tailwind/gsap.
- **Notification/Toast**: Dùng Toast của shadcn/ui, có thể thêm animation với gsap.

## Lưu ý BẮT BUỘC

- Luôn kiểm tra accessibility cho mọi thành phần.
- Ưu tiên gsap cho animation phức tạp, tailwind transition cho hiệu ứng đơn giản.
- Không lặp lại code, tái sử dụng component tối đa.
- Đảm bảo UI hiện đại, đẹp, dễ maintain, dễ mở rộng, chuẩn best practice.
- Không tự tạo component khi đã có sẵn trong shadcn/ui.
- Khi tạo mới component, phải giải thích rõ lý do và đảm bảo tuân thủ các quy tắc trên.
