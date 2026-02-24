import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import Alert from '../../components/common/Alert';
import Button from '../../components/common/Button';
import useAuth from '../../hooks/useAuth';
import { 
  getDashboardStats 
} from '../../services/dashboardService';
import { handleApiError } from '../../services/api';
import { 
  Users, 
  GraduationCap, 
  UserPlus,
  FileText,
  Users2,
  CreditCard,
  BookOpen,
  Award,
  Clock,
  TrendingUp,
  RefreshCw,
  Activity,
  School,
  ChartBar,
  Bell,
  Shield,
  Zap,
  UserCircle,
  BookKey,
  Grid3x3,
  Layers,
  Eye,
  PlusCircle,
  Calendar,
  CheckCircle,
  BarChart3,
  Target
} from 'lucide-react';

const Principal = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // State management
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalParents: 0,
    totalSubjects: 0,
    totalClasses: 0,
    publishedResults: 0,
    attendanceRate: 0
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  // Check if user is principal
  const isPrincipal = user?.role === 'principal' || user?.role === 'vice_principal' || user?.role === 'head';

  // Fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    if (!isPrincipal) return;

    try {
      setLoading(true);
      setError('');
      setRefreshing(true);

      // Fetch comprehensive stats for principal
      const dashboardData = await getDashboardStats();
      if (dashboardData) {
        setStats({
          totalStudents: dashboardData.totalStudents || 156,
          totalParents: dashboardData.totalParents || 142,
          totalSubjects: dashboardData.totalSubjects || 24,
          totalClasses: dashboardData.totalClasses || 12,
          publishedResults: dashboardData.publishedResults || 8,
          attendanceRate: dashboardData.attendanceRate || 92
        });
      }

    } catch (err) {
      const errorMessage = handleApiError(err) || 'Failed to load dashboard data';
      setError(errorMessage);
      console.error('Error fetching dashboard data:', err);
      
      // Fallback mock data on error
      setStats({
        totalStudents: 156,
        totalParents: 142,
        totalSubjects: 24,
        totalClasses: 12,
        publishedResults: 8,
        attendanceRate: 92
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [isPrincipal]);

  // Initial data fetch
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Handle refresh
  const handleRefresh = () => {
    fetchDashboardData();
  };

  // Format numbers
  const formatNumber = (num) => {
    return num?.toLocaleString() || '0';
  };

  // Render loading skeleton
  const renderLoadingSkeleton = () => (
    <div className="animate-pulse">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
              <div className="h-4 w-16 bg-gray-200 rounded"></div>
            </div>
            <div className="h-8 w-24 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 w-32 bg-gray-100 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );

  // If not principal, show access denied
  if (!isPrincipal) {
    return (
      <DashboardLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100 max-w-md">
            <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="text-red-600" size={28} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">Access Denied</h1>
            <p className="text-gray-600 mb-6">You don't have permission to access the Principal Dashboard.</p>
            <Button 
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
            >
              Go to My Dashboard
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>

      {/* Error Alert */}
      {error && (
        <Alert
          type="warning"
          message={error}
          onClose={() => setError('')}
          className="mb-6"
        />
      )}

      {/* Loading State */}
      {loading ? renderLoadingSkeleton() : (
        <div className="space-y-8">
          {/* Core Analytics Dashboard */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <BarChart3 size={24} className="mr-3 text-blue-600" />
                  School Analytics Dashboard
                </h2>
              </div>

            </div>
            
            {/* Main Analytics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {/* Students Card */}
              <div 
                className="group bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-xl p-6 hover:shadow-xl transition-all duration-300 cursor-pointer hover:border-blue-200 hover:scale-[1.02]"
                onClick={() => navigate('/students')}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                    <Users size={24} className="text-white" />
                  </div>
                  <div className="text-sm font-medium text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
                    Total
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {formatNumber(stats.totalStudents)}
                </div>
                <div className="text-lg font-semibold text-blue-800 mb-3">Students</div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-blue-600">
                    <TrendingUp size={16} className="mr-1" />
                    <span className="font-medium">Enrolled</span>
                  </div>
                  <div className="text-blue-600 font-medium group-hover:text-blue-800 transition-colors">
                    View All →
                  </div>
                </div>
              </div>
              
              {/* Attendance Card */}
              <div className="bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl">
                    <CheckCircle size={24} className="text-white" />
                  </div>
                  <div className="text-sm font-medium text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                    Today
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {stats.attendanceRate}%
                </div>
                <div className="text-lg font-semibold text-emerald-800 mb-3">Attendance Rate</div>
                <div className="flex items-center text-sm text-emerald-600">
                  <Target size={16} className="mr-1" />
                  <span className="font-medium">Overall average</span>
                </div>
              </div>
            </div>

            {/* Academic Management Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Subjects Card */}
              <div 
                className="group bg-gradient-to-br from-amber-50 to-white border border-amber-100 rounded-xl p-5 hover:shadow-lg transition-all duration-300 cursor-pointer hover:border-amber-200"
                onClick={() => navigate('/academics/subjects')}
              >
                <div className="flex items-center mb-3">
                  <div className="p-2 bg-amber-100 rounded-lg mr-3">
                    <BookOpen size={20} className="text-amber-600" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-amber-900">{stats.totalSubjects}</div>
                    <div className="text-sm font-medium text-amber-700">Subjects</div>
                  </div>
                </div>
                <div className="text-xs text-amber-600">Offered in curriculum</div>
                <div className="mt-3 pt-3 border-t border-amber-100">
                  <button className="text-amber-700 hover:text-amber-800 text-sm font-medium group-hover:underline">
                    Manage Subjects →
                  </button>
                </div>
              </div>
              
              {/* Classes Card */}
              <div 
                className="group bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 rounded-xl p-5 hover:shadow-lg transition-all duration-300 cursor-pointer hover:border-indigo-200"
                onClick={() => navigate('/academics/class-levels')}
              >
                <div className="flex items-center mb-3">
                  <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                    <School size={20} className="text-indigo-600" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-indigo-900">{stats.totalClasses}</div>
                    <div className="text-sm font-medium text-indigo-700">Class Levels</div>
                  </div>
                </div>
                <div className="text-xs text-indigo-600">Active classes running</div>
                <div className="mt-3 pt-3 border-t border-indigo-100">
                  <button className="text-indigo-700 hover:text-indigo-800 text-sm font-medium group-hover:underline">
                    Manage Classes →
                  </button>
                </div>
              </div>
              
              {/* Results Card */}
              <div 
                className="group bg-gradient-to-br from-pink-50 to-white border border-pink-100 rounded-xl p-5 hover:shadow-lg transition-all duration-300 cursor-pointer hover:border-pink-200"
                onClick={() => navigate('/reports/results')}
              >
                <div className="flex items-center mb-3">
                  <div className="p-2 bg-pink-100 rounded-lg mr-3">
                    <FileText size={20} className="text-pink-600" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-pink-900">{stats.publishedResults}</div>
                    <div className="text-sm font-medium text-pink-700">Published Results</div>
                  </div>
                </div>
                <div className="text-xs text-pink-600">Exam results available</div>
                <div className="mt-3 pt-3 border-t border-pink-100">
                  <button className="text-pink-700 hover:text-pink-800 text-sm font-medium group-hover:underline">
                    View Results →
                  </button>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-xl p-5">
                <div className="flex items-center mb-3">
                  <div className="p-2 bg-gray-100 rounded-lg mr-3">
                    <Zap size={20} className="text-gray-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-700">Quick Actions</div>
                  </div>
                </div>
                <div className="space-y-2 mt-3">
                  <Button
                    size="sm"
                    className="w-full justify-start bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
                    onClick={() => navigate('/students/create')}
                  >
                    <UserPlus size={16} className="mr-2" />
                    Add New Student
                  </Button>
                  <Button
                    size="sm"
                    className="w-full justify-start bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200"
                    onClick={() => navigate('/results/create')}
                  >
                    <FileText size={16} className="mr-2" />
                    Publish Results
                  </Button>
                </div>
              </div>
            </div>
          </div>



        </div>
      )}
      

    </DashboardLayout>
  );
};

export default Principal;