'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../utils/api';
import ProtectedRoute from '../../../components/ProtectedRoute';

// Cloudinary configuration
const CLOUDINARY_CLOUD_NAME = 'dkgxwotil';
const CLOUDINARY_UPLOAD_PRESET = 'ml_default';

export default function CreatePickupPage() {
  const [formData, setFormData] = useState({
    category: '',
    weight: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [locationError, setLocationError] = useState('');
  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('Image size must be less than 10MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }

      setImageFile(file);
      setError('');
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadToCloudinary = async () => {
    if (!imageFile) return null;

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', imageFile);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      formData.append('cloud_name', CLOUDINARY_CLOUD_NAME);

      console.log('Uploading to Cloudinary...');
      console.log('Cloud Name:', CLOUDINARY_CLOUD_NAME);
      console.log('Upload Preset:', CLOUDINARY_UPLOAD_PRESET);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Cloudinary error:', errorData);
        throw new Error(errorData.error?.message || 'Upload failed');
      }

      const data = await response.json();
      console.log('Cloudinary upload successful:', data.secure_url);
      
      setUploadedImageUrl(data.secure_url);
      setUploading(false);
      return data.secure_url;
    } catch (err) {
      console.error('Cloudinary upload error:', err);
      setError(`Image upload failed: ${err.message}`);
      setUploading(false);
      return null;
    }
  };

  const captureLocation = () => {
    setLocationError('');
    setError('');
    
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        console.log('Location captured:', position.coords);
      },
      (err) => {
        console.error('Geolocation error:', err);
        let errorMessage = 'Could not get location. ';
        
        switch(err.code) {
          case err.PERMISSION_DENIED:
            errorMessage += 'Please enable location permissions in your browser.';
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage += 'Location information is unavailable.';
            break;
          case err.TIMEOUT:
            errorMessage += 'Location request timed out.';
            break;
          default:
            errorMessage += 'An unknown error occurred.';
        }
        
        setLocationError(errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const resetForm = () => {
    setFormData({ category: '', weight: '' });
    setImageFile(null);
    setImagePreview('');
    setUploadedImageUrl('');
    setLocation({ latitude: null, longitude: null });
    setError('');
    setLocationError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('=== FORM SUBMISSION STARTED ===');
    console.log('Form Data:', formData);
    console.log('Location:', location);
    console.log('Image File:', imageFile?.name);
    
    setLoading(true);
    setError('');
    setSuccess('');

    // Validation
    if (!formData.category || !formData.weight) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    if (!location.latitude || !location.longitude) {
      setError('Location is required. Please capture your location.');
      setLoading(false);
      return;
    }

    try {
      // Step 1: Upload image to Cloudinary if selected
      let imageUrl = uploadedImageUrl;
      
      if (imageFile && !uploadedImageUrl) {
        console.log('Uploading image to Cloudinary...');
        imageUrl = await uploadToCloudinary();
        
        if (!imageUrl) {
          setError('Image upload failed. Please try again.');
          setLoading(false);
          return;
        }
      }

      // Step 2: Prepare pickup data
      const pickupData = {
        category: formData.category,
        weight: parseFloat(formData.weight),
        latitude: location.latitude,
        longitude: location.longitude,
        imageUrl: imageUrl || 'https://via.placeholder.com/400x300?text=No+Image'
      };

      console.log('=== SENDING TO BACKEND ===');
      console.log('API URL:', '/pickups');
      console.log('Pickup Data:', pickupData);

      // Step 3: Send to backend
      const response = await api.post('/pickups', pickupData);
      
      console.log('=== BACKEND RESPONSE ===');
      console.log('Response:', response.data);

      // Step 4: Success handling
      setSuccess('Pickup created successfully! Redirecting...');
      
      // Reset form
      resetForm();

      // Redirect after short delay to show success message
      setTimeout(() => {
        router.push('/staff');
        router.refresh(); // Refresh the staff page data
      }, 1500);

    } catch (err) {
      console.error('=== ERROR CREATING PICKUP ===');
      console.error('Error:', err);
      console.error('Error Response:', err.response?.data);
      console.error('Error Status:', err.response?.status);
      
      const errorMessage = err.response?.data?.message 
        || err.message 
        || 'Failed to create pickup. Please try again.';
      
      setError(errorMessage);
      setLoading(false);
    }
  };

  const isFormValid = formData.category && formData.weight && location.latitude && !uploading;

  return (
    <ProtectedRoute allowedRoles={['STAFF']}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Create New Pickup</h1>
            <p className="text-gray-600 mt-2">Fill in the details to record a new waste collection</p>
          </div>

          <div className="bg-white p-8 border border-gray-200 rounded-2xl shadow-lg">
            {/* Success Message */}
            {success && (
              <div className="bg-green-50 text-green-700 p-4 rounded-xl mb-6 border border-green-200 flex items-center">
                <span className="text-2xl mr-3">✓</span>
                <span className="font-medium">{success}</span>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6 border border-red-200 flex items-start">
                <span className="text-2xl mr-3">⚠</span>
                <div>
                  <p className="font-medium">Error</p>
                  <p className="text-sm mt-1">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                >
                  <option value="">Select a category</option>
                  <option value="Plastic">Plastic</option>
                  <option value="Paper">Paper</option>
                  <option value="Metal">Metal</option>
                  <option value="Glass">Glass</option>
                  <option value="Organic">Organic</option>
                  <option value="E-Waste">E-Waste</option>
                  <option value="Clothes">Clothes</option>
                </select>
              </div>

              {/* Weight */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Weight (kg) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="weight"
                  step="0.1"
                  min="0.1"
                  value={formData.weight}
                  onChange={handleInputChange}
                  placeholder="Enter weight in kilograms"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Upload Image (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  disabled={uploading}
                />
                
                {imagePreview && (
                  <div className="mt-4">
                    <p className="text-xs text-gray-500 mb-2">Preview:</p>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-48 w-full object-cover rounded-xl border-2 border-gray-200"
                    />
                  </div>
                )}
                
                {uploading && (
                  <div className="mt-3 flex items-center text-blue-600">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                    <span className="text-sm font-medium">Uploading image...</span>
                  </div>
                )}
                
                {uploadedImageUrl && !uploading && (
                  <p className="text-sm text-green-600 mt-2 flex items-center">
                    <span className="mr-2">✓</span>
                    Image uploaded successfully
                  </p>
                )}
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Location <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={captureLocation}
                  className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 text-sm font-semibold transition-all shadow-md hover:shadow-lg flex items-center"
                >
                  <span className="mr-2">📍</span>
                  Capture Location
                </button>
                
                {locationError && (
                  <div className="mt-3 bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-200">
                    {locationError}
                  </div>
                )}
                
                {location.latitude && (
                  <div className="mt-4 bg-green-50 p-4 rounded-xl border border-green-200">
                    <p className="font-semibold text-green-900 mb-2 flex items-center">
                      <span className="mr-2">✓</span>
                      Location Captured
                    </p>
                    <div className="text-sm text-green-700 space-y-1">
                      <p>Latitude: {location.latitude.toFixed(6)}</p>
                      <p>Longitude: {location.longitude.toFixed(6)}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-semibold transition-all"
                  disabled={loading || uploading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isFormValid || loading}
                  className={`px-8 py-3 rounded-xl text-white font-semibold transition-all shadow-lg ${
                    !isFormValid || loading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl transform hover:-translate-y-0.5'
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </span>
                  ) : uploading ? (
                    'Uploading...'
                  ) : (
                    'Create Pickup'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
