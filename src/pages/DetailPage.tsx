import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ArrowLeft, 
  Bookmark, 
  Share2, 
  ShieldCheck, 
  AlertTriangle, 
  Download, 
  TrendingUp, 
  Coins, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Building, 
  MapPin, 
  Lock, 
  Info,
  ChevronRight,
  Sparkles,
  Layers,
  BarChart2
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { formatFCFA, formatShortFCFA } from '../utils/currency';

export const DetailPage: React.FC = () => {
  const { 
    selectedOpportunityId, 
    opportunities, 
    setCurrentPage, 
    openInvestModal, 
    savedOpportunityIds, 
    toggleSaveOpportunity,
    addToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'financials' | 'risks' | 'documents' | 'updates'>('overview');
  const [calcAmount, setCalcAmount] = useState<number>(50000);

  const opportunity = opportunities.find((o) => o.id === selectedOpportunityId) || opportunities[0];

  if (!opportunity) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p>Opportunity not found.</p>
        <button onClick={() => setCurrentPage('marketplace')} className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-lg">
          Return to Marketplace
        </button>
      </div>
    );
  }

  const isSaved = savedOpportunityIds.includes(opportunity.id);
  const percentFunded = Math.min(100, Math.round((opportunity.amountRaised / opportunity.fundingGoal) * 100));

  // Projected return model for this opportunity in FCFA
  const avgYield = (opportunity.projectedReturnMin + opportunity.projectedReturnMax) / 2;
  const estAnnual = (calcAmount * avgYield) / 100;
  const estTotal = estAnnual * 3;

  // Chart data for projections
  const projectionChartData = [
    { year: 'Year 0', principal: calcAmount, projectedInterest: 0, total: calcAmount },
    { year: 'Year 1', principal: calcAmount, projectedInterest: Math.round(estAnnual), total: Math.round(calcAmount + estAnnual) },
    { year: 'Year 2', principal: calcAmount, projectedInterest: Math.round(estAnnual * 2), total: Math.round(calcAmount + estAnnual * 2) },
    { year: 'Year 3 (Maturity)', principal: calcAmount, projectedInterest: Math.round(estTotal), total: Math.round(calcAmount + estTotal) },
  ];

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      addToast('Opportunity link copied to clipboard!', 'info');
    }
  };

  const handleDownloadDoc = (docTitle: string) => {
    addToast(`Downloading ${docTitle} (PDF)...`, 'info');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20">
      {/* Breadcrumb & Navigation Top */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={() => {
            setCurrentPage('marketplace');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Marketplace
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5"
            title="Share opportunity"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Share</span>
          </button>

          <button
            onClick={() => toggleSaveOpportunity(opportunity.id)}
            className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              isSaved
                ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            <span className="hidden sm:inline">{isSaved ? 'Saved' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Detailed Content vs Right Sticky Invest Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Header & Badges */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-slate-900 text-white dark:bg-emerald-600">
                {opportunity.category}
              </span>
              <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300">
                {opportunity.securityStructure}
              </span>
              <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                In Franc CFA (XAF)
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-display leading-tight">
              {opportunity.title}
            </h1>

            <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              {opportunity.tagline}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
              <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-200">
                <Building className="w-3.5 h-3.5" />
                Sponsor: {opportunity.sponsor}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {opportunity.location}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Regulated Asset Placement
              </span>
            </div>
          </div>

          {/* Hero Banner Image */}
          <div className="relative rounded-3xl overflow-hidden h-72 sm:h-96 w-full shadow-md bg-slate-100 dark:bg-slate-800">
            <img
              src={opportunity.imageUrl}
              alt={opportunity.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
            
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs">
              <span className="px-3 py-1.5 bg-black/60 backdrop-blur-xs rounded-xl font-medium">
                Verified Physical Collateral Backing
              </span>
              <span className="font-mono text-emerald-400 font-bold text-sm">
                Target Yield: {opportunity.projectedReturnMin}% - {opportunity.projectedReturnMax}% p.a.*
              </span>
            </div>
          </div>

          {/* Explicit Risk Disclosure Box */}
          <div className="bg-red-50/90 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-2xl p-5 text-xs text-red-900 dark:text-red-300 space-y-2">
            <div className="flex items-center gap-2 font-bold text-red-800 dark:text-red-400">
              <AlertTriangle className="w-4 h-4" />
              <span>Offering Risk Disclosure & Non-Guarantee Notice</span>
            </div>
            <p className="leading-relaxed">
              Target yields ({opportunity.projectedReturnMin}% - {opportunity.projectedReturnMax}% p.a.) are forward-looking financial estimations based on project cashflow models. <strong>Returns are not guaranteed.</strong> Investments carry market risks, and capital is not insured against commercial downside.
            </p>
          </div>

          {/* Content Navigation Tabs */}
          <div className="border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto scrollbar-none">
            {[
              { id: 'overview', label: 'Overview & Terms' },
              { id: 'financials', label: 'Financial Model' },
              { id: 'risks', label: 'Risk Factors & Mitigations' },
              { id: 'documents', label: 'Legal & Diligence Documents' },
              { id: 'updates', label: 'Timeline & Milestones' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-4 text-xs font-bold whitespace-nowrap border-b-2 transition-all ${
                  activeTab === tab.id
                    ? 'border-slate-900 dark:border-emerald-500 text-slate-900 dark:text-white'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab 1: Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-6 text-slate-700 dark:text-slate-300 leading-relaxed text-sm">
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  About This Investment
                </h3>
                <p>{opportunity.description}</p>
              </div>

              {/* Key Offering Terms Grid */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Key Offering Parameters
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
                    <span className="text-[11px] text-slate-500 uppercase font-semibold block">Target Annual Yield</span>
                    <span className="text-base font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
                      {opportunity.projectedReturnMin}% - {opportunity.projectedReturnMax}% p.a.*
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
                    <span className="text-[11px] text-slate-500 uppercase font-semibold block">Holding Horizon</span>
                    <span className="text-base font-bold text-slate-900 dark:text-white">
                      {opportunity.durationYears}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
                    <span className="text-[11px] text-slate-500 uppercase font-semibold block">Distribution Schedule</span>
                    <span className="text-base font-bold text-slate-900 dark:text-white">
                      {opportunity.distributionFrequency}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
                    <span className="text-[11px] text-slate-500 uppercase font-semibold block">Minimum Ticket</span>
                    <span className="text-base font-extrabold font-mono text-slate-900 dark:text-white truncate">
                      {formatFCFA(opportunity.minInvestment)}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
                    <span className="text-[11px] text-slate-500 uppercase font-semibold block">Security Instrument</span>
                    <span className="text-base font-bold text-slate-900 dark:text-white">
                      {opportunity.securityStructure}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
                    <span className="text-[11px] text-slate-500 uppercase font-semibold block">Escrow Custodian</span>
                    <span className="text-base font-bold text-slate-900 dark:text-white">
                      {opportunity.escrowAgent}
                    </span>
                  </div>
                </div>
              </div>

              {/* Use of Funds Breakdown */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Allocation & Use of Funds (Franc CFA)
                </h4>
                <div className="space-y-2">
                  {opportunity.useOfFunds.map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300">
                        <span>{item.purpose}</span>
                        <span className="font-mono font-bold">{item.percentage}% ({formatShortFCFA((opportunity.fundingGoal * item.percentage) / 100)})</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className="bg-slate-900 dark:bg-emerald-500 h-full rounded-full" style={{ width: `${item.percentage}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sponsor & Track Record */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-2">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Sponsor Background: {opportunity.sponsor}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {opportunity.sponsor} has deployed over 85 Billion XAF in infrastructure and commercial developments with 100% verified asset custody and historical distribution compliance.
                </p>
              </div>
            </div>
          )}

          {/* Tab 2: Financial Projections */}
          {activeTab === 'financials' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Illustrative Growth & Cash Distribution Model
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Projected capital and income accumulation for a hypothetical {formatFCFA(calcAmount)} investment at a {avgYield}% target annual return rate.
                </p>
              </div>

              {/* Recharts Area Chart */}
              <div className="p-5 bg-white dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800">
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={projectionChartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="yieldGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#94A3B8" opacity={0.2} />
                      <XAxis dataKey="year" stroke="#94A3B8" fontSize={12} />
                      <YAxis stroke="#94A3B8" fontSize={11} tickFormatter={(val) => formatShortFCFA(val)} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0F172A',
                          borderRadius: '12px',
                          border: 'none',
                          color: '#fff',
                          fontSize: '12px',
                        }}
                        formatter={(val: any) => [formatFCFA(Number(val)), 'Projected Value']}
                      />
                      <Area
                        type="monotone"
                        dataKey="total"
                        stroke="#10B981"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#yieldGrad)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Scenario Sensitivity Matrix */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Scenario Sensitivity Analysis
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="font-semibold text-slate-500">Downside Case (-20% rev)</span>
                    <p className="text-lg font-bold font-mono text-amber-600">6.2% p.a.</p>
                    <p className="text-[11px] text-slate-400">Yield cushions down, principal preserved by asset liens.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 space-y-1">
                    <span className="font-semibold text-emerald-800 dark:text-emerald-300">Base Case (Target)</span>
                    <p className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">{opportunity.projectedReturnMin}% - {opportunity.projectedReturnMax}% p.a.</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Current contract and commercial lease base.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="font-semibold text-slate-500">Upside Case (+15% output)</span>
                    <p className="text-lg font-bold font-mono text-slate-900 dark:text-white">13.8% p.a.</p>
                    <p className="text-[11px] text-slate-400">Surplus commercial production and market uplift.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Risk Factors & Disclosures */}
          {activeTab === 'risks' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Identified Risk Factors & Mitigations
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Every private placement involves genuine market and operational risks. Review our risk analysis below.
                </p>
              </div>

              <div className="space-y-3">
                {opportunity.riskFactors.map((rf, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white text-sm">
                        {rf.category}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                        {rf.severity} Severity
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300">{rf.description}</p>
                    <div className="p-2.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                      <strong className="text-emerald-600 dark:text-emerald-400">Sponsor Mitigation: </strong>
                      {rf.mitigation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: Diligence Documents & Legal */}
          {activeTab === 'documents' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Offering Documents & Third-Party Reports
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  All investors receive unredacted access to prospectuses, independent appraisals, and audited statements.
                </p>
              </div>

              <div className="space-y-2.5">
                {opportunity.documents.map((doc, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 hover:border-slate-300 transition-colors text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 font-bold text-[10px]">
                        PDF
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">{doc.title}</p>
                        <p className="text-slate-500 text-[11px]">{doc.type} • {doc.size}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDownloadDoc(doc.title)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-200 font-medium flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 5: Timeline & Updates */}
          {activeTab === 'updates' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Project Execution Milestones
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Track funding, operational milestones, and distribution schedules.
                </p>
              </div>

              <div className="space-y-4 relative border-l-2 border-slate-200 dark:border-slate-800 ml-4 pl-6 text-xs">
                {[
                  { title: 'Offering Opened on GrowthFund', date: 'Oct 1, 2024', status: 'Completed', desc: 'Filing accepted and third-party escrow account activated.' },
                  { title: '70% Funding Threshold Milestone', date: 'Nov 10, 2024', status: 'Completed', desc: 'Project passed initial funding close minimum condition.' },
                  { title: 'Offering Close & Equipment Deployment', date: 'Dec 15, 2024', status: 'Upcoming', desc: 'Escrow release to sponsor upon title deed transfer recording.' },
                  { title: 'First Quarterly Yield Distribution', date: 'Mar 31, 2025', status: 'Scheduled', desc: 'Direct Mobile Money / Wire cash flow distribution to all verified investors.' },
                ].map((m, idx) => (
                  <div key={idx} className="relative space-y-1">
                    <div className="absolute -left-[31px] top-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-4 ring-white dark:ring-slate-900"></div>
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900 dark:text-white">{m.title}</h4>
                      <span className="text-slate-400">{m.date}</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400">{m.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Sticky Investment Card (4 cols) */}
        <div className="lg:col-span-4 sticky top-24 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            {/* Target Yield Banner */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                Target Projected Yield
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
                  {opportunity.projectedReturnMin}% - {opportunity.projectedReturnMax}%
                </span>
                <span className="text-xs text-slate-500 font-medium">p.a.*</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 italic">
                * Yield estimates are targets and not guaranteed.
              </p>
            </div>

            {/* Funding Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-700 dark:text-slate-300">
                  <strong className="text-slate-900 dark:text-white">{formatShortFCFA(opportunity.amountRaised)}</strong> raised
                </span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{percentFunded}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="bg-slate-900 dark:bg-emerald-500 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${percentFunded}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>Goal: {formatShortFCFA(opportunity.fundingGoal)}</span>
                <span>{opportunity.daysLeft} days remaining</span>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs">
              <div>
                <span className="text-slate-500 text-[10px] uppercase font-bold block">Min. Ticket</span>
                <span className="font-bold text-slate-900 dark:text-white font-mono truncate block">{formatFCFA(opportunity.minInvestment)}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] uppercase font-bold block">Term Horizon</span>
                <span className="font-bold text-slate-900 dark:text-white">{opportunity.durationYears}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] uppercase font-bold block">Distributions</span>
                <span className="font-bold text-slate-900 dark:text-white">{opportunity.distributionFrequency}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] uppercase font-bold block">Investors</span>
                <span className="font-bold text-slate-900 dark:text-white">{opportunity.investorsCount} Verified</span>
              </div>
            </div>

            {/* Calculator input */}
            <div className="space-y-2 text-xs">
              <label className="font-bold text-slate-700 dark:text-slate-300 block">
                Simulate Allocation (Franc CFA / XAF)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="5000"
                  min={opportunity.minInvestment}
                  value={calcAmount}
                  onChange={(e) => setCalcAmount(Math.max(0, Number(e.target.value)))}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-sm font-bold text-slate-900 dark:text-white pr-20"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">FCFA</span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>Est. Annual Payout:</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">~{formatFCFA(Math.round(estAnnual))}/yr</span>
              </div>
            </div>

            {/* Primary Action Button */}
            <button
              onClick={() => openInvestModal(opportunity)}
              className="w-full py-4 bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 text-white font-bold rounded-2xl text-sm transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              Invest in this Offering
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Escrow & Regulation Seal */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 space-y-1.5">
              <div className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Escrow Custodian: {opportunity.escrowAgent}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Currency: Franc CFA (XAF / FCFA)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
