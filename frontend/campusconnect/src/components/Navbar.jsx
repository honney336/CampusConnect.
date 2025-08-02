import { Link, useNavigate } from 'react-router-dom';
import { isAuthenticated, getUserRole, logout, getUsername } from '../auth';
import { 
  Home, 
  BookOpen, 
  FileText, 
  Calendar, 
  Megaphone, 
  User, 
  Settings, 
  LogOut,
  Menu,
  X,
  LayoutDashboard
} from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const authenticated = isAuthenticated();
  const userRole = getUserRole();
  const username = getUsername();

  // Get user's dashboard route based on role
  const getDashboardRoute = () => {
    switch (userRole) {
      case 'admin':
        return '/admindashboard';
      case 'faculty':
        return '/facultydashboard';
      case 'student':
        return '/studentdashboard';
      default:
        return '/dashboard';
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const NavLink = ({ to, icon: Icon, children, onClick }) => (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center space-x-2 px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200"
    >
      <Icon size={18} />
      <span>{children}</span>
    </Link>
  );

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">CampusConnect</span>
          </Link>

          {/* Desktop Navigation */}
          {authenticated && (
            <div className="hidden md:flex items-center space-x-4">
              <NavLink to={getDashboardRoute()} icon={LayoutDashboard}>Dashboard</NavLink>
              <NavLink to="/courses" icon={BookOpen}>Courses</NavLink>
              <NavLink to="/notes" icon={FileText}>Notes</NavLink>
              <NavLink to="/events" icon={Calendar}>Events</NavLink>
              <NavLink to="/announcements" icon={Megaphone}>Announcements</NavLink>
              
              {userRole === 'admin' && (
                <NavLink to="/admin" icon={Settings}>Admin Panel</NavLink>
              )}
              
              <NavLink to="/profile" icon={User}>Profile</NavLink>
              
              {/* User Info & Logout */}
              <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-gray-200">
                <span className="text-sm text-gray-600">
                  Welcome, <span className="font-medium">{username}</span>
                </span>
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full capitalize">
                  {userRole}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors duration-200"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}

          {/* Mobile menu button */}
          {authenticated && (
            <div className="md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-blue-50"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          )}

          {/* Login button for non-authenticated users */}
          {!authenticated && (
            <Link
              to="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Navigation Menu */}
        {authenticated && isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-2">
              <NavLink to={getDashboardRoute()} icon={LayoutDashboard} onClick={() => setIsMobileMenuOpen(false)}>
                Dashboard
              </NavLink>
              <NavLink to="/courses" icon={BookOpen} onClick={() => setIsMobileMenuOpen(false)}>
                Courses
              </NavLink>
              <NavLink to="/notes" icon={FileText} onClick={() => setIsMobileMenuOpen(false)}>
                Notes
              </NavLink>
              <NavLink to="/events" icon={Calendar} onClick={() => setIsMobileMenuOpen(false)}>
                Events
              </NavLink>
              <NavLink to="/announcements" icon={Megaphone} onClick={() => setIsMobileMenuOpen(false)}>
                Announcements
              </NavLink>
              
              {userRole === 'admin' && (
                <NavLink to="/admin" icon={Settings} onClick={() => setIsMobileMenuOpen(false)}>
                  Admin Panel
                </NavLink>
              )}
              
              <NavLink to="/profile" icon={User} onClick={() => setIsMobileMenuOpen(false)}>
                Profile
              </NavLink>
              
              <div className="pt-4 mt-4 border-t border-gray-200">
                <div className="px-3 py-2 text-sm text-gray-600">
                  Welcome, <span className="font-medium">{username}</span>
                </div>
                <div className="px-3 py-1">
                  <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full capitalize">
                    {userRole}
                  </span>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 w-full px-3 py-2 mt-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors duration-200"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;