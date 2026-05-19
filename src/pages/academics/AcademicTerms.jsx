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
  CheckCircle,
  Clock,
  CalendarDays,
  Hash,
  BookOpen,
  X,
  AlertCircle
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import { 
  getAcademicTerms, 
  createAcademicTerm, 
  updateAcademicTerm, 
  deleteAcademicTerm,
  getAcademicSessions
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
    completed: { bg: 'bg-gray-100', text: 'text-gray-600', icon: CheckCircle, label: 'Completed' }
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
const MobileFilterSheet = ({ isOpen, onClose, searchTerm, setSearchTerm, filterStatus, setFilterStatus, filterOptions, onApply, onClear }) => {
  const [localSearch, setLocalSearch] = useState(searchTerm);
  const [localFilter, setLocalFilter] = useState(filterStatus);
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 transition-opacity" onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 p-5 animate-in slide-in-from-bottom duration-200 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <Text variant="h4" className="font-semibold">Filter Terms</Text>
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
            <Button variant="primary" size="medium" onClick={() => { setSearchTerm(localSearch); setFilterStatus(localFilter); onApply(); onClose(); }} className="flex-1">Apply Filters</Button>
            <button onClick={() => { setLocalSearch(''); setLocalFilter('all'); setSearchTerm(''); setFilterStatus('all'); onClear(); onClose(); }} className="px-4 py-2 text-red-500 font-medium text-sm">Clear</button>
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

// Term Card Component (for mobile grid view)
const TermCard = ({ term, formatDate, getTermLabel, onView, onEdit, onDelete, isAdmin }) => (
  <Card className="p-3 space-y-2 hover:shadow-md transition-shadow duration-200 h-full">
    <div className="flex justify-between items-start gap-2">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <CalendarDays size={14} className="text-gray-600" />
        </div>
        <div className="flex-1 min-w-0">
          <Text variant="tiny" className="font-bold text-gray-800 truncate">{term.name || 'Unnamed Term'}</Text>
          <Text variant="caption" className="text-gray-400 font-mono text-[8px] md:text-[9px]">{getTermLabel(term.term)}</Text>
        </div>
      </div>
      <StatusBadge status={term.status} />
    </div>
    <div>
      <Text variant="caption" className="text-gray-500 text-[8px] md:text-[9px] truncate">
        {term.session?.name || 'No Session'}
      </Text>
    </div>
    <div>
      <Text variant="caption" className="text-gray-400 flex items-center gap-1 text-[8px] md:text-[9px]">
        <Calendar size={8} /> {formatDate(term.start_date)} - {formatDate(term.end_date)}
      </Text>
    </div>
    {term.is_current && (
      <span className="inline-flex px-1.5 py-0.5 rounded-full text-[7px] font-medium bg-blue-100 text-blue-700">
        Current Term
      </span>
    )}
    <div className="flex justify-end gap-0.5 pt-1">
      <button onClick={() => onView(term)} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"><Eye size={12} /></button>
      {isAdmin && (
        <>
          <button onClick={() => onEdit(term)} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"><Edit size={12} /></button>
          <button onClick={() => onDelete(term)} className="p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors"><Trash2 size={12} /></button>
        </>
      )}
    </div>
  </Card>
);

// ============================================
// MAIN COMPONENT
// ============================================
const AcademicTerms = () => {
  const { user, isAdmin } = useAuth();
  const [terms, setTerms] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingTerm, setEditingTerm] = useState(null);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [termToDelete, setTermToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [viewMode, setViewMode] = useState('table');
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const [formData, setFormData] = useState({
    session: '',
    term: 'first',
    name: '',
    start_date: '',
    end_date: '',
    is_current: false,
    status: 'upcoming'
  });

  const termOptions = [
    { value: 'first', label: 'First Term' },
    { value: 'second', label: 'Second Term' },
    { value: 'third', label: 'Third Term' }
  ];

  const statusOptions = [
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' }
  ];

  const filterOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'completed', label: 'Completed' }
  ];

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [termsData, sessionsData] = await Promise.all([
        getAcademicTerms(),
        getAcademicSessions()
      ]);
      
      setTerms(termsData.results || termsData || []);
      setSessions(sessionsData.results || sessionsData || []);
      setCurrentPage(1);
    } catch (err) {
      console.error('❌ Error fetching academic terms:', err);
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      
      const submitData = { ...formData };
      if (!submitData.name.trim()) {
        const selectedSession = sessions.find(s => s.id === parseInt(submitData.session));
        const termLabel = termOptions.find(t => t.value === submitData.term)?.label || submitData.term;
        submitData.name = `${termLabel} ${selectedSession?.name || ''}`.trim();
      }
      
      if (editingTerm) {
        await updateAcademicTerm(editingTerm.id, submitData);
        setSuccess('Term updated successfully');
      } else {
        await createAcademicTerm(submitData);
        setSuccess('Term created successfully');
      }
      
      setIsModalOpen(false);
      resetForm();
      fetchData();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('❌ Error saving term:', err);
      setError(handleApiError(err));
    }
  };

  const handleEdit = (term) => {
    setEditingTerm(term);
    setFormData({
      session: term.session?.id || term.session || '',
      term: term.term || 'first',
      name: term.name || '',
      start_date: term.start_date || '',
      end_date: term.end_date || '',
      is_current: term.is_current || false,
      status: term.status || 'upcoming'
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (term) => {
    setTermToDelete(term);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      await deleteAcademicTerm(termToDelete.id);
      setSuccess('Term deleted successfully');
      fetchData();
      setIsDeleteModalOpen(false);
      setTermToDelete(null);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('❌ Error deleting term:', err);
      setError(handleApiError(err));
      setIsDeleteModalOpen(false);
    }
  };

  const handleView = (term) => {
    setSelectedTerm(term);
    setIsViewModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      session: '',
      term: 'first',
      name: '',
      start_date: '',
      end_date: '',
      is_current: false,
      status: 'upcoming'
    });
    setEditingTerm(null);
    setError('');
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return '-';
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} days`;
  };

  const getTermLabel = (termValue) => {
    if (!termValue) return '-';
    const termMap = {
      'first': 'First Term',
      'second': 'Second Term',
      'third': 'Third Term'
    };
    return termMap[termValue] || termValue;
  };

  const filteredTerms = terms.filter(term => {
    const searchString = searchTerm.toLowerCase();
    const matchesSearch = (
      (term.name && term.name.toLowerCase().includes(searchString)) ||
      (term.status && term.status.toLowerCase().includes(searchString)) ||
      (term.term && term.term.toLowerCase().includes(searchString)) ||
      (term.session?.name && term.session.name.toLowerCase().includes(searchString))
    );
    
    const matchesFilter = filterStatus === 'all' || term.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredTerms.length / itemsPerPage);
  const paginatedTerms = filteredTerms.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const stats = {
    total: terms.length,
    active: terms.filter(t => t.status === 'active').length,
    current: terms.find(t => t.is_current)?.name || 'None',
    firstTerm: terms.filter(t => t.term === 'first').length,
    secondTerm: terms.filter(t => t.term === 'second').length,
    thirdTerm: terms.filter(t => t.term === 'third').length
  };

  const hasActiveFilters = searchTerm || filterStatus !== 'all';

  // Detect mobile screen
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const displayViewMode = isMobile ? 'card' : viewMode;

  if (loading && terms.length === 0) {
    return (
      <DashboardLayout title="Academic Terms">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <RefreshCw className="animate-spin h-8 w-8 text-[#D94801] mx-auto mb-4" />
            <Text variant="body" className="text-gray-400">Loading academic terms from database...</Text>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Academic Terms">
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
                <Text variant="h2" className="font-bold">Academic Terms</Text>
              </div>
              <Text variant="caption" className="text-gray-400 pl-9">
                Manage school academic terms and schedules • {terms.length} total terms
              </Text>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="small" icon={RefreshCw} onClick={fetchData} loading={loading}>
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
            <StatCard title="Total Terms" value={stats.total} icon={Calendar} color="bg-gray-100" />
            <StatCard title="Active Terms" value={stats.active} icon={CheckCircle} color="bg-green-100" />
            <StatCard title="Current Term" value={stats.current} icon={CalendarDays} color="bg-blue-100" detail="Active term" />
            <StatCard title="Term Breakdown" value={`${stats.firstTerm}/${stats.secondTerm}/${stats.thirdTerm}`} icon={Hash} color="bg-purple-100" detail="1st/2nd/3rd Terms" />
          </div>

          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-2 mb-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                placeholder="Search terms by name or status..."
                className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801] focus:border-transparent"
              />
            </div>
            
            {/* Desktop filters */}
            <div className="hidden sm:flex items-center gap-2">
              <select
                value={filterStatus}
                onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
                className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
              >
                {filterOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
              {hasActiveFilters && (
                <Button variant="ghost" size="tiny" onClick={() => { setSearchTerm(''); setFilterStatus('all'); }}>
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
            filterStatus={filterStatus}
            setFilterStatus={(val) => { setFilterStatus(val); setCurrentPage(1); }}
            filterOptions={filterOptions}
            onApply={fetchData}
            onClear={() => { setSearchTerm(''); setFilterStatus('all'); fetchData(); }}
          />
        </div>

        {/* SCROLLABLE CONTENT SECTION - Only table/card scrolls here */}
        <div className="flex-1 overflow-y-auto min-h-0 -mx-3 sm:-mx-4 lg:-mx-6 px-3 sm:px-4 lg:px-6 pb-4">
          <Card className="overflow-hidden">
            {paginatedTerms.length === 0 ? (
              <div className="p-8 text-center">
                <Calendar size={32} className="mx-auto text-gray-200 mb-2" />
                <Text variant="body" className="text-gray-400">No academic terms found</Text>
                {hasActiveFilters ? (
                  <Button variant="outline" size="small" className="mt-3" onClick={() => { setSearchTerm(''); setFilterStatus('all'); }}>
                    Clear Filters
                  </Button>
                ) : (
                  <Button variant="primary" size="small" className="mt-3" onClick={() => { resetForm(); setIsModalOpen(true); }}>
                    Create your first term
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
                          <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Term Details</th>
                          <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">Session</th>
                          <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Schedule</th>
                          <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-4 py-3 text-right text-[10px] font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {paginatedTerms.map((term) => (
                          <tr key={term.id} className="hover:bg-gray-50 transition-colors duration-150">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                                  <CalendarDays size={14} className="text-gray-600" />
                                </div>
                                <div>
                                  <Text variant="small" className="font-medium text-gray-800">{term.name || 'Unnamed Term'}</Text>
                                  <div className="flex items-center gap-2">
                                    <Text variant="caption" className="text-gray-400">{getTermLabel(term.term)}</Text>
                                    {term.is_current && (
                                      <span className="inline-flex px-1.5 py-0.5 rounded-full text-[8px] font-medium bg-blue-100 text-blue-700">
                                        Current
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 hidden md:table-cell">
                              <Text variant="caption" className="text-gray-600">{term.session?.name || 'No Session'}</Text>
                            </td>
                            <td className="px-4 py-3">
                              <Text variant="caption" className="text-gray-600">
                                {formatDate(term.start_date)} - {formatDate(term.end_date)}
                              </Text>
                              <Text variant="tiny" className="text-gray-400">{calculateDuration(term.start_date, term.end_date)}</Text>
                            </td>
                            <td className="px-4 py-3">
                              <StatusBadge status={term.status} />
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button onClick={() => handleView(term)} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg transition-colors">
                                  <Eye size={14} />
                                </button>
                                {isAdmin && (
                                  <>
                                    <button onClick={() => handleEdit(term)} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg transition-colors">
                                      <Edit size={14} />
                                    </button>
                                    <button onClick={() => handleDeleteClick(term)} className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg transition-colors">
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
                      {paginatedTerms.map((term) => (
                        <TermCard
                          key={term.id}
                          term={term}
                          formatDate={formatDate}
                          getTermLabel={getTermLabel}
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
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredTerms.length)} of {filteredTerms.length} terms
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
          title={editingTerm ? 'Edit Academic Term' : 'Create Academic Term'}
          size="lg"
        >
          <form onSubmit={handleSubmit} className="py-3 space-y-4 max-h-[70vh] overflow-y-auto px-1">
            <div>
              <label className="block text-[10px] font-medium text-gray-500 mb-1">Academic Session *</label>
              <select
                value={formData.session}
                onChange={(e) => setFormData({...formData, session: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
                required
              >
                <option value="">Select session</option>
                {sessions.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-[10px] font-medium text-gray-500 mb-1">Term *</label>
              <select
                value={formData.term}
                onChange={(e) => setFormData({...formData, term: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
                required
              >
                {termOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>
            
            <div>
              <label className="block text-[10px] font-medium text-gray-500 mb-1">Term Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="e.g., First Term 2024/2025"
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm"
              />
              <p className="mt-1 text-[8px] text-gray-500">Will be auto-generated from session and term if left empty</p>
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
                <span className="text-[10px] text-gray-700">Set as current term</span>
              </label>
            </div>
            
            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={() => { setIsModalOpen(false); resetForm(); }} className="flex-1">
                Cancel
              </Button>
              <Button variant="primary" type="submit" className="flex-1">
                {editingTerm ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </Modal>

        {/* View Details Modal */}
        <Modal
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
            setSelectedTerm(null);
          }}
          title="Term Details"
          size="sm"
        >
          {selectedTerm && (
            <div className="py-3 space-y-3">
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <CalendarDays size={18} className="text-gray-600" />
                  </div>
                  <div>
                    <Text variant="h4" className="font-bold">{selectedTerm.name || 'Unnamed Term'}</Text>
                    <Text variant="caption" className="text-gray-400">{getTermLabel(selectedTerm.term)}</Text>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <Text variant="caption" className="text-gray-400">Academic Session</Text>
                  <Text variant="small" className="font-medium">{selectedTerm.session?.name || 'No Session'}</Text>
                </div>
                <div>
                  <Text variant="caption" className="text-gray-400">Status</Text>
                  <StatusBadge status={selectedTerm.status} />
                </div>
                <div>
                  <Text variant="caption" className="text-gray-400">Start Date</Text>
                  <Text variant="small" className="font-medium">{formatDate(selectedTerm.start_date)}</Text>
                </div>
                <div>
                  <Text variant="caption" className="text-gray-400">End Date</Text>
                  <Text variant="small" className="font-medium">{formatDate(selectedTerm.end_date)}</Text>
                </div>
                <div>
                  <Text variant="caption" className="text-gray-400">Duration</Text>
                  <Text variant="small" className="font-medium">{calculateDuration(selectedTerm.start_date, selectedTerm.end_date)}</Text>
                </div>
                <div>
                  <Text variant="caption" className="text-gray-400">Current Term</Text>
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-medium ${selectedTerm.is_current ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                    {selectedTerm.is_current ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <Button variant="outline" size="small" onClick={() => { setIsViewModalOpen(false); setSelectedTerm(null); }}>
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
            setTermToDelete(null);
          }}
          title="Delete Academic Term"
          size="sm"
        >
          {termToDelete && (
            <div className="py-4 text-center">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Trash2 size={18} className="text-red-600" />
              </div>
              <Text variant="h4" className="font-semibold mb-1">Delete "{termToDelete.name || 'Unnamed Term'}"?</Text>
              <Text variant="caption" className="text-gray-500 mb-4 block">This action cannot be undone.</Text>
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <CalendarDays size={14} className="text-gray-500" />
                  <Text variant="caption" className="font-medium">{getTermLabel(termToDelete.term)}</Text>
                </div>
                <Text variant="caption" className="text-gray-600 text-center block">
                  {termToDelete.session?.name || 'No Session'}
                </Text>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => { setIsDeleteModalOpen(false); setTermToDelete(null); }} className="flex-1">
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

export default AcademicTerms;