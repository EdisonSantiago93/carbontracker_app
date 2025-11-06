import React, { useState } from "react";
import { View, Image } from "react-native";
import { Text, TextInput, Button, Modal, Portal } from "react-native-paper";
import { StyleSheet } from "react-native";

interface ResetPasswordModalProps {
  visible: boolean;
  onDismiss: () => void;
  onSuccess: () => void;
  showError: (message: string) => void;
}

export default function ResetPasswordModal({
  visible,
  onDismiss,
  onSuccess,
  showError,
}: ResetPasswordModalProps) {
  const [resetEmail, setResetEmail] = useState("");
  const [loadingReset, setLoadingReset] = useState(false);

  const handleResetPassword = async () => {
    if (!resetEmail) {
      showError("Ingresa tu correo para recuperar la contraseña");
      return;
    }

    setLoadingReset(true);
    try {
      // Reemplaza con tu lógica real de reseteo de contraseña
      // await resetUserPassword(resetEmail.trim()); 
      console.log(`Enviando correo de recuperación a ${resetEmail.trim()}`);
      onSuccess();
      setResetEmail("");
    } catch (error: any) {
      showError(error.message);
    } finally {
      setLoadingReset(false);
    }
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modalWrapper}
      >
        <View style={styles.modalContainer}>
          <Image
            source={require("../../../../assets/carbontracker.png")}
            style={styles.modalLogo}
            resizeMode="contain"
          />
          <Text style={styles.modalTitle}>Recuperar contraseña</Text>
          <Text style={styles.modalSubtitle}>
            Ingresa tu correo y te enviaremos un enlace para restablecer tu
            contraseña
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
            onPress={onDismiss}
            style={styles.cancelButton}
            labelStyle={styles.cancelButtonText}
          >
            Cancelar
          </Button>
        </View>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
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
  input: {
    width: "100%",
    marginBottom: 16,
    backgroundColor: "#fff",
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
  buttonContent: {
    paddingVertical: 8,
  },
});
