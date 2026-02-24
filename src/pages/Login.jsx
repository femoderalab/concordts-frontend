import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import useAuth from '../hooks/useAuth';

const Login = () => {
  const navigate = useNavigate();
  const { login, loading: authLoading } = useAuth();

  const [formData, setFormData] = useState({
    registration_number: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [attempts, setAttempts] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const openWhatsApp = () => {
    window.open('https://wa.me/2348035312904', '_blank');
  };

  const openEmail = () => {
    window.location.href = 'mailto:concordtutorsnurprysch@gmail.com';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Basic validation
    if (!formData.registration_number.trim()) {
      setError('Registration number is required');
      return;
    }

    if (!formData.password.trim()) {
      setError('Password is required');
      return;
    }

    setLoading(true);

    try {
      const credentials = {
        registration_number: formData.registration_number.trim(),
        password: formData.password
      };

      await login(credentials);

      setSuccess('Login successful! Redirecting...');
      setAttempts(0);
      
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 1000);

    } catch (err) {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      
      // The error is already processed by handleApiError in AuthContext
      // Just use the error message as is
      let errorMessage = err.message || 'Login failed. Please try again.';
      
      // Clean up error messages for better user experience
      if (errorMessage.toLowerCase().includes('invalid') || 
          errorMessage.includes('401') || 
          errorMessage.includes('unauthorized')) {
        errorMessage = 'Invalid registration number or password. Please check your credentials.';
      } else if (errorMessage.toLowerCase().includes('network') || 
                 errorMessage.toLowerCase().includes('connection') ||
                 errorMessage.toLowerCase().includes('failed to fetch')) {
        errorMessage = 'Unable to connect to server. Please check your internet connection.';
      }
      
      // Show admin contact after 3 failed attempts
      if (newAttempts >= 3) {
        errorMessage += ' If you continue to have issues, please contact the school administration via WhatsApp or Email.';
      }
      
      setError(errorMessage);
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-[#2b2f83] relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/students.png"
            alt="Concord Tutor School Students"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 md:p-8 bg-gradient-to-br from-neutral-50 to-white">
        <div className="w-full max-w-md">
          <div className="text-center mb-6 md:mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-blue-100 rounded-full mb-3 md:mb-4">
              <img
                src="/logo.png"
                alt="Concord Tutor School Logo"
                className="w-7 h-7 md:w-8 md:h-8"
              />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Sign In
            </h2>
          </div>

          {success && (
            <Alert
              type="success"
              message={success}
              className="mb-4 md:mb-6"
            />
          )}

          {error && (
            <Alert
              type="error"
              message={error}
              onClose={() => setError('')}
              className="mb-4 md:mb-6"
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
            <Input
              label="Registration Number"
              name="registration_number"
              type="text"
              value={formData.registration_number}
              onChange={handleChange}
              placeholder=" "
              required={false}
              autoFocus
              disabled={loading || authLoading}
            />

            <Input
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder=" "
              required={false}
              disabled={loading || authLoading}
            />

            {attempts >= 3 && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700 font-medium">
                      Having trouble logging in?
                    </p>
                    <div className="mt-2 flex flex-col sm:flex-row gap-2">
                      <button
                        type="button"
                        onClick={openWhatsApp}
                        className="inline-flex items-center text-sm font-medium text-yellow-700 hover:text-yellow-600 px-3 py-1 bg-yellow-100 hover:bg-yellow-200 rounded-lg transition-colors"
                      >
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                        </svg>
                        WhatsApp
                      </button>
                      <button
                        type="button"
                        onClick={openEmail}
                        className="inline-flex items-center text-sm font-medium text-yellow-700 hover:text-yellow-600 px-3 py-1 bg-yellow-100 hover:bg-yellow-200 rounded-lg transition-colors"
                      >
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                        Email
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={loading || authLoading}
              disabled={loading || authLoading}
              className="mt-4 md:mt-6"
            >
              {loading || authLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <Link
              to="/"
              className="text-sm text-gray-500 hover:text-gray-700 inline-flex items-center transition-colors"
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

export default Login;