/* eslint-disable @typescript-eslint/no-explicit-any */
import {TextField } from '@mui/material';
import React, { useState } from 'react';
import { TJourneyToPolitics} from '@/types/types';
import apiClient from '@/axios/axiosInstant';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';


const AddNewJourney= () => {
  const queryClient = useQueryClient();
  const [title,setTitle] = useState("");
  const [shortDescription,setShortDescription] = useState("");
  
  const createMutation = useMutation({
    mutationFn: async ({ data }: { data:Partial<TJourneyToPolitics> }) => {
      const response = await apiClient.post(`/journey-to-politics/create-journey-to-politics`, data);
      toast.success("Added Journey Successfully")
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journeyToPolitics'] });
      setTitle("");
      setShortDescription("");

  
    },
    onError: (error: any) => {
      toast.error(error.response.data.message||'Failed to create');
      console.error('Update error:', error);
    },
  });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleSubmit =async(e: { preventDefault: () => void; target: any; })=>{
e.preventDefault();
 

const data:Partial<TJourneyToPolitics> ={
  title,shortDescription
}

createMutation.mutate({data});

}

  return (
    <div className=' h-full min-h-[500px] '>

     <form onSubmit={handleSubmit}>
     <div className='max-w-4xl 2xl:mt-28 px-6 pt-10 flex flex-col  gap-10 justify-between items-center pb-20'>  
     
     {/* input field  */}
<section className='flex flex-col lg:flex-row gap-16'>

{/* image, title and date field  */}
<div className='flex flex-col gap-[20px]'>


<TextField required   value={title}
  onChange={(e) => setTitle(e.target.value)}  
   name='title' className='md:w-[350px] w-[250px] bg-white' id="outlined-basic" label="Title" variant="outlined" />

<TextField required   value={shortDescription}
  onChange={(e) => setShortDescription(e.target.value)}  
   name='shortDescription' className='md:w-[350px] w-[250px] bg-white' id="outlined-basic" label="Short Description" variant="outlined" />


</div>  

 
</section>      

<input type="submit" value="Submit" className='md:w-[350px] text-white w-[250px] bg-orange-600 py-2 px-3 active:scale-95 lg:w-full' />  
</div>

     </form>
    
    </div>
  );
};

export default AddNewJourney;


