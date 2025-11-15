import { StyleSheet } from "react-native";
import { globalStyles } from "../../theme/globalStyles";
import { theme } from "../../theme/theme.tsx";

export const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 32,
    backgroundColor: theme.colors.background,
  },
  centered: {
    alignItems: "center",
    paddingHorizontal: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  logo: {
    width: 140,
    height: 140,
    marginBottom: 16,
  },
  welcomeText: {
    ...globalStyles.title,
  },
  subtitleText: {
    ...globalStyles.subtitle,
    textAlign: "center",
  },
  divider: {
    ...globalStyles.divider,
  },
  dividerLine: {
    ...globalStyles.dividerLine,
  },
  dividerText: {
    ...globalStyles.dividerText,
  },
  loginButton: {
    width: "100%",
    borderRadius: theme.roundness,
    borderColor: theme.colors.primary,
    borderWidth: 1.5,
  },
  loginButtonText: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: "600",
  },
  snackbar: {
    backgroundColor: "#333",
  },
});
