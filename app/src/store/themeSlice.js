import { createSlice } from "@reduxjs/toolkit";

const themeSlice = createSlice({
  name: "theme",
  initialState: {
    theme: "light",
    colors: {
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
    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
