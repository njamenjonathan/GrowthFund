import React, { useState } from 'react';
import { LockOpen } from 'lucide-react';
import { Modal } from './Modal';
import { useApp } from '../context/AppContext';
import { PortfolioHolding } from '../types';
import { useI18n } from '../i18n/LanguageContext';
import { formatDate, formatFCFA } from '../utils/format';
import { termLabel } from '../lib/investmentTiers';

/**
 * Confirms returning a matured holding's capital to the cash balance.
 *
 * Redemption closes the position irreversibly, so it gets an explicit
 * confirmation step rather than firing straight off the card button.
 */
export const RedeemDialog: React.FC<{
  holding: PortfolioHolding | null;
  onClose: () => void;
}> = ({ holding, onClose }) => {
  const { t, tr, language } = useI18n();
  const { redeemHolding } = useApp();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!holding) return null;

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      const succeeded = await redeemHolding(holding.id);
      if (succeeded) onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={holding !== null}
      onClose={onClose}
      size="sm"
      icon={
        <span
          aria-hidden="true"
          className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 shrink-0"
        >
          <LockOpen className="w-5 h-5" />
        </span>
      }
      title={t('lock.confirmTitle')}
      subtitle={tr(holding.opportunityTitle)}
    >
      <div className="p-5 sm:p-6 space-y-5">
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          {t('lock.confirmBody', { amount: formatFCFA(holding.currentValue, language) })}
        </p>

        <dl className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2.5 text-xs">
          <div className="flex justify-between gap-3">
            <dt className="text-slate-600 dark:text-slate-400">{t('dash.principal')}</dt>
            <dd className="font-mono font-bold text-slate-900 dark:text-white">
              {formatFCFA(holding.investedAmount, language)}
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-slate-600 dark:text-slate-400">{t('dash.yieldReceived')}</dt>
            <dd className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
              +{formatFCFA(holding.totalReturnsEarned, language)}
            </dd>
          </div>
          <div className="flex justify-between gap-3 pt-2 border-t border-slate-200 dark:border-slate-700">
            <dt className="font-bold text-slate-900 dark:text-white">{t('lock.available')}</dt>
            <dd className="font-mono font-extrabold text-slate-900 dark:text-white text-sm">
              {formatFCFA(holding.currentValue, language)}
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-slate-600 dark:text-slate-400">{t('lock.yourTerm')}</dt>
            <dd className="text-slate-900 dark:text-white">
              {t(termLabel(holding.lockMonths).key, { count: termLabel(holding.lockMonths).count })} ·{' '}
              {t('lock.unlockedOn', { date: formatDate(holding.unlockDate, language) })}
            </dd>
          </div>
        </dl>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            {t('common.cancel')}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="flex-1 py-3 bg-slate-900 dark:bg-emerald-700 hover:bg-slate-800 dark:hover:bg-emerald-600 text-white font-bold rounded-xl text-xs transition-colors disabled:opacity-60"
          >
            {isSubmitting
              ? t('wallet.processing')
              : t('lock.confirmCta', { amount: formatFCFA(holding.currentValue, language) })}
          </button>
        </div>
      </div>
    </Modal>
  );
};
