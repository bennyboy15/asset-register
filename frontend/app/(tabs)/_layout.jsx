import { Tabs } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Toast from "react-native-toast-message"
import { ClipboardList, Home, Package, Plus } from "lucide-react";

const queryClient = new QueryClient();

export default function RootLayout() {

  return (
    <QueryClientProvider client={queryClient}>
      <Tabs screenOptions={{ tabBarActiveTintColor: "red", tabBarShowLabel: false, animation:"shift"}}>

        <Tabs.Screen name="Login" options={{ title: "Login", href: null, headerShown: false }} />
        <Tabs.Screen name="Signup" options={{ title: "Create", href: null, headerShown: false }} />

        <Tabs.Screen name="index" options={{ title: "Home", tabBarIcon: ({ color, size }) => (<Home color={color} size={size} />) }} />
        <Tabs.Screen name="Assets" options={{ title: "Assets", tabBarIcon: ({ color, size }) => (<Package color={color} size={size} />) }} />
        <Tabs.Screen name="myList" options={{ title: "My List", tabBarBadge: 1, tabBarIcon: ({ color, size }) => (<ClipboardList color={color} size={size} />) }} />
        <Tabs.Screen name="CreateAsset" options={{ title: "Create", tabBarIcon: ({ color, size }) => (<Plus color={color} size={size} />) }} />

        <Tabs.Screen name="asset" options={{ href: null }} />
        <Tabs.Screen name="asset/[id]" options={{ href: null }} />
      </Tabs>
      <Toast />
    </QueryClientProvider>
  );
}
