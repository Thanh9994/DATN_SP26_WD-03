import React, { useState } from "react";
import { Input as AntInput } from "antd";
import { Eye } from "lucide-react";

interface InputProps {
  label: string;
  icon?: any;
  rightElement?: any;
  className?: string;
  id?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  name?: string;
}

export default function Input({
  label,
  icon,
  rightElement,
  className = "",
  id,
  type = "text",
  ...props
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";

  const currentType = isPassword && showPassword ? "text" : type;

  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2"
      >
        {label}
      </label>

      <AntInput
        id={id}
        prefix={icon}
        suffix={
          isPassword ? (
            <Eye
              size={18}
              className="cursor-pointer text-white/40 hover:text-primary"
              onMouseDown={() => setShowPassword(true)}
              onMouseUp={() => setShowPassword(false)}
              onMouseLeave={() => setShowPassword(false)}
            />
          ) : (
            rightElement
          )
        }
        type={currentType}
        className={`!bg-white/5 !border-white/10 !rounded-xl !py-4 !text-white placeholder:text-white/40 focus:!ring-2 focus:!ring-primary/50 focus:!border-primary transition-all ${className}`}
        {...props}
      />
    </div>
  );
}
