import React, { useCallback, useRef, useState } from 'react';
import {
  Briefcase,
  ChevronDown,
  Gift,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  ShieldCheck,
  Wallet,
  X,
} from 'lucide-react';
import { GrowthFundLogo } from './GrowthFundLogo';
import { PreferencesMenu } from './PreferencesMenu';
import { useApp } from '../context/AppContext';
import { DashboardTab, PageRoute } from '../types';
import { useDismissable } from '../hooks/useDismissable';
import { useI18n } from '../i18n/LanguageContext';
import { TranslationKey } from '../i18n/translations';
import { formatFCFA } from '../utils/format';

interface NavLink {
  labelKey: TranslationKey;
  page: PageRoute;
}

const NAV_LINKS: NavLink[] = [
  { labelKey: 'nav.opportunities', page: 'marketplace' },
  { labelKey: 'nav.portfolio', page: 'dashboard' },
  { labelKey: 'nav.about', page: 'about' },
  { labelKey: 'nav.help', page: 'help' },
  { labelKey: 'nav.legal', page: 'compliance' },
];

export const Navbar: React.FC = () => {
  const { t, language } = useI18n();
  const {
    currentPage,
    navigate,
    user,
    isAuthenticated,
    openAuthModal,
    openModal,
    setDashboardTab,
    signOutUser,
    setCommandPaletteOpen,
  } = useApp();

  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAccountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  const closeAccount = useCallback(() => setAccountOpen(false), []);
  useDismissable(accountRef, isAccountOpen, closeAccount);

  const go = useCallback(
    (page: PageRoute, tab?: DashboardTab) => {
      navigate(page, tab ? { tab } : undefined);
      setMobileMenuOpen(false);
      setAccountOpen(false);
    },
    [navigate],
  );

  const goToTab = useCallback(
    (tab: DashboardTab) => {
      setDashboardTab(tab);
      go('dashboard', tab);
    },
    [go, setDashboardTab],
  );

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 gf-no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          <button
            type="button"
            onClick={() => go('landing')}
            className="flex items-center rounded-xl shrink-0"
            aria-label={`${t('app.name')} — ${t('nav.home')}`}
          >
            <GrowthFundLogo size="md" />
          </button>

          {/*
            Desktop navigation.
            This was previously `md:flex` while the hamburger was
            `sm:hidden`, which left the 640–767px range with no navigation
            of any kind. Both now pivot on the same `lg` breakpoint.
          */}
          <nav
            aria-label={t('nav.mainLabel')}
            className="hidden lg:flex items-center gap-1 flex-1 justify-center"
          >
            {NAV_LINKS.map((link) => {
              const isActive = currentPage === link.page;
              return (
                <button
                  key={link.page}
                  type="button"
                  onClick={() => go(link.page)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                    isActive
                      ? 'text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  {t(link.labelKey)}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            {/* One-key access to everything in the app. */}
            <button
              type="button"
              onClick={() => setCommandPaletteOpen(true)}
              aria-label={t('cmd.open')}
              title={`${t('cmd.open')} (Ctrl / ⌘ K)`}
              className="hidden sm:flex items-center gap-2 px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors"
            >
              <Search className="w-4 h-4" aria-hidden="true" />
              <span className="hidden xl:inline text-xs font-medium">{t('nav.searchHint')}</span>
              <kbd className="hidden xl:inline text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300">
                ⌘K
              </kbd>
            </button>

            <PreferencesMenu />

            {isAuthenticated ? (
              <>
                <button
                  type="button"
                  onClick={() => openModal('deposit')}
                  className="hidden xl:inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-bold text-xs rounded-xl transition-colors"
                >
                  <Wallet className="w-3.5 h-3.5" aria-hidden="true" />
                  {t('wallet.cashIn')}
                </button>

                <div ref={accountRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setAccountOpen((prev) => !prev)}
                    aria-expanded={isAccountOpen}
                    aria-haspopup="menu"
                    className="flex items-center gap-2.5 px-2 sm:px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 transition-colors text-left"
                  >
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt=""
                        referrerPolicy="no-referrer"
                        className="w-7 h-7 rounded-xl object-cover border border-slate-300 dark:border-slate-700"
                      />
                    ) : (
                      <span
                        aria-hidden="true"
                        className="w-7 h-7 rounded-xl bg-slate-900 dark:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center"
                      >
                        {user.initials}
                      </span>
                    )}
                    <span className="hidden lg:block text-xs min-w-0">
                      <span className="block font-bold text-slate-900 dark:text-white leading-tight truncate max-w-[9rem]">
                        {user.name}
                      </span>
                      <span className="block text-emerald-700 dark:text-emerald-400 font-mono font-bold text-[10px]">
                        {formatFCFA(user.walletBalance, language)}
                      </span>
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                  </button>

                  {isAccountOpen && (
                    <div
                      role="menu"
                      aria-label={t('dash.account')}
                      className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-850 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50 gf-animate-slide-down"
                    >
                      <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-750">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {user.email}
                        </p>
                        <p className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300">
                          <ShieldCheck className="w-3 h-3" aria-hidden="true" />
                          {t(`kyc.tier.${user.kycTier}` as TranslationKey)}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-1 p-2 border-b border-slate-100 dark:border-slate-750">
                        <button
                          type="button"
                          role="menuitem"
                          onClick={() => {
                            setAccountOpen(false);
                            openModal('deposit');
                          }}
                          className="py-2 px-2 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-950 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-900 transition-colors"
                        >
                          {t('wallet.cashIn')}
                        </button>
                        <button
                          type="button"
                          role="menuitem"
                          onClick={() => {
                            setAccountOpen(false);
                            openModal('withdraw');
                          }}
                          className="py-2 px-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-200/70 dark:bg-slate-750 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
                        >
                          {t('wallet.cashOut')}
                        </button>
                      </div>

                      <MenuItem icon={LayoutDashboard} onClick={() => goToTab('overview')}>
                        {t('dash.tab.overview')}
                      </MenuItem>
                      <MenuItem icon={Briefcase} onClick={() => goToTab('portfolio')}>
                        {t('dash.tab.portfolio')}
                      </MenuItem>
                      <MenuItem icon={Gift} onClick={() => goToTab('referrals')} accent>
                        {t('dash.tab.referrals')}
                      </MenuItem>
                      <MenuItem icon={ShieldCheck} onClick={() => goToTab('verification')}>
                        {t('dash.tab.verification')}
                      </MenuItem>

                      <div className="border-t border-slate-100 dark:border-slate-750 my-1" />

                      <MenuItem
                        icon={LogOut}
                        danger
                        onClick={() => {
                          setAccountOpen(false);
                          void signOutUser();
                        }}
                      >
                        {t('auth.signOut')}
                      </MenuItem>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => openAuthModal('signin')}
                  className="px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white rounded-xl transition-colors"
                >
                  {t('auth.signIn')}
                </button>
                <button
                  type="button"
                  onClick={() => openAuthModal('signup')}
                  className="px-4 py-2 text-xs font-bold text-white bg-slate-900 dark:bg-emerald-700 hover:bg-slate-800 dark:hover:bg-emerald-600 rounded-xl transition-colors"
                >
                  {t('auth.signUp')}
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMobileMenuOpen ? t('nav.closeMenu') : t('nav.openMenu')}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" aria-hidden="true" />
              ) : (
                <Menu className="w-6 h-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div
          id="mobile-menu"
          className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-4 space-y-3 gf-animate-slide-down"
        >
          <nav aria-label={t('nav.mobileLabel')} className="space-y-1">
            {NAV_LINKS.map((link) => {
              const isActive = currentPage === link.page;
              return (
                <button
                  key={link.page}
                  type="button"
                  onClick={() => go(link.page)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                    isActive
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  {t(link.labelKey)}
                </button>
              );
            })}
          </nav>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setCommandPaletteOpen(true);
              }}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-700 dark:text-slate-200"
            >
              <Search className="w-4 h-4" aria-hidden="true" />
              {t('nav.search')}
            </button>

            {!isAuthenticated && (
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAuthModal('signin');
                  }}
                  className="py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-700 dark:text-slate-200"
                >
                  {t('auth.signIn')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAuthModal('signup');
                  }}
                  className="py-2.5 px-4 rounded-xl bg-slate-900 dark:bg-emerald-700 text-white text-sm font-bold"
                >
                  {t('auth.signUp')}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

interface MenuItemProps {
  icon: typeof Wallet;
  onClick: () => void;
  children: React.ReactNode;
  accent?: boolean;
  danger?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({
  icon: Icon,
  onClick,
  children,
  accent,
  danger,
}) => (
  <button
    type="button"
    role="menuitem"
    onClick={onClick}
    className={`w-full px-4 py-2.5 text-left text-xs font-bold flex items-center gap-2.5 transition-colors ${
      danger
        ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30'
        : accent
          ? 'text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40'
          : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-750'
    }`}
  >
    <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
    {children}
  </button>
);
