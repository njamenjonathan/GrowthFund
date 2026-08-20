import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useI18n } from '../i18n/LanguageContext';

const ICONS = {
  success: CheckCircle2,
  info: Info,
  warning: AlertTriangle,
  error: AlertCircle,
} as const;

const TONE = {
  success: 'text-emerald-700 dark:text-emerald-400',
  info: 'text-blue-600 dark:text-blue-400',
  warning: 'text-amber-600 dark:text-amber-400',
  error: 'text-red-600 dark:text-red-400',
} as const;

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();
  const { t } = useI18n();

  return (
    // The live region stays mounted even when empty; a region that is
    // added to the DOM at the same moment as its content is often not
    // announced by screen readers.
    <div
      // role="region" so the aria-label is permitted here; a bare <div>
      // may not carry one.
      role="region"
      aria-live="polite"
      aria-atomic="false"
      aria-label={t('common.notifications')}
      className="fixed top-20 right-4 left-4 sm:left-auto z-[90] flex flex-col gap-2 sm:max-w-sm pointer-events-none gf-no-print"
    >
      {toasts.map((toast) => {
        const Icon = ICONS[toast.type];
        return (
          <div
            key={toast.id}
            role={toast.type === 'error' ? 'alert' : 'status'}
            className="pointer-events-auto bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-2xl p-3.5 shadow-xl flex items-start justify-between gap-3 gf-animate-toast"
          >
            <div className="flex items-start gap-2.5 min-w-0">
              <Icon className={`w-5 h-5 shrink-0 ${TONE[toast.type]}`} aria-hidden="true" />
              <p className="text-xs font-medium leading-snug text-slate-800 dark:text-slate-100">
                {toast.message}
              </p>
            </div>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              aria-label={t('common.dismiss')}
              className="p-1 -m-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 shrink-0"
            >
              <X className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
