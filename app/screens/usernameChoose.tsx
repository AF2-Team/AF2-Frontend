import {
  Alegreya_400Regular_Italic,
  useFonts,
} from "@expo-google-fonts/alegreya";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ChooseUsernameScreen = () => {
  // Corregí el valor inicial para que coincida con la imagen
  const [username, setUsername] = React.useState("broken-hours");

  const [fontsLoaded] = useFonts({
    Alegreya_400Regular_Italic,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    // Usamos SafeAreaView para evitar el notch y la barra inferior
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* El contenido principal va en un ScrollView */}
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.header}>¿Cómo quieres llamarte?</Text>
          <Text style={styles.description}>
            Este será el nombre con el que te verán otros usuarios de A place
            fun for you. ¡Podrás cambiarlo cuando quieras!
          </Text>

          {/* Contenedor para el input con ícono */}
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons
              name="at"
              size={24}
              color="#6F6A6F"
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              placeholder="tu-usuario"
              placeholderTextColor="#888"
              autoCapitalize="none"
            />
          </View>
        </ScrollView>

        {/* Contenedor para el botón (fuera del ScrollView) */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Continuar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    // El 'justifyContent: space-between' empuja el scroll al inicio
    // y el botón al final.
    justifyContent: "space-between",
  },
  scrollContent: {
    padding: 20,
    alignItems: "center", // Centra el contenido
  },
  header: {
    fontFamily: "Alegreya_400Regular_Italic",
    fontSize: 35,
    textAlign: "center",
    marginBottom: 20,
    color: "#423646",
    marginTop: "15%", // Un margen superior para bajar el título
  },
  description: {
    fontSize: 17, // Ligeramente más grande para legibilidad
    textAlign: "center",
    color: "#555",
    marginBottom: 40,
    paddingHorizontal: 15,
    lineHeight: 24, // Espacio entre líneas
  },
  // Estilos para el Input con ícono
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#6F6A6F",
    borderRadius: 12,
    backgroundColor: "#FAF7F7",
    paddingHorizontal: 15, // Padding interno
  },
  icon: {
    marginRight: 10, // Espacio entre el ícono y el texto
  },
  input: {
    flex: 1, // Para que el input ocupe el resto del espacio
    height: "100%",
    fontSize: 16,
    color: "#423646",
  },

  // Contenedor del botón para "pegarlo" abajo
  buttonContainer: {
    padding: 20,
    paddingBottom: 30, // Más padding abajo por la barra de gestos
    backgroundColor: "#fff", // Fondo blanco
  },
  button: {
    backgroundColor: "#BCA1BD", // Mismo color que el botón de login
    height: 50,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginBottom: "15%", // Espacio inferior para separar del siguiente elemento
  },
  buttonText: {
    color: "#423646", // Mismo color de texto
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ChooseUsernameScreen;
