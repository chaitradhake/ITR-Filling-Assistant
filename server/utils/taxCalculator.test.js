import { calculateTax } from './taxCalculator.js';

console.log('==================================================');
console.log('Tax Calculator Test Suite (FY 2025-26)');
console.log('==================================================\n');

// Test Case 1: Low Income (under rebate threshold for both regimes)
console.log('--- Test Case 1: Low Income (Gross: 450,000) ---');
const tc1Deductions = { section80C: 50000 };
const tc1New = calculateTax(450000, 'new', tc1Deductions);
const tc1Old = calculateTax(450000, 'old', tc1Deductions);
console.log('New Regime:', tc1New);
console.log('Old Regime:', tc1Old);
console.log('');

// Test Case 2: Mid Income (around 12-15 lakh)
console.log('--- Test Case 2: Mid Income (Gross: 1,300,000) ---');
const tc2Deductions = { section80C: 150000, section80D: 25000, hraExemption: 50000 };
const tc2New = calculateTax(1300000, 'new', tc2Deductions);
const tc2Old = calculateTax(1300000, 'old', tc2Deductions);
console.log('New Regime:', tc2New);
console.log('Old Regime:', tc2Old);
console.log('');

// Test Case 3: High Income (20+ lakh)
console.log('--- Test Case 3: High Income (Gross: 2,500,000) ---');
const tc3Deductions = { section80C: 150000, section80D: 50000 };
const tc3New = calculateTax(2500000, 'new', tc3Deductions);
const tc3Old = calculateTax(2500000, 'old', tc3Deductions);
console.log('New Regime:', tc3New);
console.log('Old Regime:', tc3Old);
console.log('');

// Test Case 4: Rebate Boundary for New Regime (showing the <= 1.2M taxable income threshold)
console.log('--- Test Case 4: Rebate Boundary for New Regime ---');
console.log('Gross: 1,275,000 (Taxable income should be exactly 1,200,000, eligible for rebate)');
const tc4Eligible = calculateTax(1275000, 'new');
console.log('New Regime (Eligible for rebate):', tc4Eligible);

console.log('\nGross: 1,275,100 (Taxable income should be 1,200,100, NOT eligible for rebate)');
const tc4Ineligible = calculateTax(1275100, 'new');
console.log('New Regime (Ineligible for rebate):', tc4Ineligible);
console.log('==================================================');
