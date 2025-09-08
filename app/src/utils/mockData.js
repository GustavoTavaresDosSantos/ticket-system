import AsyncStorage from "@react-native-async-storage/async-storage";

export const createMockUsers = async () => {
  const mockUsers = [
    {
      id: "12345678",
      password: "123456",
      role: "student",
      name: "João Silva",
      class: "DS-V1",
    },
    {
      id: "87654321",
      password: "123456",
      role: "student",
      name: "Maria Santos",
      class: "DS-V2",
    },
    {
      id: "11111111",
      password: "123456",
      role: "student",
      name: "Pedro Oliveira",
      class: "MA-V1",
    },
    {
      id: "admin123",
      password: "admin123",
      role: "admin",
      name: "Administrador",
    },
    {
      id: "99999999",
      password: "999999",
      role: "student",
      name: "Aluno Teste",
      class: "TESTE-V1",
    },
  ];

  try {
    await AsyncStorage.setItem("users", JSON.stringify(mockUsers));
    console.log("Usuários de teste criados com sucesso!");
  } catch (error) {
    console.error("Erro ao criar usuários de teste:", error);
  }
};

export const checkAndCreateMockUsers = async () => {
  try {
    const existingUsers = await AsyncStorage.getItem("users");
    if (!existingUsers) {
      await createMockUsers();
    }
  } catch (error) {
    console.error("Erro ao verificar usuários:", error);
  }
};
