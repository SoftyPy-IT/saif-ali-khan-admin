/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import apiClient from '@/axios/axiosInstant';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TItem } from '@/types/types';


interface UpdateBiographyItemProps {
  bioId: string;
  setOpenModalForUpdate:(value:boolean)=>void;
  updateItem:TItem|undefined
}

const UpdateBiographyItem: React.FC<UpdateBiographyItemProps> = ({ bioId,setOpenModalForUpdate ,updateItem}) => {
  const queryClient = useQueryClient();
 

  const  updateMutation = useMutation({
    mutationFn: async ({ data }: { data:Partial<TItem> }) => {
      const response = await apiClient.patch(`/biography/${bioId}`,{
        items:[data]
      });
      if(response.data.success===true){
        toast.success("Updated Successfully");
        
      }
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['biography'] });
      setOpenModalForUpdate(false);
    },
    onError: (error: any) => {
      toast.error(error.response.data.message||'Failed to create');
      console.error('Update error:', error);
    },
  });

  const handleSubmit = (e: { preventDefault: () => void; target: any; } ) => {
    e.preventDefault();
    const form = e.target;

    const data: Partial<TItem> = {
      _id:updateItem?._id,
      action:"update",
      itemTitle: form.title.value,
      itemDescription: form.description.value,
     
    };

    updateMutation.mutate({data});
    form.reset();

  };

  return (
    <div className=' h-full min-h-[500px] '>
    <form onSubmit={handleSubmit}>
      <div className='max-w-4xl 2xl:mt-28 px-6 pt-10 flex flex-col  gap-10 justify-between items-center pb-20'> 
      <div className="flex flex-col gap-1">
     <label htmlFor="title">Title</label>
     <input
     defaultValue={updateItem?.itemTitle}
     name="title"
     className="md:w-[400px] lg:w-[500px] w-[280px] px-5 py-3 border outline-blue-400  bg-white"
     type="text"  />  
              </div> 
      <div className="flex flex-col gap-1">
     <label htmlFor="Item Description">Item Description</label>
     <textarea
    defaultValue={updateItem?.itemDescription}
     name="description"
     className="md:w-[400px] lg:w-[500px] w-[280px] px-5 py-3 border outline-blue-400  bg-white"
     rows={8} />  
              </div> 
         <input type="submit" value="Submit" className='md:w-[400px] lg:w-[500px] text-white w-[280px] bg-orange-600 py-2 px-3 active:scale-95' />  
        </div>   
       </form>
      
      </div>
  );
};

export default UpdateBiographyItem;




