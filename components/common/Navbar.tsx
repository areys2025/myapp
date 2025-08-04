import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from './Button';
import { APP_NAME } from '../../constants'; // Using .tsx implicitly
import { UserRole } from '../../types';

interface NavbarProps {
  toggleSidebar?: () => void; // Optional: for mobile sidebar toggle
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Helper function to ensure proper role display
  const formatRole = (role: UserRole) => {
    return role as string; // UserRole enum values are already in proper format
  };

  return (
    <nav className="bg-neutral-dark shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            {toggleSidebar && (
               <button onClick={toggleSidebar} className="md:hidden mr-2 text-gray-300 hover:text-white focus:outline-none">
                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}
            <Link to="/dashboard" className="flex-shrink-0 text-white font-bold text-xl">
             <span className="text-base sm:text-lg font-semibold truncate max-w-[150px] sm:max-w-none">{APP_NAME}</span>

            </Link>
          </div>
          <div className="flex items-center">
            {user ? (
              <>
                <span className="text-gray-300 mr-4 hidden sm:block">
                  Welcome, {user.name} ({formatRole(user.role)})
                </span>
                <Button onClick={handleLogout} variant="secondary" size="sm">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Login
                </Link>
                <Link to="/register" className="ml-4 text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
