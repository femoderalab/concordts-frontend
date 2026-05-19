// src/pages/students/components/StudentCSVUtils.js
export const exportStudentsToCSV = (students) => {
  // Define headers
  const headers = [
    'S/N',
    'Full Name',
    'First Name',
    'Last Name',
    'Admission Number',
    'Student ID',
    'Registration Number',
    'Email',
    'Phone Number',
    'Gender',
    'Class Level',
    'Stream',
    'House',
    'Student Category',
    'Admission Date',
    'Fee Status',
    'Total Fee (₦)',
    'Amount Paid (₦)',
    'Balance Due (₦)',
    'Blood Group',
    'Genotype',
    'Has Allergies',
    'Medical Conditions',
    'Emergency Contact Name',
    'Emergency Contact Phone',
    'Emergency Contact Relationship',
    'Transportation Mode',
    'Bus Route',
    'Is Active',
    'Is Graduated',
    'Status'
  ];

  // Map students to rows
  const rows = students.map((student, index) => {
    const firstName = student.first_name || student.user?.first_name || '';
    const lastName = student.last_name || student.user?.last_name || '';
    const fullName = `${firstName} ${lastName}`.trim();
    const totalFee = student.total_fee_amount || 0;
    const amountPaid = student.amount_paid || 0;
    const balanceDue = totalFee - amountPaid;
    
    return [
      index + 1,
      fullName,
      firstName,
      lastName,
      student.admission_number || '',
      student.student_id || '',
      student.user?.registration_number || '',
      student.user?.email || '',
      student.user?.phone_number || '',
      student.user?.gender || '',
      student.class_level_name || student.class_level?.name || '',
      student.stream || '',
      student.house || '',
      student.student_category || '',
      student.admission_date || '',
      student.fee_status || '',
      totalFee,
      amountPaid,
      balanceDue,
      student.blood_group || '',
      student.genotype || '',
      student.has_allergies ? 'Yes' : 'No',
      student.medical_conditions || '',
      student.emergency_contact_name || '',
      student.emergency_contact_phone || '',
      student.emergency_contact_relationship || '',
      student.transportation_mode || '',
      student.bus_route || '',
      student.is_active ? 'Active' : 'Inactive',
      student.is_graduated ? 'Yes' : 'No',
      !student.is_active ? 'Archived' : (student.is_graduated ? 'Graduated' : 'Active')
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
  link.setAttribute('download', `students_export_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};