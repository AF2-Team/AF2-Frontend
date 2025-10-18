import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();

  const handleRegisterPress = () => {
    router.push("../screens/register");
  };

  const handleLoginPress = () => {
    // Agregar navegación a login
    // router.push("../screens/login");
  };

  return (
    <LinearGradient
      colors={[
        "rgba(255, 255, 255, 1)",
        "rgba(188, 161, 189, 1)",
        "rgba(102, 81, 108, 1)",
        "rgba(66, 54, 70, 1)",
        "rgba(0, 0, 0, 1)",
      ]}
      locations={[0, 0.25, 0.5, 0.75, 1]}
      style={styles.container}
    >
      {/* Logo y texto principal */}
      <View style={styles.logoSection}>
        <Image
          source={require("@/assets/images/10-1.png")}
          style={styles.logoImage}
          resizeMode="contain"
        />
        <Image
          source={require("@/assets/images/a-fun-site-for-you.png")}
          style={styles.subtitleImage}
          resizeMode="contain"
        />
      </View>

      {/* Texto del eslogan */}
      <Image
        source={require("@/assets/images/tus-gustos-tus-reglas-tu-espacio.png")}
        style={styles.sloganImage}
        resizeMode="contain"
      />

      {/* Botón de registro */}
      <TouchableOpacity 
        style={styles.registerButton} 
        onPress={handleRegisterPress}
        activeOpacity={0.8}
      >
        <View style={styles.buttonContainer}>
          <Image
            source={require("@/assets/images/reg-strate-con-tu-correo.png")}
            style={styles.registerButtonText}
            resizeMode="contain"
          />
        </View>
      </TouchableOpacity>

      {/* Sección de login */}
      <View style={styles.loginSection}>
        <Text style={styles.memberText}>Ya eres miembro?</Text>
        <TouchableOpacity onPress={handleLoginPress} activeOpacity={0.7}>
          <Text style={styles.loginText}>Inicia sesión</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: screenWidth,
    minHeight: screenHeight,
    borderRadius: 50,
    overflow: 'hidden',
    position: 'relative',
  },
  logoSection: {
    position: 'absolute',
    top: 116,
    left: 33,
    width: 332,
    height: 212,
  },
  logoImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 160,
    height: 212,
  },
  subtitleImage: {
    position: 'absolute',
    top: 135,
    left: 113,
    width: 216,
    height: 29,
  },
  sloganImage: {
    position: 'absolute',
    top: 378,
    left: 125,
    width: 156,
    height: 143,
  },
  registerButton: {
    position: 'absolute',
    top: 636,
    left: 47,
    width: 321,
    height: 50,
  },
  buttonContainer: {
    backgroundColor: '#8a2be2',
    borderRadius: 30,
    height: 50,
    width: 319,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  registerButtonText: {
    width: 213,
    height: 14,
  },
  loginSection: {
    position: 'absolute',
    top: 737,
    left: 134,
    alignItems: 'center',
  },
  memberText: {
    color: '#fff',
    fontFamily: 'Open Sans',
    fontSize: 15,
    fontWeight: '400',
    textAlign: 'center',
    width: 131,
    marginBottom: 8,
  },
  loginText: {
    color: '#fff',
    fontFamily: 'Open Sans',
    fontSize: 15,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});