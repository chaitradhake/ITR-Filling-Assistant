import React from 'react';

export default function Navbar() {
  return (
    <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant/30 shadow-sm">
      <div className="flex justify-between items-center h-16 px-gutter max-w-container-max mx-auto">
        <div className="flex items-center gap-2 text-headline-md font-bold text-primary">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary">
            <span className="material-symbols-outlined">account_balance</span>
          </div>
          <span className="tracking-tight">ITR Assistant</span>
        </div>
        <nav className="hidden md:flex gap-lg items-center">
          <a className="text-primary font-bold border-b-2 border-primary py-1 font-label-md text-label-md" href="#home">Home</a>
          <a className="text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md" href="#how-it-works">How It Works</a>
          <a className="text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md" href="#calculator">Tax Comparison</a>
          <a className="text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md" href="#features">Features</a>
          <a className="text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md" href="#faq">FAQ</a>
        </nav>
        <div className="flex items-center gap-md">
          <button className="hidden sm:block text-primary font-label-md text-label-md px-md py-2 transition-all active:scale-95">Login</button>
          <button className="bg-primary text-on-primary px-lg py-2.5 rounded-full font-label-md text-label-md transition-all hover:opacity-90 active:scale-95 shadow-md shadow-primary/20">Get Started</button>
        </div>
      </div>
    </header>
  );
}
