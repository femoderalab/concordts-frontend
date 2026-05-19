import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import useAuth from '../../hooks/useAuth';
import { getAllStaff } from '../../services/staffService';
import { getStudents } from '../../services/studentService';
import { getMyInvoices } from '../../services/paymentService';
import { getClasses } from '../../services/academicService';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { 
  Users, GraduationCap, IdCard, Printer, FileText, 
  AlertCircle, Eye, RefreshCw, Search, Filter,
  CheckCircle, XCircle, Clock, DollarSign, CreditCard,
  Download, Plus, Trash2, Edit2, Calendar, Hash,
  Phone, Mail, User, School, BookOpen, Award,
  ChevronRight, X, Loader2, UserCheck, Building2
} from 'lucide-react';
import Alert from '../../components/common/Alert';
import Button from '../../components/common/Button';
import Modal from '../../components/common/modal';

const SecretaryDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('students');
  
  // Data States
  const [students, setStudents] = useState([]);
  const [staff, setStaff] = useState([]);
  const [classes, setClasses] = useState([]);
  const [invoices, setInvoices] = useState([]);
  
  // Search/Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  
  // Modal States
  const [showIdCardModal, setShowIdCardModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showPaymentStatusModal, setShowPaymentStatusModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [idCardRef, setIdCardRef] = useState(null);
  
  // Stats
  const [stats, setStats] = useState({
    total_students: 0,
    total_staff: 0,
    total_classes: 0,
    paid_students: 0,
    partial_paid: 0,
    not_paid: 0
  });

  const isSecretary = ['secretary', 'head', 'hm', 'principal', 'vice_principal', 'accountant'].includes(user?.role);

  useEffect(() => {
    if (isSecretary) {
      loadSecretaryData();
    }
  }, [isSecretary, selectedClass]);

  const loadSecretaryData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [studentsRes, staffRes, classesRes, invoicesRes] = await Promise.all([
        getStudents({ limit: 500, ...(selectedClass && { class_level: selectedClass }) }).catch(() => ({ results: [] })),
        getAllStaff({ limit: 100 }).catch(() => ({ results: [] })),
        getClasses({ is_active: true }).catch(() => ({ results: [] })),
        getMyInvoices({ limit: 500 }).catch(() => ({ results: [] }))
      ]);
      
      const studentsList = studentsRes?.results || studentsRes || [];
      const staffList = staffRes?.results || staffRes || [];
      const classesList = classesRes?.results || classesRes || [];
      const invoicesList = invoicesRes?.results || invoicesRes || [];
      
      setStudents(studentsList);
      setStaff(staffList);
      setClasses(classesList);
      setInvoices(invoicesList);
      
      // Calculate stats
      const paidFull = studentsList.filter(s => s.fee_status === 'paid_full').length;
      const partialPaid = studentsList.filter(s => s.fee_status === 'paid_partial').length;
      const notPaid = studentsList.filter(s => s.fee_status === 'not_paid' || !s.fee_status).length;
      
      setStats({
        total_students: studentsList.length,
        total_staff: staffList.length,
        total_classes: classesList.length,
        paid_students: paidFull,
        partial_paid: partialPaid,
        not_paid: notPaid
      });
      
    } catch (err) {
      console.error('Error loading secretary data:', err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const generateIDCard = async (person, type) => {
    setSelectedItem({ ...person, type });
    setShowIdCardModal(true);
    
    // Small delay to ensure DOM is rendered
    setTimeout(() => {
      if (idCardRef) {
        html2canvas(idCardRef, { scale: 2 }).then(canvas => {
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF('landscape', 'mm', [85.6, 54]); // ID card size
          pdf.addImage(imgData, 'PNG', 0, 0, 85.6, 54);
          pdf.save(`${type}_card_${person.staff_id || person.admission_number}.pdf`);
        });
      }
    }, 500);
  };

  const generateReportCard = (student) => {
    setSelectedItem(student);
    setShowReportModal(true);
  };

  const checkPaymentStatus = (student) => {
    const studentInvoices = invoices.filter(inv => inv.student_id === student.id);
    const totalDue = studentInvoices.reduce((sum, inv) => sum + (inv.balance_due || 0), 0);
    const totalPaid = studentInvoices.reduce((sum, inv) => sum + (inv.amount_paid || 0), 0);
    const totalAmount = studentInvoices.reduce((sum, inv) => sum + (inv.total_amount || 0), 0);
    
    return {
      student,
      invoices: studentInvoices,
      total_due: totalDue,
      total_paid: totalPaid,
      total_amount: totalAmount,
      status: student.fee_status || (totalDue <= 0 ? 'paid_full' : totalPaid > 0 ? 'paid_partial' : 'not_paid')
    };
  };

  const filteredStudents = students.filter(student => {
    const search = searchTerm.toLowerCase();
    const name = `${student.user?.first_name || ''} ${student.user?.last_name || ''}`.toLowerCase();
    const admission = (student.admission_number || '').toLowerCase();
    return name.includes(search) || admission.includes(search);
  });

  const filteredStaff = staff.filter(staffMember => {
    const search = searchTerm.toLowerCase();
    const name = `${staffMember.user?.first_name || ''} ${staffMember.user?.last_name || ''}`.toLowerCase();
    const staffId = (staffMember.staff_id || '').toLowerCase();
    return name.includes(search) || staffId.includes(search);
  });

  const formatCurrency = (amount) => {
    if (!amount) return '₦0';
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(amount);
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-GB');
  };

  const getFeeStatusBadge = (status) => {
    const config = {
      paid_full: { bg: 'bg-green-100 text-green-800', icon: <CheckCircle size={10} />, label: 'Fully Paid' },
      paid_partial: { bg: 'bg-yellow-100 text-yellow-800', icon: <Clock size={10} />, label: 'Partial' },
      not_paid: { bg: 'bg-red-100 text-red-800', icon: <XCircle size={10} />, label: 'Not Paid' },
      scholarship: { bg: 'bg-blue-100 text-blue-800', icon: <Award size={10} />, label: 'Scholarship' },
      exempted: { bg: 'bg-gray-100 text-gray-800', icon: <CheckCircle size={10} />, label: 'Exempted' }
    };
    const cfg = config[status] || config.not_paid;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${cfg.bg}`}>
        {cfg.icon} {cfg.label}
      </span>
    );
  };

  if (!isSecretary) {
    return (
      <DashboardLayout title="Access Denied">
        <div className="flex items-center justify-center min-h-[60vh] px-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={28} className="text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">You don't have permission to access the Secretary Dashboard.</p>
            <button onClick={() => navigate('/dashboard')} className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm">Go to Dashboard</button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (loading) {
    return (
      <DashboardLayout title="Secretary Dashboard">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-3"></div>
            <p className="text-gray-500 text-sm">Loading data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Secretary Dashboard">
      <div className="py-6 px-4 sm:px-0">
        
        {/* Error/Success Alerts */}
        {error && <Alert type="error" message={error} onClose={() => setError('')} className="mb-4" />}
        {success && <Alert type="success" message={success} onClose={() => setSuccess('')} className="mb-4" />}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Secretary Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Student & Staff Management • ID Cards • Report Cards • Payment Status</p>
          </div>
          <button onClick={loadSecretaryData} className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          <div className="bg-white rounded-xl border border-gray-100 p-3 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xl font-bold text-gray-900">{stats.total_students}</p>
                <p className="text-xs text-gray-500">Students</p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users size={16} className="text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-3 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xl font-bold text-gray-900">{stats.total_staff}</p>
                <p className="text-xs text-gray-500">Staff</p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <UserCheck size={16} className="text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-3 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xl font-bold text-gray-900">{stats.total_classes}</p>
                <p className="text-xs text-gray-500">Classes</p>
              </div>
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <School size={16} className="text-purple-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-3 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xl font-bold text-gray-900">{stats.paid_students}</p>
                <p className="text-xs text-gray-500">Fully Paid</p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle size={16} className="text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-3 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xl font-bold text-gray-900">{stats.partial_paid}</p>
                <p className="text-xs text-gray-500">Partial</p>
              </div>
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock size={16} className="text-yellow-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-3 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xl font-bold text-gray-900">{stats.not_paid}</p>
                <p className="text-xs text-gray-500">Not Paid</p>
              </div>
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle size={16} className="text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <div className="flex flex-wrap gap-2 sm:gap-4">
            <button onClick={() => setActiveTab('students')} className={`px-3 py-2 text-sm font-medium transition-colors ${activeTab === 'students' ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
              <Users size={14} className="inline mr-1" /> Students
            </button>
            <button onClick={() => setActiveTab('staff')} className={`px-3 py-2 text-sm font-medium transition-colors ${activeTab === 'staff' ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
              <UserCheck size={14} className="inline mr-1" /> Staff
            </button>
            <button onClick={() => setActiveTab('idcards')} className={`px-3 py-2 text-sm font-medium transition-colors ${activeTab === 'idcards' ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
              <IdCard size={14} className="inline mr-1" /> ID Cards
            </button>
            <button onClick={() => setActiveTab('reports')} className={`px-3 py-2 text-sm font-medium transition-colors ${activeTab === 'reports' ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
              <FileText size={14} className="inline mr-1" /> Report Cards
            </button>
            <button onClick={() => setActiveTab('payment-status')} className={`px-3 py-2 text-sm font-medium transition-colors ${activeTab === 'payment-status' ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
              <DollarSign size={14} className="inline mr-1" /> Payment Status
            </button>
          </div>
        </div>

        {/* ==================== STUDENTS TAB ==================== */}
        {activeTab === 'students' && (
          <>
            <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6 shadow-sm">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input type="text" placeholder="Search students by name or admission number..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-sm" />
                </div>
                <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm w-full sm:w-48">
                  <option value="">All Classes</option>
                  {classes.map(cls => <option key={cls.id} value={cls.class_level?.id || cls.id}>{cls.name}</option>)}
                </select>
                <button onClick={() => navigate('/students/create')} className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm flex items-center gap-2">
                  <Plus size={14} /> New Student
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Student</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Admission No</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Class</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Fee Status</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredStudents.map(student => (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                              <span className="text-xs font-medium">{(student.user?.first_name?.[0] || 'S').toUpperCase()}</span>
                            </div>
                            <div>
                              <p className="font-medium text-sm">{student.user?.first_name} {student.user?.last_name}</p>
                              <p className="text-xs text-gray-500">{student.user?.email || 'No email'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm font-mono">{student.admission_number}</td>
                        <td className="px-4 py-3 text-sm">{student.class_level?.name || 'Not assigned'}</td>
                        <td className="px-4 py-3">{getFeeStatusBadge(student.fee_status)}</td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex gap-2 justify-center">
                            <button onClick={() => generateIDCard(student, 'student')} className="p-1.5 bg-blue-100 text-blue-600 rounded hover:bg-blue-200" title="Print ID Card">
                              <IdCard size={14} />
                            </button>
                            <button onClick={() => generateReportCard(student)} className="p-1.5 bg-purple-100 text-purple-600 rounded hover:bg-purple-200" title="Print Report Card">
                              <FileText size={14} />
                            </button>
                            <button onClick={() => { setSelectedItem(student); setShowPaymentStatusModal(true); }} className="p-1.5 bg-green-100 text-green-600 rounded hover:bg-green-200" title="Payment Status">
                              <DollarSign size={14} />
                            </button>
                            <button onClick={() => navigate(`/students/${student.id}`)} className="p-1.5 bg-gray-100 text-gray-600 rounded hover:bg-gray-200" title="View Details">
                              <Eye size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredStudents.length === 0 && (
                      <tr>
                        <td colSpan="5" className="text-center py-8 text-gray-400">No students found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ==================== STAFF TAB ==================== */}
        {activeTab === 'staff' && (
          <>
            <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6 shadow-sm">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input type="text" placeholder="Search staff by name or staff ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-sm" />
                </div>
                <button onClick={() => navigate('/staff/create')} className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm flex items-center gap-2">
                  <Plus size={14} /> New Staff
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Staff</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Staff ID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Position</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Department</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredStaff.map(staffMember => (
                      <tr key={staffMember.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                              <span className="text-xs font-medium">{(staffMember.user?.first_name?.[0] || 'S').toUpperCase()}</span>
                            </div>
                            <div>
                              <p className="font-medium text-sm">{staffMember.user?.first_name} {staffMember.user?.last_name}</p>
                              <p className="text-xs text-gray-500">{staffMember.user?.email || 'No email'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm font-mono">{staffMember.staff_id}</td>
                        <td className="px-4 py-3 text-sm">{staffMember.position_title || 'N/A'}</td>
                        <td className="px-4 py-3 text-sm">{staffMember.department?.replace('_', ' ').toUpperCase() || 'N/A'}</td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex gap-2 justify-center">
                            <button onClick={() => generateIDCard(staffMember, 'staff')} className="p-1.5 bg-blue-100 text-blue-600 rounded hover:bg-blue-200" title="Print ID Card">
                              <IdCard size={14} />
                            </button>
                            <button onClick={() => navigate(`/staff/${staffMember.id}`)} className="p-1.5 bg-gray-100 text-gray-600 rounded hover:bg-gray-200" title="View Details">
                              <Eye size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredStaff.length === 0 && (
                      <tr>
                        <td colSpan="5" className="text-center py-8 text-gray-400">No staff found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ==================== ID CARDS TAB ==================== */}
        {activeTab === 'idcards' && (
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <div className="text-center mb-6">
              <IdCard size={48} className="mx-auto text-gray-400 mb-3" />
              <h2 className="text-lg font-semibold text-gray-800">Generate ID Cards</h2>
              <p className="text-sm text-gray-500">Click the ID Card icon next to any student or staff member to generate their ID card</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-xl p-4 text-center">
                <Users size={24} className="mx-auto text-blue-600 mb-2" />
                <h3 className="font-medium text-blue-800">Student ID Cards</h3>
                <p className="text-sm text-blue-600 mb-3">Generate ID cards for students</p>
                <button onClick={() => setActiveTab('students')} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">Go to Students</button>
              </div>
              <div className="bg-green-50 rounded-xl p-4 text-center">
                <UserCheck size={24} className="mx-auto text-green-600 mb-2" />
                <h3 className="font-medium text-green-800">Staff ID Cards</h3>
                <p className="text-sm text-green-600 mb-3">Generate ID cards for staff members</p>
                <button onClick={() => setActiveTab('staff')} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm">Go to Staff</button>
              </div>
            </div>
          </div>
        )}

        {/* ==================== REPORT CARDS TAB ==================== */}
        {activeTab === 'reports' && (
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <div className="text-center mb-6">
              <FileText size={48} className="mx-auto text-gray-400 mb-3" />
              <h2 className="text-lg font-semibold text-gray-800">Report Cards</h2>
              <p className="text-sm text-gray-500">Click the Report Card icon next to any student to generate their report card</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 text-center max-w-md mx-auto">
              <Users size={24} className="mx-auto text-blue-600 mb-2" />
              <h3 className="font-medium text-blue-800">Student Report Cards</h3>
              <p className="text-sm text-blue-600 mb-3">Generate report cards for students</p>
              <button onClick={() => setActiveTab('students')} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">Go to Students</button>
            </div>
          </div>
        )}

        {/* ==================== PAYMENT STATUS TAB ==================== */}
        {activeTab === 'payment-status' && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Student</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Class</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Total Fee</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Paid</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Balance</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Status</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {students.map(student => {
                    const paymentInfo = checkPaymentStatus(student);
                    return (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <p className="font-medium text-sm">{student.user?.first_name} {student.user?.last_name}</p>
                          <p className="text-xs text-gray-500">{student.admission_number}</p>
                        </td>
                        <td className="px-4 py-3 text-sm">{student.class_level?.name || 'Not assigned'}</td>
                        <td className="px-4 py-3 text-right">{formatCurrency(paymentInfo.total_amount)}</td>
                        <td className="px-4 py-3 text-right text-green-600">{formatCurrency(paymentInfo.total_paid)}</td>
                        <td className="px-4 py-3 text-right text-red-600">{formatCurrency(paymentInfo.total_due)}</td>
                        <td className="px-4 py-3">{getFeeStatusBadge(paymentInfo.status)}</td>
                        <td className="px-4 py-3 text-center">
                          <button onClick={() => { setSelectedItem(paymentInfo); setShowPaymentStatusModal(true); }} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200">
                            View Details
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {students.length === 0 && (
                    <tr>
                      <td colSpan="7" className="text-center py-8 text-gray-400">No students found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ID Card Modal with Print Template */}
      <Modal isOpen={showIdCardModal} onClose={() => setShowIdCardModal(false)} title="ID Card Preview" size="md">
        <div className="py-4">
          <div ref={setIdCardRef} className="bg-white rounded-xl shadow-lg p-4 w-full max-w-[85mm] mx-auto border-2 border-gray-200">
            {selectedItem && (
              <>
                <div className="text-center border-b border-gray-200 pb-2 mb-3">
                  <h3 className="text-xs font-bold text-gray-800">CONCORD TUTOR SCHOOL</h3>
                  <p className="text-[8px] text-gray-500">{selectedItem.type === 'student' ? 'STUDENT ID CARD' : 'STAFF ID CARD'}</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-400">
                      {(selectedItem.user?.first_name?.[0] || (selectedItem.type === 'student' ? 'S' : 'T')).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold">{selectedItem.user?.first_name} {selectedItem.user?.last_name}</p>
                    <p className="text-[8px] text-gray-500">{selectedItem.type === 'student' ? selectedItem.admission_number : selectedItem.staff_id}</p>
                    <p className="text-[8px] text-gray-500">{selectedItem.type === 'student' ? selectedItem.class_level?.name : selectedItem.position_title}</p>
                  </div>
                </div>
                <div className="mt-3 pt-2 border-t border-gray-200 text-center">
                  <p className="text-[8px] text-gray-400">Valid for Academic Year</p>
                  <p className="text-[8px] font-bold">{new Date().getFullYear()}/{new Date().getFullYear() + 1}</p>
                </div>
              </>
            )}
          </div>
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500 mb-3">Click "Download PDF" to save the ID card</p>
            <button onClick={() => setShowIdCardModal(false)} className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm">Download PDF</button>
          </div>
        </div>
      </Modal>

      {/* Payment Status Details Modal */}
      <Modal isOpen={showPaymentStatusModal} onClose={() => setShowPaymentStatusModal(false)} title="Payment Status Details" size="lg">
        {selectedItem && (
          <div className="py-4 max-h-[70vh] overflow-y-auto">
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold">
                    {((selectedItem.student?.user?.first_name?.[0]) || (selectedItem.user?.first_name?.[0]) || 'S').toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold">{selectedItem.student?.user?.first_name || selectedItem.user?.first_name} {selectedItem.student?.user?.last_name || selectedItem.user?.last_name}</h3>
                  <p className="text-sm text-gray-500">{selectedItem.student?.admission_number || selectedItem.admission_number}</p>
                  <p className="text-xs text-gray-500">{selectedItem.student?.class_level?.name || selectedItem.class_level?.name}</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-green-50 rounded-lg p-3 text-center">
                <p className="text-xs text-green-600">Total Paid</p>
                <p className="text-xl font-bold text-green-700">{formatCurrency(selectedItem.total_paid)}</p>
              </div>
              <div className="bg-red-50 rounded-lg p-3 text-center">
                <p className="text-xs text-red-600">Total Due</p>
                <p className="text-xl font-bold text-red-700">{formatCurrency(selectedItem.total_due)}</p>
              </div>
            </div>
            
            <h4 className="font-semibold text-sm mb-2">Invoice History</h4>
            <div className="space-y-2">
              {(selectedItem.invoices || []).map(inv => (
                <div key={inv.id} className="border border-gray-100 rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-mono text-xs">{inv.invoice_number}</p>
                      <p className="text-xs text-gray-500">{inv.session_name} / {inv.term_name}</p>
                    </div>
                    {getFeeStatusBadge(inv.status)}
                  </div>
                  <div className="flex justify-between mt-2 text-sm">
                    <span>Total: {formatCurrency(inv.total_amount)}</span>
                    <span className="text-green-600">Paid: {formatCurrency(inv.amount_paid)}</span>
                    <span className="text-red-600">Balance: {formatCurrency(inv.balance_due)}</span>
                  </div>
                </div>
              ))}
              {(!selectedItem.invoices || selectedItem.invoices.length === 0) && (
                <p className="text-gray-400 text-center py-4">No invoices found</p>
              )}
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
};

export default SecretaryDashboard;