/**
 * Student Registration Page - REDESIGNED
 * Special registration for students with all Nigerian school requirements
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/layout/AuthLayout';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import { register } from '../services/authService';
import { createStudent } from '../services/studentService';
import { handleApiError } from '../services/api';
import {
  getNigerianStates,
  getStreamOptions,
  getStudentCategoryOptions,
  getHouseOptions,
  getTransportationOptions,
  getBloodGroupOptions,
  getGenotypeOptions,
  validateNigerianPhone,
} from '../utils/studentUtils';
import { UserPlus, GraduationCap, Heart, Phone, ShieldCheck, ChevronRight, ChevronLeft, Home, Mail, Award } from 'lucide-react';

const StudentRegister = () => {
  const navigate = useNavigate();

  // Form state for user registration
  const [userData, setUserData] = useState({
    email: '',
    password: '',
    password2: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    gender: '',
    date_of_birth: '',
    address: '',
    city: '',
    state_of_origin: '',
    lga: '',
    nationality: 'Nigerian',
  });

  // Form state for student-specific data
  const [studentData, setStudentData] = useState({
    class_level: '',
    stream: 'none',
    admission_date: new Date().toISOString().split('T')[0],
    house: 'none',
    student_category: 'day',
    place_of_birth: '',
    home_language: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    emergency_contact_relationship: '',
    total_fee_amount: '',
    transportation_mode: 'parent_drop',
    bus_route: '',
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
    previous_school: '',
    previous_class: '',
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [fieldErrors, setFieldErrors] = useState({});
  const [declarationAccepted, setDeclarationAccepted] = useState(false);

  // Options for dropdowns
  const nigerianStates = getNigerianStates();
  const streamOptions = getStreamOptions();
  const studentCategoryOptions = getStudentCategoryOptions();
  const houseOptions = getHouseOptions();
  const transportationOptions = getTransportationOptions();
  const bloodGroupOptions = getBloodGroupOptions();
  const genotypeOptions = getGenotypeOptions();

  const totalSteps = 4;

  /**
   * Handle user data changes
   */
  const handleUserChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;
    
    setUserData(prev => ({
      ...prev,
      [name]: inputValue,
    }));
    
    // Clear errors when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  /**
   * Handle student data changes
   */
  const handleStudentChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;
    
    setStudentData(prev => ({
      ...prev,
      [name]: inputValue,
    }));
    
    // Clear errors when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  /**
   * Validate step 1 (Personal Information)
   */
  const validateStep1 = () => {
    const errors = {};

    // Required fields
    if (!userData.first_name.trim()) errors.first_name = 'First name is required';
    if (!userData.last_name.trim()) errors.last_name = 'Last name is required';
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!userData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(userData.email)) {
      errors.email = 'Invalid email format';
    }

    // Phone validation
    if (!userData.phone_number.trim()) {
      errors.phone_number = 'Phone number is required';
    } else if (!validateNigerianPhone(userData.phone_number)) {
      errors.phone_number = 'Phone must start with 0 or +234 and be 11 digits';
    }

    // Date of birth validation
    if (userData.date_of_birth) {
      const dob = new Date(userData.date_of_birth);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      
      if (age < 3) {
        errors.date_of_birth = 'Student must be at least 3 years old';
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Validate step 2 (Academic Information)
   */
  const validateStep2 = () => {
    const errors = {};

    // Required fields
    if (!studentData.class_level) errors.class_level = 'Class level is required';
    if (!studentData.admission_date) errors.admission_date = 'Admission date is required';

    // Allergy details if has_allergies is true
    if (studentData.has_allergies && !studentData.allergy_details.trim()) {
      errors.allergy_details = 'Please specify allergy details';
    }

    // Learning difficulties details
    if (studentData.has_learning_difficulties && !studentData.learning_difficulties_details.trim()) {
      errors.learning_difficulties_details = 'Please elaborate on learning difficulties';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Validate step 3 (Parent & Emergency Contact)
   */
  const validateStep3 = () => {
    const errors = {};

    // Emergency contact validation
    if (studentData.emergency_contact_name && !studentData.emergency_contact_phone) {
      errors.emergency_contact_phone = 'Emergency contact phone is required';
    }

    if (studentData.emergency_contact_phone && !validateNigerianPhone(studentData.emergency_contact_phone)) {
      errors.emergency_contact_phone = 'Invalid phone number format';
    }

    // Family doctor phone validation
    if (studentData.family_doctor_phone && !validateNigerianPhone(studentData.family_doctor_phone)) {
      errors.family_doctor_phone = 'Invalid phone number format';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Validate all data before submission
   */
  const validateAllData = () => {
    const errors = {};

    // Password validation
    if (!userData.password) errors.password = 'Password is required';
    if (userData.password && userData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    if (userData.password !== userData.password2) {
      errors.password2 = 'Passwords do not match';
    }

    // Declaration check
    if (!declarationAccepted) {
      errors.declaration = 'You must accept the declaration to proceed';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Handle next step
   */
  const handleNext = () => {
    let isValid = false;
    
    switch (currentStep) {
      case 1:
        isValid = validateStep1();
        break;
      case 2:
        isValid = validateStep2();
        break;
      case 3:
        isValid = validateStep3();
        break;
      default:
        isValid = true;
    }

    if (isValid) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
      setError('');
    }
  };

  /**
   * Handle previous step
   */
  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setError('');
    setSuccess('');
    
    // Validate all data
    if (!validateStep1() || !validateStep2() || !validateStep3() || !validateAllData()) {
      setError('Please fix all errors in the form');
      return;
    }

    try {
      setLoading(true);

      // Step 1: Create user account
      const registrationData = {
        ...userData,
        role: 'student', // Force student role
        phone_number: userData.phone_number.replace('+234', '0'), // Format for backend
      };

      // Register user
      const authResponse = await register(registrationData);
      
      if (!authResponse || !authResponse.user) {
        throw new Error('Registration failed. Please try again.');
      }

      // Step 2: Create student profile
      const studentProfileData = {
        user_id: authResponse.user.id,
        ...studentData,
        class_level: parseInt(studentData.class_level),
        total_fee_amount: studentData.total_fee_amount ? parseFloat(studentData.total_fee_amount) : 0,
        emergency_contact_phone: studentData.emergency_contact_phone?.replace('+234', '0'),
        family_doctor_phone: studentData.family_doctor_phone?.replace('+234', '0'),
        state_of_origin: userData.state_of_origin.toLowerCase().replace(/ /g, '_'),
      };

      // Create student profile
      const studentResponse = await createStudent(studentProfileData);

      setSuccess('Registration successful! Your student account has been created. Redirecting to login...');

      // Redirect to login after delay
      setTimeout(() => {
        navigate('/login');
      }, 3000);

    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Render step 1: Personal Information - REDESIGNED
   */
  const renderStep1 = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mr-4">
          <UserPlus className="text-primary-600" size={24} />
        </div>
        <div>
          <h3 className="text-xl font-heading font-semibold text-secondary-800">Step 1: Personal Information</h3>
          <p className="text-sm text-neutral-600">Tell us about yourself</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="first_name"
            value={userData.first_name}
            onChange={handleUserChange}
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
            onChange={handleUserChange}
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

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Email Address <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          name="email"
          value={userData.email}
          onChange={handleUserChange}
          placeholder="john.doe@example.com"
          required
          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200 ${
            fieldErrors.email ? 'border-red-500' : 'border-neutral-300'
          }`}
          disabled={loading}
        />
        {fieldErrors.email && (
          <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
        )}
        <p className="mt-1 text-xs text-neutral-500">This will be your login email</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            name="phone_number"
            value={userData.phone_number}
            onChange={handleUserChange}
            placeholder="08012345678 or +2348012345678"
            required
            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200 ${
              fieldErrors.phone_number ? 'border-red-500' : 'border-neutral-300'
            }`}
            disabled={loading}
          />
          {fieldErrors.phone_number && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.phone_number}</p>
          )}
          <p className="mt-1 text-xs text-neutral-500">Format: 08012345678 or +2348012345678</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">Date of Birth</label>
          <input
            type="date"
            name="date_of_birth"
            value={userData.date_of_birth}
            onChange={handleUserChange}
            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200 ${
              fieldErrors.date_of_birth ? 'border-red-500' : 'border-neutral-300'
            }`}
            disabled={loading}
          />
          {fieldErrors.date_of_birth && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.date_of_birth}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">Gender</label>
          <select
            name="gender"
            value={userData.gender}
            onChange={handleUserChange}
            className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200"
            disabled={loading}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">Nationality</label>
          <select
            name="nationality"
            value={userData.nationality}
            onChange={handleUserChange}
            className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200"
            disabled={loading}
          >
            <option value="Nigerian">Nigerian</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">Home Address</label>
        <textarea
          name="address"
          value={userData.address}
          onChange={handleUserChange}
          placeholder="123 Main Street, City"
          rows={2}
          className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200"
          disabled={loading}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">City</label>
          <input
            type="text"
            name="city"
            value={userData.city}
            onChange={handleUserChange}
            placeholder="Lagos"
            className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">State of Origin</label>
          <select
            name="state_of_origin"
            value={userData.state_of_origin}
            onChange={handleUserChange}
            className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200"
            disabled={loading}
          >
            {nigerianStates.map((state) => (
              <option key={state.value} value={state.value}>
                {state.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">Local Government Area (LGA)</label>
        <input
          type="text"
          name="lga"
          value={userData.lga}
          onChange={handleUserChange}
          placeholder="e.g., Ikeja"
          className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200"
          disabled={loading}
        />
      </div>
    </div>
  );

  /**
   * Render step 2: Academic Information - REDESIGNED
   */
  const renderStep2 = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-secondary-100 rounded-xl flex items-center justify-center mr-4">
          <GraduationCap className="text-secondary-600" size={24} />
        </div>
        <div>
          <h3 className="text-xl font-heading font-semibold text-secondary-800">Step 2: Academic Information</h3>
          <p className="text-sm text-neutral-600">School and class details</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Class Level <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="class_level"
            value={studentData.class_level}
            onChange={handleStudentChange}
            placeholder="e.g., 1 for Primary 1"
            required
            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200 ${
              fieldErrors.class_level ? 'border-red-500' : 'border-neutral-300'
            }`}
            disabled={loading}
          />
          {fieldErrors.class_level && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.class_level}</p>
          )}
          <p className="mt-1 text-xs text-neutral-500">Enter class level ID from school</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">Stream</label>
          <select
            name="stream"
            value={studentData.stream}
            onChange={handleStudentChange}
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
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Admission Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="admission_date"
            value={studentData.admission_date}
            onChange={handleStudentChange}
            required
            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200 ${
              fieldErrors.admission_date ? 'border-red-500' : 'border-neutral-300'
            }`}
            disabled={loading}
          />
          {fieldErrors.admission_date && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.admission_date}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">Student Category</label>
          <select
            name="student_category"
            value={studentData.student_category}
            onChange={handleStudentChange}
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
          <label className="block text-sm font-medium text-neutral-700 mb-2">Place of Birth</label>
          <input
            type="text"
            name="place_of_birth"
            value={studentData.place_of_birth}
            onChange={handleStudentChange}
            placeholder="City, State"
            className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">Home Language</label>
          <input
            type="text"
            name="home_language"
            value={studentData.home_language}
            onChange={handleStudentChange}
            placeholder="e.g., Yoruba, Igbo, Hausa, English"
            className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200"
            disabled={loading}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">House</label>
          <select
            name="house"
            value={studentData.house}
            onChange={handleStudentChange}
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
            onChange={handleStudentChange}
            className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200"
            disabled={loading}
          >
            {transportationOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {studentData.transportation_mode === 'school_bus' && (
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">Bus Route</label>
          <input
            type="text"
            name="bus_route"
            value={studentData.bus_route}
            onChange={handleStudentChange}
            placeholder="e.g., Route A - Ikeja"
            className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200"
            disabled={loading}
          />
        </div>
      )}

      <div className="border-t border-neutral-200 pt-6">
        <h4 className="font-medium text-neutral-700 mb-4 flex items-center">
          <span className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
            <span className="text-primary-600 font-medium">S</span>
          </span>
          Previous School Information
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Previous School</label>
            <input
              type="text"
              name="previous_school"
              value={studentData.previous_school}
              onChange={handleStudentChange}
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
              onChange={handleStudentChange}
              placeholder="e.g., Primary 3"
              className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200"
              disabled={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );

  /**
   * Render step 3: Health & Emergency Information - REDESIGNED
   */
  const renderStep3 = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mr-4">
          <Heart className="text-red-600" size={24} />
        </div>
        <div>
          <h3 className="text-xl font-heading font-semibold text-secondary-800">Step 3: Health & Emergency Information</h3>
          <p className="text-sm text-neutral-600">Medical and contact details</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">Blood Group</label>
          <select
            name="blood_group"
            value={studentData.blood_group}
            onChange={handleStudentChange}
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
            onChange={handleStudentChange}
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
            onChange={handleStudentChange}
            className="h-5 w-5 text-secondary-600 rounded focus:ring-secondary-500"
            disabled={loading}
          />
          <label htmlFor="has_allergies" className="ml-3 text-sm text-neutral-700">
            Does the child have any allergies?
          </label>
        </div>

        {studentData.has_allergies && (
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Allergy Details <span className="text-red-500">*</span>
            </label>
            <textarea
              name="allergy_details"
              value={studentData.allergy_details}
              onChange={handleStudentChange}
              placeholder="Please specify all allergies and reactions"
              rows={2}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200 ${
                fieldErrors.allergy_details ? 'border-red-500' : 'border-neutral-300'
              }`}
              disabled={loading}
            />
            {fieldErrors.allergy_details && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.allergy_details}</p>
            )}
          </div>
        )}

        <div className="flex items-center">
          <input
            type="checkbox"
            id="has_learning_difficulties"
            name="has_learning_difficulties"
            checked={studentData.has_learning_difficulties}
            onChange={handleStudentChange}
            className="h-5 w-5 text-secondary-600 rounded focus:ring-secondary-500"
            disabled={loading}
          />
          <label htmlFor="has_learning_difficulties" className="ml-3 text-sm text-neutral-700">
            Does the child have any learning difficulties?
          </label>
        </div>

        {studentData.has_learning_difficulties && (
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Learning Difficulties Details <span className="text-red-500">*</span>
            </label>
            <textarea
              name="learning_difficulties_details"
              value={studentData.learning_difficulties_details}
              onChange={handleStudentChange}
              placeholder="Please elaborate on learning difficulties or developmental needs"
              rows={2}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200 ${
                fieldErrors.learning_difficulties_details ? 'border-red-500' : 'border-neutral-300'
              }`}
              disabled={loading}
            />
            {fieldErrors.learning_difficulties_details && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.learning_difficulties_details}</p>
            )}
          </div>
        )}

        <div className="flex items-center">
          <input
            type="checkbox"
            id="has_received_vaccinations"
            name="has_received_vaccinations"
            checked={studentData.has_received_vaccinations}
            onChange={handleStudentChange}
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
          onChange={handleStudentChange}
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
            onChange={handleStudentChange}
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
            onChange={handleStudentChange}
            placeholder="08012345678"
            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200 ${
              fieldErrors.family_doctor_phone ? 'border-red-500' : 'border-neutral-300'
            }`}
            disabled={loading}
          />
          {fieldErrors.family_doctor_phone && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.family_doctor_phone}</p>
          )}
        </div>
      </div>

      <div className="border-t border-neutral-200 pt-6">
        <h4 className="font-medium text-neutral-700 mb-4 flex items-center">
          <span className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
            <Phone className="text-primary-600" size={16} />
          </span>
          Emergency Contact
        </h4>
        
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Emergency Contact Name</label>
            <input
              type="text"
              name="emergency_contact_name"
              value={studentData.emergency_contact_name}
              onChange={handleStudentChange}
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
                onChange={handleStudentChange}
                placeholder="08012345678"
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200 ${
                  fieldErrors.emergency_contact_phone ? 'border-red-500' : 'border-neutral-300'
                }`}
                disabled={loading}
              />
              {fieldErrors.emergency_contact_phone && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.emergency_contact_phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Relationship to Student</label>
              <input
                type="text"
                name="emergency_contact_relationship"
                value={studentData.emergency_contact_relationship}
                onChange={handleStudentChange}
                placeholder="e.g., Uncle, Aunt, Family Friend"
                className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200"
                disabled={loading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  /**
   * Render step 4: Final Review & Declaration - REDESIGNED
   */
  const renderStep4 = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center mr-4">
          <ShieldCheck className="text-accent-600" size={24} />
        </div>
        <div>
          <h3 className="text-xl font-heading font-semibold text-secondary-800">Step 4: Final Review & Declaration</h3>
          <p className="text-sm text-neutral-600">Review information and submit</p>
        </div>
      </div>
      
      <div className="bg-accent-50 border border-accent-100 rounded-xl p-6 mb-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center">
              <span className="text-accent-600 font-bold">!</span>
            </div>
          </div>
          <div className="ml-4">
            <h4 className="text-lg font-medium text-accent-800">Important Information</h4>
            <div className="mt-2 text-sm text-accent-700">
              <p className="mb-2">Please review all information carefully before submission.</p>
              <p>Once submitted, you'll need to provide the following documents to complete registration:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Birth Certificate</li>
                <li>Student Photograph</li>
                <li>Immunization Record</li>
                <li>Previous School Report</li>
                <li>Parent/Guardian ID Copy</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Review Section */}
      <div className="space-y-8">
        <div>
          <h4 className="font-medium text-neutral-700 mb-4 flex items-center">
            <span className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
              <UserPlus className="text-primary-600" size={16} />
            </span>
            Personal Information
          </h4>
          <div className="bg-neutral-50 rounded-xl p-5 border border-neutral-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-neutral-500 mb-1">Name</p>
                <p className="font-medium text-neutral-800">{userData.first_name} {userData.last_name}</p>
              </div>
              <div>
                <p className="text-neutral-500 mb-1">Email</p>
                <p className="font-medium text-neutral-800">{userData.email}</p>
              </div>
              <div>
                <p className="text-neutral-500 mb-1">Phone</p>
                <p className="font-medium text-neutral-800">{userData.phone_number}</p>
              </div>
              <div>
                <p className="text-neutral-500 mb-1">Date of Birth</p>
                <p className="font-medium text-neutral-800">{userData.date_of_birth || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-neutral-500 mb-1">Gender</p>
                <p className="font-medium text-neutral-800">{userData.gender || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-neutral-500 mb-1">State of Origin</p>
                <p className="font-medium text-neutral-800">{userData.state_of_origin || 'Not provided'}</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-neutral-700 mb-4 flex items-center">
            <span className="w-8 h-8 bg-secondary-100 rounded-lg flex items-center justify-center mr-3">
              <GraduationCap className="text-secondary-600" size={16} />
            </span>
            Academic Information
          </h4>
          <div className="bg-neutral-50 rounded-xl p-5 border border-neutral-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-neutral-500 mb-1">Class Level ID</p>
                <p className="font-medium text-neutral-800">{studentData.class_level || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-neutral-500 mb-1">Stream</p>
                <p className="font-medium text-neutral-800">{streamOptions.find(s => s.value === studentData.stream)?.label || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-neutral-500 mb-1">Admission Date</p>
                <p className="font-medium text-neutral-800">{studentData.admission_date || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-neutral-500 mb-1">Category</p>
                <p className="font-medium text-neutral-800">{studentCategoryOptions.find(s => s.value === studentData.student_category)?.label || 'Not provided'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Fee Information */}
        <div>
          <h4 className="font-medium text-neutral-700 mb-4 flex items-center">
            <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
              <span className="text-green-600 font-medium">£</span>
            </span>
            Fee Information
          </h4>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Total Fee Amount (₦)</label>
            <input
              type="number"
              name="total_fee_amount"
              value={studentData.total_fee_amount}
              onChange={handleStudentChange}
              placeholder="0.00"
              min="0"
              step="0.01"
              className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200"
              disabled={loading}
            />
            <p className="mt-1 text-xs text-neutral-500">Leave as 0 if fee will be set later</p>
          </div>
        </div>

        {/* Password Fields */}
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="password"
              value={userData.password}
              onChange={handleUserChange}
              placeholder="Minimum 8 characters"
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
              onChange={handleUserChange}
              placeholder="Re-enter your password"
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

        {/* Declaration */}
        <div className="border-t border-neutral-200 pt-6">
          <div className="flex items-start">
            <div className="flex items-center h-5 mt-0.5">
              <input
                id="declaration"
                name="declaration"
                type="checkbox"
                checked={declarationAccepted}
                onChange={(e) => setDeclarationAccepted(e.target.checked)}
                className="h-5 w-5 text-secondary-600 rounded focus:ring-secondary-500"
                disabled={loading}
              />
            </div>
            <div className="ml-4">
              <label htmlFor="declaration" className="block text-sm font-medium text-neutral-700 mb-2">
                Declaration <span className="text-red-500">*</span>
              </label>
              <p className="text-sm text-neutral-600">
                I hereby declare that all information provided in this registration form is true, accurate, and complete to the best of my knowledge. I understand that providing false information may lead to cancellation of registration.
              </p>
              {fieldErrors.declaration && (
                <p className="mt-2 text-sm text-red-600">{fieldErrors.declaration}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Step titles
  const stepTitles = ['Personal', 'Academic', 'Health', 'Review'];

  return (
    <AuthLayout
      title="Student Registration"
      subtitle="Join Concord Tutor School as a student"
    >
      {/* Success Alert */}
      {success && (
        <Alert
          type="success"
          message={success}
          className="mb-6"
          autoDismiss={false}
        />
      )}

      {/* Error Alert */}
      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => setError('')}
          className="mb-6"
        />
      )}

      {/* Progress Indicator */}
      <div className="mb-8">
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

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-soft p-6 border border-neutral-100">
        {/* Step Content */}
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-10 pt-6 border-t border-neutral-200">
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
            
            {currentStep < totalSteps ? (
              <Button
                type="button"
                onClick={handleNext}
                disabled={loading}
                className="bg-secondary-600 hover:bg-secondary-700 flex items-center"
              >
                Next Step
                <ChevronRight size={18} className="ml-2" />
              </Button>
            ) : (
              <Button
                type="submit"
                loading={loading}
                disabled={loading}
                className="bg-primary-600 hover:bg-primary-700 flex items-center"
              >
                {loading ? 'Creating Account...' : 'Complete Registration'}
              </Button>
            )}
          </div>
        </div>
      </form>

      {/* Login Link */}
      <div className="mt-8 text-center">
        <p className="text-sm text-neutral-600">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-secondary-600 hover:text-secondary-700 font-medium transition-colors"
          >
            Login here
          </Link>
        </p>
      </div>

      {/* Back to Home Link */}
      <div className="mt-4 text-center">
        <Link
          to="/"
          className="text-sm text-neutral-500 hover:text-neutral-700 transition-colors inline-flex items-center"
        >
          <Home size={16} className="mr-2" />
          Back to Home
        </Link>
      </div>
    </AuthLayout>
  );
};

export default StudentRegister;