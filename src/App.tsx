import React, { Suspense, lazy } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AppProvider, useApp } from './context/AppContext';
import { LanguageProvider, useI18n } from './i18n/LanguageContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { RiskBanner } from './components/RiskBanner';
import { ToastContainer } from './components/ToastContainer';
import { CommandPalette } from './components/CommandPalette';
import { MobileTabBar } from './components/MobileTabBar';
import { InvestModal } from './components/InvestModal';
import { KYCModal } from './components/KYCModal';
import { DepositWithdrawModal } from './components/DepositWithdrawModal';
import { AuthModal } from './components/AuthModal';
import { LandingPage } from './pages/LandingPage';

/*
 * Only the landing page is in the initial bundle. The rest load on
 * demand, which cuts what a first-time visitor downloads before they can
 * see anything — the previous build shipped every page, both chart
 * libraries and the whole Firebase SDK in one 1.5 MB chunk.
 */
const MarketplacePage = lazy(() =>
  import('./pages/MarketplacePage').then((m) => ({ default: m.MarketplacePage })),
);
const DetailPage = lazy(() => import('./pages/DetailPage').then((m) => ({ default: m.DetailPage })));
const DashboardPage = lazy(() =>
  import('./pages/DashboardPage').then((m) => ({ default: m.DashboardPage })),
);
const HelpPage = lazy(() => import('./pages/HelpPage').then((m) => ({ default: m.HelpPage })));
const CompliancePage = lazy(() =>
  import('./pages/CompliancePage').then((m) => ({ default: m.CompliancePage })),
);
const AboutPage = lazy(() => import('./pages/AboutPage').then((m) => ({ default: m.AboutPage })));

const PageFallback: React.FC = () => {
  const { t } = useI18n();
  return (
    <div className="max-w-7xl mx-auto px-4 py-24 flex flex-col items-center gap-3">
      <span
        aria-hidden="true"
        className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"
      />
      <p className="text-xs text-slate-500 dark:text-slate-400">{t('common.loading')}</p>
    </div>
  );
};

const AppContent: React.FC = () => {
  const { currentPage } = useApp();
  const { t } = useI18n();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-emerald-500 selection:text-white">
      {/* First tab stop on every page: jump past the navigation. */}
      <a
        href="#main-content"
        className="sr-only-focusable absolute top-2 left-2 z-[100] px-4 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold shadow-lg"
      >
        {t('app.skipToContent')}
      </a>

      <Navbar />

      <main
        id="main-content"
        tabIndex={-1}
        // Re-keying on the route restarts the entrance animation, so each
        // page transition reads as a deliberate change rather than a swap.
        key={currentPage}
        className="flex-1 gf-animate-fade-up focus:outline-none"
      >
        <ErrorBoundary>
          <Suspense fallback={<PageFallback />}>
            {currentPage === 'landing' && <LandingPage />}
            {currentPage === 'marketplace' && <MarketplacePage />}
            {currentPage === 'detail' && <DetailPage />}
            {currentPage === 'dashboard' && <DashboardPage />}
            {currentPage === 'help' && <HelpPage />}
            {currentPage === 'compliance' && <CompliancePage />}
            {currentPage === 'about' && <AboutPage />}
          </Suspense>
        </ErrorBoundary>
      </main>

      <RiskBanner />
      <Footer />
      <MobileTabBar />

      <InvestModal />
      <KYCModal />
      <DepositWithdrawModal />
      <AuthModal />
      <CommandPalette />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <ThemeProvider>
          <AppProvider>
            <AppContent />
          </AppProvider>
        </ThemeProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}
