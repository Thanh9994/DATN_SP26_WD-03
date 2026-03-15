import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Checkbox, Form, Input as AntdInput } from 'antd';
import { Lock, Mail, Phone, User, ShieldCheck, ArrowLeft, RefreshCw } from 'lucide-react';

import Button from '@web/components/tools/Button';
import Input from '@web/components/tools/Input';
import AuthLayout from '@web/layouts/AuthLayout';
import { useAuth } from '@web/hooks/useAuth';

const Register = () => {
  const navigate = useNavigate();
  const { register, verifyOtp, resendOtp, isResending, isRegistering, isVerifying } = useAuth();
  const [form] = Form.useForm();
  const [countdown, setCountdown] = useState(0);
  // --- STATE QUẢN LÝ GIAO DIỆN ---
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [termsError, setTermsError] = useState(false);

  const passwordValue = Form.useWatch('password', form) || '';

  // --- LOGIC XỬ LÝ ĐĂNG KÝ ---
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
      // Đăng ký xong, lưu email lại và chuyển sang bước OTP
      setRegisteredEmail(values.email);
      setIsOtpStep(true);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.';
      setErrorMsg(message);
    }
  };

  // --- LOGIC XỬ LÝ OTP ---
  const handleVerifyOtp = async (otp: string) => {
    try {
      await verifyOtp({ email: registeredEmail, otp });
      navigate('/login');
    } catch (err: any) {
      // Lỗi mã OTP sai đã được showNotify xử lý trong useAuth
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    try {
      await resendOtp(registeredEmail);
      setCountdown(60); // Đợi 60s mới cho bấm lại
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {}
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
    if (score <= 1) return 'bg-red-500';
    if (score <= 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const requirements = [
    { label: '8+ ký tự', met: passwordValue.length >= 8 },
    { label: 'Chữ hoa', met: /[A-Z]/.test(passwordValue) },
    { label: 'Số', met: /\d/.test(passwordValue) },
    { label: 'Ký tự đặc biệt', met: /[@$!%*?&]/.test(passwordValue) },
  ];

  return (
    <AuthLayout
      title={isOtpStep ? 'Verify Identity' : 'Create Account'}
      subtitle={
        isOtpStep
          ? `Mã xác thực đã gửi tới ${registeredEmail}`
          : 'Start your cinematic journey with us today.'
      }
      imageSrc={
        isOtpStep
          ? 'https://res.cloudinary.com/dcyzkqb1r/image/upload/cinema_app/1771951849120-lgon'
          : 'https://res.cloudinary.com/dcyzkqb1r/image/upload/cinema_app/1771986794776-register'
      }
      lsTitle={
        isOtpStep ? (
          'One Last Step.'
        ) : (
          <>
            Join the Ultimate <br /> Movie Experience
          </>
        )
      }
      lsSubtitle={
        isOtpStep
          ? 'Enter the 6-digit code to activate your account.'
          : 'Stream the latest blockbusters and book tickets for exclusive premieres at your favorite local cinemas.'
      }
    >
      {!isOtpStep ? (
        <Form
          className="space-y-3 sm:space-y-4"
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
        >
          <Form.Item name="ho_ten" rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}>
            <Input
              label="Full Name"
              type="text"
              id="name"
              placeholder="Nguyễn Văn Hoàng"
              icon={<User size={20} />}
            />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không hợp lệ' },
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
            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
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
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
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
                {requirements.map((req, index) => (
                  <div key={index} className="flex flex-col gap-1.5">
                    <div
                      className={`h-1 w-full rounded-full transition-all duration-500 ${score >= index + 1 ? getStrengthColor() : 'bg-white/10'}`}
                    />
                    <span
                      className={`text-center text-[9px] leading-tight transition-colors duration-300 ${req.met ? 'font-bold text-green-400' : 'text-white/20'}`}
                    >
                      {req.met ? '✔ ' : ''}
                      {req.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Form.Item>

          <div
            className={`space-y-2 rounded-lg p-1 transition-all ${termsError ? 'bg-red-500/5 ring-1 ring-red-500/20' : ''}`}
          >
            <div className="flex items-start gap-3">
              <Checkbox
                checked={acceptTerms}
                onChange={(e) => {
                  setAcceptTerms(e.target.checked);
                  if (e.target.checked) setTermsError(false);
                }}
              />
              <span className="text-xs leading-relaxed text-white/60">
                I have read and agree to the{' '}
                <a href="#" className="font-medium text-primary hover:underline">
                  Terms
                </a>{' '}
                and{' '}
                <a href="#" className="font-medium text-primary hover:underline">
                  Privacy Policy
                </a>
                .
              </span>
            </div>
            {termsError && (
              <p className="ml-8 animate-pulse text-[10px] font-bold uppercase text-red-400">
                * Please accept the terms to continue
              </p>
            )}
          </div>

          {errorMsg && (
            <div className="animate-shake flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-4">
              <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
              <span className="text-sm font-medium italic text-red-500">{errorMsg}</span>
            </div>
          )}

          <Button type="submit" disabled={isRegistering}>
            {isRegistering ? 'Processing...' : 'Create Account'}
          </Button>

          <div className="relative my-4 sm:my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background-dark px-4 font-bold tracking-widest text-white/30">
                Or continue with
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <Button variant="secondary" className="!py-3">
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                className="h-5 w-5"
                alt="G"
              />
              <span className="text-xs font-bold text-white/70">Google</span>
            </Button>
            <Button variant="secondary" className="!py-3">
              <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.75.9-.01 2.1-.82 3.54-.69 1.69.15 2.96.83 3.67 2.06-3.48 1.93-2.92 6.09.53 7.51-.71 1.81-1.63 3.5-2.82 4.34zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
              <span className="text-xs font-bold text-white/70">Apple</span>
            </Button>
          </div>
          <p className="mt-4 text-center text-sm font-medium text-white/40 sm:mt-8">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-primary hover:underline">
              Sign In
            </Link>
          </p>
        </Form>
      ) : (
        // --- GIAO DIỆN OTP (DÙNG CHUNG PHONG CÁCH) ---
        <div className="animate-in fade-in zoom-in space-y-6 text-center duration-300">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <ShieldCheck size={32} className="text-primary" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white">Xác thực OTP</h3>
            <p className="px-4 text-sm text-white/50">
              Chúng tôi đã gửi mã đến email của bạn. Vui lòng kiểm tra và nhập vào đây.
            </p>
          </div>

          <div className="flex justify-center py-3">
            <AntdInput.OTP
              length={6}
              size="large"
              style={{
                display: 'flex',
                gap: '10px',
              }}
              formatter={(str) => str.toUpperCase()}
              onChange={(v) => v.length === 6 && handleVerifyOtp(v)}
              disabled={isVerifying}
            />
          </div>
          <div className="mt-4 text-center">
            <p className="text-xs text-white/40">
              Không nhận được mã?{' '}
              <button
                onClick={handleResend}
                disabled={countdown > 0 || isResending}
                className={`font-bold ${countdown > 0 ? 'text-white/20' : 'text-primary hover:underline'}`}
              >
                {countdown > 0 ? `Gửi lại sau ${countdown}s` : 'Gửi lại mã ngay'}
              </button>
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Button onClick={() => {}} disabled={isVerifying}>
              {isVerifying ? <RefreshCw className="animate-spin" /> : 'Xác thực tài khoản'}
            </Button>
            <button
              onClick={() => setIsOtpStep(false)}
              className="flex items-center justify-center gap-2 text-xs text-white/30 transition-colors hover:text-white"
            >
              <ArrowLeft size={14} /> Quay lại sửa thông tin
            </button>
          </div>
        </div>
      )}
    </AuthLayout>
  );
};

export default Register;
