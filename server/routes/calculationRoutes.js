import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import Calculation from '../models/Calculation.js';

const router = express.Router();

// POST /api/calculations - Protected
router.post('/', protect, async (req, res) => {
  try {
    const { income, deductions, oldRegimeTax, newRegimeTax, recommendedRegime, savings } = req.body;

    const newCalculation = new Calculation({
      userId: req.userId,
      income,
      deductions,
      oldRegimeTax,
      newRegimeTax,
      recommendedRegime,
      savings,
    });

    const savedCalculation = await newCalculation.save();
    return res.status(201).json(savedCalculation);
  } catch (error) {
    console.error('Error saving calculation:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/calculations - Protected
router.get('/', protect, async (req, res) => {
  try {
    const calculations = await Calculation.find({ userId: req.userId }).sort({ createdAt: -1 });
    return res.status(200).json(calculations);
  } catch (error) {
    console.error('Error fetching calculations:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
