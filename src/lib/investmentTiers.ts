import { Localized } from '../i18n/types';

/**
 * Allocation tiers.
 *
 * A larger allocation commits capital for longer and earns a higher rate:
 * the tier sets both the lock-in period and where within an offering's
 * quoted yield band the investor actually lands.
 *
 * `yieldPosition` is the fraction of the distance between an offering's
 * projectedReturnMin and projectedReturnMax. The entry tier earns the
 * quoted minimum; the top tier earns the quoted maximum. That keeps every
 * effective rate inside the band the offering already advertises, so no
 * tier can promise more than the project itself does.
 */
export interface InvestmentTier {
  id: 'starter' | 'growth' | 'premium' | 'elite';
  /** Inclusive lower bound, in XAF. */
  minAmount: number;
  /** Exclusive upper bound, in XAF. `null` on the top tier. */
  maxAmount: number | null;
  /** How long capital stays locked, in months. */
  lockMonths: number;
  /** 0 = offering's minimum rate, 1 = its maximum rate. */
  yieldPosition: number;
  name: Localized;
}

/** The platform-wide entry point for any investment. */
export const MIN_INVESTMENT = 5_000;

/** Allocations are accepted in whole multiples of this. */
export const INVESTMENT_STEP = 1_000;

export const INVESTMENT_TIERS: InvestmentTier[] = [
  {
    id: 'starter',
    minAmount: 5_000,
    maxAmount: 50_000,
    lockMonths: 6,
    yieldPosition: 0,
    name: { en: 'Starter', fr: 'Découverte' },
  },
  {
    id: 'growth',
    minAmount: 50_000,
    maxAmount: 250_000,
    lockMonths: 12,
    yieldPosition: 1 / 3,
    name: { en: 'Growth', fr: 'Croissance' },
  },
  {
    id: 'premium',
    minAmount: 250_000,
    maxAmount: 1_000_000,
    lockMonths: 24,
    yieldPosition: 2 / 3,
    name: { en: 'Premium', fr: 'Premium' },
  },
  {
    id: 'elite',
    minAmount: 1_000_000,
    maxAmount: null,
    lockMonths: 48,
    yieldPosition: 1,
    name: { en: 'Elite', fr: 'Élite' },
  },
];

/** The tier an allocation of `amount` falls into. */
export const tierForAmount = (amount: number): InvestmentTier => {
  // Walk from the top so the largest matching bound wins.
  for (let i = INVESTMENT_TIERS.length - 1; i >= 0; i -= 1) {
    if (amount >= INVESTMENT_TIERS[i].minAmount) return INVESTMENT_TIERS[i];
  }
  return INVESTMENT_TIERS[0];
};

/** The next tier up, or null when already at the top. */
export const nextTier = (tier: InvestmentTier): InvestmentTier | null => {
  const index = INVESTMENT_TIERS.findIndex((item) => item.id === tier.id);
  return INVESTMENT_TIERS[index + 1] ?? null;
};

/**
 * The annual rate an allocation actually earns, interpolated across the
 * offering's own quoted band. Rounded to one decimal so the figure shown
 * in the dialog is exactly the figure stored on the holding.
 */
export const effectiveRate = (
  amount: number,
  projectedReturnMin: number,
  projectedReturnMax: number,
): number => {
  const { yieldPosition } = tierForAmount(amount);
  const rate = projectedReturnMin + (projectedReturnMax - projectedReturnMin) * yieldPosition;
  return Math.round(rate * 10) / 10;
};

/** Lock-in length in months for an allocation. */
export const lockMonthsFor = (amount: number): number => tierForAmount(amount).lockMonths;

/**
 * Total simple (non-compounding) yield paid across the whole lock-in.
 * The platform quotes an annual rate, so a 6-month lock earns half of it.
 */
export const projectedYieldOverLock = (
  amount: number,
  projectedReturnMin: number,
  projectedReturnMax: number,
): number => {
  const rate = effectiveRate(amount, projectedReturnMin, projectedReturnMax);
  const years = lockMonthsFor(amount) / 12;
  return (amount * rate * years) / 100;
};

/** Value returned at unlock: principal plus the yield earned over the term. */
export const projectedMaturityValue = (
  amount: number,
  projectedReturnMin: number,
  projectedReturnMax: number,
): number =>
  amount + projectedYieldOverLock(amount, projectedReturnMin, projectedReturnMax);

/** ISO date `months` after `fromIso`, used for a holding's unlock date. */
export const addMonthsIso = (fromIso: string, months: number): string => {
  const date = new Date(`${fromIso}T00:00:00`);
  if (Number.isNaN(date.getTime())) return fromIso;

  const targetMonth = date.getMonth() + months;
  const result = new Date(date);
  result.setMonth(targetMonth);

  // setMonth rolls over when the day does not exist in the target month
  // (31 Jan + 1 month would land on 2 or 3 March). Clamp to month end.
  if (result.getDate() !== date.getDate()) result.setDate(0);

  return result.toISOString().slice(0, 10);
};

/** True once `isoDate` is today or in the past. */
export const hasReached = (isoDate: string, now: Date = new Date()): boolean => {
  const target = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(target.getTime())) return false;
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return today.getTime() >= target.getTime();
};

/** Whole days from now until `isoDate`; 0 once the date has passed. */
export const daysUntil = (isoDate: string, now: Date = new Date()): number => {
  const target = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(target.getTime())) return 0;
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diff = target.getTime() - today.getTime();
  return diff <= 0 ? 0 : Math.ceil(diff / 86_400_000);
};

/** How far through its lock a holding is, 0–1, for progress display. */
export const lockProgress = (
  startIso: string,
  unlockIso: string,
  now: Date = new Date(),
): number => {
  const start = new Date(`${startIso}T00:00:00`).getTime();
  const end = new Date(`${unlockIso}T00:00:00`).getTime();
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return 1;

  const elapsed = now.getTime() - start;
  return Math.min(1, Math.max(0, elapsed / (end - start)));
};

/**
 * Translation key and count for a lock term, so "12 months" reads as
 * "1 year" and "1 years" never appears.
 */
export const termLabel = (
  months: number,
): { key: 'tier.months' | 'tier.months_one' | 'tier.years' | 'tier.years_one'; count: number } => {
  if (months % 12 === 0) {
    const years = months / 12;
    return years === 1 ? { key: 'tier.years_one', count: 1 } : { key: 'tier.years', count: years };
  }
  return months === 1 ? { key: 'tier.months_one', count: 1 } : { key: 'tier.months', count: months };
};
