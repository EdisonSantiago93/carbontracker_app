import { StyleSheet } from 'react-native';
import { globalStyles } from '../../../../theme/globalStyles';

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
