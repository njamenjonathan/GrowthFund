export type Language = 'en' | 'fr';

/** A string that exists in both supported languages. */
export interface Localized {
  en: string;
  fr: string;
}

export const LANGUAGES: { code: Language; label: string; nativeLabel: string }[] = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'fr', label: 'French', nativeLabel: 'Français' },
];

/** Resolve a Localized value (or a plain string) for the active language. */
export const pick = (value: Localized | string, lang: Language): string =>
  typeof value === 'string' ? value : value[lang];
