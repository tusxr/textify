// client/src/components/TextViewer.jsx
import React, { useState } from 'react';

const TextViewer = ({ ocrResult }) => {
  const [copySuccess, setCopySuccess] = useState('');
  
  if (!ocrResult || !ocrResult.data) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 min-h-64 flex items-center justify-center text-gray-500">
        <p>Extracted text will appear here</p>
      </div>
    );
  }
  
  const { fullText, words } = ocrResult.data;
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(fullText).then(
      () => {
        setCopySuccess('Copied!');
        setTimeout(() => setCopySuccess(''), 2000);
      },
      (err) => {
        console.error('Failed to copy text: ', err);
        setCopySuccess('Failed to copy');
      }
    );
  };
  
  const downloadText = () => {
    const element = document.createElement('a');
    const file = new Blob([fullText], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = 'textify-extraction.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="border-b border-gray-200 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-medium text-gray-800">Extracted Text</h3>
        <div className="flex space-x-2">
          <button 
            className="btn-secondary text-sm py-1"
            onClick={copyToClipboard}
          >
            {copySuccess || 'Copy Text'}
          </button>
          <button 
            className="btn-secondary text-sm py-1"
            onClick={downloadText}
          >
            Download
          </button>
        </div>
      </div>
      
      <div className="p-4 overflow-auto max-h-96">
        {fullText ? (
          <pre className="whitespace-pre-wrap font-mono text-sm text-gray-700">{fullText}</pre>
        ) : (
          <p className="text-gray-500 text-center py-8">No text was detected in the image</p>
        )}
      </div>
      
      {words && words.length > 0 && (
        <div className="bg-gray-50 px-4 py-2 border-t border-gray-200">
          <p className="text-xs text-gray-600">Detected {words.length} words in the image</p>
        </div>
      )}
    </div>
  );
};

export default TextViewer;