/**
 * Library Management Page — Redesigned with Consistent Design System
 * Digital library with book upload, download, and activity tracking
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import Alert from '../../components/common/Alert';
import Modal from '../../components/common/modal';
import {
  Book,
  BookOpen,
  Search,
  X,
  Upload,
  Download,
  Eye,
  Trash2,
  Edit2,
  Plus,
  RefreshCw,
  Star,
  File,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
  Library,
  CheckCircle,
  Filter,
  Grid3x3,
  Table2,
  ChevronDown,
  ChevronUp,
  Users,
  Layers,
  Calendar,
  Clock,
  Award
} from 'lucide-react';
import libraryService from '../../services/libraryService';
import { getClassLevels } from '../../services/academicService';
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
    success: 'bg-emerald-600 text-white hover:bg-emerald-700',
    blue: 'bg-blue-600 text-white hover:bg-blue-700',
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
    blue: 'bg-blue-100 text-blue-700 border-blue-200',
    green: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    purple: 'bg-purple-100 text-purple-700 border-purple-200',
    orange: 'bg-[#D94801]/10 text-[#D94801] border-[#D94801]/20',
  };
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] md:text-[10px] font-medium border ${variants[variant]}`}>{label}</span>;
};

// Avatar Initial
const AvatarInitial = ({ name = '?', size = 'md', colorClass = 'bg-blue-100 text-blue-700' }) => {
  const s = size === 'sm' ? 'w-7 h-7 text-xs' : size === 'lg' ? 'w-10 h-10 text-base' : 'w-8 h-8 text-sm';
  return <div className={`${s} ${colorClass} rounded-full flex items-center justify-center font-bold flex-shrink-0 border-2 border-white shadow-sm`}>{name.charAt(0).toUpperCase()}</div>;
};

// Icon Button
const IconBtn = ({ onClick, title, children, variant = 'ghost', disabled = false }) => {
  const variants = {
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-500 hover:text-gray-700 border-transparent',
    primary: 'bg-[#D94801]/10 hover:bg-[#D94801]/20 text-[#D94801] border-[#D94801]/20',
    success: 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border-emerald-100',
    danger: 'bg-red-50 hover:bg-red-100 text-red-500 border-red-100',
    blue: 'bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-100',
  };
  return (
    <button type="button" onClick={onClick} title={title} disabled={disabled}
      className={`inline-flex items-center justify-center w-8 h-8 rounded-lg border transition-all duration-150 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed ${variants[variant]}`}>
      {children}
    </button>
  );
};

// Mobile Filter Sheet
const MobileFilterSheet = ({ isOpen, onClose, searchTerm, setSearchTerm, selectedCategory, setSelectedCategory, categoryOptions, onApply, onClear }) => {
  const [localSearch, setLocalSearch] = useState(searchTerm);
  const [localCategory, setLocalCategory] = useState(selectedCategory);
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 transition-opacity" onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 p-5 animate-in slide-in-from-bottom duration-200 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <Text variant="h4" className="font-semibold">Filter Books</Text>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100"><X size={18} /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
              <input type="text" value={localSearch} onChange={(e) => setLocalSearch(e.target.value)} placeholder="Search by title, author..." className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Category</label>
            <select value={localCategory} onChange={(e) => setLocalCategory(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]">
              <option value="">All Categories</option>
              {categoryOptions.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="primary" size="medium" onClick={() => { setSearchTerm(localSearch); setSelectedCategory(localCategory); onApply(); onClose(); }} className="flex-1">Apply Filters</Button>
            <button onClick={() => { setLocalSearch(''); setLocalCategory(''); setSearchTerm(''); setSelectedCategory(''); onClear(); onClose(); }} className="px-4 py-2 text-red-500 font-medium text-sm">Clear</button>
          </div>
        </div>
      </div>
    </>
  );
};

// Book Card Component
const BookCard = ({ book, onView, onDownload, onEdit, onDelete, canManage }) => {
  const [imgError, setImgError] = useState(false);
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer h-full flex flex-col" onClick={() => onView(book)}>
      <div className="aspect-[3/4] bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4 relative">
        {!imgError && book.cover_image_url ? (
          <img src={book.cover_image_url} alt={book.title} className="w-full h-full object-cover rounded-lg shadow-md" onError={() => setImgError(true)} />
        ) : (
          <div className="text-center"><Book size={40} className="mx-auto text-blue-300 mb-1" /><Text variant="tiny" className="text-gray-400">No cover</Text></div>
        )}
        {book.is_featured && <div className="absolute top-2 right-2"><Pill label="Featured" variant="purple" /></div>}
      </div>
      <div className="p-3 flex-1 flex flex-col">
        <Text variant="small" className="font-bold text-gray-900 line-clamp-2 mb-0.5">{book.title}</Text>
        <Text variant="tiny" className="text-gray-500 mb-2">{book.author || 'Unknown Author'}</Text>
        {book.class_level_names && book.class_level_names.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {book.class_level_names.slice(0, 2).map((cls, idx) => (<span key={idx} className="text-[8px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">{cls}</span>))}
            {book.class_level_names.length > 2 && <span className="text-[8px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">+{book.class_level_names.length - 2}</span>}
          </div>
        )}
        <div className="flex items-center gap-2 text-[9px] text-gray-400 mt-auto"><Eye size={8} /> {book.view_count || 0}<Download size={8} className="ml-1" /> {book.download_count || 0}</div>
        <div className="flex items-center justify-end gap-1 mt-2 pt-2 border-t border-gray-100">
          <IconBtn onClick={(e) => { e.stopPropagation(); onDownload(book); }} title="Download" variant="success"><Download size={12} /></IconBtn>
          {canManage && (<><IconBtn onClick={(e) => { e.stopPropagation(); onEdit(book); }} title="Edit" variant="primary"><Edit2 size={12} /></IconBtn><IconBtn onClick={(e) => { e.stopPropagation(); onDelete(book); }} title="Delete" variant="danger"><Trash2 size={12} /></IconBtn></>)}
        </div>
      </div>
    </Card>
  );
};

// Book Row Component (List View)
const BookRow = ({ book, onView, onDownload, onEdit, onDelete, canManage }) => (
  <div className="flex items-center justify-between p-3 hover:bg-gray-50 transition-colors border-b border-gray-100 cursor-pointer" onClick={() => onView(book)}>
    <div className="flex items-center gap-3 min-w-0 flex-1">
      <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0"><File size={16} className="text-blue-600" /></div>
      <div className="min-w-0 flex-1"><Text variant="small" className="font-bold text-gray-900 truncate">{book.title}</Text><Text variant="tiny" className="text-gray-500">{book.author || 'Unknown Author'}</Text></div>
    </div>
    <div className="hidden md:block w-28 text-[10px] text-gray-500 truncate">{book.class_level_names?.slice(0, 2).join(', ') || 'All Levels'}</div>
    <div className="hidden sm:flex items-center gap-2 text-[9px] text-gray-400 w-16"><Eye size={8} /> {book.view_count || 0}<Download size={8} /> {book.download_count || 0}</div>
    <div className="flex items-center gap-1"><IconBtn onClick={(e) => { e.stopPropagation(); onDownload(book); }} title="Download" variant="success"><Download size={12} /></IconBtn>{canManage && (<><IconBtn onClick={(e) => { e.stopPropagation(); onEdit(book); }} title="Edit" variant="primary"><Edit2 size={12} /></IconBtn><IconBtn onClick={(e) => { e.stopPropagation(); onDelete(book); }} title="Delete" variant="danger"><Trash2 size={12} /></IconBtn></>)}</div>
  </div>
);

// ============================================
// MAIN COMPONENT
// ============================================
export default function LibraryManagement() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const canManage = ['head', 'hm', 'principal', 'vice_principal', 'secretary', 'librarian', 'admin'].includes(user?.role);
  
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [viewMode, setViewMode] = useState('card');
  const [classLevels, setClassLevels] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 12;
  
  const [showBookModal, setShowBookModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [formData, setFormData] = useState({
    title: '', author: '', publisher: '', edition: '', isbn: '', category: '', tags: '', description: '',
    recommended_for: [], pdf_file: null, cover_image: null, is_featured: false, is_active: true
  });
  const [formLoading, setFormLoading] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  
  const pdfInputRef = useRef(null);
  const coverInputRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const categoryOptions = ['Textbook', 'Novel', 'Reference', 'Magazine', 'Journal', 'Children Book', 'Science', 'Mathematics', 'English', 'History', 'Geography', 'Religious', 'Arts', 'Computer', 'Business', 'Fiction', 'Non-Fiction'];

  const loadBooks = useCallback(async () => {
    try {
      setLoading(true);
      const params = { page: currentPage, limit: itemsPerPage, search: searchTerm || undefined, category: selectedCategory || undefined };
      Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);
      const data = await libraryService.getBooks(params);
      setBooks(data.results || data || []);
      setTotalPages(data.total_pages || Math.ceil((data.count || 0) / itemsPerPage) || 1);
      setTotalCount(data.count || 0);
    } catch (err) { setError(err.message || 'Failed to load books'); }
    finally { setLoading(false); }
  }, [currentPage, searchTerm, selectedCategory]);

  const loadClassLevels = async () => {
    try { const data = await getClassLevels(); setClassLevels(data.results || data || []); } 
    catch (err) { console.error('Failed to load class levels:', err); }
  };

  const loadStatistics = async () => {
    try { const data = await libraryService.getLibraryStatistics(); setStatistics(data.statistics || {}); } 
    catch (err) { console.error('Failed to load statistics:', err); }
  };

  useEffect(() => { loadBooks(); loadClassLevels(); loadStatistics(); }, [loadBooks]);

  const handleViewBook = async (book) => {
    try { setViewLoading(true); const data = await libraryService.getBookById(book.id); setSelectedBook(data.book || data); setShowViewModal(true); } 
    catch (err) { setError(err.message || 'Failed to load book details'); } 
    finally { setViewLoading(false); }
  };

  const handleDownloadBook = async (book) => {
    try {
      const data = await libraryService.downloadBook(book.id);
      if (data.download_url) { window.open(data.download_url, '_blank'); setSuccess(`Downloading "${book.title}"...`); setTimeout(() => setSuccess(''), 3000); loadStatistics(); }
    } catch (err) { setError(err.message || 'Failed to download book'); setTimeout(() => setError(''), 5000); }
  };

  const handleEditBook = (book) => {
    setEditingBook(book);
    setFormData({
      title: book.title || '', author: book.author || '', publisher: book.publisher || '', edition: book.edition || '',
      isbn: book.isbn || '', category: book.category || '', tags: book.tags || '', description: book.description || '',
      recommended_for: book.recommended_for || [], pdf_file: null, cover_image: null, is_featured: book.is_featured || false, is_active: book.is_active !== false
    });
    setShowBookModal(true);
  };

  const handleDeleteBook = (book) => { setBookToDelete(book); setShowDeleteModal(true); };

  const confirmDelete = async () => {
    if (!bookToDelete) return;
    try { await libraryService.deleteBook(bookToDelete.id); setSuccess(`"${bookToDelete.title}" deleted successfully`); setShowDeleteModal(false); setBookToDelete(null); loadBooks(); loadStatistics(); setTimeout(() => setSuccess(''), 3000); } 
    catch (err) { setError(err.message || 'Failed to delete book'); setTimeout(() => setError(''), 5000); }
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') { if (files[0]) setFormData(prev => ({ ...prev, [name]: files[0] })); }
    else if (type === 'checkbox') setFormData(prev => ({ ...prev, [name]: checked }));
    else setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleClassLevelToggle = (levelId) => {
    setFormData(prev => ({ ...prev, recommended_for: prev.recommended_for.includes(levelId) ? prev.recommended_for.filter(id => id !== levelId) : [...prev.recommended_for, levelId] }));
  };

  const handleSubmitBook = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.title.trim()) { setError('Book title is required'); return; }
    if (!formData.pdf_file && !editingBook) { setError('PDF file is required'); return; }
    try {
      setFormLoading(true);
      const submitData = new FormData();
      submitData.append('title', formData.title || '');
      if (formData.author) submitData.append('author', formData.author);
      if (formData.publisher) submitData.append('publisher', formData.publisher);
      if (formData.edition) submitData.append('edition', formData.edition);
      if (formData.isbn) submitData.append('isbn', formData.isbn);
      if (formData.category) submitData.append('category', formData.category);
      if (formData.tags) submitData.append('tags', formData.tags);
      if (formData.description) submitData.append('description', formData.description);
      submitData.append('is_featured', formData.is_featured ? 'true' : 'false');
      submitData.append('is_active', formData.is_active ? 'true' : 'false');
      if (formData.recommended_for && formData.recommended_for.length > 0) { formData.recommended_for.forEach(id => { submitData.append('recommended_for', id); }); }
      if (formData.pdf_file && typeof formData.pdf_file === 'object' && formData.pdf_file.name) submitData.append('pdf_file', formData.pdf_file);
      if (formData.cover_image && typeof formData.cover_image === 'object' && formData.cover_image.name) submitData.append('cover_image', formData.cover_image);
      
      let response;
      if (editingBook) { response = await libraryService.updateBook(editingBook.id, submitData); setSuccess(response.message || 'Book updated successfully'); }
      else { response = await libraryService.createBook(submitData); setSuccess(response.message || 'Book uploaded successfully'); }
      setShowBookModal(false);
      resetForm();
      loadBooks();
      loadStatistics();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) { console.error('Upload error:', err); setError(err.message || 'Failed to save book. Please try again.'); setTimeout(() => setError(''), 5000); }
    finally { setFormLoading(false); }
  };

  const resetForm = () => {
    setEditingBook(null);
    setFormData({ title: '', author: '', publisher: '', edition: '', isbn: '', category: '', tags: '', description: '', recommended_for: [], pdf_file: null, cover_image: null, is_featured: false, is_active: true });
    if (pdfInputRef.current) pdfInputRef.current.value = '';
    if (coverInputRef.current) coverInputRef.current.value = '';
  };

  const clearFilters = () => { setSearchTerm(''); setSelectedCategory(''); setCurrentPage(1); loadBooks(); };

  const formatDate = (date) => { if (!date) return 'N/A'; return new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }); };

  const statsCards = statistics ? [
    { title: 'Total Books', value: statistics.total_books || 0, icon: Book, color: 'bg-blue-100' },
    { title: 'Total Downloads', value: statistics.total_downloads || 0, icon: Download, color: 'bg-green-100' },
    { title: 'Total Views', value: statistics.total_views || 0, icon: Eye, color: 'bg-purple-100' },
    { title: 'Featured', value: statistics.featured_books || 0, icon: Star, color: 'bg-amber-100' },
  ] : [];

  const hasActiveFilters = searchTerm !== '' || selectedCategory !== '';
  const displayViewMode = isMobile ? 'card' : viewMode;

  return (
    <DashboardLayout title="Library Management">
      <div className="h-[calc(100vh-120px)] flex flex-col px-3 sm:px-4 lg:px-6">
        
        {/* STICKY HEADER SECTION */}
        <div className="sticky top-0 z-20 bg-gray-50 -mx-3 sm:-mx-4 lg:-mx-6 px-3 sm:px-4 lg:px-6 pt-4 pb-2">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
           
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex bg-gray-100 rounded-xl p-1 gap-0.5">
                <button onClick={() => setViewMode('card')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'card' ? 'bg-white text-[#D94801] shadow-sm' : 'text-gray-500'}`}><LayoutGrid size={13} /> Cards</button>
                <button onClick={() => setViewMode('list')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'list' ? 'bg-white text-[#D94801] shadow-sm' : 'text-gray-500'}`}><List size={13} /> List</button>
              </div>
              <Button variant="outline" size="small" icon={RefreshCw} onClick={loadBooks} loading={loading}>Refresh</Button>
              {canManage && <Button variant="primary" size="small" icon={Plus} onClick={() => { resetForm(); setShowBookModal(true); }}>Upload</Button>}
            </div>
          </div>

          {error && <div className="mb-3"><Alert type="error" message={error} onClose={() => setError('')} /></div>}
          {success && <div className="mb-3"><Alert type="success" message={success} onClose={() => setSuccess('')} /></div>}

          {!loading && statsCards.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">{statsCards.map((s, i) => (<StatCard key={i} {...s} />))}</div>
          )}

          <div className="flex flex-col sm:flex-row gap-2 mb-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
              <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && loadBooks()} placeholder="Search by title, author, publisher, ISBN..." className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]" />
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]">
                <option value="">All Categories</option>
                {categoryOptions.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              <Button variant="primary" size="small" onClick={loadBooks} icon={Search}>Search</Button>
              {hasActiveFilters && <Button variant="ghost" size="small" onClick={clearFilters}><X size={12} /> Clear</Button>}
            </div>
            <button onClick={() => setShowMobileFilter(true)} className="sm:hidden flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 bg-white rounded-xl text-sm"><Filter size={14} /> Filter</button>
          </div>

          <MobileFilterSheet isOpen={showMobileFilter} onClose={() => setShowMobileFilter(false)} searchTerm={searchTerm} setSearchTerm={setSearchTerm} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} categoryOptions={categoryOptions} onApply={loadBooks} onClear={clearFilters} />

          {!loading && books.length > 0 && (
            <div className="flex items-center justify-between mt-2"><Text variant="tiny" className="text-gray-400">Showing {books.length} of {totalCount} books</Text></div>
          )}
        </div>

        {/* SCROLLABLE CONTENT SECTION */}
        <div className="flex-1 overflow-y-auto min-h-0 -mx-3 sm:-mx-4 lg:-mx-6 px-3 sm:px-4 lg:px-6 pb-4">
          <Card className="overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center min-h-[200px] py-12"><RefreshCw className="animate-spin h-8 w-8 text-[#D94801]" /></div>
            ) : books.length === 0 ? (
              <div className="p-12 text-center"><Book size={32} className="mx-auto text-gray-200 mb-2" /><Text variant="body" className="text-gray-400">No books found</Text>{hasActiveFilters ? <Button variant="outline" size="small" className="mt-3" onClick={clearFilters}>Clear Filters</Button> : canManage && <Button variant="primary" size="small" className="mt-3" onClick={() => { resetForm(); setShowBookModal(true); }}><Upload size={12} /> Upload First Book</Button>}</div>
            ) : displayViewMode === 'card' ? (
              <div className="p-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {books.map((book) => (<BookCard key={book.id} book={book} onView={handleViewBook} onDownload={handleDownloadBook} onEdit={handleEditBook} onDelete={handleDeleteBook} canManage={canManage} />))}
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <div className="sticky top-0 bg-gray-50 border-b border-gray-100 px-3 py-2"><div className="flex items-center text-[9px] font-bold text-gray-400 uppercase tracking-wider"><div className="flex-1 pl-9">Book</div><div className="w-28 hidden md:block">Recommended For</div><div className="w-16 hidden sm:block">Stats</div><div className="w-28 text-right">Actions</div></div></div>
                <div className="divide-y divide-gray-50">{books.map((book) => (<BookRow key={book.id} book={book} onView={handleViewBook} onDownload={handleDownloadBook} onEdit={handleEditBook} onDelete={handleDeleteBook} canManage={canManage} />))}</div>
              </div>
            )}
          </Card>

          {totalPages > 1 && !loading && books.length > 0 && (
            <div className="flex items-center justify-between mt-4 px-2"><Text variant="tiny" className="text-gray-400">Page {currentPage} of {totalPages}</Text><div className="flex items-center gap-2"><button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center disabled:opacity-40 hover:bg-gray-50"><ChevronLeft size={14} /></button><button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center disabled:opacity-40 hover:bg-gray-50"><ChevronRight size={14} /></button></div></div>
          )}
        </div>
      </div>

      {/* Upload/Edit Book Modal */}
      <Modal isOpen={showBookModal} onClose={() => setShowBookModal(false)} title={editingBook ? 'Edit Book' : 'Upload New Book'} size="lg">
        <form onSubmit={handleSubmitBook} className="py-3 max-h-[70vh] overflow-y-auto space-y-3 px-1">
          <div className="grid grid-cols-2 gap-3"><div><label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Title <span className="text-red-500">*</span></label><input type="text" name="title" value={formData.title} onChange={handleFormChange} required className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]" /></div><div><label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Author</label><input type="text" name="author" value={formData.author} onChange={handleFormChange} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm" /></div></div>
          <div className="grid grid-cols-2 gap-3"><div><label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Publisher</label><input type="text" name="publisher" value={formData.publisher} onChange={handleFormChange} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm" /></div><div><label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Edition</label><input type="text" name="edition" value={formData.edition} onChange={handleFormChange} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm" /></div></div>
          <div className="grid grid-cols-2 gap-3"><div><label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">ISBN</label><input type="text" name="isbn" value={formData.isbn} onChange={handleFormChange} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm" /></div><div><label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Category</label><select name="category" value={formData.category} onChange={handleFormChange} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm"><option value="">Select Category</option>{categoryOptions.map(cat => <option key={cat} value={cat}>{cat}</option>)}</select></div></div>
          <div><label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Tags (comma-separated)</label><input type="text" name="tags" value={formData.tags} onChange={handleFormChange} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm" placeholder="e.g., mathematics, science" /></div>
          <div><label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">PDF File <span className="text-red-500">{!editingBook ? '*' : ''}</span></label><input ref={pdfInputRef} type="file" name="pdf_file" onChange={handleFormChange} accept=".pdf" className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm" />{editingBook && !formData.pdf_file && <p className="text-[8px] text-gray-400 mt-1">Leave empty to keep existing file</p>}</div>
          <div><label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Cover Image</label><input ref={coverInputRef} type="file" name="cover_image" onChange={handleFormChange} accept="image/*" className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm" /></div>
          <div><label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Description</label><textarea name="description" value={formData.description} onChange={handleFormChange} rows={2} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm" /></div>
          <div><label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Recommended For</label><div className="flex flex-wrap gap-1 max-h-28 overflow-y-auto p-2 border border-gray-200 rounded-xl">{classLevels.map(level => (<button key={level.id} type="button" onClick={() => handleClassLevelToggle(level.id)} className={`px-2 py-1 text-[9px] font-medium rounded-full transition-all ${formData.recommended_for.includes(level.id) ? 'bg-[#D94801] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{level.name}</button>))}</div></div>
          <div className="flex gap-3"><label className="flex items-center gap-2"><input type="checkbox" name="is_featured" checked={formData.is_featured} onChange={handleFormChange} className="w-3 h-3 rounded" /><span className="text-[10px] text-gray-700">Featured</span></label><label className="flex items-center gap-2"><input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleFormChange} className="w-3 h-3 rounded" /><span className="text-[10px] text-gray-700">Active</span></label></div>
          <div className="flex gap-3 pt-2"><Button variant="outline" onClick={() => setShowBookModal(false)} className="flex-1">Cancel</Button><Button variant="primary" type="submit" disabled={formLoading} className="flex-1">{formLoading ? 'Saving...' : (editingBook ? 'Update' : 'Upload')}</Button></div>
        </form>
      </Modal>

      {/* View Book Modal */}
      <Modal isOpen={showViewModal} onClose={() => setShowViewModal(false)} title="Book Details" size="lg">
        <div className="py-3 max-h-[70vh] overflow-y-auto space-y-3">
          {viewLoading ? <div className="flex justify-center py-12"><RefreshCw className="animate-spin h-8 w-8 text-[#D94801]" /></div> : selectedBook ? (<><div className="flex items-start gap-3"><div className="w-16 h-20 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">{selectedBook.cover_image_url ? <img src={selectedBook.cover_image_url} alt={selectedBook.title} className="w-full h-full object-cover rounded-xl" /> : <File size={24} className="text-blue-400" />}</div><div><Text variant="h4" className="font-bold">{selectedBook.title}</Text><Text variant="caption" className="text-gray-500">{selectedBook.author || 'Unknown Author'}</Text><div className="flex gap-1 mt-1">{selectedBook.category && <Pill label={selectedBook.category} variant="blue" />}{selectedBook.is_featured && <Pill label="Featured" variant="purple" />}</div></div></div>
          <div className="grid grid-cols-2 gap-2"><div className="p-2 bg-gray-50 rounded-xl"><Text variant="tiny" className="text-gray-400">Publisher</Text><Text variant="small" className="font-medium">{selectedBook.publisher || 'N/A'}</Text></div><div className="p-2 bg-gray-50 rounded-xl"><Text variant="tiny" className="text-gray-400">Edition</Text><Text variant="small" className="font-medium">{selectedBook.edition || 'N/A'}</Text></div><div className="p-2 bg-gray-50 rounded-xl"><Text variant="tiny" className="text-gray-400">ISBN</Text><Text variant="small" className="font-medium font-mono">{selectedBook.isbn || 'N/A'}</Text></div><div className="p-2 bg-gray-50 rounded-xl"><Text variant="tiny" className="text-gray-400">File Size</Text><Text variant="small" className="font-medium">{selectedBook.file_size ? `${(selectedBook.file_size / 1024 / 1024).toFixed(2)} MB` : 'N/A'}</Text></div></div>
          {selectedBook.description && <div><Text variant="tiny" className="font-bold text-gray-400 uppercase">Description</Text><Text variant="small" className="text-gray-700 mt-1">{selectedBook.description}</Text></div>}
          {selectedBook.recommended_for_details && selectedBook.recommended_for_details.length > 0 && (<div><Text variant="tiny" className="font-bold text-gray-400 uppercase">Recommended For</Text><div className="flex flex-wrap gap-1 mt-1">{selectedBook.recommended_for_details.map(cls => (<span key={cls.id} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[9px] font-medium rounded-lg">{cls.name}</span>))}</div></div>)}
          <div className="grid grid-cols-2 gap-2"><div className="text-center p-2 bg-gray-50 rounded-xl"><Eye size={14} className="mx-auto text-gray-400 mb-1" /><Text variant="h4" className="font-bold">{selectedBook.view_count || 0}</Text><Text variant="tiny" className="text-gray-400">Views</Text></div><div className="text-center p-2 bg-gray-50 rounded-xl"><Download size={14} className="mx-auto text-gray-400 mb-1" /><Text variant="h4" className="font-bold">{selectedBook.download_count || 0}</Text><Text variant="tiny" className="text-gray-400">Downloads</Text></div></div>
          <div className="text-center"><Text variant="tiny" className="text-gray-400">Uploaded by {selectedBook.uploaded_by_name || 'Unknown'} on {formatDate(selectedBook.uploaded_at)}</Text></div>
          <div className="flex gap-3 pt-2"><Button variant="success" onClick={() => handleDownloadBook(selectedBook)} className="flex-1"><Download size={12} /> Download PDF</Button>{canManage && <Button variant="primary" onClick={() => { setShowViewModal(false); handleEditBook(selectedBook); }}><Edit2 size={12} /> Edit</Button>}</div></>) : null}
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete Book" size="sm">
        <div className="py-3 text-center"><div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3"><Trash2 size={20} className="text-red-500" /></div><Text variant="h4" className="font-bold mb-1">Delete "{bookToDelete?.title}"?</Text><Text variant="caption" className="text-gray-500 mb-4 block">This action cannot be undone.</Text><div className="flex gap-2"><Button variant="outline" onClick={() => setShowDeleteModal(false)} className="flex-1">Cancel</Button><Button variant="danger" onClick={confirmDelete} className="flex-1">Delete</Button></div></div>
      </Modal>
    </DashboardLayout>
  );
}