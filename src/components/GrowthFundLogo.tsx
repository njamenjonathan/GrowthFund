import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const ICON_SIZES = { sm: 24, md: 32, lg: 42 } as const;
const TEXT_SIZES = {
  sm: 'text-lg',
  md: 'text-xl sm:text-2xl',
  lg: 'text-3xl',
} as const;

export const GrowthFundLogo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
}) => {
  const dimension = ICON_SIZES[size];

  return (
    <span className={`flex items-center gap-2.5 select-none ${className}`}>
      <svg
        width={dimension}
        height={dimension}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
        // Decorative: the accompanying text (or the parent button's
        // aria-label) already names the brand, so announcing the mark
        // again would just repeat it.
        aria-hidden="true"
        focusable="false"
      >
        <path
          d="M 50 14 C 30.1 14 14 30.1 14 50 C 14 69.9 30.1 86 50 86 C 62.5 86 73.6 79.6 80.2 69.9 L 68 69.9 C 63.8 75.8 57.3 79.5 50 79.5 C 33.7 79.5 20.5 66.3 20.5 50 C 20.5 33.7 33.7 20.5 50 20.5 C 57.5 20.5 64.3 24.5 68.3 30.7 L 80.5 30.7 C 74 20.7 62.8 14 50 14 Z"
          className="fill-slate-900 dark:fill-slate-50"
        />
        <rect x="47" y="6" width="6" height="12" rx="3" className="fill-slate-900 dark:fill-slate-50" />
        <rect x="47" y="82" width="6" height="12" rx="3" className="fill-slate-900 dark:fill-slate-50" />
        <rect x="50" y="47" width="22" height="6.5" rx="3.25" className="fill-slate-900 dark:fill-slate-50" />
        <rect x="66" y="47" width="6.5" height="26" rx="3.25" className="fill-slate-900 dark:fill-slate-50" />
        <path
          d="M 18 52 C 28 52 35 44 48 36 C 58 30 68 22 75 16"
          strokeWidth="8.5"
          strokeLinecap="round"
          className="stroke-emerald-600 dark:stroke-emerald-500"
        />
        <path d="M 64 12 L 86 14 L 84 36 L 73 25 Z" className="fill-emerald-600 dark:fill-emerald-500" />
      </svg>

      {showText && (
        <span
          className={`${TEXT_SIZES[size]} font-extrabold tracking-tight font-display text-slate-900 dark:text-slate-50`}
        >
          Growth<span className="text-emerald-700 dark:text-emerald-400">Fund</span>
        </span>
      )}
    </span>
  );
};
