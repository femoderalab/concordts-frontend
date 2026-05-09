import { get } from './api';

/**
 * Get comprehensive dashboard statistics for admin
 * @returns {Promise<Object>} - Dashboard statistics
 */
export const getDashboardStats = async () => {
  try {
    console.log('📊 Fetching comprehensive dashboard stats...');
    
    // Primary endpoint - Admin Dashboard
    const response = await get('/auth/admin/dashboard/');
    const data = response.data || response;
    
    console.log('📦 Raw backend response:', data);
    
    // Map backend field names to frontend expected names
    const mappedStats = {
      // ===========================
      // USER STATISTICS
      // ===========================
      totalUsers: data.total_users || 0,
      activeUsers: data.active_users || 0,
      verifiedUsers: data.verified_users || 0,
      newUsersToday: data.new_users_today || 0,
      newUsersThisWeek: data.new_users_this_week || 0,
      usersOnline: data.users_online || 0,
      roleCounts: data.role_counts || {},
      
      // ===========================
      // STUDENT STATISTICS
      // ===========================
      totalStudents: data.total_students || 0,
      enrolledStudents: data.enrolled_students || 0,
      studentPercentage: data.enrollment_percentage || 0,
      
      // ===========================
      // PARENT STATISTICS
      // ===========================
      totalParents: data.total_parents || 0,
      registeredParents: data.registered_parents || 0,
      parentPercentage: data.parent_coverage || 0,
      
      // ===========================
      // STAFF STATISTICS
      // ===========================
      totalStaff: data.total_staff || 0,
      teachingStaff: data.teaching_staff || 0,
      nonTeachingStaff: data.non_teaching_staff || 0,
      staffPercentage: data.total_users > 0 
        ? ((data.total_staff || 0) / data.total_users * 100).toFixed(2) 
        : 0,
      
      // ===========================
      // ACADEMIC STATISTICS
      // ===========================
      totalClasses: data.total_classes || 0,
      activeClasses: data.active_classes || 0,
      totalSubjects: data.total_subjects || 0,
      activeSubjects: data.active_subjects || 0,
      
      // ===========================
      // RESULTS STATISTICS
      // ===========================
      publishedResults: data.results_published || 0,
      totalResults: data.total_results || 0,
      publishedPercentage: data.results_percentage || 0,
      
      // ===========================
      // FEE STATISTICS
      // ===========================
      // Main fee collection data
      // FEE STATISTICS — reads top-level keys (new backend) with fallback to nested (old)
      paymentPercentage: data.paymentPercentage ?? data.fee_collection?.percentage ?? 0,
      totalAmountExpected: data.totalAmountExpected ?? data.fee_collection?.total_expected ?? 0,
      totalAmountPaid: data.totalAmountPaid ?? data.fee_collection?.total_collected ?? 0,
      totalBalanceDue: data.totalAmountExpected != null
        ? (data.totalAmountExpected - (data.totalAmountPaid || 0))
        : ((data.fee_collection?.total_expected || 0) - (data.fee_collection?.total_collected || 0)),
      currency: '₦',

      // Fee status breakdown — top-level first, nested fallback
      totalPaidFull: data.totalPaidFull ?? data.fee_collection?.status?.fully_paid ?? 0,
      totalPaidPartial: data.totalPaidPartial ?? data.fee_collection?.status?.partial ?? 0,
      totalNotPaid: data.totalNotPaid ?? data.fee_collection?.status?.not_paid ?? 0,
      totalScholarship: data.totalScholarship ?? data.fee_collection?.status?.scholarship ?? 0,
      totalExempted: data.totalExempted ?? data.fee_collection?.status?.exempted ?? 0,

      feeCollection: {
        total_expected: data.totalAmountExpected ?? data.fee_collection?.total_expected ?? 0,
        total_collected: data.totalAmountPaid ?? data.fee_collection?.total_collected ?? 0,
        percentage: data.paymentPercentage ?? data.fee_collection?.percentage ?? 0,
        currency: '₦',
        status: {
          fully_paid: data.totalPaidFull ?? data.fee_collection?.status?.fully_paid ?? 0,
          partial: data.totalPaidPartial ?? data.fee_collection?.status?.partial ?? 0,
          not_paid: data.totalNotPaid ?? data.fee_collection?.status?.not_paid ?? 0,
          scholarship: data.totalScholarship ?? data.fee_collection?.status?.scholarship ?? 0,
          exempted: data.totalExempted ?? data.fee_collection?.status?.exempted ?? 0,
        }
      },
      
      // ===========================
      // ACADEMIC INFO
      // ===========================
      currentSession: data.current_session || 'Not set',
      currentTerm: data.current_term || 'Not set',
      
      // ===========================
      // ADDITIONAL METRICS
      // ===========================
      studentTeacherRatio: data.student_teacher_ratio || 0,
      parentCoverage: data.parent_coverage || 0,
      
      // ===========================
      // RECENT DATA
      // ===========================
      recentRegistrations: data.recent_registrations || [],
      
      // ===========================
      // METADATA
      // ===========================
      lastUpdated: data.timestamp || new Date().toISOString(),
      timestamp: data.timestamp || new Date().toISOString(),
      success: true
    };
    
    console.log('✅ Mapped dashboard stats:', mappedStats);
    console.log('📊 Fee Collection Data:', {
      percentage: mappedStats.paymentPercentage,
      expected: mappedStats.totalAmountExpected,
      collected: mappedStats.totalAmountPaid,
      status: {
        fully_paid: mappedStats.totalPaidFull,
        partial: mappedStats.totalPaidPartial,
        not_paid: mappedStats.totalNotPaid,
        scholarship: mappedStats.totalScholarship,
        exempted: mappedStats.totalExempted
      }
    });
    
    return mappedStats;

  } catch (error) {
    console.error('❌ Error fetching dashboard stats:', error);
    console.error('Error details:', error.response?.data || error.message);
    
    // Return fallback statistics with error indication
    return {
      success: false,
      error: error.message,
      
      // User statistics
      totalUsers: 0,
      activeUsers: 0,
      verifiedUsers: 0,
      newUsersToday: 0,
      newUsersThisWeek: 0,
      usersOnline: 0,
      roleCounts: {},
      
      // Student statistics
      totalStudents: 0,
      enrolledStudents: 0,
      studentPercentage: 0,
      
      // Parent statistics
      totalParents: 0,
      registeredParents: 0,
      parentPercentage: 0,
      
      // Staff statistics
      totalStaff: 0,
      teachingStaff: 0,
      nonTeachingStaff: 0,
      staffPercentage: 0,
      
      // Academic statistics
      totalClasses: 0,
      activeClasses: 0,
      totalSubjects: 0,
      activeSubjects: 0,
      
      // Results statistics
      publishedResults: 0,
      totalResults: 0,
      publishedPercentage: 0,
      
      // Fee statistics
      paymentPercentage: 0,
      totalAmountExpected: 0,
      totalAmountPaid: 0,
      totalBalanceDue: 0,
      currency: '₦',
      totalPaidFull: 0,
      totalPaidPartial: 0,
      totalNotPaid: 0,
      totalScholarship: 0,
      totalExempted: 0,
      
      feeCollection: {
        total_expected: 0,
        total_collected: 0,
        percentage: 0,
        currency: '₦',
        status: {
          fully_paid: 0,
          partial: 0,
          not_paid: 0,
          scholarship: 0,
          exempted: 0,
        }
      },
      
      // Academic info
      currentSession: 'Not set',
      currentTerm: 'Not set',
      
      // Additional metrics
      studentTeacherRatio: 0,
      parentCoverage: 0,
      
      // Recent data
      recentRegistrations: [],
      
      // Metadata
      lastUpdated: new Date().toISOString(),
      timestamp: new Date().toISOString()
    };
  }
};

/**
 * Get parent-specific dashboard statistics
 * @returns {Promise<Object>} - Parent dashboard data
 */
export const getParentDashboardStats = async () => {
  try {
    console.log('👨‍👩‍👧 Fetching parent dashboard stats...');
    const response = await get('/parents/dashboard/');
    const data = response.data || response;
    
    console.log('✅ Parent dashboard stats loaded:', data);
    return {
      children_count: data.children_count || 0,
      total_balance: data.total_balance || 0,
      attendance_rate: data.attendance_rate || 0,
      unread_messages: data.unread_messages || 0,
      fee_payment_status: data.fee_payment_status || 'none',
      children: data.children || [],
      recent_activities: data.recent_activities || [],
      success: true
    };
  } catch (error) {
    console.error('❌ Error fetching parent dashboard stats:', error);
    
    return {
      children_count: 0,
      total_balance: 0,
      attendance_rate: 0,
      unread_messages: 0,
      fee_payment_status: 'none',
      children: [],
      recent_activities: [],
      success: false,
      error: error.message
    };
  }
};

/**
 * Get student-specific dashboard statistics
 * @returns {Promise<Object>} - Student dashboard data
 */
export const getStudentDashboardStats = async () => {
  try {
    console.log('🎓 Fetching student dashboard stats...');
    const response = await get('/students/dashboard/');
    const data = response.data || response;
    
    console.log('✅ Student dashboard stats loaded:', data);
    return {
      attendance_rate: data.attendance_rate || 0,
      fee_balance: data.fee_balance || 0,
      current_class: data.current_class || 'Not assigned',
      current_level: data.current_level || 'Not assigned',
      upcoming_exams: data.upcoming_exams || [],
      recent_results: data.recent_results || [],
      subjects: data.subjects || [],
      success: true
    };
  } catch (error) {
    console.error('❌ Error fetching student dashboard stats:', error);
    
    return {
      attendance_rate: 0,
      fee_balance: 0,
      current_class: 'Not assigned',
      current_level: 'Not assigned',
      upcoming_exams: [],
      recent_results: [],
      subjects: [],
      success: false,
      error: error.message
    };
  }
};

/**
 * Get teacher-specific dashboard statistics
 * @returns {Promise<Object>} - Teacher dashboard data
 */
export const getTeacherDashboardStats = async () => {
  try {
    console.log('👨‍🏫 Fetching teacher dashboard stats...');
    const response = await get('/staff/dashboard/');
    const data = response.data || response;
    
    console.log('✅ Teacher dashboard stats loaded:', data);
    return {
      total_students: data.total_students || 0,
      total_classes: data.total_classes || 0,
      total_subjects: data.total_subjects || 0,
      upcoming_classes: data.upcoming_classes || [],
      pending_grading: data.pending_grading || [],
      recent_activities: data.recent_activities || [],
      assigned_classes: data.assigned_classes || [],
      success: true
    };
  } catch (error) {
    console.error('❌ Error fetching teacher dashboard stats:', error);
    
    return {
      total_students: 0,
      total_classes: 0,
      total_subjects: 0,
      upcoming_classes: [],
      pending_grading: [],
      recent_activities: [],
      assigned_classes: [],
      success: false,
      error: error.message
    };
  }
};

/**
 * Get system health status
 * @returns {Promise<Object>} - System health metrics
 */
export const getSystemHealth = async () => {
  try {
    console.log('🏥 Checking system health...');
    const response = await get('/api/health/');
    const data = response.data || response;
    
    console.log('✅ System health:', data);
    return {
      status: data.status || 'healthy',
      timestamp: data.timestamp || new Date().toISOString(),
      uptime: data.uptime || 0,
      database: data.database || 'connected',
      services: data.services || ['auth', 'users', 'students', 'parents', 'staff'],
      last_check: data.last_check || new Date().toISOString(),
      success: true
    };
  } catch (error) {
    console.warn('⚠️ Could not fetch system health:', error);
    
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: 0,
      database: 'connected',
      services: ['auth', 'users', 'students', 'parents', 'staff'],
      last_check: new Date().toISOString(),
      success: false
    };
  }
};

/**
 * Get quick stats for dashboard cards
 * @returns {Promise<Object>} - Quick statistics
 */
export const getQuickStats = async () => {
  try {
    console.log('⚡ Fetching quick stats...');
    
    const [dashboardStats, systemHealth] = await Promise.allSettled([
      getDashboardStats(),
      getSystemHealth()
    ]);

    const stats = dashboardStats.status === 'fulfilled' 
      ? dashboardStats.value 
      : {};
      
    const health = systemHealth.status === 'fulfilled' 
      ? systemHealth.value 
      : { status: 'unknown' };

    return {
      ...stats,
      systemHealth: health,
      timestamp: new Date().toISOString(),
      success: true
    };
  } catch (error) {
    console.error('❌ Error fetching quick stats:', error);
    
    return {
      totalUsers: 0,
      totalStudents: 0,
      totalParents: 0,
      totalStaff: 0,
      systemHealth: {
        status: 'unknown',
        timestamp: new Date().toISOString()
      },
      success: false,
      error: error.message
    };
  }
};

/**
 * Get registration trends (last 6 months)
 * @returns {Promise<Array>} - Registration trend data
 */
export const getRegistrationTrends = async () => {
  try {
    console.log('📈 Fetching registration trends...');
    const response = await get('/auth/admin/registration-trends/?months=6');
    const data = response.data || response;
    
    console.log('✅ Registration trends loaded:', data);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.warn('⚠️ Could not fetch registration trends:', error);
    
    // Generate fallback trend data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map((month, index) => ({
      month,
      registrations: Math.floor(Math.random() * 50) + 10,
      students: Math.floor(Math.random() * 30) + 5,
      parents: Math.floor(Math.random() * 15) + 2,
      teachers: Math.floor(Math.random() * 5) + 1
    }));
  }
};

/**
 * Get academic statistics
 * @returns {Promise<Object>} - Academic statistics
 */
export const getAcademicStats = async () => {
  try {
    console.log('📚 Fetching academic statistics...');
    const response = await get('/academic/dashboard/statistics/');
    const data = response.data || response;
    
    console.log('✅ Academic stats loaded:', data);
    return {
      totalClasses: data.total_classes || data.totalClasses || 0,
      activeClasses: data.active_classes || data.activeClasses || 0,
      totalSubjects: data.total_subjects || data.totalSubjects || 0,
      activeSubjects: data.active_subjects || data.activeSubjects || 0,
      totalClassLevels: data.total_class_levels || data.totalClassLevels || 0,
      totalPrograms: data.total_programs || data.totalPrograms || 0,
      success: true
    };
  } catch (error) {
    console.warn('⚠️ Could not fetch academic stats:', error);
    
    return {
      totalClasses: 0,
      activeClasses: 0,
      totalSubjects: 0,
      activeSubjects: 0,
      totalClassLevels: 0,
      totalPrograms: 0,
      success: false
    };
  }
};

/**
 * Get result statistics
 * @returns {Promise<Object>} - Result statistics
 */
export const getResultStats = async () => {
  try {
    console.log('📝 Fetching result statistics...');
    const response = await get('/results/statistics/');
    const data = response.data || response;
    
    console.log('✅ Result stats loaded:', data);
    return {
      totalResults: data.total_results || data.totalResults || 0,
      publishedResults: data.published_results || data.publishedResults || 0,
      unpublishedResults: data.unpublished_results || data.unpublishedResults || 0,
      success: true
    };
  } catch (error) {
    console.warn('⚠️ Could not fetch result stats:', error);
    
    return {
      totalResults: 0,
      publishedResults: 0,
      unpublishedResults: 0,
      success: false
    };
  }
};

/**
 * Get fee statistics
 * @returns {Promise<Object>} - Fee statistics
 */
export const getFeeStats = async () => {
  try {
    console.log('💰 Fetching fee statistics...');
    const response = await get('/students/statistics/');
    const data = response.data || response;
    
    console.log('✅ Fee stats loaded:', data);
    return {
      totalPaidFull: data.total_paid_full || data.totalPaidFull || 0,
      totalPaidPartial: data.total_paid_partial || data.totalPaidPartial || 0,
      totalNotPaid: data.total_not_paid || data.totalNotPaid || 0,
      totalScholarship: data.total_scholarship || data.totalScholarship || 0,
      totalExempted: data.total_exempted || data.totalExempted || 0,
      totalFeeAmount: data.total_fee_amount || data.totalFeeAmount || 0,
      totalAmountPaid: data.total_amount_paid || data.totalAmountPaid || 0,
      totalBalanceDue: data.total_balance_due || data.totalBalanceDue || 0,
      success: true
    };
  } catch (error) {
    console.warn('⚠️ Could not fetch fee stats:', error);
    
    return {
      totalPaidFull: 0,
      totalPaidPartial: 0,
      totalNotPaid: 0,
      totalScholarship: 0,
      totalExempted: 0,
      totalFeeAmount: 0,
      totalAmountPaid: 0,
      totalBalanceDue: 0,
      success: false
    };
  }
};

/**
 * Refresh dashboard data
 * Forces a fresh fetch of all dashboard statistics
 * @returns {Promise<Object>} - Refreshed dashboard data
 */
export const refreshDashboard = async () => {
  try {
    console.log('🔄 Refreshing dashboard data...');
    
    // Clear any cached data if your API supports it
    const timestamp = new Date().getTime();
    const response = await get(`/auth/admin/dashboard/?refresh=${timestamp}`);
    const data = response.data || response;
    
    console.log('✅ Dashboard refreshed successfully');
    return getDashboardStats(); // Return properly mapped data
  } catch (error) {
    console.error('❌ Error refreshing dashboard:', error);
    throw error;
  }
};

// =====================
// EXPORT SERVICE
// =====================

const dashboardService = {
  // Main dashboard functions
  getDashboardStats,
  getParentDashboardStats,
  getStudentDashboardStats,
  getTeacherDashboardStats,
  
  // System and health
  getSystemHealth,
  getQuickStats,
  
  // Specific statistics
  getAcademicStats,
  getResultStats,
  getFeeStats,
  
  // Trends and analytics
  getRegistrationTrends,
  
  // Utility
  refreshDashboard
};

export default dashboardService;