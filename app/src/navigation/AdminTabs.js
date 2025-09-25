import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSelector } from "react-redux";
import { Feather } from "@expo/vector-icons";

import RegisterScreen from "../screens/admins/RegisterScreen";
import HistoryScreen from "../screens/admins/HistoryScreen";

const Tab = createBottomTabNavigator();

export default function AdminTabs() {
  const { theme, colors } = useSelector((state) => state.theme);
  const currentColors = colors[theme];

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: currentColors.header },
        headerTintColor: currentColors.text,
        tabBarStyle: { backgroundColor: currentColors.header },
        tabBarActiveTintColor: currentColors.primary,
        tabBarInactiveTintColor: currentColors.text,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Register") iconName = "user-plus";
          else if (route.name === "History") iconName = "clipboard";
          return <Feather name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Register"
        component={RegisterScreen}
        options={{ title: "Cadastrar Aluno" }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{ title: "Histórico" }}
      />
    </Tab.Navigator>
  );
}
