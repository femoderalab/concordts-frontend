/**
 * useStudents Hook
 * Custom hook for student management
 */

import { useState, useEffect, useCallback } from 'react';
import { studentService } from '../services/studentService';

export const useStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
    total: 0,
    totalPages: 0,
  });

  /**
   * Fetch students with filters
   */
  const fetchStudents = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await studentService.getStudents({
        ...filters,
        page: pagination.page,
        page_size: pagination.pageSize,
      });
      
      setStudents(response.results || response);
      
      if (response.count !== undefined) {
        setPagination(prev => ({
          ...prev,
          total: response.count,
          totalPages: Math.ceil(response.count / prev.pageSize),
        }));
      }
      
      return response;
    } catch (err) {
      setError(err.message || 'Failed to fetch students');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.pageSize]);

  /**
   * Search students
   */
  const searchStudents = useCallback(async (searchParams) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await studentService.searchStudents(searchParams);
      setStudents(response.results || response);
      
      return response;
    } catch (err) {
      setError(err.message || 'Failed to search students');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get student by ID
   */
  const getStudent = useCallback(async (studentId) => {
    try {
      setLoading(true);
      setError(null);
      
      const student = await studentService.getStudentById(studentId);
      return student;
    } catch (err) {
      setError(err.message || 'Failed to fetch student');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Create new student
   */
  const createStudent = useCallback(async (studentData) => {
    try {
      setLoading(true);
      setError(null);
      
      const newStudent = await studentService.createStudent(studentData);
      
      // Add to local state if successful
      setStudents(prev => [newStudent, ...prev]);
      
      return newStudent;
    } catch (err) {
      setError(err.message || 'Failed to create student');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update student
   */
  const updateStudent = useCallback(async (studentId, studentData) => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedStudent = await studentService.updateStudent(studentId, studentData);
      
      // Update in local state
      setStudents(prev =>
        prev.map(student =>
          student.id === studentId ? updatedStudent : student
        )
      );
      
      return updatedStudent;
    } catch (err) {
      setError(err.message || 'Failed to update student');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Delete student (soft delete)
   */
  const deleteStudent = useCallback(async (studentId) => {
    try {
      setLoading(true);
      setError(null);
      
      await studentService.updateStudent(studentId, { is_active: false });
      
      // Update in local state
      setStudents(prev =>
        prev.map(student =>
          student.id === studentId ? { ...student, is_active: false } : student
        )
      );
      
      return true;
    } catch (err) {
      setError(err.message || 'Failed to delete student');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update student fee
   */
  const updateFee = useCallback(async (studentId, feeData) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await studentService.updateStudentFee(studentId, feeData);
      
      // Update in local state
      setStudents(prev =>
        prev.map(student =>
          student.id === studentId
            ? {
                ...student,
                ...result.student,
                fee_summary: result.fee_summary,
              }
            : student
        )
      );
      
      return result;
    } catch (err) {
      setError(err.message || 'Failed to update fee');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Upload document
   */
  const uploadDocument = useCallback(async (studentId, documentData) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await studentService.uploadStudentDocument(studentId, documentData);
      
      // Update in local state
      setStudents(prev =>
        prev.map(student =>
          student.id === studentId
            ? {
                ...student,
                document_checklist: result.document_checklist,
              }
            : student
        )
      );
      
      return result;
    } catch (err) {
      setError(err.message || 'Failed to upload document');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Change page
   */
  const setPage = useCallback((page) => {
    setPagination(prev => ({ ...prev, page }));
  }, []);

  /**
   * Change page size
   */
  const setPageSize = useCallback((pageSize) => {
    setPagination(prev => ({ ...prev, pageSize, page: 1 }));
  }, []);

  return {
    students,
    loading,
    error,
    pagination,
    setPage,
    setPageSize,
    fetchStudents,
    searchStudents,
    getStudent,
    createStudent,
    updateStudent,
    deleteStudent,
    updateFee,
    uploadDocument,
  };
};

export default useStudents;