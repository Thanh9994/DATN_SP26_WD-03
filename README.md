# DATN_SP26_WD-03
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
main     → nhánh chính (PRODUCTION)

thanh    → branch của leader

A        → branch A

B        → branch B

C        → branch C


📌 Quy tắc bắt buộc:

Không ai được push trực tiếp lên main

Mỗi người chỉ code trên branch của mình

Chỉ leader được merge vào main
