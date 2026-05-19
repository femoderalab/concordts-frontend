// src/pages/parents/Parents.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import Alert from '../../components/common/Alert';
import { Text, Button, Card } from '../../components/ui';
import { ParentCard } from './components/ParentCard';
import { ParentTable } from './components/ParentTable';
import { ParentFilters } from './components/ParentFilters';
import { ParentStatsCards } from './components/ParentStatsCards';
import { ArchiveParentModal, RestoreParentModal, PasswordResetModal } from './components/ParentModals';
import { ParentBulkUpload } from './components/ParentBulkUpload';
import { exportParentsToCSV, downloadParentBulkUploadTemplate } from './components/ParentCSVUtils';
import { printParentRecord, printAllParents } from './components/ParentPrintUtils';
import { 
  Plus, RefreshCw, Download, Upload, Printer, Grid3x3, Table2, 
  UserPlus, AlertCircle, Shield, Users, ChevronLeft, ChevronRight
} from 'lucide-react';
import { 
  getAllParents, 
  archiveParent, 
  restoreParent,
  getAllParentsForExport,
  downloadAllParentsCSV,
  getAllParentsForPrint,
  bulkUploadParents,
  getParentStatistics,
  validateBulkUploadFile
} from '../../services/parentService';
import useAuth from '../../hooks/useAuth';

const Parents = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const isAdmin = ['head', 'hm', 'principal', 'vice_principal', 'accountant', 'secretary'].includes(user?.role);
  
  // States
  const [parents, setParents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [totalParents, setTotalParents] = useState(0);
  const [stats, setStats] = useState({ total: 0, active: 0, ptaMembers: 0, totalChildren: 0 });
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 12;
  
  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    parent_type: '',
    is_active: '',
    is_pta_member: ''
  });
  
  // View Mode
  const [viewMode, setViewMode] = useState('table');
  const [isMobile, setIsMobile] = useState(false);
  
  // Modal States
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [selectedParent, setSelectedParent] = useState(null);
  
  // Password Form
  const [passwordForm, setPasswordForm] = useState({ new_password: '', confirm_password: '' });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordLoading, setPasswordLoading] = useState(false);
  
  // Action Loading
  const [archiveLoading, setArchiveLoading] = useState(false);
  const [restoreLoading, setRestoreLoading] = useState(false);
  const [bulkUploadLoading, setBulkUploadLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [printing, setPrinting] = useState(false);
  
  // Check mobile screen
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const displayViewMode = isMobile ? 'card' : viewMode;
  
  // Load statistics
  const loadStatistics = useCallback(async () => {
    try {
      const statsResponse = await getParentStatistics();
      setStats({
        total: statsResponse?.overall?.total_parents || 0,
        active: statsResponse?.overall?.active_parents || 0,
        ptaMembers: statsResponse?.overall?.pta_members || 0,
        totalChildren: statsResponse?.children?.total_children || 0
      });
    } catch (err) {
      console.error('Error loading statistics:', err);
    }
  }, []);
  
  // Load parents
  const loadParents = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      const params = {
        page: currentPage,
        page_size: itemsPerPage,
      };
      
      if (searchTerm) params.search = searchTerm;
      if (filters.parent_type) params.parent_type = filters.parent_type;
      if (filters.is_active) params.is_active = filters.is_active;
      if (filters.is_pta_member) params.is_pta_member = filters.is_pta_member;
      
      const response = await getAllParents(params);
      
      if (response && response.results) {
        setParents(response.results);
        const totalParentsCount = response.count || 0;
        const calculatedTotalPages = Math.ceil(totalParentsCount / itemsPerPage);
        
        setTotalParents(totalParentsCount);
        setTotalPages(calculatedTotalPages > 0 ? calculatedTotalPages : 1);
        
        // Reset to page 1 if current page exceeds total pages
        if (currentPage > calculatedTotalPages && calculatedTotalPages > 0) {
          setCurrentPage(1);
        }
      } else {
        setParents([]);
        setTotalPages(1);
        setTotalParents(0);
      }
    } catch (err) {
      console.error('Error loading parents:', err);
      setError('Failed to load parents. Please try again.');
      setParents([]);
      setTotalPages(1);
      setTotalParents(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, filters, searchTerm]);
  
  // Initial load
  useEffect(() => {
    if (isAdmin) {
      loadParents();
      loadStatistics();
    }
  }, [isAdmin, currentPage, loadParents, loadStatistics]);
  
  // Apply filters
  const applyFilters = () => {
    setCurrentPage(1);
    loadParents();
  };
  
  const clearFilters = () => {
    setFilters({
      parent_type: '',
      is_active: '',
      is_pta_member: ''
    });
    setSearchTerm('');
    setCurrentPage(1);
    setTimeout(loadParents, 100);
  };
  
  const hasActiveFilters = searchTerm !== '' || Object.values(filters).some(v => v !== '');
  
  // View Parent
  const handleViewParent = (parent) => {
    navigate(`/parents/${parent.id}`);
  };
  
  // Edit Parent
  const handleEditParent = (parent) => {
    navigate(`/parents/${parent.id}/edit`);
  };
  
  // Archive Parent
  const handleArchiveParent = (parent) => {
    setSelectedParent(parent);
    setShowArchiveModal(true);
  };
  
  const confirmArchive = async (reason) => {
    if (!selectedParent) return;
    try {
      setArchiveLoading(true);
      await archiveParent(selectedParent.id, reason);
      const parentName = selectedParent.full_name || selectedParent.user?.first_name || 'Parent';
      setSuccess(`Parent ${parentName} has been archived.`);
      setShowArchiveModal(false);
      setSelectedParent(null);
      loadParents();
      loadStatistics();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error archiving parent:', err);
      setError('Failed to archive parent. Please try again.');
    } finally {
      setArchiveLoading(false);
    }
  };
  
  // Restore Parent
  const handleRestoreParent = (parent) => {
    setSelectedParent(parent);
    setShowRestoreModal(true);
  };
  
  const confirmRestore = async () => {
    if (!selectedParent) return;
    try {
      setRestoreLoading(true);
      await restoreParent(selectedParent.id);
      const parentName = selectedParent.full_name || selectedParent.user?.first_name || 'Parent';
      setSuccess(`Parent ${parentName} has been restored.`);
      setShowRestoreModal(false);
      setSelectedParent(null);
      loadParents();
      loadStatistics();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error restoring parent:', err);
      setError('Failed to restore parent. Please try again.');
    } finally {
      setRestoreLoading(false);
    }
  };
  
  // Password Reset
  const handlePasswordClick = (parent) => {
    setSelectedParent(parent);
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
      // Note: You need to implement updateParentPassword in parentService
      alert('Password reset functionality - Implement API call');
      setSuccess(`Password reset successfully`);
      setShowPasswordModal(false);
      setSelectedParent(null);
      setPasswordForm({ new_password: '', confirm_password: '' });
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error resetting password:', err);
      setError(err.message || 'Failed to reset password');
    } finally {
      setPasswordLoading(false);
    }
  };
  
  // CSV Export
  const handleExportCSV = async () => {
    try {
      setExporting(true);
      setError('');
      setSuccess('Fetching all parents for export...');
      
      // Use direct download endpoint
      await downloadAllParentsCSV();
      
      setSuccess(`Parents data exported successfully!`);
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      console.error('Export error:', err);
      setError('Failed to export parents. Please try again.');
    } finally {
      setExporting(false);
    }
  };
  
  // Print All
  const handlePrintAll = async () => {
    try {
      setPrinting(true);
      setError('');
      setSuccess('Fetching all parents for printing...');
      const allParents = await getAllParentsForPrint();
      if (!allParents || allParents.length === 0) {
        setError('No parents found to print');
        setSuccess('');
        return;
      }
      printAllParents(allParents);
      setSuccess(`✅ Printing ${allParents.length} parents...`);
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      console.error('Print error:', err);
      setError('Failed to print parents. Please try again.');
    } finally {
      setPrinting(false);
    }
  };
  
  // Print Single
  const handlePrintSingle = (parent) => {
    if (parent) {
      printParentRecord(parent);
    }
  };
  
  // Bulk Upload
  const handleBulkUpload = async (file) => {
    try {
      setBulkUploadLoading(true);
      setError('');
      
      // Validate file
      const validation = validateBulkUploadFile(file);
      if (!validation.isValid) {
        throw new Error(validation.errors.join('\n'));
      }
      
      const result = await bulkUploadParents(file);
      
      // Show detailed results
      const messages = [];
      if (result.created > 0) messages.push(`${result.created} created`);
      if (result.updated > 0) messages.push(`${result.updated} updated`);
      if (result.linked > 0) messages.push(`${result.linked} children linked`);
      
      setSuccess(`Bulk upload completed: ${messages.join(', ')}`);
      
      // Refresh data
      await loadParents();
      await loadStatistics();
      
      return result;
    } catch (err) {
      console.error('Bulk upload error:', err);
      setError(err.message || 'Failed to upload parents. Please check your file and try again.');
      throw err;
    } finally {
      setBulkUploadLoading(false);
    }
  };
  
  const downloadTemplate = () => {
    downloadParentBulkUploadTemplate();
  };
  
  // Pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
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
    }
    return pages;
  };
  
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  
  const renderPagination = () => {
    if (totalPages <= 1) return null;
    
    return (
      <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-100">
        <Button variant="ghost" size="tiny" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
          <ChevronLeft size={14} /> Previous
        </Button>
        <div className="flex gap-1">
          {getPageNumbers().map((page, idx) => (
            page === '...' ? (
              <span key={idx} className="px-2 py-1 text-xs text-gray-400">...</span>
            ) : (
              <button
                key={idx}
                onClick={() => goToPage(page)}
                className={`min-w-[32px] h-8 rounded-lg text-xs font-medium transition-colors ${
                  currentPage === page ? 'bg-[#D94801] text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            )
          ))}
        </div>
        <Button variant="ghost" size="tiny" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
          Next <ChevronRight size={14} />
        </Button>
      </div>
    );
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
            <Text variant="body" className="text-gray-500">You don't have permission to view parents list.</Text>
            <Button variant="primary" size="small" className="mt-4" onClick={() => navigate('/dashboard')}>
              Go to Dashboard
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout title="Parents">
      <div className="h-[calc(100vh-120px)] flex flex-col px-3 sm:px-4 lg:px-6">
        
        {/* STICKY HEADER SECTION */}
        <div className="sticky top-0 z-20 bg-gray-50 -mx-3 sm:-mx-4 lg:-mx-6 px-3 sm:px-4 lg:px-6 pt-4 pb-2">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#1D2B49] rounded-xl flex items-center justify-center shadow-sm">
                  <Users size={14} className="text-white" />
                </div>
                <Text variant="h2" className="font-bold">Parents</Text>
              </div>
              <Text variant="caption" className="text-gray-400 pl-9">
                Manage parent and guardian records • {totalParents} total parents
              </Text>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="small" 
                icon={exporting ? RefreshCw : Download} 
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
              <Button variant="outline" size="small" icon={Upload} onClick={() => setShowBulkUploadModal(true)}>
                Bulk
              </Button>
              <Button variant="primary" size="small" icon={Plus} onClick={() => navigate('/parents/create')}>
                Add
              </Button>
              <Button variant="outline" size="small" icon={RefreshCw} onClick={loadParents} loading={loading}>
                Refresh
              </Button>
            </div>
          </div>
          
          {/* Alerts */}
          {error && <Alert type="error" message={error} onClose={() => setError('')} className="mb-3" />}
          {success && <Alert type="success" message={success} onClose={() => setSuccess('')} className="mb-3" />}
          
          {/* Stats Cards */}
          <ParentStatsCards stats={stats} loading={loading} />
          
          {/* Filters */}
          <ParentFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filters={filters}
            setFilters={setFilters}
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
            ) : parents.length === 0 ? (
              <div className="text-center py-12">
                <Users size={40} className="mx-auto text-gray-200 mb-3" />
                <Text variant="body" className="text-gray-400">No parents found</Text>
                {hasActiveFilters ? (
                  <Button variant="outline" size="small" className="mt-3" onClick={clearFilters}>Clear Filters</Button>
                ) : (
                  <Button variant="primary" size="small" className="mt-3" onClick={() => navigate('/parents/create')}>
                    Add your first parent
                  </Button>
                )}
              </div>
            ) : (
              <>
                {/* Desktop Table View */}
                {displayViewMode === 'table' && !isMobile && (
                  <ParentTable
                    parents={parents}
                    onView={handleViewParent}
                    onEdit={handleEditParent}
                    onArchive={handleArchiveParent}
                    onRestore={handleRestoreParent}
                    onResetPassword={handlePasswordClick}
                    onPrint={handlePrintSingle}
                    isAdmin={isAdmin}
                  />
                )}
                
                {/* Card View */}
                {(displayViewMode === 'card' || isMobile) && (
                  <div className="p-3">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                      {parents.map((parent) => (
                        <ParentCard
                          key={parent.id}
                          parent={parent}
                          onView={handleViewParent}
                          onEdit={handleEditParent}
                          onResetPassword={handlePasswordClick}
                          onArchive={handleArchiveParent}
                          onRestore={handleRestoreParent}
                          onPrint={handlePrintSingle}
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
                    Showing {parents.length} of {totalParents} parents
                  </Text>
                </div>
              </>
            )}
          </Card>
        </div>
      </div>
      
      {/* Bulk Upload Modal */}
      <ParentBulkUpload
        isOpen={showBulkUploadModal}
        onClose={() => { setShowBulkUploadModal(false); }}
        onUpload={handleBulkUpload}
        loading={bulkUploadLoading}
        downloadTemplate={downloadTemplate}
      />
      
      {/* Archive Modal */}
      <ArchiveParentModal
        isOpen={showArchiveModal}
        onClose={() => { setShowArchiveModal(false); setSelectedParent(null); }}
        parent={selectedParent}
        onConfirm={confirmArchive}
        loading={archiveLoading}
      />
      
      {/* Restore Modal */}
      <RestoreParentModal
        isOpen={showRestoreModal}
        onClose={() => { setShowRestoreModal(false); setSelectedParent(null); }}
        parent={selectedParent}
        onConfirm={confirmRestore}
        loading={restoreLoading}
      />
      
      {/* Password Reset Modal */}
      <PasswordResetModal
        isOpen={showPasswordModal}
        onClose={() => { setShowPasswordModal(false); setSelectedParent(null); setPasswordForm({ new_password: '', confirm_password: '' }); }}
        parent={selectedParent}
        formData={passwordForm}
        setFormData={setPasswordForm}
        errors={passwordErrors}
        onSubmit={submitPasswordReset}
        loading={passwordLoading}
      />
    </DashboardLayout>
  );
};

export default Parents;