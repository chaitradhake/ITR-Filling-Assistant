import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-surface-container-low border-t border-outline-variant/30 text-on-surface-variant">
      <div className="max-w-container-max mx-auto px-gutter py-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2xl">
          {/* Column 1: Brand Info */}
          <div className="flex flex-col gap-md">
            <div className="flex items-center gap-2 text-headline-md font-bold text-primary">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary">
                <span className="material-symbols-outlined">account_balance</span>
              </div>
              <span className="tracking-tight">ITR Assistant</span>
            </div>
            <p className="text-body-sm leading-relaxed max-w-xs">
              Making Indian tax laws understandable and optimized for every taxpayer.
            </p>
            <div className="flex gap-sm">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-surface border border-outline-variant/30 flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary transition-all shadow-sm"
              >
                <span className="material-symbols-outlined text-lg">public</span>
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-surface border border-outline-variant/30 flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary transition-all shadow-sm"
              >
                <span className="material-symbols-outlined text-lg">alternate_email</span>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-on-surface font-semibold text-body-lg mb-lg">Quick Links</h3>
            <ul className="flex flex-col gap-sm">
              <li>
                <a href="#home" className="text-body-sm hover:text-primary transition-colors">Home</a>
              </li>
              <li>
                <a href="#calculator" className="text-body-sm hover:text-primary transition-colors">Tax Calculator</a>
              </li>
              <li>
                <a href="#how-it-works" className="text-body-sm hover:text-primary transition-colors">How It Works</a>
              </li>
              <li>
                <a href="#faq" className="text-body-sm hover:text-primary transition-colors">FAQ</a>
              </li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h3 className="text-on-surface font-semibold text-body-lg mb-lg">Company</h3>
            <ul className="flex flex-col gap-sm">
              <li>
                <a href="#" className="text-body-sm hover:text-primary transition-colors">About Us</a>
              </li>
              <li>
                <a href="#" className="text-body-sm hover:text-primary transition-colors">Terms of Service</a>
              </li>
              <li>
                <a href="#" className="text-body-sm hover:text-primary transition-colors">Privacy Policy</a>
              </li>
            </ul>
          </div>

          {/* Column 4: Resources */}
          <div>
            <h3 className="text-on-surface font-semibold text-body-lg mb-lg">Resources</h3>
            <ul className="flex flex-col gap-sm">
              <li>
                <a href="#" className="text-body-sm hover:text-primary transition-colors">Tax Slabs Guide</a>
              </li>
              <li>
                <a href="#" className="text-body-sm hover:text-primary transition-colors">Deduction Guide</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-outline-variant/30 mt-2xl pt-xl flex flex-col md:flex-row justify-between items-center gap-md text-xs text-on-surface-variant/80">
          <p>© 2026 ITR Assistant. Built as a learning project.</p>
          <p className="text-center md:text-right italic">
            This is a decision-support tool, not an official tax filing service.
          </p>
        </div>
      </div>
    </footer>
  );
}
