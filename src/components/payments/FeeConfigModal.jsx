// /**
//  * Fee Configuration Modal - Admin only
//  * Configure fees per class level per term
//  */

// import React, { useState, useEffect } from 'react';
// import Modal from '../common/modal';
// import Button from '../common/Button';
// import Input from '../common/Input';
// import Select from '../common/Select';
// import { X, Plus, Trash2, DollarSign, AlertCircle } from 'lucide-react';

// const FeeConfigModal = ({ isOpen, onClose, onSubmit, initialData, sessions, terms, classLevels, loading }) => {
//   const [formData, setFormData] = useState({
//     session: '',
//     term: '',
//     class_level: '',
//     tuition_fee: 0,
//     registration_fee: 0,
//     exam_fee: 0,
//     sports_fee: 0,
//     library_fee: 0,
//     ict_fee: 0,
//     development_fee: 0,
//     pta_fee: 0,
//     insurance_fee: 0,
//     custom_fees: {},
//     early_payment_discount: 0,
//     sibling_discount: 0,
//     description: '',
//     is_active: true
//   });
  
//   const [customFeeItems, setCustomFeeItems] = useState([]);
//   const [newCustomFeeName, setNewCustomFeeName] = useState('');
//   const [newCustomFeeAmount, setNewCustomFeeAmount] = useState('');
//   const [error, setError] = useState('');
  
// // In FeeConfigModal.jsx - Replace the existing useEffect

//     useEffect(() => {
//     if (initialData) {
//         console.log('Initial data for edit:', initialData);
        
//         // Safely extract values with proper number conversion
//         setFormData({
//         session: initialData.session?.id || initialData.session || '',
//         term: initialData.term?.id || initialData.term || '',
//         class_level: initialData.class_level?.id || initialData.class_level || '',
//         tuition_fee: parseFloat(initialData.tuition_fee) || 0,
//         registration_fee: parseFloat(initialData.registration_fee) || 0,
//         exam_fee: parseFloat(initialData.exam_fee) || 0,
//         sports_fee: parseFloat(initialData.sports_fee) || 0,
//         library_fee: parseFloat(initialData.library_fee) || 0,
//         ict_fee: parseFloat(initialData.ict_fee) || 0,
//         development_fee: parseFloat(initialData.development_fee) || 0,
//         pta_fee: parseFloat(initialData.pta_fee) || 0,
//         insurance_fee: parseFloat(initialData.insurance_fee) || 0,
//         custom_fees: initialData.custom_fees || {},
//         early_payment_discount: parseFloat(initialData.early_payment_discount) || 0,
//         sibling_discount: parseFloat(initialData.sibling_discount) || 0,
//         description: initialData.description || '',
//         is_active: initialData.is_active !== undefined ? initialData.is_active : true
//         });
        
//         // Convert custom fees to array for editing
//         if (initialData.custom_fees) {
//         let customFees = initialData.custom_fees;
//         if (typeof customFees === 'string') {
//             try {
//             customFees = JSON.parse(customFees);
//             } catch (e) {
//             customFees = {};
//             }
//         }
//         const items = Object.entries(customFees).map(([name, amount]) => ({
//             name,
//             amount: parseFloat(amount) || 0
//         }));
//         setCustomFeeItems(items);
//         } else {
//         setCustomFeeItems([]);
//         }
//     } else {
//         resetForm();
//     }
//     }, [initialData, isOpen]);
  
//   const resetForm = () => {
//     setFormData({
//       session: '',
//       term: '',
//       class_level: '',
//       tuition_fee: 0,
//       registration_fee: 0,
//       exam_fee: 0,
//       sports_fee: 0,
//       library_fee: 0,
//       ict_fee: 0,
//       development_fee: 0,
//       pta_fee: 0,
//       insurance_fee: 0,
//       custom_fees: {},
//       early_payment_discount: 0,
//       sibling_discount: 0,
//       description: '',
//       is_active: true
//     });
//     setCustomFeeItems([]);
//     setNewCustomFeeName('');
//     setNewCustomFeeAmount('');
//     setError('');
//   };
  
//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));
//   };
  
//     const handleNumberChange = (e) => {
//     const { name, value } = e.target;
//     // Convert to number, default to 0 if empty
//     const numValue = value === '' ? 0 : parseFloat(value);
//     setFormData(prev => ({
//         ...prev,
//         [name]: isNaN(numValue) ? 0 : numValue
//     }));
//     };
  
//     const addCustomFee = () => {
//     if (!newCustomFeeName.trim()) {
//         setError('Please enter a fee name');
//         return;
//     }
//     const amount = parseFloat(newCustomFeeAmount);
//     if (isNaN(amount) || amount <= 0) {
//         setError('Please enter a valid amount');
//         return;
//     }
    
//     setCustomFeeItems(prev => [...prev, {
//         name: newCustomFeeName.trim(),
//         amount: amount
//     }]);
//     setNewCustomFeeName('');
//     setNewCustomFeeAmount('');
//     setError('');
//     };
    
//     const removeCustomFee = (index) => {
//     setCustomFeeItems(prev => prev.filter((_, i) => i !== index));
//     };
  
//     const calculateTotal = () => {
//     // Parse all values as numbers
//     const tuition = parseFloat(formData.tuition_fee) || 0;
//     const registration = parseFloat(formData.registration_fee) || 0;
//     const exam = parseFloat(formData.exam_fee) || 0;
//     const sports = parseFloat(formData.sports_fee) || 0;
//     const library = parseFloat(formData.library_fee) || 0;
//     const ict = parseFloat(formData.ict_fee) || 0;
//     const development = parseFloat(formData.development_fee) || 0;
//     const pta = parseFloat(formData.pta_fee) || 0;
//     const insurance = parseFloat(formData.insurance_fee) || 0;
    
//     const baseTotal = tuition + registration + exam + sports + library + ict + development + pta + insurance;
    
//     const customTotal = customFeeItems.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    
//     const total = baseTotal + customTotal;
    
//     console.log('Calculating total:', { tuition, registration, exam, sports, library, ict, development, pta, insurance, customTotal, total });
    
//     return total;
//     };
  
//     const handleSubmit = (e) => {
//     e.preventDefault();
    
//     if (!formData.session) {
//         setError('Please select an academic session');
//         return;
//     }
//     if (!formData.term) {
//         setError('Please select an academic term');
//         return;
//     }
//     if (!formData.class_level) {
//         setError('Please select a class level');
//         return;
//     }
    
//     // Convert all fee fields to numbers
//     const submitData = {
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
//     };
    
//     // Convert custom fees to object
//     const customFees = {};
//     customFeeItems.forEach(item => {
//         const key = item.name.toLowerCase().replace(/\s+/g, '_');
//         customFees[key] = parseFloat(item.amount) || 0;
//     });
//     submitData.custom_fees = customFees;
    
//     onSubmit(submitData);
//     };
  
//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount || 0);
//   };
  
//   return (
//     <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Edit Fee Structure' : 'Configure School Fees'} size="lg">
//       <form onSubmit={handleSubmit} className="py-4 max-h-[70vh] overflow-y-auto">
//         {error && (
//           <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 flex items-center gap-2">
//             <AlertCircle size={16} />
//             {error}
//           </div>
//         )}
        
//         <div className="space-y-6">
//           {/* Basic Information */}
//           <div>
//             <h4 className="text-sm font-semibold text-gray-800 mb-3 pb-2 border-b">Basic Information</h4>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <Select
//                 label="Academic Session *"
//                 name="session"
//                 value={formData.session}
//                 onChange={handleChange}
//                 options={[
//                   { value: '', label: 'Select Session' },
//                   ...sessions.map(s => ({ value: s.id, label: s.name }))
//                 ]}
//                 required
//               />
//               <Select
//                 label="Academic Term *"
//                 name="term"
//                 value={formData.term}
//                 onChange={handleChange}
//                 options={[
//                   { value: '', label: 'Select Term' },
//                   ...terms.map(t => ({ value: t.id, label: t.name }))
//                 ]}
//                 required
//               />
//               <Select
//                 label="Class Level *"
//                 name="class_level"
//                 value={formData.class_level}
//                 onChange={handleChange}
//                 options={[
//                   { value: '', label: 'Select Class Level' },
//                   ...classLevels.map(cl => ({ value: cl.id, label: cl.name }))
//                 ]}
//                 required
//               />
//             </div>
//           </div>
          
//           {/* Basic Fees */}
//           <div>
//             <h4 className="text-sm font-semibold text-gray-800 mb-3 pb-2 border-b">Basic Fees</h4>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               <Input
//                 type="number"
//                 label="Tuition Fee (₦)"
//                 name="tuition_fee"
//                 value={formData.tuition_fee}
//                 onChange={handleNumberChange}
//                 min="0"
//                 step="1000"
//                 prefix={<DollarSign size={14} className="text-gray-400" />}
//               />
//               <Input
//                 type="number"
//                 label="Registration Fee (₦)"
//                 name="registration_fee"
//                 value={formData.registration_fee}
//                 onChange={handleNumberChange}
//                 min="0"
//                 step="1000"
//               />
//               <Input
//                 type="number"
//                 label="Examination Fee (₦)"
//                 name="exam_fee"
//                 value={formData.exam_fee}
//                 onChange={handleNumberChange}
//                 min="0"
//                 step="1000"
//               />
//               <Input
//                 type="number"
//                 label="Sports Fee (₦)"
//                 name="sports_fee"
//                 value={formData.sports_fee}
//                 onChange={handleNumberChange}
//                 min="0"
//                 step="1000"
//               />
//               <Input
//                 type="number"
//                 label="Library Fee (₦)"
//                 name="library_fee"
//                 value={formData.library_fee}
//                 onChange={handleNumberChange}
//                 min="0"
//                 step="1000"
//               />
//               <Input
//                 type="number"
//                 label="ICT/Computer Fee (₦)"
//                 name="ict_fee"
//                 value={formData.ict_fee}
//                 onChange={handleNumberChange}
//                 min="0"
//                 step="1000"
//               />
//               <Input
//                 type="number"
//                 label="Development Fee (₦)"
//                 name="development_fee"
//                 value={formData.development_fee}
//                 onChange={handleNumberChange}
//                 min="0"
//                 step="1000"
//               />
//               <Input
//                 type="number"
//                 label="PTA Fee (₦)"
//                 name="pta_fee"
//                 value={formData.pta_fee}
//                 onChange={handleNumberChange}
//                 min="0"
//                 step="1000"
//               />
//               <Input
//                 type="number"
//                 label="Insurance Fee (₦)"
//                 name="insurance_fee"
//                 value={formData.insurance_fee}
//                 onChange={handleNumberChange}
//                 min="0"
//                 step="1000"
//               />
//             </div>
//           </div>
          
//           {/* Custom Fees */}
//           <div>
//             <h4 className="text-sm font-semibold text-gray-800 mb-3 pb-2 border-b">Custom Fees</h4>
//             <div className="bg-gray-50 rounded-xl p-4 space-y-3">
//               {customFeeItems.map((item, index) => (
//                 <div key={index} className="flex items-center gap-3">
//                     <div className="flex-1 bg-white rounded-lg p-2 px-3 border border-gray-200">
//                     <span className="text-sm font-medium">{item.name}</span>
//                     <span className="text-sm text-gray-500 ml-2">
//                         - {formatCurrency(item.amount)}
//                     </span>
//                     </div>
//                     <button
//                     type="button"
//                     onClick={() => removeCustomFee(index)}
//                     className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
//                     >
//                     <Trash2 size={16} />
//                     </button>
//                 </div>
//                 ))}
//               <div className="flex gap-3">
//                 <input
//                   type="text"
//                   value={newCustomFeeName}
//                   onChange={(e) => setNewCustomFeeName(e.target.value)}
//                   placeholder="Fee name (e.g., Laboratory Fee)"
//                   className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary-500"
//                 />
//                 <input
//                   type="number"
//                   value={newCustomFeeAmount}
//                   onChange={(e) => setNewCustomFeeAmount(e.target.value)}
//                   placeholder="Amount (₦)"
//                   className="w-32 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary-500"
//                 />
//                 <button
//                   type="button"
//                   onClick={addCustomFee}
//                   className="px-4 py-2 bg-secondary-600 text-white rounded-lg text-sm font-medium hover:bg-secondary-700 transition-colors flex items-center gap-1"
//                 >
//                   <Plus size={14} /> Add
//                 </button>
//               </div>
//             </div>
//           </div>
          
//           {/* Discounts */}
//           <div>
//             <h4 className="text-sm font-semibold text-gray-800 mb-3 pb-2 border-b">Discounts</h4>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <Input
//                 type="number"
//                 label="Early Payment Discount (%)"
//                 name="early_payment_discount"
//                 value={formData.early_payment_discount}
//                 onChange={handleNumberChange}
//                 min="0"
//                 max="100"
//                 step="5"
//               />
//               <Input
//                 type="number"
//                 label="Sibling Discount (%)"
//                 name="sibling_discount"
//                 value={formData.sibling_discount}
//                 onChange={handleNumberChange}
//                 min="0"
//                 max="100"
//                 step="5"
//               />
//             </div>
//           </div>
          
//           {/* Description & Status */}
//           <div>
//             <h4 className="text-sm font-semibold text-gray-800 mb-3 pb-2 border-b">Additional Information</h4>
//             <div className="space-y-4">
//               <textarea
//                 name="description"
//                 value={formData.description}
//                 onChange={handleChange}
//                 rows="3"
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary-500"
//                 placeholder="Additional notes or description..."
//               />
//               <label className="flex items-center gap-2 cursor-pointer">
//                 <input
//                   type="checkbox"
//                   name="is_active"
//                   checked={formData.is_active}
//                   onChange={handleChange}
//                   className="w-4 h-4 text-secondary-600 rounded"
//                 />
//                 <span className="text-sm text-gray-700">Active</span>
//               </label>
//             </div>
//           </div>
          
//           {/* Total Summary */}
//           <div className="bg-secondary-50 border border-secondary-200 rounded-xl p-4">
//             <div className="flex justify-between items-center">
//               <span className="text-sm font-semibold text-secondary-800">Total School Fees:</span>
//               <span className="text-xl font-bold text-secondary-900">{formatCurrency(calculateTotal())}</span>
//             </div>
//           </div>
//         </div>
        
//         <div className="flex gap-3 mt-6 pt-4 border-t">
//           <Button type="button" onClick={onClose} variant="outline" className="flex-1">
//             Cancel
//           </Button>
//           <Button type="submit" loading={loading} className="flex-1 bg-secondary-600 hover:bg-secondary-700">
//             {initialData ? 'Update Fee Structure' : 'Create Fee Structure'}
//           </Button>
//         </div>
//       </form>
//     </Modal>
//   );
// };

// export default FeeConfigModal;

/**
 * Fee Configuration Modal - Admin only
 * Configure fees per class level per term
 * Fully responsive: mobile-first, tablet, desktop
 */

import React, { useState, useEffect } from 'react';
import Modal from '../common/modal';
import { X, Plus, Trash2, DollarSign, AlertCircle, CheckCircle } from 'lucide-react';

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
      {loading && <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent" />}
      {Icon && !loading && <Icon size={size === 'tiny' ? 12 : size === 'small' ? 14 : 16} />}
      {children}
    </button>
  );
};

// Input Component
const Input = ({ label, name, value, onChange, type = 'text', placeholder, required, min, max, step, prefix, className = '' }) => (
  <div className={className}>
    {label && (
      <label className="block text-[10px] font-medium text-gray-500 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
    )}
    <div className="relative">
      {prefix && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          {prefix}
        </div>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        min={min}
        max={max}
        step={step}
        className={`w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801] focus:border-transparent transition-all ${prefix ? 'pl-8' : ''}`}
      />
    </div>
  </div>
);

// Select Component
const Select = ({ label, name, value, onChange, options, required, className = '' }) => (
  <div className={className}>
    {label && (
      <label className="block text-[10px] font-medium text-gray-500 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
    )}
    <select
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801] focus:border-transparent bg-white transition-all"
    >
      {options.map((opt, idx) => (
        <option key={idx} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
);

// Section Header
const SectionHeader = ({ title }) => (
  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
    <div className="w-1 h-4 bg-[#D94801] rounded-full" />
    <Text variant="caption" className="font-semibold text-gray-800 uppercase tracking-wide">{title}</Text>
  </div>
);

// Fee Summary Card
const FeeSummaryCard = ({ total }) => (
  <div className="bg-gradient-to-r from-[#D94801] to-[#C24000] rounded-xl p-4">
    <div className="flex justify-between items-center">
      <Text variant="caption" className="text-white/80 font-medium">Total School Fees</Text>
      <Text variant="h3" className="font-bold text-white">{formatCurrency(total)}</Text>
    </div>
  </div>
);

// Helper function
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(amount || 0);
};

// ============================================
// MAIN COMPONENT
// ============================================
const FeeConfigModal = ({ isOpen, onClose, onSubmit, initialData, sessions, terms, classLevels, loading }) => {
  const [formData, setFormData] = useState({
    session: '',
    term: '',
    class_level: '',
    tuition_fee: 0,
    registration_fee: 0,
    exam_fee: 0,
    sports_fee: 0,
    library_fee: 0,
    ict_fee: 0,
    development_fee: 0,
    pta_fee: 0,
    insurance_fee: 0,
    custom_fees: {},
    early_payment_discount: 0,
    sibling_discount: 0,
    description: '',
    is_active: true
  });
  
  const [customFeeItems, setCustomFeeItems] = useState([]);
  const [newCustomFeeName, setNewCustomFeeName] = useState('');
  const [newCustomFeeAmount, setNewCustomFeeAmount] = useState('');
  const [error, setError] = useState('');
  
  useEffect(() => {
    if (initialData) {
      console.log('Initial data for edit:', initialData);
      
      setFormData({
        session: initialData.session?.id || initialData.session || '',
        term: initialData.term?.id || initialData.term || '',
        class_level: initialData.class_level?.id || initialData.class_level || '',
        tuition_fee: parseFloat(initialData.tuition_fee) || 0,
        registration_fee: parseFloat(initialData.registration_fee) || 0,
        exam_fee: parseFloat(initialData.exam_fee) || 0,
        sports_fee: parseFloat(initialData.sports_fee) || 0,
        library_fee: parseFloat(initialData.library_fee) || 0,
        ict_fee: parseFloat(initialData.ict_fee) || 0,
        development_fee: parseFloat(initialData.development_fee) || 0,
        pta_fee: parseFloat(initialData.pta_fee) || 0,
        insurance_fee: parseFloat(initialData.insurance_fee) || 0,
        custom_fees: initialData.custom_fees || {},
        early_payment_discount: parseFloat(initialData.early_payment_discount) || 0,
        sibling_discount: parseFloat(initialData.sibling_discount) || 0,
        description: initialData.description || '',
        is_active: initialData.is_active !== undefined ? initialData.is_active : true
      });
      
      if (initialData.custom_fees) {
        let customFees = initialData.custom_fees;
        if (typeof customFees === 'string') {
          try {
            customFees = JSON.parse(customFees);
          } catch (e) {
            customFees = {};
          }
        }
        const items = Object.entries(customFees).map(([name, amount]) => ({
          name,
          amount: parseFloat(amount) || 0
        }));
        setCustomFeeItems(items);
      } else {
        setCustomFeeItems([]);
      }
    } else {
      resetForm();
    }
  }, [initialData, isOpen]);
  
  const resetForm = () => {
    setFormData({
      session: '',
      term: '',
      class_level: '',
      tuition_fee: 0,
      registration_fee: 0,
      exam_fee: 0,
      sports_fee: 0,
      library_fee: 0,
      ict_fee: 0,
      development_fee: 0,
      pta_fee: 0,
      insurance_fee: 0,
      custom_fees: {},
      early_payment_discount: 0,
      sibling_discount: 0,
      description: '',
      is_active: true
    });
    setCustomFeeItems([]);
    setNewCustomFeeName('');
    setNewCustomFeeAmount('');
    setError('');
  };
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    const numValue = value === '' ? 0 : parseFloat(value);
    setFormData(prev => ({
      ...prev,
      [name]: isNaN(numValue) ? 0 : numValue
    }));
  };
  
  const addCustomFee = () => {
    if (!newCustomFeeName.trim()) {
      setError('Please enter a fee name');
      return;
    }
    const amount = parseFloat(newCustomFeeAmount);
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    
    setCustomFeeItems(prev => [...prev, {
      name: newCustomFeeName.trim(),
      amount: amount
    }]);
    setNewCustomFeeName('');
    setNewCustomFeeAmount('');
    setError('');
  };
  
  const removeCustomFee = (index) => {
    setCustomFeeItems(prev => prev.filter((_, i) => i !== index));
  };
  
  const calculateTotal = () => {
    const tuition = parseFloat(formData.tuition_fee) || 0;
    const registration = parseFloat(formData.registration_fee) || 0;
    const exam = parseFloat(formData.exam_fee) || 0;
    const sports = parseFloat(formData.sports_fee) || 0;
    const library = parseFloat(formData.library_fee) || 0;
    const ict = parseFloat(formData.ict_fee) || 0;
    const development = parseFloat(formData.development_fee) || 0;
    const pta = parseFloat(formData.pta_fee) || 0;
    const insurance = parseFloat(formData.insurance_fee) || 0;
    
    const baseTotal = tuition + registration + exam + sports + library + ict + development + pta + insurance;
    const customTotal = customFeeItems.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    
    return baseTotal + customTotal;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.session) {
      setError('Please select an academic session');
      return;
    }
    if (!formData.term) {
      setError('Please select an academic term');
      return;
    }
    if (!formData.class_level) {
      setError('Please select a class level');
      return;
    }
    
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
    };
    
    const customFees = {};
    customFeeItems.forEach(item => {
      const key = item.name.toLowerCase().replace(/\s+/g, '_');
      customFees[key] = parseFloat(item.amount) || 0;
    });
    submitData.custom_fees = customFees;
    
    onSubmit(submitData);
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Edit Fee Structure' : 'Configure School Fees'} size="lg">
      <form onSubmit={handleSubmit} className="py-3 max-h-[70vh] overflow-y-auto px-1">
        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-center gap-2">
            <AlertCircle size={14} />
            {error}
          </div>
        )}
        
        <div className="space-y-5">
          {/* Basic Information */}
          <div>
            <SectionHeader title="Basic Information" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <Select
                label="Academic Session"
                name="session"
                value={formData.session}
                onChange={handleChange}
                options={[
                  { value: '', label: 'Select Session' },
                  ...sessions.map(s => ({ value: s.id, label: s.name }))
                ]}
                required
              />
              <Select
                label="Academic Term"
                name="term"
                value={formData.term}
                onChange={handleChange}
                options={[
                  { value: '', label: 'Select Term' },
                  ...terms.map(t => ({ value: t.id, label: t.name }))
                ]}
                required
              />
              <Select
                label="Class Level"
                name="class_level"
                value={formData.class_level}
                onChange={handleChange}
                options={[
                  { value: '', label: 'Select Class Level' },
                  ...classLevels.map(cl => ({ value: cl.id, label: cl.name }))
                ]}
                required
              />
            </div>
          </div>
          
          {/* Basic Fees */}
          <div>
            <SectionHeader title="Basic Fees" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <Input
                type="number"
                label="Tuition Fee"
                name="tuition_fee"
                value={formData.tuition_fee}
                onChange={handleNumberChange}
                min="0"
                step="1000"
                prefix={<DollarSign size={14} />}
              />
              <Input
                type="number"
                label="Registration Fee"
                name="registration_fee"
                value={formData.registration_fee}
                onChange={handleNumberChange}
                min="0"
                step="1000"
              />
              <Input
                type="number"
                label="Examination Fee"
                name="exam_fee"
                value={formData.exam_fee}
                onChange={handleNumberChange}
                min="0"
                step="1000"
              />
              <Input
                type="number"
                label="Sports Fee"
                name="sports_fee"
                value={formData.sports_fee}
                onChange={handleNumberChange}
                min="0"
                step="1000"
              />
              <Input
                type="number"
                label="Library Fee"
                name="library_fee"
                value={formData.library_fee}
                onChange={handleNumberChange}
                min="0"
                step="1000"
              />
              <Input
                type="number"
                label="ICT/Computer Fee"
                name="ict_fee"
                value={formData.ict_fee}
                onChange={handleNumberChange}
                min="0"
                step="1000"
              />
              <Input
                type="number"
                label="Development Fee"
                name="development_fee"
                value={formData.development_fee}
                onChange={handleNumberChange}
                min="0"
                step="1000"
              />
              <Input
                type="number"
                label="PTA Fee"
                name="pta_fee"
                value={formData.pta_fee}
                onChange={handleNumberChange}
                min="0"
                step="1000"
              />
              <Input
                type="number"
                label="Insurance Fee"
                name="insurance_fee"
                value={formData.insurance_fee}
                onChange={handleNumberChange}
                min="0"
                step="1000"
              />
            </div>
          </div>
          
          {/* Custom Fees */}
          <div>
            <SectionHeader title="Custom Fees" />
            <div className="bg-gray-50 rounded-xl p-3 space-y-3">
              {customFeeItems.length === 0 ? (
                <div className="text-center py-4">
                  <Text variant="tiny" className="text-gray-400">No custom fees added</Text>
                </div>
              ) : (
                customFeeItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="flex-1 bg-white rounded-lg p-2 px-3 border border-gray-200">
                      <div className="flex justify-between items-center">
                        <Text variant="small" className="font-medium text-gray-800">{item.name}</Text>
                        <Text variant="small" className="font-semibold text-[#D94801]">{formatCurrency(item.amount)}</Text>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeCustomFee(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
              )}
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={newCustomFeeName}
                  onChange={(e) => setNewCustomFeeName(e.target.value)}
                  placeholder="Fee name (e.g., Laboratory Fee)"
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
                />
                <input
                  type="number"
                  value={newCustomFeeAmount}
                  onChange={(e) => setNewCustomFeeAmount(e.target.value)}
                  placeholder="Amount (₦)"
                  className="w-full sm:w-36 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="small"
                  icon={Plus}
                  onClick={addCustomFee}
                  className="sm:w-auto"
                >
                  Add
                </Button>
              </div>
            </div>
          </div>
          
          {/* Discounts */}
          <div>
            <SectionHeader title="Discounts" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                type="number"
                label="Early Payment Discount (%)"
                name="early_payment_discount"
                value={formData.early_payment_discount}
                onChange={handleNumberChange}
                min="0"
                max="100"
                step="5"
              />
              <Input
                type="number"
                label="Sibling Discount (%)"
                name="sibling_discount"
                value={formData.sibling_discount}
                onChange={handleNumberChange}
                min="0"
                max="100"
                step="5"
              />
            </div>
          </div>
          
          {/* Additional Information */}
          <div>
            <SectionHeader title="Additional Information" />
            <div className="space-y-3">
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="2"
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801] resize-none"
                placeholder="Additional notes or description..."
              />
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  className="w-3.5 h-3.5 text-[#D94801] rounded border-gray-300 focus:ring-[#D94801]"
                />
                <Text variant="tiny" className="text-gray-700">Active</Text>
              </label>
            </div>
          </div>
          
          {/* Total Summary */}
          <FeeSummaryCard total={calculateTotal()} />
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-5 pt-4 border-t border-gray-100">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1 order-2 sm:order-1">
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={loading} className="flex-1 order-1 sm:order-2">
            {initialData ? 'Update Fee Structure' : 'Create Fee Structure'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default FeeConfigModal;