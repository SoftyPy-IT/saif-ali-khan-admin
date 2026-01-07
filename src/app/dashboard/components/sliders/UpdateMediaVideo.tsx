/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/sliders/UpdateMediaVideo.tsx
"use client";
import React, { useState, useEffect } from 'react';
import useAxiosPublic from '@/axios/useAxiosPublic';
import apiClient from '@/axios/axiosInstant';
import toast from 'react-hot-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { TVideo } from '@/types/types';
import { TextField } from '@mui/material';

interface UpdateVideoProps {
  videoId: string;
  setOpenModalForUpdate: (value: boolean) => void;
}

const UpdateMediaVideo: React.FC<UpdateVideoProps> = ({ videoId, setOpenModalForUpdate }) => {
  const queryClient = useQueryClient();
  const axiosPublic = useAxiosPublic();
  const [formData, setFormData] = useState({
    publishDate: '',
    videoUrl: '',
    title: '',
  });

  const { data: video, isLoading } = useQuery({
    queryKey: ["voice-on-media", videoId],
    queryFn: async () => {
      if (!videoId) return null;
      const response = await axiosPublic.get(`/voice-on-media/${videoId}`);
      return response.data.data;
    },
    enabled: !!videoId,
  });

  // Update form data when video data is loaded
  useEffect(() => {
    if (video) {
      setFormData({
        publishDate: video.publishDate ? new Date(video.publishDate).toISOString().split('T')[0] : '',
        videoUrl: video.videoUrl || '',
        title: video.title || '',
      });
    }
  }, [video]);

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<TVideo> }) => {
      const response = await apiClient.patch(`/voice-on-media/${id}`, data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['voice-on-media'] });
      toast.success('Video updated successfully');
      setOpenModalForUpdate(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update video');
      console.error('Update error:', error);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const data: Partial<TVideo> = {
      publishDate: formData.publishDate,
      videoUrl: formData.videoUrl,
      title: formData.title,
    };

    console.log('Updating with data:', data);
    updateMutation.mutate({ id: videoId, data });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (isLoading) {
    return (
      <div className="h-full min-h-[500px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-[500px] lg:w-[600px] text-black bg-white/90 p-6 rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
        Update Video
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="max-w-6xl 2xl:mt-10 px-6 pt-4 flex flex-col gap-8 justify-between items-center pb-12">
          <section className="flex flex-col lg:flex-row gap-12 w-full">
            {/* Left side: Form fields */}
            <div className="flex flex-col gap-6 w-full">
              {/* Publish Date */}
              <label htmlFor="publishDate">
                <p className="text-gray-950 mb-2">Update published Date</p>
                <input
                  required
                  value={formData.publishDate}
                  onChange={handleChange}
                  type="date"
                  name="publishDate"
                  id="publishDate"
                  className="w-full bg-white py-3 text-gray-700 px-3 border rounded"
                />
              </label>

              {/* Video URL */}
              <TextField
                required
                name="videoUrl"
                value={formData.videoUrl}
                onChange={handleChange}
                label="Video URL"
                variant="outlined"
                fullWidth
                helperText="Enter YouTube or Facebook video URL"
              />

              {/* Title */}
              <TextField
                required
                name="title"
                value={formData.title}
                onChange={handleChange}
                label="Video Title"
                variant="outlined"
                fullWidth
                placeholder="Enter video title"
              />
            </div>
          </section>

          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="w-full max-w-md bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {updateMutation.isPending ? 'Updating...' : 'Update Video'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateMediaVideo;