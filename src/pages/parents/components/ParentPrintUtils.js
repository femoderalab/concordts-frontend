// src/pages/parents/components/ParentPrintUtils.js
export const generateParentPrintableHTML = (parent) => {
  const user = parent.user || {};
  const fullName = parent.full_name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Parent';
  const children = parent.children || [];

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${fullName} - Parent Record</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Arial', sans-serif; line-height: 1.5; color: #333; background: white; padding: 20px; }
    .parent-record { max-width: 210mm; margin: 0 auto; background: white; }
    .header { text-align: center; border-bottom: 3px solid #003366; padding-bottom: 15px; margin-bottom: 20px; }
    .school-name { font-size: 28px; font-weight: bold; color: #003366; margin-bottom: 5px; }
    .document-title { font-size: 18px; color: #666; margin-bottom: 5px; }
    .parent-header { background: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 20px; display: flex; align-items: flex-start; border: 1px solid #e0e0e0; }
    .parent-photo-placeholder { width: 100px; height: 100px; border-radius: 10px; background: #e3f2fd; display: flex; align-items: center; justify-content: center; margin-right: 20px; font-size: 48px; font-weight: bold; color: #1976d2; }
    .parent-name { font-size: 24px; font-weight: bold; color: #003366; margin-bottom: 10px; }
    .info-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 10px; }
    .section { margin-bottom: 25px; page-break-inside: avoid; }
    .section-title { font-size: 18px; font-weight: bold; color: #003366; margin-bottom: 15px; padding-bottom: 8px; border-bottom: 2px solid #e0e0e0; }
    .two-column { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
    .info-box { padding: 15px; border: 1px solid #e0e0e0; border-radius: 8px; background: #fff; }
    .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f5f5f5; }
    .children-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    .children-table th, .children-table td { padding: 10px; border: 1px solid #ddd; text-align: left; }
    .children-table th { background: #003366; color: white; }
    .footer { margin-top: 30px; padding-top: 20px; border-top: 2px solid #e0e0e0; text-align: center; font-size: 11px; color: #888; }
    @media print { body { padding: 0; } .parent-record { max-width: 100%; } .section { page-break-inside: avoid; } }
  </style>
</head>
<body>
  <div class="parent-record">
    <div class="header">
      <div class="school-name">CONCORD TUTOR SCHOOL</div>
      <div class="document-title">Complete Parent/Guardian Record</div>
    </div>
    
    <div class="parent-header">
      <div class="parent-photo-placeholder">${fullName.charAt(0).toUpperCase()}</div>
      <div class="parent-info">
        <div class="parent-name">${fullName}</div>
        <div class="info-grid">
          <div><span class="info-label">Parent ID:</span> ${parent.parent_id || 'N/A'}</div>
          <div><span class="info-label">Reg No:</span> ${user.registration_number || 'N/A'}</div>
          <div><span class="info-label">Type:</span> ${parent.parent_type || 'Not specified'}</div>
        </div>
      </div>
    </div>
    
    <div class="section">
      <div class="section-title">Personal Information</div>
      <div class="two-column">
        <div class="info-box">
          <div class="info-row"><span>Full Name:</span><strong>${fullName}</strong></div>
          <div class="info-row"><span>Email:</span>${user.email || parent.email || 'N/A'}</div>
          <div class="info-row"><span>Phone:</span>${user.phone_number || parent.phone || 'N/A'}</div>
          <div class="info-row"><span>Gender:</span>${user.gender || 'Not specified'}</div>
        </div>
        <div class="info-box">
          <div class="info-row"><span>Occupation:</span>${parent.occupation || 'Not specified'}</div>
          <div class="info-row"><span>Employer:</span>${parent.employer || 'Not specified'}</div>
          <div class="info-row"><span>Marital Status:</span>${parent.marital_status || 'Not specified'}</div>
          <div class="info-row"><span>PTA Member:</span>${parent.is_pta_member ? 'Yes' : 'No'}</div>
        </div>
      </div>
    </div>

    ${children.length > 0 ? `
    <div class="section">
      <div class="section-title">Children / Wards</div>
      <table class="children-table">
        <thead><tr><th>Name</th><th>Admission Number</th><th>Class</th><th>Status</th></tr></thead>
        <tbody>
          ${children.map(child => `
            <tr>
              <td>${child.full_name || child.name || 'Unknown'}</td>
              <td>${child.admission_number || 'N/A'}</td>
              <td>${child.class_level?.name || child.class_level_name || 'Not assigned'}</td>
              <td>${child.is_active !== false ? 'Active' : 'Archived'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    ` : ''}
    
    <div class="footer">
      <p>Official parent record from CONCORD TUTOR SCHOOL</p>
      <div>Generated on ${new Date().toLocaleDateString()}</div>
    </div>
  </div>
</body></html>`;
};

export const printParentRecord = (parent) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups for this site');
    return;
  }
  printWindow.document.write(generateParentPrintableHTML(parent));
  printWindow.document.close();
  printWindow.onload = () => printWindow.print();
};

export const printAllParents = (parents) => {
  if (!parents || parents.length === 0) {
    alert('No parents to print');
    return;
  }

  let combinedHTML = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>All Parents Record</title><style>
    @page { size: A4; margin: 15mm; }
    @media print { body { margin: 0; padding: 0; } .parent-card { page-break-after: always; } }
    body { font-family: 'Arial', sans-serif; padding: 20px; }
    .print-header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #003366; }
  </style></head><body>
  <div class="print-header"><h1>CONCORD TUTOR SCHOOL</h1><p>Complete Parent Records - ${parents.length} Parents</p></div>`;

  parents.forEach((parent, index) => {
    combinedHTML += `<div class="parent-card">${generateParentPrintableHTML(parent)}</div>`;
    if (index < parents.length - 1) combinedHTML += '<div style="page-break-after: always;"></div>';
  });

  combinedHTML += '</body></html>';
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(combinedHTML);
    printWindow.document.close();
    printWindow.onload = () => printWindow.print();
  } else {
    alert('Please allow popups for this site');
  }
};