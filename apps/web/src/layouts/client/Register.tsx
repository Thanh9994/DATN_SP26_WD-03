'use client';

import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';
import { Header } from "./Header";
import { Footer } from "./Footer";
import "../../components/Register.css";


const Register = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const canSubmit = useMemo(() => {
    if (!fullName.trim()) return false;
    if (!isValidEmail(email.trim())) return false;
    if (password.length < 6) return false;
    if (confirmPassword !== password) return false;
    if (!agree) return false;
    return true;
  }, [fullName, email, password, confirmPassword, agree]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const name = fullName.trim();
    const mail = email.trim();

    if (!name) return setError('Vui lòng nhập họ và tên.');
    if (!isValidEmail(mail)) return setError('Email không hợp lệ.');
    if (password.length < 6) return setError('Mật khẩu tối thiểu 6 ký tự.');
    if (confirmPassword !== password) return setError('Mật khẩu nhập lại không khớp.');
    if (!agree) return setError('Bạn cần đồng ý với điều khoản để tiếp tục.');

    setLoading(true);

    setTimeout(() => {
      console.log('Register attempt:', { fullName: name, email: mail });
      setLoading(false);
      setSuccess('Đăng ký thành công! Đang chuyển sang trang đăng nhập...');

      setTimeout(() => {
        navigate('/login');
      }, 1500);
    }, 1200);
  };

  return (
    <>
      <Header />

      <div className="register-container">
        <div className="register-content">
          <div className="register-card">
            {/* Header */}
            <div className="register-header">
              <h1>Tạo tài khoản mới</h1>
              <p>Đăng ký để bắt đầu trải nghiệm điện ảnh cùng PVM Cinema</p>
            </div>

            {/* Alerts */}
            {error && (
              <div className="register-alert register-alert--error">
                <AlertCircle className="alert-icon" />
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="register-alert register-alert--success">
                <CheckCircle2 className="alert-icon" />
                <span>{success}</span>
              </div>
            )}

            {/* Form */}
            <form className="register-form" onSubmit={handleSubmit}>
              {/* Full Name */}
              <div className="form-group">
                <label htmlFor="fullName" className="form-label">
                  Họ và tên
                </label>
                <input
                  id="fullName"
                  type="text"
                  className="form-input"
                  placeholder="Nguyễn Văn A"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  autoComplete="name"
                />
              </div>

              {/* Email */}
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="form-input"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>

              {/* Password */}
              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Mật khẩu
                </label>
                <div className="password-wrapper">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    className="form-input password-input"
                    placeholder="Tối thiểu 6 ký tự"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? (
                      <EyeOff className="toggle-icon" />
                    ) : (
                      <Eye className="toggle-icon" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">
                  Nhập lại mật khẩu
                </label>
                <div className="password-wrapper">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    className="form-input password-input"
                    placeholder="Nhập lại mật khẩu"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label="Toggle confirm password visibility"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="toggle-icon" />
                    ) : (
                      <Eye className="toggle-icon" />
                    )}
                  </button>
                </div>
              </div>

              {/* Checkbox */}
              <div className="checkbox-group">
                <input
                  id="agree"
                  type="checkbox"
                  className="checkbox-input"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                />
                <label htmlFor="agree" className="checkbox-label">
                  Tôi đồng ý với{' '}
                  <Link to="/terms" className="link">
                    Điều khoản sử dụng
                  </Link>
                  {' '}và{' '}
                  <Link to="/privacy" className="link">
                    Chính sách bảo mật
                  </Link>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="register-button"
                disabled={!canSubmit || loading}
              >
                {loading ? (
                  <>
                    <span className="spinner" />
                    Đang tạo tài khoản...
                  </>
                ) : (
                  'Đăng ký'
                )}
              </button>

              {/* Login Link */}
              <div className="login-link-section">
                <p>
                  Đã có tài khoản?{' '}
                  <Link to="/login" className="link">
                    Đăng nhập ngay
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* <Footer /> */}
    </>
  );
};

export default Register;