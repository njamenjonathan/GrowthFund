import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GrowthFundLogo } from './GrowthFundLogo';
import { X, Lock, Mail, User, ArrowRight, Gift, CloudCheck, ShieldCheck } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    authModalMode, 
    openAuthModal, 
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    isAuthLoading
  } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [signupReferralCode, setSignupReferralCode] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [submittingLocal, setSubmittingLocal] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleGoogleSignIn = async () => {
    setSubmittingLocal(true);
    await signInWithGoogle();
    setSubmittingLocal(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingLocal(true);

    if (authModalMode === 'signin') {
      await signInWithEmail(email, password);
    } else {
      await signUpWithEmail(email, password, fullName || 'Investor', signupReferralCode);
    }

    setSubmittingLocal(false);
  };

  const isLoading = isAuthLoading || submittingLocal;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full shadow-2xl overflow-hidden transition-all animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-850">
          <div className="flex items-center gap-2">
            <GrowthFundLogo size="sm" />
            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              <CloudCheck className="w-3 h-3 text-emerald-600" />
              Firebase Auth
            </span>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-5">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white font-display">
              {authModalMode === 'signin' ? 'Sign in to GrowthFund' : 'Create Investor Account'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {authModalMode === 'signin' 
                ? 'Access your Franc CFA portfolio, real-time Firestore sync, and cash balance' 
                : 'Join institutional and verified investors in Central & West Africa'}
            </p>
          </div>

          {/* Google Sign-In Primary Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full py-3 px-4 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 text-slate-800 dark:text-slate-100 font-bold rounded-2xl text-xs transition-all flex items-center justify-center gap-3 shadow-xs hover:bg-slate-50 dark:hover:bg-slate-750 cursor-pointer disabled:opacity-50"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 dark:border-slate-750 w-full"></div>
            <span className="bg-white dark:bg-slate-900 px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              or email
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            {authModalMode === 'signup' && (
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Full Legal Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Samuel Eto'o"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-emerald-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="investor@example.com"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-emerald-500"
                />
              </div>
            </div>

            {authModalMode === 'signup' && (
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                  <span>Referral Code (Optional)</span>
                  <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400">+1,000 XAF Bonus</span>
                </label>
                <div className="relative">
                  <Gift className="w-4 h-4 text-purple-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={signupReferralCode}
                    onChange={(e) => setSignupReferralCode(e.target.value.toUpperCase())}
                    placeholder="e.g. GF-XAF2026"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-purple-200 dark:border-purple-900/50 rounded-xl text-slate-900 dark:text-white text-xs font-mono font-bold uppercase focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            )}

            {authModalMode === 'signup' && (
              <div className="flex items-start gap-2.5 pt-1">
                <input
                  type="checkbox"
                  id="auth-terms"
                  required
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
                />
                <label htmlFor="auth-terms" className="text-[11px] text-slate-600 dark:text-slate-400 leading-normal">
                  I agree to GrowthFund's{' '}
                  <span className="text-slate-900 dark:text-white font-bold underline">Terms of Service</span>,{' '}
                  <span className="text-slate-900 dark:text-white font-bold underline">Privacy Policy</span>, and understand that{' '}
                  <strong className="text-red-600 dark:text-red-400">capital is at risk</strong> across private market offerings.
                </label>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Connecting to Firebase...
                </span>
              ) : (
                <>
                  {authModalMode === 'signin' ? 'Sign In with Email' : 'Create Account & Claim Bonus'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-slate-500">
            {authModalMode === 'signin' ? (
              <p>
                Don't have an account?{' '}
                <button
                  onClick={() => openAuthModal('signup')}
                  className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                >
                  Create free account
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  onClick={() => openAuthModal('signin')}
                  className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
