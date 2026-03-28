import React, { useState, useEffect, useCallback } from 'react';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { debounce } from 'lodash';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import useAuth from '../../hooks/useAuth';
import { get, post, put, del, upload, resultService, studentService, academicService } from '../../services/api';

// Icons
import {
  Plus, Eye, Edit2, Trash2, Download, Upload, Grid,
  FileText, Book, Target, UserCheck, Send, Search, Filter,
  User, Calendar, GraduationCap, Award, TrendingUp, Users,
  CheckCircle, XCircle, Printer, Share2, RefreshCw,
  Percent, FileSpreadsheet, FileSignature, BarChart2,
  PieChart, LineChart, Check, X, Loader, ChevronDown,
  ChevronUp, FileBarChart, BookOpen, Star, Trophy,
  TrendingDown, DollarSign, Clock, Shield, AlertCircle,
  Maximize2, Minimize2, ExternalLink, ChevronRight,
  Mail, Phone, MapPin, Hash, Bookmark, Users as UsersIcon
} from 'lucide-react';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Result = () => {
  const { user } = useAuth();

  // Permissions
  const isAdmin = user?.role === 'head' || user?.role === 'hm' ||
                  user?.role === 'principal' || user?.role === 'vice_principal';
  const isTeacher = user?.role === 'teacher' || user?.role === 'form_teacher' ||
                    user?.role === 'subject_teacher';
  const isStudent = user?.role === 'student';
  const isParent = user?.role === 'parent';

  // States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);

  // Data
  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [students, setStudents] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [terms, setTerms] = useState([]);
  const [classLevels, setClassLevels] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [headmasters, setHeadmasters] = useState([]);
  const [classTeachers, setClassTeachers] = useState([]);
  const [statistics, setStatistics] = useState({
    total_results: 0,
    published_results: 0,
    average_percentage: 0,
    highest_percentage: 0,
    lowest_percentage: 0,
    grade_distribution: { A: 0, B: 0, C: 0, D: 0, E: 0 },
    performance_trend: [],
    class_performance: []
  });

  // Modals
  const [showResultModal, setShowResultModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  // Selected
  const [selectedResult, setSelectedResult] = useState(null);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'card'

  // Form Data – using _id suffixes to match backend
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    student_id: '',
    session_id: '',
    term_id: '',
    class_level_id: '',

    frequency_of_school_opened: 0,
    no_of_times_present: 0,
    no_of_times_absent: 0,

    weight_beginning_of_term: '',
    weight_end_of_term: '',
    height_beginning_of_term: '',
    height_end_of_term: '',

    subject_scores: [],

    psychomotor_skills: {
      handwriting: 3,
      verbal_fluency: 3,
      drawing_and_painting: 3,
      tools_handling: 3,
      sports: 3,
      musical_skills: 3,
      dancing: 3,
      craft_work: 3
    },

    affective_domains: {
      punctuality: 3,
      neatness: 3,
      politeness: 3,
      honesty: 3,
      cooperation_with_others: 3,
      leadership: 3,
      altruism: 3,
      emotional_stability: 3,
      health: 3,
      attitude: 3,
      attentiveness: 3,
      perseverance: 3,
      communication_skill: 3,
      behavioral_comment: ''
    },

    class_teacher_comment: '',
    headmaster_comment: '',
    next_term_begins_on: '',
    next_term_fees: '',
    is_promoted: false,
    class_teacher_id: '',
    headmaster_id: '',
    is_published: false
  });

  // Filters & Search
  const [filters, setFilters] = useState({
    session: '',
    term: '',
    class_level: '',
    is_published: '',
    overall_grade: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(true);

  // Bulk Upload
  const [bulkFile, setBulkFile] = useState(null);
  const [bulkLoading, setBulkLoading] = useState(false);

  // =====================
  // LOAD ALL DATA – robust version from uncommented
  // =====================
  // const loadAllData = useCallback(async () => {
  //   try {
  //     setLoading(true);
  //     setError('');

  //     const [
  //       resultsRes,
  //       studentsRes,
  //       sessionsRes,
  //       termsRes,
  //       classLevelsRes,
  //       subjectsRes,
  //       staffRes
  //     ] = await Promise.allSettled([
  //       resultService.getStudentResults({ limit: 1000 }),
  //       studentService.getStudents({ limit: 1000 }),
  //       academicService.getAcademicSessions(),
  //       academicService.getAcademicTerms(),
  //       academicService.getClassLevels(),
  //       academicService.getSubjects(),
  //       resultService.getTeachers()
  //     ]);

  //     // Process results
  //     let resultsData = [];
  //     if (resultsRes.status === 'fulfilled') {
  //       const value = resultsRes.value;
  //       if (Array.isArray(value)) resultsData = value;
  //       else if (value?.results) resultsData = value.results;
  //       else if (value?.data?.results) resultsData = value.data.results;
  //       else if (value?.data) resultsData = Array.isArray(value.data) ? value.data : [value.data];
  //     }

  //     let studentsData = [];
  //     if (studentsRes.status === 'fulfilled') {
  //       const value = studentsRes.value;
  //       if (Array.isArray(value)) studentsData = value;
  //       else if (value?.results) studentsData = value.results;
  //       else if (value?.data?.results) studentsData = value.data.results;
  //       else if (value?.data) studentsData = Array.isArray(value.data) ? value.data : [value.data];
  //     }

  //     let sessionsData = [];
  //     if (sessionsRes.status === 'fulfilled') {
  //       const value = sessionsRes.value;
  //       if (Array.isArray(value)) sessionsData = value;
  //       else if (value?.results) sessionsData = value.results;
  //       else if (value?.data?.results) sessionsData = value.data.results;
  //       else if (value?.data) sessionsData = Array.isArray(value.data) ? value.data : [value.data];
  //     }

  //     let termsData = [];
  //     if (termsRes.status === 'fulfilled') {
  //       const value = termsRes.value;
  //       if (Array.isArray(value)) termsData = value;
  //       else if (value?.results) termsData = value.results;
  //       else if (value?.data?.results) termsData = value.data.results;
  //       else if (value?.data) termsData = Array.isArray(value.data) ? value.data : [value.data];
  //     }

  //     let classLevelsData = [];
  //     if (classLevelsRes.status === 'fulfilled') {
  //       const value = classLevelsRes.value;
  //       if (Array.isArray(value)) classLevelsData = value;
  //       else if (value?.results) classLevelsData = value.results;
  //       else if (value?.data?.results) classLevelsData = value.data.results;
  //       else if (value?.data) classLevelsData = Array.isArray(value.data) ? value.data : [value.data];
  //     }

  //     let subjectsData = [];
  //     if (subjectsRes.status === 'fulfilled') {
  //       const value = subjectsRes.value;
  //       if (Array.isArray(value)) subjectsData = value;
  //       else if (value?.results) subjectsData = value.results;
  //       else if (value?.data?.results) subjectsData = value.data.results;
  //       else if (value?.data) subjectsData = Array.isArray(value.data) ? value.data : [value.data];
  //     }

  //     // Enrich results with full data
  //     const enrichedResults = resultsData.map(result => {
  //       const studentId = result.student?.id || result.student_id || result.student;
  //       const sessionId = result.session?.id || result.session_id || result.session;
  //       const termId = result.term?.id || result.term_id || result.term;
  //       const classLevelId = result.class_level?.id || result.class_level_id || result.class_level;

  //       const fullStudent = studentId ? studentsData.find(s => s.id === studentId) : null;
  //       const fullSession = sessionId ? sessionsData.find(s => s.id === sessionId) : null;
  //       const fullTerm = termId ? termsData.find(t => t.id === termId) : null;
  //       const fullClassLevel = classLevelId ? classLevelsData.find(c => c.id === classLevelId) : null;

  //       return {
  //         ...result,
  //         student: fullStudent || result.student || { id: studentId, first_name: '', last_name: '', admission_number: 'N/A' },
  //         session: fullSession || result.session || { id: sessionId, name: 'N/A' },
  //         term: fullTerm || result.term || { id: termId, name: 'N/A' },
  //         class_level: fullClassLevel || result.class_level || { id: classLevelId, name: 'N/A' }
  //       };
  //     });

  //     // Process staff data
  //     let staffList = [];
  //     if (staffRes.status === 'fulfilled') {
  //       const staffResponse = staffRes.value;
  //       if (Array.isArray(staffResponse)) staffList = staffResponse;
  //       else if (staffResponse?.results) staffList = staffResponse.results;
  //       else if (staffResponse?.data?.results) staffList = staffResponse.data.results;
  //       else if (staffResponse?.data) staffList = Array.isArray(staffResponse.data) ? staffResponse.data : [staffResponse.data];

  //       const formattedStaff = staffList.map(staff => {
  //         let fullName = 'Unknown Staff';
  //         if (staff.user?.get_full_name) fullName = staff.user.get_full_name;
  //         else if (staff.user?.first_name || staff.user?.last_name) fullName = `${staff.user.first_name || ''} ${staff.user.last_name || ''}`.trim();
  //         else if (staff.name) fullName = staff.name;
  //         else if (staff.first_name || staff.last_name) fullName = `${staff.first_name || ''} ${staff.last_name || ''}`.trim();
  //         else if (staff.username) fullName = staff.username;
  //         return { id: staff.id, name: fullName, full_name: fullName, role: staff.role || staff.position || '', user: staff.user };
  //       });

  //       setHeadmasters(formattedStaff.filter(s => s.role?.toLowerCase().includes('head') || s.role?.toLowerCase().includes('principal')));
  //       setClassTeachers(formattedStaff.filter(s => s.role?.toLowerCase().includes('teacher')));
  //     }

  //     setResults(enrichedResults);
  //     setFilteredResults(enrichedResults);
  //     setStudents(studentsData);
  //     setSessions(sessionsData);
  //     setTerms(termsData);
  //     setClassLevels(classLevelsData);
  //     setSubjects(subjectsData);

  //     // Calculate statistics
  //     const published = enrichedResults.filter(r => r.is_published);
  //     const percentages = enrichedResults.map(r => r.percentage || 0).filter(p => p > 0);
  //     const gradeDist = { A: 0, B: 0, C: 0, D: 0, E: 0 };
  //     enrichedResults.forEach(r => { if (r.overall_grade) gradeDist[r.overall_grade] = (gradeDist[r.overall_grade] || 0) + 1; });

  //     setStatistics({
  //       total_results: enrichedResults.length,
  //       published_results: published.length,
  //       average_percentage: percentages.length ? percentages.reduce((a, b) => a + b, 0) / percentages.length : 0,
  //       highest_percentage: percentages.length ? Math.max(...percentages) : 0,
  //       lowest_percentage: percentages.length ? Math.min(...percentages) : 0,
  //       grade_distribution: gradeDist,
  //       performance_trend: [],
  //       class_performance: []
  //     });

  //   } catch (err) {
  //     console.error('Error loading data:', err);
  //     setError('Failed to load data. Please refresh the page.');
  //   } finally {
  //     setLoading(false);
  //   }
  // }, []);

    const loadAllData = useCallback(async () => {
      try {
        setLoading(true);
        setError('');

        const [
          resultsRes,
          studentsRes,
          sessionsRes,
          termsRes,
          classLevelsRes,
          subjectsRes,
          staffRes
        ] = await Promise.allSettled([
          resultService.getStudentResults({ limit: 1000 }),
          studentService.getStudents({ limit: 1000 }),
          academicService.getAcademicSessions(),
          academicService.getAcademicTerms(),
          academicService.getClassLevels(),
          academicService.getSubjects(),
          resultService.getTeachers()
        ]);

        // Process results
        let resultsData = [];
        if (resultsRes.status === 'fulfilled') {
          const value = resultsRes.value;
          if (Array.isArray(value)) resultsData = value;
          else if (value?.results) resultsData = value.results;
          else if (value?.data?.results) resultsData = value.data.results;
          else if (value?.data) resultsData = Array.isArray(value.data) ? value.data : [value.data];
        }

        // Log first result to see what backend returns
        if (resultsData.length > 0) {
          console.log('🔍 Backend result data sample:', resultsData[0]);
        }

        let studentsData = [];
        if (studentsRes.status === 'fulfilled') {
          const value = studentsRes.value;
          if (Array.isArray(value)) studentsData = value;
          else if (value?.results) studentsData = value.results;
          else if (value?.data?.results) studentsData = value.data.results;
          else if (value?.data) studentsData = Array.isArray(value.data) ? value.data : [value.data];
        }

        let sessionsData = [];
        if (sessionsRes.status === 'fulfilled') {
          const value = sessionsRes.value;
          if (Array.isArray(value)) sessionsData = value;
          else if (value?.results) sessionsData = value.results;
          else if (value?.data?.results) sessionsData = value.data.results;
          else if (value?.data) sessionsData = Array.isArray(value.data) ? value.data : [value.data];
        }

        let termsData = [];
        if (termsRes.status === 'fulfilled') {
          const value = termsRes.value;
          if (Array.isArray(value)) termsData = value;
          else if (value?.results) termsData = value.results;
          else if (value?.data?.results) termsData = value.data.results;
          else if (value?.data) termsData = Array.isArray(value.data) ? value.data : [value.data];
        }

        let classLevelsData = [];
        if (classLevelsRes.status === 'fulfilled') {
          const value = classLevelsRes.value;
          if (Array.isArray(value)) classLevelsData = value;
          else if (value?.results) classLevelsData = value.results;
          else if (value?.data?.results) classLevelsData = value.data.results;
          else if (value?.data) classLevelsData = Array.isArray(value.data) ? value.data : [value.data];
        }

        // let subjectsData = [];
        // if (subjectsRes.status === 'fulfilled') {
        //   const value = subjectsRes.value;
        //   if (Array.isArray(value)) subjectsData = value;
        //   else if (value?.results) subjectsData = value.results;
        //   else if (value?.data?.results) subjectsData = value.data.results;
        //   else if (value?.data) subjectsData = Array.isArray(value.data) ? value.data : [value.data];
        // }

        let subjectsData = [];
        if (subjectsRes.status === 'fulfilled') {
          const value = subjectsRes.value;
          let firstPage = [];
          if (Array.isArray(value)) firstPage = value;
          else if (value?.results) firstPage = value.results;
          else if (value?.data?.results) firstPage = value.data.results;
          else if (value?.data) firstPage = Array.isArray(value.data) ? value.data : [];

          subjectsData = [...firstPage];

          // Fetch remaining pages
          try {
            let nextUrl = value?.next || value?.data?.next;
            while (nextUrl) {
              const pageNum = new URL(nextUrl).searchParams.get('page');
              const nextRes = await get('/academic/subjects/', { params: { page: pageNum } });
              const nextPage = nextRes?.results || nextRes?.data?.results || [];
              subjectsData = [...subjectsData, ...nextPage];
              nextUrl = nextRes?.next || nextRes?.data?.next;
            }
          } catch (e) {
            console.log('Could not fetch additional subject pages:', e);
          }
        }

        // ========== CRITICAL FIX: Preserve ALL fields from backend ==========
        const enrichedResults = resultsData.map(result => {
          // Get IDs for relation mapping
          const studentId = result.student?.id || result.student_id || result.student;
          const sessionId = result.session?.id || result.session_id || result.session;
          const termId = result.term?.id || result.term_id || result.term;
          const classLevelId = result.class_level?.id || result.class_level_id || result.class_level;

          // Find full objects for relations
          const fullStudent = studentId ? studentsData.find(s => s.id === studentId) : null;
          const fullSession = sessionId ? sessionsData.find(s => s.id === sessionId) : null;
          const fullTerm = termId ? termsData.find(t => t.id === termId) : null;
          const fullClassLevel = classLevelId ? classLevelsData.find(c => c.id === classLevelId) : null;

          // CRITICAL: Preserve ALL original fields from backend response
          return {
            ...result,  // Keep all original data including percentage, overall_grade, etc.
            student: fullStudent || result.student || { 
              id: studentId, 
              first_name: '', 
              last_name: '', 
              admission_number: 'N/A' 
            },
            session: fullSession || result.session || { id: sessionId, name: 'N/A' },
            term: fullTerm || result.term || { id: termId, name: 'N/A' },
            class_level: fullClassLevel || result.class_level || { id: classLevelId, name: 'N/A' }
          };
        });

        // Log enriched result to verify percentage is preserved
        if (enrichedResults.length > 0) {
          console.log('✅ Enriched result sample:', {
            id: enrichedResults[0].id,
            percentage: enrichedResults[0].percentage,
            overall_grade: enrichedResults[0].overall_grade,
            overall_total_score: enrichedResults[0].overall_total_score,
            total_obtainable: enrichedResults[0].total_obtainable
          });
        }

        // Process staff data (same as before)
        let staffList = [];
        if (staffRes.status === 'fulfilled') {
          const staffResponse = staffRes.value;
          if (Array.isArray(staffResponse)) staffList = staffResponse;
          else if (staffResponse?.results) staffList = staffResponse.results;
          else if (staffResponse?.data?.results) staffList = staffResponse.data.results;
          else if (staffResponse?.data) staffList = Array.isArray(staffResponse.data) ? staffResponse.data : [staffResponse.data];

          const formattedStaff = staffList.map(staff => {
            let fullName = 'Unknown Staff';
            if (staff.user?.get_full_name) fullName = staff.user.get_full_name;
            else if (staff.user?.first_name || staff.user?.last_name) fullName = `${staff.user.first_name || ''} ${staff.user.last_name || ''}`.trim();
            else if (staff.name) fullName = staff.name;
            else if (staff.first_name || staff.last_name) fullName = `${staff.first_name || ''} ${staff.last_name || ''}`.trim();
            else if (staff.username) fullName = staff.username;
            return { id: staff.id, name: fullName, full_name: fullName, role: staff.role || staff.position || '', user: staff.user };
          });

          setHeadmasters(formattedStaff.filter(s => s.role?.toLowerCase().includes('head') || s.role?.toLowerCase().includes('principal')));
          setClassTeachers(formattedStaff.filter(s => s.role?.toLowerCase().includes('teacher')));
        }

        setResults(enrichedResults);
        setFilteredResults(enrichedResults);
        setStudents(studentsData);
        setSessions(sessionsData);
        setTerms(termsData);
        setClassLevels(classLevelsData);
        setSubjects(subjectsData);

        // Calculate statistics using the preserved data
        const published = enrichedResults.filter(r => r.is_published);
        const percentages = enrichedResults.map(r => parseFloat(r.percentage) || 0).filter(p => p > 0);
        const gradeDist = { A: 0, B: 0, C: 0, D: 0, E: 0 };
        enrichedResults.forEach(r => { 
          if (r.overall_grade) gradeDist[r.overall_grade] = (gradeDist[r.overall_grade] || 0) + 1; 
        });

        setStatistics({
          total_results: enrichedResults.length,
          published_results: published.length,
          average_percentage: percentages.length ? percentages.reduce((a, b) => a + b, 0) / percentages.length : 0,
          highest_percentage: percentages.length ? Math.max(...percentages) : 0,
          lowest_percentage: percentages.length ? Math.min(...percentages) : 0,
          grade_distribution: gradeDist,
          performance_trend: [],
          class_performance: []
        });

      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load data. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // =====================
  // STUDENT SEARCH – enhanced version with image support
  // =====================
  const StudentSearch = ({ value, onChange }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [localLoading, setLocalLoading] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);

    useEffect(() => {
      if (value && students.length > 0) {
        const found = students.find(s => s.id === value);
        if (found) {
          setSelectedStudent(found);
          setSearchQuery(extractStudentName(found));
        }
      }
    }, [value, students]);

    const extractStudentName = (s) => {
      if (!s) return '';
      if (s.user?.get_full_name) return s.user.get_full_name;
      if (s.user?.first_name || s.user?.last_name) return `${s.user.first_name || ''} ${s.user.last_name || ''}`.trim();
      if (s.name) return s.name;
      if (s.first_name || s.last_name) return `${s.first_name || ''} ${s.last_name || ''}`.trim();
      return 'Unknown';
    };

    const getStudentImage = (s) => {
      return s.user?.profile_picture || s.profile_picture || s.student_image_url || null;
    };

    const searchStudents = useCallback(async (query) => {
      if (!query || query.length < 2) {
        setFilteredStudents([]);
        setShowDropdown(false);
        return;
      }
      setLocalLoading(true);
      try {
        let results = [];
        try {
          const res = await get('/students/api/', { params: { search: query, limit: 20 } });
          if (Array.isArray(res)) results = res;
          else if (res?.results) results = res.results;
        } catch (apiErr) {
          // fallback local
          const ql = query.toLowerCase();
          results = students.filter(s =>
            extractStudentName(s).toLowerCase().includes(ql) ||
            s.admission_number?.toLowerCase().includes(ql)
          );
        }
        setFilteredStudents(results);
        setShowDropdown(results.length > 0);
      } catch (err) {
        console.error('Search error', err);
        setFilteredStudents([]);
        setShowDropdown(false);
      } finally {
        setLocalLoading(false);
      }
    }, [students]);

    useEffect(() => {
      const timer = setTimeout(() => {
        if (searchQuery.length >= 2) searchStudents(searchQuery.trim());
      }, 350);
      return () => clearTimeout(timer);
    }, [searchQuery, searchStudents]);

    const handleSelect = (student) => {
      setSelectedStudent(student);
      onChange(student.id);
      setSearchQuery(extractStudentName(student));
      setShowDropdown(false);
      setFilteredStudents([]);
    };

    const handleClear = () => {
      setSelectedStudent(null);
      onChange('');
      setSearchQuery('');
      setFilteredStudents([]);
    };

    return (
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Search Student <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Type name or admission number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => { if (filteredStudents.length > 0 || searchQuery.length >= 2) setShowDropdown(true); }}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
            disabled={localLoading}
          />
          {localLoading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-900"></div>
            </div>
          )}
          {searchQuery && !localLoading && (
            <button type="button" onClick={handleClear} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X size={16} />
            </button>
          )}
        </div>

        {selectedStudent && (
          <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200 flex items-start justify-between">
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-3">
                {getStudentImage(selectedStudent) ? (
                  <img
                    src={getStudentImage(selectedStudent)}
                    alt={extractStudentName(selectedStudent)}
                    className="w-12 h-12 rounded-full object-cover"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-medium">{extractStudentName(selectedStudent).charAt(0)}</span>
                  </div>
                )}
              </div>
              <div>
                <div className="font-medium text-blue-900">{extractStudentName(selectedStudent)}</div>
                <div className="text-sm text-blue-700 mt-1">
                  {selectedStudent.admission_number && (
                    <span className="inline-flex items-center mr-3">
                      <Hash size={12} className="mr-1" /> {selectedStudent.admission_number}
                    </span>
                  )}
                  {selectedStudent.class_level?.name && (
                    <span className="inline-flex items-center">
                      <Bookmark size={12} className="mr-1" /> {selectedStudent.class_level.name}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button type="button" onClick={handleClear} className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded">
              <X size={16} />
            </button>
          </div>
        )}

        {showDropdown && filteredStudents.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto">
            {filteredStudents.map(student => {
              const name = extractStudentName(student);
              const img = getStudentImage(student);
              return (
                <div
                  key={student.id}
                  onClick={() => handleSelect(student)}
                  className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 flex items-center"
                >
                  <div className="flex-shrink-0 mr-3 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden">
                    {img ? (
                      <img src={img} alt={name} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                    ) : (
                      <span className="text-blue-600 text-sm font-medium">{name.charAt(0)}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">{name}</div>
                    <div className="text-sm text-gray-500 truncate">
                      {student.admission_number && (
                        <span className="inline-flex items-center mr-2"><Hash size={10} className="mr-1" />{student.admission_number}</span>
                      )}
                      {student.class_level?.name && (
                        <span className="inline-flex items-center"><Bookmark size={10} className="mr-1" />{student.class_level.name}</span>
                      )}
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-gray-400" />
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  // =====================
  // FORM HANDLERS
  // =====================
  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubjectScoreChange = (index, field, value) => {
    const updatedScores = [...formData.subject_scores];
    
    // Ensure the subject is stored as subject_id
    if (field === 'subject_id') {
      updatedScores[index] = {
        ...updatedScores[index],
        subject_id: parseInt(value) || value
      };
    } else {
      updatedScores[index] = {
        ...updatedScores[index],
        [field]: value
      };
    }
    
    // Auto-calculate total and grade
    if (field === 'ca_score' || field === 'exam_score') {
      const ca = parseFloat(field === 'ca_score' ? value : updatedScores[index].ca_score) || 0;
      const exam = parseFloat(field === 'exam_score' ? value : updatedScores[index].exam_score) || 0;
      const total = ca + exam;
      
      updatedScores[index].total_score = total;
      
      // Auto-grade based on Nigerian standard
      if (total >= 80) updatedScores[index].grade = 'A';
      else if (total >= 60) updatedScores[index].grade = 'B';
      else if (total >= 50) updatedScores[index].grade = 'C';
      else if (total >= 40) updatedScores[index].grade = 'D';
      else updatedScores[index].grade = 'E';
    }
    
    setFormData(prev => ({
      ...prev,
      subject_scores: updatedScores
    }));
  };

  const addSubjectScore = () => {
    setFormData(prev => ({
      ...prev,
      subject_scores: [
        ...prev.subject_scores,
        {
          subject_id: '', // Must be subject_id, not subject
          ca_obtainable: 40,
          exam_obtainable: 60,
          total_obtainable: 100,
          ca_score: 0,
          exam_score: 0,
          total_score: 0,
          grade: '',
          teacher_comment: ''
        }
      ]
    }));
  };


  // const handleSubjectScoreChange = (index, field, value) => {
  //   const updatedScores = [...formData.subject_scores];
  //   if (field === 'subject_id') {
  //     updatedScores[index] = { ...updatedScores[index], subject_id: parseInt(value) || value };
  //   } else {
  //     updatedScores[index] = { ...updatedScores[index], [field]: value };
  //   }

  //   if (field === 'ca_score' || field === 'exam_score') {
  //     const ca = parseFloat(field === 'ca_score' ? value : updatedScores[index].ca_score) || 0;
  //     const exam = parseFloat(field === 'exam_score' ? value : updatedScores[index].exam_score) || 0;
  //     const total = ca + exam;
  //     updatedScores[index].total_score = total;
  //     if (total >= 80) updatedScores[index].grade = 'A';
  //     else if (total >= 60) updatedScores[index].grade = 'B';
  //     else if (total >= 50) updatedScores[index].grade = 'C';
  //     else if (total >= 40) updatedScores[index].grade = 'D';
  //     else updatedScores[index].grade = 'E';
  //   }

  //   setFormData(prev => ({ ...prev, subject_scores: updatedScores }));
  // };

  // const addSubjectScore = () => {
  //   setFormData(prev => ({
  //     ...prev,
  //     subject_scores: [
  //       ...prev.subject_scores,
  //       {
  //         subject_id: '',
  //         ca_obtainable: 40,
  //         exam_obtainable: 60,
  //         total_obtainable: 100,
  //         ca_score: 0,
  //         exam_score: 0,
  //         total_score: 0,
  //         grade: '',
  //         teacher_comment: ''
  //       }
  //     ]
  //   }));
  // };

  const removeSubjectScore = (index) => {
    const updated = [...formData.subject_scores];
    updated.splice(index, 1);
    setFormData(prev => ({ ...prev, subject_scores: updated }));
  };

  // =====================
  // FILTERS & SEARCH
  // =====================
  const applyFilters = useCallback(() => {
    let filtered = [...results];
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(result => {
        const student = result.student || {};
        const name = extractDisplayName(student).toLowerCase();
        const admission = (student.admission_number || '').toLowerCase();
        const className = (result.class_level?.name || '').toLowerCase();
        return name.includes(term) || admission.includes(term) || className.includes(term);
      });
    }
    if (filters.session) filtered = filtered.filter(r => (r.session?.id || r.session)?.toString() === filters.session);
    if (filters.term) filtered = filtered.filter(r => (r.term?.id || r.term)?.toString() === filters.term);
    if (filters.class_level) filtered = filtered.filter(r => (r.class_level?.id || r.class_level)?.toString() === filters.class_level);
    if (filters.is_published !== '') filtered = filtered.filter(r => r.is_published === (filters.is_published === 'true'));
    if (filters.overall_grade) filtered = filtered.filter(r => r.overall_grade === filters.overall_grade);
    setFilteredResults(filtered);
  }, [results, searchTerm, filters]);

  useEffect(() => { applyFilters(); }, [applyFilters]);

  const clearFilters = () => {
    setFilters({ session: '', term: '', class_level: '', is_published: '', overall_grade: '' });
    setSearchTerm('');
  };

  const handleAddResult = () => {
    const currentSession = sessions.find(s => s.is_current)?.id || '';
    const currentTerm = terms.find(t => t.is_current)?.id || '';
    const nextTerm = new Date();
    nextTerm.setMonth(nextTerm.getMonth() + 3);
    
    setFormData({
      // Basic Info - Using _id suffixes
      student_id: '',
      session_id: currentSession,
      term_id: currentTerm,
      class_level_id: '',
      
      // Attendance Records
      frequency_of_school_opened: 0,
      no_of_times_present: 0,
      no_of_times_absent: 0,
      
      // Physical Records
      weight_beginning_of_term: '',
      weight_end_of_term: '',
      height_beginning_of_term: '',
      height_end_of_term: '',
      
      // Subject Scores
      subject_scores: [],
      
      // Psychomotor Skills Assessment
      psychomotor_skills: {
        handwriting: 3,
        verbal_fluency: 3,
        drawing_and_painting: 3,
        tools_handling: 3,
        sports: 3,
        musical_skills: 3,
        dancing: 3,
        craft_work: 3
      },
      
      // Affective Domains Assessment
      affective_domains: {
        punctuality: 3,
        neatness: 3,
        politeness: 3,
        honesty: 3,
        cooperation_with_others: 3,
        leadership: 3,
        altruism: 3,
        emotional_stability: 3,
        health: 3,
        attitude: 3,
        attentiveness: 3,
        perseverance: 3,
        communication_skill: 3,
        behavioral_comment: ''
      },
      
      // Comments and Finalization
      class_teacher_comment: '',
      headmaster_comment: '',
      next_term_begins_on: nextTerm.toISOString().split('T')[0],
      next_term_fees: '',
      is_promoted: false,
      class_teacher_id: user?.id || '',
      headmaster_id: headmasters[0]?.id || '',
      is_published: false
    });
    
    setCurrentStep(1);
    setSelectedResult(null);
    setShowResultModal(true);
  };

  // const submitResult = async () => {
  //   try {
  //     setLoading(true);
  //     setError('');
      
  //     // =====================
  //     // STEP 1: VALIDATE REQUIRED FIELDS
  //     // =====================
  //     if (!formData.student_id) {
  //       setCurrentStep(1);
  //       throw new Error('Please select a student');
  //     }
      
  //     if (!formData.session_id) {
  //       setCurrentStep(1);
  //       throw new Error('Please select a session');
  //     }
      
  //     if (!formData.term_id) {
  //       setCurrentStep(1);
  //       throw new Error('Please select a term');
  //     }
      
  //     if (!formData.class_level_id) {
  //       setCurrentStep(1);
  //       throw new Error('Please select a class level');
  //     }
      
  //     // =====================
  //     // STEP 2: VALIDATE SUBJECT SCORES
  //     // =====================
  //     if (!formData.subject_scores || formData.subject_scores.length === 0) {
  //       setCurrentStep(4);
  //       throw new Error('Please add at least one subject score');
  //     }
      
  //     // Validate each subject score has a subject selected
  //     const invalidScores = formData.subject_scores.filter(score => !score.subject_id);
  //     if (invalidScores.length > 0) {
  //       setCurrentStep(4);
  //       throw new Error(`Please select a subject for all subject scores (${invalidScores.length} missing)`);
  //     }
      
  //     // Validate score ranges
  //     const outOfRangeScores = formData.subject_scores.filter(score => {
  //       const ca = parseFloat(score.ca_score) || 0;
  //       const exam = parseFloat(score.exam_score) || 0;
  //       return ca < 0 || ca > 40 || exam < 0 || exam > 60;
  //     });
      
  //     if (outOfRangeScores.length > 0) {
  //       setCurrentStep(4);
  //       throw new Error('Some scores are out of range. CA must be 0-40, Exam must be 0-60');
  //     }
      
  //     // =====================
  //     // STEP 3: PREPARE COMPLETE PAYLOAD - ONE REQUEST ONLY!
  //     // =====================
  //     const payload = {
  //       // Basic Information
  //       student_id: parseInt(formData.student_id),
  //       session_id: parseInt(formData.session_id),
  //       term_id: parseInt(formData.term_id),
  //       class_level_id: parseInt(formData.class_level_id),
        
  //       // Attendance Records
  //       frequency_of_school_opened: parseInt(formData.frequency_of_school_opened) || 0,
  //       no_of_times_present: parseInt(formData.no_of_times_present) || 0,
  //       no_of_times_absent: parseInt(formData.no_of_times_absent) || 0,
        
  //       // Physical Records
  //       weight_beginning_of_term: formData.weight_beginning_of_term ? parseFloat(formData.weight_beginning_of_term) : null,
  //       weight_end_of_term: formData.weight_end_of_term ? parseFloat(formData.weight_end_of_term) : null,
  //       height_beginning_of_term: formData.height_beginning_of_term ? parseFloat(formData.height_beginning_of_term) : null,
  //       height_end_of_term: formData.height_end_of_term ? parseFloat(formData.height_end_of_term) : null,
        
  //       // SUBJECT SCORES - NESTED ARRAY (backend will create these automatically)
  //       subject_scores: formData.subject_scores.map(score => ({
  //         subject_id: parseInt(score.subject_id),
  //         ca_obtainable: 40,
  //         exam_obtainable: 60,
  //         total_obtainable: 100,
  //         ca_score: parseFloat(score.ca_score) || 0,
  //         exam_score: parseFloat(score.exam_score) || 0,
  //         grade: score.grade || '',
  //         teacher_comment: score.teacher_comment || ''
  //       })),
        
  //       // PSYCHOMOTOR SKILLS - NESTED OBJECT (backend will create this automatically)
  //       psychomotor_skills: {
  //         handwriting: parseInt(formData.psychomotor_skills.handwriting) || 3,
  //         verbal_fluency: parseInt(formData.psychomotor_skills.verbal_fluency) || 3,
  //         drawing_and_painting: parseInt(formData.psychomotor_skills.drawing_and_painting) || 3,
  //         tools_handling: parseInt(formData.psychomotor_skills.tools_handling) || 3,
  //         sports: parseInt(formData.psychomotor_skills.sports) || 3,
  //         musical_skills: parseInt(formData.psychomotor_skills.musical_skills) || 3,
  //         dancing: parseInt(formData.psychomotor_skills.dancing) || 3,
  //         craft_work: parseInt(formData.psychomotor_skills.craft_work) || 3
  //       },
        
  //       // AFFECTIVE DOMAINS - NESTED OBJECT (backend will create this automatically)
  //       affective_domains: {
  //         punctuality: parseInt(formData.affective_domains.punctuality) || 3,
  //         neatness: parseInt(formData.affective_domains.neatness) || 3,
  //         politeness: parseInt(formData.affective_domains.politeness) || 3,
  //         honesty: parseInt(formData.affective_domains.honesty) || 3,
  //         cooperation_with_others: parseInt(formData.affective_domains.cooperation_with_others) || 3,
  //         leadership: parseInt(formData.affective_domains.leadership) || 3,
  //         altruism: parseInt(formData.affective_domains.altruism) || 3,
  //         emotional_stability: parseInt(formData.affective_domains.emotional_stability) || 3,
  //         health: parseInt(formData.affective_domains.health) || 3,
  //         attitude: parseInt(formData.affective_domains.attitude) || 3,
  //         attentiveness: parseInt(formData.affective_domains.attentiveness) || 3,
  //         perseverance: parseInt(formData.affective_domains.perseverance) || 3,
  //         communication_skill: parseInt(formData.affective_domains.communication_skill) || 3,
  //         behavioral_comment: formData.affective_domains.behavioral_comment || ''
  //       },
        
  //       // Comments
  //       class_teacher_comment: formData.class_teacher_comment || '',
  //       headmaster_comment: formData.headmaster_comment || '',
  //       next_term_begins_on: formData.next_term_begins_on || null,
  //       next_term_fees: formData.next_term_fees ? parseFloat(formData.next_term_fees) : null,
  //       is_promoted: Boolean(formData.is_promoted),
        
  //       // Staff References
  //       class_teacher_id: formData.class_teacher_id ? parseInt(formData.class_teacher_id) : null,
  //       headmaster_id: formData.headmaster_id ? parseInt(formData.headmaster_id) : null,
        
  //       // Publication Status
  //       is_published: Boolean(formData.is_published)
  //     };
      
  //     // Log the payload for debugging
  //     console.log('📤 Submitting complete result payload:', JSON.stringify(payload, null, 2));
      
  //     // =====================
  //     // STEP 4: SINGLE API CALL TO CREATE RESULT WITH ALL NESTED DATA
  //     // =====================
  //     let response;
  //     if (selectedResult) {
  //       // UPDATE EXISTING RESULT
  //       response = await resultService.updateStudentResult(selectedResult.id, payload);
  //       setSuccess('✅ Result updated successfully!');
  //       console.log('✅ Result updated:', response);
  //     } else {
  //       // CREATE NEW RESULT - ONE CALL ONLY!
  //       response = await resultService.createStudentResult(payload);
  //       setSuccess('✅ Result created successfully!');
  //       console.log('✅ Result created:', response);
  //     }
      
  //     // =====================
  //     // STEP 5: RESET FORM AND RELOAD DATA
  //     // =====================
  //     setShowResultModal(false);
  //     setSelectedResult(null);
      
  //     // Reset form to initial state
  //     setFormData({
  //       student_id: '',
  //       session_id: '',
  //       term_id: '',
  //       class_level_id: '',
  //       frequency_of_school_opened: 0,
  //       no_of_times_present: 0,
  //       no_of_times_absent: 0,
  //       weight_beginning_of_term: '',
  //       weight_end_of_term: '',
  //       height_beginning_of_term: '',
  //       height_end_of_term: '',
  //       subject_scores: [],
  //       psychomotor_skills: {
  //         handwriting: 3,
  //         verbal_fluency: 3,
  //         drawing_and_painting: 3,
  //         tools_handling: 3,
  //         sports: 3,
  //         musical_skills: 3,
  //         dancing: 3,
  //         craft_work: 3
  //       },
  //       affective_domains: {
  //         punctuality: 3,
  //         neatness: 3,
  //         politeness: 3,
  //         honesty: 3,
  //         cooperation_with_others: 3,
  //         leadership: 3,
  //         altruism: 3,
  //         emotional_stability: 3,
  //         health: 3,
  //         attitude: 3,
  //         attentiveness: 3,
  //         perseverance: 3,
  //         communication_skill: 3,
  //         behavioral_comment: ''
  //       },
  //       class_teacher_comment: '',
  //       headmaster_comment: '',
  //       next_term_begins_on: '',
  //       next_term_fees: '',
  //       is_promoted: false,
  //       class_teacher_id: '',
  //       headmaster_id: '',
  //       is_published: false
  //     });
      
  //     setCurrentStep(1);
      
  //     // Reload data after a short delay
  //     setTimeout(() => {
  //       loadAllData();
  //     }, 500);
      
  //   } catch (err) {
  //     console.error('❌ Error saving result:', err);
      
  //     let errorMessage = 'Failed to save result';
  //     let shouldGoToStep = null;
      
  //     if (err.response?.data) {
  //       const errorData = err.response.data;
  //       console.error('🔍 Backend validation error:', errorData);
        
  //       // Handle specific field validation errors
  //       if (errorData.student_id) {
  //         errorMessage = `Student Error: ${Array.isArray(errorData.student_id) ? errorData.student_id.join(', ') : errorData.student_id}`;
  //         shouldGoToStep = 1;
  //       } else if (errorData.class_level_id) {
  //         errorMessage = `Class Level Error: ${Array.isArray(errorData.class_level_id) ? errorData.class_level_id.join(', ') : errorData.class_level_id}`;
  //         shouldGoToStep = 1;
  //       } else if (errorData.session_id) {
  //         errorMessage = `Session Error: ${Array.isArray(errorData.session_id) ? errorData.session_id.join(', ') : errorData.session_id}`;
  //         shouldGoToStep = 1;
  //       } else if (errorData.term_id) {
  //         errorMessage = `Term Error: ${Array.isArray(errorData.term_id) ? errorData.term_id.join(', ') : errorData.term_id}`;
  //         shouldGoToStep = 1;
  //       } else if (errorData.subject_scores) {
  //         errorMessage = 'Subject Scores Error: Please check all subject scores are valid';
  //         shouldGoToStep = 4;
  //       } else if (errorData.psychomotor_skills) {
  //         errorMessage = 'Psychomotor Skills Error: Please check all ratings are valid (1-5)';
  //         shouldGoToStep = 5;
  //       } else if (errorData.affective_domains) {
  //         errorMessage = 'Affective Domains Error: Please check all ratings are valid (1-5)';
  //         shouldGoToStep = 5;
  //       } else if (errorData.detail) {
  //         errorMessage = errorData.detail;
  //       } else if (errorData.message) {
  //         errorMessage = errorData.message;
  //       } else if (errorData.non_field_errors) {
  //         errorMessage = Array.isArray(errorData.non_field_errors)
  //           ? errorData.non_field_errors.join('\n')
  //           : errorData.non_field_errors;
  //       } else {
  //         const fieldErrors = [];
  //         Object.entries(errorData).forEach(([field, messages]) => {
  //           if (field === 'success' || field === 'status') return;
  //           if (Array.isArray(messages)) {
  //             fieldErrors.push(`${field}: ${messages.join(', ')}`);
  //           } else if (typeof messages === 'string') {
  //             fieldErrors.push(`${field}: ${messages}`);
  //           }
  //         });
  //         if (fieldErrors.length > 0) {
  //           errorMessage = 'Validation Errors:\n' + fieldErrors.join('\n');
  //         }
  //       }
  //     } else if (err.message) {
  //       errorMessage = err.message;
  //     }
      
  //     // Set error message
  //     setError(errorMessage);
      
  //     // Navigate to the appropriate step if needed
  //     if (shouldGoToStep) {
  //       setCurrentStep(shouldGoToStep);
  //     }
      
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const submitResult = async () => {
    console.log('=== SUBMIT CALLED ===');
    console.log('subject_scores:', JSON.stringify(formData.subject_scores));
    console.log('psychomotor_skills:', JSON.stringify(formData.psychomotor_skills));
    console.log('affective_domains:', JSON.stringify(formData.affective_domains));
    console.log('student_id:', formData.student_id);
    console.log('session_id:', formData.session_id);
    console.log('term_id:', formData.term_id);
    console.log('class_level_id:', formData.class_level_id);
    try {
      setLoading(true);
      setError('');

      // Validate Step 1
      if (!formData.student_id) { setCurrentStep(1); throw new Error('Please select a student'); }
      if (!formData.session_id) { setCurrentStep(1); throw new Error('Please select a session'); }
      if (!formData.term_id) { setCurrentStep(1); throw new Error('Please select a term'); }
      if (!formData.class_level_id) { setCurrentStep(1); throw new Error('Please select a class level'); }

      // Validate Step 4
      if (!formData.subject_scores || formData.subject_scores.length === 0) {
        setCurrentStep(4);
        throw new Error('Please add at least one subject score');
      }
      const invalidScores = formData.subject_scores.filter(score => !score.subject_id);
      if (invalidScores.length > 0) {
        setCurrentStep(4);
        throw new Error(`Please select a subject for all subject scores (${invalidScores.length} missing)`);
      }
      const outOfRangeScores = formData.subject_scores.filter(score => {
        const ca = parseFloat(score.ca_score) || 0;
        const exam = parseFloat(score.exam_score) || 0;
        return ca < 0 || ca > 40 || exam < 0 || exam > 60;
      });
      if (outOfRangeScores.length > 0) {
        setCurrentStep(4);
        throw new Error('Some scores are out of range. CA must be 0-40, Exam must be 0-60');
      }

      // =====================
      // BUILD PAYLOAD — EVERY FIELD EXPLICITLY SANITIZED
      // =====================
      const payload = {
        // Step 1 fields
        student_id: parseInt(formData.student_id),
        session_id: parseInt(formData.session_id),
        term_id: parseInt(formData.term_id),
        class_level_id: parseInt(formData.class_level_id),

        // Step 2 fields
        frequency_of_school_opened: parseInt(formData.frequency_of_school_opened) || 0,
        no_of_times_present: parseInt(formData.no_of_times_present) || 0,
        no_of_times_absent: parseInt(formData.no_of_times_absent) || 0,

        // Step 3 fields
        weight_beginning_of_term: formData.weight_beginning_of_term
          ? parseFloat(formData.weight_beginning_of_term)
          : null,
        weight_end_of_term: formData.weight_end_of_term
          ? parseFloat(formData.weight_end_of_term)
          : null,
        height_beginning_of_term: formData.height_beginning_of_term
          ? parseFloat(formData.height_beginning_of_term)
          : null,
        height_end_of_term: formData.height_end_of_term
          ? parseFloat(formData.height_end_of_term)
          : null,

        // Step 4 — subject scores (CRITICAL: read directly from formData at call time)
        subject_scores: formData.subject_scores.map(score => ({
          subject_id: parseInt(score.subject_id) || Number(score.subject_id),
          ca_obtainable: parseInt(score.ca_obtainable) || 40,
          exam_obtainable: parseInt(score.exam_obtainable) || 60,
          total_obtainable: parseInt(score.total_obtainable) || 100,
          ca_score: parseFloat(score.ca_score) || 0,
          exam_score: parseFloat(score.exam_score) || 0,
          total_score: parseFloat(score.total_score) || 0,
          grade: score.grade || '',
          teacher_comment: score.teacher_comment || ''
        })),

        // Step 5 — psychomotor skills (CRITICAL: ensure all keys present)
        psychomotor_skills: {
          handwriting: parseInt(formData.psychomotor_skills?.handwriting) || 3,
          verbal_fluency: parseInt(formData.psychomotor_skills?.verbal_fluency) || 3,
          drawing_and_painting: parseInt(formData.psychomotor_skills?.drawing_and_painting) || 3,
          tools_handling: parseInt(formData.psychomotor_skills?.tools_handling) || 3,
          sports: parseInt(formData.psychomotor_skills?.sports) || 3,
          musical_skills: parseInt(formData.psychomotor_skills?.musical_skills) || 3,
          dancing: parseInt(formData.psychomotor_skills?.dancing) || 3,
          craft_work: parseInt(formData.psychomotor_skills?.craft_work) || 3
        },

        // Step 5 — affective domains (CRITICAL: ensure all keys present)
        affective_domains: {
          punctuality: parseInt(formData.affective_domains?.punctuality) || 3,
          neatness: parseInt(formData.affective_domains?.neatness) || 3,
          politeness: parseInt(formData.affective_domains?.politeness) || 3,
          honesty: parseInt(formData.affective_domains?.honesty) || 3,
          cooperation_with_others: parseInt(formData.affective_domains?.cooperation_with_others) || 3,
          leadership: parseInt(formData.affective_domains?.leadership) || 3,
          altruism: parseInt(formData.affective_domains?.altruism) || 3,
          emotional_stability: parseInt(formData.affective_domains?.emotional_stability) || 3,
          health: parseInt(formData.affective_domains?.health) || 3,
          attitude: parseInt(formData.affective_domains?.attitude) || 3,
          attentiveness: parseInt(formData.affective_domains?.attentiveness) || 3,
          perseverance: parseInt(formData.affective_domains?.perseverance) || 3,
          communication_skill: parseInt(formData.affective_domains?.communication_skill) || 3,
          behavioral_comment: formData.affective_domains?.behavioral_comment || ''
        },

        // Step 6 fields
        class_teacher_comment: formData.class_teacher_comment || '',
        headmaster_comment: formData.headmaster_comment || '',
        next_term_begins_on: formData.next_term_begins_on || null,
        next_term_fees: formData.next_term_fees ? parseFloat(formData.next_term_fees) : null,
        is_promoted: Boolean(formData.is_promoted),

        // CRITICAL FIX: use null not NaN when IDs are empty
        class_teacher_id: formData.class_teacher_id
          ? parseInt(formData.class_teacher_id)
          : null,
        headmaster_id: formData.headmaster_id
          ? parseInt(formData.headmaster_id)
          : null,

        is_published: Boolean(formData.is_published)
      };

      // Debug log — check browser console to confirm all data is present
      console.log('📤 FULL PAYLOAD BEING SENT:', JSON.stringify(payload, null, 2));
      console.log('📊 subject_scores count:', payload.subject_scores.length);
      console.log('🧠 psychomotor_skills:', payload.psychomotor_skills);
      console.log('💬 affective_domains:', payload.affective_domains);

      let response;
      if (selectedResult) {
        response = await resultService.updateStudentResult(selectedResult.id, payload);
        setSuccess('✅ Result updated successfully!');
      } else {
        response = await resultService.createStudentResult(payload);
        setSuccess('✅ Result created successfully!');
      }

      console.log('✅ Backend response:', response);

      setShowResultModal(false);
      setSelectedResult(null);

      setFormData({
        student_id: '',
        session_id: '',
        term_id: '',
        class_level_id: '',
        frequency_of_school_opened: 0,
        no_of_times_present: 0,
        no_of_times_absent: 0,
        weight_beginning_of_term: '',
        weight_end_of_term: '',
        height_beginning_of_term: '',
        height_end_of_term: '',
        subject_scores: [],
        psychomotor_skills: {
          handwriting: 3, verbal_fluency: 3, drawing_and_painting: 3,
          tools_handling: 3, sports: 3, musical_skills: 3,
          dancing: 3, craft_work: 3
        },
        affective_domains: {
          punctuality: 3, neatness: 3, politeness: 3, honesty: 3,
          cooperation_with_others: 3, leadership: 3, altruism: 3,
          emotional_stability: 3, health: 3, attitude: 3,
          attentiveness: 3, perseverance: 3, communication_skill: 3,
          behavioral_comment: ''
        },
        class_teacher_comment: '',
        headmaster_comment: '',
        next_term_begins_on: '',
        next_term_fees: '',
        is_promoted: false,
        class_teacher_id: '',
        headmaster_id: '',
        is_published: false
      });

      setCurrentStep(1);
      setTimeout(() => loadAllData(), 500);

    } catch (err) {
      console.error('❌ Error saving result:', err);

      let errorMessage = 'Failed to save result';
      let shouldGoToStep = null;

      if (err.response?.data) {
        const errorData = err.response.data;
        console.error('🔍 Backend validation error details:', JSON.stringify(errorData, null, 2));

        if (errorData.student_id) {
          errorMessage = `Student Error: ${Array.isArray(errorData.student_id) ? errorData.student_id.join(', ') : errorData.student_id}`;
          shouldGoToStep = 1;
        } else if (errorData.class_level_id) {
          errorMessage = `Class Level Error: ${Array.isArray(errorData.class_level_id) ? errorData.class_level_id.join(', ') : errorData.class_level_id}`;
          shouldGoToStep = 1;
        } else if (errorData.session_id) {
          errorMessage = `Session Error: ${Array.isArray(errorData.session_id) ? errorData.session_id.join(', ') : errorData.session_id}`;
          shouldGoToStep = 1;
        } else if (errorData.term_id) {
          errorMessage = `Term Error: ${Array.isArray(errorData.term_id) ? errorData.term_id.join(', ') : errorData.term_id}`;
          shouldGoToStep = 1;
        } else if (errorData.subject_scores) {
          errorMessage = `Subject Scores Error: ${JSON.stringify(errorData.subject_scores)}`;
          shouldGoToStep = 4;
        } else if (errorData.psychomotor_skills) {
          errorMessage = `Psychomotor Skills Error: ${JSON.stringify(errorData.psychomotor_skills)}`;
          shouldGoToStep = 5;
        } else if (errorData.affective_domains) {
          errorMessage = `Affective Domains Error: ${JSON.stringify(errorData.affective_domains)}`;
          shouldGoToStep = 5;
        } else if (errorData.detail) {
          errorMessage = errorData.detail;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.non_field_errors) {
          errorMessage = Array.isArray(errorData.non_field_errors)
            ? errorData.non_field_errors.join('\n')
            : errorData.non_field_errors;
        } else {
          const fieldErrors = [];
          Object.entries(errorData).forEach(([field, messages]) => {
            if (field === 'success' || field === 'status') return;
            if (Array.isArray(messages)) {
              fieldErrors.push(`${field}: ${messages.join(', ')}`);
            } else if (typeof messages === 'string') {
              fieldErrors.push(`${field}: ${messages}`);
            } else if (typeof messages === 'object') {
              fieldErrors.push(`${field}: ${JSON.stringify(messages)}`);
            }
          });
          if (fieldErrors.length > 0) {
            errorMessage = 'Validation Errors:\n' + fieldErrors.join('\n');
          }
        }
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      if (shouldGoToStep) setCurrentStep(shouldGoToStep);

    } finally {
      setLoading(false);
    }
  };

  // const handleEditResult = async (result) => {
  //   try {
  //     setLoading(true);
  //     const details = await resultService.getStudentResult(result.id);
  //     setSelectedResult(details);

  //     const extractId = (obj) => obj?.id || obj || '';

  //     setFormData({
  //       student_id: extractId(details.student),
  //       session_id: extractId(details.session),
  //       term_id: extractId(details.term),
  //       class_level_id: extractId(details.class_level),
  //       frequency_of_school_opened: details.frequency_of_school_opened || 0,
  //       no_of_times_present: details.no_of_times_present || 0,
  //       no_of_times_absent: details.no_of_times_absent || 0,
  //       weight_beginning_of_term: details.weight_beginning_of_term || '',
  //       weight_end_of_term: details.weight_end_of_term || '',
  //       height_beginning_of_term: details.height_beginning_of_term || '',
  //       height_end_of_term: details.height_end_of_term || '',
  //       subject_scores: (details.subject_scores || []).map(s => ({
  //         subject_id: extractId(s.subject),
  //         ca_obtainable: s.ca_obtainable || 40,
  //         exam_obtainable: s.exam_obtainable || 60,
  //         total_obtainable: s.total_obtainable || 100,
  //         ca_score: s.ca_score || 0,
  //         exam_score: s.exam_score || 0,
  //         total_score: s.total_score || 0,
  //         grade: s.grade || '',
  //         teacher_comment: s.teacher_comment || ''
  //       })),
  //       psychomotor_skills: details.psychomotor_skills || {
  //         handwriting: 3, verbal_fluency: 3, drawing_and_painting: 3, tools_handling: 3, sports: 3,
  //         musical_skills: 3, dancing: 3, craft_work: 3
  //       },
  //       affective_domains: details.affective_domains || {
  //         punctuality: 3, neatness: 3, politeness: 3, honesty: 3,
  //         cooperation_with_others: 3, leadership: 3, altruism: 3,
  //         emotional_stability: 3, health: 3, attitude: 3,
  //         attentiveness: 3, perseverance: 3, communication_skill: 3,
  //         behavioral_comment: ''
  //       },
  //       class_teacher_comment: details.class_teacher_comment || '',
  //       headmaster_comment: details.headmaster_comment || '',
  //       next_term_begins_on: details.next_term_begins_on || '',
  //       next_term_fees: details.next_term_fees || '',
  //       is_promoted: details.is_promoted || false,
  //       class_teacher_id: extractId(details.class_teacher),
  //       headmaster_id: extractId(details.headmaster),
  //       is_published: details.is_published || false
  //     });
  //     setCurrentStep(1);
  //     setShowResultModal(true);
  //   } catch (err) {
  //     console.error('Error loading result details:', err);
  //     setError('Failed to load result details for editing');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleEditResult = async (result) => {
    try {
      setLoading(true);
      const details = await resultService.getStudentResult(result.id);
      setSelectedResult(details);

      const extractId = (obj) => {
        if (!obj) return '';
        if (typeof obj === 'number' || typeof obj === 'string') return obj;
        return obj?.id || '';
      };

      // CRITICAL FIX: merge defaults with backend data so no key is ever missing
      const defaultPsychomotor = {
        handwriting: 3, verbal_fluency: 3, drawing_and_painting: 3,
        tools_handling: 3, sports: 3, musical_skills: 3,
        dancing: 3, craft_work: 3
      };
      const defaultAffective = {
        punctuality: 3, neatness: 3, politeness: 3, honesty: 3,
        cooperation_with_others: 3, leadership: 3, altruism: 3,
        emotional_stability: 3, health: 3, attitude: 3,
        attentiveness: 3, perseverance: 3, communication_skill: 3,
        behavioral_comment: ''
      };

      const backendPsychomotor = details.psychomotor_skills || {};
      const backendAffective = details.affective_domains || {};

      setFormData({
        student_id: extractId(details.student),
        session_id: extractId(details.session),
        term_id: extractId(details.term),
        class_level_id: extractId(details.class_level),
        frequency_of_school_opened: details.frequency_of_school_opened || 0,
        no_of_times_present: details.no_of_times_present || 0,
        no_of_times_absent: details.no_of_times_absent || 0,
        weight_beginning_of_term: details.weight_beginning_of_term || '',
        weight_end_of_term: details.weight_end_of_term || '',
        height_beginning_of_term: details.height_beginning_of_term || '',
        height_end_of_term: details.height_end_of_term || '',

        // CRITICAL: map subject_scores correctly from backend
        subject_scores: (details.subject_scores || []).map(s => ({
          subject_id: extractId(s.subject),
          ca_obtainable: parseInt(s.ca_obtainable) || 40,
          exam_obtainable: parseInt(s.exam_obtainable) || 60,
          total_obtainable: parseInt(s.total_obtainable) || 100,
          ca_score: parseFloat(s.ca_score) || 0,
          exam_score: parseFloat(s.exam_score) || 0,
          total_score: parseFloat(s.total_score) || 0,
          grade: s.grade || '',
          teacher_comment: s.teacher_comment || ''
        })),

        // CRITICAL: merge so no rating key is missing
        psychomotor_skills: {
          ...defaultPsychomotor,
          ...Object.fromEntries(
            Object.entries(backendPsychomotor)
              .filter(([k]) => k in defaultPsychomotor)
              .map(([k, v]) => [k, parseInt(v) || 3])
          )
        },

        affective_domains: {
          ...defaultAffective,
          ...Object.fromEntries(
            Object.entries(backendAffective)
              .filter(([k]) => k in defaultAffective)
              .map(([k, v]) => [k, k === 'behavioral_comment' ? (v || '') : (parseInt(v) || 3)])
          )
        },

        class_teacher_comment: details.class_teacher_comment || '',
        headmaster_comment: details.headmaster_comment || '',
        next_term_begins_on: details.next_term_begins_on || '',
        next_term_fees: details.next_term_fees || '',
        is_promoted: details.is_promoted || false,
        class_teacher_id: extractId(details.class_teacher),
        headmaster_id: extractId(details.headmaster),
        is_published: details.is_published || false
      });

      setCurrentStep(1);
      setShowResultModal(true);
    } catch (err) {
      console.error('Error loading result details:', err);
      setError('Failed to load result details for editing');
    } finally {
      setLoading(false);
    }
  };

  const handleViewResult = async (result) => {
    try {
      const details = await resultService.getStudentResult(result.id);
      setSelectedResult(details);
      setShowViewModal(true);
    } catch (err) {
      console.error('Error viewing result:', err);
      setError('Failed to load result details');
    }
  };

  const handleDeleteResult = (result) => {
    setSelectedResult(result);
    setShowDeleteModal(true);
  };

  const handlePublishResult = (result) => {
    setSelectedResult(result);
    setShowPublishModal(true);
  };


  const confirmDeleteResult = async () => {
    try {
      setLoading(true);
      await resultService.deleteStudentResult(selectedResult.id);
      setSuccess('Result deleted successfully!');
      setShowDeleteModal(false);
      setSelectedResult(null);
      setTimeout(() => loadAllData(), 500);
    } catch (err) {
      console.error('Delete error:', err);
      setError('Failed to delete result');
    } finally {
      setLoading(false);
    }
  };

  const confirmPublishResult = async () => {
    try {
      await resultService.publishResult(selectedResult.id);
      setSuccess('Result published!');
      setShowPublishModal(false);
      await loadAllData();
    } catch (err) {
      console.error('Publish error:', err);
      setError('Failed to publish result');
    }
  };

  const handleBulkUpload = async () => {
    if (!bulkFile) { setError('Select a file'); return; }
    try {
      setBulkLoading(true);
      const formData = new FormData();
      formData.append('file', bulkFile);
      await resultService.bulkUploadResults(formData);
      setSuccess('Bulk upload complete!');
      setShowBulkUploadModal(false);
      setBulkFile(null);
      await loadAllData();
    } catch (err) {
      console.error('Bulk upload error:', err);
      setError('Bulk upload failed');
    } finally {
      setBulkLoading(false);
    }
  };

  // =====================
  // PDF GENERATION – from commented version
  // =====================
  const generatePDF = async (result) => {
    try {
      const doc = new jsPDF('p', 'mm', 'a4');
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      let yPos = 20;

      doc.setFontSize(26);
      doc.setTextColor(0, 51, 102);
      doc.setFont(undefined, 'bold');
      doc.text('CONCORD TUTOR SCHOOL', pageWidth / 2, yPos, { align: 'center' });
      yPos += 8;
      doc.setFontSize(12);
      doc.setTextColor(102, 102, 102);
      doc.setFont(undefined, 'normal');
      doc.text('Official Report Card & Academic Transcript', pageWidth / 2, yPos, { align: 'center' });
      yPos += 3;
      doc.setDrawColor(0, 51, 102);
      doc.setLineWidth(0.5);
      doc.line(15, yPos, pageWidth - 15, yPos);
      yPos += 10;

      const student = result.student || {};
      let studentName = 'N/A';
      if (student.user?.get_full_name) studentName = student.user.get_full_name;
      else if (student.user?.first_name || student.user?.last_name) studentName = `${student.user.first_name || ''} ${student.user.last_name || ''}`.trim();
      else if (student.name) studentName = student.name;
      else if (student.first_name || student.last_name) studentName = `${student.first_name || ''} ${student.last_name || ''}`.trim();

      const admissionNo = student.admission_number || 'N/A';
      const className = result.class_level?.name || 'N/A';
      const sessionName = result.session?.name || 'N/A';
      const termName = result.term?.name || 'N/A';

      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.setFont(undefined, 'bold');
      doc.text('Student Name:', 15, yPos);
      doc.setFont(undefined, 'normal');
      doc.text(studentName, 60, yPos);
      doc.setFont(undefined, 'bold');
      doc.text('Admission No:', 15, yPos + 7);
      doc.setFont(undefined, 'normal');
      doc.text(admissionNo, 60, yPos + 7);
      doc.setFont(undefined, 'bold');
      doc.text('Class:', 15, yPos + 14);
      doc.setFont(undefined, 'normal');
      doc.text(className, 60, yPos + 14);
      doc.setFont(undefined, 'bold');
      doc.text('Session:', 120, yPos);
      doc.setFont(undefined, 'normal');
      doc.text(sessionName, 150, yPos);
      doc.setFont(undefined, 'bold');
      doc.text('Term:', 120, yPos + 7);
      doc.setFont(undefined, 'normal');
      doc.text(termName, 150, yPos + 7);
      doc.setFont(undefined, 'bold');
      doc.text('Date Issued:', 120, yPos + 14);
      doc.setFont(undefined, 'normal');
      doc.text(new Date().toLocaleDateString(), 150, yPos + 14);
      yPos += 21;

      doc.setFont(undefined, 'bold');
      doc.text('Attendance:', 15, yPos);
      doc.setFont(undefined, 'normal');
      const attendanceText = `${result.no_of_times_present || 0}/${result.frequency_of_school_opened || 0} days (${result.frequency_of_school_opened > 0 ? Math.round((result.no_of_times_present / result.frequency_of_school_opened) * 100) : 0}%)`;
      doc.text(attendanceText, 60, yPos);
      yPos += 12;

      doc.setFontSize(14);
      doc.setTextColor(0, 51, 102);
      doc.setFont(undefined, 'bold');
      doc.text('PERFORMANCE SUMMARY', 15, yPos);
      yPos += 2;
      doc.setDrawColor(200, 200, 200);
      doc.line(15, yPos, pageWidth - 15, yPos);
      yPos += 8;

      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      const statsData = [
        ['Total Score:', `${result.overall_total_score || 0}`, 'Percentage:', `${result.percentage || 0}%`],
        ['Overall Grade:', result.overall_grade || 'N/A', 'Position:', `${result.position_in_class || 'N/A'}/${result.number_of_pupils_in_class || 'N/A'}`],
        ['Promotion Status:', result.is_promoted ? 'PROMOTED' : 'NOT PROMOTED', '', '']
      ];
      statsData.forEach(row => {
        doc.setFont(undefined, 'bold');
        doc.text(row[0], 15, yPos);
        doc.setFont(undefined, 'normal');
        doc.text(row[1], 60, yPos);
        if (row[2]) {
          doc.setFont(undefined, 'bold');
          doc.text(row[2], 120, yPos);
          doc.setFont(undefined, 'normal');
          doc.text(row[3], 150, yPos);
        }
        yPos += 7;
      });
      yPos += 5;

      doc.setFontSize(14);
      doc.setTextColor(0, 51, 102);
      doc.setFont(undefined, 'bold');
      doc.text('ACADEMIC PERFORMANCE', 15, yPos);
      yPos += 2;
      doc.line(15, yPos, pageWidth - 15, yPos);
      yPos += 5;

      const subjectHeaders = ['Subject', 'CA (40)', 'Exam (60)', 'Total (100)', 'Grade'];
      const subjectData = (result.subject_scores || []).map(s => {
        let subjectName = 'N/A';
        if (s.subject?.name) subjectName = s.subject.name;
        else if (s.subject?.subject_name) subjectName = s.subject.subject_name;
        else if (typeof s.subject === 'string') subjectName = s.subject;
        return [subjectName, (s.ca_score || 0).toString(), (s.exam_score || 0).toString(), (s.total_score || 0).toString(), s.grade || 'N/A'];
      });

      doc.autoTable({
        head: [subjectHeaders],
        body: subjectData,
        startY: yPos,
        margin: { left: 15, right: 15 },
        styles: { fontSize: 10, cellPadding: 3 },
        headStyles: { fillColor: [0, 51, 102], textColor: 255, fontStyle: 'bold', halign: 'center' },
        columnStyles: { 0: { cellWidth: 60 }, 1: { halign: 'center' }, 2: { halign: 'center' }, 3: { halign: 'center' }, 4: { halign: 'center' } },
        alternateRowStyles: { fillColor: [245, 245, 245] }
      });
      yPos = doc.lastAutoTable.finalY + 10;

      if (result.psychomotor_skills) {
        doc.setFontSize(12);
        doc.setTextColor(0, 51, 102);
        doc.setFont(undefined, 'bold');
        doc.text('PSYCHOMOTOR SKILLS ASSESSMENT', 15, yPos);
        yPos += 7;
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        const psychomotorSkills = [
          ['Handwriting:', result.psychomotor_skills.handwriting || 3],
          ['Verbal Fluency:', result.psychomotor_skills.verbal_fluency || 3],
          ['Drawing & Painting:', result.psychomotor_skills.drawing_and_painting || 3],
          ['Sports:', result.psychomotor_skills.sports || 3],
          ['Musical Skills:', result.psychomotor_skills.musical_skills || 3],
          ['Dancing:', result.psychomotor_skills.dancing || 3]
        ];
        psychomotorSkills.forEach((skill, idx) => {
          const xPos = idx % 2 === 0 ? 15 : 110;
          doc.setFont(undefined, 'bold');
          doc.text(skill[0], xPos, yPos);
          doc.setFont(undefined, 'normal');
          doc.text(`${skill[1]}/5`, xPos + 50, yPos);
          if (idx % 2 === 1) yPos += 6;
        });
        if (psychomotorSkills.length % 2 === 1) yPos += 6;
        yPos += 8;
      }

      if (result.affective_domains) {
        doc.setFontSize(12);
        doc.setTextColor(0, 51, 102);
        doc.setFont(undefined, 'bold');
        doc.text('BEHAVIORAL ASSESSMENT', 15, yPos);
        yPos += 7;
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        const affectiveTraits = [
          ['Punctuality:', result.affective_domains.punctuality || 3],
          ['Neatness:', result.affective_domains.neatness || 3],
          ['Politeness:', result.affective_domains.politeness || 3],
          ['Honesty:', result.affective_domains.honesty || 3],
          ['Cooperation:', result.affective_domains.cooperation_with_others || 3],
          ['Leadership:', result.affective_domains.leadership || 3]
        ];
        affectiveTraits.forEach((trait, idx) => {
          const xPos = idx % 2 === 0 ? 15 : 110;
          doc.setFont(undefined, 'bold');
          doc.text(trait[0], xPos, yPos);
          doc.setFont(undefined, 'normal');
          doc.text(`${trait[1]}/5`, xPos + 50, yPos);
          if (idx % 2 === 1) yPos += 6;
        });
        if (affectiveTraits.length % 2 === 1) yPos += 6;
        yPos += 8;
      }

      doc.setFontSize(12);
      doc.setTextColor(0, 51, 102);
      doc.setFont(undefined, 'bold');
      doc.text('TEACHER COMMENTS', 15, yPos);
      yPos += 7;
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.setFont(undefined, 'normal');
      const classTeacherComment = result.class_teacher_comment || 'No comment provided.';
      doc.setFont(undefined, 'bold');
      doc.text('Class Teacher:', 15, yPos);
      doc.setFont(undefined, 'normal');
      const ctLines = doc.splitTextToSize(classTeacherComment, pageWidth - 35);
      doc.text(ctLines, 15, yPos + 5);
      yPos += 5 + ctLines.length * 5 + 8;
      const headmasterComment = result.headmaster_comment || 'No comment provided.';
      doc.setFont(undefined, 'bold');
      doc.text('Headmaster:', 15, yPos);
      doc.setFont(undefined, 'normal');
      const hmLines = doc.splitTextToSize(headmasterComment, pageWidth - 35);
      doc.text(hmLines, 15, yPos + 5);
      yPos += 5 + hmLines.length * 5 + 10;

      if (result.next_term_begins_on || result.next_term_fees) {
        doc.setFontSize(12);
        doc.setTextColor(0, 51, 102);
        doc.setFont(undefined, 'bold');
        doc.text('NEXT TERM INFORMATION', 15, yPos);
        yPos += 7;
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        if (result.next_term_begins_on) {
          doc.setFont(undefined, 'bold');
          doc.text('Next Term Begins:', 15, yPos);
          doc.setFont(undefined, 'normal');
          doc.text(new Date(result.next_term_begins_on).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }), 60, yPos);
          yPos += 7;
        }
        if (result.next_term_fees) {
          doc.setFont(undefined, 'bold');
          doc.text('Next Term Fees:', 15, yPos);
          doc.setFont(undefined, 'normal');
          doc.text(`₦${parseFloat(result.next_term_fees).toLocaleString()}`, 60, yPos);
          yPos += 10;
        }
      }

      yPos = Math.max(yPos, pageHeight - 40);
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      doc.text('Class Teacher Signature: _______________________', 15, yPos);
      doc.text('Headmaster Signature: _______________________', 110, yPos);
      yPos += 7;
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 15, yPos);

      const fileName = `${studentName.replace(/\s+/g, '_')}_${className.replace(/\s+/g, '_')}_Report_Card.pdf`;
      doc.save(fileName);
    } catch (err) {
      console.error('PDF error', err);
      setError('Failed to generate PDF');
    }
  };

  // =====================
  // HELPER FUNCTIONS
  // =====================
  const extractDisplayName = (obj) => {
    if (!obj) return 'Unknown';
    if (obj.get_full_name) return obj.get_full_name;
    if (obj.full_name) return obj.full_name;
    if (obj.name) return obj.name;
    if (obj.user) {
      if (obj.user.get_full_name) return obj.user.get_full_name;
      if (obj.user.first_name || obj.user.last_name) return `${obj.user.first_name || ''} ${obj.user.last_name || ''}`.trim();
    }
    if (obj.first_name || obj.last_name) return `${obj.first_name || ''} ${obj.last_name || ''}`.trim();
    return 'Unknown';
  };

  const getStudentImage = (student) => {
    return student.user?.profile_picture || student.profile_picture || student.student_image_url || null;
  };

  const renderGradeBadge = (grade) => {
    const config = {
      'A': { bg: 'bg-green-100', text: 'text-green-800', label: 'A - Excellent' },
      'B': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'B - Good' },
      'C': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'C - Average' },
      'D': { bg: 'bg-orange-100', text: 'text-orange-800', label: 'D - Below Average' },
      'E': { bg: 'bg-red-100', text: 'text-red-800', label: 'E - Poor' }
    }[grade] || { bg: 'bg-gray-100', text: 'text-gray-800', label: grade || 'N/A' };
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>{config.label}</span>;
  };

  const renderStatusBadge = (published) => (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
      {published ? <CheckCircle size={12} className="mr-1" /> : <XCircle size={12} className="mr-1" />}
      {published ? 'Published' : 'Draft'}
    </span>
  );


  const ViewResultModal = () => {
    if (!selectedResult) return null;
    
    const result = selectedResult;
    const student = result.student || {};
    
    // Extract student details
    const firstName = student.first_name || student.user?.first_name || '';
    const lastName = student.last_name || student.user?.last_name || '';
    const fullName = student.full_name || `${firstName} ${lastName}`.trim() || 'Unknown Student';
    const studentName = fullName;
    
    // Get image
    const studentImage = student.student_image_url || student.profile_picture || student.user?.profile_picture || null;
    
    // Get contact info
    const studentEmail = student.email || student.user?.email || null;
    const studentPhone = student.phone || student.user?.phone || null;
    
    const admissionNo = student.admission_number || 'N/A';
    const className = result.class_level?.name || 'N/A';
    const sessionName = result.session?.name || 'N/A';
    const termName = result.term?.name || 'N/A';
    
    // ========== CRITICAL FIX: Calculate percentage and grade properly ==========
    // Try to get percentage from multiple sources
    let displayPercentage = 0;
    let displayGrade = 'N/A';
    
    // Method 1: Use directly from result if available
    if (result.percentage !== null && result.percentage !== undefined && result.percentage > 0) {
      displayPercentage = parseFloat(result.percentage);
    } 
    // Method 2: Calculate from total score and obtainable marks
    else if (result.overall_total_score && result.total_obtainable && result.total_obtainable > 0) {
      displayPercentage = (parseFloat(result.overall_total_score) / parseFloat(result.total_obtainable)) * 100;
    }
    // Method 3: Calculate from subject scores
    else if (result.subject_scores && result.subject_scores.length > 0) {
      let totalScore = 0;
      let totalObtainable = 0;
      result.subject_scores.forEach(score => {
        totalScore += parseFloat(score.total_score) || 0;
        totalObtainable += parseFloat(score.total_obtainable) || 100;
      });
      if (totalObtainable > 0) {
        displayPercentage = (totalScore / totalObtainable) * 100;
      }
    }
    
    // Format percentage to 1 decimal place
    displayPercentage = Math.round(displayPercentage * 10) / 10;
    
    // Determine grade based on percentage
    if (result.overall_grade && result.overall_grade !== '') {
      displayGrade = result.overall_grade;
    } else {
      if (displayPercentage >= 80) displayGrade = 'A';
      else if (displayPercentage >= 60) displayGrade = 'B';
      else if (displayPercentage >= 50) displayGrade = 'C';
      else if (displayPercentage >= 40) displayGrade = 'D';
      else if (displayPercentage > 0) displayGrade = 'E';
    }
    
    // Debug logging
    console.log('ViewModal - Calculated values:', {
      original_percentage: result.percentage,
      calculated_percentage: displayPercentage,
      overall_grade: result.overall_grade,
      display_grade: displayGrade,
      overall_total_score: result.overall_total_score,
      total_obtainable: result.total_obtainable
    });
    
    // Extract teacher and headmaster names
    const classTeacherName = result.class_teacher?.full_name || 
                            (result.class_teacher?.first_name && result.class_teacher?.last_name 
                              ? `${result.class_teacher.first_name} ${result.class_teacher.last_name}` 
                              : result.class_teacher?.name || 'Not Assigned');
    
    const headmasterName = result.headmaster?.full_name || 
                          (result.headmaster?.first_name && result.headmaster?.last_name 
                            ? `${result.headmaster.first_name} ${result.headmaster.last_name}` 
                            : result.headmaster?.name || 'Not Assigned');

    // Handle print
    const handlePrint = () => {
      const printWindow = window.open('', '_blank');
      const printContent = generatePrintableHTML();
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.onload = () => {
        printWindow.print();
      };
    };

    // Generate printable HTML with the calculated values
    const generatePrintableHTML = () => {
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>${studentName} - Report Card</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; background: white; padding: 20px; }
            .report-card { max-width: 210mm; margin: 0 auto; background: white; }
            .header { text-align: center; border-bottom: 3px solid #003366; padding-bottom: 15px; margin-bottom: 20px; }
            .school-name { font-size: 28px; font-weight: bold; color: #003366; margin-bottom: 5px; }
            .report-title { font-size: 16px; color: #666; }
            .student-header { background: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 20px; display: flex; align-items: flex-start; }
            .student-photo { width: 100px; height: 100px; border-radius: 10px; object-fit: cover; margin-right: 20px; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
            .student-photo-placeholder { width: 100px; height: 100px; border-radius: 10px; background: #e3f2fd; display: flex; align-items: center; justify-content: center; margin-right: 20px; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.1); font-size: 36px; font-weight: bold; color: #1976d2; }
            .student-info { flex: 1; }
            .student-name { font-size: 24px; font-weight: bold; color: #003366; margin-bottom: 10px; }
            .info-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 10px; }
            .info-item { font-size: 13px; }
            .info-label { color: #666; font-weight: 500; }
            .info-value { color: #333; font-weight: 600; }
            .performance-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 25px; }
            .stat-card { text-align: center; padding: 15px; border-radius: 8px; }
            .stat-card.blue { background: #e3f2fd; }
            .stat-card.green { background: #e8f5e9; }
            .stat-card.purple { background: #f3e5f5; }
            .stat-card.yellow { background: #fff9c4; }
            .stat-value { font-size: 24px; font-weight: bold; margin-bottom: 5px; }
            .stat-value.blue { color: #1976d2; }
            .stat-value.green { color: #388e3c; }
            .stat-value.purple { color: #7b1fa2; }
            .stat-value.yellow { color: #f57c00; }
            .stat-label { font-size: 12px; color: #666; font-weight: 500; }
            .section { margin-bottom: 25px; }
            .section-title { font-size: 16px; font-weight: bold; color: #003366; margin-bottom: 15px; padding-bottom: 8px; border-bottom: 2px solid #e0e0e0; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
            th, td { padding: 10px; text-align: left; border-bottom: 1px solid #e0e0e0; }
            th { background: #f5f5f5; font-weight: 600; color: #333; font-size: 13px; }
            td { font-size: 13px; }
            .text-center { text-align: center; }
            .font-bold { font-weight: bold; }
            .grade-badge { display: inline-block; padding: 4px 12px; border-radius: 12px; font-weight: 600; font-size: 12px; }
            .grade-A { background: #e8f5e9; color: #2e7d32; }
            .grade-B { background: #e3f2fd; color: #1565c0; }
            .grade-C { background: #fff9c4; color: #f57c00; }
            .grade-D { background: #ffe0b2; color: #e65100; }
            .grade-E { background: #ffebee; color: #c62828; }
            .two-column { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px; }
            .info-box { padding: 15px; border: 1px solid #e0e0e0; border-radius: 8px; }
            .info-box-title { font-weight: 600; margin-bottom: 10px; color: #003366; }
            .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f5f5f5; }
            .info-row:last-child { border-bottom: none; }
            .skill-item { display: flex; justify-content: space-between; align-items: center; padding: 6px 0; }
            .skill-rating { display: flex; gap: 3px; }
            .rating-dot { width: 10px; height: 10px; border-radius: 50%; background: #e0e0e0; }
            .rating-dot.filled { background: #1976d2; }
            .comment-box { padding: 15px; background: #f8f9fa; border-radius: 8px; margin-bottom: 15px; }
            .comment-text { font-size: 13px; line-height: 1.6; color: #555; margin-bottom: 10px; }
            .comment-author { display: flex; align-items: center; gap: 10px; }
            .author-icon { width: 32px; height: 32px; border-radius: 50%; background: #1976d2; color: white; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: bold; }
            .author-details { font-size: 12px; }
            .author-name { font-weight: 600; color: #333; }
            .author-role { color: #666; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 2px solid #e0e0e0; font-size: 12px; color: #666; text-align: center; }
            @media print { body { padding: 0; } .report-card { max-width: 100%; } }
          </style>
        </head>
        <body>
          <div class="report-card">
            <div class="header">
              <div class="school-name">CONCORD TUTOR SCHOOL</div>
              <div class="report-title">Official Report Card & Academic Transcript</div>
            </div>
            
            <div class="student-header">
              ${studentImage ? 
                `<img src="${studentImage}" alt="${studentName}" class="student-photo" onerror="this.style.display='none';">` :
                `<div class="student-photo-placeholder">${studentName.charAt(0).toUpperCase()}</div>`
              }
              <div class="student-info">
                <div class="student-name">${studentName}</div>
                <div class="info-grid">
                  <div class="info-item"><span class="info-label">Admission No:</span> <span class="info-value">${admissionNo}</span></div>
                  <div class="info-item"><span class="info-label">Class:</span> <span class="info-value">${className}</span></div>
                  <div class="info-item"><span class="info-label">Session:</span> <span class="info-value">${sessionName}</span></div>
                  <div class="info-item"><span class="info-label">Term:</span> <span class="info-value">${termName}</span></div>
                  <div class="info-item"><span class="info-label">Date Issued:</span> <span class="info-value">${new Date().toLocaleDateString()}</span></div>
                  <div class="info-item"><span class="info-label">Attendance:</span> <span class="info-value">${result.no_of_times_present || 0}/${result.frequency_of_school_opened || 0} days</span></div>
                </div>
              </div>
            </div>
            
            <div class="performance-stats">
              <div class="stat-card blue"><div class="stat-value blue">${displayPercentage}%</div><div class="stat-label">Overall Percentage</div></div>
              <div class="stat-card green"><div class="stat-value green"><span class="grade-badge grade-${displayGrade}">${displayGrade} - ${displayGrade === 'A' ? 'Excellent' : displayGrade === 'B' ? 'Good' : displayGrade === 'C' ? 'Average' : displayGrade === 'D' ? 'Below Average' : displayGrade === 'E' ? 'Poor' : 'N/A'}</span></div><div class="stat-label">Overall Grade</div></div>
              <div class="stat-card purple"><div class="stat-value purple">${result.position_in_class || 'N/A'}/${result.number_of_pupils_in_class || 'N/A'}</div><div class="stat-label">Position in Class</div></div>
              <div class="stat-card yellow"><div class="stat-value ${result.is_promoted ? 'green' : 'yellow'}">${result.is_promoted ? 'PROMOTED' : 'NOT PROMOTED'}</div><div class="stat-label">Promotion Status</div></div>
            </div>
            
            <div class="section">
              <div class="section-title">Subject Scores</div>
              <table>
                <thead>
                  <tr><th>Subject</th><th class="text-center">CA (40)</th><th class="text-center">Exam (60)</th><th class="text-center">Total (100)</th><th class="text-center">Grade</th><th>Comment</th></tr>
                </thead>
                <tbody>
                  ${(result.subject_scores || []).map(score => {
                    const subjectName = score.subject?.name || score.subject?.subject_name || 'N/A';
                    return `
                      <tr>
                        <td>${subjectName}</td>
                        <td class="text-center">${score.ca_score || 0}</td>
                        <td class="text-center">${score.exam_score || 0}</td>
                        <td class="text-center font-bold">${score.total_score || 0}</td>
                        <td class="text-center"><span class="grade-badge grade-${score.grade}">${score.grade || 'N/A'}</span></td>
                        <td>${score.teacher_comment || '-'}</td>
                      </tr>
                    `;
                  }).join('')}
                  <tr style="background: #f5f5f5; font-weight: bold;">
                    <td>TOTAL</td>
                    <td class="text-center">${result.total_ca_score || 0}</td>
                    <td class="text-center">${result.total_exam_score || 0}</td>
                    <td class="text-center">${result.overall_total_score || 0}</td>
                    <td class="text-center"><span class="grade-badge grade-${displayGrade}">${displayGrade}</span></td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            ${result.psychomotor_skills ? `
              <div class="section">
                <div class="section-title">Psychomotor Skills Assessment</div>
                <div class="two-column">
                  ${Object.entries(result.psychomotor_skills)
                    .filter(([key]) => key !== 'id' && key !== 'result_id' && key !== 'created_at' && key !== 'updated_at')
                    .map(([skill, rating]) => `
                      <div class="skill-item">
                        <span style="text-transform: capitalize;">${skill.replace(/_/g, ' ')}:</span>
                        <div style="display: flex; align-items: center; gap: 8px;">
                          <div class="skill-rating">
                            ${[1,2,3,4,5].map(r => `<div class="rating-dot ${r <= rating ? 'filled' : ''}"></div>`).join('')}
                          </div>
                          <span class="font-bold">${rating}/5</span>
                        </div>
                      </div>
                    `).join('')}
                </div>
              </div>
            ` : ''}
            
            ${result.affective_domains ? `
              <div class="section">
                <div class="section-title">Behavioral Assessment</div>
                <div class="two-column">
                  ${Object.entries(result.affective_domains)
                    .filter(([key]) => key !== 'id' && key !== 'result_id' && key !== 'behavioral_comment' && key !== 'created_at' && key !== 'updated_at')
                    .slice(0, 8)
                    .map(([trait, rating]) => `
                      <div class="skill-item">
                        <span style="text-transform: capitalize;">${trait.replace(/_/g, ' ')}:</span>
                        <div style="display: flex; align-items: center; gap: 8px;">
                          <div class="skill-rating">
                            ${[1,2,3,4,5].map(r => `<div class="rating-dot ${r <= rating ? 'filled' : ''}"></div>`).join('')}
                          </div>
                          <span class="font-bold">${rating}/5</span>
                        </div>
                      </div>
                    `).join('')}
                </div>
                ${result.affective_domains.behavioral_comment ? `
                  <div class="comment-box" style="margin-top: 15px;">
                    <div class="comment-text"><strong>Behavioral Comment:</strong> ${result.affective_domains.behavioral_comment}</div>
                  </div>
                ` : ''}
              </div>
            ` : ''}
            
            <div class="section">
              <div class="section-title">Teacher Comments</div>
              <div class="comment-box">
                <div class="comment-text">${result.class_teacher_comment || 'No comment provided.'}</div>
                <div class="comment-author">
                  <div class="author-icon">${classTeacherName.charAt(0).toUpperCase()}</div>
                  <div class="author-details">
                    <div class="author-name">${classTeacherName}</div>
                    <div class="author-role">Class Teacher</div>
                  </div>
                </div>
              </div>
              <div class="comment-box">
                <div class="comment-text">${result.headmaster_comment || 'No comment provided.'}</div>
                <div class="comment-author">
                  <div class="author-icon">${headmasterName.charAt(0).toUpperCase()}</div>
                  <div class="author-details">
                    <div class="author-name">${headmasterName}</div>
                    <div class="author-role">Headmaster</div>
                  </div>
                </div>
              </div>
            </div>
            
            ${result.next_term_begins_on || result.next_term_fees ? `
              <div class="section">
                <div class="section-title">Next Term Information</div>
                <div class="info-grid">
                  ${result.next_term_begins_on ? `
                    <div class="info-item">
                      <span class="info-label">Next Term Begins:</span>
                      <span class="info-value">${new Date(result.next_term_begins_on).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                  ` : ''}
                  ${result.next_term_fees ? `
                    <div class="info-item">
                      <span class="info-label">Next Term Fees:</span>
                      <span class="info-value">₦${parseFloat(result.next_term_fees).toLocaleString()}</span>
                    </div>
                  ` : ''}
                </div>
              </div>
            ` : ''}
            
            <div class="footer">
              <p>This is an official document from CONCORD TUTOR SCHOOL</p>
              <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          </div>
        </body>
        </html>
      `;
    };
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
          {/* Modal Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex justify-between items-center z-10">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                <BookOpen className="text-blue-600" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">CONCORD TUTOR SCHOOL</h2>
                <p className="text-sm text-gray-600">Official Report Card & Transcript</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => generatePDF(result)}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-medium flex items-center"
              >
                <Download size={18} className="mr-2" />
                Download PDF
              </button>
              <button
                onClick={() => setShowViewModal(false)}
                className="p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl"
              >
                <X size={20} />
              </button>
            </div>
          </div>
          
          {/* Modal Content */}
          <div className="p-8">
            {/* Student Header */}
            <div className="flex items-start mb-8 bg-gray-50 rounded-2xl p-6">
              <div className="flex-shrink-0 mr-6">
                {studentImage ? (
                  <img 
                    src={studentImage} 
                    alt={studentName}
                    className="w-28 h-28 rounded-2xl object-cover border-4 border-white shadow-lg"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      const fallback = document.createElement('div');
                      fallback.className = 'w-28 h-28 bg-blue-100 rounded-2xl flex items-center justify-center border-4 border-white shadow-lg';
                      fallback.innerHTML = `<div class="text-blue-600 text-3xl font-bold">${studentName.charAt(0).toUpperCase()}</div>`;
                      e.target.parentElement.appendChild(fallback);
                    }}
                  />
                ) : (
                  <div className="w-28 h-28 bg-blue-100 rounded-2xl flex items-center justify-center border-4 border-white shadow-lg">
                    <div className="text-blue-600 text-3xl font-bold">{studentName.charAt(0).toUpperCase()}</div>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-3xl font-bold text-gray-900 mb-3">{studentName}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center">
                    <Hash size={16} className="text-gray-400 mr-2" />
                    <span className="text-gray-700 font-medium">{admissionNo}</span>
                  </div>
                  <div className="flex items-center">
                    <Bookmark size={16} className="text-gray-400 mr-2" />
                    <span className="text-gray-700 font-medium">{className}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar size={16} className="text-gray-400 mr-2" />
                    <span className="text-gray-700 font-medium">{sessionName} - {termName}</span>
                  </div>
                </div>
                {(studentEmail || studentPhone) && (
                  <div className="flex flex-wrap gap-4">
                    {studentEmail && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail size={14} className="mr-1.5" />
                        {studentEmail}
                      </div>
                    )}
                    {studentPhone && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone size={14} className="mr-1.5" />
                        {studentPhone}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            {/* Performance Stats - USING CALCULATED VALUES */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-blue-50 rounded-xl p-5 text-center">
                <div className="text-3xl font-bold text-blue-700 mb-2">{displayPercentage}%</div>
                <div className="text-sm font-medium text-blue-600">Overall Percentage</div>
              </div>
              <div className="bg-green-50 rounded-xl p-5 text-center">
                <div className="text-3xl font-bold text-green-700 mb-2">
                  {renderGradeBadge(displayGrade)}
                </div>
                <div className="text-sm font-medium text-green-600">Overall Grade</div>
              </div>
              <div className="bg-purple-50 rounded-xl p-5 text-center">
                <div className="text-3xl font-bold text-purple-700 mb-2">
                  {result.position_in_class || 'N/A'}
                  {result.number_of_pupils_in_class && `/${result.number_of_pupils_in_class}`}
                </div>
                <div className="text-sm font-medium text-purple-600">Position in Class</div>
              </div>
              <div className={`rounded-xl p-5 text-center ${result.is_promoted ? 'bg-green-50' : 'bg-yellow-50'}`}>
                <div className={`text-3xl font-bold mb-2 ${result.is_promoted ? 'text-green-700' : 'text-yellow-700'}`}>
                  {result.is_promoted ? 'PROMOTED' : 'NOT PROMOTED'}
                </div>
                <div className={`text-sm font-medium ${result.is_promoted ? 'text-green-600' : 'text-yellow-600'}`}>
                  Promotion Status
                </div>
              </div>
            </div>
            
            {/* Attendance & Physical - same as before */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h4 className="font-semibold text-gray-900 mb-4">Attendance Records</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total School Days:</span>
                    <span className="font-medium">{result.frequency_of_school_opened || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Days Present:</span>
                    <span className="font-medium">{result.no_of_times_present || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Days Absent:</span>
                    <span className="font-medium">{result.no_of_times_absent || 0}</span>
                  </div>
                  <div className="pt-3 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Attendance Rate:</span>
                      <span className="text-lg font-bold text-blue-600">
                        {result.frequency_of_school_opened > 0 
                          ? Math.round((result.no_of_times_present / result.frequency_of_school_opened) * 100)
                          : 0}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h4 className="font-semibold text-gray-900 mb-4">Physical Records</h4>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Weight (Beginning)</div>
                      <div className="font-medium">{result.weight_beginning_of_term || 'N/A'} kg</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Weight (End)</div>
                      <div className="font-medium">{result.weight_end_of_term || 'N/A'} kg</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Height (Beginning)</div>
                      <div className="font-medium">{result.height_beginning_of_term || 'N/A'} cm</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Height (End)</div>
                      <div className="font-medium">{result.height_end_of_term || 'N/A'} cm</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Subject Scores - same as before */}
            <div className="mb-8">
              <h4 className="font-semibold text-gray-900 mb-4">Subject Scores</h4>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="py-3 px-4 text-left font-medium text-gray-700">Subject</th>
                      <th className="py-3 px-4 text-center font-medium text-gray-700">CA (40)</th>
                      <th className="py-3 px-4 text-center font-medium text-gray-700">Exam (60)</th>
                      <th className="py-3 px-4 text-center font-medium text-gray-700">Total (100)</th>
                      <th className="py-3 px-4 text-center font-medium text-gray-700">Grade</th>
                      <th className="py-3 px-4 text-left font-medium text-gray-700">Comment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(result.subject_scores || []).map((score, idx) => {
                      const subjectName = score.subject?.name || score.subject?.subject_name || 'N/A';
                      return (
                        <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                <Book size={14} className="text-blue-600" />
                              </div>
                              <div className="font-medium text-gray-900">{subjectName}</div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center font-medium">{score.ca_score || 0}</td>
                          <td className="py-3 px-4 text-center font-medium">{score.exam_score || 0}</td>
                          <td className="py-3 px-4 text-center font-bold text-blue-700">{score.total_score || 0}</td>
                          <td className="py-3 px-4 text-center">{renderGradeBadge(score.grade)}</td>
                          <td className="py-3 px-4 text-sm text-gray-600">{score.teacher_comment || '-'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-50 font-semibold">
                      <td className="py-3 px-4">TOTAL</td>
                      <td className="py-3 px-4 text-center">{result.total_ca_score || 0}</td>
                      <td className="py-3 px-4 text-center">{result.total_exam_score || 0}</td>
                      <td className="py-3 px-4 text-center text-blue-700">{result.overall_total_score || 0}</td>
                      <td className="py-3 px-4 text-center">{renderGradeBadge(displayGrade)}</td>
                      <td className="py-3 px-4"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
            
            {/* Skills Assessment */}
            {(result.psychomotor_skills || result.affective_domains) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {result.psychomotor_skills && (
                  <div className="bg-white border border-gray-200 rounded-xl p-5">
                    <h4 className="font-semibold text-gray-900 mb-4">Psychomotor Skills</h4>
                    <div className="space-y-3">
                      {Object.entries(result.psychomotor_skills)
                        .filter(([key]) => key !== 'id' && key !== 'result_id' && key !== 'created_at' && key !== 'updated_at')
                        .map(([skill, rating]) => (
                          <div key={skill} className="flex justify-between items-center">
                            <span className="text-gray-600 capitalize">{skill.replace(/_/g, ' ')}:</span>
                            <div className="flex items-center">
                              <div className="flex mr-2">
                                {[1, 2, 3, 4, 5].map(r => (
                                  <div
                                    key={r}
                                    className={`w-3 h-3 rounded-full mx-0.5 ${
                                      r <= (parseInt(rating) || 0) ? 'bg-blue-500' : 'bg-gray-200'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="font-medium">{rating}/5</span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
                
                {result.affective_domains && (
                  <div className="bg-white border border-gray-200 rounded-xl p-5">
                    <h4 className="font-semibold text-gray-900 mb-4">Behavioral Assessment</h4>
                    <div className="space-y-3">
                      {Object.entries(result.affective_domains)
                        .filter(([key]) => key !== 'id' && key !== 'result_id' && key !== 'behavioral_comment' && key !== 'created_at' && key !== 'updated_at')
                        .slice(0, 8)
                        .map(([trait, rating]) => (
                          <div key={trait} className="flex justify-between items-center">
                            <span className="text-gray-600 capitalize">{trait.replace(/_/g, ' ')}:</span>
                            <div className="flex items-center">
                              <div className="flex mr-2">
                                {[1, 2, 3, 4, 5].map(r => (
                                  <div
                                    key={r}
                                    className={`w-3 h-3 rounded-full mx-0.5 ${
                                      r <= (parseInt(rating) || 0) ? 'bg-green-500' : 'bg-gray-200'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="font-medium">{rating}/5</span>
                            </div>
                          </div>
                        ))}
                      {result.affective_domains.behavioral_comment && (
                        <div className="pt-3 border-t border-gray-100">
                          <div className="text-sm text-gray-600 mb-1">Behavioral Comment:</div>
                          <div className="text-gray-700">{result.affective_domains.behavioral_comment}</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Comments */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h4 className="font-semibold text-gray-900 mb-4">Class Teacher's Comment</h4>
                <div className="text-gray-700 bg-gray-50 rounded-lg p-4 mb-4">
                  {result.class_teacher_comment || 'No comment provided.'}
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <User size={18} className="text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{classTeacherName}</div>
                    <div className="text-sm text-gray-600">Class Teacher</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h4 className="font-semibold text-gray-900 mb-4">Headmaster's Comment</h4>
                <div className="text-gray-700 bg-gray-50 rounded-lg p-4 mb-4">
                  {result.headmaster_comment || 'No comment provided.'}
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <Shield size={18} className="text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{headmasterName}</div>
                    <div className="text-sm text-gray-600">Headmaster</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Next Term Info */}
            {(result.next_term_begins_on || result.next_term_fees) && (
              <div className="bg-white border border-gray-200 rounded-xl p-5 mb-8">
                <h4 className="font-semibold text-gray-900 mb-4">Next Term Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.next_term_begins_on && (
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Next Term Begins</div>
                      <div className="font-medium">
                        {new Date(result.next_term_begins_on).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  )}
                  {result.next_term_fees && (
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Next Term Fees</div>
                      <div className="font-medium text-green-700">
                        ₦{parseFloat(result.next_term_fees).toLocaleString()}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* Modal Footer */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 px-8 py-6 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="flex space-x-3">
              {isAdmin && (
                <>
                  <button
                    onClick={() => {
                      setShowViewModal(false);
                      handleEditResult(result);
                    }}
                    className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-medium flex items-center"
                  >
                    <Edit2 size={18} className="mr-2" />
                    Edit Result
                  </button>
                  {!result.is_published && (
                    <button
                      onClick={() => {
                        setShowViewModal(false);
                        handlePublishResult(result);
                      }}
                      className="px-5 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all font-medium flex items-center"
                    >
                      <Send size={18} className="mr-2" />
                      Publish Result
                    </button>
                  )}
                </>
              )}
              <button
                onClick={handlePrint}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-medium flex items-center"
              >
                <Printer size={18} className="mr-2" />
                Print Report
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // =====================
  // STEP COMPONENTS – from commented version (simplified but integrated)
  // =====================
  // const Step1BasicInfo = () => {
  //   return (
  //     <div className="space-y-6">
  //       <StudentSearch
  //         value={formData.student_id}
  //         onChange={(val) => setFormData(prev => ({ ...prev, student_id: val }))}
  //       />
  //       <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
  //         <div>
  //           <label className="block text-sm font-medium mb-2">Session *</label>
  //           <select name="session_id" value={formData.session_id} onChange={handleFormChange} className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-blue-900">
  //             <option value="">Select</option>
  //             {sessions.map(s => <option key={s.id} value={s.id}>{s.name} {s.is_current && '(Current)'}</option>)}
  //           </select>
  //         </div>
  //         <div>
  //           <label className="block text-sm font-medium mb-2">Term *</label>
  //           <select name="term_id" value={formData.term_id} onChange={handleFormChange} className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-blue-900">
  //             <option value="">Select</option>
  //             {terms.map(t => <option key={t.id} value={t.id}>{t.name} {t.is_current && '(Current)'}</option>)}
  //           </select>
  //         </div>
  //         <div>
  //           <label className="block text-sm font-medium mb-2">Class Level *</label>
  //           <select name="class_level_id" value={formData.class_level_id} onChange={handleFormChange} className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-blue-900">
  //             <option value="">Select</option>
  //             {classLevels.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
  //           </select>
  //         </div>
  //       </div>
  //       <div className="flex justify-end">
  //         <button type="button" onClick={() => setCurrentStep(2)} disabled={!formData.student_id || !formData.session_id || !formData.term_id || !formData.class_level_id} className="px-6 py-3 bg-blue-900 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 flex items-center">
  //           Next <ChevronRight size={18} className="ml-2" />
  //         </button>
  //       </div>
  //     </div>
  //   );
  // };

  const Step1BasicInfo = () => {
    return (
      <div className="space-y-6">
        <div className="bg-blue-50 rounded-xl p-5 mb-6 border border-blue-100">
          <div className="flex items-center">
            <User className="text-blue-600 mr-3" size={22} />
            <div>
              <h3 className="font-semibold text-blue-900">Student & Academic Details</h3>
              <p className="text-sm text-blue-700">Select student and academic information</p>
            </div>
          </div>
        </div>
        
        {/* Student Search Component */}
        <StudentSearch
          value={formData.student_id}
          onChange={(value) => setFormData(prev => ({ ...prev, student_id: value }))}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Session <span className="text-red-500">*</span>
            </label>
            <select
              name="session_id"
              value={formData.session_id}
              onChange={handleFormChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            >
              <option value="">Select Session</option>
              {sessions && Array.isArray(sessions) && sessions.map(session => (
                <option key={session.id} value={session.id}>
                  {session.name} {session.is_current && '(Current)'}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Term <span className="text-red-500">*</span>
            </label>
            <select
              name="term_id"
              value={formData.term_id}
              onChange={handleFormChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            >
              <option value="">Select Term</option>
              {terms && Array.isArray(terms) && terms.map(term => (
                <option key={term.id} value={term.id}>
                  {term.name} {term.is_current && '(Current)'}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Class Level <span className="text-red-500">*</span>
            </label>
            <select
              name="class_level_id"
              value={formData.class_level_id}
              onChange={handleFormChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            >
              <option value="">Select Class Level</option>
              {classLevels && Array.isArray(classLevels) && classLevels.map(cls => (
                <option key={cls.id} value={cls.id}>
                  {cls.name} ({cls.code})
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="flex justify-between pt-6 border-t border-gray-200">
          <div></div>
          <button
            type="button"
            onClick={() => setCurrentStep(2)}
            disabled={!formData.student_id || !formData.session_id || !formData.term_id || !formData.class_level_id}
            className="px-6 py-3 bg-blue-900 text-white rounded-xl hover:bg-blue-700 transition-all font-medium flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next: Attendance
            <ChevronRight size={18} className="ml-2" />
          </button>
        </div>
      </div>
    );
  };

  const Step2Attendance = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div>
          <label className="block text-sm font-medium mb-2">Total School Days</label>
          <input type="number" name="frequency_of_school_opened" value={formData.frequency_of_school_opened} onChange={handleFormChange} className="w-full border rounded-xl p-3" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Days Present</label>
          <input type="number" name="no_of_times_present" value={formData.no_of_times_present} onChange={handleFormChange} className="w-full border rounded-xl p-3" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Days Absent</label>
          <input type="number" readOnly value={formData.frequency_of_school_opened - formData.no_of_times_present} className="w-full border rounded-xl p-3 bg-gray-50" />
        </div>
      </div>
      <div className="flex justify-between">
        <button onClick={() => setCurrentStep(1)} className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200">← Previous</button>
        <button onClick={() => setCurrentStep(3)} className="px-6 py-3 bg-blue-900 text-white rounded-xl hover:bg-blue-700 flex items-center">Next <ChevronRight size={18} className="ml-2" /></button>
      </div>
    </div>
  );

  const Step3PhysicalRecords = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="border rounded-xl p-5">
          <h4 className="font-medium mb-4">Weight (kg)</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm">Beginning</label>
              <input type="number" step="0.1" name="weight_beginning_of_term" value={formData.weight_beginning_of_term} onChange={handleFormChange} className="w-full border rounded-xl p-3" />
            </div>
            <div>
              <label className="text-sm">End</label>
              <input type="number" step="0.1" name="weight_end_of_term" value={formData.weight_end_of_term} onChange={handleFormChange} className="w-full border rounded-xl p-3" />
            </div>
          </div>
        </div>
        <div className="border rounded-xl p-5">
          <h4 className="font-medium mb-4">Height (cm)</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm">Beginning</label>
              <input type="number" step="0.1" name="height_beginning_of_term" value={formData.height_beginning_of_term} onChange={handleFormChange} className="w-full border rounded-xl p-3" />
            </div>
            <div>
              <label className="text-sm">End</label>
              <input type="number" step="0.1" name="height_end_of_term" value={formData.height_end_of_term} onChange={handleFormChange} className="w-full border rounded-xl p-3" />
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between">
        <button onClick={() => setCurrentStep(2)} className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200">← Previous</button>
        <button onClick={() => setCurrentStep(4)} className="px-6 py-3 bg-blue-900 text-white rounded-xl hover:bg-blue-700 flex items-center">Next <ChevronRight size={18} className="ml-2" /></button>
      </div>
    </div>
  );

// =====================
// STEP 4: SUBJECT SCORES COMPONENT
// =====================
  // const Step4SubjectScores = () => {
  //   return (
  //     <div className="space-y-6">
  //       <div className="bg-blue-50 rounded-xl p-5 mb-6 border border-blue-100">
  //         <div className="flex items-center">
  //           <Book className="text-blue-600 mr-3" size={22} />
  //           <div>
  //             <h3 className="font-semibold text-blue-900">Subject Scores</h3>
  //             <p className="text-sm text-blue-700">Enter scores for each subject (CA: 40%, Exam: 60%)</p>
  //           </div>
  //         </div>
  //       </div>
        
  //       <div className="flex justify-between items-center mb-6">
  //         <div>
  //           <h4 className="font-medium text-gray-900">Subjects</h4>
  //           <p className="text-sm text-gray-600">Add and edit subject scores</p>
  //         </div>
  //         <button
  //           type="button"
  //           onClick={addSubjectScore}
  //           className="px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-medium flex items-center"
  //         >
  //           <Plus size={18} className="mr-2" />
  //           Add Subject
  //         </button>
  //       </div>
        
  //       {formData.subject_scores.length === 0 ? (
  //         <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50">
  //           <Book size={36} className="text-gray-400 mx-auto mb-4" />
  //           <p className="text-gray-600 mb-2">No subjects added yet</p>
  //           <p className="text-sm text-gray-500 mb-6">Add subjects to record scores</p>
  //           <button
  //             type="button"
  //             onClick={addSubjectScore}
  //             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
  //           >
  //             Add Your First Subject
  //           </button>
  //         </div>
  //       ) : (
  //         <div className="space-y-4">
  //           {formData.subject_scores.map((score, index) => (
  //             <div key={index} className="bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-300 transition-all">
  //               <div className="flex justify-between items-start mb-5">
  //                 <div className="flex items-center">
  //                   <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
  //                     <Book size={18} className="text-blue-600" />
  //                   </div>
  //                   <div>
  //                     <h5 className="font-medium text-gray-900">Subject {index + 1}</h5>
  //                     <p className="text-sm text-gray-600">Score details</p>
  //                   </div>
  //                 </div>
  //                 <button
  //                   type="button"
  //                   onClick={() => removeSubjectScore(index)}
  //                   className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
  //                 >
  //                   <Trash2 size={18} />
  //                 </button>
  //               </div>
                
  //               <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
  //                 <div>
  //                   <label className="block text-sm font-medium text-gray-700 mb-2">
  //                     Subject <span className="text-red-500">*</span>
  //                   </label>
  //                   <select
  //                     value={score.subject_id}
  //                     onChange={(e) => handleSubjectScoreChange(index, 'subject_id', e.target.value)}
  //                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  //                   >
  //                     <option value="">Select Subject</option>
  //                     {subjects.map(subject => (
  //                       <option key={subject.id} value={subject.id}>
  //                         {subject.name} ({subject.code || subject.short_name})
  //                       </option>
  //                     ))}
  //                   </select>
  //                 </div>
                  
  //                 <div>
  //                   <label className="block text-sm font-medium text-gray-700 mb-2">
  //                     Teacher's Comment
  //                   </label>
  //                   <input
  //                     type="text"
  //                     value={score.teacher_comment}
  //                     onChange={(e) => handleSubjectScoreChange(index, 'teacher_comment', e.target.value)}
  //                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  //                     placeholder="Optional comment..."
  //                   />
  //                 </div>
  //               </div>
                
  //               <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
  //                 <div className="bg-gray-50 rounded-xl p-4">
  //                   <label className="block text-sm font-medium text-gray-700 mb-2">
  //                     CA Score (0-40)
  //                   </label>
  //                   <input
  //                     type="number"
  //                     step="0.5"
  //                     value={score.ca_score}
  //                     onChange={(e) => handleSubjectScoreChange(index, 'ca_score', e.target.value)}
  //                     className="w-full px-3 py-2 text-center text-lg font-medium border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  //                     min="0"
  //                     max="40"
  //                   />
  //                   <div className="text-xs text-gray-500 mt-2 text-center">Out of 40</div>
  //                 </div>
                  
  //                 <div className="bg-gray-50 rounded-xl p-4">
  //                   <label className="block text-sm font-medium text-gray-700 mb-2">
  //                     Exam Score (0-60)
  //                   </label>
  //                   <input
  //                     type="number"
  //                     step="0.5"
  //                     value={score.exam_score}
  //                     onChange={(e) => handleSubjectScoreChange(index, 'exam_score', e.target.value)}
  //                     className="w-full px-3 py-2 text-center text-lg font-medium border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  //                     min="0"
  //                     max="60"
  //                   />
  //                   <div className="text-xs text-gray-500 mt-2 text-center">Out of 60</div>
  //                 </div>
                  
  //                 <div className="bg-blue-50 rounded-xl p-4">
  //                   <label className="block text-sm font-medium text-gray-700 mb-2">
  //                     Total Score
  //                   </label>
  //                   <input
  //                     type="text"
  //                     value={score.total_score || 0}
  //                     readOnly
  //                     className="w-full px-3 py-2 text-center text-lg font-bold border border-blue-200 bg-white rounded-lg"
  //                   />
  //                   <div className="text-xs text-gray-500 mt-2 text-center">Out of 100</div>
  //                 </div>
                  
  //                 <div className="rounded-xl p-4" style={{ 
  //                   backgroundColor: score.grade === 'A' ? '#f0fdf4' : 
  //                                 score.grade === 'B' ? '#eff6ff' : 
  //                                 score.grade === 'C' ? '#fefce8' : 
  //                                 score.grade === 'D' ? '#fff7ed' : 
  //                                 score.grade === 'E' ? '#fef2f2' : '#f9fafb' 
  //                 }}>
  //                   <label className="block text-sm font-medium text-gray-700 mb-2">
  //                     Grade
  //                   </label>
  //                   <div className="text-center">
  //                     {renderGradeBadge(score.grade)}
  //                   </div>
  //                 </div>
  //               </div>
                
  //               {/* Performance Bar */}
  //               {score.total_score > 0 && (
  //                 <div className="mt-4 pt-4 border-t border-gray-100">
  //                   <div className="flex items-center justify-between text-sm mb-2">
  //                     <span className="text-gray-600">Performance Level:</span>
  //                     <span className={`font-medium ${
  //                       score.total_score >= 80 ? 'text-green-600' :
  //                       score.total_score >= 60 ? 'text-blue-600' :
  //                       score.total_score >= 50 ? 'text-yellow-600' :
  //                       score.total_score >= 40 ? 'text-orange-600' :
  //                       'text-red-600'
  //                     }`}>
  //                       {score.total_score >= 80 ? 'Excellent' :
  //                       score.total_score >= 60 ? 'Good' :
  //                       score.total_score >= 50 ? 'Average' :
  //                       score.total_score >= 40 ? 'Below Average' :
  //                       'Poor'}
  //                     </span>
  //                   </div>
  //                   <div className="w-full bg-gray-200 rounded-full h-2">
  //                     <div 
  //                       className={`h-2 rounded-full ${
  //                         score.total_score >= 80 ? 'bg-green-500' :
  //                         score.total_score >= 60 ? 'bg-blue-500' :
  //                         score.total_score >= 50 ? 'bg-yellow-500' :
  //                         score.total_score >= 40 ? 'bg-orange-500' :
  //                         'bg-red-500'
  //                       }`}
  //                       style={{ width: `${score.total_score}%` }}
  //                     />
  //                   </div>
  //                 </div>
  //               )}
  //             </div>
  //           ))}
  //         </div>
  //       )}
        
  //       {/* Subject Scores Summary */}
  //       {formData.subject_scores.length > 0 && (
  //         <div className="bg-white border border-gray-200 rounded-xl p-5 mt-6">
  //           <h4 className="font-medium text-gray-900 mb-4">Subject Score Summary</h4>
  //           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
  //             <div className="text-center p-4 bg-blue-50 rounded-xl">
  //               <div className="text-2xl font-bold text-blue-700">
  //                 {formData.subject_scores.reduce((sum, score) => sum + (parseFloat(score.ca_score) || 0), 0).toFixed(1)}
  //               </div>
  //               <div className="text-sm text-gray-600">Total CA</div>
  //             </div>
  //             <div className="text-center p-4 bg-green-50 rounded-xl">
  //               <div className="text-2xl font-bold text-green-700">
  //                 {formData.subject_scores.reduce((sum, score) => sum + (parseFloat(score.exam_score) || 0), 0).toFixed(1)}
  //               </div>
  //               <div className="text-sm text-gray-600">Total Exam</div>
  //             </div>
  //             <div className="text-center p-4 bg-purple-50 rounded-xl">
  //               <div className="text-2xl font-bold text-purple-700">
  //                 {formData.subject_scores.reduce((sum, score) => sum + (parseFloat(score.total_score) || 0), 0).toFixed(1)}
  //               </div>
  //               <div className="text-sm text-gray-600">Grand Total</div>
  //             </div>
  //             <div className="text-center p-4 bg-yellow-50 rounded-xl">
  //               <div className="text-2xl font-bold text-yellow-700">
  //                 {formData.subject_scores.length > 0 
  //                   ? (formData.subject_scores.reduce((sum, score) => sum + (parseFloat(score.total_score) || 0), 0) / formData.subject_scores.length).toFixed(1)
  //                   : '0.0'}
  //               </div>
  //               <div className="text-sm text-gray-600">Average Score</div>
  //             </div>
  //           </div>
  //         </div>
  //       )}
        
  //       <div className="flex justify-between pt-6 border-t border-gray-200">
  //         <button
  //           type="button"
  //           onClick={() => setCurrentStep(3)}
  //           className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-medium"
  //         >
  //           ← Previous
  //         </button>
  //         <button
  //           type="button"
  //           onClick={() => setCurrentStep(5)}
  //           disabled={formData.subject_scores.length === 0 || formData.subject_scores.some(score => !score.subject_id)}
  //           className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-medium flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
  //         >
  //           Next: Skills Assessment
  //           <ChevronRight size={18} className="ml-2" />
  //         </button>
  //       </div>
  //     </div>
  //   );
  // };

  // const Step5SkillsAssessment = () => (
  //   <div className="space-y-8">
  //     <div className="border rounded-xl p-5">
  //       <h4 className="text-lg font-semibold mb-4">Psychomotor Skills</h4>
  //       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  //         {Object.entries(formData.psychomotor_skills).map(([key, val]) => {
  //           if (typeof val !== 'number') return null;
  //           return (
  //             <div key={key} className="flex items-center justify-between">
  //               <span className="capitalize">{key.replace(/_/g, ' ')}:</span>
  //               <div className="flex space-x-2">
  //                 {[1,2,3,4,5].map(r => (
  //                   <button key={r} type="button" onClick={() => setFormData(prev => ({ ...prev, psychomotor_skills: { ...prev.psychomotor_skills, [key]: r } }))} className={`w-8 h-8 rounded-full flex items-center justify-center ${val === r ? 'bg-blue-900 text-white' : 'bg-gray-100 text-gray-500'}`}>{r}</button>
  //                 ))}
  //               </div>
  //             </div>
  //           );
  //         })}
  //       </div>
  //     </div>

  //     <div className="border rounded-xl p-5">
  //       <h4 className="text-lg font-semibold mb-4">Affective Domains</h4>
  //       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  //         {Object.entries(formData.affective_domains).map(([key, val]) => {
  //           if (key === 'behavioral_comment') return null;
  //           return (
  //             <div key={key} className="flex items-center justify-between">
  //               <span className="capitalize">{key.replace(/_/g, ' ')}:</span>
  //               <div className="flex space-x-2">
  //                 {[1,2,3,4,5].map(r => (
  //                   <button key={r} type="button" onClick={() => setFormData(prev => ({ ...prev, affective_domains: { ...prev.affective_domains, [key]: r } }))} className={`w-8 h-8 rounded-full flex items-center justify-center ${val === r ? 'bg-blue-900 text-white' : 'bg-gray-100 text-gray-500'}`}>{r}</button>
  //                 ))}
  //               </div>
  //             </div>
  //           );
  //         })}
  //       </div>
  //       <div className="mt-4">
  //         <label className="text-sm">Behavioral Comment</label>
  //         <textarea value={formData.affective_domains.behavioral_comment} onChange={(e) => setFormData(prev => ({ ...prev, affective_domains: { ...prev.affective_domains, behavioral_comment: e.target.value } }))} rows="2" className="w-full border rounded-xl p-3" />
  //       </div>
  //     </div>

  //     <div className="flex justify-between">
  //       <button onClick={() => setCurrentStep(4)} className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200">← Previous</button>
  //       <button onClick={() => setCurrentStep(6)} className="px-6 py-3 bg-blue-900 text-white rounded-xl hover:bg-blue-700 flex items-center">Next <ChevronRight size={18} className="ml-2" /></button>
  //     </div>
  //   </div>
  // );

  // const Step6FinalReview = () => {
  //   const totalCA = formData.subject_scores.reduce((sum, score) => sum + (parseFloat(score.ca_score) || 0), 0);
  //   const totalExam = formData.subject_scores.reduce((sum, score) => sum + (parseFloat(score.exam_score) || 0), 0);
  //   const totalScore = formData.subject_scores.reduce((sum, score) => sum + (parseFloat(score.total_score) || 0), 0);
  //   const avgPercentage = formData.subject_scores.length > 0 ? (totalScore / (formData.subject_scores.length * 100)) * 100 : 0;
  //   let overallGrade = '';
  //   if (avgPercentage >= 80) overallGrade = 'A';
  //   else if (avgPercentage >= 60) overallGrade = 'B';
  //   else if (avgPercentage >= 50) overallGrade = 'C';
  //   else if (avgPercentage >= 40) overallGrade = 'D';
  //   else overallGrade = 'E';

  //   const selectedStudent = students.find(s => s.id === formData.student_id);
  //   const selectedSession = sessions.find(s => s.id === formData.session_id);
  //   const selectedTerm = terms.find(t => t.id === formData.term_id);
  //   const selectedClass = classLevels.find(c => c.id === formData.class_level_id);
  //   const selectedClassTeacher = classTeachers.find(t => t.id === formData.class_teacher_id);
  //   const selectedHeadmaster = headmasters.find(h => h.id === formData.headmaster_id);

  //   return (
  //     <div className="space-y-8">
  //       <div className="bg-white border border-gray-200 rounded-xl p-6">
  //         <h4 className="text-lg font-semibold mb-6 pb-4 border-b">Result Preview</h4>
  //         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
  //           <div>
  //             <h5 className="font-medium mb-4">Student Information</h5>
  //             <div className="space-y-3">
  //               <div className="flex"><span className="text-gray-600 w-40">Full Name:</span><span className="font-medium">{selectedStudent ? extractDisplayName(selectedStudent) : 'Not selected'}</span></div>
  //               <div className="flex"><span className="text-gray-600 w-40">Admission No:</span><span className="font-medium">{selectedStudent?.admission_number || 'N/A'}</span></div>
  //               <div className="flex"><span className="text-gray-600 w-40">Class Level:</span><span className="font-medium">{selectedClass?.name || 'Not selected'}</span></div>
  //               <div className="flex"><span className="text-gray-600 w-40">Session:</span><span className="font-medium">{selectedSession?.name || 'Not selected'}</span></div>
  //               <div className="flex"><span className="text-gray-600 w-40">Term:</span><span className="font-medium">{selectedTerm?.name || 'Not selected'}</span></div>
  //               <div className="flex"><span className="text-gray-600 w-40">Attendance:</span><span className="font-medium">{formData.no_of_times_present}/{formData.frequency_of_school_opened} days</span></div>
  //             </div>
  //           </div>
  //           <div>
  //             <h5 className="font-medium mb-4">Performance Summary</h5>
  //             <div className="space-y-4">
  //               <div className="grid grid-cols-2 gap-4">
  //                 <div className="text-center p-4 bg-blue-50 rounded-xl"><div className="text-2xl font-bold text-blue-700">{totalScore.toFixed(1)}</div><div className="text-sm">Total Score</div></div>
  //                 <div className="text-center p-4 bg-green-50 rounded-xl"><div className="text-2xl font-bold text-green-700">{avgPercentage.toFixed(1)}%</div><div className="text-sm">Percentage</div></div>
  //               </div>
  //               <div className="grid grid-cols-2 gap-4">
  //                 <div className="text-center p-4 bg-purple-50 rounded-xl"><div className="text-lg font-bold">{renderGradeBadge(overallGrade)}</div><div className="text-sm">Overall Grade</div></div>
  //                 <div className="text-center p-4 bg-yellow-50 rounded-xl"><div className="text-lg font-bold">{formData.is_promoted ? 'PROMOTED' : 'NOT PROMOTED'}</div><div className="text-sm">Status</div></div>
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //       </div>

  //       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  //         <div>
  //           <label className="block text-sm font-medium mb-2">Class Teacher's Comment</label>
  //           <textarea name="class_teacher_comment" value={formData.class_teacher_comment} onChange={handleFormChange} rows="3" className="w-full border rounded-xl p-3" />
  //         </div>
  //         <div>
  //           <label className="block text-sm font-medium mb-2">Headmaster's Comment</label>
  //           <textarea name="headmaster_comment" value={formData.headmaster_comment} onChange={handleFormChange} rows="3" className="w-full border rounded-xl p-3" />
  //         </div>
  //       </div>

  //       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  //         <div>
  //           <label className="block text-sm font-medium mb-2">Next Term Begins On</label>
  //           <input type="date" name="next_term_begins_on" value={formData.next_term_begins_on} onChange={handleFormChange} className="w-full border rounded-xl p-3" />
  //         </div>
  //         <div>
  //           <label className="block text-sm font-medium mb-2">Next Term Fees (₦)</label>
  //           <input type="number" name="next_term_fees" value={formData.next_term_fees} onChange={handleFormChange} className="w-full border rounded-xl p-3" />
  //         </div>
  //       </div>

  //       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  //         <div>
  //           <label className="block text-sm font-medium mb-2">Class Teacher</label>
  //           <select name="class_teacher_id" value={formData.class_teacher_id} onChange={handleFormChange} className="w-full border rounded-xl p-3">
  //             <option value="">Select Class Teacher</option>
  //             {classTeachers.map(t => <option key={t.id} value={t.id}>{t.full_name || t.name || `Teacher ${t.id}`}</option>)}
  //           </select>
  //         </div>
  //         <div>
  //           <label className="block text-sm font-medium mb-2">Headmaster</label>
  //           <select name="headmaster_id" value={formData.headmaster_id} onChange={handleFormChange} className="w-full border rounded-xl p-3">
  //             <option value="">Select Headmaster</option>
  //             {headmasters.map(h => <option key={h.id} value={h.id}>{h.full_name || h.name || `Headmaster ${h.id}`}</option>)}
  //           </select>
  //         </div>
  //       </div>

  //       <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
  //         <div className="flex items-center">
  //           <input type="checkbox" id="is_promoted" name="is_promoted" checked={formData.is_promoted} onChange={handleFormChange} className="h-5 w-5 text-blue-600 rounded" />
  //           <label htmlFor="is_promoted" className="ml-3 text-sm font-medium">Mark student as promoted to next class</label>
  //         </div>
  //         {isAdmin && (
  //           <div className="flex items-center">
  //             <input type="checkbox" id="is_published" name="is_published" checked={formData.is_published} onChange={handleFormChange} className="h-5 w-5 text-green-600 rounded" />
  //             <label htmlFor="is_published" className="ml-3 text-sm font-medium">Publish result immediately</label>
  //           </div>
  //         )}
  //       </div>

  //       <div className="flex justify-between pt-6 border-t">
  //         <button onClick={() => setCurrentStep(5)} className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200">← Previous</button>
  //         <div className="flex space-x-4">
  //           <button onClick={() => setShowResultModal(false)} className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200">Cancel</button>
  //           <button onClick={submitResult} disabled={loading} className="px-8 py-3 bg-blue-900 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 flex items-center">
  //             {loading ? <><Loader size={18} className="animate-spin mr-2" /> Saving...</> : (selectedResult ? 'Update' : 'Create')}
  //           </button>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // };

  const Step6FinalReview = () => {
    // Calculate totals for preview
    const totalCA = formData.subject_scores.reduce((sum, score) => sum + (parseFloat(score.ca_score) || 0), 0);
    const totalExam = formData.subject_scores.reduce((sum, score) => sum + (parseFloat(score.exam_score) || 0), 0);
    const totalScore = formData.subject_scores.reduce((sum, score) => sum + (parseFloat(score.total_score) || 0), 0);
    const avgPercentage = formData.subject_scores.length > 0 ? (totalScore / (formData.subject_scores.length * 100)) * 100 : 0;
    
    // Auto-calculate grade based on average percentage
    let overallGrade = '';
    if (avgPercentage >= 80) overallGrade = 'A';
    else if (avgPercentage >= 60) overallGrade = 'B';
    else if (avgPercentage >= 50) overallGrade = 'C';
    else if (avgPercentage >= 40) overallGrade = 'D';
    else overallGrade = 'E';
    
    // Get selected details using the correct field names
    const selectedStudent = students.find(s => s.id === formData.student_id);
    const selectedSession = sessions.find(s => s.id === formData.session_id);
    const selectedTerm = terms.find(t => t.id === formData.term_id);
    const selectedClass = classLevels.find(c => c.id === formData.class_level_id);
    const selectedClassTeacher = classTeachers.find(t => t.id === formData.class_teacher_id);
    const selectedHeadmaster = headmasters.find(h => h.id === formData.headmaster_id);

    // Helper function to extract display name
    const getDisplayName = (obj) => {
      if (!obj) return 'Not selected';
      if (obj.full_name) return obj.full_name;
      if (obj.name) return obj.name;
      if (obj.user) {
        if (obj.user.get_full_name) return obj.user.get_full_name;
        if (obj.user.first_name || obj.user.last_name) return `${obj.user.first_name || ''} ${obj.user.last_name || ''}`.trim();
      }
      if (obj.first_name || obj.last_name) return `${obj.first_name || ''} ${obj.last_name || ''}`.trim();
      return 'Unknown';
    };

    return (
      <div className="space-y-8">
        <div className="bg-blue-50 rounded-xl p-5 mb-6 border border-blue-100">
          <div className="flex items-center">
            <FileText className="text-blue-600 mr-3" size={22} />
            <div>
              <h3 className="font-semibold text-blue-900">Final Review & Submission</h3>
              <p className="text-sm text-blue-700">Review all details before final submission</p>
            </div>
          </div>
        </div>
        
        {/* Preview Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-6 pb-4 border-b border-gray-100">Result Preview</h4>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Student & Academic Info */}
            <div>
              <h5 className="font-medium text-gray-900 mb-4">Student Information</h5>
              <div className="space-y-3">
                <div className="flex">
                  <span className="text-gray-600 w-40">Full Name:</span>
                  <span className="font-medium">
                    {selectedStudent ? getDisplayName(selectedStudent) : 'Not selected'}
                  </span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-40">Admission No:</span>
                  <span className="font-medium">
                    {selectedStudent?.admission_number || 'N/A'}
                  </span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-40">Class Level:</span>
                  <span className="font-medium">
                    {selectedClass?.name || 'Not selected'}
                  </span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-40">Session:</span>
                  <span className="font-medium">
                    {selectedSession?.name || 'Not selected'}
                  </span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-40">Term:</span>
                  <span className="font-medium">
                    {selectedTerm?.name || 'Not selected'}
                  </span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-40">Attendance:</span>
                  <span className="font-medium">
                    {formData.no_of_times_present || 0}/{formData.frequency_of_school_opened || 0} days
                    ({formData.frequency_of_school_opened > 0 
                      ? Math.round((formData.no_of_times_present / formData.frequency_of_school_opened) * 100)
                      : 0}%)
                  </span>
                </div>
              </div>
            </div>
            
            {/* Performance Summary */}
            <div>
              <h5 className="font-medium text-gray-900 mb-4">Performance Summary</h5>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-xl">
                    <div className="text-2xl font-bold text-blue-700">{totalScore.toFixed(1)}</div>
                    <div className="text-sm text-gray-600">Total Score</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-xl">
                    <div className="text-2xl font-bold text-green-700">{avgPercentage.toFixed(1)}%</div>
                    <div className="text-sm text-gray-600">Percentage</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-purple-50 rounded-xl">
                    <div className="text-lg font-bold text-purple-700">
                      {renderGradeBadge(overallGrade)}
                    </div>
                    <div className="text-sm text-gray-600">Overall Grade</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-xl">
                    <div className="text-lg font-bold text-yellow-700">
                      {formData.is_promoted ? 'PROMOTED' : 'NOT PROMOTED'}
                    </div>
                    <div className="text-sm text-gray-600">Status</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Subject Scores Preview */}
          {formData.subject_scores.length > 0 && (
            <div className="mt-8">
              <h5 className="font-medium text-gray-900 mb-4">Subject Scores ({formData.subject_scores.length} subjects)</h5>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="py-2 px-3 text-left font-medium">Subject</th>
                      <th className="py-2 px-3 text-center font-medium">CA</th>
                      <th className="py-2 px-3 text-center font-medium">Exam</th>
                      <th className="py-2 px-3 text-center font-medium">Total</th>
                      <th className="py-2 px-3 text-center font-medium">Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.subject_scores.map((score, idx) => {
                      const subject = subjects.find(s => s.id === score.subject_id);
                      return (
                        <tr key={idx} className="border-b border-gray-100">
                          <td className="py-2 px-3">{subject?.name || 'N/A'}</td>
                          <td className="py-2 px-3 text-center">{score.ca_score || 0}</td>
                          <td className="py-2 px-3 text-center">{score.exam_score || 0}</td>
                          <td className="py-2 px-3 text-center font-medium">{score.total_score || 0}</td>
                          <td className="py-2 px-3 text-center">{renderGradeBadge(score.grade)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
        
        {/* Final Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Class Teacher's Comment
            </label>
            <textarea
              name="class_teacher_comment"
              value={formData.class_teacher_comment}
              onChange={handleFormChange}
              rows="3"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter constructive feedback..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Headmaster's Comment
            </label>
            <textarea
              name="headmaster_comment"
              value={formData.headmaster_comment}
              onChange={handleFormChange}
              rows="3"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter final remarks..."
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Next Term Begins On
            </label>
            <input
              type="date"
              name="next_term_begins_on"
              value={formData.next_term_begins_on}
              onChange={handleFormChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Next Term Fees (₦)
            </label>
            <input
              type="number"
              name="next_term_fees"
              value={formData.next_term_fees}
              onChange={handleFormChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.00"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Class Teacher
            </label>
            <select
              name="class_teacher_id"
              value={formData.class_teacher_id}
              onChange={handleFormChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Class Teacher</option>
              {classTeachers.map(teacher => {
                const displayName = teacher.full_name || teacher.name || 
                                  (teacher.user?.get_full_name) || 
                                  `${teacher.user?.first_name || ''} ${teacher.user?.last_name || ''}`.trim() ||
                                  teacher.username || 
                                  `Teacher ${teacher.id}`;
                return (
                  <option key={teacher.id} value={teacher.id}>
                    {displayName} {teacher.role ? `(${teacher.role})` : ''}
                  </option>
                );
              })}
            </select>
            {selectedClassTeacher && (
              <p className="text-sm text-gray-600 mt-2">
                Selected: {getDisplayName(selectedClassTeacher)}
              </p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Headmaster
            </label>
            <select
              name="headmaster_id"
              value={formData.headmaster_id}
              onChange={handleFormChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Headmaster</option>
              {headmasters.map(headmaster => {
                const displayName = headmaster.full_name || 
                                  headmaster.name || 
                                  (headmaster.user?.get_full_name) ||
                                  `${headmaster.user?.first_name || ''} ${headmaster.user?.last_name || ''}`.trim() ||
                                  headmaster.username ||
                                  `Headmaster ${headmaster.id}`;
                return (
                  <option key={headmaster.id} value={headmaster.id}>
                    {displayName} {headmaster.role ? `(${headmaster.role})` : ''}
                  </option>
                );
              })}
            </select>
            {selectedHeadmaster && (
              <p className="text-sm text-gray-600 mt-2">
                Selected: {getDisplayName(selectedHeadmaster)}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_promoted"
              name="is_promoted"
              checked={formData.is_promoted}
              onChange={handleFormChange}
              className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
            />
            <label htmlFor="is_promoted" className="ml-3 text-sm font-medium text-gray-700">
              Mark student as promoted to next class
            </label>
          </div>
          
          {isAdmin && (
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_published"
                name="is_published"
                checked={formData.is_published}
                onChange={handleFormChange}
                className="h-5 w-5 text-green-600 rounded focus:ring-green-500 border-gray-300"
              />
              <label htmlFor="is_published" className="ml-3 text-sm font-medium text-gray-700">
                Publish result immediately
              </label>
            </div>
          )}
        </div>
        
        <div className="flex justify-between pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => setCurrentStep(5)}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-medium"
          >
            ← Previous
          </button>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => setShowResultModal(false)}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-medium"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={submitResult}
              disabled={loading}
              className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {selectedResult ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  {selectedResult ? 'Update Result' : 'Create Result'}
                  <Check size={18} className="ml-2" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // =====================
  // ANALYTICS SECTION – simple
  // =====================
  const AnalyticsSection = () => (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-6 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
        <h3 className="font-semibold text-gray-900">Results Analytics</h3>
        <button onClick={() => setShowAnalytics(!showAnalytics)} className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
          {showAnalytics ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>
      {showAnalytics && (
        <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 p-4 rounded-xl">
            <div className="flex items-center"><FileText className="text-blue-900 mr-3" size={20} /><div><p className="text-sm text-gray-600">Total Results</p><p className="text-2xl font-bold">{statistics.total_results}</p></div></div>
          </div>
          <div className="bg-white border border-gray-200 p-4 rounded-xl">
            <div className="flex items-center"><Send className="text-green-600 mr-3" size={20} /><div><p className="text-sm text-gray-600">Published</p><p className="text-2xl font-bold">{statistics.published_results}</p></div></div>
          </div>
          <div className="bg-white border border-gray-200 p-4 rounded-xl">
            <div className="flex items-center"><Percent className="text-purple-600 mr-3" size={20} /><div><p className="text-sm text-gray-600">Average %</p><p className="text-2xl font-bold">{statistics.average_percentage.toFixed(1)}%</p></div></div>
          </div>
          <div className="bg-white border border-gray-200 p-4 rounded-xl">
            <div className="flex items-center"><Award className="text-yellow-600 mr-3" size={20} /><div><p className="text-sm text-gray-600">Grade A</p><p className="text-2xl font-bold">{statistics.grade_distribution?.A || 0}</p></div></div>
          </div>
        </div>
      )}
    </div>
  );

  // =====================
  // MAIN RENDER
  // =====================
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Alerts */}
      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex justify-between items-center">
          <div className="flex items-center"><CheckCircle className="text-green-600 mr-3" size={20} /><span className="text-green-800">{success}</span></div>
          <button onClick={() => setSuccess('')}><X size={18} className="text-green-600" /></button>
        </div>
      )}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex justify-between items-center">
          <div className="flex items-center"><AlertCircle className="text-red-600 mr-3" size={20} /><span className="text-red-800">{error}</span></div>
          <button onClick={() => setError('')}><X size={18} className="text-red-600" /></button>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center space-x-3">
            {(isAdmin || isTeacher) && (
              <button onClick={handleAddResult} className="px-5 py-2.5 bg-blue-900 text-white rounded-xl hover:bg-blue-700 transition-all flex items-center">
                <Plus size={18} className="mr-2" /> Add Result
              </button>
            )}
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, admission, class..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900"
              />
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <button onClick={() => setShowFilters(!showFilters)} className={`px-5 py-3 border rounded-xl transition-all font-medium flex items-center ${
                  showFilters || Object.values(filters).some(f => f) ? 'bg-blue-900 text-white border-blue-900' : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                }`}>
                  <Filter size={18} className="mr-2" /> Filters
                </button>
                {showFilters && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-200 z-10 p-5">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Session</label>
                        <select value={filters.session} onChange={(e) => setFilters({...filters, session: e.target.value})} className="w-full border rounded-lg p-2.5 text-sm">
                          <option value="">All</option>
                          {sessions.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Class Level</label>
                        <select value={filters.class_level} onChange={(e) => setFilters({...filters, class_level: e.target.value})} className="w-full border rounded-lg p-2.5 text-sm">
                          <option value="">All</option>
                          {classLevels.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Status</label>
                        <select value={filters.is_published} onChange={(e) => setFilters({...filters, is_published: e.target.value})} className="w-full border rounded-lg p-2.5 text-sm">
                          <option value="">All</option>
                          <option value="true">Published</option>
                          <option value="false">Draft</option>
                        </select>
                      </div>
                      <button onClick={clearFilters} className="w-full py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm">Clear All</button>
                    </div>
                  </div>
                )}
              </div>
              <button onClick={loadAllData} className="p-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200" disabled={loading}>
                <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics */}
      <AnalyticsSection />

      {/* Results Table/Grid */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-gray-900">Student Results</h3>
            <p className="text-sm text-gray-600 mt-1">{filteredResults.length} results found</p>
          </div>
          <div className="flex space-x-2 bg-gray-100 p-1 rounded-xl">
            <button onClick={() => setViewMode('table')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'table' ? 'bg-white text-blue-900 shadow-sm' : 'text-gray-600'}`}>
              <FileText size={16} className="mr-2 inline" /> List
            </button>
            <button onClick={() => setViewMode('card')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'card' ? 'bg-white text-blue-900 shadow-sm' : 'text-gray-600'}`}>
              <Grid size={16} className="mr-2 inline" /> Cards
            </button>
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading results...</p>
          </div>
        ) : filteredResults.length === 0 ? (
          <div className="py-16 text-center">
            <FileText size={48} className="text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No results found</p>
          </div>
        ) : viewMode === 'table' ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700">Student</th>
                  <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700">Class</th>
                  <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700">Session/Term</th>
                  <th className="py-4 px-4 text-center text-sm font-semibold text-gray-700">%</th>
                  <th className="py-4 px-4 text-center text-sm font-semibold text-gray-700">Grade</th>
                  <th className="py-4 px-4 text-center text-sm font-semibold text-gray-700">Status</th>
                  <th className="py-4 px-4 text-center text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredResults.map(r => {
                  const student = r.student || {};
                  const name = extractDisplayName(student);
                  const studentImage = getStudentImage(student);
                  return (
                    <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-3 overflow-hidden">
                            {studentImage ? (
                              <img src={studentImage} alt={name} className="w-full h-full object-cover" />
                            ) : (
                              <User size={18} className="text-gray-500" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{name}</div>
                            <div className="text-sm text-gray-500">{student.admission_number || ''}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">{r.class_level?.name || 'N/A'}</td>
                      <td className="py-4 px-4">
                        <div>{r.session?.name || 'N/A'}</div>
                        <div className="text-xs text-gray-500">{r.term?.name || ''}</div>
                      </td>
                      <td className="py-4 px-4 text-center font-bold text-blue-900">
  {(() => {
    // Try to get percentage from multiple sources
    let percent = null;
    
    // Method 1: Direct percentage from result
    if (r.percentage !== null && r.percentage !== undefined && r.percentage !== '') {
      percent = parseFloat(r.percentage);
    }
    // Method 2: Calculate from total score and obtainable marks
    else if (r.overall_total_score && r.total_obtainable && parseFloat(r.total_obtainable) > 0) {
      percent = (parseFloat(r.overall_total_score) / parseFloat(r.total_obtainable)) * 100;
    }
    // Method 3: Calculate from subject scores if available
    else if (r.subject_scores && r.subject_scores.length > 0) {
      let totalScore = 0;
      let totalObtainable = 0;
      r.subject_scores.forEach(score => {
        totalScore += parseFloat(score.total_score) || 0;
        totalObtainable += parseFloat(score.total_obtainable) || 100;
      });
      if (totalObtainable > 0) {
        percent = (totalScore / totalObtainable) * 100;
      }
    }
    
    // Format and display
    if (percent !== null && !isNaN(percent) && percent > 0) {
      return `${percent.toFixed(1)}%`;
    }
    return '0%';
  })()}
</td>

<td className="py-4 px-4 text-center">
  {(() => {
    let grade = null;
    
    // Method 1: Direct grade from result
    if (r.overall_grade && r.overall_grade !== '') {
      grade = r.overall_grade;
    }
    // Method 2: Calculate grade from percentage
    else {
      let percent = null;
      
      // Try to get percentage from multiple sources
      if (r.percentage !== null && r.percentage !== undefined && r.percentage !== '') {
        percent = parseFloat(r.percentage);
      }
      else if (r.overall_total_score && r.total_obtainable && parseFloat(r.total_obtainable) > 0) {
        percent = (parseFloat(r.overall_total_score) / parseFloat(r.total_obtainable)) * 100;
      }
      else if (r.subject_scores && r.subject_scores.length > 0) {
        let totalScore = 0;
        let totalObtainable = 0;
        r.subject_scores.forEach(score => {
          totalScore += parseFloat(score.total_score) || 0;
          totalObtainable += parseFloat(score.total_obtainable) || 100;
        });
        if (totalObtainable > 0) {
          percent = (totalScore / totalObtainable) * 100;
        }
      }
      
      // Calculate grade based on Nigerian standard
      if (percent !== null && !isNaN(percent) && percent > 0) {
        if (percent >= 80) grade = 'A';
        else if (percent >= 60) grade = 'B';
        else if (percent >= 50) grade = 'C';
        else if (percent >= 40) grade = 'D';
        else if (percent > 0) grade = 'E';
      }
    }
    
    // Render the grade badge
    return renderGradeBadge(grade);
  })()}
</td>
                      <td className="py-4 px-4 text-center">{renderStatusBadge(r.is_published)}</td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <button onClick={() => handleViewResult(r)} className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200" title="View"><Eye size={16} /></button>
                          {(isAdmin || isTeacher) && (
                            <>
                              <button onClick={() => handleEditResult(r)} className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200" title="Edit"><Edit2 size={16} /></button>
                              {isAdmin && !r.is_published && (
                                <button onClick={() => handlePublishResult(r)} className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200" title="Publish"><Send size={16} /></button>
                              )}
                              <button onClick={() => handleDeleteResult(r)} className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200" title="Delete"><Trash2 size={16} /></button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResults.map(r => {
              const student = r.student || {};
              const name = extractDisplayName(student);
              const studentImage = getStudentImage(student);
              return (
                <div key={r.id} className="border border-gray-200 rounded-2xl p-5 hover:shadow-lg transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mr-3 overflow-hidden">
                        {studentImage ? (
                          <img src={studentImage} alt={name} className="w-full h-full object-cover" />
                        ) : (
                          <User size={20} className="text-gray-500" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold">{name}</div>
                        <div className="text-sm text-gray-500">{student.admission_number || ''}</div>
                      </div>
                    </div>
                    {renderStatusBadge(r.is_published)}
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-gray-600">Class:</span><span className="font-medium">{r.class_level?.name || 'N/A'}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">Session:</span><span className="font-medium">{r.session?.name || 'N/A'}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">Term:</span><span className="font-medium">{r.term?.name || 'N/A'}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">Percentage:</span><span className="font-bold text-blue-900">{r.percentage || 0}%</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">Grade:</span>{renderGradeBadge(r.overall_grade)}</div>
                  </div>
                  <div className="mt-5 pt-4 border-t border-gray-100 flex space-x-2">
                    <button onClick={() => handleViewResult(r)} className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 text-sm flex items-center justify-center">
                      <Eye size={16} className="mr-2" /> View
                    </button>
                    {(isAdmin || isTeacher) && (
                      <button onClick={() => handleEditResult(r)} className="p-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200">
                        <Edit2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modals */}
      {showResultModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">{selectedResult ? 'Edit Result' : 'Add New Result'}</h2>
              <button onClick={() => setShowResultModal(false)} className="p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl"><X size={20} /></button>
            </div>
            <div className="p-8">
              {/* Step progress */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Step {currentStep} of 6</h3>
                  <span className="text-sm font-medium text-blue-900">
                    {currentStep === 1 && 'Basic Info'}
                    {currentStep === 2 && 'Attendance'}
                    {currentStep === 3 && 'Physical'}
                    {currentStep === 4 && 'Subject Scores'}
                    {currentStep === 5 && 'Skills'}
                    {currentStep === 6 && 'Review'}
                  </span>
                </div>
                <div className="flex items-center">
                  {[1,2,3,4,5,6].map(step => (
                    <React.Fragment key={step}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep > step ? 'bg-green-500 text-white' : currentStep === step ? 'bg-blue-900 text-white border-4 border-blue-100' : 'bg-gray-100 text-gray-400'}`}>
                        {currentStep > step ? <Check size={18} /> : step}
                      </div>
                      {step < 6 && <div className={`flex-1 h-1 ${currentStep > step ? 'bg-green-500' : 'bg-gray-200'}`}></div>}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Step components */}
              {currentStep === 1 && <Step1BasicInfo />}
              {currentStep === 2 && <Step2Attendance />}
              {currentStep === 3 && <Step3PhysicalRecords />}
              {/* {currentStep === 4 && <Step4SubjectScores />}
              {currentStep === 5 && <Step5SkillsAssessment />} */}
              {currentStep === 4 && (
  <div className="space-y-6">
    <div className="bg-blue-50 rounded-xl p-5 mb-6 border border-blue-100">
      <div className="flex items-center">
        <Book className="text-blue-600 mr-3" size={22} />
        <div>
          <h3 className="font-semibold text-blue-900">Subject Scores</h3>
          <p className="text-sm text-blue-700">Enter scores for each subject (CA: 40%, Exam: 60%)</p>
        </div>
      </div>
    </div>
    <div className="flex justify-between items-center mb-6">
      <div>
        <h4 className="font-medium text-gray-900">Subjects</h4>
        <p className="text-sm text-gray-600">Add and edit subject scores</p>
      </div>
      <button type="button" onClick={addSubjectScore} className="px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-medium flex items-center">
        <Plus size={18} className="mr-2" /> Add Subject
      </button>
    </div>
    {formData.subject_scores.length === 0 ? (
      <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50">
        <Book size={36} className="text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 mb-2">No subjects added yet</p>
        <p className="text-sm text-gray-500 mb-6">Add subjects to record scores</p>
        <button type="button" onClick={addSubjectScore} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Add Your First Subject</button>
      </div>
    ) : (
      <div className="space-y-4">
        {formData.subject_scores.map((score, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-300 transition-all">
            <div className="flex justify-between items-start mb-5">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <Book size={18} className="text-blue-600" />
                </div>
                <div>
                  <h5 className="font-medium text-gray-900">Subject {index + 1}</h5>
                  <p className="text-sm text-gray-600">Score details</p>
                </div>
              </div>
              <button type="button" onClick={() => removeSubjectScore(index)} className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors">
                <Trash2 size={18} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject <span className="text-red-500">*</span></label>
                <select
                  value={score.subject_id}
                  onChange={(e) => handleSubjectScoreChange(index, 'subject_id', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Subject</option>
                  {subjects.map(subject => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name} ({subject.code || subject.short_name})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Teacher's Comment</label>
                <input
                  type="text"
                  value={score.teacher_comment}
                  onChange={(e) => handleSubjectScoreChange(index, 'teacher_comment', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Optional comment..."
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">CA Score (0-40)</label>
                <input
                  type="number" step="0.5"
                  value={score.ca_score}
                  onChange={(e) => handleSubjectScoreChange(index, 'ca_score', e.target.value)}
                  className="w-full px-3 py-2 text-center text-lg font-medium border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0" max="40"
                />
                <div className="text-xs text-gray-500 mt-2 text-center">Out of 40</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Exam Score (0-60)</label>
                <input
                  type="number" step="0.5"
                  value={score.exam_score}
                  onChange={(e) => handleSubjectScoreChange(index, 'exam_score', e.target.value)}
                  className="w-full px-3 py-2 text-center text-lg font-medium border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0" max="60"
                />
                <div className="text-xs text-gray-500 mt-2 text-center">Out of 60</div>
              </div>
              <div className="bg-blue-50 rounded-xl p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Score</label>
                <input type="text" value={score.total_score || 0} readOnly className="w-full px-3 py-2 text-center text-lg font-bold border border-blue-200 bg-white rounded-lg" />
                <div className="text-xs text-gray-500 mt-2 text-center">Out of 100</div>
              </div>
              <div className="rounded-xl p-4 bg-gray-50">
                <label className="block text-sm font-medium text-gray-700 mb-2">Grade</label>
                <div className="text-center pt-1">{renderGradeBadge(score.grade)}</div>
              </div>
            </div>
            {score.total_score > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">Performance Level:</span>
                  <span className={`font-medium ${score.total_score >= 80 ? 'text-green-600' : score.total_score >= 60 ? 'text-blue-600' : score.total_score >= 50 ? 'text-yellow-600' : score.total_score >= 40 ? 'text-orange-600' : 'text-red-600'}`}>
                    {score.total_score >= 80 ? 'Excellent' : score.total_score >= 60 ? 'Good' : score.total_score >= 50 ? 'Average' : score.total_score >= 40 ? 'Below Average' : 'Poor'}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className={`h-2 rounded-full ${score.total_score >= 80 ? 'bg-green-500' : score.total_score >= 60 ? 'bg-blue-500' : score.total_score >= 50 ? 'bg-yellow-500' : score.total_score >= 40 ? 'bg-orange-500' : 'bg-red-500'}`} style={{ width: `${score.total_score}%` }} />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    )}
    {formData.subject_scores.length > 0 && (
      <div className="bg-white border border-gray-200 rounded-xl p-5 mt-6">
        <h4 className="font-medium text-gray-900 mb-4">Subject Score Summary</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-xl">
            <div className="text-2xl font-bold text-blue-700">{formData.subject_scores.reduce((sum, s) => sum + (parseFloat(s.ca_score) || 0), 0).toFixed(1)}</div>
            <div className="text-sm text-gray-600">Total CA</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-xl">
            <div className="text-2xl font-bold text-green-700">{formData.subject_scores.reduce((sum, s) => sum + (parseFloat(s.exam_score) || 0), 0).toFixed(1)}</div>
            <div className="text-sm text-gray-600">Total Exam</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-xl">
            <div className="text-2xl font-bold text-purple-700">{formData.subject_scores.reduce((sum, s) => sum + (parseFloat(s.total_score) || 0), 0).toFixed(1)}</div>
            <div className="text-sm text-gray-600">Grand Total</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-xl">
            <div className="text-2xl font-bold text-yellow-700">
              {formData.subject_scores.length > 0 ? (formData.subject_scores.reduce((sum, s) => sum + (parseFloat(s.total_score) || 0), 0) / formData.subject_scores.length).toFixed(1) : '0.0'}
            </div>
            <div className="text-sm text-gray-600">Average Score</div>
          </div>
        </div>
      </div>
    )}
    <div className="flex justify-between pt-6 border-t border-gray-200">
      <button type="button" onClick={() => setCurrentStep(3)} className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-medium">← Previous</button>
      <button
        type="button"
        onClick={() => setCurrentStep(5)}
        disabled={formData.subject_scores.length === 0 || formData.subject_scores.some(s => !s.subject_id)}
        className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-medium flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next: Skills Assessment <ChevronRight size={18} className="ml-2" />
      </button>
    </div>
  </div>
)}

{currentStep === 5 && (
  <div className="space-y-8">
    <div className="border rounded-xl p-5">
      <h4 className="text-lg font-semibold mb-4">Psychomotor Skills</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(formData.psychomotor_skills).map(([key, val]) => {
          if (typeof val !== 'number') return null;
          return (
            <div key={key} className="flex items-center justify-between">
              <span className="capitalize">{key.replace(/_/g, ' ')}:</span>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map(r => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, psychomotor_skills: { ...prev.psychomotor_skills, [key]: r } }))}
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${val === r ? 'bg-blue-900 text-white' : 'bg-gray-100 text-gray-500'}`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
    <div className="border rounded-xl p-5">
      <h4 className="text-lg font-semibold mb-4">Affective Domains</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(formData.affective_domains).map(([key, val]) => {
          if (key === 'behavioral_comment') return null;
          return (
            <div key={key} className="flex items-center justify-between">
              <span className="capitalize">{key.replace(/_/g, ' ')}:</span>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map(r => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, affective_domains: { ...prev.affective_domains, [key]: r } }))}
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${val === r ? 'bg-blue-900 text-white' : 'bg-gray-100 text-gray-500'}`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4">
        <label className="text-sm">Behavioral Comment</label>
        <textarea
          value={formData.affective_domains.behavioral_comment}
          onChange={(e) => setFormData(prev => ({ ...prev, affective_domains: { ...prev.affective_domains, behavioral_comment: e.target.value } }))}
          rows="2"
          className="w-full border rounded-xl p-3"
        />
      </div>
    </div>
    <div className="flex justify-between">
      <button type="button" onClick={() => setCurrentStep(4)} className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200">← Previous</button>
      <button type="button" onClick={() => setCurrentStep(6)} className="px-6 py-3 bg-blue-900 text-white rounded-xl hover:bg-blue-700 flex items-center">Next <ChevronRight size={18} className="ml-2" /></button>
    </div>
  </div>
)}
              {currentStep === 6 && <Step6FinalReview />}
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && <ViewResultModal />}

      {/* Delete Modal */}
      {showDeleteModal && selectedResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-8">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6"><AlertCircle className="text-red-600" size={32} /></div>
            <h3 className="text-xl font-bold text-center mb-3">Delete Result?</h3>
            <p className="text-gray-600 text-center mb-6">This action cannot be undone.</p>
            <div className="flex space-x-4">
              <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-3.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200">Cancel</button>
              <button onClick={confirmDeleteResult} className="flex-1 py-3.5 bg-red-600 text-white rounded-xl hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Publish Modal */}
      {showPublishModal && selectedResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-8">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6"><Send className="text-green-600" size={32} /></div>
            <h3 className="text-xl font-bold text-center mb-3">Publish Result?</h3>
            <p className="text-gray-600 text-center mb-6">Once published, it will be visible to the student and parents.</p>
            <div className="flex space-x-4">
              <button onClick={() => setShowPublishModal(false)} className="flex-1 py-3.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200">Cancel</button>
              <button onClick={confirmPublishResult} className="flex-1 py-3.5 bg-green-600 text-white rounded-xl hover:bg-green-700">Publish</button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Upload Modal */}
      {showBulkUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-8">
            <h3 className="text-xl font-bold text-center mb-6">Bulk Upload Results</h3>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-3">Upload CSV File</label>
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center">
                <Upload size={32} className="text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Drag & drop your CSV file here</p>
                <p className="text-sm text-gray-500 mb-4">or</p>
                <input type="file" accept=".csv" onChange={(e) => setBulkFile(e.target.files[0])} className="hidden" id="bulkFileInput" />
                <label htmlFor="bulkFileInput" className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium inline-block cursor-pointer">Browse Files</label>
              </div>
              {bulkFile && (
                <div className="mt-4 p-3 bg-blue-50 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div><div className="font-medium text-blue-900">{bulkFile.name}</div><div className="text-sm text-blue-700">{(bulkFile.size / 1024).toFixed(2)} KB</div></div>
                    <button onClick={() => setBulkFile(null)} className="p-1 text-blue-600 hover:text-blue-800"><X size={16} /></button>
                  </div>
                </div>
              )}
            </div>
            <div className="flex space-x-4">
              <button onClick={() => setShowBulkUploadModal(false)} className="flex-1 py-3.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200">Cancel</button>
              <button onClick={handleBulkUpload} disabled={!bulkFile || bulkLoading} className="flex-1 py-3.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50">
                {bulkLoading ? <div className="flex items-center justify-center"><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>Uploading...</div> : 'Upload Results'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Result;