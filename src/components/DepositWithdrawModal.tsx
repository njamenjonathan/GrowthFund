import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowDownLeft,
  ArrowUpRight,
  Building,
  CheckCircle2,
  CreditCard,
  Info,
  Lock,
  Minus,
  Plus,
  Smartphone,
} from 'lucide-react';
import { Modal } from './Modal';
import { useApp } from '../context/AppContext';
import { useI18n } from '../i18n/LanguageContext';
import { formatFCFA } from '../utils/format';

const MIN_WITHDRAWAL = 5_000;
const WITHDRAWAL_STEP = 5_000;
const MIN_DEPOSIT = 1_000;

const DEPOSIT_PRESETS = [10_000, 25_000, 50_000, 100_000, 250_000, 500_000];
const WITHDRAWAL_PRESETS = [5_000, 10_000, 25_000, 50_000, 100_000];

const PAYMENT_METHODS = [
  { id: 'mtn', name: 'MTN Mobile Money', icon: Smartphone, instant: true },
  { id: 'orange', name: 'Orange Money', icon: Smartphone, instant: true },
  { id: 'wave', name: 'Wave', icon: Smartphone, instant: true },
  { id: 'bank', name: 'Bank transfer', icon: Building, instant: false },
  { id: 'card', name: 'Visa / Mastercard', icon: CreditCard, instant: true },
] as const;

export const DepositWithdrawModal: React.FC = () => {
  const { t, language } = useI18n();
  const { activeModal, closeModal, user, executeDeposit, executeWithdrawal } = useApp();

  const isDeposit = activeModal === 'deposit';
  const isOpen = isDeposit || activeModal === 'withdraw';

  const [amountText, setAmountText] = useState('');
  const [method, setMethod] = useState<string>(PAYMENT_METHODS[0].name);
  const [accountDetails, setAccountDetails] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  /*
   * Reset every time the dialog opens.
   *
   * The previous version seeded its amount with `useState(isDeposit ? … : …)`.
   * Because the component stayed mounted and only returned null when
   * closed, that initialiser ran once on the very first render — when
   * both dialogs were shut — so the deposit form always opened showing
   * the withdrawal default, and switching between the two kept whatever
   * amount had been typed before.
   */
  useEffect(() => {
    if (!isOpen) return;
    setAmountText(isDeposit ? '25000' : '15000');
    setMethod(PAYMENT_METHODS[0].name);
    setAccountDetails('');
    setIsProcessing(false);
  }, [isOpen, isDeposit]);

  const amount = useMemo(() => {
    const parsed = Number.parseInt(amountText.replace(/\D/g, ''), 10);
    return Number.isFinite(parsed) ? parsed : 0;
  }, [amountText]);

  const meetsMinimum = isDeposit ? amount >= MIN_DEPOSIT : amount >= MIN_WITHDRAWAL;
  const meetsStep = isDeposit || amount % WITHDRAWAL_STEP === 0;
  const withinBalance = isDeposit || amount <= user.walletBalance;
  const isValid = meetsMinimum && meetsStep && withinBalance;

  const handleStep = (delta: number) => {
    const next = Math.max(MIN_WITHDRAWAL, Math.round((amount + delta) / WITHDRAWAL_STEP) * WITHDRAWAL_STEP);
    setAmountText(String(next));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!isValid || isProcessing) return;

    setIsProcessing(true);
    try {
      // Awaited: the dialog now closes only when the transfer succeeded.
      const succeeded = isDeposit
        ? await executeDeposit(amount, method, accountDetails || undefined)
        : await executeWithdrawal(amount, method, accountDetails || undefined);
      if (succeeded) closeModal();
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  const presets = isDeposit ? DEPOSIT_PRESETS : WITHDRAWAL_PRESETS;
  const lowSuggestion = Math.floor(amount / WITHDRAWAL_STEP) * WITHDRAWAL_STEP;
  const highSuggestion = lowSuggestion + WITHDRAWAL_STEP;

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      size="md"
      icon={
        <span
          aria-hidden="true"
          className={`p-2.5 rounded-xl shrink-0 ${
            isDeposit
              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
              : 'bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400'
          }`}
        >
          {isDeposit ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
        </span>
      }
      title={isDeposit ? t('wallet.depositTitle') : t('wallet.withdrawTitle')}
      subtitle={`${t('wallet.balance')}: ${formatFCFA(user.walletBalance, language)}`}
    >
      <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 text-xs max-h-[70vh] overflow-y-auto">
        {!isDeposit && (
          <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 text-blue-900 dark:text-blue-200 space-y-1">
            <p className="flex items-center gap-1.5 font-bold">
              <Info className="w-4 h-4 shrink-0" aria-hidden="true" />
              {t('wallet.withdrawRule')}
            </p>
            <p className="text-[11px] leading-relaxed text-blue-800 dark:text-blue-300">
              {t('wallet.withdrawRuleBody')}
            </p>
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="wallet-amount" className="font-bold text-slate-900 dark:text-white text-sm">
              {t('wallet.amount')}
            </label>
            {!isDeposit && <span className="text-[11px] text-slate-500 dark:text-slate-400">{t('wallet.step')}</span>}
          </div>

          <div className="relative">
            <input
              id="wallet-amount"
              type="text"
              inputMode="numeric"
              value={amountText}
              onChange={(event) => setAmountText(event.target.value.replace(/\D/g, ''))}
              aria-invalid={!isValid}
              aria-describedby="wallet-amount-feedback"
              required
              className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border rounded-2xl font-mono text-lg font-extrabold text-slate-900 dark:text-white focus:outline-none focus:ring-2 pr-20 ${
                isValid
                  ? 'border-slate-200 dark:border-slate-700 focus:ring-emerald-500'
                  : 'border-red-400 dark:border-red-500 focus:ring-red-500'
              }`}
            />
            <span
              aria-hidden="true"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-500 dark:text-slate-400 font-mono"
            >
              XAF
            </span>
          </div>

          {!isDeposit && (
            <div className="flex items-center gap-2 mt-2">
              <button
                type="button"
                onClick={() => handleStep(-WITHDRAWAL_STEP)}
                aria-label={`− ${formatFCFA(WITHDRAWAL_STEP, language)}`}
                className="flex-1 py-2 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 rounded-xl font-bold flex items-center justify-center gap-1 transition-colors"
              >
                <Minus className="w-3.5 h-3.5" aria-hidden="true" /> 5 000
              </button>
              <button
                type="button"
                onClick={() => handleStep(WITHDRAWAL_STEP)}
                aria-label={`+ ${formatFCFA(WITHDRAWAL_STEP, language)}`}
                className="flex-1 py-2 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 rounded-xl font-bold flex items-center justify-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" aria-hidden="true" /> 5 000
              </button>
            </div>
          )}

          <div id="wallet-amount-feedback" aria-live="polite" className="mt-2 space-y-1 text-[11px]">
            {!meetsMinimum && (
              <p className="text-red-600 dark:text-red-400 flex items-center gap-1 font-semibold">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                {isDeposit ? t('wallet.errDepositMin') : t('wallet.errMin')}
              </p>
            )}
            {meetsMinimum && !meetsStep && (
              <p className="text-amber-600 dark:text-amber-400 flex items-center gap-1 font-semibold">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                {t('wallet.errMultiple')}{' '}
                {t('wallet.suggest', {
                  low: lowSuggestion.toLocaleString(language === 'fr' ? 'fr-FR' : 'en-GB'),
                  high: highSuggestion.toLocaleString(language === 'fr' ? 'fr-FR' : 'en-GB'),
                })}
              </p>
            )}
            {!withinBalance && (
              <p className="text-red-600 dark:text-red-400 flex items-center gap-1 font-semibold">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                {t('wallet.errBalance')}
              </p>
            )}
            {isValid && (
              <p className="text-emerald-700 dark:text-emerald-400 flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                {t('wallet.valid')}
              </p>
            )}
          </div>

          <div className="mt-3">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1.5">{t('wallet.quickSelect')}</span>
            <div className="flex flex-wrap gap-1.5">
              {presets.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setAmountText(String(value))}
                  aria-pressed={amount === value}
                  className={`px-2.5 py-1.5 rounded-lg font-mono font-bold transition-colors ${
                    amount === value
                      ? 'bg-slate-900 dark:bg-emerald-700 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-750'
                  }`}
                >
                  {formatFCFA(value, language)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <fieldset>
          <legend className="font-bold text-slate-900 dark:text-white mb-1.5">
            {isDeposit ? t('wallet.depositRail') : t('wallet.payoutDestination')}
          </legend>
          <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
            {PAYMENT_METHODS.map((option) => (
              <label
                key={option.id}
                className={`flex items-center justify-between gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                  method === option.name
                    ? 'border-slate-900 dark:border-emerald-500 bg-slate-50 dark:bg-slate-800/80'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50/60 dark:hover:bg-slate-850'
                }`}
              >
                <span className="flex items-center gap-2.5 min-w-0">
                  <span
                    aria-hidden="true"
                    className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-750 text-slate-700 dark:text-slate-200 shrink-0"
                  >
                    <option.icon className="w-4 h-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-bold text-slate-900 dark:text-white truncate">
                      {option.name}
                    </span>
                    <span className="block text-[10px] text-slate-500 dark:text-slate-400">
                      {option.instant ? 'Instant · 0 XAF' : '1–2 days · 0 XAF'}
                    </span>
                  </span>
                </span>
                <input
                  type="radio"
                  name="payment-method"
                  value={option.name}
                  checked={method === option.name}
                  onChange={() => setMethod(option.name)}
                  className="accent-emerald-600 shrink-0"
                />
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label htmlFor="wallet-account" className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
            {method.toLowerCase().includes('money') || method.toLowerCase().includes('wave')
              ? t('wallet.momoNumber')
              : t('wallet.accountDetails')}
          </label>
          <input
            id="wallet-account"
            type="text"
            value={accountDetails}
            onChange={(event) => setAccountDetails(event.target.value)}
            placeholder="+237 6XX XX XX XX"
            required
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
          />
        </div>

        <p className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700 flex items-start gap-2 text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
          <Lock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
          {isDeposit ? t('wallet.securityDeposit') : t('wallet.securityWithdraw')}
        </p>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={closeModal}
            className="flex-1 py-3 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            {t('common.cancel')}
          </button>
          <button
            type="submit"
            disabled={!isValid || isProcessing}
            className={`flex-1 py-3 font-bold rounded-xl transition-colors ${
              isValid && !isProcessing
                ? 'bg-slate-900 dark:bg-emerald-700 hover:bg-slate-800 dark:hover:bg-emerald-600 text-white'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 dark:text-slate-400 cursor-not-allowed'
            }`}
          >
            {isProcessing
              ? t('wallet.processing')
              : `${isDeposit ? t('wallet.cashIn') : t('wallet.cashOut')} ${formatFCFA(amount, language)}`}
          </button>
        </div>
      </form>
    </Modal>
  );
};
