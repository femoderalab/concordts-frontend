/**
 * Parent utility functions
 * Helper functions for parent management
 */

/**
 * Get parent type options
 */
export const getParentTypeOptions = () => [
  { value: 'father', label: 'Father' },
  { value: 'mother', label: 'Mother' },
  { value: 'guardian', label: 'Guardian' },
  { value: 'relative', label: 'Relative' },
  { value: 'other', label: 'Other' },
];

/**
 * Get marital status options
 */
export const getMaritalStatusOptions = () => [
  { value: 'married', label: 'Married' },
  { value: 'single', label: 'Single' },
  { value: 'divorced', label: 'Divorced' },
  { value: 'widowed', label: 'Widowed' },
  { value: 'separated', label: 'Separated' },
];

/**
 * Get communication method options
 */
export const getCommunicationOptions = () => [
  { value: 'email', label: 'Email' },
  { value: 'sms', label: 'SMS' },
  { value: 'phone', label: 'Phone Call' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'in_person', label: 'In Person' },
];

/**
 * Get income range options
 */
export const getIncomeRangeOptions = () => [
  { value: 'below_500k', label: 'Below ₦500,000' },
  { value: '500k_1m', label: '₦500,000 - ₦1 Million' },
  { value: '1m_3m', label: '₦1 Million - ₦3 Million' },
  { value: '3m_5m', label: '₦3 Million - ₦5 Million' },
  { value: 'above_5m', label: 'Above ₦5 Million' },
  { value: 'prefer_not', label: 'Prefer not to say' },
];

/**
 * Format phone number for display
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{4})(\d{3})(\d{4})/, '$1 $2 $3');
  }
  if (cleaned.length === 13 && cleaned.startsWith('234')) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{4})/, '+$1 $2 $3 $4');
  }
  return phone;
};

/**
 * Validate Nigerian phone number
 */
export const validateNigerianPhone = (phone) => {
  if (!phone) return false;
  const cleaned = phone.replace(/\D/g, '');
  // Accepts: 08012345678 or 2348012345678
  return (cleaned.length === 11 && cleaned.startsWith('0')) ||
         (cleaned.length === 13 && cleaned.startsWith('234'));
};

/**
 * Get parent type display label
 */
export const getParentTypeLabel = (type) => {
  const options = getParentTypeOptions();
  const option = options.find(opt => opt.value === type);
  return option ? option.label : type;
};

/**
 * Get marital status label
 */
export const getMaritalStatusLabel = (status) => {
  const options = getMaritalStatusOptions();
  const option = options.find(opt => opt.value === status);
  return option ? option.label : status;
};

/**
 * Get communication method label
 */
export const getCommunicationLabel = (method) => {
  const options = getCommunicationOptions();
  const option = options.find(opt => opt.value === method);
  return option ? option.label : method;
};

/**
 * Get income range label
 */
export const getIncomeRangeLabel = (range) => {
  const options = getIncomeRangeOptions();
  const option = options.find(opt => opt.value === range);
  return option ? option.label : range || 'Not Specified';
};

/**
 * Format fee for display
 */
export const formatFee = (amount) => {
  if (!amount && amount !== 0) return '₦0.00';
  return `₦${parseFloat(amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
};

/**
 * Calculate fee percentage
 */
export const calculateFeePercentage = (total, paid) => {
  if (!total || total <= 0) return 0;
  return Math.min(100, Math.round((paid / total) * 100));
};

/**
 * Get PTA status badge color
 */
export const getPTAStatusColor = (isPTAMember) => {
  return isPTAMember ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
};

/**
 * Get verification status badge color
 */
export const getVerificationStatusColor = (isVerified) => {
  return isVerified ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800';
};

/**
 * Get children count badge color
 */
export const getChildrenCountColor = (count) => {
  if (count === 0) return 'bg-gray-100 text-gray-800';
  if (count === 1) return 'bg-blue-100 text-blue-800';
  if (count <= 3) return 'bg-green-100 text-green-800';
  return 'bg-purple-100 text-purple-800';
};

/**
 * Validate email
 */
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

/**
 * Validate required fields for parent registration
 */
export const validateParentFields = (userData, parentData) => {
  const errors = {};
  // User validation
  if (!userData.first_name?.trim()) errors.first_name = 'First name is required';
  if (!userData.last_name?.trim()) errors.last_name = 'Last name is required';
  if (!userData.email?.trim()) errors.email = 'Email is required';
  if (userData.email && !validateEmail(userData.email)) errors.email = 'Invalid email format';
  if (!userData.phone_number?.trim()) errors.phone_number = 'Phone number is required';
  if (userData.phone_number && !validateNigerianPhone(userData.phone_number)) {
    errors.phone_number = 'Phone must start with 0 or +234 and be 11 digits';
  }
  if (!userData.password) errors.password = 'Password is required';
  if (userData.password && userData.password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
  }
  if (userData.password !== userData.password2) {
    errors.password2 = 'Passwords do not match';
  }
  // Parent validation
  if (!parentData.parent_type) errors.parent_type = 'Parent type is required';
  return errors;
};

/**
 * Format parent for display
 */
export const formatParentName = (parent) => {
  if (!parent || !parent.user) return '';
  return `${parent.user.first_name} ${parent.user.last_name}`.trim();
};

/**
 * Export all functions as default
 */
export default {
  getParentTypeOptions,
  getMaritalStatusOptions,
  getCommunicationOptions,
  getIncomeRangeOptions,
  formatPhoneNumber,
  validateNigerianPhone,
  getParentTypeLabel,
  getMaritalStatusLabel,
  getCommunicationLabel,
  getIncomeRangeLabel,
  formatFee,
  calculateFeePercentage,
  getPTAStatusColor,
  getVerificationStatusColor,
  getChildrenCountColor,
  validateEmail,
  validateParentFields,
  formatParentName,
};