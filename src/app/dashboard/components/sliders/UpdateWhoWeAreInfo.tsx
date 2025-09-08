/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from "@/axios/axiosInstant";
import useAxiosPublic from "@/axios/useAxiosPublic";
import useFeatures from "@/hooks/useFeatures";
import { TFeatures, TWhoWeAre } from "@/types/types";
import { Drawer, TextField } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import UploadVideoSlider from "./UploadVideoSlider/UploadVideoSlider";

const UpdateWhoWeAreInfo = ({
  setOpenModalForUpdate,
}: {
  setOpenModalForUpdate: (value: boolean) => void;
}) => {
  const [features, isLoading] = useFeatures();
  const data: TWhoWeAre = (features as TFeatures)?.whoWeAre;
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
        const newVideoUrl = response?.data?.data?.videoUrl;
        setVideoUrl(newVideoUrl);
      } catch (error) {
        console.error("Error fetching photo data:", error);
      }
    };
    fetchVideoData();
  }, [videoId, axiosPublic]);

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      whoWeAreData,
    }: {
      id: string;
      whoWeAreData: Partial<TWhoWeAre>;
    }) => {
      const response = await apiClient.patch(`/features/${id}`, {
        whoWeAre: whoWeAreData,
      });
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["features"] });
      setVideoUrl(""); // Reset if needed
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
    const whoWeAreData: Partial<TWhoWeAre> = {
      title: form.title.value,
      description: form.description.value,
      videourl: videoId ? videoUrl : data?.videourl,
    };

    updateMutation.mutate({ id: features._id as string, whoWeAreData });
    console.log(whoWeAreData, data);
  };

  return (
    <div className="h-full min-h-[500px] text-black">
      <div>
        <Drawer open={open} onClose={() => toggleDrawer(false)}>
          <UploadVideoSlider videoId={setVideoId} toggleDrawer={toggleDrawer} />
        </Drawer>
      </div>
      {!isLoading && (
        <form onSubmit={handleSubmit}>
          <div className="max-w-4xl 2xl:mt-28 px-6 pt-10 flex flex-col  gap-10 justify-between items-center pb-0">
            

            <TextField
              name="videourl"
              defaultValue={data?.videourl}
              className="md:w-[350px] w-[250px] bg-white"
              id="outlined-basic"
              label="Video"
              variant="outlined"
            />

            <TextField
              name="title"
              defaultValue={data?.title}
              className="md:w-[350px] w-[250px] bg-white"
              id="outlined-basic"
              label="Title"
              variant="outlined"
            />

            <TextField
              name="description"
              defaultValue={data?.description}
              multiline
              className="md:w-[350px] w-[250px] bg-white"
              id="outlined-multiline-static"
              label="Sort Description"
              variant="outlined"
              rows={4}
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

export default UpdateWhoWeAreInfo;
