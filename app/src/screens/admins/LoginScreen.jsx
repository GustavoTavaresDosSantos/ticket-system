import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import CustomText from "../../components/CustomText";
import { useSelector } from "react-redux";

export default function LoginScreen({ navigation }) {
  const themeState = useSelector((state) => state.theme);
  const currentTheme = themeState.theme;
  const colors = themeState.colors[currentTheme];

  const [formData, setFormData] = useState({
    user: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.user.trim()) {
      newErrors.user = "Usuário é obrigatório";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Senha é obrigatória";
    } else if (formData.password.length < 6) {
      newErrors.password = "Senha deve ter pelo menos 6 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simular chamada de API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Aqui você implementaria a lógica real de autenticação
      console.log(`Admin logando: ${formData.user}`);

      // Exemplo de validação simples (remover em produção)
      if (formData.user === "admin" && formData.password === "123456") {
        Alert.alert("Sucesso", "Login realizado com sucesso!");
        // navigation.navigate("AdminDashboard");
      } else {
        Alert.alert("Erro", "Usuário ou senha incorretos");
      }
    } catch (error) {
      Alert.alert("Erro", "Falha ao realizar login. Tente novamente.");
      console.error("Erro no login:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.body }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <CustomText style={[styles.title, { color: colors.text }]}>
            Login Administrador
          </CustomText>
          <CustomText style={[styles.subtitle, { color: colors.secondary }]}>
            Acesse o painel administrativo
          </CustomText>
        </View>

        <View style={styles.form}>
          <CustomInput
            label="Usuário"
            placeholder="Digite seu usuário"
            value={formData.user}
            onChangeText={(value) => handleInputChange("user", value)}
            error={errors.user}
          />

          <CustomInput
            label="Senha"
            placeholder="Digite sua senha"
            secureTextEntry
            value={formData.password}
            onChangeText={(value) => handleInputChange("password", value)}
            error={errors.password}
          />

          <View style={styles.buttonContainer}>
            <CustomButton
              title={isLoading ? "Entrando..." : "Entrar"}
              onPress={handleLogin}
              disabled={isLoading}
            />
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    opacity: 0.8,
  },
  form: {
    width: "100%",
  },
  buttonContainer: {
    marginTop: 16,
  },
});
