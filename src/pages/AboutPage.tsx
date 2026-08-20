import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  Target, 
  Users, 
  Award, 
  Building2, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  FileText, 
  Scale, 
  Landmark, 
  Clock, 
  TrendingUp, 
  Globe2, 
  Download, 
  Check, 
  Search, 
  Briefcase,
  Layers,
  Sparkles,
  ArrowDownLeft,
  ArrowUpRight
} from 'lucide-react';
import { formatFCFA } from '../utils/currency';

export const AboutPage: React.FC = () => {
  const { setCurrentPage, setIsDepositModalOpen, openAuthModal, addToast } = useApp();
  const [activeTimelineYear, setActiveTimelineYear] = useState<string>('all');
  const [showFactsheetModal, setShowFactsheetModal] = useState<boolean>(false);

  const historyMilestones = [
    {
      year: '2018',
      title: 'Inception & Corporate Incorporation in Douala & Paris',
      badge: 'Foundation',
      summary: 'Founded with 1.5 Billion XAF in paid-up capital reserves to solve the acute shortage of transparent, bank-grade yield investments for Franc CFA capital holders.',
      details: [
        'Incorporated GrowthFund Capital Partners S.A. (RCCM: RC/DLA/2018/B/4192) at Akwa Financial Center, Douala.',
        'Established Paris liaison office for CEMAC & UEMOA diaspora investment corridors.',
        'Assembled an independent investment committee comprising former private equity partners and legal counsels.',
      ],
    },
    {
      year: '2019',
      title: 'Segregated Custodian & Bankruptcy-Remote Escrow Architecture',
      badge: 'Security & Custody',
      summary: 'Implemented a strict zero-commingling policy, ensuring 100% of investor capital sits in independent trustee escrow accounts.',
      details: [
        'Executed master custodian trust agreement with Ecobank Cameroon Custody & Trust S.A.',
        'Structured legal ring-fencing guaranteeing that investor funds cannot be attached by platform operational liabilities.',
        'Appointed PricewaterhouseCoopers (PwC) Central Africa as external statutory auditor.',
      ],
    },
    {
      year: '2020',
      title: 'Official COSUMAF Regional Capital Market Accreditation',
      badge: 'Regulatory License',
      summary: 'Granted formal approval under the Central African Financial Harmonization Framework (COSUMAF License #CMF-2021-GF09).',
      details: [
        'Passed comprehensive anti-money laundering (AML/CFT) systems audit with COBAC compliance standards.',
        'Standardized standardized asset prospectus formats compliant with OHADA commercial company law.',
        'Completed beta deployment with 120 initial accredited angel and institutional investors.',
      ],
    },
    {
      year: '2021',
      title: 'Flagship Clean Energy & Agro-Industrial Origination',
      badge: 'Asset Origination',
      summary: 'Successfully originated and funded over 4.8 Billion XAF in revenue-generating physical infrastructure.',
      details: [
        'Financed the Garoua 15MW Solar Photovoltaic Interconnect supplying 18,000 households with clean energy.',
        'Co-financed the Bafoussam Cashew & Cocoa agro-processing terminal with 620+ local cooperative farmers.',
        'Achieved 100% target yield fulfillment on initial quarterly payout distributions.',
      ],
    },
    {
      year: '2022',
      title: 'Democratization to 25,000 XAF & Retail Accessibility',
      badge: 'Democratization',
      summary: 'Lowered minimum ticket thresholds from institutional minimums (500,000 XAF) down to 25,000 XAF to enable everyday working professionals to invest.',
      details: [
        'Introduced automated fractional asset allocations backed by first-rank physical collateral.',
        'Surpassed 2,500 verified retail investors across Cameroon, Côte d’Ivoire, Senegal, Gabon, and the Diaspora.',
        'Maintained a spotless 0.00% default rate on all senior secured asset classes.',
      ],
    },
    {
      year: '2023',
      title: '3.2 Billion XAF in Distributed Returns & Instant Mobile Money',
      badge: 'Payout Milestone',
      summary: 'Achieved a major benchmark with over 3,200,000,000 XAF in cumulative yield dividends returned to investors on exact contractual dates.',
      details: [
        'Integrated instant automated Mobile Money settlements (MTN MoMo, Orange Money, Wave) with zero fee slippage.',
        'Implemented the 5,000 XAF increment cash-out framework for rapid liquidity access.',
        'Awarded Regional FinTech of the Year for Compliance & Financial Inclusion in Central Africa.',
      ],
    },
    {
      year: '2024 - 2026',
      title: '32.5 Billion XAF Scale, ESG Framework & Automated Referrals',
      badge: 'Present Day & Scale',
      summary: 'Over 32.5 Billion XAF in cumulative asset origination, 4,800+ active investors, and modern peer-to-peer referral bonus architecture.',
      details: [
        'Adopted International Finance Corporation (IFC) Environmental & Social Performance Standards across all listings.',
        'Activated the 1,000 XAF cash referral bonus network, distributing tens of millions in bonuses directly to investor wallets.',
        'Expanded regional origination pipeline into logistics warehouses, medical diagnostic clinics, and high-yield student housing.',
      ],
    },
  ];

  const filteredMilestones = activeTimelineYear === 'all' 
    ? historyMilestones 
    : historyMilestones.filter(m => m.year.includes(activeTimelineYear));

  const diligenceStages = [
    {
      stage: '01',
      title: 'Forensic Sponsor & AML Screening',
      desc: 'Extensive background checks, INTERPOL/OFAC database screening, credit bureau history, and tax clearance certificates for all company directors.',
    },
    {
      stage: '02',
      title: 'Physical & Engineering Audit',
      desc: 'Independent certified civil engineers and surveyors conduct on-site soil, structure, grid interconnect, or machinery appraisals.',
    },
    {
      stage: '03',
      title: 'Legal Collateral Pledging',
      desc: 'First-rank notarized mortgages, escrow bank reserve pledges, and personal sponsor guarantees executed prior to campaign launch.',
    },
    {
      stage: '04',
      title: 'Downside Stress-Testing',
      desc: 'Proprietary macroeconomic Monte Carlo simulations stress-testing energy prices, climate variability, and 30% revenue drops.',
    },
    {
      stage: '05',
      title: 'Investment Committee Veto',
      desc: 'Unanimous sanction required from the 5-member independent committee. Over 97% of inbound sponsor applications are rejected.',
    },
    {
      stage: '06',
      title: 'Tranche-Based Escrow Releases',
      desc: 'Capital is never released in a lump sum. Funds are unlocked in milestone-verified tranches overseen by Ecobank custody officers.',
    },
  ];

  const executiveTeam = [
    {
      name: 'Dr. Marc-Arthur Ebanda, CFA',
      role: 'Chief Executive Officer & Co-Founder',
      bio: 'Former Managing Director of Infrastructure Investments at Ecobank Capital and Emerging Africa Fund. Led $350M+ in CEMAC private asset syndications.',
      credentials: 'PhD Economics (Sorbonne) • CFA Charterholder',
    },
    {
      name: 'Maître Jonathan Sterling, JD',
      role: 'Chief Legal & Compliance Officer',
      bio: 'Admitted to the Paris & Cameroon Bar. Former Senior Legal Advisor to COSUMAF on regional crowdfunding regulations and OHADA securities laws.',
      credentials: 'LL.M Banking Law (Paris II Panthéon-Assas) • CAMS Certified',
    },
    {
      name: 'Aïssatou Diallo, MSc',
      role: 'Chief Risk & Diligence Officer',
      bio: '16+ years evaluating project finance risk across West and Central Africa at the African Development Bank (AfDB) and Proparco.',
      credentials: 'MSc Financial Engineering (HEC Paris)',
    },
    {
      name: 'Christian Nguema',
      role: 'Chief Technology & Security Officer',
      bio: 'FinTech architect specializing in high-throughput ledger engines, bank API integrations, and ISO 27001 data sovereignty infrastructure.',
      credentials: 'Ex-Orange Money Principal Engineer • CISSP',
    },
  ];

  const institutionalPartners = [
    {
      name: 'Ecobank Cameroon',
      role: 'Primary Custodian Bank & Escrow Trustee',
      detail: 'Segregated Trust Accounts & Automated Payout Rails',
    },
    {
      name: 'PricewaterhouseCoopers (PwC)',
      role: 'External Statutory Auditor',
      detail: 'Annual Financial & Escrow Compliance Audits',
    },
    {
      name: 'COSUMAF / CMF',
      role: 'Supervisory Regulatory Authority',
      detail: 'Registered Platform License #CMF-2021-GF09',
    },
    {
      name: 'Afriland First Bank',
      role: 'Regional Clearing & Settlement Partner',
      detail: 'Interbank Real-Time Transfer & Liquidity Desk',
    },
    {
      name: 'SCPA Mandeng & Associés',
      role: 'Specialized Securities Legal Counsel',
      detail: 'Notarized Collateral & Mortgage Perfection',
    },
    {
      name: 'Bureau Veritas Central Africa',
      role: 'Technical & Engineering Inspector',
      detail: 'On-Site Quality & Physical Asset Due Diligence',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16 pb-12 text-slate-800 dark:text-slate-200">
      
      {/* 1-Click Fast Navigation Bar for Accessibility */}
      <div className="bg-slate-100 dark:bg-slate-850 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-750 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 px-2 text-slate-600 dark:text-slate-300 font-medium">
          <Landmark className="w-4 h-4 text-emerald-600" />
          <span>GrowthFund Institutional Trust Hub</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              setCurrentPage('marketplace');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-3 py-1.5 bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 text-white rounded-xl font-bold flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
            <span>View Opportunities</span>
          </button>
          <button
            onClick={() => setIsDepositModalOpen(true)}
            className="px-3 py-1.5 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-200 rounded-xl font-bold flex items-center gap-1 cursor-pointer transition-colors"
          >
            <ArrowDownLeft className="w-3.5 h-3.5" />
            <span>Cash In</span>
          </button>
          <button
            onClick={() => setShowFactsheetModal(true)}
            className="px-3 py-1.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 rounded-xl font-bold flex items-center gap-1 cursor-pointer transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-blue-500" />
            <span>Corporate Factsheet</span>
          </button>
        </div>
      </div>

      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>COSUMAF Licensed & Bank-Escrowed Infrastructure Platform</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white font-display tracking-tight leading-tight">
          Democratizing Franc CFA Private Markets with Uncompromising Diligence
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl mx-auto">
          Founded in 2018 by veteran institutional asset managers, GrowthFund provides individual and accredited investors with direct access to vetted, collateral-backed private real assets across Central & West Africa.
        </p>
      </div>

      {/* Institutional Key Metrics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-1 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Originated Capital</span>
          <p className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-mono">32.5B+ XAF</p>
          <p className="text-[11px] text-emerald-600 font-semibold">100% Vetted Collateral</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-1 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Verified Investors</span>
          <p className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-mono">4,800+</p>
          <p className="text-[11px] text-blue-600 font-semibold">Across 12 Countries</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-1 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Historical Default</span>
          <p className="text-xl sm:text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">0.00%</p>
          <p className="text-[11px] text-slate-500">Senior Secured Assets</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-1 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Paid-In Capital</span>
          <p className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-mono">1.5B XAF</p>
          <p className="text-[11px] text-purple-600 font-semibold">Statutory Capital Reserves</p>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION: DETAILED COMPANY HISTORY TIMELINE (2018 - 2026) */}
      {/* ============================================================ */}
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Institutional Heritage
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
              Our Journey & Milestones (2018 – 2026)
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Tracing eight years of regulatory compliance, technology development, and capital deployment.
            </p>
          </div>

          {/* Year Filter Buttons */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setActiveTimelineYear('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTimelineYear === 'all'
                  ? 'bg-slate-900 dark:bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              All Years
            </button>
            {['2018', '2019', '2020', '2021', '2022', '2023', '2024'].map((yr) => (
              <button
                key={yr}
                onClick={() => setActiveTimelineYear(yr)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTimelineYear === yr
                    ? 'bg-slate-900 dark:bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {yr}
              </button>
            ))}
          </div>
        </div>

        {/* Timeline Items */}
        <div className="space-y-6">
          {filteredMilestones.map((milestone, idx) => (
            <div 
              key={idx}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs transition-all hover:border-slate-300 dark:hover:border-slate-700"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <span className="px-3.5 py-1 rounded-xl bg-slate-900 dark:bg-emerald-600 text-white font-mono font-extrabold text-sm">
                    {milestone.year}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold">
                    {milestone.badge}
                  </span>
                </div>
                <span className="text-xs font-semibold text-slate-400">
                  GrowthFund Capital Partners S.A.
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                  {milestone.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  {milestone.summary}
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-850 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Key Accomplishments & Legal Actions
                </p>
                <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                  {milestone.details.map((detail, dIdx) => (
                    <li key={dIdx} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION: 6-STAGE INSTITUTIONAL UNDERWRITING PROCESS */}
      {/* ============================================================ */}
      <div className="space-y-6">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Risk & Rigor
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
            The 6-Stage Institutional Diligence Framework
          </h2>
          <p className="text-xs text-slate-500">
            Every project listed on GrowthFund must survive exhaustive forensic, legal, and engineering stress tests.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {diligenceStages.map((stg) => (
            <div
              key={stg.stage}
              className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs relative overflow-hidden"
            >
              <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-extrabold text-sm flex items-center justify-center">
                {stg.stage}
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {stg.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {stg.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION: EXECUTIVE LEADERSHIP & INDEPENDENT COMMITTEE */}
      {/* ============================================================ */}
      <div className="space-y-6">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
            Governance & Experience
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
            Executive Leadership & Investment Committee
          </h2>
          <p className="text-xs text-slate-500">
            Decades of combined leadership across global investment banking, legal compliance, and regional asset custody.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {executiveTeam.map((leader, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3 text-center shadow-xs flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 mx-auto flex items-center justify-center font-bold text-slate-800 dark:text-slate-100 text-base shadow-inner">
                  {leader.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">{leader.name}</h3>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">{leader.role}</p>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{leader.bio}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-mono font-medium text-slate-400 block">{leader.credentials}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION: AUDITED CUSTODIAN & INSTITUTIONAL PARTNERS */}
      {/* ============================================================ */}
      <div className="space-y-6">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Regulated Ecosystem
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
            Custodian Banks & Independent Partners
          </h2>
          <p className="text-xs text-slate-500">
            Full separation of functions ensures investor assets are safe, audited, and strictly segregated.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {institutionalPartners.map((partner, idx) => (
            <div
              key={idx}
              className="bg-slate-50 dark:bg-slate-850 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1.5"
            >
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-slate-400" />
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">{partner.name}</h3>
              </div>
              <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">{partner.role}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">{partner.detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION: BOTTOM CALL TO ACTION */}
      {/* ============================================================ */}
      <div className="bg-slate-900 dark:bg-slate-850 text-white rounded-3xl p-8 sm:p-12 text-center space-y-6 border border-slate-800 relative overflow-hidden">
        <div className="max-w-2xl mx-auto space-y-3">
          <h3 className="text-2xl sm:text-3xl font-extrabold font-display">
            Start Investing with Institutional Peace of Mind
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Join over 4,800 verified investors building diversified wealth in high-yielding Franc CFA real assets. Minimum investment starts at just 25,000 XAF with instant Mobile Money settlements.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => {
              setCurrentPage('marketplace');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-colors inline-flex items-center gap-2 shadow-lg cursor-pointer"
          >
            Explore Open Opportunities
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => openAuthModal('signup')}
            className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Create Free Account (+1,000 XAF Bonus)
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* MODAL: CORPORATE FACTSHEET & CERTIFICATE VIEWER */}
      {/* ============================================================ */}
      {showFactsheetModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div 
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden transition-all animate-in fade-in zoom-in-95 duration-200 text-xs"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-850">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">
                  Official Corporate Factsheet & Registration
                </span>
              </div>
              <button
                onClick={() => setShowFactsheetModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900 dark:text-white">Legal Entity Name</span>
                  <span className="font-mono text-slate-600 dark:text-slate-300">GrowthFund Capital Partners S.A.</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900 dark:text-white">Trade Register (RCCM)</span>
                  <span className="font-mono text-slate-600 dark:text-slate-300">RC/DLA/2018/B/4192</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900 dark:text-white">Regulatory License ID</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">COSUMAF #CMF-2021-GF09</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900 dark:text-white">Share Capital (Capital Social)</span>
                  <span className="font-mono text-slate-900 dark:text-white font-bold">1,500,000,000 XAF (Fully Paid)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900 dark:text-white">Registered Head Office</span>
                  <span className="text-slate-600 dark:text-slate-300">Akwa Financial Tower, 4th Fl., Douala, Cameroon</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 space-y-1">
                <div className="flex items-center gap-2 font-bold text-emerald-900 dark:text-emerald-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Audited Escrow & Trustee Custody</span>
                </div>
                <p className="text-[11px] text-emerald-800 dark:text-emerald-300 leading-relaxed">
                  All investor capital deposits are received and custodied by <strong>Ecobank Cameroon Custody & Trust S.A.</strong> in bankruptcy-remote segregated accounts under the supervision of PwC Central Africa.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => {
                    addToast('Corporate Factsheet PDF downloaded successfully.', 'success');
                    setShowFactsheetModal(false);
                  }}
                  className="px-4 py-2 bg-slate-900 dark:bg-emerald-600 text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  Download Complete Factsheet (PDF)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
