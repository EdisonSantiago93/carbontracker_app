import React from "react";
import { StyleSheet } from "react-native";
import { Button } from "react-native-paper";

export default function SocialButton({ label, icon, color, onPress, disabled }) {
  return (
    <Button
      mode="contained"
      onPress={onPress}
      disabled={disabled}
      style={[styles.button, { backgroundColor: color || "#6200ee" }]}
      contentStyle={{ paddingVertical: 8 }}
      icon={icon}
    >
      {label}
    </Button>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    marginVertical: 8,
    borderRadius: 25,
  },
});
