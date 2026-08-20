import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  FileText,
  Lock,
  ShieldCheck,
  Upload,
} from 'lucide-react';
import { Modal } from './Modal';
import { useApp } from '../context/AppContext';
import { useI18n } from '../i18n/LanguageContext';
import { formatFCFA } from '../utils/format';

const TOTAL_STEPS = 4;

/** XAF income and net-worth bands, replacing the previous USD/SEC brackets. */
const INCOME_BANDS = ['< 2 000 000', '2 000 000 – 6 000 000', '6 000 000 – 15 000 000', '> 15 000 000'];
const NET_WORTH_BANDS = ['< 5 000 000', '5 000 000 – 25 000 000', '25 000 000 – 100 000 000', '> 100 000 000'];

const COUNTRIES = [
  'Cameroun / Cameroon',
  "Côte d'Ivoire",
  'Sénégal / Senegal',
  'Gabon',
  'Bénin / Benin',
  'Burkina Faso',
  'Mali',
  'Tchad / Chad',
  'Togo',
  'Congo',
];

export const KYCModal: React.FC = () => {
  const { t, language } = useI18n();
  const { activeModal, closeModal, completeKYC, user } = useApp();

  const isOpen = activeModal === 'kyc';

  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [documentType, setDocumentType] = useState('nationalId');
  const [fileName, setFileName] = useState<string | null>(null);
  const [form, setForm] = useState({
    legalName: '',
    dob: '',
    taxId: '',
    address: '',
    city: '',
    country: COUNTRIES[0],
    annualIncome: INCOME_BANDS[1],
    netWorth: NET_WORTH_BANDS[1],
    riskTolerance: 'moderate',
  });

  // Start from a clean first step each time, seeded with the profile name.
  useEffect(() => {
    if (!isOpen) return;
    setStep(1);
    setIsProcessing(false);
    setFileName(null);
    setForm((prev) => ({ ...prev, legalName: user.name }));
  }, [isOpen, user.name]);

  const documentOptions = [
    { id: 'nationalId', label: t('kyc.doc.nationalId') },
    { id: 'passport', label: t('kyc.doc.passport') },
    { id: 'residence', label: t('kyc.doc.residence') },
  ];

  const riskOptions = [
    { id: 'conservative', label: t('kyc.risk.conservative') },
    { id: 'moderate', label: t('kyc.risk.moderate') },
    { id: 'aggressive', label: t('kyc.risk.aggressive') },
  ];

  const handleNext = async () => {
    if (step < 3) {
      setStep(step + 1);
      return;
    }
    setIsProcessing(true);
    try {
      await completeKYC('Tier 1 Verified');
      setStep(4);
    } finally {
      setIsProcessing(false);
    }
  };

  const stepLabels = [t('kyc.step1'), t('kyc.step2'), t('kyc.step3'), t('kyc.step4')];
  const fieldClass =
    'w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500';

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      size="lg"
      icon={
        <span
          aria-hidden="true"
          className="p-2 bg-emerald-100 dark:bg-emerald-950 rounded-xl text-emerald-700 dark:text-emerald-400 shrink-0"
        >
          <ShieldCheck className="w-5 h-5" />
        </span>
      }
      title={t('kyc.title')}
      subtitle={t('kyc.subtitle')}
    >
      <div className="px-5 sm:px-6 pt-4 pb-2 border-b border-slate-100 dark:border-slate-800">
        <ol className="flex items-center justify-between text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-2 gap-2">
          {stepLabels.map((label, index) => (
            <li
              key={label}
              aria-current={step === index + 1 ? 'step' : undefined}
              className={`truncate ${
                step >= index + 1 ? 'text-slate-900 dark:text-white font-bold' : ''
              }`}
            >
              <span className="hidden sm:inline">{index + 1}. </span>
              {label}
            </li>
          ))}
        </ol>
        <div
          role="progressbar"
          aria-valuenow={step}
          aria-valuemin={1}
          aria-valuemax={TOTAL_STEPS}
          aria-label={t('kyc.stepOf', { current: step, total: TOTAL_STEPS })}
          className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden"
        >
          <div
            className="bg-slate-900 dark:bg-emerald-500 h-full transition-all duration-300 rounded-full"
            style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
          />
        </div>
      </div>

      <div className="p-5 sm:p-6 max-h-[60vh] overflow-y-auto">
        {step === 1 && (
          <div className="space-y-4">
            <p className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700 flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
              <Lock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
              {t('kyc.privacy')}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="sm:col-span-2">
                <label htmlFor="kyc-name" className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t('kyc.legalName')}
                </label>
                <input
                  id="kyc-name"
                  type="text"
                  autoComplete="name"
                  value={form.legalName}
                  onChange={(event) => setForm({ ...form, legalName: event.target.value })}
                  className={fieldClass}
                />
              </div>

              <div>
                <label htmlFor="kyc-dob" className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t('kyc.dob')}
                </label>
                <input
                  id="kyc-dob"
                  type="date"
                  autoComplete="bday"
                  value={form.dob}
                  onChange={(event) => setForm({ ...form, dob: event.target.value })}
                  className={fieldClass}
                />
              </div>

              <div>
                <label htmlFor="kyc-tax" className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t('kyc.taxId')}
                </label>
                <input
                  id="kyc-tax"
                  type="text"
                  value={form.taxId}
                  onChange={(event) => setForm({ ...form, taxId: event.target.value })}
                  className={`${fieldClass} font-mono`}
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="kyc-address" className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t('kyc.address')}
                </label>
                <input
                  id="kyc-address"
                  type="text"
                  autoComplete="street-address"
                  value={form.address}
                  onChange={(event) => setForm({ ...form, address: event.target.value })}
                  className={fieldClass}
                />
              </div>

              <div>
                <label htmlFor="kyc-city" className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t('kyc.city')}
                </label>
                <input
                  id="kyc-city"
                  type="text"
                  autoComplete="address-level2"
                  value={form.city}
                  onChange={(event) => setForm({ ...form, city: event.target.value })}
                  className={fieldClass}
                />
              </div>

              <div>
                <label htmlFor="kyc-country" className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t('kyc.country')}
                </label>
                <select
                  id="kyc-country"
                  value={form.country}
                  onChange={(event) => setForm({ ...form, country: event.target.value })}
                  className={fieldClass}
                >
                  {COUNTRIES.map((country) => (
                    <option key={country}>{country}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 text-xs">
            <fieldset>
              <legend className="font-bold text-slate-900 dark:text-white text-sm mb-2">
                {t('kyc.docType')}
              </legend>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {documentOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setDocumentType(option.id)}
                    aria-pressed={documentType === option.id}
                    className={`py-2.5 px-3 rounded-xl border text-center font-bold transition-colors ${
                      documentType === option.id
                        ? 'border-slate-900 dark:border-emerald-500 bg-slate-900 dark:bg-emerald-700 text-white'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 text-center bg-slate-50/50 dark:bg-slate-850">
              <Upload className="w-8 h-8 mx-auto text-slate-400 mb-2" aria-hidden="true" />
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {t('kyc.upload')}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{t('kyc.uploadHint')}</p>

              {/*
                A real file input rather than decorative "browse files" text,
                so the control is reachable by keyboard and screen reader.
              */}
              <label
                htmlFor="kyc-file"
                className="inline-block mt-3 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors"
              >
                {t('kyc.chooseFile')}
              </label>
              <input
                id="kyc-file"
                type="file"
                accept="image/jpeg,image/png,application/pdf"
                className="sr-only"
                onChange={(event) => setFileName(event.target.files?.[0]?.name ?? null)}
              />

              {fileName && (
                <p className="inline-flex items-center gap-2 mt-3 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-medium max-w-full">
                  <FileText className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span className="truncate">{fileName}</span>
                </p>
              )}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 text-xs">
            <p className="text-slate-600 dark:text-slate-300">{t('kyc.suitabilityBody')}</p>

            <div>
              <label htmlFor="kyc-income" className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                {t('kyc.annualIncome')}
              </label>
              <select
                id="kyc-income"
                value={form.annualIncome}
                onChange={(event) => setForm({ ...form, annualIncome: event.target.value })}
                className={fieldClass}
              >
                {INCOME_BANDS.map((band) => (
                  <option key={band}>{band}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="kyc-worth" className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                {t('kyc.netWorth')}
              </label>
              <select
                id="kyc-worth"
                value={form.netWorth}
                onChange={(event) => setForm({ ...form, netWorth: event.target.value })}
                className={fieldClass}
              >
                {NET_WORTH_BANDS.map((band) => (
                  <option key={band}>{band}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="kyc-risk" className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                {t('kyc.riskTolerance')}
              </label>
              <select
                id="kyc-risk"
                value={form.riskTolerance}
                onChange={(event) => setForm({ ...form, riskTolerance: event.target.value })}
                className={fieldClass}
              >
                {riskOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/80 rounded-full flex items-center justify-center mx-auto text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="w-9 h-9" aria-hidden="true" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t('kyc.approved')}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300">{t('kyc.approvedBody')}</p>
            </div>

            <dl className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-left space-y-2 text-xs">
              <div className="flex justify-between gap-3">
                <dt className="text-slate-500 dark:text-slate-400">{t('kyc.assignedTier')}</dt>
                <dd className="font-bold text-emerald-700 dark:text-emerald-400">
                  {t("kyc.tier.Tier 1 Verified")}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-slate-500 dark:text-slate-400">{t('kyc.annualLimit')}</dt>
                <dd className="font-bold text-slate-900 dark:text-white">
                  {formatFCFA(50_000_000, language)}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-slate-500 dark:text-slate-400">{t('kyc.clearanceId')}</dt>
                <dd className="font-mono text-slate-900 dark:text-white">
                  KYC-{Math.floor(100_000 + Math.random() * 900_000)}
                </dd>
              </div>
            </dl>

            <button
              type="button"
              onClick={closeModal}
              className="w-full py-3 bg-slate-900 dark:bg-emerald-700 hover:bg-slate-800 dark:hover:bg-emerald-600 text-white font-bold rounded-xl text-sm transition-colors"
            >
              {t('kyc.returnToDashboard')}
            </button>
          </div>
        )}

        {step < 4 && (
          <div className="flex items-center justify-between gap-3 pt-5 mt-4 border-t border-slate-100 dark:border-slate-800">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                {t('kyc.back')}
              </button>
            ) : (
              <span />
            )}

            <button
              type="button"
              onClick={handleNext}
              disabled={isProcessing}
              className="px-5 py-2.5 bg-slate-900 dark:bg-emerald-700 hover:bg-slate-800 dark:hover:bg-emerald-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors disabled:opacity-60"
            >
              {isProcessing ? (
                <>
                  <span
                    aria-hidden="true"
                    className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"
                  />
                  {t('kyc.verifying')}
                </>
              ) : (
                <>
                  {step === 3 ? t('kyc.submit') : t('kyc.continue')}
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};
