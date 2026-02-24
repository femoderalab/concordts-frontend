import React, { useState } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import Alert from '../common/Alert';

const LinkChildModal = ({ 
  isOpen, 
  onClose, 
  onLinkChild, 
  parent, 
  loading 
}) => {
  const [formData, setFormData] = useState({
    student_admission_number: '',
    relationship_type: 'father'
  });
  const [error, setError] = useState('');
  const [searching, setSearching] = useState(false);
  const [studentResults, setStudentResults] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSearchStudent = async () => {
    if (!formData.student_admission_number.trim()) {
      setError('Please enter an admission number');
      return;
    }

    try {
      setSearching(true);
      setError('');
      // This would call an API to search for students
      // For now, we'll simulate it
      setTimeout(() => {
        setStudentResults([
          { id: 1, admission_number: formData.student_admission_number, full_name: 'John Doe', class: 'Primary 5' },
          { id: 2, admission_number: 'ADM/2024/002', full_name: 'Jane Smith', class: 'Primary 6' }
        ]);
        setSearching(false);
      }, 500);
    } catch (err) {
      setError('Error searching for student');
      setSearching(false);
    }
  };

  const handleSelectStudent = (student) => {
    setSelectedStudent(student);
    setFormData(prev => ({ ...prev, student_admission_number: student.admission_number }));
    setStudentResults([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedStudent) {
      setError('Please select a student');
      return;
    }

    if (!formData.relationship_type) {
      setError('Please select a relationship type');
      return;
    }

    onLinkChild({
      parent_id: parent.parent_id,
      student_admission_number: selectedStudent.admission_number,
      relationship_type: formData.relationship_type
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Link Child to Parent"
      size="lg"
    >
      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => setError('')}
          className="mb-4"
        />
      )}

      <div className="mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold">
                  {parent.user?.first_name?.[0] || 'P'}
                </span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-900">
                {parent.user?.first_name} {parent.user?.last_name}
              </p>
              <p className="text-sm text-blue-700">
                Parent ID: {parent.parent_id}
              </p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Student Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Student Admission Number *
            </label>
            <div className="flex space-x-3">
              <div className="flex-1">
                <Input
                  name="student_admission_number"
                  value={formData.student_admission_number}
                  onChange={handleChange}
                  placeholder="e.g., ADM/2024/001"
                  disabled={loading || searching}
                />
              </div>
              <div>
                <Button
                  type="button"
                  onClick={handleSearchStudent}
                  loading={searching}
                  disabled={loading || searching}
                >
                  Search
                </Button>
              </div>
            </div>
          </div>

          {/* Search Results */}
          {studentResults.length > 0 && !selectedStudent && (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                <h4 className="font-medium text-gray-700">Search Results</h4>
              </div>
              <div className="divide-y divide-gray-200">
                {studentResults.map((student) => (
                  <div
                    key={student.id}
                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleSelectStudent(student)}
                  >
                    <div className="font-medium text-gray-800">{student.full_name}</div>
                    <div className="text-sm text-gray-600">
                      Admission: {student.admission_number} • Class: {student.class}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Selected Student */}
          {selectedStudent && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-green-800">Selected Student</h4>
                  <div className="mt-1">
                    <div className="font-medium text-gray-800">{selectedStudent.full_name}</div>
                    <div className="text-sm text-gray-600">
                      Admission: {selectedStudent.admission_number} • Class: {selectedStudent.class}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedStudent(null);
                    setFormData(prev => ({ ...prev, student_admission_number: '' }));
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Relationship Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Relationship Type *
            </label>
            <select
              name="relationship_type"
              value={formData.relationship_type}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              disabled={loading}
            >
              <option value="father">Father</option>
              <option value="mother">Mother</option>
              <option value="guardian">Guardian</option>
            </select>
          </div>

          {/* Summary */}
          {selectedStudent && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-700 mb-3">Link Summary</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Parent:</span>
                  <span className="font-medium">
                    {parent.user?.first_name} {parent.user?.last_name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Student:</span>
                  <span className="font-medium">{selectedStudent.full_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Relationship:</span>
                  <span className="font-medium">
                    {formData.relationship_type === 'father' ? 'Father' : 
                     formData.relationship_type === 'mother' ? 'Mother' : 'Guardian'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={loading}
            disabled={loading || !selectedStudent}
          >
            Link Child
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default LinkChildModal;