import React from 'react';
import { AlertTriangle, Award, Download, Lock, Printer, ShieldCheck } from 'lucide-react';
import { Modal } from './Modal';
import { GrowthFundLogo } from './GrowthFundLogo';
import { useApp } from '../context/AppContext';
import { PortfolioHolding } from '../types';
import { useI18n } from '../i18n/LanguageContext';
import { TranslationKey } from '../i18n/translations';
import { formatDate, formatFCFA, formatPercent } from '../utils/format';

interface CertificateModalProps {
  holding: PortfolioHolding | null;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * A holding statement the investor can print.
 *
 * The earlier version presented itself as a legal instrument: it carried
 * an invented regulatory licence number, an invented trade-register
 * number, a named real custodian bank, a named real audit firm and the
 * signature of a fictional compliance officer. None of those
 * relationships exist, and a document asserting them would mislead
 * anyone who was shown it. It is now clearly marked as a specimen and
 * states only what the app actually knows.
 */
export const CertificateModal: React.FC<CertificateModalProps> = ({ holding, isOpen, onClose }) => {
  const { t, tr, language } = useI18n();
  const { user, addToast } = useApp();

  if (!isOpen || !holding) return null;

  const reference = `GF-${holding.id.replace('hold-', '').toUpperCase().slice(0, 10)}`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      icon={
        <span aria-hidden="true" className="text-emerald-700 dark:text-emerald-400 shrink-0 pt-0.5">
          <Award className="w-5 h-5" />
        </span>
      }
      title={t('cert.title')}
      subtitle={tr(holding.opportunityTitle)}
      headerActions={
        <>
          <button
            type="button"
            onClick={() => window.print()}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-750 transition-colors"
            aria-label={t('cert.print')}
            title={t('cert.print')}
          >
            <Printer className="w-4 h-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => addToast(t('toast.docDownload'), 'info')}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-750 transition-colors"
            aria-label={t('cert.download')}
            title={t('cert.download')}
          >
            <Download className="w-4 h-4" aria-hidden="true" />
          </button>
        </>
      }
    >
      <div className="p-5 sm:p-8 bg-slate-50/50 dark:bg-slate-900 max-h-[70vh] overflow-y-auto">
        <div className="gf-print-target border-4 border-double border-slate-300 dark:border-slate-700 p-5 sm:p-8 rounded-2xl bg-white dark:bg-slate-850 space-y-6">
          <div className="text-center space-y-3 border-b border-slate-200 dark:border-slate-750 pb-5">
            <div className="flex justify-center">
              <GrowthFundLogo size="md" />
            </div>

            <p className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-800 text-[10px] font-extrabold tracking-widest text-amber-900 dark:text-amber-300">
              <AlertTriangle className="w-3 h-3" aria-hidden="true" />
              {t('cert.specimen')}
            </p>

            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-wide">
              {t('cert.heading')}
            </h3>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
              {t('cert.specimenBody')}
            </p>
          </div>

          <div className="space-y-4 text-xs text-slate-700 dark:text-slate-300">
            <p className="leading-relaxed">{t('cert.body')}</p>

            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <div>
                <dt className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">{t('cert.holder')}</dt>
                <dd className="font-bold text-slate-900 dark:text-white text-sm">{user.name}</dd>
                <dd className="text-[11px] text-slate-500 dark:text-slate-400 font-mono break-all">{user.email}</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">
                  {t('cert.investorId')}
                </dt>
                <dd className="font-mono font-bold text-slate-900 dark:text-white">
                  {user.accountNumber}
                </dd>
                <dd className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 mt-0.5">
                  <ShieldCheck className="w-3 h-3" aria-hidden="true" />
                  {t(`kyc.tier.${user.kycTier}` as TranslationKey)}
                </dd>
              </div>
            </dl>

            <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-x-auto">
              <table className="w-full text-left text-xs">
                <caption className="sr-only">{t('cert.title')}</caption>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  <Row label={t('cert.asset')} className="bg-slate-50/70 dark:bg-slate-800/60">
                    <span className="font-bold text-slate-900 dark:text-white">
                      {tr(holding.opportunityTitle)}
                    </span>
                  </Row>
                  <Row label={t('cert.assetClass')}>
                    <span className="text-slate-900 dark:text-white">{holding.category}</span>
                  </Row>
                  <Row label={t('cert.committed')} className="bg-slate-50/70 dark:bg-slate-800/60">
                    <span className="font-mono font-extrabold text-emerald-700 dark:text-emerald-400 text-sm">
                      {formatFCFA(holding.investedAmount, language)}
                    </span>
                  </Row>
                  <Row label={t('cert.valuation')}>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {formatFCFA(holding.currentValue, language)}
                    </span>
                  </Row>
                  <Row label={t('cert.horizon')} className="bg-slate-50/70 dark:bg-slate-800/60">
                    <span className="text-slate-900 dark:text-white">
                      {formatPercent(holding.projectedReturnRate, language)} {t('opp.perAnnum')} ·{' '}
                      {formatDate(holding.maturityDate, language)}
                    </span>
                  </Row>
                  <Row label={t('cert.custodian')}>
                    <span className="text-slate-900 dark:text-white inline-flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-blue-500 shrink-0" aria-hidden="true" />
                      {t('cert.custodianValue')}
                    </span>
                  </Row>
                </tbody>
              </table>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-750 flex flex-wrap items-end justify-between gap-4 text-[10px]">
            <div className="space-y-0.5">
              <p className="uppercase font-bold text-slate-500 dark:text-slate-400">{t('cert.serial')}</p>
              <p className="text-xs font-mono font-bold text-slate-900 dark:text-white">{reference}</p>
              <p className="text-slate-500 dark:text-slate-400">
                {t('cert.issueDate')}: {formatDate(holding.investedDate, language)}
              </p>
            </div>

            <p className="text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">{t('app.demoNotice')}</p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

const Row: React.FC<{ label: string; className?: string; children: React.ReactNode }> = ({
  label,
  className = '',
  children,
}) => (
  <tr className={className}>
    <th scope="row" className="p-3 font-semibold text-slate-500 dark:text-slate-400 text-left align-top w-2/5">
      {label}
    </th>
    <td className="p-3 align-top">{children}</td>
  </tr>
);
