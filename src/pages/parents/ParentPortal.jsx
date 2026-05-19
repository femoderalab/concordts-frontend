// /**
//  * Parent Portal - Complete with Payment Status and Bulk Payment
//  * FULLY RESPONSIVE: mobile-first, compact design on small screens
//  * Parents can view payment status for all children and make payments
//  */

// import React, { useState, useEffect } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import DashboardLayout from '../../components/dashboard/DashboardLayout';
// import Alert from '../../components/common/Alert';
// import Button from '../../components/common/Button';
// import Modal from '../../components/common/modal';
// import {
//   User, Users, Eye, BookOpen, DollarSign, TrendingUp, Calendar, 
//   Award, FileText, CreditCard, Phone, Mail, Home, Heart,
//   GraduationCap, Hash, AlertCircle, X, ChevronRight, LogOut,
//   CheckCircle, XCircle, Clock, Printer, Shield, MapPin, Briefcase,
//   Wallet, Building2, Banknote, Loader2, Receipt, History, RefreshCw,
//   Filter
// } from 'lucide-react';
// import { getParentPortalDashboard, getParentPortalChildDetail } from '../../services/parentService';
// import { getMyInvoices, getPaymentHistory, initializePayment, recordManualPayment } from '../../services/paymentService';
// import { getActiveBankAccounts } from '../../services/bankAccountService';
// import useAuth from '../../hooks/useAuth';

// // =====================
// // HELPER COMPONENTS - COMPACT & RESPONSIVE
// // =====================
// const Section = ({ title, icon, children }) => (
//   <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
//     <div className="px-3 sm:px-5 py-2.5 sm:py-4 border-b border-gray-100 bg-gray-50">
//       <h4 className="text-xs sm:text-sm font-semibold text-gray-800 flex items-center gap-1.5 sm:gap-2">
//         {icon && <span className="text-gray-400 w-3 h-3 sm:w-4 sm:h-4">{icon}</span>}
//         {title}
//       </h4>
//     </div>
//     <div className="p-3 sm:p-5">{children}</div>
//   </div>
// );

// const InfoRow = ({ label, value, fullWidth = false }) => (
//   <div className={fullWidth ? 'col-span-full' : ''}>
//     <div className="text-[9px] sm:text-xs text-gray-400 mb-0.5 sm:mb-1 font-medium uppercase tracking-wide">{label}</div>
//     <div className="text-xs sm:text-sm font-medium text-gray-800 bg-gray-50 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-gray-100 break-words">
//       {value || <span className="text-gray-300 italic text-[10px] sm:text-xs">—</span>}
//     </div>
//   </div>
// );

// const StatusBadge = ({ isActive, isGraduated }) => {
//   if (!isActive) {
//     return (
//       <span className="inline-flex items-center gap-0.5 px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-xs font-medium bg-red-100 text-red-700">
//         <XCircle size={9} /> Inactive
//       </span>
//     );
//   }
//   if (isGraduated) {
//     return (
//       <span className="inline-flex items-center gap-0.5 px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-xs font-medium bg-purple-100 text-purple-700">
//         <Award size={9} /> Graduated
//       </span>
//     );
//   }
//   return (
//     <span className="inline-flex items-center gap-0.5 px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-xs font-medium bg-green-100 text-green-700">
//       <CheckCircle size={9} /> Active
//     </span>
//   );
// };

// const FeeBadge = ({ feeStatus }) => {
//   const cfg = {
//     paid_full: { bg: 'bg-green-100', text: 'text-green-700', label: 'Fully Paid', icon: <CheckCircle size={9} /> },
//     paid_partial: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Partial', icon: <Clock size={9} /> },
//     not_paid: { bg: 'bg-red-100', text: 'text-red-700', label: 'Not Paid', icon: <XCircle size={9} /> },
//     scholarship: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Scholarship', icon: <Award size={9} /> },
//     exempted: { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Exempted', icon: <Shield size={9} /> },
//   };
//   const config = cfg[feeStatus] || { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Unknown', icon: null };
//   return (
//     <span className={`inline-flex items-center gap-0.5 px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-xs font-medium ${config.bg} ${config.text}`}>
//       {config.icon}{config.label}
//     </span>
//   );
// };

// // =====================
// // BULK PAYMENT MODAL (COMPACT)
// // =====================
// const BulkPaymentModal = ({ isOpen, onClose, childrenList, invoices, onSuccess }) => {
//   const [cart, setCart] = useState([]);
//   const [paymentStep, setPaymentStep] = useState('cart');
//   const [paymentMethod, setPaymentMethod] = useState('paystack');
//   const [bankAccounts, setBankAccounts] = useState([]);
//   const [selectedBankAccount, setSelectedBankAccount] = useState(null);
//   const [bankDetails, setBankDetails] = useState({
//     bank_name: '', account_name: '', account_number: '',
//     transaction_date: '', notes: ''
//   });
//   const [paymentEvidence, setPaymentEvidence] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [fetchingInvoices, setFetchingInvoices] = useState(false);
//   const [childInvoiceMap, setChildInvoiceMap] = useState({});
//   const [error, setError] = useState('');

//   const formatCurrency = (amount) =>
//     new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(amount || 0);

//   useEffect(() => {
//     if (isOpen) {
//       loadBankAccounts();
//       fetchAllChildInvoices();
//       setCart([]);
//       setPaymentStep('cart');
//       setError('');
//     }
//   }, [isOpen]);

//   const loadBankAccounts = async () => {
//     try {
//       const data = await getActiveBankAccounts();
//       setBankAccounts(data.bank_accounts || []);
//       if (data.bank_accounts?.length > 0) setSelectedBankAccount(data.bank_accounts[0]);
//     } catch (err) {
//       console.error('Error loading bank accounts:', err);
//     }
//   };

//   const fetchAllChildInvoices = async () => {
//     setFetchingInvoices(true);
//     try {
//       const { getInvoices } = await import('../../services/paymentService');
//       const map = {};
//       await Promise.all(childrenList.map(async (child) => {
//         try {
//           const res = await getInvoices({ student: child.id });
//           const all = res?.results || res || [];
//           map[child.id] = all.filter(inv => inv.status !== 'paid');
//         } catch {
//           map[child.id] = [];
//         }
//       }));
//       setChildInvoiceMap(map);
//     } catch (err) {
//       console.error('Error fetching invoices:', err);
//     } finally {
//       setFetchingInvoices(false);
//     }
//   };

//   const getChildOutstanding = (child) => {
//     const feeSummary = child.fee_summary || {};
//     const childInvoices = childInvoiceMap[child.id] || [];
//     if (childInvoices.length > 0) {
//       return childInvoices.reduce((sum, inv) => sum + (parseFloat(inv.balance_due) || 0), 0);
//     }
//     return parseFloat(feeSummary.balance) || 0;
//   };

//   const isInCart = (childId) => cart.some(item => item.child.id === childId);

//   const toggleCart = (child) => {
//     if (isInCart(child.id)) {
//       setCart(prev => prev.filter(item => item.child.id !== child.id));
//     } else {
//       const outstanding = getChildOutstanding(child);
//       if (outstanding <= 0) return;
//       const childInvoices = childInvoiceMap[child.id] || [];
//       setCart(prev => [...prev, {
//         child,
//         invoice: childInvoices[0] || null,
//         amount: outstanding,
//       }]);
//     }
//   };

//   const updateAmount = (childId, value) => {
//     setCart(prev => prev.map(item =>
//       item.child.id === childId
//         ? { ...item, amount: parseFloat(value) || 0 }
//         : item
//     ));
//   };

//   const cartTotal = cart.reduce((sum, item) => sum + (item.amount || 0), 0);

//   const handleContinue = () => {
//     if (cart.length === 0) { setError('Select at least one student'); return; }
//     if (cartTotal <= 0) { setError('Total amount must be greater than 0'); return; }
//     const itemsWithNoInvoice = cart.filter(item => !item.invoice);
//     if (itemsWithNoInvoice.length > 0) {
//       setError(`No invoice found for: ${itemsWithNoInvoice.map(i => i.child.full_name).join(', ')}. Ask admin to generate invoices first.`);
//       return;
//     }
//     setError('');
//     setPaymentStep('method');
//   };

//   const handlePaystackPayment = async () => {
//     const firstItem = cart[0];
//     if (!firstItem?.invoice) {
//       setError('No invoice found. Ask admin to generate invoices.');
//       return;
//     }
//     try {
//       setLoading(true);
//       setError('');
//       const result = await initializePayment({
//         invoice_id: firstItem.invoice.id,
//         payment_method: 'paystack',
//         amount: firstItem.amount,
//       });
//       if (result.authorization_url) {
//         window.location.href = result.authorization_url;
//       } else {
//         setError(result.error || 'Payment initialization failed');
//       }
//     } catch (err) {
//       setError(err.message || 'Failed to initialize payment');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleBankTransfer = async () => {
//     if (!bankDetails.bank_name || !bankDetails.account_name || !bankDetails.account_number) {
//       setError('Please fill in all bank transfer details');
//       return;
//     }
//     try {
//       setLoading(true);
//       setError('');

//       const results = await Promise.all(cart.map(async (item) => {
//         if (!item.invoice) return null;
//         const formData = new FormData();
//         formData.append('invoice_id', item.invoice.id);
//         formData.append('amount', item.amount.toString());
//         formData.append('payment_method', 'bank_transfer');
//         formData.append('bank_name', bankDetails.bank_name);
//         formData.append('account_name', bankDetails.account_name);
//         formData.append('account_number', bankDetails.account_number);
//         formData.append('transaction_date', bankDetails.transaction_date || new Date().toISOString().split('T')[0]);
//         formData.append('notes', `Bulk payment for ${item.child.full_name}. ${bankDetails.notes}`);
//         if (paymentEvidence) formData.append('payment_evidence', paymentEvidence);
//         return recordManualPayment(formData);
//       }));

//       const allSuccess = results.every(r => r?.success);
//       if (allSuccess) {
//         if (onSuccess) onSuccess();
//         onClose();
//       } else {
//         setError('Some payments could not be recorded. Please try again.');
//       }
//     } catch (err) {
//       setError(err.message || 'Failed to record bank transfer');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const CartStep = () => (
//     <div className="space-y-3">
//       <p className="text-xs text-gray-500">Select the children you want to pay for.</p>

//       {fetchingInvoices && (
//         <div className="flex items-center gap-2 text-xs text-blue-600 bg-blue-50 p-2 rounded-lg">
//           <Loader2 size={12} className="animate-spin" /> Loading...
//         </div>
//       )}

//       <div className="space-y-2 max-h-80 overflow-y-auto">
//         {childrenList.map(child => {
//           const outstanding = getChildOutstanding(child);
//           const inCart = isInCart(child.id);
//           const cartItem = cart.find(i => i.child.id === child.id);
//           const hasInvoice = (childInvoiceMap[child.id] || []).length > 0;
//           const isPaid = outstanding <= 0;

//           return (
//             <div key={child.id} className={`border rounded-xl p-3 transition-all ${
//               isPaid ? 'border-gray-100 bg-gray-50 opacity-60' :
//               inCart ? 'border-gray-900 bg-gray-50' : 'border-gray-200'
//             }`}>
//               <div className="flex items-start gap-2">
//                 {!isPaid && (
//                   <input
//                     type="checkbox"
//                     checked={inCart}
//                     onChange={() => toggleCart(child)}
//                     className="w-3.5 h-3.5 text-gray-900 rounded mt-0.5"
//                   />
//                 )}
//                 <div className="flex-1">
//                   <div className="flex justify-between items-start">
//                     <div>
//                       <p className="text-xs font-semibold text-gray-800">{child.full_name}</p>
//                       <p className="text-[9px] text-gray-400">{child.class_level?.name || 'No class'}</p>
//                     </div>
//                     {isPaid ? (
//                       <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-green-100 text-green-700 rounded-full text-[9px] font-medium">
//                         <CheckCircle size={8} /> Paid
//                       </span>
//                     ) : (
//                       <span className="text-xs font-bold text-red-600">
//                         {formatCurrency(outstanding)}
//                       </span>
//                     )}
//                   </div>

//                   {inCart && cartItem && (
//                     <div className="mt-2 pt-2 border-t border-gray-200">
//                       <label className="block text-[9px] font-medium text-gray-500 mb-0.5">
//                         Amount
//                       </label>
//                       <input
//                         type="number"
//                         value={cartItem.amount}
//                         onChange={e => updateAmount(child.id, e.target.value)}
//                         min="1"
//                         max={outstanding}
//                         step="500"
//                         className="w-full px-2 py-1 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-gray-900"
//                       />
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {cart.length > 0 && (
//         <div className="bg-gray-900 text-white rounded-xl p-3">
//           <div className="flex justify-between items-center text-xs">
//             <span>{cart.length} student{cart.length > 1 ? 's' : ''} selected</span>
//             <span className="text-sm font-bold">{formatCurrency(cartTotal)}</span>
//           </div>
//         </div>
//       )}

//       {error && (
//         <div className="p-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600 flex items-center gap-1">
//           <AlertCircle size={12} /> {error}
//         </div>
//       )}

//       <div className="flex gap-2 pt-2">
//         <button onClick={onClose} className="flex-1 px-3 py-2 border rounded-lg hover:bg-gray-50 text-xs font-medium">
//           Cancel
//         </button>
//         <button
//           onClick={handleContinue}
//           disabled={cart.length === 0 || cartTotal === 0}
//           className="flex-1 px-3 py-2 bg-gray-900 text-white rounded-lg disabled:opacity-50 text-xs font-medium"
//         >
//           Continue
//         </button>
//       </div>
//     </div>
//   );

//   const MethodStep = () => (
//     <div className="space-y-3">
//       <div className="bg-gray-50 rounded-xl p-3">
//         <p className="text-[10px] font-medium text-gray-500 mb-1">Summary</p>
//         {cart.map(item => (
//           <div key={item.child.id} className="flex justify-between text-xs py-1">
//             <span className="text-gray-600">{item.child.full_name}</span>
//             <span className="font-medium">{formatCurrency(item.amount)}</span>
//           </div>
//         ))}
//         <div className="flex justify-between text-xs font-bold text-gray-900 pt-2 mt-1 border-t border-gray-200">
//           <span>Total</span>
//           <span>{formatCurrency(cartTotal)}</span>
//         </div>
//       </div>

//       <div>
//         <label className="block text-xs font-medium text-gray-600 mb-1.5">Payment Method</label>
//         <div className="grid grid-cols-2 gap-2">
//           <button
//             onClick={() => setPaymentMethod('paystack')}
//             className={`p-2 border-2 rounded-xl text-center ${paymentMethod === 'paystack' ? 'border-gray-900 bg-gray-50' : 'border-gray-200'}`}
//           >
//             <CreditCard size={16} className={`mx-auto mb-1 ${paymentMethod === 'paystack' ? 'text-gray-900' : 'text-gray-400'}`} />
//             <p className={`text-[10px] font-medium ${paymentMethod === 'paystack' ? 'text-gray-900' : 'text-gray-500'}`}>Card</p>
//           </button>
//           <button
//             onClick={() => setPaymentMethod('bank_transfer')}
//             className={`p-2 border-2 rounded-xl text-center ${paymentMethod === 'bank_transfer' ? 'border-gray-900 bg-gray-50' : 'border-gray-200'}`}
//           >
//             <Banknote size={16} className={`mx-auto mb-1 ${paymentMethod === 'bank_transfer' ? 'text-gray-900' : 'text-gray-400'}`} />
//             <p className={`text-[10px] font-medium ${paymentMethod === 'bank_transfer' ? 'text-gray-900' : 'text-gray-500'}`}>Transfer</p>
//           </button>
//         </div>
//       </div>

//       {error && (
//         <div className="p-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600">
//           {error}
//         </div>
//       )}

//       <div className="flex gap-2 pt-2">
//         <button onClick={() => setPaymentStep('cart')} className="flex-1 px-3 py-2 border rounded-lg hover:bg-gray-50 text-xs font-medium">
//           Back
//         </button>
//         <button
//           onClick={() => paymentMethod === 'paystack' ? handlePaystackPayment() : setPaymentStep('bank')}
//           disabled={loading}
//           className="flex-1 px-3 py-2 bg-gray-900 text-white rounded-lg disabled:opacity-50 flex items-center justify-center gap-1 text-xs font-medium"
//         >
//           {loading && <Loader2 size={12} className="animate-spin" />}
//           Pay
//         </button>
//       </div>
//     </div>
//   );

//   const BankStep = () => (
//     <div className="space-y-3">
//       <div className="bg-blue-50 rounded-lg p-3">
//         <p className="text-[10px] font-medium text-blue-800 mb-2">School Account</p>
//         {bankAccounts.map(account => (
//           <label key={account.id} className={`flex items-start gap-2 p-2 rounded-lg cursor-pointer mb-1 text-xs ${
//             selectedBankAccount?.id === account.id ? 'bg-blue-100' : 'bg-white border border-gray-200'
//           }`}>
//             <input type="radio" checked={selectedBankAccount?.id === account.id}
//               onChange={() => setSelectedBankAccount(account)} className="mt-0.5" />
//             <div>
//               <p className="font-medium text-gray-800">{account.bank_name}</p>
//               <p className="text-[9px] text-gray-500">{account.account_number}</p>
//             </div>
//           </label>
//         ))}
//       </div>

//       <input type="text" placeholder="Your Bank Name" value={bankDetails.bank_name}
//         onChange={e => setBankDetails({...bankDetails, bank_name: e.target.value})}
//         className="w-full px-3 py-2 border rounded-lg text-xs" />
//       <input type="text" placeholder="Account Name" value={bankDetails.account_name}
//         onChange={e => setBankDetails({...bankDetails, account_name: e.target.value})}
//         className="w-full px-3 py-2 border rounded-lg text-xs" />
//       <input type="text" placeholder="Account Number" value={bankDetails.account_number}
//         onChange={e => setBankDetails({...bankDetails, account_number: e.target.value})}
//         className="w-full px-3 py-2 border rounded-lg text-xs" />
//       <input type="date" value={bankDetails.transaction_date}
//         onChange={e => setBankDetails({...bankDetails, transaction_date: e.target.value})}
//         className="w-full px-3 py-2 border rounded-lg text-xs" />

//       {error && <div className="p-2 bg-red-50 rounded-lg text-xs text-red-600">{error}</div>}

//       <div className="flex gap-2 pt-2">
//         <button onClick={() => setPaymentStep('method')} className="flex-1 px-3 py-2 border rounded-lg text-xs font-medium">Back</button>
//         <button onClick={handleBankTransfer} disabled={loading} className="flex-1 px-3 py-2 bg-gray-900 text-white rounded-lg text-xs font-medium">
//           {loading ? <Loader2 size={12} className="animate-spin" /> : `Pay ${formatCurrency(cartTotal)}`}
//         </button>
//       </div>
//     </div>
//   );

//   return (
//     <Modal isOpen={isOpen} onClose={onClose}
//       title={
//         paymentStep === 'cart' ? 'Select Students' :
//         paymentStep === 'method' ? 'Payment Method' : 'Bank Transfer'
//       }
//       size="md"
//     >
//       <div className="py-2">
//         <div className="flex items-center justify-center gap-1 mb-4">
//           {['cart', 'method', 'bank'].map((step, i) => (
//             <React.Fragment key={step}>
//               <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
//                 paymentStep === step ? 'bg-gray-900 text-white' :
//                 ['cart', 'method', 'bank'].indexOf(paymentStep) > i ? 'bg-green-500 text-white' :
//                 'bg-gray-200 text-gray-500'
//               }`}>{i + 1}</div>
//               {i < 2 && <div className="w-6 h-px bg-gray-200" />}
//             </React.Fragment>
//           ))}
//         </div>

//         {paymentStep === 'cart' && <CartStep />}
//         {paymentStep === 'method' && <MethodStep />}
//         {paymentStep === 'bank' && <BankStep />}
//       </div>
//     </Modal>
//   );
// };

// // =====================
// // CHILD DETAIL MODAL (COMPACT)
// // =====================
// const ChildDetailModal = ({ child, onClose }) => {
//   if (!child) return null;

//   const user = child.user || {};
//   const fullName = child.full_name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Student';
//   const childClassName = child.class_level?.name || child.class_level_name || child.class_level_info?.name || 'Not assigned';
//   const feeSummary = child.fee_summary || {};
  
//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(amount || 0);
//   };
//   const formatDate = (d) => {
//     if (!d) return '';
//     return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
//   };

//   return (
//     <Modal isOpen={true} onClose={onClose} title="Student Details" size="lg">
//       <div className="py-3 max-h-[70vh] overflow-y-auto">
//         {/* Profile Header - Compact */}
//         <div className="flex items-start gap-3 pb-3 border-b border-gray-100">
//           <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
//             {child.profile_picture || child.student_image_url ? (
//               <img src={child.profile_picture || child.student_image_url} alt={fullName} className="w-full h-full object-cover rounded-xl" onError={(e) => { e.target.style.display = 'none'; }} />
//             ) : (
//               <span className="text-lg font-bold text-gray-500">{fullName.charAt(0)}</span>
//             )}
//           </div>
//           <div className="flex-1">
//             <h3 className="text-sm font-bold text-gray-900">{fullName}</h3>
//             <div className="flex flex-wrap gap-1 mt-1">
//               <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-[9px] font-medium rounded">{child.admission_number || 'No ID'}</span>
//               <StatusBadge isActive={child.is_active} isGraduated={child.is_graduated} />
//               <FeeBadge feeStatus={child.fee_status} />
//             </div>
//             <p className="text-[10px] text-gray-500 mt-1">{childClassName}</p>
//           </div>
//         </div>

//         {/* Personal Info - Compact Grid */}
//         <Section title="Personal Info" icon={<User size={12} />}>
//           <div className="grid grid-cols-2 gap-2">
//             <InfoRow label="Email" value={user.email} />
//             <InfoRow label="Phone" value={user.phone_number} />
//             <InfoRow label="Gender" value={user.gender} />
//             <InfoRow label="DOB" value={user.date_of_birth ? formatDate(user.date_of_birth) : ''} />
//           </div>
//         </Section>

//         {/* Financial Info */}
//         <Section title="Financial Info" icon={<DollarSign size={12} />}>
//           {feeSummary.total_fee > 0 ? (
//             feeSummary.balance <= 0 ? (
//               <div className="bg-green-50 rounded-lg p-3 text-center">
//                 <CheckCircle size={24} className="mx-auto text-green-500 mb-1" />
//                 <p className="text-xs font-bold text-green-700">Fully Paid</p>
//                 <p className="text-[10px] text-green-600">Paid: {formatCurrency(feeSummary.paid)}</p>
//               </div>
//             ) : (
//               <div className="space-y-2">
//                 <div className="bg-red-50 rounded-lg p-2 text-center">
//                   <div className="text-[10px] text-red-600">Balance Due</div>
//                   <div className="text-base font-bold text-red-600">{formatCurrency(feeSummary.balance)}</div>
//                 </div>
//                 <div className="grid grid-cols-2 gap-2">
//                   <div className="bg-gray-50 rounded-lg p-2 text-center">
//                     <div className="text-[9px] text-gray-500">Total</div>
//                     <div className="text-xs font-bold">{formatCurrency(feeSummary.total_fee)}</div>
//                   </div>
//                   <div className="bg-green-50 rounded-lg p-2 text-center">
//                     <div className="text-[9px] text-green-600">Paid</div>
//                     <div className="text-xs font-bold text-green-600">{formatCurrency(feeSummary.paid)}</div>
//                   </div>
//                 </div>
//                 <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
//                   <div className="h-full bg-green-500 rounded-full" style={{ width: `${feeSummary.total_fee > 0 ? Math.min(100, (feeSummary.paid / feeSummary.total_fee) * 100) : 0}%` }} />
//                 </div>
//               </div>
//             )
//           ) : (
//             <p className="text-gray-400 text-xs text-center py-2">No fee information</p>
//           )}
//         </Section>

//         {/* Health Info - Compact */}
//         <Section title="Health Info" icon={<Heart size={12} />}>
//           <div className="grid grid-cols-2 gap-2">
//             <div className="bg-red-50 rounded-lg p-2 text-center">
//               <div className="text-[9px] text-red-600">Blood Group</div>
//               <div className="text-xs font-bold">{child.blood_group || '—'}</div>
//             </div>
//             <div className="bg-red-50 rounded-lg p-2 text-center">
//               <div className="text-[9px] text-red-600">Genotype</div>
//               <div className="text-xs font-bold">{child.genotype || '—'}</div>
//             </div>
//           </div>
//           {child.has_allergies && <InfoRow label="Allergies" value={child.allergy_details} fullWidth />}
//         </Section>

//         {/* Emergency Contact */}
//         <Section title="Emergency Contact" icon={<Phone size={12} />}>
//           <div className="space-y-2">
//             <InfoRow label="Name" value={child.emergency_contact_name} />
//             <InfoRow label="Phone" value={child.emergency_contact_phone} />
//             <InfoRow label="Relationship" value={child.emergency_contact_relationship} />
//           </div>
//         </Section>
//       </div>
//     </Modal>
//   );
// };

// // =====================
// // SINGLE PAYMENT MODAL (COMPACT)
// // =====================
// const SinglePaymentModal = ({ isOpen, onClose, child, invoice, onSuccess }) => {
//   const [paymentStep, setPaymentStep] = useState('select');
//   const [paymentMethod, setPaymentMethod] = useState('paystack');
//   const [paymentAmount, setPaymentAmount] = useState('');
//   const [bankAccounts, setBankAccounts] = useState([]);
//   const [selectedBankAccount, setSelectedBankAccount] = useState(null);
//   const [bankDetails, setBankDetails] = useState({
//     bank_name: '',
//     account_name: '',
//     account_number: '',
//     transaction_date: '',
//     notes: ''
//   });
//   const [paymentEvidence, setPaymentEvidence] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     if (isOpen && invoice) {
//       setPaymentAmount(invoice.balance_due?.toString() || '');
//       loadBankAccounts();
//     }
//   }, [isOpen, invoice]);

//   const loadBankAccounts = async () => {
//     try {
//       const data = await getActiveBankAccounts();
//       setBankAccounts(data.bank_accounts || []);
//       if (data.bank_accounts && data.bank_accounts.length > 0) {
//         setSelectedBankAccount(data.bank_accounts[0]);
//       }
//     } catch (err) {
//       console.error('Error loading bank accounts:', err);
//     }
//   };

//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(amount || 0);
//   };

//   const handlePaystackPayment = async () => {
//     const amount = parseFloat(paymentAmount);
//     if (!paymentAmount || amount <= 0) {
//       setError('Enter valid amount');
//       return;
//     }
//     if (amount > invoice.balance_due) {
//       setError(`Max: ${formatCurrency(invoice.balance_due)}`);
//       return;
//     }

//     try {
//       setLoading(true);
//       setError('');
//       const result = await initializePayment({
//         invoice_id: invoice.id,
//         payment_method: 'paystack',
//         amount: amount
//       });
//       if (result.authorization_url) {
//         window.location.href = result.authorization_url;
//       } else {
//         setError(result.error || 'Payment failed');
//       }
//     } catch (err) {
//       setError(err.message || 'Failed to initialize payment');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleBankTransfer = async () => {
//     const amount = parseFloat(paymentAmount);
//     if (!paymentAmount || amount <= 0) {
//       setError('Enter valid amount');
//       return;
//     }
//     if (amount > invoice.balance_due) {
//       setError(`Max: ${formatCurrency(invoice.balance_due)}`);
//       return;
//     }

//     try {
//       setLoading(true);
//       setError('');
//       const formData = new FormData();
//       formData.append('invoice_id', invoice.id);
//       formData.append('amount', amount.toString());
//       formData.append('payment_method', 'bank_transfer');
//       formData.append('bank_name', bankDetails.bank_name);
//       formData.append('account_name', bankDetails.account_name);
//       formData.append('account_number', bankDetails.account_number);
//       formData.append('transaction_date', bankDetails.transaction_date || new Date().toISOString().split('T')[0]);
//       formData.append('notes', bankDetails.notes);
//       if (paymentEvidence) {
//         formData.append('payment_evidence', paymentEvidence);
//       }

//       const result = await recordManualPayment(formData);
//       if (result.success) {
//         if (onSuccess) onSuccess();
//         onClose();
//       } else {
//         setError(result.error || 'Failed to record payment');
//       }
//     } catch (err) {
//       setError(err.message || 'Failed to record payment');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!invoice) return null;

//   return (
//     <Modal isOpen={isOpen} onClose={onClose} title={`Pay for ${child?.full_name || 'Student'}`} size="md">
//       <div className="py-3">
//         <div className="bg-gray-50 rounded-lg p-3 mb-3">
//           <div className="flex justify-between text-xs"><span>Invoice:</span><span className="font-medium">{invoice.invoice_number}</span></div>
//           <div className="flex justify-between text-xs mt-1"><span>Balance:</span><span className="font-bold text-red-600">{formatCurrency(invoice.balance_due)}</span></div>
//         </div>

//         {paymentStep === 'select' && (
//           <>
//             <div className="mb-3">
//               <label className="block text-xs font-medium text-gray-600 mb-1.5">Method</label>
//               <div className="grid grid-cols-2 gap-2">
//                 <button onClick={() => setPaymentMethod('paystack')} className={`p-2 border-2 rounded-xl text-center ${paymentMethod === 'paystack' ? 'border-gray-900 bg-gray-50' : 'border-gray-200'}`}>
//                   <CreditCard size={16} className={`mx-auto mb-1 ${paymentMethod === 'paystack' ? 'text-gray-900' : 'text-gray-400'}`} />
//                   <p className={`text-[10px] font-medium ${paymentMethod === 'paystack' ? 'text-gray-900' : 'text-gray-500'}`}>Card</p>
//                 </button>
//                 <button onClick={() => setPaymentMethod('bank_transfer')} className={`p-2 border-2 rounded-xl text-center ${paymentMethod === 'bank_transfer' ? 'border-gray-900 bg-gray-50' : 'border-gray-200'}`}>
//                   <Banknote size={16} className={`mx-auto mb-1 ${paymentMethod === 'bank_transfer' ? 'text-gray-900' : 'text-gray-400'}`} />
//                   <p className={`text-[10px] font-medium ${paymentMethod === 'bank_transfer' ? 'text-gray-900' : 'text-gray-500'}`}>Transfer</p>
//                 </button>
//               </div>
//             </div>

//             <div className="mb-3">
//               <label className="block text-xs font-medium text-gray-600 mb-1">Amount (₦)</label>
//               <input type="number" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} min="1" max={invoice.balance_due} step="500" className="w-full px-3 py-2 border rounded-lg text-sm" />
//             </div>

//             {error && <div className="mb-3 p-2 bg-red-50 rounded-lg text-xs text-red-600">{error}</div>}

//             <div className="flex gap-2 mt-3">
//               <button onClick={onClose} className="flex-1 px-3 py-2 border rounded-lg text-xs font-medium">Cancel</button>
//               <button onClick={() => {
//                 if (paymentMethod === 'paystack') handlePaystackPayment();
//                 else setPaymentStep('bank');
//               }} disabled={loading} className="flex-1 px-3 py-2 bg-gray-900 text-white rounded-lg text-xs font-medium">
//                 {loading && <Loader2 size={12} className="animate-spin inline mr-1" />}Continue
//               </button>
//             </div>
//           </>
//         )}

//         {paymentStep === 'bank' && (
//           <div className="space-y-3">
//             <div className="bg-blue-50 rounded-lg p-3">
//               <p className="text-[10px] font-medium text-blue-800 mb-2">School Account</p>
//               {bankAccounts.map(account => (
//                 <label key={account.id} className={`flex items-start gap-2 p-2 rounded-lg cursor-pointer mb-1 ${selectedBankAccount?.id === account.id ? 'bg-blue-100' : 'bg-white border border-gray-200'}`}>
//                   <input type="radio" checked={selectedBankAccount?.id === account.id} onChange={() => setSelectedBankAccount(account)} />
//                   <div className="text-xs">
//                     <p className="font-medium">{account.bank_name}</p>
//                     <p className="text-[9px] text-gray-500">{account.account_number}</p>
//                   </div>
//                 </label>
//               ))}
//             </div>
//             <input type="text" placeholder="Your Bank" value={bankDetails.bank_name} onChange={e => setBankDetails({...bankDetails, bank_name: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" />
//             <input type="text" placeholder="Account Name" value={bankDetails.account_name} onChange={e => setBankDetails({...bankDetails, account_name: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" />
//             <input type="text" placeholder="Account Number" value={bankDetails.account_number} onChange={e => setBankDetails({...bankDetails, account_number: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" />

//             {error && <div className="p-2 bg-red-50 rounded-lg text-xs text-red-600">{error}</div>}

//             <div className="flex gap-2">
//               <button onClick={() => setPaymentStep('select')} className="flex-1 px-3 py-2 border rounded-lg text-xs">Back</button>
//               <button onClick={handleBankTransfer} disabled={loading} className="flex-1 px-3 py-2 bg-gray-900 text-white rounded-lg text-xs">
//                 {loading && <Loader2 size={12} className="animate-spin" />} Submit
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </Modal>
//   );
// };

// // =====================
// // PAYMENT HISTORY MODAL
// // =====================
// const PaymentHistoryModal = ({ isOpen, onClose, payments }) => {
//   const formatCurrency = (amount) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(amount || 0);
//   const formatDateTime = (date) => {
//     if (!date) return 'N/A';
//     return new Date(date).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
//   };

//   return (
//     <Modal isOpen={isOpen} onClose={onClose} title="Payment History" size="lg">
//       <div className="py-3 max-h-[70vh] overflow-y-auto">
//         {payments.length === 0 ? (
//           <div className="text-center py-8"><History size={40} className="mx-auto text-gray-300 mb-2" /><p className="text-gray-400 text-sm">No payments</p></div>
//         ) : (
//           <div className="space-y-2">
//             {payments.map(payment => (
//               <div key={payment.id} className="border border-gray-100 rounded-xl p-3 hover:bg-gray-50">
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <p className="text-xs font-semibold text-gray-800">{payment.student_name}</p>
//                     <p className="text-[9px] text-gray-400 font-mono">{payment.reference?.slice(-8)}</p>
//                   </div>
//                   <div className="text-right">
//                     <p className="text-xs font-bold text-green-600">{formatCurrency(payment.amount)}</p>
//                     <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-medium ${
//                       payment.status === 'success' ? 'bg-green-100 text-green-700' :
//                       payment.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
//                     }`}>
//                       {payment.status === 'success' ? <CheckCircle size={8} /> : payment.status === 'pending' ? <Clock size={8} /> : <XCircle size={8} />}
//                       {payment.status === 'success' ? 'Paid' : payment.status === 'pending' ? 'Pending' : 'Failed'}
//                     </span>
//                   </div>
//                 </div>
//                 <div className="flex justify-between text-[9px] text-gray-400 mt-2">
//                   <span>{payment.payment_method?.replace('_', ' ')}</span>
//                   <span>{formatDateTime(payment.created_at)}</span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </Modal>
//   );
// };

// // =====================
// // MAIN PARENT PORTAL
// // =====================
// const ParentPortal = () => {
//   const navigate = useNavigate();
//   const { user, logout } = useAuth();
//   const [dashboard, setDashboard] = useState(null);
//   const [invoices, setInvoices] = useState([]);
//   const [payments, setPayments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [selectedChild, setSelectedChild] = useState(null);
//   const [showDetailModal, setShowDetailModal] = useState(false);
//   const [detailLoading, setDetailLoading] = useState(false);
//   const [activeTab, setActiveTab] = useState('children');
//   const [showBulkPaymentModal, setShowBulkPaymentModal] = useState(false);
//   const [showSinglePaymentModal, setShowSinglePaymentModal] = useState(false);
//   const [selectedInvoiceForPayment, setSelectedInvoiceForPayment] = useState(null);
//   const [selectedChildForPayment, setSelectedChildForPayment] = useState(null);
//   const [showPaymentHistoryModal, setShowPaymentHistoryModal] = useState(false);

//   useEffect(() => {
//     loadDashboard();
//     loadInvoicesAndPayments();
//   }, []);

//   const loadDashboard = async () => {
//     try {
//       setLoading(true);
//       const data = await getParentPortalDashboard();
//       setDashboard(data);
//     } catch (err) {
//       console.error('Failed to load dashboard:', err);
//       setError('Failed to load dashboard. Please refresh.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadInvoicesAndPayments = async () => {
//     try {
//       const [invoicesRes, paymentsRes] = await Promise.all([
//         getMyInvoices().catch(() => ({ results: [] })),
//         getPaymentHistory({ limit: 50 }).catch(() => ({ results: [] }))
//       ]);
//       setInvoices(invoicesRes?.results || invoicesRes || []);
//       setPayments(paymentsRes?.results || paymentsRes || []);
//     } catch (err) {
//       console.error('Failed to load invoices/payments:', err);
//     }
//   };

//   const refreshAllData = async () => {
//     await Promise.all([loadDashboard(), loadInvoicesAndPayments()]);
//     setSuccess('Data refreshed');
//     setTimeout(() => setSuccess(''), 3000);
//   };

//   const handleViewChild = async (childId) => {
//     try {
//       setDetailLoading(true);
//       const data = await getParentPortalChildDetail(childId);
//       setSelectedChild(data.child || data);
//       setShowDetailModal(true);
//     } catch (err) {
//       console.error('Failed to load child details:', err);
//       setError('Failed to load student details');
//     } finally {
//       setDetailLoading(false);
//     }
//   };

//   const handlePayForChild = async (child) => {
//     let childInvoices = invoices.filter(
//       inv => (inv.student_id === child.id || inv.student === child.id) && inv.status !== 'paid'
//     );

//     if (childInvoices.length === 0) {
//       try {
//         const { getInvoices } = await import('../../services/paymentService');
//         const res = await getInvoices({ student: child.id });
//         const allInvoices = res?.results || res || [];
//         childInvoices = allInvoices.filter(inv => inv.status !== 'paid');
//       } catch (err) {
//         console.error('Error fetching invoices:', err);
//       }
//     }

//     if (childInvoices.length === 0) {
//       const feeSummary = child.fee_summary || {};
//       if (feeSummary.total_fee > 0 && feeSummary.balance > 0) {
//         setError(`No invoice for ${child.full_name}. Please contact admin.`);
//       } else {
//         setError(`No outstanding balance for ${child.full_name}`);
//       }
//       setTimeout(() => setError(''), 5000);
//       return;
//     }

//     setSelectedChildForPayment(child);
//     setSelectedInvoiceForPayment(childInvoices[0]);
//     setShowSinglePaymentModal(true);
//   };

//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(amount || 0);
//   };

//   if (loading) {
//     return (
//       <DashboardLayout title="Parent Portal">
//         <div className="flex items-center justify-center min-h-[60vh]">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-3"></div>
//             <p className="text-gray-400 text-sm">Loading dashboard...</p>
//           </div>
//         </div>
//       </DashboardLayout>
//     );
//   }

//   const parent = dashboard?.parent || {};
//   const children = dashboard?.children || [];
//   const paymentStats = {
//     total_due: invoices.reduce((sum, inv) => sum + (parseFloat(inv.balance_due) || 0), 0),
//     pending_invoices: invoices.filter(inv => inv.status === 'pending' || inv.status === 'partially_paid' || inv.status === 'overdue').length,
//     successful_payments: payments.filter(p => p.status === 'success').length,
//     total_payments: payments.length,
//   };

//   return (
//     <DashboardLayout title="Parent Portal">
//       <div className="space-y-4 pb-10 px-3 sm:px-0">
        
//         {error && <Alert type="error" message={error} onClose={() => setError('')} />}
//         {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

//         {/* Welcome Header - Compact */}
//         <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
//           <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3">
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
//                 <User size={18} className="text-gray-600" />
//               </div>
//               <div>
//                 <h1 className="text-sm sm:text-base font-bold text-gray-800">Welcome, {parent.full_name?.split(' ')[0] || 'Parent'}</h1>
//               </div>
//             </div>
//             <div className="flex gap-2">
//               <button onClick={refreshAllData} className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
//                 <RefreshCw size={14} />
//               </button>
//               <button onClick={logout} className="inline-flex items-center gap-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-xs text-gray-700 transition-colors">
//                 <LogOut size={12} /> Logout
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Payment Stats Cards - 4 cards that shrink responsively */}
//         <div className="grid grid-cols-4 gap-2 sm:gap-3">
//           <div className="bg-white rounded-xl border border-gray-100 p-2 sm:p-3 shadow-sm">
//             <div className="flex flex-col items-center text-center">
//               <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-100 rounded-lg flex items-center justify-center mb-1">
//                 <DollarSign size={12} className="text-blue-600" />
//               </div>
//               <p className="text-[10px] sm:text-xs font-bold text-gray-800 leading-tight">{formatCurrency(paymentStats.total_due)}</p>
//               <p className="text-[8px] sm:text-[10px] text-gray-400">Due</p>
//             </div>
//           </div>
//           <div className="bg-white rounded-xl border border-gray-100 p-2 sm:p-3 shadow-sm">
//             <div className="flex flex-col items-center text-center">
//               <div className="w-7 h-7 sm:w-8 sm:h-8 bg-yellow-100 rounded-lg flex items-center justify-center mb-1">
//                 <Clock size={12} className="text-yellow-600" />
//               </div>
//               <p className="text-[10px] sm:text-xs font-bold text-gray-800">{paymentStats.pending_invoices}</p>
//               <p className="text-[8px] sm:text-[10px] text-gray-400">Pending</p>
//             </div>
//           </div>
//           <div className="bg-white rounded-xl border border-gray-100 p-2 sm:p-3 shadow-sm">
//             <div className="flex flex-col items-center text-center">
//               <div className="w-7 h-7 sm:w-8 sm:h-8 bg-green-100 rounded-lg flex items-center justify-center mb-1">
//                 <CheckCircle size={12} className="text-green-600" />
//               </div>
//               <p className="text-[10px] sm:text-xs font-bold text-gray-800">{paymentStats.successful_payments}</p>
//               <p className="text-[8px] sm:text-[10px] text-gray-400">Paid</p>
//             </div>
//           </div>
//           <div className="bg-white rounded-xl border border-gray-100 p-2 sm:p-3 shadow-sm cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => setShowPaymentHistoryModal(true)}>
//             <div className="flex flex-col items-center text-center">
//               <div className="w-7 h-7 sm:w-8 sm:h-8 bg-purple-100 rounded-lg flex items-center justify-center mb-1">
//                 <History size={12} className="text-purple-600" />
//               </div>
//               <p className="text-[10px] sm:text-xs font-bold text-gray-800">{paymentStats.total_payments}</p>
//               <p className="text-[8px] sm:text-[10px] text-gray-400">History</p>
//             </div>
//           </div>
//         </div>

//         {/* Bulk Payment Button */}
//         {children.length > 0 && (
//           <button onClick={() => setShowBulkPaymentModal(true)} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors">
//             <Wallet size={14} /> Bulk Payment for All Children
//           </button>
//         )}

//         {/* Tabs */}
//         <div className="border-b border-gray-200">
//           <div className="flex gap-4">
//             <button onClick={() => setActiveTab('children')} className={`pb-2 text-xs sm:text-sm font-medium transition-colors ${activeTab === 'children' ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-500'}`}>
//               Children ({children.length})
//             </button>
//             <button onClick={() => setActiveTab('profile')} className={`pb-2 text-xs sm:text-sm font-medium transition-colors ${activeTab === 'profile' ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-500'}`}>
//               Profile
//             </button>
//           </div>
//         </div>

//         {/* ==================== MY CHILDREN TAB - 2 CARDS PER ROW ON MOBILE ==================== */}
//         {activeTab === 'children' && (
//           children.length === 0 ? (
//             <div className="bg-white rounded-xl border border-gray-100 p-10 text-center">
//               <Users size={32} className="mx-auto text-gray-300 mb-2" />
//               <p className="text-gray-500 text-sm">No children linked</p>
//               <p className="text-[10px] text-gray-400 mt-1">Contact school administration</p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-2 gap-3 sm:gap-4">
//               {children.map((child) => {
//                 const feeSummary = child.fee_summary || {};
//                 const paidPct = feeSummary.total_fee > 0 ? Math.round((feeSummary.paid / feeSummary.total_fee) * 100) : 0;
//                 const hasOutstanding = feeSummary.balance > 0;
//                 const isPaid = feeSummary.balance <= 0 && feeSummary.total_fee > 0;
                
//                 return (
//                   <div key={child.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
//                     <div className="p-3 border-b border-gray-50 bg-gray-50/30">
//                       <div className="flex items-start gap-2">
//                         <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
//                           {child.profile_picture ? (
//                             <img src={child.profile_picture} alt={child.full_name} className="w-full h-full object-cover rounded-lg" />
//                           ) : (
//                             <span className="text-xs font-bold text-gray-500">{child.full_name?.charAt(0) || 'S'}</span>
//                           )}
//                         </div>
//                         <div className="flex-1 min-w-0">
//                           <h3 className="text-xs font-semibold text-gray-800 truncate">{child.full_name}</h3>
//                           <p className="text-[9px] text-gray-400 truncate">{child.class_level?.name || 'No class'}</p>
//                           <div className="flex flex-wrap gap-1 mt-1">
//                             <StatusBadge isActive={child.is_active} isGraduated={child.is_graduated} />
//                             <FeeBadge feeStatus={child.fee_status} />
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="p-3 space-y-2">
//                       {/* Fee Progress - Compact */}
//                       {feeSummary.total_fee > 0 && (
//                         <div>
//                           <div className="flex justify-between text-[8px] text-gray-400 mb-0.5">
//                             <span>Payment</span>
//                             <span>{paidPct}%</span>
//                           </div>
//                           <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
//                             <div className="h-full bg-green-500 rounded-full" style={{ width: `${paidPct}%` }} />
//                           </div>
//                           {hasOutstanding ? (
//                             <p className="text-[9px] font-semibold text-red-600 mt-1">Due: {formatCurrency(feeSummary.balance)}</p>
//                           ) : feeSummary.total_fee > 0 && (
//                             <p className="text-[9px] font-semibold text-green-600 mt-1">Fully Paid</p>
//                           )}
//                         </div>
//                       )}

//                       <div className="flex gap-2 mt-2">
//                         <button
//                           onClick={() => handleViewChild(child.id)}
//                           className="flex-1 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-[10px] font-medium flex items-center justify-center gap-1"
//                         >
//                           <Eye size={10} /> View
//                         </button>

//                         {hasOutstanding && feeSummary.total_fee > 0 && (
//                           <button
//                             onClick={() => handlePayForChild(child)}
//                             className="py-1.5 px-3 bg-gray-900 hover:bg-gray-700 text-white rounded-lg text-[10px] font-medium flex items-center gap-1"
//                           >
//                             <CreditCard size={10} /> Pay
//                           </button>
//                         )}

//                         {isPaid && (
//                           <span className="py-1.5 px-3 bg-green-100 text-green-700 rounded-lg text-[10px] font-medium flex items-center gap-1">
//                             <CheckCircle size={10} /> Paid
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )
//         )}

//         {/* ==================== MY PROFILE TAB ==================== */}
//         {activeTab === 'profile' && (
//           <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
//             <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
//               <h2 className="text-xs font-semibold text-gray-800 flex items-center gap-2"><User size={12} /> Personal Info</h2>
//             </div>
//             <div className="p-4">
//               <div className="grid grid-cols-2 gap-3">
//                 <InfoRow label="Full Name" value={parent.full_name} />
//                 <InfoRow label="Parent ID" value={parent.parent_id} />
//                 <InfoRow label="Email" value={parent.email} />
//                 <InfoRow label="Phone" value={parent.phone} />
//                 <InfoRow label="Parent Type" value={parent.parent_type?.charAt(0).toUpperCase() + parent.parent_type?.slice(1)} />
//                 <InfoRow label="Occupation" value={parent.occupation} />
//                 <InfoRow label="PTA Member" value={parent.is_pta_member ? 'Yes' : 'No'} />
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Modals */}
//       {showDetailModal && selectedChild && <ChildDetailModal child={selectedChild} onClose={() => setShowDetailModal(false)} />}
//       <BulkPaymentModal isOpen={showBulkPaymentModal} onClose={() => setShowBulkPaymentModal(false)} childrenList={children} invoices={invoices} onSuccess={refreshAllData} />
//       <SinglePaymentModal isOpen={showSinglePaymentModal} onClose={() => setShowSinglePaymentModal(false)} child={selectedChildForPayment} invoice={selectedInvoiceForPayment} onSuccess={refreshAllData} />
//       <PaymentHistoryModal isOpen={showPaymentHistoryModal} onClose={() => setShowPaymentHistoryModal(false)} payments={payments} />
//     </DashboardLayout>
//   );
// };

// export default ParentPortal;

// src/pages/parents/ParentPortal.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import Alert from '../../components/common/Alert';
import { Text, Button, Card } from '../../components/ui';
import { User, Users, Eye, BookOpen, DollarSign, TrendingUp, Calendar, Award, FileText, CreditCard, Phone, Mail, Heart, GraduationCap, LogOut, CheckCircle, XCircle, Clock, Printer, RefreshCw, Wallet, History, Loader2 } from 'lucide-react';
import { getParentPortalDashboard, getParentPortalChildDetail } from '../../services/parentService';
import { getMyInvoices, getPaymentHistory, initializePayment, recordManualPayment } from '../../services/paymentService';
import { getActiveBankAccounts } from '../../services/bankAccountService';
import useAuth from '../../hooks/useAuth';

const StatusBadge = ({ isActive, isGraduated }) => {
  if (!isActive) return <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-medium bg-red-100 text-red-700"><XCircle size={9} /> Inactive</span>;
  if (isGraduated) return <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-medium bg-purple-100 text-purple-700"><Award size={9} /> Graduated</span>;
  return <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-medium bg-green-100 text-green-700"><CheckCircle size={9} /> Active</span>;
};

const FeeBadge = ({ feeStatus }) => {
  const cfg = { paid_full: 'bg-green-100 text-green-700', paid_partial: 'bg-yellow-100 text-yellow-700', not_paid: 'bg-red-100 text-red-700', scholarship: 'bg-blue-100 text-blue-700', exempted: 'bg-gray-100 text-gray-600' };
  const labels = { paid_full: 'Fully Paid', paid_partial: 'Partial', not_paid: 'Not Paid', scholarship: 'Scholarship', exempted: 'Exempted' };
  return <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-medium ${cfg[feeStatus] || cfg.not_paid}`}>{labels[feeStatus] || 'Not Paid'}</span>;
};

const ChildDetailModal = ({ child, onClose }) => {
  if (!child) return null;
  const user = child.user || {};
  const fullName = child.full_name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Student';
  const feeSummary = child.fee_summary || {};
  const formatCurrency = (amount) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(amount || 0);
  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '';

  return (
    <Modal isOpen={true} onClose={onClose} title="Student Details" size="lg">
      <div className="py-3 max-h-[70vh] overflow-y-auto">
        <div className="flex items-start gap-3 pb-3 border-b border-gray-100">
          <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0"><span className="text-lg font-bold text-gray-500">{fullName.charAt(0)}</span></div>
          <div className="flex-1"><h3 className="text-sm font-bold text-gray-900">{fullName}</h3><div className="flex flex-wrap gap-1 mt-1"><span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-[9px] font-medium rounded">{child.admission_number || 'No ID'}</span><StatusBadge isActive={child.is_active} isGraduated={child.is_graduated} /><FeeBadge feeStatus={child.fee_status} /></div><p className="text-[10px] text-gray-500 mt-1">{child.class_level?.name || 'Not assigned'}</p></div>
        </div>
        <div className="space-y-3 mt-3"><div><p className="text-[10px] text-gray-400">Personal Info</p><div className="grid grid-cols-2 gap-2 mt-1"><div><p className="text-[9px] text-gray-400">Email</p><p className="text-xs">{user.email || 'N/A'}</p></div><div><p className="text-[9px] text-gray-400">Phone</p><p className="text-xs">{user.phone_number || 'N/A'}</p></div></div></div>
        {feeSummary.total_fee > 0 && (<div><p className="text-[10px] text-gray-400">Financial Info</p><div className="bg-gray-50 rounded-lg p-2 mt-1"><div className="flex justify-between text-xs"><span>Balance Due</span><span className="font-bold text-red-600">{formatCurrency(feeSummary.balance)}</span></div><div className="flex justify-between text-xs"><span>Total Fee</span><span>{formatCurrency(feeSummary.total_fee)}</span></div></div></div>)}
        <div><p className="text-[10px] text-gray-400">Health Info</p><div className="grid grid-cols-2 gap-2 mt-1"><div className="bg-red-50 rounded-lg p-1 text-center"><p className="text-[8px] text-red-600">Blood Group</p><p className="text-xs font-bold">{child.blood_group || '—'}</p></div><div className="bg-red-50 rounded-lg p-1 text-center"><p className="text-[8px] text-red-600">Genotype</p><p className="text-xs font-bold">{child.genotype || '—'}</p></div></div></div>
        {child.emergency_contact_name && (<div><p className="text-[10px] text-gray-400">Emergency Contact</p><div className="mt-1 text-xs"><p>{child.emergency_contact_name} ({child.emergency_contact_relationship})</p><p className="text-gray-500">{child.emergency_contact_phone}</p></div></div>)}
      </div></div>
    </Modal>
  );
};

const PaymentHistoryModal = ({ isOpen, onClose, payments }) => {
  const formatCurrency = (amount) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(amount || 0);
  const formatDateTime = (date) => date ? new Date(date).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'N/A';
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Payment History" size="lg">
      <div className="py-3 max-h-[70vh] overflow-y-auto">{payments.length === 0 ? (<div className="text-center py-8"><History size={40} className="mx-auto text-gray-300 mb-2" /><p className="text-gray-400 text-sm">No payments</p></div>) : (<div className="space-y-2">{payments.map(payment => (<div key={payment.id} className="border border-gray-100 rounded-xl p-3 hover:bg-gray-50"><div className="flex justify-between items-start"><div><p className="text-xs font-semibold text-gray-800">{payment.student_name}</p><p className="text-[9px] text-gray-400 font-mono">{payment.reference?.slice(-8)}</p></div><div className="text-right"><p className="text-xs font-bold text-green-600">{formatCurrency(payment.amount)}</p><span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-medium ${payment.status === 'success' ? 'bg-green-100 text-green-700' : payment.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{payment.status === 'success' ? 'Paid' : payment.status === 'pending' ? 'Pending' : 'Failed'}</span></div></div><div className="flex justify-between text-[9px] text-gray-400 mt-2"><span>{payment.payment_method?.replace('_', ' ')}</span><span>{formatDateTime(payment.created_at)}</span></div></div>))}</div>)}</div>
    </Modal>
  );
};

const ParentPortal = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedChild, setSelectedChild] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [activeTab, setActiveTab] = useState('children');
  const [showPaymentHistoryModal, setShowPaymentHistoryModal] = useState(false);

  useEffect(() => { loadDashboard(); loadPayments(); }, []);

  const loadDashboard = async () => {
    try { setLoading(true); const data = await getParentPortalDashboard(); setDashboard(data); }
    catch (err) { console.error('Failed to load dashboard:', err); setError('Failed to load dashboard'); }
    finally { setLoading(false); }
  };

  const loadPayments = async () => {
    try { const res = await getPaymentHistory({ limit: 50 }); setPayments(res?.results || res || []); }
    catch (err) { console.error('Failed to load payments:', err); }
  };

  const refreshAllData = async () => { await Promise.all([loadDashboard(), loadPayments()]); setSuccess('Data refreshed'); setTimeout(() => setSuccess(''), 3000); };

  const handleViewChild = async (childId) => {
    try { const data = await getParentPortalChildDetail(childId); setSelectedChild(data.child || data); setShowDetailModal(true); }
    catch (err) { console.error('Failed to load child details:', err); setError('Failed to load student details'); }
  };

  const formatCurrency = (amount) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(amount || 0);

  if (loading) {
    return (<DashboardLayout title="Parent Portal"><div className="flex items-center justify-center min-h-[60vh]"><div className="text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-3"></div><p className="text-gray-400 text-sm">Loading dashboard...</p></div></div></DashboardLayout>);
  }

  const parent = dashboard?.parent || {};
  const children = dashboard?.children || [];
  const paymentStats = { total_payments: payments.length, successful_payments: payments.filter(p => p.status === 'success').length };

  return (
    <DashboardLayout title="Parent Portal">
      <div className="h-[calc(100vh-120px)] flex flex-col px-3 sm:px-4 lg:px-6">
        <div className="sticky top-0 z-20 bg-gray-50 -mx-3 sm:-mx-4 lg:-mx-6 px-3 sm:px-4 lg:px-6 pt-4 pb-2">
          <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3 mb-4">
            <div><div className="flex items-center gap-2 mb-0.5"><div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#1D2B49] rounded-xl flex items-center justify-center shadow-sm"><User size={14} className="text-white" /></div><Text variant="h2" className="font-bold">Parent Portal</Text></div><Text variant="caption" className="text-gray-400 pl-9">Welcome, {parent.full_name?.split(' ')[0] || 'Parent'}</Text></div>
            <div className="flex gap-2"><button onClick={refreshAllData} className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50"><RefreshCw size={14} /></button><button onClick={logout} className="inline-flex items-center gap-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-xs text-gray-700"><LogOut size={12} /> Logout</button></div>
          </div>
          {error && <Alert type="error" message={error} onClose={() => setError('')} className="mb-3" />}
          {success && <Alert type="success" message={success} onClose={() => setSuccess('')} className="mb-3" />}

          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="bg-white rounded-xl border border-gray-100 p-2 text-center"><div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-1"><DollarSign size={12} className="text-blue-600" /></div><p className="text-[10px] font-bold">{formatCurrency(dashboard?.summary?.total_balance || 0)}</p><p className="text-[8px] text-gray-400">Due</p></div>
            <div className="bg-white rounded-xl border border-gray-100 p-2 text-center cursor-pointer hover:bg-gray-50" onClick={() => setShowPaymentHistoryModal(true)}><div className="w-7 h-7 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-1"><History size={12} className="text-purple-600" /></div><p className="text-[10px] font-bold">{paymentStats.successful_payments}</p><p className="text-[8px] text-gray-400">Paid</p></div>
            <div className="bg-white rounded-xl border border-gray-100 p-2 text-center"><div className="w-7 h-7 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-1"><Users size={12} className="text-green-600" /></div><p className="text-[10px] font-bold">{children.length}</p><p className="text-[8px] text-gray-400">Children</p></div>
          </div>

          <div className="border-b border-gray-200"><div className="flex gap-4"><button onClick={() => setActiveTab('children')} className={`pb-2 text-xs font-medium transition-colors ${activeTab === 'children' ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-500'}`}>Children ({children.length})</button><button onClick={() => setActiveTab('profile')} className={`pb-2 text-xs font-medium transition-colors ${activeTab === 'profile' ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-500'}`}>Profile</button></div></div>
        </div>

        <div className="flex-1 overflow-y-auto min-h-0 -mx-3 sm:-mx-4 lg:-mx-6 px-3 sm:px-4 lg:px-6 pb-4">
          {activeTab === 'children' && (children.length === 0 ? (<Card className="p-10 text-center"><Users size={32} className="mx-auto text-gray-300 mb-2" /><Text variant="body" className="text-gray-500">No children linked</Text><Text variant="tiny" className="text-gray-400 mt-1">Contact school administration</Text></Card>) : (<div className="grid grid-cols-2 gap-3 sm:gap-4">{children.map((child) => { const feeSummary = child.fee_summary || {}; const paidPct = feeSummary.total_fee > 0 ? Math.round((feeSummary.paid / feeSummary.total_fee) * 100) : 0; return (<Card key={child.id} className="overflow-hidden"><div className="p-3 border-b border-gray-50"><div className="flex items-start gap-2"><div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0"><span className="text-xs font-bold text-gray-500">{child.full_name?.charAt(0) || 'S'}</span></div><div className="flex-1"><h3 className="text-xs font-semibold text-gray-800 truncate">{child.full_name}</h3><p className="text-[9px] text-gray-400 truncate">{child.class_level?.name || 'No class'}</p><div className="flex flex-wrap gap-1 mt-1"><StatusBadge isActive={child.is_active} isGraduated={child.is_graduated} /><FeeBadge feeStatus={child.fee_status} /></div></div></div></div><div className="p-3 space-y-2">{feeSummary.total_fee > 0 && (<div><div className="flex justify-between text-[8px] text-gray-400 mb-0.5"><span>Payment</span><span>{paidPct}%</span></div><div className="h-1 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-green-500 rounded-full" style={{ width: `${paidPct}%` }} /></div>{feeSummary.balance > 0 ? <p className="text-[9px] font-semibold text-red-600 mt-1">Due: {formatCurrency(feeSummary.balance)}</p> : <p className="text-[9px] font-semibold text-green-600 mt-1">Fully Paid</p>}</div>)}<div className="flex gap-2 mt-2"><button onClick={() => handleViewChild(child.id)} className="flex-1 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-[10px] font-medium flex items-center justify-center gap-1"><Eye size={10} /> View</button></div></div></Card>); })}</div>))}

          {activeTab === 'profile' && (<Card className="p-5"><Text variant="small" className="font-semibold text-gray-900 mb-4 pb-2 border-b">Personal Information</Text><div className="grid grid-cols-2 gap-3"><div><p className="text-[9px] text-gray-400">Full Name</p><p className="text-xs font-medium">{parent.full_name}</p></div><div><p className="text-[9px] text-gray-400">Parent ID</p><p className="text-xs font-mono">{parent.parent_id}</p></div><div><p className="text-[9px] text-gray-400">Email</p><p className="text-xs">{parent.email}</p></div><div><p className="text-[9px] text-gray-400">Phone</p><p className="text-xs">{parent.phone}</p></div><div><p className="text-[9px] text-gray-400">Parent Type</p><p className="text-xs">{parent.parent_type?.charAt(0).toUpperCase() + parent.parent_type?.slice(1)}</p></div><div><p className="text-[9px] text-gray-400">Occupation</p><p className="text-xs">{parent.occupation || 'Not specified'}</p></div><div><p className="text-[9px] text-gray-400">PTA Member</p><p className="text-xs">{parent.is_pta_member ? 'Yes' : 'No'}</p></div></div></Card>)}
        </div>
      </div>
      {showDetailModal && selectedChild && <ChildDetailModal child={selectedChild} onClose={() => setShowDetailModal(false)} />}
      <PaymentHistoryModal isOpen={showPaymentHistoryModal} onClose={() => setShowPaymentHistoryModal(false)} payments={payments} />
    </DashboardLayout>
  );
};

export default ParentPortal;