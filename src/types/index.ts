export type RiskLevel = 'Low' | 'Medium' | 'High';

export type Category = 
  | 'Technology' 
  | 'Real Estate' 
  | 'Energy' 
  | 'Agriculture' 
  | 'Healthcare'
  | 'Infrastructure';

export interface DocumentItem {
  id: string;
  name: string;
  type: string;
  size: string;
  date: string;
}

export interface FinancialMetric {
  year: string;
  revenue: string;
  netOperatingIncome: string;
  projectedDistribution: string;
}

export interface InvestmentOpportunity {
  id: string;
  title: string;
  tagline: string;
  category: Category;
  location: string;
  riskLevel: RiskLevel;
  minInvestment: number; // in Franc CFA (XAF)
  fundingGoal: number; // in Franc CFA (XAF)
  amountRaised: number; // in Franc CFA (XAF)
  investorsCount: number;
  projectedReturnMin: number;
  projectedReturnMax: number;
  durationYears: string;
  durationCategory: '1-3 years' | '3-5 years' | '5+ years';
  distributionFrequency: 'Monthly' | 'Quarterly' | 'Semi-Annually' | 'At Maturity';
  status: 'Funding Open' | 'Fully Funded' | 'Coming Soon';
  imageUrl: string;
  galleryImages: string[];
  overview: string;
  sponsor?: string;
  securityStructure?: string;
  escrowAgent?: string;
  isFeatured?: boolean;
  daysLeft?: number;
  businessPlan: {
    executiveSummary: string;
    marketOpportunity: string;
    useOfProceeds: { label: string; percentage: number }[];
    milestones: { date: string; title: string; completed: boolean }[];
  };
  financials: {
    summary: string;
    metrics: FinancialMetric[];
    feeStructure: string;
  };
  documents: DocumentItem[];
  historicalTrend: number[];
}

export interface PortfolioHolding {
  id: string;
  opportunityId: string;
  opportunityTitle: string;
  category: Category;
  investedAmount: number; // in Franc CFA
  currentValue: number; // in Franc CFA
  totalReturnsEarned: number; // in Franc CFA
  projectedReturnRate: number;
  investedDate: string;
  maturityDate: string;
  nextDistributionDate: string;
  status: 'Active' | 'Matured' | 'Pending';
  riskLevel: RiskLevel;
}

export interface Transaction {
  id: string;
  date: string;
  type: 'Investment' | 'Return Distribution' | 'Deposit' | 'Withdrawal' | 'Referral Bonus';
  projectName: string;
  amount: number; // in Franc CFA
  status: 'Completed' | 'Processing' | 'Failed';
  referenceId: string;
}

export interface ReferredFriend {
  id: string;
  name: string;
  email: string;
  date: string;
  bonus: number; // 1000 XAF
  status: 'Bonus Paid' | 'Pending Verification';
}

export interface UserProfile {
  uid?: string;
  photoURL?: string;
  name: string;
  email: string;
  initials: string;
  accountNumber: string;
  kycTier: 'Tier 0 (Unverified)' | 'Tier 1 Verified' | 'Tier 2 Accredited';
  isKycApproved: boolean;
  walletBalance: number; // in Franc CFA (XAF)
  totalInvested: number; // in Franc CFA (XAF)
  totalReturns: number; // in Franc CFA (XAF)
  activeInvestmentsCount: number;
  notificationsCount: number;
  joinedDate: string;
  memberSince: string;
  referralCode: string;
  referralCount: number;
  referralEarnings: number; // in Franc CFA (XAF)
  referredBy?: string;
  referredFriends: ReferredFriend[];
}
