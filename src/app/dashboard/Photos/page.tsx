"use client"
import apiClient from '@/axios/axiosInstant';
import Image from 'next/image';
import React, {  useState } from 'react';
import { FaFileUpload} from 'react-icons/fa';
import UploadImageModal from '../components/modals/uploadImageModal';
import { MdDelete } from 'react-icons/md';
import {  useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { folderOptions } from '@/utils/folderOption';
import Swal from 'sweetalert2'
import { Pagination, Stack } from '@mui/material';
import { CiImageOff } from 'react-icons/ci';
import { TPhoto } from '@/types/types';
;
const Photos = () => {
const [currentPage,setCurrentPage] = useState(1);
const limit = 12; 
const queryClient = useQueryClient();
const [folderName,setFolderName] = useState('');
const [isModalOpen, setModalOpen] = useState(false);  

          //  getting photo 
const {data:photosData={data:[],totalCount:0},isLoading} = useQuery({
  queryKey:["photos",folderName,currentPage],
  queryFn:async()=>{
    const endPoint = folderName?`photos?folder=${folderName}&page=${currentPage}&limit=${limit}`
    :`photos?page=${currentPage}&limit=${limit}`;
    const response = await apiClient.get(endPoint);
    return response.data.data;
  }
})

const {data,totalCount} = photosData; 

          // delete photo 
          const deleteMutation = useMutation({
            mutationFn: async (id:string) => {
              const response = await apiClient.delete(`photos/${id}`);
              return response.data.data; 
            },
            onSuccess: () => {
              
           queryClient.invalidateQueries( {queryKey:["photos"]});
             
            },
            onError: (error) => {
              alert(`Error for deleting image: ${error}`);
            },
          });

console.log(folderName);

  return (  
    <div>
        {/* header  */}
  <div className='flex flex-col lg:flex-row justify-around lg:items-center mt-5 ml-8 lg:ml-0'>

  <div className="mb-4 w-full max-w-sm">
      <label
        htmlFor="folders"
        className="block  text-xl font-medium text-gray-700"
      >
        Choose a Folder
      </label>
      <select
        name="folders"
        id="folders"
        defaultValue=" "
        className="max-w-[250px] md:max-w-full  px-4 py-2 text-sm text-gray-700 border border-gray-300  shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
         onChange={e=>setFolderName(e.target.value)}
      >
        {folderOptions.map((folder, index) => (
          <option className='max-w-[250px] md:max-w-sm' key={index} value={folder.folder==="All Photos"? "":folder.folder}   >
            {folder.folder}
          </option>
        ))}
      </select>
    </div>


 <div>
  <button onClick={() =>setModalOpen(true)} className='px-4 flex items-center py-2 bg-gray-600 text-orange-500 font-semibold  hover:bg-gray-800'><span className='text-white mr-2'><FaFileUpload /></span>Upload Photo</button>
 </div>


  </div>
       {/* photo container  section*/}

{
  isLoading? <div className='w-full flex justify-center mt-28'>
    <Image alt='photo' src="/Images/loading.gif" height={600} width={800} className='w-[80px] h-[80px] '/>
  </div>:
  <section className='flex justify-center item-center  px-5 py-8 my-5 '>


  {
    data.length===0?
    <div  className='flex flex-col items-center px-5 my-24'>
            <CiImageOff className='text-6xl'/>
      <p className='text-2xl'>No photo available.</p>
    </div>
    :
        <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5'>
        {
      data?.map((photo:TPhoto)=><div key={photo._id} className='w-[140px] h-[180px] relative bg-slate-50 border border-black overflow-hidden flex items-center justify-center'>
    <span
    onClick={()=>
     Swal.fire({
       title: "Are you sure?",
       showCancelButton: true,
       confirmButtonColor: "#3085d6",
       cancelButtonColor: "#d33",
       confirmButtonText: "Yes, delete it!"
     }).then((result) => {
       if (result.isConfirmed) {
        deleteMutation.mutate(photo._id as string);
         Swal.fire({
           title: "Deleted!",
           text: "Your file has been deleted.",
           icon: "success"
         });
       }
     })}
     className='absolute text-2xl active:scale-90 hover:text-red-300 text-red-600 p-1 bg-[rgb(0,0,0,0.5)] rounded-full left-1 top-1'><MdDelete/>
     
     </span>
  <Image alt='photo' src={photo?.imageUrl} height={200} width={160} className=''/>
  </div>)
   }
    </div>
   
    
  }


   </section>   
}
        {/* pagination buttons */}
    {
      totalCount<limit && currentPage===1 ?"":
      <div className='flex item-center justify-center mb-20 mt-8'>
   <Stack spacing={2}>
     
     <Pagination
      count={Math.ceil(totalCount/limit)}
      page={currentPage}
      onChange={(event,value)=>setCurrentPage(value)}
      color="primary" />
    
   </Stack>
   </div>
    }    
     
  
    <UploadImageModal isOpen={isModalOpen} onClose={() => setModalOpen(false)}  />
    </div>
  );
};

export default Photos;







