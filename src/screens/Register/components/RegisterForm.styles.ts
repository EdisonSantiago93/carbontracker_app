import { StyleSheet } from "react-native";
import { globalStyles } from "../../../theme/globalStyles";
import { theme } from "../../../theme/theme";

export const styles = StyleSheet.create({
  formContainer: {
    width: "100%",
  },
  input: {
    ...globalStyles.input,
    marginBottom: 12,
  },
  termsSection: {
    width: "100%",
    marginTop: 8,
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  checkboxText: {
    flex: 1,
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    marginLeft: 8,
    marginTop: 8,
  },
  link: {
    color: theme.colors.primary,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  button: {
    ...globalStyles.button,
  },
  buttonDisabled: {
    backgroundColor: "#B0B0B0",
    elevation: 0,
  },
  buttonContent: {
    ...globalStyles.buttonContent,
  },
  buttonLabel: {
    ...globalStyles.buttonLabel,
  },
});
