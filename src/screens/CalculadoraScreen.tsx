// src/screens/CalculadoraScreen.js
import React, { useState, useEffect } from "react";
import { View, StyleSheet, Dimensions, ActivityIndicator } from "react-native";
import { useTheme } from "react-native-paper";
import { WebView } from "react-native-webview";
import AppContainer from "../components/AppContainer";
import { getSession } from "../utils/session";

const screenWidth = Dimensions.get("window").width - 40;

export default function CalculadoraScreen(): JSX.Element {
  const { colors } = useTheme();
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [webUrl, setWebUrl] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await getSession("user");
        console.error("Usuario cargado:", storedUser);
        if (storedUser) {
          setUser(storedUser);
          setWebUrl(`https://carbontrackerweb.netlify.app/calculadora/${storedUser.id}`);
        }
      } catch (error) {
        console.error("Error cargando usuario:", error);
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
    width: "100%",
    height: "100%",
    borderRadius: 10,
    overflow: "hidden",
  },
  noUserContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
