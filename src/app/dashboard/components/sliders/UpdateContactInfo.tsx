/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from '@/axios/axiosInstant';
import useAxiosPublic from '@/axios/useAxiosPublic';
import useFeatures from '@/hooks/useFeatures';
import { TContact, TFeatures } from '@/types/types';
import { Drawer, TextField } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import UploadImageSlider from './uploadImageSlider/UploadImageSlider';
import { CiEdit } from 'react-icons/ci';
import Image from 'next/image';


const UpdateContactInfo = ({ setOpenModalForUpdate }: { setOpenModalForUpdate: (value: boolean) => void }) => {
  const [features, isLoading] = useFeatures();
  const data: TContact = (features as TFeatures)?.contact
  const toggleDrawer = (newOpen: boolean) => setOpen(newOpen);
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | undefined>();
  const [photoId, setPhotoId] = useState('');
  const axiosPublic = useAxiosPublic();

  useEffect(() => {
    if (!photoId) return;

    const fetchPhotoData = async () => {
      try {
        const response = await axiosPublic.get(`/photos/${photoId}`);
        setImageUrl(response?.data?.data?.imageUrl);
      } catch (error) {
        console.error('Error fetching photo data:', error);
      }
    };

    fetchPhotoData();
  }, [photoId, axiosPublic]);

  const updateMutation = useMutation({
    mutationFn: async ({ id, contactData }: { id: string; contactData: Partial<TContact> }) => {
      const response = await apiClient.patch(`/features/${id}`, { contact: contactData });
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['features'] });
      toast.success('Updated Successfully');
      setOpenModalForUpdate(false);
    },
    onError: (error: any) => {
      toast.error('Failed to update');
      console.error('Update error:', error);
    },
  });

  const handleSubmit = (e: { preventDefault: () => void; target: any; }) => {
    e.preventDefault();
    const form = e.target;

    const contactData: Partial<TContact> = {
      address: form.address.value,
      phone: form.phone.value,
      email: form.email.value,
      facebookUrl: form.facebookUrl.value,
      youTubeUrl: form.youTubeUrl.value,
      LinkedInUrl: form.LinkedInUrl.value,
      bgImageUrl: photoId ? imageUrl : data?.bgImageUrl,
    };

    updateMutation.mutate({ id: features._id as string, contactData });


  };


  return (
    <div className=' h-full min-h-[500px] text-black'>

      <div>
        <Drawer open={open} onClose={() => toggleDrawer(false)}>
          <UploadImageSlider photoId={setPhotoId} toggleDrawer={toggleDrawer} />
        </Drawer>
      </div>
      {
        !isLoading &&
        <form onSubmit={handleSubmit}>
          <div className='max-w-4xl 2xl:mt-28 px-6 pt-10 flex flex-col  gap-10 justify-between items-center pb-20'>
            {photoId ? (
              <div className="w-[150px] h-[150px] rounded-full relative">
                <CiEdit
                  className="absolute text-red-600 text-4xl hover:text-red-800 active:scale-90 right-0 top-0 bg-white rounded-full"
                  onClick={() => toggleDrawer(true)}
                />
                <Image
                  alt="image"
                  src={imageUrl as string}
                  height={600}
                  width={800}
                  className="w-[150px] h-[150px] rounded-full"
                />
              </div>
            ) : (
              <div className="w-[150px] h-[150px] rounded-full relative">
                <CiEdit
                  className="absolute text-red-600 text-4xl hover:text-red-800 active:scale-90 right-0 top-0 bg-white rounded-full"
                  onClick={() => toggleDrawer(true)}
                />
                <Image
                  alt="image"
                  src={data?.bgImageUrl}
                  height={600}
                  width={800}
                  className="w-[150px] h-[150px] rounded-full"
                />
              </div>
            )}

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
              <TextField
                name='address'
                defaultValue={data?.address}
                className='md:w-[350px] w-[250px] bg-white' id="outlined-basic" label="Address" variant="outlined" />
              <TextField
                name='phone'
                defaultValue={data?.phone}
                className='md:w-[350px] w-[250px] bg-white' id="outlined-basic" label="Phone" variant="outlined" />
              <TextField
                name='email'
                defaultValue={data?.email}
                className='md:w-[350px] w-[250px] bg-white' id="outlined-basic" label="Email" variant="outlined" />
              <TextField
                name='facebookUrl'
                defaultValue={data?.facebookUrl}
                className='md:w-[350px] w-[250px] bg-white' id="outlined-basic" label="Facebook Url" variant="outlined" />
              <TextField
                name='youTubeUrl'
                defaultValue={data?.youTubeUrl}
                className='md:w-[350px] w-[250px] bg-white' id="outlined-basic" label="Youtube Url" variant="outlined" />
              <TextField
                name='LinkedInUrl'
                defaultValue={data?.LinkedInUrl}
                className='md:w-[350px] w-[250px] bg-white' id="outlined-basic" label="LinkedIn Url" variant="outlined" />
            </div>

            <input type="submit" value="Update" className='md:w-[350px] text-white w-[250px] bg-[#3D93C1] py-2 px-3 active:scale-95' />
          </div>
        </form>
      }
    </div>
  );
};

export default UpdateContactInfo;