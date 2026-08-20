import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { OpportunityCard } from '../components/OpportunityCard';
import { 
  ShieldCheck, 
  TrendingUp, 
  Building2, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  Coins, 
  AlertTriangle, 
  Users, 
  FileCheck, 
  Layers, 
  BarChart3,
  HelpCircle,
  Sparkles,
  ChevronRight,
  Gift,
  ArrowDownLeft,
  ArrowUpRight
} from 'lucide-react';
import { formatFCFA, formatShortFCFA, formatXAF } from '../utils/currency';

export const LandingPage: React.FC = () => {
  const { setCurrentPage, opportunities, openAuthModal, setDashboardTab } = useApp();

  // Calculator state in Franc CFA
  const [calcAmount, setCalcAmount] = useState<number>(250000); // 250,000 FCFA
  const [calcRate, setCalcRate] = useState<number>(10.5); // % p.a.
  const [calcYears, setCalcYears] = useState<number>(3);

  const estAnnualReturn = (calcAmount * calcRate) / 100;
  const estTotalReturn = estAnnualReturn * calcYears;
  const estTotalValue = calcAmount + estTotalReturn;

  const featuredOpportunities = opportunities.filter((o) => o.isFeatured).slice(0, 3);

  return (
    <div className="space-y-20 sm:space-y-28 pb-16">
      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 lg:pt-24 overflow-hidden">
        {/* Subtle decorative background gradient */}
        <div className="absolute inset-0 -z-10 flex items-center justify-center">
          <div className="w-[600px] h-[400px] bg-emerald-500/10 dark:bg-emerald-500/5 blur-[120px] rounded-full"></div>
          <div className="w-[500px] h-[350px] bg-blue-500/10 dark:bg-blue-500/5 blur-[120px] rounded-full translate-x-32"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Trust pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Franc CFA Denominated Alternative Investment Platform
          </div>

          {/* Main Hero Title */}
          <div className="space-y-4 max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display leading-[1.15]">
              Institutional-Grade Alternative Investments.{' '}
              <span className="text-emerald-600 dark:text-emerald-400">Zero False Promises.</span>
            </h1>
            <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Invest starting from <strong>25,000 XAF</strong> in vetted private market projects—from solar power and agri-processing to commercial real estate—with transparent projected returns, Mobile Money cash in, and fast cash out in multiples of 5,000 XAF.
            </p>
          </div>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setCurrentPage('marketplace');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-8 py-4 bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 text-white text-base font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              Explore Opportunities
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => openAuthModal('signup')}
              className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-800 dark:text-white text-base font-bold rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs transition-colors cursor-pointer"
            >
              Create Account (+1,000 XAF Ref Bonus)
            </button>
          </div>

          {/* Risk Warning Under Hero */}
          <div className="max-w-2xl mx-auto bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-2xl p-4 text-xs text-amber-900 dark:text-amber-300 flex items-start gap-3 text-left">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <p>
              <strong>Important Risk Notice:</strong> All investments carry risk, returns are estimated projections and never guaranteed, and investors may lose some or all invested capital. Illiquidity applies.
            </p>
          </div>

          {/* Trust Highlights Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 max-w-4xl mx-auto border-t border-slate-200/80 dark:border-slate-800">
            <div className="p-3 text-left">
              <span className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white">32.5B XAF+</span>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Total Capital Funded</p>
            </div>
            <div className="p-3 text-left">
              <span className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white">4,800+</span>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Verified Investors</p>
            </div>
            <div className="p-3 text-left">
              <span className="text-2xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">4.1B XAF</span>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Quarterly Yields Paid</p>
            </div>
            <div className="p-3 text-left">
              <span className="text-2xl font-extrabold font-mono text-purple-600 dark:text-purple-400">+1,000 XAF</span>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Bonus Per Referral</p>
            </div>
          </div>
        </div>
      </section>

      {/* Referral & Cash-In/Out Feature Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Cash In Box */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <ArrowDownLeft className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Instant Cash In (Franc CFA)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Deposit Franc CFA seamlessly using Mobile Money (Orange Money, MTN MoMo, Wave) or direct bank transfer with zero deposit friction.
            </p>
          </div>

          {/* Cash Out Box */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Flexible Cash Out (5,000s Step)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Withdraw your capital and yield payouts directly in multiples of <strong>5,000 XAF</strong> (e.g. 5,000, 10,000, 15,000, 20,000 FCFA, etc.) straight to your wallet.
            </p>
          </div>

          {/* Referral Bonus Box */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-purple-200 dark:border-purple-900/50 shadow-xs space-y-3 bg-gradient-to-b from-purple-50/50 dark:from-purple-950/20 to-transparent">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Gift className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              1,000 XAF Referral Bonus
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Share your unique referral code. For every friend who signs up using your code, you receive an instant <strong>1,000 XAF</strong> cash bonus in your account!
            </p>
          </div>
        </div>
      </section>

      {/* Featured Opportunities Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              Live Offerings
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display mt-1">
              Featured Investment Opportunities
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-xl">
              Strictly vetted private market assets currently open for public allocation with full diligence documentation and transparent Franc CFA models.
            </p>
          </div>

          <button
            onClick={() => {
              setCurrentPage('marketplace');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="self-start md:self-auto text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 flex items-center gap-1.5 group cursor-pointer"
          >
            Browse all opportunities
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* 3 Featured Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredOpportunities.map((opp) => (
            <OpportunityCard key={opp.id} opportunity={opp} featured={opp.isFeatured} />
          ))}
        </div>
      </section>

      {/* Interactive Projected Return Calculator Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 dark:bg-slate-950 text-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-slate-800 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left: Explainer & Controls */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-800 text-xs font-bold text-emerald-400">
                <BarChart3 className="w-3.5 h-3.5" />
                Franc CFA Scenario Modeling Tool
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-extrabold font-display">
                  Projected Return Calculator
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Estimate your hypothetical portfolio performance based on realistic historical category yield benchmarks in Franc CFA. Returns are model estimates and not guaranteed.
                </p>
              </div>

              {/* Slider 1: Investment Amount */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300 font-medium">Initial Capital Allocation (XAF)</span>
                  <span className="font-mono font-extrabold text-emerald-400 text-base">
                    {formatFCFA(calcAmount)}
                  </span>
                </div>
                <input
                  type="range"
                  min="25000"
                  max="2500000"
                  step="25000"
                  value={calcAmount}
                  onChange={(e) => setCalcAmount(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                  <span>25,000 XAF</span>
                  <span>1,250,000 XAF</span>
                  <span>2,500,000 XAF</span>
                </div>
              </div>

              {/* Slider 2: Target Annual Yield Rate */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300 font-medium">Target Annual Return Yield</span>
                  <span className="font-mono font-extrabold text-emerald-400 text-base">
                    {calcRate}% p.a.
                  </span>
                </div>
                <input
                  type="range"
                  min="6.0"
                  max="16.0"
                  step="0.5"
                  value={calcRate}
                  onChange={(e) => setCalcRate(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                  <span>6.0% (Stable Infrastructure)</span>
                  <span>10.5% (Balanced Real Estate)</span>
                  <span>16.0% (Growth Clean Tech)</span>
                </div>
              </div>

              {/* Term Duration Select */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                  Target Investment Horizon
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: '2 Years', val: 2 },
                    { label: '3 Years', val: 3 },
                    { label: '5 Years', val: 5 },
                  ].map((item) => (
                    <button
                      key={item.val}
                      type="button"
                      onClick={() => setCalcYears(item.val)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        calcYears === item.val
                          ? 'border-emerald-500 bg-emerald-500/20 text-white'
                          : 'border-slate-800 bg-slate-850 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Output Matrix Card */}
            <div className="lg:col-span-5 bg-slate-850 p-6 sm:p-8 rounded-3xl border border-slate-700/80 space-y-6">
              <h3 className="text-xs uppercase font-bold tracking-wider text-slate-400">
                Projected Scenario Output ({calcYears} Years)
              </h3>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <span className="text-xs text-slate-400 block font-medium">Est. Annual Income Payout</span>
                  <span className="text-2xl font-extrabold font-mono text-emerald-400">
                    {formatFCFA(Math.round(estAnnualReturn))}/yr
                  </span>
                  <p className="text-[11px] text-slate-500 mt-1">Paid quarterly directly into your cash balance</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <span className="text-xs text-slate-400 block font-medium">Est. Total Net Capital at Maturity</span>
                  <span className="text-3xl font-extrabold font-mono text-white">
                    {formatFCFA(Math.round(estTotalValue))}
                  </span>
                  <div className="flex justify-between text-xs text-slate-400 mt-2 pt-2 border-t border-slate-800">
                    <span>Principal: {formatFCFA(calcAmount)}</span>
                    <span className="text-emerald-400 font-bold">+{formatFCFA(Math.round(estTotalReturn))} yield</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-red-950/40 rounded-xl border border-red-900/60 text-[11px] text-red-300 leading-relaxed">
                <strong>Disclaimer:</strong> This calculator provides hypothetical mathematical models. Actual returns depend on project cash-flow, macro factors, and counterparty performance. Capital is at risk.
              </div>

              <button
                onClick={() => {
                  setCurrentPage('marketplace');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                Find Offerings Matching This Target
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* The 4 Pillars of Trust */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider">
            Our Standard
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
            Built for Transparency, Vetted for Quality
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            GrowthFund provides rigorous audit standards, direct escrow custody, and clear cash distributions denominated in Franc CFA.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: FileCheck,
              title: '3% Acceptance Rate',
              desc: 'Our investment committee performs forensic audits on cash flow, collateral, and legal standing. Only vetted projects are listed.',
            },
            {
              icon: ShieldCheck,
              title: 'Collateral Backed',
              desc: 'Offerings are secured by physical infrastructure, commercial leases, equipment liens, or registered agricultural facilities.',
            },
            {
              icon: Coins,
              title: 'Quarterly Cash Flow',
              desc: 'Receive direct yield distributions quarterly via automated Mobile Money or direct transfer straight to your balance.',
            },
            {
              icon: Lock,
              title: 'Zero Hidden Spread',
              desc: '100% transparent fee structure: 0.50% annual admin fee, 0 XAF investor transaction fee, and full disclosure.',
            },
          ].map((pillar, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
            >
              <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <pillar.icon className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
                {pillar.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works: 4 Easy Steps */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider">
            Getting Started
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
            How Investing on GrowthFund Works
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            From initial research to your first Franc CFA distribution in four secure steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          {[
            {
              step: '01',
              title: 'Browse Marketplace',
              desc: 'Explore vetted clean energy, infrastructure, and real estate offerings with full risk disclosures and financial models in Franc CFA.',
            },
            {
              step: '02',
              title: 'Verify Identity (KYC)',
              desc: 'Complete seamless 2-minute identity verification to comply with anti-money laundering and regional investor protection rules.',
            },
            {
              step: '03',
              title: 'Allocate Capital',
              desc: 'Cash in using Mobile Money or bank wire, then invest starting at 25,000 XAF per project. Funds are held in audited escrow.',
            },
            {
              step: '04',
              title: 'Cash Out Yields',
              desc: 'Track your returns and cash out available balances anytime in multiples of 5,000 XAF directly to your Mobile Money or bank account.',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="relative bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2"
            >
              <span className="text-3xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400 block mb-3">
                {item.step}
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {item.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 text-white rounded-3xl p-8 sm:p-12 text-center space-y-6 border border-slate-800 shadow-xl">
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display max-w-2xl mx-auto">
            Ready to Explore Private Market Opportunities?
          </h2>
          <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Create your account today, get your unique referral code to earn 1,000 XAF per invite, and browse verified offerings starting from 25,000 XAF.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setCurrentPage('marketplace');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl text-sm transition-all shadow-md cursor-pointer"
            >
              Browse Open Opportunities
            </button>
            <button
              onClick={() => openAuthModal('signup')}
              className="px-8 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl text-sm border border-slate-700 transition-colors cursor-pointer"
            >
              Create Account
            </button>
          </div>

          <p className="text-[11px] text-slate-400 max-w-lg mx-auto">
            * All investments involve risk, including loss of principal. GrowthFund is a technology platform connecting investors with vetted private offerings.
          </p>
        </div>
      </section>
    </div>
  );
};
