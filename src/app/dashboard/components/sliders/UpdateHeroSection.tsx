/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from '@/axios/axiosInstant';
import useAxiosPublic from '@/axios/useAxiosPublic';
import { THeroSection } from '@/types/types';
import { Drawer} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import UploadImageSlider from './uploadImageSlider/UploadImageSlider';
import { CiEdit } from 'react-icons/ci';
import Image from 'next/image';

interface UpdateHeroInfoProps {
  heroId: string;
  setOpenModalForUpdate:(value:boolean)=>void
}

const UpdateHeroSection: React.FC<UpdateHeroInfoProps> = ({ heroId,setOpenModalForUpdate }) => {
  const [hero, setHero] = useState<THeroSection | null>(null);
  const toggleDrawerForBgImageLg = (newOpen: boolean) => setOpenForBgImageLg(newOpen);
  const toggleDrawerForBgImageSm = (newOpen: boolean) => setOpenForBgImageSm(newOpen);
  const queryClient = useQueryClient();
  const [openForBgImageLg, setOpenForBgImageLg] = useState(false);
  const [openForBgImageSm, setOpenForBgImageSm] = useState(false);
  const [bgImageLgUrl, setBgImageLgUrl] = useState<string | undefined>();
  const [bgImageSmUrl, setBgImageSmUrl] = useState<string | undefined>();
  const [bgImageLgId, setBgImageLgId] = useState('');
  const [bgImageSmId, setBgImageSmId] = useState('');
  const axiosPublic = useAxiosPublic();


    useEffect(() => {
      if (!heroId) return;
  
      const getEventData = async () => {
        try {
          const response = await axiosPublic.get(`/hero-sections/${heroId}`);
          setHero(response.data.data);
          setBgImageLgUrl(response.data.data.bgImageForLg);
          setBgImageSmUrl(response.data.data.bgImageForSm);
        } catch (error) {
          console.error('Error fetching  data:', error);
        }
      };
  
      getEventData();
    }, [heroId, axiosPublic]);


                     
  useEffect(() => {
    if (!bgImageLgId) return;
    const fetchPhotoData = async () => {
      try {
        const response = await axiosPublic.get(`/photos/${bgImageLgId}`);
        setBgImageLgUrl(response?.data?.data?.imageUrl);
      } catch (error) {
        console.error('Error fetching  data:', error);
      }
    };

    fetchPhotoData();
  }, [bgImageLgId, axiosPublic]);


  
  useEffect(() => {
    if (!bgImageSmId) return;

    const fetchPhotoData = async () => {
      try {
        const response = await axiosPublic.get(`/photos/${bgImageSmId}`);
        setBgImageSmUrl(response?.data?.data?.imageUrl);
      } catch (error) {
        console.error('Error fetching  data:', error);
      }
    };

    fetchPhotoData();
  }, [bgImageSmId, axiosPublic]);

  const updateMutation = useMutation({
    mutationFn: async ({id, heroData}:{id:string; heroData:Partial<THeroSection>}) => {
      const response = await apiClient.patch(`/hero-sections/${id}`, heroData);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hero'] });
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
    const form = e.target;

    const heroData:Partial<THeroSection> = {
   
    title:form.title.value,
    subTitle:form.subTitle.value,   
    bgImageForLg:bgImageLgUrl,
    bgImageForSm:bgImageSmUrl
  
    };

    updateMutation.mutate({id:heroId,  heroData });
    form.reset();

  };


  return (
    <div className=' h-full min-h-[500px] '>
                   {/* slider for bg image  */}
       <div>
        <Drawer open={openForBgImageLg} onClose={() => toggleDrawerForBgImageLg(false)}>
          <UploadImageSlider photoId={setBgImageLgId} toggleDrawer={toggleDrawerForBgImageLg} />
        </Drawer>
      </div> 
                    {/* slider for logo  */}
      <div>
        <Drawer open={openForBgImageSm} onClose={() => toggleDrawerForBgImageSm(false)}>
          <UploadImageSlider photoId={setBgImageSmId} toggleDrawer={toggleDrawerForBgImageSm} />
        </Drawer>
      </div> 
    
  
    <form onSubmit={handleSubmit}>
    <div className='max-w-4xl 2xl:mt-28 px-6 pt-10 flex flex-col  gap-10 justify-between items-center pb-20'>    
                 
                 <div className='grid grid-cols-1 lg:grid-cols-2 gap-5'>
                            {/* image and logo upload section  */}
         <div className='flex justify-center'> 
                <label htmlFor="Background Image">
                <p className='text-orange-600 mb-3'>BG Image for Large Screen</p>
                 {bgImageLgId ? (
                               
                                 <div className="w-[150px] h-[150px] rounded-full relative">
                                    <CiEdit
                                      className="absolute text-red-600 text-4xl hover:text-red-800 active:scale-90 right-0 top-0 bg-white rounded-full"
                                      onClick={() => toggleDrawerForBgImageLg(true)}
                                    />
                                    <Image
                                      alt="Photo"
                                      src={bgImageLgUrl as string}
                                      height={600}
                                      width={800}
                                      className="w-[150px] h-[150px] rounded-full"
                                    />
                                  </div>
                             
                                ) : (
                                  <div className="w-[150px] h-[150px] rounded-full relative">
                                    <CiEdit
                                      className="absolute text-red-600 text-4xl hover:text-red-800 active:scale-90 right-0 top-0 bg-white rounded-full"
                                      onClick={() => toggleDrawerForBgImageLg(true)}
                                    />
                                    <Image
                                      alt="photo"
                                      src={hero?.bgImageForLg as string}
                                      height={600}
                                      width={800}
                                      className="w-[150px] h-[150px] rounded-full"
                                    />
                                  </div>
                                )}
                                  </label>  
             </div>

             <div className='flex justify-center'>
             <label htmlFor="Background Image">
             <p className='text-blue-600 mb-3'>BG Image for Small Screen</p>
                   {bgImageSmId ? (
                                    <div className="w-[150px] h-[150px] rounded-full relative">
                                     <CiEdit
                                        className="absolute text-red-600 text-4xl hover:text-red-800 active:scale-90 right-0 top-0 bg-white rounded-full"
                                        onClick={() => toggleDrawerForBgImageSm(true)}
                                      />
                                      <Image
                                        alt="Event Photo"
                                        src={bgImageSmUrl as string}
                                        height={600}
                                        width={800}
                                        className="w-[150px] h-[150px] rounded-full"
                                      />
                                    </div>
                                  ) : (
                                    <div className="w-[150px] h-[150px] rounded-full relative">
                                      <CiEdit
                                        className="absolute text-red-600 text-4xl hover:text-red-800 active:scale-90 right-0 top-0 bg-white rounded-full"
                                        onClick={() => toggleDrawerForBgImageSm(true)}
                                      />
                                      <Image
                                        alt="photo"
                                        src={hero?.bgImageForSm as string}
                                        height={600}
                                        width={800}
                                        className="w-[150px] h-[150px] rounded-full"
                                      />
                                    </div>
                                  )}
                                </label>  
                            </div>

                                          {/* Input field  */}
              <div className="flex flex-col gap-1">
                <label htmlFor="title">Title</label>
                <input
                  required
                  defaultValue={hero?.title}
                  name="title"
                  className="md:w-[350px] px-5 py-3 border outline-blue-400 w-[250px] bg-white"
                  type="text"
                />
              </div>                         
              <div className="flex flex-col gap-1">
                <label htmlFor="title">Subtitle</label>
                <input
                  required
                  defaultValue={hero?.subTitle}
                  name="subTitle"
                  className="md:w-[350px] px-5 py-3 border outline-blue-400 w-[250px] bg-white"
                  type="text"
                />
              </div>                         
                 
                 
                 </div>
                   
                   <input type="submit" value="Update" className='md:w-[350px] lg:w-full mb-24 text-white w-[250px] bg-[#3D93C1] py-2 px-3 active:scale-95' />  
                  </div>
    </form>

    </div>
  );
};

export default UpdateHeroSection;