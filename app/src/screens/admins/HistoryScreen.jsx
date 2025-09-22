import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { classes } from "../../utils/timeAndConstants";

export default function HistoryScreen() {
  const navigation = useNavigation();

  const classArray = Object.keys(classes).map((key) => ({
    id: key,
    ...classes[key],
  }));

  const handlePress = (classId) => {
    navigation.navigate("ClassHistory", { classId });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => handlePress(item.id)}>
      <Text style={styles.className}>{item.name}</Text>
      <Text style={styles.breakTime}>
        Intervalo: {item.breakStart} - {item.breakEnd}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Turmas Registradas</Text>
      <FlatList
        data={classArray}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f4f4f4" },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 20 },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  className: { fontSize: 18, fontWeight: "600" },
  breakTime: { fontSize: 14, color: "#555", marginTop: 5 },
});
