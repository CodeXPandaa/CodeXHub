import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import ProjectDetails from './pages/ProjectDetails';
import SubmitWPR from './pages/SubmitWPR';
import Navbar from './components/Navbar';

// Protected Route Component
const ProtectedRoute = ({ children, requireTeacher, requireStudent }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireTeacher && user.role !== 'teacher') {
    return <Navigate to="/student/dashboard" replace />;
  }

  if (requireStudent && user.role !== 'student') {
    return <Navigate to="/teacher/dashboard" replace />;
  }

  return children;
};

function App() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {user && <Navbar />}
      <Toaster position="top-right" />
      <Routes>
        <Route
          path="/"
          element={<Navigate to={user ? (user.role === 'student' ? '/student/dashboard' : '/teacher/dashboard') : '/login'} replace />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute requireStudent>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/dashboard"
          element={
            <ProtectedRoute requireTeacher>
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/project/:id"
          element={
            <ProtectedRoute>
              <ProjectDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/project/:id/submit-wpr"
          element={
            <ProtectedRoute requireStudent>
              <SubmitWPR />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
