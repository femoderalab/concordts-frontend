// /**
//  * Parent Bulk Payment Component
//  * Parents can pay for multiple children at once
//  */

// import React, { useState, useEffect } from 'react';
// import Button from '../common/Button';
// import Modal from '../common/modal';
// import { CreditCard, Banknote, CheckCircle, AlertCircle, Loader2, Users, DollarSign } from 'lucide-react';

// const ParentBulkPayment = ({ childrenList, invoices, onPaymentComplete }) => {
//   const [selectedChildren, setSelectedChildren] = useState([]);
//   const [totalAmount, setTotalAmount] = useState(0);
//   const [showPaymentModal, setShowPaymentModal] = useState(false);
//   const [paymentMethod, setPaymentMethod] = useState('paystack');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
  
//   useEffect(() => {
//     calculateTotal();
//   }, [selectedChildren, invoices]);
  
//   const toggleChild = (childId) => {
//     setSelectedChildren(prev => 
//       prev.includes(childId) ? prev.filter(id => id !== childId) : [...prev, childId]
//     );
//   };
  
//   const toggleAll = () => {
//     if (selectedChildren.length === childrenList.length) {
//       setSelectedChildren([]);
//     } else {
//       setSelectedChildren(childrenList.map(c => c.id));
//     }
//   };
  
//   const calculateTotal = () => {
//     let total = 0;
//     selectedChildren.forEach(childId => {
//       const childInvoices = invoices.filter(inv => inv.student_id === childId && inv.status !== 'paid');
//       total += childInvoices.reduce((sum, inv) => sum + (inv.balance_due || 0), 0);
//     });
//     setTotalAmount(total);
//   };
  
//   const handleBulkPay = async () => {
//     if (selectedChildren.length === 0) {
//       setError('Please select at least one child');
//       return;
//     }
//     if (totalAmount <= 0) {
//       setError('No outstanding balance for selected children');
//       return;
//     }
//     setShowPaymentModal(true);
//   };
  
//   const handlePaystackPayment = async () => {
//     try {
//       setLoading(true);
//       setError('');
//       const { initializePayment } = await import('../../services/paymentService');
      
//       // Create a bulk payment invoice or pay each separately
//       const result = await initializePayment({
//         bulk: true,
//         student_ids: selectedChildren,
//         amount: totalAmount,
//         payment_method: 'paystack'
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
  
//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount || 0);
//   };
  
//   return (
//     <>
//       {/* Bulk Payment Section */}
//       {childrenList.length > 0 && (
//         <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
//           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
//             <div>
//               <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
//                 <Users size={16} /> Bulk Payment for Multiple Children
//               </h3>
//               <p className="text-xs text-gray-500 mt-1">Select children to pay all their outstanding fees at once</p>
//             </div>
//             <Button onClick={handleBulkPay} disabled={selectedChildren.length === 0 || totalAmount === 0} className="bg-secondary-600 hover:bg-secondary-700 text-white">
//               <DollarSign size={16} className="mr-2" />
//               Pay Selected ({formatCurrency(totalAmount)})
//             </Button>
//           </div>
          
//           <div className="border-t pt-4">
//             <div className="flex items-center gap-2 mb-3">
//               <input type="checkbox" onChange={toggleAll} checked={selectedChildren.length === childrenList.length && childrenList.length > 0} className="w-4 h-4 text-secondary-600 rounded" />
//               <span className="text-sm font-medium">Select All</span>
//             </div>
//             <div className="space-y-2">
//               {childrenList.map(child => {
//                 const childInvoices = invoices.filter(inv => inv.student_id === child.id && inv.status !== 'paid');
//                 const childTotal = childInvoices.reduce((sum, inv) => sum + (inv.balance_due || 0), 0);
//                 const isSelected = selectedChildren.includes(child.id);
//                 return (
//                   <div key={child.id} className={`flex items-center justify-between p-3 rounded-lg border ${isSelected ? 'border-secondary-300 bg-secondary-50' : 'border-gray-200'}`}>
//                     <div className="flex items-center gap-3">
//                       <input type="checkbox" checked={isSelected} onChange={() => toggleChild(child.id)} className="w-4 h-4 text-secondary-600 rounded" />
//                       <div>
//                         <p className="text-sm font-medium text-gray-800">{child.full_name}</p>
//                         <p className="text-xs text-gray-500">{child.class_level} • {child.admission_number}</p>
//                       </div>
//                     </div>
//                     <div className="text-right">
//                       <p className="text-sm font-semibold text-red-600">{formatCurrency(childTotal)}</p>
//                       <p className="text-xs text-gray-500">Outstanding</p>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         </div>
//       )}
      
//       {/* Payment Modal */}
//       <Modal isOpen={showPaymentModal} onClose={() => setShowPaymentModal(false)} title="Bulk Payment" size="md">
//         <div className="py-4">
//           <div className="bg-gray-50 rounded-xl p-4 mb-4">
//             <div className="flex justify-between text-sm mb-2">
//               <span className="text-gray-600">Selected Children:</span>
//               <span className="font-medium">{selectedChildren.length}</span>
//             </div>
//             <div className="flex justify-between text-sm">
//               <span className="text-gray-600">Total Amount:</span>
//               <span className="font-bold text-red-600">{formatCurrency(totalAmount)}</span>
//             </div>
//           </div>
          
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
//             <div className="grid grid-cols-2 gap-3">
//               <button type="button" onClick={() => setPaymentMethod('paystack')} className={`p-4 border-2 rounded-xl text-center transition-all ${paymentMethod === 'paystack' ? 'border-secondary-500 bg-secondary-50' : 'border-gray-200 hover:border-gray-300'}`}>
//                 <CreditCard size={24} className={`mx-auto mb-2 ${paymentMethod === 'paystack' ? 'text-secondary-600' : 'text-gray-400'}`} />
//                 <p className={`text-sm font-medium ${paymentMethod === 'paystack' ? 'text-secondary-700' : 'text-gray-600'}`}>Card / Paystack</p>
//               </button>
//               <button type="button" onClick={() => setPaymentMethod('bank_transfer')} className={`p-4 border-2 rounded-xl text-center transition-all ${paymentMethod === 'bank_transfer' ? 'border-secondary-500 bg-secondary-50' : 'border-gray-200 hover:border-gray-300'}`}>
//                 <Banknote size={24} className={`mx-auto mb-2 ${paymentMethod === 'bank_transfer' ? 'text-secondary-600' : 'text-gray-400'}`} />
//                 <p className={`text-sm font-medium ${paymentMethod === 'bank_transfer' ? 'text-secondary-700' : 'text-gray-600'}`}>Bank Transfer</p>
//               </button>
//             </div>
//           </div>
          
//           {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 flex items-center gap-2"><AlertCircle size={16} />{error}</div>}
          
//           <div className="flex gap-3 mt-6">
//             <button onClick={() => setShowPaymentModal(false)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Cancel</button>
//             <button onClick={handlePaystackPayment} disabled={loading} className="flex-1 px-4 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 disabled:opacity-50 flex items-center justify-center gap-2">
//               {loading && <Loader2 size={16} className="animate-spin" />}
//               Pay {formatCurrency(totalAmount)}
//             </button>
//           </div>
//         </div>
//       </Modal>
//     </>
//   );
// };

// export default ParentBulkPayment;


/**
 * Parent Bulk Payment Component
 * Parents can pay for multiple children at once
 * Fully responsive: mobile-first, tablet, desktop
 */

import React, { useState, useEffect } from 'react';
import Button from '../common/Button';
import Modal from '../common/modal';
import { CreditCard, Banknote, CheckCircle, AlertCircle, Loader2, Users, DollarSign, X, ChevronRight } from 'lucide-react';

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

// Card Component
const Card = ({ children, className = '', hover = false }) => (
  <div className={`bg-white rounded-2xl shadow-sm ${hover ? 'transition-shadow duration-200 hover:shadow-md' : ''} ${className}`}>
    {children}
  </div>
);

// ============================================
// MAIN COMPONENT
// ============================================
const ParentBulkPayment = ({ childrenList, invoices, onPaymentComplete }) => {
  const [selectedChildren, setSelectedChildren] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('paystack');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    calculateTotal();
  }, [selectedChildren, invoices]);
  
  const toggleChild = (childId) => {
    setSelectedChildren(prev => 
      prev.includes(childId) ? prev.filter(id => id !== childId) : [...prev, childId]
    );
  };
  
  const toggleAll = () => {
    if (selectedChildren.length === childrenList.length && childrenList.length > 0) {
      setSelectedChildren([]);
    } else {
      setSelectedChildren(childrenList.map(c => c.id));
    }
  };
  
  const calculateTotal = () => {
    let total = 0;
    selectedChildren.forEach(childId => {
      const childInvoices = invoices.filter(inv => inv.student_id === childId && inv.status !== 'paid');
      total += childInvoices.reduce((sum, inv) => sum + (inv.balance_due || 0), 0);
    });
    setTotalAmount(total);
  };
  
  const handleBulkPay = () => {
    if (selectedChildren.length === 0) {
      setError('Please select at least one child');
      return;
    }
    if (totalAmount <= 0) {
      setError('No outstanding balance for selected children');
      return;
    }
    setError('');
    setShowPaymentModal(true);
  };
  
  const handlePaystackPayment = async () => {
    try {
      setLoading(true);
      setError('');
      const { initializePayment } = await import('../../services/paymentService');
      
      const result = await initializePayment({
        bulk: true,
        student_ids: selectedChildren,
        amount: totalAmount,
        payment_method: 'paystack'
      });
      
      if (result.authorization_url) {
        window.location.href = result.authorization_url;
      } else {
        setError(result.error || 'Payment initialization failed');
      }
    } catch (err) {
      setError(err.message || 'Failed to initialize payment');
    } finally {
      setLoading(false);
    }
  };
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(amount || 0);
  };
  
  const isAllSelected = selectedChildren.length === childrenList.length && childrenList.length > 0;
  const hasSelections = selectedChildren.length > 0 && totalAmount > 0;
  
  if (childrenList.length === 0) {
    return null;
  }
  
  return (
    <>
      {/* Bulk Payment Section */}
      <Card className="p-4 sm:p-5 mb-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 bg-[#D94801]/10 rounded-lg flex items-center justify-center">
                <Users size={12} className="text-[#D94801]" />
              </div>
              <Text variant="small" className="font-semibold text-gray-800">
                Bulk Payment for Multiple Children
              </Text>
            </div>
            <Text variant="tiny" className="text-gray-400 ml-8">
              Select children to pay all their outstanding fees at once
            </Text>
          </div>
          <Button
            variant={hasSelections ? "primary" : "outline"}
            size="small"
            icon={DollarSign}
            onClick={handleBulkPay}
            disabled={!hasSelections}
            className="sm:self-center"
          >
            Pay Selected ({formatCurrency(totalAmount)})
          </Button>
        </div>
        
        {/* Divider */}
        <div className="border-t border-gray-100 pt-4">
          {/* Select All Row */}
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-50">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                onChange={toggleAll}
                checked={isAllSelected}
                className="w-3.5 h-3.5 text-[#D94801] rounded border-gray-300 focus:ring-[#D94801]"
              />
              <Text variant="tiny" className="font-medium text-gray-600">Select All</Text>
            </label>
            <Text variant="tiny" className="text-gray-400 ml-auto">
              {selectedChildren.length} of {childrenList.length} selected
            </Text>
          </div>
          
          {/* Children List */}
          <div className="space-y-2">
            {childrenList.map(child => {
              const childInvoices = invoices.filter(inv => inv.student_id === child.id && inv.status !== 'paid');
              const childTotal = childInvoices.reduce((sum, inv) => sum + (inv.balance_due || 0), 0);
              const isSelected = selectedChildren.includes(child.id);
              const hasOutstanding = childTotal > 0;
              
              return (
                <label
                  key={child.id}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all duration-200 ${
                    isSelected 
                      ? 'border-[#D94801] bg-orange-50' 
                      : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                  } ${!hasOutstanding ? 'opacity-60' : ''}`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleChild(child.id)}
                      disabled={!hasOutstanding}
                      className="w-3.5 h-3.5 text-[#D94801] rounded border-gray-300 focus:ring-[#D94801] disabled:opacity-50"
                    />
                    <div className="flex-1 min-w-0">
                      <Text variant="small" className="font-medium text-gray-800 truncate">
                        {child.full_name}
                      </Text>
                      <div className="flex flex-wrap items-center gap-2 mt-0.5">
                        <Text variant="tiny" className="text-gray-400">
                          {child.class_level}
                        </Text>
                        <span className="w-1 h-1 rounded-full bg-gray-300" />
                        <Text variant="tiny" className="text-gray-400">
                          {child.admission_number}
                        </Text>
                      </div>
                    </div>
                  </div>
                  <div className="text-right ml-3">
                    {hasOutstanding ? (
                      <>
                        <Text variant="small" className="font-bold text-red-500">
                          {formatCurrency(childTotal)}
                        </Text>
                        <Text variant="tiny" className="text-gray-400">
                          Outstanding
                        </Text>
                      </>
                    ) : (
                      <div className="flex items-center gap-1">
                        <CheckCircle size={12} className="text-green-500" />
                        <Text variant="tiny" className="text-green-600">Fully Paid</Text>
                      </div>
                    )}
                  </div>
                </label>
              );
            })}
          </div>
        </div>
        
        {/* Summary Footer (only when items selected) */}
        {selectedChildren.length > 0 && (
          <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
            <div>
              <Text variant="tiny" className="text-gray-400">Selected Children</Text>
              <Text variant="small" className="font-semibold text-gray-800">{selectedChildren.length} child{selectedChildren.length !== 1 ? 'ren' : ''}</Text>
            </div>
            <div className="text-right">
              <Text variant="tiny" className="text-gray-400">Total Amount</Text>
              <Text variant="h4" className="font-bold text-[#D94801]">{formatCurrency(totalAmount)}</Text>
            </div>
          </div>
        )}
      </Card>
      
      {/* Payment Modal */}
      <Modal isOpen={showPaymentModal} onClose={() => { setShowPaymentModal(false); setError(''); }} title="Bulk Payment" size="md">
        <div className="py-3 space-y-4 max-h-[70vh] overflow-y-auto px-1">
          {/* Summary Card */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-2">
            <div className="flex justify-between items-center">
              <Text variant="tiny" className="text-gray-500">Selected Children:</Text>
              <Text variant="small" className="font-medium text-gray-800">{selectedChildren.length}</Text>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-gray-200">
              <Text variant="tiny" className="text-gray-500">Total Amount:</Text>
              <Text variant="h4" className="font-bold text-red-500">{formatCurrency(totalAmount)}</Text>
            </div>
          </div>
          
          {/* Payment Method Selection */}
          <div>
            <Text variant="caption" className="font-medium text-gray-700 mb-2 block">Payment Method</Text>
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
                  className={`mx-auto mb-2 ${
                    paymentMethod === 'paystack' ? 'text-[#D94801]' : 'text-gray-400'
                  }`} 
                />
                <Text variant="tiny" className={`font-medium ${
                  paymentMethod === 'paystack' ? 'text-[#D94801]' : 'text-gray-600'
                }`}>
                  Card / Paystack
                </Text>
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
                  className={`mx-auto mb-2 ${
                    paymentMethod === 'bank_transfer' ? 'text-[#D94801]' : 'text-gray-400'
                  }`} 
                />
                <Text variant="tiny" className={`font-medium ${
                  paymentMethod === 'bank_transfer' ? 'text-[#D94801]' : 'text-gray-600'
                }`}>
                  Bank Transfer
                </Text>
              </button>
            </div>
          </div>
          
          {/* Selected Children List (compact) */}
          <div className="bg-gray-50 rounded-xl p-3">
            <Text variant="tiny" className="font-medium text-gray-600 mb-2">Selected Children</Text>
            <div className="space-y-1.5">
              {selectedChildren.map(childId => {
                const child = childrenList.find(c => c.id === childId);
                if (!child) return null;
                return (
                  <div key={childId} className="flex justify-between items-center text-xs">
                    <Text variant="tiny" className="text-gray-600">{child.full_name}</Text>
                    <Text variant="tiny" className="font-medium text-gray-800">{child.class_level}</Text>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Error Alert */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-center gap-2">
              <AlertCircle size={14} />
              {error}
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => { setShowPaymentModal(false); setError(''); }}
              className="flex-1 order-2 sm:order-1"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handlePaystackPayment}
              disabled={loading}
              className="flex-1 order-1 sm:order-2"
            >
              {loading && <Loader2 size={14} className="animate-spin" />}
              Pay {formatCurrency(totalAmount)}
            </Button>
          </div>
          
          {/* Info Note */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-2 text-center">
            <Text variant="tiny" className="text-blue-700">
              You will be redirected to Paystack to complete your payment securely.
            </Text>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ParentBulkPayment;