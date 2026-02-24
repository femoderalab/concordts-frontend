import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { Search, Bell, Settings, User, LogOut, Menu, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const { user, logout, getUserFullName } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/login');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-neutral-200 shadow-soft">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Logo & Mobile Menu */}
          <div className="flex items-center">
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-neutral-600 hover:text-primary-600 hover:bg-primary-50 transition-colors"
            >
              <Menu size={24} />
            </button>

            {/* Logo and School Name */}
            <div className="flex items-center space-x-3 ml-2 md:ml-0">
              <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center shadow-medium">
                <img 
                  src="/logo.png" 
                  alt="Concord Tutor School Logo" 
                  className="w-8 h-8 object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<span class="text-white font-bold text-lg">C</span>';
                  }}
                />
              </div>
              <div className="hidden md:block">
                <h1 className="text-lg font-heading font-bold text-neutral-800">
                  Concord Tutor School
                </h1>
                <p className="text-xs text-neutral-500">Management System</p>
              </div>
            </div>
          </div>


          {/* Right side - Icons & User */}
          <div className="flex items-center space-x-2">
            {/* Mobile Search Button */}
            <button className="md:hidden p-2 text-neutral-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
              <Search size={22} />
            </button>



            {/* User dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-3 p-2 hover:bg-primary-50 rounded-xl transition-all duration-200 group"
              >
                <div className="w-9 h-9 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center shadow-soft">
                  <span className="text-white font-semibold text-sm">
                    {user?.first_name?.charAt(0) || 'U'}
                  </span>
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-medium text-neutral-800">{getUserFullName()}</p>
                  <p className="text-xs text-neutral-500 flex items-center">
                    {user?.role_display || user?.role}
                    <ChevronDown size={14} className="ml-1" />
                  </p>
                </div>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-strong border border-neutral-200 py-2 z-50 animate-slide-down">
                 
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center space-x-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors rounded-b-xl"
                  >
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                      <LogOut size={16} />
                    </div>
                    <div>
                      <span className="font-medium">Logout</span>
                      <p className="text-xs text-red-400">Sign out of account</p>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {mobileMenuOpen && (
          <div className="md:hidden px-4 py-3 border-t border-neutral-200 bg-neutral-50 animate-slide-down">
            <form onSubmit={handleSearch} className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={20} />
                <input
                  type="text"
                  placeholder="Search students, parents, staff..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent bg-white"
                />
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Dropdown overlay */}
      {dropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setDropdownOpen(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;