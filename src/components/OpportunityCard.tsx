import React from 'react';
import { ArrowRight, Bookmark, Clock, Coins, MapPin, Sparkles, TrendingUp, Users } from 'lucide-react';
import { InvestmentOpportunity } from '../types';
import { useApp } from '../context/AppContext';
import { OpportunityImage } from './OpportunityImage';
import { useI18n } from '../i18n/LanguageContext';
import { formatFCFA, formatPercent, formatShortFCFA } from '../utils/format';

interface OpportunityCardProps {
  opportunity: InvestmentOpportunity;
  featured?: boolean;
}

const RISK_TONE = {
  Low: 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300',
  Medium: 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300',
  High: 'bg-red-100 dark:bg-red-950/80 text-red-800 dark:text-red-300',
} as const;

export const OpportunityCard: React.FC<OpportunityCardProps> = ({ opportunity, featured = false }) => {
  const { t, tr, language } = useI18n();
  const { navigateToOpportunity, openInvestModal, savedOpportunityIds, toggleSaveOpportunity } =
    useApp();

  const isSaved = savedOpportunityIds.includes(opportunity.id);
  const percentFunded = Math.min(
    100,
    Math.round((opportunity.amountRaised / opportunity.fundingGoal) * 100),
  );
  const title = tr(opportunity.title);

  return (
    <article
      className={`group bg-white dark:bg-slate-900 rounded-3xl border overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col ${
        featured
          ? 'border-emerald-300 dark:border-emerald-800 ring-1 ring-emerald-500/20'
          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
      }`}
    >
      <div className="relative h-44 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <OpportunityImage
          src={opportunity.imageUrl}
          category={opportunity.category}
          seed={opportunity.id}
          className="w-full h-full group-hover:scale-105 transition-transform duration-500"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"
        />

        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-900/90 text-white backdrop-blur-sm">
            {t(`market.category.${opportunity.category.replace(' ', '')}` as 'market.category.Energy')}
          </span>
          {opportunity.isFeatured && (
            <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider bg-emerald-700 text-white flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" aria-hidden="true" />
              {t('opp.featured')}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => toggleSaveOpportunity(opportunity.id)}
          aria-pressed={isSaved}
          aria-label={t(isSaved ? 'opp.unsaveAria' : 'opp.saveAria', { name: title })}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-colors ${
            isSaved
              ? 'bg-emerald-700 text-white'
              : 'bg-white/85 dark:bg-slate-900/85 text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-900'
          }`}
        >
          <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} aria-hidden="true" />
        </button>

        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2 text-white text-xs">
          <span className="font-semibold truncate drop-shadow">{tr(opportunity.sponsor)}</span>
          <span className="flex items-center gap-1 text-[11px] text-slate-200 shrink-0 drop-shadow font-medium">
            <MapPin className="w-3 h-3 text-emerald-400" aria-hidden="true" />
            <span className="truncate max-w-[9rem]">{tr(opportunity.location)}</span>
          </span>
        </div>
      </div>

      <div className="p-5 space-y-4 flex-1 flex flex-col">
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${RISK_TONE[opportunity.riskLevel]}`}
            >
              {t(`opp.risk.${opportunity.riskLevel}` as 'opp.risk.Low')}
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
              <Clock className="w-3 h-3" aria-hidden="true" />
              {t('opp.daysLeft', { count: opportunity.daysLeft })}
            </span>
          </div>

          <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug">
            {/*
              The whole heading is the link target, so the accessible name
              of the link is the project name — previously the click
              handler sat on a bare <h3>, which keyboard users could not
              reach at all.
            */}
            <button
              type="button"
              onClick={() => navigateToOpportunity(opportunity.id)}
              className="text-left hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors rounded"
            >
              {title}
            </button>
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mt-1 leading-relaxed">
            {tr(opportunity.tagline)}
          </p>
        </div>

        <dl className="grid grid-cols-2 gap-2.5 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-750">
          <div>
            <dt className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-700 dark:text-emerald-400" aria-hidden="true" />
              {t('opp.projectedYield')}
            </dt>
            <dd className="text-sm font-extrabold text-emerald-700 dark:text-emerald-400 font-mono mt-0.5">
              {formatPercent(opportunity.projectedReturnMin, language)}–
              {formatPercent(opportunity.projectedReturnMax, language)}
            </dd>
          </div>

          <div>
            <dt className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Coins className="w-3 h-3" aria-hidden="true" />
              {t('opp.minTicket')}
            </dt>
            <dd className="text-xs font-bold text-slate-900 dark:text-white font-mono mt-0.5 truncate">
              {formatFCFA(opportunity.minInvestment, language)}
            </dd>
          </div>

          <div>
            <dt className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">
              {t('opp.horizon')}
            </dt>
            <dd className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
              {tr(opportunity.durationYears)}
            </dd>
          </div>

          <div>
            <dt className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">
              {t('opp.distribution')}
            </dt>
            <dd className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
              {t(`opp.freq.${opportunity.distributionFrequency}` as 'opp.freq.Quarterly')}
            </dd>
          </div>
        </dl>

        <div className="space-y-1.5 mt-auto">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-slate-700 dark:text-slate-300">
              <strong className="text-slate-900 dark:text-white">
                {formatShortFCFA(opportunity.amountRaised, language)}
              </strong>{' '}
              <span className="text-slate-500 dark:text-slate-400">
                / {formatShortFCFA(opportunity.fundingGoal, language)}
              </span>
            </span>
            <span className="font-bold text-slate-900 dark:text-white font-mono">
              {percentFunded}%
            </span>
          </div>

          <div
            role="progressbar"
            aria-valuenow={percentFunded}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={t('opp.percentFunded', { percent: percentFunded })}
            className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden"
          >
            <div
              className="h-full bg-slate-900 dark:bg-emerald-500 rounded-full transition-[width] duration-700 ease-out"
              style={{ width: `${percentFunded}%` }}
            />
          </div>

          <p className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Users className="w-3 h-3" aria-hidden="true" />
            {t('opp.investors', { count: opportunity.investorsCount })}
          </p>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => navigateToOpportunity(opportunity.id)}
            className="flex-1 py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors flex items-center justify-center gap-1"
          >
            {t('opp.viewDetails')}
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => openInvestModal(opportunity)}
            className="py-2.5 px-4 rounded-xl bg-slate-900 dark:bg-emerald-700 hover:bg-slate-800 dark:hover:bg-emerald-600 text-white text-xs font-bold transition-colors"
          >
            {t('opp.invest')}
            <span className="sr-only"> — {title}</span>
          </button>
        </div>
      </div>
    </article>
  );
};
