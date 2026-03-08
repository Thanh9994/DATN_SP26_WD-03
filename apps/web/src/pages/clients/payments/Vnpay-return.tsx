// @web/pages/clients/booking/VNPayReturn.tsx
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const VNPayReturn = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );

  useEffect(() => {
    // Lấy mã phản hồi từ VNPAY
    const responseCode = searchParams.get("vnp_ResponseCode");

    if (responseCode === "00") {
      setStatus("success");
      // Bạn có thể gọi API backend tại đây để xác thực giao diện lần cuối nếu cần
    } else {
      setStatus("error");
    }
  }, [searchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      {status === "loading" && <p>Đang kiểm tra giao dịch...</p>}

      {status === "success" && (
        <div className="text-center">
          <h2 className="text-2xl font-bold text-green-600">
            Thanh toán thành công!
          </h2>
          <p>Cảm ơn bạn đã đặt vé. Kiểm tra email để nhận vé nhé. 🎟️</p>
          <button
            onClick={() => navigate("/profile/tickets")}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
          >
            Xem vé của tôi
          </button>
        </div>
      )}

      {status === "error" && (
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">
            Thanh toán thất bại!
          </h2>
          <p>Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.</p>
          <button
            onClick={() => navigate("/booking")}
            className="mt-4 bg-gray-600 text-white px-4 py-2 rounded"
          >
            Quay lại đặt vé
          </button>
        </div>
      )}
    </div>
  );
};

export default VNPayReturn;
