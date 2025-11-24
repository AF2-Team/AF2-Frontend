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
import { useRouter } from "expo-router";

const ChooseUsernameScreen = () => {
  const [username, setUsername] = React.useState("");
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    Alegreya_400Regular_Italic,
  });

  const handleContinue = () => {
    if (username.trim()) {
      router.push("/screens/HomeScreen");
    }
  };
  const isButtonDisabled = !username.trim();

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* ScrollView centrado verticalmente */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.contentWrapper}>
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
                autoFocus={true}
              />
            </View>
          </View>
        </ScrollView>

        {/* Contenedor para el botón */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              isButtonDisabled ? styles.buttonDisabled : styles.buttonEnabled,
            ]}
            onPress={handleContinue}
            disabled={isButtonDisabled}
          >
            <Text
              style={[
                styles.buttonText,
                isButtonDisabled
                  ? styles.buttonTextDisabled
                  : styles.buttonTextEnabled,
              ]}
            >
              Continuar
            </Text>
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
    justifyContent: "space-between",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  contentWrapper: {
    alignItems: "center",
    width: "100%",
  },
  header: {
    fontFamily: "Alegreya_400Regular_Italic",
    fontSize: 35,
    textAlign: "center",
    marginBottom: 20,
    color: "#423646",
  },
  description: {
    fontSize: 17,
    textAlign: "center",
    color: "#555",
    marginBottom: 40,
    paddingHorizontal: 15,
    lineHeight: 24,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    maxWidth: 400,
    height: 50,
    borderWidth: 1,
    borderColor: "#6F6A6F",
    borderRadius: 12,
    backgroundColor: "#FAF7F7",
    paddingHorizontal: 15,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    color: "#423646",
  },
  buttonContainer: {
    padding: 20,
    paddingBottom: 30,
    backgroundColor: "#fff",
  },
  button: {
    height: 50,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  buttonEnabled: {
    backgroundColor: "#BCA1BD",
  },
  buttonDisabled: {
    backgroundColor: "#E0E0E0",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonTextEnabled: {
    color: "#423646",
  },
  buttonTextDisabled: {
    color: "#9E9E9E",
  },
});

export default ChooseUsernameScreen;
