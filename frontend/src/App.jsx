import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import JobMatch from './pages/JobMatch';
import JobPerformance from './pages/JobPerformance';
import FindJobs from './pages/FindJobs';
import UploadResume from './pages/UploadResume';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function ProtectedRoute({ children }) {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        {children}
      </div>
    </div>
  );
}

function AppRoutes() {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={token ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route path="/register" element={token ? <Navigate to="/" replace /> : <RegisterPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout><Dashboard /></AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/job-match"
        element={
          <ProtectedRoute>
            <AppLayout><JobMatch /></AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/job-performance"
        element={
          <ProtectedRoute>
            <AppLayout><JobPerformance /></AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/find-jobs"
        element={
          <ProtectedRoute>
            <AppLayout><FindJobs /></AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/upload-resume"
        element={
          <ProtectedRoute>
            <AppLayout><UploadResume /></AppLayout>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}
