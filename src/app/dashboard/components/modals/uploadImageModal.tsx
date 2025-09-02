"use client"
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
  const [image, setImage] = useState<File | null>(null);
  const [folder, setFolder] = useState("");
   const [fileName,setFileName] = useState('Click to upload');
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await apiClient.post("photos/create-photo", formData);
      return response.data.data; 
    },
    onSuccess: () => {
      queryClient.invalidateQueries( {queryKey:["photos"]});
      setFileName('')
      onClose();
      toast.success("Image Upload Successfully");
    },
    onError: (error) => {
      toast.error("Failed to upload image");
      console.log(error)
    },
  });


  
    const handleFileChange =(e:React.ChangeEvent<HTMLInputElement>)=>{
      if(e.target.files && e.target.files.length>0){
        const file = e.target.files[0];
        setImage(file);
        setFileName(file.name);
      }
      else{
        setFileName('')
      }
  
    }

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    if (!image || !folder) {
      Swal.fire({
        icon:"warning",
        text: "Please Complete the form",
        showConfirmButton: false,
        timer: 1500,
        showClass: {
          popup: `
            animate__animated
            animate__fadeInUp
            animate__faster
          `
        },
        hideClass: {
          popup: `
            animate__animated
            animate__fadeOutDown
            animate__faster
          `
        }
      });
     
      
      return;
    }
    const formData = new FormData();
    formData.append("file", image);
    formData.append("data", JSON.stringify({ folder }));
    uploadMutation.mutate(formData);
  
  };

  return isOpen ? (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm z-50">
    <div className="bg-white  shadow-2xl w-8/12 max-w-lg p-8 relative animate-fade-in-up">
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
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Upload Image</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* File Upload Section */}
          <div onClick={() => document.getElementById("file-input")?.click()}className='flex items-center flex-col justify-center p-5 border-2 bg-white'>
          <Image alt='photo' src="/Images/uploadImageLogo.jpg" height={600} width={800} className='w-[120px] h-[120px] '/> 
          {
            fileName?
            <p className='bg-slate-300 px-2 py-1 mt-2'>{fileName}</p>:
            <p>Upload New Photo</p>
          }
           
          
           </div>
           <input
             
            id="file-input"
            type="file"
            accept="image/*"
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
            className="block w-full px-4 py-2 border border-gray-300  shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="" disabled>
              Select a folder
            </option>
            {folderOptions.map((option, index) => (
              <option key={index} value={option.folder} hidden={option.folder==="All Photos"}>
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
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200  shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600  shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {
              uploadMutation.isPending?
              <div className="flex items-center gap-2">
                 <Image alt='photo' src="/Images/loading.gif" height={600} width={800} className='w-[20px] h-[20px] '/> 
               <p> Uploading... </p>
              
              </div>
              : <p>Upload</p>
            }
          
          </button>
        </div>
      </form>
    </div>
  </div>
  

  ) : null;
};

export default UploadImageModal;
