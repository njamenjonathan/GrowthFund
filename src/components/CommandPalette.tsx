import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Building2,
  CornerDownLeft,
  FileText,
  Gift,
  HelpCircle,
  Home,
  LayoutDashboard,
  Languages,
  Moon,
  Search,
  ShieldCheck,
  Sun,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { useScrollLock } from '../hooks/useScrollLock';
import { useI18n } from '../i18n/LanguageContext';

interface Command {
  id: string;
  label: string;
  /** Extra text matched by the search, never displayed. */
  keywords: string;
  group: string;
  icon: React.ComponentType<{ className?: string }>;
  run: () => void;
  hint?: string;
}

/**
 * Ctrl/⌘-K quick search.
 *
 * This is what guarantees the "everything within three clicks" goal even
 * as the catalogue grows: any page, dashboard tab, money action, single
 * opportunity or preference is one keystroke and one selection away from
 * anywhere in the app.
 */
export const CommandPalette: React.FC = () => {
  const { t, tr, language, setLanguage } = useI18n();
  const { resolvedTheme, toggleTheme, toggleHighContrast } = useTheme();
  const {
    isCommandPaletteOpen,
    setCommandPaletteOpen,
    navigate,
    setDashboardTab,
    navigateToOpportunity,
    openModal,
    openAuthModal,
    isAuthenticated,
    opportunities,
  } = useApp();

  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const close = useCallback(() => {
    setCommandPaletteOpen(false);
    setQuery('');
    setActiveIndex(0);
  }, [setCommandPaletteOpen]);

  useFocusTrap(panelRef, isCommandPaletteOpen, close);
  useScrollLock(isCommandPaletteOpen);

  // Global shortcut: Ctrl/⌘ K opens, and "/" opens when not already typing.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const isShortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k';
      const target = event.target as HTMLElement | null;
      const isTyping =
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.isContentEditable === true;

      if (isShortcut || (event.key === '/' && !isTyping)) {
        event.preventDefault();
        setCommandPaletteOpen(true);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [setCommandPaletteOpen]);

  const commands = useMemo<Command[]>(() => {
    const run = (action: () => void) => () => {
      close();
      action();
    };

    const pages: Command[] = [
      {
        id: 'page-home',
        label: t('nav.home'),
        keywords: 'home accueil landing',
        group: t('cmd.group.pages'),
        icon: Home,
        run: run(() => navigate('landing')),
      },
      {
        id: 'page-market',
        label: t('nav.opportunities'),
        keywords: 'marketplace opportunities offres invest projets',
        group: t('cmd.group.pages'),
        icon: TrendingUp,
        run: run(() => navigate('marketplace')),
      },
      {
        id: 'page-about',
        label: t('nav.about'),
        keywords: 'about propos company société',
        group: t('cmd.group.pages'),
        icon: Building2,
        run: run(() => navigate('about')),
      },
      {
        id: 'page-help',
        label: t('nav.help'),
        keywords: 'help faq support aide assistance',
        group: t('cmd.group.pages'),
        icon: HelpCircle,
        run: run(() => navigate('help')),
      },
      {
        id: 'page-legal',
        label: t('nav.legal'),
        keywords: 'legal risk compliance risques fees frais',
        group: t('cmd.group.pages'),
        icon: FileText,
        run: run(() => navigate('compliance')),
      },
    ];

    const dashboard: Command[] = (
      [
        ['overview', t('dash.tab.overview'), LayoutDashboard, 'dashboard overview aperçu'],
        ['portfolio', t('dash.tab.portfolio'), Building2, 'holdings positions portfolio'],
        ['referrals', t('dash.tab.referrals'), Gift, 'referral parrainage bonus'],
        ['transactions', t('dash.tab.transactions'), FileText, 'transactions ledger journal'],
        ['verification', t('dash.tab.verification'), ShieldCheck, 'kyc identity identité'],
      ] as const
    ).map(([tab, label, icon, keywords]) => ({
      id: `dash-${tab}`,
      label,
      keywords,
      group: t('cmd.group.dashboard'),
      icon,
      run: run(() => {
        setDashboardTab(tab);
        navigate('dashboard', { tab });
      }),
    }));

    const actions: Command[] = isAuthenticated
      ? [
          {
            id: 'action-deposit',
            label: t('wallet.cashIn'),
            keywords: 'deposit cash in dépôt approvisionner momo',
            group: t('cmd.group.actions'),
            icon: ArrowDownLeft,
            run: run(() => openModal('deposit')),
          },
          {
            id: 'action-withdraw',
            label: t('wallet.cashOut'),
            keywords: 'withdraw cash out retrait',
            group: t('cmd.group.actions'),
            icon: ArrowUpRight,
            run: run(() => openModal('withdraw')),
          },
          {
            id: 'action-kyc',
            label: t('kyc.title'),
            keywords: 'kyc verify identity vérification identité',
            group: t('cmd.group.actions'),
            icon: ShieldCheck,
            run: run(() => openModal('kyc')),
          },
        ]
      : [
          {
            id: 'action-signin',
            label: t('auth.signIn'),
            keywords: 'sign in login connexion',
            group: t('cmd.group.actions'),
            icon: ShieldCheck,
            run: run(() => openAuthModal('signin')),
          },
          {
            id: 'action-signup',
            label: t('auth.signUp'),
            keywords: 'sign up register créer compte',
            group: t('cmd.group.actions'),
            icon: Gift,
            run: run(() => openAuthModal('signup')),
          },
        ];

    const offerings: Command[] = opportunities.map((opp) => ({
      id: `opp-${opp.id}`,
      label: tr(opp.title),
      // Indexed in both languages so the palette finds a project whichever
      // language the user happens to type in.
      keywords: [opp.title, opp.tagline, opp.location, ...opp.tags]
        .flatMap((value) => [value.en, value.fr])
        .concat(opp.category)
        .join(' '),
      group: t('cmd.group.opportunities'),
      icon: TrendingUp,
      hint: tr(opp.location),
      run: run(() => navigateToOpportunity(opp.id)),
    }));

    const preferences: Command[] = [
      {
        id: 'pref-theme',
        label: resolvedTheme === 'dark' ? t('prefs.theme.toLight') : t('prefs.theme.toDark'),
        keywords: 'theme dark light mode sombre clair thème',
        group: t('cmd.group.preferences'),
        icon: resolvedTheme === 'dark' ? Sun : Moon,
        run: run(toggleTheme),
      },
      {
        id: 'pref-language',
        label: language === 'fr' ? 'Switch to English' : 'Passer en français',
        keywords: 'language langue french english français anglais fr en',
        group: t('cmd.group.preferences'),
        icon: Languages,
        run: run(() => setLanguage(language === 'fr' ? 'en' : 'fr')),
      },
      {
        id: 'pref-contrast',
        label: t('prefs.contrast'),
        keywords: 'contrast accessibility contraste accessibilité',
        group: t('cmd.group.preferences'),
        icon: ShieldCheck,
        run: run(toggleHighContrast),
      },
    ];

    return [...pages, ...dashboard, ...actions, ...offerings, ...preferences];
  }, [
    t,
    tr,
    language,
    setLanguage,
    resolvedTheme,
    toggleTheme,
    toggleHighContrast,
    navigate,
    setDashboardTab,
    navigateToOpportunity,
    openModal,
    openAuthModal,
    isAuthenticated,
    opportunities,
    close,
  ]);

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return commands;

    // Accent-insensitive so "energie" finds "énergie".
    const normalise = (value: string) =>
      value.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

    const target = normalise(needle);
    return commands.filter((command) =>
      normalise(`${command.label} ${command.keywords} ${command.group}`).includes(target),
    );
  }, [commands, query]);

  useEffect(() => setActiveIndex(0), [query]);

  // Keep the highlighted row in view during keyboard navigation.
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const active = list.querySelector<HTMLElement>('[data-active="true"]');
    active?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  if (!isCommandPaletteOpen) return null;

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((prev) => (results.length ? (prev + 1) % results.length : 0));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((prev) => (results.length ? (prev - 1 + results.length) % results.length : 0));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      results[activeIndex]?.run();
    }
  };

  let lastGroup = '';

  return (
    <div
      className="fixed inset-0 z-[80] bg-slate-950/70 backdrop-blur-sm p-4 pt-[10vh] flex justify-center gf-animate-fade-in gf-no-print"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={t('cmd.title')}
        className="w-full max-w-xl h-fit max-h-[70vh] flex flex-col bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden gf-animate-scale-in"
      >
        <div className="flex items-center gap-3 px-4 border-b border-slate-100 dark:border-slate-800">
          <Search className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={onKeyDown}
            placeholder={t('cmd.placeholder')}
            aria-label={t('cmd.title')}
            aria-controls="command-results"
            aria-activedescendant={results[activeIndex] ? `cmd-${results[activeIndex].id}` : undefined}
            role="combobox"
            aria-expanded="true"
            autoComplete="off"
            className="flex-1 py-4 bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
          />
          <kbd className="text-[10px] font-mono font-bold px-1.5 py-1 rounded border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400">
            esc
          </kbd>
        </div>

        <ul
          ref={listRef}
          id="command-results"
          role="listbox"
          aria-label={t('cmd.resultsLabel')}
          className="overflow-y-auto p-2 flex-1"
        >
          {results.length === 0 && (
            <li className="px-3 py-8 text-center text-xs text-slate-500 dark:text-slate-400">{t('cmd.empty')}</li>
          )}

          {results.map((command, index) => {
            const showGroup = command.group !== lastGroup;
            lastGroup = command.group;
            const isActive = index === activeIndex;

            return (
              <React.Fragment key={command.id}>
                {showGroup && (
                  <li
                    aria-hidden="true"
                    className="px-3 pt-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                  >
                    {command.group}
                  </li>
                )}
                {/*
                  The option *is* the row: an element with role="option"
                  may not contain a button, and the listbox is driven from
                  the input via aria-activedescendant, so the row never
                  needs its own tab stop.
                */}
                <li
                  id={`cmd-${command.id}`}
                  role="option"
                  aria-selected={isActive}
                  data-active={isActive}
                  onClick={command.run}
                  onMouseMove={() => setActiveIndex(index)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${
                    isActive
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                      : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <command.icon className="w-4 h-4 shrink-0 text-slate-500 dark:text-slate-400" />
                  <span className="flex-1 min-w-0">
                    <span className="block text-xs font-bold truncate">{command.label}</span>
                    {command.hint && (
                      <span className="block text-[10px] text-slate-500 dark:text-slate-400 truncate">
                        {command.hint}
                      </span>
                    )}
                  </span>
                  {isActive && (
                    <CornerDownLeft
                      className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400"
                      aria-hidden="true"
                    />
                  )}
                </li>
              </React.Fragment>
            );
          })}
        </ul>

        <div className="hidden sm:flex items-center gap-4 px-4 py-2.5 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <kbd className="font-mono font-bold">↑↓</kbd> {t('cmd.hintNavigate')}
          </span>
          <span className="flex items-center gap-1">
            <kbd className="font-mono font-bold">↵</kbd> {t('cmd.hintSelect')}
          </span>
          <span className="flex items-center gap-1">
            <kbd className="font-mono font-bold">esc</kbd> {t('cmd.hintClose')}
          </span>
        </div>
      </div>
    </div>
  );
};
