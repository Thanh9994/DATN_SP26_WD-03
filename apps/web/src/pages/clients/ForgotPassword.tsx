import Button from "@web/components/Button";
import Input from "@web/components/Input";
import AuthLayout from "@web/layouts/AuthLayout";
import { ArrowLeft, Mail, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";

export const ForgotPassword = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  }
  return (
    <AuthLayout
      title="Forgot Password?"
      subtitle="Enter the email address associated with your account and we'll send you a link to reset your password."
      imageSrc="https://res.cloudinary.com/dcyzkqb1r/image/upload/cinema_app/1771951849120-lgon"
      lsTitle="Relive the Magic."
      lsSubtitle="Don't let a forgotten password stand between you and your next favorite story."
    >
      <Link
        to="/login"
        className="inline-flex items-center gap-2 text-white/40 hover:text-primary transition-colors mb-12 group"
      >
        <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
        <span className="font-bold text-sm uppercase tracking-widest">
          Back to Login
        </span>
      </Link>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <Input
          label="Registered Email"
          type="email"
          id="email"
          placeholder="e.g.alex@example.com"
          icon={<Mail size={20} />}
        />

        <Button type="submit">
          Reset Password
          <RefreshCw size={20} />
        </Button>
      </form>

      <div className="mt-12 pt-8 border-t border-white/5">
        <p className="text-white/30 text-sm text-center">
          Still having trouble?{' '}
          <a href="#" className="text-primary font-bold hover:underline">
            Contact Support
          </a>
        </p>
      </div>
    </AuthLayout>
  );
};
