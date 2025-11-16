import { useEffect } from 'react';
import { Image, View } from 'react-native';
import { getSession } from '@/utils/session.ts'; // Asegúrate de tener este helper
import { styles } from '@/screens/Splash/SplashScreen.styles.ts';

export default function SplashScreen({ navigation }: { navigation: any }) {
  useEffect(() => {
    const checkSession = async () => {
      try {
        const user = await getSession('user');

        // Esperamos 2 segundos para mostrar el splash
        setTimeout(() => {
          if (user) {
            // ✅ Si existe sesión, entra directo al Main
            navigation.replace('Main');
          } else {
            // 🚀 Si no hay sesión, va al Onboarding
            navigation.replace('Onboarding');
          }
        }, 2000);
      } catch (error) {
        console.error('Error al verificar sesión:', error);
        navigation.replace('Onboarding');
      }
    };

    checkSession();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/splash.png')} // tu imagen
        style={styles.logo}
      />
    </View>
  );
}
