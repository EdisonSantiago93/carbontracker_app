// src/components/AppContainer.tsx
import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import AppHeader from '@/components/AppHeader.tsx';

interface AppContainerProps {
  children: React.ReactNode;
  title?: string;
}

export default function AppContainer({ children, title }: AppContainerProps): JSX.Element {
  const theme = useTheme();

  return (
    <View style={[styles.flex, { backgroundColor: theme.colors.background }]}>
      {/* Header fijo */}
      {title && <AppHeader title={title} />}

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scrollContainer: {
    flexGrow: 1,
  },
});
