import React from 'react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden py-3xl px-gutter max-w-container-max mx-auto" id="home">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2xl items-center">
        <div>
          <span className="inline-flex items-center gap-2 px-md py-1.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm mb-lg shadow-sm">
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            AI-Powered Tax Regime Comparison
          </span>
          <h1 className="font-display-lg text-display-lg leading-tight mb-md">
            Find the Best Tax Regime & <span className="text-[#10B981]">Save More</span>
          </h1>
          <p className="text-body-lg text-on-surface-variant mb-xl max-w-xl">
            Optimize your financial future with our precise AI-driven calculator. Instantly compare Old vs. New tax regimes based on current Indian tax laws.
          </p>
          <div className="flex flex-wrap gap-md mb-2xl">
            <div className="flex items-center gap-2 px-md py-2 rounded-xl bg-surface-container border border-outline-variant/30">
              <span className="material-symbols-outlined text-primary">security</span>
              <span className="text-label-md font-label-md">Secure</span>
            </div>
            <div className="flex items-center gap-2 px-md py-2 rounded-xl bg-surface-container border border-outline-variant/30">
              <span className="material-symbols-outlined text-primary">psychology</span>
              <span className="text-label-md font-label-md">AI Calculations</span>
            </div>
            <div className="flex items-center gap-2 px-md py-2 rounded-xl bg-surface-container border border-outline-variant/30">
              <span className="material-symbols-outlined text-primary">bolt</span>
              <span className="text-label-md font-label-md">Instant Results</span>
            </div>
          </div>
          <a className="inline-flex items-center gap-2 px-xl sm:px-2xl py-md bg-primary text-on-primary rounded-full font-headline-md text-body-lg shadow-xl shadow-primary/25 hover:scale-[1.02] transition-transform" href="#calculator">
            Calculate Your Savings
            <span className="material-symbols-outlined">arrow_forward</span>
          </a>
        </div>
        <div className="relative">
          <div className="absolute inset-0 bg-primary/5 rounded-full blur-3xl -z-10"></div>
          <div className="w-full aspect-square max-w-md mx-auto bg-surface-container rounded-2xl border border-outline-variant/30 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary" style={{ fontSize: '120px' }}>insights</span>
          </div>
        </div>
      </div>
    </section>
  );
}
