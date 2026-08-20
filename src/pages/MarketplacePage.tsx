import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { OpportunityCard } from '../components/OpportunityCard';
import { Category } from '../types';
import { 
  Search, 
  Filter, 
  SlidersHorizontal, 
  X, 
  TrendingUp, 
  Clock, 
  Coins, 
  Grid, 
  List, 
  ArrowUpDown,
  AlertCircle
} from 'lucide-react';
import { formatFCFA, formatShortFCFA } from '../utils/currency';

export const MarketplacePage: React.FC = () => {
  const { opportunities, navigateToOpportunity, openInvestModal } = useApp();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDuration, setSelectedDuration] = useState<string>('All');
  const [selectedReturnRange, setSelectedReturnRange] = useState<string>('All');
  const [selectedMinInvest, setSelectedMinInvest] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'popular' | 'returnHigh' | 'endingSoon' | 'minLow' | 'newest'>('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const categories: (Category | 'All')[] = [
    'All',
    'Energy',
    'Real Estate',
    'Technology',
    'Infrastructure',
    'Agriculture',
    'Healthcare',
  ];

  const durations = ['All', '1-3 years', '3-5 years', '5+ years'];
  const returnRanges = ['All', '< 8%', '8% - 10%', '10% - 12%', '> 12%'];
  const minInvestOptions = ['All', '25,000 XAF or less', '50,000 XAF or less', '100,000 XAF+'];

  // Filter logic
  const filteredOpportunities = useMemo(() => {
    return opportunities
      .filter((opp) => {
        // Search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesTitle = opp.title.toLowerCase().includes(q);
          const matchesSponsor = opp.sponsor.toLowerCase().includes(q);
          const matchesLocation = opp.location.toLowerCase().includes(q);
          const matchesTags = opp.tags.some((t) => t.toLowerCase().includes(q));
          if (!matchesTitle && !matchesSponsor && !matchesLocation && !matchesTags) {
            return false;
          }
        }

        // Category
        if (selectedCategory !== 'All' && opp.category !== selectedCategory) {
          return false;
        }

        // Duration
        if (selectedDuration !== 'All' && opp.durationCategory !== selectedDuration) {
          return false;
        }

        // Return Range
        if (selectedReturnRange !== 'All') {
          const maxReturn = opp.projectedReturnMax;
          if (selectedReturnRange === '< 8%' && maxReturn >= 8) return false;
          if (selectedReturnRange === '8% - 10%' && (maxReturn < 8 || maxReturn > 10)) return false;
          if (selectedReturnRange === '10% - 12%' && (maxReturn < 10 || maxReturn > 12)) return false;
          if (selectedReturnRange === '> 12%' && maxReturn <= 12) return false;
        }

        // Min Investment
        if (selectedMinInvest !== 'All') {
          if (selectedMinInvest === '25,000 XAF or less' && opp.minInvestment > 25000) return false;
          if (selectedMinInvest === '50,000 XAF or less' && opp.minInvestment > 50000) return false;
          if (selectedMinInvest === '100,000 XAF+' && opp.minInvestment < 100000) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'popular') {
          return b.amountRaised / b.fundingGoal - a.amountRaised / a.fundingGoal;
        }
        if (sortBy === 'returnHigh') {
          return b.projectedReturnMax - a.projectedReturnMax;
        }
        if (sortBy === 'endingSoon') {
          return a.daysLeft - b.daysLeft;
        }
        if (sortBy === 'minLow') {
          return a.minInvestment - b.minInvestment;
        }
        return 0;
      });
  }, [
    opportunities,
    searchQuery,
    selectedCategory,
    selectedDuration,
    selectedReturnRange,
    selectedMinInvest,
    sortBy,
  ]);

  const activeFiltersCount = [
    selectedCategory !== 'All',
    selectedDuration !== 'All',
    selectedReturnRange !== 'All',
    selectedMinInvest !== 'All',
    Boolean(searchQuery),
  ].filter(Boolean).length;

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedDuration('All');
    setSelectedReturnRange('All');
    setSelectedMinInvest('All');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 pb-20">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Primary Offerings Marketplace
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-display">
              Investment Marketplace
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Currency:</span>
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-900 text-white dark:bg-emerald-600">
              Franc CFA (XAF)
            </span>
          </div>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
          Browse verified commercial, energy, agriculture, and real estate offerings denominated in Franc CFA. All returns are estimates subject to project performance.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title, location, industry, or sponsor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-emerald-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Controls Right */}
          <div className="flex items-center gap-2">
            {/* Filter Toggle Button */}
            <button
              onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}
              className={`px-3.5 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer ${
                isFilterDrawerOpen || activeFiltersCount > 0
                  ? 'border-slate-900 dark:border-emerald-500 bg-slate-900 dark:bg-emerald-600 text-white'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filters
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-emerald-500 text-white text-[10px] flex items-center justify-center font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="appearance-none pl-3 pr-8 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="popular">Most Funded</option>
                <option value="returnHigh">Highest Target Yield</option>
                <option value="endingSoon">Ending Soonest</option>
                <option value="minLow">Lowest Ticket</option>
              </select>
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Grid / List View Toggle */}
            <div className="hidden sm:flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
                aria-label="Grid view"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
                aria-label="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-slate-900 dark:bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Expanded Filters Panel */}
        {isFilterDrawerOpen && (
          <div className="bg-slate-50 dark:bg-slate-850 p-5 rounded-2xl border border-slate-200 dark:border-slate-750 grid grid-cols-1 sm:grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-2 duration-150 text-xs">
            {/* Duration filter */}
            <div>
              <label className="block font-bold text-slate-900 dark:text-white mb-1.5">
                Holding Horizon
              </label>
              <select
                value={selectedDuration}
                onChange={(e) => setSelectedDuration(e.target.value)}
                className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium"
              >
                {durations.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* Target Yield filter */}
            <div>
              <label className="block font-bold text-slate-900 dark:text-white mb-1.5">
                Target Return (Est.)
              </label>
              <select
                value={selectedReturnRange}
                onChange={(e) => setSelectedReturnRange(e.target.value)}
                className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium"
              >
                {returnRanges.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            {/* Minimum Investment filter */}
            <div>
              <label className="block font-bold text-slate-900 dark:text-white mb-1.5">
                Minimum Investment
              </label>
              <select
                value={selectedMinInvest}
                onChange={(e) => setSelectedMinInvest(e.target.value)}
                className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium"
              >
                {minInvestOptions.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear button */}
            <div className="sm:col-span-3 flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-700">
              <span className="text-slate-500 dark:text-slate-400">
                {filteredOpportunities.length} opportunities match criteria
              </span>
              <button
                onClick={handleResetFilters}
                className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Active Filter Chips */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-500 dark:text-slate-400">Active filters:</span>
          {selectedCategory !== 'All' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-medium">
              Category: {selectedCategory}
              <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCategory('All')} />
            </span>
          )}
          {selectedDuration !== 'All' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-medium">
              Term: {selectedDuration}
              <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedDuration('All')} />
            </span>
          )}
          {selectedReturnRange !== 'All' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-medium">
              Yield: {selectedReturnRange}
              <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedReturnRange('All')} />
            </span>
          )}
          {selectedMinInvest !== 'All' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-medium">
              Min: {selectedMinInvest}
              <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedMinInvest('All')} />
            </span>
          )}
          <button
            onClick={handleResetFilters}
            className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline ml-1 cursor-pointer"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Grid or List View of Opportunities */}
      {filteredOpportunities.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOpportunities.map((opp) => (
              <OpportunityCard key={opp.id} opportunity={opp} />
            ))}
          </div>
        ) : (
          /* List View */
          <div className="space-y-4">
            {filteredOpportunities.map((opp) => {
              const percent = Math.min(100, Math.round((opp.amountRaised / opp.fundingGoal) * 100));
              return (
                <div
                  key={opp.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={opp.imageUrl}
                      alt={opp.title}
                      className="w-24 h-20 rounded-2xl object-cover shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {opp.category}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {opp.sponsor} • {opp.location}
                        </span>
                      </div>
                      <h3
                        onClick={() => navigateToOpportunity(opp.id)}
                        className="text-base font-bold text-slate-900 dark:text-white hover:text-emerald-600 cursor-pointer"
                      >
                        {opp.title}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-1">{opp.tagline}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap md:flex-nowrap items-center gap-6 self-stretch md:self-auto justify-between border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 dark:border-slate-800">
                    <div className="text-left md:text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Target Yield</span>
                      <span className="text-sm font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
                        {opp.projectedReturnMin}% - {opp.projectedReturnMax}% p.a.*
                      </span>
                    </div>

                    <div className="text-left md:text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Min. Ticket</span>
                      <span className="text-sm font-bold font-mono text-slate-900 dark:text-white">
                        {formatFCFA(opp.minInvestment)}
                      </span>
                    </div>

                    <div className="text-left md:text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Raised</span>
                      <span className="text-xs font-bold font-mono text-slate-700 dark:text-slate-300">
                        {percent}% ({formatShortFCFA(opp.amountRaised)})
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigateToOpportunity(opp.id)}
                        className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold hover:bg-slate-50 text-slate-700 dark:text-slate-200"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => openInvestModal(opp)}
                        className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 text-white text-xs font-bold shadow-xs"
                      >
                        Invest
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
          <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            No opportunities matched your filters
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search criteria or resetting filters to view all offerings.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 bg-slate-900 dark:bg-emerald-600 text-white text-xs font-bold rounded-xl"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
