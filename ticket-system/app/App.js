import React, { useEffect } from "react";
import { TouchableOpacity } from "react-native";
import { Provider, useSelector, useDispatch } from "react-redux";
import { store } from "./src/store/store";
import { toggleTheme } from "./src/store/themeSlice";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import { checkAndCreateMockUsers } from "./src/utils/mockData";

// Importa as telas da aplicação
import ChooseRoleScreen from "./src/screens/ChooseRoleScreen";
import StudentLoginScreen from "./src/screens/students/LoginScreen";
import AdminLoginScreen from "./src/screens/admins/LoginScreen";
import RegisterScreen from "./src/screens/admins/RegisterScreen";
import HomeScreen from "./src/screens/students/HomeScreen";
import ReceiveScreen from "./src/screens/students/ReceiveScreen";
import ValidateScreen from "./src/screens/students/ValidateScreen";
import ClassListScreen from "./src/screens/admins/ClassListScreen"; // Renomeado de HistoryScreen
import AdminTabs from "./src/navigation/AdminTabs";
import ClassHistoryScreen from "./src/screens/admins/ClassHistoryScreen";
import ForgotPasswordScreen from "./src/screens/students/ForgotPasswordScreen";

const Stack = createNativeStackNavigator();

// Componente principal de navegação da aplicação
function AppNavigator() {
  const dispatch = useDispatch();
  const themeState = useSelector((state) => state.theme);
  const currentTheme = themeState.theme;
  const colors = themeState.colors[currentTheme];

  // Efeito para verificar e criar usuários mock quando o componente é montado
  useEffect(() => {
    checkAndCreateMockUsers();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          // Estilos do cabeçalho padrão para todas as telas
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
          // Botão de alternar tema no cabeçalho
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
        {/* Telas da aplicação */}
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

        {/* AdminTabs contém as telas de Register e ClassList para administradores */}
        <Stack.Screen
          name="AdminTabs"
          component={AdminTabs}
          options={{ headerShown: false }} // Oculta o header padrão, pois AdminTabs tem seu próprio header
        />
        {/* Tela de histórico de uma turma específica */}
        <Stack.Screen
          name="ClassHistory"
          component={ClassHistoryScreen}
          options={({ navigation }) => ({
            title: "Histórico da Turma",
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{ marginLeft: 15, padding: 5 }}
              >
                <Feather name="arrow-left" size={24} color={colors.text} />
              </TouchableOpacity>
            ),
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
          })}
        />
        {/* Tela de recuperação de senha do aluno */}
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPasswordScreen}
          options={{ title: "Recuperar Senha" }}
        />

        {/* Tela de cadastro de aluno (acessível pelo Admin) */}
        <Stack.Screen
          name="RegisterScreen"
          component={RegisterScreen}
          options={({ navigation }) => ({
            title: "Cadastro de Aluno",
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => navigation.goBack()} // volta para a tela anterior
                style={{ marginLeft: 15, padding: 5 }} // mais afastado e área de toque maior
              >
                <Feather name="arrow-left" size={24} color={colors.text} />
              </TouchableOpacity>
            ),
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
          })}
        />
        {/* Tela de listagem de turmas (acessível pelo Admin) */}
        <Stack.Screen
          name="ClassListScreen"
          component={ClassListScreen}
          options={{ title: "Turmas" }}
        />

        {/* Telas do fluxo do aluno */}
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

// Componente raiz da aplicação que provê o Redux store
export default function App() {
  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
}
