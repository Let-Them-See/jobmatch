const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Remote', 'Hybrid', 'Contract', 'Internship'],
    required: true
  },
  level: {
    type: String,
    enum: ['Entry', 'Mid', 'Senior', 'Executive'],
    default: 'Mid'
  },
  salary: {
    type: String,
    required: true
  },
  matchPercent: {
    type: Number,
    required: true
  },
  logo: {
    type: String,
    default: '💼'
  },
  description: {
    type: String,
    default: ''
  },
  requirements: {
    type: [String],
    default: []
  },
  postedDaysAgo: {
    type: Number,
    default: 1
  }
});

module.exports = mongoose.model('Job', jobSchema);
