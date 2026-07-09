import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { extractForm16Data } from '../services/geminiExtraction.js';

const router = express.Router();

// Get directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, '../uploads');

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    cb(null, `${baseName}-${uniqueSuffix}${ext}`);
  }
});

// Configure file filter
const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.pdf', '.jpg', '.jpeg', '.png'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, JPG, and PNG files are allowed'), false);
  }
};

// Configure multer upload limits and options
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter
}).single('form16');

// POST route for file upload
router.post('/upload', (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File size must be under 5MB' });
      }
      return res.status(400).json({ error: err.message || 'Error uploading file' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Please upload a file' });
    }

    try {
      const extractedData = await extractForm16Data(req.file.path, req.file.mimetype);
      return res.status(200).json({
        message: 'File uploaded and processed successfully',
        filename: req.file.filename,
        extractedData
      });
    } catch (extractionError) {
      return res.status(200).json({
        message: 'File uploaded successfully',
        filename: req.file.filename,
        path: req.file.path,
        extractionError: extractionError.message
      });
    }
  });
});

export default router;
