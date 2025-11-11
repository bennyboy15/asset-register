import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import AssetCard from '../../components/AssetCard.jsx';
import { axiosInstance } from '../../lib/axios.js';

export default function MyList() {
  const { data: current_user } = useQuery({
    queryKey: ["current_user"],
    queryFn: async () => {
      const res = await axiosInstance.get("/auth/me");
      return res.data;
    }
  });

  const { data: my_assets } = useQuery({
    queryKey: ["my_assets", current_user?._id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/asset?responsible=${current_user._id}`);
      return res.data;
    },
    enabled: !!current_user, // wait for current_user to load
  });

  if (!my_assets) {
    return (
      <View style={styles.center}>
        <ActivityIndicator/>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {my_assets?.length > 0 ? (
        my_assets.map(asset => <AssetCard key={asset._id} asset={asset} />)
      ) : (
        <View style={styles.placeholderContainer}>
          <Text style={styles.placeholderText}>
            You are not responsible for any assets 📝 
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 8,
    backgroundColor: "#f9fafb"
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 50,
  },
  placeholderText: {
    fontWeight: "600",
    fontSize: 18,
    color: "white", 
    textAlign: "center",
    backgroundColor: "#8ABEB9",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.55,
    shadowRadius: 4,
    elevation: 4,
  },
});
