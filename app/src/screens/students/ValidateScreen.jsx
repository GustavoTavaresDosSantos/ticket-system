import React, { useState } from "react";
import { View, StyleSheet, Alert, Animated, Dimensions } from "react-native";
import { useSelector } from "react-redux";
import { LinearGradient } from "expo-linear-gradient";
import CustomText from "../../components/CustomText";
import CustomButton from "../../components/CustomButton";
import { classes } from "../../utils/timeAndConstants";

const { width } = Dimensions.get("window");

// Componente da tela de validação do ticket
export default function ValidateScreen({ navigation, route }) {
  // Obtém o estado do tema e as cores do Redux store
  const themeState = useSelector((state) => state.theme);
  const currentTheme = themeState.theme;
  const colors = themeState.colors[currentTheme];

  // Obtém informações do aluno a partir dos parâmetros da rota
  const { student } = route.params;

  // Estados para controlar se o ticket foi rasgado e a animação de fade
  const [ticketTorn, setTicketTorn] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(1));

  // Obtém informações da turma do aluno
  const classInfo = classes[student.class];

  // Função para lidar com o ato de rasgar o ticket
  const handleTearTicket = () => {
    Alert.alert(
      "Confirmar",
      "Tem certeza que deseja rasgar o ticket? Esta ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Rasgar Ticket",
          style: "destructive",
          onPress: () => {
            setTicketTorn(true);

            // Animação para fazer o ticket desaparecer
            Animated.timing(fadeAnim, {
              toValue: 0,
              duration: 1000,
              useNativeDriver: true,
            }).start(() => {
              // Pequeno delay para ver a animação antes de navegar
              setTimeout(() => {
                // Redefine a navegação para a HomeScreen, marcando o ticket como resgatado
                navigation.reset({
                  index: 0,
                  routes: [
                    {
                      name: "HomeScreen",
                      params: { ticketRedeemed: true, student },
                    },
                  ],
                });
              }, 500);
            });
          },
        },
      ]
    );
  };

  // Função para gerar um número de ticket único
  const generateTicketNumber = () => {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
    const randomNum = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    return `TK${dateStr}${randomNum}`;
  };

  // Gera o número do ticket ao carregar o componente
  const ticketNumber = generateTicketNumber();

  // Renderiza a tela de ticket rasgado se o ticketTorn for verdadeiro
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
          {/* Título da tela */}
          <CustomText style={[styles.title, { color: colors.text }]}>
            Ticket de Lanche
          </CustomText>
          {/* Subtítulo da tela */}
          <CustomText style={[styles.subtitle, { color: colors.secondary }]}>
            Apresente este ticket ao atendente
          </CustomText>
        </View>

        {/* Contêiner do ticket */}
        <View style={styles.ticketContainer}>
          {/* Gradiente de fundo do ticket */}
          <LinearGradient
            colors={
              currentTheme === "light"
                ? ["#4dabf7", "#339af0"]
                : ["#339af0", "#228be6"]
            }
            style={styles.ticket}
          >
            {/* Cabeçalho do ticket */}
            <View style={styles.ticketHeader}>
              <CustomText style={styles.ticketTitle}>
                🎫 TICKET VÁLIDO
              </CustomText>
              <CustomText style={styles.ticketNumber}>
                #{ticketNumber}
              </CustomText>
            </View>

            {/* Corpo do ticket com informações do aluno */}
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

            {/* Rodapé do ticket */}
            <View style={styles.ticketFooter}>
              <CustomText style={styles.ticketFooterText}>
                ✓ Válido para um lanche
              </CustomText>
            </View>

            {/* Efeitos visuais de perfuração do ticket */}
            <View style={styles.perforationLeft} />
            <View style={styles.perforationRight} />
          </LinearGradient>
        </View>

        {/* Instruções para o atendente */}
        <View style={styles.instructionContainer}>
          <CustomText
            style={[styles.instructionText, { color: colors.secondary }]}
          >
            Aguarde o atendente rasgar este ticket para liberar seu lanche
          </CustomText>
        </View>

        {/* Botão para rasgar o ticket (apenas para o atendente) */}
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

// Estilos para o componente ValidateScreen
const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  header: { alignItems: "center", marginBottom: 32 },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: { fontSize: 16, textAlign: "center", opacity: 0.8 },
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
    color: "#ffffff",
    marginBottom: 8,
  },
  ticketNumber: {
    fontSize: 16,
    color: "#ffffff",
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
    color: "#ffffff",
    opacity: 0.8,
    fontWeight: "600",
  },
  ticketValue: {
    fontSize: 16,
    color: "#ffffff",
    fontWeight: "700",
    textAlign: "right",
    flex: 1,
    marginLeft: 16,
  },
  ticketFooter: {
    alignItems: "center",
    borderTopWidth: 2,
    borderTopColor: "rgba(255,255,255,0.3)",
    paddingTop: 16,
  },
  ticketFooterText: { fontSize: 18, color: "#ffffff", fontWeight: "600" },
  perforationLeft: {
    position: "absolute",
    left: -12,
    top: "50%",
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "transparent",
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
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.3)",
  },
  instructionContainer: { marginBottom: 24 },
  instructionText: { fontSize: 16, textAlign: "center", lineHeight: 24 },
  buttonContainer: { marginTop: 16 },
  tearButton: { backgroundColor: "#dc3545" },
  tornTicketContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tornTicket: {
    padding: 40,
    borderRadius: 16,
    alignItems: "center",
    transform: [{ rotate: "-15deg" }],
  },
  tornText: { fontSize: 32, fontWeight: "700", marginBottom: 16 },
  tornSubtext: { fontSize: 20, fontWeight: "600" },
});


