import React, { useState, useEffect, useCallback, useRef } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import Alert from '../../components/common/Alert';
import Modal from '../../components/common/modal';
import { 
  Book, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  RefreshCw,
  Search,
  Filter,
  Percent,
  Award,
  CheckCircle,
  X,
  ChevronLeft,
  ChevronRight,
  Grid3x3,
  Table2
} from 'lucide-react';
import { 
  getSubjects, 
  createSubject, 
  updateSubject, 
  deleteSubject 
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
const StatCard = ({ title, value, icon: Icon, color }) => (
  <Card className="p-3">
    <div className="flex items-center gap-3">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
        <Icon size={14} className="text-gray-600" />
      </div>
      <div className="flex-1 min-w-0">
        <Text variant="caption" className="text-gray-400 uppercase tracking-wide">{title}</Text>
        <Text variant="h4" className="font-bold text-gray-800 leading-tight">{value}</Text>
      </div>
    </div>
  </Card>
);

// Type Badge
const TypeBadge = ({ type }) => {
  const config = {
    core: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Core' },
    elective: { bg: 'bg-green-100', text: 'text-green-700', label: 'Elective' },
    vocational: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Vocational' },
    language: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Language' },
    science: { bg: 'bg-cyan-100', text: 'text-cyan-700', label: 'Science' },
    arts: { bg: 'bg-pink-100', text: 'text-pink-700', label: 'Arts' },
    commercial: { bg: 'bg-indigo-100', text: 'text-indigo-700', label: 'Commercial' },
    technical: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Technical' },
    religious: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Religious' },
    pre_school: { bg: 'bg-rose-100', text: 'text-rose-700', label: 'Pre-School' }
  };
  const c = config[type] || { bg: 'bg-gray-100', text: 'text-gray-600', label: type };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] md:text-[10px] font-medium ${c.bg} ${c.text}`}>
      {c.label}
    </span>
  );
};

// Mobile Filter Sheet
const MobileFilterSheet = ({ isOpen, onClose, searchTerm, setSearchTerm, filterType, setFilterType, filterOptions, onApply, onClear }) => {
  const [localSearch, setLocalSearch] = useState(searchTerm);
  const [localFilter, setLocalFilter] = useState(filterType);
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 transition-opacity" onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 p-5 animate-in slide-in-from-bottom duration-200 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <Text variant="h4" className="font-semibold">Filter Subjects</Text>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100"><X size={18} /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
              <input type="text" value={localSearch} onChange={(e) => setLocalSearch(e.target.value)} placeholder="Search by name or code..." className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Subject Type</label>
            <select value={localFilter} onChange={(e) => setLocalFilter(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]">
              {filterOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="primary" size="medium" onClick={() => { setSearchTerm(localSearch); setFilterType(localFilter); onApply(); onClose(); }} className="flex-1">Apply Filters</Button>
            <button onClick={() => { setLocalSearch(''); setLocalFilter('all'); setSearchTerm(''); setFilterType('all'); onClear(); onClose(); }} className="px-4 py-2 text-red-500 font-medium text-sm">Clear</button>
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

// Subject Card Component (for mobile grid view - 2 per row)
const SubjectCardItem = ({ subject, onView, onEdit, onDelete }) => (
  <Card className="p-3 space-y-2 hover:shadow-md transition-shadow duration-200 h-full">
    <div className="flex justify-between items-start gap-2">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <Book size={14} className="text-gray-500" />
        </div>
        <div className="flex-1 min-w-0">
          <Text variant="tiny" className="font-bold text-gray-800 truncate">{subject.name}</Text>
          <Text variant="caption" className="text-gray-400 font-mono text-[8px] md:text-[9px]">{subject.code}</Text>
        </div>
      </div>
      <span className={`inline-flex px-1.5 py-0.5 rounded-full text-[7px] md:text-[8px] font-medium whitespace-nowrap flex-shrink-0 ${subject.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
        {subject.is_active ? 'Active' : 'Inactive'}
      </span>
    </div>
    <div className="flex items-center gap-1.5 flex-wrap">
      <TypeBadge type={subject.subject_type} />
      <Text variant="caption" className="text-gray-400 flex items-center gap-0.5 text-[8px] md:text-[9px]">
        <Percent size={8} /> CA:{subject.ca_weight}%
      </Text>
    </div>
    <div className="flex justify-end gap-0.5 pt-1">
      <button onClick={() => onView(subject)} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"><Eye size={12} /></button>
      <button onClick={() => onEdit(subject)} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"><Edit size={12} /></button>
      <button onClick={() => onDelete(subject)} className="p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors"><Trash2 size={12} /></button>
    </div>
  </Card>
);

// ============================================
// MAIN COMPONENT
// ============================================
const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [subjectToDelete, setSubjectToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [viewMode, setViewMode] = useState('table');
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const [formData, setFormData] = useState({
    name: '', code: '', short_name: '', subject_type: 'core', stream: 'general',
    is_compulsory: true, is_examinable: true, has_practical: false,
    ca_weight: 40, exam_weight: 60, total_marks: 100, pass_mark: 40,
    available_for_creche: false, available_for_nursery: false, available_for_primary: false,
    available_for_jss: false, available_for_sss: false, is_active: true, description: ''
  });

  const subjectTypeOptions = [
    { value: 'core', label: 'Core Subject' }, { value: 'elective', label: 'Elective Subject' },
    { value: 'vocational', label: 'Vocational' }, { value: 'religious', label: 'Religious Studies' },
    { value: 'language', label: 'Language' }, { value: 'science', label: 'Science' },
    { value: 'arts', label: 'Arts' }, { value: 'commercial', label: 'Commercial' },
    { value: 'technical', label: 'Technical' }, { value: 'pre_school', label: 'Pre-School' }
  ];

  const streamOptions = [
    { value: 'science', label: 'Science' }, { value: 'commercial', label: 'Commercial' },
    { value: 'arts', label: 'Arts' }, { value: 'general', label: 'General' },
    { value: 'technical', label: 'Technical' }, { value: 'pre_school', label: 'Pre-School' }
  ];

  const filterOptions = [
    { value: 'all', label: 'All Types' }, { value: 'core', label: 'Core' },
    { value: 'elective', label: 'Elective' }, { value: 'vocational', label: 'Vocational' },
    { value: 'language', label: 'Language' }, { value: 'science', label: 'Science' },
    { value: 'arts', label: 'Arts' }, { value: 'commercial', label: 'Commercial' },
    { value: 'technical', label: 'Technical' }, { value: 'religious', label: 'Religious' },
    { value: 'pre_school', label: 'Pre-School' }
  ];

  // Fetch subjects from database
  const fetchSubjects = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getSubjects();
      console.log('📚 Subjects fetched:', response);
      const subjectsData = response.results || response || [];
      setSubjects(subjectsData);
      setCurrentPage(1);
    } catch (err) {
      console.error('❌ Error fetching subjects:', err);
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      if (editingSubject) {
        await updateSubject(editingSubject.id, formData);
        setSuccess('Subject updated successfully');
      } else {
        await createSubject(formData);
        setSuccess('Subject created successfully');
      }
      setIsModalOpen(false);
      resetForm();
      fetchSubjects();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('❌ Error saving subject:', err);
      setError(handleApiError(err));
    }
  };

  const handleEdit = (subject) => {
    setEditingSubject(subject);
    setFormData({
      name: subject.name || '', code: subject.code || '', short_name: subject.short_name || '',
      subject_type: subject.subject_type || 'core', stream: subject.stream || 'general',
      is_compulsory: subject.is_compulsory ?? true, is_examinable: subject.is_examinable ?? true,
      has_practical: subject.has_practical ?? false, ca_weight: subject.ca_weight || 40,
      exam_weight: subject.exam_weight || 60, total_marks: subject.total_marks || 100,
      pass_mark: subject.pass_mark || 40, available_for_creche: subject.available_for_creche || false,
      available_for_nursery: subject.available_for_nursery || false, available_for_primary: subject.available_for_primary || false,
      available_for_jss: subject.available_for_jss || false, available_for_sss: subject.available_for_sss || false,
      is_active: subject.is_active ?? true, description: subject.description || ''
    });
    setIsModalOpen(true);
  };

  const handleView = (subject) => {
    setSelectedSubject(subject);
    setIsViewModalOpen(true);
  };

  const handleDeleteClick = (subject) => {
    setSubjectToDelete(subject);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!subjectToDelete) return;
    try {
      await deleteSubject(subjectToDelete.id);
      setSuccess('Subject deleted successfully');
      fetchSubjects();
      setIsDeleteModalOpen(false);
      setSubjectToDelete(null);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('❌ Error deleting subject:', err);
      setError(handleApiError(err));
      setIsDeleteModalOpen(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '', code: '', short_name: '', subject_type: 'core', stream: 'general',
      is_compulsory: true, is_examinable: true, has_practical: false,
      ca_weight: 40, exam_weight: 60, total_marks: 100, pass_mark: 40,
      available_for_creche: false, available_for_nursery: false, available_for_primary: false,
      available_for_jss: false, available_for_sss: false, is_active: true, description: ''
    });
    setEditingSubject(null);
    setError('');
  };

  const getAvailabilityLabels = (subject) => {
    const labels = [];
    if (subject.available_for_creche) labels.push('Creche');
    if (subject.available_for_nursery) labels.push('Nursery');
    if (subject.available_for_primary) labels.push('Primary');
    if (subject.available_for_jss) labels.push('JSS');
    if (subject.available_for_sss) labels.push('SSS');
    return labels.length > 0 ? labels.slice(0, 2).join(', ') + (labels.length > 2 ? ` +${labels.length - 2}` : '') : 'None';
  };

  const filteredSubjects = subjects.filter(subject => {
    const searchString = searchTerm.toLowerCase();
    const matchesSearch = (subject.name?.toLowerCase().includes(searchString)) ||
      (subject.code?.toLowerCase().includes(searchString)) ||
      (subject.short_name?.toLowerCase().includes(searchString));
    const matchesFilter = filterType === 'all' || subject.subject_type === filterType;
    return matchesSearch && matchesFilter;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredSubjects.length / itemsPerPage);
  const paginatedSubjects = filteredSubjects.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const stats = {
    total: subjects.length,
    active: subjects.filter(s => s.is_active).length,
    core: subjects.filter(s => s.subject_type === 'core').length,
    avgPassMark: subjects.length > 0 ? Math.round(subjects.reduce((sum, s) => sum + (s.pass_mark || 0), 0) / subjects.length) : 0
  };

  const hasActiveFilters = searchTerm || filterType !== 'all';

  // Detect mobile screen
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const displayViewMode = isMobile ? 'card' : viewMode;

  if (loading && subjects.length === 0) {
    return (
      <DashboardLayout title="Subjects">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <RefreshCw className="animate-spin h-8 w-8 text-[#D94801] mx-auto mb-4" />
            <Text variant="body" className="text-gray-400">Loading subjects from database...</Text>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Subjects">
      {/* Fixed height container with internal scrolling - only table/card scrolls */}
      <div className="h-[calc(100vh-120px)] flex flex-col px-3 sm:px-4 lg:px-6">
        
        {/* STICKY HEADER SECTION - Everything above the table/card stays fixed */}
        <div className="sticky top-0 z-20 bg-gray-50 -mx-3 sm:-mx-4 lg:-mx-6 px-3 sm:px-4 lg:px-6 pt-4 pb-2">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#1D2B49] rounded-xl flex items-center justify-center shadow-sm">
                  <Book size={14} className="text-white" />
                </div>
                <Text variant="h2" className="font-bold">Subjects</Text>
              </div>
              <Text variant="caption" className="text-gray-400 pl-9">
                Manage school subjects curriculum • {subjects.length} total subjects
              </Text>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="small" icon={RefreshCw} onClick={fetchSubjects} loading={loading}>
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
            <StatCard title="Total" value={stats.total} icon={Book} color="bg-gray-100" />
            <StatCard title="Active" value={stats.active} icon={CheckCircle} color="bg-green-100" />
            <StatCard title="Core" value={stats.core} icon={Award} color="bg-blue-100" />
            <StatCard title="Avg Pass" value={`${stats.avgPassMark}%`} icon={Percent} color="bg-purple-100" />
          </div>

          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-2 mb-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                placeholder="Search subjects by name or code..."
                className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801] focus:border-transparent"
              />
            </div>
            
            {/* Desktop filters */}
            <div className="hidden sm:flex items-center gap-2">
              <select
                value={filterType}
                onChange={(e) => { setFilterType(e.target.value); setCurrentPage(1); }}
                className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
              >
                {filterOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
              {hasActiveFilters && (
                <Button variant="ghost" size="tiny" onClick={() => { setSearchTerm(''); setFilterType('all'); }}>
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
            filterType={filterType}
            setFilterType={(val) => { setFilterType(val); setCurrentPage(1); }}
            filterOptions={filterOptions}
            onApply={fetchSubjects}
            onClear={() => { setSearchTerm(''); setFilterType('all'); fetchSubjects(); }}
          />
        </div>

        {/* SCROLLABLE CONTENT SECTION - Only table/card scrolls here */}
        <div className="flex-1 overflow-y-auto min-h-0 -mx-3 sm:-mx-4 lg:-mx-6 px-3 sm:px-4 lg:px-6 pb-4">
          <Card className="overflow-hidden">
            {paginatedSubjects.length === 0 ? (
              <div className="p-8 text-center">
                <Book size={32} className="mx-auto text-gray-200 mb-2" />
                <Text variant="body" className="text-gray-400">No subjects found</Text>
                {hasActiveFilters ? (
                  <Button variant="outline" size="small" className="mt-3" onClick={() => { setSearchTerm(''); setFilterType('all'); }}>
                    Clear Filters
                  </Button>
                ) : (
                  <Button variant="primary" size="small" className="mt-3" onClick={() => { resetForm(); setIsModalOpen(true); }}>
                    Create your first subject
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
                          <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Subject</th>
                          <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Type</th>
                          <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Assessment</th>
                          <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Levels</th>
                          <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-4 py-3 text-right text-[10px] font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {paginatedSubjects.map((subject) => (
                          <tr key={subject.id} className="hover:bg-gray-50 transition-colors duration-150">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                                  <Book size={14} className="text-gray-500" />
                                </div>
                                <div>
                                  <Text variant="small" className="font-medium text-gray-800">{subject.name}</Text>
                                  <Text variant="caption" className="text-gray-400 font-mono">{subject.code}</Text>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 hidden sm:table-cell">
                              <TypeBadge type={subject.subject_type} />
                            </td>
                            <td className="px-4 py-3">
                              <Text variant="caption" className="text-gray-600 flex items-center gap-1">
                                <Percent size={10} /> CA:{subject.ca_weight}% | Pass:{subject.pass_mark}
                              </Text>
                            </td>
                            <td className="px-4 py-3 hidden lg:table-cell">
                              <Text variant="caption" className="text-gray-500">{getAvailabilityLabels(subject)}</Text>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-medium ${subject.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                {subject.is_active ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button onClick={() => handleView(subject)} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg transition-colors">
                                  <Eye size={14} />
                                </button>
                                <button onClick={() => handleEdit(subject)} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg transition-colors">
                                  <Edit size={14} />
                                </button>
                                <button onClick={() => handleDeleteClick(subject)} className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg transition-colors">
                                  <Trash2 size={14} />
                                </button>
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
                    {/* Mobile: 2 columns, Tablet: 3 columns, Desktop: 4 columns */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                      {paginatedSubjects.map((subject) => (
                        <SubjectCardItem
                          key={subject.id}
                          subject={subject}
                          onView={handleView}
                          onEdit={handleEdit}
                          onDelete={handleDeleteClick}
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
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredSubjects.length)} of {filteredSubjects.length} subjects
                  </Text>
                </div>
              </>
            )}
          </Card>
        </div>

        {/* Modals remain outside the scrollable area */}
        <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); resetForm(); }} title={editingSubject ? 'Edit Subject' : 'New Subject'} size="lg">
          <form onSubmit={handleSubmit} className="py-3 space-y-4 max-h-[70vh] overflow-y-auto px-1">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-medium text-gray-500 mb-1">Subject Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g., Mathematics"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-medium text-gray-500 mb-1">Code *</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({...formData, code: e.target.value})}
                  placeholder="e.g., MAT"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-[10px] font-medium text-gray-500 mb-1">Short Name</label>
              <input
                type="text"
                value={formData.short_name}
                onChange={(e) => setFormData({...formData, short_name: e.target.value})}
                placeholder="e.g., Maths"
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-medium text-gray-500 mb-1">Subject Type</label>
                <select
                  value={formData.subject_type}
                  onChange={(e) => setFormData({...formData, subject_type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm"
                >
                  {subjectTypeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-medium text-gray-500 mb-1">Stream</label>
                <select
                  value={formData.stream}
                  onChange={(e) => setFormData({...formData, stream: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm"
                >
                  {streamOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] font-medium text-gray-500 mb-1">CA Weight %</label>
                <input
                  type="number"
                  value={formData.ca_weight}
                  onChange={(e) => setFormData({...formData, ca_weight: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-[10px] font-medium text-gray-500 mb-1">Exam Weight %</label>
                <input
                  type="number"
                  value={formData.exam_weight}
                  onChange={(e) => setFormData({...formData, exam_weight: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-[10px] font-medium text-gray-500 mb-1">Pass Mark</label>
                <input
                  type="number"
                  value={formData.pass_mark}
                  onChange={(e) => setFormData({...formData, pass_mark: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-[10px] font-medium text-gray-500 mb-1">Availability</label>
              <div className="flex flex-wrap gap-3">
                <label className="flex items-center gap-1">
                  <input type="checkbox" checked={formData.available_for_creche} onChange={(e) => setFormData({...formData, available_for_creche: e.target.checked})} className="w-3 h-3" />
                  <span className="text-[10px]">Creche</span>
                </label>
                <label className="flex items-center gap-1">
                  <input type="checkbox" checked={formData.available_for_nursery} onChange={(e) => setFormData({...formData, available_for_nursery: e.target.checked})} className="w-3 h-3" />
                  <span className="text-[10px]">Nursery</span>
                </label>
                <label className="flex items-center gap-1">
                  <input type="checkbox" checked={formData.available_for_primary} onChange={(e) => setFormData({...formData, available_for_primary: e.target.checked})} className="w-3 h-3" />
                  <span className="text-[10px]">Primary</span>
                </label>
                <label className="flex items-center gap-1">
                  <input type="checkbox" checked={formData.available_for_jss} onChange={(e) => setFormData({...formData, available_for_jss: e.target.checked})} className="w-3 h-3" />
                  <span className="text-[10px]">JSS</span>
                </label>
                <label className="flex items-center gap-1">
                  <input type="checkbox" checked={formData.available_for_sss} onChange={(e) => setFormData({...formData, available_for_sss: e.target.checked})} className="w-3 h-3" />
                  <span className="text-[10px]">SSS</span>
                </label>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <label className="flex items-center gap-1">
                <input type="checkbox" checked={formData.is_compulsory} onChange={(e) => setFormData({...formData, is_compulsory: e.target.checked})} className="w-3 h-3" />
                <span className="text-[10px]">Compulsory</span>
              </label>
              <label className="flex items-center gap-1">
                <input type="checkbox" checked={formData.is_examinable} onChange={(e) => setFormData({...formData, is_examinable: e.target.checked})} className="w-3 h-3" />
                <span className="text-[10px]">Examinable</span>
              </label>
              <label className="flex items-center gap-1">
                <input type="checkbox" checked={formData.has_practical} onChange={(e) => setFormData({...formData, has_practical: e.target.checked})} className="w-3 h-3" />
                <span className="text-[10px]">Has Practical</span>
              </label>
              <label className="flex items-center gap-1">
                <input type="checkbox" checked={formData.is_active} onChange={(e) => setFormData({...formData, is_active: e.target.checked})} className="w-3 h-3" />
                <span className="text-[10px]">Active</span>
              </label>
            </div>
            
            <div>
              <label className="block text-[10px] font-medium text-gray-500 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={2}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm"
                placeholder="Optional..."
              />
            </div>
            
            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={() => { setIsModalOpen(false); resetForm(); }} className="flex-1">
                Cancel
              </Button>
              <Button variant="primary" type="submit" className="flex-1">
                {editingSubject ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </Modal>

        {/* View Modal */}
        <Modal isOpen={isViewModalOpen} onClose={() => { setIsViewModalOpen(false); setSelectedSubject(null); }} title="Subject Details" size="sm">
          {selectedSubject && (
            <div className="py-3 space-y-3">
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Book size={18} className="text-gray-500" />
                  </div>
                  <div>
                    <Text variant="h4" className="font-bold">{selectedSubject.name}</Text>
                    <Text variant="caption" className="text-gray-400 font-mono">{selectedSubject.code}</Text>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <Text variant="caption" className="text-gray-400">Type</Text>
                  <TypeBadge type={selectedSubject.subject_type} />
                </div>
                <div>
                  <Text variant="caption" className="text-gray-400">Stream</Text>
                  <Text variant="small" className="font-medium">{selectedSubject.stream}</Text>
                </div>
                <div>
                  <Text variant="caption" className="text-gray-400">CA/Exam</Text>
                  <Text variant="small" className="font-medium">{selectedSubject.ca_weight}% / {selectedSubject.exam_weight}%</Text>
                </div>
                <div>
                  <Text variant="caption" className="text-gray-400">Pass Mark</Text>
                  <Text variant="small" className="font-medium">{selectedSubject.pass_mark}/{selectedSubject.total_marks}</Text>
                </div>
                <div>
                  <Text variant="caption" className="text-gray-400">Status</Text>
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-medium ${selectedSubject.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {selectedSubject.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div>
                  <Text variant="caption" className="text-gray-400">Compulsory</Text>
                  <Text variant="small" className="font-medium">{selectedSubject.is_compulsory ? 'Yes' : 'No'}</Text>
                </div>
              </div>
              {selectedSubject.description && (
                <div className="bg-gray-50 p-2 rounded">
                  <Text variant="caption" className="text-gray-500">{selectedSubject.description}</Text>
                </div>
              )}
              <div className="flex justify-end pt-2">
                <Button variant="outline" size="small" onClick={() => { setIsViewModalOpen(false); setSelectedSubject(null); }}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </Modal>

        {/* Delete Modal */}
        <Modal isOpen={isDeleteModalOpen} onClose={() => { setIsDeleteModalOpen(false); setSubjectToDelete(null); }} title="Delete Subject" size="sm">
          {subjectToDelete && (
            <div className="py-4 text-center">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Trash2 size={18} className="text-red-600" />
              </div>
              <Text variant="h4" className="font-semibold mb-1">Delete "{subjectToDelete.name}"?</Text>
              <Text variant="caption" className="text-gray-500 mb-4 block">This action cannot be undone.</Text>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => { setIsDeleteModalOpen(false); setSubjectToDelete(null); }} className="flex-1">
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

export default Subjects;