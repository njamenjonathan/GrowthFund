import { InvestmentOpportunity, PortfolioHolding, Transaction, UserProfile } from '../types';

export const INITIAL_USER: UserProfile = {
  name: 'Jean-Marc Kamga',
  email: 'jean.kamga@example.com',
  initials: 'JK',
  accountNumber: 'GF-XAF-904128',
  kycTier: 'Tier 1 Verified',
  isKycApproved: true,
  walletBalance: 425000, // 425,000 FCFA
  totalInvested: 6500000, // 6,500,000 FCFA
  totalReturns: 580000, // 580,000 FCFA
  activeInvestmentsCount: 4,
  notificationsCount: 2,
  joinedDate: 'March 2024',
  memberSince: 'March 2024',
  referralCode: 'GROWTH-XAF772',
  referralCount: 4,
  referralEarnings: 4000, // 4 x 1,000 XAF
  referredFriends: [
    {
      id: 'ref-1',
      name: 'Amina Diallo',
      email: 'amina.d***@gmail.com',
      date: '14 Oct 2024',
      bonus: 1000,
      status: 'Bonus Paid',
    },
    {
      id: 'ref-2',
      name: 'Koffi Mensah',
      email: 'koffi.m***@yahoo.fr',
      date: '02 Oct 2024',
      bonus: 1000,
      status: 'Bonus Paid',
    },
    {
      id: 'ref-3',
      name: 'Fatou Sow',
      email: 'fatou.s***@outlook.com',
      date: '19 Sep 2024',
      bonus: 1000,
      status: 'Bonus Paid',
    },
    {
      id: 'ref-4',
      name: 'Christian Nguema',
      email: 'c.nguema***@gmail.com',
      date: '05 Sep 2024',
      bonus: 1000,
      status: 'Bonus Paid',
    },
  ],
};

export const PORTFOLIO_CHART_DATA = [
  { month: 'Jan', value: 4500000, returns: 65000 },
  { month: 'Feb', value: 4750000, returns: 115000 },
  { month: 'Mar', value: 5100000, returns: 180000 },
  { month: 'Apr', value: 5450000, returns: 250000 },
  { month: 'May', value: 5800000, returns: 320000 },
  { month: 'Jun', value: 6050000, returns: 395000 },
  { month: 'Jul', value: 6300000, returns: 485000 },
  { month: 'Aug', value: 6500000, returns: 580000 },
  { month: 'Sep (P)', value: 6850000, returns: 670000 },
  { month: 'Oct (P)', value: 7200000, returns: 765000 },
  { month: 'Nov (P)', value: 7600000, returns: 870000 },
  { month: 'Dec (P)', value: 8050000, returns: 980000 },
];

export const INITIAL_HOLDINGS: PortfolioHolding[] = [
  {
    id: 'hold-1',
    opportunityId: 'opp-solar-texas',
    opportunityTitle: 'Green Future Solar Farm',
    category: 'Energy',
    investedAmount: 2500000,
    currentValue: 2715000,
    totalReturnsEarned: 215000,
    projectedReturnRate: 9.8,
    investedDate: '12 Oct 2024',
    maturityDate: '12 Oct 2027',
    nextDistributionDate: '15 Nov 2024',
    status: 'Active',
    riskLevel: 'Medium',
  },
  {
    id: 'hold-2',
    opportunityId: 'opp-agritech',
    opportunityTitle: 'AgriTech Vertical Farm Expansion Phase II',
    category: 'Agriculture',
    investedAmount: 1500000,
    currentValue: 1620000,
    totalReturnsEarned: 120000,
    projectedReturnRate: 10.2,
    investedDate: '28 Sep 2024',
    maturityDate: '28 Sep 2026',
    nextDistributionDate: '01 Dec 2024',
    status: 'Active',
    riskLevel: 'Medium',
  },
  {
    id: 'hold-3',
    opportunityId: 'opp-downtown-hub',
    opportunityTitle: 'Downtown Commercial Hub Development',
    category: 'Real Estate',
    investedAmount: 2500000,
    currentValue: 2745000,
    totalReturnsEarned: 245000,
    projectedReturnRate: 7.2,
    investedDate: '15 Aug 2024',
    maturityDate: '15 Aug 2029',
    nextDistributionDate: '30 Nov 2024',
    status: 'Active',
    riskLevel: 'Low',
  },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-101',
    date: '14 Oct 2024',
    type: 'Referral Bonus',
    projectName: 'Referral Bonus (Amina Diallo)',
    amount: 1000,
    status: 'Completed',
    referenceId: 'GF-REF-882193',
  },
  {
    id: 'tx-102',
    date: '12 Oct 2024',
    type: 'Investment',
    projectName: 'Green Future Solar Farm',
    amount: 2500000,
    status: 'Completed',
    referenceId: 'GF-TX-882194',
  },
  {
    id: 'tx-103',
    date: '28 Sep 2024',
    type: 'Investment',
    projectName: 'AgriTech Vertical Farm Phase II',
    amount: 1500000,
    status: 'Completed',
    referenceId: 'GF-TX-792014',
  },
  {
    id: 'tx-104',
    date: '15 Aug 2024',
    type: 'Investment',
    projectName: 'Downtown Commercial Hub',
    amount: 2500000,
    status: 'Completed',
    referenceId: 'GF-TX-651928',
  },
  {
    id: 'tx-105',
    date: '01 Aug 2024',
    type: 'Return Distribution',
    projectName: 'Downtown Commercial Hub (Q2 Yield)',
    amount: 75000,
    status: 'Completed',
    referenceId: 'GF-TX-540192',
  },
  {
    id: 'tx-106',
    date: '20 Jul 2024',
    type: 'Deposit',
    projectName: 'MTN Mobile Money Deposit',
    amount: 500000,
    status: 'Completed',
    referenceId: 'GF-DEP-419082',
  },
];

export const OPPORTUNITIES: InvestmentOpportunity[] = [
  {
    id: 'opp-solar-texas',
    title: 'Green Future Solar Farm',
    tagline: 'Utility-scale solar generation facility backed by a 15-year power purchase agreement.',
    category: 'Energy',
    location: 'Sahel Clean Power Corridor',
    riskLevel: 'Medium',
    minInvestment: 25000, // 25,000 FCFA
    fundingGoal: 450000000, // 450M FCFA
    amountRaised: 345000000, // 345M FCFA
    investorsCount: 412,
    projectedReturnMin: 8.5,
    projectedReturnMax: 10.2,
    durationYears: '3-5 Years',
    durationCategory: '3-5 years',
    distributionFrequency: 'Quarterly',
    status: 'Funding Open',
    isFeatured: true,
    daysLeft: 18,
    sponsor: 'Helios Clean Capital',
    securityStructure: 'Senior Asset-Backed Note',
    escrowAgent: 'Societe Generale Custody & Trust',
    imageUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1497440001374-f26997328c1b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80',
    ],
    overview: 'The Green Future Solar Farm is a utility-scale solar generation facility engineered for sustainable baseload clean energy. Backed by a 15-year Power Purchase Agreement (PPA) with regional industrial off-takers. Capital raised supports final photovoltaic deployment and grid interconnect.',
    businessPlan: {
      executiveSummary: 'Combines monocrystalline bifacial panels with smart tracking arrays, delivering high operational yield across long-term purchase contracts.',
      marketOpportunity: 'Industrial power demand is expanding at >18% CAGR across key regional economic corridors seeking reliable and green electricity.',
      useOfProceeds: [
        { label: 'Photovoltaic Hardware & Inverters', percentage: 55 },
        { label: 'Civil Works & Substation Interconnect', percentage: 25 },
        { label: 'Working Capital & Contingency Reserve', percentage: 12 },
        { label: 'Environmental & Legal Compliance', percentage: 8 },
      ],
      milestones: [
        { date: 'Q1 2024', title: 'Environmental Permitting & Land Lease Secured', completed: true },
        { date: 'Q3 2024', title: 'Power Off-Take Agreement Executed', completed: true },
        { date: 'Q1 2025', title: 'Civil Works & Substation Construction', completed: false },
        { date: 'Q3 2025', title: 'Commercial Operations & Initial Distribution', completed: false },
      ],
    },
    financials: {
      summary: 'Revenues are contracted under fixed multi-year tariffs with quarterly investor distributions after statutory reserve allocations.',
      metrics: [
        { year: '2025 (P)', revenue: '125,000,000 FCFA', netOperatingIncome: '94,000,000 FCFA', projectedDistribution: '8.5%' },
        { year: '2026 (P)', revenue: '160,000,000 FCFA', netOperatingIncome: '124,000,000 FCFA', projectedDistribution: '9.2%' },
        { year: '2027 (P)', revenue: '175,000,000 FCFA', netOperatingIncome: '138,000,000 FCFA', projectedDistribution: '9.8%' },
        { year: '2028 (P)', revenue: '190,000,000 FCFA', netOperatingIncome: '150,000,000 FCFA', projectedDistribution: '10.2%' },
      ],
      feeStructure: 'GrowthFund charges a 0.50% annual administrative asset management fee. 0% deposit or transaction fees.',
    },
    documents: [
      { id: 'doc-1', name: 'Offering Memorandum & Prospectus (PDF)', type: 'PDF', size: '4.2 MB', date: 'Oct 2024' },
      { id: 'doc-2', name: 'Independent Engineering Audit Report (PDF)', type: 'PDF', size: '2.8 MB', date: 'Sep 2024' },
      { id: 'doc-3', name: 'Power Purchase Agreement Summary (PDF)', type: 'PDF', size: '1.5 MB', date: 'Aug 2024' },
      { id: 'doc-4', name: 'Trust & Escrow Agreement (PDF)', type: 'PDF', size: '890 KB', date: 'Oct 2024' },
    ],
    historicalTrend: [20, 22, 25, 28, 32, 38, 45, 52, 60, 68, 75],
  },
  {
    id: 'opp-agritech',
    title: 'AgriTech Vertical Farm Expansion Phase II',
    tagline: 'Controlled-environment indoor agriculture with 95% water reduction supplying supermarkets.',
    category: 'Agriculture',
    location: 'Abidjan Agro-Industrial Park',
    riskLevel: 'Medium',
    minInvestment: 25000, // 25,000 FCFA
    fundingGoal: 300000000, // 300M FCFA
    amountRaised: 235000000, // 235M FCFA
    investorsCount: 328,
    projectedReturnMin: 8.5,
    projectedReturnMax: 10.2,
    durationYears: '3-5 Years',
    durationCategory: '3-5 years',
    distributionFrequency: 'Semi-Annually',
    status: 'Funding Open',
    isFeatured: true,
    daysLeft: 24,
    sponsor: 'AfriGrow BioSystems',
    securityStructure: 'Secured Preferred Equity',
    escrowAgent: 'Ecobank Asset Management Custody',
    imageUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=800&q=80',
    ],
    overview: 'Expanding high-tech indoor hydroponic cultivation facilities producing organic vegetables and premium crops year-round with climate control and zero pesticide usage.',
    businessPlan: {
      executiveSummary: 'Controlled agriculture reduces drought risk and maximizes crop rotation frequency with automated sensors and optimal LED lighting recipes.',
      marketOpportunity: 'Urban retail food markets demand clean, high-grade local produce with guaranteed freshness and stable pricing.',
      useOfProceeds: [
        { label: 'Automated Hydroponic Racks & Sensors', percentage: 50 },
        { label: 'Climate Control & Cold-Chain Logistics', percentage: 28 },
        { label: 'Packaging Facility & Distribution Fleet', percentage: 14 },
        { label: 'Working Capital & Safety Reserve', percentage: 8 },
      ],
      milestones: [
        { date: 'Phase I', title: 'Phase I Facility Operational & Profitable', completed: true },
        { date: 'Phase II', title: 'Warehouse Lease & Engineering Executed', completed: true },
        { date: '2025', title: 'Hydroponic System Fit-Out & First Planting', completed: false },
      ],
    },
    financials: {
      summary: 'Phase I operates with steady cash flow. Phase II expands production capacity by 3.5x to meet supermarket off-take demand.',
      metrics: [
        { year: '2025 (P)', revenue: '180,000,000 FCFA', netOperatingIncome: '68,000,000 FCFA', projectedDistribution: '8.5%' },
        { year: '2026 (P)', revenue: '290,000,000 FCFA', netOperatingIncome: '115,000,000 FCFA', projectedDistribution: '9.4%' },
        { year: '2027 (P)', revenue: '360,000,000 FCFA', netOperatingIncome: '148,000,000 FCFA', projectedDistribution: '10.2%' },
      ],
      feeStructure: 'GrowthFund charges a 0.50% p.a. asset management fee.',
    },
    documents: [
      { id: 'doc-ag1', name: 'AgriTech II Offering Memorandum (PDF)', type: 'PDF', size: '3.6 MB', date: 'Sep 2024' },
      { id: 'doc-ag2', name: 'Commercial Supermarket Supply Agreements (PDF)', type: 'PDF', size: '1.9 MB', date: 'Aug 2024' },
    ],
    historicalTrend: [10, 15, 22, 34, 48, 59, 68, 78],
  },
  {
    id: 'opp-downtown-hub',
    title: 'Downtown Commercial Hub Development',
    tagline: 'Modern mixed-use commercial center with pre-leased corporate and logistics tenants.',
    category: 'Real Estate',
    location: 'Douala Business District',
    riskLevel: 'Low',
    minInvestment: 50000, // 50,000 FCFA
    fundingGoal: 650000000, // 650M FCFA
    amountRaised: 490000000, // 490M FCFA
    investorsCount: 290,
    projectedReturnMin: 6.2,
    projectedReturnMax: 7.5,
    durationYears: '5+ Years',
    durationCategory: '5+ years',
    distributionFrequency: 'Quarterly',
    status: 'Funding Open',
    isFeatured: true,
    daysLeft: 31,
    sponsor: 'Prestige Commercial Realty',
    securityStructure: 'First-Lien Mortgage Bond',
    escrowAgent: 'UBA Trust & Securities',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    ],
    overview: 'A premium commercial hub featuring modern offices, banking halls, and secure transit warehousing. 72% pre-leased to multinational and regional corporations with long-term rental agreements.',
    businessPlan: {
      executiveSummary: 'Prime commercial asset with high visibility and fiber connectivity, engineered for long-term rental appreciation and consistent yield payouts.',
      marketOpportunity: 'Prime corporate office vacancy in the central commerce district remains below 5% due to growing international trade and regional banking expansion.',
      useOfProceeds: [
        { label: 'Construction & Finishing Works', percentage: 65 },
        { label: 'Tenant Interior Customization', percentage: 20 },
        { label: 'Debt Service Reserve & Escrow', percentage: 10 },
        { label: 'Legal & Syndication Structure', percentage: 5 },
      ],
      milestones: [
        { date: 'Q2 2024', title: 'Building Superstructure Completed', completed: true },
        { date: 'Q4 2024', title: '72% Anchor Tenant Leases Finalized', completed: true },
        { date: 'Q2 2025', title: 'Occupancy Handover & Yield Launch', completed: false },
      ],
    },
    financials: {
      summary: 'Weighted average lease term of 8.5 years provides dependable quarterly cash distributions.',
      metrics: [
        { year: '2025 (P)', revenue: '220,000,000 FCFA', netOperatingIncome: '175,000,000 FCFA', projectedDistribution: '6.2%' },
        { year: '2026 (P)', revenue: '310,000,000 FCFA', netOperatingIncome: '248,000,000 FCFA', projectedDistribution: '6.9%' },
        { year: '2027 (P)', revenue: '345,000,000 FCFA', netOperatingIncome: '276,000,000 FCFA', projectedDistribution: '7.5%' },
      ],
      feeStructure: '0.50% annual asset management fee. No exit penalties.',
    },
    documents: [
      { id: 'doc-re1', name: 'Commercial Hub Placement Memorandum (PDF)', type: 'PDF', size: '5.1 MB', date: 'Aug 2024' },
      { id: 'doc-re2', name: 'Independent Property Appraisal Report (PDF)', type: 'PDF', size: '8.4 MB', date: 'Jul 2024' },
    ],
    historicalTrend: [15, 20, 28, 35, 40, 45],
  },
  {
    id: 'opp-solar-alpha',
    title: 'Battery Energy Storage & Solar Substation',
    tagline: 'High-capacity solar array paired with industrial battery storage for peak demand stabilization.',
    category: 'Energy',
    location: 'Dakar Industrial Energy Hub',
    riskLevel: 'High',
    minInvestment: 50000, // 50,000 FCFA
    fundingGoal: 500000000, // 500M FCFA
    amountRaised: 460000000, // 460M FCFA
    investorsCount: 489,
    projectedReturnMin: 12.0,
    projectedReturnMax: 15.5,
    durationYears: '1-3 Years',
    durationCategory: '1-3 years',
    distributionFrequency: 'Quarterly',
    status: 'Funding Open',
    daysLeft: 12,
    sponsor: 'VoltPeak Energy Infrastructure',
    securityStructure: 'Asset-Backed High-Yield Note',
    escrowAgent: 'Coris Bank International Custody',
    imageUrl: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=800&q=80',
    ],
    overview: 'Pairs 40MW solar capacity with advanced lithium battery energy storage to supply energy during peak evening demand hours at premium contracted wholesale tariffs.',
    businessPlan: {
      executiveSummary: 'Energy storage captures abundant midday solar generation and injects power during evening peak hours when grid rates surge.',
      marketOpportunity: 'Regional grid operators are incentivizing fast-response battery storage to reduce reliance on heavy fuel oil peaking plants.',
      useOfProceeds: [
        { label: 'Industrial Battery Energy Storage System (BESS)', percentage: 60 },
        { label: 'Substation & High-Voltage Interconnect', percentage: 22 },
        { label: 'Engineering, Procurement & Commissioning', percentage: 12 },
        { label: 'Contingency & Reserve Fund', percentage: 6 },
      ],
      milestones: [
        { date: 'Q1 2024', title: 'Grid Interconnection Approval', completed: true },
        { date: 'Q3 2024', title: 'Storage Equipment Supply Contract Signed', completed: true },
        { date: 'Q4 2024', title: 'Civil Works & Substation Grounding Complete', completed: true },
        { date: 'Q2 2025', title: 'Full Grid Dispatch & High-Yield Trading', completed: false },
      ],
    },
    financials: {
      summary: 'Dynamic tariff monetization yields higher returns targeted between 12.0% and 15.5% annually.',
      metrics: [
        { year: '2025 (P)', revenue: '190,000,000 FCFA', netOperatingIncome: '142,000,000 FCFA', projectedDistribution: '12.0%' },
        { year: '2026 (P)', revenue: '275,000,000 FCFA', netOperatingIncome: '215,000,000 FCFA', projectedDistribution: '14.2%' },
        { year: '2027 (P)', revenue: '310,000,000 FCFA', netOperatingIncome: '245,000,000 FCFA', projectedDistribution: '15.5%' },
      ],
      feeStructure: '0.50% standard management fee.',
    },
    documents: [
      { id: 'doc-al1', name: 'Private Offering Memorandum (PDF)', type: 'PDF', size: '4.8 MB', date: 'Oct 2024' },
      { id: 'doc-al2', name: 'Storage Technical & Dispatch Study (PDF)', type: 'PDF', size: '3.1 MB', date: 'Sep 2024' },
    ],
    historicalTrend: [25, 40, 55, 70, 82, 92],
  },
  {
    id: 'opp-datacenter',
    title: 'Cloud Infrastructure Data Center Expansion',
    tagline: 'Tier-3 data center facility optimized for cloud services and enterprise fintech workloads.',
    category: 'Technology',
    location: 'Lagos Tech Gateway',
    riskLevel: 'Medium',
    minInvestment: 50000, // 50,000 FCFA
    fundingGoal: 800000000, // 800M FCFA
    amountRaised: 620000000, // 620M FCFA
    investorsCount: 385,
    projectedReturnMin: 9.5,
    projectedReturnMax: 11.0,
    durationYears: '3-5 Years',
    durationCategory: '3-5 years',
    distributionFrequency: 'Quarterly',
    status: 'Funding Open',
    daysLeft: 22,
    sponsor: 'Equator Cloud Infrastructure',
    securityStructure: 'Preferred Equity Notes',
    escrowAgent: 'Stanbic IBTC Custody',
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80',
    ],
    overview: 'Expanding a carrier-neutral Tier-3 data center facility featuring redundant power, subsea fiber connectivity, and high-security colocation for banks and fintech unicorns.',
    businessPlan: {
      executiveSummary: 'Data sovereignty laws and the rapid digital payment transformation require scalable domestic cloud infrastructure.',
      marketOpportunity: 'Enterprise cloud demand across West and Central Africa is growing at >28% CAGR with tight tier-3 capacity.',
      useOfProceeds: [
        { label: 'Backup Generators & Substation Upgrade', percentage: 45 },
        { label: 'Precision Cooling & Server Pods', percentage: 35 },
        { label: 'Fiber Cross-Connects & Physical Security', percentage: 12 },
        { label: 'Operational Reserve', percentage: 8 },
      ],
      milestones: [
        { date: 'Q2 2024', title: 'Dedicated Power Line Secured', completed: true },
        { date: 'Q4 2024', title: 'First 5MW Pre-Leased to Regional Fintech', completed: true },
        { date: 'Q2 2025', title: 'Commissioning of Phase 2 Server Rooms', completed: false },
      ],
    },
    financials: {
      summary: '10-year multi-tenant leases provide predictable index-linked cash flows.',
      metrics: [
        { year: '2025 (P)', revenue: '380,000,000 FCFA', netOperatingIncome: '280,000,000 FCFA', projectedDistribution: '9.5%' },
        { year: '2026 (P)', revenue: '540,000,000 FCFA', netOperatingIncome: '410,000,000 FCFA', projectedDistribution: '10.4%' },
        { year: '2027 (P)', revenue: '620,000,000 FCFA', netOperatingIncome: '485,000,000 FCFA', projectedDistribution: '11.0%' },
      ],
      feeStructure: '0.50% annual asset management fee.',
    },
    documents: [
      { id: 'doc-dc1', name: 'Data Center Offering Prospectus (PDF)', type: 'PDF', size: '6.2 MB', date: 'Sep 2024' },
      { id: 'doc-dc2', name: 'Carrier-Neutral Fiber Audit (PDF)', type: 'PDF', size: '2.1 MB', date: 'Aug 2024' },
    ],
    historicalTrend: [5, 8, 11, 15],
  },
  {
    id: 'opp-urban-complex',
    title: 'Sustainable Eco-Logistics Campus',
    tagline: 'Modern dry port and temperature-controlled logistics hub along strategic transit corridors.',
    category: 'Real Estate',
    location: 'Kribi Port Economic Zone',
    riskLevel: 'Medium',
    minInvestment: 25000, // 25,000 FCFA
    fundingGoal: 400000000, // 400M FCFA
    amountRaised: 315000000, // 315M FCFA
    investorsCount: 310,
    projectedReturnMin: 8.5,
    projectedReturnMax: 9.8,
    durationYears: '3-5 Years',
    durationCategory: '3-5 years',
    distributionFrequency: 'Quarterly',
    status: 'Funding Open',
    daysLeft: 19,
    sponsor: 'Atlantic Logistics Corp',
    securityStructure: 'Mortgage-Backed Senior Note',
    escrowAgent: 'Afriland First Bank Custody',
    imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    ],
    overview: 'High-throughput logistics and cold-storage facility serving deep-sea maritime traffic and inland commercial corridors with solar-powered cold rooms and automated tracking.',
    businessPlan: {
      executiveSummary: 'Solves cold-chain bottlenecks for agricultural exports and pharmaceutical distribution through modern temperature-controlled hubs.',
      marketOpportunity: 'Maritime freight throughput through deep-sea terminals is expanding at double-digit annual rates.',
      useOfProceeds: [
        { label: 'Cold Storage Facility & Solar Rooftop', percentage: 50 },
        { label: 'Paved Container Yards & Heavy Handling Rigs', percentage: 25 },
        { label: 'Smart Logistics Tracking Software & Gates', percentage: 15 },
        { label: 'Operational Contingency Reserve', percentage: 10 },
      ],
      milestones: [
        { date: '2024', title: 'Port Free-Zone Concession Approved', completed: true },
        { date: '2025', title: 'Cold-Storage Warehouse Construction', completed: false },
        { date: '2026', title: 'Operational Launch & Initial Distributions', completed: false },
      ],
    },
    financials: {
      summary: 'Long-term warehouse master lease agreements with global shipping lines provide high revenue stability.',
      metrics: [
        { year: '2025 (P)', revenue: '160,000,000 FCFA', netOperatingIncome: '120,000,000 FCFA', projectedDistribution: '8.5%' },
        { year: '2026 (P)', revenue: '250,000,000 FCFA', netOperatingIncome: '190,000,000 FCFA', projectedDistribution: '9.2%' },
        { year: '2027 (P)', revenue: '290,000,000 FCFA', netOperatingIncome: '220,000,000 FCFA', projectedDistribution: '9.8%' },
      ],
      feeStructure: '0.50% annual management fee.',
    },
    documents: [
      { id: 'doc-uc1', name: 'Logistics Campus Offering Memorandum (PDF)', type: 'PDF', size: '4.5 MB', date: 'Sep 2024' },
      { id: 'doc-uc2', name: 'Port Economic Zone Concession Contract (PDF)', type: 'PDF', size: '3.8 MB', date: 'Jul 2024' },
    ],
    historicalTrend: [12, 28, 45, 62, 79],
  },
];

export const FAQ_DATA = [
  {
    category: 'General & Getting Started',
    questions: [
      {
        q: 'What is GrowthFund and how does it work?',
        a: 'GrowthFund is a modern online investment platform connecting retail and institutional investors with vetted real-economy opportunities across renewable energy, technology infrastructure, commercial real estate, and sustainable agriculture in Franc CFA (XAF). You can explore opportunities, review audited financial documents, invest starting from 25,000 FCFA, cash in, cash out, and track projected return distributions directly in your dashboard.',
      },
      {
        q: 'What currency is used on GrowthFund?',
        a: 'All investment opportunities, wallet balances, cash-in deposits, cash-out withdrawals, and return distributions are conducted in Franc CFA (XAF / FCFA).',
      },
      {
        q: 'How does the Referral Bonus program work?',
        a: 'Every member receives a unique referral code. When a friend joins using your referral code and verifies their account, you instantly receive a 1,000 XAF cash bonus credited directly to your GrowthFund Cash Balance with no limits on the number of friends you can refer!',
      },
    ],
  },
  {
    category: 'Deposits, Cash-Out & Withdrawals',
    questions: [
      {
        q: 'How do I cash in (deposit) money?',
        a: 'You can instantly deposit Franc CFA into your GrowthFund account using MTN Mobile Money, Orange Money, Wave, Moov Money, Bank Transfer (UBA, Ecobank, Societe Generale, Afriland), or Visa/Mastercard. Deposits are processed quickly with 0% platform deposit fees.',
      },
      {
        q: 'How does cash out (withdrawal) work and what are the rules?',
        a: 'Withdrawals are transferred directly to your Mobile Money wallet (MTN, Orange, Wave) or Bank Account. Cash out is available only in increments of 5,000 XAF, starting from a minimum of 5,000 XAF (e.g., 5,000, 10,000, 15,000, 20,000, 25,000, 30,000 XAF, etc.).',
      },
      {
        q: 'How long do withdrawals take to process?',
        a: 'Mobile Money cash-outs (MTN MoMo, Orange Money, Wave) are typically processed instantly or within 1-2 hours. Bank transfers take 1-2 business days.',
      },
    ],
  },
  {
    category: 'Risks & Returns',
    questions: [
      {
        q: 'Are returns guaranteed?',
        a: 'No. All investments carry risk, and returns are estimated projections based on sponsor operational models, never guaranteed. Investors may lose some or all of their invested capital. Private market investments are illiquid and subject to market conditions.',
      },
      {
        q: 'How and when are returns distributed?',
        a: 'Depending on the offering, return yields are distributed Monthly, Quarterly, Semi-Annually, or upon maturity. Distributions are credited directly to your GrowthFund cash balance in Franc CFA.',
      },
    ],
  },
];
