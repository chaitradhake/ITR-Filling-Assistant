import React, { useState } from 'react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What is the New Tax Regime?",
      answer: "The New Tax Regime offers lower tax rates but requires you to forego most exemptions and deductions like 80C, 80D, and HRA. It's often better for those with few investments."
    },
    {
      question: "Can I switch between regimes every year?",
      answer: "Yes, salaried individuals can switch between the two regimes every year at the time of filing their return or providing declaration to their employer."
    },
    {
      question: "Is the Standard Deduction available in both?",
      answer: "Yes. A standard deduction of ₹75,000 is available under the New Regime and ₹50,000 under the Old Regime for salaried employees, for FY 2025-26."
    },
    {
      question: "How does this app handle cess?",
      answer: "We automatically calculate the Health and Education Cess at 4% on the total tax liability, in line with current tax rules."
    },
    {
      question: "Is my financial data safe here?",
      answer: "Your uploaded documents are processed to extract data and are not shared with third parties. We recommend not uploading documents with highly sensitive personal identifiers if you're testing this as a demo project."
    },
    {
      question: "Does it support the rebate under Section 87A?",
      answer: "Yes — the calculator applies the Section 87A rebate for taxable income up to ₹12,00,000 in the New Regime and ₹5,00,000 in the Old Regime, per FY 2025-26 rules."
    }
  ];

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-3xl px-gutter max-w-container-max mx-auto" id="faq">
      <div className="text-center mb-2xl">
        <h2 className="font-headline-lg text-headline-lg mb-sm text-on-surface">Frequently Asked Questions</h2>
        <p className="text-body-lg text-on-surface-variant max-w-2xl mx-auto">
          Clearing up common confusion about the new tax regimes.
        </p>
      </div>

      <div className="max-w-3xl mx-auto flex flex-col gap-md">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="bg-surface-container-low rounded-2xl border border-outline-variant/30 overflow-hidden"
            >
              <button
                onClick={() => handleToggle(index)}
                className="w-full flex justify-between items-center p-lg text-left font-semibold text-on-surface hover:text-primary transition-colors focus:outline-none"
              >
                <span className="font-headline-md text-body-lg pr-md">{faq.question}</span>
                <span className={`material-symbols-outlined text-outline transition-transform duration-300 transform ${isOpen ? 'rotate-180 text-primary' : ''}`}>
                  expand_more
                </span>
              </button>
              
              <div
                className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
              >
                <div className="overflow-hidden">
                  <p className="p-lg pt-0 text-body-sm text-on-surface-variant leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
