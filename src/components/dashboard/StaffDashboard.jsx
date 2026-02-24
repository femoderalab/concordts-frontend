import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { Users, GraduationCap, DollarSign, Clock, BookOpen, BarChart3 } from 'lucide-react';

const StaffDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const staffType = user?.role === 'teacher' || user?.role === 'form_teacher' || user?.role === 'subject_teacher' 
    ? 'teaching' 
    : 'non_teaching';

  const quickActions = {
    teaching: [
      { label: 'Take Attendance', icon: <Users className="h-5 w-5" />, path: '/reports/attendance' },
      { label: 'Enter Scores', icon: <BarChart3 className="h-5 w-5" />, path: '/reports/test' },
      { label: 'View Students', icon: <GraduationCap className="h-5 w-5" />, path: '/students' },
      { label: 'View Subjects', icon: <BookOpen className="h-5 w-5" />, path: '/academics/subjects' },
    ],
    non_teaching: [
      { label: 'View Staff', icon: <Users className="h-5 w-5" />, path: '/staff' },
      { label: 'View Reports', icon: <BarChart3 className="h-5 w-5" />, path: '/reports' },
      { label: 'My Profile', icon: <Users className="h-5 w-5" />, path: '/profile' },
      { label: 'Calendar', icon: <Clock className="h-5 w-5" />, path: '#' },
    ],
    admin: [
      { label: 'Manage Staff', icon: <Users className="h-5 w-5" />, path: '/staff' },
      { label: 'Manage Students', icon: <GraduationCap className="h-5 w-5" />, path: '/students' },
      { label: 'Manage Parents', icon: <Users className="h-5 w-5" />, path: '/parents' },
      { label: 'Financial Reports', icon: <DollarSign className="h-5 w-5" />, path: '/reports' },
    ]
  };

  const getActions = () => {
    if (['head', 'principal', 'vice_principal'].includes(user?.role)) {
      return quickActions.admin;
    }
    return quickActions[staffType];
  };

  const getWelcomeMessage = () => {
    const name = user?.first_name || 'Staff Member';
    const role = user?.role_display || user?.role || 'Staff';
    
    const messages = {
      head: `Welcome, Head of School ${name}`,
      principal: `Welcome, Principal ${name}`,
      vice_principal: `Welcome, Vice Principal ${name}`,
      teacher: `Welcome, Teacher ${name}`,
      form_teacher: `Welcome, Form Teacher ${name}`,
      subject_teacher: `Welcome, Subject Teacher ${name}`,
      accountant: `Welcome, Accountant ${name}`,
      secretary: `Welcome, Secretary ${name}`,
      librarian: `Welcome, Librarian ${name}`,
      default: `Welcome, ${name} (${role})`
    };

    return messages[user?.role] || messages.default;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{getWelcomeMessage()}</h1>
        <p className="mt-2 text-gray-600">Here's what's happening today</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {getActions().map((action, index) => (
          <button
            key={index}
            onClick={() => navigate(action.path)}
            className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-105"
          >
            <div className="mb-3 p-3 bg-white rounded-full shadow-sm">
              <div className="text-blue-600">
                {action.icon}
              </div>
            </div>
            <span className="text-sm font-medium text-gray-900 text-center">
              {action.label}
            </span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Events */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h3>
          <div className="space-y-4">
            {[
              { title: 'Staff Meeting', date: 'Today, 2:00 PM', location: 'Conference Room' },
              { title: 'Parent-Teacher Conference', date: 'Tomorrow, 10:00 AM', location: 'School Hall' },
              { title: 'Training Workshop', date: 'Dec 18, 9:00 AM', location: 'Library' },
            ].map((event, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                <div>
                  <p className="font-medium text-gray-900">{event.title}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-sm text-gray-500">{event.date}</span>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-500">{event.location}</span>
                  </div>
                </div>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm opacity-90">Days to Next Holiday</span>
              <span className="font-bold text-xl">12</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm opacity-90">Pending Tasks</span>
              <span className="font-bold text-xl">3</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm opacity-90">Unread Messages</span>
              <span className="font-bold text-xl">5</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm opacity-90">Upcoming Deadlines</span>
              <span className="font-bold text-xl">2</span>
            </div>
          </div>
          <button 
            onClick={() => navigate('/dashboard')}
            className="mt-6 w-full py-2 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors"
          >
            View Full Dashboard
          </button>
        </div>
      </div>

      {/* Announcements */}
      <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className="h-6 w-6 bg-yellow-400 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">!</span>
            </div>
          </div>
          <div className="ml-3">
            <h4 className="text-sm font-medium text-yellow-800">Important Announcement</h4>
            <div className="mt-1 text-sm text-yellow-700">
              <p>End of term examinations begin next week. Please submit your examination questions by Friday.</p>
            </div>
            <div className="mt-2">
              <button className="text-sm font-medium text-yellow-800 hover:text-yellow-900">
                View Details →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;