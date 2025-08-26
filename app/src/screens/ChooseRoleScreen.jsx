import React from "react";
import { View, Button } from "react-native";

export default function ChooseRoleScreen({ navigation }) {
  return (
    <View>
      <Button
        title="Login Aluno"
        onPress={() => navigation.navigate("StudentLogin")}
      />
      <Button
        title="Login Admin"
        onPress={() => navigation.navigate("AdminLogin")}
      />
    </View>
  );
}
