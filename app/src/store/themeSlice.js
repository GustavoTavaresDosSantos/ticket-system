import { createSlice } from "@reduxjs/toolkit";

const themeSlice = createSlice({
  name: "theme",
  initialState: {
    theme: "light",
    colors: {
      light: {
        header: "#ffffff",
        body: "#f2f2f2",
        text: "#000000",
        accent: "#007bff",
      },
      dark: {
        header: "#121212",
        body: "#1E1E1E",
        text: "#ffffff",
        accent: "#4da6ff",
      },
    },
  },
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
    },
  },
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
