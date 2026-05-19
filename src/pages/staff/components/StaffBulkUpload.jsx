// src/pages/staff/components/StaffBulkUpload.jsx
import React, { useState, useCallback } from 'react';
import Modal from '../../../components/common/modal';
import { Text, Button } from '../../../components/ui';
import { 
  Upload, Download, FileSpreadsheet, AlertCircle, CheckCircle, 
  X, RefreshCw, FileText, Trash2, Eye, ChevronDown, ChevronUp,
  Key
} from 'lucide-react';

// Template download function
const downloadStaffTemplate = () => {
  const headers = [
    'first_name', 'last_name', 'email', 'phone_number', 'password',
    'gender', 'date_of_birth', 'address', 'city', 'state_of_origin',
    'lga', 'nationality', 'role', 'department', 'position_title',
    'employment_type', 'employment_date', 'highest_qualification',
    'qualification_institution', 'year_of_graduation', 'specialization',
    'trcn_number', 'blood_group', 'genotype', 'emergency_contact_name',
    'emergency_contact_phone', 'emergency_contact_relationship',
    'next_of_kin_name', 'next_of_kin_relationship', 'next_of_kin_phone',
    'bank_name', 'account_name', 'account_number', 'basic_salary',
    'salary_scale', 'salary_step', 'annual_leave_days', 'sick_leave_days',
    'years_of_experience', 'is_active'
  ];
  
  const exampleRow = [
    'John', 'Doe', 'john.doe@example.com', '08012345678', 'Staff@2024',
    'male', '1990-01-01', '123 Main St', 'Lagos', 'lagos',
    'Ikeja', 'Nigerian', 'teacher', 'academic', 'Mathematics Teacher',
    'full_time', '2024-01-01', 'B.Sc Education', 'University of Lagos',
    '2015', 'Mathematics', 'TRCN12345', 'O+', 'AA', 'Jane Doe',
    '08087654321', 'Spouse', 'Mike Doe', 'Brother', '08011223344',
    'First Bank', 'John Doe', '1234567890', '150000',
    'CONMESS 6', '1', '21', '10', '5', 'true'
  ];
  
  const csvContent = [headers, exampleRow].map(row => 
    row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
  ).join('\n');
  
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `staff_upload_template.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
};

export const StaffBulkUpload = ({ isOpen, onClose, onUpload, loading }) => {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [uploadResult, setUploadResult] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      validateAndSetFile(selectedFile);
    }
  };
  
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
    const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
    if (fileExtension !== 'csv') {
      alert('Please upload a valid CSV file');
      return;
    }
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
    downloadStaffTemplate();
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
    <Modal isOpen={isOpen} onClose={handleClose} title="Bulk Upload Staff" size="lg">
      <div className="py-4 space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <Text variant="small" className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
            <FileSpreadsheet size={16} /> How to bulk upload staff:
          </Text>
          <ul className="text-xs text-blue-700 list-disc list-inside space-y-1 ml-2">
            <li>Download the CSV template below</li>
            <li>Fill in staff details (required: first_name, last_name, role, department)</li>
            <li><strong>Password column:</strong> Leave empty (default: Staff@2024) OR provide hashed passwords</li>
            <li>Upload the completed CSV file</li>
            <li>Staff will be created automatically with user accounts</li>
          </ul>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
          <div className="flex items-start gap-2">
            <Key size={16} className="text-yellow-600 mt-0.5" />
            <div>
              <Text variant="tiny" className="font-semibold text-yellow-800">Password Information:</Text>
              <Text variant="tiny" className="text-yellow-700">• Leave password column empty → Default password: <strong>Staff@2024</strong></Text>
              <Text variant="tiny" className="text-yellow-700">• Enter plain text password → System will hash it automatically</Text>
              <Text variant="tiny" className="text-yellow-700">• Enter already hashed password → Used as-is</Text>
            </div>
          </div>
        </div>
        
        <Button variant="outline" size="medium" icon={Download} onClick={handleDownloadTemplate} className="w-full justify-center">
          Download CSV Template (Includes Password Column)
        </Button>
        
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
              <input type="file" accept=".csv" onChange={handleFileChange} className="hidden" id="csv-upload" />
              <label htmlFor="csv-upload" className="inline-flex items-center gap-2 px-4 py-2 bg-[#D94801] text-white rounded-xl text-sm font-medium cursor-pointer hover:bg-[#C24000] transition-colors">
                <Upload size={14} /> Browse Files
              </label>
              <Text variant="tiny" className="text-gray-400 mt-3">Supported format: CSV (Max 10MB)</Text>
            </>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center gap-3">
                  <FileText size={24} className="text-green-600" />
                  <div className="text-left">
                    <Text variant="small" className="font-medium text-gray-800">{file.name}</Text>
                    <Text variant="tiny" className="text-gray-400">{(file.size / 1024).toFixed(2)} KB</Text>
                  </div>
                </div>
                <button onClick={handleRemoveFile} className="p-1 text-gray-400 hover:text-red-500 transition-colors" disabled={uploadStatus === 'uploading'}>
                  <Trash2 size={16} />
                </button>
              </div>
              
              {uploadStatus === 'uploading' && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-[#D94801] rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                  </div>
                </div>
              )}
              
              {uploadStatus === 'success' && uploadResult && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle size={16} className="text-green-600" />
                    <Text variant="small" className="font-semibold text-green-700">Upload Successful!</Text>
                  </div>
                  <div className="space-y-1 text-xs text-green-700">
                    <p>✓ {uploadResult.created || 0} staff created successfully</p>
                    {uploadResult.updated > 0 && <p>✓ {uploadResult.updated} staff updated</p>}
                    {uploadResult.errors && uploadResult.errors.length > 0 && (
                      <button onClick={() => setShowDetails(!showDetails)} className="flex items-center gap-1 text-red-600 hover:text-red-700 mt-2">
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
        
        <div className="flex gap-3 pt-2">
          <Button variant="outline" onClick={handleClose} className="flex-1" disabled={uploadStatus === 'uploading'}>Cancel</Button>
          <Button variant="primary" onClick={handleUpload} disabled={!file || uploadStatus === 'uploading'} loading={uploadStatus === 'uploading'} className="flex-1">
            {uploadStatus === 'uploading' ? 'Uploading...' : 'Upload Staff'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};