/**
 * Parent Create Page
 * Create a new parent profile with user account
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import Alert from '../../components/common/Alert';
import Button from '../../components/common/Button';
import { ArrowLeft, UserPlus, Eye, EyeOff, Upload, X } from 'lucide-react';
import { createParentWithUser } from '../../services/parentService';
import useAuth from '../../hooks/useAuth';

const ParentCreate = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = ['head', 'hm', 'principal', 'vice_principal'].includes(user?.role);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    // User fields
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    password: 'Parent@2024',
    confirm_password: 'Parent@2024',
    gender: 'male',
    date_of_birth: '',
    address: '',
    city: '',
    state_of_origin: 'lagos',
    lga: '',
    nationality: 'Nigerian',
    
    // Parent fields
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
    is_pta_member: false,
    pta_position: '',
    pta_committee: '',
    is_active: true
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.first_name.trim()) newErrors.first_name = 'First name is required';
    if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required';
    if (!formData.phone_number.trim()) newErrors.phone_number = 'Phone number is required';
    if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password = 'Passwords do not match';
    }
    if (formData.password.length < 5) {
      newErrors.password = 'Password must be at least 5 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

// ParentCreate.jsx - In handleSubmit function

    const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
        setLoading(true);
        setError('');

        // Only include email if it has value
        const emailValue = formData.email.trim() || '';
        
        const userData = {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        phone_number: formData.phone_number.trim(),
        email: emailValue,  // Can be empty string
        gender: formData.gender,
        date_of_birth: formData.date_of_birth || '',  // Can be empty
        address: formData.address.trim() || '',
        city: formData.city.trim() || '',
        state_of_origin: formData.state_of_origin,
        lga: formData.lga.trim() || '',
        nationality: formData.nationality || 'Nigerian',
        password: formData.password,
        };

        const parentData = {
        parent_type: formData.parent_type,
        occupation: formData.occupation.trim() || '',
        employer: formData.employer.trim() || '',
        employer_address: formData.employer_address.trim() || '',
        office_phone: formData.office_phone.trim() || '',
        marital_status: formData.marital_status,
        emergency_contact_name: formData.emergency_contact_name.trim() || '',
        emergency_contact_phone: formData.emergency_contact_phone.trim() || '',
        emergency_contact_relationship: formData.emergency_contact_relationship.trim() || '',
        preferred_communication: formData.preferred_communication,
        receive_sms_alerts: formData.receive_sms_alerts,
        receive_email_alerts: formData.receive_email_alerts,
        annual_income_range: formData.annual_income_range,
        bank_name: formData.bank_name.trim() || '',
        account_name: formData.account_name.trim() || '',
        account_number: formData.account_number.trim() || '',
        is_pta_member: formData.is_pta_member,
        pta_position: formData.pta_position,
        pta_committee: formData.pta_committee,
        is_active: formData.is_active
        };

        const result = await createParentWithUser(userData, parentData);
        setSuccess(`Parent ${formData.first_name} ${formData.last_name} created successfully!`);
        
        setTimeout(() => {
        navigate('/parents');
        }, 2000);
        
    } catch (err) {
        console.error('Error creating parent:', err);
        setError(err.message || 'Failed to create parent');
    } finally {
        setLoading(false);
    }
    };

  if (!isAdmin) {
    return (
      <DashboardLayout title="Access Denied">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <UserPlus size={32} className="text-red-500" />
            </div>
            <h1 className="text-xl font-extrabold text-gray-900">Access Denied</h1>
            <p className="text-gray-500 text-sm mt-1">Only administrators can create parents.</p>
            <button onClick={() => navigate('/dashboard')} className="mt-4 px-5 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold">
              Go to Dashboard
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Create Parent">
      <div className="space-y-6 pb-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-8 h-8 bg-secondary-600 rounded-xl flex items-center justify-center">
                <UserPlus size={16} className="text-white" />
              </div>
              <h1 className="text-2xl font-extrabold text-gray-900">Create Parent</h1>
            </div>
            <p className="text-sm text-gray-400 pl-10">Add a new parent to the school system</p>
          </div>
          <button onClick={() => navigate('/parents')} className="flex items-center gap-2 text-gray-500 hover:text-gray-700">
            <ArrowLeft size={16} /> Back
          </button>
        </div>

        {/* Alerts */}
        {error && <Alert type="error" message={error} onClose={() => setError('')} />}
        {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <div className="space-y-8">
            {/* Personal Information */}
            <div>
              <h2 className="text-base font-extrabold text-gray-900 mb-4 pb-2 border-b">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">First Name <span className="text-red-500">*</span></label>
                  <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm" />
                  {errors.first_name && <p className="text-xs text-red-500 mt-1">{errors.first_name}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Last Name <span className="text-red-500">*</span></label>
                  <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm" />
                  {errors.last_name && <p className="text-xs text-red-500 mt-1">{errors.last_name}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Phone Number <span className="text-red-500">*</span></label>
                  <input type="tel" name="phone_number" value={formData.phone_number} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm" />
                  {errors.phone_number && <p className="text-xs text-red-500 mt-1">{errors.phone_number}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Gender</label>
                  <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm">
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Date of Birth</label>
                  <input type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm" />
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div>
              <h2 className="text-base font-extrabold text-gray-900 mb-4 pb-2 border-b">Address Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-600 mb-1">Address</label>
                  <textarea name="address" value={formData.address} onChange={handleChange} rows="2" className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">City</label>
                  <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">State</label>
                  <select name="state_of_origin" value={formData.state_of_origin} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm">
                    <option value="lagos">Lagos</option>
                    <option value="abuja">Abuja</option>
                    <option value="oyo">Oyo</option>
                    <option value="rivers">Rivers</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">LGA</label>
                  <input type="text" name="lga" value={formData.lga} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Nationality</label>
                  <input type="text" name="nationality" value={formData.nationality} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm" />
                </div>
              </div>
            </div>

            {/* Parent Information */}
            <div>
              <h2 className="text-base font-extrabold text-gray-900 mb-4 pb-2 border-b">Parent Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Parent Type</label>
                  <select name="parent_type" value={formData.parent_type} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm">
                    <option value="father">Father</option>
                    <option value="mother">Mother</option>
                    <option value="guardian">Guardian</option>
                    <option value="relative">Relative</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Marital Status</label>
                  <select name="marital_status" value={formData.marital_status} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm">
                    <option value="married">Married</option>
                    <option value="single">Single</option>
                    <option value="divorced">Divorced</option>
                    <option value="widowed">Widowed</option>
                    <option value="separated">Separated</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Occupation</label>
                  <input type="text" name="occupation" value={formData.occupation} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Employer</label>
                  <input type="text" name="employer" value={formData.employer} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Office Phone</label>
                  <input type="tel" name="office_phone" value={formData.office_phone} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Preferred Communication</label>
                  <select name="preferred_communication" value={formData.preferred_communication} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm">
                    <option value="email">Email</option>
                    <option value="sms">SMS</option>
                    <option value="phone">Phone Call</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="in_person">In Person</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div>
              <h2 className="text-base font-extrabold text-gray-900 mb-4 pb-2 border-b">Emergency Contact</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Contact Name</label>
                  <input type="text" name="emergency_contact_name" value={formData.emergency_contact_name} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Contact Phone</label>
                  <input type="tel" name="emergency_contact_phone" value={formData.emergency_contact_phone} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Relationship</label>
                  <input type="text" name="emergency_contact_relationship" value={formData.emergency_contact_relationship} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm" />
                </div>
              </div>
            </div>

            {/* Account Security */}
            <div>
              <h2 className="text-base font-extrabold text-gray-900 mb-4 pb-2 border-b">Account Security</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Password</label>
                  <div className="relative">
                    <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} className="w-full px-3 py-2 pr-10 border border-gray-200 rounded-xl text-sm" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Confirm Password</label>
                  <input type={showPassword ? 'text' : 'password'} name="confirm_password" value={formData.confirm_password} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm" />
                  {errors.confirm_password && <p className="text-xs text-red-500 mt-1">{errors.confirm_password}</p>}
                </div>
              </div>
            </div>

            {/* PTA & Status */}
            <div>
              <h2 className="text-base font-extrabold text-gray-900 mb-4 pb-2 border-b">PTA & Status</h2>
              <div className="flex flex-wrap gap-6">
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="is_pta_member" checked={formData.is_pta_member} onChange={handleChange} className="w-4 h-4 rounded" />
                  <span className="text-sm">PTA Member</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="receive_sms_alerts" checked={formData.receive_sms_alerts} onChange={handleChange} className="w-4 h-4 rounded" />
                  <span className="text-sm">Receive SMS Alerts</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="receive_email_alerts" checked={formData.receive_email_alerts} onChange={handleChange} className="w-4 h-4 rounded" />
                  <span className="text-sm">Receive Email Alerts</span>
                </label>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
            <button type="button" onClick={() => navigate('/parents')} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="flex-1 px-4 py-2.5 bg-secondary-600 text-white rounded-xl text-sm font-bold hover:bg-secondary-700 disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Creating...</> : 'Create Parent'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default ParentCreate;