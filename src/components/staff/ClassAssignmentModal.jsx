import React, { useState, useEffect } from 'react';
import Modal from '../common/modal';
import Button from '../common/Button';
import { getClasses } from '../../services/academicService';
import { getSubjects } from '../../services/academicService';
import { updateStaffAssignments } from '../../services/staffService';
import { Search, X, Check, Plus, Trash2, BookOpen, GraduationCap } from 'lucide-react';

const ClassAssignmentModal = ({ isOpen, onClose, staff, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Assignment state
  const [assignedClassIds, setAssignedClassIds] = useState([]);
  const [assistantClassIds, setAssistantClassIds] = useState([]);
  const [subjectIds, setSubjectIds] = useState([]);
  
  // Tab state
  const [activeTab, setActiveTab] = useState('classes');

  useEffect(() => {
    if (isOpen && staff) {
      loadData();
      // Initialize with current assignments
      setAssignedClassIds(staff.assigned_classes?.map(c => c.id) || []);
      setAssistantClassIds(staff.assistant_classes?.map(c => c.id) || []);
      setSubjectIds(staff.subjects_taught?.map(s => s.id) || []);
    }
  }, [isOpen, staff]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [classesRes, subjectsRes] = await Promise.all([
        getClasses({ is_active: true, limit: 100 }),
        getSubjects({ is_active: true, limit: 100 })
      ]);
      
      setClasses(classesRes.results || classesRes || []);
      setSubjects(subjectsRes.results || subjectsRes || []);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load classes and subjects');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      
      const result = await updateStaffAssignments(staff.id, {
        assigned_class_ids: assignedClassIds,
        assistant_class_ids: assistantClassIds,
        subject_ids: subjectIds
      });
      
      if (result.success) {
        if (onSuccess) onSuccess();
        onClose();
      } else {
        setError(result.message || 'Failed to update assignments');
      }
    } catch (err) {
      setError(err.message || 'Failed to update assignments');
    } finally {
      setSaving(false);
    }
  };

  const toggleAssignedClass = (classId) => {
    setAssignedClassIds(prev => 
      prev.includes(classId) 
        ? prev.filter(id => id !== classId)
        : [...prev, classId]
    );
    // Also remove from assistant if moving to assigned
    if (assistantClassIds.includes(classId)) {
      setAssistantClassIds(prev => prev.filter(id => id !== classId));
    }
  };

  const toggleAssistantClass = (classId) => {
    setAssistantClassIds(prev => 
      prev.includes(classId) 
        ? prev.filter(id => id !== classId)
        : [...prev, classId]
    );
    // Also remove from assigned if moving to assistant
    if (assignedClassIds.includes(classId)) {
      setAssignedClassIds(prev => prev.filter(id => id !== classId));
    }
  };

  const toggleSubject = (subjectId) => {
    setSubjectIds(prev => 
      prev.includes(subjectId) 
        ? prev.filter(id => id !== subjectId)
        : [...prev, subjectId]
    );
  };

  const filteredClasses = classes.filter(c => 
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSubjects = subjects.filter(s => 
    s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Assign Classes - ${staff?.user?.first_name || 'Staff'}`} size="lg">
      <div className="py-4 max-h-[70vh] overflow-y-auto">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-4">
          <button
            onClick={() => setActiveTab('classes')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'classes' 
                ? 'text-gray-900 border-b-2 border-gray-900' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <GraduationCap size={14} className="inline mr-2" />
            Classes ({classes.length})
          </button>
          <button
            onClick={() => setActiveTab('subjects')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'subjects' 
                ? 'text-gray-900 border-b-2 border-gray-900' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <BookOpen size={14} className="inline mr-2" />
            Subjects ({subjects.length})
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={`Search ${activeTab === 'classes' ? 'classes' : 'subjects'}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mx-auto"></div>
            <p className="text-sm text-gray-500 mt-2">Loading...</p>
          </div>
        ) : activeTab === 'classes' ? (
          <div className="space-y-4">
            {/* Assigned Classes Section */}
            {assignedClassIds.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <Check size={14} className="text-green-600 mr-1" />
                  Assigned Classes ({assignedClassIds.length})
                </h4>
                <div className="space-y-1">
                  {classes.filter(c => assignedClassIds.includes(c.id)).map(cls => (
                    <div key={cls.id} className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                      <div>
                        <span className="text-sm font-medium text-gray-800">{cls.name}</span>
                        <span className="text-xs text-gray-500 ml-2">({cls.code})</span>
                      </div>
                      <button
                        onClick={() => toggleAssignedClass(cls.id)}
                        className="p-1 text-red-500 hover:text-red-700 rounded"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Assistant Classes Section */}
            {assistantClassIds.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <Plus size={14} className="text-blue-600 mr-1" />
                  Assistant Classes ({assistantClassIds.length})
                </h4>
                <div className="space-y-1">
                  {classes.filter(c => assistantClassIds.includes(c.id)).map(cls => (
                    <div key={cls.id} className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
                      <div>
                        <span className="text-sm font-medium text-gray-800">{cls.name}</span>
                        <span className="text-xs text-gray-500 ml-2">({cls.code})</span>
                      </div>
                      <button
                        onClick={() => toggleAssistantClass(cls.id)}
                        className="p-1 text-red-500 hover:text-red-700 rounded"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Available Classes */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Available Classes</h4>
              <div className="space-y-1 max-h-60 overflow-y-auto">
                {filteredClasses.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-4">No classes found</p>
                ) : (
                  filteredClasses.map(cls => {
                    const isAssigned = assignedClassIds.includes(cls.id);
                    const isAssistant = assistantClassIds.includes(cls.id);
                    
                    if (isAssigned || isAssistant) return null;
                    
                    return (
                      <div key={cls.id} className="flex items-center justify-between p-2 border border-gray-100 rounded-lg hover:bg-gray-50">
                        <div>
                          <span className="text-sm text-gray-800">{cls.name}</span>
                          <span className="text-xs text-gray-400 ml-2">({cls.code})</span>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => toggleAssignedClass(cls.id)}
                            className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
                          >
                            Assign
                          </button>
                          <button
                            onClick={() => toggleAssistantClass(cls.id)}
                            className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                          >
                            Assistant
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Selected Subjects */}
            {subjectIds.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                  Selected Subjects ({subjectIds.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {subjects.filter(s => subjectIds.includes(s.id)).map(subj => (
                    <span key={subj.id} className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      {subj.name}
                      <button onClick={() => toggleSubject(subj.id)} className="hover:text-red-600">
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Available Subjects */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Available Subjects</h4>
              <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                {filteredSubjects.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-4 col-span-2">No subjects found</p>
                ) : (
                  filteredSubjects.map(subj => {
                    const isSelected = subjectIds.includes(subj.id);
                    return (
                      <button
                        key={subj.id}
                        onClick={() => toggleSubject(subj.id)}
                        className={`flex items-center justify-between p-2 rounded-lg text-left text-sm transition-colors ${
                          isSelected 
                            ? 'bg-green-100 border border-green-300 text-green-800'
                            : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <span>{subj.name}</span>
                        {isSelected && <Check size={14} className="text-green-600" />}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            loading={saving}
            disabled={saving}
            className="bg-gray-900 hover:bg-gray-700"
          >
            Save Assignments
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ClassAssignmentModal;