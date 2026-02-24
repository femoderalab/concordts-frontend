// src/pages/ParentCreate.jsx - COMPLETELY FIXED VERSION
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import useAuth from '../hooks/useAuth';
import { createParent } from '../services/parentService';
import { createUser } from '../services/userService';
import { handleApiError } from '../services/api';
import {
  getParentTypeOptions,
  getMaritalStatusOptions,
  getCommunicationOptions,
  validateNigerianPhone,
  validateEmail,
  formatPhoneNumber,
} from '../utils/parentUtils';

const ParentCreate = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Check if user is admin
  const isAdmin = user?.role === 'head' || user?.role === 'principal' || user?.role === 'vice_principal' || user?.role === 'secretary' || user?.is_staff;
  
  // Redirect if not admin
  useEffect(() => {
    if (!isAdmin) {
      navigate('/dashboard');
    }
  }, [isAdmin, navigate]);
  
  // User data
  const [userData, setUserData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    password: '',
    password2: '',
    gender: 'male',
    address: '',
    city: '',
    state_of_origin: 'lagos',
    lga: '',
    nationality: 'Nigerian',
    date_of_birth: '',
  });
  
  // Parent data
  const [parentData, setParentData] = useState({
    parent_type: 'father',
    occupation: '',
    employer: '',
    employer_address: '',
    office_phone: '',
    marital_status: 'married',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    emergency_contact_relationship: '',
    preferred_communication: 'whatsapp',
    receive_sms_alerts: true,
    receive_email_alerts: true,
    bank_name: '',
    account_name: '',
    account_number: '',
    is_pta_member: false,
    pta_position: '',
    pta_committee: '',
    declaration_accepted: true,
    is_active: true,
    is_verified: false,
  });
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [passwordStrength, setPasswordStrength] = useState('');
  
  const totalSteps = 3;

  // Options
  const parentTypeOptions = getParentTypeOptions();
  const maritalStatusOptions = getMaritalStatusOptions();
  const communicationOptions = getCommunicationOptions();

  // Generate date of birth (default to 35 years ago)
  const generateDefaultDOB = () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 35);
    return date.toISOString().split('T')[0];
  };

  // Check password strength
  const checkPasswordStrength = (password) => {
    if (!password) return '';
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
    return strengthLabels[strength];
  };

  // Initialize default values
  useEffect(() => {
    if (!userData.date_of_birth) {
      setUserData(prev => ({ ...prev, date_of_birth: generateDefaultDOB() }));
    }
  }, []);

  // Handle input changes
  const handleUserChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;
    
    setUserData(prev => ({ ...prev, [name]: inputValue }));
    
    // Clear errors for this field
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Check password strength
    if (name === 'password') {
      setPasswordStrength(checkPasswordStrength(value));
    }
  };

  const handleParentChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;
    
    setParentData(prev => ({ ...prev, [name]: inputValue }));
    
    // Clear errors for this field
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Navigation
  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(prev => prev + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Validation
  const validateStep = (step) => {
    const errors = {};
    
    switch (step) {
      case 1: // Personal Information
        if (!userData.first_name.trim()) errors.first_name = 'First name is required';
        if (!userData.last_name.trim()) errors.last_name = 'Last name is required';
        if (!userData.email.trim()) errors.email = 'Email is required';
        if (!userData.phone_number.trim()) errors.phone_number = 'Phone number is required';
        if (!userData.date_of_birth) errors.date_of_birth = 'Date of birth is required';
        
        if (userData.email && !validateEmail(userData.email)) {
          errors.email = 'Invalid email format';
        }
        
        if (userData.phone_number && !validateNigerianPhone(userData.phone_number)) {
          errors.phone_number = 'Phone must start with 0 and be 11 digits';
        }
        
        if (userData.date_of_birth) {
          const dob = new Date(userData.date_of_birth);
          const today = new Date();
          const age = today.getFullYear() - dob.getFullYear();
          
          if (age < 18) {
            errors.date_of_birth = 'Parent must be at least 18 years old';
          }
        }
        break;
        
      case 2: // Parent Information
        if (!parentData.parent_type) errors.parent_type = 'Parent type is required';
        if (!parentData.marital_status) errors.marital_status = 'Marital status is required';
        break;
        
      case 3: // Review - Password validation
        if (!userData.password) errors.password = 'Password is required';
        if (!userData.password2) errors.password2 = 'Confirm password is required';
        
        if (userData.password) {
          if (userData.password.length < 8) {
            errors.password = 'Password must be at least 8 characters';
          } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(userData.password)) {
            errors.password = 'Password must contain uppercase, lowercase and numbers';
          }
        }
        
        if (userData.password !== userData.password2) {
          errors.password2 = 'Passwords do not match';
        }
        break;
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Main submit handler - COMPLETELY FIXED
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prevent double submission
    if (loading) return;
    
    setError('');
    setSuccess('');
    setFieldErrors({});

    try {
      setLoading(true);
      
      // Validate all steps before proceeding
      for (let step = 1; step <= totalSteps; step++) {
        if (!validateStep(step)) {
          setCurrentStep(step);
          setLoading(false);
          return;
        }
      }
      
      // Format phone numbers
      const formattedPhone = formatPhoneNumber(userData.phone_number).replace(/[\s+]/g, '');
      const formattedOfficePhone = parentData.office_phone ? 
        formatPhoneNumber(parentData.office_phone).replace(/[\s+]/g, '') : '';
      const formattedEmergencyPhone = parentData.emergency_contact_phone ? 
        formatPhoneNumber(parentData.emergency_contact_phone).replace(/[\s+]/g, '') : '';
      
      // Step 1: Create user account
      const userPayload = {
        first_name: userData.first_name.trim(),
        last_name: userData.last_name.trim(),
        email: userData.email.trim(),
        phone_number: formattedPhone,
        password: userData.password,
        password2: userData.password2,
        gender: userData.gender,
        date_of_birth: userData.date_of_birth,
        address: userData.address?.trim() || '',
        city: userData.city?.trim() || '',
        state_of_origin: userData.state_of_origin,
        lga: userData.lga?.trim() || '',
        nationality: userData.nationality,
        role: 'parent', // This is important - must be 'parent'
      };
      
      console.log('Creating user:', userPayload);
      
      let userResponse;
      try {
        userResponse = await createUser(userPayload);
        console.log('User creation response:', userResponse);
      } catch (userError) {
        console.error('User creation failed:', userError);
        
        // Handle specific errors
        if (userError.response?.data?.email?.includes('already exists')) {
          setError('A user with this email already exists. Please use a different email address.');
          return;
        }
        
        if (userError.response?.data) {
          const apiErrorData = userError.response.data;
          let errorMessage = 'Failed to create user account:\n';
          
          if (typeof apiErrorData === 'object') {
            Object.entries(apiErrorData).forEach(([field, errors]) => {
              if (Array.isArray(errors)) {
                errors.forEach(error => {
                  errorMessage += `${field}: ${error}\n`;
                });
              } else if (typeof errors === 'string') {
                errorMessage += `${field}: ${errors}\n`;
              }
            });
          } else if (typeof apiErrorData === 'string') {
            errorMessage = apiErrorData;
          }
          
          setError(errorMessage.trim());
        } else {
          setError(handleApiError(userError) || 'Failed to create user account. Please try again.');
        }
        return;
      }
      
      // Extract user ID from response
      let userId;
      if (userResponse.user && userResponse.user.id) {
        userId = userResponse.user.id;
      } else if (userResponse.id) {
        userId = userResponse.id;
      } else if (userResponse.data && userResponse.data.id) {
        userId = userResponse.data.id;
      } else {
        console.error('Could not extract user ID from response:', userResponse);
        throw new Error('User created but could not get user ID');
      }
      
      console.log('User ID for parent creation:', userId);
      
      // Step 2: Create parent profile
      const parentPayload = {
        user_id: userId,
        parent_type: parentData.parent_type,
        marital_status: parentData.marital_status,
        preferred_communication: parentData.preferred_communication,
        receive_sms_alerts: parentData.receive_sms_alerts,
        receive_email_alerts: parentData.receive_email_alerts,
        declaration_accepted: parentData.declaration_accepted,
        is_active: parentData.is_active,
        is_verified: parentData.is_verified,
        is_pta_member: parentData.is_pta_member,
      };
      
      // Add optional fields only if they have values
      if (parentData.occupation.trim()) parentPayload.occupation = parentData.occupation.trim();
      if (parentData.employer.trim()) parentPayload.employer = parentData.employer.trim();
      if (parentData.employer_address.trim()) parentPayload.employer_address = parentData.employer_address.trim();
      if (formattedOfficePhone) parentPayload.office_phone = formattedOfficePhone;
      if (parentData.emergency_contact_name.trim()) parentPayload.emergency_contact_name = parentData.emergency_contact_name.trim();
      if (formattedEmergencyPhone) parentPayload.emergency_contact_phone = formattedEmergencyPhone;
      if (parentData.emergency_contact_relationship.trim()) parentPayload.emergency_contact_relationship = parentData.emergency_contact_relationship.trim();
      if (parentData.bank_name.trim()) parentPayload.bank_name = parentData.bank_name.trim();
      if (parentData.account_name.trim()) parentPayload.account_name = parentData.account_name.trim();
      if (parentData.account_number.trim()) parentPayload.account_number = parentData.account_number.trim();
      if (parentData.pta_position.trim()) parentPayload.pta_position = parentData.pta_position.trim();
      if (parentData.pta_committee.trim()) parentPayload.pta_committee = parentData.pta_committee.trim();
      
      console.log('Creating parent profile:', parentPayload);
      
      try {
        const parentResponse = await createParent(parentPayload);
        console.log('Parent creation response:', parentResponse);

        // Get parent ID from response
        const parentId = parentResponse.parent?.parent_id || 
                        parentResponse.parent_id || 
                        parentResponse.id || 
                        'Generated by system';

        const successMessage = `✅ Parent created successfully!\n\n` +
          `Parent Name: ${userData.first_name} ${userData.last_name}\n` +
          `Email: ${userData.email}\n` +
          `Phone: ${userData.phone_number}\n` +
          `Parent Type: ${parentData.parent_type}\n` +
          `Parent ID: ${parentId}\n\n` +
          `You will be redirected to the parents list in 3 seconds...`;
        
        setSuccess(successMessage);
        
        // Redirect after 3 seconds
        setTimeout(() => {
          navigate('/parents');
        }, 3000);
        
      } catch (parentError) {
        console.error('Parent creation failed:', parentError);
        
        // Handle specific "already a parent" error
        if (parentError.response?.data?.error?.includes('already has a parent profile') || 
            parentError.response?.data?.detail?.includes('already registered as a parent')) {
          
          setError('❌ This user is already registered as a parent. Please use a different email address.');
          
        } else if (parentError.response?.data) {
          const apiErrorData = parentError.response.data;
          let errorMessage = '❌ Failed to create parent profile:\n';
          
          if (typeof apiErrorData === 'object') {
            Object.entries(apiErrorData).forEach(([field, errors]) => {
              if (Array.isArray(errors)) {
                errors.forEach(error => {
                  errorMessage += `${field}: ${error}\n`;
                });
              } else if (typeof errors === 'string') {
                errorMessage += `${field}: ${errors}\n`;
              }
            });
          } else if (typeof apiErrorData === 'string') {
            errorMessage = apiErrorData;
          }
          
          setError(errorMessage.trim());
        } else {
          setError(handleApiError(parentError) || 'Failed to create parent profile. Please try again.');
        }
      }

    } catch (err) {
      console.error('Unexpected error in parent creation process:', err);
      setError(`❌ An unexpected error occurred: ${err.message || 'Please try again.'}`);
    } finally {
      setLoading(false);
    }
  };

  // Render step 1
  const renderStep1 = () => (
    <div className="space-y-4 animate-fade-in">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Step 1: Personal Information</h3>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <div className="flex items-center">
          <svg className="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <span className="text-sm text-blue-700">Fields marked with * are required. Date of birth must be at least 18 years ago.</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="First Name *"
          name="first_name"
          value={userData.first_name}
          onChange={handleUserChange}
          placeholder="John"
          required
          error={fieldErrors.first_name}
          disabled={loading}
        />
        
        <Input
          label="Last Name *"
          name="last_name"
          value={userData.last_name}
          onChange={handleUserChange}
          placeholder="Doe"
          required
          error={fieldErrors.last_name}
          disabled={loading}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Email Address *"
          name="email"
          type="email"
          value={userData.email}
          onChange={handleUserChange}
          placeholder="john.doe@example.com"
          required
          error={fieldErrors.email}
          disabled={loading}
          helperText="This will be used for login and communication"
        />

        <Input
          label="Phone Number *"
          name="phone_number"
          type="tel"
          value={userData.phone_number}
          onChange={handleUserChange}
          placeholder="08012345678"
          required
          error={fieldErrors.phone_number}
          disabled={loading}
          helperText="Must start with 0 and be 11 digits"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date of Birth *
          </label>
          <input
            type="date"
            name="date_of_birth"
            value={userData.date_of_birth}
            onChange={handleUserChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              fieldErrors.date_of_birth ? 'border-red-500' : 'border-gray-300'
            }`}
            required
            disabled={loading}
            max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
          />
          {fieldErrors.date_of_birth && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.date_of_birth}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">Parent must be at least 18 years old</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
          <select
            name="gender"
            value={userData.gender}
            onChange={handleUserChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
            required
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
      </div>

      <Input
        label="Address"
        name="address"
        value={userData.address}
        onChange={handleUserChange}
        placeholder="123 Main Street, Ikeja"
        disabled={loading}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="City"
          name="city"
          value={userData.city}
          onChange={handleUserChange}
          placeholder="Lagos"
          disabled={loading}
        />

        <Input
          label="LGA (Local Government Area)"
          name="lga"
          value={userData.lga}
          onChange={handleUserChange}
          placeholder="Ikeja"
          disabled={loading}
        />
      </div>
    </div>
  );

  // Render step 2
  const renderStep2 = () => (
    <div className="space-y-4 animate-fade-in">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Step 2: Parent Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Parent Type *</label>
          <select
            name="parent_type"
            value={parentData.parent_type}
            onChange={handleParentChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              fieldErrors.parent_type ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={loading}
            required
          >
            {parentTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {fieldErrors.parent_type && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.parent_type}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Marital Status *</label>
          <select
            name="marital_status"
            value={parentData.marital_status}
            onChange={handleParentChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              fieldErrors.marital_status ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={loading}
            required
          >
            {maritalStatusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {fieldErrors.marital_status && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.marital_status}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Occupation"
          name="occupation"
          value={parentData.occupation}
          onChange={handleParentChange}
          placeholder="e.g., Engineer, Business Owner"
          disabled={loading}
        />

        <Input
          label="Employer"
          name="employer"
          value={parentData.employer}
          onChange={handleParentChange}
          placeholder="Company/Organization name"
          disabled={loading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Employer Address
        </label>
        <textarea
          name="employer_address"
          value={parentData.employer_address}
          onChange={handleParentChange}
          placeholder="Company address"
          rows="3"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={loading}
        />
      </div>

      <Input
        label="Office Phone"
        name="office_phone"
        type="tel"
        value={parentData.office_phone}
        onChange={handleParentChange}
        placeholder="08012345678"
        disabled={loading}
        helperText="Optional"
      />

      <div className="border-t border-gray-200 pt-4">
        <h4 className="font-medium text-gray-700 mb-3">Emergency Contact</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Emergency Contact Name"
            name="emergency_contact_name"
            value={parentData.emergency_contact_name}
            onChange={handleParentChange}
            placeholder="Full name"
            disabled={loading}
          />

          <Input
            label="Emergency Contact Phone"
            name="emergency_contact_phone"
            type="tel"
            value={parentData.emergency_contact_phone}
            onChange={handleParentChange}
            placeholder="08012345678"
            disabled={loading}
          />
        </div>

        <Input
          label="Relationship"
          name="emergency_contact_relationship"
          value={parentData.emergency_contact_relationship}
          onChange={handleParentChange}
          placeholder="e.g., Brother, Sister, Friend"
          disabled={loading}
        />
      </div>

      <div className="border-t border-gray-200 pt-4">
        <h4 className="font-medium text-gray-700 mb-3">Communication Preferences</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Method *</label>
            <select
              name="preferred_communication"
              value={parentData.preferred_communication}
              onChange={handleParentChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
              required
            >
              {communicationOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="receive_sms_alerts"
                name="receive_sms_alerts"
                checked={parentData.receive_sms_alerts}
                onChange={handleParentChange}
                className="h-4 w-4 text-blue-600 rounded"
                disabled={loading}
              />
              <label htmlFor="receive_sms_alerts" className="ml-2 text-sm text-gray-700">
                Receive SMS alerts
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="receive_email_alerts"
                name="receive_email_alerts"
                checked={parentData.receive_email_alerts}
                onChange={handleParentChange}
                className="h-4 w-4 text-blue-600 rounded"
                disabled={loading}
              />
              <label htmlFor="receive_email_alerts" className="ml-2 text-sm text-gray-700">
                Receive email alerts
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render step 3
  const renderStep3 = () => (
    <div className="space-y-4 animate-fade-in">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Step 3: Account Security & Review</h3>
      
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h4 className="text-sm font-medium text-yellow-800">Review Information</h4>
            <div className="mt-2 text-sm text-yellow-700">
              <p>Please review the information below before creating the parent account:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li><strong>Name:</strong> {userData.first_name} {userData.last_name}</li>
                <li><strong>Email:</strong> {userData.email}</li>
                <li><strong>Phone:</strong> {userData.phone_number}</li>
                <li><strong>Date of Birth:</strong> {userData.date_of_birth}</li>
                <li><strong>Parent Type:</strong> {parentTypeOptions.find(opt => opt.value === parentData.parent_type)?.label}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium text-gray-700">Account Security *</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              label="Password *"
              name="password"
              type="password"
              value={userData.password}
              onChange={handleUserChange}
              placeholder="Create a strong password"
              required
              error={fieldErrors.password}
              disabled={loading}
            />
            {passwordStrength && (
              <p className={`mt-1 text-xs ${
                passwordStrength.includes('Weak') ? 'text-red-600' :
                passwordStrength.includes('Fair') ? 'text-yellow-600' :
                passwordStrength.includes('Good') ? 'text-green-600' :
                'text-green-700'
              }`}>
                Password Strength: {passwordStrength}
              </p>
            )}
          </div>

          <Input
            label="Confirm Password *"
            name="password2"
            type="password"
            value={userData.password2}
            onChange={handleUserChange}
            placeholder="Re-enter password"
            required
            error={fieldErrors.password2}
            disabled={loading}
          />
        </div>

        <div className="border-t border-gray-200 pt-4">
          <h4 className="font-medium text-gray-700 mb-3">Additional Settings</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Input
              label="Bank Name"
              name="bank_name"
              value={parentData.bank_name}
              onChange={handleParentChange}
              placeholder="Bank name"
              disabled={loading}
            />
            
            <Input
              label="Account Name"
              name="account_name"
              value={parentData.account_name}
              onChange={handleParentChange}
              placeholder="Account name"
              disabled={loading}
            />
            
            <Input
              label="Account Number"
              name="account_number"
              value={parentData.account_number}
              onChange={handleParentChange}
              placeholder="Account number"
              disabled={loading}
            />
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_active"
                name="is_active"
                checked={parentData.is_active}
                onChange={handleParentChange}
                className="h-4 w-4 text-blue-600 rounded"
                disabled={loading}
              />
              <label htmlFor="is_active" className="ml-2 text-sm text-gray-700">
                Set parent as active (can login immediately)
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_pta_member"
                name="is_pta_member"
                checked={parentData.is_pta_member}
                onChange={handleParentChange}
                className="h-4 w-4 text-blue-600 rounded"
                disabled={loading}
              />
              <label htmlFor="is_pta_member" className="ml-2 text-sm text-gray-700">
                Mark as PTA member
              </label>
            </div>

            {parentData.is_pta_member && (
              <div className="ml-6 space-y-2">
                <Input
                  label="PTA Position"
                  name="pta_position"
                  value={parentData.pta_position}
                  onChange={handleParentChange}
                  placeholder="e.g., Chairman, Secretary"
                  disabled={loading}
                  className="text-sm"
                />
                
                <Input
                  label="PTA Committee"
                  name="pta_committee"
                  value={parentData.pta_committee}
                  onChange={handleParentChange}
                  placeholder="e.g., Welfare, Finance"
                  disabled={loading}
                  className="text-sm"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (!isAdmin) {
    return (
      <DashboardLayout title="Access Denied">
        <div className="bg-white rounded-xl shadow-soft p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">You don't have permission to create parents.</p>
          <Link to="/dashboard">
            <Button>Go to Dashboard</Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Create New Parent">
      {/* Success Alert */}
      {success && (
        <Alert
          type="success"
          message={success}
          className="mb-6 whitespace-pre-line"
          autoDismiss={false}
        />
      )}

      {/* Error Alert */}
      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => setError('')}
          className="mb-6 whitespace-pre-line"
        />
      )}

      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-soft p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Add New Parent</h1>
            <p className="text-gray-600 mt-1">
              Complete all {totalSteps} steps to create a new parent account
            </p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <Link to="/parents">
              <Button variant="outline">← Back to Parents</Button>
            </Link>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex justify-between mb-2">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div
                key={i + 1}
                className={`flex-1 mx-1 ${i < totalSteps - 1 ? 'border-t-2' : ''} ${
                  currentStep > i + 1 ? 'border-blue-600' : 'border-gray-200'
                }`}
              />
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span className={`${currentStep >= 1 ? 'text-blue-600 font-medium' : ''}`}>
              Personal Info
            </span>
            <span className={`${currentStep >= 2 ? 'text-blue-600 font-medium' : ''}`}>
              Parent Details
            </span>
            <span className={`${currentStep >= 3 ? 'text-blue-600 font-medium' : ''}`}>
              Security & Review
            </span>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-soft p-6">
        {/* Step Content */}
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <div>
            {currentStep > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                disabled={loading}
              >
                ← Previous
              </Button>
            )}
          </div>

          <div className="flex space-x-3">
            {currentStep < totalSteps ? (
              <Button
                type="button"
                onClick={handleNext}
                disabled={loading}
              >
                Next Step →
              </Button>
            ) : (
              <Button
                type="submit"
                loading={loading}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700"
              >
                {loading ? 'Creating Parent...' : '✓ Create Parent'}
              </Button>
            )}
          </div>
        </div>
      </form>
    </DashboardLayout>
  );
};

export default ParentCreate;