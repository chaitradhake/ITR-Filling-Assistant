import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export default function UploadForm16() {
  const { user, token } = useAuth();
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [extractionError, setExtractionError] = useState('');
  const [extractedData, setExtractedData] = useState(null);
  const fileInputRef = useRef(null);

  // Editable form state initialized empty
  const [formData, setFormData] = useState({
    grossSalary: '',
    tdsDeducted: '',
    section80C: '',
    section80D: '',
    hraExemption: '',
    otherDeductions: ''
  });

  // Calculation states
  const [calcLoading, setCalcLoading] = useState(false);
  const [calcResults, setCalcResults] = useState(null);
  const [calcError, setCalcError] = useState('');

  const [saveLoading, setSaveLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');

  const handleSaveCalculation = async () => {
    if (!calcResults) return;
    setSaveLoading(true);
    setSaveSuccess(false);
    setSaveError('');

    const payload = {
      income: Number(formData.grossSalary) || 0,
      deductions: {
        section80C: Number(formData.section80C) || 0,
        section80D: Number(formData.section80D) || 0,
        hraExemption: Number(formData.hraExemption) || 0,
        otherDeductions: Number(formData.otherDeductions) || 0
      },
      oldRegimeTax: calcResults.oldRegime.totalTax,
      newRegimeTax: calcResults.newRegime.totalTax,
      recommendedRegime: calcResults.recommendedRegime,
      savings: calcResults.savings
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

  // Helper to format currency in Indian Rupees (INR)
  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const allowedExtensions = ['.pdf', '.jpg', '.jpeg', '.png'];

  const validateAndSetFile = (selectedFile) => {
    if (!selectedFile) return;

    const fileName = selectedFile.name.toLowerCase();
    const isValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext));
    
    // Also check mime types to be robust
    const allowedMimeTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    const isValidMime = allowedMimeTypes.includes(selectedFile.type);

    if (!isValidExtension && !isValidMime) {
      setError('Invalid file type. Only PDF, JPG, and PNG files are allowed.');
      setFile(null);
      return false;
    }

    setFile(selectedFile);
    setError('');
    setExtractionError('');
    setExtractedData(null);
    setCalcResults(null);
    setCalcError('');
    return true;
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleReset = () => {
    setFile(null);
    setDragActive(false);
    setLoading(false);
    setError('');
    setExtractionError('');
    setExtractedData(null);
    setFormData({
      grossSalary: '',
      tdsDeducted: '',
      section80C: '',
      section80D: '',
      hraExemption: '',
      otherDeductions: ''
    });
    setCalcLoading(false);
    setCalcResults(null);
    setCalcError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    setCalcLoading(true);
    setCalcError('');
    setCalcResults(null);

    const payload = {
      income: Number(formData.grossSalary) || 0,
      deductions: {
        section80C: Number(formData.section80C) || 0,
        section80D: Number(formData.section80D) || 0,
        hraExemption: Number(formData.hraExemption) || 0,
        otherDeductions: Number(formData.otherDeductions) || 0
      }
    };

    try {
      let response;
      try {
        // Try direct call as required
        response = await fetch('http://localhost:5000/api/calculate-tax', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
      } catch (directErr) {
        console.warn('Direct calculation to http://localhost:5000 failed, trying Vite proxy fallback', directErr);
        // Fallback to proxy
        response = await fetch('/api/calculate-tax', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Calculation failed with status ${response.status}`);
      }

      const data = await response.json();
      setCalcResults(data);
    } catch (err) {
      console.error('Calculation API error:', err);
      setCalcError(err.message || 'An error occurred while calculating tax. Please check your connection and try again.');
    } finally {
      setCalcLoading(false);
    }
  };

  const handleDownload = () => {
    if (!calcResults) return;
    const reportText = `AI Tax Savings Calculator Report (From Form 16)
======================================
Date: ${new Date().toLocaleDateString()}
Gross Annual Income: ${formatCurrency(formData.grossSalary)}

Deductions & Exemptions (Old Regime):
- Section 80C: ${formatCurrency(formData.section80C)}
- Section 80D: ${formatCurrency(formData.section80D)}
- HRA Exemption: ${formatCurrency(formData.hraExemption)}
- Other Deductions: ${formatCurrency(formData.otherDeductions)}

Results Summary:
- Old Tax Regime Liability: ${formatCurrency(calcResults.oldRegime.totalTax)}
- New Tax Regime Liability: ${formatCurrency(calcResults.newRegime.totalTax)}
- Recommended Regime: ${calcResults.recommendedRegime === 'new' ? 'New Tax Regime' : 'Old Tax Regime'}
- Total Potential Savings: ${formatCurrency(calcResults.savings)}
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

  const handleUploadAndExtract = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError('');
    setExtractionError('');
    setExtractedData(null);
    setCalcResults(null);
    setCalcError('');

    const formDataObj = new FormData();
    formDataObj.append('form16', file);

    try {
      let response;
      try {
        // Try direct call as required
        response = await fetch('http://localhost:5000/api/upload', {
          method: 'POST',
          body: formDataObj,
        });
      } catch (directErr) {
        console.warn('Direct upload to http://localhost:5000 failed, trying Vite proxy fallback', directErr);
        // Fallback to proxy
        response = await fetch('/api/upload', {
          method: 'POST',
          body: formDataObj,
        });
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Upload failed with status ${response.status}`);
      }

      const data = await response.json();

      if (data.extractionError) {
        setExtractionError('We uploaded your file but couldn\'t extract the data automatically. Please enter your details manually.');
      } else if (data.extractedData) {
        setExtractedData(data.extractedData);
        // Pre-fill editable form state with extracted values
        setFormData({
          grossSalary: data.extractedData.grossSalary ?? 0,
          tdsDeducted: data.extractedData.tdsDeducted ?? 0,
          section80C: data.extractedData.section80C ?? 0,
          section80D: data.extractedData.section80D ?? 0,
          hraExemption: data.extractedData.hraExemption ?? 0,
          otherDeductions: data.extractedData.otherDeductions ?? 0
        });
      } else {
        throw new Error('Invalid response structure from server.');
      }
    } catch (err) {
      console.error('File upload error:', err);
      setError(err.message || 'An error occurred during file upload. Please check your network connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-lg">
      <div className="glass-card rounded-2xl p-lg md:p-xl shadow-xl bg-surface-bright border border-outline-variant/30">
        
        {/* Header */}
        <div className="text-center mb-xl">
          <h3 className="font-headline-md text-headline-md mb-xs text-on-surface flex items-center justify-center gap-sm">
            <span className="material-symbols-outlined text-primary text-3xl">upload_file</span>
            Upload Form 16
          </h3>
          <p className="text-body-sm text-on-surface-variant">
            Upload your Form 16 (PDF or Image) to automatically extract your income tax details.
          </p>
        </div>

        {/* Error Messages */}
        {error && (
          <div className="mb-lg p-md bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-start gap-sm text-body-sm">
            <span className="material-symbols-outlined shrink-0 text-red-500">error</span>
            <div className="flex-1">
              <span className="font-semibold block mb-0.5">Upload Error</span>
              {error}
            </div>
          </div>
        )}

        {extractionError && (
          <div className="mb-lg p-md bg-amber-50 border border-amber-200 text-amber-800 rounded-xl flex items-start gap-sm text-body-sm">
            <span className="material-symbols-outlined shrink-0 text-amber-600">warning</span>
            <div className="flex-1">
              <span className="font-semibold block mb-0.5">Extraction Warning</span>
              {extractionError}
            </div>
          </div>
        )}

        {/* Upload Form Section */}
        <form onSubmit={handleUploadAndExtract} className="space-y-lg">
          
          {/* File Input Element */}
          <input
            ref={fileInputRef}
            type="file"
            id="form16-file-input"
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png,image/png,image/jpeg,application/pdf"
            onChange={handleChange}
            disabled={loading}
          />

          {/* Drag & Drop Area */}
          {!file ? (
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={onButtonClick}
              className={`flex flex-col items-center justify-center p-xl border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-200 bg-surface-container ${
                dragActive 
                  ? 'border-primary bg-primary/5 scale-[0.99]' 
                  : 'border-outline-variant/60 hover:border-primary/50'
              }`}
            >
              <div className="flex flex-col items-center text-center space-y-md">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-4xl">cloud_upload</span>
                </div>
                <div>
                  <p className="text-body-lg font-medium text-on-surface">
                    Drag and drop your file here
                  </p>
                  <p className="text-body-sm text-on-surface-variant mt-xs">
                    or <span className="text-primary font-semibold hover:underline">browse your files</span>
                  </p>
                </div>
                <div className="text-xs text-outline font-medium tracking-wide">
                  PDF, JPG, JPEG, or PNG (MAX. 5MB)
                </div>
              </div>
            </div>
          ) : (
            /* Selected File Info Card */
            <div className="p-lg border border-outline-variant/60 bg-surface-container-low rounded-2xl flex items-center justify-between shadow-sm">
              <div className="flex items-center space-x-md min-w-0">
                <div className="p-sm bg-primary/10 text-primary rounded-xl shrink-0">
                  <span className="material-symbols-outlined text-2xl">
                    {file.name.toLowerCase().endsWith('.pdf') ? 'picture_as_pdf' : 'image'}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-body-sm font-semibold text-on-surface truncate pr-2">
                    {file.name}
                  </p>
                  <p className="text-xs text-on-surface-variant font-medium mt-0.5">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
              
              {!loading && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="p-xs text-on-surface-variant hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Remove file"
                >
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              )}
            </div>
          )}

          {/* Action Buttons */}
          {file && (
            <div className="flex flex-col sm:flex-row gap-md pt-sm">
              <button
                type="submit"
                disabled={loading || calcLoading}
                className="flex-1 h-12 bg-primary hover:bg-primary-container disabled:bg-primary/50 text-white font-semibold rounded-2xl flex items-center justify-center gap-sm transition-colors shadow-md shadow-primary/10"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Extracting data...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-xl">cognition</span>
                    <span>Upload & Extract</span>
                  </>
                )}
              </button>

              {!loading && (
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={calcLoading}
                  className="h-12 px-lg border border-outline hover:bg-surface-container-low text-on-surface font-semibold rounded-2xl transition-colors disabled:opacity-50"
                >
                  Choose different file
                </button>
              )}
            </div>
          )}
        </form>

        {/* Editable Review Form */}
        {extractedData && (
          <div className="mt-xl border-t border-outline-variant/30 pt-lg space-y-md">
            <div>
              <h4 className="font-headline-md text-headline-md text-on-surface flex items-center gap-sm">
                <span className="material-symbols-outlined text-green-600 text-2xl">check_circle</span>
                Review Your Information
              </h4>
              <p className="text-body-sm text-on-surface-variant mt-xs">
                We've extracted these details from your Form 16. Please review and correct anything if needed.
              </p>
            </div>

            {/* Small Info Note */}
            <div className="p-md bg-surface-container-low border border-outline-variant/30 rounded-xl flex items-start gap-sm text-body-sm text-on-surface-variant">
              <span className="material-symbols-outlined text-primary shrink-0">info</span>
              <span>Please double-check these values before proceeding — automated extraction can occasionally misread documents.</span>
            </div>

            {/* Calculation Error Message */}
            {calcError && (
              <div className="p-md bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-start gap-sm text-body-sm">
                <span className="material-symbols-outlined shrink-0 text-red-500">error</span>
                <div className="flex-1">
                  <span className="font-semibold block mb-0.5">Calculation Error</span>
                  {calcError}
                </div>
              </div>
            )}

            <form onSubmit={handleConfirm} className="space-y-lg mt-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                {/* Gross Salary */}
                <div>
                  <label className="block text-label-md font-label-md mb-2 text-on-surface">Gross Salary (₹)</label>
                  <input
                    type="number"
                    className="w-full h-12 bg-surface-bright border border-outline-variant rounded-xl px-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    value={formData.grossSalary}
                    onChange={(e) => handleInputChange('grossSalary', e.target.value)}
                    placeholder="e.g. 800000"
                    min="0"
                    required
                    disabled={calcLoading}
                  />
                </div>

                {/* TDS Deducted */}
                <div>
                  <label className="block text-label-md font-label-md mb-2 text-on-surface">TDS Deducted (₹)</label>
                  <input
                    type="number"
                    className="w-full h-12 bg-surface-bright border border-outline-variant rounded-xl px-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    value={formData.tdsDeducted}
                    onChange={(e) => handleInputChange('tdsDeducted', e.target.value)}
                    placeholder="e.g. 45000"
                    min="0"
                    required
                    disabled={calcLoading}
                  />
                </div>

                {/* Section 80C */}
                <div>
                  <label className="block text-label-md font-label-md mb-2 text-on-surface">Section 80C Deduction (₹)</label>
                  <input
                    type="number"
                    className="w-full h-12 bg-surface-bright border border-outline-variant rounded-xl px-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    value={formData.section80C}
                    onChange={(e) => handleInputChange('section80C', e.target.value)}
                    placeholder="e.g. 150000"
                    min="0"
                    required
                    disabled={calcLoading}
                  />
                </div>

                {/* Section 80D */}
                <div>
                  <label className="block text-label-md font-label-md mb-2 text-on-surface">Section 80D Deduction (₹)</label>
                  <input
                    type="number"
                    className="w-full h-12 bg-surface-bright border border-outline-variant rounded-xl px-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    value={formData.section80D}
                    onChange={(e) => handleInputChange('section80D', e.target.value)}
                    placeholder="e.g. 25000"
                    min="0"
                    required
                    disabled={calcLoading}
                  />
                </div>

                {/* HRA Exemption */}
                <div>
                  <label className="block text-label-md font-label-md mb-2 text-on-surface">HRA Exemption (₹)</label>
                  <input
                    type="number"
                    className="w-full h-12 bg-surface-bright border border-outline-variant rounded-xl px-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    value={formData.hraExemption}
                    onChange={(e) => handleInputChange('hraExemption', e.target.value)}
                    placeholder="e.g. 50000"
                    min="0"
                    required
                    disabled={calcLoading}
                  />
                </div>

                {/* Other Deductions */}
                <div>
                  <label className="block text-label-md font-label-md mb-2 text-on-surface">Other Deductions (Chapter VI-A) (₹)</label>
                  <input
                    type="number"
                    className="w-full h-12 bg-surface-bright border border-outline-variant rounded-xl px-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    value={formData.otherDeductions}
                    onChange={(e) => handleInputChange('otherDeductions', e.target.value)}
                    placeholder="e.g. 10000"
                    min="0"
                    required
                    disabled={calcLoading}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={calcLoading}
                className="w-full h-12 bg-primary hover:bg-primary-container disabled:bg-primary/50 text-white font-semibold rounded-2xl flex items-center justify-center gap-sm transition-colors shadow-md shadow-primary/10 mt-lg"
              >
                {calcLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Calculating...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-xl font-normal">task_alt</span>
                    <span>Confirm & Calculate Tax</span>
                  </>
                )}
              </button>
            </form>

            {/* Tax Comparison Results */}
            {calcResults && (
              <div className="mt-xl border-t border-outline-variant/30 pt-lg space-y-lg">
                <div>
                  <h3 className="font-headline-md text-headline-md mb-xs text-on-surface">Tax Comparison Results</h3>
                  <p className="text-body-sm text-on-surface-variant">Here's a breakdown of your projected savings.</p>
                </div>

                {/* Recommended Regime Banner */}
                <div className="bg-tertiary-fixed/30 border border-tertiary-fixed p-xl rounded-2xl text-center relative overflow-hidden group">
                  <div className="absolute -right-8 -top-8 w-24 h-24 bg-tertiary-fixed opacity-20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                  <span className="material-symbols-outlined text-tertiary-container text-4xl mb-md">verified</span>
                  <h4 className="font-headline-lg text-tertiary-container mb-2">
                    {calcResults.recommendedRegime === 'new' ? 'New Tax Regime' : 'Old Tax Regime'}
                  </h4>
                  <p className="text-headline-md font-bold text-on-surface">
                    {calcResults.savings > 0 ? (
                      <>
                        You Save <span className="text-[#10B981]">{formatCurrency(calcResults.savings)}</span>
                      </>
                    ) : (
                      'Tax is identical under both regimes'
                    )}
                  </p>
                </div>

                {/* Old vs New Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-lg">
                  {/* Old Regime Card */}
                  <div className={`bg-surface-bright border p-lg rounded-2xl shadow-sm transition-all ${calcResults.recommendedRegime === 'old' ? 'border-primary/20 ring-2 ring-primary/5' : 'border-outline-variant/30'}`}>
                    <span className={`text-label-sm font-label-sm uppercase tracking-wider ${calcResults.recommendedRegime === 'old' ? 'text-primary' : 'text-on-surface-variant'}`}>
                      Old Regime
                    </span>
                    <div className="mt-md">
                      <p className="text-body-sm text-on-surface-variant">Total Tax Liability</p>
                      <p className={`text-headline-md font-bold ${calcResults.recommendedRegime === 'old' ? 'text-primary' : 'text-on-surface'}`}>
                        {formatCurrency(calcResults.oldRegime.totalTax)}
                      </p>
                    </div>
                  </div>

                  {/* New Regime Card */}
                  <div className={`bg-surface-bright border p-lg rounded-2xl shadow-sm transition-all ${calcResults.recommendedRegime === 'new' ? 'border-primary/20 ring-2 ring-primary/5' : 'border-outline-variant/30'}`}>
                    <span className={`text-label-sm font-label-sm uppercase tracking-wider ${calcResults.recommendedRegime === 'new' ? 'text-primary' : 'text-on-surface-variant'}`}>
                      New Regime
                    </span>
                    <div className="mt-md">
                      <p className="text-body-sm text-on-surface-variant">Total Tax Liability</p>
                      <p className={`text-headline-md font-bold ${calcResults.recommendedRegime === 'new' ? 'text-primary' : 'text-on-surface'}`}>
                        {formatCurrency(calcResults.newRegime.totalTax)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bottom Savings Banner */}
                <div className="bg-[#10B981] p-lg rounded-2xl text-white flex justify-between items-center">
                  <div>
                    <p className="text-sm opacity-90">Total Potential Savings</p>
                    <p className="text-headline-lg font-bold">{formatCurrency(calcResults.savings)}</p>
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
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
