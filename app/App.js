import React from "react";
import { TouchableOpacity } from "react-native";
import { Provider, useSelector, useDispatch } from "react-redux";
import { store } from "./src/store/store";
import { toggleTheme } from "./src/store/themeSlice";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";

import ChooseRoleScreen from "./src/screens/ChooseRoleScreen";
import StudentLoginScreen from "./src/screens/students/LoginScreen";
import AdminLoginScreen from "./src/screens/admins/LoginScreen";


const Stack = createNativeStackNavigator();

function AppNavigator() {
  const dispatch = useDispatch();
  const themeState = useSelector((state) => state.theme);
  const currentTheme = themeState.theme;
  const colors = themeState.colors[currentTheme];

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.header,
            shadowColor: colors.text,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.3,
            shadowRadius: 1,
            elevation: 3,
          },
          headerTintColor: colors.text,
          contentStyle: { backgroundColor: colors.body },
          headerRight: () => (
            <TouchableOpacity
              style={{ marginRight: 15 }}
              onPress={() => dispatch(toggleTheme())}
            >
              <Feather
                name={currentTheme === "light" ? "moon" : "sun"}
                size={24}
                color={colors.text}
              />
            </TouchableOpacity>
          ),
        }}
      >
        <Stack.Screen
          name="ChooseRole"
          component={ChooseRoleScreen}
          options={{ title: "Escolher Função" }}
        />
        <Stack.Screen
          name="StudentLogin"
          component={StudentLoginScreen}
          options={{ title: "Login Aluno" }}
        />
        <Stack.Screen
          name="AdminLogin"
          component={AdminLoginScreen}
          options={{ title: "Login Admin" }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
}
