import React, { useState } from "react";
import { View, StyleSheet, Alert, ScrollView } from "react-native";
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import CustomText from "../../components/CustomText";
import { useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RegisterScreen({ navigation }) {
  const theme = useSelector((state) => state.theme.theme);
  const colors = useSelector((state) => state.theme.colors[theme]);

  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    if (!name || !id || !password) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }

    try {
      const usersJSON = await AsyncStorage.getItem("users");
      const users = usersJSON ? JSON.parse(usersJSON) : [];

      // Checa se matrícula já existe
      if (users.some((user) => user.id === id)) {
        Alert.alert("Erro", "Matrícula já cadastrada");
        return;
      }

      // Adiciona novo aluno
      const newUser = {
        id,
        password,
        role: "student",
        name,
        class: "DS-V1", // Pode mudar conforme necessidade
      };

      users.push(newUser);
      await AsyncStorage.setItem("users", JSON.stringify(users));

      Alert.alert("Sucesso", "Aluno cadastrado com sucesso!");
      setName("");
      setId("");
      setPassword("");
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Falha ao cadastrar o aluno");
    }
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: colors.body },
      ]}
    >
      <CustomText style={[styles.title, { color: colors.text }]}>
        Cadastro de Aluno
      </CustomText>

      <CustomInput placeholder="Nome" value={name} onChangeText={setName} />
      <CustomInput
        placeholder="Matrícula"
        value={id}
        onChangeText={setId}
        keyboardType="number-pad"
      />
      <CustomInput
        placeholder="Senha"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <View style={styles.buttonContainer}>
        <CustomButton title="Cadastrar" onPress={handleRegister} />
      </View>

      <View style={styles.buttonContainer}>
        <CustomButton
          title="Voltar"
          onPress={() => navigation.goBack()}
          variant="secondary"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 24,
  },
  buttonContainer: {
    marginTop: 16,
  },
});
