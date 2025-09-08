import React, { useState } from "react";
import { TextInput, StyleSheet, View, Text } from "react-native";
import { useSelector } from "react-redux";

// Componente de input customizado e reutilizável
export default function CustomInput({
  placeholder, // Texto de placeholder para o input
  secureTextEntry, // Booleano para ocultar o texto (senha)
  value, // Valor atual do input
  onChangeText, // Função para lidar com a mudança de texto
  keyboardType, // Tipo de teclado a ser exibido
  label, // Rótulo do campo de input
  error, // Mensagem de erro a ser exibida
  multiline = false, // Booleano para permitir múltiplas linhas
  numberOfLines = 1, // Número de linhas visíveis para multiline
}) {
  // Estado para controlar se o input está focado
  const [isFocused, setIsFocused] = useState(false);
  // Obtém o estado do tema e as cores do Redux store
  const themeState = useSelector((state) => state.theme);
  const currentTheme = themeState.theme;
  const colors = themeState.colors[currentTheme];

  // Função para determinar o estilo do input com base no foco, erro e tema
  const getInputStyle = () => {
    let style = {
      backgroundColor: colors.inputBackground || (currentTheme === "dark" ? "#2a2a2a" : "#f8f9fa"),
      color: colors.text,
      borderColor: error ? "#dc3545" : (isFocused ? colors.accent : colors.border || "#e0e0e0"),
    };

    // Adiciona sombra quando o input está focado
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
      {/* Renderiza o rótulo se ele existir */}
      {label && (
        <Text style={[styles.label, { color: colors.text }]}>
          {label}
        </Text>
      )}
      {/* Componente TextInput do React Native */}
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
        onFocus={() => setIsFocused(true)} // Define o estado de foco como verdadeiro
        onBlur={() => setIsFocused(false)} // Define o estado de foco como falso
      />
      {/* Renderiza a mensagem de erro se ela existir */}
      {error && (
        <Text style={styles.errorText}>
          {error}
        </Text>
      )}
    </View>
  );
}

// Estilos para o componente CustomInput
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


