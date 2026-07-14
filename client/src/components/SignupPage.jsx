import React, { useState } from 'react';

export default function SignupPage({ onSwitchToLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const handleSignup = async (e) => {
    e.preventDefault();
    
    // Client-side validation
    const errors = {};
    if (!name.trim()) {
      errors.name = 'Name is required';
    }
    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors({});
    setLoading(true);
    setError('');

    try {
      let res;
      try {
        res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name, email, password })
        });
      } catch (directErr) {
        console.warn(`Direct connection to ${import.meta.env.VITE_API_URL} failed, falling back to local proxy`, directErr);
        res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name, email, password })
        });
      }

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      setSuccess(true);
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.message || 'An error occurred during signup.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <section className="py-3xl bg-surface-container-low/50 min-h-[calc(100vh-4rem)] flex items-center">
        <div className="px-gutter max-w-md mx-auto w-full">
          <div className="glass-card rounded-2xl p-lg md:p-xl shadow-xl text-center flex flex-col items-center gap-md border border-outline-variant/30">
            <span className="material-symbols-outlined text-primary text-5xl font-normal bg-primary/10 p-md rounded-full">
              check_circle
            </span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface">Account Created!</h2>
            <p className="text-on-surface-variant">
              Your account has been registered successfully. You can now log in using your email and password.
            </p>
            <button
              onClick={onSwitchToLogin}
              className="w-full bg-primary text-on-primary py-3.5 rounded-xl font-headline-md text-body-lg shadow-lg shadow-primary/20 hover:shadow-xl transition-all active:scale-[0.98] mt-md"
            >
              Go to Login
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-3xl bg-surface-container-low/50 min-h-[calc(100vh-4rem)] flex items-center">
      <div className="px-gutter max-w-md mx-auto w-full">
        <div className="glass-card rounded-2xl p-lg md:p-xl shadow-xl border border-outline-variant/30">
          <div className="text-center mb-xl">
            <h2 className="font-headline-lg text-headline-lg mb-xs text-on-surface">Get Started</h2>
            <p className="text-body-sm text-on-surface-variant">Create a new account to file your tax returns.</p>
          </div>

          {error && (
            <div className="mb-lg p-md bg-red-50 border border-red-200 text-red-700 rounded-xl text-center flex items-center justify-center gap-sm text-body-sm">
              <span className="material-symbols-outlined text-xl">error</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSignup} noValidate className="space-y-lg">
            <div>
              <label className="block text-label-md font-label-md mb-2 text-on-surface">Full Name</label>
              <input
                className="w-full h-12 bg-surface-bright border border-outline-variant rounded-xl px-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
              />
              {validationErrors.name && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-label-md font-label-md mb-2 text-on-surface">Email Address</label>
              <input
                className="w-full h-12 bg-surface-bright border border-outline-variant rounded-xl px-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
              />
              {validationErrors.email && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-label-md font-label-md mb-2 text-on-surface">Password</label>
              <input
                className="w-full h-12 bg-surface-bright border border-outline-variant rounded-xl px-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                required
              />
              {validationErrors.password && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-primary text-on-primary py-3.5 rounded-xl font-headline-md text-body-lg shadow-lg shadow-primary/20 hover:shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-sm mt-xl ${loading ? 'opacity-80 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Creating Account...</span>
                </>
              ) : (
                'Sign Up'
              )}
            </button>
          </form>

          <div className="mt-xl text-center text-body-sm text-on-surface-variant">
            Already have an account?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-primary font-medium hover:underline focus:outline-none"
            >
              Log In
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
