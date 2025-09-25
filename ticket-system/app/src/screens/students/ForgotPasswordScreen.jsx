import React, { useState } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector } from "react-redux";
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import CustomText from "../../components/CustomText";
import { Feather } from "@expo/vector-icons";

// Esquema de validação para o formulário de recuperação de senha
const passwordRecoverySchema = Yup.object().shape({
  id: Yup.string()
    .length(8, "A matrícula deve ter exatamente 8 dígitos")
    .matches(/^\d+$/, "A matrícula deve conter apenas números")
    .required("Matrícula obrigatória"),
  newPassword: Yup.string()
    .min(6, "A nova senha deve ter no mínimo 6 caracteres")
    .required("Nova senha obrigatória"),
  confirmNewPassword: Yup.string()
    .oneOf([Yup.ref("newPassword"), null], "As senhas não coincidem")
    .required("Confirmação de nova senha obrigatória"),
});

// Componente da tela de Recuperação de Senha
export default function ForgotPasswordScreen({ navigation }) {
  const themeState = useSelector((state) => state.theme);
  const currentTheme = themeState.theme;
  const colors = themeState.colors[currentTheme];

  const [isLoading, setIsLoading] = useState(false);

  // Função para lidar com o processo de recuperação de senha
  const handlePasswordRecovery = async (values) => {
    setIsLoading(true);
    try {
      const storedUsers = await AsyncStorage.getItem("users");
      let users = storedUsers ? JSON.parse(storedUsers) : [];

      // Encontra o índice do aluno pela matrícula
      const studentIndex = users.findIndex(
        (u) => u.id === values.id && u.role === "student"
      );

      if (studentIndex !== -1) {
        // Atualiza a senha do aluno
        users[studentIndex].password = values.newPassword;
        await AsyncStorage.setItem("users", JSON.stringify(users));
        Alert.alert("Sucesso", "Senha alterada com sucesso!");
        navigation.goBack(); // Retorna para a tela de login
      } else {
        Alert.alert("Erro", "Matrícula não encontrada ou não corresponde a um aluno.");
      }
    } catch (error) {
      console.error("Erro ao recuperar senha:", error);
      Alert.alert("Erro", "Falha ao recuperar senha. Tente novamente.");
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
            Recuperar Senha
          </CustomText>
          <CustomText style={[styles.subtitle, { color: colors.secondary }]}>
            Informe sua matrícula e a nova senha.
          </CustomText>
        </View>

        <Formik
          initialValues={{ id: "", newPassword: "", confirmNewPassword: "" }}
          validationSchema={passwordRecoverySchema}
          onSubmit={handlePasswordRecovery}
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
                label="Nova Senha"
                placeholder="Digite sua nova senha"
                secureTextEntry
                value={values.newPassword}
                onChangeText={handleChange("newPassword")}
                onBlur={handleBlur("newPassword")}
                error={
                  touched.newPassword && errors.newPassword
                    ? errors.newPassword
                    : ""
                }
              />

              <CustomInput
                label="Confirmar Nova Senha"
                placeholder="Confirme sua nova senha"
                secureTextEntry
                value={values.confirmNewPassword}
                onChangeText={handleChange("confirmNewPassword")}
                onBlur={handleBlur("confirmNewPassword")}
                error={
                  touched.confirmNewPassword && errors.confirmNewPassword
                    ? errors.confirmNewPassword
                    : ""
                }
              />

              <View style={styles.buttonContainer}>
                <CustomButton
                  title={isLoading ? "Alterando..." : "Alterar Senha"}
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

// Estilos da tela de Recuperação de Senha
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

