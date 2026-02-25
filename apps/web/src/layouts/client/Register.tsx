import { useState, FormEvent, ChangeEvent } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import "../../components/Register.css";
interface RegisterFormState {
  email: string;
  password: string;
  confirmPassword: string;
  showPassword: boolean;
  showConfirmPassword: boolean;
  agreeTerms: boolean;
  loading: boolean;
  error: string;
}

const Register = (): JSX.Element => {
  const [formState, setFormState] = useState<RegisterFormState>({
    email: "",
    password: "",
    confirmPassword: "",
    showPassword: false,
    showConfirmPassword: false,
    agreeTerms: false,
    loading: false,
    error: "",
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value, type, checked } = e.currentTarget;
    setFormState((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      error: "", // Clear error when user starts typing
    }));
  };

  const handleTogglePassword = (field: "password" | "confirmPassword"): void => {
    if (field === "password") {
      setFormState((prev) => ({
        ...prev,
        showPassword: !prev.showPassword,
      }));
    } else {
      setFormState((prev) => ({
        ...prev,
        showConfirmPassword: !prev.showConfirmPassword,
      }));
    }
  };

  const validateForm = (): boolean => {
    if (formState.password !== formState.confirmPassword) {
      setFormState((prev) => ({
        ...prev,
        error: "Passwords do not match",
      }));
      return false;
    }

    if (formState.password.length < 8) {
      setFormState((prev) => ({
        ...prev,
        error: "Password must be at least 8 characters",
      }));
      return false;
    }

    if (!formState.agreeTerms) {
      setFormState((prev) => ({
        ...prev,
        error: "You must agree to the terms and conditions",
      }));
      return false;
    }

    return true;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setFormState((prev) => ({
      ...prev,
      loading: true,
    }));

    setTimeout(() => {
      console.log("Register attempt:", {
        email: formState.email,
        password: formState.password,
      });
      setFormState((prev) => ({
        ...prev,
        loading: false,
      }));
    }, 1500);
  };

  return (
    <>
      <Header />

      <div className="register-container">
        {/* Background Image */}
        <div
          className="register-background"
          style={{
            backgroundImage:
              "url('https://cdn.dribbble.com/userupload/10095233/file/original-82adc2e9b4a55e76fef5a580ae36b701.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="register-overlay"></div>
        </div>

        {/* Content */}
        <div className="register-content">
          {/* Left Section */}
          <div className="register-left">
            <div className="brand-section">
              <div className="brand-logo">
                <svg className="cinema-icon" viewBox="0 0 100 100" fill="none">
                  <rect width="100" height="100" rx="12" fill="#FF000D" />
                  <rect x="20" y="35" width="15" height="30" rx="3" fill="white" />
                  <rect
                    x="42.5"
                    y="30"
                    width="15"
                    height="40"
                    rx="3"
                    fill="white"
                  />
                  <rect x="65" y="35" width="15" height="30" rx="3" fill="white" />
                </svg>
                <span className="brand-name">CINESTREAM</span>
              </div>
            </div>

            <div className="brand-tagline">
              <h1 className="tagline-title">JOIN THE CINEMA REVOLUTION.</h1>
              <p className="tagline-description">
                Create your account and unlock access to thousands of movies,
                exclusive deals, and premium cinematic experiences.
              </p>
            </div>

            <div className="community-badge">
              <div className="badge-avatar">
                <img
                  src="https://picsum.photos/seed/user2/40/40"
                  alt="User"
                  className="avatar-img"
                />
              </div>
              <span className="badge-text">+2M movie lovers already joined</span>
            </div>
          </div>

          {/* Right Section - Register Form */}
          <div className="register-right">
            <div className="register-form-wrapper">
              <div className="register-header">
                <h2 className="register-title">Create Account</h2>
                <p className="register-subtitle">Start your movie journey today.</p>
              </div>

              {formState.error && (
                <div className="error-message">{formState.error}</div>
              )}

              <form onSubmit={handleSubmit} className="register-form">
                {/* Email Field */}
                <div className="form-group">
                  <label className="form-label">EMAIL ADDRESS</label>
                  <div className="input-wrapper">
                    <svg
                      className="input-icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                    <input
                      type="email"
                      name="email"
                      placeholder="name@example.com"
                      value={formState.email}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="form-group">
                  <label className="form-label">PASSWORD</label>
                  <div className="input-wrapper">
                    <svg
                      className="input-icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    <input
                      type={formState.showPassword ? "text" : "password"}
                      name="password"
                      placeholder="••••••••"
                      value={formState.password}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => handleTogglePassword("password")}
                      className="password-toggle"
                    >
                      <svg
                        className="toggle-icon"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        {formState.showPassword ? (
                          <>
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </>
                        ) : (
                          <>
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                            <line x1="1" y1="1" x2="23" y2="23" />
                          </>
                        )}
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div className="form-group">
                  <label className="form-label">CONFIRM PASSWORD</label>
                  <div className="input-wrapper">
                    <svg
                      className="input-icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    <input
                      type={formState.showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="••••••••"
                      value={formState.confirmPassword}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => handleTogglePassword("confirmPassword")}
                      className="password-toggle"
                    >
                      <svg
                        className="toggle-icon"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        {formState.showConfirmPassword ? (
                          <>
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </>
                        ) : (
                          <>
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                            <line x1="1" y1="1" x2="23" y2="23" />
                          </>
                        )}
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Terms & Conditions */}
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="agreeTerms"
                    name="agreeTerms"
                    checked={formState.agreeTerms}
                    onChange={handleInputChange}
                    className="custom-checkbox"
                  />
                  <label htmlFor="agreeTerms" className="checkbox-label">
                    I agree to the <a href="#">Terms & Conditions</a>
                  </label>
                </div>

                {/* Sign Up Button */}
                <button
                  type="submit"
                  className={`sign-up-button ${formState.loading ? "loading" : ""}`}
                  disabled={formState.loading}
                >
                  {formState.loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
                </button>
              </form>

              {/* Divider */}
              <div className="divider">
                <span>OR CONTINUE WITH</span>
              </div>

              {/* Social Login */}
              <div className="social-login">
                <button type="button" className="social-button google">
                  <svg className="social-icon" viewBox="0 0 24 24">
                    <text
                      x="50%"
                      y="50%"
                      dominantBaseline="middle"
                      textAnchor="middle"
                      fontSize="16"
                      fontWeight="bold"
                      fill="white"
                    >
                      G
                    </text>
                  </svg>
                  <span>Google</span>
                </button>
                <button type="button" className="social-button apple">
                  <svg className="social-icon" viewBox="0 0 24 24" fill="white">
                    <path d="M18.71 19.71a6 6 0 0 1-9.52-7.34 6 6 0 1 1 9.52 7.34zm-12-12a8 8 0 1 0 16 0 8 8 0 0 0-16 0z" />
                  </svg>
                  <span>Apple ID</span>
                </button>
              </div>

              {/* Sign In Link */}
              <div className="signin-link">
                <span>Already have an account?</span>
                <a href="#">Sign in</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Register;