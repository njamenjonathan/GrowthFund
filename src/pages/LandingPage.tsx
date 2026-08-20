import React, { useState } from 'react';
import {
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  AlertTriangle,
  BarChart3,
  Coins,
  FileCheck,
  Gift,
  Lock,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { OpportunityCard } from '../components/OpportunityCard';
import { TierLadder } from '../components/TierLadder';
import { useI18n } from '../i18n/LanguageContext';
import { useReveal } from '../hooks/useReveal';
import { formatFCFA, formatPercent } from '../utils/format';
import {
  MIN_INVESTMENT,

  lockMonthsFor,
  tierForAmount,
  termLabel,
} from '../lib/investmentTiers';

export const LandingPage: React.FC = () => {
  const { t, tr, language } = useI18n();
  const { navigate, opportunities, openAuthModal } = useApp();

  const [amount, setAmount] = useState(250_000);
  const [rate, setRate] = useState(10.5);

  /*
   * The commitment term is derived from the amount rather than chosen
   * separately, because that is how the product actually works: the tier
   * an allocation falls into fixes how long it stays locked.
   */
  const tier = tierForAmount(amount);
  const lockMonths = lockMonthsFor(amount);
  const years = lockMonths / 12;

  const annualReturn = (amount * rate) / 100;
  const totalReturn = annualReturn * years;
  const totalValue = amount + totalReturn;

  const featured = opportunities.filter((opp) => opp.isFeatured).slice(0, 3);

  const featuresRef = useReveal<HTMLElement>();
  const calcRef = useReveal<HTMLElement>();
  const tiersRef = useReveal<HTMLElement>();
  const pillarsRef = useReveal<HTMLElement>();
  const stepsRef = useReveal<HTMLElement>();
  const ctaRef = useReveal<HTMLElement>();

  const pillars = [
    { icon: FileCheck, title: t('home.pillar.diligence'), body: t('home.pillar.diligenceBody') },
    { icon: ShieldCheck, title: t('home.pillar.collateral'), body: t('home.pillar.collateralBody') },
    { icon: Coins, title: t('home.pillar.cashflow'), body: t('home.pillar.cashflowBody') },
    { icon: Lock, title: t('home.pillar.fees'), body: t('home.pillar.feesBody') },
  ];

  const steps = [
    { title: t('home.step1'), body: t('home.step1Body') },
    { title: t('home.step2'), body: t('home.step2Body') },
    { title: t('home.step3'), body: t('home.step3Body') },
    { title: t('home.step4'), body: t('home.step4Body') },
  ];

  return (
    <div className="space-y-20 sm:space-y-24 pb-16">
      {/* Hero */}
      <section className="relative pt-12 sm:pt-16 lg:pt-20 overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0 -z-10 flex items-center justify-center">
          <div className="w-[600px] h-[400px] bg-emerald-500/10 dark:bg-emerald-500/[0.07] blur-[120px] rounded-full" />
          <div className="w-[500px] h-[350px] bg-blue-500/10 dark:bg-blue-500/[0.07] blur-[120px] rounded-full translate-x-32" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <p className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200">
            <span aria-hidden="true" className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            {t('home.badge')}
          </p>

          <div className="space-y-4 max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display leading-[1.1]">
              {t('home.h1a')}{' '}
              <span className="text-emerald-700 dark:text-emerald-400">{t('home.h1b')}</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              {t('home.sub')}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => navigate('marketplace')}
              className="w-full sm:w-auto px-8 py-4 bg-slate-900 dark:bg-emerald-700 hover:bg-slate-800 dark:hover:bg-emerald-600 text-white text-base font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group"
            >
              {t('home.ctaExplore')}
              <ArrowRight
                className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                aria-hidden="true"
              />
            </button>

            <button
              type="button"
              onClick={() => openAuthModal('signup')}
              className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-800 dark:text-white text-base font-bold rounded-2xl border border-slate-200 dark:border-slate-700 transition-colors"
            >
              {t('home.ctaCreate')}
            </button>
          </div>

          <div className="max-w-2xl mx-auto bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-2xl p-4 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-3 text-left">
            <AlertTriangle
              className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <p className="leading-relaxed">
              <strong>{t('home.riskNotice')}:</strong> {t('home.riskNoticeBody')}
            </p>
          </div>

          <dl className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 max-w-4xl mx-auto border-t border-slate-200/80 dark:border-slate-800 gf-stagger">
            {[
              { value: '32.5 Md XAF', label: t('home.stat.funded'), tone: 'text-slate-900 dark:text-white' },
              { value: '4 800+', label: t('home.stat.investors'), tone: 'text-slate-900 dark:text-white' },
              { value: '4.1 Md XAF', label: t('home.stat.paid'), tone: 'text-emerald-700 dark:text-emerald-400' },
              { value: '+1 000 XAF', label: t('home.stat.bonus'), tone: 'text-purple-600 dark:text-purple-400' },
            ].map((stat) => (
              <div key={stat.label} className="p-3 text-left">
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className={`block text-xl sm:text-2xl font-extrabold font-mono ${stat.tone}`}>
                    {stat.value}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 block">
                    {stat.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Money features */}
      <section ref={featuresRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 gf-reveal">
        <h2 className="sr-only">{t('home.featuresTitle')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: ArrowDownLeft,
              tone: 'bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400',
              title: t('home.feature.cashIn'),
              body: t('home.feature.cashInBody'),
            },
            {
              icon: ArrowUpRight,
              tone: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400',
              title: t('home.feature.cashOut'),
              body: t('home.feature.cashOutBody'),
            },
            {
              icon: Gift,
              tone: 'bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400',
              title: t('home.feature.referral'),
              body: t('home.feature.referralBody'),
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3 hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
            >
              <span
                aria-hidden="true"
                className={`w-10 h-10 rounded-2xl flex items-center justify-center ${feature.tone}`}
              >
                <feature.icon className="w-5 h-5" />
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">{feature.title}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {feature.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured opportunities */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4" aria-hidden="true" />
              {t('home.featuredEyebrow')}
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display mt-1">
              {t('home.featuredTitle')}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-xl">
              {t('home.featuredBody')}
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('marketplace')}
            className="self-start md:self-auto text-sm font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 flex items-center gap-1.5 group"
          >
            {t('home.browseAll')}
            <ArrowRight
              className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
              aria-hidden="true"
            />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 gf-stagger">
          {featured.map((opp) => (
            <OpportunityCard key={opp.id} opportunity={opp} featured />
          ))}
        </div>
      </section>

      {/* Calculator */}
      <section ref={calcRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 gf-reveal">
        <div className="bg-slate-900 dark:bg-slate-950 text-white rounded-3xl p-6 sm:p-10 border border-slate-800">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <p className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-800 text-xs font-bold text-emerald-400">
                <BarChart3 className="w-3.5 h-3.5" aria-hidden="true" />
                {t('home.calcEyebrow')}
              </p>

              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-extrabold font-display">
                  {t('home.calcTitle')}
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed">{t('home.calcBody')}</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-baseline text-sm">
                  <label htmlFor="calc-amount" className="text-slate-300 font-medium">
                    {t('home.calcAmount')}
                  </label>
                  <output
                    htmlFor="calc-amount"
                    className="font-mono font-extrabold text-emerald-400 text-base"
                  >
                    {formatFCFA(amount, language)}
                  </output>
                </div>
                <input
                  id="calc-amount"
                  type="range"
                  min={MIN_INVESTMENT}
                  max={2_500_000}
                  step={5_000}
                  value={amount}
                  onChange={(event) => setAmount(Number(event.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-baseline text-sm">
                  <label htmlFor="calc-rate" className="text-slate-300 font-medium">
                    {t('home.calcRate')}
                  </label>
                  <output
                    htmlFor="calc-rate"
                    className="font-mono font-extrabold text-emerald-400 text-base"
                  >
                    {formatPercent(rate, language)} {t('opp.perAnnum')}
                  </output>
                </div>
                <input
                  id="calc-rate"
                  type="range"
                  min={6}
                  max={16}
                  step={0.5}
                  value={rate}
                  onChange={(event) => setRate(Number(event.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              <div className="rounded-2xl border border-emerald-800/70 bg-emerald-950/40 p-4 space-y-1">
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  {t('home.calcHorizon')}
                </p>
                <p className="text-sm text-slate-200">
                  <strong className="font-extrabold text-white">
                    {t(termLabel(lockMonths).key, { count: termLabel(lockMonths).count })}
                  </strong>{' '}
                  · {t('invest.tierNow', { tier: tr(tier.name) })}
                </p>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {t('home.calcLockNote')}
                </p>
              </div>
            </div>

            <div className="lg:col-span-5 bg-slate-850 p-6 sm:p-8 rounded-3xl border border-slate-700/80 space-y-5">
              <h3 className="text-xs uppercase font-bold tracking-wider text-slate-400">
                {t('home.calcOutput', { count: years })}
              </h3>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-xs text-slate-400 block font-medium">
                  {t('home.calcAnnual')}
                </span>
                <span className="text-2xl font-extrabold font-mono text-emerald-400">
                  {formatFCFA(annualReturn, language)}
                  {t('common.perYear')}
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{t('home.calcAnnualNote')}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-xs text-slate-400 block font-medium">
                  {t('home.calcTotal')}
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white break-all">
                  {formatFCFA(totalValue, language)}
                </span>
                <div className="flex flex-wrap justify-between gap-2 text-xs text-slate-400 mt-2 pt-2 border-t border-slate-800">
                  <span>
                    {t('home.calcPrincipal')}: {formatFCFA(amount, language)}
                  </span>
                  <span className="text-emerald-400 font-bold">
                    +{formatFCFA(totalReturn, language)} {t('home.calcYield')}
                  </span>
                </div>
              </div>

              <p className="p-3.5 bg-red-950/40 rounded-xl border border-red-900/60 text-[11px] text-red-300 leading-relaxed">
                {t('home.calcDisclaimer')}
              </p>

              <button
                type="button"
                onClick={() => navigate('marketplace')}
                className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-2xl text-sm transition-colors flex items-center justify-center gap-2"
              >
                {t('home.calcCta')}
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Allocation tiers — the core product rule, stated before signup. */}
      <section ref={tiersRef} className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 gf-reveal">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <p className="inline-flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider">
            <Lock className="w-4 h-4" aria-hidden="true" />
            {t('tier.label')}
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
            {t('home.tierTitle')}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {t('home.tierBody')}
          </p>
        </div>

        <TierLadder />

        <p className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2 max-w-2xl mx-auto">
          <Lock className="w-3.5 h-3.5 shrink-0 mt-0.5" aria-hidden="true" />
          {t('lock.explainer')}
        </p>
      </section>

      {/* Pillars */}
      <section ref={pillarsRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 gf-reveal">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <p className="text-emerald-700 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider">
            {t('home.pillarsEyebrow')}
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
            {t('home.pillarsTitle')}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">{t('home.pillarsBody')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 gf-stagger">
          {pillars.map((pillar) => (
            <div
              key={pillar.title}
              className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3 hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
            >
              <span
                aria-hidden="true"
                className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-emerald-700 dark:text-emerald-400"
              >
                <pillar.icon className="w-5 h-5" />
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
                {pillar.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {pillar.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Steps */}
      <section ref={stepsRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 gf-reveal">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <p className="text-emerald-700 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider">
            {t('home.stepsEyebrow')}
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
            {t('home.stepsTitle')}
          </h2>
        </div>

        <ol className="grid grid-cols-1 md:grid-cols-4 gap-6 gf-stagger">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2"
            >
              <span
                aria-hidden="true"
                className="text-3xl font-extrabold font-mono text-emerald-700 dark:text-emerald-400 block mb-2"
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">{step.title}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Final CTA */}
      <section ref={ctaRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 gf-reveal">
        <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 text-white rounded-3xl p-8 sm:p-12 text-center space-y-6 border border-slate-800">
          <h2 className="text-2xl sm:text-4xl font-extrabold font-display max-w-2xl mx-auto">
            {t('home.finalCta')}
          </h2>
          <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            {t('home.finalCtaBody')}
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <button
              type="button"
              onClick={() => navigate('marketplace')}
              className="px-8 py-3.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-2xl text-sm transition-colors"
            >
              {t('home.ctaExplore')}
            </button>
            <button
              type="button"
              onClick={() => openAuthModal('signup')}
              className="px-8 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl text-sm border border-slate-700 transition-colors"
            >
              {t('home.ctaCreate')}
            </button>
          </div>

          <p className="text-[11px] text-slate-400 max-w-lg mx-auto leading-relaxed">
            {t('home.finalCtaNote')}
          </p>
        </div>
      </section>
    </div>
  );
};
