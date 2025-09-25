import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { classes } from "../../utils/timeAndConstants";
import { useFocusEffect } from "@react-navigation/native";
import { useSelector } from "react-redux";

export default function ClassHistoryScreen({ route }) {
  const { classId } = route.params;
  const [students, setStudents] = useState([]);

  const themeState = useSelector((state) => state.theme);
  const currentTheme = themeState.theme;
  const colors = themeState.colors[currentTheme];

  const loadStudents = async () => {
    try {
      const usersData = await AsyncStorage.getItem("users");
      const users = usersData ? JSON.parse(usersData) : [];
      const classStudents = users.filter(
        (user) => user.role === "student" && user.class === classId
      );

      const today = new Date().toISOString().split("T")[0];
      const studentsWithTicket = await Promise.all(
        classStudents.map(async (student) => {
          const ticketDate = await AsyncStorage.getItem(
            `ticketRedeemDate_${student.id}`
          );
          return {
            ...student,
            ticketTaken: ticketDate === today,
          };
        })
      );

      setStudents(studentsWithTicket);
    } catch (error) {
      console.error("Erro ao carregar alunos:", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadStudents();
    }, [])
  );

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.cardBackground, borderColor: colors.border },
      ]}
    >
      <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>
      <Text style={[styles.id, { color: colors.secondary }]}>
        Matrícula: {item.id}
      </Text>
      <Text style={[styles.ticket, { color: colors.secondary }]}>
        Ticket: {item.ticketTaken ? "✅ Pegou hoje" : "—"}
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.body }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        {classes[classId]?.name || classId}
      </Text>
      <Text style={[styles.subTitle, { color: colors.secondary }]}>
        Intervalo: {classes[classId]?.breakStart} - {classes[classId]?.breakEnd}
      </Text>
      <FlatList
        data={students}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={{ marginTop: 20, color: colors.secondary }}>
            Nenhum aluno cadastrado nesta turma.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 15 },
  card: { padding: 15, marginBottom: 10, borderRadius: 10, borderWidth: 1 },
  name: { fontSize: 16, fontWeight: "600" },
  id: { fontSize: 14, marginTop: 5 },
  ticket: { fontSize: 14, marginTop: 5 },
  subTitle: { fontSize: 14, marginBottom: 15 },
});
