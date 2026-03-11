import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  children?: any;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export default function Button({ 
  children, 
  variant = 'primary', 
  className = '', 
  ...props 
}: ButtonProps) {
  const variantStyles = variant === 'primary' 
    ? 'bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20' 
    : 'bg-white/5 border border-white/10 hover:bg-white/10 text-white';

  return (
    <button
      className={`w-full py-4 rounded-xl font-bold text-sm uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-3 ${variantStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
