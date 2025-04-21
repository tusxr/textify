const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const processImage = async (imageFile, onProgress) => {
  // Create form data
  const formData = new FormData();
  formData.append('image', imageFile);
  
  try {
    // Use XMLHttpRequest for progress tracking
    if (onProgress) {
      return await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        
        xhr.open('POST', `${API_URL}/ocr/process`);
        
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentComplete = Math.round((event.loaded / event.total) * 100);
            onProgress(percentComplete);
          }
        };
        
        xhr.onload = function() {
          if (this.status >= 200 && this.status < 300) {
            resolve(JSON.parse(xhr.response));
          } else {
            reject(new Error(`Server returned ${this.status}: ${xhr.response}`));
          }
        };
        
        xhr.onerror = () => reject(new Error('Request failed'));
        xhr.send(formData);
      });
    } else {
      // Regular fetch without progress tracking
      const response = await fetch(`${API_URL}/ocr/process`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to process image');
      }
      
      return await response.json();
    }
  } catch (error) {
    console.error('API error:', error);
    throw error;
  }
};