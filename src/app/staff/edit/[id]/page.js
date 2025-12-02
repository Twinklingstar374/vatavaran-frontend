'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '../../../../utils/api';
import ProtectedRoute from '../../../../components/ProtectedRoute';

const CLOUDINARY_CLOUD_NAME = 'dkgxwotil';
const CLOUDINARY_UPLOAD_PRESET = 'ml_default';

export default function EditPickupPage() {
  const params = useParams();
  const pickupId = params.id;
  const [category, setCategory] = useState('');
  const [weight, setWeight] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [locationError, setLocationError] = useState('');
  const router = useRouter();

  useEffect(() => {
  const fetchPickup = async () => {
    try {
      const response = await api.get(`/pickups/${pickupId}`);
      const pickup = response.data;

      if (pickup.status !== 'PENDING') {
        setError('Can only edit pending pickups');
        return;
      }

      setCategory(pickup.category);
      setWeight(pickup.weight.toString());
      setCurrentImageUrl(pickup.imageUrl);
      setLocation({ latitude: pickup.latitude, longitude: pickup.longitude });

    } catch (err) {
      console.error(err);
      setError('Failed to load pickup');
    } finally {
      setLoading(false);
    }
  };

  fetchPickup();
}, [pickupId]);


  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
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
    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );
      const data = await response.json();
      setUploadedImageUrl(data.secure_url);
      setUploading(false);
      return data.secure_url;
    } catch (err) {
      console.error('Cloudinary upload error:', err);
      setError('Failed to upload image');
      setUploading(false);
      return null;
    }
  };

  const captureLocation = () => {
    setLocationError('');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (err) => {
          console.error("Error getting location:", err);
          setLocationError("Could not get location. Please enable location services.");
        }
      );
    } else {
      setLocationError("Geolocation is not supported by this browser.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    if (!location.latitude || !location.longitude) {
      setError("Location is required.");
      setSaving(false);
      return;
    }

    try {
      // Upload new image if selected
      let imageUrl = currentImageUrl;
      if (imageFile) {
        const newImageUrl = await uploadToCloudinary();
        if (newImageUrl) {
          imageUrl = newImageUrl;
        } else {
          setSaving(false);
          return;
        }
      }

      // Note: Backend needs to support PUT/PATCH for pickups
      // For now, we'll use PATCH as defined in the backend
      await api.put(`/pickups/${pickupId}`, {
        category,
        weight: parseFloat(weight),
        latitude: location.latitude,
        longitude: location.longitude,
        imageUrl
      });
      
      router.push('/staff');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update pickup');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={['STAFF']}>
        <div className="text-center py-10">Loading...</div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['STAFF']}>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Pickup</h1>

        <div className="bg-white p-6 border border-gray-200 rounded-lg">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              >
                <option value="">Select a category</option>
                <option value="Plastic">Plastic</option>
                <option value="Paper">Paper</option>
                <option value="Metal">Metal</option>
                <option value="Glass">Glass</option>
                <option value="Organic">Organic</option>
                <option value="E-Waste">E-Waste</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Image</label>
              {currentImageUrl && (
                <img
                  src={currentImageUrl}
                  alt="Current"
                  className="h-32 w-32 object-cover rounded border border-gray-300 mb-3"
                />
              )}
              <label className="block text-sm font-medium text-gray-700 mb-1">Upload New Image (Optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
              {imagePreview && (
                <div className="mt-3">
                  <p className="text-xs text-gray-500 mb-2">New Preview:</p>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-32 w-32 object-cover rounded border border-gray-300"
                  />
                </div>
              )}
              {uploading && (
                <p className="text-sm text-blue-600 mt-2">Uploading image...</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <button
                type="button"
                onClick={captureLocation}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium"
              >
                Re-capture Location
              </button>
              {locationError && (
                <p className="text-sm text-red-600 mt-2">{locationError}</p>
              )}
              {location.latitude && (
                <div className="mt-3 bg-gray-50 p-3 rounded text-sm text-gray-700">
                  <p className="font-medium">Current Location:</p>
                  <p>Latitude: {location.latitude.toFixed(6)}</p>
                  <p>Longitude: {location.longitude.toFixed(6)}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving || uploading}
                className={`px-4 py-2 rounded-md text-white font-medium ${
                  saving || uploading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {saving ? 'Saving...' : uploading ? 'Uploading...' : 'Update Pickup'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
