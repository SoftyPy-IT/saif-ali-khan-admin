'use client'
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { ReactNode } from 'react';
import { BiRevision, BiSelection } from 'react-icons/bi';
import { CiLogout } from 'react-icons/ci';
import { FaBoxTissue, FaImage, FaIndustry, FaUserEdit, FaUserLock, FaVideo } from 'react-icons/fa';
import { GrGallery } from 'react-icons/gr';

import { MdContacts, MdDashboard, MdOutlineEventAvailable, MdPermIdentity, MdPermMedia, MdRealEstateAgent, MdSettings } from 'react-icons/md';
import { PiFlagBannerFill } from 'react-icons/pi';
import { RiArticleFill } from 'react-icons/ri';
import { SiHeroku, SiRemovedotbg } from 'react-icons/si';
import { TbFileLike } from 'react-icons/tb';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


type Nav = {
  navItem: string
  path: string,
  subNavItems?: SubNav[],
  icon: ReactNode
}

type SubNav = {
  subItem: string;
  subPath: string
}




const SidebarSlide = ({ openSidebar, setOpenSidebar }: { openSidebar: boolean, setOpenSidebar: (value: boolean) => void }) => {
  const pathName = usePathname();


  return (
    <div className='bg-white lg:w-[350px] w-[300px] '>

      {/* logo section  */}
      <div className='flex flex-row lg:justify-center w-full justify-between item-center border-b-2 shadow'>
        <Image
          className='w-[140px] h-[58px]'
          src={'/Images/logo.webp'} alt='logo' width={200} height={100} />

      </div>


      {/*dynamic route section  */}
      <div className='h-[calc(100vh-60px)]  overflow-auto '>
        {
          routes?.map((route: Nav, idx: number) =>
            <div key={idx}>
              <div
                onClick={() => setOpenSidebar(!openSidebar)}
                className={`py-3 pl-4 border-b hover:bg-gray-100 ${pathName === route.path ? 'bg-gray-200 text-[#3D93C1] font-semibold' : ''}`}
              >
                <Link href={route.path}><p className='flex items-center gap-3'><span className='text-lg'>{route.icon}</span>{route.navItem}</p></Link>
              </div>

            </div>
          )
        }

        {/*settings  */}
        <div>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              <Typography component="span" className='flex items-center gap-2 text-xl font-bold text-black'><span className=' '><MdSettings /></span>Settings</Typography>
            </AccordionSummary>

            <AccordionDetails onClick={() => setOpenSidebar(!openSidebar)}>
              {/* photos  */}
              <div
                className={`py-3 pl-4 border-b hover:bg-gray-100 ${pathName === "/dashboard/Photos" ? 'bg-gray-300 text-[#3D93C1] font-semibold' : 'text-gray-700 bg-white'}`}
              >
                <Link href='/dashboard/Photos'><p className='flex items-center gap-3'><span className='text-lg'><FaImage /></span>Photos</p></Link>
              </div>
              {/* videos  */}
              <div
                className={`py-3 pl-4 border-b hover:bg-gray-100 ${pathName === "/dashboard/Videos" ? 'bg-gray-300 text-[#3D93C1] font-semibold' : 'text-gray-700 bg-white'}`}
              >
                <Link href='/dashboard/Videos'><p className='flex items-center gap-3'><span className='text-lg'><FaVideo /></span>Videos</p></Link>
              </div>

              {/* update profile  */}
              <div

                className={`py-3 pl-4 border-b hover:bg-gray-100 ${pathName === "/dashboard/UpdateProfile" ? 'bg-gray-300 text-[#3D93C1] font-semibold' : 'text-gray-700 bg-white'}`}
              >
                <Link href='/dashboard/UpdateProfile'><p className='flex items-center gap-3'><span className='text-lg'><FaUserEdit /></span>Update Profile</p></Link>
              </div>
              {/* user management  */}
              <div
                className={`py-3 pl-4 border-b hover:bg-gray-100 ${pathName === '/dashboard/UserManagement' ? 'bg-gray-300 text-[#3D93C1] font-semibold' : 'text-gray-700 bg-white'}`}
              >
                <Link href='/dashboard/UserManagement'><p className='flex items-center gap-3'><span className='text-lg'><FaUserLock /></span>User Management</p></Link>
              </div>

              {/* logout  */}
              <div className={`border-b hover:bg-gray-100 text-red-500 font-semibold py-3 pl-5 `}>
                <Link href={'/'}><p className='flex items-center gap-2'> <span ><CiLogout /></span>Log Out</p></Link>
              </div>

            </AccordionDetails>
          </Accordion>
        </div>

      </div>
    </div>
  );
};

export default SidebarSlide;






const routes = [
  {
    navItem: 'DashBoard',
    path: '/dashboard',
    icon: <MdDashboard />
  },
  {
    navItem: 'Banner',
    path: '/dashboard/Banner',
    icon: <PiFlagBannerFill />
  },
  {
    navItem: 'Our Concern Issues',
    path: '/dashboard/OurConcernIssues',
    icon: <FaBoxTissue />
  },
  {
    navItem: 'Who we are',
    path: '/dashboard/WhoWeAre',
    icon: <MdPermIdentity />
  },
  {
    navItem: 'Election Campaign',
    path: '/dashboard/ElectionCampaign',
    icon: <BiSelection />
  },
  {
    navItem: 'Logo & HomePage Article BG Image',
    path: '/dashboard/HomePageArticleBGImage',
    icon: <SiRemovedotbg />
  },

  {
    navItem: 'Hero Section',
    path: '/dashboard/HeroSection',
    icon: <SiHeroku />,


  },
  {
    navItem: 'Biography',
    path: '/dashboard/Biography',
    icon: <TbFileLike />
  },
  {
    navItem: 'Journey to Politics',
    path: '/dashboard/JourneyToPolitics',
    icon: <MdRealEstateAgent />
  },
  {
    navItem: 'Mission & Vision',
    path: '/dashboard/MissionAndVision',
    icon: <BiRevision />
  },
  {
    navItem: 'Company',
    path: '/dashboard/Company',
    icon: <FaIndustry />
  },
  {
    navItem: 'Events',
    path: '/dashboard/Events',
    icon: <MdOutlineEventAvailable />
  },
  {
    navItem: 'Gallery',
    path: '/dashboard/Gallery',
    icon: <GrGallery />
  },
  {
    navItem: 'Articles',
    path: '/dashboard/Articles',
    icon: <RiArticleFill />
  },
  {
    navItem: 'Voice On Media',
    path: '/dashboard/VoiceOnMedia',
    icon: <MdPermMedia />
  },
  {
    navItem: 'Contact',
    path: '/dashboard/Contact',
    icon: <MdContacts />
  },
]