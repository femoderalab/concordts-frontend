import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import Alert from '../components/common/Alert';
import Button from '../components/common/Button';
import useAuth from '../hooks/useAuth';
import { 
  getDashboardStats, 
  getParentDashboardStats,
  getStudentDashboardStats,
  getTeacherDashboardStats 
} from '../services/dashboardService';
import { getRecentActivities } from '../services/activityService';
import { handleApiError } from '../services/api';
import { 
  Users, 
  GraduationCap, 
  UserCog, 
  Briefcase,
  UserPlus,
  FileText,
  Settings,
  Users2,
  UserCheck,
  MessageSquare,
  CreditCard,
  BookOpen,
  Award,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  RefreshCw,
  Activity,
  Database,
  Server,
  Book,
  School,
  ChartBar,
  Bell,
  Shield,
  Zap,
  BarChart,
  TrendingDown,
  UserX,
  Calendar,
  Mail,
  Eye,
  Download,
  Filter,
  Home,
  Layers,
  Cpu,
  PieChart,
  LineChart,
  DollarSign,
  Percent,
  Target,
  Phone,
  MapPin,
  Globe,
  ChevronRight,
  X
} from 'lucide-react';

// ============================================
// DESIGN SYSTEM COMPONENTS
// ============================================

// Typography (Sora font)
const Text = ({ variant = 'body', children, className = '' }) => {
  const variants = {
    h1: 'text-2xl md:text-3xl font-bold',
    h2: 'text-xl md:text-2xl font-semibold',
    h3: 'text-lg md:text-xl font-semibold',
    h4: 'text-base md:text-lg font-medium',
    body: 'text-sm md:text-base',
    small: 'text-xs md:text-sm',
    caption: 'text-[10px] md:text-xs',
    tiny: 'text-[9px] md:text-[10px]',
  };
  return <div className={`${variants[variant]} text-gray-800 ${className}`}>{children}</div>;
};

// Card Component
const Card = ({ children, className = '', hover = false }) => (
  <div className={`bg-white rounded-2xl shadow-sm ${hover ? 'transition-shadow duration-200 hover:shadow-md' : ''} ${className}`}>
    {children}
  </div>
);

// Stat Card Component
const DashboardStatCard = ({ title, value, icon: Icon, color, subtitle, onClick }) => (
  <Card className="p-4 cursor-pointer hover:shadow-md transition-all" onClick={onClick}>
    <div className="flex items-center justify-between mb-2">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={18} className="text-gray-700" />
      </div>
      <Text variant="tiny" className="text-gray-400 uppercase">{title}</Text>
    </div>
    <Text variant="h3" className="font-bold text-gray-900">{value}</Text>
    {subtitle && <Text variant="tiny" className="text-gray-400 mt-1">{subtitle}</Text>}
  </Card>
);

// Activity Item Component
const ActivityItem = ({ activity, getActivityIcon, formatTimeAgo, onClick }) => (
  <div 
    className="flex items-start py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors cursor-pointer px-3 rounded-xl"
    onClick={onClick}
  >
    <div className="p-2 mr-3 flex-shrink-0">{getActivityIcon(activity.type)}</div>
    <div className="flex-1 min-w-0">
      <Text variant="small" className="text-gray-900 mb-0.5">{activity.description}</Text>
      <div className="flex items-center gap-2 text-[10px] text-gray-400">
        <span className="font-medium">{activity.user_name}</span>
        {activity.user_role && <span className="capitalize">• {activity.user_role.replace('_', ' ')}</span>}
        <span>• {formatTimeAgo(activity.created_at)}</span>
      </div>
    </div>
    <ChevronRight size={14} className="text-gray-300 flex-shrink-0" />
  </div>
);

// Quick Action Button
const QuickAction = ({ icon: Icon, label, onClick, color }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-200 hover:shadow-md transition-all hover:border-[#D94801]/30 group"
  >
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 ${color} group-hover:scale-105 transition-transform`}>
      <Icon size={18} className="text-gray-700" />
    </div>
    <Text variant="tiny" className="font-medium text-gray-700">{label}</Text>
  </button>
);

// Loading Skeleton
const LoadingSkeleton = () => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 animate-pulse">
          <div className="flex justify-between mb-2"><div className="w-10 h-10 bg-gray-200 rounded-xl"></div><div className="w-16 h-3 bg-gray-200 rounded"></div></div>
          <div className="h-7 w-20 bg-gray-200 rounded mb-1"></div><div className="h-3 w-24 bg-gray-100 rounded"></div>
        </div>
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-4 animate-pulse"><div className="h-5 w-32 bg-gray-200 rounded mb-4"></div>{[1,2,3,4].map(i=><div key={i} className="flex items-center mb-3"><div className="w-8 h-8 bg-gray-200 rounded mr-3"></div><div><div className="h-4 w-40 bg-gray-200 rounded mb-1"></div><div className="h-3 w-24 bg-gray-100 rounded"></div></div></div>)}</div>
      <div className="bg-white rounded-2xl border border-gray-100 p-4 animate-pulse"><div className="h-5 w-36 bg-gray-200 rounded mb-4"></div><div className="space-y-3">{ [1,2,3,4].map(i=><div key={i} className="h-12 bg-gray-100 rounded"></div>)}</div></div>
    </div>
  </div>
);

// ============================================
// MAIN COMPONENT
// ============================================
const Dashboard = () => {
  const navigate = useNavigate();
  const { user, getUserFullName, isAdmin } = useAuth();
  
  const [stats, setStats] = useState(null);
  const [parentStats, setParentStats] = useState(null);
  const [studentStats, setStudentStats] = useState(null);
  const [teacherStats, setTeacherStats] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      setRefreshing(true);

      const userRole = user?.role;
      
      if (userRole === 'parent') {
        const parentData = await getParentDashboardStats();
        setParentStats(parentData);
      } else if (userRole === 'student') {
        const studentData = await getStudentDashboardStats();
        setStudentStats(studentData);
      } else if (userRole === 'teacher' || userRole === 'form_teacher' || userRole === 'subject_teacher') {
        const teacherData = await getTeacherDashboardStats();
        setTeacherStats(teacherData);
      } else {
        const dashboardData = await getDashboardStats();
        setStats(dashboardData);
      }

      const activities = await getRecentActivities(10);
      setRecentActivities(Array.isArray(activities) ? activities : []);

    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage || 'Failed to load dashboard data');
      console.error('Error fetching dashboard data:', err);
      
      if (err.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user, navigate]);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  const getActivityIcon = (activityType) => {
    const icons = {
      'user_created': <UserPlus size={14} className="text-blue-500" />,
      'user_updated': <UserCog size={14} className="text-emerald-500" />,
      'student_created': <GraduationCap size={14} className="text-indigo-500" />,
      'student_updated': <UserCog size={14} className="text-amber-500" />,
      'result_published': <FileText size={14} className="text-purple-500" />,
      'fee_paid': <CreditCard size={14} className="text-green-500" />,
      'staff_added': <Briefcase size={14} className="text-orange-500" />,
      'announcement': <Bell size={14} className="text-red-500" />,
      'system': <Server size={14} className="text-gray-500" />
    };
    return icons[activityType] || <Activity size={14} className="text-gray-400" />;
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleRefresh = () => fetchDashboardData();

  // Parent Dashboard
  if (user?.role === 'parent') {
    return (
      <DashboardLayout title="Dashboard">
        <div className="space-y-4 pb-10 px-3 sm:px-4 lg:px-6">
          {error && <Alert type="error" message={error} onClose={() => setError('')} />}
          
          {loading ? <LoadingSkeleton /> : parentStats && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <DashboardStatCard title="Children" value={parentStats.children_count || 0} icon={Users2} color="bg-blue-100" onClick={() => navigate('/parents/children')} />
                <DashboardStatCard title="Fee Balance" value={`₦${(parentStats.total_balance || 0).toLocaleString()}`} icon={CreditCard} color="bg-amber-100" onClick={() => navigate('/finance')} />
                <DashboardStatCard title="Attendance" value={`${parentStats.attendance_rate || 0}%`} icon={UserCheck} color="bg-emerald-100" onClick={() => navigate('/attendance')} />
                <DashboardStatCard title="Messages" value={parentStats.unread_messages || 0} icon={MessageSquare} color="bg-indigo-100" onClick={() => navigate('/messages')} />
              </div>

              {parentStats.children && parentStats.children.length > 0 && (
                <Card className="p-4">
                  <div className="flex items-center justify-between mb-4"><Text variant="h4" className="font-bold">My Children</Text><Button variant="outline" size="tiny" onClick={() => navigate('/parents/children')}>View All</Button></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {parentStats.children.map((child) => (
                      <div key={child.id} className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl cursor-pointer hover:shadow-md transition-all" onClick={() => navigate(`/students/${child.id}`)}>
                        <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center"><GraduationCap size={18} className="text-indigo-600" /></div>
                        <div><Text variant="small" className="font-bold">{child.first_name} {child.last_name}</Text><Text variant="tiny" className="text-gray-500">{child.class_level || 'Not assigned'}</Text></div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              <Card className="p-4">
                <div className="flex items-center justify-between mb-4"><Text variant="h4" className="font-bold">Recent Updates</Text><Button variant="outline" size="tiny" onClick={() => navigate('/notifications')}>View All</Button></div>
                {recentActivities.length > 0 ? recentActivities.map((activity) => (<ActivityItem key={activity.id} activity={activity} getActivityIcon={getActivityIcon} formatTimeAgo={formatTimeAgo} onClick={() => {}} />)) : <div className="text-center py-8"><Bell size={24} className="mx-auto text-gray-300 mb-2" /><Text variant="caption" className="text-gray-400">No recent updates</Text></div>}
              </Card>
            </>
          )}
        </div>
      </DashboardLayout>
    );
  }

  // Student Dashboard
  if (user?.role === 'student') {
    return (
      <DashboardLayout title="Dashboard">
        <div className="space-y-4 pb-10 px-3 sm:px-4 lg:px-6">
          {error && <Alert type="error" message={error} onClose={() => setError('')} />}
          
          {loading ? <LoadingSkeleton /> : studentStats && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <DashboardStatCard title="Attendance" value={`${studentStats.attendance_rate || 0}%`} icon={UserCheck} color="bg-emerald-100" onClick={() => navigate('/attendance')} />
                <DashboardStatCard title="Fee Balance" value={`₦${(studentStats.fee_balance || 0).toLocaleString()}`} icon={CreditCard} color="bg-amber-100" onClick={() => navigate('/finance')} />
                <DashboardStatCard title="Class" value={studentStats.current_class || 'N/A'} icon={School} color="bg-blue-100" onClick={() => navigate('/classes')} />
                <DashboardStatCard title="Results" value={studentStats.recent_results?.length || 0} icon={FileText} color="bg-purple-100" onClick={() => navigate('/results')} />
              </div>

              <Card className="p-4">
                <div className="flex items-center justify-between mb-4"><Text variant="h4" className="font-bold">Recent Activities</Text><Button variant="outline" size="tiny" onClick={() => navigate('/students/activities')}>View All</Button></div>
                {recentActivities.length > 0 ? recentActivities.map((activity) => (<ActivityItem key={activity.id} activity={activity} getActivityIcon={getActivityIcon} formatTimeAgo={formatTimeAgo} onClick={() => {}} />)) : <div className="text-center py-8"><Activity size={24} className="mx-auto text-gray-300 mb-2" /><Text variant="caption" className="text-gray-400">No recent activities</Text></div>}
              </Card>
            </>
          )}
        </div>
      </DashboardLayout>
    );
  }

  // Teacher Dashboard
  if (user?.role === 'teacher' || user?.role === 'form_teacher' || user?.role === 'subject_teacher') {
    return (
      <DashboardLayout title="Dashboard">
        <div className="space-y-4 pb-10 px-3 sm:px-4 lg:px-6">
          {error && <Alert type="error" message={error} onClose={() => setError('')} />}
          
          {loading ? <LoadingSkeleton /> : teacherStats && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <DashboardStatCard title="Students" value={teacherStats.total_students || 0} icon={Users} color="bg-blue-100" onClick={() => navigate('/students')} />
                <DashboardStatCard title="Classes" value={teacherStats.total_classes || 0} icon={School} color="bg-emerald-100" onClick={() => navigate('/classes')} />
                <DashboardStatCard title="Subjects" value={teacherStats.total_subjects || 0} icon={BookOpen} color="bg-purple-100" onClick={() => navigate('/subjects')} />
                <DashboardStatCard title="Pending" value={teacherStats.pending_grading?.length || 0} icon={FileText} color="bg-amber-100" onClick={() => navigate('/results/pending')} />
              </div>

              <Card className="p-4">
                <div className="flex items-center justify-between mb-4"><Text variant="h4" className="font-bold">Recent Activities</Text><Button variant="outline" size="tiny" onClick={() => navigate('/teachers/activities')}>View All</Button></div>
                {recentActivities.length > 0 ? recentActivities.map((activity) => (<ActivityItem key={activity.id} activity={activity} getActivityIcon={getActivityIcon} formatTimeAgo={formatTimeAgo} onClick={() => {}} />)) : <div className="text-center py-8"><Activity size={24} className="mx-auto text-gray-300 mb-2" /><Text variant="caption" className="text-gray-400">No recent activities</Text></div>}
              </Card>
            </>
          )}
        </div>
      </DashboardLayout>
    );
  }

  // Admin Dashboard
  return (
    <DashboardLayout title="Dashboard">
      <div className="h-[calc(100vh-120px)] flex flex-col px-3 sm:px-4 lg:px-6">
        
        {/* STICKY HEADER */}
        <div className="sticky top-0 z-20 bg-gray-50 -mx-3 sm:-mx-4 lg:-mx-6 px-3 sm:px-4 lg:px-6 pt-4 pb-2">
          
          {error && <div className="mb-3"><Alert type="error" message={error} onClose={() => setError('')} /></div>}
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto min-h-0 -mx-3 sm:-mx-4 lg:-mx-6 px-3 sm:px-4 lg:px-6 pb-4">
          {loading ? <LoadingSkeleton /> : stats && (
            <div className="space-y-4">
              {/* Primary Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <DashboardStatCard title="Total Users" value={stats?.totalUsers || 0} icon={Users} color="bg-blue-100" onClick={() => navigate('/users')} />
                <DashboardStatCard title="Students" value={stats?.totalStudents || 0} icon={GraduationCap} color="bg-emerald-100" onClick={() => navigate('/students')} />
                <DashboardStatCard title="Parents" value={stats?.totalParents || 0} icon={Users2} color="bg-purple-100" onClick={() => navigate('/parents')} />
                <DashboardStatCard title="Staff" value={stats?.totalStaff || 0} icon={Briefcase} color="bg-amber-100" onClick={() => navigate('/staff')} />
              </div>

              {/* Secondary Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <DashboardStatCard title="Results Published" value={stats?.publishedResults || 0} icon={FileText} color="bg-indigo-100" subtitle="Of total results" onClick={() => navigate('/results')} />
                <DashboardStatCard title="Classes" value={stats?.totalClasses || 0} icon={School} color="bg-blue-100" onClick={() => navigate('/academics/classes')} />
                <DashboardStatCard title="Subjects" value={stats?.totalSubjects || 0} icon={BookOpen} color="bg-emerald-100" onClick={() => navigate('/academics/subjects')} />
                <DashboardStatCard title="Fee Collection" value={`${stats?.paymentPercentage || 0}%`} icon={CreditCard} color="bg-green-100" subtitle={`₦${Number(stats?.totalAmountPaid || 0).toLocaleString()} collected`} onClick={() => navigate('/finance')} />
              </div>

              {/* Fee Status and Activities */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <Card className="p-4">
                  <Text variant="h4" className="font-bold mb-3">Fee Payment Status</Text>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100"><div className="flex items-center gap-2"><CheckCircle size={14} className="text-emerald-500" /><Text variant="caption">Fully Paid</Text></div><Text variant="small" className="font-bold">{stats?.totalPaidFull || 0}</Text></div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100"><div className="flex items-center gap-2"><Clock size={14} className="text-amber-500" /><Text variant="caption">Partial</Text></div><Text variant="small" className="font-bold">{stats?.totalPaidPartial || 0}</Text></div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100"><div className="flex items-center gap-2"><AlertCircle size={14} className="text-red-500" /><Text variant="caption">Not Paid</Text></div><Text variant="small" className="font-bold">{stats?.totalNotPaid || 0}</Text></div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100"><div className="flex items-center gap-2"><Award size={14} className="text-purple-500" /><Text variant="caption">Scholarship</Text></div><Text variant="small" className="font-bold">{stats?.totalScholarship || 0}</Text></div>
                  </div>
                </Card>

                <div className="lg:col-span-2">
                  <Card className="p-4 h-full">
                    <div className="flex items-center justify-between mb-3"><Text variant="h4" className="font-bold">Recent Activities</Text><button onClick={handleRefresh} disabled={refreshing} className="p-1 hover:bg-gray-100 rounded-lg"><RefreshCw size={14} className={refreshing ? 'animate-spin text-[#D94801]' : 'text-gray-400'} /></button></div>
                    {recentActivities.length > 0 ? recentActivities.map((activity) => (<ActivityItem key={activity.id} activity={activity} getActivityIcon={getActivityIcon} formatTimeAgo={formatTimeAgo} onClick={() => { if (activity.target_type === 'student') navigate(`/students/${activity.target_id}`); else if (activity.target_type === 'result') navigate(`/results/${activity.target_id}`); }} />)) : <div className="text-center py-8"><Activity size={24} className="mx-auto text-gray-300 mb-2" /><Text variant="caption" className="text-gray-400">No recent activities</Text></div>}
                  </Card>
                </div>
              </div>

              {/* Quick Actions */}
              <Card className="p-4">
                <Text variant="h4" className="font-bold mb-4">Quick Actions</Text>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <QuickAction icon={UserPlus} label="Add Student" onClick={() => navigate('/students/create')} color="bg-blue-100" />
                  <QuickAction icon={FileText} label="Add Results" onClick={() => navigate('/results/create')} color="bg-purple-100" />
                  <QuickAction icon={Briefcase} label="Add Staff" onClick={() => navigate('/staff/create')} color="bg-amber-100" />
                  <QuickAction icon={Users2} label="Add Parent" onClick={() => navigate('/parents')} color="bg-emerald-100" />
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;