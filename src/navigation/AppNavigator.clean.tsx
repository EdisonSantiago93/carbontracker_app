// src/navigation/AppNavigator.clean.tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'react-native';
import LoginScreen from '@/screens/Login/LoginScreen.tsx';
import OnboardingScreen from '@/screens/Onboarding/OnboardingScreen.tsx';
import PlanesScreen from '@/screens/Planes/PlanesScreen.tsx';
import ProfileScreen from '@/screens/Profile/ProfileScreen.tsx';
import RegisterScreen from '@/screens/Register/RegisterScreen.tsx';
import SplashScreen from '@/screens/Splash/SplashScreen.tsx';
import TabNavigator from '@/navigation/TabNavigator.tsx';

const Stack = createNativeStackNavigator();
const primaryColor = '#65C879';

export default function AppNavigator() {
  return (
    <>
      <StatusBar backgroundColor={primaryColor} barStyle="light-content" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
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
