// src/pages/students/StudentEdit.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import Alert from '../../components/common/Alert';
import { Text, Button, Card } from '../../components/ui';
import { 
  User, Mail, Phone, Calendar, MapPin, BookOpen, Users, Heart, 
  FileText, ChevronLeft, ChevronRight, CheckCircle, AlertCircle,
  Upload, X, Building2, Bus, Home, Shield, Award, Activity, Save,
  RefreshCw
} from 'lucide-react';
import { getStudentById, updateStudent } from '../../services/studentService';
import { getClassLevels } from '../../services/academicService';
import { 
  getNigerianStates, getStreamOptions, getStudentCategoryOptions, 
  getHouseOptions, getBloodGroupOptions, getGenotypeOptions, 
  getTransportationOptions 
} from '../../utils/studentUtils';

const StudentEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [classLevels, setClassLevels] = useState([]);
  
  // Form Data - Complete with all fields
  const [formData, setFormData] = useState({
    // Step 1: Basic Information
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    gender: '',
    date_of_birth: '',
    
    // Step 2: Address Information
    address: '',
    city: '',
    state_of_origin: '',
    lga: '',
    nationality: 'Nigerian',
    
    // Step 3: Academic Information
    class_level: '',
    stream: 'none',
    house: 'none',
    student_category: 'day',
    admission_date: '',
    
    // Step 4: Previous School Information
    previous_school: '',
    previous_class: '',
    transfer_certificate_no: '',
    
    // Step 5: Health Information
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
    
    // Step 6: Emergency Contact & Transportation
    emergency_contact_name: '',
    emergency_contact_phone: '',
    emergency_contact_relationship: '',
    transportation_mode: 'parent_drop',
    bus_route: '',
    
    // Step 7: Documents (Files)
    student_image: null,
    birth_certificate: null,
    immunization_record: null,
    previous_school_report: null,
    parent_id_copy: null,
    fee_payment_evidence: null,
    
    // Leadership
    is_prefect: false,
    prefect_role: '',
    
    // Status
    is_active: true,
    is_graduated: false
  });
  
  const [fileNames, setFileNames] = useState({
    student_image: '',
    birth_certificate: '',
    immunization_record: '',
    previous_school_report: '',
    parent_id_copy: '',
    fee_payment_evidence: ''
  });
  
  const [existingFiles, setExistingFiles] = useState({
    student_image_url: null,
    birth_certificate_url: null,
    immunization_record_url: null,
    previous_school_report_url: null,
    parent_id_copy_url: null,
    fee_payment_evidence_url: null
  });
  
  const totalSteps = 7;
  
  useEffect(() => {
    loadData();
    loadClassLevels();
  }, [id]);
  
  const loadClassLevels = async () => {
    try {
      const response = await getClassLevels();
      const levels = response.results || response || [];
      setClassLevels(levels);
    } catch (err) {
      console.error('Error loading class levels:', err);
    }
  };
  
  const loadData = async () => {
    try {
      setFetching(true);
      const student = await getStudentById(id);
      const user = student.user || {};
      
      console.log('Loading student data:', student);
      
      // Populate form data with existing values
      setFormData({
        // Step 1 - CRITICAL: first_name and last_name are required by backend
        first_name: user.first_name || student.first_name || '',
        last_name: user.last_name || student.last_name || '',
        email: user.email || student.email || '',
        phone_number: user.phone_number || student.phone_number || '',
        gender: user.gender || student.gender || '',
        date_of_birth: user.date_of_birth || student.date_of_birth || '',
        
        // Step 2
        address: user.address || student.address || '',
        city: user.city || student.city || '',
        state_of_origin: user.state_of_origin || student.state_of_origin || '',
        lga: user.lga || student.lga || '',
        nationality: user.nationality || student.nationality || 'Nigerian',
        
        // Step 3
        class_level: student.class_level?.id || student.class_level || '',
        stream: student.stream || 'none',
        house: student.house || 'none',
        student_category: student.student_category || 'day',
        admission_date: student.admission_date || '',
        
        // Step 4
        previous_school: student.previous_school || '',
        previous_class: student.previous_class || '',
        transfer_certificate_no: student.transfer_certificate_no || '',
        
        // Step 5
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
        
        // Step 6
        emergency_contact_name: student.emergency_contact_name || '',
        emergency_contact_phone: student.emergency_contact_phone || '',
        emergency_contact_relationship: student.emergency_contact_relationship || '',
        transportation_mode: student.transportation_mode || 'parent_drop',
        bus_route: student.bus_route || '',
        
        // Leadership
        is_prefect: student.is_prefect || false,
        prefect_role: student.prefect_role || '',
        
        // Status
        is_active: student.is_active !== undefined ? student.is_active : true,
        is_graduated: student.is_graduated || false
      });
      
      // Store existing file URLs
      setExistingFiles({
        student_image_url: student.student_image_url || null,
        birth_certificate_url: student.birth_certificate_url || null,
        immunization_record_url: student.immunization_record_url || null,
        previous_school_report_url: student.previous_school_report_url || null,
        parent_id_copy_url: student.parent_id_copy_url || null,
        fee_payment_evidence_url: student.fee_payment_evidence_url || null
      });
      
    } catch (err) {
      console.error('Error loading student:', err);
      setError('Failed to load student data');
    } finally {
      setFetching(false);
    }
  };
  
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'file') {
      const file = files[0];
      if (file) {
        setFormData(prev => ({ ...prev, [name]: file }));
        setFileNames(prev => ({ ...prev, [name]: file.name }));
      }
    } else if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const validateStep = () => {
    const errors = [];
    
    switch(currentStep) {
      case 1:
        if (!formData.first_name) errors.push('First name is required');
        if (!formData.last_name) errors.push('Last name is required');
        break;
      case 2:
        break;
      case 3:
        if (!formData.class_level) errors.push('Class level is required');
        break;
      case 4:
        break;
      case 5:
        if (formData.has_allergies && !formData.allergy_details) {
          errors.push('Please specify allergy details');
        }
        if (formData.has_learning_difficulties && !formData.learning_difficulties_details) {
          errors.push('Please specify learning difficulties details');
        }
        break;
      case 6:
        if (!formData.emergency_contact_name) errors.push('Emergency contact name is required');
        if (!formData.emergency_contact_phone) errors.push('Emergency contact phone is required');
        if (!formData.emergency_contact_relationship) errors.push('Emergency contact relationship is required');
        break;
      case 7:
        break;
      default:
        break;
    }
    
    if (errors.length > 0) {
      setError(errors.join('. '));
      return false;
    }
    setError('');
    return true;
  };
  
  const handleNext = () => {
    if (validateStep()) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
        window.scrollTo(0, 0);
      }
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep()) return;
    
    try {
      setLoading(true);
      setError('');
      
      // Prepare data for API - MUST include first_name and last_name
      const submitData = new FormData();
      
      // ============================================
      // CRITICAL: User fields - first_name and last_name are REQUIRED
      // ============================================
      submitData.append('first_name', formData.first_name);
      submitData.append('last_name', formData.last_name);
      if (formData.email) submitData.append('email', formData.email);
      if (formData.phone_number) submitData.append('phone_number', formData.phone_number);
      if (formData.gender) submitData.append('gender', formData.gender);
      if (formData.date_of_birth) submitData.append('date_of_birth', formData.date_of_birth);
      
      // Address fields
      if (formData.address) submitData.append('address', formData.address);
      if (formData.city) submitData.append('city', formData.city);
      if (formData.state_of_origin) submitData.append('state_of_origin', formData.state_of_origin);
      if (formData.lga) submitData.append('lga', formData.lga);
      if (formData.nationality) submitData.append('nationality', formData.nationality);
      
      // Academic fields
      if (formData.class_level) submitData.append('class_level', formData.class_level);
      if (formData.stream) submitData.append('stream', formData.stream);
      if (formData.house) submitData.append('house', formData.house);
      if (formData.student_category) submitData.append('student_category', formData.student_category);
      if (formData.admission_date) submitData.append('admission_date', formData.admission_date);
      
      // Previous school fields
      if (formData.previous_school) submitData.append('previous_school', formData.previous_school);
      if (formData.previous_class) submitData.append('previous_class', formData.previous_class);
      if (formData.transfer_certificate_no) submitData.append('transfer_certificate_no', formData.transfer_certificate_no);
      
      // Health fields
      if (formData.blood_group) submitData.append('blood_group', formData.blood_group);
      if (formData.genotype) submitData.append('genotype', formData.genotype);
      submitData.append('has_allergies', formData.has_allergies);
      if (formData.allergy_details) submitData.append('allergy_details', formData.allergy_details);
      submitData.append('has_received_vaccinations', formData.has_received_vaccinations);
      if (formData.family_doctor_name) submitData.append('family_doctor_name', formData.family_doctor_name);
      if (formData.family_doctor_phone) submitData.append('family_doctor_phone', formData.family_doctor_phone);
      if (formData.medical_conditions) submitData.append('medical_conditions', formData.medical_conditions);
      submitData.append('has_learning_difficulties', formData.has_learning_difficulties);
      if (formData.learning_difficulties_details) submitData.append('learning_difficulties_details', formData.learning_difficulties_details);
      
      // Emergency Contact & Transportation
      if (formData.emergency_contact_name) submitData.append('emergency_contact_name', formData.emergency_contact_name);
      if (formData.emergency_contact_phone) submitData.append('emergency_contact_phone', formData.emergency_contact_phone);
      if (formData.emergency_contact_relationship) submitData.append('emergency_contact_relationship', formData.emergency_contact_relationship);
      if (formData.transportation_mode) submitData.append('transportation_mode', formData.transportation_mode);
      if (formData.bus_route) submitData.append('bus_route', formData.bus_route);
      
      // Leadership
      submitData.append('is_prefect', formData.is_prefect);
      if (formData.prefect_role) submitData.append('prefect_role', formData.prefect_role);
      
      // Status
      submitData.append('is_active', formData.is_active);
      submitData.append('is_graduated', formData.is_graduated);
      
      // Files
      if (formData.student_image instanceof File) submitData.append('student_image', formData.student_image);
      if (formData.birth_certificate instanceof File) submitData.append('birth_certificate', formData.birth_certificate);
      if (formData.immunization_record instanceof File) submitData.append('immunization_record', formData.immunization_record);
      if (formData.previous_school_report instanceof File) submitData.append('previous_school_report', formData.previous_school_report);
      if (formData.parent_id_copy instanceof File) submitData.append('parent_id_copy', formData.parent_id_copy);
      if (formData.fee_payment_evidence instanceof File) submitData.append('fee_payment_evidence', formData.fee_payment_evidence);
      
      // Log for debugging
      console.log('📤 Sending update to API...');
      for (let [key, value] of submitData.entries()) {
        if (value instanceof File) {
          console.log(`  ${key}: [File] ${value.name}`);
        } else {
          console.log(`  ${key}: ${value}`);
        }
      }
      
      const response = await updateStudent(id, submitData);
      
      console.log('✅ Student updated:', response);
      
      setSuccess('Student updated successfully!');
      setTimeout(() => {
        navigate(`/students/${id}`);
      }, 2000);
      
    } catch (err) {
      console.error('Error updating student:', err);
      setError(err.message || 'Failed to update student. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Render step content (same as before)
  const renderStepContent = () => {
    switch(currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      case 5: return renderStep5();
      case 6: return renderStep6();
      case 7: return renderStep7();
      default: return null;
    }
  };
  
  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-medium text-gray-500 mb-1">First Name *</label>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
            required
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
            required
          />
        </div>
        <div>
          <label className="block text-[10px] font-medium text-gray-500 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
          />
        </div>
        <div>
          <label className="block text-[10px] font-medium text-gray-500 mb-1">Phone Number</label>
          <input
            type="tel"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
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
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
          />
        </div>
      </div>
    </div>
  );
  
  const renderStep2 = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
          />
        </div>
        <div>
          <label className="block text-[10px] font-medium text-gray-500 mb-1">State of Origin</label>
          <select
            name="state_of_origin"
            value={formData.state_of_origin}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
          >
            <option value="">Select State</option>
            {getNigerianStates().map(state => (
              <option key={state.value} value={state.value}>{state.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-medium text-gray-500 mb-1">Local Government Area</label>
          <input
            type="text"
            name="lga"
            value={formData.lga}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
          />
        </div>
        <div>
          <label className="block text-[10px] font-medium text-gray-500 mb-1">Nationality</label>
          <input
            type="text"
            name="nationality"
            value={formData.nationality}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
          />
        </div>
      </div>
    </div>
  );
  
  const renderStep3 = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-medium text-gray-500 mb-1">Class Level *</label>
          <select
            name="class_level"
            value={formData.class_level}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
            required
          >
            <option value="">Select Class Level</option>
            {classLevels.map(level => (
              <option key={level.id} value={level.id}>{level.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-medium text-gray-500 mb-1">Stream</label>
          <select
            name="stream"
            value={formData.stream}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
          >
            {getStreamOptions().map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-medium text-gray-500 mb-1">House</label>
          <select
            name="house"
            value={formData.house}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
          >
            {getHouseOptions().map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-medium text-gray-500 mb-1">Student Category</label>
          <select
            name="student_category"
            value={formData.student_category}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
          >
            {getStudentCategoryOptions().map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-medium text-gray-500 mb-1">Admission Date</label>
          <input
            type="date"
            name="admission_date"
            value={formData.admission_date}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
          />
        </div>
        <div>
          <label className="block text-[10px] font-medium text-gray-500 mb-1">Prefect Role</label>
          <div className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              name="is_prefect"
              checked={formData.is_prefect}
              onChange={handleChange}
              className="w-3 h-3 rounded"
            />
            <span className="text-xs text-gray-600">Student is a Prefect</span>
          </div>
          {formData.is_prefect && (
            <input
              type="text"
              name="prefect_role"
              value={formData.prefect_role}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
              placeholder="e.g., Head Boy, Sports Prefect"
            />
          )}
        </div>
      </div>
    </div>
  );
  
  const renderStep4 = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-medium text-gray-500 mb-1">Previous School</label>
          <input
            type="text"
            name="previous_school"
            value={formData.previous_school}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
          />
        </div>
        <div>
          <label className="block text-[10px] font-medium text-gray-500 mb-1">Previous Class</label>
          <input
            type="text"
            name="previous_class"
            value={formData.previous_class}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
          />
        </div>
        <div>
          <label className="block text-[10px] font-medium text-gray-500 mb-1">Transfer Certificate No.</label>
          <input
            type="text"
            name="transfer_certificate_no"
            value={formData.transfer_certificate_no}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
          />
        </div>
      </div>
    </div>
  );
  
  const renderStep5 = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-medium text-gray-500 mb-1">Blood Group</label>
          <select
            name="blood_group"
            value={formData.blood_group}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
          >
            <option value="">Select Blood Group</option>
            {getBloodGroupOptions().map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-medium text-gray-500 mb-1">Genotype</label>
          <select
            name="genotype"
            value={formData.genotype}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
          >
            <option value="">Select Genotype</option>
            {getGenotypeOptions().map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              name="has_allergies"
              checked={formData.has_allergies}
              onChange={handleChange}
              className="w-3 h-3 rounded"
            />
            <span className="text-xs text-gray-600">Student has allergies</span>
          </div>
          {formData.has_allergies && (
            <textarea
              name="allergy_details"
              value={formData.allergy_details}
              onChange={handleChange}
              rows={2}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
              placeholder="Please specify allergy details"
            />
          )}
        </div>
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              name="has_learning_difficulties"
              checked={formData.has_learning_difficulties}
              onChange={handleChange}
              className="w-3 h-3 rounded"
            />
            <span className="text-xs text-gray-600">Student has learning difficulties</span>
          </div>
          {formData.has_learning_difficulties && (
            <textarea
              name="learning_difficulties_details"
              value={formData.learning_difficulties_details}
              onChange={handleChange}
              rows={2}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
              placeholder="Please specify learning difficulties"
            />
          )}
        </div>
        <div>
          <label className="block text-[10px] font-medium text-gray-500 mb-1">Family Doctor Name</label>
          <input
            type="text"
            name="family_doctor_name"
            value={formData.family_doctor_name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
          />
        </div>
        <div>
          <label className="block text-[10px] font-medium text-gray-500 mb-1">Family Doctor Phone</label>
          <input
            type="tel"
            name="family_doctor_phone"
            value={formData.family_doctor_phone}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-[10px] font-medium text-gray-500 mb-1">Medical Conditions</label>
          <textarea
            name="medical_conditions"
            value={formData.medical_conditions}
            onChange={handleChange}
            rows={2}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
            placeholder="Any medical conditions to note"
          />
        </div>
      </div>
    </div>
  );
  
  const renderStep6 = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-medium text-gray-500 mb-1">Emergency Contact Name *</label>
          <input
            type="text"
            name="emergency_contact_name"
            value={formData.emergency_contact_name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
            required
          />
        </div>
        <div>
          <label className="block text-[10px] font-medium text-gray-500 mb-1">Emergency Contact Phone *</label>
          <input
            type="tel"
            name="emergency_contact_phone"
            value={formData.emergency_contact_phone}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
            required
          />
        </div>
        <div>
          <label className="block text-[10px] font-medium text-gray-500 mb-1">Emergency Contact Relationship *</label>
          <input
            type="text"
            name="emergency_contact_relationship"
            value={formData.emergency_contact_relationship}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
            required
          />
        </div>
        <div>
          <label className="block text-[10px] font-medium text-gray-500 mb-1">Transportation Mode</label>
          <select
            name="transportation_mode"
            value={formData.transportation_mode}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
          >
            {getTransportationOptions().map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
        {formData.transportation_mode === 'school_bus' && (
          <div>
            <label className="block text-[10px] font-medium text-gray-500 mb-1">Bus Route</label>
            <input
              type="text"
              name="bus_route"
              value={formData.bus_route}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
              placeholder="e.g., Route A, Route B"
            />
          </div>
        )}
      </div>
    </div>
  );
  
  const renderStep7 = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-medium text-gray-500 mb-1">Student Photograph</label>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-[#D94801] transition-colors">
            {existingFiles.student_image_url && (
              <div className="mb-2">
                <img src={existingFiles.student_image_url} alt="Current" className="w-20 h-20 mx-auto rounded-lg object-cover" />
                <p className="text-xs text-gray-500 mt-1">Current image</p>
              </div>
            )}
            <Upload size={24} className="mx-auto text-gray-400 mb-2" />
            <input
              type="file"
              name="student_image"
              onChange={handleChange}
              accept="image/*"
              className="hidden"
              id="student_image"
            />
            <label htmlFor="student_image" className="cursor-pointer text-sm text-[#D94801] hover:underline">
              {existingFiles.student_image_url ? 'Change photo' : 'Click to upload'}
            </label>
            {fileNames.student_image && (
              <Text variant="tiny" className="text-green-600 mt-1">{fileNames.student_image}</Text>
            )}
          </div>
        </div>
        
        <div>
          <label className="block text-[10px] font-medium text-gray-500 mb-1">Birth Certificate</label>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-[#D94801] transition-colors">
            {existingFiles.birth_certificate_url && (
              <div className="mb-2">
                <a href={existingFiles.birth_certificate_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline">
                  View current file
                </a>
              </div>
            )}
            <Upload size={24} className="mx-auto text-gray-400 mb-2" />
            <input
              type="file"
              name="birth_certificate"
              onChange={handleChange}
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
              id="birth_certificate"
            />
            <label htmlFor="birth_certificate" className="cursor-pointer text-sm text-[#D94801] hover:underline">
              {existingFiles.birth_certificate_url ? 'Replace file' : 'Click to upload'}
            </label>
            {fileNames.birth_certificate && (
              <Text variant="tiny" className="text-green-600 mt-1">{fileNames.birth_certificate}</Text>
            )}
          </div>
        </div>
      </div>
    </div>
  );
  
  if (fetching) {
    return (
      <DashboardLayout title="Edit Student">
        <div className="flex justify-center py-12">
          <RefreshCw className="animate-spin h-8 w-8 text-[#D94801]" />
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout title="Edit Student">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-6">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4, 5, 6, 7].map(step => (
              <React.Fragment key={step}>
                <button
                  type="button"
                  onClick={() => setCurrentStep(step)}
                  className={`flex flex-col items-center ${currentStep >= step ? 'text-[#D94801]' : 'text-gray-400'}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all
                    ${currentStep > step ? 'bg-green-500 text-white' : 
                      currentStep === step ? 'bg-[#D94801] text-white ring-4 ring-[#D94801]/20' : 
                      'bg-gray-200 text-gray-500'}`}
                  >
                    {currentStep > step ? <CheckCircle size={16} /> : step}
                  </div>
                  <span className="text-[9px] mt-1 hidden sm:block">
                    {step === 1 && 'Basic'}
                    {step === 2 && 'Address'}
                    {step === 3 && 'Academic'}
                    {step === 4 && 'Previous'}
                    {step === 5 && 'Health'}
                    {step === 6 && 'Emergency'}
                    {step === 7 && 'Docs'}
                  </span>
                </button>
                {step < 7 && (
                  <div className={`flex-1 h-0.5 mx-2 ${currentStep > step ? 'bg-green-500' : 'bg-gray-200'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
        
        {/* Error/Success Alerts */}
        {error && <Alert type="error" message={error} onClose={() => setError('')} className="mb-4" />}
        {success && <Alert type="success" message={success} onClose={() => setSuccess('')} className="mb-4" />}
        
        {/* Form Card */}
        <Card className="p-4 sm:p-6">
          <form onSubmit={handleSubmit}>
            {/* Step Title */}
            <div className="mb-6 pb-3 border-b border-gray-100">
              <Text variant="h3" className="font-semibold">
                Step {currentStep}: {currentStep === 1 && 'Basic Information'}
                {currentStep === 2 && 'Address Information'}
                {currentStep === 3 && 'Academic Information'}
                {currentStep === 4 && 'Previous School Information'}
                {currentStep === 5 && 'Health Information'}
                {currentStep === 6 && 'Emergency Contact & Transportation'}
                {currentStep === 7 && 'Document Uploads'}
              </Text>
            </div>
            
            {/* Step Content */}
            {renderStepContent()}
            
            {/* Status Section */}
            {currentStep === totalSteps && (
              <div className="mt-6 pt-4 border-t border-gray-100">
                <Text variant="small" className="font-semibold text-gray-700 mb-3">Student Status</Text>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={formData.is_active}
                      onChange={handleChange}
                      className="w-3 h-3 rounded"
                    />
                    <span className="text-xs text-gray-600">Student is Active</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="is_graduated"
                      checked={formData.is_graduated}
                      onChange={handleChange}
                      className="w-3 h-3 rounded"
                    />
                    <span className="text-xs text-gray-600">Student has Graduated</span>
                  </label>
                </div>
              </div>
            )}
            
            {/* Navigation Buttons */}
            <div className="flex justify-between gap-3 mt-8 pt-4 border-t border-gray-100">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                icon={ChevronLeft}
              >
                Previous
              </Button>
              
              {currentStep < totalSteps ? (
                <Button
                  type="button"
                  variant="primary"
                  onClick={handleNext}
                  icon={ChevronRight}
                  iconPosition="right"
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="primary"
                  loading={loading}
                  icon={Save}
                >
                  Update Student
                </Button>
              )}
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StudentEdit;