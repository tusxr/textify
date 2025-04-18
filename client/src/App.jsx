import React, { useState } from 'react';
import ImageUploader from './components/ImageUploader.jsx';
import TextViewer from './components/TextViewer';
import LoadingSpinner from './components/LoadingSpinner';
import Navbar from './components/Navbar';
import { processImage } from './services/api';

function App() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [ocrResult, setOcrResult] = useState(null);
  const [error, setError] = useState(null);
  
  const handleImageUpload = async (imageFile) => {
    setIsProcessing(true);
    setError(null);
    setUploadProgress(0);
    
    try {
      const result = await processImage(imageFile, (progress) => {
        setUploadProgress(progress);
      });
      
      setOcrResult(result);
    } catch (err) {
      console.error('Error processing image:', err);
      setError(err.message || 'Failed to process image');
      setOcrResult(null);
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-800">
  <Navbar />

  <main className="flex-grow container max-w-6xl mx-auto px-4 py-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Image Input Section */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Image Input</h2>

        <ImageUploader 
          onUpload={handleImageUpload}
          isProcessing={isProcessing}
        />

        {isProcessing && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <LoadingSpinner />
            <span>Processing image... {uploadProgress}%</span>
          </div>
        )}

        {error && (
          <div className="bg-red-100 text-red-700 text-sm p-3 rounded">
            {error}
          </div>
        )}
      </section>

      {/* OCR Results Section */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">OCR Results</h2>
        <TextViewer ocrResult={ocrResult} />
      </section>
    </div>
  </main>

  <footer className="bg-gray-900 text-gray-100 py-4 text-center text-sm">
    <p>Textify OCR • Extract text from images with ease</p>
  </footer>
</div>
  );
}

export default App;