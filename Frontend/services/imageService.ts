import axios from "axios";
import { Platform } from 'react-native';
import { API_URL } from '@env';

const url = `${API_URL}/predict/`; // Replace with your FastAPI URL

export const uploadImage = async (imageUri: string) => {
  try {
    console.log("Uploading image:", imageUri);
    
    // Create FormData
    const formData = new FormData();
    
    // Extract filename from URI
    const fileName = imageUri.split('/').pop() || 'image.jpg';
    
    // Get file extension
    const fileExtension = fileName.split('.').pop()?.toLowerCase() || 'jpg';
    // Determine MIME type based on file extension
    const mimeType = fileExtension === 'png' ? 'image/png' : 'image/jpeg';
    
    // Different approach based on platform
    if (Platform.OS === 'web') {
      // For web platform, fetch the image and convert to blob
      const response = await fetch(imageUri);
      const blob = await response.blob();
      
      // Create file from blob
      formData.append('file', blob, fileName);
    } else {
      // For native platforms (iOS, Android)
      const fileToUpload = {
        uri: imageUri,
        name: fileName,
        type: mimeType,
      } as any;
      
      formData.append('file', fileToUpload);
    }
    
    // Make POST request to the FastAPI backend
    const apiResponse = await axios.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "Accept": "application/json",
      },
    });
    
    console.log("API Response:", apiResponse.data);
    return apiResponse.data;
    
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};