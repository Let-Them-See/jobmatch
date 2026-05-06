const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const User = require('../backend/models/User');
const Job = require('../backend/models/Job');

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  if (req.url.startsWith('/api/')) {
    req.url = req.url.slice(4);
  } else if (req.url === '/api') {
    req.url = '/';
  }
  next();
});

let dbConnectPromise;

async function connectDb() {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  if (!dbConnectPromise) {
    dbConnectPromise = mongoose.connect(process.env.MONGO_URI);
  }

  await dbConnectPromise;
}

function getToken(req) {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader) {
    return null;
  }

  return authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
}

function requireAuth(req, res) {
  const token = getToken(req);
  if (!token) {
    res.status(401).json({ msg: 'No token, authorization denied' });
    return null;
  }

  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    res.status(401).json({ msg: 'Token is not valid' });
    return null;
  }
}

function calculateProfileStrength(profile) {
  let strength = 0;
  if (profile.name) strength += 20;
  if (profile.bio) strength += 20;
  if (profile.skills?.length > 0) strength += 30;
  if (profile.experience) strength += 20;
  if (profile.resumeUrl) strength += 10;
  return Math.min(100, strength);
}

app.get('/', async (req, res) => {
  res.json({ msg: 'JobMatch API is running' });
});

app.post('/auth/register', async (req, res) => {
  try {
    await connectDb();

    const { name, email, password } = req.body;
    const normalizedEmail = String(email || '').trim().toLowerCase();

    if (!name || !normalizedEmail || !password) {
      return res.status(400).json({ msg: 'Name, email, and password are required' });
    }

    let user = await User.findOne({ email: normalizedEmail });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        skills: user.skills,
        matchScore: user.matchScore,
        profileStrength: user.profileStrength,
        resumeUrl: user.resumeUrl
      }
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

app.post('/auth/login', async (req, res) => {
  try {
    await connectDb();

    const { email, password } = req.body;
    const normalizedEmail = String(email || '').trim().toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        skills: user.skills,
        matchScore: user.matchScore,
        profileStrength: user.profileStrength,
        resumeUrl: user.resumeUrl
      }
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

app.get('/auth/me', async (req, res) => {
  try {
    await connectDb();

    const decoded = requireAuth(req, res);
    if (!decoded) {
      return;
    }

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

app.get('/jobs', async (req, res) => {
  try {
    await connectDb();

    const decoded = requireAuth(req, res);
    if (!decoded) {
      return;
    }

    const { search, type } = req.query;
    const query = {};

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
    res.status(500).json({ msg: 'Server error' });
  }
});

app.get('/jobs/:id', async (req, res) => {
  try {
    await connectDb();

    const decoded = requireAuth(req, res);
    if (!decoded) {
      return;
    }

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
    res.status(500).json({ msg: 'Server error' });
  }
});

app.get('/profile', async (req, res) => {
  try {
    await connectDb();

    const decoded = requireAuth(req, res);
    if (!decoded) {
      return;
    }

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

app.put('/profile', async (req, res) => {
  try {
    await connectDb();

    const decoded = requireAuth(req, res);
    if (!decoded) {
      return;
    }

    const { name, bio, skills, experience } = req.body || {};
    const user = await User.findByIdAndUpdate(
      decoded.id,
      {
        name,
        bio,
        skills,
        experience,
        profileStrength: calculateProfileStrength({ name, bio, skills, experience })
      },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

app.post('/profile/upload-resume', async (req, res) => {
  try {
    await connectDb();

    const decoded = requireAuth(req, res);
    if (!decoded) {
      return;
    }

    const { resumeName, resumeSize, resumeType } = req.body || {};
    const resumeUrl = resumeName ? `/resumes/${encodeURIComponent(resumeName)}` : '';

    const user = await User.findByIdAndUpdate(
      decoded.id,
      {
        resumeUrl,
        profileStrength: calculateProfileStrength({ resumeUrl })
      },
      { new: true }
    ).select('-password');

    res.json({
      msg: 'Resume uploaded successfully',
      resumeUrl,
      resumeSize,
      resumeType,
      user
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = app;