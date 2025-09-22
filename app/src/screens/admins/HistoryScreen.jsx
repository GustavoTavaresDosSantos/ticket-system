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
import { useSelector } from "react-redux";

export default function HistoryScreen() {
  const navigation = useNavigation();
  const { theme, colors } = useSelector((state) => state.theme);
  const currentColors = colors[theme];

  const classArray = Object.keys(classes).map((key) => ({
    id: key,
    ...classes[key],
  }));

  const handlePress = (classId) => {
    navigation.navigate("ClassHistory", { classId });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: currentColors.cardBackground,
          borderColor: currentColors.border,
          shadowColor: theme === "dark" ? "#000" : "#000",
        },
      ]}
      onPress={() => handlePress(item.id)}
    >
      <Text style={[styles.className, { color: currentColors.text }]}>
        {item.name}
      </Text>
      <Text style={[styles.breakTime, { color: currentColors.secondary }]}>
        Intervalo: {item.breakStart} - {item.breakEnd}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: currentColors.body }]}>
      <Text style={[styles.title, { color: currentColors.text }]}>
        Turmas Registradas
      </Text>
      <FlatList
        data={classArray}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={{ marginTop: 20, color: currentColors.secondary }}>
            Nenhuma turma registrada.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 20 },
  card: {
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    borderWidth: 1,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  className: { fontSize: 18, fontWeight: "600" },
  breakTime: { fontSize: 14, marginTop: 5 },
});
