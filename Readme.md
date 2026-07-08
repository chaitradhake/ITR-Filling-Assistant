# TaxCompare — ITR Filing Assistant

A MERN stack web app that helps salaried individuals in India compare the **Old vs New Tax Regime** and understand which one saves them more money. Users upload their Form 16, have the key details auto-extracted by AI, review/edit them, and get a clear tax comparison.

> ⚠️ This project is a work in progress.

## What this project does

1. User uploads their Form 16 (PDF/image) *(planned)*
2. AI (Gemini Vision API) extracts salary, TDS, and deduction details *(planned)*
3. User reviews and corrects the extracted data *(planned)*
4. App calculates tax under both Old and New regime using official FY 2025-26 slab rules ✅ **built**
5. App shows a side-by-side comparison and recommends the better regime ✅ **built**

This is a **decision-support tool**, not an official tax filing service. It does not file returns with the government.

## Currently working

- Tax calculation engine (Old vs New regime, FY 2025-26 rules, Section 87A rebate, 4% cess)
- `/api/calculate-tax` endpoint returning a full regime comparison
- Frontend calculator UI — enter income & deductions, get an instant Old vs New comparison
- File upload endpoint (`/api/upload`) accepting PDF/JPG/PNG, with type and size validation

## Tech stack

- **Frontend:** React (Vite), Tailwind CSS
- **Backend:** Node.js, Express, Multer (file uploads)
- **AI:** Google Gemini API (document/vision extraction) — integration in progress
- **Planned:** MongoDB (saving past calculations), JWT-based auth, recharts (comparison visuals)

## Project structure

```
itr-filing-assistant/
├── client/
│   └── src/
│       └── components/
│           └── TaxCalculator.jsx   # Main calculator UI, wired to /api/calculate-tax
├── server/
│   ├── routes/
│   │   ├── taxRoutes.js           # /api/calculate-tax endpoint
│   │   └── uploadRoutes.js        # /api/upload endpoint
│   ├── utils/
│   │   ├── taxCalculator.js       # Old vs New regime tax logic
│   │   └── taxCalculator.test.js  # Manual test cases (run with: node utils/taxCalculator.test.js)
│   └── uploads/                   # Uploaded files (gitignored, not committed)
└── README.md
```

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

## API reference

### `POST /api/calculate-tax`

**Request body:**
```json
{
  "income": 1300000,
  "deductions": {
    "section80C": 150000,
    "section80D": 25000,
    "hraExemption": 0,
    "otherDeductions": 0
  }
}
```

**Response:**
```json
{
  "oldRegime": { "taxableIncome": 1025000, "taxBeforeCess": 120000, "cess": 4800, "totalTax": 124800 },
  "newRegime": { "taxableIncome": 1225000, "taxBeforeCess": 63750, "cess": 2550, "totalTax": 66300 },
  "recommendedRegime": "new",
  "savings": 58500
}
```

`deductions` is optional — if omitted, all values default to 0.

### `POST /api/upload`

Accepts a single file under the field name `form16`. Only PDF, JPG, and PNG files are accepted, up to 5MB.

**Response (success):**
```json
{ "message": "File uploaded successfully", "filename": "...", "path": "..." }
```

## Known simplifications
- Surcharge and marginal relief (only relevant above ₹50 lakh income) are not implemented in the current tax calculator — a deliberate scope decision for this stage of the project.
- Section 87A rebate is implemented as a flat "nil tax below threshold" rule rather than the precise marginal-relief calculation right at the boundary.

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

Section 87A rebate: nil tax if taxable income ≤ ₹12,00,000 (rebate capped at ₹60,000).

**Old Regime slabs** (after ₹50,000 standard deduction + other deductions):
| Income Range | Rate |
|---|---|
| 0 – 2,50,000 | 0% |
| 2,50,000 – 5,00,000 | 5% |
| 5,00,000 – 10,00,000 | 20% |
| Above 10,00,000 | 30% |

Section 87A rebate: nil tax if taxable income ≤ ₹5,00,000 (rebate capped at ₹12,500).

4% health & education cess applies on top of computed tax in both regimes.