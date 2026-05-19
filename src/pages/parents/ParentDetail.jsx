// src/pages/parents/ParentDetail.jsx - COMPLETE FIX

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import Alert from '../../components/common/Alert';
import { Text, Button, Card } from '../../components/ui';
import { 
  User, Mail, Phone, MapPin, Briefcase, Heart, Users, Shield, 
  Edit2, Lock, UserX, Eye, Calendar, Home, Building, CreditCard, 
  Fingerprint, Award, CheckCircle, XCircle, AlertCircle, RefreshCw,
  ArrowLeft, Printer, UserCheck, GraduationCap, BookOpen, DollarSign
} from 'lucide-react';
import parentService from '../../services/parentService';
import useAuth from '../../hooks/useAuth';
import { printParentRecord } from './components/ParentPrintUtils';

const ParentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const isAdmin = ['head', 'hm', 'principal', 'vice_principal', 'secretary', 'accountant'].includes(user?.role);
  const canEdit = isAdmin;

  const [parent, setParent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [archiveReason, setArchiveReason] = useState('');
  const [archiveLoading, setArchiveLoading] = useState(false);

  useEffect(() => {
    loadParent();
  }, [id]);

  const loadParent = async () => {
    try {
      setLoading(true);
      const response = await parentService.getParentById(id);
      console.log('📊 Full API Response:', response);
      
      // The response might be nested
      let parentData = response.parent || response;
      console.log('📊 Parent Data:', parentData);
      console.log('📊 User Data:', parentData.user);
      console.log('📊 Parent full_name:', parentData.full_name);
      console.log('📊 Parent name:', parentData.name);
      
      setParent(parentData);
    } catch (err) {
      console.error('Error loading parent:', err);
      setError('Failed to load parent details');
    } finally {
      setLoading(false);
    }
  };

  const handleArchive = async () => {
    try {
      setArchiveLoading(true);
      await parentService.archiveParent(id, archiveReason);
      setSuccess('Parent archived successfully');
      setTimeout(() => {
        navigate('/parents');
      }, 1500);
    } catch (err) {
      setError('Failed to archive parent');
    } finally {
      setArchiveLoading(false);
    }
  };

  const handlePrint = () => {
    if (parent) {
      printParentRecord(parent);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  if (loading) {
    return (
      <DashboardLayout title="Parent Details">
        <div className="flex justify-center py-12">
          <RefreshCw className="animate-spin h-8 w-8 text-[#D94801]" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Parent Details">
        <div className="text-center py-12">
          <AlertCircle size={48} className="mx-auto text-red-500 mb-3" />
          <Text variant="body" className="text-gray-500">{error}</Text>
          <Button variant="primary" className="mt-4" onClick={() => navigate('/parents')}>Back to Parents</Button>
        </div>
      </DashboardLayout>
    );
  }

  if (!parent) {
    return (
      <DashboardLayout title="Not Found">
        <div className="text-center py-12">
          <User size={48} className="mx-auto text-gray-300 mb-3" />
          <Text variant="body" className="text-gray-500">Parent not found</Text>
          <Button variant="primary" className="mt-4" onClick={() => navigate('/parents')}>Back to Parents</Button>
        </div>
      </DashboardLayout>
    );
  }

  // =====================
  // FIXED: Extract name EXACTLY like the table does
  // =====================
  const userData = parent.user || {};
  
  // Use the SAME logic as ParentTable.jsx
  const fullName = parent.full_name || 
                   parent.user?.full_name || 
                   `${parent.user?.first_name || ''} ${parent.user?.last_name || ''}`.trim() || 
                   `${userData.first_name || ''} ${userData.last_name || ''}`.trim() ||
                   'Unknown Parent';
  
  // Also get first_name and last_name separately
  const firstName = userData.first_name || parent.user?.first_name || '';
  const lastName = userData.last_name || parent.user?.last_name || '';
  
  // Extract other data
  const email = parent.email || userData.email || parent.user?.email || 'Not provided';
  const phone = parent.phone || userData.phone_number || parent.user?.phone_number || 'Not provided';
  const registrationNumber = parent.registration_number || userData.registration_number || parent.user?.registration_number || 'N/A';
  const address = parent.address || userData.address || parent.user?.address || 'No address';
  const children = parent.children || [];
  const isActive = parent.is_active !== false;
  const isPtaMember = parent.is_pta_member || false;
  const occupation = parent.occupation || 'Not specified';
  const employer = parent.employer || 'Not specified';
  const officePhone = parent.office_phone || 'Not specified';
  const maritalStatus = parent.marital_status || 'Not specified';
  const parentType = parent.parent_type || 'other';
  const gender = userData.gender || parent.user?.gender || 'Not specified';
  const dateOfBirth = userData.date_of_birth || parent.user?.date_of_birth || '';
  const nationality = userData.nationality || parent.user?.nationality || 'Nigerian';
  const city = userData.city || parent.user?.city || '';
  const stateOfOrigin = userData.state_of_origin || parent.user?.state_of_origin || '';
  const lga = userData.lga || parent.user?.lga || '';
  
  // Emergency contact
  const emergencyName = parent.emergency_contact_name || '';
  const emergencyPhone = parent.emergency_contact_phone || '';
  const emergencyRelationship = parent.emergency_contact_relationship || '';

  console.log('✅ Final extracted name:', fullName);
  console.log('✅ First name:', firstName);
  console.log('✅ Last name:', lastName);

  return (
    <DashboardLayout title="Parent Details">
      <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-6 py-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/parents')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft size={20} />
            </button>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <Text variant="h2" className="font-bold">{fullName}</Text>
                {isActive ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-100 text-green-700">
                    <UserCheck size={12} /> Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-100 text-red-700">
                    <UserX size={12} /> Archived
                  </span>
                )}
              </div>
              <Text variant="caption" className="text-gray-400">
                Parent ID: {parent.parent_id} • Reg: {registrationNumber}
              </Text>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="small" icon={Printer} onClick={handlePrint}>Print</Button>
            {canEdit && (
              <>
                <Link to={`/parents/${id}/edit`}>
                  <Button variant="primary" size="small" icon={Edit2}>Edit</Button>
                </Link>
                {isActive ? (
                  <Button variant="danger" size="small" icon={UserX} onClick={() => setShowArchiveModal(true)}>Archive</Button>
                ) : (
                  <Button variant="success" size="small" icon={RefreshCw} onClick={() => parentService.restoreParent(id).then(() => { setSuccess('Parent restored'); loadParent(); })}>Restore</Button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Alerts */}
        {error && <Alert type="error" message={error} onClose={() => setError('')} className="mb-4" />}
        {success && <Alert type="success" message={success} onClose={() => setSuccess('')} className="mb-4" />}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Profile Card */}
          <Card className="p-5">
            <div className="text-center">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User size={40} className="text-blue-600" />
              </div>
              <Text variant="h3" className="font-bold">{fullName}</Text>
              <Text variant="tiny" className="text-gray-400 font-mono mt-1">{registrationNumber}</Text>
              <div className="flex flex-wrap justify-center gap-2 mt-3">
                {isActive && <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium bg-green-100 text-green-700"><CheckCircle size={10} /> Active</span>}
                {isPtaMember && <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium bg-purple-100 text-purple-700"><Award size={10} /> PTA Member</span>}
              </div>
            </div>
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 text-sm"><Phone size={16} className="text-gray-400" /><span>{phone}</span></div>
              <div className="flex items-center gap-3 text-sm"><Mail size={16} className="text-gray-400" /><span>{email}</span></div>
              <div className="flex items-center gap-3 text-sm"><Briefcase size={16} className="text-gray-400" /><span>{occupation}</span></div>
              <div className="flex items-center gap-3 text-sm"><Users size={16} className="text-gray-400" /><span>{children.length} child{children.length !== 1 ? 'ren' : ''}</span></div>
            </div>
          </Card>

          {/* Right Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Personal Information */}
            <Card className="p-5">
              <Text variant="small" className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><User size={16} className="text-[#D94801]" /> Personal Information</Text>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><Text variant="tiny" className="text-gray-400">Full Name</Text><Text variant="small" className="font-medium">{fullName}</Text></div>
                <div><Text variant="tiny" className="text-gray-400">First Name</Text><Text variant="small" className="font-medium">{firstName || 'Not specified'}</Text></div>
                <div><Text variant="tiny" className="text-gray-400">Last Name</Text><Text variant="small" className="font-medium">{lastName || 'Not specified'}</Text></div>
                <div><Text variant="tiny" className="text-gray-400">Parent Type</Text><Text variant="small" className="font-medium">{parentType.charAt(0).toUpperCase() + parentType.slice(1)}</Text></div>
                <div><Text variant="tiny" className="text-gray-400">Marital Status</Text><Text variant="small" className="font-medium">{maritalStatus.charAt(0).toUpperCase() + maritalStatus.slice(1)}</Text></div>
                <div><Text variant="tiny" className="text-gray-400">Gender</Text><Text variant="small" className="font-medium">{gender.charAt(0).toUpperCase() + gender.slice(1)}</Text></div>
                <div><Text variant="tiny" className="text-gray-400">Date of Birth</Text><Text variant="small" className="font-medium">{formatDate(dateOfBirth)}</Text></div>
                <div><Text variant="tiny" className="text-gray-400">Registration Number</Text><Text variant="small" className="font-medium font-mono">{registrationNumber}</Text></div>
                <div><Text variant="tiny" className="text-gray-400">Nationality</Text><Text variant="small" className="font-medium">{nationality}</Text></div>
                <div><Text variant="tiny" className="text-gray-400">Occupation</Text><Text variant="small" className="font-medium">{occupation}</Text></div>
                <div><Text variant="tiny" className="text-gray-400">Employer</Text><Text variant="small" className="font-medium">{employer}</Text></div>
                <div><Text variant="tiny" className="text-gray-400">Office Phone</Text><Text variant="small" className="font-medium">{officePhone}</Text></div>
              </div>
            </Card>

            {/* Address */}
            {(address || city || stateOfOrigin) && (
              <Card className="p-5">
                <Text variant="small" className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><MapPin size={16} className="text-[#D94801]" /> Address</Text>
                <Text variant="small">{address}</Text>
                {(city || stateOfOrigin) && (
                  <Text variant="tiny" className="text-gray-500 mt-1">{city}, {stateOfOrigin}</Text>
                )}
                {lga && <Text variant="tiny" className="text-gray-500">LGA: {lga}</Text>}
              </Card>
            )}

            {/* Emergency Contact */}
            {(emergencyName || emergencyPhone) && (
              <Card className="p-5">
                <Text variant="small" className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><Heart size={16} className="text-[#D94801]" /> Emergency Contact</Text>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {emergencyName && <div><Text variant="tiny" className="text-gray-400">Name</Text><Text variant="small">{emergencyName}</Text></div>}
                  {emergencyPhone && <div><Text variant="tiny" className="text-gray-400">Phone</Text><Text variant="small">{emergencyPhone}</Text></div>}
                  {emergencyRelationship && <div><Text variant="tiny" className="text-gray-400">Relationship</Text><Text variant="small">{emergencyRelationship}</Text></div>}
                </div>
              </Card>
            )}

            {/* Children */}
            {children.length > 0 && (
              <Card className="p-5">
                <Text variant="small" className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><GraduationCap size={16} className="text-[#D94801]" /> Children ({children.length})</Text>
                <div className="space-y-3">
                  {children.map((child, idx) => {
                    const childUser = child.user || {};
                    const childName = child.full_name || 
                                    `${childUser.first_name || ''} ${childUser.last_name || ''}`.trim() || 
                                    child.name || 
                                    'Unknown';
                    return (
                      <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => navigate(`/students/${child.id}`)}>
                        <div className="mb-2 sm:mb-0">
                          <Text variant="small" className="font-medium text-gray-800">{childName}</Text>
                          <Text variant="tiny" className="text-gray-500">{child.class_level?.name || child.class_level_name || 'Not assigned'}</Text>
                        </div>
                        <div className="text-left sm:text-right">
                          <Text variant="tiny" className="font-mono text-gray-600">Adm: {child.admission_number || 'N/A'}</Text>
                          <Text variant="tiny" className="text-gray-400">ID: {child.student_id || 'N/A'}</Text>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Archive Modal */}
      {showArchiveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserX size={20} className="text-red-600" />
              </div>
              <Text variant="h4" className="font-semibold mb-2">Archive {fullName}?</Text>
              <Text variant="caption" className="text-gray-500 mb-4 block">This parent will no longer be able to log in to the parent portal.</Text>
              <textarea 
                value={archiveReason} 
                onChange={(e) => setArchiveReason(e.target.value)} 
                rows={2} 
                placeholder="Reason for archiving..." 
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm mb-4"
              />
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowArchiveModal(false)} className="flex-1">Cancel</Button>
                <Button variant="danger" onClick={handleArchive} disabled={archiveLoading} className="flex-1">
                  {archiveLoading ? 'Archiving...' : 'Archive Parent'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ParentDetail;