import React, { useState } from "react";
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

const loginSchema = Yup.object().shape({
  id: Yup.string()
    .length(8, "A matrícula deve ter exatamente 8 dígitos")
    .matches(/^\d+$/, "A matrícula deve conter apenas números")
    .required("Matrícula obrigatória"),
  password: Yup.string().required("Senha obrigatória"),
});

export default function LoginScreen({ navigation }) {
  const themeState = useSelector((state) => state.theme);
  const currentTheme = themeState.theme;
  const colors = themeState.colors[currentTheme];

  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (values) => {
    setIsLoading(true);
    try {
      const storedUsers = await AsyncStorage.getItem("users");
      const users = storedUsers ? JSON.parse(storedUsers) : [];

      const student = users.find(
        (u) =>
          u.id === values.id &&
          u.password === values.password &&
          u.role === "student"
      );

      if (student) {
        Alert.alert("Sucesso", "Login bem-sucedido!");
        navigation.navigate("HomeScreen");
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
          <CustomText style={[styles.title, { color: colors.text }]}>
            Login do Aluno
          </CustomText>
          <CustomText style={[styles.subtitle, { color: colors.secondary }]}>
            Acesse seus tickets e informações
          </CustomText>
        </View>

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
              <CustomInput
                label="Matrícula"
                placeholder="Digite sua matrícula"
                keyboardType="numeric"
                value={values.id}
                onChangeText={handleChange("id")}
                onBlur={handleBlur("id")}
                error={touched.id && errors.id ? errors.id : ""}
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
