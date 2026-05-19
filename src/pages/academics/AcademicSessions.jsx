import React, { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import Alert from '../../components/common/Alert';
import Modal from '../../components/common/modal';
import { 
  Calendar, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  RefreshCw,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Grid3x3,
  Table2,
  Info,
  CheckCircle,
  Clock,
  Archive,
  X
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import { 
  getAcademicSessions, 
  createAcademicSession, 
  updateAcademicSession, 
  deleteAcademicSession 
} from '../../services/academicService';
import { handleApiError } from '../../services/api';

// ============================================
// DESIGN SYSTEM COMPONENTS
// ============================================

// Typography (Sora font assumed via global CSS)
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

// Primary Button (#D94801)
const Button = ({ children, variant = 'primary', size = 'medium', icon: Icon, onClick, loading, disabled, type = 'button', className = '' }) => {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 ease rounded-xl cursor-pointer';
  const variants = {
    primary: 'bg-[#D94801] text-white hover:bg-[#C24000] active:bg-[#A93600] shadow-sm',
    secondary: 'bg-[#1D2B49] text-white hover:bg-[#24385C] active:bg-[#324A74]',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
    ghost: 'text-gray-600 hover:bg-gray-100',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    success: 'bg-green-600 text-white hover:bg-green-700',
  };
  const sizes = {
    large: 'h-12 px-5 text-sm',
    medium: 'h-10 px-4 text-sm',
    small: 'h-8 px-3 text-xs',
    tiny: 'h-7 px-2 text-[10px]',
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {loading && <RefreshCw size={14} className="animate-spin" />}
      {Icon && !loading && <Icon size={size === 'tiny' ? 12 : size === 'small' ? 14 : 16} />}
      {children}
    </button>
  );
};

// Card Component
const Card = ({ children, className = '', hover = false }) => (
  <div className={`bg-white rounded-2xl shadow-sm ${hover ? 'transition-shadow duration-200 hover:shadow-md' : ''} ${className}`}>
    {children}
  </div>
);

// Stat Card (Dashboard)
const StatCard = ({ title, value, icon: Icon, color, detail }) => (
  <Card className="p-3">
    <div className="flex items-center gap-3">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
        <Icon size={14} className="text-gray-600" />
      </div>
      <div className="flex-1 min-w-0">
        <Text variant="caption" className="text-gray-400 uppercase tracking-wide">{title}</Text>
        <Text variant="h4" className="font-bold text-gray-800 leading-tight truncate">{value}</Text>
        {detail && <Text variant="tiny" className="text-gray-400 mt-0.5 truncate">{detail}</Text>}
      </div>
    </div>
  </Card>
);

// Status Badge
const StatusBadge = ({ status }) => {
  const config = {
    active: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle, label: 'Active' },
    upcoming: { bg: 'bg-blue-100', text: 'text-blue-700', icon: Clock, label: 'Upcoming' },
    completed: { bg: 'bg-gray-100', text: 'text-gray-600', icon: CheckCircle, label: 'Completed' },
    archived: { bg: 'bg-gray-100', text: 'text-gray-500', icon: Archive, label: 'Archived' }
  };
  const c = config[status] || config.upcoming;
  const Icon = c.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] md:text-[10px] font-medium ${c.bg} ${c.text}`}>
      <Icon size={10} /> {c.label}
    </span>
  );
};

// Mobile Filter Sheet
const MobileFilterSheet = ({ isOpen, onClose, searchTerm, setSearchTerm, statusFilter, setStatusFilter, filterOptions, onApply, onClear }) => {
  const [localSearch, setLocalSearch] = useState(searchTerm);
  const [localFilter, setLocalFilter] = useState(statusFilter);
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 transition-opacity" onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 p-5 animate-in slide-in-from-bottom duration-200 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <Text variant="h4" className="font-semibold">Filter Sessions</Text>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100"><X size={18} /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
              <input type="text" value={localSearch} onChange={(e) => setLocalSearch(e.target.value)} placeholder="Search by name or status..." className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
            <select value={localFilter} onChange={(e) => setLocalFilter(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]">
              {filterOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="primary" size="medium" onClick={() => { setSearchTerm(localSearch); setStatusFilter(localFilter); onApply(); onClose(); }} className="flex-1">Apply Filters</Button>
            <button onClick={() => { setLocalSearch(''); setLocalFilter('all'); setSearchTerm(''); setStatusFilter('all'); onClear(); onClose(); }} className="px-4 py-2 text-red-500 font-medium text-sm">Clear</button>
          </div>
        </div>
      </div>
    </>
  );
};

// Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
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
    <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-100 sticky bottom-0 bg-white z-10">
      <Button variant="ghost" size="tiny" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
        <ChevronLeft size={14} /> Prev
      </Button>
      <div className="flex gap-1">
        {getPageNumbers().map((page, idx) => (
          page === '...' ? (
            <span key={idx} className="px-2 py-1 text-xs text-gray-400">...</span>
          ) : (
            <button key={idx} onClick={() => onPageChange(page)} className={`min-w-[32px] h-8 rounded-lg text-xs font-medium transition-colors ${currentPage === page ? 'bg-[#D94801] text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
              {page}
            </button>
          )
        ))}
      </div>
      <Button variant="ghost" size="tiny" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
        Next <ChevronRight size={14} />
      </Button>
    </div>
  );
};

// Session Card Component (for mobile grid view)
const SessionCard = ({ session, formatDate, calculateDuration, onView, onEdit, onDelete, isAdmin }) => (
  <Card className="p-3 space-y-2 hover:shadow-md transition-shadow duration-200 h-full">
    <div className="flex justify-between items-start gap-2">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <Calendar size={14} className="text-gray-600" />
        </div>
        <div className="flex-1 min-w-0">
          <Text variant="tiny" className="font-bold text-gray-800 truncate">{session.name}</Text>
          <Text variant="caption" className="text-gray-400 text-[8px] md:text-[9px]">
            {formatDate(session.start_date)} - {formatDate(session.end_date)}
          </Text>
        </div>
      </div>
      <StatusBadge status={session.status} />
    </div>
    <div>
      <Text variant="caption" className="text-gray-400 flex items-center gap-1 text-[8px] md:text-[9px]">
        <Clock size={8} /> {calculateDuration(session.start_date, session.end_date)} days
      </Text>
    </div>
    {session.is_current && (
      <span className="inline-flex px-1.5 py-0.5 rounded-full text-[7px] font-medium bg-green-100 text-green-700">
        Current Session
      </span>
    )}
    {session.description && (
      <Text variant="tiny" className="text-gray-500 line-clamp-1">{session.description}</Text>
    )}
    <div className="flex justify-end gap-0.5 pt-1">
      <button onClick={() => onView(session)} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"><Eye size={12} /></button>
      {isAdmin && (
        <>
          <button onClick={() => onEdit(session)} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"><Edit size={12} /></button>
          <button onClick={() => onDelete(session)} className="p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors"><Trash2 size={12} /></button>
        </>
      )}
    </div>
  </Card>
);

// ============================================
// MAIN COMPONENT
// ============================================
const AcademicSessions = () => {
  const { user, isAdmin } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [sessionToDelete, setSessionToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [viewMode, setViewMode] = useState('table');
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const [formData, setFormData] = useState({
    name: '',
    start_date: '',
    end_date: '',
    is_current: false,
    status: 'upcoming',
    description: ''
  });

  const statusOptions = [
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
    { value: 'archived', label: 'Archived' }
  ];

  const filterOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'completed', label: 'Completed' },
    { value: 'archived', label: 'Archived' }
  ];

  const fetchSessions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAcademicSessions();
      setSessions(response.results || response || []);
      setCurrentPage(1);
    } catch (err) {
      console.error('❌ Error fetching academic sessions:', err);
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      
      if (editingSession) {
        await updateAcademicSession(editingSession.id, formData);
        setSuccess('Session updated successfully');
      } else {
        await createAcademicSession(formData);
        setSuccess('Session created successfully');
      }
      
      setIsModalOpen(false);
      resetForm();
      fetchSessions();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('❌ Error saving session:', err);
      setError(handleApiError(err));
    }
  };

  const handleEdit = (session) => {
    setEditingSession(session);
    setFormData({
      name: session.name,
      start_date: session.start_date,
      end_date: session.end_date,
      is_current: session.is_current,
      status: session.status,
      description: session.description || ''
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (session) => {
    setSessionToDelete(session);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      await deleteAcademicSession(sessionToDelete.id);
      setSuccess('Session deleted successfully');
      fetchSessions();
      setIsDeleteModalOpen(false);
      setSessionToDelete(null);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('❌ Error deleting session:', err);
      setError(handleApiError(err));
      setIsDeleteModalOpen(false);
    }
  };

  const handleView = (session) => {
    setSelectedSession(session);
    setIsViewModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      start_date: '',
      end_date: '',
      is_current: false,
      status: 'upcoming',
      description: ''
    });
    setEditingSession(null);
    setError('');
  };

  const calculateDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = (session.name && session.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (session.status && session.status.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = statusFilter === 'all' || session.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredSessions.length / itemsPerPage);
  const paginatedSessions = filteredSessions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const stats = {
    total: sessions.length,
    active: sessions.filter(s => s.status === 'active').length,
    upcoming: sessions.filter(s => s.status === 'upcoming').length,
    current: sessions.find(s => s.is_current)?.name || 'None'
  };

  const hasActiveFilters = searchTerm || statusFilter !== 'all';

  // Detect mobile screen
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const displayViewMode = isMobile ? 'card' : viewMode;

  if (loading && sessions.length === 0) {
    return (
      <DashboardLayout title="Academic Sessions">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <RefreshCw className="animate-spin h-8 w-8 text-[#D94801] mx-auto mb-4" />
            <Text variant="body" className="text-gray-400">Loading academic sessions from database...</Text>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Academic Sessions">
      {/* Fixed height container with internal scrolling - only table/card scrolls */}
      <div className="h-[calc(100vh-120px)] flex flex-col px-3 sm:px-4 lg:px-6">
        
        {/* STICKY HEADER SECTION - Everything above the table/card stays fixed */}
        <div className="sticky top-0 z-20 bg-gray-50 -mx-3 sm:-mx-4 lg:-mx-6 px-3 sm:px-4 lg:px-6 pt-4 pb-2">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#1D2B49] rounded-xl flex items-center justify-center shadow-sm">
                  <Calendar size={14} className="text-white" />
                </div>
                <Text variant="h2" className="font-bold">Academic Sessions</Text>
              </div>
              <Text variant="caption" className="text-gray-400 pl-9">
                Manage school academic sessions and calendars • {sessions.length} total sessions
              </Text>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="small" icon={RefreshCw} onClick={fetchSessions} loading={loading}>
                Refresh
              </Button>
              <Button variant="primary" size="small" icon={Plus} onClick={() => { resetForm(); setIsModalOpen(true); }}>
                Add
              </Button>
            </div>
          </div>

          {/* Alerts */}
          {error && (
            <div className="mb-3">
              <Alert type="error" message={error} onClose={() => setError('')} />
            </div>
          )}
          {success && (
            <div className="mb-3">
              <Alert type="success" message={success} onClose={() => setSuccess('')} />
            </div>
          )}

          {/* Stats Cards - Responsive grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-3">
            <StatCard title="Total Sessions" value={stats.total} icon={Calendar} color="bg-gray-100" />
            <StatCard title="Active Sessions" value={stats.active} icon={CheckCircle} color="bg-green-100" />
            <StatCard title="Upcoming" value={stats.upcoming} icon={Clock} color="bg-blue-100" />
            <StatCard title="Current Session" value={stats.current} icon={Info} color="bg-purple-100" detail="Active session" />
          </div>

          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-2 mb-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                placeholder="Search sessions by name or status..."
                className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801] focus:border-transparent"
              />
            </div>
            
            {/* Desktop filters */}
            <div className="hidden sm:flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
              >
                {filterOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
              {hasActiveFilters && (
                <Button variant="ghost" size="tiny" onClick={() => { setSearchTerm(''); setStatusFilter('all'); }}>
                  Clear
                </Button>
              )}
              {/* View Toggle (desktop only) */}
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
            
            {/* Mobile filter button */}
            <button
              onClick={() => setShowMobileFilter(true)}
              className="sm:hidden flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 bg-white text-gray-700 rounded-xl text-sm font-medium"
            >
              <Filter size={14} /> Filter {hasActiveFilters && <span className="w-2 h-2 bg-[#D94801] rounded-full" />}
            </button>
          </div>

          <MobileFilterSheet
            isOpen={showMobileFilter}
            onClose={() => setShowMobileFilter(false)}
            searchTerm={searchTerm}
            setSearchTerm={(val) => { setSearchTerm(val); setCurrentPage(1); }}
            statusFilter={statusFilter}
            setStatusFilter={(val) => { setStatusFilter(val); setCurrentPage(1); }}
            filterOptions={filterOptions}
            onApply={fetchSessions}
            onClear={() => { setSearchTerm(''); setStatusFilter('all'); fetchSessions(); }}
          />
        </div>

        {/* SCROLLABLE CONTENT SECTION - Only table/card scrolls here */}
        <div className="flex-1 overflow-y-auto min-h-0 -mx-3 sm:-mx-4 lg:-mx-6 px-3 sm:px-4 lg:px-6 pb-4">
          <Card className="overflow-hidden">
            {paginatedSessions.length === 0 ? (
              <div className="p-8 text-center">
                <Calendar size={32} className="mx-auto text-gray-200 mb-2" />
                <Text variant="body" className="text-gray-400">No academic sessions found</Text>
                {hasActiveFilters ? (
                  <Button variant="outline" size="small" className="mt-3" onClick={() => { setSearchTerm(''); setStatusFilter('all'); }}>
                    Clear Filters
                  </Button>
                ) : (
                  <Button variant="primary" size="small" className="mt-3" onClick={() => { resetForm(); setIsModalOpen(true); }}>
                    Create your first session
                  </Button>
                )}
              </div>
            ) : (
              <>
                {/* Desktop Table View */}
                {displayViewMode === 'table' && !isMobile && (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-100 sticky top-0 z-10">
                        <tr>
                          <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Session Details</th>
                          <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">Duration</th>
                          <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-4 py-3 text-right text-[10px] font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {paginatedSessions.map((session) => (
                          <tr key={session.id} className="hover:bg-gray-50 transition-colors duration-150">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                                  <Calendar size={14} className="text-gray-600" />
                                </div>
                                <div>
                                  <Text variant="small" className="font-medium text-gray-800">{session.name}</Text>
                                  <div className="flex items-center gap-2">
                                    <Text variant="caption" className="text-gray-400">
                                      {formatDate(session.start_date)} - {formatDate(session.end_date)}
                                    </Text>
                                    {session.is_current && (
                                      <span className="inline-flex px-1.5 py-0.5 rounded-full text-[8px] font-medium bg-green-100 text-green-700">
                                        Current
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 hidden md:table-cell">
                              <Text variant="caption" className="text-gray-600">
                                {calculateDuration(session.start_date, session.end_date)} days
                              </Text>
                            </td>
                            <td className="px-4 py-3">
                              <StatusBadge status={session.status} />
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button onClick={() => handleView(session)} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg transition-colors">
                                  <Eye size={14} />
                                </button>
                                {isAdmin && (
                                  <>
                                    <button onClick={() => handleEdit(session)} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg transition-colors">
                                      <Edit size={14} />
                                    </button>
                                    <button onClick={() => handleDeleteClick(session)} className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg transition-colors">
                                      <Trash2 size={14} />
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Card View - For mobile (2 per row) and desktop when toggled */}
                {(displayViewMode === 'card' || isMobile) && (
                  <div className="p-3">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                      {paginatedSessions.map((session) => (
                        <SessionCard
                          key={session.id}
                          session={session}
                          formatDate={formatDate}
                          calculateDuration={calculateDuration}
                          onView={handleView}
                          onEdit={handleEdit}
                          onDelete={handleDeleteClick}
                          isAdmin={isAdmin}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                )}
                
                {/* Showing info */}
                <div className="px-4 py-2 border-t border-gray-100 text-center">
                  <Text variant="caption" className="text-gray-400">
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredSessions.length)} of {filteredSessions.length} sessions
                  </Text>
                </div>
              </>
            )}
          </Card>
        </div>

        {/* Create/Edit Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            resetForm();
          }}
          title={editingSession ? 'Edit Academic Session' : 'Create Academic Session'}
          size="lg"
        >
          <form onSubmit={handleSubmit} className="py-3 space-y-4 max-h-[70vh] overflow-y-auto px-1">
            <div>
              <label className="block text-[10px] font-medium text-gray-500 mb-1">Session Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="e.g., 2024/2025 Academic Session"
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-medium text-gray-500 mb-1">Start Date *</label>
                <input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-medium text-gray-500 mb-1">End Date *</label>
                <input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-[10px] font-medium text-gray-500 mb-1">Status *</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm"
                required
              >
                {statusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>
            
            <div className="flex items-center">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.is_current}
                  onChange={(e) => setFormData({...formData, is_current: e.target.checked})}
                  className="w-3 h-3 rounded border-gray-300"
                />
                <span className="text-[10px] text-gray-700">Set as current session</span>
              </label>
            </div>
            
            <div>
              <label className="block text-[10px] font-medium text-gray-500 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm"
                placeholder="Optional description about this academic session..."
              />
            </div>
            
            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={() => { setIsModalOpen(false); resetForm(); }} className="flex-1">
                Cancel
              </Button>
              <Button variant="primary" type="submit" className="flex-1">
                {editingSession ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </Modal>

        {/* View Details Modal */}
        <Modal
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
            setSelectedSession(null);
          }}
          title="Session Details"
          size="sm"
        >
          {selectedSession && (
            <div className="py-3 space-y-3">
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Calendar size={18} className="text-gray-600" />
                  </div>
                  <div>
                    <Text variant="h4" className="font-bold">{selectedSession.name}</Text>
                    {selectedSession.description && (
                      <Text variant="caption" className="text-gray-500">{selectedSession.description}</Text>
                    )}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <Text variant="caption" className="text-gray-400">Start Date</Text>
                  <Text variant="small" className="font-medium">{formatDate(selectedSession.start_date)}</Text>
                </div>
                <div>
                  <Text variant="caption" className="text-gray-400">End Date</Text>
                  <Text variant="small" className="font-medium">{formatDate(selectedSession.end_date)}</Text>
                </div>
                <div>
                  <Text variant="caption" className="text-gray-400">Duration</Text>
                  <Text variant="small" className="font-medium">{calculateDuration(selectedSession.start_date, selectedSession.end_date)} days</Text>
                </div>
                <div>
                  <Text variant="caption" className="text-gray-400">Status</Text>
                  <StatusBadge status={selectedSession.status} />
                </div>
                <div>
                  <Text variant="caption" className="text-gray-400">Current Session</Text>
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-medium ${selectedSession.is_current ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {selectedSession.is_current ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <Button variant="outline" size="small" onClick={() => { setIsViewModalOpen(false); setSelectedSession(null); }}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSessionToDelete(null);
          }}
          title="Delete Academic Session"
          size="sm"
        >
          {sessionToDelete && (
            <div className="py-4 text-center">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Trash2 size={18} className="text-red-600" />
              </div>
              <Text variant="h4" className="font-semibold mb-1">Delete "{sessionToDelete.name}"?</Text>
              <Text variant="caption" className="text-gray-500 mb-4 block">This action cannot be undone.</Text>
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <Text variant="caption" className="text-gray-600 text-center block">
                  {formatDate(sessionToDelete.start_date)} - {formatDate(sessionToDelete.end_date)}
                </Text>
                <div className="flex justify-center mt-2">
                  <StatusBadge status={sessionToDelete.status} />
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => { setIsDeleteModalOpen(false); setSessionToDelete(null); }} className="flex-1">
                  Cancel
                </Button>
                <Button variant="danger" onClick={handleDelete} className="flex-1">
                  Delete
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default AcademicSessions;