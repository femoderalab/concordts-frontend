import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import useAuth from '../../hooks/useAuth';
import { getAllStaff } from '../../services/staffService';
import { getPaymentStatistics, getPaymentHistory, getAllInvoices } from '../../services/paymentService';
import { getSalaryPayments, createSalaryPayment, updateSalaryPayment } from '../../services/salaryService';
import { 
  DollarSign, Users, Receipt, TrendingUp, TrendingDown,
  AlertCircle, Eye, RefreshCw, Download, Filter, Search,
  Calendar, Clock, CheckCircle, XCircle, Plus, FileText,
  CreditCard, Banknote, Printer, BarChart3, PieChart,
  Wallet, Building2, UserCheck, Award, AlertTriangle,
  ChevronRight, X, Trash2, Edit2, Save, Loader2,
  History, Edit3, ChevronLeft, ChevronRight as ChevronRightIcon
} from 'lucide-react';
import Alert from '../../components/common/Alert';
import Button from '../../components/common/Button';
import Modal from '../../components/common/modal';

// Chart imports
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const AccountantDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // States
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  
  // Pagination states
  const [staffPage, setStaffPage] = useState(1);
  const [staffTotalPages, setStaffTotalPages] = useState(1);
  const [staffTotalCount, setStaffTotalCount] = useState(0);
  const [invoicesPage, setInvoicesPage] = useState(1);
  const [invoicesTotalPages, setInvoicesTotalPages] = useState(1);
  const [invoicesTotalCount, setInvoicesTotalCount] = useState(0);
  const [paymentsPage, setPaymentsPage] = useState(1);
  const [paymentsTotalPages, setPaymentsTotalPages] = useState(1);
  
  const itemsPerPage = 10;
  
  // Financial Stats
  const [financialStats, setFinancialStats] = useState({
    total_revenue: 0,
    total_outstanding: 0,
    collection_rate: 0,
    total_staff: 0,
    // total_salary_budget: 0,
    // salaries_paid_this_month: 0,
    salaries_pending: 0,
    successful_payments: 0,
    pending_payments: 0,
    monthly_trend: []
  });
  
  // Staff Salary Data
  const [staffList, setStaffList] = useState([]);
  const [salaryPayroll, setSalaryPayroll] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [savedPayments, setSavedPayments] = useState({});
  
  // Payment Data
  const [recentPayments, setRecentPayments] = useState([]);
  const [allPayments, setAllPayments] = useState([]);
  const [pendingManualPayments, setPendingManualPayments] = useState([]);
  const [invoices, setInvoices] = useState([]);
  
  // Edit History Modal
  const [showEditHistoryModal, setShowEditHistoryModal] = useState(false);
  const [editReason, setEditReason] = useState('');
  const [editFormData, setEditFormData] = useState(null);
  const [editingStaffId, setEditingStaffId] = useState(null);
  
  // Search/Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const isAccountant = ['accountant', 'head', 'hm', 'principal', 'vice_principal'].includes(user?.role);

  // Load all data
  const loadAllFinancialData = useCallback(async () => {
    if (!isAccountant) return;
    
    try {
      setLoading(true);
      setError('');
      
      // Load staff with pagination
      const staffRes = await getAllStaff({ 
        page: staffPage, 
        page_size: itemsPerPage,
        is_active: true 
      });
      
      const staffData = staffRes?.results || staffRes || [];
      setStaffList(staffData);
      setStaffTotalPages(staffRes?.total_pages || 1);
      setStaffTotalCount(staffRes?.count || 0);
      
      // Load salary payments for the selected month
      const salaryRes = await getSalaryPayments({ month: selectedMonth });
      const savedMap = {};
      (salaryRes?.results || salaryRes || []).forEach(p => {
        savedMap[p.staff] = p;
      });
      setSavedPayments(savedMap);
      
      // Create payroll data with saved values
      const payrollData = staffData.map(staff => {
        const saved = savedMap[staff.id];
        return {
          id: staff.id,
          staff_id: staff.staff_id,
          name: `${staff.user?.first_name || ''} ${staff.user?.last_name || ''}`.trim(),
          position: staff.position_title,
          department: staff.department,
          bank_name: staff.bank_name,
          account_name: staff.account_name,
          account_number: staff.account_number,
          basic_salary: parseFloat(staff.basic_salary) || 0,
          allowances: saved?.allowances || 0,
          deductions: saved?.deductions || 0,
          bonus: saved?.bonus || 0,
          penalty: saved?.penalty || 0,
          net_salary: saved?.net_salary || parseFloat(staff.basic_salary) || 0,
          payment_status: saved?.status || 'pending',
          payment_id: saved?.id,
          edit_history: saved?.edit_history || []
        };
      });
      setSalaryPayroll(payrollData);
      
      // Load payments with pagination
      const paymentsRes = await getPaymentHistory({ 
        page: paymentsPage, 
        limit: itemsPerPage 
      });
      const paymentsData = paymentsRes?.results || paymentsRes || [];
      setAllPayments(paymentsData);
      setPaymentsTotalPages(paymentsRes?.total_pages || 1);
      setRecentPayments(paymentsData.slice(0, 5));
      
      // Load invoices with pagination
      const invoicesRes = await getAllInvoices({ 
        page: invoicesPage, 
        limit: itemsPerPage 
      });
      const invoicesData = invoicesRes?.results || invoicesRes || [];
      setInvoices(invoicesData);
      setInvoicesTotalPages(invoicesRes?.total_pages || 1);
      setInvoicesTotalCount(invoicesRes?.count || 0);
      
      // Load stats
      // Load payment statistics (available to accountants)
      try {
        const paymentStats = await getPaymentStatistics();
        if (paymentStats) {
          setFinancialStats(prev => ({
            ...prev,
            total_revenue: paymentStats.overall?.total_revenue || 0,
            total_outstanding: paymentStats.invoices?.total_outstanding || 0,
            collection_rate: paymentStats.invoices?.collection_rate || 0,
            successful_payments: paymentStats.overall?.successful_payments || 0,
            pending_payments: paymentStats.overall?.pending_payments || 0,
            monthly_trend: paymentStats.monthly_trend || []
          }));
        }
      } catch (err) {
        console.warn('Could not load payment statistics:', err);
      }
      
      // Load pending manual payments
      const pendingRes = await getPaymentHistory({ 
        status: 'pending', 
        payment_method: 'bank_transfer', 
        limit: 20 
      });
      setPendingManualPayments(pendingRes?.results || pendingRes || []);
      
    } catch (err) {
      console.error('Error loading financial data:', err);
      setError('Failed to load financial data');
    } finally {
      setLoading(false);
    }
  }, [isAccountant, staffPage, invoicesPage, paymentsPage, selectedMonth]);

  useEffect(() => {
    if (isAccountant) {
      loadAllFinancialData();
    }
  }, [loadAllFinancialData]);

  const calculateNetSalary = (basic, allowances, deductions, bonus, penalty) => {
    return (basic || 0) + (allowances || 0) + (bonus || 0) - (deductions || 0) - (penalty || 0);
  };

  const handleSalaryChange = (staffId, field, value) => {
    const updatedPayroll = salaryPayroll.map(staff => {
      if (staff.id === staffId) {
        const updated = { ...staff, [field]: parseFloat(value) || 0 };
        updated.net_salary = calculateNetSalary(
          updated.basic_salary,
          updated.allowances,
          updated.deductions,
          updated.bonus,
          updated.penalty
        );
        return updated;
      }
      return staff;
    });
    setSalaryPayroll(updatedPayroll);
  };

  const processSalaryPayment = async (staffId) => {
    try {
      setSaving(true);
      const staff = salaryPayroll.find(s => s.id === staffId);
      if (!staff) {
        setError('Staff not found');
        return;
      }
      
      // Format payment_month as YYYY-MM-DD (first day of the month)
      const paymentMonthFormatted = `${selectedMonth}-01`;
      
      const data = {
        staff: staffId,  // Use 'staff' not 'staff_id'
        payment_month: paymentMonthFormatted,  // Format: YYYY-MM-DD
        basic_salary: staff.basic_salary,
        allowances: staff.allowances,
        deductions: staff.deductions,
        bonus: staff.bonus,
        penalty: staff.penalty,
        net_salary: staff.net_salary,
        status: 'paid',
        payment_date: new Date().toISOString(),
        payment_method: 'bank_transfer'
      };
      
      console.log('Sending salary payment data:', data);
      
      let result;
      if (staff.payment_id) {
        result = await updateSalaryPayment(staff.payment_id, data);
      } else {
        result = await createSalaryPayment(data);
      }
      
      setSuccess(`Salary payment processed for ${staff.name}`);
      loadAllFinancialData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error processing salary:', err);
      setError(err.message || `Failed to process payment for ${staff?.name || 'staff'}`);
    } finally {
      setSaving(false);
    }
  };

  const processBulkSalaryPayment = async () => {
    const pendingStaff = salaryPayroll.filter(s => s.payment_status === 'pending' && s.net_salary > 0);
    if (pendingStaff.length === 0) {
      setError('No pending salary payments to process');
      return;
    }
    
    try {
      setSaving(true);
      setError('');
      
      const paymentMonthFormatted = `${selectedMonth}-01`;
      let successCount = 0;
      
      for (const staff of pendingStaff) {
        try {
          const data = {
            staff: staff.id,  // Use 'staff' not 'staff_id'
            payment_month: paymentMonthFormatted,
            basic_salary: staff.basic_salary,
            allowances: staff.allowances,
            deductions: staff.deductions,
            bonus: staff.bonus,
            penalty: staff.penalty,
            net_salary: staff.net_salary,
            status: 'paid',
            payment_date: new Date().toISOString(),
            payment_method: 'bank_transfer'
          };
          
          if (staff.payment_id) {
            await updateSalaryPayment(staff.payment_id, data);
          } else {
            await createSalaryPayment(data);
          }
          successCount++;
        } catch (err) {
          console.error(`Failed to process ${staff.name}:`, err);
        }
      }
      
      setSuccess(`Processed ${successCount} out of ${pendingStaff.length} salary payments`);
      loadAllFinancialData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error processing salaries:', err);
      setError('Failed to process bulk salaries');
    } finally {
      setSaving(false);
    }
  };

  const openEditModal = (staff) => {
    setEditingStaffId(staff.id);
    setEditFormData({
      allowances: staff.allowances,
      deductions: staff.deductions,
      bonus: staff.bonus,
      penalty: staff.penalty,
      net_salary: staff.net_salary
    });
    setEditReason('');
    setShowEditHistoryModal(true);
  };

  const saveSalaryEdit = async () => {
    if (!editingStaffId) return;
    if (!editReason.trim()) {
      setError('Please provide a reason for editing');
      return;
    }
    
    try {
      setSaving(true);
      const staff = salaryPayroll.find(s => s.id === editingStaffId);
      if (!staff) {
        setError('Staff not found');
        return;
      }
      
      const paymentMonthFormatted = `${selectedMonth}-01`;
      
      const data = {
        staff: editingStaffId,
        payment_month: paymentMonthFormatted,
        basic_salary: staff.basic_salary,
        allowances: editFormData.allowances,
        deductions: editFormData.deductions,
        bonus: editFormData.bonus,
        penalty: editFormData.penalty,
        net_salary: editFormData.net_salary,
        edit_reason: editReason,
        edited_by: user?.id
      };
      
      if (staff.payment_id) {
        await updateSalaryPayment(staff.payment_id, data);
      } else {
        await createSalaryPayment(data);
      }
      
      setSuccess('Salary payment updated successfully');
      loadAllFinancialData();
      setShowEditHistoryModal(false);
      setEditingStaffId(null);
      setEditFormData(null);
      setEditReason('');
    } catch (err) {
      console.error('Error saving salary:', err);
      setError(err.message || 'Failed to save salary payment');
    } finally {
      setSaving(false);
    }
  };

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '₦0';
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatDateTime = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString('en-GB', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const config = {
      success: { bg: 'bg-green-100 text-green-800', icon: <CheckCircle size={12} />, label: 'Successful' },
      paid: { bg: 'bg-green-100 text-green-800', icon: <CheckCircle size={12} />, label: 'Paid' },
      pending: { bg: 'bg-yellow-100 text-yellow-800', icon: <Clock size={12} />, label: 'Pending' },
      failed: { bg: 'bg-red-100 text-red-800', icon: <XCircle size={12} />, label: 'Failed' },
      partially_paid: { bg: 'bg-blue-100 text-blue-800', icon: <Clock size={12} />, label: 'Partial' }
    };
    const cfg = config[status] || config.pending;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${cfg.bg}`}>
        {cfg.icon} {cfg.label}
      </span>
    );
  };

  // Filter active staff only
  const activeStaff = salaryPayroll.filter(s => s.payment_status !== 'inactive');
  const filteredStaff = activeStaff.filter(staff =>
    staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.staff_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const revenueChartData = {
    labels: financialStats.monthly_trend?.map(m => m.month) || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Revenue (₦)',
      data: financialStats.monthly_trend?.map(m => m.revenue) || [0, 0, 0, 0, 0, 0],
      backgroundColor: 'rgba(54, 162, 235, 0.5)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 2,
      fill: true,
      tension: 0.4
    }]
  };

  // Payment distribution chart data
  const paymentDistributionData = {
    labels: ['Successful', 'Pending', 'Failed'],
    datasets: [{
      data: [
        financialStats.successful_payments || 0,
        financialStats.pending_payments || 0,
        0
      ],
      backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
      borderWidth: 0,
    }]
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      tooltip: { callbacks: { label: (ctx) => `₦${ctx.raw.toLocaleString()}` } }
    },
    scales: { y: { ticks: { callback: (value) => `₦${value.toLocaleString()}` } } }
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' } }
  };

  // Pagination Component
  const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;
    
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);
    
    for (let i = start; i <= end; i++) pages.push(i);
    
    return (
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
        <div className="text-sm text-gray-500">Page {currentPage} of {totalPages}</div>
        <div className="flex gap-1">
          <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="p-2 rounded-lg border disabled:opacity-50 hover:bg-gray-50">
            <ChevronLeft size={16} />
          </button>
          {pages.map(p => (
            <button key={p} onClick={() => onPageChange(p)} className={`px-3 py-1 rounded-lg ${currentPage === p ? 'bg-gray-900 text-white' : 'hover:bg-gray-100'}`}>
              {p}
            </button>
          ))}
          <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 rounded-lg border disabled:opacity-50 hover:bg-gray-50">
            <ChevronRightIcon size={16} />
          </button>
        </div>
      </div>
    );
  };

  if (!isAccountant) {
    return (
      <DashboardLayout title="Access Denied">
        <div className="flex items-center justify-center min-h-[60vh] px-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={28} className="text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">You don't have permission to access the Accountant Dashboard.</p>
            <button onClick={() => navigate('/dashboard')} className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm">Go to Dashboard</button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (loading) {
    return (
      <DashboardLayout title="Accountant Dashboard">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <Loader2 size={40} className="animate-spin mx-auto text-gray-400 mb-3" />
            <p className="text-gray-500 text-sm">Loading financial data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Accountant Dashboard">
      <div className="py-6 px-4 sm:px-0">
        
        {error && <Alert type="error" message={error} onClose={() => setError('')} className="mb-4" />}
        {success && <Alert type="success" message={success} onClose={() => setSuccess('')} className="mb-4" />}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Accountant Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Financial Management • Payroll • Payments • Invoices</p>
          </div>
          <div className="flex gap-2">
            <button onClick={loadAllFinancialData} className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
            </button>
            <button className="flex items-center gap-2 px-3 py-2 bg-gray-900 text-white rounded-lg text-sm">
              <FileText size={14} /> Audit Report
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <div className="flex flex-wrap gap-2 sm:gap-4">
            <button onClick={() => setActiveTab('overview')} className={`px-3 py-2 text-sm font-medium transition-colors ${activeTab === 'overview' ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
              <BarChart3 size={14} className="inline mr-1" /> Overview
            </button>
            <button onClick={() => setActiveTab('payroll')} className={`px-3 py-2 text-sm font-medium transition-colors ${activeTab === 'payroll' ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
              <Users size={14} className="inline mr-1" /> Payroll ({staffTotalCount})
            </button>
            <button onClick={() => setActiveTab('payments')} className={`px-3 py-2 text-sm font-medium transition-colors ${activeTab === 'payments' ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
              <CreditCard size={14} className="inline mr-1" /> Payments
            </button>
            <button onClick={() => setActiveTab('invoices')} className={`px-3 py-2 text-sm font-medium transition-colors ${activeTab === 'invoices' ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
              <Receipt size={14} className="inline mr-1" /> Invoices ({invoicesTotalCount})
            </button>
            <button onClick={() => setActiveTab('pending')} className={`px-3 py-2 text-sm font-medium transition-colors ${activeTab === 'pending' ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
              <AlertCircle size={14} className="inline mr-1" /> Pending Verification ({pendingManualPayments.length})
            </button>
          </div>
        </div>

        {/* ==================== OVERVIEW TAB ==================== */}
        {activeTab === 'overview' && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
              <div className="bg-white rounded-xl border border-gray-100 p-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold text-gray-900">{formatCurrency(financialStats.total_revenue)}</p>
                    <p className="text-xs text-gray-500">Total Revenue</p>
                  </div>
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <TrendingUp size={16} className="text-green-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 p-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold text-gray-900">{formatCurrency(financialStats.total_outstanding)}</p>
                    <p className="text-xs text-gray-500">Outstanding</p>
                  </div>
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                    <TrendingDown size={16} className="text-red-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 p-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold text-gray-900">{financialStats.collection_rate}%</p>
                    <p className="text-xs text-gray-500">Collection Rate</p>
                  </div>
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <PieChart size={16} className="text-blue-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 p-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold text-gray-900">{formatCurrency(financialStats.total_salary_budget)}</p>
                    <p className="text-xs text-gray-500">Salary Budget</p>
                  </div>
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Wallet size={16} className="text-purple-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 p-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold text-gray-900">{staffTotalCount}</p>
                    <p className="text-xs text-gray-500">Total Staff</p>
                  </div>
                  <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                    <Users size={16} className="text-teal-600" />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Revenue Trend</h3>
                <div className="h-64">
                  <Line data={revenueChartData} options={lineOptions} />
                </div>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Payment Distribution</h3>
                <div className="h-64 flex justify-center">
                  <Pie data={paymentDistributionData} options={pieOptions} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                <h2 className="font-semibold text-gray-900 flex items-center">
                  <CreditCard size={16} className="text-blue-600 mr-2" />
                  Recent Payments
                </h2>
                <button onClick={() => setActiveTab('payments')} className="text-sm text-gray-500 hover:text-gray-700">View All</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Reference</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Student</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Amount</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Method</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {recentPayments.map(payment => (
                      <tr key={payment.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-xs font-mono">{payment.reference?.slice(-8)}</td>
                        <td className="px-4 py-3 text-sm">{payment.student_name}</td>
                        <td className="px-4 py-3 font-semibold">{formatCurrency(payment.amount)}</td>
                        <td className="px-4 py-3 text-xs capitalize">{payment.payment_method?.replace('_', ' ')}</td>
                        <td className="px-4 py-3">{getStatusBadge(payment.status)}</td>
                        <td className="px-4 py-3 text-xs">{formatDate(payment.created_at)}</td>
                      </tr>
                    ))}
                    {recentPayments.length === 0 && (
                      <tr>
                        <td colSpan="6" className="text-center py-6 text-gray-400">No payments found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ==================== PAYROLL TAB ==================== */}
        {activeTab === 'payroll' && (
          <>
            <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium text-gray-700">Payroll Month:</label>
                  <input type="month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm" />
                </div>
                <div className="flex gap-3">
                  <button onClick={processBulkSalaryPayment} disabled={saving} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm flex items-center gap-2">
                    {saving ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />} Process All Salaries
                  </button>
                  <button className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm flex items-center gap-2">
                    <Download size={14} /> Generate Report
                  </button>
                </div>
              </div>
              <div className="mt-4">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input type="text" placeholder="Search staff by name or ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-sm" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <div className="bg-white rounded-xl border border-gray-100 p-3 shadow-sm">
                <p className="text-xs text-gray-500">Total Staff (Active)</p>
                <p className="text-xl font-bold text-gray-900">{activeStaff.length}</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 p-3 shadow-sm">
                <p className="text-xs text-gray-500">Total Salary Budget</p>
                <p className="text-xl font-bold text-gray-900">{formatCurrency(activeStaff.reduce((sum, s) => sum + s.net_salary, 0))}</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 p-3 shadow-sm">
                <p className="text-xs text-gray-500">Paid This Month</p>
                <p className="text-xl font-bold text-green-600">{formatCurrency(activeStaff.filter(s => s.payment_status === 'paid').reduce((sum, s) => sum + s.net_salary, 0))}</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 p-3 shadow-sm">
                <p className="text-xs text-gray-500">Pending</p>
                <p className="text-xl font-bold text-yellow-600">{formatCurrency(activeStaff.filter(s => s.payment_status === 'pending').reduce((sum, s) => sum + s.net_salary, 0))}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500">Staff</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500">Position</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500">Bank Details</th>
                      <th className="px-3 py-3 text-right text-xs font-medium text-gray-500">Basic Salary</th>
                      <th className="px-3 py-3 text-right text-xs font-medium text-gray-500">Allowances</th>
                      <th className="px-3 py-3 text-right text-xs font-medium text-gray-500">Bonus</th>
                      <th className="px-3 py-3 text-right text-xs font-medium text-gray-500">Deductions</th>
                      <th className="px-3 py-3 text-right text-xs font-medium text-gray-500">Penalty</th>
                      <th className="px-3 py-3 text-right text-xs font-medium text-gray-500">Net Salary</th>
                      <th className="px-3 py-3 text-center text-xs font-medium text-gray-500">Status</th>
                      <th className="px-3 py-3 text-center text-xs font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredStaff.map(staff => (
                      <tr key={staff.id} className="hover:bg-gray-50">
                        <td className="px-3 py-3">
                          <div>
                            <p className="font-medium text-sm text-gray-800">{staff.name}</p>
                            <p className="text-xs text-gray-500">{staff.staff_id}</p>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-sm text-gray-600">{staff.position || staff.department}</td>
                        <td className="px-3 py-3">
                          <p className="text-xs text-gray-600">{staff.bank_name || 'N/A'}</p>
                          <p className="text-xs text-gray-500">{staff.account_number || 'N/A'}</p>
                        </td>
                        <td className="px-3 py-3 text-right font-medium">{formatCurrency(staff.basic_salary)}</td>
                        <td className="px-3 py-3 text-right">
                          <input type="number" value={staff.allowances} onChange={(e) => handleSalaryChange(staff.id, 'allowances', e.target.value)} className="w-24 px-2 py-1 border border-gray-200 rounded text-right text-sm" />
                        </td>
                        <td className="px-3 py-3 text-right">
                          <input type="number" value={staff.bonus} onChange={(e) => handleSalaryChange(staff.id, 'bonus', e.target.value)} className="w-24 px-2 py-1 border border-gray-200 rounded text-right text-sm" />
                        </td>
                        <td className="px-3 py-3 text-right">
                          <input type="number" value={staff.deductions} onChange={(e) => handleSalaryChange(staff.id, 'deductions', e.target.value)} className="w-24 px-2 py-1 border border-gray-200 rounded text-right text-sm" />
                        </td>
                        <td className="px-3 py-3 text-right">
                          <input type="number" value={staff.penalty} onChange={(e) => handleSalaryChange(staff.id, 'penalty', e.target.value)} className="w-24 px-2 py-1 border border-gray-200 rounded text-right text-sm" />
                        </td>
                        <td className="px-3 py-3 text-right font-bold text-blue-600">{formatCurrency(staff.net_salary)}</td>
                        <td className="px-3 py-3 text-center">{getStatusBadge(staff.payment_status)}</td>
                        <td className="px-3 py-3 text-center">
                          <div className="flex gap-1 justify-center">
                            {staff.payment_status !== 'paid' && (
                              <button onClick={() => processSalaryPayment(staff.id)} className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs hover:bg-green-200">
                                Pay Now
                              </button>
                            )}
                            <button onClick={() => openEditModal(staff)} className="p-1 text-blue-600 hover:bg-blue-50 rounded" title="Edit">
                              <Edit2 size={14} />
                            </button>
                            {staff.edit_history?.length > 0 && (
                              <button className="p-1 text-gray-500 hover:bg-gray-100 rounded" title="View History">
                                <History size={14} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredStaff.length === 0 && (
                      <tr>
                        <td colSpan="11" className="text-center py-8 text-gray-400">No staff found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <Pagination currentPage={staffPage} totalPages={staffTotalPages} onPageChange={setStaffPage} />
            </div>
          </>
        )}

        {/* ==================== PAYMENTS TAB ==================== */}
        {activeTab === 'payments' && (
          <>
            <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="flex gap-3">
                  <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
                    <option value="all">All Status</option>
                    <option value="success">Successful</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                  </select>
                  <button onClick={() => navigate('/payments/admin')} className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm flex items-center gap-2">
                    <Plus size={14} /> Manage Fees
                  </button>
                </div>
                <button onClick={loadAllFinancialData} className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm">
                  <RefreshCw size={14} /> Refresh
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Reference</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Student</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Class</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Amount</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Method</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Date</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500">Receipt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {allPayments.filter(p => filterStatus === 'all' || p.status === filterStatus).map(payment => (
                      <tr key={payment.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-xs font-mono">{payment.reference?.slice(-8)}</td>
                        <td className="px-4 py-3 text-sm">{payment.student_name}</td>
                        <td className="px-4 py-3 text-sm">{payment.class_level_name || 'N/A'}</td>
                        <td className="px-4 py-3 text-right font-semibold">{formatCurrency(payment.amount)}</td>
                        <td className="px-4 py-3 text-xs capitalize">{payment.payment_method?.replace('_', ' ')}</td>
                        <td className="px-4 py-3">{getStatusBadge(payment.status)}</td>
                        <td className="px-4 py-3 text-xs">{formatDateTime(payment.created_at)}</td>
                        <td className="px-4 py-3 text-center">
                          {payment.status === 'success' && (
                            <button className="p-1 text-gray-500 hover:text-gray-700">
                              <Printer size={14} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                    {allPayments.length === 0 && (
                      <tr>
                        <td colSpan="8" className="text-center py-8 text-gray-400">No payments found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <Pagination currentPage={paymentsPage} totalPages={paymentsTotalPages} onPageChange={setPaymentsPage} />
            </div>
          </>
        )}

        {/* ==================== INVOICES TAB ==================== */}
        {activeTab === 'invoices' && (
          <>
            <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6 shadow-sm">
              <div className="flex justify-end">
                <button onClick={() => navigate('/payments/admin')} className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm flex items-center gap-2">
                  <Plus size={14} /> Create Invoice / Fee Structure
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Invoice #</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Student</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Session/Term</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Total</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Paid</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Balance</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Due Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {invoices.map(invoice => (
                      <tr key={invoice.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-xs font-mono">{invoice.invoice_number}</td>
                        <td className="px-4 py-3 text-sm">{invoice.student_name}</td>
                        <td className="px-4 py-3 text-sm">{invoice.session_name} / {invoice.term_name}</td>
                        <td className="px-4 py-3 text-right">{formatCurrency(invoice.total_amount)}</td>
                        <td className="px-4 py-3 text-right text-green-600">{formatCurrency(invoice.amount_paid)}</td>
                        <td className="px-4 py-3 text-right text-red-600">{formatCurrency(invoice.balance_due)}</td>
                        <td className="px-4 py-3 text-xs">{formatDate(invoice.due_date)}</td>
                        <td className="px-4 py-3">{getStatusBadge(invoice.status)}</td>
                      </tr>
                    ))}
                    {invoices.length === 0 && (
                      <tr>
                        <td colSpan="8" className="text-center py-8 text-gray-400">No invoices found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <Pagination currentPage={invoicesPage} totalPages={invoicesTotalPages} onPageChange={setInvoicesPage} />
            </div>
          </>
        )}

        {/* ==================== PENDING VERIFICATION TAB ==================== */}
        {activeTab === 'pending' && (
          <>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2">
                <AlertCircle size={20} className="text-yellow-600" />
                <p className="text-sm text-yellow-800">{pendingManualPayments.length} bank transfer payments awaiting verification</p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Student</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Amount</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Bank Details</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Transaction Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Submitted</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500">Evidence</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {pendingManualPayments.map(payment => (
                      <tr key={payment.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <p className="font-medium text-sm">{payment.student_name}</p>
                          <p className="text-xs text-gray-500">{payment.student_admission}</p>
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-green-600">{formatCurrency(payment.amount)}</td>
                        <td className="px-4 py-3">
                          <p className="text-xs">{payment.bank_name}</p>
                          <p className="text-xs text-gray-500">Acct: {payment.account_number}</p>
                        </td>
                        <td className="px-4 py-3 text-xs">{formatDate(payment.transaction_date)}</td>
                        <td className="px-4 py-3 text-xs">{formatDateTime(payment.created_at)}</td>
                        <td className="px-4 py-3 text-center">
                          {payment.payment_evidence && (
                            <a href={payment.payment_evidence} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                              <Eye size={14} />
                            </a>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button onClick={() => navigate(`/payments/verification?payment_id=${payment.id}`)} className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs hover:bg-green-200">
                            Verify
                          </button>
                        </td>
                      </tr>
                    ))}
                    {pendingManualPayments.length === 0 && (
                      <tr>
                        <td colSpan="7" className="text-center py-8 text-gray-400">No pending verifications</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Edit History Modal */}
      <Modal isOpen={showEditHistoryModal} onClose={() => setShowEditHistoryModal(false)} title="Edit Salary Payment" size="md">
        <div className="py-4 space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-xs text-yellow-800">
              <strong>Note:</strong> Please provide a reason for editing. All changes will be tracked.
            </p>
          </div>
          
          {editFormData && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Allowances</label>
                  <input type="number" value={editFormData.allowances} onChange={(e) => setEditFormData({...editFormData, allowances: parseFloat(e.target.value) || 0})} className="w-full px-3 py-2 border rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Deductions</label>
                  <input type="number" value={editFormData.deductions} onChange={(e) => setEditFormData({...editFormData, deductions: parseFloat(e.target.value) || 0})} className="w-full px-3 py-2 border rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Bonus</label>
                  <input type="number" value={editFormData.bonus} onChange={(e) => setEditFormData({...editFormData, bonus: parseFloat(e.target.value) || 0})} className="w-full px-3 py-2 border rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Penalty</label>
                  <input type="number" value={editFormData.penalty} onChange={(e) => setEditFormData({...editFormData, penalty: parseFloat(e.target.value) || 0})} className="w-full px-3 py-2 border rounded-lg text-sm" />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Reason for Edit *</label>
                <textarea value={editReason} onChange={(e) => setEditReason(e.target.value)} rows={2} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="e.g., Correction for January payroll, Added missing allowance, etc." />
              </div>
              
              <div className="flex gap-3 pt-2">
                <Button onClick={() => setShowEditHistoryModal(false)} variant="outline" className="flex-1">Cancel</Button>
                <Button onClick={saveSalaryEdit} loading={saving} className="flex-1 bg-gray-900 hover:bg-gray-700">Save Changes</Button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default AccountantDashboard;