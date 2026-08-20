import React from 'react';
import { Languages } from 'lucide-react';
import { useI18n } from '../i18n/LanguageContext';
import { LANGUAGES } from '../i18n/types';

interface LanguageSwitcherProps {
  /** `tabs` is the compact FR|EN segmented control used in the header. */
  variant?: 'tabs' | 'list';
  className?: string;
}

/**
 * FR / EN switcher.
 *
 * Rendered as a real tablist so screen readers announce it as a set of
 * choices with one selected, rather than as two unrelated buttons.
 */
export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = 'tabs',
  className = '',
}) => {
  const { language, setLanguage, t } = useI18n();

  if (variant === 'list') {
    return (
      <div className={className}>
        <p className="px-1 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <Languages className="w-3.5 h-3.5" aria-hidden="true" />
          {t('prefs.language')}
        </p>
        <div
          role="tablist"
          aria-label={t('prefs.language.select')}
          className="grid grid-cols-2 gap-1"
        >
          {LANGUAGES.map((item) => {
            const isActive = language === item.code;
            return (
              <button
                key={item.code}
                type="button"
                role="tab"
                aria-selected={isActive}
                lang={item.code}
                onClick={() => setLanguage(item.code)}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-colors ${
                  isActive
                    ? 'bg-slate-900 dark:bg-emerald-700 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-750'
                }`}
              >
                {item.nativeLabel}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div
      role="tablist"
      aria-label={t('prefs.language.select')}
      className={`flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl border border-slate-200 dark:border-slate-700 ${className}`}
    >
      {LANGUAGES.map((item) => {
        const isActive = language === item.code;
        return (
          <button
            key={item.code}
            type="button"
            role="tab"
            aria-selected={isActive}
            lang={item.code}
            title={item.nativeLabel}
            onClick={() => setLanguage(item.code)}
            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-extrabold uppercase tracking-wide transition-colors ${
              isActive
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {item.code}
            <span className="sr-only"> — {item.nativeLabel}</span>
          </button>
        );
      })}
    </div>
  );
};
