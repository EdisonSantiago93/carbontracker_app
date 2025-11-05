// src/components/AppHeader.tsx
import React from "react";
import { StyleSheet, StatusBar } from "react-native";
import { Appbar, useTheme } from "react-native-paper";

interface AppHeaderProps {
  title: string;
}

export default function AppHeader({ title }: AppHeaderProps): JSX.Element {
  const { colors } = useTheme();

  return (
    <>
      {/* StatusBar */}
      <StatusBar
        barStyle="light-content" // texto e iconos blancos
        backgroundColor={colors.primary} // mismo color del header
      />
      
      <Appbar.Header style={[styles.header, { backgroundColor: colors.primary }]}>
        <Appbar.Content
          title={title}
          titleStyle={styles.title}
        />
      </Appbar.Header>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 30,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  title: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
    textAlign: "center",
  },
});
