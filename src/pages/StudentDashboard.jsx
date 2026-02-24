// // school-management-frontend/src/pages/StudentDashboard.jsx
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import StudentLayout from '../components/layout/StudentLayout';
// import useAuth from '../hooks/useAuth';
// import { getStudentDashboard } from '../services/studentService';
// import {
//   User,
//   BookOpen,
//   GraduationCap,
//   Calendar,
//   Mail,
//   Phone,
//   Hash,
//   Award,
//   CheckCircle,
//   XCircle,
//   Eye,
//   FileText,
//   Heart,
//   DollarSign,
//   TrendingUp,
//   Shield,
//   Home,
//   Globe,
//   Briefcase,
//   Activity,
//   Camera,
//   Target,
//   Users,
//   BookMarked,
//   AlertCircle,
//   X
// } from 'lucide-react';

// const StudentDashboard = () => {
//   const { user } = useAuth();
//   const navigate = useNavigate();
  
//   // States
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [studentProfile, setStudentProfile] = useState(null);
//   const [results, setResults] = useState([]);
//   const [selectedResult, setSelectedResult] = useState(null);
//   const [showViewModal, setShowViewModal] = useState(false);
//   const [activeTab, setActiveTab] = useState('profile');
//   const [statistics, setStatistics] = useState({
//     total_results: 0,
//     published_results: 0,
//     average_percentage: 0
//   });

//   useEffect(() => {
//     if (user?.role === 'student') {
//       loadStudentData();
//     } else if (user && user.role !== 'student') {
//       navigate('/dashboard');
//     }
//   }, [user, navigate]);

//   const loadStudentData = async () => {
//     try {
//       setLoading(true);
//       setError('');
      
//       const data = await getStudentDashboard();
//       console.log('Dashboard data:', data);

//       setStudentProfile(data.student);
//       setResults(data.results || []);
//       setStatistics(data.statistics || {
//         total_results: 0,
//         published_results: 0,
//         average_percentage: 0
//       });
//     } catch (err) {
//       console.error('❌ Error loading student data:', err);
//       setError('Could not load your profile. Please contact the school administrator.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Helper: extract display name (from Result.jsx)
//   const extractDisplayName = (obj) => {
//     if (!obj) return 'Unknown';
//     if (obj.get_full_name) return obj.get_full_name;
//     if (obj.full_name) return obj.full_name;
//     if (obj.name) return obj.name;
//     if (obj.user) {
//       if (obj.user.get_full_name) return obj.user.get_full_name;
//       if (obj.user.full_name) return obj.user.full_name;
//       if (obj.user.first_name || obj.user.last_name) {
//         return `${obj.user.first_name || ''} ${obj.user.last_name || ''}`.trim();
//       }
//       if (obj.user.username) return obj.user.username;
//     }
//     if (obj.first_name || obj.last_name) {
//       return `${obj.first_name || ''} ${obj.last_name || ''}`.trim();
//     }
//     if (obj.username) return obj.username;
//     if (obj.email) return obj.email.split('@')[0];
//     if (obj.staff_id) return `Staff ${obj.staff_id}`;
//     return 'Unknown';
//   };

//   // Helper: render grade badge (from Result.jsx)
//   const renderGradeBadge = (grade) => {
//     const config = {
//       'A': { bg: 'bg-green-100', text: 'text-green-800', label: 'A - Excellent' },
//       'B': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'B - Good' },
//       'C': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'C - Average' },
//       'D': { bg: 'bg-orange-100', text: 'text-orange-800', label: 'D - Below Average' },
//       'E': { bg: 'bg-red-100', text: 'text-red-800', label: 'E - Poor' }
//     }[grade] || { bg: 'bg-gray-100', text: 'text-gray-800', label: grade || 'N/A' };
    
//     return (
//       <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
//         {config.label}
//       </span>
//     );
//   };

//   // Helper: render status badge (published/draft)
//   const renderStatusBadge = (isPublished) => (
//     <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${
//       isPublished ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
//     }`}>
//       {isPublished ? (
//         <>
//           <CheckCircle size={12} className="mr-1.5" />
//           Published
//         </>
//       ) : (
//         <>
//           <XCircle size={12} className="mr-1.5" />
//           Draft
//         </>
//       )}
//     </span>
//   );

//   // Handle view result details
//   const handleViewResult = (result) => {
//     setSelectedResult(result);
//     setShowViewModal(true);
//   };

//   // Loading state
//   if (loading) {
//     return (
//       <StudentLayout>
//         <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
//           <div className="text-center">
//             <div className="inline-flex items-center justify-center mb-4">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//             </div>
//             <p className="text-gray-600 font-medium">Loading your dashboard...</p>
//           </div>
//         </div>
//       </StudentLayout>
//     );
//   }

//   // Error state
//   if (error) {
//     return (
//       <StudentLayout>
//         <div className="min-h-screen bg-gray-50 p-6">
//           <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center max-w-lg mx-auto mt-20">
//             <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <XCircle className="text-red-600" size={32} />
//             </div>
//             <h2 className="text-xl font-bold text-red-800 mb-2">Error</h2>
//             <p className="text-red-600 mb-6">{error}</p>
//             <button
//               onClick={() => window.location.reload()}
//               className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
//             >
//               Try Again
//             </button>
//           </div>
//         </div>
//       </StudentLayout>
//     );
//   }

//   // No student profile
//   if (!studentProfile) {
//     return (
//       <StudentLayout>
//         <div className="min-h-screen bg-gray-50 p-6">
//           <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center max-w-lg mx-auto mt-20">
//             <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <User className="text-yellow-600" size={32} />
//             </div>
//             <h2 className="text-xl font-bold text-yellow-800 mb-2">Profile Not Found</h2>
//             <p className="text-yellow-600 mb-6">We couldn't find your student profile. Please contact the school administrator.</p>
//             <button
//               onClick={() => navigate('/login')}
//               className="px-6 py-2.5 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
//             >
//               Go to Login
//             </button>
//           </div>
//         </div>
//       </StudentLayout>
//     );
//   }

//   const student = studentProfile;
//   const studentUser = student.user || {};

//   return (
//     <StudentLayout>
//       <div className="min-h-screen bg-gray-50 p-4 md:p-6">
//         {/* Welcome Header */}
//         <div className="mb-8">
//           <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
//             Welcome back, {studentUser.first_name || studentUser.full_name || 'Student'}!
//           </h1>
//           <p className="text-gray-600">
//             View your profile information and academic results
//           </p>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
//           <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
//             <div className="flex items-center">
//               <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mr-3">
//                 <GraduationCap className="text-blue-600" size={18} />
//               </div>
//               <div>
//                 <p className="text-xs text-gray-600">Class</p>
//                 <p className="text-lg font-bold text-gray-900 truncate">
//                   {student.class_level?.name || 'Not assigned'}
//                 </p>
//               </div>
//             </div>
//           </div>
//           <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
//             <div className="flex items-center">
//               <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mr-3">
//                 <Award className="text-green-600" size={18} />
//               </div>
//               <div>
//                 <p className="text-xs text-gray-600">Results</p>
//                 <p className="text-lg font-bold text-gray-900">{statistics.published_results}</p>
//               </div>
//             </div>
//           </div>
//           <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
//             <div className="flex items-center">
//               <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center mr-3">
//                 <TrendingUp className="text-purple-600" size={18} />
//               </div>
//               <div>
//                 <p className="text-xs text-gray-600">Avg. Score</p>
//                 <p className="text-lg font-bold text-gray-900">
//                   {statistics.average_percentage.toFixed(1)}%
//                 </p>
//               </div>
//             </div>
//           </div>
//           <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
//             <div className="flex items-center">
//               <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center mr-3">
//                 <DollarSign className="text-yellow-600" size={18} />
//               </div>
//               <div>
//                 <p className="text-xs text-gray-600">Fee Balance</p>
//                 <p className="text-lg font-bold text-gray-900">
//                   ₦{student.balance_due ? parseFloat(student.balance_due).toLocaleString() : '0'}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Tab Navigation */}
//         <div className="mb-6 border-b border-gray-200 overflow-x-auto">
//           <div className="flex space-x-8 min-w-max">
//             <button
//               onClick={() => setActiveTab('profile')}
//               className={`pb-4 px-1 font-medium text-sm transition-colors relative ${
//                 activeTab === 'profile'
//                   ? 'text-blue-600 border-b-2 border-blue-600'
//                   : 'text-gray-500 hover:text-gray-700'
//               }`}
//             >
//               <User size={16} className="inline mr-2" />
//               My Profile
//             </button>
//             <button
//               onClick={() => setActiveTab('results')}
//               className={`pb-4 px-1 font-medium text-sm transition-colors relative ${
//                 activeTab === 'results'
//                   ? 'text-blue-600 border-b-2 border-blue-600'
//                   : 'text-gray-500 hover:text-gray-700'
//               }`}
//             >
//               <Award size={16} className="inline mr-2" />
//               My Results ({results.length})
//             </button>
//           </div>
//         </div>

//         {/* Profile Tab Content */}
//         {activeTab === 'profile' && (
//           <div className="space-y-6">
//             {/* Profile Header with Photo */}
//             <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
//               <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6">
//                 <div className="flex-shrink-0">
//                   {student.student_image_url ? (
//                     <img
//                       src={student.student_image_url}
//                       alt={`${studentUser.first_name} ${studentUser.last_name}`}
//                       className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
//                     />
//                   ) : (
//                     <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
//                       <User size={40} className="text-blue-600" />
//                     </div>
//                   )}
//                 </div>
//                 <div className="flex-1">
//                   <h2 className="text-2xl font-bold text-gray-900 mb-2">
//                     {studentUser.first_name} {studentUser.last_name}
//                   </h2>
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                     <div className="flex items-center text-gray-600">
//                       <Hash size={16} className="mr-2 text-gray-400" />
//                       <span className="text-sm">Admission: {student.admission_number || 'N/A'}</span>
//                     </div>
//                     <div className="flex items-center text-gray-600">
//                       <GraduationCap size={16} className="mr-2 text-gray-400" />
//                       <span className="text-sm">Class: {student.class_level?.name || 'Not assigned'}</span>
//                     </div>
//                     <div className="flex items-center text-gray-600">
//                       <Mail size={16} className="mr-2 text-gray-400" />
//                       <span className="text-sm">{studentUser.email || 'No email'}</span>
//                     </div>
//                     <div className="flex items-center text-gray-600">
//                       <Phone size={16} className="mr-2 text-gray-400" />
//                       <span className="text-sm">{studentUser.phone_number || 'No phone'}</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Personal Information */}
//             <Section title="Personal Information" icon={User}>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                 <InfoField label="Full Name" value={`${studentUser.first_name} ${studentUser.last_name}`} />
//                 <InfoField label="Admission Number" value={student.admission_number} icon={Hash} />
//                 <InfoField label="Student ID" value={student.student_id} />
//                 <InfoField label="Registration Number" value={studentUser.registration_number} />
//                 <InfoField label="Email" value={studentUser.email} icon={Mail} />
//                 <InfoField label="Phone" value={studentUser.phone_number} icon={Phone} />
//                 <InfoField label="Gender" value={studentUser.gender ? studentUser.gender.charAt(0).toUpperCase() + studentUser.gender.slice(1) : 'Not specified'} />
//                 <InfoField label="Date of Birth" value={studentUser.date_of_birth || 'Not provided'} />
//                 <InfoField label="Class Level" value={student.class_level?.name} icon={GraduationCap} />
//                 <InfoField label="Stream" value={student.stream && student.stream !== 'none' ? student.stream.charAt(0).toUpperCase() + student.stream.slice(1) : 'Not applicable'} />
//                 <InfoField label="House" value={student.house ? student.house.charAt(0).toUpperCase() + student.house.slice(1) : 'Not assigned'} />
//                 <InfoField label="Admission Date" value={student.admission_date || 'Not provided'} />
//               </div>
//             </Section>

//             {/* Address Information */}
//             <Section title="Address Information" icon={Home}>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <InfoField label="Address" value={studentUser.address} />
//                 <InfoField label="City" value={studentUser.city} />
//                 <InfoField label="State of Origin" value={studentUser.state_of_origin} />
//                 <InfoField label="LGA" value={studentUser.lga} />
//                 <InfoField label="Nationality" value={studentUser.nationality} />
//               </div>
//             </Section>

//             {/* Health Information */}
//             <Section title="Health Information" icon={Heart}>
//               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//                 <InfoField label="Blood Group" value={student.blood_group} />
//                 <InfoField label="Genotype" value={student.genotype} />
//                 <InfoField label="Allergies" value={student.has_allergies ? 'Yes' : 'No'} />
//                 {student.has_allergies && student.allergy_details && (
//                   <div className="col-span-full bg-red-50 p-4 rounded-lg border border-red-200">
//                     <p className="text-xs text-red-600 mb-1">Allergy Details</p>
//                     <p className="font-medium text-red-800">{student.allergy_details}</p>
//                   </div>
//                 )}
//               </div>
//             </Section>

//             {/* Emergency Contact */}
//             <Section title="Emergency Contact" icon={Phone}>
//               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                 <InfoField label="Contact Name" value={student.emergency_contact_name} />
//                 <InfoField label="Phone Number" value={student.emergency_contact_phone} />
//                 <InfoField label="Relationship" value={student.emergency_contact_relationship} />
//               </div>
//             </Section>
//           </div>
//         )}

//         {/* Results Tab Content */}
//         {activeTab === 'results' && (
//           <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
//             <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
//               <h2 className="text-lg font-semibold text-gray-800 flex items-center">
//                 <Award size={18} className="mr-2 text-gray-600" />
//                 My Academic Results
//               </h2>
//             </div>
            
//             <div className="p-4 sm:p-6">
//               {results.length === 0 ? (
//                 <div className="text-center py-12">
//                   <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-200">
//                     <FileText className="text-gray-400" size={32} />
//                   </div>
//                   <h3 className="text-lg font-medium text-gray-700 mb-2">No Results Found</h3>
//                   <p className="text-gray-500 max-w-md mx-auto">
//                     You don't have any published results yet.
//                   </p>
//                 </div>
//               ) : (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//                   {results.map(result => (
//                     <div key={result.id} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all">
//                       <div className="flex items-start justify-between mb-3">
//                         <div>
//                           <div className="font-semibold text-gray-900">{result.session?.name || 'Session'}</div>
//                           <div className="text-xs text-gray-600 mt-1">{result.term?.name || 'Term'}</div>
//                         </div>
//                         {renderStatusBadge(result.is_published)}
//                       </div>
                      
//                       <div className="space-y-2 mb-4">
//                         <div className="flex justify-between items-center">
//                           <span className="text-xs text-gray-600">Percentage:</span>
//                           <span className="text-base font-bold text-blue-600">{result.percentage || 0}%</span>
//                         </div>
//                         <div className="flex justify-between items-center">
//                           <span className="text-xs text-gray-600">Grade:</span>
//                           {renderGradeBadge(result.overall_grade)}
//                         </div>
//                         <div className="flex justify-between items-center">
//                           <span className="text-xs text-gray-600">Position:</span>
//                           <span className="text-sm font-medium text-gray-900">
//                             {result.position_in_class ? `${result.position_in_class}/${result.number_of_pupils_in_class}` : '-'}
//                           </span>
//                         </div>
//                       </div>
                      
//                       <div className="pt-3 border-t border-gray-100">
//                         <button
//                           onClick={() => handleViewResult(result)}
//                           className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all text-xs flex items-center justify-center"
//                         >
//                           <Eye size={14} className="mr-1" />
//                           View Details
//                         </button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         )}

//         {/* View Result Modal - Complete Details */}
//         {showViewModal && selectedResult && (
//           <ViewResultModal
//             result={selectedResult}
//             onClose={() => setShowViewModal(false)}
//             renderGradeBadge={renderGradeBadge}
//             extractDisplayName={extractDisplayName}
//           />
//         )}
//       </div>
//     </StudentLayout>
//   );
// };

// // Helper Components
// const Section = ({ title, icon: Icon, children }) => (
//   <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
//     <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
//       <h2 className="text-lg font-semibold text-gray-800 flex items-center">
//         <Icon size={18} className="mr-2 text-gray-600" />
//         {title}
//       </h2>
//     </div>
//     <div className="p-6">{children}</div>
//   </div>
// );

// const InfoField = ({ label, value, icon: Icon }) => {
//   if (!value) value = 'Not provided';
//   return (
//     <div>
//       <p className="text-xs text-gray-500 mb-1">{label}</p>
//       <div className="font-medium text-gray-900 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200 flex items-center">
//         {Icon && <Icon size={14} className="text-gray-400 mr-2 flex-shrink-0" />}
//         <span className="truncate">{value}</span>
//       </div>
//     </div>
//   );
// };

// // ========================================
// // COMPLETE RESULT MODAL (Read-only)
// // ========================================
// const ViewResultModal = ({ result, onClose, renderGradeBadge, extractDisplayName }) => {
//   const student = result.student || {};
//   const studentUser = student.user || {};
//   const studentName = `${studentUser.first_name || ''} ${studentUser.last_name || ''}`.trim() || student.full_name || 'Student';
//   const studentImage = student.student_image_url || student.profile_picture || null;
//   const studentEmail = studentUser.email || null;
//   const studentPhone = studentUser.phone_number || null;
  
//   const admissionNo = student.admission_number || 'N/A';
//   const className = result.class_level?.name || 'N/A';
//   const sessionName = result.session?.name || 'N/A';
//   const termName = result.term?.name || 'N/A';
  
//   const classTeacherName = extractDisplayName(result.class_teacher) || 'Not Assigned';
//   const headmasterName = extractDisplayName(result.headmaster) || 'Not Assigned';

//   // Helper to render rating dots (like in Result.jsx)
//   const renderRatingDots = (rating, color = 'blue') => {
//     const dots = [];
//     for (let i = 1; i <= 5; i++) {
//       dots.push(
//         <div
//           key={i}
//           className={`w-2 h-2 rounded-full mx-0.5 ${
//             i <= rating ? `bg-${color}-500` : 'bg-gray-200'
//           }`}
//         />
//       );
//     }
//     return <div className="flex">{dots}</div>;
//   };

//   // Helper to get rating label
//   const getRatingLabel = (rating) => {
//     if (rating === 5) return 'Excellent';
//     if (rating === 4) return 'Good';
//     if (rating === 3) return 'Fair';
//     if (rating === 2) return 'Poor';
//     return 'Very Poor';
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
//         {/* Header */}
//         <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
//           <h2 className="text-xl font-bold text-gray-900">Result Details</h2>
//           <button
//             onClick={onClose}
//             className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
//           >
//             <X size={20} />
//           </button>
//         </div>

//         <div className="p-6">
//           {/* Student Header */}
//           <div className="flex items-start mb-6 bg-gray-50 rounded-xl p-4">
//             <div className="flex-shrink-0 mr-4">
//               {studentImage ? (
//                 <img
//                   src={studentImage}
//                   alt={studentName}
//                   className="w-16 h-16 rounded-full object-cover border-2 border-white shadow"
//                 />
//               ) : (
//                 <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
//                   <User size={24} className="text-blue-600" />
//                 </div>
//               )}
//             </div>
//             <div className="flex-1">
//               <h3 className="text-lg font-bold text-gray-900">{studentName}</h3>
//               <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2 text-sm">
//                 <div className="flex items-center text-gray-600">
//                   <Hash size={14} className="mr-1 text-gray-400" />
//                   {admissionNo}
//                 </div>
//                 <div className="flex items-center text-gray-600">
//                   <GraduationCap size={14} className="mr-1 text-gray-400" />
//                   {className}
//                 </div>
//                 <div className="flex items-center text-gray-600">
//                   <Calendar size={14} className="mr-1 text-gray-400" />
//                   {sessionName} - {termName}
//                 </div>
//               </div>
//               {(studentEmail || studentPhone) && (
//                 <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-600">
//                   {studentEmail && <span className="flex items-center"><Mail size={12} className="mr-1" />{studentEmail}</span>}
//                   {studentPhone && <span className="flex items-center"><Phone size={12} className="mr-1" />{studentPhone}</span>}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Performance Stats */}
//           <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
//             <div className="bg-blue-50 p-3 rounded-lg text-center">
//               <div className="text-xl font-bold text-blue-700">{result.percentage || 0}%</div>
//               <div className="text-xs text-gray-600">Percentage</div>
//             </div>
//             <div className="bg-green-50 p-3 rounded-lg text-center">
//               <div className="text-sm font-bold text-green-700">
//                 {result.overall_grade ? renderGradeBadge(result.overall_grade) : 'N/A'}
//               </div>
//               <div className="text-xs text-gray-600">Grade</div>
//             </div>
//             <div className="bg-purple-50 p-3 rounded-lg text-center">
//               <div className="text-sm font-bold text-purple-700">
//                 {result.position_in_class || 'N/A'}/{result.number_of_pupils_in_class || 'N/A'}
//               </div>
//               <div className="text-xs text-gray-600">Position</div>
//             </div>
//             <div className={`p-3 rounded-lg text-center ${result.is_promoted ? 'bg-green-50' : 'bg-yellow-50'}`}>
//               <div className={`text-sm font-bold ${result.is_promoted ? 'text-green-700' : 'text-yellow-700'}`}>
//                 {result.is_promoted ? 'Promoted' : 'Not Promoted'}
//               </div>
//               <div className="text-xs text-gray-600">Status</div>
//             </div>
//           </div>

//           {/* Attendance & Physical */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
//             <div className="bg-white border border-gray-200 rounded-xl p-4">
//               <h4 className="font-semibold text-gray-900 mb-3 flex items-center text-sm">
//                 <Calendar size={16} className="mr-2 text-gray-600" />
//                 Attendance Records
//               </h4>
//               <div className="space-y-2 text-sm">
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Total School Days:</span>
//                   <span className="font-medium">{result.frequency_of_school_opened || 0}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Days Present:</span>
//                   <span className="font-medium">{result.no_of_times_present || 0}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Days Absent:</span>
//                   <span className="font-medium">{result.no_of_times_absent || 0}</span>
//                 </div>
//                 <div className="pt-2 border-t border-gray-100">
//                   <div className="flex justify-between items-center">
//                     <span className="text-gray-600">Attendance Rate:</span>
//                     <span className="text-base font-bold text-blue-600">
//                       {result.frequency_of_school_opened > 0
//                         ? Math.round((result.no_of_times_present / result.frequency_of_school_opened) * 100)
//                         : 0}%
//                     </span>
//                   </div>
//                   <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
//                     <div 
//                       className="bg-blue-600 h-1.5 rounded-full" 
//                       style={{ width: `${result.frequency_of_school_opened > 0 ? (result.no_of_times_present / result.frequency_of_school_opened) * 100 : 0}%` }}
//                     ></div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white border border-gray-200 rounded-xl p-4">
//               <h4 className="font-semibold text-gray-900 mb-3 flex items-center text-sm">
//                 <Activity size={16} className="mr-2 text-gray-600" />
//                 Physical Records
//               </h4>
//               <div className="grid grid-cols-2 gap-2 text-sm">
//                 <div>
//                   <p className="text-xs text-gray-500 mb-1">Weight (Beg)</p>
//                   <p className="font-medium">{result.weight_beginning_of_term || 'N/A'} kg</p>
//                 </div>
//                 <div>
//                   <p className="text-xs text-gray-500 mb-1">Weight (End)</p>
//                   <p className="font-medium">{result.weight_end_of_term || 'N/A'} kg</p>
//                 </div>
//                 <div>
//                   <p className="text-xs text-gray-500 mb-1">Height (Beg)</p>
//                   <p className="font-medium">{result.height_beginning_of_term || 'N/A'} cm</p>
//                 </div>
//                 <div>
//                   <p className="text-xs text-gray-500 mb-1">Height (End)</p>
//                   <p className="font-medium">{result.height_end_of_term || 'N/A'} cm</p>
//                 </div>
//               </div>
//               {result.weight_beginning_of_term && result.weight_end_of_term && (
//                 <div className="mt-2 pt-2 border-t border-gray-100">
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-600">Change:</span>
//                     <span className="font-medium text-blue-600">
//                       {(parseFloat(result.weight_end_of_term) - parseFloat(result.weight_beginning_of_term)).toFixed(1)} kg
//                     </span>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Subject Scores Table */}
//           <div className="mb-6">
//             <h4 className="font-semibold text-gray-900 mb-3 text-sm flex items-center">
//               <BookOpen size={16} className="mr-2 text-gray-600" />
//               Subject Scores
//             </h4>
//             {(result.subject_scores || []).length === 0 ? (
//               <p className="text-gray-500 text-sm italic">No subject scores recorded.</p>
//             ) : (
//               <div className="overflow-x-auto">
//                 <table className="w-full text-sm border-collapse">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="py-2 px-3 text-left font-medium text-gray-700">Subject</th>
//                       <th className="py-2 px-3 text-center font-medium text-gray-700">CA (40)</th>
//                       <th className="py-2 px-3 text-center font-medium text-gray-700">Exam (60)</th>
//                       <th className="py-2 px-3 text-center font-medium text-gray-700">Total (100)</th>
//                       <th className="py-2 px-3 text-center font-medium text-gray-700">Grade</th>
//                       <th className="py-2 px-3 text-left font-medium text-gray-700">Comment</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {(result.subject_scores || []).map((score, idx) => {
//                       const subjectName = score.subject?.name || score.subject?.subject_name || 'N/A';
//                       return (
//                         <tr key={idx} className="border-b border-gray-100">
//                           <td className="py-2 px-3 font-medium">{subjectName}</td>
//                           <td className="py-2 px-3 text-center">{score.ca_score || 0}</td>
//                           <td className="py-2 px-3 text-center">{score.exam_score || 0}</td>
//                           <td className="py-2 px-3 text-center font-bold">{score.total_score || 0}</td>
//                           <td className="py-2 px-3 text-center">{renderGradeBadge(score.grade)}</td>
//                           <td className="py-2 px-3 text-gray-600">{score.teacher_comment || '-'}</td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                   <tfoot className="bg-gray-50 font-semibold">
//                     <tr>
//                       <td className="py-2 px-3">TOTAL</td>
//                       <td className="py-2 px-3 text-center">{result.total_ca_score || 0}</td>
//                       <td className="py-2 px-3 text-center">{result.total_exam_score || 0}</td>
//                       <td className="py-2 px-3 text-center text-blue-700">{result.overall_total_score || 0}</td>
//                       <td className="py-2 px-3 text-center">{renderGradeBadge(result.overall_grade)}</td>
//                       <td></td>
//                     </tr>
//                   </tfoot>
//                 </table>
//               </div>
//             )}
//           </div>

//           {/* Psychomotor Skills */}
//           {result.psychomotor_skills && Object.keys(result.psychomotor_skills).filter(k => !['id','result_id','created_at','updated_at'].includes(k)).length > 0 && (
//             <div className="mb-6">
//               <h4 className="font-semibold text-gray-900 mb-3 text-sm flex items-center">
//                 <Target size={16} className="mr-2 text-gray-600" />
//                 Psychomotor Skills
//               </h4>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                 {Object.entries(result.psychomotor_skills)
//                   .filter(([key]) => !['id','result_id','created_at','updated_at'].includes(key))
//                   .map(([skill, rating]) => (
//                     <div key={skill} className="bg-white border border-gray-200 rounded-lg p-3">
//                       <div className="flex justify-between items-center">
//                         <span className="text-sm capitalize text-gray-700">{skill.replace(/_/g, ' ')}</span>
//                         <div className="flex items-center">
//                           {renderRatingDots(rating, 'blue')}
//                           <span className="ml-2 text-xs font-medium text-blue-700">{rating}/5</span>
//                         </div>
//                       </div>
//                       <p className="text-xs text-gray-500 mt-1">{getRatingLabel(rating)}</p>
//                     </div>
//                   ))}
//               </div>
//             </div>
//           )}

//           {/* Affective Domains */}
//           {result.affective_domains && Object.keys(result.affective_domains).filter(k => !['id','result_id','behavioral_comment','created_at','updated_at'].includes(k)).length > 0 && (
//             <div className="mb-6">
//               <h4 className="font-semibold text-gray-900 mb-3 text-sm flex items-center">
//                 <Users size={16} className="mr-2 text-gray-600" />
//                 Affective Domains
//               </h4>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                 {Object.entries(result.affective_domains)
//                   .filter(([key]) => !['id','result_id','behavioral_comment','created_at','updated_at'].includes(key))
//                   .map(([trait, rating]) => (
//                     <div key={trait} className="bg-white border border-gray-200 rounded-lg p-3">
//                       <div className="flex justify-between items-center">
//                         <span className="text-sm capitalize text-gray-700">{trait.replace(/_/g, ' ')}</span>
//                         <div className="flex items-center">
//                           {renderRatingDots(rating, 'green')}
//                           <span className="ml-2 text-xs font-medium text-green-700">{rating}/5</span>
//                         </div>
//                       </div>
//                       <p className="text-xs text-gray-500 mt-1">{getRatingLabel(rating)}</p>
//                     </div>
//                   ))}
//               </div>
//               {result.affective_domains.behavioral_comment && (
//                 <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
//                   <p className="text-xs text-gray-500 mb-1">Behavioral Comment:</p>
//                   <p className="text-sm text-gray-700">{result.affective_domains.behavioral_comment}</p>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Teacher Comments */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
//             <div className="bg-white border border-gray-200 rounded-xl p-4">
//               <h4 className="font-semibold text-gray-900 mb-2 text-sm">Class Teacher's Comment</h4>
//               <p className="text-sm text-gray-700 mb-2">{result.class_teacher_comment || 'No comment provided.'}</p>
//               <p className="text-xs text-gray-500">— {classTeacherName}</p>
//             </div>
//             <div className="bg-white border border-gray-200 rounded-xl p-4">
//               <h4 className="font-semibold text-gray-900 mb-2 text-sm">Headmaster's Comment</h4>
//               <p className="text-sm text-gray-700 mb-2">{result.headmaster_comment || 'No comment provided.'}</p>
//               <p className="text-xs text-gray-500">— {headmasterName}</p>
//             </div>
//           </div>

//           {/* Next Term Info */}
//           {(result.next_term_begins_on || result.next_term_fees) && (
//             <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
//               <h4 className="font-semibold text-gray-900 mb-3 text-sm flex items-center">
//                 <Calendar size={16} className="mr-2 text-gray-600" />
//                 Next Term Information
//               </h4>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 {result.next_term_begins_on && (
//                   <div>
//                     <p className="text-xs text-gray-500 mb-1">Begins On</p>
//                     <p className="text-sm font-medium">
//                       {new Date(result.next_term_begins_on).toLocaleDateString('en-US', {
//                         weekday: 'long',
//                         year: 'numeric',
//                         month: 'long',
//                         day: 'numeric'
//                       })}
//                     </p>
//                   </div>
//                 )}
//                 {result.next_term_fees && (
//                   <div>
//                     <p className="text-xs text-gray-500 mb-1">Fees</p>
//                     <p className="text-sm font-medium text-green-700">
//                       ₦{parseFloat(result.next_term_fees).toLocaleString()}
//                     </p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* Footer Close Button */}
//           <div className="flex justify-end">
//             <button
//               onClick={onClose}
//               className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StudentDashboard;


// school-management-frontend/src/pages/StudentDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentLayout from '../components/layout/StudentLayout';
import useAuth from '../hooks/useAuth';
import { getStudentDashboard } from '../services/studentService';
import { resultService } from '../services/api';
import {
  User,
  BookOpen,
  GraduationCap,
  Calendar,
  Mail,
  Phone,
  Hash,
  Award,
  CheckCircle,
  XCircle,
  Eye,
  FileText,
  Heart,
  DollarSign,
  TrendingUp,
  Home,
  Activity,
  Target,
  Users,
  X
} from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [studentProfile, setStudentProfile] = useState(null);
  const [results, setResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [statistics, setStatistics] = useState({
    total_results: 0,
    published_results: 0,
    average_percentage: 0
  });

  useEffect(() => {
    if (user?.role === 'student') {
      loadStudentData();
    } else if (user && user.role !== 'student') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const loadStudentData = async () => {
    try {
      setLoading(true);
      setError('');

      const data = await getStudentDashboard();
      console.log('Dashboard data:', data);

      setStudentProfile(data.student);
      setResults(data.results || []);
      setStatistics(data.statistics || {
        total_results: 0,
        published_results: 0,
        average_percentage: 0
      });
    } catch (err) {
      console.error('❌ Error loading student data:', err);
      setError('Could not load your profile. Please contact the school administrator.');
    } finally {
      setLoading(false);
    }
  };

  // Helper: extract display name (from Result.jsx)
  const extractDisplayName = (obj) => {
    if (!obj) return 'Unknown';
    if (obj.get_full_name) return obj.get_full_name;
    if (obj.full_name) return obj.full_name;
    if (obj.name) return obj.name;
    if (obj.user) {
      if (obj.user.get_full_name) return obj.user.get_full_name;
      if (obj.user.full_name) return obj.user.full_name;
      if (obj.user.first_name || obj.user.last_name) {
        return `${obj.user.first_name || ''} ${obj.user.last_name || ''}`.trim();
      }
      if (obj.user.username) return obj.user.username;
    }
    if (obj.first_name || obj.last_name) {
      return `${obj.first_name || ''} ${obj.last_name || ''}`.trim();
    }
    if (obj.username) return obj.username;
    if (obj.email) return obj.email.split('@')[0];
    if (obj.staff_id) return `Staff ${obj.staff_id}`;
    return 'Unknown';
  };

  // Helper: render grade badge (from Result.jsx)
  const renderGradeBadge = (grade) => {
    const config = {
      'A': { bg: 'bg-green-100', text: 'text-green-800', label: 'A - Excellent' },
      'B': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'B - Good' },
      'C': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'C - Average' },
      'D': { bg: 'bg-orange-100', text: 'text-orange-800', label: 'D - Below Average' },
      'E': { bg: 'bg-red-100', text: 'text-red-800', label: 'E - Poor' }
    }[grade] || { bg: 'bg-gray-100', text: 'text-gray-800', label: grade || 'N/A' };

    return (
      <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  // Helper: render status badge (published/draft)
  const renderStatusBadge = (isPublished) => (
    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${
      isPublished ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
    }`}>
      {isPublished ? (
        <>
          <CheckCircle size={12} className="mr-1.5" />
          Published
        </>
      ) : (
        <>
          <XCircle size={12} className="mr-1.5" />
          Draft
        </>
      )}
    </span>
  );

  // =====================
  // FIX: Fetch full result details before showing modal
  // =====================
  const handleViewResult = async (result) => {
    try {
      setModalLoading(true);
      setError('');

      // Fetch the complete result data (includes subject_scores with full subject objects)
      const fullResult = await resultService.getStudentResult(result.id);
      setSelectedResult(fullResult);
      setShowViewModal(true);
    } catch (err) {
      console.error('❌ Error fetching result details:', err);
      setError('Failed to load result details. Please try again.');
    } finally {
      setModalLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <StudentLayout>
        <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-flex items-center justify-center mb-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
            <p className="text-gray-600 font-medium">Loading your dashboard...</p>
          </div>
        </div>
      </StudentLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <StudentLayout>
        <div className="min-h-screen bg-gray-50 p-6">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center max-w-lg mx-auto mt-20">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="text-red-600" size={32} />
            </div>
            <h2 className="text-xl font-bold text-red-800 mb-2">Error</h2>
            <p className="text-red-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </StudentLayout>
    );
  }

  // No student profile
  if (!studentProfile) {
    return (
      <StudentLayout>
        <div className="min-h-screen bg-gray-50 p-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center max-w-lg mx-auto mt-20">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="text-yellow-600" size={32} />
            </div>
            <h2 className="text-xl font-bold text-yellow-800 mb-2">Profile Not Found</h2>
            <p className="text-yellow-600 mb-6">We couldn't find your student profile. Please contact the school administrator.</p>
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-2.5 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              Go to Login
            </button>
          </div>
        </div>
      </StudentLayout>
    );
  }

  const student = studentProfile;
  const studentUser = student.user || {};

  return (
    <StudentLayout>
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {studentUser.first_name || studentUser.full_name || 'Student'}!
          </h1>
          <p className="text-gray-600">
            View your profile information and academic results
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mr-3">
                <GraduationCap className="text-blue-600" size={18} />
              </div>
              <div>
                <p className="text-xs text-gray-600">Class</p>
                <p className="text-lg font-bold text-gray-900 truncate">
                  {student.class_level?.name || 'Not assigned'}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mr-3">
                <Award className="text-green-600" size={18} />
              </div>
              <div>
                <p className="text-xs text-gray-600">Results</p>
                <p className="text-lg font-bold text-gray-900">{statistics.published_results}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center mr-3">
                <TrendingUp className="text-purple-600" size={18} />
              </div>
              <div>
                <p className="text-xs text-gray-600">Avg. Score</p>
                <p className="text-lg font-bold text-gray-900">
                  {statistics.average_percentage.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center mr-3">
                <DollarSign className="text-yellow-600" size={18} />
              </div>
              <div>
                <p className="text-xs text-gray-600">Fee Balance</p>
                <p className="text-lg font-bold text-gray-900">
                  ₦{student.balance_due ? parseFloat(student.balance_due).toLocaleString() : '0'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 border-b border-gray-200 overflow-x-auto">
          <div className="flex space-x-8 min-w-max">
            <button
              onClick={() => setActiveTab('profile')}
              className={`pb-4 px-1 font-medium text-sm transition-colors relative ${
                activeTab === 'profile'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <User size={16} className="inline mr-2" />
              My Profile
            </button>
            <button
              onClick={() => setActiveTab('results')}
              className={`pb-4 px-1 font-medium text-sm transition-colors relative ${
                activeTab === 'results'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Award size={16} className="inline mr-2" />
              My Results ({results.length})
            </button>
          </div>
        </div>

        {/* Profile Tab Content */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            {/* Profile Header with Photo */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="flex-shrink-0">
                  {student.student_image_url ? (
                    <img
                      src={student.student_image_url}
                      alt={`${studentUser.first_name} ${studentUser.last_name}`}
                      className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                      <User size={40} className="text-blue-600" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {studentUser.first_name} {studentUser.last_name}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-center text-gray-600">
                      <Hash size={16} className="mr-2 text-gray-400" />
                      <span className="text-sm">Admission: {student.admission_number || 'N/A'}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <GraduationCap size={16} className="mr-2 text-gray-400" />
                      <span className="text-sm">Class: {student.class_level?.name || 'Not assigned'}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Mail size={16} className="mr-2 text-gray-400" />
                      <span className="text-sm">{studentUser.email || 'No email'}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Phone size={16} className="mr-2 text-gray-400" />
                      <span className="text-sm">{studentUser.phone_number || 'No phone'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <Section title="Personal Information" icon={User}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <InfoField label="Full Name" value={`${studentUser.first_name} ${studentUser.last_name}`} />
                <InfoField label="Admission Number" value={student.admission_number} icon={Hash} />
                <InfoField label="Student ID" value={student.student_id} />
                <InfoField label="Registration Number" value={studentUser.registration_number} />
                <InfoField label="Email" value={studentUser.email} icon={Mail} />
                <InfoField label="Phone" value={studentUser.phone_number} icon={Phone} />
                <InfoField label="Gender" value={studentUser.gender ? studentUser.gender.charAt(0).toUpperCase() + studentUser.gender.slice(1) : 'Not specified'} />
                <InfoField label="Date of Birth" value={studentUser.date_of_birth || 'Not provided'} />
                <InfoField label="Class Level" value={student.class_level?.name} icon={GraduationCap} />
                <InfoField label="Stream" value={student.stream && student.stream !== 'none' ? student.stream.charAt(0).toUpperCase() + student.stream.slice(1) : 'Not applicable'} />
                <InfoField label="House" value={student.house ? student.house.charAt(0).toUpperCase() + student.house.slice(1) : 'Not assigned'} />
                <InfoField label="Admission Date" value={student.admission_date || 'Not provided'} />
              </div>
            </Section>

            {/* Address Information */}
            <Section title="Address Information" icon={Home}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoField label="Address" value={studentUser.address} />
                <InfoField label="City" value={studentUser.city} />
                <InfoField label="State of Origin" value={studentUser.state_of_origin} />
                <InfoField label="LGA" value={studentUser.lga} />
                <InfoField label="Nationality" value={studentUser.nationality} />
              </div>
            </Section>

            {/* Health Information */}
            <Section title="Health Information" icon={Heart}>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <InfoField label="Blood Group" value={student.blood_group} />
                <InfoField label="Genotype" value={student.genotype} />
                <InfoField label="Allergies" value={student.has_allergies ? 'Yes' : 'No'} />
                {student.has_allergies && student.allergy_details && (
                  <div className="col-span-full bg-red-50 p-4 rounded-lg border border-red-200">
                    <p className="text-xs text-red-600 mb-1">Allergy Details</p>
                    <p className="font-medium text-red-800">{student.allergy_details}</p>
                  </div>
                )}
              </div>
            </Section>

            {/* Emergency Contact */}
            <Section title="Emergency Contact" icon={Phone}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <InfoField label="Contact Name" value={student.emergency_contact_name} />
                <InfoField label="Phone Number" value={student.emergency_contact_phone} />
                <InfoField label="Relationship" value={student.emergency_contact_relationship} />
              </div>
            </Section>
          </div>
        )}

        {/* Results Tab Content */}
        {activeTab === 'results' && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <Award size={18} className="mr-2 text-gray-600" />
                My Academic Results
              </h2>
            </div>

            <div className="p-4 sm:p-6">
              {results.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-200">
                    <FileText className="text-gray-400" size={32} />
                  </div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">No Results Found</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    You don't have any published results yet.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {results.map(result => (
                    <div key={result.id} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="font-semibold text-gray-900">{result.session?.name || 'Session'}</div>
                          <div className="text-xs text-gray-600 mt-1">{result.term?.name || 'Term'}</div>
                        </div>
                        {renderStatusBadge(result.is_published)}
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600">Percentage:</span>
                          <span className="text-base font-bold text-blue-600">{result.percentage || 0}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600">Grade:</span>
                          {renderGradeBadge(result.overall_grade)}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600">Position:</span>
                          <span className="text-sm font-medium text-gray-900">
                            {result.position_in_class ? `${result.position_in_class}/${result.number_of_pupils_in_class}` : '-'}
                          </span>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-gray-100">
                        <button
                          onClick={() => handleViewResult(result)}
                          disabled={modalLoading}
                          className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all text-xs flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {modalLoading ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                          ) : (
                            <Eye size={14} className="mr-1" />
                          )}
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* View Result Modal - now uses the full result data */}
        {showViewModal && selectedResult && (
          <ViewResultModal
            result={selectedResult}
            onClose={() => setShowViewModal(false)}
            renderGradeBadge={renderGradeBadge}
            extractDisplayName={extractDisplayName}
          />
        )}
      </div>
    </StudentLayout>
  );
};

// Helper Components
const Section = ({ title, icon: Icon, children }) => (
  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
      <h2 className="text-lg font-semibold text-gray-800 flex items-center">
        <Icon size={18} className="mr-2 text-gray-600" />
        {title}
      </h2>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

const InfoField = ({ label, value, icon: Icon }) => {
  if (!value) value = 'Not provided';
  return (
    <div>
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <div className="font-medium text-gray-900 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200 flex items-center">
        {Icon && <Icon size={14} className="text-gray-400 mr-2 flex-shrink-0" />}
        <span className="truncate">{value}</span>
      </div>
    </div>
  );
};

// ========================================
// COMPLETE RESULT MODAL (Read-only, full details)
// ========================================
const ViewResultModal = ({ result, onClose, renderGradeBadge, extractDisplayName }) => {
  const student = result.student || {};
  const studentUser = student.user || {};
  const studentName = `${studentUser.first_name || ''} ${studentUser.last_name || ''}`.trim() || student.full_name || 'Student';
  const studentImage = student.student_image_url || student.profile_picture || null;
  const studentEmail = studentUser.email || null;
  const studentPhone = studentUser.phone_number || null;

  const admissionNo = student.admission_number || 'N/A';
  const className = result.class_level?.name || 'N/A';
  const sessionName = result.session?.name || 'N/A';
  const termName = result.term?.name || 'N/A';

  const classTeacherName = extractDisplayName(result.class_teacher) || 'Not Assigned';
  const headmasterName = extractDisplayName(result.headmaster) || 'Not Assigned';

  // Helper to render rating dots
  const renderRatingDots = (rating, color = 'blue') => {
    const dots = [];
    for (let i = 1; i <= 5; i++) {
      dots.push(
        <div
          key={i}
          className={`w-2 h-2 rounded-full mx-0.5 ${
            i <= rating ? `bg-${color}-500` : 'bg-gray-200'
          }`}
        />
      );
    }
    return <div className="flex">{dots}</div>;
  };

  const getRatingLabel = (rating) => {
    if (rating === 5) return 'Excellent';
    if (rating === 4) return 'Good';
    if (rating === 3) return 'Fair';
    if (rating === 2) return 'Poor';
    return 'Very Poor';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
          <h2 className="text-xl font-bold text-gray-900">Result Details</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {/* Student Header */}
          <div className="flex items-start mb-6 bg-gray-50 rounded-xl p-4">
            <div className="flex-shrink-0 mr-4">
              {studentImage ? (
                <img
                  src={studentImage}
                  alt={studentName}
                  className="w-16 h-16 rounded-full object-cover border-2 border-white shadow"
                />
              ) : (
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <User size={24} className="text-blue-600" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900">{studentName}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2 text-sm">
                <div className="flex items-center text-gray-600">
                  <Hash size={14} className="mr-1 text-gray-400" />
                  {admissionNo}
                </div>
                <div className="flex items-center text-gray-600">
                  <GraduationCap size={14} className="mr-1 text-gray-400" />
                  {className}
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar size={14} className="mr-1 text-gray-400" />
                  {sessionName} - {termName}
                </div>
              </div>
              {(studentEmail || studentPhone) && (
                <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-600">
                  {studentEmail && <span className="flex items-center"><Mail size={12} className="mr-1" />{studentEmail}</span>}
                  {studentPhone && <span className="flex items-center"><Phone size={12} className="mr-1" />{studentPhone}</span>}
                </div>
              )}
            </div>
          </div>

          {/* Performance Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <div className="bg-blue-50 p-3 rounded-lg text-center">
              <div className="text-xl font-bold text-blue-700">{result.percentage || 0}%</div>
              <div className="text-xs text-gray-600">Percentage</div>
            </div>
            <div className="bg-green-50 p-3 rounded-lg text-center">
              <div className="text-sm font-bold text-green-700">
                {result.overall_grade ? renderGradeBadge(result.overall_grade) : 'N/A'}
              </div>
              <div className="text-xs text-gray-600">Grade</div>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg text-center">
              <div className="text-sm font-bold text-purple-700">
                {result.position_in_class || 'N/A'}/{result.number_of_pupils_in_class || 'N/A'}
              </div>
              <div className="text-xs text-gray-600">Position</div>
            </div>
            <div className={`p-3 rounded-lg text-center ${result.is_promoted ? 'bg-green-50' : 'bg-yellow-50'}`}>
              <div className={`text-sm font-bold ${result.is_promoted ? 'text-green-700' : 'text-yellow-700'}`}>
                {result.is_promoted ? 'Promoted' : 'Not Promoted'}
              </div>
              <div className="text-xs text-gray-600">Status</div>
            </div>
          </div>

          {/* Attendance & Physical */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center text-sm">
                <Calendar size={16} className="mr-2 text-gray-600" />
                Attendance Records
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total School Days:</span>
                  <span className="font-medium">{result.frequency_of_school_opened || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Days Present:</span>
                  <span className="font-medium">{result.no_of_times_present || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Days Absent:</span>
                  <span className="font-medium">{result.no_of_times_absent || 0}</span>
                </div>
                <div className="pt-2 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Attendance Rate:</span>
                    <span className="text-base font-bold text-blue-600">
                      {result.frequency_of_school_opened > 0
                        ? Math.round((result.no_of_times_present / result.frequency_of_school_opened) * 100)
                        : 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                    <div
                      className="bg-blue-600 h-1.5 rounded-full"
                      style={{ width: `${result.frequency_of_school_opened > 0 ? (result.no_of_times_present / result.frequency_of_school_opened) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center text-sm">
                <Activity size={16} className="mr-2 text-gray-600" />
                Physical Records
              </h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Weight (Beg)</p>
                  <p className="font-medium">{result.weight_beginning_of_term || 'N/A'} kg</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Weight (End)</p>
                  <p className="font-medium">{result.weight_end_of_term || 'N/A'} kg</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Height (Beg)</p>
                  <p className="font-medium">{result.height_beginning_of_term || 'N/A'} cm</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Height (End)</p>
                  <p className="font-medium">{result.height_end_of_term || 'N/A'} cm</p>
                </div>
              </div>
              {result.weight_beginning_of_term && result.weight_end_of_term && (
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Change:</span>
                    <span className="font-medium text-blue-600">
                      {(parseFloat(result.weight_end_of_term) - parseFloat(result.weight_beginning_of_term)).toFixed(1)} kg
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Subject Scores Table */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3 text-sm flex items-center">
              <BookOpen size={16} className="mr-2 text-gray-600" />
              Subject Scores
            </h4>
            {(result.subject_scores || []).length === 0 ? (
              <p className="text-gray-500 text-sm italic">No subject scores recorded.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-2 px-3 text-left font-medium text-gray-700">Subject</th>
                      <th className="py-2 px-3 text-center font-medium text-gray-700">CA (40)</th>
                      <th className="py-2 px-3 text-center font-medium text-gray-700">Exam (60)</th>
                      <th className="py-2 px-3 text-center font-medium text-gray-700">Total (100)</th>
                      <th className="py-2 px-3 text-center font-medium text-gray-700">Grade</th>
                      <th className="py-2 px-3 text-left font-medium text-gray-700">Comment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(result.subject_scores || []).map((score, idx) => {
                      const subjectName = score.subject?.name || score.subject?.subject_name || 'N/A';
                      return (
                        <tr key={idx} className="border-b border-gray-100">
                          <td className="py-2 px-3 font-medium">{subjectName}</td>
                          <td className="py-2 px-3 text-center">{score.ca_score || 0}</td>
                          <td className="py-2 px-3 text-center">{score.exam_score || 0}</td>
                          <td className="py-2 px-3 text-center font-bold">{score.total_score || 0}</td>
                          <td className="py-2 px-3 text-center">{renderGradeBadge(score.grade)}</td>
                          <td className="py-2 px-3 text-gray-600">{score.teacher_comment || '-'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot className="bg-gray-50 font-semibold">
                    <tr>
                      <td className="py-2 px-3">TOTAL</td>
                      <td className="py-2 px-3 text-center">{result.total_ca_score || 0}</td>
                      <td className="py-2 px-3 text-center">{result.total_exam_score || 0}</td>
                      <td className="py-2 px-3 text-center text-blue-700">{result.overall_total_score || 0}</td>
                      <td className="py-2 px-3 text-center">{renderGradeBadge(result.overall_grade)}</td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>

          {/* Psychomotor Skills */}
          {result.psychomotor_skills && Object.keys(result.psychomotor_skills).filter(k => !['id','result_id','created_at','updated_at'].includes(k)).length > 0 && (
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-3 text-sm flex items-center">
                <Target size={16} className="mr-2 text-gray-600" />
                Psychomotor Skills
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(result.psychomotor_skills)
                  .filter(([key]) => !['id','result_id','created_at','updated_at'].includes(key))
                  .map(([skill, rating]) => (
                    <div key={skill} className="bg-white border border-gray-200 rounded-lg p-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm capitalize text-gray-700">{skill.replace(/_/g, ' ')}</span>
                        <div className="flex items-center">
                          {renderRatingDots(rating, 'blue')}
                          <span className="ml-2 text-xs font-medium text-blue-700">{rating}/5</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{getRatingLabel(rating)}</p>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Affective Domains */}
          {result.affective_domains && Object.keys(result.affective_domains).filter(k => !['id','result_id','behavioral_comment','created_at','updated_at'].includes(k)).length > 0 && (
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-3 text-sm flex items-center">
                <Users size={16} className="mr-2 text-gray-600" />
                Affective Domains
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(result.affective_domains)
                  .filter(([key]) => !['id','result_id','behavioral_comment','created_at','updated_at'].includes(key))
                  .map(([trait, rating]) => (
                    <div key={trait} className="bg-white border border-gray-200 rounded-lg p-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm capitalize text-gray-700">{trait.replace(/_/g, ' ')}</span>
                        <div className="flex items-center">
                          {renderRatingDots(rating, 'green')}
                          <span className="ml-2 text-xs font-medium text-green-700">{rating}/5</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{getRatingLabel(rating)}</p>
                    </div>
                  ))}
              </div>
              {result.affective_domains.behavioral_comment && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">Behavioral Comment:</p>
                  <p className="text-sm text-gray-700">{result.affective_domains.behavioral_comment}</p>
                </div>
              )}
            </div>
          )}

          {/* Teacher Comments */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <h4 className="font-semibold text-gray-900 mb-2 text-sm">Class Teacher's Comment</h4>
              <p className="text-sm text-gray-700 mb-2">{result.class_teacher_comment || 'No comment provided.'}</p>
              <p className="text-xs text-gray-500">— {classTeacherName}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <h4 className="font-semibold text-gray-900 mb-2 text-sm">Headmaster's Comment</h4>
              <p className="text-sm text-gray-700 mb-2">{result.headmaster_comment || 'No comment provided.'}</p>
              <p className="text-xs text-gray-500">— {headmasterName}</p>
            </div>
          </div>

          {/* Next Term Info */}
          {(result.next_term_begins_on || result.next_term_fees) && (
            <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
              <h4 className="font-semibold text-gray-900 mb-3 text-sm flex items-center">
                <Calendar size={16} className="mr-2 text-gray-600" />
                Next Term Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {result.next_term_begins_on && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Begins On</p>
                    <p className="text-sm font-medium">
                      {new Date(result.next_term_begins_on).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                )}
                {result.next_term_fees && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Fees</p>
                    <p className="text-sm font-medium text-green-700">
                      ₦{parseFloat(result.next_term_fees).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Footer Close Button */}
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;