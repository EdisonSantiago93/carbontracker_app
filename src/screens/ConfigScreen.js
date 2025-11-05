// src/screens/ConfigScreen.js
import React from "react";
import { View, StyleSheet, ScrollView, Image, Linking } from "react-native";
import { Text, Button, TouchableRipple } from "react-native-paper";
import AppContainer from "../components/AppContainer";
import { MaterialIcons } from "@expo/vector-icons";
import { removeSession } from "../utils/session";

export default function ConfigScreen({ navigation }) {
  const handleLogout = async () => {
    await removeSession("user");
    navigation.replace("Login");
  };

  const menus = [
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
            source={require("../../assets/carbontracker.png")}
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
          icon={({ size, color }) => (
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 100,
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
  menuContainer: {
    width: "100%",
    marginBottom: 24,
  },
  menuButton: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    overflow: "hidden",
  },
  menuContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  menuSubtitle: {
    fontSize: 13,
    color: "#999",
    lineHeight: 18,
  },
  logoutButton: {
    width: "100%",
    borderRadius: 8,
    backgroundColor: "#E74C3C",
    elevation: 2,
    marginTop: 8,
  },
  logoutButtonContent: {
    paddingVertical: 8,
  },
  logoutButtonLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    alignItems: "center",
    marginTop: 32,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  versionText: {
    fontSize: 14,
    color: "#999",
    marginBottom: 8,
    fontWeight: "500",
  },
  copyrightText: {
    fontSize: 12,
    color: "#BBB",
  },
});