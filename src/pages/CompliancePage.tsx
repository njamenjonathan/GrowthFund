import React from 'react';
import { AlertTriangle, Database, FileText, Lock, Scale, ShieldCheck } from 'lucide-react';
import { useI18n } from '../i18n/LanguageContext';
import { TranslationKey } from '../i18n/translations';

/**
 * Risk, custody and compliance.
 *
 * The previous version described a United States framework — SEC
 * Regulation D and Reg CF, FDIC-insured escrow, a named US broker-dealer,
 * dollar fee amounts and 1099 tax forms — on a platform whose entire
 * product is denominated in Franc CFA and aimed at CEMAC and UEMOA
 * investors. None of it applied. It now describes the regional framework
 * that does, and states the prototype's actual status up front.
 */

const SECTIONS: { id: string; titleKey: TranslationKey }[] = [
  { id: 'risks', titleKey: 'legal.s1' },
  { id: 'framework', titleKey: 'legal.s2' },
  { id: 'custody', titleKey: 'legal.s3' },
  { id: 'fees', titleKey: 'legal.s4' },
  { id: 'data', titleKey: 'legal.s5' },
];

export const CompliancePage: React.FC = () => {
  const { t, language } = useI18n();

  const riskFactors: { titleKey: TranslationKey; bodyKey: TranslationKey }[] = [
    { titleKey: 'legal.s1.illiquidity', bodyKey: 'legal.s1.illiquidityBody' },
    { titleKey: 'legal.s1.projections', bodyKey: 'legal.s1.projectionsBody' },
    { titleKey: 'legal.s1.execution', bodyKey: 'legal.s1.executionBody' },
    { titleKey: 'legal.s1.currency', bodyKey: 'legal.s1.currencyBody' },
  ];

  const fees: { labelKey: TranslationKey; rate: string; basisKey: TranslationKey; free?: boolean }[] = [
    { labelKey: 'legal.fee.signup', rate: t('legal.fee.free'), basisKey: 'legal.fee.signupBasis', free: true },
    { labelKey: 'legal.fee.transfer', rate: t('legal.fee.free'), basisKey: 'legal.fee.transferBasis', free: true },
    { labelKey: 'legal.fee.admin', rate: language === 'fr' ? '0,50 % / an' : '0.50% p.a.', basisKey: 'legal.fee.adminBasis' },
    { labelKey: 'legal.fee.sponsor', rate: language === 'fr' ? '1,5 % – 3,0 %' : '1.5% – 3.0%', basisKey: 'legal.fee.sponsorBasis' },
  ];

  const cardClass =
    'p-5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-1.5';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 text-slate-800 dark:text-slate-200">
      <header className="space-y-3 border-b border-slate-200 dark:border-slate-800 pb-6">
        <p className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
          {t('legal.eyebrow')}
        </p>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white font-display">
          {t('legal.title')}
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {t('legal.updated', { date: language === 'fr' ? 'août 2026' : 'August 2026' })}
        </p>
      </header>

      {/* Stated first, because it changes how everything below should be read. */}
      <div className="bg-amber-50 dark:bg-amber-950/40 border-l-4 border-amber-500 p-5 rounded-r-2xl space-y-2">
        <h2 className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-200 text-sm">
          <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden="true" />
          {t('legal.prototypeTitle')}
        </h2>
        <p className="text-xs sm:text-sm leading-relaxed text-amber-900 dark:text-amber-300">
          {t('legal.prototypeBody')}
        </p>
      </div>

      <div className="bg-red-50 dark:bg-red-950/40 border-l-4 border-red-600 p-5 rounded-r-2xl space-y-2">
        <h2 className="flex items-center gap-2 font-bold text-red-800 dark:text-red-300 text-sm">
          <AlertTriangle className="w-5 h-5 shrink-0 text-red-600 dark:text-red-400" aria-hidden="true" />
          {t('legal.riskNotice')}
        </h2>
        <p className="text-xs sm:text-sm leading-relaxed text-red-900 dark:text-red-300">
          {t('legal.riskNoticeBody')}
        </p>
      </div>

      {/* In-page contents: five sections is enough to be worth a jump list. */}
      <nav aria-label={t('legal.contents')} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
          {t('legal.contents')}
        </h2>
        <ol className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {SECTIONS.map((section, index) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className="flex items-center gap-2 py-1.5 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium hover:underline"
              >
                <span className="font-mono font-bold text-slate-500 dark:text-slate-400">{index + 1}.</span>
                {t(section.titleKey)}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <section id="risks" className="space-y-4 scroll-mt-24">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Scale className="w-5 h-5 text-emerald-600 shrink-0" aria-hidden="true" />
          1. {t('legal.s1')}
        </h2>

        <div className="space-y-3 text-xs sm:text-sm leading-relaxed">
          {riskFactors.map((item) => (
            <div key={item.titleKey} className={cardClass}>
              <h3 className="font-bold text-slate-900 dark:text-white">{t(item.titleKey)}</h3>
              <p className="text-slate-600 dark:text-slate-400">{t(item.bodyKey)}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="framework" className="space-y-4 scroll-mt-24">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" aria-hidden="true" />
          2. {t('legal.s2')}
        </h2>
        <div className="space-y-3 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          <p>{t('legal.s2.body')}</p>
          <p className={cardClass}>
            <strong className="text-slate-900 dark:text-white block mb-1">GrowthFund</strong>
            {t('legal.s2.notAdviser')}
          </p>
        </div>
      </section>

      <section id="custody" className="space-y-4 scroll-mt-24">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Lock className="w-5 h-5 text-emerald-600 shrink-0" aria-hidden="true" />
          3. {t('legal.s3')}
        </h2>
        <div className="space-y-3 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          <p>{t('legal.s3.body')}</p>
          <p>{t('legal.s3.refund')}</p>
        </div>
      </section>

      <section id="fees" className="space-y-4 scroll-mt-24">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-emerald-600 shrink-0" aria-hidden="true" />
          4. {t('legal.s4')}
        </h2>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[32rem]">
            <thead className="bg-slate-50 dark:bg-slate-850 font-bold text-slate-900 dark:text-white">
              <tr>
                <th scope="col" className="p-3.5">{t('legal.s4.category')}</th>
                <th scope="col" className="p-3.5">{t('legal.s4.rate')}</th>
                <th scope="col" className="p-3.5">{t('legal.s4.basis')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {fees.map((fee) => (
                <tr key={fee.labelKey}>
                  <th scope="row" className="p-3.5 font-medium text-left text-slate-800 dark:text-slate-200">
                    {t(fee.labelKey)}
                  </th>
                  <td
                    className={`p-3.5 font-bold ${
                      fee.free ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-900 dark:text-white'
                    }`}
                  >
                    {fee.rate}
                  </td>
                  <td className="p-3.5 text-slate-500 dark:text-slate-400">{t(fee.basisKey)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="data" className="space-y-4 scroll-mt-24">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Database className="w-5 h-5 text-emerald-600 shrink-0" aria-hidden="true" />
          5. {t('legal.s5')}
        </h2>
        <p className="text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          {t('legal.s5.body')}
        </p>
      </section>
    </div>
  );
};
