import { THEME } from "@/constants";
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

  const handleChange: IHandleChange = (name, value) =>
    setFormData({ ...formData, [name]: value });

  const handleLogin = () => {
    const newErrors: IFormField = {};

    if (!formData.email) newErrors.email = "El correo es obligatorio";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "El formato del correo no es válido";

    if (!formData.password) newErrors.password = "La contraseña es obligatoria";
    else if (formData.password.length < 8) newErrors.password = "La contraseña debe tener al menos 8 caracteres";


    Alert.alert("Inicio de Sesión Exitoso", `Bienvenido, ${formData.email}`);
    console.log("Formulario enviado:", formData);
    router.push("/screens/HomeScreen");
  };

  const isFormEmpty = formData.email == null || formData.email.trim() === "" || formData.password == null || formData.password.trim() === "";

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* ENCABEZADO PRINCIPAL SIN LOGO */}
      <View style={styles.headerSection}>
        <Text style={styles.brandTitle}>A fun site for you</Text>
        <Text style={styles.screenTitle}>Iniciar sesión</Text>
      </View>

      {/* FORMULARIO */}
      <View style={styles.formSection}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Dirección de correo</Text>
          <TextInput
            style={styles.input}
            value={formData.email}
            onChangeText={(text) => handleChange("email", text)}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="correo@dominio.com"
            placeholderTextColor={THEME.COLORS.textPlaceholder}
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
              placeholderTextColor={THEME.COLORS.textPlaceholder}
            />
            <TouchableOpacity
              style={styles.icon}
              onPress={() => setPasswordVisible(!passwordVisible)}
            >
              <MaterialCommunityIcons
                name={passwordVisible ? "eye-off" : "eye"}
                size={24}
                color={THEME.COLORS.textMuted}
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

        {/* --- BOTÓN INICIAR SESIÓN CON VALIDACIÓN --- */}
        <TouchableOpacity
          style={[
            styles.loginButton,
            isFormEmpty && styles.loginButtonDisabled,
          ]}
          onPress={handleLogin}
          disabled={isFormEmpty && false}
        >
          <Text
            style={[
              styles.loginButtonText,
              isFormEmpty && styles.loginButtonTextDisabled,
            ]}
          >
            INICIAR SESIÓN
          </Text>
        </TouchableOpacity>

        {/* --- SECCIÓN INFERIOR INTEGRADA --- */}
        <View style={styles.bottomSection}>
          {/* --- DIVISOR 'NUEVO EN AF2' --- */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>¿Nuevo en Af2?</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* --- BOTÓN NEGRO CREAR CUENTA --- */}
          <TouchableOpacity
            style={styles.createAccountButton}
            onPress={() => router.push("/screens/RegisterScreen")}
          >
            <Text style={styles.createAccountButtonText}>
              Crear una cuenta ahora
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: THEME.SPACING.SCREEN_HORIZONTAL,
    backgroundColor: THEME.COLORS.background,
  },
  headerSection: {
    alignItems: "center",
    marginTop: THEME.SPACING.XL * 2.5,
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
    fontSize: THEME.TYPOGRAPHY.TITLE + 2,
    color: THEME.COLORS.text,
    textAlign: "center",
  },
  formSection: {
    flex: 1,
    justifyContent: "center",
  },
  formGroup: {
    marginBottom: THEME.SPACING.LG,
    width: "100%",
  },
  label: {
    fontSize: THEME.TYPOGRAPHY.BODY,
    marginBottom: THEME.SPACING.SM,
    color: THEME.COLORS.text,
    fontFamily: THEME.FONTS.REGULAR,
  },
  input: {
    height: THEME.SPACING.INPUT_HEIGHT,
    borderWidth: 1,
    borderColor: THEME.COLORS.borderInput,
    paddingHorizontal: THEME.SPACING.MD,
    borderRadius: THEME.COMMON.BORDER_RADIUS.MD,
    fontSize: THEME.TYPOGRAPHY.BODY,
    color: THEME.COLORS.text,
    backgroundColor: THEME.COLORS.backgroundAlt,
    paddingRight: THEME.SPACING.XL * 2,
  },
  icon: {
    position: "absolute",
    right: THEME.SPACING.MD,
    top: (THEME.SPACING.INPUT_HEIGHT - 24) / 2,
  },
  forgotPasswordContainer: {
    width: "100%",
    alignItems: "flex-start",
    marginBottom: THEME.SPACING.XL,
    paddingLeft: THEME.SPACING.XS,
  },
  forgotPasswordText: {
    fontFamily: THEME.FONTS.REGULAR,
    fontSize: THEME.TYPOGRAPHY.BODY,
    color: THEME.COLORS.text,
    fontWeight: "bold",
  },
  loginButton: {
    backgroundColor: THEME.COLORS.secondary,
    height: THEME.SPACING.BUTTON_HEIGHT,
    borderRadius: THEME.COMMON.BORDER_RADIUS.XL,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginBottom: THEME.SPACING.XL,
    ...THEME.COMMON.SHADOWS.MEDIUM,
  },
  loginButtonDisabled: {
    backgroundColor: THEME.COLORS.grayLight,
    ...THEME.COMMON.SHADOWS.SMALL,
  },
  loginButtonText: {
    color: THEME.COLORS.text,
    fontSize: THEME.TYPOGRAPHY.BODY,
    fontFamily: THEME.FONTS.BOLD,
  },
  loginButtonTextDisabled: {
    color: THEME.COLORS.grayMedium,
  },
  bottomSection: {
    marginTop: THEME.SPACING.MD,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: THEME.SPACING.LG,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: THEME.COLORS.black,
  },
  dividerText: {
    marginHorizontal: THEME.SPACING.MD,
    color: THEME.COLORS.text,
    fontSize: THEME.TYPOGRAPHY.BODY,
    fontFamily: THEME.FONTS.REGULAR,
  },
  createAccountButton: {
    backgroundColor: THEME.COLORS.black,
    height: THEME.SPACING.BUTTON_HEIGHT,
    borderRadius: THEME.COMMON.BORDER_RADIUS.XL,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    ...THEME.COMMON.SHADOWS.MEDIUM,
  },
  createAccountButtonText: {
    color: THEME.COLORS.textLight,
    fontSize: THEME.TYPOGRAPHY.BODY,
    fontFamily: THEME.FONTS.BOLD,
  },
  errorText: {
    color: THEME.COLORS.error,
    fontSize: THEME.TYPOGRAPHY.SMALL,
    marginTop: THEME.SPACING.XS,
    marginLeft: THEME.SPACING.SM,
    fontFamily: THEME.FONTS.REGULAR,
  },
});

export default LoginScreen;
