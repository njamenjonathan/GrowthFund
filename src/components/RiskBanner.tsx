import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useI18n } from '../i18n/LanguageContext';
import { readStorage, writeStorage } from '../lib/storage';

const DISMISS_KEY = 'growthfund_risk_ack';

/**
 * Regulatory risk disclosure.
 *
 * Previously this was `fixed bottom-0`, so it covered page content on
 * every visit and reappeared on every reload no matter how many times
 * you dismissed it — and on mobile it sat directly on top of the page's
 * primary actions. It now sits in the document flow above the footer,
 * and the acknowledgement is remembered.
 */
export const RiskBanner: React.FC = () => {
  const { t } = useI18n();
  const { navigate } = useApp();
  const [isDismissed, setIsDismissed] = useState(() => readStorage(DISMISS_KEY) === 'true');

  if (isDismissed) return null;

  const dismiss = () => {
    setIsDismissed(true);
    writeStorage(DISMISS_KEY, 'true');
  };

  return (
    <aside
      aria-label={t('banner.label')}
      className="border-t-2 border-red-600 dark:border-red-500 bg-red-50 dark:bg-red-950/50 text-slate-800 dark:text-slate-200 gf-no-print"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <p className="flex items-start gap-3 leading-relaxed">
          <AlertTriangle
            className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-px"
            aria-hidden="true"
          />
          <span>
            <strong className="font-bold text-red-700 dark:text-red-300">
              {t('banner.strong')}
            </strong>{' '}
            {t('banner.body')}{' '}
            <button
              type="button"
              onClick={() => navigate('compliance')}
              className="font-bold underline text-red-800 dark:text-red-300 hover:text-red-950 dark:hover:text-white transition-colors"
            >
              {t('banner.readMore')}
            </button>
          </span>
        </p>

        <button
          type="button"
          onClick={dismiss}
          className="self-end md:self-center shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-300 dark:border-red-800 text-xs font-bold text-red-800 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-950 transition-colors"
        >
          {t('banner.dismiss')}
          <X className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      </div>
    </aside>
  );
};
