import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import StatCard from '../components/dashboard/StatCard';
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
  Globe
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, getUserFullName, isAdmin } = useAuth();
  
  // State management
  const [stats, setStats] = useState(null);
  const [parentStats, setParentStats] = useState(null);
  const [studentStats, setStudentStats] = useState(null);
  const [teacherStats, setTeacherStats] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  // Fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      setRefreshing(true);

      const userRole = user?.role;
      
      // Fetch data based on user role
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
        // Admin or other staff - get comprehensive stats
        const dashboardData = await getDashboardStats();
        setStats(dashboardData);
      }

      // Fetch recent activities for all users
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

  // Initial data fetch
  useEffect(() => {
    fetchDashboardData();
    
    // Refresh data every 5 minutes
    const interval = setInterval(fetchDashboardData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  // Handle refresh
  const handleRefresh = () => {
    fetchDashboardData();
  };

  // Get activity icon based on type
  const getActivityIcon = (activityType) => {
    const icons = {
      'user_created': <UserPlus size={16} className="text-blue-500" />,
      'user_updated': <UserCog size={16} className="text-emerald-500" />,
      'student_created': <GraduationCap size={16} className="text-indigo-500" />,
      'student_updated': <UserCog size={16} className="text-amber-500" />,
      'result_published': <FileText size={16} className="text-purple-500" />,
      'fee_paid': <CreditCard size={16} className="text-green-500" />,
      'staff_added': <Briefcase size={16} className="text-orange-500" />,
      'announcement': <Bell size={16} className="text-red-500" />,
      'system': <Server size={16} className="text-gray-600" />
    };
    return icons[activityType] || <Activity size={16} className="text-gray-500" />;
  };

  // Format time ago
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
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Render loading skeleton
  const renderLoadingSkeleton = () => (
    <div className="animate-pulse">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="h-8 w-8 bg-gray-200 rounded"></div>
              <div className="h-4 w-16 bg-gray-200 rounded"></div>
            </div>
            <div className="h-8 w-20 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 w-28 bg-gray-100 rounded"></div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
          <div className="h-6 w-40 bg-gray-200 rounded mb-6"></div>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center mb-4">
              <div className="h-8 w-8 bg-gray-200 rounded mr-3"></div>
              <div className="flex-1">
                <div className="h-4 w-40 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 w-28 bg-gray-100 rounded"></div>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="h-6 w-32 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-14 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Render parent dashboard
  if (user?.role === 'parent') {
    return (
      <DashboardLayout title="Dashboard">
        {/* Error Alert */}
        {error && (
          <Alert
            type="error"
            message={error}
            onClose={() => setError('')}
            className="mb-6"
          />
        )}

        {/* Parent Statistics */}
        {loading ? renderLoadingSkeleton() : parentStats && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-blue-50 rounded">
                    <Users2 size={20} className="text-blue-600" />
                  </div>
                  <div className="text-sm text-gray-500">Children</div>
                </div>
                <div className="text-2xl font-semibold text-gray-900">{parentStats.children_count || 0}</div>
                <div className="text-xs text-gray-500 mt-1">Total children enrolled</div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-amber-50 rounded">
                    <CreditCard size={20} className="text-amber-600" />
                  </div>
                  <div className="text-sm text-gray-500">Fee Balance</div>
                </div>
                <div className="text-2xl font-semibold text-gray-900">
                  ₦{(parentStats.total_balance || 0).toLocaleString()}
                </div>
                <div className="text-xs text-gray-500 mt-1">Total amount due</div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-emerald-50 rounded">
                    <UserCheck size={20} className="text-emerald-600" />
                  </div>
                  <div className="text-sm text-gray-500">Attendance</div>
                </div>
                <div className="text-2xl font-semibold text-gray-900">{parentStats.attendance_rate || 0}%</div>
                <div className="text-xs text-gray-500 mt-1">Average attendance</div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-indigo-50 rounded">
                    <MessageSquare size={20} className="text-indigo-600" />
                  </div>
                  <div className="text-sm text-gray-500">Messages</div>
                </div>
                <div className="text-2xl font-semibold text-gray-900">{parentStats.unread_messages || 0}</div>
                <div className="text-xs text-gray-500 mt-1">Unread messages</div>
              </div>
            </div>

            {/* Children List */}
            {parentStats.children && parentStats.children.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">My Children</h3>
                    <p className="text-sm text-gray-500 mt-1">Your enrolled children</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/parents/children')}
                  >
                    View All
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {parentStats.children.map((child) => (
                    <div 
                      key={child.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-all cursor-pointer hover:border-indigo-200"
                      onClick={() => navigate(`/students/${child.id}`)}
                    >
                      <div className="flex items-center">
                        <div className="p-2 bg-indigo-50 rounded mr-3">
                          <GraduationCap size={18} className="text-indigo-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {child.first_name} {child.last_name}
                          </h4>
                          <p className="text-sm text-gray-600">{child.class_level || 'Not assigned'}</p>
                          <p className="text-xs text-gray-500 mt-1">Admission: {child.admission_number}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Updates */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Recent Updates</h3>
                  <p className="text-sm text-gray-500 mt-1">Latest school announcements</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/notifications')}
                >
                  View All
                </Button>
              </div>
              
              {recentActivities.length > 0 ? (
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                      <div className="p-2 mr-3">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-900 mb-1">{activity.description}</p>
                        <div className="flex items-center text-sm text-gray-500">
                          <span className="font-medium">{activity.user_name}</span>
                          <span className="mx-2">•</span>
                          <span>{formatTimeAgo(activity.created_at)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="p-3 bg-red-50 rounded-full inline-flex mb-3">
                    <Bell size={20} className="text-red-500" />
                  </div>
                  <p className="text-gray-600">No recent updates</p>
                  <p className="text-sm text-gray-500 mt-1">School announcements will appear here</p>
                </div>
              )}
            </div>
          </div>
        )}
      </DashboardLayout>
    );
  }

  // Render student dashboard
  if (user?.role === 'student') {
    return (
      <DashboardLayout title="Dashboard">
        {/* Error Alert */}
        {error && (
          <Alert
            type="error"
            message={error}
            onClose={() => setError('')}
            className="mb-6"
          />
        )}

        {/* Student Statistics */}
        {loading ? renderLoadingSkeleton() : studentStats && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-emerald-50 rounded">
                    <UserCheck size={20} className="text-emerald-600" />
                  </div>
                  <div className="text-sm text-gray-500">Attendance</div>
                </div>
                <div className="text-2xl font-semibold text-gray-900">{studentStats.attendance_rate || 0}%</div>
                <div className="text-xs text-gray-500 mt-1">This term</div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-amber-50 rounded">
                    <CreditCard size={20} className="text-amber-600" />
                  </div>
                  <div className="text-sm text-gray-500">Fee Balance</div>
                </div>
                <div className="text-2xl font-semibold text-gray-900">
                  ₦{(studentStats.fee_balance || 0).toLocaleString()}
                </div>
                <div className="text-xs text-gray-500 mt-1">Amount due</div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-blue-50 rounded">
                    <School size={20} className="text-blue-600" />
                  </div>
                  <div className="text-sm text-gray-500">Class</div>
                </div>
                <div className="text-2xl font-semibold text-gray-900">{studentStats.current_class || 'N/A'}</div>
                <div className="text-xs text-gray-500 mt-1">Current class level</div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-purple-50 rounded">
                    <FileText size={20} className="text-purple-600" />
                  </div>
                  <div className="text-sm text-gray-500">Results</div>
                </div>
                <div className="text-2xl font-semibold text-gray-900">
                  {studentStats.recent_results?.length || 0}
                </div>
                <div className="text-xs text-gray-500 mt-1">Published results</div>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
                  <p className="text-sm text-gray-500 mt-1">Your latest updates</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/students/activities')}
                >
                  View All
                </Button>
              </div>
              
              {recentActivities.length > 0 ? (
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                      <div className="p-2 mr-3">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-900 mb-1">{activity.description}</p>
                        <div className="text-sm text-gray-500">
                          {formatTimeAgo(activity.created_at)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="p-3 bg-gray-50 rounded-full inline-flex mb-3">
                    <Activity size={20} className="text-gray-500" />
                  </div>
                  <p className="text-gray-600">No recent activities</p>
                  <p className="text-sm text-gray-500 mt-1">Your activities will appear here</p>
                </div>
              )}
            </div>
          </div>
        )}
      </DashboardLayout>
    );
  }

  // Render teacher dashboard
  if (user?.role === 'teacher' || user?.role === 'form_teacher' || user?.role === 'subject_teacher') {
    return (
      <DashboardLayout title="Dashboard">
        {/* Error Alert */}
        {error && (
          <Alert
            type="error"
            message={error}
            onClose={() => setError('')}
            className="mb-6"
          />
        )}

        {/* Teacher Statistics */}
        {loading ? renderLoadingSkeleton() : teacherStats && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-blue-50 rounded">
                    <Users size={20} className="text-blue-600" />
                  </div>
                  <div className="text-sm text-gray-500">Students</div>
                </div>
                <div className="text-2xl font-semibold text-gray-900">{teacherStats.total_students || 0}</div>
                <div className="text-xs text-gray-500 mt-1">Assigned students</div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-emerald-50 rounded">
                    <School size={20} className="text-emerald-600" />
                  </div>
                  <div className="text-sm text-gray-500">Classes</div>
                </div>
                <div className="text-2xl font-semibold text-gray-900">{teacherStats.total_classes || 0}</div>
                <div className="text-xs text-gray-500 mt-1">Teaching classes</div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-purple-50 rounded">
                    <BookOpen size={20} className="text-purple-600" />
                  </div>
                  <div className="text-sm text-gray-500">Subjects</div>
                </div>
                <div className="text-2xl font-semibold text-gray-900">{teacherStats.total_subjects || 0}</div>
                <div className="text-xs text-gray-500 mt-1">Teaching subjects</div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-amber-50 rounded">
                    <FileText size={20} className="text-amber-600" />
                  </div>
                  <div className="text-sm text-gray-500">Pending</div>
                </div>
                <div className="text-2xl font-semibold text-gray-900">
                  {teacherStats.pending_grading?.length || 0}
                </div>
                <div className="text-xs text-gray-500 mt-1">Awaiting review</div>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
                  <p className="text-sm text-gray-500 mt-1">Your latest updates</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/teachers/activities')}
                >
                  View All
                </Button>
              </div>
              
              {recentActivities.length > 0 ? (
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                      <div className="p-2 mr-3">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-900 mb-1">{activity.description}</p>
                        <div className="text-sm text-gray-500">
                          {formatTimeAgo(activity.created_at)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="p-3 bg-gray-50 rounded-full inline-flex mb-3">
                    <Activity size={20} className="text-gray-500" />
                  </div>
                  <p className="text-gray-600">No recent activities</p>
                  <p className="text-sm text-gray-500 mt-1">Your activities will appear here</p>
                </div>
              )}
            </div>
          </div>
        )}
      </DashboardLayout>
    );
  }

  // Admin/Staff Dashboard
  return (
    <DashboardLayout >
      {/* Error Alert */}
      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => setError('')}
          className="mb-6"
        />
      )}

      {/* Loading State */}
      {loading ? renderLoadingSkeleton() : (
        <div className="space-y-6">
          {/* Primary Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-blue-50 rounded">
                  <Users size={20} className="text-blue-600" />
                </div>
                <div className="text-sm text-gray-500">Total Users</div>
              </div>
              <div className="text-2xl font-semibold text-gray-900 mb-1">
                {stats?.totalUsers || 0}
              </div>
              <div className="text-xs text-gray-500">All system users</div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-emerald-50 rounded">
                  <GraduationCap size={20} className="text-emerald-600" />
                </div>
                <div className="text-sm text-gray-500">Students</div>
              </div>
              <div className="text-2xl font-semibold text-gray-900 mb-1">
                {stats?.totalStudents || 0}
              </div>
              <div className="text-xs text-gray-500">Enrolled students</div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-purple-50 rounded">
                  <Users2 size={20} className="text-purple-600" />
                </div>
                <div className="text-sm text-gray-500">Parents</div>
              </div>
              <div className="text-2xl font-semibold text-gray-900 mb-1">
                {stats?.totalParents || 0}
              </div>
              <div className="text-xs text-gray-500">Registered parents</div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-amber-50 rounded">
                  <Briefcase size={20} className="text-amber-600" />
                </div>
                <div className="text-sm text-gray-500">Staff</div>
              </div>
              <div className="text-2xl font-semibold text-gray-900 mb-1">
                {stats?.totalStaff || 0}
              </div>
              <div className="text-xs text-gray-500">Teaching & non-teaching</div>
            </div>
          </div>

          {/* Secondary Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-indigo-50 rounded">
                  <FileText size={20} className="text-indigo-600" />
                </div>
                <div className="text-sm text-gray-500">Results Published</div>
              </div>
              <div className="text-2xl font-semibold text-gray-900 mb-1">
                {stats?.publishedResults || 0}
              </div>
              <div className="text-xs text-gray-500">Of total results</div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-blue-50 rounded">
                  <School size={20} className="text-blue-600" />
                </div>
                <div className="text-sm text-gray-500">Classes</div>
              </div>
              <div className="text-2xl font-semibold text-gray-900 mb-1">
                {stats?.totalClasses || 0}
              </div>
              <div className="text-xs text-gray-500">Active classes</div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-emerald-50 rounded">
                  <BookOpen size={20} className="text-emerald-600" />
                </div>
                <div className="text-sm text-gray-500">Subjects</div>
              </div>
              <div className="text-2xl font-semibold text-gray-900 mb-1">
                {stats?.totalSubjects || 0}
              </div>
              <div className="text-xs text-gray-500">Offered subjects</div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-green-50 rounded">
                  <CreditCard size={20} className="text-green-600" />
                </div>
                <div className="text-sm text-gray-500">Fee Collection</div>
              </div>
              <div className="text-2xl font-semibold text-gray-900 mb-1">
                {stats?.paymentPercentage || 0}%
              </div>
              <div className="text-xs text-gray-500">
                ₦{(stats?.totalAmountPaid || 0).toLocaleString()} collected
              </div>
            </div>
          </div>

          {/* Fee Status and Activities Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Fee Status */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Fee Payment Status</h3>
                    <p className="text-sm text-gray-500 mt-1">Student fee overview</p>
                  </div>
                  {/* <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/finance/overview')}
                  >
                    View Details
                  </Button> */}
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div className="flex items-center">
                      <CheckCircle size={16} className="text-emerald-500 mr-2" />
                      <span className="text-gray-700">Fully Paid</span>
                    </div>
                    <span className="font-medium text-gray-900">{stats?.totalPaidFull || 0}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div className="flex items-center">
                      <Clock size={16} className="text-amber-500 mr-2" />
                      <span className="text-gray-700">Partial</span>
                    </div>
                    <span className="font-medium text-gray-900">{stats?.totalPaidPartial || 0}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div className="flex items-center">
                      <AlertCircle size={16} className="text-red-500 mr-2" />
                      <span className="text-gray-700">Not Paid</span>
                    </div>
                    <span className="font-medium text-gray-900">{stats?.totalNotPaid || 0}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div className="flex items-center">
                      <Award size={16} className="text-purple-500 mr-2" />
                      <span className="text-gray-700">Scholarship</span>
                    </div>
                    <span className="font-medium text-gray-900">{stats?.totalScholarship || 0}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="lg:col-span-2">
              <div className="bg-white border border-gray-200 rounded-lg p-6 h-full">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
                    <p className="text-sm text-gray-500 mt-1">Latest system updates</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleRefresh}
                      disabled={refreshing}
                      className="p-2 hover:bg-gray-100 rounded transition-colors"
                      title="Refresh"
                    >
                      <RefreshCw size={16} className={refreshing ? 'animate-spin text-blue-500' : 'text-gray-500 hover:text-blue-500'} />
                    </button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate('/admin/activities')}
                    >
                      View All
                    </Button>
                  </div>
                </div>
                
                {recentActivities.length > 0 ? (
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div 
                        key={activity.id} 
                        className="flex items-start py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => {
                          if (activity.target_type === 'student') {
                            navigate(`/students/${activity.target_id}`);
                          } else if (activity.target_type === 'result') {
                            navigate(`/results/${activity.target_id}`);
                          }
                        }}
                      >
                        <div className="p-2 mr-3">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-900 mb-1">{activity.description}</p>
                          <div className="flex items-center text-sm text-gray-500">
                            <span className="font-medium">{activity.user_name}</span>
                            {activity.user_role && (
                              <>
                                <span className="mx-2">•</span>
                                <span className="capitalize">{activity.user_role.replace('_', ' ')}</span>
                              </>
                            )}
                            <span className="mx-2">•</span>
                            <span>{formatTimeAgo(activity.created_at)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="p-3 bg-gray-50 rounded-full inline-flex mb-3">
                      <Activity size={20} className="text-gray-500" />
                    </div>
                    <p className="text-gray-600">No recent activities</p>
                    <p className="text-sm text-gray-500 mt-1">System activities will appear here</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Button
                variant="outline"
                className="flex flex-col items-center justify-center p-4 h-auto hover:bg-blue-50 hover:border-blue-200 transition-colors"
                onClick={() => navigate('/students/create')}
              >
                <div className="p-2 bg-blue-50 rounded mb-2">
                  <UserPlus size={20} className="text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-900">Add Student</span>
              </Button>
              
              <Button
                variant="outline"
                className="flex flex-col items-center justify-center p-4 h-auto hover:bg-purple-50 hover:border-purple-200 transition-colors"
                onClick={() => navigate('/results/create')}
              >
                <div className="p-2 bg-purple-50 rounded mb-2">
                  <FileText size={20} className="text-purple-600" />
                </div>
                <span className="text-sm font-medium text-gray-900">Add Results</span>
              </Button>
              
              <Button
                variant="outline"
                className="flex flex-col items-center justify-center p-4 h-auto hover:bg-amber-50 hover:border-amber-200 transition-colors"
                onClick={() => navigate('/staff/create')}
              >
                <div className="p-2 bg-amber-50 rounded mb-2">
                  <Briefcase size={20} className="text-amber-600" />
                </div>
                <span className="text-sm font-medium text-gray-900">Add Staff</span>
              </Button>
              
              <Button
                variant="outline"
                className="flex flex-col items-center justify-center p-4 h-auto hover:bg-emerald-50 hover:border-emerald-200 transition-colors"
                onClick={() => navigate('/parents')}
              >
                <div className="p-2 bg-emerald-50 rounded mb-2">
                  <Users2 size={20} className="text-emerald-600" />
                </div>
                <span className="text-sm font-medium text-gray-900">Add Parent</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Dashboard;



