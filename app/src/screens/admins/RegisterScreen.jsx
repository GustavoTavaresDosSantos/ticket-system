import React, { useState } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Text,
  ScrollView,
  TouchableOpacity, // Para criar o botão de abrir o seletor
  Modal, // O componente para a seleção da turma
  Pressable, // Para fechar o modal ao tocar fora
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
// O Picker não é mais necessário aqui
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector } from "react-redux";

import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import CustomText from "../../components/CustomText";
import { classes } from "../../utils/timeAndConstants";

// Schema de validação
const registerSchema = Yup.object().shape({
  name: Yup.string().required("Nome é obrigatório"),
  id: Yup.string()
    .length(8, "A matrícula deve ter 8 dígitos")
    .matches(/^\d+$/, "A matrícula deve conter apenas números")
    .required("Matrícula é obrigatória"),
  password: Yup.string().required("Senha é obrigatória"),
  class: Yup.string().required("Selecione uma turma"),
});

export default function RegisterScreen({ navigation }) {
  const { theme, colors } = useSelector((state) => state.theme);
  const currentColors = colors[theme];

  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false); // Estado para controlar o modal

  const handleRegister = async (values) => {
    // ... (lógica de registro permanece a mesma)
    setIsLoading(true);
    try {
      const storedUsers = await AsyncStorage.getItem("users");
      const users = storedUsers ? JSON.parse(storedUsers) : [];
      const userExists = users.some((user) => user.id === values.id);
      if (userExists) {
        Alert.alert("Erro", "Já existe um aluno com essa matrícula.");
        return;
      }
      const newStudent = { ...values, role: "student" };
      const updatedUsers = [...users, newStudent];
      await AsyncStorage.setItem("users", JSON.stringify(updatedUsers));
      Alert.alert("Sucesso", "Cadastro realizado com sucesso!");
      navigation.goBack();
    } catch (error) {
      console.error("Erro ao registrar aluno:", error);
      Alert.alert("Erro", "Falha ao registrar. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: currentColors.body }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <CustomText style={[styles.title, { color: currentColors.text }]}>
          Cadastro de Aluno
        </CustomText>

        <Formik
          initialValues={{ name: "", id: "", password: "", class: "" }}
          validationSchema={registerSchema}
          onSubmit={handleRegister}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            setFieldValue,
          }) => (
            <View>
              {/* --- Inputs de Nome e Matrícula (sem alteração) --- */}
              <CustomInput
                label="Nome"
                placeholder="Digite seu nome completo"
                value={values.name}
                onChangeText={handleChange("name")}
                onBlur={handleBlur("name")}
                error={touched.name && errors.name}
              />
              <CustomInput
                label="Matrícula"
                placeholder="Digite os 8 dígitos"
                keyboardType="numeric"
                maxLength={8}
                value={values.id}
                onChangeText={handleChange("id")}
                onBlur={handleBlur("id")}
                error={touched.id && errors.id}
              />

              {/* --- NOVO SELETOR DE TURMA --- */}
              <CustomText style={styles.inputLabel}>Turma</CustomText>
              <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => setModalVisible(true)}
              >
                <CustomText
                  style={
                    values.class
                      ? styles.pickerButtonText
                      : styles.pickerPlaceholder
                  }
                >
                  {values.class
                    ? classes[values.class].name
                    : "Selecione sua turma"}
                </CustomText>
                {/* Pode adicionar um ícone de seta aqui se quiser */}
              </TouchableOpacity>
              {touched.class && errors.class && (
                <Text style={styles.errorText}>{errors.class}</Text>
              )}

              {/* --- Input de Senha (sem alteração) --- */}
              <CustomInput
                label="Senha"
                placeholder="Crie sua senha"
                secureTextEntry
                value={values.password}
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                error={touched.password && errors.password}
              />

              <View style={styles.buttonContainer}>
                <CustomButton
                  title={isLoading ? "Cadastrando..." : "Cadastrar"}
                  onPress={handleSubmit}
                  disabled={isLoading}
                />
              </View>

              {/* --- MODAL DE SELEÇÃO DE TURMA --- */}
              <Modal
                transparent={true}
                visible={isModalVisible}
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
              >
                <Pressable
                  style={styles.modalBackdrop}
                  onPress={() => setModalVisible(false)}
                >
                  <View style={styles.modalContent}>
                    <CustomText style={styles.modalTitle}>
                      Selecione a Turma
                    </CustomText>
                    {Object.keys(classes).map((key) => (
                      <TouchableOpacity
                        key={key}
                        style={styles.modalOption}
                        onPress={() => {
                          setFieldValue("class", key);
                          setModalVisible(false);
                        }}
                      >
                        <CustomText style={styles.modalOptionText}>
                          {classes[key].name}
                        </CustomText>
                      </TouchableOpacity>
                    ))}
                  </View>
                </Pressable>
              </Modal>
            </View>
          )}
        </Formik>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: "center", padding: 24 },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 32,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  errorText: { color: "red", fontSize: 12, marginTop: 4, marginBottom: 10 },
  buttonContainer: { marginTop: 24 },

  // --- Estilos do novo seletor ---
  pickerButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
    height: 50,
    justifyContent: "center",
    paddingHorizontal: 12,
    marginBottom: 15,
  },
  pickerButtonText: {
    fontSize: 16,
    color: "#000",
  },
  pickerPlaceholder: {
    fontSize: 16,
    color: "#999",
  },

  // --- Estilos do Modal ---
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    width: "80%",
    maxHeight: "60%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  modalOption: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalOptionText: {
    fontSize: 18,
    textAlign: "center",
  },
});
