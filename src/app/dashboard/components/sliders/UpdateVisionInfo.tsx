/* eslint-disable @typescript-eslint/no-explicit-any */
import { Drawer} from '@mui/material';
import React, { useEffect, useState } from 'react';
import UploadImageSlider from './uploadImageSlider/UploadImageSlider';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/axios/axiosInstant';
import toast from 'react-hot-toast';
import useFeatures from '@/hooks/useFeatures';
import {TFeatures, TVision,  } from '@/types/types';
import { CiEdit } from 'react-icons/ci';
import Image from 'next/image';
import useAxiosPublic from '@/axios/useAxiosPublic';


const UpdateVisionInfo = ({setUpdateVision}:{setUpdateVision:(value:boolean)=>void}) => {
  const [features,isLoading] = useFeatures();
  const data:TVision = (features as TFeatures)?.vision;
  const toggleDrawer = (newOpen: boolean) => setOpen(newOpen);
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState(data?.imageUrl);
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
    mutationFn: async ({id,visionData}:{id:string;visionData:Partial<TVision>}) => {
      const response = await apiClient.patch(`/features/${id}`, {vision:visionData});
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['features'] });
      toast.success(' Updated Successfully');
      setUpdateVision(false);
    },
    onError: (error: any) => {
      toast.error('Failed to update ');
      console.error('Update error:', error);
    },
  });

  const handleSubmit = (e: { preventDefault: () => void; target: any; } ) => {
    e.preventDefault();

    const form = e.target;

    const visionData:Partial<TVision> = {
      title: form.title.value,   
      description:form.description.value,
      imageUrl: photoId ? imageUrl : data?.imageUrl,
    };

    updateMutation.mutate({ id:features._id as string,visionData});
   

  };
 
  return (
    <div className=' h-full min-h-[500px] '>

     <div>
        <Drawer open={open} onClose={() => toggleDrawer(false)}>
          <UploadImageSlider photoId={setPhotoId} toggleDrawer={toggleDrawer} />
        </Drawer>
      </div> 

{
  isLoading?
  
   <div className='w-full flex justify-center mt-28'>
              <Image alt='photo' src="/Images/loading.gif" height={600} width={800} className='w-[80px] h-[80px] '/>
  </div>
  :
  <form onSubmit={handleSubmit} >
  <div className='max-w-4xl 2xl:mt-28 px-6 pt-10 flex flex-col  gap-10 justify-between items-center pb-20'>    
    
    <div className='flex flex-col lg:flex-row gap-10'>
   
  <div className='flex flex-col gap-4 '>
 <div className='flex justify-center'>
 {photoId ? (
                  <div className="w-[150px] h-[150px] rounded-full relative">
                    <CiEdit
                      className="absolute text-red-600 text-4xl hover:text-red-800 active:scale-90 right-0 top-0 bg-white rounded-full"
                      onClick={() => toggleDrawer(true)}
                    />
                    <Image
                      alt="Event Photo"
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
                      alt="Event Placeholder"
                      src={data?.imageUrl}
                      height={600}
                      width={800}
                      className="w-[150px] h-[150px] rounded-full"
                    />
                  </div>
                )}
 </div>

               <div className="flex flex-col gap-1">
               <label htmlFor="title">Vision Title</label>
               <input
                 required
                 defaultValue={data?.title}
                 name="title"
                 className="md:w-[350px] px-5 py-3 border outline-blue-400 w-[250px] bg-white"
                 type="text"
               />
</div>

  
  </div>
  
       {/* description  */}
       <div className="flex flex-col gap-1">
               <label htmlFor="description">Description</label>
               <textarea
                 required
                 defaultValue={data?.description}
                 name="description"
                 className="md:w-[350px] px-5 py-3 border outline-blue-400 w-[250px] bg-white"
                 rows={8}
               />
           </div>     

    </div>
 

 
   <input type="submit" value="Submit" className='md:w-[350px] text-white w-[250px] bg-orange-500 py-2 px-3 active:scale-95 lg:w-full' />  
  </div>
  </form>

}

    </div>
  );
};

export default UpdateVisionInfo;





