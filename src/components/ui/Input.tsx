import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  variant?: 'default' | 'glass' | 'minimal';
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  success,
  icon,
  iconPosition = 'left',
  variant = 'default',
  className = '',
  type,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  const baseClasses = 'block w-full transition-all duration-300 focus:outline-none';
  
  const variants = {
    default: `border-2 rounded-xl shadow-sm ${
      error 
        ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
        : success
        ? 'border-green-300 focus:border-green-500 focus:ring-green-500/20'
        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500/20'
    } focus:ring-4 bg-white`,
    glass: `glass border border-white/20 rounded-xl backdrop-blur-sm ${
      error 
        ? 'focus:border-red-400 focus:ring-red-400/20' 
        : 'focus:border-blue-400 focus:ring-blue-400/20'
    } focus:ring-4`,
    minimal: `border-0 border-b-2 rounded-none bg-transparent ${
      error 
        ? 'border-red-300 focus:border-red-500' 
        : 'border-gray-300 focus:border-blue-500'
    }`,
  };

  const paddingClasses = icon 
    ? iconPosition === 'left' 
      ? 'pl-12 pr-4 py-3' 
      : 'pl-4 pr-12 py-3'
    : 'px-4 py-3';

  return (
    <div className="space-y-2">
      {label && (
        <label className={`block text-sm font-medium transition-colors duration-200 ${
          isFocused 
            ? error 
              ? 'text-red-600' 
              : success
              ? 'text-green-600'
              : 'text-blue-600'
            : 'text-gray-700'
        }`}>
          {label}
        </label>
      )}
      
      <div className="relative group">
        {icon && iconPosition === 'left' && (
          <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-200 ${
            isFocused 
              ? error 
                ? 'text-red-500' 
                : success
                ? 'text-green-500'
                : 'text-blue-500'
              : 'text-gray-400'
          }`}>
            {icon}
          </div>
        )}
        
        <input
          type={inputType}
          className={`${baseClasses} ${variants[variant]} ${paddingClasses} ${
            isPassword ? 'pr-12' : ''
          } ${className}`}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        
        {icon && iconPosition === 'right' && !isPassword && (
          <div className={`absolute right-4 top-1/2 transform -translate-y-1/2 transition-colors duration-200 ${
            isFocused 
              ? error 
                ? 'text-red-500' 
                : 'text-blue-500'
              : 'text-gray-400'
          }`}>
            {icon}
          </div>
        )}
        
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}
        
        {/* Focus ring animation */}
        <div className={`absolute inset-0 rounded-xl pointer-events-none transition-all duration-300 ${
          isFocused ? 'ring-4 ring-blue-500/20' : ''
        }`} />
      </div>
      
      {error && (
        <p className="text-sm text-red-600 flex items-center animate-in slide-in-from-top-1 duration-200">
          <span className="w-1 h-1 bg-red-600 rounded-full mr-2"></span>
          {error}
        </p>
      )}
      
      {success && !error && (
        <p className="text-sm text-green-600 flex items-center animate-in slide-in-from-top-1 duration-200">
          <span className="w-1 h-1 bg-green-600 rounded-full mr-2"></span>
          {success}
        </p>
      )}
    </div>
  );
};