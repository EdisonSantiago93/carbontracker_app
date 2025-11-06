// src/navigation/AppNavigator.js
import React from "react";
import { StatusBar } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashScreen from "../screens/Splash/SplashScreen";
import OnboardingScreen from "../screens/Onboarding/OnboardingScreen";
import PlanesScreen from "../screens/Planes/PlanesScreen";


import RegisterScreen from "../screens/Register/RegisterScreen";
import LoginScreen from "../screens/Login/LoginScreen";
import ProfileScreen from "../screens/Profile/ProfileScreen";
import TabNavigator from "./TabNavigator";

const Stack = createNativeStackNavigator();
const primaryColor = "#65C879"; // color principal de tu app

export default function AppNavigator() {
  return (
    <>
      {/* StatusBar personalizada */}
      <StatusBar
        backgroundColor={primaryColor} // fondo de la barra superior
        barStyle="light-content" // texto y iconos en blanco
      />

      <Stack.Navigator
        screenOptions={{
          headerShown: false, // Oculta el header de los screens
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        <Stack.Screen name="PlanesScreen" component={PlanesScreen} />

        
        <Stack.Screen name="Main" component={TabNavigator} />
      </Stack.Navigator>
    </>
  );
}
