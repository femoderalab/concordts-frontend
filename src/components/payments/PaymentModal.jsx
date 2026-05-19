// /**
//  * Payment Modal - Paystack integration
//  */

// import React, { useState, useEffect } from 'react';
// import Modal from '../common/modal';
// import Button from '../common/Button';
// import { CreditCard, Banknote, Upload, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

// const PaymentModal = ({ isOpen, onClose, invoice, onSuccess, onError }) => {
//   const [step, setStep] = useState('select'); // select, paystack, bank, verifying
//   const [paymentMethod, setPaymentMethod] = useState('paystack');
//   const [amount, setAmount] = useState('');
//   const [bankDetails, setBankDetails] = useState({
//     bank_name: '',
//     account_name: '',
//     account_number: '',
//     transaction_date: '',
//     notes: ''
//   });
//   const [paymentEvidence, setPaymentEvidence] = useState(null);
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [paystackLoaded, setPaystackLoaded] = useState(false);
  
//   useEffect(() => {
//     if (invoice) {
//       setAmount(invoice.balance_due?.toString() || '');
//     }
//   }, [invoice]);
  
//   const loadPaystack = async () => {
//     return new Promise((resolve, reject) => {
//       if (window.PaystackPop) {
//         setPaystackLoaded(true);
//         resolve();
//         return;
//       }
//       const script = document.createElement('script');
//       script.src = 'https://js.paystack.co/v1/inline.js';
//       script.onload = () => {
//         setPaystackLoaded(true);
//         resolve();
//       };
//       script.onerror = () => reject(new Error('Failed to load Paystack'));
//       document.body.appendChild(script);
//     });
//   };
  
//   const handlePaystackPayment = async () => {
//     try {
//       setLoading(true);
//       setError('');
      
//       await loadPaystack();
      
//       const { initializePayment } = await import('../../services/paymentService');
//       const result = await initializePayment({
//         invoice_id: invoice.id,
//         payment_method: 'paystack',
//         amount: parseFloat(amount)
//       });
      
//       if (result.success && result.authorization_url) {
//         // Redirect to Paystack
//         window.location.href = result.authorization_url;
//       } else if (result.authorization_url) {
//         window.location.href = result.authorization_url;
//       } else {
//         setError(result.error || 'Payment initialization failed');
//         setStep('select');
//       }
//     } catch (err) {
//       console.error('Paystack error:', err);
//       setError(err.message || 'Failed to initialize payment');
//       setStep('select');
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
      
//       const formData = new FormData();
//       formData.append('invoice_id', invoice.id);
//       formData.append('amount', amount);
//       formData.append('payment_method', 'bank_transfer');
//       formData.append('bank_name', bankDetails.bank_name);
//       formData.append('account_name', bankDetails.account_name);
//       formData.append('account_number', bankDetails.account_number);
//       formData.append('transaction_date', bankDetails.transaction_date || new Date().toISOString().split('T')[0]);
//       formData.append('notes', bankDetails.notes);
//       if (paymentEvidence) {
//         formData.append('payment_evidence', paymentEvidence);
//       }
      
//       const { recordManualPayment } = await import('../../services/paymentService');
//       const result = await recordManualPayment(formData);
      
//       if (result.success) {
//         if (onSuccess) onSuccess(result);
//         onClose();
//       } else {
//         setError(result.error || 'Failed to record payment');
//       }
//     } catch (err) {
//       console.error('Bank transfer error:', err);
//       setError(err.message || 'Failed to record bank transfer');
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   const handleSubmit = () => {
//     if (!amount || parseFloat(amount) <= 0) {
//       setError('Please enter a valid amount');
//       return;
//     }
    
//     if (parseFloat(amount) > invoice.balance_due) {
//       setError(`Amount cannot exceed balance due (₦${invoice.balance_due.toLocaleString()})`);
//       return;
//     }
    
//     if (paymentMethod === 'paystack') {
//       handlePaystackPayment();
//     } else if (paymentMethod === 'bank_transfer') {
//       setStep('bank');
//     }
//   };
  
//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount || 0);
//   };
  
//   if (!invoice) return null;
  
//   return (
//     <Modal isOpen={isOpen} onClose={onClose} title="Make Payment" size="md">
//       <div className="py-4">
//         {/* Invoice Summary */}
//         <div className="bg-gray-50 rounded-xl p-4 mb-4">
//           <div className="flex justify-between text-sm mb-2">
//             <span className="text-gray-600">Invoice #:</span>
//             <span className="font-medium">{invoice.invoice_number}</span>
//           </div>
//           <div className="flex justify-between text-sm mb-2">
//             <span className="text-gray-600">Student:</span>
//             <span className="font-medium">{invoice.student_name}</span>
//           </div>
//           <div className="flex justify-between text-sm mb-2">
//             <span className="text-gray-600">Total Amount:</span>
//             <span className="font-medium">{formatCurrency(invoice.total_amount)}</span>
//           </div>
//           <div className="flex justify-between text-sm">
//             <span className="text-gray-600">Balance Due:</span>
//             <span className="font-bold text-red-600">{formatCurrency(invoice.balance_due)}</span>
//           </div>
//         </div>
        
//         {step === 'select' && (
//           <>
//             {/* Payment Method Selection */}
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
//               <div className="grid grid-cols-2 gap-3">
//                 <button
//                   type="button"
//                   onClick={() => setPaymentMethod('paystack')}
//                   className={`p-4 border-2 rounded-xl text-center transition-all ${
//                     paymentMethod === 'paystack'
//                       ? 'border-secondary-500 bg-secondary-50'
//                       : 'border-gray-200 hover:border-gray-300'
//                   }`}
//                 >
//                   <CreditCard size={24} className={`mx-auto mb-2 ${paymentMethod === 'paystack' ? 'text-secondary-600' : 'text-gray-400'}`} />
//                   <p className={`text-sm font-medium ${paymentMethod === 'paystack' ? 'text-secondary-700' : 'text-gray-600'}`}>
//                     Card / Paystack
//                   </p>
//                   <p className="text-xs text-gray-400 mt-1">Online Payment</p>
//                 </button>
                
//                 <button
//                   type="button"
//                   onClick={() => setPaymentMethod('bank_transfer')}
//                   className={`p-4 border-2 rounded-xl text-center transition-all ${
//                     paymentMethod === 'bank_transfer'
//                       ? 'border-secondary-500 bg-secondary-50'
//                       : 'border-gray-200 hover:border-gray-300'
//                   }`}
//                 >
//                   <Banknote size={24} className={`mx-auto mb-2 ${paymentMethod === 'bank_transfer' ? 'text-secondary-600' : 'text-gray-400'}`} />
//                   <p className={`text-sm font-medium ${paymentMethod === 'bank_transfer' ? 'text-secondary-700' : 'text-gray-600'}`}>
//                     Bank Transfer
//                   </p>
//                   <p className="text-xs text-gray-400 mt-1">Manual Payment</p>
//                 </button>
//               </div>
//             </div>
            
//             {/* Amount */}
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Amount to Pay (₦)
//               </label>
//               <input
//                 type="number"
//                 value={amount}
//                 onChange={(e) => setAmount(e.target.value)}
//                 min="1"
//                 max={invoice.balance_due}
//                 step="1000"
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
//                 placeholder="Enter amount"
//               />
//               <p className="text-xs text-gray-500 mt-1">
//                 You can pay partially or the full amount
//               </p>
//             </div>
            
//             {error && (
//               <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 flex items-center gap-2">
//                 <AlertCircle size={16} />
//                 {error}
//               </div>
//             )}
            
//             <div className="flex gap-3 mt-6">
//               <Button onClick={onClose} variant="outline" className="flex-1">
//                 Cancel
//               </Button>
//               <Button onClick={handleSubmit} loading={loading} className="flex-1 bg-secondary-600 hover:bg-secondary-700">
//                 Proceed to Pay {formatCurrency(parseFloat(amount) || 0)}
//               </Button>
//             </div>
//           </>
//         )}
        
//         {/* Bank Transfer Form */}
//         {step === 'bank' && (
//           <div className="space-y-4">
//             <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
//               <p className="font-medium mb-1">School Bank Account Details:</p>
//               <p>Bank: ConcordTS School</p>
//               <p>Account Name: CONCORD TUTOR SCHOOL</p>
//               <p>Account Number: 1234567890</p>
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name</label>
//               <input
//                 type="text"
//                 value={bankDetails.bank_name}
//                 onChange={(e) => setBankDetails(prev => ({ ...prev, bank_name: e.target.value }))}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
//                 placeholder="e.g., GTBank"
//               />
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Account Name</label>
//               <input
//                 type="text"
//                 value={bankDetails.account_name}
//                 onChange={(e) => setBankDetails(prev => ({ ...prev, account_name: e.target.value }))}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
//                 placeholder="Full name on account"
//               />
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
//               <input
//                 type="text"
//                 value={bankDetails.account_number}
//                 onChange={(e) => setBankDetails(prev => ({ ...prev, account_number: e.target.value }))}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
//                 placeholder="10-digit account number"
//               />
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Transaction Date</label>
//               <input
//                 type="date"
//                 value={bankDetails.transaction_date}
//                 onChange={(e) => setBankDetails(prev => ({ ...prev, transaction_date: e.target.value }))}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
//               />
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Payment Evidence (Optional)</label>
//               <input
//                 type="file"
//                 onChange={(e) => setPaymentEvidence(e.target.files[0])}
//                 accept=".pdf,.jpg,.jpeg,.png"
//                 className="w-full"
//               />
//               <p className="text-xs text-gray-500 mt-1">Upload bank transfer receipt or screenshot</p>
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
//               <textarea
//                 value={bankDetails.notes}
//                 onChange={(e) => setBankDetails(prev => ({ ...prev, notes: e.target.value }))}
//                 rows="2"
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
//                 placeholder="Any additional information..."
//               />
//             </div>
            
//             {error && (
//               <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 flex items-center gap-2">
//                 <AlertCircle size={16} />
//                 {error}
//               </div>
//             )}
            
//             <div className="flex gap-3 pt-2">
//               <Button onClick={() => setStep('select')} variant="outline" className="flex-1">
//                 Back
//               </Button>
//               <Button onClick={handleBankTransfer} loading={loading} className="flex-1 bg-secondary-600 hover:bg-secondary-700">
//                 Submit Bank Transfer
//               </Button>
//             </div>
//           </div>
//         )}
//       </div>
//     </Modal>
//   );
// };

// export default PaymentModal;

/**
 * Payment Modal - Paystack integration
 * Fully responsive: mobile-first, tablet, desktop
 */

import React, { useState, useEffect } from 'react';
import Modal from '../common/modal';
import { CreditCard, Banknote, Upload, Loader2, AlertCircle, CheckCircle, ArrowLeft, Building2, Calendar, User, Hash } from 'lucide-react';

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

// Button Component
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
      {loading && <Loader2 size={14} className="animate-spin" />}
      {Icon && !loading && <Icon size={size === 'tiny' ? 12 : size === 'small' ? 14 : 16} />}
      {children}
    </button>
  );
};

// Card Component
const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-xl border border-gray-100 ${className}`}>
    {children}
  </div>
);

// Info Row Component
const InfoRow = ({ label, value, highlight = false, monospace = false }) => (
  <div className="flex justify-between items-center py-1.5">
    <Text variant="tiny" className="text-gray-500">{label}</Text>
    <Text variant={highlight ? 'small' : 'tiny'} className={`${highlight ? 'font-bold text-red-500' : 'font-medium text-gray-800'} ${monospace ? 'font-mono' : ''}`}>
      {value}
    </Text>
  </div>
);

// Helper function
const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return '₦0';
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(amount || 0);
};

// ============================================
// MAIN COMPONENT
// ============================================
const PaymentModal = ({ isOpen, onClose, invoice, onSuccess, onError }) => {
  const [step, setStep] = useState('select'); // select, paystack, bank, verifying
  const [paymentMethod, setPaymentMethod] = useState('paystack');
  const [amount, setAmount] = useState('');
  const [bankDetails, setBankDetails] = useState({
    bank_name: '',
    account_name: '',
    account_number: '',
    transaction_date: '',
    notes: ''
  });
  const [paymentEvidence, setPaymentEvidence] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [paystackLoaded, setPaystackLoaded] = useState(false);
  
  useEffect(() => {
    if (invoice) {
      setAmount(invoice.balance_due?.toString() || '');
    }
  }, [invoice]);
  
  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setStep('select');
      setPaymentMethod('paystack');
      setError('');
      setBankDetails({
        bank_name: '',
        account_name: '',
        account_number: '',
        transaction_date: '',
        notes: ''
      });
      setPaymentEvidence(null);
    }
  }, [isOpen]);
  
  const loadPaystack = async () => {
    return new Promise((resolve, reject) => {
      if (window.PaystackPop) {
        setPaystackLoaded(true);
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://js.paystack.co/v1/inline.js';
      script.onload = () => {
        setPaystackLoaded(true);
        resolve();
      };
      script.onerror = () => reject(new Error('Failed to load Paystack'));
      document.body.appendChild(script);
    });
  };
  
  const handlePaystackPayment = async () => {
    const amountNum = parseFloat(amount);
    if (!amount || amountNum <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    if (amountNum > invoice.balance_due) {
      setError(`Amount cannot exceed balance due (${formatCurrency(invoice.balance_due)})`);
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      await loadPaystack();
      
      const { initializePayment } = await import('../../services/paymentService');
      const result = await initializePayment({
        invoice_id: invoice.id,
        payment_method: 'paystack',
        amount: amountNum
      });
      
      if (result.success && result.authorization_url) {
        window.location.href = result.authorization_url;
      } else if (result.authorization_url) {
        window.location.href = result.authorization_url;
      } else {
        setError(result.error || 'Payment initialization failed');
        setStep('select');
      }
    } catch (err) {
      console.error('Paystack error:', err);
      setError(err.message || 'Failed to initialize payment');
      setStep('select');
    } finally {
      setLoading(false);
    }
  };
  
  const handleBankTransfer = async () => {
    if (!bankDetails.bank_name || !bankDetails.account_name || !bankDetails.account_number) {
      setError('Please fill in all bank transfer details');
      return;
    }
    
    const amountNum = parseFloat(amount);
    if (!amount || amountNum <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    if (amountNum > invoice.balance_due) {
      setError(`Amount cannot exceed balance due (${formatCurrency(invoice.balance_due)})`);
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const formData = new FormData();
      formData.append('invoice_id', invoice.id);
      formData.append('amount', amount);
      formData.append('payment_method', 'bank_transfer');
      formData.append('bank_name', bankDetails.bank_name);
      formData.append('account_name', bankDetails.account_name);
      formData.append('account_number', bankDetails.account_number);
      formData.append('transaction_date', bankDetails.transaction_date || new Date().toISOString().split('T')[0]);
      formData.append('notes', bankDetails.notes);
      if (paymentEvidence) {
        formData.append('payment_evidence', paymentEvidence);
      }
      
      const { recordManualPayment } = await import('../../services/paymentService');
      const result = await recordManualPayment(formData);
      
      if (result.success) {
        if (onSuccess) onSuccess(result);
        onClose();
      } else {
        setError(result.error || 'Failed to record payment');
      }
    } catch (err) {
      console.error('Bank transfer error:', err);
      setError(err.message || 'Failed to record bank transfer');
    } finally {
      setLoading(false);
    }
  };
  
  const handleProceed = () => {
    const amountNum = parseFloat(amount);
    if (!amount || amountNum <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    if (amountNum > invoice.balance_due) {
      setError(`Amount cannot exceed balance due (${formatCurrency(invoice.balance_due)})`);
      return;
    }
    
    if (paymentMethod === 'paystack') {
      handlePaystackPayment();
    } else if (paymentMethod === 'bank_transfer') {
      setStep('bank');
    }
  };
  
  if (!invoice) return null;
  
  const amountNum = parseFloat(amount) || 0;
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Make Payment" size="md">
      <div className="py-3 max-h-[70vh] overflow-y-auto px-1">
        
        {/* Invoice Summary Card */}
        <Card className="p-4 mb-4 bg-gray-50 border-gray-100">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200">
            <div className="w-5 h-5 bg-[#D94801]/10 rounded-lg flex items-center justify-center">
              <CreditCard size={10} className="text-[#D94801]" />
            </div>
            <Text variant="tiny" className="font-semibold text-gray-700">Invoice Summary</Text>
          </div>
          <div className="space-y-1">
            <InfoRow label="Invoice #" value={invoice.invoice_number} monospace />
            <InfoRow label="Student" value={invoice.student_name} />
            <InfoRow label="Total Amount" value={formatCurrency(invoice.total_amount)} />
            <InfoRow label="Balance Due" value={formatCurrency(invoice.balance_due)} highlight />
          </div>
        </Card>
        
        {step === 'select' && (
          <>
            {/* Payment Method Selection */}
            <div className="mb-4">
              <Text variant="caption" className="font-medium text-gray-700 mb-2 block">Select Payment Method</Text>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('paystack')}
                  className={`p-3 sm:p-4 border-2 rounded-xl text-center transition-all ${
                    paymentMethod === 'paystack'
                      ? 'border-[#D94801] bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <CreditCard 
                    size={24} 
                    className={`mx-auto mb-2 ${paymentMethod === 'paystack' ? 'text-[#D94801]' : 'text-gray-400'}`} 
                  />
                  <Text variant="tiny" className={`font-medium ${paymentMethod === 'paystack' ? 'text-[#D94801]' : 'text-gray-600'}`}>
                    Card / Paystack
                  </Text>
                  <Text variant="tiny" className="text-gray-400 mt-1">Online Payment</Text>
                </button>
                
                <button
                  type="button"
                  onClick={() => setPaymentMethod('bank_transfer')}
                  className={`p-3 sm:p-4 border-2 rounded-xl text-center transition-all ${
                    paymentMethod === 'bank_transfer'
                      ? 'border-[#D94801] bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Banknote 
                    size={24} 
                    className={`mx-auto mb-2 ${paymentMethod === 'bank_transfer' ? 'text-[#D94801]' : 'text-gray-400'}`} 
                  />
                  <Text variant="tiny" className={`font-medium ${paymentMethod === 'bank_transfer' ? 'text-[#D94801]' : 'text-gray-600'}`}>
                    Bank Transfer
                  </Text>
                  <Text variant="tiny" className="text-gray-400 mt-1">Manual Payment</Text>
                </button>
              </div>
            </div>
            
            {/* Amount Input */}
            <div className="mb-4">
              <label className="block text-[10px] font-medium text-gray-500 mb-1">
                Amount to Pay (₦)
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  ₦
                </div>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="1"
                  max={invoice.balance_due}
                  step="1000"
                  className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
                  placeholder="Enter amount"
                />
              </div>
              <Text variant="tiny" className="text-gray-400 mt-1">
                You can pay partially or the full amount
              </Text>
            </div>
            
            {/* Error Alert */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-center gap-2">
                <AlertCircle size={14} />
                {error}
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button variant="outline" onClick={onClose} className="flex-1 order-2 sm:order-1">
                Cancel
              </Button>
              <Button 
                variant="primary" 
                onClick={handleProceed} 
                loading={loading} 
                className="flex-1 order-1 sm:order-2"
              >
                Proceed to Pay {amountNum > 0 && formatCurrency(amountNum)}
              </Button>
            </div>
          </>
        )}
        
        {/* Bank Transfer Form */}
        {step === 'bank' && (
          <div className="space-y-4">
            {/* School Bank Details */}
            <Card className="p-4 bg-blue-50 border-blue-200">
              <div className="flex items-center gap-2 mb-3">
                <Building2 size={14} className="text-blue-600" />
                <Text variant="tiny" className="font-semibold text-blue-800">School Bank Account Details</Text>
              </div>
              <div className="space-y-1.5">
                <InfoRow label="Bank Name" value="ConcordTS School" />
                <InfoRow label="Account Name" value="CONCORD TUTOR SCHOOL" />
                <InfoRow label="Account Number" value="1234567890" monospace />
              </div>
            </Card>
            
            {/* Your Bank Details */}
            <div>
              <Text variant="caption" className="font-medium text-gray-700 mb-2 block">Your Bank Details</Text>
              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-medium text-gray-500 mb-1">Bank Name</label>
                  <input
                    type="text"
                    value={bankDetails.bank_name}
                    onChange={(e) => setBankDetails(prev => ({ ...prev, bank_name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
                    placeholder="e.g., GTBank"
                  />
                </div>
                
                <div>
                  <label className="block text-[10px] font-medium text-gray-500 mb-1">Account Name</label>
                  <input
                    type="text"
                    value={bankDetails.account_name}
                    onChange={(e) => setBankDetails(prev => ({ ...prev, account_name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
                    placeholder="Full name on account"
                  />
                </div>
                
                <div>
                  <label className="block text-[10px] font-medium text-gray-500 mb-1">Account Number</label>
                  <input
                    type="text"
                    value={bankDetails.account_number}
                    onChange={(e) => setBankDetails(prev => ({ ...prev, account_number: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801] font-mono"
                    placeholder="10-digit account number"
                    maxLength={10}
                  />
                </div>
                
                <div>
                  <label className="block text-[10px] font-medium text-gray-500 mb-1">Transaction Date</label>
                  <div className="relative">
                    <Calendar size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="date"
                      value={bankDetails.transaction_date}
                      onChange={(e) => setBankDetails(prev => ({ ...prev, transaction_date: e.target.value }))}
                      className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-[10px] font-medium text-gray-500 mb-1">Payment Evidence (Optional)</label>
                  <div className="flex items-center gap-2">
                    <label className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-center gap-2 px-3 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                        <Upload size={14} />
                        {paymentEvidence ? paymentEvidence.name : 'Upload Receipt'}
                      </div>
                      <input
                        type="file"
                        onChange={(e) => setPaymentEvidence(e.target.files[0])}
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                      />
                    </label>
                  </div>
                  <Text variant="tiny" className="text-gray-400 mt-1">Upload bank transfer receipt or screenshot (PDF, JPG, PNG)</Text>
                </div>
                
                <div>
                  <label className="block text-[10px] font-medium text-gray-500 mb-1">Notes (Optional)</label>
                  <textarea
                    value={bankDetails.notes}
                    onChange={(e) => setBankDetails(prev => ({ ...prev, notes: e.target.value }))}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801] resize-none"
                    placeholder="Any additional information..."
                  />
                </div>
              </div>
            </div>
            
            {/* Amount Summary */}
            <Card className="p-3 bg-gray-50">
              <div className="flex justify-between items-center">
                <Text variant="tiny" className="text-gray-500">Amount to Pay</Text>
                <Text variant="h4" className="font-bold text-[#D94801]">{formatCurrency(amountNum)}</Text>
              </div>
            </Card>
            
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-center gap-2">
                <AlertCircle size={14} />
                {error}
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button 
                variant="outline" 
                onClick={() => setStep('select')} 
                icon={ArrowLeft}
                className="flex-1 order-2 sm:order-1"
              >
                Back
              </Button>
              <Button 
                variant="primary" 
                onClick={handleBankTransfer} 
                loading={loading} 
                className="flex-1 order-1 sm:order-2"
              >
                Submit Bank Transfer
              </Button>
            </div>
            
            {/* Info Note */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-2 text-center">
              <Text variant="tiny" className="text-yellow-700">
                Your payment will be verified by the admin. You will receive a confirmation email once approved.
              </Text>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default PaymentModal;