import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { useSelector } from "react-redux";

// Componente de botão customizado e reutilizável
export default function CustomButton({
  title, // Texto exibido no botão
  onPress, // Função a ser executada ao pressionar o botão
  color, // Cor de fundo personalizada do botão
  textColor, // Cor do texto personalizada do botão
  variant = "primary", // Variante do estilo do botão (primary, secondary, danger)
  disabled = false, // Booleano para desabilitar o botão
}) {
  // Obtém o estado do tema e as cores do Redux store
  const themeState = useSelector((state) => state.theme);
  const currentTheme = themeState.theme;
  const colors = themeState.colors[currentTheme];

  // Função para determinar o estilo de fundo do botão com base na variante e estado
  const getButtonStyle = () => {
    if (disabled) {
      return {
        backgroundColor: colors.disabled || "#ccc", // Cor de fundo quando desabilitado
        opacity: 0.6,
      };
    }

    if (color) {
      return { backgroundColor: color }; // Usa a cor personalizada se fornecida
    }

    // Define a cor de fundo com base na variante
    switch (variant) {
      case "secondary":
        return {
          backgroundColor: "transparent", // Fundo transparente para variante secundária
          borderWidth: 2,
          borderColor: colors.accent,
        };
      case "danger":
        return { backgroundColor: "#dc3545" }; // Cor de fundo para variante de perigo
      default:
        return { backgroundColor: colors.accent }; // Cor de fundo padrão (primary)
    }
  };

  // Função para determinar o estilo do texto do botão com base na variante e cor personalizada
  const getTextStyle = () => {
    if (textColor) {
      return { color: textColor }; // Usa a cor do texto personalizada se fornecida
    }

    if (variant === "secondary") {
      return { color: colors.accent }; // Cor do texto para variante secundária
    }

    return { color: "#fff" }; // Cor do texto padrão
  };

  return (
    <TouchableOpacity
      style={[styles.button, getButtonStyle()]} // Aplica estilos base e dinâmicos
      onPress={onPress}
      disabled={disabled}
      activeOpacity={disabled ? 1 : 0.7} // Opacidade ao pressionar
    >
      <Text style={[styles.text, getTextStyle()]}> {/* Aplica estilos base e dinâmicos ao texto */}
        {title}
      </Text>
    </TouchableOpacity>
  );
}

// Estilos para o componente CustomButton
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


