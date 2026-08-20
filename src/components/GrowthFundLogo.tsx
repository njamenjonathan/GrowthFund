import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const GrowthFundLogo: React.FC<LogoProps> = ({ 
  className = '', 
  size = 'md',
  showText = true 
}) => {
  const iconSizes = {
    sm: 24,
    md: 32,
    lg: 42,
  };

  const textSizes = {
    sm: 'text-lg font-bold',
    md: 'text-2xl font-bold',
    lg: 'text-3xl font-bold',
  };

  const dim = iconSizes[size];

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      <svg
        width={dim}
        height={dim}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
        aria-label="GrowthFund Logo"
      >
        {/* Navy C-shape body representing G and currency circle */}
        <path
          d="M 50 14 C 30.1 14 14 30.1 14 50 C 14 69.9 30.1 86 50 86 C 62.5 86 73.6 79.6 80.2 69.9 L 68 69.9 C 63.8 75.8 57.3 79.5 50 79.5 C 33.7 79.5 20.5 66.3 20.5 50 C 20.5 33.7 33.7 20.5 50 20.5 C 57.5 20.5 64.3 24.5 68.3 30.7 L 80.5 30.7 C 74 20.7 62.8 14 50 14 Z"
          fill="currentColor"
          className="text-[#0F172A] dark:text-[#F8FAFC]"
        />
        {/* Dollar tick marks top and bottom */}
        <rect x="47" y="6" width="6" height="12" rx="3" fill="currentColor" className="text-[#0F172A] dark:text-[#F8FAFC]" />
        <rect x="47" y="82" width="6" height="12" rx="3" fill="currentColor" className="text-[#0F172A] dark:text-[#F8FAFC]" />
        
        {/* Inner G bar in Navy */}
        <rect x="50" y="47" width="22" height="6.5" rx="3.25" fill="currentColor" className="text-[#0F172A] dark:text-[#F8FAFC]" />
        <rect x="66" y="47" width="6.5" height="26" rx="3.25" fill="currentColor" className="text-[#0F172A] dark:text-[#F8FAFC]" />

        {/* Vibrant Green Upward Growth Arrow curve that arches through the logo */}
        <path
          d="M 18 52 C 28 52 35 44 48 36 C 58 30 68 22 75 16"
          stroke="#16A34A"
          strokeWidth="8.5"
          strokeLinecap="round"
        />
        {/* Arrowhead */}
        <path
          d="M 64 12 L 86 14 L 84 36 L 73 25 Z"
          fill="#16A34A"
        />
      </svg>
      {showText && (
        <span className={`${textSizes[size]} tracking-tight font-display text-[#0F172A] dark:text-[#F8FAFC]`}>
          Growth<span className="text-[#16A34A] dark:text-[#22C55E]">Fund</span>
        </span>
      )}
    </div>
  );
};
