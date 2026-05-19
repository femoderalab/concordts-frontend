/**
 * Link Child to Parent Modal Component
 * With real-time search as you type
 */

import React, { useState, useEffect, useRef } from 'react';
import { X, Search, User, BookOpen, Check, Loader2 } from 'lucide-react';
import Button from '../../components/common/Button';
import Modal from '../../components/common/modal';
import { searchStudentsForParent, searchParentsForLinking } from '../../services/parentService';

const LinkChildModal = ({ isOpen, onClose, onLink, loading, classLevels }) => {
  const [step, setStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedParent, setSelectedParent] = useState(null);
  const [parentSearchQuery, setParentSearchQuery] = useState('');
  const [parentSearchResults, setParentSearchResults] = useState([]);
  const [parentSearching, setParentSearching] = useState(false);
  const [relationshipType, setRelationshipType] = useState('father');
  const [error, setError] = useState('');
  
  // Debounce timer refs
  const studentDebounceTimer = useRef(null);
  const parentDebounceTimer = useRef(null);

  // Real-time search for students - triggers as you type
  useEffect(() => {
    if (step === 1 && searchQuery.trim().length >= 2) {
      // Clear previous timer
      if (studentDebounceTimer.current) {
        clearTimeout(studentDebounceTimer.current);
      }
      // Set new timer (300ms delay to avoid too many requests)
      studentDebounceTimer.current = setTimeout(() => {
        searchStudentRealTime();
      }, 300);
    } else if (searchQuery.trim().length < 2 && searchResults.length > 0) {
      setSearchResults([]);
    }
    
    return () => {
      if (studentDebounceTimer.current) {
        clearTimeout(studentDebounceTimer.current);
      }
    };
  }, [searchQuery, step]);

  // Real-time search for parents - triggers as you type
  useEffect(() => {
    if (step === 2 && parentSearchQuery.trim().length >= 2) {
      if (parentDebounceTimer.current) {
        clearTimeout(parentDebounceTimer.current);
      }
      parentDebounceTimer.current = setTimeout(() => {
        searchParentRealTime();
      }, 300);
    } else if (parentSearchQuery.trim().length < 2 && parentSearchResults.length > 0) {
      setParentSearchResults([]);
    }
    
    return () => {
      if (parentDebounceTimer.current) {
        clearTimeout(parentDebounceTimer.current);
      }
    };
  }, [parentSearchQuery, step]);

  const searchStudentRealTime = async () => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) return;
    
    try {
      setSearching(true);
      setError('');
      const data = await searchStudentsForParent(searchQuery.trim());
      setSearchResults(data.students || []);
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to search students');
    } finally {
      setSearching(false);
    }
  };

  const searchParentRealTime = async () => {
    if (!parentSearchQuery.trim() || parentSearchQuery.trim().length < 2) return;
    
    try {
      setParentSearching(true);
      setError('');
      const data = await searchParentsForLinking(parentSearchQuery.trim(), false);
      setParentSearchResults(data.parents || []);
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to search parents');
    } finally {
      setParentSearching(false);
    }
  };

  const handleSelectStudent = (student) => {
    setSelectedStudent(student);
    setSearchResults([]);
    setSearchQuery(student.full_name);
  };

  const handleSelectParent = (parent) => {
    setSelectedParent(parent);
    setParentSearchResults([]);
    setParentSearchQuery(parent.full_name);
  };

  const handleSubmit = () => {
    if (!selectedStudent || !selectedParent) {
      setError('Please select both a student and a parent');
      return;
    }
    onLink({
      student_admission_number: selectedStudent.admission_number,
      parent_id: selectedParent.parent_id,
      relationship_type: relationshipType
    });
  };

  const resetModal = () => {
    setStep(1);
    setSearchQuery('');
    setSearchResults([]);
    setSelectedStudent(null);
    setParentSearchQuery('');
    setParentSearchResults([]);
    setSelectedParent(null);
    setRelationshipType('father');
    setError('');
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Link Child to Parent" size="lg">
      <div className="py-4">
        {/* Step indicator */}
        <div className="flex items-center justify-between mb-6">
          <div className={`flex-1 text-center ${step >= 1 ? 'text-secondary-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center mb-1 ${step >= 1 ? 'bg-secondary-600 text-white' : 'bg-gray-200'}`}>1</div>
            <span className="text-xs">Select Student</span>
          </div>
          <div className="w-16 h-px bg-gray-200"></div>
          <div className={`flex-1 text-center ${step >= 2 ? 'text-secondary-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center mb-1 ${step >= 2 ? 'bg-secondary-600 text-white' : 'bg-gray-200'}`}>2</div>
            <span className="text-xs">Select Parent</span>
          </div>
          <div className="w-16 h-px bg-gray-200"></div>
          <div className={`flex-1 text-center ${step >= 3 ? 'text-secondary-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center mb-1 ${step >= 3 ? 'bg-secondary-600 text-white' : 'bg-gray-200'}`}>3</div>
            <span className="text-xs">Confirm</span>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Step 1: Select Student - Real-time search */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Search Student</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Type name or admission number (min 2 characters)..."
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary-500"
                  autoFocus
                />
                {searching && (
                  <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 animate-spin" size={16} />
                )}
              </div>
              <p className="text-xs text-gray-400 mt-1">Start typing to search - results appear automatically</p>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && !selectedStudent && (
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                  <span className="text-xs font-medium text-gray-600">Search Results ({searchResults.length})</span>
                </div>
                <div className="divide-y divide-gray-100 max-h-64 overflow-y-auto">
                  {searchResults.map((student) => (
                    <div
                      key={student.id}
                      className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3 transition-colors"
                      onClick={() => handleSelectStudent(student)}
                    >
                      <div className="w-10 h-10 bg-secondary-100 rounded-full flex items-center justify-center flex-shrink-0">
                        {student.profile_picture ? (
                          <img src={student.profile_picture} alt="" className="w-full h-full rounded-full object-cover" />
                        ) : (
                          <User size={18} className="text-secondary-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800">{student.full_name}</p>
                        <p className="text-xs text-gray-500">Adm: {student.admission_number} • {student.class_level || 'No Class'}</p>
                      </div>
                      <Check size={16} className="text-green-500 flex-shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {searchQuery.length >= 2 && !searching && searchResults.length === 0 && !selectedStudent && (
              <div className="text-center py-8 text-gray-500 text-sm">
                No students found. Try a different name or admission number.
              </div>
            )}

            {/* Selected Student */}
            {selectedStudent && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      {selectedStudent.profile_picture ? (
                        <img src={selectedStudent.profile_picture} alt="" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <User size={22} className="text-green-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{selectedStudent.full_name}</p>
                      <p className="text-xs text-gray-600">Adm: {selectedStudent.admission_number}</p>
                      <p className="text-xs text-gray-600">Class: {selectedStudent.class_level || 'N/A'}</p>
                    </div>
                  </div>
                  <button onClick={() => setSelectedStudent(null)} className="text-gray-400 hover:text-gray-600">
                    <X size={18} />
                  </button>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-4">
              <Button onClick={() => setStep(2)} disabled={!selectedStudent} className="bg-secondary-600 text-white">
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Select Parent - Real-time search */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Search Parent</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  value={parentSearchQuery}
                  onChange={(e) => setParentSearchQuery(e.target.value)}
                  placeholder="Type parent name or ID (min 2 characters)..."
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary-500"
                  autoFocus
                />
                {parentSearching && (
                  <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 animate-spin" size={16} />
                )}
              </div>
              <p className="text-xs text-gray-400 mt-1">Start typing to search - results appear automatically</p>
            </div>

            {/* Parent Search Results */}
            {parentSearchResults.length > 0 && !selectedParent && (
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                  <span className="text-xs font-medium text-gray-600">Search Results ({parentSearchResults.length})</span>
                </div>
                <div className="divide-y divide-gray-100 max-h-64 overflow-y-auto">
                  {parentSearchResults.map((parent) => (
                    <div
                      key={parent.id}
                      className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3 transition-colors"
                      onClick={() => handleSelectParent(parent)}
                    >
                      <div className="w-10 h-10 bg-secondary-100 rounded-full flex items-center justify-center flex-shrink-0">
                        {parent.profile_picture ? (
                          <img src={parent.profile_picture} alt="" className="w-full h-full rounded-full object-cover" />
                        ) : (
                          <User size={18} className="text-secondary-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800">{parent.full_name}</p>
                        <p className="text-xs text-gray-500">ID: {parent.parent_id} • {parent.parent_type_display} • {parent.children_count || 0} children</p>
                      </div>
                      <Check size={16} className="text-green-500 flex-shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {parentSearchQuery.length >= 2 && !parentSearching && parentSearchResults.length === 0 && !selectedParent && (
              <div className="text-center py-8 text-gray-500 text-sm">
                No parents found. Try a different name or parent ID.
              </div>
            )}

            {/* Selected Parent */}
            {selectedParent && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      {selectedParent.profile_picture ? (
                        <img src={selectedParent.profile_picture} alt="" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <User size={22} className="text-green-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{selectedParent.full_name}</p>
                      <p className="text-xs text-gray-600">ID: {selectedParent.parent_id}</p>
                      <p className="text-xs text-gray-600">Type: {selectedParent.parent_type_display}</p>
                    </div>
                  </div>
                  <button onClick={() => setSelectedParent(null)} className="text-gray-400 hover:text-gray-600">
                    <X size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* Relationship Type */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Relationship Type</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="father"
                    checked={relationshipType === 'father'}
                    onChange={(e) => setRelationshipType(e.target.value)}
                    className="w-4 h-4 text-secondary-600"
                  />
                  <span className="text-sm">Father</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="mother"
                    checked={relationshipType === 'mother'}
                    onChange={(e) => setRelationshipType(e.target.value)}
                    className="w-4 h-4 text-secondary-600"
                  />
                  <span className="text-sm">Mother</span>
                </label>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <Button onClick={() => setStep(1)} variant="outline">Back</Button>
              <Button onClick={() => setStep(3)} disabled={!selectedParent} className="bg-secondary-600 text-white">
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Confirm */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <h4 className="text-sm font-medium text-gray-800 mb-3">Link Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Student:</span>
                  <span className="font-medium">{selectedStudent?.full_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Student Admission:</span>
                  <span>{selectedStudent?.admission_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Parent:</span>
                  <span className="font-medium">{selectedParent?.full_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Parent ID:</span>
                  <span>{selectedParent?.parent_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Relationship:</span>
                  <span className="capitalize">{relationshipType}</span>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
              <p className="text-xs text-amber-700">
                ⚠️ This action will link the student to the parent. The parent will be able to view this student's information in their portal.
              </p>
            </div>

            <div className="flex justify-between pt-4">
              <Button onClick={() => setStep(2)} variant="outline">Back</Button>
              <Button onClick={handleSubmit} loading={loading} className="bg-secondary-600 text-white">
                {loading ? 'Linking...' : 'Confirm Link'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default LinkChildModal;