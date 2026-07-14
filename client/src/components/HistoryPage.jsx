import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export default function HistoryPage() {
  const { user, token } = useAuth();
  const [calculations, setCalculations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Helper to format currency in Indian Rupees (INR)
  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Helper to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  useEffect(() => {
    if (!user || !token) return;

    const fetchCalculations = async () => {
      setLoading(true);
      setError('');
      try {
        let res;
        try {
          res = await fetch(`${import.meta.env.VITE_API_URL}/api/calculations`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
        } catch (directErr) {
          console.warn(`Direct fetch to ${import.meta.env.VITE_API_URL} failed, trying proxy fallback`, directErr);
          res = await fetch('/api/calculations', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
        }

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.error || `Failed to fetch history (status ${res.status})`);
        }

        const data = await res.json();
        setCalculations(data);
      } catch (err) {
        console.error('Error fetching history:', err);
        if (err.name === 'TypeError' || err.message?.includes('fetch') || err.message?.includes('NetworkError') || err.message?.includes('Failed to fetch')) {
          setError('Unable to connect to the server. Please try again later.');
        } else {
          setError(err.message || 'Unable to connect to the server.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCalculations();
  }, [user, token]);

  if (!user) {
    return (
      <section className="py-3xl bg-surface-container-low/50 min-h-[calc(100vh-4rem)] flex items-center">
        <div className="px-gutter max-w-md mx-auto w-full">
          <div className="glass-card rounded-2xl p-lg md:p-xl shadow-xl border border-outline-variant/30 text-center flex flex-col items-center gap-md">
            <span className="material-symbols-outlined text-primary text-5xl font-normal bg-primary/10 p-md rounded-full">
              lock
            </span>
            <h2 className="font-headline-md text-headline-md text-on-surface">Access Denied</h2>
            <p className="text-on-surface-variant">
              Please log in to view your saved calculations.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-3xl bg-surface-container-low/50 min-h-[calc(100vh-4rem)]">
      <div className="px-gutter max-w-4xl mx-auto w-full">
        <div className="mb-xl text-center md:text-left">
          <h2 className="font-headline-lg text-headline-lg mb-xs text-on-surface">Saved Calculations</h2>
          <p className="text-body-sm text-on-surface-variant">Here is a record of your previously saved tax regime comparisons.</p>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-3xl text-primary gap-sm">
            <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="font-medium text-body-sm text-on-surface-variant">Loading calculations...</span>
          </div>
        )}

        {error && (
          <div className="p-md bg-red-50 border border-red-200 text-red-700 rounded-xl text-center flex items-center justify-center gap-sm text-body-sm mb-lg">
            <span className="material-symbols-outlined text-xl">error</span>
            <span>{error}</span>
          </div>
        )}

        {!loading && !error && calculations.length === 0 && (
          <div className="glass-card rounded-2xl p-xl shadow-sm border border-outline-variant/30 text-center flex flex-col items-center gap-md bg-surface-bright/50">
            <span className="material-symbols-outlined text-primary/40 text-5xl bg-primary/5 p-md rounded-full">
              history
            </span>
            <p className="text-body-lg font-medium text-on-surface">No saved calculations yet.</p>
            <p className="text-body-sm text-on-surface-variant max-w-sm">
              Use the tax calculator or upload your Form 16, and click "Save Calculation" to record your results.
            </p>
          </div>
        )}

        {!loading && !error && calculations.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
            {calculations.map((calc) => (
              <div 
                key={calc._id}
                className="glass-card border border-outline-variant/30 rounded-2xl p-lg shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between bg-surface-bright"
              >
                <div>
                  <div className="flex justify-between items-start mb-md pb-xs border-b border-outline-variant/10">
                    <span className="text-xs text-on-surface-variant font-medium">
                      {formatDate(calc.createdAt)}
                    </span>
                    <span className={`text-xs px-sm py-1 rounded-full font-bold uppercase tracking-wider ${
                      calc.recommendedRegime === 'new' 
                        ? 'bg-tertiary-fixed text-on-tertiary-fixed font-semibold' 
                        : 'bg-primary-container/20 text-primary-container font-semibold'
                    }`}>
                      {calc.recommendedRegime === 'new' ? 'New Regime' : 'Old Regime'}
                    </span>
                  </div>

                  <div className="space-y-sm">
                    <div className="flex justify-between">
                      <span className="text-body-sm text-on-surface-variant">Gross Income</span>
                      <span className="text-body-sm font-semibold text-on-surface">
                        {formatCurrency(calc.income)}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-body-sm text-on-surface-variant">Old Regime Tax</span>
                      <span className="text-body-sm text-on-surface">
                        {formatCurrency(calc.oldRegimeTax)}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-body-sm text-on-surface-variant">New Regime Tax</span>
                      <span className="text-body-sm text-on-surface">
                        {formatCurrency(calc.newRegimeTax)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-lg pt-md border-t border-outline-variant/20 flex justify-between items-center bg-surface-container-low/50 -mx-lg -mb-lg p-lg rounded-b-2xl">
                  <div>
                    <p className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">Recommended Savings</p>
                    <p className="text-headline-md font-bold text-emerald-600">
                      {formatCurrency(calc.savings)}
                    </p>
                  </div>
                  <span className="material-symbols-outlined text-emerald-600 text-2xl">
                    trending_down
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
