import { Tabs } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Toast from "react-native-toast-message"
import { ClipboardList, Home, Package, Plus, Settings } from "lucide-react";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Tabs screenOptions={{tabBarActiveTintColor: "red", tabBarShowLabel: false}}>
        <Tabs.Screen name="index" options={{title: "Home", tabBarIcon: ({color, size}) => (<Home color={color} size={size}/>)}}/>
        <Tabs.Screen name="assets" options={{title: "Assets", tabBarIcon: ({color, size}) => (<Package color={color} size={size}/>)}}/>
        <Tabs.Screen name="myList" options={{title: "My List", tabBarBadge: 2, tabBarIcon: ({color, size}) => (<ClipboardList color={color} size={size}/>)}}/>
        <Tabs.Screen name="createAsset" options={{title: "Create", tabBarIcon: ({color, size}) => (<Plus color={color} size={size}/>)}}/>
      </Tabs>
      <Toast/>
    </QueryClientProvider>
  );
}
