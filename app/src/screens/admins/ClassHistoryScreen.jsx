import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { classes } from "../../utils/timeAndConstants";
import { useFocusEffect } from "@react-navigation/native";

export default function ClassHistoryScreen({ route }) {
  const { classId } = route.params;
  const [students, setStudents] = useState([]);

  // Pega os alunos do AsyncStorage filtrando pela turma
  const loadStudents = async () => {
    try {
      const usersData = await AsyncStorage.getItem("users");
      const users = usersData ? JSON.parse(usersData) : [];
      const classStudents = users.filter(
        (user) => user.role === "student" && user.class === classId
      );

      // Verifica se cada aluno já pegou o ticket hoje
      const today = new Date().toISOString().split("T")[0];
      const studentsWithTicket = await Promise.all(
        classStudents.map(async (student) => {
          const ticketDate = await AsyncStorage.getItem(
            `ticketRedeemDate_${student.id}`
          );
          return {
            ...student,
            ticketTaken: ticketDate === today, // true se pegou hoje
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
    <View style={styles.card}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.id}>Matrícula: {item.id}</Text>
      {/* Aqui futuramente você pode adicionar colunas de tickets */}
      <Text style={styles.ticket}>
        Ticket: {item.ticketTaken ? "✅ Pegou hoje" : "—"}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{classes[classId]?.name || classId}</Text>
      <Text style={styles.subTitle}>
        Intervalo: {classes[classId]?.breakStart} - {classes[classId]?.breakEnd}
      </Text>
      <FlatList
        data={students}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={{ marginTop: 20, color: "#555" }}>
            Nenhum aluno cadastrado nesta turma.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 15 },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ddd",
    paddingVertical: 8,
  },
  headerRow: {
    backgroundColor: "#f1f1f1",
    borderBottomWidth: 2,
  },
  cell: { flex: 1, fontSize: 14, textAlign: "center" },
  headerCell: { fontWeight: "bold" },
  empty: { textAlign: "center", marginTop: 20, fontSize: 16, color: "#777" },
});
