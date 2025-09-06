"use client"
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Drawer} from '@mui/material';
import React, { useEffect, useState } from 'react';
import useAxiosPublic from '@/axios/useAxiosPublic';
import Image from 'next/image';
import { TArticle } from '@/types/types';
import {  CiEdit } from 'react-icons/ci';
import apiClient from '@/axios/axiosInstant';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaArrowAltCircleLeft } from 'react-icons/fa';
import UploadImageSlider from '@/app/dashboard/components/sliders/uploadImageSlider/UploadImageSlider';
import MillatEditor from '@/app/dashboard/components/sliders/JodiEditor';

const UpdateArticleInfo = () => {
  const router = useRouter();
  const {articleId} = useParams();
  const queryClient = useQueryClient();
  const [article, setArticle] = useState<TArticle | null>(null);
  const [open, setOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | undefined>();
  const [photoId, setPhotoId] = useState('');
  const axiosPublic = useAxiosPublic();
  const [description,setDescription]= useState("");
  const toggleDrawer = (newOpen: boolean) => setOpen(newOpen);

  useEffect(() => {
    if (!articleId) return;

    const getArticleData = async () => {
      try {
        const response = await axiosPublic.get(`/articles/${articleId}`);
        setArticle(response.data.data);
        setImageUrl(response.data.data.imageUrl);
        setDescription(response?.data?.data?.description);
      } catch (error) {
        console.error('Error fetching event data:', error);
      }
    };

    getArticleData();
  }, [articleId, axiosPublic]);

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
    mutationFn: async ({ id, data,e }: { id: string; data: Partial<TArticle>;
      e: { preventDefault: () => void; target: any; }
    }) => {
      const response = await apiClient.patch(`/articles/${id}`, data);
      console.log(response.data);
      if(response.data.success===true){
        e.target.reset();
        return response.data.data;
      }
     
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      toast.success('Article Updated Successfully');
      router.push("/dashboard/Articles");

    },
    onError: (error: any) => {
      toast.error(error.response.data.message||'Failed to update article');
      console.error('Update error:', error);
    },
  });



  const handleSubmit = (e: { preventDefault: () => void; target: any; } ) => {
    e.preventDefault();
    const form = e.target;

    const data: Partial<TArticle> = {
      title: form.title.value,
      shortDescription:form.shortDescription.value,
      description,
      publishedDate: form?.date?.value,
      imageUrl
    };

    updateMutation.mutate({ id: articleId as string, data,e});
   
    
  };

  return (

<div className=' h-full text-black'>
 
 <Link href={"/dashboard/Articles"}>
 <button className='text-rose-600 px-3  py-1 border border-rose-600 flex flex-row active:scale-95 gap-2 item-center justify-center bg-white'><span className=' text-xl'><FaArrowAltCircleLeft /></span> <p>Back</p></button>
 </Link>
 
 <div>    
 <Drawer open={open} onClose={() => toggleDrawer(false)}>
   <UploadImageSlider photoId={setPhotoId} toggleDrawer={toggleDrawer} />
 </Drawer>
 </div>
 
 
      <form onSubmit={handleSubmit}>
      <div className='w-full 2xl:mt-28 px-6 pt-10 flex flex-col  gap-10 justify-between items-center pb-20'>  
      
 
 
              {/* input field  */}
        <div className='flex flex-col lg:flex-row  gap-[20px] w-full'>
                {/* image  */}
        <div className='w-full flex justify-center'>

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
                      src={article?.imageUrl || '/placeholder.jpg'}
                      height={600}
                      width={800}
                      className="w-[150px] h-[150px] rounded-full"
                    />
                  </div>
                )}


 </div>
 
 
 
 <div className='w-full '>

            <label htmlFor="title">Title</label>
                 <input
                   defaultValue={article?.title}
                   name="title"
                   className="w-full px-5 py-3 border outline-blue-400 bg-white"
                  type="text"
          />


 
 <label htmlFor="date">
 <p className='text-gray-950 mb-2'>Select published Date</p>
 <input
  name="date"
         required
 defaultValue={
  article?.publishedDate && !isNaN(new Date(article?.publishedDate).getTime())
  ? new Date(article?.publishedDate).toISOString().split('T')[0]
          : ''
                 }
 type="date"  className='w-full bg-white py-3  text-gray-700  px-3'/>
 </label>
 </div>
 
 </div>  
 

                {/*Short Description and  description field  */}
 <div   className='w-full bg-white '>
 <label htmlFor="title">Short Description</label>
              <input
                required
                defaultValue={article?.shortDescription}
                name="shortDescription"
                className=" px-5 py-3 border mb-5 outline-blue-400 w-full bg-white"
                type="text"
              />
              <MillatEditor
              name="description"
              value={description}
              onChange={setDescription}
                />
 </div>  
 

 <input type="submit" value="Submit" className='md:w-[350px] text-white w-[250px] bg-orange-600 py-2 px-3 active:scale-95 lg:w-full' />  
 </div>
 
      </form>
     
     </div>



  );
};

export default UpdateArticleInfo;

