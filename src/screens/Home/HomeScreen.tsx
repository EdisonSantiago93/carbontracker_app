// src/screens/Home/HomeScreen.tsx
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';

import AppContainer from '@/components/AppContainer.tsx';
import LoadingScreen from '@/components/LoadingScreen.tsx';
import { styles } from '@/screens/Home/HomeScreen.styles.ts';
import { obtenerParametroPorTag } from '@/services/ParametrosService.tsx';
import { getSession } from '@/utils/session.ts';

export default function HomeScreen(): JSX.Element {
  const [loading, setLoading] = useState(true);
  const [webUrl, setWebUrl] = useState('');
  const [webViewKey, setWebViewKey] = useState(0);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const storedUser = await getSession('user');
      if (storedUser) {
        const urldatos = await obtenerParametroPorTag('URL_RESULTADOS');
        if (urldatos) {
          setWebUrl(`${urldatos.valor}${storedUser.id}`);
          setWebViewKey((prev) => prev + 1);
        } else {
          console.warn('No se encontró el parámetro URL_RESULTADOS');
          setWebUrl(`default-url/${storedUser.id}`);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  if (loading) {
    return <LoadingScreen message="Cargando resultados..." />;
  }

  if (!webUrl) {
    return <LoadingScreen message="No se pudo cargar la URL" showLogo={false} />;
  }

  return (
    <AppContainer title="Inicio">
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