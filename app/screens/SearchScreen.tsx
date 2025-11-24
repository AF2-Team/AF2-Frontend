import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, THEME } from "../../constants";

export default function SearchScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>🔍 Búsqueda</Text>
        <Text style={styles.subtitle}>
          Pantalla de búsqueda - En desarrollo
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: THEME.SPACING.SCREEN_HORIZONTAL,
  },
  title: {
    fontSize: THEME.TYPOGRAPHY.TITLE,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: THEME.SPACING.SM,
  },
  subtitle: {
    fontSize: THEME.TYPOGRAPHY.BODY,
    color: Colors.textMuted,
    textAlign: "center",
  },
});
