// src/pages/staff/StaffCreate.jsx - FIXED VERSION

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import Alert from '../../components/common/Alert';
import { Text, Button, Card } from '../../components/ui';
import { 
  User, Briefcase, GraduationCap, DollarSign, Heart, 
  Phone, Mail, MapPin, Calendar, Shield, Save, ArrowLeft,
  CheckCircle, ChevronLeft, ChevronRight, Upload, X,
  Building2, CreditCard, Stethoscope, Users, Award, FileText
} from 'lucide-react';
import { createStaff } from '../../services/staffService';
import { createUser } from '../../services/userService';
import useAuth from '../../hooks/useAuth';

const StaffCreate = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = ['head', 'hm', 'principal', 'vice_principal', 'accountant', 'secretary'].includes(user?.role);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [createdUserId, setCreatedUserId] = useState(null);
  const [createdStaffId, setCreatedStaffId] = useState(null);
  
  const [formData, setFormData] = useState({
    // Step 1: Basic Information
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
    
    // Step 2: Employment Information
    department: '',
    position_title: '',
    employment_type: 'full_time',
    employment_date: new Date().toISOString().split('T')[0],
    years_of_experience: 0,
    
    // Step 3: Qualifications
    highest_qualification: '',
    qualification_institution: '',
    year_of_graduation: '',
    specialization: '',
    trcn_number: '',
    
    // Step 4: Salary & Bank
    basic_salary: '',
    salary_scale: '',
    salary_step: 1,
    bank_name: '',
    account_name: '',
    account_number: '',
    annual_leave_days: 21,
    sick_leave_days: 10,
    
    // Step 5: Health & Emergency
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
    
    // Step 6: Documents & Status
    role: 'teacher',
    is_active: true,
    password: 'Staff@2024',
    confirm_password: 'Staff@2024',
  });
  
  const [files, setFiles] = useState({
    passport_photo: null,
    resume: null,
    certificates: null,
    id_copy: null,
  });
  
  const [fileNames, setFileNames] = useState({
    passport_photo: '',
    resume: '',
    certificates: '',
    id_copy: '',
  });
  
  const totalSteps = 6;
  const stepTitles = ['Basic Info', 'Employment', 'Qualifications', 'Salary & Bank', 'Health & Contacts', 'Documents & Review'];
  
  const roleOptions = [
    { value: 'head', label: 'Head of School' },
    { value: 'hm', label: 'Head Master' },
    { value: 'principal', label: 'Principal' },
    { value: 'vice_principal', label: 'Vice Principal' },
    { value: 'teacher', label: 'Teacher' },
    { value: 'form_teacher', label: 'Form Teacher' },
    { value: 'subject_teacher', label: 'Subject Teacher' },
    { value: 'accountant', label: 'Accountant' },
    { value: 'secretary', label: 'Secretary' },
    { value: 'librarian', label: 'Librarian' },
    { value: 'laboratory', label: 'Lab Technician' },
  ];
  
  const departmentOptions = [
    { value: 'administration', label: 'Administration' },
    { value: 'academic', label: 'Academic' },
    { value: 'finance', label: 'Finance' },
    { value: 'library', label: 'Library' },
    { value: 'laboratory', label: 'Laboratory' },
    { value: 'ict', label: 'ICT' },
    { value: 'security', label: 'Security' },
    { value: 'maintenance', label: 'Maintenance' },
  ];
  
  const handleChange = (e) => {
    const { name, value, type, checked, files: fileList } = e.target;
    
    if (type === 'file') {
      const file = fileList[0];
      if (file) {
        setFiles(prev => ({ ...prev, [name]: file }));
        setFileNames(prev => ({ ...prev, [name]: file.name }));
      }
    } else if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const validateStep = () => {
    const errors = [];
    
    switch(currentStep) {
      case 1:
        if (!formData.first_name) errors.push('First name is required');
        if (!formData.last_name) errors.push('Last name is required');
        if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
          errors.push('Invalid email format');
        }
        if (formData.password !== formData.confirm_password) errors.push('Passwords do not match');
        if (formData.password && formData.password.length < 5) errors.push('Password must be at least 5 characters');
        break;
      case 2:
        if (!formData.department) errors.push('Department is required');
        if (!formData.position_title) errors.push('Position title is required');
        break;
      case 3:
        // Optional fields
        break;
      case 4:
        // Optional fields
        break;
      case 5:
        // Optional fields
        break;
      case 6:
        if (!formData.role) errors.push('Staff role is required');
        break;
      default:
        break;
    }
    
    if (errors.length > 0) {
      setError(errors.join('. '));
      return false;
    }
    setError('');
    return true;
  };
  
  const handleNext = () => {
    if (validateStep()) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
        window.scrollTo(0, 0);
      }
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
    
    if (!validateStep()) return;
    
    try {
      setLoading(true);
      setError('');
      
      // Step 1: Create User Account
      const userData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email || null,
        phone_number: formData.phone_number || null,
        password: formData.password,
        confirm_password: formData.confirm_password,
        role: formData.role,
        gender: formData.gender,
        date_of_birth: formData.date_of_birth || null,
        address: formData.address || '',
        city: formData.city || '',
        state_of_origin: formData.state_of_origin || '',
        lga: formData.lga || '',
        nationality: formData.nationality || 'Nigerian',
      };
      
      // Remove empty values
      Object.keys(userData).forEach(key => {
        if (userData[key] === '' || userData[key] === null) {
          delete userData[key];
        }
      });
      
      console.log('📝 Creating user with data:', userData);
      
      let userResponse;
      try {
        userResponse = await createUser(userData);
      } catch (userErr) {
        console.error('User creation error:', userErr);
        
        // Check if user already exists - try to find by email
        if (formData.email) {
          // Try to check if user exists with this email
          const errorMsg = userErr.message || '';
          if (errorMsg.includes('already registered') || errorMsg.includes('already exists')) {
            setError(`User with email ${formData.email} already exists. Please use a different email or contact support.`);
            return;
          }
        }
        throw userErr;
      }
      
      const userId = userResponse.user?.id || userResponse.id;
      
      if (!userId) {
        throw new Error('User created but no ID returned');
      }
      
      setCreatedUserId(userId);
      
      // Step 2: Create Staff Profile
      const staffData = {
        user_id: userId,
        department: formData.department,
        position_title: formData.position_title,
        employment_type: formData.employment_type,
        employment_date: formData.employment_date,
        years_of_experience: parseInt(formData.years_of_experience) || 0,
        highest_qualification: formData.highest_qualification,
        qualification_institution: formData.qualification_institution,
        year_of_graduation: formData.year_of_graduation || null,
        specialization: formData.specialization,
        trcn_number: formData.trcn_number,
        basic_salary: parseFloat(formData.basic_salary) || 0,
        salary_scale: formData.salary_scale,
        salary_step: parseInt(formData.salary_step) || 1,
        bank_name: formData.bank_name,
        account_name: formData.account_name,
        account_number: formData.account_number,
        annual_leave_days: parseInt(formData.annual_leave_days) || 21,
        sick_leave_days: parseInt(formData.sick_leave_days) || 10,
        blood_group: formData.blood_group,
        genotype: formData.genotype,
        medical_conditions: formData.medical_conditions,
        allergies: formData.allergies,
        emergency_contact_name: formData.emergency_contact_name,
        emergency_contact_phone: formData.emergency_contact_phone,
        emergency_contact_relationship: formData.emergency_contact_relationship,
        next_of_kin_name: formData.next_of_kin_name,
        next_of_kin_relationship: formData.next_of_kin_relationship,
        next_of_kin_phone: formData.next_of_kin_phone,
        is_active: formData.is_active,
      };
      
      // Remove empty values
      Object.keys(staffData).forEach(key => {
        if (staffData[key] === '' || staffData[key] === null) {
          delete staffData[key];
        }
      });
      
      // Add files if present
      if (files.passport_photo) staffData.passport_photo = files.passport_photo;
      if (files.resume) staffData.resume = files.resume;
      if (files.certificates) staffData.certificates = files.certificates;
      if (files.id_copy) staffData.id_copy = files.id_copy;
      
      console.log('📝 Creating staff with data:', staffData);
      
      let staffResponse;
      try {
        staffResponse = await createStaff(staffData);
      } catch (staffErr) {
        console.error('Staff creation error:', staffErr);
        const errorMsg = staffErr.message || '';
        if (errorMsg.includes('already has a staff profile')) {
          setError('This user already has a staff profile. Please check if this person is already a staff member.');
          return;
        }
        throw staffErr;
      }
      
      const staffId = staffResponse.staff?.id || staffResponse.id;
      
      setCreatedStaffId(staffId);
      
      setSuccess('Staff created successfully!');
      setTimeout(() => {
        navigate(`/staff/${staffId}`);
      }, 2000);
      
    } catch (err) {
      console.error('Error creating staff:', err);
      setError(err.message || 'Failed to create staff. Please try again.');
    } finally {
      setLoading(false);
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
        <div><label className="block text-[10px] font-medium text-gray-500 mb-1">Password</label><input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm" placeholder="Minimum 5 characters" /></div>
        <div><label className="block text-[10px] font-medium text-gray-500 mb-1">Confirm Password</label><input type="password" name="confirm_password" value={formData.confirm_password} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm" /></div>
      </div>
    </div>
  );
  
  const renderStep2 = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><label className="block text-[10px] font-medium text-gray-500 mb-1">Department *</label><select name="department" value={formData.department} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm" required><option value="">Select Department</option>{departmentOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}</select></div>
        <div><label className="block text-[10px] font-medium text-gray-500 mb-1">Position Title *</label><input type="text" name="position_title" value={formData.position_title} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm" required /></div>
        <div><label className="block text-[10px] font-medium text-gray-500 mb-1">Employment Type</label><select name="employment_type" value={formData.employment_type} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm"><option value="full_time">Full-Time</option><option value="part_time">Part-Time</option><option value="contract">Contract</option></select></div>
        <div><label className="block text-[10px] font-medium text-gray-500 mb-1">Employment Date</label><input type="date" name="employment_date" value={formData.employment_date} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm" /></div>
        <div><label className="block text-[10px] font-medium text-gray-500 mb-1">Years of Experience</label><input type="number" name="years_of_experience" value={formData.years_of_experience} onChange={handleChange} min="0" className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm" /></div>
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
  
  const renderStep6 = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><label className="block text-[10px] font-medium text-gray-500 mb-1">Staff Role *</label><select name="role" value={formData.role} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm" required><option value="">Select Role</option>{roleOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}</select></div>
        <div><label className="flex items-center gap-2 mt-6"><input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} className="w-3 h-3 rounded" /><span className="text-xs text-gray-600">Staff is Active</span></label></div>
      </div>
      
      <div className="border-t border-gray-100 pt-4 mt-2">
        <Text variant="caption" className="font-semibold text-gray-700 mb-3 block">Documents (Optional)</Text>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-3 text-center hover:border-[#D94801] transition-colors">
            <Upload size={20} className="mx-auto text-gray-400 mb-1" />
            <Text variant="tiny" className="text-gray-500">Passport Photo</Text>
            <input type="file" name="passport_photo" onChange={handleChange} accept="image/*" className="hidden" id="passport_photo" />
            <label htmlFor="passport_photo" className="cursor-pointer text-[10px] text-[#D94801] hover:underline">Click to upload</label>
            {fileNames.passport_photo && <Text variant="tiny" className="text-green-600 mt-1">{fileNames.passport_photo}</Text>}
          </div>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-3 text-center hover:border-[#D94801] transition-colors">
            <Upload size={20} className="mx-auto text-gray-400 mb-1" />
            <Text variant="tiny" className="text-gray-500">Resume/CV</Text>
            <input type="file" name="resume" onChange={handleChange} accept=".pdf,.doc,.docx" className="hidden" id="resume" />
            <label htmlFor="resume" className="cursor-pointer text-[10px] text-[#D94801] hover:underline">Click to upload</label>
            {fileNames.resume && <Text variant="tiny" className="text-green-600 mt-1">{fileNames.resume}</Text>}
          </div>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-3 text-center hover:border-[#D94801] transition-colors">
            <Upload size={20} className="mx-auto text-gray-400 mb-1" />
            <Text variant="tiny" className="text-gray-500">Certificates</Text>
            <input type="file" name="certificates" onChange={handleChange} accept=".pdf,.jpg,.jpeg,.png" className="hidden" id="certificates" />
            <label htmlFor="certificates" className="cursor-pointer text-[10px] text-[#D94801] hover:underline">Click to upload</label>
            {fileNames.certificates && <Text variant="tiny" className="text-green-600 mt-1">{fileNames.certificates}</Text>}
          </div>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-3 text-center hover:border-[#D94801] transition-colors">
            <Upload size={20} className="mx-auto text-gray-400 mb-1" />
            <Text variant="tiny" className="text-gray-500">ID Copy</Text>
            <input type="file" name="id_copy" onChange={handleChange} accept=".pdf,.jpg,.jpeg,.png" className="hidden" id="id_copy" />
            <label htmlFor="id_copy" className="cursor-pointer text-[10px] text-[#D94801] hover:underline">Click to upload</label>
            {fileNames.id_copy && <Text variant="tiny" className="text-green-600 mt-1">{fileNames.id_copy}</Text>}
          </div>
        </div>
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-4">
        <div className="flex items-start gap-2">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center"><span className="text-blue-600 font-bold">✓</span></div>
          <div><Text variant="tiny" className="font-semibold text-blue-800">Ready to Create Staff</Text><Text variant="tiny" className="text-blue-700">Review all information before submitting. You can edit later.</Text></div>
        </div>
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
      case 6: return renderStep6();
      default: return null;
    }
  };
  
  if (!isAdmin) {
    return (
      <DashboardLayout title="Access Denied">
        <div className="flex items-center justify-center min-h-[60vh] px-4">
          <div className="text-center"><div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"><Shield className="text-red-500" size={28} /></div><Text variant="h3" className="font-bold text-gray-800 mb-2">Access Denied</Text><Text variant="body" className="text-gray-500">You don't have permission to create staff members.</Text></div>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout title="Add New Staff">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-6">
        <div className="flex items-center gap-3 mb-6">
          <Link to="/staff" className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><ArrowLeft size={20} /></Link>
          <div><Text variant="h2" className="font-bold">Add New Staff Member</Text><Text variant="caption" className="text-gray-400">Complete all steps to create a new staff member</Text></div>
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
              {currentStep < totalSteps ? <Button type="button" variant="primary" onClick={handleNext} icon={ChevronRight} iconPosition="right">Next</Button> : <Button type="submit" variant="primary" loading={loading} icon={Save}>Create Staff</Button>}
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StaffCreate;