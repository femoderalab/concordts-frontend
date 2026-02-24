// Import statements remain the same
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import Alert from '../../components/common/Alert';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import useAuth from '../../hooks/useAuth';
import secretaryService from '../../services/secretaryService';
import { getStudentById, getStudents } from '../../services/studentService';
import { 
  Users, 
  GraduationCap, 
  UserPlus,
  FileText,
  CreditCard,
  DollarSign,
  BarChart3,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Activity,
  School,
  ChartBar,
  Shield,
  Zap,
  Eye,
  Download,
  Filter,
  Home,
  Layers,
  PieChart,
  LineChart,
  Percent,
  Target,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Award,
  BookOpen,
  UserCheck,
  UserX,
  FileCheck,
  FileX,
  Wallet,
  Receipt,
  Banknote,
  Calculator,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  ChevronRight,
  Search,
  PlusCircle,
  Edit2,
  Trash2,
  MoreVertical,
  Shield as SecurityShield,
  UserCog,
  Users2,
  BookKey,
  Grid3x3
} from 'lucide-react';

const Secretary = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // State management
  const [stats, setStats] = useState({
    financial_summary: {
      total_revenue: 0,
      total_debt: 0,
      net_balance: 0,
      payment_rate: 0,
      debt_percentage: 0
    },
    student_status: {
      total_students: 0,
      students_fully_paid: 0,
      students_with_debt: 0,
      partially_paid: 0,
      scholarship_students: 0,
      exempted_students: 0
    },
    document_analysis: {
      total_with_complete_documents: 0,
      total_without_complete_documents: 0,
      completion_rate: 0,
      missing_documents: {}
    },
    parent_stats: {
      total_parents: 0,
      parents_with_children: 0,
      average_children_per_parent: 0
    },
    fee_distribution: {
      paid_full: 0,
      paid_partial: 0,
      not_paid: 0,
      scholarship: 0,
      exempted: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Modal states
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showFinancialModal, setShowFinancialModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentDetails, setStudentDetails] = useState(null);
  const [financialDetails, setFinancialDetails] = useState(null);
  
  // Data states
  const [studentsWithDebt, setStudentsWithDebt] = useState([]);
  const [recentStudents, setRecentStudents] = useState([]);
  const [classDistribution, setClassDistribution] = useState([]);
  
  // Check if user is secretary OR admin/head
  const isSecretary = user?.role === 'secretary' || 
                    user?.role === 'accountant' || 
                    user?.role === 'head' || 
                    user?.role === 'principal' || 
                    user?.role === 'vice_principal' ||
                    user?.is_staff || 
                    (user?.role === 'admin' && user?.is_staff);

  // Fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    if (!isSecretary) return;

    try {
      setLoading(true);
      setError('');
      setRefreshing(true);

      console.log('📊 Fetching secretary dashboard data...');
      
      // Try to fetch from API
      try {
        const dashboardData = await secretaryService.getSecretaryDashboardStats();
        console.log('✅ Dashboard data received:', dashboardData);
        
        // Safely set stats with fallbacks
        setStats(prevStats => ({
          financial_summary: {
            total_revenue: dashboardData?.financial_summary?.total_revenue || 0,
            total_debt: dashboardData?.financial_summary?.total_debt || 0,
            net_balance: dashboardData?.financial_summary?.net_balance || 0,
            payment_rate: dashboardData?.financial_summary?.payment_rate || 0,
            debt_percentage: dashboardData?.financial_summary?.debt_percentage || 0
          },
          student_status: {
            total_students: dashboardData?.student_status?.total_students || 0,
            students_fully_paid: dashboardData?.student_status?.students_fully_paid || 
                               dashboardData?.student_status?.paid_students || 0,
            students_with_debt: dashboardData?.student_status?.students_with_debt || 
                              dashboardData?.student_status?.owing_students || 0,
            partially_paid: dashboardData?.student_status?.partially_paid || 
                          dashboardData?.fee_distribution?.paid_partial || 0,
            scholarship_students: dashboardData?.student_status?.scholarship_students || 
                                dashboardData?.fee_distribution?.scholarship || 0,
            exempted_students: dashboardData?.student_status?.exempted_students || 
                             dashboardData?.fee_distribution?.exempted || 0
          },
          document_analysis: {
            total_with_complete_documents: dashboardData?.document_analysis?.total_with_complete_documents || 
                                         dashboardData?.document_status?.with_documents || 0,
            total_without_complete_documents: dashboardData?.document_analysis?.total_without_complete_documents || 
                                           dashboardData?.document_status?.without_documents || 0,
            completion_rate: dashboardData?.document_analysis?.completion_rate || 
                           dashboardData?.document_status?.completion_rate || 0,
            missing_documents: dashboardData?.document_analysis?.missing_documents || {}
          },
          parent_stats: {
            total_parents: dashboardData?.parent_stats?.total_parents || 0,
            parents_with_children: dashboardData?.parent_stats?.parents_with_children || 0,
            average_children_per_parent: dashboardData?.parent_stats?.average_children_per_parent || 0
          },
          fee_distribution: {
            paid_full: dashboardData?.fee_distribution?.paid_full || 
                     dashboardData?.student_status?.paid_students || 
                     dashboardData?.student_status?.students_fully_paid || 0,
            paid_partial: dashboardData?.fee_distribution?.paid_partial || 
                        dashboardData?.student_status?.partially_paid || 0,
            not_paid: dashboardData?.fee_distribution?.not_paid || 0,
            scholarship: dashboardData?.fee_distribution?.scholarship || 
                       dashboardData?.student_status?.scholarship_students || 0,
            exempted: dashboardData?.fee_distribution?.exempted || 
                     dashboardData?.student_status?.exempted_students || 0
          }
        }));
        
        // Fetch students with debt
        try {
          const debtStudents = await secretaryService.getStudentsWithOutstandingPayments(10);
          setStudentsWithDebt(Array.isArray(debtStudents) ? debtStudents : []);
        } catch (debtErr) {
          console.warn('⚠️ Could not fetch debt students:', debtErr.message);
          setStudentsWithDebt([]);
        }
        
        // Set recent students from dashboard data
        if (dashboardData?.recent_data?.recent_students && Array.isArray(dashboardData.recent_data.recent_students)) {
          setRecentStudents(dashboardData.recent_data.recent_students);
        } else {
          // Fetch recent students manually
          const allStudents = await getStudents({ limit: 5, ordering: '-created_at' });
          const studentsArray = allStudents?.results || allStudents?.data?.results || allStudents?.data || [];
          setRecentStudents(Array.isArray(studentsArray) ? studentsArray.slice(0, 5) : []);
        }
        
        // Set class distribution
        if (dashboardData?.class_distribution && Array.isArray(dashboardData.class_distribution)) {
          setClassDistribution(dashboardData.class_distribution);
        }
        
      } catch (apiErr) {
        console.warn('⚠️ API failed, using manual calculation:', apiErr.message);
        
        // Manual calculation fallback
        const allStudents = await getStudents({ limit: 1000 });
        const studentsArray = allStudents?.results || allStudents?.data?.results || allStudents?.data || [];
        
        if (Array.isArray(studentsArray)) {
          // Calculate statistics manually
          let totalRevenue = 0;
          let totalDebt = 0;
          let fullyPaid = 0;
          let partiallyPaid = 0;
          let notPaid = 0;
          let scholarship = 0;
          let exempted = 0;
          
          studentsArray.forEach(student => {
            const fee = parseFloat(student.total_fee_amount) || 0;
            const paid = parseFloat(student.amount_paid) || 0;
            const balance = Math.max(0, fee - paid);
            
            totalRevenue += paid;
            totalDebt += balance;
            
            switch (student.fee_status) {
              case 'paid_full':
                fullyPaid++;
                break;
              case 'paid_partial':
                partiallyPaid++;
                break;
              case 'not_paid':
                notPaid++;
                break;
              case 'scholarship':
                scholarship++;
                break;
              case 'exempted':
                exempted++;
                break;
            }
          });
          
          const totalStudents = studentsArray.length;
          const totalAmount = totalRevenue + totalDebt;
          const paymentRate = totalAmount > 0 ? (totalRevenue / totalAmount) * 100 : 0;
          const debtPercentage = totalAmount > 0 ? (totalDebt / totalAmount) * 100 : 0;
          
          setStats(prevStats => ({
            ...prevStats,
            financial_summary: {
              total_revenue: totalRevenue,
              total_debt: totalDebt,
              net_balance: totalRevenue - totalDebt,
              payment_rate: paymentRate,
              debt_percentage: debtPercentage
            },
            student_status: {
              total_students: totalStudents,
              students_fully_paid: fullyPaid,
              students_with_debt: partiallyPaid + notPaid,
              partially_paid: partiallyPaid,
              scholarship_students: scholarship,
              exempted_students: exempted
            },
            fee_distribution: {
              paid_full: fullyPaid,
              paid_partial: partiallyPaid,
              not_paid: notPaid,
              scholarship: scholarship,
              exempted: exempted
            }
          }));
          
          // Set recent students
          setRecentStudents(studentsArray.slice(0, 5));
          
          // Get students with debt
          const debtStudents = studentsArray
            .filter(student => {
              const fee = parseFloat(student.total_fee_amount) || 0;
              const paid = parseFloat(student.amount_paid) || 0;
              return fee > paid;
            })
            .slice(0, 10)
            .map(student => ({
              id: student.id,
              name: `${student.first_name || ''} ${student.last_name || ''}`.trim() || 'Unknown Student',
              admission_number: student.admission_number || 'N/A',
              class_level: student.class_level?.name || student.class_level_name || 'Not Assigned',
              total_fee: parseFloat(student.total_fee_amount) || 0,
              amount_paid: parseFloat(student.amount_paid) || 0,
              balance: Math.max(0, (parseFloat(student.total_fee_amount) || 0) - (parseFloat(student.amount_paid) || 0)),
              fee_status: student.fee_status || 'not_paid'
            }));
          
          setStudentsWithDebt(debtStudents);
        }
      }

    } catch (err) {
      const errorMessage = err.message || 'Failed to load secretary dashboard data';
      setError(errorMessage);
      console.error('Error fetching secretary dashboard data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [isSecretary]);

  // Initial data fetch
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Handle refresh
  const handleRefresh = () => {
    fetchDashboardData();
  };

  // Format currency - SAFE version
  const formatCurrency = (amount) => {
    // Handle cases where amount might be an object
    let numericAmount = 0;
    
    if (typeof amount === 'number') {
      numericAmount = amount;
    } else if (typeof amount === 'string') {
      numericAmount = parseFloat(amount) || 0;
    } else if (amount && typeof amount === 'object') {
      // If it's an object, try to extract a numeric value
      console.warn('⚠️ formatCurrency received object:', amount);
      numericAmount = 0;
    }
    
    return `₦${numericAmount.toLocaleString('en-NG', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  // Format percentage - SAFE version
  const formatPercentage = (value) => {
    let numericValue = 0;
    
    if (typeof value === 'number') {
      numericValue = value;
    } else if (typeof value === 'string') {
      numericValue = parseFloat(value) || 0;
    } else if (value && typeof value === 'object') {
      console.warn('⚠️ formatPercentage received object:', value);
      numericValue = 0;
    }
    
    return `${numericValue.toFixed(1)}%`;
  };

  // Safe number extraction helper
  const safeNumber = (value, defaultValue = 0) => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') return parseFloat(value) || defaultValue;
    if (value && typeof value === 'object') {
      console.warn('⚠️ safeNumber received object:', value);
      return defaultValue;
    }
    return defaultValue;
  };

  // Handle view student details
  const handleViewStudent = async (studentId) => {
    try {
      console.log(`👤 Fetching student ${studentId} details...`);
      
      const student = await getStudentById(studentId);
      setSelectedStudent(student);
      setStudentDetails(student);
      setShowStudentModal(true);
      
    } catch (err) {
      console.error('Error fetching student details:', err);
      setError('Failed to load student details');
    }
  };

  // Handle view financial details
  const handleViewFinancialDetails = async (studentId) => {
    try {
      console.log(`💰 Fetching financial details for student ${studentId}...`);
      
      const financialData = await secretaryService.getStudentFinancialDetails(studentId);
      setSelectedStudent(financialData.student);
      setFinancialDetails(financialData);
      setShowFinancialModal(true);
      
    } catch (err) {
      console.error('Error fetching financial details:', err);
      setError('Failed to load financial details');
    }
  };

  // Handle add payment
  const handleAddPayment = (studentId) => {
    navigate(`/finance/payments/add?student_id=${studentId}`);
  };

  // Handle generate receipt
  const handleGenerateReceipt = async (studentId) => {
    try {
      await secretaryService.generateFeeReceipt(studentId, 'latest');
      setSuccess('Receipt generated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error generating receipt:', err);
      setError('Failed to generate receipt');
    }
  };

  // Render loading skeleton
  const renderLoadingSkeleton = () => (
    <div className="animate-pulse">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
              <div className="h-4 w-16 bg-gray-200 rounded"></div>
            </div>
            <div className="h-8 w-24 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 w-32 bg-gray-100 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );

  // If not secretary, show access denied
  if (!isSecretary) {
    return (
      <DashboardLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100 max-w-md">
            <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="text-red-600" size={28} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">Access Denied</h1>
            <p className="text-gray-600 mb-6">You don't have permission to access the Secretary Dashboard.</p>
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
      {/* Welcome Header */}
      <div className="mb-8 bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 rounded-2xl shadow-xl p-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full -ml-24 -mb-24"></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <div className="flex items-center mb-2">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-3">
                  <FileText size={24} className="text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">Secretary Dashboard</h1>
                  <p className="text-blue-200 mt-1">Financial & Administrative Management</p>
                </div>
              </div>
              <p className="text-blue-100 mt-2">
                Welcome, <span className="font-semibold text-white">{user?.first_name} {user?.last_name}</span>
              </p>
              <div className="flex items-center mt-3 text-sm text-blue-200">
                <Calendar size={14} className="mr-1" />
                <span>{new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
                <span className="mx-2">•</span>
                <Clock size={14} className="mr-1" />
                <span>{new Date().toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}</span>
              </div>
            </div>
            <div className="mt-6 md:mt-0">
              <Button
                onClick={handleRefresh}
                disabled={refreshing || loading}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border-white/30 text-white px-5 py-3 rounded-xl flex items-center shadow-lg hover:shadow-xl transition-all"
              >
                <RefreshCw size={18} className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Refreshing...' : 'Refresh Data'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => setError('')}
          className="mb-6"
        />
      )}

      {/* Success Alert */}
      {success && (
        <Alert
          type="success"
          message={success}
          className="mb-6"
          autoDismiss={true}
          onAutoDismiss={() => setSuccess('')}
        />
      )}

      {/* Loading State */}
      {loading ? renderLoadingSkeleton() : (
        <div className="space-y-8">
          {/* Financial Overview Cards - UPDATED with safe number handling */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Revenue */}
            <div className="bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl">
                  <DollarSign size={24} className="text-white" />
                </div>
                <div className="text-sm font-medium text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                  Revenue
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {formatCurrency(safeNumber(stats.financial_summary.total_revenue))}
              </div>
              <div className="text-lg font-semibold text-emerald-800 mb-3">Total Revenue</div>
              <div className="flex items-center text-sm text-emerald-600">
                <TrendingUp size={16} className="mr-1" />
                <span className="font-medium">
                  {safeNumber(stats.financial_summary.payment_rate).toFixed(1)}% collected
                </span>
              </div>
            </div>
            
            {/* Total Debt */}
            <div className="bg-gradient-to-br from-red-50 to-white border border-red-100 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-xl">
                  <AlertCircle size={24} className="text-white" />
                </div>
                <div className="text-sm font-medium text-red-700 bg-red-100 px-3 py-1 rounded-full">
                  Outstanding
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {formatCurrency(safeNumber(stats.financial_summary.total_debt))}
              </div>
              <div className="text-lg font-semibold text-red-800 mb-3">Total Debt</div>
              <div className="flex items-center text-sm text-red-600">
                <TrendingDown size={16} className="mr-1" />
                <span className="font-medium">
                  {safeNumber(stats.financial_summary.debt_percentage).toFixed(1)}% of total
                </span>
              </div>
            </div>
            
            {/* Students Paid */}
            <div className="bg-gradient-to-br from-green-50 to-white border border-green-100 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
                  <UserCheck size={24} className="text-white" />
                </div>
                <div className="text-sm font-medium text-green-700 bg-green-100 px-3 py-1 rounded-full">
                  Cleared
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {safeNumber(stats.student_status.students_fully_paid)}
              </div>
              <div className="text-lg font-semibold text-green-800 mb-3">Students Paid</div>
              <div className="flex items-center text-sm text-green-600">
                <Percent size={16} className="mr-1" />
                <span className="font-medium">
                  {stats.student_status.total_students > 0 
                    ? `${Math.round((safeNumber(stats.student_status.students_fully_paid) / stats.student_status.total_students) * 100)}% of total`
                    : '0% of total'}
                </span>
              </div>
            </div>
            
            {/* Students Owing */}
            <div className="bg-gradient-to-br from-amber-50 to-white border border-amber-100 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl">
                  <UserX size={24} className="text-white" />
                </div>
                <div className="text-sm font-medium text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
                  Owing
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {safeNumber(stats.student_status.students_with_debt)}
              </div>
              <div className="text-lg font-semibold text-amber-800 mb-3">Students Owing</div>
              <div className="flex items-center text-sm text-amber-600">
                <AlertCircle size={16} className="mr-1" />
                <span className="font-medium">
                  Total: {formatCurrency(safeNumber(stats.financial_summary.total_debt))}
                </span>
              </div>
            </div>
          </div>

          {/* Detailed Analytics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Fee Status Distribution */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 flex items-center">
                      <PieChart size={24} className="mr-3 text-purple-600" />
                      Fee Status Distribution
                    </h2>
                    <p className="text-gray-500 mt-2">Breakdown of student payment status</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/finance/overview')}
                  >
                    View Details
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  {/* Paid Full */}
                  <div className="text-center">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <CheckCircle size={24} className="text-emerald-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{safeNumber(stats.fee_distribution.paid_full)}</div>
                    <div className="text-sm font-medium text-emerald-700">Fully Paid</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {stats.student_status.total_students > 0 
                        ? `${Math.round((safeNumber(stats.fee_distribution.paid_full) / stats.student_status.total_students) * 100)}%`
                        : '0%'}
                    </div>
                  </div>
                  
                  {/* Partial */}
                  <div className="text-center">
                    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Clock size={24} className="text-amber-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{safeNumber(stats.fee_distribution.paid_partial)}</div>
                    <div className="text-sm font-medium text-amber-700">Partial</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {stats.student_status.total_students > 0 
                        ? `${Math.round((safeNumber(stats.fee_distribution.paid_partial) / stats.student_status.total_students) * 100)}%`
                        : '0%'}
                    </div>
                  </div>
                  
                  {/* Not Paid */}
                  <div className="text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <XCircle size={24} className="text-red-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{safeNumber(stats.fee_distribution.not_paid)}</div>
                    <div className="text-sm font-medium text-red-700">Not Paid</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {stats.student_status.total_students > 0 
                        ? `${Math.round((safeNumber(stats.fee_distribution.not_paid) / stats.student_status.total_students) * 100)}%`
                        : '0%'}
                    </div>
                  </div>
                  
                  {/* Scholarship */}
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Award size={24} className="text-purple-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{safeNumber(stats.fee_distribution.scholarship)}</div>
                    <div className="text-sm font-medium text-purple-700">Scholarship</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {stats.student_status.total_students > 0 
                        ? `${Math.round((safeNumber(stats.fee_distribution.scholarship) / stats.student_status.total_students) * 100)}%`
                        : '0%'}
                    </div>
                  </div>
                  
                  {/* Exempted */}
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Shield size={24} className="text-gray-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{safeNumber(stats.fee_distribution.exempted)}</div>
                    <div className="text-sm font-medium text-gray-700">Exempted</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {stats.student_status.total_students > 0 
                        ? `${Math.round((safeNumber(stats.fee_distribution.exempted) / stats.student_status.total_students) * 100)}%`
                        : '0%'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Document Status */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <FileText size={24} className="mr-3 text-blue-600" />
                    Document Status
                  </h2>
                  <p className="text-gray-500 mt-2">Student document completion</p>
                </div>
                <div className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-lg">
                  {safeNumber(stats.document_analysis.completion_rate).toFixed(1)}% Complete
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">With Documents</span>
                    <span className="text-sm font-bold text-gray-900">
                      {safeNumber(stats.document_analysis.total_with_complete_documents)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-emerald-600 h-2 rounded-full" 
                      style={{ 
                        width: `${stats.student_status.total_students > 0 
                          ? (safeNumber(stats.document_analysis.total_with_complete_documents) / stats.student_status.total_students * 100) 
                          : 0}%` 
                      }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Without Documents</span>
                    <span className="text-sm font-bold text-gray-900">
                      {safeNumber(stats.document_analysis.total_without_complete_documents)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-amber-600 h-2 rounded-full" 
                      style={{ 
                        width: `${stats.student_status.total_students > 0 
                          ? (safeNumber(stats.document_analysis.total_without_complete_documents) / stats.student_status.total_students * 100) 
                          : 0}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-100">
                <Button
                  className="w-full justify-center bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => navigate('/students/documents')}
                >
                  <FileText size={16} className="mr-2" />
                  Manage Documents
                </Button>
              </div>
            </div>
          </div>

          {/* Document Analysis Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <FileCheck size={24} className="mr-3 text-blue-600" />
                  Document Status Analysis
                </h2>
                <p className="text-gray-500 mt-2">Student document completion and missing documents</p>
              </div>
              <div className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-lg">
                {safeNumber(stats.document_analysis.completion_rate).toFixed(1)}% Complete
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Completion Overview */}
              <div>
                <h3 className="font-medium text-gray-900 mb-4">Completion Overview</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">Complete Documents</span>
                      <span className="text-sm font-bold text-gray-900">
                        {safeNumber(stats.document_analysis.total_with_complete_documents)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-emerald-600 h-2 rounded-full" 
                        style={{ 
                          width: `${stats.student_status.total_students > 0 
                            ? (safeNumber(stats.document_analysis.total_with_complete_documents) / stats.student_status.total_students * 100) 
                            : 0}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">Incomplete Documents</span>
                      <span className="text-sm font-bold text-gray-900">
                        {safeNumber(stats.document_analysis.total_without_complete_documents)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-amber-600 h-2 rounded-full" 
                        style={{ 
                          width: `${stats.student_status.total_students > 0 
                            ? (safeNumber(stats.document_analysis.total_without_complete_documents) / stats.student_status.total_students * 100) 
                            : 0}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Missing Documents Breakdown */}
              <div>
                <h3 className="font-medium text-gray-900 mb-4">Missing Documents</h3>
                <div className="space-y-3">
                  {stats.document_analysis.missing_documents && 
                   typeof stats.document_analysis.missing_documents === 'object' &&
                   Object.keys(stats.document_analysis.missing_documents).length > 0 ? (
                    Object.entries(stats.document_analysis.missing_documents).map(([docType, count]) => (
                      <div key={docType} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700 capitalize">
                          {docType.replace('_', ' ')}
                        </span>
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                          {safeNumber(count)} missing
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      No missing documents data available
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Students with Outstanding Payments */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <AlertCircle size={24} className="mr-3 text-red-600" />
                  Students with Outstanding Payments
                </h2>
                <p className="text-gray-500 mt-2">Top 10 students with highest outstanding balances</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/finance/debtors')}
                >
                  View All ({safeNumber(stats.student_status.students_with_debt)})
                </Button>
                <Button
                  size="sm"
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => navigate('/finance/collect')}
                >
                  <DollarSign size={16} className="mr-2" />
                  Collect Payments
                </Button>
              </div>
            </div>
            
            {studentsWithDebt.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Student</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Class</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Total Fee</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Amount Paid</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Balance</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Status</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentsWithDebt.map((student) => (
                      <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div>
                            <div className="font-medium text-gray-900">{student.name}</div>
                            <div className="text-sm text-gray-500">{student.admission_number}</div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                            {student.class_level}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-medium text-gray-900">
                          {formatCurrency(student.total_fee)}
                        </td>
                        <td className="py-4 px-4 text-emerald-600 font-medium">
                          {formatCurrency(student.amount_paid)}
                        </td>
                        <td className="py-4 px-4 text-red-600 font-bold">
                          {formatCurrency(student.balance)}
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            student.fee_status === 'paid_partial' 
                              ? 'bg-amber-100 text-amber-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {student.fee_status === 'paid_partial' ? 'Partial' : 'Not Paid'}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleViewStudent(student.id)}
                              className="p-2 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => handleAddPayment(student.id)}
                              className="p-2 bg-emerald-100 text-emerald-600 hover:bg-emerald-200 rounded-lg transition-colors"
                              title="Add Payment"
                            >
                              <CreditCard size={16} />
                            </button>
                            <button
                              onClick={() => handleViewFinancialDetails(student.id)}
                              className="p-2 bg-purple-100 text-purple-600 hover:bg-purple-200 rounded-lg transition-colors"
                              title="Financial Details"
                            >
                              <DollarSign size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="p-3 bg-emerald-50 rounded-full inline-flex mb-3">
                  <CheckCircle size={24} className="text-emerald-600" />
                </div>
                <p className="text-gray-600">No outstanding payments found!</p>
                <p className="text-sm text-gray-500 mt-1">All students are up-to-date with their payments</p>
              </div>
            )}
          </div>

          {/* Quick Actions & Recent Data */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Zap size={24} className="mr-3 text-amber-600" />
                Quick Actions
              </h2>
              
              <div className="space-y-3">
                <Button
                  className="w-full justify-start bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 text-blue-800 border-blue-200 hover:border-blue-300 h-12"
                  onClick={() => navigate('/students/create')}
                >
                  <div className="flex items-center w-full">
                    <UserPlus size={18} className="mr-3 text-blue-600" />
                    <div className="text-left flex-1">
                      <div className="font-medium">Register New Student</div>
                      <div className="text-xs text-blue-600">Add student with full details</div>
                    </div>
                    <ChevronRight size={16} className="text-blue-500" />
                  </div>
                </Button>
                
                <Button
                  className="w-full justify-start bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 text-purple-800 border-purple-200 hover:border-purple-300 h-12"
                  onClick={() => navigate('/parents/create')}
                >
                  <div className="flex items-center w-full">
                    <Users2 size={18} className="mr-3 text-purple-600" />
                    <div className="text-left flex-1">
                      <div className="font-medium">Register New Parent</div>
                      <div className="text-xs text-purple-600">Add parent and link children</div>
                    </div>
                    <ChevronRight size={16} className="text-purple-500" />
                  </div>
                </Button>
                
                <Button
                  className="w-full justify-start bg-gradient-to-r from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200 text-emerald-800 border-emerald-200 hover:border-emerald-300 h-12"
                  onClick={() => navigate('/results/create')}
                >
                  <div className="flex items-center w-full">
                    <FileText size={18} className="mr-3 text-emerald-600" />
                    <div className="text-left flex-1">
                      <div className="font-medium">Upload Exam Results</div>
                      <div className="text-xs text-emerald-600">Add student exam results</div>
                    </div>
                    <ChevronRight size={16} className="text-emerald-500" />
                  </div>
                </Button>
                
                <Button
                  className="w-full justify-start bg-gradient-to-r from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 text-red-800 border-red-200 hover:border-red-300 h-12"
                  onClick={() => navigate('/finance/collect')}
                >
                  <div className="flex items-center w-full">
                    <CreditCard size={18} className="mr-3 text-red-600" />
                    <div className="text-left flex-1">
                      <div className="font-medium">Collect Fee Payment</div>
                      <div className="text-xs text-red-600">Record student payments</div>
                    </div>
                    <ChevronRight size={16} className="text-red-500" />
                  </div>
                </Button>
              </div>
            </div>
            
            {/* Recent Students */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <Users size={24} className="mr-3 text-indigo-600" />
                    Recent Student Registrations
                  </h2>
                  <p className="text-gray-500 mt-2">Latest student additions to the system</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/students')}
                >
                  View All
                </Button>
              </div>
              
              {recentStudents.length > 0 ? (
                <div className="space-y-4">
                  {recentStudents.map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center">
                        <div className="p-2 bg-indigo-50 rounded-lg mr-3">
                          <GraduationCap size={18} className="text-indigo-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {student.user?.first_name || student.first_name} {student.user?.last_name || student.last_name}
                          </div>
                          <div className="text-sm text-gray-600">
                            {student.class_level?.name || student.class_level_name || 'Not Assigned'}
                          </div>
                          <div className="text-xs text-gray-500">
                            Admitted: {student.admission_date || student.created_at || 'N/A'}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${
                          student.fee_status === 'paid_full' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : student.fee_status === 'paid_partial'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {student.fee_status === 'paid_full' ? 'Paid' : 
                           student.fee_status === 'paid_partial' ? 'Partial' : 'Pending'}
                        </span>
                        <button
                          onClick={() => handleViewStudent(student.id)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="p-3 bg-gray-50 rounded-full inline-flex mb-3">
                    <Users size={24} className="text-gray-500" />
                  </div>
                  <p className="text-gray-600">No recent students</p>
                  <p className="text-sm text-gray-500 mt-1">New student registrations will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Student Details Modal */}
      {showStudentModal && studentDetails && (
        <Modal
          isOpen={showStudentModal}
          onClose={() => setShowStudentModal(false)}
          title="Student Details"
          size="lg"
        >
          <div className="py-4">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden">
                {studentDetails.student_image_url ? (
                  <img 
                    src={studentDetails.student_image_url} 
                    alt={studentDetails.user?.first_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <GraduationCap size={24} className="text-blue-600" />
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {studentDetails.user?.first_name} {studentDetails.user?.last_name}
                </h3>
                <p className="text-gray-600">{studentDetails.admission_number}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                    {studentDetails.class_level_info?.name || studentDetails.class_level?.name}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded ${
                    studentDetails.fee_status === 'paid_full' 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : studentDetails.fee_status === 'paid_partial'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {studentDetails.fee_status === 'paid_full' ? 'Paid' : 
                     studentDetails.fee_status === 'paid_partial' ? 'Partial' : 
                     studentDetails.fee_status === 'scholarship' ? 'Scholarship' : 
                     studentDetails.fee_status === 'exempted' ? 'Exempted' : 'Not Paid'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="text-gray-900 bg-gray-50 px-3 py-2 rounded border border-gray-200">
                  {studentDetails.user?.email || 'Not provided'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <div className="text-gray-900 bg-gray-50 px-3 py-2 rounded border border-gray-200">
                  {studentDetails.user?.phone_number || 'Not provided'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Admission Date</label>
                <div className="text-gray-900 bg-gray-50 px-3 py-2 rounded border border-gray-200">
                  {studentDetails.admission_date || 'Not provided'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
                <div className="text-gray-900 bg-gray-50 px-3 py-2 rounded border border-gray-200">
                  {studentDetails.student_id || 'Not assigned'}
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-gray-900 mb-2">Financial Summary</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600">Total Fee</div>
                  <div className="text-lg font-bold text-gray-900">
                    {formatCurrency(studentDetails.total_fee_amount)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Amount Paid</div>
                  <div className="text-lg font-bold text-emerald-600">
                    {formatCurrency(studentDetails.amount_paid)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Balance</div>
                  <div className="text-lg font-bold text-red-600">
                    {formatCurrency((studentDetails.total_fee_amount || 0) - (studentDetails.amount_paid || 0))}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Status</div>
                  <div className={`font-medium ${
                    studentDetails.fee_status === 'paid_full' ? 'text-emerald-600' :
                    studentDetails.fee_status === 'paid_partial' ? 'text-amber-600' :
                    'text-red-600'
                  }`}>
                    {studentDetails.fee_status === 'paid_full' ? 'Fully Paid' : 
                     studentDetails.fee_status === 'paid_partial' ? 'Partial Payment' : 
                     studentDetails.fee_status === 'scholarship' ? 'Scholarship' : 
                     studentDetails.fee_status === 'exempted' ? 'Exempted' : 'Not Paid'}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowStudentModal(false)}
              >
                Close
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => {
                  setShowStudentModal(false);
                  handleViewFinancialDetails(studentDetails.id);
                }}
              >
                <DollarSign size={16} className="mr-2" />
                View Financial Details
              </Button>
              <Button
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={() => {
                  setShowStudentModal(false);
                  handleAddPayment(studentDetails.id);
                }}
              >
                <CreditCard size={16} className="mr-2" />
                Add Payment
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Financial Details Modal */}
      {showFinancialModal && financialDetails && (
        <Modal
          isOpen={showFinancialModal}
          onClose={() => setShowFinancialModal(false)}
          title="Financial Details"
          size="xl"
        >
          <div className="py-4">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {financialDetails.student.user?.first_name} {financialDetails.student.user?.last_name}
              </h3>
              <p className="text-gray-600">{financialDetails.student.admission_number}</p>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-6">
              <h4 className="font-bold text-gray-900 mb-4 text-lg">Financial Summary</h4>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {formatCurrency(financialDetails.summary.total_fee)}
                  </div>
                  <div className="text-sm text-gray-600">Total Fee</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600">
                    {formatCurrency(financialDetails.summary.amount_paid)}
                  </div>
                  <div className="text-sm text-gray-600">Amount Paid</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {formatCurrency(financialDetails.summary.balance)}
                  </div>
                  <div className="text-sm text-gray-600">Balance</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {financialDetails.summary.total_payments}
                  </div>
                  <div className="text-sm text-gray-600">Total Payments</div>
                </div>
              </div>
            </div>
            
            {financialDetails.payments && financialDetails.payments.length > 0 ? (
              <div className="mb-6">
                <h4 className="font-bold text-gray-900 mb-4">Payment History</h4>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="py-2 px-3 text-left text-sm font-medium text-gray-700">Date</th>
                        <th className="py-2 px-3 text-left text-sm font-medium text-gray-700">Amount</th>
                        <th className="py-2 px-3 text-left text-sm font-medium text-gray-700">Method</th>
                        <th className="py-2 px-3 text-left text-sm font-medium text-gray-700">Reference</th>
                        <th className="py-2 px-3 text-left text-sm font-medium text-gray-700">Status</th>
                        <th className="py-2 px-3 text-left text-sm font-medium text-gray-700">Receipt</th>
                      </tr>
                    </thead>
                    <tbody>
                      {financialDetails.payments.map((payment, index) => (
                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-3">
                            {new Date(payment.payment_date).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-3 font-medium text-emerald-600">
                            {formatCurrency(payment.amount)}
                          </td>
                          <td className="py-3 px-3">
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                              {payment.payment_method || 'Cash'}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-sm text-gray-600">
                            {payment.reference_number || 'N/A'}
                          </td>
                          <td className="py-3 px-3">
                            <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs font-medium rounded">
                              {payment.status || 'Completed'}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <button
                              onClick={() => secretaryService.generateFeeReceipt(
                                financialDetails.student.id, 
                                payment.id
                              )}
                              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                              title="Download Receipt"
                            >
                              <Download size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 bg-gray-50 rounded-lg mb-6">
                <div className="p-3 bg-gray-100 rounded-full inline-flex mb-3">
                  <CreditCard size={24} className="text-gray-500" />
                </div>
                <p className="text-gray-600">No payment history found</p>
                <p className="text-sm text-gray-500 mt-1">No payments have been recorded for this student</p>
              </div>
            )}
            
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowFinancialModal(false)}
              >
                Close
              </Button>
              <Button
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={() => {
                  setShowFinancialModal(false);
                  handleAddPayment(financialDetails.student.id);
                }}
              >
                <CreditCard size={16} className="mr-2" />
                Add New Payment
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => secretaryService.generateFeeReceipt(
                  financialDetails.student.id, 
                  'latest'
                )}
              >
                <Download size={16} className="mr-2" />
                Download Receipt
              </Button>
            </div>
          </div>
        </Modal>
      )}
      
      {/* Footer Note */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          Secretary Dashboard • Financial & Administrative Management System
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Last updated: {new Date().toLocaleString()}
        </p>
      </div>
    </DashboardLayout>
  );
};

export default Secretary;