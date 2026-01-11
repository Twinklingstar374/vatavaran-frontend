'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../utils/api';
import ProtectedRoute from '../../../components/ProtectedRoute';
import { 
  HiPlus, 
  HiArrowLeft, 
  HiPhoto, 
  HiMapPin, 
  HiCube, 
  HiCheckBadge,
  HiXMark,
  HiArrowPath,
  HiSparkles
} from "react-icons/hi2";

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
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [isClassifying, setIsClassifying] = useState(false);
  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAIClassification = async (base64Image) => {
    setIsClassifying(true);
    setAiSuggestion('');

    const maxRetries = 3;
    let attempt = 0;
    
    while (attempt < maxRetries) {
      try {
        const response = await api.post('/ai/classify', { image: base64Image });
        
        if (response.data.success) {
          setAiSuggestion(response.data.suggestion);
          break; // Success, exit loop
        }
      } catch (err) {
        // Handle Rate Limiting (429)
        if (err.response && err.response.status === 429) {
          attempt++;
          console.warn(`⚠️ AI Busy (429). Retrying in ${Math.pow(2, attempt)}s... (Attempt ${attempt}/${maxRetries})`);
          
          if (attempt < maxRetries) {
            // Exponential backoff: 2s, 4s, 8s
            const delay = Math.pow(2, attempt) * 1000;
            await new Promise(resolve => setTimeout(resolve, delay));
            continue; // Retry
          } else {
             console.error('❌ AI Classification failed: Max retries exceeded.');
          }
        } else {
          // Other errors
          console.error('AI Classification failed:', err);
          break; // Don't retry other errors
        }
      }
    }
    
    setIsClassifying(false);
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('Image size must be less than 10MB');
        return;
      }
      setImageFile(file);
      setError('');
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        handleAIClassification(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadToCloudinary = async () => {
    if (!imageFile) return null;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', imageFile);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setUploadedImageUrl(data.secure_url);
      setUploading(false);
      return data.secure_url;
    } catch (err) {
      setError('Image upload failed.');
      setUploading(false);
      return null;
    }
  };

  const captureLocation = () => {
    setLocationError('');
    if (!navigator.geolocation) {
      setLocationError('Geolocation not supported.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (err) => {
        setLocationError('Could not access location.');
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!location.latitude || !location.longitude) {
      setError('Location capture is required.');
      setLoading(false);
      return;
    }

    try {
      let imageUrl = uploadedImageUrl;
      if (imageFile && !uploadedImageUrl) {
        imageUrl = await uploadToCloudinary();
        if (!imageUrl) { setLoading(false); return; }
      }

      await api.post('/pickups', {
        category: formData.category,
        weight: parseFloat(formData.weight),
        latitude: location.latitude,
        longitude: location.longitude,
        imageUrl: imageUrl || 'https://via.placeholder.com/400x300?text=No+Image'
      });
      
      setSuccess('Pickup registered successfully!');
      setTimeout(() => router.push('/staff'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register pickup.');
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['STAFF']}>
      <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 flex flex-col items-center justify-center">
        <div className="max-w-xl w-full mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button 
              onClick={() => router.back()}
              className="p-3 bg-white border border-gray-200 rounded-2xl text-gray-600 hover:bg-gray-50 transition-all shadow-sm"
            >
              <HiArrowLeft className="text-xl" />
            </button>
            <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">New Collection</h1>
              <p className="text-gray-500 font-medium text-sm">Log your waste collection data</p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[32px] shadow-xl border border-gray-100">
            {success && (
              <div className="bg-emerald-50 text-emerald-700 p-4 rounded-2xl mb-6 text-sm font-bold flex items-center gap-2 border border-emerald-100">
                <HiCheckBadge className="text-xl" />
                {success}
              </div>
            )}
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-6 text-sm font-bold flex items-center gap-2 border border-red-100">
                <HiXMark className="text-xl" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Category */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-black text-gray-700 uppercase tracking-widest flex items-center gap-2">
                    <HiPlus className="text-blue-600 text-lg" />
                    Category
                  </label>
                  
                  {isClassifying && (
                    <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-tighter animate-pulse">
                      <HiSparkles className="animate-spin" /> Analyzing Image...
                    </div>
                  )}

                  {!isClassifying && aiSuggestion && formData.category !== aiSuggestion && (
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, category: aiSuggestion }))}
                      className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 border border-amber-200 rounded-full text-[10px] font-black uppercase tracking-wider hover:bg-amber-100 transition-all shadow-sm"
                    >
                      <HiSparkles /> Suggest {aiSuggestion}? <span className="underline">Apply</span>
                    </button>
                  )}
                </div>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`w-full px-5 py-4 bg-gray-50 border-2 rounded-2xl focus:outline-none focus:ring-4 transition-all font-bold text-gray-900 ${
                    aiSuggestion && formData.category === aiSuggestion 
                      ? 'border-amber-200 focus:ring-amber-100 focus:border-amber-500' 
                      : 'border-gray-100 focus:ring-blue-100 focus:border-blue-500'
                  }`}
                  required
                >
                  <option value="">Select Category</option>
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
                <label className="block text-sm font-black text-gray-700 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <HiCube className="text-blue-600 text-lg" />
                  Weight (kg)
                </label>
                <input
                  type="number"
                  name="weight"
                  step="0.1"
                  min="0.1"
                  value={formData.weight}
                  onChange={handleInputChange}
                  className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all font-bold text-gray-900"
                  placeholder="0.0"
                  required
                />
              </div>

              {/* Image Section */}
              <div>
                <label className="block text-sm font-black text-gray-700 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <HiPhoto className="text-blue-600 text-lg" />
                  Evidence
                </label>
                
                {imagePreview && (
                    <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-blue-100 shadow-lg mb-4">
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                        <button 
                            type="button"
                            onClick={() => {setImageFile(null); setImagePreview('');}}
                            className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur-sm rounded-full text-red-500 hover:bg-white transition-all shadow-md"
                        >
                            <HiXMark />
                        </button>
                    </div>
                )}

                <div className="relative">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                        id="image-upload"
                    />
                    <label 
                        htmlFor="image-upload"
                        className="flex flex-col items-center justify-center px-6 py-10 bg-blue-50/30 border-2 border-dashed border-blue-200 rounded-[32px] cursor-pointer hover:bg-blue-50 transition-all group"
                    >
                        <HiPhoto className="text-4xl text-blue-400 group-hover:scale-110 transition-transform mb-2" />
                        <span className="text-blue-700 font-bold">Add collection photo</span>
                        <span className="text-[10px] text-gray-400 font-medium uppercase mt-1 tracking-widest">Optional but recommended</span>
                    </label>
                </div>
              </div>

              {/* Location Section */}
              <div className="bg-gray-50 p-6 rounded-[32px] border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                    <label className="text-sm font-black text-gray-700 uppercase tracking-widest flex items-center gap-2">
                        <HiMapPin className="text-blue-600 text-lg" />
                        Verification
                    </label>
                    <button
                        type="button"
                        onClick={captureLocation}
                        className="px-4 py-2 bg-white text-gray-900 border border-gray-200 rounded-xl hover:bg-gray-50 text-xs font-black transition-all shadow-sm flex items-center gap-2 uppercase tracking-wider"
                    >
                        <HiMapPin className="text-blue-600" />
                        Capture GPS
                    </button>
                </div>

                {locationError && (
                  <p className="text-xs text-red-600 mb-4 bg-red-50 p-2 rounded-lg font-bold">{locationError}</p>
                )}

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-2xl shadow-inner border border-gray-100">
                        <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Lat</span>
                        <p className="text-sm font-black text-gray-900">{location.latitude?.toFixed(6) || '---'}</p>
                    </div>
                    <div className="bg-white p-4 rounded-2xl shadow-inner border border-gray-100">
                        <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Lng</span>
                        <p className="text-sm font-black text-gray-900">{location.longitude?.toFixed(6) || '---'}</p>
                    </div>
                </div>
              </div>

              {/* Submit Actions */}
              <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={loading || uploading || !formData.category || !formData.weight || !location.latitude}
                    className="flex-1 py-5 bg-gray-900 text-white rounded-[24px] font-black text-xl hover:bg-black disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-2xl hover:shadow-gray-200 flex items-center justify-center gap-3"
                  >
                    {loading ? (
                        <HiArrowPath className="animate-spin text-2xl" />
                    ) : (
                        <>
                            <HiSparkles className="text-2xl text-amber-400" />
                            Log Collection
                        </>
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
