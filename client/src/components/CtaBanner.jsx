import React from 'react';

export default function CtaBanner() {
  return (
    <section className="px-gutter max-w-container-max mx-auto py-2xl">
      <div className="bg-gradient-to-r from-primary to-primary-container rounded-3xl p-xl md:p-3xl text-on-primary flex flex-col md:flex-row items-start md:items-center justify-between gap-xl shadow-xl">
        <div>
          <h2 className="font-headline-lg text-headline-lg mb-sm text-white">
            Ready to Find the Best Tax Regime?
          </h2>
          <p className="text-body-lg text-white/80 max-w-xl">
            Stop guessing. Start saving with AI-powered clarity.
          </p>
        </div>
        <a
          href="#calculator"
          className="inline-flex items-center gap-xs px-2xl py-md bg-white text-primary rounded-full font-headline-md text-body-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition duration-200 group whitespace-nowrap self-start md:self-auto"
        >
          Calculate Now
          <span className="material-symbols-outlined transition-transform duration-200 group-hover:translate-x-1">
            arrow_forward
          </span>
        </a>
      </div>
    </section>
  );
}
