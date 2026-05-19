/**
 * Class Management Page — Redesigned with Consistent Design System
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import Alert from '../../components/common/Alert';
import Modal from '../../components/common/modal';
import {
  School, Users, UserCheck, UserPlus, RefreshCw, Eye,
  ChevronDown, ChevronUp, GraduationCap, Phone, Mail,
  Trash2, User, AlertCircle, LayoutGrid, List,
  Search, Building2, Layers, BookMarked,
  X, Filter, CheckCircle
} from 'lucide-react';
import {
  getAllClassesWithStudents,
  getClassDetailWithStudents,
  getAvailableStaff,
  assignClassTeacher,
  removeClassTeacher,
  assignAssistantTeacher,
  removeAssistantTeacher,
} from '../../services/classManagementService';
import useAuth from '../../hooks/useAuth';

// ============================================
// DESIGN SYSTEM COMPONENTS
// ============================================

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

const Card = ({ children, className = '', hover = false }) => (
  <div className={`bg-white rounded-2xl shadow-sm ${hover ? 'transition-shadow duration-200 hover:shadow-md' : ''} ${className}`}>
    {children}
  </div>
);

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

const StreamBadge = ({ stream }) => {
  const config = {
    science: { bg: 'bg-cyan-100', text: 'text-cyan-700', label: 'Science' },
    commercial: { bg: 'bg-violet-100', text: 'text-violet-700', label: 'Commercial' },
    arts: { bg: 'bg-rose-100', text: 'text-rose-700', label: 'Arts' },
    art: { bg: 'bg-rose-100', text: 'text-rose-700', label: 'Arts' },
    general: { bg: 'bg-slate-100', text: 'text-slate-600', label: 'General' },
    technical: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Technical' },
  };
  const c = config[stream] || { bg: 'bg-gray-100', text: 'text-gray-600', label: stream || 'General' };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] md:text-[10px] font-medium ${c.bg} ${c.text}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
      {c.label}
    </span>
  );
};

const StatusBadge = ({ status }) => {
  const config = {
    active: { bg: 'bg-green-100', text: 'text-green-700', label: 'Active' },
    inactive: { bg: 'bg-red-100', text: 'text-red-700', label: 'Inactive' },
    graduated: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Graduated' }
  };
  const c = config[status] || config.active;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] md:text-[10px] font-medium ${c.bg} ${c.text}`}>
      {c.label}
    </span>
  );
};

const CapBar = ({ count = 0, max = 1 }) => {
  const pct = Math.min(100, max > 0 ? (count / max) * 100 : 0);
  const color = pct >= 90 ? 'bg-red-500' : pct >= 70 ? 'bg-amber-400' : 'bg-emerald-500';
  return (
    <div className="w-full">
      <div className="flex justify-between text-[9px] text-gray-400 mb-1 font-medium">
        <span>{count} / {max} students</span>
        <span>{Math.round(pct)}%</span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

const AvatarInitial = ({ name = '?', size = 'md', colorClass = 'bg-indigo-100 text-indigo-700' }) => {
  const s = size === 'sm' ? 'w-7 h-7 text-xs' : size === 'lg' ? 'w-12 h-12 text-lg' : 'w-9 h-9 text-sm';
  return (
    <div className={`${s} ${colorClass} rounded-full flex items-center justify-center font-bold flex-shrink-0 border-2 border-white shadow-sm`}>
      {name.charAt(0).toUpperCase()}
    </div>
  );
};

const IconBtn = ({ onClick, title, children, variant = 'ghost' }) => {
  const variants = {
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-500 hover:text-gray-700 border-transparent',
    primary: 'bg-[#D94801]/10 hover:bg-[#D94801]/20 text-[#D94801] border-[#D94801]/20',
    success: 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border-emerald-100',
    info: 'bg-sky-50 hover:bg-sky-100 text-sky-600 border-sky-100',
    danger: 'bg-red-50 hover:bg-red-100 text-red-500 border-red-100',
    muted: 'bg-gray-50 hover:bg-gray-100 text-gray-500 border-gray-100',
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

const StaffCard = ({ staff, onRemove, isAdmin, theme = 'green' }) => {
  const themes = {
    green: { wrap: 'bg-emerald-50 border-emerald-200', avatar: 'bg-emerald-100 text-emerald-700' },
    blue: { wrap: 'bg-sky-50 border-sky-200', avatar: 'bg-sky-100 text-sky-700' },
  };
  const t = themes[theme] || themes.green;
  
  const getRoleLabel = (role) => {
    const roleMap = {
      teacher: 'Teacher',
      form_teacher: 'Form Teacher',
      subject_teacher: 'Subject Teacher',
      head: 'Head of School',
      hm: 'Head Master',
      principal: 'Principal',
      vice_principal: 'Vice Principal',
      accountant: 'Accountant',
      secretary: 'Secretary',
      librarian: 'Librarian',
    };
    return roleMap[role] || role || 'Staff';
  };
  
  return (
    <div className={`flex items-center justify-between p-3 rounded-xl border ${t.wrap}`}>
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <AvatarInitial name={staff.name} colorClass={t.avatar} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <Text variant="small" className="font-bold text-gray-800 truncate">{staff.name}</Text>
            <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-white/80 text-gray-600">
              {getRoleLabel(staff.role)}
            </span>
          </div>
          <Text variant="tiny" className="text-gray-500">ID: {staff.staff_id || 'N/A'} · {staff.position || staff.department || 'Staff'}</Text>
          <div className="flex flex-wrap gap-2 mt-0.5">
            {staff.email && <span className="flex items-center gap-1 text-[9px] text-gray-400"><Mail size={8} />{staff.email}</span>}
            {staff.phone && <span className="flex items-center gap-1 text-[9px] text-gray-400"><Phone size={8} />{staff.phone}</span>}
          </div>
        </div>
      </div>
      {isAdmin && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-2 w-7 h-7 flex items-center justify-center rounded-lg bg-white border border-red-200 text-red-400 hover:bg-red-50 hover:text-red-600 transition-all flex-shrink-0"
        >
          <Trash2 size={12} />
        </button>
      )}
    </div>
  );
};

const ClassCard = ({ cls, isAdmin, onView, onAssignTeacher, onRemoveTeacher, onAssignAssistant, onViewStudents }) => (
  <Card className="overflow-hidden hover:shadow-lg transition-all duration-200 h-full flex flex-col">
    <div className={`h-1 w-full bg-gradient-to-r from-[#D94801] to-[#C24000]`} />
    <div className="p-4 flex flex-col flex-1 gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <Text variant="small" className="font-bold text-gray-900 truncate">{cls.name}</Text>
          <Text variant="tiny" className="text-gray-400 font-mono">{cls.code}</Text>
        </div>
        <IconBtn onClick={onView} title="View Details" variant="primary"><Eye size={13} /></IconBtn>
      </div>
      
      <div className="flex flex-wrap gap-1.5">
        {cls.stream && cls.stream !== 'none' && cls.stream !== 'general' && <StreamBadge stream={cls.stream} />}
        <StatusBadge status={cls.status} />
        {cls.room_number && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-medium bg-gray-100 text-gray-500">
            <Building2 size={8} />{cls.room_number}
          </span>
        )}
      </div>
      
      <CapBar count={cls.student_count} max={cls.max_capacity} />
      
      <div className="flex-1">
        {cls.class_teacher ? (
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2">
            <AvatarInitial name={cls.class_teacher.name} size="sm" colorClass="bg-emerald-200 text-emerald-800" />
            <div className="min-w-0 flex-1">
              <Text variant="tiny" className="font-bold text-gray-700 truncate">{cls.class_teacher.name}</Text>
              <Text variant="tiny" className="text-emerald-600 font-semibold">Class Teacher</Text>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 bg-gray-50 border border-dashed border-gray-200 rounded-xl px-3 py-2">
            <div className="w-7 h-7 rounded-full border border-dashed border-gray-300 flex items-center justify-center">
              <User size={11} className="text-gray-300" />
            </div>
            <Text variant="tiny" className="text-gray-400">No teacher assigned</Text>
          </div>
        )}
      </div>
      
      {isAdmin && (
        <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
          {cls.class_teacher ? (
            <Button variant="danger" size="tiny" onClick={onRemoveTeacher} className="flex-1"><Trash2 size={10} /> Remove</Button>
          ) : (
            <Button variant="success" size="tiny" onClick={onAssignTeacher} className="flex-1"><UserCheck size={10} /> Assign</Button>
          )}
          <IconBtn onClick={onAssignAssistant} title="Add Assistant" variant="info"><UserPlus size={12} /></IconBtn>
          <IconBtn onClick={onViewStudents} title="View Students" variant="muted"><Users size={12} /></IconBtn>
        </div>
      )}
    </div>
  </Card>
);

const ClassRow = ({ cls, isAdmin, onView, onAssignTeacher, onRemoveTeacher, onAssignAssistant, onViewStudents }) => (
  <tr className="hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0">
    <td className="px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="w-1 h-8 rounded-full bg-gradient-to-b from-[#D94801] to-[#C24000]" />
        <div>
          <Text variant="small" className="font-bold text-gray-900">{cls.name}</Text>
          <Text variant="tiny" className="text-gray-400 font-mono">{cls.code}</Text>
        </div>
      </div>
    </td>
    <td className="px-3 py-3 hidden md:table-cell">
      <div className="flex flex-wrap gap-1">
        {cls.stream && cls.stream !== 'none' && cls.stream !== 'general' && <StreamBadge stream={cls.stream} />}
        <StatusBadge status={cls.status} />
      </div>
    </td>
    <td className="px-3 py-3 hidden lg:table-cell">
      {cls.class_teacher ? (
        <div className="flex items-center gap-2">
          <AvatarInitial name={cls.class_teacher.name} size="sm" colorClass="bg-emerald-100 text-emerald-700" />
          <div>
            <Text variant="tiny" className="font-bold text-gray-700">{cls.class_teacher.name}</Text>
            <Text variant="tiny" className="text-emerald-600">Class Teacher</Text>
          </div>
        </div>
      ) : (
        <span className="text-xs text-gray-400 italic">Unassigned</span>
      )}
    </td>
    <td className="px-3 py-3 hidden xl:table-cell">
      <div className="w-28"><CapBar count={cls.student_count} max={cls.max_capacity} /></div>
    </td>
    <td className="px-3 py-3">
      <div className="flex items-center justify-end gap-1">
        <IconBtn onClick={onView} title="View" variant="primary"><Eye size={12} /></IconBtn>
        {isAdmin && (
          <>
            {cls.class_teacher
              ? <IconBtn onClick={onRemoveTeacher} title="Remove Teacher" variant="danger"><Trash2 size={12} /></IconBtn>
              : <IconBtn onClick={onAssignTeacher} title="Assign Teacher" variant="success"><UserCheck size={12} /></IconBtn>
            }
            <IconBtn onClick={onAssignAssistant} title="Add Assistant" variant="info"><UserPlus size={12} /></IconBtn>
          </>
        )}
        <IconBtn onClick={onViewStudents} title="Students" variant="muted"><Users size={12} /></IconBtn>
      </div>
    </td>
  </tr>
);

const MobileFilterSheet = ({ isOpen, onClose, search, setSearch, onClear }) => {
  const [localSearch, setLocalSearch] = useState(search);
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 transition-opacity" onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 p-5 animate-in slide-in-from-bottom duration-200 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <Text variant="h4" className="font-semibold">Filter Classes</Text>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100"><X size={18} /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
              <input type="text" value={localSearch} onChange={(e) => setLocalSearch(e.target.value)} placeholder="Search by name, code or teacher..." className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]" />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="primary" size="medium" onClick={() => { setSearch(localSearch); onClose(); }} className="flex-1">Apply</Button>
            <button onClick={() => { setLocalSearch(''); setSearch(''); onClear(); onClose(); }} className="px-4 py-2 text-red-500 font-medium text-sm">Clear</button>
          </div>
        </div>
      </div>
    </>
  );
};

const AssignModal = ({ isOpen, onClose, title, subtitle, icon, iconBg, staffList, loading, selectedId, onSelect, onConfirm, confirming, searchTerm, onSearchChange, totalStaffCount }) => (
  <Modal isOpen={isOpen} onClose={onClose} title={title} size="md">
    <div className="py-3 space-y-4">
      <div className={`flex items-center gap-3 p-3 rounded-xl border ${iconBg}`}>
        <div className="w-9 h-9 rounded-xl bg-white/80 flex items-center justify-center shadow-sm">{icon}</div>
        <div>
          <Text variant="tiny" className="font-bold text-gray-500 uppercase tracking-wider">{title}</Text>
          <Text variant="small" className="font-bold text-gray-800">{subtitle}</Text>
        </div>
      </div>

      <div>
        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Search Staff</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
          <input 
            type="text" 
            value={searchTerm} 
            onChange={(e) => onSearchChange(e.target.value)} 
            placeholder="Search by name, staff ID or role..." 
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]" 
          />
        </div>
      </div>

      <div>
        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Select Staff Member</label>
        {loading ? (
          <div className="py-6 text-center">
            <RefreshCw className="animate-spin h-6 w-6 text-[#D94801] mx-auto mb-2" />
            <Text variant="tiny" className="text-gray-400">Loading staff list from all pages...</Text>
          </div>
        ) : staffList.length === 0 ? (
          <div className="py-6 text-center border border-dashed rounded-xl">
            <User size={24} className="mx-auto text-gray-300 mb-2" />
            <Text variant="tiny" className="text-gray-400">No staff members found</Text>
            {totalStaffCount > 0 && (
              <Text variant="tiny" className="text-gray-300 mt-1">Total staff in system: {totalStaffCount}</Text>
            )}
          </div>
        ) : (
          <>
            <div className="mb-2 flex justify-between items-center">
              <Text variant="tiny" className="text-gray-400">Showing {staffList.length} staff members</Text>
              {totalStaffCount > staffList.length && (
                <Text variant="tiny" className="text-gray-400">Total: {totalStaffCount}</Text>
              )}
            </div>
            <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-xl">
              {staffList.map((staff) => {
                const getRoleBadge = (role) => {
                  const roleConfig = {
                    teacher: { bg: 'bg-green-100', text: 'text-green-700', label: 'Teacher' },
                    form_teacher: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Form Teacher' },
                    subject_teacher: { bg: 'bg-teal-100', text: 'text-teal-700', label: 'Subject Teacher' },
                    head: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Head of School' },
                    hm: { bg: 'bg-indigo-100', text: 'text-indigo-700', label: 'Head Master' },
                    principal: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Principal' },
                    vice_principal: { bg: 'bg-sky-100', text: 'text-sky-700', label: 'Vice Principal' },
                    accountant: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Accountant' },
                    secretary: { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Secretary' },
                    librarian: { bg: 'bg-cyan-100', text: 'text-cyan-700', label: 'Librarian' },
                  };
                  const config = roleConfig[role] || { bg: 'bg-gray-100', text: 'text-gray-600', label: role || 'Staff' };
                  return config;
                };
                
                const roleBadge = getRoleBadge(staff.role);
                
                return (
                  <button
                    key={staff.id}
                    type="button"
                    onClick={() => onSelect(staff.id)}
                    className={`w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0 ${selectedId === staff.id ? 'bg-[#D94801]/5' : ''}`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Text variant="small" className="font-bold text-gray-800">{staff.name}</Text>
                        <span className={`text-[8px] px-1.5 py-0.5 rounded-full ${roleBadge.bg} ${roleBadge.text}`}>
                          {roleBadge.label}
                        </span>
                        {staff.position && staff.position !== roleBadge.label && (
                          <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500">
                            {staff.position}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-3 mt-0.5">
                        <Text variant="tiny" className="text-gray-400 font-mono">ID: {staff.staff_id}</Text>
                        {staff.email && <Text variant="tiny" className="text-gray-400">{staff.email}</Text>}
                      </div>
                    </div>
                    {selectedId === staff.id && <CheckCircle size={14} className="text-[#D94801] flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
        <Button variant="primary" onClick={onConfirm} disabled={confirming || !selectedId} className="flex-1">
          {confirming ? 'Saving...' : 'Confirm'}
        </Button>
      </div>
    </div>
  </Modal>
);

// ============================================
// MAIN COMPONENT
// ============================================
export default function ClassManagement() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = ['head', 'hm', 'principal', 'vice_principal', 'admin'].includes(user?.role);

  const [classLevels, setClassLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentSession, setCurrentSession] = useState(null);
  const [viewMode, setViewMode] = useState('card');
  const [expandedLevels, setExpandedLevels] = useState({});
  const [search, setSearch] = useState('');
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const [classDetail, setClassDetail] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);

  const [assignType, setAssignType] = useState(null);
  const [assignTarget, setAssignTarget] = useState(null);
  const [availableStaff, setAvailableStaff] = useState([]);
  const [teachersLoading, setTeachersLoading] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [staffSearchTerm, setStaffSearchTerm] = useState('');
  const [totalStaffCount, setTotalStaffCount] = useState(0);

  const [removeTarget, setRemoveTarget] = useState(null);

  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const loadClassData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getAllClassesWithStudents();
      const levels = data.class_levels || [];
      setClassLevels(levels);
      setCurrentSession(data.current_session);
      if (levels.length > 0) setExpandedLevels({ [levels[0].class_level_id]: true });
    } catch (err) {
      setError(err.message || 'Failed to load class data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadClassData(); }, [loadClassData]);

  const loadStaff = async (searchValue = '') => {
    try {
      setTeachersLoading(true);
      console.log('🔍 Loading staff with search:', searchValue);
      const data = await getAvailableStaff(searchValue);
      const staffList = data.staff || [];
      console.log(`✅ Loaded ${staffList.length} staff members`);
      
      // Log role distribution
      const roles = {};
      staffList.forEach(s => {
        roles[s.role] = (roles[s.role] || 0) + 1;
      });
      console.log('📊 Staff roles:', roles);
      
      setAvailableStaff(staffList);
      setTotalStaffCount(staffList.length);
    } catch (err) { 
      console.error('Error loading staff:', err);
      setError('Failed to load staff list'); 
    } finally { 
      setTeachersLoading(false); 
    }
  };

  const handleStaffSearch = (searchValue) => {
    setStaffSearchTerm(searchValue);
    loadStaff(searchValue);
  };

  const loadDetail = async (classId) => {
    try {
      setDetailLoading(true);
      const data = await getClassDetailWithStudents(classId);
      setClassDetail(data);
      setShowDetail(true);
    } catch (err) {
      setError(err.message || 'Failed to load class details');
    } finally {
      setDetailLoading(false);
    }
  };

  const openAssign = async (type, cls) => {
    setAssignType(type);
    setAssignTarget(cls);
    setSelectedStaffId('');
    setStaffSearchTerm('');
    await loadStaff('');
  };

  const confirmAssign = async () => {
    if (!selectedStaffId) { setError('Please select a staff member'); return; }
    try {
      setActionLoading(true);
      if (assignType === 'teacher') {
        await assignClassTeacher(assignTarget.id, selectedStaffId);
        setSuccess('Class teacher assigned');
      } else {
        await assignAssistantTeacher(assignTarget.id, selectedStaffId);
        setSuccess('Assistant teacher added');
      }
      setAssignType(null);
      setAssignTarget(null);
      await loadClassData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Assignment failed');
    } finally {
      setActionLoading(false);
    }
  };

  const openRemove = (cls, type, staff = null) => setRemoveTarget({ cls, type, staff });

  const confirmRemove = async () => {
    if (!removeTarget) return;
    try {
      setActionLoading(true);
      if (removeTarget.type === 'main') {
        await removeClassTeacher(removeTarget.cls.id);
        setSuccess('Class teacher removed');
        if (classDetail?.class?.id === removeTarget.cls.id)
          setClassDetail(prev => prev ? { ...prev, class_teacher: null } : prev);
      } else {
        await removeAssistantTeacher(removeTarget.cls.id ?? classDetail?.class?.id, removeTarget.staff.id);
        setSuccess('Assistant teacher removed');
        if (classDetail) await loadDetail(classDetail.class?.id);
      }
      setRemoveTarget(null);
      await loadClassData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Removal failed');
    } finally {
      setActionLoading(false);
    }
  };

  const toggleLevel = (id) => setExpandedLevels(p => ({ ...p, [id]: !p[id] }));

  const feeColor = (s) => ({
    paid_full: 'bg-emerald-100 text-emerald-700',
    paid_partial: 'bg-amber-100 text-amber-700',
    not_paid: 'bg-red-100 text-red-600',
  }[s] || 'bg-gray-100 text-gray-500');

  const allClasses = classLevels.flatMap(l => l.classes);
  const hasActiveFilters = search !== '';

  const stats = [
    { title: 'Class Levels', value: classLevels.length, icon: Layers, color: 'bg-violet-100' },
    { title: 'Total Classes', value: allClasses.length, icon: School, color: 'bg-indigo-100' },
    { title: 'Total Students', value: allClasses.reduce((s, c) => s + (c.student_count || 0), 0), icon: Users, color: 'bg-sky-100' },
    { title: 'Teachers Assigned', value: allClasses.filter(c => c.class_teacher).length, icon: UserCheck, color: 'bg-emerald-100' },
  ];

  const filteredLevels = classLevels.map(level => ({
    ...level,
    classes: level.classes.filter(cls =>
      !search ||
      cls.name?.toLowerCase().includes(search.toLowerCase()) ||
      cls.code?.toLowerCase().includes(search.toLowerCase()) ||
      cls.class_teacher?.name?.toLowerCase().includes(search.toLowerCase())
    )
  })).filter(l => l.classes.length > 0 || !search);

  const displayViewMode = isMobile ? 'card' : viewMode;

  if (!isAdmin) {
    return (
      <DashboardLayout title="Access Denied">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-red-50 border border-red-100 rounded-3xl flex items-center justify-center mx-auto">
              <AlertCircle size={32} className="text-red-500" />
            </div>
            <div>
              <Text variant="h2" className="font-bold text-gray-900">Access Denied</Text>
              <Text variant="body" className="text-gray-500 mt-1">Only administrators can manage classes.</Text>
            </div>
            <Button variant="primary" onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Class Management">
      <div className="h-[calc(100vh-120px)] flex flex-col px-3 sm:px-4 lg:px-6">
        
        <div className="sticky top-0 z-20 bg-gray-50 -mx-3 sm:-mx-4 lg:-mx-6 px-3 sm:px-4 lg:px-6 pt-4 pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#1D2B49] rounded-xl flex items-center justify-center shadow-sm">
                  <School size={14} className="text-white" />
                </div>
                <Text variant="h2" className="font-bold">Class Management</Text>
              </div>
              <Text variant="caption" className="text-gray-400 pl-9">Manage teachers, capacity and students for every class</Text>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex bg-gray-100 rounded-xl p-1 gap-0.5">
                <button onClick={() => setViewMode('card')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'card' ? 'bg-white text-[#D94801] shadow-sm' : 'text-gray-500'}`}>
                  <LayoutGrid size={13} /> Cards
                </button>
                <button onClick={() => setViewMode('list')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'list' ? 'bg-white text-[#D94801] shadow-sm' : 'text-gray-500'}`}>
                  <List size={13} /> List
                </button>
              </div>
              <Button variant="outline" size="small" icon={RefreshCw} onClick={loadClassData} loading={loading}>Refresh</Button>
            </div>
          </div>

          {error && <div className="mb-3"><Alert type="error" message={error} onClose={() => setError('')} /></div>}
          {success && <div className="mb-3"><Alert type="success" message={success} onClose={() => setSuccess('')} /></div>}

          {currentSession && (
            <Card className="p-3 mb-3 bg-gradient-to-r from-[#1D2B49] to-[#24385C] text-white">
              <div className="flex items-center gap-3">
                <BookMarked size={18} className="text-white/70" />
                <div>
                  <Text variant="tiny" className="text-white/60 uppercase tracking-wider">Current Academic Session</Text>
                  <Text variant="small" className="font-bold">{currentSession.name}</Text>
                </div>
              </div>
            </Card>
          )}

          {!loading && allClasses.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
              {stats.map((stat, i) => (<StatCard key={i} {...stat} />))}
            </div>
          )}

          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search classes by name, code or teacher..." className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]" />
            </div>
            <button onClick={() => setShowMobileFilter(true)} className="sm:hidden flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 bg-white rounded-xl text-sm"><Filter size={14} /> Filter</button>
          </div>

          <MobileFilterSheet isOpen={showMobileFilter} onClose={() => setShowMobileFilter(false)} search={search} setSearch={setSearch} onClear={() => setSearch('')} />
        </div>

        <div className="flex-1 overflow-y-auto min-h-0 -mx-3 sm:-mx-4 lg:-mx-6 px-3 sm:px-4 lg:px-6 pb-4">
          {loading ? (
            <div className="flex items-center justify-center min-h-[200px]"><RefreshCw className="animate-spin h-8 w-8 text-[#D94801]" /></div>
          ) : classLevels.length === 0 ? (
            <Card className="p-12 text-center"><School size={32} className="mx-auto text-gray-200 mb-2" /><Text variant="body" className="text-gray-400">No class levels configured</Text></Card>
          ) : (
            <div className="space-y-3">
              {filteredLevels.map(level => (
                <Card key={level.class_level_id} className="overflow-hidden">
                  <button onClick={() => toggleLevel(level.class_level_id)} className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D94801] to-[#C24000] flex items-center justify-center shadow-md">
                        <GraduationCap size={18} className="text-white" />
                      </div>
                      <div>
                        <Text variant="small" className="font-bold text-gray-900">{level.class_level_name}</Text>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="text-[10px] text-gray-400 flex items-center gap-1"><Users size={9} />{level.total_students} students</span>
                          <span className="text-[10px] text-gray-400 flex items-center gap-1"><Layers size={9} />{level.total_classes} classes</span>
                        </div>
                      </div>
                    </div>
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${expandedLevels[level.class_level_id] ? 'bg-[#D94801]/10 text-[#D94801]' : 'bg-gray-100 text-gray-400'}`}>
                      {expandedLevels[level.class_level_id] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </div>
                  </button>

                  {expandedLevels[level.class_level_id] && (
                    <div className="border-t border-gray-100">
                      {level.classes.length === 0 ? (
                        <div className="py-8 text-center text-sm text-gray-400">No classes match your search</div>
                      ) : displayViewMode === 'card' ? (
                        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                          {level.classes.map(cls => (
                            <ClassCard key={cls.id} cls={cls} isAdmin={isAdmin} onView={() => loadDetail(cls.id)} onAssignTeacher={() => openAssign('teacher', cls)} onRemoveTeacher={() => openRemove(cls, 'main')} onAssignAssistant={() => openAssign('assistant', cls)} onViewStudents={() => navigate(`/students?class_level=${level.class_level_id}`)} />
                          ))}
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-100">
                              <tr><th className="px-4 py-2 text-left text-[9px] font-bold text-gray-400 uppercase">Class</th><th className="px-3 py-2 text-left text-[9px] font-bold text-gray-400 uppercase hidden md:table-cell">Stream</th><th className="px-3 py-2 text-left text-[9px] font-bold text-gray-400 uppercase hidden lg:table-cell">Teacher</th><th className="px-3 py-2 text-left text-[9px] font-bold text-gray-400 uppercase hidden xl:table-cell">Capacity</th><th className="px-3 py-2 text-right text-[9px] font-bold text-gray-400 uppercase">Actions</th></tr>
                            </thead>
                            <tbody>{level.classes.map(cls => (<ClassRow key={cls.id} cls={cls} isAdmin={isAdmin} onView={() => loadDetail(cls.id)} onAssignTeacher={() => openAssign('teacher', cls)} onRemoveTeacher={() => openRemove(cls, 'main')} onAssignAssistant={() => openAssign('assistant', cls)} onViewStudents={() => navigate(`/students?class_level=${level.class_level_id}`)} />))}</tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={showDetail} onClose={() => setShowDetail(false)} title="Class Details" size="lg">
        <div className="py-3 max-h-[70vh] overflow-y-auto space-y-4">
          {detailLoading ? (
            <div className="py-12 text-center"><RefreshCw className="animate-spin h-8 w-8 text-[#D94801] mx-auto mb-2" /><Text variant="caption" className="text-gray-400">Loading class details…</Text></div>
          ) : classDetail ? (
            <>
              <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#D94801] to-[#C24000] flex items-center justify-center shadow-md"><GraduationCap size={22} className="text-white" /></div>
                  <div><Text variant="h4" className="font-bold">{classDetail.class?.name}</Text><Text variant="tiny" className="text-gray-500">{classDetail.class?.code} · {classDetail.class?.class_level?.name}</Text></div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                  <div><Text variant="tiny" className="text-gray-400">Session</Text><Text variant="small" className="font-medium">{classDetail.class?.session || '—'}</Text></div>
                  <div><Text variant="tiny" className="text-gray-400">Term</Text><Text variant="small" className="font-medium">{classDetail.class?.term || '—'}</Text></div>
                  <div><Text variant="tiny" className="text-gray-400">Room</Text><Text variant="small" className="font-medium">{classDetail.class?.room_number || '—'}</Text></div>
                  <div><Text variant="tiny" className="text-gray-400">Enrolled</Text><Text variant="small" className="font-medium">{classDetail.total_students} / {classDetail.class?.max_capacity}</Text></div>
                </div>
                <div className="mt-3"><CapBar count={classDetail.total_students} max={classDetail.class?.max_capacity} /></div>
              </div>

              <div>
                <Text variant="tiny" className="font-bold text-gray-400 uppercase tracking-wider mb-2"><UserCheck size={11} className="inline mr-1" /> Class Teacher</Text>
                {classDetail.class_teacher ? (<StaffCard staff={classDetail.class_teacher} isAdmin={isAdmin} theme="green" onRemove={() => { setShowDetail(false); openRemove({ id: classDetail.class?.id }, 'main'); }} />) : (<div className="flex justify-between items-center p-3 rounded-xl border border-dashed"><Text variant="caption" className="text-gray-400">No class teacher assigned</Text>{isAdmin && (<Button variant="success" size="tiny" onClick={() => { setShowDetail(false); openAssign('teacher', { id: classDetail.class?.id }); }}>Assign</Button>)}</div>)}
              </div>

              <div>
                <Text variant="tiny" className="font-bold text-gray-400 uppercase tracking-wider mb-2"><UserPlus size={11} className="inline mr-1" /> Assistant Teachers</Text>
                {classDetail.assistant_teachers?.length > 0 ? (<div className="space-y-2">{classDetail.assistant_teachers.map((t, i) => (<StaffCard key={i} staff={t} isAdmin={isAdmin} theme="blue" onRemove={() => openRemove({ id: classDetail.class?.id }, 'assistant', t)} />))}</div>) : (<div className="flex justify-between items-center p-3 rounded-xl border border-dashed"><Text variant="caption" className="text-gray-400">No assistant teachers assigned</Text>{isAdmin && (<Button variant="info" size="tiny" onClick={() => { setShowDetail(false); openAssign('assistant', { id: classDetail.class?.id }); }}>Add</Button>)}</div>)}
              </div>

              <div>
                <Text variant="tiny" className="font-bold text-gray-400 uppercase tracking-wider mb-2"><Users size={11} className="inline mr-1" /> Students ({classDetail.total_students || 0})</Text>
                {classDetail.students?.length > 0 ? (
                  <div className="rounded-xl border border-gray-100 overflow-hidden">
  <div className="overflow-x-auto">
    <table className="w-full text-sm">
      <thead className="bg-gray-50">
        <tr>
          {['Name', 'Adm No', 'Fee', 'Status', ''].map(h => (
            <th key={h} className="px-3 py-2 text-left text-[9px] font-bold text-gray-400 uppercase">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {classDetail.students.map(s => (
          <tr key={s.id} className="border-b border-gray-50">
            <td className="px-3 py-2 font-bold text-gray-800 text-xs">{s.name}</td>
            <td className="px-3 py-2 text-gray-500 text-[10px]">{s.admission_number}</td>
            <td className="px-3 py-2"><span className={`px-1.5 py-0.5 text-[9px] font-bold rounded-full ${feeColor(s.fee_status)}`}>{s.fee_status?.replace('_', ' ') || 'Not Paid'}</span></td>
            <td className="px-3 py-2"><span className={`text-[9px] font-bold ${s.is_active ? 'text-emerald-600' : 'text-red-500'}`}>{s.is_active ? 'Active' : 'Inactive'}</span></td>
            <td className="px-3 py-2"><button onClick={() => navigate(`/students/${s.id}`)} className="text-[#D94801] hover:text-[#C24000] text-[10px] font-bold">View</button></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
                ) : (<div className="py-8 text-center rounded-xl border border-dashed"><Users size={20} className="mx-auto text-gray-300 mb-2" /><Text variant="caption" className="text-gray-400">No students enrolled</Text></div>)}
              </div>
            </>
          ) : null}
        </div>
      </Modal>

      <AssignModal 
        isOpen={assignType === 'teacher'} 
        onClose={() => { setAssignType(null); setAssignTarget(null); setStaffSearchTerm(''); }} 
        title="Assign Class Teacher" 
        subtitle={assignTarget?.name || ''} 
        icon={<UserCheck size={16} className="text-emerald-600" />} 
        iconBg="bg-emerald-50 border-emerald-200" 
        staffList={availableStaff} 
        loading={teachersLoading} 
        selectedId={selectedStaffId} 
        onSelect={setSelectedStaffId} 
        onConfirm={confirmAssign} 
        confirming={actionLoading}
        searchTerm={staffSearchTerm}
        onSearchChange={handleStaffSearch}
        totalStaffCount={totalStaffCount}
      />

      <AssignModal 
        isOpen={assignType === 'assistant'} 
        onClose={() => { setAssignType(null); setAssignTarget(null); setStaffSearchTerm(''); }} 
        title="Add Assistant Teacher" 
        subtitle={assignTarget?.name || ''} 
        icon={<UserPlus size={16} className="text-sky-600" />} 
        iconBg="bg-sky-50 border-sky-200" 
        staffList={availableStaff} 
        loading={teachersLoading} 
        selectedId={selectedStaffId} 
        onSelect={setSelectedStaffId} 
        onConfirm={confirmAssign} 
        confirming={actionLoading}
        searchTerm={staffSearchTerm}
        onSearchChange={handleStaffSearch}
        totalStaffCount={totalStaffCount}
      />

      <Modal isOpen={!!removeTarget} onClose={() => setRemoveTarget(null)} title="Confirm Removal" size="sm">
        {removeTarget && (
          <div className="py-3 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3"><Trash2 size={20} className="text-red-500" /></div>
            <Text variant="h4" className="font-bold mb-1">Remove Staff</Text>
            <Text variant="caption" className="text-gray-500 mb-3">{removeTarget.type === 'main' ? `${removeTarget.cls?.name} will have no class teacher.` : `Remove ${removeTarget.staff?.name} as assistant teacher?`}</Text>
            <div className="flex gap-2"><Button variant="outline" onClick={() => setRemoveTarget(null)} className="flex-1">Cancel</Button><Button variant="danger" onClick={confirmRemove} disabled={actionLoading} className="flex-1">{actionLoading ? 'Removing...' : 'Remove'}</Button></div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}