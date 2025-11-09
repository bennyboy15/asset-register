import { useQuery } from "@tanstack/react-query"
import AssetCard from '../components/AssetCard.jsx'
import { axiosInstance } from "../lib/axios.js"
import { View } from "react-native";


export default function Home() {

  const { data: assets } = useQuery({
    queryKey: ["assets"],
    queryFn: async () => {
      const res = await axiosInstance.get("/asset");
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
        <AssetCard id={asset._id} name={asset.name} key={asset._id} />
      ))}

    </View>
  )
}
