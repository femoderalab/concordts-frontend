/**
 * Promotion Management Page — Redesigned with Consistent Design System
 * All logic preserved, visual system unified with ClassManagement design tokens
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import Alert from '../../components/common/Alert';
import Modal from '../../components/common/modal';
import {
  TrendingUp, RefreshCw, Users, GraduationCap, Award, Calendar,
  AlertTriangle, CheckCircle, Clock, ChevronRight, Eye, UserCheck,
  UserX, ArrowRight, ChevronDown, ChevronUp, Search, Filter, X,
  ArrowUpDown, History, BarChart3, PieChart, Download, Activity,
  Zap, List, Layers, Home, FileText, AlertOctagon, School,
  BookMarked, Sparkles, Building2, AlertCircle, User, Plus,
  Mail, Phone, Trash2, LayoutGrid, Grid3x3, Table2
} from 'lucide-react';
import {
  getPromotionPreview,
  executePromotion,
  promoteByClass,
  promoteSingleStudent,
  demoteSingleStudent,
  getPromotionHistory,
  getCompletePromotionHistory,
  getRecentPromotionActivities,
  getSessionPromotionAnalytics,
  getSessionHistoryDetail
} from '../../services/promotionService';
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
    indigo: 'bg-indigo-600 text-white hover:bg-indigo-700',
    violet: 'bg-violet-600 text-white hover:bg-violet-700',
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

// Status Badge
const StatusBadge = ({ status, isCurrent = false }) => {
  const config = {
    active: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Active' },
    completed: { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Completed' },
    upcoming: { bg: 'bg-sky-100', text: 'text-sky-700', label: 'Upcoming' },
  };
  if (isCurrent) return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] md:text-[10px] font-medium bg-emerald-100 text-emerald-700">Current</span>;
  const c = config[status] || config.active;
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] md:text-[10px] font-medium ${c.bg} ${c.text}`}>{c.label}</span>;
};

// Pill Badge for transitions
const TransitionBadge = ({ fromClass, toClass, isGraduated }) => (
  <div className="flex items-center gap-1.5 text-xs">
    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-lg font-medium">{fromClass}</span>
    <ArrowRight size={10} className="text-gray-400" />
    {isGraduated ? (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-violet-100 text-violet-700 rounded-lg font-bold">
        <Award size={9} /> Alumni
      </span>
    ) : (
      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-lg font-bold">{toClass}</span>
    )}
  </div>
);

// Avatar Initial
const AvatarInitial = ({ name = '?', size = 'md', colorClass = 'bg-indigo-100 text-indigo-700' }) => {
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
    success: 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border-emerald-100',
    info: 'bg-sky-50 hover:bg-sky-100 text-sky-600 border-sky-100',
    danger: 'bg-red-50 hover:bg-red-100 text-red-500 border-red-100',
    muted: 'bg-gray-50 hover:bg-gray-100 text-gray-500 border-gray-100',
    warning: 'bg-amber-50 hover:bg-amber-100 text-amber-600 border-amber-100',
    violet: 'bg-violet-50 hover:bg-violet-100 text-violet-600 border-violet-100',
  };
  return (
    <button type="button" onClick={onClick} title={title}
      className={`inline-flex items-center justify-center w-8 h-8 rounded-lg border transition-all duration-150 focus:outline-none ${variants[variant]}`}>
      {children}
    </button>
  );
};

// Toolbar Button
const ToolbarBtn = ({ onClick, icon, label, loading: isLoading = false, variant = 'default' }) => {
  const variants = {
    default: 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50',
    primary: 'bg-[#D94801] border-[#D94801] text-white hover:bg-[#C24000]',
    success: 'bg-emerald-600 border-emerald-600 text-white hover:bg-emerald-700',
    indigo: 'bg-indigo-600 border-indigo-600 text-white hover:bg-indigo-700',
  };
  return (
    <button type="button" onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 border rounded-xl text-xs font-bold transition-all shadow-sm ${variants[variant]}`}>
      <span className={isLoading ? 'animate-spin' : ''}>{icon}</span> {label}
    </button>
  );
};

// Class Level Accordion Block
const ClassLevelBlock = ({ classLevel, expanded, onToggle, onPromoteAll, onPromoteStudent, onDemoteStudent }) => (
  <Card className="overflow-hidden">
    <div onClick={onToggle} className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#D94801] to-[#C24000] flex items-center justify-center shadow-md">
          <GraduationCap size={16} className="text-white" />
        </div>
        <div>
          <Text variant="small" className="font-bold text-gray-900">{classLevel.class_level_name}</Text>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="text-[10px] text-gray-400 flex items-center gap-1"><Users size={8} />{classLevel.student_count} students</span>
            {classLevel.graduating_count > 0 && (
              <span className="text-[10px] text-[#D94801] flex items-center gap-1"><Award size={8} />{classLevel.graduating_count} graduating</span>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="success" size="tiny" onClick={(e) => { e.stopPropagation(); onPromoteAll(classLevel); }} disabled={classLevel.student_count === 0}>
          <TrendingUp size={10} /> Promote Class
        </Button>
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${expanded ? 'bg-[#D94801]/10 text-[#D94801]' : 'bg-gray-100 text-gray-400'}`}>
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </div>
      </div>
    </div>

    {expanded && (
      <div className="border-t border-gray-100">
        {classLevel.students?.length === 0 ? (
          <div className="py-8 text-center text-sm text-gray-400">No students in this class</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr><th className="px-4 py-2 text-left text-[9px] font-bold text-gray-400 uppercase">Student</th><th className="px-3 py-2 text-left text-[9px] font-bold text-gray-400 uppercase hidden md:table-cell">Adm No</th><th className="px-3 py-2 text-left text-[9px] font-bold text-gray-400 uppercase hidden lg:table-cell">Transition</th><th className="px-3 py-2 text-right text-[9px] font-bold text-gray-400 uppercase">Actions</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {classLevel.students.map(student => (
                  <tr key={student.student_id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-2"><div className="flex items-center gap-2"><AvatarInitial name={student.name} size="sm" colorClass="bg-indigo-100 text-indigo-700" /><Text variant="small" className="font-bold text-gray-800">{student.name}</Text></div></td>
                    <td className="px-3 py-2 hidden md:table-cell"><Text variant="tiny" className="text-gray-500 font-mono">{student.admission_number}</Text></td>
                    <td className="px-3 py-2 hidden lg:table-cell"><TransitionBadge fromClass={student.current_class} toClass={student.next_class} isGraduated={student.will_graduate} /></td>
                    <td className="px-3 py-2"><div className="flex items-center justify-end gap-1"><IconBtn onClick={() => onPromoteStudent(student)} title="Promote" variant="success"><ArrowRight size={12} /></IconBtn><IconBtn onClick={() => onDemoteStudent(student)} title="Demote" variant="danger"><ArrowUpDown size={12} /></IconBtn></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    )}
  </Card>
);

// ============================================
// MAIN COMPONENT
// ============================================
export default function PromotionManagement() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = ['head', 'hm', 'principal', 'vice_principal', 'admin'].includes(user?.role);

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [promoting, setPromoting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [expandedClasses, setExpandedClasses] = useState({});
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [activeTab, setActiveTab] = useState('preview');
  const [promotionRemarks, setPromotionRemarks] = useState('');
  const [historyFilterSession, setHistoryFilterSession] = useState('');
  const [sessionsList, setSessionsList] = useState([]);

  const [showClassConfirmModal, setShowClassConfirmModal] = useState(false);
  const [showStudentConfirmModal, setShowStudentConfirmModal] = useState(false);
  const [showDemoteConfirmModal, setShowDemoteConfirmModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [showRecentActivitiesModal, setShowRecentActivitiesModal] = useState(false);
  const [showSessionHistoryModal, setShowSessionHistoryModal] = useState(false);
  const [showDiagnostic, setShowDiagnostic] = useState(false);

  const [completeHistory, setCompleteHistory] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [sessionAnalytics, setSessionAnalytics] = useState([]);
  const [sessionHistoryDetail, setSessionHistoryDetail] = useState(null);
  const [diagnostic, setDiagnostic] = useState(null);

  const [historyLoading, setHistoryLoading] = useState(false);
  const [recentLoading, setRecentLoading] = useState(false);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [sessionHistoryLoading, setSessionHistoryLoading] = useState(false);

  const loadSessionsList = useCallback(async () => {
    try {
      const { getAcademicSessions } = await import('../../services/academicService');
      const response = await getAcademicSessions();
      setSessionsList(response.results || response || []);
    } catch (err) { console.error('Failed to load sessions:', err); }
  }, []);

  const loadPreview = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getPromotionPreview();
      setPreview(data);
      if (data?.class_breakdown) {
        const expanded = {};
        data.class_breakdown.forEach(cls => { if (cls.student_count > 0) expanded[cls.class_level_id] = true; });
        setExpandedClasses(expanded);
      }
    } catch (err) {
      setError(err.message || 'Failed to load promotion preview');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { if (isAdmin) { loadPreview(); loadSessionsList(); } }, [isAdmin, loadPreview, loadSessionsList]);

  const loadCompleteHistory = async () => {
    try {
      setHistoryLoading(true);
      const params = historyFilterSession ? { session_id: historyFilterSession } : {};
      const data = await getCompletePromotionHistory(params);
      setCompleteHistory(data.results || []);
      setShowHistoryModal(true);
    } catch (err) { setError(err.message || 'Failed to load complete history'); }
    finally { setHistoryLoading(false); }
  };

  const loadRecentActivities = async () => {
    try {
      setRecentLoading(true);
      const data = await getRecentPromotionActivities(30);
      setRecentActivities(data.activities || []);
      setShowRecentActivitiesModal(true);
    } catch (err) { setError(err.message || 'Failed to load recent activities'); }
    finally { setRecentLoading(false); }
  };

  const loadSessionAnalytics = async () => {
    try {
      setAnalyticsLoading(true);
      const data = await getSessionPromotionAnalytics();
      setSessionAnalytics(data.sessions_analytics || []);
      setShowAnalyticsModal(true);
    } catch (err) { setError(err.message || 'Failed to load session analytics'); }
    finally { setAnalyticsLoading(false); }
  };

  const loadSessionHistoryDetail = async (sessionId) => {
    try {
      setSessionHistoryLoading(true);
      const data = await getSessionHistoryDetail(sessionId);
      setSessionHistoryDetail(data);
      setShowSessionHistoryModal(true);
    } catch (err) { setError(err.message || 'Failed to load session history'); }
    finally { setSessionHistoryLoading(false); }
  };

  const loadDiagnostic = async () => {
    try {
      const { get } = await import('../../services/api');
      const response = await get('/students/diagnostic/students/');
      setDiagnostic(response.data || response);
      setShowDiagnostic(true);
    } catch (err) { setError('Failed to load diagnostic data'); }
  };

  const toggleClassExpand = id => setExpandedClasses(p => ({ ...p, [id]: !p[id] }));

  const handlePromoteByClass = cls => {
    if (!cls.student_count) { setError(`No students to promote in ${cls.class_level_name}`); return; }
    setSelectedClass(cls);
    setShowClassConfirmModal(true);
  };

  const handlePromoteAll = () => {
    if (!preview?.total_students) { setError('No students available to promote'); return; }
    setSelectedClass({ class_level_name: 'ALL CLASSES', class_level_id: null });
    setShowClassConfirmModal(true);
  };

  const confirmClassPromotion = async () => {
    if (!selectedClass) return;
    try {
      setPromoting(true);
      let result;
      if (selectedClass.class_level_id === null) {
        result = await executePromotion({ remarks: promotionRemarks || 'End of session promotion' });
      } else {
        result = await promoteByClass(selectedClass.class_level_id, { remarks: promotionRemarks || `Promoted from ${selectedClass.class_level_name}` });
      }
      setSuccess(result.message || 'Promotion successful');
      setShowClassConfirmModal(false);
      setSelectedClass(null);
      setPromotionRemarks('');
      await loadPreview();
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) { setError(err.message || 'Failed to promote'); }
    finally { setPromoting(false); }
  };

  const confirmStudentPromotion = async () => {
    if (!selectedStudent) return;
    try {
      setPromoting(true);
      const result = await promoteSingleStudent(selectedStudent.student_id, { remarks: promotionRemarks || 'Individual promotion' });
      setSuccess(result.message);
      setShowStudentConfirmModal(false);
      setSelectedStudent(null);
      setPromotionRemarks('');
      await loadPreview();
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) { setError(err.message || 'Failed to promote student'); }
    finally { setPromoting(false); }
  };

  const confirmStudentDemotion = async () => {
    if (!selectedStudent) return;
    try {
      setPromoting(true);
      const result = await demoteSingleStudent(selectedStudent.student_id, { remarks: promotionRemarks || 'Individual demotion' });
      setSuccess(result.message);
      setShowDemoteConfirmModal(false);
      setSelectedStudent(null);
      setPromotionRemarks('');
      await loadPreview();
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) { setError(err.message || 'Failed to demote student'); }
    finally { setPromoting(false); }
  };

  const formatDate = date => !date ? 'N/A' : new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  const formatDateTime = date => !date ? 'N/A' : new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  const allClasses = preview?.class_breakdown || [];
  const stats = [
    { title: 'Total Students', value: preview?.total_students || 0, icon: Users, color: 'bg-sky-100' },
    { title: 'Classes', value: allClasses.length, icon: GraduationCap, color: 'bg-indigo-100' },
    { title: 'Will Graduate', value: preview?.total_graduated || 0, icon: Award, color: 'bg-violet-100' },
    { title: 'Sessions', value: sessionsList.length, icon: Calendar, color: 'bg-emerald-100' },
  ];

  const canPromote = preview?.can_promote;
  const hasStudents = preview?.total_students > 0;

  if (!isAdmin) {
    return (
      <DashboardLayout title="Access Denied">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-red-50 border border-red-100 rounded-3xl flex items-center justify-center mx-auto"><AlertCircle size={32} className="text-red-500" /></div>
            <div><Text variant="h2" className="font-bold text-gray-900">Access Denied</Text><Text variant="body" className="text-gray-500 mt-1">Only administrators can manage promotions.</Text></div>
            <Button variant="primary" onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Student Promotion">
      <div className="h-[calc(100vh-120px)] flex flex-col px-3 sm:px-4 lg:px-6">
        
        {/* STICKY HEADER SECTION */}
        <div className="sticky top-0 z-20 bg-gray-50 -mx-3 sm:-mx-4 lg:-mx-6 px-3 sm:px-4 lg:px-6 pt-4 pb-2">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
           
            <div className="flex items-center gap-1.5 flex-wrap">
              <ToolbarBtn onClick={loadPreview} icon={<RefreshCw size={12} className={loading ? 'animate-spin' : ''} />} label="Refresh" />
              <ToolbarBtn onClick={loadRecentActivities} icon={<Zap size={12} className={recentLoading ? 'animate-spin' : ''} />} label="Recent" variant="indigo" />
              <ToolbarBtn onClick={loadCompleteHistory} icon={<History size={12} className={historyLoading ? 'animate-spin' : ''} />} label="History" variant="indigo" />
              <ToolbarBtn onClick={loadSessionAnalytics} icon={<BarChart3 size={12} className={analyticsLoading ? 'animate-spin' : ''} />} label="Analytics" variant="indigo" />
              <ToolbarBtn onClick={loadDiagnostic} icon={<Activity size={12} />} label="Diagnose" variant="indigo" />
            </div>
          </div>

          {error && <div className="mb-3"><Alert type="error" message={error} onClose={() => setError('')} /></div>}
          {success && <div className="mb-3"><Alert type="success" message={success} onClose={() => setSuccess('')} /></div>}

          {/* Stats */}
          {!loading && hasStudents && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">{stats.map((stat, i) => (<StatCard key={i} {...stat} />))}</div>
          )}

          {/* Warning Messages */}
          {canPromote && !hasStudents && !loading && (
            <Card className="p-4 mb-3 bg-amber-50 border-amber-100">
              <div className="flex items-center gap-3"><AlertOctagon size={18} className="text-amber-500" /><Text variant="small" className="text-amber-700">No active students found. Ensure students have a class level assigned.</Text></div>
            </Card>
          )}

          {!canPromote && !loading && hasStudents && (
            <Card className="p-4 mb-3 bg-amber-50 border-amber-100">
              <div className="flex items-center justify-between flex-wrap gap-3"><div className="flex items-center gap-3"><AlertTriangle size={18} className="text-amber-500" /><Text variant="small" className="text-amber-700">{preview?.message || 'Unable to promote students at this time.'}</Text></div><Button variant="primary" size="small" onClick={() => navigate('/academics/sessions')}><Calendar size={12} /> Create New Session</Button></div>
            </Card>
          )}

          {/* Tabs */}
          {canPromote && hasStudents && preview && (
            <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
              {[
                { id: 'preview', icon: <Users size={12} />, label: `Class Breakdown (${preview.total_students || 0})` },
                { id: 'all', icon: <GraduationCap size={12} />, label: 'All Students' },
                { id: 'sessions', icon: <Layers size={12} />, label: 'Session History' },
              ].map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === tab.id ? 'bg-white text-[#D94801] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto min-h-0 -mx-3 sm:-mx-4 lg:-mx-6 px-3 sm:px-4 lg:px-6 pb-4">
          {loading ? (
            <div className="flex items-center justify-center min-h-[200px]"><RefreshCw className="animate-spin h-8 w-8 text-[#D94801]" /></div>
          ) : canPromote && hasStudents && preview ? (
            activeTab === 'preview' ? (
              <div className="space-y-3">
                {preview.total_students > 0 && (
                  <div className="flex justify-end"><Button variant="success" size="small" onClick={handlePromoteAll}><TrendingUp size={12} /> Promote All ({preview.total_students})</Button></div>
                )}
                {allClasses.length === 0 ? (<div className="py-12 text-center"><Users size={32} className="mx-auto text-gray-200 mb-2" /><Text variant="body" className="text-gray-400">No classes with students found</Text></div>) : (
                  allClasses.map(cls => (<ClassLevelBlock key={cls.class_level_id} classLevel={cls} expanded={!!expandedClasses[cls.class_level_id]} onToggle={() => toggleClassExpand(cls.class_level_id)} onPromoteAll={handlePromoteByClass} onPromoteStudent={s => { setSelectedStudent(s); setShowStudentConfirmModal(true); }} onDemoteStudent={s => { setSelectedStudent(s); setShowDemoteConfirmModal(true); }} />))
                )}
              </div>
            ) : activeTab === 'all' ? (
              <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-100"><tr><th className="px-4 py-2 text-left text-[9px] font-bold text-gray-400 uppercase">Student</th><th className="px-3 py-2 text-left text-[9px] font-bold text-gray-400 uppercase hidden md:table-cell">Adm No</th><th className="px-3 py-2 text-left text-[9px] font-bold text-gray-400 uppercase hidden lg:table-cell">Transition</th><th className="px-3 py-2 text-right text-[9px] font-bold text-gray-400 uppercase">Actions</th></tr></thead>
                    <tbody className="divide-y divide-gray-50">
                      {preview.all_students?.map(student => (
                        <tr key={student.student_id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-2"><div className="flex items-center gap-2"><AvatarInitial name={student.name} size="sm" colorClass="bg-indigo-100 text-indigo-700" /><Text variant="small" className="font-bold text-gray-800">{student.name}</Text></div></td>
                          <td className="px-3 py-2 hidden md:table-cell"><Text variant="tiny" className="text-gray-500 font-mono">{student.admission_number}</Text></td>
                          <td className="px-3 py-2 hidden lg:table-cell"><TransitionBadge fromClass={student.current_class} toClass={student.next_class} isGraduated={student.will_graduate} /></td>
                          <td className="px-3 py-2"><div className="flex items-center justify-end gap-1"><IconBtn onClick={() => { setSelectedStudent(student); setShowStudentConfirmModal(true); }} title="Promote" variant="success"><ArrowRight size={12} /></IconBtn><IconBtn onClick={() => { setSelectedStudent(student); setShowDemoteConfirmModal(true); }} title="Demote" variant="danger"><ArrowUpDown size={12} /></IconBtn></div></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            ) : (
              <div className="space-y-2">
                {sessionsList.map(session => (
                  <Card key={session.id} className="p-3 cursor-pointer hover:shadow-md transition-all" onClick={() => loadSessionHistoryDetail(session.id)}>
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center"><Calendar size={14} className="text-indigo-600" /></div><div><Text variant="small" className="font-bold">{session.name}</Text><Text variant="tiny" className="text-gray-400">{formatDate(session.start_date)} – {formatDate(session.end_date)}</Text></div></div>
                      <div className="flex items-center gap-2"><StatusBadge status={session.status} isCurrent={session.is_current} /><ChevronRight size={14} className="text-gray-400" /></div>
                    </div>
                  </Card>
                ))}
              </div>
            )
          ) : !loading && !hasStudents ? (
            <Card className="p-12 text-center"><School size={32} className="mx-auto text-gray-200 mb-2" /><Text variant="body" className="text-gray-400">No students available for promotion</Text></Card>
          ) : null}
        </div>
      </div>

      {/* Modals remain the same but styled consistently - keeping functionality intact */}
      <Modal isOpen={showClassConfirmModal} onClose={() => setShowClassConfirmModal(false)} title="Confirm Promotion" size="sm">
        <div className="py-3 text-center"><div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3"><TrendingUp size={20} className="text-emerald-600" /></div><Text variant="h4" className="font-bold mb-1">Promote {selectedClass?.class_level_name || 'ALL'} Students?</Text><Text variant="caption" className="text-gray-500 mb-4 block">All students will be moved to their next class level. This action cannot be undone.</Text><textarea value={promotionRemarks} onChange={e => setPromotionRemarks(e.target.value)} rows={2} placeholder="Remarks (optional)" className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm mb-4" /><div className="flex gap-2"><Button variant="outline" onClick={() => setShowClassConfirmModal(false)} className="flex-1">Cancel</Button><Button variant="success" onClick={confirmClassPromotion} disabled={promoting} className="flex-1">{promoting ? 'Processing...' : 'Confirm'}</Button></div></div>
      </Modal>

      <Modal isOpen={showStudentConfirmModal} onClose={() => setShowStudentConfirmModal(false)} title="Promote Student" size="sm">
        <div className="py-3 text-center"><div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3"><UserCheck size={20} className="text-emerald-600" /></div><Text variant="h4" className="font-bold mb-1">Promote {selectedStudent?.name}?</Text><div className="flex items-center justify-center gap-2 mb-4"><span className="px-2 py-1 bg-gray-100 rounded-lg text-xs">{selectedStudent?.current_class}</span><ArrowRight size={12} /><span className="px-2 py-1 bg-emerald-100 rounded-lg text-xs font-bold">{selectedStudent?.next_class}</span></div><textarea value={promotionRemarks} onChange={e => setPromotionRemarks(e.target.value)} rows={2} placeholder="Remarks (optional)" className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm mb-4" /><div className="flex gap-2"><Button variant="outline" onClick={() => setShowStudentConfirmModal(false)} className="flex-1">Cancel</Button><Button variant="success" onClick={confirmStudentPromotion} disabled={promoting} className="flex-1">{promoting ? 'Processing...' : 'Confirm'}</Button></div></div>
      </Modal>

      <Modal isOpen={showDemoteConfirmModal} onClose={() => setShowDemoteConfirmModal(false)} title="Demote Student" size="sm">
        <div className="py-3 text-center"><div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3"><UserX size={20} className="text-red-600" /></div><Text variant="h4" className="font-bold mb-1">Demote {selectedStudent?.name}?</Text><Text variant="caption" className="text-gray-500 mb-4 block">This will move the student to the previous class level. This action cannot be undone.</Text><textarea value={promotionRemarks} onChange={e => setPromotionRemarks(e.target.value)} rows={2} placeholder="Reason for demotion" className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm mb-4" /><div className="flex gap-2"><Button variant="outline" onClick={() => setShowDemoteConfirmModal(false)} className="flex-1">Cancel</Button><Button variant="danger" onClick={confirmStudentDemotion} disabled={promoting} className="flex-1">{promoting ? 'Processing...' : 'Demote'}</Button></div></div>
      </Modal>

      {/* History Modal */}
      <Modal isOpen={showHistoryModal} onClose={() => setShowHistoryModal(false)} title="Promotion History" size="lg">
        <div className="py-3 space-y-3"><div className="flex gap-2"><select value={historyFilterSession} onChange={e => setHistoryFilterSession(e.target.value)} className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm"><option value="">All Sessions</option>{sessionsList.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select><Button variant="primary" size="small" onClick={loadCompleteHistory}>Apply</Button></div><div className="max-h-[50vh] overflow-y-auto space-y-2">{historyLoading ? <div className="py-8 text-center"><RefreshCw className="animate-spin h-6 w-6 text-[#D94801] mx-auto" /></div> : completeHistory.length === 0 ? <div className="py-8 text-center text-gray-400">No promotion records found</div> : completeHistory.map(record => (<div key={record.id} className="p-3 bg-gray-50 rounded-xl"><div className="flex items-center justify-between flex-wrap gap-2"><div className="flex items-center gap-2"><AvatarInitial name={record.student_name} size="sm" /><div><Text variant="small" className="font-bold">{record.student_name}</Text><Text variant="tiny" className="text-gray-400">{record.admission_number}</Text></div></div><TransitionBadge fromClass={record.from_class_level} toClass={record.to_class_level} isGraduated={record.is_graduated} /></div><div className="flex flex-wrap gap-2 mt-2 text-[10px] text-gray-400"><span><Calendar size={8} className="inline mr-1" />{formatDate(record.promotion_date)}</span><span>{record.from_session} → {record.to_session}</span>{record.remarks && <span>· {record.remarks}</span>}</div></div>))}</div></div>
      </Modal>

      {/* Recent Activities Modal */}
      <Modal isOpen={showRecentActivitiesModal} onClose={() => setShowRecentActivitiesModal(false)} title="Recent Activities" size="lg">
        <div className="py-3 max-h-[60vh] overflow-y-auto space-y-2">{recentLoading ? <div className="py-8 text-center"><RefreshCw className="animate-spin h-6 w-6 text-[#D94801] mx-auto" /></div> : recentActivities.length === 0 ? <div className="py-8 text-center text-gray-400">No recent activities</div> : recentActivities.map(activity => (<div key={activity.id} className="p-3 bg-gray-50 rounded-xl"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">{activity.is_graduated ? <Award size={14} className="text-violet-600" /> : <TrendingUp size={14} className="text-emerald-600" />}</div><div><Text variant="small" className="font-bold">{activity.student_name}</Text><TransitionBadge fromClass={activity.from_class} toClass={activity.to_class} isGraduated={activity.is_graduated} /><Text variant="tiny" className="text-gray-400 mt-1">{formatDateTime(activity.performed_date)} · By: {activity.performed_by}</Text></div></div></div>))}</div>
      </Modal>

      {/* Analytics Modal */}
      <Modal isOpen={showAnalyticsModal} onClose={() => setShowAnalyticsModal(false)} title="Session Analytics" size="lg">
        <div className="py-3 max-h-[60vh] overflow-y-auto space-y-3">{analyticsLoading ? <div className="py-8 text-center"><RefreshCw className="animate-spin h-6 w-6 text-[#D94801] mx-auto" /></div> : sessionAnalytics.map(session => (<Card key={session.session_id} className="p-4"><div className="flex justify-between items-start mb-3"><div><Text variant="small" className="font-bold">{session.session_name}</Text><Text variant="tiny" className="text-gray-400">{formatDate(session.start_date)} – {formatDate(session.end_date)}</Text></div><StatusBadge status={session.status} isCurrent={session.is_current} /></div><div className="grid grid-cols-4 gap-2"><div className="text-center p-2 bg-sky-50 rounded-lg"><Text variant="h4" className="font-bold">{session.statistics?.total_promotions || 0}</Text><Text variant="tiny">Total</Text></div><div className="text-center p-2 bg-emerald-50 rounded-lg"><Text variant="h4" className="font-bold">{session.statistics?.promoted || 0}</Text><Text variant="tiny">Promoted</Text></div><div className="text-center p-2 bg-violet-50 rounded-lg"><Text variant="h4" className="font-bold">{session.statistics?.graduated || 0}</Text><Text variant="tiny">Graduated</Text></div><div className="text-center p-2 bg-red-50 rounded-lg"><Text variant="h4" className="font-bold">{session.statistics?.demoted || 0}</Text><Text variant="tiny">Demoted</Text></div></div><Button variant="ghost" size="tiny" className="mt-3" onClick={() => { setShowAnalyticsModal(false); loadSessionHistoryDetail(session.session_id); }}>View Details <ChevronRight size={10} /></Button></Card>))}</div>
      </Modal>

      {/* Session History Detail Modal */}
      <Modal isOpen={showSessionHistoryModal} onClose={() => setShowSessionHistoryModal(false)} title="Session Details" size="lg">
        <div className="py-3 max-h-[60vh] overflow-y-auto space-y-3">{sessionHistoryLoading ? <div className="py-8 text-center"><RefreshCw className="animate-spin h-6 w-6 text-[#D94801] mx-auto" /></div> : sessionHistoryDetail ? (<><div className="bg-gradient-to-r from-indigo-50 to-violet-50 p-4 rounded-xl"><Text variant="h4" className="font-bold">{sessionHistoryDetail.session?.name}</Text><Text variant="tiny" className="text-gray-500">{formatDate(sessionHistoryDetail.session?.start_date)} – {formatDate(sessionHistoryDetail.session?.end_date)}</Text><div className="grid grid-cols-4 gap-2 mt-3"><div className="text-center p-2 bg-sky-50 rounded-lg"><Text variant="h3" className="font-bold">{sessionHistoryDetail.summary?.total_promotions || 0}</Text><Text variant="tiny">Total</Text></div><div className="text-center p-2 bg-emerald-50 rounded-lg"><Text variant="h3" className="font-bold">{sessionHistoryDetail.summary?.promoted_count || 0}</Text><Text variant="tiny">Promoted</Text></div><div className="text-center p-2 bg-violet-50 rounded-lg"><Text variant="h3" className="font-bold">{sessionHistoryDetail.summary?.graduated_count || 0}</Text><Text variant="tiny">Graduated</Text></div><div className="text-center p-2 bg-red-50 rounded-lg"><Text variant="h3" className="font-bold">{sessionHistoryDetail.summary?.demoted_count || 0}</Text><Text variant="tiny">Demoted</Text></div></div></div>
          {sessionHistoryDetail.promoted_students?.length > 0 && (<div><Text variant="tiny" className="font-bold text-gray-400 uppercase mb-2">Promoted ({sessionHistoryDetail.promoted_students.length})</Text><div className="space-y-1 max-h-32 overflow-y-auto">{sessionHistoryDetail.promoted_students.map((s, i) => (<div key={i} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg"><Text variant="small" className="font-bold">{s.name}</Text><TransitionBadge fromClass={s.from_class} toClass={s.to_class} isGraduated={false} /></div>))}</div></div>)}
          {sessionHistoryDetail.graduated_students?.length > 0 && (<div><Text variant="tiny" className="font-bold text-gray-400 uppercase mb-2">Graduated ({sessionHistoryDetail.graduated_students.length})</Text><div className="space-y-1 max-h-32 overflow-y-auto">{sessionHistoryDetail.graduated_students.map((s, i) => (<div key={i} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg"><Text variant="small" className="font-bold">{s.name}</Text><span className="text-xs text-violet-600">Graduated from {s.from_class}</span></div>))}</div></div>)}
        </>) : <div className="py-8 text-center text-gray-400">No session data found</div>}</div>
      </Modal>

      {/* Diagnostic Modal */}
      <Modal isOpen={showDiagnostic} onClose={() => setShowDiagnostic(false)} title="Student Diagnostic" size="lg">
        <div className="py-3 space-y-3">{diagnostic ? (<><div className="grid grid-cols-2 gap-2"><div className="p-3 bg-sky-50 rounded-xl text-center"><Text variant="h3" className="font-bold">{diagnostic.student_counts?.total_students || 0}</Text><Text variant="tiny">Total Students</Text></div><div className="p-3 bg-emerald-50 rounded-xl text-center"><Text variant="h3" className="font-bold">{diagnostic.student_counts?.active_students || 0}</Text><Text variant="tiny">Active</Text></div><div className="p-3 bg-violet-50 rounded-xl text-center"><Text variant="h3" className="font-bold">{diagnostic.student_counts?.non_graduated_active || 0}</Text><Text variant="tiny">Non-Graduated</Text></div><div className="p-3 bg-amber-50 rounded-xl text-center"><Text variant="h3" className="font-bold">{diagnostic.student_counts?.graduated_students || 0}</Text><Text variant="tiny">Graduated</Text></div></div><div><Text variant="tiny" className="font-bold text-gray-400 uppercase mb-2">Class Distribution</Text><div className="space-y-1 max-h-40 overflow-y-auto">{diagnostic.class_distribution?.map((cls, i) => (<div key={i} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg"><Text variant="small">{cls.class_level}</Text><Text variant="small" className="font-bold">{cls.student_count}</Text></div>))}</div></div></>) : <div className="py-8 text-center"><RefreshCw className="animate-spin h-6 w-6 text-[#D94801] mx-auto" /></div>}</div>
      </Modal>
    </DashboardLayout>
  );
}