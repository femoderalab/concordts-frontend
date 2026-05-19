// src/pages/students/components/StudentModals.jsx
import React from 'react';
import Modal from '../../../components/common/modal';
import { Text, Button } from '../../../components/ui';
import { Eye, XCircle, Trash2, Lock, AlertCircle, User, BookOpen, DollarSign, Heart, FileText, RefreshCw } from 'lucide-react';

// View Modal Component
export const ViewStudentModal = ({ isOpen, onClose, student, studentDetails, loading, onEdit, onResetPassword, onArchive, onPrint, formatCurrency, formatDate }) => {
  if (!student && !studentDetails) return null;
  
  const data = studentDetails || student;
  const user = data?.user || {};
  const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim() || data?.full_name || 'Not Available';
  const registrationNumber = user.registration_number || studentDetails?.registration_number || 'N/A';
  const classLevelName = data?.class_level_info?.name || data?.class_level?.name || 'Not assigned';
  const totalFee = data?.total_fee_amount || 0;
  const amountPaid = data?.amount_paid || 0;
  const balanceDue = totalFee - amountPaid;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Student Details" size="lg">
      {loading ? (
        <div className="py-20 flex justify-center"><RefreshCw className="animate-spin h-8 w-8 text-[#D94801]" /></div>
      ) : (
        <div className="py-3 max-h-[75vh] overflow-y-auto space-y-4 px-1">
          {/* Header with Photo */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pb-4 border-b">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden">
              {data?.student_image_url ? (
                <img src={data.student_image_url} alt={fullName} className="w-full h-full object-cover" />
              ) : (
                <User size={24} className="text-blue-600" />
              )}
            </div>
            <div>
              <Text variant="h3" className="font-bold">{fullName}</Text>
              <div className="flex flex-wrap gap-2 mt-1">
                <Text variant="tiny" className="bg-gray-100 px-2 py-1 rounded">{data?.admission_number}</Text>
                <Text variant="tiny" className="bg-gray-100 px-2 py-1 rounded">{data?.student_id}</Text>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-medium bg-green-100 text-green-700">
                  Login: {registrationNumber}
                </span>
              </div>
            </div>
          </div>
          
          {/* Information Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Personal Info */}
            <div className="bg-gray-50 rounded-xl p-4">
              <Text variant="caption" className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <User size={14} /> Personal Information
              </Text>
              <div className="space-y-2">
                <div><Text variant="tiny" className="text-gray-500">Full Name</Text><Text variant="small" className="font-medium">{fullName}</Text></div>
                <div><Text variant="tiny" className="text-gray-500">Email</Text><Text variant="small">{user.email || 'Not provided'}</Text></div>
                <div><Text variant="tiny" className="text-gray-500">Phone</Text><Text variant="small">{user.phone_number || 'Not provided'}</Text></div>
                <div><Text variant="tiny" className="text-gray-500">Gender</Text><Text variant="small">{user.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : 'Not specified'}</Text></div>
                <div><Text variant="tiny" className="text-gray-500">Date of Birth</Text><Text variant="small">{user.date_of_birth || 'Not provided'}</Text></div>
              </div>
            </div>
            
            {/* Academic Info */}
            <div className="bg-gray-50 rounded-xl p-4">
              <Text variant="caption" className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <BookOpen size={14} /> Academic Information
              </Text>
              <div className="space-y-2">
                <div><Text variant="tiny" className="text-gray-500">Class Level</Text><Text variant="small" className="font-medium">{classLevelName}</Text></div>
                <div><Text variant="tiny" className="text-gray-500">Stream</Text><Text variant="small">{data?.stream || 'Not Applicable'}</Text></div>
                <div><Text variant="tiny" className="text-gray-500">House</Text><Text variant="small">{data?.house || 'None'}</Text></div>
                <div><Text variant="tiny" className="text-gray-500">Category</Text><Text variant="small">{data?.student_category || 'Day Student'}</Text></div>
                <div><Text variant="tiny" className="text-gray-500">Admission Date</Text><Text variant="small">{formatDate(data?.admission_date)}</Text></div>
              </div>
            </div>
            
            {/* Financial Info */}
            <div className="bg-gray-50 rounded-xl p-4">
              <Text variant="caption" className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <DollarSign size={14} /> Financial Information
              </Text>
              <div className="space-y-2">
                <div><Text variant="tiny" className="text-gray-500">Total Fee</Text><Text variant="small" className="font-bold">{formatCurrency(totalFee)}</Text></div>
                <div><Text variant="tiny" className="text-gray-500">Amount Paid</Text><Text variant="small" className="font-bold text-green-600">{formatCurrency(amountPaid)}</Text></div>
                <div><Text variant="tiny" className="text-gray-500">Balance Due</Text><Text variant="small" className="font-bold text-red-600">{formatCurrency(balanceDue)}</Text></div>
                <div><Text variant="tiny" className="text-gray-500">Fee Status</Text><Text variant="small">{data?.fee_status || 'Not Paid'}</Text></div>
              </div>
            </div>
            
            {/* Health Info */}
            <div className="bg-gray-50 rounded-xl p-4">
              <Text variant="caption" className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Heart size={14} /> Health Information
              </Text>
              <div className="space-y-2">
                <div><Text variant="tiny" className="text-gray-500">Blood Group</Text><Text variant="small">{data?.blood_group || 'Not specified'}</Text></div>
                <div><Text variant="tiny" className="text-gray-500">Genotype</Text><Text variant="small">{data?.genotype || 'Not specified'}</Text></div>
                <div><Text variant="tiny" className="text-gray-500">Allergies</Text><Text variant="small">{data?.has_allergies ? 'Yes' : 'No'}</Text></div>
                <div><Text variant="tiny" className="text-gray-500">Medical Conditions</Text><Text variant="small">{data?.medical_conditions || 'None'}</Text></div>
              </div>
            </div>
          </div>
          
          {/* Emergency Contact */}
          {(data?.emergency_contact_name || data?.emergency_contact_phone) && (
            <div className="bg-gray-50 rounded-xl p-4">
              <Text variant="caption" className="font-semibold text-gray-700 mb-3">Emergency Contact</Text>
              <div className="grid grid-cols-2 gap-3">
                <div><Text variant="tiny" className="text-gray-500">Name</Text><Text variant="small">{data?.emergency_contact_name || 'N/A'}</Text></div>
                <div><Text variant="tiny" className="text-gray-500">Phone</Text><Text variant="small">{data?.emergency_contact_phone || 'N/A'}</Text></div>
                <div><Text variant="tiny" className="text-gray-500">Relationship</Text><Text variant="small">{data?.emergency_contact_relationship || 'N/A'}</Text></div>
              </div>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex flex-wrap justify-end gap-3 pt-4 border-t">
            <Button variant="outline" size="small" onClick={onPrint} icon={FileText}>Print Record</Button>
            <Button variant="outline" size="small" onClick={() => { onClose(); onEdit(data); }} icon={Eye}>Edit</Button>
            <Button variant="danger" size="small" onClick={() => { onClose(); onArchive(data); }} icon={Trash2}>Archive</Button>
            <Button variant="primary" size="small" onClick={onClose}>Close</Button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export const RestoreStudentModal = ({ isOpen, onClose, student, onConfirm, loading }) => {
  if (!student) return null;
  
  const fullName = `${student.first_name || student.user?.first_name || ''} ${student.last_name || student.user?.last_name || ''}`.trim() || 'this student';
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Restore Student" size="sm">
      <div className="py-4 text-center">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <RefreshCw size={20} className="text-green-600" />
        </div>
        <Text variant="h4" className="font-semibold mb-2">Restore Student?</Text>
        <Text variant="caption" className="text-gray-500 mb-4 block">
          Are you sure you want to restore <span className="font-medium">{fullName}</span>? 
          <br />The student will be able to access the portal again.
        </Text>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
          <Button variant="success" onClick={onConfirm} disabled={loading} className="flex-1">
            {loading ? <RefreshCw size={14} className="animate-spin" /> : <RefreshCw size={14} />}
            Restore
          </Button>
        </div>
      </div>
    </Modal>
  );
};

// Archive Modal (instead of Delete)
export const ArchiveStudentModal = ({ isOpen, onClose, student, onConfirm, loading }) => {
  if (!student) return null;
  
  const fullName = `${student.first_name || student.user?.first_name || ''} ${student.last_name || student.user?.last_name || ''}`.trim() || 'this student';
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Archive Student" size="sm">
      <div className="py-4 text-center">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trash2 size={20} className="text-red-600" />
        </div>
        <Text variant="h4" className="font-semibold mb-2">Archive Student?</Text>
        <Text variant="caption" className="text-gray-500 mb-4 block">
          Are you sure you want to archive <span className="font-medium">{fullName}</span>? 
          <br />Archived students cannot access the portal or login. 
          <br />This action can be reversed by an administrator.
        </Text>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
          <Text variant="tiny" className="text-yellow-800 flex items-center gap-2">
            <AlertCircle size={14} /> Archiving a student will:
          </Text>
          <ul className="text-[10px] text-yellow-700 list-disc list-inside mt-1">
            <li>Prevent portal login access</li>
            <li>Show "Account Archived" error message on login</li>
            <li>Student must contact administration to restore access</li>
          </ul>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
          <Button variant="danger" onClick={onConfirm} disabled={loading} className="flex-1">
            {loading ? <RefreshCw size={14} className="animate-spin" /> : <Trash2 size={14} />}
            Archive
          </Button>
        </div>
      </div>
    </Modal>
  );
};

// Password Reset Modal
export const PasswordResetModal = ({ isOpen, onClose, student, formData, setFormData, errors, onSubmit, loading }) => {
  if (!student) return null;
  
  const fullName = `${student.first_name || student.user?.first_name || ''} ${student.last_name || student.user?.last_name || ''}`.trim() || 'Student';
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Reset Student Password" size="md">
      <form onSubmit={onSubmit} className="py-4 space-y-4">
        <div className="text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Lock size={20} className="text-blue-600" />
          </div>
          <Text variant="h4" className="font-semibold">Reset Password for {fullName}</Text>
          <Text variant="tiny" className="text-gray-500 mt-1">Only administrators can reset passwords</Text>
        </div>
        
        <div>
          <label className="block text-[10px] font-medium text-gray-500 mb-1">New Password *</label>
          <input
            type="password"
            name="new_password"
            value={formData.new_password}
            onChange={(e) => setFormData(prev => ({ ...prev, new_password: e.target.value }))}
            className={`w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801] ${errors.new_password ? 'border-red-500' : 'border-gray-200'}`}
            placeholder="Enter new password"
          />
          {errors.new_password && <Text variant="tiny" className="text-red-500 mt-1">{errors.new_password}</Text>}
        </div>
        
        <div>
          <label className="block text-[10px] font-medium text-gray-500 mb-1">Confirm Password *</label>
          <input
            type="password"
            name="confirm_password"
            value={formData.confirm_password}
            onChange={(e) => setFormData(prev => ({ ...prev, confirm_password: e.target.value }))}
            className={`w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801] ${errors.confirm_password ? 'border-red-500' : 'border-gray-200'}`}
            placeholder="Confirm new password"
          />
          {errors.confirm_password && <Text variant="tiny" className="text-red-500 mt-1">{errors.confirm_password}</Text>}
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <Text variant="tiny" className="text-yellow-800">
            <strong>Note:</strong> Password must be at least 5 characters long.
          </Text>
        </div>
        
        <div className="flex gap-3 pt-2">
          <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
          <Button variant="primary" type="submit" disabled={loading} className="flex-1">
            {loading ? <RefreshCw size={14} className="animate-spin" /> : <Lock size={14} />}
            Reset Password
          </Button>
        </div>
      </form>
    </Modal>
  );
};