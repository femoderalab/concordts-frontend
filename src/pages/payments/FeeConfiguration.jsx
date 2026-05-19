// // /**
// //  * Fee Configuration Page - Admin only
// //  * Configure fees per class level per term
// //  */

// // import React, { useState, useEffect } from 'react';
// // import { useNavigate, Link } from 'react-router-dom';
// // import DashboardLayout from '../../components/dashboard/DashboardLayout';
// // import Alert from '../../components/common/Alert';
// // import Button from '../../components/common/Button';
// // import Modal from '../../components/common/modal';
// // import FeeConfigModal from '../../components/payments/FeeConfigModal';
// // import {
// //   DollarSign,
// //   Plus,
// //   Edit,
// //   Trash2,
// //   Eye,
// //   RefreshCw,
// //   Search,
// //   Filter,
// //   ChevronRight,
// //   CheckCircle,
// //   XCircle,
// //   AlertCircle,
// //   Layers,
// //   Calendar,
// //   TrendingUp,
// //   Wallet
// // } from 'lucide-react';
// // import {
// //   getFeeStructures,
// //   createFeeStructure,
// //   updateFeeStructure,
// //   deleteFeeStructure,
// //   bulkCreateFeeStructures
// // } from '../../services/paymentService';
// // import { getAcademicSessions, getAcademicTerms, getClassLevels } from '../../services/academicService';
// // import useAuth from '../../hooks/useAuth';

// // const FeeConfiguration = () => {
// //   const navigate = useNavigate();
// //   const { user } = useAuth();
// //   const isAdmin = user?.role === 'head' || user?.role === 'hm' || 
// //                   user?.role === 'principal' || user?.role === 'vice_principal' ||
// //                   user?.role === 'accountant';

// //   const [feeStructures, setFeeStructures] = useState([]);
// //   const [sessions, setSessions] = useState([]);
// //   const [terms, setTerms] = useState([]);
// //   const [classLevels, setClassLevels] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState('');
// //   const [success, setSuccess] = useState('');
// //   const [searchTerm, setSearchTerm] = useState('');
// //   const [filterSession, setFilterSession] = useState('');
// //   const [filterTerm, setFilterTerm] = useState('');
// //   const [isModalOpen, setIsModalOpen] = useState(false);
// //   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
// //   const [selectedFee, setSelectedFee] = useState(null);
// //   const [modalLoading, setModalLoading] = useState(false);
// //   const [showBulkModal, setShowBulkModal] = useState(false);
// //   const [bulkData, setBulkData] = useState({
// //     session_id: '',
// //     term_id: '',
// //     tuition_fee: 0,
// //     registration_fee: 0,
// //     exam_fee: 0,
// //     sports_fee: 0,
// //     library_fee: 0,
// //     ict_fee: 0,
// //     development_fee: 0,
// //     pta_fee: 0,
// //     insurance_fee: 0
// //   });

// //   useEffect(() => {
// //     if (isAdmin) {
// //       loadData();
// //     }
// //   }, [isAdmin]);

// //   const loadData = async () => {
// //     try {
// //       setLoading(true);
// //       setError('');
// //       const [feeRes, sessionsRes, termsRes, classesRes] = await Promise.all([
// //         getFeeStructures(),
// //         getAcademicSessions(),
// //         getAcademicTerms(),
// //         getClassLevels()
// //       ]);
      
// //       const feeData = feeRes?.results || feeRes || [];
// //       console.log('Fee structures from API:', feeData);
      
// //       // Log each fee's details
// //       feeData.forEach(fee => {
// //         console.log(`Fee for ${fee.class_level_name}:`, {
// //           tuition: fee.tuition_fee,
// //           registration: fee.registration_fee,
// //           exam: fee.exam_fee,
// //           total: fee.total_fee,
// //           calculated: getTotalFee(fee)
// //         });
// //       });
      
// //       setFeeStructures(feeData);
// //       setSessions(sessionsRes?.results || sessionsRes || []);
// //       setTerms(termsRes?.results || termsRes || []);
// //       setClassLevels(classesRes?.results || classesRes || []);
// //     } catch (err) {
// //       console.error('Error loading data:', err);
// //       setError('Failed to load fee configuration data');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleCreate = () => {
// //     setSelectedFee(null);
// //     setIsModalOpen(true);
// //   };

// //   const handleEdit = (fee) => {
// //     setSelectedFee(fee);
// //     setIsModalOpen(true);
// //   };

// //   const handleDeleteClick = (fee) => {
// //     setSelectedFee(fee);
// //     setIsDeleteModalOpen(true);
// //   };

// //   const confirmDelete = async () => {
// //     if (!selectedFee) return;
// //     try {
// //       setModalLoading(true);
// //       await deleteFeeStructure(selectedFee.id);
// //       setSuccess('Fee structure deleted successfully');
// //       loadData();
// //       setIsDeleteModalOpen(false);
// //       setSelectedFee(null);
// //       setTimeout(() => setSuccess(''), 3000);
// //     } catch (err) {
// //       setError(err.message || 'Failed to delete fee structure');
// //     } finally {
// //       setModalLoading(false);
// //     }
// //   };

// // // In FeeConfiguration.jsx - Update handleSubmit function

// //   const handleSubmit = async (formData) => {
// //     try {
// //       setModalLoading(true);
// //       setError('');
      
// //       // Ensure all numeric values are numbers
// //       const submitData = {
// //         session: parseInt(formData.session),
// //         term: parseInt(formData.term),
// //         class_level: parseInt(formData.class_level),
// //         tuition_fee: parseFloat(formData.tuition_fee) || 0,
// //         registration_fee: parseFloat(formData.registration_fee) || 0,
// //         exam_fee: parseFloat(formData.exam_fee) || 0,
// //         sports_fee: parseFloat(formData.sports_fee) || 0,
// //         library_fee: parseFloat(formData.library_fee) || 0,
// //         ict_fee: parseFloat(formData.ict_fee) || 0,
// //         development_fee: parseFloat(formData.development_fee) || 0,
// //         pta_fee: parseFloat(formData.pta_fee) || 0,
// //         insurance_fee: parseFloat(formData.insurance_fee) || 0,
// //         early_payment_discount: parseFloat(formData.early_payment_discount) || 0,
// //         sibling_discount: parseFloat(formData.sibling_discount) || 0,
// //         description: formData.description || '',
// //         is_active: formData.is_active,
// //         custom_fees: formData.custom_fees || {}
// //       };
      
// //       console.log('Submitting fee structure:', submitData);
      
// //       let result;
// //       if (selectedFee) {
// //         result = await updateFeeStructure(selectedFee.id, submitData);
// //       } else {
// //         result = await createFeeStructure(submitData);
// //       }
      
// //       console.log('API Response:', result);
      
// //       if (result.success !== false) {
// //         setSuccess(selectedFee ? 'Fee structure updated successfully' : 'Fee structure created successfully');
// //         setIsModalOpen(false);
// //         loadData();
// //         setTimeout(() => setSuccess(''), 3000);
// //       } else {
// //         setError(result.error || result.message || 'Failed to save fee structure');
// //       }
// //     } catch (err) {
// //       console.error('Error saving fee structure:', err);
// //       const errorMsg = err.response?.data?.error || err.response?.data?.message || err.message || 'Failed to save fee structure';
// //       setError(errorMsg);
// //     } finally {
// //       setModalLoading(false);
// //     }
// //   };

// //   const handleBulkCreate = async () => {
// //     if (!bulkData.session_id || !bulkData.term_id) {
// //       setError('Please select both session and term');
// //       return;
// //     }
    
// //     try {
// //       setModalLoading(true);
// //       setError('');
      
// //       const payload = {
// //         session_id: parseInt(bulkData.session_id),
// //         term_id: parseInt(bulkData.term_id),
// //         base_fees: {
// //           tuition_fee: parseFloat(bulkData.tuition_fee) || 0,
// //           registration_fee: parseFloat(bulkData.registration_fee) || 0,
// //           exam_fee: parseFloat(bulkData.exam_fee) || 0,
// //           sports_fee: parseFloat(bulkData.sports_fee) || 0,
// //           library_fee: parseFloat(bulkData.library_fee) || 0,
// //           ict_fee: parseFloat(bulkData.ict_fee) || 0,
// //           development_fee: parseFloat(bulkData.development_fee) || 0,
// //           pta_fee: parseFloat(bulkData.pta_fee) || 0,
// //           insurance_fee: parseFloat(bulkData.insurance_fee) || 0
// //         }
// //       };
      
// //       console.log('Bulk create payload:', payload);
      
// //       const result = await bulkCreateFeeStructures(payload);
      
// //       console.log('Bulk create response:', result);
      
// //       if (result.success) {
// //         setSuccess(`Created ${result.created_count} fee structures successfully`);
// //         setShowBulkModal(false);
// //         // Reset bulk form
// //         setBulkData({
// //           session_id: '',
// //           term_id: '',
// //           tuition_fee: 0,
// //           registration_fee: 0,
// //           exam_fee: 0,
// //           sports_fee: 0,
// //           library_fee: 0,
// //           ict_fee: 0,
// //           development_fee: 0,
// //           pta_fee: 0,
// //           insurance_fee: 0
// //         });
// //         loadData();
// //         setTimeout(() => setSuccess(''), 3000);
// //       } else {
// //         setError(result.error || 'Failed to bulk create fee structures');
// //       }
// //     } catch (err) {
// //       console.error('Bulk create error:', err);
// //       const errorMsg = err.response?.data?.error || err.message || 'Failed to bulk create fee structures';
// //       setError(errorMsg);
// //     } finally {
// //       setModalLoading(false);
// //     }
// //   };

// //   const formatCurrency = (amount) => {
// //     if (!amount && amount !== 0) return '₦0.00';
// //     return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);
// //   };

// //   const calculateTotalFee = (fee) => {
// //     if (!fee) return 0;
    
// //     let total = 0;
// //     total += parseFloat(fee.tuition_fee) || 0;
// //     total += parseFloat(fee.registration_fee) || 0;
// //     total += parseFloat(fee.exam_fee) || 0;
// //     total += parseFloat(fee.sports_fee) || 0;
// //     total += parseFloat(fee.library_fee) || 0;
// //     total += parseFloat(fee.ict_fee) || 0;
// //     total += parseFloat(fee.development_fee) || 0;
// //     total += parseFloat(fee.pta_fee) || 0;
// //     total += parseFloat(fee.insurance_fee) || 0;
    
// //     if (fee.custom_fees) {
// //       let customFees = fee.custom_fees;
// //       if (typeof customFees === 'string') {
// //         try {
// //           customFees = JSON.parse(customFees);
// //         } catch (e) {
// //           customFees = {};
// //         }
// //       }
// //       if (customFees && typeof customFees === 'object') {
// //         Object.values(customFees).forEach(amount => {
// //           total += parseFloat(amount) || 0;
// //         });
// //       }
// //     }
    
// //     return total;
// //   };

// //   // FIXED: Use let instead of const for mutable variable
// //   const getTotalFee = (fee) => {
// //     if (!fee) return 0;
    
// //     // Sum up all fee components
// //     let total = 0;
// //     total += parseFloat(fee.tuition_fee) || 0;
// //     total += parseFloat(fee.registration_fee) || 0;
// //     total += parseFloat(fee.exam_fee) || 0;
// //     total += parseFloat(fee.sports_fee) || 0;
// //     total += parseFloat(fee.library_fee) || 0;
// //     total += parseFloat(fee.ict_fee) || 0;
// //     total += parseFloat(fee.development_fee) || 0;
// //     total += parseFloat(fee.pta_fee) || 0;
// //     total += parseFloat(fee.insurance_fee) || 0;
    
// //     // Add custom fees if they exist
// //     if (fee.custom_fees) {
// //       let customFees = fee.custom_fees;
// //       if (typeof customFees === 'string') {
// //         try {
// //           customFees = JSON.parse(customFees);
// //         } catch (e) {
// //           customFees = {};
// //         }
// //       }
// //       if (customFees && typeof customFees === 'object') {
// //         Object.values(customFees).forEach(amount => {
// //           total += parseFloat(amount) || 0;
// //         });
// //       }
// //     }
    
// //     return total;
// //   };

// //   const filteredFees = feeStructures.filter(fee => {
// //     const matchesSearch = 
// //       (fee.class_level_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
// //       (fee.session_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
// //       (fee.term_name?.toLowerCase() || '').includes(searchTerm.toLowerCase());
// //     const matchesSession = !filterSession || fee.session == filterSession;
// //     const matchesTerm = !filterTerm || fee.term == filterTerm;
// //     return matchesSearch && matchesSession && matchesTerm;
// //   });

// //   if (!isAdmin) {
// //     return (
// //       <DashboardLayout title="Access Denied">
// //         <div className="bg-white rounded-xl shadow-soft p-8 text-center">
// //           <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
// //             <AlertCircle className="text-red-600" size={24} />
// //           </div>
// //           <h1 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h1>
// //           <p className="text-gray-600 mb-6">Only administrators can access fee configuration.</p>
// //           <button onClick={() => navigate('/dashboard')} className="px-4 py-2 bg-secondary-500 text-white rounded-lg">
// //             Go to Dashboard
// //           </button>
// //         </div>
// //       </DashboardLayout>
// //     );
// //   }

// //   const stats = {
// //     total: feeStructures.length,
// //     active: feeStructures.filter(f => f.is_active).length,
// //     total_revenue: feeStructures.reduce((sum, f) => sum + getTotalFee(f), 0)
// //   };

// //   return (
// //     <DashboardLayout title="Fee Configuration">
// //       <div className="space-y-6 pb-10">
// //         {/* Header */}
// //         <div className="flex flex-col md:flex-row md:items-center justify-between">
// //           <div>
// //             <h1 className="text-2xl font-bold text-gray-800">Fee Configuration</h1>
// //             <p className="text-gray-500 text-sm mt-1">Configure school fees per class level and term</p>
// //           </div>
// //           <div className="flex gap-3 mt-4 md:mt-0">
// //             <Button onClick={() => setShowBulkModal(true)} variant="outline" className="flex items-center gap-2">
// //               <Layers size={16} /> Bulk Create
// //             </Button>
// //             <Button onClick={handleCreate} variant="primary" className="flex items-center gap-2">
// //               <Plus size={16} /> Add Fee Structure
// //             </Button>
// //             <Button onClick={loadData} variant="outline" className="flex items-center gap-2">
// //               <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Refresh
// //             </Button>
// //           </div>
// //         </div>

// //         {/* Alerts */}
// //         {error && <Alert type="error" message={error} onClose={() => setError('')} />}
// //         {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

// //         {/* Stats Cards */}
// //         <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
// //           <div className="bg-white rounded-xl border border-gray-200 p-4">
// //             <div className="flex items-center gap-3">
// //               <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
// //                 <DollarSign size={18} className="text-blue-600" />
// //               </div>
// //               <div>
// //                 <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
// //                 <p className="text-xs text-gray-500">Total Fee Structures</p>
// //               </div>
// //             </div>
// //           </div>
// //           <div className="bg-white rounded-xl border border-gray-200 p-4">
// //             <div className="flex items-center gap-3">
// //               <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
// //                 <CheckCircle size={18} className="text-green-600" />
// //               </div>
// //               <div>
// //                 <p className="text-2xl font-bold text-gray-800">{stats.active}</p>
// //                 <p className="text-xs text-gray-500">Active Structures</p>
// //               </div>
// //             </div>
// //           </div>
// //           <div className="bg-white rounded-xl border border-gray-200 p-4">
// //             <div className="flex items-center gap-3">
// //               <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
// //                 <TrendingUp size={18} className="text-purple-600" />
// //               </div>
// //               <div>
// //                 <p className="text-2xl font-bold text-gray-800">{formatCurrency(stats.total_revenue)}</p>
// //                 <p className="text-xs text-gray-500">Total Fee Value</p>
// //               </div>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Search and Filters */}
// //         <div className="bg-white rounded-xl border border-gray-200 p-4">
// //           <div className="flex flex-col md:flex-row gap-4">
// //             <div className="flex-1 relative">
// //               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
// //               <input
// //                 type="text"
// //                 value={searchTerm}
// //                 onChange={(e) => setSearchTerm(e.target.value)}
// //                 placeholder="Search by class, session, or term..."
// //                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
// //               />
// //             </div>
// //             <select
// //               value={filterSession}
// //               onChange={(e) => setFilterSession(e.target.value)}
// //               className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
// //             >
// //               <option value="">All Sessions</option>
// //               {sessions.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
// //             </select>
// //             <select
// //               value={filterTerm}
// //               onChange={(e) => setFilterTerm(e.target.value)}
// //               className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
// //             >
// //               <option value="">All Terms</option>
// //               {terms.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
// //             </select>
// //           </div>
// //         </div>

// //         {/* Fee Structures Table */}
// //         <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
// //           <div className="overflow-x-auto">
// //             {loading ? (
// //               <div className="flex justify-center py-12">
// //                 <RefreshCw className="animate-spin h-8 w-8 text-primary-600" />
// //               </div>
// //             ) : filteredFees.length === 0 ? (
// //               <div className="text-center py-12">
// //                 <Wallet size={48} className="mx-auto text-gray-300 mb-3" />
// //                 <p className="text-gray-500">No fee structures found</p>
// //                 <button onClick={handleCreate} className="mt-3 text-secondary-600 hover:text-secondary-700 text-sm">
// //                   Create your first fee structure
// //                 </button>
// //               </div>
// //             ) : (
// //               <table className="w-full">
// //                 <thead className="bg-gray-50">
// //                   <tr>
// //                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Class Level</th>
// //                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Session / Term</th>
// //                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Fee</th>
// //                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
// //                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
// //                   </tr>
// //                 </thead>
// //                 <tbody className="divide-y divide-gray-100">
// //                   {filteredFees.map((fee) => (
// //                     <tr key={fee.id} className="hover:bg-gray-50">
// //                       <td className="px-4 py-3">
// //                         <div className="font-medium text-gray-800">{fee.class_level_name}</div>
// //                         <div className="text-xs text-gray-500">{fee.class_level_code || fee.class_level}</div>
// //                       </td>
// //                       <td className="px-4 py-3">
// //                         <div>{fee.session_name}</div>
// //                         <div className="text-xs text-gray-500">{fee.term_name}</div>
// //                       </td>
// //                       <td className="px-4 py-3">
// //                         {/* Display actual total fee from API or calculate */}
// //                         <div className="font-bold text-green-600">
// //                           {formatCurrency(calculateTotalFee(fee))}
// //                         </div>
// //                         {/* Show breakdown on hover */}
// //                         <div className="text-xs text-gray-400 mt-1">
// //                           {fee.tuition_fee > 0 && `Tuition: ${formatCurrency(fee.tuition_fee)} `}
// //                         </div>
// //                       </td>
// //                       <td className="px-4 py-3">
// //                         {fee.is_active ? (
// //                           <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-800">
// //                             <CheckCircle size={10} /> Active
// //                           </span>
// //                         ) : (
// //                           <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600">
// //                             <XCircle size={10} /> Inactive
// //                           </span>
// //                         )}
// //                       </td>
// //                       <td className="px-4 py-3">
// //                         <div className="flex items-center gap-2">
// //                           <button onClick={() => handleEdit(fee)} className="p-1.5 text-gray-600 hover:text-secondary-600 hover:bg-gray-100 rounded-lg transition-colors" title="Edit">
// //                             <Edit size={16} />
// //                           </button>
// //                           <button onClick={() => handleDeleteClick(fee)} className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded-lg transition-colors" title="Delete">
// //                             <Trash2 size={16} />
// //                           </button>
// //                         </div>
// //                       </td>
// //                     </tr>
// //                   ))}
// //                 </tbody>
// //               </table>
// //             )}
// //           </div>
// //         </div>
// //       </div>

// //       {/* Create/Edit Modal */}
// //       <FeeConfigModal
// //         isOpen={isModalOpen}
// //         onClose={() => setIsModalOpen(false)}
// //         onSubmit={handleSubmit}
// //         initialData={selectedFee}
// //         sessions={sessions}
// //         terms={terms}
// //         classLevels={classLevels}
// //         loading={modalLoading}
// //       />

// //       {/* Delete Confirmation Modal */}
// //       <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Delete" size="sm">
// //         <div className="py-4 text-center">
// //           <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
// //             <Trash2 size={24} className="text-red-600" />
// //           </div>
// //           <h3 className="text-base font-semibold text-gray-800 mb-2">Delete Fee Structure</h3>
// //           <p className="text-sm text-gray-500 mb-4">
// //             Are you sure you want to delete this fee structure? This action cannot be undone.
// //           </p>
// //           <div className="flex gap-3">
// //             <Button onClick={() => setIsDeleteModalOpen(false)} variant="outline" className="flex-1">Cancel</Button>
// //             <Button onClick={confirmDelete} loading={modalLoading} className="flex-1 bg-red-600 hover:bg-red-700">Delete</Button>
// //           </div>
// //         </div>
// //       </Modal>

// //       {/* Bulk Create Modal */}
// //       <Modal isOpen={showBulkModal} onClose={() => setShowBulkModal(false)} title="Bulk Create Fee Structures" size="md">
// //         <div className="py-4 space-y-4">
// //           <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
// //             This will create fee structures for all class levels at once.
// //           </div>
          
// //           <div>
// //             <label className="block text-sm font-medium text-gray-700 mb-2">Academic Session *</label>
// //             <select
// //               value={bulkData.session_id}
// //               onChange={(e) => setBulkData(prev => ({ ...prev, session_id: e.target.value }))}
// //               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
// //             >
// //               <option value="">Select Session</option>
// //               {sessions.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
// //             </select>
// //           </div>
          
// //           <div>
// //             <label className="block text-sm font-medium text-gray-700 mb-2">Academic Term *</label>
// //             <select
// //               value={bulkData.term_id}
// //               onChange={(e) => setBulkData(prev => ({ ...prev, term_id: e.target.value }))}
// //               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
// //             >
// //               <option value="">Select Term</option>
// //               {terms.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
// //             </select>
// //           </div>
          
// //           <div className="grid grid-cols-2 gap-3">
// //             <div><label className="block text-xs font-medium text-gray-600 mb-1">Tuition Fee (₦)</label>
// //               <input type="number" value={bulkData.tuition_fee} onChange={(e) => setBulkData(prev => ({ ...prev, tuition_fee: parseFloat(e.target.value) || 0 }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
// //             <div><label className="block text-xs font-medium text-gray-600 mb-1">Registration Fee (₦)</label>
// //               <input type="number" value={bulkData.registration_fee} onChange={(e) => setBulkData(prev => ({ ...prev, registration_fee: parseFloat(e.target.value) || 0 }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
// //             <div><label className="block text-xs font-medium text-gray-600 mb-1">Exam Fee (₦)</label>
// //               <input type="number" value={bulkData.exam_fee} onChange={(e) => setBulkData(prev => ({ ...prev, exam_fee: parseFloat(e.target.value) || 0 }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
// //             <div><label className="block text-xs font-medium text-gray-600 mb-1">Sports Fee (₦)</label>
// //               <input type="number" value={bulkData.sports_fee} onChange={(e) => setBulkData(prev => ({ ...prev, sports_fee: parseFloat(e.target.value) || 0 }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
// //             <div><label className="block text-xs font-medium text-gray-600 mb-1">Library Fee (₦)</label>
// //               <input type="number" value={bulkData.library_fee} onChange={(e) => setBulkData(prev => ({ ...prev, library_fee: parseFloat(e.target.value) || 0 }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
// //             <div><label className="block text-xs font-medium text-gray-600 mb-1">ICT Fee (₦)</label>
// //               <input type="number" value={bulkData.ict_fee} onChange={(e) => setBulkData(prev => ({ ...prev, ict_fee: parseFloat(e.target.value) || 0 }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
// //             <div><label className="block text-xs font-medium text-gray-600 mb-1">Development Fee (₦)</label>
// //               <input type="number" value={bulkData.development_fee} onChange={(e) => setBulkData(prev => ({ ...prev, development_fee: parseFloat(e.target.value) || 0 }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
// //             <div><label className="block text-xs font-medium text-gray-600 mb-1">PTA Fee (₦)</label>
// //               <input type="number" value={bulkData.pta_fee} onChange={(e) => setBulkData(prev => ({ ...prev, pta_fee: parseFloat(e.target.value) || 0 }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
// //             <div><label className="block text-xs font-medium text-gray-600 mb-1">Insurance Fee (₦)</label>
// //               <input type="number" value={bulkData.insurance_fee} onChange={(e) => setBulkData(prev => ({ ...prev, insurance_fee: parseFloat(e.target.value) || 0 }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
// //           </div>
          
// //           <div className="flex gap-3 pt-4">
// //             <Button onClick={() => setShowBulkModal(false)} variant="outline" className="flex-1">Cancel</Button>
// //             <Button onClick={handleBulkCreate} loading={modalLoading} className="flex-1 bg-secondary-600 hover:bg-secondary-700">Create All</Button>
// //           </div>
// //         </div>
// //       </Modal>
// //     </DashboardLayout>
// //   );
// // };

// // export default FeeConfiguration;

// /**
//  * Fee Configuration Page - Admin only
//  * Configure fees per class level per term
//  * Fully responsive: mobile-first, tablet, desktop
//  */

// import React, { useState, useEffect } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import DashboardLayout from '../../components/dashboard/DashboardLayout';
// import Alert from '../../components/common/Alert';
// import Button from '../../components/common/Button';
// import Modal from '../../components/common/modal';
// import FeeConfigModal from '../../components/payments/FeeConfigModal';
// import {
//   DollarSign,
//   Plus,
//   Edit,
//   Trash2,
//   Eye,
//   RefreshCw,
//   Search,
//   Filter,
//   ChevronRight,
//   CheckCircle,
//   XCircle,
//   AlertCircle,
//   Layers,
//   Calendar,
//   TrendingUp,
//   Wallet,
//   X
// } from 'lucide-react';
// import {
//   getFeeStructures,
//   createFeeStructure,
//   updateFeeStructure,
//   deleteFeeStructure,
//   bulkCreateFeeStructures
// } from '../../services/paymentService';
// import { getAcademicSessions, getAcademicTerms, getClassLevels } from '../../services/academicService';
// import useAuth from '../../hooks/useAuth';

// const FeeConfiguration = () => {
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const isAdmin = user?.role === 'head' || user?.role === 'hm' || 
//                   user?.role === 'principal' || user?.role === 'vice_principal' ||
//                   user?.role === 'accountant';

//   const [feeStructures, setFeeStructures] = useState([]);
//   const [sessions, setSessions] = useState([]);
//   const [terms, setTerms] = useState([]);
//   const [classLevels, setClassLevels] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterSession, setFilterSession] = useState('');
//   const [filterTerm, setFilterTerm] = useState('');
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const [selectedFee, setSelectedFee] = useState(null);
//   const [modalLoading, setModalLoading] = useState(false);
//   const [showBulkModal, setShowBulkModal] = useState(false);
//   const [showMobileFilter, setShowMobileFilter] = useState(false);
//   const [bulkData, setBulkData] = useState({
//     session_id: '',
//     term_id: '',
//     tuition_fee: 0,
//     registration_fee: 0,
//     exam_fee: 0,
//     sports_fee: 0,
//     library_fee: 0,
//     ict_fee: 0,
//     development_fee: 0,
//     pta_fee: 0,
//     insurance_fee: 0
//   });

//   useEffect(() => {
//     if (isAdmin) {
//       loadData();
//     }
//   }, [isAdmin]);

//   const loadData = async () => {
//     try {
//       setLoading(true);
//       setError('');
//       const [feeRes, sessionsRes, termsRes, classesRes] = await Promise.all([
//         getFeeStructures(),
//         getAcademicSessions(),
//         getAcademicTerms(),
//         getClassLevels()
//       ]);
      
//       const feeData = feeRes?.results || feeRes || [];
//       console.log('Fee structures from API:', feeData);
      
//       feeData.forEach(fee => {
//         console.log(`Fee for ${fee.class_level_name}:`, {
//           tuition: fee.tuition_fee,
//           registration: fee.registration_fee,
//           exam: fee.exam_fee,
//           total: fee.total_fee,
//           calculated: getTotalFee(fee)
//         });
//       });
      
//       setFeeStructures(feeData);
//       setSessions(sessionsRes?.results || sessionsRes || []);
//       setTerms(termsRes?.results || termsRes || []);
//       setClassLevels(classesRes?.results || classesRes || []);
//     } catch (err) {
//       console.error('Error loading data:', err);
//       setError('Failed to load fee configuration data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCreate = () => {
//     setSelectedFee(null);
//     setIsModalOpen(true);
//   };

//   const handleEdit = (fee) => {
//     setSelectedFee(fee);
//     setIsModalOpen(true);
//   };

//   const handleDeleteClick = (fee) => {
//     setSelectedFee(fee);
//     setIsDeleteModalOpen(true);
//   };

//   const confirmDelete = async () => {
//     if (!selectedFee) return;
//     try {
//       setModalLoading(true);
//       await deleteFeeStructure(selectedFee.id);
//       setSuccess('Fee structure deleted successfully');
//       loadData();
//       setIsDeleteModalOpen(false);
//       setSelectedFee(null);
//       setTimeout(() => setSuccess(''), 3000);
//     } catch (err) {
//       setError(err.message || 'Failed to delete fee structure');
//     } finally {
//       setModalLoading(false);
//     }
//   };

//   const handleSubmit = async (formData) => {
//     try {
//       setModalLoading(true);
//       setError('');
      
//       const submitData = {
//         session: parseInt(formData.session),
//         term: parseInt(formData.term),
//         class_level: parseInt(formData.class_level),
//         tuition_fee: parseFloat(formData.tuition_fee) || 0,
//         registration_fee: parseFloat(formData.registration_fee) || 0,
//         exam_fee: parseFloat(formData.exam_fee) || 0,
//         sports_fee: parseFloat(formData.sports_fee) || 0,
//         library_fee: parseFloat(formData.library_fee) || 0,
//         ict_fee: parseFloat(formData.ict_fee) || 0,
//         development_fee: parseFloat(formData.development_fee) || 0,
//         pta_fee: parseFloat(formData.pta_fee) || 0,
//         insurance_fee: parseFloat(formData.insurance_fee) || 0,
//         early_payment_discount: parseFloat(formData.early_payment_discount) || 0,
//         sibling_discount: parseFloat(formData.sibling_discount) || 0,
//         description: formData.description || '',
//         is_active: formData.is_active,
//         custom_fees: formData.custom_fees || {}
//       };
      
//       console.log('Submitting fee structure:', submitData);
      
//       let result;
//       if (selectedFee) {
//         result = await updateFeeStructure(selectedFee.id, submitData);
//       } else {
//         result = await createFeeStructure(submitData);
//       }
      
//       console.log('API Response:', result);
      
//       if (result.success !== false) {
//         setSuccess(selectedFee ? 'Fee structure updated successfully' : 'Fee structure created successfully');
//         setIsModalOpen(false);
//         loadData();
//         setTimeout(() => setSuccess(''), 3000);
//       } else {
//         setError(result.error || result.message || 'Failed to save fee structure');
//       }
//     } catch (err) {
//       console.error('Error saving fee structure:', err);
//       const errorMsg = err.response?.data?.error || err.response?.data?.message || err.message || 'Failed to save fee structure';
//       setError(errorMsg);
//     } finally {
//       setModalLoading(false);
//     }
//   };

//   const handleBulkCreate = async () => {
//     if (!bulkData.session_id || !bulkData.term_id) {
//       setError('Please select both session and term');
//       return;
//     }
    
//     try {
//       setModalLoading(true);
//       setError('');
      
//       const payload = {
//         session_id: parseInt(bulkData.session_id),
//         term_id: parseInt(bulkData.term_id),
//         base_fees: {
//           tuition_fee: parseFloat(bulkData.tuition_fee) || 0,
//           registration_fee: parseFloat(bulkData.registration_fee) || 0,
//           exam_fee: parseFloat(bulkData.exam_fee) || 0,
//           sports_fee: parseFloat(bulkData.sports_fee) || 0,
//           library_fee: parseFloat(bulkData.library_fee) || 0,
//           ict_fee: parseFloat(bulkData.ict_fee) || 0,
//           development_fee: parseFloat(bulkData.development_fee) || 0,
//           pta_fee: parseFloat(bulkData.pta_fee) || 0,
//           insurance_fee: parseFloat(bulkData.insurance_fee) || 0
//         }
//       };
      
//       console.log('Bulk create payload:', payload);
      
//       const result = await bulkCreateFeeStructures(payload);
      
//       console.log('Bulk create response:', result);
      
//       if (result.success) {
//         setSuccess(`Created ${result.created_count} fee structures successfully`);
//         setShowBulkModal(false);
//         setBulkData({
//           session_id: '',
//           term_id: '',
//           tuition_fee: 0,
//           registration_fee: 0,
//           exam_fee: 0,
//           sports_fee: 0,
//           library_fee: 0,
//           ict_fee: 0,
//           development_fee: 0,
//           pta_fee: 0,
//           insurance_fee: 0
//         });
//         loadData();
//         setTimeout(() => setSuccess(''), 3000);
//       } else {
//         setError(result.error || 'Failed to bulk create fee structures');
//       }
//     } catch (err) {
//       console.error('Bulk create error:', err);
//       const errorMsg = err.response?.data?.error || err.message || 'Failed to bulk create fee structures';
//       setError(errorMsg);
//     } finally {
//       setModalLoading(false);
//     }
//   };

//   const formatCurrency = (amount) => {
//     if (!amount && amount !== 0) return '₦0';
//     return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(amount);
//   };

//   const getTotalFee = (fee) => {
//     if (!fee) return 0;
    
//     let total = 0;
//     total += parseFloat(fee.tuition_fee) || 0;
//     total += parseFloat(fee.registration_fee) || 0;
//     total += parseFloat(fee.exam_fee) || 0;
//     total += parseFloat(fee.sports_fee) || 0;
//     total += parseFloat(fee.library_fee) || 0;
//     total += parseFloat(fee.ict_fee) || 0;
//     total += parseFloat(fee.development_fee) || 0;
//     total += parseFloat(fee.pta_fee) || 0;
//     total += parseFloat(fee.insurance_fee) || 0;
    
//     if (fee.custom_fees) {
//       let customFees = fee.custom_fees;
//       if (typeof customFees === 'string') {
//         try {
//           customFees = JSON.parse(customFees);
//         } catch (e) {
//           customFees = {};
//         }
//       }
//       if (customFees && typeof customFees === 'object') {
//         Object.values(customFees).forEach(amount => {
//           total += parseFloat(amount) || 0;
//         });
//       }
//     }
    
//     return total;
//   };

//   const filteredFees = feeStructures.filter(fee => {
//     const matchesSearch = 
//       (fee.class_level_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
//       (fee.session_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
//       (fee.term_name?.toLowerCase() || '').includes(searchTerm.toLowerCase());
//     const matchesSession = !filterSession || fee.session == filterSession;
//     const matchesTerm = !filterTerm || fee.term == filterTerm;
//     return matchesSearch && matchesSession && matchesTerm;
//   });

//   // Mobile Filter Sheet
//   const MobileFilterSheet = () => {
//     if (!showMobileFilter) return null;
//     return (
//       <>
//         <div className="fixed inset-0 bg-black/50 z-50 transition-opacity" onClick={() => setShowMobileFilter(false)} />
//         <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 p-5 animate-in slide-in-from-bottom duration-300 max-h-[80vh] overflow-y-auto">
//           <div className="flex justify-between items-center mb-4">
//             <h3 className="font-semibold text-gray-900">Filter Fee Structures</h3>
//             <button onClick={() => setShowMobileFilter(false)} className="p-1 rounded-full hover:bg-gray-100">
//               <X size={20} />
//             </button>
//           </div>
//           <div className="space-y-4">
//             <div>
//               <label className="block text-xs font-medium text-gray-500 mb-1">Search</label>
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
//                 <input
//                   type="text"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   placeholder="Search by class, session..."
//                   className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
//                 />
//               </div>
//             </div>
//             <div>
//               <label className="block text-xs font-medium text-gray-500 mb-1">Session</label>
//               <select
//                 value={filterSession}
//                 onChange={(e) => setFilterSession(e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
//               >
//                 <option value="">All Sessions</option>
//                 {sessions.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
//               </select>
//             </div>
//             <div>
//               <label className="block text-xs font-medium text-gray-500 mb-1">Term</label>
//               <select
//                 value={filterTerm}
//                 onChange={(e) => setFilterTerm(e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
//               >
//                 <option value="">All Terms</option>
//                 {terms.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
//               </select>
//             </div>
//             <div className="flex gap-3 pt-2">
//               <button 
//                 onClick={() => setShowMobileFilter(false)} 
//                 className="flex-1 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium"
//               >
//                 Apply Filters
//               </button>
//               <button 
//                 onClick={() => { setSearchTerm(''); setFilterSession(''); setFilterTerm(''); setShowMobileFilter(false); }} 
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

//   const stats = {
//     total: feeStructures.length,
//     active: feeStructures.filter(f => f.is_active).length,
//     total_revenue: feeStructures.reduce((sum, f) => sum + getTotalFee(f), 0)
//   };

//   if (!isAdmin) {
//     return (
//       <DashboardLayout title="Access Denied">
//         <div className="flex items-center justify-center min-h-[60vh] px-4">
//           <div className="text-center">
//             <div className="w-14 h-14 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <AlertCircle className="text-red-500" size={28} />
//             </div>
//             <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">Access Denied</h2>
//             <p className="text-gray-500 text-sm sm:text-base">Only administrators can configure fees.</p>
//             <button onClick={() => navigate('/dashboard')} className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-700">
//               Go to Dashboard
//             </button>
//           </div>
//         </div>
//       </DashboardLayout>
//     );
//   }

//   return (
//     <DashboardLayout title="Fee Configuration">
//       <div className="space-y-4 sm:space-y-6 pb-12 px-3 sm:px-0">

//         {/* Header */}
//         <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3">
//           <div>
//             <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Fee Configuration</h1>
//             <p className="text-gray-500 text-xs sm:text-sm mt-0.5">Configure school fees per class level and term</p>
//           </div>
//           <div className="flex gap-2">
//             <button onClick={() => setShowBulkModal(true)} className="flex items-center gap-1.5 px-3 sm:px-4 py-2 border border-gray-200 bg-white text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm">
//               <Layers size={14}/> Bulk
//             </button>
//             <button onClick={handleCreate} className="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors shadow-sm">
//               <Plus size={14}/> Add
//             </button>
//             <button onClick={loadData} className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
//               <RefreshCw size={14} className={loading ? 'animate-spin' : ''}/>
//             </button>
//           </div>
//         </div>

//         {/* Alerts */}
//         {error && <Alert type="error" message={error} onClose={() => setError('')} />}
//         {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

//         {/* Stats Cards */}
//         <div className="grid grid-cols-3 gap-2 sm:gap-4">
//           <div className="bg-white rounded-xl border border-gray-100 p-3 sm:p-4 shadow-sm">
//             <div className="flex items-center gap-2 sm:gap-3">
//               <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-xl flex items-center justify-center">
//                 <DollarSign size={14} className="text-blue-600 sm:w-4 sm:h-4" />
//               </div>
//               <div>
//                 <p className="text-xl sm:text-2xl font-bold text-gray-800">{stats.total}</p>
//                 <p className="text-[10px] sm:text-xs text-gray-400">Total Structures</p>
//               </div>
//             </div>
//           </div>
//           <div className="bg-white rounded-xl border border-gray-100 p-3 sm:p-4 shadow-sm">
//             <div className="flex items-center gap-2 sm:gap-3">
//               <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-xl flex items-center justify-center">
//                 <CheckCircle size={14} className="text-green-600 sm:w-4 sm:h-4" />
//               </div>
//               <div>
//                 <p className="text-xl sm:text-2xl font-bold text-gray-800">{stats.active}</p>
//                 <p className="text-[10px] sm:text-xs text-gray-400">Active</p>
//               </div>
//             </div>
//           </div>
//           <div className="bg-white rounded-xl border border-gray-100 p-3 sm:p-4 shadow-sm">
//             <div className="flex items-center gap-2 sm:gap-3">
//               <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-xl flex items-center justify-center">
//                 <TrendingUp size={14} className="text-purple-600 sm:w-4 sm:h-4" />
//               </div>
//               <div>
//                 <p className="text-sm sm:text-lg font-bold text-gray-800 truncate">{formatCurrency(stats.total_revenue)}</p>
//                 <p className="text-[10px] sm:text-xs text-gray-400">Total Value</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Search and Filters - Desktop */}
//         <div className="hidden sm:block bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
//           <div className="flex flex-wrap gap-3">
//             <div className="flex-1 relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
//               <input
//                 type="text"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 placeholder="Search by class, session, or term..."
//                 className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
//               />
//             </div>
//             <select
//               value={filterSession}
//               onChange={(e) => setFilterSession(e.target.value)}
//               className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
//             >
//               <option value="">All Sessions</option>
//               {sessions.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
//             </select>
//             <select
//               value={filterTerm}
//               onChange={(e) => setFilterTerm(e.target.value)}
//               className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
//             >
//               <option value="">All Terms</option>
//               {terms.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
//             </select>
//             {(searchTerm || filterSession || filterTerm) && (
//               <button 
//                 onClick={() => { setSearchTerm(''); setFilterSession(''); setFilterTerm(''); }} 
//                 className="text-xs text-red-500 hover:text-red-600 font-medium"
//               >
//                 Clear filters
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Mobile Filter Button */}
//         <div className="sm:hidden">
//           <button
//             onClick={() => setShowMobileFilter(true)}
//             className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 bg-white text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
//           >
//             <Filter size={14} /> Filter Fee Structures
//             {(searchTerm || filterSession || filterTerm) && <span className="ml-1 w-2 h-2 bg-blue-500 rounded-full" />}
//           </button>
//         </div>

//         <MobileFilterSheet />

//         {/* Fee Structures Table / Cards */}
//         <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
//           {loading ? (
//             <div className="flex justify-center py-12">
//               <RefreshCw className="animate-spin h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
//             </div>
//           ) : filteredFees.length === 0 ? (
//             <div className="text-center py-12 sm:py-16">
//               <Wallet size={40} className="mx-auto text-gray-300 mb-3 sm:w-12 sm:h-12" />
//               <p className="text-gray-400 text-sm sm:text-base">No fee structures found</p>
//               <button onClick={handleCreate} className="mt-3 text-gray-600 text-xs sm:text-sm font-medium hover:text-gray-800">
//                 + Create your first fee structure
//               </button>
//             </div>
//           ) : (
//             <>
//               {/* Desktop Table */}
//               <div className="hidden md:block overflow-x-auto">
//                 <table className="w-full">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Class Level</th>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Session / Term</th>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Fee</th>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
//                       <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-100">
//                     {filteredFees.map((fee) => (
//                       <tr key={fee.id} className="hover:bg-gray-50 transition-colors">
//                         <td className="px-4 py-3">
//                           <p className="font-medium text-gray-800 text-sm">{fee.class_level_name}</p>
//                           <p className="text-[10px] text-gray-400">{fee.class_level_code || fee.class_level}</p>
//                         </td>
//                         <td className="px-4 py-3">
//                           <p className="text-sm text-gray-700">{fee.session_name}</p>
//                           <p className="text-[10px] text-gray-400">{fee.term_name}</p>
//                         </td>
//                         <td className="px-4 py-3">
//                           <p className="font-bold text-green-600 text-sm">{formatCurrency(getTotalFee(fee))}</p>
//                           <p className="text-[10px] text-gray-400">
//                             {fee.tuition_fee > 0 && `Tuition: ${formatCurrency(fee.tuition_fee)}`}
//                           </p>
//                         </td>
//                         <td className="px-4 py-3">
//                           {fee.is_active ? (
//                             <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-100 text-green-700">
//                               <CheckCircle size={10} /> Active
//                             </span>
//                           ) : (
//                             <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-500">
//                               <XCircle size={10} /> Inactive
//                             </span>
//                           )}
//                         </td>
//                         <td className="px-4 py-3 text-right">
//                           <div className="flex gap-1 justify-end">
//                             <button onClick={() => handleEdit(fee)} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors" title="Edit">
//                               <Edit size={14} />
//                             </button>
//                             <button onClick={() => handleDeleteClick(fee)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
//                               <Trash2 size={14} />
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>

//               {/* Mobile Cards */}
//               <div className="md:hidden divide-y divide-gray-100">
//                 {filteredFees.map((fee) => (
//                   <div key={fee.id} className="p-4 space-y-3">
//                     <div className="flex justify-between items-start">
//                       <div>
//                         <p className="font-semibold text-gray-800 text-sm">{fee.class_level_name}</p>
//                         <p className="text-[10px] text-gray-400">{fee.class_level_code || fee.class_level}</p>
//                       </div>
//                       <div className="flex gap-1">
//                         <button onClick={() => handleEdit(fee)} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg">
//                           <Edit size={14} />
//                         </button>
//                         <button onClick={() => handleDeleteClick(fee)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg">
//                           <Trash2 size={14} />
//                         </button>
//                       </div>
//                     </div>
                    
//                     <div className="grid grid-cols-2 gap-2">
//                       <div>
//                         <p className="text-[10px] text-gray-400">Session</p>
//                         <p className="text-xs font-medium text-gray-700">{fee.session_name}</p>
//                       </div>
//                       <div>
//                         <p className="text-[10px] text-gray-400">Term</p>
//                         <p className="text-xs font-medium text-gray-700">{fee.term_name}</p>
//                       </div>
//                     </div>
                    
//                     <div>
//                       <p className="text-[10px] text-gray-400">Total Fee</p>
//                       <p className="text-base font-bold text-green-600">{formatCurrency(getTotalFee(fee))}</p>
//                     </div>
                    
//                     <div className="flex items-center justify-between pt-1">
//                       <div>
//                         {fee.is_active ? (
//                           <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-100 text-green-700">
//                             <CheckCircle size={10} /> Active
//                           </span>
//                         ) : (
//                           <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-500">
//                             <XCircle size={10} /> Inactive
//                           </span>
//                         )}
//                       </div>
//                       <span className="text-[10px] text-gray-400">
//                         {fee.tuition_fee > 0 && formatCurrency(fee.tuition_fee)}
//                       </span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </>
//           )}
//         </div>
//       </div>

//       {/* Create/Edit Modal */}
//       <FeeConfigModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         onSubmit={handleSubmit}
//         initialData={selectedFee}
//         sessions={sessions}
//         terms={terms}
//         classLevels={classLevels}
//         loading={modalLoading}
//       />

//       {/* Delete Confirmation Modal */}
//       <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Delete" size="sm">
//         <div className="py-4 text-center">
//           <div className="w-12 h-12 sm:w-14 sm:h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
//             <Trash2 size={20} className="text-red-600 sm:w-6 sm:h-6" />
//           </div>
//           <h3 className="text-base font-semibold text-gray-800 mb-2">Delete Fee Structure</h3>
//           <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">
//             Are you sure you want to delete this fee structure? This action cannot be undone.
//           </p>
//           <div className="flex flex-col sm:flex-row gap-3">
//             <button onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium text-sm order-2 sm:order-1">
//               Cancel
//             </button>
//             <button onClick={confirmDelete} disabled={modalLoading} className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium text-sm flex items-center justify-center gap-2 order-1 sm:order-2">
//               {modalLoading ? <RefreshCw size={14} className="animate-spin" /> : <Trash2 size={14} />}
//               Delete
//             </button>
//           </div>
//         </div>
//       </Modal>

//       {/* Bulk Create Modal */}
//       <Modal isOpen={showBulkModal} onClose={() => setShowBulkModal(false)} title="Bulk Create Fee Structures" size="lg">
//         <div className="py-4 space-y-4 max-h-[75vh] overflow-y-auto">
//           <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs sm:text-sm text-blue-800">
//             This will create fee structures for all class levels at once using the base fees below.
//           </div>
          
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1.5">Academic Session *</label>
//               <select
//                 value={bulkData.session_id}
//                 onChange={(e) => setBulkData(prev => ({ ...prev, session_id: e.target.value }))}
//                 className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
//               >
//                 <option value="">Select Session</option>
//                 {sessions.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1.5">Academic Term *</label>
//               <select
//                 value={bulkData.term_id}
//                 onChange={(e) => setBulkData(prev => ({ ...prev, term_id: e.target.value }))}
//                 className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
//               >
//                 <option value="">Select Term</option>
//                 {terms.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
//               </select>
//             </div>
//           </div>
          
//           <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
//             {[
//               { key: 'tuition_fee', label: 'Tuition Fee' },
//               { key: 'registration_fee', label: 'Registration Fee' },
//               { key: 'exam_fee', label: 'Exam Fee' },
//               { key: 'sports_fee', label: 'Sports Fee' },
//               { key: 'library_fee', label: 'Library Fee' },
//               { key: 'ict_fee', label: 'ICT Fee' },
//               { key: 'development_fee', label: 'Development Fee' },
//               { key: 'pta_fee', label: 'PTA Fee' },
//               { key: 'insurance_fee', label: 'Insurance Fee' },
//             ].map(field => (
//               <div key={field.key}>
//                 <label className="block text-[10px] sm:text-xs font-medium text-gray-500 mb-1">{field.label}</label>
//                 <input 
//                   type="number" 
//                   value={bulkData[field.key]} 
//                   onChange={(e) => setBulkData(prev => ({ ...prev, [field.key]: parseFloat(e.target.value) || 0 }))} 
//                   className="w-full px-2 sm:px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
//                 />
//               </div>
//             ))}
//           </div>
          
//           <div className="flex flex-col sm:flex-row gap-3 pt-4">
//             <button onClick={() => setShowBulkModal(false)} className="px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium text-sm order-2 sm:order-1">
//               Cancel
//             </button>
//             <button onClick={handleBulkCreate} disabled={modalLoading} className="px-4 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-700 transition-colors font-medium text-sm flex items-center justify-center gap-2 order-1 sm:order-2">
//               {modalLoading ? <RefreshCw size={14} className="animate-spin" /> : <Layers size={14} />}
//               Create for All Classes
//             </button>
//           </div>
//         </div>
//       </Modal>
//     </DashboardLayout>
//   );
// };

// export default FeeConfiguration;


/**
 * Fee Configuration Page - Admin only
 * Configure fees per class level per term
 * Fully responsive: mobile-first, tablet, desktop
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import Alert from '../../components/common/Alert';
import Modal from '../../components/common/modal';
import FeeConfigModal from '../../components/payments/FeeConfigModal';
import {
  DollarSign,
  Plus,
  Edit,
  Trash2,
  Eye,
  RefreshCw,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  AlertCircle,
  Layers,
  Calendar,
  TrendingUp,
  Wallet,
  X,
  Grid3x3,
  Table2
} from 'lucide-react';
import {
  getFeeStructures,
  createFeeStructure,
  updateFeeStructure,
  deleteFeeStructure,
  bulkCreateFeeStructures
} from '../../services/paymentService';
import { getAcademicSessions, getAcademicTerms, getClassLevels } from '../../services/academicService';
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
  <Card className={`p-3 ${bgColor}`}>
    <div className="flex items-center gap-3">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color} bg-opacity-20`}>
        <Icon size={14} className={`${color.replace('bg-', 'text-')}`} />
      </div>
      <div>
        <Text variant="h4" className="font-bold text-gray-800">{value}</Text>
        <Text variant="tiny" className="text-gray-400">{title}</Text>
      </div>
    </div>
  </Card>
);

// Status Badge
const StatusBadge = ({ isActive }) => {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] md:text-[10px] font-medium ${isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
      {isActive ? <CheckCircle size={10} /> : <XCircle size={10} />}
      {isActive ? 'Active' : 'Inactive'}
    </span>
  );
};

// Mobile Filter Sheet
const MobileFilterSheet = ({ isOpen, onClose, searchTerm, setSearchTerm, filterSession, setFilterSession, filterTerm, setFilterTerm, sessions, terms, onApply, onClear }) => {
  const [localSearch, setLocalSearch] = useState(searchTerm);
  const [localSession, setLocalSession] = useState(filterSession);
  const [localTerm, setLocalTerm] = useState(filterTerm);
  
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 transition-opacity" onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 p-5 animate-in slide-in-from-bottom duration-200 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <Text variant="h4" className="font-semibold">Filter Fee Structures</Text>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100"><X size={18} /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Search by class, session..."
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Session</label>
            <select
              value={localSession}
              onChange={(e) => setLocalSession(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
            >
              <option value="">All Sessions</option>
              {sessions.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Term</label>
            <select
              value={localTerm}
              onChange={(e) => setLocalTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
            >
              <option value="">All Terms</option>
              {terms.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="primary" size="medium" onClick={() => { setSearchTerm(localSearch); setFilterSession(localSession); setFilterTerm(localTerm); onApply(); onClose(); }} className="flex-1">
              Apply Filters
            </Button>
            <button onClick={() => { setLocalSearch(''); setLocalSession(''); setLocalTerm(''); setSearchTerm(''); setFilterSession(''); setFilterTerm(''); onClear(); onClose(); }} className="px-4 py-2 text-red-500 font-medium text-sm">
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

// Fee Card Component (for mobile grid view)
const FeeCard = ({ fee, formatCurrency, getTotalFee, onEdit, onDelete }) => (
  <Card className="p-3 space-y-2 hover:shadow-md transition-shadow duration-200 h-full">
    <div className="flex justify-between items-start gap-2">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <DollarSign size={14} className="text-blue-600" />
        </div>
        <div className="flex-1 min-w-0">
          <Text variant="tiny" className="font-bold text-gray-800 truncate">{fee.class_level_name}</Text>
          <Text variant="caption" className="text-gray-400 truncate">{fee.class_level_code || fee.class_level}</Text>
        </div>
      </div>
      <StatusBadge isActive={fee.is_active} />
    </div>
    
    <div>
      <Text variant="caption" className="text-gray-400">Session / Term</Text>
      <Text variant="tiny" className="font-medium text-gray-700">{fee.session_name} • {fee.term_name}</Text>
    </div>
    
    <div>
      <Text variant="caption" className="text-gray-400">Total Fee</Text>
      <Text variant="h4" className="font-bold text-[#D94801]">{formatCurrency(getTotalFee(fee))}</Text>
    </div>
    
    <div className="flex justify-end gap-1 pt-1">
      <button onClick={() => onEdit(fee)} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
        <Edit size={12} />
      </button>
      <button onClick={() => onDelete(fee)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
        <Trash2 size={12} />
      </button>
    </div>
  </Card>
);

// ============================================
// MAIN COMPONENT
// ============================================
const FeeConfiguration = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === 'head' || user?.role === 'hm' || 
                  user?.role === 'principal' || user?.role === 'vice_principal' ||
                  user?.role === 'accountant';

  const [feeStructures, setFeeStructures] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [terms, setTerms] = useState([]);
  const [classLevels, setClassLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSession, setFilterSession] = useState('');
  const [filterTerm, setFilterTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [viewMode, setViewMode] = useState('table');
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  
  const [bulkData, setBulkData] = useState({
    session_id: '',
    term_id: '',
    tuition_fee: 0,
    registration_fee: 0,
    exam_fee: 0,
    sports_fee: 0,
    library_fee: 0,
    ict_fee: 0,
    development_fee: 0,
    pta_fee: 0,
    insurance_fee: 0
  });

  // Detect mobile screen
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const [feeRes, sessionsRes, termsRes, classesRes] = await Promise.all([
        getFeeStructures(),
        getAcademicSessions(),
        getAcademicTerms(),
        getClassLevels()
      ]);
      
      const feeData = feeRes?.results || feeRes || [];
      console.log('Fee structures from API:', feeData);
      
      setFeeStructures(feeData);
      setSessions(sessionsRes?.results || sessionsRes || []);
      setTerms(termsRes?.results || termsRes || []);
      setClassLevels(classesRes?.results || classesRes || []);
      setCurrentPage(1);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load fee configuration data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin, loadData]);

  const handleCreate = () => {
    setSelectedFee(null);
    setIsModalOpen(true);
  };

  const handleEdit = (fee) => {
    setSelectedFee(fee);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (fee) => {
    setSelectedFee(fee);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedFee) return;
    try {
      setModalLoading(true);
      await deleteFeeStructure(selectedFee.id);
      setSuccess('Fee structure deleted successfully');
      loadData();
      setIsDeleteModalOpen(false);
      setSelectedFee(null);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to delete fee structure');
    } finally {
      setModalLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setModalLoading(true);
      setError('');
      
      const submitData = {
        session: parseInt(formData.session),
        term: parseInt(formData.term),
        class_level: parseInt(formData.class_level),
        tuition_fee: parseFloat(formData.tuition_fee) || 0,
        registration_fee: parseFloat(formData.registration_fee) || 0,
        exam_fee: parseFloat(formData.exam_fee) || 0,
        sports_fee: parseFloat(formData.sports_fee) || 0,
        library_fee: parseFloat(formData.library_fee) || 0,
        ict_fee: parseFloat(formData.ict_fee) || 0,
        development_fee: parseFloat(formData.development_fee) || 0,
        pta_fee: parseFloat(formData.pta_fee) || 0,
        insurance_fee: parseFloat(formData.insurance_fee) || 0,
        early_payment_discount: parseFloat(formData.early_payment_discount) || 0,
        sibling_discount: parseFloat(formData.sibling_discount) || 0,
        description: formData.description || '',
        is_active: formData.is_active,
        custom_fees: formData.custom_fees || {}
      };
      
      console.log('Submitting fee structure:', submitData);
      
      let result;
      if (selectedFee) {
        result = await updateFeeStructure(selectedFee.id, submitData);
      } else {
        result = await createFeeStructure(submitData);
      }
      
      console.log('API Response:', result);
      
      if (result.success !== false) {
        setSuccess(selectedFee ? 'Fee structure updated successfully' : 'Fee structure created successfully');
        setIsModalOpen(false);
        loadData();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.error || result.message || 'Failed to save fee structure');
      }
    } catch (err) {
      console.error('Error saving fee structure:', err);
      const errorMsg = err.response?.data?.error || err.response?.data?.message || err.message || 'Failed to save fee structure';
      setError(errorMsg);
    } finally {
      setModalLoading(false);
    }
  };

  const handleBulkCreate = async () => {
    if (!bulkData.session_id || !bulkData.term_id) {
      setError('Please select both session and term');
      return;
    }
    
    try {
      setModalLoading(true);
      setError('');
      
      const payload = {
        session_id: parseInt(bulkData.session_id),
        term_id: parseInt(bulkData.term_id),
        base_fees: {
          tuition_fee: parseFloat(bulkData.tuition_fee) || 0,
          registration_fee: parseFloat(bulkData.registration_fee) || 0,
          exam_fee: parseFloat(bulkData.exam_fee) || 0,
          sports_fee: parseFloat(bulkData.sports_fee) || 0,
          library_fee: parseFloat(bulkData.library_fee) || 0,
          ict_fee: parseFloat(bulkData.ict_fee) || 0,
          development_fee: parseFloat(bulkData.development_fee) || 0,
          pta_fee: parseFloat(bulkData.pta_fee) || 0,
          insurance_fee: parseFloat(bulkData.insurance_fee) || 0
        }
      };
      
      console.log('Bulk create payload:', payload);
      
      const result = await bulkCreateFeeStructures(payload);
      
      console.log('Bulk create response:', result);
      
      if (result.success) {
        setSuccess(`Created ${result.created_count} fee structures successfully`);
        setShowBulkModal(false);
        setBulkData({
          session_id: '',
          term_id: '',
          tuition_fee: 0,
          registration_fee: 0,
          exam_fee: 0,
          sports_fee: 0,
          library_fee: 0,
          ict_fee: 0,
          development_fee: 0,
          pta_fee: 0,
          insurance_fee: 0
        });
        loadData();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.error || 'Failed to bulk create fee structures');
      }
    } catch (err) {
      console.error('Bulk create error:', err);
      const errorMsg = err.response?.data?.error || err.message || 'Failed to bulk create fee structures';
      setError(errorMsg);
    } finally {
      setModalLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '₦0';
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(amount);
  };

  const getTotalFee = (fee) => {
    if (!fee) return 0;
    
    let total = 0;
    total += parseFloat(fee.tuition_fee) || 0;
    total += parseFloat(fee.registration_fee) || 0;
    total += parseFloat(fee.exam_fee) || 0;
    total += parseFloat(fee.sports_fee) || 0;
    total += parseFloat(fee.library_fee) || 0;
    total += parseFloat(fee.ict_fee) || 0;
    total += parseFloat(fee.development_fee) || 0;
    total += parseFloat(fee.pta_fee) || 0;
    total += parseFloat(fee.insurance_fee) || 0;
    
    if (fee.custom_fees) {
      let customFees = fee.custom_fees;
      if (typeof customFees === 'string') {
        try {
          customFees = JSON.parse(customFees);
        } catch (e) {
          customFees = {};
        }
      }
      if (customFees && typeof customFees === 'object') {
        Object.values(customFees).forEach(amount => {
          total += parseFloat(amount) || 0;
        });
      }
    }
    
    return total;
  };

  const filteredFees = feeStructures.filter(fee => {
    const matchesSearch = 
      (fee.class_level_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (fee.session_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (fee.term_name?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesSession = !filterSession || fee.session == filterSession;
    const matchesTerm = !filterTerm || fee.term == filterTerm;
    return matchesSearch && matchesSession && matchesTerm;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredFees.length / itemsPerPage);
  const paginatedFees = filteredFees.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const stats = {
    total: feeStructures.length,
    active: feeStructures.filter(f => f.is_active).length,
    total_revenue: feeStructures.reduce((sum, f) => sum + getTotalFee(f), 0)
  };

  const hasActiveFilters = searchTerm || filterSession || filterTerm;
  const displayViewMode = isMobile ? 'card' : viewMode;

  if (!isAdmin) {
    return (
      <DashboardLayout title="Access Denied">
        <div className="flex items-center justify-center min-h-[60vh] px-4">
          <div className="text-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="text-red-500" size={28} />
            </div>
            <Text variant="h3" className="font-bold text-gray-800 mb-2">Access Denied</Text>
            <Text variant="body" className="text-gray-500">Only administrators can configure fees.</Text>
            <Button variant="primary" size="small" className="mt-4" onClick={() => navigate('/dashboard')}>
              Go to Dashboard
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Fee Configuration">
      {/* Fixed height container with internal scrolling - only table/card scrolls */}
      <div className="h-[calc(100vh-120px)] flex flex-col px-3 sm:px-4 lg:px-6">
        
        {/* STICKY HEADER SECTION - Everything above the table/card stays fixed */}
        <div className="sticky top-0 z-20 bg-gray-50 -mx-3 sm:-mx-4 lg:-mx-6 px-3 sm:px-4 lg:px-6 pt-4 pb-2">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="small" icon={Layers} onClick={() => setShowBulkModal(true)}>
                Bulk
              </Button>
              <Button variant="primary" size="small" icon={Plus} onClick={handleCreate}>
                Add
              </Button>
              <Button variant="outline" size="small" icon={RefreshCw} onClick={loadData} loading={loading}>
                Refresh
              </Button>
            </div>
          </div>

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

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-3">
            <StatCard title="Total Structures" value={stats.total} icon={Wallet} color="bg-blue-100" bgColor="border-gray-100" />
            <StatCard title="Active" value={stats.active} icon={CheckCircle} color="bg-green-100" bgColor="border-gray-100" />
            <StatCard title="Total Value" value={formatCurrency(stats.total_revenue)} icon={TrendingUp} color="bg-purple-100" bgColor="border-gray-100" />
          </div>

          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-2 mb-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                placeholder="Search by class, session, or term..."
                className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801] focus:border-transparent"
              />
            </div>
            
            {/* Desktop filters */}
            <div className="hidden sm:flex items-center gap-2">
              <select
                value={filterSession}
                onChange={(e) => { setFilterSession(e.target.value); setCurrentPage(1); }}
                className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
              >
                <option value="">All Sessions</option>
                {sessions.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <select
                value={filterTerm}
                onChange={(e) => { setFilterTerm(e.target.value); setCurrentPage(1); }}
                className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
              >
                <option value="">All Terms</option>
                {terms.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
              {hasActiveFilters && (
                <Button variant="ghost" size="tiny" onClick={() => { setSearchTerm(''); setFilterSession(''); setFilterTerm(''); setCurrentPage(1); }}>
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
              <Filter size={14} /> Filter
              {hasActiveFilters && <span className="w-2 h-2 bg-[#D94801] rounded-full" />}
            </button>
          </div>

          <MobileFilterSheet
            isOpen={showMobileFilter}
            onClose={() => setShowMobileFilter(false)}
            searchTerm={searchTerm}
            setSearchTerm={(val) => { setSearchTerm(val); setCurrentPage(1); }}
            filterSession={filterSession}
            setFilterSession={(val) => { setFilterSession(val); setCurrentPage(1); }}
            filterTerm={filterTerm}
            setFilterTerm={(val) => { setFilterTerm(val); setCurrentPage(1); }}
            sessions={sessions}
            terms={terms}
            onApply={loadData}
            onClear={() => { setSearchTerm(''); setFilterSession(''); setFilterTerm(''); setCurrentPage(1); loadData(); }}
          />
        </div>

        {/* SCROLLABLE CONTENT SECTION - Only table/card scrolls here */}
        <div className="flex-1 overflow-y-auto min-h-0 -mx-3 sm:-mx-4 lg:-mx-6 px-3 sm:px-4 lg:px-6 pb-4">
          <Card className="overflow-hidden">
            {loading && feeStructures.length === 0 ? (
              <div className="flex justify-center py-12">
                <RefreshCw className="animate-spin h-8 w-8 text-[#D94801]" />
              </div>
            ) : paginatedFees.length === 0 ? (
              <div className="text-center py-12">
                <Wallet size={40} className="mx-auto text-gray-300 mb-3" />
                <Text variant="body" className="text-gray-400">No fee structures found</Text>
                {hasActiveFilters ? (
                  <Button variant="outline" size="small" className="mt-3" onClick={() => { setSearchTerm(''); setFilterSession(''); setFilterTerm(''); }}>
                    Clear Filters
                  </Button>
                ) : (
                  <Button variant="primary" size="small" className="mt-3" onClick={handleCreate}>
                    Create your first fee structure
                  </Button>
                )}
              </div>
            ) : (
              <>
                {/* Desktop Table View */}
                {displayViewMode === 'table' && !isMobile && (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-100 sticky top-0 z-10">
                        <tr>
                          <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Class Level</th>
                          <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Session / Term</th>
                          <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Total Fee</th>
                          <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-4 py-3 text-right text-[10px] font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {paginatedFees.map((fee) => (
                          <tr key={fee.id} className="hover:bg-gray-50 transition-colors duration-150">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <DollarSign size={12} className="text-blue-600" />
                                </div>
                                <div>
                                  <Text variant="small" className="font-medium text-gray-800">{fee.class_level_name}</Text>
                                  <Text variant="tiny" className="text-gray-400">{fee.class_level_code || fee.class_level}</Text>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <Text variant="small" className="text-gray-700">{fee.session_name}</Text>
                              <Text variant="tiny" className="text-gray-400">{fee.term_name}</Text>
                            </td>
                            <td className="px-4 py-3">
                              <Text variant="small" className="font-bold text-[#D94801]">{formatCurrency(getTotalFee(fee))}</Text>
                              <Text variant="tiny" className="text-gray-400">
                                {fee.tuition_fee > 0 && `Tuition: ${formatCurrency(fee.tuition_fee)}`}
                              </Text>
                            </td>
                            <td className="px-4 py-3">
                              <StatusBadge isActive={fee.is_active} />
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button onClick={() => handleEdit(fee)} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors" title="Edit">
                                  <Edit size={14} />
                                </button>
                                <button onClick={() => handleDeleteClick(fee)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                                  <Trash2 size={14} />
                                </button>
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
                      {paginatedFees.map((fee) => (
                        <FeeCard
                          key={fee.id}
                          fee={fee}
                          formatCurrency={formatCurrency}
                          getTotalFee={getTotalFee}
                          onEdit={handleEdit}
                          onDelete={handleDeleteClick}
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
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredFees.length)} of {filteredFees.length} fee structures
                  </Text>
                </div>
              </>
            )}
          </Card>
        </div>
      </div>

      {/* Create/Edit Modal */}
      <FeeConfigModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={selectedFee}
        sessions={sessions}
        terms={terms}
        classLevels={classLevels}
        loading={modalLoading}
      />

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Delete" size="sm">
        {selectedFee && (
          <div className="py-4 text-center">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Trash2 size={18} className="text-red-600" />
            </div>
            <Text variant="h4" className="font-semibold mb-1">Delete Fee Structure</Text>
            <Text variant="caption" className="text-gray-500 mb-4 block">
              Are you sure you want to delete the fee structure for <span className="font-medium">{selectedFee.class_level_name}</span>? This action cannot be undone.
            </Text>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button variant="danger" onClick={confirmDelete} disabled={modalLoading} className="flex-1">
                {modalLoading ? <RefreshCw size={14} className="animate-spin" /> : <Trash2 size={14} />}
                Delete
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Bulk Create Modal */}
      <Modal isOpen={showBulkModal} onClose={() => setShowBulkModal(false)} title="Bulk Create Fee Structures" size="lg">
        <div className="py-3 space-y-4 max-h-[70vh] overflow-y-auto px-1">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
            <Text variant="tiny" className="text-blue-800">
              This will create fee structures for all class levels at once using the base fees below.
            </Text>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-medium text-gray-500 mb-1">Academic Session *</label>
              <select
                value={bulkData.session_id}
                onChange={(e) => setBulkData(prev => ({ ...prev, session_id: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
              >
                <option value="">Select Session</option>
                {sessions.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-medium text-gray-500 mb-1">Academic Term *</label>
              <select
                value={bulkData.term_id}
                onChange={(e) => setBulkData(prev => ({ ...prev, term_id: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
              >
                <option value="">Select Term</option>
                {terms.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { key: 'tuition_fee', label: 'Tuition Fee' },
              { key: 'registration_fee', label: 'Registration Fee' },
              { key: 'exam_fee', label: 'Exam Fee' },
              { key: 'sports_fee', label: 'Sports Fee' },
              { key: 'library_fee', label: 'Library Fee' },
              { key: 'ict_fee', label: 'ICT Fee' },
              { key: 'development_fee', label: 'Development Fee' },
              { key: 'pta_fee', label: 'PTA Fee' },
              { key: 'insurance_fee', label: 'Insurance Fee' },
            ].map(field => (
              <div key={field.key}>
                <label className="block text-[9px] font-medium text-gray-500 mb-1">{field.label}</label>
                <input 
                  type="number" 
                  value={bulkData[field.key]} 
                  onChange={(e) => setBulkData(prev => ({ ...prev, [field.key]: parseFloat(e.target.value) || 0 }))} 
                  className="w-full px-2 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
                />
              </div>
            ))}
          </div>
          
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={() => setShowBulkModal(false)} className="flex-1">
              Cancel
            </Button>
            <Button variant="primary" onClick={handleBulkCreate} disabled={modalLoading} className="flex-1">
              {modalLoading ? <RefreshCw size={14} className="animate-spin" /> : <Layers size={14} />}
              Create for All Classes
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default FeeConfiguration;