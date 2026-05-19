// src/pages/staff/StaffList.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import Alert from '../../components/common/Alert';
import { Text, Button, Card } from '../../components/ui';
import { StaffCard } from './components/StaffCard';
import { StaffTable } from './components/StaffTable';
import { StaffFilters } from './components/StaffFilters';
import { ViewStaffModal, ArchiveStaffModal, RestoreStaffModal, PasswordResetModal } from './components/StaffModals';
import { StaffBulkUpload } from './components/StaffBulkUpload';
import { printStaffRecord, printAllStaff } from './components/StaffPrintUtils';
import { 
  Plus, RefreshCw, Download, Upload, Printer, Grid3x3, Table2, 
  UserPlus, AlertCircle, Shield, Download as DownloadIcon
} from 'lucide-react';
import { 
  getAllStaff, 
  getStaffById, 
  updateStaffPassword, 
  archiveStaff, 
  restoreStaff,
  bulkUploadStaff,
  downloadAllStaffCSV,
  downloadStaffUploadTemplate
} from '../../services/staffService';
import useAuth from '../../hooks/useAuth';

const StaffList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const isAdmin = ['head', 'hm', 'principal', 'vice_principal', 'accountant', 'secretary'].includes(user?.role);
  
  // States
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [totalStaff, setTotalStaff] = useState(0);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 12;
  
  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    department: '',
    employment_type: '',
    is_active: ''
  });
  
  // View Mode
  const [viewMode, setViewMode] = useState('table');
  const [isMobile, setIsMobile] = useState(false);
  
  // Modal States
  const [showViewModal, setShowViewModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [staffDetails, setStaffDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  
  // Action Loading States
  const [archiveLoading, setArchiveLoading] = useState(false);
  const [restoreLoading, setRestoreLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [printing, setPrinting] = useState(false);
  const [bulkUploadLoading, setBulkUploadLoading] = useState(false);
  
  // Password Form
  const [passwordForm, setPasswordForm] = useState({ new_password: '', confirm_password: '' });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordLoading, setPasswordLoading] = useState(false);
  
  // Department options for filter
  const departmentOptions = [
    { value: 'administration', label: 'Administration' },
    { value: 'academic', label: 'Academic' },
    { value: 'finance', label: 'Finance' },
    { value: 'library', label: 'Library' },
    { value: 'laboratory', label: 'Laboratory' },
    { value: 'ict', label: 'ICT' },
    { value: 'security', label: 'Security' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'transport', label: 'Transport' },
    { value: 'health', label: 'Health' },
    { value: 'counseling', label: 'Counseling' },
    { value: 'sports', label: 'Sports' },
    { value: 'kitchen', label: 'Kitchen' },
  ];
  
  // Check mobile screen
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const displayViewMode = isMobile ? 'card' : viewMode;
  
  // Format helpers
  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '₦0';
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(amount);
  };
  
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };
  
  // Load staff data
  const loadStaff = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        ...filters
      };
      
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });
      
      if (searchTerm) {
        params.search = searchTerm;
      }
      
      const response = await getAllStaff(params);
      
      if (response && response.results) {
        setStaff(response.results);
        setTotalPages(response.total_pages || 1);
        setTotalStaff(response.count || 0);
      } else {
        setStaff([]);
        setTotalPages(1);
        setTotalStaff(0);
      }
    } catch (err) {
      console.error('Error loading staff:', err);
      setError('Failed to load staff. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [currentPage, filters, searchTerm]);
  
  useEffect(() => {
    if (isAdmin) {
      loadStaff();
    }
  }, [isAdmin, currentPage, loadStaff]);
  
  // Apply filters
  const applyFilters = () => {
    setCurrentPage(1);
    loadStaff();
  };
  
  const clearFilters = () => {
    setFilters({
      department: '',
      employment_type: '',
      is_active: ''
    });
    setSearchTerm('');
    setCurrentPage(1);
    setTimeout(loadStaff, 100);
  };
  
  const hasActiveFilters = searchTerm !== '' || Object.values(filters).some(v => v !== '');
  
  // View Staff
  const handleViewStaff = async (staffMember) => {
    try {
      setLoadingDetails(true);
      setSelectedStaff(staffMember);
      
      const response = await getStaffById(staffMember.id);
      const details = response.staff || response;
      
      setStaffDetails(details);
      setShowViewModal(true);
    } catch (err) {
      console.error('Error fetching staff details:', err);
      setStaffDetails(staffMember);
      setShowViewModal(true);
    } finally {
      setLoadingDetails(false);
    }
  };
  
  // Edit Staff
  const handleEditStaff = (staffMember) => {
    navigate(`/staff/${staffMember.id}/edit`);
  };
  
  // Archive Staff
  const handleArchiveStaff = (staffMember) => {
    setSelectedStaff(staffMember);
    setShowArchiveModal(true);
  };
  
  const confirmArchive = async () => {
    if (!selectedStaff) return;
    try {
      setArchiveLoading(true);
      await archiveStaff(selectedStaff.id);
      setSuccess(`Staff archived successfully.`);
      setShowArchiveModal(false);
      setSelectedStaff(null);
      loadStaff();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error archiving staff:', err);
      setError('Failed to archive staff. Please try again.');
    } finally {
      setArchiveLoading(false);
    }
  };
  
  // Restore Staff
  const handleRestoreStaff = (staffMember) => {
    setSelectedStaff(staffMember);
    setShowRestoreModal(true);
  };
  
  const confirmRestore = async () => {
    if (!selectedStaff) return;
    try {
      setRestoreLoading(true);
      await restoreStaff(selectedStaff.id);
      setSuccess(`Staff restored successfully.`);
      setShowRestoreModal(false);
      setSelectedStaff(null);
      loadStaff();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error restoring staff:', err);
      setError('Failed to restore staff. Please try again.');
    } finally {
      setRestoreLoading(false);
    }
  };
  
  // Password Reset
  const handlePasswordClick = (staffMember) => {
    setSelectedStaff(staffMember);
    setPasswordForm({ new_password: '', confirm_password: '' });
    setPasswordErrors({});
    setShowPasswordModal(true);
  };
  
  const submitPasswordReset = async (e) => {
    e.preventDefault();
    
    const errors = {};
    if (!passwordForm.new_password) errors.new_password = 'New password is required';
    if (!passwordForm.confirm_password) errors.confirm_password = 'Please confirm password';
    if (passwordForm.new_password !== passwordForm.confirm_password) errors.confirm_password = 'Passwords do not match';
    if (passwordForm.new_password && passwordForm.new_password.length < 5) errors.new_password = 'Password must be at least 5 characters';
    
    setPasswordErrors(errors);
    if (Object.keys(errors).length > 0) return;
    
    try {
      setPasswordLoading(true);
      await updateStaffPassword(selectedStaff.id, {
        new_password: passwordForm.new_password,
        confirm_password: passwordForm.confirm_password
      });
      setSuccess(`Password reset successfully!`);
      setShowPasswordModal(false);
      setSelectedStaff(null);
      setPasswordForm({ new_password: '', confirm_password: '' });
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error resetting password:', err);
      setError(err.message || 'Failed to reset password');
    } finally {
      setPasswordLoading(false);
    }
  };
  
  // CSV Export - Download ALL staff
  const handleExportCSV = async () => {
    try {
      setExporting(true);
      setError('');
      setSuccess('Fetching all staff for export...');
      
      await downloadAllStaffCSV();
      
      setSuccess(`Staff data exported successfully!`);
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      console.error('Export error:', err);
      setError('Failed to export staff. Please try again.');
    } finally {
      setExporting(false);
    }
  };
  
  // Print All Staff
  const handlePrintAll = async () => {
    if (printing) return;
    
    try {
      setPrinting(true);
      setError('');
      setSuccess('Preparing staff records for printing...');
      
      // Use current staff (already loaded)
      if (staff.length === 0) {
        setError('No staff found to print');
        setSuccess('');
        return;
      }
      
      setTimeout(() => {
        try {
          printAllStaff(staff);
          setSuccess(`Printing ${staff.length} staff records...`);
        } catch (printErr) {
          console.error('Print execution error:', printErr);
          setError('Failed to print. Please try again.');
        }
      }, 100);
      
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      console.error('Print error:', err);
      setError('Failed to load staff for printing. Please try again.');
    } finally {
      setPrinting(false);
    }
  };
  
  // Print Single from view modal
  const handlePrintSingle = () => {
    if (staffDetails || selectedStaff) {
      printStaffRecord(staffDetails || selectedStaff);
    }
  };
  
  // Bulk Upload
  const handleBulkUpload = async (file) => {
    try {
      setBulkUploadLoading(true);
      setError('');
      
      const result = await bulkUploadStaff(file);
      
      await loadStaff();
      
      const message = [];
      if (result.created > 0) message.push(`${result.created} created`);
      if (result.updated > 0) message.push(`${result.updated} updated`);
      
      setSuccess(`Bulk upload completed: ${message.join(', ')}`);
      
      return result;
    } catch (err) {
      console.error('Bulk upload error:', err);
      setError(err.message || 'Failed to upload staff. Please check your file and try again.');
      throw err;
    } finally {
      setBulkUploadLoading(false);
    }
  };
  
  // Pagination
  const renderPagination = () => {
    if (totalPages <= 1) return null;
    
    const getPageNumbers = () => {
      const pages = [];
      const maxVisible = 5;
      if (totalPages <= maxVisible) {
        for (let i = 1; i <= totalPages; i++) pages.push(i);
      } else if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
      return pages;
    };
    
    return (
      <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-100">
        <Button variant="ghost" size="tiny" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
          Previous
        </Button>
        <div className="flex gap-1">
          {getPageNumbers().map((page, idx) => (
            page === '...' ? (
              <span key={idx} className="px-2 py-1 text-xs text-gray-400">...</span>
            ) : (
              <button
                key={idx}
                onClick={() => setCurrentPage(page)}
                className={`min-w-[32px] h-8 rounded-lg text-xs font-medium transition-colors ${currentPage === page ? 'bg-[#D94801] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                {page}
              </button>
            )
          ))}
        </div>
        <Button variant="ghost" size="tiny" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
          Next
        </Button>
      </div>
    );
  };
  
  // Stats
  const stats = {
    total: totalStaff,
    active: staff.filter(s => s.is_active).length,
    onLeave: staff.filter(s => s.is_on_leave).length,
    retired: staff.filter(s => s.is_retired).length
  };
  
  // Access Denied
  if (!isAdmin) {
    return (
      <DashboardLayout title="Access Denied">
        <div className="flex items-center justify-center min-h-[60vh] px-4">
          <div className="text-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="text-red-500" size={28} />
            </div>
            <Text variant="h3" className="font-bold text-gray-800 mb-2">Access Denied</Text>
            <Text variant="body" className="text-gray-500">You don't have permission to view staff list.</Text>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout title="Staff Management">
      <div className="h-[calc(100vh-120px)] flex flex-col px-3 sm:px-4 lg:px-6">
        
        {/* STICKY HEADER SECTION */}
        <div className="sticky top-0 z-20 bg-gray-50 -mx-3 sm:-mx-4 lg:-mx-6 px-3 sm:px-4 lg:px-6 pt-4 pb-2">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#1D2B49] rounded-xl flex items-center justify-center shadow-sm">
                  <UserPlus size={14} className="text-white" />
                </div>
                <Text variant="h2" className="font-bold">Staff Management</Text>
              </div>
              <Text variant="caption" className="text-gray-400 pl-9">
                Manage school staff records • {totalStaff} total staff
              </Text>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="small" 
                icon={exporting ? RefreshCw : DownloadIcon} 
                onClick={handleExportCSV}
                loading={exporting}
                disabled={exporting}
              >
                {exporting ? 'Exporting...' : 'CSV'}
              </Button>
              <Button 
                variant="outline" 
                size="small" 
                icon={printing ? RefreshCw : Printer} 
                onClick={handlePrintAll}
                loading={printing}
                disabled={printing}
              >
                {printing ? 'Loading...' : 'Print All'}
              </Button>
              <Button 
                variant="outline" 
                size="small" 
                icon={Upload} 
                onClick={() => setShowBulkUploadModal(true)}
              >
                Bulk
              </Button>
              <Button 
                variant="primary" 
                size="small" 
                icon={Plus} 
                onClick={() => navigate('/staff/create')}
              >
                Add
              </Button>
              <Button 
                variant="outline" 
                size="small" 
                icon={RefreshCw} 
                onClick={loadStaff} 
                loading={loading}
              >
                Refresh
              </Button>
            </div>
          </div>
          
          {/* Alerts */}
          {error && <Alert type="error" message={error} onClose={() => setError('')} className="mb-3" />}
          {success && <Alert type="success" message={success} onClose={() => setSuccess('')} className="mb-3" />}
          
          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-2 sm:gap-3 mb-3">
            <Card className="p-3">
              <Text variant="h4" className="font-bold text-gray-800">{stats.total}</Text>
              <Text variant="tiny" className="text-gray-400">Total</Text>
            </Card>
            <Card className="p-3">
              <Text variant="h4" className="font-bold text-green-600">{stats.active}</Text>
              <Text variant="tiny" className="text-gray-400">Active</Text>
            </Card>
            <Card className="p-3">
              <Text variant="h4" className="font-bold text-yellow-600">{stats.onLeave}</Text>
              <Text variant="tiny" className="text-gray-400">On Leave</Text>
            </Card>
            <Card className="p-3">
              <Text variant="h4" className="font-bold text-purple-600">{stats.retired}</Text>
              <Text variant="tiny" className="text-gray-400">Retired</Text>
            </Card>
          </div>
          
          {/* Filters */}
          <StaffFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filters={filters}
            setFilters={setFilters}
            departments={departmentOptions}
            onApply={applyFilters}
            onClear={clearFilters}
            hasActiveFilters={hasActiveFilters}
          />
          
          {/* View Toggle (Desktop) */}
          <div className="hidden sm:flex justify-end gap-2 mt-2">
            <div className="flex border border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 transition-colors ${viewMode === 'table' ? 'bg-[#D94801] text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
              >
                <Table2 size={16} />
              </button>
              <button
                onClick={() => setViewMode('card')}
                className={`p-2 transition-colors ${viewMode === 'card' ? 'bg-[#D94801] text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
              >
                <Grid3x3 size={16} />
              </button>
            </div>
          </div>
        </div>
        
        {/* SCROLLABLE CONTENT SECTION */}
        <div className="flex-1 overflow-y-auto min-h-0 -mx-3 sm:-mx-4 lg:-mx-6 px-3 sm:px-4 lg:px-6 pb-4">
          <Card className="overflow-hidden">
            {loading ? (
              <div className="flex justify-center py-12">
                <RefreshCw className="animate-spin h-8 w-8 text-[#D94801]" />
              </div>
            ) : staff.length === 0 ? (
              <div className="text-center py-12">
                <UserPlus size={40} className="mx-auto text-gray-200 mb-3" />
                <Text variant="body" className="text-gray-400">No staff found</Text>
                {hasActiveFilters ? (
                  <Button variant="outline" size="small" className="mt-3" onClick={clearFilters}>Clear Filters</Button>
                ) : (
                  <Button variant="primary" size="small" className="mt-3" onClick={() => navigate('/staff/create')}>
                    Add your first staff member
                  </Button>
                )}
              </div>
            ) : (
              <>
                {/* Desktop Table View */}
                {displayViewMode === 'table' && !isMobile && (
                  <StaffTable
                    staff={staff}
                    onView={handleViewStaff}
                    onEdit={handleEditStaff}
                    onArchive={handleArchiveStaff}
                    onRestore={handleRestoreStaff}
                    onResetPassword={handlePasswordClick}
                    isAdmin={isAdmin}
                  />
                )}
                
                {/* Card View */}
                {(displayViewMode === 'card' || isMobile) && (
                  <div className="p-3">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                      {staff.map((staffMember) => (
                        <StaffCard
                          key={staffMember.id}
                          staff={staffMember}
                          onView={handleViewStaff}
                          onEdit={handleEditStaff}
                          onArchive={handleArchiveStaff}
                          onRestore={handleRestoreStaff}
                          onResetPassword={handlePasswordClick}
                          isAdmin={isAdmin}
                        />
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Pagination */}
                {totalPages > 1 && renderPagination()}
                
                {/* Showing info */}
                <div className="px-4 py-2 border-t border-gray-100 text-center">
                  <Text variant="caption" className="text-gray-400">
                    Showing {staff.length} of {totalStaff} staff
                  </Text>
                </div>
              </>
            )}
          </Card>
        </div>
      </div>
      
      {/* View Modal */}
      <ViewStaffModal
        isOpen={showViewModal}
        onClose={() => { setShowViewModal(false); setStaffDetails(null); setSelectedStaff(null); }}
        staff={selectedStaff}
        staffDetails={staffDetails}
        loading={loadingDetails}
        onEdit={handleEditStaff}
        onResetPassword={handlePasswordClick}
        onArchive={handleArchiveStaff}
        onRestore={handleRestoreStaff}
        onPrint={handlePrintSingle}
        formatCurrency={formatCurrency}
        formatDate={formatDate}
      />
      
      {/* Archive Modal */}
      <ArchiveStaffModal
        isOpen={showArchiveModal}
        onClose={() => { setShowArchiveModal(false); setSelectedStaff(null); }}
        staff={selectedStaff}
        onConfirm={confirmArchive}
        loading={archiveLoading}
      />
      
      {/* Restore Modal */}
      <RestoreStaffModal
        isOpen={showRestoreModal}
        onClose={() => { setShowRestoreModal(false); setSelectedStaff(null); }}
        staff={selectedStaff}
        onConfirm={confirmRestore}
        loading={restoreLoading}
      />
      
      {/* Password Reset Modal */}
      <PasswordResetModal
        isOpen={showPasswordModal}
        onClose={() => { setShowPasswordModal(false); setSelectedStaff(null); setPasswordForm({ new_password: '', confirm_password: '' }); }}
        staff={selectedStaff}
        formData={passwordForm}
        setFormData={setPasswordForm}
        errors={passwordErrors}
        onSubmit={submitPasswordReset}
        loading={passwordLoading}
      />
      
      {/* Bulk Upload Modal */}
      <StaffBulkUpload
        isOpen={showBulkUploadModal}
        onClose={() => { setShowBulkUploadModal(false); }}
        onUpload={handleBulkUpload}
        loading={bulkUploadLoading}
      />
    </DashboardLayout>
  );
};

export default StaffList;