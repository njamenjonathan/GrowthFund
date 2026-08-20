import React from 'react';
import { InvestmentOpportunity } from '../types';
import { useApp } from '../context/AppContext';
import { 
  Bookmark, 
  Clock, 
  TrendingUp, 
  Coins, 
  MapPin, 
  ArrowRight,
  Sparkles,
  Users,
  ShieldCheck
} from 'lucide-react';
import { formatFCFA, formatShortFCFA } from '../utils/currency';

interface OpportunityCardProps {
  opportunity: InvestmentOpportunity;
  featured?: boolean;
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({ 
  opportunity, 
  featured = false 
}) => {
  const { 
    navigateToOpportunity, 
    openInvestModal, 
    savedOpportunityIds, 
    toggleSaveOpportunity 
  } = useApp();

  const isSaved = savedOpportunityIds.includes(opportunity.id);
  const percentFunded = Math.min(100, Math.round((opportunity.amountRaised / opportunity.fundingGoal) * 100));

  return (
    <div 
      className={`group bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between ${
        featured ? 'ring-2 ring-emerald-500/30 dark:ring-emerald-500/20' : ''
      }`}
    >
      <div>
        {/* Card Image Banner */}
        <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
          <img
            src={opportunity.imageUrl}
            alt={opportunity.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/20 to-transparent"></div>

          {/* Badges top left */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center">
            <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold tracking-wide bg-slate-900/90 text-white backdrop-blur-xs shadow-xs">
              {opportunity.category}
            </span>
            {opportunity.isFeatured && (
              <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold tracking-wider uppercase bg-emerald-600 text-white flex items-center gap-1 shadow-xs">
                <Sparkles className="w-2.5 h-2.5" /> Featured
              </span>
            )}
          </div>

          {/* Bookmark top right */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleSaveOpportunity(opportunity.id);
            }}
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-xs transition-colors ${
              isSaved
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-900'
            }`}
            aria-label={isSaved ? 'Remove from saved' : 'Save opportunity'}
          >
            <Bookmark className="w-4 h-4 fill-current" />
          </button>

          {/* Sponsor & Location overlay bottom */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
            <span className="font-semibold truncate max-w-[180px] drop-shadow-sm">
              {opportunity.sponsor || 'GrowthFund Verified'}
            </span>
            <span className="flex items-center gap-1 text-[11px] text-slate-200 shrink-0 drop-shadow-sm font-medium">
              <MapPin className="w-3 h-3 text-emerald-400" />
              {opportunity.location}
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 space-y-4">
          <div>
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Asset-Backed Offering
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
                <Clock className="w-3 h-3" />
                {opportunity.daysLeft || 21} days left
              </span>
            </div>

            <h3 
              onClick={() => navigateToOpportunity(opportunity.id)}
              className="text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors cursor-pointer line-clamp-1"
            >
              {opportunity.title}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mt-1 leading-relaxed">
              {opportunity.tagline}
            </p>
          </div>

          {/* Metric Grid */}
          <div className="grid grid-cols-2 gap-2.5 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-750">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                Projected Yield
              </span>
              <p className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
                {opportunity.projectedReturnMin}% - {opportunity.projectedReturnMax}% <span className="text-[10px] font-normal text-slate-500">p.a.*</span>
              </p>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Coins className="w-3 h-3 text-slate-500" />
                Min. Ticket
              </span>
              <p className="text-xs font-bold text-slate-900 dark:text-white font-mono mt-0.5 truncate">
                {formatFCFA(opportunity.minInvestment)}
              </p>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">
                Horizon
              </span>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                {opportunity.durationYears}
              </p>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">
                Distribution
              </span>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                {opportunity.distributionFrequency}
              </p>
            </div>
          </div>

          {/* Funding Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-700 dark:text-slate-300">
                <strong className="text-slate-900 dark:text-white">{formatShortFCFA(opportunity.amountRaised)}</strong>{' '}
                <span className="text-slate-400">/ {formatShortFCFA(opportunity.fundingGoal)}</span>
              </span>
              <span className="font-bold text-slate-900 dark:text-white font-mono">{percentFunded}%</span>
            </div>
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-slate-900 dark:bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${percentFunded}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {opportunity.investorsCount} verified investors
              </span>
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">In Franc CFA (XAF)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Actions Footer */}
      <div className="px-5 pb-5 pt-1 flex items-center gap-2">
        <button
          onClick={() => navigateToOpportunity(opportunity.id)}
          className="flex-1 py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors flex items-center justify-center gap-1"
        >
          View Details
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => openInvestModal(opportunity)}
          className="py-2.5 px-4 rounded-xl bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-1"
        >
          Invest
        </button>
      </div>
    </div>
  );
};
