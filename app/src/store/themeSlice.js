import { createSlice } from "@reduxjs/toolkit";

// Cria um slice para gerenciar o tema da aplicação (claro/escuro)
const themeSlice = createSlice({
  name: "theme", // Nome do slice
  initialState: {
    theme: "light", // Tema inicial: 'light' (claro) ou 'dark' (escuro)
    colors: { // Definição das cores para cada tema
      light: {
        header: "#ffffff",
        body: "#f8f9fa",
        text: "#212529",
        accent: "#007bff",
        secondary: "#6c757d",
        success: "#28a745",
        danger: "#dc3545",
        warning: "#ffc107",
        info: "#17a2b8",
        border: "#dee2e6",
        inputBackground: "#ffffff",
        placeholderText: "#6c757d",
        cardBackground: "#ffffff",
        disabled: "#e9ecef",
      },
      dark: {
        header: "#1a1a1a",
        body: "#121212",
        text: "#e9ecef",
        accent: "#4dabf7",
        secondary: "#6c757d",
        success: "#40c057",
        danger: "#fa5252",
        warning: "#fd7e14",
        info: "#22b8cf",
        border: "#495057",
        inputBackground: "#2a2a2a",
        placeholderText: "#adb5bd",
        cardBackground: "#1e1e1e",
        disabled: "#495057",
      },
    },
  },
  reducers: {
    // Reducer para alternar entre os temas claro e escuro
    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
    },
    // Reducer para definir um tema específico
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
  },
});

// Exporta as ações geradas pelo slice
export const { toggleTheme, setTheme } = themeSlice.actions;
// Exporta o reducer do slice
export default themeSlice.reducer;


