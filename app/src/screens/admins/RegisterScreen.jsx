import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import CustomText from "../../components/CustomText";
import { useSelector } from "react-redux";

export default function RegisterScreen({ navigation }) {
  const theme = useSelector((state) => state.theme.theme);
  const isDark = theme === "dark";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {
    console.log(`Cadastro: ${name}, ${email}`);
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? "#121212" : "#f9f9f9" },
      ]}
    >
      <CustomText style={styles.title}>Cadastro</CustomText>

      <CustomInput placeholder="Nome" value={name} onChangeText={setName} />
      <CustomInput
        placeholder="E-mail"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <CustomInput
        placeholder="Senha"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <CustomButton title="Cadastrar" onPress={handleRegister} />
      <CustomButton title="Voltar" onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
});
