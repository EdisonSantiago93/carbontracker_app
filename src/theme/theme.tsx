import { MD3LightTheme } from "react-native-paper";

export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#65C879",       // Verde principal
    secondary: "#3A7D44",     // Verde más oscuro (complemento)
    background: "#F6F9F6",    // Fondo general
    surface: "#FFFFFF",       // Superficies (cards, modales)
    accent: "#FFD700",        // Detalles dorados o iconos activos
    text: "#2D2D2D",          // Texto principal
    textSecondary: "#6E6E6E", // Texto secundario
    error: "#E53935",         // Errores o alertas
    success: "#4CAF50",       // Confirmaciones o éxito
    outline: "#D8EAD8",       // Bordes o separadores suaves
  },
  roundness: 10,
  fonts: {
    ...MD3LightTheme.fonts,
    bodyMedium: { fontFamily: "Roboto", fontWeight: "400" },
    titleMedium: { fontFamily: "Roboto", fontWeight: "500" },
    headlineMedium: { fontFamily: "Roboto", fontWeight: "700" },
  },
};
