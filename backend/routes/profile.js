const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Multer config for resume upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, DOC, and DOCX files are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// GET /api/profile — return user profile + performance stats
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Return user with mock performance stats
    res.json({
      user,
      performance: {
        overallPerformance: 78,
        skillsImproved: 12,
        tasksCompleted: 48,
        feedbackScore: 4.6
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// PUT /api/profile — update user name and skills
router.put('/', auth, async (req, res) => {
  try {
    const { name, skills } = req.body;
    const updateFields = {};
    if (name) updateFields.name = name;
    if (skills) updateFields.skills = skills;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateFields },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// POST /api/profile/upload-resume — handle file upload
router.post('/upload-resume', auth, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }

    const resumeUrl = `/uploads/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { resumeUrl, profileStrength: 95 } },
      { new: true }
    ).select('-password');

    res.json({ msg: 'Resume uploaded successfully', resumeUrl, user });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
