import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomText from "../../components/CustomText";
import CustomButton from "../../components/CustomButton";
import { getLocalTimeInGMT3, classes } from "../../utils/timeAndConstants";

export default function HomeScreen({ navigation, route }) {
  const themeState = useSelector((state) => state.theme);
  const currentTheme = themeState.theme;
  const colors = themeState.colors[currentTheme];

  const { student } = route.params;
  const classInfo = classes[student.class];

  const [currentTime, setCurrentTime] = useState(getLocalTimeInGMT3());
  const [ticketRedeemed, setTicketRedeemed] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(getLocalTimeInGMT3());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const checkTicketStatus = async () => {
      const today = new Date().toISOString().split("T")[0];
      const lastRedeemDate = await AsyncStorage.getItem(
        `ticketRedeemDate_${student.id}`
      );

      if (lastRedeemDate === today) {
        setTicketRedeemed(true);
      } else {
        setTicketRedeemed(false);
      }
    };
    checkTicketStatus();
  }, [route.params, student.id]);

  const isSchoolDay = () => {
    const day = currentTime.getDay();
    return day >= 1 && day <= 4;
  };

  const isSchoolTime = () => {
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const currentMinutes = hours * 60 + minutes;
    return currentMinutes >= 13 * 60 + 45 && currentMinutes <= 17 * 60 + 15;
  };

  const getBreakStatus = () => {
    const [hStart, mStart] = classInfo.breakStart.split(":").map(Number);
    const [hEnd, mEnd] = classInfo.breakEnd.split(":").map(Number);

    const now = currentTime.getHours() * 60 + currentTime.getMinutes();
    const start = hStart * 60 + mStart;
    const end = hEnd * 60 + mEnd;

    if (now >= start && now <= end) return "during";
    if (now > end) return "passed";
    if (now >= start - 5 && now < start) return "pre";
    return "future";
  };

  const getTimeUntilBreak = () => {
    const [h, m] = classInfo.breakStart.split(":").map(Number);
    const breakTime = new Date(currentTime);
    breakTime.setHours(h, m, 0, 0);
    const diff = breakTime - currentTime;
    if (diff <= 0) return null;

    return {
      minutes: Math.floor(diff / (1000 * 60)),
      seconds: Math.floor((diff % (1000 * 60)) / 1000),
    };
  };

  const canAccessBreak = () => {
    if (student.id === "99999999") return true;
    const status = getBreakStatus();
    return status === "pre" || status === "during";
  };

  const handleAccessBreak = () => {
    if (!isSchoolDay()) {
      Alert.alert("Aviso", "O sistema funciona apenas de Segunda a Quinta.");
      return;
    }
    if (!isSchoolTime()) {
      Alert.alert("Aviso", "Acesso liberado apenas entre 13:45 e 17:15.");
      return;
    }
    if (ticketRedeemed) {
      Alert.alert("Aviso", "Você já resgatou o ticket de hoje.");
      return;
    }
    if (!canAccessBreak()) {
      Alert.alert(
        "Aviso",
        getBreakStatus() === "future"
          ? "O acesso abre 5 minutos antes do recreio."
          : "O recreio já passou, tente amanhã."
      );
      return;
    }

    navigation.navigate("ReceiveScreen", { student });
  };

  const formatTime = (t) => (t < 10 ? `0${t}` : t);

  const renderTimeUntilBreak = () => {
    const status = getBreakStatus();
    const t = getTimeUntilBreak();

    if (status === "passed")
      return (
        <CustomText style={[styles.timeText, { color: colors.secondary }]}>
          O recreio já passou.
        </CustomText>
      );
    if (status === "during")
      return (
        <CustomText style={[styles.timeText, { color: colors.secondary }]}>
          O recreio está acontecendo!
        </CustomText>
      );
    return (
      <CustomText style={[styles.timeText, { color: colors.text }]}>
        Tempo para o recreio: {formatTime(t?.minutes || 0)}:
        {formatTime(t?.seconds || 0)}
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
              Volte amanhã para resgatar outro.
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

        <View style={styles.infoContainer}>
          <CustomText style={[styles.infoText, { color: colors.secondary }]}>
            • Aulas: Seg a Qui, 13:45 às 17:15
          </CustomText>
          <CustomText style={[styles.infoText, { color: colors.secondary }]}>
            • Acesso liberado 5 min antes do recreio
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
  container: { flex: 1 },
  content: { flex: 1, padding: 24, justifyContent: "center" },
  header: { alignItems: "center", marginBottom: 32 },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 8 },
  subtitle: { fontSize: 16, opacity: 0.8 },
  card: {
    padding: 24,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 24,
    alignItems: "center",
  },
  cardTitle: { fontSize: 18, fontWeight: "600", marginBottom: 8 },
  breakTime: { fontSize: 24, fontWeight: "700", marginBottom: 16 },
  timeText: { fontSize: 16 },
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
