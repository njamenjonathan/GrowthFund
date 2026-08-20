import React, { useState } from 'react';
import { ArrowRight, Gift, Lock, Mail, User } from 'lucide-react';
import { Modal } from './Modal';
import { GrowthFundLogo } from './GrowthFundLogo';
import { useApp } from '../context/AppContext';
import { useI18n } from '../i18n/LanguageContext';

export const AuthModal: React.FC = () => {
  const { t } = useI18n();
  const {
    activeModal,
    closeModal,
    authModalMode,
    openAuthModal,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    isAuthLoading,
  } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isOpen = activeModal === 'auth';
  const isSignUp = authModalMode === 'signup';
  const isBusy = isAuthLoading || isSubmitting;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      if (isSignUp) {
        await signUpWithEmail(email, password, fullName || 'Investor', referralCode);
      } else {
        await signInWithEmail(email, password);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setIsSubmitting(true);
    try {
      await signInWithGoogle();
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    'w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500';

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      size="sm"
      icon={<GrowthFundLogo size="sm" showText={false} />}
      title={isSignUp ? t('auth.signUpTitle') : t('auth.signInTitle')}
      subtitle={isSignUp ? t('auth.signUpSubtitle') : t('auth.signInSubtitle')}
    >
      <div className="p-5 sm:p-6 space-y-5">
        <button
          type="button"
          onClick={handleGoogle}
          disabled={isBusy}
          className="w-full py-3 px-4 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 text-slate-800 dark:text-slate-100 font-bold rounded-2xl text-xs transition-colors flex items-center justify-center gap-3 disabled:opacity-50"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          {t('auth.continueWithGoogle')}
        </button>

        <div className="relative flex items-center justify-center">
          <span className="border-t border-slate-200 dark:border-slate-750 w-full" />
          <span className="absolute bg-white dark:bg-slate-900 px-3 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {t('auth.orEmail')}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {isSignUp && (
            <div>
              <label htmlFor="auth-name" className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                {t('auth.fullName')}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
                <input
                  id="auth-name"
                  type="text"
                  required
                  autoComplete="name"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  placeholder={t('auth.fullNamePlaceholder')}
                  className={inputClass}
                />
              </div>
            </div>
          )}

          <div>
            <label htmlFor="auth-email" className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              {t('auth.email')}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
              <input
                id="auth-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="investor@example.com"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label htmlFor="auth-password" className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              {t('auth.password')}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
              <input
                id="auth-password"
                type="password"
                required
                minLength={6}
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                aria-describedby={isSignUp ? 'auth-password-hint' : undefined}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                className={inputClass}
              />
            </div>
            {isSignUp && (
              <p id="auth-password-hint" className="mt-1 text-[10px] text-slate-500 dark:text-slate-400">
                {t('auth.passwordHint')}
              </p>
            )}
          </div>

          {isSignUp && (
            <>
              <div>
                <label
                  htmlFor="auth-referral"
                  className="flex items-center justify-between font-bold text-slate-700 dark:text-slate-300 mb-1"
                >
                  <span>{t('auth.referralCode')}</span>
                  <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400">
                    {t('auth.referralBonus')}
                  </span>
                </label>
                <div className="relative">
                  <Gift className="w-4 h-4 text-purple-500 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
                  <input
                    id="auth-referral"
                    type="text"
                    value={referralCode}
                    onChange={(event) => setReferralCode(event.target.value.toUpperCase())}
                    placeholder="GF-XAF2026"
                    className={`${inputClass} font-mono uppercase`}
                  />
                </div>
              </div>

              <div className="flex items-start gap-2.5 pt-1">
                <input
                  type="checkbox"
                  id="auth-terms"
                  required
                  checked={agreedToTerms}
                  onChange={(event) => setAgreedToTerms(event.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-emerald-600 rounded border-slate-300"
                />
                <label
                  htmlFor="auth-terms"
                  className="text-[11px] text-slate-600 dark:text-slate-400 leading-normal"
                >
                  {t('auth.terms')}
                </label>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={isBusy}
            className="w-full py-3 bg-slate-900 dark:bg-emerald-700 hover:bg-slate-800 dark:hover:bg-emerald-600 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isBusy ? (
              <>
                <span
                  aria-hidden="true"
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                />
                {t('auth.connecting')}
              </>
            ) : (
              <>
                {isSignUp ? t('auth.submitSignUp') : t('auth.submitSignIn')}
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 dark:text-slate-400">
          {isSignUp ? t('auth.hasAccount') : t('auth.noAccount')}{' '}
          <button
            type="button"
            onClick={() => openAuthModal(isSignUp ? 'signin' : 'signup')}
            className="font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
          >
            {isSignUp ? t('auth.signInInstead') : t('auth.createFree')}
          </button>
        </p>
      </div>
    </Modal>
  );
};
