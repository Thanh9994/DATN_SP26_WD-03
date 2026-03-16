import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "@web/components/tools/Button";
import Input from "@web/components/tools/Input";
import AuthLayout from "@web/layouts/AuthLayout";
import { Lock, Mail, Phone, User } from "lucide-react";
import { useAuth } from "@web/hooks/useAuth";
import { Checkbox, Form } from "antd";

const Register = () => {
  // const navigate = useNavigate();
  const { register, isRegistering } = useAuth();
  const [form] = Form.useForm();
  const passwordValue = Form.useWatch("password", form) || "";

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [acceptTerms, setAcceptTerms] = useState(false);
  const [termsError, setTermsError] = useState(false);

  const handleSubmit = async (values: any) => {
    if (!acceptTerms) {
      setTermsError(true);
      return;
    }
    setErrorMsg(null);
    try {
       await register({
        ho_ten: values.ho_ten,
        email: values.email,
        password: values.password,
        phone: values.phone,
      });
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại.";
      setErrorMsg(message);
    }
  };

  const calculateStrength = (password: string) => {
    let score = 0;

    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[@$!%*?&]/.test(password)) score++;

    return score;
  };
  const score = calculateStrength(passwordValue);

  const getStrengthColor = () => {
    if (score <= 1) return "bg-red-500";
    if (score <= 3) return "bg-yellow-500";
    return "bg-green-500";
  };

  const requirements = [
    { label: "8+ ký tự", met: passwordValue.length >= 8 },
    { label: "Chữ hoa", met: /[A-Z]/.test(passwordValue) },
    { label: "Số", met: /\d/.test(passwordValue) },
    { label: "Ký tự đặc biệt", met: /[@$!%*?&]/.test(passwordValue) },
  ];
  return (
    <AuthLayout
      title="Create Account"
      subtitle="Start your cinematic journey with us today."
      imageSrc="https://res.cloudinary.com/dcyzkqb1r/image/upload/cinema_app/1771986794776-register"
      lsTitle={
        <>
          Join the Ultimate <br /> Movie Experience
        </>
      }
      lsSubtitle="Stream the latest blockbusters and book tickets for exclusive premieres at your favorite local cinemas."
    >
      <Form
        className="space-y-3 sm:space-y-4"
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
      >
        <Form.Item
          name="ho_ten"
          rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
        >
          <Input
            label="Full Name"
            type="text"
            id="name"
            autoComplete="name"
            placeholder="Nguyễn Văn Hoàng"
            icon={<User size={20} />}
          />
        </Form.Item>
        <Form.Item
          name="email"
          rules={[
            { required: true, message: "Vui lòng nhập email" },
            { type: "email", message: "Email không hợp lệ" },
          ]}
        >
          <Input
            label="Email Address"
            type="email"
            id="email"
            placeholder="name@company.com"
            icon={<Mail size={20} />}
          />
        </Form.Item>
        <Form.Item
          name="phone"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập số điện thoại",
            },
          ]}
        >
          <Input
            label="Phone Number"
            type="phone"
            id="phone"
            placeholder="+84 or 09********"
            icon={<Phone size={20} />}
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
        >
          <div className="space-y-1.5 sm:space-y-2">
            <Input
              label="Password"
              type="password"
              id="password"
              placeholder="Password"
              icon={<Lock size={20} />}
            />

            <div className="grid grid-cols-4 gap-1.5 px-1">
              {requirements.map((req, index) => {
                const isMet = req.met;
                const step = index + 1;
                return (
                  <div key={index} className="flex flex-col gap-1.5">
                    {/* Thanh màu */}
                    <div
                      className={`h-1 w-full rounded-full transition-all duration-500 ${
                        score >= step ? getStrengthColor() : "bg-white/10"
                      }`}
                    />
                    {/* Chữ nhỏ dưới mỗi thanh */}
                    <span
                      className={`text-[9px] text-center leading-tight transition-colors duration-300 ${
                        isMet ? "text-green-400 font-bold" : "text-white/20"
                      }`}
                    >
                      {isMet ? "✔ " : ""}
                      {req.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </Form.Item>
        <div
          className={`space-y-2 p-1 rounded-lg transition-all ${termsError ? "bg-red-500/5 ring-1 ring-red-500/20" : ""}`}
        >
          <div className="flex items-start gap-3">
            <Checkbox
              checked={acceptTerms}
              onChange={(e) => {
                setAcceptTerms(e.target.checked);
                if (e.target.checked) setTermsError(false);
              }}
            />
            <span className="text-xs text-white/60 leading-relaxed">
              I have read and agree to the{" "}
              <a href="#" className="text-primary hover:underline font-medium">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-primary hover:underline font-medium">
                Privacy Policy
              </a>
              .
            </span>
          </div>

          {/* Thông báo nhắc nhở nhỏ xíu nếu họ quên tích */}
          {termsError && (
            <p className="text-[10px] text-red-400 font-bold uppercase tracking-tighter animate-pulse ml-8">
              * Please accept the terms to continue
            </p>
          )}
        </div>

        {errorMsg && (
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl p-4 animate-shake">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-red-500 text-sm font-medium italic">
              {errorMsg}
            </span>
          </div>
        )}

        <Button type="submit" disabled={isRegistering}>
          {isRegistering ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Processing...
            </div>
          ) : (
            "Create Account"
          )}
        </Button>
      </Form>

      <div className="relative my-4 sm:my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background-dark px-4 text-white/30 font-bold tracking-widest">
            Or continue with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <Button variant="secondary" className="!py-3">
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            className="w-5 h-5"
            alt="Google"
          />
          <span className="text-xs font-bold text-white/70">Google</span>
        </Button>
        <Button variant="secondary" className="!py-3">
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.75.9-.01 2.1-.82 3.54-.69 1.69.15 2.96.83 3.67 2.06-3.48 1.93-2.92 6.09.53 7.51-.71 1.81-1.63 3.5-2.82 4.34zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
          </svg>
          <span className="text-xs font-bold text-white/70">Apple</span>
        </Button>
      </div>

      <p className="mt-4 sm:mt-8 text-center text-sm text-white/40 font-medium">
        Already have an account?{" "}
        <Link to="/login" className="text-primary font-bold hover:underline">
          Sign In
        </Link>
      </p>
    </AuthLayout>
  );
};
export default Register;
