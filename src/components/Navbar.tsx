import React, { useState } from 'react';
import { GrowthFundLogo } from './GrowthFundLogo';
import { useApp, PageRoute } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { 
  Sun, 
  Moon, 
  Eye, 
  Menu, 
  X, 
  User, 
  ShieldCheck, 
  ChevronDown, 
  Wallet, 
  LayoutDashboard, 
  Briefcase,
  HelpCircle,
  FileText,
  Gift
} from 'lucide-react';
import { formatFCFA } from '../utils/currency';

export const Navbar: React.FC = () => {
  const { 
    currentPage, 
    setCurrentPage, 
    user, 
    openAuthModal, 
    setDashboardTab,
    setIsDepositModalOpen,
    setIsWithdrawModalOpen,
    signOutUser,
    isCloudConnected
  } = useApp();
  const { theme, toggleTheme, highContrast, toggleHighContrast } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { label: 'Opportunities', page: 'marketplace' as const },
    { label: 'Portfolio', page: 'dashboard' as const },
    { label: 'About & History', page: 'about' as const },
    { label: 'Help & FAQ', page: 'help' as const },
    { label: 'Risk & Legal', page: 'compliance' as const },
  ];

  const handleNavClick = (page: PageRoute) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => handleNavClick('landing')}
            className="flex items-center focus:outline-none focus:ring-2 focus:ring-slate-400 rounded-md cursor-pointer"
            aria-label="GrowthFund Home"
          >
            <GrowthFundLogo size="md" />
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const isActive = currentPage === link.page;
              return (
                <button
                  key={link.page}
                  onClick={() => handleNavClick(link.page)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Right Controls: Theme + Auth */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Theme & Contrast Toggles */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                onClick={toggleTheme}
                title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
                className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 transition-colors cursor-pointer"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </button>
              <button
                onClick={toggleHighContrast}
                title={highContrast ? 'Disable High Contrast' : 'Enable High Contrast'}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  highContrast
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700'
                }`}
                aria-label="Toggle High Contrast"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>

            {/* User Account / Sign In */}
            {user ? (
              <div className="flex items-center gap-2">
                {/* 1-Click Fast Cash In / Out Buttons */}
                <button
                  onClick={() => setIsDepositModalOpen(true)}
                  className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                  title="Cash in funds via Mobile Money or Bank Transfer"
                >
                  <Wallet className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Cash In</span>
                </button>

                <button
                  onClick={() => setIsWithdrawModalOpen(true)}
                  className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                  title="Cash out funds in multiples of 5,000 XAF"
                >
                  <span>Cash Out</span>
                </button>

                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 transition-colors text-left cursor-pointer"
                    aria-expanded={userDropdownOpen}
                  >
                    {user.photoURL ? (
                      <img 
                        src={user.photoURL} 
                        alt={user.name} 
                        referrerPolicy="no-referrer"
                        className="w-7 h-7 rounded-xl object-cover border border-slate-300 dark:border-slate-700" 
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-xl bg-slate-900 dark:bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">
                        {user.initials}
                      </div>
                    )}
                    <div className="hidden lg:block text-xs">
                      <p className="font-bold text-slate-900 dark:text-white leading-tight flex items-center gap-1">
                        <span>{user.name}</span>
                        {isCloudConnected && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" title="Synced with Firestore"></span>
                        )}
                      </p>
                      <p className="text-emerald-600 dark:text-emerald-400 font-mono font-bold text-[10px]">
                        {formatFCFA(user.walletBalance)}
                      </p>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {/* Dropdown */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-850 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-750">
                        <div className="flex items-center justify-between">
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Investor Profile</p>
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                            Firebase Synced
                          </span>
                        </div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate mt-0.5">{user.email}</p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300">
                            <ShieldCheck className="w-3 h-3" />
                            {user.kycTier}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                            {user.referralCode}
                          </span>
                        </div>
                      </div>

                      {/* Quick Cash In / Out in dropdown */}
                      <div className="grid grid-cols-2 gap-1 p-2 border-b border-slate-100 dark:border-slate-750 bg-slate-50/50 dark:bg-slate-800/50">
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            setIsDepositModalOpen(true);
                          }}
                          className="py-1.5 px-2 text-center text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-950 rounded-lg hover:bg-emerald-200 cursor-pointer"
                        >
                          + Cash In
                        </button>
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            setIsWithdrawModalOpen(true);
                          }}
                          className="py-1.5 px-2 text-center text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-200/70 dark:bg-slate-700 rounded-lg hover:bg-slate-300 cursor-pointer"
                        >
                          - Cash Out
                        </button>
                      </div>

                      <button
                        onClick={() => {
                          setDashboardTab('overview');
                          handleNavClick('dashboard');
                        }}
                        className="w-full px-4 py-2 text-left text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-750 flex items-center gap-2 cursor-pointer"
                      >
                        <LayoutDashboard className="w-4 h-4 text-slate-400" />
                        Investor Dashboard
                      </button>

                      <button
                        onClick={() => {
                          setDashboardTab('referrals');
                          handleNavClick('dashboard');
                        }}
                        className="w-full px-4 py-2 text-left text-xs font-bold text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40 flex items-center gap-2 cursor-pointer"
                      >
                        <Gift className="w-4 h-4 text-purple-500" />
                        Referral Program (+1,000 XAF)
                      </button>

                      <button
                        onClick={() => {
                          setDashboardTab('portfolio');
                          handleNavClick('dashboard');
                        }}
                        className="w-full px-4 py-2 text-left text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-750 flex items-center gap-2 cursor-pointer"
                      >
                        <Briefcase className="w-4 h-4 text-slate-400" />
                        My Holdings ({formatFCFA(user.totalInvested)})
                      </button>

                      <button
                        onClick={() => {
                          setDashboardTab('verification');
                          handleNavClick('dashboard');
                        }}
                        className="w-full px-4 py-2 text-left text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-750 flex items-center gap-2 cursor-pointer"
                      >
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        Identity & KYC Status
                      </button>

                      <button
                        onClick={() => {
                          handleNavClick('about');
                        }}
                        className="w-full px-4 py-2 text-left text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-750 flex items-center gap-2 cursor-pointer"
                      >
                        <FileText className="w-4 h-4 text-slate-400" />
                        Company History & Governance
                      </button>

                      <div className="border-t border-slate-100 dark:border-slate-750 my-1"></div>

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          signOutUser();
                        }}
                        className="w-full px-4 py-2 text-left text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer flex items-center justify-between"
                      >
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openAuthModal('signin')}
                  className="px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  onClick={() => openAuthModal('signup')}
                  className="px-4 py-2 text-xs font-bold text-white bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 cursor-pointer"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              aria-label="Open main menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-2 pb-6 space-y-3">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.page}
                onClick={() => handleNavClick(link.page)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-bold ${
                  currentPage === link.page
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
            <div className="flex items-center justify-between py-2 text-xs text-slate-600 dark:text-slate-400">
              <span>High Contrast Mode</span>
              <button
                onClick={toggleHighContrast}
                className={`px-3 py-1 rounded-lg text-xs font-bold ${
                  highContrast ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
                }`}
              >
                {highContrast ? 'Enabled' : 'Disabled'}
              </button>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleNavClick('dashboard');
                }}
                className="flex-1 py-2.5 px-4 bg-slate-900 dark:bg-emerald-600 text-white text-center text-xs font-bold rounded-xl"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
