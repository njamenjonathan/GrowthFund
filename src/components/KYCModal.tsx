import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  Upload, 
  FileText, 
  UserCheck, 
  AlertCircle, 
  ArrowRight,
  ArrowLeft,
  Lock
} from 'lucide-react';

export const KYCModal: React.FC = () => {
  const { isKYCModalOpen, setIsKYCModalOpen, completeKYC, user } = useApp();
  const [step, setStep] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [selectedDocType, setSelectedDocType] = useState<string>('drivers_license');
  const [fileName, setFileName] = useState<string>('drivers_license_front.jpg');
  const [accreditationType, setAccreditationType] = useState<string>('income');

  // Form states
  const [formData, setFormData] = useState({
    legalName: user.name || 'Johnathan Doe',
    dob: '1988-06-14',
    ssnLast4: '4921',
    address: '742 Evergreen Terrace',
    city: 'Austin',
    state: 'TX',
    zip: '78701',
    netWorth: '$500k - $1M',
    annualIncome: '$150k - $250k',
    riskTolerance: 'Moderate Growth',
    experience: '5-10 years investing',
  });

  if (!isKYCModalOpen) return null;

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        setStep(4);
        completeKYC('Tier 1 Verified');
      }, 1200);
    }
  };

  const handleClose = () => {
    setIsKYCModalOpen(false);
    setStep(1);
    setIsProcessing(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden transition-all animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="kyc-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-850">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-100 dark:bg-emerald-950 rounded-lg text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 id="kyc-modal-title" className="text-base font-bold text-slate-900 dark:text-white">
                Identity & Investor Verification
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Mandatory SEC / FinCEN Anti-Money Laundering (AML) Compliance
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper indicator */}
        <div className="px-6 pt-4 pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
            <span className={step >= 1 ? 'text-slate-900 dark:text-white font-bold' : ''}>1. Personal Info</span>
            <span className={step >= 2 ? 'text-slate-900 dark:text-white font-bold' : ''}>2. ID Upload</span>
            <span className={step >= 3 ? 'text-slate-900 dark:text-white font-bold' : ''}>3. Suitability</span>
            <span className={step >= 4 ? 'text-emerald-600 font-bold' : ''}>4. Status</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-slate-900 dark:bg-emerald-500 h-full transition-all duration-300 rounded-full"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Body content based on step */}
        <div className="p-6">
          {step === 1 && (
            <div className="space-y-4">
              <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200 dark:border-slate-700 flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                <Lock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Your information is encrypted with bank-level 256-bit AES protocol and never shared with unaccredited third parties.</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="sm:col-span-2">
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    value={formData.legalName}
                    onChange={(e) => setFormData({ ...formData, legalName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Last 4 digits of SSN / Tax ID</label>
                  <input
                    type="text"
                    maxLength={4}
                    value={formData.ssnLast4}
                    onChange={(e) => setFormData({ ...formData, ssnLast4: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Residential Street Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">State</label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Zip</label>
                    <input
                      type="text"
                      value={formData.zip}
                      onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 text-xs">
              <label className="block font-semibold text-slate-900 dark:text-white text-sm">
                Select Identity Document
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'drivers_license', label: "Driver's License" },
                  { id: 'passport', label: 'US Passport' },
                  { id: 'state_id', label: 'State ID Card' },
                ].map((doc) => (
                  <button
                    key={doc.id}
                    type="button"
                    onClick={() => setSelectedDocType(doc.id)}
                    className={`py-2.5 px-3 rounded-lg border text-center font-medium transition-colors ${
                      selectedDocType === doc.id
                        ? 'border-slate-900 dark:border-emerald-500 bg-slate-900 dark:bg-emerald-600 text-white'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {doc.label}
                  </button>
                ))}
              </div>

              {/* Upload Dropzone */}
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-6 text-center hover:border-slate-400 transition-colors bg-slate-50/50 dark:bg-slate-850">
                <Upload className="w-8 h-8 mx-auto text-slate-400 dark:text-slate-500 mb-2" />
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Drag and drop photo of your ID front or{' '}
                  <span className="text-emerald-600 dark:text-emerald-400 underline cursor-pointer">browse files</span>
                </p>
                <p className="text-[11px] text-slate-400 mt-1">Supports JPG, PNG, or PDF up to 10MB</p>

                {fileName && (
                  <div className="inline-flex items-center gap-2 mt-3 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-medium">
                    <FileText className="w-3.5 h-3.5" />
                    <span>{fileName}</span>
                    <span className="text-slate-400">(2.4 MB ready)</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 text-xs">
              <p className="text-slate-600 dark:text-slate-300 text-xs">
                To comply with SEC investor protection rules, please specify your investment background and risk profile.
              </p>

              <div className="space-y-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Annual Household Income</label>
                  <select
                    value={formData.annualIncome}
                    onChange={(e) => setFormData({ ...formData, annualIncome: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  >
                    <option>&lt; $100,000</option>
                    <option>$100,000 - $200,000</option>
                    <option>$200,000 - $300,000 (SEC Accredited Threshold)</option>
                    <option>&gt; $300,000</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Liquid Net Worth (Excluding Primary Residence)</label>
                  <select
                    value={formData.netWorth}
                    onChange={(e) => setFormData({ ...formData, netWorth: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  >
                    <option>&lt; $250,000</option>
                    <option>$250,000 - $1,000,000</option>
                    <option>&gt; $1,000,000 (SEC Accredited Net Worth)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Primary Investment Horizon & Risk Tolerance</label>
                  <select
                    value={formData.riskTolerance}
                    onChange={(e) => setFormData({ ...formData, riskTolerance: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  >
                    <option>Conservative (Capital Preservation Focus)</option>
                    <option>Moderate Growth (Balanced Yield & Horizon)</option>
                    <option>Aggressive / Frontier (High Return Target)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/80 rounded-full flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                  Verification Approved!
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Your identity has been verified under SEC Regulation D & CF requirements.
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-left space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Assigned Investor Tier:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">Tier 1 Verified Investor</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Annual Investment Limit:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">$100,000 / Year</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">KYC Clearance ID:</span>
                  <span className="font-mono text-slate-900 dark:text-white">KYC-US-991823</span>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="w-full py-3 bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 text-white font-semibold rounded-xl text-sm transition-colors"
              >
                Return to Dashboard
              </button>
            </div>
          )}

          {/* Navigation Buttons for steps 1-3 */}
          {step < 4 && (
            <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800 mt-4">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 text-xs font-medium flex items-center gap-1 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back
                </button>
              ) : (
                <div />
              )}

              <button
                type="button"
                onClick={handleNext}
                disabled={isProcessing}
                className="px-5 py-2.5 bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-sm transition-all"
              >
                {isProcessing ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Verifying Identity...
                  </span>
                ) : (
                  <>
                    {step === 3 ? 'Submit Verification' : 'Continue'}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
