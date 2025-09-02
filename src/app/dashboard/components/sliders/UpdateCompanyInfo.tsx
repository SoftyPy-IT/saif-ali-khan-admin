/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from '@/axios/axiosInstant';
import useAxiosPublic from '@/axios/useAxiosPublic';
import useFeatures from '@/hooks/useFeatures';
import { TCompany, TFeatures } from '@/types/types';
import { Drawer, TextField } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import UploadImageSlider from './uploadImageSlider/UploadImageSlider';
import { CiEdit } from 'react-icons/ci';
import Image from 'next/image';


const UpdateCompanyInfo = ({setOpenModalForUpdate}:{setOpenModalForUpdate:(value:boolean)=>void}) => {
  const [features,isLoading] = useFeatures();
  const data:TCompany = (features as TFeatures)?.company;
  const toggleDrawerForBgImage = (newOpen: boolean) => setOpenForBgImage(newOpen);
  const toggleDrawerForLogo = (newOpen: boolean) => setOpenForLogo(newOpen);
  const queryClient = useQueryClient();
  const [openForBgImage, setOpenForBgImage] = useState(false);
  const [openForLogo, setOpenForLogo] = useState(false);
  const [bgImageUrl, setBgImageUrl] = useState<string | undefined>();
  const [logoUrl, setLogoUrl] = useState<string | undefined>();
  const [bgImageId, setBgImageId] = useState('');
  const [logoId, setLogoId] = useState('');
  const axiosPublic = useAxiosPublic();

                     
  useEffect(() => {
    if (!bgImageId) return;

    const fetchPhotoData = async () => {
      try {
        const response = await axiosPublic.get(`/photos/${bgImageId}`);
        setBgImageUrl(response?.data?.data?.imageUrl);
      } catch (error) {
        console.error('Error fetching bgImage data:', error);
      }
    };

    fetchPhotoData();
  }, [bgImageId, axiosPublic]);


  useEffect(() => {
    if (!logoId) return;

    const fetchPhotoData = async () => {
      try {
        const response = await axiosPublic.get(`/photos/${logoId}`);
        setLogoUrl(response?.data?.data?.imageUrl);
      } catch (error) {
        console.error('Error fetching bgImage data:', error);
      }
    };

    fetchPhotoData();
  }, [logoId, axiosPublic]);

  const updateMutation = useMutation({
    mutationFn: async ({id, companyData}:{id:string; companyData:Partial<TCompany>}) => {
      const response = await apiClient.patch(`/features/${id}`, {company: companyData});
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
    const form = e.target;

    const companyData:Partial<TCompany> = {
    companyName:form.companyName.value,
    title:form.title.value,
    address:form.address.value,
    phone:form.phone.value,
    email:form.email.value,
    websiteUrl:form.websiteUrl.value,      
    bgImageUrl:bgImageId ? bgImageUrl : data?.bgImageUrl,
    logoUrl: logoId ? logoUrl : data?.logoUrl,
  
    };

    updateMutation.mutate({ id:features._id as string,  companyData });
   

  };
  return (
    <div className=' h-full min-h-[500px] '>
                   {/* slider for bg image  */}
       <div>
        <Drawer open={openForBgImage} onClose={() => toggleDrawerForBgImage(false)}>
          <UploadImageSlider photoId={setBgImageId} toggleDrawer={toggleDrawerForBgImage} />
        </Drawer>
      </div> 
                    {/* slider for logo  */}
      <div>
        <Drawer open={openForLogo} onClose={() => toggleDrawerForLogo(false)}>
          <UploadImageSlider photoId={setLogoId} toggleDrawer={toggleDrawerForLogo} />
        </Drawer>
      </div> 
    
  {
    !isLoading && 
    <form onSubmit={handleSubmit}>
    <div className='max-w-4xl 2xl:mt-28 px-6 pt-10 flex flex-col  gap-10 justify-between items-center pb-20'>    
                 
                 <div className='grid grid-cols-1 lg:grid-cols-2 gap-5'>
                            {/* image and logo upload section  */}
         <div className='flex justify-center'> 
                <label htmlFor="Background Image">
                <p className='text-orange-600 mb-3'>Background Image</p>
                 {bgImageId ? (
                               
                                 <div className="w-[150px] h-[150px] rounded-full relative">
                                   <CiEdit
                                      className="absolute text-red-600 text-4xl hover:text-red-800 active:scale-90 right-0 top-0 bg-white rounded-full"
                                      onClick={() => toggleDrawerForBgImage(true)}
                                    />
                                    <Image
                                      alt="Photo"
                                      src={bgImageUrl as string}
                                      height={600}
                                      width={800}
                                      className="w-[150px] h-[150px] rounded-full"
                                    />
                                  </div>
                             
                                ) : (
                                  <div className="w-[150px] h-[150px] rounded-full relative">
                                    <CiEdit
                                      className="absolute text-red-600 text-4xl hover:text-red-800 active:scale-90 right-0 top-0 bg-white rounded-full"
                                      onClick={() => toggleDrawerForBgImage(true)}
                                    />
                                    <Image
                                      alt="photo"
                                      src={data?.bgImageUrl}
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
             <p className='text-blue-600 mb-3'>Company Logo</p>
                   {logoId ? (
                                    <div className="w-[150px] h-[150px] rounded-full relative">
                                   <CiEdit
                                        className="absolute text-red-600 text-4xl hover:text-red-800 active:scale-90 right-0 top-0 bg-white rounded-full"
                                        onClick={() => toggleDrawerForLogo(true)}
                                      />
                                      <Image
                                        alt="Event Photo"
                                        src={logoUrl as string}
                                        height={600}
                                        width={800}
                                        className="w-[150px] h-[150px] rounded-full"
                                      />
                                    </div>
                                  ) : (
                                    <div className="w-[150px] h-[150px] rounded-full relative">
                                      <CiEdit
                                        className="absolute text-red-600 text-4xl hover:text-red-800 active:scale-90 right-0 top-0 bg-white rounded-full"
                                        onClick={() => toggleDrawerForLogo(true)}
                                      />
                                      <Image
                                        alt="photo"
                                        src={data?.logoUrl}
                                        height={600}
                                        width={800}
                                        className="w-[150px] h-[150px] rounded-full"
                                      />
                                    </div>
                                  )}
                                </label>  
                            </div>

                                          {/* Input field  */}
                 <TextField
                  defaultValue={data?.companyName}
                  name="companyName"
                  className='md:w-[350px] w-[250px] bg-white' id="outlined-basic" label="Company Name" variant="outlined" />
                  <TextField
                  defaultValue={data?.title}
                  name="title"
                  className='md:w-[350px] w-[250px] bg-white' id="outlined-basic" label="Title" variant="outlined" />
                  <TextField
                  defaultValue={data?.address}
                  name="address"
                  className='md:w-[350px] w-[250px] bg-white' id="outlined-basic" label="address" variant="outlined" />
                  <TextField
                  defaultValue={data?.phone}
                  name="phone"
                  className='md:w-[350px] w-[250px] bg-white' id="outlined-basic" label="phone" variant="outlined" />
                  <TextField
                  defaultValue={data?.email}
                  name="email"
                  className='md:w-[350px] w-[250px] bg-white' id="outlined-basic" label="email" variant="outlined" />
                  <TextField 
                   defaultValue={data?.websiteUrl}
                   name="websiteUrl"
                  className='md:w-[350px] w-[250px] bg-white' id="outlined-basic" label="Website url" variant="outlined" />
                 </div>
                   
                   <input type="submit" value="Update" className='md:w-[350px] lg:w-full mb-24 text-white w-[250px] bg-[#3D93C1] py-2 px-3 active:scale-95' />  
                  </div>
    </form>
  }
    </div>
  );
};

export default UpdateCompanyInfo;