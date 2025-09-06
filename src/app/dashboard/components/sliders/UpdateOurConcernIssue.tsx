/* eslint-disable @typescript-eslint/no-explicit-any */

import apiClient from '@/axios/axiosInstant';
import useAxiosPublic from '@/axios/useAxiosPublic';
import useFeatures from '@/hooks/useFeatures';
import { TOurConcernIssue } from '@/types/types';
import { Drawer } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import UploadImageSlider from './uploadImageSlider/UploadImageSlider';
import Image from 'next/image';
import { CiEdit } from 'react-icons/ci';



const UpdateOurConcernIssues = ({ setOpenModalForUpdate }: { setOpenModalForUpdate: (value: boolean) => void }) => {
  const [features, isLoading] = useFeatures();
  const data: TOurConcernIssue = features?.ourConcernIssue;
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
    mutationFn: async ({ id, ourConcernIssueData }: { id: string; ourConcernIssueData: Partial<TOurConcernIssue> }) => {
      const response = await apiClient.patch(`/features/${id}`, { ourConcernIssue: ourConcernIssueData });
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['features'] });
      toast.success('Update Successfully');
      setOpenModalForUpdate(false);
    },
    onError: (error: any) => {
      toast.error('Failed to update ');
      console.error('Update error:', error);
    },
  });

  const handleSubmit = (e: { preventDefault: () => void; target: any; }) => {
    e.preventDefault();
    const form = e.target;

    const ourConcernIssueData: Partial<TOurConcernIssue> = {
      title: form.title.value,
      description: form.description.value,
      imageUrl: photoId ? imageUrl : data?.imageUrl,
      ourConcernIssues: {
        issue1: form.issue1.value,
        issue2: form.issue2.value,
        issue3: form.issue3.value,
        issue4: form.issue4.value,
        issue5: form.issue5.value,
        issue6: form.issue6.value,
      }

    };

    updateMutation.mutate({ id: features._id as string, ourConcernIssueData });
    form.reset();

  };


  return (
    <div className=' h-full min-h-[500px] mb-32 text-black'>
      <div>
        <Drawer open={open} onClose={() => toggleDrawer(false)}>
          <UploadImageSlider photoId={setPhotoId} toggleDrawer={toggleDrawer} />
        </Drawer>
      </div>
      {
        isLoading ?
          <div className='text-center m-10 '>
            loading...
          </div>
          :
          <form onSubmit={handleSubmit}>
            <div className='max-w-4xl px-6 pt-20 2xl:mt-28'>
              <div className=' flex flex-col lg:flex-row  gap-10 justify-between items-center '>
                {/* title and issues  */}
                <div>
                  {/* title  */}

                  <label htmlFor=" text-black">
                    <p className='font-semibold text-lg text-black mb-3'>Title</p>
                    <input
                      autoFocus
                      type="text"
                      name='title'
                      defaultValue={data?.title}
                      placeholder="Title"
                      className="md:w-[350px] w-[250px] bg-white border border-blue-700 text-black  px-4 py-2 focus:outline-none "
                    />
                  </label>
                  {/* issues  */}

                  <div className='flex flex-col gap-4 text-black'>
                    <p className='font-semibold text-black mt-5 text-lg' >Our Concern Issue</p>

                    <label htmlFor="Issue - 1">
                      <p className='font-semibold   mb-3'>Issue - 1</p>
                      <input
                        type="text"
                        name='issue1'
                        defaultValue={data?.ourConcernIssues?.issue1}
                        placeholder="Issue - 1"
                        className="md:w-[350px] w-[250px] bg-white border border-blue-700  px-4 py-2 focus:outline-none "
                      />
                    </label>
                    <label htmlFor="Issue - 2">
                      <p className='font-semibold   mb-3'>Issue - 2</p>
                      <input
                        type="text"
                        name='issue2'
                        defaultValue={data?.ourConcernIssues?.issue2}
                        placeholder="Issue - 2"
                        className="md:w-[350px] w-[250px] bg-white border border-blue-700  px-4 py-2 focus:outline-none "
                      />
                    </label>
                    <label htmlFor="Issue - 3">
                      <p className='font-semibold  mb-3'>Issue - 3</p>
                      <input
                        type="text"
                        name='issue3'
                        defaultValue={data?.ourConcernIssues?.issue3}
                        placeholder="Issue - 3"
                        className="md:w-[350px] w-[250px] bg-white border border-blue-700  px-4 py-2 focus:outline-none "
                      />
                    </label>
                    <label htmlFor="Issue - 4">
                      <p className='font-semibold   mb-3'>Issue - 4</p>
                      <input
                        type="text"
                        name='issue4'
                        defaultValue={data?.ourConcernIssues?.issue4}
                        placeholder="Issue - 4"
                        className="md:w-[350px] w-[250px] bg-white border border-blue-700  px-4 py-2 focus:outline-none "
                      />
                    </label>
                    <label htmlFor="Issue - 5">
                      <p className='font-semibold   mb-3'>Issue - 5</p>
                      <input
                        type="text"
                        name='issue5'
                        defaultValue={data?.ourConcernIssues?.issue5}
                        placeholder="Issue - 5"
                        className="md:w-[350px] w-[250px] bg-white border border-blue-700  px-4 py-2 focus:outline-none "
                      />
                    </label>
                    <label htmlFor="Issue - 6">
                      <p className='font-semibold   mb-3'>Issue - 6</p>
                      <input
                        type="text"
                        name='issue6'
                        defaultValue={data?.ourConcernIssues?.issue6}
                        placeholder="Issue - 6"
                        className="md:w-[350px] w-[250px] bg-white border border-blue-700  px-4 py-2 focus:outline-none "
                      />
                    </label>

                  </div>
                </div>


                {/* Image and description  */}

                <div>
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
                          src={data?.imageUrl}
                          height={600}
                          width={800}
                          className="w-[150px] h-[150px] rounded-full"
                        />
                      </div>
                    )}
                  </div>

                  {/* description  */}
                  <label htmlFor="    ">
                    <p className=' mt-8 mb-2 font-semibold text-black text-lg'>Short Description</p>
                    <textarea
                      defaultValue={data?.description}
                      name="description" id=""
                      className="md:w-[350px] w-[250px] h-[300px] lg:h-[300px] text-black bg-white border border-blue-700  px-4 py-2 focus:outline-none "
                    ></textarea>
                  </label>
                </div>

              </div>
              {/* update button    */}
              <input type="submit" value="Update" className='md:w-[350px] lg:w-full text-white w-[250px] bg-[#3D93C1] py-2 px-3 active:scale-95 mb-32 mt-8' />
            </div>
          </form>
      }

    </div>
  );
};

export default UpdateOurConcernIssues;