// /**
//  * Student Detail Page
//  * View and edit individual student profile
//  */

// import React, { useState, useEffect } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import DashboardLayout from '../components/dashboard/DashboardLayout';
// import Alert from '../components/common/Alert';
// import Loader, { PageLoader } from '../components/common/Loader';
// import Button from '../components/common/Button';
// import Input from '../components/common/Input';
// import FeeStatusBadge from '../components/students/FeeStatusBadge';
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
//       setFormData(studentData); // Initialize form data
      
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
    
//     // Admin can edit any student
//     if (isAdmin()) return true;
    
//     // Teachers can edit students in their classes
//     if (isTeacher()) return true;
    
//     // Accountant/Secretary can edit
//     if (['accountant', 'secretary'].includes(user?.role)) return true;
    
//     // Students can only edit their own profile
//     if (user?.role === 'student' && student?.user?.id === user?.id) return true;
    
//     // Parents can edit their children's profiles
//     if (user?.role === 'parent') {
//       // This would require checking if student is child of parent
//       // For now, we'll assume parents can edit emergency contact info
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
      
//       // Prepare data for update
//       const updateData = { ...formData };
      
//       // Remove fields that shouldn't be sent to API
//       delete updateData.user;
//       delete updateData.fee_summary;
//       delete updateData.document_checklist;
//       delete updateData.parents;
//       delete updateData.enrollments;
//       delete updateData.created_at;
//       delete updateData.updated_at;
      
//       // Update student
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
      
//       // Refresh student data
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
//             className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
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
//           <Link to="/students" className="mt-4 text-primary-600 hover:text-primary-700 font-medium">
//             Back to Students
//           </Link>
//         </div>
//       </DashboardLayout>
//     );
//   }

//   return (
//     <DashboardLayout title={`Student Profile`}> 
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
//       <div className="bg-white rounded-xl shadow-soft p-6 mb-8">
//         <div className="flex flex-col md:flex-row md:items-center justify-between">
//           <div className="flex items-center space-x-4 mb-4 md:mb-0">
//             {/* Student Avatar */}
//             <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-2xl">
//               {student.user?.first_name?.charAt(0) || 'S'}
//             </div>
            
//             {/* Student Info */}
//             <div>
//               <h1 className="text-2xl font-bold text-gray-800">
//                 {student.user?.full_name || `${student.user?.first_name} ${student.user?.last_name}`}
//               </h1>
//               <p className="text-gray-600">{student.user?.registration_number}</p>
//               {/* <div className="flex items-center space-x-2 mt-2">
//                 <span className="text-sm px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
//                   {student.class_level_info?.name || 'No Class'}
//                 </span>
//                 <FeeStatusBadge status={student.fee_status} />
//                 <span className={`text-sm px-3 py-1 rounded-full ${student.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
//                   {student.is_active ? 'Active' : 'Inactive'}
//                 </span>
//               </div> */}
//             </div>
//           </div>
          
//           {/* Action Buttons */}
//           <div className="flex space-x-3">
//             {canEditStudent() && !isEditing && (
//               <Button
//                 onClick={() => setIsEditing(true)}
//                 variant="outline"
//               >
//                 Edit Profile
//               </Button>
//             )}
//             {canEditStudent() && isEditing && (
//               <>
//                 <Button
//                   onClick={() => {
//                     setIsEditing(false);
//                     setFormData(student); // Reset form data
//                   }}
//                   variant="outline"
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   onClick={handleSubmit}
//                   loading={saving}
//                 >
//                   Save Changes
//                 </Button>
//               </>
//             )}
//             <Link to={`/students/${id}/dashboard`}>
//               <Button>
//                 View Dashboard
//               </Button>
//             </Link>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {/* Left Column - Personal & Academic Info */}
//         <div className="lg:col-span-2 space-y-8">
//           {/* Personal Information Card */}
//           <div className="bg-white rounded-xl shadow-soft p-6">
//             <div className="flex items-center justify-between mb-6">
//               <h3 className="text-xl font-semibold text-gray-800">Personal Information</h3>
//               {canEditStudent() && isEditing && (
//                 <Button
//                   size="sm"
//                   variant="outline"
//                   onClick={() => setShowDocumentModal(true)}
//                 >
//                   Upload Document
//                 </Button>
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
//               <div className="space-y-4">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <p className="text-sm text-gray-500">Full Name</p>
//                     <p className="font-medium">{student.user?.full_name}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-500">Registration Number</p>
//                     <p className="font-medium">{student.user?.registration_number}</p>
//                   </div>
//                 </div>
                
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <p className="text-sm text-gray-500">Email</p>
//                     <p className="font-medium">{student.user?.email}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-500">Phone</p>
//                     <p className="font-medium">{student.user?.phone_number}</p>
//                   </div>
//                 </div>
                
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <p className="text-sm text-gray-500">Date of Birth</p>
//                     <p className="font-medium">
//                       {student.user?.date_of_birth ? new Date(student.user.date_of_birth).toLocaleDateString() : 'Not provided'}
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-500">Gender</p>
//                     <p className="font-medium capitalize">{student.user?.gender || 'Not provided'}</p>
//                   </div>
//                 </div>
                
//                 <div>
//                   <p className="text-sm text-gray-500">Address</p>
//                   <p className="font-medium">{student.user?.address || 'Not provided'}</p>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Academic Information Card */}
//           <div className="bg-white rounded-xl shadow-soft p-6">
//             <h3 className="text-xl font-semibold text-gray-800 mb-6">Academic Information</h3>
            
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
//               <div className="space-y-4">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <p className="text-sm text-gray-500">Class Level</p>
//                     <p className="font-medium">{student.class_level_info?.name || 'Not assigned'}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-500">Stream</p>
//                     <p className="font-medium">{student.stream_display || 'Not applicable'}</p>
//                   </div>
//                 </div>
                
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <p className="text-sm text-gray-500">Student Category</p>
//                     <p className="font-medium">{student.student_category_display}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-500">House</p>
//                     <p className="font-medium">{student.house_display || 'Not assigned'}</p>
//                   </div>
//                 </div>
                
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <p className="text-sm text-gray-500">Admission Date</p>
//                     <p className="font-medium">
//                       {student.admission_date ? new Date(student.admission_date).toLocaleDateString() : 'Not provided'}
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-500">Transportation Mode</p>
//                     <p className="font-medium">{student.transportation_mode_display}</p>
//                   </div>
//                 </div>
                
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <p className="text-sm text-gray-500">Admission Number</p>
//                     <p className="font-medium">{student.admission_number}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-500">Student ID</p>
//                     <p className="font-medium">{student.student_id}</p>
//                   </div>
//                 </div>
                
//                 {student.previous_school && (
//                   <div>
//                     <p className="text-sm text-gray-500">Previous School</p>
//                     <p className="font-medium">{student.previous_school}</p>
//                     {student.previous_class && (
//                       <p className="text-sm text-gray-500 mt-1">Previous Class: {student.previous_class}</p>
//                     )}
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Right Column - Health, Fees, Documents */}
//         <div className="space-y-8">
//           {/* Health Information Card */}
//           <div className="bg-white rounded-xl shadow-soft p-6">
//             <h3 className="text-xl font-semibold text-gray-800 mb-6">Health Information</h3>
            
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
//                       className="h-4 w-4 text-primary-600 rounded"
//                       disabled={saving}
//                     />
//                     <label htmlFor="has_allergies" className="ml-2 text-sm text-gray-700">
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
//                       className="h-4 w-4 text-primary-600 rounded"
//                       disabled={saving}
//                     />
//                     <label htmlFor="has_learning_difficulties" className="ml-2 text-sm text-gray-700">
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
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <p className="text-sm text-gray-500">Blood Group</p>
//                     <p className="font-medium">{student.blood_group || 'Not provided'}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-500">Genotype</p>
//                     <p className="font-medium">{student.genotype || 'Not provided'}</p>
//                   </div>
//                 </div>
                
//                 {student.has_allergies && (
//                   <div>
//                     <p className="text-sm text-gray-500">Allergies</p>
//                     <p className="font-medium">{student.allergy_details || 'No details provided'}</p>
//                   </div>
//                 )}
                
//                 {student.has_learning_difficulties && (
//                   <div>
//                     <p className="text-sm text-gray-500">Learning Difficulties</p>
//                     <p className="font-medium">{student.learning_difficulties_details || 'No details provided'}</p>
//                   </div>
//                 )}
                
//                 {student.medical_conditions && (
//                   <div>
//                     <p className="text-sm text-gray-500">Medical Conditions</p>
//                     <p className="font-medium">{student.medical_conditions}</p>
//                   </div>
//                 )}
                
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <p className="text-sm text-gray-500">Family Doctor</p>
//                     <p className="font-medium">{student.family_doctor_name || 'Not provided'}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-500">Doctor Phone</p>
//                     <p className="font-medium">{student.family_doctor_phone || 'Not provided'}</p>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Fee Information Card */}
//           <div className="bg-white rounded-xl shadow-soft p-6">
//             <h3 className="text-xl font-semibold text-gray-800 mb-6">Fee Information</h3>
            
//             <div className="space-y-4">
//               <div>
//                 <p className="text-sm text-gray-500">Fee Status</p>
//                 <div className="mt-1">
//                   <FeeStatusBadge status={student.fee_status} />
//                 </div>
//               </div>
              
//               {student.fee_summary && (
//                 <div className="space-y-3">
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Total Fee:</span>
//                     <span className="font-medium">{formatFee(student.fee_summary.total_fee)}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Amount Paid:</span>
//                     <span className="font-medium text-green-600">{formatFee(student.fee_summary.paid)}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Balance Due:</span>
//                     <span className="font-medium text-red-600">{formatFee(student.fee_summary.balance)}</span>
//                   </div>
//                   <div className="pt-3 border-t border-gray-200">
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Percentage Paid:</span>
//                       <span className="font-medium">{student.fee_summary.percentage_paid}%</span>
//                     </div>
//                     <div className="h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
//                       <div
//                         className="h-full bg-primary-500 rounded-full transition-all duration-500"
//                         style={{ width: `${student.fee_summary.percentage_paid}%` }}
//                       />
//                     </div>
//                   </div>
//                 </div>
//               )}
              
//               {student.last_payment_date && (
//                 <div>
//                   <p className="text-sm text-gray-500">Last Payment Date</p>
//                   <p className="font-medium">
//                     {new Date(student.last_payment_date).toLocaleDateString()}
//                   </p>
//                 </div>
//               )}
              
//               <Link to={`/students/${id}/fees`}>
//                 <Button fullWidth variant="outline" className="mt-4">
//                   View Fee Details
//                 </Button>
//               </Link>
//             </div>
//           </div>

//           {/* Document Checklist Card */}
//           <div className="bg-white rounded-xl shadow-soft p-6">
//             <h3 className="text-xl font-semibold text-gray-800 mb-6">Document Checklist</h3>
            
//             <div className="space-y-3">
//               {student.document_checklist && Object.entries(student.document_checklist)
//                 .filter(([key]) => key !== 'all_documents_uploaded')
//                 .map(([document, uploaded]) => (
//                   <div key={document} className="flex items-center justify-between">
//                     <div className="flex items-center">
//                       <div className={`w-3 h-3 rounded-full mr-3 ${uploaded ? 'bg-green-500' : 'bg-red-500'}`} />
//                       <span className="text-gray-700 capitalize">{document.replace('_', ' ')}</span>
//                     </div>
//                     <span className={`text-sm ${uploaded ? 'text-green-600' : 'text-red-600'}`}>
//                       {uploaded ? '✓ Uploaded' : '✗ Pending'}
//                     </span>
//                   </div>
//                 ))}
              
//               <div className="pt-4 border-t border-gray-200">
//                 <div className="flex items-center justify-between">
//                   <span className="font-medium text-gray-700">Overall Status:</span>
//                   <span className={`px-3 py-1 rounded-full text-sm font-medium ${
//                     student.document_checklist?.all_documents_uploaded 
//                       ? 'bg-green-100 text-green-800' 
//                       : 'bg-yellow-100 text-yellow-800'
//                   }`}>
//                     {student.document_checklist?.all_documents_uploaded ? 'Complete' : 'Incomplete'}
//                   </span>
//                 </div>
//               </div>
              
//               {canEditStudent() && (
//                 <Button
//                   fullWidth
//                   variant="outline"
//                   className="mt-4"
//                   onClick={() => setShowDocumentModal(true)}
//                 >
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
//           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-slide-down">
//             <div className="p-6">
//               <div className="flex justify-between items-center mb-6">
//                 <h3 className="text-xl font-bold text-gray-800">Upload Document</h3>
//                 <button
//                   onClick={() => setShowDocumentModal(false)}
//                   className="text-gray-400 hover:text-gray-600"
//                 >
//                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                   </svg>
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
//                       <p className="mt-1 text-xs text-gray-500">
//                         Accepted formats: PDF, JPG, PNG, DOC, DOCX (Max 5MB)
//                       </p>
//                     </div>
//                   </div>
                  
//                   {documentData.document && (
//                     <div className="p-3 bg-gray-50 rounded-lg">
//                       <p className="text-sm text-gray-700">
//                         Selected file: <span className="font-medium">{documentData.document.name}</span>
//                       </p>
//                       <p className="text-xs text-gray-500 mt-1">
//                         Size: {(documentData.document.size / 1024 / 1024).toFixed(2)} MB
//                       </p>
//                     </div>
//                   )}
//                 </div>
                
//                 <div className="flex space-x-4 mt-8">
//                   <button
//                     type="button"
//                     onClick={() => setShowDocumentModal(false)}
//                     className="flex-1 btn-outline"
//                     disabled={uploading}
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="flex-1 btn-primary"
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
 * Student Detail Page - REDESIGNED
 * View and edit individual student profile
 */

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import Alert from '../components/common/Alert';
import Loader, { PageLoader } from '../components/common/Loader';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import useAuth from '../hooks/useAuth';
import { getStudentById, updateStudent, uploadStudentDocument } from '../services/studentService';
import { handleApiError } from '../services/api';
import {
  formatFee,
  getStreamOptions,
  getStudentCategoryOptions,
  getHouseOptions,
  getTransportationOptions,
  getBloodGroupOptions,
  getGenotypeOptions,
  getDocumentTypeOptions,
} from '../utils/studentUtils';
import { ArrowLeft, Edit, Save, X, Upload, FileText, Award, Activity, Heart, Phone, Mail, MapPin, Calendar, Users, Home, School, Download } from 'lucide-react';

const StudentDetail = () => {
  const { id } = useParams();
  const { user, isAdmin, isTeacher } = useAuth();
  
  // State for student data
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // State for edit mode
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const [saving, setSaving] = useState(false);
  
  // State for document upload
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [documentData, setDocumentData] = useState({
    document_type: 'student_image',
    document: null,
  });
  const [uploading, setUploading] = useState(false);

  // Fetch student data on component mount
  useEffect(() => {
    if (id) {
      fetchStudentData();
    }
  }, [id]);

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const studentData = await getStudentById(id);
      setStudent(studentData);
      setFormData(studentData);
      
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      console.error('Error fetching student:', err);
    } finally {
      setLoading(false);
    }
  };

  // Check if current user can edit this student
  const canEditStudent = () => {
    if (!student || !user) return false;
    
    if (isAdmin()) return true;
    
    if (isTeacher()) return true;
    
    if (['accountant', 'secretary'].includes(user?.role)) return true;
    
    if (user?.role === 'student' && student?.user?.id === user?.id) return true;
    
    if (user?.role === 'parent') {
      return true;
    }
    
    return false;
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: inputValue,
    }));
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!canEditStudent()) {
      setError('You do not have permission to edit this student');
      return;
    }

    try {
      setSaving(true);
      setError('');
      
      const updateData = { ...formData };
      
      delete updateData.user;
      delete updateData.fee_summary;
      delete updateData.document_checklist;
      delete updateData.parents;
      delete updateData.enrollments;
      delete updateData.created_at;
      delete updateData.updated_at;
      
      const updatedStudent = await updateStudent(id, updateData);
      
      setStudent(updatedStudent);
      setSuccess('Student profile updated successfully!');
      setIsEditing(false);
      
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  // Handle document upload
  const handleDocumentUpload = async (e) => {
    e.preventDefault();
    
    if (!documentData.document) {
      setError('Please select a document to upload');
      return;
    }

    try {
      setUploading(true);
      setError('');
      
      await uploadStudentDocument(id, documentData);
      
      setSuccess('Document uploaded successfully!');
      setShowDocumentModal(false);
      setDocumentData({
        document_type: 'student_image',
        document: null,
      });
      
      fetchStudentData();
      
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  // Handle document file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDocumentData(prev => ({
        ...prev,
        document: file,
      }));
    }
  };

  // Get options for dropdowns
  const streamOptions = getStreamOptions();
  const studentCategoryOptions = getStudentCategoryOptions();
  const houseOptions = getHouseOptions();
  const transportationOptions = getTransportationOptions();
  const bloodGroupOptions = getBloodGroupOptions();
  const genotypeOptions = getGenotypeOptions();
  const documentTypeOptions = getDocumentTypeOptions();

  // Loading state
  if (loading && !student) {
    return <PageLoader text="Loading student profile..." />;
  }

  // Error state
  if (error && !student) {
    return (
      <DashboardLayout title="Student Profile">
        <Alert
          type="error"
          message={error}
          onClose={() => setError('')}
          className="mb-6"
        />
        <div className="text-center py-12">
          <p className="text-gray-600">Failed to load student profile.</p>
          <button
            onClick={fetchStudentData}
            className="mt-4 text-secondary-600 hover:text-secondary-700 font-medium"
          >
            Retry
          </button>
        </div>
      </DashboardLayout>
    );
  }

  if (!student) {
    return (
      <DashboardLayout title="Student Profile">
        <div className="text-center py-12">
          <p className="text-gray-600">Student not found.</p>
          <Link to="/students" className="mt-4 text-secondary-600 hover:text-secondary-700 font-medium">
            Back to Students
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Not provided';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Get fee status color
  const getFeeStatusColor = (status) => {
    switch (status) {
      case 'paid_full': return 'bg-success-100 text-success-800';
      case 'paid_partial': return 'bg-accent-100 text-accent-800';
      case 'not_paid': return 'bg-red-100 text-red-800';
      case 'scholarship': return 'bg-blue-100 text-blue-800';
      case 'exempted': return 'bg-purple-100 text-purple-800';
      default: return 'bg-neutral-100 text-neutral-800';
    }
  };

  return (
    <DashboardLayout title={`Student Profile`}>
      {/* Back Navigation */}
      <div className="mb-6">
        <Link to="/students" className="inline-flex items-center text-secondary-600 hover:text-secondary-700 transition-colors">
          <ArrowLeft size={18} className="mr-2" />
          Back to Students
        </Link>
      </div>

      {/* Success Alert */}
      {success && (
        <Alert
          type="success"
          message={success}
          onClose={() => setSuccess('')}
          className="mb-6"
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
        <div className="flex flex-col lg:flex-row lg:items-center justify-between">
          <div className="flex items-center space-x-4 mb-6 lg:mb-0">
            {/* Student Avatar */}
            <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-medium">
              {student.user?.profile_image ? (
                <img 
                  src={student.user.profile_image} 
                  alt={student.user.full_name}
                  className="w-full h-full rounded-xl object-cover"
                />
              ) : (
                <span className="text-white font-bold text-3xl">
                  {student.user?.first_name?.charAt(0) || 'S'}
                </span>
              )}
            </div>
            
            {/* Student Info */}
            <div>
              <h1 className="text-2xl font-heading font-bold text-neutral-800">
                {student.user?.full_name || `${student.user?.first_name} ${student.user?.last_name}`}
              </h1>
              <p className="text-neutral-600 flex items-center">
                <Award size={16} className="mr-2" />
                {student.user?.registration_number}
              </p>
              <div className="flex items-center space-x-2 mt-3">
                <span className={`px-3 py-1 text-sm rounded-full ${getFeeStatusColor(student.fee_status)}`}>
                  {student.fee_status_display || 'Fee Status'}
                </span>
                <span className={`px-3 py-1 text-sm rounded-full ${student.is_active ? 'bg-success-100 text-success-800' : 'bg-red-100 text-red-800'}`}>
                  {student.is_active ? 'Active' : 'Inactive'}
                </span>
                {student.is_graduated && (
                  <span className="px-3 py-1 text-sm rounded-full bg-accent-100 text-accent-800">
                    Graduated
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Link to={`/students/${id}/dashboard`}>
              <Button variant="outline" className="border-secondary-200 text-secondary-700 hover:bg-secondary-50">
                <Activity size={18} className="mr-2" />
                Dashboard
              </Button>
            </Link>
            
            {canEditStudent() && !isEditing && (
              <Button
                onClick={() => setIsEditing(true)}
                variant="outline"
                className="border-secondary-200 text-secondary-700 hover:bg-secondary-50"
              >
                <Edit size={18} className="mr-2" />
                Edit Profile
              </Button>
            )}
            
            {canEditStudent() && isEditing && (
              <>
                <Button
                  onClick={() => {
                    setIsEditing(false);
                    setFormData(student);
                  }}
                  variant="outline"
                  className="border-red-200 text-red-700 hover:bg-red-50"
                >
                  <X size={18} className="mr-2" />
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  loading={saving}
                  className="bg-secondary-600 hover:bg-secondary-700"
                >
                  <Save size={18} className="mr-2" />
                  Save Changes
                </Button>
              </>
            )}
            
            <Button
              onClick={() => setShowDocumentModal(true)}
              className="bg-primary-600 hover:bg-primary-700"
            >
              <Upload size={18} className="mr-2" />
              Upload Document
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Personal & Academic Info */}
        <div className="lg:col-span-2 space-y-8">
          {/* Personal Information Card */}
          <div className="bg-white rounded-xl shadow-soft p-6 border border-neutral-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-neutral-800 flex items-center">
                <Users size={20} className="mr-2 text-secondary-600" />
                Personal Information
              </h3>
              {canEditStudent() && isEditing && (
                <button
                  onClick={() => setShowDocumentModal(true)}
                  className="text-sm text-secondary-600 hover:text-secondary-700"
                >
                  <Upload size={16} className="inline mr-1" />
                  Upload Document
                </button>
              )}
            </div>
            
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">First Name</label>
                    <Input
                      name="user.first_name"
                      value={formData.user?.first_name || ''}
                      onChange={handleInputChange}
                      disabled={saving}
                    />
                  </div>
                  <div>
                    <label className="label">Last Name</label>
                    <Input
                      name="user.last_name"
                      value={formData.user?.last_name || ''}
                      onChange={handleInputChange}
                      disabled={saving}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Email</label>
                    <Input
                      name="user.email"
                      type="email"
                      value={formData.user?.email || ''}
                      onChange={handleInputChange}
                      disabled={saving}
                    />
                  </div>
                  <div>
                    <label className="label">Phone</label>
                    <Input
                      name="user.phone_number"
                      value={formData.user?.phone_number || ''}
                      onChange={handleInputChange}
                      disabled={saving}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Date of Birth</label>
                    <Input
                      name="user.date_of_birth"
                      type="date"
                      value={formData.user?.date_of_birth || ''}
                      onChange={handleInputChange}
                      disabled={saving}
                    />
                  </div>
                  <div>
                    <label className="label">Gender</label>
                    <select
                      name="user.gender"
                      value={formData.user?.gender || ''}
                      onChange={handleInputChange}
                      className="input-field"
                      disabled={saving}
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="label">Address</label>
                  <Input
                    name="user.address"
                    type="textarea"
                    value={formData.user?.address || ''}
                    onChange={handleInputChange}
                    rows={2}
                    disabled={saving}
                  />
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-neutral-500 flex items-center">
                      <Users size={14} className="mr-2" />
                      Full Name
                    </p>
                    <p className="font-medium text-neutral-800">{student.user?.full_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500 flex items-center">
                      <Award size={14} className="mr-2" />
                      Registration Number
                    </p>
                    <p className="font-medium text-neutral-800">{student.user?.registration_number}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500 flex items-center">
                      <Calendar size={14} className="mr-2" />
                      Date of Birth
                    </p>
                    <p className="font-medium text-neutral-800">{formatDate(student.user?.date_of_birth)}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-neutral-500 flex items-center">
                      <Mail size={14} className="mr-2" />
                      Email
                    </p>
                    <p className="font-medium text-neutral-800">{student.user?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500 flex items-center">
                      <Phone size={14} className="mr-2" />
                      Phone
                    </p>
                    <p className="font-medium text-neutral-800">{student.user?.phone_number}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500 flex items-center">
                      <MapPin size={14} className="mr-2" />
                      Address
                    </p>
                    <p className="font-medium text-neutral-800">{student.user?.address || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Academic Information Card */}
          <div className="bg-white rounded-xl shadow-soft p-6 border border-neutral-100">
            <h3 className="text-xl font-semibold text-neutral-800 flex items-center mb-6">
              <School size={20} className="mr-2 text-secondary-600" />
              Academic Information
            </h3>
            
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Class Level ID</label>
                    <Input
                      name="class_level"
                      type="number"
                      value={formData.class_level || ''}
                      onChange={handleInputChange}
                      disabled={saving}
                    />
                  </div>
                  <div>
                    <label className="label">Stream</label>
                    <select
                      name="stream"
                      value={formData.stream || 'none'}
                      onChange={handleInputChange}
                      className="input-field"
                      disabled={saving}
                    >
                      {streamOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Student Category</label>
                    <select
                      name="student_category"
                      value={formData.student_category || 'day'}
                      onChange={handleInputChange}
                      className="input-field"
                      disabled={saving}
                    >
                      {studentCategoryOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="label">House</label>
                    <select
                      name="house"
                      value={formData.house || 'none'}
                      onChange={handleInputChange}
                      className="input-field"
                      disabled={saving}
                    >
                      {houseOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Admission Date</label>
                    <Input
                      name="admission_date"
                      type="date"
                      value={formData.admission_date || ''}
                      onChange={handleInputChange}
                      disabled={saving}
                    />
                  </div>
                  <div>
                    <label className="label">Transportation Mode</label>
                    <select
                      name="transportation_mode"
                      value={formData.transportation_mode || 'parent_drop'}
                      onChange={handleInputChange}
                      className="input-field"
                      disabled={saving}
                    >
                      {transportationOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-neutral-500">Class Level</p>
                    <p className="font-medium text-neutral-800">{student.class_level_info?.name || 'Not assigned'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">Stream</p>
                    <p className="font-medium text-neutral-800">{student.stream_display || 'Not applicable'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">Admission Date</p>
                    <p className="font-medium text-neutral-800">{formatDate(student.admission_date)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">Admission Number</p>
                    <p className="font-medium text-neutral-800">{student.admission_number}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-neutral-500">Student Category</p>
                    <p className="font-medium text-neutral-800">{student.student_category_display}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">House</p>
                    <p className="font-medium text-neutral-800">{student.house_display || 'Not assigned'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">Transportation Mode</p>
                    <p className="font-medium text-neutral-800">{student.transportation_mode_display}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">Student ID</p>
                    <p className="font-medium text-neutral-800">{student.student_id}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Health, Fees, Documents */}
        <div className="space-y-8">
          {/* Health Information Card */}
          <div className="bg-white rounded-xl shadow-soft p-6 border border-neutral-100">
            <h3 className="text-xl font-semibold text-neutral-800 flex items-center mb-6">
              <Heart size={20} className="mr-2 text-red-500" />
              Health Information
            </h3>
            
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Blood Group</label>
                    <select
                      name="blood_group"
                      value={formData.blood_group || ''}
                      onChange={handleInputChange}
                      className="input-field"
                      disabled={saving}
                    >
                      {bloodGroupOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="label">Genotype</label>
                    <select
                      name="genotype"
                      value={formData.genotype || ''}
                      onChange={handleInputChange}
                      className="input-field"
                      disabled={saving}
                    >
                      {genotypeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="has_allergies"
                      name="has_allergies"
                      checked={formData.has_allergies || false}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-secondary-600 rounded"
                      disabled={saving}
                    />
                    <label htmlFor="has_allergies" className="ml-2 text-sm text-neutral-700">
                      Has Allergies
                    </label>
                  </div>
                  
                  {formData.has_allergies && (
                    <div>
                      <label className="label">Allergy Details</label>
                      <Input
                        name="allergy_details"
                        type="textarea"
                        value={formData.allergy_details || ''}
                        onChange={handleInputChange}
                        rows={2}
                        disabled={saving}
                      />
                    </div>
                  )}
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="has_learning_difficulties"
                      name="has_learning_difficulties"
                      checked={formData.has_learning_difficulties || false}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-secondary-600 rounded"
                      disabled={saving}
                    />
                    <label htmlFor="has_learning_difficulties" className="ml-2 text-sm text-neutral-700">
                      Has Learning Difficulties
                    </label>
                  </div>
                  
                  {formData.has_learning_difficulties && (
                    <div>
                      <label className="label">Learning Difficulties Details</label>
                      <Input
                        name="learning_difficulties_details"
                        type="textarea"
                        value={formData.learning_difficulties_details || ''}
                        onChange={handleInputChange}
                        rows={2}
                        disabled={saving}
                      />
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="label">Medical Conditions</label>
                  <Input
                    name="medical_conditions"
                    type="textarea"
                    value={formData.medical_conditions || ''}
                    onChange={handleInputChange}
                    rows={2}
                    disabled={saving}
                  />
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-neutral-500">Blood Group</p>
                    <p className="font-medium text-neutral-800">{student.blood_group || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">Genotype</p>
                    <p className="font-medium text-neutral-800">{student.genotype || 'Not provided'}</p>
                  </div>
                </div>
                
                {student.has_allergies && (
                  <div>
                    <p className="text-sm text-neutral-500">Allergies</p>
                    <p className="font-medium text-neutral-800">{student.allergy_details || 'No details provided'}</p>
                  </div>
                )}
                
                {student.has_learning_difficulties && (
                  <div>
                    <p className="text-sm text-neutral-500">Learning Difficulties</p>
                    <p className="font-medium text-neutral-800">{student.learning_difficulties_details || 'No details provided'}</p>
                  </div>
                )}
                
                {student.medical_conditions && (
                  <div>
                    <p className="text-sm text-neutral-500">Medical Conditions</p>
                    <p className="font-medium text-neutral-800">{student.medical_conditions}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Fee Information Card */}
          <div className="bg-white rounded-xl shadow-soft p-6 border border-neutral-100">
            <h3 className="text-xl font-semibold text-neutral-800 mb-6">Fee Information</h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-neutral-500 mb-2">Fee Status</p>
                <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getFeeStatusColor(student.fee_status)}`}>
                  {student.fee_status_display}
                </span>
              </div>
              
              {student.fee_summary && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-600">Total Fee:</span>
                    <span className="font-medium text-neutral-800">{formatFee(student.fee_summary.total_fee)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-600">Amount Paid:</span>
                    <span className="font-medium text-success-600">{formatFee(student.fee_summary.paid)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-600">Balance Due:</span>
                    <span className="font-medium text-red-600">{formatFee(student.fee_summary.balance)}</span>
                  </div>
                  <div className="pt-3 border-t border-neutral-200">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-neutral-600">Payment Progress</span>
                      <span className="text-sm font-medium">{student.fee_summary.percentage_paid}%</span>
                    </div>
                    <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-success-500 rounded-full transition-all duration-500"
                        style={{ width: `${student.fee_summary.percentage_paid}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}
              
              <Link to={`/students/${id}/fees`}>
                <Button fullWidth variant="outline" className="mt-4 border-secondary-200 text-secondary-700 hover:bg-secondary-50">
                  View Fee Details
                </Button>
              </Link>
            </div>
          </div>

          {/* Document Checklist Card */}
          <div className="bg-white rounded-xl shadow-soft p-6 border border-neutral-100">
            <h3 className="text-xl font-semibold text-neutral-800 flex items-center mb-6">
              <FileText size={20} className="mr-2 text-secondary-600" />
              Document Checklist
            </h3>
            
            <div className="space-y-3">
              {student.document_checklist && Object.entries(student.document_checklist)
                .filter(([key]) => key !== 'all_documents_uploaded')
                .map(([document, uploaded]) => (
                  <div key={document} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-3 ${uploaded ? 'bg-success-500' : 'bg-neutral-300'}`} />
                      <span className="text-neutral-700 capitalize">{document.replace('_', ' ')}</span>
                    </div>
                    <span className={`text-sm ${uploaded ? 'text-success-600' : 'text-neutral-500'}`}>
                      {uploaded ? 'Uploaded' : 'Pending'}
                    </span>
                  </div>
                ))}
              
              <div className="pt-4 border-t border-neutral-200">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-neutral-700">Overall Status:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    student.document_checklist?.all_documents_uploaded 
                      ? 'bg-success-100 text-success-800' 
                      : 'bg-accent-100 text-accent-800'
                  }`}>
                    {student.document_checklist?.all_documents_uploaded ? 'Complete' : 'Incomplete'}
                  </span>
                </div>
              </div>
              
              {canEditStudent() && (
                <Button
                  fullWidth
                  variant="outline"
                  className="mt-4 border-secondary-200 text-secondary-700 hover:bg-secondary-50"
                  onClick={() => setShowDocumentModal(true)}
                >
                  <Upload size={16} className="mr-2" />
                  Upload Document
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Document Upload Modal */}
      {showDocumentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-strong border border-neutral-200 w-full max-w-md animate-slide-down">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-neutral-800">Upload Document</h3>
                <button
                  onClick={() => setShowDocumentModal(false)}
                  className="text-neutral-400 hover:text-neutral-600"
                >
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleDocumentUpload}>
                <div className="space-y-4">
                  <div>
                    <label className="label">Document Type</label>
                    <select
                      value={documentData.document_type}
                      onChange={(e) => setDocumentData(prev => ({ ...prev, document_type: e.target.value }))}
                      className="input-field"
                      disabled={uploading}
                    >
                      {documentTypeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="label">Select Document</label>
                    <div className="mt-1">
                      <input
                        type="file"
                        onChange={handleFileChange}
                        className="input-field"
                        disabled={uploading}
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      />
                      <p className="mt-1 text-xs text-neutral-500">
                        Accepted formats: PDF, JPG, PNG, DOC, DOCX (Max 5MB)
                      </p>
                    </div>
                  </div>
                  
                  {documentData.document && (
                    <div className="p-3 bg-neutral-50 rounded-lg">
                      <p className="text-sm text-neutral-700">
                        Selected file: <span className="font-medium">{documentData.document.name}</span>
                      </p>
                      <p className="text-xs text-neutral-500 mt-1">
                        Size: {(documentData.document.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-4 mt-8">
                  <button
                    type="button"
                    onClick={() => setShowDocumentModal(false)}
                    className="flex-1 px-4 py-2.5 border border-neutral-300 rounded-lg hover:bg-neutral-50 text-neutral-700 transition-colors"
                    disabled={uploading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2.5 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors"
                    disabled={uploading || !documentData.document}
                  >
                    {uploading ? 'Uploading...' : 'Upload Document'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default StudentDetail;