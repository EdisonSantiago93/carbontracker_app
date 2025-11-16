// src/navigation/TabNavigator.tsx
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons.js';
import CalculadoraScreen from '@/screens/Calculadora/CalculadoraScreen.tsx';
import ConfigScreen from '@/screens/Config/ConfigScreen.tsx';
import HomeScreen from '@/screens/Home/HomeScreen.tsx';
const MI: any = MaterialIcons;

const Tab = createBottomTabNavigator();

function TabNavigatorContent() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#65C879',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#E0E0E0',
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
          paddingTop: 8,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginBottom: 4,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Inicio',
          tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
            <MI name="home" size={focused ? 28 : 24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Calculadora"
        component={CalculadoraScreen}
        options={{
          tabBarLabel: 'Calculadora',
          tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
            <MI name="calculate" size={focused ? 28 : 24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Configuración"
        component={ConfigScreen}
        options={{
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
            <MI name="settings" size={focused ? 28 : 24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function TabNavigator() {
  return <TabNavigatorContent />;
}
