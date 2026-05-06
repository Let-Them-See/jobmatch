const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Job = require('./models/Job');

dotenv.config();

const jobs = [
  {
    title: 'Product Manager',
    company: 'Google',
    location: 'Bengaluru, India',
    type: 'Remote',
    level: 'Mid',
    salary: '₹18-28 LPA',
    matchPercent: 85,
    logo: '🔵',
    description: 'Lead product strategy and roadmap for Google Cloud products. Collaborate with engineering, design, and marketing teams to deliver impactful solutions.',
    requirements: ['Product Strategy', 'Agile', 'Data Analysis', 'Stakeholder Management', 'Roadmap Planning'],
    postedDaysAgo: 2
  },
  {
    title: 'Business Analyst',
    company: 'Microsoft',
    location: 'Hyderabad, India',
    type: 'Hybrid',
    level: 'Mid',
    salary: '₹12-18 LPA',
    matchPercent: 78,
    logo: '🟦',
    description: 'Analyze business processes and data to provide actionable insights. Work closely with stakeholders to define requirements and drive product improvements.',
    requirements: ['SQL', 'Data Visualization', 'Business Intelligence', 'Excel', 'Requirements Gathering'],
    postedDaysAgo: 5
  },
  {
    title: 'Data Analyst',
    company: 'Amazon',
    location: 'Pune, India',
    type: 'Remote',
    level: 'Mid',
    salary: '₹10-16 LPA',
    matchPercent: 72,
    logo: '🟠',
    description: 'Transform raw data into meaningful insights for business decisions. Build dashboards and reports using advanced analytics tools.',
    requirements: ['Python', 'SQL', 'Tableau', 'Statistics', 'Data Modeling'],
    postedDaysAgo: 7
  },
  {
    title: 'Software Engineer',
    company: 'Flipkart',
    location: 'Bengaluru, India',
    type: 'Full-time',
    level: 'Mid',
    salary: '₹15-25 LPA',
    matchPercent: 80,
    logo: '🟡',
    description: 'Design and develop scalable backend services for India\'s largest e-commerce platform. Work with microservices architecture and distributed systems.',
    requirements: ['Java', 'Spring Boot', 'Microservices', 'System Design', 'DSA'],
    postedDaysAgo: 3
  },
  {
    title: 'UX Designer',
    company: 'Swiggy',
    location: 'Mumbai, India',
    type: 'Hybrid',
    level: 'Mid',
    salary: '₹8-14 LPA',
    matchPercent: 68,
    logo: '🟧',
    description: 'Create intuitive and delightful user experiences for millions of users. Conduct user research, wireframing, and prototyping.',
    requirements: ['Figma', 'User Research', 'Wireframing', 'Prototyping', 'Design Systems'],
    postedDaysAgo: 4
  },
  {
    title: 'Data Scientist',
    company: 'Razorpay',
    location: 'Bengaluru, India',
    type: 'Remote',
    level: 'Senior',
    salary: '₹18-30 LPA',
    matchPercent: 76,
    logo: '🔷',
    description: 'Build ML models and data pipelines to drive fintech innovation. Work on fraud detection, risk analysis, and payment optimization.',
    requirements: ['Python', 'Machine Learning', 'Deep Learning', 'Statistics', 'Big Data'],
    postedDaysAgo: 1
  },
  {
    title: 'Frontend Developer',
    company: 'Zomato',
    location: 'Gurgaon, India',
    type: 'Full-time',
    level: 'Mid',
    salary: '₹10-18 LPA',
    matchPercent: 82,
    logo: '🔴',
    description: 'Build responsive and performant web applications for food delivery platform. Work with React, Next.js, and modern frontend technologies.',
    requirements: ['React', 'JavaScript', 'TypeScript', 'CSS', 'Performance Optimization'],
    postedDaysAgo: 6
  },
  {
    title: 'ML Engineer',
    company: 'CRED',
    location: 'Bengaluru, India',
    type: 'Remote',
    level: 'Senior',
    salary: '₹20-35 LPA',
    matchPercent: 71,
    logo: '⚪',
    description: 'Design and deploy machine learning models at scale. Work on recommendation systems, NLP, and computer vision for fintech applications.',
    requirements: ['Python', 'TensorFlow', 'PyTorch', 'MLOps', 'Cloud Platforms'],
    postedDaysAgo: 8
  },
  {
    title: 'DevOps Engineer',
    company: 'Infosys',
    location: 'Chennai, India',
    type: 'Full-time',
    level: 'Mid',
    salary: '₹8-15 LPA',
    matchPercent: 65,
    logo: '🟢',
    description: 'Manage CI/CD pipelines, cloud infrastructure, and containerized deployments. Ensure system reliability and scalability.',
    requirements: ['Docker', 'Kubernetes', 'AWS', 'Jenkins', 'Linux'],
    postedDaysAgo: 10
  },
  {
    title: 'Product Analyst',
    company: 'PhonePe',
    location: 'Bengaluru, India',
    type: 'Hybrid',
    level: 'Mid',
    salary: '₹12-20 LPA',
    matchPercent: 79,
    logo: '🟣',
    description: 'Drive product decisions with data-driven insights. Analyze user behavior, define metrics, and optimize product features for growth.',
    requirements: ['SQL', 'Python', 'Product Analytics', 'A/B Testing', 'Growth Metrics'],
    postedDaysAgo: 3
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding...');

    await Job.deleteMany({});
    console.log('Cleared existing jobs.');

    await Job.insertMany(jobs);
    console.log('Successfully seeded 10 jobs!');

    await mongoose.connection.close();
    console.log('Database connection closed.');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err.message);
    process.exit(1);
  }
}

seed();
