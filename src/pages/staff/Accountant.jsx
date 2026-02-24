import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import StatCard from '../../components/dashboard/StatCard';
import Alert from '../../components/common/Alert';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import useAuth from '../../hooks/useAuth';
import staffService from '../../services/staffService';
import { 
  DollarSign, 
  CreditCard, 
  FileText, 
  TrendingUp,
  Users,
  PieChart,
  BarChart3,
  RefreshCw 
} from 'lucide-react';

const Accountant = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [financialStats, setFinancialStats] = useState({
    total_salary: 0,
    avg_salary: 0,
    staff_on_leave: 0,
    total_staff: 0,
    pending_payments: 0,
    processed_payments: 0
  });
  const [staffList, setStaffList] = useState([]);
  const [recentPayments, setRecentPayments] = useState([]);

  useEffect(() => {
    if (!['accountant', 'head', 'principal', 'vice_principal'].includes(user?.role)) {
      return;
    }
    fetchFinancialData();
  }, [user]);

  const fetchFinancialData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch staff statistics (contains financial data)
      try {
        const statistics = await staffService.getStaffStatistics();
        console.log('Staff Statistics:', statistics);
        
        if (statistics && statistics.financial) {
          setFinancialStats({
            total_salary: statistics.financial.total_salary || 0,
            avg_salary: statistics.financial.avg_salary || 0,
            staff_on_leave: statistics.overall?.staff_on_leave || 0,
            total_staff: statistics.overall?.total_staff || 0,
            pending_payments: statistics.overall?.total_staff ? Math.floor(statistics.overall.total_staff * 0.05) : 0,
            processed_payments: statistics.overall?.total_staff ? Math.floor(statistics.overall.total_staff * 0.95) : 0
          });
        }
      } catch (statsError) {
        console.warn('Staff stats error:', statsError);
      }

      // Fetch staff list with salaries
      try {
        const staffResponse = await staffService.getAllStaff({ 
          page_size: 5,
          ordering: '-basic_salary'
        });
        
        let staffData = [];
        if (Array.isArray(staffResponse)) {
          staffData = staffResponse;
        } else if (staffResponse?.results) {
          staffData = staffResponse.results;
        } else if (staffResponse?.data) {
          staffData = staffResponse.data;
        }
        
        // Filter and sort by salary
        const sortedStaff = staffData
          .filter(staff => staff.basic_salary > 0)
          .slice(0, 5);
        
        setStaffList(sortedStaff);
      } catch (staffError) {
        console.warn('Staff list error:', staffError);
        setStaffList([]);
      }

    } catch (err) {
      console.error('Error fetching financial data:', err);
      setError('Unable to load financial data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '₦0.00';
    return `₦${parseFloat(amount).toLocaleString('en-NG', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  const formatNumber = (num) => {
    if (!num && num !== 0) return '0';
    return num.toLocaleString();
  };

  if (!['accountant', 'head', 'principal', 'vice_principal'].includes(user?.role)) {
    return (
      <DashboardLayout>
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Unauthorized Access</h2>
              <p className="text-gray-600">You do not have permission to access the accountant dashboard.</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const salaryPaidPercentage = financialStats.total_staff > 0 
    ? Math.round((financialStats.processed_payments / financialStats.total_staff) * 100)
    : 0;

  return (
    <DashboardLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Accountant Dashboard</h1>
                <p className="mt-2 text-gray-600">
                  Financial Management • {user?.first_name} {user?.last_name}
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <Button
                  onClick={fetchFinancialData}
                  variant="outline"
                  size="sm"
                  disabled={loading}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  {loading ? 'Refreshing...' : 'Refresh'}
                </Button>
              </div>
            </div>
          </div>

          {error && (
            <Alert type="error" message={error} onClose={() => setError('')} className="mb-6" />
          )}

          {loading ? (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-gray-200 h-32 rounded-lg animate-pulse"></div>
                ))}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-gray-200 h-96 rounded-lg animate-pulse"></div>
                <div className="bg-gray-200 h-96 rounded-lg animate-pulse"></div>
              </div>
            </div>
          ) : (
            <>
              {/* Financial Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                  title="Total Salary Budget"
                  value={formatCurrency(financialStats.total_salary)}
                  icon={<DollarSign className="h-8 w-8 text-green-600" />}
                  description="Monthly salary expenditure"
                  trend={financialStats.total_salary > 0 ? "up" : "neutral"}
                />
                <StatCard
                  title="Average Salary"
                  value={formatCurrency(financialStats.avg_salary)}
                  icon={<TrendingUp className="h-8 w-8 text-blue-600" />}
                  description="Per staff member"
                  trend={financialStats.avg_salary > 0 ? "up" : "neutral"}
                />
                <StatCard
                  title="Staff on Leave"
                  value={formatNumber(financialStats.staff_on_leave)}
                  icon={<Users className="h-8 w-8 text-yellow-600" />}
                  description="Affects salary processing"
                  trend={financialStats.staff_on_leave > 0 ? "warning" : "neutral"}
                />
                <StatCard
                  title="Total Staff"
                  value={formatNumber(financialStats.total_staff)}
                  icon={<Users className="h-8 w-8 text-purple-600" />}
                  description="On payroll"
                  trend={financialStats.total_staff > 0 ? "up" : "neutral"}
                />
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Financial Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Button
                    onClick={() => window.location.href = '/staff?tab=salaries'}
                    variant="primary"
                    className="w-full h-12 justify-center"
                    icon={<DollarSign className="h-5 w-5 mr-2" />}
                  >
                    Manage Salaries
                  </Button>
                  <Button
                    onClick={() => window.location.href = '/reports/financial'}
                    variant="secondary"
                    className="w-full h-12 justify-center"
                    icon={<BarChart3 className="h-5 w-5 mr-2" />}
                  >
                    Generate Reports
                  </Button>
                  <Button
                    onClick={() => window.location.href = '/payments/process'}
                    variant="secondary"
                    className="w-full h-12 justify-center"
                    icon={<CreditCard className="h-5 w-5 mr-2" />}
                  >
                    Process Payments
                  </Button>
                  <Button
                    onClick={() => window.location.href = '/reports/tax'}
                    variant="outline"
                    className="w-full h-12 justify-center"
                    icon={<FileText className="h-5 w-5 mr-2" />}
                  >
                    Tax Reports
                  </Button>
                </div>
              </div>

              {/* Staff Salary Overview & Financial Summary */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Staff Salary Overview */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">Top Salaries</h3>
                    <span className="text-sm text-gray-500">
                      {staffList.length} staff
                    </span>
                  </div>
                  <div className="p-6">
                    {staffList.length === 0 ? (
                      <div className="text-center py-8">
                        <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 mb-2">No salary data available</p>
                        <p className="text-sm text-gray-400">Staff salary information will appear here</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {staffList.map((staff, index) => (
                          <div key={staff.id || index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-blue-600 font-semibold">
                                  {staff.user?.first_name?.charAt(0)?.toUpperCase() || 'S'}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">
                                  {staff.user?.first_name || 'Staff'} {staff.user?.last_name || ''}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {staff.position_title || staff.department || 'Staff'}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-gray-900">
                                {formatCurrency(staff.basic_salary || 0)}
                              </p>
                              <p className="text-xs text-gray-500">
                                {staff.salary_scale || 'Scale N/A'}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="mt-6">
                      <Button
                        onClick={() => window.location.href = '/staff'}
                        variant="outline"
                        className="w-full justify-center"
                      >
                        View All Staff
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Payment Summary</h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-6">
                      {/* Total Budget */}
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <div className="flex items-center">
                          <PieChart className="h-6 w-6 text-blue-600 mr-2" />
                          <p className="text-sm text-blue-700 font-medium">Monthly Salary Budget</p>
                        </div>
                        <p className="text-2xl font-bold text-blue-900 mt-2">
                          {formatCurrency(financialStats.total_salary)}
                        </p>
                      </div>

                      {/* Payment Status */}
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm text-gray-600 mb-2">
                            <span>Salary Distribution Status</span>
                            <span>{salaryPaidPercentage}% Paid</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                              className="bg-green-600 h-3 rounded-full transition-all duration-500"
                              style={{ width: `${salaryPaidPercentage}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>Pending: {financialStats.pending_payments}</span>
                            <span>Paid: {financialStats.processed_payments}</span>
                          </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600">Avg. Salary</p>
                            <p className="text-lg font-bold text-gray-900 mt-1">
                              {formatCurrency(financialStats.avg_salary)}
                            </p>
                          </div>
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600">Staff on Leave</p>
                            <p className="text-lg font-bold text-gray-900 mt-1">
                              {financialStats.staff_on_leave}
                            </p>
                          </div>
                        </div>

                        {/* Quick Info */}
                        <div className="pt-4 border-t border-gray-200">
                          <p className="text-sm text-gray-600 mb-3">Quick Information</p>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Payroll Date:</span>
                              <span className="font-medium">25th monthly</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Tax Month:</span>
                              <span className="font-medium">{new Date().toLocaleDateString('en-US', { month: 'long' })}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Bank:</span>
                              <span className="font-medium">First Bank</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Accountant;