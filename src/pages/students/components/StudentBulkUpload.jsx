// src/pages/students/components/StudentBulkUpload.jsx - UPDATED VERSION
import React, { useState, useCallback } from 'react';
import Modal from '../../../components/common/modal';
import { Text, Button, Card } from '../../../components/ui';
import { 
  Upload, Download, FileSpreadsheet, AlertCircle, CheckCircle, 
  X, RefreshCw, FileText, Trash2, Eye, ChevronDown, ChevronUp,
  Lock, Key
} from 'lucide-react';

export const StudentBulkUpload = ({ isOpen, onClose, onUpload, loading, downloadTemplate }) => {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState(null); // 'idle', 'uploading', 'success', 'error'
  const [uploadResult, setUploadResult] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  
  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      validateAndSetFile(selectedFile);
    }
  };
  
  // Handle drag and drop
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);
  
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      validateAndSetFile(droppedFile);
    }
  }, []);
  
  const validateAndSetFile = (selectedFile) => {
    // Check file type
    const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
    if (fileExtension !== 'csv') {
      alert('Please upload a valid CSV file');
      return;
    }
    
    // Check file size (max 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      alert('File too large. Maximum size is 10MB');
      return;
    }
    
    setFile(selectedFile);
    setUploadStatus('idle');
    setUploadResult(null);
  };
  
  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file first');
      return;
    }
    
    try {
      setUploadStatus('uploading');
      setUploadProgress(0);
      
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);
      
      const result = await onUpload(file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadResult(result);
      setUploadStatus('success');
      
      // Close modal after 3 seconds on success
      setTimeout(() => {
        onClose();
        setFile(null);
        setUploadStatus('idle');
        setUploadProgress(0);
        setUploadResult(null);
      }, 3000);
      
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadStatus('error');
      setUploadResult({ error: error.message });
    }
  };
  
  const handleRemoveFile = () => {
    setFile(null);
    setUploadStatus('idle');
    setUploadResult(null);
    setUploadProgress(0);
  };
  
  const handleDownloadTemplate = () => {
    downloadTemplate();
  };
  
  const handleClose = () => {
    setFile(null);
    setUploadStatus('idle');
    setUploadProgress(0);
    setUploadResult(null);
    setShowDetails(false);
    onClose();
  };
  
  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Bulk Upload Students" size="lg">
      <div className="py-4 space-y-4">
        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <Text variant="small" className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
            <FileSpreadsheet size={16} /> How to bulk upload:
          </Text>
          <ul className="text-xs text-blue-700 list-disc list-inside space-y-1 ml-2">
            <li>Download the CSV template below</li>
            <li>Fill in student details (required: first_name, last_name, class_level_id)</li>
            <li><strong>Password column:</strong> You can leave empty (default: admin123) OR provide hashed passwords</li>
            <li>Class level IDs can be found in the Class Levels section</li>
            <li>Upload the completed CSV file</li>
            <li>Students will be created or updated automatically</li>
          </ul>
        </div>
        
        {/* Password Info Box */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
          <div className="flex items-start gap-2">
            <Key size={16} className="text-yellow-600 mt-0.5" />
            <div>
              <Text variant="tiny" className="font-semibold text-yellow-800">Password Information:</Text>
              <Text variant="tiny" className="text-yellow-700">
                • Leave password column empty → Default password: <strong>admin123</strong>
              </Text>
              <Text variant="tiny" className="text-yellow-700">
                • Enter plain text password → System will hash it automatically
              </Text>
              <Text variant="tiny" className="text-yellow-700">
                • Enter already hashed password (starts with pbkdf2_sha256$) → Used as-is
              </Text>
            </div>
          </div>
        </div>
        
        {/* Download Template Button */}
        <Button 
          variant="outline" 
          size="medium" 
          icon={Download} 
          onClick={handleDownloadTemplate}
          className="w-full justify-center"
        >
          Download CSV Template (Includes Password Column)
        </Button>
        
        {/* File Upload Area with Drag & Drop */}
        <div 
          className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200
            ${dragActive ? 'border-[#D94801] bg-orange-50' : 'border-gray-300 hover:border-[#D94801]'}
            ${file ? 'bg-green-50 border-green-400' : ''}
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {!file ? (
            <>
              <Upload size={40} className="mx-auto text-gray-400 mb-3" />
              <Text variant="body" className="text-gray-600 mb-2">Drag & drop your CSV file here</Text>
              <Text variant="tiny" className="text-gray-400 mb-3">or</Text>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
                id="csv-upload"
              />
              <label
                htmlFor="csv-upload"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#D94801] text-white rounded-xl text-sm font-medium cursor-pointer hover:bg-[#C24000] transition-colors"
              >
                <Upload size={14} /> Browse Files
              </label>
              <Text variant="tiny" className="text-gray-400 mt-3">
                Supported format: CSV (Max 10MB)
              </Text>
            </>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center gap-3">
                  <FileText size={24} className="text-green-600" />
                  <div className="text-left">
                    <Text variant="small" className="font-medium text-gray-800">{file.name}</Text>
                    <Text variant="tiny" className="text-gray-400">
                      {(file.size / 1024).toFixed(2)} KB
                    </Text>
                  </div>
                </div>
                <button
                  onClick={handleRemoveFile}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  disabled={uploadStatus === 'uploading'}
                >
                  <Trash2 size={16} />
                </button>
              </div>
              
              {/* Upload Progress */}
              {uploadStatus === 'uploading' && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#D94801] rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
              
              {/* Success Message */}
              {uploadStatus === 'success' && uploadResult && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle size={16} className="text-green-600" />
                    <Text variant="small" className="font-semibold text-green-700">Upload Successful!</Text>
                  </div>
                  <div className="space-y-1 text-xs text-green-700">
                    <p>✓ {uploadResult.created || 0} students created successfully</p>
                    {uploadResult.updated > 0 && <p>✓ {uploadResult.updated} students updated</p>}
                    {uploadResult.errors && uploadResult.errors.length > 0 && (
                      <button 
                        onClick={() => setShowDetails(!showDetails)}
                        className="flex items-center gap-1 text-red-600 hover:text-red-700 mt-2"
                      >
                        {showDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        View {uploadResult.errors.length} errors
                      </button>
                    )}
                  </div>
                  
                  {showDetails && uploadResult.errors && uploadResult.errors.length > 0 && (
                    <div className="mt-3 max-h-40 overflow-y-auto bg-red-50 rounded-lg p-2">
                      {uploadResult.errors.map((err, idx) => (
                        <div key={idx} className="text-xs text-red-600 border-b border-red-100 py-1">
                          Row {err.row}: {err.error}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {/* Error Message */}
              {uploadStatus === 'error' && uploadResult && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <AlertCircle size={16} className="text-red-600" />
                    <Text variant="small" className="font-semibold text-red-700">Upload Failed</Text>
                  </div>
                  <Text variant="tiny" className="text-red-600 mt-1">
                    {uploadResult.error || 'An error occurred during upload. Please check your file and try again.'}
                  </Text>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Template Preview */}
        <div className="bg-gray-50 rounded-xl p-4">
          <Text variant="caption" className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Eye size={14} /> Template Structure
          </Text>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-1 px-2 text-gray-600">Column</th>
                  <th className="text-left py-1 px-2 text-gray-600">Required</th>
                  <th className="text-left py-1 px-2 text-gray-600">Description</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { col: 'registration_number', required: 'No', desc: 'Student registration number (auto-generated if empty)' },
                  { col: 'first_name', required: 'Yes', desc: 'Student first name' },
                  { col: 'last_name', required: 'Yes', desc: 'Student last name' },
                  { col: 'email', required: 'No', desc: 'Student email (optional)' },
                  { col: 'phone_number', required: 'No', desc: 'Phone number' },
                  { col: 'password', required: 'No', desc: 'Password (default: admin123, or provide hashed password)' },
                  { col: 'gender', required: 'No', desc: 'male/female' },
                  { col: 'date_of_birth', required: 'No', desc: 'YYYY-MM-DD format' },
                  { col: 'class_level_id', required: 'Yes', desc: 'Class level ID from system' },
                  { col: 'stream', required: 'No', desc: 'science/commercial/art/general' },
                  { col: 'house', required: 'No', desc: 'red/blue/green/yellow/purple/orange' },
                  { col: 'student_category', required: 'No', desc: 'day/boarding/scholarship' },
                  { col: 'admission_date', required: 'No', desc: 'YYYY-MM-DD format' },
                ].map((field, idx) => (
                  <tr key={idx}>
                    <td className="py-1 px-2 font-mono text-gray-800">{field.col}</td>
                    <td className="py-1 px-2">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${field.required === 'Yes' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-500'}`}>
                        {field.required}
                      </span>
                    </td>
                    <td className="py-1 px-2 text-gray-500">{field.desc}</td>
                   </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button variant="outline" onClick={handleClose} className="flex-1" disabled={uploadStatus === 'uploading'}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleUpload} 
            disabled={!file || uploadStatus === 'uploading'}
            loading={uploadStatus === 'uploading'}
            className="flex-1"
          >
            {uploadStatus === 'uploading' ? 'Uploading...' : 'Upload Students'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};