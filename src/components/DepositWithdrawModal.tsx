import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Wallet, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Building, 
  Lock, 
  CheckCircle2, 
  AlertCircle,
  Smartphone,
  CreditCard,
  Plus,
  Minus,
  Info
} from 'lucide-react';
import { formatFCFA, formatXAF } from '../utils/currency';

export const DepositWithdrawModal: React.FC = () => {
  const { 
    isDepositModalOpen, 
    setIsDepositModalOpen,
    isWithdrawModalOpen,
    setIsWithdrawModalOpen,
    user,
    executeDeposit,
    executeWithdrawal
  } = useApp();

  const isDeposit = isDepositModalOpen;
  const isOpen = isDepositModalOpen || isWithdrawModalOpen;

  // Initial states
  const [amountStr, setAmountStr] = useState<string>(isDeposit ? '25000' : '15000');
  const [selectedMethod, setSelectedMethod] = useState<string>('MTN Mobile Money');
  const [accountDetails, setAccountDetails] = useState<string>('+237 671 23 45 67');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentAmount = parseInt(amountStr, 10) || 0;

  // Validation for withdrawal:
  // Must be >= 5000 AND multiple of 5000 (amount % 5000 === 0)
  const isWithdrawalMinValid = currentAmount >= 5000;
  const isWithdrawalMultipleValid = currentAmount % 5000 === 0;
  const isWithdrawalBalanceValid = currentAmount <= user.walletBalance;
  const isWithdrawalValid = isWithdrawalMinValid && isWithdrawalMultipleValid && isWithdrawalBalanceValid;

  const isDepositValid = currentAmount >= 1000;

  const isValid = isDeposit ? isDepositValid : isWithdrawalValid;

  const handleClose = () => {
    setIsDepositModalOpen(false);
    setIsWithdrawModalOpen(false);
    setIsProcessing(false);
  };

  const handleQuickAmount = (val: number) => {
    setAmountStr(val.toString());
  };

  const handleStepAmount = (delta: number) => {
    const nextVal = Math.max(5000, Math.floor((currentAmount + delta) / 5000) * 5000);
    setAmountStr(nextVal.toString());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      if (isDeposit) {
        executeDeposit(currentAmount, selectedMethod, accountDetails);
        handleClose();
      } else {
        const success = executeWithdrawal(currentAmount, selectedMethod, accountDetails);
        if (success) {
          handleClose();
        }
      }
    }, 800);
  };

  const depositPresets = [10000, 25000, 50000, 100000, 250000, 500000];
  const withdrawalPresets = [5000, 10000, 15000, 20000, 25000, 50000, 100000];

  const paymentMethods = [
    { id: 'momo', name: 'MTN Mobile Money', icon: Smartphone, tag: 'Instant (0% fee)', placeholder: 'e.g. +237 67x xx xx xx' },
    { id: 'om', name: 'Orange Money', icon: Smartphone, tag: 'Instant (0% fee)', placeholder: 'e.g. +237 69x xx xx xx' },
    { id: 'wave', name: 'Wave Mobile Money', icon: Smartphone, tag: 'Instant (0% fee)', placeholder: 'e.g. +221 77x xx xx xx' },
    { id: 'bank', name: 'Bank Transfer (UBA / Ecobank / Afriland)', icon: Building, tag: '1-2 Days', placeholder: 'RIB / IBAN / Account Number' },
    { id: 'card', name: 'Visa / Mastercard', icon: CreditCard, tag: 'Instant', placeholder: 'Cardholder Name / Number' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden transition-all animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-850">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${isDeposit ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400' : 'bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400'}`}>
              {isDeposit ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {isDeposit ? 'Cash In (Deposit Franc CFA)' : 'Cash Out (Withdraw Franc CFA)'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Available Cash Balance: <strong className="text-slate-900 dark:text-white font-mono">{formatFCFA(user.walletBalance)}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs">
          {/* Withdrawal rule callout banner */}
          {!isDeposit && (
            <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 text-blue-900 dark:text-blue-200 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-xs">
                <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <span>Withdrawal Rule (Multiples of 5,000 XAF)</span>
              </div>
              <p className="text-[11px] leading-relaxed text-blue-800 dark:text-blue-300">
                Cash out is permitted strictly in increments of <strong>5,000 XAF</strong>, starting from <strong>5,000 XAF</strong> (e.g. 5,000, 10,000, 15,000, 20,000, 25,000, 30,000 XAF...).
              </p>
            </div>
          )}

          {/* Amount input block */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-bold text-slate-900 dark:text-white text-sm">
                Amount (Franc CFA / XAF)
              </label>
              {!isDeposit && (
                <span className="text-[11px] text-slate-500">
                  Step: 5,000 XAF
                </span>
              )}
            </div>

            <div className="relative flex items-center">
              <input
                type="number"
                min={isDeposit ? "1000" : "5000"}
                step={isDeposit ? "1000" : "5000"}
                value={amountStr}
                onChange={(e) => setAmountStr(e.target.value)}
                className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border rounded-2xl font-mono text-lg font-extrabold text-slate-900 dark:text-white focus:outline-none focus:ring-2 pr-28 transition-all ${
                  !isDeposit && (!isWithdrawalMinValid || !isWithdrawalMultipleValid || !isWithdrawalBalanceValid)
                    ? 'border-rose-400 dark:border-rose-500 focus:ring-rose-500'
                    : 'border-slate-200 dark:border-slate-700 focus:ring-emerald-500'
                }`}
                required
              />
              <span className="absolute right-4 text-sm font-bold text-slate-500 dark:text-slate-400 font-mono">
                XAF / FCFA
              </span>
            </div>

            {/* Stepper buttons for Cash Out */}
            {!isDeposit && (
              <div className="flex items-center gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => handleStepAmount(-5000)}
                  className="flex-1 py-1.5 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 rounded-xl font-bold flex items-center justify-center gap-1 transition-colors text-xs"
                >
                  <Minus className="w-3.5 h-3.5" /> - 5,000 XAF
                </button>
                <button
                  type="button"
                  onClick={() => handleStepAmount(5000)}
                  className="flex-1 py-1.5 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 rounded-xl font-bold flex items-center justify-center gap-1 transition-colors text-xs"
                >
                  <Plus className="w-3.5 h-3.5" /> + 5,000 XAF
                </button>
              </div>
            )}

            {/* Validation warning status */}
            {!isDeposit && (
              <div className="mt-2 space-y-1 text-[11px]">
                {!isWithdrawalMinValid && (
                  <p className="text-rose-600 dark:text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> Minimum withdrawal is 5,000 XAF.
                  </p>
                )}
                {isWithdrawalMinValid && !isWithdrawalMultipleValid && (
                  <p className="text-amber-600 dark:text-amber-400 flex items-center gap-1 font-semibold">
                    <AlertCircle className="w-3.5 h-3.5" /> Amount must be a multiple of 5,000 XAF (e.g. {Math.floor(currentAmount / 5000) * 5000} or {(Math.floor(currentAmount / 5000) + 1) * 5000} XAF).
                  </p>
                )}
                {!isWithdrawalBalanceValid && (
                  <p className="text-rose-600 dark:text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> Amount exceeds available balance ({formatFCFA(user.walletBalance)}).
                  </p>
                )}
                {isWithdrawalValid && (
                  <p className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Valid 5,000 XAF increment withdrawal.
                  </p>
                )}
              </div>
            )}

            {/* Quick preset chips */}
            <div className="mt-2.5">
              <span className="text-[11px] text-slate-500 block mb-1">Quick Select:</span>
              <div className="flex flex-wrap gap-1.5">
                {(isDeposit ? depositPresets : withdrawalPresets).map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => handleQuickAmount(val)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
                      currentAmount === val
                        ? 'bg-slate-900 text-white dark:bg-emerald-600 dark:text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-750'
                    }`}
                  >
                    {val.toLocaleString()} XAF
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block font-bold text-slate-900 dark:text-white text-xs mb-1.5">
              {isDeposit ? 'Deposit Rail (Cash In)' : 'Payout Destination (Cash Out)'}
            </label>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {paymentMethods.map((pm) => (
                <label
                  key={pm.id}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors text-xs ${
                    selectedMethod === pm.name
                      ? 'border-slate-900 dark:border-emerald-500 bg-slate-50 dark:bg-slate-800/80 ring-1 ring-slate-900/10 dark:ring-emerald-500/20'
                      : 'border-slate-200 dark:border-slate-700/80 hover:bg-slate-50/50 dark:hover:bg-slate-850'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
                      <pm.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block">{pm.name}</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">{pm.tag}</span>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="methodSelect"
                    checked={selectedMethod === pm.name}
                    onChange={() => setSelectedMethod(pm.name)}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Account Details / Phone Number */}
          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 text-xs mb-1">
              {selectedMethod.includes('Mobile') ? 'Mobile Money Number' : 'Account / RIB Details'}
            </label>
            <input
              type="text"
              value={accountDetails}
              onChange={(e) => setAccountDetails(e.target.value)}
              placeholder="e.g. +237 6xx xx xx xx"
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
              required
            />
          </div>

          {/* Security & Processing badge */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700 flex items-start gap-2 text-slate-500 dark:text-slate-400 text-[11px]">
            <Lock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p>
              {isDeposit 
                ? 'Mobile Money and Wire deposits are secured via 256-bit encrypted escrow with 0% platform fee.' 
                : 'Cash out requests in 5,000 XAF steps are reviewed automatically and dispatched to your Mobile Money or Bank wallet.'}
            </p>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-3 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isProcessing || !isValid}
              className={`flex-1 py-3 font-bold rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-1.5 ${
                isValid
                  ? 'bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 text-white cursor-pointer'
                  : 'bg-slate-300 dark:bg-slate-800 text-slate-500 dark:text-slate-500 cursor-not-allowed'
              }`}
            >
              {isProcessing 
                ? 'Processing Transfer...' 
                : isDeposit 
                  ? `Cash In ${currentAmount ? formatFCFA(currentAmount) : ''}` 
                  : `Cash Out ${currentAmount ? formatFCFA(currentAmount) : ''}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
