import Button from "@web/components/tools/Button";
import AuthLayout from "@web/layouts/AuthLayout";
import { CheckCircle2, MailCheck, RefreshCw, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import { API } from "@web/api/api.service";
import { showNotify } from "@web/components/AppNotification";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const token = searchParams.get("token");

  const handleVerifyEmail = async () => {
    if (!token) {
      setLoading(false);
      setVerified(false);
      setErrorMsg("Thiếu token xác nhận email");
      showNotify("error", "Thiếu token xác nhận email");
      return;
    }

    try {
      setLoading(true);

      await axios.get(`${API.AUTH}/verify-email`, {
        params: { token },
      });

      setVerified(true);
      setErrorMsg("");
      showNotify("success", "Xác nhận email thành công");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        "Xác nhận email thất bại hoặc liên kết đã hết hạn";

      setVerified(false);
      setErrorMsg(message);
      showNotify("error", message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleVerifyEmail();
  }, []);

  return (
    <AuthLayout
      title="Verify Your Email"
      subtitle="We are confirming your email address."
      imageSrc="https://res.cloudinary.com/dcyzkqb1r/image/upload/cinema_app/1771951849120-lgon"
      lsTitle="Almost Done."
      lsSubtitle="Just verify your email to activate your account and start your movie experience."
    >
      <div className="my-5">
        <div className="space-y-6 rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
          {loading && (
            <>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/5">
                <RefreshCw size={30} className="animate-spin text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white">
                  Đang xác nhận email
                </h3>
                <p className="text-sm text-white/50">
                  Vui lòng chờ trong giây lát...
                </p>
              </div>
            </>
          )}

          {!loading && verified && (
            <>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
                <CheckCircle2 size={30} className="text-green-400" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white">
                  Xác nhận email thành công
                </h3>
                <p className="text-sm text-white/50">
                  Tài khoản của bạn đã được kích hoạt. Đang chuyển đến trang đăng
                  nhập...
                </p>
              </div>

              <Button onClick={() => navigate("/login")}>
                Đến trang đăng nhập
                <MailCheck size={18} />
              </Button>
            </>
          )}

          {!loading && !verified && (
            <>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
                <XCircle size={30} className="text-red-400" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white">
                  Xác nhận email thất bại
                </h3>
                <p className="text-sm text-red-400">
                  {errorMsg || "Liên kết xác nhận không hợp lệ hoặc đã hết hạn"}
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <Button onClick={handleVerifyEmail}>
                  Thử lại
                  <RefreshCw size={18} />
                </Button>

                <Link
                  to="/login"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Quay lại đăng nhập
                </Link>
              </div>
            </>
          )}
        </div>

        <div className="mt-12 pt-8 border-t border-white/5">
          <p className="text-white/30 text-sm text-center">
            Chưa nhận được email?{" "}
            <a href="#" className="text-primary font-bold hover:underline">
              Gửi lại email xác nhận
            </a>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default VerifyEmail;