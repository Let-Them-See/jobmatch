const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const multer = require('multer');

dotenv.config({ path: '.env.local' });

// Models
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  skills: [String],
  matchScore: { type: Number, default: 0 },
  profileStrength: { type: Number, default: 0 },
  resumeUrl: String,
  bio: String,
  experience: String
});

const User = mongoose.model('User', userSchema);

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

// GET /api/profile
router.get('/', auth, async (req, res) => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// PUT /api/profile
router.put('/', auth, async (req, res) => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const { name, bio, skills, experience } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, bio, skills, experience, profileStrength: calculateProfileStrength({ name, bio, skills, experience }) },
      { new: true }
    ).select('-password');
    
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// POST /api/profile/resume
router.post('/resume', auth, async (req, res) => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const { resumeUrl } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { resumeUrl, profileStrength: calculateProfileStrength({ resumeUrl }) },
      { new: true }
    ).select('-password');
    
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

function calculateProfileStrength(profile) {
  let strength = 0;
  if (profile.name) strength += 20;
  if (profile.bio) strength += 20;
  if (profile.skills?.length > 0) strength += 30;
  if (profile.experience) strength += 20;
  if (profile.resumeUrl) strength += 10;
  return Math.min(100, strength);
}

module.exports = router;
