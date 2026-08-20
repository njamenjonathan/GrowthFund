import { Language } from '../i18n/types';

/**
 * Franc CFA formatting.
 *
 * French convention groups with a narrow no-break space and uses a comma
 * for decimals; English uses commas and a point. Both share the XAF/FCFA
 * suffix. The previous helpers hard-coded 'en-US' grouping regardless of
 * the interface language.
 */

const groupingFormatter = (locale: string, fractionDigits = 0) =>
  new Intl.NumberFormat(locale, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });

const localeFor = (lang: Language) => (lang === 'fr' ? 'fr-FR' : 'en-GB');

/** e.g. "425,000 FCFA" / "425 000 FCFA" */
export const formatFCFA = (amount: number, lang: Language = 'en'): string => {
  if (!Number.isFinite(amount)) return `0 FCFA`;
  return `${groupingFormatter(localeFor(lang)).format(Math.round(amount))} FCFA`;
};

/** e.g. "1,000 XAF" — used where the XAF ticker reads better than FCFA. */
export const formatXAF = (amount: number, lang: Language = 'en'): string => {
  if (!Number.isFinite(amount)) return `0 XAF`;
  return `${groupingFormatter(localeFor(lang)).format(Math.round(amount))} XAF`;
};

/** Bare grouped number with no currency suffix. */
export const formatNumber = (value: number, lang: Language = 'en', fractionDigits = 0): string => {
  if (!Number.isFinite(value)) return '0';
  return groupingFormatter(localeFor(lang), fractionDigits).format(value);
};

/** Compact form for axes and dense cards: "345M FCFA", "32,5 Md FCFA". */
export const formatShortFCFA = (amount: number, lang: Language = 'en'): string => {
  if (!Number.isFinite(amount)) return '0 FCFA';

  const sign = amount < 0 ? '-' : '';
  const abs = Math.abs(amount);
  const decimal = (value: number) => formatNumber(value, lang, 1);

  if (abs >= 1_000_000_000) {
    return `${sign}${decimal(abs / 1_000_000_000)} ${lang === 'fr' ? 'Md' : 'B'} FCFA`;
  }
  if (abs >= 1_000_000) {
    return `${sign}${decimal(abs / 1_000_000)} M FCFA`;
  }
  if (abs >= 1_000) {
    return `${sign}${formatNumber(Math.round(abs / 1_000), lang)} k FCFA`;
  }
  return `${sign}${formatNumber(abs, lang)} FCFA`;
};

/** Percentages, e.g. "9.8%" / "9,8 %". */
export const formatPercent = (value: number, lang: Language = 'en', fractionDigits = 1): string => {
  const formatted = formatNumber(value, lang, fractionDigits);
  return lang === 'fr' ? `${formatted} %` : `${formatted}%`;
};

/**
 * Formats an ISO date (YYYY-MM-DD) for display.
 * Sample data stores ISO dates so they can be rendered per locale rather
 * than being frozen into one language at authoring time.
 */
export const formatDate = (
  iso: string,
  lang: Language = 'en',
  style: 'short' | 'long' = 'short',
): string => {
  const date = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(date.getTime())) return iso;

  return new Intl.DateTimeFormat(localeFor(lang), {
    day: 'numeric',
    month: style === 'long' ? 'long' : 'short',
    year: 'numeric',
  }).format(date);
};

/** Month and year only, e.g. "March 2024" / "mars 2024". */
export const formatMonthYear = (iso: string, lang: Language = 'en'): string => {
  const date = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(date.getTime())) return iso;

  return new Intl.DateTimeFormat(localeFor(lang), {
    month: 'long',
    year: 'numeric',
  }).format(date);
};

/** Today's date as an ISO day string, for newly created records. */
export const todayIso = (): string => new Date().toISOString().slice(0, 10);

/**
 * Very short form for chart axes: "10 M", "345 M", "2,5 Md".
 * Axis labels are read against a heading that already names the currency,
 * so repeating "FCFA" on every tick only forces the label to wrap.
 */
export const formatAxis = (amount: number, lang: Language = 'en'): string => {
  if (!Number.isFinite(amount)) return '0';

  const sign = amount < 0 ? '-' : '';
  const abs = Math.abs(amount);

  if (abs >= 1_000_000_000) {
    return `${sign}${formatNumber(abs / 1_000_000_000, lang, 1)} ${lang === 'fr' ? 'Md' : 'B'}`;
  }
  if (abs >= 1_000_000) {
    return `${sign}${formatNumber(abs / 1_000_000, lang, abs >= 10_000_000 ? 0 : 1)} M`;
  }
  if (abs >= 1_000) return `${sign}${formatNumber(Math.round(abs / 1_000), lang)} k`;
  return `${sign}${formatNumber(abs, lang)}`;
};
