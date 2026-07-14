import mongoose from 'mongoose';

const calculationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  income: {
    type: Number,
  },
  deductions: {
    type: Object,
  },
  oldRegimeTax: {
    type: Number,
  },
  newRegimeTax: {
    type: Number,
  },
  recommendedRegime: {
    type: String,
  },
  savings: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Calculation = mongoose.model('Calculation', calculationSchema);

export default Calculation;
