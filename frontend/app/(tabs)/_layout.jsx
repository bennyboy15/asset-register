// app/(tabs)/_layout.jsx
import { Tabs, useRouter } from "expo-router";
import { ClipboardList, Home, Package, Plus } from "lucide-react";
import { Pressable, StyleSheet, Text } from "react-native";
import { axiosInstance } from "../../lib/axios.js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";

export default function TabsLayout() {
  const router = useRouter();

  const queryClient = useQueryClient();

  const { mutate: logout } = useMutation({
    mutationFn: async () => {
      return await axiosInstance.post("/auth/logout");
    },
    onSuccess: () => {
      // Remove cached current_user so AuthGate will detect logged out state
      try { queryClient.removeQueries(["current_user"]); } catch (_) { }
      Toast.show({ type: "success", text1: "Logged out" });
      router.replace("/(auth)/Login");
    },
    onError: () => {
      Toast.show({ type: "error", text1: "Error logging out" });
    }
  })

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "red",
        tabBarShowLabel: false,
        animation: "shift",
        headerRight: () => (
          <Pressable title="Logout" onPress={logout} style={styles.logoutButton} >
            <Text style={styles.buttonText}>Logout</Text>
          </Pressable>
        ),
        headerRightContainerStyle: { marginRight: 10 }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="Assets"
        options={{
          title: "Assets",
          tabBarIcon: ({ color, size }) => <Package color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="myList"
        options={{
          title: "My List",
          tabBarIcon: ({ color, size }) => (
            <ClipboardList color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="CreateAsset"
        options={{
          title: "Create",
          tabBarIcon: ({ color, size }) => <Plus color={color} size={size} />,
        }}
      />
      <Tabs.Screen name="asset/[id]" options={{ href: null }} />
    </Tabs>
  );
}


const styles = StyleSheet.create({
  buttonText: {
    color: "white",
    fontWeight: "bold"
  },
  logoutButton: {
    backgroundColor: "red",
    borderRadius: 10,
    height: "60%",
    padding: 8,
    textAlign: "center",
    verticalAlign: "middle"
  }
})