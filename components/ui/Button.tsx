import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading = false, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "px-6 py-3 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-stone-100 dark:focus:ring-offset-stone-900 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    // Primary: Emerald green (works well on both)
    primary: "bg-emerald-600 text-white hover:bg-emerald-500 focus:ring-emerald-500 shadow-md shadow-emerald-900/20 hover:shadow-lg",
    
    // Secondary: Light grey in light mode, Dark grey in dark mode
    secondary: "bg-stone-200 text-stone-800 hover:bg-stone-300 border border-stone-300 dark:bg-stone-800 dark:text-stone-200 dark:hover:bg-stone-700 dark:border-stone-700 focus:ring-stone-500",
    
    // Outline: Emerald border, text adapts
    outline: "border-2 border-emerald-600 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 focus:ring-emerald-600"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className} flex items-center justify-center gap-2`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Processing...</span>
        </>
      ) : children}
    </button>
  );
};