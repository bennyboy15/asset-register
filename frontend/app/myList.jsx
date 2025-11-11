import { View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import AssetCard from '../components/AssetCard';
import { axiosInstance } from '../lib/axios.js';

export default function MyList() {

  const {data: current_user } = useQuery({
    queryKey: ["current_user"],
    queryFn: async () => {
      const res = await axiosInstance.get("/auth/me");
      return res.data;
    }
  });

  const { data: my_assets } = useQuery({
    queryKey: ["my_assets"],
    queryFn: async () => {
      const res = await axiosInstance.get(`/asset?responsible=${current_user._id}`); // todo: Make id dynamic
      console.log(res.data);
      return res.data;
    }
  });

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        padding: 8
      }}
    >
      {my_assets?.map(asset => (
        <AssetCard key={asset._id} asset={asset}/>
      ))}

    </View>
  )
}
