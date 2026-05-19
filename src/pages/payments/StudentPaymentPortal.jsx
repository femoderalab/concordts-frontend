// // /**
// //  * Student Payment Portal - Complete with Dynamic Bank Accounts
// //  */

// // import React, { useState, useEffect } from 'react';
// // import { useNavigate, Link } from 'react-router-dom';
// // import DashboardLayout from '../../components/dashboard/DashboardLayout';
// // import Alert from '../../components/common/Alert';
// // import Button from '../../components/common/Button';
// // import Modal from '../../components/common/modal';
// // import {
// //   CreditCard,
// //   Wallet,
// //   History,
// //   Eye,
// //   Download,
// //   CheckCircle,
// //   XCircle,
// //   Clock,
// //   AlertCircle,
// //   RefreshCw,
// //   TrendingUp,
// //   DollarSign,
// //   Calendar,
// //   Printer,
// //   Banknote,
// //   Loader2,
// //   ArrowRight,
// //   ChevronRight,
// //   Receipt,
// //   Building2
// // } from 'lucide-react';
// // import { getMyInvoices, getPaymentHistory, initializePayment, recordManualPayment } from '../../services/paymentService';
// // import { getActiveBankAccounts } from '../../services/bankAccountService';
// // import useAuth from '../../hooks/useAuth';

// // const StudentPaymentPortal = () => {
// //   const navigate = useNavigate();
// //   const { user } = useAuth();
// //   const [invoices, setInvoices] = useState([]);
// //   const [payments, setPayments] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState('');
// //   const [success, setSuccess] = useState('');
// //   const [selectedInvoice, setSelectedInvoice] = useState(null);
// //   const [showPaymentModal, setShowPaymentModal] = useState(false);
// //   const [showDetailsModal, setShowDetailsModal] = useState(false);
// //   const [activeTab, setActiveTab] = useState('invoices');
// //   const [paymentStep, setPaymentStep] = useState('select');
// //   const [paymentMethod, setPaymentMethod] = useState('paystack');
// //   const [paymentAmount, setPaymentAmount] = useState('');
// //   const [bankAccounts, setBankAccounts] = useState([]);
// //   const [selectedBankAccount, setSelectedBankAccount] = useState(null);
// //   const [bankDetails, setBankDetails] = useState({
// //     bank_name: '',
// //     account_name: '',
// //     account_number: '',
// //     transaction_date: '',
// //     notes: ''
// //   });
// //   const [paymentEvidence, setPaymentEvidence] = useState(null);
// //   const [paymentLoading, setPaymentLoading] = useState(false);
// //   const [paystackLoading, setPaystackLoading] = useState(false);

// //   useEffect(() => {
// //     loadData();
// //     loadBankAccounts();
// //   }, []);

// //   const loadData = async () => {
// //     try {
// //       setLoading(true);
// //       setError('');
// //       const [invoicesRes, paymentsRes] = await Promise.all([
// //         getMyInvoices(),
// //         getPaymentHistory({ limit: 20 })
// //       ]);
// //       setInvoices(invoicesRes?.results || invoicesRes || []);
// //       setPayments(paymentsRes?.results || paymentsRes || []);
// //     } catch (err) {
// //       console.error('Error loading payment data:', err);
// //       setError('Failed to load payment information');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const loadBankAccounts = async () => {
// //     try {
// //       const data = await getActiveBankAccounts();
// //       setBankAccounts(data.bank_accounts || []);
// //       if (data.bank_accounts && data.bank_accounts.length > 0) {
// //         setSelectedBankAccount(data.bank_accounts[0]);
// //       }
// //     } catch (err) {
// //       console.error('Error loading bank accounts:', err);
// //     }
// //   };

// //   const formatCurrency = (amount) => {
// //     if (!amount && amount !== 0) return '₦0.00';
// //     return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);
// //   };

// //   const formatDate = (date) => {
// //     if (!date) return 'N/A';
// //     return new Date(date).toLocaleDateString('en-GB', {
// //       day: 'numeric',
// //       month: 'short',
// //       year: 'numeric'
// //     });
// //   };

// //   const formatDateTime = (date) => {
// //     if (!date) return 'N/A';
// //     return new Date(date).toLocaleString('en-GB', {
// //       day: 'numeric',
// //       month: 'short',
// //       year: 'numeric',
// //       hour: '2-digit',
// //       minute: '2-digit'
// //     });
// //   };

// //   const getPaymentStatusBadge = (status, verifiedAt = null) => {
// //     const config = {
// //       success: { bg: 'bg-green-100 text-green-800', icon: <CheckCircle size={12} />, label: 'Successful' },
// //       pending: { bg: 'bg-yellow-100 text-yellow-800', icon: <Clock size={12} />, label: 'Pending Approval' },
// //       initiated: { bg: 'bg-blue-100 text-blue-800', icon: <Loader2 size={12} className="animate-spin" />, label: 'Processing' },
// //       failed: { bg: 'bg-red-100 text-red-800', icon: <XCircle size={12} />, label: 'Failed' },
// //       rejected: { bg: 'bg-red-100 text-red-800', icon: <XCircle size={12} />, label: 'Rejected' },
// //       refunded: { bg: 'bg-gray-100 text-gray-800', icon: <XCircle size={12} />, label: 'Refunded' }
// //     };
// //     const cfg = config[status] || config.pending;
// //     return (
// //       <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${cfg.bg}`}>
// //         {cfg.icon} {cfg.label}
// //         {verifiedAt && status === 'success' && <span className="text-xs ml-1">({formatDateTime(verifiedAt)})</span>}
// //       </span>
// //     );
// //   };

// //   const getStatusBadge = (status) => {
// //     const config = {
// //       paid: { bg: 'bg-green-100 text-green-800', icon: <CheckCircle size={12} />, label: 'Paid' },
// //       pending: { bg: 'bg-yellow-100 text-yellow-800', icon: <Clock size={12} />, label: 'Pending' },
// //       partially_paid: { bg: 'bg-blue-100 text-blue-800', icon: <TrendingUp size={12} />, label: 'Partially Paid' },
// //       overdue: { bg: 'bg-red-100 text-red-800', icon: <AlertCircle size={12} />, label: 'Overdue' }
// //     };
// //     const cfg = config[status] || config.pending;
// //     return (
// //       <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${cfg.bg}`}>
// //         {cfg.icon} {cfg.label}
// //       </span>
// //     );
// //   };

// //   const handleMakePayment = (invoice) => {
// //     setSelectedInvoice(invoice);
// //     setPaymentAmount(invoice.balance_due?.toString() || '');
// //     setPaymentStep('select');
// //     setPaymentMethod('paystack');
// //     setBankDetails({
// //       bank_name: '',
// //       account_name: '',
// //       account_number: '',
// //       transaction_date: '',
// //       notes: ''
// //     });
// //     setPaymentEvidence(null);
// //     setError('');
// //     setShowPaymentModal(true);
// //   };

// //   const handlePaystackPayment = async () => {
// //     const amount = parseFloat(paymentAmount);
// //     if (!paymentAmount || amount <= 0) {
// //       setError('Please enter a valid amount');
// //       return;
// //     }
// //     if (amount > selectedInvoice.balance_due) {
// //       setError(`Amount cannot exceed balance due (${formatCurrency(selectedInvoice.balance_due)})`);
// //       return;
// //     }

// //     try {
// //       setPaystackLoading(true);
// //       setError('');

// //       const result = await initializePayment({
// //         invoice_id: selectedInvoice.id,
// //         payment_method: 'paystack',
// //         amount: amount
// //       });

// //       if (result.authorization_url) {
// //         window.location.href = result.authorization_url;
// //       } else {
// //         setError(result.error || 'Payment initialization failed');
// //       }
// //     } catch (err) {
// //       console.error('Paystack error:', err);
// //       setError(err.message || 'Failed to initialize payment');
// //     } finally {
// //       setPaystackLoading(false);
// //     }
// //   };

// //   const handleBankTransfer = async () => {
// //     const amount = parseFloat(paymentAmount);
// //     if (!paymentAmount || amount <= 0) {
// //       setError('Please enter a valid amount');
// //       return;
// //     }
// //     if (amount > selectedInvoice.balance_due) {
// //       setError(`Amount cannot exceed balance due (${formatCurrency(selectedInvoice.balance_due)})`);
// //       return;
// //     }

// //     try {
// //       setPaymentLoading(true);
// //       setError('');

// //       const formData = new FormData();
// //       formData.append('invoice_id', selectedInvoice.id);
// //       formData.append('amount', amount.toString());
// //       formData.append('payment_method', 'bank_transfer');
// //       formData.append('bank_name', bankDetails.bank_name);
// //       formData.append('account_name', bankDetails.account_name);
// //       formData.append('account_number', bankDetails.account_number);
// //       formData.append('transaction_date', bankDetails.transaction_date || new Date().toISOString().split('T')[0]);
// //       formData.append('notes', bankDetails.notes);
// //       if (paymentEvidence) {
// //         formData.append('payment_evidence', paymentEvidence);
// //       }

// //       const result = await recordManualPayment(formData);

// //       if (result.success) {
// //         setSuccess('Bank transfer recorded successfully. Awaiting admin approval.');
// //         setShowPaymentModal(false);
// //         loadData();
// //         setTimeout(() => setSuccess(''), 5000);
// //       } else {
// //         setError(result.error || 'Failed to record bank transfer');
// //       }
// //     } catch (err) {
// //       console.error('Bank transfer error:', err);
// //       setError(err.message || 'Failed to record bank transfer');
// //     } finally {
// //       setPaymentLoading(false);
// //     }
// //   };

// //   const handleViewDetails = (invoice) => {
// //     setSelectedInvoice(invoice);
// //     setShowDetailsModal(true);
// //   };

// //   const handlePrintInvoice = (invoice) => {
// //     const win = window.open('', '_blank');
// //     win.document.write(generateInvoiceHTML(invoice));
// //     win.document.close();
// //     win.print();
// //   };

// //   const generateInvoiceHTML = (invoice) => {
// //     return `
// //       <!DOCTYPE html>
// //       <html>
// //       <head>
// //         <meta charset="UTF-8">
// //         <title>Invoice ${invoice.invoice_number}</title>
// //         <style>
// //           body { font-family: Arial, sans-serif; margin: 20px; }
// //           .invoice-container { max-width: 800px; margin: 0 auto; }
// //           .header { text-align: center; margin-bottom: 30px; }
// //           .school-name { font-size: 24px; font-weight: bold; color: #003366; }
// //           .title { font-size: 18px; color: #666; }
// //           table { width: 100%; border-collapse: collapse; margin: 20px 0; }
// //           th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
// //           th { background-color: #f5f5f5; }
// //           .footer { text-align: center; margin-top: 30px; font-size: 10px; color: #888; }
// //         </style>
// //       </head>
// //       <body>
// //         <div class="invoice-container">
// //           <div class="header">
// //             <div class="school-name">CONCORD TUTOR SCHOOL</div>
// //             <div class="title">FEE INVOICE</div>
// //           </div>
// //           <div><strong>Invoice #:</strong> ${invoice.invoice_number}</div>
// //           <div><strong>Student:</strong> ${invoice.student_name}</div>
// //           <div><strong>Session/Term:</strong> ${invoice.session_name} - ${invoice.term_name}</div>
// //           <div><strong>Issue Date:</strong> ${formatDate(invoice.issue_date)}</div>
// //           <div><strong>Due Date:</strong> ${formatDate(invoice.due_date)}</div>
// //           <table>
// //             <thead><tr><th>Description</th><th>Amount</th></tr></thead>
// //             <tbody>
// //               ${invoice.fee_breakdown?.map(item => `<tr><td>${item.name}</td><td>${formatCurrency(item.amount)}</td></tr>`).join('')}
// //               <tr style="font-weight:bold"><td>TOTAL</td><td>${formatCurrency(invoice.total_amount)}</td></tr>
// //             </tbody>
// //           </table>
// //           <p>Amount Paid: ${formatCurrency(invoice.amount_paid)}</p>
// //           <p>Balance Due: ${formatCurrency(invoice.balance_due)}</p>
// //           <div class="footer"><p>Official Invoice from CONCORD TUTOR SCHOOL</p></div>
// //         </div>
// //       </body>
// //       </html>
// //     `;
// //   };

// //   if (loading) {
// //     return (
// //       <DashboardLayout title="Payments">
// //         <div className="flex items-center justify-center min-h-[60vh]">
// //           <div className="text-center">
// //             <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-secondary-500 mx-auto mb-3"></div>
// //             <p className="text-gray-500">Loading payment information...</p>
// //           </div>
// //         </div>
// //       </DashboardLayout>
// //     );
// //   }

// //   const stats = {
// //     total_due: invoices.reduce((sum, inv) => sum + (inv.balance_due || 0), 0),
// //     pending_invoices: invoices.filter(inv => inv.status === 'pending' || inv.status === 'partially_paid').length,
// //     total_payments: payments.length,
// //     successful_payments: payments.filter(p => p.status === 'success').length
// //   };

// //   return (
// //     <DashboardLayout title="Payment Portal">
// //       <div className="space-y-6 pb-10">
// //         {error && <Alert type="error" message={error} onClose={() => setError('')} />}
// //         {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

// //         <div className="flex flex-col md:flex-row md:items-center justify-between">
// //           <div>
// //             <h1 className="text-2xl font-bold text-gray-800">Payment Portal</h1>
// //             <p className="text-gray-500 text-sm">View invoices and make secure payments</p>
// //           </div>
// //           <Button onClick={loadData} variant="outline" className="mt-4 md:mt-0 flex items-center gap-2">
// //             <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Refresh
// //           </Button>
// //         </div>

// //         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
// //           <div className="bg-white rounded-xl border p-4"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"><DollarSign size={18} className="text-blue-600" /></div><div><p className="text-xl font-bold">{formatCurrency(stats.total_due)}</p><p className="text-xs text-gray-500">Total Due</p></div></div></div>
// //           <div className="bg-white rounded-xl border p-4"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center"><Clock size={18} className="text-yellow-600" /></div><div><p className="text-xl font-bold">{stats.pending_invoices}</p><p className="text-xs text-gray-500">Pending Invoices</p></div></div></div>
// //           <div className="bg-white rounded-xl border p-4"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center"><CheckCircle size={18} className="text-green-600" /></div><div><p className="text-xl font-bold">{stats.successful_payments}</p><p className="text-xs text-gray-500">Payments Made</p></div></div></div>
// //           <div className="bg-white rounded-xl border p-4"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center"><Receipt size={18} className="text-purple-600" /></div><div><p className="text-xl font-bold">{invoices.length}</p><p className="text-xs text-gray-500">Total Invoices</p></div></div></div>
// //         </div>

// //         <div className="border-b border-gray-200">
// //           <div className="flex gap-6">
// //             <button onClick={() => setActiveTab('invoices')} className={`pb-3 text-sm font-medium ${activeTab === 'invoices' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}><Wallet size={14} className="inline mr-2" />My Invoices ({invoices.length})</button>
// //             <button onClick={() => setActiveTab('history')} className={`pb-3 text-sm font-medium ${activeTab === 'history' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}><History size={14} className="inline mr-2" />Payment History ({payments.length})</button>
// //           </div>
// //         </div>

// //         {activeTab === 'invoices' && (
// //           invoices.length === 0 ? (
// //             <div className="bg-white rounded-xl border p-12 text-center"><Receipt size={48} className="mx-auto text-gray-300 mb-3" /><p className="text-gray-500">No invoices found</p></div>
// //           ) : (
// //             <div className="space-y-4">
// //               {invoices.map(invoice => (
// //                 <div key={invoice.id} className="bg-white rounded-xl border p-5 hover:shadow-md transition-shadow">
// //                   <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
// //                     <div>
// //                       <div className="flex items-center gap-3 flex-wrap"><h3 className="font-semibold">{invoice.session_name} - {invoice.term_name}</h3>{getStatusBadge(invoice.status)}</div>
// //                       <p className="text-sm text-gray-500 mt-1">Invoice: {invoice.invoice_number}</p>
// //                       <div className="flex flex-wrap gap-4 mt-2 text-sm"><span>Due: {formatDate(invoice.due_date)}</span><span>Total: {formatCurrency(invoice.total_amount)}</span><span className="text-green-600">Paid: {formatCurrency(invoice.amount_paid)}</span><span className="text-red-600 font-medium">Balance: {formatCurrency(invoice.balance_due)}</span></div>
// //                     </div>
// //                     <div className="flex gap-2">
// //                       <button onClick={() => handleViewDetails(invoice)} className="p-2 bg-gray-100 rounded-lg"><Eye size={18} /></button>
// //                       <button onClick={() => handlePrintInvoice(invoice)} className="p-2 bg-gray-100 rounded-lg"><Printer size={18} /></button>
// //                       {invoice.status !== 'paid' && invoice.balance_due > 0 && (
// //                         <Button onClick={() => handleMakePayment(invoice)} className="bg-green-600 hover:bg-green-700"><CreditCard size={16} className="mr-2" />Pay {formatCurrency(invoice.balance_due)}</Button>
// //                       )}
// //                     </div>
// //                   </div>
// //                 </div>
// //               ))}
// //             </div>
// //           )
// //         )}

// //         {activeTab === 'history' && (
// //           payments.length === 0 ? (
// //             <div className="bg-white rounded-xl border p-12 text-center"><History size={48} className="mx-auto text-gray-300 mb-3" /><p className="text-gray-500">No payment history</p></div>
// //           ) : (
// //             <div className="bg-white rounded-xl border overflow-hidden">
// //               <table className="w-full">
// //                 <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Reference</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Amount</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Method</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Status</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Date</th></tr></thead>
// //                 <tbody>
// //                   {payments.map(payment => (
// //                     <tr key={payment.id} className="border-b hover:bg-gray-50">
// //                       <td className="px-4 py-3 text-sm font-mono">{payment.reference}</td>
// //                       <td className="px-4 py-3 font-medium">{formatCurrency(payment.amount)}</td>
// //                       <td className="px-4 py-3 capitalize">{payment.payment_method?.replace('_', ' ')}</td>
// //                       <td>{getPaymentStatusBadge(payment.status, payment.verified_at)}</td>
// //                       <td className="px-4 py-3 text-sm">{formatDateTime(payment.created_at)}</td>
// //                     </tr>
// //                   ))}
// //                 </tbody>
// //               </table>
// //             </div>
// //           )
// //         )}
// //       </div>

// //       {/* Payment Modal */}
// //       <Modal isOpen={showPaymentModal} onClose={() => setShowPaymentModal(false)} title="Make Payment" size="md">
// //         <div className="py-4">
// //           {selectedInvoice && (
// //             <>
// //               <div className="bg-gray-50 rounded-xl p-4 mb-4">
// //                 <div className="flex justify-between text-sm mb-2"><span className="text-gray-600">Invoice:</span><span className="font-medium">{selectedInvoice.invoice_number}</span></div>
// //                 <div className="flex justify-between text-sm mb-2"><span className="text-gray-600">Student:</span><span className="font-medium">{selectedInvoice.student_name}</span></div>
// //                 <div className="flex justify-between text-sm"><span className="text-gray-600">Balance Due:</span><span className="font-bold text-red-600">{formatCurrency(selectedInvoice.balance_due)}</span></div>
// //               </div>

// //               {paymentStep === 'select' && (
// //                 <>
// //                   <div className="mb-4">
// //                     <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
// //                     <div className="grid grid-cols-2 gap-3">
// //                       <button onClick={() => setPaymentMethod('paystack')} className={`p-4 border-2 rounded-xl text-center ${paymentMethod === 'paystack' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
// //                         <CreditCard size={24} className={`mx-auto mb-2 ${paymentMethod === 'paystack' ? 'text-blue-600' : 'text-gray-400'}`} />
// //                         <p className={`text-sm font-medium ${paymentMethod === 'paystack' ? 'text-blue-700' : 'text-gray-600'}`}>Card / Paystack</p>
// //                         <p className="text-xs text-gray-400">Online Payment</p>
// //                       </button>
// //                       <button onClick={() => setPaymentMethod('bank_transfer')} className={`p-4 border-2 rounded-xl text-center ${paymentMethod === 'bank_transfer' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
// //                         <Banknote size={24} className={`mx-auto mb-2 ${paymentMethod === 'bank_transfer' ? 'text-blue-600' : 'text-gray-400'}`} />
// //                         <p className={`text-sm font-medium ${paymentMethod === 'bank_transfer' ? 'text-blue-700' : 'text-gray-600'}`}>Bank Transfer</p>
// //                         <p className="text-xs text-gray-400">Manual Payment</p>
// //                       </button>
// //                     </div>
// //                   </div>

// //                   <div className="mb-4">
// //                     <label className="block text-sm font-medium text-gray-700 mb-2">Amount to Pay (₦)</label>
// //                     <input type="number" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} min="1" max={selectedInvoice.balance_due} step="1000" className="w-full px-3 py-2 border rounded-lg" placeholder="Enter amount" />
// //                     <p className="text-xs text-gray-500 mt-1">Balance: {formatCurrency(selectedInvoice.balance_due)}</p>
// //                   </div>

// //                   {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 flex items-center gap-2"><AlertCircle size={16} />{error}</div>}

// //                   <div className="flex gap-3 mt-6">
// //                     <button onClick={() => setShowPaymentModal(false)} className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
// //                     <button onClick={() => {
// //                       if (paymentMethod === 'paystack') handlePaystackPayment();
// //                       else setPaymentStep('bank');
// //                     }} disabled={paystackLoading} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2">
// //                       {paystackLoading && <Loader2 size={16} className="animate-spin" />}Continue
// //                     </button>
// //                   </div>
// //                 </>
// //               )}

// //               {paymentStep === 'bank' && (
// //                 <div className="space-y-4">
// //                   {/* Dynamic Bank Accounts */}
// //                   <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
// //                     <p className="text-sm font-medium text-blue-800 mb-3 flex items-center gap-2"><Building2 size={16} /> Select Bank Account</p>
// //                     <div className="space-y-2">
// //                       {bankAccounts.map(account => (
// //                         <label key={account.id} className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors ${selectedBankAccount?.id === account.id ? 'bg-blue-100 border border-blue-300' : 'bg-white border border-gray-200 hover:bg-gray-50'}`}>
// //                           <input type="radio" name="bank_account" checked={selectedBankAccount?.id === account.id} onChange={() => setSelectedBankAccount(account)} className="mt-1" />
// //                           <div className="flex-1">
// //                             <p className="font-medium text-gray-800">{account.bank_name}</p>
// //                             <p className="text-sm text-gray-600">Account: {account.account_name}</p>
// //                             <p className="text-xs text-gray-500">Number: {account.account_number} {account.sort_code && `• Sort: ${account.sort_code}`}</p>
// //                           </div>
// //                         </label>
// //                       ))}
// //                     </div>
// //                     {bankAccounts.length === 0 && <p className="text-sm text-amber-600">No bank accounts configured. Please contact school admin.</p>}
// //                   </div>

// //                   <div><label className="block text-sm font-medium text-gray-700 mb-2">Your Bank Name</label>
// //                     <input type="text" value={bankDetails.bank_name} onChange={e => setBankDetails({...bankDetails, bank_name: e.target.value})} className="w-full px-3 py-2 border rounded-lg" placeholder="e.g., GTBank" required />
// //                   </div>
// //                   <div><label className="block text-sm font-medium text-gray-700 mb-2">Your Account Name</label>
// //                     <input type="text" value={bankDetails.account_name} onChange={e => setBankDetails({...bankDetails, account_name: e.target.value})} className="w-full px-3 py-2 border rounded-lg" placeholder="Full name on account" required />
// //                   </div>
// //                   <div><label className="block text-sm font-medium text-gray-700 mb-2">Your Account Number</label>
// //                     <input type="text" value={bankDetails.account_number} onChange={e => setBankDetails({...bankDetails, account_number: e.target.value})} className="w-full px-3 py-2 border rounded-lg" placeholder="10-digit account number" required />
// //                   </div>
// //                   <div><label className="block text-sm font-medium text-gray-700 mb-2">Transaction Date</label>
// //                     <input type="date" value={bankDetails.transaction_date} onChange={e => setBankDetails({...bankDetails, transaction_date: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
// //                   </div>
// //                   <div><label className="block text-sm font-medium text-gray-700 mb-2">Payment Evidence (Optional)</label>
// //                     <input type="file" onChange={e => setPaymentEvidence(e.target.files[0])} accept=".pdf,.jpg,.jpeg,.png" className="w-full" />
// //                   </div>
// //                   <div><label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
// //                     <textarea value={bankDetails.notes} onChange={e => setBankDetails({...bankDetails, notes: e.target.value})} rows="2" className="w-full px-3 py-2 border rounded-lg" placeholder="Any additional information..." />
// //                   </div>

// //                   {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600"><AlertCircle size={16} className="inline mr-2" />{error}</div>}

// //                   <div className="flex gap-3 pt-2">
// //                     <button onClick={() => { setPaymentStep('select'); setError(''); }} className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50">Back</button>
// //                     <button onClick={handleBankTransfer} disabled={paymentLoading || bankAccounts.length === 0} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 flex items-center justify-center gap-2">
// //                       {paymentLoading && <Loader2 size={16} className="animate-spin" />}Submit Transfer Request
// //                     </button>
// //                   </div>
// //                 </div>
// //               )}
// //             </>
// //           )}
// //         </div>
// //       </Modal>

// //       {/* Invoice Details Modal */}
// //       <Modal isOpen={showDetailsModal} onClose={() => setShowDetailsModal(false)} title="Invoice Details" size="md">
// //         {selectedInvoice && (
// //           <div className="py-4 space-y-4">
// //             <div className="bg-gray-50 rounded-lg p-4">
// //               <div className="flex justify-between mb-2"><span className="text-gray-600">Invoice:</span><span className="font-medium">{selectedInvoice.invoice_number}</span></div>
// //               <div className="flex justify-between mb-2"><span className="text-gray-600">Student:</span><span>{selectedInvoice.student_name}</span></div>
// //               <div className="flex justify-between"><span className="text-gray-600">Status:</span>{getStatusBadge(selectedInvoice.status)}</div>
// //             </div>
// //             <div><h4 className="text-sm font-semibold mb-2">Fee Breakdown</h4>
// //               {selectedInvoice.fee_breakdown?.map((item, idx) => <div key={idx} className="flex justify-between text-sm py-1"><span>{item.name}</span><span>{formatCurrency(item.amount)}</span></div>)}
// //               <div className="border-t pt-2 mt-2"><div className="flex justify-between font-bold"><span>Total</span><span>{formatCurrency(selectedInvoice.total_amount)}</span></div>
// //               <div className="flex justify-between text-green-600"><span>Paid</span><span>{formatCurrency(selectedInvoice.amount_paid)}</span></div>
// //               <div className="flex justify-between text-red-600 font-bold"><span>Balance Due</span><span>{formatCurrency(selectedInvoice.balance_due)}</span></div></div>
// //             </div>
// //             <div className="flex gap-3 pt-4">
// //               <button onClick={() => setShowDetailsModal(false)} className="flex-1 px-4 py-2 border rounded-lg">Close</button>
// //               {selectedInvoice.status !== 'paid' && selectedInvoice.balance_due > 0 && (
// //                 <button onClick={() => { setShowDetailsModal(false); handleMakePayment(selectedInvoice); }} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg">Make Payment</button>
// //               )}
// //               <button onClick={() => handlePrintInvoice(selectedInvoice)} className="px-4 py-2 border rounded-lg"><Printer size={14} className="inline" /> Print</button>
// //             </div>
// //           </div>
// //         )}
// //       </Modal>
// //     </DashboardLayout>
// //   );
// // };

// // export default StudentPaymentPortal;a

// /**
//  * Student Payment Portal - Complete with Dynamic Bank Accounts
//  * Fully responsive: mobile-first, tablet, desktop
//  */

// import React, { useState, useEffect } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import DashboardLayout from '../../components/dashboard/DashboardLayout';
// import Alert from '../../components/common/Alert';
// import Button from '../../components/common/Button';
// import Modal from '../../components/common/modal';
// import {
//   CreditCard,
//   Wallet,
//   History,
//   Eye,
//   Download,
//   CheckCircle,
//   XCircle,
//   Clock,
//   AlertCircle,
//   RefreshCw,
//   TrendingUp,
//   DollarSign,
//   Calendar,
//   Printer,
//   Banknote,
//   Loader2,
//   ArrowRight,
//   ChevronRight,
//   Receipt,
//   Building2,
//   X
// } from 'lucide-react';
// import { getMyInvoices, getPaymentHistory, initializePayment, recordManualPayment } from '../../services/paymentService';
// import { getActiveBankAccounts } from '../../services/bankAccountService';
// import useAuth from '../../hooks/useAuth';

// const StudentPaymentPortal = () => {
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const [invoices, setInvoices] = useState([]);
//   const [payments, setPayments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [selectedInvoice, setSelectedInvoice] = useState(null);
//   const [showPaymentModal, setShowPaymentModal] = useState(false);
//   const [showDetailsModal, setShowDetailsModal] = useState(false);
//   const [activeTab, setActiveTab] = useState('invoices');
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
//   const [paymentLoading, setPaymentLoading] = useState(false);
//   const [paystackLoading, setPaystackLoading] = useState(false);

//   useEffect(() => {
//     loadData();
//     loadBankAccounts();
//   }, []);

//   const loadData = async () => {
//     try {
//       setLoading(true);
//       setError('');
//       const [invoicesRes, paymentsRes] = await Promise.all([
//         getMyInvoices(),
//         getPaymentHistory({ limit: 20 })
//       ]);
//       setInvoices(invoicesRes?.results || invoicesRes || []);
//       setPayments(paymentsRes?.results || paymentsRes || []);
//     } catch (err) {
//       console.error('Error loading payment data:', err);
//       setError('Failed to load payment information');
//     } finally {
//       setLoading(false);
//     }
//   };

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
//     if (!amount && amount !== 0) return '₦0';
//     return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(amount);
//   };

//   const formatDate = (date) => {
//     if (!date) return 'N/A';
//     return new Date(date).toLocaleDateString('en-GB', {
//       day: 'numeric',
//       month: 'short',
//       year: 'numeric'
//     });
//   };

//   const formatDateTime = (date) => {
//     if (!date) return 'N/A';
//     return new Date(date).toLocaleString('en-GB', {
//       day: 'numeric',
//       month: 'short',
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   const getPaymentStatusBadge = (status, verifiedAt = null) => {
//     const config = {
//       success: { bg: 'bg-green-100 text-green-800', icon: <CheckCircle size={11} />, label: 'Successful' },
//       pending: { bg: 'bg-yellow-100 text-yellow-800', icon: <Clock size={11} />, label: 'Pending' },
//       initiated: { bg: 'bg-blue-100 text-blue-800', icon: <Loader2 size={11} className="animate-spin" />, label: 'Processing' },
//       failed: { bg: 'bg-red-100 text-red-800', icon: <XCircle size={11} />, label: 'Failed' },
//       rejected: { bg: 'bg-red-100 text-red-800', icon: <XCircle size={11} />, label: 'Rejected' },
//       refunded: { bg: 'bg-gray-100 text-gray-800', icon: <XCircle size={11} />, label: 'Refunded' }
//     };
//     const cfg = config[status] || config.pending;
//     return (
//       <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] sm:text-xs font-medium ${cfg.bg}`}>
//         {cfg.icon} {cfg.label}
//       </span>
//     );
//   };

//   const getStatusBadge = (status) => {
//     const config = {
//       paid: { bg: 'bg-green-100 text-green-800', icon: <CheckCircle size={11} />, label: 'Paid' },
//       pending: { bg: 'bg-yellow-100 text-yellow-800', icon: <Clock size={11} />, label: 'Pending' },
//       partially_paid: { bg: 'bg-blue-100 text-blue-800', icon: <TrendingUp size={11} />, label: 'Partial' },
//       overdue: { bg: 'bg-red-100 text-red-800', icon: <AlertCircle size={11} />, label: 'Overdue' }
//     };
//     const cfg = config[status] || config.pending;
//     return (
//       <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] sm:text-xs font-medium ${cfg.bg}`}>
//         {cfg.icon} {cfg.label}
//       </span>
//     );
//   };

//   const handleMakePayment = (invoice) => {
//     setSelectedInvoice(invoice);
//     setPaymentAmount(invoice.balance_due?.toString() || '');
//     setPaymentStep('select');
//     setPaymentMethod('paystack');
//     setBankDetails({
//       bank_name: '',
//       account_name: '',
//       account_number: '',
//       transaction_date: '',
//       notes: ''
//     });
//     setPaymentEvidence(null);
//     setError('');
//     setShowPaymentModal(true);
//   };

//   const handlePaystackPayment = async () => {
//     const amount = parseFloat(paymentAmount);
//     if (!paymentAmount || amount <= 0) {
//       setError('Please enter a valid amount');
//       return;
//     }
//     if (amount > selectedInvoice.balance_due) {
//       setError(`Amount cannot exceed balance due (${formatCurrency(selectedInvoice.balance_due)})`);
//       return;
//     }

//     try {
//       setPaystackLoading(true);
//       setError('');

//       const result = await initializePayment({
//         invoice_id: selectedInvoice.id,
//         payment_method: 'paystack',
//         amount: amount
//       });

//       if (result.authorization_url) {
//         window.location.href = result.authorization_url;
//       } else {
//         setError(result.error || 'Payment initialization failed');
//       }
//     } catch (err) {
//       console.error('Paystack error:', err);
//       setError(err.message || 'Failed to initialize payment');
//     } finally {
//       setPaystackLoading(false);
//     }
//   };

//   const handleBankTransfer = async () => {
//     const amount = parseFloat(paymentAmount);
//     if (!paymentAmount || amount <= 0) {
//       setError('Please enter a valid amount');
//       return;
//     }
//     if (amount > selectedInvoice.balance_due) {
//       setError(`Amount cannot exceed balance due (${formatCurrency(selectedInvoice.balance_due)})`);
//       return;
//     }

//     try {
//       setPaymentLoading(true);
//       setError('');

//       const formData = new FormData();
//       formData.append('invoice_id', selectedInvoice.id);
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
//         setSuccess('Bank transfer recorded successfully. Awaiting admin approval.');
//         setShowPaymentModal(false);
//         loadData();
//         setTimeout(() => setSuccess(''), 5000);
//       } else {
//         setError(result.error || 'Failed to record bank transfer');
//       }
//     } catch (err) {
//       console.error('Bank transfer error:', err);
//       setError(err.message || 'Failed to record bank transfer');
//     } finally {
//       setPaymentLoading(false);
//     }
//   };

//   const handleViewDetails = (invoice) => {
//     setSelectedInvoice(invoice);
//     setShowDetailsModal(true);
//   };

//   const handlePrintInvoice = (invoice) => {
//     const win = window.open('', '_blank');
//     win.document.write(generateInvoiceHTML(invoice));
//     win.document.close();
//     win.print();
//   };

//   const generateInvoiceHTML = (invoice) => {
//     return `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <meta charset="UTF-8">
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         <title>Invoice ${invoice.invoice_number}</title>
//         <style>
//           body { font-family: Arial, sans-serif; margin: 20px; }
//           .invoice-container { max-width: 800px; margin: 0 auto; }
//           .header { text-align: center; margin-bottom: 30px; }
//           .school-name { font-size: 24px; font-weight: bold; color: #003366; }
//           .title { font-size: 18px; color: #666; }
//           table { width: 100%; border-collapse: collapse; margin: 20px 0; }
//           th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
//           th { background-color: #f5f5f5; }
//           .footer { text-align: center; margin-top: 30px; font-size: 10px; color: #888; }
//           @media print {
//             body { margin: 0; }
//             .no-print { display: none; }
//           }
//         </style>
//       </head>
//       <body>
//         <div class="invoice-container">
//           <div class="header">
//             <div class="school-name">CONCORD TUTOR SCHOOL</div>
//             <div class="title">FEE INVOICE</div>
//           </div>
//           <div><strong>Invoice #:</strong> ${invoice.invoice_number}</div>
//           <div><strong>Student:</strong> ${invoice.student_name}</div>
//           <div><strong>Session/Term:</strong> ${invoice.session_name} - ${invoice.term_name}</div>
//           <div><strong>Issue Date:</strong> ${formatDate(invoice.issue_date)}</div>
//           <div><strong>Due Date:</strong> ${formatDate(invoice.due_date)}</div>
//           <table>
//             <thead><tr><th>Description</th><th>Amount</th></tr></thead>
//             <tbody>
//               ${invoice.fee_breakdown?.map(item => `<tr><td>${item.name}</td><td>${formatCurrency(item.amount)}</td></tr>`).join('')}
//               <tr style="font-weight:bold"><td>TOTAL</td><td>${formatCurrency(invoice.total_amount)}</td></tr>
//             </tbody>
//           </table>
//           <p>Amount Paid: ${formatCurrency(invoice.amount_paid)}</p>
//           <p>Balance Due: ${formatCurrency(invoice.balance_due)}</p>
//           <div class="footer"><p>Official Invoice from CONCORD TUTOR SCHOOL</p></div>
//         </div>
//       </body>
//       </html>
//     `;
//   };

//   if (loading) {
//     return (
//       <DashboardLayout title="Payments">
//         <div className="flex items-center justify-center min-h-[60vh]">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-b-2 border-gray-900 mx-auto mb-3"></div>
//             <p className="text-gray-400 text-sm">Loading payment information...</p>
//           </div>
//         </div>
//       </DashboardLayout>
//     );
//   }

//   const stats = {
//     total_due: invoices.reduce((sum, inv) => sum + (inv.balance_due || 0), 0),
//     pending_invoices: invoices.filter(inv => inv.status === 'pending' || inv.status === 'partially_paid').length,
//     total_payments: payments.length,
//     successful_payments: payments.filter(p => p.status === 'success').length
//   };

//   return (
//     <DashboardLayout title="Payment Portal">
//       <div className="space-y-4 sm:space-y-6 pb-12 px-3 sm:px-0">
        
//         {error && <Alert type="error" message={error} onClose={() => setError('')} />}
//         {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

//         {/* Header */}
//         <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3">
//           <div>
//             <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Payment Portal</h1>
//             <p className="text-gray-500 text-xs sm:text-sm mt-0.5">View invoices and make secure payments</p>
//           </div>
//           <button onClick={loadData} className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 border border-gray-200 bg-white text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm">
//             <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
//           </button>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
//           <div className="bg-white rounded-xl border border-gray-100 p-3 sm:p-4 shadow-sm">
//             <div className="flex items-center gap-2 sm:gap-3">
//               <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-xl flex items-center justify-center">
//                 <DollarSign size={14} className="text-blue-600 sm:w-4 sm:h-4" />
//               </div>
//               <div>
//                 <p className="text-sm sm:text-base font-bold text-gray-800">{formatCurrency(stats.total_due)}</p>
//                 <p className="text-[10px] sm:text-xs text-gray-400">Total Due</p>
//               </div>
//             </div>
//           </div>
//           <div className="bg-white rounded-xl border border-gray-100 p-3 sm:p-4 shadow-sm">
//             <div className="flex items-center gap-2 sm:gap-3">
//               <div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
//                 <Clock size={14} className="text-yellow-600 sm:w-4 sm:h-4" />
//               </div>
//               <div>
//                 <p className="text-xl sm:text-2xl font-bold text-gray-800">{stats.pending_invoices}</p>
//                 <p className="text-[10px] sm:text-xs text-gray-400">Pending</p>
//               </div>
//             </div>
//           </div>
//           <div className="bg-white rounded-xl border border-gray-100 p-3 sm:p-4 shadow-sm">
//             <div className="flex items-center gap-2 sm:gap-3">
//               <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-xl flex items-center justify-center">
//                 <CheckCircle size={14} className="text-green-600 sm:w-4 sm:h-4" />
//               </div>
//               <div>
//                 <p className="text-xl sm:text-2xl font-bold text-gray-800">{stats.successful_payments}</p>
//                 <p className="text-[10px] sm:text-xs text-gray-400">Payments</p>
//               </div>
//             </div>
//           </div>
//           <div className="bg-white rounded-xl border border-gray-100 p-3 sm:p-4 shadow-sm">
//             <div className="flex items-center gap-2 sm:gap-3">
//               <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-xl flex items-center justify-center">
//                 <Receipt size={14} className="text-purple-600 sm:w-4 sm:h-4" />
//               </div>
//               <div>
//                 <p className="text-xl sm:text-2xl font-bold text-gray-800">{invoices.length}</p>
//                 <p className="text-[10px] sm:text-xs text-gray-400">Invoices</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Tabs */}
//         <div className="border-b border-gray-200">
//           <div className="flex gap-4 sm:gap-6">
//             <button 
//               onClick={() => setActiveTab('invoices')} 
//               className={`pb-3 text-xs sm:text-sm font-medium flex items-center gap-1.5 ${activeTab === 'invoices' ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-500'}`}
//             >
//               <Wallet size={14} /> Invoices ({invoices.length})
//             </button>
//             <button 
//               onClick={() => setActiveTab('history')} 
//               className={`pb-3 text-xs sm:text-sm font-medium flex items-center gap-1.5 ${activeTab === 'history' ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-500'}`}
//             >
//               <History size={14} /> History ({payments.length})
//             </button>
//           </div>
//         </div>

//         {/* Invoices Tab */}
//         {activeTab === 'invoices' && (
//           invoices.length === 0 ? (
//             <div className="bg-white rounded-xl border border-gray-100 p-10 sm:p-12 text-center shadow-sm">
//               <Receipt size={40} className="mx-auto text-gray-200 mb-3 sm:w-12 sm:h-12" />
//               <p className="text-gray-400 text-sm">No invoices found</p>
//             </div>
//           ) : (
//             <div className="space-y-3 sm:space-y-4">
//               {invoices.map(invoice => (
//                 <div key={invoice.id} className="bg-white rounded-xl border border-gray-100 p-4 sm:p-5 hover:shadow-md transition-shadow">
//                   <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
//                     <div className="flex-1">
//                       <div className="flex flex-wrap items-center gap-2 mb-1">
//                         <h3 className="font-semibold text-gray-800 text-sm sm:text-base">{invoice.session_name} - {invoice.term_name}</h3>
//                         {getStatusBadge(invoice.status)}
//                       </div>
//                       <p className="text-xs text-gray-400">Invoice: {invoice.invoice_number}</p>
//                       <div className="flex flex-wrap gap-3 sm:gap-4 mt-2 text-xs sm:text-sm">
//                         <span>Due: {formatDate(invoice.due_date)}</span>
//                         <span>Total: {formatCurrency(invoice.total_amount)}</span>
//                         <span className="text-green-600">Paid: {formatCurrency(invoice.amount_paid)}</span>
//                         <span className="text-red-600 font-medium">Balance: {formatCurrency(invoice.balance_due)}</span>
//                       </div>
//                     </div>
//                     <div className="flex gap-2">
//                       <button onClick={() => handleViewDetails(invoice)} className="p-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors" title="View Details">
//                         <Eye size={16} />
//                       </button>
//                       <button onClick={() => handlePrintInvoice(invoice)} className="p-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors" title="Print">
//                         <Printer size={16} />
//                       </button>
//                       {invoice.status !== 'paid' && invoice.balance_due > 0 && (
//                         <button onClick={() => handleMakePayment(invoice)} className="px-3 sm:px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors flex items-center gap-1.5">
//                           <CreditCard size={14} /> Pay {formatCurrency(invoice.balance_due)}
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )
//         )}

//         {/* Payment History Tab */}
//         {activeTab === 'history' && (
//           payments.length === 0 ? (
//             <div className="bg-white rounded-xl border border-gray-100 p-10 sm:p-12 text-center shadow-sm">
//               <History size={40} className="mx-auto text-gray-200 mb-3 sm:w-12 sm:h-12" />
//               <p className="text-gray-400 text-sm">No payment history</p>
//             </div>
//           ) : (
//             <>
//               {/* Desktop Table */}
//               <div className="hidden md:block bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
//                 <table className="w-full">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reference</th>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-100">
//                     {payments.map(payment => (
//                       <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
//                         <td className="px-4 py-3 text-xs font-mono">{payment.reference?.slice(-12) || payment.reference}</td>
//                         <td className="px-4 py-3 font-semibold text-sm">{formatCurrency(payment.amount)}</td>
//                         <td className="px-4 py-3 text-xs capitalize">{payment.payment_method?.replace('_', ' ')}</td>
//                         <td className="px-4 py-3">{getPaymentStatusBadge(payment.status, payment.verified_at)}</td>
//                         <td className="px-4 py-3 text-xs">{formatDateTime(payment.created_at)}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>

//               {/* Mobile Cards */}
//               <div className="md:hidden space-y-3">
//                 {payments.map(payment => (
//                   <div key={payment.id} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
//                     <div className="flex justify-between items-start mb-2">
//                       <p className="font-mono text-xs text-gray-500">{payment.reference?.slice(-12) || payment.reference}</p>
//                       {getPaymentStatusBadge(payment.status)}
//                     </div>
//                     <div className="grid grid-cols-2 gap-2 mt-2">
//                       <div>
//                         <p className="text-[10px] text-gray-400">Amount</p>
//                         <p className="text-base font-bold text-gray-800">{formatCurrency(payment.amount)}</p>
//                       </div>
//                       <div>
//                         <p className="text-[10px] text-gray-400">Method</p>
//                         <p className="text-sm capitalize">{payment.payment_method?.replace('_', ' ')}</p>
//                       </div>
//                       <div className="col-span-2">
//                         <p className="text-[10px] text-gray-400">Date</p>
//                         <p className="text-xs">{formatDateTime(payment.created_at)}</p>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </>
//           )
//         )}
//       </div>

//       {/* Payment Modal */}
//       <Modal isOpen={showPaymentModal} onClose={() => setShowPaymentModal(false)} title="Make Payment" size="md">
//         <div className="py-4">
//           {selectedInvoice && (
//             <>
//               <div className="bg-gray-50 rounded-xl p-4 mb-4">
//                 <div className="flex flex-col sm:flex-row sm:justify-between text-sm gap-2 mb-2">
//                   <span className="text-gray-500">Invoice:</span>
//                   <span className="font-medium text-gray-800">{selectedInvoice.invoice_number}</span>
//                 </div>
//                 <div className="flex flex-col sm:flex-row sm:justify-between text-sm gap-2 mb-2">
//                   <span className="text-gray-500">Student:</span>
//                   <span className="font-medium text-gray-800">{selectedInvoice.student_name}</span>
//                 </div>
//                 <div className="flex flex-col sm:flex-row sm:justify-between text-sm">
//                   <span className="text-gray-500">Balance Due:</span>
//                   <span className="font-bold text-red-600">{formatCurrency(selectedInvoice.balance_due)}</span>
//                 </div>
//               </div>

//               {paymentStep === 'select' && (
//                 <>
//                   <div className="mb-4">
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
//                     <div className="grid grid-cols-2 gap-3">
//                       <button 
//                         onClick={() => setPaymentMethod('paystack')} 
//                         className={`p-3 sm:p-4 border-2 rounded-xl text-center transition-all ${paymentMethod === 'paystack' ? 'border-gray-900 bg-gray-50' : 'border-gray-200'}`}
//                       >
//                         <CreditCard size={20} className={`mx-auto mb-1.5 ${paymentMethod === 'paystack' ? 'text-gray-900' : 'text-gray-400'}`} />
//                         <p className={`text-xs sm:text-sm font-medium ${paymentMethod === 'paystack' ? 'text-gray-900' : 'text-gray-500'}`}>Card / Paystack</p>
//                       </button>
//                       <button 
//                         onClick={() => setPaymentMethod('bank_transfer')} 
//                         className={`p-3 sm:p-4 border-2 rounded-xl text-center transition-all ${paymentMethod === 'bank_transfer' ? 'border-gray-900 bg-gray-50' : 'border-gray-200'}`}
//                       >
//                         <Banknote size={20} className={`mx-auto mb-1.5 ${paymentMethod === 'bank_transfer' ? 'text-gray-900' : 'text-gray-400'}`} />
//                         <p className={`text-xs sm:text-sm font-medium ${paymentMethod === 'bank_transfer' ? 'text-gray-900' : 'text-gray-500'}`}>Bank Transfer</p>
//                       </button>
//                     </div>
//                   </div>

//                   <div className="mb-4">
//                     <label className="block text-sm font-medium text-gray-700 mb-1.5">Amount to Pay (₦)</label>
//                     <input 
//                       type="number" 
//                       value={paymentAmount} 
//                       onChange={(e) => setPaymentAmount(e.target.value)} 
//                       min="1" 
//                       max={selectedInvoice.balance_due} 
//                       step="100" 
//                       className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" 
//                       placeholder="Enter amount"
//                     />
//                     <p className="text-xs text-gray-400 mt-1">Balance: {formatCurrency(selectedInvoice.balance_due)}</p>
//                   </div>

//                   {error && (
//                     <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-center gap-2">
//                       <AlertCircle size={14} />{error}
//                     </div>
//                   )}

//                   <div className="flex flex-col sm:flex-row gap-3 mt-6">
//                     <button onClick={() => setShowPaymentModal(false)} className="px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium text-sm order-2 sm:order-1">
//                       Cancel
//                     </button>
//                     <button 
//                       onClick={() => {
//                         if (paymentMethod === 'paystack') handlePaystackPayment();
//                         else setPaymentStep('bank');
//                       }} 
//                       disabled={paystackLoading} 
//                       className="px-4 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-700 transition-colors font-medium text-sm flex items-center justify-center gap-2 order-1 sm:order-2"
//                     >
//                       {paystackLoading && <Loader2 size={14} className="animate-spin" />}
//                       Continue
//                     </button>
//                   </div>
//                 </>
//               )}

//               {paymentStep === 'bank' && (
//                 <div className="space-y-4">
//                   {/* Dynamic Bank Accounts */}
//                   <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
//                     <p className="text-sm font-medium text-blue-800 mb-3 flex items-center gap-2">
//                       <Building2 size={14} /> School Bank Accounts
//                     </p>
//                     <div className="space-y-2">
//                       {bankAccounts.map(account => (
//                         <label key={account.id} className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-colors ${selectedBankAccount?.id === account.id ? 'bg-blue-100 border border-blue-300' : 'bg-white border border-gray-200'}`}>
//                           <input type="radio" name="bank_account" checked={selectedBankAccount?.id === account.id} onChange={() => setSelectedBankAccount(account)} className="mt-1" />
//                           <div className="flex-1">
//                             <p className="font-medium text-gray-800 text-sm">{account.bank_name}</p>
//                             <p className="text-xs text-gray-500">{account.account_name}</p>
//                             <p className="text-[10px] text-gray-400">Acct: {account.account_number} {account.sort_code && `• Sort: ${account.sort_code}`}</p>
//                           </div>
//                         </label>
//                       ))}
//                     </div>
//                     {bankAccounts.length === 0 && <p className="text-sm text-amber-600">No bank accounts configured. Please contact school admin.</p>}
//                   </div>

//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">Your Bank Name</label>
//                       <input type="text" value={bankDetails.bank_name} onChange={e => setBankDetails({...bankDetails, bank_name: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" placeholder="e.g., GTBank" />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">Account Name</label>
//                       <input type="text" value={bankDetails.account_name} onChange={e => setBankDetails({...bankDetails, account_name: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" placeholder="Full name on account" />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
//                       <input type="text" value={bankDetails.account_number} onChange={e => setBankDetails({...bankDetails, account_number: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" placeholder="10-digit account number" />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Date</label>
//                       <input type="date" value={bankDetails.transaction_date} onChange={e => setBankDetails({...bankDetails, transaction_date: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Payment Evidence (Optional)</label>
//                     <input type="file" onChange={e => setPaymentEvidence(e.target.files[0])} accept=".pdf,.jpg,.jpeg,.png" className="w-full text-sm" />
//                     <p className="text-[10px] text-gray-400 mt-1">Upload a screenshot or receipt of your transfer</p>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
//                     <textarea value={bankDetails.notes} onChange={e => setBankDetails({...bankDetails, notes: e.target.value})} rows={2} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" placeholder="Any additional information..." />
//                   </div>

//                   {error && (
//                     <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-center gap-2">
//                       <AlertCircle size={14} />{error}
//                     </div>
//                   )}

//                   <div className="flex flex-col sm:flex-row gap-3 pt-2">
//                     <button onClick={() => { setPaymentStep('select'); setError(''); }} className="px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium text-sm order-2 sm:order-1">
//                       Back
//                     </button>
//                     <button onClick={handleBankTransfer} disabled={paymentLoading || bankAccounts.length === 0} className="px-4 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-700 transition-colors font-medium text-sm flex items-center justify-center gap-2 order-1 sm:order-2 disabled:opacity-50">
//                       {paymentLoading && <Loader2 size={14} className="animate-spin" />}
//                       Submit Transfer Request
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       </Modal>

//       {/* Invoice Details Modal */}
//       <Modal isOpen={showDetailsModal} onClose={() => setShowDetailsModal(false)} title="Invoice Details" size="md">
//         {selectedInvoice && (
//           <div className="py-4 space-y-4 max-h-[75vh] overflow-y-auto">
//             <div className="bg-gray-50 rounded-xl p-4">
//               <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mb-2">
//                 <span className="text-gray-500 text-sm">Invoice:</span>
//                 <span className="font-medium text-gray-800 text-sm">{selectedInvoice.invoice_number}</span>
//               </div>
//               <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mb-2">
//                 <span className="text-gray-500 text-sm">Student:</span>
//                 <span className="text-gray-800 text-sm">{selectedInvoice.student_name}</span>
//               </div>
//               <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
//                 <span className="text-gray-500 text-sm">Status:</span>
//                 {getStatusBadge(selectedInvoice.status)}
//               </div>
//             </div>
            
//             <div>
//               <h4 className="text-sm font-semibold text-gray-800 mb-2">Fee Breakdown</h4>
//               <div className="bg-gray-50 rounded-xl overflow-hidden">
//                 {selectedInvoice.fee_breakdown?.map((item, idx) => (
//                   <div key={idx} className="flex justify-between px-3 py-2 text-sm border-b last:border-b-0">
//                     <span className="text-gray-600">{item.name}</span>
//                     <span className="font-medium">{formatCurrency(item.amount)}</span>
//                   </div>
//                 ))}
//               </div>
//               <div className="mt-3 pt-3 border-t border-gray-100 space-y-1">
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-500">Total</span>
//                   <span className="font-semibold">{formatCurrency(selectedInvoice.total_amount)}</span>
//                 </div>
//                 <div className="flex justify-between text-sm text-green-600">
//                   <span>Paid</span>
//                   <span>{formatCurrency(selectedInvoice.amount_paid)}</span>
//                 </div>
//                 <div className="flex justify-between text-sm text-red-600 font-bold">
//                   <span>Balance Due</span>
//                   <span>{formatCurrency(selectedInvoice.balance_due)}</span>
//                 </div>
//               </div>
//             </div>
            
//             <div className="flex flex-col sm:flex-row gap-3 pt-4">
//               <button onClick={() => setShowDetailsModal(false)} className="px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium text-sm order-2 sm:order-1">
//                 Close
//               </button>
//               {selectedInvoice.status !== 'paid' && selectedInvoice.balance_due > 0 && (
//                 <button onClick={() => { setShowDetailsModal(false); handleMakePayment(selectedInvoice); }} className="px-4 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-700 transition-colors font-medium text-sm flex items-center justify-center gap-2 order-1 sm:order-2">
//                   <CreditCard size={14} /> Make Payment
//                 </button>
//               )}
//               <button onClick={() => handlePrintInvoice(selectedInvoice)} className="px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium text-sm order-3">
//                 <Printer size={14} className="inline mr-2" /> Print
//               </button>
//             </div>
//           </div>
//         )}
//       </Modal>
//     </DashboardLayout>
//   );
// };

// export default StudentPaymentPortal;


/**
 * Student Payment Portal - Complete with Dynamic Bank Accounts
 * Fully responsive: mobile-first, tablet, desktop
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import Alert from '../../components/common/Alert';
import Modal from '../../components/common/modal';
import {
  CreditCard,
  Wallet,
  History,
  Eye,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  RefreshCw,
  TrendingUp,
  DollarSign,
  Calendar,
  Printer,
  Banknote,
  Loader2,
  ArrowRight,
  ChevronRight,
  Receipt,
  Building2,
  X,
  Filter,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  Grid3x3,
  Table2
} from 'lucide-react';
import { getMyInvoices, getPaymentHistory, initializePayment, recordManualPayment } from '../../services/paymentService';
import { getActiveBankAccounts } from '../../services/bankAccountService';
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
const StatusBadge = ({ status, isPayment = false }) => {
  const invoiceConfig = {
    paid: { bg: 'bg-green-100 text-green-700', icon: <CheckCircle size={10} />, label: 'Paid' },
    pending: { bg: 'bg-yellow-100 text-yellow-700', icon: <Clock size={10} />, label: 'Pending' },
    partially_paid: { bg: 'bg-blue-100 text-blue-700', icon: <TrendingUp size={10} />, label: 'Partial' },
    overdue: { bg: 'bg-red-100 text-red-700', icon: <AlertCircle size={10} />, label: 'Overdue' }
  };
  
  const paymentConfig = {
    success: { bg: 'bg-green-100 text-green-700', icon: <CheckCircle size={10} />, label: 'Successful' },
    pending: { bg: 'bg-yellow-100 text-yellow-700', icon: <Clock size={10} />, label: 'Pending' },
    initiated: { bg: 'bg-blue-100 text-blue-700', icon: <Loader2 size={10} className="animate-spin" />, label: 'Processing' },
    failed: { bg: 'bg-red-100 text-red-700', icon: <XCircle size={10} />, label: 'Failed' },
    rejected: { bg: 'bg-red-100 text-red-700', icon: <XCircle size={10} />, label: 'Rejected' }
  };
  
  const config = isPayment ? paymentConfig : invoiceConfig;
  const c = config[status] || (isPayment ? paymentConfig.pending : invoiceConfig.pending);
  
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] md:text-[10px] font-medium ${c.bg}`}>
      {c.icon} {c.label}
    </span>
  );
};

// Invoice Card Component (for mobile grid view)
const InvoiceCard = ({ invoice, formatCurrency, formatDate, getStatusBadge, onView, onPrint, onPay }) => (
  <Card className="p-3 space-y-2 hover:shadow-md transition-shadow duration-200 h-full">
    <div className="flex justify-between items-start gap-2">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <Text variant="tiny" className="font-bold text-gray-800 truncate">{invoice.session_name}</Text>
          {getStatusBadge(invoice.status)}
        </div>
        <Text variant="caption" className="text-gray-400 font-mono">{invoice.invoice_number}</Text>
      </div>
    </div>
    
    <div className="space-y-1">
      <div className="flex justify-between">
        <Text variant="tiny" className="text-gray-400">Total</Text>
        <Text variant="small" className="font-semibold text-gray-800">{formatCurrency(invoice.total_amount)}</Text>
      </div>
      <div className="flex justify-between">
        <Text variant="tiny" className="text-gray-400">Paid</Text>
        <Text variant="small" className="font-semibold text-green-600">{formatCurrency(invoice.amount_paid)}</Text>
      </div>
      <div className="flex justify-between">
        <Text variant="tiny" className="text-gray-400">Balance</Text>
        <Text variant="small" className="font-bold text-red-600">{formatCurrency(invoice.balance_due)}</Text>
      </div>
      <div className="flex justify-between">
        <Text variant="tiny" className="text-gray-400">Due Date</Text>
        <Text variant="tiny" className="text-gray-500">{formatDate(invoice.due_date)}</Text>
      </div>
    </div>
    
    <div className="flex gap-1 pt-1">
      <button onClick={() => onView(invoice)} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors" title="View">
        <Eye size={12} />
      </button>
      <button onClick={() => onPrint(invoice)} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors" title="Print">
        <Printer size={12} />
      </button>
      {invoice.status !== 'paid' && invoice.balance_due > 0 && (
        <button onClick={() => onPay(invoice)} className="flex-1 px-2 py-1 bg-[#D94801] text-white rounded-lg text-[10px] font-medium hover:bg-[#C24000] transition-colors">
          Pay {formatCurrency(invoice.balance_due)}
        </button>
      )}
    </div>
  </Card>
);

// Payment Card Component (for mobile grid view)
const PaymentCard = ({ payment, formatCurrency, formatDateTime, getPaymentStatusBadge }) => (
  <Card className="p-3 space-y-2 hover:shadow-md transition-shadow duration-200 h-full">
    <div className="flex justify-between items-start gap-2">
      <Text variant="tiny" className="font-mono text-gray-500 flex-1 truncate">{payment.reference?.slice(-12) || payment.reference}</Text>
      {getPaymentStatusBadge(payment.status)}
    </div>
    
    <div className="grid grid-cols-2 gap-2">
      <div>
        <Text variant="tiny" className="text-gray-400">Amount</Text>
        <Text variant="small" className="font-bold text-gray-800">{formatCurrency(payment.amount)}</Text>
      </div>
      <div>
        <Text variant="tiny" className="text-gray-400">Method</Text>
        <Text variant="tiny" className="capitalize">{payment.payment_method?.replace('_', ' ')}</Text>
      </div>
      <div className="col-span-2">
        <Text variant="tiny" className="text-gray-400">Date</Text>
        <Text variant="tiny" className="text-gray-500">{formatDateTime(payment.created_at)}</Text>
      </div>
    </div>
  </Card>
);

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
    <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-100">
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
        Next <ChevronRightIcon size={14} />
      </Button>
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================
const StudentPaymentPortal = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [activeTab, setActiveTab] = useState('invoices');
  const [paymentStep, setPaymentStep] = useState('select');
  const [paymentMethod, setPaymentMethod] = useState('paystack');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [bankAccounts, setBankAccounts] = useState([]);
  const [selectedBankAccount, setSelectedBankAccount] = useState(null);
  const [bankDetails, setBankDetails] = useState({
    bank_name: '',
    account_name: '',
    account_number: '',
    transaction_date: '',
    notes: ''
  });
  const [paymentEvidence, setPaymentEvidence] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paystackLoading, setPaystackLoading] = useState(false);
  
  // Pagination for invoices
  const [currentInvoicePage, setCurrentInvoicePage] = useState(1);
  const [currentPaymentPage, setCurrentPaymentPage] = useState(1);
  const itemsPerPage = 10;

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
      const [invoicesRes, paymentsRes] = await Promise.all([
        getMyInvoices(),
        getPaymentHistory({ limit: 100 })
      ]);
      setInvoices(invoicesRes?.results || invoicesRes || []);
      setPayments(paymentsRes?.results || paymentsRes || []);
      setCurrentInvoicePage(1);
      setCurrentPaymentPage(1);
    } catch (err) {
      console.error('Error loading payment data:', err);
      setError('Failed to load payment information');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadBankAccounts = useCallback(async () => {
    try {
      const data = await getActiveBankAccounts();
      setBankAccounts(data.bank_accounts || []);
      if (data.bank_accounts && data.bank_accounts.length > 0) {
        setSelectedBankAccount(data.bank_accounts[0]);
      }
    } catch (err) {
      console.error('Error loading bank accounts:', err);
    }
  }, []);

  useEffect(() => {
    loadData();
    loadBankAccounts();
  }, [loadData, loadBankAccounts]);

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '₦0';
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(amount);
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatDateTime = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPaymentStatusBadge = (status) => <StatusBadge status={status} isPayment />;
  const getStatusBadge = (status) => <StatusBadge status={status} isPayment={false} />;

  // Pagination for invoices
  const totalInvoicePages = Math.ceil(invoices.length / itemsPerPage);
  const paginatedInvoices = invoices.slice((currentInvoicePage - 1) * itemsPerPage, currentInvoicePage * itemsPerPage);
  
  // Pagination for payments
  const totalPaymentPages = Math.ceil(payments.length / itemsPerPage);
  const paginatedPayments = payments.slice((currentPaymentPage - 1) * itemsPerPage, currentPaymentPage * itemsPerPage);

  const handleMakePayment = (invoice) => {
    setSelectedInvoice(invoice);
    setPaymentAmount(invoice.balance_due?.toString() || '');
    setPaymentStep('select');
    setPaymentMethod('paystack');
    setBankDetails({
      bank_name: '',
      account_name: '',
      account_number: '',
      transaction_date: '',
      notes: ''
    });
    setPaymentEvidence(null);
    setError('');
    setShowPaymentModal(true);
  };

  const handlePaystackPayment = async () => {
    const amount = parseFloat(paymentAmount);
    if (!paymentAmount || amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    if (amount > selectedInvoice.balance_due) {
      setError(`Amount cannot exceed balance due (${formatCurrency(selectedInvoice.balance_due)})`);
      return;
    }

    try {
      setPaystackLoading(true);
      setError('');

      const result = await initializePayment({
        invoice_id: selectedInvoice.id,
        payment_method: 'paystack',
        amount: amount
      });

      if (result.authorization_url) {
        window.location.href = result.authorization_url;
      } else {
        setError(result.error || 'Payment initialization failed');
      }
    } catch (err) {
      console.error('Paystack error:', err);
      setError(err.message || 'Failed to initialize payment');
    } finally {
      setPaystackLoading(false);
    }
  };

  const handleBankTransfer = async () => {
    const amount = parseFloat(paymentAmount);
    if (!paymentAmount || amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    if (amount > selectedInvoice.balance_due) {
      setError(`Amount cannot exceed balance due (${formatCurrency(selectedInvoice.balance_due)})`);
      return;
    }

    try {
      setPaymentLoading(true);
      setError('');

      const formData = new FormData();
      formData.append('invoice_id', selectedInvoice.id);
      formData.append('amount', amount.toString());
      formData.append('payment_method', 'bank_transfer');
      formData.append('bank_name', bankDetails.bank_name);
      formData.append('account_name', bankDetails.account_name);
      formData.append('account_number', bankDetails.account_number);
      formData.append('transaction_date', bankDetails.transaction_date || new Date().toISOString().split('T')[0]);
      formData.append('notes', bankDetails.notes);
      if (paymentEvidence) {
        formData.append('payment_evidence', paymentEvidence);
      }

      const result = await recordManualPayment(formData);

      if (result.success) {
        setSuccess('Bank transfer recorded successfully. Awaiting admin approval.');
        setShowPaymentModal(false);
        loadData();
        setTimeout(() => setSuccess(''), 5000);
      } else {
        setError(result.error || 'Failed to record bank transfer');
      }
    } catch (err) {
      console.error('Bank transfer error:', err);
      setError(err.message || 'Failed to record bank transfer');
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleViewDetails = (invoice) => {
    setSelectedInvoice(invoice);
    setShowDetailsModal(true);
  };

  const handlePrintInvoice = (invoice) => {
    const win = window.open('', '_blank');
    win.document.write(generateInvoiceHTML(invoice));
    win.document.close();
    win.print();
  };

  const generateInvoiceHTML = (invoice) => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invoice ${invoice.invoice_number}</title>
        <style>
          body { font-family: 'Sora', Arial, sans-serif; margin: 20px; background: #f5f5f5; }
          .invoice-container { max-width: 800px; margin: 0 auto; background: white; border-radius: 16px; padding: 30px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #D94801; padding-bottom: 20px; }
          .school-name { font-size: 24px; font-weight: bold; color: #1D2B49; }
          .title { font-size: 18px; color: #D94801; margin-top: 5px; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
          th { background-color: #f5f5f5; font-weight: 600; }
          .total-row { font-weight: bold; background-color: #f5f5f5; }
          .footer { text-align: center; margin-top: 30px; font-size: 10px; color: #888; border-top: 1px solid #ddd; padding-top: 20px; }
          @media print {
            body { background: white; margin: 0; }
            .invoice-container { box-shadow: none; padding: 20px; }
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <div class="header">
            <div class="school-name">CONCORD TUTOR SCHOOL</div>
            <div class="title">FEE INVOICE</div>
          </div>
          <div class="info-grid">
            <div><strong>Invoice #:</strong> ${invoice.invoice_number}</div>
            <div><strong>Student:</strong> ${invoice.student_name}</div>
            <div><strong>Session/Term:</strong> ${invoice.session_name} - ${invoice.term_name}</div>
            <div><strong>Due Date:</strong> ${formatDate(invoice.due_date)}</div>
          </div>
          <table>
            <thead><tr><th>Description</th><th>Amount</th></tr></thead>
            <tbody>
              ${invoice.fee_breakdown?.map(item => `<tr><td>${item.name}</td><td>${formatCurrency(item.amount)}</td></tr>`).join('')}
              <tr class="total-row"><td>TOTAL</td><td>${formatCurrency(invoice.total_amount)}</td></tr>
            </tbody>
          </table>
          <p><strong>Amount Paid:</strong> ${formatCurrency(invoice.amount_paid)}</p>
          <p><strong>Balance Due:</strong> ${formatCurrency(invoice.balance_due)}</p>
          <div class="footer"><p>Official Invoice from CONCORD TUTOR SCHOOL</p></div>
        </div>
      </body>
      </html>
    `;
  };

  const stats = {
    total_due: invoices.reduce((sum, inv) => sum + (inv.balance_due || 0), 0),
    pending_invoices: invoices.filter(inv => inv.status === 'pending' || inv.status === 'partially_paid').length,
    total_payments: payments.length,
    successful_payments: payments.filter(p => p.status === 'success').length
  };

  if (loading && invoices.length === 0 && payments.length === 0) {
    return (
      <DashboardLayout title="Payment Portal">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <RefreshCw className="animate-spin h-8 w-8 text-[#D94801] mx-auto mb-4" />
            <Text variant="body" className="text-gray-400">Loading payment information...</Text>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Payment Portal">
      {/* Fixed height container with internal scrolling */}
      <div className="h-[calc(100vh-120px)] flex flex-col px-3 sm:px-4 lg:px-6">
        
        {/* STICKY HEADER SECTION */}
        <div className="sticky top-0 z-20 bg-gray-50 -mx-3 sm:-mx-4 lg:-mx-6 px-3 sm:px-4 lg:px-6 pt-4 pb-2">
          {/* Header */}
          <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#1D2B49] rounded-xl flex items-center justify-center shadow-sm">
                  <Wallet size={14} className="text-white" />
                </div>
                <Text variant="h2" className="font-bold">Payment Portal</Text>
              </div>
              <Text variant="caption" className="text-gray-400 pl-9">
                View invoices and make secure payments
              </Text>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="small" icon={RefreshCw} onClick={loadData} loading={loading}>
                Refresh
              </Button>
            </div>
          </div>

          {/* Alerts */}
          {error && <Alert type="error" message={error} onClose={() => setError('')} />}
          {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-3">
            <StatCard title="Total Due" value={formatCurrency(stats.total_due)} icon={DollarSign} color="bg-blue-100" bgColor="border-gray-100" />
            <StatCard title="Pending" value={stats.pending_invoices} icon={Clock} color="bg-yellow-100" bgColor="border-gray-100" />
            <StatCard title="Payments" value={stats.successful_payments} icon={CheckCircle} color="bg-green-100" bgColor="border-gray-100" />
            <StatCard title="Invoices" value={invoices.length} icon={Receipt} color="bg-purple-100" bgColor="border-gray-100" />
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-2">
            <div className="flex gap-4 sm:gap-6">
              <button 
                onClick={() => { setActiveTab('invoices'); setCurrentInvoicePage(1); }} 
                className={`pb-3 text-xs sm:text-sm font-medium flex items-center gap-1.5 transition-colors ${activeTab === 'invoices' ? 'text-[#D94801] border-b-2 border-[#D94801]' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <Wallet size={14} /> Invoices ({invoices.length})
              </button>
              <button 
                onClick={() => { setActiveTab('history'); setCurrentPaymentPage(1); }} 
                className={`pb-3 text-xs sm:text-sm font-medium flex items-center gap-1.5 transition-colors ${activeTab === 'history' ? 'text-[#D94801] border-b-2 border-[#D94801]' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <History size={14} /> History ({payments.length})
              </button>
            </div>
          </div>
        </div>

        {/* SCROLLABLE CONTENT SECTION */}
        <div className="flex-1 overflow-y-auto min-h-0 -mx-3 sm:-mx-4 lg:-mx-6 px-3 sm:px-4 lg:px-6 pb-4">
          
          {/* Invoices Tab */}
          {activeTab === 'invoices' && (
            invoices.length === 0 ? (
              <Card className="p-10 sm:p-12 text-center">
                <Receipt size={40} className="mx-auto text-gray-200 mb-3" />
                <Text variant="body" className="text-gray-400">No invoices found</Text>
              </Card>
            ) : (
              <div className="space-y-3">
                {/* Desktop Table View */}
                <div className="hidden md:block">
                  <Card className="overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100 sticky top-0 z-10">
                          <tr>
                            <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Invoice</th>
                            <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Session / Term</th>
                            <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Total</th>
                            <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Paid</th>
                            <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Balance</th>
                            <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Due Date</th>
                            <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-4 py-3 text-right text-[10px] font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {paginatedInvoices.map((invoice) => (
                            <tr key={invoice.id} className="hover:bg-gray-50 transition-colors duration-150">
                              <td className="px-4 py-3">
                                <div>
                                  <Text variant="tiny" className="font-mono text-blue-600">{invoice.invoice_number}</Text>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <Text variant="small" className="font-medium text-gray-800">{invoice.session_name}</Text>
                                <Text variant="tiny" className="text-gray-400">{invoice.term_name}</Text>
                              </td>
                              <td className="px-4 py-3">
                                <Text variant="small" className="font-semibold text-gray-800">{formatCurrency(invoice.total_amount)}</Text>
                              </td>
                              <td className="px-4 py-3">
                                <Text variant="small" className="text-green-600">{formatCurrency(invoice.amount_paid)}</Text>
                              </td>
                              <td className="px-4 py-3">
                                <Text variant="small" className="font-bold text-red-600">{formatCurrency(invoice.balance_due)}</Text>
                              </td>
                              <td className="px-4 py-3">
                                <Text variant="tiny" className="text-gray-500">{formatDate(invoice.due_date)}</Text>
                              </td>
                              <td className="px-4 py-3">
                                {getStatusBadge(invoice.status)}
                              </td>
                              <td className="px-4 py-3 text-right">
                                <div className="flex items-center justify-end gap-1">
                                  <button onClick={() => handleViewDetails(invoice)} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors" title="View">
                                    <Eye size={14} />
                                  </button>
                                  <button onClick={() => handlePrintInvoice(invoice)} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors" title="Print">
                                    <Printer size={14} />
                                  </button>
                                  {invoice.status !== 'paid' && invoice.balance_due > 0 && (
                                    <Button variant="primary" size="tiny" onClick={() => handleMakePayment(invoice)}>
                                      Pay
                                    </Button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {totalInvoicePages > 1 && (
                      <Pagination currentPage={currentInvoicePage} totalPages={totalInvoicePages} onPageChange={setCurrentInvoicePage} />
                    )}
                    <div className="px-4 py-2 border-t border-gray-100 text-center">
                      <Text variant="caption" className="text-gray-400">
                        Showing {((currentInvoicePage - 1) * itemsPerPage) + 1} to {Math.min(currentInvoicePage * itemsPerPage, invoices.length)} of {invoices.length} invoices
                      </Text>
                    </div>
                  </Card>
                </div>

                {/* Mobile Cards - 2 per row */}
                <div className="md:hidden">
                  <div className="grid grid-cols-2 gap-2">
                    {paginatedInvoices.map((invoice) => (
                      <InvoiceCard
                        key={invoice.id}
                        invoice={invoice}
                        formatCurrency={formatCurrency}
                        formatDate={formatDate}
                        getStatusBadge={getStatusBadge}
                        onView={handleViewDetails}
                        onPrint={handlePrintInvoice}
                        onPay={handleMakePayment}
                      />
                    ))}
                  </div>
                  {totalInvoicePages > 1 && (
                    <div className="mt-3">
                      <Pagination currentPage={currentInvoicePage} totalPages={totalInvoicePages} onPageChange={setCurrentInvoicePage} />
                    </div>
                  )}
                  <div className="mt-2 text-center">
                    <Text variant="caption" className="text-gray-400">
                      Showing {paginatedInvoices.length} of {invoices.length} invoices
                    </Text>
                  </div>
                </div>
              </div>
            )
          )}

          {/* Payment History Tab */}
          {activeTab === 'history' && (
            payments.length === 0 ? (
              <Card className="p-10 sm:p-12 text-center">
                <History size={40} className="mx-auto text-gray-200 mb-3" />
                <Text variant="body" className="text-gray-400">No payment history</Text>
              </Card>
            ) : (
              <div className="space-y-3">
                {/* Desktop Table View */}
                <div className="hidden md:block">
                  <Card className="overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100 sticky top-0 z-10">
                          <tr>
                            <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Reference</th>
                            <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                            <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Method</th>
                            <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {paginatedPayments.map((payment) => (
                            <tr key={payment.id} className="hover:bg-gray-50 transition-colors duration-150">
                              <td className="px-4 py-3">
                                <Text variant="tiny" className="font-mono">{payment.reference?.slice(-12) || payment.reference}</Text>
                              </td>
                              <td className="px-4 py-3">
                                <Text variant="small" className="font-semibold text-gray-800">{formatCurrency(payment.amount)}</Text>
                              </td>
                              <td className="px-4 py-3">
                                <Text variant="tiny" className="capitalize">{payment.payment_method?.replace('_', ' ')}</Text>
                              </td>
                              <td className="px-4 py-3">
                                {getPaymentStatusBadge(payment.status)}
                              </td>
                              <td className="px-4 py-3 hidden lg:table-cell">
                                <Text variant="tiny" className="text-gray-500">{formatDateTime(payment.created_at)}</Text>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {totalPaymentPages > 1 && (
                      <Pagination currentPage={currentPaymentPage} totalPages={totalPaymentPages} onPageChange={setCurrentPaymentPage} />
                    )}
                    <div className="px-4 py-2 border-t border-gray-100 text-center">
                      <Text variant="caption" className="text-gray-400">
                        Showing {((currentPaymentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPaymentPage * itemsPerPage, payments.length)} of {payments.length} payments
                      </Text>
                    </div>
                  </Card>
                </div>

                {/* Mobile Cards - 2 per row */}
                <div className="md:hidden">
                  <div className="grid grid-cols-2 gap-2">
                    {paginatedPayments.map((payment) => (
                      <PaymentCard
                        key={payment.id}
                        payment={payment}
                        formatCurrency={formatCurrency}
                        formatDateTime={formatDateTime}
                        getPaymentStatusBadge={getPaymentStatusBadge}
                      />
                    ))}
                  </div>
                  {totalPaymentPages > 1 && (
                    <div className="mt-3">
                      <Pagination currentPage={currentPaymentPage} totalPages={totalPaymentPages} onPageChange={setCurrentPaymentPage} />
                    </div>
                  )}
                  <div className="mt-2 text-center">
                    <Text variant="caption" className="text-gray-400">
                      Showing {paginatedPayments.length} of {payments.length} payments
                    </Text>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* Payment Modal */}
      <Modal isOpen={showPaymentModal} onClose={() => { setShowPaymentModal(false); setError(''); }} title="Make Payment" size="md">
        {selectedInvoice && (
          <div className="py-3 space-y-4 max-h-[70vh] overflow-y-auto px-1">
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                <Text variant="tiny" className="text-gray-500">Invoice:</Text>
                <Text variant="small" className="font-medium text-gray-800">{selectedInvoice.invoice_number}</Text>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                <Text variant="tiny" className="text-gray-500">Student:</Text>
                <Text variant="small" className="font-medium text-gray-800">{selectedInvoice.student_name}</Text>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                <Text variant="tiny" className="text-gray-500">Balance Due:</Text>
                <Text variant="h4" className="font-bold text-red-600">{formatCurrency(selectedInvoice.balance_due)}</Text>
              </div>
            </div>

            {paymentStep === 'select' && (
              <>
                <div>
                  <label className="block text-[10px] font-medium text-gray-500 mb-1">Payment Method</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => setPaymentMethod('paystack')} 
                      className={`p-3 border-2 rounded-xl text-center transition-all ${paymentMethod === 'paystack' ? 'border-[#D94801] bg-orange-50' : 'border-gray-200'}`}
                    >
                      <CreditCard size={20} className={`mx-auto mb-1.5 ${paymentMethod === 'paystack' ? 'text-[#D94801]' : 'text-gray-400'}`} />
                      <Text variant="tiny" className={`font-medium ${paymentMethod === 'paystack' ? 'text-[#D94801]' : 'text-gray-500'}`}>Card / Paystack</Text>
                    </button>
                    <button 
                      onClick={() => setPaymentMethod('bank_transfer')} 
                      className={`p-3 border-2 rounded-xl text-center transition-all ${paymentMethod === 'bank_transfer' ? 'border-[#D94801] bg-orange-50' : 'border-gray-200'}`}
                    >
                      <Banknote size={20} className={`mx-auto mb-1.5 ${paymentMethod === 'bank_transfer' ? 'text-[#D94801]' : 'text-gray-400'}`} />
                      <Text variant="tiny" className={`font-medium ${paymentMethod === 'bank_transfer' ? 'text-[#D94801]' : 'text-gray-500'}`}>Bank Transfer</Text>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-medium text-gray-500 mb-1">Amount to Pay (₦)</label>
                  <input 
                    type="number" 
                    value={paymentAmount} 
                    onChange={(e) => setPaymentAmount(e.target.value)} 
                    min="1" 
                    max={selectedInvoice.balance_due} 
                    step="100" 
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]" 
                    placeholder="Enter amount"
                  />
                  <Text variant="tiny" className="text-gray-400 mt-1">Balance: {formatCurrency(selectedInvoice.balance_due)}</Text>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button variant="outline" onClick={() => setShowPaymentModal(false)} className="flex-1">Cancel</Button>
                  <Button 
                    variant="primary" 
                    onClick={() => {
                      if (paymentMethod === 'paystack') handlePaystackPayment();
                      else setPaymentStep('bank');
                    }} 
                    disabled={paystackLoading} 
                    className="flex-1"
                  >
                    {paystackLoading && <Loader2 size={14} className="animate-spin" />}
                    Continue
                  </Button>
                </div>
              </>
            )}

            {paymentStep === 'bank' && (
              <div className="space-y-3">
                {/* Dynamic Bank Accounts */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                  <Text variant="tiny" className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                    <Building2 size={12} /> School Bank Accounts
                  </Text>
                  <div className="space-y-2">
                    {bankAccounts.map(account => (
                      <label key={account.id} className={`flex items-start gap-2 p-2 rounded-lg cursor-pointer transition-colors ${selectedBankAccount?.id === account.id ? 'bg-blue-100 border border-blue-300' : 'bg-white border border-gray-200'}`}>
                        <input type="radio" name="bank_account" checked={selectedBankAccount?.id === account.id} onChange={() => setSelectedBankAccount(account)} className="mt-0.5" />
                        <div className="flex-1">
                          <Text variant="tiny" className="font-medium text-gray-800">{account.bank_name}</Text>
                          <Text variant="tiny" className="text-gray-500">{account.account_name}</Text>
                          <Text variant="tiny" className="text-gray-400">Acct: {account.account_number}</Text>
                        </div>
                      </label>
                    ))}
                  </div>
                  {bankAccounts.length === 0 && <Text variant="tiny" className="text-amber-600">No bank accounts configured. Please contact school admin.</Text>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-medium text-gray-500 mb-1">Your Bank Name</label>
                    <input type="text" value={bankDetails.bank_name} onChange={e => setBankDetails({...bankDetails, bank_name: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]" placeholder="e.g., GTBank" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-gray-500 mb-1">Account Name</label>
                    <input type="text" value={bankDetails.account_name} onChange={e => setBankDetails({...bankDetails, account_name: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]" placeholder="Full name on account" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-gray-500 mb-1">Account Number</label>
                    <input type="text" value={bankDetails.account_number} onChange={e => setBankDetails({...bankDetails, account_number: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]" placeholder="10-digit account number" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-gray-500 mb-1">Transaction Date</label>
                    <input type="date" value={bankDetails.transaction_date} onChange={e => setBankDetails({...bankDetails, transaction_date: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-medium text-gray-500 mb-1">Payment Evidence (Optional)</label>
                  <input type="file" onChange={e => setPaymentEvidence(e.target.files[0])} accept=".pdf,.jpg,.jpeg,.png" className="w-full text-sm" />
                  <Text variant="tiny" className="text-gray-400 mt-1">Upload a screenshot or receipt of your transfer</Text>
                </div>

                <div>
                  <label className="block text-[10px] font-medium text-gray-500 mb-1">Notes (Optional)</label>
                  <textarea value={bankDetails.notes} onChange={e => setBankDetails({...bankDetails, notes: e.target.value})} rows={2} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]" placeholder="Any additional information..." />
                </div>

                <div className="flex gap-3 pt-2">
                  <Button variant="outline" onClick={() => { setPaymentStep('select'); setError(''); }} className="flex-1">Back</Button>
                  <Button variant="primary" onClick={handleBankTransfer} disabled={paymentLoading || bankAccounts.length === 0} className="flex-1">
                    {paymentLoading && <Loader2 size={14} className="animate-spin" />}
                    Submit Transfer
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Invoice Details Modal */}
      <Modal isOpen={showDetailsModal} onClose={() => setShowDetailsModal(false)} title="Invoice Details" size="md">
        {selectedInvoice && (
          <div className="py-3 space-y-4 max-h-[70vh] overflow-y-auto px-1">
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                <Text variant="tiny" className="text-gray-500">Invoice:</Text>
                <Text variant="small" className="font-medium text-gray-800">{selectedInvoice.invoice_number}</Text>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                <Text variant="tiny" className="text-gray-500">Student:</Text>
                <Text variant="small" className="text-gray-800">{selectedInvoice.student_name}</Text>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                <Text variant="tiny" className="text-gray-500">Status:</Text>
                {getStatusBadge(selectedInvoice.status)}
              </div>
            </div>
            
            <div>
              <Text variant="caption" className="font-semibold text-gray-800 mb-2 block">Fee Breakdown</Text>
              <div className="bg-gray-50 rounded-xl overflow-hidden">
                {selectedInvoice.fee_breakdown?.map((item, idx) => (
                  <div key={idx} className="flex justify-between px-3 py-2 text-sm border-b last:border-b-0">
                    <Text variant="tiny" className="text-gray-600">{item.name}</Text>
                    <Text variant="tiny" className="font-medium">{formatCurrency(item.amount)}</Text>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100 space-y-1">
                <div className="flex justify-between">
                  <Text variant="tiny" className="text-gray-500">Total</Text>
                  <Text variant="small" className="font-semibold">{formatCurrency(selectedInvoice.total_amount)}</Text>
                </div>
                <div className="flex justify-between text-green-600">
                  <Text variant="tiny">Paid</Text>
                  <Text variant="small">{formatCurrency(selectedInvoice.amount_paid)}</Text>
                </div>
                <div className="flex justify-between text-red-600 font-bold">
                  <Text variant="small">Balance Due</Text>
                  <Text variant="small">{formatCurrency(selectedInvoice.balance_due)}</Text>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button variant="outline" onClick={() => setShowDetailsModal(false)} className="flex-1">Close</Button>
              {selectedInvoice.status !== 'paid' && selectedInvoice.balance_due > 0 && (
                <Button variant="primary" onClick={() => { setShowDetailsModal(false); handleMakePayment(selectedInvoice); }} className="flex-1">
                  <CreditCard size={14} /> Make Payment
                </Button>
              )}
              <Button variant="outline" onClick={() => handlePrintInvoice(selectedInvoice)} className="flex-1">
                <Printer size={14} /> Print
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
};

export default StudentPaymentPortal;