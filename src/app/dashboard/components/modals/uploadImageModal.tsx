"use client";
import apiClient from "@/axios/axiosInstant";
import { folderOptions } from "@/utils/folderOption";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import React, { useState } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UploadImageModal: React.FC<UploadModalProps> = ({ isOpen, onClose }) => {
  const [images, setImages] = useState<File[]>([]);
  const [folder, setFolder] = useState("");
  const [fileNames, setFileNames] = useState<string[]>([]);
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await apiClient.post("photos/create-photo", formData);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["photos"] });
      setFileNames([]);
      setImages([]);
      setFolder("");
      onClose();
      toast.success("Images uploaded successfully!");
    },
    onError: (error) => {
      toast.error("Failed to upload images");
      console.log(error);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      setImages(selectedFiles);
      setFileNames(selectedFiles.map((file) => file.name));
    } else {
      setImages([]);
      setFileNames([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (images.length === 0 || !folder) {
      Swal.fire({
        icon: "warning",
        text: "Please complete the form",
        showConfirmButton: false,
        timer: 1500,
        showClass: {
          popup: `
            animate__animated
            animate__fadeInUp
            animate__faster
          `,
        },
        hideClass: {
          popup: `
            animate__animated
            animate__fadeOutDown
            animate__faster
          `,
        },
      });
      return;
    }

    const formData = new FormData();
    images.forEach((image) => formData.append("file", image));
    formData.append("data", JSON.stringify({ folder }));

    uploadMutation.mutate(formData);
  };

  return isOpen ? (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm z-50">
      <div className="bg-white shadow-2xl w-8/12 max-w-lg p-8 relative animate-fade-in-up">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Modal Title */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Upload Images
        </h2>

        {/* Upload Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload Section */}
          <div
            onClick={() => document.getElementById("file-input")?.click()}
            className="flex items-center flex-col justify-center p-5 border-2 border-dashed bg-white cursor-pointer"
          >
            <Image
              alt="photo"
              src="/Images/uploadImageLogo.jpg"
              height={600}
              width={800}
              className="w-[120px] h-[120px]"
            />
            {fileNames.length > 0 ? (
              <div className="bg-slate-300 px-2 py-1 mt-2 text-sm space-y-1 max-h-24 overflow-y-auto w-full text-center">
                {fileNames.map((name, i) => (
                  <p key={i}>{name}</p>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-gray-500 text-sm">Click to select image(s)</p>
            )}
          </div>

          <input
            id="file-input"
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />

          {/* Folder Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Folder
            </label>
            <select
              required
              value={folder}
              onChange={(e) => setFolder(e.target.value)}
              className="block w-full px-4 py-2 border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="" disabled>
                Select a folder
              </option>
              {folderOptions.map((option, index) => (
                <option
                  key={index}
                  value={option.folder}
                  hidden={option.folder === "All Photos"}
                >
                  {option.folder}
                </option>
              ))}
            </select>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {uploadMutation.isPending ? (
                <div className="flex items-center gap-2">
                  <Image
                    alt="loading"
                    src="/Images/loading.gif"
                    height={20}
                    width={20}
                    className="w-[20px] h-[20px]"
                  />
                  <p>Uploading...</p>
                </div>
              ) : (
                <p>Upload</p>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  ) : null;
};

export default UploadImageModal;
