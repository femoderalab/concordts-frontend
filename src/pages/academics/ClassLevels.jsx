import React, { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import Alert from '../../components/common/Alert';
import Modal from '../../components/common/modal';
import { 
  Layers, 
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
  Table2,
  Users,
  School,
  BookOpen,
  GraduationCap,
  Baby,
  Hash,
  AlertCircle
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import { 
  getClassLevels, 
  createClassLevel, 
  updateClassLevel, 
  deleteClassLevel,
  getPrograms
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

// Category Badge
const CategoryBadge = ({ category }) => {
  const config = {
    creche: { bg: 'bg-rose-100', text: 'text-rose-700', label: 'Creche' },
    nursery: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Nursery' },
    primary: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Primary' },
    jss: { bg: 'bg-cyan-100', text: 'text-cyan-700', label: 'JSS' },
    sss: { bg: 'bg-green-100', text: 'text-green-700', label: 'SSS' },
    other: { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Other' }
  };
  const c = config[category] || config.other;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] md:text-[10px] font-medium ${c.bg} ${c.text}`}>
      {c.label}
    </span>
  );
};

// Mobile Filter Sheet
const MobileFilterSheet = ({ isOpen, onClose, searchTerm, setSearchTerm, filterCategory, setFilterCategory, filterOptions, onApply, onClear }) => {
  const [localSearch, setLocalSearch] = useState(searchTerm);
  const [localFilter, setLocalFilter] = useState(filterCategory);
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 transition-opacity" onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 p-5 animate-in slide-in-from-bottom duration-200 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <Text variant="h4" className="font-semibold">Filter Class Levels</Text>
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
            <label className="block text-xs font-medium text-gray-500 mb-1">Category</label>
            <select value={localFilter} onChange={(e) => setLocalFilter(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]">
              {filterOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="primary" size="medium" onClick={() => { setSearchTerm(localSearch); setFilterCategory(localFilter); onApply(); onClose(); }} className="flex-1">Apply Filters</Button>
            <button onClick={() => { setLocalSearch(''); setLocalFilter('all'); setSearchTerm(''); setFilterCategory('all'); onClear(); onClose(); }} className="px-4 py-2 text-red-500 font-medium text-sm">Clear</button>
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

// Class Level Card Component (for mobile grid view)
const ClassLevelCard = ({ level, getLevelLabel, getLevelIcon, getLevelCategory, onView, onEdit, onDelete, isAdmin }) => (
  <Card className="p-3 space-y-2 hover:shadow-md transition-shadow duration-200 h-full">
    <div className="flex justify-between items-start gap-2">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
          {getLevelIcon(level.level)}
        </div>
        <div className="flex-1 min-w-0">
          <Text variant="tiny" className="font-bold text-gray-800 truncate">{level.name || 'Unnamed Level'}</Text>
          <Text variant="caption" className="text-gray-400 font-mono text-[8px] md:text-[9px]">{level.code || 'No Code'}</Text>
        </div>
      </div>
      <span className={`inline-flex px-1.5 py-0.5 rounded-full text-[7px] md:text-[8px] font-medium whitespace-nowrap flex-shrink-0 ${level.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
        {level.is_active ? 'Active' : 'Inactive'}
      </span>
    </div>
    <div className="flex items-center gap-1.5 flex-wrap">
      <CategoryBadge category={getLevelCategory(level.level)} />
      <Text variant="caption" className="text-gray-400 flex items-center gap-0.5 text-[8px] md:text-[9px]">
        <Users size={8} /> {level.min_age || 0}-{level.max_age || 0}yrs
      </Text>
    </div>
    <div>
      <Text variant="caption" className="text-gray-500 text-[8px] md:text-[9px] truncate">
        {level.program?.name || 'No Program'}
      </Text>
    </div>
    <div className="flex justify-end gap-0.5 pt-1">
      <button onClick={() => onView(level)} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"><Eye size={12} /></button>
      {isAdmin && (
        <>
          <button onClick={() => onEdit(level)} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"><Edit size={12} /></button>
          <button onClick={() => onDelete(level)} className="p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors"><Trash2 size={12} /></button>
        </>
      )}
    </div>
  </Card>
);

// ============================================
// MAIN COMPONENT
// ============================================
const ClassLevels = () => {
  const { user, isAdmin } = useAuth();
  const [classLevels, setClassLevels] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingClassLevel, setEditingClassLevel] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [levelToDelete, setLevelToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [viewMode, setViewMode] = useState('table');
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const [formData, setFormData] = useState({
    program: '',
    level: 'primary_1',
    name: '',
    code: '',
    order: 1,
    min_age: 5,
    max_age: 6,
    is_active: true
  });

  const levelOptions = [
    // Creche
    { value: 'creche', label: 'Creche' },
    // Nursery
    { value: 'nursery_1', label: 'Nursery 1' },
    { value: 'nursery_2', label: 'Nursery 2' },
    { value: 'kg_1', label: 'Kindergarten 1 (KG 1)' },
    { value: 'kg_2', label: 'Kindergarten 2 (KG 2)' },
    // Primary
    { value: 'primary_1', label: 'Primary 1 (Basic 1)' },
    { value: 'primary_2', label: 'Primary 2 (Basic 2)' },
    { value: 'primary_3', label: 'Primary 3 (Basic 3)' },
    { value: 'primary_4', label: 'Primary 4 (Basic 4)' },
    { value: 'primary_5', label: 'Primary 5 (Basic 5)' },
    { value: 'primary_6', label: 'Primary 6 (Basic 6)' },
    // Junior Secondary
    { value: 'jss_1', label: 'JSS 1 (Basic 7)' },
    { value: 'jss_2', label: 'JSS 2 (Basic 8)' },
    { value: 'jss_3', label: 'JSS 3 (Basic 9)' },
    // Senior Secondary
    { value: 'sss_1', label: 'SSS 1' },
    { value: 'sss_2', label: 'SSS 2' },
    { value: 'sss_3', label: 'SSS 3' }
  ];

  const filterOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'creche', label: 'Creche' },
    { value: 'nursery', label: 'Nursery' },
    { value: 'primary', label: 'Primary' },
    { value: 'jss', label: 'JSS' },
    { value: 'sss', label: 'SSS' }
  ];

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [levelsData, programsData] = await Promise.all([
        getClassLevels(),
        getPrograms()
      ]);
      
      setClassLevels(levelsData.results || levelsData || []);
      setPrograms(programsData.results || programsData || []);
      setCurrentPage(1);
    } catch (err) {
      console.error('❌ Error fetching class levels:', err);
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const checkDuplicateLevel = (programId, level, excludeId = null) => {
    return classLevels.some(cl => 
      cl.id !== excludeId && 
      (cl.program?.id === programId || cl.program === programId) && 
      cl.level === level
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      
      if (!editingClassLevel && checkDuplicateLevel(parseInt(formData.program), formData.level)) {
        setError('This class level already exists for the selected program. Each program can only have one instance of each level.');
        return;
      }
      
      if (editingClassLevel) {
        await updateClassLevel(editingClassLevel.id, formData);
        setSuccess('Class level updated successfully');
      } else {
        await createClassLevel(formData);
        setSuccess('Class level created successfully');
      }
      
      setIsModalOpen(false);
      resetForm();
      fetchData();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      const errorMsg = handleApiError(err);
      if (errorMsg.includes('unique set') || errorMsg.includes('already exists')) {
        setError('This class level already exists for the selected program. Each program can only have one instance of each level.');
      } else {
        setError(errorMsg);
      }
    }
  };

  const handleEdit = (classLevel) => {
    setEditingClassLevel(classLevel);
    setFormData({
      program: classLevel.program?.id || classLevel.program || '',
      level: classLevel.level || 'primary_1',
      name: classLevel.name || '',
      code: classLevel.code || '',
      order: classLevel.order || 1,
      min_age: classLevel.min_age || 5,
      max_age: classLevel.max_age || 6,
      is_active: classLevel.is_active !== undefined ? classLevel.is_active : true
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (classLevel) => {
    setLevelToDelete(classLevel);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      await deleteClassLevel(levelToDelete.id);
      setSuccess('Class level deleted successfully');
      fetchData();
      setIsDeleteModalOpen(false);
      setLevelToDelete(null);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(handleApiError(err));
      setIsDeleteModalOpen(false);
    }
  };

  const handleView = (classLevel) => {
    setSelectedLevel(classLevel);
    setIsViewModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      program: '',
      level: 'primary_1',
      name: '',
      code: '',
      order: 1,
      min_age: 5,
      max_age: 6,
      is_active: true
    });
    setEditingClassLevel(null);
    setError('');
  };

  const getLevelCategory = (level) => {
    if (!level) return 'other';
    if (level === 'creche') return 'creche';
    if (['nursery_1', 'nursery_2', 'kg_1', 'kg_2'].includes(level)) return 'nursery';
    if (level.startsWith('primary')) return 'primary';
    if (level.startsWith('jss')) return 'jss';
    if (level.startsWith('sss')) return 'sss';
    return 'other';
  };

  const getLevelLabel = (level) => {
    const option = levelOptions.find(opt => opt.value === level);
    return option?.label || level || '-';
  };

  const getLevelIcon = (level) => {
    if (level === 'creche') return <Baby size={14} className="text-gray-600" />;
    if (['nursery_1', 'nursery_2', 'kg_1', 'kg_2'].includes(level)) return <Baby size={14} className="text-gray-600" />;
    if (level.startsWith('primary')) return <School size={14} className="text-gray-600" />;
    if (level.startsWith('jss')) return <BookOpen size={14} className="text-gray-600" />;
    if (level.startsWith('sss')) return <GraduationCap size={14} className="text-gray-600" />;
    return <Layers size={14} className="text-gray-600" />;
  };

  const filteredClassLevels = classLevels.filter(level => {
    const searchString = searchTerm.toLowerCase();
    const matchesSearch = 
      (level.name && level.name.toLowerCase().includes(searchString)) ||
      (level.code && level.code.toLowerCase().includes(searchString)) ||
      (level.level && level.level.toLowerCase().includes(searchString)) ||
      (level.program?.name && level.program.name.toLowerCase().includes(searchString));
    
    const matchesFilter = filterCategory === 'all' || getLevelCategory(level.level) === filterCategory;
    
    return matchesSearch && matchesFilter;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredClassLevels.length / itemsPerPage);
  const paginatedLevels = filteredClassLevels.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const stats = {
    total: classLevels.length,
    active: classLevels.filter(l => l.is_active).length,
    primary: classLevels.filter(l => l.level?.startsWith('primary')).length,
    avgMinAge: classLevels.length > 0 
      ? Math.round((classLevels.reduce((sum, l) => sum + (l.min_age || 0), 0) / classLevels.length))
      : 0
  };

  const hasActiveFilters = searchTerm || filterCategory !== 'all';

  // Detect mobile screen
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const displayViewMode = isMobile ? 'card' : viewMode;

  if (loading && classLevels.length === 0) {
    return (
      <DashboardLayout title="Class Levels">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <RefreshCw className="animate-spin h-8 w-8 text-[#D94801] mx-auto mb-4" />
            <Text variant="body" className="text-gray-400">Loading class levels from database...</Text>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Class Levels">
      {/* Fixed height container with internal scrolling - only table/card scrolls */}
      <div className="h-[calc(100vh-120px)] flex flex-col px-3 sm:px-4 lg:px-6">
        
        {/* STICKY HEADER SECTION - Everything above the table/card stays fixed */}
        <div className="sticky top-0 z-20 bg-gray-50 -mx-3 sm:-mx-4 lg:-mx-6 px-3 sm:px-4 lg:px-6 pt-4 pb-2">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#1D2B49] rounded-xl flex items-center justify-center shadow-sm">
                  <Layers size={14} className="text-white" />
                </div>
                <Text variant="h2" className="font-bold">Class Levels</Text>
              </div>
              <Text variant="caption" className="text-gray-400 pl-9">
                Manage school class levels and grades • {classLevels.length} total levels
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
            <StatCard title="Total Levels" value={stats.total} icon={Layers} color="bg-gray-100" />
            <StatCard title="Active Levels" value={stats.active} icon={CheckCircle} color="bg-green-100" />
            <StatCard title="Primary Levels" value={stats.primary} icon={School} color="bg-blue-100" />
            <StatCard title="Avg Start Age" value={`${stats.avgMinAge} yrs`} icon={Users} color="bg-purple-100" />
          </div>

          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-2 mb-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                placeholder="Search class levels by name or code..."
                className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801] focus:border-transparent"
              />
            </div>
            
            {/* Desktop filters */}
            <div className="hidden sm:flex items-center gap-2">
              <select
                value={filterCategory}
                onChange={(e) => { setFilterCategory(e.target.value); setCurrentPage(1); }}
                className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
              >
                {filterOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
              {hasActiveFilters && (
                <Button variant="ghost" size="tiny" onClick={() => { setSearchTerm(''); setFilterCategory('all'); }}>
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
            filterCategory={filterCategory}
            setFilterCategory={(val) => { setFilterCategory(val); setCurrentPage(1); }}
            filterOptions={filterOptions}
            onApply={fetchData}
            onClear={() => { setSearchTerm(''); setFilterCategory('all'); fetchData(); }}
          />
        </div>

        {/* SCROLLABLE CONTENT SECTION - Only table/card scrolls here */}
        <div className="flex-1 overflow-y-auto min-h-0 -mx-3 sm:-mx-4 lg:-mx-6 px-3 sm:px-4 lg:px-6 pb-4">
          <Card className="overflow-hidden">
            {paginatedLevels.length === 0 ? (
              <div className="p-8 text-center">
                <Layers size={32} className="mx-auto text-gray-200 mb-2" />
                <Text variant="body" className="text-gray-400">No class levels found</Text>
                {hasActiveFilters ? (
                  <Button variant="outline" size="small" className="mt-3" onClick={() => { setSearchTerm(''); setFilterCategory('all'); }}>
                    Clear Filters
                  </Button>
                ) : (
                  <Button variant="primary" size="small" className="mt-3" onClick={() => { resetForm(); setIsModalOpen(true); }}>
                    Create your first class level
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
                          <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Class Level</th>
                          <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Level</th>
                          <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">Program</th>
                          <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Age Range</th>
                          <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Order</th>
                          <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-4 py-3 text-right text-[10px] font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {paginatedLevels.map((level) => (
                          <tr key={level.id} className="hover:bg-gray-50 transition-colors duration-150">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                                  {getLevelIcon(level.level)}
                                </div>
                                <div>
                                  <Text variant="small" className="font-medium text-gray-800">{level.name || 'Unnamed Level'}</Text>
                                  <Text variant="caption" className="text-gray-400 font-mono">{level.code || 'No Code'}</Text>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 hidden sm:table-cell">
                              <CategoryBadge category={getLevelCategory(level.level)} />
                            </td>
                            <td className="px-4 py-3 hidden md:table-cell">
                              <Text variant="caption" className="text-gray-600">{level.program?.name || 'No Program'}</Text>
                            </td>
                            <td className="px-4 py-3">
                              <Text variant="caption" className="text-gray-600 flex items-center gap-1">
                                <Users size={10} /> {level.min_age || 0}-{level.max_age || 0} yrs
                              </Text>
                            </td>
                            <td className="px-4 py-3 hidden sm:table-cell">
                              <Text variant="caption" className="text-gray-600 flex items-center gap-1">
                                <Hash size={10} /> {level.order || 0}
                              </Text>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-medium ${level.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                {level.is_active ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button onClick={() => handleView(level)} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg transition-colors">
                                  <Eye size={14} />
                                </button>
                                {isAdmin && (
                                  <>
                                    <button onClick={() => handleEdit(level)} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg transition-colors">
                                      <Edit size={14} />
                                    </button>
                                    <button onClick={() => handleDeleteClick(level)} className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg transition-colors">
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
                    {/* Mobile: 2 columns, Tablet: 3 columns, Desktop: 4 columns */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                      {paginatedLevels.map((level) => (
                        <ClassLevelCard
                          key={level.id}
                          level={level}
                          getLevelLabel={getLevelLabel}
                          getLevelIcon={getLevelIcon}
                          getLevelCategory={getLevelCategory}
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
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredClassLevels.length)} of {filteredClassLevels.length} class levels
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
          title={editingClassLevel ? 'Edit Class Level' : 'Create Class Level'}
          size="lg"
        >
          <form onSubmit={handleSubmit} className="py-3 space-y-4 max-h-[70vh] overflow-y-auto px-1">
            {/* Validation Warning */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex items-start">
              <AlertCircle size={18} className="text-gray-600 mr-2 mt-0.5 flex-shrink-0" />
              <Text variant="caption" className="text-gray-800">
                Each program can only have one instance of each level. For example, you cannot create two "Primary 1" levels under the same program.
              </Text>
            </div>

            <div>
              <label className="block text-[10px] font-medium text-gray-500 mb-1">Program *</label>
              <select
                value={formData.program}
                onChange={(e) => setFormData({...formData, program: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
                required
              >
                <option value="">Select program</option>
                {programs.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-[10px] font-medium text-gray-500 mb-1">Level *</label>
              <select
                value={formData.level}
                onChange={(e) => setFormData({...formData, level: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
                required
              >
                {levelOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>
            
            <div>
              <label className="block text-[10px] font-medium text-gray-500 mb-1">Class Level Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="e.g., Primary 1"
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
                required
              />
            </div>
            
            <div>
              <label className="block text-[10px] font-medium text-gray-500 mb-1">Class Code *</label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({...formData, code: e.target.value})}
                placeholder="e.g., PRI1"
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
                required
              />
              <p className="mt-1 text-[8px] text-gray-500">Unique code for this class level</p>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] font-medium text-gray-500 mb-1">Order</label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({...formData, order: parseInt(e.target.value) || 0})}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm"
                />
              </div>
              
              <div>
                <label className="block text-[10px] font-medium text-gray-500 mb-1">Min Age</label>
                <input
                  type="number"
                  value={formData.min_age}
                  onChange={(e) => setFormData({...formData, min_age: parseInt(e.target.value) || 0})}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm"
                />
              </div>
              
              <div>
                <label className="block text-[10px] font-medium text-gray-500 mb-1">Max Age</label>
                <input
                  type="number"
                  value={formData.max_age}
                  onChange={(e) => setFormData({...formData, max_age: parseInt(e.target.value) || 0})}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm"
                />
              </div>
            </div>
            
            <div className="flex items-center">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                  className="w-3 h-3 rounded border-gray-300"
                />
                <span className="text-[10px] text-gray-700">Class level is active</span>
              </label>
            </div>
            
            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={() => { setIsModalOpen(false); resetForm(); }} className="flex-1">
                Cancel
              </Button>
              <Button variant="primary" type="submit" className="flex-1">
                {editingClassLevel ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </Modal>

        {/* View Details Modal */}
        <Modal
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
            setSelectedLevel(null);
          }}
          title="Class Level Details"
          size="sm"
        >
          {selectedLevel && (
            <div className="py-3 space-y-3">
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    {getLevelIcon(selectedLevel.level)}
                  </div>
                  <div>
                    <Text variant="h4" className="font-bold">{selectedLevel.name || 'Unnamed Level'}</Text>
                    <Text variant="caption" className="text-gray-400 font-mono">{selectedLevel.code || 'No Code'}</Text>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <Text variant="caption" className="text-gray-400">Level</Text>
                  <CategoryBadge category={getLevelCategory(selectedLevel.level)} />
                </div>
                <div>
                  <Text variant="caption" className="text-gray-400">Program</Text>
                  <Text variant="small" className="font-medium">{selectedLevel.program?.name || 'No Program'}</Text>
                </div>
                <div>
                  <Text variant="caption" className="text-gray-400">Order</Text>
                  <div className="flex items-center gap-1 mt-1">
                    <Hash size={12} className="text-gray-400" />
                    <Text variant="small" className="font-medium">{selectedLevel.order || 0}</Text>
                  </div>
                </div>
                <div>
                  <Text variant="caption" className="text-gray-400">Age Range</Text>
                  <div className="flex items-center gap-1 mt-1">
                    <Users size={12} className="text-gray-400" />
                    <Text variant="small" className="font-medium">{selectedLevel.min_age || 0}-{selectedLevel.max_age || 0} years</Text>
                  </div>
                </div>
                <div>
                  <Text variant="caption" className="text-gray-400">Status</Text>
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-medium mt-1 ${selectedLevel.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {selectedLevel.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <Button variant="outline" size="small" onClick={() => { setIsViewModalOpen(false); setSelectedLevel(null); }}>
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
            setLevelToDelete(null);
          }}
          title="Delete Class Level"
          size="sm"
        >
          {levelToDelete && (
            <div className="py-4 text-center">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Trash2 size={18} className="text-red-600" />
              </div>
              <Text variant="h4" className="font-semibold mb-1">Delete "{levelToDelete.name || 'Unnamed Level'}"?</Text>
              <Text variant="caption" className="text-gray-500 mb-4 block">This action cannot be undone.</Text>
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  {getLevelIcon(levelToDelete.level)}
                  <Text variant="caption" className="font-medium">{getLevelLabel(levelToDelete.level)}</Text>
                </div>
                <Text variant="caption" className="text-gray-600 text-center block">
                  {levelToDelete.program?.name || 'No Program'}
                </Text>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => { setIsDeleteModalOpen(false); setLevelToDelete(null); }} className="flex-1">
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

export default ClassLevels;