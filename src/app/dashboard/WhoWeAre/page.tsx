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
import {FaArrowAltCircleRight } from 'react-icons/fa';
import {TFeatures, TWhoWeAre } from '@/types/types';
import useFeatures from '@/hooks/useFeatures';
import UpdateWhoWeAreInfo from '../components/sliders/UpdateWhoWeAreInfo';


const WhoWeAre = () => {
  const [features,isLoading] = useFeatures();
  const  data:TWhoWeAre = (features as TFeatures)?.whoWeAre;
  const [openModalForUpdate,setOpenModalForUpdate] = useState<boolean>(false);
  return (
<div className='bg-white'>
<div className='relative '>

            
            {/* slider for update  info  */}
     <div className={`transition-transform duration-500 w-full lg:w-4/5   shadow-lg h-full z-10 overflow-y-auto  fixed ${openModalForUpdate?'translate-x-0 top-[60px] bg-gray-100':'translate-x-[100%] '} flex justify-center  bg-[url(/Images/bg-image-modal-2.jpg)] bg-cover bg-center`}>



<div className='mt-8'>
<button onClick={()=>setOpenModalForUpdate(!openModalForUpdate)} className='text-rose-600 px-3 py-1 border border-rose-600 flex flex-row active:scale-95 gap-2 item-center justify-center bg-white absolute left-0 top-0'><span className='  text-xl '><FaArrowAltCircleRight /></span> <p>Back</p></button>
<UpdateWhoWeAreInfo setOpenModalForUpdate={setOpenModalForUpdate}/>
</div>
</div>
 </div>
  
                     {/* header section  */}
     <div className='my-5  flex  md:flex-row justify-between items-center gap-3 mx-8'>
     <h1 className='lg:text-4xl text-xl font-semibold text-orange-500 '>Who We Are</h1>
     <button  onClick={()=>setOpenModalForUpdate(!openModalForUpdate)}  className=' active:scale-95 text-xl text-white  p-1 bg-orange-500 flex gap-1 items-center pl-3 pr-5'><BiSolidEditAlt />Edit</button>
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

  <TableCell align='left' className='text-gray-900 font-semibold'>Video</TableCell>
  <TableCell align='left'  className='text-gray-900 font-semibold'>Title</TableCell>
    <TableCell align='left'  className='text-gray-900 font-semibold'>Description</TableCell>
   <TableCell align='left'  className='text-gray-900 font-semibold'>Last Updated</TableCell>
        
           
  </TableRow>
      </TableHead>
      <TableBody>
     
          <TableRow
           
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
          >
            <TableCell component="th" scope="row">
          <div className='relative w-[140px] h-[100px]'>
          <video
  className="absolute top-0 left-0  object-cover"
  controls
   preload="metadata"

>
<source src={data?.videoUrl} type="video/mp4" />

</video>   
          </div>
           
            </TableCell>
            <TableCell align="left">{data?.title}</TableCell>
            <TableCell align="left">{data?.description}</TableCell>
            
            <TableCell align="left">{new Date(data?.updatedAt).toLocaleDateString()}</TableCell>

          </TableRow>
    
      </TableBody>
    </Table>
  </TableContainer>
    </section>
}     
    </div>
  );
};

export default WhoWeAre;

