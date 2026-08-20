import React from 'react';
import { AlertCircle, ArrowUp, Lock, ShieldCheck } from 'lucide-react';
import { GrowthFundLogo } from './GrowthFundLogo';
import { useApp } from '../context/AppContext';
import { DashboardTab, PageRoute } from '../types';
import { useI18n } from '../i18n/LanguageContext';
import { TranslationKey } from '../i18n/translations';
import { LanguageSwitcher } from './LanguageSwitcher';

interface FooterLink {
  labelKey: TranslationKey;
  page: PageRoute;
  tab?: DashboardTab;
}

/**
 * Footer link groups.
 *
 * The previous footer had sixteen links, of which eleven pointed at just
 * two pages — four separate "Terms / Privacy / Risk / Regulatory" entries
 * all opened the same compliance page. Each entry now goes somewhere
 * distinct, including the dashboard tabs, which keeps the footer useful
 * as a second navigation surface rather than decorative filler.
 */
const GROUPS: { titleKey: TranslationKey; links: FooterLink[] }[] = [
  {
    titleKey: 'footer.platform',
    links: [
      { labelKey: 'nav.opportunities', page: 'marketplace' },
      { labelKey: 'dash.tab.overview', page: 'dashboard', tab: 'overview' },
      { labelKey: 'dash.tab.portfolio', page: 'dashboard', tab: 'portfolio' },
      { labelKey: 'dash.tab.transactions', page: 'dashboard', tab: 'transactions' },
    ],
  },
  {
    titleKey: 'footer.company',
    links: [
      { labelKey: 'nav.about', page: 'about' },
      { labelKey: 'nav.help', page: 'help' },
      { labelKey: 'dash.tab.referrals', page: 'dashboard', tab: 'referrals' },
      { labelKey: 'dash.tab.verification', page: 'dashboard', tab: 'verification' },
    ],
  },
  {
    titleKey: 'footer.legal',
    links: [
      { labelKey: 'legal.s1', page: 'compliance' },
      { labelKey: 'legal.s3', page: 'compliance' },
      { labelKey: 'legal.s4', page: 'compliance' },
      { labelKey: 'legal.s5', page: 'compliance' },
    ],
  },
];

export const Footer: React.FC = () => {
  const { t } = useI18n();
  const { navigate, setDashboardTab } = useApp();

  const go = (link: FooterLink) => {
    if (link.tab) setDashboardTab(link.tab);
    navigate(link.page, link.tab ? { tab: link.tab } : undefined);
  };

  return (
    <footer className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 pt-12 pb-28 lg:pb-12 gf-no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <button type="button" onClick={() => navigate('landing')} className="text-left rounded-xl">
              <GrowthFundLogo size="md" />
            </button>

            <p className="text-sm leading-relaxed max-w-sm">{t('footer.blurb')}</p>

            <ul className="flex flex-wrap items-center gap-4 text-xs pt-1">
              <li className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" aria-hidden="true" />
                {t('footer.encrypted')}
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" aria-hidden="true" />
                {t('footer.segregated')}
              </li>
            </ul>

            <LanguageSwitcher className="w-fit" />
          </div>

          {GROUPS.map((group) => (
            <nav key={group.titleKey} aria-label={t(group.titleKey)}>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
                {t(group.titleKey)}
              </h2>
              <ul className="space-y-2 text-sm">
                {group.links.map((link) => (
                  <li key={`${link.page}-${link.tab ?? ''}-${link.labelKey}`}>
                    <button
                      type="button"
                      onClick={() => go(link)}
                      className="text-left hover:text-slate-900 dark:hover:text-white hover:underline transition-colors rounded"
                    >
                      {t(link.labelKey)}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="border-t border-slate-200 dark:border-slate-800 pt-6 space-y-3 text-xs leading-relaxed">
          <div className="flex items-start gap-2 bg-slate-100/70 dark:bg-slate-900/70 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
            <p>
              <strong className="text-slate-800 dark:text-slate-200">
                {t('footer.disclaimerTitle')}:
              </strong>{' '}
              {t('footer.disclaimer')}
            </p>
          </div>

          <p>
            <strong className="text-slate-800 dark:text-slate-200">{t('footer.illiquidity')}:</strong>{' '}
            {t('footer.illiquidityBody')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <p>{t('footer.rights', { year: new Date().getFullYear() })}</p>

            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 font-bold hover:bg-white dark:hover:bg-slate-900 transition-colors"
            >
              <ArrowUp className="w-3.5 h-3.5" aria-hidden="true" />
              {t('footer.backToTop')}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
