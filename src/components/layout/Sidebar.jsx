
// school-management-frontend/src/components/layout/Sidebar.jsx
import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  Home,
  Users,
  UserCircle,
  Briefcase,
  BookOpen,
  FileText,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  GraduationCap,
  UserCog,
  BookOpenCheck,
  BarChart3,
  DollarSign,
  BookKey,
  Calendar,
  Award,
  ClipboardCheck,
  CreditCard,
  School,
  ShieldCheck,
  Layers,
  BookMarked,
  Clock,
  Grid3x3,
  TrendingUp,
  Settings,
  Bell,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight as ChevronRightIcon
} from 'lucide-react';
import { getAcademicSessions, getAcademicTerms } from '../../services/academicService';
import useAuth from '../../hooks/useAuth'; // ADD THIS IMPORT

const Sidebar = () => {
  // ADD THIS LINE - Get current user
  const { user } = useAuth();
  
  const [isOpen, setIsOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    academics: true,
    staff_dashboard: false,
    reports: false,
    finance: false
  });
  const [currentSession, setCurrentSession] = useState(null);
  const [currentTerm, setCurrentTerm] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();
  const location = useLocation();

  // ADD THIS CHECK - If user is student, don't render admin sidebar
  if (user?.role === 'student') {
    return null; // Student will use StudentSidebar instead
  }

  useEffect(() => {
    fetchCurrentAcademicInfo();
  }, []);

  const fetchCurrentAcademicInfo = async () => {
    try {
      setLoading(true);
      
      // Fetch sessions and terms
      const [sessionsResponse, termsResponse] = await Promise.all([
        getAcademicSessions().catch(() => ({ results: [] })),
        getAcademicTerms().catch(() => ({ results: [] }))
      ]);
      
      const sessionsData = sessionsResponse.results || sessionsResponse || [];
      const termsData = termsResponse.results || termsResponse || [];
      
      // Find current session
      const foundCurrentSession = sessionsData.find(session => session.is_current) || 
                                 sessionsData.find(session => session.status === 'active') || 
                                 sessionsData[0];
      setCurrentSession(foundCurrentSession || { name: '2024/2025', status: 'active' });
      
      // Find current term
      const foundCurrentTerm = termsData.find(term => term.is_current) || 
                              termsData.find(term => term.status === 'active') || 
                              termsData[0];
      setCurrentTerm(foundCurrentTerm || { name: 'Second Term', term: 'second' });
      
    } catch (err) {
      console.error('Error fetching academic info:', err);
      // Fallback data
      setCurrentSession({ name: '2024/2025', status: 'active' });
      setCurrentTerm({ name: 'Second Term', term: 'second' });
    } finally {
      setLoading(false);
    }
  };

  const calculateDaysRemaining = () => {
    if (!currentSession || !currentSession.end_date) {
      return 45; // Default fallback
    }
    
    const endDate = new Date(currentSession.end_date);
    const today = new Date();
    const diffTime = endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(0, diffDays);
  };

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);
  
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const menuItems = [
    { 
      path: '/dashboard', 
      label: 'Dashboard', 
      icon: <Home size={20} />,
      exact: true 
    },
    { 
      path: '/students', 
      label: 'Students', 
      icon: <Users size={20} />,
      badge: '12'
    },
    { 
      path: '/parents', 
      label: 'Parents', 
      icon: <UserCircle size={20} /> 
    },
    { 
      path: '/staff', 
      label: 'Staff', 
      icon: <Briefcase size={20} /> 
    },
    {
      label: 'Staff Dashboard',
      icon: <UserCog size={20} />,
      section: 'staff_dashboard',
      children: [
        { path: '/staff/principal', label: 'Principal', icon: <ShieldCheck size={16} /> },
        { path: '/staff/secretary', label: 'Secretary', icon: <ClipboardCheck size={16} /> },
        { path: '/staff/teachers', label: 'Teachers', icon: <School size={16} /> },
        { path: '/staff/accountant', label: 'Accountant', icon: <CreditCard size={16} /> }
      ]
    },
    {
      label: 'Academics',
      icon: <BookOpen size={20} />,
      section: 'academics',
      children: [
        // Main Academics Dashboard
        // { path: '/academics', label: 'Academic Dashboard', icon: <BookMarked size={16} /> },
        { path: '/academics/academic-year', label: 'Academic Year', icon: <Calendar size={16} /> },
        { path: '/academics/sessions', label: 'Academic Sessions', icon: <Clock size={16} /> },
        { path: '/academics/terms', label: 'Academic Terms', icon: <Grid3x3 size={16} /> },
        { path: '/academics/programs', label: 'Programs', icon: <Layers size={16} /> },
        { path: '/academics/class-levels', label: 'Class Levels', icon: <GraduationCap size={16} /> },
        { path: '/academics/subjects', label: 'Subjects', icon: <BookKey size={16} /> }
      ]
    },
    {
      label: 'Reports',
      icon: <BarChart3 size={20} />,
      section: 'reports',
      children: [
        { path: '/reports/results', label: 'Results', icon: <Award size={16} /> }, 
      ]
    },
    {
      label: 'Finance',
      icon: <DollarSign size={20} />,
      section: 'finance',
      children: [
        { path: '/finance/fees', label: 'Fee Management', icon: <CreditCard size={16} /> },
        { path: '/finance/invoices', label: 'Invoices', icon: <FileText size={16} /> },
        { path: '/finance/payments', label: 'Payments', icon: <DollarSign size={16} /> },
        { path: '/finance/reports', label: 'Financial Reports', icon: <BarChart3 size={16} /> }
      ]
    },
    {
      path: '/settings',
      label: 'Settings',
      icon: <Settings size={20} />
    }
  ];

  const renderMenuItem = (item, index) => {
    if (item.children) {
      const isExpanded = expandedSections[item.section] || false;
      const isActive = item.children.some(child => 
        location.pathname === child.path || 
        location.pathname.startsWith(child.path)
      );
      
      return (
        <div key={`menu-${item.section}-${index}`} className="mb-1">
          <button
            onClick={() => toggleSection(item.section)}
            className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 mb-1 hover:bg-white/5 ${
              isActive 
                ? 'bg-white/10 text-white' 
                : 'text-gray-300 hover:text-white'
            } ${isCollapsed ? 'justify-center px-2' : ''}`}
          >
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
              <div className={`p-1.5 rounded-md ${
                isActive ? 'bg-primary-500/20' : 'bg-white/5'
              }`}>
                {React.cloneElement(item.icon, { 
                  size: 18,
                  className: isActive ? 'text-primary-300' : 'text-gray-400'
                })}
              </div>
              {!isCollapsed && (
                <span className="font-medium text-sm">{item.label}</span>
              )}
            </div>
            {!isCollapsed && (
              isExpanded ? 
                <ChevronDown size={16} className={isActive ? 'text-primary-300' : 'text-gray-400'} /> : 
                <ChevronRight size={16} className={isActive ? 'text-primary-300' : 'text-gray-400'} />
            )}
          </button>
          
          {!isCollapsed && isExpanded && (
            <div className="ml-8 mt-1 space-y-1">
              {item.children.map((child, childIndex) => {
                const isChildActive = location.pathname === child.path;
                return (
                  <NavLink
                    key={`child-${item.section}-${childIndex}`}
                    to={child.path}
                    className={({ isActive }) =>
                      `flex items-center space-x-2 p-2.5 text-sm rounded-lg transition-all duration-200 ${
                        isActive 
                          ? 'bg-primary-500/20 text-primary-200 font-medium border-l-2 border-primary-400' 
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`
                    }
                  >
                    <span className={`${isChildActive ? 'text-primary-300' : 'text-gray-500'}`}>
                      {child.icon}
                    </span>
                    <span className="truncate">{child.label}</span>
                    {child.badge && (
                      <span className="ml-auto px-1.5 py-0.5 text-xs bg-primary-500 text-white rounded-full">
                        {child.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    return (
      <NavLink
        key={`item-${item.path}-${index}`}
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
            location.pathname === item.path ? 'bg-primary-500/20' : 'bg-white/5'
          }`}>
            {React.cloneElement(item.icon, { 
              size: 18,
              className: location.pathname === item.path ? 'text-primary-300' : 'text-gray-400'
            })}
          </div>
          {!isCollapsed && (
            <span className="font-medium text-sm">{item.label}</span>
          )}
        </div>
        {!isCollapsed && item.badge && (
          <span className="px-2 py-0.5 text-xs bg-primary-500 text-white rounded-full animate-pulse">
            {item.badge}
          </span>
        )}
      </NavLink>
    );
  };

  const daysRemaining = calculateDaysRemaining();

  return (
    <>
      {/* Mobile sidebar toggle */}
      <div className="md:hidden fixed top-20 left-4 z-40">
        <button
          onClick={toggleSidebar}
          className="p-2 bg-primary-600 text-white rounded-lg shadow-lg"
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

        {/* Navigation */}
        <nav className={`flex-1 px-4 overflow-y-auto custom-scrollbar ${isCollapsed ? 'px-2' : ''}`}>
          <div className="py-4">
            {!isCollapsed && (
              <p className="text-xs uppercase tracking-wider text-gray-500 font-medium px-2 mb-3">
                <br /><br /><br /><br /><br />
              </p>
            )}
            
            {/* Main Menu Items */}
            <div className="space-y-1">
              {menuItems.slice(0, 4).map(renderMenuItem)}
            </div>

            {/* Separator */}
            <div className="my-4 border-t border-gray-800"></div>

            {/* Staff Dashboard Section */}
            {renderMenuItem(menuItems[4])}

            {/* Separator */}
            <div className="my-4 border-t border-gray-800"></div>

            {/* Academics Section - Highlighted */}
            <div className="relative mb-3">
              {!isCollapsed && (
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-transparent rounded-lg"></div>
              )}
              <div className="relative">
                {!isCollapsed && location.pathname.includes('/academics') && (
                  <div className="absolute -left-4 top-0 bottom-0 w-1 bg-primary-500 rounded-r"></div>
                )}
                {renderMenuItem(menuItems[5])}
              </div>
            </div>

            {/* Reports Section */}
            {renderMenuItem(menuItems[6])}

          </div>
          
          {/* Quick Stats - Only shown when not collapsed */}
          {!isCollapsed && expandedSections.academics && (
            <div className="mt-4 px-3 py-3 bg-gray-800/50 rounded-lg border border-gray-700">
              <p className="text-xs text-gray-400 mb-2 font-medium">Academic Overview</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-center">
                  <p className="text-xs text-gray-500">Sessions</p>
                  <p className="text-sm text-white font-bold">6</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">Classes</p>
                  <p className="text-sm text-white font-bold">18</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">Subjects</p>
                  <p className="text-sm text-white font-bold">59</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">Programs</p>
                  <p className="text-sm text-white font-bold">6</p>
                </div>
              </div>
            </div>
          )}
        </nav>

        {/* User Profile and System Status - Only shown when not collapsed */}
        {!isCollapsed && (
          <div className="p-4 border-t border-gray-800">


            {/* Version Info - Simplified */}
            <div className="mt-3 pt-3 border-t border-gray-800 text-center">
              <p className="text-xs text-gray-500">
                © {new Date().getFullYear()} concordts school
              </p>
            </div>
          </div>
        )}

        {/* Collapsed User Info */}
        {isCollapsed && (
          <div className="p-4 border-t border-gray-800">
            <div className="flex justify-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">JD</span>
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

export default Sidebar;