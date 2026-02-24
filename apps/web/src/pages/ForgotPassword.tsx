import AuthLayout from "@web/layouts/AuthLayout";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export const ForgotPassword = () => {
  return (
    <AuthLayout
      title="Forgot Password?"
      subtitle="Enter the email address associated with your account and we'll send you a link to reset your password."
      imageSrc="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80&w=1920"
      lsTitle="Relive the Magic."
      lsSubtitle="Don't let a forgotten password stand between you and your next favorite story."
    >
      <Link
        to="/signin"
        className="inline-flex items-center gap-2 text-white/40 hover:text-primary transition-colors mb-12 group"
      >
        <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
        <span className="font-bold text-sm uppercase tracking-widest">
          Back to Login
        </span>
      </Link>
    </AuthLayout>
  );
};
