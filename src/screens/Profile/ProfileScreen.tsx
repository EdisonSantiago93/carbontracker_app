import { styles } from '@/screens/Profile/ProfileScreen.styles.ts';
import { getUserData, updateUserPassword, updateUserProfile } from '@/services/AuthService.tsx';
import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { Button, Modal, Portal, Text, TextInput } from 'react-native-paper';

const MI: any = MaterialIcons;

export default function ProfileScreen() {
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [correo, setCorreo] = useState('');
  const [direccion, setDireccion] = useState('');
  const [loadingProfile, setLoadingProfile] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loadingPassword, setLoadingPassword] = useState(false);

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUserData();
        if (userData) {
          setNombres(userData.nombres || '');
          setApellidos(userData.apellidos || '');
          setCorreo(userData.correo || '');
          setDireccion(userData.direccion || '');
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser();
  }, []);

  const handleUpdateProfile = async () => {
    if (!nombres.trim() || !apellidos.trim() || !direccion.trim()) return;
    setLoadingProfile(true);
    try {
      await updateUserProfile({ nombres, apellidos, direccion });
      Alert.alert('Perfil', 'Perfil actualizado correctamente');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Error al actualizar perfil');
    }
    setLoadingProfile(false);
  };

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword || newPassword !== confirmPassword) {
      return Alert.alert('Validación', 'Verifica los campos de contraseña');
    }
    setLoadingPassword(true);
    try {
      await updateUserPassword(currentPassword, newPassword);
      Alert.alert('Contraseña', 'Contraseña actualizada correctamente');
      setModalVisible(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowCurrent(false);
      setShowNew(false);
      setShowConfirm(false);
    } catch (error) {
      Alert.alert('Error', (error as any)?.message || 'Ocurrió un error');
    }
    setLoadingPassword(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <MI name="account-circle" size={80} color="#65C879" />
        </View>
        <Text style={styles.welcomeText}>Mi Perfil</Text>
        <Text style={styles.subtitleText}>Administra tu información personal</Text>
      </View>

      {/* Sección de Información Personal */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MI name="person" size={20} color="#65C879" />
          <Text style={styles.sectionTitle}>Información Personal</Text>
        </View>

        <TextInput
          label="Nombres"
          value={nombres}
          onChangeText={setNombres}
          mode="outlined"
          style={styles.input}
          outlineColor="#E0E0E0"
          activeOutlineColor="#65C879"
          left={<TextInput.Icon icon="account" color="#65C879" />}
        />
        <TextInput
          label="Apellidos"
          value={apellidos}
          onChangeText={setApellidos}
          mode="outlined"
          style={styles.input}
          outlineColor="#E0E0E0"
          activeOutlineColor="#65C879"
          left={<TextInput.Icon icon="account-outline" color="#65C879" />}
        />
        <TextInput
          label="Dirección"
          value={direccion}
          onChangeText={setDireccion}
          mode="outlined"
          style={styles.input}
          outlineColor="#E0E0E0"
          activeOutlineColor="#65C879"
          left={<TextInput.Icon icon="map-marker" color="#65C879" />}
        />
      </View>

      {/* Sección de Cuenta */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MI name="email" size={20} color="#65C879" />
          <Text style={styles.sectionTitle}>Información de Cuenta</Text>
        </View>

        <TextInput
          label="Correo electrónico"
          value={correo}
          mode="outlined"
          disabled
          style={styles.input}
          outlineColor="#E0E0E0"
          activeOutlineColor="#65C879"
          left={<TextInput.Icon icon="email" color="#999" />}
        />
        <Text style={styles.helperText}>El correo no puede ser modificado</Text>
      </View>

      {/* Botones de acción */}
      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={handleUpdateProfile}
          loading={loadingProfile}
          style={styles.saveButton}
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonLabel}
          icon="content-save"
        >
          Guardar Cambios
        </Button>

        <Button
          mode="outlined"
          onPress={() => setModalVisible(true)}
          style={styles.passwordButton}
          contentStyle={styles.buttonContent}
          labelStyle={styles.passwordButtonLabel}
          icon="lock-reset"
        >
          Cambiar Contraseña
        </Button>
      </View>

      {/* Modal de cambio de contraseña */}
      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={styles.modalWrapper}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.keyboardView}
          >
            <View style={styles.modalContainer}>
              <ScrollView
                contentContainerStyle={styles.modalScroll}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.modalHeader}>
                  <View style={styles.modalIconContainer}>
                    <MI name="lock" size={32} color="#65C879" />
                  </View>
                  <Text style={styles.modalTitle}>Cambiar Contraseña</Text>
                  <Text style={styles.modalSubtitle}>
                    Ingresa tu contraseña actual y la nueva contraseña
                  </Text>
                </View>

                <TextInput
                  label="Contraseña actual"
                  secureTextEntry={!showCurrent}
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  mode="outlined"
                  style={styles.input}
                  outlineColor="#E0E0E0"
                  activeOutlineColor="#65C879"
                  left={<TextInput.Icon icon="lock" color="#65C879" />}
                  right={
                    <TextInput.Icon
                      icon={showCurrent ? 'eye-off' : 'eye'}
                      onPress={() => setShowCurrent(!showCurrent)}
                      color="#999"
                    />
                  }
                />

                <TextInput
                  label="Nueva contraseña"
                  secureTextEntry={!showNew}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  mode="outlined"
                  style={styles.input}
                  outlineColor="#E0E0E0"
                  activeOutlineColor="#65C879"
                  left={<TextInput.Icon icon="lock-plus" color="#65C879" />}
                  right={
                    <TextInput.Icon
                      icon={showNew ? 'eye-off' : 'eye'}
                      onPress={() => setShowNew(!showNew)}
                      color="#999"
                    />
                  }
                />

                <TextInput
                  label="Confirmar contraseña"
                  secureTextEntry={!showConfirm}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  mode="outlined"
                  style={styles.input}
                  outlineColor="#E0E0E0"
                  activeOutlineColor="#65C879"
                  left={<TextInput.Icon icon="lock-check" color="#65C879" />}
                  right={
                    <TextInput.Icon
                      icon={showConfirm ? 'eye-off' : 'eye'}
                      onPress={() => setShowConfirm(!showConfirm)}
                      color="#999"
                    />
                  }
                />

                <Button
                  mode="contained"
                  onPress={handleUpdatePassword}
                  loading={loadingPassword}
                  style={styles.saveButton}
                  contentStyle={styles.buttonContent}
                  labelStyle={styles.buttonLabel}
                >
                  Guardar Contraseña
                </Button>
                <Button
                  mode="text"
                  onPress={() => {
                    setModalVisible(false);
                    setCurrentPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                    setShowCurrent(false);
                    setShowNew(false);
                    setShowConfirm(false);
                  }}
                  style={styles.cancelButton}
                  labelStyle={styles.cancelButtonLabel}
                >
                  Cancelar
                </Button>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </Portal>
    </ScrollView>
  );
}
