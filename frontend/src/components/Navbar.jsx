import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FileText, LogOut, User, BarChart3 } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">CodeXHub</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to={user.role === 'student' ? '/student/dashboard' : '/teacher/dashboard'}
              className="flex items-center space-x-1 text-gray-700 hover:text-primary-600"
            >
              <BarChart3 className="h-5 w-5" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>

            <div className="flex items-center space-x-2 text-gray-700">
              <User className="h-5 w-5" />
              <span className="hidden sm:inline">{user.name}</span>
              <span className="px-2 py-1 text-xs bg-primary-100 text-primary-800 rounded-full">
                {user.role}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 text-gray-700 hover:text-red-600"
            >
              <LogOut className="h-5 w-5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
