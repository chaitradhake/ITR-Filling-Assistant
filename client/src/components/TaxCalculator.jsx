import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export default function TaxCalculator() {
  const { user, token } = useAuth();
  // Input fields state initialized completely empty
  const [income, setIncome] = useState('');
  const [section80C, setSection80C] = useState('');
  const [section80D, setSection80D] = useState('');
  const [hraExemption, setHraExemption] = useState('');
  const [otherDeductions, setOtherDeductions] = useState('');

  // Results state initialized to null
  const [results, setResults] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  const [saveLoading, setSaveLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');

  const handleSaveCalculation = async () => {
    if (!results) return;
    setSaveLoading(true);
    setSaveSuccess(false);
    setSaveError('');

    const payload = {
      income: Number(income) || 0,
      deductions: {
        section80C: Number(section80C) || 0,
        section80D: Number(section80D) || 0,
        hraExemption: Number(hraExemption) || 0,
        otherDeductions: Number(otherDeductions) || 0
      },
      oldRegimeTax: results.oldRegime.totalTax,
      newRegimeTax: results.newRegime.totalTax,
      recommendedRegime: results.recommendedRegime,
      savings: results.savings
    };

    try {
      let res;
      try {
        res = await fetch('http://localhost:5000/api/calculations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
      } catch (directErr) {
        console.warn('Direct save to http://localhost:5000 failed, trying local proxy fallback', directErr);
        res = await fetch('/api/calculations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
      }

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Save failed with status ${res.status}`);
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving calculation:', err);
      setSaveError(err.message || 'Failed to save calculation.');
    } finally {
      setSaveLoading(false);
    }
  };

  // Format currency in Indian Rupees format (en-IN)
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleCalculate = async (e) => {
    if (e) e.preventDefault();

    // Client-side validation
    const errors = {};
    if (income === '' || Number(income) <= 0 || isNaN(Number(income))) {
      errors.income = 'Please enter a valid income';
    }
    if (section80C !== '' && (Number(section80C) < 0 || isNaN(Number(section80C)))) {
      errors.section80C = 'Deduction cannot be negative';
    }
    if (section80D !== '' && (Number(section80D) < 0 || isNaN(Number(section80D)))) {
      errors.section80D = 'Deduction cannot be negative';
    }
    if (hraExemption !== '' && (Number(hraExemption) < 0 || isNaN(Number(hraExemption)))) {
      errors.hraExemption = 'Deduction cannot be negative';
    }
    if (otherDeductions !== '' && (Number(otherDeductions) < 0 || isNaN(Number(otherDeductions)))) {
      errors.otherDeductions = 'Deduction cannot be negative';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    // Clear validation errors if validation succeeds
    setValidationErrors({});
    setLoading(true);
    setError('');

    const payload = {
      income: Number(income) || 0,
      deductions: {
        section80C: Number(section80C) || 0,
        section80D: Number(section80D) || 0,
        hraExemption: Number(hraExemption) || 0,
        otherDeductions: Number(otherDeductions) || 0
      }
    };

    try {
      let res;
      try {
        // Try calling the direct backend API URL first as specified
        res = await fetch('http://localhost:5000/api/calculate-tax', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
      } catch (directErr) {
        console.warn('Direct connection to http://localhost:5000 failed, falling back to Vite proxy', directErr);
        // Transparent fallback to local proxy to circumvent CORS or networking blocks in different dev environments
        res = await fetch('/api/calculate-tax', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
      }

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to calculate tax from the server.');
      }

      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error('Calculation error:', err);
      setError(err.message || 'Unable to connect to the tax calculation server.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setIncome('');
    setSection80C('');
    setSection80D('');
    setHraExemption('');
    setOtherDeductions('');
    setValidationErrors({});
    setResults(null);
    setError('');
  };

  // Helper to download the tax comparison report as a text file
  const handleDownload = () => {
    if (!results) return;
    const reportText = `AI Tax Savings Calculator Report
======================================
Date: ${new Date().toLocaleDateString()}
Gross Annual Income: ${formatCurrency(income)}

Deductions & Exemptions (Old Regime):
- Section 80C: ${formatCurrency(section80C)}
- Section 80D: ${formatCurrency(section80D)}
- HRA Exemption: ${formatCurrency(hraExemption)}
- Other Deductions: ${formatCurrency(otherDeductions)}

Results Summary:
- Old Tax Regime Liability: ${formatCurrency(results.oldRegime.totalTax)}
- New Tax Regime Liability: ${formatCurrency(results.newRegime.totalTax)}
- Recommended Regime: ${results.recommendedRegime === 'new' ? 'New Tax Regime' : 'Old Tax Regime'}
- Total Potential Savings: ${formatCurrency(results.savings)}
======================================
Generated by AI Tax Filling Assistant.
`;
    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tax_calculation_report_${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <section className="py-3xl bg-surface-container-low/50" id="calculator">
      <div className="px-gutter max-w-container-max mx-auto">
        {/* Header */}
        <div className="text-center mb-2xl">
          <h2 className="font-headline-lg text-headline-lg mb-sm text-on-surface">AI Tax Savings Calculator</h2>
          <p className="text-on-surface-variant max-w-2xl mx-auto">
            Fill in your financial details below and let our AI determine which regime minimizes your tax burden for FY 2024-25.
          </p>
        </div>

        {/* Error message banner */}
        {error && (
          <div className="mb-lg p-md bg-red-50 border border-red-200 text-red-700 rounded-xl text-center flex items-center justify-center gap-sm">
            <span className="material-symbols-outlined">error</span>
            <span>{error}</span>
          </div>
        )}

        {/* Calculator Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg glass-card rounded-2xl p-lg md:p-xl shadow-xl">
          
          {/* Left Column: Form Details */}
          <form onSubmit={handleCalculate} noValidate className="lg:col-span-5 border-r border-outline-variant/30 pr-lg flex flex-col justify-between">
            <div>
              <div className="mb-xl">
                <h3 className="font-headline-md text-headline-md mb-xs text-on-surface">Enter Your Details</h3>
                <p className="text-body-sm text-on-surface-variant">Provide your income and deduction estimates.</p>
              </div>

              <div className="space-y-lg">
                <div>
                  <label className="block text-label-md font-label-md mb-2 text-on-surface">Gross Annual Income (₹)</label>
                  <input
                    className="w-full h-12 bg-surface-bright border border-outline-variant rounded-xl px-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    type="number"
                    value={income}
                    onChange={(e) => setIncome(e.target.value)}
                    placeholder="e.g. 1250000"
                    required
                    min="0"
                  />
                  {validationErrors.income && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.income}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
                  <div>
                    <label className="block text-label-md font-label-md mb-2 text-on-surface">Section 80C (₹)</label>
                    <input
                      className="w-full h-12 bg-surface-bright border border-outline-variant rounded-xl px-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      type="number"
                      value={section80C}
                      onChange={(e) => setSection80C(e.target.value)}
                      placeholder="e.g. 150000"
                      min="0"
                    />
                    {validationErrors.section80C && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.section80C}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-label-md font-label-md mb-2 text-on-surface">Section 80D (₹)</label>
                    <input
                      className="w-full h-12 bg-surface-bright border border-outline-variant rounded-xl px-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      type="number"
                      value={section80D}
                      onChange={(e) => setSection80D(e.target.value)}
                      placeholder="e.g. 25000"
                      min="0"
                    />
                    {validationErrors.section80D && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.section80D}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-label-md font-label-md mb-2 text-on-surface">HRA Exemption (₹)</label>
                  <input
                    className="w-full h-12 bg-surface-bright border border-outline-variant rounded-xl px-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    type="number"
                    value={hraExemption}
                    onChange={(e) => setHraExemption(e.target.value)}
                    placeholder="e.g. 120000"
                    min="0"
                  />
                  {validationErrors.hraExemption && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.hraExemption}</p>
                  )}
                </div>

                <div>
                  <label className="block text-label-md font-label-md mb-2 text-on-surface">Other Deductions (₹)</label>
                  <input
                    className="w-full h-12 bg-surface-bright border border-outline-variant rounded-xl px-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    type="number"
                    value={otherDeductions}
                    onChange={(e) => setOtherDeductions(e.target.value)}
                    placeholder="e.g. 20000"
                    min="0"
                  />
                  {validationErrors.otherDeductions && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.otherDeductions}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-md mt-xl">
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 bg-primary text-on-primary py-4 rounded-xl font-headline-md text-body-lg shadow-lg shadow-primary/20 hover:shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-sm ${loading ? 'opacity-80 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Calculating Tax...</span>
                  </>
                ) : (
                  'Calculate Tax'
                )}
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="flex-1 border border-outline-variant text-on-surface-variant hover:bg-surface-container-low py-4 rounded-xl font-headline-md text-body-lg transition-all active:scale-[0.98] flex items-center justify-center gap-sm cursor-pointer"
              >
                Reset
              </button>
            </div>
          </form>

          {/* Right Column: Tax Comparison Results */}
          <div className="lg:col-span-7 bg-surface-container rounded-2xl p-lg flex flex-col gap-lg">
            <div>
              <h3 className="font-headline-md text-headline-md mb-xs text-on-surface">Tax Comparison Results</h3>
              <p className="text-body-sm text-on-surface-variant">Here's a breakdown of your projected savings.</p>
            </div>

            {results ? (
              <>
                {/* Recommended Regime Banner */}
                <div className="bg-tertiary-fixed/30 border border-tertiary-fixed p-xl rounded-2xl text-center relative overflow-hidden group">
                  <div className="absolute -right-8 -top-8 w-24 h-24 bg-tertiary-fixed opacity-20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                  <span className="material-symbols-outlined text-tertiary-container text-4xl mb-md">verified</span>
                  <h4 className="font-headline-lg text-tertiary-container mb-2">
                    {results.recommendedRegime === 'new' ? 'New Tax Regime' : 'Old Tax Regime'}
                  </h4>
                  <p className="text-headline-md font-bold text-on-surface">
                    {results.savings > 0 ? (
                      <>
                        You Save <span className="text-[#10B981]">{formatCurrency(results.savings)}</span>
                      </>
                    ) : (
                      'Tax is identical under both regimes'
                    )}
                  </p>
                </div>

                {/* Old vs New Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-lg">
                  {/* Old Regime Card */}
                  <div className={`bg-surface-bright border p-lg rounded-2xl shadow-sm transition-all ${results.recommendedRegime === 'old' ? 'border-primary/20 ring-2 ring-primary/5' : 'border-outline-variant/30'}`}>
                    <span className={`text-label-sm font-label-sm uppercase tracking-wider ${results.recommendedRegime === 'old' ? 'text-primary' : 'text-on-surface-variant'}`}>
                      Old Regime
                    </span>
                    <div className="mt-md">
                      <p className="text-body-sm text-on-surface-variant">Total Tax Liability</p>
                      <p className={`text-headline-md font-bold ${results.recommendedRegime === 'old' ? 'text-primary' : 'text-on-surface'}`}>
                        {formatCurrency(results.oldRegime.totalTax)}
                      </p>
                    </div>
                  </div>

                  {/* New Regime Card */}
                  <div className={`bg-surface-bright border p-lg rounded-2xl shadow-sm transition-all ${results.recommendedRegime === 'new' ? 'border-primary/20 ring-2 ring-primary/5' : 'border-outline-variant/30'}`}>
                    <span className={`text-label-sm font-label-sm uppercase tracking-wider ${results.recommendedRegime === 'new' ? 'text-primary' : 'text-on-surface-variant'}`}>
                      New Regime
                    </span>
                    <div className="mt-md">
                      <p className="text-body-sm text-on-surface-variant">Total Tax Liability</p>
                      <p className={`text-headline-md font-bold ${results.recommendedRegime === 'new' ? 'text-primary' : 'text-on-surface'}`}>
                        {formatCurrency(results.newRegime.totalTax)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bottom Savings Banner */}
                <div className="bg-[#10B981] p-lg rounded-2xl text-white flex justify-between items-center mt-auto">
                  <div>
                    <p className="text-sm opacity-90">Total Potential Savings</p>
                    <p className="text-headline-lg font-bold">{formatCurrency(results.savings)}</p>
                  </div>
                  <div className="flex items-center gap-sm">
                    {user && (
                      <>
                        {saveError && (
                          <span className="text-xs text-red-200 bg-red-900/40 px-sm py-1.5 rounded-lg max-w-[150px] truncate" title={saveError}>
                            {saveError}
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={handleSaveCalculation}
                          disabled={saveLoading}
                          className={`px-md py-2 rounded-xl text-sm font-semibold transition-all border border-white/20 active:scale-95 flex items-center gap-xs cursor-pointer ${
                            saveSuccess
                              ? 'bg-white text-[#10B981] border-white'
                              : 'bg-white/20 hover:bg-white/30 text-white'
                          }`}
                        >
                          <span className="material-symbols-outlined text-lg">
                            {saveSuccess ? 'check_circle' : 'save'}
                          </span>
                          <span>{saveLoading ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save Calculation'}</span>
                        </button>
                      </>
                    )}
                    <button
                      type="button"
                      onClick={handleDownload}
                      title="Download Tax Summary"
                      className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors flex items-center justify-center cursor-pointer"
                    >
                      <span className="material-symbols-outlined">download</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-xl border-2 border-dashed border-outline-variant/30 rounded-2xl bg-surface-bright/50">
                <span className="material-symbols-outlined text-primary/40 text-5xl mb-md">calculate</span>
                <p className="text-body-lg font-medium text-on-surface mb-xs">Awaiting Calculation</p>
                <p className="text-body-sm text-on-surface-variant max-w-sm">
                  Enter your details and click Calculate Tax to see your comparison.
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
