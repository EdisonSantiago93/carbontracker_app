// src/screens/ConfigScreen.js
import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Alert, Image, Linking, ScrollView, View } from 'react-native';
import { Button, Snackbar, Text, TouchableRipple } from 'react-native-paper';

import AppContainer from '@/components/AppContainer.tsx';
import DeleteAccountModal from '@/components/DeleteAccountModal';
import { styles } from '@/screens/Config/ConfigScreen.styles.ts';
import { deleteUserAccount } from '@/services/AuthService';
import { obtenerParametroPorTag } from '@/services/ParametrosService.tsx';
import type { Parametro } from '@/types/Parametro';
import { removeSession } from '@/utils/session.ts';

const MI: any = MaterialIcons;

export default function ConfigScreen({ navigation }: { navigation: any }): JSX.Element {
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [datos, setDatos] = useState<Parametro | null>(null);
  const [politicas, setPoliticas] = useState<Parametro | null>(null);
  const [terminos, setTerminos] = useState<Parametro | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const urldatos = await obtenerParametroPorTag('URL_DATOS');
        if (urldatos) {
          setDatos(urldatos);
        }
        const urlpoliticas = await obtenerParametroPorTag('URL_POLITICAS');
        if (urlpoliticas) {
          setPoliticas(urlpoliticas);
        }
        const urlterminos = await obtenerParametroPorTag('URL_TERMINOS');
        if (urlterminos) {
          setTerminos(urlterminos);
        }
      } catch (error) {
        console.error('Error al obtener datos:', error);
      }
    };

    fetchData();
  }, []);

  const showMessage = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const handleLogout = async (): Promise<void> => {
    Alert.alert('Cerrar Sesión', '¿Estás seguro que deseas cerrar sesión?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Cerrar Sesión',
        style: 'destructive',
        onPress: async () => {
          await removeSession('user');
          navigation.replace('Login');
        },
      },
    ]);
  };

  const handleDeleteAccount = async (password: string) => {
    setLoadingDelete(true);
    try {
      await deleteUserAccount(password);
      setDeleteModalVisible(false);
      await removeSession('user');

      // Pequeño delay para que se cierre el modal antes de navegar
      setTimeout(() => {
        navigation.replace('Login');
        Alert.alert(
          'Cuenta Desactivada',
          'Tu cuenta ha sido desactivada exitosamente. Contacta al administrador si deseas reactivarla.',
          [{ text: 'Entendido' }],
        );
      }, 300);
    } catch (error: any) {
      showMessage(error.message || 'Error al eliminar la cuenta');
    } finally {
      setLoadingDelete(false);
    }
  };

  const menus: {
    title: string;
    subtitle: string;
    icon: any;
    color: string;
    onPress: () => void;
  }[] = [
    {
      title: 'Mi Perfil',
      subtitle: 'Ver y editar información personal',
      icon: 'person',
      color: '#65C879',
      onPress: () => navigation.navigate('ProfileScreen'),
    },
    {
      title: 'Planes',
      subtitle: 'Conoce nuestros planes y beneficios',
      icon: 'workspace-premium',
      color: '#FFD700',
      onPress: () => navigation.navigate('PlanesScreen'),
    },
    {
      title: 'Términos y Condiciones',
      subtitle: 'Lee nuestros términos de servicio',
      icon: 'description',
      color: '#4A90E2',
      onPress: () => {
        if (terminos?.valor) {
          Linking.openURL(terminos.valor);
        } else {
          showMessage('URL de términos no disponible');
        }
      },
    },
    {
      title: 'Políticas de Privacidad',
      subtitle: 'Cómo protegemos tus datos',
      icon: 'security',
      color: '#F5A623',
      onPress: () => {
        if (politicas?.valor) {
          Linking.openURL(politicas.valor);
        } else {
          showMessage('URL de políticas no disponible');
        }
      },
    },
    {
      title: 'Tratamiento de Datos',
      subtitle: 'Conoce cómo usamos tu información',
      icon: 'policy',
      color: '#9013FE',
      onPress: () => {
        if (datos?.valor) {
          Linking.openURL(datos.valor);
        } else {
          showMessage('URL de tratamiento de datos no disponible');
        }
      },
    },
  ];

  return (
    <AppContainer>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Image
            source={require('../../../assets/carbontracker.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.welcomeText}>Configuración</Text>
          <Text style={styles.subtitleText}>Administra tu cuenta y preferencias</Text>
        </View>

        {/* Menú de opciones */}
        <View style={styles.menuContainer}>
          {menus.map((menu, index) => (
            <TouchableRipple
              key={index}
              onPress={menu.onPress}
              style={styles.menuButton}
              rippleColor="rgba(101, 200, 121, 0.1)"
              borderless
            >
              <View style={styles.menuContent}>
                <View style={[styles.iconContainer, { backgroundColor: menu.color + '15' }]}>
                  <MI name={menu.icon} size={24} color={menu.color} />
                </View>
                <View style={styles.menuTextContainer}>
                  <Text style={styles.menuTitle}>{menu.title}</Text>
                  <Text style={styles.menuSubtitle}>{menu.subtitle}</Text>
                </View>
                <MI name="chevron-right" size={24} color="#999" />
              </View>
            </TouchableRipple>
          ))}
        </View>

        {/* Separador entre menú y botones */}
        <View style={styles.buttonsSeparator} />

        {/* Botón de cerrar sesión */}
        <Button
          mode="contained"
          onPress={handleLogout}
          style={styles.logoutButton}
          contentStyle={styles.logoutButtonContent}
          labelStyle={styles.logoutButtonLabel}
          icon={({ size, color }: { size: number; color: string }) => (
            <MI name="logout" size={size} color={color} />
          )}
        >
          Cerrar Sesión
        </Button>

        {/* Botón de eliminar cuenta */}
        <Button
          mode="outlined"
          onPress={() => setDeleteModalVisible(true)}
          style={styles.deleteButton}
          contentStyle={styles.deleteButtonContent}
          labelStyle={styles.deleteButtonLabel}
          icon={({ size }: { size: number }) => (
            <MI name="delete-forever" size={size} color="#FF6B6B" />
          )}
        >
          Eliminar Cuenta
        </Button>

        {/* Footer con versión */}
        <View style={styles.footer}>
          <Text style={styles.versionText}>CarbonTracker v1.0.0</Text>
          <Text style={styles.copyrightText}>© 2025 Todos los derechos reservados</Text>
        </View>
      </ScrollView>

      {/* Modal de eliminar cuenta */}
      <DeleteAccountModal
        visible={deleteModalVisible}
        onDismiss={() => setDeleteModalVisible(false)}
        onConfirm={handleDeleteAccount}
        loading={loadingDelete}
      />

      {/* Snackbar para mensajes */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={{ backgroundColor: '#FF6B6B' }}
      >
        {snackbarMessage}
      </Snackbar>
    </AppContainer>
  );
}
