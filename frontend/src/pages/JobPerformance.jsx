import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell
} from 'recharts';

const performanceData = [
  { date: 'Apr 20', you: 52, industry: 50 },
  { date: 'Apr 27', you: 55, industry: 52 },
  { date: 'May 4', you: 60, industry: 53 },
  { date: 'May 11', you: 62, industry: 55 },
  { date: 'May 18', you: 68, industry: 54 },
  { date: 'May 25', you: 72, industry: 56 },
  { date: 'Jun 1', you: 75, industry: 55 },
  { date: 'Jun 8', you: 78, industry: 57 },
  { date: 'Jun 15', you: 80, industry: 58 },
];

const skills = [
  { name: 'Problem Solving', score: 88, level: 'Excellent', color: '#10B981', bg: 'bg-green-100', text: 'text-green-700' },
  { name: 'Communication', score: 82, level: 'Good', color: '#2563EB', bg: 'bg-blue-100', text: 'text-blue-700' },
  { name: 'Teamwork', score: 76, level: 'Good', color: '#2563EB', bg: 'bg-blue-100', text: 'text-blue-700' },
  { name: 'Leadership', score: 65, level: 'Average', color: '#F59E0B', bg: 'bg-orange-100', text: 'text-orange-700' },
  { name: 'Adaptability', score: 60, level: 'Average', color: '#F59E0B', bg: 'bg-orange-100', text: 'text-orange-700' },
  { name: 'Technical Skills', score: 72, level: 'Good', color: '#2563EB', bg: 'bg-blue-100', text: 'text-blue-700' },
];

const pieData = [
  { name: 'Technical Skills', value: 72, color: '#2563EB' },
  { name: 'Soft Skills', value: 81, color: '#10B981' },
  { name: 'Problem Solving', value: 85, color: '#F59E0B' },
  { name: 'Leadership', value: 65, color: '#EF4444' },
  { name: 'Productivity', value: 88, color: '#7C3AED' },
];

const feedbacks = [
  {
    name: 'Sarah Johnson',
    role: 'Team Lead',
    date: 'Jun 14',
    rating: 4.5,
    comment: 'Alex consistently delivers high-quality work and shows excellent problem-solving abilities. A reliable team player who goes above and beyond.',
    avatar: 'SJ'
  },
  {
    name: 'David Chen',
    role: 'Project Manager',
    date: 'Jun 10',
    rating: 3.5,
    comment: 'Strong analytical skills and a proactive approach to challenges. Could improve on communication during cross-team collaborations.',
    avatar: 'DC'
  }
];

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-4 h-4 ${star <= Math.floor(rating) ? 'text-yellow-400' : star - 0.5 <= rating ? 'text-yellow-300' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-sm text-gray-500 ml-1">{rating}</span>
    </div>
  );
}

export default function JobPerformance() {
  return (
    <div className="flex-1 overflow-y-auto p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 fade-in">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-heading)' }}>
            Job Performance
          </h1>
          <p className="text-sm text-gray-500 mt-1">Track your career progress and skill development</p>
        </div>
        <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none">
          <option>Last 30 Days</option>
          <option>Last 90 Days</option>
          <option>Last 6 Months</option>
          <option>Last Year</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Overall Performance', value: '78%', sub: 'Good', change: '↑ 8% vs last 30 days', color: 'text-green-600', bg: 'bg-green-50', icon: '📊' },
          { label: 'Skills Improved', value: '12', sub: '↑ 3 new skills', change: '', color: 'text-primary', bg: 'bg-blue-50', icon: '🎯' },
          { label: 'Tasks Completed', value: '48', sub: '↑ 15% vs last 30 days', change: '', color: 'text-purple-600', bg: 'bg-purple-50', icon: '✅' },
          { label: 'Feedback Score', value: '4.6/5', sub: 'Excellent', change: '', color: 'text-yellow-600', bg: 'bg-yellow-50', icon: '⭐' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xl">{stat.icon}</span>
              {stat.sub && <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${stat.bg} ${stat.color}`}>{stat.sub}</span>}
            </div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            {stat.change && <p className="text-xs text-green-500 mt-1">{stat.change}</p>}
          </div>
        ))}
      </div>

      {/* Chart + Skills */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Performance Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'var(--font-heading)' }}>
                Performance Overview
              </h3>
              <p className="text-sm text-gray-500">Your performance vs industry average</p>
            </div>
            <select className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 bg-white outline-none">
              <option>All Skills</option>
              <option>Technical</option>
              <option>Soft Skills</option>
            </select>
          </div>

          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} unit="%" />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                  formatter={(value) => [`${value}%`]}
                />
                <Legend />
                <Line type="monotone" dataKey="you" name="Your Performance" stroke="#2563EB" strokeWidth={3} dot={{ r: 4, fill: '#2563EB' }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="industry" name="Industry Average" stroke="#94A3B8" strokeWidth={2} strokeDasharray="5 5" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Info Banner */}
          <div className="mt-4 bg-blue-50 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xl">🎉</span>
              <div>
                <p className="text-sm font-medium text-gray-900">Keep it up!</p>
                <p className="text-xs text-gray-600">You're performing better than 68% of professionals in your field.</p>
              </div>
            </div>
            <button className="text-sm text-primary font-medium hover:underline whitespace-nowrap">View Insights</button>
          </div>
        </div>

        {/* Skills Breakdown */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
            Top Skills Breakdown
          </h3>
          <div className="flex flex-col gap-4">
            {skills.map((skill, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-gray-700">{skill.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${skill.bg} ${skill.text}`}>
                    {skill.level}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div
                    className="h-2.5 rounded-full transition-all duration-1000"
                    style={{ width: `${skill.score}%`, backgroundColor: skill.color }}
                  ></div>
                </div>
                <span className="text-xs text-gray-400 mt-0.5">{skill.score}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feedback + Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Feedback */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
            Recent Feedback
          </h3>
          <div className="flex flex-col gap-4">
            {feedbacks.map((fb, i) => (
              <div key={i} className="p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-400 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {fb.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{fb.name}</p>
                      <p className="text-xs text-gray-500">{fb.role} • {fb.date}</p>
                    </div>
                  </div>
                  <StarRating rating={fb.rating} />
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">"{fb.comment}"</p>
              </div>
            ))}
          </div>
        </div>

        {/* Performance by Category */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
            Performance by Category
          </h3>
          <div className="flex flex-col items-center">
            <div style={{ width: 280, height: 280 }} className="relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-gray-900">78%</span>
                <span className="text-xs text-gray-500">Overall</span>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-3 mt-4">
              {pieData.map((item, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-xs text-gray-600">{item.name} {item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
