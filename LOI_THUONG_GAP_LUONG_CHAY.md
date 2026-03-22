# Các lỗi thường gặp theo luồng chạy

## 1) API không chạy / không kết nối DB

- Nguyên nhân:
  - Thiếu biến môi trường DB
  - Sai URL kết nối MongoDB
- Dấu hiệu:
  - Server không listen
  - Log lỗi ở `connectDB`

## 2) Web không hiển thị dữ liệu

- Nguyên nhân:
  - API chưa chạy hoặc sai base URL
  - Query không được invalidate sau mutation
- Cách kiểm tra:
  - Devtools -> Network
  - Console lỗi CORS

## 3) Showtime không cập nhật trạng thái

- Nguyên nhân:
  - Cron chưa chạy
  - Logic status không ưu tiên `sold_out`
- Cách kiểm tra:
  - Log cron
  - Kiểm tra số ghế `booked`

## 4) Ghế không giữ được hoặc không trả lại

- Nguyên nhân:
  - Mutation giữ ghế fail
  - Timeout cleanup chưa chạy
- Dấu hiệu:
  - Ghế stuck ở trạng thái `hold`

## 5) `showtimeCount` ở admin movie không đổi

- Nguyên nhân:
  - API không aggregate đúng
  - Client không invalidate query `movies`
- Cách kiểm tra:
  - Check response API `/movies`
  - Kiểm tra `invalidateQueries(['movies'])`

## 6) Lỗi _id / id không đồng bộ

- Nguyên nhân:
  - FE đang dùng `id` nhưng BE trả `_id`
- Cách xử lý:
  - Chuẩn hóa `_id` ngay tại hook/service
  - Dùng một nguồn interface từ `@shared/schemas`
