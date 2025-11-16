import { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  View,
} from 'react-native';
import { Button, Snackbar, Text, TextInput } from 'react-native-paper';
import { loginUser } from '@/services/AuthService.tsx';
import { styles } from '@/screens/Login/LoginScreen.styles.ts'; // Importa los estilos
import ResetPasswordModal from '@/screens/Login/components/ResetPasswordModal.tsx'; // Importa el modal

export default function LoginScreen({ navigation }: { navigation: any }): JSX.Element {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ visible: false, message: '' });
  const [visiblePassword, setVisiblePassword] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const showError = (message: string): void => setSnackbar({ visible: true, message });

  const handleLogin = async () => {
    if (!email || !password) {
      showError('Por favor completa todos los campos.');
      return;
    }
    setLoading(true);
    try {
      await loginUser(email.trim(), password);
      navigation.replace('Main');
    } catch (error: any) {
      showError('Error al iniciar sesión: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.centered} keyboardShouldPersistTaps="handled">
          {/* Header con Logo */}
          <View style={styles.header}>
            <Image
              source={require('../../../assets/carbontracker.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.welcomeText}>Bienvenido</Text>
            <Text style={styles.subtitleText}>Inicia sesión para continuar</Text>
          </View>

          {/* Formulario */}
          <View style={styles.formContainer}>
            <TextInput
              label="Correo electrónico"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              style={styles.input}
              mode="outlined"
              outlineColor="#E0E0E0"
              activeOutlineColor="#65C879"
              left={<TextInput.Icon icon="email" color="#65C879" />}
            />

            <TextInput
              label="Contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!visiblePassword}
              style={styles.input}
              mode="outlined"
              outlineColor="#E0E0E0"
              activeOutlineColor="#65C879"
              left={<TextInput.Icon icon="lock" color="#65C879" />}
              right={
                <TextInput.Icon
                  icon={visiblePassword ? 'eye-off' : 'eye'}
                  onPress={() => setVisiblePassword((v) => !v)}
                  color="#999"
                />
              }
            />

            <Button
              mode="text"
              onPress={() => setModalVisible(true)}
              disabled={loading}
              style={styles.forgotButton}
              labelStyle={styles.forgotButtonText}
            >
              ¿Olvidaste tu contraseña?
            </Button>

            <Button
              mode="contained"
              onPress={handleLogin}
              loading={loading}
              style={styles.button}
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
            >
              Iniciar Sesión
            </Button>

            {/* Divisor */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>o</Text>
              <View style={styles.dividerLine} />
            </View>

            <Button
              mode="outlined"
              onPress={() => navigation.navigate('Register')}
              disabled={loading}
              style={styles.registerButton}
              contentStyle={styles.buttonContent}
              labelStyle={styles.registerButtonText}
            >
              Crear cuenta nueva
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

        <ResetPasswordModal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          onSuccess={() => {
            setModalVisible(false);
            showError('Correo de recuperación enviado correctamente');
          }}
          showError={showError}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
