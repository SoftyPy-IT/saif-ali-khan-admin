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
import UpdateHeroSection from '../components/sliders/UpdateHeroSection';
import { useQuery } from '@tanstack/react-query';
import useAxiosPublic from '@/axios/useAxiosPublic';
import { THeroSection } from '@/types/types';



const HeroSection = () => {
  const [updateHeroId,setUpdateHeroId]= useState<string>("");
  const axiosPublic = useAxiosPublic();
  const [openModalForUpdate,setOpenModalForUpdate] = useState<boolean>(false);
            //  getting events 
const {data,isLoading} = useQuery({
  queryKey:["hero"],
  queryFn:async()=>{  
    const response = await axiosPublic
    .get("/hero-sections");
    return response.data.data;
  }
})

           
  return (
    <div className='bg-white'>
<div className='relative '>

            
         {/* slider for update  info  */}
     <div className={`transition-transform duration-500 w-full lg:w-4/5   shadow-lg h-full z-10 overflow-y-auto  fixed ${openModalForUpdate?'translate-x-0 top-[60px] bg-gray-100':'translate-x-[100%] '} flex justify-center bg-[url(/Images/bg-image-modal.jpg)]   bg-cover bg-center `}>



<div className='mt-8'>
<button onClick={()=>{
  setOpenModalForUpdate(!openModalForUpdate);location.reload()
}}className='text-rose-600 px-3 py-1 border border-rose-600 flex flex-row active:scale-95 gap-2 item-center justify-center bg-white absolute left-0 top-0'><span className='  text-xl '><FaArrowAltCircleRight /></span> <p>Back</p></button>
<UpdateHeroSection heroId={updateHeroId} setOpenModalForUpdate={setOpenModalForUpdate}/>
</div>
</div>



     </div>
  
                     {/* header section  */}
     <div className='my-5  flex  md:flex-row justify-between items-center gap-3 mx-8'>
     <h1 className='lg:text-4xl text-xl font-semibold text-orange-500 '>Hero Section</h1>
     </div>

         {/* table section  */}
   {
    isLoading?
     <div className='w-full flex justify-center mt-28'>
          <Image alt='photo' src="/Images/loading.gif" height={600} width={800} className='w-[80px] h-[80px] '/>
        </div>
    :
    <section className='mx-8  mb-24'>
  
    <TableContainer component={Paper} sx={{maxWidth:'1000px',marginTop:'20px'}} >
      <Table sx={{ width:'100%',border:"2px solid gray" }} aria-label="simple table">
        <TableHead className='bg-blue-200 border-b-2 border-gray-600'>
          <TableRow>

            <TableCell align='left' className='text-gray-900 font-semibold'>Image Large Device</TableCell>
            <TableCell align='left' className='text-gray-900 font-semibold'>Image Small Device</TableCell>
            <TableCell align='left'  className='text-gray-900 font-semibold'>Page</TableCell>
            <TableCell align='left'  className='text-gray-900 font-semibold'>Title</TableCell>
            <TableCell align='left'  className='text-gray-900 font-semibold'>SubTitle</TableCell>
            <TableCell align='left'  className='text-gray-900 font-semibold'>Created Date</TableCell>
            <TableCell align='left'  className='text-gray-900 font-semibold'>Action</TableCell>
     
           
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map((row:THeroSection,idx:number) => (
            <TableRow
              key={idx}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                <div className='w-[180px] h-[140px] overflow-hidden flex items-center justify-center'>
                <Image className='max-h-[140px]' alt='photo' src={row?.bgImageForLg} width={100} height={100}/>
                </div>       
              </TableCell>
              <TableCell component="th" scope="row">
              <div className='w-[180px] h-[140px] overflow-hidden flex items-center justify-center'>
                <Image className='max-h-[140px]' alt='photo' src={row?.bgImageForSm} width={100} height={100}/>
                </div>       
              </TableCell>
              <TableCell align="left">{row?.category}</TableCell>
              <TableCell align="left">{row?.title}</TableCell>
              <TableCell align="left">{row?.subTitle}</TableCell>      
              <TableCell align="left">{row?.updatedAt}</TableCell>
              <TableCell align="left">
              <button  onClick={()=>{
                setOpenModalForUpdate(!openModalForUpdate);
                setUpdateHeroId(row?._id)
              }}  className=' active:scale-95 text-sm text-white  p-1 bg-orange-500 flex gap-1 items-center pl-3 pr-5'><BiSolidEditAlt />Edit</button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
      </section>  
   }   
    </div>
  );
};

export default HeroSection ;






