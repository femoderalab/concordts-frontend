import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import Loader from '../components/common/Loader';
import ChildrenList from '../components/parents/ChildrenList';
import PTABadge from '../components/parents/PTABadge';
import useAuth from '../hooks/useAuth';
import { getParentById, updateParent } from '../services/parentService';
import { handleApiError } from '../services/api';
import {
  formatPhoneNumber,
  getParentTypeLabel,
  getMaritalStatusLabel,
  getCommunicationLabel,
  getIncomeRangeLabel,
  getPTAStatusColor,
  getVerificationStatusColor,
} from '../utils/parentUtils';

const ParentDetail = ({ editMode = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [parent, setParent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditMode, setIsEditMode] = useState(editMode);

  // Form state for editing
  const [formData, setFormData] = useState({
    occupation: '',
    employer: '',
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
    is_active: true,
    is_verified: false,
  });

  const canEdit = user?.role === 'head' || 
                  user?.role === 'principal' || 
                  user?.role === 'vice_principal' || 
                  user?.role === 'secretary' || 
                  user?.role === 'parent';

  useEffect(() => {
    fetchParentDetails();
  }, [id]);

  const fetchParentDetails = async () => {
    try {
      setLoading(true);
      setError('');

      const data = await getParentById(id);
      setParent(data);

      if (isEditMode) {
        setFormData({
          occupation: data.occupation || '',
          employer: data.employer || '',
          office_phone: data.office_phone || '',
          marital_status: data.marital_status || 'married',
          emergency_contact_name: data.emergency_contact_name || '',
          emergency_contact_phone: data.emergency_contact_phone || '',
          emergency_contact_relationship: data.emergency_contact_relationship || '',
          preferred_communication: data.preferred_communication || 'whatsapp',
          receive_sms_alerts: data.receive_sms_alerts !== false,
          receive_email_alerts: data.receive_email_alerts !== false,
          annual_income_range: data.annual_income_range || '',
          bank_name: data.bank_name || '',
          account_name: data.account_name || '',
          account_number: data.account_number || '',
          is_pta_member: data.is_pta_member || false,
          pta_position: data.pta_position || '',
          pta_committee: data.pta_committee || '',
          is_active: data.is_active !== false,
          is_verified: data.is_verified || false,
        });
      }
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      console.error('Error fetching parent details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditToggle = () => {
    setIsEditMode(!isEditMode);
    if (!isEditMode && parent) {
      setFormData({
        occupation: parent.occupation || '',
        employer: parent.employer || '',
        office_phone: parent.office_phone || '',
        marital_status: parent.marital_status || 'married',
        emergency_contact_name: parent.emergency_contact_name || '',
        emergency_contact_phone: parent.emergency_contact_phone || '',
        emergency_contact_relationship: parent.emergency_contact_relationship || '',
        preferred_communication: parent.preferred_communication || 'whatsapp',
        receive_sms_alerts: parent.receive_sms_alerts !== false,
        receive_email_alerts: parent.receive_email_alerts !== false,
        annual_income_range: parent.annual_income_range || '',
        bank_name: parent.bank_name || '',
        account_name: parent.account_name || '',
        account_number: parent.account_number || '',
        is_pta_member: parent.is_pta_member || false,
        pta_position: parent.pta_position || '',
        pta_committee: parent.pta_committee || '',
        is_active: parent.is_active !== false,
        is_verified: parent.is_verified || false,
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      await updateParent(id, formData);
      
      setSuccess('Parent information updated successfully!');
      setIsEditMode(false);
      fetchParentDetails(); // Refresh data
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title={isEditMode ? "Edit Parent" : "Parent Details"}>
        <div className="flex justify-center items-center py-12">
          <Loader text="Loading parent details..." />
        </div>
      </DashboardLayout>
    );
  }

  if (!parent) {
    return (
      <DashboardLayout title="Parent Not Found">
        <div className="bg-white rounded-xl shadow-soft p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Parent Not Found</h1>
          <p className="text-gray-600 mb-6">The parent you're looking for doesn't exist or has been removed.</p>
          <Link to="/parents">
            <Button>Back to Parents</Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title={isEditMode ? "Edit Parent" : "Parent Details"}>
      {/* Alerts */}
      {success && (
        <Alert
          type="success"
          message={success}
          onClose={() => setSuccess('')}
          className="mb-6"
        />
      )}
      
      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => setError('')}
          className="mb-6"
        />
      )}

      {/* Header */}
      <div className="bg-white rounded-xl shadow-soft p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <div className="flex items-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-primary-600 text-2xl font-bold">
                  {parent.user?.first_name?.[0] || 'P'}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {parent.user?.first_name} {parent.user?.last_name}
                </h1>
                <p className="text-gray-600">
                  Parent ID: {parent.parent_id} • {getParentTypeLabel(parent.parent_type)}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 md:mt-0 flex space-x-3">
            {canEdit && !isEditMode && (
              <Button onClick={handleEditToggle} variant="outline">
                Edit Information
              </Button>
            )}
            <Link to="/parents">
              <Button variant="outline">Back to Parents</Button>
            </Link>
          </div>
        </div>

        {/* Status Badges */}
        <div className="mt-6 flex flex-wrap gap-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${parent.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {parent.is_active ? 'Active' : 'Inactive'}
          </span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getVerificationStatusColor(parent.is_verified)}`}>
            {parent.is_verified ? 'Verified' : 'Pending Verification'}
          </span>
          <PTABadge isPTAMember={parent.is_pta_member} />
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            {parent.children_count || 0} children
          </span>
        </div>
      </div>

      {isEditMode ? (
        /* Edit Form */
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white rounded-xl shadow-soft p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Personal Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Occupation</label>
                <input
                  type="text"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter occupation"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Employer</label>
                <input
                  type="text"
                  name="employer"
                  value={formData.employer}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter employer name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Office Phone</label>
                <input
                  type="tel"
                  name="office_phone"
                  value={formData.office_phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter office phone"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Marital Status</label>
                <select
                  name="marital_status"
                  value={formData.marital_status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="married">Married</option>
                  <option value="single">Single</option>
                  <option value="divorced">Divorced</option>
                  <option value="widowed">Widowed</option>
                  <option value="separated">Separated</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Communication</label>
                <select
                  name="preferred_communication"
                  value={formData.preferred_communication}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="email">Email</option>
                  <option value="sms">SMS</option>
                  <option value="phone">Phone Call</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="in_person">In Person</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Annual Income Range</label>
                <select
                  name="annual_income_range"
                  value={formData.annual_income_range}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select Income Range</option>
                  <option value="below_500k">Below ₦500,000</option>
                  <option value="500k_1m">₦500,000 - ₦1 Million</option>
                  <option value="1m_3m">₦1 Million - ₦3 Million</option>
                  <option value="3m_5m">₦3 Million - ₦5 Million</option>
                  <option value="above_5m">Above ₦5 Million</option>
                  <option value="prefer_not">Prefer not to say</option>
                </select>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Emergency Contact</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contact Name</label>
                  <input
                    type="text"
                    name="emergency_contact_name"
                    value={formData.emergency_contact_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="emergency_contact_phone"
                    value={formData.emergency_contact_phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Relationship</label>
                  <input
                    type="text"
                    name="emergency_contact_relationship"
                    value={formData.emergency_contact_relationship}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., Brother, Sister"
                  />
                </div>
              </div>
            </div>

            {/* Communication Preferences */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Communication Preferences</h4>
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="receive_sms_alerts"
                    name="receive_sms_alerts"
                    checked={formData.receive_sms_alerts}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-primary-600 rounded focus:ring-primary-500"
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
                    checked={formData.receive_email_alerts}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-primary-600 rounded focus:ring-primary-500"
                  />
                  <label htmlFor="receive_email_alerts" className="ml-2 text-sm text-gray-700">
                    Receive email alerts
                  </label>
                </div>
              </div>
            </div>

            {/* PTA Information */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">PTA Information</h4>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_pta_member"
                    name="is_pta_member"
                    checked={formData.is_pta_member}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-primary-600 rounded focus:ring-primary-500"
                  />
                  <label htmlFor="is_pta_member" className="ml-2 text-sm text-gray-700">
                    PTA Member
                  </label>
                </div>

                {formData.is_pta_member && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">PTA Position</label>
                      <input
                        type="text"
                        name="pta_position"
                        value={formData.pta_position}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="e.g., Treasurer, Secretary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">PTA Committee</label>
                      <input
                        type="text"
                        name="pta_committee"
                        value={formData.pta_committee}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="e.g., Finance, Events"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bank Information */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Bank Information (Optional)</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name</label>
                  <input
                    type="text"
                    name="bank_name"
                    value={formData.bank_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Bank name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Account Name</label>
                  <input
                    type="text"
                    name="account_name"
                    value={formData.account_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Account name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
                  <input
                    type="text"
                    name="account_number"
                    value={formData.account_number}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Account number"
                  />
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Status</h4>
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_active"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-primary-600 rounded focus:ring-primary-500"
                  />
                  <label htmlFor="is_active" className="ml-2 text-sm text-gray-700">
                    Active (can login to system)
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_verified"
                    name="is_verified"
                    checked={formData.is_verified}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-primary-600 rounded focus:ring-primary-500"
                  />
                  <label htmlFor="is_verified" className="ml-2 text-sm text-gray-700">
                    Verified (documentation complete)
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleEditToggle}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={saving}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      ) : (
        /* View Mode */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Personal Information */}
          <div className="lg:col-span-2 space-y-8">
            {/* Personal Information Card */}
            <div className="bg-white rounded-xl shadow-soft p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Personal Information</h3>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
                    <p className="text-gray-800 font-medium">
                      {parent.user?.first_name} {parent.user?.last_name}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Parent ID</label>
                    <p className="text-gray-800 font-medium">{parent.parent_id}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Parent Type</label>
                    <p className="text-gray-800 font-medium">{getParentTypeLabel(parent.parent_type)}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Marital Status</label>
                    <p className="text-gray-800 font-medium">{getMaritalStatusLabel(parent.marital_status)}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Occupation</label>
                    <p className="text-gray-800 font-medium">{parent.occupation || 'Not specified'}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Employer</label>
                    <p className="text-gray-800 font-medium">{parent.employer || 'Not specified'}</p>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="pt-4 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-4">Contact Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Phone Number</label>
                      <p className="text-gray-800 font-medium">
                        {formatPhoneNumber(parent.user?.phone_number)}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Email Address</label>
                      <p className="text-gray-800 font-medium">{parent.user?.email}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Office Phone</label>
                      <p className="text-gray-800 font-medium">
                        {parent.office_phone ? formatPhoneNumber(parent.office_phone) : 'Not specified'}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Communication Preference</label>
                      <p className="text-gray-800 font-medium">{getCommunicationLabel(parent.preferred_communication)}</p>
                    </div>
                  </div>
                </div>

                {/* Communication Preferences */}
                <div className="pt-4 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-4">Communication Preferences</h4>
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${parent.receive_sms_alerts ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      SMS: {parent.receive_sms_alerts ? 'Enabled' : 'Disabled'}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm ${parent.receive_email_alerts ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      Email: {parent.receive_email_alerts ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>

                {/* Financial Information */}
                <div className="pt-4 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-4">Financial Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Annual Income Range</label>
                      <p className="text-gray-800 font-medium">
                        {getIncomeRangeLabel(parent.annual_income_range)}
                      </p>
                    </div>

                    {parent.bank_name && (
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Bank Account</label>
                        <p className="text-gray-800 font-medium">
                          {parent.bank_name} • {parent.account_name}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Contact Card */}
            <div className="bg-white rounded-xl shadow-soft p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Emergency Contact</h3>
              
              {parent.emergency_contact_name ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Contact Name</label>
                      <p className="text-gray-800 font-medium">{parent.emergency_contact_name}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Phone Number</label>
                      <p className="text-gray-800 font-medium">
                        {formatPhoneNumber(parent.emergency_contact_phone)}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Relationship</label>
                      <p className="text-gray-800 font-medium">{parent.emergency_contact_relationship}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600 text-center py-4">No emergency contact information provided</p>
              )}
            </div>

            {/* PTA Information Card */}
            {parent.is_pta_member && (
              <div className="bg-white rounded-xl shadow-soft p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">PTA Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">PTA Position</label>
                    <p className="text-gray-800 font-medium">{parent.pta_position || 'Not specified'}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">PTA Committee</label>
                    <p className="text-gray-800 font-medium">{parent.pta_committee || 'Not specified'}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Children and Actions */}
          <div className="space-y-8">
            {/* Children Card */}
            <div className="bg-white rounded-xl shadow-soft p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-800">Children</h3>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {parent.children_count || 0} children
                </span>
              </div>

              {parent.children && parent.children.length > 0 ? (
                <ChildrenList children={parent.children} loading={false} />
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-600">No children linked to this parent</p>
                  {canEdit && (
                    <Link to="/parents/link-child" className="inline-block mt-3 text-primary-600 hover:text-primary-700 font-medium">
                      Link Child
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* Quick Actions Card */}
            <div className="bg-white rounded-xl shadow-soft p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Quick Actions</h3>
              
              <div className="space-y-3">
                {canEdit && (
                  <Button onClick={handleEditToggle} className="w-full justify-center">
                    Edit Parent Information
                  </Button>
                )}
                
                <Link to={`/parents/link-child?parent_id=${parent.parent_id}`} className="block">
                  <Button variant="outline" className="w-full justify-center">
                    Link New Child
                  </Button>
                </Link>

                <Link to="/parents" className="block">
                  <Button variant="outline" className="w-full justify-center">
                    Back to Parents
                  </Button>
                </Link>
              </div>
            </div>

            {/* Account Information Card */}
            <div className="bg-white rounded-xl shadow-soft p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Account Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Registration Number</label>
                  <p className="text-gray-800 font-medium">{parent.user?.registration_number}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Account Created</label>
                  <p className="text-gray-800 font-medium">
                    {new Date(parent.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Last Updated</label>
                  <p className="text-gray-800 font-medium">
                    {new Date(parent.updated_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ParentDetail;