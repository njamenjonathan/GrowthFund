import React, { useMemo, useState } from 'react';
import { AlertCircle, ArrowUpDown, Grid, List, Search, SlidersHorizontal, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { OpportunityCard } from '../components/OpportunityCard';
import { OpportunityImage } from '../components/OpportunityImage';
import { Category, DurationCategory, InvestmentOpportunity } from '../types';
import { useI18n } from '../i18n/LanguageContext';
import { TranslationKey } from '../i18n/translations';
import { formatFCFA, formatPercent, formatShortFCFA } from '../utils/format';

type SortKey = 'popular' | 'returnHigh' | 'endingSoon' | 'minLow';

const CATEGORIES: (Category | 'All')[] = [
  'All',
  'Energy',
  'Real Estate',
  'Technology',
  'Infrastructure',
  'Agriculture',
  'Healthcare',
];

const DURATIONS: (DurationCategory | 'All')[] = ['All', '1-3 years', '3-5 years', '5+ years'];
const RETURN_RANGES = ['All', 'lt8', '8to10', '10to12', 'gt12'] as const;
const MIN_RANGES = ['All', '5k', '25k', '100k'] as const;

type ReturnRange = (typeof RETURN_RANGES)[number];
type MinRange = (typeof MIN_RANGES)[number];

const categoryKey = (category: Category | 'All'): TranslationKey =>
  `market.category.${category.replace(' ', '')}` as TranslationKey;

const durationKey = (duration: DurationCategory | 'All'): TranslationKey =>
  duration === 'All' ? 'market.duration.All' : (`market.duration.${duration.replace(' years', '')}` as TranslationKey);

/** Strips accents so "energie" matches "énergie" and vice versa. */
const normalise = (value: string) =>
  value.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

export const MarketplacePage: React.FC = () => {
  const { t, tr, language } = useI18n();
  const { opportunities, navigateToOpportunity, openInvestModal } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState<Category | 'All'>('All');
  const [duration, setDuration] = useState<DurationCategory | 'All'>('All');
  const [returnRange, setReturnRange] = useState<ReturnRange>('All');
  const [minRange, setMinRange] = useState<MinRange>('All');
  const [sortBy, setSortBy] = useState<SortKey>('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterPanelOpen, setFilterPanelOpen] = useState(false);

  const filtered = useMemo(() => {
    const needle = normalise(searchQuery.trim());

    return opportunities
      .filter((opp) => {
        if (needle) {
          /*
           * Search previously read `opp.tags.some(...)`, but no opportunity
           * ever had a `tags` field — typing a single character into this
           * box threw "Cannot read properties of undefined (reading 'some')"
           * and blanked the page. Tags now exist in the data and every
           * searched field is built from values that are guaranteed present.
           */
          const searchable = [
            opp.title,
            opp.tagline,
            opp.sponsor,
            opp.location,
            ...opp.tags,
          ];

          // Both language variants are matched, so someone browsing in
          // English still finds a project by typing "solaire", and vice
          // versa. On a bilingual site people mix the two constantly.
          const haystack = normalise(
            [
              ...searchable.flatMap((value) => [value.en, value.fr]),
              opp.category,
            ].join(' '),
          );
          if (!haystack.includes(needle)) return false;
        }

        if (category !== 'All' && opp.category !== category) return false;
        if (duration !== 'All' && opp.durationCategory !== duration) return false;

        if (returnRange !== 'All') {
          const max = opp.projectedReturnMax;
          if (returnRange === 'lt8' && max >= 8) return false;
          if (returnRange === '8to10' && (max < 8 || max > 10)) return false;
          if (returnRange === '10to12' && (max < 10 || max > 12)) return false;
          if (returnRange === 'gt12' && max <= 12) return false;
        }

        if (minRange === '5k' && opp.minInvestment > 5_000) return false;
        if (minRange === '25k' && opp.minInvestment > 25_000) return false;
        if (minRange === '100k' && opp.minInvestment < 100_000) return false;

        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'returnHigh':
            return b.projectedReturnMax - a.projectedReturnMax;
          case 'endingSoon':
            return a.daysLeft - b.daysLeft;
          case 'minLow':
            return a.minInvestment - b.minInvestment;
          case 'popular':
          default:
            return b.amountRaised / b.fundingGoal - a.amountRaised / a.fundingGoal;
        }
      });
  }, [opportunities, searchQuery, category, duration, returnRange, minRange, sortBy, tr]);

  const activeFilters = [
    category !== 'All',
    duration !== 'All',
    returnRange !== 'All',
    minRange !== 'All',
    Boolean(searchQuery.trim()),
  ].filter(Boolean).length;

  const resetFilters = () => {
    setSearchQuery('');
    setCategory('All');
    setDuration('All');
    setReturnRange('All');
    setMinRange('All');
  };

  const selectClass =
    'w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              {t('market.eyebrow')}
            </p>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-display">
              {t('market.title')}
            </h1>
          </div>

          <p className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-medium">{t('market.currency')}:</span>
            <span className="px-2.5 py-1 rounded-lg font-bold bg-slate-900 text-white dark:bg-emerald-700">
              Franc CFA (XAF)
            </span>
          </p>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
          {t('market.subtitle')}
        </p>
      </div>

      <search className="block bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <div className="relative flex-1">
            <label htmlFor="market-search" className="sr-only">
              {t('market.searchLabel')}
            </label>
            <Search
              className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              id="market-search"
              type="search"
              placeholder={t('market.searchPlaceholder')}
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label={t('market.clearSearch')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setFilterPanelOpen((prev) => !prev)}
              aria-expanded={isFilterPanelOpen}
              aria-controls="market-filters"
              className={`px-3.5 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-colors ${
                isFilterPanelOpen || activeFilters > 0
                  ? 'border-slate-900 dark:border-emerald-500 bg-slate-900 dark:bg-emerald-700 text-white'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" aria-hidden="true" />
              {t('market.filters')}
              {activeFilters > 0 && (
                <span className="w-5 h-5 rounded-full bg-emerald-500 text-white text-[10px] flex items-center justify-center font-bold">
                  {activeFilters}
                </span>
              )}
            </button>

            <div className="relative">
              <label htmlFor="market-sort" className="sr-only">
                {t('market.sort')}
              </label>
              <select
                id="market-sort"
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value as SortKey)}
                className="appearance-none pl-3 pr-8 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="popular">{t('market.sort.popular')}</option>
                <option value="returnHigh">{t('market.sort.returnHigh')}</option>
                <option value="endingSoon">{t('market.sort.endingSoon')}</option>
                <option value="minLow">{t('market.sort.minLow')}</option>
              </select>
              <ArrowUpDown
                className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
            </div>

            <div className="hidden sm:flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              {(['grid', 'list'] as const).map((mode) => {
                const Icon = mode === 'grid' ? Grid : List;
                return (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setViewMode(mode)}
                    aria-pressed={viewMode === mode}
                    aria-label={t(mode === 'grid' ? 'market.view.grid' : 'market.view.list')}
                    className={`p-1.5 rounded-lg transition-colors ${
                      viewMode === mode
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white'
                        : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" aria-hidden="true" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div
          role="group"
          aria-label={t('market.filtersLabel')}
          className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none"
        >
          {CATEGORIES.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              aria-pressed={category === item}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                category === item
                  ? 'bg-slate-900 dark:bg-emerald-700 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-750'
              }`}
            >
              {t(categoryKey(item))}
            </button>
          ))}
        </div>

        {isFilterPanelOpen && (
          <div
            id="market-filters"
            className="bg-slate-50 dark:bg-slate-850 p-5 rounded-2xl border border-slate-200 dark:border-slate-750 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs gf-animate-slide-down"
          >
            <div>
              <label htmlFor="filter-duration" className="block font-bold text-slate-900 dark:text-white mb-1.5">
                {t('market.horizon')}
              </label>
              <select
                id="filter-duration"
                value={duration}
                onChange={(event) => setDuration(event.target.value as DurationCategory | 'All')}
                className={selectClass}
              >
                {DURATIONS.map((item) => (
                  <option key={item} value={item}>
                    {t(durationKey(item))}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="filter-return" className="block font-bold text-slate-900 dark:text-white mb-1.5">
                {t('market.targetReturn')}
              </label>
              <select
                id="filter-return"
                value={returnRange}
                onChange={(event) => setReturnRange(event.target.value as ReturnRange)}
                className={selectClass}
              >
                {RETURN_RANGES.map((item) => (
                  <option key={item} value={item}>
                    {t(`market.return.${item}` as TranslationKey)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="filter-min" className="block font-bold text-slate-900 dark:text-white mb-1.5">
                {t('market.minInvestment')}
              </label>
              <select
                id="filter-min"
                value={minRange}
                onChange={(event) => setMinRange(event.target.value as MinRange)}
                className={selectClass}
              >
                {MIN_RANGES.map((item) => (
                  <option key={item} value={item}>
                    {t(`market.min.${item}` as TranslationKey)}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-3 flex flex-wrap justify-between items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
              <span className="text-slate-500 dark:text-slate-400">
                {t(filtered.length === 1 ? 'market.resultCount_one' : 'market.resultCount', {
                  count: filtered.length,
                })}
              </span>
              <button
                type="button"
                onClick={resetFilters}
                className="font-bold text-red-600 dark:text-red-400 hover:underline"
              >
                {t('market.reset')}
              </button>
            </div>
          </div>
        )}
      </search>

      {activeFilters > 0 && (
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-500 dark:text-slate-400">{t('market.activeFilters')}:</span>

          {category !== 'All' && (
            <FilterChip label={t(categoryKey(category))} onRemove={() => setCategory('All')} />
          )}
          {duration !== 'All' && (
            <FilterChip label={t(durationKey(duration))} onRemove={() => setDuration('All')} />
          )}
          {returnRange !== 'All' && (
            <FilterChip
              label={t(`market.return.${returnRange}` as TranslationKey)}
              onRemove={() => setReturnRange('All')}
            />
          )}
          {minRange !== 'All' && (
            <FilterChip
              label={t(`market.min.${minRange}` as TranslationKey)}
              onRemove={() => setMinRange('All')}
            />
          )}

          <button
            type="button"
            onClick={resetFilters}
            className="text-emerald-700 dark:text-emerald-400 font-bold hover:underline ml-1"
          >
            {t('market.clearAll')}
          </button>
        </div>
      )}

      {/* Announced to screen readers whenever the result count changes. */}
      <p aria-live="polite" className="sr-only">
        {t(filtered.length === 1 ? 'market.resultCount_one' : 'market.resultCount', {
          count: filtered.length,
        })}
      </p>

      {filtered.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
          <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" aria-hidden="true" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white">{t('market.empty')}</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">{t('market.emptyBody')}</p>
          <button
            type="button"
            onClick={resetFilters}
            className="px-4 py-2.5 bg-slate-900 dark:bg-emerald-700 text-white text-xs font-bold rounded-xl"
          >
            {t('market.reset')}
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 gf-stagger">
          {filtered.map((opp) => (
            <OpportunityCard key={opp.id} opportunity={opp} />
          ))}
        </div>
      ) : (
        <ul className="space-y-4 gf-stagger">
          {filtered.map((opp) => (
            <ListRow
              key={opp.id}
              opportunity={opp}
              onDetails={() => navigateToOpportunity(opp.id)}
              onInvest={() => openInvestModal(opp)}
              language={language}
              tr={tr}
              t={t}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

const FilterChip: React.FC<{ label: string; onRemove: () => void }> = ({ label, onRemove }) => (
  <span className="inline-flex items-center gap-1 pl-2.5 pr-1 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-medium">
    {label}
    {/*
      This was previously an <X> icon with an onClick handler and no
      button element, so it was invisible to keyboard and assistive tech.
    */}
    <button
      type="button"
      onClick={onRemove}
      aria-label={`${label} — ×`}
      className="p-0.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700"
    >
      <X className="w-3 h-3" aria-hidden="true" />
    </button>
  </span>
);

interface ListRowProps {
  opportunity: InvestmentOpportunity;
  onDetails: () => void;
  onInvest: () => void;
  language: 'en' | 'fr';
  tr: (value: { en: string; fr: string } | string) => string;
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
}

const ListRow: React.FC<ListRowProps> = ({ opportunity, onDetails, onInvest, language, tr, t }) => {
  const percent = Math.min(
    100,
    Math.round((opportunity.amountRaised / opportunity.fundingGoal) * 100),
  );

  return (
    <li className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:shadow-lg transition-shadow">
      <div className="flex items-start gap-4 min-w-0">
        <OpportunityImage
          src={opportunity.imageUrl}
          category={opportunity.category}
          seed={opportunity.id}
          className="w-24 h-20 rounded-2xl shrink-0"
        />
        <div className="space-y-1 min-w-0">
          <p className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {t(`market.category.${opportunity.category.replace(' ', '')}` as TranslationKey)}
            </span>
            <span className="text-slate-500 dark:text-slate-400 truncate">
              {tr(opportunity.sponsor)} · {tr(opportunity.location)}
            </span>
          </p>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            <button
              type="button"
              onClick={onDetails}
              className="text-left hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              {tr(opportunity.title)}
            </button>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{tr(opportunity.tagline)}</p>
        </div>
      </div>

      <div className="flex flex-wrap lg:flex-nowrap items-center gap-4 lg:gap-6 justify-between border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100 dark:border-slate-800">
        <div className="text-left lg:text-right">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">
            {t('opp.projectedYield')}
          </span>
          <span className="text-sm font-extrabold font-mono text-emerald-700 dark:text-emerald-400">
            {formatPercent(opportunity.projectedReturnMin, language)}–
            {formatPercent(opportunity.projectedReturnMax, language)}
          </span>
        </div>

        <div className="text-left lg:text-right">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">
            {t('opp.minTicket')}
          </span>
          <span className="text-sm font-bold font-mono text-slate-900 dark:text-white">
            {formatFCFA(opportunity.minInvestment, language)}
          </span>
        </div>

        <div className="text-left lg:text-right">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">
            {t('opp.raised')}
          </span>
          <span className="text-xs font-bold font-mono text-slate-700 dark:text-slate-300">
            {percent}% · {formatShortFCFA(opportunity.amountRaised, language)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onDetails}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors"
          >
            {t('opp.viewDetails')}
          </button>
          <button
            type="button"
            onClick={onInvest}
            className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-emerald-700 hover:bg-slate-800 dark:hover:bg-emerald-600 text-white text-xs font-bold transition-colors"
          >
            {t('opp.invest')}
          </button>
        </div>
      </div>
    </li>
  );
};
