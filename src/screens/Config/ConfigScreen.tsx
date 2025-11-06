// src/screens/ConfigScreen.js
import React from "react";
import { View, ScrollView, Image, Linking } from "react-native";
import { Text, Button, TouchableRipple } from "react-native-paper";
import AppContainer from "../../components/AppContainer";
import { MaterialIcons } from "@expo/vector-icons";
import { removeSession } from "../../utils/session";
import { styles } from "./ConfigScreen.styles";

export default function ConfigScreen({ navigation }: { navigation: any }): JSX.Element {
  const handleLogout = async (): Promise<void> => {
    await removeSession("user");
    navigation.replace("Login");
  };

  const menus: { title: string; subtitle: string; icon: any; color: string; onPress: () => void; }[] = [
    {
      title: "Mi Perfil",
      subtitle: "Ver y editar información personal",
      icon: "person",
      color: "#65C879",
      onPress: () => navigation.navigate("ProfileScreen"),
    },
    {
      title: "Planes",
      subtitle: "Conoce nuestros planes y beneficios",
      icon: "workspace-premium",
      color: "#FFD700",
      onPress: () => navigation.navigate("PlanesScreen"),
    },
    {
      title: "Términos y Condiciones",
      subtitle: "Lee nuestros términos de servicio",
      icon: "description",
      color: "#4A90E2",
      onPress: () =>
        Linking.openURL("https://carbontrackerweb.netlify.app/legal/terminos"),
    },
    {
      title: "Políticas de Privacidad",
      subtitle: "Cómo protegemos tus datos",
      icon: "security",
      color: "#F5A623",
      onPress: () =>
        Linking.openURL("https://carbontrackerweb.netlify.app/legal/politicas"),
    },
    {
      title: "Tratamiento de Datos",
      subtitle: "Conoce cómo usamos tu información",
      icon: "policy",
      color: "#9013FE",
      onPress: () =>
        Linking.openURL("https://carbontrackerweb.netlify.app/legal/datos"),
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
            source={require("../../../assets/carbontracker.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.welcomeText}>Configuración</Text>
          <Text style={styles.subtitleText}>
            Administra tu cuenta y preferencias
          </Text>
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
                <View
                  style={[styles.iconContainer, { backgroundColor: menu.color + "15" }]}
                >
                  <MaterialIcons name={menu.icon} size={24} color={menu.color} />
                </View>
                <View style={styles.menuTextContainer}>
                  <Text style={styles.menuTitle}>{menu.title}</Text>
                  <Text style={styles.menuSubtitle}>{menu.subtitle}</Text>
                </View>
                <MaterialIcons name="chevron-right" size={24} color="#999" />
              </View>
            </TouchableRipple>
          ))}
        </View>

        {/* Botón de cerrar sesión */}
        <Button
          mode="contained"
          onPress={handleLogout}
          style={styles.logoutButton}
          contentStyle={styles.logoutButtonContent}
          labelStyle={styles.logoutButtonLabel}
          icon={({ size, color }: { size: number; color: string; }) => (
            <MaterialIcons name="logout" size={size} color={color} />
          )}
        >
          Cerrar Sesión
        </Button>

        {/* Footer con versión */}
        <View style={styles.footer}>
          <Text style={styles.versionText}>CarbonTracker v1.0.0</Text>
          <Text style={styles.copyrightText}>
            © 2025 Todos los derechos reservados
          </Text>
        </View>
      </ScrollView>
    </AppContainer>
  );
}
