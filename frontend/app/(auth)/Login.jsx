import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { axiosInstance } from "../../lib/axios";
import Toast from "react-native-toast-message";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const queryClient = useQueryClient();

  const { mutate: login, isPending: loading } = useMutation({
    mutationFn: async (data) => await axiosInstance.post("/auth/login", data),
    onSuccess: () => {
      Toast.show({ type: "success", text1: "Successfully logged in" });
      queryClient.invalidateQueries({ queryKey: ["current_user"] });
      router.replace("/(tabs)");
    },
    onError: (error) => {
      const message = error?.response?.data?.message || error.message || "Login failed";
      Toast.show({ type: "error", text1: message });
    },
  });

  const handleSubmit = () => login({ username, password });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back!</Text>
      <Text style={styles.subtitle}>Please login to your account</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        autoCorrect={false}
        placeholderTextColor="#999"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#999"
      />

      <Pressable style={styles.button} onPress={handleSubmit} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Login</Text>}
      </Pressable>

      <Pressable onPress={() => router.replace("/(auth)/Signup")} style={styles.signupLink}>
        <Text style={styles.signupText}>Don&apos;t have an account? <Text style={styles.signupTextBold}>Sign up</Text></Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1f1f1f",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: 14,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginBottom: 16,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#1f6feb",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  signupLink: {
    alignItems: "center",
    marginTop: 8,
  },
  signupText: {
    color: "#666",
    fontSize: 14,
  },
  signupTextBold: {
    color: "#1f6feb",
    fontWeight: "700",
  },
});
