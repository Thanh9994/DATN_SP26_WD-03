# Luồng chạy dự án (Tổng quan)

## 1) Kiến trúc tổng thể

- Monorepo với `turbo`, gồm 2 app chính: `apps/api` và `apps/web`
- Thư viện dùng chung: `packages/shared` (schema, types)
- Giao tiếp Web <-> API qua REST (`/api/...`)

## 2) Luồng khởi chạy

### Backend (API)

1. `apps/api/src/index.ts`:
   - Load biến môi trường
   - Kết nối MongoDB (`connectDB`)
   - Khởi động Express (`app.listen`)
   - Gọi `initAllCrons()` khi server ready
2. `apps/api/src/app.ts`:
   - Cấu hình `express`, `cors`, `compression`, `morgan` (dev)
   - Mount routes dưới `/api`:
     - `/api/access`
     - `/api/catalog`
     - `/api/content`
     - `/api/order`
     - `/api/admin`
     - `/api/chatbot`
   - Các route đặc biệt:
     - `/api/uploads` (upload)
     - `/payments` (payment)
3. Các cron tiêu biểu:
   - Cleanup booking/payment, cập nhật trạng thái showtime, log cleanup

### Frontend (Web)

1. `apps/web/src/main.tsx`:
   - Khởi tạo React + `BrowserRouter`
   - Setup `QueryClientProvider` (React Query)
2. `apps/web/src/App.tsx`:
   - Ghép route `ClientRoutes` + `AdminRoutes`
   - Hiển thị `AppNotification`
   - Hiển thị Splash ở trang `/`

## 3) Luồng nghiệp vụ chính

### A. Danh mục phim & suất chiếu

- Web gọi API:
  - Movie list: `/api/content/...`
  - Showtime list: `/api/catalog/showtimes`
- Admin tạo suất chiếu:
  - `POST /api/catalog/showtimes`
  - Backend tạo showtime + generate seat map

### B. Đặt vé

- Web chọn suất chiếu -> giữ ghế (hold)
- API cập nhật ghế giữ/trả (`/api/catalog/showtimes/:id/hold-seats`, `release-seats`)
- Thanh toán:
  - `POST /payments` -> xác nhận trạng thái thanh toán
  - Booking cập nhật `paid/cancelled/expired`

### C. Bình luận & đánh giá

- Web gửi comment -> API tạo comment
- API tăng `danh_gia` của movie

### D. Admin Dashboard

- Admin xem log cleanup
- Đếm log chưa đọc + mark-read thủ công

## 4) Điểm liên kết quan trọng

- `packages/shared/schemas`: schema chung (\_id là chuẩn chính)
- Web hooks gọi API: `apps/web/src/hooks/*`
- Tích hợp seat map: `apps/web/src/components/skeleton/SeatMap.tsx`
