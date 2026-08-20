import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, CheckCircle2, Smartphone, TrendingUp, Wallet } from 'lucide-react';
import { Modal } from './Modal';
import { useApp } from '../context/AppContext';
import { useI18n } from '../i18n/LanguageContext';
import { formatFCFA, formatPercent } from '../utils/format';

const PRESETS = [25_000, 50_000, 100_000, 250_000, 500_000, 1_000_000];

const YEARS_BY_DURATION: Record<string, number> = {
  '1-3 years': 2,
  '3-5 years': 4,
  '5+ years': 6,
};

export const InvestModal: React.FC = () => {
  const { t, tr, language } = useI18n();
  const {
    activeModal,
    closeModal,
    investingOpportunity,
    executeInvestment,
    user,
    navigate,
    setDashboardTab,
  } = useApp();

  const isOpen = activeModal === 'invest' && investingOpportunity !== null;

  const [amountText, setAmountText] = useState('');
  const [fundingSource, setFundingSource] = useState<'balance' | 'momo'>('balance');
  const [hasAcknowledgedRisk, setHasAcknowledgedRisk] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [receipt, setReceipt] = useState<{ id: string; amount: number } | null>(null);

  // Reset per opening. The old modal initialised its state once at mount
  // and then kept whatever the previous visitor had typed.
  useEffect(() => {
    if (!isOpen || !investingOpportunity) return;
    setAmountText(String(investingOpportunity.minInvestment));
    setFundingSource('balance');
    setHasAcknowledgedRisk(false);
    setIsSubmitting(false);
    setReceipt(null);
  }, [isOpen, investingOpportunity]);

  const amount = useMemo(() => {
    const parsed = Number.parseInt(amountText.replace(/\D/g, ''), 10);
    return Number.isFinite(parsed) ? parsed : 0;
  }, [amountText]);

  if (!isOpen || !investingOpportunity) return null;

  const opportunity = investingOpportunity;
  const minimum = opportunity.minInvestment;
  const averageRate = (opportunity.projectedReturnMin + opportunity.projectedReturnMax) / 2;
  const years = YEARS_BY_DURATION[opportunity.durationCategory] ?? 4;
  const annualIncome = (amount * averageRate) / 100;
  const maturityValue = amount + annualIncome * years;

  const isBelowMinimum = amount < minimum;
  const hasInsufficientBalance = fundingSource === 'balance' && amount > user.walletBalance;
  const canSubmit = !isBelowMinimum && !hasInsufficientBalance && hasAcknowledgedRisk && !isSubmitting;

  const handleConfirm = async () => {
    if (!canSubmit) return;
    setIsSubmitting(true);
    try {
      // Awaited, so the success screen only appears when the investment
      // actually succeeded. The old code called this without awaiting and
      // treated the returned Promise as a truthy result, so a rejected
      // investment still showed a confirmation.
      const succeeded = await executeInvestment(opportunity.id, amount);
      if (succeeded) {
        setReceipt({ id: `GF-INV-${Math.floor(100_000 + Math.random() * 900_000)}`, amount });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const goToPortfolio = () => {
    closeModal();
    setDashboardTab('portfolio');
    navigate('dashboard', { tab: 'portfolio' });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      size="lg"
      title={receipt ? t('invest.confirmed') : t('invest.title', { name: tr(opportunity.title) })}
      subtitle={`${t(`market.category.${opportunity.category.replace(' ', '')}` as 'market.category.Energy')} · ${formatPercent(opportunity.projectedReturnMin, language)} – ${formatPercent(opportunity.projectedReturnMax, language)} ${t('opp.perAnnum')}`}
    >
      {receipt ? (
        <div className="p-6 sm:p-8 space-y-6 text-center">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/80 rounded-full flex items-center justify-center mx-auto text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 className="w-9 h-9" aria-hidden="true" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
              {t('invest.successTitle', { amount: formatFCFA(receipt.amount, language) })}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {t('invest.successBody', { name: tr(opportunity.title) })}
            </p>
          </div>

          <dl className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-left space-y-2.5 text-xs">
            <div className="flex justify-between gap-3">
              <dt className="text-slate-500 dark:text-slate-400">{t('invest.txId')}</dt>
              <dd className="font-mono font-bold text-slate-900 dark:text-white">{receipt.id}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-slate-500 dark:text-slate-400">{t('opp.distribution')}</dt>
              <dd className="font-medium text-slate-900 dark:text-white">
                {t(`opp.freq.${opportunity.distributionFrequency}` as 'opp.freq.Quarterly')}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-slate-500 dark:text-slate-400">{t('opp.horizon')}</dt>
              <dd className="font-medium text-slate-900 dark:text-white">
                {tr(opportunity.durationYears)}
              </dd>
            </div>
          </dl>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={goToPortfolio}
              className="flex-1 py-3 px-4 bg-slate-900 dark:bg-emerald-700 hover:bg-slate-800 dark:hover:bg-emerald-600 text-white font-bold rounded-xl text-sm transition-colors"
            >
              {t('invest.viewPortfolio')}
            </button>
            <button
              type="button"
              onClick={closeModal}
              className="py-3 px-4 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold rounded-xl text-sm transition-colors"
            >
              {t('invest.done')}
            </button>
          </div>
        </div>
      ) : (
        <div className="p-5 sm:p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          <fieldset className="space-y-3">
            <legend className="text-sm font-bold text-slate-900 dark:text-white mb-2">
              {t('invest.selectAmount')}
            </legend>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PRESETS.filter((value) => value >= minimum).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setAmountText(String(value))}
                  aria-pressed={amount === value}
                  className={`py-2 px-3 text-xs font-mono font-bold rounded-xl border transition-colors ${
                    amount === value
                      ? 'border-slate-900 dark:border-emerald-500 bg-slate-900 dark:bg-emerald-700 text-white'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-750'
                  }`}
                >
                  {formatFCFA(value, language)}
                </button>
              ))}
            </div>

            <div>
              <label htmlFor="invest-amount" className="sr-only">
                {t('invest.customAmount')}
              </label>
              <div className="relative">
                <input
                  id="invest-amount"
                  type="text"
                  inputMode="numeric"
                  value={amountText}
                  onChange={(event) => setAmountText(event.target.value.replace(/\D/g, ''))}
                  aria-invalid={isBelowMinimum || hasInsufficientBalance}
                  aria-describedby="invest-amount-feedback"
                  className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border rounded-2xl text-slate-900 dark:text-white font-mono text-lg font-bold focus:outline-none focus:ring-2 pr-24 ${
                    isBelowMinimum || hasInsufficientBalance
                      ? 'border-red-400 dark:border-red-500 focus:ring-red-500'
                      : 'border-slate-200 dark:border-slate-700 focus:ring-emerald-500'
                  }`}
                />
                <span
                  aria-hidden="true"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 font-bold text-xs font-mono"
                >
                  XAF
                </span>
              </div>

              <div id="invest-amount-feedback" className="mt-1.5 text-[11px] space-y-1">
                {isBelowMinimum ? (
                  <p className="text-red-600 dark:text-red-400 font-semibold">
                    {t('invest.belowMin', { amount: formatFCFA(minimum, language) })}
                  </p>
                ) : hasInsufficientBalance ? (
                  <p className="text-red-600 dark:text-red-400 font-semibold">
                    {t('invest.insufficient', { balance: formatFCFA(user.walletBalance, language) })}
                  </p>
                ) : (
                  <p className="flex justify-between text-slate-500 dark:text-slate-400">
                    <span>{t('invest.minTicket', { amount: formatFCFA(minimum, language) })}</span>
                    <span>{t('invest.targetRaise', { amount: formatFCFA(opportunity.fundingGoal, language) })}</span>
                  </p>
                )}
              </div>
            </div>
          </fieldset>

          <div className="bg-slate-50 dark:bg-slate-800/70 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-200 dark:border-slate-700">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                {t('invest.targetRate')}
              </span>
              <span className="text-sm font-extrabold font-mono text-emerald-700 dark:text-emerald-400">
                {formatPercent(opportunity.projectedReturnMin, language)} –{' '}
                {formatPercent(opportunity.projectedReturnMax, language)}
              </span>
            </div>

            <dl className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <dt className="text-slate-500 dark:text-slate-400 font-medium">{t('invest.estAnnual')}</dt>
                <dd className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                  ~{formatFCFA(annualIncome, language)}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500 dark:text-slate-400 font-medium">{t('invest.estMaturity')}</dt>
                <dd className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                  ~{formatFCFA(maturityValue, language)}
                </dd>
              </div>
            </dl>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 italic leading-normal">
              {t('invest.projectionNote')}
            </p>
          </div>

          <fieldset className="space-y-2">
            <legend className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              {t('invest.source')}
            </legend>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFundingSource('balance')}
                aria-pressed={fundingSource === 'balance'}
                className={`p-3 text-left rounded-2xl border text-xs transition-colors ${
                  fundingSource === 'balance'
                    ? 'border-slate-900 dark:border-emerald-500 bg-slate-100/80 dark:bg-slate-800'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850'
                }`}
              >
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Wallet className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                  {t('invest.sourceBalance')}
                </span>
                <span className="block text-slate-500 dark:text-slate-400 font-mono text-[11px] mt-0.5">
                  {formatFCFA(user.walletBalance, language)}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setFundingSource('momo')}
                aria-pressed={fundingSource === 'momo'}
                className={`p-3 text-left rounded-2xl border text-xs transition-colors ${
                  fundingSource === 'momo'
                    ? 'border-slate-900 dark:border-emerald-500 bg-slate-100/80 dark:bg-slate-800'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850'
                }`}
              >
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-blue-600" aria-hidden="true" />
                  {t('invest.sourceMomo')}
                </span>
                <span className="block text-slate-500 dark:text-slate-400 font-mono text-[11px] mt-0.5">
                  {t('invest.sourceMomoDetail')}
                </span>
              </button>
            </div>
          </fieldset>

          <div className="bg-red-50 dark:bg-red-950/40 p-4 rounded-2xl border border-red-200 dark:border-red-800 flex items-start gap-3">
            <input
              type="checkbox"
              id="invest-risk"
              checked={hasAcknowledgedRisk}
              onChange={(event) => setHasAcknowledgedRisk(event.target.checked)}
              className="mt-0.5 w-4 h-4 accent-emerald-600 rounded shrink-0"
            />
            <label
              htmlFor="invest-risk"
              className="text-xs text-red-900 dark:text-red-300 leading-relaxed cursor-pointer"
            >
              <strong className="block mb-0.5">{t('invest.riskAck')}</strong>
              {t('invest.riskAckBody')}
            </label>
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-xs transition-colors"
            >
              {t('common.cancel')}
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={!canSubmit}
              className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-2 ${
                canSubmit
                  ? 'bg-slate-900 dark:bg-emerald-700 hover:bg-slate-800 dark:hover:bg-emerald-600 text-white'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 dark:text-slate-400 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <>
                  <span
                    aria-hidden="true"
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                  />
                  {t('invest.submitting')}
                </>
              ) : (
                <>
                  {t('invest.confirm', { amount: formatFCFA(amount, language) })}
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};
