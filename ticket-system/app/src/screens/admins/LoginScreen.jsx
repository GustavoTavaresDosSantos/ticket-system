import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector } from "react-redux";
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import CustomText from "../../components/CustomText";
import { checkAndCreateMockUsers } from "../../utils/mockData";

// Esquema de validação para o formulário de login do administrador
const loginSchema = Yup.object().shape({
  username: Yup.string().required("Usuário obrigatório"),
  password: Yup.string().required("Senha obrigatória"),
});

// Componente da tela de Login do Administrador
export default function AdminLoginScreen({ navigation }) {
  const themeState = useSelector((state) => state.theme);
  const currentTheme = themeState.theme;
  const colors = themeState.colors[currentTheme];

  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false); // ✅ controla se os mocks já estão prontos

  // Efeito para garantir que os usuários mock estejam criados ao carregar a tela
  useEffect(() => {
    const prepareUsers = async () => {
      await checkAndCreateMockUsers(); // aguarda a criação dos mocks
      setIsReady(true); // habilita login
    };
    prepareUsers();
  }, []);

  // Função para lidar com o processo de login do administrador
  const handleLogin = async (values) => {
    setIsLoading(true);
    try {
      const storedUsers = await AsyncStorage.getItem("users");
      const users = storedUsers ? JSON.parse(storedUsers) : [];

      console.log("Usuários armazenados:", users);
      console.log("Tentativa de login:", values.username, values.password);

      // Procura por um administrador com o usuário e senha fornecidos
      const admin = users.find(
        (u) =>
          u.id === values.username && // usar id do mock
          u.password === values.password &&
          u.role === "admin"
      );

      if (admin) {
        Alert.alert("Sucesso", "Login de administrador bem-sucedido!");
        navigation.navigate("AdminTabs"); // Navega para as abas do administrador
      } else {
        Alert.alert("Erro", "Usuário ou senha incorretos.");
      }
    } catch (error) {
      console.error("Erro ao fazer login de administrador:", error);
      Alert.alert("Erro", "Falha ao realizar login. Tente novamente.");
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
            Bem-vindo, Administrador!
          </CustomText>
          <CustomText style={[styles.subtitle, { color: colors.secondary }]}>
            Entre com seu usuário e senha para gerenciar os tickets.
          </CustomText>
        </View>

        <Formik
          initialValues={{ username: "", password: "" }}
          validationSchema={loginSchema}
          onSubmit={handleLogin}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <View style={styles.form}>
              <CustomInput
                label="Usuário"
                placeholder="Digite seu usuário"
                value={values.username}
                onChangeText={handleChange("username")}
                onBlur={handleBlur("username")}
                error={
                  touched.username && errors.username ? errors.username : ""
                }
              />

              <CustomInput
                label="Senha"
                placeholder="Digite sua senha"
                secureTextEntry
                value={values.password}
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                error={
                  touched.password && errors.password ? errors.password : ""
                }
              />

              <View style={styles.buttonContainer}>
                <CustomButton
                  title={isLoading ? "Entrando..." : "Entrar"}
                  onPress={handleSubmit}
                  disabled={isLoading || !isReady} // ⬅️ desabilita enquanto mocks não estiverem prontos
                />
              </View>
            </View>
          )}
        </Formik>
      </View>
    </KeyboardAvoidingView>
  );
}

// Estilos da tela de Login do Administrador
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
