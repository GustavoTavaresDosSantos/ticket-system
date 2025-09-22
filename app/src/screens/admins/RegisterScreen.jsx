import React, { useState } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector } from "react-redux";

import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import CustomText from "../../components/CustomText";
import { classes } from "../../utils/timeAndConstants";

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
  const [isModalVisible, setModalVisible] = useState(false);

  const handleRegister = async (values) => {
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
              <CustomInput
                label="Nome"
                placeholder="Digite seu nome completo"
                value={values.name}
                onChangeText={handleChange("name")}
                onBlur={handleBlur("name")}
                error={touched.name && errors.name}
                backgroundColor={currentColors.inputBackground}
                textColor={currentColors.text}
                placeholderTextColor={currentColors.placeholderText}
                borderColor={currentColors.border}
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
                backgroundColor={currentColors.inputBackground}
                textColor={currentColors.text}
                placeholderTextColor={currentColors.placeholderText}
                borderColor={currentColors.border}
              />

              <CustomText
                style={[styles.inputLabel, { color: currentColors.text }]}
              >
                Turma
              </CustomText>
              <TouchableOpacity
                style={[
                  styles.pickerButton,
                  {
                    backgroundColor: currentColors.inputBackground,
                    borderColor: currentColors.border,
                  },
                ]}
                onPress={() => setModalVisible(true)}
              >
                <CustomText
                  style={
                    values.class
                      ? [styles.pickerButtonText, { color: currentColors.text }]
                      : [
                          styles.pickerPlaceholder,
                          { color: currentColors.placeholderText },
                        ]
                  }
                >
                  {values.class
                    ? classes[values.class].name
                    : "Selecione sua turma"}
                </CustomText>
              </TouchableOpacity>
              {touched.class && errors.class && (
                <Text style={styles.errorText}>{errors.class}</Text>
              )}

              <CustomInput
                label="Senha"
                placeholder="Crie sua senha"
                secureTextEntry
                value={values.password}
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                error={touched.password && errors.password}
                backgroundColor={currentColors.inputBackground}
                textColor={currentColors.text}
                placeholderTextColor={currentColors.placeholderText}
                borderColor={currentColors.border}
              />

              <View style={styles.buttonContainer}>
                <CustomButton
                  title={isLoading ? "Cadastrando..." : "Cadastrar"}
                  onPress={handleSubmit}
                  disabled={isLoading}
                  backgroundColor={currentColors.accent}
                  textColor={currentColors.cardBackground}
                />
              </View>

              <Modal
                transparent={true}
                visible={isModalVisible}
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
              >
                <Pressable
                  style={[styles.modalBackdrop]}
                  onPress={() => setModalVisible(false)}
                >
                  <View
                    style={[
                      styles.modalContent,
                      { backgroundColor: currentColors.cardBackground },
                    ]}
                  >
                    <CustomText
                      style={[styles.modalTitle, { color: currentColors.text }]}
                    >
                      Selecione a Turma
                    </CustomText>
                    {Object.keys(classes).map((key) => (
                      <TouchableOpacity
                        key={key}
                        style={[
                          styles.modalOption,
                          { borderBottomColor: currentColors.border },
                        ]}
                        onPress={() => {
                          setFieldValue("class", key);
                          setModalVisible(false);
                        }}
                      >
                        <CustomText
                          style={[
                            styles.modalOptionText,
                            { color: currentColors.text },
                          ]}
                        >
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
  inputLabel: { fontSize: 16, fontWeight: "600", marginBottom: 8 },
  errorText: { color: "red", fontSize: 12, marginTop: 4, marginBottom: 10 },
  buttonContainer: { marginTop: 24 },

  pickerButton: {
    borderWidth: 1,
    borderRadius: 8,
    height: 50,
    justifyContent: "center",
    paddingHorizontal: 12,
    marginBottom: 15,
  },
  pickerButtonText: { fontSize: 16 },
  pickerPlaceholder: { fontSize: 16 },

  modalBackdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
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
  modalOption: { paddingVertical: 15, borderBottomWidth: 1 },
  modalOptionText: { fontSize: 18, textAlign: "center" },
});
