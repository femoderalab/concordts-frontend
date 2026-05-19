// src/pages/parents/components/ParentCSVUtils.js - COMPLETE VERSION

export const exportParentsToCSV = (parents) => {
  if (!parents || parents.length === 0) {
    console.warn('No parents to export');
    alert('No parents found to export');
    return;
  }
  
  console.log(`📊 Exporting ${parents.length} parents to CSV...`);
  
  // Find maximum number of children across all parents
  let maxChildren = 0;
  parents.forEach(parent => {
    const childrenCount = parent.children?.length || 0;
    if (childrenCount > maxChildren) maxChildren = childrenCount;
  });
  
  // Build headers
  const headers = [
    // Parent Basic Information
    'parent_id', 'registration_number', 'first_name', 'last_name', 'full_name',
    'email', 'phone_number', 'password_hash', 'gender', 'date_of_birth',
    'address', 'city', 'state', 'lga', 'nationality',
    
    // Parent Profile Information
    'parent_type', 'occupation', 'employer', 'office_phone', 'marital_status',
    'emergency_contact_name', 'emergency_contact_phone', 'emergency_contact_relationship',
    'preferred_communication', 'is_pta_member', 'is_active', 'is_verified',
    
    // Children Information
    'total_children_count',
  ];
  
  // Add columns for each child (up to maxChildren)
  for (let i = 1; i <= Math.min(maxChildren, 10); i++) {
    headers.push(
      `child_${i}_id`, `child_${i}_name`, `child_${i}_admission_number`, 
      `child_${i}_student_id`, `child_${i}_registration_number`, 
      `child_${i}_class_level`, `child_${i}_class_level_id`,
      `child_${i}_gender`, `child_${i}_date_of_birth`,
      `child_${i}_is_active`, `child_${i}_is_graduated`,
      `child_${i}_fee_status`, `child_${i}_total_fee`, 
      `child_${i}_amount_paid`, `child_${i}_balance_due`
    );
  }
  
  // Build rows
  const rows = parents.map((parent) => {
    const user = parent.user || {};
    const children = parent.children || [];
    const childrenCount = children.length;
    
    const row = [
      parent.parent_id || '',
      user.registration_number || '',
      user.first_name || '',
      user.last_name || '',
      parent.full_name || `${user.first_name || ''} ${user.last_name || ''}`.trim(),
      user.email || '',
      user.phone_number || '',
      user.password || '',  // Include hashed password
      user.gender || '',
      user.date_of_birth || '',
      user.address || '',
      user.city || '',
      user.state_of_origin || '',
      user.lga || '',
      user.nationality || 'Nigerian',
      parent.parent_type || '',
      parent.occupation || '',
      parent.employer || '',
      parent.office_phone || '',
      parent.marital_status || '',
      parent.emergency_contact_name || '',
      parent.emergency_contact_phone || '',
      parent.emergency_contact_relationship || '',
      parent.preferred_communication || '',
      parent.is_pta_member ? 'Yes' : 'No',
      parent.is_active !== false ? 'Active' : 'Archived',
      parent.is_verified ? 'Yes' : 'No',
      childrenCount,
    ];
    
    // Add child data for each child
    for (let i = 0; i < Math.min(maxChildren, 10); i++) {
      if (i < children.length) {
        const child = children[i];
        const childUser = child.user || {};
        row.push(
          child.id || '',
          child.full_name || `${childUser.first_name || ''} ${childUser.last_name || ''}`.trim(),
          child.admission_number || '',
          child.student_id || '',
          childUser.registration_number || '',
          child.class_level?.name || '',
          child.class_level?.id || '',
          childUser.gender || '',
          childUser.date_of_birth || '',
          child.is_active ? 'Active' : 'Inactive',
          child.is_graduated ? 'Yes' : 'No',
          child.fee_status || '',
          parseFloat(child.total_fee_amount || 0),
          parseFloat(child.amount_paid || 0),
          parseFloat(child.balance_due || 0)
        );
      } else {
        // Empty values for missing children
        row.push('', '', '', '', '', '', '', '', '', '', '', '', 0, 0, 0);
      }
    }
    
    return row;
  });
  
  const csvContent = [headers, ...rows].map(row =>
    row.map(cell => {
      const stringCell = String(cell || '');
      if (stringCell.includes(',') || stringCell.includes('"') || stringCell.includes('\n')) {
        return `"${stringCell.replace(/"/g, '""')}"`;
      }
      return stringCell;
    }).join(',')
  ).join('\n');
  
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `parents_export_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
  
  console.log('✅ CSV export completed');
};

export const downloadParentBulkUploadTemplate = () => {
  const headers = [
    'first_name', 'last_name', 'email', 'phone_number', 'parent_type', 'gender',
    'date_of_birth', 'address', 'city', 'state_of_origin', 'lga', 'nationality',
    'occupation', 'employer', 'office_phone', 'marital_status', 'emergency_contact_name',
    'emergency_contact_phone', 'emergency_contact_relationship', 'preferred_communication',
    'is_pta_member', 'password', 'relationship_type',
    'children_admission_numbers', 'children_student_ids'
  ];
  
  const exampleRow = [
    'John', 'Doe', 'john.doe@example.com', '08012345678', 'father', 'male',
    '1980-01-01', '123 Main St', 'Lagos', 'lagos', 'Ikeja', 'Nigerian',
    'Engineer', 'Tech Corp', '08012345678', 'married', 'Jane Doe',
    '08087654321', 'Spouse', 'whatsapp', 'Yes', 'Parent@2024', 'father',
    'STU001;STU002;STU003', 'STD001;STD002;STD003'
  ];
  
  const csvContent = [headers, exampleRow].map(row =>
    row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
  ).join('\n');
  
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'parent_upload_template.csv';
  link.click();
  URL.revokeObjectURL(link.href);
};