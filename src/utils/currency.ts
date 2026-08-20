/**
 * Currency Formatting Utilities for Franc CFA (XAF / FCFA)
 */

export const formatFCFA = (amount: number): string => {
  if (amount === undefined || amount === null || isNaN(amount)) return '0 FCFA';
  return `${Math.round(amount).toLocaleString('en-US')} FCFA`;
};

export const formatXAF = (amount: number): string => {
  if (amount === undefined || amount === null || isNaN(amount)) return '0 XAF';
  return `${Math.round(amount).toLocaleString('en-US')} XAF`;
};

export const formatShortFCFA = (amount: number): string => {
  if (amount >= 1_000_000_000) {
    return `${(amount / 1_000_000_000).toFixed(1)} Mrd FCFA`;
  }
  if (amount >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(1)}M FCFA`;
  }
  if (amount >= 1_000) {
    return `${(amount / 1_000).toFixed(0)}k FCFA`;
  }
  return `${amount} FCFA`;
};
