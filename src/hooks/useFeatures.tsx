import useAxiosPublic from '@/axios/useAxiosPublic';
import { useQuery } from '@tanstack/react-query';


const useFeatures = () => {
  const axiosPublic = useAxiosPublic();

  const { data:features, isPending: isFeaturesDataLoading } = useQuery({
    queryKey: ['features'],
    queryFn: async () => {
        const res = await axiosPublic.get("/features");
        return res.data.data;
    }
})
  return [features,isFeaturesDataLoading]
};

export default useFeatures;


