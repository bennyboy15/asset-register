import { Slot, useRouter } from "expo-router";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import Toast from "react-native-toast-message";
import { useEffect } from "react";

const queryClient = new QueryClient();

function AuthGate() {
  const router = useRouter();

  const { data: current_user, isLoading } = useQuery({
    queryKey: ["current_user"],
    queryFn: async () => {
      const res = await axiosInstance.get("/auth/me");
      return res.data;
    },
    retry: false,
  });

  useEffect(() => {
    if (!isLoading) {
      if (!current_user) router.replace("/(auth)/login");
    }
  }, [isLoading, current_user]);

  if (isLoading) return null; // Optional: splash/loading screen

  return <Slot />;
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthGate />
      <Toast />
    </QueryClientProvider>
  );
}
