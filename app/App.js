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
          // Estilo do cabeçalho da navegação
          headerStyle: {
            backgroundColor: colors.header,
            shadowColor: colors.text,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.3,
            shadowRadius: 1,
            elevation: 3,
          },
          headerTintColor: colors.text, // Cor do texto do cabeçalho
          contentStyle: { backgroundColor: colors.body }, // Estilo do conteúdo da tela
          headerBackTitleVisible: false, // Oculta o título do botão de voltar
          headerTitleStyle: { fontWeight: "700" }, // Estilo do título do cabeçalho
          headerRight: () => ( // Botão de alternar tema no cabeçalho
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
        {/* Tela de escolha de perfil (Aluno/Admin) */}
        <Stack.Screen
          name="ChooseRole"
          component={ChooseRoleScreen}
          options={{ title: "Quem é você?", headerBackVisible: false }}
        />

        {/* Tela de Login do Aluno */}
        <Stack.Screen
          name="StudentLogin"
          component={StudentLoginScreen}
          options={{ title: "Acesso do Aluno" }}
        />

        {/* Tela de Login do Administrador */}
        <Stack.Screen
          name="AdminLogin"
          component={AdminLoginScreen}
          options={{ title: "Acesso do Administrador" }}
        />

        {/* Tela de Cadastro de Aluno (acessível pelo Admin) */}
        <Stack.Screen
          name="RegisterScreen"
          component={RegisterScreen}
          options={{ title: "Cadastro de Aluno" }}
        />

        {/* Tela Inicial do Aluno */}
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{ title: "Início" }}
        />

        {/* Tela de Validação de Localização para o Ticket */}
        <Stack.Screen
          name="ReceiveScreen"
          component={ReceiveScreen}
          options={{ title: "Validar Localização" }}
        />
        {/* Tela de Visualização e Validação do Ticket */}
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


