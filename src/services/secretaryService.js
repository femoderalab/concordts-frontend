import api from './api';
import { getStudents, getStudentById } from './studentService';
import { getAllParents } from './parentService';

/**
 * Secretary Service - Comprehensive financial and student analytics
 */
export const getSecretaryDashboardStats = async () => {
  try {
    console.log('📊 Fetching secretary dashboard stats...');
    
    // Use the new financial analytics endpoint
    const response = await api.get('/students/api/financial-analytics/');
    
    if (response.data.success) {
      return response.data.analytics;
    }
    
    // Fallback: Calculate manually
    console.log('⚠️ Using fallback calculation...');
    return await getFallbackAnalytics();
    
  } catch (error) {
    console.error('❌ Error fetching secretary dashboard stats:', error);
    console.log('⚠️ Falling back to manual calculation...');
    return await getFallbackAnalytics();
  }
};

/**
 * Fallback analytics calculation
 */
const getFallbackAnalytics = async () => {
  try {
    // Get all students
    const studentsResponse = await getStudents({ limit: 1000 });
    const students = studentsResponse.results || studentsResponse || [];
    
    // Get all parents
    const parentsResponse = await getAllParents();
    const parents = parentsResponse.results || parentsResponse || [];
    
    // Initialize counters
    let totalRevenue = 0;
    let totalDebt = 0;
    let totalExpected = 0;
    let paidStudents = 0;
    let owingStudents = 0;
    let partialPaidStudents = 0;
    let scholarshipStudents = 0;
    let exemptedStudents = 0;
    
    // Document counters
    let missingDocuments = {
      birth_certificate: 0,
      student_image: 0,
      immunization_record: 0,
      previous_school_report: 0,
      parent_id_copy: 0
    };
    
    let completeDocumentsCount = 0;
    
    // Class distribution
    const classDistribution = {};
    
    // Top debtors
    const topDebtors = [];
    
    students.forEach(student => {
      // Financial calculations
      const totalFee = parseFloat(student.total_fee_amount) || 0;
      const amountPaid = parseFloat(student.amount_paid) || 0;
      const balance = totalFee - amountPaid;
      
      totalExpected += totalFee;
      totalRevenue += amountPaid;
      totalDebt += balance;
      
      // Count by fee status
      switch (student.fee_status) {
        case 'paid_full':
          paidStudents++;
          break;
        case 'paid_partial':
          partialPaidStudents++;
          owingStudents++;
          break;
        case 'not_paid':
          owingStudents++;
          break;
        case 'scholarship':
          scholarshipStudents++;
          break;
        case 'exempted':
          exemptedStudents++;
          break;
      }
      
      // Add to debtors list if has balance
      if (balance > 0) {
        topDebtors.push({
          id: student.id,
          name: `${student.user?.first_name || ''} ${student.user?.last_name || ''}`.trim() || 'Unknown',
          admission_number: student.admission_number || 'N/A',
          class_level: student.class_level_info?.name || student.class_level?.name || 'N/A',
          total_fee: totalFee,
          amount_paid: amountPaid,
          balance: balance,
          fee_status: student.fee_status || 'not_paid'
        });
      }
      
      // Document analysis
      const hasAllDocuments = student.student_image_url && 
                            student.birth_certificate_url && 
                            student.immunization_record_url &&
                            student.previous_school_report_url &&
                            student.parent_id_copy_url;
      
      if (hasAllDocuments) {
        completeDocumentsCount++;
      } else {
        if (!student.student_image_url) missingDocuments.student_image++;
        if (!student.birth_certificate_url) missingDocuments.birth_certificate++;
        if (!student.immunization_record_url) missingDocuments.immunization_record++;
        if (!student.previous_school_report_url) missingDocuments.previous_school_report++;
        if (!student.parent_id_copy_url) missingDocuments.parent_id_copy++;
      }
      
      // Class distribution
      const className = student.class_level_info?.name || 
                       student.class_level?.name || 
                       'Not Assigned';
      
      if (!classDistribution[className]) {
        classDistribution[className] = {
          count: 0,
          total_fee: 0,
          amount_paid: 0,
          balance: 0
        };
      }
      
      classDistribution[className].count++;
      classDistribution[className].total_fee += totalFee;
      classDistribution[className].amount_paid += amountPaid;
      classDistribution[className].balance += balance;
    });
    
    // Sort top debtors by highest balance
    topDebtors.sort((a, b) => b.balance - a.balance);
    
    // Convert class distribution to array
    const classDistributionArray = Object.entries(classDistribution)
      .map(([className, stats]) => ({
        class_name: className,
        ...stats
      }))
      .sort((a, b) => b.count - a.count);
    
    const totalStudents = students.length;
    const paymentRate = totalExpected > 0 ? (totalRevenue / totalExpected * 100) : 0;
    const debtPercentage = totalExpected > 0 ? (totalDebt / totalExpected * 100) : 0;
    const documentCompletionRate = totalStudents > 0 ? (completeDocumentsCount / totalStudents * 100) : 0;
    
    return {
      financial_summary: {
        total_revenue: totalRevenue,
        total_debt: totalDebt,
        total_expected: totalExpected,
        net_balance: totalRevenue - totalDebt,
        payment_rate: parseFloat(paymentRate.toFixed(2)),
        debt_percentage: parseFloat(debtPercentage.toFixed(2)),
        average_fee_per_student: totalStudents > 0 ? parseFloat((totalExpected / totalStudents).toFixed(2)) : 0
      },
      student_status: {
        total_students: totalStudents,
        students_with_debt: owingStudents,
        students_fully_paid: paidStudents,
        students_partial_paid: partialPaidStudents,
        students_not_paid: students.filter(s => s.fee_status === 'not_paid').length,
        scholarship_students: scholarshipStudents,
        exempted_students: exemptedStudents
      },
      fee_distribution: {
        paid_full: {
          count: paidStudents,
          total_amount_paid: totalRevenue,
          total_balance: 0
        },
        paid_partial: {
          count: partialPaidStudents,
          total_amount_paid: 0,
          total_balance: totalDebt
        },
        not_paid: {
          count: owingStudents - partialPaidStudents,
          total_amount_paid: 0,
          total_balance: totalDebt
        }
      },
      document_analysis: {
        total_with_complete_documents: completeDocumentsCount,
        total_without_complete_documents: totalStudents - completeDocumentsCount,
        completion_rate: parseFloat(documentCompletionRate.toFixed(2)),
        missing_documents: missingDocuments
      },
      class_distribution: classDistributionArray,
      top_debtors: topDebtors.slice(0, 10),
      recent_students: students.slice(0, 10).map(s => ({
        id: s.id,
        admission_number: s.admission_number,
        created_at: s.created_at,
        name: `${s.user?.first_name || ''} ${s.user?.last_name || ''}`.trim(),
        class_level: s.class_level_info?.name || s.class_level?.name,
        fee_status: s.fee_status
      }))
    };
    
  } catch (error) {
    console.error('❌ Error in fallback analytics:', error);
    return getDefaultAnalytics();
  }
};

/**
 * Default analytics structure
 */
const getDefaultAnalytics = () => {
  return {
    financial_summary: {
      total_revenue: 0,
      total_debt: 0,
      total_expected: 0,
      net_balance: 0,
      payment_rate: 0,
      debt_percentage: 0,
      average_fee_per_student: 0
    },
    student_status: {
      total_students: 0,
      students_with_debt: 0,
      students_fully_paid: 0,
      students_partial_paid: 0,
      students_not_paid: 0,
      scholarship_students: 0,
      exempted_students: 0
    },
    fee_distribution: {},
    document_analysis: {
      total_with_complete_documents: 0,
      total_without_complete_documents: 0,
      completion_rate: 0,
      missing_documents: {
        birth_certificate: 0,
        student_image: 0,
        immunization_record: 0,
        previous_school_report: 0,
        parent_id_copy: 0
      }
    },
    class_distribution: [],
    top_debtors: [],
    recent_students: []
  };
};

/**
 * Get detailed financial report
 */
export const getFinancialReport = async (startDate = null, endDate = null) => {
  try {
    console.log('💰 Fetching detailed financial report...');
    
    const params = {};
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;
    
    const response = await api.get('/finance/reports/detailed/', { params });
    return response.data;
    
  } catch (error) {
    console.error('❌ Error fetching financial report:', error);
    
    // Fallback calculation
    const stats = await getSecretaryDashboardStats();
    
    return {
      summary: {
        total_revenue: stats.financial_summary.total_revenue,
        total_expected: stats.financial_summary.total_expected,
        total_balance: stats.financial_summary.total_debt,
        payment_rate: stats.financial_summary.payment_rate
      },
      payments_by_date: {},
      payments_by_class: {},
      top_payers: [],
      top_debtors: stats.top_debtors || []
    };
  }
};

/**
 * Get students with outstanding payments
 */
export const getStudentsWithOutstandingPayments = async (limit = 20) => {
  try {
    console.log('📋 Fetching students with outstanding payments...');
    
    const response = await getStudents({
      limit: limit,
      fee_status: 'not_paid,paid_partial',
      ordering: '-balance_due'
    });
    
    const students = response.results || response || [];
    
    // Filter and enrich with debt details
    const studentsWithDebt = students
      .filter(student => {
        const totalFee = parseFloat(student.total_fee_amount) || 0;
        const amountPaid = parseFloat(student.amount_paid) || 0;
        return totalFee > amountPaid;
      })
      .map(student => {
        const totalFee = parseFloat(student.total_fee_amount) || 0;
        const amountPaid = parseFloat(student.amount_paid) || 0;
        const balance = totalFee - amountPaid;
        
        return {
          id: student.id,
          name: `${student.user?.first_name || ''} ${student.user?.last_name || ''}`.trim(),
          admission_number: student.admission_number || 'N/A',
          class_level: student.class_level_info?.name || student.class_level?.name || 'N/A',
          total_fee: totalFee,
          amount_paid: amountPaid,
          balance: balance,
          fee_status: student.fee_status || 'not_paid',
          days_overdue: calculateDaysOverdue(student.last_payment_date),
          parent_phone: student.user?.phone_number || 'N/A'
        };
      })
      .sort((a, b) => b.balance - a.balance);
    
    return studentsWithDebt.slice(0, limit);
    
  } catch (error) {
    console.error('❌ Error fetching students with outstanding payments:', error);
    return [];
  }
};

/**
 * Get document status analytics
 */
export const getDocumentAnalytics = async () => {
  try {
    console.log('📄 Fetching document analytics...');
    
    const response = await getStudents({ limit: 1000 });
    const students = response.results || response || [];
    
    const analytics = {
      total_students: students.length,
      complete_documents: 0,
      incomplete_documents: 0,
      missing_by_type: {
        student_image: 0,
        birth_certificate: 0,
        immunization_record: 0,
        previous_school_report: 0,
        parent_id_copy: 0
      },
      students_by_completion: []
    };
    
    students.forEach(student => {
      const hasAllDocs = student.student_image_url && 
                        student.birth_certificate_url && 
                        student.immunization_record_url &&
                        student.previous_school_report_url &&
                        student.parent_id_copy_url;
      
      if (hasAllDocs) {
        analytics.complete_documents++;
      } else {
        analytics.incomplete_documents++;
        
        if (!student.student_image_url) analytics.missing_by_type.student_image++;
        if (!student.birth_certificate_url) analytics.missing_by_type.birth_certificate++;
        if (!student.immunization_record_url) analytics.missing_by_type.immunization_record++;
        if (!student.previous_school_report_url) analytics.missing_by_type.previous_school_report++;
        if (!student.parent_id_copy_url) analytics.missing_by_type.parent_id_copy++;
      }
      
      analytics.students_by_completion.push({
        id: student.id,
        name: `${student.user?.first_name || ''} ${student.user?.last_name || ''}`.trim(),
        admission_number: student.admission_number,
        complete_documents: hasAllDocs ? 5 : 0,
        missing_documents: hasAllDocs ? 0 : 5
      });
    });
    
    analytics.completion_rate = analytics.total_students > 0 ? 
      (analytics.complete_documents / analytics.total_students * 100).toFixed(2) : 0;
    
    return analytics;
    
  } catch (error) {
    console.error('❌ Error fetching document analytics:', error);
    return getDefaultAnalytics().document_analysis;
  }
};

/**
 * Calculate days overdue
 */
const calculateDaysOverdue = (lastPaymentDate) => {
  if (!lastPaymentDate) return 0;
  
  try {
    const lastPayment = new Date(lastPaymentDate);
    const today = new Date();
    const diffTime = Math.abs(today - lastPayment);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  } catch (error) {
    return 0;
  }
};

/**
 * Export secretary service
 */
const secretaryService = {
  getSecretaryDashboardStats,
  getFinancialReport,
  getStudentsWithOutstandingPayments,
  getDocumentAnalytics
};

export default secretaryService;