// src/pages/students/StudentList.jsx - CORRECTED IMPORTS

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import Alert from '../../components/common/Alert';
import { Text, Button, Card } from '../../components/ui';
import { StudentCard } from './components/StudentCard';
import { StudentTable } from './components/StudentTable';
import { StudentFilters } from './components/StudentFilters';
import { 
  ViewStudentModal, 
  ArchiveStudentModal, 
  RestoreStudentModal,   // ✅ From components
  PasswordResetModal 
} from './components/StudentModals';
import { exportStudentsToCSV } from './components/StudentCSVUtils';
import { StudentBulkUpload } from './components/StudentBulkUpload';
import { printStudentRecord, printAllStudents } from './components/StudentPrintUtils';
import { 
  Plus, RefreshCw, Download, Upload, Printer, Grid3x3, Table2, 
  UserPlus, AlertCircle, Shield
} from 'lucide-react';
import { 
  getStudents, 
  getStudentById, 
  updateStudentPassword, 
  deleteStudent,
  archiveStudent,      
  restoreStudent,
  getAllStudentsForExport,
  getAllStudentsForPrint,
  bulkUploadStudents,
  downloadBulkUploadTemplate,
  downloadAllStudentsCSV
} from '../../services/studentService';
import { getClassLevels as fetchClassLevels } from '../../services/academicService';
import useAuth from '../../hooks/useAuth';

const StudentList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const isAdmin = ['head', 'hm', 'principal', 'vice_principal', 'accountant', 'secretary'].includes(user?.role);
  
  // States
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [classLevels, setClassLevels] = useState([]);
  const [totalStudents, setTotalStudents] = useState(0);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 12;
  
  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    class_level: '',
    stream: '',
    fee_status: '',
    is_active: '',
    is_graduated: ''
  });
  
  // View Mode
  const [viewMode, setViewMode] = useState('table');
  const [isMobile, setIsMobile] = useState(false);
  const [restoreLoading, setRestoreLoading] = useState(false);
  
  // Modal States
  const [showViewModal, setShowViewModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentDetails, setStudentDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false); 
  
  // Password Form
  const [passwordForm, setPasswordForm] = useState({ new_password: '', confirm_password: '' });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [printing, setPrinting] = useState(false);
  
  // Action Loading
  const [archiveLoading, setArchiveLoading] = useState(false);
  const [bulkUploadLoading, setBulkUploadLoading] = useState(false);
  const [exporting, setExporting] = useState(false);  // ADDED
  
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
  
  // Load data
  const loadStudents = useCallback(async () => {
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
      
      const response = await getStudents(params);
      
      if (response && response.results) {
        setStudents(response.results);
        setFilteredStudents(response.results);
        setTotalPages(response.total_pages || 1);
        setTotalStudents(response.count || 0);
      } else {
        setStudents([]);
        setFilteredStudents([]);
        setTotalPages(1);
        setTotalStudents(0);
      }
    } catch (err) {
      console.error('Error loading students:', err);
      setError('Failed to load students. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [currentPage, filters, searchTerm]);
  
  const loadClassLevels = async () => {
    try {
      const levels = await fetchClassLevels();
      setClassLevels(levels.results || levels || []);
    } catch (err) {
      console.error('Error loading class levels:', err);
    }
  };
  
  useEffect(() => {
    if (isAdmin) {
      loadStudents();
      loadClassLevels();
    }
  }, [isAdmin, currentPage, loadStudents]);
  
  // Apply filters
  const applyFilters = () => {
    setCurrentPage(1);
    loadStudents();
  };
  
  const clearFilters = () => {
    setFilters({
      class_level: '',
      stream: '',
      fee_status: '',
      is_active: '',
      is_graduated: ''
    });
    setSearchTerm('');
    setCurrentPage(1);
    setTimeout(loadStudents, 100);
  };
  
  const hasActiveFilters = searchTerm !== '' || Object.values(filters).some(v => v !== '');
  
  const handleViewStudent = async (student) => {
    try {
      setLoadingDetails(true);
      setSelectedStudent(student);
      
      const response = await getStudentById(student.id);
      const details = response.student || response;
      
      const userData = details.user || student.user || {};
      
      const mergedDetails = {
        ...details,
        ...student,
        user: {
          ...userData,
          registration_number: userData.registration_number || student.registration_number || 'N/A',
          first_name: userData.first_name || student.first_name || '',
          last_name: userData.last_name || student.last_name || '',
          email: userData.email || student.email || '',
          phone_number: userData.phone_number || student.phone_number || '',
        }
      };
      
      setStudentDetails(mergedDetails);
      setShowViewModal(true);
    } catch (err) {
      console.error('Error fetching student details:', err);
      const fallbackData = {
        ...student,
        user: student.user || {
          registration_number: student.registration_number || 'N/A',
          first_name: student.first_name || '',
          last_name: student.last_name || '',
        }
      };
      setStudentDetails(fallbackData);
      setShowViewModal(true);
    } finally {
      setLoadingDetails(false);
    }
  };
  
  // Archive Student (instead of delete)
  const handleArchiveStudent = (student) => {
    setSelectedStudent(student);
    setShowArchiveModal(true);
  };

  const handleRestoreStudent = (student) => {
    setSelectedStudent(student);
    setShowRestoreModal(true);  // Add this state
  };
  
  const confirmArchive = async () => {
    if (!selectedStudent) return;
    try {
      setArchiveLoading(true);
      // Use deleteStudent - it will archive (since backend modified)
      const result = await deleteStudent(selectedStudent.id);
      setSuccess(`Student ${selectedStudent.first_name || ''} ${selectedStudent.last_name || ''} has been archived.`);
      setShowArchiveModal(false);
      setSelectedStudent(null);
      loadStudents();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error archiving student:', err);
      setError('Failed to archive student. Please try again.');
    } finally {
      setArchiveLoading(false);
    }
  };

  const confirmRestore = async () => {
    if (!selectedStudent) return;
    try {
      setRestoreLoading(true);
      const result = await restoreStudent(selectedStudent.id);  // ✅ Now this works
      setSuccess(`Student ${selectedStudent.first_name || ''} ${selectedStudent.last_name || ''} has been restored.`);
      setShowRestoreModal(false);
      setSelectedStudent(null);
      loadStudents();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error restoring student:', err);
      setError('Failed to restore student. Please try again.');
    } finally {
      setRestoreLoading(false);
    }
  };
  
  // Password Reset
  const handlePasswordClick = (student) => {
    setSelectedStudent(student);
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
      await updateStudentPassword(selectedStudent.id, {
        new_password: passwordForm.new_password,
        confirm_password: passwordForm.confirm_password
      });
      setSuccess(`Password reset successfully for ${selectedStudent.first_name || ''} ${selectedStudent.last_name || ''}`);
      setShowPasswordModal(false);
      setSelectedStudent(null);
      setPasswordForm({ new_password: '', confirm_password: '' });
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error resetting password:', err);
      setError(err.message || 'Failed to reset password');
    } finally {
      setPasswordLoading(false);
    }
  };
  
  // Edit Student
  const handleEditStudent = (student) => {
    navigate(`/students/${student.id}/edit`);
  };
  
  // CSV Export - FIXED to export ALL students
  const handleExportCSV = async () => {
    try {
      setExporting(true);
      setError('');
      await downloadAllStudentsCSV();
      setSuccess(`Students data exported successfully!`);
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      console.error('Export error:', err);
      setError('Failed to export students. Please try again.');
    } finally {
      setExporting(false);
    }
  };
  

// src/pages/students/StudentList.jsx - Update handlePrintAll

  const handlePrintAll = async () => {
    // Prevent multiple clicks
    if (printing) return;
    
    try {
      setPrinting(true);
      setError('');
      
      setSuccess('Fetching all students for printing...');
      
      const allStudents = await getAllStudentsForPrint();
      
      if (!allStudents || allStudents.length === 0) {
        setError('No students found to print');
        setSuccess('');
        alert('No students found to print');
        return;
      }
      
      // Close any existing print dialog before opening new one
      setSuccess(`✅ Preparing ${allStudents.length} students for printing...`);
      
      // Use setTimeout to allow UI to update before printing
      setTimeout(() => {
        try {
          printAllStudents(allStudents);
          setSuccess(`✅ Printing ${allStudents.length} students...`);
        } catch (printErr) {
          console.error('Print execution error:', printErr);
          setError('Failed to print. Please try again.');
        }
      }, 100);
      
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      console.error('Print error:', err);
      setError('Failed to load students for printing. Please try again.');
      setSuccess('');
      alert('Failed to load students. Please check your connection and try again.');
    } finally {
      setPrinting(false);
    }
  };

  
  // Print Single from view modal
  const handlePrintSingle = () => {
    if (studentDetails || selectedStudent) {
      printStudentRecord(studentDetails || selectedStudent);
    }
  };
  
  const handleBulkUpload = async (file) => {
    try {
      setBulkUploadLoading(true);
      setError('');
      
      const result = await bulkUploadStudents(file);
      
      // Refresh the student list
      await loadStudents();
      
      // Show success message with details
      const message = [];
      if (result.created > 0) message.push(`${result.created} created`);
      if (result.updated > 0) message.push(`${result.updated} updated`);
      
      setSuccess(`Bulk upload completed: ${message.join(', ')}`);
      
      return result;
    } catch (err) {
      console.error('Bulk upload error:', err);
      setError(err.message || 'Failed to upload students. Please check your file and try again.');
      throw err;
    } finally {
      setBulkUploadLoading(false);
    }
  };
  
  const downloadTemplate = () => {
    downloadBulkUploadTemplate();
  };
  
  // Pagination
  const renderPagination = () => {
    if (totalPages <= 1) return null;
    
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
    total: totalStudents,
    active: students.filter(s => s.is_active).length,
    graduated: students.filter(s => s.is_graduated).length,
    archived: students.filter(s => !s.is_active).length
  };
  
  if (!isAdmin) {
    return (
      <DashboardLayout title="Access Denied">
        <div className="flex items-center justify-center min-h-[60vh] px-4">
          <div className="text-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="text-red-500" size={28} />
            </div>
            <Text variant="h3" className="font-bold text-gray-800 mb-2">Access Denied</Text>
            <Text variant="body" className="text-gray-500">You don't have permission to view students list.</Text>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout title="Students">
      <div className="h-[calc(100vh-120px)] flex flex-col px-3 sm:px-4 lg:px-6">
        
        {/* STICKY HEADER SECTION */}
        <div className="sticky top-0 z-20 bg-gray-50 -mx-3 sm:-mx-4 lg:-mx-6 px-3 sm:px-4 lg:px-6 pt-4 pb-2">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            
            <div className="flex items-center gap-2">
              {/* Export Buttons - UPDATED CSV button */}
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
                {printing ? `Loading ${totalStudents} students...` : 'Print All'}
              </Button>
              <Button 
                variant="outline" 
                size="small" 
                icon={Upload} 
                onClick={() => setShowBulkUploadModal(true)}
              >
                Bulk
              </Button>
              <Button variant="primary" size="small" icon={Plus} onClick={() => navigate('/students/create')}>
                Add
              </Button>
              <Button variant="outline" size="small" icon={RefreshCw} onClick={loadStudents} loading={loading}>
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
              <Text variant="h4" className="font-bold text-purple-600">{stats.graduated}</Text>
              <Text variant="tiny" className="text-gray-400">Graduated</Text>
            </Card>
            <Card className="p-3">
              <Text variant="h4" className="font-bold text-red-600">{stats.archived}</Text>
              <Text variant="tiny" className="text-gray-400">Archived</Text>
            </Card>
          </div>
          
          {/* Filters */}
          <StudentFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filters={filters}
            setFilters={setFilters}
            classLevels={classLevels}
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
            ) : students.length === 0 ? (
              <div className="text-center py-12">
                <UserPlus size={40} className="mx-auto text-gray-200 mb-3" />
                <Text variant="body" className="text-gray-400">No students found</Text>
                {hasActiveFilters ? (
                  <Button variant="outline" size="small" className="mt-3" onClick={clearFilters}>Clear Filters</Button>
                ) : (
                  <Button variant="primary" size="small" className="mt-3" onClick={() => navigate('/students/create')}>
                    Add your first student
                  </Button>
                )}
              </div>
            ) : (
              <>
                {/* Desktop Table View */}
                {displayViewMode === 'table' && !isMobile && (
                  <StudentTable
                    students={students}
                    onView={handleViewStudent}
                    onEdit={handleEditStudent}
                    onArchive={handleArchiveStudent}
                    onRestore={handleRestoreStudent} 
                    onResetPassword={handlePasswordClick}
                    isAdmin={isAdmin}
                    formatCurrency={formatCurrency}
                  />
                )}
                
                {/* Card View */}
                {(displayViewMode === 'card' || isMobile) && (
                  <div className="p-3">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                      {students.map((student) => (
                        <StudentCard
                          key={student.id}
                          student={student}
                          onView={handleViewStudent}
                          onEdit={handleEditStudent}
                          onDelete={handleArchiveStudent}
                          onResetPassword={handlePasswordClick}
                          isAdmin={isAdmin}
                          formatCurrency={formatCurrency}
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
                    Showing {students.length} of {totalStudents} students
                  </Text>
                </div>
              </>
            )}
          </Card>
        </div>
      </div>
      
      {/* View Modal */}
      <ViewStudentModal
        isOpen={showViewModal}
        onClose={() => { setShowViewModal(false); setStudentDetails(null); setSelectedStudent(null); }}
        student={selectedStudent}
        studentDetails={studentDetails}
        loading={loadingDetails}
        onEdit={handleEditStudent}
        onResetPassword={handlePasswordClick}
        onArchive={handleArchiveStudent}
        onPrint={handlePrintSingle}
        formatCurrency={formatCurrency}
        formatDate={formatDate}
      />
      
      {/* Archive Modal */}
      <ArchiveStudentModal
        isOpen={showArchiveModal}
        onClose={() => { setShowArchiveModal(false); setSelectedStudent(null); }}
        student={selectedStudent}
        onConfirm={confirmArchive}
        loading={archiveLoading}
      />

      {/* Restore Modal - ADD THIS RIGHT AFTER Archive Modal */}
      <RestoreStudentModal
        isOpen={showRestoreModal}
        onClose={() => { setShowRestoreModal(false); setSelectedStudent(null); }}
        student={selectedStudent}
        onConfirm={confirmRestore}
        loading={restoreLoading}
      />
      
      {/* Password Reset Modal */}
      <PasswordResetModal
        isOpen={showPasswordModal}
        onClose={() => { setShowPasswordModal(false); setSelectedStudent(null); setPasswordForm({ new_password: '', confirm_password: '' }); }}
        student={selectedStudent}
        formData={passwordForm}
        setFormData={setPasswordForm}
        errors={passwordErrors}
        onSubmit={submitPasswordReset}
        loading={passwordLoading}
      />
      
      {/* Bulk Upload Modal */}
      <StudentBulkUpload
        isOpen={showBulkUploadModal}
        onClose={() => { setShowBulkUploadModal(false); }}
        onUpload={handleBulkUpload}
        loading={bulkUploadLoading}
        downloadTemplate={downloadTemplate}
      />
    </DashboardLayout>
  );
};

export default StudentList;