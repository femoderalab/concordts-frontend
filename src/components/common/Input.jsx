// src/components/common/Input.jsx
import React from 'react';

const Input = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  error = '',
  className = '',
  fullWidth = true,
  helperText = '',
  rows = 4,
  autoFocus = false,
  options = [],
  leftIcon,
  rightIcon,
  ...props
}) => {
  const isTextarea = type === 'textarea';
  const isSelect = type === 'select';

  // Enhanced input styles with better focus states
  const baseInputStyles = `
    px-4 py-3 
    border rounded-xl
    transition-all duration-300 
    focus:outline-none focus:ring-3 focus:ring-secondary-500/20 focus:border-secondary-500
    disabled:bg-neutral-50 disabled:cursor-not-allowed disabled:text-neutral-500
    placeholder:text-neutral-400
    text-neutral-900
    bg-white
    font-sans
  `;

  // Enhanced error state
  const errorStyles = error
    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
    : 'border-neutral-300 hover:border-neutral-400';

  // Width styles
  const widthStyles = fullWidth ? 'w-full' : '';

  // Icon container styles
  const iconContainerStyles = 'absolute inset-y-0 flex items-center pointer-events-none';
  const iconStyles = 'text-neutral-400';

  return (
    <div className={`${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label 
          htmlFor={name} 
          className="block text-sm font-medium text-neutral-800 mb-2 font-sans"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {leftIcon && (
          <div className={`${iconContainerStyles} left-0 pl-3`}>
            <span className={iconStyles}>{leftIcon}</span>
          </div>
        )}

        {isTextarea ? (
          <textarea
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            rows={rows}
            className={`${baseInputStyles} ${errorStyles} ${widthStyles} ${className} ${leftIcon ? 'pl-10' : ''} ${rightIcon ? 'pr-10' : ''}`}
            autoFocus={autoFocus}
            {...props}
          />
        ) : isSelect ? (
          <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            disabled={disabled}
            className={`${baseInputStyles} ${errorStyles} ${widthStyles} ${className} ${leftIcon ? 'pl-10' : ''} ${rightIcon ? 'pr-10' : ''} appearance-none`}
            autoFocus={autoFocus}
            {...props}
          >
            <option value="" disabled>{placeholder || 'Select an option'}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            className={`${baseInputStyles} ${errorStyles} ${widthStyles} ${className} ${leftIcon ? 'pl-10' : ''} ${rightIcon ? 'pr-10' : ''}`}
            autoFocus={autoFocus}
            {...props}
          />
        )}

        {rightIcon && (
          <div className={`${iconContainerStyles} right-0 pr-3`}>
            <span className={iconStyles}>{rightIcon}</span>
          </div>
        )}

        {isSelect && (
          <div className={`${iconContainerStyles} right-0 pr-3`}>
            <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        )}
      </div>

      {!error && helperText && (
        <p className="mt-1.5 text-xs text-neutral-600 font-sans">{helperText}</p>
      )}

      {error && (
        <p className="mt-1.5 text-sm text-red-600 flex items-center font-sans">
          <svg
            className="w-4 h-4 mr-1.5 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;