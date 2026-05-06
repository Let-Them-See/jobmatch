const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const auth = require('../middleware/auth');

// GET /api/jobs — return all jobs with optional search and type filters
router.get('/', auth, async (req, res) => {
  try {
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
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// GET /api/jobs/:id — return single job with match breakdown
router.get('/:id', auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ msg: 'Job not found' });
    }

    // Generate a match breakdown based on the job's matchPercent
    const base = job.matchPercent;
    const matchBreakdown = {
      skills: Math.min(100, base + 5),
      experience: Math.max(50, base - 5),
      education: base,
      keywords: Math.max(50, base - 7),
      location: 100
    };

    const matchingSkills = [
      { skill: 'Product Strategy', level: 'Expert' },
      { skill: 'Roadmap Planning', level: 'Expert' },
      { skill: 'Agile', level: 'Advanced' },
      { skill: 'Data Analysis', level: 'Advanced' }
    ];

    const skillsToImprove = [
      { skill: 'Go-to-Market Strategy', percent: 60 },
      { skill: 'SQL', percent: 40 },
      { skill: 'A/B Testing', percent: 30 }
    ];

    res.json({
      ...job.toObject(),
      matchBreakdown,
      matchingSkills,
      skillsToImprove,
      whyGreatFit: [
        'Your skills in product management and data analysis closely match the job requirements.',
        'Your experience level and education background align well with what the company is looking for.'
      ],
      aboutRole: `As a ${job.title} at ${job.company}, you will be responsible for driving product strategy, collaborating with cross-functional teams, and delivering impactful solutions. This role requires strong analytical skills, leadership capabilities, and excellent communication. You will work in a fast-paced environment with opportunities for professional growth and development.`
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
