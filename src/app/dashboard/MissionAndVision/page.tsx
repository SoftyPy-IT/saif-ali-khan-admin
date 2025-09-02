'use client'
import Image from 'next/image';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { BiSolidEditAlt } from 'react-icons/bi';
import { useState } from 'react';
import { FaArrowAltCircleRight } from 'react-icons/fa';
import UpdateMissionInfo from '../components/sliders/UpdateMissionInfo';
import UpdateVisionInfo from '../components/sliders/UpdateVisionInfo';
import { TFeatures, TMission, TVision } from '@/types/types';
import useFeatures from '@/hooks/useFeatures';






const MissionAndVision = () => {
  const [features,isLoading] = useFeatures();
  const missionData:TMission = (features as TFeatures)?.mission;
  const visionData:TVision = (features as TFeatures)?.vision;
  const [updateMission,setUpdateMission] = useState<boolean>(false);
  const [updateVision,setUpdateVision] = useState<boolean>(false);
  return (
    <div className='bg-white'>
<   div className='relative '>

            

         {/* slider for update Mission  info  */}
  <div className={`transition-transform duration-500 w-full lg:w-4/5   shadow-lg h-full z-10 overflow-y-auto  fixed ${updateMission?'translate-x-0 top-[60px] bg-gray-100':'translate-x-[100%] '} flex justify-center  bg-[url(/Images/bg-image-modal-2.jpg)] bg-cover bg-center`}>



<div className='mt-8'>
<button onClick={()=>setUpdateMission(!updateMission)} className='text-rose-600 px-3 py-1 border border-rose-600 flex flex-row active:scale-95 gap-2 item-center justify-center bg-white absolute left-0 top-0'><span className='  text-xl '><FaArrowAltCircleRight /></span> <p>Back</p></button>
<UpdateMissionInfo   setUpdateMission={setUpdateMission}/>
</div>
</div>

         {/* slider for update Vision  info  */}
<div className={`transition-transform duration-500 w-full lg:w-4/5   shadow-lg h-full z-10 overflow-y-auto  fixed ${updateVision?'translate-x-0 top-[60px] bg-gray-100':'translate-x-[100%] '} flex justify-center  bg-[url(/Images/bg-image-modal-2.jpg)]   bg-cover bg-center`}>



<div className='mt-8'>
<button onClick={()=>setUpdateVision(!updateVision)} className='text-rose-600 px-3 py-1 border border-rose-600 flex flex-row active:scale-95 gap-2 item-center justify-center bg-white absolute left-0 top-0'><span className='  text-xl '><FaArrowAltCircleRight /></span> <p>Back</p></button>
<UpdateVisionInfo setUpdateVision={setUpdateVision}/>
</div>
</div>



     </div>
  
                     {/* header section  */}
     <div className='my-5  flex  md:flex-row justify-between items-center gap-3 mx-8'>
     <h1 className='lg:text-4xl text-xl font-semibold text-orange-500 '>Mission And Vision</h1>
    
     </div>

         {/* table section  */}
{
  isLoading?
     <div className='w-full flex justify-center mt-28'>
     <Image alt='photo' src="/Images/loading.gif" height={600} width={800} className='w-[80px] h-[80px] '/>
    </div>

  :
 
  <section className='mx-8  '>
  <TableContainer component={Paper} sx={{maxWidth:'100%',marginTop:'20px'}} >
    <Table sx={{ width:'100%',border:"2px solid gray" }} aria-label="simple table">
      <TableHead className='bg-blue-200 border-b-2 border-gray-600'>
        <TableRow>

          <TableCell align='left' className='text-gray-900 font-semibold'>Image</TableCell>
          <TableCell align='left'  className='text-gray-900 font-semibold'>Category</TableCell>
          <TableCell align='left'  className='text-gray-900 font-semibold'>Title</TableCell>
          <TableCell align='left'  className='text-gray-900 font-semibold'>Description</TableCell>
          <TableCell align='left'  className='text-gray-900 font-semibold'>Last Updated At</TableCell>
          <TableCell align='left'  className='text-gray-900 font-semibold'>Action</TableCell>
         
        </TableRow>
      </TableHead>
      <TableBody>
                              {/* mission  */}
          <TableRow
          
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
          >
            <TableCell component="th" scope="row">
             <Image className='w-[60px] h-[60px]' alt='video' src={missionData?.imageUrl} width={60} height={60}/>
            </TableCell>
            <TableCell align="left">Mission</TableCell>
            <TableCell align="left">{missionData?.title}</TableCell>
            <TableCell align="left">{missionData?.description.slice(0,150)}...</TableCell>      
            <TableCell align="left">{new Date(missionData?.updatedAt).toLocaleDateString()}</TableCell>
            <TableCell align="left">
           
              <button  onClick={()=>setUpdateMission(!updateMission)}  className=' active:scale-95 text-sm text-white  p-1 bg-orange-500 flex gap-1 items-center pl-3 pr-5'><BiSolidEditAlt />Edit</button>      
            
              </TableCell>
           
          </TableRow>


                                       {/* vision */}
          <TableRow
          
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
          >
            <TableCell component="th" scope="row">
             <Image className='w-[60px] h-[60px]' alt='video' src={visionData?.imageUrl} width={60} height={60}/>
            </TableCell>
            <TableCell align="left">Vision</TableCell>
            <TableCell align="left">{visionData?.title}</TableCell>
            <TableCell align="left">{visionData?.description.slice(0,150)}...</TableCell>      
            <TableCell align="left">{new Date(visionData?.updatedAt).toLocaleDateString()}</TableCell>
            <TableCell align="left">
           
              <button  onClick={()=>setUpdateVision(!updateVision)}  className=' active:scale-95 text-sm text-white  p-1 bg-orange-500 flex gap-1 items-center pl-3 pr-5'><BiSolidEditAlt />Edit</button>      
            
              </TableCell>
           
          </TableRow>
    
      </TableBody>
    </Table>
  </TableContainer>
    </section> 
}    
    </div>
  );
};

export default MissionAndVision;






