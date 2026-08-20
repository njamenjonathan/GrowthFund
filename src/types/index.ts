import { Localized } from '../i18n/types';

export type { PageRoute, DashboardTab } from './routes';
export type { Localized };

export type RiskLevel = 'Low' | 'Medium' | 'High';

export type Category =
  | 'Technology'
  | 'Real Estate'
  | 'Energy'
  | 'Agriculture'
  | 'Healthcare'
  | 'Infrastructure';

export type DurationCategory = '1-3 years' | '3-5 years' | '5+ years';

export type DistributionFrequency =
  | 'Monthly'
  | 'Quarterly'
  | 'Semi-Annually'
  | 'At Maturity';

export type OfferingStatus = 'Funding Open' | 'Fully Funded' | 'Coming Soon';

export interface DocumentItem {
  id: string;
  name: Localized;
  type: string;
  size: string;
  date: string;
}

export interface FinancialMetric {
  year: string;
  revenue: number;
  netOperatingIncome: number;
  /** Percentage, e.g. 9.2 for 9.2%. */
  projectedDistribution: number;
}

export interface UseOfProceedsItem {
  label: Localized;
  percentage: number;
}

export interface Milestone {
  date: string;
  title: Localized;
  completed: boolean;
}

/**
 * A named risk with the sponsor's mitigation.
 * DetailPage always rendered this section; it was simply missing from the
 * type and the data, which crashed the page on every visit.
 */
export interface RiskFactor {
  category: Localized;
  severity: RiskLevel;
  description: Localized;
  mitigation: Localized;
}

export interface InvestmentOpportunity {
  id: string;
  title: Localized;
  tagline: Localized;
  category: Category;
  location: Localized;
  riskLevel: RiskLevel;
  /** All monetary amounts are in Franc CFA (XAF). */
  minInvestment: number;
  fundingGoal: number;
  amountRaised: number;
  investorsCount: number;
  projectedReturnMin: number;
  projectedReturnMax: number;
  durationYears: Localized;
  durationCategory: DurationCategory;
  distributionFrequency: DistributionFrequency;
  status: OfferingStatus;
  imageUrl: string;
  overview: Localized;
  sponsor: Localized;
  sponsorNote: Localized;
  securityStructure: Localized;
  escrowAgent: Localized;
  isFeatured: boolean;
  daysLeft: number;
  /** Free-text keywords used by marketplace search. */
  tags: Localized[];
  businessPlan: {
    executiveSummary: Localized;
    marketOpportunity: Localized;
    useOfProceeds: UseOfProceedsItem[];
    milestones: Milestone[];
  };
  financials: {
    summary: Localized;
    metrics: FinancialMetric[];
    feeStructure: Localized;
  };
  riskFactors: RiskFactor[];
  documents: DocumentItem[];
}

export interface PortfolioHolding {
  id: string;
  opportunityId: string;
  opportunityTitle: Localized;
  category: Category;
  investedAmount: number;
  currentValue: number;
  totalReturnsEarned: number;
  projectedReturnRate: number;
  /** ISO date (YYYY-MM-DD) so it can be formatted per locale. */
  investedDate: string;
  maturityDate: string;
  nextDistributionDate: string;
  status: 'Active' | 'Matured' | 'Pending';
  riskLevel: RiskLevel;
}

export type TransactionType =
  | 'Investment'
  | 'Return Distribution'
  | 'Deposit'
  | 'Withdrawal'
  | 'Referral Bonus';

export type TransactionStatus = 'Completed' | 'Processing' | 'Failed';

export interface Transaction {
  id: string;
  /** ISO date (YYYY-MM-DD). */
  date: string;
  type: TransactionType;
  /** Localized for seeded rows; a plain string for rows the user creates. */
  projectName: Localized | string;
  amount: number;
  status: TransactionStatus;
  referenceId: string;
}

export interface ReferredFriend {
  id: string;
  name: string;
  email: string;
  /** ISO date (YYYY-MM-DD). */
  date: string;
  bonus: number;
  status: 'Bonus Paid' | 'Pending Verification';
}

export type KycTier =
  | 'Tier 0 (Unverified)'
  | 'Tier 1 Verified'
  | 'Tier 2 Accredited';

export interface UserProfile {
  uid?: string;
  photoURL?: string;
  name: string;
  email: string;
  initials: string;
  accountNumber: string;
  kycTier: KycTier;
  isKycApproved: boolean;
  walletBalance: number;
  totalInvested: number;
  totalReturns: number;
  activeInvestmentsCount: number;
  joinedDate: string;
  referralCode: string;
  referralCount: number;
  referralEarnings: number;
  referredBy?: string;
  referredFriends: ReferredFriend[];
}

export interface FaqItem {
  id: string;
  category: Localized;
  question: Localized;
  answer: Localized;
}
