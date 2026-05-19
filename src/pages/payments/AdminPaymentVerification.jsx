// // /**
// //  * Admin Payment Verification Page
// //  * View and verify manual payments (bank transfers)
// //  */

// // import React, { useState, useEffect } from 'react';
// // import { useNavigate, Link } from 'react-router-dom';
// // import DashboardLayout from '../../components/dashboard/DashboardLayout';
// // import Alert from '../../components/common/Alert';
// // import Button from '../../components/common/Button';
// // import Modal from '../../components/common/modal';
// // import {
// //   RefreshCw,
// //   Eye,
// //   CheckCircle,
// //   XCircle,
// //   Clock,
// //   AlertCircle,
// //   User,
// //   Mail,
// //   Phone,
// //   DollarSign,
// //   Banknote,
// //   FileText,
// //   Image,
// //   Search,
// //   Filter,
// //   ChevronLeft,
// //   ChevronRight,
// //   Building2,
// //   GraduationCap
// // } from 'lucide-react';
// // import { getPaymentHistory, verifyManualPayment } from '../../services/paymentService';
// // import useAuth from '../../hooks/useAuth';

// // const AdminPaymentVerification = () => {
// //   const navigate = useNavigate();
// //   const { user } = useAuth();
// //   const isAdmin = ['head', 'hm', 'principal', 'vice_principal', 'accountant'].includes(user?.role);

// //   // States
// //   const [payments, setPayments] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState('');
// //   const [success, setSuccess] = useState('');
// //   const [selectedPayment, setSelectedPayment] = useState(null);
// //   const [showDetailModal, setShowDetailModal] = useState(false);
// //   const [showVerifyModal, setShowVerifyModal] = useState(false);
// //   const [verificationNotes, setVerificationNotes] = useState('');
// //   const [actionLoading, setActionLoading] = useState(false);
// //   const [filterStatus, setFilterStatus] = useState('pending');
// //   const [searchTerm, setSearchTerm] = useState('');
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const [totalPages, setTotalPages] = useState(1);
// //   const itemsPerPage = 10;

// //   useEffect(() => {
// //     if (isAdmin) {
// //       loadPayments();
// //     }
// //   }, [filterStatus, currentPage]);

// //   const loadPayments = async () => {
// //     try {
// //       setLoading(true);
// //       setError('');
// //       const params = {
// //         page: currentPage,
// //         limit: itemsPerPage,
// //         payment_method: 'bank_transfer'
// //       };
// //       if (filterStatus !== 'all') {
// //         params.status = filterStatus;
// //       }
// //       if (searchTerm) {
// //         params.search = searchTerm;
// //       }
      
// //       const data = await getPaymentHistory(params);
// //       console.log('Payment history data:', data);
// //       setPayments(data.results || []);
// //       setTotalPages(data.total_pages || 1);
// //     } catch (err) {
// //       console.error('Error loading payments:', err);
// //       setError('Failed to load payment requests');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleViewPayment = (payment) => {
// //     // Student details are already in the payment object from the API
// //     console.log('Selected payment:', payment);
// //     setSelectedPayment(payment);
// //     setShowDetailModal(true);
// //   };

// //   const handleVerifyPayment = (payment) => {
// //     setSelectedPayment(payment);
// //     setVerificationNotes('');
// //     setShowVerifyModal(true);
// //   };

// //   const confirmVerification = async (status) => {
// //     if (!selectedPayment) return;
// //     try {
// //       setActionLoading(true);
// //       const result = await verifyManualPayment({
// //         payment_id: selectedPayment.id,
// //         status: status,
// //         verification_notes: verificationNotes || (status === 'success' ? 'Payment verified by admin' : 'Payment rejected - insufficient evidence')
// //       });
      
// //       setSuccess(`Payment ${status === 'success' ? 'approved' : 'rejected'} successfully!`);
// //       setShowVerifyModal(false);
// //       setSelectedPayment(null);
// //       await loadPayments();
// //       setTimeout(() => setSuccess(''), 3000);
// //     } catch (err) {
// //       setError(err.message || 'Failed to verify payment');
// //     } finally {
// //       setActionLoading(false);
// //     }
// //   };

// //   const formatCurrency = (amount) => {
// //     if (!amount && amount !== 0) return '₦0.00';
// //     return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);
// //   };

// //   const formatDate = (date) => {
// //     if (!date) return 'N/A';
// //     return new Date(date).toLocaleString('en-GB', {
// //       day: 'numeric',
// //       month: 'short',
// //       year: 'numeric',
// //       hour: '2-digit',
// //       minute: '2-digit'
// //     });
// //   };

// //   const getStatusBadge = (status) => {
// //     const config = {
// //       success: { bg: 'bg-green-100 text-green-800', icon: <CheckCircle size={14} />, label: 'Approved' },
// //       pending: { bg: 'bg-yellow-100 text-yellow-800', icon: <Clock size={14} />, label: 'Pending' },
// //       failed: { bg: 'bg-red-100 text-red-800', icon: <XCircle size={14} />, label: 'Rejected' },
// //       cancelled: { bg: 'bg-gray-100 text-gray-800', icon: <XCircle size={14} />, label: 'Cancelled' }
// //     };
// //     const cfg = config[status] || config.pending;
// //     return (
// //       <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.bg}`}>
// //         {cfg.icon} {cfg.label}
// //       </span>
// //     );
// //   };

// //   if (!isAdmin) {
// //     return (
// //       <DashboardLayout title="Access Denied">
// //         <div className="flex items-center justify-center min-h-[60vh]">
// //           <div className="text-center">
// //             <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
// //               <AlertCircle className="text-red-600" size={28} />
// //             </div>
// //             <h1 className="text-xl font-bold text-gray-800 mb-2">Access Denied</h1>
// //             <p className="text-gray-500">Only administrators can access this page.</p>
// //           </div>
// //         </div>
// //       </DashboardLayout>
// //     );
// //   }

// //   const pendingCount = payments.filter(p => p.status === 'pending').length;
// //   const approvedCount = payments.filter(p => p.status === 'success').length;
// //   const rejectedCount = payments.filter(p => p.status === 'failed').length;

// //   return (
// //     <DashboardLayout title="Payment Verification">
// //       <div className="space-y-6 pb-10">
// //         {/* Header */}
// //         <div className="flex flex-col md:flex-row md:items-center justify-between">
// //           <div>
// //             <h1 className="text-2xl font-bold text-gray-800">Payment Verification</h1>
// //             <p className="text-gray-500 text-sm mt-1">Review and verify manual payment requests (Bank Transfers)</p>
// //           </div>
// //           <Button onClick={loadPayments} variant="outline" className="mt-4 md:mt-0 flex items-center gap-2">
// //             <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Refresh
// //           </Button>
// //         </div>

// //         {/* Stats Cards */}
// //         <div className="grid grid-cols-3 gap-4">
// //           <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
// //             <div className="flex items-center justify-between">
// //               <div>
// //                 <p className="text-2xl font-bold text-yellow-700">{pendingCount}</p>
// //                 <p className="text-xs text-yellow-600">Pending Verification</p>
// //               </div>
// //               <Clock size={28} className="text-yellow-500" />
// //             </div>
// //           </div>
// //           <div className="bg-green-50 border border-green-200 rounded-xl p-4">
// //             <div className="flex items-center justify-between">
// //               <div>
// //                 <p className="text-2xl font-bold text-green-700">{approvedCount}</p>
// //                 <p className="text-xs text-green-600">Approved</p>
// //               </div>
// //               <CheckCircle size={28} className="text-green-500" />
// //             </div>
// //           </div>
// //           <div className="bg-red-50 border border-red-200 rounded-xl p-4">
// //             <div className="flex items-center justify-between">
// //               <div>
// //                 <p className="text-2xl font-bold text-red-700">{rejectedCount}</p>
// //                 <p className="text-xs text-red-600">Rejected</p>
// //               </div>
// //               <XCircle size={28} className="text-red-500" />
// //             </div>
// //           </div>
// //         </div>

// //         {/* Filters */}
// //         <div className="bg-white rounded-xl border border-gray-200 p-4">
// //           <div className="flex flex-col md:flex-row gap-4">
// //             <div className="flex-1 relative">
// //               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
// //               <input
// //                 type="text"
// //                 value={searchTerm}
// //                 onChange={(e) => setSearchTerm(e.target.value)}
// //                 onKeyPress={(e) => e.key === 'Enter' && loadPayments()}
// //                 placeholder="Search by student name, admission number, or reference..."
// //                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
// //               />
// //             </div>
// //             <select
// //               value={filterStatus}
// //               onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
// //               className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
// //             >
// //               <option value="pending">Pending</option>
// //               <option value="success">Approved</option>
// //               <option value="failed">Rejected</option>
// //               <option value="all">All Payments</option>
// //             </select>
// //             <Button onClick={loadPayments} className="bg-blue-600 hover:bg-blue-700 text-white">
// //               <Filter size={16} className="mr-2" /> Apply Filters
// //             </Button>
// //           </div>
// //         </div>

// //         {/* Error/Success Alerts */}
// //         {error && <Alert type="error" message={error} onClose={() => setError('')} />}
// //         {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

// //         {/* Payments Table */}
// //         <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
// //           {loading ? (
// //             <div className="flex justify-center py-12">
// //               <RefreshCw className="animate-spin h-8 w-8 text-blue-500" />
// //             </div>
// //           ) : payments.length === 0 ? (
// //             <div className="text-center py-12">
// //               <Banknote size={48} className="mx-auto text-gray-300 mb-3" />
// //               <p className="text-gray-500">No payment requests found</p>
// //             </div>
// //           ) : (
// //             <div className="overflow-x-auto">
// //               <table className="w-full">
// //                 <thead className="bg-gray-50">
// //                   <tr>
// //                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reference</th>
// //                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
// //                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
// //                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
// //                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
// //                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
// //                   </tr>
// //                 </thead>
// //                 <tbody className="divide-y divide-gray-100">
// //                   {payments.map((payment) => (
// //                     <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
// //                       <td className="px-4 py-3">
// //                         <span className="font-mono text-sm">{payment.reference}</span>
// //                       </td>
// //                       <td className="px-4 py-3">
// //                         <div className="flex items-center gap-2">
// //                           <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
// //                             <User size={14} className="text-blue-600" />
// //                           </div>
// //                           <div>
// //                             <p className="font-medium text-gray-800">{payment.student_name || 'Unknown'}</p>
// //                             <p className="text-xs text-gray-500">Adm: {payment.student_admission || 'N/A'}</p>
// //                           </div>
// //                         </div>
// //                       </td>
// //                       <td className="px-4 py-3">
// //                         <span className="font-bold text-gray-800">{formatCurrency(payment.amount)}</span>
// //                       </td>
// //                       <td className="px-4 py-3">
// //                         {getStatusBadge(payment.status)}
// //                         {payment.verified_at && payment.status === 'success' && (
// //                           <p className="text-xs text-gray-400 mt-1">by {payment.verified_by_name || 'Admin'} on {formatDate(payment.verified_at)}</p>
// //                         )}
// //                       </td>
// //                       <td className="px-4 py-3 text-sm text-gray-500">
// //                         {formatDate(payment.created_at)}
// //                       </td>
// //                       <td className="px-4 py-3">
// //                         <div className="flex gap-2">
// //                           <button
// //                             onClick={() => handleViewPayment(payment)}
// //                             className="p-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
// //                             title="View Details"
// //                           >
// //                             <Eye size={16} />
// //                           </button>
// //                           {payment.status === 'pending' && (
// //                             <button
// //                               onClick={() => handleVerifyPayment(payment)}
// //                               className="p-2 bg-green-100 text-green-600 hover:bg-green-200 rounded-lg transition-colors"
// //                               title="Verify Payment"
// //                             >
// //                               <CheckCircle size={16} />
// //                             </button>
// //                           )}
// //                         </div>
// //                       </td>
// //                     </tr>
// //                   ))}
// //                 </tbody>
// //               </table>
// //             </div>
// //           )}
          
// //           {/* Pagination */}
// //           {totalPages > 1 && (
// //             <div className="px-4 py-3 border-t border-gray-200 flex justify-between items-center">
// //               <p className="text-sm text-gray-500">Page {currentPage} of {totalPages}</p>
// //               <div className="flex gap-2">
// //                 <button
// //                   onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
// //                   disabled={currentPage === 1}
// //                   className="p-2 rounded-lg border border-gray-300 disabled:opacity-50"
// //                 >
// //                   <ChevronLeft size={16} />
// //                 </button>
// //                 <button
// //                   onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
// //                   disabled={currentPage === totalPages}
// //                   className="p-2 rounded-lg border border-gray-300 disabled:opacity-50"
// //                 >
// //                   <ChevronRight size={16} />
// //                 </button>
// //               </div>
// //             </div>
// //           )}
// //         </div>
// //       </div>

// //       {/* Payment Detail Modal */}
// //       <Modal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} title="Payment Details" size="lg">
// //         {selectedPayment && (
// //           <div className="py-4 max-h-[75vh] overflow-y-auto">
// //             {/* Student Information */}
// //             <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-5">
// //               <h3 className="text-sm font-semibold text-blue-800 mb-3 flex items-center gap-2">
// //                 <User size={16} /> Student Information
// //               </h3>
// //               <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
// //                 <div>
// //                   <p className="text-xs text-blue-600">Student Name</p>
// //                   <p className="text-sm font-medium text-gray-800">{selectedPayment.student_name || 'Unknown'}</p>
// //                 </div>
// //                 <div>
// //                   <p className="text-xs text-blue-600">Admission Number</p>
// //                   <p className="text-sm font-medium text-gray-800">{selectedPayment.student_admission || 'N/A'}</p>
// //                 </div>
// //                 <div>
// //                   <p className="text-xs text-blue-600">Class Level</p>
// //                   <p className="text-sm font-medium text-gray-800">{selectedPayment.class_level_name || 'Not assigned'}</p>
// //                 </div>
// //                 <div>
// //                   <p className="text-xs text-blue-600">Student ID</p>
// //                   <p className="text-sm font-medium text-gray-800">{selectedPayment.student_id || 'N/A'}</p>
// //                 </div>
// //               </div>
// //             </div>

// //             {/* Payment Information */}
// //             <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-5">
// //               <h3 className="text-sm font-semibold text-green-800 mb-3 flex items-center gap-2">
// //                 <Banknote size={16} /> Payment Information
// //               </h3>
// //               <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
// //                 <div>
// //                   <p className="text-xs text-green-600">Reference</p>
// //                   <p className="text-sm font-mono font-medium">{selectedPayment.reference}</p>
// //                 </div>
// //                 <div>
// //                   <p className="text-xs text-green-600">Amount</p>
// //                   <p className="text-sm font-bold text-green-700">{formatCurrency(selectedPayment.amount)}</p>
// //                 </div>
// //                 <div>
// //                   <p className="text-xs text-green-600">Payment Method</p>
// //                   <p className="text-sm font-medium capitalize">{selectedPayment.payment_method?.replace('_', ' ')}</p>
// //                 </div>
// //                 <div>
// //                   <p className="text-xs text-green-600">Invoice Number</p>
// //                   <p className="text-sm font-medium">{selectedPayment.invoice_number || 'N/A'}</p>
// //                 </div>
// //                 <div>
// //                   <p className="text-xs text-green-600">Transaction Date</p>
// //                   <p className="text-sm">{formatDate(selectedPayment.transaction_date)}</p>
// //                 </div>
// //                 <div>
// //                   <p className="text-xs text-green-600">Submitted On</p>
// //                   <p className="text-sm">{formatDate(selectedPayment.created_at)}</p>
// //                 </div>
// //                 {selectedPayment.verified_at && (
// //                   <div className="col-span-2">
// //                     <p className="text-xs text-green-600">Verified By / Date</p>
// //                     <p className="text-sm">{selectedPayment.verified_by_name || 'Admin'} on {formatDate(selectedPayment.verified_at)}</p>
// //                   </div>
// //                 )}
// //               </div>
// //             </div>

// //             {/* Bank Transfer Details */}
// //             {selectedPayment.payment_method === 'bank_transfer' && (
// //               <div className="bg-purple-50 border border-purple-200 rounded-xl p-5 mb-5">
// //                 <h3 className="text-sm font-semibold text-purple-800 mb-3 flex items-center gap-2">
// //                   <Building2 size={16} /> Bank Transfer Details
// //                 </h3>
// //                 <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
// //                   <div>
// //                     <p className="text-xs text-purple-600">Bank Name</p>
// //                     <p className="text-sm font-medium">{selectedPayment.bank_name || 'N/A'}</p>
// //                   </div>
// //                   <div>
// //                     <p className="text-xs text-purple-600">Account Name</p>
// //                     <p className="text-sm font-medium">{selectedPayment.account_name || 'N/A'}</p>
// //                   </div>
// //                   <div>
// //                     <p className="text-xs text-purple-600">Account Number</p>
// //                     <p className="text-sm font-medium">{selectedPayment.account_number || 'N/A'}</p>
// //                   </div>
// //                 </div>
// //                 {selectedPayment.notes && (
// //                   <div className="mt-3 pt-3 border-t border-purple-200">
// //                     <p className="text-xs text-purple-600">Payment Notes</p>
// //                     <p className="text-sm text-gray-700">{selectedPayment.notes}</p>
// //                   </div>
// //                 )}
// //                 {selectedPayment.verification_notes && (
// //                   <div className="mt-3 pt-3 border-t border-purple-200">
// //                     <p className="text-xs text-purple-600">Verification Notes</p>
// //                     <p className="text-sm text-gray-700">{selectedPayment.verification_notes}</p>
// //                   </div>
// //                 )}
// //               </div>
// //             )}

// //             {/* Evidence Image/File */}
// //             {selectedPayment.payment_evidence && (
// //               <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
// //                 <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
// //                   <Image size={16} /> Payment Evidence
// //                 </h3>
// //                 {selectedPayment.payment_evidence_url ? (
// //                   <div className="flex justify-center">
// //                     <img 
// //                       src={selectedPayment.payment_evidence_url} 
// //                       alt="Payment Evidence" 
// //                       className="max-w-full max-h-64 rounded-lg border"
// //                       onError={(e) => { e.target.style.display = 'none'; }}
// //                     />
// //                   </div>
// //                 ) : (
// //                   <a 
// //                     href={selectedPayment.payment_evidence} 
// //                     target="_blank" 
// //                     rel="noopener noreferrer"
// //                     className="text-blue-600 hover:text-blue-700 flex items-center gap-2"
// //                   >
// //                     <FileText size={16} /> View Document
// //                   </a>
// //                 )}
// //               </div>
// //             )}

// //             {/* Action Buttons */}
// //             <div className="flex gap-3 mt-6 pt-4 border-t">
// //               <button onClick={() => setShowDetailModal(false)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
// //                 Close
// //               </button>
// //               {selectedPayment.status === 'pending' && (
// //                 <button
// //                   onClick={() => {
// //                     setShowDetailModal(false);
// //                     handleVerifyPayment(selectedPayment);
// //                   }}
// //                   className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
// //                 >
// //                   <CheckCircle size={16} /> Verify Payment
// //                 </button>
// //               )}
// //             </div>
// //           </div>
// //         )}
// //       </Modal>

// //       {/* Verification Modal */}
// //       <Modal isOpen={showVerifyModal} onClose={() => setShowVerifyModal(false)} title="Verify Payment" size="md">
// //         {selectedPayment && (
// //           <div className="py-4 space-y-4">
// //             <div className="bg-gray-50 rounded-xl p-4">
// //               <div className="flex justify-between mb-2">
// //                 <span className="text-gray-600">Student:</span>
// //                 <span className="font-medium">{selectedPayment.student_name}</span>
// //               </div>
// //               <div className="flex justify-between mb-2">
// //                 <span className="text-gray-600">Amount:</span>
// //                 <span className="font-bold text-green-600">{formatCurrency(selectedPayment.amount)}</span>
// //               </div>
// //               <div className="flex justify-between">
// //                 <span className="text-gray-600">Reference:</span>
// //                 <span className="font-mono text-sm">{selectedPayment.reference}</span>
// //               </div>
// //             </div>

// //             <div>
// //               <label className="block text-sm font-medium text-gray-700 mb-2">Verification Notes (Optional)</label>
// //               <textarea
// //                 value={verificationNotes}
// //                 onChange={(e) => setVerificationNotes(e.target.value)}
// //                 rows="3"
// //                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
// //                 placeholder="Add notes about this verification..."
// //               />
// //             </div>

// //             <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-sm text-yellow-800">
// //               <p className="font-medium mb-1">⚠️ Important:</p>
// //               <p>• Verify that the payment matches the bank transfer details</p>
// //               <p>• Check the payment evidence if provided</p>
// //               <p>• Confirm the amount matches the invoice balance</p>
// //             </div>

// //             <div className="flex gap-3 pt-4">
// //               <button
// //                 onClick={() => setShowVerifyModal(false)}
// //                 className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
// //               >
// //                 Cancel
// //               </button>
// //               <button
// //                 onClick={() => confirmVerification('failed')}
// //                 className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-2"
// //                 disabled={actionLoading}
// //               >
// //                 <XCircle size={16} /> Reject
// //               </button>
// //               <button
// //                 onClick={() => confirmVerification('success')}
// //                 className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
// //                 disabled={actionLoading}
// //               >
// //                 {actionLoading ? <RefreshCw size={16} className="animate-spin" /> : <CheckCircle size={16} />}
// //                 Approve
// //               </button>
// //             </div>
// //           </div>
// //         )}
// //       </Modal>
// //     </DashboardLayout>
// //   );
// // };

// // export default AdminPaymentVerification;

// /**
//  * Admin Payment Verification Page
//  * View and verify manual payments (bank transfers)
//  * Fully responsive: mobile-first, tablet, desktop
//  */

// import React, { useState, useEffect } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import DashboardLayout from '../../components/dashboard/DashboardLayout';
// import Alert from '../../components/common/Alert';
// import Button from '../../components/common/Button';
// import Modal from '../../components/common/modal';
// import {
//   RefreshCw,
//   Eye,
//   CheckCircle,
//   XCircle,
//   Clock,
//   AlertCircle,
//   User,
//   Mail,
//   Phone,
//   DollarSign,
//   Banknote,
//   FileText,
//   Image,
//   Search,
//   Filter,
//   ChevronLeft,
//   ChevronRight,
//   Building2,
//   GraduationCap,
//   X
// } from 'lucide-react';
// import { getPaymentHistory, verifyManualPayment } from '../../services/paymentService';
// import useAuth from '../../hooks/useAuth';

// const AdminPaymentVerification = () => {
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const isAdmin = ['head', 'hm', 'principal', 'vice_principal', 'accountant'].includes(user?.role);

//   // States
//   const [payments, setPayments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [selectedPayment, setSelectedPayment] = useState(null);
//   const [showDetailModal, setShowDetailModal] = useState(false);
//   const [showVerifyModal, setShowVerifyModal] = useState(false);
//   const [verificationNotes, setVerificationNotes] = useState('');
//   const [actionLoading, setActionLoading] = useState(false);
//   const [filterStatus, setFilterStatus] = useState('pending');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [showMobileFilter, setShowMobileFilter] = useState(false);
//   const itemsPerPage = 10;

//   useEffect(() => {
//     if (isAdmin) {
//       loadPayments();
//     }
//   }, [filterStatus, currentPage]);

//   const loadPayments = async () => {
//     try {
//       setLoading(true);
//       setError('');
//       const params = {
//         page: currentPage,
//         limit: itemsPerPage,
//         payment_method: 'bank_transfer'
//       };
//       if (filterStatus !== 'all') {
//         params.status = filterStatus;
//       }
//       if (searchTerm) {
//         params.search = searchTerm;
//       }
      
//       const data = await getPaymentHistory(params);
//       console.log('Payment history data:', data);
//       setPayments(data.results || []);
//       setTotalPages(data.total_pages || 1);
//     } catch (err) {
//       console.error('Error loading payments:', err);
//       setError('Failed to load payment requests');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleViewPayment = (payment) => {
//     console.log('Selected payment:', payment);
//     setSelectedPayment(payment);
//     setShowDetailModal(true);
//   };

//   const handleVerifyPayment = (payment) => {
//     setSelectedPayment(payment);
//     setVerificationNotes('');
//     setShowVerifyModal(true);
//   };

//   const confirmVerification = async (status) => {
//     if (!selectedPayment) return;
//     try {
//       setActionLoading(true);
//       const result = await verifyManualPayment({
//         payment_id: selectedPayment.id,
//         status: status,
//         verification_notes: verificationNotes || (status === 'success' ? 'Payment verified by admin' : 'Payment rejected - insufficient evidence')
//       });
      
//       setSuccess(`Payment ${status === 'success' ? 'approved' : 'rejected'} successfully!`);
//       setShowVerifyModal(false);
//       setSelectedPayment(null);
//       await loadPayments();
//       setTimeout(() => setSuccess(''), 3000);
//     } catch (err) {
//       setError(err.message || 'Failed to verify payment');
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const formatCurrency = (amount) => {
//     if (!amount && amount !== 0) return '₦0';
//     return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(amount);
//   };

//   const formatDate = (date) => {
//     if (!date) return 'N/A';
//     return new Date(date).toLocaleString('en-GB', {
//       day: 'numeric',
//       month: 'short',
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   const getStatusBadge = (status) => {
//     const config = {
//       success: { bg: 'bg-green-100 text-green-800', icon: <CheckCircle size={12} />, label: 'Approved' },
//       pending: { bg: 'bg-yellow-100 text-yellow-800', icon: <Clock size={12} />, label: 'Pending' },
//       failed: { bg: 'bg-red-100 text-red-800', icon: <XCircle size={12} />, label: 'Rejected' },
//       cancelled: { bg: 'bg-gray-100 text-gray-800', icon: <XCircle size={12} />, label: 'Cancelled' }
//     };
//     const cfg = config[status] || config.pending;
//     return (
//       <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium ${cfg.bg}`}>
//         {cfg.icon} {cfg.label}
//       </span>
//     );
//   };

//   // Mobile Filter Sheet Component
//   const MobileFilterSheet = () => {
//     if (!showMobileFilter) return null;
//     return (
//       <>
//         <div className="fixed inset-0 bg-black/50 z-50 transition-opacity" onClick={() => setShowMobileFilter(false)} />
//         <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 p-5 animate-in slide-in-from-bottom duration-300 max-h-[80vh] overflow-y-auto">
//           <div className="flex justify-between items-center mb-4">
//             <h3 className="font-semibold text-gray-900">Filter Payments</h3>
//             <button onClick={() => setShowMobileFilter(false)} className="p-1 rounded-full hover:bg-gray-100">
//               <X size={20} />
//             </button>
//           </div>
//           <div className="space-y-4">
//             <div>
//               <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
//               <select
//                 value={filterStatus}
//                 onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
//                 className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
//               >
//                 <option value="pending">Pending</option>
//                 <option value="success">Approved</option>
//                 <option value="failed">Rejected</option>
//                 <option value="all">All Payments</option>
//               </select>
//             </div>
//             <div>
//               <label className="block text-xs font-medium text-gray-500 mb-1">Search</label>
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
//                 <input
//                   type="text"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   onKeyPress={(e) => e.key === 'Enter' && loadPayments()}
//                   placeholder="Search by name, admission..."
//                   className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
//                 />
//               </div>
//             </div>
//             <div className="flex gap-3 pt-2">
//               <button 
//                 onClick={() => { loadPayments(); setShowMobileFilter(false); }} 
//                 className="flex-1 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium"
//               >
//                 Apply Filters
//               </button>
//               <button 
//                 onClick={() => { setSearchTerm(''); setFilterStatus('pending'); setCurrentPage(1); setTimeout(loadPayments, 50); setShowMobileFilter(false); }} 
//                 className="px-4 py-2.5 text-red-500 font-medium text-sm"
//               >
//                 Clear
//               </button>
//             </div>
//           </div>
//         </div>
//       </>
//     );
//   };

//   if (!isAdmin) {
//     return (
//       <DashboardLayout title="Access Denied">
//         <div className="flex items-center justify-center min-h-[60vh] px-4">
//           <div className="text-center">
//             <div className="w-14 h-14 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <AlertCircle className="text-red-600" size={28} />
//             </div>
//             <h1 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">Access Denied</h1>
//             <p className="text-gray-500 text-sm sm:text-base">Only administrators can access this page.</p>
//           </div>
//         </div>
//       </DashboardLayout>
//     );
//   }

//   const pendingCount = payments.filter(p => p.status === 'pending').length;
//   const approvedCount = payments.filter(p => p.status === 'success').length;
//   const rejectedCount = payments.filter(p => p.status === 'failed').length;

//   return (
//     <DashboardLayout title="Payment Verification">
//       <div className="space-y-4 sm:space-y-6 pb-12 px-3 sm:px-0">

//         {/* Header with Refresh Button */}
//         <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3">
//           <div>
//             <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Payment Verification</h1>
//             <p className="text-gray-500 text-xs sm:text-sm mt-0.5">Review and verify manual payment requests (Bank Transfers)</p>
//           </div>
//           <button 
//             onClick={loadPayments} 
//             className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 border border-gray-200 bg-white text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
//           >
//             <RefreshCw size={15} className={loading ? 'animate-spin' : ''} /> 
//             <span className="hidden sm:inline">Refresh</span>
//           </button>
//         </div>

//         {/* Stats Cards - 3 columns, responsive */}
//         <div className="grid grid-cols-3 gap-2 sm:gap-4">
//           <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 sm:p-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-xl sm:text-2xl font-bold text-yellow-700">{pendingCount}</p>
//                 <p className="text-[10px] sm:text-xs text-yellow-600">Pending</p>
//               </div>
//               <Clock size={20} className="text-yellow-500 sm:w-6 sm:h-6" />
//             </div>
//           </div>
//           <div className="bg-green-50 border border-green-200 rounded-xl p-3 sm:p-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-xl sm:text-2xl font-bold text-green-700">{approvedCount}</p>
//                 <p className="text-[10px] sm:text-xs text-green-600">Approved</p>
//               </div>
//               <CheckCircle size={20} className="text-green-500 sm:w-6 sm:h-6" />
//             </div>
//           </div>
//           <div className="bg-red-50 border border-red-200 rounded-xl p-3 sm:p-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-xl sm:text-2xl font-bold text-red-700">{rejectedCount}</p>
//                 <p className="text-[10px] sm:text-xs text-red-600">Rejected</p>
//               </div>
//               <XCircle size={20} className="text-red-500 sm:w-6 sm:h-6" />
//             </div>
//           </div>
//         </div>

//         {/* Filters - Desktop (hidden on mobile) */}
//         <div className="hidden sm:block bg-white rounded-xl border border-gray-200 p-4">
//           <div className="flex flex-col md:flex-row gap-3">
//             <div className="flex-1 relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
//               <input
//                 type="text"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 onKeyPress={(e) => e.key === 'Enter' && loadPayments()}
//                 placeholder="Search by student name, admission number, or reference..."
//                 className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
//               />
//             </div>
//             <select
//               value={filterStatus}
//               onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
//               className="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
//             >
//               <option value="pending">Pending</option>
//               <option value="success">Approved</option>
//               <option value="failed">Rejected</option>
//               <option value="all">All Payments</option>
//             </select>
//             <button 
//               onClick={loadPayments} 
//               className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors"
//             >
//               <Filter size={15} /> Apply
//             </button>
//           </div>
//         </div>

//         {/* Mobile Filter Button */}
//         <div className="sm:hidden">
//           <button
//             onClick={() => setShowMobileFilter(true)}
//             className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 bg-white text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
//           >
//             <Filter size={15} /> Filter Payments
//             {(filterStatus !== 'pending' || searchTerm) && (
//               <span className="ml-1 w-2 h-2 bg-blue-500 rounded-full" />
//             )}
//           </button>
//         </div>

//         <MobileFilterSheet />

//         {/* Error/Success Alerts */}
//         {error && <Alert type="error" message={error} onClose={() => setError('')} />}
//         {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

//         {/* Payments Table - Responsive */}
//         <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
//           {loading ? (
//             <div className="flex justify-center py-12">
//               <RefreshCw className="animate-spin h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
//             </div>
//           ) : payments.length === 0 ? (
//             <div className="text-center py-12">
//               <Banknote size={40} className="mx-auto text-gray-300 mb-3 sm:w-12 sm:h-12" />
//               <p className="text-gray-400 text-sm sm:text-base">No payment requests found</p>
//             </div>
//           ) : (
//             <>
//               {/* Desktop Table - hidden on mobile */}
//               <div className="hidden md:block overflow-x-auto">
//                 <table className="w-full">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reference</th>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-100">
//                     {payments.map((payment) => (
//                       <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
//                         <td className="px-4 py-3">
//                           <span className="font-mono text-xs sm:text-sm">{payment.reference?.slice(-8) || payment.reference}</span>
//                         </td>
//                         <td className="px-4 py-3">
//                           <div className="flex items-center gap-2">
//                             <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
//                               <User size={12} className="text-blue-600 sm:w-3.5 sm:h-3.5" />
//                             </div>
//                             <div>
//                               <p className="font-medium text-gray-800 text-sm">{payment.student_name || 'Unknown'}</p>
//                               <p className="text-[10px] sm:text-xs text-gray-400">ID: {payment.student_admission || 'N/A'}</p>
//                             </div>
//                           </div>
//                         </td>
//                         <td className="px-4 py-3">
//                           <span className="font-bold text-gray-800 text-sm">{formatCurrency(payment.amount)}</span>
//                         </td>
//                         <td className="px-4 py-3">
//                           {getStatusBadge(payment.status)}
//                         </td>
//                         <td className="px-4 py-3 text-xs text-gray-500">
//                           {formatDate(payment.created_at)}
//                         </td>
//                         <td className="px-4 py-3">
//                           <div className="flex gap-2">
//                             <button
//                               onClick={() => handleViewPayment(payment)}
//                               className="p-1.5 sm:p-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
//                               title="View Details"
//                             >
//                               <Eye size={14} />
//                             </button>
//                             {payment.status === 'pending' && (
//                               <button
//                                 onClick={() => handleVerifyPayment(payment)}
//                                 className="p-1.5 sm:p-2 bg-green-100 text-green-600 hover:bg-green-200 rounded-lg transition-colors"
//                                 title="Verify Payment"
//                               >
//                                 <CheckCircle size={14} />
//                               </button>
//                             )}
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>

//               {/* Mobile Cards - visible on mobile */}
//               <div className="md:hidden divide-y divide-gray-100">
//                 {payments.map((payment) => (
//                   <div key={payment.id} className="p-4 space-y-3">
//                     <div className="flex justify-between items-start">
//                       <div className="flex items-center gap-2">
//                         <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
//                           <User size={14} className="text-blue-600" />
//                         </div>
//                         <div>
//                           <p className="font-medium text-gray-800 text-sm">{payment.student_name || 'Unknown'}</p>
//                           <p className="text-xs text-gray-400">ID: {payment.student_admission || 'N/A'}</p>
//                         </div>
//                       </div>
//                       {getStatusBadge(payment.status)}
//                     </div>
                    
//                     <div className="grid grid-cols-2 gap-2 text-sm">
//                       <div>
//                         <p className="text-xs text-gray-400">Reference</p>
//                         <p className="font-mono text-xs font-medium">{payment.reference?.slice(-8) || payment.reference}</p>
//                       </div>
//                       <div>
//                         <p className="text-xs text-gray-400">Amount</p>
//                         <p className="font-bold text-gray-800">{formatCurrency(payment.amount)}</p>
//                       </div>
//                       <div>
//                         <p className="text-xs text-gray-400">Date</p>
//                         <p className="text-xs">{formatDate(payment.created_at)}</p>
//                       </div>
//                     </div>
                    
//                     <div className="flex gap-2 pt-2">
//                       <button
//                         onClick={() => handleViewPayment(payment)}
//                         className="flex-1 flex items-center justify-center gap-1 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium"
//                       >
//                         <Eye size={14} /> View
//                       </button>
//                       {payment.status === 'pending' && (
//                         <button
//                           onClick={() => handleVerifyPayment(payment)}
//                           className="flex-1 flex items-center justify-center gap-1 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium"
//                         >
//                           <CheckCircle size={14} /> Verify
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </>
//           )}
          
//           {/* Pagination */}
//           {totalPages > 1 && (
//             <div className="px-4 py-3 border-t border-gray-200 flex flex-col xs:flex-row xs:justify-between xs:items-center gap-2">
//               <p className="text-xs sm:text-sm text-gray-500 text-center xs:text-left">Page {currentPage} of {totalPages}</p>
//               <div className="flex gap-2 justify-center">
//                 <button
//                   onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
//                   disabled={currentPage === 1}
//                   className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 hover:bg-gray-50 transition-colors"
//                 >
//                   <ChevronLeft size={14} />
//                 </button>
//                 <button
//                   onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
//                   disabled={currentPage === totalPages}
//                   className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 hover:bg-gray-50 transition-colors"
//                 >
//                   <ChevronRight size={14} />
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Payment Detail Modal - Responsive */}
//       <Modal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} title="Payment Details" size="lg">
//         {selectedPayment && (
//           <div className="py-4 max-h-[75vh] overflow-y-auto px-1">
//             {/* Student Information */}
//             <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-5 mb-4 sm:mb-5">
//               <h3 className="text-xs sm:text-sm font-semibold text-blue-800 mb-3 flex items-center gap-2">
//                 <User size={14} /> Student Information
//               </h3>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                 <div>
//                   <p className="text-[10px] sm:text-xs text-blue-600">Student Name</p>
//                   <p className="text-sm font-medium text-gray-800">{selectedPayment.student_name || 'Unknown'}</p>
//                 </div>
//                 <div>
//                   <p className="text-[10px] sm:text-xs text-blue-600">Admission Number</p>
//                   <p className="text-sm font-medium text-gray-800">{selectedPayment.student_admission || 'N/A'}</p>
//                 </div>
//                 <div>
//                   <p className="text-[10px] sm:text-xs text-blue-600">Class Level</p>
//                   <p className="text-sm font-medium text-gray-800">{selectedPayment.class_level_name || 'Not assigned'}</p>
//                 </div>
//                 <div>
//                   <p className="text-[10px] sm:text-xs text-blue-600">Student ID</p>
//                   <p className="text-sm font-medium text-gray-800">{selectedPayment.student_id || 'N/A'}</p>
//                 </div>
//               </div>
//             </div>

//             {/* Payment Information */}
//             <div className="bg-green-50 border border-green-200 rounded-xl p-4 sm:p-5 mb-4 sm:mb-5">
//               <h3 className="text-xs sm:text-sm font-semibold text-green-800 mb-3 flex items-center gap-2">
//                 <Banknote size={14} /> Payment Information
//               </h3>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                 <div>
//                   <p className="text-[10px] sm:text-xs text-green-600">Reference</p>
//                   <p className="text-xs sm:text-sm font-mono font-medium break-all">{selectedPayment.reference}</p>
//                 </div>
//                 <div>
//                   <p className="text-[10px] sm:text-xs text-green-600">Amount</p>
//                   <p className="text-base sm:text-lg font-bold text-green-700">{formatCurrency(selectedPayment.amount)}</p>
//                 </div>
//                 <div>
//                   <p className="text-[10px] sm:text-xs text-green-600">Payment Method</p>
//                   <p className="text-sm font-medium capitalize">{selectedPayment.payment_method?.replace('_', ' ')}</p>
//                 </div>
//                 <div>
//                   <p className="text-[10px] sm:text-xs text-green-600">Invoice Number</p>
//                   <p className="text-sm font-medium">{selectedPayment.invoice_number || 'N/A'}</p>
//                 </div>
//                 <div>
//                   <p className="text-[10px] sm:text-xs text-green-600">Transaction Date</p>
//                   <p className="text-xs sm:text-sm">{formatDate(selectedPayment.transaction_date)}</p>
//                 </div>
//                 <div>
//                   <p className="text-[10px] sm:text-xs text-green-600">Submitted On</p>
//                   <p className="text-xs sm:text-sm">{formatDate(selectedPayment.created_at)}</p>
//                 </div>
//                 {selectedPayment.verified_at && (
//                   <div className="col-span-1 sm:col-span-2">
//                     <p className="text-[10px] sm:text-xs text-green-600">Verified By / Date</p>
//                     <p className="text-xs sm:text-sm">{selectedPayment.verified_by_name || 'Admin'} on {formatDate(selectedPayment.verified_at)}</p>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Bank Transfer Details */}
//             {selectedPayment.payment_method === 'bank_transfer' && (
//               <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 sm:p-5 mb-4 sm:mb-5">
//                 <h3 className="text-xs sm:text-sm font-semibold text-purple-800 mb-3 flex items-center gap-2">
//                   <Building2 size={14} /> Bank Transfer Details
//                 </h3>
//                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
//                   <div>
//                     <p className="text-[10px] sm:text-xs text-purple-600">Bank Name</p>
//                     <p className="text-sm font-medium">{selectedPayment.bank_name || 'N/A'}</p>
//                   </div>
//                   <div>
//                     <p className="text-[10px] sm:text-xs text-purple-600">Account Name</p>
//                     <p className="text-sm font-medium">{selectedPayment.account_name || 'N/A'}</p>
//                   </div>
//                   <div>
//                     <p className="text-[10px] sm:text-xs text-purple-600">Account Number</p>
//                     <p className="text-sm font-medium">{selectedPayment.account_number || 'N/A'}</p>
//                   </div>
//                 </div>
//                 {selectedPayment.notes && (
//                   <div className="mt-3 pt-3 border-t border-purple-200">
//                     <p className="text-[10px] sm:text-xs text-purple-600">Payment Notes</p>
//                     <p className="text-xs sm:text-sm text-gray-700">{selectedPayment.notes}</p>
//                   </div>
//                 )}
//                 {selectedPayment.verification_notes && (
//                   <div className="mt-3 pt-3 border-t border-purple-200">
//                     <p className="text-[10px] sm:text-xs text-purple-600">Verification Notes</p>
//                     <p className="text-xs sm:text-sm text-gray-700">{selectedPayment.verification_notes}</p>
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* Evidence Image/File */}
//             {selectedPayment.payment_evidence && (
//               <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 sm:p-5">
//                 <h3 className="text-xs sm:text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
//                   <Image size={14} /> Payment Evidence
//                 </h3>
//                 {selectedPayment.payment_evidence_url ? (
//                   <div className="flex justify-center">
//                     <img 
//                       src={selectedPayment.payment_evidence_url} 
//                       alt="Payment Evidence" 
//                       className="max-w-full max-h-48 sm:max-h-64 rounded-lg border"
//                       onError={(e) => { e.target.style.display = 'none'; }}
//                     />
//                   </div>
//                 ) : (
//                   <a 
//                     href={selectedPayment.payment_evidence} 
//                     target="_blank" 
//                     rel="noopener noreferrer"
//                     className="text-blue-600 hover:text-blue-700 flex items-center gap-2 text-sm"
//                   >
//                     <FileText size={14} /> View Document
//                   </a>
//                 )}
//               </div>
//             )}

//             {/* Action Buttons */}
//             <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-4 border-t">
//               <button 
//                 onClick={() => setShowDetailModal(false)} 
//                 className="order-2 sm:order-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium text-sm"
//               >
//                 Close
//               </button>
//               {selectedPayment.status === 'pending' && (
//                 <button
//                   onClick={() => {
//                     setShowDetailModal(false);
//                     handleVerifyPayment(selectedPayment);
//                   }}
//                   className="order-1 sm:order-2 px-4 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 font-medium text-sm"
//                 >
//                   <CheckCircle size={16} /> Verify Payment
//                 </button>
//               )}
//             </div>
//           </div>
//         )}
//       </Modal>

//       {/* Verification Modal - Responsive */}
//       <Modal isOpen={showVerifyModal} onClose={() => setShowVerifyModal(false)} title="Verify Payment" size="md">
//         {selectedPayment && (
//           <div className="py-4 space-y-4">
//             <div className="bg-gray-50 rounded-xl p-4 space-y-2">
//               <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
//                 <span className="text-gray-600 text-sm">Student:</span>
//                 <span className="font-medium text-gray-800 text-sm">{selectedPayment.student_name}</span>
//               </div>
//               <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
//                 <span className="text-gray-600 text-sm">Amount:</span>
//                 <span className="font-bold text-green-600 text-base">{formatCurrency(selectedPayment.amount)}</span>
//               </div>
//               <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
//                 <span className="text-gray-600 text-sm">Reference:</span>
//                 <span className="font-mono text-xs bg-white px-2 py-0.5 rounded border break-all">{selectedPayment.reference}</span>
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Verification Notes (Optional)</label>
//               <textarea
//                 value={verificationNotes}
//                 onChange={(e) => setVerificationNotes(e.target.value)}
//                 rows={3}
//                 className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
//                 placeholder="Add notes about this verification..."
//               />
//             </div>

//             <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-xs sm:text-sm text-yellow-800">
//               <p className="font-medium mb-1">⚠️ Important:</p>
//               <ul className="list-disc list-inside space-y-0.5 text-[11px] sm:text-xs">
//                 <li>Verify that the payment matches the bank transfer details</li>
//                 <li>Check the payment evidence if provided</li>
//                 <li>Confirm the amount matches the invoice balance</li>
//               </ul>
//             </div>

//             <div className="flex flex-col sm:flex-row gap-3 pt-4">
//               <button
//                 onClick={() => setShowVerifyModal(false)}
//                 className="order-2 sm:order-1 flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium text-sm"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={() => confirmVerification('failed')}
//                 className="order-1 sm:order-2 flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center gap-2 font-medium text-sm"
//                 disabled={actionLoading}
//               >
//                 <XCircle size={16} /> Reject
//               </button>
//               <button
//                 onClick={() => confirmVerification('success')}
//                 className="order-3 flex-1 px-4 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 font-medium text-sm"
//                 disabled={actionLoading}
//               >
//                 {actionLoading ? <RefreshCw size={16} className="animate-spin" /> : <CheckCircle size={16} />}
//                 Approve
//               </button>
//             </div>
//           </div>
//         )}
//       </Modal>
//     </DashboardLayout>
//   );
// };

// export default AdminPaymentVerification;



/**
 * Admin Payment Verification Page
 * View and verify manual payments (bank transfers)
 * Fully responsive: mobile-first, tablet, desktop
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import Alert from '../../components/common/Alert';
import Modal from '../../components/common/modal';
import {
  RefreshCw,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  User,
  Mail,
  Phone,
  DollarSign,
  Banknote,
  FileText,
  Image,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Building2,
  GraduationCap,
  X,
  Grid3x3,
  Table2
} from 'lucide-react';
import { getPaymentHistory, verifyManualPayment } from '../../services/paymentService';
import useAuth from '../../hooks/useAuth';

// ============================================
// DESIGN SYSTEM COMPONENTS
// ============================================

// Typography (Sora font assumed via global CSS)
const Text = ({ variant = 'body', children, className = '' }) => {
  const variants = {
    h1: 'text-2xl md:text-3xl font-bold',
    h2: 'text-xl md:text-2xl font-semibold',
    h3: 'text-lg md:text-xl font-semibold',
    h4: 'text-base md:text-lg font-medium',
    body: 'text-sm md:text-base',
    small: 'text-xs md:text-sm',
    caption: 'text-[10px] md:text-xs',
    tiny: 'text-[9px] md:text-[10px]',
  };
  return <div className={`${variants[variant]} text-gray-800 ${className}`}>{children}</div>;
};

// Primary Button (#D94801)
const Button = ({ children, variant = 'primary', size = 'medium', icon: Icon, onClick, loading, disabled, type = 'button', className = '' }) => {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 ease rounded-xl cursor-pointer';
  const variants = {
    primary: 'bg-[#D94801] text-white hover:bg-[#C24000] active:bg-[#A93600] shadow-sm',
    secondary: 'bg-[#1D2B49] text-white hover:bg-[#24385C] active:bg-[#324A74]',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
    ghost: 'text-gray-600 hover:bg-gray-100',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    success: 'bg-green-600 text-white hover:bg-green-700',
    warning: 'bg-yellow-500 text-white hover:bg-yellow-600',
  };
  const sizes = {
    large: 'h-12 px-5 text-sm',
    medium: 'h-10 px-4 text-sm',
    small: 'h-8 px-3 text-xs',
    tiny: 'h-7 px-2 text-[10px]',
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {loading && <RefreshCw size={14} className="animate-spin" />}
      {Icon && !loading && <Icon size={size === 'tiny' ? 12 : size === 'small' ? 14 : 16} />}
      {children}
    </button>
  );
};

// Card Component
const Card = ({ children, className = '', hover = false }) => (
  <div className={`bg-white rounded-2xl shadow-sm ${hover ? 'transition-shadow duration-200 hover:shadow-md' : ''} ${className}`}>
    {children}
  </div>
);

// Stat Card
const StatCard = ({ title, value, icon: Icon, color, bgColor }) => (
  <Card className={`p-3 border ${bgColor}`}>
    <div className="flex items-center justify-between">
      <div>
        <Text variant="h3" className={`font-bold ${color}`}>{value}</Text>
        <Text variant="tiny" className={`${color} opacity-80`}>{title}</Text>
      </div>
      <Icon size={20} className={color} />
    </div>
  </Card>
);

// Status Badge
const StatusBadge = ({ status }) => {
  const config = {
    success: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle, label: 'Approved' },
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Clock, label: 'Pending' },
    failed: { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle, label: 'Rejected' },
    cancelled: { bg: 'bg-gray-100', text: 'text-gray-600', icon: XCircle, label: 'Cancelled' }
  };
  const c = config[status] || config.pending;
  const Icon = c.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] md:text-[10px] font-medium ${c.bg} ${c.text}`}>
      <Icon size={10} /> {c.label}
    </span>
  );
};

// Mobile Filter Sheet
const MobileFilterSheet = ({ isOpen, onClose, filterStatus, setFilterStatus, searchTerm, setSearchTerm, onApply, onClear }) => {
  const [localStatus, setLocalStatus] = useState(filterStatus);
  const [localSearch, setLocalSearch] = useState(searchTerm);
  
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 transition-opacity" onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 p-5 animate-in slide-in-from-bottom duration-200 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <Text variant="h4" className="font-semibold">Filter Payments</Text>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100"><X size={18} /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
            <select
              value={localStatus}
              onChange={(e) => setLocalStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
            >
              <option value="pending">Pending</option>
              <option value="success">Approved</option>
              <option value="failed">Rejected</option>
              <option value="all">All Payments</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Search by name, admission..."
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
              />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="primary" size="medium" onClick={() => { setFilterStatus(localStatus); setSearchTerm(localSearch); onApply(); onClose(); }} className="flex-1">
              Apply Filters
            </Button>
            <button onClick={() => { setLocalStatus('pending'); setLocalSearch(''); setFilterStatus('pending'); setSearchTerm(''); onClear(); onClose(); }} className="px-4 py-2 text-red-500 font-medium text-sm">
              Clear
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;
  
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-100 sticky bottom-0 bg-white z-10">
      <Button variant="ghost" size="tiny" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
        <ChevronLeft size={14} /> Prev
      </Button>
      <div className="flex gap-1">
        {getPageNumbers().map((page, idx) => (
          page === '...' ? (
            <span key={idx} className="px-2 py-1 text-xs text-gray-400">...</span>
          ) : (
            <button key={idx} onClick={() => onPageChange(page)} className={`min-w-[32px] h-8 rounded-lg text-xs font-medium transition-colors ${currentPage === page ? 'bg-[#D94801] text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
              {page}
            </button>
          )
        ))}
      </div>
      <Button variant="ghost" size="tiny" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
        Next <ChevronRight size={14} />
      </Button>
    </div>
  );
};

// Payment Card Component (for mobile grid view)
const PaymentCard = ({ payment, formatCurrency, formatDate, getStatusBadge, onView, onVerify }) => (
  <Card className="p-3 space-y-2 hover:shadow-md transition-shadow duration-200 h-full">
    <div className="flex justify-between items-start gap-2">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
          <User size={14} className="text-blue-600" />
        </div>
        <div className="flex-1 min-w-0">
          <Text variant="tiny" className="font-bold text-gray-800 truncate">{payment.student_name || 'Unknown'}</Text>
          <Text variant="caption" className="text-gray-400 truncate">ID: {payment.student_admission || 'N/A'}</Text>
        </div>
      </div>
      {getStatusBadge(payment.status)}
    </div>
    
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <Text variant="caption" className="text-gray-400">Reference</Text>
        <Text variant="tiny" className="font-mono font-medium">{payment.reference?.slice(-8) || payment.reference}</Text>
      </div>
      <div className="flex justify-between items-center">
        <Text variant="caption" className="text-gray-400">Amount</Text>
        <Text variant="small" className="font-bold text-[#D94801]">{formatCurrency(payment.amount)}</Text>
      </div>
      <div className="flex justify-between items-center">
        <Text variant="caption" className="text-gray-400">Date</Text>
        <Text variant="tiny" className="text-gray-500">{formatDate(payment.created_at)}</Text>
      </div>
    </div>
    
    <div className="flex gap-2 pt-2">
      <Button variant="outline" size="tiny" onClick={() => onView(payment)} className="flex-1">
        <Eye size={12} /> View
      </Button>
      {payment.status === 'pending' && (
        <Button variant="primary" size="tiny" onClick={() => onVerify(payment)} className="flex-1">
          <CheckCircle size={12} /> Verify
        </Button>
      )}
    </div>
  </Card>
);

// ============================================
// MAIN COMPONENT
// ============================================
const AdminPaymentVerification = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = ['head', 'hm', 'principal', 'vice_principal', 'accountant'].includes(user?.role);

  // States
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verificationNotes, setVerificationNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [viewMode, setViewMode] = useState('table');
  const itemsPerPage = 10;

  // Detect mobile screen
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const loadPayments = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        payment_method: 'bank_transfer'
      };
      if (filterStatus !== 'all') {
        params.status = filterStatus;
      }
      if (searchTerm) {
        params.search = searchTerm;
      }
      
      const data = await getPaymentHistory(params);
      console.log('Payment history data:', data);
      setPayments(data.results || []);
      setTotalPages(data.total_pages || 1);
    } catch (err) {
      console.error('Error loading payments:', err);
      setError('Failed to load payment requests');
    } finally {
      setLoading(false);
    }
  }, [currentPage, filterStatus, searchTerm]);

  useEffect(() => {
    if (isAdmin) {
      loadPayments();
    }
  }, [isAdmin, loadPayments]);

  const handleViewPayment = (payment) => {
    console.log('Selected payment:', payment);
    setSelectedPayment(payment);
    setShowDetailModal(true);
  };

  const handleVerifyPayment = (payment) => {
    setSelectedPayment(payment);
    setVerificationNotes('');
    setShowVerifyModal(true);
  };

  const confirmVerification = async (status) => {
    if (!selectedPayment) return;
    try {
      setActionLoading(true);
      const result = await verifyManualPayment({
        payment_id: selectedPayment.id,
        status: status,
        verification_notes: verificationNotes || (status === 'success' ? 'Payment verified by admin' : 'Payment rejected - insufficient evidence')
      });
      
      setSuccess(`Payment ${status === 'success' ? 'approved' : 'rejected'} successfully!`);
      setShowVerifyModal(false);
      setSelectedPayment(null);
      await loadPayments();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to verify payment');
    } finally {
      setActionLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '₦0';
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(amount);
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const config = {
      success: { bg: 'bg-green-100', text: 'text-green-700', icon: <CheckCircle size={10} />, label: 'Approved' },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: <Clock size={10} />, label: 'Pending' },
      failed: { bg: 'bg-red-100', text: 'text-red-700', icon: <XCircle size={10} />, label: 'Rejected' },
      cancelled: { bg: 'bg-gray-100', text: 'text-gray-600', icon: <XCircle size={10} />, label: 'Cancelled' }
    };
    const cfg = config[status] || config.pending;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] md:text-[10px] font-medium ${cfg.bg} ${cfg.text}`}>
        {cfg.icon} {cfg.label}
      </span>
    );
  };

  const pendingCount = payments.filter(p => p.status === 'pending').length;
  const approvedCount = payments.filter(p => p.status === 'success').length;
  const rejectedCount = payments.filter(p => p.status === 'failed').length;

  const displayViewMode = isMobile ? 'card' : viewMode;

  if (!isAdmin) {
    return (
      <DashboardLayout title="Access Denied">
        <div className="flex items-center justify-center min-h-[60vh] px-4">
          <div className="text-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="text-red-600" size={28} />
            </div>
            <Text variant="h3" className="font-bold text-gray-800 mb-2">Access Denied</Text>
            <Text variant="body" className="text-gray-500">Only administrators can access this page.</Text>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Payment Verification">
      {/* Fixed height container with internal scrolling - only table/card scrolls */}
      <div className="h-[calc(100vh-120px)] flex flex-col px-3 sm:px-4 lg:px-6">
        
        {/* STICKY HEADER SECTION - Everything above the table/card stays fixed */}
        <div className="sticky top-0 z-20 bg-gray-50 -mx-3 sm:-mx-4 lg:-mx-6 px-3 sm:px-4 lg:px-6 pt-4 pb-2">
          
          {/* Alerts */}
          {error && (
            <div className="mb-3">
              <Alert type="error" message={error} onClose={() => setError('')} />
            </div>
          )}
          {success && (
            <div className="mb-3">
              <Alert type="success" message={success} onClose={() => setSuccess('')} />
            </div>
          )}

          {/* Stats Cards - 3 columns */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-3">
            <StatCard title="Pending" value={pendingCount} icon={Clock} color="text-yellow-700" bgColor="border-yellow-200 bg-yellow-50" />
            <StatCard title="Approved" value={approvedCount} icon={CheckCircle} color="text-green-700" bgColor="border-green-200 bg-green-50" />
            <StatCard title="Rejected" value={rejectedCount} icon={XCircle} color="text-red-700" bgColor="border-red-200 bg-red-50" />
          </div>

          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-2 mb-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                onKeyPress={(e) => e.key === 'Enter' && loadPayments()}
                placeholder="Search by student name, admission number, or reference..."
                className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801] focus:border-transparent"
              />
            </div>
            
            {/* Desktop filters */}
            <div className="hidden sm:flex items-center gap-2">
              <select
                value={filterStatus}
                onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
                className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
              >
                <option value="pending">Pending</option>
                <option value="success">Approved</option>
                <option value="failed">Rejected</option>
                <option value="all">All Payments</option>
              </select>
              {(filterStatus !== 'pending' || searchTerm) && (
                <Button variant="ghost" size="tiny" onClick={() => { setSearchTerm(''); setFilterStatus('pending'); setCurrentPage(1); }}>
                  Clear
                </Button>
              )}
              {/* View Toggle (desktop only) */}
              <div className="flex border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-2 transition-colors ${viewMode === 'table' ? 'bg-[#D94801] text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                >
                  <Table2 size={16} />
                </button>
                <button
                  onClick={() => setViewMode('card')}
                  className={`p-2 transition-colors ${viewMode === 'card' ? 'bg-[#D94801] text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                >
                  <Grid3x3 size={16} />
                </button>
              </div>
            </div>
            
            {/* Mobile filter button */}
            <button
              onClick={() => setShowMobileFilter(true)}
              className="sm:hidden flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 bg-white text-gray-700 rounded-xl text-sm font-medium"
            >
              <Filter size={14} /> Filter Payments
              {(filterStatus !== 'pending' || searchTerm) && (
                <span className="w-2 h-2 bg-[#D94801] rounded-full" />
              )}
            </button>
          </div>

          <MobileFilterSheet
            isOpen={showMobileFilter}
            onClose={() => setShowMobileFilter(false)}
            filterStatus={filterStatus}
            setFilterStatus={(val) => { setFilterStatus(val); setCurrentPage(1); }}
            searchTerm={searchTerm}
            setSearchTerm={(val) => { setSearchTerm(val); setCurrentPage(1); }}
            onApply={loadPayments}
            onClear={() => { setSearchTerm(''); setFilterStatus('pending'); setCurrentPage(1); loadPayments(); }}
          />
        </div>

        {/* SCROLLABLE CONTENT SECTION - Only table/card scrolls here */}
        <div className="flex-1 overflow-y-auto min-h-0 -mx-3 sm:-mx-4 lg:-mx-6 px-3 sm:px-4 lg:px-6 pb-4">
          <Card className="overflow-hidden">
            {loading && payments.length === 0 ? (
              <div className="flex justify-center py-12">
                <RefreshCw className="animate-spin h-8 w-8 text-[#D94801]" />
              </div>
            ) : payments.length === 0 ? (
              <div className="text-center py-12">
                <Banknote size={40} className="mx-auto text-gray-300 mb-3" />
                <Text variant="body" className="text-gray-400">No payment requests found</Text>
              </div>
            ) : (
              <>
                {/* Desktop Table View */}
                {displayViewMode === 'table' && !isMobile && (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-100 sticky top-0 z-10">
                        <tr>
                          <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Reference</th>
                          <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Student</th>
                          <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                          <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Date</th>
                          <th className="px-4 py-3 text-right text-[10px] font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {payments.map((payment) => (
                          <tr key={payment.id} className="hover:bg-gray-50 transition-colors duration-150">
                            <td className="px-4 py-3">
                              <Text variant="tiny" className="font-mono">{payment.reference?.slice(-8) || payment.reference}</Text>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                  <User size={12} className="text-blue-600" />
                                </div>
                                <div>
                                  <Text variant="small" className="font-medium text-gray-800">{payment.student_name || 'Unknown'}</Text>
                                  <Text variant="tiny" className="text-gray-400">ID: {payment.student_admission || 'N/A'}</Text>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <Text variant="small" className="font-bold text-[#D94801]">{formatCurrency(payment.amount)}</Text>
                            </td>
                            <td className="px-4 py-3">
                              {getStatusBadge(payment.status)}
                            </td>
                            <td className="px-4 py-3 hidden lg:table-cell">
                              <Text variant="tiny" className="text-gray-500">{formatDate(payment.created_at)}</Text>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button onClick={() => handleViewPayment(payment)} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors" title="View Details">
                                  <Eye size={14} />
                                </button>
                                {payment.status === 'pending' && (
                                  <button onClick={() => handleVerifyPayment(payment)} className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Verify Payment">
                                    <CheckCircle size={14} />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Card View - For mobile (2 per row) and desktop when toggled */}
                {(displayViewMode === 'card' || isMobile) && (
                  <div className="p-3">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                      {payments.map((payment) => (
                        <PaymentCard
                          key={payment.id}
                          payment={payment}
                          formatCurrency={formatCurrency}
                          formatDate={formatDate}
                          getStatusBadge={getStatusBadge}
                          onView={handleViewPayment}
                          onVerify={handleVerifyPayment}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                )}
                
                {/* Showing info */}
                <div className="px-4 py-2 border-t border-gray-100 text-center">
                  <Text variant="caption" className="text-gray-400">
                    Page {currentPage} of {totalPages} • Showing {payments.length} payments
                  </Text>
                </div>
              </>
            )}
          </Card>
        </div>
      </div>

      {/* Payment Detail Modal - Responsive */}
      <Modal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} title="Payment Details" size="lg">
        {selectedPayment && (
          <div className="py-3 max-h-[75vh] overflow-y-auto px-1 space-y-4">
            {/* Student Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <Text variant="caption" className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                <User size={14} /> Student Information
              </Text>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Text variant="tiny" className="text-blue-600">Student Name</Text>
                  <Text variant="small" className="font-medium text-gray-800">{selectedPayment.student_name || 'Unknown'}</Text>
                </div>
                <div>
                  <Text variant="tiny" className="text-blue-600">Admission Number</Text>
                  <Text variant="small" className="font-medium text-gray-800">{selectedPayment.student_admission || 'N/A'}</Text>
                </div>
                <div>
                  <Text variant="tiny" className="text-blue-600">Class Level</Text>
                  <Text variant="small" className="font-medium text-gray-800">{selectedPayment.class_level_name || 'Not assigned'}</Text>
                </div>
                <div>
                  <Text variant="tiny" className="text-blue-600">Student ID</Text>
                  <Text variant="small" className="font-medium text-gray-800">{selectedPayment.student_id || 'N/A'}</Text>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <Text variant="caption" className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                <Banknote size={14} /> Payment Information
              </Text>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Text variant="tiny" className="text-green-600">Reference</Text>
                  <Text variant="tiny" className="font-mono font-medium break-all">{selectedPayment.reference}</Text>
                </div>
                <div>
                  <Text variant="tiny" className="text-green-600">Amount</Text>
                  <Text variant="h4" className="font-bold text-green-700">{formatCurrency(selectedPayment.amount)}</Text>
                </div>
                <div>
                  <Text variant="tiny" className="text-green-600">Payment Method</Text>
                  <Text variant="small" className="font-medium capitalize">{selectedPayment.payment_method?.replace('_', ' ')}</Text>
                </div>
                <div>
                  <Text variant="tiny" className="text-green-600">Invoice Number</Text>
                  <Text variant="small" className="font-medium">{selectedPayment.invoice_number || 'N/A'}</Text>
                </div>
                <div>
                  <Text variant="tiny" className="text-green-600">Transaction Date</Text>
                  <Text variant="small">{formatDate(selectedPayment.transaction_date)}</Text>
                </div>
                <div>
                  <Text variant="tiny" className="text-green-600">Submitted On</Text>
                  <Text variant="small">{formatDate(selectedPayment.created_at)}</Text>
                </div>
                {selectedPayment.verified_at && (
                  <div className="col-span-1 sm:col-span-2">
                    <Text variant="tiny" className="text-green-600">Verified By / Date</Text>
                    <Text variant="small">{selectedPayment.verified_by_name || 'Admin'} on {formatDate(selectedPayment.verified_at)}</Text>
                  </div>
                )}
              </div>
            </div>

            {/* Bank Transfer Details */}
            {selectedPayment.payment_method === 'bank_transfer' && (
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                <Text variant="caption" className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
                  <Building2 size={14} /> Bank Transfer Details
                </Text>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <Text variant="tiny" className="text-purple-600">Bank Name</Text>
                    <Text variant="small" className="font-medium">{selectedPayment.bank_name || 'N/A'}</Text>
                  </div>
                  <div>
                    <Text variant="tiny" className="text-purple-600">Account Name</Text>
                    <Text variant="small" className="font-medium">{selectedPayment.account_name || 'N/A'}</Text>
                  </div>
                  <div>
                    <Text variant="tiny" className="text-purple-600">Account Number</Text>
                    <Text variant="small" className="font-medium">{selectedPayment.account_number || 'N/A'}</Text>
                  </div>
                </div>
                {selectedPayment.notes && (
                  <div className="mt-3 pt-3 border-t border-purple-200">
                    <Text variant="tiny" className="text-purple-600">Payment Notes</Text>
                    <Text variant="tiny" className="text-gray-700">{selectedPayment.notes}</Text>
                  </div>
                )}
                {selectedPayment.verification_notes && (
                  <div className="mt-3 pt-3 border-t border-purple-200">
                    <Text variant="tiny" className="text-purple-600">Verification Notes</Text>
                    <Text variant="tiny" className="text-gray-700">{selectedPayment.verification_notes}</Text>
                  </div>
                )}
              </div>
            )}

            {/* Evidence Image/File */}
            {selectedPayment.payment_evidence && (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <Text variant="caption" className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Image size={14} /> Payment Evidence
                </Text>
                {selectedPayment.payment_evidence_url ? (
                  <div className="flex justify-center">
                    <img 
                      src={selectedPayment.payment_evidence_url} 
                      alt="Payment Evidence" 
                      className="max-w-full max-h-48 rounded-lg border"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </div>
                ) : (
                  <a 
                    href={selectedPayment.payment_evidence} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 flex items-center gap-2 text-sm"
                  >
                    <FileText size={14} /> View Document
                  </a>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button variant="outline" onClick={() => setShowDetailModal(false)} className="flex-1">
                Close
              </Button>
              {selectedPayment.status === 'pending' && (
                <Button
                  variant="primary"
                  onClick={() => {
                    setShowDetailModal(false);
                    handleVerifyPayment(selectedPayment);
                  }}
                  className="flex-1"
                >
                  <CheckCircle size={14} /> Verify Payment
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Verification Modal - Responsive */}
      <Modal isOpen={showVerifyModal} onClose={() => setShowVerifyModal(false)} title="Verify Payment" size="md">
        {selectedPayment && (
          <div className="py-3 space-y-4">
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                <Text variant="tiny" className="text-gray-600">Student:</Text>
                <Text variant="small" className="font-medium text-gray-800">{selectedPayment.student_name}</Text>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                <Text variant="tiny" className="text-gray-600">Amount:</Text>
                <Text variant="h4" className="font-bold text-[#D94801]">{formatCurrency(selectedPayment.amount)}</Text>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                <Text variant="tiny" className="text-gray-600">Reference:</Text>
                <Text variant="tiny" className="font-mono bg-white px-2 py-0.5 rounded border break-all">{selectedPayment.reference}</Text>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-medium text-gray-500 mb-1">Verification Notes (Optional)</label>
              <textarea
                value={verificationNotes}
                onChange={(e) => setVerificationNotes(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801] resize-none"
                placeholder="Add notes about this verification..."
              />
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
              <Text variant="tiny" className="font-medium text-yellow-800 mb-1">⚠️ Important:</Text>
              <ul className="list-disc list-inside space-y-0.5 text-[10px] text-yellow-700">
                <li>Verify that the payment matches the bank transfer details</li>
                <li>Check the payment evidence if provided</li>
                <li>Confirm the amount matches the invoice balance</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button variant="outline" onClick={() => setShowVerifyModal(false)} className="flex-1">
                Cancel
              </Button>
              <Button variant="danger" onClick={() => confirmVerification('failed')} disabled={actionLoading} className="flex-1">
                <XCircle size={14} /> Reject
              </Button>
              <Button variant="primary" onClick={() => confirmVerification('success')} disabled={actionLoading} className="flex-1">
                {actionLoading ? <RefreshCw size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                Approve
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
};

export default AdminPaymentVerification;