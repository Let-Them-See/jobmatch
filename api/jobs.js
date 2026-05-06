const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

// Models
const jobSchema = new mongoose.Schema({
  title: String,
  company: String,
  location: String,
  type: String,
  description: String,
  requirements: [String],
  matchPercent: Number
});

const Job = mongoose.model('Job', jobSchema);

// Auth middleware
const auth = (req, res, next) => {
  const token = req.headers['authorization']?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ msg: 'No token' });
  
  try {
    const decoded = require('jsonwebtoken').verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ msg: 'Invalid token' });
  }
};

const router = express.Router();

// GET /api/jobs
router.get('/', auth, async (req, res) => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const { search, type } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    if (type) {
      query.type = type;
    }

    const jobs = await Job.find(query).sort({ matchPercent: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// GET /api/jobs/:id
router.get('/:id', auth, async (req, res) => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ msg: 'Job not found' });
    }

    const matchBreakdown = {
      skills: Math.min(100, job.matchPercent + 5),
      experience: Math.max(50, job.matchPercent - 5),
      education: job.matchPercent,
      keywords: Math.max(50, job.matchPercent - 7),
      location: 100
    };

    res.json({
      ...job.toObject(),
      matchBreakdown,
      matchingSkills: [
        { skill: 'Product Strategy', level: 'Expert' },
        { skill: 'Roadmap Planning', level: 'Expert' },
        { skill: 'Agile', level: 'Advanced' }
      ],
      skillsToImprove: [
        { skill: 'Go-to-Market Strategy', percent: 60 },
        { skill: 'SQL', percent: 40 }
      ]
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
