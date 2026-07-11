import React from 'react';

export default function WhyChoose() {
  const cards = [
    {
      icon: "psychology",
      title: "AI-Powered Accuracy",
      text: "Our algorithms are updated in real-time with the latest tax laws and slab rates."
    },
    {
      icon: "gavel",
      title: "Official Tax Rules",
      text: "Calculations adhere strictly to standard deduction and rebate guidelines for both regimes."
    },
    {
      icon: "compare_arrows",
      title: "Instant Comparison",
      text: "No more spreadsheets. Get a detailed side-by-side view of your tax liability in seconds."
    },
    {
      icon: "lock",
      title: "Secure & Private",
      text: "Your uploaded documents are processed securely and are not shared with third parties."
    },
    {
      icon: "touch_app",
      title: "Easy to Use",
      text: "A minimal, clutter-free interface designed for clarity and focus on what matters most."
    },
    {
      icon: "savings",
      title: "Save More Money",
      text: "Maximize your take-home pay by choosing the regime that works for your situation."
    }
  ];

  return (
    <section className="py-3xl px-gutter max-w-container-max mx-auto" id="features">
      <div className="text-center mb-2xl">
        <h2 className="font-headline-lg text-headline-lg mb-sm text-on-surface">Why Choose ITR Assistant?</h2>
        <p className="text-body-lg text-on-surface-variant max-w-2xl mx-auto">
          Advanced financial modeling meeting simplicity. Designed for the modern Indian taxpayer.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-xl">
        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-surface rounded-2xl border border-outline-variant/30 p-xl hover:shadow-xl hover:-translate-y-1 transition duration-300 transform"
          >
            <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-lg">
              <span className="material-symbols-outlined text-2xl">{card.icon}</span>
            </div>
            <h3 className="text-headline-md font-headline-md mb-xs text-on-surface">
              {card.title}
            </h3>
            <p className="text-body-sm text-on-surface-variant">
              {card.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
