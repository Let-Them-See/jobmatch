const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

// Models
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  skills: [String],
  matchScore: { type: Number, default: 0 },
  profileStrength: { type: Number, default: 0 },
  resumeUrl: String
});

const User = mongoose.model('User', userSchema);

// Auth middleware
const auth = (req, res, next) => {
  const token = req.headers['authorization']?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ msg: 'No token' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ msg: 'Invalid token' });
  }
};

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ name, email, password: hashedPassword });
    await user.save();

    const payload = { id: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user: { id: user._id, name, email, skills: [], matchScore: 0, profileStrength: 0 } });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const payload = { id: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user: { id: user._id, name: user.name, email, skills: user.skills, matchScore: user.matchScore, profileStrength: user.profileStrength, resumeUrl: user.resumeUrl } });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// GET /api/auth/me
router.get('/me', auth, async (req, res) => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
