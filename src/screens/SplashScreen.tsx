import React, { useEffect } from "react";
import { View, StyleSheet, Image } from "react-native";
import { getSession } from "../utils/session"; // Asegúrate de tener este helper

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const checkSession = async () => {
      try {
        const user = await getSession("user");

        // Esperamos 2 segundos para mostrar el splash
        setTimeout(() => {
          if (user) {
            // ✅ Si existe sesión, entra directo al Main
            navigation.replace("Main");
          } else {
            // 🚀 Si no hay sesión, va al Onboarding
            navigation.replace("Onboarding");
          }
        }, 2000);
      } catch (error) {
        console.error("Error al verificar sesión:", error);
        navigation.replace("Onboarding");
      }
    };

    checkSession();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/splash.png")} // tu imagen
        style={styles.logo}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#65C879",
  },
  logo: {
    width: 280,
    height: 100,
    marginBottom: 20,
  },
});
