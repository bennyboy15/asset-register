import { Slot, useRouter, useSegments } from "expo-router";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import Toast from "react-native-toast-message";
import { useEffect } from "react";

const queryClient = new QueryClient();

function AuthGate() {
  const router = useRouter();
  const segments = useSegments(); // helps check current route group (auth/tabs)

  const { data: current_user, isLoading } = useQuery({
    queryKey: ["current_user"],
    queryFn: async () => {
      const res = await axiosInstance.get("/auth/me");
      return res.data;
    },
    retry: false,
  });

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "(auth)";
    const inTabsGroup = segments[0] === "(tabs)";

    // If there's no user, always go to the auth group (login) unless already there
    if (!current_user && !inAuthGroup) {
      router.replace("/(auth)/Login");
      return;
    }

    // If there is a user, ensure we're in the tabs group
    if (current_user && !inTabsGroup) {
      router.replace("/(tabs)");
      return;
    }
  }, [isLoading, current_user, segments, router]);

  if (isLoading) return null; // optional: replace with splash loader

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
