import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'neon';
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  loading = false,
  className = '', 
  ...props 
}) => {
  const baseStyles = "relative px-6 py-3 rounded-xl font-medium transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center";
  
  const variants = {
    primary: "bg-gray-900 text-white hover:bg-black shadow-lg shadow-gray-900/10",
    secondary: "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm",
    ghost: "text-gray-500 hover:text-gray-900 bg-transparent",
    neon: "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_4px_20px_rgba(6,182,212,0.3)] hover:shadow-[0_6px_25px_rgba(6,182,212,0.4)] border border-transparent"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`} 
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : null}
      {children}
    </button>
  );
};