import React from "react";
import { View, TextInput, Button, Text } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import AsyncStorage from "@react-native-async-storage/async-storage";

const loginSchema = Yup.object().shape({
  id: Yup.string()
    .length(8, "A matrícula deve ter exatamente 8 dígitos")
    .matches(/^\d+$/, "A matrícula deve conter apenas números")
    .required("Matrícula obrigatória"),
  password: Yup.string().required("Senha obrigatória"),
});

export default function LoginScreen({ navigation }) {
  const handleLogin = async (values) => {
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
        alert("Login bem-sucedido!");
        navigation.navigate("TicketScreen");
      } else {
        alert("Matrícula ou senha incorretas.");
      }
    } catch (error) {
      console.log("Erro ao fazer login:", error);
    }
  };

  return (
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
        <View>
          <TextInput
            placeholder="Matrícula"
            keyboardType="numeric"
            onChangeText={handleChange("id")}
            onBlur={handleBlur("id")}
            value={values.id}
          />
          {touched.id && errors.id && <Text>{errors.id}</Text>}

          <TextInput
            placeholder="Senha"
            secureTextEntry
            onChangeText={handleChange("password")}
            onBlur={handleBlur("password")}
            value={values.password}
          />
          {touched.password && errors.password && (
            <Text>{errors.password}</Text>
          )}

          <Button title="Login Aluno" onPress={handleSubmit} />
        </View>
      )}
    </Formik>
  );
}
