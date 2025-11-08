import { useQuery } from "@tanstack/react-query"
import AssetCard from './components/AssetCard'
import {axiosInstance} from "./lib/axios.js"
import { View } from "react-native";

export default function Index() {
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
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {assets?.map(asset => (
        <AssetCard name={asset.name} key={asset._id}/>
      ))}
    </View>
  )
}
