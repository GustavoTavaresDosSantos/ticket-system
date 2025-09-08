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

// Esquema de validação para o formulário de login usando Yup
const loginSchema = Yup.object().shape({
  id: Yup.string()
    .length(8, "A matrícula deve ter exatamente 8 dígitos")
    .matches(/^\d+$/, "A matrícula deve conter apenas números")
    .required("Matrícula obrigatória"),
  password: Yup.string().required("Senha obrigatória"),
});

// Componente da tela de login do aluno
export default function LoginScreen({ navigation }) {
  // Obtém o estado do tema e as cores do Redux store
  const themeState = useSelector((state) => state.theme);
  const currentTheme = themeState.theme;
  const colors = themeState.colors[currentTheme];

  // Estado para controlar o carregamento do login
  const [isLoading, setIsLoading] = useState(false);

  // Efeito para verificar e criar usuários mock quando o componente é montado
  useEffect(() => {
    checkAndCreateMockUsers();
  }, []);

  // Função para lidar com o processo de login
  const handleLogin = async (values) => {
    setIsLoading(true);
    try {
      // Busca usuários armazenados localmente
      const storedUsers = await AsyncStorage.getItem("users");
      const users = storedUsers ? JSON.parse(storedUsers) : [];

      // Encontra o aluno correspondente com base na matrícula, senha e função
      const student = users.find(
        (u) =>
          u.id === values.id &&
          u.password === values.password &&
          u.role === "student"
      );

      // Verifica se o aluno foi encontrado e realiza o login ou exibe erro
      if (student) {
        Alert.alert("Sucesso", "Login bem-sucedido!");
        navigation.navigate("HomeScreen", { student });
      } else {
        Alert.alert("Erro", "Matrícula ou senha incorretas.");
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
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
          {/* Título da tela de login */}
          <CustomText style={[styles.title, { color: colors.text }]}>
            Bem-vindo, Aluno!
          </CustomText>
          {/* Subtítulo da tela de login */}
          <CustomText style={[styles.subtitle, { color: colors.secondary }]}>
            Entre com sua matrícula e senha para acessar seus tickets.
          </CustomText>
        </View>

        {/* Formulário de login usando Formik para validação */}
        <Formik
          initialValues={{ id: "", password: "" }}
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
              {/* Campo de input para a matrícula */}
              <CustomInput
                label="Matrícula"
                placeholder="Digite sua matrícula"
                keyboardType="numeric"
                value={values.id}
                onChangeText={handleChange("id")}
                onBlur={handleBlur("id")}
                error={touched.id && errors.id ? errors.id : ""}
              />

              {/* Campo de input para a senha */}
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

              {/* Botão de login */}
              <View style={styles.buttonContainer}>
                <CustomButton
                  title={isLoading ? "Entrando..." : "Entrar"}
                  onPress={handleSubmit}
                  disabled={isLoading}
                />
              </View>
            </View>
          )}
        </Formik>
      </View>
    </KeyboardAvoidingView>
  );
}

// Estilos para o componente LoginScreen
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


