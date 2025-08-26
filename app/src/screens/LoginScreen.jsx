import React from "react";
import { View, TextInput, Button, Text } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";

const loginSchema = Yup.object().shape({
  id: Yup.string()
    .length(8, "A matrícula deve ter exatamente 8 caracteres.")
    .matches(/^\d+$/, "A matrícula deve conter apenas números")
    .required("A matrícula é obrigatória."),

  password: Yup.string()
    .required("Senha é obrigatória")
    .min(6, "Senha muito curta")
    .max(30, "Senha muito grande")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
      "A senha deve conter ao menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial."
    ),
});

export default function LoginScreen({ onLogin }) {
  return (
    <Formik
      initialValues={{ id: "", password: "" }}
      validationSchema={loginSchema}
      onSubmit={(values) => {
        onLogin(values);
      }}
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

          <Button title="Login" onPress={handleSubmit} />
        </View>
      )}
    </Formik>
  );
}
