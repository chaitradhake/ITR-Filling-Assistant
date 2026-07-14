import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar({ onShowLogin, onShowSignup, onShowMain, onShowHistory }) {
  const { user, logout } = useAuth();

  return (
    <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant/30 shadow-sm">
      <div className="flex justify-between items-center h-16 px-gutter max-w-container-max mx-auto">
        <div 
          onClick={onShowMain}
          className="flex items-center gap-2 text-headline-md font-bold text-primary cursor-pointer select-none"
        >
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary">
            <span className="material-symbols-outlined">account_balance</span>
          </div>
          <span className="tracking-tight">ITR Assistant</span>
        </div>
        <nav className="hidden md:flex gap-lg items-center">
          <a 
            onClick={onShowMain}
            className="text-primary font-bold border-b-2 border-primary py-1 font-label-md text-label-md" 
            href="#home"
          >
            Home
          </a>
          <a 
            onClick={onShowMain}
            className="text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md" 
            href="#how-it-works"
          >
            How It Works
          </a>
          <a 
            onClick={onShowMain}
            className="text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md" 
            href="#calculator"
          >
            Tax Comparison
          </a>
          <a 
            onClick={onShowMain}
            className="text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md" 
            href="#features"
          >
            Features
          </a>
          <a 
            onClick={onShowMain}
            className="text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md" 
            href="#faq"
          >
            FAQ
          </a>
          {user && (
            <a 
              onClick={(e) => { e.preventDefault(); onShowHistory(); }}
              className="text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md" 
              href="#history"
            >
              History
            </a>
          )}
        </nav>
        <div className="flex items-center gap-md">
          {user ? (
            <>
              <div className="flex items-center gap-xs text-on-surface-variant font-medium text-body-sm font-sans bg-surface-container-low px-sm py-1.5 rounded-xl border border-outline-variant/35 shadow-xs">
                <span className="material-symbols-outlined text-primary text-lg">person</span>
                <span className="max-w-[120px] truncate hidden sm:inline">{user.name}</span>
              </div>
              <button 
                onClick={logout}
                className="bg-primary text-on-primary px-lg py-2 rounded-full font-label-md text-label-md transition-all hover:opacity-90 active:scale-95 shadow-md shadow-primary/20 cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={onShowLogin}
                className="hidden sm:block text-primary font-label-md text-label-md px-md py-2 transition-all active:scale-95 cursor-pointer"
              >
                Login
              </button>
              <button 
                onClick={onShowSignup}
                className="bg-primary text-on-primary px-lg py-2.5 rounded-full font-label-md text-label-md transition-all hover:opacity-90 active:scale-95 shadow-md shadow-primary/20 cursor-pointer"
              >
                Get Started
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
