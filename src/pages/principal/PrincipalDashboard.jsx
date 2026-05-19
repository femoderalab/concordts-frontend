import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import useAuth from '../../hooks/useAuth';
import { getDashboardStats } from '../../services/dashboardService';
import { getAllStaff } from '../../services/staffService';
import { getStudents } from '../../services/studentService';
import { getClasses } from '../../services/academicService';
import { 
  Users, GraduationCap, BookOpen, DollarSign, 
  TrendingUp, AlertCircle, Eye, RefreshCw,
  UserCheck, FileText, Award, Calendar, Clock,
  School, BarChart3, PieChart, ChevronRight,
  Download, Filter, Search, X, Shield,
  Activity, CheckCircle, XCircle, TrendingDown
} from 'lucide-react';
import Alert from '../../components/common/Alert';
import { Text, Button, Card } from '../../components/ui';

// ============================================
// DESIGN SYSTEM COMPONENTS
// ============================================

// Stat Card Component
const StatCard = ({ title, value, icon: Icon, color, bgColor, trend, trendValue }) => (
  <Card className="p-3 hover:shadow-md transition-all duration-200">
    <div className="flex items-center justify-between">
      <div>
        <Text variant="h3" className="font-bold text-gray-900">{value}</Text>
        <Text variant="tiny" className="text-gray-400">{title}</Text>
      </div>
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${bgColor}`}>
        <Icon size={16} className={color} />
      </div>
    </div>
    {trend && (
      <div className="flex items-center gap-1 mt-2">
        {trend === 'up' ? (
          <TrendingUp size={10} className="text-green-500" />
        ) : (
          <TrendingDown size={10} className="text-red-500" />
        )}
        <Text variant="tiny" className={trend === 'up' ? 'text-green-600' : 'text-red-600'}>
          {trendValue} from last month
        </Text>
      </div>
    )}
  </Card>
);

// Recent Item Component
const RecentItem = ({ item, type, onView }) => {
  const getIcon = () => {
    if (type === 'staff') return <UserCheck size={12} className="text-green-600" />;
    if (type === 'student') return <Users size={12} className="text-blue-600" />;
    return <School size={12} className="text-purple-600" />;
  };
  
  const getName = () => {
    if (type === 'staff') return `${item.user?.first_name || ''} ${item.user?.last_name || ''}`.trim() || 'Unknown';
    if (type === 'student') return `${item.user?.first_name || ''} ${item.user?.last_name || ''}`.trim() || 'Unknown';
    return item.name || 'Unknown';
  };
  
  const getSubText = () => {
    if (type === 'staff') return item.position_title || item.department || 'Staff';
    if (type === 'student') return item.class_level?.name || 'Not assigned';
    return '';
  };
  
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 -mx-2 px-2 rounded-lg transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
          {getIcon()}
        </div>
        <div>
          <Text variant="small" className="font-medium text-gray-800">{getName()}</Text>
          <Text variant="tiny" className="text-gray-400">{getSubText()}</Text>
        </div>
      </div>
      <button
        onClick={() => onView(item.id)}
        className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
        title="View Details"
      >
        <Eye size={14} />
      </button>
    </div>
  );
};

// Class Distribution Bar
const ClassDistributionBar = ({ name, count, percentage }) => (
  <div className="flex items-center justify-between gap-3">
    <Text variant="tiny" className="text-gray-600 w-24 truncate">{name}</Text>
    <div className="flex-1">
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div 
          className="h-full bg-[#D94801] rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
    <Text variant="small" className="font-medium text-gray-700 w-8 text-right">{count}</Text>
    <Text variant="tiny" className="text-gray-400 w-10 text-right">{percentage}%</Text>
  </div>
);

// Quick Nav Button
const QuickNavButton = ({ icon: Icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-200 group"
  >
    <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center group-hover:shadow transition-all">
      <Icon size={18} className="text-[#D94801]" />
    </div>
    <Text variant="tiny" className="text-gray-600">{label}</Text>
  </button>
);

// ============================================
// MAIN COMPONENT
// ============================================
const PrincipalDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalStaff: 0,
    totalClasses: 0,
    totalSubjects: 0,
    attendanceRate: 0,
    publishedResults: 0,
    feeCollectionRate: 0
  });
  const [recentStaff, setRecentStaff] = useState([]);
  const [recentStudents, setRecentStudents] = useState([]);
  const [classDistribution, setClassDistribution] = useState([]);
  
  const isPrincipalView = ['principal', 'vice_principal', 'head', 'hm', 'admin'].includes(user?.role);

  const loadDashboardData = useCallback(async () => {
    if (!isPrincipalView) return;
    
    try {
      setLoading(true);
      setError('');
      
      const [dashboardStats, staffData, studentsData, classesData] = await Promise.all([
        getDashboardStats().catch(() => null),
        getAllStaff({ limit: 5, ordering: '-created_at' }).catch(() => ({ results: [] })),
        getStudents({ limit: 5, ordering: '-created_at' }).catch(() => ({ results: [] })),
        getClasses({ is_active: true }).catch(() => ({ results: [] }))
      ]);
      
      if (dashboardStats) {
        setStats({
          totalStudents: dashboardStats.totalStudents || 0,
          totalStaff: dashboardStats.totalStaff || 0,
          totalClasses: dashboardStats.totalClasses || 0,
          totalSubjects: dashboardStats.totalSubjects || 0,
          attendanceRate: dashboardStats.attendanceRate || 85,
          publishedResults: dashboardStats.publishedResults || 0,
          feeCollectionRate: dashboardStats.feeCollectionRate || 75
        });
      }
      
      const staffList = staffData?.results || staffData || [];
      setRecentStaff(staffList.slice(0, 5));
      
      const studentList = studentsData?.results || studentsData || [];
      setRecentStudents(studentList.slice(0, 5));
      
      const classList = classesData?.results || classesData || [];
      const distribution = classList.reduce((acc, cls) => {
        const level = cls.class_level?.name || 'Other';
        acc[level] = (acc[level] || 0) + 1;
        return acc;
      }, {});
      const totalClasses = Object.values(distribution).reduce((a, b) => a + b, 0);
      setClassDistribution(
        Object.entries(distribution).map(([name, count]) => ({ 
          name, 
          count, 
          percentage: totalClasses > 0 ? Math.round((count / totalClasses) * 100) : 0 
        }))
      );
      
    } catch (err) {
      console.error('Error loading dashboard:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, [isPrincipalView]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num?.toLocaleString() || '0';
  };

  const handleViewStaff = (id) => navigate(`/staff/${id}`);
  const handleViewStudent = (id) => navigate(`/students/${id}`);

  if (!isPrincipalView) {
    return (
      <DashboardLayout title="Access Denied">
        <div className="flex items-center justify-center min-h-[60vh] px-4">
          <div className="text-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="text-red-500" size={28} />
            </div>
            <Text variant="h3" className="font-bold text-gray-800 mb-2">Access Denied</Text>
            <Text variant="body" className="text-gray-500 mb-4">You don't have permission to access the Principal Dashboard.</Text>
            <Button variant="primary" size="small" onClick={() => navigate('/dashboard')}>
              Go to Dashboard
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (loading) {
    return (
      <DashboardLayout title="Principal Dashboard">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <RefreshCw className="animate-spin h-8 w-8 text-[#D94801] mx-auto mb-3" />
            <Text variant="body" className="text-gray-400">Loading dashboard data...</Text>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Principal Dashboard">
      {/* Fixed height container with internal scrolling */}
      <div className="h-[calc(100vh-120px)] flex flex-col px-3 sm:px-4 lg:px-6">
        
        {/* STICKY HEADER SECTION */}
        <div className="sticky top-0 z-20 bg-gray-50 -mx-3 sm:-mx-4 lg:-mx-6 px-3 sm:px-4 lg:px-6 pt-4 pb-2">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#1D2B49] rounded-xl flex items-center justify-center shadow-sm">
                  <Shield size={14} className="text-white" />
                </div>
                <Text variant="h2" className="font-bold">Principal Dashboard</Text>
              </div>
              <Text variant="caption" className="text-gray-400 pl-9">
                Welcome, {user?.first_name} {user?.last_name} • View-only access
              </Text>
            </div>
            <Button variant="outline" size="small" icon={RefreshCw} onClick={loadDashboardData} loading={loading}>
              Refresh
            </Button>
          </div>

          {/* Error Alert */}
          {error && <Alert type="error" message={error} onClose={() => setError('')} className="mb-3" />}

          {/* Stats Cards - 4 columns on desktop, 2 on mobile */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-3">
            <StatCard title="Total Students" value={formatNumber(stats.totalStudents)} icon={Users} color="text-blue-600" bgColor="bg-blue-100" />
            <StatCard title="Total Staff" value={formatNumber(stats.totalStaff)} icon={UserCheck} color="text-green-600" bgColor="bg-green-100" />
            <StatCard title="Total Classes" value={formatNumber(stats.totalClasses)} icon={School} color="text-purple-600" bgColor="bg-purple-100" />
            <StatCard title="Total Subjects" value={formatNumber(stats.totalSubjects)} icon={BookOpen} color="text-yellow-600" bgColor="bg-yellow-100" />
          </div>

          {/* Second Row Stats */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-3">
            <Card className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <Text variant="h3" className="font-bold text-gray-900">{stats.attendanceRate}%</Text>
                  <Text variant="tiny" className="text-gray-400">Attendance</Text>
                </div>
                <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center">
                  <Calendar size={16} className="text-teal-600" />
                </div>
              </div>
              <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-teal-500 rounded-full transition-all duration-500"
                  style={{ width: `${stats.attendanceRate}%` }}
                />
              </div>
            </Card>
            
            <Card className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <Text variant="h3" className="font-bold text-gray-900">{formatNumber(stats.publishedResults)}</Text>
                  <Text variant="tiny" className="text-gray-400">Results</Text>
                </div>
                <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                  <FileText size={16} className="text-orange-600" />
                </div>
              </div>
              <Text variant="tiny" className="text-gray-400 mt-2">Published results</Text>
            </Card>
            
            <Card className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <Text variant="h3" className="font-bold text-gray-900">{stats.feeCollectionRate}%</Text>
                  <Text variant="tiny" className="text-gray-400">Fee Collection</Text>
                </div>
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <DollarSign size={16} className="text-emerald-600" />
                </div>
              </div>
              <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${stats.feeCollectionRate}%` }}
                />
              </div>
            </Card>
          </div>

          {/* View Only Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-2.5 mb-2">
            <div className="flex items-center gap-2">
              <Eye size={14} className="text-blue-600" />
              <Text variant="tiny" className="text-blue-700">
                You are in <strong>view-only mode</strong>. To make changes, please contact the system administrator.
              </Text>
            </div>
          </div>
        </div>

        {/* SCROLLABLE CONTENT SECTION */}
        <div className="flex-1 overflow-y-auto min-h-0 -mx-3 sm:-mx-4 lg:-mx-6 px-3 sm:px-4 lg:px-6 pb-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            
            {/* Recent Staff */}
            <Card className="overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                <Text variant="small" className="font-semibold text-gray-900 flex items-center gap-2">
                  <UserCheck size={14} className="text-green-600" />
                  Recent Staff Hires
                </Text>
                <Button variant="ghost" size="tiny" onClick={() => navigate('/staff')} icon={ChevronRight} iconPosition="right">
                  View All
                </Button>
              </div>
              <div className="p-3">
                {recentStaff.length === 0 ? (
                  <div className="text-center py-6">
                    <UserCheck size={24} className="mx-auto text-gray-300 mb-2" />
                    <Text variant="tiny" className="text-gray-400">No staff records</Text>
                  </div>
                ) : (
                  recentStaff.map(staff => (
                    <RecentItem key={staff.id} item={staff} type="staff" onView={handleViewStaff} />
                  ))
                )}
              </div>
            </Card>

            {/* Recent Students */}
            <Card className="overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                <Text variant="small" className="font-semibold text-gray-900 flex items-center gap-2">
                  <Users size={14} className="text-blue-600" />
                  Recent Students
                </Text>
                <Button variant="ghost" size="tiny" onClick={() => navigate('/students')} icon={ChevronRight} iconPosition="right">
                  View All
                </Button>
              </div>
              <div className="p-3">
                {recentStudents.length === 0 ? (
                  <div className="text-center py-6">
                    <Users size={24} className="mx-auto text-gray-300 mb-2" />
                    <Text variant="tiny" className="text-gray-400">No student records</Text>
                  </div>
                ) : (
                  recentStudents.map(student => (
                    <RecentItem key={student.id} item={student} type="student" onView={handleViewStudent} />
                  ))
                )}
              </div>
            </Card>
          </div>

          {/* Class Distribution */}
          <Card className="mt-4 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
              <Text variant="small" className="font-semibold text-gray-900 flex items-center gap-2">
                <BarChart3 size={14} className="text-[#D94801]" />
                Class Distribution
              </Text>
            </div>
            <div className="p-4">
              {classDistribution.length === 0 ? (
                <div className="text-center py-6">
                  <School size={24} className="mx-auto text-gray-300 mb-2" />
                  <Text variant="tiny" className="text-gray-400">No class data available</Text>
                </div>
              ) : (
                <div className="space-y-3">
                  {classDistribution.map((item, idx) => (
                    <ClassDistributionBar 
                      key={idx}
                      name={item.name}
                      count={item.count}
                      percentage={item.percentage}
                    />
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* Quick Navigation */}
          <Card className="mt-4 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
              <Text variant="small" className="font-semibold text-gray-900">Quick Navigation</Text>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <QuickNavButton icon={UserCheck} label="View Staff" onClick={() => navigate('/staff')} />
                <QuickNavButton icon={Users} label="View Students" onClick={() => navigate('/students')} />
                <QuickNavButton icon={School} label="View Classes" onClick={() => navigate('/academics/classes')} />
                <QuickNavButton icon={FileText} label="View Results" onClick={() => navigate('/reports/results')} />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PrincipalDashboard;