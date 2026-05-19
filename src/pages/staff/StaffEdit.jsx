// src/pages/staff/StaffEdit.jsx - FIXED VERSION

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import Alert from '../../components/common/Alert';
import { Text, Button, Card } from '../../components/ui';
import { 
  User, Briefcase, GraduationCap, DollarSign, Heart, 
  Phone, Mail, MapPin, Calendar, Shield, Save, ArrowLeft,
  RefreshCw, ChevronLeft, ChevronRight, CheckCircle, X
} from 'lucide-react';
import { getStaffById, updateStaff } from '../../services/staffService';
import useAuth from '../../hooks/useAuth';

const StaffEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [staff, setStaff] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  
  const isAdmin = ['head', 'hm', 'principal', 'vice_principal', 'accountant', 'secretary'].includes(user?.role);
  
  // Form state - ALL FIELDS with default values to prevent NULL errors
  const [formData, setFormData] = useState({
    // Personal Info
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    gender: '',
    date_of_birth: '',
    address: '',
    city: '',
    state_of_origin: '',
    lga: '',
    nationality: 'Nigerian',
    
    // Employment Info - REQUIRED FIELDS
    staff_id: '',
    department: '',
    position_title: '',  // REQUIRED - NOT NULL
    employment_type: 'full_time',
    employment_date: '',
    years_of_experience: 0,
    
    // Qualifications
    highest_qualification: '',
    qualification_institution: '',
    year_of_graduation: '',
    specialization: '',
    trcn_number: '',
    
    // Salary
    basic_salary: '0',
    salary_scale: '',
    salary_step: 1,
    bank_name: '',
    account_name: '',
    account_number: '',
    
    // Health
    blood_group: '',
    genotype: '',
    medical_conditions: '',
    allergies: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    emergency_contact_relationship: '',
    next_of_kin_name: '',
    next_of_kin_relationship: '',
    next_of_kin_phone: '',
    
    // Status
    is_active: true,
    is_on_leave: false,
    is_retired: false,
    annual_leave_days: 21,
    sick_leave_days: 10,
  });
  
  const departmentOptions = [
    { value: 'administration', label: 'Administration' },
    { value: 'academic', label: 'Academic' },
    { value: 'finance', label: 'Finance' },
    { value: 'library', label: 'Library' },
    { value: 'laboratory', label: 'Laboratory' },
    { value: 'ict', label: 'ICT' },
    { value: 'security', label: 'Security' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'transport', label: 'Transport' },
    { value: 'health', label: 'Health' },
    { value: 'counseling', label: 'Counseling' },
    { value: 'sports', label: 'Sports' },
    { value: 'kitchen', label: 'Kitchen' },
  ];
  
  const employmentTypeOptions = [
    { value: 'full_time', label: 'Full-Time' },
    { value: 'part_time', label: 'Part-Time' },
    { value: 'contract', label: 'Contract' },
  ];
  
  const totalSteps = 5;
  const stepTitles = ['Personal Info', 'Employment', 'Qualifications', 'Salary & Bank', 'Health & Status'];
  
  useEffect(() => {
    if (isAdmin && id) {
      loadStaff();
    } else if (!isAdmin) {
      navigate('/dashboard');
    }
  }, [id, isAdmin]);
  
  const loadStaff = async () => {
    try {
      setLoading(true);
      const response = await getStaffById(id);
      const staffData = response.staff || response;
      setStaff(staffData);
      
      const userData = staffData.user || {};
      
      setFormData({
        // Personal Info
        first_name: userData.first_name || '',
        last_name: userData.last_name || '',
        email: userData.email || '',
        phone_number: userData.phone_number || '',
        gender: userData.gender || '',
        date_of_birth: userData.date_of_birth || '',
        address: userData.address || '',
        city: userData.city || '',
        state_of_origin: userData.state_of_origin || '',
        lga: userData.lga || '',
        nationality: userData.nationality || 'Nigerian',
        
        // Employment Info - ENSURE position_title has a value
        staff_id: staffData.staff_id || '',
        department: staffData.department || '',
        position_title: staffData.position_title || 'Staff Member',  // Default value to prevent NULL
        employment_type: staffData.employment_type || 'full_time',
        employment_date: staffData.employment_date || '',
        years_of_experience: staffData.years_of_experience || 0,
        
        // Qualifications
        highest_qualification: staffData.highest_qualification || '',
        qualification_institution: staffData.qualification_institution || '',
        year_of_graduation: staffData.year_of_graduation || '',
        specialization: staffData.specialization || '',
        trcn_number: staffData.trcn_number || '',
        
        // Salary
        basic_salary: staffData.basic_salary || '0',
        salary_scale: staffData.salary_scale || '',
        salary_step: staffData.salary_step || 1,
        bank_name: staffData.bank_name || '',
        account_name: staffData.account_name || '',
        account_number: staffData.account_number || '',
        
        // Health
        blood_group: staffData.blood_group || '',
        genotype: staffData.genotype || '',
        medical_conditions: staffData.medical_conditions || '',
        allergies: staffData.allergies || '',
        emergency_contact_name: staffData.emergency_contact_name || '',
        emergency_contact_phone: staffData.emergency_contact_phone || '',
        emergency_contact_relationship: staffData.emergency_contact_relationship || '',
        next_of_kin_name: staffData.next_of_kin_name || '',
        next_of_kin_relationship: staffData.next_of_kin_relationship || '',
        next_of_kin_phone: staffData.next_of_kin_phone || '',
        
        // Status
        is_active: staffData.is_active !== undefined ? staffData.is_active : true,
        is_on_leave: staffData.is_on_leave || false,
        is_retired: staffData.is_retired || false,
        annual_leave_days: staffData.annual_leave_days || 21,
        sick_leave_days: staffData.sick_leave_days || 10,
      });
    } catch (err) {
      console.error('Error loading staff:', err);
      setError('Failed to load staff data');
    } finally {
      setLoading(false);
    }
  };
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.position_title) {
      setError('Position title is required');
      setCurrentStep(2);
      return;
    }
    
    if (!formData.department) {
      setError('Department is required');
      setCurrentStep(2);
      return;
    }
    
    try {
      setSaving(true);
      setError('');
      
      // Prepare update data - ensure position_title is always sent
      const updateData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email || null,
        phone_number: formData.phone_number || null,
        gender: formData.gender || null,
        date_of_birth: formData.date_of_birth || null,
        address: formData.address || null,
        city: formData.city || null,
        state_of_origin: formData.state_of_origin || null,
        lga: formData.lga || null,
        nationality: formData.nationality || 'Nigerian',
        
        // CRITICAL: position_title is NOT NULL in database
        position_title: formData.position_title || 'Staff Member',
        department: formData.department,
        employment_type: formData.employment_type,
        employment_date: formData.employment_date || null,
        years_of_experience: parseInt(formData.years_of_experience) || 0,
        
        highest_qualification: formData.highest_qualification || null,
        qualification_institution: formData.qualification_institution || null,
        year_of_graduation: formData.year_of_graduation || null,
        specialization: formData.specialization || null,
        trcn_number: formData.trcn_number || null,
        
        basic_salary: parseFloat(formData.basic_salary) || 0,
        salary_scale: formData.salary_scale || null,
        salary_step: parseInt(formData.salary_step) || 1,
        bank_name: formData.bank_name || null,
        account_name: formData.account_name || null,
        account_number: formData.account_number || null,
        
        blood_group: formData.blood_group || null,
        genotype: formData.genotype || null,
        medical_conditions: formData.medical_conditions || null,
        allergies: formData.allergies || null,
        emergency_contact_name: formData.emergency_contact_name || null,
        emergency_contact_phone: formData.emergency_contact_phone || null,
        emergency_contact_relationship: formData.emergency_contact_relationship || null,
        next_of_kin_name: formData.next_of_kin_name || null,
        next_of_kin_relationship: formData.next_of_kin_relationship || null,
        next_of_kin_phone: formData.next_of_kin_phone || null,
        
        is_active: formData.is_active,
        is_on_leave: formData.is_on_leave,
        is_retired: formData.is_retired,
        annual_leave_days: parseInt(formData.annual_leave_days) || 21,
        sick_leave_days: parseInt(formData.sick_leave_days) || 10,
      };
      
      console.log('📝 Updating staff with data:', updateData);
      
      await updateStaff(id, updateData);
      
      setSuccess('Staff updated successfully!');
      setTimeout(() => {
        navigate(`/staff/${id}`);
      }, 2000);
      
    } catch (err) {
      console.error('Error updating staff:', err);
      const errorMsg = err.message || err.response?.data?.detail || err.response?.data?.message || 'Failed to update staff';
      setError(errorMsg);
    } finally {
      setSaving(false);
    }
  };
  
  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><label className="block text-[10px] font-medium text-gray-500 mb-1">First Name *</label><input type="text" name="first_name" value={formData.first_name} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]" required /></div>
        <div><label className="block text-[10px] font-medium text-gray-500 mb-1">Last Name *</label><input type="text" name="last_name" value={formData.last_name} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]" required /></div>
        <div><label className="block text-[10px] font-medium text-gray-500 mb-1">Email</label><input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm" /></div>
        <div><label className="block text-[10px] font-medium text-gray-500 mb-1">Phone</label><input type="tel" name="phone_number" value={formData.phone_number} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm" /></div>
        <div><label className="block text-[10px] font-medium text-gray-500 mb-1">Gender</label><select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm"><option value="">Select</option><option value="male">Male</option><option value="female">Female</option></select></div>
        <div><label className="block text-[10px] font-medium text-gray-500 mb-1">Date of Birth</label><input type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm" /></div>
        <div className="md:col-span-2"><label className="block text-[10px] font-medium text-gray-500 mb-1">Address</label><textarea name="address" value={formData.address} onChange={handleChange} rows={2} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm" /></div>
        <div><label className="block text-[10px] font-medium text-gray-500 mb-1">City</label><input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm" /></div>
        <div><label className="block text-[10px] font-medium text-gray-500 mb-1">State of Origin</label><input type="text" name="state_of_origin" value={formData.state_of_origin} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm" /></div>
        <div><label className="block text-[10px] font-medium text-gray-500 mb-1">LGA</label><input type="text" name="lga" value={formData.lga} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm" /></div>
        <div><label className="block text-[10px] font-medium text-gray-500 mb-1">Nationality</label><input type="text" name="nationality" value={formData.nationality} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm" /></div>
      </div>
    </div>
  );
  
  const renderStep2 = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><label className="block text-[10px] font-medium text-gray-500 mb-1">Department *</label><select name="department" value={formData.department} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm" required><option value="">Select Department</option>{departmentOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}</select></div>
        <div><label className="block text-[10px] font-medium text-gray-500 mb-1">Position Title *</label><input type="text" name="position_title" value={formData.position_title} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]" required placeholder="e.g., Mathematics Teacher, Accountant" /></div>
        <div><label className="block text-[10px] font-medium text-gray-500 mb-1">Employment Type</label><select name="employment_type" value={formData.employment_type} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm">{employmentTypeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}</select></div>
        <div><label className="block text-[10px] font-medium text-gray-500 mb-1">Employment Date</label><input type="date" name="employment_date" value={formData.employment_date} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm" /></div>
        <div><label className="block text-[10px] font-medium text-gray-500 mb-1">Years of Experience</label><input type="number" name="years_of_experience" value={formData.years_of_experience} onChange={handleChange} min="0" className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm" /></div>
      </div>
      <div className="flex flex-wrap gap-4 pt-2">
        <label className="flex items-center gap-2"><input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} className="w-3 h-3 rounded" /><span className="text-xs text-gray-600">Active</span></label>
        <label className="flex items-center gap-2"><input type="checkbox" name="is_on_leave" checked={formData.is_on_leave} onChange={handleChange} className="w-3 h-3 rounded" /><span className="text-xs text-gray-600">On Leave</span></label>
        <label className="flex items-center gap-2"><input type="checkbox" name="is_retired" checked={formData.is_retired} onChange={handleChange} className="w-3 h-3 rounded" /><span className="text-xs text-gray-600">Retired</span></label>
      </div>
    </div>
  );
  
  const renderStep3 = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><label className="block text-[10px] font-medium text-gray-500 mb-1">Highest Qualification</label><input type="text" name="highest_qualification" value={formData.highest_qualification} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm" /></div>
        <div><label className="block text-[10px] font-medium text-gray-500 mb-1">Institution</label><input type="text" name="qualification_institution" value={formData.qualification_institution} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm" /></div>
        <div><label className="block text-[10px] font-medium text-gray-500 mb-1">Year of Graduation</label><input type="number" name="year_of_graduation" value={formData.year_of_graduation} onChange={handleChange} min="1950" max={new Date().getFullYear()} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm" /></div>
        <div><label className="block text-[10px] font-medium text-gray-500 mb-1">Specialization</label><input type="text" name="specialization" value={formData.specialization} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm" /></div>
        <div><label className="block text-[10px] font-medium text-gray-500 mb-1">TRCN Number</label><input type="text" name="trcn_number" value={formData.trcn_number} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm" /></div>
      </div>
    </div>
  );
  
  const renderStep4 = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><label className="block text-[10px] font-medium text-gray-500 mb-1">Basic Salary (₦)</label><input type="number" name="basic_salary" value={formData.basic_salary} onChange={handleChange} min="0" step="0.01" className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm" /></div>
        <div><label className="block text-[10px] font-medium text-gray-500 mb-1">Salary Scale</label><input type="text" name="salary_scale" value={formData.salary_scale} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm" /></div>
        <div><label className="block text-[10px] font-medium text-gray-500 mb-1">Salary Step</label><input type="number" name="salary_step" value={formData.salary_step} onChange={handleChange} min="1" className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm" /></div>
        <div><label className="block text-[10px] font-medium text-gray-500 mb-1">Bank Name</label><input type="text" name="bank_name" value={formData.bank_name} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm" /></div>
        <div><label className="block text-[10px] font-medium text-gray-500 mb-1">Account Name</label><input type="text" name="account_name" value={formData.account_name} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm" /></div>
        <div><label className="block text-[10px] font-medium text-gray-500 mb-1">Account Number</label><input type="text" name="account_number" value={formData.account_number} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm" /></div>
        <div><label className="block text-[10px] font-medium text-gray-500 mb-1">Annual Leave Days</label><input type="number" name="annual_leave_days" value={formData.annual_leave_days} onChange={handleChange} min="0" className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm" /></div>
        <div><label className="block text-[10px] font-medium text-gray-500 mb-1">Sick Leave Days</label><input type="number" name="sick_leave_days" value={formData.sick_leave_days} onChange={handleChange} min="0" className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm" /></div>
      </div>
    </div>
  );
  
  const renderStep5 = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><label className="block text-[10px] font-medium text-gray-500 mb-1">Blood Group</label><select name="blood_group" value={formData.blood_group} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm"><option value="">Select</option><option value="A+">A+</option><option value="A-">A-</option><option value="B+">B+</option><option value="B-">B-</option><option value="O+">O+</option><option value="O-">O-</option><option value="AB+">AB+</option><option value="AB-">AB-</option></select></div>
        <div><label className="block text-[10px] font-medium text-gray-500 mb-1">Genotype</label><select name="genotype" value={formData.genotype} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm"><option value="">Select</option><option value="AA">AA</option><option value="AS">AS</option><option value="SS">SS</option><option value="AC">AC</option></select></div>
        <div className="md:col-span-2"><label className="block text-[10px] font-medium text-gray-500 mb-1">Medical Conditions</label><textarea name="medical_conditions" value={formData.medical_conditions} onChange={handleChange} rows={2} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm" /></div>
        <div className="md:col-span-2"><label className="block text-[10px] font-medium text-gray-500 mb-1">Allergies</label><textarea name="allergies" value={formData.allergies} onChange={handleChange} rows={2} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm" /></div>
        <div><label className="block text-[10px] font-medium text-gray-500 mb-1">Emergency Contact Name</label><input type="text" name="emergency_contact_name" value={formData.emergency_contact_name} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm" /></div>
        <div><label className="block text-[10px] font-medium text-gray-500 mb-1">Emergency Contact Phone</label><input type="tel" name="emergency_contact_phone" value={formData.emergency_contact_phone} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm" /></div>
        <div><label className="block text-[10px] font-medium text-gray-500 mb-1">Emergency Contact Relationship</label><input type="text" name="emergency_contact_relationship" value={formData.emergency_contact_relationship} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm" /></div>
        <div><label className="block text-[10px] font-medium text-gray-500 mb-1">Next of Kin Name</label><input type="text" name="next_of_kin_name" value={formData.next_of_kin_name} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm" /></div>
        <div><label className="block text-[10px] font-medium text-gray-500 mb-1">Next of Kin Relationship</label><input type="text" name="next_of_kin_relationship" value={formData.next_of_kin_relationship} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm" /></div>
        <div><label className="block text-[10px] font-medium text-gray-500 mb-1">Next of Kin Phone</label><input type="tel" name="next_of_kin_phone" value={formData.next_of_kin_phone} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm" /></div>
      </div>
    </div>
  );
  
  const renderStepContent = () => {
    switch(currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      case 5: return renderStep5();
      default: return null;
    }
  };
  
  if (!isAdmin) return null;
  
  if (loading) {
    return (
      <DashboardLayout title="Edit Staff">
        <div className="flex justify-center py-12"><RefreshCw className="animate-spin h-8 w-8 text-[#D94801]" /></div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout title="Edit Staff">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-6">
        <div className="flex items-center gap-3 mb-6">
          <Link to={`/staff/${id}`} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><ArrowLeft size={20} /></Link>
          <div><Text variant="h2" className="font-bold">Edit Staff</Text><Text variant="caption" className="text-gray-400">Update staff information</Text></div>
        </div>
        
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {stepTitles.map((title, index) => (
              <React.Fragment key={index}>
                <button type="button" onClick={() => setCurrentStep(index + 1)} className={`flex flex-col items-center ${currentStep >= index + 1 ? 'text-[#D94801]' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${currentStep > index + 1 ? 'bg-green-500 text-white' : currentStep === index + 1 ? 'bg-[#D94801] text-white ring-4 ring-[#D94801]/20' : 'bg-gray-200 text-gray-500'}`}>{currentStep > index + 1 ? <CheckCircle size={16} /> : index + 1}</div>
                  <span className="text-[9px] mt-1 hidden sm:block">{title}</span>
                </button>
                {index < stepTitles.length - 1 && <div className={`flex-1 h-0.5 mx-2 ${currentStep > index + 1 ? 'bg-green-500' : 'bg-gray-200'}`} />}
              </React.Fragment>
            ))}
          </div>
        </div>
        
        {error && <Alert type="error" message={error} onClose={() => setError('')} className="mb-4" />}
        {success && <Alert type="success" message={success} onClose={() => setSuccess('')} className="mb-4" />}
        
        <Card className="p-4 sm:p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-6 pb-3 border-b border-gray-100"><Text variant="h3" className="font-semibold">Step {currentStep}: {stepTitles[currentStep - 1]}</Text></div>
            {renderStepContent()}
            <div className="flex justify-between gap-3 mt-8 pt-4 border-t border-gray-100">
              <Button type="button" variant="outline" onClick={handlePrevious} disabled={currentStep === 1} icon={ChevronLeft}>Previous</Button>
              {currentStep < totalSteps ? <Button type="button" variant="primary" onClick={handleNext} icon={ChevronRight} iconPosition="right">Next</Button> : <Button type="submit" variant="primary" loading={saving} icon={Save}>Update Staff</Button>}
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StaffEdit;