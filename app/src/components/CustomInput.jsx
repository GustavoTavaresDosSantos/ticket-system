import React, { useState } from "react";
import { TextInput, StyleSheet, View, Text } from "react-native";
import { useSelector } from "react-redux";

export default function CustomInput({
  placeholder,
  secureTextEntry,
  value,
  onChangeText,
  keyboardType,
  label,
  error,
  multiline = false,
  numberOfLines = 1,
}) {
  const [isFocused, setIsFocused] = useState(false);
  const themeState = useSelector((state) => state.theme);
  const currentTheme = themeState.theme;
  const colors = themeState.colors[currentTheme];

  const getInputStyle = () => {
    let style = {
      backgroundColor: colors.inputBackground || (currentTheme === "dark" ? "#2a2a2a" : "#f8f9fa"),
      color: colors.text,
      borderColor: error ? "#dc3545" : (isFocused ? colors.accent : colors.border || "#e0e0e0"),
    };

    if (isFocused) {
      style.shadowColor = colors.accent;
      style.shadowOffset = { width: 0, height: 0 };
      style.shadowOpacity = 0.3;
      style.shadowRadius = 4;
      style.elevation = 3;
    }

    return style;
  };

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, { color: colors.text }]}>
          {label}
        </Text>
      )}
      <TextInput
        style={[styles.input, getInputStyle()]}
        placeholder={placeholder}
        placeholderTextColor={colors.placeholderText || (currentTheme === "dark" ? "#888" : "#666")}
        secureTextEntry={secureTextEntry}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={numberOfLines}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {error && (
        <Text style={styles.errorText}>
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
    marginLeft: 4,
  },
  input: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    fontSize: 16,
    minHeight: 50,
    textAlignVertical: "top",
  },
  errorText: {
    color: "#dc3545",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});
