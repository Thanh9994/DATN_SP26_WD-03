# Phân tích luồng chạy (Chi tiết)

## 1) Luồng khởi tạo hệ thống

### Backend

- `index.ts`:
  - Load `.env`
  - `connectDB()` -> nếu fail thì dừng tiến trình
  - `initAllCrons()` được gọi khi server lắng nghe cổng
- `app.ts`:
  - Middleware: `cors`, `compression`, `morgan` (dev)
  - Router chính dưới `/api`
  - Error handling ở cuối (`globalErrorHandler`)

### Frontend

- `main.tsx`:
  - `QueryClientProvider` bảo đảm cache & refetch dữ liệu
  - `BrowserRouter` cho routing client
- `App.tsx`:
  - `useRoutes` ghép `ClientRoutes` + `AdminRoutes`
  - `AppNotification` hiển thị thông báo toàn cục

## 2) Luồng dữ liệu từ Web -> API

1. Component gọi hook (React Query)
2. Hook gọi API bằng `axios`
3. API trả JSON
4. Hook trả `data` cho UI
5. Mutation thành công -> invalidate query liên quan

Ví dụ:

- Admin tạo showtime -> invalidate `showtimes`, `dashboard-showtimes`, `movies`
- Movie list cần `showtimeCount` -> API aggregate từ ShowTime

## 3) Luồng đặt vé (Booking)

1. Chọn suất chiếu
2. Giữ ghế (hold):
   - API cập nhật seat `hold`
3. Thanh toán:
   - Payment callback -> cập nhật booking `paid`
4. Nếu timeout hoặc fail -> cron cleanup

## 4) Luồng cập nhật trạng thái showtime

- `CalculateShowTimeStatus()` xác định theo thời gian
- Khi all seats `booked` -> status `sold_out`
- Trạng thái `cancelled` ưu tiên cao nhất

## 5) Luồng log cleanup

- Cron chạy định kỳ
- Lưu log cleanup
- Admin đọc log và mark-read thủ công

## 6) Test case nhanh (tham khảo)

### A. Tạo suất chiếu

- Kỳ vọng: showtime được tạo, seat map được sinh
- UI: danh sách showtime cập nhật ngay

### B. Đặt vé

- Kỳ vọng: ghế chuyển trạng thái `hold` -> `booked`
- Thanh toán fail -> ghế được trả lại

### C. Sold out

- Khi tất cả ghế `booked` -> status `sold_out`
- UI admin/khách hiển thị đúng trạng thái

### D. Log cleanup

- Cron chạy -> tạo log
- Header admin hiển thị badge + dropdown log
