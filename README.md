# 🎬 Movie Booking System - Graduation Project (DATN_SP26_WD-03)

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

---

## 🌟 Giới thiệu Dự án

Hệ thống đặt vé xem phim trực tuyến hiện đại, hỗ trợ quản lý rạp, đặt ghế thời gian thực và tích hợp thanh toán. Dự án được xây dựng với kiến trúc **Monorepo** giúp tối ưu hóa việc chia sẻ code giữa Frontend và Backend.

> **Trạng thái:** Đang trong quá trình hoàn thiện (DATN 2026) 🚀

---

## ✨ Tính năng nổi bật

### 👤 Cho Khách hàng

- [x] **Đặt vé thông minh:** Chọn ghế trực quan, hỗ trợ giữ ghế (Hold) trong 5 phút.
- [x] **Tìm kiếm & Lọc:** Lọc phim theo thể loại, ngày chiếu và rạp.
- [x] **Trang cá nhân:** Quản lý lịch sử đặt vé và thông tin cá nhân.
- [x] **Thông báo:** Gửi mail xác nhận đặt vé thành công.

### 🛡️ Cho Quản trị viên (Admin)

- [x] **Dashboard:** Thống kê doanh thu, số lượng vé bán ra bằng biểu đồ.
- [x] **Quản lý Phim:** Thêm/Sửa/Xóa phim, tự động upload ảnh lên Cloudinary.
- [x] **Quản lý Suất chiếu:** Sắp xếp lịch chiếu linh hoạt, tránh trùng lặp phòng.
- [x] **Quản lý Rạp:** Tùy chỉnh sơ đồ ghế ngồi cho từng loại phòng chiếu.

---

## 🏗️ Kiến trúc Hệ thống (Tech Stack)

### Frontend (`apps/web`)

- **Framework:** React 19 + Vite
- **UI Library:** Ant Design (Antd)
- **State Management:** TanStack Query (React Query)
- **Styling:** Tailwind CSS / SCSS

### Backend (`apps/api`)

- **Runtime:** Node.js (Express)
- **Language:** TypeScript
- **Database:** MongoDB (Mongoose)
- **Automation:** Cron Jobs (Tự động giải phóng ghế)
- **Storage:** Cloudinary API

### Shared (`packages/shared`)

- Chứa các `Interfaces`, `Zod Schemas` và `Constants` dùng chung cho cả 2 phía để đảm bảo Type-safe.

---

## 📂 Cấu trúc thư mục (Monorepo)

```text
.
├── apps/
│   ├── web/                # React Frontend
│   └── api/                # Express Backend
├── packages/
│   └── shared/             # Code dùng chung (Types, Utils)
├── .prettierrc             # Cấu hình format code
├── package.json            # npm Workspaces config
└── README.md

WEB vé xem phim

👨‍💻 Quy trình làm việc cho thành viên

Khi tải base Mọi người gõ lên terminal câu lệnh này lên nhé

git clone https://github.com/Thanh9994/DATN_SP26_WD-03.git

1️⃣ Lấy code mới nhất từ main

git checkout a

git pull origin main

2️⃣ Code & commit

git add .

git commit -m "[AN] feat: login UI"

git push origin an

📌 Commit message nên có prefix tên để leader dễ review.

🧱 Cấu trúc branch
main → nhánh chính (PRODUCTION)

thanh → branch của leader

A → branch A

B → branch B

C → branch C

📌 Quy tắc bắt buộc:

Không ai được push trực tiếp lên main

Mỗi người chỉ code trên branch của mình

Chỉ leader được merge vào main
```
