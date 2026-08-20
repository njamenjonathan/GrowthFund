import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertTriangle, Info, AlertCircle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
          info: <Info className="w-5 h-5 text-blue-500 shrink-0" />,
          warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
          error: <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />,
        };

        return (
          <div
            key={toast.id}
            className="pointer-events-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-xl flex items-start justify-between gap-3 text-xs text-slate-800 dark:text-slate-200 animate-in slide-in-from-right duration-200"
          >
            <div className="flex items-start gap-2.5">
              {icons[toast.type]}
              <p className="font-medium leading-tight mt-0.5">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
