import React from "react";
import { View, TextInput, Button, Text } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import AsyncStorage from "@react-native-async-storage/async-storage";

const loginSchema = Yup.object().shape({
  username: Yup.string().required("Usuário obrigatório"),
  password: Yup.string().required("Senha obrigatória"),
});

export default function LoginScreen({ navigation }) {
  const handleLogin = async (values) => {
    try {
      const storedUsers = await AsyncStorage.getItem("users");
      const users = storedUsers ? JSON.parse(storedUsers) : [];

      const admin = users.find(
        (u) =>
          u.username === values.username &&
          u.password === values.password &&
          u.role === "admin"
      );

      if (admin) {
        alert("Login bem-sucedido!");
        navigation.navigate("RegisterScreen");
      } else {
        alert("Usuário ou senha incorretos.");
      }
    } catch (error) {
      console.log("Erro ao fazer login:", error);
    }
  };

  return (
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
            placeholder="Senha"
            secureTextEntry
            onChangeText={handleChange("password")}
            onBlur={handleBlur("password")}
            value={values.password}
          />
          {touched.password && errors.password && (
            <Text>{errors.password}</Text>
          )}

          <Button title="Login Admin" onPress={handleSubmit} />
        </View>
      )}
    </Formik>
  );
}
