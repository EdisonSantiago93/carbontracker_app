import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { Keyboard, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Modal, Portal, Text, TextInput } from 'react-native-paper';

interface DeleteAccountModalProps {
  visible: boolean;
  onDismiss: () => void;
  onConfirm: (password: string) => void;
  loading: boolean;
}

export default function DeleteAccountModal({
  visible,
  onDismiss,
  onConfirm,
  loading,
}: DeleteAccountModalProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
        // Scroll hacia abajo cuando aparece el teclado
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleConfirm = () => {
    if (!password.trim()) return;
    onConfirm(password);
  };

  const handleDismiss = () => {
    setPassword('');
    setShowPassword(false);
    Keyboard.dismiss();
    onDismiss();
  };

  return (
    <Portal>
      <Modal 
        visible={visible} 
        onDismiss={handleDismiss}
        contentContainerStyle={[
          styles.modalWrapper,
          keyboardVisible && styles.modalWrapperKeyboard
        ]}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.modalContainer}>
            <View style={styles.iconWarning}>
              <MaterialIcons name="warning" size={60} color="#FF6B6B" />
            </View>
            
            <Text style={styles.modalTitle}>¿Eliminar cuenta?</Text>
            
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
                ⚠️ Esta acción desactivará tu cuenta permanentemente
              </Text>
              <Text style={styles.warningSubtext}>
                • No podrás iniciar sesión{'\n'}
                • Tus datos se mantendrán guardados{'\n'}
                • Podrás reactivarla contactando al administrador
              </Text>
            </View>

            <Text style={styles.confirmText}>
              Para confirmar, ingresa tu contraseña actual:
            </Text>

            <TextInput
              label="Contraseña actual"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              mode="outlined"
              style={styles.input}
              outlineColor="#E0E0E0"
              activeOutlineColor="#FF6B6B"
              left={<TextInput.Icon icon="lock" color="#FF6B6B" />}
              right={
                <TextInput.Icon
                  icon={showPassword ? 'eye-off' : 'eye'}
                  onPress={() => setShowPassword(!showPassword)}
                  color="#999"
                />
              }
              onFocus={() => {
                setTimeout(() => {
                  scrollViewRef.current?.scrollToEnd({ animated: true });
                }, 200);
              }}
            />

            <Button
              mode="contained"
              onPress={handleConfirm}
              loading={loading}
              disabled={!password.trim() || loading}
              style={styles.deleteButton}
              contentStyle={styles.buttonContent}
              labelStyle={styles.deleteButtonLabel}
            >
              Eliminar mi cuenta
            </Button>

            <Button
              mode="text"
              onPress={handleDismiss}
              disabled={loading}
              style={styles.cancelButton}
              labelStyle={styles.cancelButtonText}
            >
              Cancelar
            </Button>

            {/* Espaciador extra cuando el teclado está visible */}
            {keyboardVisible && <View style={{ height: 300 }} />}
          </View>
        </ScrollView>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modalWrapper: {
    marginHorizontal: 24,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    elevation: 5,
    maxHeight: '85%',
  },
  modalWrapperKeyboard: {
    marginTop: 40,
    maxHeight: '70%',
  },
  scrollContent: {
    flexGrow: 1,
  },
  modalContainer: {
    alignItems: 'center',
  },
  iconWarning: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFE5E5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
    color: '#FF6B6B',
  },
  warningBox: {
    backgroundColor: '#FFF9E6',
    borderLeftWidth: 4,
    borderLeftColor: '#FFB020',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    width: '100%',
  },
  warningText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#D97706',
    marginBottom: 8,
  },
  warningSubtext: {
    fontSize: 13,
    color: '#92400E',
    lineHeight: 20,
  },
  confirmText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '500',
  },
  input: {
    width: '100%',
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  deleteButton: {
    backgroundColor: '#FF6B6B',
    marginTop: 8,
    width: '100%',
    borderRadius: 8,
    elevation: 2,
  },
  cancelButton: {
    marginTop: 8,
    width: '100%',
  },
  cancelButtonText: {
    color: '#999',
    fontSize: 15,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  deleteButtonLabel: {
    fontWeight: '600',
  },
});