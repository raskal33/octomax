import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
}) => {
  const baseClasses = 'rounded-lg font-medium transition-all duration-200 focus:outline-none';
  
  const variantClasses = {
    primary: 'bg-[#9945FF] text-white hover:bg-[#8A3EE8] active:bg-[#7B37D1]',
    secondary: 'bg-[#14F195] text-black hover:bg-[#12D988] active:bg-[#10C27B]',
    outline: 'bg-transparent border border-[#9945FF] text-[#9945FF] hover:bg-[#9945FF]/10 active:bg-[#9945FF]/20',
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button; 