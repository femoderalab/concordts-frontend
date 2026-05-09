// /**
//  * Student Detail Page - REDESIGNED
//  * View and edit individual student profile
//  */

// import React, { useState, useEffect } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import DashboardLayout from '../components/dashboard/DashboardLayout';
// import Alert from '../components/common/Alert';
// import Loader, { PageLoader } from '../components/common/Loader';
// import Button from '../components/common/Button';
// import Input from '../components/common/Input';
// import useAuth from '../hooks/useAuth';
// import { getStudentById, updateStudent, uploadStudentDocument } from '../services/studentService';
// import { handleApiError } from '../services/api';
// import {
//   formatFee,
//   getStreamOptions,
//   getStudentCategoryOptions,
//   getHouseOptions,
//   getTransportationOptions,
//   getBloodGroupOptions,
//   getGenotypeOptions,
//   getDocumentTypeOptions,
// } from '../utils/studentUtils';
// import { ArrowLeft, Edit, Save, X, Upload, FileText, Award, Activity, Heart, Phone, Mail, MapPin, Calendar, Users, Home, School, Download } from 'lucide-react';

// const StudentDetail = () => {
//   const { id } = useParams();
//   const { user, isAdmin, isTeacher } = useAuth();
  
//   // State for student data
//   const [student, setStudent] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
  
//   // State for edit mode
//   const [isEditing, setIsEditing] = useState(false);
//   const [formData, setFormData] = useState({});
//   const [fieldErrors, setFieldErrors] = useState({});
//   const [saving, setSaving] = useState(false);
  
//   // State for document upload
//   const [showDocumentModal, setShowDocumentModal] = useState(false);
//   const [documentData, setDocumentData] = useState({
//     document_type: 'student_image',
//     document: null,
//   });
//   const [uploading, setUploading] = useState(false);

//   // Fetch student data on component mount
//   useEffect(() => {
//     if (id) {
//       fetchStudentData();
//     }
//   }, [id]);

//   const fetchStudentData = async () => {
//     try {
//       setLoading(true);
//       setError('');
      
//       const studentData = await getStudentById(id);
//       setStudent(studentData);
//       setFormData(studentData);
      
//     } catch (err) {
//       const errorMessage = handleApiError(err);
//       setError(errorMessage);
//       console.error('Error fetching student:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Check if current user can edit this student
//   const canEditStudent = () => {
//     if (!student || !user) return false;
    
//     if (isAdmin()) return true;
    
//     if (isTeacher()) return true;
    
//     if (['accountant', 'secretary'].includes(user?.role)) return true;
    
//     if (user?.role === 'student' && student?.user?.id === user?.id) return true;
    
//     if (user?.role === 'parent') {
//       return true;
//     }
    
//     return false;
//   };

//   // Handle form input changes
//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     const inputValue = type === 'checkbox' ? checked : value;
    
//     setFormData(prev => ({
//       ...prev,
//       [name]: inputValue,
//     }));
    
//     // Clear field error when user starts typing
//     if (fieldErrors[name]) {
//       setFieldErrors(prev => ({
//         ...prev,
//         [name]: '',
//       }));
//     }
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!canEditStudent()) {
//       setError('You do not have permission to edit this student');
//       return;
//     }

//     try {
//       setSaving(true);
//       setError('');
      
//       const updateData = { ...formData };
      
//       delete updateData.user;
//       delete updateData.fee_summary;
//       delete updateData.document_checklist;
//       delete updateData.parents;
//       delete updateData.enrollments;
//       delete updateData.created_at;
//       delete updateData.updated_at;
      
//       const updatedStudent = await updateStudent(id, updateData);
      
//       setStudent(updatedStudent);
//       setSuccess('Student profile updated successfully!');
//       setIsEditing(false);
      
//     } catch (err) {
//       const errorMessage = handleApiError(err);
//       setError(errorMessage);
//     } finally {
//       setSaving(false);
//     }
//   };

//   // Handle document upload
//   const handleDocumentUpload = async (e) => {
//     e.preventDefault();
    
//     if (!documentData.document) {
//       setError('Please select a document to upload');
//       return;
//     }

//     try {
//       setUploading(true);
//       setError('');
      
//       await uploadStudentDocument(id, documentData);
      
//       setSuccess('Document uploaded successfully!');
//       setShowDocumentModal(false);
//       setDocumentData({
//         document_type: 'student_image',
//         document: null,
//       });
      
//       fetchStudentData();
      
//     } catch (err) {
//       const errorMessage = handleApiError(err);
//       setError(errorMessage);
//     } finally {
//       setUploading(false);
//     }
//   };

//   // Handle document file selection
//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setDocumentData(prev => ({
//         ...prev,
//         document: file,
//       }));
//     }
//   };

//   // Get options for dropdowns
//   const streamOptions = getStreamOptions();
//   const studentCategoryOptions = getStudentCategoryOptions();
//   const houseOptions = getHouseOptions();
//   const transportationOptions = getTransportationOptions();
//   const bloodGroupOptions = getBloodGroupOptions();
//   const genotypeOptions = getGenotypeOptions();
//   const documentTypeOptions = getDocumentTypeOptions();

//   // Loading state
//   if (loading && !student) {
//     return <PageLoader text="Loading student profile..." />;
//   }

//   // Error state
//   if (error && !student) {
//     return (
//       <DashboardLayout title="Student Profile">
//         <Alert
//           type="error"
//           message={error}
//           onClose={() => setError('')}
//           className="mb-6"
//         />
//         <div className="text-center py-12">
//           <p className="text-gray-600">Failed to load student profile.</p>
//           <button
//             onClick={fetchStudentData}
//             className="mt-4 text-secondary-600 hover:text-secondary-700 font-medium"
//           >
//             Retry
//           </button>
//         </div>
//       </DashboardLayout>
//     );
//   }

//   if (!student) {
//     return (
//       <DashboardLayout title="Student Profile">
//         <div className="text-center py-12">
//           <p className="text-gray-600">Student not found.</p>
//           <Link to="/students" className="mt-4 text-secondary-600 hover:text-secondary-700 font-medium">
//             Back to Students
//           </Link>
//         </div>
//       </DashboardLayout>
//     );
//   }

//   // Format date for display
//   const formatDate = (dateString) => {
//     if (!dateString) return 'Not provided';
//     return new Date(dateString).toLocaleDateString('en-GB', {
//       day: 'numeric',
//       month: 'long',
//       year: 'numeric'
//     });
//   };

//   // Get fee status color
//   const getFeeStatusColor = (status) => {
//     switch (status) {
//       case 'paid_full': return 'bg-success-100 text-success-800';
//       case 'paid_partial': return 'bg-accent-100 text-accent-800';
//       case 'not_paid': return 'bg-red-100 text-red-800';
//       case 'scholarship': return 'bg-blue-100 text-blue-800';
//       case 'exempted': return 'bg-purple-100 text-purple-800';
//       default: return 'bg-neutral-100 text-neutral-800';
//     }
//   };

//   return (
//     <DashboardLayout title={`Student Profile`}>
//       {/* Back Navigation */}
//       <div className="mb-6">
//         <Link to="/students" className="inline-flex items-center text-secondary-600 hover:text-secondary-700 transition-colors">
//           <ArrowLeft size={18} className="mr-2" />
//           Back to Students
//         </Link>
//       </div>

//       {/* Success Alert */}
//       {success && (
//         <Alert
//           type="success"
//           message={success}
//           onClose={() => setSuccess('')}
//           className="mb-6"
//         />
//       )}

//       {/* Error Alert */}
//       {error && (
//         <Alert
//           type="error"
//           message={error}
//           onClose={() => setError('')}
//           className="mb-6"
//         />
//       )}

//       {/* Header Section */}
//       <div className="bg-white rounded-xl shadow-soft p-6 mb-8 border border-neutral-100">
//         <div className="flex flex-col lg:flex-row lg:items-center justify-between">
//           <div className="flex items-center space-x-4 mb-6 lg:mb-0">
//             {/* Student Avatar */}
//             {/* <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-medium">
//               {student.user?.profile_image ? (
//                 <img 
//                   src={student.user.profile_image} 
//                   alt={student.user.full_name}
//                   className="w-full h-full rounded-xl object-cover"
//                 />
//               ) : (
//                 <span className="text-white font-bold text-3xl">
//                   {student.user?.first_name?.charAt(0) || 'S'}
//                 </span>
//               )}
//             </div> */}
//             {/* Student Avatar */}
//             <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-medium">
//               {student.student_image ? (
//                 <img 
//                   src={student.student_image}
//                   alt={student.user?.full_name}
//                   className="w-full h-full rounded-xl object-cover"
//                 />
//               ) : (
//                 <span className="text-white font-bold text-3xl">
//                   {student.user?.first_name?.charAt(0) || 'S'}
//                 </span>
//               )}
//             </div>
            
//             {/* Student Info */}
//             <div>
//               <h1 className="text-2xl font-heading font-bold text-neutral-800">
//                 {student.user?.full_name || `${student.user?.first_name} ${student.user?.last_name}`}
//               </h1>
//               <p className="text-neutral-600 flex items-center">
//                 <Award size={16} className="mr-2" />
//                 {student.user?.registration_number}
//               </p>
//               <div className="flex items-center space-x-2 mt-3">
//                 <span className={`px-3 py-1 text-sm rounded-full ${getFeeStatusColor(student.fee_status)}`}>
//                   {student.fee_status_display || 'Fee Status'}
//                 </span>
//                 <span className={`px-3 py-1 text-sm rounded-full ${student.is_active ? 'bg-success-100 text-success-800' : 'bg-red-100 text-red-800'}`}>
//                   {student.is_active ? 'Active' : 'Inactive'}
//                 </span>
//                 {student.is_graduated && (
//                   <span className="px-3 py-1 text-sm rounded-full bg-accent-100 text-accent-800">
//                     Graduated
//                   </span>
//                 )}
//               </div>
//             </div>
//           </div>
          
//           {/* Action Buttons */}
//           <div className="flex flex-wrap gap-3">
//             <Link to={`/students/${id}/dashboard`}>
//               <Button variant="outline" className="border-secondary-200 text-secondary-700 hover:bg-secondary-50">
//                 <Activity size={18} className="mr-2" />
//                 Dashboard
//               </Button>
//             </Link>
            
//             {canEditStudent() && !isEditing && (
//               <Button
//                 onClick={() => setIsEditing(true)}
//                 variant="outline"
//                 className="border-secondary-200 text-secondary-700 hover:bg-secondary-50"
//               >
//                 <Edit size={18} className="mr-2" />
//                 Edit Profile
//               </Button>
//             )}
            
//             {canEditStudent() && isEditing && (
//               <>
//                 <Button
//                   onClick={() => {
//                     setIsEditing(false);
//                     setFormData(student);
//                   }}
//                   variant="outline"
//                   className="border-red-200 text-red-700 hover:bg-red-50"
//                 >
//                   <X size={18} className="mr-2" />
//                   Cancel
//                 </Button>
//                 <Button
//                   onClick={handleSubmit}
//                   loading={saving}
//                   className="bg-secondary-600 hover:bg-secondary-700"
//                 >
//                   <Save size={18} className="mr-2" />
//                   Save Changes
//                 </Button>
//               </>
//             )}
            
//             <Button
//               onClick={() => setShowDocumentModal(true)}
//               className="bg-primary-600 hover:bg-primary-700"
//             >
//               <Upload size={18} className="mr-2" />
//               Upload Document
//             </Button>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {/* Left Column - Personal & Academic Info */}
//         <div className="lg:col-span-2 space-y-8">
//           {/* Personal Information Card */}
//           <div className="bg-white rounded-xl shadow-soft p-6 border border-neutral-100">
//             <div className="flex items-center justify-between mb-6">
//               <h3 className="text-xl font-semibold text-neutral-800 flex items-center">
//                 <Users size={20} className="mr-2 text-secondary-600" />
//                 Personal Information
//               </h3>
//               {canEditStudent() && isEditing && (
//                 <button
//                   onClick={() => setShowDocumentModal(true)}
//                   className="text-sm text-secondary-600 hover:text-secondary-700"
//                 >
//                   <Upload size={16} className="inline mr-1" />
//                   Upload Document
//                 </button>
//               )}
//             </div>
            
//             {isEditing ? (
//               <form onSubmit={handleSubmit} className="space-y-4">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="label">First Name</label>
//                     <Input
//                       name="user.first_name"
//                       value={formData.user?.first_name || ''}
//                       onChange={handleInputChange}
//                       disabled={saving}
//                     />
//                   </div>
//                   <div>
//                     <label className="label">Last Name</label>
//                     <Input
//                       name="user.last_name"
//                       value={formData.user?.last_name || ''}
//                       onChange={handleInputChange}
//                       disabled={saving}
//                     />
//                   </div>
//                 </div>
                
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="label">Email</label>
//                     <Input
//                       name="user.email"
//                       type="email"
//                       value={formData.user?.email || ''}
//                       onChange={handleInputChange}
//                       disabled={saving}
//                     />
//                   </div>
//                   <div>
//                     <label className="label">Phone</label>
//                     <Input
//                       name="user.phone_number"
//                       value={formData.user?.phone_number || ''}
//                       onChange={handleInputChange}
//                       disabled={saving}
//                     />
//                   </div>
//                 </div>
                
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="label">Date of Birth</label>
//                     <Input
//                       name="user.date_of_birth"
//                       type="date"
//                       value={formData.user?.date_of_birth || ''}
//                       onChange={handleInputChange}
//                       disabled={saving}
//                     />
//                   </div>
//                   <div>
//                     <label className="label">Gender</label>
//                     <select
//                       name="user.gender"
//                       value={formData.user?.gender || ''}
//                       onChange={handleInputChange}
//                       className="input-field"
//                       disabled={saving}
//                     >
//                       <option value="">Select Gender</option>
//                       <option value="male">Male</option>
//                       <option value="female">Female</option>
//                     </select>
//                   </div>
//                 </div>
                
//                 <div>
//                   <label className="label">Address</label>
//                   <Input
//                     name="user.address"
//                     type="textarea"
//                     value={formData.user?.address || ''}
//                     onChange={handleInputChange}
//                     rows={2}
//                     disabled={saving}
//                   />
//                 </div>
//               </form>
//             ) : (
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="space-y-3">
//                   <div>
//                     <p className="text-sm text-neutral-500 flex items-center">
//                       <Users size={14} className="mr-2" />
//                       Full Name
//                     </p>
//                     <p className="font-medium text-neutral-800">{student.user?.full_name}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-neutral-500 flex items-center">
//                       <Award size={14} className="mr-2" />
//                       Registration Number
//                     </p>
//                     <p className="font-medium text-neutral-800">{student.user?.registration_number}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-neutral-500 flex items-center">
//                       <Calendar size={14} className="mr-2" />
//                       Date of Birth
//                     </p>
//                     <p className="font-medium text-neutral-800">{formatDate(student.user?.date_of_birth)}</p>
//                   </div>
//                 </div>
                
//                 <div className="space-y-3">
//                   <div>
//                     <p className="text-sm text-neutral-500 flex items-center">
//                       <Mail size={14} className="mr-2" />
//                       Email
//                     </p>
//                     <p className="font-medium text-neutral-800">{student.user?.email}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-neutral-500 flex items-center">
//                       <Phone size={14} className="mr-2" />
//                       Phone
//                     </p>
//                     <p className="font-medium text-neutral-800">{student.user?.phone_number}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-neutral-500 flex items-center">
//                       <MapPin size={14} className="mr-2" />
//                       Address
//                     </p>
//                     <p className="font-medium text-neutral-800">{student.user?.address || 'Not provided'}</p>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Academic Information Card */}
//           <div className="bg-white rounded-xl shadow-soft p-6 border border-neutral-100">
//             <h3 className="text-xl font-semibold text-neutral-800 flex items-center mb-6">
//               <School size={20} className="mr-2 text-secondary-600" />
//               Academic Information
//             </h3>
            
//             {isEditing ? (
//               <form onSubmit={handleSubmit} className="space-y-4">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="label">Class Level ID</label>
//                     <Input
//                       name="class_level"
//                       type="number"
//                       value={formData.class_level || ''}
//                       onChange={handleInputChange}
//                       disabled={saving}
//                     />
//                   </div>
//                   <div>
//                     <label className="label">Stream</label>
//                     <select
//                       name="stream"
//                       value={formData.stream || 'none'}
//                       onChange={handleInputChange}
//                       className="input-field"
//                       disabled={saving}
//                     >
//                       {streamOptions.map((option) => (
//                         <option key={option.value} value={option.value}>
//                           {option.label}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>
                
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="label">Student Category</label>
//                     <select
//                       name="student_category"
//                       value={formData.student_category || 'day'}
//                       onChange={handleInputChange}
//                       className="input-field"
//                       disabled={saving}
//                     >
//                       {studentCategoryOptions.map((option) => (
//                         <option key={option.value} value={option.value}>
//                           {option.label}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                   <div>
//                     <label className="label">House</label>
//                     <select
//                       name="house"
//                       value={formData.house || 'none'}
//                       onChange={handleInputChange}
//                       className="input-field"
//                       disabled={saving}
//                     >
//                       {houseOptions.map((option) => (
//                         <option key={option.value} value={option.value}>
//                           {option.label}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>
                
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="label">Admission Date</label>
//                     <Input
//                       name="admission_date"
//                       type="date"
//                       value={formData.admission_date || ''}
//                       onChange={handleInputChange}
//                       disabled={saving}
//                     />
//                   </div>
//                   <div>
//                     <label className="label">Transportation Mode</label>
//                     <select
//                       name="transportation_mode"
//                       value={formData.transportation_mode || 'parent_drop'}
//                       onChange={handleInputChange}
//                       className="input-field"
//                       disabled={saving}
//                     >
//                       {transportationOptions.map((option) => (
//                         <option key={option.value} value={option.value}>
//                           {option.label}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>
//               </form>
//             ) : (
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="space-y-3">
//                   <div>
//                     <p className="text-sm text-neutral-500">Class Level</p>
//                     <p className="font-medium text-neutral-800">{student.class_level_info?.name || 'Not assigned'}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-neutral-500">Stream</p>
//                     <p className="font-medium text-neutral-800">{student.stream_display || 'Not applicable'}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-neutral-500">Admission Date</p>
//                     <p className="font-medium text-neutral-800">{formatDate(student.admission_date)}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-neutral-500">Admission Number</p>
//                     <p className="font-medium text-neutral-800">{student.admission_number}</p>
//                   </div>
//                 </div>
                
//                 <div className="space-y-3">
//                   <div>
//                     <p className="text-sm text-neutral-500">Student Category</p>
//                     <p className="font-medium text-neutral-800">{student.student_category_display}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-neutral-500">House</p>
//                     <p className="font-medium text-neutral-800">{student.house_display || 'Not assigned'}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-neutral-500">Transportation Mode</p>
//                     <p className="font-medium text-neutral-800">{student.transportation_mode_display}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-neutral-500">Student ID</p>
//                     <p className="font-medium text-neutral-800">{student.student_id}</p>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Right Column - Health, Fees, Documents */}
//         <div className="space-y-8">
//           {/* Health Information Card */}
//           <div className="bg-white rounded-xl shadow-soft p-6 border border-neutral-100">
//             <h3 className="text-xl font-semibold text-neutral-800 flex items-center mb-6">
//               <Heart size={20} className="mr-2 text-red-500" />
//               Health Information
//             </h3>
            
//             {isEditing ? (
//               <form onSubmit={handleSubmit} className="space-y-4">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="label">Blood Group</label>
//                     <select
//                       name="blood_group"
//                       value={formData.blood_group || ''}
//                       onChange={handleInputChange}
//                       className="input-field"
//                       disabled={saving}
//                     >
//                       {bloodGroupOptions.map((option) => (
//                         <option key={option.value} value={option.value}>
//                           {option.label}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                   <div>
//                     <label className="label">Genotype</label>
//                     <select
//                       name="genotype"
//                       value={formData.genotype || ''}
//                       onChange={handleInputChange}
//                       className="input-field"
//                       disabled={saving}
//                     >
//                       {genotypeOptions.map((option) => (
//                         <option key={option.value} value={option.value}>
//                           {option.label}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>
                
//                 <div className="space-y-3">
//                   <div className="flex items-center">
//                     <input
//                       type="checkbox"
//                       id="has_allergies"
//                       name="has_allergies"
//                       checked={formData.has_allergies || false}
//                       onChange={handleInputChange}
//                       className="h-4 w-4 text-secondary-600 rounded"
//                       disabled={saving}
//                     />
//                     <label htmlFor="has_allergies" className="ml-2 text-sm text-neutral-700">
//                       Has Allergies
//                     </label>
//                   </div>
                  
//                   {formData.has_allergies && (
//                     <div>
//                       <label className="label">Allergy Details</label>
//                       <Input
//                         name="allergy_details"
//                         type="textarea"
//                         value={formData.allergy_details || ''}
//                         onChange={handleInputChange}
//                         rows={2}
//                         disabled={saving}
//                       />
//                     </div>
//                   )}
                  
//                   <div className="flex items-center">
//                     <input
//                       type="checkbox"
//                       id="has_learning_difficulties"
//                       name="has_learning_difficulties"
//                       checked={formData.has_learning_difficulties || false}
//                       onChange={handleInputChange}
//                       className="h-4 w-4 text-secondary-600 rounded"
//                       disabled={saving}
//                     />
//                     <label htmlFor="has_learning_difficulties" className="ml-2 text-sm text-neutral-700">
//                       Has Learning Difficulties
//                     </label>
//                   </div>
                  
//                   {formData.has_learning_difficulties && (
//                     <div>
//                       <label className="label">Learning Difficulties Details</label>
//                       <Input
//                         name="learning_difficulties_details"
//                         type="textarea"
//                         value={formData.learning_difficulties_details || ''}
//                         onChange={handleInputChange}
//                         rows={2}
//                         disabled={saving}
//                       />
//                     </div>
//                   )}
//                 </div>
                
//                 <div>
//                   <label className="label">Medical Conditions</label>
//                   <Input
//                     name="medical_conditions"
//                     type="textarea"
//                     value={formData.medical_conditions || ''}
//                     onChange={handleInputChange}
//                     rows={2}
//                     disabled={saving}
//                   />
//                 </div>
//               </form>
//             ) : (
//               <div className="space-y-4">
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <p className="text-sm text-neutral-500">Blood Group</p>
//                     <p className="font-medium text-neutral-800">{student.blood_group || 'Not provided'}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-neutral-500">Genotype</p>
//                     <p className="font-medium text-neutral-800">{student.genotype || 'Not provided'}</p>
//                   </div>
//                 </div>
                
//                 {student.has_allergies && (
//                   <div>
//                     <p className="text-sm text-neutral-500">Allergies</p>
//                     <p className="font-medium text-neutral-800">{student.allergy_details || 'No details provided'}</p>
//                   </div>
//                 )}
                
//                 {student.has_learning_difficulties && (
//                   <div>
//                     <p className="text-sm text-neutral-500">Learning Difficulties</p>
//                     <p className="font-medium text-neutral-800">{student.learning_difficulties_details || 'No details provided'}</p>
//                   </div>
//                 )}
                
//                 {student.medical_conditions && (
//                   <div>
//                     <p className="text-sm text-neutral-500">Medical Conditions</p>
//                     <p className="font-medium text-neutral-800">{student.medical_conditions}</p>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>

//           {/* Fee Information Card */}
//           <div className="bg-white rounded-xl shadow-soft p-6 border border-neutral-100">
//             <h3 className="text-xl font-semibold text-neutral-800 mb-6">Fee Information</h3>
            
//             <div className="space-y-4">
//               <div>
//                 <p className="text-sm text-neutral-500 mb-2">Fee Status</p>
//                 <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getFeeStatusColor(student.fee_status)}`}>
//                   {student.fee_status_display}
//                 </span>
//               </div>
              
//               {student.fee_summary && (
//                 <div className="space-y-3">
//                   <div className="flex justify-between items-center">
//                     <span className="text-neutral-600">Total Fee:</span>
//                     <span className="font-medium text-neutral-800">{formatFee(student.fee_summary.total_fee)}</span>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <span className="text-neutral-600">Amount Paid:</span>
//                     <span className="font-medium text-success-600">{formatFee(student.fee_summary.paid)}</span>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <span className="text-neutral-600">Balance Due:</span>
//                     <span className="font-medium text-red-600">{formatFee(student.fee_summary.balance)}</span>
//                   </div>
//                   <div className="pt-3 border-t border-neutral-200">
//                     <div className="flex justify-between mb-1">
//                       <span className="text-sm text-neutral-600">Payment Progress</span>
//                       <span className="text-sm font-medium">{student.fee_summary.percentage_paid}%</span>
//                     </div>
//                     <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
//                       <div
//                         className="h-full bg-success-500 rounded-full transition-all duration-500"
//                         style={{ width: `${student.fee_summary.percentage_paid}%` }}
//                       />
//                     </div>
//                   </div>
//                 </div>
//               )}
              
//               <Link to={`/students/${id}/fees`}>
//                 <Button fullWidth variant="outline" className="mt-4 border-secondary-200 text-secondary-700 hover:bg-secondary-50">
//                   View Fee Details
//                 </Button>
//               </Link>
//             </div>
//           </div>

//           {/* Document Checklist Card */}
//           <div className="bg-white rounded-xl shadow-soft p-6 border border-neutral-100">
//             <h3 className="text-xl font-semibold text-neutral-800 flex items-center mb-6">
//               <FileText size={20} className="mr-2 text-secondary-600" />
//               Document Checklist
//             </h3>
            
//             <div className="space-y-3">
//               {student.document_checklist && Object.entries(student.document_checklist)
//                 .filter(([key]) => key !== 'all_documents_uploaded')
//                 .map(([document, uploaded]) => (
//                   <div key={document} className="flex items-center justify-between">
//                     <div className="flex items-center">
//                       <div className={`w-3 h-3 rounded-full mr-3 ${uploaded ? 'bg-success-500' : 'bg-neutral-300'}`} />
//                       <span className="text-neutral-700 capitalize">{document.replace('_', ' ')}</span>
//                     </div>
//                     <span className={`text-sm ${uploaded ? 'text-success-600' : 'text-neutral-500'}`}>
//                       {uploaded ? 'Uploaded' : 'Pending'}
//                     </span>
//                   </div>
//                 ))}
              
//               <div className="pt-4 border-t border-neutral-200">
//                 <div className="flex items-center justify-between">
//                   <span className="font-medium text-neutral-700">Overall Status:</span>
//                   <span className={`px-3 py-1 rounded-full text-sm font-medium ${
//                     student.document_checklist?.all_documents_uploaded 
//                       ? 'bg-success-100 text-success-800' 
//                       : 'bg-accent-100 text-accent-800'
//                   }`}>
//                     {student.document_checklist?.all_documents_uploaded ? 'Complete' : 'Incomplete'}
//                   </span>
//                 </div>
//               </div>
              
//               {canEditStudent() && (
//                 <Button
//                   fullWidth
//                   variant="outline"
//                   className="mt-4 border-secondary-200 text-secondary-700 hover:bg-secondary-50"
//                   onClick={() => setShowDocumentModal(true)}
//                 >
//                   <Upload size={16} className="mr-2" />
//                   Upload Document
//                 </Button>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Document Upload Modal */}
//       {showDocumentModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-2xl shadow-strong border border-neutral-200 w-full max-w-md animate-slide-down">
//             <div className="p-6">
//               <div className="flex justify-between items-center mb-6">
//                 <h3 className="text-xl font-bold text-neutral-800">Upload Document</h3>
//                 <button
//                   onClick={() => setShowDocumentModal(false)}
//                   className="text-neutral-400 hover:text-neutral-600"
//                 >
//                   <X size={24} />
//                 </button>
//               </div>
              
//               <form onSubmit={handleDocumentUpload}>
//                 <div className="space-y-4">
//                   <div>
//                     <label className="label">Document Type</label>
//                     <select
//                       value={documentData.document_type}
//                       onChange={(e) => setDocumentData(prev => ({ ...prev, document_type: e.target.value }))}
//                       className="input-field"
//                       disabled={uploading}
//                     >
//                       {documentTypeOptions.map((option) => (
//                         <option key={option.value} value={option.value}>
//                           {option.label}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
                  
//                   <div>
//                     <label className="label">Select Document</label>
//                     <div className="mt-1">
//                       <input
//                         type="file"
//                         onChange={handleFileChange}
//                         className="input-field"
//                         disabled={uploading}
//                         accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
//                       />
//                       <p className="mt-1 text-xs text-neutral-500">
//                         Accepted formats: PDF, JPG, PNG, DOC, DOCX (Max 5MB)
//                       </p>
//                     </div>
//                   </div>
                  
//                   {documentData.document && (
//                     <div className="p-3 bg-neutral-50 rounded-lg">
//                       <p className="text-sm text-neutral-700">
//                         Selected file: <span className="font-medium">{documentData.document.name}</span>
//                       </p>
//                       <p className="text-xs text-neutral-500 mt-1">
//                         Size: {(documentData.document.size / 1024 / 1024).toFixed(2)} MB
//                       </p>
//                     </div>
//                   )}
//                 </div>
                
//                 <div className="flex space-x-4 mt-8">
//                   <button
//                     type="button"
//                     onClick={() => setShowDocumentModal(false)}
//                     className="flex-1 px-4 py-2.5 border border-neutral-300 rounded-lg hover:bg-neutral-50 text-neutral-700 transition-colors"
//                     disabled={uploading}
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="flex-1 px-4 py-2.5 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors"
//                     disabled={uploading || !documentData.document}
//                   >
//                     {uploading ? 'Uploading...' : 'Upload Document'}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}
//     </DashboardLayout>
//   );
// };

// export default StudentDetail;

/**
 * Student Detail Page - FULL REWRITE
 * Rich view with all student data, same quality as StudentList view modal
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import Alert from '../components/common/Alert';
import Button from '../components/common/Button';
import Modal from '../components/common/modal';
import useAuth from '../hooks/useAuth';
import {
  getStudentById,
  updateStudent,
  uploadStudentDocument,
  updateStudentPassword,
  deleteStudent,
} from '../services/studentService';
import { handleApiError } from '../services/api';
import {
  ArrowLeft, Edit2, Trash2, Lock, Printer, Upload,
  User, BookOpen, DollarSign, Heart, FileText, Activity,
  CheckCircle, XCircle, Clock, Award, UserCheck, UserX,
  Shield, Phone, Mail, MapPin, Calendar, Home, School,
  Save, X, RefreshCw
} from 'lucide-react';

// =====================
// HELPER COMPONENTS
// =====================
const Section = ({ title, icon, children }) => (
  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
    <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
      <h4 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
        {icon && <span className="text-gray-500">{icon}</span>}
        {title}
      </h4>
    </div>
    <div className="p-5">{children}</div>
  </div>
);

const InfoRow = ({ label, value, fullWidth = false }) => (
  <div className={fullWidth ? 'col-span-full' : ''}>
    <div className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wide">{label}</div>
    <div className="text-sm font-medium text-gray-900 bg-gray-50 px-3 py-2 rounded border border-gray-200 break-words min-h-[36px]">
      {value || <span className="text-gray-400 italic">Not provided</span>}
    </div>
  </div>
);

const StudentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Permissions
  const isAdmin = user?.role === 'head' || user?.role === 'hm' ||
    user?.role === 'principal' || user?.role === 'vice_principal' || user?.is_staff;
  const canEdit = isAdmin || ['accountant', 'secretary', 'teacher', 'form_teacher', 'subject_teacher'].includes(user?.role);

  // Core state
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Edit form
  const [editForm, setEditForm] = useState({});
  const [editLoading, setEditLoading] = useState(false);
  const [editErrors, setEditErrors] = useState({});

  // Password form
  const [passwordForm, setPasswordForm] = useState({ new_password: '', confirm_password: '' });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState({});

  // Document upload
  const [documentData, setDocumentData] = useState({ document_type: 'student_image', document: null });
  const [uploading, setUploading] = useState(false);

  // =====================
  // FETCH STUDENT
  // =====================
  useEffect(() => {
    if (id) fetchStudent();
  }, [id]);

  const fetchStudent = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getStudentById(id);
      const data = response?.student || response;
      setStudent(data);
      populateEditForm(data);
    } catch (err) {
      setError(handleApiError(err) || 'Failed to load student');
    } finally {
      setLoading(false);
    }
  };

  const populateEditForm = (data) => {
    const u = data?.user || {};
    setEditForm({
      first_name: u.first_name || '',
      last_name: u.last_name || '',
      email: u.email || '',
      phone_number: u.phone_number || '',
      gender: u.gender || '',
      date_of_birth: u.date_of_birth || '',
      address: u.address || '',
      city: u.city || '',
      state_of_origin: u.state_of_origin || '',
      lga: u.lga || '',
      nationality: u.nationality || 'Nigerian',
      class_level: data?.class_level_info?.id || data?.class_level || '',
      stream: data?.stream || '',
      student_category: data?.student_category || '',
      house: data?.house || '',
      admission_date: data?.admission_date || '',
      fee_status: data?.fee_status || 'not_paid',
      total_fee_amount: data?.total_fee_amount || '',
      amount_paid: data?.amount_paid || '',
      blood_group: data?.blood_group || '',
      genotype: data?.genotype || '',
      has_allergies: data?.has_allergies || false,
      allergy_details: data?.allergy_details || '',
      has_received_vaccinations: data?.has_received_vaccinations !== undefined ? data.has_received_vaccinations : true,
      medical_conditions: data?.medical_conditions || '',
      has_learning_difficulties: data?.has_learning_difficulties || false,
      learning_difficulties_details: data?.learning_difficulties_details || '',
      emergency_contact_name: data?.emergency_contact_name || '',
      emergency_contact_phone: data?.emergency_contact_phone || '',
      emergency_contact_relationship: data?.emergency_contact_relationship || '',
      transportation_mode: data?.transportation_mode || '',
      bus_route: data?.bus_route || '',
      is_prefect: data?.is_prefect || false,
      prefect_role: data?.prefect_role || '',
      place_of_birth: data?.place_of_birth || '',
      home_language: data?.home_language || '',
      previous_school: data?.previous_school || '',
      previous_class: data?.previous_class || '',
      transfer_certificate_no: data?.transfer_certificate_no || '',
      family_doctor_name: data?.family_doctor_name || '',
      family_doctor_phone: data?.family_doctor_phone || '',
      is_active: data?.is_active !== undefined ? data.is_active : true,
      is_graduated: data?.is_graduated || false,
      graduation_date: data?.graduation_date || '',
    });
  };

  // =====================
  // DERIVED DATA
  // =====================
  const getStudentData = () => {
    if (!student) return {};
    const u = student.user || {};
    return {
      fullName: `${u.first_name || ''} ${u.last_name || ''}`.trim() || 'Unknown Student',
      firstName: u.first_name || '',
      lastName: u.last_name || '',
      email: u.email || '',
      phone: u.phone_number || '',
      gender: u.gender ? u.gender.charAt(0).toUpperCase() + u.gender.slice(1) : '',
      dob: u.date_of_birth || '',
      address: u.address || '',
      city: u.city || '',
      lga: u.lga || '',
      state: u.state_of_origin || '',
      nationality: u.nationality || '',
      regNo: u.registration_number || '',
      classLevel: student.class_level_info?.name || student.class_level?.name || 'Not assigned',
      stream: {
        science: 'Science', commercial: 'Commercial', art: 'Arts/Humanities',
        technical: 'Technical', general: 'General', none: 'No Stream'
      }[student.stream] || 'No Stream',
      category: {
        day: 'Day Student', boarding: 'Boarding', special_needs: 'Special Needs',
        scholarship: 'Scholarship', repeat: 'Repeating', new: 'New Student'
      }[student.student_category] || student.student_category || '',
      house: student.house || 'None',
      transport: {
        school_bus: 'School Bus', parent_drop: 'Parent Drop-off',
        public_transport: 'Public Transport', walk: 'Walks to School'
      }[student.transportation_mode] || 'Other',
      totalFee: Number(student.total_fee_amount || 0),
      amountPaid: Number(student.amount_paid || 0),
      balanceDue: Number(student.balance_due ?? (Number(student.total_fee_amount || 0) - Number(student.amount_paid || 0))),
      imageUrl: student.student_image_url || student.student_image || null,
    };
  };

  const calculateAge = (dob) => {
    if (!dob) return '';
    const diff = Date.now() - new Date(dob).getTime();
    return `${Math.abs(new Date(diff).getUTCFullYear() - 1970)} years`;
  };

  const formatDate = (d) => {
    if (!d) return '';
    return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  // =====================
  // STATUS BADGES
  // =====================
  const StatusBadge = () => {
    if (!student?.is_active)
      return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"><UserX size={11} />Inactive</span>;
    if (student?.is_graduated)
      return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"><Award size={11} />Graduated</span>;
    return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><UserCheck size={11} />Active</span>;
  };

  const FeeBadge = () => {
    const cfg = {
      paid_full: { bg: 'bg-green-100', text: 'text-green-800', label: 'Fully Paid', icon: <CheckCircle size={11} /> },
      paid_partial: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Partially Paid', icon: <Clock size={11} /> },
      not_paid: { bg: 'bg-red-100', text: 'text-red-800', label: 'Not Paid', icon: <XCircle size={11} /> },
      scholarship: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Scholarship', icon: <Shield size={11} /> },
      exempted: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Exempted', icon: <Shield size={11} /> },
    }[student?.fee_status] || { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Unknown', icon: null };
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.bg} ${cfg.text}`}>
        {cfg.icon}{cfg.label}
      </span>
    );
  };

  // =====================
  // PRINT
  // =====================
  const handlePrint = () => {
    if (!student) return;
    const d = getStudentData();
    const win = window.open('', '_blank');
    win.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${d.fullName} - Student Record</title>
    <style>
      *{margin:0;padding:0;box-sizing:border-box}
      body{font-family:Arial,sans-serif;line-height:1.5;color:#333;padding:20px}
      .header{text-align:center;border-bottom:3px solid #003366;padding-bottom:15px;margin-bottom:20px}
      .school-name{font-size:24px;font-weight:bold;color:#003366}
      .student-header{background:#f8f9fa;padding:15px;border-radius:8px;margin-bottom:20px;display:flex;align-items:flex-start;border:1px solid #e0e0e0}
      .photo{width:90px;height:90px;border-radius:8px;object-fit:cover;margin-right:15px;border:2px solid white}
      .photo-placeholder{width:90px;height:90px;border-radius:8px;background:#e3f2fd;display:flex;align-items:center;justify-content:center;margin-right:15px;font-size:40px;font-weight:bold;color:#1976d2}
      .student-name{font-size:20px;font-weight:bold;color:#003366;margin-bottom:8px}
      .section{margin-bottom:20px;page-break-inside:avoid}
      .section-title{font-size:15px;font-weight:bold;color:#003366;margin-bottom:10px;padding-bottom:5px;border-bottom:2px solid #e0e0e0}
      .two-col{display:grid;grid-template-columns:1fr 1fr;gap:15px;margin-bottom:15px}
      .info-box{padding:12px;border:1px solid #e0e0e0;border-radius:6px}
      .info-row{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #f5f5f5;font-size:13px}
      .info-row:last-child{border-bottom:none}
      .label{color:#666;font-weight:500}
      .value{color:#333;font-weight:600}
      .fee-cards{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:10px}
      .fee-card{text-align:center;padding:12px;border-radius:6px}
      .fee-card.blue{background:#e3f2fd}.fee-card.green{background:#e8f5e9}.fee-card.red{background:#ffebee}
      .fee-amount{font-size:18px;font-weight:bold}
      .fee-amount.blue{color:#1976d2}.fee-amount.green{color:#388e3c}.fee-amount.red{color:#c62828}
      .fee-label{font-size:11px;color:#666;margin-bottom:4px}
      .footer{margin-top:25px;padding-top:15px;border-top:2px solid #e0e0e0;text-align:center;font-size:10px;color:#888}
      @media print{body{padding:0}.section{page-break-inside:avoid}}
    </style></head><body>
    <div class="header">
      <div class="school-name">CONCORD TUTOR SCHOOL</div>
      <div style="font-size:14px;color:#666;margin-top:4px">Complete Student Record — Official Document</div>
    </div>
    <div class="student-header">
      ${d.imageUrl ? `<img src="${d.imageUrl}" class="photo" onerror="this.style.display='none'">` : `<div class="photo-placeholder">${d.fullName.charAt(0)}</div>`}
      <div>
        <div class="student-name">${d.fullName}</div>
        <div style="font-size:13px;color:#555;margin-bottom:6px">
          <span>Reg: ${d.regNo}</span> &nbsp;|&nbsp;
          <span>Adm: ${student.admission_number || 'N/A'}</span> &nbsp;|&nbsp;
          <span>ID: ${student.student_id || 'N/A'}</span>
        </div>
        <div style="font-size:13px;color:#555">
          <span>${d.classLevel}</span> &nbsp;|&nbsp;
          <span>${d.stream}</span> &nbsp;|&nbsp;
          <span>${student.is_active ? 'Active' : 'Inactive'}</span>
        </div>
      </div>
    </div>
    <div class="section">
      <div class="section-title">Personal Information</div>
      <div class="two-col">
        <div class="info-box">
          <div class="info-row"><span class="label">Full Name</span><span class="value">${d.fullName}</span></div>
          <div class="info-row"><span class="label">Gender</span><span class="value">${d.gender || 'N/A'}</span></div>
          <div class="info-row"><span class="label">Date of Birth</span><span class="value">${d.dob || 'N/A'}</span></div>
          <div class="info-row"><span class="label">Age</span><span class="value">${calculateAge(d.dob) || 'N/A'}</span></div>
        </div>
        <div class="info-box">
          <div class="info-row"><span class="label">Email</span><span class="value">${d.email || 'N/A'}</span></div>
          <div class="info-row"><span class="label">Phone</span><span class="value">${d.phone || 'N/A'}</span></div>
          <div class="info-row"><span class="label">Nationality</span><span class="value">${d.nationality || 'Nigerian'}</span></div>
          <div class="info-row"><span class="label">State of Origin</span><span class="value">${d.state || 'N/A'}</span></div>
        </div>
      </div>
      <div class="info-box">
        <div class="info-row"><span class="label">Address</span><span class="value">${d.address || 'N/A'}</span></div>
        <div class="info-row"><span class="label">City / LGA</span><span class="value">${d.city || ''} / ${d.lga || ''}</span></div>
      </div>
    </div>
    <div class="section">
      <div class="section-title">Academic Information</div>
      <div class="two-col">
        <div class="info-box">
          <div class="info-row"><span class="label">Class Level</span><span class="value">${d.classLevel}</span></div>
          <div class="info-row"><span class="label">Stream</span><span class="value">${d.stream}</span></div>
          <div class="info-row"><span class="label">House</span><span class="value">${d.house}</span></div>
          <div class="info-row"><span class="label">Category</span><span class="value">${d.category}</span></div>
        </div>
        <div class="info-box">
          <div class="info-row"><span class="label">Admission Date</span><span class="value">${student.admission_date || 'N/A'}</span></div>
          <div class="info-row"><span class="label">Previous School</span><span class="value">${student.previous_school || 'N/A'}</span></div>
          <div class="info-row"><span class="label">Transportation</span><span class="value">${d.transport}</span></div>
          <div class="info-row"><span class="label">Bus Route</span><span class="value">${student.bus_route || 'N/A'}</span></div>
        </div>
      </div>
    </div>
    <div class="section">
      <div class="section-title">Financial Information</div>
      <div class="fee-cards">
        <div class="fee-card blue"><div class="fee-label">Total Fee</div><div class="fee-amount blue">₦${d.totalFee.toLocaleString()}</div></div>
        <div class="fee-card green"><div class="fee-label">Amount Paid</div><div class="fee-amount green">₦${d.amountPaid.toLocaleString()}</div></div>
        <div class="fee-card red"><div class="fee-label">Balance Due</div><div class="fee-amount red">₦${d.balanceDue.toLocaleString()}</div></div>
      </div>
      <div class="info-box"><div class="info-row"><span class="label">Fee Status</span><span class="value">${student.fee_status || 'not_paid'}</span></div></div>
    </div>
    <div class="section">
      <div class="section-title">Health Information</div>
      <div class="two-col">
        <div class="info-box">
          <div class="info-row"><span class="label">Blood Group</span><span class="value">${student.blood_group || 'N/A'}</span></div>
          <div class="info-row"><span class="label">Genotype</span><span class="value">${student.genotype || 'N/A'}</span></div>
          <div class="info-row"><span class="label">Allergies</span><span class="value">${student.has_allergies ? 'Yes' : 'No'}</span></div>
          <div class="info-row"><span class="label">Vaccinations</span><span class="value">${student.has_received_vaccinations ? 'Complete' : 'Incomplete'}</span></div>
        </div>
        <div class="info-box">
          <div class="info-row"><span class="label">Family Doctor</span><span class="value">${student.family_doctor_name || 'N/A'}</span></div>
          <div class="info-row"><span class="label">Doctor Phone</span><span class="value">${student.family_doctor_phone || 'N/A'}</span></div>
          <div class="info-row"><span class="label">Medical Conditions</span><span class="value">${student.medical_conditions || 'None'}</span></div>
        </div>
      </div>
    </div>
    <div class="section">
      <div class="section-title">Emergency Contact</div>
      <div class="info-box">
        <div class="info-row"><span class="label">Name</span><span class="value">${student.emergency_contact_name || 'N/A'}</span></div>
        <div class="info-row"><span class="label">Relationship</span><span class="value">${student.emergency_contact_relationship || 'N/A'}</span></div>
        <div class="info-row"><span class="label">Phone</span><span class="value">${student.emergency_contact_phone || 'N/A'}</span></div>
      </div>
    </div>
    <div class="footer">
      <p>Official Student Record — CONCORD TUTOR SCHOOL</p>
      <p>Generated on ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
    </div>
    </body></html>`);
    win.document.close();
    win.onload = () => win.print();
  };

  // =====================
  // EDIT SUBMIT
  // =====================
  const handleEditChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: type === 'file' ? files[0] : type === 'checkbox' ? checked : value
    }));
    if (editErrors[name]) setEditErrors(prev => ({ ...prev, [name]: '' }));
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!editForm.first_name?.trim()) errors.first_name = 'Required';
    if (!editForm.last_name?.trim()) errors.last_name = 'Required';
    if (!editForm.class_level) errors.class_level = 'Required';
    setEditErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      setEditLoading(true);
      setError('');
      await updateStudent(id, editForm);
      setSuccess('Student updated successfully!');
      setShowEditModal(false);
      fetchStudent();
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(handleApiError(err) || 'Update failed');
    } finally {
      setEditLoading(false);
    }
  };

  // =====================
  // PASSWORD RESET
  // =====================
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
    if (passwordErrors[name]) setPasswordErrors(prev => ({ ...prev, [name]: '' }));
  };

  const submitPassword = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!passwordForm.new_password) errors.new_password = 'Required';
    if (!passwordForm.confirm_password) errors.confirm_password = 'Required';
    if (passwordForm.new_password !== passwordForm.confirm_password) errors.confirm_password = 'Passwords do not match';
    if (passwordForm.new_password && passwordForm.new_password.length < 5) errors.new_password = 'Minimum 5 characters';
    setPasswordErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      setPasswordLoading(true);
      setError('');
      await updateStudentPassword(id, passwordForm);
      setSuccess('Password reset successfully!');
      setShowPasswordModal(false);
      setPasswordForm({ new_password: '', confirm_password: '' });
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(handleApiError(err) || 'Password reset failed');
    } finally {
      setPasswordLoading(false);
    }
  };

  // =====================
  // DELETE
  // =====================
  const confirmDelete = async () => {
    try {
      setError('');
      await deleteStudent(id);
      navigate('/students');
    } catch (err) {
      setError(handleApiError(err) || 'Delete failed');
      setShowDeleteModal(false);
    }
  };

  // =====================
  // DOCUMENT UPLOAD
  // =====================
  const submitDocument = async (e) => {
    e.preventDefault();
    if (!documentData.document) { setError('Please select a file'); return; }
    try {
      setUploading(true);
      setError('');
      await uploadStudentDocument(id, documentData);
      setSuccess('Document uploaded!');
      setShowDocumentModal(false);
      setDocumentData({ document_type: 'student_image', document: null });
      fetchStudent();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(handleApiError(err) || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  // =====================
  // LOADING / ERROR STATES
  // =====================
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary-500 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading student profile...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error && !student) {
    return (
      <DashboardLayout>
        <div className="max-w-md mx-auto mt-16 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle size={28} className="text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Failed to Load Student</h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <Button onClick={fetchStudent} className="bg-secondary-500 hover:bg-secondary-600 text-white">
              <RefreshCw size={16} className="mr-2" /> Retry
            </Button>
            <Link to="/students">
              <Button className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50">
                <ArrowLeft size={16} className="mr-2" /> Back to Students
              </Button>
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!student) return null;

  const d = getStudentData();

  const documentStatus = {
    birth_certificate: student.birth_certificate_uploaded || !!student.birth_certificate_url,
    student_image: student.student_image_uploaded || !!student.student_image_url,
    immunization_record: student.immunization_record_uploaded || !!student.immunization_record_url,
    previous_school_report: student.previous_school_report_uploaded || !!student.previous_school_report_url,
    parent_id_copy: student.parent_id_copy_uploaded || !!student.parent_id_copy_url,
  };

  // =====================
  // MAIN RENDER
  // =====================
  return (
    <DashboardLayout>
      {/* Alerts */}
      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} className="mb-4" />}
      {error && <Alert type="error" message={error} onClose={() => setError('')} className="mb-4" />}

      {/* Back Navigation */}
      <div className="mb-6">
        <Link to="/students" className="inline-flex items-center text-secondary-600 hover:text-secondary-700 text-sm font-medium transition-colors">
          <ArrowLeft size={16} className="mr-1.5" /> Back to Students
        </Link>
      </div>

      {/* ===================== PROFILE HEADER ===================== */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {/* Photo */}
          <div className="w-20 h-20 rounded-xl bg-secondary-100 flex items-center justify-center overflow-hidden border-2 border-white shadow flex-shrink-0">
            {d.imageUrl ? (
              <img src={d.imageUrl} alt={d.fullName} className="w-full h-full object-cover"
                onError={(e) => { e.target.style.display = 'none'; }} />
            ) : (
              <span className="text-2xl font-bold text-secondary-600">{d.fullName.charAt(0)}</span>
            )}
          </div>

          {/* Name & badges */}
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-gray-900">{d.fullName}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                {student.admission_number || 'No Admission No'}
              </span>
              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                {student.student_id || 'No Student ID'}
              </span>
              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                {d.regNo}
              </span>
              <StatusBadge />
              <FeeBadge />
            </div>
            <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <BookOpen size={14} /> {d.classLevel}
              </span>
              <span className="text-gray-300">|</span>
              <span>{d.stream}</span>
              <span className="text-gray-300">|</span>
              <span>{d.category}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2 flex-shrink-0">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <Printer size={15} /> Print
            </button>
            {canEdit && (
              <button
                onClick={() => setShowEditModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-secondary-600 hover:bg-secondary-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <Edit2 size={15} /> Edit
              </button>
            )}
            {isAdmin && (
              <>
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  <Lock size={15} /> Password
                </button>
                <button
                  onClick={() => setShowDocumentModal(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  <Upload size={15} /> Document
                </button>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  <Trash2 size={15} /> Delete
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ===================== CONTENT GRID ===================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT — 2 cols */}
        <div className="lg:col-span-2 space-y-6">

          {/* Personal Information */}
          <Section title="Personal Information" icon={<User size={15} />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoRow label="First Name" value={d.firstName} />
              <InfoRow label="Last Name" value={d.lastName} />
              <InfoRow label="Email" value={d.email} />
              <InfoRow label="Phone" value={d.phone} />
              <InfoRow label="Gender" value={d.gender} />
              <InfoRow label="Date of Birth" value={d.dob ? `${formatDate(d.dob)} (${calculateAge(d.dob)})` : ''} />
              <InfoRow label="Nationality" value={d.nationality} />
              <InfoRow label="State of Origin" value={d.state} />
              <InfoRow label="LGA" value={d.lga} />
              <InfoRow label="City" value={d.city} />
            </div>
            <div className="mt-4">
              <InfoRow label="Address" value={d.address} fullWidth />
            </div>
          </Section>

          {/* Academic Information */}
          <Section title="Academic Information" icon={<BookOpen size={15} />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoRow label="Class Level" value={d.classLevel} />
              <InfoRow label="Stream" value={d.stream} />
              <InfoRow label="Student Category" value={d.category} />
              <InfoRow label="House" value={d.house} />
              <InfoRow label="Admission Number" value={student.admission_number} />
              <InfoRow label="Student ID" value={student.student_id} />
              <InfoRow label="Registration Number" value={d.regNo} />
              <InfoRow label="Admission Date" value={formatDate(student.admission_date)} />
              <InfoRow label="Previous School" value={student.previous_school} />
              <InfoRow label="Previous Class" value={student.previous_class} />
              <InfoRow label="Transfer Certificate No" value={student.transfer_certificate_no} />
              <InfoRow label="Place of Birth" value={student.place_of_birth} />
              <InfoRow label="Home Language" value={student.home_language} />
              <InfoRow label="Transportation Mode" value={d.transport} />
              <InfoRow label="Bus Route" value={student.bus_route} />
            </div>
            {student.is_prefect && (
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-1">Prefect Role</div>
                <div className="text-sm font-medium text-amber-900">{student.prefect_role || 'School Prefect'}</div>
              </div>
            )}
          </Section>

          {/* Health Information */}
          <Section title="Health Information" icon={<Heart size={15} />}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              {[
                { label: 'Blood Group', value: student.blood_group },
                { label: 'Genotype', value: student.genotype },
                { label: 'Allergies', value: student.has_allergies ? 'Yes' : 'No' },
                { label: 'Vaccinations', value: student.has_received_vaccinations ? 'Complete' : 'Incomplete' },
              ].map((item, i) => (
                <div key={i} className="bg-red-50 p-3 rounded-lg border border-red-100">
                  <div className="text-xs text-red-700 font-medium mb-1">{item.label}</div>
                  <div className="text-sm font-semibold text-gray-900">{item.value || '—'}</div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {student.has_allergies && <InfoRow label="Allergy Details" value={student.allergy_details} />}
              <InfoRow label="Medical Conditions" value={student.medical_conditions} />
              <InfoRow label="Family Doctor" value={student.family_doctor_name} />
              <InfoRow label="Doctor Phone" value={student.family_doctor_phone} />
              {student.has_learning_difficulties && (
                <InfoRow label="Learning Difficulties" value={student.learning_difficulties_details} />
              )}
            </div>
          </Section>

          {/* Emergency Contact */}
          <Section title="Emergency Contact" icon={<Phone size={15} />}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InfoRow label="Contact Name" value={student.emergency_contact_name} />
              <InfoRow label="Relationship" value={student.emergency_contact_relationship} />
              <InfoRow label="Phone Number" value={student.emergency_contact_phone} />
            </div>
          </Section>
        </div>

        {/* RIGHT — 1 col */}
        <div className="space-y-6">

          {/* Financial Summary */}
          <Section title="Financial Information" icon={<DollarSign size={15} />}>
            <div className="space-y-3 mb-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                <div className="text-xs text-blue-700 font-medium mb-1">Balance Due</div>
                <div className="text-2xl font-bold text-blue-800">
                  ₦{d.balanceDue.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
                  <div className="text-xs text-gray-600 font-medium mb-1">Total Fee</div>
                  <div className="text-base font-bold text-gray-800">
                    ₦{d.totalFee.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                  </div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                  <div className="text-xs text-green-700 font-medium mb-1">Amount Paid</div>
                  <div className="text-base font-bold text-green-700">
                    ₦{d.amountPaid.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                  </div>
                </div>
              </div>
            </div>
            {d.totalFee > 0 && (
              <div>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Payment Progress</span>
                  <span>{Math.round((d.amountPaid / d.totalFee) * 100)}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (d.amountPaid / d.totalFee) * 100)}%` }}
                  />
                </div>
              </div>
            )}
            <div className="mt-4">
              <FeeBadge />
            </div>
          </Section>

          {/* Document Status */}
          <Section title="Document Status" icon={<FileText size={15} />}>
            <div className="space-y-2">
              {[
                { label: 'Student Photo', key: 'student_image' },
                { label: 'Birth Certificate', key: 'birth_certificate' },
                { label: 'Immunization Record', key: 'immunization_record' },
                { label: 'School Report', key: 'previous_school_report' },
                { label: 'Parent ID Copy', key: 'parent_id_copy' },
              ].map((doc) => (
                <div key={doc.key} className={`flex items-center justify-between p-3 rounded-lg border ${documentStatus[doc.key] ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                  <span className="text-sm font-medium text-gray-800">{doc.label}</span>
                  <div className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${documentStatus[doc.key] ? 'bg-green-500' : 'bg-red-400'}`}></div>
                    <span className={`text-xs font-medium ${documentStatus[doc.key] ? 'text-green-600' : 'text-red-500'}`}>
                      {documentStatus[doc.key] ? 'Uploaded' : 'Pending'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Overall Status</span>
                <span className={`font-medium ${Object.values(documentStatus).every(Boolean) ? 'text-green-600' : 'text-amber-600'}`}>
                  {Object.values(documentStatus).filter(Boolean).length}/5 Complete
                </span>
              </div>
            </div>
            {canEdit && (
              <button
                onClick={() => setShowDocumentModal(true)}
                className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2 border border-secondary-300 text-secondary-700 hover:bg-secondary-50 text-sm font-medium rounded-lg transition-colors"
              >
                <Upload size={15} /> Upload Document
              </button>
            )}
          </Section>

          {/* Status Card */}
          <Section title="Account Status" icon={<Activity size={15} />}>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Active Status</span>
                <StatusBadge />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Graduation</span>
                <span className={`text-sm font-medium ${student.is_graduated ? 'text-purple-600' : 'text-gray-500'}`}>
                  {student.is_graduated ? 'Graduated' : 'Not Graduated'}
                </span>
              </div>
              {student.is_graduated && student.graduation_date && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Graduation Date</span>
                  <span className="text-sm font-medium text-gray-800">{formatDate(student.graduation_date)}</span>
                </div>
              )}
              {student.is_prefect && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Prefect Role</span>
                  <span className="text-sm font-medium text-amber-700">{student.prefect_role || 'Prefect'}</span>
                </div>
              )}
            </div>
          </Section>
        </div>
      </div>

      {/* ===================== EDIT MODAL ===================== */}
      {showEditModal && (
        <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Student" size="6xl">
          <form onSubmit={submitEdit} className="py-4 max-h-[70vh] overflow-y-auto space-y-6">
            {/* Personal */}
            <div>
              <h4 className="text-base font-semibold text-gray-800 mb-3 pb-2 border-b">Personal Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: 'first_name', label: 'First Name', required: true, type: 'text' },
                  { name: 'last_name', label: 'Last Name', required: true, type: 'text' },
                  { name: 'email', label: 'Email', type: 'email' },
                  { name: 'phone_number', label: 'Phone', type: 'tel' },
                  { name: 'date_of_birth', label: 'Date of Birth', type: 'date' },
                ].map(f => (
                  <div key={f.name}>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">{f.label}{f.required && <span className="text-red-500 ml-1">*</span>}</label>
                    <input type={f.type} name={f.name} value={editForm[f.name] || ''} onChange={handleEditChange}
                      className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary-500 ${editErrors[f.name] ? 'border-red-400' : 'border-gray-300'}`}
                      disabled={editLoading} />
                    {editErrors[f.name] && <p className="mt-1 text-xs text-red-600">{editErrors[f.name]}</p>}
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Gender</label>
                  <select name="gender" value={editForm.gender || ''} onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary-500" disabled={editLoading}>
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {[
                  { name: 'address', label: 'Address' },
                  { name: 'city', label: 'City' },
                  { name: 'lga', label: 'LGA' },
                  { name: 'nationality', label: 'Nationality' },
                ].map(f => (
                  <div key={f.name}>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">{f.label}</label>
                    <input type="text" name={f.name} value={editForm[f.name] || ''} onChange={handleEditChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary-500" disabled={editLoading} />
                  </div>
                ))}
              </div>
            </div>

            {/* Academic */}
            <div>
              <h4 className="text-base font-semibold text-gray-800 mb-3 pb-2 border-b">Academic Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Stream</label>
                  <select name="stream" value={editForm.stream || ''} onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary-500" disabled={editLoading}>
                    <option value="none">No Stream</option>
                    <option value="science">Science</option>
                    <option value="commercial">Commercial</option>
                    <option value="art">Arts/Humanities</option>
                    <option value="general">General</option>
                    <option value="technical">Technical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Student Category</label>
                  <select name="student_category" value={editForm.student_category || ''} onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary-500" disabled={editLoading}>
                    <option value="day">Day Student</option>
                    <option value="boarding">Boarding</option>
                    <option value="special_needs">Special Needs</option>
                    <option value="scholarship">Scholarship</option>
                    <option value="repeat">Repeating</option>
                    <option value="new">New Student</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">House</label>
                  <select name="house" value={editForm.house || ''} onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary-500" disabled={editLoading}>
                    <option value="none">None</option>
                    <option value="red">Red</option>
                    <option value="blue">Blue</option>
                    <option value="green">Green</option>
                    <option value="yellow">Yellow</option>
                    <option value="purple">Purple</option>
                    <option value="orange">Orange</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Transportation</label>
                  <select name="transportation_mode" value={editForm.transportation_mode || ''} onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary-500" disabled={editLoading}>
                    <option value="parent_drop">Parent Drop-off</option>
                    <option value="school_bus">School Bus</option>
                    <option value="public_transport">Public Transport</option>
                    <option value="walk">Walk</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Admission Date</label>
                  <input type="date" name="admission_date" value={editForm.admission_date || ''} onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary-500" disabled={editLoading} />
                </div>
              </div>
            </div>

            {/* Fees */}
            <div>
              <h4 className="text-base font-semibold text-gray-800 mb-3 pb-2 border-b">Fee Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Fee Status</label>
                  <select name="fee_status" value={editForm.fee_status || 'not_paid'} onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary-500" disabled={editLoading}>
                    <option value="not_paid">Not Paid</option>
                    <option value="paid_full">Paid in Full</option>
                    <option value="paid_partial">Partially Paid</option>
                    <option value="scholarship">Scholarship</option>
                    <option value="exempted">Exempted</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Total Fee (₦)</label>
                  <input type="number" name="total_fee_amount" value={editForm.total_fee_amount || ''} onChange={handleEditChange} min="0" step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary-500" disabled={editLoading} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Amount Paid (₦)</label>
                  <input type="number" name="amount_paid" value={editForm.amount_paid || ''} onChange={handleEditChange} min="0" step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary-500" disabled={editLoading} />
                </div>
              </div>
            </div>

            {/* Status */}
            <div>
              <h4 className="text-base font-semibold text-gray-800 mb-3 pb-2 border-b">Status</h4>
              <div className="flex flex-wrap gap-6">
                {[
                  { name: 'is_active', label: 'Student is Active' },
                  { name: 'is_graduated', label: 'Student has Graduated' },
                  { name: 'is_prefect', label: 'Is Prefect' },
                  { name: 'has_allergies', label: 'Has Allergies' },
                  { name: 'has_received_vaccinations', label: 'Vaccinations Complete' },
                  { name: 'has_learning_difficulties', label: 'Has Learning Difficulties' },
                ].map(f => (
                  <label key={f.name} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input type="checkbox" name={f.name} checked={!!editForm[f.name]} onChange={handleEditChange}
                      className="h-4 w-4 text-secondary-600 rounded" disabled={editLoading} />
                    {f.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4 border-t sticky bottom-0 bg-white">
              <button type="button" onClick={() => setShowEditModal(false)}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors" disabled={editLoading}>
                Cancel
              </button>
              <button type="submit"
                className="flex-1 px-4 py-2.5 bg-secondary-600 hover:bg-secondary-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                disabled={editLoading}>
                {editLoading ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Saving...</> : <><Save size={15} /> Save Changes</>}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ===================== PASSWORD MODAL ===================== */}
      {showPasswordModal && (
        <Modal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)} title="Reset Password" size="md">
          <form onSubmit={submitPassword} className="py-4 space-y-4">
            <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Lock size={22} className="text-amber-600" />
            </div>
            <p className="text-center text-sm text-gray-600 mb-4">Reset password for <strong>{d.fullName}</strong></p>
            {[
              { name: 'new_password', label: 'New Password', placeholder: 'Enter new password' },
              { name: 'confirm_password', label: 'Confirm Password', placeholder: 'Re-enter password' },
            ].map(f => (
              <div key={f.name}>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">{f.label}</label>
                <input type="password" name={f.name} value={passwordForm[f.name]} onChange={handlePasswordChange} placeholder={f.placeholder}
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary-500 ${passwordErrors[f.name] ? 'border-red-400' : 'border-gray-300'}`}
                  disabled={passwordLoading} />
                {passwordErrors[f.name] && <p className="mt-1 text-xs text-red-600">{passwordErrors[f.name]}</p>}
              </div>
            ))}
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setShowPasswordModal(false)}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors" disabled={passwordLoading}>Cancel</button>
              <button type="submit"
                className="flex-1 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                disabled={passwordLoading}>
                {passwordLoading ? 'Resetting...' : 'Reset Password'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ===================== DOCUMENT MODAL ===================== */}
      {showDocumentModal && (
        <Modal isOpen={showDocumentModal} onClose={() => setShowDocumentModal(false)} title="Upload Document" size="md">
          <form onSubmit={submitDocument} className="py-4 space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Document Type</label>
              <select value={documentData.document_type}
                onChange={(e) => setDocumentData(prev => ({ ...prev, document_type: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary-500" disabled={uploading}>
                <option value="student_image">Student Photograph</option>
                <option value="birth_certificate">Birth Certificate</option>
                <option value="immunization_record">Immunization Record</option>
                <option value="previous_school_report">Previous School Report</option>
                <option value="parent_id_copy">Parent ID Copy</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Select File</label>
              <input type="file" onChange={(e) => setDocumentData(prev => ({ ...prev, document: e.target.files[0] }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" disabled={uploading}
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" />
              <p className="mt-1 text-xs text-gray-400">PDF, JPG, PNG, DOC — Max 5MB</p>
            </div>
            {documentData.document && (
              <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-700">
                Selected: <strong>{documentData.document.name}</strong> ({(documentData.document.size / 1024 / 1024).toFixed(2)} MB)
              </div>
            )}
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setShowDocumentModal(false)}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors" disabled={uploading}>Cancel</button>
              <button type="submit"
                className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                disabled={uploading || !documentData.document}>
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ===================== DELETE MODAL ===================== */}
      {showDeleteModal && (
        <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete Student" size="md">
          <div className="py-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={26} className="text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Delete {d.fullName}?</h3>
            <p className="text-gray-500 text-sm mb-6">This action is permanent. All student data including academic records and fee history will be removed.</p>
            <div className="bg-red-50 border border-red-100 rounded-lg p-4 text-left mb-6">
              <p className="text-sm text-red-700 font-medium mb-2">This will delete:</p>
              <ul className="text-sm text-red-600 space-y-1">
                <li>• Student profile & user account</li>
                <li>• All academic records & results</li>
                <li>• Fee payment history</li>
                <li>• All uploaded documents</li>
              </ul>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={confirmDelete}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors">
                Yes, Delete Student
              </button>
            </div>
          </div>
        </Modal>
      )}
    </DashboardLayout>
  );
};

export default StudentDetail;