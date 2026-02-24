/**
 * Utility functions for fee formatting and calculations
 */

/**
 * Format fee amount with currency
 * @param {number} amount - Fee amount
 * @param {string} currency - Currency symbol (default: '₦')
 * @returns {string} Formatted fee string
 */
export const formatFee = (amount, currency = '₦') => {
  if (amount === null || amount === undefined) {
    return `${currency}0.00`;
  }
  
  // Convert to number if it's a string
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  // Format with thousands separators
  return `${currency}${numAmount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
};

/**
 * Calculate fee summary from fee items
 * @param {Array} feeItems - Array of fee items
 * @returns {Object} Fee summary object
 */
export const calculateFeeSummary = (feeItems = []) => {
  const totalFee = feeItems.reduce((sum, item) => sum + (item.amount || 0), 0);
  const paid = feeItems.reduce((sum, item) => sum + (item.paid_amount || 0), 0);
  const balance = totalFee - paid;
  const percentagePaid = totalFee > 0 ? Math.round((paid / totalFee) * 100) : 0;

  return {
    totalFee,
    paid,
    balance,
    percentagePaid,
    feeItems
  };
};

/**
 * Get fee status based on payment percentage
 * @param {number} percentagePaid - Percentage of fee paid
 * @param {number} dueDate - Fee due date (optional)
 * @returns {string} Fee status
 */
export const getFeeStatus = (percentagePaid, dueDate = null) => {
  const now = new Date();
  
  // Check if overdue
  if (dueDate && new Date(dueDate) < now) {
    return 'overdue';
  }
  
  if (percentagePaid >= 100) {
    return 'paid';
  } else if (percentagePaid > 0) {
    return 'partial';
  } else {
    return 'unpaid';
  }
};

/**
 * Format due date for display
 * @param {string|Date} date - Due date
 * @returns {string} Formatted date string
 */
export const formatDueDate = (date) => {
  if (!date) return 'Not set';
  
  const dueDate = new Date(date);
  const now = new Date();
  const diffTime = dueDate - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    return `${Math.abs(diffDays)} days overdue`;
  } else if (diffDays === 0) {
    return 'Due today';
  } else if (diffDays === 1) {
    return 'Due tomorrow';
  } else {
    return `Due in ${diffDays} days`;
  }
};

/**
 * Generate fee breakdown items
 * @param {Array} feeItems - Array of fee items
 * @returns {Array} Formatted fee breakdown
 */
export const getFeeBreakdown = (feeItems = []) => {
  return feeItems.map(item => ({
    id: item.id,
    name: item.name,
    amount: item.amount,
    paid: item.paid_amount || 0,
    balance: (item.amount || 0) - (item.paid_amount || 0),
    dueDate: item.due_date,
    status: getFeeStatus(
      item.amount > 0 ? ((item.paid_amount || 0) / item.amount) * 100 : 0,
      item.due_date
    )
  }));
};

/**
 * Calculate upcoming fee due dates
 * @param {Array} feeItems - Array of fee items
 * @param {number} daysThreshold - Number of days to look ahead
 * @returns {Array} Upcoming due fees
 */
export const getUpcomingDueFees = (feeItems = [], daysThreshold = 30) => {
  const now = new Date();
  const futureDate = new Date();
  futureDate.setDate(now.getDate() + daysThreshold);
  
  return feeItems.filter(item => {
    if (!item.due_date || item.paid_amount >= item.amount) {
      return false;
    }
    
    const dueDate = new Date(item.due_date);
    return dueDate > now && dueDate <= futureDate;
  }).sort((a, b) => new Date(a.due_date) - new Date(b.due_date));
};