// src/pages/ParentRegister.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/layout/AuthLayout';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import { register } from '../services/authService';
import { createParent } from '../services/parentService';
import { handleApiError } from '../services/api';
import {
  getParentTypeOptions,
  getMaritalStatusOptions,
  getCommunicationOptions,
  getIncomeRangeOptions,
  validateNigerianPhone,
  validateEmail,
  validateParentFields,
} from '../utils/parentUtils';

const ParentRegister = () => {
  const navigate = useNavigate();

  // Form state
  const [userData, setUserData] = useState({
    email: '',
    password: '',
    password2: '',
    first_name: '',
    last_name: '',
    phone_number: '',
  });

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
    annual_income_range: '',
    bank_name: '',
    account_name: '',
    account_number: '',
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [fieldErrors, setFieldErrors] = useState({});
  const [declarationAccepted, setDeclarationAccepted] = useState(false);

  // Options
  const parentTypeOptions = getParentTypeOptions();
  const maritalStatusOptions = getMaritalStatusOptions();
  const communicationOptions = getCommunicationOptions();
  const incomeRangeOptions = getIncomeRangeOptions();

  const totalSteps = 3;

  // Handle input changes
  const handleUserChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleParentChange = (e) => {
    const { name, value, type, checked } = e.target;
    setParentData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Validation
  const validateStep1 = () => {
    const errors = {};
    
    if (!userData.first_name?.trim()) errors.first_name = 'First name is required';
    if (!userData.last_name?.trim()) errors.last_name = 'Last name is required';
    if (!userData.email?.trim()) errors.email = 'Email is required';
    if (userData.email && !validateEmail(userData.email)) errors.email = 'Invalid email format';
    if (!userData.phone_number?.trim()) errors.phone_number = 'Phone number is required';
    if (userData.phone_number && !validateNigerianPhone(userData.phone_number)) {
      errors.phone_number = 'Phone must start with 0 or +234 and be 11 digits';
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep2 = () => {
    const errors = {};
    
    if (!parentData.parent_type) errors.parent_type = 'Parent type is required';
    if (parentData.office_phone && !validateNigerianPhone(parentData.office_phone)) {
      errors.office_phone = 'Invalid phone format';
    }
    if (parentData.emergency_contact_phone && !validateNigerianPhone(parentData.emergency_contact_phone)) {
      errors.emergency_contact_phone = 'Invalid phone format';
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep3 = () => {
    const errors = {};
    
    if (!userData.password) errors.password = 'Password is required';
    if (userData.password && userData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    if (userData.password !== userData.password2) {
      errors.password2 = 'Passwords do not match';
    }
    if (!declarationAccepted) {
      errors.declaration = 'You must accept the declaration to proceed';
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Navigation
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

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setError('');
    setSuccess('');
    
    // Validate all steps
    if (!validateStep1() || !validateStep2() || !validateStep3()) {
      setError('Please fix all errors in the form');
      return;
    }

    try {
      setLoading(true);

      // Step 1: Create user account
      const registrationData = {
        ...userData,
        role: 'parent',
        phone_number: userData.phone_number.replace('+234', '0'),
      };

      // Register user
      const authResponse = await register(registrationData);
      
      if (!authResponse || !authResponse.user) {
        throw new Error('Registration failed. Please try again.');
      }

      // Step 2: Create parent profile
      const parentProfileData = {
        user_id: authResponse.user.id,
        ...parentData,
        phone_number: userData.phone_number.replace('+234', '0'),
        office_phone: parentData.office_phone?.replace('+234', '0'),
        emergency_contact_phone: parentData.emergency_contact_phone?.replace('+234', '0'),
      };

      // Create parent profile
      const parentResponse = await createParent(parentProfileData);

      setSuccess('Registration successful! Your parent account has been created. You will need to link your children to your account. Redirecting to login...');

      // Redirect to login after delay
      setTimeout(() => {
        navigate('/login');
      }, 3000);

    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      console.error('Parent registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Render steps
  const renderStep1 = () => (
    <div className="space-y-4 animate-fade-in">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Step 1: Personal Information</h3>
      
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
        helperText="This will be your login email"
      />

      <Input
        label="Phone Number *"
        name="phone_number"
        type="tel"
        value={userData.phone_number}
        onChange={handleUserChange}
        placeholder="08012345678 or +2348012345678"
        required
        error={fieldErrors.phone_number}
        disabled={loading}
        helperText="Format: 08012345678 or +2348012345678"
      />
    </div>
  );

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
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Marital Status</label>
          <select
            name="marital_status"
            value={parentData.marital_status}
            onChange={handleParentChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            disabled={loading}
          >
            {maritalStatusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Occupation"
          name="occupation"
          value={parentData.occupation}
          onChange={handleParentChange}
          placeholder="Your occupation"
          disabled={loading}
        />

        <Input
          label="Employer"
          name="employer"
          value={parentData.employer}
          onChange={handleParentChange}
          placeholder="Company name"
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
        error={fieldErrors.office_phone}
        disabled={loading}
      />

      <div className="border-t border-gray-200 pt-4">
        <h4 className="font-medium text-gray-700 mb-3">Emergency Contact</h4>
        
        <div className="space-y-4">
          <Input
            label="Emergency Contact Name"
            name="emergency_contact_name"
            value={parentData.emergency_contact_name}
            onChange={handleParentChange}
            placeholder="Full name"
            disabled={loading}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Emergency Contact Phone"
              name="emergency_contact_phone"
              type="tel"
              value={parentData.emergency_contact_phone}
              onChange={handleParentChange}
              placeholder="08012345678"
              error={fieldErrors.emergency_contact_phone}
              disabled={loading}
            />

            <Input
              label="Relationship"
              name="emergency_contact_relationship"
              value={parentData.emergency_contact_relationship}
              onChange={handleParentChange}
              placeholder="e.g., Brother, Sister, Friend"
              disabled={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4 animate-fade-in">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Step 3: Security & Declaration</h3>
      
      <div className="space-y-4">
        <Input
          label="Password *"
          name="password"
          type="password"
          value={userData.password}
          onChange={handleUserChange}
          placeholder="Minimum 8 characters"
          required
          error={fieldErrors.password}
          disabled={loading}
        />

        <Input
          label="Confirm Password *"
          name="password2"
          type="password"
          value={userData.password2}
          onChange={handleUserChange}
          placeholder="Re-enter your password"
          required
          error={fieldErrors.password2}
          disabled={loading}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Communication</label>
          <select
            name="preferred_communication"
            value={parentData.preferred_communication}
            onChange={handleParentChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            disabled={loading}
          >
            {communicationOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-3">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="receive_sms_alerts"
              name="receive_sms_alerts"
              checked={parentData.receive_sms_alerts}
              onChange={handleParentChange}
              className="h-4 w-4 text-primary-600 rounded"
              disabled={loading}
            />
            <label htmlFor="receive_sms_alerts" className="ml-2 text-sm text-gray-700">
              Receive SMS alerts about my child
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="receive_email_alerts"
              name="receive_email_alerts"
              checked={parentData.receive_email_alerts}
              onChange={handleParentChange}
              className="h-4 w-4 text-primary-600 rounded"
              disabled={loading}
            />
            <label htmlFor="receive_email_alerts" className="ml-2 text-sm text-gray-700">
              Receive email alerts about my child
            </label>
          </div>

          <div className="flex items-start mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center h-5">
              <input
                id="declaration"
                name="declaration"
                type="checkbox"
                checked={declarationAccepted}
                onChange={(e) => setDeclarationAccepted(e.target.checked)}
                className="h-4 w-4 text-primary-600 rounded"
                disabled={loading}
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="declaration" className="font-medium text-gray-700">
                Declaration
              </label>
              <p className="text-gray-600">
                I hereby declare that all information provided in this registration form is true, accurate, and complete to the best of my knowledge. I understand that providing false information may lead to cancellation of registration.
              </p>
              {fieldErrors.declaration && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.declaration}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <AuthLayout
      title="Parent Registration"
      subtitle="Register as a parent to manage your child's education"
    >
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div
              key={i + 1}
              className={`flex-1 mx-1 ${i < totalSteps - 1 ? 'border-t-2' : ''} ${
                currentStep > i + 1 ? 'border-primary-600' : 'border-gray-200'
              }`}
            />
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span className={currentStep >= 1 ? 'text-primary-600 font-medium' : ''}>Personal</span>
          <span className={currentStep >= 2 ? 'text-primary-600 font-medium' : ''}>Details</span>
          <span className={currentStep >= 3 ? 'text-primary-600 font-medium' : ''}>Security</span>
        </div>
      </div>

      {/* Alerts */}
      {success && (
        <Alert
          type="success"
          message={success}
          className="mb-4"
          autoDismiss={false}
        />
      )}

      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => setError('')}
          className="mb-4"
        />
      )}

      {/* Form */}
      <form onSubmit={handleSubmit}>
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
                Previous
              </Button>
            )}
          </div>

          <div>
            {currentStep < totalSteps ? (
              <Button
                type="button"
                onClick={handleNext}
                disabled={loading}
              >
                Next Step
              </Button>
            ) : (
              <Button
                type="submit"
                loading={loading}
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Complete Registration'}
              </Button>
            )}
          </div>
        </div>
      </form>

      {/* Links */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
          >
            Login here
          </Link>
        </p>
      </div>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Registering as a student?{' '}
          <Link
            to="/register/student"
            className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
          >
            Student Registration
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default ParentRegister;