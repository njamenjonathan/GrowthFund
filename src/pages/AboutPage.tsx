import React from 'react';
import {
  ArrowRight,
  Check,
  Coins,
  Eye,
  FileSearch,
  Gavel,
  Landmark,
  Layers,
  ShieldCheck,
  TrendingDown,
  Wallet,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useI18n } from '../i18n/LanguageContext';
import { useReveal } from '../hooks/useReveal';

/**
 * About the platform.
 *
 * What was here before was a corporate history: a founding date, a trade
 * register number, a regulatory licence number, named real institutions
 * (a custodian bank, a Big Four auditor, an inspection firm) presented as
 * partners, four named executives with detailed CVs, and an award. None
 * of it is real, and a prospective investor reading it would reasonably
 * conclude the platform was licensed and audited. It is replaced with
 * what the product actually offers and how it works.
 */
export const AboutPage: React.FC = () => {
  const { t } = useI18n();
  const { navigate, openAuthModal } = useApp();

  const missionRef = useReveal<HTMLElement>();
  const diligenceRef = useReveal<HTMLElement>();
  const principlesRef = useReveal<HTMLElement>();
  const howRef = useReveal<HTMLElement>();

  const diligenceStages = [
    { icon: FileSearch, en: 'Sponsor & background screening', fr: 'Vérification du promoteur' },
    { icon: Landmark, en: 'Physical & engineering review', fr: 'Examen technique et physique' },
    { icon: Gavel, en: 'Collateral & legal perfection', fr: 'Garanties et sûretés juridiques' },
    { icon: TrendingDown, en: 'Downside stress testing', fr: 'Tests de résistance' },
    { icon: ShieldCheck, en: 'Committee approval', fr: 'Validation par le comité' },
    { icon: Layers, en: 'Tranche-based release', fr: 'Décaissement par tranches' },
  ];

  const diligenceBodies = [
    {
      en: 'Background, credit history and tax standing are checked for the sponsor and its directors before an offering is considered.',
      fr: "Les antécédents, l'historique de crédit et la situation fiscale du promoteur et de ses dirigeants sont vérifiés avant tout examen d'une offre.",
    },
    {
      en: 'An independent engineer or surveyor inspects the site, structure, grid connection or equipment on which the return depends.',
      fr: "Un ingénieur ou géomètre indépendant inspecte le site, la structure, le raccordement ou les équipements dont dépend le rendement.",
    },
    {
      en: 'Mortgages, equipment liens and escrow pledges are executed and registered before the campaign opens, not after.',
      fr: "Hypothèques, nantissements d'équipements et gages de séquestre sont exécutés et enregistrés avant l'ouverture de la levée, pas après.",
    },
    {
      en: 'Cash-flow models are re-run against lower revenue, higher input costs and delayed completion to see what survives.',
      fr: "Les modèles de flux sont recalculés avec des revenus plus faibles, des coûts plus élevés et un achèvement retardé, pour voir ce qui tient.",
    },
    {
      en: 'An investment committee must approve unanimously. Most sponsor applications are declined at this stage.',
      fr: "Un comité d'investissement doit approuver à l'unanimité. La plupart des dossiers sont refusés à ce stade.",
    },
    {
      en: 'Capital is released against verified milestones rather than as a single lump sum at closing.',
      fr: "Le capital est libéré au fil de jalons vérifiés, plutôt qu'en une seule fois à la clôture.",
    },
  ];

  const principles = [
    {
      icon: Eye,
      title: { en: 'Risk stated first', fr: 'Le risque annoncé en premier' },
      body: {
        en: 'Every offering leads with what could go wrong and what secures it, not with the headline yield.',
        fr: "Chaque offre commence par ce qui peut mal tourner et ce qui la garantit, pas par le rendement affiché.",
      },
    },
    {
      icon: Coins,
      title: { en: 'No hidden spread', fr: 'Aucune marge cachée' },
      body: {
        en: 'One published administration fee, no investor transaction fee, and the full schedule on the legal page.',
        fr: "Des frais d'administration publiés, aucun frais de transaction investisseur, et la grille complète sur la page légale.",
      },
    },
    {
      icon: Wallet,
      title: { en: 'Money moves the way you do', fr: "L'argent circule comme vous" },
      body: {
        en: 'Mobile Money in and out, in 5,000 XAF steps, with no minimum balance to keep the account open.',
        fr: "Dépôt et retrait par Mobile Money, par pas de 5 000 XAF, sans solde minimum pour conserver le compte.",
      },
    },
    {
      icon: Layers,
      title: { en: 'Access at 25,000 XAF', fr: 'Accès dès 25 000 XAF' },
      body: {
        en: 'The same documentation and collateral structure whether you allocate 25,000 XAF or 25 million.',
        fr: "La même documentation et la même structure de garantie, que vous allouiez 25 000 XAF ou 25 millions.",
      },
    },
  ];

  const steps = [
    { title: t('home.step1'), body: t('home.step1Body') },
    { title: t('home.step2'), body: t('home.step2Body') },
    { title: t('home.step3'), body: t('home.step3Body') },
    { title: t('home.step4'), body: t('home.step4Body') },
  ];

  const { language } = useI18n();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16 text-slate-800 dark:text-slate-200">
      <header className="text-center space-y-4 max-w-3xl mx-auto">
        <p className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
          <ShieldCheck className="w-4 h-4" aria-hidden="true" />
          {t('about.eyebrow')}
        </p>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white font-display tracking-tight leading-tight">
          {t('about.title')}
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          {t('about.subtitle')}
        </p>
      </header>

      <section ref={missionRef} className="gf-reveal">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 space-y-3">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white font-display">
            {t('about.missionTitle')}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {t('about.missionBody')}
          </p>
        </div>
      </section>

      <section ref={diligenceRef} className="space-y-6 gf-reveal">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
            {t('about.diligenceTitle')}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">{t('about.diligenceBody')}</p>
        </div>

        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 gf-stagger">
          {diligenceStages.map((stage, index) => (
            <li
              key={stage.en}
              className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3 hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0"
                >
                  <stage.icon className="w-5 h-5" />
                </span>
                <span className="font-mono font-extrabold text-slate-500 dark:text-slate-400 text-lg">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {language === 'fr' ? stage.fr : stage.en}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {language === 'fr' ? diligenceBodies[index].fr : diligenceBodies[index].en}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section ref={principlesRef} className="space-y-6 gf-reveal">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
            {t('about.principlesTitle')}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">{t('about.principlesBody')}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 gf-stagger">
          {principles.map((principle) => (
            <div
              key={principle.title.en}
              className="bg-slate-50 dark:bg-slate-850 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2"
            >
              <span
                aria-hidden="true"
                className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 flex items-center justify-center"
              >
                <principle.icon className="w-5 h-5" />
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white pt-1">
                {language === 'fr' ? principle.title.fr : principle.title.en}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {language === 'fr' ? principle.body.fr : principle.body.en}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section ref={howRef} className="space-y-6 gf-reveal">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
            {t('about.howTitle')}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">{t('about.howBody')}</p>
        </div>

        <ol className="space-y-3">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-start gap-4"
            >
              <span
                aria-hidden="true"
                className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-sm flex items-center justify-center shrink-0"
              >
                {index + 1}
              </span>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">{step.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {step.body}
                </p>
              </div>
              <Check className="w-4 h-4 text-emerald-500 shrink-0 ml-auto mt-1" aria-hidden="true" />
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-slate-900 dark:bg-slate-850 text-white rounded-3xl p-8 sm:p-12 text-center space-y-6 border border-slate-800">
        <div className="max-w-2xl mx-auto space-y-3">
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display">{t('about.ctaTitle')}</h2>
          <p className="text-sm text-slate-300 leading-relaxed">{t('about.ctaBody')}</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => navigate('marketplace')}
            className="px-6 py-3 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-xl text-sm transition-colors inline-flex items-center gap-2"
          >
            {t('home.ctaExplore')}
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => openAuthModal('signup')}
            className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-xl text-sm font-bold transition-colors"
          >
            {t('home.ctaCreate')}
          </button>
        </div>

        <p className="text-[11px] text-slate-300 max-w-xl mx-auto leading-relaxed">
          {t('app.demoNotice')}
        </p>
      </section>
    </div>
  );
};
