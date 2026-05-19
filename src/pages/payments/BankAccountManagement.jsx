import React, { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import Alert from '../../components/common/Alert';
import Modal from '../../components/common/modal';
import { getBankAccounts, createBankAccount, updateBankAccount, deleteBankAccount } from '../../services/bankAccountService';
import { 
  Building2, 
  Plus, 
  Edit, 
  Trash2, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Eye, 
  CreditCard, 
  Banknote,
  Search,
  Filter,
  Grid3x3,
  Table2,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';

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

// Status Badge
const StatusBadge = ({ isActive, isDefault }) => {
  return (
    <div className="flex flex-wrap gap-1">
      {isDefault && (
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[8px] md:text-[9px] font-medium bg-green-100 text-green-700">
          <CheckCircle size={8} /> Default
        </span>
      )}
      {!isActive && (
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[8px] md:text-[9px] font-medium bg-gray-100 text-gray-500">
          <XCircle size={8} /> Inactive
        </span>
      )}
    </div>
  );
};

// Bank Account Card Component (for mobile grid view)
const BankAccountCard = ({ account, onEdit, onDelete }) => (
  <Card className="p-3 space-y-2 hover:shadow-md transition-shadow duration-200 h-full">
    <div className="flex justify-between items-start gap-2">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <Building2 size={14} className="text-gray-600" />
        </div>
        <div className="flex-1 min-w-0">
          <Text variant="tiny" className="font-bold text-gray-800 truncate">{account.bank_name}</Text>
          {account.description && (
            <Text variant="caption" className="text-gray-400 truncate text-[8px]">{account.description}</Text>
          )}
        </div>
      </div>
      <div className="flex gap-0.5">
        <button onClick={() => onEdit(account)} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
          <Edit size={12} />
        </button>
        <button onClick={() => onDelete(account)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
          <Trash2 size={12} />
        </button>
      </div>
    </div>
    
    <div className="space-y-1">
      <div>
        <Text variant="caption" className="text-gray-400 text-[8px]">Account Name</Text>
        <Text variant="tiny" className="font-medium text-gray-800 truncate">{account.account_name}</Text>
      </div>
      <div>
        <Text variant="caption" className="text-gray-400 text-[8px]">Account Number</Text>
        <Text variant="tiny" className="text-gray-600 font-mono">{account.account_number}</Text>
      </div>
      {account.sort_code && (
        <div>
          <Text variant="caption" className="text-gray-400 text-[8px]">Sort Code</Text>
          <Text variant="tiny" className="text-gray-600">{account.sort_code}</Text>
        </div>
      )}
    </div>
    
    <div className="flex items-center justify-between pt-1">
      <StatusBadge isActive={account.is_active} isDefault={account.is_default} />
      {account.created_by_name && (
        <Text variant="tiny" className="text-gray-400">By {account.created_by_name}</Text>
      )}
    </div>
  </Card>
);

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

// ============================================
// MAIN COMPONENT
// ============================================
const BankAccountManagement = () => {
  const { user } = useAuth();
  const isAdmin = ['head', 'hm', 'principal', 'vice_principal', 'accountant'].includes(user?.role);
  
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('table');
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  
  const [formData, setFormData] = useState({
    bank_name: '',
    account_name: '',
    account_number: '',
    sort_code: '',
    is_active: true,
    is_default: false,
    description: ''
  });

  const loadAccounts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getBankAccounts();
      setAccounts(data.results || data || []);
      setCurrentPage(1);
    } catch (err) {
      console.error('❌ Error loading bank accounts:', err);
      setError('Failed to load bank accounts');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) loadAccounts();
  }, [isAdmin, loadAccounts]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.bank_name || !formData.account_name || !formData.account_number) {
      setError('Please fill in all required fields');
      return;
    }
    try {
      if (editingAccount) {
        await updateBankAccount(editingAccount.id, formData);
        setSuccess('Bank account updated successfully');
      } else {
        await createBankAccount(formData);
        setSuccess('Bank account created successfully');
      }
      setIsModalOpen(false);
      resetForm();
      loadAccounts();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('❌ Error saving bank account:', err);
      setError(err.message || 'Failed to save bank account');
    }
  };

  const handleEdit = (account) => {
    setEditingAccount(account);
    setFormData({
      bank_name: account.bank_name,
      account_name: account.account_name,
      account_number: account.account_number,
      sort_code: account.sort_code || '',
      is_active: account.is_active,
      is_default: account.is_default,
      description: account.description || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (account) => {
    if (!window.confirm(`Delete bank account "${account.bank_name} - ${account.account_name}"? This action cannot be undone.`)) return;
    try {
      await deleteBankAccount(account.id);
      setSuccess('Bank account deleted');
      loadAccounts();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('❌ Error deleting bank account:', err);
      setError('Failed to delete bank account');
    }
  };

  const resetForm = () => {
    setEditingAccount(null);
    setFormData({
      bank_name: '',
      account_name: '',
      account_number: '',
      sort_code: '',
      is_active: true,
      is_default: false,
      description: ''
    });
    setError('');
  };

  // Filter accounts based on search
  const filteredAccounts = accounts.filter(account => {
    const searchString = searchTerm.toLowerCase();
    return (
      account.bank_name?.toLowerCase().includes(searchString) ||
      account.account_name?.toLowerCase().includes(searchString) ||
      account.account_number?.includes(searchString) ||
      account.description?.toLowerCase().includes(searchString)
    );
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);
  const paginatedAccounts = filteredAccounts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const stats = {
    total: accounts.length,
    active: accounts.filter(a => a.is_active).length,
    default: accounts.filter(a => a.is_default).length,
    inactive: accounts.filter(a => !a.is_active).length
  };

  const hasActiveFilters = searchTerm !== '';

  // Detect mobile screen
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const displayViewMode = isMobile ? 'card' : viewMode;

  if (!isAdmin) {
    return (
      <DashboardLayout title="Access Denied">
        <div className="flex items-center justify-center min-h-[60vh] px-4">
          <div className="text-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="text-red-500" size={28} />
            </div>
            <Text variant="h3" className="font-bold text-gray-800 mb-2">Access Denied</Text>
            <Text variant="body" className="text-gray-500">Only administrators can manage bank accounts.</Text>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (loading && accounts.length === 0) {
    return (
      <DashboardLayout title="Bank Accounts">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <RefreshCw className="animate-spin h-8 w-8 text-[#D94801] mx-auto mb-4" />
            <Text variant="body" className="text-gray-400">Loading bank accounts...</Text>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Bank Accounts">
      {/* Fixed height container with internal scrolling - only table/card scrolls */}
      <div className="h-[calc(100vh-120px)] flex flex-col px-3 sm:px-4 lg:px-6">
        
        {/* STICKY HEADER SECTION - Everything above the table/card stays fixed */}
        <div className="sticky top-0 z-20 bg-gray-50 -mx-3 sm:-mx-4 lg:-mx-6 px-3 sm:px-4 lg:px-6 pt-4 pb-2">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="small" icon={RefreshCw} onClick={loadAccounts} loading={loading}>
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
            <StatCard title="Total Accounts" value={stats.total} icon={Building2} color="bg-gray-100" />
            <StatCard title="Active Accounts" value={stats.active} icon={CheckCircle} color="bg-green-100" />
            <StatCard title="Default Account" value={stats.default} icon={Banknote} color="bg-blue-100" />
            <StatCard title="Inactive" value={stats.inactive} icon={XCircle} color="bg-red-100" />
          </div>

          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-2 mb-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                placeholder="Search by bank name, account name, or number..."
                className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801] focus:border-transparent"
              />
            </div>
            
            {/* Desktop filters */}
            <div className="hidden sm:flex items-center gap-2">
              {hasActiveFilters && (
                <Button variant="ghost" size="tiny" onClick={() => { setSearchTerm(''); }}>
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
          </div>
        </div>

        {/* SCROLLABLE CONTENT SECTION - Only table/card scrolls here */}
        <div className="flex-1 overflow-y-auto min-h-0 -mx-3 sm:-mx-4 lg:-mx-6 px-3 sm:px-4 lg:px-6 pb-4">
          <Card className="overflow-hidden">
            {paginatedAccounts.length === 0 ? (
              <div className="p-8 text-center">
                <Building2 size={32} className="mx-auto text-gray-200 mb-2" />
                <Text variant="body" className="text-gray-400">No bank accounts found</Text>
                {hasActiveFilters ? (
                  <Button variant="outline" size="small" className="mt-3" onClick={() => setSearchTerm('')}>
                    Clear Search
                  </Button>
                ) : (
                  <Button variant="primary" size="small" className="mt-3" onClick={() => { resetForm(); setIsModalOpen(true); }}>
                    Add your first bank account
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
                          <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Bank Details</th>
                          <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Account Info</th>
                          <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">Created By</th>
                          <th className="px-4 py-3 text-right text-[10px] font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {paginatedAccounts.map((account) => (
                          <tr key={account.id} className="hover:bg-gray-50 transition-colors duration-150">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <Building2 size={14} className="text-gray-600" />
                                </div>
                                <div>
                                  <Text variant="small" className="font-semibold text-gray-800">{account.bank_name}</Text>
                                  {account.description && (
                                    <Text variant="caption" className="text-gray-400 line-clamp-1">{account.description}</Text>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <Text variant="small" className="font-medium text-gray-800">{account.account_name}</Text>
                              <Text variant="caption" className="text-gray-400 font-mono block">
                                {account.account_number}
                                {account.sort_code && ` • ${account.sort_code}`}
                              </Text>
                            </td>
                            <td className="px-4 py-3">
                              <StatusBadge isActive={account.is_active} isDefault={account.is_default} />
                            </td>
                            <td className="px-4 py-3 hidden md:table-cell">
                              <Text variant="tiny" className="text-gray-500">{account.created_by_name || '—'}</Text>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button onClick={() => handleEdit(account)} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors" title="Edit">
                                  <Edit size={14} />
                                </button>
                                <button onClick={() => handleDelete(account)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
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
                      {paginatedAccounts.map((account) => (
                        <BankAccountCard
                          key={account.id}
                          account={account}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
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
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredAccounts.length)} of {filteredAccounts.length} accounts
                  </Text>
                </div>
              </>
            )}
          </Card>
        </div>

        {/* Quick Tip - Sticky at bottom of scroll area */}
        {accounts.length > 0 && (
          <div className="sticky bottom-2 mt-2 bg-blue-50 border border-blue-200 rounded-xl p-2 sm:p-3">
            <Text variant="caption" className="text-blue-700 flex items-center gap-2">
              <Banknote size={12} />
              The default account will be pre-selected when parents make fee payments.
            </Text>
          </div>
        )}
      </div>

      {/* Add/Edit Modal - Responsive */}
      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); resetForm(); }} title={editingAccount ? 'Edit Bank Account' : 'Add Bank Account'} size="md">
        <form onSubmit={handleSubmit} className="py-3 space-y-4 max-h-[70vh] overflow-y-auto px-1">
          <div>
            <label className="block text-[10px] font-medium text-gray-500 mb-1">Bank Name <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              value={formData.bank_name} 
              onChange={e => setFormData({...formData, bank_name: e.target.value})} 
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]" 
              placeholder="e.g., First Bank, GTBank, UBA"
              required 
            />
          </div>
          
          <div>
            <label className="block text-[10px] font-medium text-gray-500 mb-1">Account Name <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              value={formData.account_name} 
              onChange={e => setFormData({...formData, account_name: e.target.value})} 
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]" 
              placeholder="Full account holder name"
              required 
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-medium text-gray-500 mb-1">Account Number <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                value={formData.account_number} 
                onChange={e => setFormData({...formData, account_number: e.target.value})} 
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801] font-mono" 
                placeholder="10-digit account number"
                maxLength={10}
                required 
              />
            </div>
            <div>
              <label className="block text-[10px] font-medium text-gray-500 mb-1">Sort Code</label>
              <input 
                type="text" 
                value={formData.sort_code} 
                onChange={e => setFormData({...formData, sort_code: e.target.value})} 
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801] font-mono" 
                placeholder="e.g., 011234567"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-[10px] font-medium text-gray-500 mb-1">Description</label>
            <textarea 
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})} 
              rows={2} 
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801] resize-none" 
              placeholder="Optional: Additional notes about this account"
            />
          </div>
          
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={formData.is_active} 
                onChange={e => setFormData({...formData, is_active: e.target.checked})} 
                className="w-3 h-3 text-[#D94801] rounded border-gray-300 focus:ring-[#D94801]" 
              />
              <span className="text-[10px] text-gray-700">Active</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={formData.is_default} 
                onChange={e => setFormData({...formData, is_default: e.target.checked})} 
                className="w-3 h-3 text-[#D94801] rounded border-gray-300 focus:ring-[#D94801]" 
              />
              <span className="text-[10px] text-gray-700">Set as Default</span>
            </label>
          </div>
          
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={() => { setIsModalOpen(false); resetForm(); }} className="flex-1">
              Cancel
            </Button>
            <Button variant="primary" type="submit" className="flex-1">
              {editingAccount ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};

export default BankAccountManagement;