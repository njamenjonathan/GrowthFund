import React, { useMemo, useState } from 'react';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Award,
  Briefcase,
  CheckCircle2,
  ChevronRight,
  Coins,
  Copy,
  FileSpreadsheet,
  Gift,
  Plus,
  Share2,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  Wallet,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useApp } from '../context/AppContext';
import { CertificateModal } from '../components/CertificateModal';
import { DashboardTab, PortfolioHolding, TransactionType } from '../types';
import { MONTH_LABELS, PORTFOLIO_CHART_DATA } from '../data/mockData';
import { useI18n } from '../i18n/LanguageContext';
import { TranslationKey } from '../i18n/translations';
import {
  formatAxis,
  formatDate,
  formatFCFA,
  formatPercent,
  formatShortFCFA,
  formatXAF,
} from '../utils/format';

const TABS: { id: DashboardTab; labelKey: TranslationKey }[] = [
  { id: 'overview', labelKey: 'dash.tab.overview' },
  { id: 'portfolio', labelKey: 'dash.tab.portfolio' },
  { id: 'referrals', labelKey: 'dash.tab.referrals' },
  { id: 'transactions', labelKey: 'dash.tab.transactions' },
  { id: 'verification', labelKey: 'dash.tab.verification' },
];

/*
 * Transaction filters.
 *
 * The old chips used the literal string 'Distribution', but the type in
 * the data is 'Return Distribution' — so selecting that filter always
 * produced an empty ledger, and the "positive amount" test it shared
 * never matched either, showing every distribution as a debit.
 */
const TX_FILTERS: ('All' | TransactionType)[] = [
  'All',
  'Investment',
  'Return Distribution',
  'Deposit',
  'Withdrawal',
  'Referral Bonus',
];

const CREDIT_TYPES: TransactionType[] = ['Return Distribution', 'Deposit', 'Referral Bonus'];

const CATEGORY_COLOURS: Record<string, string> = {
  Energy: '#10B981',
  'Real Estate': '#3B82F6',
  Technology: '#8B5CF6',
  Healthcare: '#EC4899',
  Infrastructure: '#F59E0B',
  Agriculture: '#84CC16',
};

export const DashboardPage: React.FC = () => {
  const { t, tr, language } = useI18n();
  const {
    user,
    holdings,
    transactions,
    dashboardTab,
    setDashboardTab,
    openModal,
    navigate,
    navigateToOpportunity,
    applyReferralCode,
    simulateFriendReferral,
    addToast,
  } = useApp();

  const [txFilter, setTxFilter] = useState<'All' | TransactionType>('All');
  const [referralInput, setReferralInput] = useState('');
  const [hasCopied, setHasCopied] = useState(false);
  const [certificateHolding, setCertificateHolding] = useState<PortfolioHolding | null>(null);

  const allocation = useMemo(() => {
    const totals: Record<string, number> = {};
    holdings.forEach((holding) => {
      totals[holding.category] = (totals[holding.category] ?? 0) + holding.investedAmount;
    });
    return Object.entries(totals).map(([name, value]) => ({
      name,
      value,
      colour: CATEGORY_COLOURS[name] ?? '#64748B',
    }));
  }, [holdings]);

  const chartData = useMemo(
    () =>
      PORTFOLIO_CHART_DATA.map((point) => ({
        ...point,
        month: MONTH_LABELS[point.monthKey][language],
      })),
    [language],
  );

  const investedCapital = holdings.reduce((sum, h) => sum + h.investedAmount, 0);
  const earnedDistributions = holdings.reduce((sum, h) => sum + h.totalReturnsEarned, 0);
  const totalValue = holdings.reduce((sum, h) => sum + h.currentValue, 0) + user.walletBalance;

  const filteredTransactions = useMemo(
    () => (txFilter === 'All' ? transactions : transactions.filter((tx) => tx.type === txFilter)),
    [transactions, txFilter],
  );

  const copyToClipboard = async (value: string, successKey: TranslationKey) => {
    try {
      await navigator.clipboard.writeText(value);
      addToast(t(successKey), 'success');
      return true;
    } catch {
      // Clipboard access is denied in some embedded contexts; say so
      // rather than showing a success message for something that failed.
      addToast(t('toast.copyFailed'), 'error');
      return false;
    }
  };

  const handleCopyCode = async () => {
    if (await copyToClipboard(user.referralCode, 'toast.codeCopied')) {
      setHasCopied(true);
      window.setTimeout(() => setHasCopied(false), 2500);
    }
  };

  const handleApplyReferral = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!referralInput.trim()) return;
    // Awaited — previously `if (success)` tested a Promise object, which
    // is always truthy, so the field cleared even when the code was rejected.
    const succeeded = await applyReferralCode(referralInput);
    if (succeeded) setReferralInput('');
  };

  const exportCsv = () => {
    const header = ['date', 'type', 'description', 'amount_xaf', 'status', 'reference'];
    const rows = filteredTransactions.map((tx) => [
      tx.date,
      tx.type,
      // Quotes are doubled so a comma in a description cannot break the row.
      `"${(typeof tx.projectName === 'string' ? tx.projectName : tr(tx.projectName)).replace(/"/g, '""')}"`,
      String(tx.amount),
      tx.status,
      tx.referenceId,
    ]);

    const csv = [header, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([`﻿${csv}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    // The old handler only showed a toast claiming the ledger was
    // exported; nothing was ever produced. This writes a real file.
    const link = document.createElement('a');
    link.href = url;
    link.download = `growthfund-transactions-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    addToast(t('toast.exported'), 'success');
  };

  const card = 'bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800';
  const chartTooltipStyle = {
    backgroundColor: '#0F172A',
    borderRadius: '12px',
    border: 'none',
    color: '#fff',
    fontSize: '12px',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="flex items-center gap-3.5 min-w-0">
          <span
            aria-hidden="true"
            className="w-12 h-12 rounded-2xl bg-slate-900 dark:bg-emerald-700 text-white flex items-center justify-center font-bold text-lg shrink-0"
          >
            {user.initials}
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-display truncate">
                {t('dash.welcome', { name: user.name })}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center gap-1 shrink-0">
                <ShieldCheck className="w-3 h-3" aria-hidden="true" />
                {t(`kyc.tier.${user.kycTier}` as TranslationKey)}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
              {t('dash.account')}: {user.accountNumber}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => openModal('deposit')}
            className="px-4 py-2.5 bg-slate-900 dark:bg-emerald-700 hover:bg-slate-800 dark:hover:bg-emerald-600 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
          >
            <ArrowDownLeft className="w-4 h-4" aria-hidden="true" />
            {t('wallet.cashIn')}
          </button>
          <button
            type="button"
            onClick={() => openModal('withdraw')}
            className="px-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
          >
            <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
            {t('wallet.cashOut')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 gf-stagger">
        <StatCard
          icon={Coins}
          tone="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
          label={t('dash.totalValue')}
          value={formatFCFA(totalValue, language)}
          footnote={
            <span className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
              <TrendingUp className="w-3 h-3" aria-hidden="true" />
              {t('dash.yieldDistributed', { amount: formatFCFA(earnedDistributions, language) })}
            </span>
          }
        />
        <StatCard
          icon={Briefcase}
          tone="bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400"
          label={t('dash.activeCapital')}
          value={formatFCFA(investedCapital, language)}
          footnote={t('dash.acrossOfferings', { count: holdings.length })}
        />
        <StatCard
          icon={Wallet}
          tone="bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400"
          label={t('wallet.balance')}
          value={formatFCFA(user.walletBalance, language)}
          footnote={t('dash.readyToUse')}
        />
        <StatCard
          icon={Gift}
          tone="bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400"
          label={t('dash.referralBalance')}
          value={formatXAF(user.referralEarnings, language)}
          footnote={
            <span className="text-purple-600 dark:text-purple-400 font-bold flex items-center gap-1">
              <Users className="w-3 h-3" aria-hidden="true" />
              {t('dash.referredCount', { count: user.referralCount })}
            </span>
          }
          onClick={() => setDashboardTab('referrals')}
        />
      </div>

      <div
        role="tablist"
        aria-label={t('dash.tabsLabel')}
        className="border-b border-slate-200 dark:border-slate-800 flex items-center gap-1 overflow-x-auto scrollbar-none"
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`dash-tab-${tab.id}`}
            aria-selected={dashboardTab === tab.id}
            aria-controls={`dash-panel-${tab.id}`}
            tabIndex={dashboardTab === tab.id ? 0 : -1}
            onClick={() => setDashboardTab(tab.id)}
            onKeyDown={(event) => {
              const index = TABS.findIndex((item) => item.id === dashboardTab);
              if (event.key === 'ArrowRight') setDashboardTab(TABS[(index + 1) % TABS.length].id);
              if (event.key === 'ArrowLeft')
                setDashboardTab(TABS[(index - 1 + TABS.length) % TABS.length].id);
            }}
            className={`py-3.5 px-4 text-xs font-bold whitespace-nowrap border-b-2 transition-colors ${
              dashboardTab === tab.id
                ? 'border-slate-900 dark:border-emerald-500 text-slate-900 dark:text-white'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {t(tab.labelKey)}
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id={`dash-panel-${dashboardTab}`}
        aria-labelledby={`dash-tab-${dashboardTab}`}
        tabIndex={0}
        key={dashboardTab}
        className="focus:outline-none gf-animate-fade-in"
      >
        {dashboardTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <section className={`lg:col-span-8 ${card} p-5 sm:p-6 space-y-4`}>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white font-display">
                    {t('dash.growthChart')}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {t('dash.growthChartBody')}
                  </p>
                </div>

                <div className="h-56 sm:h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#94A3B8" opacity={0.2} />
                      <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} />
                      <YAxis
                        stroke="#94A3B8"
                        fontSize={11}
                        width={52}
                        tickFormatter={(value: number) => formatAxis(value, language)}
                      />
                      <Tooltip
                        contentStyle={chartTooltipStyle}
                        formatter={(value: unknown) => [
                          formatFCFA(Number(value) || 0, language),
                          t('dash.totalValue'),
                        ]}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#10B981"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#portfolioGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </section>

              <section className={`lg:col-span-4 ${card} p-5 sm:p-6 space-y-4 flex flex-col`}>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white font-display">
                    {t('dash.allocation')}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {t('dash.allocationBody')}
                  </p>
                </div>

                {allocation.length === 0 ? (
                  <p className="flex-1 flex items-center justify-center text-xs text-slate-500 dark:text-slate-400">
                    {t('dash.noHoldings')}
                  </p>
                ) : (
                  <>
                    <div className="h-40 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={allocation}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={42}
                            outerRadius={66}
                            paddingAngle={3}
                          >
                            {allocation.map((entry) => (
                              <Cell key={entry.name} fill={entry.colour} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={chartTooltipStyle}
                            formatter={(value: unknown) => [
                              formatFCFA(Number(value) || 0, language),
                              t('dash.principal'),
                            ]}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    <dl className="space-y-1.5 text-xs mt-auto">
                      {allocation.map((entry) => (
                        <div key={entry.name} className="flex items-center justify-between gap-2">
                          <dt className="flex items-center gap-2 text-slate-600 dark:text-slate-400 min-w-0">
                            <span
                              aria-hidden="true"
                              className="w-2.5 h-2.5 rounded-full shrink-0"
                              style={{ backgroundColor: entry.colour }}
                            />
                            <span className="truncate">
                              {t(`market.category.${entry.name.replace(' ', '')}` as TranslationKey)}
                            </span>
                          </dt>
                          <dd className="font-mono font-bold text-slate-900 dark:text-white shrink-0">
                            {formatShortFCFA(entry.value, language)}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </>
                )}
              </section>
            </div>

            <div className="p-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 rounded-3xl text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <h2 className="flex items-center gap-2 font-extrabold text-lg">
                  <Gift className="w-5 h-5 text-amber-300" aria-hidden="true" />
                  {t('ref.title')}
                </h2>
                <p className="text-xs text-emerald-50 max-w-xl leading-relaxed">{t('ref.body')}</p>
              </div>
              <button
                type="button"
                onClick={() => setDashboardTab('referrals')}
                className="px-4 py-2.5 bg-white text-slate-900 hover:bg-slate-100 font-bold rounded-xl text-xs transition-colors shrink-0"
              >
                {t('dash.viewAll')}
              </button>
            </div>

            <section className={`${card} overflow-hidden`}>
              <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    {t('dash.activeHoldings')}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{t('dash.activeHoldingsBody')}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setDashboardTab('portfolio')}
                  className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline shrink-0"
                >
                  {t('dash.viewAll')}
                </button>
              </div>

              {holdings.length === 0 ? (
                <EmptyHoldings onBrowse={() => navigate('marketplace')} />
              ) : (
                <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                  {holdings.map((holding) => (
                    <li key={holding.id}>
                      <button
                        type="button"
                        onClick={() => navigateToOpportunity(holding.opportunityId)}
                        className="w-full p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors text-left"
                      >
                        <div className="space-y-1 min-w-0">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            {t(`market.category.${holding.category.replace(' ', '')}` as TranslationKey)}
                          </span>
                          <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                            {tr(holding.opportunityTitle)}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {t('dash.maturity')}: {formatDate(holding.maturityDate, language)}
                          </p>
                        </div>

                        <div className="flex items-center gap-6 self-stretch sm:self-auto justify-between shrink-0">
                          <div className="text-left sm:text-right">
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold block">
                              {t('dash.principal')}
                            </span>
                            <span className="text-sm font-bold font-mono text-slate-900 dark:text-white">
                              {formatFCFA(holding.investedAmount, language)}
                            </span>
                          </div>
                          <div className="text-left sm:text-right">
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold block">
                              {t('dash.yieldReceived')}
                            </span>
                            <span className="text-sm font-bold font-mono text-emerald-700 dark:text-emerald-400">
                              +{formatFCFA(holding.totalReturnsEarned, language)}
                            </span>
                          </div>
                          <ChevronRight
                            className="w-4 h-4 text-slate-400 hidden sm:block"
                            aria-hidden="true"
                          />
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        )}

        {dashboardTab === 'portfolio' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {t('dash.holdingsTitle')}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">{t('dash.holdingsBody')}</p>
            </div>

            {holdings.length === 0 ? (
              <div className={`${card} overflow-hidden`}>
                <EmptyHoldings onBrowse={() => navigate('marketplace')} />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 gf-stagger">
                {holdings.map((holding) => (
                  <article key={holding.id} className={`${card} p-6 space-y-4`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                          {holding.status}
                        </span>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white mt-2">
                          <button
                            type="button"
                            onClick={() => navigateToOpportunity(holding.opportunityId)}
                            className="text-left hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                          >
                            {tr(holding.opportunityTitle)}
                          </button>
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {t(`market.category.${holding.category.replace(' ', '')}` as TranslationKey)}
                        </p>
                      </div>
                      <span className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-lg shrink-0">
                        {formatPercent(holding.projectedReturnRate, language)}
                      </span>
                    </div>

                    <dl className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl text-xs">
                      <div>
                        <dt className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold">
                          {t('dash.principal')}
                        </dt>
                        <dd className="font-bold text-slate-900 dark:text-white font-mono text-sm">
                          {formatFCFA(holding.investedAmount, language)}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold">
                          {t('dash.yieldReceived')}
                        </dt>
                        <dd className="font-bold text-emerald-700 dark:text-emerald-400 font-mono text-sm">
                          +{formatFCFA(holding.totalReturnsEarned, language)}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold">
                          {t('dash.nextDistribution')}
                        </dt>
                        <dd className="font-medium text-slate-900 dark:text-white">
                          {formatDate(holding.nextDistributionDate, language)}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold">
                          {t('dash.maturity')}
                        </dt>
                        <dd className="font-medium text-slate-900 dark:text-white">
                          {formatDate(holding.maturityDate, language)}
                        </dd>
                      </div>
                    </dl>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                      <span className="text-slate-400 text-[11px]">
                        {t('dash.subscribed')} {formatDate(holding.investedDate, language)}
                      </span>
                      <button
                        type="button"
                        onClick={() => setCertificateHolding(holding)}
                        className="px-2.5 py-1.5 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900 rounded-lg font-bold flex items-center gap-1 transition-colors text-[11px]"
                      >
                        <Award className="w-3.5 h-3.5" aria-hidden="true" />
                        {t('dash.certificate')}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}

        {dashboardTab === 'referrals' && (
          <div className="space-y-8 max-w-5xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white font-display">
                  {t('ref.title')}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
                  {t('ref.body')}
                </p>
              </div>

              <button
                type="button"
                onClick={() => void simulateFriendReferral()}
                title={t('ref.simulateHint')}
                className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-2 self-start sm:self-auto shrink-0"
              >
                <Sparkles className="w-4 h-4 text-amber-300" aria-hidden="true" />
                {t('ref.simulate')}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <section className={`md:col-span-2 ${card} p-6 sm:p-8 space-y-6`}>
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="p-3 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 rounded-2xl"
                  >
                    <Gift className="w-6 h-6" />
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {t('ref.yourCode')}
                  </h3>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <p className="text-center sm:text-left">
                    <span className="font-mono text-xl sm:text-2xl font-extrabold text-emerald-700 dark:text-emerald-400 tracking-wider break-all">
                      {user.referralCode}
                    </span>
                  </p>

                  <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                    <button
                      type="button"
                      onClick={handleCopyCode}
                      className="flex-1 sm:flex-none px-4 py-2.5 bg-slate-900 dark:bg-emerald-700 hover:bg-slate-800 dark:hover:bg-emerald-600 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
                    >
                      {hasCopied ? (
                        <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                      ) : (
                        <Copy className="w-4 h-4" aria-hidden="true" />
                      )}
                      {hasCopied ? t('ref.copied') : t('ref.copy')}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        void copyToClipboard(
                          `${window.location.origin}${window.location.pathname}#/?ref=${user.referralCode}`,
                          'toast.linkCopied',
                        )
                      }
                      className="px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
                    >
                      <Share2 className="w-4 h-4" aria-hidden="true" />
                      <span className="hidden sm:inline">{t('ref.shareLink')}</span>
                    </button>
                  </div>
                </div>

                <ol className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  {[
                    { title: t('ref.step1'), body: t('ref.step1Body'), highlight: false },
                    { title: t('ref.step2'), body: t('ref.step2Body'), highlight: false },
                    { title: t('ref.step3'), body: t('ref.step3Body'), highlight: true },
                  ].map((step, index) => (
                    <li
                      key={step.title}
                      className={`p-3.5 rounded-2xl border space-y-1 ${
                        step.highlight
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800'
                          : 'bg-slate-50 dark:bg-slate-850 border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className={`w-6 h-6 rounded-full text-white font-bold flex items-center justify-center text-xs ${
                          step.highlight ? 'bg-emerald-600' : 'bg-slate-900 dark:bg-slate-700'
                        }`}
                      >
                        {index + 1}
                      </span>
                      <p className="font-bold text-slate-900 dark:text-white pt-1">{step.title}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        {step.body}
                      </p>
                    </li>
                  ))}
                </ol>
              </section>

              <section className={`${card} p-6 space-y-5 flex flex-col justify-between`}>
                <div className="space-y-3">
                  <h3 className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
                    <Award className="w-5 h-5 text-amber-500" aria-hidden="true" />
                    {t('ref.apply')}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {t('ref.applyBody')}
                  </p>

                  {user.referredBy ? (
                    <p className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-px" aria-hidden="true" />
                      {t('ref.alreadyReferred', { code: user.referredBy })}
                    </p>
                  ) : (
                    <form onSubmit={handleApplyReferral} className="space-y-3 pt-1">
                      <label htmlFor="referral-input" className="sr-only">
                        {t('ref.apply')}
                      </label>
                      <input
                        id="referral-input"
                        type="text"
                        placeholder="GROWTH-XAF772"
                        value={referralInput}
                        onChange={(event) => setReferralInput(event.target.value.toUpperCase())}
                        required
                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-xs font-bold text-slate-900 dark:text-white uppercase focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      <button
                        type="submit"
                        className="w-full py-2.5 bg-slate-900 dark:bg-emerald-700 hover:bg-slate-800 dark:hover:bg-emerald-600 text-white font-bold rounded-xl text-xs transition-colors"
                      >
                        {t('ref.applyCta')}
                      </button>
                    </form>
                  )}
                </div>

                <p className="p-3.5 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  {t('ref.withdrawNotice')}
                </p>
              </section>
            </div>

            <section className={`${card} overflow-hidden`}>
              <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {t('ref.membersList', { count: user.referredFriends.length })}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {t('ref.totalEarned')}:{' '}
                    <strong className="text-emerald-700 dark:text-emerald-400 font-mono">
                      {formatXAF(user.referralEarnings, language)}
                    </strong>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => void simulateFriendReferral()}
                  className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                  {t('ref.simulate')}
                </button>
              </div>

              {user.referredFriends.length === 0 ? (
                <p className="p-8 text-center text-xs text-slate-500 dark:text-slate-400">{t('ref.none')}</p>
              ) : (
                <ul className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  {user.referredFriends.map((friend) => (
                    <li key={friend.id} className="p-4 sm:p-5 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <span
                          aria-hidden="true"
                          className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold flex items-center justify-center shrink-0"
                        >
                          {friend.name
                            .split(' ')
                            .map((part) => part[0])
                            .slice(0, 2)
                            .join('')}
                        </span>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 dark:text-white truncate">
                            {friend.name}
                          </p>
                          <p className="text-slate-500 dark:text-slate-400 text-[11px] truncate">
                            {friend.email} · {t('ref.joined', { date: formatDate(friend.date, language) })}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="font-mono font-bold text-emerald-700 dark:text-emerald-400 text-sm">
                          +{formatXAF(friend.bonus, language)}
                        </p>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                          {friend.status}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        )}

        {dashboardTab === 'transactions' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">{t('dash.ledger')}</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl">{t('dash.ledgerBody')}</p>
              </div>

              <button
                type="button"
                onClick={exportCsv}
                disabled={filteredTransactions.length === 0}
                className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 shrink-0 disabled:opacity-50 transition-colors"
              >
                <FileSpreadsheet className="w-4 h-4" aria-hidden="true" />
                {t('dash.exportCsv')}
              </button>
            </div>

            <div
              role="group"
              aria-label={t('dash.filterLabel')}
              className="flex gap-2 overflow-x-auto pb-1 text-xs scrollbar-none"
            >
              {TX_FILTERS.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setTxFilter(type)}
                  aria-pressed={txFilter === type}
                  className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
                    txFilter === type
                      ? 'bg-slate-900 dark:bg-emerald-700 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-750'
                  }`}
                >
                  {t(`tx.${type}` as TranslationKey)}
                </button>
              ))}
            </div>

            <div className={`${card} overflow-hidden`}>
              {filteredTransactions.length === 0 ? (
                <p className="p-8 text-center text-xs text-slate-500 dark:text-slate-400">{t('dash.noTransactions')}</p>
              ) : (
                <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredTransactions.map((tx) => {
                    const isCredit = CREDIT_TYPES.includes(tx.type);
                    const Icon =
                      tx.type === 'Investment'
                        ? Briefcase
                        : tx.type === 'Return Distribution'
                          ? TrendingUp
                          : tx.type === 'Deposit'
                            ? ArrowDownLeft
                            : tx.type === 'Withdrawal'
                              ? ArrowUpRight
                              : Gift;

                    return (
                      <li
                        key={tx.id}
                        className="p-4 sm:p-5 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <span
                            aria-hidden="true"
                            className={`p-2.5 rounded-xl shrink-0 ${
                              isCredit
                                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </span>

                          <div className="min-w-0">
                            <p className="flex flex-wrap items-center gap-2">
                              <span className="font-bold text-slate-900 dark:text-white text-sm truncate">
                                {typeof tx.projectName === 'string'
                                  ? tx.projectName
                                  : tr(tx.projectName)}
                              </span>
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 shrink-0">
                                {t(`tx.${tx.type}` as TranslationKey)}
                              </span>
                            </p>
                            <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5 truncate">
                              {formatDate(tx.date, language)} · {t('dash.reference')}: {tx.referenceId}
                            </p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <p
                            className={`font-mono text-sm font-bold ${
                              isCredit
                                ? 'text-emerald-700 dark:text-emerald-400'
                                : 'text-slate-900 dark:text-white'
                            }`}
                          >
                            {isCredit ? '+' : '−'}
                            {formatFCFA(tx.amount, language)}
                          </p>
                          <span
                            className={`text-[10px] font-bold ${
                              tx.status === 'Failed'
                                ? 'text-red-600 dark:text-red-400'
                                : tx.status === 'Processing'
                                  ? 'text-amber-600 dark:text-amber-400'
                                  : 'text-emerald-700 dark:text-emerald-400'
                            }`}
                          >
                            {t(`tx.status.${tx.status}` as TranslationKey)}
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        )}

        {dashboardTab === 'verification' && (
          <div className="space-y-6 max-w-3xl">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{t('kyc.title')}</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">{t('kyc.subtitle')}</p>
            </div>

            <div className={`${card} p-6 space-y-6`}>
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-xs">
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    aria-hidden="true"
                    className="p-2 bg-emerald-700 text-white rounded-xl shrink-0"
                  >
                    <ShieldCheck className="w-5 h-5" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-bold text-emerald-900 dark:text-emerald-200 text-sm">
                      {t('kyc.currentTier')}: {t(`kyc.tier.${user.kycTier}` as TranslationKey)}
                    </h3>
                    <p className="text-emerald-700 dark:text-emerald-400 mt-0.5">
                      {t('kyc.verified')}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => openModal('kyc')}
                  className="px-3.5 py-2 bg-white dark:bg-slate-850 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 rounded-xl font-bold hover:bg-emerald-100 dark:hover:bg-emerald-950 transition-colors shrink-0"
                >
                  {t('kyc.upgrade')}
                </button>
              </div>

              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-1">
                  <dt className="text-slate-500 dark:text-slate-400 font-bold">{t('kyc.retailLimit')}</dt>
                  <dd className="font-bold text-slate-900 dark:text-white text-base">
                    {formatFCFA(50_000_000, language)}
                  </dd>
                  <dd className="text-[11px] text-slate-400">{t('kyc.retailLimitBody')}</dd>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-1">
                  <dt className="text-slate-500 dark:text-slate-400 font-bold">{t('kyc.accreditedLimit')}</dt>
                  <dd className="font-bold text-slate-900 dark:text-white text-base">
                    {t('kyc.unlimited')}
                  </dd>
                  <dd className="text-[11px] text-slate-400">{t('kyc.accreditedLimitBody')}</dd>
                </div>
              </dl>

              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  {t('kyc.docsOnFile')}
                </h3>
                <ul className="space-y-2 text-xs">
                  {[
                    { label: t('kyc.doc.idVerified'), status: t('kyc.docStatus.valid') },
                    { label: t('kyc.doc.momoProof'), status: t('kyc.docStatus.active') },
                    { label: t('kyc.doc.terms'), status: t('kyc.docStatus.signed') },
                  ].map((item) => (
                    <li
                      key={item.label}
                      className="flex items-center justify-between gap-3 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850"
                    >
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {item.label}
                      </span>
                      <span className="text-emerald-700 dark:text-emerald-400 font-bold text-[11px] shrink-0">
                        {item.status}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      <CertificateModal
        holding={certificateHolding}
        isOpen={certificateHolding !== null}
        onClose={() => setCertificateHolding(null)}
      />
    </div>
  );
};

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  tone: string;
  label: string;
  value: string;
  footnote: React.ReactNode;
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, tone, label, value, footnote, onClick }) => {
  const content = (
    <>
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{label}</span>
        <span aria-hidden="true" className={`p-2 rounded-xl shrink-0 ${tone}`}>
          <Icon className="w-4 h-4" />
        </span>
      </div>
      <p className="text-xl sm:text-2xl font-extrabold font-mono text-slate-900 dark:text-white truncate">
        {value}
      </p>
      <p className="text-[11px] text-slate-500 dark:text-slate-400">{footnote}</p>
    </>
  );

  const className =
    'bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2 text-left w-full';

  return onClick ? (
    <button
      type="button"
      onClick={onClick}
      className={`${className} hover:border-emerald-500/60 hover:-translate-y-0.5 transition-all`}
    >
      {content}
    </button>
  ) : (
    <div className={className}>{content}</div>
  );
};

const EmptyHoldings: React.FC<{ onBrowse: () => void }> = ({ onBrowse }) => {
  const { t } = useI18n();
  return (
    <div className="p-10 text-center space-y-3">
      <Briefcase className="w-8 h-8 text-slate-400 mx-auto" aria-hidden="true" />
      <p className="text-sm font-bold text-slate-900 dark:text-white">{t('dash.noHoldings')}</p>
      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">{t('dash.noHoldingsBody')}</p>
      <button
        type="button"
        onClick={onBrowse}
        className="px-4 py-2.5 bg-slate-900 dark:bg-emerald-700 text-white text-xs font-bold rounded-xl"
      >
        {t('nav.opportunities')}
      </button>
    </div>
  );
};
