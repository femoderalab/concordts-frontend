import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import Modal from '../../components/common/modal';
import useAuth from '../../hooks/useAuth';
import { 
  getAllStaff,
  getStaffById,
  updateStaff,
  deleteStaff,
  searchStaff,
  updateStaffPassword,
  activateStaff,
  deactivateStaff
} from '../../services/staffService';

import { 
  Search, Filter, Eye, Edit2, Trash2, UserPlus, ChevronLeft, ChevronRight,
  User, Phone, Mail, DollarSign, Shield, XCircle, RefreshCw, Lock,
  UserCheck, UserX, Award, FileText, Heart, Briefcase, 
  Award as CertificateIcon, CreditCard, ShieldAlert
} from 'lucide-react';

const StaffList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const isAdmin = user?.role === 'head' || user?.role === 'hm' || 
                  user?.role === 'principal' || user?.role === 'vice_principal' ||
                  user?.is_staff;
  const isAccountant = user?.role === 'accountant';
  const canViewStaff = isAdmin || isAccountant || user?.role === 'secretary';
  
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalStaff, setTotalStaff] = useState(0);
  const staffPerPage = 10;
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    department: '', employment_type: '', is_active: '', is_on_leave: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [staffDetails, setStaffDetails] = useState(null);
  
  const [editForm, setEditForm] = useState({
    first_name: '', last_name: '', email: '', phone_number: '', gender: '',
    date_of_birth: '', address: '', city: '', state_of_origin: '', lga: '',
    nationality: '', staff_id: '', employment_date: '', employment_type: '',
    department: '', position_title: '', highest_qualification: '',
    qualification_institution: '', year_of_graduation: '', professional_certifications: '',
    trcn_number: '', trcn_expiry_date: '', specialization: '', basic_salary: '',
    salary_scale: '', salary_step: '', bank_name: '', account_name: '', account_number: '',
    annual_leave_days: '', sick_leave_days: '', next_of_kin_name: '', next_of_kin_relationship: '',
    next_of_kin_phone: '', next_of_kin_address: '', blood_group: '', genotype: '',
    medical_conditions: '', allergies: '', emergency_contact_name: '', emergency_contact_phone: '',
    emergency_contact_relationship: '', years_of_experience: '', previous_employers: '',
    references: '', is_active: true, is_on_probation: false, probation_end_date: '',
    is_retired: false, retirement_date: '', is_on_leave: false, leave_start_date: '',
    leave_end_date: '', performance_rating: '', last_appraisal_date: '', next_appraisal_date: '',
    appraisal_notes: '', resume: null, certificates: null, id_copy: null, passport_photo: null
  });
  
  const [passwordForm, setPasswordForm] = useState({ new_password: '', confirm_password: '' });
  const [editLoading, setEditLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [editErrors, setEditErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});

  useEffect(() => {
    if (canViewStaff) {
      loadStaff();
    }
  }, [currentPage, canViewStaff]);

  // const loadStaff = useCallback(async () => {
  //   try {
  //     setLoading(true);
  //     setError('');
      
  //     const params = { page: currentPage, page_size: staffPerPage, ...filters };
  //     Object.keys(params).forEach(key => {
  //       if (params[key] === '' || params[key] === null || params[key] === undefined) {
  //         delete params[key];
  //       }
  //     });
      
  //     let response;
  //     if (searchTerm.trim()) {
  //       response = await searchStaff(searchTerm, params);
  //     } else {
  //       response = await getAllStaff(params);
  //     }
      
  //     if (response && typeof response === 'object') {
  //       if (response.success === false) {
  //         setStaff([]);
  //         setTotalPages(1);
  //         setTotalStaff(0);
  //       } else if (response.results) {
  //         setStaff(response.results || []);
  //         setTotalPages(response.total_pages || 1);
  //         setTotalStaff(response.count || 0);
  //       } else if (response.data && Array.isArray(response.data.results)) {
  //         setStaff(response.data.results || []);
  //         setTotalPages(response.data.total_pages || 1);
  //         setTotalStaff(response.data.count || 0);
  //       } else if (Array.isArray(response)) {
  //         setStaff(response);
  //         setTotalPages(1);
  //         setTotalStaff(response.length);
  //       } else if (response.data && Array.isArray(response.data)) {
  //         setStaff(response.data);
  //         setTotalPages(1);
  //         setTotalStaff(response.data.length);
  //       } else {
  //         setStaff([]);
  //         setTotalPages(1);
  //         setTotalStaff(0);
  //       }
  //     } else {
  //       setStaff([]);
  //       setTotalPages(1);
  //       setTotalStaff(0);
  //     }
  //   } catch (err) {
  //     setError('Failed to load staff. Please try again.');
  //     setStaff([]);
  //     setTotalPages(1);
  //     setTotalStaff(0);
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [currentPage, filters, searchTerm]);

  const loadStaff = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      const params = { page: currentPage, page_size: staffPerPage, ...filters };
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });
      
      let response;
      if (searchTerm.trim()) {
        response = await searchStaff(searchTerm, params);
      } else {
        response = await getAllStaff(params);
      }
      
      if (response && typeof response === 'object') {
        let staffList = [];
        
        if (response.success === false) {
          staffList = [];
        } else if (response.results) {
          staffList = response.results || [];
        } else if (response.data && Array.isArray(response.data.results)) {
          staffList = response.data.results || [];
        } else if (Array.isArray(response)) {
          staffList = response;
        } else if (response.data && Array.isArray(response.data)) {
          staffList = response.data;
        }
        
        // Fetch full details for each staff member to get user data
        const staffWithDetails = await Promise.all(
          staffList.map(async (staffMember) => {
            try {
              const details = await getStaffById(staffMember.id);
              let staffData;
              
              if (details.staff) {
                staffData = details.staff;
              } else if (details.data && details.data.staff) {
                staffData = details.data.staff;
              } else if (details.data) {
                staffData = details.data;
              } else {
                staffData = details;
              }
              
              return staffData;
            } catch (err) {
              console.error(`Failed to fetch details for staff ${staffMember.id}:`, err);
              return staffMember; // Return original if fetch fails
            }
          })
        );
        
        setStaff(staffWithDetails);
        setTotalPages(response.total_pages || 1);
        setTotalStaff(response.count || staffWithDetails.length);
      } else {
        setStaff([]);
        setTotalPages(1);
        setTotalStaff(0);
      }
    } catch (err) {
      setError('Failed to load staff. Please try again.');
      setStaff([]);
      setTotalPages(1);
      setTotalStaff(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, filters, searchTerm]);

  const renderStaffRow = (staffMember) => {
    const user = staffMember.user || {};
    
    // Extract names properly
    const fullName = user.full_name || '';
    const firstName = user.first_name || fullName.split(' ')[0] || 'N/A';
    const lastName = user.last_name || fullName.split(' ').slice(1).join(' ') || 'N/A';
    const displayName = fullName || `${firstName} ${lastName}`;
    
    const email = user.email || 'Not provided';
    const phone = user.phone_number || 'Not provided';
    const registrationNumber = user.registration_number || 'N/A';
    const positionTitle = staffMember.position_title || 'Not Specified';
    const staffId = staffMember.staff_id || 'No ID';
    
    // Get image
    const imageUrl = staffMember.passport_photo || user.profile_picture || null;
    
    return (
      <tr key={staffMember.id} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
        <td className="py-4 px-4">
          <button onClick={() => handleViewStaff(staffMember)} className="text-left hover:text-secondary-700 transition-colors w-full">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-secondary-100 rounded-full flex items-center justify-center mr-3 overflow-hidden flex-shrink-0">
                {imageUrl ? (
                  <img 
                    src={imageUrl} 
                    alt={displayName} 
                    className="w-full h-full object-cover"
                    onError={(e) => { 
                      e.target.style.display = 'none'; 
                      e.target.parentElement.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-secondary-600"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>'; 
                    }}
                  />
                ) : (
                  <User size={18} className="text-secondary-600" />
                )}
              </div>
              <div className="min-w-0">
                <div className="font-medium text-neutral-800 truncate">{displayName}</div>
              </div>
            </div>
          </button>
        </td>
        <td className="py-4 px-4">
          <div className="space-y-1">
            <div className="text-sm font-medium flex items-center text-neutral-700">
              <Mail size={14} className="mr-1 text-neutral-400 flex-shrink-0" />
              <span className="truncate">{email}</span>
            </div>
            <div className="text-sm flex items-center text-neutral-500">
              <Phone size={14} className="mr-1 text-neutral-400 flex-shrink-0" />
              <span className="truncate">{phone}</span>
            </div>
            <div className="text-xs text-neutral-400">Reg: {registrationNumber}</div>
          </div>
        </td>
        <td className="py-4 px-4">
          <div className="space-y-1">
            {renderDepartmentBadge(staffMember)}
            <div className="text-sm text-neutral-500 flex items-center">
              <Briefcase size={14} className="mr-1 text-neutral-400 flex-shrink-0" />
              <span className="truncate">{positionTitle}</span>
            </div>
          </div>
        </td>
        <td className="py-4 px-4">
          <div className="space-y-2">
            {renderStatusBadge(staffMember)}
            {renderRoleBadge(staffMember)}
          </div>
        </td>
        <td className="py-4 px-4">
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => handleViewStaff(staffMember)} 
              className="p-2 bg-secondary-100 text-secondary-600 hover:bg-secondary-200 rounded-lg transition-colors" 
              title="View Details"
            >
              <Eye size={18} />
            </button>
            {isAdmin && (
              <>
                <button 
                  onClick={() => handlePasswordClick(staffMember)} 
                  className="p-2 bg-secondary-100 text-secondary-600 hover:bg-secondary-200 rounded-lg transition-colors" 
                  title="Reset Password"
                >
                  <Lock size={18} />
                </button>
                {staffMember.is_active ? (
                  <button 
                    onClick={() => handleDeactivateClick(staffMember)} 
                    className="p-2 bg-yellow-100 text-yellow-600 hover:bg-yellow-200 rounded-lg transition-colors" 
                    title="Deactivate Staff"
                  >
                    <UserX size={18} />
                  </button>
                ) : (
                  <button 
                    onClick={() => handleActivateClick(staffMember)} 
                    className="p-2 bg-green-100 text-green-600 hover:bg-green-200 rounded-lg transition-colors" 
                    title="Activate Staff"
                  >
                    <UserCheck size={18} />
                  </button>
                )}
                <button 
                  onClick={() => handleDeleteClick(staffMember)} 
                  className="p-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition-colors" 
                  title="Delete Staff"
                >
                  <Trash2 size={18} />
                </button>
              </>
            )}
          </div>
        </td>
      </tr>
    );
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setCurrentPage(1);
    await loadStaff();
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    setCurrentPage(1);
    loadStaff();
    setShowFilters(false);
  };

  const clearFilters = () => {
    setFilters({ department: '', employment_type: '', is_active: '', is_on_leave: '' });
    setSearchTerm('');
    setCurrentPage(1);
    loadStaff();
  };

  const handleViewStaff = async (staffMember) => {
    try {
      setDetailLoading(true);
      setSelectedStaff(staffMember);
      
      const details = await getStaffById(staffMember.id);
      
      let staffData;
      if (details.staff) {
        staffData = details.staff;
      } else if (details.data && details.data.staff) {
        staffData = details.data.staff;
      } else if (details.data) {
        staffData = details.data;
      } else {
        staffData = details;
      }
      
      if (!staffData.user && staffMember.user) {
        staffData.user = staffMember.user;
      }
      
      setStaffDetails(staffData);
      setShowViewModal(true);
    } catch (err) {
      setError('Failed to load staff details. Please try again.');
    } finally {
      setDetailLoading(false);
    }
  };

  const handleEditClick = (staffMember) => {
    setSelectedStaff(staffMember);
    const user = staffMember.user || {};
    const fullName = user.full_name || '';
    const nameParts = fullName.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    
    let genderValue = '';
    if (user.gender) {
      const genderLower = user.gender.toLowerCase();
      if (genderLower === 'male' || genderLower === 'female') {
        genderValue = genderLower;
      }
    }
    
    const formData = {
      first_name: firstName, last_name: lastName, email: user.email || '',
      phone_number: user.phone_number || '', gender: genderValue,
      date_of_birth: user.date_of_birth || '', address: user.address || '',
      city: user.city || '', state_of_origin: user.state_of_origin || '',
      lga: user.lga || '', nationality: user.nationality || 'Nigerian',
      staff_id: staffMember.staff_id || '', employment_date: staffMember.employment_date || '',
      employment_type: staffMember.employment_type || 'full_time',
      department: staffMember.department || 'none',
      position_title: staffMember.position_title || '',
      highest_qualification: staffMember.highest_qualification || '',
      qualification_institution: staffMember.qualification_institution || '',
      year_of_graduation: staffMember.year_of_graduation || '',
      professional_certifications: staffMember.professional_certifications || '',
      trcn_number: staffMember.trcn_number || '',
      trcn_expiry_date: staffMember.trcn_expiry_date || '',
      specialization: staffMember.specialization || '',
      basic_salary: staffMember.basic_salary || '',
      salary_scale: staffMember.salary_scale || '',
      salary_step: staffMember.salary_step || 1,
      bank_name: staffMember.bank_name || '',
      account_name: staffMember.account_name || '',
      account_number: staffMember.account_number || '',
      annual_leave_days: staffMember.annual_leave_days || 21,
      sick_leave_days: staffMember.sick_leave_days || 10,
      next_of_kin_name: staffMember.next_of_kin_name || '',
      next_of_kin_relationship: staffMember.next_of_kin_relationship || '',
      next_of_kin_phone: staffMember.next_of_kin_phone || '',
      next_of_kin_address: staffMember.next_of_kin_address || '',
      blood_group: staffMember.blood_group || '',
      genotype: staffMember.genotype || '',
      medical_conditions: staffMember.medical_conditions || '',
      allergies: staffMember.allergies || '',
      emergency_contact_name: staffMember.emergency_contact_name || '',
      emergency_contact_phone: staffMember.emergency_contact_phone || '',
      emergency_contact_relationship: staffMember.emergency_contact_relationship || '',
      years_of_experience: staffMember.years_of_experience || 0,
      previous_employers: staffMember.previous_employers || '',
      references: staffMember.references || '',
      is_active: staffMember.is_active !== undefined ? staffMember.is_active : true,
      is_on_probation: staffMember.is_on_probation || false,
      probation_end_date: staffMember.probation_end_date || '',
      is_retired: staffMember.is_retired || false,
      retirement_date: staffMember.retirement_date || '',
      is_on_leave: staffMember.is_on_leave || false,
      leave_start_date: staffMember.leave_start_date || '',
      leave_end_date: staffMember.leave_end_date || '',
      performance_rating: staffMember.performance_rating || 0,
      last_appraisal_date: staffMember.last_appraisal_date || '',
      next_appraisal_date: staffMember.next_appraisal_date || '',
      appraisal_notes: staffMember.appraisal_notes || '',
      resume: null, certificates: null, id_copy: null, passport_photo: null
    };
    
    setEditForm(formData);
    setEditErrors({});
    setShowEditModal(true);
  };

  // Submit password reset - UPDATED FOR SIMPLE PASSWORDS (MIN 5 CHARACTERS)
  const submitPasswordReset = async (e) => {
    e.preventDefault();
    
    // SIMPLE VALIDATION - only check required and match
    const errors = {};
    if (!passwordForm.new_password) errors.new_password = 'New password is required';
    if (!passwordForm.confirm_password) errors.confirm_password = 'Please confirm password';
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      errors.confirm_password = 'Passwords do not match';
    }
    
    // SIMPLE: Only check minimum 5 characters - no other validation
    if (passwordForm.new_password && passwordForm.new_password.length < 5) {
      errors.new_password = 'Password must be at least 5 characters long';
    }
    
    setPasswordErrors(errors);
    if (Object.keys(errors).length > 0) return;
    
    try {
      setPasswordLoading(true);
      setError('');
      
      // Call the password update API
      await updateStaffPassword(selectedStaff.id, {
        new_password: passwordForm.new_password,
        confirm_password: passwordForm.confirm_password
      });
      
      const staffName = selectedStaff?.user?.first_name 
        ? `${selectedStaff.user.first_name} ${selectedStaff.user.last_name || ''}`
        : selectedStaff?.staff_id || 'Staff';
      
      setSuccess(`Password reset successfully for ${staffName}`);
      setShowPasswordModal(false);
      setSelectedStaff(null);
      setPasswordForm({ new_password: '', confirm_password: '' });
      setPasswordErrors({});
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('❌ Error resetting password:', err);
      setError(err.message || 'Failed to reset password. Please try again.');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteClick = (staffMember) => {
    setSelectedStaff(staffMember);
    setShowDeleteModal(true);
  };

  const handlePasswordClick = (staffMember) => {
    setSelectedStaff(staffMember);
    setPasswordForm({ new_password: '', confirm_password: '' });
    setPasswordErrors({});
    setShowPasswordModal(true);
  };

  const handleActivateClick = async (staffMember) => {
    try {
      if (window.confirm(`Activate staff member ${staffMember.user?.first_name}?`)) {
        await activateStaff(staffMember.id, {
          is_active: true,
          activation_date: new Date().toISOString().split('T')[0],
          reason: 'Reactivated by admin'
        });
        setSuccess(`Staff ${staffMember.user?.first_name} activated successfully!`);
        loadStaff();
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to activate staff. Please try again.');
    }
  };

  const handleDeactivateClick = async (staffMember) => {
    if (window.confirm('Are you sure you want to deactivate this staff member?')) {
      try {
        await deactivateStaff(staffMember.id, {
          is_active: false,
          activation_date: new Date().toISOString().split('T')[0],
          reason: 'Deactivated by admin'
        });
        setSuccess(`Staff ${staffMember.user?.first_name} deactivated successfully!`);
        loadStaff();
      } catch (err) {
        setError(err.response?.data?.error || err.message || 'Failed to deactivate staff. Please try again.');
      }
    }
  };

  const confirmDelete = async () => {
    if (!selectedStaff) return;
    
    try {
      await deleteStaff(selectedStaff.id);
      const staffName = selectedStaff.user?.first_name 
        ? `${selectedStaff.user.first_name} ${selectedStaff.user.last_name || ''}`
        : selectedStaff.staff_id || 'Staff';
      
      setSuccess(`Staff ${staffName} deleted successfully!`);
      setShowDeleteModal(false);
      setSelectedStaff(null);
      loadStaff();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to delete staff. Please try again.');
    }
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'file') {
      setEditForm(prev => ({ ...prev, [name]: files[0] }));
    } else if (type === 'checkbox') {
      setEditForm(prev => ({ ...prev, [name]: checked }));
    } else {
      setEditForm(prev => ({ ...prev, [name]: value }));
    }
    
    if (editErrors[name]) {
      setEditErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
    if (passwordErrors[name]) {
      setPasswordErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const submitEditForm = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!editForm.first_name?.trim()) errors.first_name = 'First name is required';
    if (!editForm.last_name?.trim()) errors.last_name = 'Last name is required';
    
    setEditErrors(errors);
    if (Object.keys(errors).length > 0) return;
    
    try {
      setEditLoading(true);
      setError('');
      
      const updatePayload = {
        first_name: editForm.first_name.trim(),
        last_name: editForm.last_name.trim(),
        email: editForm.email?.trim() || null,
        phone_number: editForm.phone_number?.trim() || null,
        gender: editForm.gender || null,
        date_of_birth: editForm.date_of_birth || null,
        address: editForm.address?.trim() || null,
        city: editForm.city?.trim() || null,
        state_of_origin: editForm.state_of_origin?.trim() || null,
        lga: editForm.lga?.trim() || null,
        nationality: editForm.nationality?.trim() || 'Nigerian',
        employment_date: editForm.employment_date || null,
        employment_type: editForm.employment_type || 'full_time',
        department: editForm.department || 'none',
        position_title: editForm.position_title?.trim() || null,
        highest_qualification: editForm.highest_qualification?.trim() || null,
        qualification_institution: editForm.qualification_institution?.trim() || null,
        year_of_graduation: editForm.year_of_graduation ? parseInt(editForm.year_of_graduation) : null,
        professional_certifications: editForm.professional_certifications?.trim() || null,
        trcn_number: editForm.trcn_number?.trim() || null,
        trcn_expiry_date: editForm.trcn_expiry_date || null,
        specialization: editForm.specialization?.trim() || null,
        basic_salary: editForm.basic_salary ? parseFloat(editForm.basic_salary) : 0,
        salary_scale: editForm.salary_scale?.trim() || null,
        salary_step: editForm.salary_step ? parseInt(editForm.salary_step) : 1,
        bank_name: editForm.bank_name?.trim() || null,
        account_name: editForm.account_name?.trim() || null,
        account_number: editForm.account_number?.trim() || null,
        annual_leave_days: editForm.annual_leave_days ? parseInt(editForm.annual_leave_days) : 21,
        sick_leave_days: editForm.sick_leave_days ? parseInt(editForm.sick_leave_days) : 10,
        next_of_kin_name: editForm.next_of_kin_name?.trim() || null,
        next_of_kin_relationship: editForm.next_of_kin_relationship?.trim() || null,
        next_of_kin_phone: editForm.next_of_kin_phone?.trim() || null,
        next_of_kin_address: editForm.next_of_kin_address?.trim() || null,
        blood_group: editForm.blood_group?.trim() || null,
        genotype: editForm.genotype?.trim() || null,
        medical_conditions: editForm.medical_conditions?.trim() || null,
        allergies: editForm.allergies?.trim() || null,
        emergency_contact_name: editForm.emergency_contact_name?.trim() || null,
        emergency_contact_phone: editForm.emergency_contact_phone?.trim() || null,
        emergency_contact_relationship: editForm.emergency_contact_relationship?.trim() || null,
        years_of_experience: editForm.years_of_experience ? parseInt(editForm.years_of_experience) : 0,
        previous_employers: editForm.previous_employers?.trim() || null,
        references: editForm.references?.trim() || null,
        is_active: editForm.is_active,
        is_on_probation: editForm.is_on_probation,
        probation_end_date: editForm.probation_end_date || null,
        is_retired: editForm.is_retired,
        retirement_date: editForm.retirement_date || null,
        is_on_leave: editForm.is_on_leave,
        leave_start_date: editForm.leave_start_date || null,
        leave_end_date: editForm.leave_end_date || null,
        performance_rating: editForm.performance_rating ? parseFloat(editForm.performance_rating) : 0,
        last_appraisal_date: editForm.last_appraisal_date || null,
        next_appraisal_date: editForm.next_appraisal_date || null,
        appraisal_notes: editForm.appraisal_notes?.trim() || null,
      };
      
      Object.keys(updatePayload).forEach(key => {
        if (updatePayload[key] === undefined) {
          updatePayload[key] = null;
        }
      });
      
      if (editForm.resume) updatePayload.resume = editForm.resume;
      if (editForm.certificates) updatePayload.certificates = editForm.certificates;
      if (editForm.id_copy) updatePayload.id_copy = editForm.id_copy;
      if (editForm.passport_photo) updatePayload.passport_photo = editForm.passport_photo;
      
      await updateStaff(selectedStaff.id, updatePayload);
      
      const staffName = `${editForm.first_name} ${editForm.last_name}`;
      setSuccess(`Staff ${staffName} updated successfully!`);
      setShowEditModal(false);
      setSelectedStaff(null);
      setTimeout(() => { loadStaff(); }, 500);
      setTimeout(() => setSuccess(''), 4000);
      
    } catch (err) {
      let errorMessage = 'Failed to update staff. ';
      if (err.response?.data) {
        if (err.response.data.error) {
          errorMessage += err.response.data.error;
        } else if (err.response.data.detail) {
          errorMessage += err.response.data.detail;
        } else if (typeof err.response.data === 'object') {
          const errors = Object.entries(err.response.data)
            .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
            .join('; ');
          errorMessage += errors;
        }
      } else {
        errorMessage += err.message || 'Unknown error';
      }
      setError(errorMessage);
    } finally {
      setEditLoading(false);
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button key={i} onClick={() => setCurrentPage(i)} disabled={loading || currentPage === i}
          className={`px-3 py-1 rounded-lg transition-colors ${currentPage === i ? 'bg-secondary-500 text-white' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 disabled:opacity-50'}`}>
          {i}
        </button>
      );
    }
    
    return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-neutral-200">
        <div className="text-sm text-neutral-600">
          Showing {staff.length > 0 ? ((currentPage - 1) * staffPerPage + 1) : 0} to {Math.min(currentPage * staffPerPage, totalStaff)} of {totalStaff} staff
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1 || loading}
            className="p-2 rounded-lg bg-neutral-100 text-neutral-700 hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            <ChevronLeft size={18} />
          </button>
          <div className="flex items-center space-x-1">{pages}</div>
          <button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages || loading}
            className="p-2 rounded-lg bg-neutral-100 text-neutral-700 hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    );
  };

  const renderStatusBadge = (staffMember) => {
    if (!staffMember.is_active) {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"><UserX size={12} className="mr-1" />Inactive</span>;
    }
    if (staffMember.is_retired) {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"><Award size={12} className="mr-1" />Retired</span>;
    }
    if (staffMember.is_on_leave) {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><ShieldAlert size={12} className="mr-1" />On Leave</span>;
    }
    return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><UserCheck size={12} className="mr-1" />Active</span>;
  };

  const renderDepartmentBadge = (staffMember) => {
    const department = staffMember.department;
    const departmentConfig = {
      'administration': { bg: 'bg-blue-50', text: 'text-blue-700', label: 'Administration' },
      'academic': { bg: 'bg-green-50', text: 'text-green-700', label: 'Academic' },
      'finance': { bg: 'bg-purple-50', text: 'text-purple-700', label: 'Finance' },
      'library': { bg: 'bg-yellow-50', text: 'text-yellow-700', label: 'Library' },
      'laboratory': { bg: 'bg-orange-50', text: 'text-orange-700', label: 'Laboratory' },
      'ict': { bg: 'bg-indigo-50', text: 'text-indigo-700', label: 'ICT' },
      'security': { bg: 'bg-red-50', text: 'text-red-700', label: 'Security' },
      'maintenance': { bg: 'bg-gray-50', text: 'text-gray-700', label: 'Maintenance' },
      'transport': { bg: 'bg-teal-50', text: 'text-teal-700', label: 'Transport' },
      'health': { bg: 'bg-pink-50', text: 'text-pink-700', label: 'Health' },
      'counseling': { bg: 'bg-cyan-50', text: 'text-cyan-700', label: 'Counseling' },
      'sports': { bg: 'bg-lime-50', text: 'text-lime-700', label: 'Sports' },
      'kitchen': { bg: 'bg-amber-50', text: 'text-amber-700', label: 'Kitchen' },
      'none': { bg: 'bg-gray-50', text: 'text-gray-600', label: 'Not Assigned' }
    };
    const config = departmentConfig[department] || departmentConfig.none;
    return <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${config.bg} ${config.text}`}>{config.label}</span>;
  };

  const renderRoleBadge = (staffMember) => {
    const role = staffMember.user?.role;
    const roleConfig = {
      'head': { bg: 'bg-red-50', text: 'text-red-700', label: 'Head of School' },
      'hm': { bg: 'bg-orange-50', text: 'text-orange-700', label: 'Head Master' },
      'principal': { bg: 'bg-purple-50', text: 'text-purple-700', label: 'Principal' },
      'vice_principal': { bg: 'bg-purple-50', text: 'text-purple-600', label: 'Vice Principal' },
      'teacher': { bg: 'bg-blue-50', text: 'text-blue-700', label: 'Teacher' },
      'form_teacher': { bg: 'bg-green-50', text: 'text-green-700', label: 'Form Teacher' },
      'subject_teacher': { bg: 'bg-cyan-50', text: 'text-cyan-700', label: 'Subject Teacher' },
      'accountant': { bg: 'bg-yellow-50', text: 'text-yellow-700', label: 'Accountant' },
      'secretary': { bg: 'bg-gray-50', text: 'text-gray-700', label: 'Secretary' },
      'librarian': { bg: 'bg-indigo-50', text: 'text-indigo-700', label: 'Librarian' },
      'laboratory': { bg: 'bg-teal-50', text: 'text-teal-700', label: 'Lab Technician' },
      'security': { bg: 'bg-red-50', text: 'text-red-600', label: 'Security' },
      'cleaner': { bg: 'bg-gray-50', text: 'text-gray-600', label: 'Cleaner' }
    };
    const config = roleConfig[role] || { bg: 'bg-gray-50', text: 'text-gray-600', label: role || 'Staff' };
    return <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${config.bg} ${config.text}`}>{config.label}</span>;
  };

  const Section = ({ title, icon, children }) => (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="px-4 py-3 border-b border-gray-200">
        <h4 className="text-sm font-semibold text-gray-900 flex items-center">
          {icon && <span className="mr-2 text-gray-600">{icon}</span>}{title}
        </h4>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );

  const InfoRow = ({ label, value, fullWidth = false }) => (
    <div className={fullWidth ? 'col-span-full' : ''}>
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className="text-sm font-medium text-gray-900 bg-gray-50 px-3 py-2 rounded border border-gray-200 break-words">{value}</div>
    </div>
  );

  const renderViewModal = () => {
    if (!staffDetails) return null;
    const staffMember = staffDetails;
    const user = staffMember.user || {};
    const fullName = user.full_name || 'Not Available';
    const email = user.email || 'Not provided';
    const phone = user.phone_number || 'Not provided';
    const gender = user.gender || 'Not specified';
    const dateOfBirth = user.date_of_birth || 'Not provided';
    const address = user.address || 'No address provided';
    const registrationNumber = user.registration_number || 'Not available';
    const staffId = staffMember.staff_id || 'No Staff ID';
    const positionTitle = staffMember.position_title || 'Not Specified';
    const employmentDate = staffMember.employment_date || '—';
    const employmentType = staffMember.employment_type_display || staffMember.get_employment_type_display || 'Full-Time';
    const department = staffMember.department_display || staffMember.get_department_display || 'Not Assigned';
    
    const calculateEmploymentDuration = (employmentDate) => {
      if (!employmentDate) return 'Not specified';
      const startDate = new Date(employmentDate);
      const today = new Date();
      const years = today.getFullYear() - startDate.getFullYear();
      const months = today.getMonth() - startDate.getMonth();
      let totalMonths = years * 12 + months;
      if (today.getDate() < startDate.getDate()) totalMonths--;
      const finalYears = Math.floor(totalMonths / 12);
      const finalMonths = totalMonths % 12;
      return `${finalYears} years, ${finalMonths} months`;
    };
    const employmentDuration = employmentDate ? calculateEmploymentDuration(employmentDate) : 'Not specified';

    return (
      <Modal isOpen={showViewModal} onClose={() => setShowViewModal(false)} title="Staff Details" size="lg">
        {detailLoading ? (
          <div className="py-20 flex justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary-500"></div></div>
        ) : (
          <div className="py-4 max-h-[80vh] overflow-y-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6 pb-6 border-b">
              <div className="w-20 h-20 bg-secondary-100 rounded-lg flex items-center justify-center overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
                {staffMember.passport_photo ? (
                  <img src={staffMember.passport_photo} alt={fullName} className="w-full h-full object-cover"
                    onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>'; }}
                  />
                ) : (
                  <User size={24} className="text-secondary-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold text-gray-900 truncate">{fullName}</h3>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">{staffId}</span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded">{registrationNumber}</span>
                  {renderStatusBadge(staffMember)}
                  {renderDepartmentBadge(staffMember)}
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <div className="flex items-center"><Briefcase size={14} className="text-gray-500 mr-1" /><span className="text-sm font-medium text-gray-700">{positionTitle}</span></div>
                  <span className="text-gray-400">•</span>
                  <div className="flex items-center"><span className="text-sm px-2 py-1 bg-gray-50 text-gray-700 rounded border border-gray-200">{department}</span></div>
                  <span className="text-gray-400">•</span>
                  {renderRoleBadge(staffMember)}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <Section title="Personal Information" icon={<User size={16} />}>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoRow label="Full Name" value={fullName} />
                    <InfoRow label="Registration No" value={registrationNumber} />
                    <InfoRow label="Email" value={email} />
                    <InfoRow label="Phone" value={phone} />
                    <InfoRow label="Gender" value={gender} />
                    <InfoRow label="Date of Birth" value={dateOfBirth} />
                  </div>
                  <InfoRow label="Address" value={address} fullWidth />
                </div>
              </Section>

              <Section title="Employment Information" icon={<Briefcase size={16} />}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoRow label="Staff ID" value={staffId} />
                  <InfoRow label="Department" value={department} />
                  <InfoRow label="Position Title" value={positionTitle} />
                  <InfoRow label="Employment Type" value={employmentType} />
                  <InfoRow label="Employment Date" value={employmentDate} />
                  <InfoRow label="Employment Duration" value={employmentDuration} />
                </div>
              </Section>

              <Section title="Qualification Information" icon={<CertificateIcon size={16} />}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoRow label="Highest Qualification" value={staffMember.highest_qualification || '—'} />
                  <InfoRow label="Institution" value={staffMember.qualification_institution || '—'} />
                  <InfoRow label="Year of Graduation" value={staffMember.year_of_graduation || '—'} />
                  <InfoRow label="TRCN Number" value={staffMember.trcn_number || '—'} />
                  <InfoRow label="Specialization" value={staffMember.specialization || '—'} fullWidth />
                </div>
              </Section>

              <Section title="Salary Information" icon={<DollarSign size={16} />}>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="text-xs text-blue-700 font-medium mb-1">Basic Salary</div>
                    <div className="text-lg font-bold text-blue-800">₦{parseFloat(staffMember.basic_salary || 0).toLocaleString()}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="text-xs text-gray-700 font-medium mb-1">Salary Scale</div>
                    <div className="text-base font-semibold text-gray-800">{staffMember.salary_scale || '—'}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="text-xs text-gray-700 font-medium mb-1">Salary Step</div>
                    <div className="text-base font-semibold text-gray-800">{staffMember.salary_step || '—'}</div>
                  </div>
                </div>
              </Section>

              <Section title="Bank Information" icon={<CreditCard size={16} />}>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                    <div className="text-xs text-green-700 mb-1">Bank Name</div>
                    <div className="text-sm font-medium text-gray-900">{staffMember.bank_name || 'Not provided'}</div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                    <div className="text-xs text-green-700 mb-1">Account Name</div>
                    <div className="text-sm font-medium text-gray-900">{staffMember.account_name || 'Not provided'}</div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                    <div className="text-xs text-green-700 mb-1">Account Number</div>
                    <div className="text-sm font-medium text-gray-900">{staffMember.account_number || 'Not provided'}</div>
                  </div>
                </div>
              </Section>

              <Section title="Health Information" icon={<Heart size={16} />}>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                    <div className="text-xs text-red-700 mb-1">Blood Group</div>
                    <div className="text-sm font-medium text-gray-900">{staffMember.blood_group || 'Not specified'}</div>
                  </div>
                  <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                    <div className="text-xs text-red-700 mb-1">Genotype</div>
                    <div className="text-sm font-medium text-gray-900">{staffMember.genotype || 'Not specified'}</div>
                  </div>
                  <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                    <div className="text-xs text-red-700 mb-1">Medical Conditions</div>
                    <div className="text-sm font-medium text-gray-900">{staffMember.medical_conditions || 'None'}</div>
                  </div>
                  <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                    <div className="text-xs text-red-700 mb-1">Allergies</div>
                    <div className="text-sm font-medium text-gray-900">{staffMember.allergies || 'None'}</div>
                  </div>
                </div>
              </Section>

              <Section title="Document Status" icon={<FileText size={16} />}>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { label: 'Passport Photo', hasFile: staffMember.passport_photo },
                    { label: 'Resume/CV', hasFile: staffMember.resume },
                    { label: 'Certificates', hasFile: staffMember.certificates },
                    { label: 'ID Copy', hasFile: staffMember.id_copy }
                  ].map((doc, idx) => (
                    <div key={idx} className={`p-3 rounded-lg border ${doc.hasFile ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium text-gray-900 truncate">{doc.label}</div>
                          <div className={`text-xs ${doc.hasFile ? 'text-green-600' : 'text-red-600'}`}>{doc.hasFile ? 'Uploaded' : 'Pending'}</div>
                        </div>
                        <div className={`w-2 h-2 rounded-full ml-2 flex-shrink-0 ${doc.hasFile ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex flex-wrap justify-end gap-3">
                <Button onClick={() => { setShowViewModal(false); handleEditClick(staffMember); }} className="bg-secondary-600 hover:bg-secondary-700 text-white px-4 py-2 text-sm font-medium rounded-md flex items-center transition-colors">
                  <Edit2 size={14} className="mr-2" />Edit Staff
                </Button>
                {isAdmin && (
                  <>
                    <Button onClick={() => { setShowViewModal(false); handlePasswordClick(staffMember); }} className="bg-secondary-600 hover:bg-secondary-700 text-white px-4 py-2 text-sm font-medium rounded-md flex items-center transition-colors">
                      <Lock size={14} className="mr-2" />Reset Password
                    </Button>
                    {staffMember.is_active ? (
                      <Button onClick={() => { setShowViewModal(false); handleDeactivateClick(staffMember); }} className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 text-sm font-medium rounded-md flex items-center transition-colors">
                        <UserX size={14} className="mr-2" />Deactivate
                      </Button>
                    ) : (
                      <Button onClick={() => { setShowViewModal(false); handleActivateClick(staffMember); }} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 text-sm font-medium rounded-md flex items-center transition-colors">
                        <UserCheck size={14} className="mr-2" />Activate
                      </Button>
                    )}
                    <Button onClick={() => { setShowViewModal(false); handleDeleteClick(staffMember); }} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-sm font-medium rounded-md flex items-center transition-colors">
                      <Trash2 size={14} className="mr-2" />Delete Staff
                    </Button>
                  </>
                )}
                <Button onClick={() => setShowViewModal(false)} className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-4 py-2 text-sm font-medium rounded-md transition-colors">Close</Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    );
  };

  const renderFiltersDropdown = () => (
    <div className={`absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-strong border border-neutral-200 z-10 ${showFilters ? 'block' : 'hidden'}`}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-neutral-800">Filter Staff</h3>
          <button onClick={clearFilters} className="text-sm text-secondary-600 hover:text-secondary-700">Clear all</button>
        </div>
        <div className="space-y-4">
          <div><label className="block text-sm font-medium text-neutral-700 mb-2">Department</label>
            <select value={filters.department} onChange={(e) => handleFilterChange('department', e.target.value)} className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500">
              <option value="">All Departments</option><option value="administration">Administration</option><option value="academic">Academic</option><option value="finance">Finance</option><option value="library">Library</option><option value="laboratory">Laboratory</option><option value="ict">ICT</option><option value="security">Security</option><option value="maintenance">Maintenance</option><option value="transport">Transport</option><option value="health">Health</option><option value="counseling">Counseling</option><option value="sports">Sports</option><option value="kitchen">Kitchen</option>
            </select>
          </div>
          <div><label className="block text-sm font-medium text-neutral-700 mb-2">Employment Type</label>
            <select value={filters.employment_type} onChange={(e) => handleFilterChange('employment_type', e.target.value)} className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500">
              <option value="">All Types</option><option value="full_time">Full-Time</option><option value="part_time">Part-Time</option><option value="contract">Contract</option><option value="volunteer">Volunteer</option><option value="trainee">Trainee</option><option value="probation">Probation</option>
            </select>
          </div>
          <div><label className="block text-sm font-medium text-neutral-700 mb-2">Status</label>
            <select value={filters.is_active} onChange={(e) => handleFilterChange('is_active', e.target.value)} className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500">
              <option value="">All Status</option><option value="true">Active</option><option value="false">Inactive</option>
            </select>
          </div>
          <div><label className="block text-sm font-medium text-neutral-700 mb-2">Leave Status</label>
            <select value={filters.is_on_leave} onChange={(e) => handleFilterChange('is_on_leave', e.target.value)} className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500">
              <option value="">All</option><option value="true">On Leave</option><option value="false">Not on Leave</option>
            </select>
          </div>
        </div>
        <Button onClick={applyFilters} className="w-full mt-6 bg-secondary-500 hover:bg-secondary-600 text-white">Apply Filters</Button>
      </div>
    </div>
  );

  const renderLoadingState = () => (
    <div className="py-12 text-center">
      <div className="inline-flex items-center justify-center mb-4"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary-500"></div></div>
      <p className="text-neutral-600">Loading staff...</p>
    </div>
  );

  const renderEmptyState = () => (
    <div className="py-16 text-center border-2 border-dashed border-neutral-200 rounded-xl">
      <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4"><User size={24} className="text-neutral-400" /></div>
      <h3 className="text-lg font-medium text-neutral-700 mb-2">No staff found</h3>
      <p className="text-neutral-500 mb-6">{searchTerm || Object.values(filters).some(f => f) ? 'Try adjusting your search or filters' : 'No staff have been added yet'}</p>
      {isAdmin && (
        <button onClick={() => navigate('/staff/create')} className="inline-flex items-center px-4 py-2 bg-secondary-500 text-white rounded-lg hover:bg-secondary-600 transition-colors">
          <UserPlus size={18} className="mr-2" />Add First Staff
        </button>
      )}
    </div>
  );



  if (!canViewStaff) {
    return (
      <DashboardLayout title="Access Denied">
        <div className="bg-white rounded-xl shadow-soft p-8 text-center border border-neutral-100">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"><Shield className="text-red-600" size={24} /></div>
          <h1 className="text-2xl font-heading font-bold text-neutral-800 mb-4">Access Denied</h1>
          <p className="text-neutral-600 mb-6">You don't have permission to view staff list.</p>
          <button onClick={() => navigate('/dashboard')} className="inline-flex items-center px-4 py-2 bg-secondary-500 text-white rounded-lg hover:bg-secondary-600 transition-colors">Go to Dashboard</button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {success && <Alert type="success" message={success} className="mb-6" autoDismiss={true} onAutoDismiss={() => setSuccess('')} />}
      {error && <Alert type="error" message={error} onClose={() => setError('')} className="mb-6" />}

      <div className="bg-white rounded-xl shadow-soft p-6 mb-8 border border-neutral-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div className="mt-4 md:mt-0">
            {isAdmin && (
              <button onClick={() => navigate('/staff/create')} className="inline-flex items-center px-4 py-2 bg-secondary-500 text-white rounded-lg hover:bg-secondary-600 transition-colors">
                <UserPlus size={18} className="mr-2" />Add New Staff
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={20} />
            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
              placeholder="Search by name, staff ID, email, or phone..." className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent" disabled={loading}
            />
          </div>
          <div className="flex space-x-3">
            <div className="relative">
              <button onClick={() => setShowFilters(!showFilters)} className={`inline-flex items-center px-4 py-3 border rounded-xl transition-colors ${showFilters ? 'bg-secondary-100 border-secondary-300 text-secondary-700' : 'border-neutral-300 text-neutral-700 hover:bg-neutral-50'}`}>
                <Filter size={18} className="mr-2" />Filters
                {Object.values(filters).some(f => f) && <span className="ml-2 w-2 h-2 bg-secondary-500 rounded-full"></span>}
              </button>
              {renderFiltersDropdown()}
            </div>
            <button onClick={handleSearch} className="px-4 py-3 bg-secondary-500 text-white rounded-xl hover:bg-secondary-600 transition-colors flex items-center" disabled={loading}>
              <Search size={18} className="mr-2" />Search
            </button>
            <button onClick={loadStaff} className="px-4 py-3 bg-secondary-500 text-white rounded-xl hover:bg-secondary-600 transition-colors flex items-center justify-center" disabled={loading} title="Refresh">
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-soft overflow-hidden border border-neutral-100">
        <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-neutral-800">Staff Members</h3>
              <p className="text-sm text-neutral-600">{loading ? 'Loading...' : `${totalStaff} staff found`}</p>
            </div>
            <div className="text-sm text-neutral-600">Page {currentPage} of {totalPages}</div>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? renderLoadingState() : staff.length === 0 ? renderEmptyState() : (
            <table className="w-full">
              <thead>
                <tr className="bg-neutral-50">
                  <th className="py-3 px-4 text-left text-sm font-medium text-neutral-700">Staff</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-neutral-700">Contact Info</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-neutral-700">Department & Position</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-neutral-700">Status & Role</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-neutral-700">Actions</th>
                </tr>
              </thead>
              <tbody>{staff.map(renderStaffRow)}</tbody>
            </table>
          )}
        </div>
        {!loading && staff.length > 0 && renderPagination()}
      </div>

      {renderViewModal()}
      
      {showEditModal && (
        <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Staff" size="6xl">
          <form onSubmit={submitEditForm} className="py-4 max-h-[70vh] overflow-y-auto">
            <div className="space-y-8">
              <div>
                <h4 className="text-lg font-semibold text-secondary-800 mb-4 pb-2 border-b border-secondary-200">Personal Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div><label className="block text-sm font-medium text-neutral-700 mb-2">First Name <span className="text-red-500">*</span></label>
                    <input type="text" name="first_name" value={editForm.first_name} onChange={handleEditChange} className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 ${editErrors.first_name ? 'border-red-500' : 'border-neutral-300'}`} disabled={editLoading} />
                    {editErrors.first_name && <p className="mt-1 text-sm text-red-600">{editErrors.first_name}</p>}
                  </div>
                  <div><label className="block text-sm font-medium text-neutral-700 mb-2">Last Name <span className="text-red-500">*</span></label>
                    <input type="text" name="last_name" value={editForm.last_name} onChange={handleEditChange} className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 ${editErrors.last_name ? 'border-red-500' : 'border-neutral-300'}`} disabled={editLoading} />
                    {editErrors.last_name && <p className="mt-1 text-sm text-red-600">{editErrors.last_name}</p>}
                  </div>
                  <div><label className="block text-sm font-medium text-neutral-700 mb-2">Email</label>
                    <input type="email" name="email" value={editForm.email} onChange={handleEditChange} className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500" disabled={editLoading} />
                  </div>
                  <div><label className="block text-sm font-medium text-neutral-700 mb-2">Phone Number</label>
                    <input type="tel" name="phone_number" value={editForm.phone_number} onChange={handleEditChange} className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500" disabled={editLoading} />
                  </div>
                  <div><label className="block text-sm font-medium text-neutral-700 mb-2">Gender</label>
                    <select name="gender" value={editForm.gender} onChange={handleEditChange} className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500" disabled={editLoading}>
                      <option value="">Select Gender</option><option value="male">Male</option><option value="female">Female</option>
                    </select>
                  </div>
                  <div><label className="block text-sm font-medium text-neutral-700 mb-2">Date of Birth</label>
                    <input type="date" name="date_of_birth" value={editForm.date_of_birth} onChange={handleEditChange} className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500" disabled={editLoading} />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-secondary-800 mb-4 pb-2 border-b border-secondary-200">Employment Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div><label className="block text-sm font-medium text-neutral-700 mb-2">Staff ID</label>
                    <input type="text" name="staff_id" value={editForm.staff_id} onChange={handleEditChange} className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500" disabled={editLoading} readOnly />
                  </div>
                  <div><label className="block text-sm font-medium text-neutral-700 mb-2">Department</label>
                    <select name="department" value={editForm.department} onChange={handleEditChange} className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500" disabled={editLoading}>
                      <option value="none">Not Assigned</option><option value="administration">Administration</option><option value="academic">Academic</option><option value="finance">Finance</option><option value="library">Library</option><option value="laboratory">Laboratory</option><option value="ict">ICT</option><option value="security">Security</option><option value="maintenance">Maintenance</option><option value="transport">Transport</option><option value="health">Health</option><option value="counseling">Counseling</option><option value="sports">Sports</option><option value="kitchen">Kitchen</option>
                    </select>
                  </div>
                  <div><label className="block text-sm font-medium text-neutral-700 mb-2">Position Title</label>
                    <input type="text" name="position_title" value={editForm.position_title} onChange={handleEditChange} className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500" disabled={editLoading} />
                  </div>
                  <div><label className="block text-sm font-medium text-neutral-700 mb-2">Employment Type</label>
                    <select name="employment_type" value={editForm.employment_type} onChange={handleEditChange} className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500" disabled={editLoading}>
                      <option value="full_time">Full-Time</option><option value="part_time">Part-Time</option><option value="contract">Contract</option><option value="volunteer">Volunteer</option><option value="trainee">Trainee/Intern</option><option value="probation">Probation</option>
                    </select>
                  </div>
                  <div><label className="block text-sm font-medium text-neutral-700 mb-2">Employment Date</label>
                    <input type="date" name="employment_date" value={editForm.employment_date} onChange={handleEditChange} className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500" disabled={editLoading} />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-secondary-800 mb-4 pb-2 border-b border-secondary-200">Qualification & Salary</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div><label className="block text-sm font-medium text-neutral-700 mb-2">Highest Qualification</label>
                    <input type="text" name="highest_qualification" value={editForm.highest_qualification} onChange={handleEditChange} className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500" disabled={editLoading} />
                  </div>
                  <div><label className="block text-sm font-medium text-neutral-700 mb-2">Institution</label>
                    <input type="text" name="qualification_institution" value={editForm.qualification_institution} onChange={handleEditChange} className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500" disabled={editLoading} />
                  </div>
                  <div><label className="block text-sm font-medium text-neutral-700 mb-2">Year of Graduation</label>
                    <input type="number" name="year_of_graduation" value={editForm.year_of_graduation} onChange={handleEditChange} className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500" disabled={editLoading} min="1900" max="2099" />
                  </div>
                  <div><label className="block text-sm font-medium text-neutral-700 mb-2">Basic Salary (₦)</label>
                    <input type="number" name="basic_salary" value={editForm.basic_salary} onChange={handleEditChange} min="0" step="0.01" className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500" disabled={editLoading} />
                  </div>
                  <div><label className="block text-sm font-medium text-neutral-700 mb-2">Bank Name</label>
                    <input type="text" name="bank_name" value={editForm.bank_name} onChange={handleEditChange} className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500" disabled={editLoading} />
                  </div>
                  <div><label className="block text-sm font-medium text-neutral-700 mb-2">Account Number</label>
                    <input type="text" name="account_number" value={editForm.account_number} onChange={handleEditChange} className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500" disabled={editLoading} />
                  </div>
                  <div><label className="block text-sm font-medium text-neutral-700 mb-2">Blood Group</label>
                    <input type="text" name="blood_group" value={editForm.blood_group} onChange={handleEditChange} className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500" disabled={editLoading} />
                  </div>
                  <div><label className="block text-sm font-medium text-neutral-700 mb-2">Genotype</label>
                    <input type="text" name="genotype" value={editForm.genotype} onChange={handleEditChange} className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500" disabled={editLoading} />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-secondary-800 mb-4 pb-2 border-b border-secondary-200">Documents</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div><label className="block text-sm font-medium text-neutral-700 mb-2">Passport Photo</label>
                    <input type="file" name="passport_photo" onChange={handleEditChange} accept="image/*" className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500" disabled={editLoading} />
                    <p className="mt-1 text-xs text-neutral-500">{editForm.passport_photo?.name || 'No file selected'}</p>
                  </div>
                  <div><label className="block text-sm font-medium text-neutral-700 mb-2">Resume/CV</label>
                    <input type="file" name="resume" onChange={handleEditChange} accept=".pdf,.doc,.docx" className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500" disabled={editLoading} />
                    <p className="mt-1 text-xs text-neutral-500">{editForm.resume?.name || 'No file selected'}</p>
                  </div>
                  <div><label className="block text-sm font-medium text-neutral-700 mb-2">Certificates</label>
                    <input type="file" name="certificates" onChange={handleEditChange} accept=".pdf,.jpg,.jpeg,.png" className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500" disabled={editLoading} />
                    <p className="mt-1 text-xs text-neutral-500">{editForm.certificates?.name || 'No file selected'}</p>
                  </div>
                  <div><label className="block text-sm font-medium text-neutral-700 mb-2">ID Copy</label>
                    <input type="file" name="id_copy" onChange={handleEditChange} accept=".pdf,.jpg,.jpeg,.png" className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500" disabled={editLoading} />
                    <p className="mt-1 text-xs text-neutral-500">{editForm.id_copy?.name || 'No file selected'}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-secondary-800 mb-4 pb-2 border-b border-secondary-200">Status</h4>
                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center">
                    <input type="checkbox" id="is_active" name="is_active" checked={editForm.is_active} onChange={handleEditChange} className="h-4 w-4 text-secondary-600 rounded focus:ring-secondary-500" disabled={editLoading} />
                    <label htmlFor="is_active" className="ml-2 text-sm text-neutral-700">Staff is Active</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="is_on_probation" name="is_on_probation" checked={editForm.is_on_probation} onChange={handleEditChange} className="h-4 w-4 text-secondary-600 rounded focus:ring-secondary-500" disabled={editLoading} />
                    <label htmlFor="is_on_probation" className="ml-2 text-sm text-neutral-700">On Probation</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="is_on_leave" name="is_on_leave" checked={editForm.is_on_leave} onChange={handleEditChange} className="h-4 w-4 text-secondary-600 rounded focus:ring-secondary-500" disabled={editLoading} />
                    <label htmlFor="is_on_leave" className="ml-2 text-sm text-neutral-700">On Leave</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="is_retired" name="is_retired" checked={editForm.is_retired} onChange={handleEditChange} className="h-4 w-4 text-secondary-600 rounded focus:ring-secondary-500" disabled={editLoading} />
                    <label htmlFor="is_retired" className="ml-2 text-sm text-neutral-700">Retired</label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-8 pt-6 border-t border-neutral-200">
              <Button type="button" onClick={() => setShowEditModal(false)} className="flex-1 bg-secondary-500 hover:bg-secondary-600 text-white" disabled={editLoading}>Cancel</Button>
              <Button type="submit" loading={editLoading} className="flex-1 bg-secondary-500 hover:bg-secondary-600 text-white">{editLoading ? 'Updating...' : 'Update Staff'}</Button>
            </div>
          </form>
        </Modal>
      )}
      
      {showDeleteModal && (
        <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete Staff" size="md">
          <div className="py-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"><Trash2 className="text-red-600" size={24} /></div>
            <h3 className="text-lg font-medium text-center text-neutral-800 mb-2">Delete {selectedStaff?.user?.first_name} {selectedStaff?.user?.last_name}?</h3>
            <p className="text-neutral-600 text-center mb-6">Are you sure you want to delete this staff member? This action cannot be undone. All staff data, including employment records and documents, will be permanently removed.</p>
            <div className="bg-red-50 border border-red-100 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <XCircle className="text-red-500 mt-0.5 mr-3 flex-shrink-0" size={18} />
                <div>
                  <p className="text-sm font-medium text-red-800 mb-1">Warning: This action is permanent</p>
                  <p className="text-sm text-red-600">• Staff profile will be deleted<br />• Employment records will be removed<br />• User account will be deactivated<br />• All associated data will be lost</p>
                </div>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button onClick={() => setShowDeleteModal(false)} className="flex-1 bg-secondary-500 hover:bg-secondary-600 text-white">Cancel</Button>
              <Button onClick={confirmDelete} className="flex-1 bg-red-600 hover:bg-red-700 text-white">Delete Staff</Button>
            </div>
          </div>
        </Modal>
      )}
      
      {/* Password Reset Modal - UPDATED FOR SIMPLE PASSWORDS (MIN 5 CHARACTERS) */}
      {showPasswordModal && (
        <Modal
          isOpen={showPasswordModal}
          onClose={() => setShowPasswordModal(false)}
          title="Reset Staff Password"
          size="md"
        >
          <form onSubmit={submitPasswordReset} className="py-6">
            <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="text-secondary-600" size={24} />
            </div>
            
            <h3 className="text-lg font-medium text-center text-neutral-800 mb-2">
              Reset Password for {selectedStaff?.user?.first_name} {selectedStaff?.user?.last_name}
            </h3>
            
            <p className="text-sm text-center text-neutral-600 mb-4">
              Only Head of School (head) or Head Master (hm) can reset passwords
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  New Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="new_password"
                  value={passwordForm.new_password}
                  onChange={handlePasswordChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 ${
                    passwordErrors.new_password ? 'border-red-500' : 'border-neutral-300'
                  }`}
                  disabled={passwordLoading}
                  placeholder="Minimum 5 characters"
                />
                {passwordErrors.new_password && (
                  <p className="mt-1 text-sm text-red-600">{passwordErrors.new_password}</p>
                )}
                <p className="mt-1 text-xs text-neutral-500">
                  Simple password - minimum 5 characters
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="confirm_password"
                  value={passwordForm.confirm_password}
                  onChange={handlePasswordChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 ${
                    passwordErrors.confirm_password ? 'border-red-500' : 'border-neutral-300'
                  }`}
                  disabled={passwordLoading}
                  placeholder="Re-enter the password"
                />
                {passwordErrors.confirm_password && (
                  <p className="mt-1 text-sm text-red-600">{passwordErrors.confirm_password}</p>
                )}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex space-x-3 mt-8">
              <Button
                type="button"
                onClick={() => setShowPasswordModal(false)}
                className="flex-1 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300"
                disabled={passwordLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={passwordLoading}
                className="flex-1 bg-secondary-600 hover:bg-secondary-700 text-white"
              >
                {passwordLoading ? 'Resetting...' : 'Reset Password'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </DashboardLayout>
  );
};

export default StaffList;