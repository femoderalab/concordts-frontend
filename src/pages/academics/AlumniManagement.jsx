/**
 * Alumni Management Page — Redesigned with Consistent Design System
 * View and search graduated students with modern UI
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import Alert from '../../components/common/Alert';
import Modal from '../../components/common/modal';
import {
  Award,
  RefreshCw,
  Search,
  Eye,
  GraduationCap,
  Calendar,
  User,
  Mail,
  Phone,
  ChevronLeft,
  ChevronRight,
  X,
  Printer,
  LayoutGrid,
  List,
  Users,
  Layers,
  History,
  BarChart3,
  ArrowRight,
  AlertCircle,
  Sparkles,
  Filter,
  Grid3x3,
  Table2,
  Clock,
  Hash,
  CheckCircle
} from 'lucide-react';
import { getAlumniList, getAlumniDetail } from '../../services/promotionService';
import useAuth from '../../hooks/useAuth';

// ============================================
// DESIGN SYSTEM COMPONENTS
// ============================================

// Typography (Sora font)
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
    purple: 'bg-purple-600 text-white hover:bg-purple-700',
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

// Stat Card
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

// Pill Badge
const Pill = ({ label, variant = 'default' }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-600 border-gray-200',
    purple: 'bg-purple-100 text-purple-700 border-purple-200',
    green: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    blue: 'bg-sky-100 text-sky-700 border-sky-200',
    orange: 'bg-[#D94801]/10 text-[#D94801] border-[#D94801]/20',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] md:text-[10px] font-medium border ${variants[variant]}`}>
      {label}
    </span>
  );
};

// Avatar Initial
const AvatarInitial = ({ name = '?', size = 'md', colorClass = 'bg-purple-100 text-purple-700' }) => {
  const s = size === 'sm' ? 'w-7 h-7 text-xs' : size === 'lg' ? 'w-12 h-12 text-lg' : 'w-9 h-9 text-sm';
  return (
    <div className={`${s} ${colorClass} rounded-full flex items-center justify-center font-bold flex-shrink-0 border-2 border-white shadow-sm`}>
      {name.charAt(0).toUpperCase()}
    </div>
  );
};

// Icon Button
const IconBtn = ({ onClick, title, children, variant = 'ghost' }) => {
  const variants = {
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-500 hover:text-gray-700 border-transparent',
    primary: 'bg-[#D94801]/10 hover:bg-[#D94801]/20 text-[#D94801] border-[#D94801]/20',
    purple: 'bg-purple-50 hover:bg-purple-100 text-purple-600 border-purple-100',
  };
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`inline-flex items-center justify-center w-8 h-8 rounded-lg border transition-all duration-150 focus:outline-none ${variants[variant]}`}
    >
      {children}
    </button>
  );
};

// Mobile Filter Sheet
const MobileFilterSheet = ({ isOpen, onClose, searchTerm, setSearchTerm, selectedYear, setSelectedYear, graduationYears, onApply, onClear }) => {
  const [localSearch, setLocalSearch] = useState(searchTerm);
  const [localYear, setLocalYear] = useState(selectedYear);
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 transition-opacity" onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 p-5 animate-in slide-in-from-bottom duration-200 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <Text variant="h4" className="font-semibold">Filter Alumni</Text>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100"><X size={18} /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
              <input type="text" value={localSearch} onChange={(e) => setLocalSearch(e.target.value)} placeholder="Search by name or number..." className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Graduation Year</label>
            <select value={localYear} onChange={(e) => setLocalYear(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]">
              <option value="">All Years</option>
              {graduationYears.map(year => (<option key={year} value={year}>{year}</option>))}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="primary" size="medium" onClick={() => { setSearchTerm(localSearch); setSelectedYear(localYear); onApply(); onClose(); }} className="flex-1">Apply Filters</Button>
            <button onClick={() => { setLocalSearch(''); setLocalYear(''); setSearchTerm(''); setSelectedYear(''); onClear(); onClose(); }} className="px-4 py-2 text-red-500 font-medium text-sm">Clear</button>
          </div>
        </div>
      </div>
    </>
  );
};

// Alumni Card Component
const AlumniCard = ({ alumni, onViewDetail }) => (
  <Card className="p-4 hover:shadow-md transition-all duration-200 cursor-pointer" hover>
    <div className="flex items-start gap-3" onClick={() => onViewDetail(alumni)}>
      <AvatarInitial name={alumni.name} size="lg" colorClass="bg-purple-100 text-purple-700" />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div>
            <Text variant="small" className="font-bold text-gray-900">{alumni.name}</Text>
            <Text variant="tiny" className="text-gray-400 font-mono">{alumni.admission_number}</Text>
          </div>
          <Pill label={`Class of ${alumni.graduation_year}`} variant="purple" />
        </div>
        <div className="flex flex-wrap items-center gap-2 mt-2">
          <span className="flex items-center gap-1 text-[10px] text-gray-500">
            <GraduationCap size={10} className="text-purple-500" />
            {alumni.final_class_level || 'SSS 3'}
          </span>
          {alumni.email && (
            <span className="flex items-center gap-1 text-[10px] text-gray-400 truncate max-w-[150px]">
              <Mail size={10} /> {alumni.email}
            </span>
          )}
        </div>
      </div>
    </div>
  </Card>
);

// Alumni Row Component
const AlumniRow = ({ alumni, onViewDetail }) => (
  <div className="flex items-center justify-between p-3 hover:bg-purple-50/30 transition-colors border-b border-gray-100 cursor-pointer" onClick={() => onViewDetail(alumni)}>
    <div className="flex items-center gap-3 min-w-0 flex-1">
      <AvatarInitial name={alumni.name} size="sm" colorClass="bg-purple-100 text-purple-700" />
      <div className="min-w-0 flex-1">
        <Text variant="small" className="font-bold text-gray-900 truncate">{alumni.name}</Text>
        <Text variant="tiny" className="text-gray-400 font-mono">{alumni.admission_number}</Text>
      </div>
    </div>
    <div className="hidden md:block w-24 text-center"><Pill label={`${alumni.graduation_year}`} variant="purple" /></div>
    <div className="hidden lg:block w-28"><Text variant="tiny" className="text-gray-600">{alumni.final_class_level || 'SSS 3'}</Text></div>
    <div className="hidden sm:block w-32"><Text variant="tiny" className="text-gray-400 truncate">{alumni.email || 'No email'}</Text></div>
    <div><IconBtn onClick={(e) => { e.stopPropagation(); onViewDetail(alumni); }} title="View Details" variant="purple"><Eye size={12} /></IconBtn></div>
  </div>
);

// ============================================
// MAIN COMPONENT
// ============================================
export default function AlumniManagement() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === 'head' || user?.role === 'hm' || user?.role === 'principal' || user?.role === 'vice_principal' || user?.role === 'admin';

  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [viewMode, setViewMode] = useState('card');
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 12;

  const currentYear = new Date().getFullYear();
  const graduationYears = Array.from({ length: currentYear - 2019 }, (_, i) => currentYear - i);

  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const loadAlumni = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const params = { page: currentPage, limit: itemsPerPage };
      if (selectedYear) params.graduation_year = selectedYear;
      if (searchTerm) params.search = searchTerm;
      
      const data = await getAlumniList(params);
      setAlumni(data.results || data || []);
      setTotalPages(data.total_pages || Math.ceil((data.count || 0) / itemsPerPage) || 1);
      setTotalCount(data.count || 0);
    } catch (err) {
      setError(err.message || 'Failed to load alumni list');
    } finally {
      setLoading(false);
    }
  }, [currentPage, selectedYear, searchTerm]);

  useEffect(() => {
    if (isAdmin) loadAlumni();
  }, [loadAlumni, isAdmin]);

  const handleViewDetail = async (alumniRecord) => {
    try {
      setDetailLoading(true);
      const data = await getAlumniDetail(alumniRecord.alumni_record_id);
      setSelectedAlumni(data.alumni || data);
      setShowDetailModal(true);
    } catch (err) {
      setError(err.message || 'Failed to load alumni details');
    } finally {
      setDetailLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    loadAlumni();
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedYear('');
    setCurrentPage(1);
  };

  useEffect(() => {
    if (isAdmin) loadAlumni();
  }, [currentPage, selectedYear, searchTerm]);

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const handlePrint = () => {
    const win = window.open('', '_blank');
    win.document.write(`
      <!DOCTYPE html>
      <html>
      <head><meta charset="UTF-8"><title>Alumni List</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Arial', sans-serif; margin: 20px; background: white; }
        .header { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 3px solid #D94801; }
        .school-name { font-size: 24px; font-weight: bold; color: #1D2B49; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
        th { background-color: #f3e8ff; color: #1D2B49; font-weight: bold; }
        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 10px; }
      </style>
      </head>
      <body>
        <div class="header"><div class="school-name">CONCORD TUTOR SCHOOL</div><div>Alumni Directory</div><div>Generated on ${new Date().toLocaleDateString()}</div></div>
        <table><thead><tr><th>Name</th><th>Admission Number</th><th>Graduation Year</th><th>Final Class</th></tr></thead>
        <tbody>${alumni.map(a => `<tr><td>${a.name}</td><td>${a.admission_number}</td><td>${a.graduation_year}</td><td>${a.final_class_level || 'SSS 3'}</td></tr>`).join('')}</tbody>
        </table>
        <div class="footer"><p>Total Alumni: ${totalCount} | Generated on ${new Date().toLocaleString()}</p></div>
      </body>
      </html>
    `);
    win.document.close();
    win.print();
  };

  const uniqueClasses = [...new Set(alumni.map(a => a.final_class_level))].filter(Boolean).length;
  const stats = [
    { title: 'Total Alumni', value: totalCount, icon: Award, color: 'bg-purple-100' },
    { title: 'Grad Years', value: graduationYears.length, icon: Calendar, color: 'bg-indigo-100' },
    { title: 'Unique Classes', value: uniqueClasses, icon: GraduationCap, color: 'bg-emerald-100' },
    { title: 'Pages', value: totalPages, icon: Layers, color: 'bg-sky-100' },
  ];

  const hasActiveFilters = searchTerm !== '' || selectedYear !== '';
  const displayViewMode = isMobile ? 'card' : viewMode;

  if (!isAdmin) {
    return (
      <DashboardLayout title="Access Denied">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-red-50 border border-red-100 rounded-3xl flex items-center justify-center mx-auto"><AlertCircle size={32} className="text-red-500" /></div>
            <div><Text variant="h2" className="font-bold text-gray-900">Access Denied</Text><Text variant="body" className="text-gray-500 mt-1">Only administrators can access alumni management.</Text></div>
            <Button variant="primary" onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Alumni Management">
      <div className="h-[calc(100vh-120px)] flex flex-col px-3 sm:px-4 lg:px-6">
        
        {/* STICKY HEADER SECTION */}
        <div className="sticky top-0 z-20 bg-gray-50 -mx-3 sm:-mx-4 lg:-mx-6 px-3 sm:px-4 lg:px-6 pt-4 pb-2">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#1D2B49] rounded-xl flex items-center justify-center shadow-sm"><Award size={14} className="text-white" /></div>
                <Text variant="h2" className="font-bold">Alumni Management</Text>
              </div>
              <Text variant="caption" className="text-gray-400 pl-9">View and manage all graduated students</Text>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex bg-gray-100 rounded-xl p-1 gap-0.5">
                <button onClick={() => setViewMode('card')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'card' ? 'bg-white text-[#D94801] shadow-sm' : 'text-gray-500'}`}><LayoutGrid size={13} /> Cards</button>
                <button onClick={() => setViewMode('list')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'list' ? 'bg-white text-[#D94801] shadow-sm' : 'text-gray-500'}`}><List size={13} /> List</button>
              </div>
              <Button variant="outline" size="small" icon={RefreshCw} onClick={loadAlumni} loading={loading}>Refresh</Button>
              {alumni.length > 0 && <Button variant="purple" size="small" icon={Printer} onClick={handlePrint}>Print</Button>}
            </div>
          </div>

          {/* Alerts */}
          {error && <div className="mb-3"><Alert type="error" message={error} onClose={() => setError('')} /></div>}

          {/* Stats Cards */}
          {!loading && alumni.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
              {stats.map((stat, i) => (<StatCard key={i} {...stat} />))}
            </div>
          )}

          {/* Search and Filter Bar */}
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 mb-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
              <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search by name, admission number..." className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]" />
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]">
                <option value="">All Years</option>
                {graduationYears.map(year => (<option key={year} value={year}>{year}</option>))}
              </select>
              <Button variant="primary" size="small" type="submit" icon={Search}>Search</Button>
              {hasActiveFilters && (<Button variant="ghost" size="small" onClick={clearFilters}><X size={12} /> Clear</Button>)}
            </div>
            <button onClick={() => setShowMobileFilter(true)} className="sm:hidden flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 bg-white rounded-xl text-sm"><Filter size={14} /> Filter</button>
          </form>

          <MobileFilterSheet isOpen={showMobileFilter} onClose={() => setShowMobileFilter(false)} searchTerm={searchTerm} setSearchTerm={setSearchTerm} selectedYear={selectedYear} setSelectedYear={setSelectedYear} graduationYears={graduationYears} onApply={loadAlumni} onClear={clearFilters} />

          {/* Results Count */}
          {!loading && alumni.length > 0 && (
            <div className="flex items-center justify-between mt-2">
              <Text variant="tiny" className="text-gray-400">Showing {alumni.length} of {totalCount} alumni</Text>
            </div>
          )}
        </div>

        {/* SCROLLABLE CONTENT SECTION */}
        <div className="flex-1 overflow-y-auto min-h-0 -mx-3 sm:-mx-4 lg:-mx-6 px-3 sm:px-4 lg:px-6 pb-4">
          <Card className="overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center min-h-[200px] py-12"><RefreshCw className="animate-spin h-8 w-8 text-[#D94801]" /></div>
            ) : alumni.length === 0 ? (
              <div className="p-12 text-center">
                <Award size={32} className="mx-auto text-gray-200 mb-2" />
                <Text variant="body" className="text-gray-400">No alumni found</Text>
                {hasActiveFilters && (<Button variant="outline" size="small" className="mt-3" onClick={clearFilters}>Clear Filters</Button>)}
              </div>
            ) : displayViewMode === 'card' ? (
              <div className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {alumni.map((record) => (<AlumniCard key={record.alumni_record_id} alumni={record} onViewDetail={handleViewDetail} />))}
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <div className="sticky top-0 bg-gray-50 border-b border-gray-100 px-4 py-2">
                  <div className="flex items-center text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                    <div className="flex-1 pl-10">Student</div><div className="w-24 text-center hidden md:block">Year</div><div className="w-28 hidden lg:block">Final Class</div><div className="w-32 hidden sm:block">Email</div><div className="w-12 text-right">Action</div>
                  </div>
                </div>
                <div className="divide-y divide-gray-50">
                  {alumni.map((record) => (<AlumniRow key={record.alumni_record_id} alumni={record} onViewDetail={handleViewDetail} />))}
                </div>
              </div>
            )}
          </Card>

          {/* Pagination */}
          {totalPages > 1 && !loading && alumni.length > 0 && (
            <div className="flex items-center justify-between mt-4 px-2">
              <Text variant="tiny" className="text-gray-400">Page {currentPage} of {totalPages}</Text>
              <div className="flex items-center gap-2">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center disabled:opacity-40 hover:bg-gray-50 transition-colors"><ChevronLeft size={14} /></button>
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center disabled:opacity-40 hover:bg-gray-50 transition-colors"><ChevronRight size={14} /></button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Alumni Detail Modal */}
      <Modal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} title="Alumni Details" size="lg">
        <div className="py-3 max-h-[70vh] overflow-y-auto space-y-4 pr-0.5">
          {detailLoading ? (
            <div className="flex justify-center py-12"><RefreshCw className="animate-spin h-8 w-8 text-[#D94801]" /></div>
          ) : selectedAlumni ? (
            <>
              <div className="bg-gradient-to-br from-purple-50 via-white to-violet-50 border border-purple-100 rounded-xl p-4">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-400 to-violet-600 flex items-center justify-center shadow-md"><User size={24} className="text-white" /></div>
                  <div className="flex-1">
                    <Text variant="h4" className="font-bold">{selectedAlumni.name}</Text>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <Pill label={`Class of ${selectedAlumni.graduation_year}`} variant="purple" />
                      <Pill label={selectedAlumni.admission_number} variant="default" />
                      {selectedAlumni.registration_number && <Pill label={`Reg: ${selectedAlumni.registration_number}`} variant="default" />}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center"><Mail size={14} className="text-gray-500" /></div>
                  <div><Text variant="tiny" className="text-gray-400 font-bold uppercase">Email</Text><Text variant="small" className="font-medium text-gray-800">{selectedAlumni.email || 'Not provided'}</Text></div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center"><Phone size={14} className="text-gray-500" /></div>
                  <div><Text variant="tiny" className="text-gray-400 font-bold uppercase">Phone</Text><Text variant="small" className="font-medium text-gray-800">{selectedAlumni.phone || 'Not provided'}</Text></div>
                </div>
              </div>

              <div className="bg-purple-50 border border-purple-100 rounded-xl p-4">
                <Text variant="tiny" className="font-bold text-gray-800 mb-3 flex items-center gap-2"><GraduationCap size={12} className="text-purple-600" /> Graduation Information</Text>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div><Text variant="tiny" className="text-purple-600 font-bold uppercase">Graduation Date</Text><Text variant="small" className="font-bold text-gray-800">{formatDate(selectedAlumni.graduation_date)}</Text></div>
                  <div><Text variant="tiny" className="text-purple-600 font-bold uppercase">Graduation Session</Text><Text variant="small" className="font-bold text-gray-800">{selectedAlumni.graduation_session || 'N/A'}</Text></div>
                  <div><Text variant="tiny" className="text-purple-600 font-bold uppercase">Final Class Level</Text><Text variant="small" className="font-bold text-gray-800">{selectedAlumni.final_class_level || 'SSS 3'}</Text></div>
                </div>
                {selectedAlumni.remarks && (<div className="mt-3 pt-3 border-t border-purple-200"><Text variant="tiny" className="text-purple-600 font-bold uppercase">Remarks</Text><Text variant="small" className="text-gray-700">{selectedAlumni.remarks}</Text></div>)}
              </div>

              {selectedAlumni.promotion_history && selectedAlumni.promotion_history.length > 0 && (
                <div>
                  <Text variant="tiny" className="font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2"><History size={10} /> Promotion History ({selectedAlumni.promotion_history.length})</Text>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {selectedAlumni.promotion_history.map((promo, idx) => (
                      <div key={idx} className="flex flex-wrap items-center justify-between gap-2 p-3 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-2"><span className="px-2 py-0.5 bg-gray-200 text-gray-700 text-[10px] font-bold rounded">{promo.from}</span><ArrowRight size={10} className="text-gray-400" /><span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded">{promo.to}</span></div>
                        <div className="flex items-center gap-2"><Text variant="tiny" className="text-gray-500">{promo.session}</Text><Text variant="tiny" className="text-gray-400">{formatDate(promo.date)}</Text></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : null}
        </div>
      </Modal>
    </DashboardLayout>
  );
}