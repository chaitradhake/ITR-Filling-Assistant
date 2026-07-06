import express from 'express';
import { calculateTax } from '../utils/taxCalculator.js';

const router = express.Router();

router.post('/calculate-tax', (req, res) => {
  const { income, deductions } = req.body;

  // Validate that income is present and is a number
  if (income === undefined || income === null || typeof income !== 'number' || isNaN(income)) {
    return res.status(400).json({ error: 'Valid income is required' });
  }

  // Call calculateTax for both regimes (old and new)
  // deductions default to {} inside calculateTax or if null/undefined
  const deductionsObj = deductions !== undefined ? deductions : { section80C: 0, section80D: 0, hraExemption: 0, otherDeductions: 0 };
  const oldRegime = calculateTax(income, 'old', deductionsObj);
  const newRegime = calculateTax(income, 'new', deductionsObj);

  // Recommend the regime with the lower totalTax
  const recommendedRegime = newRegime.totalTax < oldRegime.totalTax ? 'new' : 'old';

  // Calculate the savings (absolute difference)
  const savings = Math.abs(oldRegime.totalTax - newRegime.totalTax);

  return res.json({
    oldRegime,
    newRegime,
    recommendedRegime,
    savings
  });
});

export default router;
