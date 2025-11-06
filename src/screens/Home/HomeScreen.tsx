// src/screens/HomeScreen.js
import React, { useState, useEffect } from "react";
import { View, Dimensions, ActivityIndicator } from "react-native";
import { useTheme } from "react-native-paper";
import { WebView } from "react-native-webview";
import AppContainer from "../../components/AppContainer";
import { getSession } from "../../utils/session";
import { styles } from "./HomeScreen.styles";


export default function HomeScreen(): JSX.Element {
  const { colors } = useTheme();
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [webUrl, setWebUrl] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await getSession("user");
        if (storedUser) {
          setUser(storedUser);
          setWebUrl(`https://carbontrackerweb.netlify.app/resultados/${storedUser.id}`);
        }
      } catch (error) {
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
