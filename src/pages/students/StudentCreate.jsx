// // src/pages/students/StudentCreate.jsx
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import DashboardLayout from '../../components/dashboard/DashboardLayout';
// import Alert from '../../components/common/Alert';
// import { Text, Button, Card } from '../../components/ui';
// import { 
//   User, Mail, Phone, Calendar, MapPin, BookOpen, Users, Heart, 
//   FileText, ChevronLeft, ChevronRight, CheckCircle, AlertCircle,
//   Upload, X, Building2, Bus, Home, Shield, Award, Activity
// } from 'lucide-react';
// import { createStudentWithUser, updateStudentProfile } from '../../services/studentService';
// import { getClassLevels } from '../../services/academicService';
// import { getNigerianStates, getStreamOptions, getStudentCategoryOptions, getHouseOptions, getBloodGroupOptions, getGenotypeOptions, getTransportationOptions } from '../../utils/studentUtils';
// import api from '../../services/api';

// const StudentCreate = () => {
//   const navigate = useNavigate();
//   const [currentStep, setCurrentStep] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [classLevels, setClassLevels] = useState([]);
  
//   // Form Data - Complete with all fields
//   const [formData, setFormData] = useState({
//     // Step 1: Basic Information
//     first_name: '',
//     last_name: '',
//     email: '',
//     phone_number: '',
//     gender: '',
//     date_of_birth: '',
    
//     // Step 2: Address Information
//     address: '',
//     city: '',
//     state_of_origin: '',
//     lga: '',
//     nationality: 'Nigerian',
    
//     // Step 3: Academic Information
//     class_level: '',
//     stream: 'none',
//     house: 'none',
//     student_category: 'day',
//     admission_date: new Date().toISOString().split('T')[0],
    
//     // Step 4: Previous School Information
//     previous_school: '',
//     previous_class: '',
//     transfer_certificate_no: '',
    
//     // Step 5: Health Information
//     blood_group: '',
//     genotype: '',
//     has_allergies: false,
//     allergy_details: '',
//     has_received_vaccinations: true,
//     family_doctor_name: '',
//     family_doctor_phone: '',
//     medical_conditions: '',
//     has_learning_difficulties: false,
//     learning_difficulties_details: '',
    
//     // Step 6: Emergency Contact & Transportation
//     emergency_contact_name: '',
//     emergency_contact_phone: '',
//     emergency_contact_relationship: '',
//     transportation_mode: 'parent_drop',
//     bus_route: '',
    
//     // Step 7: Documents (Files)
//     student_image: null,
//     birth_certificate: null,
//     immunization_record: null,
//     previous_school_report: null,
//     parent_id_copy: null,
//     fee_payment_evidence: null,
    
//     // Leadership
//     is_prefect: false,
//     prefect_role: '',
    
//     // Password
//     password: 'Student@2024',
//     confirm_password: 'Student@2024'
//   });
  
//   const [fileNames, setFileNames] = useState({
//     student_image: '',
//     birth_certificate: '',
//     immunization_record: '',
//     previous_school_report: '',
//     parent_id_copy: '',
//     fee_payment_evidence: ''
//   });
  
//   const totalSteps = 7;
  
//   useEffect(() => {
//     loadClassLevels();
//   }, []);
  
//   const loadClassLevels = async () => {
//     try {
//       const response = await getClassLevels();
//       const levels = response.results || response || [];
//       setClassLevels(levels);
//     } catch (err) {
//       console.error('Error loading class levels:', err);
//     }
//   };
  
//   const handleChange = (e) => {
//     const { name, value, type, checked, files } = e.target;
    
//     if (type === 'file') {
//       const file = files[0];
//       if (file) {
//         setFormData(prev => ({ ...prev, [name]: file }));
//         setFileNames(prev => ({ ...prev, [name]: file.name }));
//       }
//     } else if (type === 'checkbox') {
//       setFormData(prev => ({ ...prev, [name]: checked }));
//     } else {
//       setFormData(prev => ({ ...prev, [name]: value }));
//     }
//   };
  
//   const validateStep = () => {
//     const errors = [];
    
//     switch(currentStep) {
//       case 1: // Basic Information
//         if (!formData.first_name) errors.push('First name is required');
//         if (!formData.last_name) errors.push('Last name is required');
//         if (!formData.gender) errors.push('Gender is required');
//         if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
//           errors.push('Invalid email format');
//         }
//         if (formData.password !== formData.confirm_password) {
//           errors.push('Passwords do not match');
//         }
//         if (formData.password && formData.password.length < 5) {
//           errors.push('Password must be at least 5 characters');
//         }
//         break;
        
//       case 2: // Address Information
//         // Address fields are optional
//         break;
        
//       case 3: // Academic Information
//         if (!formData.class_level) errors.push('Class level is required');
//         if (!formData.admission_date) errors.push('Admission date is required');
//         break;
        
//       case 4: // Previous School Information
//         // Optional fields
//         break;
        
//       case 5: // Health Information
//         if (formData.has_allergies && !formData.allergy_details) {
//           errors.push('Please specify allergy details');
//         }
//         if (formData.has_learning_difficulties && !formData.learning_difficulties_details) {
//           errors.push('Please specify learning difficulties details');
//         }
//         break;
        
//       case 6: // Emergency Contact & Transportation
//         if (!formData.emergency_contact_name) errors.push('Emergency contact name is required');
//         if (!formData.emergency_contact_phone) errors.push('Emergency contact phone is required');
//         if (!formData.emergency_contact_relationship) errors.push('Emergency contact relationship is required');
//         break;
        
//       case 7: // Documents
//         // Optional
//         break;
        
//       default:
//         break;
//     }
    
//     if (errors.length > 0) {
//       setError(errors.join('. '));
//       return false;
//     }
//     setError('');
//     return true;
//   };
  
//   const handleNext = () => {
//     if (validateStep()) {
//       if (currentStep < totalSteps) {
//         setCurrentStep(currentStep + 1);
//         window.scrollTo(0, 0);
//       }
//     }
//   };
  
//   const handlePrevious = () => {
//     if (currentStep > 1) {
//       setCurrentStep(currentStep - 1);
//       window.scrollTo(0, 0);
//     }
//   };
  
//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateStep()) return;
    
//     try {
//       setLoading(true);
//       setError('');
      
//       // ============================================
//       // STEP 1: Create the user account
//       // ============================================
//       console.log('📝 STEP 1: Creating user account...');
      
//       const userData = {
//         first_name: formData.first_name,
//         last_name: formData.last_name,
//         password: formData.password,
//         confirm_password: formData.confirm_password,
//       };
      
//       // Add optional user fields
//       if (formData.email) userData.email = formData.email;
//       if (formData.phone_number) userData.phone_number = formData.phone_number;
//       if (formData.gender) userData.gender = formData.gender;
//       if (formData.date_of_birth) userData.date_of_birth = formData.date_of_birth;
//       if (formData.address) userData.address = formData.address;
//       if (formData.city) userData.city = formData.city;
//       if (formData.state_of_origin) userData.state_of_origin = formData.state_of_origin;
//       if (formData.lga) userData.lga = formData.lga;
//       if (formData.nationality) userData.nationality = formData.nationality;
      
//       const userResponse = await createStudentUser(userData);
//       console.log('✅ User created:', userResponse);
      
//       // Get the user ID from response
//       const userId = userResponse.user?.id || userResponse.id;
      
//       if (!userId) {
//         throw new Error('User created but no user ID returned');
//       }
      
//       // ============================================
//       // STEP 2: Update student profile with additional data
//       // ============================================
//       console.log('📝 STEP 2: Updating student profile...');
      
//       const studentData = {
//         // Academic fields
//         class_level: formData.class_level,
//         stream: formData.stream,
//         house: formData.house,
//         student_category: formData.student_category,
//         admission_date: formData.admission_date,
        
//         // Previous school fields
//         previous_school: formData.previous_school,
//         previous_class: formData.previous_class,
//         transfer_certificate_no: formData.transfer_certificate_no,
        
//         // Health fields
//         blood_group: formData.blood_group,
//         genotype: formData.genotype,
//         has_allergies: formData.has_allergies,
//         allergy_details: formData.allergy_details,
//         has_received_vaccinations: formData.has_received_vaccinations,
//         family_doctor_name: formData.family_doctor_name,
//         family_doctor_phone: formData.family_doctor_phone,
//         medical_conditions: formData.medical_conditions,
//         has_learning_difficulties: formData.has_learning_difficulties,
//         learning_difficulties_details: formData.learning_difficulties_details,
        
//         // Emergency contact
//         emergency_contact_name: formData.emergency_contact_name,
//         emergency_contact_phone: formData.emergency_contact_phone,
//         emergency_contact_relationship: formData.emergency_contact_relationship,
        
//         // Transportation
//         transportation_mode: formData.transportation_mode,
//         bus_route: formData.bus_route,
        
//         // Leadership
//         is_prefect: formData.is_prefect,
//         prefect_role: formData.prefect_role,
        
//         // Files
//         student_image: formData.student_image,
//         birth_certificate: formData.birth_certificate,
//         immunization_record: formData.immunization_record,
//         previous_school_report: formData.previous_school_report,
//         parent_id_copy: formData.parent_id_copy,
//         fee_payment_evidence: formData.fee_payment_evidence,
//       };
      
//       // You need to get the student ID. Usually after user creation, 
//       // there's a student profile automatically created.
//       // You might need to fetch the student by user ID or the response should include it
      
//       // If the user creation response includes the student ID
//       const studentId = userResponse.student?.id || userResponse.student_id;
      
//       if (studentId) {
//         // Update the existing student profile
//         await updateStudentProfile(studentId, studentData);
//       } else {
//         // Or use the combined endpoint (depends on your backend)
//         // For now, let's try the combined approach
//         const completeFormData = new FormData();
        
//         // Add user data
//         completeFormData.append('first_name', formData.first_name);
//         completeFormData.append('last_name', formData.last_name);
//         completeFormData.append('password', formData.password);
//         completeFormData.append('confirm_password', formData.confirm_password);
//         if (formData.email) completeFormData.append('email', formData.email);
//         if (formData.phone_number) completeFormData.append('phone_number', formData.phone_number);
//         if (formData.gender) completeFormData.append('gender', formData.gender);
//         if (formData.date_of_birth) completeFormData.append('date_of_birth', formData.date_of_birth);
//         if (formData.address) completeFormData.append('address', formData.address);
//         if (formData.city) completeFormData.append('city', formData.city);
//         if (formData.state_of_origin) completeFormData.append('state_of_origin', formData.state_of_origin);
//         if (formData.lga) completeFormData.append('lga', formData.lga);
//         if (formData.nationality) completeFormData.append('nationality', formData.nationality);
        
//         // Add student fields
//         if (formData.class_level) completeFormData.append('class_level', formData.class_level);
//         if (formData.stream) completeFormData.append('stream', formData.stream);
//         if (formData.house) completeFormData.append('house', formData.house);
//         if (formData.student_category) completeFormData.append('student_category', formData.student_category);
//         if (formData.admission_date) completeFormData.append('admission_date', formData.admission_date);
//         if (formData.previous_school) completeFormData.append('previous_school', formData.previous_school);
//         if (formData.previous_class) completeFormData.append('previous_class', formData.previous_class);
//         if (formData.transfer_certificate_no) completeFormData.append('transfer_certificate_no', formData.transfer_certificate_no);
//         if (formData.blood_group) completeFormData.append('blood_group', formData.blood_group);
//         if (formData.genotype) completeFormData.append('genotype', formData.genotype);
//         if (formData.has_allergies) completeFormData.append('has_allergies', formData.has_allergies);
//         if (formData.allergy_details) completeFormData.append('allergy_details', formData.allergy_details);
//         if (formData.has_received_vaccinations) completeFormData.append('has_received_vaccinations', formData.has_received_vaccinations);
//         if (formData.family_doctor_name) completeFormData.append('family_doctor_name', formData.family_doctor_name);
//         if (formData.family_doctor_phone) completeFormData.append('family_doctor_phone', formData.family_doctor_phone);
//         if (formData.medical_conditions) completeFormData.append('medical_conditions', formData.medical_conditions);
//         if (formData.has_learning_difficulties) completeFormData.append('has_learning_difficulties', formData.has_learning_difficulties);
//         if (formData.learning_difficulties_details) completeFormData.append('learning_difficulties_details', formData.learning_difficulties_details);
//         if (formData.emergency_contact_name) completeFormData.append('emergency_contact_name', formData.emergency_contact_name);
//         if (formData.emergency_contact_phone) completeFormData.append('emergency_contact_phone', formData.emergency_contact_phone);
//         if (formData.emergency_contact_relationship) completeFormData.append('emergency_contact_relationship', formData.emergency_contact_relationship);
//         if (formData.transportation_mode) completeFormData.append('transportation_mode', formData.transportation_mode);
//         if (formData.bus_route) completeFormData.append('bus_route', formData.bus_route);
//         if (formData.is_prefect) completeFormData.append('is_prefect', formData.is_prefect);
//         if (formData.prefect_role) completeFormData.append('prefect_role', formData.prefect_role);
        
//         // Add files
//         if (formData.student_image instanceof File) completeFormData.append('student_image', formData.student_image);
//         if (formData.birth_certificate instanceof File) completeFormData.append('birth_certificate', formData.birth_certificate);
//         if (formData.immunization_record instanceof File) completeFormData.append('immunization_record', formData.immunization_record);
//         if (formData.previous_school_report instanceof File) completeFormData.append('previous_school_report', formData.previous_school_report);
//         if (formData.parent_id_copy instanceof File) completeFormData.append('parent_id_copy', formData.parent_id_copy);
//         if (formData.fee_payment_evidence instanceof File) completeFormData.append('fee_payment_evidence', formData.fee_payment_evidence);
        
//         const response = await api.post('/students/create-with-user/', completeFormData, {
//           headers: { 'Content-Type': 'multipart/form-data' },
//         });
        
//         console.log('✅ Student created via combined endpoint:', response.data);
//       }
      
//       setSuccess('Student created successfully!');
//       setTimeout(() => {
//         navigate('/students');
//       }, 2000);
      
//     } catch (err) {
//       console.error('Error creating student:', err);
//       setError(err.message || 'Failed to create student. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   // Render step content
//   const renderStepContent = () => {
//     switch(currentStep) {
//       case 1:
//         return renderStep1();
//       case 2:
//         return renderStep2();
//       case 3:
//         return renderStep3();
//       case 4:
//         return renderStep4();
//       case 5:
//         return renderStep5();
//       case 6:
//         return renderStep6();
//       case 7:
//         return renderStep7();
//       default:
//         return null;
//     }
//   };
  
//   const renderStep1 = () => (
//     <div className="space-y-4">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div>
//           <label className="block text-[10px] font-medium text-gray-500 mb-1">First Name *</label>
//           <input
//             type="text"
//             name="first_name"
//             value={formData.first_name}
//             onChange={handleChange}
//             className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
//             placeholder="Enter first name"
//             required
//           />
//         </div>
//         <div>
//           <label className="block text-[10px] font-medium text-gray-500 mb-1">Last Name *</label>
//           <input
//             type="text"
//             name="last_name"
//             value={formData.last_name}
//             onChange={handleChange}
//             className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
//             placeholder="Enter last name"
//             required
//           />
//         </div>
//         <div>
//           <label className="block text-[10px] font-medium text-gray-500 mb-1">Email</label>
//           <input
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
//             placeholder="student@school.com"
//           />
//         </div>
//         <div>
//           <label className="block text-[10px] font-medium text-gray-500 mb-1">Phone Number</label>
//           <input
//             type="tel"
//             name="phone_number"
//             value={formData.phone_number}
//             onChange={handleChange}
//             className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
//             placeholder="08012345678"
//           />
//         </div>
//         <div>
//           <label className="block text-[10px] font-medium text-gray-500 mb-1">Gender *</label>
//           <select
//             name="gender"
//             value={formData.gender}
//             onChange={handleChange}
//             className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
//             required
//           >
//             <option value="">Select Gender</option>
//             <option value="male">Male</option>
//             <option value="female">Female</option>
//           </select>
//         </div>
//         <div>
//           <label className="block text-[10px] font-medium text-gray-500 mb-1">Date of Birth</label>
//           <input
//             type="date"
//             name="date_of_birth"
//             value={formData.date_of_birth}
//             onChange={handleChange}
//             className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
//           />
//         </div>
//         <div>
//           <label className="block text-[10px] font-medium text-gray-500 mb-1">Password</label>
//           <input
//             type="password"
//             name="password"
//             value={formData.password}
//             onChange={handleChange}
//             className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
//             placeholder="Minimum 5 characters"
//           />
//         </div>
//         <div>
//           <label className="block text-[10px] font-medium text-gray-500 mb-1">Confirm Password</label>
//           <input
//             type="password"
//             name="confirm_password"
//             value={formData.confirm_password}
//             onChange={handleChange}
//             className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
//             placeholder="Confirm password"
//           />
//         </div>
//       </div>
//     </div>
//   );
  
//   const renderStep2 = () => (
//     <div className="space-y-4">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div className="md:col-span-2">
//           <label className="block text-[10px] font-medium text-gray-500 mb-1">Address</label>
//           <textarea
//             name="address"
//             value={formData.address}
//             onChange={handleChange}
//             rows={2}
//             className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
//             placeholder="Enter full address"
//           />
//         </div>
//         <div>
//           <label className="block text-[10px] font-medium text-gray-500 mb-1">City</label>
//           <input
//             type="text"
//             name="city"
//             value={formData.city}
//             onChange={handleChange}
//             className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
//             placeholder="City"
//           />
//         </div>
//         <div>
//           <label className="block text-[10px] font-medium text-gray-500 mb-1">State of Origin</label>
//           <select
//             name="state_of_origin"
//             value={formData.state_of_origin}
//             onChange={handleChange}
//             className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
//           >
//             <option value="">Select State</option>
//             {getNigerianStates().map(state => (
//               <option key={state.value} value={state.value}>{state.label}</option>
//             ))}
//           </select>
//         </div>
//         <div>
//           <label className="block text-[10px] font-medium text-gray-500 mb-1">Local Government Area</label>
//           <input
//             type="text"
//             name="lga"
//             value={formData.lga}
//             onChange={handleChange}
//             className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
//             placeholder="LGA"
//           />
//         </div>
//         <div>
//           <label className="block text-[10px] font-medium text-gray-500 mb-1">Nationality</label>
//           <input
//             type="text"
//             name="nationality"
//             value={formData.nationality}
//             onChange={handleChange}
//             className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
//             placeholder="Nationality"
//           />
//         </div>
//       </div>
//     </div>
//   );
  
//   const renderStep3 = () => (
//     <div className="space-y-4">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div>
//           <label className="block text-[10px] font-medium text-gray-500 mb-1">Class Level *</label>
//           <select
//             name="class_level"
//             value={formData.class_level}
//             onChange={handleChange}
//             className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
//             required
//           >
//             <option value="">Select Class Level</option>
//             {classLevels.map(level => (
//               <option key={level.id} value={level.id}>{level.name}</option>
//             ))}
//           </select>
//         </div>
//         <div>
//           <label className="block text-[10px] font-medium text-gray-500 mb-1">Stream</label>
//           <select
//             name="stream"
//             value={formData.stream}
//             onChange={handleChange}
//             className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
//           >
//             {getStreamOptions().map(option => (
//               <option key={option.value} value={option.value}>{option.label}</option>
//             ))}
//           </select>
//         </div>
//         <div>
//           <label className="block text-[10px] font-medium text-gray-500 mb-1">House</label>
//           <select
//             name="house"
//             value={formData.house}
//             onChange={handleChange}
//             className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
//           >
//             {getHouseOptions().map(option => (
//               <option key={option.value} value={option.value}>{option.label}</option>
//             ))}
//           </select>
//         </div>
//         <div>
//           <label className="block text-[10px] font-medium text-gray-500 mb-1">Student Category</label>
//           <select
//             name="student_category"
//             value={formData.student_category}
//             onChange={handleChange}
//             className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
//           >
//             {getStudentCategoryOptions().map(option => (
//               <option key={option.value} value={option.value}>{option.label}</option>
//             ))}
//           </select>
//         </div>
//         <div>
//           <label className="block text-[10px] font-medium text-gray-500 mb-1">Admission Date</label>
//           <input
//             type="date"
//             name="admission_date"
//             value={formData.admission_date}
//             onChange={handleChange}
//             className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
//           />
//         </div>
//         <div>
//           <label className="block text-[10px] font-medium text-gray-500 mb-1">Prefect Role</label>
//           <div className="flex items-center gap-2 mb-2">
//             <input
//               type="checkbox"
//               name="is_prefect"
//               checked={formData.is_prefect}
//               onChange={handleChange}
//               className="w-3 h-3 rounded"
//             />
//             <span className="text-xs text-gray-600">Student is a Prefect</span>
//           </div>
//           {formData.is_prefect && (
//             <input
//               type="text"
//               name="prefect_role"
//               value={formData.prefect_role}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
//               placeholder="e.g., Head Boy, Sports Prefect"
//             />
//           )}
//         </div>
//       </div>
//     </div>
//   );
  
//   const renderStep4 = () => (
//     <div className="space-y-4">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div>
//           <label className="block text-[10px] font-medium text-gray-500 mb-1">Previous School</label>
//           <input
//             type="text"
//             name="previous_school"
//             value={formData.previous_school}
//             onChange={handleChange}
//             className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
//             placeholder="Name of previous school"
//           />
//         </div>
//         <div>
//           <label className="block text-[10px] font-medium text-gray-500 mb-1">Previous Class</label>
//           <input
//             type="text"
//             name="previous_class"
//             value={formData.previous_class}
//             onChange={handleChange}
//             className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
//             placeholder="Previous class completed"
//           />
//         </div>
//         <div>
//           <label className="block text-[10px] font-medium text-gray-500 mb-1">Transfer Certificate No.</label>
//           <input
//             type="text"
//             name="transfer_certificate_no"
//             value={formData.transfer_certificate_no}
//             onChange={handleChange}
//             className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
//             placeholder="Transfer certificate number"
//           />
//         </div>
//       </div>
//     </div>
//   );
  
//   const renderStep5 = () => (
//     <div className="space-y-4">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div>
//           <label className="block text-[10px] font-medium text-gray-500 mb-1">Blood Group</label>
//           <select
//             name="blood_group"
//             value={formData.blood_group}
//             onChange={handleChange}
//             className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
//           >
//             <option value="">Select Blood Group</option>
//             {getBloodGroupOptions().map(option => (
//               <option key={option.value} value={option.value}>{option.label}</option>
//             ))}
//           </select>
//         </div>
//         <div>
//           <label className="block text-[10px] font-medium text-gray-500 mb-1">Genotype</label>
//           <select
//             name="genotype"
//             value={formData.genotype}
//             onChange={handleChange}
//             className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
//           >
//             <option value="">Select Genotype</option>
//             {getGenotypeOptions().map(option => (
//               <option key={option.value} value={option.value}>{option.label}</option>
//             ))}
//           </select>
//         </div>
//         <div className="md:col-span-2">
//           <div className="flex items-center gap-2 mb-2">
//             <input
//               type="checkbox"
//               name="has_allergies"
//               checked={formData.has_allergies}
//               onChange={handleChange}
//               className="w-3 h-3 rounded"
//             />
//             <span className="text-xs text-gray-600">Student has allergies</span>
//           </div>
//           {formData.has_allergies && (
//             <textarea
//               name="allergy_details"
//               value={formData.allergy_details}
//               onChange={handleChange}
//               rows={2}
//               className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
//               placeholder="Please specify allergy details"
//             />
//           )}
//         </div>
//         <div className="md:col-span-2">
//           <div className="flex items-center gap-2 mb-2">
//             <input
//               type="checkbox"
//               name="has_learning_difficulties"
//               checked={formData.has_learning_difficulties}
//               onChange={handleChange}
//               className="w-3 h-3 rounded"
//             />
//             <span className="text-xs text-gray-600">Student has learning difficulties</span>
//           </div>
//           {formData.has_learning_difficulties && (
//             <textarea
//               name="learning_difficulties_details"
//               value={formData.learning_difficulties_details}
//               onChange={handleChange}
//               rows={2}
//               className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
//               placeholder="Please specify learning difficulties"
//             />
//           )}
//         </div>
//         <div>
//           <label className="block text-[10px] font-medium text-gray-500 mb-1">Family Doctor Name</label>
//           <input
//             type="text"
//             name="family_doctor_name"
//             value={formData.family_doctor_name}
//             onChange={handleChange}
//             className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
//             placeholder="Family doctor name"
//           />
//         </div>
//         <div>
//           <label className="block text-[10px] font-medium text-gray-500 mb-1">Family Doctor Phone</label>
//           <input
//             type="tel"
//             name="family_doctor_phone"
//             value={formData.family_doctor_phone}
//             onChange={handleChange}
//             className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
//             placeholder="Doctor's phone number"
//           />
//         </div>
//         <div className="md:col-span-2">
//           <label className="block text-[10px] font-medium text-gray-500 mb-1">Medical Conditions</label>
//           <textarea
//             name="medical_conditions"
//             value={formData.medical_conditions}
//             onChange={handleChange}
//             rows={2}
//             className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
//             placeholder="Any medical conditions to note"
//           />
//         </div>
//       </div>
//     </div>
//   );
  
//   const renderStep6 = () => (
//     <div className="space-y-4">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div>
//           <label className="block text-[10px] font-medium text-gray-500 mb-1">Emergency Contact Name *</label>
//           <input
//             type="text"
//             name="emergency_contact_name"
//             value={formData.emergency_contact_name}
//             onChange={handleChange}
//             className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
//             placeholder="Full name"
//             required
//           />
//         </div>
//         <div>
//           <label className="block text-[10px] font-medium text-gray-500 mb-1">Emergency Contact Phone *</label>
//           <input
//             type="tel"
//             name="emergency_contact_phone"
//             value={formData.emergency_contact_phone}
//             onChange={handleChange}
//             className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
//             placeholder="Phone number"
//             required
//           />
//         </div>
//         <div>
//           <label className="block text-[10px] font-medium text-gray-500 mb-1">Emergency Contact Relationship *</label>
//           <input
//             type="text"
//             name="emergency_contact_relationship"
//             value={formData.emergency_contact_relationship}
//             onChange={handleChange}
//             className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
//             placeholder="e.g., Father, Mother, Guardian"
//             required
//           />
//         </div>
//         <div>
//           <label className="block text-[10px] font-medium text-gray-500 mb-1">Transportation Mode</label>
//           <select
//             name="transportation_mode"
//             value={formData.transportation_mode}
//             onChange={handleChange}
//             className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
//           >
//             {getTransportationOptions().map(option => (
//               <option key={option.value} value={option.value}>{option.label}</option>
//             ))}
//           </select>
//         </div>
//         {formData.transportation_mode === 'school_bus' && (
//           <div>
//             <label className="block text-[10px] font-medium text-gray-500 mb-1">Bus Route</label>
//             <input
//               type="text"
//               name="bus_route"
//               value={formData.bus_route}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
//               placeholder="e.g., Route A, Route B"
//             />
//           </div>
//         )}
//       </div>
//     </div>
//   );
  
//   const renderStep7 = () => (
//     <div className="space-y-4">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div>
//           <label className="block text-[10px] font-medium text-gray-500 mb-1">Student Photograph</label>
//           <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-[#D94801] transition-colors">
//             <Upload size={24} className="mx-auto text-gray-400 mb-2" />
//             <input
//               type="file"
//               name="student_image"
//               onChange={handleChange}
//               accept="image/*"
//               className="hidden"
//               id="student_image"
//             />
//             <label htmlFor="student_image" className="cursor-pointer text-sm text-[#D94801] hover:underline">
//               Click to upload
//             </label>
//             {fileNames.student_image && (
//               <Text variant="tiny" className="text-green-600 mt-1">{fileNames.student_image}</Text>
//             )}
//           </div>
//         </div>
//         <div>
//           <label className="block text-[10px] font-medium text-gray-500 mb-1">Birth Certificate</label>
//           <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-[#D94801] transition-colors">
//             <Upload size={24} className="mx-auto text-gray-400 mb-2" />
//             <input
//               type="file"
//               name="birth_certificate"
//               onChange={handleChange}
//               accept=".pdf,.jpg,.jpeg,.png"
//               className="hidden"
//               id="birth_certificate"
//             />
//             <label htmlFor="birth_certificate" className="cursor-pointer text-sm text-[#D94801] hover:underline">
//               Click to upload
//             </label>
//             {fileNames.birth_certificate && (
//               <Text variant="tiny" className="text-green-600 mt-1">{fileNames.birth_certificate}</Text>
//             )}
//           </div>
//         </div>
//         <div>
//           <label className="block text-[10px] font-medium text-gray-500 mb-1">Immunization Record</label>
//           <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-[#D94801] transition-colors">
//             <Upload size={24} className="mx-auto text-gray-400 mb-2" />
//             <input
//               type="file"
//               name="immunization_record"
//               onChange={handleChange}
//               accept=".pdf,.jpg,.jpeg,.png"
//               className="hidden"
//               id="immunization_record"
//             />
//             <label htmlFor="immunization_record" className="cursor-pointer text-sm text-[#D94801] hover:underline">
//               Click to upload
//             </label>
//             {fileNames.immunization_record && (
//               <Text variant="tiny" className="text-green-600 mt-1">{fileNames.immunization_record}</Text>
//             )}
//           </div>
//         </div>
//         <div>
//           <label className="block text-[10px] font-medium text-gray-500 mb-1">Previous School Report</label>
//           <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-[#D94801] transition-colors">
//             <Upload size={24} className="mx-auto text-gray-400 mb-2" />
//             <input
//               type="file"
//               name="previous_school_report"
//               onChange={handleChange}
//               accept=".pdf,.jpg,.jpeg,.png"
//               className="hidden"
//               id="previous_school_report"
//             />
//             <label htmlFor="previous_school_report" className="cursor-pointer text-sm text-[#D94801] hover:underline">
//               Click to upload
//             </label>
//             {fileNames.previous_school_report && (
//               <Text variant="tiny" className="text-green-600 mt-1">{fileNames.previous_school_report}</Text>
//             )}
//           </div>
//         </div>
//         <div>
//           <label className="block text-[10px] font-medium text-gray-500 mb-1">Parent ID Copy</label>
//           <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-[#D94801] transition-colors">
//             <Upload size={24} className="mx-auto text-gray-400 mb-2" />
//             <input
//               type="file"
//               name="parent_id_copy"
//               onChange={handleChange}
//               accept=".pdf,.jpg,.jpeg,.png"
//               className="hidden"
//               id="parent_id_copy"
//             />
//             <label htmlFor="parent_id_copy" className="cursor-pointer text-sm text-[#D94801] hover:underline">
//               Click to upload
//             </label>
//             {fileNames.parent_id_copy && (
//               <Text variant="tiny" className="text-green-600 mt-1">{fileNames.parent_id_copy}</Text>
//             )}
//           </div>
//         </div>
//         <div>
//           <label className="block text-[10px] font-medium text-gray-500 mb-1">Fee Payment Evidence</label>
//           <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-[#D94801] transition-colors">
//             <Upload size={24} className="mx-auto text-gray-400 mb-2" />
//             <input
//               type="file"
//               name="fee_payment_evidence"
//               onChange={handleChange}
//               accept=".pdf,.jpg,.jpeg,.png"
//               className="hidden"
//               id="fee_payment_evidence"
//             />
//             <label htmlFor="fee_payment_evidence" className="cursor-pointer text-sm text-[#D94801] hover:underline">
//               Click to upload
//             </label>
//             {fileNames.fee_payment_evidence && (
//               <Text variant="tiny" className="text-green-600 mt-1">{fileNames.fee_payment_evidence}</Text>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
  
//   return (
//     <DashboardLayout title="Add New Student">
//       <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-6">
//         {/* Progress Steps */}
//         <div className="mb-8">
//           <div className="flex items-center justify-between">
//             {[1, 2, 3, 4, 5, 6, 7].map(step => (
//               <React.Fragment key={step}>
//                 <button
//                   type="button"
//                   onClick={() => setCurrentStep(step)}
//                   className={`flex flex-col items-center ${currentStep >= step ? 'text-[#D94801]' : 'text-gray-400'}`}
//                 >
//                   <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all
//                     ${currentStep > step ? 'bg-green-500 text-white' : 
//                       currentStep === step ? 'bg-[#D94801] text-white ring-4 ring-[#D94801]/20' : 
//                       'bg-gray-200 text-gray-500'}`}
//                   >
//                     {currentStep > step ? <CheckCircle size={16} /> : step}
//                   </div>
//                   <span className="text-[9px] mt-1 hidden sm:block">
//                     {step === 1 && 'Basic'}
//                     {step === 2 && 'Address'}
//                     {step === 3 && 'Academic'}
//                     {step === 4 && 'Previous'}
//                     {step === 5 && 'Health'}
//                     {step === 6 && 'Emergency'}
//                     {step === 7 && 'Docs'}
//                   </span>
//                 </button>
//                 {step < 7 && (
//                   <div className={`flex-1 h-0.5 mx-2 ${currentStep > step ? 'bg-green-500' : 'bg-gray-200'}`} />
//                 )}
//               </React.Fragment>
//             ))}
//           </div>
//         </div>
        
//         {/* Error/Success Alerts */}
//         {error && <Alert type="error" message={error} onClose={() => setError('')} className="mb-4" />}
//         {success && <Alert type="success" message={success} onClose={() => setSuccess('')} className="mb-4" />}
        
//         {/* Form Card */}
//         <Card className="p-4 sm:p-6">
//           <form onSubmit={handleSubmit}>
//             {/* Step Title */}
//             <div className="mb-6 pb-3 border-b border-gray-100">
//               <Text variant="h3" className="font-semibold">
//                 Step {currentStep}: {currentStep === 1 && 'Basic Information'}
//                 {currentStep === 2 && 'Address Information'}
//                 {currentStep === 3 && 'Academic Information'}
//                 {currentStep === 4 && 'Previous School Information'}
//                 {currentStep === 5 && 'Health Information'}
//                 {currentStep === 6 && 'Emergency Contact & Transportation'}
//                 {currentStep === 7 && 'Document Uploads'}
//               </Text>
//             </div>
            
//             {/* Step Content */}
//             {renderStepContent()}
            
//             {/* Navigation Buttons */}
//             <div className="flex justify-between gap-3 mt-8 pt-4 border-t border-gray-100">
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={handlePrevious}
//                 disabled={currentStep === 1}
//                 icon={ChevronLeft}
//               >
//                 Previous
//               </Button>
              
//               {currentStep < totalSteps ? (
//                 <Button
//                   type="button"
//                   variant="primary"
//                   onClick={handleNext}
//                   icon={ChevronRight}
//                   iconPosition="right"
//                 >
//                   Next
//                 </Button>
//               ) : (
//                 <Button
//                   type="submit"
//                   variant="primary"
//                   loading={loading}
//                   icon={CheckCircle}
//                 >
//                   Create Student
//                 </Button>
//               )}
//             </div>
//           </form>
//         </Card>
//       </div>
//     </DashboardLayout>
//   );
// };

// export default StudentCreate;

// src/pages/students/StudentCreate.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import Alert from '../../components/common/Alert';
import { Text, Button, Card } from '../../components/ui';
import { 
  User, Mail, Phone, Calendar, MapPin, BookOpen, Users, Heart, 
  FileText, ChevronLeft, ChevronRight, CheckCircle, AlertCircle,
  Upload, X, Building2, Bus, Home, Shield, Award, Activity, Save,
  RefreshCw
} from 'lucide-react';
import { createStudentUser, updateStudentProfile } from '../../services/studentService';
import { getClassLevels } from '../../services/academicService';
import api from '../../services/api';
import { 
  getNigerianStates, getStreamOptions, getStudentCategoryOptions, 
  getHouseOptions, getBloodGroupOptions, getGenotypeOptions, 
  getTransportationOptions 
} from '../../utils/studentUtils';

const StudentCreate = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [classLevels, setClassLevels] = useState([]);
  const [createdUserId, setCreatedUserId] = useState(null);
  const [createdStudentId, setCreatedStudentId] = useState(null);
  
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
    admission_date: new Date().toISOString().split('T')[0],
    
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
    
    // Password
    password: 'Student@2024',
    confirm_password: 'Student@2024'
  });
  
  const [fileNames, setFileNames] = useState({
    student_image: '',
    birth_certificate: '',
    immunization_record: '',
    previous_school_report: '',
    parent_id_copy: '',
    fee_payment_evidence: ''
  });
  
  const totalSteps = 7;
  
  useEffect(() => {
    loadClassLevels();
  }, []);
  
  const loadClassLevels = async () => {
    try {
      const response = await getClassLevels();
      const levels = response.results || response || [];
      setClassLevels(levels);
    } catch (err) {
      console.error('Error loading class levels:', err);
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
      case 1: // Basic Information
        if (!formData.first_name) errors.push('First name is required');
        if (!formData.last_name) errors.push('Last name is required');
        if (!formData.gender) errors.push('Gender is required');
        if (formData.password !== formData.confirm_password) {
          errors.push('Passwords do not match');
        }
        if (formData.password && formData.password.length < 5) {
          errors.push('Password must be at least 5 characters');
        }
        break;
        
      case 2: // Address Information
        // Address fields are optional
        break;
        
      case 3: // Academic Information
        if (!formData.class_level) errors.push('Class level is required');
        if (!formData.admission_date) errors.push('Admission date is required');
        break;
        
      case 4: // Previous School Information
        // Optional fields
        break;
        
      case 5: // Health Information
        if (formData.has_allergies && !formData.allergy_details) {
          errors.push('Please specify allergy details');
        }
        if (formData.has_learning_difficulties && !formData.learning_difficulties_details) {
          errors.push('Please specify learning difficulties details');
        }
        break;
        
      case 6: // Emergency Contact & Transportation
        if (!formData.emergency_contact_name) errors.push('Emergency contact name is required');
        if (!formData.emergency_contact_phone) errors.push('Emergency contact phone is required');
        if (!formData.emergency_contact_relationship) errors.push('Emergency contact relationship is required');
        break;
        
      case 7: // Documents
        // Optional
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
  
  // ============================================
  // STEP 1: Create User Account Only
  // ============================================
  const createUserAccount = async () => {
    console.log('📝 STEP 1: Creating user account...');
    
    const userData = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      password: formData.password,
      confirm_password: formData.confirm_password,
      role: 'student',
    };
    
    // Add optional user fields
    if (formData.email && formData.email.trim()) userData.email = formData.email;
    if (formData.phone_number && formData.phone_number.trim()) userData.phone_number = formData.phone_number;
    if (formData.gender) userData.gender = formData.gender;
    if (formData.date_of_birth) userData.date_of_birth = formData.date_of_birth;
    if (formData.address && formData.address.trim()) userData.address = formData.address;
    if (formData.city && formData.city.trim()) userData.city = formData.city;
    if (formData.state_of_origin) userData.state_of_origin = formData.state_of_origin;
    if (formData.lga && formData.lga.trim()) userData.lga = formData.lga;
    if (formData.nationality) userData.nationality = formData.nationality;
    
    console.log('📦 Sending user data:', userData);
    
    const response = await createStudentUser(userData);
    console.log('✅ User created:', response);
    
    return response;
  };
  
  // ============================================
  // STEP 2: Update Student Profile
  // ============================================
  const updateStudentProfileData = async (studentId) => {
    console.log('📝 STEP 2: Updating student profile for ID:', studentId);
    
    const formDataToSend = new FormData();
    
    // Academic fields
    if (formData.class_level) formDataToSend.append('class_level', formData.class_level);
    if (formData.stream) formDataToSend.append('stream', formData.stream);
    if (formData.house) formDataToSend.append('house', formData.house);
    if (formData.student_category) formDataToSend.append('student_category', formData.student_category);
    if (formData.admission_date) formDataToSend.append('admission_date', formData.admission_date);
    
    // Previous school fields
    if (formData.previous_school) formDataToSend.append('previous_school', formData.previous_school);
    if (formData.previous_class) formDataToSend.append('previous_class', formData.previous_class);
    if (formData.transfer_certificate_no) formDataToSend.append('transfer_certificate_no', formData.transfer_certificate_no);
    
    // Health fields
    if (formData.blood_group) formDataToSend.append('blood_group', formData.blood_group);
    if (formData.genotype) formDataToSend.append('genotype', formData.genotype);
    formDataToSend.append('has_allergies', formData.has_allergies);
    if (formData.allergy_details) formDataToSend.append('allergy_details', formData.allergy_details);
    formDataToSend.append('has_received_vaccinations', formData.has_received_vaccinations);
    if (formData.family_doctor_name) formDataToSend.append('family_doctor_name', formData.family_doctor_name);
    if (formData.family_doctor_phone) formDataToSend.append('family_doctor_phone', formData.family_doctor_phone);
    if (formData.medical_conditions) formDataToSend.append('medical_conditions', formData.medical_conditions);
    formDataToSend.append('has_learning_difficulties', formData.has_learning_difficulties);
    if (formData.learning_difficulties_details) formDataToSend.append('learning_difficulties_details', formData.learning_difficulties_details);
    
    // Emergency Contact & Transportation
    if (formData.emergency_contact_name) formDataToSend.append('emergency_contact_name', formData.emergency_contact_name);
    if (formData.emergency_contact_phone) formDataToSend.append('emergency_contact_phone', formData.emergency_contact_phone);
    if (formData.emergency_contact_relationship) formDataToSend.append('emergency_contact_relationship', formData.emergency_contact_relationship);
    if (formData.transportation_mode) formDataToSend.append('transportation_mode', formData.transportation_mode);
    if (formData.bus_route) formDataToSend.append('bus_route', formData.bus_route);
    
    // Leadership
    formDataToSend.append('is_prefect', formData.is_prefect);
    if (formData.prefect_role) formDataToSend.append('prefect_role', formData.prefect_role);
    
    // Files
    if (formData.student_image instanceof File) formDataToSend.append('student_image', formData.student_image);
    if (formData.birth_certificate instanceof File) formDataToSend.append('birth_certificate', formData.birth_certificate);
    if (formData.immunization_record instanceof File) formDataToSend.append('immunization_record', formData.immunization_record);
    if (formData.previous_school_report instanceof File) formDataToSend.append('previous_school_report', formData.previous_school_report);
    if (formData.parent_id_copy instanceof File) formDataToSend.append('parent_id_copy', formData.parent_id_copy);
    if (formData.fee_payment_evidence instanceof File) formDataToSend.append('fee_payment_evidence', formData.fee_payment_evidence);
    
    console.log('📤 Sending update to API...');
    
    // Use the full-update endpoint
    const response = await api.put(`/students/api/${studentId}/full-update/`, formDataToSend, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    
    console.log('✅ Student profile updated:', response.data);
    return response.data;
  };
  
  // ============================================
  // MAIN SUBMIT FUNCTION - Two Step Process
  // ============================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep()) return;
    
    try {
      setLoading(true);
      setError('');
      
      // ============================================
      // STEP 1: Create the user account first
      // ============================================
      const userResponse = await createUserAccount();
      
      // Get the user ID from response
      const userId = userResponse.user?.id || userResponse.id;
      
      if (!userId) {
        throw new Error('User created but no user ID returned');
      }
      
      console.log('✅ User created with ID:', userId);
      setCreatedUserId(userId);
      
      // ============================================
      // Now we need to get the student ID
      // The student profile is automatically created when user is created with role='student'
      // So we need to fetch the student by user ID
      // ============================================
      
      // Fetch student by user ID
      const studentsResponse = await api.get('/students/api/', {
        params: { user: userId }
      });
      
      const students = studentsResponse.data.results || studentsResponse.data || [];
      let studentId = null;
      
      if (students.length > 0) {
        studentId = students[0].id;
        console.log('✅ Found existing student profile with ID:', studentId);
      } else {
        // If no student profile exists, create one
        console.log('📝 No existing student profile, creating one...');
        const createStudentResponse = await api.post('/students/api/', {
          user_id: userId,
          class_level: formData.class_level,
        });
        studentId = createStudentResponse.data.id;
        console.log('✅ Student profile created with ID:', studentId);
      }
      
      setCreatedStudentId(studentId);
      
      // ============================================
      // STEP 2: Update the student profile with additional data
      // ============================================
      if (studentId) {
        await updateStudentProfileData(studentId);
      } else {
        throw new Error('Could not create or find student profile');
      }
      
      setSuccess('Student created successfully!');
      setTimeout(() => {
        navigate('/students');
      }, 2000);
      
    } catch (err) {
      console.error('Error creating student:', err);
      setError(err.message || 'Failed to create student. Please try again.');
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
            placeholder="Enter first name"
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
            placeholder="Enter last name"
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
            placeholder="student@school.com"
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
            placeholder="08012345678"
          />
        </div>
        <div>
          <label className="block text-[10px] font-medium text-gray-500 mb-1">Gender *</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
            required
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
        <div>
          <label className="block text-[10px] font-medium text-gray-500 mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
            placeholder="Minimum 5 characters"
          />
        </div>
        <div>
          <label className="block text-[10px] font-medium text-gray-500 mb-1">Confirm Password</label>
          <input
            type="password"
            name="confirm_password"
            value={formData.confirm_password}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
            placeholder="Confirm password"
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
            placeholder="Enter full address"
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
            placeholder="City"
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
            placeholder="LGA"
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
            placeholder="Nationality"
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
            placeholder="Name of previous school"
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
            placeholder="Previous class completed"
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
            placeholder="Transfer certificate number"
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
            placeholder="Family doctor name"
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
            placeholder="Doctor's phone number"
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
            placeholder="Full name"
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
            placeholder="Phone number"
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
            placeholder="e.g., Father, Mother, Guardian"
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
              Click to upload
            </label>
            {fileNames.student_image && (
              <Text variant="tiny" className="text-green-600 mt-1">{fileNames.student_image}</Text>
            )}
          </div>
        </div>
        <div>
          <label className="block text-[10px] font-medium text-gray-500 mb-1">Birth Certificate</label>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-[#D94801] transition-colors">
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
              Click to upload
            </label>
            {fileNames.birth_certificate && (
              <Text variant="tiny" className="text-green-600 mt-1">{fileNames.birth_certificate}</Text>
            )}
          </div>
        </div>
        <div>
          <label className="block text-[10px] font-medium text-gray-500 mb-1">Immunization Record</label>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-[#D94801] transition-colors">
            <Upload size={24} className="mx-auto text-gray-400 mb-2" />
            <input
              type="file"
              name="immunization_record"
              onChange={handleChange}
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
              id="immunization_record"
            />
            <label htmlFor="immunization_record" className="cursor-pointer text-sm text-[#D94801] hover:underline">
              Click to upload
            </label>
            {fileNames.immunization_record && (
              <Text variant="tiny" className="text-green-600 mt-1">{fileNames.immunization_record}</Text>
            )}
          </div>
        </div>
        <div>
          <label className="block text-[10px] font-medium text-gray-500 mb-1">Previous School Report</label>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-[#D94801] transition-colors">
            <Upload size={24} className="mx-auto text-gray-400 mb-2" />
            <input
              type="file"
              name="previous_school_report"
              onChange={handleChange}
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
              id="previous_school_report"
            />
            <label htmlFor="previous_school_report" className="cursor-pointer text-sm text-[#D94801] hover:underline">
              Click to upload
            </label>
            {fileNames.previous_school_report && (
              <Text variant="tiny" className="text-green-600 mt-1">{fileNames.previous_school_report}</Text>
            )}
          </div>
        </div>
        <div>
          <label className="block text-[10px] font-medium text-gray-500 mb-1">Parent ID Copy</label>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-[#D94801] transition-colors">
            <Upload size={24} className="mx-auto text-gray-400 mb-2" />
            <input
              type="file"
              name="parent_id_copy"
              onChange={handleChange}
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
              id="parent_id_copy"
            />
            <label htmlFor="parent_id_copy" className="cursor-pointer text-sm text-[#D94801] hover:underline">
              Click to upload
            </label>
            {fileNames.parent_id_copy && (
              <Text variant="tiny" className="text-green-600 mt-1">{fileNames.parent_id_copy}</Text>
            )}
          </div>
        </div>
        <div>
          <label className="block text-[10px] font-medium text-gray-500 mb-1">Fee Payment Evidence</label>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-[#D94801] transition-colors">
            <Upload size={24} className="mx-auto text-gray-400 mb-2" />
            <input
              type="file"
              name="fee_payment_evidence"
              onChange={handleChange}
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
              id="fee_payment_evidence"
            />
            <label htmlFor="fee_payment_evidence" className="cursor-pointer text-sm text-[#D94801] hover:underline">
              Click to upload
            </label>
            {fileNames.fee_payment_evidence && (
              <Text variant="tiny" className="text-green-600 mt-1">{fileNames.fee_payment_evidence}</Text>
            )}
          </div>
        </div>
      </div>
    </div>
  );
  
  return (
    <DashboardLayout title="Add New Student">
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
                  Create Student
                </Button>
              )}
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StudentCreate;