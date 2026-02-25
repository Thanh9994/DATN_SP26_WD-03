import React from 'react';
import { Input as AntInput } from 'antd';

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
  className = '',
  id,
  type = 'text',
  ...props
}: InputProps) {
  const isPassword = type === 'password';
  const InputComponent = isPassword ? AntInput.Password : AntInput;

  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2"
      >
        {label}
      </label>
      <InputComponent
        id={id}
        prefix={icon}
        suffix={rightElement}
        type={type}
        className={`!bg-white/5 !border-white/10 !rounded-xl !py-4 !text-white placeholder:!text-white/30 focus:!ring-2 focus:!ring-primary/50 focus:!border-primary transition-all ${className}`}
        {...props}
      />
    </div>
  );
}
