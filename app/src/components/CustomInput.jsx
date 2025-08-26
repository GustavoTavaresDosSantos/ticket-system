import React from "react";
import { TextInput, StyleSheet } from "react-native";
import { useSelector } from "react-redux";

export default function CustomInput({
  placeholder,
  secureTextEntry,
  value,
  onChangeText,
  keyboardType,
}) {
  const theme = useSelector((state) => state.theme.theme);
  const isDark = theme === "dark";

  return (
    <TextInput
      style={[
        styles.input,
        {
          backgroundColor: isDark ? "#444" : "#f1f1f1",
          color: isDark ? "#fff" : "#000",
        },
      ]}
      placeholder={placeholder}
      placeholderTextColor={isDark ? "#aaa" : "#555"}
      secureTextEntry={secureTextEntry}
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
  },
});
