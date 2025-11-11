import { useQuery } from "@tanstack/react-query"
import AssetCard from '../../components/AssetCard.jsx'
import { axiosInstance } from "../../lib/axios.js"
import { View } from "react-native";

export default function Assets() {

  const { data: assets } = useQuery({
    queryKey: ["assets"],
    queryFn: async () => {
      const res = await axiosInstance.get("/asset");
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
      {assets?.map(asset => (
        <AssetCard key={asset._id} asset={asset} />
      ))}

    </View>
  )
}
