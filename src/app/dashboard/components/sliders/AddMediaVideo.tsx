/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/sliders/AddMediaVideo.tsx
"use client";
import { TextField } from "@mui/material";
import React, { useState } from "react";
import { TVideo } from "@/types/types";
import apiClient from "@/axios/axiosInstant";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type AddMediaVideoProps = {
  onSuccessClose: () => void;
};

const AddMediaVideo = ({ onSuccessClose }: AddMediaVideoProps) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    publishDate: "",
    videoUrl: "",
    title: "",
  });

  const createMutation = useMutation({
    mutationFn: async (data: Partial<TVideo>) => {
      try {
        const response = await apiClient.post("/voice-on-media", data);
        console.log("✅ Response success:", response.data);
        return response.data.data;
      } catch (error: any) {
        if (error.response) {
          throw new Error(
            error.response.data?.message ||
              `Server error: ${error.response.status}`
          );
        } else if (error.request) {
          throw new Error(
            "No response from server. Check if backend is running."
          );
        } else {
          throw new Error(error.message || "Request failed");
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["voice-on-media"] });
      setFormData({
        publishDate: "",
        videoUrl: "",
        title: "",
      });
      toast.success("Video added successfully");
      onSuccessClose();
    },
    onError: (error: any) => {
      console.error("Mutation onError:", error);
      toast.error(error.message || "Failed to add video");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting form data:", formData);
    createMutation.mutate(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-[500px] lg:w-[600px] bg-white/90 p-6 rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
        Add New Video
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="max-w-4xl 2xl:mt-10 px-6 pt-4 flex flex-col gap-8 justify-between items-center pb-12">
          <section className="flex flex-col lg:flex-row gap-12 w-full">
            {/* Left side: Form fields */}
            <div className="flex flex-col gap-6 w-full">
              <label htmlFor="publishDate">
                <p className="text-gray-950 mb-2">Select published Date</p>
                <input
                  required
                  value={formData.publishDate} // Changed to publishDate
                  onChange={handleChange}
                  type="date"
                  name="publishDate" // Changed to publishDate
                  id="publishDate"
                  className="w-full bg-white py-3 text-gray-700 px-3 border rounded"
                />
              </label>

              {/* Video URL */}
              <TextField
                required
                value={formData.videoUrl}
                onChange={handleChange}
                name="videoUrl"
                label="Video URL"
                variant="outlined"
                fullWidth
                placeholder="Enter YouTube or Facebook video URL"
                helperText="Paste any YouTube or Facebook video link"
              />

              {/* Title */}
              <TextField
                required
                value={formData.title}
                onChange={handleChange}
                name="title"
                label="Video Title"
                variant="outlined"
                fullWidth
                placeholder="Enter video title"
              />
            </div>
          </section>

          <button
            type="submit"
            disabled={createMutation.isPending}
            className="w-full max-w-md bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-6 rounded-lg active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createMutation.isPending ? "Adding Video..." : "Add Video"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddMediaVideo;
