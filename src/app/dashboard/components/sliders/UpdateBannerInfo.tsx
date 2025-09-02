/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from "@/axios/axiosInstant";
import useAxiosPublic from "@/axios/useAxiosPublic";
import useFeatures from "@/hooks/useFeatures";
import { TBanner, TFeatures } from "@/types/types";
import { Drawer, TextField } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CiEdit } from "react-icons/ci";
import UploadVideoSlider from "./UploadVideoSlider/UploadVideoSlider";
import Image from "next/image";

const UpdateBannerInfo = ({
  setOpenModalForUpdate,
}: {
  setOpenModalForUpdate: (value: boolean) => void;
}) => {
  const [features, isLoading] = useFeatures();
  const data: TBanner = (features as TFeatures)?.banner;
  const toggleDrawer = (newOpen: boolean) => setOpen(newOpen);
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | undefined>();
  const [videoId, setVideoId] = useState("");
  const axiosPublic = useAxiosPublic();

  useEffect(() => {
    if (!videoId) return;

    const fetchVideoData = async () => {
      try {
        const response = await axiosPublic.get(`/videos/${videoId}`);
        setVideoUrl(response?.data?.data?.videoUrl);
      } catch (error) {
        console.error("Error fetching photo data:", error);
      }
    };

    fetchVideoData();
  }, [videoId, axiosPublic]);

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      bannerData,
    }: {
      id: string;
      bannerData: Partial<TBanner>;
    }) => {
      const response = await apiClient.patch(`/features/${id}`, {
        banner: bannerData,
      });
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["features"] });
      toast.success("Updated Successfully");
      setOpenModalForUpdate(false);
      location.reload();
    },
    onError: (error: any) => {
      toast.error("Failed to update");
      console.error("Update error:", error);
    },
  });

  const handleSubmit = (e: { preventDefault: () => void; target: any }) => {
    e.preventDefault();
    const form = e.target;

    const bannerData: Partial<TBanner> = {
      name: form.name.value,
      designation: form.designation.value,
      videoUrl: videoId ? videoUrl : data?.videoUrl,
    };

    updateMutation.mutate({ id: features._id as string, bannerData });

    console.log(bannerData);
  };

  return (
    <div className=" h-full min-h-[500px]  ">
      <div>
        <Drawer open={open} onClose={() => toggleDrawer(false)}>
          <UploadVideoSlider videoId={setVideoId} toggleDrawer={toggleDrawer} />
        </Drawer>
      </div>
      {!isLoading && (
        <form onSubmit={handleSubmit}>
          <div className="max-w-4xl 2xl:mt-28  px-6 pt-10 flex flex-col  gap-10 justify-between items-center pb-20">
            {videoUrl || videoId ? (
              <div className="w-[150px] h-[150px] relative">
                <CiEdit
                  className="absolute z-30 text-red-600 text-4xl hover:text-red-800 active:scale-90 right-0 top-0 bg-white rounded-full"
                  onClick={() => toggleDrawer(true)}
                />

                <Image
                  alt="photo"
                  src="/Images/videoUploadLogo.jpg"
                  height={600}
                  width={800}
                  className="w-[160px] h-[120px] "
                />
                <p>{videoUrl?.split("-")?.[1]}</p>
              </div>
            ) : (
              <div className="w-[150px] h-[150px] relative">
                <CiEdit
                  className="absolute z-30 text-red-600 text-4xl hover:text-red-800 active:scale-90 right-0 top-0 bg-white rounded-full"
                  onClick={() => toggleDrawer(true)}
                />

                <Image
                  alt="photo"
                  src="/Images/videoUploadLogo.jpg"
                  height={600}
                  width={800}
                  className="w-[160px] h-[120px] "
                />
                {/* <p>{data?.videoUrl.split('-')?.[1]}</p> */}
              </div>
            )}

            <TextField
              name="name"
              defaultValue={data?.name}
              className="md:w-[350px] w-[250px] bg-white"
              id="outlined-basic"
              label="Name"
              variant="outlined"
            />
            <TextField
              name="designation"
              defaultValue={data?.designation}
              className="md:w-[350px] w-[250px] bg-white"
              id="outlined-basic"
              label="Phone"
              variant="outlined"
            />

            <input
              type="submit"
              value="Update"
              className="md:w-[350px] text-white w-[250px] bg-[#3D93C1] py-2 px-3 active:scale-95"
            />
          </div>
        </form>
      )}
    </div>
  );
};

export default UpdateBannerInfo;
