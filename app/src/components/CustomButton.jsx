import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { useSelector } from "react-redux";

export default function CustomButton({ 
  title, 
  onPress, 
  color, 
  textColor, 
  variant = "primary",
  disabled = false 
}) {
  const themeState = useSelector((state) => state.theme);
  const currentTheme = themeState.theme;
  const colors = themeState.colors[currentTheme];

  const getButtonStyle = () => {
    if (disabled) {
      return {
        backgroundColor: colors.disabled || "#ccc",
        opacity: 0.6,
      };
    }

    if (color) {
      return { backgroundColor: color };
    }

    switch (variant) {
      case "secondary":
        return {
          backgroundColor: "transparent",
          borderWidth: 2,
          borderColor: colors.accent,
        };
      case "danger":
        return { backgroundColor: "#dc3545" };
      default:
        return { backgroundColor: colors.accent };
    }
  };

  const getTextStyle = () => {
    if (textColor) {
      return { color: textColor };
    }

    if (variant === "secondary") {
      return { color: colors.accent };
    }

    return { color: "#fff" };
  };

  return (
    <TouchableOpacity
      style={[styles.button, getButtonStyle()]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={disabled ? 1 : 0.7}
    >
      <Text style={[styles.text, getTextStyle()]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginVertical: 8,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 50,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
});
