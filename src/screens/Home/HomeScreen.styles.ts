import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    ...StyleSheet.absoluteFillObject, // Hace que el WebView ocupe toda la pantalla
    
  },
  noUserContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
