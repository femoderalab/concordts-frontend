// src/components/ui/Card.jsx
import React from 'react';

export const Card = ({ children, className = '', hover = false }) => (
  <div className={`bg-white rounded-2xl shadow-sm ${hover ? 'transition-shadow duration-200 hover:shadow-md' : ''} ${className}`}>
    {children}
  </div>
);