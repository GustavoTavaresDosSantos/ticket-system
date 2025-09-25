import React from "react";
import { Text, StyleSheet } from "react-native";
import { useSelector } from "react-redux";

export default function CustomText({ children, style }) {
  const theme = useSelector((state) => state.theme.theme);
  const isDark = theme === "dark";

  return (
    <Text style={[styles.text, { color: isDark ? "#fff" : "#000" }, style]}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
  },
});
