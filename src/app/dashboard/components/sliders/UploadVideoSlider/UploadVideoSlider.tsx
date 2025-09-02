"use client"
import apiClient from '@/axios/axiosInstant';
import Image from 'next/image';
import React, {  useState } from 'react';
import { FaFileUpload} from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import {videoFolder } from '@/utils/folderOption';
import { Pagination, Stack } from '@mui/material';
import {CiVideoOff } from 'react-icons/ci';
import { TVideo } from '@/types/types';
import UploadVideoModal from '../../modals/uploadVideoModal';


 type TVideoId =(id:string)=>void
 type TToggleDrawer =(value:boolean)=>void

const UploadVideoSlider = ({videoId,toggleDrawer}:{videoId:TVideoId,toggleDrawer:TToggleDrawer}) => {
  const [currentPage,setCurrentPage] = useState(1);
  const limit = 6; 
  const [folderName,setFolderName] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectVideo,setSelectVideo] = useState('');

  const handleSelectedVideo=( )=>{
   videoId(selectVideo);
   toggleDrawer(false)
  }
            //  getting video 
const {data:videosData={data:[],totalCount:0},isLoading} = useQuery({
  queryKey:["videos",folderName,currentPage],
  queryFn:async()=>{
    const endPoint = folderName?`videos?folder=${folderName}&page=${currentPage}&limit=${limit}`
    :`videos?page=${currentPage}&limit=${limit}`;
    const response = await apiClient.get(endPoint);
    return response.data.data;
  }
})

const {data,totalCount} = videosData; 
  return (
    <div className=' bg-white w-[300px] md:w-[600px] lg:w-[800px] xl:w-[1000px]'>
      
       {/*pagination buttons and cancel select button section */}
  <div className='bg-white border-t-2 shadow-xl gap-3 bottom-0 fixed px-8 py-2  z-20  w-[300px] md:w-[600px] lg:w-[800px] xl:w-[1000px] flex flex-col md:flex-row justify-between md:justify-between items-center'>
        {/* pagination buttons */}
 {
      totalCount<limit && currentPage===1 ?"":
      <div className='flex item-center justify-center '>
   <Stack spacing={2}>
     
     <Pagination
      count={Math.ceil(totalCount/limit)}
      page={currentPage}
      onChange={(event,value)=>setCurrentPage(value)}
      color="primary" />
    
   </Stack>
   </div>
    }    

      <div className='flex justify-end flex-1'>
      <div className=' max-w-[300px] gap-5 flex  items-center justify-between md:flex-row'>
          <button onClick={()=>toggleDrawer(false)} className='bg-gray-300 hover:text-gray-200 hover:bg-gray-500 active:scale-95 px-5 py-2 font-semibold'>cancel</button>
          <button
          onClick={()=>handleSelectedVideo()}
          disabled={!selectVideo}
          className={` text-white px-5 py-2 font-semibold ${!selectVideo?"bg-gray-400":"bg-blue-500 hover:bg-blue-800 active:scale-95"}`}>Select</button>
        </div>
      </div>
      </div>  
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
        {videoFolder?.map((folder, index) => (
          <option className='max-w-[250px] md:max-w-sm' key={index} value={folder.folder==="All Videos"? "":folder.folder}   >
            {folder.folder}
          </option>
        ))}
      </select>
    </div>


 <div>
  <button onClick={() =>setModalOpen(true)} className='px-4 flex items-center py-2 bg-gray-600 text-orange-500 font-semibold  hover:bg-gray-800'><span className='text-white mr-2'><FaFileUpload /></span>Upload Video</button>
 </div>


  </div>
       {/* video container  section*/}

{
  isLoading? <div className='w-full flex justify-center mt-28'>
    <Image alt='photo' src="/Images/loading.gif" height={600} width={800} className='w-[80px] h-[80px] '/>
  </div>:
  <section className='flex justify-center item-center  px-5 py-8 my-5 mb-24 md:mb-16'>


  {
    data.length===0?
    <div  className='flex flex-col items-center px-5 my-24'>
            <CiVideoOff className='text-6xl'/>
      <p className='text-2xl'>No Video available.</p>
    </div>
    :
        <div className='grid grid-cols-2 md:grid-cols-3  lg:grid-cols-4 xl:grid-cols-6 gap-5'>
        {
      data?.map((video:TVideo,idx:number)=>
      (
  <div onClick={()=>setSelectVideo(video?._id as string)} key={idx} className={`
  md:w-[140px] md:h-[160px] w-[120px] h-[140px] flex justify-center items-center relative bg-slate-100 border border-black overflow-hidden ${video._id===selectVideo&&"border-2 border-orange-500"}`}>
   
<video
className="absolute top-0 left-0 w-full h-full object-cover"
controls
 preload="metadata"

>

<source  src={video?.videoUrl}  type="video/mp4" />

</video> 
  </div>

  
      ))
   }
    </div>
 
  }


   </section>   
}
       
     
  
    <UploadVideoModal isOpen={isModalOpen} onClose={() => setModalOpen(false)}  />
    </div>


         
   </div>
  );
};

export default UploadVideoSlider;










