/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import useAxiosPublic from '@/axios/useAxiosPublic';
import apiClient from '@/axios/axiosInstant';
import toast from 'react-hot-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { TVoiceOnMedia } from '@/types/types';

interface UpdateVoiceOnMediaProps {
  voiceOnMediaId: string;
  setOpenModalForUpdate:(value:boolean)=>void
}

const UpdateMediaVideo: React.FC<UpdateVoiceOnMediaProps> = ({ voiceOnMediaId,setOpenModalForUpdate }) => {
  const queryClient = useQueryClient();
  const axiosPublic = useAxiosPublic();
            //  getting VoiceOnMedia
const {data:media} = useQuery({
  queryKey:["voiceOnMedia",voiceOnMediaId],
  queryFn:async()=>{  
    const response = await axiosPublic.get(`/voice-on-media/${voiceOnMediaId}`);
    return response.data.data;
  }

})



  const updateMutation = useMutation({
    mutationFn: async ({ id, data,e }: { id: string; data: Partial<TVoiceOnMedia>,e: { preventDefault: () => void; target: any; }}) => {
      const response = await apiClient.patch(`/voice-on-media/${id}`, data);
      if(response.data.success===true){
        e.target.reset();
        return response.data.data;
      }
     
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['voiceOnMedia'] });
      toast.success('Media Updated Successfully');
      setOpenModalForUpdate(false)
    },
    onError: (error: any) => {
      toast.error(error.response.data.message||'Failed to update Media');
      console.error('Update error:', error);
    },
  });

  const handleSubmit = (e: { preventDefault: () => void; target: any; } ) => {
    e.preventDefault();
    const form = e.target;

    const data: Partial<TVoiceOnMedia> = {
      videoUrl:form.videoUrl.value,
      title: form.title.value,
      // date: form.date.value,
     
    };

    updateMutation.mutate({ id:voiceOnMediaId, data ,e});
  };

  return (
    <div className="h-full min-h-[500px]">
      

      <form onSubmit={handleSubmit}>
        <div className="max-w-4xl 2xl:mt-28 px-6 pt-10 flex flex-col gap-10 justify-between items-center pb-20">
          <section className="flex flex-col lg:flex-row gap-16">
            {/* Left Panel: Image, Title, , Date */}
            <div className="flex flex-col gap-[20px]">
              
            <div className="flex flex-col gap-1">
                <label htmlFor="title">YouTube Video Url</label>
                <input
                  required
                  defaultValue={media?.videoUrl}
                  name="videoUrl"
                  className="md:w-[350px] px-5 py-3 border outline-blue-400 w-[250px] bg-white"
                  type="text"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="title">Title </label>
                <input
                  required
                  defaultValue={media?.title}
                  name="title"
                  className="md:w-[350px] px-5 py-3 border outline-blue-400 w-[250px] bg-white"
                  type="text"
                />
              </div>
             

             

              {/* <label htmlFor="Date">
                <p className="text-gray-950 mb-1">Select Date</p>
                <input
                  name="date"
                  required
                  defaultValue={
                    media?.date && !isNaN(new Date(media?.date).getTime())
                      ? new Date(media?.date).toISOString().split('T')[0]
                      : ''
                  }
                  type="date"
                  className="md:w-[350px] w-[250px] bg-white py-3 text-gray-700 px-3"
                />
              </label> */}
            </div>

          
          </section>

          <input
        
            type="submit"
            value="Submit"
            className="md:w-[350px] text-white w-[250px] bg-orange-600 py-2 px-3 active:scale-95 lg:w-full"
          />
        </div>
      </form>
    </div>
  );
};

export default UpdateMediaVideo;


















// import { TextField } from '@mui/material';
// import React from 'react';


// const UpdateMediaVideo = () => {
  

 
//   return (
//     <div className=' h-full min-h-[500px] '>
//      <div className='max-w-4xl px-6 pt-10 flex flex-col  gap-10 justify-between items-center pb-20'>    
    
     
//      <TextField 
//        defaultValue={'https://youtu.be/G_zwNW_0TEw'}
//      className='md:w-[350px] w-[250px] bg-white' id="outlined-basic" label="Youtube Video Url" variant="outlined" />
//      <TextField
//        defaultValue={'Free, Fair and Credible Election | M Rashiduzzaman Millat | Tritiyo Matra Talk show'}
//      className='md:w-[350px] w-[250px] bg-white' id="outlined-basic" label="Title" variant="outlined" />
//      <label htmlFor="date">
//       <p className='text-gray-950 mb-1 '>Select Date</p>
//      <input type="date" name="date" id="date" className='md:w-[350px] w-[250px] bg-white text-gray-700 py-2 px-3'/>
//      </label>
   
      
//       <input type="submit" value="Submit" className='md:w-[350px] text-white w-[250px] bg-orange-600 py-2 px-3 active:scale-95' />  
//      </div>
//     </div>
//   );
// };

// export default UpdateMediaVideo;