import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { useSelector } from "react-redux";
import CustomText from "../../components/CustomText";
import CustomButton from "../../components/CustomButton";
import { getLocalTimeInGMT3, classes } from "../../utils/timeAndConstants";

// Componente da tela inicial do aluno
export default function HomeScreen({ navigation, route }) {
  // Obtém o estado do tema e as cores do Redux store
  const themeState = useSelector((state) => state.theme);
  const currentTheme = themeState.theme;
  const colors = themeState.colors[currentTheme];

  // Obtém informações do aluno e da turma a partir dos parâmetros da rota
  const { student } = route.params;
  const classInfo = classes[student.class];

  // Estados para gerenciar o tempo atual e o status do ticket
  const [currentTime, setCurrentTime] = useState(getLocalTimeInGMT3());
  const [ticketRedeemed, setTicketRedeemed] = useState(false);

  // Efeito para atualizar o tempo a cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(getLocalTimeInGMT3());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Efeito para verificar se o ticket foi resgatado (vindo de outra tela)
  useEffect(() => {
    if (route.params?.ticketRedeemed) {
      setTicketRedeemed(true);
    }
  }, [route.params]);

  // Verifica se é um dia de aula (Segunda a Quinta)
  const isSchoolDay = () => {
    const day = currentTime.getDay();
    return day >= 1 && day <= 4;
  };

  // Verifica se está dentro do horário de aula
  const isSchoolTime = () => {
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const currentMinutes = hours * 60 + minutes;

    const startTime = 13 * 60 + 45;
    const endTime = 17 * 60 + 15;

    return currentMinutes >= startTime && currentMinutes <= endTime;
  };

  // Obtém o status do recreio (durante, passou, pré, futuro)
  const getBreakStatus = () => {
    const [breakStartHour, breakStartMinute] = classInfo.breakStart
      .split(":")
      .map(Number);
    const [breakEndHour, breakEndMinute] = classInfo.breakEnd
      .split(":")
      .map(Number);

    const currentMinutes =
      currentTime.getHours() * 60 + currentTime.getMinutes();
    const breakStartMinutes = breakStartHour * 60 + breakStartMinute;
    const breakEndMinutes = breakEndHour * 60 + breakEndMinute;

    if (
      currentMinutes >= breakStartMinutes &&
      currentMinutes <= breakEndMinutes
    ) {
      return "during"; // Durante o recreio
    } else if (currentMinutes > breakEndMinutes) {
      return "passed"; // Recreio já passou
    } else if (
      currentMinutes >= breakStartMinutes - 5 &&
      currentMinutes < breakStartMinutes
    ) {
      return "pre"; // 5 minutos antes do recreio
    } else {
      return "future"; // Recreio no futuro
    }
  };

  // Calcula o tempo restante até o início do recreio
  const getTimeUntilBreak = () => {
    const [breakHour, breakMinute] = classInfo.breakStart
      .split(":")
      .map(Number);
    const breakTime = new Date(currentTime);
    breakTime.setHours(breakHour, breakMinute, 0, 0);

    const timeDiff = breakTime.getTime() - currentTime.getTime();

    if (timeDiff <= 0) return null;

    const minutes = Math.floor(timeDiff / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    return { minutes, seconds };
  };

  // Verifica se o aluno pode acessar o recreio
  const canAccessBreak = () => {
    if (student.id === "99999999") return true; // Usuário de teste sempre pode acessar
    const status = getBreakStatus();
    return status === "pre" || status === "during";
  };

  // Lida com o acesso ao recreio, exibindo alertas se as condições não forem atendidas
  const handleAccessBreak = () => {
    if (!isSchoolDay()) {
      Alert.alert(
        "Aviso",
        "Lembre-se: o sistema de tickets funciona apenas de Segunda a Quinta-feira. Volte em um dia de aula!"
      );
      return;
    }

    if (!isSchoolTime()) {
      Alert.alert(
        "Aviso",
        "Atenção: o acesso ao sistema é permitido apenas durante o horário de aula (13:45 às 17:15)."
      );
      return;
    }

    if (ticketRedeemed) {
      Alert.alert("Aviso", "Seu ticket de hoje já foi resgatado. Que tal voltar amanhã para um novo?");
      return;
    }

    const breakStatus = getBreakStatus();
    if (!canAccessBreak()) {
      Alert.alert(
        "Aviso",
        breakStatus === "future"
          ? "Fique atento! O acesso ao sistema é liberado apenas 5 minutos antes ou durante o recreio."
          : "O recreio já passou. Você não pode mais acessar o sistema hoje."
      );
      return;
    }

    // Navega para a tela de recebimento do ticket
    navigation.navigate("ReceiveScreen", { student });
  };

  // Formata o tempo para exibir com dois dígitos (ex: 05, 12)
  const formatTime = (time) => (time < 10 ? `0${time}` : time);

  // Renderiza o tempo restante até o recreio ou o status do recreio
  const renderTimeUntilBreak = () => {
    const status = getBreakStatus();
    const timeUntil = getTimeUntilBreak();

    if (status === "passed") {
      return (
        <CustomText style={[styles.timeText, { color: colors.secondary }]}>
          O recreio já passou.
        </CustomText>
      );
    } else if (status === "during") {
      return (
        <CustomText style={[styles.timeText, { color: colors.secondary }]}>
          O recreio está acontecendo!
        </CustomText>
      );
    } else if (status === "pre" || status === "future") {
      return (
        <CustomText style={[styles.timeText, { color: colors.text }]}>
          Tempo para o recreio: {formatTime(timeUntil?.minutes || 0)}:
          {formatTime(timeUntil?.seconds || 0)}
        </CustomText>
      );
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.body }]}>
      <View style={styles.content}>
        <View style={styles.header}>
          {/* Saudação ao aluno */}
          <CustomText style={[styles.title, { color: colors.text }]}>
            Bem-vindo, {student.name}!
          </CustomText>
          {/* Nome da turma do aluno */}
          <CustomText style={[styles.subtitle, { color: colors.secondary }]}>
            {classInfo.name}
          </CustomText>
        </View>

        {/* Cartão de informações do recreio */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.cardBackground,
              borderColor: colors.border,
            },
          ]}
        >
          <CustomText style={[styles.cardTitle, { color: colors.text }]}>
            Horário do Recreio
          </CustomText>
          <CustomText style={[styles.breakTime, { color: colors.accent }]}>
            {classInfo.breakStart} às {classInfo.breakEnd}
          </CustomText>
          {renderTimeUntilBreak()}
        </View>

        {/* Exibe status do ticket ou botão de acesso ao recreio */}
        {ticketRedeemed ? (
          <View
            style={[
              styles.redeemedCard,
              { backgroundColor: colors.success, borderColor: colors.success },
            ]}
          >
            <CustomText
              style={[styles.redeemedText, { color: colors.cardBackground }]}
            >
              ✓ Ticket já resgatado hoje!
            </CustomText>
            <CustomText
              style={[styles.redeemedSubtext, { color: colors.cardBackground }]}
            >
              Volte amanhã para resgatar um novo ticket
            </CustomText>
          </View>
        ) : (
          <View style={styles.buttonContainer}>
            <CustomButton
              title={canAccessBreak() ? "Acessar Recreio" : "Aguarde o Horário"}
              onPress={handleAccessBreak}
              disabled={!canAccessBreak()}
            />
          </View>
        )}

        {/* Informações adicionais sobre o sistema */}
        <View style={styles.infoContainer}>
          <CustomText style={[styles.infoText, { color: colors.secondary }]}>
            • Aulas: Segunda a Quinta, 13:45 às 17:15
          </CustomText>
          <CustomText style={[styles.infoText, { color: colors.secondary }]}>
            • Acesso liberado 5 minutos antes do recreio
          </CustomText>
          <CustomText style={[styles.infoText, { color: colors.secondary }]}>
            • Um ticket por dia
          </CustomText>
        </View>
      </View>
    </View>
  );
}

// Estilos para o componente HomeScreen
const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, padding: 24, justifyContent: "center" },
  header: { alignItems: "center", marginBottom: 32 },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: { fontSize: 16, textAlign: "center", opacity: 0.8 },
  card: {
    padding: 24,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 24,
    alignItems: "center",
  },
  cardTitle: { fontSize: 18, fontWeight: "600", marginBottom: 8 },
  breakTime: { fontSize: 24, fontWeight: "700", marginBottom: 16 },
  timeText: { fontSize: 16, textAlign: "center" },
  redeemedCard: {
    padding: 24,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 24,
    alignItems: "center",
  },
  redeemedText: { fontSize: 18, fontWeight: "600", marginBottom: 8 },
  redeemedSubtext: { fontSize: 14, textAlign: "center" },
  buttonContainer: { marginBottom: 24 },
  infoContainer: { marginTop: 16 },
  infoText: { fontSize: 14, marginBottom: 4, textAlign: "center" },
});


