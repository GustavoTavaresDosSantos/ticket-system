import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../store/themeSlice";
import { Feather } from "@expo/vector-icons";

import RegisterScreen from "../screens/admins/RegisterScreen";
import ClassListScreen from "../screens/admins/ClassListScreen";
import { TouchableOpacity } from "react-native";

const Tab = createBottomTabNavigator();

export default function AdminTabs() {
  const dispatch = useDispatch();
  const { theme, colors } = useSelector((state) => state.theme);
  const currentColors = colors[theme];

  return (
    <Tab.Navigator
      screenOptions={({ route, navigation }) => ({
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => navigation.navigate("AdminLogin")}
            style={{
              marginLeft: 15,
              padding: 5,
            }}
          >
            <Feather name="arrow-left" size={24} color={currentColors.text} />
          </TouchableOpacity>
        ),

        headerRight: () => (
          <TouchableOpacity
            style={{ marginRight: 15 }}
            onPress={() => dispatch(toggleTheme())}
          >
            <Feather
              name={theme === "light" ? "moon" : "sun"}
              size={24}
              color={currentColors.text}
            />
          </TouchableOpacity>
        ),
        headerShown: true,
        headerStyle: { backgroundColor: currentColors.header },
        headerTintColor: currentColors.text,
        tabBarStyle: { backgroundColor: currentColors.header },
        tabBarActiveTintColor: currentColors.primary,
        tabBarInactiveTintColor: currentColors.text,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Register") iconName = "user-plus";
          else if (route.name === "ClassList") iconName = "clipboard";
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
        name="ClassList"
        component={ClassListScreen}
        options={{ title: "Turmas" }}
      />
    </Tab.Navigator>
  );
}
