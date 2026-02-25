/**
 * Student Utility Functions - UPDATED & COMPLETE
 * All helper functions for student management with Nigerian context
 */

// =====================
// NIGERIAN DATA
// =====================

/**
 * Get all Nigerian states with codes
 */
export const getNigerianStates = () => [
  { value: 'abia', label: 'Abia', code: 'AB' },
  { value: 'adamawa', label: 'Adamawa', code: 'AD' },
  { value: 'akwa_ibom', label: 'Akwa Ibom', code: 'AK' },
  { value: 'anambra', label: 'Anambra', code: 'AN' },
  { value: 'bauchi', label: 'Bauchi', code: 'BA' },
  { value: 'bayelsa', label: 'Bayelsa', code: 'BY' },
  { value: 'benue', label: 'Benue', code: 'BE' },
  { value: 'borno', label: 'Borno', code: 'BO' },
  { value: 'cross_river', label: 'Cross River', code: 'CR' },
  { value: 'delta', label: 'Delta', code: 'DE' },
  { value: 'ebonyi', label: 'Ebonyi', code: 'EB' },
  { value: 'edo', label: 'Edo', code: 'ED' },
  { value: 'ekiti', label: 'Ekiti', code: 'EK' },
  { value: 'enugu', label: 'Enugu', code: 'EN' },
  { value: 'gombe', label: 'Gombe', code: 'GO' },
  { value: 'imo', label: 'Imo', code: 'IM' },
  { value: 'jigawa', label: 'Jigawa', code: 'JI' },
  { value: 'kaduna', label: 'Kaduna', code: 'KD' },
  { value: 'kano', label: 'Kano', code: 'KN' },
  { value: 'katsina', label: 'Katsina', code: 'KT' },
  { value: 'kebbi', label: 'Kebbi', code: 'KE' },
  { value: 'kogi', label: 'Kogi', code: 'KO' },
  { value: 'kwara', label: 'Kwara', code: 'KW' },
  { value: 'lagos', label: 'Lagos', code: 'LA' },
  { value: 'nasarawa', label: 'Nasarawa', code: 'NA' },
  { value: 'niger', label: 'Niger', code: 'NI' },
  { value: 'ogun', label: 'Ogun', code: 'OG' },
  { value: 'ondo', label: 'Ondo', code: 'ON' },
  { value: 'osun', label: 'Osun', code: 'OS' },
  { value: 'oyo', label: 'Oyo', code: 'OY' },
  { value: 'plateau', label: 'Plateau', code: 'PL' },
  { value: 'rivers', label: 'Rivers', code: 'RI' },
  { value: 'sokoto', label: 'Sokoto', code: 'SO' },
  { value: 'taraba', label: 'Taraba', code: 'TA' },
  { value: 'yobe', label: 'Yobe', code: 'YO' },
  { value: 'zamfara', label: 'Zamfara', code: 'ZA' },
  { value: 'fct', label: 'Federal Capital Territory', code: 'FC' },
];

/**
 * Get Nigerian timezones
 */
export const getNigerianTimezones = () => [
  { value: 'WAT', label: 'West Africa Time (UTC+1)' },
];

// =====================
// ACADEMIC OPTIONS
// =====================

/**
 * Get stream options for Nigerian schools
 */
export const getStreamOptions = () => [
  { value: 'none', label: 'Not Applicable (Primary School)' },
  { value: 'general', label: 'General (No stream yet)' },
  { value: 'science', label: 'Science' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'art', label: 'Arts/Humanities' },
  { value: 'technical', label: 'Technical' },
];

/**
 * Get student category options
 */
export const getStudentCategoryOptions = () => [
  { value: 'day', label: 'Day Student' },
  { value: 'boarding', label: 'Boarding Student' },
  { value: 'special_needs', label: 'Special Needs Student' },
  { value: 'scholarship', label: 'Scholarship Student' },
  { value: 'repeat', label: 'Repeating Student' },
  { value: 'new', label: 'New Student' },
];

/**
 * Get house system options
 */
export const getHouseOptions = () => [
  { value: 'none', label: 'No House Assigned' },
  { value: 'red', label: 'Red House' },
  { value: 'blue', label: 'Blue House' },
  { value: 'green', label: 'Green House' },
  { value: 'yellow', label: 'Yellow House' },
  { value: 'purple', label: 'Purple House' },
  { value: 'orange', label: 'Orange House' },
  { value: 'white', label: 'White House' },
  { value: 'black', label: 'Black House' },
];

/**
 * Get class level options (from your backend model)
 */
export const getClassLevelOptions = () => [
  { value: 'creche', label: 'Creche' },
  { value: 'nursery_1', label: 'Nursery 1' },
  { value: 'nursery_2', label: 'Nursery 2' },
  { value: 'kg_1', label: 'Kindergarten 1 (KG 1)' },
  { value: 'kg_2', label: 'Kindergarten 2 (KG 2)' },
  { value: 'primary_1', label: 'Primary 1' },
  { value: 'primary_2', label: 'Primary 2' },
  { value: 'primary_3', label: 'Primary 3' },
  { value: 'primary_4', label: 'Primary 4' },
  { value: 'primary_5', label: 'Primary 5' },
  { value: 'primary_6', label: 'Primary 6' },
  { value: 'jss_1', label: 'JSS 1' },
  { value: 'jss_2', label: 'JSS 2' },
  { value: 'jss_3', label: 'JSS 3' },
  { value: 'sss_1', label: 'SSS 1' },
  { value: 'sss_2', label: 'SSS 2' },
  { value: 'sss_3', label: 'SSS 3' },
];

// =====================
// TRANSPORTATION OPTIONS
// =====================

export const getTransportationOptions = () => [
  { value: 'parent_drop', label: 'Parent Drop-off', icon: '🚗' },
  { value: 'school_bus', label: 'School Bus', icon: '🚌' },
  { value: 'public_transport', label: 'Public Transport', icon: '🚎' },
  { value: 'walk', label: 'Walks to School', icon: '🚶' },
  { value: 'bicycle', label: 'Bicycle', icon: '🚲' },
  { value: 'other', label: 'Other', icon: '🛵' },
];

// =====================
// HEALTH & MEDICAL OPTIONS
// =====================

export const getBloodGroupOptions = () => [
  { value: 'A+', label: 'A+' },
  { value: 'A-', label: 'A-' },
  { value: 'B+', label: 'B+' },
  { value: 'B-', label: 'B-' },
  { value: 'AB+', label: 'AB+' },
  { value: 'AB-', label: 'AB-' },
  { value: 'O+', label: 'O+' },
  { value: 'O-', label: 'O-' },
  { value: 'unknown', label: 'Unknown' },
];

export const getGenotypeOptions = () => [
  { value: 'AA', label: 'AA' },
  { value: 'AS', label: 'AS' },
  { value: 'SS', label: 'SS' },
  { value: 'AC', label: 'AC' },
  { value: 'SC', label: 'SC' },
  { value: 'unknown', label: 'Unknown' },
];

// =====================
// FEE & FINANCIAL OPTIONS
// =====================

export const getFeeStatusOptions = () => [
  { value: 'not_paid', label: 'Not Paid', color: 'red' },
  { value: 'paid_partial', label: 'Partially Paid', color: 'yellow' },
  { value: 'paid_full', label: 'Paid in Full', color: 'green' },
  { value: 'scholarship', label: 'On Scholarship', color: 'blue' },
  { value: 'exempted', label: 'Fee Exempted', color: 'purple' },
  { value: 'payment_plan', label: 'Payment Plan', color: 'orange' },
];

export const getPaymentMethodOptions = () => [
  { value: 'cash', label: 'Cash' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'pos', label: 'POS' },
  { value: 'online', label: 'Online Payment' },
  { value: 'cheque', label: 'Cheque' },
  { value: 'mobile_money', label: 'Mobile Money' },
];

/**
 * Format fee amount (alias for formatNaira)
 * @param {number|string} amount - Amount to format
 * @returns {string} - Formatted amount
 */
export const formatFee = (amount) => formatNaira(amount, true);

// =====================
// DOCUMENT OPTIONS
// =====================

export const getDocumentTypeOptions = () => [
  { value: 'student_image', label: 'Student Photograph', required: true },
  { value: 'birth_certificate', label: 'Birth Certificate', required: true },
  { value: 'immunization_record', label: 'Immunization Record', required: true },
  { value: 'previous_school_report', label: 'Previous School Report', required: false },
  { value: 'parent_id_copy', label: 'Parent ID Copy', required: true },
  { value: 'transfer_certificate', label: 'Transfer Certificate', required: false },
  { value: 'medical_report', label: 'Medical Report', required: false },
  { value: 'fee_payment_evidence', label: 'Fee Payment Evidence', required: false },
  { value: 'guardian_declaration', label: 'Guardian Declaration', required: false },
  { value: 'other', label: 'Other Document', required: false },
];

// =====================
// VALIDATION FUNCTIONS
// =====================

/**
 * Validate Nigerian phone number
 * @param {string} phone - Phone number to validate
 * @returns {Object} {isValid: boolean, message: string, formatted: string}
 */
export const validateNigerianPhone = (phone) => {
  if (!phone || phone.trim() === '') {
    return { isValid: false, message: 'Phone number is required', formatted: '' };
  }
  
  // Remove all non-digit characters except +
  const cleanPhone = phone.replace(/[^\d+]/g, '');
  
  // Check for valid Nigerian formats
  const patterns = [
    /^0[7-9][0-1]\d{8}$/,        // 08123456789
    /^\+234[7-9][0-1]\d{8}$/,    // +2348123456789
    /^234[7-9][0-1]\d{8}$/,      // 2348123456789
  ];
  
  const isValid = patterns.some(pattern => pattern.test(cleanPhone));
  
  if (!isValid) {
    return { 
      isValid: false, 
      message: 'Invalid Nigerian phone number. Format: 08123456789 or +2348123456789',
      formatted: '' 
    };
  }
  
  // Format the phone number
  let formatted = cleanPhone;
  if (cleanPhone.startsWith('234')) {
    formatted = '+234' + cleanPhone.substring(3);
  } else if (cleanPhone.startsWith('0')) {
    formatted = '+234' + cleanPhone.substring(1);
  }
  
  return { isValid: true, message: 'Valid phone number', formatted };
};

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {Object} {isValid: boolean, message: string}
 */
export const validateEmail = (email) => {
  if (!email || email.trim() === '') {
    return { isValid: false, message: 'Email is required' };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValid = emailRegex.test(email.trim());
  
  if (!isValid) {
    return { isValid: false, message: 'Invalid email address' };
  }
  
  return { isValid: true, message: 'Valid email' };
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} {isValid: boolean, message: string, strength: number}
 */
export const validatePassword = (password) => {
  if (!password || password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters', strength: 0 };
  }
  
  let strength = 0;
  
  // Check for lowercase
  if (/[a-z]/.test(password)) strength += 1;
  
  // Check for uppercase
  if (/[A-Z]/.test(password)) strength += 1;
  
  // Check for numbers
  if (/\d/.test(password)) strength += 1;
  
  // Check for special characters
  if (/[^A-Za-z0-9]/.test(password)) strength += 1;
  
  const isValid = strength >= 3;
  let message = '';
  
  if (strength === 1) message = 'Very weak password';
  else if (strength === 2) message = 'Weak password';
  else if (strength === 3) message = 'Good password';
  else message = 'Strong password';
  
  return { isValid, message, strength };
};

/**
 * Validate date of birth
 * @param {string} dateOfBirth - Date of birth in YYYY-MM-DD format
 * @param {number} minAge - Minimum age in years
 * @param {number} maxAge - Maximum age in years
 * @returns {Object} {isValid: boolean, message: string, age: number}
 */
export const validateDateOfBirth = (dateOfBirth, minAge = 3, maxAge = 25) => {
  if (!dateOfBirth) {
    return { isValid: false, message: 'Date of birth is required', age: 0 };
  }
  
  try {
    const dob = new Date(dateOfBirth);
    const today = new Date();
    
    // Check if date is valid
    if (isNaN(dob.getTime())) {
      return { isValid: false, message: 'Invalid date format', age: 0 };
    }
    
    // Check if date is not in the future
    if (dob > today) {
      return { isValid: false, message: 'Date of birth cannot be in the future', age: 0 };
    }
    
    // Calculate age
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    
    // Check age range
    if (age < minAge) {
      return { 
        isValid: false, 
        message: `Student must be at least ${minAge} years old`, 
        age 
      };
    }
    
    if (age > maxAge) {
      return { 
        isValid: false, 
        message: `Student age cannot exceed ${maxAge} years`, 
        age 
      };
    }
    
    return { isValid: true, message: 'Valid date of birth', age };
  } catch (error) {
    return { isValid: false, message: 'Invalid date', age: 0 };
  }
};

// =====================
// FORMATTING FUNCTIONS
// =====================

/**
 * Format phone number to Nigerian format
 * @param {string} phone - Phone number
 * @returns {string} - Formatted phone
 */
export const formatPhone = (phone) => {
  if (!phone) return '';
  
  const { formatted } = validateNigerianPhone(phone);
  return formatted || phone;
};

/**
 * Format Nigerian currency
 * @param {number|string} amount - Amount to format
 * @param {boolean} withSymbol - Include currency symbol
 * @returns {string} - Formatted amount
 */
export const formatNaira = (amount, withSymbol = true) => {
  if (!amount && amount !== 0) return withSymbol ? '₦0.00' : '0.00';
  
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numAmount)) return withSymbol ? '₦0.00' : '0.00';
  
  const formatted = numAmount.toLocaleString('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  
  return withSymbol ? `₦${formatted}` : formatted;
};

/**
 * Format date to Nigerian format
 * @param {string|Date} date - Date to format
 * @param {string} format - Format type: 'short', 'long', 'full'
 * @returns {string} - Formatted date
 */
export const formatDate = (date, format = 'long') => {
  if (!date) return 'N/A';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) return 'Invalid Date';
    
    const options = {
      short: { year: 'numeric', month: 'short', day: 'numeric' },
      long: { year: 'numeric', month: 'long', day: 'numeric' },
      full: { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      },
      time: {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      },
    };
    
    const formatOptions = options[format] || options.long;
    return dateObj.toLocaleDateString('en-NG', formatOptions);
  } catch (error) {
    return 'Invalid Date';
  }
};

/**
 * Format time
 * @param {string|Date} time - Time to format
 * @returns {string} - Formatted time
 */
export const formatTime = (time) => {
  if (!time) return '';
  
  try {
    const timeObj = typeof time === 'string' ? new Date(`1970-01-01T${time}`) : time;
    
    if (isNaN(timeObj.getTime())) return '';
    
    return timeObj.toLocaleTimeString('en-NG', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch (error) {
    return '';
  }
};

// =====================
// STATUS & LABEL FUNCTIONS
// =====================

/**
 * Get fee status label and color
 * @param {string} status - Fee status
 * @returns {Object} {label: string, color: string, bgColor: string}
 */
export const getFeeStatusInfo = (status) => {
  const statusMap = {
    not_paid: { 
      label: 'Not Paid', 
      color: 'text-red-700', 
      bgColor: 'bg-red-100',
      badge: 'badge-error'
    },
    paid_partial: { 
      label: 'Partially Paid', 
      color: 'text-yellow-700', 
      bgColor: 'bg-yellow-100',
      badge: 'badge-warning'
    },
    paid_full: { 
      label: 'Paid in Full', 
      color: 'text-green-700', 
      bgColor: 'bg-green-100',
      badge: 'badge-success'
    },
    scholarship: { 
      label: 'On Scholarship', 
      color: 'text-blue-700', 
      bgColor: 'bg-blue-100',
      badge: 'badge-info'
    },
    exempted: { 
      label: 'Fee Exempted', 
      color: 'text-purple-700', 
      bgColor: 'bg-purple-100',
      badge: 'badge-primary'
    },
    payment_plan: { 
      label: 'Payment Plan', 
      color: 'text-orange-700', 
      bgColor: 'bg-orange-100',
      badge: 'badge-secondary'
    },
  };
  
  return statusMap[status] || { 
    label: 'Unknown', 
    color: 'text-gray-700', 
    bgColor: 'bg-gray-100',
    badge: 'badge-neutral'
  };
};

/**
 * Get student status info
 * @param {Object} student - Student object
 * @returns {Object} Status information
 */
export const getStudentStatusInfo = (student) => {
  if (!student) {
    return { label: 'Unknown', color: 'text-gray-700', bgColor: 'bg-gray-100' };
  }
  
  if (!student.is_active) {
    return { label: 'Inactive', color: 'text-red-700', bgColor: 'bg-red-100' };
  }
  
  if (student.is_graduated) {
    return { label: 'Graduated', color: 'text-purple-700', bgColor: 'bg-purple-100' };
  }
  
  if (student.is_suspended) {
    return { label: 'Suspended', color: 'text-orange-700', bgColor: 'bg-orange-100' };
  }
  
  return { label: 'Active', color: 'text-green-700', bgColor: 'bg-green-100' };
};

/**
 * Get stream label
 * @param {string} stream - Stream value
 * @returns {string} - Stream label
 */
export const getStreamLabel = (stream) => {
  const streamMap = {
    none: 'Not Applicable',
    general: 'General',
    science: 'Science',
    commercial: 'Commercial',
    art: 'Arts/Humanities',
    technical: 'Technical',
  };
  
  return streamMap[stream] || stream || 'Not Specified';
};

/**
 * Get academic level from class level
 * @param {string} classLevel - Class level code
 * @returns {string} - Academic level
 */
export const getAcademicLevel = (classLevel) => {
  if (!classLevel) return 'Not Assigned';
  
  const level = classLevel.toLowerCase();
  
  if (['creche', 'nursery_1', 'nursery_2', 'kg_1', 'kg_2'].includes(level)) {
    return 'Pre-School';
  }
  
  if (level.startsWith('primary')) {
    return 'Primary School';
  }
  
  if (level.startsWith('jss')) {
    return 'Junior Secondary';
  }
  
  if (level.startsWith('sss')) {
    return 'Senior Secondary';
  }
  
  return 'Unknown';
};

// =====================
// CALCULATION FUNCTIONS
// =====================

/**
 * Calculate fee balance
 * @param {number|string} total - Total fee
 * @param {number|string} paid - Amount paid
 * @returns {Object} {balance: number, percentage: number, isPaid: boolean}
 */
export const calculateFeeDetails = (total, paid) => {
  const totalAmount = parseFloat(total) || 0;
  const paidAmount = parseFloat(paid) || 0;
  const balance = Math.max(0, totalAmount - paidAmount);
  const percentage = totalAmount > 0 ? Math.min(100, Math.round((paidAmount / totalAmount) * 100)) : 0;
  const isPaid = totalAmount > 0 && paidAmount >= totalAmount;
  
  return {
    total: totalAmount,
    paid: paidAmount,
    balance,
    percentage,
    isPaid,
    isPartial: totalAmount > 0 && paidAmount > 0 && paidAmount < totalAmount,
    isOverpaid: paidAmount > totalAmount,
  };
};

/**
 * Calculate attendance percentage
 * @param {number|string} present - Days present
 * @param {number|string} absent - Days absent
 * @param {number|string} late - Days late
 * @returns {Object} Attendance statistics
 */
export const calculateAttendanceStats = (present, absent, late) => {
  const presentDays = parseInt(present) || 0;
  const absentDays = parseInt(absent) || 0;
  const lateDays = parseInt(late) || 0;
  const totalDays = presentDays + absentDays;
  
  let percentage = 0;
  if (totalDays > 0) {
    percentage = Math.round((presentDays / totalDays) * 100);
  }
  
  const latePercentage = totalDays > 0 ? Math.round((lateDays / totalDays) * 100) : 0;
  
  let status = 'excellent';
  if (percentage < 80) status = 'good';
  if (percentage < 70) status = 'fair';
  if (percentage < 60) status = 'poor';
  
  return {
    present: presentDays,
    absent: absentDays,
    late: lateDays,
    total: totalDays,
    percentage,
    latePercentage,
    status,
  };
};

/**
 * Calculate age from date of birth
 * @param {string} dateOfBirth - Date of birth
 * @param {Date} referenceDate - Reference date (defaults to today)
 * @returns {number} Age in years
 */
export const calculateAge = (dateOfBirth, referenceDate = new Date()) => {
  if (!dateOfBirth) return 0;
  
  try {
    const birthDate = new Date(dateOfBirth);
    if (isNaN(birthDate.getTime())) return 0;
    
    let age = referenceDate.getFullYear() - birthDate.getFullYear();
    const monthDiff = referenceDate.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && referenceDate.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  } catch (error) {
    return 0;
  }
};

// =====================
// HELPER FUNCTIONS
// =====================

/**
 * Get initials from name
 * @param {string} firstName - First name
 * @param {string} lastName - Last name
 * @returns {string} Initials (max 2 characters)
 */
export const getInitials = (firstName = '', lastName = '') => {
  const first = firstName.trim().charAt(0).toUpperCase();
  const last = lastName.trim().charAt(0).toUpperCase();
  
  if (first && last) return `${first}${last}`;
  if (first) return first;
  if (last) return last;
  return 'NA';
};

/**
 * Generate avatar color based on name
 * @param {string} name - Name for color generation
 * @returns {string} Tailwind CSS color class
 */
export const getAvatarColor = (name = '') => {
  const colors = [
    'bg-red-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-orange-500',
    'bg-teal-500',
    'bg-cyan-500',
  ];
  
  if (!name) return colors[0];
  
  const charCode = name.charCodeAt(0) || 0;
  return colors[charCode % colors.length];
};

/**
 * Check if student can be promoted
 * @param {Object} student - Student object
 * @returns {boolean} True if student can be promoted
 */
export const canPromoteStudent = (student) => {
  if (!student) return false;
  
  // Basic checks
  if (!student.is_active) return false;
  if (student.is_graduated) return false;
  
  // Check if student has a class level
  if (!student.class_level) return false;
  
  // Additional checks could include:
  // - Fee payment status
  // - Academic performance
  // - Attendance record
  
  return true;
};

/**
 * Generate student registration number
 * @param {string} prefix - School prefix (default: 'STU')
 * @param {number} year - Year (default: current year)
 * @param {number} sequence - Sequence number
 * @returns {string} Generated registration number
 */
export const generateRegistrationNumber = (prefix = 'STU', year = new Date().getFullYear(), sequence = 0) => {
  const seqStr = sequence.toString().padStart(4, '0');
  return `${prefix}${year}${seqStr}`;
};

/**
 * Generate admission number
 * @param {string} schoolCode - School code (default: 'CTS')
 * @param {number} year - Year (default: current year)
 * @param {number} sequence - Sequence number
 * @returns {string} Generated admission number
 */
export const generateAdmissionNumber = (schoolCode = 'CTS', year = new Date().getFullYear(), sequence = 0) => {
  const seqStr = sequence.toString().padStart(4, '0');
  return `${schoolCode}/${year}/${seqStr}`;
};

// =====================
// EXPORT ALL FUNCTIONS
// =====================

const studentUtils = {
  // Nigerian Data
  getNigerianStates,
  getNigerianTimezones,
  
  // Academic Options
  getStreamOptions,
  getStudentCategoryOptions,
  getHouseOptions,
  getClassLevelOptions,
  getTransportationOptions,
  
  // Health & Medical
  getBloodGroupOptions,
  getGenotypeOptions,
  
  // Financial
  getFeeStatusOptions,
  getPaymentMethodOptions,
  
  // Documents
  getDocumentTypeOptions,
  
  // Validation
  validateNigerianPhone,
  validateEmail,
  validatePassword,
  validateDateOfBirth,
  
  // Formatting
  formatPhone,
  formatNaira,
  formatDate,
  formatTime,
  
  // Status & Labels
  getFeeStatusInfo,
  getStudentStatusInfo,
  getStreamLabel,
  getAcademicLevel,
  
  // Calculations
  calculateFeeDetails,
  calculateAttendanceStats,
  calculateAge,
  
  // Helpers
  getInitials,
  getAvatarColor,
  canPromoteStudent,
  generateRegistrationNumber,
  generateAdmissionNumber,
  formatFee,
};

export default studentUtils;