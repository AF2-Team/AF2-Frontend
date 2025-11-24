import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, THEME } from "../../constants";

export default function CommentScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Comentarios</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>💬 Comentarios</Text>
        <Text style={styles.subtitle}>
          Pantalla de comentarios en desarrollo
        </Text>

        {/* Agregamos un card visible */}
        <View style={styles.exampleComment}>
          <Text style={styles.commentUser}>@usuario_ejemplo</Text>
          <Text style={styles.commentText}>
            Este es un comentario de ejemplo
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.primary,
    padding: THEME.SPACING.MD,
    paddingTop: THEME.SPACING.STATUS_BAR,
  },
  headerTitle: {
    fontSize: THEME.TYPOGRAPHY.TITLE,
    color: Colors.textLight,
    fontFamily: THEME.FONTS.BOLD,
    textAlign: "center",
  },
  content: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: THEME.SPACING.SCREEN_HORIZONTAL,
    paddingTop: THEME.SPACING.XL,
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
    marginBottom: THEME.SPACING.XL,
  },
  exampleComment: {
    backgroundColor: Colors.backgroundAlt,
    padding: THEME.SPACING.MD,
    borderRadius: THEME.COMMON.BORDER_RADIUS.MD,
    borderWidth: 1,
    borderColor: Colors.border,
    width: "100%",
  },
  commentUser: {
    fontSize: THEME.TYPOGRAPHY.BODY,
    color: Colors.text,
    fontFamily: THEME.FONTS.SEMI_BOLD,
    marginBottom: THEME.SPACING.XS,
  },
  commentText: {
    fontSize: THEME.TYPOGRAPHY.BODY,
    color: Colors.text,
    fontFamily: THEME.FONTS.REGULAR,
  },
});
