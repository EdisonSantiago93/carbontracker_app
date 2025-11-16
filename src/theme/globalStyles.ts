import { StyleSheet } from 'react-native';
import { theme } from '@/theme/theme.tsx';

export const globalStyles = StyleSheet.create({
  /**
   * LAYOUT
   */
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  /**
   * TEXT
   */
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    fontWeight: '400',
  },
  /**
   * FORMS
   */
  input: {
    width: '100%',
    marginBottom: 16,
    backgroundColor: theme.colors.surface,
  },
  button: {
    width: '100%',
    marginTop: 8,
    borderRadius: theme.roundness,
    backgroundColor: theme.colors.primary,
    elevation: 2,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  /**
   * DIVIDER
   */
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.outline,
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#999',
    fontSize: 14,
    fontWeight: '500',
  },
});
