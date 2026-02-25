/**
 * Student List Page - COMPREHENSIVE WITH CRUD OPERATIONS
 * Advanced student management with modal-based operations
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import Modal from '../components/common/modal'; // changed
import useAuth from '../hooks/useAuth';
import { 
  getAllStudents,  
  deleteStudent, 
  updateStudent,
  searchStudents,
  getStudentById,
  updateStudentPassword,
  getClassLevels as fetchClassLevels,
  getStudents  
} from '../services/studentService';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Eye, 
  Edit2, 
  Trash2, 
  UserPlus,
  ChevronLeft,
  ChevronRight,
  User,
  BookOpen,
  GraduationCap,
  Home,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Shield,
  CheckCircle,
  XCircle,
  Download,
  RefreshCw,
  Upload,
  Lock,
  X,
  UserCheck,
  UserX,
  Award,
  FileText,
  Activity,
  Heart,
  Shield as SecurityShield,
  Camera,
  Users,
  ArrowUpDown,
  Printer
} from 'lucide-react';

const StudentList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Check permissions
  const isAdmin = user?.role === 'head' || user?.role === 'hm' || 
                  user?.role === 'principal' || user?.role === 'vice_principal' ||
                  user?.is_staff;
  const isAccountant = user?.role === 'accountant';
  const isTeacher = user?.role === 'teacher' || user?.role === 'form_teacher' || 
                    user?.role === 'subject_teacher';
  const canViewStudents = isAdmin || isAccountant || isTeacher;
  
  // STATES
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [classLevels, setClassLevels] = useState([]);
  
  // PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0);
  const studentsPerPage = 10;
  
  // SEARCH & FILTERS
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    class_level: '',
    stream: '',
    fee_status: '',
    student_category: '',
    is_active: '',
    is_graduated: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  
  // MODAL STATES
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  
  // STUDENT DETAILS STATE
  const [studentDetails, setStudentDetails] = useState(null);
  
  // EDIT FORM STATE
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
    
    // Student specific
    class_level: '',
    stream: '',
    admission_date: '',
    admission_number: '',
    student_id: '',
    place_of_birth: '',
    home_language: '',
    house: '',
    previous_class: '',
    previous_school: '',
    transfer_certificate_no: '',
    is_prefect: false,
    prefect_role: '',
    student_category: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    emergency_contact_relationship: '',
    fee_status: '',
    total_fee_amount: '',
    amount_paid: '',
    blood_group: '',
    genotype: '',
    has_allergies: false,
    allergy_details: '',
    has_received_vaccinations: true,
    family_doctor_name: '',
    family_doctor_phone: '',
    medical_conditions: '',
    has_learning_difficulties: false,
    learning_difficulties_details: '',
    transportation_mode: '',
    bus_route: '',
    is_active: true,
    is_graduated: false,
    graduation_date: '',
    
    // Files
    student_image: null,
    birth_certificate: null,
    immunization_record: null,
    previous_school_report: null,
    parent_id_copy: null,
    fee_payment_evidence: null
  });
  
  // PASSWORD FORM STATE
  const [passwordForm, setPasswordForm] = useState({
    new_password: '',
    confirm_password: ''
  });
  
  // LOADING STATES
  const [editLoading, setEditLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  
  // ERRORS
  const [editErrors, setEditErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});

  // Load students on mount
  useEffect(() => {
    if (canViewStudents) {
      loadStudents();
      loadClassLevels();
    }
  }, [currentPage, canViewStudents]);

  // Load class levels
  const loadClassLevels = async () => {
    try {
      const levels = await fetchClassLevels();
      setClassLevels(levels);
    } catch (err) {
      console.error('Error loading class levels:', err);
    }
  };

  // Load students function - FIXED
  const loadStudents = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      const params = {
        page: currentPage,
        limit: studentsPerPage,
        ...filters
      };
      
      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });
      
      console.log('📋 Loading students with params:', params);
      
      let response;
      if (searchTerm.trim()) {
        response = await searchStudents(searchTerm, params);
      } else {
        response = await getStudents(params);
      }
      
      console.log('📊 API Response:', response);
      
      // Handle response structure
      if (response && typeof response === 'object') {
        if (response.success === false) {
          // Fallback response structure
          setStudents([]);
          setTotalPages(1);
          setTotalStudents(0);
        } else if (response.results) {
          // Standard paginated response
          setStudents(response.results || []);
          setTotalPages(response.total_pages || 1);
          setTotalStudents(response.count || 0);
        } else if (response.data && Array.isArray(response.data.results)) {
          // Nested results structure
          setStudents(response.data.results || []);
          setTotalPages(response.data.total_pages || 1);
          setTotalStudents(response.data.count || 0);
        } else if (Array.isArray(response)) {
          // Direct array response
          setStudents(response);
          setTotalPages(1);
          setTotalStudents(response.length);
        } else if (response.data && Array.isArray(response.data)) {
          // Data array response
          setStudents(response.data);
          setTotalPages(1);
          setTotalStudents(response.data.length);
        } else {
          // Single object
          setStudents([]);
          setTotalPages(1);
          setTotalStudents(0);
        }
      } else {
        setStudents([]);
        setTotalPages(1);
        setTotalStudents(0);
      }
      
    } catch (err) {
      console.error('❌ Error loading students:', err);
      setError('Failed to load students. Please try again.');
      setStudents([]);
      setTotalPages(1);
      setTotalStudents(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, filters, searchTerm]);

  // Handle search
  const handleSearch = async (e) => {
    e.preventDefault();
    setCurrentPage(1);
    await loadStudents();
  };

  // Handle filter change
  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Apply filters
  const applyFilters = () => {
    setCurrentPage(1);
    loadStudents();
    setShowFilters(false);
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      class_level: '',
      stream: '',
      fee_status: '',
      student_category: '',
      is_active: '',
      is_graduated: ''
    });
    setSearchTerm('');
    setCurrentPage(1);
    loadStudents();
  };

  // =====================
  // PRINT STUDENT DETAILS FUNCTION
  // =====================
  const handlePrintStudent = (student) => {
    if (!student) return;
    
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    
    // Generate printable HTML
    const printContent = generateStudentPrintableHTML(student);
    
    printWindow.document.write(printContent);
    printWindow.document.close();
    
    // Wait for content to load, then print
    printWindow.onload = () => {
      printWindow.print();
    };
  };

// Generate printable HTML for student details
const generateStudentPrintableHTML = (student) => {
  // Extract all data safely
  const user = student.user || {};
  const firstName = user.first_name || student.first_name || '';
  const lastName = user.last_name || student.last_name || '';
  const fullName = `${firstName} ${lastName}`.trim() || student.full_name || 'Unknown Student';
  const email = user.email || student.email || 'Not provided';
  const phone = user.phone_number || student.phone_number || 'Not provided';
  const gender = user.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : 'Not specified';
  const dateOfBirth = user.date_of_birth || student.date_of_birth || 'Not provided';
  const address = user.address || student.address || 'No address provided';
  const registrationNumber = user.registration_number || student.registration_number || 'Not available';
  
  // Calculate age
  const calculateAge = (dob) => {
    if (!dob) return 'Not specified';
    const birthDate = new Date(dob);
    const ageDifMs = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };
  const age = dateOfBirth !== 'Not provided' ? calculateAge(dateOfBirth) : 'Not specified';
  
  // Student academic info
  const classLevelName = student.class_level_info?.name || 
                        student.class_level?.name || 
                        student.class_name || 
                        'Not assigned';
  const stream = student.stream === 'science' ? 'Science' :
                student.stream === 'commercial' ? 'Commercial' :
                student.stream === 'art' ? 'Arts/Humanities' :
                student.stream === 'technical' ? 'Technical' :
                student.stream === 'general' ? 'General' : 'Not Applicable';
  
  const house = student.house || 'None';
  const studentCategory = student.student_category === 'day' ? 'Day' :
                        student.student_category === 'boarding' ? 'Boarding' :
                        student.student_category === 'special_needs' ? 'Special Needs' :
                        student.student_category === 'scholarship' ? 'Scholarship' :
                        student.student_category === 'repeat' ? 'Repeating' : 'New Student';
  
  const admissionNumber = student.admission_number || 'N/A';
  const studentId = student.student_id || 'N/A';
  const admissionDate = student.admission_date || 'Not recorded';
  
  // Financial info
  const totalFee = student.total_fee_amount || 0;
  const amountPaid = student.amount_paid || 0;
  const balanceDue = totalFee - amountPaid;
  
  // Fee status
  const feeStatus = student.fee_status || 'not_paid';
  const feeStatusText = {
    'paid_full': 'Paid in Full',
    'paid_partial': 'Partially Paid',
    'not_paid': 'Not Paid',
    'scholarship': 'On Scholarship',
    'exempted': 'Fee Exempted'
  }[feeStatus] || 'Not Paid';
  
  // Health info
  const bloodGroup = student.blood_group || 'Not specified';
  const genotype = student.genotype || 'Not specified';
  const allergies = student.has_allergies ? 'Yes' : 'No';
  const allergyDetails = student.allergy_details || '';
  const vaccinations = student.has_received_vaccinations ? 'Complete' : 'Incomplete';
  const medicalConditions = student.medical_conditions || 'None reported';
  
  // Emergency contact
  const emergencyName = student.emergency_contact_name || 'Not provided';
  const emergencyPhone = student.emergency_contact_phone || 'Not provided';
  const emergencyRelation = student.emergency_contact_relationship || 'Not provided';
  
  // Transportation
  const transportMode = student.transportation_mode === 'school_bus' ? 'School Bus' :
                       student.transportation_mode === 'parent_drop' ? 'Parent Drop-off' :
                       student.transportation_mode === 'public_transport' ? 'Public Transport' :
                       student.transportation_mode === 'walk' ? 'Walks to School' : 'Other';
  const busRoute = student.bus_route || 'N/A';
  
  // Status
  const isActive = student.is_active ? 'Active' : 'Inactive';
  const isGraduated = student.is_graduated ? 'Yes' : 'No';
  
  // Image
  const imageUrl = student.student_image_url || student.profile_picture || null;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${fullName} - Student Record</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Arial', sans-serif;
          line-height: 1.5;
          color: #333;
          background: white;
          padding: 20px;
        }
        
        .student-record {
          max-width: 210mm;
          margin: 0 auto;
          background: white;
        }
        
        .header {
          text-align: center;
          border-bottom: 3px solid #003366;
          padding-bottom: 15px;
          margin-bottom: 20px;
        }
        
        .school-name {
          font-size: 28px;
          font-weight: bold;
          color: #003366;
          margin-bottom: 5px;
        }
        
        .document-title {
          font-size: 18px;
          color: #666;
          margin-bottom: 5px;
        }
        
        .document-subtitle {
          font-size: 14px;
          color: #888;
        }
        
        .student-header {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 10px;
          margin-bottom: 20px;
          display: flex;
          align-items: flex-start;
          border: 1px solid #e0e0e0;
        }
        
        .student-photo {
          width: 100px;
          height: 100px;
          border-radius: 10px;
          object-fit: cover;
          margin-right: 20px;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .student-photo-placeholder {
          width: 100px;
          height: 100px;
          border-radius: 10px;
          background: #e3f2fd;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 20px;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          font-size: 48px;
          font-weight: bold;
          color: #1976d2;
        }
        
        .student-info {
          flex: 1;
        }
        
        .student-name {
          font-size: 24px;
          font-weight: bold;
          color: #003366;
          margin-bottom: 10px;
        }
        
        .badge-container {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 10px;
        }
        
        .badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }
        
        .badge.active {
          background: #e8f5e9;
          color: #2e7d32;
        }
        
        .badge.inactive {
          background: #ffebee;
          color: #c62828;
        }
        
        .badge.graduated {
          background: #f3e5f5;
          color: #7b1fa2;
        }
        
        .badge.fee-paid {
          background: #e8f5e9;
          color: #2e7d32;
        }
        
        .badge.fee-partial {
          background: #fff3e0;
          color: #e65100;
        }
        
        .badge.fee-unpaid {
          background: #ffebee;
          color: #c62828;
        }
        
        .info-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-top: 10px;
        }
        
        .info-item {
          font-size: 13px;
        }
        
        .info-label {
          color: #666;
          font-weight: 500;
        }
        
        .info-value {
          color: #333;
          font-weight: 600;
        }
        
        .section {
          margin-bottom: 25px;
          page-break-inside: avoid;
        }
        
        .section-title {
          font-size: 18px;
          font-weight: bold;
          color: #003366;
          margin-bottom: 15px;
          padding-bottom: 8px;
          border-bottom: 2px solid #e0e0e0;
        }
        
        .two-column {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }
        
        .info-box {
          padding: 15px;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          background: #fff;
        }
        
        .info-box-title {
          font-weight: 600;
          font-size: 16px;
          margin-bottom: 15px;
          color: #003366;
          padding-bottom: 8px;
          border-bottom: 1px solid #e0e0e0;
        }
        
        .info-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #f5f5f5;
        }
        
        .info-row:last-child {
          border-bottom: none;
        }
        
        .info-row .label {
          color: #666;
          font-weight: 500;
        }
        
        .info-row .value {
          color: #333;
          font-weight: 600;
        }
        
        .financial-summary {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
          margin-top: 15px;
        }
        
        .financial-card {
          text-align: center;
          padding: 15px;
          border-radius: 8px;
        }
        
        .financial-card.blue {
          background: #e3f2fd;
        }
        
        .financial-card.green {
          background: #e8f5e9;
        }
        
        .financial-card.red {
          background: #ffebee;
        }
        
        .financial-label {
          font-size: 12px;
          color: #666;
          margin-bottom: 5px;
        }
        
        .financial-amount {
          font-size: 20px;
          font-weight: bold;
        }
        
        .financial-amount.blue {
          color: #1976d2;
        }
        
        .financial-amount.green {
          color: #388e3c;
        }
        
        .financial-amount.red {
          color: #c62828;
        }
        
        .health-tag {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 600;
          margin-left: 8px;
        }
        
        .health-tag.allergy {
          background: #ffebee;
          color: #c62828;
        }
        
        .health-tag.vaccinated {
          background: #e8f5e9;
          color: #2e7d32;
        }
        
        .footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 2px solid #e0e0e0;
          text-align: center;
          font-size: 11px;
          color: #888;
        }
        
        .print-date {
          margin-top: 5px;
          font-size: 10px;
        }
        
        hr {
          border: none;
          border-top: 1px dashed #ccc;
          margin: 15px 0;
        }
        
        @media print {
          body {
            padding: 0;
          }
          
          .no-print {
            display: none;
          }
          
          .student-record {
            max-width: 100%;
          }
          
          .section {
            page-break-inside: avoid;
          }
        }
      </style>
    </head>
    <body>
      <div class="student-record">
        <!-- Header -->
        <div class="header">
          <div class="school-name">CONCORD TUTOR SCHOOL</div>
          <div class="document-title">Complete Student Record</div>
          <div class="document-subtitle">Official Student Information & Academic Profile</div>
        </div>
        
        <!-- Student Header with Photo -->
        <div class="student-header">
          ${imageUrl ? 
            `<img src="${imageUrl}" alt="${fullName}" class="student-photo" onerror="this.style.display='none';">` :
            `<div class="student-photo-placeholder">${fullName.charAt(0).toUpperCase()}</div>`
          }
          <div class="student-info">
            <div class="student-name">${fullName}</div>
            <div class="badge-container">
              <span class="badge ${student.is_active ? 'active' : 'inactive'}">
                ${isActive}
              </span>
              ${student.is_graduated ? 
                `<span class="badge graduated">Graduated</span>` : 
                ''
              }
              <span class="badge fee-${feeStatus}">
                ${feeStatusText}
              </span>
            </div>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Reg No:</span>
                <span class="info-value">${registrationNumber}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Admission No:</span>
                <span class="info-value">${admissionNumber}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Student ID:</span>
                <span class="info-value">${studentId}</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Personal Information -->
        <div class="section">
          <div class="section-title">Personal Information</div>
          <div class="two-column">
            <div class="info-box">
              <div class="info-row">
                <span class="label">First Name:</span>
                <span class="value">${firstName || 'N/A'}</span>
              </div>
              <div class="info-row">
                <span class="label">Last Name:</span>
                <span class="value">${lastName || 'N/A'}</span>
              </div>
              <div class="info-row">
                <span class="label">Gender:</span>
                <span class="value">${gender}</span>
              </div>
              <div class="info-row">
                <span class="label">Date of Birth:</span>
                <span class="value">${dateOfBirth} (Age: ${age})</span>
              </div>
            </div>
            <div class="info-box">
              <div class="info-row">
                <span class="label">Email:</span>
                <span class="value">${email}</span>
              </div>
              <div class="info-row">
                <span class="label">Phone:</span>
                <span class="value">${phone}</span>
              </div>
              <div class="info-row">
                <span class="label">Nationality:</span>
                <span class="value">${user.nationality || student.nationality || 'Nigerian'}</span>
              </div>
              <div class="info-row">
                <span class="label">State of Origin:</span>
                <span class="value">${user.state_of_origin || student.state_of_origin || 'Not specified'}</span>
              </div>
            </div>
          </div>
          <div class="info-box" style="margin-top: 10px;">
            <div class="info-row">
              <span class="label">Address:</span>
              <span class="value">${address}</span>
            </div>
            <div class="info-row">
              <span class="label">City/LGA:</span>
              <span class="value">${user.city || student.city || ''} / ${user.lga || student.lga || ''}</span>
            </div>
          </div>
        </div>
        
        <!-- Academic Information -->
        <div class="section">
          <div class="section-title">Academic Information</div>
          <div class="two-column">
            <div class="info-box">
              <div class="info-box-title">Current Placement</div>
              <div class="info-row">
                <span class="label">Class Level:</span>
                <span class="value">${classLevelName}</span>
              </div>
              <div class="info-row">
                <span class="label">Stream:</span>
                <span class="value">${stream}</span>
              </div>
              <div class="info-row">
                <span class="label">House:</span>
                <span class="value">${house}</span>
              </div>
              <div class="info-row">
                <span class="label">Category:</span>
                <span class="value">${studentCategory}</span>
              </div>
            </div>
            <div class="info-box">
              <div class="info-box-title">Admission Details</div>
              <div class="info-row">
                <span class="label">Admission Date:</span>
                <span class="value">${admissionDate}</span>
              </div>
              <div class="info-row">
                <span class="label">Previous School:</span>
                <span class="value">${student.previous_school || 'N/A'}</span>
              </div>
              <div class="info-row">
                <span class="label">Previous Class:</span>
                <span class="value">${student.previous_class || 'N/A'}</span>
              </div>
              <div class="info-row">
                <span class="label">Transfer Cert No:</span>
                <span class="value">${student.transfer_certificate_no || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Financial Information -->
        <div class="section">
          <div class="section-title">Financial Information</div>
          <div class="financial-summary">
            <div class="financial-card blue">
              <div class="financial-label">Total Fee</div>
              <div class="financial-amount blue">₦${totalFee.toLocaleString()}</div>
            </div>
            <div class="financial-card green">
              <div class="financial-label">Amount Paid</div>
              <div class="financial-amount green">₦${amountPaid.toLocaleString()}</div>
            </div>
            <div class="financial-card red">
              <div class="financial-label">Balance Due</div>
              <div class="financial-amount red">₦${balanceDue.toLocaleString()}</div>
            </div>
          </div>
          <div class="info-box" style="margin-top: 15px;">
            <div class="info-row">
              <span class="label">Fee Status:</span>
              <span class="value"><strong>${feeStatusText}</strong></span>
            </div>
          </div>
        </div>
        
        <!-- Health Information -->
        <div class="section">
          <div class="section-title">Health Information</div>
          <div class="two-column">
            <div class="info-box">
              <div class="info-box-title">Medical Details</div>
              <div class="info-row">
                <span class="label">Blood Group:</span>
                <span class="value">${bloodGroup}</span>
              </div>
              <div class="info-row">
                <span class="label">Genotype:</span>
                <span class="value">${genotype}</span>
              </div>
              <div class="info-row">
                <span class="label">Allergies:</span>
                <span class="value">
                  ${allergies}
                  ${allergies === 'Yes' && allergyDetails ? 
                    `<span class="health-tag allergy">${allergyDetails}</span>` : 
                    ''}
                </span>
              </div>
              <div class="info-row">
                <span class="label">Vaccinations:</span>
                <span class="value">
                  ${vaccinations}
                  ${vaccinations === 'Complete' ? 
                    '<span class="health-tag vaccinated">✓</span>' : 
                    ''}
                </span>
              </div>
            </div>
            <div class="info-box">
              <div class="info-box-title">Medical Contacts</div>
              <div class="info-row">
                <span class="label">Family Doctor:</span>
                <span class="value">${student.family_doctor_name || 'Not specified'}</span>
              </div>
              <div class="info-row">
                <span class="label">Doctor's Phone:</span>
                <span class="value">${student.family_doctor_phone || 'Not specified'}</span>
              </div>
              <div class="info-row">
                <span class="label">Medical Conditions:</span>
                <span class="value">${medicalConditions}</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Emergency Contact -->
        <div class="section">
          <div class="section-title">Emergency Contact</div>
          <div class="info-box">
            <div class="info-row">
              <span class="label">Contact Name:</span>
              <span class="value">${emergencyName}</span>
            </div>
            <div class="info-row">
              <span class="label">Relationship:</span>
              <span class="value">${emergencyRelation}</span>
            </div>
            <div class="info-row">
              <span class="label">Phone Number:</span>
              <span class="value">${emergencyPhone}</span>
            </div>
          </div>
        </div>
        
        <!-- Transportation -->
        <div class="section">
          <div class="section-title">Transportation</div>
          <div class="info-box">
            <div class="info-row">
              <span class="label">Mode of Transport:</span>
              <span class="value">${transportMode}</span>
            </div>
            <div class="info-row">
              <span class="label">Bus Route:</span>
              <span class="value">${busRoute}</span>
            </div>
          </div>
        </div>
        
        <!-- Additional Information -->
        ${student.learning_difficulties_details || student.has_learning_difficulties ? `
          <div class="section">
            <div class="section-title">Learning Support</div>
            <div class="info-box">
              <div class="info-row">
                <span class="label">Learning Difficulties:</span>
                <span class="value">${student.has_learning_difficulties ? 'Yes' : 'No'}</span>
              </div>
              ${student.learning_difficulties_details ? `
                <div class="info-row">
                  <span class="label">Details:</span>
                  <span class="value">${student.learning_difficulties_details}</span>
                </div>
              ` : ''}
            </div>
          </div>
        ` : ''}
        
        ${student.is_prefect ? `
          <div class="section">
            <div class="section-title">Leadership</div>
            <div class="info-box">
              <div class="info-row">
                <span class="label">Prefect Role:</span>
                <span class="value">${student.prefect_role || 'Prefect'}</span>
              </div>
            </div>
          </div>
        ` : ''}
        
        <!-- Footer -->
        <div class="footer">
          <p>This is an official student record from CONCORD TUTOR SCHOOL</p>
          <p>For verification, please contact the school administration</p>
          <div class="print-date">
            Generated on ${new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
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
      await updateStudentPassword(selectedStudent.id, {
        new_password: passwordForm.new_password,
        confirm_password: passwordForm.confirm_password
      });
      
      const studentName = selectedStudent?.user?.first_name 
        ? `${selectedStudent.user.first_name} ${selectedStudent.user.last_name || ''}`
        : selectedStudent?.admission_number || 'Student';
      
      setSuccess(`Password reset successfully for ${studentName}`);
      setShowPasswordModal(false);
      setSelectedStudent(null);
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

  // Handle view student details - FIXED
  const handleViewStudent = async (student) => {
    try {
      setDetailLoading(true);
      setSelectedStudent(student);
      
      // Fetch complete student details
      console.log(`👤 Fetching details for student ID: ${student.id}`);
      const details = await getStudentById(student.id);
      console.log('📋 Student details fetched:', details);
      
      setStudentDetails(details.student || details);
      setShowViewModal(true);
    } catch (err) {
      console.error('❌ Error fetching student details:', err);
      setError('Failed to load student details. Please try again.');
    } finally {
      setDetailLoading(false);
    }
  };

  // Handle edit student
  const handleEditClick = (student) => {
    setSelectedStudent(student);
    
    // Log for debugging
    console.log('📝 Student data for edit:', student);
    
    // Extract user data safely
    const userData = student.user || {};
    
    // Populate edit form
    const formData = {
      first_name: userData.first_name || '',
      last_name: userData.last_name || '',
      email: userData.email || '',
      phone_number: userData.phone_number || '',
      gender: userData.gender || '',
      date_of_birth: userData.date_of_birth || '',
      address: userData.address || '',
      city: userData.city || '',
      state_of_origin: userData.state_of_origin || '',
      lga: userData.lga || '',
      nationality: userData.nationality || 'Nigerian',
      
      // Student fields
      class_level: student.class_level?.id || student.class_level || '',
      stream: student.stream || '',
      admission_date: student.admission_date || '',
      admission_number: student.admission_number || '',
      student_id: student.student_id || '',
      place_of_birth: student.place_of_birth || '',
      home_language: student.home_language || '',
      house: student.house || '',
      previous_class: student.previous_class || '',
      previous_school: student.previous_school || '',
      transfer_certificate_no: student.transfer_certificate_no || '',
      is_prefect: student.is_prefect || false,
      prefect_role: student.prefect_role || '',
      student_category: student.student_category || '',
      emergency_contact_name: student.emergency_contact_name || '',
      emergency_contact_phone: student.emergency_contact_phone || '',
      emergency_contact_relationship: student.emergency_contact_relationship || '',
      fee_status: student.fee_status || '',
      total_fee_amount: student.total_fee_amount || '',
      amount_paid: student.amount_paid || '',
      blood_group: student.blood_group || '',
      genotype: student.genotype || '',
      has_allergies: student.has_allergies || false,
      allergy_details: student.allergy_details || '',
      has_received_vaccinations: student.has_received_vaccinations !== undefined ? student.has_received_vaccinations : true,
      family_doctor_name: student.family_doctor_name || '',
      family_doctor_phone: student.family_doctor_phone || '',
      medical_conditions: student.medical_conditions || '',
      has_learning_difficulties: student.has_learning_difficulties || false,
      learning_difficulties_details: student.learning_difficulties_details || '',
      transportation_mode: student.transportation_mode || '',
      bus_route: student.bus_route || '',
      is_active: student.is_active !== undefined ? student.is_active : true,
      is_graduated: student.is_graduated || false,
      graduation_date: student.graduation_date || '',
      
      // Files
      student_image: null,
      birth_certificate: null,
      immunization_record: null,
      previous_school_report: null,
      parent_id_copy: null,
      fee_payment_evidence: null
    };
    
    setEditForm(formData);
    setEditErrors({});
    setShowEditModal(true);
  };

  // Handle delete student
  const handleDeleteClick = (student) => {
    setSelectedStudent(student);
    setShowDeleteModal(true);
  };

  // Handle password reset
  const handlePasswordClick = (student) => {
    setSelectedStudent(student);
    setPasswordForm({
      new_password: '',
      confirm_password: ''
    });
    setPasswordErrors({});
    setShowPasswordModal(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (!selectedStudent) return;
    
    try {
      await deleteStudent(selectedStudent.id);
      
      const studentName = selectedStudent.user?.first_name 
        ? `${selectedStudent.user.first_name} ${selectedStudent.user.last_name || ''}`
        : selectedStudent.admission_number || 'Student';
      
      setSuccess(`Student ${studentName} deleted successfully!`);
      setShowDeleteModal(false);
      setSelectedStudent(null);
      
      // Reload students
      loadStudents();
      
      // Auto-clear success message
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('❌ Error deleting student:', err);
      setError(err.message || 'Failed to delete student. Please try again.');
    }
  };

  // Handle edit form change
  const handleEditChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'file') {
      setEditForm(prev => ({
        ...prev,
        [name]: files[0]
      }));
    } else if (type === 'checkbox') {
      setEditForm(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setEditForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear field errors
    if (editErrors[name]) {
      setEditErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle password form change
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (passwordErrors[name]) {
      setPasswordErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const submitEditForm = async (e) => {
    e.preventDefault();
    
    // ... validation code ...
    
    try {
      setEditLoading(true);
      setError('');
      
      // Prepare update data
      const updateData = {};
      
      // =====================
      // USER FIELDS
      // =====================
      const userFields = [
        'first_name', 'last_name', 'email', 'phone_number',
        'gender', 'date_of_birth', 'address', 'city',
        'state_of_origin', 'lga', 'nationality'
      ];
      
      userFields.forEach(field => {
        if (field in editForm) {
          updateData[field] = editForm[field] || '';
        }
      });
      
      // =====================
      // STUDENT FIELDS
      // =====================
      const studentFields = [
        'class_level', 'stream', 'admission_date', 'student_category',
        'house', 'place_of_birth', 'home_language', 'previous_class',
        'previous_school', 'transfer_certificate_no', 'is_prefect',
        'prefect_role', 'emergency_contact_name', 'emergency_contact_phone',
        'emergency_contact_relationship', 'fee_status', 'total_fee_amount',
        'amount_paid', 'blood_group', 'genotype', 'has_allergies',
        'allergy_details', 'has_received_vaccinations', 'family_doctor_name',
        'family_doctor_phone', 'medical_conditions', 'has_learning_difficulties',
        'learning_difficulties_details', 'transportation_mode', 'bus_route',
        'is_active', 'is_graduated', 'graduation_date'
      ];
      
      studentFields.forEach(field => {
        if (field in editForm && editForm[field] !== undefined) {
          updateData[field] = editForm[field];
        }
      });
      
      // =====================
      // PARENT FIELDS - ONLY IF VALID
      // =====================
      // DON'T send father/mother unless they have actual values
      if (editForm.father && editForm.father !== '' && editForm.father !== null) {
        updateData.father = editForm.father;
      }
      
      if (editForm.mother && editForm.mother !== '' && editForm.mother !== null) {
        updateData.mother = editForm.mother;
      }
      
      // =====================
      // FILES
      // =====================
      const fileFields = [
        'student_image', 'birth_certificate', 'immunization_record',
        'previous_school_report', 'parent_id_copy', 'fee_payment_evidence'
      ];
      
      fileFields.forEach(field => {
        if (editForm[field] instanceof File) {
          updateData[field] = editForm[field];
        }
      });
      
      // =====================
      // SEND UPDATE
      // =====================
      const response = await updateStudent(selectedStudent.id, updateData);
      
      // ... success handling ...
      
    } catch (err) {
      // ... error handling ...
    }
  };



  // Pagination controls
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
          Showing {students.length > 0 ? ((currentPage - 1) * studentsPerPage + 1) : 0} to{' '}
          {Math.min(currentPage * studentsPerPage, totalStudents)} of {totalStudents} students
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

  // Student status badge
  const renderStatusBadge = (student) => {
    if (!student.is_active) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <UserX size={12} className="mr-1" />
          Inactive
        </span>
      );
    }
    
    if (student.is_graduated) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
          <Award size={12} className="mr-1" />
          Graduated
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

  // Fee status badge
  const renderFeeBadge = (student) => {
    const feeStatus = student.fee_status;
    const badgeConfig = {
      'paid_full': { 
        bg: 'bg-green-100', 
        text: 'text-green-800', 
        label: 'Paid',
        icon: <CheckCircle size={12} className="mr-1" />
      },
      'paid_partial': { 
        bg: 'bg-yellow-100', 
        text: 'text-yellow-800', 
        label: 'Partial',
        icon: <Activity size={12} className="mr-1" />
      },
      'not_paid': { 
        bg: 'bg-red-100', 
        text: 'text-red-800', 
        label: 'Unpaid',
        icon: <XCircle size={12} className="mr-1" />
      },
      'scholarship': { 
        bg: 'bg-blue-100', 
        text: 'text-blue-800', 
        label: 'Scholarship',
        icon: <Shield size={12} className="mr-1" />
      },
      'exempted': { 
        bg: 'bg-gray-100', 
        text: 'text-gray-800', 
        label: 'Exempted',
        icon: <SecurityShield size={12} className="mr-1" />
      }
    };
    
    const config = badgeConfig[feeStatus] || badgeConfig.not_paid;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.icon}
        {config.label}
      </span>
    );
  };

  // Stream badge
  const renderStreamBadge = (student) => {
    const stream = student.stream;
    const streamConfig = {
      'science': { bg: 'bg-blue-50', text: 'text-blue-700', label: 'Science' },
      'commercial': { bg: 'bg-purple-50', text: 'text-purple-700', label: 'Commercial' },
      'art': { bg: 'bg-pink-50', text: 'text-pink-700', label: 'Arts' },
      'general': { bg: 'bg-gray-50', text: 'text-gray-700', label: 'General' },
      'technical': { bg: 'bg-orange-50', text: 'text-orange-700', label: 'Technical' },
      'none': { bg: 'bg-gray-50', text: 'text-gray-600', label: 'No Stream' }
    };
    
    const config = streamConfig[stream] || streamConfig.none;
    
    return (
      <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const renderViewModal = () => {
    if (!studentDetails) return null;
    
    const student = studentDetails;
    const user = student.user || {};
    
    // Safely extract data with fallbacks
    const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Not Available';
    const firstName = user.first_name || 'Not Available';
    const lastName = user.last_name || 'Not Available';
    const email = user.email || 'Not provided';
    const phone = user.phone_number || 'Not provided';
    const gender = user.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : 'Not specified';
    const dateOfBirth = user.date_of_birth || 'Not provided';
    const address = user.address || 'No address provided';
    const registrationNumber = user.registration_number || 'Not available';
    
    // Calculate age if date of birth is available
    const calculateAge = (dob) => {
      if (!dob) return 'Not specified';
      const birthDate = new Date(dob);
      const ageDifMs = Date.now() - birthDate.getTime();
      const ageDate = new Date(ageDifMs);
      return Math.abs(ageDate.getUTCFullYear() - 1970);
    };
    
    const age = user.date_of_birth ? calculateAge(user.date_of_birth) : 'Not specified';
    
    // Student academic info
    const classLevelName = student.class_level_info?.name || student.class_level?.name || 'Not assigned';
    const stream = student.stream === 'science' ? 'Science' :
                  student.stream === 'commercial' ? 'Commercial' :
                  student.stream === 'art' ? 'Arts/Humanities' :
                  student.stream === 'technical' ? 'Technical' :
                  student.stream === 'general' ? 'General' : 'Not Applicable';
    
    const house = student.house || 'None';
    const studentCategory = student.student_category === 'day' ? 'Day' :
                          student.student_category === 'boarding' ? 'Boarding' :
                          student.student_category === 'special_needs' ? 'Special Needs' :
                          student.student_category === 'scholarship' ? 'Scholarship' :
                          student.student_category === 'repeat' ? 'Repeating' : 'New Student';
    
    const transportation = student.transportation_mode === 'school_bus' ? 'School Bus' :
                          student.transportation_mode === 'parent_drop' ? 'Parent Drop-off' :
                          student.transportation_mode === 'public_transport' ? 'Public Transport' :
                          student.transportation_mode === 'walk' ? 'Walks to School' : 'Other';
    
    // Health info
    const bloodGroup = student.blood_group || 'Not specified';
    const genotype = student.genotype || 'Not specified';
    const allergies = student.has_allergies ? 'Yes' : 'No';
    const vaccinations = student.has_received_vaccinations ? 'Complete' : 'Incomplete';
    
    // Financial info
    const balanceDue = student.balance_due || 0;
    const totalFee = student.total_fee_amount || 0;
    const amountPaid = student.amount_paid || 0;
    
    // Document status
    const documentStatus = {
      birth_certificate: student.birth_certificate_uploaded || student.birth_certificate_url,
      student_image: student.student_image_uploaded || student.student_image_url,
      immunization_record: student.immunization_record_uploaded || student.immunization_record_url,
      previous_school_report: student.previous_school_report_uploaded || student.previous_school_report_url,
      parent_id_copy: student.parent_id_copy_uploaded || student.parent_id_copy_url
    };

    // =====================
    // PRINT FUNCTION ADDED HERE
    // =====================
    const handlePrintStudent = () => {
      if (!student) return;
      
      // Create a new window for printing
      const printWindow = window.open('', '_blank');
      
      // Generate printable HTML
      const printContent = generateStudentPrintableHTML(student);
      
      printWindow.document.write(printContent);
      printWindow.document.close();
      
      // Wait for content to load, then print
      printWindow.onload = () => {
        printWindow.print();
      };
    };

    // Generate printable HTML for student details
    const generateStudentPrintableHTML = (student) => {
      // Extract all data safely
      const user = student.user || {};
      const firstName = user.first_name || student.first_name || '';
      const lastName = user.last_name || student.last_name || '';
      const fullName = `${firstName} ${lastName}`.trim() || student.full_name || 'Unknown Student';
      const email = user.email || student.email || 'Not provided';
      const phone = user.phone_number || student.phone_number || 'Not provided';
      const gender = user.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : 'Not specified';
      const dateOfBirth = user.date_of_birth || student.date_of_birth || 'Not provided';
      const address = user.address || student.address || 'No address provided';
      const registrationNumber = user.registration_number || student.registration_number || 'Not available';
      
      // Calculate age
      const calculateAge = (dob) => {
        if (!dob) return 'Not specified';
        const birthDate = new Date(dob);
        const ageDifMs = Date.now() - birthDate.getTime();
        const ageDate = new Date(ageDifMs);
        return Math.abs(ageDate.getUTCFullYear() - 1970);
      };
      const age = dateOfBirth !== 'Not provided' ? calculateAge(dateOfBirth) : 'Not specified';
      
      // Student academic info
      const classLevelName = student.class_level_info?.name || 
                            student.class_level?.name || 
                            student.class_name || 
                            'Not assigned';
      const stream = student.stream === 'science' ? 'Science' :
                    student.stream === 'commercial' ? 'Commercial' :
                    student.stream === 'art' ? 'Arts/Humanities' :
                    student.stream === 'technical' ? 'Technical' :
                    student.stream === 'general' ? 'General' : 'Not Applicable';
      
      const house = student.house || 'None';
      const studentCategory = student.student_category === 'day' ? 'Day' :
                            student.student_category === 'boarding' ? 'Boarding' :
                            student.student_category === 'special_needs' ? 'Special Needs' :
                            student.student_category === 'scholarship' ? 'Scholarship' :
                            student.student_category === 'repeat' ? 'Repeating' : 'New Student';
      
      const admissionNumber = student.admission_number || 'N/A';
      const studentId = student.student_id || 'N/A';
      const admissionDate = student.admission_date || 'Not recorded';
      
      // Financial info
      const totalFee = student.total_fee_amount || 0;
      const amountPaid = student.amount_paid || 0;
      const balanceDue = totalFee - amountPaid;
      
      // Fee status
      const feeStatus = student.fee_status || 'not_paid';
      const feeStatusText = {
        'paid_full': 'Paid in Full',
        'paid_partial': 'Partially Paid',
        'not_paid': 'Not Paid',
        'scholarship': 'On Scholarship',
        'exempted': 'Fee Exempted'
      }[feeStatus] || 'Not Paid';
      
      // Health info
      const bloodGroup = student.blood_group || 'Not specified';
      const genotype = student.genotype || 'Not specified';
      const allergies = student.has_allergies ? 'Yes' : 'No';
      const allergyDetails = student.allergy_details || '';
      const vaccinations = student.has_received_vaccinations ? 'Complete' : 'Incomplete';
      const medicalConditions = student.medical_conditions || 'None reported';
      
      // Emergency contact
      const emergencyName = student.emergency_contact_name || 'Not provided';
      const emergencyPhone = student.emergency_contact_phone || 'Not provided';
      const emergencyRelation = student.emergency_contact_relationship || 'Not provided';
      
      // Transportation
      const transportMode = student.transportation_mode === 'school_bus' ? 'School Bus' :
                          student.transportation_mode === 'parent_drop' ? 'Parent Drop-off' :
                          student.transportation_mode === 'public_transport' ? 'Public Transport' :
                          student.transportation_mode === 'walk' ? 'Walks to School' : 'Other';
      const busRoute = student.bus_route || 'N/A';
      
      // Status
      const isActive = student.is_active ? 'Active' : 'Inactive';
      const isGraduated = student.is_graduated ? 'Yes' : 'No';
      
      // Image
      const imageUrl = student.student_image_url || student.profile_picture || null;
      
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>${fullName} - Student Record</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: 'Arial', sans-serif;
              line-height: 1.5;
              color: #333;
              background: white;
              padding: 20px;
            }
            
            .student-record {
              max-width: 210mm;
              margin: 0 auto;
              background: white;
            }
            
            .header {
              text-align: center;
              border-bottom: 3px solid #003366;
              padding-bottom: 15px;
              margin-bottom: 20px;
            }
            
            .school-name {
              font-size: 28px;
              font-weight: bold;
              color: #003366;
              margin-bottom: 5px;
            }
            
            .document-title {
              font-size: 18px;
              color: #666;
              margin-bottom: 5px;
            }
            
            .document-subtitle {
              font-size: 14px;
              color: #888;
            }
            
            .student-header {
              background: #f8f9fa;
              padding: 20px;
              border-radius: 10px;
              margin-bottom: 20px;
              display: flex;
              align-items: flex-start;
              border: 1px solid #e0e0e0;
            }
            
            .student-photo {
              width: 100px;
              height: 100px;
              border-radius: 10px;
              object-fit: cover;
              margin-right: 20px;
              border: 3px solid white;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            
            .student-photo-placeholder {
              width: 100px;
              height: 100px;
              border-radius: 10px;
              background: #e3f2fd;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-right: 20px;
              border: 3px solid white;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
              font-size: 48px;
              font-weight: bold;
              color: #1976d2;
            }
            
            .student-info {
              flex: 1;
            }
            
            .student-name {
              font-size: 24px;
              font-weight: bold;
              color: #003366;
              margin-bottom: 10px;
            }
            
            .badge-container {
              display: flex;
              flex-wrap: wrap;
              gap: 10px;
              margin-bottom: 10px;
            }
            
            .badge {
              display: inline-block;
              padding: 4px 12px;
              border-radius: 20px;
              font-size: 12px;
              font-weight: 600;
            }
            
            .badge.active {
              background: #e8f5e9;
              color: #2e7d32;
            }
            
            .badge.inactive {
              background: #ffebee;
              color: #c62828;
            }
            
            .badge.graduated {
              background: #f3e5f5;
              color: #7b1fa2;
            }
            
            .badge.fee-paid {
              background: #e8f5e9;
              color: #2e7d32;
            }
            
            .badge.fee-partial {
              background: #fff3e0;
              color: #e65100;
            }
            
            .badge.fee-unpaid {
              background: #ffebee;
              color: #c62828;
            }
            
            .info-grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 10px;
              margin-top: 10px;
            }
            
            .info-item {
              font-size: 13px;
            }
            
            .info-label {
              color: #666;
              font-weight: 500;
            }
            
            .info-value {
              color: #333;
              font-weight: 600;
            }
            
            .section {
              margin-bottom: 25px;
              page-break-inside: avoid;
            }
            
            .section-title {
              font-size: 18px;
              font-weight: bold;
              color: #003366;
              margin-bottom: 15px;
              padding-bottom: 8px;
              border-bottom: 2px solid #e0e0e0;
            }
            
            .two-column {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
              margin-bottom: 20px;
            }
            
            .info-box {
              padding: 15px;
              border: 1px solid #e0e0e0;
              border-radius: 8px;
              background: #fff;
            }
            
            .info-box-title {
              font-weight: 600;
              font-size: 16px;
              margin-bottom: 15px;
              color: #003366;
              padding-bottom: 8px;
              border-bottom: 1px solid #e0e0e0;
            }
            
            .info-row {
              display: flex;
              justify-content: space-between;
              padding: 8px 0;
              border-bottom: 1px solid #f5f5f5;
            }
            
            .info-row:last-child {
              border-bottom: none;
            }
            
            .info-row .label {
              color: #666;
              font-weight: 500;
            }
            
            .info-row .value {
              color: #333;
              font-weight: 600;
            }
            
            .financial-summary {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 15px;
              margin-top: 15px;
            }
            
            .financial-card {
              text-align: center;
              padding: 15px;
              border-radius: 8px;
            }
            
            .financial-card.blue {
              background: #e3f2fd;
            }
            
            .financial-card.green {
              background: #e8f5e9;
            }
            
            .financial-card.red {
              background: #ffebee;
            }
            
            .financial-label {
              font-size: 12px;
              color: #666;
              margin-bottom: 5px;
            }
            
            .financial-amount {
              font-size: 20px;
              font-weight: bold;
            }
            
            .financial-amount.blue {
              color: #1976d2;
            }
            
            .financial-amount.green {
              color: #388e3c;
            }
            
            .financial-amount.red {
              color: #c62828;
            }
            
            .health-tag {
              display: inline-block;
              padding: 4px 8px;
              border-radius: 4px;
              font-size: 11px;
              font-weight: 600;
              margin-left: 8px;
            }
            
            .health-tag.allergy {
              background: #ffebee;
              color: #c62828;
            }
            
            .health-tag.vaccinated {
              background: #e8f5e9;
              color: #2e7d32;
            }
            
            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 2px solid #e0e0e0;
              text-align: center;
              font-size: 11px;
              color: #888;
            }
            
            .print-date {
              margin-top: 5px;
              font-size: 10px;
            }
            
            hr {
              border: none;
              border-top: 1px dashed #ccc;
              margin: 15px 0;
            }
            
            @media print {
              body {
                padding: 0;
              }
              
              .no-print {
                display: none;
              }
              
              .student-record {
                max-width: 100%;
              }
              
              .section {
                page-break-inside: avoid;
              }
            }
          </style>
        </head>
        <body>
          <div class="student-record">
            <!-- Header -->
            <div class="header">
              <div class="school-name">CONCORD TUTOR SCHOOL</div>
              <div class="document-title">Complete Student Record</div>
              <div class="document-subtitle">Official Student Information & Academic Profile</div>
            </div>
            
            <!-- Student Header with Photo -->
            <div class="student-header">
              ${imageUrl ? 
                `<img src="${imageUrl}" alt="${fullName}" class="student-photo" onerror="this.style.display='none';">` :
                `<div class="student-photo-placeholder">${fullName.charAt(0).toUpperCase()}</div>`
              }
              <div class="student-info">
                <div class="student-name">${fullName}</div>
                <div class="badge-container">
                  <span class="badge ${student.is_active ? 'active' : 'inactive'}">
                    ${isActive}
                  </span>
                  ${student.is_graduated ? 
                    `<span class="badge graduated">Graduated</span>` : 
                    ''
                  }
                  <span class="badge fee-${feeStatus}">
                    ${feeStatusText}
                  </span>
                </div>
                <div class="info-grid">
                  <div class="info-item">
                    <span class="info-label">Reg No:</span>
                    <span class="info-value">${registrationNumber}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Admission No:</span>
                    <span class="info-value">${admissionNumber}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Student ID:</span>
                    <span class="info-value">${studentId}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Personal Information -->
            <div class="section">
              <div class="section-title">Personal Information</div>
              <div class="two-column">
                <div class="info-box">
                  <div class="info-row">
                    <span class="label">First Name:</span>
                    <span class="value">${firstName || 'N/A'}</span>
                  </div>
                  <div class="info-row">
                    <span class="label">Last Name:</span>
                    <span class="value">${lastName || 'N/A'}</span>
                  </div>
                  <div class="info-row">
                    <span class="label">Gender:</span>
                    <span class="value">${gender}</span>
                  </div>
                  <div class="info-row">
                    <span class="label">Date of Birth:</span>
                    <span class="value">${dateOfBirth} (Age: ${age})</span>
                  </div>
                </div>
                <div class="info-box">
                  <div class="info-row">
                    <span class="label">Email:</span>
                    <span class="value">${email}</span>
                  </div>
                  <div class="info-row">
                    <span class="label">Phone:</span>
                    <span class="value">${phone}</span>
                  </div>
                  <div class="info-row">
                    <span class="label">Nationality:</span>
                    <span class="value">${user.nationality || student.nationality || 'Nigerian'}</span>
                  </div>
                  <div class="info-row">
                    <span class="label">State of Origin:</span>
                    <span class="value">${user.state_of_origin || student.state_of_origin || 'Not specified'}</span>
                  </div>
                </div>
              </div>
              <div class="info-box" style="margin-top: 10px;">
                <div class="info-row">
                  <span class="label">Address:</span>
                  <span class="value">${address}</span>
                </div>
                <div class="info-row">
                  <span class="label">City/LGA:</span>
                  <span class="value">${user.city || student.city || ''} / ${user.lga || student.lga || ''}</span>
                </div>
              </div>
            </div>
            
            <!-- Academic Information -->
            <div class="section">
              <div class="section-title">Academic Information</div>
              <div class="two-column">
                <div class="info-box">
                  <div class="info-box-title">Current Placement</div>
                  <div class="info-row">
                    <span class="label">Class Level:</span>
                    <span class="value">${classLevelName}</span>
                  </div>
                  <div class="info-row">
                    <span class="label">Stream:</span>
                    <span class="value">${stream}</span>
                  </div>
                  <div class="info-row">
                    <span class="label">House:</span>
                    <span class="value">${house}</span>
                  </div>
                  <div class="info-row">
                    <span class="label">Category:</span>
                    <span class="value">${studentCategory}</span>
                  </div>
                </div>
                <div class="info-box">
                  <div class="info-box-title">Admission Details</div>
                  <div class="info-row">
                    <span class="label">Admission Date:</span>
                    <span class="value">${admissionDate}</span>
                  </div>
                  <div class="info-row">
                    <span class="label">Previous School:</span>
                    <span class="value">${student.previous_school || 'N/A'}</span>
                  </div>
                  <div class="info-row">
                    <span class="label">Previous Class:</span>
                    <span class="value">${student.previous_class || 'N/A'}</span>
                  </div>
                  <div class="info-row">
                    <span class="label">Transfer Cert No:</span>
                    <span class="value">${student.transfer_certificate_no || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Financial Information -->
            <div class="section">
              <div class="section-title">Financial Information</div>
              <div class="financial-summary">
                <div class="financial-card blue">
                  <div class="financial-label">Total Fee</div>
                  <div class="financial-amount blue">₦${totalFee.toLocaleString()}</div>
                </div>
                <div class="financial-card green">
                  <div class="financial-label">Amount Paid</div>
                  <div class="financial-amount green">₦${amountPaid.toLocaleString()}</div>
                </div>
                <div class="financial-card red">
                  <div class="financial-label">Balance Due</div>
                  <div class="financial-amount red">₦${balanceDue.toLocaleString()}</div>
                </div>
              </div>
              <div class="info-box" style="margin-top: 15px;">
                <div class="info-row">
                  <span class="label">Fee Status:</span>
                  <span class="value"><strong>${feeStatusText}</strong></span>
                </div>
              </div>
            </div>
            
            <!-- Health Information -->
            <div class="section">
              <div class="section-title">Health Information</div>
              <div class="two-column">
                <div class="info-box">
                  <div class="info-box-title">Medical Details</div>
                  <div class="info-row">
                    <span class="label">Blood Group:</span>
                    <span class="value">${bloodGroup}</span>
                  </div>
                  <div class="info-row">
                    <span class="label">Genotype:</span>
                    <span class="value">${genotype}</span>
                  </div>
                  <div class="info-row">
                    <span class="label">Allergies:</span>
                    <span class="value">
                      ${allergies}
                      ${allergies === 'Yes' && allergyDetails ? 
                        `<span class="health-tag allergy">${allergyDetails}</span>` : 
                        ''}
                    </span>
                  </div>
                  <div class="info-row">
                    <span class="label">Vaccinations:</span>
                    <span class="value">
                      ${vaccinations}
                      ${vaccinations === 'Complete' ? 
                        '<span class="health-tag vaccinated">✓</span>' : 
                        ''}
                    </span>
                  </div>
                </div>
                <div class="info-box">
                  <div class="info-box-title">Medical Contacts</div>
                  <div class="info-row">
                    <span class="label">Family Doctor:</span>
                    <span class="value">${student.family_doctor_name || 'Not specified'}</span>
                  </div>
                  <div class="info-row">
                    <span class="label">Doctor's Phone:</span>
                    <span class="value">${student.family_doctor_phone || 'Not specified'}</span>
                  </div>
                  <div class="info-row">
                    <span class="label">Medical Conditions:</span>
                    <span class="value">${medicalConditions}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Emergency Contact -->
            <div class="section">
              <div class="section-title">Emergency Contact</div>
              <div class="info-box">
                <div class="info-row">
                  <span class="label">Contact Name:</span>
                  <span class="value">${emergencyName}</span>
                </div>
                <div class="info-row">
                  <span class="label">Relationship:</span>
                  <span class="value">${emergencyRelation}</span>
                </div>
                <div class="info-row">
                  <span class="label">Phone Number:</span>
                  <span class="value">${emergencyPhone}</span>
                </div>
              </div>
            </div>
            
            <!-- Transportation -->
            <div class="section">
              <div class="section-title">Transportation</div>
              <div class="info-box">
                <div class="info-row">
                  <span class="label">Mode of Transport:</span>
                  <span class="value">${transportMode}</span>
                </div>
                <div class="info-row">
                  <span class="label">Bus Route:</span>
                  <span class="value">${busRoute}</span>
                </div>
              </div>
            </div>
            
            <!-- Additional Information -->
            ${student.learning_difficulties_details || student.has_learning_difficulties ? `
              <div class="section">
                <div class="section-title">Learning Support</div>
                <div class="info-box">
                  <div class="info-row">
                    <span class="label">Learning Difficulties:</span>
                    <span class="value">${student.has_learning_difficulties ? 'Yes' : 'No'}</span>
                  </div>
                  ${student.learning_difficulties_details ? `
                    <div class="info-row">
                      <span class="label">Details:</span>
                      <span class="value">${student.learning_difficulties_details}</span>
                    </div>
                  ` : ''}
                </div>
              </div>
            ` : ''}
            
            ${student.is_prefect ? `
              <div class="section">
                <div class="section-title">Leadership</div>
                <div class="info-box">
                  <div class="info-row">
                    <span class="label">Prefect Role:</span>
                    <span class="value">${student.prefect_role || 'Prefect'}</span>
                  </div>
                </div>
              </div>
            ` : ''}
            
            <!-- Footer -->
            <div class="footer">
              <p>This is an official student record from CONCORD TUTOR SCHOOL</p>
              <p>For verification, please contact the school administration</p>
              <div class="print-date">
                Generated on ${new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          </div>
        </body>
        </html>
      `;
    };

    return (
      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="Student Details"
        size="lg"
      >
        {detailLoading ? (
          <div className="py-20 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary-500"></div>
          </div>
        ) : (
          <div className="py-4 max-h-[80vh] overflow-y-auto">
            {/* Student Profile Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6 pb-6 border-b">
              {/* Student Photo */}
              <div className="w-20 h-20 bg-secondary-100 rounded-lg flex items-center justify-center overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
                {student.student_image_url ? (
                  <img 
                    src={student.student_image_url} 
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
              
              {/* Student Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold text-gray-900 truncate">
                  {fullName}
                </h3>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                    {student.admission_number || 'No Admission No'}
                  </span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded">
                    {student.student_id || 'No Student ID'}
                  </span>
                  {renderStatusBadge(student)}
                  {renderFeeBadge(student)}
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <div className="flex items-center">
                    <BookOpen size={14} className="text-gray-500 mr-1" />
                    <span className="text-sm font-medium text-gray-700">{classLevelName}</span>
                  </div>
                  <span className="text-gray-400">•</span>
                  <span className={`text-sm px-2 py-1 rounded ${student.stream === 'science' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 
                                  student.stream === 'commercial' ? 'bg-purple-50 text-purple-700 border border-purple-200' : 
                                  student.stream === 'art' ? 'bg-pink-50 text-pink-700 border border-pink-200' : 
                                  student.stream === 'technical' ? 'bg-orange-50 text-orange-700 border border-orange-200' : 'bg-gray-50 text-gray-600 border border-gray-200'}`}>
                    {stream}
                  </span>
                </div>
              </div>
            </div>

            {/* Information Sections */}
            <div className="space-y-6">
              {/* Personal Information */}
              <Section title="Personal Information" icon={<User size={16} />}>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoRow label="First Name" value={firstName} />
                    <InfoRow label="Last Name" value={lastName} />
                    <InfoRow label="Registration No" value={registrationNumber} />
                    <InfoRow label="Email" value={email} />
                    <InfoRow label="Phone" value={phone} />
                    <InfoRow label="Gender" value={gender} />
                    <InfoRow label="Date of Birth" value={dateOfBirth} />
                    <InfoRow label="Age" value={age} />
                  </div>
                  <InfoRow label="Address" value={address} fullWidth />
                </div>
              </Section>

              {/* Academic Information */}
              <Section title="Academic Information" icon={<BookOpen size={16} />}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoRow label="Class Level" value={classLevelName} />
                  <InfoRow label="Stream" value={stream} />
                  <InfoRow label="House" value={house} />
                  <InfoRow label="Category" value={studentCategory} />
                  <InfoRow label="Admission Date" value={student.admission_date || '—'} />
                  <InfoRow label="Transportation" value={transportation} />
                </div>
              </Section>

              {/* Financial Information */}
              <Section title="Financial Information" icon={<DollarSign size={16} />}>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="text-xs text-blue-700 font-medium mb-1">Fee Balance</div>
                    <div className="text-lg font-bold text-blue-800">₦{balanceDue.toLocaleString()}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="text-xs text-gray-700 font-medium mb-1">Total Fee</div>
                    <div className="text-base font-semibold text-gray-800">₦{totalFee.toLocaleString()}</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="text-xs text-green-700 font-medium mb-1">Amount Paid</div>
                    <div className="text-base font-semibold text-green-700">₦{amountPaid.toLocaleString()}</div>
                  </div>
                </div>
              </Section>

              {/* Health Information */}
              <Section title="Health Information" icon={<Heart size={16} />}>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                    <div className="text-xs text-red-700 mb-1">Blood Group</div>
                    <div className="text-sm font-medium text-gray-900">{bloodGroup}</div>
                  </div>
                  <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                    <div className="text-xs text-red-700 mb-1">Genotype</div>
                    <div className="text-sm font-medium text-gray-900">{genotype}</div>
                  </div>
                  <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                    <div className="text-xs text-red-700 mb-1">Allergies</div>
                    <div className="text-sm font-medium text-gray-900">{allergies}</div>
                  </div>
                  <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                    <div className="text-xs text-red-700 mb-1">Vaccinations</div>
                    <div className="text-sm font-medium text-gray-900">{vaccinations}</div>
                  </div>
                </div>
              </Section>

              {/* Document Status */}
              <Section title="Document Status" icon={<FileText size={16} />}>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {[
                    { label: 'Birth Certificate', status: documentStatus.birth_certificate },
                    { label: 'Student Photo', status: documentStatus.student_image },
                    { label: 'Immunization', status: documentStatus.immunization_record },
                    { label: 'School Report', status: documentStatus.previous_school_report },
                    { label: 'Parent ID', status: documentStatus.parent_id_copy }
                  ].map((doc, idx) => (
                    <div key={idx} className={`p-3 rounded-lg border ${doc.status ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium text-gray-900 truncate">{doc.label}</div>
                          <div className={`text-xs ${doc.status ? 'text-green-600' : 'text-red-600'}`}>
                            {doc.status ? 'Uploaded' : 'Pending'}
                          </div>
                        </div>
                        <div className={`w-2 h-2 rounded-full ml-2 flex-shrink-0 ${doc.status ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            </div>

            {/* Action Buttons - MODIFIED TO ADD PRINT BUTTON */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex flex-wrap justify-end gap-3">
                {/* PRINT BUTTON ADDED HERE */}
                <Button
                  onClick={handlePrintStudent}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 text-sm font-medium rounded-md flex items-center transition-colors"
                >
                  <Printer size={14} className="mr-2" />
                  Print Record
                </Button>
                
                <Button
                  onClick={() => {
                    setShowViewModal(false);
                    handleEditClick(student);
                  }}
                  className="bg-secondary-600 hover:bg-secondary-700 text-white px-4 py-2 text-sm font-medium rounded-md flex items-center transition-colors"
                >
                  <Edit2 size={14} className="mr-2" />
                  Edit Student
                </Button>
                {isAdmin && (
                  <>
                    <Button
                      onClick={() => {
                        setShowViewModal(false);
                        handlePasswordClick(student);
                      }}
                      className="bg-secondary-600 hover:bg-secondary-700 text-white px-4 py-2 text-sm font-medium rounded-md flex items-center transition-colors"
                    >
                      <Lock size={14} className="mr-2" />
                      Reset Password
                    </Button>
                    <Button
                      onClick={() => {
                        setShowViewModal(false);
                        handleDeleteClick(student);
                      }}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-sm font-medium rounded-md flex items-center transition-colors"
                    >
                      <Trash2 size={14} className="mr-2" />
                      Delete Student
                    </Button>
                  </>
                )}
                <Button
                  onClick={() => setShowViewModal(false)}
                  className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-4 py-2 text-sm font-medium rounded-md transition-colors"
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


// Helper Components
const Section = ({ title, icon, children }) => (
  <div className="bg-white rounded-lg border border-gray-200">
    <div className="px-4 py-3 border-b border-gray-200">
      <h4 className="text-sm font-semibold text-gray-900 flex items-center">
        {icon && <span className="mr-2 text-gray-600">{icon}</span>}
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
    <div className="text-xs text-gray-500 mb-1">{label}</div>
    <div className="text-sm font-medium text-gray-900 bg-gray-50 px-3 py-2 rounded border border-gray-200 break-words">
      {value}
    </div>
  </div>
);

// Helper component for consistent field display
  const InfoField = ({ label, value }) => (
    <div>
      <div className="text-xs font-medium text-neutral-500 mb-1.5 tracking-wide uppercase">{label}</div>
      <div className="text-sm font-medium text-neutral-800 bg-neutral-50 px-3 py-2 rounded border border-neutral-200">
        {value}
      </div>
    </div>
  );

  // =====================
  // RENDER FILTERS DROPDOWN
  // =====================
  const renderFiltersDropdown = () => (
    <div className={`absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-strong border border-neutral-200 z-10 ${showFilters ? 'block' : 'hidden'}`}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-neutral-800">Filter Students</h3>
          <button
            onClick={clearFilters}
            className="text-sm text-secondary-600 hover:text-secondary-700"
          >
            Clear all
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Class Level</label>
            <select
              value={filters.class_level}
              onChange={(e) => handleFilterChange('class_level', e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
            >
              <option value="">All Classes</option>
              {classLevels.map((level) => (
                <option key={level.id} value={level.id}>
                  {level.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Stream</label>
            <select
              value={filters.stream}
              onChange={(e) => handleFilterChange('stream', e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
            >
              <option value="">All Streams</option>
              <option value="science">Science</option>
              <option value="commercial">Commercial</option>
              <option value="art">Arts/Humanities</option>
              <option value="general">General</option>
              <option value="technical">Technical</option>
              <option value="none">No Stream</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Fee Status</label>
            <select
              value={filters.fee_status}
              onChange={(e) => handleFilterChange('fee_status', e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
            >
              <option value="">All Status</option>
              <option value="paid_full">Paid in Full</option>
              <option value="paid_partial">Partially Paid</option>
              <option value="not_paid">Not Paid</option>
              <option value="scholarship">On Scholarship</option>
              <option value="exempted">Fee Exempted</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Status</label>
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
            <label className="block text-sm font-medium text-neutral-700 mb-2">Graduation Status</label>
            <select
              value={filters.is_graduated}
              onChange={(e) => handleFilterChange('is_graduated', e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
            >
              <option value="">All</option>
              <option value="true">Graduated</option>
              <option value="false">Not Graduated</option>
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

  // =====================
  // RENDER LOADING STATE
  // =====================
  const renderLoadingState = () => (
    <div className="py-12 text-center">
      <div className="inline-flex items-center justify-center mb-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary-500"></div>
      </div>
      <p className="text-neutral-600">Loading students...</p>
    </div>
  );

  // =====================
  // RENDER EMPTY STATE
  // =====================
  const renderEmptyState = () => (
    <div className="py-16 text-center border-2 border-dashed border-neutral-200 rounded-xl">
      <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <User size={24} className="text-neutral-400" />
      </div>
      <h3 className="text-lg font-medium text-neutral-700 mb-2">No students found</h3>
      <p className="text-neutral-500 mb-6">
        {searchTerm || Object.values(filters).some(f => f) 
          ? 'Try adjusting your search or filters' 
          : 'No students have been added yet'}
      </p>
      {isAdmin && (
        <button
          onClick={() => navigate('/students/create')}
          className="inline-flex items-center px-4 py-2 bg-secondary-500 text-white rounded-lg hover:bg-secondary-600 transition-colors"
        >
          <UserPlus size={18} className="mr-2" />
          Add First Student
        </button>
      )}
    </div>
  );



    const renderStudentRow = (student) => {
    // Direct extraction from student object
    const firstName = student.first_name || student.user?.first_name || '—';
    const lastName = student.last_name || student.user?.last_name || '—';
    const fullName = `${firstName} ${lastName}`.trim() || student.full_name || '—';
    const email = student.email || student.user?.email || 'No email';
    
    // Academic info
    const classLevelName = student.class_level_info?.name || 
                          student.class_level_name || 
                          student.class_level?.name || 
                          'Not assigned';
    const admissionNumber = student.admission_number || '—';
    const studentId = student.student_id || '—';
    
    // Image URL - FIXED: Use student_image_url from serializer
    const imageUrl = student.student_image_url || 
                    (student.student_image && typeof student.student_image === 'string' ? student.student_image : null) || 
                    null;
    
    return (
      <tr key={student.id} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
        <td className="py-4 px-4">
          <button
            onClick={() => handleViewStudent(student)}
            className="text-left hover:text-secondary-700 transition-colors w-full"
          >
            <div className="flex items-center">
              <div className="w-10 h-10 bg-secondary-100 rounded-full flex items-center justify-center mr-3 overflow-hidden">
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
              <div>
                <div className="font-medium text-neutral-800">
                  {fullName}
                </div>
                <div className="text-sm text-neutral-500">
                  {email}
                </div>
              </div>
            </div>
          </button>
        </td>
        
        <td className="py-4 px-4">
          <div className="space-y-1">
            <div className="font-medium text-neutral-700">{admissionNumber}</div>
            <div className="text-sm text-neutral-500">{studentId}</div>
          </div>
        </td>
        
        <td className="py-4 px-4">
          <div className="space-y-1">
            <div className="font-medium text-neutral-700">{classLevelName}</div>
            <div className="text-sm text-neutral-500">{renderStreamBadge(student)}</div>
          </div>
        </td>
        
        <td className="py-4 px-4">
          <div className="space-y-2">
            {renderStatusBadge(student)}
            {renderFeeBadge(student)}
          </div>
        </td>
        
        <td className="py-4 px-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleViewStudent(student)}
              className="p-2 bg-secondary-100 text-secondary-600 hover:bg-secondary-200 rounded-lg transition-colors"
              title="View Details"
            >
              <Eye size={18} />
            </button>
            
            {isAdmin && (
              <>
                {/* <button
                  onClick={() => handleEditClick(student)}
                  className="p-2 bg-secondary-100 text-secondary-600 hover:bg-secondary-200 rounded-lg transition-colors"
                  title="Edit Student"
                >
                  <Edit2 size={18} />
                </button> */}
                
                <button
                  onClick={() => handlePasswordClick(student)}
                  className="p-2 bg-secondary-100 text-secondary-600 hover:bg-secondary-200 rounded-lg transition-colors"
                  title="Reset Password"
                >
                  <Lock size={18} />
                </button>
                
                <button
                  onClick={() => handleDeleteClick(student)}
                  className="p-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition-colors"
                  title="Delete Student"
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

  // =====================
  // MAIN RENDER
  // =====================
  if (!canViewStudents) {
    return (
      <DashboardLayout title="Access Denied">
        <div className="bg-white rounded-xl shadow-soft p-8 text-center border border-neutral-100">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="text-red-600" size={24} />
          </div>
          <h1 className="text-2xl font-heading font-bold text-neutral-800 mb-4">Access Denied</h1>
          <p className="text-neutral-600 mb-6">You don't have permission to view students list.</p>
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
            {isAdmin && (
              <button
                onClick={() => navigate('/students/create')}
                className="inline-flex items-center px-4 py-2 bg-secondary-500 text-white rounded-lg hover:bg-secondary-600 transition-colors"
              >
                <UserPlus size={18} className="mr-2" />
                Add New Student
              </button>
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
              placeholder="Search by name, admission number, email, or phone..."
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
              onClick={loadStudents}
              className="px-4 py-3 bg-secondary-500 text-white rounded-xl hover:bg-secondary-600 transition-colors flex items-center justify-center"
              disabled={loading}
              title="Refresh"
            >
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-xl shadow-soft overflow-hidden border border-neutral-100">
        {/* Table Header */}
        <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-neutral-800">Students</h3>
              <p className="text-sm text-neutral-600">
                {loading ? 'Loading...' : `${totalStudents} students found`}
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
          ) : students.length === 0 ? (
            renderEmptyState()
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-neutral-50">
                  <th className="py-3 px-4 text-left text-sm font-medium text-neutral-700">Student</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-neutral-700">Admission Details</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-neutral-700">Academic Info</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-neutral-700">Status</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-neutral-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map(renderStudentRow)}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {!loading && students.length > 0 && renderPagination()}
      </div>

      {/* Modals */}
      {renderViewModal()}
      
      {/* Edit Modal */}
      {showEditModal && (
        <Modal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title="Edit Student"
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

              {/* Additional Fields to Add to Your Edit Modal */}
              {/* Add these sections to your existing edit modal form */}

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
                      {/* Add Nigerian states options */}
                      <option value="abia">Abia</option>
                      <option value="adamawa">Adamawa</option>
                      <option value="akwa_ibom">Akwa Ibom</option>
                      {/* Add all 36 states + FCT */}
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

{/* Document Uploads */}
<div>
  <h4 className="text-lg font-semibold text-secondary-800 mb-4 pb-2 border-b border-secondary-200">
    Document Uploads
  </h4>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <div>
      <label className="block text-sm font-medium text-neutral-700 mb-2">
        Student Photograph
      </label>
      <input
        type="file"
        name="student_image"
        onChange={handleEditChange}
        accept="image/*"
        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
        disabled={editLoading}
      />
      <p className="mt-1 text-xs text-neutral-500">
        {editForm.student_image?.name || 'No file selected'}
      </p>
    </div>
    
    <div>
      <label className="block text-sm font-medium text-neutral-700 mb-2">
        Birth Certificate
      </label>
      <input
        type="file"
        name="birth_certificate"
        onChange={handleEditChange}
        accept=".pdf,.jpg,.jpeg,.png"
        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
        disabled={editLoading}
      />
      <p className="mt-1 text-xs text-neutral-500">
        {editForm.birth_certificate?.name || 'No file selected'}
      </p>
    </div>
    
    <div>
      <label className="block text-sm font-medium text-neutral-700 mb-2">
        Fee Payment Evidence
      </label>
      <input
        type="file"
        name="fee_payment_evidence"
        onChange={handleEditChange}
        accept=".pdf,.jpg,.jpeg,.png"
        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
        disabled={editLoading}
      />
      <p className="mt-1 text-xs text-neutral-500">
        {editForm.fee_payment_evidence?.name || 'No file selected'}
      </p>
    </div>
  </div>
  
  <div className="mt-4">
    <div className="flex items-center justify-between">
      <span className="text-sm text-neutral-600">To remove a file, upload a new one or contact support</span>
      <button
        type="button"
        onClick={() => {
          // Clear file inputs
          setEditForm(prev => ({
            ...prev,
            student_image: 'null',
            birth_certificate: 'null',
            fee_payment_evidence: 'null'
          }));
        }}
        className="text-sm text-red-600 hover:text-red-700"
      >
        Clear All Files
      </button>
    </div>
  </div>
</div>
              
              {/* Academic Information */}
              <div>
                <h4 className="text-lg font-semibold text-secondary-800 mb-4 pb-2 border-b border-secondary-200">
                  Academic Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Class Level <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="class_level"
                      value={editForm.class_level}
                      onChange={handleEditChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 ${
                        editErrors.class_level ? 'border-red-500' : 'border-neutral-300'
                      }`}
                      disabled={editLoading}
                    >
                      <option value="">Select Class Level</option>
                      {classLevels.map((level) => (
                        <option key={level.id} value={level.id}>
                          {level.name}
                        </option>
                      ))}
                    </select>
                    {editErrors.class_level && (
                      <p className="mt-1 text-sm text-red-600">{editErrors.class_level}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Stream
                    </label>
                    <select
                      name="stream"
                      value={editForm.stream}
                      onChange={handleEditChange}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                      disabled={editLoading}
                    >
                      <option value="none">No Stream</option>
                      <option value="science">Science</option>
                      <option value="commercial">Commercial</option>
                      <option value="art">Arts/Humanities</option>
                      <option value="general">General</option>
                      <option value="technical">Technical</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Student Category
                    </label>
                    <select
                      name="student_category"
                      value={editForm.student_category}
                      onChange={handleEditChange}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                      disabled={editLoading}
                    >
                      <option value="day">Day Student</option>
                      <option value="boarding">Boarding Student</option>
                      <option value="special_needs">Special Needs</option>
                      <option value="scholarship">Scholarship</option>
                      <option value="repeat">Repeating Student</option>
                      <option value="new">New Student</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      House
                    </label>
                    <select
                      name="house"
                      value={editForm.house}
                      onChange={handleEditChange}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                      disabled={editLoading}
                    >
                      <option value="none">No House Assigned</option>
                      <option value="red">Red House</option>
                      <option value="blue">Blue House</option>
                      <option value="green">Green House</option>
                      <option value="yellow">Yellow House</option>
                      <option value="purple">Purple House</option>
                      <option value="orange">Orange House</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Admission Number
                    </label>
                    <input
                      type="text"
                      name="admission_number"
                      value={editForm.admission_number}
                      onChange={handleEditChange}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                      disabled={editLoading}
                      readOnly
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Student ID
                    </label>
                    <input
                      type="text"
                      name="student_id"
                      value={editForm.student_id}
                      onChange={handleEditChange}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                      disabled={editLoading}
                      readOnly
                    />
                  </div>
                </div>
              </div>
              
              {/* Fee Information */}
              <div>
                <h4 className="text-lg font-semibold text-secondary-800 mb-4 pb-2 border-b border-secondary-200">
                  Fee Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Fee Status
                    </label>
                    <select
                      name="fee_status"
                      value={editForm.fee_status}
                      onChange={handleEditChange}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                      disabled={editLoading}
                    >
                      <option value="not_paid">Not Paid</option>
                      <option value="paid_full">Paid in Full</option>
                      <option value="paid_partial">Partially Paid</option>
                      <option value="scholarship">On Scholarship</option>
                      <option value="exempted">Fee Exempted</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Total Fee Amount (₦)
                    </label>
                    <input
                      type="number"
                      name="total_fee_amount"
                      value={editForm.total_fee_amount}
                      onChange={handleEditChange}
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                      disabled={editLoading}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Amount Paid (₦)
                    </label>
                    <input
                      type="number"
                      name="amount_paid"
                      value={editForm.amount_paid}
                      onChange={handleEditChange}
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                      disabled={editLoading}
                    />
                  </div>
                </div>
              </div>
              
              {/* Status */}
              <div>
                <h4 className="text-lg font-semibold text-secondary-800 mb-4 pb-2 border-b border-secondary-200">
                  Status
                </h4>
                <div className="flex space-x-6">
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
                      Student is Active
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_graduated"
                      name="is_graduated"
                      checked={editForm.is_graduated}
                      onChange={handleEditChange}
                      className="h-4 w-4 text-secondary-600 rounded focus:ring-secondary-500"
                      disabled={editLoading}
                    />
                    <label htmlFor="is_graduated" className="ml-2 text-sm text-neutral-700">
                      Student has Graduated
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
                {editLoading ? 'Updating...' : 'Update Student'}
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
          title="Delete Student"
          size="md"
        >
          <div className="py-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="text-red-600" size={24} />
            </div>
            
            <h3 className="text-lg font-medium text-center text-neutral-800 mb-2">
              Delete {selectedStudent?.user?.first_name} {selectedStudent?.user?.last_name}?
            </h3>
            
            <p className="text-neutral-600 text-center mb-6">
              Are you sure you want to delete this student? This action cannot be undone. 
              All student data, including academic records and fees, will be permanently removed.
            </p>
            
            <div className="bg-red-50 border border-red-100 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <XCircle className="text-red-500 mt-0.5 mr-3 flex-shrink-0" size={18} />
                <div>
                  <p className="text-sm font-medium text-red-800 mb-1">Warning: This action is permanent</p>
                  <p className="text-sm text-red-600">
                    • Student profile will be deleted<br />
                    • Academic records will be removed<br />
                    • Fee history will be erased<br />
                    • Parent links will be broken
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
                Delete Student
              </Button>
            </div>
          </div>
        </Modal>
      )}
      
      
      {/* Password Reset Modal - WITH DYNAMIC REQUIREMENTS */}
      {showPasswordModal && (
        <Modal
          isOpen={showPasswordModal}
          onClose={() => setShowPasswordModal(false)}
          title="Reset Student Password"
          size="md"
        >
          <form onSubmit={submitPasswordReset} className="py-6">
            <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="text-secondary-600" size={24} />
            </div>
            
            <h3 className="text-lg font-medium text-center text-neutral-800 mb-2">
              Reset Password for {selectedStudent?.user?.first_name} {selectedStudent?.user?.last_name}
            </h3>
            
            <p className="text-sm text-center text-neutral-600 mb-4">
              Only Head of School can reset passwords
            </p>
            
            {/* Show any password requirements from backend */}
            {/* <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
              <p className="text-xs text-yellow-800">
                <strong>Password Requirements:</strong> The backend is showing validation errors. 
                Check the browser console (F12) for exact requirements.
              </p>
            </div> */}
            
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
                  placeholder="Enter new password"
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
            
            {/* Action Buttons */}
            <div className="flex space-x-3 mt-8">
              <Button
                type="button"
                onClick={() => setShowPasswordModal(false)}
                className="flex-1 bg-red hover:bg-gray-50 text-gray-700 border border-gray-300"
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

export default StudentList;



