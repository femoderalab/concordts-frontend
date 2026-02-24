import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import useAuth from '../../hooks/useAuth';
import staffService from '../../services/staffService';
import userService from '../../services/userService';

// Icons
import {
  ArrowLeft,
  UserPlus,
  CheckCircle,
  User,
  Briefcase,
  GraduationCap,
  DollarSign,
  Home,
  Phone,
  Mail,
  Shield,
  Heart,
  FileText,
  ChevronRight,
  ChevronLeft,
  Upload,
  Building,
  Award,
  Stethoscope,
  Banknote
} from 'lucide-react';

// Utility functions
const getNigerianStates = () => [
  { value: '', label: 'Select State' },
  { value: 'abia', label: 'Abia' },
  { value: 'adamawa', label: 'Adamawa' },
  { value: 'akwa_ibom', label: 'Akwa Ibom' },
  { value: 'anambra', label: 'Anambra' },
  { value: 'bauchi', label: 'Bauchi' },
  { value: 'bayelsa', label: 'Bayelsa' },
  { value: 'benue', label: 'Benue' },
  { value: 'borno', label: 'Borno' },
  { value: 'cross_river', label: 'Cross River' },
  { value: 'delta', label: 'Delta' },
  { value: 'ebonyi', label: 'Ebonyi' },
  { value: 'edo', label: 'Edo' },
  { value: 'ekiti', label: 'Ekiti' },
  { value: 'enugu', label: 'Enugu' },
  { value: 'gombe', label: 'Gombe' },
  { value: 'imo', label: 'Imo' },
  { value: 'jigawa', label: 'Jigawa' },
  { value: 'kaduna', label: 'Kaduna' },
  { value: 'kano', label: 'Kano' },
  { value: 'katsina', label: 'Katsina' },
  { value: 'kebbi', label: 'Kebbi' },
  { value: 'kogi', label: 'Kogi' },
  { value: 'kwara', label: 'Kwara' },
  { value: 'lagos', label: 'Lagos' },
  { value: 'nasarawa', label: 'Nasarawa' },
  { value: 'niger', label: 'Niger' },
  { value: 'ogun', label: 'Ogun' },
  { value: 'ondo', label: 'Ondo' },
  { value: 'osun', label: 'Osun' },
  { value: 'oyo', label: 'Oyo' },
  { value: 'plateau', label: 'Plateau' },
  { value: 'rivers', label: 'Rivers' },
  { value: 'sokoto', label: 'Sokoto' },
  { value: 'taraba', label: 'Taraba' },
  { value: 'yobe', label: 'Yobe' },
  { value: 'zamfara', label: 'Zamfara' },
  { value: 'fct', label: 'Federal Capital Territory' },
];

const validateEmail = (email) => {
  if (!email) return true; // Email is optional
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const validatePhone = (phone) => {
  if (!phone) return true; // Phone is optional
  const re = /^(0|\+234)[0-9]{10}$/;
  return re.test(phone.replace(/\s/g, ''));
};

const StaffCreate = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Check if user is admin
  const isAdmin = user?.role === 'head' || user?.role === 'principal' ||
    user?.role === 'vice_principal' || user?.role === 'hm' ||
    user?.is_staff;

  // Redirect if not admin
  useEffect(() => {
    if (!isAdmin) {
      navigate('/dashboard');
    }
  }, [isAdmin, navigate]);

  // =====================
  // STEP 1: USER DATA
  // =====================
  const [userData, setUserData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    password: 'Staff@2024',
    password2: 'Staff@2024',
    gender: '',
    date_of_birth: '',
    address: '',
    city: '',
    state_of_origin: '',
    lga: '',
    nationality: 'Nigerian',
    role: 'teacher', // Default staff role
  });

  // =====================
  // STEP 2: STAFF DATA
  // =====================
  const [staffData, setStaffData] = useState({
    employment_date: new Date().toISOString().split('T')[0],
    employment_type: 'full_time',
    department: 'academic',
    position_title: '',
    highest_qualification: '',
    qualification_institution: '',
    year_of_graduation: '',
    professional_certifications: '',
    trcn_number: '',
    trcn_expiry_date: '',
    specialization: '',
    basic_salary: '0.00',
    salary_scale: '',
    salary_step: 1,
    bank_name: '',
    account_name: '',
    account_number: '',
    annual_leave_days: 21,
    sick_leave_days: 10,
    next_of_kin_name: '',
    next_of_kin_relationship: '',
    next_of_kin_phone: '',
    next_of_kin_address: '',
    blood_group: '',
    genotype: '',
    medical_conditions: '',
    allergies: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    emergency_contact_relationship: '',
    is_active: true,
    is_on_probation: false,
    probation_end_date: '',
    years_of_experience: 0,
    previous_employers: '',
    references: '',
  });

  // =====================
  // TEACHER DATA (if applicable)
  // =====================
  const [teacherData, setTeacherData] = useState({
    teacher_type: 'subject_teacher',
    stream_specialization: 'none',
    max_periods_per_week: 40,
    years_of_teaching_experience: 0,
    previous_schools: '',
    workshops_attended: '',
    training_certificates: '',
    conferences_attended: '',
    research_publications: '',
    has_teaching_materials: false,
    teaching_materials_description: '',
    additional_responsibilities: '',
  });

  // Files
  const [files, setFiles] = useState({
    resume: null,
    certificates: null,
    id_copy: null,
    passport_photo: null,
  });

  // UI State
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [createdUser, setCreatedUser] = useState(null);
  const [createdStaff, setCreatedStaff] = useState(null);
  const [createdTeacher, setCreatedTeacher] = useState(null);
  const [isTeachingRole, setIsTeachingRole] = useState(true);

  // Total steps
  const totalSteps = 6; // Step 1: User, Step 2-6: Staff details

  // Options
  const nigerianStates = getNigerianStates();
  
  const genderOptions = [
    { value: '', label: 'Select Gender' },
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
  ];

  const roleOptions = [
    { value: 'head', label: 'Head of School/Proprietor' },
    { value: 'hm', label: 'Head Master' },
    { value: 'principal', label: 'Principal' },
    { value: 'vice_principal', label: 'Vice Principal' },
    { value: 'teacher', label: 'Teacher' },
    { value: 'form_teacher', label: 'Form Teacher' },
    { value: 'subject_teacher', label: 'Subject Teacher' },
    { value: 'accountant', label: 'Accountant/Bursar' },
    { value: 'secretary', label: 'Secretary' },
    { value: 'librarian', label: 'Librarian' },
    { value: 'laboratory', label: 'Laboratory Technician' },
    { value: 'security', label: 'Security Personnel' },
    { value: 'cleaner', label: 'Cleaner' },
  ];

  const departmentOptions = [
    { value: 'administration', label: 'Administration' },
    { value: 'academic', label: 'Academic' },
    { value: 'finance', label: 'Finance/Bursary' },
    { value: 'library', label: 'Library' },
    { value: 'laboratory', label: 'Laboratory' },
    { value: 'ict', label: 'ICT/Computer' },
    { value: 'security', label: 'Security' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'transport', label: 'Transport' },
    { value: 'health', label: 'Health Clinic' },
    { value: 'counseling', label: 'Guidance & Counseling' },
    { value: 'sports', label: 'Sports & Games' },
    { value: 'kitchen', label: 'Kitchen/Cafeteria' },
    { value: 'none', label: 'Not Applicable' },
  ];

  const employmentTypeOptions = [
    { value: 'full_time', label: 'Full-Time' },
    { value: 'part_time', label: 'Part-Time' },
    { value: 'contract', label: 'Contract' },
    { value: 'volunteer', label: 'Volunteer' },
    { value: 'trainee', label: 'Trainee/Intern' },
    { value: 'probation', label: 'Probation' },
  ];

  const teacherTypeOptions = [
    { value: 'class_teacher', label: 'Class Teacher' },
    { value: 'subject_teacher', label: 'Subject Teacher' },
    { value: 'both', label: 'Class & Subject Teacher' },
    { value: 'head_of_department', label: 'Head of Department' },
    { value: 'vice_principal_academic', label: 'Vice Principal (Academic)' },
    { value: 'vice_principal_admin', label: 'Vice Principal (Administration)' },
    { value: 'principal', label: 'Principal' },
    { value: 'head', label: 'Head of School' },
    { value: 'assistant_teacher', label: 'Assistant Teacher' },
    { value: 'special_education', label: 'Special Education Teacher' },
  ];

  const streamOptions = [
    { value: 'science', label: 'Science' },
    { value: 'commercial', label: 'Commercial' },
    { value: 'arts', label: 'Arts/Humanities' },
    { value: 'technical', label: 'Technical' },
    { value: 'general', label: 'General (All Streams)' },
    { value: 'none', label: 'Not Applicable' },
  ];

  const bloodGroupOptions = [
    { value: '', label: 'Select Blood Group' },
    { value: 'A+', label: 'A+' },
    { value: 'A-', label: 'A-' },
    { value: 'B+', label: 'B+' },
    { value: 'B-', label: 'B-' },
    { value: 'AB+', label: 'AB+' },
    { value: 'AB-', label: 'AB-' },
    { value: 'O+', label: 'O+' },
    { value: 'O-', label: 'O-' },
  ];

  const genotypeOptions = [
    { value: '', label: 'Select Genotype' },
    { value: 'AA', label: 'AA' },
    { value: 'AS', label: 'AS' },
    { value: 'SS', label: 'SS' },
    { value: 'AC', label: 'AC' },
  ];

  // Check if selected role is a teaching role
  useEffect(() => {
    const teachingRoles = ['teacher', 'form_teacher', 'subject_teacher', 
                          'head', 'hm', 'principal', 'vice_principal'];
    setIsTeachingRole(teachingRoles.includes(userData.role));
  }, [userData.role]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;

    if (currentStep === 1) {
      // Step 1: User data
      setUserData(prev => ({ ...prev, [name]: inputValue }));
    } else if (currentStep >= 2 && currentStep <= 5) {
      // Steps 2-5: Staff data
      setStaffData(prev => ({ ...prev, [name]: inputValue }));
    }

    // Clear field errors
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleTeacherChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;
    
    setTeacherData(prev => ({ ...prev, [name]: inputValue }));
    
    // Clear errors for this field
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle file changes
  const handleFileChange = (e) => {
    const { name, files: fileList } = e.target;
    const file = fileList[0];
    if (file) {
      setFiles(prev => ({ ...prev, [name]: file }));
    }
  };

  // Navigation
  const handleNext = () => {
    if (validateCurrentStep()) {
      if (currentStep < totalSteps) {
        setCurrentStep(prev => prev + 1);
        window.scrollTo(0, 0);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  // Validation
  const validateCurrentStep = () => {
    const errors = {};

    switch (currentStep) {
      case 1: // User Information
        if (!userData.first_name.trim()) errors.first_name = 'First name is required';
        if (!userData.last_name.trim()) errors.last_name = 'Last name is required';
        if (!userData.role) errors.role = 'Staff role is required';
        if (!userData.gender) errors.gender = 'Gender is required';
        
        // Email validation (optional but must be valid if provided)
        if (userData.email && !validateEmail(userData.email)) {
          errors.email = 'Invalid email format';
        }
        
        // Phone validation (optional but must be valid if provided)
        if (userData.phone_number && !validatePhone(userData.phone_number)) {
          errors.phone_number = 'Invalid phone format (08012345678 or +2348012345678)';
        }
        
        // Password validation
        if (userData.password !== userData.password2) {
          errors.password2 = 'Passwords do not match';
        }
        if (userData.password.length < 8) {
          errors.password = 'Password must be at least 8 characters';
        }
        break;

      case 2: // Employment Information
        if (!staffData.employment_date) errors.employment_date = 'Employment date is required';
        if (!staffData.employment_type) errors.employment_type = 'Employment type is required';
        if (!staffData.department) errors.department = 'Department is required';
        if (!staffData.position_title.trim()) errors.position_title = 'Position title is required';
        break;

      // Steps 3-6 are optional, no validation needed
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // STEP 1: Create User Account
  // STEP 1: Create User Account
  const handleCreateUser = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateCurrentStep()) {
      setError('Please fix the errors in the form');
      return;
    }

    try {
      setLoading(true);
      console.log('🚀 Creating staff user account...');

      // Clean user data
      const cleanUserData = {
        first_name: userData.first_name.trim(),
        last_name: userData.last_name.trim(),
        email: userData.email?.trim() || null, // Can be null
        phone_number: userData.phone_number?.trim() || null, // Can be null
        password: userData.password,
        password2: userData.password2,
        role: userData.role,
        gender: userData.gender,
        date_of_birth: userData.date_of_birth || null,
        address: userData.address?.trim() || '',
        city: userData.city?.trim() || '',
        state_of_origin: userData.state_of_origin || '',
        lga: userData.lga?.trim() || '',
        nationality: userData.nationality || 'Nigerian',
      };

      console.log('📦 User data to send:', cleanUserData);

      // FIX THIS LINE: Change 'register' to 'createUser'
      const userResponse = await userService.createUser(cleanUserData); // <-- FIXED HERE
      
      // Handle different response structures
      const createdUserData = userResponse?.user || userResponse;
      
      if (!createdUserData || !createdUserData.id) {
        throw new Error('User created but missing ID in response');
      }
      
      setCreatedUser(createdUserData);
      setSuccess('✅ Staff user account created successfully!');
      
      // Auto-proceed to next step after 1 second
      setTimeout(() => {
        setCurrentStep(2);
        window.scrollTo(0, 0);
      }, 1000);

    } catch (err) {
      console.error('❌ User creation error:', err);
      setError(err.message || 'Failed to create user account');
    } finally {
      setLoading(false);
    }
  };

  // STEP 2-6: Create Staff Profile
// In StaffCreate.jsx - Update the staff creation call

  // STEP 2-6: Create Staff Profile
  const handleCreateStaffProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!createdUser || !createdUser.id) {
      setError('Please complete user registration first');
      return;
    }

    // Validate required fields for staff
    const errors = {};
    if (!staffData.employment_date) errors.employment_date = 'Employment date is required';
    if (!staffData.department) errors.department = 'Department is required';
    
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError('Please complete required fields');
      return;
    }

    try {
      setLoading(true);
      console.log('🎓 Creating staff profile...');

      // Prepare staff data - fix data types (EXACTLY LIKE STUDENT SERVICE)
      const staffDataToSend = { ...staffData };
      
      // Convert numeric fields to proper format
      if (staffDataToSend.basic_salary) {
        staffDataToSend.basic_salary = parseFloat(staffDataToSend.basic_salary) || 0;
      }
      if (staffDataToSend.salary_step) {
        staffDataToSend.salary_step = parseInt(staffDataToSend.salary_step) || 1;
      }
      if (staffDataToSend.years_of_experience) {
        staffDataToSend.years_of_experience = parseInt(staffDataToSend.years_of_experience) || 0;
      }
      if (staffDataToSend.annual_leave_days) {
        staffDataToSend.annual_leave_days = parseInt(staffDataToSend.annual_leave_days) || 21;
      }
      if (staffDataToSend.sick_leave_days) {
        staffDataToSend.sick_leave_days = parseInt(staffDataToSend.sick_leave_days) || 10;
      }
      
      // FIX: Handle year_of_graduation - convert to integer or empty string
      if (staffDataToSend.year_of_graduation === '' || staffDataToSend.year_of_graduation === null) {
        delete staffDataToSend.year_of_graduation; // Remove if empty
      } else if (staffDataToSend.year_of_graduation) {
        staffDataToSend.year_of_graduation = parseInt(staffDataToSend.year_of_graduation);
      }
      
      // FIX: Handle empty date fields - remove them if empty
      if (staffDataToSend.trcn_expiry_date === '' || staffDataToSend.trcn_expiry_date === null) {
        delete staffDataToSend.trcn_expiry_date;
      }
      
      if (staffDataToSend.probation_end_date === '' || staffDataToSend.probation_end_date === null) {
        delete staffDataToSend.probation_end_date;
      }
      
      console.log('📦 Staff data to send:', staffDataToSend);
      console.log('👤 User ID:', createdUser.id);
      console.log('📁 Files to send:', files);

      // Create staff profile - USE THE SAME PATTERN AS STUDENT
      const staffResponse = await staffService.saveStaffProfile(
        createdUser.id,
        {
          ...staffDataToSend,
          files: files
        }
      );

      const createdStaffData = staffResponse?.staff || staffResponse;
      setCreatedStaff(createdStaffData);

      // TEMPORARILY SKIP TEACHER PROFILE CREATION - FIX FIELD ISSUES FIRST
      // Step 3: If teaching role, create teacher profile - COMMENTED OUT FOR NOW
      /*
      if (isTeachingRole && createdStaffData.id) {
        try {
          // Create safe teacher payload with only fields that definitely exist
          const safeTeacherPayload = {
            staff_id: createdStaffData.staff_id || createdStaffData.id,
            teacher_type: teacherData.teacher_type,
            stream_specialization: teacherData.stream_specialization,
            max_periods_per_week: teacherData.max_periods_per_week,
            years_of_teaching_experience: teacherData.years_of_teaching_experience,
            previous_schools: teacherData.previous_schools,
          };
          
          console.log('📝 Safe teacher payload:', safeTeacherPayload);
          
          const teacherResponse = await staffService.createTeacherProfile(safeTeacherPayload);
          setCreatedTeacher(teacherResponse?.teacher_profile || teacherResponse);
        } catch (teacherError) {
          console.warn('⚠️ Teacher profile creation optional:', teacherError);
          // Continue even if teacher profile fails
        }
      }
      */

      setSuccess('🎉 Staff profile created successfully!');

    } catch (err) {
      console.error('❌ Staff profile creation error:', err);
      setError(err.message || 'Failed to create staff profile');
    } finally {
      setLoading(false);
    }
  };

  // Reset form for new staff
  const resetForm = () => {
    setUserData({
      first_name: '',
      last_name: '',
      email: '',
      phone_number: '',
      password: 'Staff@2024',
      password2: 'Staff@2024',
      gender: '',
      date_of_birth: '',
      address: '',
      city: '',
      state_of_origin: '',
      lga: '',
      nationality: 'Nigerian',
      role: 'teacher',
    });

    setStaffData({
      employment_date: new Date().toISOString().split('T')[0],
      employment_type: 'full_time',
      department: 'academic',
      position_title: '',
      highest_qualification: '',
      qualification_institution: '',
      year_of_graduation: '',
      professional_certifications: '',
      trcn_number: '',
      trcn_expiry_date: '',
      specialization: '',
      basic_salary: '0.00',
      salary_scale: '',
      salary_step: 1,
      bank_name: '',
      account_name: '',
      account_number: '',
      annual_leave_days: 21,
      sick_leave_days: 10,
      next_of_kin_name: '',
      next_of_kin_relationship: '',
      next_of_kin_phone: '',
      next_of_kin_address: '',
      blood_group: '',
      genotype: '',
      medical_conditions: '',
      allergies: '',
      emergency_contact_name: '',
      emergency_contact_phone: '',
      emergency_contact_relationship: '',
      is_active: true,
      is_on_probation: false,
      probation_end_date: '',
      years_of_experience: 0,
      previous_employers: '',
      references: '',
    });

    setTeacherData({
      teacher_type: 'subject_teacher',
      stream_specialization: 'none',
      max_periods_per_week: 40,
      current_periods_per_week: 0,
      preferred_periods: 35,
      years_of_teaching_experience: 0,
      previous_schools: '',
      workshops_attended: '',
      training_certificates: '',
      conferences_attended: '',
      research_publications: '',
      has_teaching_materials: false,
      teaching_materials_description: '',
      additional_responsibilities: '',
    });

    setFiles({
      resume: null,
      certificates: null,
      id_copy: null,
      passport_photo: null,
    });

    setCreatedUser(null);
    setCreatedStaff(null);
    setCreatedTeacher(null);
    setCurrentStep(1);
    setFieldErrors({});
    setError('');
    setSuccess('');
  };

  // =====================
  // RENDER FUNCTIONS
  // =====================

  const renderStep1 = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
          <User className="text-primary-600" size={20} />
        </div>
        <div>
          <h3 className="text-xl font-heading font-semibold text-secondary-800">Step 1: Create Staff Account</h3>
          <p className="text-sm text-neutral-600">Create the staff's user account first (Email and phone are optional)</p>
        </div>
      </div>

      <form onSubmit={handleCreateUser}>
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="first_name"
                value={userData.first_name}
                onChange={handleInputChange}
                placeholder="John"
                required
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200 ${
                  fieldErrors.first_name ? 'border-red-500' : 'border-neutral-300'
                }`}
                disabled={loading}
              />
              {fieldErrors.first_name && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.first_name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="last_name"
                value={userData.last_name}
                onChange={handleInputChange}
                placeholder="Doe"
                required
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200 ${
                  fieldErrors.last_name ? 'border-red-500' : 'border-neutral-300'
                }`}
                disabled={loading}
              />
              {fieldErrors.last_name && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.last_name}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Email Address <span className="text-gray-400">(Optional)</span>
              </label>
              <input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleInputChange}
                placeholder="john.doe@example.com"
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200 ${
                  fieldErrors.email ? 'border-red-500' : 'border-neutral-300'
                }`}
                disabled={loading}
              />
              {fieldErrors.email && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Phone Number <span className="text-gray-400">(Optional)</span>
              </label>
              <input
                type="tel"
                name="phone_number"
                value={userData.phone_number}
                onChange={handleInputChange}
                placeholder="08012345678"
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200 ${
                  fieldErrors.phone_number ? 'border-red-500' : 'border-neutral-300'
                }`}
                disabled={loading}
              />
              {fieldErrors.phone_number && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.phone_number}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                name="gender"
                value={userData.gender}
                onChange={handleInputChange}
                required
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200 ${
                  fieldErrors.gender ? 'border-red-500' : 'border-neutral-300'
                }`}
                disabled={loading}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              {fieldErrors.gender && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.gender}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Date of Birth
              </label>
              <input
                type="date"
                name="date_of_birth"
                value={userData.date_of_birth}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200"
                disabled={loading}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Staff Role <span className="text-red-500">*</span>
              </label>
              <select
                name="role"
                value={userData.role}
                onChange={handleInputChange}
                required
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200 ${
                  fieldErrors.role ? 'border-red-500' : 'border-neutral-300'
                }`}
                disabled={loading}
              >
                <option value="">Select Role</option>
                {roleOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {fieldErrors.role && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.role}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="password"
                value={userData.password}
                onChange={handleInputChange}
                required
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200 ${
                  fieldErrors.password ? 'border-red-500' : 'border-neutral-300'
                }`}
                disabled={loading}
              />
              {fieldErrors.password && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.password}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="password2"
                value={userData.password2}
                onChange={handleInputChange}
                required
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200 ${
                  fieldErrors.password2 ? 'border-red-500' : 'border-neutral-300'
                }`}
                disabled={loading}
              />
              {fieldErrors.password2 && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.password2}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">State of Origin</label>
              <select
                name="state_of_origin"
                value={userData.state_of_origin}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200"
                disabled={loading}
              >
                <option value="">Select State</option>
                {nigerianStates.map((state) => (
                  <option key={state.value} value={state.value}>
                    {state.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">City</label>
              <input
                type="text"
                name="city"
                value={userData.city}
                onChange={handleInputChange}
                placeholder="Lagos"
                className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Nationality</label>
              <input
                type="text"
                name="nationality"
                value={userData.nationality}
                onChange={handleInputChange}
                placeholder="Nigerian"
                className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200"
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Home Address</label>
            <textarea
              name="address"
              value={userData.address}
              onChange={handleInputChange}
              placeholder="123 Main Street, Apapa"
              rows={2}
              className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200"
              disabled={loading}
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-6">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-blue-600 font-medium">!</span>
              </div>
              <div>
                <p className="text-sm text-blue-700 font-medium">Important Note</p>
                <p className="text-sm text-blue-600">Select appropriate role based on staff position and department</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-8">
          <Button
            type="submit"
            loading={loading}
            disabled={loading || createdUser}
            className="bg-primary-600 hover:bg-primary-700"
          >
            {loading ? 'Creating Account...' : createdUser ? 'Account Created ✓' : 'Create Staff Account'}
          </Button>
        </div>
      </form>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-secondary-100 rounded-lg flex items-center justify-center mr-3">
          <Briefcase className="text-secondary-600" size={20} />
        </div>
        <div>
          <h3 className="text-xl font-heading font-semibold text-secondary-800">Step 2: Employment Information</h3>
          <p className="text-sm text-neutral-600">Employment details and department assignment</p>
        </div>
      </div>

      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Employment Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="employment_date"
              value={staffData.employment_date}
              onChange={handleInputChange}
              required
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200 ${
                fieldErrors.employment_date ? 'border-red-500' : 'border-neutral-300'
              }`}
              disabled={loading}
            />
            {fieldErrors.employment_date && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.employment_date}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Employment Type <span className="text-red-500">*</span>
            </label>
            <select
              name="employment_type"
              value={staffData.employment_type}
              onChange={handleInputChange}
              required
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200 ${
                fieldErrors.employment_type ? 'border-red-500' : 'border-neutral-300'
              }`}
              disabled={loading}
            >
              <option value="">Select Type</option>
              {employmentTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {fieldErrors.employment_type && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.employment_type}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Department <span className="text-red-500">*</span>
            </label>
            <select
              name="department"
              value={staffData.department}
              onChange={handleInputChange}
              required
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200 ${
                fieldErrors.department ? 'border-red-500' : 'border-neutral-300'
              }`}
              disabled={loading}
            >
              <option value="">Select Department</option>
              {departmentOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {fieldErrors.department && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.department}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Position Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="position_title"
              value={staffData.position_title}
              onChange={handleInputChange}
              placeholder="e.g., Mathematics Teacher, Accountant"
              required
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200 ${
                fieldErrors.position_title ? 'border-red-500' : 'border-neutral-300'
              }`}
              disabled={loading}
            />
            {fieldErrors.position_title && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.position_title}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Years of Experience</label>
            <input
              type="number"
              name="years_of_experience"
              value={staffData.years_of_experience}
              onChange={handleInputChange}
              placeholder="0"
              min="0"
              className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200"
              disabled={loading}
            />
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_on_probation"
                name="is_on_probation"
                checked={staffData.is_on_probation}
                onChange={handleInputChange}
                className="h-5 w-5 text-secondary-600 rounded focus:ring-secondary-500"
                disabled={loading}
              />
              <label htmlFor="is_on_probation" className="ml-2 text-sm text-neutral-700">
                On Probation
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_active"
                name="is_active"
                checked={staffData.is_active}
                onChange={handleInputChange}
                className="h-5 w-5 text-secondary-600 rounded focus:ring-secondary-500"
                disabled={loading}
              />
              <label htmlFor="is_active" className="ml-2 text-sm text-neutral-700">
                Active Status
              </label>
            </div>
          </div>
        </div>

        {staffData.is_on_probation && (
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Probation End Date</label>
            <input
              type="date"
              name="probation_end_date"
              value={staffData.probation_end_date}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200"
              disabled={loading}
              min={staffData.employment_date}
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">Previous Employers</label>
          <textarea
            name="previous_employers"
            value={staffData.previous_employers}
            onChange={handleInputChange}
            placeholder="List previous employers with dates"
            rows={2}
            className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">References</label>
          <textarea
            name="references"
            value={staffData.references}
            onChange={handleInputChange}
            placeholder="Provide professional references"
            rows={2}
            className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200"
            disabled={loading}
          />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center mr-3">
          <GraduationCap className="text-accent-600" size={20} />
        </div>
        <div>
          <h3 className="text-xl font-heading font-semibold text-secondary-800">Step 3: Qualifications & Certifications</h3>
          <p className="text-sm text-neutral-600">Educational and professional qualifications</p>
        </div>
      </div>

      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Highest Qualification</label>
            <input
              type="text"
              name="highest_qualification"
              value={staffData.highest_qualification}
              onChange={handleInputChange}
              placeholder="e.g., B.Sc, M.Ed, PhD"
              className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Institution</label>
            <input
              type="text"
              name="qualification_institution"
              value={staffData.qualification_institution}
              onChange={handleInputChange}
              placeholder="University/College name"
              className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200"
              disabled={loading}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Year of Graduation</label>
            <input
              type="number"
              name="year_of_graduation"
              value={staffData.year_of_graduation}
              onChange={handleInputChange}
              placeholder="YYYY"
              min="1950"
              max={new Date().getFullYear()}
              className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Specialization</label>
            <input
              type="text"
              name="specialization"
              value={staffData.specialization}
              onChange={handleInputChange}
              placeholder="Area of specialization"
              className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200"
              disabled={loading}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">Professional Certifications</label>
          <textarea
            name="professional_certifications"
            value={staffData.professional_certifications}
            onChange={handleInputChange}
            placeholder="List professional certifications"
            rows={2}
            className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200"
            disabled={loading}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">TRCN Number</label>
            <input
              type="text"
              name="trcn_number"
              value={staffData.trcn_number}
              onChange={handleInputChange}
              placeholder="Teachers Registration Council Number"
              className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">TRCN Expiry Date</label>
            <input
              type="date"
              name="trcn_expiry_date"
              value={staffData.trcn_expiry_date}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200"
              disabled={loading}
            />
          </div>
        </div>

        {/* Teacher-specific information */}
        {isTeachingRole && (
          <div className="pt-6 border-t border-neutral-200">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-primary-600 font-medium">T</span>
              </div>
              <h4 className="font-medium text-neutral-700">Teacher Information (Optional)</h4>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Teacher Type</label>
                  <select
                    name="teacher_type"
                    value={teacherData.teacher_type}
                    onChange={handleTeacherChange}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200"
                    disabled={loading}
                  >
                    <option value="">Select Type</option>
                    {teacherTypeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Stream Specialization</label>
                  <select
                    name="stream_specialization"
                    value={teacherData.stream_specialization}
                    onChange={handleTeacherChange}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200"
                    disabled={loading}
                  >
                    <option value="">Select Stream</option>
                    {streamOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Max Periods/Week</label>
                  <input
                    type="number"
                    name="max_periods_per_week"
                    value={teacherData.max_periods_per_week}
                    onChange={handleTeacherChange}
                    placeholder="40"
                    min="0"
                    className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Teaching Experience (Years)</label>
                  <input
                    type="number"
                    name="years_of_teaching_experience"
                    value={teacherData.years_of_teaching_experience}
                    onChange={handleTeacherChange}
                    placeholder="0"
                    min="0"
                    className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Previous Schools</label>
                  <input
                    type="text"
                    name="previous_schools"
                    value={teacherData.previous_schools}
                    onChange={handleTeacherChange}
                    placeholder="Previous schools"
                    className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
          <DollarSign className="text-blue-600" size={20} />
        </div>
        <div>
          <h3 className="text-xl font-heading font-semibold text-secondary-800">Step 4: Salary & Bank Information</h3>
          <p className="text-sm text-neutral-600">Salary details and bank account information</p>
        </div>
      </div>

      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Basic Salary (₦)</label>
            <input
              type="number"
              name="basic_salary"
              value={staffData.basic_salary}
              onChange={handleInputChange}
              placeholder="0.00"
              min="0"
              step="0.01"
              className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Salary Scale</label>
            <input
              type="text"
              name="salary_scale"
              value={staffData.salary_scale}
              onChange={handleInputChange}
              placeholder="e.g., CONMESS 6"
              className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Salary Step</label>
            <input
              type="number"
              name="salary_step"
              value={staffData.salary_step}
              onChange={handleInputChange}
              placeholder="1"
              min="1"
              max="20"
              className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200"
              disabled={loading}
            />
          </div>
        </div>

        <div className="pt-4 border-t border-neutral-200">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-accent-100 rounded-lg flex items-center justify-center mr-3">
              <Banknote className="text-accent-600" size={20} />
            </div>
            <h4 className="font-medium text-neutral-700">Bank Details</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Bank Name</label>
              <input
                type="text"
                name="bank_name"
                value={staffData.bank_name}
                onChange={handleInputChange}
                placeholder="Bank name"
                className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200"
                disabled={loading}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Account Name</label>
              <input
                type="text"
                name="account_name"
                value={staffData.account_name}
                onChange={handleInputChange}
                placeholder="Account name"
                className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200"
                disabled={loading}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Account Number</label>
              <input
                type="text"
                name="account_number"
                value={staffData.account_number}
                onChange={handleInputChange}
                placeholder="Account number"
                className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200"
                disabled={loading}
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-neutral-200">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-secondary-100 rounded-lg flex items-center justify-center mr-3">
              <span className="text-secondary-600 font-medium">L</span>
            </div>
            <h4 className="font-medium text-neutral-700">Leave Information</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Annual Leave Days</label>
              <input
                type="number"
                name="annual_leave_days"
                value={staffData.annual_leave_days}
                onChange={handleInputChange}
                placeholder="21"
                min="0"
                className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Sick Leave Days</label>
              <input
                type="number"
                name="sick_leave_days"
                value={staffData.sick_leave_days}
                onChange={handleInputChange}
                placeholder="10"
                min="0"
                className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200"
                disabled={loading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
          <Heart className="text-red-600" size={20} />
        </div>
        <div>
          <h3 className="text-xl font-heading font-semibold text-secondary-800">Step 5: Health & Emergency Information</h3>
          <p className="text-sm text-neutral-600">Medical details and emergency contacts</p>
        </div>
      </div>

      <div className="space-y-8">
        <div>
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
              <Stethoscope className="text-primary-600" size={20} />
            </div>
            <h4 className="font-medium text-neutral-700">Health Information</h4>
          </div>
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Blood Group</label>
                <select
                  name="blood_group"
                  value={staffData.blood_group}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200"
                  disabled={loading}
                >
                  {bloodGroupOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Genotype</label>
                <select
                  name="genotype"
                  value={staffData.genotype}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200"
                  disabled={loading}
                >
                  {genotypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Medical Conditions</label>
              <textarea
                name="medical_conditions"
                value={staffData.medical_conditions}
                onChange={handleInputChange}
                placeholder="Any known medical conditions"
                rows={2}
                className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Allergies</label>
              <textarea
                name="allergies"
                value={staffData.allergies}
                onChange={handleInputChange}
                placeholder="Known allergies"
                rows={2}
                className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200"
                disabled={loading}
              />
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-neutral-200">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-accent-100 rounded-lg flex items-center justify-center mr-3">
              <span className="text-accent-600 font-medium">E</span>
            </div>
            <h4 className="font-medium text-neutral-700">Emergency Contact</h4>
          </div>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Emergency Contact Name</label>
              <input
                type="text"
                name="emergency_contact_name"
                value={staffData.emergency_contact_name}
                onChange={handleInputChange}
                placeholder="Full name"
                className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200"
                disabled={loading}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Emergency Contact Phone</label>
                <input
                  type="tel"
                  name="emergency_contact_phone"
                  value={staffData.emergency_contact_phone}
                  onChange={handleInputChange}
                  placeholder="08012345678"
                  className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Relationship</label>
                <input
                  type="text"
                  name="emergency_contact_relationship"
                  value={staffData.emergency_contact_relationship}
                  onChange={handleInputChange}
                  placeholder="e.g., Spouse, Sibling"
                  className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200"
                  disabled={loading}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-neutral-200">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-secondary-100 rounded-lg flex items-center justify-center mr-3">
              <span className="text-secondary-600 font-medium">N</span>
            </div>
            <h4 className="font-medium text-neutral-700">Next of Kin</h4>
          </div>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Next of Kin Name</label>
              <input
                type="text"
                name="next_of_kin_name"
                value={staffData.next_of_kin_name}
                onChange={handleInputChange}
                placeholder="Full name"
                className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200"
                disabled={loading}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Relationship</label>
                <input
                  type="text"
                  name="next_of_kin_relationship"
                  value={staffData.next_of_kin_relationship}
                  onChange={handleInputChange}
                  placeholder="e.g., Spouse, Parent"
                  className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="next_of_kin_phone"
                  value={staffData.next_of_kin_phone}
                  onChange={handleInputChange}
                  placeholder="08012345678"
                  className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Next of Kin Address</label>
              <textarea
                name="next_of_kin_address"
                value={staffData.next_of_kin_address}
                onChange={handleInputChange}
                placeholder="Address"
                rows={2}
                className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200"
                disabled={loading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep6 = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
          <CheckCircle className="text-green-600" size={20} />
        </div>
        <div>
          <h3 className="text-xl font-heading font-semibold text-secondary-800">Step 6: Final Review & Documents</h3>
          <p className="text-sm text-neutral-600">Review information and upload documents</p>
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-green-600 font-bold">✓</span>
            </div>
          </div>
          <div className="ml-4">
            <h4 className="text-lg font-medium text-green-800">Ready to Create Staff Profile</h4>
            <div className="mt-3 text-sm text-green-700">
              <p className="font-medium mb-2">User Account Created Successfully!</p>
              <div className="space-y-3 mt-4">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
                  <span><strong>User:</strong> {createdUser?.first_name} {createdUser?.last_name}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-secondary-500 rounded-full mr-3"></div>
                  <span><strong>Registration:</strong> {createdUser?.registration_number || 'Auto-generated'}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-success-500 rounded-full mr-3"></div>
                  <span><strong>Email:</strong> {createdUser?.email || 'Not provided'}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-accent-500 rounded-full mr-3"></div>
                  <span><strong>Role:</strong> {roleOptions.find(r => r.value === userData.role)?.label || userData.role}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <span><strong>Position:</strong> {staffData.position_title || 'Not specified'}</span>
                </div>
              </div>
              <p className="mt-4 font-medium text-green-800">Click "Create Staff Profile" to complete the process.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
            <Upload className="text-purple-600" size={20} />
          </div>
          <h4 className="font-medium text-neutral-700">Documents (All Optional)</h4>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Passport Photograph</label>
            <div className="border-2 border-dashed border-neutral-300 rounded-xl p-6 hover:border-secondary-500 transition-colors duration-200">
              <input
                type="file"
                name="passport_photo"
                onChange={handleFileChange}
                className="w-full"
                disabled={loading}
                accept="image/*"
              />
              <p className="mt-2 text-xs text-neutral-500">
                Passport photograph (JPG, PNG) - Can be added later
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Resume/CV</label>
            <div className="border-2 border-dashed border-neutral-300 rounded-xl p-6 hover:border-secondary-500 transition-colors duration-200">
              <input
                type="file"
                name="resume"
                onChange={handleFileChange}
                className="w-full"
                disabled={loading}
                accept=".pdf,.doc,.docx"
              />
              <p className="mt-2 text-xs text-neutral-500">
                Resume or CV document - Can be added later
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Certificates</label>
            <div className="border-2 border-dashed border-neutral-300 rounded-xl p-6 hover:border-secondary-500 transition-colors duration-200">
              <input
                type="file"
                name="certificates"
                onChange={handleFileChange}
                className="w-full"
                disabled={loading}
                accept=".pdf,.jpg,.jpeg,.png"
              />
              <p className="mt-2 text-xs text-neutral-500">
                Professional certificates - Can be added later
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">ID Card Copy</label>
            <div className="border-2 border-dashed border-neutral-300 rounded-xl p-6 hover:border-secondary-500 transition-colors duration-200">
              <input
                type="file"
                name="id_copy"
                onChange={handleFileChange}
                className="w-full"
                disabled={loading}
                accept=".pdf,.jpg,.jpeg,.png"
              />
              <p className="mt-2 text-xs text-neutral-500">
                Copy of ID card - Can be added later
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-green-200">
        <form onSubmit={handleCreateStaffProfile}>
          <Button
            type="submit"
            loading={loading}
            disabled={loading || createdStaff}
            className="bg-green-600 hover:bg-green-700 w-full"
          >
            {loading ? 'Creating Staff Profile...' : createdStaff ? 'Staff Profile Created ✓' : 'Create Staff Profile'}
          </Button>
        </form>
      </div>
    </div>
  );

  const renderSuccessCard = () => {
    const displayUser = createdUser || createdStaff?.user;
    const displayStaff = createdStaff;
    
    if (!displayUser && !displayStaff) {
      return <div>No data available</div>;
    }
    
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center mr-3">
            <CheckCircle className="text-success-600" size={20} />
          </div>
          <div>
            <h3 className="text-xl font-heading font-semibold text-success-800">Staff Created Successfully! 🎉</h3>
            <p className="text-sm text-neutral-600">Staff details and account information</p>
          </div>
        </div>

        <div className="bg-success-50 border border-success-200 rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-success-800 mb-4">Staff Information</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-neutral-600">Full Name</p>
                  <p className="font-medium">{displayUser?.first_name} {displayUser?.last_name}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-600">Registration Number</p>
                  <p className="font-medium text-primary-600">{displayUser?.registration_number}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-600">Staff ID</p>
                  <p className="font-medium">{displayStaff?.staff_id || 'Auto-generated'}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-600">Position</p>
                  <p className="font-medium">{displayStaff?.position_title || staffData.position_title}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-600">Department</p>
                  <p className="font-medium">
                    {departmentOptions.find(d => d.value === staffData.department)?.label || staffData.department}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-success-800 mb-4">Account Information</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-neutral-600">Email</p>
                  <p className="font-medium">{displayUser?.email || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-600">Phone</p>
                  <p className="font-medium">{displayUser?.phone_number || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-600">Gender</p>
                  <p className="font-medium">
                    {displayUser?.gender === 'male' ? 'Male' : 
                    displayUser?.gender === 'female' ? 'Female' : 
                    'Not specified'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-neutral-600">Date of Birth</p>
                  <p className="font-medium">{displayUser?.date_of_birth || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-600">Employment Date</p>
                  <p className="font-medium">{staffData.employment_date}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-success-200">
            <div className="flex flex-col sm:flex-row gap-3">
              {displayStaff?.id && (
                <Button
                  onClick={() => navigate(`/staff/${displayStaff.id}`)}
                  className="bg-primary-600 hover:bg-primary-700"
                >
                  View Staff Profile
                </Button>
              )}
              <Button
                onClick={() => navigate('/staff')}
                variant="outline"
                className="border-neutral-300 text-neutral-700 hover:bg-neutral-50"
              >
                Back to Staff List
              </Button>
              <Button
                onClick={resetForm}
                variant="outline"
                className="border-green-300 text-green-700 hover:bg-green-50"
              >
                Create Another Staff
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Step titles
  const stepTitles = ['Account', 'Employment', 'Qualifications', 'Salary', 'Health & Contacts', 'Final Review'];

  // Main render
  if (!isAdmin) {
    return (
      <DashboardLayout title="Access Denied">
        <div className="bg-white rounded-xl shadow-soft p-8 text-center border border-neutral-100">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl font-bold">!</span>
          </div>
          <h1 className="text-2xl font-heading font-bold text-neutral-800 mb-4">Access Denied</h1>
          <p className="text-neutral-600 mb-6">You don't have permission to create staff members.</p>
          <Link to="/dashboard">
            <Button className="bg-secondary-600 hover:bg-secondary-700">Go to Dashboard</Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Create New Staff">
      {/* Back Navigation */}
      <div className="mb-6">
        <Link to="/staff" className="inline-flex items-center text-secondary-600 hover:text-secondary-700 transition-colors">
          <ArrowLeft size={18} className="mr-2" />
          Back to Staff
        </Link>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => setError('')}
          className="mb-6"
        />
      )}

      {/* Success Alert */}
      {success && !createdStaff && (
        <Alert
          type="success"
          message={success}
          className="mb-6"
          autoDismiss={false}
        />
      )}

      {/* Header - Only show if not viewing success card */}
      {!createdStaff && (
        <div className="bg-white rounded-xl shadow-soft p-6 mb-8 border border-neutral-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-2xl font-heading font-bold text-secondary-800">
                {createdUser ? 'Complete Staff Profile' : 'Add New Staff Member'}
              </h1>
              <p className="text-neutral-600 mt-1">
                {createdUser 
                  ? 'Complete staff profile details'
                  : `Complete all ${totalSteps} steps to create a new staff member`
                }
              </p>
              <div className="flex items-center mt-2">
                <div className="w-3 h-3 bg-secondary-500 rounded-full mr-2"></div>
                <p className="text-sm text-secondary-600 font-medium">
                  Only basic information is required. All other details can be updated later.
                </p>
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              <Link to="/staff">
                <Button variant="outline" className="border-neutral-300 text-neutral-700 hover:bg-neutral-50">
                  Back to Staff
                </Button>
              </Link>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              {stepTitles.map((title, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                    currentStep > index + 1
                      ? 'bg-secondary-600 text-white'
                      : currentStep === index + 1
                      ? 'bg-primary-500 text-white'
                      : 'bg-neutral-100 text-neutral-400'
                  }`}>
                    {currentStep > index + 1 ? (
                      <span className="text-sm font-medium">✓</span>
                    ) : (
                      <span className="text-sm font-medium">{index + 1}</span>
                    )}
                  </div>
                  <span className={`text-xs font-medium ${
                    currentStep >= index + 1 ? 'text-secondary-700' : 'text-neutral-500'
                  }`}>
                    {title}
                  </span>
                </div>
              ))}
            </div>
            <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full transition-all duration-500"
                style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-soft p-8 border border-neutral-100">
        {/* Show success card or form */}
        {createdStaff ? (
          renderSuccessCard()
        ) : (
          <div>
            {/* Step Content */}
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}
            {currentStep === 5 && renderStep5()}
            {currentStep === 6 && renderStep6()}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-12 pt-8 border-t border-neutral-200">
              <div>
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={loading}
                    className="border-neutral-300 text-neutral-700 hover:bg-neutral-50 flex items-center"
                  >
                    <ChevronLeft size={18} className="mr-2" />
                    Previous
                  </Button>
                )}
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-neutral-600">
                  Step {currentStep} of {totalSteps}
                </span>
                {currentStep < totalSteps && (
                  <Button
                    type="button"
                    onClick={handleNext}
                    disabled={loading || (currentStep === 1 && !createdUser)}
                    className="bg-secondary-600 hover:bg-secondary-700 flex items-center"
                  >
                    Next Step
                    <ChevronRight size={18} className="ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StaffCreate;

