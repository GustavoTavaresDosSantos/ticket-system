import React from "react";
import { View, StyleSheet } from "react-native";
import CustomButton from "../components/CustomButton";
import CustomText from "../components/CustomText";
import { useSelector } from "react-redux";

export default function ChooseRoleScreen({ navigation }) {
  const themeState = useSelector((state) => state.theme);
  const currentTheme = themeState.theme;
  const colors = themeState.colors[currentTheme];

  return (
    <View style={[styles.container, { backgroundColor: colors.body }]}>
      <CustomText style={[styles.title, { color: colors.text }]}>
        Escolha seu Perfil
      </CustomText>

      <CustomButton
        title="Login Aluno"
        onPress={() => navigation.navigate("StudentLogin")}
        color={colors.accent}
        textColor={colors.text}
      />
      <CustomButton
        title="Login Admin"
        onPress={() => navigation.navigate("AdminLogin")}
        color={colors.accent}
        textColor={colors.text}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
});
