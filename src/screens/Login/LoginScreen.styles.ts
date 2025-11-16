import { globalStyles } from '@/theme/globalStyles.ts';
import { theme } from '@/theme/theme.tsx';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  centered: {
    ...globalStyles.centered,
    flexGrow: 1, // Añadido para que el ScrollView ocupe todo el espacio
    paddingHorizontal: 24,
    paddingVertical: 40,
    flex: 1,
    justifyContent: 'center',
  },
    scrollContent: {
    flexGrow: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 16,
  },
  welcomeText: {
    ...globalStyles.title,
  },
  subtitleText: {
    ...globalStyles.subtitle,
  },
  formContainer: {
    width: '100%',
  },
  input: {
    ...globalStyles.input,
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginTop: -8,
    marginBottom: 8,
  },
  forgotButtonText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  button: {
    ...globalStyles.button,
  },
  buttonContent: {
    ...globalStyles.buttonContent,
  },
  buttonLabel: {
    ...globalStyles.buttonLabel,
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
  registerButton: {
    width: '100%',
    borderRadius: theme.roundness,
    borderColor: theme.colors.primary,
    borderWidth: 1.5,
  },
  registerButtonText: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  snackbar: {
    backgroundColor: '#333',
  },
});
