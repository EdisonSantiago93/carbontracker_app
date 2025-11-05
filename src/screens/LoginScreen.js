import React, { useState } from "react";
import { StyleSheet, Image, View, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Text, TextInput, Button, Snackbar, Portal, Modal } from "react-native-paper";
import AppContainer from "../components/AppContainer";
import { loginUser, resetUserPassword } from "../services/AuthService";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ visible: false, message: "" });
  const [visiblePassword, setVisiblePassword] = useState(false);

  // Modal de recuperación de contraseña
  const [modalVisible, setModalVisible] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [loadingReset, setLoadingReset] = useState(false);

  const showError = (message) => setSnackbar({ visible: true, message });

  const handleLogin = async () => {
    if (!email || !password) return showError("Por favor completa todos los campos.");
    setLoading(true);
    try {
      await loginUser(email.trim(), password);
      navigation.replace("Main");
    } catch (error) {
      showError("Error al iniciar sesión: " + error.message);
    }
    setLoading(false);
  };

  const handleResetPassword = async () => {
    if (!resetEmail) return showError("Ingresa tu correo para recuperar la contraseña");
    setLoadingReset(true);
    try {
      await resetUserPassword(resetEmail.trim());
      showError("Correo de recuperación enviado correctamente");
      setModalVisible(false);
      setResetEmail("");
    } catch (error) {
      showError(error.message);
    }
    setLoadingReset(false);
  };

  return (
    <AppContainer>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.centered} keyboardShouldPersistTaps="handled">
          {/* Header con Logo */}
          <View style={styles.header}>
            <Image
              source={require("../../assets/carbontracker.png")}
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
                  icon={visiblePassword ? "eye-off" : "eye"}
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
              onPress={() => navigation.navigate("Register")}
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
            onDismiss={() => setSnackbar({ visible: false, message: "" })}
            duration={3000}
            style={styles.snackbar}
          >
            {snackbar.message}
          </Snackbar>
        </ScrollView>

        {/* Modal de recuperación de contraseña */}
        <Portal>
          <Modal
            visible={modalVisible}
            onDismiss={() => setModalVisible(false)}
            contentContainerStyle={styles.modalWrapper}
          >
            <View style={styles.modalContainer}>
              <Image
                source={require("../../assets/carbontracker.png")}
                style={styles.modalLogo}
                resizeMode="contain"
              />
              <Text style={styles.modalTitle}>Recuperar contraseña</Text>
              <Text style={styles.modalSubtitle}>
                Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña
              </Text>

              <TextInput
                label="Correo electrónico"
                value={resetEmail}
                onChangeText={setResetEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                mode="outlined"
                style={styles.input}
                outlineColor="#E0E0E0"
                activeOutlineColor="#65C879"
                left={<TextInput.Icon icon="email" color="#65C879" />}
              />

              <Button
                mode="contained"
                onPress={handleResetPassword}
                loading={loadingReset}
                style={styles.saveButton}
                contentStyle={styles.buttonContent}
              >
                Enviar correo
              </Button>

              <Button
                mode="text"
                onPress={() => setModalVisible(false)}
                style={styles.cancelButton}
                labelStyle={styles.cancelButtonText}
              >
                Cancelar
              </Button>
            </View>
          </Modal>
        </Portal>
      </KeyboardAvoidingView>
    </AppContainer>
  );
}

const styles = StyleSheet.create({
  centered: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
    backgroundColor: "#F5F5F5",
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "700",
    color: "#333",
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "400",
  },
  formContainer: {
    width: "100%",
  },
  input: {
    width: "100%",
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  forgotButton: {
    alignSelf: "flex-end",
    marginTop: -8,
    marginBottom: 8,
  },
  forgotButtonText: {
    color: "#65C879",
    fontSize: 14,
    fontWeight: "600",
  },
  button: {
    width: "100%",
    marginTop: 8,
    borderRadius: 8,
    backgroundColor: "#65C879",
    elevation: 2,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E0E0E0",
  },
  dividerText: {
    marginHorizontal: 16,
    color: "#999",
    fontSize: 14,
    fontWeight: "500",
  },
  registerButton: {
    width: "100%",
    borderRadius: 8,
    borderColor: "#65C879",
    borderWidth: 1.5,
  },
  registerButtonText: {
    color: "#65C879",
    fontSize: 16,
    fontWeight: "600",
  },
  snackbar: {
    backgroundColor: "#333",
  },
  modalWrapper: {
    marginHorizontal: 24,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    elevation: 5,
  },
  modalContainer: {
    alignItems: "center",
  },
  modalLogo: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
    color: "#333",
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  saveButton: {
    backgroundColor: "#65C879",
    marginTop: 16,
    width: "100%",
    borderRadius: 8,
    elevation: 2,
  },
  cancelButton: {
    marginTop: 8,
    width: "100%",
  },
  cancelButtonText: {
    color: "#999",
    fontSize: 15,
  },
});