// school-management-frontend/src/pages/academics/Academics.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import Alert from '../../components/common/Alert';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import DataTable from '../../components/common/DataTable';
import { 
  BookOpen, 
  Users, 
  Calendar, 
  School, 
  Book, 
  Layers,
  GraduationCap,
  Plus,
  Edit,
  Trash2,
  Eye,
  ChevronRight,
  Filter,
  Search,
  RefreshCw
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import { 
  getAcademicSessions, 
  createAcademicSession, 
  updateAcademicSession, 
  deleteAcademicSession,
  getAcademicTerms,
  createAcademicTerm,
  updateAcademicTerm,
  deleteAcademicTerm,
  getPrograms,
  createProgram,
  updateProgram,
  deleteProgram,
  getClassLevels,
  createClassLevel,
  updateClassLevel,
  deleteClassLevel,
  getSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
  getClasses,
  createClass,
  updateClass,
  deleteClass,
  getClassLevelOptions,
  getClassSubjects,
  createClassSubject,
  updateClassSubject,
  deleteClassSubject,
  getAcademicData,
  getAcademicStatistics
} from '../../services/academicService';
import { handleApiError } from '../../services/api';

const Academics = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  
  // State for academic data
  const [academicData, setAcademicData] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Modal states
  const [activeModal, setActiveModal] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Form states
  const [sessionForm, setSessionForm] = useState({
    name: '',
    start_date: '',
    end_date: '',
    is_current: false,
    status: 'upcoming',
    description: ''
  });
  
  const [termForm, setTermForm] = useState({
    session: '',
    term: 'first',
    name: '',
    start_date: '',
    end_date: '',
    is_current: false,
    status: 'upcoming'
  });
  
  const [programForm, setProgramForm] = useState({
    name: '',
    program_type: 'primary',
    code: '',
    description: '',
    duration_years: 6,
    is_active: true
  });
  
  const [classLevelForm, setClassLevelForm] = useState({
    program: '',
    level: 'primary_1',
    name: '',
    code: '',
    order: 1,
    min_age: 5,
    max_age: 6,
    is_active: true
  });
  
  const [subjectForm, setSubjectForm] = useState({
    name: '',
    code: '',
    short_name: '',
    subject_type: 'core',
    stream: 'general',
    is_compulsory: true,
    is_examinable: true,
    has_practical: false,
    ca_weight: 40,
    exam_weight: 60,
    total_marks: 100,
    pass_mark: 40,
    available_for_creche: false,
    available_for_nursery: false,
    available_for_primary: false,
    available_for_jss: false,
    available_for_sss: false,
    is_active: true,
    description: ''
  });
  
  const [classForm, setClassForm] = useState({
    session: '',
    term: '',
    class_level: '',
    name: '',
    stream: '',
    max_capacity: 40,
    class_teacher: '',
    room_number: '',
    building: '',
    status: 'active',
    is_active: true
  });
  
  // Available options
  const [programs, setPrograms] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [terms, setTerms] = useState([]);
  const [classLevels, setClassLevels] = useState([]);
  const [classLevelOptions, setClassLevelOptions] = useState([]);
  const [teachers, setTeachers] = useState([]);
  
  // Data tables
  const [academicSessions, setAcademicSessions] = useState([]);
  const [academicTerms, setAcademicTerms] = useState([]);
  const [academicPrograms, setAcademicPrograms] = useState([]);
  const [academicClassLevels, setAcademicClassLevels] = useState([]);
  const [academicSubjects, setAcademicSubjects] = useState([]);
  const [academicClasses, setAcademicClasses] = useState([]);
  
  // Fetch all academic data
  useEffect(() => {
    fetchAcademicData();
  }, []);
  
  // Update fetchAcademicData function
  const fetchAcademicData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch real data
      const [sessionsData, termsData, programsData, classLevelsData, subjectsData, classesData] = await Promise.all([
        getAcademicSessions(),
        getAcademicTerms(),
        getPrograms(),
        getClassLevels(),
        getSubjects(),
        getClasses()
      ]);
      
      // Update state with real data
      setAcademicSessions(sessionsData.results || sessionsData || []);
      setAcademicTerms(termsData.results || termsData || []);
      setAcademicPrograms(programsData.results || programsData || []);
      setAcademicClassLevels(classLevelsData.results || classLevelsData || []);
      setAcademicSubjects(subjectsData.results || subjectsData || []);
      setAcademicClasses(classesData.results || classesData || []);
      
      // Set current session and term
      const currentSession = await getCurrentSession();
      const currentTerm = await getCurrentTerm();
      setCurrentSessionData(currentSession);
      setCurrentTermData(currentTerm);
      
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      console.error('Error fetching academic data:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle modal open/close
  const openModal = (modalType, item = null) => {
    setActiveModal(modalType);
    setIsEditMode(!!item);
    setSelectedItem(item);
    
    // Reset form based on modal type
    switch(modalType) {
      case 'session':
        if (item) {
          setSessionForm({
            name: item.name || '',
            start_date: item.start_date || '',
            end_date: item.end_date || '',
            is_current: item.is_current || false,
            status: item.status || 'upcoming',
            description: item.description || ''
          });
        } else {
          setSessionForm({
            name: '',
            start_date: '',
            end_date: '',
            is_current: false,
            status: 'upcoming',
            description: ''
          });
        }
        break;
        
      case 'term':
        if (item) {
          setTermForm({
            session: item.session?.id || item.session || '',
            term: item.term || 'first',
            name: item.name || '',
            start_date: item.start_date || '',
            end_date: item.end_date || '',
            is_current: item.is_current || false,
            status: item.status || 'upcoming'
          });
        } else {
          setTermForm({
            session: '',
            term: 'first',
            name: '',
            start_date: '',
            end_date: '',
            is_current: false,
            status: 'upcoming'
          });
        }
        break;
        
      case 'program':
        if (item) {
          setProgramForm({
            name: item.name || '',
            program_type: item.program_type || 'primary',
            code: item.code || '',
            description: item.description || '',
            duration_years: item.duration_years || 6,
            is_active: item.is_active || true
          });
        } else {
          setProgramForm({
            name: '',
            program_type: 'primary',
            code: '',
            description: '',
            duration_years: 6,
            is_active: true
          });
        }
        break;
        
      case 'class-level':
        if (item) {
          setClassLevelForm({
            program: item.program?.id || item.program || '',
            level: item.level || 'primary_1',
            name: item.name || '',
            code: item.code || '',
            order: item.order || 1,
            min_age: item.min_age || 5,
            max_age: item.max_age || 6,
            is_active: item.is_active || true
          });
        } else {
          setClassLevelForm({
            program: '',
            level: 'primary_1',
            name: '',
            code: '',
            order: 1,
            min_age: 5,
            max_age: 6,
            is_active: true
          });
        }
        break;
        
      case 'subject':
        if (item) {
          setSubjectForm({
            name: item.name || '',
            code: item.code || '',
            short_name: item.short_name || '',
            subject_type: item.subject_type || 'core',
            stream: item.stream || 'general',
            is_compulsory: item.is_compulsory || true,
            is_examinable: item.is_examinable || true,
            has_practical: item.has_practical || false,
            ca_weight: item.ca_weight || 40,
            exam_weight: item.exam_weight || 60,
            total_marks: item.total_marks || 100,
            pass_mark: item.pass_mark || 40,
            available_for_creche: item.available_for_creche || false,
            available_for_nursery: item.available_for_nursery || false,
            available_for_primary: item.available_for_primary || false,
            available_for_jss: item.available_for_jss || false,
            available_for_sss: item.available_for_sss || false,
            is_active: item.is_active || true,
            description: item.description || ''
          });
        } else {
          setSubjectForm({
            name: '',
            code: '',
            short_name: '',
            subject_type: 'core',
            stream: 'general',
            is_compulsory: true,
            is_examinable: true,
            has_practical: false,
            ca_weight: 40,
            exam_weight: 60,
            total_marks: 100,
            pass_mark: 40,
            available_for_creche: false,
            available_for_nursery: false,
            available_for_primary: false,
            available_for_jss: false,
            available_for_sss: false,
            is_active: true,
            description: ''
          });
        }
        break;
        
      case 'class':
        if (item) {
          setClassForm({
            session: item.session?.id || item.session || '',
            term: item.term?.id || item.term || '',
            class_level: item.class_level?.id || item.class_level || '',
            name: item.name || '',
            stream: item.stream || '',
            max_capacity: item.max_capacity || 40,
            class_teacher: item.class_teacher?.id || item.class_teacher || '',
            room_number: item.room_number || '',
            building: item.building || '',
            status: item.status || 'active',
            is_active: item.is_active || true
          });
        } else {
          setClassForm({
            session: '',
            term: '',
            class_level: '',
            name: '',
            stream: '',
            max_capacity: 40,
            class_teacher: '',
            room_number: '',
            building: '',
            status: 'active',
            is_active: true
          });
        }
        break;
    }
  };
  
  const closeModal = () => {
    setActiveModal(null);
    setSelectedItem(null);
    setIsEditMode(false);
  };
  
  // Form submission handlers
  const handleSessionSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      
      if (isEditMode) {
        await updateAcademicSession(selectedItem.id, sessionForm);
        setSuccess('Academic session updated successfully!');
      } else {
        await createAcademicSession(sessionForm);
        setSuccess('Academic session created successfully!');
      }
      
      closeModal();
      fetchAcademicData();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
    }
  };
  
  const handleTermSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      
      if (isEditMode) {
        await updateAcademicTerm(selectedItem.id, termForm);
        setSuccess('Academic term updated successfully!');
      } else {
        await createAcademicTerm(termForm);
        setSuccess('Academic term created successfully!');
      }
      
      closeModal();
      fetchAcademicData();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
    }
  };
  
  const handleProgramSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      
      if (isEditMode) {
        await updateProgram(selectedItem.id, programForm);
        setSuccess('Program updated successfully!');
      } else {
        await createProgram(programForm);
        setSuccess('Program created successfully!');
      }
      
      closeModal();
      fetchAcademicData();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
    }
  };
  
  const handleClassLevelSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      
      if (isEditMode) {
        await updateClassLevel(selectedItem.id, classLevelForm);
        setSuccess('Class level updated successfully!');
      } else {
        await createClassLevel(classLevelForm);
        setSuccess('Class level created successfully!');
      }
      
      closeModal();
      fetchAcademicData();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
    }
  };
  
  const handleSubjectSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      
      if (isEditMode) {
        await updateSubject(selectedItem.id, subjectForm);
        setSuccess('Subject updated successfully!');
      } else {
        await createSubject(subjectForm);
        setSuccess('Subject created successfully!');
      }
      
      closeModal();
      fetchAcademicData();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
    }
  };
  
  const handleClassSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      
      if (isEditMode) {
        await updateClass(selectedItem.id, classForm);
        setSuccess('Class updated successfully!');
      } else {
        await createClass(classForm);
        setSuccess('Class created successfully!');
      }
      
      closeModal();
      fetchAcademicData();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
    }
  };
  
  // Delete handlers
  const handleDelete = async (type, id) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) {
      return;
    }
    
    try {
      setError('');
      
      switch(type) {
        case 'session':
          await deleteAcademicSession(id);
          break;
        case 'term':
          await deleteAcademicTerm(id);
          break;
        case 'program':
          await deleteProgram(id);
          break;
        case 'class-level':
          await deleteClassLevel(id);
          break;
        case 'subject':
          await deleteSubject(id);
          break;
        case 'class':
          await deleteClass(id);
          break;
      }
      
      setSuccess(`${type.replace('-', ' ')} deleted successfully!`);
      fetchAcademicData();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
    }
  };
  
  // View details
  const viewDetails = (type, item) => {
    alert(`Details for ${type}:\n\n${JSON.stringify(item, null, 2)}`);
  };
  
  // Academic cards data
  const academicCards = [
    {
      title: 'Academic Sessions',
      description: 'Manage academic years/sessions',
      icon: <Calendar className="text-primary-600" size={24} />,
      color: 'primary',
      count: stats?.totalSessions || academicSessions.length,
      modalType: 'session',
      data: academicSessions,
      columns: [
        { key: 'name', label: 'Name' },
        { key: 'start_date', label: 'Start Date' },
        { key: 'end_date', label: 'End Date' },
        { key: 'status', label: 'Status' },
        { key: 'is_current', label: 'Current', format: (val) => val ? 'Yes' : 'No' }
      ]
    },
    {
      title: 'Academic Terms',
      description: 'Manage terms within sessions',
      icon: <Calendar className="text-secondary-600" size={24} />,
      color: 'secondary',
      count: academicTerms.length,
      modalType: 'term',
      data: academicTerms,
      columns: [
        { key: 'name', label: 'Name' },
        { key: 'term', label: 'Term' },
        { key: 'session', label: 'Session', format: (val) => val?.name || val },
        { key: 'start_date', label: 'Start Date' },
        { key: 'end_date', label: 'End Date' }
      ]
    },
    {
      title: 'Programs',
      description: 'Manage academic programs',
      icon: <School className="text-success-600" size={24} />,
      color: 'success',
      count: stats?.totalPrograms || academicPrograms.length,
      modalType: 'program',
      data: academicPrograms,
      columns: [
        { key: 'name', label: 'Name' },
        { key: 'code', label: 'Code' },
        { key: 'program_type', label: 'Type' },
        { key: 'duration_years', label: 'Duration (Years)' },
        { key: 'is_active', label: 'Active', format: (val) => val ? 'Yes' : 'No' }
      ]
    },
    {
      title: 'Class Levels',
      description: 'Manage class levels and grades',
      icon: <Layers className="text-warning-600" size={24} />,
      color: 'warning',
      count: stats?.totalClassLevels || academicClassLevels.length,
      modalType: 'class-level',
      data: academicClassLevels,
      columns: [
        { key: 'name', label: 'Name' },
        { key: 'code', label: 'Code' },
        { key: 'level', label: 'Level' },
        { key: 'program', label: 'Program', format: (val) => val?.name || val },
        { key: 'is_active', label: 'Active', format: (val) => val ? 'Yes' : 'No' }
      ]
    },
    {
      title: 'Subjects',
      description: 'Manage all subjects',
      icon: <Book className="text-info-600" size={24} />,
      color: 'info',
      count: stats?.totalSubjects || academicSubjects.length,
      modalType: 'subject',
      data: academicSubjects,
      columns: [
        { key: 'name', label: 'Name' },
        { key: 'code', label: 'Code' },
        { key: 'subject_type', label: 'Type' },
        { key: 'stream', label: 'Stream' },
        { key: 'is_compulsory', label: 'Compulsory', format: (val) => val ? 'Yes' : 'No' },
        { key: 'pass_mark', label: 'Pass Mark' }
      ]
    },
    {
      title: 'Classes',
      description: 'Manage class sections',
      icon: <Users className="text-purple-600" size={24} />,
      color: 'purple',
      count: academicClasses.length,
      modalType: 'class',
      data: academicClasses,
      columns: [
        { key: 'name', label: 'Name' },
        { key: 'code', label: 'Code' },
        { key: 'class_level', label: 'Level', format: (val) => val?.name || val },
        { key: 'session', label: 'Session', format: (val) => val?.name || val },
        { key: 'current_enrollment', label: 'Enrollment' },
        { key: 'max_capacity', label: 'Capacity' }
      ]
    }
  ];
  
  // Program type options
  const programTypeOptions = [
    { value: 'creche', label: 'Creche' },
    { value: 'nursery', label: 'Nursery' },
    { value: 'primary', label: 'Primary School' },
    { value: 'junior_secondary', label: 'Junior Secondary School (JSS)' },
    { value: 'senior_secondary', label: 'Senior Secondary School (SSS)' }
  ];
  
  // Class level options (from LEVEL_CHOICES)
  const levelOptions = [
    { value: 'creche', label: 'Creche' },
    { value: 'nursery_1', label: 'Nursery 1' },
    { value: 'nursery_2', label: 'Nursery 2' },
    { value: 'kg_1', label: 'Kindergarten 1 (KG 1)' },
    { value: 'kg_2', label: 'Kindergarten 2 (KG 2)' },
    { value: 'primary_1', label: 'Primary 1 (Basic 1)' },
    { value: 'primary_2', label: 'Primary 2 (Basic 2)' },
    { value: 'primary_3', label: 'Primary 3 (Basic 3)' },
    { value: 'primary_4', label: 'Primary 4 (Basic 4)' },
    { value: 'primary_5', label: 'Primary 5 (Basic 5)' },
    { value: 'primary_6', label: 'Primary 6 (Basic 6)' },
    { value: 'jss_1', label: 'JSS 1' },
    { value: 'jss_2', label: 'JSS 2' },
    { value: 'jss_3', label: 'JSS 3' },
    { value: 'sss_1', label: 'SSS 1' },
    { value: 'sss_2', label: 'SSS 2' },
    { value: 'sss_3', label: 'SSS 3' }
  ];
  
  // Term options
  const termOptions = [
    { value: 'first', label: 'First Term' },
    { value: 'second', label: 'Second Term' },
    { value: 'third', label: 'Third Term' }
  ];
  
  // Subject type options
  const subjectTypeOptions = [
    { value: 'core', label: 'Core Subject' },
    { value: 'elective', label: 'Elective Subject' },
    { value: 'vocational', label: 'Vocational Subject' },
    { value: 'religious', label: 'Religious Studies' },
    { value: 'language', label: 'Language' },
    { value: 'science', label: 'Science' },
    { value: 'arts', label: 'Arts/Humanities' },
    { value: 'commercial', label: 'Commercial/Business' },
    { value: 'technical', label: 'Technical' },
    { value: 'pre_school', label: 'Pre-School Subject' }
  ];
  
  // Stream options
  const streamOptions = [
    { value: 'science', label: 'Science Stream' },
    { value: 'commercial', label: 'Commercial Stream' },
    { value: 'arts', label: 'Arts/Humanities Stream' },
    { value: 'general', label: 'General (All Streams)' },
    { value: 'technical', label: 'Technical Stream' },
    { value: 'pre_school', label: 'Pre-School' }
  ];
  
  // Class stream options
  const classStreamOptions = [
    { value: 'science', label: 'Science' },
    { value: 'commercial', label: 'Commercial' },
    { value: 'arts', label: 'Arts/Humanities' },
    { value: 'general', label: 'General' }
  ];
  
  // Status options
  const statusOptions = [
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
    { value: 'archived', label: 'Archived' }
  ];
  
  // Class status options
  const classStatusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'graduated', label: 'Graduated' }
  ];
  
  if (loading && !academicData) {
    return (
      <DashboardLayout title="Academic Management">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="animate-spin h-8 w-8 text-primary-600 mx-auto mb-2" />
            <p className="text-gray-600">Loading academic data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout title="Academic Management">
      {/* Alerts */}
      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => setError('')}
          className="mb-6 animate-fade-in"
        />
      )}
      
      {success && (
        <Alert
          type="success"
          message={success}
          onClose={() => setSuccess('')}
          className="mb-6 animate-fade-in"
        />
      )}
      
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Academic Management</h1>
            <p className="text-gray-600">
              Manage all academic components: sessions, terms, programs, class levels, subjects, and classes
            </p>
          </div>
          
          <Button
            onClick={fetchAcademicData}
            variant="outline"
            className="mt-4 md:mt-0"
          >
            <RefreshCw size={18} className="mr-2" />
            Refresh Data
          </Button>
        </div>
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-100 text-sm font-medium">Total Sessions</p>
                <h3 className="text-2xl font-bold mt-1">{stats?.totalSessions || 0}</h3>
              </div>
              <Calendar size={32} className="opacity-80" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-secondary-500 to-secondary-700 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary-100 text-sm font-medium">Class Levels</p>
                <h3 className="text-2xl font-bold mt-1">{stats?.totalClassLevels || 0}</h3>
              </div>
              <Layers size={32} className="opacity-80" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-success-500 to-success-700 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-success-100 text-sm font-medium">Total Subjects</p>
                <h3 className="text-2xl font-bold mt-1">{stats?.totalSubjects || 0}</h3>
              </div>
              <Book size={32} className="opacity-80" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Active Programs</p>
                <h3 className="text-2xl font-bold mt-1">{stats?.totalPrograms || 0}</h3>
              </div>
              <School size={32} className="opacity-80" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Academic Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {academicCards.map((card, index) => (
          <div
            key={index}
            className={`bg-white rounded-xl shadow-soft border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden`}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 ${getColorClass(card.color, 'bg')} rounded-lg flex items-center justify-center`}>
                  {card.icon}
                </div>
                <span className={`px-3 py-1 ${getColorClass(card.color, 'bg')} ${getColorClass(card.color, 'text')} rounded-full text-xs font-semibold`}>
                  {card.count} items
                </span>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{card.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{card.description}</p>
              
              <div className="flex items-center justify-between">
                <Button
                  onClick={() => openModal(card.modalType)}
                  variant="primary"
                  size="sm"
                >
                  <Plus size={16} className="mr-1" />
                  Add New
                </Button>
                
                <button
                  onClick={() => {
                    // Show data table for this card
                    const event = new CustomEvent('showAcademicTable', { 
                      detail: { title: card.title, data: card.data, columns: card.columns } 
                    });
                    window.dispatchEvent(event);
                  }}
                  className="text-sm text-gray-600 hover:text-primary-600 flex items-center"
                >
                  View All
                  <ChevronRight size={16} className="ml-1" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Current Session Info */}
      {academicData?.currentSession && (
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  📚 Current Academic Session
                </h3>
                <p className="text-gray-700 font-medium text-xl">
                  {academicData.currentSession.name}
                </p>
                <p className="text-gray-600 text-sm mt-1">
                  {academicData.currentSession.start_date} to {academicData.currentSession.end_date}
                </p>
              </div>
              <div className="text-right">
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  Active
                </span>
                <p className="text-gray-600 text-sm mt-2">
                  {academicSessions.length} total sessions
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Nigerian Academic Structure Info */}
      <div className="bg-white rounded-xl shadow-soft border border-gray-200 p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">🇳🇬 Nigerian Academic Structure</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-blue-600 font-bold">C</span>
              </div>
              <h4 className="font-medium text-gray-800">Creche</h4>
            </div>
            <p className="text-sm text-gray-600">Early childhood (0-2 years)</p>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-green-600 font-bold">N</span>
              </div>
              <h4 className="font-medium text-gray-800">Nursery</h4>
            </div>
            <p className="text-sm text-gray-600">Nursery 1, 2, KG 1, KG 2</p>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-yellow-600 font-bold">P</span>
              </div>
              <h4 className="font-medium text-gray-800">Primary</h4>
            </div>
            <p className="text-sm text-gray-600">Primary 1-6 (Basic 1-6)</p>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-purple-600 font-bold">S</span>
              </div>
              <h4 className="font-medium text-gray-800">Secondary</h4>
            </div>
            <p className="text-sm text-gray-600">JSS 1-3 & SSS 1-3</p>
          </div>
        </div>
      </div>
      
      {/* Academic Sessions Modal */}
      <Modal
        isOpen={activeModal === 'session'}
        onClose={closeModal}
        title={isEditMode ? 'Edit Academic Session' : 'Add New Academic Session'}
        size="lg"
      >
        <form onSubmit={handleSessionSubmit}>
          <div className="space-y-4">
            <Input
              label="Session Name *"
              placeholder="e.g., 2024/2025 Academic Session"
              value={sessionForm.name}
              onChange={(e) => setSessionForm({...sessionForm, name: e.target.value})}
              required
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="date"
                label="Start Date *"
                value={sessionForm.start_date}
                onChange={(e) => setSessionForm({...sessionForm, start_date: e.target.value})}
                required
              />
              
              <Input
                type="date"
                label="End Date *"
                value={sessionForm.end_date}
                onChange={(e) => setSessionForm({...sessionForm, end_date: e.target.value})}
                required
              />
            </div>
            
            <Select
              label="Status *"
              value={sessionForm.status}
              onChange={(e) => setSessionForm({...sessionForm, status: e.target.value})}
              options={statusOptions}
              required
            />
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_current"
                checked={sessionForm.is_current}
                onChange={(e) => setSessionForm({...sessionForm, is_current: e.target.checked})}
                className="h-4 w-4 text-primary-600 rounded"
              />
              <label htmlFor="is_current" className="ml-2 text-gray-700">
                Set as current session
              </label>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={sessionForm.description}
                onChange={(e) => setSessionForm({...sessionForm, description: e.target.value})}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Optional description..."
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {isEditMode ? 'Update Session' : 'Create Session'}
            </Button>
          </div>
        </form>
      </Modal>
      
      {/* Academic Terms Modal */}
      <Modal
        isOpen={activeModal === 'term'}
        onClose={closeModal}
        title={isEditMode ? 'Edit Academic Term' : 'Add New Academic Term'}
        size="lg"
      >
        <form onSubmit={handleTermSubmit}>
          <div className="space-y-4">
            <Select
              label="Academic Session *"
              value={termForm.session}
              onChange={(e) => setTermForm({...termForm, session: e.target.value})}
              options={sessions.map(s => ({ value: s.id, label: s.name }))}
              required
            />
            
            <Select
              label="Term *"
              value={termForm.term}
              onChange={(e) => setTermForm({...termForm, term: e.target.value})}
              options={termOptions}
              required
            />
            
            <Input
              label="Term Name"
              placeholder="e.g., First Term 2024/2025"
              value={termForm.name}
              onChange={(e) => setTermForm({...termForm, name: e.target.value})}
              helpText="Will be auto-generated if left empty"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="date"
                label="Start Date *"
                value={termForm.start_date}
                onChange={(e) => setTermForm({...termForm, start_date: e.target.value})}
                required
              />
              
              <Input
                type="date"
                label="End Date *"
                value={termForm.end_date}
                onChange={(e) => setTermForm({...termForm, end_date: e.target.value})}
                required
              />
            </div>
            
            <Select
              label="Status *"
              value={termForm.status}
              onChange={(e) => setTermForm({...termForm, status: e.target.value})}
              options={statusOptions.filter(s => s.value !== 'archived')}
              required
            />
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="term_is_current"
                checked={termForm.is_current}
                onChange={(e) => setTermForm({...termForm, is_current: e.target.checked})}
                className="h-4 w-4 text-primary-600 rounded"
              />
              <label htmlFor="term_is_current" className="ml-2 text-gray-700">
                Set as current term
              </label>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {isEditMode ? 'Update Term' : 'Create Term'}
            </Button>
          </div>
        </form>
      </Modal>
      
      {/* Programs Modal */}
      <Modal
        isOpen={activeModal === 'program'}
        onClose={closeModal}
        title={isEditMode ? 'Edit Program' : 'Add New Program'}
        size="lg"
      >
        <form onSubmit={handleProgramSubmit}>
          <div className="space-y-4">
            <Input
              label="Program Name *"
              placeholder="e.g., Primary School Program"
              value={programForm.name}
              onChange={(e) => setProgramForm({...programForm, name: e.target.value})}
              required
            />
            
            <Select
              label="Program Type *"
              value={programForm.program_type}
              onChange={(e) => setProgramForm({...programForm, program_type: e.target.value})}
              options={programTypeOptions}
              required
            />
            
            <Input
              label="Program Code *"
              placeholder="e.g., PRI"
              value={programForm.code}
              onChange={(e) => setProgramForm({...programForm, code: e.target.value})}
              required
              helpText="Unique code for the program"
            />
            
            <Input
              type="number"
              label="Duration (Years) *"
              value={programForm.duration_years}
              onChange={(e) => setProgramForm({...programForm, duration_years: parseInt(e.target.value) || 0})}
              required
              min="0"
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={programForm.description}
                onChange={(e) => setProgramForm({...programForm, description: e.target.value})}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Program description..."
              />
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="program_is_active"
                checked={programForm.is_active}
                onChange={(e) => setProgramForm({...programForm, is_active: e.target.checked})}
                className="h-4 w-4 text-primary-600 rounded"
              />
              <label htmlFor="program_is_active" className="ml-2 text-gray-700">
                Program is active
              </label>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {isEditMode ? 'Update Program' : 'Create Program'}
            </Button>
          </div>
        </form>
      </Modal>
      
      {/* Class Levels Modal */}
      <Modal
        isOpen={activeModal === 'class-level'}
        onClose={closeModal}
        title={isEditMode ? 'Edit Class Level' : 'Add New Class Level'}
        size="lg"
      >
        <form onSubmit={handleClassLevelSubmit}>
          <div className="space-y-4">
            <Select
              label="Program *"
              value={classLevelForm.program}
              onChange={(e) => setClassLevelForm({...classLevelForm, program: e.target.value})}
              options={programs.map(p => ({ value: p.id, label: p.name }))}
              required
            />
            
            <Select
              label="Level *"
              value={classLevelForm.level}
              onChange={(e) => setClassLevelForm({...classLevelForm, level: e.target.value})}
              options={levelOptions}
              required
            />
            
            <Input
              label="Class Level Name *"
              placeholder="e.g., Primary 1"
              value={classLevelForm.name}
              onChange={(e) => setClassLevelForm({...classLevelForm, name: e.target.value})}
              required
            />
            
            <Input
              label="Class Code *"
              placeholder="e.g., PRI1"
              value={classLevelForm.code}
              onChange={(e) => setClassLevelForm({...classLevelForm, code: e.target.value})}
              required
              helpText="Unique code for this class level"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                type="number"
                label="Order"
                value={classLevelForm.order}
                onChange={(e) => setClassLevelForm({...classLevelForm, order: parseInt(e.target.value) || 0})}
                min="0"
              />
              
              <Input
                type="number"
                label="Minimum Age"
                value={classLevelForm.min_age}
                onChange={(e) => setClassLevelForm({...classLevelForm, min_age: parseInt(e.target.value) || 0})}
                min="0"
              />
              
              <Input
                type="number"
                label="Maximum Age"
                value={classLevelForm.max_age}
                onChange={(e) => setClassLevelForm({...classLevelForm, max_age: parseInt(e.target.value) || 0})}
                min="0"
              />
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="class_level_is_active"
                checked={classLevelForm.is_active}
                onChange={(e) => setClassLevelForm({...classLevelForm, is_active: e.target.checked})}
                className="h-4 w-4 text-primary-600 rounded"
              />
              <label htmlFor="class_level_is_active" className="ml-2 text-gray-700">
                Class level is active
              </label>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {isEditMode ? 'Update Class Level' : 'Create Class Level'}
            </Button>
          </div>
        </form>
      </Modal>
      
      {/* Subjects Modal */}
      <Modal
        isOpen={activeModal === 'subject'}
        onClose={closeModal}
        title={isEditMode ? 'Edit Subject' : 'Add New Subject'}
        size="xl"
      >
        <form onSubmit={handleSubjectSubmit}>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Subject Name *"
                placeholder="e.g., Mathematics"
                value={subjectForm.name}
                onChange={(e) => setSubjectForm({...subjectForm, name: e.target.value})}
                required
              />
              
              <Input
                label="Subject Code *"
                placeholder="e.g., MAT"
                value={subjectForm.code}
                onChange={(e) => setSubjectForm({...subjectForm, code: e.target.value})}
                required
              />
            </div>
            
            <Input
              label="Short Name"
              placeholder="e.g., Maths"
              value={subjectForm.short_name}
              onChange={(e) => setSubjectForm({...subjectForm, short_name: e.target.value})}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Subject Type *"
                value={subjectForm.subject_type}
                onChange={(e) => setSubjectForm({...subjectForm, subject_type: e.target.value})}
                options={subjectTypeOptions}
                required
              />
              
              <Select
                label="Stream *"
                value={subjectForm.stream}
                onChange={(e) => setSubjectForm({...subjectForm, stream: e.target.value})}
                options={streamOptions}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CA Weight (%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={subjectForm.ca_weight}
                  onChange={(e) => setSubjectForm({...subjectForm, ca_weight: parseInt(e.target.value) || 0})}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0%</span>
                  <span>{subjectForm.ca_weight}%</span>
                  <span>100%</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Exam Weight (%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={subjectForm.exam_weight}
                  onChange={(e) => setSubjectForm({...subjectForm, exam_weight: parseInt(e.target.value) || 0})}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0%</span>
                  <span>{subjectForm.exam_weight}%</span>
                  <span>100%</span>
                </div>
              </div>
              
              <Input
                type="number"
                label="Pass Mark"
                value={subjectForm.pass_mark}
                onChange={(e) => setSubjectForm({...subjectForm, pass_mark: parseInt(e.target.value) || 0})}
                min="0"
                max="100"
              />
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-700 mb-3">Available For:</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={subjectForm.available_for_creche}
                    onChange={(e) => setSubjectForm({...subjectForm, available_for_creche: e.target.checked})}
                    className="h-4 w-4 text-primary-600 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Creche</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={subjectForm.available_for_nursery}
                    onChange={(e) => setSubjectForm({...subjectForm, available_for_nursery: e.target.checked})}
                    className="h-4 w-4 text-primary-600 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Nursery/KG</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={subjectForm.available_for_primary}
                    onChange={(e) => setSubjectForm({...subjectForm, available_for_primary: e.target.checked})}
                    className="h-4 w-4 text-primary-600 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Primary</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={subjectForm.available_for_jss}
                    onChange={(e) => setSubjectForm({...subjectForm, available_for_jss: e.target.checked})}
                    className="h-4 w-4 text-primary-600 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">JSS</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={subjectForm.available_for_sss}
                    onChange={(e) => setSubjectForm({...subjectForm, available_for_sss: e.target.checked})}
                    className="h-4 w-4 text-primary-600 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">SSS</span>
                </label>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={subjectForm.is_compulsory}
                  onChange={(e) => setSubjectForm({...subjectForm, is_compulsory: e.target.checked})}
                  className="h-4 w-4 text-primary-600 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Compulsory Subject</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={subjectForm.is_examinable}
                  onChange={(e) => setSubjectForm({...subjectForm, is_examinable: e.target.checked})}
                  className="h-4 w-4 text-primary-600 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Examinable</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={subjectForm.has_practical}
                  onChange={(e) => setSubjectForm({...subjectForm, has_practical: e.target.checked})}
                  className="h-4 w-4 text-primary-600 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Has Practical</span>
              </label>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={subjectForm.description}
                onChange={(e) => setSubjectForm({...subjectForm, description: e.target.value})}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Subject description..."
              />
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="subject_is_active"
                checked={subjectForm.is_active}
                onChange={(e) => setSubjectForm({...subjectForm, is_active: e.target.checked})}
                className="h-4 w-4 text-primary-600 rounded"
              />
              <label htmlFor="subject_is_active" className="ml-2 text-gray-700">
                Subject is active
              </label>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {isEditMode ? 'Update Subject' : 'Create Subject'}
            </Button>
          </div>
        </form>
      </Modal>
      
      {/* Classes Modal */}
      <Modal
        isOpen={activeModal === 'class'}
        onClose={closeModal}
        title={isEditMode ? 'Edit Class' : 'Add New Class'}
        size="xl"
      >
        <form onSubmit={handleClassSubmit}>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Academic Session *"
                value={classForm.session}
                onChange={(e) => setClassForm({...classForm, session: e.target.value})}
                options={sessions.map(s => ({ value: s.id, label: s.name }))}
                required
              />
              
              <Select
                label="Academic Term *"
                value={classForm.term}
                onChange={(e) => setClassForm({...classForm, term: e.target.value})}
                options={terms.map(t => ({ value: t.id, label: t.name }))}
                required
              />
            </div>
            
            <Select
              label="Class Level *"
              value={classForm.class_level}
              onChange={(e) => setClassForm({...classForm, class_level: e.target.value})}
              options={classLevelOptions.map(cl => ({ 
                value: cl.id, 
                label: `${cl.name} (${cl.program.name})` 
              }))}
              required
            />
            
            <Input
              label="Class Name *"
              placeholder="e.g., JSS 1 Three, SSS 2 Science A"
              value={classForm.name}
              onChange={(e) => setClassForm({...classForm, name: e.target.value})}
              required
              helpText="Specific section/arm name"
            />
            
            <Select
              label="Stream (for SSS only)"
              value={classForm.stream}
              onChange={(e) => setClassForm({...classForm, stream: e.target.value})}
              options={[{ value: '', label: 'Select stream' }, ...classStreamOptions]}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="number"
                label="Maximum Capacity"
                value={classForm.max_capacity}
                onChange={(e) => setClassForm({...classForm, max_capacity: parseInt(e.target.value) || 0})}
                min="1"
                max="100"
              />
              
              <Select
                label="Class Teacher"
                value={classForm.class_teacher}
                onChange={(e) => setClassForm({...classForm, class_teacher: e.target.value})}
                options={[{ value: '', label: 'Select teacher' }, ...teachers.map(t => ({ 
                  value: t.id, 
                  label: t.name 
                }))]}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Room Number"
                placeholder="e.g., Room 101"
                value={classForm.room_number}
                onChange={(e) => setClassForm({...classForm, room_number: e.target.value})}
              />
              
              <Input
                label="Building"
                placeholder="e.g., Main Building"
                value={classForm.building}
                onChange={(e) => setClassForm({...classForm, building: e.target.value})}
              />
            </div>
            
            <Select
              label="Status *"
              value={classForm.status}
              onChange={(e) => setClassForm({...classForm, status: e.target.value})}
              options={classStatusOptions}
              required
            />
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="class_is_active"
                checked={classForm.is_active}
                onChange={(e) => setClassForm({...classForm, is_active: e.target.checked})}
                className="h-4 w-4 text-primary-600 rounded"
              />
              <label htmlFor="class_is_active" className="ml-2 text-gray-700">
                Class is active
              </label>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {isEditMode ? 'Update Class' : 'Create Class'}
            </Button>
          </div>
        </form>
      </Modal>
      
      {/* Data Table Modal (for viewing all items) */}
      {(() => {
        // This creates a listener for showing data tables
        const [tableData, setTableData] = useState(null);
        
        useEffect(() => {
          const handleShowTable = (e) => {
            setTableData(e.detail);
          };
          
          window.addEventListener('showAcademicTable', handleShowTable);
          
          return () => {
            window.removeEventListener('showAcademicTable', handleShowTable);
          };
        }, []);
        
        if (!tableData) return null;
        
        return (
          <Modal
            isOpen={!!tableData}
            onClose={() => setTableData(null)}
            title={tableData.title}
            size="full"
          >
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {tableData.columns.map((col, index) => (
                      <th
                        key={index}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {col.label}
                      </th>
                    ))}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tableData.data.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      {tableData.columns.map((col, colIndex) => (
                        <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {col.format ? col.format(item[col.key]) : item[col.key]}
                        </td>
                      ))}
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => viewDetails(tableData.title.toLowerCase(), item)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => {
                              const modalType = tableData.title.toLowerCase().replace(' ', '-');
                              openModal(modalType, item);
                              setTableData(null);
                            }}
                            className="text-green-600 hover:text-green-900"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => {
                              const type = tableData.title.toLowerCase().replace(' ', '-');
                              handleDelete(type, item.id);
                              setTableData(null);
                            }}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {tableData.data.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search size={24} className="text-gray-400" />
                  </div>
                  <p className="text-gray-600">No data found</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Click "Add New" to create {tableData.title.toLowerCase()}
                  </p>
                </div>
              )}
            </div>
          </Modal>
        );
      })()}
    </DashboardLayout>
  );
};

// Helper function to get color classes
const getColorClass = (color, type) => {
  const colorMap = {
    primary: {
      bg: 'bg-primary-100',
      text: 'text-primary-800',
      border: 'border-primary-200'
    },
    secondary: {
      bg: 'bg-secondary-100',
      text: 'text-secondary-800',
      border: 'border-secondary-200'
    },
    success: {
      bg: 'bg-success-100',
      text: 'text-success-800',
      border: 'border-success-200'
    },
    warning: {
      bg: 'bg-warning-100',
      text: 'text-warning-800',
      border: 'border-warning-200'
    },
    info: {
      bg: 'bg-info-100',
      text: 'text-info-800',
      border: 'border-info-200'
    },
    purple: {
      bg: 'bg-purple-100',
      text: 'text-purple-800',
      border: 'border-purple-200'
    }
  };
  
  return colorMap[color]?.[type] || colorMap.primary[type];
};

export default Academics;