/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import useAxiosPublic from '@/axios/useAxiosPublic';
import apiClient from '@/axios/axiosInstant';
import toast from 'react-hot-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { TJourneyToPolitics} from '@/types/types';

interface UpdateJourneyInfoProps {
  journeyToPoliticsId: string;
  setOpenModalForUpdate:(value:boolean)=>void
}

const UpdateJourneyInfo: React.FC<UpdateJourneyInfoProps> = ({ journeyToPoliticsId,setOpenModalForUpdate }) => {
  const queryClient = useQueryClient();
  const axiosPublic = useAxiosPublic();

            //  getting journeyToPolitics
const {data:journeyToPolitics} = useQuery({
  queryKey:["journeyToPolitics",journeyToPoliticsId],
  queryFn:async()=>{  
    const response = await axiosPublic.get(`/journey-to-politics/${journeyToPoliticsId}`);
    return response.data.data;
  }

})



  const updateMutation = useMutation({
    mutationFn: async ({ id, data,e }: { id: string; data: Partial<TJourneyToPolitics>,e: { preventDefault: () => void; target: any; }}) => {
      const response = await apiClient.patch(`/journey-to-politics/${id}`, data);
      if(response.data.success===true){
        e.target.reset();
        return response.data.data;
      }
     
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journeyToPolitics'] });
      toast.success('journeyToPolitics Updated Successfully');
      setOpenModalForUpdate(false)
    },
    onError: (error: any) => {
      toast.error(error.response.data.message||'Failed to update journeyToPolitics');
      console.error('Update error:', error);
    },
  });

  const handleSubmit = (e: { preventDefault: () => void; target: any; } ) => {
    e.preventDefault();
    const form = e.target;

    const data: Partial<TJourneyToPolitics> = {
    
      title: form.title.value,
      
     
    };

    updateMutation.mutate({ id:journeyToPoliticsId, data ,e});
  };

  return (
    <div className="h-full min-h-[500px] text-black">
      

      <form onSubmit={handleSubmit}>
        <div className="max-w-4xl 2xl:mt-28 px-6 pt-10 flex flex-col gap-10 justify-between items-center pb-20">
          <section className="flex flex-col lg:flex-row gap-16">
            {/* Left Panel: Image, Title, , Date */}
            <div className="flex flex-col gap-[20px]">
              
            <div className="flex flex-col gap-1">
                <label htmlFor="title">Title</label>
                <input
                  required
                  defaultValue={journeyToPolitics?.title}
                  name="title"
                  className="md:w-[350px] px-5 py-3 border outline-blue-400 w-[250px] bg-white"
                  type="text"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="shortDescription">Short Description</label>
                <input
                  required
                  defaultValue={journeyToPolitics?.shortDescription}
                  name="shortDescription"
                  className="md:w-[350px] px-5 py-3 border outline-blue-400 w-[250px] bg-white"
                  type="text"
                />
              </div>
             

             
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

export default UpdateJourneyInfo;


