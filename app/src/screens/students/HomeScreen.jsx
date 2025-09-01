import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import CustomText from "../../components/CustomText";
import CustomButton from "../../components/CustomButton";

export default function HomeScreen({ navigation, route }) {
  const themeState = useSelector((state) => state.theme);
  const currentTheme = themeState.theme;
  const colors = themeState.colors[currentTheme];

  const { student } = route.params; // Recebe os dados do aluno

  const getLocalTimeInGMT3 = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60 * 1000; // offset em milissegundos
    const gmt3Offset = -3 * 60 * 60 * 1000; // GMT-3 em milissegundos
    const gmt3Time = new Date(now.getTime() + offset + gmt3Offset);
    return gmt3Time;
  };

  const [currentTime, setCurrentTime] = useState(getLocalTimeInGMT3());
  const [ticketRedeemed, setTicketRedeemed] = useState(false);

  // Dados das turmas e horários de recreio
  const classes = {
    "DS-V1": {
      name: "Desenvolvimento de Sistemas/V1",
      breakStart: "15:00",
      breakEnd: "15:15",
    },
    "DS-V2": {
      name: "Desenvolvimento de Sistemas/V2",
      breakStart: "15:30",
      breakEnd: "15:45",
    },
    "MA-V1": {
      name: "Mecânica Automotiva/V1",
      breakStart: "16:00",
      breakEnd: "16:15",
    },
  };

  const classInfo = classes[student.class]; // Usa a turma do aluno logado

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(getLocalTimeInGMT3());
    }, 1000);

    // Verificar se o ticket já foi resgatado hoje
    checkTicketStatus();

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Verificar se o ticket foi resgatado (vindo da ValidateScreen)
    if (route.params?.ticketRedeemed) {
      setTicketRedeemed(true);
    }
  }, [route.params]);

  const checkTicketStatus = () => {
    // Aqui você pode implementar a lógica para verificar se o ticket já foi resgatado hoje
    // Por enquanto, vamos deixar como false
    setTicketRedeemed(false);
  };

  const isSchoolDay = () => {
    const day = currentTime.getDay();
    return day >= 1 && day <= 4; // Segunda a Quinta (1-4)
  };

  const isSchoolTime = () => {
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const currentMinutes = hours * 60 + minutes;

    // Aulas das 13:45 às 17:15
    const startTime = 13 * 60 + 45; // 13:45
    const endTime = 17 * 60 + 15; // 17:15

    return currentMinutes >= startTime && currentMinutes <= endTime;
  };

  const getTimeUntilBreak = () => {
    const [breakHour, breakMinute] = classInfo.breakStart
      .split(":")
      .map(Number);
    const breakTime = new Date(currentTime);
    breakTime.setHours(breakHour, breakMinute, 0, 0);

    const timeDiff = breakTime.getTime() - currentTime.getTime();

    if (timeDiff <= 0) {
      return null; // Recreio já passou ou está acontecendo
    }

    const minutes = Math.floor(timeDiff / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    return { minutes, seconds };
  };

  const canAccessBreak = () => {
    const timeUntil = getTimeUntilBreak();
    return timeUntil && timeUntil.minutes <= 5; // 5 minutos antes do recreio
  };

  const handleAccessBreak = () => {
    if (!isSchoolDay()) {
      Alert.alert(
        "Aviso",
        "Só é possível acessar o sistema durante os dias de aula (Segunda a Quinta)."
      );
      return;
    }

    if (!isSchoolTime()) {
      Alert.alert(
        "Aviso",
        "Só é possível acessar o sistema durante o horário de aula (13:45 às 17:15)."
      );
      return;
    }

    if (ticketRedeemed) {
      Alert.alert("Aviso", "Você já resgatou seu ticket hoje. Volte amanhã!");
      return;
    }

    if (!canAccessBreak()) {
      Alert.alert(
        "Aviso",
        "Você só pode acessar o sistema 5 minutos antes do recreio."
      );
      return;
    }

    navigation.navigate("ReceiveScreen", { student: student });
  };

  const formatTime = (time) => {
    return time < 10 ? `0${time}` : time;
  };

  const renderTimeUntilBreak = () => {
    const timeUntil = getTimeUntilBreak();

    if (!timeUntil) {
      return (
        <CustomText style={[styles.timeText, { color: colors.secondary }]}>
          O recreio já passou ou está acontecendo
        </CustomText>
      );
    }

    return (
      <CustomText style={[styles.timeText, { color: colors.text }]}>
        Tempo para o recreio: {formatTime(timeUntil.minutes)}:
        {formatTime(timeUntil.seconds)}
      </CustomText>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.body }]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <CustomText style={[styles.title, { color: colors.text }]}>
            Bem-vindo, {student.name}!
          </CustomText>
          <CustomText style={[styles.subtitle, { color: colors.secondary }]}>
            {classInfo.name}
          </CustomText>
        </View>

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
              disabled={!canAccessBreak() || !isSchoolDay() || !isSchoolTime()}
            />
          </View>
        )}

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    opacity: 0.8,
  },
  card: {
    padding: 24,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 24,
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  breakTime: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 16,
  },
  timeText: {
    fontSize: 16,
    textAlign: "center",
  },
  redeemedCard: {
    padding: 24,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 24,
    alignItems: "center",
  },
  redeemedText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  redeemedSubtext: {
    fontSize: 14,
    textAlign: "center",
  },
  buttonContainer: {
    marginBottom: 24,
  },
  infoContainer: {
    marginTop: 16,
  },
  infoText: {
    fontSize: 14,
    marginBottom: 4,
    textAlign: "center",
  },
});
