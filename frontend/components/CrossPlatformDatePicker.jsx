import { Platform } from "react-native";
import DatePicker from "react-native-date-picker";

export function CrossPlatformDatePicker({ value, onChange }) {
  if (Platform.OS === "web") {
    return (
      <input
        type="date"
        value={value ? value.toISOString().split("T")[0] : ""}
        onChange={(e) => onChange(new Date(e.target.value))}
        style={{
          borderWidth: 1,
          borderRadius: 8,
          padding: 10,
          borderColor: "#ccc",
        }}
      />
    );
  }

  return (
    <DatePicker
      mode="date"
      date={value || new Date()}
      onDateChange={onChange}
    />
  );
}
