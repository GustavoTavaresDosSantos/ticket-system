import React from "react";
import { Text, StyleSheet } from "react-native";
import { useSelector } from "react-redux";

// Componente de texto customizado que ajusta a cor do texto com base no tema (claro/escuro)
export default function CustomText({ children, style }) {
  // Obtém o tema atual do Redux store
  const theme = useSelector((state) => state.theme.theme);
  // Verifica se o tema atual é escuro
  const isDark = theme === "dark";

  return (
    <Text style={[styles.text, { color: isDark ? "#fff" : "#000" }, style]}>
      {children}
    </Text>
  );
}

// Estilos para o componente CustomText
const styles = StyleSheet.create({
  text: {
    fontSize: 16,
  },
});


