# TaxCompare — ITR Filing Assistant

A full-stack MERN application that helps salaried individuals in India compare the **Old vs New Tax Regime** and identify which one minimizes their tax liability. Users can either upload their Form 16 — with key details auto-extracted by AI — or enter their numbers manually, and get an instant, side-by-side tax comparison.

🔗 **Live app:** https://itr-filling-assistant.vercel.app/
🔗 **Live API:** https://itr-filling-assistant.onrender.com

> This is a **decision-support tool**, not an official tax filing service. It does not file returns with the government.
>
> Note: the backend runs on Render's free tier, which spins down after periods of inactivity — the first request after idle time may take 30-60 seconds to respond while the server wakes up.

## Features

- **AI-powered document extraction** — upload a Form 16 (PDF/JPG/PNG) and Google Gemini Vision extracts gross salary, TDS, and deduction details automatically
- **Editable review step** — extracted values are shown in an editable form before calculation, so users can correct any AI misreads rather than trusting extraction blindly
- **Manual entry mode** — skip the upload and enter income/deductions directly
- **Old vs New regime comparison** — full tax calculation engine built on official FY 2025-26 slab rates, standard deduction, and Section 87A rebate rules for both regimes
- **User accounts** — signup/login with JWT authentication and bcrypt password hashing
- **Save & view history** — logged-in users can save calculations and revisit them later
- **Responsive landing page** — hero, features, how-it-works, FAQ, and a fully working calculator, all in one page with smooth-scroll navigation

## Tech stack

- **Frontend:** React (Vite), Tailwind CSS
- **Backend:** Node.js, Express
- **Database:** MongoDB (Atlas), Mongoose
- **Auth:** JWT, bcrypt
- **AI:** Google Gemini API (Vision-based document extraction)
- **File uploads:** Multer
- **Deployment:** Vercel (frontend), Render (backend)

## Project structure

```
itr-filing-assistant/
├── client/
│   └── src/
│       ├── context/
│       │   └── AuthContext.jsx       # Global auth state (user, token, login/logout)
│       └── components/
│           ├── Navbar.jsx
│           ├── Hero.jsx
│           ├── WhyChoose.jsx
│           ├── HowItWorks.jsx
│           ├── TaxCalculator.jsx     # Manual entry calculator, wired to /api/calculate-tax
│           ├── UploadForm16.jsx      # Upload → AI extraction → editable review → calculation
│           ├── FAQ.jsx
│           ├── CtaBanner.jsx
│           ├── Footer.jsx
│           ├── SignupPage.jsx
│           ├── LoginPage.jsx
│           └── HistoryPage.jsx       # View past saved calculations
├── server/
│   ├── config/
│   │   └── db.js                    # MongoDB connection
│   ├── middleware/
│   │   └── authMiddleware.js        # JWT verification, protects routes
│   ├── models/
│   │   ├── User.js
│   │   └── Calculation.js
│   ├── routes/
│   │   ├── authRoutes.js            # /api/auth/signup, /api/auth/login
│   │   ├── taxRoutes.js             # /api/calculate-tax
│   │   ├── uploadRoutes.js          # /api/upload
│   │   └── calculationRoutes.js     # /api/calculations (save & fetch history)
│   ├── services/
│   │   └── geminiExtraction.js      # Sends uploaded document to Gemini, returns structured JSON
│   ├── utils/
│   │   ├── taxCalculator.js         # Old vs New regime tax logic
│   │   └── taxCalculator.test.js    # Manual test cases
│   └── uploads/                     # Uploaded files (gitignored, not committed)
└── README.md
```

## Running locally

**Server:**
```bash
cd server
npm install
npm run dev
```
Requires a `.env` file in `/server`:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_random_secret_string
GEMINI_API_KEY=your_gemini_api_key
```

**Client:**
```bash
cd client
npm install
npm run dev
```
Requires a `.env` file in `/client`:
```
VITE_API_URL=http://localhost:5000
```

## API reference

### `POST /api/auth/signup`
**Body:** `{ name, email, password }`
**Response (201):** `{ message, userId }`

### `POST /api/auth/login`
**Body:** `{ email, password }`
**Response (200):** `{ message, token, user: { name, email } }`

### `POST /api/calculate-tax`
**Body:**
```json
{
  "income": 1300000,
  "deductions": { "section80C": 150000, "section80D": 25000, "hraExemption": 0, "otherDeductions": 0 }
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
`deductions` is optional — defaults to all zeros if omitted.

### `POST /api/upload`
Accepts a single file under field name `form16` (PDF/JPG/PNG, up to 5MB). Runs the file through Gemini Vision extraction.

**Response (success):**
```json
{
  "message": "File uploaded and processed successfully",
  "filename": "sampleform16-1234567890.pdf",
  "extractedData": {
    "grossSalary": 2557983,
    "tdsDeducted": 483740,
    "section80C": 150000,
    "section80D": 0,
    "hraExemption": 180150,
    "otherDeductions": 0
  }
}
```

### `POST /api/calculations` *(requires Authorization: Bearer &lt;token&gt;)*
**Body:** `{ income, deductions, oldRegimeTax, newRegimeTax, recommendedRegime, savings }`
Saves a calculation for the logged-in user.

### `GET /api/calculations` *(requires Authorization: Bearer &lt;token&gt;)*
Returns all saved calculations for the logged-in user, newest first.

## Known simplifications
- Surcharge and marginal relief (only relevant above ₹50 lakh income) are not implemented — a deliberate scope decision for this project.
- Section 87A rebate is implemented as a flat "nil tax below threshold" rule rather than precise marginal-relief calculation at the exact boundary.
- AI extraction is not always perfectly accurate (e.g. it can occasionally bundle standard deduction or professional tax into "other deductions") — this is exactly why the editable review screen exists, rather than trusting extraction blindly.
- JWT is currently stored in memory (React state) rather than persisted, so users are logged out on a full page refresh. A production version would use httpOnly cookies for persistent, secure sessions.

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

## Built by
Chaitra Dhake — [GitHub](https://github.com/chaitradhake) · [LinkedIn](https://www.linkedin.com/in/chaitradhake/) · [Portfolio](https://portfolio-chaitradhake.vercel.app/)