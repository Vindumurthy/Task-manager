import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'gradient' | 'elevated';
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'default',
  hover = true,
  padding = 'md',
}) => {
  const baseClasses = 'rounded-2xl transition-all duration-300';
  
  const variants = {
    default: 'bg-white border border-gray-200 shadow-soft',
    glass: 'glass border border-white/20 shadow-lg',
    gradient: 'bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-soft',
    elevated: 'bg-white shadow-strong border-0',
  };

  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const hoverClasses = hover ? 'card-hover cursor-pointer' : '';

  return (
    <div className={`${baseClasses} ${variants[variant]} ${paddings[padding]} ${hoverClasses} ${className}`}>
      {children}
    </div>
  );
};