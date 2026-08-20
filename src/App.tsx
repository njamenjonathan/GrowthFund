import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { RiskBanner } from './components/RiskBanner';
import { ToastContainer } from './components/ToastContainer';
import { InvestModal } from './components/InvestModal';
import { KYCModal } from './components/KYCModal';
import { DepositWithdrawModal } from './components/DepositWithdrawModal';
import { AuthModal } from './components/AuthModal';

import { LandingPage } from './pages/LandingPage';
import { MarketplacePage } from './pages/MarketplacePage';
import { DetailPage } from './pages/DetailPage';
import { DashboardPage } from './pages/DashboardPage';
import { HelpPage } from './pages/HelpPage';
import { CompliancePage } from './pages/CompliancePage';
import { AboutPage } from './pages/AboutPage';

const AppContent: React.FC = () => {
  const { currentPage } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-emerald-500 selection:text-white transition-colors duration-150">
      {/* Top sticky Navbar */}
      <Navbar />

      {/* Dynamic View Router */}
      <main className="flex-1">
        {currentPage === 'landing' && <LandingPage />}
        {currentPage === 'marketplace' && <MarketplacePage />}
        {currentPage === 'detail' && <DetailPage />}
        {currentPage === 'dashboard' && <DashboardPage />}
        {currentPage === 'help' && <HelpPage />}
        {currentPage === 'compliance' && <CompliancePage />}
        {currentPage === 'about' && <AboutPage />}
      </main>

      {/* Global Regulatory Risk Banner */}
      <RiskBanner />

      {/* Footer */}
      <Footer />

      {/* Modals & Dialogs */}
      <InvestModal />
      <KYCModal />
      <DepositWithdrawModal />
      <AuthModal />

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ThemeProvider>
  );
}
