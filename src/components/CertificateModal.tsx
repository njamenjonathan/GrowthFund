import React, { useRef } from 'react';
import { useApp } from '../context/AppContext';
import { PortfolioHolding } from '../types';
import { 
  X, 
  Download, 
  Printer, 
  ShieldCheck, 
  Building2, 
  CheckCircle2, 
  Lock, 
  QrCode, 
  FileText, 
  Award,
  Calendar,
  Layers,
  Banknote
} from 'lucide-react';
import { formatFCFA } from '../utils/currency';
import { GrowthFundLogo } from './GrowthFundLogo';

interface CertificateModalProps {
  holding: PortfolioHolding | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ holding, isOpen, onClose }) => {
  const { user, addToast } = useApp();
  const certRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !holding) return null;

  const issueDate = holding.investedDate || '12 Oct 2024';
  const certId = `GF-CERT-${holding.id.replace('hold-', '').toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const handlePrint = () => {
    window.print();
    addToast('Opening certificate print dialog...', 'info');
  };

  const handleDownload = () => {
    addToast(`Official Investment Certificate (${certId}) generated successfully.`, 'success');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden transition-all animate-in fade-in zoom-in-95 duration-200 text-slate-800 dark:text-slate-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-850">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Official Certificate of Investment
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1 text-xs font-semibold"
              title="Print Certificate"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print</span>
            </button>
            <button
              onClick={handleDownload}
              className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors flex items-center gap-1 text-xs font-bold px-3"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Canvas */}
        <div className="p-6 sm:p-8 space-y-6 bg-slate-50/50 dark:bg-slate-900">
          <div 
            ref={certRef}
            className="border-4 border-double border-slate-300 dark:border-slate-700 p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-850 space-y-6 relative overflow-hidden shadow-inner"
          >
            {/* Background watermark badge */}
            <div className="absolute right-4 bottom-4 opacity-5 dark:opacity-5 pointer-events-none">
              <GrowthFundLogo size="lg" />
            </div>

            {/* Certificate Header */}
            <div className="text-center space-y-2 border-b border-slate-200 dark:border-slate-750 pb-5">
              <div className="flex justify-center mb-1">
                <GrowthFundLogo size="md" />
              </div>
              <p className="text-[10px] font-mono tracking-widest text-slate-500 dark:text-slate-400 uppercase">
                COSUMAF Reg. License #CMF-2021-GF09 • RCCM RC/DLA/2018/B/4192
              </p>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white font-serif tracking-wide">
                CERTIFICATE OF CO-INVESTMENT & BENEFICIAL OWNERSHIP
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                Issued under the Regional Financial Harmonization Framework for Franc CFA Private Asset Offerings.
              </p>
            </div>

            {/* Certificate Body */}
            <div className="space-y-4 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              <p>
                This certifies that the registered investor identified below holds a verified, fully paid-up beneficial ownership interest in the designated asset-backed vehicle:
              </p>

              {/* Investor Details Box */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Registered Holder</span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm">{user.name}</span>
                  <span className="block text-[11px] text-slate-500 font-mono">{user.email}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Investor ID / KYC Status</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{user.accountNumber}</span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 block mt-0.5">
                    <ShieldCheck className="w-3 h-3" />
                    {user.kycTier} Verified
                  </span>
                </div>
              </div>

              {/* Asset Details Grid */}
              <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    <tr className="bg-slate-50/70 dark:bg-slate-800/60">
                      <td className="p-3 font-semibold text-slate-500">Asset Designation</td>
                      <td className="p-3 font-bold text-slate-900 dark:text-white">{holding.opportunityTitle}</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-slate-500">Asset Class / Category</td>
                      <td className="p-3 font-medium text-slate-900 dark:text-white">{holding.category}</td>
                    </tr>
                    <tr className="bg-slate-50/70 dark:bg-slate-800/60">
                      <td className="p-3 font-semibold text-slate-500">Committed Capital (Principal)</td>
                      <td className="p-3 font-mono font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">
                        {formatFCFA(holding.investedAmount)}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-slate-500">Current Valuation / Status</td>
                      <td className="p-3 font-mono font-bold text-slate-900 dark:text-white">
                        {formatFCFA(holding.currentValue)} ({holding.status})
                      </td>
                    </tr>
                    <tr className="bg-slate-50/70 dark:bg-slate-800/60">
                      <td className="p-3 font-semibold text-slate-500">Target Distribution Horizon</td>
                      <td className="p-3 text-slate-900 dark:text-white">{holding.projectedReturnRate}% p.a. • Maturity: {holding.maturityDate}</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-slate-500">Custodian Bank & Escrow Trustee</td>
                      <td className="p-3 text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-blue-500" />
                        Ecobank Cameroon Custody & Trust S.A. (Segregated Account)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Signatures & Seal Footer */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-750 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
              <div className="space-y-1">
                <p className="text-[10px] text-slate-500 uppercase font-bold">Certificate Serial</p>
                <p className="text-xs font-mono font-bold text-slate-900 dark:text-white">{certId}</p>
                <p className="text-[10px] text-slate-400">Issue Date: {issueDate}</p>
              </div>

              {/* Seal Stamp */}
              <div className="flex items-center gap-4">
                <div className="border-2 border-dashed border-emerald-600/70 dark:border-emerald-500/70 rounded-full w-20 h-20 flex flex-col items-center justify-center p-1 text-center rotate-[-6deg] bg-emerald-50/50 dark:bg-emerald-950/20">
                  <span className="text-[8px] font-extrabold uppercase text-emerald-800 dark:text-emerald-400">GROWTHFUND</span>
                  <span className="text-[7px] text-emerald-700 dark:text-emerald-300 font-bold">OFFICIAL SEAL</span>
                  <span className="text-[6px] text-emerald-600 dark:text-emerald-400 font-mono">COSUMAF LIC.</span>
                </div>

                <div className="text-right">
                  <div className="font-serif italic font-bold text-slate-900 dark:text-white text-sm">
                    Jonathan Sterling
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium">Chief Legal & Compliance Officer</p>
                  <p className="text-[9px] text-emerald-600 dark:text-emerald-400 font-mono">Digitally Signed & Validated</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Action Bar */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex items-center justify-between">
          <p className="text-[11px] text-slate-500">
            Backed by registered collateral and verified by PwC Central Africa.
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl text-xs font-bold cursor-pointer"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};
