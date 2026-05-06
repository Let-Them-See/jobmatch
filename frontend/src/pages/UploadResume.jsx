import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

export default function UploadResume() {
  const { API, updateUser } = useAuth();
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const handleFileSelect = (file) => {
    if (!file) return;

    const maxSize = 5 * 1024 * 1024;
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

    if (!allowedTypes.includes(file.type)) {
      setError('Only PDF, DOC, and DOCX files are allowed');
      return;
    }

    if (file.size > maxSize) {
      setError('File size must be less than 5MB');
      return;
    }

    setError('');
    uploadFile(file);
  };

  const uploadFile = async (file) => {
    setUploading(true);
    setUploadProgress(0);

    try {
      const res = await API.post('/profile/upload-resume', {
        resumeName: file.name,
        resumeSize: file.size,
        resumeType: file.type
      });

      setUploadProgress(100);
      setUploadedFile({ name: file.name, size: file.size });
      if (res.data.user) {
        updateUser(res.data.user);
      }
    } catch (err) {
      console.error('Upload failed:', err);
      setError(err.response?.data?.msg || 'Failed to upload resume');
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const steps = [
    { icon: '🔍', title: 'Resume Analysis', desc: 'We extract your skills, experience, and education automatically.', color: 'bg-blue-100 text-blue-600' },
    { icon: '🎯', title: 'Better Job Matches', desc: 'Get personalized job recommendations based on your profile.', color: 'bg-green-100 text-green-600' },
    { icon: '📊', title: 'Performance Insights', desc: 'Track your career progress and skill development over time.', color: 'bg-purple-100 text-purple-600' },
    { icon: '🚀', title: 'Career Growth', desc: 'Receive tips and resources to accelerate your career growth.', color: 'bg-orange-100 text-orange-600' },
  ];

  const tips = [
    { icon: '🔄', title: 'Keep it Updated', desc: 'Update your resume regularly with latest skills and experiences.' },
    { icon: '🔑', title: 'Use Keywords', desc: 'Include relevant industry keywords to improve job matching.' },
    { icon: '📝', title: 'Be Concise', desc: 'Keep your resume clear, focused, and no longer than 2 pages.' },
    { icon: '🏆', title: 'Highlight Achievements', desc: 'Quantify your accomplishments with numbers and metrics.' },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 fade-in">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-heading)' }}>Upload Resume</h1>
          <p className="text-sm text-gray-500 mt-1">Upload your resume to get better job matches and career insights</p>
        </div>
        <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-lg">
          <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <div>
            <p className="text-sm font-medium text-green-700">Your data is secure</p>
            <p className="text-xs text-green-600">We use bank-level encryption</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Upload Zone */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upload Area */}
          <div
            className={`bg-white rounded-xl p-10 shadow-sm border-2 border-dashed transition-all duration-200 fade-in ${
              dragActive ? 'border-primary bg-blue-50' : uploadedFile ? 'border-green-300 bg-green-50' : 'border-gray-200 hover:border-primary'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {uploadedFile ? (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-lg font-semibold text-green-700 mb-1">Resume uploaded successfully!</p>
                <p className="text-sm text-gray-600 mb-4">{uploadedFile.name} ({(uploadedFile.size / 1024).toFixed(1)} KB)</p>
                <button
                  onClick={() => { setUploadedFile(null); setUploadProgress(0); }}
                  className="text-sm text-primary font-medium hover:underline"
                >
                  Upload a different file
                </button>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <p className="text-lg font-semibold text-gray-700 mb-1">Drag & drop your resume here</p>
                <p className="text-sm text-gray-500 mb-4">or</p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50"
                >
                  {uploading ? 'Uploading...' : 'Choose File'}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileSelect(e.target.files[0])}
                  className="hidden"
                />
                <p className="text-xs text-gray-400 mt-3">Supported formats: PDF, DOC, DOCX (Max 5MB)</p>

                {uploading && (
                  <div className="mt-4 w-64 mx-auto">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 bg-primary rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{uploadProgress}% uploaded</p>
                  </div>
                )}
              </div>
            )}

            {error && (
              <div className="mt-4 p-3 bg-red-50 rounded-lg flex items-center gap-2">
                <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm text-red-600">{error}</span>
              </div>
            )}
          </div>

          {/* Import From */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 fade-in" style={{ animationDelay: '0.1s' }}>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Import From</h3>
            <div className="flex gap-3">
              {[
                { name: 'LinkedIn', icon: '🔗', color: 'border-blue-200 hover:bg-blue-50' },
                { name: 'Google Drive', icon: '📁', color: 'border-green-200 hover:bg-green-50' },
                { name: 'Dropbox', icon: '📦', color: 'border-indigo-200 hover:bg-indigo-50' },
              ].map((source, i) => (
                <button key={i} className={`flex-1 flex items-center justify-center gap-2 py-3 border-2 rounded-xl text-sm font-medium text-gray-600 transition-colors ${source.color}`}>
                  <span className="text-xl">{source.icon}</span>
                  {source.name}
                </button>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="fade-in" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
              Tips for a Great Resume
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {tips.map((tip, i) => (
                <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="text-2xl mb-2">{tip.icon}</div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">{tip.title}</h4>
                  <p className="text-xs text-gray-500">{tip.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: What Happens Next */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 fade-in" style={{ animationDelay: '0.15s' }}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
              What Happens Next
            </h3>
            <div className="space-y-4">
              {steps.map((step, i) => (
                <div key={i} className="flex gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-lg ${step.color}`}>
                    {step.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">{step.title}</h4>
                    <p className="text-xs text-gray-500 mt-0.5">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="mt-8 flex items-center justify-center gap-2 text-xs text-gray-400 fade-in" style={{ animationDelay: '0.3s' }}>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <p>Your resume is private and will never be shared without your permission.</p>
      </div>
    </div>
  );
}
