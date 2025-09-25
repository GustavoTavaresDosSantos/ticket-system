import React, { useEffect } from "react";
import { TouchableOpacity } from "react-native";
import { Provider, useSelector, useDispatch } from "react-redux";
import { store } from "./src/store/store";
import { toggleTheme } from "./src/store/themeSlice";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import { checkAndCreateMockUsers } from "./src/utils/mockData";

import ChooseRoleScreen from "./src/screens/ChooseRoleScreen";
import StudentLoginScreen from "./src/screens/students/LoginScreen";
import AdminLoginScreen from "./src/screens/admins/LoginScreen";
import RegisterScreen from "./src/screens/admins/RegisterScreen";
import HomeScreen from "./src/screens/students/HomeScreen";
import ReceiveScreen from "./src/screens/students/ReceiveScreen";
import ValidateScreen from "./src/screens/students/ValidateScreen";
import HistoryScreen from "./src/screens/admins/HistoryScreen";
import AdminTabs from "./src/navigation/AdminTabs";
import ClassHistoryScreen from "./src/screens/admins/ClassHistoryScreen";

const Stack = createNativeStackNavigator();

function AppNavigator() {
  const dispatch = useDispatch();
  const themeState = useSelector((state) => state.theme);
  const currentTheme = themeState.theme;
  const colors = themeState.colors[currentTheme];

  useEffect(() => {
    checkAndCreateMockUsers();
  }, []);

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
          headerBackTitleVisible: false,
          headerTitleStyle: { fontWeight: "700" },
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
          options={{ title: "Quem é você?", headerBackVisible: false }}
        />

        <Stack.Screen
          name="StudentLogin"
          component={StudentLoginScreen}
          options={{ title: "Acesso do Aluno" }}
        />

        <Stack.Screen
          name="AdminLogin"
          component={AdminLoginScreen}
          options={{ title: "Acesso do Administrador" }}
        />

        <Stack.Screen
          name="AdminTabs"
          component={AdminTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="ClassHistory" component={ClassHistoryScreen} />

        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{ title: "Início" }}
        />

        <Stack.Screen
          name="ReceiveScreen"
          component={ReceiveScreen}
          options={{ title: "Validar Localização" }}
        />
        <Stack.Screen
          name="ValidateScreen"
          component={ValidateScreen}
          options={{ title: "Ticket" }}
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
