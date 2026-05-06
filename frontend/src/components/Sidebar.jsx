import { NavLink } from 'react-router-dom';

const menuItems = [
  {
    section: 'Main',
    items: [
      { to: '/', label: 'Overview', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
      { to: '/job-match', label: 'Job Match', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
      { to: '/job-performance', label: 'Job Performance', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
      { to: '/find-jobs', label: 'Find Jobs', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
    ]
  },
  {
    section: 'Career',
    items: [
      { to: '/applications', label: 'Applications', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', disabled: true },
      { to: '/saved-jobs', label: 'Saved Jobs', icon: 'M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z', disabled: true },
      { to: '/career-insights', label: 'Career Insights', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6', disabled: true },
    ]
  },
  {
    section: 'Tools',
    items: [
      { to: '/resume-builder', label: 'Resume Builder', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z', disabled: true },
      { to: '/upload-resume', label: 'Upload Resume', icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12' },
    ]
  }
];

const bottomItems = [
  { to: '/settings', label: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z', disabled: true },
  { to: '/help', label: 'Help & Support', icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z', disabled: true },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-[calc(100vh-57px)] sticky top-[57px] flex flex-col overflow-y-auto">
      <div className="flex-1 px-3 py-4">
        {menuItems.map((section) => (
          <div key={section.section} className="mb-4">
            <p className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              {section.section}
            </p>
            {section.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.disabled ? '#' : item.to}
                end={item.to === '/'}
                onClick={item.disabled ? (e) => e.preventDefault() : undefined}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 mb-0.5 ${
                    item.disabled
                      ? 'text-gray-400 cursor-not-allowed'
                      : isActive
                      ? 'bg-blue-50 text-primary'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                </svg>
                {item.label}
              </NavLink>
            ))}
          </div>
        ))}
      </div>

      {/* Bottom Items */}
      <div className="px-3 pb-2 border-t border-gray-100 pt-2">
        {bottomItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.disabled ? '#' : item.to}
            onClick={item.disabled ? (e) => e.preventDefault() : undefined}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-all duration-200 mb-0.5"
          >
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
            </svg>
            {item.label}
          </NavLink>
        ))}
      </div>

      {/* Upgrade Card */}
      <div className="mx-3 mb-4 p-4 bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl text-white">
        <p className="font-semibold text-sm mb-1">Unlock your full potential</p>
        <p className="text-xs text-purple-200 mb-3">Get access to premium features and career insights.</p>
        <button className="w-full py-2 bg-white text-purple-700 rounded-lg text-sm font-semibold hover:bg-purple-50 transition-colors">
          Upgrade Now
        </button>
      </div>
    </aside>
  );
}
