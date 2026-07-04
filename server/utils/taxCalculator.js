/**
 * Calculates income tax for FY 2025-26 under the Old and New tax regimes.
 * 
 * NOTE: Surcharge and marginal relief (applicable for taxable incomes above 50 Lakhs)
 * are not implemented in this version and are out of scope.
 * 
 * @param {number} income - Gross annual salary
 * @param {string} regime - The tax regime, either "old" or "new"
 * @param {Object} [deductions] - Deductions for the old regime (e.g., section80C, section80D, hraExemption, otherDeductions)
 * @returns {Object} { taxableIncome, taxBeforeCess, cess, totalTax }
 */
export function calculateTax(income, regime, deductions = {}) {
  // Ensure income is a number and at least 0
  const grossIncome = Math.max(0, Number(income) || 0);
  const normalizedRegime = (regime || '').toLowerCase();

  let taxableIncome = 0;
  let taxBeforeCess = 0;

  if (normalizedRegime === 'new') {
    // New regime: Subtract standard deduction of 75,000
    taxableIncome = Math.max(0, grossIncome - 75000);

    // FY 2025-26 slabs for New Regime:
    // 0 - 400,000: 0%
    // 400,000 - 800,000: 5%
    // 800,000 - 1,200,000: 10%
    // 1,200,000 - 1,600,000: 15%
    // 1,600,000 - 2,000,000: 20%
    // 2,000,000 - 2,400,000: 25%
    // above 2,400,000: 30%
    const slabs = [
      { limit: 400000, rate: 0.00 },
      { limit: 800000, rate: 0.05 },
      { limit: 1200000, rate: 0.10 },
      { limit: 1600000, rate: 0.15 },
      { limit: 2000000, rate: 0.20 },
      { limit: 2400000, rate: 0.25 },
      { limit: Infinity, rate: 0.30 }
    ];

    let computedTax = 0;
    let remaining = taxableIncome;
    let previousLimit = 0;

    for (let i = 0; i < slabs.length; i++) {
      const { limit, rate } = slabs[i];
      const currentSlabRange = limit - previousLimit;
      if (remaining > currentSlabRange) {
        computedTax += currentSlabRange * rate;
        remaining -= currentSlabRange;
        previousLimit = limit;
      } else {
        computedTax += remaining * rate;
        break;
      }
    }

    // Apply Section 87A rebate: if taxable income <= 1,200,000, tax before cess is 0.
    // Rebate is not applicable if taxable income exceeds 1,200,000.
    if (taxableIncome <= 1200000) {
      taxBeforeCess = 0;
    } else {
      taxBeforeCess = computedTax;
    }

  } else {
    // Old regime: Subtract standard deduction of 50,000 and all provided deductions
    let totalDeductions = 0;
    if (deductions && typeof deductions === 'object') {
      for (const key in deductions) {
        if (Object.prototype.hasOwnProperty.call(deductions, key)) {
          const val = Number(deductions[key]);
          if (!isNaN(val)) {
            totalDeductions += val;
          }
        }
      }
    }

    taxableIncome = Math.max(0, grossIncome - 50000 - totalDeductions);

    // Slabs for Old Regime:
    // 0 - 250,000: 0%
    // 250,000 - 500,000: 5%
    // 500,000 - 1,000,000: 20%
    // above 1,000,000: 30%
    const slabs = [
      { limit: 250000, rate: 0.00 },
      { limit: 500000, rate: 0.05 },
      { limit: 1000000, rate: 0.20 },
      { limit: Infinity, rate: 0.30 }
    ];

    let computedTax = 0;
    let remaining = taxableIncome;
    let previousLimit = 0;

    for (let i = 0; i < slabs.length; i++) {
      const { limit, rate } = slabs[i];
      const currentSlabRange = limit - previousLimit;
      if (remaining > currentSlabRange) {
        computedTax += currentSlabRange * rate;
        remaining -= currentSlabRange;
        previousLimit = limit;
      } else {
        computedTax += remaining * rate;
        break;
      }
    }

    // Apply Section 87A rebate: if taxable income <= 500,000, tax before cess is 0.
    if (taxableIncome <= 500000) {
      taxBeforeCess = 0;
    } else {
      taxBeforeCess = computedTax;
    }
  }

  // Health and Education Cess: 4% on top of tax before cess
  const cess = taxBeforeCess * 0.04;
  const totalTax = taxBeforeCess + cess;

  return {
    taxableIncome,
    taxBeforeCess,
    cess,
    totalTax
  };
}
