const REACT_APP_API_URL = import.meta.env.VITE_API_URL;

export const processImage = async (imageFile, onProgress) => {
  const formData = new FormData();
  formData.append('image', imageFile);

  try {
    if (onProgress) {
      return await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        
        xhr.open('POST', `${REACT_APP_API_URL}/ocr/process`);
        
        // Set CORS-related headers
        xhr.withCredentials = true;
        
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentComplete = Math.round((event.loaded / event.total) * 100);
            onProgress(percentComplete);
          }
        };
        
        xhr.onload = function() {
          if (this.status >= 200 && this.status < 300) {
            try {
              resolve(JSON.parse(xhr.response));
            } catch (e) {
              reject(new Error('Invalid JSON response'));
            }
          } else {
            reject(new Error(`Server returned ${this.status}: ${xhr.statusText}`));
          }
        };
        
        xhr.onerror = () => {
          reject(new Error('Network error occurred'));
        };
        
        xhr.ontimeout = () => {
          reject(new Error('Request timed out'));
        };
        
        xhr.timeout = 30000; // 30 seconds timeout
        xhr.send(formData);
      });
    } else {
      // Regular fetch with proper CORS handling
      const response = await fetch(`${REACT_APP_API_URL}/ocr/process`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          errorData = { message: response.statusText };
        }
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    }
  } catch (error) {
    console.error('API error:', error);
    throw error;
  }
};

// const REACT_APP_API_URL= import.meta.env.VITE_API_URL;
// if (!REACT_APP_API_URL) {
//   throw new Error('Missing REACT_APP_API_URL environment variable');
// }

// export const processImage = async (imageFile, onProgress) => {
//   // Create form data
//   const formData = new FormData();
//   formData.append('image', imageFile);
  
//   try {
//     // Use XMLHttpRequest for progress tracking
//     if (onProgress) {
//       return await new Promise((resolve, reject) => {
//         const xhr = new XMLHttpRequest();
        
//         xhr.open('POST', `${REACT_APP_API_URL}/ocr/process`);
        
//         xhr.upload.onprogress = (event) => {
//           if (event.lengthComputable) {
//             const percentComplete = Math.round((event.loaded / event.total) * 100);
//             onProgress(percentComplete);
//           }
//         };
        
//         xhr.onload = function() {
//           if (this.status >= 200 && this.status < 300) {
//             resolve(JSON.parse(xhr.response));
//           } else {
//             reject(new Error(`Server returned ${this.status}: ${xhr.response}`));
//           }
//         };
        
//         xhr.onerror = () => reject(new Error('Request failed'));
//         xhr.send(formData);
//       });
//     } else {
//       // Regular fetch without progress tracking
//       const response = await fetch(`${REACT_APP_API_URL}/ocr/process`, {
//         method: 'POST',
//         body: formData,
//       });
      
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'Failed to process image');
//       }
      
//       return await response.json();
//     }
//   } catch (error) {
//     console.error('API error:', error);
//     throw error;
//   }
// };
