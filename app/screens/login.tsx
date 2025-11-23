import {
  Alegreya_400Regular_Italic,
  useFonts,
} from "@expo-google-fonts/alegreya";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
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
import Logo from "../../assets/images/logotipo.svg";

interface IHandleChange {
  (name: string, value: any): void;
}
interface IFormField {
  email?: string;
  password?: string;
}

const LoginScreen = () => {
  const router = useRouter();
  const [passwordVisible, setPasswordVisible] = React.useState(false);
  const [errors, setErrors] = React.useState<IFormField>({});
  const [fontsLoaded] = useFonts({
    Alegreya_400Regular_Italic,
  });
  const [formData, setFormData] = React.useState<IFormField>({
    email: "",
    password: "",
  });

  if (!fontsLoaded) return null;

  const handleChange: IHandleChange = (name, value) => (setFormData({ ...formData, [name]: value }));

  const handleLogin = () => {
    const newErrors: IFormField = {};

    if (!formData.email)
      newErrors.email = "El correo es obligatorio";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "El formato del correo no es válido";
    if (formData.password && formData.password.length < 8)
      newErrors.password = "La contraseña debe tener al menos 8 caracteres";

    //if (Object.keys(newErrors).length > 0) return setErrors(newErrors);
    
    Alert.alert("Inicio de Sesión Exitoso", `Bienvenido, ${formData.email}`);
    console.log("Formulario enviado:", formData);
    
    router.push("/screens/HomeScreen")
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Logo style={styles.logo} />
      <Text style={styles.header}>Iniciar sesión</Text>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Dirección de correo</Text>
        <TextInput
          style={styles.input}
          value={formData.email}
          onChangeText={(text) => handleChange("email", text)}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="correo@dominio.com"
          placeholderTextColor="#888"
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}        
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Contraseña</Text>
        <View>
          <TextInput
            style={styles.input}
            value={formData.password}
            onChangeText={(text) => handleChange("password", text)}
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

      {/* --- ENLACE OLVIDÉ CONTRASEÑA --- */}
      <TouchableOpacity style={styles.forgotPasswordContainer}>
        <Text style={styles.forgotPasswordText}>
          ¿Has olvidado tu contraseña?
        </Text>
      </TouchableOpacity>

      {/* --- BOTÓN INICIAR SESIÓN --- */}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>INICIAR SESIÓN</Text>
      </TouchableOpacity>

      {/* --- DIVISOR 'NUEVO EN AF2' --- */}
      <View style={styles.dividerContainer}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>¿Nuevo en Af2?</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* --- BOTÓN NEGRO CREAR CUENTA --- */}
      <TouchableOpacity style={styles.createAccountButton}>
        <Text style={styles.createAccountButtonText}>
          Crear una cuenta ahora
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    fontFamily: "Alegreya_400Regular_Italic",
    fontSize: 35,
    textAlign: "center",
    marginBottom: 30,
    color: "#423646",
  },
  logo: {
    width: "80%", // Ajustado para que se vea bien
    height: 100,
    alignSelf: "center",
    marginBottom: 5, // Reducido para que "A fun site for you" (del SVG) quede más cerca
  },
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
    backgroundColor: "#FAF7F7", // Un fondo ligero como en la imagen
  },
  icon: {
    position: "absolute",
    right: 15,
    top: 13,
  },
  forgotPasswordContainer: {
    width: "100%",
    alignItems: "flex-start", // Alineado a la izquierda como el label
    marginBottom: 25,
    paddingLeft: 5, // Pequeño padding
  },
  forgotPasswordText: {
    fontFamily: "Open Sans", // Usando la fuente cargada
    fontSize: 14,
    fontWeight: "bold",
    color: "#423646",
    textShadowColor: "rgba(0, 0, 0, 0.25)",
    textShadowOffset: { width: 5, height: 6 },
    textShadowRadius: 3.5,
    textAlign: "center",
  },
  loginButton: {
    backgroundColor: "#BCA1BD",
    height: 50,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    // Se quitó marginTop para dárselo al 'forgotPassword'
  },
  loginButtonText: {
    color: "#423646",
    fontSize: 16,
    fontWeight: "bold",
  },

  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginTop: 30, // Espacio después del botón de login
    marginBottom: 20, // Espacio antes del botón de crear cuenta
  },
  dividerLine: {
    flex: 1, // Para que ocupe el espacio restante
    height: 1,
    backgroundColor: "#000", // Línea negra como en la imagen
  },
  dividerText: {
    // NUEVO
    marginHorizontal: 10, // Espacio entre el texto y las líneas
    color: "#423646",
    fontSize: 16,
  },
  createAccountButton: {
    // NUEVO
    backgroundColor: "#000", // Fondo negro
    height: 50,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  createAccountButtonText: {
    // NUEVO
    color: "#fff", // Texto blanco
    fontSize: 16,
    fontWeight: "bold",
  },

  // --- Estilos de error (sin cambios) ---
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
    marginLeft: 10,
  },
});

export default LoginScreen;
