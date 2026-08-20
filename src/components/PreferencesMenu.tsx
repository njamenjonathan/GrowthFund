import React, { useCallback, useRef, useState } from 'react';
import { Check, Contrast, Monitor, Moon, Settings2, Sun, Zap } from 'lucide-react';
import { useTheme, ThemeSetting } from '../context/ThemeContext';
import { useDismissable } from '../hooks/useDismissable';
import { useI18n } from '../i18n/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';

/**
 * One popover holding every display preference: theme, high contrast,
 * reduced motion and language.
 *
 * Previously these controls were scattered — the theme and contrast
 * toggles sat in a `hidden sm:flex` container while the small-screen
 * header carried a second, separate theme button and no contrast control
 * at all. Collecting them means one predictable place at every width.
 */
export const PreferencesMenu: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { t } = useI18n();
  const {
    theme,
    resolvedTheme,
    setTheme,
    highContrast,
    toggleHighContrast,
    reduceMotion,
    toggleReduceMotion,
  } = useTheme();

  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setIsOpen(false), []);
  useDismissable(containerRef, isOpen, close);

  const themeOptions: { value: ThemeSetting; label: string; icon: typeof Sun }[] = [
    { value: 'light', label: t('prefs.theme.light'), icon: Sun },
    { value: 'dark', label: t('prefs.theme.dark'), icon: Moon },
    { value: 'system', label: t('prefs.theme.system'), icon: Monitor },
  ];

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label={t('prefs.open')}
        title={t('prefs.open')}
        className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors"
      >
        <Settings2 className="w-4 h-4" aria-hidden="true" />
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-label={t('prefs.title')}
          className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-850 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-3 z-50 gf-animate-slide-down space-y-3"
        >
          <div>
            <p className="px-1 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {t('prefs.theme')}
            </p>
            <div
              role="radiogroup"
              aria-label={t('prefs.theme')}
              className="grid grid-cols-3 gap-1"
            >
              {themeOptions.map((option) => {
                const isActive = theme === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    role="radio"
                    aria-checked={isActive}
                    onClick={() => setTheme(option.value)}
                    className={`flex flex-col items-center gap-1 py-2 rounded-xl text-[10px] font-bold transition-colors ${
                      isActive
                        ? 'bg-slate-900 dark:bg-emerald-700 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-750'
                    }`}
                  >
                    <option.icon className="w-4 h-4" aria-hidden="true" />
                    {option.label}
                  </button>
                );
              })}
            </div>
            {theme === 'system' && (
              <p className="px-1 pt-1.5 text-[10px] text-slate-500 dark:text-slate-400">
                {resolvedTheme === 'dark' ? t('prefs.theme.dark') : t('prefs.theme.light')}
              </p>
            )}
          </div>

          <LanguageSwitcher variant="list" />

          <div className="pt-1 border-t border-slate-100 dark:border-slate-750 space-y-1">
            <ToggleRow
              icon={Contrast}
              label={t('prefs.contrast')}
              checked={highContrast}
              onToggle={toggleHighContrast}
              onLabel={t('prefs.contrast.on')}
              offLabel={t('prefs.contrast.off')}
            />
            <ToggleRow
              icon={Zap}
              label={t('prefs.motion')}
              hint={t('prefs.motion.hint')}
              checked={reduceMotion}
              onToggle={toggleReduceMotion}
              onLabel={t('prefs.contrast.on')}
              offLabel={t('prefs.contrast.off')}
            />
          </div>
        </div>
      )}
    </div>
  );
};

interface ToggleRowProps {
  icon: typeof Sun;
  label: string;
  hint?: string;
  checked: boolean;
  onToggle: () => void;
  onLabel: string;
  offLabel: string;
}

const ToggleRow: React.FC<ToggleRowProps> = ({
  icon: Icon,
  label,
  hint,
  checked,
  onToggle,
  onLabel,
  offLabel,
}) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={onToggle}
    className="w-full flex items-center justify-between gap-2 px-2 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
  >
    <span className="flex items-start gap-2 min-w-0">
      <Icon
        className={`w-4 h-4 mt-0.5 shrink-0 ${checked ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-400'}`}
        aria-hidden="true"
      />
      <span className="min-w-0">
        <span className="block text-xs font-bold text-slate-800 dark:text-slate-100">{label}</span>
        {hint && (
          <span className="block text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
            {hint}
          </span>
        )}
      </span>
    </span>

    <span
      className={`shrink-0 w-9 h-5 rounded-full p-0.5 transition-colors ${
        checked ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
      }`}
    >
      <span
        className={`block w-4 h-4 rounded-full bg-white transition-transform ${
          checked ? 'translate-x-4' : 'translate-x-0'
        }`}
      >
        {checked && <Check className="w-4 h-4 p-0.5 text-emerald-600" aria-hidden="true" />}
      </span>
    </span>
    <span className="sr-only">{checked ? onLabel : offLabel}</span>
  </button>
);
