const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  skills: {
    type: [String],
    default: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Express']
  },
  resumeUrl: {
    type: String,
    default: ''
  },
  matchScore: {
    type: Number,
    default: 85
  },
  profileStrength: {
    type: Number,
    default: 92
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
