// src/components/ui/Text.jsx
import React from 'react';

export const Text = ({ variant = 'body', children, className = '' }) => {
  const variants = {
    h1: 'text-2xl md:text-3xl font-bold',
    h2: 'text-xl md:text-2xl font-semibold',
    h3: 'text-lg md:text-xl font-semibold',
    h4: 'text-base md:text-lg font-medium',
    body: 'text-sm md:text-base',
    small: 'text-xs md:text-sm',
    caption: 'text-[10px] md:text-xs',
    tiny: 'text-[9px] md:text-[10px]',
  };
  
  const Tag = variant === 'h1' ? 'h1' : 
           variant === 'h2' ? 'h2' : 
           variant === 'h3' ? 'h3' : 
           variant === 'h4' ? 'h4' : 'div';
  
  return React.createElement(Tag, {
    className: `${variants[variant]} text-gray-800 ${className}`
  }, children);
};