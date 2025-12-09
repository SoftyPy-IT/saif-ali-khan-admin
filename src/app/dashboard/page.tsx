import Image from "next/image";
import logo from "../../../public/Images/ar.jpg";

export default function Dashboard() {
  return (
    <div className="bg-[url(/Images/bg-image-modal.jpg)] bg-cover bg-center w-full h-full flex justify-center item-center">
      <div className="mt-32 2xl:mt-52 w-[450px] flex flex-col items-center">
        <div>
          <Image
            src={logo}
            alt="profile image"
            width={300}
            height={300}
            className="w-[200px] h-[200px] rounded-full border-4 border-blue-500"
          />
        </div>
        <h3 className="text-center text-3xl text-gray-500 mt-6 ">
          Welcome!
          <span className=" text-orange-600 font-bold">Arifur Rahman</span>
        </h3>
      </div>
    </div>
  );
}
