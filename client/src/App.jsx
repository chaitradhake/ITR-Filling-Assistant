import { useEffect, useState } from 'react';
import TaxCalculator from './components/TaxCalculator.jsx';
import UploadForm16 from './components/UploadForm16.jsx';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import WhyChoose from './components/WhyChoose.jsx';
import HowItWorks from './components/HowItWorks.jsx';
import FAQ from './components/FAQ.jsx';
import CtaBanner from './components/CtaBanner.jsx';
import Footer from './components/Footer.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import SignupPage from './components/SignupPage.jsx';
import LoginPage from './components/LoginPage.jsx';
import HistoryPage from './components/HistoryPage.jsx';

function AppContent() {
  const [status, setStatus] = useState('Loading...');
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' or 'manual'
  const [view, setView] = useState('main'); // 'main', 'login', or 'signup'

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
      <Navbar 
        onShowLogin={() => setView('login')}
        onShowSignup={() => setView('signup')}
        onShowMain={() => setView('main')}
        onShowHistory={() => setView('history')}
      />
      
      {view === 'login' ? (
        <LoginPage 
          onSwitchToSignup={() => setView('signup')} 
          onLoginSuccess={() => setView('main')} 
        />
      ) : view === 'signup' ? (
        <SignupPage 
          onSwitchToLogin={() => setView('login')} 
        />
      ) : view === 'history' ? (
        <HistoryPage />
      ) : (
        <>
          <Hero />
          <WhyChoose />
          <HowItWorks />

          {/* Top Banner / Navbar */}
          <header className="border-b border-outline-variant/20 bg-surface-bright py-md shadow-sm">
            <div className="max-w-container-max mx-auto px-gutter flex justify-between items-center gap-md">
              <div className="flex items-center gap-sm">
                <span className="material-symbols-outlined text-primary text-3xl font-normal">account_balance_wallet</span>
                <h1 className="font-headline-md text-headline-md text-on-surface tracking-tight">ITR Assistant</h1>
              </div>
              <div className="flex items-center gap-xs text-body-sm min-w-0">
                <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${status === 'healthy' ? 'bg-green-500' : 'bg-amber-500 animate-pulse'}`}></span>
                <span className="text-on-surface-variant font-medium text-xs md:text-sm truncate">
                  <span className="hidden sm:inline">Server status: </span>{status}
                </span>
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main id="calculator" className="py-2xl">
            <div className="max-w-container-max mx-auto px-gutter flex flex-col items-center">
              
              {/* Tab Selector Toggle */}
              <div className="bg-surface-container p-xs rounded-2xl flex flex-col sm:flex-row items-stretch sm:items-center w-full sm:w-auto mb-xl shadow-sm border border-outline-variant/30">
                <button
                  onClick={() => setActiveTab('upload')}
                  className={`flex items-center justify-center gap-xs px-md sm:px-lg py-md rounded-xl font-semibold transition-all duration-200 w-full sm:w-auto ${
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
                  className={`flex items-center justify-center gap-xs px-md sm:px-lg py-md rounded-xl font-semibold transition-all duration-200 w-full sm:w-auto ${
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
          <FAQ />
          <CtaBanner />
        </>
      )}
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
