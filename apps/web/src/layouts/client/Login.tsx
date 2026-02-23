import { useState } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import "../../components/Login.css";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      console.log("Login attempt:", { email, password, rememberMe });
      setLoading(false);
    }, 1500);
  };

  return (
    <>
      <Header />

      <div className="login-container">
        <div
          className="login-background"
          style={{
            backgroundImage:
              "url('https://cdn.dribbble.com/userupload/10095233/file/original-82adc2e9b4a55e76fef5a580ae36b701.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="login-overlay"></div>
        </div>

        <div className="login-content">
          <div className="login-left">
            <div className="brand-section">
              <div className="brand-logo">
                <svg className="cinema-icon" viewBox="0 0 100 100" fill="none">
                  <rect width="100" height="100" rx="12" fill="#FF000D" />
                  <rect x="20" y="35" width="15" height="30" rx="3" fill="white" />
                  <rect x="42.5" y="30" width="15" height="40" rx="3" fill="white" />
                  <rect x="65" y="35" width="15" height="30" rx="3" fill="white" />
                </svg>
                <span className="brand-name">CINESTREAM</span>
              </div>
            </div>

            <div className="brand-tagline">
              <h1 className="tagline-title">YOUR FRONT ROW SEAT AWAITS.</h1>
              <p className="tagline-description">
                Stream the latest blockbusters and book tickets for the premium cinematic experience in one place.
              </p>
            </div>

            <div className="community-badge">
              <div className="badge-avatar">
                <img
                  src="https://picsum.photos/seed/user1/40/40"
                  alt="User"
                  className="avatar-img"
                />
              </div>
              <span className="badge-text">+2M Joined by movie enthusiasts worldwide</span>
            </div>
          </div>

          <div className="login-right">
            <div className="login-form-wrapper">
              <div className="login-header">
                <h2 className="login-title">Sign In</h2>
                <p className="login-subtitle">Welcome back! Please enter your details.</p>
              </div>

              <form onSubmit={handleSubmit} className="login-form">
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
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setEmail(e.target.value)
                      }
                      className="form-input"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <div className="password-header">
                    <label className="form-label">PASSWORD</label>
                    <a href="#" className="forgot-password-link">
                      FORGOT PASSWORD?
                    </a>
                  </div>

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
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setPassword(e.target.value)
                      }
                      className="form-input"
                      required
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="password-toggle"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      <svg
                        className="toggle-icon"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        {showPassword ? (
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

                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setRememberMe(e.target.checked)
                    }
                    className="custom-checkbox"
                  />
                  <label htmlFor="rememberMe" className="checkbox-label">
                    Keep me signed in
                  </label>
                </div>

                <button
                  type="submit"
                  className={`sign-in-button ${loading ? "loading" : ""}`}
                  disabled={loading}
                >
                  {loading ? "SIGNING IN..." : "SIGN IN"}
                </button>
              </form>

              <div className="divider">
                <span>OR CONTINUE WITH</span>
              </div>

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

              <div className="signup-link">
                <span>Don't have an account?</span>
                <a href="#">Create an account</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Login;