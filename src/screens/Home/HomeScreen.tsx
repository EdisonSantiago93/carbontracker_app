// src/screens/Home/HomeScreen.tsx
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { WebView } from 'react-native-webview';
import AppContainer from '@/components/AppContainer.tsx';
import { getSession } from '@/utils/session.ts';
import { styles } from '@/screens/Home/HomeScreen.styles.ts';

export default function HomeScreen(): JSX.Element {
  const { colors } = useTheme();
  const [loading, setLoading] = useState(true);
  const [webUrl, setWebUrl] = useState('');

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await getSession('user');
        if (storedUser) {
          setWebUrl(`https://carbontrackerweb.netlify.app/resultados/${storedUser.id}`);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  return (
    <AppContainer title="Inicio">
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 50 }} />
        ) : webUrl ? (
          <WebView
            source={{ uri: webUrl }}
            startInLoadingState
            renderLoading={() => (
              <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 50 }} />
            )}
            style={styles.webview}
          />
        ) : (
          <View style={styles.noUserContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        )}
      </View>
    </AppContainer>
  );
}
