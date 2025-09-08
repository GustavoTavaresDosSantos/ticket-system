import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import CustomText from "../../components/CustomText";
import { useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

const loginSchema = Yup.object().shape({
  user: Yup.string().required("Usuário é obrigatório"),
  password: Yup.string()
    .min(6, "Senha deve ter pelo menos 6 caracteres")
    .required("Senha obrigatória"),
});

export default function AdminLoginScreen({ navigation }) {
  const themeState = useSelector((state) => state.theme);
  const currentTheme = themeState.theme;
  const colors = themeState.colors[currentTheme];

  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (values) => {
    setIsLoading(true);
    try {
      const storedUsers = await AsyncStorage.getItem("users");
      const users = storedUsers ? JSON.parse(storedUsers) : [];

      const adminUser = users.find(
        (u) => u.role === "admin" && u.id === values.user
      );

      if (!adminUser) {
        Alert.alert("Erro", "Usuário não encontrado");
        return;
      }

      if (adminUser.password !== values.password) {
        Alert.alert("Erro", "Senha incorreta");
        return;
      }

      Alert.alert("Sucesso", "Login realizado com sucesso!");
      navigation.replace("RegisterScreen");
    } catch (error) {
      console.error("Erro ao logar admin:", error);
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
            Login Administrador
          </CustomText>
          <CustomText style={[styles.subtitle, { color: colors.secondary }]}>
            Acesse o painel administrativo
          </CustomText>
        </View>

        <Formik
          initialValues={{ user: "", password: "" }}
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
                value={values.user}
                onChangeText={handleChange("user")}
                onBlur={handleBlur("user")}
                error={touched.user && errors.user ? errors.user : ""}
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

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, justifyContent: "center", padding: 24 },
  header: { alignItems: "center", marginBottom: 32 },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: { fontSize: 16, textAlign: "center", opacity: 0.8 },
  form: { width: "100%" },
  buttonContainer: { marginTop: 16 },
});
