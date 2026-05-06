import { useNavigate } from 'react-router-dom';

export default function JobMatch() {
  const navigate = useNavigate();

  // Redirect to Find Jobs for the full job matching experience
  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-2xl mx-auto text-center py-16 fade-in">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          Job Matching
        </h1>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          Our AI-powered engine analyzes your skills, experience, and preferences to find the perfect job matches for you.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate('/find-jobs')}
            className="px-8 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-all shadow-lg shadow-blue-200"
          >
            Browse Job Matches
          </button>
          <button
            onClick={() => navigate('/upload-resume')}
            className="px-8 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
          >
            Upload Resume
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mt-12">
          {[
            { value: '85%', label: 'Match Score', icon: '🎯' },
            { value: '24', label: 'Jobs Found', icon: '💼' },
            { value: '92%', label: 'Profile Complete', icon: '📋' },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <span className="text-2xl">{stat.icon}</span>
              <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
