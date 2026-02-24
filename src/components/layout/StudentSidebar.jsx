// school-management-frontend/src/components/layout/StudentSidebar.jsx

import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Home,
  User,
  Award,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  Bell,
  Settings
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';

const StudentSidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Get student initials for avatar
  const getInitials = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    }
    return user?.registration_number?.slice(0, 2).toUpperCase() || 'ST';
  };

  const menuItems = [
    { 
      path: '/student-dashboard', 
      label: 'Dashboard', 
      icon: <Home size={20} />,
      exact: true 
    },
  ];

  return (
    <>
      {/* Mobile sidebar toggle */}
      <div className="md:hidden fixed top-20 left-4 z-40">
        <button
          onClick={toggleSidebar}
          className="p-2 bg-blue-600 text-white rounded-lg shadow-lg"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-30 
        transform transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static
        ${isCollapsed ? 'w-20' : 'w-64'}
        bg-gray-900 border-r border-gray-800
        flex flex-col h-screen shadow-xl
      `}>
        {/* Collapse Toggle Button */}
        <button
          onClick={toggleCollapse}
          className="absolute -right-3 top-6 bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full p-1.5 shadow-lg border border-gray-700 hidden md:block"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRightIcon size={16} /> : <ChevronLeft size={16} />}
        </button>

        {/* School Logo/Name */}
        <div className={`p-6 ${isCollapsed ? 'text-center' : ''}`}>
          {!isCollapsed ? (
            <div>
              <h1 className="text-2xl font-bold text-white">Concord Tutor School</h1>
            </div>
          ) : (
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mx-auto">
              <span className="text-white font-bold text-lg">C</span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className={`flex-1 px-4 overflow-y-auto custom-scrollbar ${isCollapsed ? 'px-2' : ''}`}>
          <div className="py-4">
            {!isCollapsed && (
              <p className="text-xs uppercase tracking-wider text-gray-500 font-medium px-2 mb-3">
                Student Menu
              </p>
            )}
            
            <div className="space-y-1">
              {menuItems.map((item, index) => (
                <NavLink
                  key={index}
                  to={item.path}
                  end={item.exact}
                  className={({ isActive }) =>
                    `flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} p-3 rounded-lg transition-all duration-200 mb-1 hover:bg-white/5 ${
                      isActive 
                        ? 'bg-white/10 text-white' 
                        : 'text-gray-300 hover:text-white'
                    }`
                  }
                >
                  <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
                    <div className={`p-1.5 rounded-md ${
                      location.pathname === item.path ? 'bg-blue-500/20' : 'bg-white/5'
                    }`}>
                      {React.cloneElement(item.icon, { 
                        size: 18,
                        className: location.pathname === item.path ? 'text-blue-300' : 'text-gray-400'
                      })}
                    </div>
                    {!isCollapsed && (
                      <span className="font-medium text-sm">{item.label}</span>
                    )}
                  </div>
                </NavLink>
              ))}
            </div>
          </div>
        </nav>

        {/* User Profile and Logout */}
        {!isCollapsed ? (
          <div className="p-4 border-t border-gray-800">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-3">
                <span className="text-white font-bold">{getInitials()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user?.first_name} {user?.last_name}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {user?.registration_number}
                </p>
              </div>
            </div>
          
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center px-4 py-2.5 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white transition-all text-sm font-medium"
            >
              <LogOut size={16} className="mr-2" />
              Logout
            </button>

            {/* Version Info */}
            <div className="mt-3 pt-3 border-t border-gray-800 text-center">
              <p className="text-xs text-gray-500">
                © {new Date().getFullYear()} concordts school
              </p>
            </div>
          </div>
        ) : (
          // Collapsed version
          <div className="p-4 border-t border-gray-800">
            <div className="flex justify-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">{getInitials()}</span>
              </div>
            </div>
            <div className="flex justify-center space-x-2">
              <button className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg">
                <Bell size={16} />
              </button>
              <button className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg">
                <Settings size={16} />
              </button>
            </div>
            <div className="flex justify-center mt-4">
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-20 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default StudentSidebar;