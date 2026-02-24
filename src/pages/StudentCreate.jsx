// components/students/StudentCreate.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import Input from '../components/common/Input';
import useAuth from '../hooks/useAuth';
import studentService from '../services/studentService';
import userService from '../services/userService';
import api from '../services/api';

// Icons
import {
  ArrowLeft,
  UserPlus,
  CheckCircle,
  User,
  GraduationCap,
  School,
  Home,
  Phone,
  Mail,
  BookOpen,
  Heart,
  FileCheck,
  ChevronRight,
  ChevronLeft,
  Upload
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

const StudentCreate = () => {
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
    password: 'Student@2024',
    password2: 'Student@2024',
    gender: '',
    date_of_birth: '',
    address: '',
    city: '',
    state_of_origin: '',
    lga: '',
    nationality: 'Nigerian',
    role: 'student', // Always student
  });

  // =====================
  // STEP 2: STUDENT DATA
  // =====================
  const [studentData, setStudentData] = useState({
    class_level: '',
    stream: 'none',
    admission_date: new Date().toISOString().split('T')[0],
    admission_number: '',
    student_id: '',
    age_at_admission: '',
    place_of_birth: '',
    home_language: '',
    house: 'none',
    previous_class: '',
    previous_school: '',
    transfer_certificate_no: '',
    is_prefect: false,
    prefect_role: '',
    student_category: 'day',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    emergency_contact_relationship: '',
    fee_status: 'not_paid',
    total_fee_amount: '0.00',
    amount_paid: '0.00',
    balance_due: '0.00',
    last_payment_date: '',
    blood_group: '',
    genotype: '',
    has_allergies: false,
    allergy_details: '',
    has_received_vaccinations: true,
    family_doctor_name: '',
    family_doctor_phone: '',
    medical_conditions: '',
    has_learning_difficulties: false,
    learning_difficulties_details: '',
    transportation_mode: 'parent_drop',
    bus_route: '',
    is_active: true,
    is_graduated: false,
    graduation_date: '',
    days_present: '0',
    days_absent: '0',
    days_late: '0',
  });

  // Files
  const [files, setFiles] = useState({
    birth_certificate: null,
    student_image: null,
    immunization_record: null,
    previous_school_report: null,
    parent_id_copy: null,
    fee_payment_evidence: null,
  });

  // UI State
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [createdUser, setCreatedUser] = useState(null);
  const [createdStudent, setCreatedStudent] = useState(null);
  const [classLevels, setClassLevels] = useState([]);

  // Total steps
  const totalSteps = 7; // Step 1: User, Step 2-7: Student details

  // Options
  const nigerianStates = getNigerianStates();
  const genderOptions = [
    { value: '', label: 'Select Gender' },
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
  ];

  const streamOptions = [
    { value: 'none', label: 'No Stream (Primary)' },
    { value: 'science', label: 'Science' },
    { value: 'commercial', label: 'Commercial' },
    { value: 'art', label: 'Arts/Humanities' },
    { value: 'general', label: 'General' },
    { value: 'technical', label: 'Technical' },
  ];

  const studentCategoryOptions = [
    { value: 'day', label: 'Day Student' },
    { value: 'boarding', label: 'Boarding Student' },
    { value: 'special_needs', label: 'Special Needs' },
    { value: 'scholarship', label: 'Scholarship Student' },
    { value: 'repeat', label: 'Repeating Student' },
    { value: 'new', label: 'New Student' },
  ];

  const houseOptions = [
    { value: 'none', label: 'No House' },
    { value: 'red', label: 'Red House' },
    { value: 'blue', label: 'Blue House' },
    { value: 'green', label: 'Green House' },
    { value: 'yellow', label: 'Yellow House' },
    { value: 'purple', label: 'Purple House' },
    { value: 'orange', label: 'Orange House' },
  ];

  const feeStatusOptions = [
    { value: 'not_paid', label: 'Not Paid' },
    { value: 'paid_partial', label: 'Partially Paid' },
    { value: 'paid_full', label: 'Paid in Full' },
    { value: 'scholarship', label: 'Scholarship' },
    { value: 'exempted', label: 'Fee Exempted' },
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

  const transportOptions = [
    { value: 'school_bus', label: 'School Bus' },
    { value: 'parent_drop', label: 'Parent Drop-off' },
    { value: 'public_transport', label: 'Public Transport' },
    { value: 'walk', label: 'Walks to School' },
    { value: 'other', label: 'Other' },
  ];

  // Load class levels
  useEffect(() => {
    const loadClassLevels = async () => {
      if (!isAdmin) return;
      
      setLoadingData(true);
      try {
        const levels = await studentService.getClassLevels();
        setClassLevels(levels);
      } catch (error) {
        console.error('Error loading class levels:', error);
        // Use fallback
        setClassLevels(studentService.getFallbackClassLevels());
      } finally {
        setLoadingData(false);
      }
    };

    loadClassLevels();
  }, [isAdmin]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;

    if (currentStep === 1) {
      // Step 1: User data
      setUserData(prev => ({ ...prev, [name]: inputValue }));
    } else {
      // Steps 2-7: Student data
      setStudentData(prev => ({ ...prev, [name]: inputValue }));
    }

    // Clear field errors
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

      case 2: // Academic Information
        if (!studentData.class_level) errors.class_level = 'Class level is required';
        break;

      // Steps 3-7 are optional, no validation needed
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // STEP 1: Create User Account
// In StudentCreate.jsx - Update the handleCreateUser function
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
      console.log('🚀 Creating student user account...');

      // Clean user data
      const cleanUserData = {
        first_name: userData.first_name.trim(),
        last_name: userData.last_name.trim(),
        email: userData.email?.trim() || null, // Can be null
        phone_number: userData.phone_number?.trim() || null, // Can be null
        password: userData.password,
        password2: userData.password2,
        role: 'student', // Always student
        gender: userData.gender,
        date_of_birth: userData.date_of_birth || null,
        address: userData.address?.trim() || '',
        city: userData.city?.trim() || '',
        state_of_origin: userData.state_of_origin || '',
        lga: userData.lga?.trim() || '',
        nationality: userData.nationality || 'Nigerian',
      };

      console.log('📦 User data to send:', cleanUserData);

      const userResponse = await studentService.createStudentUser(cleanUserData);
      
      // FIX: Handle different response structures
      const createdUserData = userResponse?.user || userResponse;
      
      if (!createdUserData || !createdUserData.id) {
        throw new Error('User created but missing ID in response');
      }
      
      setCreatedUser(createdUserData);
      setSuccess('✅ Student user account created successfully!');
      
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

  // STEP 2-7: Create Student Profile
  const handleCreateStudentProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!createdUser || !createdUser.id) {
      setError('Please complete user registration first');
      return;
    }

    // Validate required fields for student
    const errors = {};
    if (!studentData.class_level) errors.class_level = 'Class level is required';
    
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError('Please select a class level');
      return;
    }

    try {
      setLoading(true);
      console.log('🎓 Creating student profile...');

      // Prepare student data (convert numbers and handle files separately)
      const studentDataToSend = { ...studentData };
      
      // Remove balance_due (it should be calculated by backend)
      delete studentDataToSend.balance_due;
      
      // Convert numeric fields to numbers
      if (studentDataToSend.total_fee_amount) {
        studentDataToSend.total_fee_amount = parseFloat(studentDataToSend.total_fee_amount) || 0;
      }
      if (studentDataToSend.amount_paid) {
        studentDataToSend.amount_paid = parseFloat(studentDataToSend.amount_paid) || 0;
      }
      
      // Convert days fields to numbers
      if (studentDataToSend.days_present) {
        studentDataToSend.days_present = parseInt(studentDataToSend.days_present) || 0;
      }
      if (studentDataToSend.days_absent) {
        studentDataToSend.days_absent = parseInt(studentDataToSend.days_absent) || 0;
      }
      if (studentDataToSend.days_late) {
        studentDataToSend.days_late = parseInt(studentDataToSend.days_late) || 0;
      }
      
      console.log('📦 Student data to send:', studentDataToSend);
      console.log('👤 User ID:', createdUser.id);
      console.log('📁 Files to send:', files);

      // Pass files separately
      const studentResponse = await studentService.createStudentProfile(
        createdUser.id,
        {
          ...studentDataToSend,
          files: files // Pass files object separately
        }
      );

      setCreatedStudent(studentResponse.student || studentResponse);
      setSuccess('🎉 Student profile created successfully!');

    } catch (err) {
      console.error('❌ Student profile creation error:', err);
      setError(err.message || 'Failed to create student profile');
    } finally {
      setLoading(false);
    }
  };
  // Reset form for new student
  const resetForm = () => {
    setUserData({
      first_name: '',
      last_name: '',
      email: '',
      phone_number: '',
      password: 'Student@2024',
      password2: 'Student@2024',
      gender: '',
      date_of_birth: '',
      address: '',
      city: '',
      state_of_origin: '',
      lga: '',
      nationality: 'Nigerian',
      role: 'student',
    });

    setStudentData({
      class_level: '',
      stream: 'none',
      admission_date: new Date().toISOString().split('T')[0],
      admission_number: '',
      student_id: '',
      age_at_admission: '',
      place_of_birth: '',
      home_language: '',
      house: 'none',
      previous_class: '',
      previous_school: '',
      transfer_certificate_no: '',
      is_prefect: false,
      prefect_role: '',
      student_category: 'day',
      emergency_contact_name: '',
      emergency_contact_phone: '',
      emergency_contact_relationship: '',
      fee_status: 'not_paid',
      total_fee_amount: '0.00',
      amount_paid: '0.00',
      balance_due: '0.00',
      last_payment_date: '',
      blood_group: '',
      genotype: '',
      has_allergies: false,
      allergy_details: '',
      has_received_vaccinations: true,
      family_doctor_name: '',
      family_doctor_phone: '',
      medical_conditions: '',
      has_learning_difficulties: false,
      learning_difficulties_details: '',
      transportation_mode: 'parent_drop',
      bus_route: '',
      is_active: true,
      is_graduated: false,
      graduation_date: '',
      days_present: '0',
      days_absent: '0',
      days_late: '0',
    });

    setFiles({
      birth_certificate: null,
      student_image: null,
      immunization_record: null,
      previous_school_report: null,
      parent_id_copy: null,
      fee_payment_evidence: null,
    });

    setCreatedUser(null);
    setCreatedStudent(null);
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
          <h3 className="text-xl font-heading font-semibold text-secondary-800">Step 1: Create Student Account</h3>
          <p className="text-sm text-neutral-600">Create the student's user account first (Email and phone are optional)</p>
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                <p className="text-sm text-blue-700 font-medium">Role Automatically Set</p>
                <p className="text-sm text-blue-600">The role will be automatically set to "student"</p>
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
            {loading ? 'Creating Account...' : createdUser ? 'Account Created ✓' : 'Create Student Account'}
          </Button>
        </div>
      </form>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-secondary-100 rounded-lg flex items-center justify-center mr-3">
          <School className="text-secondary-600" size={20} />
        </div>
        <div>
          <h3 className="text-xl font-heading font-semibold text-secondary-800">Step 2: Academic Information</h3>
          <p className="text-sm text-neutral-600">Select class level and academic details (Only class level is required)</p>
        </div>
      </div>

      {loadingData ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary-600"></div>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Class Level <span className="text-red-500">*</span>
              </label>
              <select
                name="class_level"
                value={studentData.class_level}
                onChange={handleInputChange}
                required
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200 ${
                  fieldErrors.class_level ? 'border-red-500' : 'border-neutral-300'
                }`}
                disabled={loading}
              >
                <option value="">Select Class Level</option>
                {classLevels.map((level) => (
                  <option key={level.id} value={level.id}>
                    {level.name} ({level.code})
                  </option>
                ))}
              </select>
              {fieldErrors.class_level && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.class_level}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Stream</label>
              <select
                name="stream"
                value={studentData.stream}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200"
                disabled={loading}
              >
                {streamOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Admission Date</label>
              <input
                type="date"
                name="admission_date"
                value={studentData.admission_date}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Student Category</label>
              <select
                name="student_category"
                value={studentData.student_category}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200"
                disabled={loading}
              >
                {studentCategoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">House</label>
              <select
                name="house"
                value={studentData.house}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200"
                disabled={loading}
              >
                {houseOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Transportation Mode</label>
              <select
                name="transportation_mode"
                value={studentData.transportation_mode}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200"
                disabled={loading}
              >
                {transportOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Admission Number</label>
              <input
                type="text"
                name="admission_number"
                value={studentData.admission_number}
                onChange={handleInputChange}
                placeholder="Leave blank to auto-generate"
                className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Student ID</label>
              <input
                type="text"
                name="student_id"
                value={studentData.student_id}
                onChange={handleInputChange}
                placeholder="Leave blank to auto-generate"
                className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200"
                disabled={loading}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center mr-3">
          <GraduationCap className="text-accent-600" size={20} />
        </div>
        <div>
          <h3 className="text-xl font-heading font-semibold text-secondary-800">Step 3: Previous School Information (Optional)</h3>
          <p className="text-sm text-neutral-600">Previous academic history</p>
        </div>
      </div>

      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Previous School</label>
            <input
              type="text"
              name="previous_school"
              value={studentData.previous_school}
              onChange={handleInputChange}
              placeholder="Name of previous school"
              className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Previous Class</label>
            <input
              type="text"
              name="previous_class"
              value={studentData.previous_class}
              onChange={handleInputChange}
              placeholder="e.g., Primary 3"
              className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200"
              disabled={loading}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">Transfer Certificate Number</label>
          <input
            type="text"
            name="transfer_certificate_no"
            value={studentData.transfer_certificate_no}
            onChange={handleInputChange}
            placeholder="TC number if available"
            className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200"
            disabled={loading}
          />
        </div>

        <div className="pt-6 border-t border-neutral-200">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
              <span className="text-primary-600 font-medium">P</span>
            </div>
            <h4 className="font-medium text-neutral-700">Prefect Information (Optional)</h4>
          </div>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_prefect"
                name="is_prefect"
                checked={studentData.is_prefect}
                onChange={handleInputChange}
                className="h-5 w-5 text-secondary-600 rounded focus:ring-secondary-500"
                disabled={loading}
              />
              <label htmlFor="is_prefect" className="ml-3 text-sm text-neutral-700">
                Is this student a prefect?
              </label>
            </div>
            {studentData.is_prefect && (
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Prefect Role</label>
                <input
                  type="text"
                  name="prefect_role"
                  value={studentData.prefect_role}
                  onChange={handleInputChange}
                  placeholder="e.g., Head Boy, Head Girl, Class Monitor"
                  className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200"
                  disabled={loading}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
          <Heart className="text-red-600" size={20} />
        </div>
        <div>
          <h3 className="text-xl font-heading font-semibold text-secondary-800">Step 4: Health Information (Optional)</h3>
          <p className="text-sm text-neutral-600">Medical and health details</p>
        </div>
      </div>

      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Blood Group</label>
            <select
              name="blood_group"
              value={studentData.blood_group}
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
              value={studentData.genotype}
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

        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="has_allergies"
              name="has_allergies"
              checked={studentData.has_allergies}
              onChange={handleInputChange}
              className="h-5 w-5 text-secondary-600 rounded focus:ring-secondary-500"
              disabled={loading}
            />
            <label htmlFor="has_allergies" className="ml-3 text-sm text-neutral-700">
              Does the child have any allergies?
            </label>
          </div>
          {studentData.has_allergies && (
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Allergy Details</label>
              <textarea
                name="allergy_details"
                value={studentData.allergy_details}
                onChange={handleInputChange}
                placeholder="Please specify all allergies and reactions"
                rows={2}
                className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200"
                disabled={loading}
              />
            </div>
          )}

          <div className="flex items-center">
            <input
              type="checkbox"
              id="has_learning_difficulties"
              name="has_learning_difficulties"
              checked={studentData.has_learning_difficulties}
              onChange={handleInputChange}
              className="h-5 w-5 text-secondary-600 rounded focus:ring-secondary-500"
              disabled={loading}
            />
            <label htmlFor="has_learning_difficulties" className="ml-3 text-sm text-neutral-700">
              Does the child have any learning difficulties?
            </label>
          </div>
          {studentData.has_learning_difficulties && (
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Learning Difficulties Details</label>
              <textarea
                name="learning_difficulties_details"
                value={studentData.learning_difficulties_details}
                onChange={handleInputChange}
                placeholder="Please elaborate on learning difficulties or developmental needs"
                rows={2}
                className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200"
                disabled={loading}
              />
            </div>
          )}

          <div className="flex items-center">
            <input
              type="checkbox"
              id="has_received_vaccinations"
              name="has_received_vaccinations"
              checked={studentData.has_received_vaccinations}
              onChange={handleInputChange}
              className="h-5 w-5 text-secondary-600 rounded focus:ring-secondary-500"
              disabled={loading}
            />
            <label htmlFor="has_received_vaccinations" className="ml-3 text-sm text-neutral-700">
              Has child received all required vaccinations?
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">Medical Conditions</label>
          <textarea
            name="medical_conditions"
            value={studentData.medical_conditions}
            onChange={handleInputChange}
            placeholder="Any known medical conditions or special needs"
            rows={2}
            className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200"
            disabled={loading}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Family Doctor Name</label>
            <input
              type="text"
              name="family_doctor_name"
              value={studentData.family_doctor_name}
              onChange={handleInputChange}
              placeholder="Dr. John Doe"
              className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Family Doctor Phone</label>
            <input
              type="tel"
              name="family_doctor_phone"
              value={studentData.family_doctor_phone}
              onChange={handleInputChange}
              placeholder="08012345678"
              className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200"
              disabled={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
          <Phone className="text-blue-600" size={20} />
        </div>
        <div>
          <h3 className="text-xl font-heading font-semibold text-secondary-800">Step 5: Emergency Contact & Fee Information (Optional)</h3>
          <p className="text-sm text-neutral-600">Contact and financial details</p>
        </div>
      </div>

      <div className="space-y-8">
        <div>
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
              <span className="text-primary-600 font-medium">E</span>
            </div>
            <h4 className="font-medium text-neutral-700">Emergency Contact</h4>
          </div>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Emergency Contact Name</label>
              <input
                type="text"
                name="emergency_contact_name"
                value={studentData.emergency_contact_name}
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
                  value={studentData.emergency_contact_phone}
                  onChange={handleInputChange}
                  placeholder="08012345678"
                  className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Relationship to Student</label>
                <input
                  type="text"
                  name="emergency_contact_relationship"
                  value={studentData.emergency_contact_relationship}
                  onChange={handleInputChange}
                  placeholder="e.g., Uncle, Aunt, Family Friend"
                  className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200"
                  disabled={loading}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-neutral-200">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-accent-100 rounded-lg flex items-center justify-center mr-3">
              <span className="text-accent-600 font-medium">₦</span>
            </div>
            <h4 className="font-medium text-neutral-700">Fee Information</h4>
          </div>
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Fee Status</label>
                <select
                  name="fee_status"
                  value={studentData.fee_status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200"
                  disabled={loading}
                >
                  {feeStatusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Total Fee Amount (₦)</label>
                <input
                  type="number"
                  name="total_fee_amount"
                  value={studentData.total_fee_amount}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Amount Paid (₦)</label>
                <input
                  type="number"
                  name="amount_paid"
                  value={studentData.amount_paid}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Last Payment Date</label>
                <input
                  type="date"
                  name="last_payment_date"
                  value={studentData.last_payment_date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200"
                  disabled={loading}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep6 = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
          <Upload className="text-purple-600" size={20} />
        </div>
        <div>
          <h3 className="text-xl font-heading font-semibold text-secondary-800">Step 6: Documents (All Optional)</h3>
          <p className="text-sm text-neutral-600">Upload student documents - Can be added later</p>
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">Student Photograph</label>
          <div className="border-2 border-dashed border-neutral-300 rounded-xl p-6 hover:border-secondary-500 transition-colors duration-200">
            <input
              type="file"
              name="student_image"
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
          <label className="block text-sm font-medium text-neutral-700 mb-2">Birth Certificate</label>
          <div className="border-2 border-dashed border-neutral-300 rounded-xl p-6 hover:border-secondary-500 transition-colors duration-200">
            <input
              type="file"
              name="birth_certificate"
              onChange={handleFileChange}
              className="w-full"
              disabled={loading}
              accept=".pdf,.jpg,.jpeg,.png"
            />
            <p className="mt-2 text-xs text-neutral-500">
              Scanned copy of birth certificate - Can be added later
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">Immunization Record</label>
          <div className="border-2 border-dashed border-neutral-300 rounded-xl p-6 hover:border-secondary-500 transition-colors duration-200">
            <input
              type="file"
              name="immunization_record"
              onChange={handleFileChange}
              className="w-full"
              disabled={loading}
              accept=".pdf,.jpg,.jpeg,.png"
            />
            <p className="mt-2 text-xs text-neutral-500">
              Vaccination/immunization card - Can be added later
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">Previous School Report</label>
          <div className="border-2 border-dashed border-neutral-300 rounded-xl p-6 hover:border-secondary-500 transition-colors duration-200">
            <input
              type="file"
              name="previous_school_report"
              onChange={handleFileChange}
              className="w-full"
              disabled={loading}
              accept=".pdf,.jpg,.jpeg,.png"
            />
            <p className="mt-2 text-xs text-neutral-500">
              Previous school report card - Can be added later
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep7 = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
          <CheckCircle className="text-green-600" size={20} />
        </div>
        <div>
          <h3 className="text-xl font-heading font-semibold text-secondary-800">Step 7: Final Review & Create Student Profile</h3>
          <p className="text-sm text-neutral-600">Review information and create student profile</p>
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-xl p-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-green-600 font-bold">✓</span>
            </div>
          </div>
          <div className="ml-4">
            <h4 className="text-lg font-medium text-green-800">Ready to Create Student Profile</h4>
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
                  <span><strong>Class Level:</strong> {studentData.class_level ? classLevels.find(cl => cl.id == studentData.class_level)?.name : 'Not selected'}</span>
                </div>
              </div>
              <p className="mt-4 font-medium text-green-800">Click "Create Student Profile" to complete the process.</p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-green-200">
          <form onSubmit={handleCreateStudentProfile}>
            <Button
              type="submit"
              loading={loading}
              disabled={loading || createdStudent}
              className="bg-green-600 hover:bg-green-700 w-full"
            >
              {loading ? 'Creating Student Profile...' : createdStudent ? 'Student Profile Created ✓' : 'Create Student Profile'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );

  // const renderSuccessCard = () => (
  //   <div className="space-y-6 animate-fade-in">
  //     <div className="flex items-center mb-4">
  //       <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center mr-3">
  //         <CheckCircle className="text-success-600" size={20} />
  //       </div>
  //       <div>
  //         <h3 className="text-xl font-heading font-semibold text-success-800">Student Created Successfully! 🎉</h3>
  //         <p className="text-sm text-neutral-600">Student details and account information</p>
  //       </div>
  //     </div>

  //     <div className="bg-success-50 border border-success-200 rounded-xl p-6">
  //       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  //         <div>
  //           <h4 className="font-medium text-success-800 mb-4">Student Information</h4>
  //           <div className="space-y-3">
  //             <div>
  //               <p className="text-sm text-neutral-600">Full Name</p>
  //               <p className="font-medium">{createdStudent?.user?.first_name} {createdStudent?.user?.last_name}</p>
  //             </div>
  //             <div>
  //               <p className="text-sm text-neutral-600">Registration Number</p>
  //               <p className="font-medium text-primary-600">{createdStudent?.user?.registration_number}</p>
  //             </div>
  //             <div>
  //               <p className="text-sm text-neutral-600">Admission Number</p>
  //               <p className="font-medium">{createdStudent?.admission_number}</p>
  //             </div>
  //             <div>
  //               <p className="text-sm text-neutral-600">Student ID</p>
  //               <p className="font-medium">{createdStudent?.student_id}</p>
  //             </div>
  //             <div>
  //               <p className="text-sm text-neutral-600">Class Level</p>
  //               <p className="font-medium">{createdStudent?.class_level_info?.name}</p>
  //             </div>
  //           </div>
  //         </div>

  //         <div>
  //           <h4 className="font-medium text-success-800 mb-4">Account Information</h4>
  //           <div className="space-y-3">
  //             <div>
  //               <p className="text-sm text-neutral-600">Email</p>
  //               <p className="font-medium">{createdStudent?.user?.email || 'Not provided'}</p>
  //             </div>
  //             <div>
  //               <p className="text-sm text-neutral-600">Phone</p>
  //               <p className="font-medium">{createdStudent?.user?.phone_number || 'Not provided'}</p>
  //             </div>
  //             <div>
  //               <p className="text-sm text-neutral-600">Gender</p>
  //               <p className="font-medium">{createdStudent?.user?.gender_display}</p>
  //             </div>
  //             <div>
  //               <p className="text-sm text-neutral-600">Date of Birth</p>
  //               <p className="font-medium">{createdStudent?.user?.date_of_birth || 'Not provided'}</p>
  //             </div>
  //             <div>
  //               <p className="text-sm text-neutral-600">Account Created</p>
  //               <p className="font-medium">{new Date(createdStudent?.created_at).toLocaleDateString()}</p>
  //             </div>
  //           </div>
  //         </div>
  //       </div>

  //       <div className="mt-8 pt-6 border-t border-success-200">
  //         <div className="flex flex-col sm:flex-row gap-3">
  //           <Button
  //             onClick={() => navigate(`/students/${createdStudent?.id}`)}
  //             className="bg-primary-600 hover:bg-primary-700"
  //           >
  //             View Student Profile
  //           </Button>
  //           <Button
  //             onClick={() => navigate('/students')}
  //             variant="outline"
  //             className="border-neutral-300 text-neutral-700 hover:bg-neutral-50"
  //           >
  //             Back to Students List
  //           </Button>
  //           <Button
  //             onClick={resetForm}
  //             variant="outline"
  //             className="border-green-300 text-green-700 hover:bg-green-50"
  //           >
  //             Create Another Student
  //           </Button>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );

  // Step titles

  const renderSuccessCard = () => {
    // Use createdUser data directly since it's the fresh user we just created
    const displayUser = createdUser || createdStudent?.user;
    const displayStudent = createdStudent;
    
    if (!displayUser && !displayStudent) {
      return <div>No data available</div>;
    }
    
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center mr-3">
            <CheckCircle className="text-success-600" size={20} />
          </div>
          <div>
            <h3 className="text-xl font-heading font-semibold text-success-800">Student Created Successfully! 🎉</h3>
            <p className="text-sm text-neutral-600">Student details and account information</p>
          </div>
        </div>

        <div className="bg-success-50 border border-success-200 rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-success-800 mb-4">Student Information</h4>
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
                  <p className="text-sm text-neutral-600">Admission Number</p>
                  <p className="font-medium">{displayStudent?.admission_number}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-600">Student ID</p>
                  <p className="font-medium">{displayStudent?.student_id}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-600">Class Level</p>
                  <p className="font-medium">
                    {displayStudent?.class_level_info?.name || 
                    (classLevels.find(cl => cl.id == studentData.class_level)?.name || 'Not set')}
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
                  <p className="text-sm text-neutral-600">Account Created</p>
                  <p className="font-medium">{new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-success-200">
            <div className="flex flex-col sm:flex-row gap-3">
              {displayStudent?.id && (
                <Button
                  onClick={() => navigate(`/students/${displayStudent.id}`)}
                  className="bg-primary-600 hover:bg-primary-700"
                >
                  View Student Profile
                </Button>
              )}
              <Button
                onClick={() => navigate('/students')}
                variant="outline"
                className="border-neutral-300 text-neutral-700 hover:bg-neutral-50"
              >
                Back to Students List
              </Button>
              <Button
                onClick={resetForm}
                variant="outline"
                className="border-green-300 text-green-700 hover:bg-green-50"
              >
                Create Another Student
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const stepTitles = ['Account', 'Academic', 'Previous School', 'Health', 'Emergency & Fees', 'Documents', 'Final Review'];

  // Main render
  if (!isAdmin) {
    return (
      <DashboardLayout title="Access Denied">
        <div className="bg-white rounded-xl shadow-soft p-8 text-center border border-neutral-100">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl font-bold">!</span>
          </div>
          <h1 className="text-2xl font-heading font-bold text-neutral-800 mb-4">Access Denied</h1>
          <p className="text-neutral-600 mb-6">You don't have permission to create students.</p>
          <Link to="/dashboard">
            <Button className="bg-secondary-600 hover:bg-secondary-700">Go to Dashboard</Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Create New Student">
      {/* Back Navigation */}
      <div className="mb-6">
        <Link to="/students" className="inline-flex items-center text-secondary-600 hover:text-secondary-700 transition-colors">
          <ArrowLeft size={18} className="mr-2" />
          Back to Students
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
      {success && !createdStudent && (
        <Alert
          type="success"
          message={success}
          className="mb-6"
          autoDismiss={false}
        />
      )}

      {/* Header - Only show if not viewing success card */}
      {!createdStudent && (
        <div className="bg-white rounded-xl shadow-soft p-6 mb-8 border border-neutral-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-2xl font-heading font-bold text-secondary-800">
                {createdUser ? 'Complete Student Profile' : 'Add New Student'}
              </h1>
              <p className="text-neutral-600 mt-1">
                {createdUser 
                  ? 'Complete student profile details'
                  : `Complete all ${totalSteps} steps to create a new student`
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
              <Link to="/students">
                <Button variant="outline" className="border-neutral-300 text-neutral-700 hover:bg-neutral-50">
                  Back to Students
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
        {createdStudent ? (
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
            {currentStep === 7 && renderStep7()}

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

export default StudentCreate;