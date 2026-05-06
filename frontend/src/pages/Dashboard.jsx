import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ResponsiveContainer
} from 'recharts';

const radarData = [
  { skill: 'Problem Solving', score: 88 },
  { skill: 'Communication', score: 82 },
  { skill: 'Teamwork', score: 90 },
  { skill: 'Leadership', score: 75 },
  { skill: 'Adaptability', score: 80 },
  { skill: 'Technical Skills', score: 85 },
];

const skillColors = {
  'Problem Solving': '#2563EB',
  'Communication': '#10B981',
  'Teamwork': '#F59E0B',
  'Leadership': '#EF4444',
  'Adaptability': '#7C3AED',
  'Technical Skills': '#06B6D4',
};

const topJobs = [
  { title: 'Product Manager', company: 'TechCorp', match: 85, type: 'Remote', logo: '🔵' },
  { title: 'Business Analyst', company: 'DataSolve', match: 78, type: 'Hybrid', logo: '🟦' },
  { title: 'Project Manager', company: 'BuildIt', match: 75, type: 'Remote', logo: '🟢' },
];

function CircularProgress({ percent, size = 120, strokeWidth = 8, color = '#2563EB' }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="circular-progress" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#E2E8F0" strokeWidth={strokeWidth} />
        <circle
          cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold" style={{ color }}>{percent}%</span>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 px-8 py-10">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex-1 fade-in">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
              Find the right job.<br />
              Build the right <span className="text-primary">future.</span>
            </h1>
            <p className="text-gray-600 text-lg mb-6 max-w-xl">
              We match your skills, interests, and performance to the best career opportunities.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/find-jobs')}
                className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-all duration-200 shadow-lg shadow-blue-200"
              >
                Find Jobs
              </button>
              <button
                onClick={() => navigate('/job-performance')}
                className="px-6 py-3 border-2 border-primary text-primary rounded-xl font-semibold hover:bg-blue-50 transition-all duration-200"
              >
                Analyze Performance
              </button>
            </div>
          </div>

          {/* Match Score Card */}
          <div className="bg-white rounded-2xl shadow-xl p-6 w-80 fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Match Score</h3>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Great Match</span>
            </div>
            <div className="flex justify-center mb-4">
              <CircularProgress percent={user?.matchScore || 85} size={140} strokeWidth={10} />
            </div>
            <p className="text-center text-sm text-gray-600 mb-3">
              You're a great fit for <span className="font-semibold text-gray-900">Product Manager</span>
            </p>
            <button
              onClick={() => navigate('/job-match')}
              className="w-full text-center text-sm text-primary font-medium hover:underline"
            >
              View details →
            </button>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="max-w-7xl mx-auto px-8 -mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Match Score', value: `${user?.matchScore || 85}%`, sub: 'Great Match', color: 'text-primary', bg: 'bg-blue-50', icon: '🎯' },
            { label: 'Jobs Recommended', value: '24', sub: 'New matches this week', color: 'text-green-600', bg: 'bg-green-50', icon: '💼' },
            { label: 'Applications', value: '7', sub: '2 in progress', color: 'text-orange-600', bg: 'bg-orange-50', icon: '📋' },
            { label: 'Profile Strength', value: `${user?.profileStrength || 92}%`, sub: 'Excellent', color: 'text-accent', bg: 'bg-emerald-50', icon: '💪' },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{stat.icon}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${stat.bg} ${stat.color}`}>{stat.sub}</span>
              </div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Performance + Jobs Section */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Radar Chart */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
              Job Performance Analysis
            </h3>
            <p className="text-sm text-gray-500 mb-4">Your skills assessment overview</p>
            <div className="flex flex-col lg:flex-row items-center gap-6">
              <div className="w-full lg:w-3/5" style={{ height: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#E2E8F0" />
                    <PolarAngleAxis dataKey="skill" tick={{ fontSize: 11, fill: '#64748B' }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar name="Score" dataKey="score" stroke="#2563EB" fill="#2563EB" fillOpacity={0.2} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-col gap-2.5">
                {radarData.map((item) => (
                  <div key={item.skill} className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: skillColors[item.skill] }}></div>
                    <span className="text-sm text-gray-600 w-28">{item.skill}</span>
                    <span className="text-sm font-semibold text-gray-900">{item.score}/100</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Job Matches */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'var(--font-heading)' }}>
                  Top Job Matches
                </h3>
                <p className="text-sm text-gray-500">Based on your profile</p>
              </div>
              <button onClick={() => navigate('/find-jobs')} className="text-sm text-primary font-medium hover:underline">
                View All →
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {topJobs.map((job, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all cursor-pointer slide-in"
                  style={{ animationDelay: `${i * 0.1}s` }}
                  onClick={() => navigate('/find-jobs')}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-lg">
                      {job.logo}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{job.title}</p>
                      <p className="text-xs text-gray-500">{job.company}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-medium">
                      {job.match}% Match
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {job.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Banner */}
      <div className="max-w-7xl mx-auto px-8 pb-8">
        <div className="bg-gradient-to-r from-primary to-blue-600 rounded-2xl p-6 flex items-center justify-between text-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl">🏆</div>
            <div>
              <p className="font-semibold text-lg">Keep improving!</p>
              <p className="text-blue-100 text-sm">Your performance is in the top 20% of users in your field.</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/job-performance')}
            className="px-5 py-2.5 bg-white text-primary rounded-xl font-semibold hover:bg-blue-50 transition-colors whitespace-nowrap"
          >
            View Insights →
          </button>
        </div>
      </div>
    </div>
  );
}
