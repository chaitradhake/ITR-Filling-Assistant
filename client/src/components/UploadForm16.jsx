import { useState, useRef } from 'react';

export default function UploadForm16() {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [extractionError, setExtractionError] = useState('');
  const [extractedData, setExtractedData] = useState(null);
  const fileInputRef = useRef(null);

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
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUploadAndExtract = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError('');
    setExtractionError('');
    setExtractedData(null);

    const formData = new FormData();
    formData.append('form16', file);

    try {
      let response;
      try {
        // Try direct call as required
        response = await fetch('http://localhost:5000/api/upload', {
          method: 'POST',
          body: formData,
        });
      } catch (directErr) {
        console.warn('Direct upload to http://localhost:5000 failed, trying Vite proxy fallback', directErr);
        // Fallback to proxy
        response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
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

  // Nice friendly label names for the extracted keys
  const fieldLabels = {
    grossSalary: 'Gross Salary',
    tdsDeducted: 'TDS Deducted',
    section80C: 'Section 80C Deduction',
    section80D: 'Section 80D Deduction',
    hraExemption: 'HRA Exemption',
    otherDeductions: 'Other Deductions (Chapter VI-A)'
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
                disabled={loading}
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
                  className="h-12 px-lg border border-outline hover:bg-surface-container-low text-on-surface font-semibold rounded-2xl transition-colors"
                >
                  Choose different file
                </button>
              )}
            </div>
          )}
        </form>

        {/* Temporary Extracted Data List */}
        {extractedData && (
          <div className="mt-xl border-t border-outline-variant/30 pt-lg space-y-md">
            <div>
              <h4 className="text-body-lg font-semibold text-on-surface flex items-center gap-xs">
                <span className="material-symbols-outlined text-green-600 text-xl">check_circle</span>
                Extracted Information
              </h4>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Below is the raw extracted data from your Form 16.
              </p>
            </div>

            <div className="bg-surface-container rounded-2xl p-md border border-outline-variant/40 divide-y divide-outline-variant/30">
              {Object.entries(fieldLabels).map(([key, label]) => {
                const val = extractedData[key];
                return (
                  <div key={key} className="flex justify-between py-sm text-body-sm first:pt-0 last:pb-0">
                    <span className="text-on-surface-variant font-medium">{label}</span>
                    <span className="text-on-surface font-semibold text-right">
                      {formatCurrency(val)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
