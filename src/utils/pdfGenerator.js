import jsPDF from 'jspdf';
import 'jspdf-autotable';

/**
 * Generate PDF for student record
 * @param {Object} studentData - Student information
 * @param {string} schoolName - School name for header
 */
export const generateStudentPDF = (studentData, schoolName = "School Management System") => {
  try {
    // Create new PDF document
    const doc = new jsPDF();
    
    // Get current date
    const currentDate = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    // Set font
    doc.setFont('helvetica', 'normal');
    
    // School Header
    doc.setFontSize(18);
    doc.setTextColor(43, 47, 131); // Royal blue
    doc.text(schoolName, doc.internal.pageSize.width / 2, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text('Student Academic Record', doc.internal.pageSize.width / 2, 30, { align: 'center' });
    
    doc.setFontSize(10);
    doc.text(`Generated on: ${currentDate}`, doc.internal.pageSize.width / 2, 37, { align: 'center' });
    
    // Student Information Header
    doc.setFontSize(14);
    doc.setTextColor(43, 47, 131);
    doc.text('STUDENT INFORMATION', 20, 50);
    
    // Draw line
    doc.setDrawColor(43, 47, 131);
    doc.setLineWidth(0.5);
    doc.line(20, 52, 190, 52);
    
    // Student Basic Info Table
    const basicInfo = [
      ['Full Name:', `${studentData.student?.user?.first_name || ''} ${studentData.student?.user?.last_name || ''}`],
      ['Admission Number:', studentData.student?.admission_number || 'N/A'],
      ['Student ID:', studentData.student?.student_id || 'N/A'],
      ['Date of Birth:', studentData.student?.user?.date_of_birth || 'N/A'],
      ['Gender:', studentData.student?.user?.gender ? studentData.student.user.gender.charAt(0).toUpperCase() + studentData.student.user.gender.slice(1) : 'N/A'],
      ['Email:', studentData.student?.user?.email || 'N/A'],
      ['Phone:', studentData.student?.user?.phone_number || 'N/A']
    ];
    
    doc.autoTable({
      startY: 58,
      head: [['Field', 'Information']],
      body: basicInfo,
      theme: 'grid',
      headStyles: { fillColor: [43, 47, 131], textColor: [255, 255, 255] },
      styles: { fontSize: 10, cellPadding: 3 },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 50 },
        1: { cellWidth: 120 }
      }
    });
    
    // Academic Information
    let finalY = doc.lastAutoTable.finalY + 15;
    
    doc.setFontSize(14);
    doc.setTextColor(43, 47, 131);
    doc.text('ACADEMIC INFORMATION', 20, finalY);
    doc.line(20, finalY + 2, 190, finalY + 2);
    
    const academicInfo = [
      ['Class Level:', studentData.student?.class_level_info?.name || studentData.student?.class_level?.name || 'N/A'],
      ['Stream:', formatStream(studentData.student?.stream)],
      ['House:', studentData.student?.house || 'N/A'],
      ['Student Category:', formatCategory(studentData.student?.student_category)],
      ['Admission Date:', studentData.student?.admission_date || 'N/A'],
      ['Previous School:', studentData.student?.previous_school || 'N/A'],
      ['Previous Class:', studentData.student?.previous_class || 'N/A']
    ];
    
    doc.autoTable({
      startY: finalY + 8,
      head: [['Academic Details', 'Information']],
      body: academicInfo,
      theme: 'grid',
      headStyles: { fillColor: [43, 47, 131], textColor: [255, 255, 255] },
      styles: { fontSize: 10, cellPadding: 3 },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 50 },
        1: { cellWidth: 120 }
      }
    });
    
    // Financial Information
    finalY = doc.lastAutoTable.finalY + 15;
    
    doc.setFontSize(14);
    doc.setTextColor(43, 47, 131);
    doc.text('FINANCIAL INFORMATION', 20, finalY);
    doc.line(20, finalY + 2, 190, finalY + 2);
    
    const totalFee = studentData.student?.total_fee_amount || 0;
    const amountPaid = studentData.student?.amount_paid || 0;
    const balanceDue = studentData.student?.balance_due || totalFee - amountPaid;
    
    const financialInfo = [
      ['Fee Status:', formatFeeStatus(studentData.student?.fee_status)],
      ['Total Fee Amount:', `₦${totalFee.toLocaleString()}`],
      ['Amount Paid:', `₦${amountPaid.toLocaleString()}`],
      ['Balance Due:', `₦${balanceDue.toLocaleString()}`]
    ];
    
    doc.autoTable({
      startY: finalY + 8,
      head: [['Financial Details', 'Information']],
      body: financialInfo,
      theme: 'grid',
      headStyles: { fillColor: [43, 47, 131], textColor: [255, 255, 255] },
      styles: { fontSize: 10, cellPadding: 3 },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 50 },
        1: { cellWidth: 120 }
      }
    });
    
    // Health Information
    finalY = doc.lastAutoTable.finalY + 15;
    
    doc.setFontSize(14);
    doc.setTextColor(43, 47, 131);
    doc.text('HEALTH INFORMATION', 20, finalY);
    doc.line(20, finalY + 2, 190, finalY + 2);
    
    const healthInfo = [
      ['Blood Group:', studentData.student?.blood_group || 'N/A'],
      ['Genotype:', studentData.student?.genotype || 'N/A'],
      ['Allergies:', studentData.student?.has_allergies ? 'Yes' : 'No'],
      ['Allergy Details:', studentData.student?.allergy_details || 'None'],
      ['Medical Conditions:', studentData.student?.medical_conditions || 'None']
    ];
    
    doc.autoTable({
      startY: finalY + 8,
      head: [['Health Details', 'Information']],
      body: healthInfo,
      theme: 'grid',
      headStyles: { fillColor: [43, 47, 131], textColor: [255, 255, 255] },
      styles: { fontSize: 10, cellPadding: 3 },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 50 },
        1: { cellWidth: 120 }
      }
    });
    
    // Emergency Contact
    finalY = doc.lastAutoTable.finalY + 15;
    
    doc.setFontSize(14);
    doc.setTextColor(43, 47, 131);
    doc.text('EMERGENCY CONTACT', 20, finalY);
    doc.line(20, finalY + 2, 190, finalY + 2);
    
    const emergencyInfo = [
      ['Contact Name:', studentData.student?.emergency_contact_name || 'N/A'],
      ['Contact Phone:', studentData.student?.emergency_contact_phone || 'N/A'],
      ['Relationship:', studentData.student?.emergency_contact_relationship || 'N/A']
    ];
    
    doc.autoTable({
      startY: finalY + 8,
      head: [['Emergency Contact', 'Details']],
      body: emergencyInfo,
      theme: 'grid',
      headStyles: { fillColor: [43, 47, 131], textColor: [255, 255, 255] },
      styles: { fontSize: 10, cellPadding: 3 },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 50 },
        1: { cellWidth: 120 }
      }
    });
    
    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, { align: 'center' });
      doc.text('Confidential Document - School Management System', doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 5, { align: 'center' });
    }
    
    // Save the PDF
    const fileName = `student_record_${studentData.student?.admission_number || studentData.student?.id || 'student'}_${new Date().getTime()}.pdf`;
    doc.save(fileName);
    
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    return false;
  }
};

/**
 * Format stream for display
 */
const formatStream = (stream) => {
  if (!stream || stream === 'none') return 'General';
  return stream.charAt(0).toUpperCase() + stream.slice(1);
};

/**
 * Format category for display
 */
const formatCategory = (category) => {
  if (!category) return 'Regular';
  const categories = {
    'day': 'Day Student',
    'boarding': 'Boarding Student',
    'special_needs': 'Special Needs',
    'scholarship': 'Scholarship',
    'repeat': 'Repeating Student',
    'new': 'New Student'
  };
  return categories[category] || category;
};

/**
 * Format fee status for display
 */
const formatFeeStatus = (status) => {
  if (!status) return 'Not Paid';
  const statusMap = {
    'paid_full': 'Paid in Full',
    'paid_partial': 'Partially Paid',
    'not_paid': 'Not Paid',
    'scholarship': 'Scholarship',
    'exempted': 'Fee Exempted'
  };
  return statusMap[status] || status;
};

/**
 * Simple PDF generator without external dependencies (fallback)
 */
export const generateSimpleStudentPDF = (studentData) => {
  try {
    // Create HTML content for printing
    const content = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Student Record - ${studentData.student?.user?.first_name || ''} ${studentData.student?.user?.last_name || ''}</title>
        <style>
          @media print {
            body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
            .no-print { display: none !important; }
          }
          @page { margin: 20mm; }
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .header { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #2b2f83; }
          .header h1 { color: #2b2f83; margin: 0; font-size: 24px; }
          .header p { color: #666; margin: 5px 0; }
          .section { margin-bottom: 25px; page-break-inside: avoid; }
          .section-title { background: #f3f4f6; padding: 8px 12px; border-left: 4px solid #2b2f83; margin-bottom: 15px; font-weight: bold; color: #2b2f83; }
          .info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; }
          .info-item { margin-bottom: 10px; }
          .info-label { font-weight: bold; color: #555; display: inline-block; width: 180px; }
          .badge { display: inline-block; padding: 2px 10px; border-radius: 12px; font-size: 12px; font-weight: bold; }
          .badge.active { background: #d1fae5; color: #065f46; }
          .badge.inactive { background: #fee2e2; color: #991b1b; }
          .badge.paid { background: #d1fae5; color: #065f46; }
          .badge.unpaid { background: #fee2e2; color: #991b1b; }
          .badge.partial { background: #fef3c7; color: #92400e; }
          .financial-summary { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-top: 20px; }
          .financial-item { text-align: center; padding: 15px; border-radius: 8px; }
          .financial-item.total { background: #eff6ff; border: 1px solid #bfdbfe; }
          .financial-item.paid { background: #f0fdf4; border: 1px solid #bbf7d0; }
          .financial-item.balance { background: #fef2f2; border: 1px solid #fecaca; }
          .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px; }
          table { width: 100%; border-collapse: collapse; margin: 15px 0; }
          th { background: #2b2f83; color: white; padding: 10px; text-align: left; }
          td { padding: 10px; border-bottom: 1px solid #ddd; }
          tr:nth-child(even) { background: #f9fafb; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>School Management System</h1>
          <p>Student Academic Record</p>
          <p>Generated on: ${new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</p>
        </div>
        
        <div class="section">
          <div class="section-title">Student Information</div>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Full Name:</span>
              ${studentData.student?.user?.first_name || ''} ${studentData.student?.user?.last_name || ''}
            </div>
            <div class="info-item">
              <span class="info-label">Admission Number:</span>
              ${studentData.student?.admission_number || 'N/A'}
            </div>
            <div class="info-item">
              <span class="info-label">Student ID:</span>
              ${studentData.student?.student_id || 'N/A'}
            </div>
            <div class="info-item">
              <span class="info-label">Date of Birth:</span>
              ${studentData.student?.user?.date_of_birth || 'N/A'}
            </div>
            <div class="info-item">
              <span class="info-label">Gender:</span>
              ${studentData.student?.user?.gender ? studentData.student.user.gender.charAt(0).toUpperCase() + studentData.student.user.gender.slice(1) : 'N/A'}
            </div>
            <div class="info-item">
              <span class="info-label">Email:</span>
              ${studentData.student?.user?.email || 'N/A'}
            </div>
            <div class="info-item">
              <span class="info-label">Phone:</span>
              ${studentData.student?.user?.phone_number || 'N/A'}
            </div>
            <div class="info-item">
              <span class="info-label">Address:</span>
              ${studentData.student?.user?.address || 'N/A'}
            </div>
          </div>
        </div>
        
        <div class="section">
          <div class="section-title">Academic Information</div>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Class Level:</span>
              ${studentData.student?.class_level_info?.name || studentData.student?.class_level?.name || 'N/A'}
            </div>
            <div class="info-item">
              <span class="info-label">Stream:</span>
              ${formatStream(studentData.student?.stream)}
            </div>
            <div class="info-item">
              <span class="info-label">House:</span>
              ${studentData.student?.house || 'N/A'}
            </div>
            <div class="info-item">
              <span class="info-label">Student Category:</span>
              ${formatCategory(studentData.student?.student_category)}
            </div>
            <div class="info-item">
              <span class="info-label">Admission Date:</span>
              ${studentData.student?.admission_date || 'N/A'}
            </div>
            <div class="info-item">
              <span class="info-label">Status:</span>
              ${studentData.student?.is_active ? '<span class="badge active">Active</span>' : '<span class="badge inactive">Inactive</span>'}
              ${studentData.student?.is_graduated ? '<span class="badge active">Graduated</span>' : ''}
            </div>
          </div>
        </div>
        
        <div class="section">
          <div class="section-title">Financial Information</div>
          <div class="financial-summary">
            <div class="financial-item total">
              <div class="info-label">Total Fee</div>
              <div style="font-size: 18px; font-weight: bold; margin-top: 5px;">
                ₦${(studentData.student?.total_fee_amount || 0).toLocaleString()}
              </div>
            </div>
            <div class="financial-item paid">
              <div class="info-label">Amount Paid</div>
              <div style="font-size: 18px; font-weight: bold; color: #065f46; margin-top: 5px;">
                ₦${(studentData.student?.amount_paid || 0).toLocaleString()}
              </div>
            </div>
            <div class="financial-item balance">
              <div class="info-label">Balance Due</div>
              <div style="font-size: 18px; font-weight: bold; color: #991b1b; margin-top: 5px;">
                ₦${(studentData.student?.balance_due || 0).toLocaleString()}
              </div>
            </div>
          </div>
          <div class="info-item" style="margin-top: 20px;">
            <span class="info-label">Fee Status:</span>
            ${formatFeeStatusBadge(studentData.student?.fee_status)}
          </div>
        </div>
        
        <div class="section">
          <div class="section-title">Health Information</div>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Blood Group:</span>
              ${studentData.student?.blood_group || 'N/A'}
            </div>
            <div class="info-item">
              <span class="info-label">Genotype:</span>
              ${studentData.student?.genotype || 'N/A'}
            </div>
            <div class="info-item">
              <span class="info-label">Allergies:</span>
              ${studentData.student?.has_allergies ? 'Yes' : 'No'}
            </div>
            <div class="info-item">
              <span class="info-label">Medical Conditions:</span>
              ${studentData.student?.medical_conditions || 'None'}
            </div>
          </div>
        </div>
        
        <div class="footer">
          <p>Confidential Student Record - For Official Use Only</p>
          <p>© ${new Date().getFullYear()} School Management System</p>
        </div>
        
        <script>
          // Helper functions for formatting
          function formatStream(stream) {
            if (!stream || stream === 'none') return 'General';
            return stream.charAt(0).toUpperCase() + stream.slice(1);
          }
          
          function formatCategory(category) {
            if (!category) return 'Regular';
            const categories = {
              'day': 'Day Student',
              'boarding': 'Boarding Student',
              'special_needs': 'Special Needs',
              'scholarship': 'Scholarship',
              'repeat': 'Repeating Student',
              'new': 'New Student'
            };
            return categories[category] || category;
          }
          
          function formatFeeStatusBadge(status) {
            if (!status) return '<span class="badge unpaid">Not Paid</span>';
            const statusMap = {
              'paid_full': '<span class="badge paid">Paid in Full</span>',
              'paid_partial': '<span class="badge partial">Partially Paid</span>',
              'not_paid': '<span class="badge unpaid">Not Paid</span>',
              'scholarship': '<span class="badge paid">Scholarship</span>',
              'exempted': '<span class="badge paid">Fee Exempted</span>'
            };
            return statusMap[status] || '<span class="badge unpaid">Not Paid</span>';
          }
        </script>
      </body>
      </html>
    `;
    
    // Open print dialog
    const printWindow = window.open('', '_blank');
    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.focus();
    
    // Auto print after a delay
    setTimeout(() => {
      printWindow.print();
      // Optional: close window after printing
      // printWindow.close();
    }, 250);
    
    return true;
  } catch (error) {
    console.error('Error in simple PDF generator:', error);
    return false;
  }
};