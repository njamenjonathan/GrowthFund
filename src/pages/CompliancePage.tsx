import React from 'react';
import { ShieldCheck, AlertTriangle, Lock, FileText, Scale, CheckCircle2 } from 'lucide-react';

export const CompliancePage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 pb-24 text-slate-800 dark:text-slate-200">
      {/* Header */}
      <div className="space-y-3 border-b border-slate-200 dark:border-slate-800 pb-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
          Regulatory Disclosures & Legal Framework
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white font-display">
          Risk Disclosures, Custody & Compliance
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Last updated: October 2024. GrowthFund operates with radical transparency and strict adherence to U.S. federal securities laws.
        </p>
      </div>

      {/* Primary Risk Warning Callout */}
      <div className="bg-red-50 dark:bg-red-950/40 border-l-4 border-red-600 p-5 rounded-r-2xl text-xs sm:text-sm text-red-900 dark:text-red-300 space-y-2">
        <div className="flex items-center gap-2 font-bold text-red-800 dark:text-red-300">
          <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0" />
          <span>General Risk Notice & Non-Guarantee Statement</span>
        </div>
        <p className="leading-relaxed">
          Securities offered on the GrowthFund platform are private placements and not publicly traded. <strong>Investments are speculative and involve a substantial risk of loss, up to and including the entire loss of your principal investment.</strong> Projected returns, estimated annual yields, and internal rates of return (IRR) are forward-looking models based on assumptions and are never guaranteed. Past performance is no indicator of future results.
        </p>
      </div>

      {/* Section 1: Detailed Risk Factors */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Scale className="w-5 h-5 text-emerald-600" />
          1. Key Investment Risk Factors
        </h2>

        <div className="space-y-3 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-350">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-1">
            <h3 className="font-bold text-slate-900 dark:text-white">Illiquidity & Restriction on Transfer</h3>
            <p>
              Private market assets have no active secondary market. You will be required to hold your investment until the stated maturity horizon (typically 2 to 5 years). You may not be able to liquidate or transfer your holdings early.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-1">
            <h3 className="font-bold text-slate-900 dark:text-white">Forward-Looking Projections</h3>
            <p>
              All target yields (e.g. 8.5% - 12.0% p.a.) represent financial modeling by the respective project sponsor. Macroeconomic shifts, inflation, tenant defaults, grid curtailment, or equipment delays can cause actual cash flows to be lower than projected.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-1">
            <h3 className="font-bold text-slate-900 dark:text-white">Asset-Specific & Construction Risks</h3>
            <p>
              Offerings involving infrastructure, clean energy, or commercial construction face execution risks, permitting hurdles, weather disruptions, and supply chain constraints.
            </p>
          </div>
        </div>
      </section>

      {/* Section 2: SEC Regulatory Exemptions */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          2. Regulatory Framework (Reg D & Reg CF)
        </h2>
        <div className="text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-350 space-y-3">
          <p>
            Offerings listed on GrowthFund are conducted under specific exemptions from the registration requirements of Section 5 of the Securities Act of 1933:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Regulation Crowdfunding (Reg CF):</strong> Allows eligible non-accredited and accredited investors to participate in offerings subject to annual statutory investment limits calculated based on income and net worth.
            </li>
            <li>
              <strong>Regulation D (Rule 506(c)):</strong> Restricted to verified Accredited Investors who satisfy SEC net worth ($1M+ liquid) or income ($200k+ individual / $300k+ joint) requirements.
            </li>
          </ul>
        </div>
      </section>

      {/* Section 3: Custody & Escrow Account Architecture */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Lock className="w-5 h-5 text-emerald-600" />
          3. Independent Third-Party Escrow Custody
        </h2>
        <div className="text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-350 space-y-3">
          <p>
            GrowthFund does not take direct custody of investor funds. All committed capital is held in a segregated, FDIC-insured escrow account managed by a registered broker-dealer and qualified escrow custodian (such as North Capital Private Securities).
          </p>
          <p>
            Funds are only released to the project sponsor once the minimum offering threshold is achieved and all title/collateral documentation has been legally recorded. If an offering fails to meet its minimum target, 100% of investor funds are returned promptly without deduction of platform fees.
          </p>
        </div>
      </section>

      {/* Section 4: Transparent Fee Schedule */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-emerald-600" />
          4. Complete Platform Fee Schedule
        </h2>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden text-xs">
          <table className="w-full text-left divide-y divide-slate-200 dark:divide-slate-800">
            <thead className="bg-slate-50 dark:bg-slate-850 font-semibold text-slate-900 dark:text-white">
              <tr>
                <th className="p-3.5">Fee Category</th>
                <th className="p-3.5">Rate / Amount</th>
                <th className="p-3.5">Assessed On</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              <tr>
                <td className="p-3.5 font-medium">Investor Account Setup</td>
                <td className="p-3.5 text-emerald-600 font-bold">$0.00 (Free)</td>
                <td className="p-3.5 text-slate-500">Upon registration</td>
              </tr>
              <tr>
                <td className="p-3.5 font-medium">ACH Deposit & Withdrawal</td>
                <td className="p-3.5 text-emerald-600 font-bold">$0.00 (Free)</td>
                <td className="p-3.5 text-slate-500">Per bank transfer</td>
              </tr>
              <tr>
                <td className="p-3.5 font-medium">Platform Administration Fee</td>
                <td className="p-3.5 font-bold">0.50% p.a.</td>
                <td className="p-3.5 text-slate-500">Deducted from gross yield distributions</td>
              </tr>
              <tr>
                <td className="p-3.5 font-medium">Sponsor Listing Fee</td>
                <td className="p-3.5 font-bold">1.5% - 3.0%</td>
                <td className="p-3.5 text-slate-500">Paid directly by project sponsor upon closing</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
