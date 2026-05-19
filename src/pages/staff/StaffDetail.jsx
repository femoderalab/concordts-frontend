// src/pages/staff/StaffDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import Alert from '../../components/common/Alert';
import { Text, Button, Card } from '../../components/ui';
import { 
  User, Briefcase, GraduationCap, DollarSign, Heart, 
  Phone, Mail, MapPin, Calendar, Shield, Edit2, Trash2, Lock,
  ArrowLeft, RefreshCw, Eye, Printer, UserCheck, UserX,
  Building2, CreditCard, Stethoscope, Users, Award, FileText,
  CheckCircle, XCircle, Clock
} from 'lucide-react';
import { getStaffById, archiveStaff, restoreStaff, updateStaffPassword } from '../../services/staffService';
import useAuth from '../../hooks/useAuth';
import { printStaffRecord } from './components/StaffPrintUtils';

const StaffDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ new_password: '', confirm_password: '' });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState({});
  const [archiveLoading, setArchiveLoading] = useState(false);
  
  const isAdmin = ['head', 'hm', 'principal', 'vice_principal', 'accountant', 'secretary'].includes(user?.role);
  
  useEffect(() => {
    if (id) loadStaff();
  }, [id]);
  
  const loadStaff = async () => {
    try {
      setLoading(true);
      const response = await getStaffById(id);
      setStaff(response.staff || response);
    } catch (err) {
      console.error('Error loading staff:', err);
      setError('Failed to load staff details');
    } finally {
      setLoading(false);
    }
  };
  
  const handleArchive = async () => {
    if (!window.confirm('Archive this staff member? They will not be able to login.')) return;
    try {
      setArchiveLoading(true);
      await archiveStaff(id);
      setSuccess('Staff archived successfully');
      loadStaff();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to archive staff');
    } finally {
      setArchiveLoading(false);
    }
  };
  
  const handleRestore = async () => {
    try {
      setArchiveLoading(true);
      await restoreStaff(id);
      setSuccess('Staff restored successfully');
      loadStaff();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to restore staff');
    } finally {
      setArchiveLoading(false);
    }
  };
  
  const handlePrint = () => {
    if (staff) printStaffRecord(staff);
  };
  
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
    if (passwordErrors[name]) setPasswordErrors(prev => ({ ...prev, [name]: '' }));
  };
  
  const submitPasswordReset = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!passwordForm.new_password) errors.new_password = 'New password is required';
    if (!passwordForm.confirm_password) errors.confirm_password = 'Please confirm password';
    if (passwordForm.new_password !== passwordForm.confirm_password) errors.confirm_password = 'Passwords do not match';
    if (passwordForm.new_password && passwordForm.new_password.length < 5) errors.new_password = 'Password must be at least 5 characters';
    setPasswordErrors(errors);
    if (Object.keys(errors).length > 0) return;
    
    try {
      setPasswordLoading(true);
      await updateStaffPassword(id, { new_password: passwordForm.new_password, confirm_password: passwordForm.confirm_password });
      setSuccess('Password reset successfully');
      setShowPasswordModal(false);
      setPasswordForm({ new_password: '', confirm_password: '' });
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setPasswordLoading(false);
    }
  };
  
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };
  
  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '₦0';
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(amount);
  };
  
  const getStatusBadge = () => {
    if (!staff?.is_active) return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700"><UserX size={12} /> Archived</span>;
    if (staff?.is_retired) return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700"><Award size={12} /> Retired</span>;
    if (staff?.is_on_leave) return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">On Leave</span>;
    return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700"><UserCheck size={12} /> Active</span>;
  };
  
  if (loading) {
    return (
      <DashboardLayout title="Staff Details">
        <div className="flex justify-center py-12"><RefreshCw className="animate-spin h-8 w-8 text-[#D94801]" /></div>
      </DashboardLayout>
    );
  }
  
  if (!staff) {
    return (
      <DashboardLayout title="Staff Details">
        <div className="text-center py-12"><Text variant="h3" className="text-gray-600">Staff not found</Text><Button variant="primary" className="mt-4" onClick={() => navigate('/staff')}>Back to Staff</Button></div>
      </DashboardLayout>
    );
  }
  
  const userData = staff.user || {};
  const fullName = `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || 'Not Available';
  
  return (
    <DashboardLayout title="Staff Details">
      <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-6 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/staff')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><ArrowLeft size={20} /></button>
            <div><div className="flex items-center gap-2 flex-wrap"><Text variant="h2" className="font-bold">{fullName}</Text>{getStatusBadge()}</div><Text variant="caption" className="text-gray-400">Staff ID: {staff.staff_id} • Reg: {userData.registration_number}</Text></div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="small" icon={Printer} onClick={handlePrint}>Print</Button>
            {isAdmin && (
              <>
                <Button variant="outline" size="small" icon={Edit2} onClick={() => navigate(`/staff/${id}/edit`)}>Edit</Button>
                <Button variant="outline" size="small" icon={Lock} onClick={() => setShowPasswordModal(true)}>Password</Button>
                {staff.is_active ? (
                  <Button variant="danger" size="small" icon={UserX} onClick={handleArchive} loading={archiveLoading}>Archive</Button>
                ) : (
                  <Button variant="success" size="small" icon={UserCheck} onClick={handleRestore} loading={archiveLoading}>Restore</Button>
                )}
              </>
            )}
          </div>
        </div>
        
        {error && <Alert type="error" message={error} onClose={() => setError('')} className="mb-4" />}
        {success && <Alert type="success" message={success} onClose={() => setSuccess('')} className="mb-4" />}
        
        <div className="bg-gradient-to-r from-[#1D2B49] to-[#24385C] rounded-2xl p-6 mb-6 text-white">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
              {staff.passport_photo ? <img src={staff.passport_photo} alt={fullName} className="w-full h-full rounded-full object-cover" /> : <User size={32} className="text-white" />}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2"><Text variant="h3" className="font-bold text-white">{fullName}</Text>{getStatusBadge()}</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm"><div><Text variant="tiny" className="text-gray-300">Staff ID</Text><Text variant="small" className="text-white font-medium">{staff.staff_id}</Text></div><div><Text variant="tiny" className="text-gray-300">Role</Text><Text variant="small" className="text-white font-medium">{userData.role?.toUpperCase() || 'Staff'}</Text></div><div><Text variant="tiny" className="text-gray-300">Department</Text><Text variant="small" className="text-white font-medium">{staff.department?.toUpperCase() || 'N/A'}</Text></div></div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-5"><div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100"><User size={18} className="text-[#D94801]" /><Text variant="h4" className="font-semibold">Personal Information</Text></div><div className="space-y-3"><div className="flex justify-between"><Text variant="tiny" className="text-gray-500">Full Name</Text><Text variant="small" className="font-medium">{fullName}</Text></div><div className="flex justify-between"><Text variant="tiny" className="text-gray-500">Email</Text><Text variant="small">{userData.email || 'Not provided'}</Text></div><div className="flex justify-between"><Text variant="tiny" className="text-gray-500">Phone</Text><Text variant="small">{userData.phone_number || 'Not provided'}</Text></div><div className="flex justify-between"><Text variant="tiny" className="text-gray-500">Gender</Text><Text variant="small">{userData.gender ? userData.gender.charAt(0).toUpperCase() + userData.gender.slice(1) : 'Not specified'}</Text></div><div className="flex justify-between"><Text variant="tiny" className="text-gray-500">Date of Birth</Text><Text variant="small">{formatDate(userData.date_of_birth)}</Text></div><div><Text variant="tiny" className="text-gray-500">Address</Text><Text variant="small">{userData.address || 'No address provided'}</Text></div></div></Card>
          
          <Card className="p-5"><div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100"><Briefcase size={18} className="text-[#D94801]" /><Text variant="h4" className="font-semibold">Employment Information</Text></div><div className="space-y-3"><div className="flex justify-between"><Text variant="tiny" className="text-gray-500">Department</Text><Text variant="small" className="font-medium">{staff.department?.toUpperCase() || 'Not assigned'}</Text></div><div className="flex justify-between"><Text variant="tiny" className="text-gray-500">Position Title</Text><Text variant="small">{staff.position_title || 'Not specified'}</Text></div><div className="flex justify-between"><Text variant="tiny" className="text-gray-500">Employment Type</Text><Text variant="small">{staff.employment_type?.toUpperCase() || 'Full-Time'}</Text></div><div className="flex justify-between"><Text variant="tiny" className="text-gray-500">Employment Date</Text><Text variant="small">{formatDate(staff.employment_date)}</Text></div><div className="flex justify-between"><Text variant="tiny" className="text-gray-500">Years of Experience</Text><Text variant="small">{staff.years_of_experience || 0} years</Text></div></div></Card>
          
          <Card className="p-5"><div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100"><GraduationCap size={18} className="text-[#D94801]" /><Text variant="h4" className="font-semibold">Qualifications</Text></div><div className="space-y-3"><div className="flex justify-between"><Text variant="tiny" className="text-gray-500">Highest Qualification</Text><Text variant="small">{staff.highest_qualification || 'Not specified'}</Text></div><div className="flex justify-between"><Text variant="tiny" className="text-gray-500">Institution</Text><Text variant="small">{staff.qualification_institution || 'Not specified'}</Text></div><div className="flex justify-between"><Text variant="tiny" className="text-gray-500">Year of Graduation</Text><Text variant="small">{staff.year_of_graduation || 'Not specified'}</Text></div><div className="flex justify-between"><Text variant="tiny" className="text-gray-500">Specialization</Text><Text variant="small">{staff.specialization || 'Not specified'}</Text></div><div className="flex justify-between"><Text variant="tiny" className="text-gray-500">TRCN Number</Text><Text variant="small">{staff.trcn_number || 'Not specified'}</Text></div></div></Card>
          
          <Card className="p-5"><div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100"><DollarSign size={18} className="text-[#D94801]" /><Text variant="h4" className="font-semibold">Salary & Bank Information</Text></div><div className="space-y-3"><div className="flex justify-between"><Text variant="tiny" className="text-gray-500">Basic Salary</Text><Text variant="small" className="font-bold text-green-600">{formatCurrency(staff.basic_salary || 0)}</Text></div><div className="flex justify-between"><Text variant="tiny" className="text-gray-500">Salary Scale</Text><Text variant="small">{staff.salary_scale || 'Not specified'}</Text></div><div className="flex justify-between"><Text variant="tiny" className="text-gray-500">Salary Step</Text><Text variant="small">{staff.salary_step || '1'}</Text></div><div className="flex justify-between"><Text variant="tiny" className="text-gray-500">Bank Name</Text><Text variant="small">{staff.bank_name || 'Not specified'}</Text></div><div className="flex justify-between"><Text variant="tiny" className="text-gray-500">Account Name</Text><Text variant="small">{staff.account_name || 'Not specified'}</Text></div><div className="flex justify-between"><Text variant="tiny" className="text-gray-500">Account Number</Text><Text variant="small">{staff.account_number || 'Not specified'}</Text></div></div></Card>
          
          <Card className="p-5"><div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100"><Heart size={18} className="text-[#D94801]" /><Text variant="h4" className="font-semibold">Health & Emergency Contact</Text></div><div className="space-y-3"><div className="flex justify-between"><Text variant="tiny" className="text-gray-500">Blood Group</Text><Text variant="small">{staff.blood_group || 'Not specified'}</Text></div><div className="flex justify-between"><Text variant="tiny" className="text-gray-500">Genotype</Text><Text variant="small">{staff.genotype || 'Not specified'}</Text></div><div><Text variant="tiny" className="text-gray-500">Medical Conditions</Text><Text variant="small">{staff.medical_conditions || 'None'}</Text></div><div><Text variant="tiny" className="text-gray-500">Allergies</Text><Text variant="small">{staff.allergies || 'None'}</Text></div><div className="pt-2 border-t border-gray-100"><Text variant="tiny" className="text-gray-500">Emergency Contact</Text><Text variant="small">{staff.emergency_contact_name || 'N/A'} ({staff.emergency_contact_relationship})<br />{staff.emergency_contact_phone}</Text></div></div></Card>
          
          <Card className="p-5"><div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100"><Users size={18} className="text-[#D94801]" /><Text variant="h4" className="font-semibold">Next of Kin</Text></div><div className="space-y-3"><div><Text variant="tiny" className="text-gray-500">Name</Text><Text variant="small">{staff.next_of_kin_name || 'Not provided'}</Text></div><div><Text variant="tiny" className="text-gray-500">Relationship</Text><Text variant="small">{staff.next_of_kin_relationship || 'Not provided'}</Text></div><div><Text variant="tiny" className="text-gray-500">Phone</Text><Text variant="small">{staff.next_of_kin_phone || 'Not provided'}</Text></div></div></Card>
        </div>
      </div>
      
      {/* Password Reset Modal */}
      {showPasswordModal && (
        <Modal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)} title="Reset Staff Password" size="md">
          <form onSubmit={submitPasswordReset} className="py-4 space-y-4">
            <div className="text-center"><div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3"><Lock size={20} className="text-blue-600" /></div><Text variant="h4" className="font-semibold">Reset Password for {fullName}</Text><Text variant="tiny" className="text-gray-500 mt-1">Only administrators can reset passwords</Text></div>
            <div><label className="block text-[10px] font-medium text-gray-500 mb-1">New Password *</label><input type="password" name="new_password" value={passwordForm.new_password} onChange={handlePasswordChange} className={`w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801] ${passwordErrors.new_password ? 'border-red-500' : 'border-gray-200'}`} placeholder="Minimum 5 characters" />{passwordErrors.new_password && <Text variant="tiny" className="text-red-500 mt-1">{passwordErrors.new_password}</Text>}</div>
            <div><label className="block text-[10px] font-medium text-gray-500 mb-1">Confirm Password *</label><input type="password" name="confirm_password" value={passwordForm.confirm_password} onChange={handlePasswordChange} className={`w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801] ${passwordErrors.confirm_password ? 'border-red-500' : 'border-gray-200'}`} placeholder="Confirm new password" />{passwordErrors.confirm_password && <Text variant="tiny" className="text-red-500 mt-1">{passwordErrors.confirm_password}</Text>}</div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3"><Text variant="tiny" className="text-yellow-800"><strong>Note:</strong> Password must be at least 5 characters long.</Text></div>
            <div className="flex gap-3 pt-2"><Button variant="outline" onClick={() => setShowPasswordModal(false)} className="flex-1">Cancel</Button><Button variant="primary" type="submit" disabled={passwordLoading} className="flex-1">{passwordLoading ? <RefreshCw size={14} className="animate-spin" /> : <Lock size={14} />}Reset Password</Button></div>
          </form>
        </Modal>
      )}
    </DashboardLayout>
  );
};

export default StaffDetail;