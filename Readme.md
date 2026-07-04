# TaxCompare — ITR Filing Assistant

A MERN stack web app that helps salaried individuals in India compare the **Old vs New Tax Regime** and understand which one saves them more money. Users will (eventually) be able to upload their Form 16, have the key details auto-extracted, review/edit them, and get a clear tax comparison.

> ⚠️ This project is a work in progress.

## What this project does (planned)

1. User uploads their Form 16 (PDF/image)
2. AI (Gemini Vision API) extracts salary, TDS, and deduction details
3. User reviews and corrects the extracted data
4. App calculates tax under both Old and New regime using official FY 2025-26 slab rules
5. App shows a side-by-side comparison and recommends the better regime

This is a **decision-support tool**, not an official tax filing service. It does not file returns with the government.


## Tech stack

- **Frontend:** React (Vite)
- **Backend:** Node.js, Express
- **AI:** Google Gemini API (document/vision extraction)
- **Planned:** MongoDB for saving past calculations, recharts for comparison visuals

## Project structure

```
itr-filing-assistant/
├── client/          # React frontend
├── server/          # Express backend
│   └── utils/
│       ├── taxCalculator.js       # Old vs New regime tax logic
│       └── taxCalculator.test.js  # Manual test cases (run with: node utils/taxCalculator.test.js)
└── README.md
```

## Known simplifications
- Surcharge and marginal relief (only relevant above ₹50 lakh income) are not implemented in the current tax calculator — noted as a deliberate scope decision for this stage of the project.

## Running locally

**Server:**
```bash
cd server
npm install
npm run dev
```

**Client:**
```bash
cd client
npm install
npm run dev
```

## Tax rules reference (FY 2025-26)

**New Regime slabs** (after ₹75,000 standard deduction):
| Income Range | Rate |
|---|---|
| 0 – 4,00,000 | 0% |
| 4,00,000 – 8,00,000 | 5% |
| 8,00,000 – 12,00,000 | 10% |
| 12,00,000 – 16,00,000 | 15% |
| 16,00,000 – 20,00,000 | 20% |
| 20,00,000 – 24,00,000 | 25% |
| Above 24,00,000 | 30% |

Section 87A rebate: nil tax if taxable income ≤ ₹7,00,000.

**Old Regime slabs** (after ₹50,000 standard deduction + other deductions):
| Income Range | Rate |
|---|---|
| 0 – 2,50,000 | 0% |
| 2,50,000 – 5,00,000 | 5% |
| 5,00,000 – 10,00,000 | 20% |
| Above 10,00,000 | 30% |

Section 87A rebate: nil tax if taxable income ≤ ₹5,00,000.

4% health & education cess applies on top of computed tax in both regimes.