import React from 'react';

export default function HowItWorks() {
  const steps = [
    {
      number: 1,
      icon: "upload_file",
      title: "Upload Form 16",
      text: "Upload your Form 16 or enter your salary details manually."
    },
    {
      number: 2,
      icon: "auto_awesome",
      title: "AI Extracts Data",
      text: "Our AI reads your document and extracts the key figures."
    },
    {
      number: 3,
      icon: "rule_folder",
      title: "Review & Compare",
      text: "See a detailed breakdown comparing Old vs New tax regime."
    },
    {
      number: 4,
      icon: "check_circle",
      title: "Get Your Answer",
      text: "Know exactly which regime saves you the most money."
    }
  ];

  return (
    <section className="py-3xl px-gutter max-w-container-max mx-auto" id="how-it-works">
      <div className="text-center mb-2xl">
        <h2 className="font-headline-lg text-headline-lg mb-sm text-on-surface">How It Works</h2>
        <p className="text-body-lg text-on-surface-variant max-w-2xl mx-auto">
          Get your tax optimization report in four simple steps.
        </p>
      </div>

      <div className="relative">
        {/* Horizontal connecting line for desktop */}
        <div className="absolute top-12 left-[12.5%] right-[12.5%] h-0.5 bg-outline-variant/30 hidden lg:block -z-10" />

        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-xl lg:gap-md">
          {steps.map((step) => (
            <div key={step.number} className="flex flex-col items-center text-center lg:w-1/4 relative group">
              {/* Circular Icon Container with Step Number */}
              <div className="relative w-24 h-24 bg-white border-2 border-primary rounded-full flex items-center justify-center shadow-md transition-transform duration-300 group-hover:scale-105">
                <span className="material-symbols-outlined text-primary text-3xl font-medium">
                  {step.icon}
                </span>
                <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-xs shadow-sm">
                  {step.number}
                </div>
              </div>
              
              {/* Step Info */}
              <h3 className="text-headline-md font-headline-md text-on-surface mt-lg mb-xs">
                {step.title}
              </h3>
              <p className="text-body-sm text-on-surface-variant max-w-xs px-sm">
                {step.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
