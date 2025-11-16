import { styles } from '@/screens/Register/RegisterScreen.styles.ts';
import RegisterForm from '@/screens/Register/components/RegisterForm.tsx';
import { registerUserWithFirestore } from '@/services/AuthService.tsx';
import { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from 'react-native';
import { Button, Snackbar, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

const validateForm = (formData: any) => {
  const { nombres, apellidos, cedula, correo, direccion, password, confirmPassword } = formData;

  if (
    !nombres.trim() ||
    !apellidos.trim() ||
    !cedula.trim() ||
    !correo.trim() ||
    !direccion.trim() ||
    !password.trim() ||
    !confirmPassword.trim()
  ) {
    return 'Completa todos los campos';
  }

  if (password !== confirmPassword) {
    return 'Las contraseñas no coinciden';
  }

  if (password.length < 6) {
    return 'La contraseña debe tener al menos 6 caracteres';
  }

  return null;
};

export default function RegisterScreen({ navigation }: { navigation: any }) {
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ visible: false, message: '' });

  const showError = (message: string) => setSnackbar({ visible: true, message });

  const handleRegister = async (formData: any) => {
    const errorMessage = validateForm(formData);
    if (errorMessage) {
      showError(errorMessage);
      return;
    }

    setLoading(true);
    try {
      await registerUserWithFirestore({
        ...formData,
        correo: formData.correo.trim(),
        rol: 'usuario',
      });
      navigation.replace('Login');
    } catch (error: unknown) {
      // normalize unknown error to string message
      if (error instanceof Error) {
        showError(error.message);
      } else {
        showError(String(error));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: styles.scrollContent.backgroundColor }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.centered}>
            <View style={styles.header}>
              <Image
                source={require('../../../assets/logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={styles.welcomeText}>Crear Cuenta</Text>
              <Text style={styles.subtitleText}>Completa tus datos para registrarte</Text>
            </View>

            <RegisterForm loading={loading} onSubmit={handleRegister} />

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>o</Text>
              <View style={styles.dividerLine} />
            </View>

            <Button
              mode="outlined"
              onPress={() => navigation.goBack()}
              disabled={loading}
              style={styles.loginButton}
              contentStyle={styles.buttonContent}
              labelStyle={styles.loginButtonText}
            >
              Ya tengo cuenta
            </Button>
          </View>

          <Snackbar
            visible={snackbar.visible}
            onDismiss={() => setSnackbar({ visible: false, message: '' })}
            duration={3000}
            style={styles.snackbar}
          >
            {snackbar.message}
          </Snackbar>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
