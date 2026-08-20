import React from 'react';
import { Home, LayoutDashboard, Search, TrendingUp, Wallet } from 'lucide-react';
import { useApp } from '../context/AppContext';

import { useI18n } from '../i18n/LanguageContext';

/**
 * Bottom navigation for small screens.
 *
 * On a phone the header can only hold the logo and a hamburger, which put
 * every destination two taps away behind a menu. This bar puts the five
 * things people actually do one tap from anywhere.
 */
export const MobileTabBar: React.FC = () => {
  const { t } = useI18n();
  const { currentPage, navigate, openModal, openAuthModal, isAuthenticated, setCommandPaletteOpen } =
    useApp();

  const items: {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    isActive: boolean;
    onSelect: () => void;
  }[] = [
    {
      id: 'home',
      label: t('nav.home'),
      icon: Home,
      isActive: currentPage === 'landing',
      onSelect: () => navigate('landing'),
    },
    {
      id: 'marketplace',
      label: t('nav.opportunities'),
      icon: TrendingUp,
      isActive: currentPage === 'marketplace' || currentPage === 'detail',
      onSelect: () => navigate('marketplace'),
    },
    {
      id: 'search',
      label: t('nav.search'),
      icon: Search,
      isActive: false,
      onSelect: () => setCommandPaletteOpen(true),
    },
    {
      id: 'portfolio',
      label: t('nav.portfolio'),
      icon: LayoutDashboard,
      isActive: currentPage === 'dashboard',
      onSelect: () => navigate('dashboard', { tab: 'overview' }),
    },
    {
      id: 'wallet',
      label: isAuthenticated ? t('wallet.cashIn') : t('auth.signIn'),
      icon: Wallet,
      isActive: false,
      onSelect: () => (isAuthenticated ? openModal('deposit') : openAuthModal('signin')),
    },
  ];

  return (
    <nav
      aria-label={t('nav.quickActions')}
      // pb-safe keeps the bar clear of the iOS home indicator.
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 gf-no-print"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <ul className="grid grid-cols-5">
        {items.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={item.onSelect}
              aria-current={item.isActive ? 'page' : undefined}
              className={`w-full flex flex-col items-center gap-0.5 py-2.5 px-1 transition-colors ${
                item.isActive
                  ? 'text-emerald-700 dark:text-emerald-400'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <item.icon className="w-5 h-5" aria-hidden="true" />
              <span className="text-[10px] font-bold leading-tight truncate max-w-full">
                {item.label}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};
