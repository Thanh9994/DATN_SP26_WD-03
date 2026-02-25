import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "@web/components/Button";
import Input from "@web/components/Input";
import AuthLayout from "@web/layouts/AuthLayout";
import { Lock, Mail, Phone, User } from "lucide-react";
import { useAuth } from "@web/hooks/useAuth";

export const Register = () => {
  const navigate = useNavigate();
  const { register, isRegistering } = useAuth();

  const [ho_ten, setHoten] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptTerms) {
      alert("Bạn phải đồng ý điều khoản!");
      return;
    }
    try {
      await register({ ho_ten, email, password, phone });
      navigate("/login");
    } catch (err) {
      console.error(err);
      // alert(err.message || "Register failed");
    }
  };

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
      <form className="space-y-6" onSubmit={handleSubmit}>
        <Input
          label="Full Name"
          type="text"
          id="name"
          placeholder="John Doe"
          icon={<User size={20} />}
          value={ho_ten}
          onChange={(e) => setHoten(e.target.value)}
        />

        <Input
          label="Email Address"
          type="email"
          id="email"
          placeholder="name@company.com"
          icon={<Mail size={20} />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          label="Phone Number"
          type="phone"
          id="phone"
          placeholder="+84 or 09********"
          icon={<Phone size={20} />}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <div className="space-y-3">
          <Input
            label="Password"
            type="password"
            id="password"
            placeholder="••••••••"
            icon={<Lock size={20} />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="px-1">
            <div className="flex gap-1.5 mb-2">
              <div className="h-1 flex-1 bg-primary rounded-full"></div>
              <div className="h-1 flex-1 bg-primary rounded-full"></div>
              <div className="h-1 flex-1 bg-white/10 rounded-full"></div>
              <div className="h-1 flex-1 bg-white/10 rounded-full"></div>
            </div>
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-tighter">
              Password Strength: <span className="text-primary">Medium</span>
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 px-1">
          <input
            type="checkbox"
            id="acceptTerms"
            checked={acceptTerms}
            className="w-5 h-5 mt-0.5 rounded border-white/10 bg-white/5 text-primary focus:ring-offset-background-dark focus:ring-primary transition-all cursor-pointer"
            onChange={(e) => setAcceptTerms(e.target.checked)}
          />
          <label
            htmlFor="terms"
            className="text-xs text-white/40 leading-tight cursor-pointer"
          >
            By creating an account, I agree to the{" "}
            <a
              href="#"
              className="text-white/60 underline hover:text-primary transition-colors"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="text-white/60 underline hover:text-primary transition-colors"
            >
              Privacy Policy
            </a>
            .
          </label>
        </div>

        <Button type="submit" disabled={isRegistering}>
          {isRegistering ? "Creating..." : "Create Account"}
        </Button>
      </form>

      <div className="relative my-8">
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

      <p className="mt-8 text-center text-sm text-white/40 font-medium">
        Already have an account?{" "}
        <Link to="/login" className="text-primary font-bold hover:underline">
          Sign In
        </Link>
      </p>
    </AuthLayout>
  );
};
