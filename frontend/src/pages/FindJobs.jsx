import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

function CircularProgress({ percent, size = 80, strokeWidth = 6, color = '#10B981' }) {
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
        <span className="text-lg font-bold" style={{ color }}>{percent}%</span>
      </div>
    </div>
  );
}

export default function FindJobs() {
  const { API } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    'Full-time': true,
    'Part-time': false,
    'Contract': false,
    'Internship': false,
    'Remote': false,
  });
  const [levelFilters, setLevelFilters] = useState({
    'Entry': false,
    'Mid': true,
    'Senior': false,
    'Executive': false,
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async (searchQuery = '') => {
    try {
      setLoading(true);
      const params = {};
      if (searchQuery) params.search = searchQuery;
      const res = await API.get('/jobs', { params });
      setJobs(res.data);
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs(search || location);
  };

  const handleJobClick = async (job) => {
    try {
      const res = await API.get(`/jobs/${job._id}`);
      setSelectedJob(res.data);
    } catch (err) {
      console.error('Failed to fetch job details:', err);
      setSelectedJob(job);
    }
  };

  const popularSearches = ['Product Manager', 'Data Scientist', 'Software Engineer', 'UX Designer', 'Business Analyst'];

  if (selectedJob) {
    return (
      <div className="flex-1 overflow-y-auto p-8">
        <button onClick={() => setSelectedJob(null)} className="text-sm text-primary font-medium hover:underline mb-4 flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to matches
        </button>

        {/* Job Header */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6 fade-in">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center text-2xl">
                {selectedJob.logo}
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-heading)' }}>{selectedJob.title}</h2>
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                    {selectedJob.matchPercent}% Match
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">{selectedJob.company} • {selectedJob.location} • {selectedJob.type}</p>
                <p className="text-sm font-medium text-gray-700 mt-1">{selectedJob.salary}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                Save Job
              </button>
              <button className="px-6 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors">
                Apply Now
              </button>
            </div>
          </div>
        </div>

        {/* Match Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 fade-in" style={{ animationDelay: '0.1s' }}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
              Your Match Breakdown
            </h3>
            <div className="flex items-center gap-6 mb-6">
              <CircularProgress percent={selectedJob.matchPercent} size={100} strokeWidth={8} color="#2563EB" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{selectedJob.matchPercent}% Match</p>
                <p className="text-sm text-gray-500">Overall compatibility score</p>
              </div>
            </div>

            {selectedJob.matchBreakdown && (
              <div className="space-y-3">
                {Object.entries(selectedJob.matchBreakdown).map(([key, value]) => (
                  <div key={key}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 capitalize">{key}</span>
                      <span className="font-medium text-gray-900">{value}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-700"
                        style={{ width: `${value}%`, backgroundColor: value >= 80 ? '#10B981' : value >= 60 ? '#2563EB' : '#F59E0B' }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 p-3 bg-green-50 rounded-lg flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium text-green-700">Great match!</span>
            </div>
          </div>

          {/* Matching Skills & Skills to Improve */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 fade-in" style={{ animationDelay: '0.2s' }}>
              <h3 className="text-base font-semibold text-gray-900 mb-3">Top Matching Skills</h3>
              <div className="space-y-2">
                {(selectedJob.matchingSkills || []).map((s, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-green-50">
                    <span className="text-sm text-gray-700">{s.skill}</span>
                    <span className="text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded-full font-medium">{s.level}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 fade-in" style={{ animationDelay: '0.3s' }}>
              <h3 className="text-base font-semibold text-gray-900 mb-3">Skills to Improve</h3>
              <div className="space-y-3">
                {(selectedJob.skillsToImprove || []).map((s, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">{s.skill}</span>
                      <span className="text-orange-600 font-medium">{s.percent}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="h-2 rounded-full bg-orange-400" style={{ width: `${s.percent}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Why & About */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {selectedJob.whyGreatFit && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 fade-in" style={{ animationDelay: '0.4s' }}>
              <h3 className="text-base font-semibold text-gray-900 mb-3">Why You're a Great Fit</h3>
              <div className="space-y-2">
                {selectedJob.whyGreatFit.map((reason, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="text-sm text-gray-600">{reason}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedJob.aboutRole && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 fade-in" style={{ animationDelay: '0.5s' }}>
              <h3 className="text-base font-semibold text-gray-900 mb-3">About the Role</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{selectedJob.aboutRole}</p>
              {selectedJob.requirements && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Requirements:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.requirements.map((req, i) => (
                      <span key={i} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">{req}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-8">
      {/* Header */}
      <div className="mb-6 fade-in">
        <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-heading)' }}>Find Jobs</h1>
        <p className="text-sm text-gray-500 mt-1">Discover opportunities that match your skills and interests</p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6 fade-in" style={{ animationDelay: '0.1s' }}>
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by job title, keyword or company"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            />
          </div>
          <div className="relative w-52">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            />
          </div>
          <button type="submit" className="px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors">
            Search
          </button>
        </div>
      </form>

      <div className="flex gap-6">
        {/* Filters Panel */}
        <div className="w-60 shrink-0 hidden lg:block">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 sticky top-4 fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Filters</h3>
              <button onClick={() => {
                setFilters({ 'Full-time': false, 'Part-time': false, 'Contract': false, 'Internship': false, 'Remote': false });
                setLevelFilters({ 'Entry': false, 'Mid': false, 'Senior': false, 'Executive': false });
              }} className="text-xs text-primary hover:underline">Clear all</button>
            </div>

            <div className="mb-5">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Job Type</h4>
              {Object.keys(filters).map((key) => (
                <label key={key} className="flex items-center gap-2 mb-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters[key]}
                    onChange={() => setFilters({ ...filters, [key]: !filters[key] })}
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-gray-600">{key}</span>
                </label>
              ))}
            </div>

            <div className="mb-5">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Experience Level</h4>
              {Object.keys(levelFilters).map((key) => (
                <label key={key} className="flex items-center gap-2 mb-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={levelFilters[key]}
                    onChange={() => setLevelFilters({ ...levelFilters, [key]: !levelFilters[key] })}
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-gray-600">{key} Level</span>
                </label>
              ))}
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Date Posted</h4>
              <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 bg-white outline-none">
                <option>Any time</option>
                <option>Past 24 hours</option>
                <option>Past week</option>
                <option>Past month</option>
              </select>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Salary Range</h4>
              <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 bg-white outline-none">
                <option>Any</option>
                <option>₹5-10 LPA</option>
                <option>₹10-20 LPA</option>
                <option>₹20-30 LPA</option>
                <option>₹30+ LPA</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">
              <span className="font-semibold text-gray-900">{jobs.length > 0 ? '1,248' : '0'}</span> jobs found
            </p>
            <select className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 bg-white outline-none">
              <option>Sort by: Best Match</option>
              <option>Sort by: Newest</option>
              <option>Sort by: Salary</option>
            </select>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="space-y-3">
              {jobs.map((job, i) => (
                <div
                  key={job._id}
                  className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all cursor-pointer fade-in"
                  style={{ animationDelay: `${i * 0.05}s` }}
                  onClick={() => handleJobClick(job)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-xl">
                        {job.logo}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-semibold text-gray-900">{job.title}</h3>
                          <span className="px-2.5 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                            {job.matchPercent}% Match
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-0.5">{job.company}</p>
                        <p className="text-sm text-primary font-medium mt-1">{job.salary}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            </svg>
                            {job.location}
                          </span>
                          <span className="px-2 py-0.5 bg-gray-100 rounded text-gray-600">{job.type}</span>
                          <span className="px-2 py-0.5 bg-gray-100 rounded text-gray-600">{job.level} Level</span>
                          <span>{job.postedDaysAgo === 1 ? '1 day ago' : job.postedDaysAgo < 7 ? `${job.postedDaysAgo} days ago` : `${Math.floor(job.postedDaysAgo / 7)} week ago`}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      className="p-2 text-gray-400 hover:text-primary transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="w-64 shrink-0 hidden xl:block space-y-4">
          {/* Profile Strength */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 fade-in" style={{ animationDelay: '0.3s' }}>
            <h3 className="font-semibold text-gray-900 mb-3 text-sm">Profile Strength</h3>
            <div className="flex justify-center mb-3">
              <CircularProgress percent={92} size={80} strokeWidth={6} color="#10B981" />
            </div>
            <button className="w-full text-center text-sm text-primary font-medium hover:underline">
              Improve Profile →
            </button>
          </div>

          {/* Job Alerts */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 fade-in" style={{ animationDelay: '0.4s' }}>
            <h3 className="font-semibold text-gray-900 mb-2 text-sm">Job Alerts</h3>
            <p className="text-xs text-gray-500 mb-3">Get notified when new jobs match your profile</p>
            <button className="w-full py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">
              Create Alert
            </button>
          </div>

          {/* Popular Searches */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 fade-in" style={{ animationDelay: '0.5s' }}>
            <h3 className="font-semibold text-gray-900 mb-3 text-sm">Popular Searches</h3>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((s, i) => (
                <button
                  key={i}
                  onClick={() => { setSearch(s); fetchJobs(s); }}
                  className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs rounded-full hover:bg-blue-50 hover:text-primary transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
