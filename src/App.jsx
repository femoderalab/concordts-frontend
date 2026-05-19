import React, { Suspense, lazy } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute, {
  PublicRoute,
  StudentRoute,
  AdminRoute,
  TeacherRoute,
  ParentRoute,
  StaffRoute,
} from './utils/protectedRoute';

// Layout Components
import DashboardLayout from './components/dashboard/DashboardLayout';
import AuthLayout from './components/layout/AuthLayout';
import { PageLoader } from './components/common/Loader';

// Import StudentLayout
import StudentLayout from './components/layout/StudentLayout';
import PromotionManagement from './pages/academics/PromotionManagement';
import AlumniManagement from './pages/academics/AlumniManagement';
import ClassManagement from './pages/academics/ClassManagement';
import LibraryManagement from './pages/library/LibraryManagement';

// NEW PARENT PAGES (modular structure - NO lazy loading needed)
import Parents from './pages/parents/Parents';
import ParentCreate from './pages/parents/ParentCreate';
import ParentEdit from './pages/parents/ParentEdit';
import ParentDetail from './pages/parents/ParentDetail';
import ParentPortal from './pages/parents/ParentPortal';

import StudentPaymentPortal from './pages/payments/StudentPaymentPortal';
import FeeConfiguration from './pages/payments/FeeConfiguration';
import PaymentAnalytics from './pages/payments/PaymentAnalytics';
import BankAccountManagement from './pages/payments/BankAccountManagement';
import AdminPaymentVerification from './pages/payments/AdminPaymentVerification';
import InvoiceManagement from './pages/payments/InvoiceManagement';
import PaymentCallback from './pages/payments/PaymentCallback';

import TeacherDashboard from './pages/teacher/TeacherDashboard';
import PrincipalDashboard from './pages/principal/PrincipalDashboard';
import AccountantDashboard from './pages/accountant/AccountantDashboard';
import SecretaryDashboard from './pages/secretary/SecretaryDashboard';

import TakeAttendance from './pages/attendance/TakeAttendance';
import ClassTimetable from './pages/timetable/ClassTimetable';
import TimetableList from './pages/timetable/TimetableList';
import ClassTimetableDetail from './pages/timetable/ClassTimetableDetail';
import ManageTimetable from './pages/timetable/ManageTimetable';
import ManagePeriods from './pages/timetable/ManagePeriods';
import ManageDays from './pages/timetable/ManageDays';

// Lazy loaded pages for better performance
const Landing = lazy(() => import('./pages/Landing'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const NotFound = lazy(() => import('./pages/NotFound'));

// =====================
// STUDENT PAGES - UPDATED PATHS to use students folder
// =====================
const StudentDashboard = lazy(() => import('./pages/students/StudentDashboard'));
const StudentList = lazy(() => import('./pages/students/StudentList'));
const StudentDetail = lazy(() => import('./pages/students/StudentDetail'));
const StudentCreate = lazy(() => import('./pages/students/StudentCreate'));
const StudentEdit = lazy(() => import('./pages/students/StudentEdit'));
const StudentEnrollment = lazy(() => import('./pages/students/StudentEnrollment'));
const StudentRegister = lazy(() => import('./pages/students/StudentRegister'));

// Staff pages
const Staff = lazy(() => import('./pages/staff/staff'));
const StaffList = lazy(() => import('./pages/staff/StaffList'));
const StaffCreate = lazy(() => import('./pages/staff/StaffCreate'));
const StaffDetail = lazy(() => import('./pages/staff/StaffDetail'));
const StaffEdit = lazy(() => import('./pages/staff/StaffEdit'));
const Principal = lazy(() => import('./pages/staff/Principal'));
const Secretary = lazy(() => import('./pages/staff/Secretary'));
const Teachers = lazy(() => import('./pages/staff/Teachers'));
const Accountant = lazy(() => import('./pages/staff/Accountant'));
const TeacherProfiles = lazy(() => import('./pages/staff/TeacherProfiles'));

// Academics pages
const Academics = lazy(() => import('./pages/Academics'));
const AcademicYear = lazy(() => import('./pages/academics/AcademicYear'));
const AcademicSessions = lazy(() => import('./pages/academics/AcademicSessions'));
const AcademicTerms = lazy(() => import('./pages/academics/AcademicTerms'));
const AcademicPrograms = lazy(() => import('./pages/academics/Programs'));
const ClassLevels = lazy(() => import('./pages/academics/ClassLevels'));
const Subjects = lazy(() => import('./pages/academics/Subjects'));
const Classes = lazy(() => import('./pages/academics/Classes'));
const ClassArms = lazy(() => import('./pages/academics/ClassArms'));
const Promotions = lazy(() => import('./pages/academics/Promotions'));

// Reports pages
const Reports = lazy(() => import('./pages/Reports'));
const Attendance = lazy(() => import('./pages/reports/Attendance'));
const Test = lazy(() => import('./pages/reports/Test'));
const Exam = lazy(() => import('./pages/reports/Exam'));
const TotalScore = lazy(() => import('./pages/reports/TotalScore'));

// Settings pages
const Profile = lazy(() => import('./pages/settings/Profile'));
const Settings = lazy(() => import('./pages/settings/Settings'));
const Security = lazy(() => import('./pages/settings/Security'));

// Results
const Result = lazy(() => import('./pages/reports/Result'));

// Parent Register
const ParentRegister = lazy(() => import('./pages/ParentRegister'));

// Loading fallback component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <PageLoader text="Loading page..." />
  </div>
);

function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <AuthProvider>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* ===================== */}
            {/* PUBLIC ROUTES */}
            {/* ===================== */}
            <Route
              path="/"
              element={
                <PublicRoute>
                  <Landing />
                </PublicRoute>
              }
            />

            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />

            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />

            <Route
              path="/register/student"
              element={
                <PublicRoute>
                  <AuthLayout>
                    <StudentRegister />
                  </AuthLayout>
                </PublicRoute>
              }
            />

            <Route
              path="/register/parent"
              element={
                <PublicRoute>
                  <AuthLayout>
                    <ParentRegister />
                  </AuthLayout>
                </PublicRoute>
              }
            />

            {/* ===================== */}
            {/* DASHBOARD ROUTES */}
            {/* ===================== */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute 
                  allowedRoles={[
                    'head', 'hm', 'principal', 'vice_principal',
                    'teacher', 'form_teacher', 'subject_teacher',
                    'accountant', 'secretary', 'librarian',
                    'laboratory', 'security', 'cleaner'
                  ]}
                >
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/teacher-dashboard"
              element={
                <TeacherRoute>
                  <TeacherDashboard />
                </TeacherRoute>
              }
            />

            <Route
              path="/accountant-dashboard"
              element={
                <StaffRoute>
                  <AccountantDashboard />
                </StaffRoute>
              }
            />

            <Route
              path="/secretary-dashboard"
              element={
                <StaffRoute>
                  <SecretaryDashboard />
                </StaffRoute>
              }
            />

            <Route
              path="/student-dashboard"
              element={
                <StudentRoute>
                  <StudentDashboard />
                </StudentRoute>
              }
            />

            <Route
              path="/principal-dashboard"
              element={
                <AdminRoute>
                  <PrincipalDashboard />
                </AdminRoute>
              }
            />

            {/* ===================== */}
            {/* STUDENT MANAGEMENT ROUTES - UPDATED */}
            {/* ===================== */}

            {/* Student List - Admin only */}
            <Route
              path="/students"
              element={
                <AdminRoute>
                  <StudentList />
                </AdminRoute>
              }
            />

            {/* Create Student - Admin only */}
            <Route
              path="/students/create"
              element={
                <AdminRoute>
                  <StudentCreate />
                </AdminRoute>
              }
            />

            {/* Edit Student - Admin only (NEW ROUTE) */}
            <Route
              path="/students/:id/edit"
              element={
                <AdminRoute>
                  <StudentEdit />
                </AdminRoute>
              }
            />

            {/* View Student Details - Admin, Teacher, Parent */}
            <Route
              path="/students/:id"
              element={
                <ProtectedRoute
                  allowedRoles={[
                    'head', 'hm', 'principal', 'vice_principal',
                    'teacher', 'form_teacher', 'subject_teacher',
                    'accountant', 'secretary', 'parent'
                  ]}
                >
                  <StudentDetail />
                </ProtectedRoute>
              }
            />

            {/* Student Enrollment - Admin only */}
            <Route
              path="/students/:id/enroll"
              element={
                <AdminRoute>
                  <StudentEnrollment />
                </AdminRoute>
              }
            />

            {/* Student Dashboard by ID */}
            <Route
              path="/students/:id/dashboard"
              element={
                <ProtectedRoute
                  allowedRoles={[
                    'head', 'hm', 'principal', 'vice_principal',
                    'teacher', 'form_teacher', 'subject_teacher',
                    'accountant', 'secretary'
                  ]}
                >
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />

            {/* ===================== */}
            {/* PARENT ROUTES */}
            {/* ===================== */}
            <Route 
              path="/parents" 
              element={
                <ProtectedRoute allowedRoles={['head', 'hm', 'principal', 'vice_principal', 'secretary', 'accountant']}>
                  <Parents />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/parents/create" 
              element={
                <AdminRoute>
                  <ParentCreate />
                </AdminRoute>
              } 
            />

            <Route 
              path="/parents/:id" 
              element={
                <ProtectedRoute allowedRoles={['head', 'hm', 'principal', 'vice_principal', 'secretary', 'parent']}>
                  <ParentDetail />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/parents/:id/edit" 
              element={
                <AdminRoute>
                  <ParentEdit />
                </AdminRoute>
              } 
            />

            <Route 
              path="/parent-portal" 
              element={
                <ProtectedRoute allowedRoles={['parent']}>
                  <ParentPortal />
                </ProtectedRoute>
              } 
            />

            {/* ===================== */}
            {/* STAFF ROUTES */}
            {/* ===================== */}
            <Route
              path="/staff/*"
              element={
                <ProtectedRoute
                  allowedRoles={[
                    'head', 'hm', 'principal', 'vice_principal',
                    'secretary', 'accountant'
                  ]}
                >
                  <Staff />
                </ProtectedRoute>
              }
            />

            <Route
              path="/staff/list"
              element={
                <ProtectedRoute
                  allowedRoles={[
                    'head', 'hm', 'principal', 'vice_principal',
                    'secretary', 'accountant', 'teacher',
                    'form_teacher', 'subject_teacher'
                  ]}
                >
                  <StaffList />
                </ProtectedRoute>
              }
            />

            <Route
              path="/staff/create"
              element={
                <AdminRoute>
                  <StaffCreate />
                </AdminRoute>
              }
            />

            <Route
              path="/staff/:id"
              element={
                <ProtectedRoute
                  allowedRoles={[
                    'head', 'hm', 'principal', 'vice_principal',
                    'secretary', 'accountant'
                  ]}
                >
                  <StaffDetail />
                </ProtectedRoute>
              }
            />

            <Route
              path="/staff/:id/edit"
              element={
                <AdminRoute>
                  <StaffEdit />
                </AdminRoute>
              }
            />

            <Route
              path="/staff/principal"
              element={
                <ProtectedRoute
                  allowedRoles={['head', 'hm', 'principal', 'vice_principal']}
                >
                  <Principal />
                </ProtectedRoute>
              }
            />

            <Route
              path="/staff/secretary"
              element={
                <ProtectedRoute
                  allowedRoles={['head', 'hm', 'principal', 'vice_principal', 'secretary']}
                >
                  <Secretary />
                </ProtectedRoute>
              }
            />

            <Route
              path="/staff/teachers"
              element={
                <ProtectedRoute
                  allowedRoles={[
                    'head', 'hm', 'principal', 'vice_principal',
                    'teacher', 'form_teacher', 'subject_teacher'
                  ]}
                >
                  <Teachers />
                </ProtectedRoute>
              }
            />

            <Route
              path="/staff/accountant"
              element={
                <ProtectedRoute
                  allowedRoles={['head', 'hm', 'principal', 'vice_principal', 'accountant']}
                >
                  <Accountant />
                </ProtectedRoute>
              }
            />

            <Route
              path="/staff/teachers/profiles"
              element={
                <ProtectedRoute
                  allowedRoles={[
                    'head', 'hm', 'principal', 'vice_principal',
                    'teacher', 'form_teacher', 'subject_teacher'
                  ]}
                >
                  <TeacherProfiles />
                </ProtectedRoute>
              }
            />

            {/* ===================== */}
            {/* ACADEMICS ROUTES */}
            {/* ===================== */}
            <Route
              path="/academics"
              element={
                <ProtectedRoute
                  allowedRoles={[
                    'head', 'hm', 'principal', 'vice_principal',
                    'teacher', 'form_teacher', 'subject_teacher'
                  ]}
                >
                  <Academics />
                </ProtectedRoute>
              }
            />

            <Route
              path="/academics/academic-year"
              element={
                <ProtectedRoute
                  allowedRoles={[
                    'head', 'hm', 'principal', 'vice_principal',
                    'teacher', 'form_teacher', 'subject_teacher'
                  ]}
                >
                  <AcademicYear />
                </ProtectedRoute>
              }
            />

            <Route
              path="/academics/sessions"
              element={
                <ProtectedRoute
                  allowedRoles={[
                    'head', 'hm', 'principal', 'vice_principal',
                    'teacher', 'form_teacher', 'subject_teacher'
                  ]}
                >
                  <AcademicSessions />
                </ProtectedRoute>
              }
            />

            <Route
              path="/academics/terms"
              element={
                <ProtectedRoute
                  allowedRoles={[
                    'head', 'hm', 'principal', 'vice_principal',
                    'teacher', 'form_teacher', 'subject_teacher'
                  ]}
                >
                  <AcademicTerms />
                </ProtectedRoute>
              }
            />

            <Route
              path="/academics/programs"
              element={
                <ProtectedRoute
                  allowedRoles={[
                    'head', 'hm', 'principal', 'vice_principal',
                    'teacher', 'form_teacher', 'subject_teacher'
                  ]}
                >
                  <AcademicPrograms />
                </ProtectedRoute>
              }
            />

            <Route
              path="/academics/class-levels"
              element={
                <ProtectedRoute
                  allowedRoles={[
                    'head', 'hm', 'principal', 'vice_principal',
                    'teacher', 'form_teacher', 'subject_teacher'
                  ]}
                >
                  <ClassLevels />
                </ProtectedRoute>
              }
            />

            <Route
              path="/academics/subjects"
              element={
                <ProtectedRoute
                  allowedRoles={[
                    'head', 'hm', 'principal', 'vice_principal',
                    'teacher', 'form_teacher', 'subject_teacher'
                  ]}
                >
                  <Subjects />
                </ProtectedRoute>
              }
            />

            <Route
              path="/academics/classes"
              element={
                <ProtectedRoute
                  allowedRoles={[
                    'head', 'hm', 'principal', 'vice_principal',
                    'teacher', 'form_teacher', 'subject_teacher'
                  ]}
                >
                  <Classes />
                </ProtectedRoute>
              }
            />

            <Route
              path="/academics/class-arms"
              element={
                <ProtectedRoute
                  allowedRoles={[
                    'head', 'hm', 'principal', 'vice_principal',
                    'teacher', 'form_teacher', 'subject_teacher'
                  ]}
                >
                  <ClassArms />
                </ProtectedRoute>
              }
            />

            <Route
              path="/academics/promotions"
              element={
                <ProtectedRoute
                  allowedRoles={[
                    'head', 'hm', 'principal', 'vice_principal',
                    'teacher', 'form_teacher', 'subject_teacher'
                  ]}
                >
                  <Promotions />
                </ProtectedRoute>
              }
            />

            <Route
              path="/academics/promotion"
              element={
                <ProtectedRoute allowedRoles={['head', 'hm', 'principal', 'vice_principal']}>
                  <PromotionManagement />
                </ProtectedRoute>
              }
            />

            <Route
              path="/academics/alumni"
              element={
                <ProtectedRoute allowedRoles={['head', 'hm', 'principal', 'vice_principal']}>
                  <AlumniManagement />
                </ProtectedRoute>
              }
            />

            <Route
              path="/academics/class-management"
              element={
                <ProtectedRoute allowedRoles={['head', 'hm', 'principal', 'vice_principal']}>
                  <ClassManagement />
                </ProtectedRoute>
              }
            />

            {/* ===================== */}
            {/* PAYMENTS ROUTES */}
            {/* ===================== */}
            <Route 
              path="/payments" 
              element={
                <ProtectedRoute allowedRoles={[
                  'student', 'parent', 'head', 'hm',
                  'principal', 'vice_principal', 'accountant', 'secretary'
                ]}>
                  <StudentPaymentPortal />
                </ProtectedRoute>
              } 
            />
            
            <Route
              path="/payments/admin"
              element={
                <ProtectedRoute allowedRoles={['head', 'hm', 'principal', 'vice_principal', 'accountant']}>
                  <FeeConfiguration />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/payments/analytics"
              element={
                <ProtectedRoute allowedRoles={['head', 'hm', 'principal', 'vice_principal', 'accountant']}>
                  <PaymentAnalytics />
                </ProtectedRoute>
              }
            />

            <Route
              path="/payments/bank-accounts"
              element={
                <ProtectedRoute allowedRoles={['head', 'hm', 'principal', 'vice_principal', 'accountant']}>
                  <BankAccountManagement />
                </ProtectedRoute>
              }
            />

            <Route
              path="/payments/verification"
              element={
                <ProtectedRoute allowedRoles={['head', 'hm', 'principal', 'vice_principal', 'accountant']}>
                  <AdminPaymentVerification />
                </ProtectedRoute>
              }
            />

            <Route path="/payments/invoices" element={
              <ProtectedRoute allowedRoles={['head', 'hm', 'principal', 'vice_principal', 'accountant']}>
                <InvoiceManagement />
              </ProtectedRoute>
            } />

            <Route path="/payments/verify" element={
              <ProtectedRoute allowedRoles={['student', 'parent']}>
                <PaymentCallback />
              </ProtectedRoute>
            } />

            {/* ===================== */}
            {/* ATTENDANCE ROUTES */}
            {/* ===================== */}
            <Route
              path="/attendance/take"
              element={
                <ProtectedRoute allowedRoles={[
                  'teacher', 'form_teacher', 'subject_teacher',
                  'head', 'hm', 'principal', 'vice_principal', 'secretary'
                ]}>
                  <TakeAttendance />
                </ProtectedRoute>
              }
            />

            {/* ===================== */}
            {/* TIMETABLE ROUTES */}
            {/* ===================== */}
            <Route
              path="/timetable"
              element={
                <ProtectedRoute>
                  <ClassTimetable />
                </ProtectedRoute>
              }
            />

            <Route
              path="/timetable/manage"
              element={
                <ProtectedRoute allowedRoles={['head', 'hm', 'principal', 'vice_principal', 'secretary']}>
                  <ManageTimetable />
                </ProtectedRoute>
              }
            />

            <Route path="/timetable" element={<TimetableList />} />
            <Route path="/timetable/class/:classId" element={<ClassTimetableDetail />} />
            <Route path="/timetable/manage" element={<ManageTimetable />} />
            
            <Route
              path="/timetable/periods"
              element={
                <ProtectedRoute allowedRoles={['head', 'hm', 'principal', 'vice_principal', 'secretary']}>
                  <ManagePeriods />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/timetable/days"
              element={
                <ProtectedRoute allowedRoles={['head', 'hm', 'principal', 'vice_principal', 'secretary']}>
                  <ManageDays />
                </ProtectedRoute>
              }
            />

            {/* ===================== */}
            {/* REPORTS ROUTES */}
            {/* ===================== */}
            <Route
              path="/reports"
              element={
                <ProtectedRoute
                  allowedRoles={[
                    'head', 'hm', 'principal', 'vice_principal',
                    'teacher', 'form_teacher', 'subject_teacher'
                  ]}
                >
                  <Reports />
                </ProtectedRoute>
              }
            />

            <Route
              path="/reports/results"
              element={
                <ProtectedRoute
                  allowedRoles={[
                    'head', 'hm', 'principal', 'vice_principal',
                    'teacher', 'form_teacher', 'subject_teacher',
                    'student', 'parent'
                  ]}
                >
                  <DashboardLayout title="Result Management">
                    <Suspense fallback={<div className="animate-pulse">Loading results...</div>}>
                      <Result />
                    </Suspense>
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/reports/attendance"
              element={
                <ProtectedRoute
                  allowedRoles={[
                    'head', 'hm', 'principal', 'vice_principal',
                    'teacher', 'form_teacher', 'subject_teacher'
                  ]}
                >
                  <Attendance />
                </ProtectedRoute>
              }
            />

            {/* ===================== */}
            {/* SETTINGS ROUTES */}
            {/* ===================== */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <DashboardLayout title="My Profile">
                    <Suspense fallback={<div className="animate-pulse">Loading profile...</div>}>
                      <Profile />
                    </Suspense>
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <DashboardLayout title="Settings">
                    <Suspense fallback={<div className="animate-pulse">Loading settings...</div>}>
                      <Settings />
                    </Suspense>
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/settings/security"
              element={
                <ProtectedRoute>
                  <DashboardLayout title="Security Settings">
                    <Suspense fallback={<div className="animate-pulse">Loading security settings...</div>}>
                      <Security />
                    </Suspense>
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* ===================== */}
            {/* LIBRARY ROUTE */}
            {/* ===================== */}
            <Route 
              path="/library" 
              element={
                <ProtectedRoute allowedRoles={[
                  'head', 'hm', 'principal', 'vice_principal',
                  'teacher', 'form_teacher', 'subject_teacher',
                  'accountant', 'secretary', 'student', 'parent'
                ]}>
                  <LibraryManagement />
                </ProtectedRoute>
              } 
            />

            {/* ===================== */}
            {/* ERROR ROUTES */}
            {/* ===================== */}
            <Route
              path="/unauthorized"
              element={
                <DashboardLayout title="Unauthorized">
                  <div className="flex flex-col items-center justify-center min-h-[60vh]">
                    <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
                      <span className="text-red-600 text-4xl font-bold">!</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Unauthorized Access</h2>
                    <p className="text-gray-600 text-center mb-6 max-w-md">
                      You don't have permission to access this page. 
                      Please contact the administrator if you believe this is an error.
                    </p>
                    <div className="flex space-x-4">
                      <a
                        href="/dashboard"
                        className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                      >
                        Go to Dashboard
                      </a>
                      <button
                        onClick={() => window.history.back()}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Go Back
                      </button>
                    </div>
                  </div>
                </DashboardLayout>
              }
            />

            <Route
              path="/error"
              element={
                <DashboardLayout title="Error">
                  <div className="flex flex-col items-center justify-center min-h-[60vh]">
                    <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
                      <svg className="w-12 h-12 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.928-.833-2.698 0L4.348 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Something went wrong</h2>
                    <p className="text-gray-600 text-center mb-6">
                      An unexpected error occurred. Please try again later.
                    </p>
                    <div className="flex space-x-4">
                      <a
                        href="/dashboard"
                        className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                      >
                        Go to Dashboard
                      </a>
                      <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Refresh Page
                      </button>
                    </div>
                  </div>
                </DashboardLayout>
              }
            />

            {/* ===================== */}
            {/* REDIRECTS */}
            {/* ===================== */}
            <Route path="/home" element={<Navigate to="/dashboard" replace />} />
            <Route path="/admin" element={<Navigate to="/dashboard" replace />} />
            <Route path="/teacher" element={<Navigate to="/dashboard" replace />} />
            <Route path="/student" element={<Navigate to="/student-dashboard" replace />} />
            <Route path="/parent" element={<Navigate to="/parent-portal" replace />} />

            {/* ===================== */}
            {/* 404 - NOT FOUND */}
            {/* ===================== */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;