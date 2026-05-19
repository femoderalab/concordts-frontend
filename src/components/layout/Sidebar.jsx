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
  ChevronRight as ChevronRightIcon,
  Library,
  CheckCircle,
  Wallet,
  Building2,
  LayoutDashboard,
  IdCard,
  UsersRound,
  Receipt,
  TrendingDown,
  PiggyBank,
  FileSpreadsheet,
  Printer,
  Eye,
  Lock,
  CalendarCheck,
  Table
} from 'lucide-react';
import { getAcademicSessions, getAcademicTerms } from '../../services/academicService';
import useAuth from '../../hooks/useAuth';

const Sidebar = () => {
  const { user, logout } = useAuth();
  
  const [isOpen, setIsOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    staff_management: false,
    academics: true,
    finance: false,
    library: false,
    reports: false,
    settings: false,
    attendance: false,
    timetable: false
  });
  const [currentSession, setCurrentSession] = useState(null);
  const [currentTerm, setCurrentTerm] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();
  const location = useLocation();

  const userRole = user?.role;
  
  // Role checks
  const isAdmin = ['head', 'hm', 'principal', 'vice_principal'].includes(userRole);
  const isPrincipalView = ['principal', 'vice_principal', 'head', 'hm'].includes(userRole);
  const isAccountant = ['accountant', 'head', 'hm', 'principal', 'vice_principal'].includes(userRole);
  const isSecretary = ['secretary', 'head', 'hm', 'principal', 'vice_principal', 'accountant'].includes(userRole);
  const isTeacher = ['teacher', 'form_teacher', 'subject_teacher'].includes(userRole);
  const isStaff = ['teacher', 'form_teacher', 'subject_teacher', 'accountant', 'secretary', 'librarian', 'laboratory', 'security', 'cleaner'].includes(userRole);
  const isStudent = userRole === 'student';
  const isParentUser = userRole === 'parent';

  // ==================== STAFF DASHBOARD MENU ITEMS ====================
  const staffDashboardItems = [
    { 
      path: '/dashboard', 
      label: 'Main Dashboard', 
      icon: <LayoutDashboard size={16} />,
      roles: ['head', 'hm', 'principal', 'vice_principal', 'accountant', 'secretary', 'teacher', 'form_teacher', 'subject_teacher']
    },
    { 
      path: '/principal-dashboard', 
      label: 'Principal Dashboard', 
      icon: <ShieldCheck size={16} />,
      roles: ['principal', 'vice_principal', 'head', 'hm'],
      description: 'View-only access'
    },
    { 
      path: '/accountant-dashboard', 
      label: 'Accountant Dashboard', 
      icon: <PiggyBank size={16} />,
      roles: ['accountant', 'head', 'hm', 'principal', 'vice_principal'],
      description: 'Payroll & Finance'
    },
    { 
      path: '/secretary-dashboard', 
      label: 'Secretary Dashboard', 
      icon: <ClipboardCheck size={16} />,
      roles: ['secretary', 'head', 'hm', 'principal', 'vice_principal', 'accountant'],
      description: 'ID Cards & Records'
    },
    { 
      path: '/teacher-dashboard', 
      label: 'Teacher Dashboard', 
      icon: <School size={16} />,
      roles: ['teacher', 'form_teacher', 'subject_teacher'],
      description: 'My Classes & Students'
    }
  ];

  // ==================== ADMIN FULL MENU ITEMS ====================
  const adminMenuItems = [
    { 
      path: '/dashboard', 
      label: 'Dashboard', 
      icon: <Home size={20} />,
      exact: true,
      roles: ['head', 'hm', 'principal', 'vice_principal', 'accountant', 'secretary', 'teacher']
    },
    { 
      path: '/students', 
      label: 'Students', 
      icon: <Users size={20} />,
      roles: ['head', 'hm', 'principal', 'vice_principal', 'secretary', 'accountant', 'teacher']
    },
    { 
      path: '/parents', 
      label: 'Parents', 
      icon: <UserCircle size={20} />,
      roles: ['head', 'hm', 'principal', 'vice_principal', 'secretary']
    },
    { 
      path: '/staff', 
      label: 'Staff Management', 
      icon: <Briefcase size={20} />,
      roles: ['head', 'hm', 'principal', 'vice_principal', 'secretary', 'accountant']
    },
    {
      label: 'Staff Dashboards',
      icon: <UserCog size={20} />,
      section: 'staff_management',
      roles: ['head', 'hm', 'principal', 'vice_principal', 'accountant', 'secretary', 'teacher'],
      children: [
        { path: '/principal-dashboard', label: 'Principal Dashboard', icon: <ShieldCheck size={16} />, roles: ['principal', 'vice_principal', 'head', 'hm'] },
        { path: '/accountant-dashboard', label: 'Accountant Dashboard', icon: <PiggyBank size={16} />, roles: ['accountant', 'head', 'hm', 'principal', 'vice_principal'] },
        { path: '/secretary-dashboard', label: 'Secretary Dashboard', icon: <ClipboardCheck size={16} />, roles: ['secretary', 'head', 'hm', 'principal', 'vice_principal', 'accountant'] },
        { path: '/teacher-dashboard', label: 'Teacher Dashboard', icon: <School size={16} />, roles: ['teacher', 'form_teacher', 'subject_teacher'] }
      ]
    },
    {
      label: 'Academics',
      icon: <BookOpen size={20} />,
      section: 'academics',
      roles: ['head', 'hm', 'principal', 'vice_principal', 'teacher', 'secretary'],
      children: [
        { path: '/academics/academic-year', label: 'Academic Year', icon: <Calendar size={16} /> },
        { path: '/academics/sessions', label: 'Academic Sessions', icon: <Clock size={16} /> },
        { path: '/academics/terms', label: 'Academic Terms', icon: <Grid3x3 size={16} /> },
        { path: '/academics/programs', label: 'Programs', icon: <Layers size={16} /> },
        { path: '/academics/class-levels', label: 'Class Levels', icon: <GraduationCap size={16} /> },
        { path: '/academics/subjects', label: 'Subjects', icon: <BookKey size={16} /> },
        { path: '/academics/promotion', label: 'Student Promotion', icon: <TrendingUp size={16} />, badge: 'NEW' },
        { path: '/academics/alumni', label: 'Alumni Management', icon: <Award size={16} />, badge: 'NEW' },
        { path: '/academics/class-management', label: 'Class Management', icon: <School size={16} />, badge: 'NEW' }
      ]
    },
    // ==================== ATTENDANCE SECTION ====================
    {
      label: 'Attendance',
      icon: <CalendarCheck size={20} />,
      section: 'attendance',
      roles: ['head', 'hm', 'principal', 'vice_principal', 'teacher', 'form_teacher', 'subject_teacher', 'secretary'],
      children: [
        { 
          path: '/attendance/take', 
          label: 'Take Attendance', 
          icon: <CalendarCheck size={16} />,
          roles: ['teacher', 'form_teacher', 'subject_teacher', 'head', 'hm', 'principal', 'vice_principal', 'secretary']
        },
        { 
          path: '/attendance/reports', 
          label: 'Attendance Reports', 
          icon: <FileText size={16} />,
          roles: ['head', 'hm', 'principal', 'vice_principal', 'secretary', 'teacher']
        },
        { 
          path: '/attendance/summary', 
          label: 'Student Summary', 
          icon: <Users size={16} />,
          roles: ['head', 'hm', 'principal', 'vice_principal', 'teacher', 'parent']
        }
      ]
    },
    // ==================== TIMETABLE SECTION ====================
    {
      label: 'Timetable',
      icon: <Table size={20} />,
      section: 'timetable',
      roles: ['head', 'hm', 'principal', 'vice_principal', 'teacher', 'form_teacher', 'subject_teacher', 'student', 'parent', 'secretary', 'accountant'],
      children: [
        {
          path: '/timetable',
          label: 'Timetable',
          icon: <Calendar size={20} />,
          roles: ['head', 'hm', 'principal', 'vice_principal', 'teacher', 'student', 'parent', 'secretary', 'accountant']
        },
        { 
          path: '/timetable/manage', 
          label: 'Manage Timetable', 
          icon: <Settings size={16} />,
          roles: ['head', 'hm', 'principal', 'vice_principal', 'secretary']
        },
        { 
          path: '/timetable/periods', 
          label: 'Manage Time Periods', 
          icon: <Clock size={16} /> 
        },
        { 
          path: '/timetable/days', 
          label: 'Manage School Days', 
          icon: <Calendar size={16} /> 
        }
      ]
    },
    {
      label: 'Finance',
      icon: <DollarSign size={20} />,
      section: 'finance',
      roles: ['head', 'hm', 'principal', 'vice_principal', 'accountant'],
      children: [
        { path: '/payments', label: 'Payment Portal', icon: <Wallet size={16} /> },
        { path: '/payments/admin', label: 'Fee Configuration', icon: <DollarSign size={16} /> },
        { path: '/payments/invoices', label: 'Invoice Management', icon: <Receipt size={16} /> },
        { path: '/payments/verification', label: 'Verify Payments', icon: <CheckCircle size={16} /> },
        { path: '/payments/analytics', label: 'Analytics', icon: <TrendingUp size={16} /> },
        { path: '/payments/bank-accounts', label: 'Bank Accounts', icon: <Building2 size={16} /> }
      ]
    },
    {
      label: 'Library',
      icon: <Library size={20} />,
      section: 'library',
      roles: ['head', 'hm', 'principal', 'vice_principal', 'teacher', 'student', 'parent', 'librarian'],
      children: [
        { path: '/library', label: 'Digital Library', icon: <BookOpen size={16} /> }
      ]
    },
    {
      label: 'Reports',
      icon: <BarChart3 size={20} />,
      section: 'reports',
      roles: ['head', 'hm', 'principal', 'vice_principal', 'teacher', 'accountant', 'secretary'],
      children: [
        { path: '/reports/results', label: 'Student Results', icon: <Award size={16} /> },
        { path: '/reports/attendance', label: 'Attendance', icon: <Clock size={16} /> }
      ]
    },
    {
      path: '/settings',
      label: 'Settings',
      icon: <Settings size={20} />,
      roles: ['head', 'hm', 'principal', 'vice_principal']
    }
  ];

  // ==================== TEACHER MENU ITEMS (Simplified) ====================
  const teacherMenuItems = [
    { 
      path: '/teacher-dashboard', 
      label: 'Dashboard', 
      icon: <Home size={20} />,
      exact: true 
    },
    { 
      path: '/students', 
      label: 'My Students', 
      icon: <Users size={20} /> 
    },
    { 
      path: '/attendance/take', 
      label: 'Take Attendance', 
      icon: <CalendarCheck size={20} /> 
    },
    { 
      path: '/timetable', 
      label: 'My Timetable', 
      icon: <Table size={20} /> 
    },
    { 
      path: '/reports/results', 
      label: 'Results Management', 
      icon: <Award size={20} /> 
    },
    { 
      path: '/library', 
      label: 'Library', 
      icon: <Library size={20} /> 
    },
    { 
      path: '/profile', 
      label: 'My Profile', 
      icon: <UserCircle size={20} /> 
    }
  ];

  // ==================== ACCOUNTANT MENU ITEMS (Simplified) ====================
  const accountantMenuItems = [
    { 
      path: '/accountant-dashboard', 
      label: 'Dashboard', 
      icon: <Home size={20} />,
      exact: true 
    },
    { 
      path: '/staff', 
      label: 'Staff Payroll', 
      icon: <Briefcase size={20} /> 
    },
    { 
      path: '/payments', 
      label: 'Payment Portal', 
      icon: <CreditCard size={20} /> 
    },
    { 
      path: '/payments/admin', 
      label: 'Fee Configuration', 
      icon: <DollarSign size={20} /> 
    },
    { 
      path: '/payments/verification', 
      label: 'Verify Payments', 
      icon: <CheckCircle size={20} /> 
    },
    { 
      path: '/payments/analytics', 
      label: 'Analytics', 
      icon: <TrendingUp size={20} /> 
    },
    { 
      path: '/timetable', 
      label: 'Timetable', 
      icon: <Table size={20} /> 
    }
  ];

  // ==================== SECRETARY MENU ITEMS (Simplified) ====================
  const secretaryMenuItems = [
    { 
      path: '/secretary-dashboard', 
      label: 'Dashboard', 
      icon: <Home size={20} />,
      exact: true 
    },
    { 
      path: '/students', 
      label: 'Students', 
      icon: <Users size={20} /> 
    },
    { 
      path: '/staff', 
      label: 'Staff', 
      icon: <Briefcase size={20} /> 
    },
    { 
      path: '/attendance/take', 
      label: 'Take Attendance', 
      icon: <CalendarCheck size={20} /> 
    },
    { 
      path: '/timetable/manage', 
      label: 'Manage Timetable', 
      icon: <Settings size={20} /> 
    },
    { 
      path: '/library', 
      label: 'Library', 
      icon: <Library size={20} /> 
    },
    { 
      path: '/payments', 
      label: 'Payment Status', 
      icon: <Eye size={20} />,
      description: 'View-only'
    }
  ];

  // ==================== PARENT MENU ITEMS ====================
  const parentMenuItems = [
    { 
      path: '/parent-portal', 
      label: 'Dashboard', 
      icon: <Home size={20} />,
      exact: true 
    },
    { 
      path: '/payments', 
      label: 'Payments', 
      icon: <CreditCard size={20} />,
      badge: 'NEW'
    },
    { 
      path: '/timetable', 
      label: 'Timetable', 
      icon: <Table size={20} /> 
    },
    { 
      path: '/library', 
      label: 'Library', 
      icon: <Library size={20} /> 
    },
    { 
      path: '/profile', 
      label: 'My Profile', 
      icon: <UserCircle size={20} /> 
    }
  ];

  // ==================== STUDENT MENU ITEMS ====================
  const studentMenuItems = [
    { 
      path: '/student-dashboard', 
      label: 'Dashboard', 
      icon: <Home size={20} />,
      exact: true 
    },
    { 
      path: '/payments', 
      label: 'Payments', 
      icon: <CreditCard size={20} />,
      badge: 'NEW'
    },
    { 
      path: '/timetable', 
      label: 'My Timetable', 
      icon: <Table size={20} /> 
    },
    { 
      path: '/library', 
      label: 'Library', 
      icon: <Library size={20} /> 
    },
    { 
      path: '/profile', 
      label: 'My Profile', 
      icon: <UserCircle size={20} /> 
    },
    { 
      path: '/settings', 
      label: 'Settings', 
      icon: <Settings size={20} /> 
    }
  ];

  // Determine which menu items to show based on role
  let menuItems = [];
  
  if (isAdmin) {
    menuItems = adminMenuItems;
  } else if (userRole === 'accountant') {
    menuItems = accountantMenuItems;
  } else if (userRole === 'secretary') {
    menuItems = secretaryMenuItems;
  } else if (isTeacher) {
    menuItems = teacherMenuItems;
  } else if (isParentUser) {
    menuItems = parentMenuItems;
  } else if (isStudent) {
    menuItems = studentMenuItems;
  } else if (isStaff) {
    menuItems = teacherMenuItems;
  }

  // Filter menu items by role permissions
  const filterMenuByRole = (items) => {
    return items.filter(item => {
      if (item.roles) {
        return item.roles.includes(userRole);
      }
      if (item.children) {
        item.children = item.children.filter(child => !child.roles || child.roles.includes(userRole));
        return item.children.length > 0;
      }
      return true;
    });
  };

  const filteredMenuItems = filterMenuByRole(menuItems);

  useEffect(() => {
    if (isAdmin || isStaff || isAccountant || isSecretary) {
      fetchCurrentAcademicInfo();
    }
  }, [isAdmin, isStaff, isAccountant, isSecretary]);

  const fetchCurrentAcademicInfo = async () => {
    try {
      setLoading(true);
      
      const [sessionsResponse, termsResponse] = await Promise.all([
        getAcademicSessions().catch(() => ({ results: [] })),
        getAcademicTerms().catch(() => ({ results: [] }))
      ]);
      
      const sessionsData = sessionsResponse.results || sessionsResponse || [];
      const termsData = termsResponse.results || termsResponse || [];
      
      const foundCurrentSession = sessionsData.find(session => session.is_current) || 
                                 sessionsData.find(session => session.status === 'active') || 
                                 sessionsData[0];
      setCurrentSession(foundCurrentSession || { name: '2024/2025', status: 'active' });
      
      const foundCurrentTerm = termsData.find(term => term.is_current) || 
                              termsData.find(term => term.status === 'active') || 
                              termsData[0];
      setCurrentTerm(foundCurrentTerm || { name: 'Second Term', term: 'second' });
      
    } catch (err) {
      console.error('Error fetching academic info:', err);
      setCurrentSession({ name: '2024/2025', status: 'active' });
      setCurrentTerm({ name: 'Second Term', term: 'second' });
    } finally {
      setLoading(false);
    }
  };

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);
  
  const toggleSection = (section) => {
    setExpandedSections(prev => {
      if (prev[section]) {
        return {
          staff_management: false,
          academics: false,
          finance: false,
          library: false,
          reports: false,
          settings: false,
          attendance: false,
          timetable: false
        };
      }
      return {
        staff_management: section === 'staff_management',
        academics: section === 'academics',
        finance: section === 'finance',
        library: section === 'library',
        reports: section === 'reports',
        settings: section === 'settings',
        attendance: section === 'attendance',
        timetable: section === 'timetable'
      };
    });
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/login');
    }
  };

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
                    {child.description && (
                      <span className="ml-auto text-[9px] text-gray-500 hidden lg:inline">
                        {child.description}
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

    // Check if user has permission to see this item
    if (item.roles && !item.roles.includes(userRole)) {
      return null;
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
        {!isCollapsed && item.description && (
          <span className="text-[9px] text-gray-500 hidden lg:inline">
            {item.description}
          </span>
        )}
      </NavLink>
    );
  };

  // Don't render sidebar for students (they have their own StudentLayout)
  if (isStudent) {
    return null;
  }

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
        {/* Logo / Header */}
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} p-4 border-b border-gray-800`}>
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CTS</span>
              </div>
              <span className="text-white font-semibold text-sm">ConcordTS</span>
            </div>
          )}
          {isCollapsed && (
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">CTS</span>
            </div>
          )}
        </div>

        {/* Collapse Toggle Button */}
        <button
          onClick={toggleCollapse}
          className="absolute -right-3 top-20 bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full p-1.5 shadow-lg border border-gray-700 hidden md:block"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRightIcon size={16} /> : <ChevronLeft size={16} />}
        </button>

        {/* User Info (when expanded) */}
        {!isCollapsed && user && (
          <div className="px-4 py-4 border-b border-gray-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">
                  {user?.first_name?.[0]?.toUpperCase() || 'U'}
                  {user?.last_name?.[0]?.toUpperCase() || ''}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">
                  {user?.first_name} {user?.last_name}
                </p>
                <p className="text-gray-400 text-xs truncate">
                  {user?.role?.replace('_', ' ').toUpperCase()}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className={`flex-1 px-4 overflow-y-auto custom-scrollbar ${isCollapsed ? 'px-2' : ''}`}>
          <div className="py-4">
            {/* Current Session Info (when expanded) */}
            {!isCollapsed && (isAdmin || isStaff || isAccountant || isSecretary) && currentSession && (
              <div className="mb-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Current Session</span>
                  {currentSession.is_current && (
                    <span className="text-[8px] px-1.5 py-0.5 bg-green-500/20 text-green-400 rounded-full">Active</span>
                  )}
                </div>
                <p className="text-sm font-medium text-white mt-1">{currentSession.name}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {currentTerm?.name} • {currentTerm?.term}
                </p>
                <div className="mt-2 w-full bg-gray-700 rounded-full h-1">
                  <div 
                    className="bg-primary-500 h-1 rounded-full"
                    style={{ width: '65%' }}
                  />
                </div>
                <p className="text-[9px] text-gray-500 mt-1">65% completed</p>
              </div>
            )}

            {/* Render menu items based on role */}
            <div className="space-y-1">
              {filteredMenuItems.map((item, idx) => renderMenuItem(item, idx))}
            </div>
          </div>
        </nav>

        {/* Footer / Logout */}
        <div className={`p-4 border-t border-gray-800 ${isCollapsed ? 'px-2' : ''}`}>
          <button
            onClick={handleLogout}
            className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'} p-2.5 rounded-lg transition-all duration-200 text-gray-400 hover:text-white hover:bg-white/5`}
          >
            <LogOut size={18} className={isCollapsed ? '' : 'mr-3'} />
            {!isCollapsed && <span className="text-sm">Logout</span>}
          </button>
          
          {!isCollapsed && (
            <div className="mt-4 text-center">
              <p className="text-[9px] text-gray-600">
                © 2024 ConcordTS School
              </p>
              <p className="text-[8px] text-gray-600 mt-0.5">
                v2.0.0
              </p>
            </div>
          )}
        </div>
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