import React, { useState, useRef } from 'react';

const ImageUploader = ({ onUpload, isProcessing }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      updatePreview(file);
    }
  };
  
  const updatePreview = (file) => {
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };
  
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      updatePreview(file);
    }
  };
  
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };
  
  const handleUpload = () => {
    if (selectedFile) {
      onUpload(selectedFile);
    }
  };
  
  return (
    <div className="space-y-4">
      <div 
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          dragActive 
            ? 'border-primary-500 bg-primary-50' 
            : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleButtonClick}
      >
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*,.pdf"
          className="hidden"
        />
        
        {preview ? (
          <div className="relative">
            <img 
              src={preview} 
              alt="Preview" 
              className="mx-auto max-h-64 rounded object-contain"
            />
          </div>
        ) : (
          <div className="py-8">
            <div className="text-4xl mb-3">📷</div>
            <p className="text-gray-600 mb-4">Drag and drop an image here or click to select</p>
            <button 
              type="button" 
              className="btn-secondary"
            >
              Select Image
            </button>
          </div>
        )}
      </div>
      
      {selectedFile && (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-gray-600">
              <span className="font-medium">{selectedFile.name}</span> 
              <span className="ml-2">({Math.round(selectedFile.size / 1024)} KB)</span>
            </p>
            <button 
              className={`btn-primary ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleUpload}
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Extract Text'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;