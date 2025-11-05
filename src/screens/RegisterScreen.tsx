import React, { useState } from "react";
import {
  StyleSheet,
  Image,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Linking,
} from "react-native";
import { Text, TextInput, Button, Snackbar, Checkbox } from "react-native-paper";
import AppContainer from "../components/AppContainer";
import { registerUserWithFirestore } from "../services/AuthService";

export default function RegisterScreen({ navigation }) {
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [cedula, setCedula] = useState("");
  const [correo, setCorreo] = useState("");
  const [direccion, setDireccion] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ visible: false, message: "" });

  // Estados para los checks
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptDataPolicy, setAcceptDataPolicy] = useState(false);

  // Mostrar/ocultar contraseñas
  const [visiblePassword, setVisiblePassword] = useState(false);
  const [visibleConfirmPassword, setVisibleConfirmPassword] = useState(false);

  const showError = (message) => setSnackbar({ visible: true, message });

  const handleRegister = async () => {
    if (
      !nombres.trim() ||
      !apellidos.trim() ||
      !cedula.trim() ||
      !correo.trim() ||
      !direccion.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      return showError("Completa todos los campos");
    }

    if (password !== confirmPassword) {
      return showError("Las contraseñas no coinciden");
    }

    if (password.length < 6) {
      return showError("La contraseña debe tener al menos 6 caracteres");
    }

    setLoading(true);
    try {
      await registerUserWithFirestore({
        nombres,
        apellidos,
        cedula,
        correo: correo.trim(),
        direccion,
        rol: "usuario",
        password,
      });
      navigation.replace("Login");
    } catch (error) {
      showError(error.message);
    }
    setLoading(false);
  };

  return (
    <AppContainer>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.centered}>
            {/* Header */}
            <View style={styles.header}>
              <Image
                source={require("../../assets/logo.png")}
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={styles.welcomeText}>Crear Cuenta</Text>
              <Text style={styles.subtitleText}>
                Completa tus datos para registrarte
              </Text>
            </View>

            {/* Formulario */}
            <View style={styles.formContainer}>
              <TextInput
                label="Nombres"
                value={nombres}
                onChangeText={setNombres}
                style={styles.input}
                mode="outlined"
                outlineColor="#E0E0E0"
                activeOutlineColor="#65C879"
                left={<TextInput.Icon icon="account" color="#65C879" />}
              />
              <TextInput
                label="Apellidos"
                value={apellidos}
                onChangeText={setApellidos}
                style={styles.input}
                mode="outlined"
                outlineColor="#E0E0E0"
                activeOutlineColor="#65C879"
                left={<TextInput.Icon icon="account-outline" color="#65C879" />}
              />
              <TextInput
                label="Cédula"
                value={cedula}
                onChangeText={setCedula}
                keyboardType="numeric"
                style={styles.input}
                mode="outlined"
                outlineColor="#E0E0E0"
                activeOutlineColor="#65C879"
                left={<TextInput.Icon icon="card-account-details" color="#65C879" />}
              />
              <TextInput
                label="Correo electrónico"
                value={correo}
                onChangeText={setCorreo}
                autoCapitalize="none"
                keyboardType="email-address"
                style={styles.input}
                mode="outlined"
                outlineColor="#E0E0E0"
                activeOutlineColor="#65C879"
                left={<TextInput.Icon icon="email" color="#65C879" />}
              />
              <TextInput
                label="Dirección"
                value={direccion}
                onChangeText={setDireccion}
                style={styles.input}
                mode="outlined"
                outlineColor="#E0E0E0"
                activeOutlineColor="#65C879"
                left={<TextInput.Icon icon="map-marker" color="#65C879" />}
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
              <TextInput
                label="Confirmar Contraseña"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!visibleConfirmPassword}
                style={styles.input}
                mode="outlined"
                outlineColor="#E0E0E0"
                activeOutlineColor="#65C879"
                left={<TextInput.Icon icon="lock-check" color="#65C879" />}
                right={
                  <TextInput.Icon
                    icon={visibleConfirmPassword ? "eye-off" : "eye"}
                    onPress={() => setVisibleConfirmPassword((v) => !v)}
                    color="#999"
                  />
                }
              />

              {/* Sección de términos y condiciones */}
              <View style={styles.termsSection}>
                <View style={styles.checkboxRow}>
                  <Checkbox.Android
                    status={acceptTerms ? "checked" : "unchecked"}
                    onPress={() => setAcceptTerms(!acceptTerms)}
                    color="#65C879"
                  />
                  <Text style={styles.checkboxText}>
                    Acepto los{" "}
                    <Text
                      style={styles.link}
                      onPress={() =>
                        Linking.openURL(
                          "https://carbontrackerweb.netlify.app/legal/terminos"
                        )
                      }
                    >
                      términos y condiciones
                    </Text>{" "}
                    y la{" "}
                    <Text
                      style={styles.link}
                      onPress={() =>
                        Linking.openURL(
                          "https://carbontrackerweb.netlify.app/legal/politicas"
                        )
                      }
                    >
                      política de privacidad
                    </Text>
                  </Text>
                </View>

                <View style={styles.checkboxRow}>
                  <Checkbox.Android
                    status={acceptDataPolicy ? "checked" : "unchecked"}
                    onPress={() => setAcceptDataPolicy(!acceptDataPolicy)}
                    color="#65C879"
                  />
                  <Text style={styles.checkboxText}>
                    Acepto el{" "}
                    <Text
                      style={styles.link}
                      onPress={() =>
                        Linking.openURL(
                          "https://carbontrackerweb.netlify.app/legal/datos"
                        )
                      }
                    >
                      tratamiento de datos
                    </Text>
                  </Text>
                </View>
              </View>

              <Button
                mode="contained"
                onPress={handleRegister}
                loading={loading}
                disabled={!acceptTerms || !acceptDataPolicy || loading}
                style={[
                  styles.button,
                  (!acceptTerms || !acceptDataPolicy) && styles.buttonDisabled,
                ]}
                contentStyle={styles.buttonContent}
                labelStyle={styles.buttonLabel}
              >
                Registrarse
              </Button>

              {/* Divisor */}
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
      </KeyboardAvoidingView>
    </AppContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 32,
    backgroundColor: "#F5F5F5",
  },
  centered: {
    alignItems: "center",
    paddingHorizontal: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  logo: {
    width: 140,
    height: 140,
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
    textAlign: "center",
  },
  formContainer: {
    width: "100%",
  },
  input: {
    width: "100%",
    marginBottom: 12,
    backgroundColor: "#fff",
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
    color: "#666",
    lineHeight: 20,
    marginLeft: 8,
    marginTop: 8,
  },
  link: {
    color: "#65C879",
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  button: {
    width: "100%",
    marginTop: 8,
    borderRadius: 8,
    backgroundColor: "#65C879",
    elevation: 2,
  },
  buttonDisabled: {
    backgroundColor: "#B0B0B0",
    elevation: 0,
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
  loginButton: {
    width: "100%",
    borderRadius: 8,
    borderColor: "#65C879",
    borderWidth: 1.5,
  },
  loginButtonText: {
    color: "#65C879",
    fontSize: 16,
    fontWeight: "600",
  },
  snackbar: {
    backgroundColor: "#333",
  },
});