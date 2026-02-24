import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import Alert from '../../components/common/Alert';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import useAuth from '../../hooks/useAuth';
import staffService from '../../services/staffService';

const StaffDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showSalary, setShowSalary] = useState(false);
  const [salaryData, setSalaryData] = useState(null);

  const isAdmin = user?.role === 'head' || user?.role === 'principal' || 
                  user?.role === 'vice_principal' || user?.role === 'secretary';
  
  const canViewSalary = isAdmin || user?.role === 'accountant' || staff?.user?.id === user?.id;

  useEffect(() => {
    fetchStaff();
  }, [id]);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const data = await staffService.getStaffById(id);
      setStaff(data);
      setError('');
    } catch (err) {
      setError('Failed to load staff details');
    } finally {
      setLoading(false);
    }
  };

  const fetchSalary = async () => {
    try {
      const data = await staffService.getStaffSalary(id);
      setSalaryData(data);
      setShowSalary(true);
    } catch (err) {
      setError('Failed to load salary information');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this staff member?')) {
      return;
    }

    try {
      await staffService.deleteStaff(id);
      navigate('/staff');
    } catch (err) {
      setError('Failed to delete staff member');
    }
  };

  const handleActivate = async () => {
    try {
      await staffService.activateStaff(id);
      fetchStaff();
    } catch (err) {
      setError('Failed to activate staff member');
    }
  };

  const handleDeactivate = async () => {
    if (!window.confirm('Are you sure you want to deactivate this staff member?')) {
      return;
    }

    try {
      await staffService.deactivateStaff(id);
      fetchStaff();
    } catch (err) {
      setError('Failed to deactivate staff member');
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <Loader />
        </div>
      </DashboardLayout>
    );
  }

  if (!staff) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900">Staff member not found</h2>
          <Button
            onClick={() => navigate('/staff')}
            variant="secondary"
            className="mt-4"
          >
            Back to Staff List
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  {staff.user?.first_name} {staff.user?.last_name}
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                  Staff ID: {staff.staff_id} | Employee No: {staff.employee_number}
                </p>
              </div>
              <div className="flex space-x-3">
                {isAdmin && (
                  <>
                    <Button
                      onClick={() => navigate(`/staff/${id}/edit`)}
                      variant="primary"
                    >
                      Edit
                    </Button>
                    {staff.is_active ? (
                      <Button
                        onClick={handleDeactivate}
                        variant="warning"
                      >
                        Deactivate
                      </Button>
                    ) : (
                      <Button
                        onClick={handleActivate}
                        variant="success"
                      >
                        Activate
                      </Button>
                    )}
                    <Button
                      onClick={handleDelete}
                      variant="danger"
                    >
                      Delete
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>

          {error && (
            <Alert type="error" message={error} onClose={() => setError('')} />
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Staff Information
                  </h3>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Department</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {staff.department_display || staff.department}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Position</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {staff.position_title || 'N/A'}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Employment Type</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {staff.employment_type_display || staff.employment_type}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Employment Date</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {new Date(staff.employment_date).toLocaleDateString()}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Highest Qualification</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {staff.highest_qualification || 'N/A'}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Years of Experience</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {staff.years_of_experience || 0} years
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              <div className="bg-white shadow rounded-lg mt-6">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Contact Information
                  </h3>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Email</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {staff.user?.email || 'N/A'}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Phone</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {staff.user?.phone_number || 'N/A'}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Next of Kin</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {staff.next_of_kin_name || 'N/A'}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Relationship</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {staff.next_of_kin_relationship || 'N/A'}
                      </dd>
                    </div>
                    <div className="sm:col-span-2">
                      <dt className="text-sm font-medium text-gray-500">Next of Kin Phone</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {staff.next_of_kin_phone || 'N/A'}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>

            <div>
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Status & Actions
                  </h3>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Status</h4>
                      <div className="mt-2">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          staff.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {staff.is_active ? 'Active' : 'Inactive'}
                        </span>
                        {staff.is_on_leave && (
                          <span className="ml-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                            On Leave
                          </span>
                        )}
                      </div>
                    </div>

                    {canViewSalary && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Salary Information</h4>
                        <div className="mt-2 space-y-2">
                          {showSalary && salaryData ? (
                            <div className="text-sm">
                              <p>Basic Salary: ₦{parseFloat(salaryData.salary_info?.basic_salary || 0).toLocaleString()}</p>
                              <p>Scale: {salaryData.salary_info?.salary_scale || 'N/A'}</p>
                              <p>Step: {salaryData.salary_info?.salary_step || 'N/A'}</p>
                            </div>
                          ) : (
                            <Button
                              onClick={fetchSalary}
                              variant="secondary"
                              size="sm"
                            >
                              View Salary
                            </Button>
                          )}
                        </div>
                      </div>
                    )}

                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Leave Information</h4>
                      <div className="mt-2 text-sm">
                        <p>Annual Leave: {staff.annual_leave_days || 21} days</p>
                        <p>Taken: {staff.leave_days_taken || 0} days</p>
                        <p>Remaining: {staff.leave_days_remaining || 21} days</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Health Information</h4>
                      <div className="mt-2 text-sm">
                        <p>Blood Group: {staff.blood_group || 'N/A'}</p>
                        <p>Genotype: {staff.genotype || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StaffDetail;