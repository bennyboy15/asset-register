import React from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import Toast from "react-native-toast-message";

export default function AssetForm({ responsible_user }) {
  const queryClient = useQueryClient();

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      name: "",
      assetImage: "",
      lastService: "",
      nextService: "",
    },
  });

  const { mutate: createAsset, isPending } = useMutation({
    mutationFn: async (data) => {
      const payload = { ...data, responsible_user };
      return axiosInstance.post("/asset", payload);
    },
    onSuccess: () => {
      Toast.show({ type: "success", text1: "Asset created successfully" });
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      reset();
    },
    onError: (error) => {
      Toast.show({
        type: "error",
        text1: error?.response?.data?.message || "Error creating asset",
      });
    },
  });

  const onSubmit = (data) => createAsset(data);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Add New Asset</Text>

      <Controller
        control={control}
        name="name"
        rules={{ required: "Asset name is required" }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <>
            <TextInput
              style={[styles.input, error && styles.inputError]}
              placeholder="Asset Name"
              value={value}
              onChangeText={onChange}
            />
            {error && <Text style={styles.errorText}>{error.message}</Text>}
          </>
        )}
      />

      <Controller
        control={control}
        name="assetImage"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Image URL (optional)"
            value={value}
            onChangeText={onChange}
          />
        )}
      />

      <Controller
        control={control}
        name="lastService"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Last Service Date (YYYY-MM-DD)"
            value={value}
            onChangeText={onChange}
          />
        )}
      />

      <Controller
        control={control}
        name="nextService"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Next Service Date (YYYY-MM-DD)"
            value={value}
            onChangeText={onChange}
          />
        )}
      />

      <Button
        title={isPending ? "Saving..." : "Create Asset"}
        onPress={handleSubmit(onSubmit)}
        disabled={isPending}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#c8c8c8ff",
    elevation: 3,
    margin: 16,
  },
  heading: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    marginBottom: 8,
  },
});
