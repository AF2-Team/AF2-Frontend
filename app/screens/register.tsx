import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Checkbox } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  useFonts,
  Alegreya_400Regular_Italic,
} from "@expo-google-fonts/alegreya";

const RegisterScreen = () => {
  const [passwordVisible, setPasswordVisible] = React.useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] =
    React.useState(false);
  const [errors, setErrors] = React.useState({});
  const [fontsLoaded] = useFonts({
    Alegreya_400Regular_Italic,
  });

  const [checked, setChecked] = React.useState(false);
  const [formData, setFormData] = React.useState({
    nombre: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  if (!fontsLoaded) {
    return null;
  }

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    const newErrors = {};

    if (!formData.nombre) {
      newErrors.nombre = "El nombre es obligatorio";
    }

    if (!formData.email) {
      newErrors.email = "El correo es obligatorio";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "El formato del correo no es válido";
    }

    if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      //Aqui pondremos la logica para el registro
      console.log("Formulario enviado:", formData);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}> A fun site for you</Text>

      <Text style={styles.header}> Crear una cuenta</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Nombre y Apellido</Text>
        <TextInput
          style={styles.input}
          value={formData.nombre}
          onChangeText={(text) => handleChange("nombre", text)}
          placeholder="Ej:Jhon Cenna"
          placeholderTextColor="#888"
        />
        {errors.nombre && <Text style={styles.errorText}>{errors.nombre}</Text>}
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Direccion de correo electronico</Text>
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
        <Text style={styles.label}>Contrasena</Text>
        <View>
          <TextInput
            style={styles.input}
            value={formData.password}
            onChangeText={(text) => handleChange("password", text)}
            secureTextEntry={!passwordVisible}
            placeholder="Minimo 6 caracteres"
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
        <Text style={styles.label}>Confirmar Contrasena</Text>
        <View>
          <TextInput
            style={styles.input}
            value={formData.confirmPassword}
            onChangeText={(text) => handleChange("confirmPassword", text)}
            secureTextEntry={!confirmPasswordVisible}
            placeholder="Confirmar Contraseña"
            placeholderTextColor="#888"
          />
          <TouchableOpacity
            style={styles.icon}
            onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
          >
            <MaterialCommunityIcons
              name={confirmPasswordVisible ? "eye-off" : "eye"}
              size={24}
              color="grey"
            />
          </TouchableOpacity>
        </View>
        {errors.confirmPassword && (
          <Text style={styles.errorText}>{errors.confirmPassword}</Text>
        )}
      </View>
      <View style={styles.checkboxContainer}>
        <Checkbox
          status={checked ? "checked" : "unchecked"}
          onPress={() => setChecked(!checked)}
          color="#6200EE"
        />
        <Text style={styles.checkboxLabel}>
          He leido el contrato de privacidad y terminos de uso
        </Text>
      </View>

      <View style={styles.divider} />

      <TouchableOpacity style={styles.registerButton} onPress={handleSubmit}>
        <Text style={styles.registerButtonText}>CREAR CUENTA</Text>
      </TouchableOpacity>

      <View style={styles.loginLinkContainer}>
        <Text style={styles.loginText}> Ya eres miembro?</Text>
        <TouchableOpacity>
          <Text style={styles.loginLink}> Inicia sesion ahora</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    fontFamily: "Alegreya_400Regular_Italic",
    fontSize: 35,

    // width: 225,
    height: 48,
    textAlign: "center",
    marginVertical: 20,
    color: "#423646",
    alignSelf: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#423646",
  },
  formGroup: {
    marginBottom: 20,
    color: "#423646",
    alignSelf: "center",
    width: "90%",
  },
  label: {
    fontSize: 16,
    fontWeight: "regular",
    marginBottom: 8,
    color: "#333",
    fontFamily: "Open Sans",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#6F6A6F",
    paddingHorizontal: 15,
    //paddingLeft: 16.8,
    //paddingTop: 13,
    paddingBottom: 13,
    borderRadius: 12,
    fontSize: 16,
    // width: 380,
    //position: "fixed",
    color: "#423646",
    backgroundColor: "#FAF7F7",
  },
  icon: {
    position: "absolute",
    right: 15,
    top: 13,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 14,
    color: "#423646",
    flex: 1,
  },
  //divider: {
  //  height: 1,
  //backgroundColor: "#ddd",
  //marginVertical: 20,
  //},
  registerButton: {
    backgroundColor: "#BCA1BD",
    height: 50,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,

    //marginTop: 0,
  },
  registerButtonText: {
    color: "#423646",
    fontSize: 16,
    fontWeight: "bold",
  },
  loginLinkContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: {
    marginRight: 5,
    color: "#423646",
    fontFamily: "Open Sans",
  },
  loginLink: {
    color: "#423646",
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
    marginLeft: 10,
  },
});

export default RegisterScreen;
