// src/pages/staff/components/StaffPrintUtils.js

/**
 * Generate printable HTML for a single staff member
 * @param {Object} staff - Staff member data
 * @returns {string} HTML content
 */
export const generateStaffPrintableHTML = (staff) => {
  const user = staff.user || {};
  const firstName = user.first_name || staff.first_name || '';
  const lastName = user.last_name || staff.last_name || '';
  const fullName = `${firstName} ${lastName}`.trim() || staff.full_name || 'Unknown Staff';
  const email = user.email || staff.email || 'Not provided';
  const phone = user.phone_number || staff.phone_number || 'Not provided';
  const gender = user.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : 'Not specified';
  const dateOfBirth = user.date_of_birth || staff.date_of_birth || 'Not provided';
  const address = user.address || staff.address || 'No address provided';
  const registrationNumber = user.registration_number || staff.registration_number || 'Not available';
  const staffId = staff.staff_id || 'Not available';
  
  // Staff info
  const department = {
    'administration': 'Administration',
    'academic': 'Academic',
    'finance': 'Finance',
    'library': 'Library',
    'laboratory': 'Laboratory',
    'ict': 'ICT',
    'security': 'Security',
    'maintenance': 'Maintenance',
    'transport': 'Transport',
    'health': 'Health',
    'counseling': 'Counseling',
    'sports': 'Sports',
    'kitchen': 'Kitchen',
    'none': 'Not Assigned'
  }[staff.department] || staff.department || 'Not Assigned';
  
  const positionTitle = staff.position_title || 'Not Specified';
  const employmentType = staff.employment_type || 'Full-Time';
  const employmentDate = staff.employment_date || 'Not recorded';
  
  // Calculate employment duration
  const calculateDuration = (date) => {
    if (!date) return 'Not specified';
    const start = new Date(date);
    const now = new Date();
    const years = now.getFullYear() - start.getFullYear();
    const months = now.getMonth() - start.getMonth();
    let totalMonths = years * 12 + months;
    if (now.getDate() < start.getDate()) totalMonths--;
    const finalYears = Math.floor(totalMonths / 12);
    const finalMonths = totalMonths % 12;
    return `${finalYears} years, ${finalMonths} months`;
  };
  const employmentDuration = employmentDate !== 'Not recorded' ? calculateDuration(employmentDate) : 'Not specified';
  
  // Qualifications
  const highestQualification = staff.highest_qualification || 'Not specified';
  const qualificationInstitution = staff.qualification_institution || 'Not specified';
  const yearOfGraduation = staff.year_of_graduation || 'Not specified';
  const specialization = staff.specialization || 'Not specified';
  
  // Salary
  const basicSalary = staff.basic_salary || 0;
  const salaryScale = staff.salary_scale || 'Not specified';
  const salaryStep = staff.salary_step || 'Not specified';
  
  // Health
  const bloodGroup = staff.blood_group || 'Not specified';
  const genotype = staff.genotype || 'Not specified';
  const medicalConditions = staff.medical_conditions || 'None';
  const allergies = staff.allergies || 'None';
  
  // Emergency Contact
  const emergencyName = staff.emergency_contact_name || 'Not provided';
  const emergencyPhone = staff.emergency_contact_phone || 'Not provided';
  const emergencyRelation = staff.emergency_contact_relationship || 'Not provided';
  
  // Next of Kin
  const nextOfKinName = staff.next_of_kin_name || 'Not provided';
  const nextOfKinRelation = staff.next_of_kin_relationship || 'Not provided';
  const nextOfKinPhone = staff.next_of_kin_phone || 'Not provided';
  
  // Bank Details
  const bankName = staff.bank_name || 'Not provided';
  const accountName = staff.account_name || 'Not provided';
  const accountNumber = staff.account_number || 'Not provided';
  
  // Leave
  const annualLeaveDays = staff.annual_leave_days || 21;
  const sickLeaveDays = staff.sick_leave_days || 10;
  const leaveDaysTaken = staff.leave_days_taken || 0;
  const leaveDaysRemaining = (annualLeaveDays - leaveDaysTaken);
  
  // Status
  const isActive = staff.is_active ? 'Active' : 'Inactive';
  const isOnLeave = staff.is_on_leave ? 'Yes' : 'No';
  const isRetired = staff.is_retired ? 'Yes' : 'No';
  
  // Role display
  const roleDisplay = {
    'head': 'Head of School',
    'hm': 'Head Master',
    'principal': 'Principal',
    'vice_principal': 'Vice Principal',
    'teacher': 'Teacher',
    'form_teacher': 'Form Teacher',
    'subject_teacher': 'Subject Teacher',
    'accountant': 'Accountant',
    'secretary': 'Secretary',
    'librarian': 'Librarian',
    'laboratory': 'Lab Technician',
    'security': 'Security',
    'cleaner': 'Cleaner'
  }[user.role] || user.role || 'Staff';
  
  // Image
  const imageUrl = staff.passport_photo || null;
  
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${fullName} - Staff Record</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Arial', sans-serif; line-height: 1.5; color: #333; background: white; padding: 20px; }
    .staff-record { max-width: 210mm; margin: 0 auto; background: white; }
    .header { text-align: center; border-bottom: 3px solid #003366; padding-bottom: 15px; margin-bottom: 20px; }
    .school-name { font-size: 28px; font-weight: bold; color: #003366; margin-bottom: 5px; }
    .document-title { font-size: 18px; color: #666; margin-bottom: 5px; }
    .staff-header { background: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 20px; display: flex; align-items: flex-start; border: 1px solid #e0e0e0; }
    .staff-photo { width: 100px; height: 100px; border-radius: 10px; object-fit: cover; margin-right: 20px; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .staff-photo-placeholder { width: 100px; height: 100px; border-radius: 10px; background: #e3f2fd; display: flex; align-items: center; justify-content: center; margin-right: 20px; font-size: 48px; font-weight: bold; color: #1976d2; }
    .staff-name { font-size: 24px; font-weight: bold; color: #003366; margin-bottom: 10px; }
    .info-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 10px; }
    .section { margin-bottom: 25px; page-break-inside: avoid; }
    .section-title { font-size: 18px; font-weight: bold; color: #003366; margin-bottom: 15px; padding-bottom: 8px; border-bottom: 2px solid #e0e0e0; }
    .two-column { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
    .info-box { padding: 15px; border: 1px solid #e0e0e0; border-radius: 8px; background: #fff; }
    .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f5f5f5; }
    .financial-summary { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-top: 15px; }
    .financial-card { text-align: center; padding: 15px; border-radius: 8px; }
    .financial-card.blue { background: #e3f2fd; }
    .financial-card.green { background: #e8f5e9; }
    .footer { margin-top: 30px; padding-top: 20px; border-top: 2px solid #e0e0e0; text-align: center; font-size: 11px; color: #888; }
    @media print { body { padding: 0; } .staff-record { max-width: 100%; } .section { page-break-inside: avoid; } }
  </style>
</head>
<body>
  <div class="staff-record">
    <div class="header">
      <div class="school-name">CONCORD TUTOR SCHOOL</div>
      <div class="document-title">Complete Staff Record</div>
    </div>
    
    <div class="staff-header">
      ${imageUrl ? `<img src="${imageUrl}" alt="${fullName}" class="staff-photo">` : `<div class="staff-photo-placeholder">${fullName.charAt(0).toUpperCase()}</div>`}
      <div class="staff-info">
        <div class="staff-name">${fullName}</div>
        <div class="info-grid">
          <div><span class="info-label">Staff ID:</span> ${staffId}</div>
          <div><span class="info-label">Reg No:</span> ${registrationNumber}</div>
          <div><span class="info-label">Role:</span> ${roleDisplay}</div>
        </div>
      </div>
    </div>
    
    <div class="section">
      <div class="section-title">Personal Information</div>
      <div class="two-column">
        <div class="info-box">
          <div class="info-row"><span>Full Name:</span><strong>${fullName}</strong></div>
          <div class="info-row"><span>Gender:</span>${gender}</div>
          <div class="info-row"><span>Date of Birth:</span>${dateOfBirth}</div>
        </div>
        <div class="info-box">
          <div class="info-row"><span>Email:</span>${email}</div>
          <div class="info-row"><span>Phone:</span>${phone}</div>
          <div class="info-row"><span>Address:</span>${address}</div>
        </div>
      </div>
    </div>
    
    <div class="section">
      <div class="section-title">Employment Information</div>
      <div class="two-column">
        <div class="info-box">
          <div class="info-row"><span>Staff ID:</span>${staffId}</div>
          <div class="info-row"><span>Department:</span>${department}</div>
          <div class="info-row"><span>Position:</span>${positionTitle}</div>
          <div class="info-row"><span>Role:</span>${roleDisplay}</div>
        </div>
        <div class="info-box">
          <div class="info-row"><span>Employment Type:</span>${employmentType}</div>
          <div class="info-row"><span>Employment Date:</span>${employmentDate}</div>
          <div class="info-row"><span>Duration:</span>${employmentDuration}</div>
          <div class="info-row"><span>Status:</span>${isActive}</div>
        </div>
      </div>
    </div>
    
    <div class="section">
      <div class="section-title">Qualifications</div>
      <div class="info-box">
        <div class="info-row"><span>Highest Qualification:</span>${highestQualification}</div>
        <div class="info-row"><span>Institution:</span>${qualificationInstitution}</div>
        <div class="info-row"><span>Year of Graduation:</span>${yearOfGraduation}</div>
        <div class="info-row"><span>Specialization:</span>${specialization}</div>
      </div>
    </div>
    
    <div class="section">
      <div class="section-title">Salary Information</div>
      <div class="financial-summary">
        <div class="financial-card blue"><div>Basic Salary</div><strong>₦${parseFloat(basicSalary).toLocaleString()}</strong></div>
        <div class="financial-card blue"><div>Salary Scale</div><strong>${salaryScale}</strong></div>
        <div class="financial-card blue"><div>Salary Step</div><strong>${salaryStep}</strong></div>
      </div>
    </div>
    
    <div class="section">
      <div class="section-title">Bank Information</div>
      <div class="info-box">
        <div class="info-row"><span>Bank Name:</span>${bankName}</div>
        <div class="info-row"><span>Account Name:</span>${accountName}</div>
        <div class="info-row"><span>Account Number:</span>${accountNumber}</div>
      </div>
    </div>
    
    <div class="section">
      <div class="section-title">Health Information</div>
      <div class="two-column">
        <div class="info-box">
          <div class="info-row"><span>Blood Group:</span>${bloodGroup}</div>
          <div class="info-row"><span>Genotype:</span>${genotype}</div>
          <div class="info-row"><span>Medical Conditions:</span>${medicalConditions}</div>
          <div class="info-row"><span>Allergies:</span>${allergies}</div>
        </div>
        <div class="info-box">
          <div class="info-row"><span>Emergency Contact:</span>${emergencyName}</div>
          <div class="info-row"><span>Relationship:</span>${emergencyRelation}</div>
          <div class="info-row"><span>Phone:</span>${emergencyPhone}</div>
        </div>
      </div>
    </div>
    
    <div class="section">
      <div class="section-title">Next of Kin</div>
      <div class="info-box">
        <div class="info-row"><span>Name:</span>${nextOfKinName}</div>
        <div class="info-row"><span>Relationship:</span>${nextOfKinRelation}</div>
        <div class="info-row"><span>Phone:</span>${nextOfKinPhone}</div>
      </div>
    </div>
    
    <div class="section">
      <div class="section-title">Leave Information</div>
      <div class="two-column">
        <div class="info-box">
          <div class="info-row"><span>Annual Leave:</span>${annualLeaveDays} days</div>
          <div class="info-row"><span>Sick Leave:</span>${sickLeaveDays} days</div>
        </div>
        <div class="info-box">
          <div class="info-row"><span>Days Taken:</span>${leaveDaysTaken} days</div>
          <div class="info-row"><span>Days Remaining:</span>${leaveDaysRemaining} days</div>
        </div>
      </div>
    </div>
    
    <div class="footer">
      <p>Official staff record from CONCORD TUTOR SCHOOL</p>
      <div>Generated on ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
    </div>
  </div>
</body>
</html>`;
};

/**
 * Print a single staff record
 * @param {Object} staff - Staff member
 */
export const printStaffRecord = (staff) => {
  if (!staff) {
    console.warn('No staff data provided for printing');
    alert('No staff data found to print');
    return;
  }
  
  try {
    const printWindow = window.open('', '_blank');
    
    if (!printWindow) {
      alert('Please allow popups for this site to print. Your browser blocked the print window.');
      return;
    }
    
    printWindow.document.write(generateStaffPrintableHTML(staff));
    printWindow.document.close();
    
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
    };
    
  } catch (error) {
    console.error('Error printing staff:', error);
    alert('Failed to open print window. Please try again.');
  }
};

/**
 * Print all staff members
 * @param {Array} staff - List of staff members
 */
export const printAllStaff = (staff) => {
  if (!staff || staff.length === 0) {
    console.warn('No staff to print');
    alert('No staff found to print');
    return;
  }
  
  console.log(`🖨️ Printing ${staff.length} staff members...`);
  
  // Create combined HTML for all staff
  let combinedHTML = `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>All Staff Records - ${staff.length} Staff</title>
    <style>
      @page { size: A4; margin: 15mm; }
      @media print { body { margin: 0; padding: 0; } .staff-card { page-break-after: always; } }
      body { font-family: 'Arial', sans-serif; background: white; padding: 20px; }
      .print-header { text-align: center; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 2px solid #003366; }
      .print-header h1 { color: #003366; margin: 0; font-size: 24px; }
      .print-header p { color: #666; margin: 5px 0; font-size: 12px; }
      .staff-card { margin-bottom: 30px; page-break-after: always; }
    </style>
  </head>
  <body>
    <div class="print-header">
      <h1>CONCORD TUTOR SCHOOL</h1>
      <p>Complete Staff Records - ${staff.length} Staff Members</p>
      <p>Generated on: ${new Date().toLocaleDateString('en-US', { 
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
      })}</p>
    </div>
  `;
  
  staff.forEach((member, index) => {
    combinedHTML += `<div class="staff-card">${generateStaffPrintableHTML(member)}</div>`;
    if (index < staff.length - 1) {
      combinedHTML += '<div style="page-break-after: always;"></div>';
    }
  });
  
  combinedHTML += `
    <div class="print-footer" style="text-align: center; margin-top: 20px; padding-top: 10px; border-top: 1px solid #ccc; font-size: 10px; color: #888;">
      <p>Official Staff Records - CONCORD TUTOR SCHOOL</p>
      <p>End of Report - ${staff.length} Staff</p>
    </div>
  </body></html>`;
  
  const printWindow = window.open('', '_blank');
  printWindow.document.write(combinedHTML);
  printWindow.document.close();
  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
  };
};