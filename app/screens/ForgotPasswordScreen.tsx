import {
  Alegreya_400Regular_Italic,
  useFonts,
} from "@expo-google-fonts/alegreya";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Logo from "../../assets/images/logotipo.svg"; // Ajusta la ruta si es necesario

const ForgotPasswordScreen = () => {
  // Estado para controlar qué paso del formulario mostrar
  const [step, setStep] = React.useState(1);

  const [email, setEmail] = React.useState("aliriofreytez25@gmail.com");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  // Estados separados para la visibilidad de cada campo
  const [passwordVisible, setPasswordVisible] = React.useState(false);
  const [confirmVisible, setConfirmVisible] = React.useState(false);

  const [errors, setErrors] = React.useState({});
  const [fontsLoaded] = useFonts({
    Alegreya_400Regular_Italic,
  });

  if (!fontsLoaded) {
    return null;
  }

  // Lógica para el botón "Continuar"
  const handleContinue = () => {
    let newErrors = {};

    if (step === 1) {
      // --- Lógica del Paso 1: Validar Correo ---
      if (!email) {
        newErrors.email = "El correo es obligatorio";
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        newErrors.email = "El formato del correo no es válido";
      }

      setErrors(newErrors);

      if (Object.keys(newErrors).length === 0) {
        // Simulación: si el correo es válido, pasa al paso 2
        console.log("Correo enviado:", email);
        setStep(2); // Avanza al siguiente paso
      }
    } else {
      // --- Lógica del Paso 2: Validar Contraseñas ---
      if (password.length < 8) {
        newErrors.password = "La contraseña debe tener al menos 8 caracteres";
      }
      if (password !== confirmPassword) {
        newErrors.confirmPassword = "Las contraseñas no coinciden";
      }

      setErrors(newErrors);

      if (Object.keys(newErrors).length === 0) {
        // Simulación: si todo es válido, se actualiza y se navega
        Alert.alert(
          "Contraseña Actualizada",
          "Tu contraseña ha sido cambiada con éxito.",
        );
        // Aquí iría la lógica para navegar de vuelta al Login
        // navigation.navigate('Login');
      }
    }
  };

  // Función para renderizar el contenido del paso 1 (Correo)
  const renderStepOne = () => (
    <View style={styles.formGroup}>
      <Text style={styles.label}>Dirección de correo</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholder="correo@dominio.com"
        placeholderTextColor="#888"
      />
      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
    </View>
  );

  // Función para renderizar el contenido del paso 2 (Contraseñas)
  const renderStepTwo = () => (
    <>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Contraseña nueva</Text>
        <View>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!passwordVisible}
            placeholder="Mínimo 8 caracteres"
            placeholderTextColor="#888"
          />
          <TouchableOpacity
            style={styles.icon}
            onPress={() => setPasswordVisible(!passwordVisible)}
          >
            <MaterialCommunityIcons
              name={passwordVisible ? "eye-off" : "eye"}
              size={24}
              color="grey"
            />
          </TouchableOpacity>
        </View>
        {errors.password && (
          <Text style={styles.errorText}>{errors.password}</Text>
        )}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Confirmar contraseña nueva</Text>
        <View>
          <TextInput
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!confirmVisible}
            placeholder="Mínimo 8 caracteres"
            placeholderTextColor="#888"
          />
          <TouchableOpacity
            style={styles.icon}
            onPress={() => setConfirmVisible(!confirmVisible)}
          >
            <MaterialCommunityIcons
              name={confirmVisible ? "eye-off" : "eye"}
              size={24}
              color="grey"
            />
          </TouchableOpacity>
        </View>
        {errors.confirmPassword && (
          <Text style={styles.errorText}>{errors.confirmPassword}</Text>
        )}
      </View>
    </>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Logo style={styles.logo} />
          <Text style={styles.header}>Recuperar contraseña</Text>

          {/* Renderizado condicional del formulario */}
          {step === 1 ? renderStepOne() : renderStepTwo()}
        </ScrollView>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleContinue}>
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
    justifyContent: "space-between", // Empuja el botón hacia abajo
  },
  scrollContent: {
    padding: 20,
    alignItems: "center", // Centra el logo y el header
  },
  logo: {
    width: "80%",
    height: 100,
    alignSelf: "center",
    marginBottom: 5,
  },
  header: {
    fontFamily: "Alegreya_400Regular_Italic",
    fontSize: 35,
    textAlign: "center",
    marginBottom: 30, // Más espacio para los campos
    color: "#423646",
  },
  // Estilos de formulario (reutilizados de LoginScreen)
  formGroup: {
    marginBottom: 20,
    width: "100%",
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: "#333",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#6F6A6F",
    paddingHorizontal: 15,
    borderRadius: 12,
    fontSize: 16,
    color: "#423646",
    backgroundColor: "#FAF7F7",
  },
  icon: {
    position: "absolute",
    right: 15,
    top: 13,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
    marginLeft: 10,
  },
  // Estilos del botón (reutilizados de ChooseUsernameScreen)
  buttonContainer: {
    padding: 20,
    paddingBottom: 30,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#BCA1BD",
    height: 50,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginBottom: "15%",
  },
  buttonText: {
    color: "#423646",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ForgotPasswordScreen;
