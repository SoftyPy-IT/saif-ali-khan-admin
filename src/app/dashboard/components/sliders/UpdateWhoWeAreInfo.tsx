/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from "@/axios/axiosInstant";
import useFeatures from "@/hooks/useFeatures";
import { TFeatures, TWhoWeAre } from "@/types/types";
import { TextField } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import toast from "react-hot-toast";

const UpdateWhoWeAreInfo = ({
  setOpenModalForUpdate,
}: {
  setOpenModalForUpdate: (value: boolean) => void;
}) => {
  const [features, isLoading] = useFeatures();
  const data: TWhoWeAre = (features as TFeatures)?.whoWeAre;
  const queryClient = useQueryClient();

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
      toast.success("Updated Successfully");
      setOpenModalForUpdate(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update");
      console.error("Update error:", error);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    
    const whoWeAreData: Partial<TWhoWeAre> = {
      title: (form.elements.namedItem('title') as HTMLInputElement).value,
      description: (form.elements.namedItem('description') as HTMLInputElement).value,
      videourl: (form.elements.namedItem('videourl') as HTMLInputElement).value,
    };

    updateMutation.mutate({ 
      id: (features as TFeatures)?._id as string, 
      whoWeAreData 
    });
  };

  return (
    <div className="h-full min-h-[500px] text-black">
      {!isLoading && (
        <form onSubmit={handleSubmit}>
          <div className="max-w-4xl 2xl:mt-28 px-6 pt-10 flex flex-col gap-10 justify-between items-center pb-0">
            <TextField
              name="videourl"
              defaultValue={data?.videourl || ""}
              className="md:w-[350px] w-full bg-white"
              id="videourl"
              label="Video URL"
              variant="outlined"
              fullWidth
            />

            <TextField
              name="title"
              defaultValue={data?.title || ""}
              className="md:w-[350px] w-full bg-white"
              id="title"
              label="Title"
              variant="outlined"
              required
              fullWidth
            />
            
            <TextField
              name="description"
              defaultValue={data?.description || ""}
              multiline
              className="md:w-[350px] w-full bg-white"
              id="description"
              label="Description"
              variant="outlined"
              rows={4}
              required
              fullWidth
            />

            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="md:w-[350px] w-full text-white bg-[#3D93C1] py-2 px-3 active:scale-95 disabled:bg-gray-400"
            >
              {updateMutation.isPending ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default UpdateWhoWeAreInfo;