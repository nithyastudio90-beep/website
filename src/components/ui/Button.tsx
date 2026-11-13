import React from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'gold' | 'outline' | 'dark' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'gold',
  size = 'md',
  fullWidth = false,
  leftIcon,
  rightIcon,
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold-500 disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const variantStyles = {
    gold: 'bg-gold-500 hover:bg-gold-400 text-studio-black font-semibold shadow-gold-glow-sm hover:shadow-gold-glow',
    outline: 'border border-gold-500/80 text-gold-400 hover:text-studio-black hover:bg-gold-500/90 hover:border-gold-500',
    dark: 'bg-studio-surface hover:bg-studio-border text-studio-light border border-studio-border/60 hover:border-gold-500/40',
    ghost: 'text-studio-light/80 hover:text-gold-400 hover:bg-studio-surface/40',
    danger: 'bg-red-600/90 hover:bg-red-500 text-white shadow-sm',
  };

  const sizeStyles = {
    sm: 'text-xs px-3.5 py-2 gap-1.5',
    md: 'text-sm px-5 py-2.5 gap-2',
    lg: 'text-base px-7 py-3.5 gap-2.5 font-semibold tracking-wide',
  };

  return (
    <button
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        fullWidth ? 'w-full' : '',
        className
      )}
      disabled={disabled}
      {...props}
    >
      {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
      <span>{children}</span>
      {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
    </button>
  );
};
