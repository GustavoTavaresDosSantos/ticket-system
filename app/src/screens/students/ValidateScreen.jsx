import React, { useState } from "react";
import { View, StyleSheet, Alert, Animated, Dimensions } from "react-native";
import { useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import CustomText from "../../components/CustomText";
import CustomButton from "../../components/CustomButton";
import { classes } from "../../utils/timeAndConstants";

const { width } = Dimensions.get("window");

export default function ValidateScreen({ navigation, route }) {
  const themeState = useSelector((state) => state.theme);
  const currentTheme = themeState.theme;
  const colors = themeState.colors[currentTheme];

  const { student } = route.params;
  const classInfo = classes[student.class];

  const [ticketTorn, setTicketTorn] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(1));

  const handleTearTicket = () => {
    Alert.alert(
      "Confirmar",
      "Deseja rasgar o ticket? Essa ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Rasgar Ticket",
          style: "destructive",
          onPress: async () => {
            setTicketTorn(true);

            // salva no AsyncStorage que o ticket foi usado hoje
            const today = new Date().toISOString().split("T")[0];
            await AsyncStorage.setItem(`ticketRedeemDate_${student.id}`, today);

            Animated.timing(fadeAnim, {
              toValue: 0,
              duration: 1000,
              useNativeDriver: true,
            }).start(() => {
              setTimeout(() => {
                navigation.reset({
                  index: 0,
                  routes: [{ name: "HomeScreen", params: { student } }],
                });
              }, 500);
            });
          },
        },
      ]
    );
  };

  const generateTicketNumber = () => {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
    const randomNum = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    return `TK${dateStr}${randomNum}`;
  };

  const ticketNumber = generateTicketNumber();

  if (ticketTorn) {
    return (
      <View style={[styles.container, { backgroundColor: colors.body }]}>
        <Animated.View
          style={[styles.tornTicketContainer, { opacity: fadeAnim }]}
        >
          <View style={[styles.tornTicket, { backgroundColor: colors.danger }]}>
            <CustomText
              style={[styles.tornText, { color: colors.cardBackground }]}
            >
              🎫 TICKET RASGADO
            </CustomText>
            <CustomText
              style={[styles.tornSubtext, { color: colors.cardBackground }]}
            >
              Lanche liberado!
            </CustomText>
          </View>
        </Animated.View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.body }]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <CustomText style={[styles.title, { color: colors.text }]}>
            Ticket de Lanche
          </CustomText>
          <CustomText style={[styles.subtitle, { color: colors.secondary }]}>
            Apresente este ticket ao atendente
          </CustomText>
        </View>

        <View style={styles.ticketContainer}>
          <LinearGradient
            colors={
              currentTheme === "light"
                ? ["#4dabf7", "#339af0"]
                : ["#339af0", "#228be6"]
            }
            style={styles.ticket}
          >
            <View style={styles.ticketHeader}>
              <CustomText style={styles.ticketTitle}>
                🎫 TICKET VÁLIDO
              </CustomText>
              <CustomText style={styles.ticketNumber}>
                #{ticketNumber}
              </CustomText>
            </View>

            <View style={styles.ticketBody}>
              <View style={styles.ticketRow}>
                <CustomText style={styles.ticketLabel}>Aluno:</CustomText>
                <CustomText style={styles.ticketValue}>
                  {student.name}
                </CustomText>
              </View>
              <View style={styles.ticketRow}>
                <CustomText style={styles.ticketLabel}>Matrícula:</CustomText>
                <CustomText style={styles.ticketValue}>{student.id}</CustomText>
              </View>
              <View style={styles.ticketRow}>
                <CustomText style={styles.ticketLabel}>Turma:</CustomText>
                <CustomText style={styles.ticketValue}>
                  {classInfo.name}
                </CustomText>
              </View>
              <View style={styles.ticketRow}>
                <CustomText style={styles.ticketLabel}>Recreio:</CustomText>
                <CustomText style={styles.ticketValue}>
                  {classInfo.breakStart} às {classInfo.breakEnd}
                </CustomText>
              </View>
              <View style={styles.ticketRow}>
                <CustomText style={styles.ticketLabel}>Data:</CustomText>
                <CustomText style={styles.ticketValue}>
                  {new Date().toLocaleDateString("pt-BR")}
                </CustomText>
              </View>
            </View>

            <View style={styles.ticketFooter}>
              <CustomText style={styles.ticketFooterText}>
                ✓ Válido para um lanche
              </CustomText>
            </View>
            <View style={styles.perforationLeft} />
            <View style={styles.perforationRight} />
          </LinearGradient>
        </View>

        <View style={styles.instructionContainer}>
          <CustomText
            style={[styles.instructionText, { color: colors.secondary }]}
          >
            Aguarde o atendente rasgar este ticket
          </CustomText>
        </View>

        <View style={styles.buttonContainer}>
          <CustomButton
            title="🗂️ Rasgar Ticket (Atendente)"
            onPress={handleTearTicket}
            style={[styles.tearButton, { backgroundColor: colors.danger }]}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  header: { alignItems: "center", marginBottom: 32 },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 8 },
  subtitle: { fontSize: 16, opacity: 0.8 },
  ticketContainer: { alignItems: "center", marginBottom: 32 },
  ticket: {
    width: width * 0.85,
    borderRadius: 16,
    padding: 24,
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  ticketHeader: {
    alignItems: "center",
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: "rgba(255,255,255,0.3)",
    paddingBottom: 16,
  },
  ticketTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
  },
  ticketNumber: {
    fontSize: 16,
    color: "#fff",
    opacity: 0.9,
    fontFamily: "monospace",
  },
  ticketBody: { marginBottom: 20 },
  ticketRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  ticketLabel: {
    fontSize: 16,
    color: "#fff",
    opacity: 0.8,
    fontWeight: "600",
  },
  ticketValue: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "700",
    marginLeft: 16,
    flex: 1,
    textAlign: "right",
  },
  ticketFooter: {
    alignItems: "center",
    borderTopWidth: 2,
    borderTopColor: "rgba(255,255,255,0.3)",
    paddingTop: 16,
  },
  ticketFooterText: { fontSize: 18, color: "#fff", fontWeight: "600" },
  perforationLeft: {
    position: "absolute",
    left: -12,
    top: "50%",
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.3)",
  },
  perforationRight: {
    position: "absolute",
    right: -12,
    top: "50%",
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.3)",
  },
  instructionContainer: { marginBottom: 24 },
  instructionText: { fontSize: 14, textAlign: "center" },
  buttonContainer: { marginTop: 16, width: "100%" },
  tearButton: { marginTop: 12 },
  tornTicketContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tornTicket: {
    padding: 24,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: "center",
  },
  tornText: { fontSize: 22, fontWeight: "700", marginBottom: 8 },
  tornSubtext: { fontSize: 16 },
});
