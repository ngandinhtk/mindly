# Mindly

Mindly là ứng dụng nhật ký cảm xúc giúp người dùng ghi lại tâm trạng, viết ghi chú và theo dõi xu hướng cảm xúc hằng ngày.

## Tính năng

- Ghi nhận cảm xúc tối đa hai lần mỗi ngày.
- Thêm ghi chú cho mỗi lần check-in.
- Xem lịch sử cảm xúc theo ngày và theo tuần.
- Xem thống kê cảm xúc và xu hướng tổng quan.
- Quản lý ghi chú: thêm, ghim và xóa ghi chú.
- Xuất báo cáo thống kê ra PDF.
- Câu hỏi Daily Reflection thay đổi theo từng ngày.
- Lưu câu trả lời suy ngẫm riêng theo từng ngày.
- Nhắc nhở check-in theo giờ tùy chọn.
- Hỗ trợ tiếng Việt và tiếng Anh.
- Giao diện responsive cho máy tính và điện thoại.

## Công nghệ

- React 17
- TypeScript và JavaScript
- React Router
- Tailwind CSS
- i18next
- Lucide React
- jsPDF và html2canvas

## Yêu cầu

- Node.js 16 trở lên
- npm

## Cài đặt

```bash
npm install
```

## Chạy ở môi trường phát triển

```bash
npm start
```

Sau đó mở [http://localhost:3000](http://localhost:3000).

## Build production

```bash
npm run build
```

Build output được tạo trong thư mục `build/`.

## Deploy GitHub Pages

```bash
npm run deploy
```

## Nhắc nhở check-in

Tính năng nhắc nhở sử dụng Browser Notification API. Người dùng cần:

1. Mở ứng dụng bằng trình duyệt hỗ trợ notification.
2. Cho phép Mindly hiển thị thông báo.
3. Vào trang Hồ sơ và bật nhắc nhở.
4. Chọn thời gian muốn nhận thông báo.

Cấu hình và dữ liệu cá nhân được lưu trong `localStorage` của trình duyệt. Thông báo được kiểm tra khi ứng dụng đang mở trong trình duyệt.

## Cấu trúc chính

```text
src/
  components/   Giao diện và các trang của ứng dụng
  data/         Dữ liệu cảm xúc, hoạt động và trích dẫn
  locales/      Bản dịch tiếng Việt và tiếng Anh
  styles/       CSS và Tailwind entry point
  App.tsx       Root application component
  index.tsx     Application entry point
```

## Scripts

| Lệnh | Mô tả |
| --- | --- |
| `npm start` | Chạy development server |
| `npm run build` | Tạo production build |
| `npm test` | Chạy test của Create React App |
| `npm run deploy` | Build và deploy lên GitHub Pages |

## License

Chưa thiết lập license cho project.
