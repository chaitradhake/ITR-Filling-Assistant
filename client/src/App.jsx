import { useEffect, useState } from 'react';
import TaxCalculator from './components/TaxCalculator.jsx';
import UploadForm16 from './components/UploadForm16.jsx';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import WhyChoose from './components/WhyChoose.jsx';
import HowItWorks from './components/HowItWorks.jsx';
import FAQ from './components/FAQ.jsx';

function App() {
  const [status, setStatus] = useState('Loading...');
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' or 'manual'

  useEffect(() => {
    fetch('/api/health')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => setStatus(data.status))
      .catch((err) => {
        console.error('Error fetching health status:', err);
        setStatus('Error connecting to server');
      });
  }, []);

  return (
    <div className="min-h-screen bg-surface-container-low/30 font-sans pt-16">
      <Navbar />
      <Hero />
      <WhyChoose />
      <HowItWorks />
      <FAQ />
      {/* Top Banner / Navbar */}
      <header className="border-b border-outline-variant/20 bg-surface-bright py-md shadow-sm">
        <div className="max-w-container-max mx-auto px-gutter flex justify-between items-center">
          <div className="flex items-center gap-sm">
            <span className="material-symbols-outlined text-primary text-3xl font-normal">account_balance_wallet</span>
            <h1 className="font-headline-md text-headline-md text-on-surface tracking-tight">ITR Assistant</h1>
          </div>
          <div className="flex items-center gap-xs text-body-sm">
            <span className={`h-2.5 w-2.5 rounded-full ${status === 'healthy' ? 'bg-green-500' : 'bg-amber-500 animate-pulse'}`}></span>
            <span className="text-on-surface-variant font-medium text-xs md:text-sm">Server status: {status}</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="py-2xl">
        <div className="max-w-container-max mx-auto px-gutter flex flex-col items-center">
          
          {/* Tab Selector Toggle */}
          <div className="bg-surface-container p-xs rounded-2xl flex items-center mb-xl shadow-sm border border-outline-variant/30">
            <button
              onClick={() => setActiveTab('upload')}
              className={`flex items-center gap-xs px-lg py-md rounded-xl font-semibold transition-all duration-200 ${
                activeTab === 'upload'
                  ? 'bg-primary text-white shadow-md shadow-primary/10'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-xl">upload_file</span>
              <span>Upload Form 16</span>
            </button>
            <button
              onClick={() => setActiveTab('manual')}
              className={`flex items-center gap-xs px-lg py-md rounded-xl font-semibold transition-all duration-200 ${
                activeTab === 'manual'
                  ? 'bg-primary text-white shadow-md shadow-primary/10'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-xl">edit_document</span>
              <span>Enter Details Manually</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="w-full">
            {activeTab === 'upload' ? (
              <UploadForm16 />
            ) : (
              <TaxCalculator />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
