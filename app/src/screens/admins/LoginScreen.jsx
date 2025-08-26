import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import CustomText from "../../components/CustomText";
import { useSelector } from "react-redux";

export default function AdminLoginScreen({ navigation }) {
  const theme = useSelector((state) => state.theme.theme);
  const isDark = theme === "dark";

  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    console.log(`Admin logando: ${user}`);
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? "#121212" : "#f9f9f9" },
      ]}
    >
      <CustomText style={styles.title}>Login Admin</CustomText>

      <CustomInput placeholder="Usuário" value={user} onChangeText={setUser} />
      <CustomInput
        placeholder="Senha"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <CustomButton title="Entrar" onPress={handleLogin} />
      <CustomButton
        title="Cadastrar"
        onPress={() => navigation.navigate("RegisterScreen")}
      />
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
