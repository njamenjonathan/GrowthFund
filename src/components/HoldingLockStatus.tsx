import React from 'react';
import { CheckCircle2, Lock, LockOpen } from 'lucide-react';
import { PortfolioHolding } from '../types';
import { daysUntil, hasReached, lockProgress } from '../lib/investmentTiers';
import { useI18n } from '../i18n/LanguageContext';
import { formatDate } from '../utils/format';

/**
 * Where a holding sits in its lock-in term.
 *
 * A holding is one of three things and the difference matters to the
 * investor's decisions, so each state gets its own colour, icon and
 * wording rather than sharing a generic "status" chip.
 */
export const HoldingLockStatus: React.FC<{
  holding: PortfolioHolding;
  /** Adds the elapsed-term bar; omitted in dense list rows. */
  showProgress?: boolean;
  /** Set false to show only the bar, where a badge already sits above. */
  badge?: boolean;
  className?: string;
}> = ({ holding, showProgress = false, badge = true, className = '' }) => {
  const { t, language } = useI18n();

  // With the badge suppressed there is nothing to render for the two
  // terminal states, which carry no progress.
  if (!badge && holding.status !== 'Locked') return null;

  if (holding.status === 'Redeemed') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 ${className}`}
      >
        <CheckCircle2 className="w-3 h-3" aria-hidden="true" />
        {t('lock.redeemed')}
      </span>
    );
  }

  const isUnlocked = hasReached(holding.unlockDate);

  if (isUnlocked) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 ${className}`}
      >
        <LockOpen className="w-3 h-3" aria-hidden="true" />
        {t('lock.available')}
      </span>
    );
  }

  const remaining = daysUntil(holding.unlockDate);
  const progress = Math.round(lockProgress(holding.investedDate, holding.unlockDate) * 100);

  return (
    <span className={`inline-flex flex-col gap-1 ${className}`}>
      {badge && (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 w-fit">
          <Lock className="w-3 h-3" aria-hidden="true" />
          {t('lock.unlocksOn', { date: formatDate(holding.unlockDate, language) })}
        </span>
      )}

      {showProgress && (
        <span className="block w-full">
          <span
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={t('lock.progress', { percent: progress })}
            className="block w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden"
          >
            <span
              className="block h-full bg-amber-500 dark:bg-amber-400 rounded-full transition-[width] duration-700"
              style={{ width: `${progress}%` }}
            />
          </span>
          <span className="block text-[10px] text-slate-600 dark:text-slate-400 mt-1">
            {remaining === 1
              ? t('lock.dayRemaining')
              : t('lock.daysRemaining', { count: remaining })}
          </span>
        </span>
      )}
    </span>
  );
};
