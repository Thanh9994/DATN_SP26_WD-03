import Button from "@web/components/tools/Button";
import Input from "@web/components/tools/Input";
import AuthLayout from "@web/layouts/AuthLayout";
import { Lock, RefreshCw } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { API } from "@web/api/api.service";
import { showNotify } from "@web/components/AppNotification";

const ResetPassword = () => {
  const { token } = useParams();
  const Navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      showNotify("error", "Vui lòng nhập đầy đủ mật khẩu");
      return;
    }

    if (password !== confirmPassword) {
      showNotify("error", "Mật khẩu không khớp");
      return;
    }

    try {
      setLoading(true);

      await axios.post(`${API.AUTH}/reset-password/${token}`, {
        password,
      });

      showNotify("success", "Đổi mật khẩu thành công");
      Navigate("/");
    } catch (error: any) {
      showNotify("error", error?.response?.data?.message || "Reset thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Reset Your Password"
      subtitle="Enter your new password below."
      imageSrc="https://res.cloudinary.com/dcyzkqb1r/image/upload/cinema_app/1771951849120-lgon"
      lsTitle="You're Almost There."
      lsSubtitle="Just one more step to get back to your movie experience."
    >
      <div className="my-5">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <Input
            label="New Password"
            type="password"
            id="password"
            placeholder="Enter new password"
            icon={<Lock size={20} />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Input
            label="Confirm Password"
            type="password"
            id="confirmPassword"
            placeholder="Re-enter password"
            icon={<Lock size={20} />}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <Button type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update Password"}
            <RefreshCw size={20} />
          </Button>
        </form>
        <div className="mt-12 pt-8 border-t border-white/5">
          <p className="text-white/30 text-sm text-center">
            Still having trouble?{" "}
            <a href="#" className="text-primary font-bold hover:underline">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default ResetPassword;
