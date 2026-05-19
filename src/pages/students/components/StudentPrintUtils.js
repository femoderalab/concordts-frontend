// src/pages/students/components/StudentPrintUtils.js
export const generateStudentPrintableHTML = (student) => {
  const user = student.user || {};
  const firstName = user.first_name || student.first_name || '';
  const lastName = user.last_name || student.last_name || '';
  const fullName = `${firstName} ${lastName}`.trim() || student.full_name || 'Unknown Student';
  const email = user.email || student.email || 'Not provided';
  const phone = user.phone_number || student.phone_number || 'Not provided';
  const gender = user.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : 'Not specified';
  const dateOfBirth = user.date_of_birth || student.date_of_birth || 'Not provided';
  const address = user.address || student.address || 'No address provided';
  const registrationNumber = user.registration_number || student.registration_number || 'Not available';
  
  // Calculate age
  const calculateAge = (dob) => {
    if (!dob) return 'Not specified';
    const birthDate = new Date(dob);
    const ageDifMs = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };
  const age = dateOfBirth !== 'Not provided' ? calculateAge(dateOfBirth) : 'Not specified';
  
  // Student academic info
  const classLevelName = student.class_level_info?.name || student.class_level?.name || 'Not assigned';
  const stream = student.stream === 'science' ? 'Science' :
                student.stream === 'commercial' ? 'Commercial' :
                student.stream === 'art' ? 'Arts/Humanities' :
                student.stream === 'technical' ? 'Technical' :
                student.stream === 'general' ? 'General' : 'Not Applicable';
  
  const house = student.house || 'None';
  const studentCategory = student.student_category === 'day' ? 'Day' :
                        student.student_category === 'boarding' ? 'Boarding' :
                        student.student_category === 'special_needs' ? 'Special Needs' :
                        student.student_category === 'scholarship' ? 'Scholarship' :
                        student.student_category === 'repeat' ? 'Repeating' : 'New Student';
  
  const admissionNumber = student.admission_number || 'N/A';
  const studentId = student.student_id || 'N/A';
  const admissionDate = student.admission_date || 'Not recorded';
  
  // Financial info
  const totalFee = student.total_fee_amount || 0;
  const amountPaid = student.amount_paid || 0;
  const balanceDue = totalFee - amountPaid;
  
  // Fee status
  const feeStatus = student.fee_status || 'not_paid';
  const feeStatusText = {
    'paid_full': 'Paid in Full',
    'paid_partial': 'Partially Paid',
    'not_paid': 'Not Paid',
    'scholarship': 'On Scholarship',
    'exempted': 'Fee Exempted'
  }[feeStatus] || 'Not Paid';
  
  // Health info
  const bloodGroup = student.blood_group || 'Not specified';
  const genotype = student.genotype || 'Not specified';
  const allergies = student.has_allergies ? 'Yes' : 'No';
  const allergyDetails = student.allergy_details || '';
  const vaccinations = student.has_received_vaccinations ? 'Complete' : 'Incomplete';
  const medicalConditions = student.medical_conditions || 'None reported';
  
  // Emergency contact
  const emergencyName = student.emergency_contact_name || 'Not provided';
  const emergencyPhone = student.emergency_contact_phone || 'Not provided';
  const emergencyRelation = student.emergency_contact_relationship || 'Not provided';
  
  // Transportation
  const transportMode = student.transportation_mode === 'school_bus' ? 'School Bus' :
                       student.transportation_mode === 'parent_drop' ? 'Parent Drop-off' :
                       student.transportation_mode === 'public_transport' ? 'Public Transport' :
                       student.transportation_mode === 'walk' ? 'Walks to School' : 'Other';
  const busRoute = student.bus_route || 'N/A';
  
  // Status
  const isActive = student.is_active ? 'Active' : 'Inactive';
  const isGraduated = student.is_graduated ? 'Yes' : 'No';
  
  // Image
  const imageUrl = student.student_image_url || null;
  
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${fullName} - Student Record</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Arial', sans-serif; line-height: 1.5; color: #333; background: white; padding: 20px; }
    .student-record { max-width: 210mm; margin: 0 auto; background: white; }
    .header { text-align: center; border-bottom: 3px solid #003366; padding-bottom: 15px; margin-bottom: 20px; }
    .school-name { font-size: 28px; font-weight: bold; color: #003366; margin-bottom: 5px; }
    .document-title { font-size: 18px; color: #666; margin-bottom: 5px; }
    .student-header { background: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 20px; display: flex; align-items: flex-start; border: 1px solid #e0e0e0; }
    .student-photo { width: 100px; height: 100px; border-radius: 10px; object-fit: cover; margin-right: 20px; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .student-photo-placeholder { width: 100px; height: 100px; border-radius: 10px; background: #e3f2fd; display: flex; align-items: center; justify-content: center; margin-right: 20px; font-size: 48px; font-weight: bold; color: #1976d2; }
    .student-name { font-size: 24px; font-weight: bold; color: #003366; margin-bottom: 10px; }
    .info-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 10px; }
    .section { margin-bottom: 25px; page-break-inside: avoid; }
    .section-title { font-size: 18px; font-weight: bold; color: #003366; margin-bottom: 15px; padding-bottom: 8px; border-bottom: 2px solid #e0e0e0; }
    .two-column { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
    .info-box { padding: 15px; border: 1px solid #e0e0e0; border-radius: 8px; background: #fff; }
    .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f5f5f5; }
    .financial-summary { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-top: 15px; }
    .financial-card { text-align: center; padding: 15px; border-radius: 8px; }
    .financial-card.total { background: #e3f2fd; }
    .financial-card.paid { background: #e8f5e9; }
    .financial-card.balance { background: #ffebee; }
    .footer { margin-top: 30px; padding-top: 20px; border-top: 2px solid #e0e0e0; text-align: center; font-size: 11px; color: #888; }
    @media print { body { padding: 0; } .student-record { max-width: 100%; } .section { page-break-inside: avoid; } }
  </style>
</head>
<body>
  <div class="student-record">
    <div class="header">
      <div class="school-name">CONCORD TUTOR SCHOOL</div>
      <div class="document-title">Complete Student Record</div>
    </div>
    
    <div class="student-header">
      ${imageUrl ? `<img src="${imageUrl}" alt="${fullName}" class="student-photo">` : `<div class="student-photo-placeholder">${fullName.charAt(0).toUpperCase()}</div>`}
      <div class="student-info">
        <div class="student-name">${fullName}</div>
        <div class="info-grid">
          <div><span class="info-label">Reg No:</span> ${registrationNumber}</div>
          <div><span class="info-label">Admission No:</span> ${admissionNumber}</div>
          <div><span class="info-label">Student ID:</span> ${studentId}</div>
        </div>
      </div>
    </div>
    
    <div class="section">
      <div class="section-title">Personal Information</div>
      <div class="two-column">
        <div class="info-box">
          <div class="info-row"><span>Full Name:</span><strong>${fullName}</strong></div>
          <div class="info-row"><span>Gender:</span>${gender}</div>
          <div class="info-row"><span>Date of Birth:</span>${dateOfBirth} (Age: ${age})</div>
        </div>
        <div class="info-box">
          <div class="info-row"><span>Email:</span>${email}</div>
          <div class="info-row"><span>Phone:</span>${phone}</div>
          <div class="info-row"><span>Address:</span>${address}</div>
        </div>
      </div>
    </div>
    
    <div class="section">
      <div class="section-title">Academic Information</div>
      <div class="two-column">
        <div class="info-box">
          <div class="info-row"><span>Class Level:</span><strong>${classLevelName}</strong></div>
          <div class="info-row"><span>Stream:</span>${stream}</div>
          <div class="info-row"><span>House:</span>${house}</div>
          <div class="info-row"><span>Category:</span>${studentCategory}</div>
        </div>
        <div class="info-box">
          <div class="info-row"><span>Admission Date:</span>${admissionDate}</div>
          <div class="info-row"><span>Previous School:</span>${student.previous_school || 'N/A'}</div>
          <div class="info-row"><span>Previous Class:</span>${student.previous_class || 'N/A'}</div>
        </div>
      </div>
    </div>
    
    <div class="section">
      <div class="section-title">Financial Information</div>
      <div class="financial-summary">
        <div class="financial-card total"><div>Total Fee</div><strong>₦${totalFee.toLocaleString()}</strong></div>
        <div class="financial-card paid"><div>Amount Paid</div><strong class="text-green">₦${amountPaid.toLocaleString()}</strong></div>
        <div class="financial-card balance"><div>Balance Due</div><strong class="text-red">₦${balanceDue.toLocaleString()}</strong></div>
      </div>
      <div class="info-box" style="margin-top:15px"><div class="info-row"><span>Fee Status:</span><strong>${feeStatusText}</strong></div></div>
    </div>
    
    <div class="section">
      <div class="section-title">Health Information</div>
      <div class="two-column">
        <div class="info-box">
          <div class="info-row"><span>Blood Group:</span>${bloodGroup}</div>
          <div class="info-row"><span>Genotype:</span>${genotype}</div>
          <div class="info-row"><span>Allergies:</span>${allergies}${allergies === 'Yes' && allergyDetails ? ` (${allergyDetails})` : ''}</div>
          <div class="info-row"><span>Vaccinations:</span>${vaccinations}</div>
        </div>
        <div class="info-box">
          <div class="info-row"><span>Medical Conditions:</span>${medicalConditions}</div>
          <div class="info-row"><span>Family Doctor:</span>${student.family_doctor_name || 'Not specified'}</div>
          <div class="info-row"><span>Doctor's Phone:</span>${student.family_doctor_phone || 'Not specified'}</div>
        </div>
      </div>
    </div>
    
    <div class="section">
      <div class="section-title">Emergency Contact</div>
      <div class="info-box">
        <div class="info-row"><span>Name:</span>${emergencyName}</div>
        <div class="info-row"><span>Relationship:</span>${emergencyRelation}</div>
        <div class="info-row"><span>Phone:</span>${emergencyPhone}</div>
      </div>
    </div>
    
    <div class="section">
      <div class="section-title">Transportation</div>
      <div class="info-box">
        <div class="info-row"><span>Mode:</span>${transportMode}</div>
        <div class="info-row"><span>Bus Route:</span>${busRoute}</div>
      </div>
    </div>
    
    ${student.is_prefect ? `<div class="section"><div class="section-title">Leadership</div><div class="info-box"><div class="info-row"><span>Prefect Role:</span>${student.prefect_role || 'Prefect'}</div></div></div>` : ''}
    
    <div class="footer">
      <p>Official student record from CONCORD TUTOR SCHOOL</p>
      <div>Generated on ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
    </div>
  </div>
</body>
</html>`;
};

export const printStudentRecord = (student) => {
  const printWindow = window.open('', '_blank');
  printWindow.document.write(generateStudentPrintableHTML(student));
  printWindow.document.close();
  printWindow.onload = () => printWindow.print();
};

// src/pages/students/components/StudentPrintUtils.js - FIXED

export const printAllStudents = (students) => {
  if (!students || students.length === 0) {
    console.warn('No students to print');
    alert('No students found to print');
    return;
  }
  
  console.log(`🖨️ Printing ${students.length} students...`);
  
  // Create combined HTML for all students
  let combinedHTML = `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>All Students Record - ${students.length} Students</title>
    <style>
      @page {
        size: A4;
        margin: 15mm;
      }
      @media print {
        body {
          margin: 0;
          padding: 0;
        }
        .student-card {
          page-break-after: always;
          page-break-inside: avoid;
        }
        .student-card:last-child {
          page-break-after: auto;
        }
      }
      body {
        font-family: 'Arial', sans-serif;
        background: white;
        padding: 20px;
      }
      .print-header {
        text-align: center;
        margin-bottom: 20px;
        padding-bottom: 10px;
        border-bottom: 2px solid #003366;
      }
      .print-header h1 {
        color: #003366;
        margin: 0;
        font-size: 24px;
      }
      .print-header p {
        color: #666;
        margin: 5px 0;
        font-size: 12px;
      }
      .student-card {
        margin-bottom: 30px;
        page-break-after: always;
      }
      .print-footer {
        text-align: center;
        margin-top: 20px;
        padding-top: 10px;
        border-top: 1px solid #ccc;
        font-size: 10px;
        color: #888;
      }
    </style>
  </head>
  <body>
    <div class="print-header">
      <h1>CONCORD TUTOR SCHOOL</h1>
      <p>Complete Student Records - ${students.length} Students</p>
      <p>Generated on: ${new Date().toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}</p>
    </div>
  `;
  
  // Add each student's record
  students.forEach((student, index) => {
    combinedHTML += `<div class="student-card">${generateStudentPrintableHTML(student)}</div>`;
    if (index < students.length - 1) {
      combinedHTML += '<div style="page-break-after: always;"></div>';
    }
  });
  
  combinedHTML += `
    <div class="print-footer">
      <p>Official Student Records - CONCORD TUTOR SCHOOL</p>
      <p>End of Report - ${students.length} Students</p>
    </div>
  </body></html>`;
  
  // FIXED: Use a new window with better error handling
  try {
    // Create a new window
    const printWindow = window.open('', '_blank');
    
    // Check if popup was blocked
    if (!printWindow) {
      alert('Please allow popups for this site to print. Your browser blocked the print window.');
      return;
    }
    
    // Write content to the window
    printWindow.document.write(combinedHTML);
    printWindow.document.close();
    
    // Wait for content to load before printing
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
      // Don't close automatically - let user close after printing
    };
    
    // Handle errors
    printWindow.onerror = (err) => {
      console.error('Print window error:', err);
      alert('An error occurred while trying to print. Please try again.');
    };
    
  } catch (error) {
    console.error('Error creating print window:', error);
    alert('Failed to open print window. Please check your browser settings and try again.');
  }
};

