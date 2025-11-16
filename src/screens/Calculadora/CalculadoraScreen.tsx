// src/screens/CalculadoraScreen.js
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';

import AppContainer from '@/components/AppContainer.tsx';
import LoadingScreen from '@/components/LoadingScreen.tsx';
import { styles } from '@/screens/Calculadora/CalculadoraScreen.styles.ts';
import { obtenerParametroPorTag } from '@/services/ParametrosService.tsx';
import { getSession } from '@/utils/session.ts';

export default function CalculadoraScreen(): JSX.Element {
  const [loading, setLoading] = useState(true);
  const [webUrl, setWebUrl] = useState('');
  const [webViewKey, setWebViewKey] = useState(0);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const storedUser = await getSession('user');

      if (storedUser) {
        const urldatos = await obtenerParametroPorTag('URL_CALCULADORA');
        if (urldatos) {
          setWebUrl(`${urldatos.valor}${storedUser.id}`);
          setWebViewKey((prev) => prev + 1);
        } else {
          console.warn('No se encontró el parámetro URL_CALCULADORA');
          setWebUrl(`default-url/${storedUser.id}`);
        }
      }
    } catch (error) {
      console.error('Error cargando usuario:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData]),
  );

  if (loading) {
    return <LoadingScreen message="Cargando resultados..." />;
  }

  if (!webUrl) {
    return <LoadingScreen message="No se pudo cargar la URL" showLogo={false} />;
  }

  return (
    <AppContainer title="Calculadora">
      <View style={styles.container}>
        <WebView
          key={webViewKey}
          source={{ uri: webUrl }}
          startInLoadingState
          cacheEnabled={false}
          renderLoading={() => <LoadingScreen message="Cargando contenido..." />}
          style={styles.webview}
        />
      </View>
    </AppContainer>
  );
}
