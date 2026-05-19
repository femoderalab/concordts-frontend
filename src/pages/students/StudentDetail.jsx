/**
 * Student Detail Page - FULLY RESPONSIVE
 * Rich view with all student data, same quality as StudentList view modal
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import Alert from "../../components/common/Alert";
import Button from "../../components/common/Button";
import Modal from "../../components/common/modal";
import useAuth from "../../hooks/useAuth";
import {
  getStudentById,
  updateStudent,
  uploadStudentDocument,
  updateStudentPassword,
  deleteStudent,
} from '../../services/studentService';
import { handleApiError } from '../../services/api';
import {
  ArrowLeft, Edit2, Trash2, Lock, Printer, Upload,
  User, BookOpen, DollarSign, Heart, FileText, Activity,
  CheckCircle, XCircle, Clock, Award, UserCheck, UserX,
  Shield, Phone, Mail, MapPin, Calendar, Home, School,
  Save, X, RefreshCw, ChevronDown, ChevronUp
} from 'lucide-react';

// =====================
// HELPER COMPONENTS - RESPONSIVE
// =====================
const Section = ({ title, icon, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 sm:px-5 py-2.5 sm:py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between hover:bg-gray-100 transition-colors"
      >
        <h4 className="text-xs sm:text-sm font-semibold text-gray-800 flex items-center gap-1.5 sm:gap-2">
          {icon && <span className="text-gray-400 w-3 h-3 sm:w-4 sm:h-4">{icon}</span>}
          {title}
        </h4>
        {isOpen ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
      </button>
      {isOpen && <div className="p-3 sm:p-5">{children}</div>}
    </div>
  );
};

const InfoRow = ({ label, value, fullWidth = false }) => (
  <div className={fullWidth ? 'col-span-full' : ''}>
    <div className="text-[9px] sm:text-xs text-gray-400 mb-0.5 sm:mb-1 font-medium uppercase tracking-wide">{label}</div>
    <div className="text-xs sm:text-sm font-medium text-gray-800 bg-gray-50 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-gray-100 break-words min-h-[32px] sm:min-h-[36px]">
      {value || <span className="text-gray-300 italic text-[10px] sm:text-xs">—</span>}
    </div>
  </div>
);

const StudentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Permissions
  const isAdmin = user?.role === 'head' || user?.role === 'hm' ||
    user?.role === 'principal' || user?.role === 'vice_principal' || user?.is_staff;
  const canEdit = isAdmin || ['accountant', 'secretary', 'teacher', 'form_teacher', 'subject_teacher'].includes(user?.role);

  // Core state
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Edit form
  const [editForm, setEditForm] = useState({});
  const [editLoading, setEditLoading] = useState(false);
  const [editErrors, setEditErrors] = useState({});

  // Password form
  const [passwordForm, setPasswordForm] = useState({ new_password: '', confirm_password: '' });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState({});

  // Document upload
  const [documentData, setDocumentData] = useState({ document_type: 'student_image', document: null });
  const [uploading, setUploading] = useState(false);

  // =====================
  // FETCH STUDENT
  // =====================
  useEffect(() => {
    if (id) fetchStudent();
  }, [id]);

  const fetchStudent = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getStudentById(id);
      const data = response?.student || response;
      setStudent(data);
      populateEditForm(data);
    } catch (err) {
      setError(handleApiError(err) || 'Failed to load student');
    } finally {
      setLoading(false);
    }
  };

  const populateEditForm = (data) => {
    const u = data?.user || {};
    setEditForm({
      first_name: u.first_name || '',
      last_name: u.last_name || '',
      email: u.email || '',
      phone_number: u.phone_number || '',
      gender: u.gender || '',
      date_of_birth: u.date_of_birth || '',
      address: u.address || '',
      city: u.city || '',
      state_of_origin: u.state_of_origin || '',
      lga: u.lga || '',
      nationality: u.nationality || 'Nigerian',
      class_level: data?.class_level_info?.id || data?.class_level || '',
      stream: data?.stream || '',
      student_category: data?.student_category || '',
      house: data?.house || '',
      admission_date: data?.admission_date || '',
      fee_status: data?.fee_status || 'not_paid',
      total_fee_amount: data?.total_fee_amount || '',
      amount_paid: data?.amount_paid || '',
      blood_group: data?.blood_group || '',
      genotype: data?.genotype || '',
      has_allergies: data?.has_allergies || false,
      allergy_details: data?.allergy_details || '',
      has_received_vaccinations: data?.has_received_vaccinations !== undefined ? data.has_received_vaccinations : true,
      medical_conditions: data?.medical_conditions || '',
      has_learning_difficulties: data?.has_learning_difficulties || false,
      learning_difficulties_details: data?.learning_difficulties_details || '',
      emergency_contact_name: data?.emergency_contact_name || '',
      emergency_contact_phone: data?.emergency_contact_phone || '',
      emergency_contact_relationship: data?.emergency_contact_relationship || '',
      transportation_mode: data?.transportation_mode || '',
      bus_route: data?.bus_route || '',
      is_prefect: data?.is_prefect || false,
      prefect_role: data?.prefect_role || '',
      place_of_birth: data?.place_of_birth || '',
      home_language: data?.home_language || '',
      previous_school: data?.previous_school || '',
      previous_class: data?.previous_class || '',
      transfer_certificate_no: data?.transfer_certificate_no || '',
      family_doctor_name: data?.family_doctor_name || '',
      family_doctor_phone: data?.family_doctor_phone || '',
      is_active: data?.is_active !== undefined ? data.is_active : true,
      is_graduated: data?.is_graduated || false,
      graduation_date: data?.graduation_date || '',
    });
  };

  // =====================
  // DERIVED DATA
  // =====================
  const getStudentData = () => {
    if (!student) return {};
    const u = student.user || {};
    return {
      fullName: `${u.first_name || ''} ${u.last_name || ''}`.trim() || 'Unknown Student',
      firstName: u.first_name || '',
      lastName: u.last_name || '',
      email: u.email || '',
      phone: u.phone_number || '',
      gender: u.gender ? u.gender.charAt(0).toUpperCase() + u.gender.slice(1) : '',
      dob: u.date_of_birth || '',
      registrationNumber: u.registration_number || student.registration_number || 'N/A',
      address: u.address || '',
      city: u.city || '',
      lga: u.lga || '',
      state: u.state_of_origin || '',
      nationality: u.nationality || '',
      regNo: u.registration_number || '',
      classLevel: student.class_level_info?.name || student.class_level?.name || 'Not assigned',
      stream: {
        science: 'Science', commercial: 'Commercial', art: 'Arts/Humanities',
        technical: 'Technical', general: 'General', none: 'No Stream'
      }[student.stream] || 'No Stream',
      category: {
        day: 'Day Student', boarding: 'Boarding', special_needs: 'Special Needs',
        scholarship: 'Scholarship', repeat: 'Repeating', new: 'New Student'
      }[student.student_category] || student.student_category || '',
      house: student.house || 'None',
      transport: {
        school_bus: 'School Bus', parent_drop: 'Parent Drop-off',
        public_transport: 'Public Transport', walk: 'Walks to School'
      }[student.transportation_mode] || 'Other',
      totalFee: Number(student.total_fee_amount || 0),
      amountPaid: Number(student.amount_paid || 0),
      balanceDue: Number(student.balance_due ?? (Number(student.total_fee_amount || 0) - Number(student.amount_paid || 0))),
      imageUrl: student.student_image_url || student.student_image || null,
    };
  };

  const calculateAge = (dob) => {
    if (!dob) return '';
    const diff = Date.now() - new Date(dob).getTime();
    return `${Math.abs(new Date(diff).getUTCFullYear() - 1970)} years`;
  };

  const formatDate = (d) => {
    if (!d) return '';
    return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  // =====================
  // STATUS BADGES - COMPACT
  // =====================
  const StatusBadge = () => {
    if (!student?.is_active)
      return <span className="inline-flex items-center gap-0.5 px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-xs font-medium bg-red-100 text-red-700"><UserX size={9} />Inactive</span>;
    if (student?.is_graduated)
      return <span className="inline-flex items-center gap-0.5 px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-xs font-medium bg-purple-100 text-purple-700"><Award size={9} />Graduated</span>;
    return <span className="inline-flex items-center gap-0.5 px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-xs font-medium bg-green-100 text-green-700"><UserCheck size={9} />Active</span>;
  };

  const FeeBadge = () => {
    const cfg = {
      paid_full: { bg: 'bg-green-100', text: 'text-green-700', label: 'Fully Paid', icon: <CheckCircle size={9} /> },
      paid_partial: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Partial', icon: <Clock size={9} /> },
      not_paid: { bg: 'bg-red-100', text: 'text-red-700', label: 'Not Paid', icon: <XCircle size={9} /> },
      scholarship: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Scholarship', icon: <Award size={9} /> },
      exempted: { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Exempted', icon: <Shield size={9} /> },
    }[student?.fee_status] || { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Unknown', icon: null };
    return (
      <span className={`inline-flex items-center gap-0.5 px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-xs font-medium ${cfg.bg} ${cfg.text}`}>
        {cfg.icon}{cfg.label}
      </span>
    );
  };

  // =====================
  // PRINT
  // =====================
  const handlePrint = () => {
    if (!student) return;
    const d = getStudentData();
    const win = window.open('', '_blank');
    win.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${d.fullName} - Student Record</title>
    <style>
      *{margin:0;padding:0;box-sizing:border-box}
      body{font-family:Arial,sans-serif;line-height:1.4;color:#333;padding:15px}
      .header{text-align:center;border-bottom:2px solid #003366;padding-bottom:12px;margin-bottom:15px}
      .school-name{font-size:20px;font-weight:bold;color:#003366}
      .student-header{background:#f8f9fa;padding:12px;border-radius:8px;margin-bottom:15px;display:flex;flex-wrap:wrap;align-items:flex-start;border:1px solid #e0e0e0}
      .photo{width:70px;height:70px;border-radius:8px;object-fit:cover;margin-right:12px}
      .photo-placeholder{width:70px;height:70px;border-radius:8px;background:#e3f2fd;display:flex;align-items:center;justify-content:center;margin-right:12px;font-size:30px;font-weight:bold;color:#1976d2}
      .student-name{font-size:16px;font-weight:bold;color:#003366;margin-bottom:4px}
      .section{margin-bottom:15px;page-break-inside:avoid}
      .section-title{font-size:13px;font-weight:bold;color:#003366;margin-bottom:8px;padding-bottom:3px;border-bottom:1px solid #e0e0e0}
      .two-col{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px}
      .info-box{padding:8px;border:1px solid #e0e0e0;border-radius:6px}
      .info-row{display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid #f0f0f0;font-size:11px}
      .fee-cards{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:8px}
      .fee-card{text-align:center;padding:8px;border-radius:6px}
      .fee-amount{font-size:14px;font-weight:bold}
      .fee-label{font-size:10px;color:#666;margin-bottom:2px}
      .footer{margin-top:20px;padding-top:10px;border-top:1px solid #e0e0e0;text-align:center;font-size:9px;color:#888}
      @media print{body{padding:0}}
    </style></head><body>
    <div class="header"><div class="school-name">CONCORD TUTOR SCHOOL</div><div style="font-size:11px;color:#666">Complete Student Record</div></div>
    <div class="student-header">${d.imageUrl ? `<img src="${d.imageUrl}" class="photo" onerror="this.style.display='none'">` : `<div class="photo-placeholder">${d.fullName.charAt(0)}</div>`}
      <div><div class="student-name">${d.fullName}</div>
      <div style="font-size:11px;color:#555">Reg: ${d.regNo} | Adm: ${student.admission_number || 'N/A'}</div>
      <div style="font-size:11px;color:#555">${d.classLevel} | ${d.stream}</div></div>
    </div>
    <div class="section"><div class="section-title">Personal Info</div><div class="two-col">
      <div class="info-box"><div class="info-row"><span>Full Name</span><span>${d.fullName}</span></div><div class="info-row"><span>Gender</span><span>${d.gender || 'N/A'}</span></div><div class="info-row"><span>DOB</span><span>${d.dob || 'N/A'}</span></div></div>
      <div class="info-box"><div class="info-row"><span>Email</span><span>${d.email || 'N/A'}</span></div><div class="info-row"><span>Phone</span><span>${d.phone || 'N/A'}</span></div><div class="info-row"><span>State</span><span>${d.state || 'N/A'}</span></div></div>
    </div></div>
    <div class="section"><div class="section-title">Financial Info</div><div class="fee-cards">
      <div class="fee-card blue"><div class="fee-label">Total Fee</div><div class="fee-amount">₦${d.totalFee.toLocaleString()}</div></div>
      <div class="fee-card green"><div class="fee-label">Paid</div><div class="fee-amount">₦${d.amountPaid.toLocaleString()}</div></div>
      <div class="fee-card red"><div class="fee-label">Balance</div><div class="fee-amount">₦${d.balanceDue.toLocaleString()}</div></div>
    </div></div>
    <div class="section"><div class="section-title">Health & Emergency</div><div class="info-box">
      <div class="info-row"><span>Blood Group</span><span>${student.blood_group || 'N/A'}</span></div>
      <div class="info-row"><span>Genotype</span><span>${student.genotype || 'N/A'}</span></div>
      <div class="info-row"><span>Emergency Contact</span><span>${student.emergency_contact_name || 'N/A'} (${student.emergency_contact_phone || 'N/A'})</span></div>
    </div></div>
    <div class="footer"><p>Official Student Record — Generated ${new Date().toLocaleDateString()}</p></div>
    </body></html>`);
    win.document.close();
    win.onload = () => win.print();
  };

  // =====================
  // EDIT SUBMIT
  // =====================
  const handleEditChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: type === 'file' ? files[0] : type === 'checkbox' ? checked : value
    }));
    if (editErrors[name]) setEditErrors(prev => ({ ...prev, [name]: '' }));
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!editForm.first_name?.trim()) errors.first_name = 'Required';
    if (!editForm.last_name?.trim()) errors.last_name = 'Required';
    setEditErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      setEditLoading(true);
      setError('');
      await updateStudent(id, editForm);
      setSuccess('Student updated successfully!');
      setShowEditModal(false);
      fetchStudent();
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(handleApiError(err) || 'Update failed');
    } finally {
      setEditLoading(false);
    }
  };

  // =====================
  // PASSWORD RESET
  // =====================
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
    if (passwordErrors[name]) setPasswordErrors(prev => ({ ...prev, [name]: '' }));
  };

  const submitPassword = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!passwordForm.new_password) errors.new_password = 'Required';
    if (!passwordForm.confirm_password) errors.confirm_password = 'Required';
    if (passwordForm.new_password !== passwordForm.confirm_password) errors.confirm_password = 'Passwords do not match';
    if (passwordForm.new_password && passwordForm.new_password.length < 5) errors.new_password = 'Min 5 characters';
    setPasswordErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      setPasswordLoading(true);
      setError('');
      await updateStudentPassword(id, passwordForm);
      setSuccess('Password reset successfully!');
      setShowPasswordModal(false);
      setPasswordForm({ new_password: '', confirm_password: '' });
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(handleApiError(err) || 'Password reset failed');
    } finally {
      setPasswordLoading(false);
    }
  };

  // =====================
  // DELETE
  // =====================
  const confirmDelete = async () => {
    try {
      setError('');
      await deleteStudent(id);
      navigate('/students');
    } catch (err) {
      setError(handleApiError(err) || 'Delete failed');
      setShowDeleteModal(false);
    }
  };

  // =====================
  // DOCUMENT UPLOAD
  // =====================
  const submitDocument = async (e) => {
    e.preventDefault();
    if (!documentData.document) { setError('Please select a file'); return; }
    try {
      setUploading(true);
      setError('');
      await uploadStudentDocument(id, documentData);
      setSuccess('Document uploaded!');
      setShowDocumentModal(false);
      setDocumentData({ document_type: 'student_image', document: null });
      fetchStudent();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(handleApiError(err) || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  // =====================
  // LOADING / ERROR STATES
  // =====================
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-3"></div>
            <p className="text-gray-400 text-sm">Loading student profile...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error && !student) {
    return (
      <DashboardLayout>
        <div className="max-w-md mx-auto mt-16 text-center px-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <XCircle size={24} className="text-red-500" />
          </div>
          <h2 className="text-base sm:text-xl font-semibold text-gray-800 mb-2">Failed to Load Student</h2>
          <p className="text-xs sm:text-sm text-gray-500 mb-5">{error}</p>
          <div className="flex gap-3 justify-center">
            <button onClick={fetchStudent} className="px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-700">
              <RefreshCw size={14} className="inline mr-2" /> Retry
            </button>
            <Link to="/students">
              <button className="px-4 py-2 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50">
                <ArrowLeft size={14} className="inline mr-2" /> Back
              </button>
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!student) return null;

  const d = getStudentData();

  const documentStatus = {
    birth_certificate: student.birth_certificate_uploaded || !!student.birth_certificate_url,
    student_image: student.student_image_uploaded || !!student.student_image_url,
    immunization_record: student.immunization_record_uploaded || !!student.immunization_record_url,
    previous_school_report: student.previous_school_report_uploaded || !!student.previous_school_report_url,
    parent_id_copy: student.parent_id_copy_uploaded || !!student.parent_id_copy_url,
  };

  // =====================
  // MAIN RENDER - RESPONSIVE
  // =====================
  return (
    <DashboardLayout>
      <div className="space-y-4 pb-10 px-3 sm:px-0">
        
        {/* Alerts */}
        {success && <Alert type="success" message={success} onClose={() => setSuccess('')} className="mb-2" />}
        {error && <Alert type="error" message={error} onClose={() => setError('')} className="mb-2" />}

        {/* Back Navigation */}
        <div>
          <Link to="/students" className="inline-flex items-center text-gray-500 hover:text-gray-700 text-xs sm:text-sm font-medium transition-colors">
            <ArrowLeft size={14} className="mr-1" /> Back to Students
          </Link>
        </div>

        {/* ===================== PROFILE HEADER - COMPACT ===================== */}
        <div className="flex flex-col xs:flex-row items-start xs:items-center gap-3">
          {/* Photo */}
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-white shadow flex-shrink-0">
            {d.imageUrl ? (
              <img src={d.imageUrl} alt={d.fullName} className="w-full h-full object-cover" />
            ) : (
              <span className="text-base sm:text-xl font-bold text-gray-500">{d.fullName.charAt(0)}</span>
            )}
          </div>

          {/* Name & badges */}
          <div className="flex-1 min-w-0">
            <h1 className="text-base sm:text-xl font-bold text-gray-900 truncate">{d.fullName}</h1>
            <div className="flex flex-wrap items-center gap-1.5 mt-1">
              {/* ADD THIS - Registration number (login credential) */}
              <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-[9px] sm:text-xs font-medium rounded">
                <strong>Login:</strong> {d.registrationNumber}
              </span>
              <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-[9px] sm:text-xs font-medium rounded">{student.admission_number || 'No ID'}</span>
              <StatusBadge />
              <FeeBadge />
            </div>
            ...
          </div>
        </div>

        {/* ===================== CONTENT GRID ===================== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* LEFT — 2 cols */}
          <div className="lg:col-span-2 space-y-4">

            {/* Personal Information */}
            <Section title="Personal Information" icon={<User size={12} />}>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <InfoRow label="First Name" value={d.firstName} />
                <InfoRow label="Last Name" value={d.lastName} />
                <InfoRow label="Registration No (Login)" value={d.registrationNumber} />
                <InfoRow label="Email" value={d.email} />
                <InfoRow label="Phone" value={d.phone} />
                <InfoRow label="Gender" value={d.gender} />
                <InfoRow label="Date of Birth" value={d.dob ? `${formatDate(d.dob)} (${calculateAge(d.dob)})` : ''} />
                <InfoRow label="Nationality" value={d.nationality} />
                <InfoRow label="State of Origin" value={d.state} />
                <InfoRow label="LGA" value={d.lga} />
                <InfoRow label="City" value={d.city} />
              </div>
              <div className="mt-2">
                <InfoRow label="Address" value={d.address} fullWidth />
              </div>
            </Section>

            {/* Academic Information */}
            <Section title="Academic Information" icon={<BookOpen size={12} />}>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <InfoRow label="Class Level" value={d.classLevel} />
                <InfoRow label="Stream" value={d.stream} />
                <InfoRow label="Student Category" value={d.category} />
                <InfoRow label="House" value={d.house} />
                <InfoRow label="Admission Number" value={student.admission_number} />
                <InfoRow label="Student ID" value={student.student_id} />
                <InfoRow label="Admission Date" value={formatDate(student.admission_date)} />
                <InfoRow label="Previous School" value={student.previous_school} />
                <InfoRow label="Transport" value={d.transport} />
                <InfoRow label="Bus Route" value={student.bus_route} />
              </div>
              {student.is_prefect && (
                <div className="mt-3 p-2 bg-amber-50 border border-amber-100 rounded-lg">
                  <div className="text-[9px] font-semibold text-amber-700 uppercase">Prefect Role</div>
                  <div className="text-xs font-medium text-amber-800">{student.prefect_role || 'School Prefect'}</div>
                </div>
              )}
            </Section>

            {/* Health Information */}
            <Section title="Health Information" icon={<Heart size={12} />}>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="bg-red-50 rounded-lg p-2 text-center">
                  <div className="text-[8px] text-red-600">Blood Group</div>
                  <div className="text-xs font-bold">{student.blood_group || '—'}</div>
                </div>
                <div className="bg-red-50 rounded-lg p-2 text-center">
                  <div className="text-[8px] text-red-600">Genotype</div>
                  <div className="text-xs font-bold">{student.genotype || '—'}</div>
                </div>
                <div className="bg-red-50 rounded-lg p-2 text-center">
                  <div className="text-[8px] text-red-600">Allergies</div>
                  <div className="text-xs font-bold">{student.has_allergies ? 'Yes' : 'No'}</div>
                </div>
                <div className="bg-red-50 rounded-lg p-2 text-center">
                  <div className="text-[8px] text-red-600">Vaccinations</div>
                  <div className="text-xs font-bold">{student.has_received_vaccinations ? 'Complete' : 'Incomplete'}</div>
                </div>
              </div>
              {student.has_allergies && <InfoRow label="Allergy Details" value={student.allergy_details} fullWidth />}
              <InfoRow label="Medical Conditions" value={student.medical_conditions} fullWidth />
              <div className="grid grid-cols-2 gap-2 mt-2">
                <InfoRow label="Family Doctor" value={student.family_doctor_name} />
                <InfoRow label="Doctor Phone" value={student.family_doctor_phone} />
              </div>
            </Section>

            {/* Emergency Contact */}
            <Section title="Emergency Contact" icon={<Phone size={12} />}>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <InfoRow label="Contact Name" value={student.emergency_contact_name} />
                <InfoRow label="Relationship" value={student.emergency_contact_relationship} />
                <InfoRow label="Phone Number" value={student.emergency_contact_phone} />
              </div>
            </Section>
          </div>

          {/* RIGHT — 1 col */}
          <div className="space-y-4">

            {/* Financial Summary - Compact */}
            <Section title="Financial Info" icon={<DollarSign size={12} />}>
              <div className="space-y-2 mb-3">
                <div className="bg-blue-50 rounded-lg p-2 text-center">
                  <div className="text-[8px] text-blue-600">Balance Due</div>
                  <div className="text-sm font-bold text-blue-700">₦{d.balanceDue.toLocaleString()}</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <div className="text-[8px] text-gray-500">Total</div>
                    <div className="text-xs font-bold">₦{d.totalFee.toLocaleString()}</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-2 text-center">
                    <div className="text-[8px] text-green-600">Paid</div>
                    <div className="text-xs font-bold text-green-600">₦{d.amountPaid.toLocaleString()}</div>
                  </div>
                </div>
              </div>
              {d.totalFee > 0 && (
                <div>
                  <div className="flex justify-between text-[8px] text-gray-400 mb-0.5">
                    <span>Progress</span>
                    <span>{Math.round((d.amountPaid / d.totalFee) * 100)}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: `${Math.min(100, (d.amountPaid / d.totalFee) * 100)}%` }} />
                  </div>
                </div>
              )}
            </Section>

            {/* Document Status */}
            <Section title="Documents" icon={<FileText size={12} />}>
              <div className="space-y-1.5">
                {[
                  { label: 'Student Photo', key: 'student_image' },
                  { label: 'Birth Certificate', key: 'birth_certificate' },
                  { label: 'Immunization', key: 'immunization_record' },
                  { label: 'School Report', key: 'previous_school_report' },
                  { label: 'Parent ID', key: 'parent_id_copy' },
                ].map((doc) => (
                  <div key={doc.key} className={`flex items-center justify-between p-2 rounded-lg border ${documentStatus[doc.key] ? 'border-green-100 bg-green-50' : 'border-gray-100 bg-gray-50'}`}>
                    <span className="text-[10px] sm:text-xs font-medium text-gray-700">{doc.label}</span>
                    <div className="flex items-center gap-1">
                      <div className={`w-1.5 h-1.5 rounded-full ${documentStatus[doc.key] ? 'bg-green-500' : 'bg-red-400'}`}></div>
                      <span className={`text-[8px] sm:text-[9px] font-medium ${documentStatus[doc.key] ? 'text-green-600' : 'text-red-500'}`}>
                        {documentStatus[doc.key] ? '✓' : '✗'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-2 pt-2 border-t border-gray-100">
                <div className="flex justify-between text-[9px]">
                  <span className="text-gray-500">Complete</span>
                  <span className="font-medium">{Object.values(documentStatus).filter(Boolean).length}/5</span>
                </div>
              </div>
              {canEdit && (
                <button onClick={() => setShowDocumentModal(true)} className="mt-3 w-full inline-flex items-center justify-center gap-1 px-3 py-1.5 border border-gray-200 text-gray-600 text-[10px] font-medium rounded-lg hover:bg-gray-50 transition-colors">
                  <Upload size={10} /> Upload Document
                </button>
              )}
            </Section>

            {/* Account Status */}
            <Section title="Status" icon={<Activity size={12} />}>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-gray-500">Active Status</span>
                  <StatusBadge />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-gray-500">Graduation</span>
                  <span className={`text-[10px] font-medium ${student.is_graduated ? 'text-purple-600' : 'text-gray-500'}`}>
                    {student.is_graduated ? 'Graduated' : 'Not Graduated'}
                  </span>
                </div>
                {student.is_graduated && student.graduation_date && (
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-gray-500">Graduation Date</span>
                    <span className="text-[10px] font-medium text-gray-700">{formatDate(student.graduation_date)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-gray-500">Registration</span>
                  <span className="text-[9px] font-mono text-gray-500">{d.regNo || '—'}</span>
                </div>
              </div>
            </Section>
          </div>
        </div>
      </div>

      {/* ===================== EDIT MODAL - RESPONSIVE ===================== */}
      {showEditModal && (
        <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Student" size="lg">
          <form onSubmit={submitEdit} className="py-3 max-h-[70vh] overflow-y-auto space-y-4 px-1">
            {/* Personal */}
            <div>
              <h4 className="text-xs font-semibold text-gray-700 mb-2 pb-1 border-b">Personal</h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[9px] font-medium text-gray-500 mb-0.5">First Name *</label>
                  <input type="text" name="first_name" value={editForm.first_name || ''} onChange={handleEditChange}
                    className={`w-full px-2 py-1.5 border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-gray-900 ${editErrors.first_name ? 'border-red-400' : 'border-gray-200'}`} />
                </div>
                <div>
                  <label className="block text-[9px] font-medium text-gray-500 mb-0.5">Last Name *</label>
                  <input type="text" name="last_name" value={editForm.last_name || ''} onChange={handleEditChange}
                    className={`w-full px-2 py-1.5 border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-gray-900 ${editErrors.last_name ? 'border-red-400' : 'border-gray-200'}`} />
                </div>
                <div>
                  <label className="block text-[9px] font-medium text-gray-500 mb-0.5">Email</label>
                  <input type="email" name="email" value={editForm.email || ''} onChange={handleEditChange}
                    className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-gray-900" />
                </div>
                <div>
                  <label className="block text-[9px] font-medium text-gray-500 mb-0.5">Phone</label>
                  <input type="tel" name="phone_number" value={editForm.phone_number || ''} onChange={handleEditChange}
                    className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-gray-900" />
                </div>
                <div>
                  <label className="block text-[9px] font-medium text-gray-500 mb-0.5">Gender</label>
                  <select name="gender" value={editForm.gender || ''} onChange={handleEditChange}
                    className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-gray-900">
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] font-medium text-gray-500 mb-0.5">Date of Birth</label>
                  <input type="date" name="date_of_birth" value={editForm.date_of_birth || ''} onChange={handleEditChange}
                    className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-gray-900" />
                </div>
              </div>
            </div>

            {/* Academic */}
            <div>
              <h4 className="text-xs font-semibold text-gray-700 mb-2 pb-1 border-b">Academic</h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[9px] font-medium text-gray-500 mb-0.5">Stream</label>
                  <select name="stream" value={editForm.stream || ''} onChange={handleEditChange}
                    className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-xs">
                    <option value="none">No Stream</option>
                    <option value="science">Science</option>
                    <option value="commercial">Commercial</option>
                    <option value="art">Arts</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] font-medium text-gray-500 mb-0.5">Category</label>
                  <select name="student_category" value={editForm.student_category || ''} onChange={handleEditChange}
                    className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-xs">
                    <option value="day">Day Student</option>
                    <option value="boarding">Boarding</option>
                    <option value="scholarship">Scholarship</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] font-medium text-gray-500 mb-0.5">House</label>
                  <select name="house" value={editForm.house || ''} onChange={handleEditChange}
                    className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-xs">
                    <option value="none">None</option>
                    <option value="red">Red</option>
                    <option value="blue">Blue</option>
                    <option value="green">Green</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] font-medium text-gray-500 mb-0.5">Transport</label>
                  <select name="transportation_mode" value={editForm.transportation_mode || ''} onChange={handleEditChange}
                    className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-xs">
                    <option value="parent_drop">Parent Drop-off</option>
                    <option value="school_bus">School Bus</option>
                    <option value="walk">Walk</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Fees */}
            <div>
              <h4 className="text-xs font-semibold text-gray-700 mb-2 pb-1 border-b">Fees</h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[9px] font-medium text-gray-500 mb-0.5">Fee Status</label>
                  <select name="fee_status" value={editForm.fee_status || 'not_paid'} onChange={handleEditChange}
                    className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-xs">
                    <option value="not_paid">Not Paid</option>
                    <option value="paid_full">Paid in Full</option>
                    <option value="paid_partial">Partially Paid</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] font-medium text-gray-500 mb-0.5">Total Fee (₦)</label>
                  <input type="number" name="total_fee_amount" value={editForm.total_fee_amount || ''} onChange={handleEditChange}
                    className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-xs" />
                </div>
              </div>
            </div>

            {/* Status Checkboxes */}
            <div>
              <h4 className="text-xs font-semibold text-gray-700 mb-2 pb-1 border-b">Status</h4>
              <div className="flex flex-wrap gap-3">
                {[
                  { name: 'is_active', label: 'Active' },
                  { name: 'is_graduated', label: 'Graduated' },
                  { name: 'has_allergies', label: 'Allergies' },
                ].map(f => (
                  <label key={f.name} className="flex items-center gap-1 text-[10px] text-gray-600">
                    <input type="checkbox" name={f.name} checked={!!editForm[f.name]} onChange={handleEditChange} />
                    {f.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-2 pt-2 border-t">
              <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 px-3 py-2 border border-gray-200 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-50">Cancel</button>
              <button type="submit" disabled={editLoading} className="flex-1 px-3 py-2 bg-gray-900 text-white rounded-lg text-xs font-medium hover:bg-gray-700">
                {editLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ===================== PASSWORD MODAL ===================== */}
      {showPasswordModal && (
        <Modal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)} title="Reset Password" size="sm">
          <form onSubmit={submitPassword} className="py-3 space-y-3">
            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Lock size={16} className="text-amber-600" />
            </div>
            <p className="text-center text-[11px] text-gray-500 mb-3">Reset for <strong>{d.fullName.split(' ')[0]}</strong></p>
            <input type="password" name="new_password" value={passwordForm.new_password} onChange={handlePasswordChange} placeholder="New Password"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
            <input type="password" name="confirm_password" value={passwordForm.confirm_password} onChange={handlePasswordChange} placeholder="Confirm Password"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
            {passwordErrors.confirm_password && <p className="text-[10px] text-red-500">{passwordErrors.confirm_password}</p>}
            <div className="flex gap-2 pt-2">
              <button type="button" onClick={() => setShowPasswordModal(false)} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-xs font-medium">Cancel</button>
              <button type="submit" disabled={passwordLoading} className="flex-1 px-3 py-2 bg-amber-600 text-white rounded-lg text-xs font-medium">Reset</button>
            </div>
          </form>
        </Modal>
      )}

      {/* ===================== DOCUMENT MODAL ===================== */}
      {showDocumentModal && (
        <Modal isOpen={showDocumentModal} onClose={() => setShowDocumentModal(false)} title="Upload Document" size="sm">
          <form onSubmit={submitDocument} className="py-3 space-y-3">
            <div>
              <label className="block text-[10px] font-medium text-gray-500 mb-1">Document Type</label>
              <select value={documentData.document_type} onChange={(e) => setDocumentData(prev => ({ ...prev, document_type: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                <option value="student_image">Student Photo</option>
                <option value="birth_certificate">Birth Certificate</option>
                <option value="immunization_record">Immunization</option>
                <option value="previous_school_report">School Report</option>
                <option value="parent_id_copy">Parent ID</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-medium text-gray-500 mb-1">Select File</label>
              <input type="file" onChange={(e) => setDocumentData(prev => ({ ...prev, document: e.target.files[0] }))}
                className="w-full text-sm" accept=".pdf,.jpg,.jpeg,.png" />
            </div>
            <div className="flex gap-2 pt-2">
              <button type="button" onClick={() => setShowDocumentModal(false)} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-xs font-medium">Cancel</button>
              <button type="submit" disabled={uploading || !documentData.document} className="flex-1 px-3 py-2 bg-gray-900 text-white rounded-lg text-xs font-medium">
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ===================== DELETE MODAL ===================== */}
      {showDeleteModal && (
        <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete Student" size="sm">
          <div className="py-4 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Trash2 size={18} className="text-red-600" />
            </div>
            <h3 className="text-sm font-semibold text-gray-800 mb-1">Delete {d.fullName.split(' ')[0]}?</h3>
            <p className="text-[11px] text-gray-500 mb-4">This action is permanent.</p>
            <div className="flex gap-2">
              <button onClick={() => setShowDeleteModal(false)} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-xs font-medium">Cancel</button>
              <button onClick={confirmDelete} className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg text-xs font-medium">Delete</button>
            </div>
          </div>
        </Modal>
      )}
    </DashboardLayout>
  );
};

export default StudentDetail;