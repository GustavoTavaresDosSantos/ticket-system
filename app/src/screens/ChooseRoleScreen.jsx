import React from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import CustomButton from "../components/CustomButton";
import CustomText from "../components/CustomText";
import { useSelector } from "react-redux";

// Componente da tela de escolha de perfil (Aluno/Administrador)
export default function ChooseRoleScreen({ navigation }) {
  // Obtém o estado do tema e as cores do Redux store
  const themeState = useSelector((state) => state.theme);
  const currentTheme = themeState.theme;
  const colors = themeState.colors[currentTheme];

  // Função para navegar para a tela de login do aluno
  const handleStudentLogin = () => {
    navigation.navigate("StudentLogin");
  };

  // Função para navegar para a tela de login do administrador
  const handleAdminLogin = () => {
    navigation.navigate("AdminLogin");
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.body }]}>
      <View style={styles.content}>
        <View style={styles.header}>
          {/* Título principal da tela */}
          <CustomText style={[styles.title, { color: colors.text }]}>
            Bem-vindo ao Sistema de Tickets
          </CustomText>
          {/* Subtítulo da tela */}
          <CustomText style={[styles.subtitle, { color: colors.secondary }]}>
            Escolha seu perfil para continuar
          </CustomText>
        </View>

        <View style={styles.buttonContainer}>
          {/* Cartão para o perfil de Estudante */}
          <View style={styles.roleCard}>
            <CustomText style={[styles.roleTitle, { color: colors.text }]}>
              Estudante
            </CustomText>
            <CustomText
              style={[styles.roleDescription, { color: colors.secondary }]}
            >
              Abra e acompanhe seus tickets de suporte
            </CustomText>
            <CustomButton
              title="Acessar como Aluno"
              onPress={handleStudentLogin}
              variant="primary"
            />
          </View>

          {/* Cartão para o perfil de Administrador */}
          <View style={styles.roleCard}>
            <CustomText style={[styles.roleTitle, { color: colors.text }]}>
              Administrador
            </CustomText>
            <CustomText
              style={[styles.roleDescription, { color: colors.secondary }]}
            >
              Gerencie tickets e usuários do sistema
            </CustomText>
            <CustomButton
              title="Acessar como Administrador"
              onPress={handleAdminLogin}
              variant="secondary"
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

// Estilos para o componente ChooseRoleScreen
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    opacity: 0.8,
  },
  buttonContainer: {
    gap: 24,
  },
  roleCard: {
    padding: 24,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  roleTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  roleDescription: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 20,
  },
});


