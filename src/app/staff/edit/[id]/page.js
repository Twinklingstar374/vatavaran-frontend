'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '../../../../utils/api';
import ProtectedRoute from '../../../../components/ProtectedRoute';
import { 
  HiPencilSquare, 
  HiArrowLeft, 
  HiPhoto, 
  HiMapPin, 
  HiCube, 
  HiCheckBadge,
  HiXMark,
  HiArrowPath
} from "react-icons/hi2";



export default function EditPickupPage() {
  const params = useParams();
  const pickupId = params.id;
  const [category, setCategory] = useState('');
  const [weight, setWeight] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [currentImageUrl, setCurrentImageUrl] = useState('');
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

        if (!['PENDING', 'REJECTED'].includes(pickup.status)) {
          setError('Only pending or rejected pickups can be edited.');
          setLoading(false);
          return;
        }

        setCategory(pickup.category);
        setWeight(pickup.weight.toString());
        setCurrentImageUrl(pickup.imageUrl);
        setLocation({ latitude: pickup.latitude, longitude: pickup.longitude });

      } catch (err) {
        console.error(err);
        setError('Failed to load pickup information.');
      } finally {
        setLoading(false);
      }
    };

    if (pickupId) fetchPickup();
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

    try {
      const response = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setUploading(false);
      return response.data.url;
    } catch (err) {
      console.error('Upload error:', err);
      setError('Image upload failed. Please try again.');
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
          setLocationError("Could not access location services.");
        }
      );
    } else {
      setLocationError("Geolocation is not supported by your browser.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    if (!location.latitude || !location.longitude) {
      setError("Location verification is required.");
      setSaving(false);
      return;
    }

    try {
      let imageUrl = currentImageUrl;
      if (imageFile) {
        const newImageUrl = await uploadToCloudinary();
        if (newImageUrl) imageUrl = newImageUrl;
        else { setSaving(false); return; }
      }

      await api.put(`/pickups/${pickupId}`, {
        category,
        weight: parseFloat(weight),
        latitude: location.latitude,
        longitude: location.longitude,
        imageUrl
      });
      
      router.push('/staff');
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed.');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={['STAFF']}>
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center">
            <HiArrowPath className="text-5xl text-blue-600 animate-spin mb-4" />
            <p className="text-gray-500 font-bold">Synchronizing pickup data...</p>
        </div>
      </ProtectedRoute>
    );
  }

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
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">Modify Collection</h1>
              <p className="text-gray-500 font-medium text-sm">Update your waste collection details</p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[32px] shadow-xl border border-gray-100">
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-6 text-sm font-bold flex items-center gap-2 border border-red-100">
                <HiXMark className="text-xl" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Category */}
              <div>
                <label className="block text-sm font-black text-gray-700 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <HiPencilSquare className="text-blue-600 text-lg" />
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all font-bold text-gray-900"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Plastic">Plastic</option>
                  <option value="Paper">Paper</option>
                  <option value="Metal">Metal</option>
                  <option value="Glass">Glass</option>
                  <option value="Organic">Organic</option>
                  <option value="E-Waste">E-Waste</option>
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
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
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
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                    {currentImageUrl && (
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase mb-2 tracking-tighter">Current Record</p>
                            <div className="relative aspect-square rounded-2xl overflow-hidden border-2 border-gray-100 shadow-inner">
                                <img src={currentImageUrl} alt="Current" className="w-full h-full object-cover" />
                            </div>
                        </div>
                    )}
                    {imagePreview && (
                        <div>
                            <p className="text-[10px] font-black text-blue-600 uppercase mb-2 tracking-tighter">New Update</p>
                            <div className="relative aspect-square rounded-2xl overflow-hidden border-2 border-blue-100 shadow-lg">
                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                        </div>
                    )}
                </div>

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
                        <span className="text-blue-700 font-bold">Replace photo</span>
                        <span className="text-[10px] text-gray-400 font-medium uppercase mt-1 tracking-widest">Max size 5MB</span>
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
                        <HiArrowPath className="text-blue-600" />
                        Update GPS
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

              {/* Actions */}
              <button
                type="submit"
                disabled={saving || uploading}
                className="w-full py-5 bg-gray-900 text-white rounded-[24px] font-black text-xl hover:bg-black disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-2xl hover:shadow-gray-200 flex items-center justify-center gap-3"
              >
                {saving || uploading ? (
                    <>
                        <HiArrowPath className="animate-spin text-2xl" />
                        {saving ? 'Processing...' : 'Uploading...'}
                    </>
                ) : (
                    <>
                        <HiCheckBadge className="text-2xl" />
                        Confirm Changes
                    </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
