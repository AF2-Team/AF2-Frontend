import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  ImageSourcePropType,
} from "react-native";
import { useRouter } from "expo-router";
import { THEME } from "@/constants";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/screens/WelcomeScreen");
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/2.png") as ImageSourcePropType}
        style={styles.logo}
        resizeMode="contain"
      />
      
      <View style={styles.loadingDots}>
        <View style={[styles.dot, styles.dot1]} />
        <View style={[styles.dot, styles.dot2]} />
        <View style={[styles.dot, styles.dot3]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.COLORS.background,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: screenWidth * 0.6,
    height: screenWidth * 0.6,
    marginBottom: THEME.SPACING.XL * 2,
  },
  loadingDots: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: THEME.COLORS.secondary,
    marginHorizontal: THEME.SPACING.XS,
  },
  dot1: {
    opacity: 0.6,
    transform: [{ scale: 0.8 }],
  },
  dot2: {
    opacity: 0.8,
    transform: [{ scale: 1 }],
  },
  dot3: {
    opacity: 0.6,
    transform: [{ scale: 0.8 }],
  },
});
