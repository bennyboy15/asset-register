import { View, Text, TextInput, Pressable, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import Toast from "react-native-toast-message";
import { CrossPlatformDatePicker } from "./CrossPlatformDatePicker";

export default function AssetForm() {
  const queryClient = useQueryClient();

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      name: "",
      assetImage: "",
      lastService: new Date(),
      nextService: new Date(),
      responsible_user: ""
    },
  });

  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axiosInstance.get("/auth/users");
      return res.data;
    }
  });

  const { mutate: createAsset, isPending } = useMutation({
    mutationFn: async (data) => axiosInstance.post("/asset", { ...data }),
    onSuccess: () => {
      Toast.show({ type: "success", text1: "Asset created successfully" });
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      queryClient.invalidateQueries({ queryKey: ["my_assets"] });
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
    <ScrollView style={styles.scrollContainer}>
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
                placeholderTextColor="#999"
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
              placeholderTextColor="#999"
              value={value}
              onChangeText={onChange}
            />
          )}
        />

        <Controller
          control={control}
          name="lastService"
          render={({ field: { onChange, value } }) => (
            <View style={styles.datePickerContainer}>
              <Text style={styles.dateLabel}>Last Service</Text>
              <CrossPlatformDatePicker value={value} onChange={onChange} />
            </View>
          )}
        />

        <Controller
          control={control}
          name="nextService"
          render={({ field: { onChange, value } }) => (
            <View style={styles.datePickerContainer}>
              <Text style={styles.dateLabel}>Next Service</Text>
              <CrossPlatformDatePicker value={value} onChange={onChange} />
            </View>
          )}
        />

        <Controller
          control={control}
          name="responsible_user"
          render={({ field: { onChange, value } }) => (
            <select
              style={styles.input}
              name="responsible_user"
              onChange={onChange}
              value={value}
            >
              <option value="">Select responsible user</option>
              {users?.map((user) => (
                <option key={user._id} value={user._id}>{user.name}</option>
              ))}
            </select>
          )}
        />

        <Pressable
          style={[styles.button, isPending && styles.buttonDisabled]}
          onPress={handleSubmit(onSubmit)}
          disabled={isPending}
        >
          {isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Create Asset</Text>
          )}
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  container: {
    backgroundColor: "#fff",
    margin: 16,
    padding: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    elevation: 3,
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
    color: "#1f1f1f",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: "#fdfdfd",
  },
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    marginBottom: 8,
  },
  datePickerContainer: {
    marginBottom: 16,
  },
  dateLabel: {
    marginBottom: 6,
    fontSize: 14,
    fontWeight: "500",
    color: "#444",
  },
  button: {
    backgroundColor: "#1f6feb",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: "#a0c4ff",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
