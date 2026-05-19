// /**
//  * Student Dashboard Page
//  * Clean, professional design matching Parent Portal style
//  * Students can view their profile, results, fee status, and access library
//  */

// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import StudentLayout from '../components/layout/StudentLayout';
// import useAuth from '../hooks/useAuth';
// import { getStudentDashboard } from '../services/studentService';
// import { resultService } from '../services/api';
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
//   Home,
//   Activity,
//   Target,
//   Users,
//   X,
//   CreditCard,
//   Shield,
//   MapPin,
//   Briefcase,
//   Clock,
//   Printer,
//   LogOut,
//   ChevronRight
// } from 'lucide-react';

// // =====================
// // HELPER COMPONENTS
// // =====================
// const Section = ({ title, icon: Icon, children }) => (
//   <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
//     <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
//       <h4 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
//         {Icon && <span className="text-gray-500">{Icon}</span>}
//         {title}
//       </h4>
//     </div>
//     <div className="p-5">{children}</div>
//   </div>
// );

// const InfoRow = ({ label, value, fullWidth = false }) => (
//   <div className={fullWidth ? 'col-span-full' : ''}>
//     <div className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wide">{label}</div>
//     <div className="text-sm font-medium text-gray-900 bg-gray-50 px-3 py-2 rounded border border-gray-200 break-words">
//       {value || <span className="text-gray-400 italic">Not provided</span>}
//     </div>
//   </div>
// );

// const StatCard = ({ label, value, icon, color }) => (
//   <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
//     <div className="flex items-center gap-3">
//       <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
//         {icon}
//       </div>
//       <div>
//         <p className="text-2xl font-bold text-gray-800">{value}</p>
//         <p className="text-xs text-gray-500">{label}</p>
//       </div>
//     </div>
//   </div>
// );

// const StatusBadge = ({ isActive, isGraduated }) => {
//   if (!isActive) {
//     return (
//       <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
//         <XCircle size={11} /> Inactive
//       </span>
//     );
//   }
//   if (isGraduated) {
//     return (
//       <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
//         <Award size={11} /> Graduated
//       </span>
//     );
//   }
//   return (
//     <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
//       <CheckCircle size={11} /> Active
//     </span>
//   );
// };

// const FeeBadge = ({ feeStatus }) => {
//   const cfg = {
//     paid_full: { bg: 'bg-green-100', text: 'text-green-800', label: 'Fully Paid', icon: <CheckCircle size={11} /> },
//     paid_partial: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Partially Paid', icon: <Clock size={11} /> },
//     not_paid: { bg: 'bg-red-100', text: 'text-red-800', label: 'Not Paid', icon: <XCircle size={11} /> },
//     scholarship: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Scholarship', icon: <Award size={11} /> },
//     exempted: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Exempted', icon: <Shield size={11} /> },
//   };
//   const config = cfg[feeStatus] || { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Unknown', icon: null };
//   return (
//     <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
//       {config.icon}{config.label}
//     </span>
//   );
// };

// const GradeBadge = ({ grade }) => {
//   const cfg = {
//     'A': { bg: 'bg-green-100', text: 'text-green-800', label: 'A - Excellent' },
//     'B': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'B - Good' },
//     'C': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'C - Average' },
//     'D': { bg: 'bg-orange-100', text: 'text-orange-800', label: 'D - Below Average' },
//     'E': { bg: 'bg-red-100', text: 'text-red-800', label: 'E - Poor' },
//   }[grade] || { bg: 'bg-gray-100', text: 'text-gray-800', label: grade || 'N/A' };
//   return (
//     <span className={`px-2 py-1 rounded-full text-xs font-medium ${cfg.bg} ${cfg.text}`}>
//       {cfg.label}
//     </span>
//   );
// };

// // =====================
// // RESULT DETAIL MODAL
// // =====================
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

//   const getRatingLabel = (rating) => {
//     if (rating === 5) return 'Excellent';
//     if (rating === 4) return 'Good';
//     if (rating === 3) return 'Fair';
//     if (rating === 2) return 'Poor';
//     return 'Very Poor';
//   };

//   const formatDate = (d) => {
//     if (!d) return '';
//     return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
//         {/* Header */}
//         <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
//           <h2 className="text-lg font-bold text-gray-900">Result Details</h2>
//           <button onClick={onClose} className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
//             <X size={20} />
//           </button>
//         </div>

//         <div className="p-6">
//           {/* Student Header */}
//           <div className="flex items-start gap-4 mb-6 bg-gray-50 rounded-xl p-4">
//             <div className="w-16 h-16 rounded-lg bg-blue-100 flex items-center justify-center overflow-hidden flex-shrink-0">
//               {studentImage ? (
//                 <img src={studentImage} alt={studentName} className="w-full h-full object-cover" />
//               ) : (
//                 <span className="text-xl font-bold text-blue-600">{studentName.charAt(0)}</span>
//               )}
//             </div>
//             <div className="flex-1">
//               <h3 className="text-base font-semibold text-gray-900">{studentName}</h3>
//               <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-1 text-xs">
//                 <div className="flex items-center text-gray-600"><Hash size={12} className="mr-1" />{admissionNo}</div>
//                 <div className="flex items-center text-gray-600"><GraduationCap size={12} className="mr-1" />{className}</div>
//                 <div className="flex items-center text-gray-600"><Calendar size={12} className="mr-1" />{sessionName} - {termName}</div>
//               </div>
//               {(studentEmail || studentPhone) && (
//                 <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-600">
//                   {studentEmail && <span className="flex items-center"><Mail size={10} className="mr-1" />{studentEmail}</span>}
//                   {studentPhone && <span className="flex items-center"><Phone size={10} className="mr-1" />{studentPhone}</span>}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Performance Stats */}
//           <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
//             <div className="bg-blue-50 p-3 rounded-lg text-center">
//               <div className="text-lg font-bold text-blue-700">{result.percentage || 0}%</div>
//               <div className="text-xs text-gray-600">Percentage</div>
//             </div>
//             <div className="bg-green-50 p-3 rounded-lg text-center">
//               <div className="text-xs font-bold text-green-700">{renderGradeBadge(result.overall_grade)}</div>
//               <div className="text-xs text-gray-600">Grade</div>
//             </div>
//             <div className="bg-purple-50 p-3 rounded-lg text-center">
//               <div className="text-xs font-bold text-purple-700">{result.position_in_class || 'N/A'}/{result.number_of_pupils_in_class || 'N/A'}</div>
//               <div className="text-xs text-gray-600">Position</div>
//             </div>
//             <div className={`p-3 rounded-lg text-center ${result.is_promoted ? 'bg-green-50' : 'bg-yellow-50'}`}>
//               <div className={`text-xs font-bold ${result.is_promoted ? 'text-green-700' : 'text-yellow-700'}`}>
//                 {result.is_promoted ? 'Promoted' : 'Not Promoted'}
//               </div>
//               <div className="text-xs text-gray-600">Status</div>
//             </div>
//           </div>

//           {/* Subject Scores Table */}
//           <div className="mb-6">
//             <h4 className="text-xs font-semibold text-gray-700 mb-3 flex items-center gap-2">
//               <BookOpen size={14} /> Subject Scores
//             </h4>
//             {(result.subject_scores || []).length === 0 ? (
//               <p className="text-gray-500 text-sm italic">No subject scores recorded.</p>
//             ) : (
//               <div className="overflow-x-auto">
//                 <table className="w-full text-xs border-collapse">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="py-2 px-3 text-left font-medium text-gray-700">Subject</th>
//                       <th className="py-2 px-3 text-center font-medium text-gray-700">CA (40)</th>
//                       <th className="py-2 px-3 text-center font-medium text-gray-700">Exam (60)</th>
//                       <th className="py-2 px-3 text-center font-medium text-gray-700">Total (100)</th>
//                       <th className="py-2 px-3 text-center font-medium text-gray-700">Grade</th>
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
//                           <td className="py-2 px-3 text-center"><GradeBadge grade={score.grade} /></td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                   <tfoot className="bg-gray-50 font-semibold">
//                     <tr><td className="py-2 px-3">TOTAL</td><td className="py-2 px-3 text-center">{result.total_ca_score || 0}</td><td className="py-2 px-3 text-center">{result.total_exam_score || 0}</td><td className="py-2 px-3 text-center text-blue-700">{result.overall_total_score || 0}</td><td className="py-2 px-3 text-center">{renderGradeBadge(result.overall_grade)}</td></tr>
//                   </tfoot>
//                 </table>
//               </div>
//             )}
//           </div>

//           {/* Teacher Comments */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
//             <div className="bg-white border border-gray-200 rounded-lg p-4">
//               <h4 className="text-xs font-semibold text-gray-700 mb-2">Class Teacher's Comment</h4>
//               <p className="text-sm text-gray-700">{result.class_teacher_comment || 'No comment provided.'}</p>
//               <p className="text-xs text-gray-500 mt-2">— {classTeacherName}</p>
//             </div>
//             <div className="bg-white border border-gray-200 rounded-lg p-4">
//               <h4 className="text-xs font-semibold text-gray-700 mb-2">Headmaster's Comment</h4>
//               <p className="text-sm text-gray-700">{result.headmaster_comment || 'No comment provided.'}</p>
//               <p className="text-xs text-gray-500 mt-2">— {headmasterName}</p>
//             </div>
//           </div>

//           {/* Next Term Info */}
//           {(result.next_term_begins_on || result.next_term_fees) && (
//             <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
//               <h4 className="text-xs font-semibold text-gray-700 mb-3 flex items-center gap-2">
//                 <Calendar size={14} /> Next Term Information
//               </h4>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 {result.next_term_begins_on && <div><p className="text-xs text-gray-500">Begins On</p><p className="text-sm font-medium">{formatDate(result.next_term_begins_on)}</p></div>}
//                 {result.next_term_fees && <div><p className="text-xs text-gray-500">Fees</p><p className="text-sm font-medium text-green-700">₦{parseFloat(result.next_term_fees).toLocaleString()}</p></div>}
//               </div>
//             </div>
//           )}

//           <div className="flex justify-end">
//             <button onClick={onClose} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors">Close</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // =====================
// // MAIN STUDENT DASHBOARD
// // =====================
// const StudentDashboard = () => {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [studentProfile, setStudentProfile] = useState(null);
//   const [results, setResults] = useState([]);
//   const [selectedResult, setSelectedResult] = useState(null);
//   const [showViewModal, setShowViewModal] = useState(false);
//   const [modalLoading, setModalLoading] = useState(false);
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
//       setStatistics(data.statistics || { total_results: 0, published_results: 0, average_percentage: 0 });
//     } catch (err) {
//       console.error('Error loading student data:', err);
//       setError('Could not load your profile. Please contact the school administrator.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const extractDisplayName = (obj) => {
//     if (!obj) return 'Unknown';
//     if (obj.get_full_name) return obj.get_full_name;
//     if (obj.full_name) return obj.full_name;
//     if (obj.name) return obj.name;
//     if (obj.user) {
//       if (obj.user.get_full_name) return obj.user.get_full_name;
//       if (obj.user.first_name || obj.user.last_name) return `${obj.user.first_name || ''} ${obj.user.last_name || ''}`.trim();
//       if (obj.user.username) return obj.user.username;
//     }
//     if (obj.first_name || obj.last_name) return `${obj.first_name || ''} ${obj.last_name || ''}`.trim();
//     if (obj.username) return obj.username;
//     if (obj.email) return obj.email.split('@')[0];
//     return 'Unknown';
//   };

//   const handleViewResult = async (result) => {
//     try {
//       setModalLoading(true);
//       const fullResult = await resultService.getStudentResult(result.id);
//       setSelectedResult(fullResult);
//       setShowViewModal(true);
//     } catch (err) {
//       console.error('Error fetching result details:', err);
//       setError('Failed to load result details.');
//     } finally {
//       setModalLoading(false);
//     }
//   };

//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount || 0);
//   };

//   if (loading) {
//     return (
//       <StudentLayout>
//         <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
//             <p className="text-gray-500">Loading your dashboard...</p>
//           </div>
//         </div>
//       </StudentLayout>
//     );
//   }

//   if (error || !studentProfile) {
//     return (
//       <StudentLayout>
//         <div className="min-h-screen bg-gray-50 p-6">
//           <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center max-w-lg mx-auto mt-20">
//             <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <XCircle className="text-red-600" size={32} />
//             </div>
//             <h2 className="text-xl font-bold text-red-800 mb-2">Error</h2>
//             <p className="text-red-600 mb-6">{error || 'Student profile not found'}</p>
//             <button onClick={() => window.location.reload()} className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700">Try Again</button>
//           </div>
//         </div>
//       </StudentLayout>
//     );
//   }

//   const student = studentProfile;
//   const studentUser = student.user || {};
//   const fullName = `${studentUser.first_name || ''} ${studentUser.last_name || ''}`.trim() || 'Student';
//   const feeSummary = student.fee_summary || {};
//   const paidPct = feeSummary.total_fee > 0 ? Math.round((feeSummary.paid / feeSummary.total_fee) * 100) : 0;

//   return (
//     <StudentLayout>
//       <div className="min-h-screen bg-gray-50 p-4 md:p-6 space-y-6 pb-10">
//         {/* Welcome Header */}
//         <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
//           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//             <div className="flex items-center gap-4">
//               <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center">
//                 {student.student_image_url ? (
//                   <img src={student.student_image_url} alt={fullName} className="w-full h-full rounded-lg object-cover" />
//                 ) : (
//                   <User size={28} className="text-blue-600" />
//                 )}
//               </div>
//               <div>
//                 <h1 className="text-xl font-bold text-gray-800">Welcome, {studentUser.first_name || 'Student'}!</h1>
//                 <p className="text-sm text-gray-500">Student Dashboard - View your profile and results</p>
//                 <div className="flex flex-wrap gap-3 mt-1 text-xs text-gray-500">
//                   <span>Adm: {student.admission_number}</span>
//                   <span>•</span>
//                   <span>Reg: {studentUser.registration_number}</span>
//                 </div>
//               </div>
//             </div>
//             <div className="flex gap-2">
//               <button onClick={() => navigate('/library')} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">
//                 <BookOpen size={14} /> Library
//               </button>
//               <button onClick={logout} className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors">
//                 <LogOut size={14} /> Logout
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//           <StatCard label="Class" value={student.class_level?.name || 'Not assigned'} icon={<GraduationCap size={18} />} color="bg-blue-100 text-blue-600" />
//           <StatCard label="Results" value={statistics.published_results} icon={<Award size={18} />} color="bg-green-100 text-green-600" />
//           <StatCard label="Avg. Score" value={`${statistics.average_percentage.toFixed(1)}%`} icon={<TrendingUp size={18} />} color="bg-purple-100 text-purple-600" />
//           <StatCard label="Fee Balance" value={formatCurrency(feeSummary.balance || 0)} icon={<DollarSign size={18} />} color="bg-yellow-100 text-yellow-600" />
//         </div>

//         {/* Fee Progress Bar */}
//         {feeSummary.total_fee > 0 && (
//           <div className="bg-white rounded-lg border border-gray-200 p-4">
//             <div className="flex justify-between items-center mb-2">
//               <span className="text-xs font-medium text-gray-600">Fee Payment Progress</span>
//               <span className="text-xs font-bold text-gray-800">{paidPct}% paid</span>
//             </div>
//             <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
//               <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${paidPct}%` }}></div>
//             </div>
//             <div className="flex justify-between mt-2 text-xs text-gray-500">
//               <span>Paid: {formatCurrency(feeSummary.paid)}</span>
//               <span>Total: {formatCurrency(feeSummary.total_fee)}</span>
//             </div>
//             <div className="mt-3">
//               <FeeBadge feeStatus={student.fee_status} />
//             </div>
//           </div>
//         )}

//         {/* Tabs */}
//         <div className="border-b border-gray-200">
//           <div className="flex gap-6">
//             <button onClick={() => setActiveTab('profile')} className={`pb-3 text-sm font-medium transition-colors ${activeTab === 'profile' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
//               <User size={14} className="inline mr-2" /> My Profile
//             </button>
//             <button onClick={() => setActiveTab('results')} className={`pb-3 text-sm font-medium transition-colors ${activeTab === 'results' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
//               <Award size={14} className="inline mr-2" /> My Results ({results.length})
//             </button>
//           </div>
//         </div>

//         {/* Profile Tab */}
//         {activeTab === 'profile' && (
//           <div className="space-y-6">
//             {/* Personal Information */}
//             <Section title="Personal Information" icon={<User size={15} />}>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                 <InfoRow label="Full Name" value={fullName} />
//                 <InfoRow label="Admission Number" value={student.admission_number} />
//                 <InfoRow label="Student ID" value={student.student_id} />
//                 <InfoRow label="Registration Number" value={studentUser.registration_number} />
//                 <InfoRow label="Email" value={studentUser.email} />
//                 <InfoRow label="Phone" value={studentUser.phone_number} />
//                 <InfoRow label="Gender" value={studentUser.gender ? studentUser.gender.charAt(0).toUpperCase() + studentUser.gender.slice(1) : 'Not specified'} />
//                 <InfoRow label="Date of Birth" value={studentUser.date_of_birth} />
//                 <InfoRow label="Class Level" value={student.class_level?.name} />
//                 <InfoRow label="Stream" value={student.stream && student.stream !== 'none' ? student.stream.charAt(0).toUpperCase() + student.stream.slice(1) : 'Not applicable'} />
//                 <InfoRow label="House" value={student.house && student.house !== 'none' ? student.house.charAt(0).toUpperCase() + student.house.slice(1) : 'Not assigned'} />
//                 <InfoRow label="Admission Date" value={student.admission_date} />
//               </div>
//             </Section>

//             {/* Address Information */}
//             <Section title="Address Information" icon={<Home size={15} />}>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <InfoRow label="Address" value={studentUser.address} />
//                 <InfoRow label="City" value={studentUser.city} />
//                 <InfoRow label="State of Origin" value={studentUser.state_of_origin} />
//                 <InfoRow label="LGA" value={studentUser.lga} />
//                 <InfoRow label="Nationality" value={studentUser.nationality} />
//               </div>
//             </Section>

//             {/* Health Information */}
//             <Section title="Health Information" icon={<Heart size={15} />}>
//               <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
//                 <div className="bg-red-50 p-3 rounded-lg border border-red-100 text-center">
//                   <div className="text-xs text-red-700 font-medium mb-1">Blood Group</div>
//                   <div className="text-sm font-semibold text-gray-900">{student.blood_group || '—'}</div>
//                 </div>
//                 <div className="bg-red-50 p-3 rounded-lg border border-red-100 text-center">
//                   <div className="text-xs text-red-700 font-medium mb-1">Genotype</div>
//                   <div className="text-sm font-semibold text-gray-900">{student.genotype || '—'}</div>
//                 </div>
//                 <div className="bg-red-50 p-3 rounded-lg border border-red-100 text-center">
//                   <div className="text-xs text-red-700 font-medium mb-1">Allergies</div>
//                   <div className="text-sm font-semibold text-gray-900">{student.has_allergies ? 'Yes' : 'No'}</div>
//                 </div>
//                 <div className="bg-red-50 p-3 rounded-lg border border-red-100 text-center">
//                   <div className="text-xs text-red-700 font-medium mb-1">Vaccinations</div>
//                   <div className="text-sm font-semibold text-gray-900">{student.has_received_vaccinations ? 'Complete' : 'Incomplete'}</div>
//                 </div>
//               </div>
//               {student.has_allergies && student.allergy_details && <InfoRow label="Allergy Details" value={student.allergy_details} />}
//               <InfoRow label="Medical Conditions" value={student.medical_conditions} />
//               <InfoRow label="Family Doctor" value={student.family_doctor_name} />
//               <InfoRow label="Doctor Phone" value={student.family_doctor_phone} />
//             </Section>

//             {/* Emergency Contact */}
//             <Section title="Emergency Contact" icon={<Phone size={15} />}>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <InfoRow label="Contact Name" value={student.emergency_contact_name} />
//                 <InfoRow label="Phone Number" value={student.emergency_contact_phone} />
//                 <InfoRow label="Relationship" value={student.emergency_contact_relationship} />
//               </div>
//             </Section>
//           </div>
//         )}

//         {/* Results Tab */}
//         {activeTab === 'results' && (
//           <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
//             <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
//               <h2 className="text-sm font-semibold text-gray-800 flex items-center gap-2"><Award size={16} /> My Academic Results ({results.length})</h2>
//             </div>
//             <div className="p-5">
//               {results.length === 0 ? (
//                 <div className="text-center py-12"><FileText size={40} className="mx-auto text-gray-300 mb-3" /><p className="text-gray-500">No results available yet.</p></div>
//               ) : (
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                   {results.map(result => (
//                     <div key={result.id} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all">
//                       <div className="flex justify-between items-start mb-3">
//                         <div><div className="font-semibold text-gray-900 text-sm">{result.session?.name || 'Session'}</div><div className="text-xs text-gray-500">{result.term?.name || 'Term'}</div></div>
//                         <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${result.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
//                           {result.is_published ? <CheckCircle size={10} /> : <XCircle size={10} />}{result.is_published ? 'Published' : 'Draft'}
//                         </span>
//                       </div>
//                       <div className="space-y-2 mb-3">
//                         <div className="flex justify-between text-xs"><span className="text-gray-500">Percentage:</span><span className="font-bold text-blue-600">{result.percentage || 0}%</span></div>
//                         <div className="flex justify-between items-center"><span className="text-xs text-gray-500">Grade:</span><GradeBadge grade={result.overall_grade} /></div>
//                         <div className="flex justify-between text-xs"><span className="text-gray-500">Position:</span><span className="font-medium">{result.position_in_class ? `${result.position_in_class}/${result.number_of_pupils_in_class}` : '-'}</span></div>
//                       </div>
//                       <button onClick={() => handleViewResult(result)} disabled={modalLoading} className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg text-xs flex items-center justify-center gap-1 hover:bg-gray-200 transition-colors">
//                         {modalLoading ? <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div> : <><Eye size={12} /> View Details</>}
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         )}

//         {/* Result Modal */}
//         {showViewModal && selectedResult && (
//           <ViewResultModal result={selectedResult} onClose={() => setShowViewModal(false)} renderGradeBadge={GradeBadge} extractDisplayName={extractDisplayName} />
//         )}
//       </div>
//     </StudentLayout>
//   );
// };

// export default StudentDashboard;

/**
 * Student Dashboard Page
 * Clean, professional design matching Parent Portal style
 * FULLY RESPONSIVE: mobile-first, compact on small screens
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentLayout from "../../components/layout/StudentLayout";
import useAuth from '../../hooks/useAuth';
import { getStudentDashboard } from '../../services/studentService';
import { resultService } from '../../services/api';
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
  X,
  CreditCard,
  Shield,
  MapPin,
  Briefcase,
  Clock,
  Printer,
  LogOut,
  ChevronRight,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

// =====================
// HELPER COMPONENTS - COMPACT & RESPONSIVE
// =====================
const Section = ({ title, icon: Icon, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 sm:px-5 py-2.5 sm:py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between hover:bg-gray-100 transition-colors"
      >
        <h4 className="text-xs sm:text-sm font-semibold text-gray-800 flex items-center gap-1.5 sm:gap-2">
          {Icon && <span className="text-gray-400 w-3 h-3 sm:w-4 sm:h-4">{Icon}</span>}
          {title}
        </h4>
        {isOpen ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
      </button>
      {isOpen && <div className="p-3 sm:p-5">{children}</div>}
    </div>
  );
};

const InfoRow = ({ label, value, fullWidth = false }) => (
  <div className={fullWidth ? 'col-span-full' : ''}>
    <div className="text-[9px] sm:text-xs text-gray-400 mb-0.5 sm:mb-1 font-medium uppercase tracking-wide">{label}</div>
    <div className="text-xs sm:text-sm font-medium text-gray-800 bg-gray-50 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-gray-100 break-words min-h-[32px] sm:min-h-[36px]">
      {value || <span className="text-gray-300 italic text-[10px] sm:text-xs">—</span>}
    </div>
  </div>
);

const StatCard = ({ label, value, icon, color }) => (
  <div className="bg-white rounded-xl border border-gray-100 p-2 sm:p-3 shadow-sm">
    <div className="flex flex-col items-center text-center">
      <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center mb-1 ${color}`}>
        {icon}
      </div>
      <p className="text-[10px] sm:text-xs font-bold text-gray-800 truncate max-w-full">{value}</p>
      <p className="text-[8px] sm:text-[10px] text-gray-400">{label}</p>
    </div>
  </div>
);

const StatusBadge = ({ isActive, isGraduated }) => {
  if (!isActive) {
    return (
      <span className="inline-flex items-center gap-0.5 px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-xs font-medium bg-red-100 text-red-700">
        <XCircle size={9} /> Inactive
      </span>
    );
  }
  if (isGraduated) {
    return (
      <span className="inline-flex items-center gap-0.5 px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-xs font-medium bg-purple-100 text-purple-700">
        <Award size={9} /> Graduated
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-0.5 px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-xs font-medium bg-green-100 text-green-700">
      <CheckCircle size={9} /> Active
    </span>
  );
};

const FeeBadge = ({ feeStatus }) => {
  const cfg = {
    paid_full: { bg: 'bg-green-100', text: 'text-green-700', label: 'Fully Paid', icon: <CheckCircle size={9} /> },
    paid_partial: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Partial', icon: <Clock size={9} /> },
    not_paid: { bg: 'bg-red-100', text: 'text-red-700', label: 'Not Paid', icon: <XCircle size={9} /> },
    scholarship: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Scholarship', icon: <Award size={9} /> },
    exempted: { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Exempted', icon: <Shield size={9} /> },
  };
  const config = cfg[feeStatus] || { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Unknown', icon: null };
  return (
    <span className={`inline-flex items-center gap-0.5 px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-xs font-medium ${config.bg} ${config.text}`}>
      {config.icon}{config.label}
    </span>
  );
};

const GradeBadge = ({ grade }) => {
  const cfg = {
    'A': { bg: 'bg-green-100', text: 'text-green-700', label: 'A' },
    'B': { bg: 'bg-blue-100', text: 'text-blue-700', label: 'B' },
    'C': { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'C' },
    'D': { bg: 'bg-orange-100', text: 'text-orange-700', label: 'D' },
    'E': { bg: 'bg-red-100', text: 'text-red-700', label: 'E' },
    'F': { bg: 'bg-red-100', text: 'text-red-700', label: 'F' },
  }[grade] || { bg: 'bg-gray-100', text: 'text-gray-600', label: grade || 'N/A' };
  return (
    <span className={`px-1.5 py-0.5 rounded-full text-[9px] sm:text-xs font-medium ${cfg.bg} ${cfg.text}`}>
      {cfg.label}
    </span>
  );
};

// =====================
// RESULT DETAIL MODAL - RESPONSIVE
// =====================
const ViewResultModal = ({ result, onClose, renderGradeBadge, extractDisplayName }) => {
  const student = result.student || {};
  const studentUser = student.user || {};
  const studentName = `${studentUser.first_name || ''} ${studentUser.last_name || ''}`.trim() || student.full_name || 'Student';
  const studentImage = student.student_image_url || student.profile_picture || null;
  const admissionNo = student.admission_number || 'N/A';
  const className = result.class_level?.name || 'N/A';
  const sessionName = result.session?.name || 'N/A';
  const termName = result.term?.name || 'N/A';
  const classTeacherName = extractDisplayName(result.class_teacher) || 'Not Assigned';
  const headmasterName = extractDisplayName(result.headmaster) || 'Not Assigned';

  const formatDate = (d) => {
    if (!d) return '';
    return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const getRatingLabel = (rating) => {
    if (rating === 5) return 'Excellent';
    if (rating === 4) return 'Good';
    if (rating === 3) return 'Fair';
    if (rating === 2) return 'Poor';
    return 'Very Poor';
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-4 sm:px-6 py-3 flex justify-between items-center">
          <h2 className="text-sm sm:text-base font-bold text-gray-900">Result Details</h2>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-4 sm:p-6">
          {/* Student Header - Compact */}
          <div className="flex items-start gap-3 mb-4 bg-gray-50 rounded-xl p-3 sm:p-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0">
              {studentImage ? (
                <img src={studentImage} alt={studentName} className="w-full h-full object-cover rounded-lg" />
              ) : (
                <span className="text-sm sm:text-base font-bold text-gray-500">{studentName.charAt(0)}</span>
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-sm sm:text-base font-semibold text-gray-900">{studentName}</h3>
              <div className="flex flex-wrap gap-2 mt-1 text-[9px] sm:text-xs text-gray-500">
                <span><Hash size={10} className="inline mr-0.5" />{admissionNo}</span>
                <span>•</span>
                <span><GraduationCap size={10} className="inline mr-0.5" />{className}</span>
                <span>•</span>
                <span><Calendar size={10} className="inline mr-0.5" />{sessionName} - {termName}</span>
              </div>
            </div>
          </div>

          {/* Performance Stats - 4 compact cards */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            <div className="bg-blue-50 rounded-lg p-2 text-center">
              <div className="text-sm font-bold text-blue-700">{result.percentage || 0}%</div>
              <div className="text-[8px] text-gray-500">Score</div>
            </div>
            <div className="bg-green-50 rounded-lg p-2 text-center">
              <div className="text-sm font-bold text-green-700">{renderGradeBadge(result.overall_grade)}</div>
              <div className="text-[8px] text-gray-500">Grade</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-2 text-center">
              <div className="text-[9px] sm:text-xs font-bold text-purple-700">{result.position_in_class || '—'}/{result.number_of_pupils_in_class || '—'}</div>
              <div className="text-[8px] text-gray-500">Position</div>
            </div>
            <div className={`rounded-lg p-2 text-center ${result.is_promoted ? 'bg-green-50' : 'bg-yellow-50'}`}>
              <div className={`text-[9px] sm:text-xs font-bold ${result.is_promoted ? 'text-green-700' : 'text-yellow-700'}`}>
                {result.is_promoted ? 'Promoted' : 'Not'}
              </div>
              <div className="text-[8px] text-gray-500">Status</div>
            </div>
          </div>

          {/* Subject Scores Table - Scrollable */}
          <div className="mb-4">
            <h4 className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Subject Scores</h4>
            {(result.subject_scores || []).length === 0 ? (
              <p className="text-gray-400 text-xs italic">No subject scores recorded.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-[10px] sm:text-xs border-collapse">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-1.5 px-2 text-left font-medium text-gray-600">Subject</th>
                      <th className="py-1.5 px-2 text-center font-medium text-gray-600">CA</th>
                      <th className="py-1.5 px-2 text-center font-medium text-gray-600">Exam</th>
                      <th className="py-1.5 px-2 text-center font-medium text-gray-600">Total</th>
                      <th className="py-1.5 px-2 text-center font-medium text-gray-600">Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(result.subject_scores || []).map((score, idx) => {
                      const subjectName = score.subject?.name || score.subject?.subject_name || 'N/A';
                      return (
                        <tr key={idx} className="border-b border-gray-50">
                          <td className="py-1.5 px-2 font-medium">{subjectName}</td>
                          <td className="py-1.5 px-2 text-center">{score.ca_score || 0}</td>
                          <td className="py-1.5 px-2 text-center">{score.exam_score || 0}</td>
                          <td className="py-1.5 px-2 text-center font-bold">{score.total_score || 0}</td>
                          <td className="py-1.5 px-2 text-center"><GradeBadge grade={score.grade} /></td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot className="bg-gray-50 font-semibold">
                    <tr>
                      <td className="py-1.5 px-2">TOTAL</td>
                      <td className="py-1.5 px-2 text-center">{result.total_ca_score || 0}</td>
                      <td className="py-1.5 px-2 text-center">{result.total_exam_score || 0}</td>
                      <td className="py-1.5 px-2 text-center text-blue-700">{result.overall_total_score || 0}</td>
                      <td className="py-1.5 px-2 text-center">{renderGradeBadge(result.overall_grade)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>

          {/* Teacher Comments */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-[9px] font-semibold text-gray-500 mb-1">Teacher's Comment</p>
              <p className="text-xs text-gray-700">{result.class_teacher_comment || 'No comment.'}</p>
              <p className="text-[9px] text-gray-400 mt-1">— {classTeacherName}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-[9px] font-semibold text-gray-500 mb-1">Headmaster's Comment</p>
              <p className="text-xs text-gray-700">{result.headmaster_comment || 'No comment.'}</p>
              <p className="text-[9px] text-gray-400 mt-1">— {headmasterName}</p>
            </div>
          </div>

          {/* Next Term Info */}
          {(result.next_term_begins_on || result.next_term_fees) && (
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <p className="text-[9px] font-semibold text-gray-500 mb-2">Next Term Info</p>
              <div className="grid grid-cols-2 gap-3">
                {result.next_term_begins_on && (
                  <div><p className="text-[8px] text-gray-400">Begins On</p><p className="text-xs font-medium">{formatDate(result.next_term_begins_on)}</p></div>
                )}
                {result.next_term_fees && (
                  <div><p className="text-[8px] text-gray-400">Fees</p><p className="text-xs font-bold text-green-600">₦{parseFloat(result.next_term_fees).toLocaleString()}</p></div>
                )}
              </div>
            </div>
          )}

          <button onClick={onClose} className="w-full py-2 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-200 transition-colors">Close</button>
        </div>
      </div>
    </div>
  );
};

// =====================
// MAIN STUDENT DASHBOARD
// =====================
const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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
      setStatistics(data.statistics || { total_results: 0, published_results: 0, average_percentage: 0 });
    } catch (err) {
      console.error('Error loading student data:', err);
      setError('Could not load your profile. Please contact the school administrator.');
    } finally {
      setLoading(false);
    }
  };

  const extractDisplayName = (obj) => {
    if (!obj) return 'Unknown';
    if (obj.get_full_name) return obj.get_full_name;
    if (obj.full_name) return obj.full_name;
    if (obj.name) return obj.name;
    if (obj.user) {
      if (obj.user.get_full_name) return obj.user.get_full_name;
      if (obj.user.first_name || obj.user.last_name) return `${obj.user.first_name || ''} ${obj.user.last_name || ''}`.trim();
      if (obj.user.username) return obj.user.username;
    }
    if (obj.first_name || obj.last_name) return `${obj.first_name || ''} ${obj.last_name || ''}`.trim();
    if (obj.username) return obj.username;
    if (obj.email) return obj.email.split('@')[0];
    return 'Unknown';
  };

  const handleViewResult = async (result) => {
    try {
      setModalLoading(true);
      const fullResult = await resultService.getStudentResult(result.id);
      setSelectedResult(fullResult);
      setShowViewModal(true);
    } catch (err) {
      console.error('Error fetching result details:', err);
      setError('Failed to load result details.');
    } finally {
      setModalLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(amount || 0);
  };

  if (loading) {
    return (
      <StudentLayout>
        <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-3"></div>
            <p className="text-gray-400 text-sm">Loading your dashboard...</p>
          </div>
        </div>
      </StudentLayout>
    );
  }

  if (error || !studentProfile) {
    return (
      <StudentLayout>
        <div className="min-h-screen bg-gray-50 p-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center max-w-md mx-auto mt-20">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <XCircle className="text-red-600" size={24} />
            </div>
            <h2 className="text-base font-bold text-red-800 mb-2">Error</h2>
            <p className="text-xs text-red-600 mb-5">{error || 'Student profile not found'}</p>
            <button onClick={() => window.location.reload()} className="px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-medium">Try Again</button>
          </div>
        </div>
      </StudentLayout>
    );
  }

  const student = studentProfile;
  const studentUser = student.user || {};
  const fullName = `${studentUser.first_name || ''} ${studentUser.last_name || ''}`.trim() || 'Student';
  const feeSummary = student.fee_summary || {};
  const paidPct = feeSummary.total_fee > 0 ? Math.round((feeSummary.paid / feeSummary.total_fee) * 100) : 0;

  return (
    <StudentLayout>
      <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6 space-y-4 pb-10">
        
        {/* Welcome Header - Compact */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                {student.student_image_url ? (
                  <img src={student.student_image_url} alt={fullName} className="w-full h-full rounded-xl object-cover" />
                ) : (
                  <User size={18} className="text-gray-500" />
                )}
              </div>
              <div>
                <h1 className="text-sm sm:text-base font-bold text-gray-800">Welcome, {studentUser.first_name || 'Student'}!</h1>
                <p className="text-[10px] sm:text-xs text-gray-400">Student Dashboard</p>
                <div className="flex flex-wrap gap-2 mt-0.5 text-[9px] text-gray-400">
                  <span>Adm: {student.admission_number}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => navigate('/library')} className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-900 text-white rounded-xl text-[10px] sm:text-xs font-medium hover:bg-gray-700 transition-colors">
                <BookOpen size={12} /> Library
              </button>
              <button onClick={logout} className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-xl text-[10px] sm:text-xs font-medium hover:bg-gray-200 transition-colors">
                <LogOut size={12} /> Logout
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards - 4 cards that shrink */}
        <div className="grid grid-cols-4 gap-2">
          <StatCard label="Class" value={student.class_level?.name || '—'} icon={<GraduationCap size={12} />} color="bg-blue-100 text-blue-600" />
          <StatCard label="Results" value={statistics.published_results} icon={<Award size={12} />} color="bg-green-100 text-green-600" />
          <StatCard label="Avg Score" value={`${statistics.average_percentage.toFixed(1)}%`} icon={<TrendingUp size={12} />} color="bg-purple-100 text-purple-600" />
          <StatCard label="Balance" value={formatCurrency(feeSummary.balance || 0)} icon={<DollarSign size={12} />} color="bg-yellow-100 text-yellow-600" />
        </div>

        {/* Fee Progress Bar - Compact */}
        {feeSummary.total_fee > 0 && (
          <div className="bg-white rounded-xl border border-gray-100 p-3 shadow-sm">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[9px] font-medium text-gray-500">Fee Progress</span>
              <span className="text-[9px] font-bold text-gray-700">{paidPct}%</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: `${paidPct}%` }}></div>
            </div>
            <div className="flex justify-between mt-1 text-[8px] text-gray-400">
              <span>Paid: {formatCurrency(feeSummary.paid)}</span>
              <span>Total: {formatCurrency(feeSummary.total_fee)}</span>
            </div>
            <div className="mt-2">
              <FeeBadge feeStatus={student.fee_status} />
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex gap-4">
            <button onClick={() => setActiveTab('profile')} className={`pb-2 text-[11px] sm:text-sm font-medium transition-colors ${activeTab === 'profile' ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-500'}`}>
              <User size={12} className="inline mr-1" /> Profile
            </button>
            <button onClick={() => setActiveTab('results')} className={`pb-2 text-[11px] sm:text-sm font-medium transition-colors ${activeTab === 'results' ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-500'}`}>
              <Award size={12} className="inline mr-1" /> Results ({results.length})
            </button>
          </div>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-4">
            <Section title="Personal Info" icon={<User size={12} />}>
              <div className="grid grid-cols-2 gap-2">
                <InfoRow label="Full Name" value={fullName} />
                <InfoRow label="Admission No" value={student.admission_number} />
                <InfoRow label="Student ID" value={student.student_id} />
                <InfoRow label="Reg Number" value={studentUser.registration_number} />
                <InfoRow label="Email" value={studentUser.email} />
                <InfoRow label="Phone" value={studentUser.phone_number} />
                <InfoRow label="Gender" value={studentUser.gender} />
                <InfoRow label="Class" value={student.class_level?.name} />
                <InfoRow label="Stream" value={student.stream && student.stream !== 'none' ? student.stream.charAt(0).toUpperCase() + student.stream.slice(1) : 'N/A'} />
                <InfoRow label="House" value={student.house && student.house !== 'none' ? student.house : 'N/A'} />
              </div>
            </Section>

            <Section title="Contact Info" icon={<Home size={12} />}>
              <div className="grid grid-cols-2 gap-2">
                <InfoRow label="Address" value={studentUser.address} />
                <InfoRow label="City" value={studentUser.city} />
                <InfoRow label="State" value={studentUser.state_of_origin} />
                <InfoRow label="LGA" value={studentUser.lga} />
              </div>
            </Section>

            <Section title="Health Info" icon={<Heart size={12} />}>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div className="bg-red-50 rounded-lg p-2 text-center">
                  <div className="text-[8px] text-red-600">Blood</div>
                  <div className="text-xs font-bold">{student.blood_group || '—'}</div>
                </div>
                <div className="bg-red-50 rounded-lg p-2 text-center">
                  <div className="text-[8px] text-red-600">Genotype</div>
                  <div className="text-xs font-bold">{student.genotype || '—'}</div>
                </div>
              </div>
              <InfoRow label="Allergies" value={student.has_allergies ? (student.allergy_details || 'Yes') : 'No'} />
              <InfoRow label="Medical Conditions" value={student.medical_conditions} />
            </Section>

            <Section title="Emergency Contact" icon={<Phone size={12} />}>
              <div className="grid grid-cols-2 gap-2">
                <InfoRow label="Name" value={student.emergency_contact_name} />
                <InfoRow label="Phone" value={student.emergency_contact_phone} />
                <InfoRow label="Relationship" value={student.emergency_contact_relationship} />
              </div>
            </Section>
          </div>
        )}

        {/* Results Tab - 2 Cards per row on mobile */}
        {activeTab === 'results' && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
              <h2 className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                <Award size={12} /> My Results ({results.length})
              </h2>
            </div>
            <div className="p-3 sm:p-4">
              {results.length === 0 ? (
                <div className="text-center py-8">
                  <FileText size={32} className="mx-auto text-gray-200 mb-2" />
                  <p className="text-gray-400 text-xs">No results available yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {results.map(result => (
                    <div key={result.id} className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm hover:shadow-md transition-all">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-semibold text-gray-800 text-xs">{result.session?.name || 'Session'}</div>
                          <div className="text-[9px] text-gray-400">{result.term?.name || 'Term'}</div>
                        </div>
                        <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[8px] font-medium ${result.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {result.is_published ? <CheckCircle size={8} /> : <Clock size={8} />}{result.is_published ? 'Published' : 'Draft'}
                        </span>
                      </div>
                      <div className="space-y-1 mb-3">
                        <div className="flex justify-between text-[9px]">
                          <span className="text-gray-400">Score</span>
                          <span className="font-bold text-blue-600">{result.percentage || 0}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] text-gray-400">Grade</span>
                          <GradeBadge grade={result.overall_grade} />
                        </div>
                        <div className="flex justify-between text-[9px]">
                          <span className="text-gray-400">Position</span>
                          <span className="font-medium">{result.position_in_class ? `${result.position_in_class}/${result.number_of_pupils_in_class}` : '—'}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleViewResult(result)} 
                        disabled={modalLoading} 
                        className="w-full py-1.5 bg-gray-100 text-gray-600 rounded-lg text-[9px] font-medium flex items-center justify-center gap-1 hover:bg-gray-200 transition-colors"
                      >
                        {modalLoading ? <div className="animate-spin rounded-full h-2 w-2 border-b-2 border-gray-600"></div> : <><Eye size={10} /> View</>}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Result Modal */}
        {showViewModal && selectedResult && (
          <ViewResultModal 
            result={selectedResult} 
            onClose={() => setShowViewModal(false)} 
            renderGradeBadge={GradeBadge} 
            extractDisplayName={extractDisplayName} 
          />
        )}
      </div>
    </StudentLayout>
  );
};

export default StudentDashboard;