import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import Modal from '../components/common/Modal';
import useAuth from '../hooks/useAuth';

import { 
  getAllParents,
  getParentById,
  createParentWithUser,
  updateParent,
  deleteParent,
  searchParents,
  linkChildToParent,
  getParentStatistics
} from '../services/parentService';

import { searchStudents, getClassLevels } from '../services/studentService';

import { 
  Search, 
  Filter, 
  Eye, 
  Edit2, 
  Trash2, 
  UserPlus, 
  ChevronLeft, 
  ChevronRight,
  User, 
  Phone, 
  Mail, 
  Users, 
  Shield, 
  XCircle, 
  RefreshCw, 
  Lock, 
  Link as LinkIcon,
  UserCheck, 
  UserX, 
  Home, 
  Briefcase, 
  FileText, 
  CreditCard, 
  Heart, 
  Award,
  Calendar, 
  MapPin, 
  Building, 
  BookOpen, 
  ShieldAlert, 
  CheckCircle, 
  X,
  ChevronDown,
  ChevronUp,
  Download,
  Upload,
  Camera,
  Activity,
  Shield as SecurityShield,
  FileCheck,
  FileX
} from 'lucide-react';

const Parent = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Check permissions
  const isAdmin = user?.role === 'head' || user?.role === 'hm' || 
                  user?.role === 'principal' || user?.role === 'vice_principal' ||
                  user?.is_staff;
  const isSecretary = user?.role === 'secretary';
  const isParent = user?.role === 'parent';
  const canViewParents = isAdmin || isSecretary || isParent;
  const canEditParents = isAdmin || isSecretary;
  
  // STATES
  const [parents, setParents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [classLevels, setClassLevels] = useState([]);
  
  // PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalParents, setTotalParents] = useState(0);
  const parentsPerPage = 10;
  
  // SEARCH & FILTERS
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    parent_type: '',
    marital_status: '',
    is_active: '',
    is_verified: '',
    is_pta_member: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  
  // MODAL STATES
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  
  // SELECTED ITEMS
  const [selectedParent, setSelectedParent] = useState(null);
  const [parentDetails, setParentDetails] = useState(null);
  const [statistics, setStatistics] = useState(null);
  
  // CREATE FORM
  const [createForm, setCreateForm] = useState({
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
    declaration_accepted: true,
    is_active: true,
    is_verified: false,
    
    profile_picture: null,
    id_document: null
  });
  
  // EDIT FORM
  const [editForm, setEditForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    gender: '',
    date_of_birth: '',
    address: '',
    city: '',
    state_of_origin: '',
    lga: '',
    nationality: '',
    
    parent_type: '',
    occupation: '',
    employer: '',
    employer_address: '',
    office_phone: '',
    marital_status: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    emergency_contact_relationship: '',
    preferred_communication: '',
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
    
    profile_picture: null,
    id_document: null
  });
  
  // LINK FORM
  const [linkForm, setLinkForm] = useState({
    student_admission_number: '',
    parent_id: '',
    relationship_type: 'father'
  });
  
  // PASSWORD FORM
  const [passwordForm, setPasswordForm] = useState({
    new_password: '',
    confirm_password: ''
  });
  
  // SEARCH STATES
  const [studentSearchResults, setStudentSearchResults] = useState([]);
  const [parentSearchResults, setParentSearchResults] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchingStudents, setSearchingStudents] = useState(false);
  const [searchingParents, setSearchingParents] = useState(false);
  
  // LOADING STATES
  const [createLoading, setCreateLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [linkLoading, setLinkLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  
  // ERROR STATES
  const [createErrors, setCreateErrors] = useState({});
  const [editErrors, setEditErrors] = useState({});
  const [linkErrors, setLinkErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});

  // Load initial data
  useEffect(() => {
    if (canViewParents) {
      loadParents();
      loadStatistics();
      loadClassLevels();
    }
  }, [currentPage, canViewParents]);

  // Load parents
  const loadParents = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      const params = { page: currentPage, limit: parentsPerPage, ...filters };
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });
      
      let response;
      if (searchTerm.trim()) {
        response = await searchParents(searchTerm, params);
      } else {
        response = await getAllParents(params);
      }
      
      console.log('📋 Parents response:', response);
      
      if (response && typeof response === 'object') {
        if (response.success === false) {
          setParents([]);
          setTotalPages(1);
          setTotalParents(0);
        } else if (response.results) {
          setParents(response.results || []);
          setTotalPages(response.total_pages || 1);
          setTotalParents(response.count || 0);
        } else if (response.data && Array.isArray(response.data.results)) {
          setParents(response.data.results || []);
          setTotalPages(response.data.total_pages || 1);
          setTotalParents(response.data.count || 0);
        } else if (Array.isArray(response)) {
          setParents(response);
          setTotalPages(1);
          setTotalParents(response.length);
        } else if (response.data && Array.isArray(response.data)) {
          setParents(response.data);
          setTotalPages(1);
          setTotalParents(response.data.length);
        } else {
          setParents([]);
          setTotalPages(1);
          setTotalParents(0);
        }
      } else {
        setParents([]);
        setTotalPages(1);
        setTotalParents(0);
      }
    } catch (err) {
      console.error('❌ Error loading parents:', err);
      setError('Failed to load parents. Please try again.');
      setParents([]);
      setTotalPages(1);
      setTotalParents(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, filters, searchTerm]);

  // Load statistics
  const loadStatistics = async () => {
    try {
      setStatsLoading(true);
      const stats = await getParentStatistics();
      setStatistics(stats);
    } catch (err) {
      console.error('Failed to load statistics:', err);
    } finally {
      setStatsLoading(false);
    }
  };

  // Load class levels
  const loadClassLevels = async () => {
    try {
      const levels = await getClassLevels();
      setClassLevels(levels);
    } catch (err) {
      console.error('Failed to load class levels:', err);
    }
  };

  // Handle search
  const handleSearch = async (e) => {
    e.preventDefault();
    setCurrentPage(1);
    await loadParents();
  };

  // Handle filter change
  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Apply filters
  const applyFilters = () => {
    setCurrentPage(1);
    loadParents();
    setShowFilters(false);
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      parent_type: '',
      marital_status: '',
      is_active: '',
      is_verified: '',
      is_pta_member: ''
    });
    setSearchTerm('');
    setCurrentPage(1);
    loadParents();
  };

  // Create parent
  const submitCreateForm = async (e) => {
    e.preventDefault();
    const errors = {};
    
    if (!createForm.first_name.trim()) errors.first_name = 'First name is required';
    if (!createForm.last_name.trim()) errors.last_name = 'Last name is required';
    if (!createForm.phone_number.trim()) errors.phone_number = 'Phone number is required';
    if (createForm.password !== createForm.confirm_password) {
      errors.confirm_password = 'Passwords do not match';
    }
    
    setCreateErrors(errors);
    if (Object.keys(errors).length > 0) return;
    
    try {
      setCreateLoading(true);
      setError('');
      
      const userData = {
        first_name: createForm.first_name.trim(),
        last_name: createForm.last_name.trim(),
        phone_number: createForm.phone_number.trim(),
        email: createForm.email.trim() || '',
        gender: createForm.gender,
        date_of_birth: createForm.date_of_birth || '',
        address: createForm.address.trim() || '',
        city: createForm.city.trim() || '',
        state_of_origin: createForm.state_of_origin || 'lagos',
        lga: createForm.lga.trim() || '',
        nationality: createForm.nationality || 'Nigerian',
        password: createForm.password,
        password2: createForm.confirm_password,
      };
      
      const parentData = {
        parent_type: createForm.parent_type,
        occupation: createForm.occupation.trim() || '',
        employer: createForm.employer.trim() || '',
        employer_address: createForm.employer_address.trim() || '',
        office_phone: createForm.office_phone.trim() || '',
        marital_status: createForm.marital_status,
        emergency_contact_name: createForm.emergency_contact_name.trim() || '',
        emergency_contact_phone: createForm.emergency_contact_phone.trim() || '',
        emergency_contact_relationship: createForm.emergency_contact_relationship.trim() || '',
        preferred_communication: createForm.preferred_communication,
        receive_sms_alerts: createForm.receive_sms_alerts,
        receive_email_alerts: createForm.receive_email_alerts,
        annual_income_range: createForm.annual_income_range || '',
        bank_name: createForm.bank_name.trim() || '',
        account_name: createForm.account_name.trim() || '',
        account_number: createForm.account_number.trim() || '',
        is_pta_member: createForm.is_pta_member,
        pta_position: createForm.pta_position.trim() || '',
        pta_committee: createForm.pta_committee.trim() || '',
        declaration_accepted: createForm.declaration_accepted,
        is_active: createForm.is_active,
        is_verified: createForm.is_verified
      };
      
      const result = await createParentWithUser(userData, parentData);
      
      setSuccess(`Parent ${createForm.first_name} ${createForm.last_name} created successfully!`);
      setShowCreateModal(false);
      setCreateForm({
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
        declaration_accepted: true,
        is_active: true,
        is_verified: false,
        profile_picture: null,
        id_document: null
      });
      setCreateErrors({});
      loadParents();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('❌ Error creating parent:', err);
      let errorMessage = 'Failed to create parent. ';
      if (err.response?.data) {
        const errorData = err.response.data;
        if (errorData.errors) {
          errorMessage = 'Validation errors:\n';
          Object.entries(errorData.errors).forEach(([field, messages]) => {
            if (Array.isArray(messages)) {
              messages.forEach(msg => errorMessage += `• ${field}: ${msg}\n`);
            } else {
              errorMessage += `• ${field}: ${messages}\n`;
            }
          });
        } else if (errorData.detail) {
          errorMessage = errorData.detail;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
      }
      setError(errorMessage);
    } finally {
      setCreateLoading(false);
    }
  };

  // View parent details
  const handleViewParent = async (parent) => {
    try {
      setDetailLoading(true);
      setSelectedParent(parent);
      
      const details = await getParentById(parent.id);
      console.log('📋 Parent details:', details);
      
      if (!details.full_name) {
        if (details.user?.first_name || details.user?.last_name) {
          details.full_name = `${details.user.first_name || ''} ${details.user.last_name || ''}`.trim();
        } else if (details.first_name || details.last_name) {
          details.full_name = `${details.first_name || ''} ${details.last_name || ''}`.trim();
        }
      }
      
      setParentDetails(details);
      setShowViewModal(true);
    } catch (err) {
      console.error('❌ Error loading parent details:', err);
      setError('Failed to load parent details. Please try again.');
    } finally {
      setDetailLoading(false);
    }
  };

  // Edit parent click
  const handleEditClick = async (parent) => {
    try {
      setEditLoading(true);
      console.log('📝 Loading parent for edit:', parent.id);
      
      const fullParentDetails = await getParentById(parent.id);
      console.log('📋 Full parent details:', fullParentDetails);
      
      setSelectedParent(fullParentDetails);
      
      let firstName = fullParentDetails.first_name || fullParentDetails.user?.first_name || '';
      let lastName = fullParentDetails.last_name || fullParentDetails.user?.last_name || '';
      
      if (!firstName && !lastName && fullParentDetails.full_name) {
        const nameParts = fullParentDetails.full_name.split(' ');
        firstName = nameParts[0] || '';
        lastName = nameParts.slice(1).join(' ') || '';
      }
      
      const formData = {
        first_name: firstName,
        last_name: lastName,
        email: fullParentDetails.email || fullParentDetails.user?.email || '',
        phone_number: fullParentDetails.phone || fullParentDetails.phone_number || fullParentDetails.user?.phone_number || '',
        gender: fullParentDetails.gender || fullParentDetails.user?.gender || 'male',
        date_of_birth: fullParentDetails.date_of_birth || fullParentDetails.user?.date_of_birth || '',
        address: fullParentDetails.address || fullParentDetails.user?.address || '',
        city: fullParentDetails.city || fullParentDetails.user?.city || '',
        state_of_origin: fullParentDetails.state_of_origin || fullParentDetails.user?.state_of_origin || 'lagos',
        lga: fullParentDetails.lga || fullParentDetails.user?.lga || '',
        nationality: fullParentDetails.nationality || fullParentDetails.user?.nationality || 'Nigerian',
        
        parent_type: fullParentDetails.parent_type || 'father',
        occupation: fullParentDetails.occupation || '',
        employer: fullParentDetails.employer || '',
        employer_address: fullParentDetails.employer_address || '',
        office_phone: fullParentDetails.office_phone || '',
        marital_status: fullParentDetails.marital_status || 'married',
        emergency_contact_name: fullParentDetails.emergency_contact_name || '',
        emergency_contact_phone: fullParentDetails.emergency_contact_phone || '',
        emergency_contact_relationship: fullParentDetails.emergency_contact_relationship || '',
        preferred_communication: fullParentDetails.preferred_communication || 'whatsapp',
        receive_sms_alerts: fullParentDetails.receive_sms_alerts !== false,
        receive_email_alerts: fullParentDetails.receive_email_alerts !== false,
        annual_income_range: fullParentDetails.annual_income_range || '',
        bank_name: fullParentDetails.bank_name || '',
        account_name: fullParentDetails.account_name || '',
        account_number: fullParentDetails.account_number || '',
        is_pta_member: fullParentDetails.is_pta_member || false,
        pta_position: fullParentDetails.pta_position || '',
        pta_committee: fullParentDetails.pta_committee || '',
        is_active: fullParentDetails.is_active !== false,
        is_verified: fullParentDetails.is_verified || false,
        
        profile_picture: null,
        id_document: null,
        
        existing_profile_picture: fullParentDetails.profile_picture || fullParentDetails.user?.profile_picture,
        existing_id_document: fullParentDetails.id_document
      };
      
      console.log('📝 Edit form data:', formData);
      
      setEditForm(formData);
      setEditErrors({});
      setShowEditModal(true);
      
    } catch (err) {
      console.error('❌ Error loading parent for edit:', err);
      setError('Failed to load parent details for editing. Please try again.');
    } finally {
      setEditLoading(false);
    }
  };

  // Submit edit form
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
      
      const formData = new FormData();
      
      const updateFields = {
        first_name: editForm.first_name.trim(),
        last_name: editForm.last_name.trim(),
        email: editForm.email?.trim() || '',
        phone_number: editForm.phone_number?.trim() || '',
        gender: editForm.gender || '',
        date_of_birth: editForm.date_of_birth || '',
        address: editForm.address?.trim() || '',
        city: editForm.city?.trim() || '',
        state_of_origin: editForm.state_of_origin || '',
        lga: editForm.lga?.trim() || '',
        nationality: editForm.nationality || 'Nigerian',
        
        parent_type: editForm.parent_type || 'father',
        occupation: editForm.occupation?.trim() || '',
        employer: editForm.employer?.trim() || '',
        employer_address: editForm.employer_address?.trim() || '',
        office_phone: editForm.office_phone?.trim() || '',
        marital_status: editForm.marital_status || 'married',
        emergency_contact_name: editForm.emergency_contact_name?.trim() || '',
        emergency_contact_phone: editForm.emergency_contact_phone?.trim() || '',
        emergency_contact_relationship: editForm.emergency_contact_relationship?.trim() || '',
        preferred_communication: editForm.preferred_communication || 'whatsapp',
        receive_sms_alerts: editForm.receive_sms_alerts,
        receive_email_alerts: editForm.receive_email_alerts,
        annual_income_range: editForm.annual_income_range || '',
        bank_name: editForm.bank_name?.trim() || '',
        account_name: editForm.account_name?.trim() || '',
        account_number: editForm.account_number?.trim() || '',
        is_pta_member: editForm.is_pta_member,
        pta_position: editForm.pta_position?.trim() || '',
        pta_committee: editForm.pta_committee?.trim() || '',
        is_active: editForm.is_active,
        is_verified: editForm.is_verified
      };
      
      Object.entries(updateFields).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if (typeof value === 'boolean') {
            formData.append(key, value.toString());
          } else {
            formData.append(key, value);
          }
        }
      });
      
      if (editForm.profile_picture instanceof File) {
        formData.append('profile_picture', editForm.profile_picture);
      }
      if (editForm.id_document instanceof File) {
        formData.append('id_document', editForm.id_document);
      }
      
      console.log('📤 Updating parent with data:');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }
      
      const response = await updateParent(selectedParent.id, formData);
      
      console.log('✅ Update response:', response);
      
      setSuccess(`Parent ${editForm.first_name} ${editForm.last_name} updated successfully!`);
      setShowEditModal(false);
      setSelectedParent(null);
      loadParents();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('❌ Update parent error:', err);
      console.error('❌ Update error response:', err.response?.data);
      
      let errorMessage = 'Failed to update parent. ';
      if (err.response?.data) {
        const errorData = err.response.data;
        
        if (errorData.errors) {
          errorMessage = 'Validation errors:\n';
          Object.entries(errorData.errors).forEach(([field, messages]) => {
            if (Array.isArray(messages)) {
              messages.forEach(msg => errorMessage += `• ${field}: ${msg}\n`);
            } else {
              errorMessage += `• ${field}: ${messages}\n`;
            }
          });
        } else if (errorData.detail) {
          errorMessage = errorData.detail;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
      }
      
      setError(errorMessage);
    } finally {
      setEditLoading(false);
    }
  };

  // Delete parent
  const handleDeleteClick = (parent) => {
    setSelectedParent(parent);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedParent) return;
    
    try {
      await deleteParent(selectedParent.id);
      
      const parentName = selectedParent.user?.first_name 
        ? `${selectedParent.user.first_name} ${selectedParent.user.last_name || ''}`
        : selectedParent.parent_id || 'Parent';
      
      setSuccess(`Parent ${parentName} deleted successfully!`);
      setShowDeleteModal(false);
      setSelectedParent(null);
      loadParents();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('❌ Delete error:', err);
      let errorMessage = 'Failed to delete parent. ';
      if (err.response?.data) {
        const errorData = err.response.data;
        if (errorData.error) {
          errorMessage += errorData.error;
        } else if (errorData.detail) {
          errorMessage += errorData.detail;
        }
      }
      setError(errorMessage);
    }
  };

  // Password reset
  const handlePasswordClick = (parent) => {
    setSelectedParent(parent);
    setPasswordForm({
      new_password: '',
      confirm_password: ''
    });
    setPasswordErrors({});
    setShowPasswordModal(true);
  };

  const submitPasswordReset = async (e) => {
    e.preventDefault();
    const errors = {};
    
    if (!passwordForm.new_password) errors.new_password = 'New password is required';
    if (!passwordForm.confirm_password) errors.confirm_password = 'Please confirm password';
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      errors.confirm_password = 'Passwords do not match';
    }
    if (passwordForm.new_password.length < 8) {
      errors.new_password = 'Password must be at least 8 characters';
    }
    
    setPasswordErrors(errors);
    if (Object.keys(errors).length > 0) return;
    
    try {
      setPasswordLoading(true);
      setError('');
      
      setSuccess(`Password reset successfully for ${selectedParent?.user?.first_name}`);
      setShowPasswordModal(false);
      setSelectedParent(null);
      setPasswordErrors({});
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('❌ Error resetting password:', err);
      setError(err.message || 'Failed to reset password. Please try again.');
    } finally {
      setPasswordLoading(false);
    }
  };

  // Link child
  const handleLinkChildClick = () => {
    setShowLinkModal(true);
    setLinkForm({
      student_admission_number: '',
      parent_id: '',
      relationship_type: 'father'
    });
    setStudentSearchResults([]);
    setParentSearchResults([]);
    setSelectedStudent(null);
  };

  // Form change handlers
  const handleCreateChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'file') {
      setCreateForm(prev => ({ ...prev, [name]: files[0] }));
    } else if (type === 'checkbox') {
      setCreateForm(prev => ({ ...prev, [name]: checked }));
    } else {
      setCreateForm(prev => ({ ...prev, [name]: value }));
    }
    
    if (createErrors[name]) {
      setCreateErrors(prev => ({ ...prev, [name]: '' }));
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

  const handleLinkChange = (e) => {
    const { name, value } = e.target;
    setLinkForm(prev => ({ ...prev, [name]: value }));
    
    if (linkErrors[name]) {
      setLinkErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
    
    if (passwordErrors[name]) {
      setPasswordErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Search for student
  const searchForStudent = async () => {
    if (!linkForm.student_admission_number.trim()) {
      setLinkErrors({ student_admission_number: 'Please enter admission number' });
      return;
    }

    try {
      setSearchingStudents(true);
      setError('');
      
      const results = await searchStudents({
        admission_number: linkForm.student_admission_number
      });
      
      setStudentSearchResults(Array.isArray(results) ? results : results.results || []);
    } catch (err) {
      setError('Failed to search for student. Please try again.');
    } finally {
      setSearchingStudents(false);
    }
  };

  // Search for parent
  const searchForParent = async () => {
    if (!linkForm.parent_id.trim()) {
      setLinkErrors({ parent_id: 'Please enter parent ID' });
      return;
    }

    try {
      setSearchingParents(true);
      setError('');
      
      const results = await searchParents(linkForm.parent_id);
      
      setParentSearchResults(Array.isArray(results) ? results : results.results || []);
    } catch (err) {
      setError('Failed to search for parent. Please try again.');
    } finally {
      setSearchingParents(false);
    }
  };

  // Select student/parent
  const selectStudent = (student) => {
    setSelectedStudent(student);
    setLinkForm(prev => ({ ...prev, student_admission_number: student.admission_number }));
    setStudentSearchResults([]);
  };

  const selectParent = (parent) => {
    setSelectedParent(parent);
    setLinkForm(prev => ({ ...prev, parent_id: parent.parent_id }));
    setParentSearchResults([]);
  };

  const submitLinkForm = async (e) => {
    e.preventDefault();
    const errors = {};
    
    if (!linkForm.student_admission_number.trim()) errors.student_admission_number = 'Student admission number is required';
    if (!linkForm.parent_id.trim()) errors.parent_id = 'Parent ID is required';
    
    setLinkErrors(errors);
    if (Object.keys(errors).length > 0) return;
    
    try {
      setLinkLoading(true);
      setError('');
      
      await linkChildToParent(linkForm);
      
      setSuccess(`Child linked to parent successfully!`);
      setShowLinkModal(false);
      setLinkForm({
        student_admission_number: '',
        parent_id: '',
        relationship_type: 'father'
      });
      setStudentSearchResults([]);
      setParentSearchResults([]);
      setSelectedStudent(null);
      setSelectedParent(null);
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      let errorMessage = 'Failed to link child to parent. ';
      if (err.response?.data) {
        const errorData = err.response.data;
        if (errorData.error) {
          errorMessage += errorData.error;
        } else if (errorData.detail) {
          errorMessage += errorData.detail;
        }
      }
      setError(errorMessage);
    } finally {
      setLinkLoading(false);
    }
  };

  // =====================
  // RENDER COMPONENTS
  // =====================

  // Status badges
  const renderStatusBadge = (parent) => {
    if (parent.is_active === false) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <UserX size={12} className="mr-1" />
          Inactive
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <UserCheck size={12} className="mr-1" />
        Active
      </span>
    );
  };

  const renderVerificationBadge = (parent) => {
    if (parent.is_verified) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle size={12} className="mr-1" />
          Verified
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        <ShieldAlert size={12} className="mr-1" />
        Pending
      </span>
    );
  };

  const renderPTABadge = (parent) => {
    if (parent.is_pta_member) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
          <Award size={12} className="mr-1" />
          PTA Member
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800">
        <X size={12} className="mr-1" />
        Not PTA
      </span>
    );
  };

  // Parent type badge
  const renderParentTypeBadge = (parent) => {
    const type = parent.parent_type;
    const config = {
      'father': { bg: 'bg-blue-50', text: 'text-blue-700', label: 'Father' },
      'mother': { bg: 'bg-pink-50', text: 'text-pink-700', label: 'Mother' },
      'guardian': { bg: 'bg-purple-50', text: 'text-purple-700', label: 'Guardian' },
      'relative': { bg: 'bg-orange-50', text: 'text-orange-700', label: 'Relative' },
      'other': { bg: 'bg-gray-50', text: 'text-gray-700', label: 'Other' }
    };
    
    const style = config[type] || config.other;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
        {style.label}
      </span>
    );
  };

  // Pagination
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
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          disabled={loading || currentPage === i}
          className={`px-3 py-1 rounded-lg transition-colors ${
            currentPage === i
              ? 'bg-secondary-500 text-white'
              : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 disabled:opacity-50'
          }`}
        >
          {i}
        </button>
      );
    }
    
    return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-neutral-200">
        <div className="text-sm text-neutral-600">
          Showing {parents.length > 0 ? ((currentPage - 1) * parentsPerPage + 1) : 0} to{' '}
          {Math.min(currentPage * parentsPerPage, totalParents)} of {totalParents} parents
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1 || loading}
            className="p-2 rounded-lg bg-neutral-100 text-neutral-700 hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          
          <div className="flex items-center space-x-1">
            {pages}
          </div>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages || loading}
            className="p-2 rounded-lg bg-neutral-100 text-neutral-700 hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    );
  };

  // Statistics display
  const renderStatistics = () => {
    if (statsLoading) {
      return (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-secondary-500"></div>
        </div>
      );
    }

    if (!statistics) return null;

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-soft p-4 border border-neutral-100">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-secondary-100 rounded-lg flex items-center justify-center mr-3">
              <Users className="text-secondary-600" size={20} />
            </div>
            <div>
              <div className="text-2xl font-bold text-neutral-800">{statistics.total_parents || 0}</div>
              <div className="text-sm text-neutral-600">Total Parents</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-soft p-4 border border-neutral-100">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
              <UserCheck className="text-green-600" size={20} />
            </div>
            <div>
              <div className="text-2xl font-bold text-neutral-800">{statistics.active_parents || 0}</div>
              <div className="text-sm text-neutral-600">Active</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-soft p-4 border border-neutral-100">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
              <Award className="text-purple-600" size={20} />
            </div>
            <div>
              <div className="text-2xl font-bold text-neutral-800">{statistics.pta_members || 0}</div>
              <div className="text-sm text-neutral-600">PTA Members</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-soft p-4 border border-neutral-100">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
              <Users className="text-yellow-600" size={20} />
            </div>
            <div>
              <div className="text-2xl font-bold text-neutral-800">{statistics.total_children || 0}</div>
              <div className="text-sm text-neutral-600">Total Children</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Parent row render
  const renderParentRow = (parent) => {
    const fullName = parent.full_name || 'Unknown Parent';
    const email = parent.email || 'Not provided';
    const phone = parent.phone || 'Not provided';
    const registrationNumber = parent.registration_number || 'N/A';
    const childrenCount = parent.children_count || parent.children?.length || 0;
    const occupation = parent.occupation || 'Not specified';
    const parentId = parent.parent_id || parent.id || 'N/A';
    const imageUrl = parent.profile_picture || parent.user?.profile_picture || null;
    
    return (
      <tr key={parent.id} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
        <td className="py-4 px-4">
          <button
            onClick={() => handleViewParent(parent)}
            className="text-left hover:text-secondary-700 transition-colors w-full"
          >
            <div className="flex items-center">
              <div className="w-10 h-10 bg-secondary-100 rounded-full flex items-center justify-center mr-3 overflow-hidden border border-secondary-200">
                {imageUrl ? (
                  <img 
                    src={imageUrl} 
                    alt={fullName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = '<User size={18} className="text-secondary-600" />';
                    }}
                  />
                ) : (
                  <User size={18} className="text-secondary-600" />
                )}
              </div>
              <div className="min-w-0">
                <div className="font-medium text-neutral-800 truncate">{fullName}</div>
                <div className="text-xs text-neutral-500 truncate">ID: {parentId}</div>
                <div className="text-xs text-neutral-400 truncate">Reg: {registrationNumber}</div>
              </div>
            </div>
          </button>
        </td>
        
        <td className="py-4 px-4">
          <div className="space-y-1">
            {renderParentTypeBadge(parent)}
            <div className="text-xs text-neutral-500">
              {occupation}
            </div>
          </div>
        </td>
        
        <td className="py-4 px-4">
          <div className="space-y-1">
            <div className="flex items-center text-neutral-700">
              <Users size={14} className="mr-1 text-neutral-400 flex-shrink-0" />
              <span>{childrenCount} children</span>
            </div>
            {childrenCount > 0 && parent.children && parent.children.length > 0 && (
              <div className="text-xs text-neutral-500">
                {parent.children.slice(0, 2).map(child => 
                  child.full_name || child.name || 'Child'
                ).join(', ')}
                {childrenCount > 2 && '...'}
              </div>
            )}
          </div>
        </td>
        
        <td className="py-4 px-4">
          <div className="space-y-1">
            <div className="text-sm font-medium flex items-center text-neutral-700">
              <Phone size={14} className="mr-1 text-neutral-400 flex-shrink-0" />
              <span className="truncate">{phone}</span>
            </div>
            <div className="text-sm flex items-center text-neutral-500">
              <Mail size={14} className="mr-1 text-neutral-400 flex-shrink-0" />
              <span className="truncate">{email}</span>
            </div>
          </div>
        </td>
        
        <td className="py-4 px-4">
          <div className="space-y-2">
            {renderStatusBadge(parent)}
            {renderVerificationBadge(parent)}
            {renderPTABadge(parent)}
          </div>
        </td>
        
        <td className="py-4 px-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleViewParent(parent)}
              className="p-2 bg-secondary-100 text-secondary-600 hover:bg-secondary-200 rounded-lg transition-colors"
              title="View Details"
            >
              <Eye size={18} />
            </button>
            
            {canEditParents && (
              <>
                <button
                  onClick={() => handleEditClick(parent)}
                  className="p-2 bg-secondary-100 text-secondary-600 hover:bg-secondary-200 rounded-lg transition-colors"
                  title="Edit Parent"
                >
                  <Edit2 size={18} />
                </button>
                
                <button
                  onClick={() => handlePasswordClick(parent)}
                  className="p-2 bg-secondary-100 text-secondary-600 hover:bg-secondary-200 rounded-lg transition-colors"
                  title="Reset Password"
                >
                  <Lock size={18} />
                </button>
                
                <button
                  onClick={() => handleDeleteClick(parent)}
                  className="p-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition-colors"
                  title="Delete Parent"
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

  // Loading state
  const renderLoadingState = () => (
    <div className="py-12 text-center">
      <div className="inline-flex items-center justify-center mb-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary-500"></div>
      </div>
      <p className="text-neutral-600">Loading parents...</p>
    </div>
  );

  // Empty state
  const renderEmptyState = () => (
    <div className="py-16 text-center border-2 border-dashed border-neutral-200 rounded-xl">
      <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Users size={24} className="text-neutral-400" />
      </div>
      <h3 className="text-lg font-medium text-neutral-700 mb-2">No parents found</h3>
      <p className="text-neutral-500 mb-6">
        {searchTerm || Object.values(filters).some(f => f) 
          ? 'Try adjusting your search or filters' 
          : 'No parents have been added yet'}
      </p>
      {canEditParents && (
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center px-4 py-2 bg-secondary-500 text-white rounded-lg hover:bg-secondary-600 transition-colors"
        >
          <UserPlus size={18} className="mr-2" />
          Add First Parent
        </button>
      )}
    </div>
  );

  // Filters dropdown
  const renderFiltersDropdown = () => (
    <div className={`absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-strong border border-neutral-200 z-10 ${showFilters ? 'block' : 'hidden'}`}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-neutral-800">Filter Parents</h3>
          <button
            onClick={clearFilters}
            className="text-sm text-secondary-600 hover:text-secondary-700"
          >
            Clear all
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Parent Type</label>
            <select
              value={filters.parent_type}
              onChange={(e) => handleFilterChange('parent_type', e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
            >
              <option value="">All Types</option>
              <option value="father">Father</option>
              <option value="mother">Mother</option>
              <option value="guardian">Guardian</option>
              <option value="relative">Relative</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Marital Status</label>
            <select
              value={filters.marital_status}
              onChange={(e) => handleFilterChange('marital_status', e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
            >
              <option value="">All Status</option>
              <option value="married">Married</option>
              <option value="single">Single</option>
              <option value="divorced">Divorced</option>
              <option value="widowed">Widowed</option>
              <option value="separated">Separated</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Active Status</label>
            <select
              value={filters.is_active}
              onChange={(e) => handleFilterChange('is_active', e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
            >
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Verification Status</label>
            <select
              value={filters.is_verified}
              onChange={(e) => handleFilterChange('is_verified', e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
            >
              <option value="">All</option>
              <option value="true">Verified</option>
              <option value="false">Not Verified</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">PTA Membership</label>
            <select
              value={filters.is_pta_member}
              onChange={(e) => handleFilterChange('is_pta_member', e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
            >
              <option value="">All</option>
              <option value="true">PTA Members</option>
              <option value="false">Non-PTA</option>
            </select>
          </div>
        </div>
        
        <Button
          onClick={applyFilters}
          className="w-full mt-6 bg-secondary-500 hover:bg-secondary-600 text-white"
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );

  // Helper components for view modal
  const Section = ({ title, icon, children }) => (
    <div className="bg-white rounded-lg border border-neutral-200">
      <div className="px-4 py-3 border-b border-neutral-200">
        <h4 className="text-sm font-semibold text-neutral-900 flex items-center">
          {icon && <span className="mr-2 text-neutral-600">{icon}</span>}
          {title}
        </h4>
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  );

  const InfoRow = ({ label, value, fullWidth = false }) => (
    <div className={fullWidth ? 'col-span-full' : ''}>
      <div className="text-xs text-neutral-500 mb-1">{label}</div>
      <div className="text-sm font-medium text-neutral-900 bg-neutral-50 px-3 py-2 rounded border border-neutral-200 break-words">
        {value}
      </div>
    </div>
  );

  // =====================
  // RENDER VIEW MODAL
  // =====================
  const renderViewModal = () => {
    if (!parentDetails) return null;
    
    const fullName = parentDetails.full_name || `${parentDetails.first_name || ''} ${parentDetails.last_name || ''}`.trim() || 'Parent';
    const parentId = parentDetails.parent_id || `PAR${parentDetails.id}`;
    const parentType = parentDetails.parent_type_display || parentDetails.parent_type || 'Parent';
    const occupation = parentDetails.occupation || 'Not specified';
    const phone = parentDetails.phone || parentDetails.phone_number || 'Not provided';
    
    return (
      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="Parent Details"
        size="lg"
      >
        {detailLoading ? (
          <div className="py-20 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary-500"></div>
          </div>
        ) : (
          <div className="py-4 max-h-[80vh] overflow-y-auto">
            {/* Parent Profile Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6 pb-6 border-b">
              <div className="w-20 h-20 bg-secondary-100 rounded-lg flex items-center justify-center overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
                {parentDetails.profile_picture || parentDetails.user?.profile_picture ? (
                  <img 
                    src={parentDetails.profile_picture || parentDetails.user?.profile_picture} 
                    alt={fullName}
                    className="w-full h-full object-cover"
                    onError={(e) => { 
                      e.target.style.display = 'none'; 
                      e.target.parentElement.innerHTML = '<User size={24} className="text-secondary-600" />';
                    }}
                  />
                ) : (
                  <User size={24} className="text-secondary-600" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold text-neutral-900 truncate">
                  {fullName}
                </h3>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="px-2 py-1 bg-secondary-100 text-secondary-800 text-xs font-medium rounded">
                    {parentId}
                  </span>
                  <span className="px-2 py-1 bg-neutral-100 text-neutral-800 text-xs font-medium rounded">
                    {parentType}
                  </span>
                  {renderStatusBadge(parentDetails)}
                  {renderVerificationBadge(parentDetails)}
                  {renderPTABadge(parentDetails)}
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <div className="flex items-center">
                    <Briefcase size={14} className="text-neutral-500 mr-1" />
                    <span className="text-sm font-medium text-neutral-700">
                      {occupation}
                    </span>
                  </div>
                  <span className="text-neutral-400">•</span>
                  <div className="flex items-center">
                    <Phone size={14} className="text-neutral-500 mr-1" />
                    <span className="text-sm text-neutral-700">{phone}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Information Sections */}
            <div className="space-y-6">
              {/* Personal Information */}
              <Section title="Personal Information" icon={<User size={16} />}>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoRow label="Full Name" value={fullName} />
                    <InfoRow label="Email" value={parentDetails.user?.email || 'Not provided'} />
                    <InfoRow label="Phone Number" value={phone} />
                    <InfoRow label="Gender" value={parentDetails.user?.gender || 'Not specified'} />
                    <InfoRow label="Date of Birth" value={parentDetails.user?.date_of_birth || 'Not provided'} />
                    <InfoRow label="Nationality" value={parentDetails.user?.nationality || 'Nigerian'} />
                  </div>
                  <InfoRow label="Address" value={parentDetails.user?.address || 'No address provided'} fullWidth />
                </div>
              </Section>

              {/* Parent Information */}
              <Section title="Parent Information" icon={<Home size={16} />}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoRow label="Occupation" value={occupation} />
                  <InfoRow label="Employer" value={parentDetails.employer || 'Not specified'} />
                  <InfoRow label="Marital Status" value={parentDetails.marital_status_display || parentDetails.marital_status || 'Not specified'} />
                  <InfoRow label="Office Phone" value={parentDetails.office_phone || 'Not provided'} />
                  <InfoRow label="Preferred Communication" value={parentDetails.preferred_communication_display || parentDetails.preferred_communication || 'Not specified'} />
                  <InfoRow label="Annual Income Range" value={parentDetails.annual_income_range || 'Not specified'} />
                </div>
              </Section>

              {/* Emergency Contact */}
              {(parentDetails.emergency_contact_name || parentDetails.emergency_contact_phone) && (
                <Section title="Emergency Contact" icon={<ShieldAlert size={16} />}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <InfoRow label="Contact Name" value={parentDetails.emergency_contact_name} />
                    <InfoRow label="Phone Number" value={parentDetails.emergency_contact_phone} />
                    <InfoRow label="Relationship" value={parentDetails.emergency_contact_relationship} />
                  </div>
                </Section>
              )}

              {/* Children Information */}
              {parentDetails.children && parentDetails.children.length > 0 && (
                <Section title={`Children (${parentDetails.children.length})`} icon={<Users size={16} />}>
                  <div className="space-y-3">
                    {parentDetails.children.map((child, index) => {
                      const totalFee = parseFloat(child.total_fee_amount || 0);
                      const amountPaid = parseFloat(child.amount_paid || 0);
                      const balanceDue = parseFloat(child.balance_due || 0);
                      const remainingFee = balanceDue > 0 ? balanceDue : totalFee - amountPaid;
                      
                      return (
                        <div key={index} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                          <div className="flex-1">
                            <div className="font-medium text-neutral-900">
                              {child.full_name || child.name || `Child ${index + 1}`}
                            </div>
                            <div className="text-sm text-neutral-600">
                              {child.class_level_name || child.class_level || 'No Class'} • Admission: {child.admission_number || 'N/A'}
                            </div>
                            <div className="text-sm text-neutral-500 mt-1">
                              Fee Status: <span className={`font-medium ${
                                child.fee_status === 'paid' ? 'text-green-600' :
                                child.fee_status === 'partially_paid' ? 'text-yellow-600' :
                                'text-red-600'
                              }`}>
                                {child.fee_status === 'paid' ? 'Paid' : 
                                child.fee_status === 'partially_paid' ? 'Partially Paid' : 
                                'Not Paid'}
                              </span>
                              {(child.fee_status === 'partially_paid' || child.fee_status === 'not_paid') && remainingFee > 0 && (
                                <span className="ml-2 text-red-600 font-medium">
                                  (Remaining: ₦{remainingFee.toLocaleString()})
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-sm font-medium text-neutral-700">
                            {child.fee_status === 'paid' ? (
                              <span className="text-green-600">Paid</span>
                            ) : child.fee_status === 'partially_paid' ? (
                              <div className="text-right">
                                <div className="text-yellow-600">Partially Paid</div>
                                <div className="text-xs text-neutral-500">₦{remainingFee.toLocaleString()} due</div>
                              </div>
                            ) : (
                              <div className="text-right">
                                <div className="text-red-600">Not Paid</div>
                                <div className="text-xs text-neutral-500">₦{remainingFee.toLocaleString()} due</div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                    
                    {parentDetails.fee_summary && (
                      <div className="mt-4 p-3 bg-secondary-50 rounded-lg border border-secondary-200">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-xs text-secondary-700 font-medium">Total Children</div>
                            <div className="text-lg font-bold text-secondary-800">{parentDetails.fee_summary.total_children || 0}</div>
                          </div>
                          <div>
                            <div className="text-xs text-secondary-700 font-medium">Total Fee Due</div>
                            <div className="text-lg font-bold text-secondary-800">₦{(parentDetails.fee_summary.total_balance || 0).toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-xs text-secondary-700 font-medium">Total Paid</div>
                            <div className="text-lg font-bold text-secondary-800">₦{(parentDetails.fee_summary.total_paid || 0).toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-xs text-secondary-700 font-medium">Payment Progress</div>
                            <div className="text-lg font-bold text-secondary-800">{parentDetails.fee_summary.percentage_paid || 0}%</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </Section>
              )}

              {/* Document Status */}
              <Section title="Document Status" icon={<FileText size={16} />}>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <div className={`p-3 rounded-lg border ${parentDetails.profile_picture ? 'border-green-200 bg-green-50' : 'border-neutral-200 bg-neutral-50'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-neutral-900 truncate">Profile Picture</div>
                        <div className={`text-xs ${parentDetails.profile_picture ? 'text-green-600' : 'text-red-600'}`}>
                          {parentDetails.profile_picture ? 'Uploaded' : 'Pending'}
                        </div>
                      </div>
                      <div className={`w-2 h-2 rounded-full ml-2 flex-shrink-0 ${parentDetails.profile_picture ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    </div>
                  </div>
                  
                  <div className={`p-3 rounded-lg border ${parentDetails.id_document ? 'border-green-200 bg-green-50' : 'border-neutral-200 bg-neutral-50'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-neutral-900 truncate">ID Document</div>
                        <div className={`text-xs ${parentDetails.id_document ? 'text-green-600' : 'text-red-600'}`}>
                          {parentDetails.id_document ? 'Uploaded' : 'Pending'}
                        </div>
                      </div>
                      <div className={`w-2 h-2 rounded-full ml-2 flex-shrink-0 ${parentDetails.id_document ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    </div>
                  </div>
                  
                  <div className={`p-3 rounded-lg border ${parentDetails.declaration_accepted ? 'border-green-200 bg-green-50' : 'border-neutral-200 bg-neutral-50'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-neutral-900 truncate">Declaration</div>
                        <div className={`text-xs ${parentDetails.declaration_accepted ? 'text-green-600' : 'text-red-600'}`}>
                          {parentDetails.declaration_accepted ? 'Accepted' : 'Pending'}
                        </div>
                      </div>
                      <div className={`w-2 h-2 rounded-full ml-2 flex-shrink-0 ${parentDetails.declaration_accepted ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    </div>
                  </div>
                </div>
              </Section>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 pt-6 border-t border-neutral-200">
              <div className="flex flex-wrap justify-end gap-3">
                {canEditParents && (
                  <>
                    <Button
                      onClick={() => {
                        setShowViewModal(false);
                        handleEditClick(parentDetails);
                      }}
                      className="bg-secondary-600 hover:bg-secondary-700 text-white px-4 py-2 text-sm font-medium rounded-md flex items-center transition-colors"
                    >
                      <Edit2 size={14} className="mr-2" />
                      Edit Parent
                    </Button>
                    <Button
                      onClick={() => {
                        setShowViewModal(false);
                        handlePasswordClick(parentDetails);
                      }}
                      className="bg-secondary-600 hover:bg-secondary-700 text-white px-4 py-2 text-sm font-medium rounded-md flex items-center transition-colors"
                    >
                      <Lock size={14} className="mr-2" />
                      Reset Password
                    </Button>
                  </>
                )}
                <Button
                  onClick={() => setShowViewModal(false)}
                  className="bg-white hover:bg-neutral-50 text-neutral-700 border border-neutral-300 px-4 py-2 text-sm font-medium rounded-md transition-colors"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    );
  };

  // =====================
  // MAIN RENDER
  // =====================
  if (!canViewParents) {
    return (
      <DashboardLayout title="Access Denied">
        <div className="bg-white rounded-xl shadow-soft p-8 text-center border border-neutral-100">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="text-red-600" size={24} />
          </div>
          <h1 className="text-2xl font-heading font-bold text-neutral-800 mb-4">Access Denied</h1>
          <p className="text-neutral-600 mb-6">You don't have permission to view parents list.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center px-4 py-2 bg-secondary-500 text-white rounded-lg hover:bg-secondary-600 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Success Alert */}
      {success && (
        <Alert
          type="success"
          message={success}
          className="mb-6"
          autoDismiss={true}
          onAutoDismiss={() => setSuccess('')}
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

      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-soft p-6 mb-8 border border-neutral-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">

          
          <div className="mt-4 md:mt-0">
            {canEditParents && (
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center px-4 py-2 bg-secondary-500 text-white rounded-lg hover:bg-secondary-600 transition-colors"
                >
                  <UserPlus size={18} className="mr-2" />
                  Add New Parent
                </button>
                <button
                  onClick={handleLinkChildClick}
                  className="inline-flex items-center px-4 py-2 bg-secondary-500 text-white rounded-lg hover:bg-secondary-600 transition-colors"
                >
                  <LinkIcon size={18} className="mr-2" />
                  Link Child
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
              placeholder="Search by name, parent ID, email, or phone..."
              className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
              disabled={loading}
            />
          </div>
          
          <div className="flex space-x-3">
            <div className="relative">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`inline-flex items-center px-4 py-3 border rounded-xl transition-colors ${
                  showFilters 
                    ? 'bg-secondary-100 border-secondary-300 text-secondary-700' 
                    : 'border-neutral-300 text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                <Filter size={18} className="mr-2" />
                Filters
                {Object.values(filters).some(f => f) && (
                  <span className="ml-2 w-2 h-2 bg-secondary-500 rounded-full"></span>
                )}
              </button>
              {renderFiltersDropdown()}
            </div>
            
            <button
              onClick={handleSearch}
              className="px-4 py-3 bg-secondary-500 text-white rounded-xl hover:bg-secondary-600 transition-colors flex items-center"
              disabled={loading}
            >
              <Search size={18} className="mr-2" />
              Search
            </button>
            
            <button
              onClick={loadParents}
              className="px-4 py-3 bg-secondary-500 text-white rounded-xl hover:bg-secondary-600 transition-colors flex items-center justify-center"
              disabled={loading}
              title="Refresh"
            >
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>
      </div>

      {/* Parents Table */}
      <div className="bg-white rounded-xl shadow-soft overflow-hidden border border-neutral-100">
        {/* Table Header */}
        <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-neutral-800">Parents</h3>
              <p className="text-sm text-neutral-600">
                {loading ? 'Loading...' : `${totalParents} parents found`}
              </p>
            </div>
            <div className="text-sm text-neutral-600">
              Page {currentPage} of {totalPages}
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          {loading ? (
            renderLoadingState()
          ) : parents.length === 0 ? (
            renderEmptyState()
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-neutral-50">
                  <th className="py-3 px-4 text-left text-sm font-medium text-neutral-700">Parent</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-neutral-700">Type</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-neutral-700">Children</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-neutral-700">Contact</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-neutral-700">Status</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-neutral-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {parents.map(renderParentRow)}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {!loading && parents.length > 0 && renderPagination()}
      </div>

      {/* Modals */}
      {renderViewModal()}
      
      {/* Create Modal */}
      {showCreateModal && (
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Create New Parent"
          size="6xl"
        >
          <form onSubmit={submitCreateForm} className="py-4 max-h-[70vh] overflow-y-auto">
            <div className="space-y-8">
              {/* Personal Information */}
              <div>
                <h4 className="text-lg font-semibold text-secondary-800 mb-4 pb-2 border-b border-secondary-200">
                  Personal Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      value={createForm.first_name}
                      onChange={handleCreateChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 ${
                        createErrors.first_name ? 'border-red-500' : 'border-neutral-300'
                      }`}
                      disabled={createLoading}
                    />
                    {createErrors.first_name && (
                      <p className="mt-1 text-sm text-red-600">{createErrors.first_name}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      value={createForm.last_name}
                      onChange={handleCreateChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 ${
                        createErrors.last_name ? 'border-red-500' : 'border-neutral-300'
                      }`}
                      disabled={createLoading}
                    />
                    {createErrors.last_name && (
                      <p className="mt-1 text-sm text-red-600">{createErrors.last_name}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={createForm.email}
                      onChange={handleCreateChange}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                      disabled={createLoading}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone_number"
                      value={createForm.phone_number}
                      onChange={handleCreateChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 ${
                        createErrors.phone_number ? 'border-red-500' : 'border-neutral-300'
                      }`}
                      disabled={createLoading}
                      placeholder="08012345678"
                    />
                    {createErrors.phone_number && (
                      <p className="mt-1 text-sm text-red-600">{createErrors.phone_number}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={createForm.gender}
                      onChange={handleCreateChange}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                      disabled={createLoading}
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="date_of_birth"
                      value={createForm.date_of_birth}
                      onChange={handleCreateChange}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                      disabled={createLoading}
                    />
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div>
                <h4 className="text-lg font-semibold text-secondary-800 mb-4 pb-2 border-b border-secondary-200">
                  Address Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Address
                    </label>
                    <textarea
                      name="address"
                      value={createForm.address}
                      onChange={handleCreateChange}
                      rows="2"
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                      disabled={createLoading}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={createForm.city}
                      onChange={handleCreateChange}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                      disabled={createLoading}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      State of Origin
                    </label>
                    <select
                      name="state_of_origin"
                      value={createForm.state_of_origin}
                      onChange={handleCreateChange}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                      disabled={createLoading}
                    >
                      <option value="lagos">Lagos</option>
                      <option value="abuja">Abuja</option>
                      <option value="oyo">Oyo</option>
                      <option value="rivers">Rivers</option>
                      <option value="kaduna">Kaduna</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      LGA
                    </label>
                    <input
                      type="text"
                      name="lga"
                      value={createForm.lga}
                      onChange={handleCreateChange}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                      disabled={createLoading}
                      placeholder="Local Government Area"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Nationality
                    </label>
                    <input
                      type="text"
                      name="nationality"
                      value={createForm.nationality}
                      onChange={handleCreateChange}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                      disabled={createLoading}
                    />
                  </div>
                </div>
              </div>

              {/* Parent Information */}
              <div>
                <h4 className="text-lg font-semibold text-secondary-800 mb-4 pb-2 border-b border-secondary-200">
                  Parent Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Parent Type
                    </label>
                    <select
                      name="parent_type"
                      value={createForm.parent_type}
                      onChange={handleCreateChange}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                      disabled={createLoading}
                    >
                      <option value="father">Father</option>
                      <option value="mother">Mother</option>
                      <option value="guardian">Guardian</option>
                      <option value="relative">Relative</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Marital Status
                    </label>
                    <select
                      name="marital_status"
                      value={createForm.marital_status}
                      onChange={handleCreateChange}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                      disabled={createLoading}
                    >
                      <option value="married">Married</option>
                      <option value="single">Single</option>
                      <option value="divorced">Divorced</option>
                      <option value="widowed">Widowed</option>
                      <option value="separated">Separated</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Occupation
                    </label>
                    <input
                      type="text"
                      name="occupation"
                      value={createForm.occupation}
                      onChange={handleCreateChange}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                      disabled={createLoading}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Employer
                    </label>
                    <input
                      type="text"
                      name="employer"
                      value={createForm.employer}
                      onChange={handleCreateChange}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                      disabled={createLoading}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Office Phone
                    </label>
                    <input
                      type="tel"
                      name="office_phone"
                      value={createForm.office_phone}
                      onChange={handleCreateChange}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                      disabled={createLoading}
                      placeholder="08012345678"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Preferred Communication
                    </label>
                    <select
                      name="preferred_communication"
                      value={createForm.preferred_communication}
                      onChange={handleCreateChange}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                      disabled={createLoading}
                    >
                      <option value="email">Email</option>
                      <option value="sms">SMS</option>
                      <option value="phone">Phone Call</option>
                      <option value="whatsapp">WhatsApp</option>
                      <option value="in_person">In Person</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Password */}
              <div>
                <h4 className="text-lg font-semibold text-secondary-800 mb-4 pb-2 border-b border-secondary-200">
                  Account Security
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={createForm.password}
                      onChange={handleCreateChange}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                      disabled={createLoading}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      name="confirm_password"
                      value={createForm.confirm_password}
                      onChange={handleCreateChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 ${
                        createErrors.confirm_password ? 'border-red-500' : 'border-neutral-300'
                      }`}
                      disabled={createLoading}
                    />
                    {createErrors.confirm_password && (
                      <p className="mt-1 text-sm text-red-600">{createErrors.confirm_password}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Files */}
              <div>
                <h4 className="text-lg font-semibold text-secondary-800 mb-4 pb-2 border-b border-secondary-200">
                  Documents
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Profile Picture
                    </label>
                    <input
                      type="file"
                      name="profile_picture"
                      onChange={handleCreateChange}
                      accept="image/*"
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                      disabled={createLoading}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      ID Document
                    </label>
                    <input
                      type="file"
                      name="id_document"
                      onChange={handleCreateChange}
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                      disabled={createLoading}
                    />
                  </div>
                </div>
              </div>
              
              {/* Status */}
              <div>
                <h4 className="text-lg font-semibold text-secondary-800 mb-4 pb-2 border-b border-secondary-200">
                  Status
                </h4>
                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_active"
                      name="is_active"
                      checked={createForm.is_active}
                      onChange={handleCreateChange}
                      className="h-4 w-4 text-secondary-600 rounded focus:ring-secondary-500"
                      disabled={createLoading}
                    />
                    <label htmlFor="is_active" className="ml-2 text-sm text-neutral-700">
                      Parent is Active
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_pta_member"
                      name="is_pta_member"
                      checked={createForm.is_pta_member}
                      onChange={handleCreateChange}
                      className="h-4 w-4 text-secondary-600 rounded focus:ring-secondary-500"
                      disabled={createLoading}
                    />
                    <label htmlFor="is_pta_member" className="ml-2 text-sm text-neutral-700">
                      PTA Member
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex space-x-3 mt-8 pt-6 border-t border-neutral-200">
              <Button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="flex-1 bg-secondary-500 hover:bg-secondary-600 text-white"
                disabled={createLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={createLoading}
                className="flex-1 bg-secondary-500 hover:bg-secondary-600 text-white"
              >
                {createLoading ? 'Creating...' : 'Create Parent'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
      
      {/* Edit Modal */}
      {showEditModal && (
        <Modal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title="Edit Parent"
          size="6xl"
        >
          <form onSubmit={submitEditForm} className="py-4 max-h-[70vh] overflow-y-auto">
            <div className="space-y-8">
              {/* Personal Information */}
              <div>
                <h4 className="text-lg font-semibold text-secondary-800 mb-4 pb-2 border-b border-secondary-200">
                  Personal Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      value={editForm.first_name}
                      onChange={handleEditChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 ${
                        editErrors.first_name ? 'border-red-500' : 'border-neutral-300'
                      }`}
                      disabled={editLoading}
                    />
                    {editErrors.first_name && (
                      <p className="mt-1 text-sm text-red-600">{editErrors.first_name}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      value={editForm.last_name}
                      onChange={handleEditChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 ${
                        editErrors.last_name ? 'border-red-500' : 'border-neutral-300'
                      }`}
                      disabled={editLoading}
                    />
                    {editErrors.last_name && (
                      <p className="mt-1 text-sm text-red-600">{editErrors.last_name}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={editForm.email}
                      onChange={handleEditChange}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                      disabled={editLoading}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone_number"
                      value={editForm.phone_number}
                      onChange={handleEditChange}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                      disabled={editLoading}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={editForm.gender}
                      onChange={handleEditChange}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                      disabled={editLoading}
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="date_of_birth"
                      value={editForm.date_of_birth}
                      onChange={handleEditChange}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                      disabled={editLoading}
                    />
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div>
                <h4 className="text-lg font-semibold text-secondary-800 mb-4 pb-2 border-b border-secondary-200">
                  Address Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Address
                    </label>
                    <textarea
                      name="address"
                      value={editForm.address}
                      onChange={handleEditChange}
                      rows="2"
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                      disabled={editLoading}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={editForm.city}
                      onChange={handleEditChange}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                      disabled={editLoading}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      State of Origin
                    </label>
                    <select
                      name="state_of_origin"
                      value={editForm.state_of_origin}
                      onChange={handleEditChange}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                      disabled={editLoading}
                    >
                      <option value="">Select State</option>
                      <option value="lagos">Lagos</option>
                      <option value="abuja">Abuja</option>
                      <option value="oyo">Oyo</option>
                      <option value="rivers">Rivers</option>
                      <option value="kaduna">Kaduna</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      LGA
                    </label>
                    <input
                      type="text"
                      name="lga"
                      value={editForm.lga}
                      onChange={handleEditChange}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                      disabled={editLoading}
                      placeholder="Local Government Area"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Nationality
                    </label>
                    <input
                      type="text"
                      name="nationality"
                      value={editForm.nationality}
                      onChange={handleEditChange}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                      disabled={editLoading}
                    />
                  </div>
                </div>
              </div>

              {/* Parent Information */}
              <div>
                <h4 className="text-lg font-semibold text-secondary-800 mb-4 pb-2 border-b border-secondary-200">
                  Parent Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Parent Type
                    </label>
                    <select
                      name="parent_type"
                      value={editForm.parent_type}
                      onChange={handleEditChange}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                      disabled={editLoading}
                    >
                      <option value="father">Father</option>
                      <option value="mother">Mother</option>
                      <option value="guardian">Guardian</option>
                      <option value="relative">Relative</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Marital Status
                    </label>
                    <select
                      name="marital_status"
                      value={editForm.marital_status}
                      onChange={handleEditChange}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                      disabled={editLoading}
                    >
                      <option value="married">Married</option>
                      <option value="single">Single</option>
                      <option value="divorced">Divorced</option>
                      <option value="widowed">Widowed</option>
                      <option value="separated">Separated</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Occupation
                    </label>
                    <input
                      type="text"
                      name="occupation"
                      value={editForm.occupation}
                      onChange={handleEditChange}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                      disabled={editLoading}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Employer
                    </label>
                    <input
                      type="text"
                      name="employer"
                      value={editForm.employer}
                      onChange={handleEditChange}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                      disabled={editLoading}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Office Phone
                    </label>
                    <input
                      type="tel"
                      name="office_phone"
                      value={editForm.office_phone}
                      onChange={handleEditChange}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                      disabled={editLoading}
                      placeholder="08012345678"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Preferred Communication
                    </label>
                    <select
                      name="preferred_communication"
                      value={editForm.preferred_communication}
                      onChange={handleEditChange}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                      disabled={editLoading}
                    >
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
                <h4 className="text-lg font-semibold text-secondary-800 mb-4 pb-2 border-b border-secondary-200">
                  Emergency Contact
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Contact Name
                    </label>
                    <input
                      type="text"
                      name="emergency_contact_name"
                      value={editForm.emergency_contact_name}
                      onChange={handleEditChange}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                      disabled={editLoading}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="emergency_contact_phone"
                      value={editForm.emergency_contact_phone}
                      onChange={handleEditChange}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                      disabled={editLoading}
                      placeholder="08012345678"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Relationship
                    </label>
                    <input
                      type="text"
                      name="emergency_contact_relationship"
                      value={editForm.emergency_contact_relationship}
                      onChange={handleEditChange}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                      disabled={editLoading}
                    />
                  </div>
                </div>
              </div>

              {/* Files */}
              <div>
                <h4 className="text-lg font-semibold text-secondary-800 mb-4 pb-2 border-b border-secondary-200">
                  Documents
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Profile Picture
                    </label>
                    <input
                      type="file"
                      name="profile_picture"
                      onChange={handleEditChange}
                      accept="image/*"
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                      disabled={editLoading}
                    />
                    <p className="mt-1 text-xs text-neutral-500">
                      {editForm.profile_picture?.name || 'No file selected'}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      ID Document
                    </label>
                    <input
                      type="file"
                      name="id_document"
                      onChange={handleEditChange}
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                      disabled={editLoading}
                    />
                    <p className="mt-1 text-xs text-neutral-500">
                      {editForm.id_document?.name || 'No file selected'}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Status */}
              <div>
                <h4 className="text-lg font-semibold text-secondary-800 mb-4 pb-2 border-b border-secondary-200">
                  Status
                </h4>
                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_active"
                      name="is_active"
                      checked={editForm.is_active}
                      onChange={handleEditChange}
                      className="h-4 w-4 text-secondary-600 rounded focus:ring-secondary-500"
                      disabled={editLoading}
                    />
                    <label htmlFor="is_active" className="ml-2 text-sm text-neutral-700">
                      Parent is Active
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_verified"
                      name="is_verified"
                      checked={editForm.is_verified}
                      onChange={handleEditChange}
                      className="h-4 w-4 text-secondary-600 rounded focus:ring-secondary-500"
                      disabled={editLoading}
                    />
                    <label htmlFor="is_verified" className="ml-2 text-sm text-neutral-700">
                      Verified
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_pta_member"
                      name="is_pta_member"
                      checked={editForm.is_pta_member}
                      onChange={handleEditChange}
                      className="h-4 w-4 text-secondary-600 rounded focus:ring-secondary-500"
                      disabled={editLoading}
                    />
                    <label htmlFor="is_pta_member" className="ml-2 text-sm text-neutral-700">
                      PTA Member
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex space-x-3 mt-8 pt-6 border-t border-neutral-200">
              <Button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="flex-1 bg-secondary-500 hover:bg-secondary-600 text-white"
                disabled={editLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={editLoading}
                className="flex-1 bg-secondary-500 hover:bg-secondary-600 text-white"
              >
                {editLoading ? 'Updating...' : 'Update Parent'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
      
      {/* Link Child Modal */}
      {showLinkModal && (
        <Modal
          isOpen={showLinkModal}
          onClose={() => setShowLinkModal(false)}
          title="Link Child to Parent"
          size="lg"
        >
          <form onSubmit={submitLinkForm} className="py-4">
            <div className="space-y-6">
              {/* Student Search */}
              <div>
                <h4 className="font-medium text-neutral-700 mb-3">1. Find Student</h4>
                <div className="flex space-x-3">
                  <div className="flex-1">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Student Admission Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="student_admission_number"
                        value={linkForm.student_admission_number}
                        onChange={handleLinkChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 ${
                          linkErrors.student_admission_number ? 'border-red-500' : 'border-neutral-300'
                        }`}
                        placeholder="e.g., ADM/2024/001"
                        disabled={linkLoading || searchingStudents}
                      />
                      {linkErrors.student_admission_number && (
                        <p className="mt-1 text-sm text-red-600">{linkErrors.student_admission_number}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-end">
                    <Button
                      type="button"
                      onClick={searchForStudent}
                      loading={searchingStudents}
                      disabled={linkLoading || searchingStudents}
                      className="bg-secondary-500 hover:bg-secondary-600 text-white"
                    >
                      Search
                    </Button>
                  </div>
                </div>

                {/* Student Search Results */}
                {studentSearchResults.length > 0 && !selectedStudent && (
                  <div className="mt-3 border border-neutral-200 rounded-lg overflow-hidden">
                    <div className="bg-neutral-50 px-4 py-2 border-b border-neutral-200">
                      <h5 className="font-medium text-neutral-700">Search Results</h5>
                    </div>
                    <div className="divide-y divide-neutral-200">
                      {studentSearchResults.map((student) => (
                        <div
                          key={student.id}
                          className="px-4 py-3 hover:bg-neutral-50 cursor-pointer"
                          onClick={() => selectStudent(student)}
                        >
                          <div className="font-medium text-neutral-800">{student.full_name}</div>
                          <div className="text-sm text-neutral-600">
                            Admission: {student.admission_number} • Class: {student.class_level_name}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Selected Student */}
                {selectedStudent && (
                  <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-medium text-green-800">Selected Student</h5>
                        <div className="mt-1">
                          <div className="font-medium text-neutral-800">{selectedStudent.full_name}</div>
                          <div className="text-sm text-neutral-600">
                            Admission: {selectedStudent.admission_number} • Class: {selectedStudent.class_level_name}
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedStudent(null);
                          setLinkForm(prev => ({ ...prev, student_admission_number: '' }));
                        }}
                        className="text-neutral-400 hover:text-neutral-600"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Parent Search */}
              <div>
                <h4 className="font-medium text-neutral-700 mb-3">2. Find Parent</h4>
                <div className="flex space-x-3">
                  <div className="flex-1">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Parent ID <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="parent_id"
                        value={linkForm.parent_id}
                        onChange={handleLinkChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 ${
                          linkErrors.parent_id ? 'border-red-500' : 'border-neutral-300'
                        }`}
                        placeholder="e.g., PAR123456"
                        disabled={linkLoading || searchingParents}
                      />
                      {linkErrors.parent_id && (
                        <p className="mt-1 text-sm text-red-600">{linkErrors.parent_id}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-end">
                    <Button
                      type="button"
                      onClick={searchForParent}
                      loading={searchingParents}
                      disabled={linkLoading || searchingParents}
                      className="bg-secondary-500 hover:bg-secondary-600 text-white"
                    >
                      Search
                    </Button>
                  </div>
                </div>

                {/* Parent Search Results */}
                {parentSearchResults.length > 0 && !selectedParent && (
                  <div className="mt-3 border border-neutral-200 rounded-lg overflow-hidden">
                    <div className="bg-neutral-50 px-4 py-2 border-b border-neutral-200">
                      <h5 className="font-medium text-neutral-700">Search Results</h5>
                    </div>
                    <div className="divide-y divide-neutral-200">
                      {parentSearchResults.map((parent) => (
                        <div
                          key={parent.id}
                          className="px-4 py-3 hover:bg-neutral-50 cursor-pointer"
                          onClick={() => selectParent(parent)}
                        >
                          <div className="font-medium text-neutral-800">
                            {parent.user?.first_name} {parent.user?.last_name}
                          </div>
                          <div className="text-sm text-neutral-600">
                            ID: {parent.parent_id} • Type: {parent.parent_type_display}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Selected Parent */}
                {selectedParent && (
                  <div className="mt-3 bg-secondary-50 border border-secondary-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-medium text-secondary-800">Selected Parent</h5>
                        <div className="mt-1">
                          <div className="font-medium text-neutral-800">
                            {selectedParent.user?.first_name} {selectedParent.user?.last_name}
                          </div>
                          <div className="text-sm text-neutral-600">
                            ID: {selectedParent.parent_id} • Type: {selectedParent.parent_type_display}
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedParent(null);
                          setLinkForm(prev => ({ ...prev, parent_id: '' }));
                        }}
                        className="text-neutral-400 hover:text-neutral-600"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Relationship */}
              <div>
                <h4 className="font-medium text-neutral-700 mb-3">3. Set Relationship</h4>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Relationship Type <span className="text-red-500">*</span></label>
                  <select
                    name="relationship_type"
                    value={linkForm.relationship_type}
                    onChange={handleLinkChange}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                    disabled={linkLoading}
                    required
                  >
                    <option value="father">Father</option>
                    <option value="mother">Mother</option>
                  </select>
                </div>
              </div>

              {/* Summary */}
              {selectedStudent && selectedParent && (
                <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                  <h4 className="font-medium text-neutral-700 mb-3">Link Summary</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Student:</span>
                      <span className="font-medium">{selectedStudent.full_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Parent:</span>
                      <span className="font-medium">{selectedParent.user?.first_name} {selectedParent.user?.last_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Relationship:</span>
                      <span className="font-medium">{linkForm.relationship_type === 'father' ? 'Father' : 'Mother'}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex space-x-3 mt-8 pt-6 border-t border-neutral-200">
              <Button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="flex-1 bg-secondary-500 hover:bg-secondary-600 text-white"
                disabled={linkLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={linkLoading}
                className="flex-1 bg-secondary-500 hover:bg-secondary-600 text-white"
                disabled={linkLoading || !selectedStudent || !selectedParent}
              >
                {linkLoading ? 'Linking...' : 'Link Child'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Delete Parent"
          size="md"
        >
          <div className="py-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="text-red-600" size={24} />
            </div>
            
            <h3 className="text-lg font-medium text-center text-neutral-800 mb-2">
              Delete {selectedParent?.user?.first_name} {selectedParent?.user?.last_name}?
            </h3>
            
            <p className="text-neutral-600 text-center mb-6">
              Are you sure you want to delete this parent? This action cannot be undone. 
              All parent data, including linked children relationships, will be permanently removed.
            </p>
            
            <div className="bg-red-50 border border-red-100 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <XCircle className="text-red-500 mt-0.5 mr-3 flex-shrink-0" size={18} />
                <div>
                  <p className="text-sm font-medium text-red-800 mb-1">Warning: This action is permanent</p>
                  <p className="text-sm text-red-600">
                    • Parent profile will be deleted<br />
                    • User account will be deactivated<br />
                    • All linked children relationships will be removed<br />
                    • All associated data will be lost
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 bg-secondary-500 hover:bg-secondary-600 text-white"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                Delete Parent
              </Button>
            </div>
          </div>
        </Modal>
      )}
      
      {/* Password Reset Modal */}
      {showPasswordModal && (
        <Modal
          isOpen={showPasswordModal}
          onClose={() => setShowPasswordModal(false)}
          title="Reset Parent Password"
          size="md"
        >
          <form onSubmit={submitPasswordReset} className="py-6">
            <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="text-secondary-600" size={24} />
            </div>
            
            <h3 className="text-lg font-medium text-center text-neutral-800 mb-2">
              Reset Password for {selectedParent?.user?.first_name} {selectedParent?.user?.last_name}
            </h3>
            
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
                  placeholder="Minimum 8 characters"
                />
                {passwordErrors.new_password && (
                  <p className="mt-1 text-sm text-red-600">{passwordErrors.new_password}</p>
                )}
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
            
            <div className="flex space-x-3 mt-8">
              <Button
                type="button"
                onClick={() => setShowPasswordModal(false)}
                className="flex-1 bg-secondary-500 hover:bg-secondary-600 text-white"
                disabled={passwordLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={passwordLoading}
                className="flex-1 bg-secondary-500 hover:bg-secondary-600 text-white"
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

export default Parent;