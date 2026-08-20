import React from 'react';
import { Check, Lock } from 'lucide-react';
import {
  INVESTMENT_TIERS,
  InvestmentTier,
  effectiveRate,
  termLabel,
} from '../lib/investmentTiers';
import { useI18n } from '../i18n/LanguageContext';
import { formatFCFA, formatPercent } from '../utils/format';

interface TierLadderProps {
  /** Highlighted row, when shown against a chosen amount. */
  current?: InvestmentTier['id'];
  /** When given, rates are resolved against this offering's band. */
  projectedReturnMin?: number;
  projectedReturnMax?: number;
  className?: string;
}

/**
 * The allocation ladder: how much, for how long, at what rate.
 *
 * Rendered as a real table so the relationship between the three columns
 * is available to a screen reader in the same structure a sighted reader
 * sees, rather than as a row of visually-arranged cards.
 */
export const TierLadder: React.FC<TierLadderProps> = ({
  current,
  projectedReturnMin,
  projectedReturnMax,
  className = '',
}) => {
  const { t, tr, language } = useI18n();
  const hasBand =
    typeof projectedReturnMin === 'number' && typeof projectedReturnMax === 'number';

  const rateLabel = (tier: InvestmentTier) => {
    if (hasBand) {
      return formatPercent(
        effectiveRate(tier.minAmount, projectedReturnMin!, projectedReturnMax!),
        language,
      );
    }
    // Without a specific offering, describe the position in the band
    // instead of inventing a number.
    if (tier.yieldPosition === 0) return t('tier.rateMin');
    if (tier.yieldPosition === 1) return t('tier.rateMax');
    return t('tier.rateMid', { percent: `${Math.round(tier.yieldPosition * 100)}%` });
  };

  return (
    <div className={`overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 ${className}`}>
      <table className="w-full text-left text-xs min-w-[26rem]">
        <thead className="bg-white dark:bg-slate-850 text-slate-900 dark:text-white">
          <tr>
            <th scope="col" className="p-2.5 font-bold">{t('tier.label')}</th>
            <th scope="col" className="p-2.5 font-bold">{t('market.minInvestment')}</th>
            <th scope="col" className="p-2.5 font-bold">
              <span className="inline-flex items-center gap-1">
                <Lock className="w-3 h-3" aria-hidden="true" />
                {t('tier.lockColumn')}
              </span>
            </th>
            <th scope="col" className="p-2.5 font-bold">{t('tier.rateColumn')}</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {INVESTMENT_TIERS.map((tier) => {
            const isCurrent = current === tier.id;
            return (
              <tr
                key={tier.id}
                aria-current={isCurrent ? 'true' : undefined}
                className={
                  isCurrent
                    ? 'bg-emerald-100/70 dark:bg-emerald-950/50'
                    : 'bg-white/60 dark:bg-slate-900/40'
                }
              >
                <th scope="row" className="p-2.5 text-left font-bold text-slate-900 dark:text-white">
                  <span className="inline-flex items-center gap-1.5">
                    {isCurrent && (
                      <Check
                        className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400"
                        aria-hidden="true"
                      />
                    )}
                    {tr(tier.name)}
                    {isCurrent && <span className="sr-only"> — {t('tier.yours')}</span>}
                  </span>
                </th>

                <td className="p-2.5 font-mono text-slate-700 dark:text-slate-300 whitespace-nowrap">
                  {tier.maxAmount
                    ? t('tier.amountRange', {
                        from: formatFCFA(tier.minAmount, language),
                        to: formatFCFA(tier.maxAmount - 1, language),
                      })
                    : t('tier.amountFrom', { amount: formatFCFA(tier.minAmount, language) })}
                </td>

                <td className="p-2.5 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                  {(() => {
                    const term = termLabel(tier.lockMonths);
                    return t(term.key, { count: term.count });
                  })()}
                </td>

                <td className="p-2.5 font-mono font-bold text-emerald-700 dark:text-emerald-400 whitespace-nowrap">
                  {rateLabel(tier)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
