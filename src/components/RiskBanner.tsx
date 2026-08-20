import React, { useState } from 'react';
import { AlertTriangle, X, ShieldAlert } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const RiskBanner: React.FC = () => {
  const [isDismissed, setIsDismissed] = useState(false);
  const { setCurrentPage } = useApp();

  if (isDismissed) return null;

  return (
    <aside
      aria-label="Investment Risk Disclosure"
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#FEF2F2] dark:bg-[#2A1515] border-t-2 border-l-4 border-red-600 dark:border-red-500 shadow-lg text-slate-800 dark:text-slate-200 transition-all"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs sm:text-sm">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" aria-hidden="true" />
          <p className="leading-relaxed">
            <strong className="font-semibold text-red-700 dark:text-red-400">Capital at risk.</strong>{' '}
            The value of investments and any projected returns can fall as well as rise and are never guaranteed. You may lose some or all of your invested principal. Past performance is not a reliable indicator of future returns.{' '}
            <button
              onClick={() => {
                setCurrentPage('compliance');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="font-medium underline text-red-800 dark:text-red-300 hover:text-red-950 dark:hover:text-white transition-colors ml-1 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Read full risk disclosure
            </button>
          </p>
        </div>
        <div className="flex items-center gap-3 self-end md:self-center shrink-0">
          <button
            onClick={() => setIsDismissed(true)}
            className="text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white underline px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-slate-400"
            aria-label="Dismiss risk disclosure banner"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </aside>
  );
};
