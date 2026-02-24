/**
 * Register Page Component
 * Multi-step registration form with image on left, form on right
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import useAuth from '../hooks/useAuth';
import { handleApiError } from '../services/api';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  // Current step (1 or 2)
  const [currentStep, setCurrentStep] = useState(1);

  // Form state matching Django User model
  const [formData, setFormData] = useState({
    // Step 1 - Basic Info
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    role: 'student',
    gender: '',
    
    // Step 2 - Additional Info & Password
    date_of_birth: '',
    address: '',
    city: '',
    state_of_origin: '',
    lga: '',
    nationality: 'Nigerian',
    password: '',
    password2: '',
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  // Nigerian states matching Django model
  const nigerianStates = [
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

  // Role options matching Django model
  const roleOptions = [
    { value: 'student', label: 'Student' },
    { value: 'teacher', label: 'Teacher' },
    { value: 'parent', label: 'Parent/Guardian' },
    { value: 'accountant', label: 'Accountant' },
    { value: 'secretary', label: 'Secretary' },
    { value: 'librarian', label: 'Librarian' },
    { value: 'Head', label: 'Head of School/Proprietor' },
    { value: 'principal', label: 'principal' },
    { value: 'hm', label: 'Head Master' },
  ];

  // Gender options matching Django model
  const genderOptions = [
    { value: '', label: 'Select Gender' },
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
  ];

  /**
   * Handle input changes
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
    setFieldErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
  };

  /**
   * Validate Step 1
   */
  const validateStep1 = () => {
    const errors = {};

    if (!formData.first_name.trim()) {
      errors.first_name = 'First name is required';
    }
    if (!formData.last_name.trim()) {
      errors.last_name = 'Last name is required';
    }
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email format';
    }
    if (!formData.phone_number.trim()) {
      errors.phone_number = 'Phone number is required';
    } else if (!/^(0|\+234)[0-9]{10}$/.test(formData.phone_number.replace(/\s/g, ''))) {
      errors.phone_number = 'Invalid phone number format';
    }
    if (!formData.gender) {
      errors.gender = 'Gender is required';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Validate Step 2
   */
  const validateStep2 = () => {
    const errors = {};

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    if (!formData.password2) {
      errors.password2 = 'Please confirm your password';
    } else if (formData.password !== formData.password2) {
      errors.password2 = 'Passwords do not match';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Handle Next button (Step 1 -> Step 2)
   */
  const handleNext = () => {
    if (validateStep1()) {
      setCurrentStep(2);
      window.scrollTo(0, 0);
    } else {
      setError('Please fill in all required fields correctly');
    }
  };

  /**
   * Handle Back button (Step 2 -> Step 1)
   */
  const handleBack = () => {
    setCurrentStep(1);
    setError('');
    window.scrollTo(0, 0);
  };

  /**
   * Handle form submission (Step 2)
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateStep2()) {
      setError('Please fix the errors in the form');
      return;
    }

    try {
      setLoading(true);

      // Prepare data matching Django User model exactly
      const registrationData = {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        email: formData.email.trim(),
        phone_number: formData.phone_number.trim(),
        password: formData.password,
        password2: formData.password2,
        role: formData.role,
        gender: formData.gender,
        date_of_birth: formData.date_of_birth || null,
        address: formData.address.trim() || '',
        city: formData.city.trim() || '',
        state_of_origin: formData.state_of_origin || '',
        lga: formData.lga.trim() || '',
        nationality: formData.nationality || 'Nigerian',
      };

      const response = await register(registrationData);

      setSuccess('Registration successful! Redirecting to dashboard...');

      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);

    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-secondary-500 relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/school_girl.png"
            alt="Concord Tutor School Student"
            className="w-full h-full object-cover"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-secondary-600/90 to-secondary-800/80"></div>
        </div>
        <div className="relative z-10 flex flex-col justify-center items-center w-full px-12 text-white">
          <div className="max-w-md">
            {/* School Logo and Name */}
            <div className="flex items-center justify-center mb-8">
              <img
                src="/logo.png"
                alt="Concord Tutor School Logo"
                className="w-12 h-12 mr-3"
              />
              <div>
                <h1 className="text-2xl font-bold">CONCORD TUTOR SCHOOL</h1>
                <p className="text-white/80 text-sm">Excellence in Education</p>
              </div>
            </div>

            <h1 className="text-4xl font-heading font-bold mb-4">
              Join Our School
            </h1>
            <p className="text-lg text-white/90 mb-8">
              Create your account to access all school management features and resources.
            </p>
            
            {/* Progress Indicator */}
            <div className="space-y-4">
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                  currentStep === 1 ? 'bg-white text-secondary-500' : 'bg-white/20 text-white'
                }`}>
                  {currentStep > 1 ? (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <span className="font-semibold">1</span>
                  )}
                </div>
                <div>
                  <p className="font-medium">Basic Information</p>
                  <p className="text-sm text-white/70">Your personal details</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                  currentStep === 2 ? 'bg-white text-secondary-500' : 'bg-white/20 text-white'
                }`}>
                  <span className="font-semibold">2</span>
                </div>
                <div>
                  <p className="font-medium">Additional Details</p>
                  <p className="text-sm text-white/70">Complete your profile</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary-100 rounded-full mb-4">
              <img
                src="/logo.png"
                alt="Concord Tutor School Logo"
                className="w-8 h-8"
              />
            </div>
            <h2 className="text-3xl font-heading font-bold text-neutral-800 mb-2">
              Create Account
            </h2>
            <p className="text-neutral-600">
              Step {currentStep} of 2 - {currentStep === 1 ? 'Basic Information' : 'Complete Registration'}
            </p>
          </div>

          {/* Success Alert */}
          {success && (
            <Alert
              type="success"
              message={success}
              className="mb-6"
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

          {/* STEP 1: Basic Information */}
          {currentStep === 1 && (
            <form onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  name="first_name"
                  type="text"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="John"
                  required
                  error={fieldErrors.first_name}
                  disabled={loading}
                  autoFocus
                />
                <Input
                  label="Last Name"
                  name="last_name"
                  type="text"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Doe"
                  required
                  error={fieldErrors.last_name}
                  disabled={loading}
                />
              </div>

              <Input
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john.doe@example.com"
                required
                error={fieldErrors.email}
                disabled={loading}
              />

              <Input
                label="Phone Number"
                name="phone_number"
                type="tel"
                value={formData.phone_number}
                onChange={handleChange}
                placeholder="08012345678"
                required
                error={fieldErrors.phone_number}
                helperText="Format: 08012345678 or +2348012345678"
                disabled={loading}
              />

              <Input
                label="I am a"
                name="role"
                type="select"
                value={formData.role}
                onChange={handleChange}
                required
                disabled={loading}
                options={roleOptions}
              />

              <Input
                label="Gender"
                name="gender"
                type="select"
                value={formData.gender}
                onChange={handleChange}
                required
                error={fieldErrors.gender}
                disabled={loading}
                options={genderOptions}
              />

              <Button
                type="submit"
                variant="primary"
                fullWidth
                disabled={loading}
                className="mt-6"
              >
                Next Step
              </Button>
            </form>
          )}

          {/* STEP 2: Additional Details & Password */}
          {currentStep === 2 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Date of Birth"
                name="date_of_birth"
                type="date"
                value={formData.date_of_birth}
                onChange={handleChange}
                disabled={loading}
              />

              <Input
                label="Address"
                name="address"
                type="text"
                value={formData.address}
                onChange={handleChange}
                placeholder="123 Main Street"
                disabled={loading}
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="City"
                  name="city"
                  type="text"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Lagos"
                  disabled={loading}
                />

                <Input
                  label="State of Origin"
                  name="state_of_origin"
                  type="select"
                  value={formData.state_of_origin}
                  onChange={handleChange}
                  disabled={loading}
                  options={nigerianStates}
                />
              </div>

              <Input
                label="Local Government Area"
                name="lga"
                type="text"
                value={formData.lga}
                onChange={handleChange}
                placeholder="e.g., Ikeja"
                disabled={loading}
              />

              <Input
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimum 8 characters"
                required
                error={fieldErrors.password}
                helperText="Must be at least 8 characters"
                disabled={loading}
              />

              <Input
                label="Confirm Password"
                name="password2"
                type="password"
                value={formData.password2}
                onChange={handleChange}
                placeholder="Re-enter your password"
                required
                error={fieldErrors.password2}
                disabled={loading}
              />

              <div className="flex gap-3 mt-6">
                <Button
                  type="button"
                  onClick={handleBack}
                  variant="secondary"
                  fullWidth
                  disabled={loading}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  loading={loading}
                  disabled={loading}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </div>
            </form>
          )}

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-neutral-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-secondary-600 hover:text-secondary-700"
              >
                Sign in
              </Link>
            </p>
          </div>

          {/* Back to Home */}
          <div className="mt-4 text-center">
            <Link
              to="/"
              className="text-sm text-neutral-500 hover:text-neutral-700 inline-flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;