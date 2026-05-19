// src/pages/staff/components/StaffCSVUtils.js

/**
 * Export staff data to CSV with password hashes
 * @param {Array} staff - List of staff members
 */
export const exportStaffToCSV = (staff) => {
  if (!staff || staff.length === 0) {
    alert('No staff data to export');
    return;
  }

  // Define headers
  const headers = [
    'S/N',
    'Staff ID',
    'Registration Number',
    'First Name',
    'Last Name',
    'Full Name',
    'Email',
    'Phone Number',
    'Gender',
    'Date of Birth',
    'Address',
    'City',
    'State of Origin',
    'LGA',
    'Nationality',
    'Role',
    'Department',
    'Position Title',
    'Employment Type',
    'Employment Date',
    'Highest Qualification',
    'Institution',
    'Year of Graduation',
    'Specialization',
    'TRCN Number',
    'Blood Group',
    'Genotype',
    'Emergency Contact Name',
    'Emergency Contact Phone',
    'Emergency Contact Relationship',
    'Next of Kin Name',
    'Next of Kin Relationship',
    'Next of Kin Phone',
    'Bank Name',
    'Account Name',
    'Account Number',
    'Basic Salary (₦)',
    'Salary Scale',
    'Salary Step',
    'Annual Leave Days',
    'Sick Leave Days',
    'Years of Experience',
    'Is Active',
    'Is On Leave',
    'Is Retired',
    'Status',
    'Password Hash'
  ];

  // Map staff to rows
  const rows = staff.map((staffMember, index) => {
    const user = staffMember.user || {};
    const fullName = user.full_name || `${user.first_name || ''} ${user.last_name || ''}`.trim();
    
    // Get role display
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

    // Get department display
    const departmentDisplay = {
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
    }[staffMember.department] || staffMember.department || 'Not Assigned';

    // Status
    let status = 'Active';
    if (!staffMember.is_active) status = 'Inactive';
    else if (staffMember.is_retired) status = 'Retired';
    else if (staffMember.is_on_leave) status = 'On Leave';

    return [
      index + 1,
      staffMember.staff_id || '',
      user.registration_number || '',
      user.first_name || '',
      user.last_name || '',
      fullName,
      user.email || '',
      user.phone_number || '',
      user.gender || '',
      user.date_of_birth || '',
      user.address || '',
      user.city || '',
      user.state_of_origin || '',
      user.lga || '',
      user.nationality || 'Nigerian',
      roleDisplay,
      departmentDisplay,
      staffMember.position_title || '',
      staffMember.employment_type || '',
      staffMember.employment_date || '',
      staffMember.highest_qualification || '',
      staffMember.qualification_institution || '',
      staffMember.year_of_graduation || '',
      staffMember.specialization || '',
      staffMember.trcn_number || '',
      staffMember.blood_group || '',
      staffMember.genotype || '',
      staffMember.emergency_contact_name || '',
      staffMember.emergency_contact_phone || '',
      staffMember.emergency_contact_relationship || '',
      staffMember.next_of_kin_name || '',
      staffMember.next_of_kin_relationship || '',
      staffMember.next_of_kin_phone || '',
      staffMember.bank_name || '',
      staffMember.account_name || '',
      staffMember.account_number || '',
      staffMember.basic_salary || '0',
      staffMember.salary_scale || '',
      staffMember.salary_step || '1',
      staffMember.annual_leave_days || '21',
      staffMember.sick_leave_days || '10',
      staffMember.years_of_experience || '0',
      staffMember.is_active ? 'Yes' : 'No',
      staffMember.is_on_leave ? 'Yes' : 'No',
      staffMember.is_retired ? 'Yes' : 'No',
      status,
      user.password || ''  // Include password hash
    ];
  });

  // Combine headers and rows
  const csvContent = [headers, ...rows].map(row => 
    row.map(cell => {
      // Escape quotes and wrap in quotes if contains comma or newline
      const stringCell = String(cell || '');
      if (stringCell.includes(',') || stringCell.includes('"') || stringCell.includes('\n')) {
        return `"${stringCell.replace(/"/g, '""')}"`;
      }
      return stringCell;
    }).join(',')
  ).join('\n');

  // Add UTF-8 BOM for proper encoding
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `staff_export_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Download CSV template for staff bulk upload
 */
// src/pages/staff/components/StaffCSVUtils.js - ADD this function

export const downloadStaffUploadTemplate = () => {
  const headers = [
    'first_name', 'last_name', 'email', 'phone_number', 'password',
    'gender', 'date_of_birth', 'address', 'city', 'state_of_origin',
    'lga', 'nationality', 'role', 'department', 'position_title',
    'employment_type', 'employment_date', 'highest_qualification',
    'qualification_institution', 'year_of_graduation', 'specialization',
    'trcn_number', 'blood_group', 'genotype', 'emergency_contact_name',
    'emergency_contact_phone', 'emergency_contact_relationship',
    'next_of_kin_name', 'next_of_kin_relationship', 'next_of_kin_phone',
    'bank_name', 'account_name', 'account_number', 'basic_salary',
    'salary_scale', 'salary_step', 'annual_leave_days', 'sick_leave_days',
    'years_of_experience', 'is_active'
  ];
  
  const exampleRow = [
    'John', 'Doe', 'john.doe@example.com', '08012345678', 'Staff@2024',
    'male', '1990-01-01', '123 Main St', 'Lagos', 'lagos',
    'Ikeja', 'Nigerian', 'teacher', 'academic', 'Mathematics Teacher',
    'full_time', '2024-01-01', 'B.Sc Education', 'University of Lagos',
    '2015', 'Mathematics', 'TRCN12345', 'O+', 'AA', 'Jane Doe',
    '08087654321', 'Spouse', 'Mike Doe', 'Brother', '08011223344',
    'First Bank', 'John Doe', '1234567890', '150000',
    'CONMESS 6', '1', '21', '10', '5', 'true'
  ];
  
  const csvContent = [headers, exampleRow].map(row => 
    row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
  ).join('\n');
  
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `staff_upload_template.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
};