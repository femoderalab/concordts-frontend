import React, { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import Alert from '../../components/common/Alert';
import Modal from '../../components/common/modal';
import { 
  School, 
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
  Clock,
  Hash,
  CheckCircle,
  Baby,
  GraduationCap,
  X
} from 'lucide-react';
import { 
  getPrograms, 
  createProgram, 
  updateProgram, 
  deleteProgram 
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

// Program Type Badge
const ProgramTypeBadge = ({ type }) => {
  const config = {
    creche: { bg: 'bg-rose-100', text: 'text-rose-700', icon: Baby, label: 'Creche' },
    nursery: { bg: 'bg-purple-100', text: 'text-purple-700', icon: Baby, label: 'Nursery' },
    primary: { bg: 'bg-blue-100', text: 'text-blue-700', icon: School, label: 'Primary' },
    junior_secondary: { bg: 'bg-cyan-100', text: 'text-cyan-700', icon: GraduationCap, label: 'JSS' },
    senior_secondary: { bg: 'bg-green-100', text: 'text-green-700', icon: GraduationCap, label: 'SSS' }
  };
  const c = config[type] || config.primary;
  const Icon = c.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] md:text-[10px] font-medium ${c.bg} ${c.text}`}>
      <Icon size={10} /> {c.label}
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
          <Text variant="h4" className="font-semibold">Filter Programs</Text>
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
            <label className="block text-xs font-medium text-gray-500 mb-1">Program Type</label>
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

// Program Card Component (for mobile grid view)
const ProgramCard = ({ program, getProgramTypeLabel, onView, onEdit, onDelete }) => (
  <Card className="p-3 space-y-2 hover:shadow-md transition-shadow duration-200 h-full">
    <div className="flex justify-between items-start gap-2">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <School size={14} className="text-gray-600" />
        </div>
        <div className="flex-1 min-w-0">
          <Text variant="tiny" className="font-bold text-gray-800 truncate">{program.name}</Text>
          <Text variant="caption" className="text-gray-400 font-mono text-[8px] md:text-[9px]">{program.code}</Text>
        </div>
      </div>
      <span className={`inline-flex px-1.5 py-0.5 rounded-full text-[7px] md:text-[8px] font-medium whitespace-nowrap flex-shrink-0 ${program.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
        {program.is_active ? 'Active' : 'Inactive'}
      </span>
    </div>
    <div className="flex items-center gap-1.5 flex-wrap">
      <ProgramTypeBadge type={program.program_type} />
      <Text variant="caption" className="text-gray-400 flex items-center gap-0.5 text-[8px] md:text-[9px]">
        <Clock size={8} /> {program.duration_years} yrs
      </Text>
    </div>
    {program.description && (
      <Text variant="tiny" className="text-gray-500 line-clamp-2">{program.description}</Text>
    )}
    <div className="flex justify-end gap-0.5 pt-1">
      <button onClick={() => onView(program)} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"><Eye size={12} /></button>
      <button onClick={() => onEdit(program)} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"><Edit size={12} /></button>
      <button onClick={() => onDelete(program)} className="p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors"><Trash2 size={12} /></button>
    </div>
  </Card>
);

// ============================================
// MAIN COMPONENT
// ============================================
const Programs = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [programToDelete, setProgramToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [viewMode, setViewMode] = useState('table');
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const [formData, setFormData] = useState({
    name: '',
    program_type: 'primary',
    code: '',
    description: '',
    duration_years: 6,
    is_active: true
  });

  const programTypeOptions = [
    { value: 'creche', label: 'Creche' },
    { value: 'nursery', label: 'Nursery' },
    { value: 'primary', label: 'Primary School' },
    { value: 'junior_secondary', label: 'Junior Secondary School (JSS)' },
    { value: 'senior_secondary', label: 'Senior Secondary School (SSS)' }
  ];

  const filterOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'creche', label: 'Creche' },
    { value: 'nursery', label: 'Nursery' },
    { value: 'primary', label: 'Primary' },
    { value: 'junior_secondary', label: 'JSS' },
    { value: 'senior_secondary', label: 'SSS' }
  ];

  const fetchPrograms = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getPrograms();
      setPrograms(response.results || response || []);
      setCurrentPage(1);
    } catch (err) {
      console.error('❌ Error fetching programs:', err);
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      
      if (editingProgram) {
        await updateProgram(editingProgram.id, formData);
        setSuccess('Program updated successfully');
      } else {
        await createProgram(formData);
        setSuccess('Program created successfully');
      }
      
      setIsModalOpen(false);
      resetForm();
      fetchPrograms();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('❌ Error saving program:', err);
      setError(handleApiError(err));
    }
  };

  const handleEdit = (program) => {
    setEditingProgram(program);
    setFormData({
      name: program.name || '',
      program_type: program.program_type || 'primary',
      code: program.code || '',
      description: program.description || '',
      duration_years: program.duration_years || 6,
      is_active: program.is_active !== undefined ? program.is_active : true
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (program) => {
    setProgramToDelete(program);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      await deleteProgram(programToDelete.id);
      setSuccess('Program deleted successfully');
      fetchPrograms();
      setIsDeleteModalOpen(false);
      setProgramToDelete(null);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('❌ Error deleting program:', err);
      setError(handleApiError(err));
      setIsDeleteModalOpen(false);
    }
  };

  const handleView = (program) => {
    setSelectedProgram(program);
    setIsViewModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      program_type: 'primary',
      code: '',
      description: '',
      duration_years: 6,
      is_active: true
    });
    setEditingProgram(null);
    setError('');
  };

  const getProgramTypeLabel = (type) => {
    const typeMap = {
      'creche': 'Creche',
      'nursery': 'Nursery',
      'primary': 'Primary School',
      'junior_secondary': 'Junior Secondary (JSS)',
      'senior_secondary': 'Senior Secondary (SSS)'
    };
    return typeMap[type] || type;
  };

  const filteredPrograms = programs.filter(program => {
    const searchString = searchTerm.toLowerCase();
    const matchesSearch = (
      (program.name && program.name.toLowerCase().includes(searchString)) ||
      (program.code && program.code.toLowerCase().includes(searchString)) ||
      (program.program_type && program.program_type.toLowerCase().includes(searchString))
    );
    
    const matchesFilter = filterType === 'all' || program.program_type === filterType;
    
    return matchesSearch && matchesFilter;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredPrograms.length / itemsPerPage);
  const paginatedPrograms = filteredPrograms.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const stats = {
    total: programs.length,
    active: programs.filter(p => p.is_active).length,
    primary: programs.filter(p => p.program_type === 'primary').length,
    avgDuration: programs.length > 0 
      ? (programs.reduce((sum, p) => sum + (p.duration_years || 0), 0) / programs.length).toFixed(1)
      : '0.0'
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

  if (loading && programs.length === 0) {
    return (
      <DashboardLayout title="Academic Programs">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <RefreshCw className="animate-spin h-8 w-8 text-[#D94801] mx-auto mb-4" />
            <Text variant="body" className="text-gray-400">Loading academic programs from database...</Text>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Academic Programs">
      {/* Fixed height container with internal scrolling - only table/card scrolls */}
      <div className="h-[calc(100vh-120px)] flex flex-col px-3 sm:px-4 lg:px-6">
        
        {/* STICKY HEADER SECTION - Everything above the table/card stays fixed */}
        <div className="sticky top-0 z-20 bg-gray-50 -mx-3 sm:-mx-4 lg:-mx-6 px-3 sm:px-4 lg:px-6 pt-4 pb-2">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#1D2B49] rounded-xl flex items-center justify-center shadow-sm">
                  <School size={14} className="text-white" />
                </div>
                <Text variant="h2" className="font-bold">Academic Programs</Text>
              </div>
              <Text variant="caption" className="text-gray-400 pl-9">
                Manage school academic programs and curricula • {programs.length} total programs
              </Text>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="small" icon={RefreshCw} onClick={fetchPrograms} loading={loading}>
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
            <StatCard title="Total Programs" value={stats.total} icon={School} color="bg-gray-100" />
            <StatCard title="Active Programs" value={stats.active} icon={CheckCircle} color="bg-green-100" />
            <StatCard title="Primary Programs" value={stats.primary} icon={School} color="bg-blue-100" />
            <StatCard title="Avg Duration" value={`${stats.avgDuration} yrs`} icon={Clock} color="bg-purple-100" />
          </div>

          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-2 mb-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                placeholder="Search programs by name or code..."
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
            onApply={fetchPrograms}
            onClear={() => { setSearchTerm(''); setFilterType('all'); fetchPrograms(); }}
          />
        </div>

        {/* SCROLLABLE CONTENT SECTION - Only table/card scrolls here */}
        <div className="flex-1 overflow-y-auto min-h-0 -mx-3 sm:-mx-4 lg:-mx-6 px-3 sm:px-4 lg:px-6 pb-4">
          <Card className="overflow-hidden">
            {paginatedPrograms.length === 0 ? (
              <div className="p-8 text-center">
                <School size={32} className="mx-auto text-gray-200 mb-2" />
                <Text variant="body" className="text-gray-400">No programs found</Text>
                {hasActiveFilters ? (
                  <Button variant="outline" size="small" className="mt-3" onClick={() => { setSearchTerm(''); setFilterType('all'); }}>
                    Clear Filters
                  </Button>
                ) : (
                  <Button variant="primary" size="small" className="mt-3" onClick={() => { resetForm(); setIsModalOpen(true); }}>
                    Create your first program
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
                          <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Program Details</th>
                          <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Type</th>
                          <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Duration</th>
                          <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-4 py-3 text-right text-[10px] font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {paginatedPrograms.map((program) => (
                          <tr key={program.id} className="hover:bg-gray-50 transition-colors duration-150">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                                  <School size={14} className="text-gray-600" />
                                </div>
                                <div>
                                  <Text variant="small" className="font-medium text-gray-800">{program.name}</Text>
                                  <Text variant="caption" className="text-gray-400 font-mono">{program.code}</Text>
                                  {program.description && (
                                    <Text variant="tiny" className="text-gray-400 line-clamp-1">{program.description}</Text>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 hidden sm:table-cell">
                              <ProgramTypeBadge type={program.program_type} />
                            </td>
                            <td className="px-4 py-3">
                              <Text variant="caption" className="text-gray-600 flex items-center gap-1">
                                <Clock size={10} /> {program.duration_years} years
                              </Text>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-medium ${program.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                {program.is_active ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button onClick={() => handleView(program)} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg transition-colors">
                                  <Eye size={14} />
                                </button>
                                <button onClick={() => handleEdit(program)} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg transition-colors">
                                  <Edit size={14} />
                                </button>
                                <button onClick={() => handleDeleteClick(program)} className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg transition-colors">
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
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                      {paginatedPrograms.map((program) => (
                        <ProgramCard
                          key={program.id}
                          program={program}
                          getProgramTypeLabel={getProgramTypeLabel}
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
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredPrograms.length)} of {filteredPrograms.length} programs
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
          title={editingProgram ? 'Edit Academic Program' : 'Create Academic Program'}
          size="lg"
        >
          <form onSubmit={handleSubmit} className="py-3 space-y-4 max-h-[70vh] overflow-y-auto px-1">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-medium text-gray-500 mb-1">Program Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g., Primary School Program"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-medium text-gray-500 mb-1">Program Code *</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({...formData, code: e.target.value})}
                  placeholder="e.g., PRI"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-[10px] font-medium text-gray-500 mb-1">Program Type *</label>
              <select
                value={formData.program_type}
                onChange={(e) => setFormData({...formData, program_type: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
                required
              >
                {programTypeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>
            
            <div>
              <label className="block text-[10px] font-medium text-gray-500 mb-1">Duration (Years) *</label>
              <input
                type="number"
                value={formData.duration_years}
                onChange={(e) => setFormData({...formData, duration_years: parseInt(e.target.value) || 0})}
                min="0"
                max="12"
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm"
                required
              />
            </div>
            
            <div>
              <label className="block text-[10px] font-medium text-gray-500 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm"
                placeholder="Program description..."
              />
            </div>
            
            <div className="flex items-center">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                  className="w-3 h-3 rounded border-gray-300"
                />
                <span className="text-[10px] text-gray-700">Program is active</span>
              </label>
            </div>
            
            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={() => { setIsModalOpen(false); resetForm(); }} className="flex-1">
                Cancel
              </Button>
              <Button variant="primary" type="submit" className="flex-1">
                {editingProgram ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </Modal>

        {/* View Details Modal */}
        <Modal
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
            setSelectedProgram(null);
          }}
          title="Program Details"
          size="sm"
        >
          {selectedProgram && (
            <div className="py-3 space-y-3">
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <School size={18} className="text-gray-600" />
                  </div>
                  <div>
                    <Text variant="h4" className="font-bold">{selectedProgram.name}</Text>
                    <Text variant="caption" className="text-gray-400 font-mono">{selectedProgram.code}</Text>
                  </div>
                </div>
                {selectedProgram.description && (
                  <Text variant="caption" className="text-gray-500 mt-2 block">{selectedProgram.description}</Text>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <Text variant="caption" className="text-gray-400">Program Type</Text>
                  <ProgramTypeBadge type={selectedProgram.program_type} />
                </div>
                <div>
                  <Text variant="caption" className="text-gray-400">Duration</Text>
                  <div className="flex items-center gap-1 mt-1">
                    <Clock size={12} className="text-gray-400" />
                    <Text variant="small" className="font-medium">{selectedProgram.duration_years} years</Text>
                  </div>
                </div>
                <div>
                  <Text variant="caption" className="text-gray-400">Status</Text>
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-medium mt-1 ${selectedProgram.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {selectedProgram.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <Button variant="outline" size="small" onClick={() => { setIsViewModalOpen(false); setSelectedProgram(null); }}>
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
            setProgramToDelete(null);
          }}
          title="Delete Program"
          size="sm"
        >
          {programToDelete && (
            <div className="py-4 text-center">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Trash2 size={18} className="text-red-600" />
              </div>
              <Text variant="h4" className="font-semibold mb-1">Delete "{programToDelete.name}"?</Text>
              <Text variant="caption" className="text-gray-500 mb-4 block">This action cannot be undone.</Text>
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <School size={14} className="text-gray-500" />
                  <Text variant="caption" className="font-medium">{programToDelete.code}</Text>
                </div>
                <ProgramTypeBadge type={programToDelete.program_type} />
                <div className="flex items-center justify-center gap-1 mt-2">
                  <Clock size={10} className="text-gray-400" />
                  <Text variant="tiny" className="text-gray-500">{programToDelete.duration_years} years</Text>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => { setIsDeleteModalOpen(false); setProgramToDelete(null); }} className="flex-1">
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

export default Programs;