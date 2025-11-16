import { globalStyles } from '@/theme/globalStyles.ts';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  formContainer: {
    width: '100%',
  },
  input: {
    ...globalStyles.input,
    marginBottom: 12,
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
});
