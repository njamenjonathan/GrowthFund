import React from 'react';
import { GrowthFundLogo } from './GrowthFundLogo';
import { useApp } from '../context/AppContext';
import { ShieldCheck, AlertCircle, ExternalLink, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentPage } = useApp();

  const handleNavigate = (page: any) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 transition-colors pb-24 md:pb-16 pt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Col 1 & 2: Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <button onClick={() => handleNavigate('landing')} className="text-left">
              <GrowthFundLogo size="md" />
            </button>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400 max-w-sm">
              GrowthFund provides institutional-grade access to vetted alternative investments across clean energy, infrastructure, real estate, and frontier technologies with full transparency and verified due diligence.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-2">
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                256-Bit SSL Encrypted
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                Reg D & Reg CF Framework
              </span>
            </div>
          </div>

          {/* Col 3: Platform */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => handleNavigate('marketplace')} className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  Opportunities Marketplace
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigate('dashboard')} className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  Investor Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigate('marketplace')} className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  Clean Energy Offerings
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigate('marketplace')} className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  Commercial Real Estate
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Resources */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
              Company & Help
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => handleNavigate('about')} className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  About GrowthFund
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigate('help')} className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  Help Center & FAQs
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigate('help')} className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  Contact Support
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigate('compliance')} className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  Fee Schedule & Custody
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Compliance */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
              Compliance & Risk
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => handleNavigate('compliance')} className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  Risk Disclosure Policy
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigate('compliance')} className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigate('compliance')} className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  Privacy & Data Policy
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigate('compliance')} className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  Regulatory Disclosures
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal & Regulatory Disclaimer Box */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-6 space-y-3 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
          <div className="flex items-start gap-2 bg-slate-100/70 dark:bg-slate-900/70 p-3.5 rounded-lg border border-slate-200 dark:border-slate-800">
            <AlertCircle className="w-4 h-4 text-slate-600 dark:text-slate-400 shrink-0 mt-0.5" />
            <p>
              <strong>Important Regulatory Notice & Disclaimer:</strong> GrowthFund is a financial technology software platform, not a registered broker-dealer, funding portal, or investment adviser. Securities offerings presented on this website are private placements made pursuant to exemptions under the Securities Act of 1933, including Regulation D (Rule 506(c)) and Regulation Crowdfunding (Reg CF). None of the securities or investment opportunities listed have been recommended or approved by any federal or state securities commission or regulatory authority.
            </p>
          </div>

          <p>
            <strong>Illiquidity & Capital Loss:</strong> Investments in private offerings and private credit are speculative, illiquid, and carry a high degree of risk. Investors must be able to afford the complete loss of their invested capital. There is no active public trading market for these securities. Forward-looking return estimates and yield projections are target figures only based on assumptions that may not materialize. Past performance is not a guarantee of future outcomes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800 gap-2">
            <p>© 2024 GrowthFund. Capital at risk. GrowthFund is an informational investment platform prototype.</p>
            <div className="flex gap-4 text-xs font-medium">
              <button onClick={() => handleNavigate('compliance')} className="hover:underline">
                Terms
              </button>
              <span>•</span>
              <button onClick={() => handleNavigate('compliance')} className="hover:underline">
                Privacy
              </button>
              <span>•</span>
              <button onClick={() => handleNavigate('compliance')} className="hover:underline">
                Risk Disclosures
              </button>
              <span>•</span>
              <button onClick={() => handleNavigate('compliance')} className="hover:underline">
                Contact
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
