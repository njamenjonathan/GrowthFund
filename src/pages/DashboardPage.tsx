import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PortfolioHolding } from '../types';
import { 
  Coins, 
  TrendingUp, 
  Briefcase, 
  Wallet, 
  ShieldCheck, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Download, 
  Calendar, 
  Clock, 
  ChevronRight, 
  AlertTriangle,
  Building,
  CheckCircle2,
  FileSpreadsheet,
  Settings,
  Plus,
  Gift,
  Copy,
  Share2,
  Users,
  Sparkles,
  Award,
  FileText,
  Database,
  CloudCheck
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { PORTFOLIO_CHART_DATA } from '../data/mockData';
import { formatFCFA, formatShortFCFA, formatXAF } from '../utils/currency';
import { CertificateModal } from '../components/CertificateModal';

export const DashboardPage: React.FC = () => {
  const { 
    user, 
    holdings, 
    transactions, 
    dashboardTab, 
    setDashboardTab, 
    setIsKYCModalOpen,
    setIsDepositModalOpen,
    setIsWithdrawModalOpen,
    navigateToOpportunity,
    applyReferralCode,
    simulateFriendReferral,
    setCurrentPage,
    addToast
  } = useApp();

  const [txFilter, setTxFilter] = useState<'All' | 'Investment' | 'Distribution' | 'Deposit' | 'Withdrawal' | 'Referral Bonus'>('All');
  const [inputReferralCode, setInputReferralCode] = useState<string>('');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  
  // Official Certificate Modal state
  const [selectedHoldingForCert, setSelectedHoldingForCert] = useState<PortfolioHolding | null>(null);
  const [isCertModalOpen, setIsCertModalOpen] = useState<boolean>(false);

  const openCertificate = (h: PortfolioHolding, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedHoldingForCert(h);
    setIsCertModalOpen(true);
  };

  // Calculate allocation breakdown
  const categoryTotals: Record<string, number> = {};
  holdings.forEach((h) => {
    categoryTotals[h.category] = (categoryTotals[h.category] || 0) + h.investedAmount;
  });

  const pieColors: Record<string, string> = {
    'Clean Energy': '#10B981',
    'Real Estate': '#3B82F6',
    Technology: '#8B5CF6',
    Healthcare: '#EC4899',
    Infrastructure: '#F59E0B',
    Agriculture: '#84CC16',
  };

  const allocationData = Object.keys(categoryTotals).map((cat) => ({
    name: cat,
    value: categoryTotals[cat],
    color: pieColors[cat] || '#64748B',
  }));

  const totalPortfolioValue = holdings.reduce((sum, h) => sum + h.currentValue, 0) + user.walletBalance;
  const totalInvestedCapital = holdings.reduce((sum, h) => sum + h.investedAmount, 0);
  const totalEarnedDistributions = holdings.reduce((sum, h) => sum + h.totalReturnsEarned, 0);

  const filteredTransactions = transactions.filter((t) => {
    if (txFilter === 'All') return true;
    return t.type === txFilter;
  });

  const handleExportCSV = () => {
    addToast('Transaction ledger exported to CSV.', 'info');
  };

  const handleCopyReferral = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(user.referralCode);
      setCopiedCode(true);
      addToast(`Referral code ${user.referralCode} copied to clipboard!`, 'success');
      setTimeout(() => setCopiedCode(false), 3000);
    }
  };

  const handleShareReferral = () => {
    const shareUrl = `${window.location.origin}/#ref=${user.referralCode}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      addToast('Referral invitation link copied to clipboard!', 'info');
    }
  };

  const handleApplyCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputReferralCode.trim()) return;
    const success = applyReferralCode(inputReferralCode);
    if (success) {
      setInputReferralCode('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 pb-20">
      {/* Top Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 dark:bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
            {user.initials}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white font-display">
                Welcome back, {user.name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                {user.kycTier}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Account: {user.accountNumber} • Referral Code: <strong className="text-slate-900 dark:text-white font-mono">{user.referralCode}</strong>
            </p>
          </div>
        </div>

        {/* Action buttons: Cash In & Cash Out */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsDepositModalOpen(true)}
            className="px-4 py-2.5 bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
          >
            <ArrowDownLeft className="w-4 h-4" />
            Cash In (Deposit FCFA)
          </button>
          <button
            onClick={() => setIsWithdrawModalOpen(true)}
            className="px-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <ArrowUpRight className="w-4 h-4" />
            Cash Out (5,000 XAF steps)
          </button>
        </div>
      </div>

      {/* Metric Cards Top Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Portfolio Value */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Total Portfolio Value</span>
            <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white truncate">
            {formatFCFA(totalPortfolioValue)}
          </p>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            +{formatFCFA(totalEarnedDistributions)} yield distributed
          </span>
        </div>

        {/* Active Capital */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Active Capital Deployed</span>
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white truncate">
            {formatFCFA(totalInvestedCapital)}
          </p>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            Across {holdings.length} active offerings
          </span>
        </div>

        {/* Available Cash Balance */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Cash Balance</span>
            <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white truncate">
            {formatFCFA(user.walletBalance)}
          </p>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            Ready for cash out (in 5,000s) or invest
          </span>
        </div>

        {/* Referral Earnings */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2 cursor-pointer hover:border-emerald-500/50 transition-colors" onClick={() => setDashboardTab('referrals')}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Referral Bonus Balance</span>
            <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
              <Gift className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white truncate">
            {formatXAF(user.referralEarnings)}
          </p>
          <span className="text-[11px] text-purple-600 dark:text-purple-400 font-bold flex items-center gap-1">
            <Users className="w-3 h-3" />
            {user.referralCount} referred • +1,000 XAF/ref
          </span>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto scrollbar-none">
        {[
          { id: 'overview', label: 'Portfolio Overview' },
          { id: 'portfolio', label: `My Holdings (${holdings.length})` },
          { id: 'referrals', label: `Referrals & Bonuses (+1000 XAF)` },
          { id: 'transactions', label: `Transactions (${transactions.length})` },
          { id: 'verification', label: 'Identity & Compliance' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setDashboardTab(tab.id as any)}
            className={`py-3.5 px-4 text-xs font-bold whitespace-nowrap border-b-2 transition-all cursor-pointer ${
              dashboardTab === tab.id
                ? 'border-slate-900 dark:border-emerald-500 text-slate-900 dark:text-white'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW */}
      {dashboardTab === 'overview' && (
        <div className="space-y-8">
          {/* Charts Grid: Projected Growth Chart + Sector Allocation Pie */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 8 cols: Projected Growth Chart */}
            <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
                    Portfolio Value & Compounding Trajectory
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Quarterly yield accumulation & reinvestment projection (Franc CFA)
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-lg">
                  Net IRR Target: 10.2% p.a.*
                </span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={PORTFOLIO_CHART_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#94A3B8" opacity={0.2} />
                    <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} />
                    <YAxis stroke="#94A3B8" fontSize={11} tickFormatter={(v) => formatShortFCFA(v)} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0F172A',
                        borderRadius: '12px',
                        border: 'none',
                        color: '#fff',
                        fontSize: '12px',
                      }}
                      formatter={(v: any) => [formatFCFA(Number(v)), 'Portfolio Total']}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#10B981"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#colorVal)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Right 4 cols: Allocation Pie */}
            <div className="lg:col-span-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
                  Sector Allocation (FCFA)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Diversification by asset class
                </p>
              </div>

              <div className="h-44 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={allocationData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={3}
                    >
                      {allocationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0F172A',
                        borderRadius: '12px',
                        border: 'none',
                        color: '#fff',
                        fontSize: '12px',
                      }}
                      formatter={(v: any) => [formatFCFA(Number(v)), 'Invested']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-1.5 text-xs">
                {allocationData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      {item.name}
                    </span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {formatFCFA(item.value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Referral Banner in Overview */}
          <div className="p-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 rounded-3xl text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-md">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-amber-300" />
                <h4 className="font-extrabold text-lg">Invite Friends & Earn 1,000 XAF Bonus</h4>
              </div>
              <p className="text-xs text-emerald-100 max-w-xl leading-relaxed">
                Give your personal referral code to friends. When they join GrowthFund, you automatically receive a <strong>1,000 XAF</strong> cash bonus directly in your wallet!
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setDashboardTab('referrals')}
                className="px-4 py-2.5 bg-white text-slate-900 hover:bg-slate-100 font-bold rounded-xl text-xs transition-colors shadow-sm"
              >
                View Referral Center
              </button>
            </div>
          </div>

          {/* Quick Holdings Preview Table */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Active Asset Holdings
                </h3>
                <p className="text-xs text-slate-500">Live positions in verified projects</p>
              </div>
              <button
                onClick={() => setDashboardTab('portfolio')}
                className="text-xs font-bold text-emerald-600 hover:underline cursor-pointer"
              >
                View all details
              </button>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {holdings.map((h) => (
                <div
                  key={h.id}
                  onClick={() => navigateToOpportunity(h.opportunityId)}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors cursor-pointer"
                >
                  <div className="space-y-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {h.category}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {h.opportunityTitle}
                    </h4>
                    <p className="text-xs text-slate-500">
                      Allocated: {h.investedDate} • Maturity: {h.maturityDate}
                    </p>
                  </div>

                  <div className="flex items-center gap-6 self-stretch sm:self-auto justify-between">
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Principal</span>
                      <span className="text-sm font-bold font-mono text-slate-900 dark:text-white">
                        {formatFCFA(h.investedAmount)}
                      </span>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Yield Received</span>
                      <span className="text-sm font-bold font-mono text-emerald-600 dark:text-emerald-400">
                        +{formatFCFA(h.totalReturnsEarned)}
                      </span>
                    </div>

                    <ChevronRight className="w-4 h-4 text-slate-400 hidden sm:block" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PORTFOLIO HOLDINGS */}
      {dashboardTab === 'portfolio' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Detailed Investment Positions
              </h2>
              <p className="text-xs text-slate-500">
                Track your active equity and debt holdings, earned distributions, and maturity dates in Franc CFA.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {holdings.map((h) => (
              <div
                key={h.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-xs"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                      {h.status} Position
                    </span>
                    <h3
                      onClick={() => navigateToOpportunity(h.opportunityId)}
                      className="text-base font-bold text-slate-900 dark:text-white hover:text-emerald-600 transition-colors cursor-pointer mt-2"
                    >
                      {h.opportunityTitle}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">{h.category}</p>
                  </div>
                  <span className="font-mono text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-lg">
                    {h.projectedReturnRate}% p.a.*
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl text-xs">
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase font-bold block">Principal Invested</span>
                    <span className="font-bold text-slate-900 dark:text-white font-mono text-sm">
                      {formatFCFA(h.investedAmount)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase font-bold block">Total Yield Received</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono text-sm">
                      +{formatFCFA(h.totalReturnsEarned)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase font-bold block">Next Distribution</span>
                    <span className="font-medium text-slate-900 dark:text-white">{h.nextDistributionDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase font-bold block">Maturity Horizon</span>
                    <span className="font-medium text-slate-900 dark:text-white">{h.maturityDate}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <span className="text-slate-400 text-[11px]">Subscribed: {h.investedDate}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => openCertificate(h, e)}
                      className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 rounded-lg font-bold flex items-center gap-1 cursor-pointer transition-colors text-[11px]"
                      title="View Official Certificate of Beneficial Ownership"
                    >
                      <Award className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Official Certificate</span>
                    </button>
                    <button
                      onClick={() => navigateToOpportunity(h.opportunityId)}
                      className="text-slate-600 dark:text-slate-300 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Project Details</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: REFERRALS & BONUSES */}
      {dashboardTab === 'referrals' && (
        <div className="space-y-8 max-w-5xl">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white font-display">
                GrowthFund Referral Program
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Share your referral code with colleagues and friends. You earn a <strong>1,000 XAF</strong> cash bonus for each successful referral!
              </p>
            </div>

            <button
              onClick={() => simulateFriendReferral()}
              className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer self-start sm:self-auto"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              Simulate Friend Referral (+1,000 XAF)
            </button>
          </div>

          {/* Referral Code Card & Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Main Code Box (2 cols) */}
            <div className="md:col-span-2 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-2xl">
                  <Gift className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Your Personal Referral Code
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Earn 1,000 XAF for every verified member who signs up with your code
                  </p>
                </div>
              </div>

              {/* Code display & copy bar */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-center sm:text-left">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                    Referral Code
                  </span>
                  <span className="font-mono text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-wider">
                    {user.referralCode}
                  </span>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={handleCopyReferral}
                    className="flex-1 sm:flex-none px-4 py-2.5 bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Copy className="w-4 h-4" />
                    {copiedCode ? 'Copied!' : 'Copy Code'}
                  </button>
                  <button
                    onClick={handleShareReferral}
                    className="px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Share2 className="w-4 h-4" />
                    Share Link
                  </button>
                </div>
              </div>

              {/* How it works 3-step grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="w-6 h-6 rounded-full bg-slate-900 dark:bg-slate-700 text-white font-bold flex items-center justify-center text-xs">
                    1
                  </span>
                  <p className="font-bold text-slate-900 dark:text-white pt-1">Share Code</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Send your referral code {user.referralCode} to your friends or family.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="w-6 h-6 rounded-full bg-slate-900 dark:bg-slate-700 text-white font-bold flex items-center justify-center text-xs">
                    2
                  </span>
                  <p className="font-bold text-slate-900 dark:text-white pt-1">Friend Joins</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    They enter your code when creating an account on GrowthFund.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-1">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">
                    3
                  </span>
                  <p className="font-bold text-emerald-900 dark:text-emerald-300 pt-1">+1,000 XAF Paid</p>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                    You instantly receive 1,000 XAF cash in your wallet balance!
                  </p>
                </div>
              </div>
            </div>

            {/* Apply a Referral Code Box (1 col) */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Apply a Referral Code
                  </h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Were you referred by a friend? Enter their code to receive a <strong>+1,000 XAF</strong> welcome bonus into your Cash Balance!
                </p>

                {user.referredBy ? (
                  <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Referred by <strong>{user.referredBy}</strong> (Bonus Credited).</span>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCodeSubmit} className="space-y-3 pt-1">
                    <div>
                      <input
                        type="text"
                        placeholder="e.g. GROWTH-XAF772"
                        value={inputReferralCode}
                        onChange={(e) => setInputReferralCode(e.target.value.toUpperCase())}
                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-xs font-bold text-slate-900 dark:text-white uppercase focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2.5 bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-colors shadow-xs"
                    >
                      Claim 1,000 XAF Bonus
                    </button>
                  </form>
                )}
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
                <span className="font-bold text-slate-700 dark:text-slate-300 block">Withdrawal Notice:</span>
                <p>Referral bonuses are immediately available and can be withdrawn in standard multiples of 5,000 XAF.</p>
              </div>
            </div>
          </div>

          {/* Referred Friends Table */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Referred Members List ({user.referredFriends.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Total Bonus Earned: <strong className="text-emerald-600 dark:text-emerald-400 font-mono">{formatXAF(user.referralEarnings)}</strong>
                </p>
              </div>

              <button
                onClick={() => simulateFriendReferral()}
                className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Invite Another
              </button>
            </div>

            {user.referredFriends.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                <p>No referrals yet. Share your code to start earning 1,000 XAF per friend!</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {user.referredFriends.map((f) => (
                  <div key={f.id} className="p-4 sm:p-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold flex items-center justify-center text-xs">
                        {f.name.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">{f.name}</p>
                        <p className="text-slate-500 text-[11px]">{f.email} • Joined {f.date}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                        +{formatXAF(f.bonus)}
                      </p>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                        {f.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: TRANSACTIONS */}
      {dashboardTab === 'transactions' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Transaction Ledger & Cash Flow (Franc CFA)
              </h2>
              <p className="text-xs text-slate-500">
                Audited record of all capital investments, Mobile Money cash-ins, 5,000 XAF withdrawals, and referral payouts.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExportCSV}
                className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4" />
                Export CSV
              </button>
            </div>
          </div>

          {/* Filter Chips */}
          <div className="flex gap-2 overflow-x-auto pb-1 text-xs scrollbar-none">
            {['All', 'Investment', 'Distribution', 'Deposit', 'Withdrawal', 'Referral Bonus'].map((type) => (
              <button
                key={type}
                onClick={() => setTxFilter(type as any)}
                className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                  txFilter === type
                    ? 'bg-slate-900 dark:bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-750'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Transactions Table */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredTransactions.map((tx) => {
                const isPositive = tx.type === 'Distribution' || tx.type === 'Deposit' || tx.type === 'Referral Bonus';
                return (
                  <div key={tx.id} className="p-4 sm:p-5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`p-2.5 rounded-xl ${
                          tx.type === 'Distribution'
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600'
                            : tx.type === 'Investment'
                            ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                            : tx.type === 'Deposit'
                            ? 'bg-blue-100 dark:bg-blue-950 text-blue-600'
                            : tx.type === 'Referral Bonus'
                            ? 'bg-purple-100 dark:bg-purple-950 text-purple-600'
                            : 'bg-amber-100 dark:bg-amber-950 text-amber-600'
                        }`}
                      >
                        {tx.type === 'Investment' && <Briefcase className="w-4 h-4" />}
                        {tx.type === 'Distribution' && <TrendingUp className="w-4 h-4" />}
                        {tx.type === 'Deposit' && <ArrowDownLeft className="w-4 h-4" />}
                        {tx.type === 'Withdrawal' && <ArrowUpRight className="w-4 h-4" />}
                        {tx.type === 'Referral Bonus' && <Gift className="w-4 h-4" />}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white text-sm">
                            {tx.projectName}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                            {tx.type}
                          </span>
                        </div>
                        <p className="text-slate-500 text-[11px] mt-0.5">
                          {tx.date} • Ref: {tx.referenceId}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p
                        className={`font-mono text-sm font-bold ${
                          isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'
                        }`}
                      >
                        {isPositive ? '+' : '-'}{formatFCFA(tx.amount)}
                      </p>
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                        {tx.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: IDENTITY & VERIFICATION */}
      {dashboardTab === 'verification' && (
        <div className="space-y-6 max-w-3xl">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Identity Verification & Compliance Profile
            </h2>
            <p className="text-xs text-slate-500">
              Regulatory compliance profile and verified investor tier.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6 shadow-xs">
            <div className="flex items-center justify-between p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-xs">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-600 text-white rounded-xl">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-emerald-900 dark:text-emerald-200 text-sm">
                    Current Tier: {user.kycTier}
                  </h4>
                  <p className="text-emerald-700 dark:text-emerald-400 mt-0.5">
                    Your identity has been verified under AML & financial regulations.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsKYCModalOpen(true)}
                className="px-3.5 py-2 bg-white dark:bg-slate-850 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 rounded-xl font-bold hover:bg-emerald-100 transition-colors"
              >
                Re-Verify / Upgrade
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-slate-500 font-bold block">Standard Retail Allocation Limit</span>
                <span className="font-bold text-slate-900 dark:text-white text-base">50,000,000 XAF / Year</span>
                <p className="text-[11px] text-slate-400">Available to all verified individuals.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-slate-500 font-bold block">Accredited Tier Limit</span>
                <span className="font-bold text-slate-900 dark:text-white text-base">Unlimited</span>
                <p className="text-[11px] text-slate-400">Institutional and high net-worth investors.</p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Tax & Legal Identification on File
              </h4>
              <div className="space-y-2 text-xs">
                {[
                  { name: 'National ID / Passport Verification (AML Tier 1)', date: 'Verified Valid' },
                  { name: 'Mobile Money Phone / Account Proof on File', date: 'Active' },
                  { name: 'GrowthFund Investor Electronic Terms of Service', date: 'Signed' },
                ].map((doc, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850"
                  >
                    <span className="font-medium text-slate-800 dark:text-slate-200">{doc.name}</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">{doc.date}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Cloud Firestore & Firebase Auth Security Card */}
            <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 flex items-start gap-3.5 text-xs">
              <div className="p-2 bg-emerald-600 text-white rounded-xl shrink-0 mt-0.5">
                <Database className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 dark:text-white">Firebase Auth & Firestore Data Synchronization</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                    Live Real-Time
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                  Your investor profile, portfolio holdings, cash-in/out records, and referral codes are encrypted and persisted in Google Cloud Firestore database.
                </p>
                {user.uid && (
                  <p className="font-mono text-[10px] text-slate-500 dark:text-slate-400 pt-1">
                    Firebase UID: <span className="font-bold text-slate-700 dark:text-slate-300">{user.uid}</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Official Certificate of Investment Modal */}
      <CertificateModal
        holding={selectedHoldingForCert}
        isOpen={isCertModalOpen}
        onClose={() => {
          setIsCertModalOpen(false);
          setSelectedHoldingForCert(null);
        }}
      />
    </div>
  );
};
