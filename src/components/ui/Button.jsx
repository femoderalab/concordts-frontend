// src/components/ui/Button.jsx
import React from 'react';
import { RefreshCw } from 'lucide-react';

export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  icon: Icon, 
  onClick, 
  loading, 
  disabled, 
  type = 'button', 
  className = '',
  iconPosition = 'left'
}) => {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 ease rounded-xl cursor-pointer';
  
  const variants = {
    primary: 'bg-[#D94801] text-white hover:bg-[#C24000] active:bg-[#A93600] shadow-sm',
    secondary: 'bg-[#1D2B49] text-white hover:bg-[#24385C] active:bg-[#324A74]',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
    ghost: 'text-gray-600 hover:bg-gray-100',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    success: 'bg-green-600 text-white hover:bg-green-700',
  };
  
  const sizes = {
    large: 'h-12 px-5 text-sm',
    medium: 'h-10 px-4 text-sm',
    small: 'h-8 px-3 text-xs',
    tiny: 'h-7 px-2 text-[10px]',
  };
  
  const isDisabled = disabled || loading;
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {loading && <RefreshCw size={size === 'tiny' ? 12 : size === 'small' ? 14 : 16} className="animate-spin" />}
      {Icon && !loading && iconPosition === 'left' && <Icon size={size === 'tiny' ? 12 : size === 'small' ? 14 : 16} />}
      {children}
      {Icon && !loading && iconPosition === 'right' && <Icon size={size === 'tiny' ? 12 : size === 'small' ? 14 : 16} />}
    </button>
  );
};