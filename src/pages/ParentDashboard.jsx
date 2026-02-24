// src/pages/ParentDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import StatCard from '../components/dashboard/StatCard';
import Alert from '../components/common/Alert';
import Loader, { PageLoader } from '../components/common/Loader';
import ChildrenList from '../components/parents/ChildrenList';
import useAuth from '../hooks/useAuth';
import { getParentDashboard, getParentChildren } from '../services/parentService';
import { handleApiError } from '../services/api';
import {
  formatFee,
  calculateFeePercentage,
  getPTAStatusColor,
  getVerificationStatusColor,
  getChildrenCountColor,
  formatPhoneNumber,
} from '../utils/parentUtils';

const ParentDashboard = () => {
  const { user } = useAuth();
  
  const [dashboardData, setDashboardData] = useState(null);
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [childrenLoading, setChildrenLoading] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    fetchDashboardData();
    fetchChildren();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await getParentDashboard();
      setDashboardData(response.dashboard || response);
      
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      console.error('Error fetching parent dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchChildren = async () => {
    try {
      setChildrenLoading(true);
      const response = await getParentChildren();
      setChildren(response || []);
    } catch (err) {
      console.error('Error fetching children:', err);
    } finally {
      setChildrenLoading(false);
    }
  };

  if (loading && !dashboardData) {
    return <PageLoader text="Loading parent dashboard..." />;
  }

  if (error && !dashboardData) {
    return (
      <DashboardLayout title="Parent Dashboard">
        <Alert
          type="error"
          message={error}
          onClose={() => setError('')}
          className="mb-6"
        />
        <div className="text-center py-12">
          <p className="text-gray-600">Failed to load dashboard. Please try again.</p>
          <button
            onClick={fetchDashboardData}
            className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
          >
            Retry
          </button>
        </div>
      </DashboardLayout>
    );
  }

  if (!dashboardData) {
    return (
      <DashboardLayout title="Parent Dashboard">
        <div className="text-center py-12">
          <p className="text-gray-600">No parent data found.</p>
        </div>
      </DashboardLayout>
    );
  }

  const { parent, children_count, fee_summary, children_by_class, outstanding_fees, documents_complete } = dashboardData;
  const feePercentage = calculateFeePercentage(fee_summary?.total_fee || 0, fee_summary?.total_paid || 0);

  return (
    <DashboardLayout title="My Dashboard">
      {/* Error Alert */}
      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => setError('')}
          className="mb-6"
        />
      )}

      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-700 rounded-2xl shadow-lg p-6 mb-8 text-white animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">
              Welcome back, {user.first_name}!
            </h2>
            <p className="text-primary-100">
              Parent ID: {parent?.parent_id} • {parent?.parent_type_display}
            </p>
            <p className="text-primary-100 text-sm mt-2">
              {parent?.occupation ? `${parent.occupation} • ` : ''}
              {parent?.employer ? `${parent.employer}` : ''}
            </p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <div className="flex items-center space-x-4">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${getPTAStatusColor(parent?.is_pta_member)}`}>
                {parent?.is_pta_member ? 'PTA Member' : 'Not PTA'}
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${getVerificationStatusColor(parent?.is_verified)}`}>
                {parent?.is_verified ? 'Verified' : 'Pending Verification'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Children in School"
          value={children_count || 0}
          icon={
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          }
          color={children_count > 0 ? 'primary' : 'gray'}
        />

        <StatCard
          title="Total Fee Balance"
          value={formatFee(fee_summary?.total_balance || 0)}
          icon={
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4z" clipRule="evenodd" />
              <path d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
            </svg>
          }
          color={fee_summary?.total_balance > 0 ? 'danger' : 'success'}
        />

        <StatCard
          title="Fee Payment"
          value={`${feePercentage}%`}
          icon={
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          }
          color={feePercentage >= 100 ? 'success' : feePercentage >= 50 ? 'warning' : 'danger'}
        />

        <StatCard
          title="Documents Status"
          value={documents_complete ? 'Complete' : 'Incomplete'}
          icon={
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" clipRule="evenodd" />
              <path d="M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V7z" />
            </svg>
          }
          color={documents_complete ? 'success' : 'warning'}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Children Section */}
          <div className="bg-white rounded-xl shadow-soft p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-800">My Children</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getChildrenCountColor(children_count)}`}>
                {children_count} child{children_count !== 1 ? 'ren' : ''}
              </span>
            </div>
            
            <ChildrenList children={children} loading={childrenLoading} />
            
            {children_count > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-medium text-gray-700 mb-3">Children by Class</h4>
                {children_by_class && Object.keys(children_by_class).length > 0 ? (
                  <div className="space-y-3">
                    {Object.entries(children_by_class).map(([className, classChildren]) => (
                      <div key={className} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium text-gray-800">{className}</span>
                        <span className="px-2 py-1 bg-white border border-gray-200 rounded text-sm">
                          {classChildren.length} student{classChildren.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No class grouping available</p>
                )}
              </div>
            )}
          </div>

          {/* Fee Information Section */}
          <div className="bg-white rounded-xl shadow-soft p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Fee Summary</h3>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Overall Payment Progress</span>
                  <span className="font-medium">{feePercentage}%</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      feePercentage >= 100 ? 'bg-green-500' : 
                      feePercentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${feePercentage}%` }}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-800">{formatFee(fee_summary?.total_fee || 0)}</div>
                  <div className="text-sm text-gray-600">Total Fee</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-700">{formatFee(fee_summary?.total_paid || 0)}</div>
                  <div className="text-sm text-green-600">Amount Paid</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-700">{formatFee(fee_summary?.total_balance || 0)}</div>
                  <div className="text-sm text-red-600">Balance Due</div>
                </div>
              </div>
              
              {outstanding_fees && outstanding_fees.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-3">Outstanding Fees by Child</h4>
                  <div className="space-y-3">
                    {outstanding_fees.map((child) => (
                      <div key={child.id} className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-800">{child.full_name}</div>
                          <div className="text-sm text-gray-600">{child.class_level_name}</div>
                        </div>
                        <div className="text-lg font-bold text-red-700">
                          {formatFee(child.balance_due)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Parent Information Card */}
          <div className="bg-white rounded-xl shadow-soft p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">My Information</h3>
            
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-600 mb-1">Full Name</div>
                <div className="font-medium">{user.first_name} {user.last_name}</div>
              </div>
              
              <div>
                <div className="text-sm text-gray-600 mb-1">Parent ID</div>
                <div className="font-medium">{parent?.parent_id}</div>
              </div>
              
              <div>
                <div className="text-sm text-gray-600 mb-1">Parent Type</div>
                <div className="font-medium">{parent?.parent_type_display}</div>
              </div>
              
              <div>
                <div className="text-sm text-gray-600 mb-1">Contact Information</div>
                <div className="space-y-1">
                  <div className="font-medium">{formatPhoneNumber(user.phone_number)}</div>
                  <div className="text-gray-700">{user.email}</div>
                  {parent?.office_phone && (
                    <div className="text-gray-700">Office: {formatPhoneNumber(parent.office_phone)}</div>
                  )}
                </div>
              </div>
              
              <div>
                <div className="text-sm text-gray-600 mb-1">Communication Preference</div>
                <div className="font-medium">{parent?.preferred_communication_display}</div>
                <div className="text-sm text-gray-600 mt-1">
                  {parent?.receive_sms_alerts && 'SMS • '}
                  {parent?.receive_email_alerts && 'Email'}
                  {!parent?.receive_sms_alerts && !parent?.receive_email_alerts && 'No alerts'}
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <Link
                  to={`/parents/${parent?.id}/update`}
                  className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors inline-block text-center"
                >
                  Update My Information
                </Link>
              </div>
            </div>
          </div>

          {/* Emergency Contact Card */}
          <div className="bg-white rounded-xl shadow-soft p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Emergency Contact</h3>
            
            {parent?.emergency_contact_name ? (
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Contact Person</div>
                  <div className="font-medium">{parent.emergency_contact_name}</div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-600 mb-1">Phone Number</div>
                  <div className="font-medium">{formatPhoneNumber(parent.emergency_contact_phone)}</div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-600 mb-1">Relationship</div>
                  <div className="font-medium">{parent.emergency_contact_relationship}</div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500">No emergency contact set</p>
                <Link
                  to={`/parents/${parent?.id}/update`}
                  className="mt-2 text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  Add Emergency Contact
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ParentDashboard;