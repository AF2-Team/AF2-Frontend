import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Logo from "../assets/images/logo-land.svg";
import Land2 from "../assets/images/land2.svg";
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function WelcomeScreen() {
  const router = useRouter();

  const handleRegisterPress = () => {
    router.push("/screens/register");
  };

  const handleLoginPress = () => {
    router.push("../screens/login");
  };

  return (
    <LinearGradient
      colors={[
        "rgba(255, 255, 255, 1) 0%",
        "rgba(188, 161, 189, 1) 25%",
        "rgba(102, 81, 108, 1) 50%",
        "rgba(66, 54, 70, 1) 75%",
        "rgba(0, 0, 0, 1) 100%",
      ]}
      locations={[0, 0.25, 0.5, 0.75, 1]}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Logo y texto principal */}
        <View style={styles.logoSection}>
          <Logo style={styles.logo} />
          <Land2 style={styles.land2} />
        </View>

        {/* Botón de registro */}
        <TouchableOpacity
          style={styles.registerButton}
          onPress={handleRegisterPress}
        >
          <Text style={styles.buttonText}>REGRISTRATE AHORA CON TU CORREO</Text>
        </TouchableOpacity>

        {/* Sección de login */}
        <View style={styles.loginSection}>
          <Text style={styles.memberText}>¿Ya eres miembro?</Text>
          <TouchableOpacity onPress={handleLoginPress} activeOpacity={0.7}>
            <Text style={styles.loginText}>Inicia sesión ahora</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: screenWidth,
    minHeight: screenHeight,
    borderRadius: 30,
    overflow: "hidden",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logoSection: {
    alignItems: "center",
    width: 332,
  },
  logo: {
    marginTop: -20,
    width: "60%",
  },
  land2: {
    marginTop: 50,
    marginBottom: 20,
  },
  registerButton: {
    marginTop: 50,
    backgroundColor: "#bca1bd",
    borderRadius: 30,
    height: 50,
    width: 319,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  buttonText: {
    color: "#423646",
    fontFamily: "Open Sans",
    fontSize: 14,
    fontWeight: "bold",
  },
  loginSection: {
    alignItems: "center",
    marginTop: 37,
  },
  memberText: {
    color: "#fff",
    fontFamily: "Open Sans",
    fontSize: 15,
    fontWeight: "400",
    textAlign: "center",
    width: 131,
    marginBottom: 8,
  },
  loginText: {
    color: "#fff",
    fontFamily: "Open Sans",
    fontSize: 15,
    fontWeight: "700",
    textDecorationLine: "underline",
  },
});
