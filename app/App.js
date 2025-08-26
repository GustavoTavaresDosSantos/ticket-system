import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Provider } from "react-redux";
import { store } from "./src/store/store";

import ChooseRoleScreen from "./src/screens/ChooseRoleScreen";
import StudentLoginScreen from "./src/screens/students/LoginScreen";
import AdminLoginScreen from "./src/screens/admins/LoginScreen";
import RegisterScreen from "./src/screens/admins/RegisterScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="ChooseRole">
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
          <Stack.Screen
            name="RegisterScreen"
            component={RegisterScreen}
            options={{ title: "Cadastro" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
