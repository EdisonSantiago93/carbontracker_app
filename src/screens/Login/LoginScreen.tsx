import { styles } from '@/screens/Login/LoginScreen.styles.ts'; // Importa los estilos
import ResetPasswordModal from '@/screens/Login/components/ResetPasswordModal.tsx'; // Importa el modal
import { findUserByEmail, loginUser, reactivateUserAccount } from '@/services/AuthService';
import { useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { Button, Snackbar, Text, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

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
      console.error(error);

      // Verificar si es un error de cuenta desactivada
      if (error.message && error.message.includes('desactivada')) {
        setLoading(false);

        Alert.alert('Cuenta Desactivada', '¿Deseas reactivar tu cuenta?', [
          {
            text: 'Cancelar',
            style: 'cancel',
          },
          {
            text: 'Reactivar',
            onPress: async () => {
              setLoading(true);
              try {
                // Buscar el usuario por email para obtener su ID
                const userInfo = await findUserByEmail(email.trim());

                if (!userInfo) {
                  showError('No se encontró el usuario');
                  return;
                }

                // Reactivar la cuenta
                await reactivateUserAccount(userInfo.id);

                // Intentar login nuevamente
                await loginUser(email.trim(), password);

                Alert.alert('¡Cuenta Reactivada!', 'Tu cuenta ha sido reactivada exitosamente.', [
                  {
                    text: 'Continuar',
                    onPress: () => navigation.replace('Main'),
                  },
                ]);
              } catch (reactivateError: any) {
                console.error(reactivateError);
                showError(reactivateError.message || 'Error al reactivar la cuenta');
              } finally {
                setLoading(false);
              }
            },
          },
        ]);
        return;
      }

      // Para otros errores, mostrar mensaje normal
      showError(error.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: styles.scrollContent.backgroundColor }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.centered}>
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
          </View>
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
