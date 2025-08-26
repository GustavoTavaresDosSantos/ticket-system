import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { useSelector } from "react-redux";

export default function CustomButton({ title, onPress }) {
  const theme = useSelector((state) => state.theme.theme);
  const isDark = theme === "dark";

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: isDark ? "#333" : "#007BFF" }]}
      onPress={onPress}
    >
      <Text style={[styles.text, { color: isDark ? "#fff" : "#fff" }]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 14,
    borderRadius: 8,
    marginVertical: 8,
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
