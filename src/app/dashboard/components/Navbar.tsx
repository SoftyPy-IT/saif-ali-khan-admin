"use client";
import Image from "next/image";
import React, { useState } from "react";
import { CiLogout } from "react-icons/ci";
import { IoMenuSharp } from "react-icons/io5";
import { AiOutlineClose } from "react-icons/ai";
import SidebarSlide from "./SidebarSlideForSmDevice";
import Cookies from "js-cookie";

const Navbar = () => {
  const [openSidebar, setOpenSidebar] = useState<boolean>(false);
  const logout = () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");

    window.location.href = "/";
  };
  return (
    <nav className="w-full bg-white shadow-xl py-1 flex justify-end pr-3 md:pr-8 relative ">
      {/* responsive sidebar  for sm and md device*/}
      <div className="lg:hidden">
        {/* overlay  */}
        <div
          className={`  ${
            openSidebar ? "fixed inset-0 z-20 bg-black bg-opacity-50 " : " "
          }`}
        ></div>

        {!openSidebar && (
          <IoMenuSharp
            onClick={() => setOpenSidebar(!openSidebar)}
            className="text-3xl text-gray-600 absolute left-2 top-3 z-10"
          />
        )}

        <div
          className={`fixed transition-all duration-1000  ${
            openSidebar ? "left-0 top-0 z-30" : "-left-[500px] "
          }`}
        >
          <AiOutlineClose
            onClick={() => setOpenSidebar(!openSidebar)}
            className="text-3xl text-rose-500  lg:hidden top-3 absolute right-2 z-20"
          />
          <SidebarSlide
            openSidebar={openSidebar}
            setOpenSidebar={setOpenSidebar}
          />
        </div>
      </div>
      <div className="flex items-center gap-2 mr-0">
        <div>
          <h3 className="text-[#3D93C1] font-bold text-lg">Saif Ali Khan</h3>
          <p className="text-xs text-gray-900">Businessmen & Politician</p>
        </div>
        <Image
          className="rounded-full w-[50px] h-[50px] border-2 border-blue-700"
          src={"/Images/saifalikhan.jpg"}
          height={40}
          width={40}
          alt="image"
        />
        <button
          onClick={() => logout()}
          className="text-white shadow-lg bg-[#3D93C1] px-3 active:scale-90 h-10 flex items-center gap-2"
        >
          <span className="text-xl font-bold">
            <CiLogout />
          </span>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
