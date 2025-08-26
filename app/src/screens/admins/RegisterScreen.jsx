import React from "react";
import { View, TextInput, Button, Text, Alert } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import AsyncStorage from "@react-native-async-storage/async-storage";

const cadastroSchema = Yup.object().shape({
  username: Yup.string()
    .required("Usuário obrigatório")
    .min(3, "Usuário muito curto"),
  matricula: Yup.string()
    .length(8, "A matrícula deve ter exatamente 8 dígitos")
    .matches(/^\d+$/, "A matrícula deve conter apenas números")
    .required("Matrícula obrigatória"),
  senha: Yup.string().required("Senha obrigatória").min(6, "Senha muito curta"),
  papel: Yup.string().oneOf(["student", "admin"]).required(),
});

export default function RegisterScreen({ navigation }) {
  const handleRegister = async (values, { resetForm }) => {
    try {
      const storedUsers = await AsyncStorage.getItem("users");
      const users = storedUsers ? JSON.parse(storedUsers) : [];

      const existeUsuario = users.find(
        (u) =>
          u.matricula === values.matricula || u.username === values.username
      );
      if (existeUsuario) {
        Alert.alert("Erro", "Matrícula ou usuário já cadastrado.");
        return;
      }

      users.push({
        username: values.username,
        matricula: values.matricula,
        password: values.senha,
        role: values.papel,
      });

      await AsyncStorage.setItem("users", JSON.stringify(users));
      Alert.alert("Sucesso", "Usuário cadastrado com sucesso!");
      resetForm();
    } catch (error) {
      console.log("Erro ao cadastrar usuário:", error);
    }
  };

  return (
    <Formik
      initialValues={{
        username: "",
        matricula: "",
        senha: "",
        papel: "student",
      }}
      validationSchema={cadastroSchema}
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
          <TextInput
            placeholder="Usuário"
            onChangeText={handleChange("username")}
            onBlur={handleBlur("username")}
            value={values.username}
          />
          {touched.username && errors.username && (
            <Text>{errors.username}</Text>
          )}

          <TextInput
            placeholder="Matrícula"
            keyboardType="numeric"
            onChangeText={handleChange("matricula")}
            onBlur={handleBlur("matricula")}
            value={values.matricula}
          />
          {touched.matricula && errors.matricula && (
            <Text>{errors.matricula}</Text>
          )}

          <TextInput
            placeholder="Senha"
            secureTextEntry
            onChangeText={handleChange("senha")}
            onBlur={handleBlur("senha")}
            value={values.senha}
          />
          {touched.senha && errors.senha && <Text>{errors.senha}</Text>}

          <Button
            title={`Cadastrar como ${
              values.papel === "student" ? "Aluno" : "Admin"
            }`}
            onPress={() =>
              setFieldValue(
                "papel",
                values.papel === "student" ? "admin" : "student"
              )
            }
          />

          <Button title="Cadastrar Usuário" onPress={handleSubmit} />
        </View>
      )}
    </Formik>
  );
}
