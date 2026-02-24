import React from 'react';

const Button = ({
  children,
  variant = 'primary',
  type = 'button',
  disabled = false,
  loading = false,
  onClick,
  className = '',
  fullWidth = false,
  size = 'md',
  ...props
}) => {
  const baseStyles = 'font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center font-sans';

  const variantStyles = {
    primary: 'bg-[#2b2f83] hover:bg-[#1f2361] text-white shadow-lg hover:shadow-xl focus:ring-[#2b2f83] active:scale-[0.98]',
    secondary: 'bg-gradient-to-r from-[#2b2f83] to-[#1f2361] hover:from-[#1f2361] hover:to-[#151841] text-white shadow-lg hover:shadow-xl focus:ring-[#2b2f83] active:scale-[0.98]',
    success: 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl focus:ring-green-500 active:scale-[0.98]',
    danger: 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-xl focus:ring-red-500 active:scale-[0.98]',
    warning: 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white shadow-lg hover:shadow-xl focus:ring-yellow-500 active:scale-[0.98]',
    outline: 'border-2 border-[#2b2f83] text-[#2b2f83] hover:bg-blue-50 hover:border-[#1f2361] hover:text-[#1f2361] focus:ring-[#2b2f83] active:bg-blue-100',
    ghost: 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 hover:text-neutral-900 focus:ring-neutral-500 active:bg-neutral-300',
  };

  const sizeStyles = {
    xs: 'px-2.5 py-1.5 text-xs',
    sm: 'px-3 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const widthStyles = fullWidth ? 'w-full' : '';

  const buttonClasses = `${baseStyles} ${variantStyles[variant] || variantStyles.primary} ${sizeStyles[size]} ${widthStyles} ${className}`;

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={buttonClasses}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      
      {children}
    </button>
  );
};

export default Button;