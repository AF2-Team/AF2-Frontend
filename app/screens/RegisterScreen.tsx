import { ThemedTextInput } from "@/components/ThemedTextInput";
import { THEME } from "@/constants";
import {
  Alegreya_400Regular_Italic,
  useFonts,
} from "@expo-google-fonts/alegreya";
import { useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { height: screenHeight } = Dimensions.get("window");

interface RegisterErrors {
  nombre?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

interface FormData {
  nombre: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterScreen = () => {
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    Alegreya_400Regular_Italic,
  });

  const [touched, setTouched] = React.useState<{ [key: string]: boolean }>({});

  const [formData, setFormData] = React.useState<FormData>({
    nombre: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = React.useState<RegisterErrors>({});

  if (!fontsLoaded) {
    return null;
  }

  const handleChange = (name: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof RegisterErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateField = (name: keyof FormData, value: string) => {
    const newErrors: RegisterErrors = { ...errors };

    switch (name) {
      case "nombre":
        if (!value.trim()) {
          newErrors.nombre = "El nombre es obligatorio";
        } else {
          delete newErrors.nombre;
        }
        break;

      case "email":
        if (!value.trim()) {
          newErrors.email = "El correo es obligatorio";
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          newErrors.email = "El formato del correo no es válido";
        } else {
          delete newErrors.email;
        }
        break;

      case "password":
        if (value.length > 0 && value.length < 6) {
          newErrors.password = "La contraseña debe tener al menos 6 caracteres";
        } else {
          delete newErrors.password;
        }
        if (formData.confirmPassword && formData.confirmPassword !== value) {
          newErrors.confirmPassword = "Las contraseñas no coinciden";
        } else if (name === "password" && newErrors.confirmPassword) {
          delete newErrors.confirmPassword;
        }
        break;

      case "confirmPassword":
        if (value !== formData.password) {
          newErrors.confirmPassword = "Las contraseñas no coinciden";
        } else {
          delete newErrors.confirmPassword;
        }
        break;
    }

    setErrors(newErrors);
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const validateForm = (): boolean => {
    const newErrors: RegisterErrors = {};

    if (!formData.nombre.trim()) newErrors.nombre = "El nombre es obligatorio";
    if (!formData.email.trim()) {
      newErrors.email = "El correo es obligatorio";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "El formato del correo no es válido";
    }
    if (formData.password.length < 6)
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Las contraseñas no coinciden";

    setErrors(newErrors);
    setTouched({
      nombre: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      //console.log("Usuario registrado:", formData);
      router.push("/screens/usernameChoose");
    }
  };

  const isFormEmpty =
    !formData.nombre.trim() ||
    !formData.email.trim() ||
    !formData.password.trim() ||
    !formData.confirmPassword.trim();

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : -100}
    >
      {/* ENCABEZADO PRINCIPAL */}
      <View style={styles.headerSection}>
        <Text style={styles.brandTitle}>A fun site for you</Text>
        <Text style={styles.screenTitle}>Crear una cuenta</Text>
      </View>

      {/* FORMULARIO COMPACTO */}
      <View style={styles.formSection}>
        <View style={styles.inputSpacing}>
          <ThemedTextInput
            label="Nombre y Apellido"
            value={formData.nombre}
            onChangeText={(text) => handleChange("nombre", text)}
            placeholder="Ej: John Cena"
            onBlur={() => validateField("nombre", formData.nombre)}
            error={touched.nombre ? errors.nombre : undefined}
            autoCapitalize="words"
          />
        </View>

        <View style={styles.inputSpacing}>
          <ThemedTextInput
            label="Dirección de correo electrónico"
            value={formData.email}
            onChangeText={(text) => handleChange("email", text)}
            placeholder="correo@dominio.com"
            keyboardType="email-address"
            onBlur={() => validateField("email", formData.email)}
            error={touched.email ? errors.email : undefined}
          />
        </View>

        <View style={styles.inputSpacing}>
          <ThemedTextInput
            label="Contraseña"
            value={formData.password}
            onChangeText={(text) => handleChange("password", text)}
            placeholder="Mínimo 6 caracteres"
            secureTextEntry={true}
            showPasswordToggle={true}
            onBlur={() => validateField("password", formData.password)}
            error={touched.password ? errors.password : undefined}
          />
        </View>

        <View>
          <ThemedTextInput
            label="Confirmar Contraseña"
            value={formData.confirmPassword}
            onChangeText={(text) => handleChange("confirmPassword", text)}
            placeholder="Confirmar Contraseña"
            secureTextEntry={true}
            showPasswordToggle={true}
            onBlur={() =>
              validateField("confirmPassword", formData.confirmPassword)
            }
            error={touched.confirmPassword ? errors.confirmPassword : undefined}
          />
        </View>
      </View>

      {/* SECCIÓN INFERIOR CON MÁRGEN ADECUADO */}
      <View style={styles.bottomSection}>
        <View style={styles.divider} />

        <TouchableOpacity
          style={[
            styles.registerButton,
            isFormEmpty && styles.registerButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={isFormEmpty}
        >
          <Text
            style={[
              styles.registerButtonText,
              isFormEmpty && styles.registerButtonTextDisabled,
            ]}
          >
            CREAR TU CUENTA
          </Text>
        </TouchableOpacity>

        <View style={styles.loginLinkContainer}>
          <Text style={styles.loginText}>¿Ya eres miembro?</Text>
          <TouchableOpacity onPress={() => router.push("/screens/LoginScreen")}>
            <Text style={styles.loginLink}>Inicia sesión ahora</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.COLORS.background,
    paddingHorizontal: THEME.SPACING.SCREEN_HORIZONTAL,
  },
  headerSection: {
    alignItems: "center",
    marginTop: screenHeight * 0.08,
    marginBottom: THEME.SPACING.XL,
  },
  brandTitle: {
    fontFamily: THEME.FONTS.TITLE_SERIF,
    fontSize: THEME.TYPOGRAPHY.HEADER + 4,
    color: THEME.COLORS.text,
    textAlign: "center",
    marginBottom: THEME.SPACING.SM,
  },
  screenTitle: {
    fontFamily: THEME.FONTS.TITLE_SERIF,
    fontSize: THEME.TYPOGRAPHY.TITLE,
    color: THEME.COLORS.text,
    textAlign: "center",
  },
  formSection: {
    flex: 1,
    justifyContent: "flex-start",
    paddingTop: THEME.SPACING.MD,
  },
  inputSpacing: {
    marginBottom: THEME.SPACING.MD,
  },
  bottomSection: {
    marginBottom: THEME.SPACING.XL * 1.5,
    paddingTop: THEME.SPACING.MD,
  },
  divider: {
    height: 1,
    backgroundColor: THEME.COLORS.border,
    marginBottom: THEME.SPACING.LG,
    width: "100%",
  },
  registerButton: {
    backgroundColor: THEME.COLORS.secondary,
    height: THEME.SPACING.BUTTON_HEIGHT,
    borderRadius: THEME.COMMON.BORDER_RADIUS.XL,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginBottom: THEME.SPACING.LG,
    ...THEME.COMMON.SHADOWS.MEDIUM,
  },
  registerButtonDisabled: {
    backgroundColor: THEME.COLORS.grayLight,
    ...THEME.COMMON.SHADOWS.SMALL,
  },
  registerButtonText: {
    color: THEME.COLORS.text,
    fontSize: THEME.TYPOGRAPHY.BODY,
    fontFamily: THEME.FONTS.BOLD,
  },
  registerButtonTextDisabled: {
    color: THEME.COLORS.grayMedium,
  },
  loginLinkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: {
    marginRight: THEME.SPACING.XS,
    color: THEME.COLORS.text,
    fontFamily: THEME.FONTS.REGULAR,
    fontSize: THEME.TYPOGRAPHY.BODY,
  },
  loginLink: {
    color: THEME.COLORS.action,
    fontFamily: THEME.FONTS.BOLD,
    fontSize: THEME.TYPOGRAPHY.BODY,
  },
});

export default RegisterScreen;
