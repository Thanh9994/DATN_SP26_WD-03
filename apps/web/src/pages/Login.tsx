import Button from "@web/components/Button";
import Input from "@web/components/Input";
import { useAuth } from "@web/hooks/useAuth";
import AuthLayout from "@web/layouts/AuthLayout";
import { Lock, Mail } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoggingIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login({ email, password });
      // console.log(token);
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AuthLayout
      title="Sign In"
      subtitle="Welcome back! Please enter your details."
      imageSrc="https://res.cloudinary.com/dcyzkqb1r/image/upload/cinema_app/1771951849120-lgon"
      lsTitle={
        <>
          Your Front Row <br />
          Seat Awaits.
        </>
      }
      lsSubtitle="Stream the latest blockbusters and book tickets for the premium cinematic experience in one place."
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        <Input
          label="Email Address"
          type="email"
          id="email"
          placeholder="name@example.com"
          icon={<Mail size={20} />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="block text-xs font-bold text-white/40 uppercase tracking-widest">
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-xs font-bold text-primary hover:text-primary/80 transition-colors uppercase tracking-widest"
            >
              Forgot Password?
            </Link>
          </div>
          <Input
            label=""
            type="password"
            id="password"
            placeholder="••••••••"
            icon={<Lock size={20} />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 py-2">
          <input
            type="checkbox"
            id="remember"
            className="w-5 h-5 rounded border-white/10 bg-white/5 text-primary focus:ring-offset-background-dark focus:ring-primary transition-all cursor-pointer"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />
          <label
            htmlFor="remember"
            className="text-sm text-white/60 cursor-pointer select-none font-medium"
          >
            Keep me signed in
          </label>
        </div>

        <Button type="submit" disabled={isLoggingIn}>
          {isLoggingIn ? "Signing In..." : "Sign In"}
        </Button>
      </form>

      <div className="relative my-10">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background-dark px-4 text-white/30 font-bold tracking-widest">
            Or continue with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button variant="secondary" className="!py-3.5">
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            className="w-5 h-5"
            alt="Google"
          />
          <span className="text-sm font-bold text-white/80">Google</span>
        </Button>
        <Button variant="secondary" className="!py-3.5">
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.75.9-.01 2.1-.82 3.54-.69 1.69.15 2.96.83 3.67 2.06-3.48 1.93-2.92 6.09.53 7.51-.71 1.81-1.63 3.5-2.82 4.34zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
          </svg>
          <span className="text-sm font-bold text-white/80">Apple ID</span>
        </Button>
      </div>

      <p className="mt-10 text-center text-sm text-white/40 font-medium">
        Don't have an account?{" "}
        <Link to="/register" className="text-primary font-bold hover:underline">
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Login;
