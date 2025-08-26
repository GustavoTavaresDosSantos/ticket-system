import React from "react";
import { View, Button } from "react-native";

const ChooseRoleScreen = ({ navigation }) => {
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
};

export default ChooseRoleScreen;
