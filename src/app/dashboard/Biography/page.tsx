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
import { FaArrowAltCircleDown, FaArrowAltCircleRight } from 'react-icons/fa';
import { MdAddBox, MdDelete } from 'react-icons/md';
import UpdateBiographyInfo from '../components/sliders/UpdateBiographyInfo';
import AddNewBiographyItem from '../components/sliders/AddNewBiographyItem';
import UpdateBiographyItem from '../components/sliders/UpdateBiographyItem';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useAxiosPublic from '@/axios/useAxiosPublic';
import { TBiography, TItem } from '@/types/types';
import Swal from 'sweetalert2';
import apiClient from '@/axios/axiosInstant';
import toast from 'react-hot-toast';

const Biography = () => {
  const queryClient = useQueryClient();
  const axiosPublic = useAxiosPublic();
  const [openModalMainUpdate, setOpenModalMainForUpdate] = useState<boolean>(false);
  const [openModalForAdd, setOpenModalForAdd] = useState<boolean>(false);
  const [openModalForUpdate, setOpenModalForUpdate] = useState<boolean>(false);
  const [updateItem, setUpdateItem] = useState<TItem>();


  //  getting bioData 
  const { data, isLoading } = useQuery({
    queryKey: ["biography"],
    queryFn: async () => {
      const response = await axiosPublic.get(`/biography`);
      return response.data.data;
    }
  })
  const bioData: TBiography = data;

  // delete event
  const deleteMutation = useMutation({
    mutationFn: async (data: Partial<TItem>) => {
      const response = await apiClient.patch(`biography/${bioData?._id}`,
        {
          items: [data]
        }
      );
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["biography"] });
    },

    onError: (error) => {
      alert(`Error for deleting image: ${error}`);
      toast.error("Failed to Delete Event")
    },
  });

  console.log(bioData);

  return (
    <div className='bg-white'>
      {/* slider  */}
      <div className='relative '>
        {/* slider for update main section info  */}
        <div className={`transition-transform duration-500 w-full lg:w-4/5   shadow-lg h-full z-10 overflow-y-auto  fixed ${openModalMainUpdate ? 'translate-x-0 top-[60px] bg-gray-100' : 'translate-x-[100%] '} flex justify-center bg-[url(/Images/bg-image-modal.jpg)]   bg-cover bg-center  `}>
          <div className='mt-8'>
            <button onClick={() => setOpenModalMainForUpdate(!openModalMainUpdate)} className='text-rose-600 px-3 py-1 border border-rose-600 flex flex-row active:scale-95 gap-2 item-center justify-center bg-white absolute left-0 top-0'>
              
              <span className='  text-xl '><FaArrowAltCircleRight /></span> <p>Back</p></button>

            <UpdateBiographyInfo bioId={bioData?._id} setOpenModalMainForUpdate={setOpenModalMainForUpdate} />
          </div>
        </div>

        {/* slider for add new item info  */}
        <div className={`transition-transform duration-500 w-full lg:w-4/5  shadow-lg h-full z-10 overflow-y-auto  fixed ${openModalForAdd ? 'translate-y-0 top-[60px] bg-gray-100' : 'translate-y-[100%] '} flex justify-center  bg-[url(/Images/bg-image-modal-2.jpg)]   bg-cover bg-center`}>
          <div className='mt-8'>
            <button onClick={() => setOpenModalForAdd(!openModalForAdd)} className='text-rose-600 px-3 absolute top-0 left-0 py-1 border border-rose-600 flex flex-row active:scale-95 gap-2 item-center justify-center bg-white'><span className=' text-xl'><FaArrowAltCircleDown /></span> <p>Back</p></button>
            <AddNewBiographyItem id={bioData?._id} />
          </div>
        </div>
        {/* slider for update item info  */}
        <div className={`transition-transform duration-500 w-full lg:w-4/5   shadow-lg h-full z-10 overflow-y-auto  fixed ${openModalForUpdate ? 'translate-x-0 top-[60px] bg-gray-100' : 'translate-x-[100%] '} flex justify-center   bg-[url(/Images/bg-image-modal-2.jpg)]   bg-cover bg-center`}>
          <div className='mt-8'>
            <button onClick={() => setOpenModalForUpdate(!openModalForUpdate)} className='text-rose-600 px-3 py-1 border border-rose-600 flex flex-row active:scale-95 gap-2 item-center justify-center bg-white absolute left-0 top-0'><span className='  text-xl '><FaArrowAltCircleRight /></span> <p>Back</p></button>
            <UpdateBiographyItem bioId={bioData?._id} updateItem={updateItem} setOpenModalForUpdate={setOpenModalForUpdate} />
          </div>
        </div>



      </div>
      {
        isLoading ? <div className='w-full flex justify-center mt-28'>
          <Image alt='photo' src="/Images/loading.gif" height={600} width={800} className='w-[80px] h-[80px] ' />
        </div> :
          <div>

            {/* header section  - 1*/}
            <div className='my-5  flex  md:flex-row justify-between items-center gap-3 mx-8'>
              <h1 className='lg:text-4xl text-xl font-semibold text-orange-500 '>Biography</h1>

            </div>

            {/* table - 1 main section  */}
            <section className='mx-8  '>

              <TableContainer component={Paper} sx={{ maxWidth: '100%', marginTop: '20px' }} >
                <Table sx={{ width: '100%', border: "2px solid gray" }} aria-label="simple table">
                  <TableHead className='bg-blue-200 border-b-2 border-gray-600'>
                    <TableRow>

                      <TableCell align='left' className='text-gray-900 font-semibold'>Image</TableCell>
                      <TableCell align='left' className='text-gray-900 font-semibold'>Title</TableCell>
                      <TableCell align='left' className='text-gray-900 font-semibold'>Short Description</TableCell>
                      <TableCell align='left' className='text-gray-900 font-semibold'>Last Updated</TableCell>
                      <TableCell align='left' className='text-gray-900 font-semibold'>Action</TableCell>


                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        <Image className='w-[60px] h-[60px]' alt='photo' src={bioData?.imageUrl} width={60} height={60} />
                      </TableCell>
                      <TableCell align="left">{bioData?.title}</TableCell>
                      <TableCell align="left">{bioData?.shortDescription.slice(0, 200)}...</TableCell>
                      <TableCell align="left">{new Date(bioData?.updatedAt).toLocaleDateString()}</TableCell>
                      <TableCell align="left">
                        <button onClick={() => setOpenModalMainForUpdate(!openModalMainUpdate)} className=' active:scale-95 text-sm text-white  p-1 bg-orange-500 flex gap-1 items-center pl-3 pr-5'><BiSolidEditAlt />Edit</button>
                      </TableCell>


                    </TableRow>

                  </TableBody>
                </Table>
              </TableContainer>
            </section>


            {/* header section - 2 */}
            <div className='mb-5 mt-10 flex  md:flex-row justify-between items-center gap-3 mx-8 '>

              <button onClick={() => setOpenModalForAdd(!openModalForAdd)} className=' active:scale-95 text-xl text-white  p-1 bg-gray-600 hover:bg-slate-800 flex gap-1 items-center pl-3 pr-5'><MdAddBox />Add New Item</button>
            </div>

            {/* table section  */}
            <section className='mx-8  mb-20'>

              <TableContainer component={Paper} sx={{ maxWidth: '100%', marginTop: '20px' }} >
                <Table sx={{ width: '100%', border: "2px solid gray" }} aria-label="simple table">
                  <TableHead className='bg-blue-200 border-b-2 border-gray-600'>
                    <TableRow>
                      <TableCell align='left' className='text-gray-900 font-semibold'>Item Title</TableCell>
                      <TableCell align='left' className='text-gray-900 font-semibold'>Item Description</TableCell>
                      <TableCell align='left' className='text-gray-900 font-semibold'>Last Update Date</TableCell>
                      <TableCell align='left' className='text-gray-900 font-semibold'>Action</TableCell>


                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {bioData?.items?.map((item: TItem) => (
                      <TableRow
                        key={item?._id}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >

                        <TableCell align="left">{item?.itemTitle.slice(0, 30)}...</TableCell>
                        <TableCell align="left">{item?.itemDescription.slice(0, 60)}...</TableCell>
                        <TableCell align="left">{new Date(item?.updatedAt).toLocaleDateString()}</TableCell>

                        <TableCell align="left">
                          <div className='flex items-center gap-3'>
                            <button onClick={() => {
                              setOpenModalForUpdate(!openModalForUpdate);
                              setUpdateItem(item)
                            }} className=' active:scale-95 text-xl text-white  p-1 bg-orange-500 flex gap-1 items-center rounded-full hover:bg-orange-800'><BiSolidEditAlt /></button>
                            <button
                              onClick={() =>
                                Swal.fire({
                                  title: "Are you sure?",
                                  showCancelButton: true,
                                  confirmButtonColor: "#3085d6",
                                  cancelButtonColor: "#d33",
                                  confirmButtonText: "Yes, delete it!"
                                }).then((result) => {
                                  if (result.isConfirmed) {
                                    deleteMutation.mutate({ action: "delete", _id: item?._id });
                                    Swal.fire({
                                      title: "Deleted!",
                                      text: "Your file has been deleted.",
                                      icon: "success"
                                    });
                                  }
                                })}
                              className='bg-rose-600 p-1 text-xl rounded-full text-white active:scale-90 hover:bg-red-800'><MdDelete /></button>
                          </div>

                        </TableCell>


                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </section>
          </div>
      }



    </div>
  );
};

export default Biography;










