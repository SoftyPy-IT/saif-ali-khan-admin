/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from '@/axios/axiosInstant';
import useAxiosPublic from '@/axios/useAxiosPublic';
import useFeatures from '@/hooks/useFeatures';
import { TFeatures } from '@/types/types';
import { Drawer } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {CiEdit } from 'react-icons/ci';
import UploadImageSlider from './uploadImageSlider/UploadImageSlider';



const UpdateHomePageArticleSectionBG = ({setOpenModalForUpdate}:{setOpenModalForUpdate:(value:boolean)=>void}) => {
  const [features,isLoading] = useFeatures();
  const queryClient = useQueryClient();
  const data:TFeatures = (features as TFeatures);
  const toggleDrawerForPhoto = (newOpen: boolean) => setOpenForPhoto(newOpen);
  const toggleDrawerForLogo = (newOpen: boolean) => setOpenForLogo(newOpen);
  const [openForPhoto, setOpenForPhoto] = useState(false);
  const [openForLogo, setOpenForLogo] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | undefined>();
  const [photoId, setPhotoId] = useState('');
  const [logoUrl, setLogoUrl] = useState<string | undefined>();
  const [logoId, setLogoId] = useState('');
  const axiosPublic = useAxiosPublic();

  useEffect(() => {
    if (!photoId) return;

    const fetchPhotoData = async () => {
      try {
        const response = await axiosPublic.get(`/photos/${photoId}`);
        setPhotoUrl(response?.data?.data?.imageUrl);
      } catch (error) {
        console.error('Error fetching photo data:', error);
      }
    };

    fetchPhotoData();
  }, [photoId, axiosPublic]);


  useEffect(() => {
    if (!logoId) return;
    const fetchPhotoData = async () => {
      try {
        const response = await axiosPublic.get(`/photos/${logoId}`);
        setLogoUrl(response?.data?.data?.imageUrl);
      } catch (error) {
        console.error('Error fetching photo data:', error);
      }
    };
    fetchPhotoData();
  }, [logoId, axiosPublic]);

  const updateMutation = useMutation({
    mutationFn: async ({id,homePageArticleBGData,logo}:{id:string;homePageArticleBGData:string|undefined,logo:string|undefined}) => {
      const response = await apiClient.patch(`/features/${id}`, {homepageArticleBG:homePageArticleBGData,
        logo:logo
      });
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

  const handleSubmit = (e: { preventDefault: () => void; target: any; } ) => {
    e.preventDefault();


  const homePageArticleBGData:string|undefined= photoId ? photoUrl : data?.homepageArticleBG ;
  const logo:string|undefined =logoId? logoUrl:data?.logo;

  updateMutation.mutate({id:features._id as string,homePageArticleBGData,logo})


  };


  return (
    <div className=' w-full  h-full min-h-[500px]'>
            {/* drawer for photo  */}
        <div>
        <Drawer open={openForPhoto} onClose={() => toggleDrawerForPhoto(false)}>
          <UploadImageSlider photoId={setPhotoId} toggleDrawer={toggleDrawerForPhoto} />
        </Drawer>
      </div> 
            {/* drawer for logo  */}
      <div>
        <Drawer open={openForLogo} onClose={() => toggleDrawerForLogo(false)}>
          <UploadImageSlider photoId={setLogoId} toggleDrawer={toggleDrawerForLogo} />
        </Drawer>
      </div> 

   {
    !isLoading&&
    <form onSubmit={(handleSubmit)}>
   <div className='max-w-4xl 2xl:mt-28 px-6 pt-10 flex flex-col  gap-10 justify-between items-center pb-20'>    
    <div className='flex flex-col-reverse md:flex-row-reverse justify-between gap-10'>
    {photoId ? (
                          <div className="w-[200px] h-[200px] rounded-full relative">
                             <CiEdit
                              className="absolute text-red-600 text-4xl hover:text-red-800 active:scale-90 right-0 top-0 bg-white rounded-full"
                              onClick={() => toggleDrawerForPhoto(true)}
                            />
                            <Image
                              alt="image"
                              src={photoUrl as string}
                              height={600}
                              width={800}
                              className="w-[200px] h-[200px] rounded-full"
                            />
                            <p className='text-center font-semibold text-blue-950 my-3'>Home Page Article BG</p>
                          </div>
                        ) : (
                          <div className="w-[200px] h-[200px] rounded-full relative">
                            <CiEdit
                              className="absolute text-red-600 text-4xl hover:text-red-800 active:scale-90 right-0 top-0 bg-white rounded-full"
                              onClick={() => toggleDrawerForPhoto(true)}
                            />
                            <Image
                              alt="image"
                              src={data?.homepageArticleBG}
                              height={600}
                              width={800}
                              className="w-[200px] h-[200px] rounded-full"
                            />
                              <p className='text-center font-semibold text-blue-950 my-3'>Home Page Article BG</p>
                          </div>
                        )}
    
     {logoId ? (
                          <div className="w-[200px] h-[200px] rounded-full relative">
                             <CiEdit
                              className="absolute text-red-600 text-4xl hover:text-red-800 active:scale-90 right-0 top-0 bg-white rounded-full"
                              onClick={() => toggleDrawerForLogo(true)}
                            />
                            <Image
                              alt="image"
                              src={logoUrl as string}
                              height={600}
                              width={800}
                              className="w-[200px] h-[200px] rounded-full"
                            />
                              <p className='text-center font-semibold text-orange-950 my-3'>Website Logo</p>
                          </div>
                        ) : (
                          <div className="w-[200px] h-[200px] rounded-full relative">
                            <CiEdit
                              className="absolute text-red-600 text-4xl hover:text-red-800 active:scale-90 right-0 top-0 bg-white rounded-full"
                              onClick={() => toggleDrawerForLogo(true)}
                            />
                            <Image
                              alt="image"
                              src={data?.logo}
                              height={600}
                              width={800}
                              className="w-[200px] h-[200px] rounded-full"
                            />
                              <p className='text-center font-semibold text-orange-950 my-3'>Website Logo</p>
                          </div>
                        )}
    
    </div>
    
     <input type="submit" value="Update" className='md:w-[350px] w-[250px] bg-[#3D93C1] py-2 px-3 text-white active:scale-95 mt-4' />  
    </div>
   </form>
   }
   </div>
  );
};

export default UpdateHomePageArticleSectionBG;