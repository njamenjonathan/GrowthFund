import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { InvestmentOpportunity } from '../types';
import { 
  X, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldCheck, 
  Calendar, 
  TrendingUp, 
  ArrowRight,
  Info,
  Smartphone,
  Wallet,
  Building
} from 'lucide-react';
import { formatFCFA, formatXAF } from '../utils/currency';

export const InvestModal: React.FC = () => {
  const { 
    isInvestModalOpen, 
    setIsInvestModalOpen, 
    investingOpportunity, 
    executeInvestment,
    user,
    setCurrentPage,
    setDashboardTab
  } = useApp();

  const [amount, setAmount] = useState<number>(50000);
  const [customAmountStr, setCustomAmountStr] = useState<string>('50000');
  const [paymentSource, setPaymentSource] = useState<'balance' | 'momo'>('balance');
  const [agreedToRisk, setAgreedToRisk] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [receiptTxId, setReceiptTxId] = useState<string>('');

  if (!isInvestModalOpen || !investingOpportunity) return null;

  const minAmt = investingOpportunity.minInvestment;
  const presets = [25000, 50000, 100000, 250000, 500000, 1000000];

  // Calculate return estimates
  const estRate = (investingOpportunity.projectedReturnMin + investingOpportunity.projectedReturnMax) / 2;
  const durationYearsNum = investingOpportunity.durationCategory === '1-3 years' ? 2 : investingOpportunity.durationCategory === '3-5 years' ? 4 : 6;
  const projectedAnnualIncome = (amount * estRate) / 100;
  const projectedTotalReturn = projectedAnnualIncome * durationYearsNum;
  const projectedMaturityValue = amount + projectedTotalReturn;
  const annualFee = (amount * 0.005); // 0.5% fee

  const handlePresetClick = (val: number) => {
    setAmount(val);
    setCustomAmountStr(val.toString());
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setCustomAmountStr(val);
    const num = parseInt(val, 10);
    if (!isNaN(num)) {
      setAmount(num);
    } else {
      setAmount(0);
    }
  };

  const handleConfirm = () => {
    if (amount < minAmt) return;
    if (!agreedToRisk) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const success = executeInvestment(investingOpportunity.id, amount);
      setIsSubmitting(false);
      if (success) {
        setIsSuccess(true);
        setReceiptTxId(`GF-INV-${Math.floor(100000 + Math.random() * 900000)}`);
      }
    }, 900);
  };

  const handleClose = () => {
    setIsInvestModalOpen(false);
    setIsSuccess(false);
    setIsSubmitting(false);
  };

  const handleViewInDashboard = () => {
    handleClose();
    setDashboardTab('portfolio');
    setCurrentPage('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden transition-all animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-850">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              {investingOpportunity.category} Offering (Franc CFA)
            </span>
            <h3 id="modal-title" className="text-lg font-bold text-slate-900 dark:text-white">
              {isSuccess ? 'Investment Confirmed' : `Invest in ${investingOpportunity.title}`}
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success View */}
        {isSuccess ? (
          <div className="p-6 sm:p-8 space-y-6 text-center">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/80 rounded-full flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400 shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h4 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {formatFCFA(amount)} Invested Successfully
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                Your investment in <strong className="text-slate-900 dark:text-white">{investingOpportunity.title}</strong> is active. A formal receipt and certificate have been sent to {user.email}.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-left space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Transaction ID:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{receiptTxId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Target Projected Return:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {investingOpportunity.projectedReturnMin}% - {investingOpportunity.projectedReturnMax}% p.a.
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Distribution Schedule:</span>
                <span className="text-slate-900 dark:text-white font-medium">{investingOpportunity.distributionFrequency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Term Horizon:</span>
                <span className="text-slate-900 dark:text-white font-medium">{investingOpportunity.durationYears}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handleViewInDashboard}
                className="flex-1 py-3 px-4 bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 text-white font-bold rounded-xl text-sm transition-all shadow-md"
              >
                View in My Portfolio
              </button>
              <button
                onClick={handleClose}
                className="py-3 px-4 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold rounded-xl text-sm transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Form View */
          <div className="p-6 space-y-6">
            {/* Amount Selection */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-slate-900 dark:text-white">
                Select Investment Amount (Franc CFA / XAF)
              </label>

              {/* Quick Presets */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {presets.map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => handlePresetClick(val)}
                    className={`py-2 px-3 text-xs font-mono font-bold rounded-xl border transition-all ${
                      amount === val
                        ? 'border-slate-900 dark:border-emerald-500 bg-slate-900 dark:bg-emerald-600 text-white shadow-xs'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-750'
                    }`}
                  >
                    {val.toLocaleString()} FCFA
                  </button>
                ))}
              </div>

              {/* Custom Input */}
              <div className="relative">
                <input
                  type="text"
                  value={customAmountStr}
                  onChange={handleCustomChange}
                  placeholder="Custom amount in Franc CFA"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white font-mono text-lg font-bold focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-emerald-500 pr-24"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-xs font-mono">
                  FCFA / XAF
                </span>
              </div>
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Min ticket: {formatFCFA(minAmt)}</span>
                <span>Target raise: {formatFCFA(investingOpportunity.fundingGoal)}</span>
              </div>
            </div>

            {/* Projected Returns Calculator Summary */}
            <div className="bg-slate-50 dark:bg-slate-800/70 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  Target Return Rate
                </span>
                <span className="text-base font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
                  {investingOpportunity.projectedReturnMin}% - {investingOpportunity.projectedReturnMax}% p.a.
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block font-medium">Est. Annual Yield</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                    ~{formatFCFA(Math.round(projectedAnnualIncome))}/yr
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block font-medium">Est. Total at Maturity</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                    ~{formatFCFA(Math.round(projectedMaturityValue))}
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal italic">
                * Projected yields are estimates based on sponsor operational plans and are not guaranteed. Capital carries market risk.
              </p>
            </div>

            {/* Payment Source */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Funding Source
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentSource('balance')}
                  className={`p-3 text-left rounded-2xl border text-xs transition-all ${
                    paymentSource === 'balance'
                      ? 'border-slate-900 dark:border-emerald-500 bg-slate-100/80 dark:bg-slate-800 font-bold'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850'
                  }`}
                >
                  <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Wallet className="w-3.5 h-3.5 text-emerald-600" /> Cash Balance
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 font-mono text-[11px] mt-0.5">
                    Available: {formatFCFA(user.walletBalance)}
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentSource('momo')}
                  className={`p-3 text-left rounded-2xl border text-xs transition-all ${
                    paymentSource === 'momo'
                      ? 'border-slate-900 dark:border-emerald-500 bg-slate-100/80 dark:bg-slate-800 font-bold'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850'
                  }`}
                >
                  <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-blue-600" /> Mobile Money
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 font-mono text-[11px] mt-0.5">MTN / Orange / Wave</p>
                </button>
              </div>
            </div>

            {/* Mandatory Risk Acknowledgment Checkbox */}
            <div className="bg-red-50 dark:bg-red-950/40 p-4 rounded-2xl border border-red-200 dark:border-red-800 flex items-start gap-3">
              <input
                type="checkbox"
                id="risk-ack-checkbox"
                checked={agreedToRisk}
                onChange={(e) => setAgreedToRisk(e.target.checked)}
                className="mt-1 w-4 h-4 text-emerald-600 rounded border-slate-300 dark:border-slate-600 focus:ring-emerald-500"
              />
              <label htmlFor="risk-ack-checkbox" className="text-xs text-red-900 dark:text-red-300 leading-relaxed cursor-pointer select-none">
                <strong>Risk & Illiquidity Acknowledgment:</strong> I understand that private market investments are illiquid and carry real operational risks. Returns are forward-looking projections and never guaranteed. I have reviewed the offering terms.
              </label>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={amount < minAmt || !agreedToRisk || isSubmitting}
                className={`flex-1 py-3 px-6 rounded-xl text-white font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                  amount >= minAmt && agreedToRisk && !isSubmitting
                    ? 'bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 shadow-md cursor-pointer'
                    : 'bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Registering Allocation...
                  </span>
                ) : (
                  <>
                    Confirm Investment of {formatFCFA(amount)}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
