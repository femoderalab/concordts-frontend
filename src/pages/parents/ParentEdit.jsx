// src/pages/parents/ParentEdit.jsx - COMPLETE WORKING VERSION
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import Alert from '../../components/common/Alert';
import { Text, Button, Card } from '../../components/ui';
import parentService from '../../services/parentService';
import useAuth from '../../hooks/useAuth';
import { ArrowLeft, Save, User, Phone, Mail, MapPin, Briefcase, Heart, Shield, RefreshCw } from 'lucide-react';

const ParentEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const isAdmin = ['head', 'hm', 'principal', 'vice_principal', 'secretary', 'accountant'].includes(user?.role);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    first_name: '', last_name: '', email: '', phone_number: '', gender: '', date_of_birth: '',
    address: '', city: '', state_of_origin: 'lagos', lga: '', nationality: 'Nigerian',
    parent_type: 'father', occupation: '', employer: '', office_phone: '', marital_status: 'married',
    emergency_contact_name: '', emergency_contact_phone: '', emergency_contact_relationship: '',
    preferred_communication: 'whatsapp', receive_sms_alerts: true, receive_email_alerts: true,
    is_pta_member: false, pta_position: '', pta_committee: '', is_active: true
  });

  useEffect(() => {
    loadParent();
  }, [id]);

  // Helper function to split full name into first and last name
  const splitFullName = (fullName) => {
    if (!fullName || fullName.trim() === '') return { firstName: '', lastName: '' };
    
    const nameParts = fullName.trim().split(' ');
    if (nameParts.length === 1) {
      return { firstName: nameParts[0], lastName: '' };
    }
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ');
    return { firstName, lastName };
  };

  const loadParent = async () => {
    try {
      setLoading(true);
      const response = await parentService.getParentById(id);
      
      let parentData = response.parent || response;
      let userData = parentData.user || {};
      
      // Split the full_name into first and last name
      const fullName = userData.full_name || parentData.full_name || '';
      const { firstName, lastName } = splitFullName(fullName);
      
      setFormData({
        first_name: firstName,
        last_name: lastName,
        email: userData.email || parentData.email || '',
        phone_number: userData.phone_number || parentData.phone_number || '',
        gender: userData.gender || parentData.gender || '',
        date_of_birth: userData.date_of_birth || parentData.date_of_birth || '',
        address: userData.address || parentData.address || '',
        city: userData.city || parentData.city || '',
        state_of_origin: userData.state_of_origin || parentData.state_of_origin || 'lagos',
        lga: userData.lga || parentData.lga || '',
        nationality: userData.nationality || parentData.nationality || 'Nigerian',
        
        parent_type: parentData.parent_type || 'father',
        occupation: parentData.occupation || '',
        employer: parentData.employer || '',
        office_phone: parentData.office_phone || '',
        marital_status: parentData.marital_status || 'married',
        emergency_contact_name: parentData.emergency_contact_name || '',
        emergency_contact_phone: parentData.emergency_contact_phone || '',
        emergency_contact_relationship: parentData.emergency_contact_relationship || '',
        preferred_communication: parentData.preferred_communication || 'whatsapp',
        receive_sms_alerts: parentData.receive_sms_alerts !== false,
        receive_email_alerts: parentData.receive_email_alerts !== false,
        is_pta_member: parentData.is_pta_member || false,
        pta_position: parentData.pta_position || '',
        pta_committee: parentData.pta_committee || '',
        is_active: parentData.is_active !== false,
      });
      
    } catch (err) {
      console.error('Error loading parent:', err);
      setError('Failed to load parent');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.first_name || !formData.last_name) {
      setError('First name and last name are required');
      return;
    }
    
    try {
      setSaving(true);
      setError('');
      
      // Combine first_name and last_name into full_name for backend
      const fullName = `${formData.first_name} ${formData.last_name}`.trim();
      
      const updateData = {
        // Send combined full_name
        full_name: fullName,
        email: formData.email,
        phone_number: formData.phone_number,
        gender: formData.gender,
        date_of_birth: formData.date_of_birth,
        address: formData.address,
        city: formData.city,
        state_of_origin: formData.state_of_origin,
        lga: formData.lga,
        nationality: formData.nationality,
        parent_type: formData.parent_type,
        occupation: formData.occupation,
        employer: formData.employer,
        office_phone: formData.office_phone,
        marital_status: formData.marital_status,
        emergency_contact_name: formData.emergency_contact_name,
        emergency_contact_phone: formData.emergency_contact_phone,
        emergency_contact_relationship: formData.emergency_contact_relationship,
        preferred_communication: formData.preferred_communication,
        receive_sms_alerts: formData.receive_sms_alerts,
        receive_email_alerts: formData.receive_email_alerts,
        is_pta_member: formData.is_pta_member,
        pta_position: formData.pta_position,
        pta_committee: formData.pta_committee,
        is_active: formData.is_active,
      };
      
      console.log('Submitting update:', updateData);
      
      const result = await parentService.updateParent(id, updateData);
      console.log('Update result:', result);
      
      setSuccess('Parent updated successfully!');
      setTimeout(() => navigate(`/parents/${id}`), 1500);
    } catch (err) {
      console.error('Error updating parent:', err);
      const errorMsg = err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to update parent';
      setError(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  if (!isAdmin) {
    return (
      <DashboardLayout title="Access Denied">
        <div className="text-center py-12">
          <Shield size={48} className="mx-auto text-red-500 mb-3" />
          <Text variant="h3" className="font-bold text-gray-800">Access Denied</Text>
          <Text variant="body" className="text-gray-500">Only administrators can edit parents.</Text>
        </div>
      </DashboardLayout>
    );
  }

  if (loading) {
    return (
      <DashboardLayout title="Edit Parent">
        <div className="flex justify-center py-12">
          <RefreshCw className="animate-spin h-8 w-8 text-[#D94801]" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Edit Parent">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Text variant="h2" className="font-bold">Edit Parent</Text>
            <Text variant="caption" className="text-gray-500">Update parent information</Text>
          </div>
          <button onClick={() => navigate(`/parents/${id}`)} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors">
            <ArrowLeft size={16} /> Back
          </button>
        </div>
        
        {error && <Alert type="error" message={error} onClose={() => setError('')} className="mb-4" />}
        {success && <Alert type="success" message={success} onClose={() => setSuccess('')} className="mb-4" />}
        
        <form onSubmit={handleSubmit}>
          <Card className="p-6 space-y-6">
            {/* Personal Information */}
            <div>
              <Text variant="small" className="font-semibold text-gray-900 mb-4 pb-2 border-b flex items-center gap-2">
                <User size={14} className="text-[#D94801]" /> Personal Information
              </Text>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-medium text-gray-500 mb-1">First Name *</label>
                  <input 
                    type="text" 
                    name="first_name" 
                    value={formData.first_name} 
                    onChange={handleChange} 
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
                    placeholder="Enter first name"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-gray-500 mb-1">Last Name *</label>
                  <input 
                    type="text" 
                    name="last_name" 
                    value={formData.last_name} 
                    onChange={handleChange} 
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
                    placeholder="Enter last name"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-gray-500 mb-1">Email</label>
                  <input 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-gray-500 mb-1">Phone *</label>
                  <input 
                    type="tel" 
                    name="phone_number" 
                    value={formData.phone_number} 
                    onChange={handleChange} 
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-gray-500 mb-1">Gender</label>
                  <select 
                    name="gender" 
                    value={formData.gender} 
                    onChange={handleChange} 
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-gray-500 mb-1">Date of Birth</label>
                  <input 
                    type="date" 
                    name="date_of_birth" 
                    value={formData.date_of_birth} 
                    onChange={handleChange} 
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <Text variant="small" className="font-semibold text-gray-900 mb-4 pb-2 border-b flex items-center gap-2">
                <MapPin size={14} className="text-[#D94801]" /> Address
              </Text>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-medium text-gray-500 mb-1">Address</label>
                  <textarea 
                    name="address" 
                    value={formData.address} 
                    onChange={handleChange} 
                    rows={2} 
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-gray-500 mb-1">City</label>
                  <input 
                    type="text" 
                    name="city" 
                    value={formData.city} 
                    onChange={handleChange} 
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-gray-500 mb-1">State</label>
                  <select 
                    name="state_of_origin" 
                    value={formData.state_of_origin} 
                    onChange={handleChange} 
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
                  >
                    <option value="lagos">Lagos</option>
                    <option value="abuja">Abuja</option>
                    <option value="oyo">Oyo</option>
                    <option value="rivers">Rivers</option>
                    <option value="ogun">Ogun</option>
                    <option value="ondo">Ondo</option>
                    <option value="osun">Osun</option>
                    <option value="ekiti">Ekiti</option>
                    <option value="kwara">Kwara</option>
                    <option value="kogi">Kogi</option>
                    <option value="benue">Benue</option>
                    <option value="plateau">Plateau</option>
                    <option value="nasarawa">Nasarawa</option>
                    <option value="niger">Niger</option>
                    <option value="kaduna">Kaduna</option>
                    <option value="kano">Kano</option>
                    <option value="katsina">Katsina</option>
                    <option value="jigawa">Jigawa</option>
                    <option value="borno">Borno</option>
                    <option value="yobe">Yobe</option>
                    <option value="bauchi">Bauchi</option>
                    <option value="gombe">Gombe</option>
                    <option value="adamawa">Adamawa</option>
                    <option value="taraba">Taraba</option>
                    <option value="cross_river">Cross River</option>
                    <option value="akwa_ibom">Akwa Ibom</option>
                    <option value="bayelsa">Bayelsa</option>
                    <option value="delta">Delta</option>
                    <option value="edo">Edo</option>
                    <option value="anambra">Anambra</option>
                    <option value="enugu">Enugu</option>
                    <option value="ebonyi">Ebonyi</option>
                    <option value="imo">Imo</option>
                    <option value="abia">Abia</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-gray-500 mb-1">LGA</label>
                  <input 
                    type="text" 
                    name="lga" 
                    value={formData.lga} 
                    onChange={handleChange} 
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-gray-500 mb-1">Nationality</label>
                  <input 
                    type="text" 
                    name="nationality" 
                    value={formData.nationality} 
                    onChange={handleChange} 
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Parent Information */}
            <div>
              <Text variant="small" className="font-semibold text-gray-900 mb-4 pb-2 border-b flex items-center gap-2">
                <Briefcase size={14} className="text-[#D94801]" /> Parent Information
              </Text>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-medium text-gray-500 mb-1">Parent Type</label>
                  <select 
                    name="parent_type" 
                    value={formData.parent_type} 
                    onChange={handleChange} 
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
                  >
                    <option value="father">Father</option>
                    <option value="mother">Mother</option>
                    <option value="guardian">Guardian</option>
                    <option value="relative">Relative</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-gray-500 mb-1">Marital Status</label>
                  <select 
                    name="marital_status" 
                    value={formData.marital_status} 
                    onChange={handleChange} 
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
                  >
                    <option value="married">Married</option>
                    <option value="single">Single</option>
                    <option value="divorced">Divorced</option>
                    <option value="widowed">Widowed</option>
                    <option value="separated">Separated</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-gray-500 mb-1">Occupation</label>
                  <input 
                    type="text" 
                    name="occupation" 
                    value={formData.occupation} 
                    onChange={handleChange} 
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-gray-500 mb-1">Employer</label>
                  <input 
                    type="text" 
                    name="employer" 
                    value={formData.employer} 
                    onChange={handleChange} 
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-gray-500 mb-1">Office Phone</label>
                  <input 
                    type="tel" 
                    name="office_phone" 
                    value={formData.office_phone} 
                    onChange={handleChange} 
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-gray-500 mb-1">Preferred Communication</label>
                  <select 
                    name="preferred_communication" 
                    value={formData.preferred_communication} 
                    onChange={handleChange} 
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
                  >
                    <option value="email">Email</option>
                    <option value="sms">SMS</option>
                    <option value="phone">Phone Call</option>
                    <option value="whatsapp">WhatsApp</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div>
              <Text variant="small" className="font-semibold text-gray-900 mb-4 pb-2 border-b flex items-center gap-2">
                <Heart size={14} className="text-[#D94801]" /> Emergency Contact
              </Text>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-medium text-gray-500 mb-1">Contact Name</label>
                  <input 
                    type="text" 
                    name="emergency_contact_name" 
                    value={formData.emergency_contact_name} 
                    onChange={handleChange} 
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-gray-500 mb-1">Contact Phone</label>
                  <input 
                    type="tel" 
                    name="emergency_contact_phone" 
                    value={formData.emergency_contact_phone} 
                    onChange={handleChange} 
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-gray-500 mb-1">Relationship</label>
                  <input 
                    type="text" 
                    name="emergency_contact_relationship" 
                    value={formData.emergency_contact_relationship} 
                    onChange={handleChange} 
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm"
                  />
                </div>
              </div>
            </div>

            {/* PTA & Status */}
            <div>
              <Text variant="small" className="font-semibold text-gray-900 mb-4 pb-2 border-b flex items-center gap-2">
                <Shield size={14} className="text-[#D94801]" /> PTA & Status
              </Text>
              <div className="flex flex-wrap gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="is_pta_member" 
                    checked={formData.is_pta_member} 
                    onChange={handleChange} 
                    className="w-3 h-3 rounded border-gray-300 focus:ring-[#D94801]"
                  />
                  <span className="text-xs text-gray-700">PTA Member</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="receive_sms_alerts" 
                    checked={formData.receive_sms_alerts} 
                    onChange={handleChange} 
                    className="w-3 h-3 rounded border-gray-300 focus:ring-[#D94801]"
                  />
                  <span className="text-xs text-gray-700">SMS Alerts</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="receive_email_alerts" 
                    checked={formData.receive_email_alerts} 
                    onChange={handleChange} 
                    className="w-3 h-3 rounded border-gray-300 focus:ring-[#D94801]"
                  />
                  <span className="text-xs text-gray-700">Email Alerts</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="is_active" 
                    checked={formData.is_active} 
                    onChange={handleChange} 
                    className="w-3 h-3 rounded border-gray-300 focus:ring-[#D94801]"
                  />
                  <span className="text-xs text-gray-700">Active</span>
                </label>
              </div>
              {formData.is_pta_member && (
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-[10px] font-medium text-gray-500 mb-1">PTA Position</label>
                    <input 
                      type="text" 
                      name="pta_position" 
                      value={formData.pta_position} 
                      onChange={handleChange} 
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-gray-500 mb-1">PTA Committee</label>
                    <input 
                      type="text" 
                      name="pta_committee" 
                      value={formData.pta_committee} 
                      onChange={handleChange} 
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <Button variant="outline" onClick={() => navigate(`/parents/${id}`)} className="flex-1">Cancel</Button>
              <Button variant="primary" type="submit" loading={saving} className="flex-1"><Save size={14} className="mr-2" /> Save Changes</Button>
            </div>
          </Card>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default ParentEdit;