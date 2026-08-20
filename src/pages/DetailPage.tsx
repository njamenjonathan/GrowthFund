import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  Bookmark,
  Building,
  ChevronRight,
  Download,
  FileText,
  Lock,
  MapPin,
  Share2,
  ShieldCheck,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useApp } from '../context/AppContext';
import { OpportunityImage } from '../components/OpportunityImage';
import { TierLadder } from '../components/TierLadder';
import {
  MIN_INVESTMENT,
  effectiveRate,
  lockMonthsFor,
  tierForAmount,
} from '../lib/investmentTiers';
import { useI18n } from '../i18n/LanguageContext';
import { TranslationKey } from '../i18n/translations';
import {
  formatAxis,
  formatDate,
  formatFCFA,
  formatPercent,
  formatShortFCFA,
} from '../utils/format';

type Tab = 'overview' | 'financials' | 'risks' | 'documents' | 'timeline';

const TABS: { id: Tab; labelKey: TranslationKey }[] = [
  { id: 'overview', labelKey: 'detail.tab.overview' },
  { id: 'financials', labelKey: 'detail.tab.financials' },
  { id: 'risks', labelKey: 'detail.tab.risks' },
  { id: 'documents', labelKey: 'detail.tab.documents' },
  { id: 'timeline', labelKey: 'detail.tab.timeline' },
];

const SEVERITY_TONE = {
  Low: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300',
  Medium: 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300',
  High: 'bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300',
} as const;

export const DetailPage: React.FC = () => {
  const { t, tr, language } = useI18n();
  const {
    selectedOpportunityId,
    opportunities,
    navigate,
    openInvestModal,
    savedOpportunityIds,
    toggleSaveOpportunity,
    addToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [simulationAmount, setSimulationAmount] = useState(MIN_INVESTMENT);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const opportunity = opportunities.find((item) => item.id === selectedOpportunityId);

  const averageYield = opportunity
    ? (opportunity.projectedReturnMin + opportunity.projectedReturnMax) / 2
    : 0;

  const projectionData = useMemo(() => {
    if (!opportunity) return [];
    const annual = (simulationAmount * averageYield) / 100;
    return Array.from({ length: 4 }, (_, year) => ({
      year: `${t('detail.year')} ${year}`,
      total: simulationAmount + annual * year,
    }));
  }, [opportunity, simulationAmount, averageYield, t]);

  if (!opportunity) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-4">
        <p className="text-sm text-slate-600 dark:text-slate-400">{t('detail.notFound')}</p>
        <button
          type="button"
          onClick={() => navigate('marketplace')}
          className="px-5 py-2.5 bg-slate-900 dark:bg-emerald-700 text-white text-sm font-bold rounded-xl"
        >
          {t('detail.backToMarket')}
        </button>
      </div>
    );
  }

  // Hero first, then the gallery; de-duplicated in case a URL repeats.
  const gallery = Array.from(new Set([opportunity.imageUrl, ...opportunity.galleryImages]));
  const activeImage = selectedImage && gallery.includes(selectedImage) ? selectedImage : gallery[0];
  const setActiveImage = setSelectedImage;

  const simulationTier = tierForAmount(simulationAmount);
  const simulationLockMonths = lockMonthsFor(simulationAmount);
  const simulationRate = effectiveRate(
    simulationAmount,
    opportunity.projectedReturnMin,
    opportunity.projectedReturnMax,
  );
  const simulationAnnual = (simulationAmount * simulationRate) / 100;

  const isSaved = savedOpportunityIds.includes(opportunity.id);
  const percentFunded = Math.min(
    100,
    Math.round((opportunity.amountRaised / opportunity.fundingGoal) * 100),
  );
  const title = tr(opportunity.title);

  const handleShare = async () => {
    // The hash router means this URL actually reopens this opportunity;
    // previously it copied a URL that always landed on the home page.
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title, text: tr(opportunity.tagline), url });
        return;
      }
      await navigator.clipboard.writeText(url);
      addToast(t('toast.linkCopied'), 'info');
    } catch {
      // A cancelled share sheet is not a failure worth reporting; only a
      // genuinely unavailable clipboard is.
      if (!navigator.share) addToast(t('toast.copyFailed'), 'error');
    }
  };

  const metricCard = 'p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => navigate('marketplace')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          {t('opp.back')}
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleShare}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Share2 className="w-4 h-4" aria-hidden="true" />
            <span className="hidden sm:inline">{t('opp.share')}</span>
          </button>

          <button
            type="button"
            onClick={() => toggleSaveOpportunity(opportunity.id)}
            aria-pressed={isSaved}
            className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors ${
              isSaved
                ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} aria-hidden="true" />
            <span className="hidden sm:inline">{isSaved ? t('opp.saved') : t('opp.save')}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-8 min-w-0">
          <header className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-slate-900 text-white dark:bg-emerald-700">
                {t(`market.category.${opportunity.category.replace(' ', '')}` as TranslationKey)}
              </span>
              <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300">
                {tr(opportunity.securityStructure)}
              </span>
              <span
                className={`px-3 py-1 rounded-lg text-xs font-semibold ${SEVERITY_TONE[opportunity.riskLevel]}`}
              >
                {t(`opp.risk.${opportunity.riskLevel}` as TranslationKey)}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-display leading-tight">
              {title}
            </h1>

            <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              {tr(opportunity.tagline)}
            </p>

            <ul className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500 dark:text-slate-400 pt-1">
              <li className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-200">
                <Building className="w-3.5 h-3.5" aria-hidden="true" />
                {t('opp.sponsor')}: {tr(opportunity.sponsor)}
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                {tr(opportunity.location)}
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                {t('opp.assetBacked')}
              </li>
            </ul>
          </header>

          <div className="relative rounded-3xl overflow-hidden h-56 sm:h-80 w-full bg-slate-100 dark:bg-slate-800">
            <OpportunityImage
              src={activeImage}
              category={opportunity.category}
              seed={opportunity.id}
              loading="eager"
              className="w-full h-full"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"
            />
            <p className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 text-white text-xs">
              <span className="px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-xl font-medium">
                {t('opp.assetBacked')}
              </span>
              <span className="font-mono text-emerald-400 font-bold text-sm">
                {formatPercent(opportunity.projectedReturnMin, language)}–
                {formatPercent(opportunity.projectedReturnMax, language)} {t('opp.perAnnum')}
              </span>
            </p>
          </div>

          {gallery.length > 1 && (
            <div
              role="group"
              aria-label={t('detail.gallery')}
              className="flex gap-2.5 overflow-x-auto scrollbar-none -mt-4"
            >
              {gallery.map((image, index) => {
                const isActive = image === activeImage;
                return (
                  <button
                    key={image}
                    type="button"
                    onClick={() => setActiveImage(image)}
                    aria-pressed={isActive}
                    aria-label={t('detail.galleryImage', { index: index + 1 })}
                    className={`shrink-0 rounded-xl overflow-hidden border-2 transition-colors ${
                      isActive
                        ? 'border-emerald-600 dark:border-emerald-400'
                        : 'border-transparent hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <OpportunityImage
                      src={image}
                      category={opportunity.category}
                      seed={`${opportunity.id}-${index}`}
                      className="w-24 h-16"
                    />
                  </button>
                );
              })}
            </div>
          )}

          <div className="bg-red-50/90 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-2xl p-5 text-xs text-red-900 dark:text-red-200 space-y-2">
            <p className="flex items-center gap-2 font-bold text-red-800 dark:text-red-300">
              <AlertTriangle className="w-4 h-4 shrink-0" aria-hidden="true" />
              {t('detail.riskDisclosure')}
            </p>
            <p className="leading-relaxed">
              {t('detail.riskDisclosureBody', {
                min: opportunity.projectedReturnMin,
                max: opportunity.projectedReturnMax,
              })}
            </p>
          </div>

          <div>
            <div
              role="tablist"
              aria-label={t('detail.tabsLabel')}
              className="border-b border-slate-200 dark:border-slate-800 flex items-center gap-1 overflow-x-auto scrollbar-none"
            >
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  id={`tab-${tab.id}`}
                  aria-selected={activeTab === tab.id}
                  aria-controls={`panel-${tab.id}`}
                  tabIndex={activeTab === tab.id ? 0 : -1}
                  onClick={() => setActiveTab(tab.id)}
                  onKeyDown={(event) => {
                    // Arrow-key navigation, as expected of a tablist.
                    const index = TABS.findIndex((item) => item.id === activeTab);
                    if (event.key === 'ArrowRight') {
                      setActiveTab(TABS[(index + 1) % TABS.length].id);
                    } else if (event.key === 'ArrowLeft') {
                      setActiveTab(TABS[(index - 1 + TABS.length) % TABS.length].id);
                    }
                  }}
                  className={`py-3 px-4 text-xs font-bold whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab.id
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
              id={`panel-${activeTab}`}
              aria-labelledby={`tab-${activeTab}`}
              tabIndex={0}
              className="pt-6 focus:outline-none gf-animate-fade-in"
              key={activeTab}
            >
              {activeTab === 'overview' && (
                <div className="space-y-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  <section className="space-y-3">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                      {t('detail.about')}
                    </h2>
                    {/* Was `opportunity.description` — a field that does not exist,
                        so this paragraph rendered empty on every offering. */}
                    <p>{tr(opportunity.overview)}</p>
                  </section>

                  <section className="space-y-3">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                      {t('detail.keyTerms')}
                    </h3>
                    <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {[
                        {
                          label: t('opp.projectedYield'),
                          value: `${formatPercent(opportunity.projectedReturnMin, language)}–${formatPercent(opportunity.projectedReturnMax, language)}`,
                          accent: true,
                        },
                        { label: t('opp.horizon'), value: tr(opportunity.durationYears) },
                        {
                          label: t('opp.distribution'),
                          value: t(`opp.freq.${opportunity.distributionFrequency}` as TranslationKey),
                        },
                        {
                          label: t('opp.minTicket'),
                          value: formatFCFA(opportunity.minInvestment, language),
                        },
                        { label: t('opp.security'), value: tr(opportunity.securityStructure) },
                        { label: t('opp.escrow'), value: tr(opportunity.escrowAgent) },
                      ].map((item) => (
                        <div key={item.label} className={metricCard}>
                          <dt className="text-[11px] text-slate-500 dark:text-slate-400 uppercase font-semibold">
                            {item.label}
                          </dt>
                          <dd
                            className={`text-sm font-bold mt-0.5 ${
                              item.accent
                                ? 'font-mono text-emerald-700 dark:text-emerald-400'
                                : 'text-slate-900 dark:text-white'
                            }`}
                          >
                            {item.value}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </section>

                  {/* The tier rule belongs on the offering itself, not only
                      inside the invest dialog: it changes what the quoted
                      yield band actually means for a given allocation. */}
                  <section className="space-y-3">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                      {t('detail.tierTitle')}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {t('tier.ladderBody')}
                    </p>
                    <TierLadder
                      projectedReturnMin={opportunity.projectedReturnMin}
                      projectedReturnMax={opportunity.projectedReturnMax}
                    />
                  </section>

                  <section className="space-y-3">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                      {t('detail.useOfFunds')}
                    </h3>
                    {/* Was `opportunity.useOfFunds.map(...)` — undefined, which
                        threw a TypeError and blanked the entire page. The real
                        field is businessPlan.useOfProceeds. */}
                    <ul className="space-y-2.5">
                      {opportunity.businessPlan.useOfProceeds.map((item) => (
                        <li key={tr(item.label)} className="space-y-1">
                          <div className="flex justify-between gap-3 text-xs font-medium text-slate-700 dark:text-slate-300">
                            <span>{tr(item.label)}</span>
                            <span className="font-mono font-bold shrink-0">
                              {item.percentage}% ·{' '}
                              {formatShortFCFA(
                                (opportunity.fundingGoal * item.percentage) / 100,
                                language,
                              )}
                            </span>
                          </div>
                          <div
                            role="progressbar"
                            aria-valuenow={item.percentage}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-label={tr(item.label)}
                            className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden"
                          >
                            <div
                              className="bg-slate-900 dark:bg-emerald-500 h-full rounded-full transition-[width] duration-700"
                              style={{ width: `${item.percentage}%` }}
                            />
                          </div>
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section className={`${metricCard} space-y-2`}>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {t('detail.sponsorBackground')}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {tr(opportunity.sponsorNote)}
                    </p>
                  </section>

                  <section className={`${metricCard} space-y-2`}>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {t('detail.marketOpportunity')}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {tr(opportunity.businessPlan.marketOpportunity)}
                    </p>
                  </section>
                </div>
              )}

              {activeTab === 'financials' && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                      {t('detail.projectionTitle')}
                    </h2>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {t('detail.projectionBody', {
                        amount: formatFCFA(simulationAmount, language),
                        rate: averageYield.toFixed(1),
                      })}
                    </p>
                  </div>

                  <div className="p-4 sm:p-5 bg-white dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <div className="h-56 sm:h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={projectionData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                          <defs>
                            <linearGradient id="yieldGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                              <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#94A3B8" opacity={0.2} />
                          <XAxis dataKey="year" stroke="#94A3B8" fontSize={11} />
                          <YAxis
                            stroke="#94A3B8"
                            fontSize={11}
                            width={52}
                            tickFormatter={(value: number) => formatAxis(value, language)}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#0F172A',
                              borderRadius: '12px',
                              border: 'none',
                              color: '#fff',
                              fontSize: '12px',
                            }}
                            formatter={(value: unknown) => [
                              formatFCFA(Number(value) || 0, language),
                              t('detail.projectedValue'),
                            ]}
                          />
                          <Area
                            type="monotone"
                            dataKey="total"
                            stroke="#10B981"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#yieldGradient)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* The `financials` block existed in the data all along but
                      was never rendered anywhere in the old page. */}
                  <section className="space-y-3">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                      {t('detail.financialSummary')}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {tr(opportunity.financials.summary)}
                    </p>

                    <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
                      <table className="w-full text-left text-xs min-w-[30rem]">
                        <thead className="bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-white">
                          <tr>
                            <th scope="col" className="p-3 font-bold">{t('detail.year')}</th>
                            <th scope="col" className="p-3 font-bold">{t('detail.revenue')}</th>
                            <th scope="col" className="p-3 font-bold">{t('detail.noi')}</th>
                            <th scope="col" className="p-3 font-bold">
                              {t('detail.projectedDistribution')}
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          {opportunity.financials.metrics.map((metric) => (
                            <tr key={metric.year}>
                              <th scope="row" className="p-3 font-bold text-slate-900 dark:text-white text-left">
                                {metric.year}
                              </th>
                              <td className="p-3 font-mono text-slate-600 dark:text-slate-300">
                                {formatShortFCFA(metric.revenue, language)}
                              </td>
                              <td className="p-3 font-mono text-slate-600 dark:text-slate-300">
                                {formatShortFCFA(metric.netOperatingIncome, language)}
                              </td>
                              <td className="p-3 font-mono font-bold text-emerald-700 dark:text-emerald-400">
                                {formatPercent(metric.projectedDistribution, language)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <p className={`${metricCard} text-xs text-slate-600 dark:text-slate-400`}>
                      <strong className="text-slate-900 dark:text-white block mb-1">
                        {t('detail.feeStructure')}
                      </strong>
                      {tr(opportunity.financials.feeStructure)}
                    </p>
                  </section>

                  <section className="space-y-3">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                      {t('detail.scenarioTitle')}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className={`${metricCard} space-y-1`}>
                        <span className="font-semibold text-slate-500 dark:text-slate-400">{t('detail.scenario.down')}</span>
                        <p className="text-lg font-bold font-mono text-amber-600">
                          {formatPercent(opportunity.projectedReturnMin * 0.7, language)}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">{t('detail.scenario.downBody')}</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 space-y-1">
                        <span className="font-semibold text-emerald-800 dark:text-emerald-300">
                          {t('detail.scenario.base')}
                        </span>
                        <p className="text-lg font-bold font-mono text-emerald-700 dark:text-emerald-400">
                          {formatPercent(opportunity.projectedReturnMin, language)}–
                          {formatPercent(opportunity.projectedReturnMax, language)}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          {t('detail.scenario.baseBody')}
                        </p>
                      </div>
                      <div className={`${metricCard} space-y-1`}>
                        <span className="font-semibold text-slate-500 dark:text-slate-400">{t('detail.scenario.up')}</span>
                        <p className="text-lg font-bold font-mono text-slate-900 dark:text-white">
                          {formatPercent(opportunity.projectedReturnMax * 1.15, language)}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">{t('detail.scenario.upBody')}</p>
                      </div>
                    </div>
                  </section>
                </div>
              )}

              {activeTab === 'risks' && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                      {t('detail.riskTitle')}
                    </h2>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{t('detail.riskBody')}</p>
                  </div>

                  {/* Was `opportunity.riskFactors.map(...)` against a field that
                      existed in neither the type nor the data — the second
                      crash on this page. Real risk factors now ship with each
                      offering. */}
                  <ul className="space-y-3">
                    {opportunity.riskFactors.map((risk) => (
                      <li key={tr(risk.category)} className={`${metricCard} space-y-2 text-xs`}>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                            {tr(risk.category)}
                          </h3>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${SEVERITY_TONE[risk.severity]}`}
                          >
                            {t('detail.severity', {
                              level: t(`opp.risk.${risk.severity}` as TranslationKey),
                            })}
                          </span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                          {tr(risk.description)}
                        </p>
                        <p className="p-2.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 leading-relaxed">
                          <strong className="text-emerald-700 dark:text-emerald-400">
                            {t('detail.mitigation')}:{' '}
                          </strong>
                          {tr(risk.mitigation)}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === 'documents' && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                      {t('detail.docsTitle')}
                    </h2>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{t('detail.docsBody')}</p>
                  </div>

                  <ul className="space-y-2.5">
                    {opportunity.documents.map((document) => (
                      <li
                        key={document.id}
                        className={`${metricCard} flex flex-wrap items-center justify-between gap-3 text-xs`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span
                            aria-hidden="true"
                            className="p-2 rounded-lg bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 shrink-0"
                          >
                            <FileText className="w-4 h-4" />
                          </span>
                          <div className="min-w-0">
                            {/* Was `doc.title` — the field is `name`, so every
                                document row rendered a blank label. */}
                            <p className="font-bold text-slate-900 dark:text-white truncate">
                              {tr(document.name)}
                            </p>
                            <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                              {document.type} · {document.size} · {formatDate(document.date, language)}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => addToast(t('toast.docDownload'), 'info')}
                          aria-label={t('detail.downloadAria', { name: tr(document.name) })}
                          className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 font-bold flex items-center gap-1.5 shrink-0 transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" aria-hidden="true" />
                          {t('detail.download')}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === 'timeline' && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                      {t('detail.timelineTitle')}
                    </h2>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {t('detail.timelineBody')}
                    </p>
                  </div>

                  <ol className="space-y-5 relative border-l-2 border-slate-200 dark:border-slate-800 ml-2 pl-6 text-xs">
                    {opportunity.businessPlan.milestones.map((milestone) => (
                      <li key={tr(milestone.title)} className="relative space-y-1">
                        <span
                          aria-hidden="true"
                          className={`absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full ring-4 ring-slate-50 dark:ring-slate-950 ${
                            milestone.completed ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
                          }`}
                        />
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h3 className="font-bold text-slate-900 dark:text-white">
                            {tr(milestone.title)}
                          </h3>
                          <span className="text-slate-500 dark:text-slate-400">
                            {formatDate(milestone.date, language)}
                          </span>
                        </div>
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            milestone.completed
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          {milestone.completed ? t('detail.completed') : t('detail.upcoming')}
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sticky invest panel */}
        <aside className="lg:col-span-4 lg:sticky lg:top-24 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-lg space-y-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                {t('opp.projectedYield')}
              </span>
              <p className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-700 dark:text-emerald-400">
                  {formatPercent(opportunity.projectedReturnMin, language)}–
                  {formatPercent(opportunity.projectedReturnMax, language)}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t('opp.perAnnum')}</span>
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 italic">{t('opp.estimate')}</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-700 dark:text-slate-300">
                  <strong className="text-slate-900 dark:text-white">
                    {formatShortFCFA(opportunity.amountRaised, language)}
                  </strong>{' '}
                  {t('opp.raised')}
                </span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {percentFunded}%
                </span>
              </div>
              <div
                role="progressbar"
                aria-valuenow={percentFunded}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={t('opp.percentFunded', { percent: percentFunded })}
                className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden"
              >
                <div
                  className="bg-slate-900 dark:bg-emerald-500 h-full rounded-full transition-[width] duration-700"
                  style={{ width: `${percentFunded}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>
                  {t('opp.goal')}: {formatShortFCFA(opportunity.fundingGoal, language)}
                </span>
                <span>{t('opp.daysLeft', { count: opportunity.daysLeft })}</span>
              </div>
            </div>

            <dl className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs">
              <div>
                <dt className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold">{t('opp.minTicket')}</dt>
                <dd className="font-bold text-slate-900 dark:text-white font-mono truncate">
                  {formatFCFA(opportunity.minInvestment, language)}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold">{t('opp.horizon')}</dt>
                <dd className="font-bold text-slate-900 dark:text-white">
                  {tr(opportunity.durationYears)}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold">
                  {t('opp.distribution')}
                </dt>
                <dd className="font-bold text-slate-900 dark:text-white">
                  {t(`opp.freq.${opportunity.distributionFrequency}` as TranslationKey)}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold">
                  {t('opp.investors', { count: '' }).trim()}
                </dt>
                <dd className="font-bold text-slate-900 dark:text-white">
                  {opportunity.investorsCount}
                </dd>
              </div>
            </dl>

            <div className="space-y-2 text-xs">
              <label
                htmlFor="detail-simulation"
                className="font-bold text-slate-700 dark:text-slate-300 block"
              >
                {t('detail.simulate')}
              </label>
              <div className="relative">
                <input
                  id="detail-simulation"
                  type="number"
                  step={1_000}
                  min={Math.max(opportunity.minInvestment, MIN_INVESTMENT)}
                  value={simulationAmount}
                  onChange={(event) =>
                    setSimulationAmount(Math.max(0, Number(event.target.value) || 0))
                  }
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-sm font-bold text-slate-900 dark:text-white pr-16 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <span
                  aria-hidden="true"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 font-bold text-xs"
                >
                  XAF
                </span>
              </div>
              <dl className="space-y-1 text-[11px] text-slate-600 dark:text-slate-400">
                <div className="flex justify-between gap-2">
                  <dt>{t('tier.yours')}</dt>
                  <dd className="font-bold text-slate-900 dark:text-white">
                    {tr(simulationTier.name)} ·{' '}
                    {t('tier.months', { count: simulationLockMonths })}
                  </dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt>{t('invest.targetRate')}</dt>
                  <dd className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
                    {formatPercent(simulationRate, language)}
                  </dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt>{t('detail.estAnnualPayout')}</dt>
                  <dd className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
                    ~{formatFCFA(simulationAnnual, language)}
                    {t('common.perYear')}
                  </dd>
                </div>
              </dl>
            </div>

            <button
              type="button"
              onClick={() => openInvestModal(opportunity)}
              className="w-full py-4 bg-slate-900 dark:bg-emerald-700 hover:bg-slate-800 dark:hover:bg-emerald-600 text-white font-bold rounded-2xl text-sm transition-colors flex items-center justify-center gap-2"
            >
              {t('opp.investIn')}
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </button>

            <ul className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 space-y-1.5">
              <li className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0" aria-hidden="true" />
                {t('opp.escrow')}: {tr(opportunity.escrowAgent)}
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" aria-hidden="true" />
                Franc CFA (XAF)
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};
